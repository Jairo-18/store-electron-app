import { Injectable } from '@nestjs/common';
import { CrudUserService } from '../services/crudUser.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserDtoForAdmin,
} from '../dtos/crudUser.dto';

@Injectable()
export class CrudUserUC {
  constructor(private readonly _crudUserService: CrudUserService) {}

  async create(createUserDto: CreateUserDto, creatorHotelId?: string) {
    return await this._crudUserService.create(createUserDto, creatorHotelId);
  }

  async findAll(hotelId?: string) {
    return await this._crudUserService.findAll(hotelId);
  }

  async findOne(id: string, hotelId?: string) {
    return await this._crudUserService.findOne(id, hotelId);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updaterHotelId?: string,
  ) {
    return await this._crudUserService.update(
      id,
      updateUserDto,
      updaterHotelId,
    );
  }

  async delete(id: string, deleterHotelId?: string) {
    return await this._crudUserService.delete(id, deleterHotelId);
  }

  async createForAdmin(createUserDto: CreateUserDto, targetHotelId: string) {
    return await this._crudUserService.createForAdmin(
      createUserDto,
      targetHotelId,
    );
  }

  async findAllForAdmin() {
    return await this._crudUserService.findAllForAdmin();
  }

  async findOneForAdmin(id: string) {
    return await this._crudUserService.findOneForAdmin(id);
  }

  async updateForAdmin(id: string, updateUserDto: UpdateUserDtoForAdmin) {
    return await this._crudUserService.updateForAdmin(id, updateUserDto);
  }

  async deleteForAdmin(id: string) {
    return await this._crudUserService.deleteForAdmin(id);
  }
}
