import { Injectable } from '@nestjs/common';

@Injectable()
export class CarsService {
  private cars = [
    {
      id: 0,
      brand: 'Honda',
      model: 'Torolla',
    },
    {
      id: 1,
      brand: 'Seat',
      model: 'panda',
    },
    {
      id: 2,
      brand: 'Hunday',
      model: 'Accent',
    },
    {
      id: 3,
      brand: 'BMW',
      model: 'Leopard',
    },
  ];

  index() {
    return this.cars;
  }

  getOneById(id: number) {
    return this.cars.find((car) => car.id === id);
  }
}
