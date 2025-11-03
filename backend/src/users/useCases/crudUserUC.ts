import { Injectable } from '@nestjs/common';
import { CrudUserService } from '../services/crudUser.service';
import { CreateUserDto, UpdateUserDto } from '../dtos/crudUser.dto';

@Injectable()
export class CrudUserUC {
  constructor(private readonly _crudUserService: CrudUserService) {}

  async create(createUserDto: CreateUserDto, creatorHotelId?: number) {
    return await this._crudUserService.create(createUserDto, creatorHotelId);
  }

  async findAll(hotelId?: number) {
    return await this._crudUserService.findAll(hotelId);
  }

  async findOne(id: string, hotelId?: number) {
    return await this._crudUserService.findOne(id, hotelId);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updaterHotelId?: number,
  ) {
    return await this._crudUserService.update(
      id,
      updateUserDto,
      updaterHotelId,
    );
  }

  async delete(id: string, deleterHotelId?: number) {
    return await this._crudUserService.delete(id, deleterHotelId);
  }

  async createForAdmin(createUserDto: CreateUserDto, targetHotelId: number) {
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

  async deleteForAdmin(id: string) {
    return await this._crudUserService.deleteForAdmin(id);
  }
}
