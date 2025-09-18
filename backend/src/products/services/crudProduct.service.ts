/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvoiceDetaillRepository } from './../../shared/repositories/invoiceDetaill.repository';
import { CategoryTypeRepository } from './../../shared/repositories/categoryType.repository';
import { ProductRepository } from './../../shared/repositories/product.repository';
import { Product } from './../../shared/entities/product.entity';

import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '../dtos/crudProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly _productRepository: ProductRepository,
    private readonly _categoryTypeRepository: CategoryTypeRepository,
    private readonly _invoiceDetaillRepository: InvoiceDetaillRepository,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<{ rowId: string }> {
    const codeExist = await this._productRepository.findOne({
      where: { code: createProductDto.code },
    });

    if (codeExist) {
      throw new HttpException('El código ya está en uso', HttpStatus.CONFLICT);
    }

    try {
      const { categoryTypeId, ...productData } = createProductDto;

      // Carga las entidades relacionadas
      const categoryType = await this._categoryTypeRepository.findOne({
        where: { id: categoryTypeId },
      });

      if (!categoryType) {
        throw new BadRequestException('Tipo de categoría no encontrado');
      }

      const newProduct = this._productRepository.create({
        ...productData,
        categoryType,
      });

      const res = await this._productRepository.insert(newProduct);
      return { rowId: res.identifiers[0].id };
    } catch (error) {
      console.error('Error creando producto:', error);
      throw new BadRequestException('No se pudo crear el producto');
    }
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('El ID del producto debe ser un número');
    }

    const product = await this._productRepository.findOne({
      where: { id: parsedId },
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    // Solo verificamos el código si se está intentando actualizar
    if (updateProductDto.code) {
      // Buscamos si existe algún producto con ese código
      const codeExist = await this._productRepository.findOne({
        where: { code: updateProductDto.code },
      });

      // Lanzamos error solo si encontramos un producto diferente con ese código
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
      product.categoryType = category;
    }

    Object.assign(product, updateProductDto);

    return await this._productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    const products = await this._productRepository.find({
      relations: ['categoryType'],
    });
    return products.map((product) => {
      const { createdAt, updatedAt, deletedAt, ...productWithOutDates } =
        product;
      if (productWithOutDates.categoryType) {
        const { createdAt, updatedAt, deletedAt, ...categoryType } =
          productWithOutDates.categoryType;
        productWithOutDates.categoryType = categoryType;
      }
      return productWithOutDates;
    });
  }

  async findOne(id: string): Promise<Product> {
    const parsedId = parseInt(id, 10);

    if (isNaN(parsedId)) {
      throw new HttpException(
        'ID de producto inválido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const product = await this._productRepository.findOne({
      where: { id: parsedId },
      relations: ['categoryType'],
    });

    if (!product) {
      throw new HttpException('El producto no existe', HttpStatus.NOT_FOUND);
    }

    const { createdAt, updatedAt, deletedAt, ...productWithOutDates } = product;
    if (productWithOutDates.categoryType) {
      const { createdAt, updatedAt, deletedAt, ...categoryType } =
        productWithOutDates.categoryType;
      productWithOutDates.categoryType = categoryType;
    }

    return productWithOutDates;
  }

  async delete(id: number): Promise<void> {
    const product = await this.findOne(id.toString());

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
}
