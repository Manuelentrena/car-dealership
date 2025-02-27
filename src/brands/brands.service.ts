import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from './schema/brand.schema';
import { Model } from 'mongoose';
import { CreateBrandDto, UpdateBrandDto } from './dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResponse } from 'src/common/interface/pagination.interface';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
  ) {}

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginationResponse<Brand>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const brands = await this.brandModel.find().skip(skip).limit(limit).exec();
    const total = await this.brandModel.countDocuments().exec();

    return {
      data: brands,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this.brandModel.findById(id).exec();

    if (!brand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return brand;
  }

  async create(
    createBrandDto: CreateBrandDto,
  ): Promise<{ message: string; newBrand: Brand }> {
    const existingBrand = await this.brandModel
      .findOne({
        name: createBrandDto.name,
      })
      .exec();

    if (existingBrand) {
      throw new ConflictException('A brand with this name already exists.');
    }

    const newBrand = new this.brandModel({
      ...createBrandDto,
      createdAt: new Date().getTime(),
    });
    await newBrand.save();

    return {
      message: 'Brand created successfully',
      newBrand,
    };
  }

  async update(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<{ message: string; brand: Brand }> {
    const updatedBrand = await this.brandModel
      .findByIdAndUpdate(
        id,
        { ...updateBrandDto, updatedAt: new Date().getTime() },
        {
          new: true, // Devuelve el documento actualizado
          runValidators: true, // Ejecuta las validaciones del esquema
        },
      )
      .exec();

    if (!updatedBrand) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return {
      message: 'Brand updated successfully',
      brand: updatedBrand,
    };
  }

  async delete(id: string): Promise<{ message: string; brand: Brand }> {
    const deletedBrand = await this.brandModel.findByIdAndDelete(id).exec();

    if (!deletedBrand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return {
      message: 'Brand deleted successfully',
      brand: deletedBrand,
    };
  }
}
