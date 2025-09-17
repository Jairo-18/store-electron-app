import { ScheduleModule } from '@nestjs/schedule';
import { InvoiceEventsListener } from './services/invoiceEventsListener.service';
import { BalanceService } from './services/balance.service';
import { InvoiceDetaillRepository } from './repositories/invoiceDetaill.repository';
import { InvoiceRepository } from './repositories/invoice.repository';
import { PayTypeRepository } from './repositories/payType.repository';
import { PaidTypeRepository } from './repositories/paidType.repository';
import { RepositoryService } from './services/repositoriry.service';
import { RoleTypeRepository } from './repositories/roleType.repository';
import { TaxeTypeRepository } from './repositories/taxeType.repository';
import { PhoneCodeRepository } from './repositories/phoneCode.repository';
import { PhoneCode } from './entities/phoneCode.entity';
import { Invoice } from './entities/invoice.entity';
import { PaidType } from './entities/paidType.entity';
import { PayType } from './entities/payType.entity';
import { TaxeType } from './entities/taxeType.entity';
import { CategoryTypeRepository } from './repositories/categoryType.repository';
import { ProductRepository } from './repositories/product.repository';
import { CategoryType } from './entities/categoryType.entity';
import { Product } from './entities/product.entity';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { PassportModule } from '@nestjs/passport';
import { RoleType } from './entities/roleType.entity';
import { IdentificationType } from './entities/identificationType.entity';
import { IdentificationTypeRepository } from './repositories/identificationType.repository';
import { InvoiceType } from './entities/invoiceType.entity';
import { InvoiceTypeRepository } from './repositories/invoiceType.repository';
import { InvoiceDetaill } from './entities/invoiceDetaill.entity';
import { BalanceRepository } from './repositories/balance.repository';
import { Balance } from './entities/balance.entity';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GeneralInvoiceDetaillService } from './services/generalInvoiceDetaill.service';

@Module({})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      module: SharedModule,
      imports: [
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath:
            process.env.NODE_ENV === 'production'
              ? '.env.production'
              : '.env.development',
          cache: true,
        }),
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const sslEnabled = configService.get('DB_SSL') === 'true';
            const config: any = {
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_DATABASE'),
              entities: [__dirname + '/src/**/*.entity{.ts,.js}'],
              autoLoadEntities: true,
              synchronize: false,
              logging: false,
              extra: {
                keepAlive: true,
                max: 20,
                idleTimeoutMillis: 60000,
                connectionTimeoutMillis: 60000,
              },
            };
            if (sslEnabled) {
              config.ssl = {
                rejectUnauthorized: false,
              };
            }
            return config;
          },
        }),
        PassportModule,
        TypeOrmModule.forFeature([
          Balance,
          CategoryType,
          IdentificationType,
          Invoice,
          InvoiceDetaill,
          InvoiceType,
          PaidType,
          PayType,
          PhoneCode,
          Product,
          RoleType,
          TaxeType,
          User,
        ]),
      ],
      controllers: [],
      providers: [
        BalanceRepository,
        CategoryTypeRepository,
        IdentificationTypeRepository,
        InvoiceRepository,
        InvoiceDetaillRepository,
        InvoiceTypeRepository,
        PaidTypeRepository,
        PayTypeRepository,
        PhoneCodeRepository,
        ProductRepository,
        RoleTypeRepository,
        TaxeTypeRepository,
        UserRepository,
        BalanceService,
        RepositoryService,
        InvoiceEventsListener,
        GeneralInvoiceDetaillService,
      ],
      exports: [
        TypeOrmModule,
        ConfigModule,
        BalanceRepository,
        CategoryTypeRepository,
        IdentificationTypeRepository,
        InvoiceRepository,
        InvoiceDetaillRepository,
        InvoiceTypeRepository,
        PaidTypeRepository,
        PayTypeRepository,
        PhoneCodeRepository,
        ProductRepository,
        RoleTypeRepository,
        TaxeTypeRepository,
        UserRepository,
        BalanceService,
        RepositoryService,
        InvoiceEventsListener,
        GeneralInvoiceDetaillService,
      ],
    };
  }
}
