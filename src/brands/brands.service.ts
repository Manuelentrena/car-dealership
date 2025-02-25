import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class BrandsService {
  private brands: Brand[] = [
    {
      id: randomUUID(),
      name: 'seat',
      createdAt: new Date().getTime(),
    },
    {
      id: randomUUID(),
      name: 'hunday',
      createdAt: new Date().getTime(),
    },
    {
      id: randomUUID(),
      name: 'tesla',
      createdAt: new Date().getTime(),
    },
  ];

  create(createBrandDto: CreateBrandDto) {
    const newBrand: Brand = {
      id: randomUUID(),
      ...createBrandDto,
      createdAt: new Date().getTime(),
    };
    this.brands.push(newBrand);
    return { message: 'Brand created', newBrand };
  }

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const brand = this.brands.find((brand) => brand.id === id);

    if (!brand) {
      throw new NotFoundException(`Brand with ${id} not found`);
    }

    return brand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    this.brands = this.brands.map((brand) =>
      brand.id === id
        ? { ...brand, ...updateBrandDto, updatedAt: new Date().getTime() }
        : brand,
    );

    const newBrand = this.findOne(id);

    return { message: 'Brand updated', brand: newBrand };
  }

  remove(id: string) {
    const deleteBrand = this.brands.find((brand) => brand.id === id);

    if (!deleteBrand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    this.brands = this.brands.filter((brand) => brand.id !== id);

    return { message: 'Brand deleted', brand: deleteBrand };
  }
}
