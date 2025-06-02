import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from 'src/brands/schema/brand.schema';
import { Car, CarDocument } from 'src/cars/schema/car.schema';
import {
  ModelDocument,
  Model as ModelSchema,
} from 'src/models/schema/model.schema';
import { DataSource, Repository } from 'typeorm';
import { Auto } from '../../database/entities/auto.entity';
import { cars } from './data';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Car.name) private readonly carModel: Model<CarDocument>,
    @InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>,
    @InjectModel(ModelSchema.name)
    private readonly modelModel: Model<ModelDocument>,
    @InjectRepository(Auto)
    private readonly autoRepository: Repository<Auto>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async runSeed() {
    console.log('Deleting existing data...');
    await this.carModel.deleteMany({});
    await this.brandModel.deleteMany({});
    await this.modelModel.deleteMany({});
    console.log('Existing data deleted.');
    for (const car of cars) {
      let brand = await this.brandModel.findOne({ name: car.brand });

      if (!brand) {
        brand = new this.brandModel({
          name: car.brand,
          createdAt: new Date().getTime(),
          updatedAt: null,
        });
        await brand.save();
      }

      let model = await this.modelModel.findOne({ name: car.model });

      if (!model) {
        model = new this.modelModel({
          name: car.model,
          createdAt: new Date().getTime(),
          updatedAt: null,
        });
        await model.save();
      }

      const carExists = await this.carModel.findOne({
        model: car.model,
        brand: car.brand,
      });

      if (!carExists) {
        const newCar = new this.carModel({
          brand: brand._id,
          model: model._id,
          createdAt: new Date().getTime(),
          updatedAt: null,
        });
        await newCar.save();
      }
    }

    console.log('Seed data inserted successfully. ');
  }

  async runSeedInPostgres() {
    console.log('Running pending migrations...');
    await this.dataSource.runMigrations();

    console.log('Deleting existing autos in PostgreSQL...');
    await this.autoRepository.delete({});

    console.log('Inserting new autos in PostgreSQL...');
    const autos = cars.map((car) => this.autoRepository.create(car));
    await this.autoRepository.save(autos);

    console.log('Seed data inserted successfully in PostgreSQL.');
  }
}
