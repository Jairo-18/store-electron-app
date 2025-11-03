import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { Hotel } from '../../shared/entities/hotel.entity';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { ParamsPaginationDto } from '../../shared/dtos/pagination.dto';

export class CreateHotelDto {
  @ApiProperty({
    example: 'Hotel Paradise',
    required: true,
    description: 'Nombre del hotel',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'HPD001',
    required: true,
    description: 'Código único del hotel',
  })
  @IsString()
  @IsNotEmpty({ message: 'El código es requerido' })
  @MaxLength(50)
  code: string;

  @ApiProperty({
    example: 'Hotel Paradise S.A.S.',
    required: true,
    description: 'Razón social del hotel',
  })
  @IsString()
  @IsNotEmpty({ message: 'La razón social es requerida' })
  @MaxLength(255)
  legalName: string;

  @ApiProperty({
    example: '900123456-7',
    required: true,
    description: 'Número de identificación tributaria',
  })
  @IsString()
  @IsNotEmpty({ message: 'El número de identificación es requerido' })
  @MaxLength(50)
  identificationNumber: string;

  @ApiProperty({
    example: 'hotel@paradise.com',
    required: true,
    description: 'Correo electrónico del hotel',
  })
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  @MaxLength(150)
  email: string;

  @ApiProperty({
    example: 'Bogotá',
    required: true,
    description: 'Ciudad donde se ubica el hotel',
  })
  @IsString()
  @IsNotEmpty({ message: 'La ciudad es requerida' })
  @MaxLength(100)
  city: string;

  @ApiProperty({
    example: 'Cundinamarca',
    required: true,
    description: 'Departamento donde se ubica el hotel',
  })
  @IsString()
  @IsNotEmpty({ message: 'El departamento es requerido' })
  @MaxLength(100)
  department: string;

  @ApiProperty({
    example: 1,
    required: true,
    description: 'ID del código de país para el teléfono',
  })
  @IsNumber()
  @IsNotEmpty({ message: 'El código de país es requerido' })
  phoneCode: number;

  @ApiProperty({
    example: 'Calle 123 # 45-67',
    required: true,
    description: 'Dirección del hotel',
  })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es requerida' })
  @MaxLength(255)
  address: string;

  @ApiPropertyOptional({
    example: 'https://www.hotelparadise.com',
    required: false,
    description: 'Sitio web del hotel',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el hotel está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateHotelDto {
  @ApiPropertyOptional({
    example: 'Hotel Paradise',
    required: false,
    description: 'Nombre del hotel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({
    example: 'HPD001',
    required: false,
    description: 'Código único del hotel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiPropertyOptional({
    example: 'Hotel Paradise S.A.S.',
    required: false,
    description: 'Razón social del hotel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  legalName?: string;

  @ApiPropertyOptional({
    example: '900123456-7',
    required: false,
    description: 'Número de identificación tributaria',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  identificationNumber?: string;

  @ApiPropertyOptional({
    example: 'hotel@paradise.com',
    required: false,
    description: 'Correo electrónico del hotel',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  @MaxLength(150)
  email?: string;

  @ApiPropertyOptional({
    example: 'Bogotá',
    required: false,
    description: 'Ciudad donde se ubica el hotel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({
    example: 'Cundinamarca',
    required: false,
    description: 'Departamento donde se ubica el hotel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @ApiPropertyOptional({
    example: 1,
    required: false,
    description: 'ID del código de país para el teléfono',
  })
  @IsOptional()
  @IsNumber()
  phoneCode?: number;

  @ApiPropertyOptional({
    example: 'Calle 123 # 45-67',
    required: false,
    description: 'Dirección del hotel',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @ApiPropertyOptional({
    example: 'https://www.hotelparadise.com',
    required: false,
    description: 'Sitio web del hotel',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el hotel está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class GetHotelResponseDto implements BaseResponseDto {
  @ApiProperty({
    type: Number,
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Object,
    example: {
      id: 1,
      name: 'Hotel Paradise',
      code: 'HPD001',
      legalName: 'Hotel Paradise S.A.S.',
      identificationNumber: '900123456-7',
      email: 'hotel@paradise.com',
      city: 'Bogotá',
      department: 'Cundinamarca',
      address: 'Calle 123 # 45-67',
      website: 'https://www.hotelparadise.com',
      isActive: true,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  })
  data: Partial<Hotel>;
}

export class QueryHotelDto extends ParamsPaginationDto {
  @ApiPropertyOptional({
    example: true,
    description: 'Filtrar por estado activo/inactivo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: 'Bogotá',
    description: 'Filtrar por ciudad',
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({
    example: 'Cundinamarca',
    description: 'Filtrar por departamento',
    required: false,
  })
  @IsOptional()
  @IsString()
  department?: string;
}
