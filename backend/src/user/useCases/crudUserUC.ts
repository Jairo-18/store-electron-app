import { Injectable } from '@nestjs/common';
import { CrudUserService } from '../services/crudUser.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/crudUser.dto';

@Injectable()
export class CrudUserUC {
  constructor(private readonly _crudUserService: CrudUserService) {}

  async create(user: CreateUserDto) {
    return await this._crudUserService.create(user);
  }

  async findAll() {
    return await this._crudUserService.findAll();
  }

  async findOne(id: string) {
    return await this._crudUserService.findOne(id);
  }

  async initData(id: string) {
    return await this._crudUserService.initData(id);
  }

  async update(id: string, userData: UpdateUserDto) {
    return await this._crudUserService.update(id, userData);
  }

  async delete(id: string) {
    return await this._crudUserService.delete(id);
  }
}
