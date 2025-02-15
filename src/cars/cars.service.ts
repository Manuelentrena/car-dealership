import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Car } from './types/car.types';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    {
      id: randomUUID(),
      brand: 'Honda',
      model: 'Torolla',
    },
    {
      id: randomUUID(),
      brand: 'Seat',
      model: 'panda',
    },
    {
      id: randomUUID(),
      brand: 'Hunday',
      model: 'Accent',
    },
    {
      id: randomUUID(),
      brand: 'BMW',
      model: 'Leopard',
    },
  ];

  index() {
    return this.cars;
  }

  getOneById(id: string) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) {
      throw new NotFoundException(`Car with ${id} not found`);
    }

    return car;
  }

  createOne(car: Omit<Car, 'id'>) {
    const newCar: Car = {
      id: randomUUID(), // Genera el UUID sin instalar librerías externas
      ...car,
    };
    this.cars.push(newCar);
    return { message: 'Car created', car };
  }

  updateOne(updateCar: Car) {
    let newCar: Car | undefined;

    this.cars = this.cars.map((car) => {
      if (car.id === updateCar.id) {
        newCar = { ...car, ...updateCar };
        return newCar;
      }
      return car;
    });

    return { message: 'Car updated', car: newCar };
  }

  deleteOne(id: string) {
    const deleteCar = this.cars.find((car) => car.id === id);

    if (!deleteCar) {
      throw new NotFoundException(`Car with ID ${id} not found`);
    }

    this.cars = this.cars.filter((car) => car.id !== id);

    return { message: 'Car deleted', car: deleteCar };
  }
}
