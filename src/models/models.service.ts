import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ModelDocument } from 'src/models/schema/model.schema';
import { Model as ModelSchema } from './schema/model.schema';
import { Model } from 'mongoose';
import { PaginationResponse } from 'src/common/interface/pagination.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PAGINATION_DEFAULTS } from 'src/common/config/pagination.config';

@Injectable()
export class ModelService {
  constructor(
    @InjectModel(Model.name) private modelModel: Model<ModelDocument>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<ModelSchema>> {
    const {
      page = PAGINATION_DEFAULTS.page,
      limit = PAGINATION_DEFAULTS.limit,
    } = paginationDto;
    const skip = (page - 1) * limit;

    const models = await this.modelModel.find().skip(skip).limit(limit).exec();
    const total = await this.modelModel.countDocuments().exec();

    return {
      data: models,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ModelSchema> {
    const model = await this.modelModel.findById(id).exec();

    if (!model) {
      throw new NotFoundException(`Model with id ${id} not found`);
    }

    return model;
  }

  async create(
    createModelDto: CreateModelDto,
  ): Promise<{ message: string; newModel: ModelSchema }> {
    const existingModel = await this.modelModel
      .findOne({
        name: createModelDto.name,
      })
      .exec();

    if (existingModel) {
      throw new ConflictException('A model with this name already exists.');
    }

    const newModel = new this.modelModel({
      ...createModelDto,
      createdAt: new Date().getTime(),
    });
    await newModel.save();

    return {
      message: 'Model created successfully',
      newModel,
    };
  }

  async update(
    id: string,
    updateModelDto: UpdateModelDto,
  ): Promise<{ message: string; model: ModelSchema }> {
    const updatedModel = await this.modelModel
      .findByIdAndUpdate(
        id,
        { ...updateModelDto, updatedAt: new Date().getTime() },
        {
          new: true, // Devuelve el documento actualizado
          runValidators: true, // Ejecuta las validaciones del esquema
        },
      )
      .exec();

    if (!updatedModel) {
      throw new NotFoundException(`Model with id ${id} not found`);
    }

    return {
      message: 'Model updated successfully',
      model: updatedModel,
    };
  }

  async delete(id: string): Promise<{ message: string; model: ModelSchema }> {
    const deletedModel = await this.modelModel.findByIdAndDelete(id).exec();

    if (!deletedModel) {
      throw new NotFoundException(`Model with ID ${id} not found`);
    }

    return {
      message: 'Model deleted successfully',
      model: deletedModel,
    };
  }
}
