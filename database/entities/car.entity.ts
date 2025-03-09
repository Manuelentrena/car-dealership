import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'car' })
export class Car extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;
}
