import { Controller, Get, Param } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getAllCars() {
    return this.carsService.index();
  }

  @Get(':id')
  getCarById(@Param('id') id: string) {
    return this.carsService.getOneById(id);
  }
}
