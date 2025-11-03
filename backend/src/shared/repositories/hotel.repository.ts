import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Hotel } from '../entities/hotel.entity';

@Injectable()
export class HotelRepository extends Repository<Hotel> {
  constructor(dataSource: DataSource) {
    super(Hotel, dataSource.createEntityManager());
  }
}
