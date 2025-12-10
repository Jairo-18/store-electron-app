import { BaseResponseDto } from './../../shared/dtos/response.dto';

import {
  GET_ALL_PRODUCTS_EXAMPLE,
  GET_PRODUCT_EXAMPLE,
} from './../constants/examplesProduct.conts';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  Min,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 1, description: 'ID del producto', required: false })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    example: 'CC-12',
    description: 'Código de producto',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El código de producto es requerido' })
  code: string;

  @ApiProperty({
    example: 'Coca Cola 1L',
    description: 'Nombre del producto',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es requerido' })
  name: string;

  @ApiProperty({
    example: 'Bebida gaseosa de 1 litro',
    description: 'Descripción del producto',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 10,
    description: 'Cantidad disponible',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount: number;

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
    example: true,
    description: 'Indica si el producto está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 1,
    description: 'ID del tipo de categoría',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty({ message: 'La categoría es requerida' })
  categoryTypeId: number;

  @ApiProperty({
    example: '972cc47f-6e76-4a94-b34f-2c36f9c34266',
    description: 'ID del hotel',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  hotelId?: string;
}

export class UpdateProductDto {
  @ApiProperty({
    example: 'CC-12',
    description: 'Código de producto',
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty({ message: 'El código de producto es requerido' })
  code: string;

  @ApiProperty({
    example: 'Coca Cola 1L',
    description: 'Nombre del producto',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'Bebida gaseosa de 1 litro',
    description: 'Descripción del producto',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 10, description: 'Cantidad disponible' })
  @IsOptional()
  @Min(0)
  @IsNumber()
  amount?: number;

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
    example: true,
    description: 'Indica si el producto está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 1,
    description: 'ID del tipo de categoría',
    required: true,
  })
  @IsNumber()
  @IsOptional()
  @IsNotEmpty()
  categoryTypeId?: number;
}

export class UpdateProductDtoForAdmin extends UpdateProductDto {
  @ApiProperty({
    example: '972cc47f-6e76-4a94-b34f-2c36f9c34266',
    description: 'ID del hotel',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  hotelId?: string;
}

export interface ProductResponse {
  id: number;
  code?: string;
  name: string;
  description?: string;
  amount?: number;
  priceBuy: number;
  priceSale: number;
  isActive: boolean;
  categoryType?: {
    id: number;
    code: string;
    name: string;
  };
  hotel?: {
    id: string;
    name: string;
  };
}

export interface GetAllProductsRespose {
  products: ProductResponse[];
}

export class GetAllProductsResposeDto implements BaseResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Array,
    example: GET_ALL_PRODUCTS_EXAMPLE,
  })
  data: GetAllProductsRespose;
}

export class GetProductDto implements BaseResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Object,
    example: GET_PRODUCT_EXAMPLE,
  })
  data: ProductResponse;
}
