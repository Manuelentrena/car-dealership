import { randomUUID } from 'crypto';
import { Brand } from 'src/brands/entities/brand.entity';

export const brands: Brand[] = [
  {
    id: randomUUID(),
    name: 'Seat',
    createdAt: new Date().getTime(),
  },
  {
    id: randomUUID(),
    name: 'Toyota',
    createdAt: new Date().getTime(),
  },
  {
    id: randomUUID(),
    name: 'Ford',
    createdAt: new Date().getTime(),
  },
  {
    id: randomUUID(),
    name: 'Chevrolet',
    createdAt: new Date().getTime(),
  },
  {
    id: randomUUID(),
    name: 'Nissan',
    createdAt: new Date().getTime(),
  },
];
