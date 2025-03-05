import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Car extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;
}
