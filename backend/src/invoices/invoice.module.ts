import { InvoicedPaginatedService } from './services/invoicePaginated.service';
import { InvoiceUC } from './useCases/invoiceUC.uc';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { InvoiceDetailService } from './services/invoiceDetail.service';

@Module({
  imports: [SharedModule.forRoot()],
  controllers: [InvoiceController],
  providers: [
    InvoiceService,
    InvoiceUC,
    InvoiceDetailService,
    InvoicedPaginatedService,
  ],
  exports: [InvoiceService, InvoiceDetailService],
})
export class InvoiceModule {}
