import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auto } from 'database/entities/auto.entity';
import { PAGINATION_DEFAULTS } from 'src/common/config/pagination.config';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResponse } from 'src/common/interface/pagination.interface';
import { EntityNotFoundError, Repository } from 'typeorm';
import { CreateAutoDto } from './dto/create-auto.dto';
import { UpdateAutoDto } from './dto/update-auto.dto';

@Injectable()
export class AutoService {
  constructor(
    @InjectRepository(Auto)
    private readonly autoRepository: Repository<Auto>,
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

  async findOne(id: string): Promise<Auto> {
    const auto = await this.autoRepository.findOneBy({ id });

    if (!auto) {
      throw new NotFoundException(`🚗 Auto with id ${id} not found`);
    }

    return auto;
  }

  async create(
    createAutoDto: CreateAutoDto,
  ): Promise<{ message: string; newAuto: Auto }> {
    const autoExists = await this.autoRepository.findOneBy({
      brand: createAutoDto.brand,
      model: createAutoDto.model,
      year: createAutoDto.year,
    });

    if (autoExists) {
      throw new ConflictException(
        `A auto with brand ${autoExists.brand}, model ${autoExists.model} and year ${autoExists.year} already exists.`,
      );
    }

    const newAuto = this.autoRepository.create({
      ...createAutoDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.autoRepository.save(newAuto);

    return {
      message: '🚗 Auto created successfully',
      newAuto,
    };
  }

  async update(
    id: string,
    updateAutoDto: UpdateAutoDto,
  ): Promise<{ message: string; auto: Auto }> {
    const updateResult = await this.autoRepository.update(id, {
      ...updateAutoDto,
      updatedAt: new Date(),
    });

    if (updateResult.affected === 0) {
      throw new NotFoundException(`🚗 Auto with id ${id} not found`);
    }

    const updatedAuto = await this.autoRepository.findOne({ where: { id } });

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
}
