import { Injectable } from '@nestjs/common';
import { ProductService } from '../services/crudProduct.service';
import { CreateProductDto, UpdateProductDto } from '../dtos/crudProduct.dto';

@Injectable()
export class CrudProductUC {
  constructor(private readonly _productService: ProductService) {}

  async create(createProductDto: CreateProductDto) {
    return await this._productService.create(createProductDto);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return await this._productService.update(id, updateProductDto);
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
