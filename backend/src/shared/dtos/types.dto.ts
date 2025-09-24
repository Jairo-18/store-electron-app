import { ApiProperty } from '@nestjs/swagger';

export class BaseTypeDto {
  @ApiProperty({
    example: 'USR',
    description: 'Código único del tipo',
  })
  code?: string;

  @ApiProperty({
    example: 'Usuario',
    description: 'Nombre descriptivo del tipo',
  })
  name?: string;
}

export class RoleTypeDto extends BaseTypeDto {
  @ApiProperty({
    example: '1',
    description: 'Identificador único del rol',
  })
  id: string;
}

export class IdentificationTypeDto extends BaseTypeDto {
  @ApiProperty({
    example: 2,
    description: 'Identificador único de la identificación',
  })
  id: number;

  @ApiProperty({
    example: 'CC',
    description: 'Tipo de código',
  })
  code?: string;

  @ApiProperty({
    example: 'CEDULA DE CIUDADANIA',
    description: 'Nombre del tipo de identificación',
  })
  name?: string;
}

export class PhoneCodeDto extends BaseTypeDto {
  @ApiProperty({
    example: 2,
    description: 'Identificador único de código de país',
  })
  id: number;

  @ApiProperty({
    example: '+57',
    description: 'Tipo de código',
  })
  code?: string;

  @ApiProperty({
    example: 'COLOMBIA',
    description: 'Nombre del tipo de código de país',
  })
  name?: string;
}

export class PayTypeDto extends BaseTypeDto {
  @ApiProperty({
    example: 2,
    description: 'ID del tipo de pago (PayType)',
  })
  payTypeId: number;

  @ApiProperty({
    example: 'PAG',
    description: 'Tipo de código',
  })
  code?: string;

  @ApiProperty({
    example: 'PAGADO',
    description: 'Nombre del tipo de pago',
  })
  name?: string;
}

export class InvoiceTypeDto extends BaseTypeDto {
  @ApiProperty({
    example: 2,
    description: 'ID del tipo de factura (InvoiceType)',
  })
  invoiceTypeId: number;

  @ApiProperty({
    example: 'FV',
    description: 'Tipo de código',
  })
  code?: string;

  @ApiProperty({
    example: 'FACTURA DE VENTA',
    description: 'Nombre del tipo de factura',
  })
  name?: string;
}

export class PaidTypeDto extends BaseTypeDto {
  @ApiProperty({
    example: 2,
    description: 'ID del tipo de estado pago (PaidType)',
  })
  paidTypeId: number;

  @ApiProperty({
    example: 'EFE',
    description: 'Tipo de código',
  })
  code?: string;

  @ApiProperty({
    example: 'EFECTIVO',
    description: 'Nombre del tipo de estado de pago',
  })
  name?: string;
}

export class CategoryTypeDto extends BaseTypeDto {
  @ApiProperty({
    example: 2,
    description: 'ID del tipo de estado pago (CategoryType)',
  })
  categoryTypeId: number;

  @ApiProperty({
    example: 'MEC',
    description: 'Tipo de código',
  })
  code?: string;

  @ApiProperty({
    example: 'MECATO',
    description: 'Nombre del tipo de categoría',
  })
  name?: string;
}

export class TaxeTypeDto {
  @ApiProperty({
    example: 2,
    description: 'ID del tipo de impuesto (TaxeType)',
  })
  taxeTypeId: number;

  @ApiProperty({
    example: 'IVA',
    description: 'Nombre del tipo de impuesto',
  })
  name: string;

  @ApiProperty({
    example: 0.19,
    description: 'Porcentaje de impuesto',
  })
  percentage?: number;
}
