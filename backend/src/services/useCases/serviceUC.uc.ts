import {
  PaginatedListServicesParamsDto,
  PaginatedServiceSelectParamsDto,
} from './../dtos/service.dto';
import {} from '../dtos/crudService.dto';
import { Injectable } from '@nestjs/common';
import { ServiceService } from '../services/service.service';

@Injectable()
export class ServiceUC {
  constructor(private readonly _serviceService: ServiceService) {}

  async paginatedList(params: PaginatedListServicesParamsDto) {
    return await this._serviceService.paginatedList(params);
  }

  async paginatedPartialService(params: PaginatedServiceSelectParamsDto) {
    return await this._serviceService.paginatedPartialServices(params);
  }
}
