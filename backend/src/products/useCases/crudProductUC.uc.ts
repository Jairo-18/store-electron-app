import { Injectable } from '@nestjs/common';
import { ProductService } from '../services/crudProduct.service';
import {
  CreateProductDto,
  UpdateProductDto,
  UpdateProductDtoForAdmin,
} from '../dtos/crudProduct.dto';

@Injectable()
export class CrudProductUC {
  constructor(private readonly _productService: ProductService) {}

  async create(createProductDto: CreateProductDto, hotelId: string) {
    return await this._productService.create(createProductDto, hotelId);
  }

  async createForAdmin(createProductDto: CreateProductDto, hotelId: string) {
    return await this._productService.createForAdmin(createProductDto, hotelId);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    hotelId: string,
  ) {
    return await this._productService.update(id, updateProductDto, hotelId);
  }

  async updateForAdmin(
    id: string,
    updateProductDto: UpdateProductDtoForAdmin,
  ) {
    return await this._productService.updateForAdmin(id, updateProductDto);
  }

  async findAll(hotelId: string) {
    return await this._productService.findAll(hotelId);
  }

  async findAllForAdmin() {
    return await this._productService.findAllForAdmin();
  }

  async findOne(id: string, hotelId: string) {
    return await this._productService.findOne(id, hotelId);
  }

  async findOneForAdmin(id: string) {
    return await this._productService.findOneForAdmin(id);
  }

  async delete(id: number, hotelId: string) {
    return await this._productService.delete(id, hotelId);
  }

  async deleteForAdmin(id: number) {
    return await this._productService.deleteForAdmin(id);
  }
}
