import { InvoicedPaginatedService } from './../services/invoicePaginated.service';
import { Injectable } from '@nestjs/common';
import { InvoiceService } from './../services/invoice.service';
import { InvoiceDetailService } from '../services/invoiceDetail.service';
import {
  CreateInvoiceDto,
  GetInvoiceWithDetailsDto,
  UpdateInvoiceDto,
} from '../dtos/invoice.dto';
import { CreateInvoiceDetaillDto } from '../dtos/invoiceDetaill.dto';
import { PaginatedListInvoicesParamsDto } from '../dtos/paginatedInvoice.dto';

@Injectable()
export class InvoiceUC {
  constructor(
    private readonly _invoiceService: InvoiceService,
    private readonly _invoiceDetailService: InvoiceDetailService,
    private readonly _invoicedPaginatedService: InvoicedPaginatedService,
  ) {}

  async createInvoice(createInvoiceDto: CreateInvoiceDto) {
    return this._invoiceService.create(createInvoiceDto);
  }

  async findOne(invoiceId: number): Promise<GetInvoiceWithDetailsDto> {
    return this._invoiceService.findOne(invoiceId);
  }

  async update(invoiceId: number, updateInvoiceDto: UpdateInvoiceDto) {
    return this._invoiceService.update(invoiceId, updateInvoiceDto);
  }

  async delete(invoiceId: number) {
    return this._invoiceService.delete(invoiceId);
  }

  async addDetail(invoiceId: number, dto: CreateInvoiceDetaillDto) {
    return this._invoiceDetailService.create(invoiceId, dto);
  }

  async deleteDetail(invoiceDetaillId: number) {
    return this._invoiceDetailService.delete(invoiceDetaillId);
  }

  async getRelatedDataToCreate() {
    return await this._invoiceDetailService.getRelatedDataToCreate();
  }

  async paginatedList(params: PaginatedListInvoicesParamsDto) {
    return await this._invoicedPaginatedService.paginatedList(params);
  }
}
