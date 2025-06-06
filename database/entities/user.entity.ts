import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { Auto } from './auto.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ type: 'text', nullable: false })
  fullName: string;

  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ nullable: true })
  activationToken?: string;

  @Column({ type: 'boolean', nullable: false, default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: false, array: true, default: ['user'] })
  roles: string[];

  @OneToMany(() => Auto, (auto) => auto.user, {
    cascade: true,
    eager: false,
  })
  autos: Auto[];

  @BeforeInsert()
  checkFiledsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFiledsBeforeUpdate() {
    this.checkFiledsBeforeInsert();
  }
}
