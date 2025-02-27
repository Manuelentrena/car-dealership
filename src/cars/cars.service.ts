import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './schema/car.schema';
import { Model } from 'mongoose';
import { CreateCarDto, UpdateCarDto } from './dto';
import { Brand, BrandDocument } from 'src/brands/schema/brand.schema';
import {
  ModelDocument,
  Model as ModelSchema,
} from 'src/models/schema/model.schema';
import { PaginationResponse } from 'src/common/interface/pagination.interface';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @InjectModel(ModelSchema.name) private modelModel: Model<ModelDocument>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Car>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const cars = await this.carModel
      .find()
      .populate('brand')
      .populate('model')
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.carModel.countDocuments().exec();

    return {
      data: cars,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carModel
      .findById(id)
      .populate('brand')
      .populate('model')
      .exec();

    if (!car) {
      throw new NotFoundException(`🚗 Car with id ${id} not found`);
    }

    return car;
  }

  async create(
    createCarDto: CreateCarDto,
  ): Promise<{ message: string; newCar: Car }> {
    const modelExists = await this.modelModel.findById(createCarDto.model);

    if (!modelExists) {
      throw new NotFoundException(
        `Model with ID ${createCarDto.model} not found`,
      );
    }

    const brandExists = await this.brandModel.findById(createCarDto.brand);

    if (!brandExists) {
      throw new NotFoundException(
        `Brand with ID ${createCarDto.brand} not found`,
      );
    }

    const carExists = await this.carModel
      .findOne({
        brand: brandExists._id,
        model: modelExists._id,
      })
      .populate('brand', 'name')
      .populate('model', 'name')
      .exec();

    if (carExists) {
      throw new ConflictException(
        `A car with brand ${brandExists.name} and model ${modelExists.name} already exists.`,
      );
    }

    const newCar = new this.carModel({
      ...createCarDto,
      createdAt: new Date().getTime(),
    });
    await newCar.save();
    await newCar.populate('brand');
    await newCar.populate('model');

    return {
      message: '🚗 Car created successfully',
      newCar,
    };
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
  ): Promise<{ message: string; car: Car }> {
    const updatedCar = await this.carModel.findByIdAndUpdate(
      id,
      { ...updateCarDto, updatedAt: new Date().getTime() },
      {
        new: true, // Devuelve el coche actualizado
        runValidators: true, // Ejecuta validaciones definidas en el esquema
      },
    );

    if (!updatedCar) {
      throw new NotFoundException(`🚗 Car with id ${id} not found`);
    }

    await updatedCar.populate('brand');
    await updatedCar.populate('model');

    return {
      message: '🚗 Car updated successfully',
      car: updatedCar,
    };
  }

  async delete(id: string): Promise<{ message: string; car: Car }> {
    const deletedCar = await this.carModel.findByIdAndDelete(id);

    if (!deletedCar) {
      throw new NotFoundException(`🚗 Car with ID ${id} not found`);
    }

    await deletedCar.populate('brand');
    await deletedCar.populate('model');

    return {
      message: '🚗 Car deleted successfully',
      car: deletedCar,
    };
  }
}
