import { Accommodation } from './accommodation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'StateType' })
export class StateType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 255, nullable: true })
  code: string;

  @Column('varchar', { length: 255, nullable: true })
  name: string;

  @OneToMany(() => Accommodation, (accommodation) => accommodation.stateType, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  accommodation: Accommodation[];

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
