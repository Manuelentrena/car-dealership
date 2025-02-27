import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarSchema } from './schema/car.schema';
import { BrandsModule } from 'src/brands/brands.module';

@Module({
  imports: [
    BrandsModule,
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [
    CarsService,
    MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
  ],
})
export class CarsModule {}
