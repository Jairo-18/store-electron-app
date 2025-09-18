import { Service } from './../../shared/entities/services.entity';
import {
  GET_ALL_SERVICES_EXAMPLE,
  GET_SERVICE_EXAMPLE,
} from '../constants/exampleServices.conts';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 1, description: 'ID del servicio', required: false })
  @IsNumber()
  @IsOptional()
  id: number;

  @ApiProperty({
    example: 'SER-12',
    description: 'Código de servicio',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El código del servicio es requerido' })
  code: string;

  @ApiProperty({
    example: 'Pago de arriendo',
    description: 'Nombre de servicio',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del servicio es requerido' })
  name: string;

  @ApiProperty({
    example: 'Monto de pago por arrendamiento',
    description: 'Descripción del servicio',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 150000,
    description: 'Precio de compra',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceBuy?: number;

  @ApiProperty({
    example: 200000,
    description: 'Precio de venta',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceSale?: number;

  @ApiProperty({
    example: 2,
    description: 'ID del tipo de categoría (relación con CategoryType)',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'La categoría es requerida' })
  categoryTypeId: number;
}

export class UpdateServiceDto {
  @ApiProperty({
    example: 'SER-12',
    description: 'Código de servicio',
    required: true,
  })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({
    example: 'Pago de arriendo',
    description: 'Nombre de servicio',
    required: true,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Monto de pago por arrendamiento',
    description: 'Descripción del servicio',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 150000,
    description: 'Precio de compra',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceBuy?: number;

  @ApiProperty({
    example: 200000,
    description: 'Precio de venta',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  priceSale?: number;

  @ApiProperty({
    example: 2,
    description: 'ID del tipo de categoría',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryTypeId?: number;
}

export class GetServiceDto implements BaseResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Object,
    example: GET_SERVICE_EXAMPLE,
  })
  data: Service;
}

export interface GetAllServicesResponse {
  services: Service[];
}

export class GetAllServicesResposeDto implements BaseResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Array,
    example: GET_ALL_SERVICES_EXAMPLE,
  })
  data: GetAllServicesResponse;
}
