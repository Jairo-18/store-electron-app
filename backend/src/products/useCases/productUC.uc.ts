import { Injectable } from '@nestjs/common';
import { ProductService } from '../services/crudProduct.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/crudProduct.dto';

@Injectable()
export class ProductUC {
  constructor(private readonly _productService: ProductService) {}

  async create(id: CreateProductDto) {
    return await this._productService.create(id);
  }

  async update(id: string, productData: UpdateProductDto) {
    return await this._productService.update(id, productData);
  }

  async findAll() {
    return await this._productService.findAll();
  }

  async findOne(id: string) {
    return await this._productService.findOne(id);
  }

  async delete(id: number) {
    return await this._productService.delete(id);
  }
}
