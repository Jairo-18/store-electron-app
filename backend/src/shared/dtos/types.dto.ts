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
    example: '2',
    description: 'Identificador único del identificación',
  })
  id: string;
}

export class PhoneCodeDto extends BaseTypeDto {
  @ApiProperty({
    example: '3',
    description: 'Identificador único de código de país',
  })
  id: string;
}

export class PayTypeDto extends BaseTypeDto {
  @ApiProperty()
  payTypeId: number;
}

export class InvoiceTypeDto extends BaseTypeDto {
  @ApiProperty()
  invoiceTypeId: number;
}

export class PaidTypeDto extends BaseTypeDto {
  @ApiProperty()
  paidTypeId: number;
}

export class CategoryTypeDto extends BaseTypeDto {
  @ApiProperty()
  categoryTypeId: number;
}

export class BedTypeDto extends BaseTypeDto {
  @ApiProperty()
  bedTypeId: number;
}

export class TaxeTypeDto {
  @ApiProperty()
  taxeTypeId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  percentage?: number;
}
