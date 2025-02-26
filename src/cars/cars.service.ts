import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Car, CarDocument } from './schema/car.schema';
import { Model } from 'mongoose';
import { CreateCarDto, UpdateCarDto } from './dto';

@Injectable()
export class CarsService {
  constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

  async findAll(): Promise<Car[]> {
    return this.carModel.find().exec();
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carModel.findById(id).exec();

    if (!car) {
      throw new NotFoundException(`🚗 Car with id ${id} not found`);
    }

    return car;
  }

  async create(
    createCarDto: CreateCarDto,
  ): Promise<{ message: string; newCar: Car }> {
    const existingCar = await this.carModel.findOne({
      brand: createCarDto.brand,
    });

    if (existingCar) {
      throw new ConflictException('A car with this brand already exists.');
    }

    const newCar = new this.carModel(createCarDto);
    await newCar.save();

    return {
      message: '🚗 Car created successfully',
      newCar,
    };
  }

  async update(
    id: string,
    updateCarDto: UpdateCarDto,
  ): Promise<{ message: string; car: Car }> {
    const updatedCar = await this.carModel.findByIdAndUpdate(id, updateCarDto, {
      new: true, // Devuelve el coche actualizado
      runValidators: true, // Ejecuta validaciones definidas en el esquema
    });

    if (!updatedCar) {
      throw new NotFoundException(`🚗 Car with id ${id} not found`);
    }

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

    return {
      message: '🚗 Car deleted successfully',
      car: deletedCar,
    };
  }

  async populateCars(cars: Car[]): Promise<{ message: string; cars: Car[] }> {
    await this.carModel.deleteMany({});
    const createdCars = await this.carModel.insertMany(cars);

    return {
      message: '🚗 Cars populated successfully',
      cars: createdCars,
    };
  }
}
