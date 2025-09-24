import { RepositoryService } from './../../shared/services/repositoriry.service';
import { ProductRepository } from './../../shared/repositories/product.repository';
import { TaxeTypeRepository } from './../../shared/repositories/taxeType.repository';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { InvoiceRepository } from './../../shared/repositories/invoice.repository';
import { InvoiceDetaillRepository } from './../../shared/repositories/invoiceDetaill.repository';

import {
  CreateInvoiceDetaillDto,
  CreateRelatedDataInvoiceDto,
} from '../dtos/invoiceDetaill.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GeneralInvoiceDetaillService } from 'src/shared/services/generalInvoiceDetaill.service';

@Injectable()
export class InvoiceDetailService {
  constructor(
    private readonly _invoiceDetaillRepository: InvoiceDetaillRepository,
    private readonly _invoiceRepository: InvoiceRepository,
    private readonly _productRepository: ProductRepository,
    private readonly _taxeTypeRepository: TaxeTypeRepository,
    private readonly _repositoriesService: RepositoryService,
    private readonly _eventEmitter: EventEmitter2,
    private readonly _generalInvoiceDetaillService: GeneralInvoiceDetaillService,
  ) {}

  async getRelatedDataToCreate(): Promise<CreateRelatedDataInvoiceDto> {
    const categoryType =
      await this._repositoriesService.repositories.categoryType.find({
        select: ['id', 'name', 'code'],
      });
    const invoiceType =
      await this._repositoriesService.repositories.invoiceType.find({
        select: ['id', 'name', 'code'],
      });
    const taxeType = await this._repositoriesService.repositories.taxeType.find(
      {
        select: ['id', 'name', 'percentage'],
      },
    );
    const payType = await this._repositoriesService.repositories.payType.find({
      select: ['id', 'name', 'code'],
    });
    const paidType = await this._repositoriesService.repositories.paidType.find(
      {
        select: ['id', 'name', 'code'],
      },
    );
    const identificationType =
      await this._repositoriesService.repositories.identificationType.find({
        select: ['id', 'name', 'code'],
      });

    return {
      categoryType,
      invoiceType,
      taxeType,
      payType,
      paidType,
      identificationType,
    };
  }

