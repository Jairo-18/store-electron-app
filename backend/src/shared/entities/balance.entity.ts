import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BalanceType } from '../constants/balanceType.constants';
import { Hotel } from './hotel.entity';

@Index(['type', 'periodDate'], { unique: true })
@Entity('Balance')
export class Balance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: BalanceType,
  })
  type: BalanceType;

  @Column({ type: 'date' })
  periodDate: Date;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalInvoiceSale: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalInvoiceBuy: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balanceInvoice: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalProductPriceSale: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  totalProductPriceBuy: number;

  @Column('decimal', { precision: 12, scale: 2, default: 0 })
  balanceProduct: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.balances, { nullable: true })
  @JoinColumn({ name: 'hotelId' })
  hotel?: Hotel;

  @CreateDateColumn()
  createdAt: Date;
}
