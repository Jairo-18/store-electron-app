import { RepositoryService } from './../../shared/services/repositoriry.service';
import { CreateRelatedDataServicesAndProductsDto } from './../dtos/product.dto';
import { ProductRepository } from './../../shared/repositories/product.repository';
import { PageMetaDto } from './../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from './../../shared/dtos/pagination.dto';
import { Product } from './../../shared/entities/product.entity';
import { Injectable } from '@nestjs/common';
import { Equal, FindOptionsWhere, ILike } from 'typeorm';
import { ProductInterfacePaginatedList } from '../interface/product.interface';
import {
  PaginatedListProductsParamsDto,
  PaginatedProductSelectParamsDto,
  PartialProductDto,
} from '../dtos/product.dto';

@Injectable()
export class CrudProductService {
  constructor(
    private readonly _productRepository: ProductRepository,
    private readonly _repositoriesService: RepositoryService,
  ) {}

  async getRelatedDataToCreate(): Promise<CreateRelatedDataServicesAndProductsDto> {
    const categoryType =
      await this._repositoriesService.repositories.categoryType.find({
        select: ['id', 'name', 'code'],
      });

    return { categoryType };
  }

  async paginatedList(params: PaginatedListProductsParamsDto) {
    const skip = (params.page - 1) * params.perPage;
    const where: FindOptionsWhere<Product>[] = [];

    const baseConditions: FindOptionsWhere<Product> = {};

    if (params.name) {
      baseConditions.name = ILike(`%${params.name}%`);
    }

    if (params.code) {
      baseConditions.code = ILike(`%${params.code}%`);
    }

    if (params.description) {
      baseConditions.description = ILike(`%${params.description}%`);
    }

    if (params.amount !== undefined) {
      baseConditions.amount = Equal(params.amount);
    }

    if (params.priceBuy !== undefined) {
      baseConditions.priceBuy = Equal(params.priceBuy);
    }

    if (params.priceSale !== undefined) {
      baseConditions.priceSale = Equal(params.priceSale);
    }

    if (params.isActive !== undefined) {
      baseConditions.isActive = Equal(params.isActive);
    }

    if (params.categoryType) {
      baseConditions.categoryType = {
        id: params.categoryType,
      };
    }

    if (params.search) {
      const search = params.search.trim();
      const searchConditions: FindOptionsWhere<Product>[] = [
        { name: ILike(`%${search}%`) },
        { code: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
      ];

      const searchNumber = Number(search);
      if (!isNaN(searchNumber)) {
        searchConditions.push(
          { amount: Equal(searchNumber) },
          { priceBuy: Equal(searchNumber) },
          { priceSale: Equal(searchNumber) },
        );
      }

      searchConditions.forEach((condition) => {
        where.push({ ...baseConditions, ...condition });
      });
    } else {
      where.push(baseConditions);
    }

    const [entities, itemCount] = await this._productRepository.findAndCount({
      where,
      skip,
      take: params.perPage,
      order: { createdAt: params.order ?? 'DESC' },
      relations: ['categoryType'],
    });

    const products: ProductInterfacePaginatedList[] = entities.map(
      (product) => ({
        id: product.id,
        code: product.code,
        name: product.name,
        description: product.description,
        amount: product.amount,
        isActive: product.isActive,
        priceBuy: product.priceBuy,
        priceSale: product.priceSale,
        categoryType: product.categoryType
          ? {
              categoryTypeId: product.categoryType.id,
              code: product.categoryType.code,
              name: product.categoryType.name,
            }
          : null,
      }),
    );

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(products, pageMetaDto);
  }

  async paginatedPartialProducts(
    params: PaginatedProductSelectParamsDto,
  ): Promise<ResponsePaginationDto<PartialProductDto>> {
    const skip = (params.page - 1) * params.perPage;
    const where = [];

    if (params.search) {
      const search = params.search.trim();
      where.push({ name: ILike(`%${search}%`) });
    } else {
      where.push({});
    }

    const [entities, itemCount] = await this._productRepository.findAndCount({
      where,
      skip,
      take: params.perPage,
      order: { name: params.order ?? 'ASC' },
      select: ['name'],
    });

    const items: PartialProductDto[] = entities.map((e) => ({
      name: e.name!,
    }));

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(items, pageMetaDto);
  }
}
