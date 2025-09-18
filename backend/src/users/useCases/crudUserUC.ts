import { Injectable } from '@nestjs/common';
import { CrudUserService } from '../services/crudUser.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/crudUser.dto';

@Injectable()
export class CrudUserUC {
  constructor(private readonly _crudUserService: CrudUserService) {}

  async create(createUserDto: CreateUserDto) {
    return await this._crudUserService.create(createUserDto);
  }

  async findAll() {
    return await this._crudUserService.findAll();
  }

  async findOne(id: string) {
    return await this._crudUserService.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this._crudUserService.update(id, updateUserDto);
  }

  async delete(id: string) {
    return await this._crudUserService.delete(id);
  }
}
