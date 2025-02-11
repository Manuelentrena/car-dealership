import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

export type Car = {
  id: string;
  brand: string;
  model: string;
};
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
}
