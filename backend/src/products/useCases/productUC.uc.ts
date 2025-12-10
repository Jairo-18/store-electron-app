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

  async paginatedList(
    params: PaginatedListProductsParamsDto,
    hotelId: string,
  ) {
    return await this._crudProductService.paginatedList(params, hotelId);
  }

  async paginatedListForAdmin(params: PaginatedListProductsParamsDto) {
    return await this._crudProductService.paginatedListForAdmin(params);
  }

  async paginatedPartialProduct(
    params: PaginatedProductSelectParamsDto,
    hotelId: string,
  ) {
    return await this._crudProductService.paginatedPartialProducts(
      params,
      hotelId,
    );
  }

  async paginatedPartialProductForAdmin(
    params: PaginatedProductSelectParamsDto,
  ) {
    return await this._crudProductService.paginatedPartialProductsForAdmin(
      params,
    );
  }
}
