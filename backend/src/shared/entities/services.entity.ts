import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { CategoryType } from './categoryType.entity';
import { Hotel } from './hotel.entity';

@Entity({ name: 'Service' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: false })
  code?: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('varchar', { length: 500, nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  priceBuy: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceSale: number;

  @ManyToOne(() => CategoryType, (categoryType) => categoryType.service)
  @JoinColumn({ name: 'categoryTypeId' })
  categoryType: CategoryType;

  @ManyToOne(() => Hotel, (hotel) => hotel.services, { nullable: true })
  @JoinColumn({ name: 'hotelId' })
  hotel?: Hotel;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  updatedAt?: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt?: Date;
}
