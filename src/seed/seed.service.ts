import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from 'src/cars/schema/car.schema';
import { Brand, BrandDocument } from 'src/brands/schema/brand.schema';
import { Model } from 'mongoose';
import { cars } from './data';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
  ) {}

  async runSeed() {
    console.log('Deleting existing data...');
    await this.carModel.deleteMany({});
    await this.brandModel.deleteMany({});
    console.log('Existing data deleted.');
    for (const car of cars) {
      let brand = await this.brandModel.findOne({ name: car.brand });

      if (!brand) {
        brand = new this.brandModel({
          name: car.brand,
          createdAt: Date.now(),
          updatedAt: null,
        });
        await brand.save();
      }

      const carExists = await this.carModel.findOne({
        model: car.model,
        brand: car.brand,
      });

      if (!carExists) {
        const newCar = new this.carModel({
          brand: brand._id,
          model: car.model,
          createdAt: Date.now(),
          updatedAt: null,
        });
        await newCar.save();
      }
    }

    console.log('Seed data inserted successfully. ');
  }
}
