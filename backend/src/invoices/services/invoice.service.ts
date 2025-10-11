import { ProductRepository } from './../../shared/repositories/product.repository';
import { CreateInvoiceDetaillDto } from './../dtos/invoiceDetaill.dto';
import { InvoiceDetaill } from './../../shared/entities/invoiceDetaill.entity';
import { Product } from './../../shared/entities/product.entity';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Invoice } from './../../shared/entities/invoice.entity';
import { PaidType } from './../../shared/entities/paidType.entity';
import { PayType } from './../../shared/entities/payType.entity';
import { PaidTypeRepository } from './../../shared/repositories/paidType.repository';
import { PayTypeRepository } from './../../shared/repositories/payType.repository';
import { UserRepository } from './../../shared/repositories/user.repository';
import { InvoiceDetaillRepository } from './../../shared/repositories/invoiceDetaill.repository';
import { TaxeTypeRepository } from './../../shared/repositories/taxeType.repository';
import { InvoiceRepository } from './../../shared/repositories/invoice.repository';
import { InvoiceTypeRepository } from './../../shared/repositories/invoiceType.repository';
import {
  CreateInvoiceDto,
  GetInvoiceWithDetailsDto,
  UpdateInvoiceDto,
} from '../dtos/invoice.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly _invoiceRepository: InvoiceRepository,
    private readonly _invoiceTypeRepository: InvoiceTypeRepository,
    private readonly _taxeTypeRepository: TaxeTypeRepository,
    private readonly _payTypeRepository: PayTypeRepository,
    private readonly _paidTypeRepository: PaidTypeRepository,
    private readonly _invoiceDetaillRepository: InvoiceDetaillRepository,
    private readonly _userRepository: UserRepository,
    private readonly _productRepository: ProductRepository,
    private readonly _eventEmitter: EventEmitter2,
  ) {}

  private toDateOnly(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private async _calculateInvoiceDetails(
    detailsDto: CreateInvoiceDetaillDto[],
  ): Promise<{
    details: InvoiceDetaill[];
    total: number;
    subtotalWithTax: number;
    subtotalWithoutTax: number;
    hasProducts: boolean;
  }> {
    const details: InvoiceDetaill[] = [];
    let subtotalWithoutTax = 0;
    let subtotalWithTax = 0;
    let total = 0;
    let hasProducts = false;

    for (const detailDto of detailsDto) {
      let taxRate = 0;
      let taxeType = null;

      if (detailDto.taxeTypeId) {
        taxeType = await this._taxeTypeRepository.findOne({
          where: { id: detailDto.taxeTypeId },
        });
        if (!taxeType) {
          throw new NotFoundException('Tipo de impuesto no encontrado');
        }
        taxRate =
          taxeType.percentage > 1
            ? taxeType.percentage / 100
            : taxeType.percentage;
      }

      const amount = Number(detailDto.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new BadRequestException('La cantidad debe ser mayor a cero');
      }

      let priceBuy = 0;
      let priceWithoutTax = 0;
      let priceWithTax = 0;
      let detailSubtotal = 0;

      if (detailDto.productId) {
        const product = await this._productRepository.findOne({
          where: { id: detailDto.productId },
        });
        if (!product) {
          throw new NotFoundException('Producto no encontrado');
        }

        priceBuy =
          detailDto.priceBuy !== undefined
            ? Number(detailDto.priceBuy)
            : Number(product.priceBuy);

        priceWithoutTax =
          detailDto.priceWithoutTax !== undefined
            ? Number(detailDto.priceWithoutTax)
            : Number(product.priceSale);

        hasProducts = true;
      } else {
        priceBuy = Number(detailDto.priceBuy) || 0;
        priceWithoutTax = Number(detailDto.priceWithoutTax) || 0;
      }

      priceWithTax = Number((priceWithoutTax * (1 + taxRate)).toFixed(2));
      detailSubtotal = Number((amount * priceWithTax).toFixed(2));

      const detail = this._invoiceDetaillRepository.create({
        amount,
        priceBuy,
        priceWithoutTax,
        priceWithTax,
        subtotal: detailSubtotal,
        taxeType,
        startDate: detailDto.startDate,
        endDate: detailDto.endDate,
      });

      if (detailDto.productId) {
        const product = await this._productRepository.findOne({
          where: { id: detailDto.productId },
        });
        detail.product = product;
      }

      details.push(detail);

      const lineSubtotalWithoutTax = amount * priceWithoutTax;
      const lineSubtotalWithTax = amount * priceWithTax;
      const taxAmount = lineSubtotalWithTax - lineSubtotalWithoutTax;

      subtotalWithoutTax += lineSubtotalWithoutTax;
      subtotalWithTax += taxAmount;
      total += lineSubtotalWithTax;
    }

    subtotalWithoutTax = Math.round(subtotalWithoutTax * 100) / 100;
    subtotalWithTax = Math.round(subtotalWithTax * 100) / 100;
    total = Math.round(total * 100) / 100;

    return {
      details,
      total,
      subtotalWithTax,
      subtotalWithoutTax,
      hasProducts,
    };
  }

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    const invoiceType = await this._invoiceTypeRepository.findOne({
      where: { id: createInvoiceDto.invoiceTypeId },
    });

    if (!invoiceType) {
      throw new BadRequestException('Tipo de factura no encontrado');
    }

    const user = await this._userRepository.findOne({
      where: { id: createInvoiceDto.userId },
    });

    if (!user) throw new BadRequestException('Cliente no encontrado');

    if (!user.isActive) {
      throw new BadRequestException('Este usuario está inactivo');
    }

    const [payType, paidType] = await Promise.all([
      createInvoiceDto.payTypeId
        ? this._payTypeRepository.findOne({
            where: { id: createInvoiceDto.payTypeId },
          })
        : null,
      createInvoiceDto.paidTypeId
        ? this._paidTypeRepository.findOne({
            where: { id: createInvoiceDto.paidTypeId },
          })
        : null,
    ]);

    const invoiceEntity = await this._invoiceRepository.manager.transaction(
      async (manager) => {
        const lastInvoice = await manager
          .getRepository(Invoice)
          .createQueryBuilder('invoice')
          .leftJoin('invoice.invoiceType', 'invoiceType')
          .where('invoiceType.id = :typeId', {
            typeId: createInvoiceDto.invoiceTypeId,
          })
          .orderBy('invoice.invoiceId', 'DESC')
          .getOne();

        let nextNumber = 1;
        if (lastInvoice?.code) {
          const parsed = parseInt(lastInvoice.code, 10);
          if (!isNaN(parsed)) {
            nextNumber = parsed + 1;
          }
        }

        const code = nextNumber.toString().padStart(5, '0');

        const {
          details: invoiceDetaills,
          total,
          subtotalWithTax,
          subtotalWithoutTax,
        } = await this._calculateInvoiceDetails(createInvoiceDto.details ?? []);

        const invoiceRepo = manager.getRepository(Invoice);

        const invoiceData: Partial<Invoice> = {
          code,
          observations: createInvoiceDto.observations,
          invoiceElectronic: createInvoiceDto.invoiceElectronic,
          startDate: this.toDateOnly(createInvoiceDto.startDate),
          endDate: this.toDateOnly(createInvoiceDto.endDate),
          subtotalWithoutTax,
          subtotalWithTax,
          total,
          transfer: createInvoiceDto.transfer || 0,
          cash: createInvoiceDto.cash || 0,
          invoiceDetaills,
          invoiceType,
          user,
          payType: payType ?? undefined,
          paidType: paidType ?? undefined,
        };

        const newInvoice = invoiceRepo.create(invoiceData);
        const saved = await invoiceRepo.save(newInvoice);

        return saved;
      },
    );

    return invoiceEntity;
  }

  async delete(invoiceId: number): Promise<void> {
    const invoice = await this._invoiceRepository.findOne({
      where: { invoiceId },
      relations: ['invoiceType', 'invoiceDetaills', 'invoiceDetaills.product'],
      withDeleted: true,
    });

    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }

    const queryRunner =
      this._invoiceRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isCompra = invoice.invoiceType.code === 'FC';
      const isVenta = invoice.invoiceType.code === 'FV';
      let hasProducts = false;

      for (const detail of invoice.invoiceDetaills) {
        if (detail.product) {
          hasProducts = true;
          const product = await queryRunner.manager.findOneOrFail(Product, {
            where: { id: detail.product.id },
          });

          const currentAmount = Number(product.amount ?? 0);
          const detailAmount = Number(detail.amount ?? 0);

          if (isNaN(currentAmount) || isNaN(detailAmount)) {
            throw new Error(
              `Stock inválido: product.amount=${product.amount}, detail.amount=${detail.amount}`,
            );
          }

          if (isCompra) {
            product.amount = currentAmount - detailAmount;
          } else if (isVenta) {
            product.amount = currentAmount + detailAmount;
          }

          await queryRunner.manager.save(product);
        }
      }

      await queryRunner.manager.delete(InvoiceDetaill, {
        invoice: { invoiceId },
      });

      await queryRunner.manager.delete(Invoice, { invoiceId });

      await queryRunner.commitTransaction();

      this._eventEmitter.emit('invoice.deleted', { invoice, hasProducts });
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async findOne(invoiceId: number): Promise<GetInvoiceWithDetailsDto> {
    const invoice = await this._invoiceRepository.findOne({
      where: { invoiceId },
      relations: [
        'invoiceType',
        'payType',
        'paidType',
        'user',
        'invoiceDetaills',
        'invoiceDetaills.product',
        'user.phoneCode',
        'user.identificationType',
      ],
    });

    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }

    const { totalTaxes } = await this._invoiceDetaillRepository
      .createQueryBuilder('d')
      .select(
        'COALESCE(SUM((d.priceWithTax - d.priceWithoutTax) * d.amount), 0)',
        'totalTaxes',
      )
      .where('d.invoiceId = :invoiceId', { invoiceId })
      .getRawOne();

    return {
      invoiceId: invoice.invoiceId,
      code: invoice.code,
      observations: invoice.observations,
      invoiceElectronic: invoice.invoiceElectronic,
      subtotalWithoutTax: invoice.subtotalWithoutTax?.toString(),
      subtotalWithTax: invoice.subtotalWithTax?.toString(),
      cash: invoice.cash,
      transfer: invoice.transfer,
      total: invoice.total?.toString(),
      totalTaxes: Number(totalTaxes),
      invoiceType: invoice.invoiceType
        ? {
            id: invoice.invoiceType.id,
            code: invoice.invoiceType.code,
            name: invoice.invoiceType.name,
          }
        : undefined,
      payType: invoice.payType
        ? {
            id: invoice.payType.id,
            code: invoice.payType.code,
            name: invoice.payType.name,
          }
        : undefined,
      paidType: invoice.paidType
        ? {
            id: invoice.paidType.id,
            code: invoice.paidType.code,
            name: invoice.paidType.name,
          }
        : undefined,
      user: invoice.user && {
        id: invoice.user.id,
        firstName: invoice.user.firstName,
        lastName: invoice.user.lastName,
        identificationNumber: invoice.user.identificationNumber,
        identificationType: invoice.user.identificationType
          ? {
              id: Number(invoice.user.identificationType.id),
              code: invoice.user.identificationType.code,
              name: invoice.user.identificationType.name,
            }
          : undefined,
      },
      invoiceDetaills: invoice.invoiceDetaills.map((detail) => {
        const baseDetail = {
          invoiceDetaillId: detail.invoiceDetaillId,
          amount: Number(detail.amount),
          priceWithoutTax: detail.priceWithoutTax?.toString(),
          priceWithTax: detail.priceWithTax?.toString(),
          subtotal: detail.subtotal?.toString(),
          product: detail.product && {
            productId: detail.product.id,
            name: detail.product.name,
            code: detail.product.code,
            taxe: detail.taxe,
          },
        };
        return baseDetail;
      }),
    };
  }

  async update(
    invoiceId: number,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<GetInvoiceWithDetailsDto> {
    const { payTypeId, paidTypeId, invoiceElectronic, observations } =
      updateInvoiceDto;

    const queryRunner =
      this._invoiceRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoice = await queryRunner.manager.findOne(Invoice, {
        where: { invoiceId: invoiceId },
        relations: ['payType', 'paidType'],
      });

      if (!invoice) {
        throw new NotFoundException('Factura no encontrada');
      }

      if (payTypeId !== undefined) {
        const payType = await queryRunner.manager.findOne(PayType, {
          where: { id: payTypeId },
        });
        if (!payType) {
          throw new BadRequestException('Tipo de pago no válido');
        }
        invoice.payType = payType;
      }

      if (paidTypeId !== undefined) {
        const paidType = await queryRunner.manager.findOne(PaidType, {
          where: { id: paidTypeId },
        });
        if (!paidType) {
          throw new BadRequestException('Estado de pago no válido');
        }
        invoice.paidType = paidType;
      }

      if (invoiceElectronic !== undefined) {
        invoice.invoiceElectronic = invoiceElectronic;
      }

      if (observations !== undefined) {
        invoice.observations = observations;
      }

      if (updateInvoiceDto.cash !== undefined)
        invoice.cash = updateInvoiceDto.cash;

      if (updateInvoiceDto.transfer !== undefined)
        invoice.transfer = updateInvoiceDto.transfer;

      await queryRunner.manager.save(invoice);
      await queryRunner.commitTransaction();

      return this.findOne(invoiceId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
