import {
  PaginatedListProductsParamsDto,
  PaginatedProductSelectParamsDto,
} from '../dtos/product.dto';
import { Injectable } from '@nestjs/common';
import { CrudProductService } from '../services/product.service';

@Injectable()
export class ProductUC {
  constructor(private _crudProductService: CrudProductService) {}

  async getRelatedDataToCreate() {
    return await this._crudProductService.getRelatedDataToCreate();
  }

  async paginatedList(params: PaginatedListProductsParamsDto) {
    return await this._crudProductService.paginatedList(params);
  }

  async paginatedPartialProduct(params: PaginatedProductSelectParamsDto) {
    return await this._crudProductService.paginatedPartialProducts(params);
  }
}
