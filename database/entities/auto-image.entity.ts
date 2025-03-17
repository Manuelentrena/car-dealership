import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Auto } from './auto.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'auto_image' })
export class AutoImage extends BaseEntity {
  @Column('text', { nullable: false })
  url: string;

  @ManyToOne(() => Auto, (auto) => auto.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'auto_id' })
  auto: Auto;
}
