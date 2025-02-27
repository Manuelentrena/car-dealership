import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto';
import { ParseMongoIdPipe } from 'src/common/pipe/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getAllCars(@Query() paginationDto: PaginationDto) {
    return this.carsService.findAll(paginationDto);
  }

  @Get(':id')
  getCarById(@Param('id', ParseMongoIdPipe) id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  createCar(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Patch(':id')
  updateCar(
    @Param('id', ParseMongoIdPipe) id: string,
    @Body() updateCar: UpdateCarDto,
  ) {
    return this.carsService.update(id, updateCar);
  }

  @Delete(':id')
  deleteCar(@Param('id', ParseMongoIdPipe) id: string) {
    return this.carsService.delete(id);
  }
}
