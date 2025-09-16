import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Product } from './product.entity';

@Entity({ name: 'CategoryType' })
export class CategoryType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  code: string;

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @OneToMany(() => Product, (product) => product.categoryType, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  product: Product[];

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
