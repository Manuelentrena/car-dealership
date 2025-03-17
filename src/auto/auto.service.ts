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
import { EntityNotFoundError, QueryRunner, Repository } from 'typeorm';
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
      data: data,
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
  ): Promise<{ message: string; newAuto: Auto }> {
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
      const newImages = await this.createImages(
        images || [],
        newAuto,
        queryRunner,
      );

      // Confirmar la transacción
      await queryRunner.commitTransaction();

      return {
        message: '🚗 Auto created successfully',
        newAuto: { ...newAuto, images: newImages } as Auto,
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
    const auto = await this.autoRepository.preload({
      id,
      ...updateAutoDto,
      images: [],
      updatedAt: new Date(),
    });

    if (!auto) {
      throw new NotFoundException(`🚗 Auto with id ${id} not found`);
    }

    const updatedAuto = await this.autoRepository.save(auto);

    return {
      message: '🚗 Auto updated successfully',
      auto: updatedAuto,
    };
  }

  async remove(id: string): Promise<{ message: string; auto: Auto }> {
    try {
      const deletedAuto = await this.autoRepository.findOneOrFail({
        where: { id },
      });

      await this.autoRepository.delete(id);

      return {
        message: '🚗 Auto deleted successfully',
        auto: deletedAuto,
      };
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException(`🚗 Auto with ID ${id} not found`);
      }
      throw error;
    }
  }

  async createImages(
    images: string[],
    newAuto: Auto,
    queryRunner: QueryRunner,
  ): Promise<Omit<AutoImage, 'auto'>[]> {
    const imagesToSave = images.map((url) =>
      this.autoImageRepository.create({
        url,
        auto: newAuto,
      }),
    );

    await queryRunner.manager.save(imagesToSave);
    const savedImages = imagesToSave.map((image) => {
      const { auto: _, ...imageWithoutAuto } = image;
      return imageWithoutAuto;
    });

    return savedImages as Omit<AutoImage, 'auto'>[];
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

  async checkIfAutoExists(createAutoDto: CreateAutoDto): Promise<Auto | null> {
    return await this.autoRepository.findOneBy({
      brand: createAutoDto.brand,
      model: createAutoDto.model,
      year: createAutoDto.year,
    });
  }
}
