import { Column, Entity, ManyToOne } from 'typeorm';
import { Auto } from './auto.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'auto' })
export class AutoImage extends BaseEntity {
  @Column('text', { nullable: false })
  url: string;

  @ManyToOne(() => Auto, (auto) => auto.images)
  auto: Auto;
}
