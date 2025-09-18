import { ParamsPaginationDto } from '../../shared/dtos/pagination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PaginatedListServicesParamsDto extends ParamsPaginationDto {
  @ApiProperty({
    example: 'SER-001',
    description: 'Código del servicio',
    required: false,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    example: 'Recibos de energía',
    description: 'Nombre del servicio',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Este es el valor del recibo de energía',
    description: 'Descripción del servicio',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 150.5,
    description: 'Precio de compra',
    required: false,
  })
  @IsOptional()
  @IsString()
  priceBuy?: number;

  @ApiProperty({
    example: 250.75,
    description: 'Precio de venta',
    required: false,
  })
  @IsOptional()
  @IsString()
  priceSale?: number;

  @ApiProperty({
    example: 2,
    description: 'ID del tipo de categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryType?: number;
}

export class PaginatedServiceSelectParamsDto extends ParamsPaginationDto {
  @ApiProperty({
    example: 'Recibo de energía',
    description: 'Texto de búsqueda por nombre del servicio',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PartialServiceDto {
  @ApiProperty({
    example: 'Recibo de energía',
    description: 'Nombre del servicio',
  })
  name: string;
}
