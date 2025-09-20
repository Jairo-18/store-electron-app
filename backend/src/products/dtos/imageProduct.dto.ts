import { ImageProduct } from './../../shared/entities/imageProduct.entity';
import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/shared/dtos/response.dto';
import {
  EXAMPLE_IMAGE,
  EXAMPLE_IMAGE_BY_ID,
} from '../constants/examplesProduct.conts';

export class UploadImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen a subir',
  })
  file: string;
}

export class UpdateImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Nueva imagen que reemplazará la existente',
  })
  file: string;
}

export class ImageResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  url: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty()
  productId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class GetImageDto implements BaseResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Object,
    example: EXAMPLE_IMAGE,
  })
  data: ImageProduct;
}

export class GetImageByIdDto implements BaseResponseDto {
  @ApiProperty({
    example: HttpStatus.OK,
  })
  statusCode: number;

  @ApiProperty({
    type: Object,
    example: EXAMPLE_IMAGE_BY_ID,
  })
  data: ImageProduct;
}
