import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CategoryType } from './categoryType.entity';
import { ImageProduct } from './imageProduct.entity';

@Entity({ name: 'Product' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  code?: string;

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @Column('varchar', { length: 500, nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount?: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceBuy: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceSale: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => ImageProduct, (image) => image.product, {
    cascade: true,
    eager: true,
  })
  images: ImageProduct[];

  @ManyToOne(() => CategoryType, (categoryType) => categoryType.product)
  @JoinColumn({ name: 'categoryTypeId' })
  categoryType: CategoryType;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
