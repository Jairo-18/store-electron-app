import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ImageProduct } from '../entities/imageProduct.entity';

@Injectable()
export class ImageRepository extends Repository<ImageProduct> {
  constructor(dataSource: DataSource) {
    super(ImageProduct, dataSource.createEntityManager());
  }
}
