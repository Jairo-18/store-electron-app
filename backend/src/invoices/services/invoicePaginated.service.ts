import { InvoiceRepository } from './../../shared/repositories/invoice.repository';
import { PageMetaDto } from './../../shared/dtos/pageMeta.dto';
import { Invoice } from './../../shared/entities/invoice.entity';
import { PaginatedListInvoicesParamsDto } from '../dtos/paginatedInvoice.dto';
import { ResponsePaginationDto } from './../../shared/dtos/pagination.dto';
import { Injectable } from '@nestjs/common';
import { SimplifiedInvoiceResponse } from '../models/invoice.model';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class InvoicedPaginatedService {
  constructor(private readonly _invoiceRepository: InvoiceRepository) {}

  async paginatedList(
    params: PaginatedListInvoicesParamsDto,
  ): Promise<ResponsePaginationDto<Invoice>> {
    const skip = (params.page - 1) * params.perPage;
    const take = params.perPage;

    const query = this._invoiceRepository
      .createQueryBuilder('invoice')
      .leftJoinAndSelect('invoice.user', 'user')
      .leftJoinAndSelect('user.identificationType', 'userIdentificationType')
      .leftJoinAndSelect('invoice.invoiceDetaills', 'invoiceDetails')
      .leftJoinAndSelect('invoiceDetails.taxeType', 'taxeType')
      .leftJoinAndSelect('invoice.payType', 'payType')
      .leftJoinAndSelect('invoice.paidType', 'paidType')
      .leftJoinAndSelect('invoice.invoiceType', 'invoiceType')
      .where('1=1');

    if (params.invoiceTypeId) {
      query.andWhere('invoice.invoiceType = :invoiceType', {
        invoiceType: params.invoiceTypeId,
      });
    }

    if (params.code) {
      query.andWhere('invoice.code ILIKE :code', { code: `%${params.code}%` });
    }

    if (params.clientName) {
      query.andWhere(
        `(user.firstName ILIKE :clientName OR user.lastName ILIKE :clientName)`,
        { clientName: `%${params.clientName}%` },
      );
    }

    if (params.invoiceElectronic !== undefined) {
      query.andWhere('invoice.invoiceElectronic = :invoiceElectronic', {
        invoiceElectronic: params.invoiceElectronic,
      });
    }

    if (params.identificationTypeId) {
      query.andWhere('user.identificationTypeId = :clientIdentificationType', {
        clientIdentificationType: params.identificationTypeId,
      });
    }

    if (params.payTypeId) {
      query.andWhere('invoice.payType = :payTypeId', {
        payTypeId: params.payTypeId,
      });
    }

    if (params.paidTypeId) {
      query.andWhere('invoice.paidType = :paidTypeId', {
        paidTypeId: params.paidTypeId,
      });
    }

    if (params.total !== undefined) {
      query.andWhere('invoice.total = :total', { total: params.total });
    }

    if (params.createdAtFrom && params.createdAtTo) {
      query.andWhere('invoice.createdAt BETWEEN :from AND :to', {
        from: params.createdAtFrom,
        to: params.createdAtTo,
      });
    } else if (params.createdAtFrom) {
      query.andWhere('invoice.createdAt >= :from', {
        from: params.createdAtFrom,
      });
    } else if (params.createdAtTo) {
      query.andWhere('invoice.createdAt <= :to', { to: params.createdAtTo });
    }

    if (params.startDate && params.endDate) {
      const start = `${params.startDate} 00:00:00`;
      const end = `${params.endDate} 23:59:59`;

      query.andWhere('invoice.startDate BETWEEN :start AND :end', {
        start,
        end,
      });
    } else if (params.startDate) {
      const start = `${params.startDate} 00:00:00`;
      const end = `${params.startDate} 23:59:59`;

      query.andWhere('invoice.startDate BETWEEN :start AND :end', {
        start,
        end,
      });
    } else if (params.endDate) {
      const end = `${params.endDate} 23:59:59`;
      query.andWhere('invoice.startDate <= :end', { end });
    }

    if (params.taxeTypeId) {
      query.andWhere('invoiceDetails.taxeType = :taxeTypeId', {
        taxeTypeId: params.taxeTypeId,
      });
    }

    if (params.search) {
      const search = params.search.trim();
      const isNumeric = !isNaN(Number(search));
      const searchStr = `%${search}%`;

      const conditions: string[] = [
        'invoice.code ILIKE :searchStr',
        'user.firstName ILIKE :searchStr',
        'user.lastName ILIKE :searchStr',
        'user.identificationNumber ILIKE :searchStr',
      ];

      if (isNumeric) {
        conditions.push(
          'CAST(invoice.total AS TEXT) ILIKE :searchStr',
          'CAST(invoice.subtotalWithTax AS TEXT) ILIKE :searchStr',
          'CAST(invoice.subtotalWithoutTax AS TEXT) ILIKE :searchStr',
        );
      }

      query.andWhere(`(${conditions.join(' OR ')})`, { searchStr });
    }

    query
      .skip(skip)
      .take(take)
      .orderBy('invoice.createdAt', params.order ?? 'DESC');

    const [items, itemCount] = await query.getManyAndCount();

    const transformedItems = items.map((invoice) => {
      let totalTaxes = 0;
      if (invoice.invoiceDetaills && invoice.invoiceDetaills.length > 0) {
        totalTaxes = invoice.invoiceDetaills.reduce((sum, detail) => {
          const taxAmount =
            (detail.priceWithTax - detail.priceWithoutTax) * detail.amount;
          return sum + taxAmount;
        }, 0);
      }

      const simplified: SimplifiedInvoiceResponse = {
        invoiceId: invoice.invoiceId,
        code: invoice.code,
        invoiceElectronic: invoice.invoiceElectronic,
        subtotalWithoutTax:
          typeof invoice.subtotalWithoutTax === 'string'
            ? parseFloat(invoice.subtotalWithoutTax) || 0
            : invoice.subtotalWithoutTax || 0,
        subtotalWithTax:
          typeof invoice.subtotalWithTax === 'string'
            ? parseFloat(invoice.subtotalWithTax) || 0
            : invoice.subtotalWithTax || 0,
        total:
          typeof invoice.total === 'string'
            ? parseFloat(invoice.total) || 0
            : invoice.total || 0,
        totalTaxes,
        startDate: invoice.startDate,
        endDate: invoice.endDate,
        user: invoice.user
          ? {
              userId: invoice.user.id,
              identificationNumber: invoice.user.identificationNumber,
              firstName: invoice.user.firstName,
              lastName: invoice.user.lastName,
              identificationType: invoice.user.identificationType
                ? {
                    identificationTypeId: Number(
                      invoice.user.identificationType.id,
                    ),
                    code: invoice.user.identificationType.code,
                    name: invoice.user.identificationType.name,
                  }
                : undefined,
            }
          : undefined,
        payType: invoice.payType
          ? {
              payTypeId: Number(invoice.payType.id),
              code: invoice.payType.code,
              name: invoice.payType.name,
            }
          : undefined,
        paidType: invoice.paidType
          ? {
              paidTypeId: Number(invoice.paidType.id),
              code: invoice.paidType.code,
              name: invoice.paidType.name,
            }
          : undefined,
        invoiceType: invoice.invoiceType
          ? {
              invoiceTypeId: Number(invoice.invoiceType.id),
              code: invoice.invoiceType.code,
              name: invoice.invoiceType.name,
            }
          : undefined,
      };

      return plainToInstance(Invoice, simplified);
    });

    const pageMeta = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(transformedItems, pageMeta);
  }
}
