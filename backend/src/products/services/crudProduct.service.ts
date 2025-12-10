/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvoiceDetaillRepository } from './../../shared/repositories/invoiceDetaill.repository';
import { CategoryTypeRepository } from './../../shared/repositories/categoryType.repository';
import { ProductRepository } from './../../shared/repositories/product.repository';
import { HotelRepository } from './../../shared/repositories/hotel.repository';
import { Product } from './../../shared/entities/product.entity';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateProductDtoForAdmin,
  ProductResponse,
} from '../dtos/crudProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly _productRepository: ProductRepository,
    private readonly _categoryTypeRepository: CategoryTypeRepository,
    private readonly _invoiceDetaillRepository: InvoiceDetaillRepository,
    private readonly _hotelRepository: HotelRepository,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    hotelId: string,
  ): Promise<{ rowId: string }> {
    const codeExist = await this._productRepository.findOne({
      where: { code: createProductDto.code, hotel: { id: hotelId } },
    });

    if (codeExist) {
      throw new HttpException('El código ya está en uso', HttpStatus.CONFLICT);
    }

    try {
      const { categoryTypeId, ...productData } = createProductDto;

      const categoryType = await this._categoryTypeRepository.findOne({
        where: { id: categoryTypeId },
      });

      if (!categoryType) {
        throw new BadRequestException('Tipo de categoría no encontrado');
      }

      const hotel = await this._hotelRepository.findOne({
        where: { id: hotelId },
      });

      if (!hotel) {
        throw new BadRequestException('Hotel no encontrado');
      }

      const newProduct = this._productRepository.create({
        ...productData,
        categoryType,
        hotel,
      });

      const res = await this._productRepository.insert(newProduct);
      return { rowId: res.identifiers[0].id };
    } catch (error) {
      console.error('Error creando producto:', error);
      throw new BadRequestException('No se pudo crear el producto');
    }
  }

  async createForAdmin(
    createProductDto: CreateProductDto,
    hotelId: string,
  ): Promise<{ rowId: string }> {
    return this.create(createProductDto, hotelId);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    hotelId: string,
  ): Promise<ProductResponse> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('El ID del producto debe ser un número');
    }

    const product = await this.findOne(id, hotelId);

    if (updateProductDto.code) {
      const codeExist = await this._productRepository.findOne({
        where: { code: updateProductDto.code, hotel: { id: hotelId } },
      });

      if (codeExist && codeExist.id !== parsedId) {
        throw new HttpException(
          'El código ya está en uso por otro producto',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (updateProductDto.categoryTypeId) {
      const category = await this._categoryTypeRepository.findOne({
        where: { id: updateProductDto.categoryTypeId },
      });
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
      const productEntity = await this._productRepository.findOne({
        where: { id: parsedId, hotel: { id: hotelId } },
        relations: ['categoryType', 'hotel'],
      });
      productEntity.categoryType = category;
      await this._productRepository.save(productEntity);
    }

    await this._productRepository.update(parsedId, updateProductDto);

    return await this.findOne(id, hotelId);
  }

  async updateForAdmin(
    id: string,
    updateProductDto: UpdateProductDtoForAdmin,
  ): Promise<ProductResponse> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('El ID del producto debe ser un número');
    }

    const product = await this.findOneForAdmin(id);

    if (updateProductDto.code) {
      const where: any = { code: updateProductDto.code };
      if (updateProductDto.hotelId) {
        where.hotel = { id: updateProductDto.hotelId };
      }
      const codeExist = await this._productRepository.findOne({ where });

      if (codeExist && codeExist.id !== parsedId) {
        throw new HttpException(
          'El código ya está en uso por otro producto',
          HttpStatus.CONFLICT,
        );
      }
    }

    const productEntity = await this._productRepository.findOne({
      where: { id: parsedId },
      relations: ['categoryType', 'hotel'],
    });

    if (!productEntity) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    if (updateProductDto.categoryTypeId) {
      const category = await this._categoryTypeRepository.findOne({
        where: { id: updateProductDto.categoryTypeId },
      });
      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }
      productEntity.categoryType = category;
    }

    if (updateProductDto.hotelId) {
      const hotel = await this._hotelRepository.findOne({
        where: { id: updateProductDto.hotelId },
      });
      if (!hotel) {
        throw new NotFoundException('Hotel no encontrado');
      }
      productEntity.hotel = hotel;
    }

    Object.assign(productEntity, updateProductDto);
    await this._productRepository.save(productEntity);

    return await this.findOneForAdmin(id);
  }

  async findAll(hotelId: string): Promise<ProductResponse[]> {
    const products = await this._productRepository.find({
      where: { hotel: { id: hotelId } },
      relations: ['categoryType', 'hotel'],
    });
    return products.map((product) => this.sanitizeProduct(product));
  }

  async findAllForAdmin(): Promise<ProductResponse[]> {
    const products = await this._productRepository.find({
      relations: ['categoryType', 'hotel'],
    });
    return products.map((product) => this.sanitizeProduct(product));
  }

  async findOne(id: string, hotelId: string): Promise<ProductResponse> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new HttpException(
        'ID de producto inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = await this._productRepository.findOne({
      where: { id: parsedId, hotel: { id: hotelId } },
      relations: ['categoryType', 'hotel'],
    });

    if (!product) {
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
    }

    return this.sanitizeProduct(product);
  }

  async findOneForAdmin(id: string): Promise<ProductResponse> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new HttpException(
        'ID de producto inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = await this._productRepository.findOne({
      where: { id: parsedId },
      relations: ['categoryType', 'hotel'],
    });

    if (!product) {
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
    }

    return this.sanitizeProduct(product);
  }

  async delete(id: number, hotelId: string): Promise<void> {
    const product = await this.findOne(id.toString(), hotelId);

    const invoiceDetailCount = await this._invoiceDetaillRepository.count({
      where: {
        product: { id },
      },
    });

    if (invoiceDetailCount > 0) {
      throw new BadRequestException(
        `El producto ${product.name} está asociado a una factura y no puede eliminarse.`,
      );
    }

    await this._productRepository.delete(id);
  }

  async deleteForAdmin(id: number): Promise<void> {
    const product = await this.findOneForAdmin(id.toString());

    const invoiceDetailCount = await this._invoiceDetaillRepository.count({
      where: {
        product: { id },
      },
    });

    if (invoiceDetailCount > 0) {
      throw new BadRequestException(
        `El producto ${product.name} está asociado a una factura y no puede eliminarse.`,
      );
    }

    await this._productRepository.delete(id);
  }

  private sanitizeProduct(product: Product): ProductResponse {
    const { createdAt, updatedAt, deletedAt, categoryType, hotel, ...productData } = product;

    return {
      ...productData,
      categoryType: categoryType
        ? {
            id: categoryType.id,
            code: categoryType.code,
            name: categoryType.name,
          }
        : null,
      hotel: hotel
        ? {
            id: hotel.id,
            name: hotel.name,
          }
        : null,
    };
  }
}
