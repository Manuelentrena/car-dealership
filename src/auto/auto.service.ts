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
import { PaginationResponse } from 'src/common/interface/pagination.interface';
import { isSLUG } from 'src/common/utils/utils';
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
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Auto>> {
    const {
      page = PAGINATION_DEFAULTS.page,
      limit = PAGINATION_DEFAULTS.limit,
    } = paginationDto;

    const [data, total] = await this.autoRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(term: string): Promise<Auto> {
    let auto: Auto = null;

    if (isUUID(term)) {
      auto = await this.autoRepository.findOneBy({ id: term });
    }

    if (!auto && isSLUG(term)) {
      auto = await this.autoRepository.findOneBy({ slug: term });
    }

    if (!auto) {
      throw new NotFoundException(`🚗 Auto with term ${term} not found`);
    }

    return auto;
  }

  async create(
    createAutoDto: CreateAutoDto,
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

      const { images, ...autoDetails } = createAutoDto;

      // Crear el auto
      const newAuto = await this.createAuto(autoDetails, queryRunner);

      // Crear las imágenes
      let newImages: AutoImage[] = [];
      if (images && images.length > 0) {
        newImages = await this.createImages(images, newAuto, queryRunner);
      }

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      const imagesWithoutAuto = newImages.map((image) => {
        const { auto: _, ...imageWithoutAuto } = image;
        return imageWithoutAuto;
      });

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
  ): Promise<{ message: string; auto: any }> {
    const queryRunner =
      this.autoRepository.manager.connection.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const { images: newImages, ...newDetails } = updateAutoDto;

      const oldAuto = await this.findOne(id);

      // Actualizar las imagenes
      if (newImages && newImages.length > 0) {
        await this.deletePreviousImages(oldAuto, queryRunner);
        const savedImages = await this.createImages(
          newImages,
          oldAuto,
          queryRunner,
        );
        oldAuto.images = savedImages;
      }

      // Actualizar el auto
      const newAuto = await this.updateAuto(oldAuto, newDetails, queryRunner);

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      const imagesWithoutAuto = newAuto.images.map((image) => {
        const { auto: _, ...imageWithoutAuto } = image;
        return imageWithoutAuto;
      });

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
    images: string[],
    newAuto: Auto,
    queryRunner: QueryRunner,
  ): Promise<AutoImage[]> {
    const imagesToSave = images.map((url) =>
      this.autoImageRepository.create({
        url,
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

    await queryRunner.manager.remove(auto.images);
  }

  async createAuto(
    autoDetails: Omit<CreateAutoDto, 'images'>,
    queryRunner: QueryRunner,
  ): Promise<Auto> {
    const newAuto = this.autoRepository.create({
      ...autoDetails,
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
}
