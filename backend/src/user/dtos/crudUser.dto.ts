import { GET_USER_EXAMPLE } from './../constants/examples.conts';
import { User } from './../../shared/entities/user.entity';
import { BaseResponseDto } from './../../shared/dtos/response.dto';
import { NOT_EMPTY_MESSAGE_ID } from './../../shared/constants/validator-messages.const';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { GET_ALL_USER_EXAMPLE } from '../constants/examples.conts';

export class CreateUserDto {
  @ApiProperty({
    example: 'UUID - 48e2bd67-6c7f-40fa-acc6-b57c55b7617e',
    required: true,
    description: 'ID de usuario',
  })
  @IsUUID()
  @IsNotEmpty({ message: NOT_EMPTY_MESSAGE_ID })
  id: string;

  @ApiProperty({
    example: 1,
    required: true,
    description: 'ID del número de identificación',
  })
  @IsString()
  @IsNotEmpty({ message: 'El tipo de identificación es requerido' })
  identificationType: string;

  @ApiProperty({
    example: '1120066430',
    required: true,
    description: 'Número de identificación',
  })
  @IsString()
  @IsNotEmpty({ message: 'El número de identificación es requerido' })
  identificationNumber: string;

  @ApiProperty({
    example: 'Jhon Jairo',
    required: true,
    description: 'Nombres completos',
  })
  @IsString()
  @IsNotEmpty({ message: 'Los nombres son requeridos' })
  firstName: string;

  @ApiProperty({
    example: 'Legarda Erazo',
    required: true,
    description: 'Apellidos completos',
  })
  @IsString()
  @IsNotEmpty({ message: 'Los apellidos completos son requeridos' })
  lastName: string;

  @ApiPropertyOptional({
    example: 'test@gmail.com',
    required: false,
    description: 'Correo electrónico',
  })
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 2,
    required: true,
    description: 'ID de código de país',
  })
  @IsString()
  @IsNotEmpty({ message: 'El prefijo es requerido' })
  phoneCode: string;

  @ApiProperty({
    example: '3102103660',
    required: true,
    description: 'Número de celular',
  })
  @IsNotEmpty({ message: 'El celular es requerido' })
  phone: string;

  @ApiProperty({
    example: 'Test@123',
    required: true,
    description: 'Contraseña',
  })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;

  @ApiProperty({
    example: 'Test@123',
    required: true,
    description: 'Confirmación de contraseña',
  })
  @IsString()
  @IsNotEmpty({ message: 'La confirmación de contraseña es requerida' })
  confirmPassword: string;

  @ApiProperty({
    example: true,
    description: 'Indica si el usuario esta activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    example: 'UUID - f2ba3a2a-dcb7-4397-9c17-c030fd164fed',
    description: 'Rol aignado / uuid',
    required: false,
  })
  @ValidateIf((o) => o.roleType && o.roleType.trim() !== '')
  @IsUUID()
  @IsOptional()
  roleType?: string;
}

export interface GetAllUsersRespose {
  users: Omit<User, 'password'>[];
}

export class GetAllUsersResposeDto implements BaseResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Array,
    example: GET_ALL_USER_EXAMPLE,
  })
  data: GetAllUsersRespose;
}

export class GetUserResponseDto implements BaseResponseDto {
  @ApiProperty({
    type: Number,
    example: HttpStatus.OK,
  })
  statusCode: number;
  @ApiProperty({
    type: Object,
    example: GET_USER_EXAMPLE,
  })
  data: Partial<User>;
}

export class UpdateUserDto {
  @ApiProperty({
    example: 1,
    required: false,
    description: 'ID del número de identificación',
  })
  @IsString()
  @IsOptional()
  identificationType: string;

  @ApiProperty({
    example: '1120066430',
    required: false,
    description: 'Número de identificación',
  })
  @IsString()
  @IsOptional()
  identificationNumber: string;

  @ApiProperty({
    example: 'Camila María',
    required: false,
    description: 'Nombres completos',
  })
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({
    example: 'Peréz Ágreda',
    required: false,
    description: 'Apellidos completos',
  })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({
    example: 'camilaperez@gmail.com',
    required: false,
    description: 'Correo electrónico',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un correo válido' })
  email: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Código de país',
  })
  @IsOptional()
  @IsString()
  phoneCode: string;

  @ApiProperty({
    example: '3102103550',
    required: false,
    description: 'Número de celular',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    example: false,
    description: 'Indica si el usuario esta activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: 'UUID - f2ba3a2a-dcb7-4397-9c17-c030fd164fed',
    description: 'Rol aignado / uuid',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'El ID del rol no es válido' })
  roleType: string;
}
