import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ProductModule } from './products/product.module';
import { UserModule } from './users/user.module';
import { InvoiceModule } from './invoices/invoice.module';
import { AccommodationModule } from './accommodations/accommodation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ProductModule,
    UserModule,
    InvoiceModule,
    AccommodationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
