/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from './../../shared/entities/user.entity';
import { ResponsePaginationDto } from './../../shared/dtos/pagination.dto';
import { PageMetaDto } from './../../shared/dtos/pageMeta.dto';
import { UserRepository } from './../../shared/repositories/user.repository';
import { RepositoryService } from '../../shared/services/repositoriry.service';
import { Injectable } from '@nestjs/common';

import { Equal, FindOptionsWhere, ILike } from 'typeorm';
import {
  CreateUserRelatedDataDto,
  PaginatedListUsersParamsDto,
  PaginatedUserSelectParamsDto,
} from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly _repositoriesService: RepositoryService,
    private readonly _userRepository: UserRepository,
  ) {}

  async getRelatedDataToCreate(): Promise<CreateUserRelatedDataDto> {
    const identificationType =
      await this._repositoriesService.repositories.identificationType.find({
        select: ['id', 'name', 'code'],
      });

    const phoneCode =
      await this._repositoriesService.repositories.phoneCode.find({
        select: ['id', 'name', 'code'],
      });

    const roleType = await this._repositoriesService.repositories.roleType.find(
      {
        select: ['id', 'name', 'code'],
      },
    );

    return { identificationType, roleType, phoneCode };
  }

  async paginatedList(params: PaginatedListUsersParamsDto) {
    const skip = (params.page - 1) * params.perPage;
    const where: FindOptionsWhere<User>[] = [];

    const baseConditions: FindOptionsWhere<User> = {};

    if (params.identificationNumber) {
      baseConditions.identificationNumber = ILike(
        `%${params.identificationNumber}%`,
      );
    }

    if (params.email) {
      baseConditions.email = ILike(`%${params.email}%`);
    }

    if (params.firstName) {
      baseConditions.firstName = ILike(`%${params.firstName}%`);
    }

    if (params.lastName) {
      baseConditions.lastName = ILike(`%${params.lastName}%`);
    }

    if (params.phone) {
      baseConditions.phone = ILike(`%${params.phone}%`);
    }

    if (params.roleType) {
      baseConditions.roleType = { id: params.roleType };
    }

    if (params.isActive !== undefined) {
      baseConditions.isActive = Equal(params.isActive);
    }

    if (params.identificationType) {
      baseConditions.identificationType = {
        id: Number(params.identificationType),
      };
    }

    if (params.phoneCode) {
      baseConditions.phoneCode = {
        id: Number(params.phoneCode),
      };
    }

    if (params.search) {
      const searchConditions: FindOptionsWhere<User>[] = [
        { firstName: ILike(`%${params.search}%`) },
        { lastName: ILike(`%${params.search}%`) },
        { email: ILike(`%${params.search}%`) },
        { identificationNumber: ILike(`%${params.search}%`) },
        { phone: ILike(`%${params.search}%`) },
      ];

      searchConditions.forEach((condition) => {
        where.push({ ...baseConditions, ...condition });
      });
    } else {
      where.push(baseConditions);
    }

    const [entities, itemCount] = await this._userRepository.findAndCount({
      where,
      skip,
      take: params.perPage,
      order: { createdAt: params.order ?? 'DESC' },
      relations: ['roleType', 'identificationType', 'phoneCode'],
    });

    const users = entities.map((user) => {
      const { createdAt, updatedAt, ...rest } = user;
      return {
        ...rest,
        roleTypeId: user?.roleType?.id,
        identificationTypeId: user?.identificationType?.id,
        phoneCodeId: user?.phoneCode?.id,
        roleType: user?.roleType
          ? {
              id: user.roleType.id,
              code: user.roleType.code,
              name: user.roleType.name,
            }
          : null,
        identificationType: user?.identificationType
          ? {
              id: user.identificationType.id,
              code: user.identificationType.code,
              name: user.identificationType.name,
            }
          : null,
        phoneCode: user?.phoneCode
          ? {
              id: user.phoneCode.id,
              code: user.phoneCode.code,
              name: user.phoneCode.name,
            }
          : null,
      };
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(users, pageMetaDto);
  }

  async paginatedUserSelect(params: PaginatedUserSelectParamsDto) {
    const skip = (params.page - 1) * params.perPage;

    const where = [];

    if (params.search) {
      const term = `%${params.search.trim()}%`;

      where.push(
        { firstName: ILike(term) },
        { lastName: ILike(term) },
        { identificationNumber: ILike(term) },
      );
    }

    const [users, itemCount] = await this._userRepository.findAndCount({
      where: where.length ? where : undefined,
      skip,
      take: params.perPage,
      order: { firstName: 'ASC' },
      select: [
        'id',
        'firstName',
        'lastName',
        'identificationNumber',
        'isActive',
      ],
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(users, pageMetaDto);
  }
}
