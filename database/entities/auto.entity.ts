import { generateSlug } from 'src/common/utils/utils';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { AutoImage } from './auto-image.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'auto' })
export class Auto extends BaseEntity {
  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column('text', {
    unique: true,
    nullable: true,
  })
  slug: string;

  @Column('text', { nullable: true, array: true, default: [] })
  features: string[];

  @OneToMany(() => AutoImage, (image) => image.auto, {
    cascade: true,
    eager: true,
  })
  images?: AutoImage[];

  // Hook para generar el slug antes de insertar o actualizar
  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    // Generamos el slug basado en los valores de brand, model y year
    this.slug = `${generateSlug(this.brand)}-${generateSlug(this.model)}-${
      this.year
    }`;
  }
}
