import {
  PaginatedListServicesParamsDto,
  PaginatedServiceSelectParamsDto,
  PartialServiceDto,
} from './../dtos/service.dto';
import { ServiceRepository } from './../../shared/repositories/service.repository';
import { Service } from './../../shared/entities/services.entity';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';
import { Injectable } from '@nestjs/common';
import { Equal, FindOptionsWhere, ILike } from 'typeorm';

@Injectable()
export class ServiceService {
  constructor(private readonly _serviceRepository: ServiceRepository) {}

  async paginatedList(params: PaginatedListServicesParamsDto) {
    const skip = (params.page - 1) * params.perPage;
    const where: FindOptionsWhere<Service>[] = [];

    const baseConditions: FindOptionsWhere<Service> = {};

    if (params.code) {
      baseConditions.code = ILike(`%${params.code}%`);
    }

    if (params.name) {
      baseConditions.name = ILike(`%${params.name}%`);
    }

    if (params.description) {
      baseConditions.description = ILike(`%${params.description}%`);
    }

    if (params.priceBuy !== undefined) {
      baseConditions.priceBuy = Equal(params.priceBuy);
    }

    if (params.priceSale !== undefined) {
      baseConditions.priceSale = Equal(params.priceSale);
    }

    if (params.categoryType) {
      baseConditions.categoryType = {
        id: params.categoryType,
      };
    }

    // Búsqueda global
    if (params.search) {
      const search = params.search.trim();
      const searchConditions: FindOptionsWhere<Service>[] = [
        { name: ILike(`%${search}%`) },
        { description: ILike(`%${search}%`) },
        { code: ILike(`%${search}%`) },
      ];

      const searchNumber = Number(search);
      if (!isNaN(searchNumber)) {
        searchConditions.push(
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

    const [entities, itemCount] = await this._serviceRepository.findAndCount({
      where,
      skip,
      take: params.perPage,
      order: { createdAt: params.order ?? 'DESC' },
      relations: ['categoryType'],
    });

    const services = entities.map((service) => ({
      id: service.id,
      code: service.code,
      name: service.name,
      description: service.description,
      priceBuy: service.priceBuy,
      priceSale: service.priceSale,
      categoryType: service.categoryType
        ? {
            categoryTypeId: service.categoryType.id,
            code: service.categoryType.code,
            name: service.categoryType.name,
          }
        : null,
    }));

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(services, pageMetaDto);
  }

  async paginatedPartialServices(
    params: PaginatedServiceSelectParamsDto,
  ): Promise<ResponsePaginationDto<PartialServiceDto>> {
    const skip = (params.page - 1) * params.perPage;
    const where = [];

    if (params.search) {
      const search = params.search.trim();
      where.push({ name: ILike(`%${search}%`) });
    } else {
      where.push({});
    }

    const [entities, itemCount] = await this._serviceRepository.findAndCount({
      where,
      skip,
      take: params.perPage,
      order: { name: params.order ?? 'ASC' },
      select: ['name'], // solo nombre
    });

    const items: PartialServiceDto[] = entities.map((e) => ({
      name: e.name!,
    }));

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(items, pageMetaDto);
  }
}
