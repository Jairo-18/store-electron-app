import { Service } from './services.entity';
import { Invoice } from './invoice.entity';
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
import { TaxeType } from './taxeType.entity';
import { Product } from './product.entity';

@Entity({ name: 'InvoiceDetaill' })
export class InvoiceDetaill {
  @PrimaryGeneratedColumn()
  invoiceDetaillId: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceDetaills)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @ManyToOne(() => Product, { nullable: true })
  @JoinColumn({ name: 'productId' })
  product?: Product;

  @ManyToOne(() => Service, { nullable: true })
  @JoinColumn({ name: 'serviceId' })
  service?: Service;

  @Column('decimal', { precision: 10, scale: 2 })
  amount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceBuy: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceWithoutTax: number;

  @Column({ type: 'numeric', nullable: true, default: 0 })
  taxe: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceWithTax: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => TaxeType, { nullable: true })
  @JoinColumn({ name: 'taxeTypeId' })
  taxeType?: TaxeType;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
