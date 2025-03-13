import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'auto' })
export class Auto extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;
}
