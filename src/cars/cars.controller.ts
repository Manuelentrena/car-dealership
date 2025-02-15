import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto/create-car.dto';
import { UpdateCarDto } from './dto/create-car.dto/update-car.dto';

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

  @Post()
  createCar(@Body() createCarDto: CreateCarDto) {
    return this.carsService.createOne(createCarDto);
  }

  @Patch(':id')
  updateCar(@Param('id') id: string, @Body() updateCar: UpdateCarDto) {
    return this.carsService.updateOne({ id, ...updateCar });
  }

  @Delete(':id')
  deleteCar(@Param('id') id: string) {
    return this.carsService.deleteOne(id);
  }
}
