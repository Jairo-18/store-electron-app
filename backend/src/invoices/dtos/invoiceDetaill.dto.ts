import { IdentificationType } from './../../shared/entities/identificationType.entity';
import { PaidType } from './../../shared/entities/paidType.entity';
import { BaseResponseDto } from './../../shared/dtos/response.dto';
import { PayType } from './../../shared/entities/payType.entity';
import { TaxeType } from './../../shared/entities/taxeType.entity';
import { InvoiceType } from './../../shared/entities/invoiceType.entity';
import { CategoryType } from './../../shared/entities/categoryType.entity';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateInvoiceDetaillDto {
  @ApiPropertyOptional({
    description: 'ID del producto asociado al detalle',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({
    description: 'Cantidad de unidades de este ítem',
    example: 2,
  })
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiPropertyOptional({
    description: ' NUEVO: Precio de compra histórico (opcional)',
    example: 800.0,
  })
  @IsOptional()
  @IsNumber()
  priceBuy?: number;

  @ApiProperty({
    description: 'Precio unitario sin impuestos',
    example: 1200.0,
  })
  @IsNumber()
  @IsNotEmpty()
  priceWithoutTax: number;

  @ApiPropertyOptional({
    description: 'ID del tipo de impuesto aplicado al ítem',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  taxeTypeId?: number;

  @ApiPropertyOptional({
    description: 'Fecha de entrada ',
    example: '2025-06-15T14:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Fecha de salida ',
    example: '2025-06-20T10:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;
}

export interface CreateRelatedDataInvoiceDto {
  categoryType: CategoryType[];
  invoiceType?: InvoiceType[];
  taxeType: TaxeType[];
  payType: PayType[];
  paidType: PaidType[];
  identificationType: IdentificationType[];
}

export class CreateRelatedDataInvoiceResponseDto implements BaseResponseDto {
  @ApiProperty({
    type: Number,
    example: HttpStatus.OK,
  })
  statusCode: number;
  @ApiProperty({
    type: Object,
    example: {
      categoryType: [
        {
          id: '1',
          code: 'MEC',
          name: 'MECATO',
        },
        {
          id: '2',
          code: 'BAR',
          name: 'BAR',
        },
      ],
      invoiceType: [
        {
          id: '1',
          code: 'FV',
          name: 'FACTURA DE VENTA',
        },
        {
          id: '2',
          code: 'FC',
          name: 'FACTURA DE COMPRA',
        },
      ],
      taxeType: [
        {
          id: '1',
          name: 'IVA 19%',
          percentage: 19,
        },
        {
          id: '2',
          name: 'IVA 0%',
          percentage: 0,
        },
      ],
      payType: [
        {
          id: '1',
          code: 'EF',
          name: 'EFECTIVO',
        },
        {
          id: '2',
          code: 'TC',
          name: 'TARJETA DE CRÉDITO',
        },
      ],
      paidType: [
        {
          id: '1',
          code: 'PA',
          name: 'PAGADO',
        },
        {
          id: '2',
          code: 'PP',
          name: 'POR PAGAR',
        },
      ],
      identificationType: [
        {
          id: '1',
          code: 'CC',
          name: 'CEDULA DE CIUDADANIA',
        },
        {
          id: '2',
          code: 'NIT',
          name: 'NIT',
        },
      ],
    },
  })
  data: CreateRelatedDataInvoiceDto;
}
