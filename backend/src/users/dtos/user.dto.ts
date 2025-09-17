import {
  IdentificationTypeDto,
  PhoneCodeDto,
  RoleTypeDto,
} from './../../shared/dtos/types.dto';
import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';
import { ParamsPaginationDto } from 'src/shared/dtos/pagination.dto';

export interface CreateUserRelatedDataDto {
  roleType?: RoleTypeDto[];
  identificationType: IdentificationTypeDto[];
  phoneCode: PhoneCodeDto[];
}

export class CreateUserRelatedDataReponseDto {
  @ApiProperty({
    type: Number,
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Object,
    example: {
      roleType: [
        {
          id: '7ec4336b-2131-426c-80f4-c1c3a7b5ccc0',
          code: 'ADM',
          name: 'Administrador',
        },
        {
          id: '48e2bd67-6c7f-40fa-acc6-b57c55b7617e',
          code: 'CLI',
          name: 'Cliente',
        },
      ],
      identificationType: [
        { id: '1', code: 'CC', name: 'Cédula de ciudadanía' },
        { id: '2', code: 'TI', name: 'Tarjeta de identidad' },
      ],
      phoneCode: [
        { id: '11', code: '+57', name: 'Colombia' },
        { id: '2', code: '+1', name: 'Estados Unidos' },
      ],
    },
  })
  data: CreateUserRelatedDataDto;
}

export class PaginatedListUsersParamsDto extends ParamsPaginationDto {
  @ApiProperty({
    example: 'Cédula de ciudadania',
    description: 'Nombre del tipo de identificación',
    required: false,
  })
  @IsOptional()
  @IsString()
  identificationType?: string;

  @ApiProperty({
    example: '1120066430',
    required: false,
  })
  @IsOptional()
  @IsString()
  identificationNumber?: string;

  @ApiProperty({
    example: 'Jhon',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Legarda',
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'test@gmail.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '+57 Colombia',
    required: false,
  })
  @IsOptional()
  @IsString()
  phoneCode?: string;

  @ApiProperty({
    example: '3102103660',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'uuid-del-rol',
    description: 'UUID del rol',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  roleType?: string;

  @ApiProperty({
    example: false,
    description: 'Boolean',
    required: false,
  })
  @IsOptional()
  @IsString()
  isActive?: boolean;
}

export class PaginatedUserSelectParamsDto extends ParamsPaginationDto {
  @ApiProperty({
    example: 'Jhon',
    description: 'Buscar por nombre, apellido o identificación',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}

export class PartialUserDto {
  @ApiProperty({
    example: 'Jhon',
    description: 'Nombre del usuario',
  })
  firstName: string;

  @ApiProperty({
    example: 'Legarda',
    description: 'Apellido del usuario',
  })
  lastName: string;

  @ApiProperty({
    example: '1120066430',
    description: 'Número de identificación del usuario',
  })
  identificationNumber: string;
}

export class UserResponseDto {
  id: string;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isActive: boolean;
  roleTypeId?: string;
  identificationTypeId?: number;
  phoneCodeId?: number;
  roleType?: { id: string; code: string; name: string };
  identificationType?: { id: number; code: string; name: string };
  phoneCode?: { id: number; code: string; name: string };
}
