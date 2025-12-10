import { Injectable } from '@nestjs/common';
import { HotelService } from '../services/hotel.service';
import {
  CreateHotelDto,
  UpdateHotelDto,
  QueryHotelDto,
} from '../dtos/hotel.dto';

@Injectable()
export class HotelUseCase {
  constructor(private readonly _hotelService: HotelService) {}

  async create(createHotelDto: CreateHotelDto) {
    return await this._hotelService.create(createHotelDto);
  }

  async findAll(query: QueryHotelDto) {
    return await this._hotelService.findAll(query);
  }

  async findOne(id: string) {
    return await this._hotelService.findOne(id);
  }

  async update(id: string, updateHotelDto: UpdateHotelDto) {
    return await this._hotelService.update(id, updateHotelDto);
  }

  async delete(id: string) {
    return await this._hotelService.delete(id);
  }
}
