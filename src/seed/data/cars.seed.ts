import { randomUUID } from 'crypto';
import { Car } from 'src/cars/types/car.types';

export const cars: Car[] = [
  {
    id: randomUUID(),
    brand: 'Honda',
    model: 'Civic',
  },
  {
    id: randomUUID(),
    brand: 'Toyota',
    model: 'Corolla',
  },
  {
    id: randomUUID(),
    brand: 'Ford',
    model: 'Mustang',
  },
  {
    id: randomUUID(),
    brand: 'Chevrolet',
    model: 'Camaro',
  },
  {
    id: randomUUID(),
    brand: 'Nissan',
    model: 'GT-R',
  },
];