  async create(
    invoiceId: number,
    createInvoiceDetaillDto: CreateInvoiceDetaillDto,
  ) {
    try {
      const [invoice, taxeType] = await Promise.all([
        this._invoiceRepository.findOne({
          where: { invoiceId },
          relations: ['invoiceType', 'paidType'],
        }),
        createInvoiceDetaillDto.taxeTypeId
          ? this._taxeTypeRepository.findOne({
              where: { id: createInvoiceDetaillDto.taxeTypeId },
            })
          : Promise.resolve(null),
      ]);

      if (!invoice) {
        throw new NotFoundException(
          `Factura con ID ${invoiceId} no encontrada`,
        );
      }

      const isQuote = invoice.invoiceType?.code === 'CO';
      const isSale = invoice.invoiceType?.code === 'FV';
      const isBuy = invoice.invoiceType?.code === 'FC';

      if (createInvoiceDetaillDto.taxeTypeId && !taxeType) {
        throw new NotFoundException('Tipo de impuesto no encontrado');
      }

      const taxRate = taxeType?.percentage
        ? taxeType.percentage > 1
          ? taxeType.percentage / 100
          : taxeType.percentage
        : 0;

      const amount = Number(createInvoiceDetaillDto.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new BadRequestException('La cantidad debe ser mayor a cero');
      }

      if (
        createInvoiceDetaillDto.startDate &&
        createInvoiceDetaillDto.endDate &&
        new Date(createInvoiceDetaillDto.startDate) >=
          new Date(createInvoiceDetaillDto.endDate)
      ) {
        throw new BadRequestException(
          'La fecha de inicio debe ser anterior a la fecha de fin',
        );
      }

      let priceBuy = 0;
      let priceWithoutTax = 0;
      let priceWithTax = 0;
      let taxe = 0;
      let subtotal = 0;
      let isProduct = false;
      let product = null;

      if (createInvoiceDetaillDto.productId) {
        product = await this._productRepository.findOne({
          where: { id: createInvoiceDetaillDto.productId },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        if (!product.isActive)
          throw new BadRequestException('Este producto está inactivo');

        if (isSale && !isQuote) {
          const currentStock = product.amount ?? 0;
          if (amount > currentStock) {
          }
        }

        const prices = this._generalInvoiceDetaillService.getHistoricalPrices(
          product,
          createInvoiceDetaillDto,
        );
        priceBuy = prices.priceBuy;
        priceWithoutTax = prices.priceWithoutTax;

        isProduct = true;
      } else {
        priceBuy = Number(createInvoiceDetaillDto.priceBuy) || 0;
        priceWithoutTax = Number(createInvoiceDetaillDto.priceWithoutTax) || 0;
      }

      if (isNaN(priceWithoutTax) || priceWithoutTax < 0) {
        throw new BadRequestException('El precio sin impuesto no es válido');
      }

      priceWithTax = Number((priceWithoutTax * (1 + taxRate)).toFixed(2));
      taxe = Number((priceWithTax - priceWithoutTax).toFixed(2));
      subtotal = Number((amount * priceWithTax).toFixed(2));

      const detail = this._invoiceDetaillRepository.create({
        amount,
        priceBuy,
        priceWithoutTax,
        priceWithTax,
        taxe,
        subtotal,
        taxeType,
        invoice,
        startDate: createInvoiceDetaillDto.startDate,
        endDate: createInvoiceDetaillDto.endDate,
      });

      if (product) detail.product = product;

      const savedDetail = await this._invoiceDetaillRepository.save(detail);

      if (isProduct) {
        const currentAmount = Number(product.amount) || 0;

        if (isSale && !isQuote) {
          product.amount = currentAmount - amount;
        } else if (isBuy) {
          product.amount = currentAmount + amount;
        } else if (isQuote) {
          this._eventEmitter.emit('invoice.detail.cotizacion', {
            invoice,
            product,
          });
        }
      }

      const savePromises = [
        isProduct && !isQuote
          ? this._productRepository.save(product)
          : Promise.resolve(),
        this._generalInvoiceDetaillService.updateInvoiceTotal(invoiceId),
      ];

      await Promise.all(savePromises);

      this._eventEmitter.emit('invoice.detail.created', {
        invoice,
        isProduct,
      });

      let stockInfo = null;
      if (isProduct && product) {
        const previousStock =
          isSale && !isQuote ? product.amount + amount : product.amount;
        const currentStock = product.amount;

        stockInfo = {
          productName: product.name,
          previousStock,
          currentStock,
          requestedAmount: amount,
          hasStockWarning: isSale && !isQuote && amount > previousStock,
          isQuote,
          operationType: isQuote ? 'cotizacion' : isSale ? 'venta' : 'compra',
        };
      }

      return {
        ...savedDetail,
        stockInfo,
      };
    } catch (error) {
      console.error('❌ Error al crear detalle:', error);

      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Ocurrió un error al crear el detalle',
      );
    }
  }

  async delete(invoiceDetaillId: number) {
    const detail = await this._invoiceDetaillRepository.findOne({
      where: { invoiceDetaillId },
      relations: ['invoice', 'product', 'invoice.invoiceType'],
    });

    if (!detail) {
      throw new NotFoundException(
        `Detalle con ID ${invoiceDetaillId} no encontrado`,
      );
    }

    const { invoice, product, amount: detailAmount } = detail;
    const invoiceTypeCode = invoice.invoiceType.code;
    const isSale = invoiceTypeCode === 'FV';
    const isBuy = invoiceTypeCode === 'FC';
    const isQuote = invoiceTypeCode === 'CO';

    const ops: Promise<any>[] = [];

    if (product && !isQuote) {
      const currentAmount = Number(product.amount ?? 0);
      const amt = Number(detailAmount ?? 0);

      if (isNaN(currentAmount) || isNaN(amt)) {
        throw new Error(
          `Stock inválido: product.amount=${product.amount}, detail.amount=${detail.amount}`,
        );
      }

      if (isSale) {
        product.amount = currentAmount + amt;
      } else if (isBuy) {
        const newAmount = currentAmount - amt;
        if (newAmount < 0) {
          throw new BadRequestException(
            `No se puede eliminar: dejaría el stock del producto ${product.name} en negativo`,
          );
        }
        product.amount = newAmount;
      }

      ops.push(this._productRepository.save(product));
    }

    await this._invoiceDetaillRepository.remove(detail);

    await this._generalInvoiceDetaillService.updateInvoiceTotal(
      invoice.invoiceId,
    );

    await Promise.all(ops);

    this._eventEmitter.emit('invoice.detail.deleted', {
      invoice,
      isProduct: !!product,
    });

    return {
      invoiceId: invoice.invoiceId,
      deletedDetailId: invoiceDetaillId,
    };
  }
}
