import { Injectable } from '@nestjs/common';
import { CrudServiceService } from '../services/crudService.service';
import { CreateServiceDto, UpdateServiceDto } from '../dtos/crudService.dto';

@Injectable()
export class CrudServiceUC {
  constructor(private readonly _crudServiceService: CrudServiceService) {}

  async create(id: CreateServiceDto) {
    return await this._crudServiceService.create(id);
  }

  async update(id: number, updateServiceDto: UpdateServiceDto) {
    return await this._crudServiceService.update(id, updateServiceDto);
  }

  async findOne(id: number) {
    return await this._crudServiceService.findOne(id);
  }

  async findAll() {
    return await this._crudServiceService.findAll();
  }

  async delete(id: number) {
    return await this._crudServiceService.delete(id);
  }
}
