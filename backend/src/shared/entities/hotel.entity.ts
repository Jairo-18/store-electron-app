import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { PhoneCode } from './phoneCode.entity';
import { User } from './user.entity';
import { Product } from './product.entity';
import { Invoice } from './invoice.entity';
import { Accommodation } from './accommodation.entity';
import { Service } from './services.entity';
import { Balance } from './balance.entity';
import { InvoiceDetaill } from './invoiceDetaill.entity';
import { AccessSessions } from './accessSessions.entity';

@Entity({ name: 'Hotel' })
export class Hotel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255, nullable: false })
  name: string;

  @Column('varchar', { length: 50, nullable: false, unique: true })
  code: string;

  @Column('varchar', { length: 255, nullable: false })
  legalName: string;

  @Column('varchar', { length: 50, nullable: false, unique: true })
  identificationNumber: string;

  @Column('varchar', { length: 150, nullable: false, unique: true })
  email: string;

  @Column('varchar', { length: 100, nullable: false })
  city: string;

  @Column('varchar', { length: 100, nullable: false })
  department: string;

  @ManyToOne(() => PhoneCode, (phoneCode) => phoneCode.hotels, {
    nullable: false,
  })
  @JoinColumn({ name: 'phoneCodeId' })
  phoneCode: PhoneCode;

  @Column('varchar', { length: 255, nullable: false })
  address: string;

  @Column('varchar', { length: 255, nullable: true })
  website?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.hotel)
  users: User[];

  @OneToMany(() => Product, (product) => product.hotel)
  products: Product[];

  @OneToMany(() => Invoice, (invoice) => invoice.hotel)
  invoices: Invoice[];

  @OneToMany(() => Accommodation, (accommodation) => accommodation.hotel)
  accommodations: Accommodation[];

  @OneToMany(() => Service, (service) => service.hotel)
  services: Service[];

  @OneToMany(() => Balance, (balance) => balance.hotel)
  balances: Balance[];

  @OneToMany(() => InvoiceDetaill, (invoiceDetaill) => invoiceDetaill.hotel)
  invoiceDetaills: InvoiceDetaill[];

  @OneToMany(() => AccessSessions, (accessSession) => accessSession.hotel)
  accessSessions: AccessSessions[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
