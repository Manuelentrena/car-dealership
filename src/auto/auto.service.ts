import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { AutoImage } from 'database/entities/auto-image.entity';
import { Auto } from 'database/entities/auto.entity';
import { PAGINATION_DEFAULTS } from 'src/common/config/pagination.config';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { AuthUser } from 'src/common/interface/auth-user.interface';
import { PaginationResponse } from 'src/common/interface/pagination.interface';
import { isSLUG } from 'src/common/utils/utils';
import { FilesService } from 'src/files/files.service';
import { QueryRunner, Repository } from 'typeorm';
import { CreateAutoDto } from './dto/create-auto.dto';
import { UpdateAutoDto } from './dto/update-auto.dto';

@Injectable()
export class AutoService {
  constructor(
    @InjectRepository(Auto)
    private readonly autoRepository: Repository<Auto>,
    @InjectRepository(AutoImage)
    private readonly autoImageRepository: Repository<AutoImage>,
    private readonly filesService: FilesService,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
    user: AuthUser,
  ): Promise<PaginationResponse<Auto>> {
    const {
      page = PAGINATION_DEFAULTS.page,
      limit = PAGINATION_DEFAULTS.limit,
    } = paginationDto;

    const [data, total] = await this.autoRepository.findAndCount({
      where: { user: { id: user.id } },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['images'],
    });

    return {
      data: data.map((auto) => ({
        ...auto,
        images: this.transformImages(auto.images),
      })) as unknown as Auto[],
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(term: string): Promise<Auto> {
    let auto: Auto = null;

    if (isUUID(term)) {
      auto = await this.autoRepository.findOne({
        where: { id: term },
        relations: ['images'],
      });
    }

    if (!auto && isSLUG(term)) {
      auto = await this.autoRepository.findOne({
        where: { slug: term },
        relations: ['images'],
      });
    }

    if (!auto) {
      throw new NotFoundException(`🚗 Auto with term ${term} not found`);
    }

    return {
      ...auto,
      images: this.transformImages(auto.images),
    } as Auto;
  }

  async create(
    createAutoDto: CreateAutoDto,
    user: AuthUser,
  ): Promise<{ message: string; auto: Auto }> {
    const queryRunner =
      this.autoRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const autoExists = await this.checkIfAutoExists(createAutoDto);
      if (autoExists) {
        throw new ConflictException(
          `A auto with brand ${autoExists.brand}, model ${autoExists.model} and year ${autoExists.year} already exists.`,
        );
      }

      const { images, isPublicImages, ...autoDetails } = createAutoDto;

      // Crear el auto
      const newAuto = await this.createAuto(autoDetails, user, queryRunner);

      // Crear las imágenes
      let newImages: AutoImage[] = [];
      if (images && images.length > 0) {
        newImages = await this.createImages(
          images,
          newAuto,
          isPublicImages,
          queryRunner,
        );
      }

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      const imagesWithoutAuto = this.transformImages(newImages);

      return {
        message: '🚗 Auto created successfully',
        auto: { ...newAuto, images: imagesWithoutAuto } as Auto,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create auto: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateAutoDto: UpdateAutoDto,
  ): Promise<{ message: string; auto: Auto }> {
    const queryRunner =
      this.autoRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const {
        images: newImages,
        isPublicImages,
        ...newDetails
      } = updateAutoDto;

      const oldAuto = await this.findOne(id);

      // Actualizar las imagenes
      if (newImages && newImages.length > 0) {
        await this.deletePreviousImages(oldAuto, queryRunner);
        const savedImages = await this.createImages(
          newImages,
          oldAuto,
          isPublicImages,
          queryRunner,
        );
        oldAuto.images = savedImages;
      }

      // Actualizar el auto
      const newAuto = await this.updateAuto(oldAuto, newDetails, queryRunner);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      const imagesWithoutAuto = this.transformImages(newAuto.images);

      return {
        message: '🚗 Auto updated successfully',
        auto: { ...newAuto, images: imagesWithoutAuto } as Auto,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to create auto: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string; auto: Auto }> {
    const queryRunner =
      this.autoRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const deletedAuto = await this.findOne(id);

      await this.deletePreviousImages(deletedAuto, queryRunner);
      await this.deleteAuto(deletedAuto, queryRunner);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return {
        message: '🚗 Auto deleted successfully',
        auto: { ...deletedAuto, id } as Auto,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Failed to remove auto: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async createImages(
    images: Express.Multer.File[],
    newAuto: Auto,
    isPublicImages: boolean[] = [],
    queryRunner: QueryRunner,
  ): Promise<AutoImage[]> {
    // Save in the cloud
    const infoImagesFromProvider = await Promise.all(
      images.map((image, i) =>
        this.filesService.uploadFile(image, isPublicImages[i] ?? false),
      ),
    );

    // Save in the database
    const imagesToSave = infoImagesFromProvider.map((info, i) =>
      this.autoImageRepository.create({
        id: info.id,
        url: info.url,
        isPublic: isPublicImages[i] ?? false,
        auto: newAuto,
      }),
    );

    await queryRunner.manager.save(imagesToSave);
    return imagesToSave;
  }

  async deletePreviousImages(
    auto: Auto,
    queryRunner: QueryRunner,
  ): Promise<void> {
    if (!auto.images || auto.images.length === 0) {
      return;
    }

    // Delete in the cloud
    await Promise.all(
      auto.images.map((image) => this.filesService.deleteFile(image)),
    );

    // Delete in the database
    await queryRunner.manager.remove(auto.images);
  }

  async createAuto(
    autoDetails: Omit<CreateAutoDto, 'images'>,
    user: AuthUser,
    queryRunner: QueryRunner,
  ): Promise<Auto> {
    const newAuto = this.autoRepository.create({
      ...autoDetails,
      user,
    });

    await queryRunner.manager.save(newAuto);
    return newAuto;
  }

  async updateAuto(
    oldAuto: Auto,
    newDetails: Omit<UpdateAutoDto, 'images'>,
    queryRunner: QueryRunner,
  ): Promise<Auto> {
    Object.assign(oldAuto, newDetails);
    await queryRunner.manager.save(oldAuto);
    return oldAuto as Auto;
  }

  async deleteAuto(auto: Auto, queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.remove(Auto, auto);
  }

  async checkIfAutoExists(createAutoDto: CreateAutoDto): Promise<Auto | null> {
    return await this.autoRepository.findOneBy({
      brand: createAutoDto.brand,
      model: createAutoDto.model,
      year: createAutoDto.year,
    });
  }

  private transformImages(images: AutoImage[]): Partial<AutoImage>[] {
    return images.map((image) => {
      const imageUrl = image.isPublic
        ? image.url
        : this.filesService.generateSignedUrl(image.id);

      const { auto: _, ...imageWithoutAuto } = image;

      return { ...imageWithoutAuto, url: imageUrl };
    });
  }
}
