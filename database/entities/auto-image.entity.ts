import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'auto' })
export class AutoImage extends BaseEntity {
  @Column('text', { nullable: false })
  url: string;
}
