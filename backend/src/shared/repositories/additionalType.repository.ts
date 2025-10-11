import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AdditionalType } from '../entities/additionalType.entity';

@Injectable()
export class AdditionalTypeRepository extends Repository<AdditionalType> {
  constructor(dataSource: DataSource) {
    super(AdditionalType, dataSource.createEntityManager());
  }
}
