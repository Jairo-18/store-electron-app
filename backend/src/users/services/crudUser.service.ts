/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvoiceRepository } from './../../shared/repositories/invoice.repository';
import { NOT_FOUND_MESSAGE } from './../../shared/constants/messages.constant';
import { RoleTypeRepository } from './../../shared/repositories/roleType.repository';
import { UpdateUserModel, UserFiltersModel } from './../models/user.model';
import { PhoneCodeRepository } from './../../shared/repositories/phoneCode.repository';
import { IdentificationTypeRepository } from '../../shared/repositories/identificationType.repository';
import { UserRepository } from '../../shared/repositories/user.repository';
import { User } from '../../shared/entities/user.entity';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Not } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../dtos/crudUser.dto';

@Injectable()
export class CrudUserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _roleTypeRepository: RoleTypeRepository,
    private readonly _identificationTypeRepository: IdentificationTypeRepository,
    private readonly _phoneCodeRepository: PhoneCodeRepository,
    private readonly _invoiceRepository: InvoiceRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ rowId: string }> {
    createUserDto.email = createUserDto.email?.trim().toLowerCase() || null;

    if (createUserDto.email) {
      const existingUserByEmail = await this._userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUserByEmail) {
        throw new HttpException('El email ya está en uso', HttpStatus.CONFLICT);
      }
    }

    const existingUserByIdentification = await this._userRepository.findOne({
      where: {
        identificationType: { id: Number(createUserDto.identificationType) },
        identificationNumber: createUserDto.identificationNumber,
      },
    });
    if (existingUserByIdentification) {
      throw new HttpException(
        'El usuario ya existe con esta identificación',
        HttpStatus.CONFLICT,
      );
    }

    const existingPhoneUser = await this._userRepository.findOne({
      where: {
        phoneCode: { id: Number(createUserDto.phoneCode) },
        phone: createUserDto.phone,
      },
    });
    if (existingPhoneUser) {
      throw new HttpException(
        'Este número ya está en uso',
        HttpStatus.CONFLICT,
      );
    }

    const roleType =
      createUserDto.roleType && createUserDto.roleType.trim() !== ''
        ? await this._roleTypeRepository.findOne({
            where: { id: String(createUserDto.roleType) },
          })
        : await this._roleTypeRepository.findOne({
            where: { id: '4a96be8d-308f-434f-9846-54e5db3e7d95' },
          });

    const identificationType = await this._identificationTypeRepository.findOne(
      {
        where: { id: Number(createUserDto.identificationType) },
      },
    );

    const phoneCode = await this._phoneCodeRepository.findOne({
      where: { id: Number(createUserDto.phoneCode) },
    });

    if (!roleType || !identificationType || !phoneCode) {
      throw new HttpException(
        'Rol, tipo de identificación o código de teléfono inválido',
        HttpStatus.NOT_FOUND,
      );
    }

    const userConfirm: Partial<User> = {
      ...createUserDto,
      roleType,
      identificationType,
      phoneCode,
    };

    const res = await this._userRepository.insert(userConfirm);
    return { rowId: res.identifiers[0].id };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExist = await this.findOne(id);
    if (!userExist) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.email) {
      const emailExist = await this._userRepository.findOne({
        where: { id: Not(id), email: updateUserDto.email },
      });
      if (emailExist) {
        throw new HttpException(
          'Ya existe un usuario con este correo',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (
      updateUserDto.identificationType ||
      updateUserDto.identificationNumber
    ) {
      const identificationNumberExist = await this._userRepository.findOne({
        where: {
          id: Not(id),
          identificationNumber: updateUserDto.identificationNumber,
          identificationType: { id: Number(updateUserDto.identificationType) },
        },
      });
      if (identificationNumberExist) {
        throw new HttpException(
          'Ya existe un usuario con ese tipo y número de identificación',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateUserDto.phoneCode || updateUserDto.phone) {
      const phoneExist = await this._userRepository.findOne({
        where: {
          id: Not(id),
          phone: updateUserDto.phone,
          phoneCode: { id: Number(updateUserDto.phoneCode) },
        },
      });
      if (phoneExist) {
        throw new HttpException(
          'Ya existe un usuario con ese tipo y número de teléfono',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const roleType = updateUserDto.roleType
      ? await this._roleTypeRepository.findOne({
          where: { id: String(updateUserDto.roleType) },
        })
      : userExist.roleType;

    const identificationType = updateUserDto.identificationType
      ? await this._identificationTypeRepository.findOne({
          where: { id: Number(updateUserDto.identificationType) },
        })
      : userExist.identificationType;

    const phoneCode = updateUserDto.phoneCode
      ? await this._phoneCodeRepository.findOne({
          where: { id: Number(updateUserDto.phoneCode) },
        })
      : userExist.phoneCode;

    const updatedUser: Partial<User> = {
      ...updateUserDto,
      roleType,
      identificationType,
      phoneCode,
    };

    return await this._userRepository.update({ id }, updatedUser);
  }

  async findAll(): Promise<User[]> {
    const users = await this._userRepository.find({
      relations: ['roleType', 'identificationType', 'phoneCode'],
    });

    return users.map((user) => {
      const { createdAt, updatedAt, ...userWithoutDates } = user;
      if (userWithoutDates.roleType) {
        const { createdAt, updatedAt, deletedAt, ...roleType } =
          userWithoutDates.roleType;
        userWithoutDates.roleType = roleType;
      }
      if (userWithoutDates.identificationType) {
        const { createdAt, updatedAt, deletedAt, ...identificationType } =
          userWithoutDates.identificationType;
        userWithoutDates.identificationType = identificationType;
      }
      if (userWithoutDates.phoneCode) {
        const { createdAt, updatedAt, deletedAt, ...phoneCode } =
          userWithoutDates.phoneCode;
        userWithoutDates.phoneCode = phoneCode;
      }
      return userWithoutDates;
    });
  }

  async findOne(id: string) {
    const { ...user } = await this._userRepository.findOne({
      where: { id },
      relations: ['roleType', 'identificationType', 'phoneCode'],
    });

    if (!user) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    const { createdAt, updatedAt, ...userWithoutDates } = user;
    if (userWithoutDates.roleType) {
      const { createdAt, updatedAt, deletedAt, ...roleType } =
        userWithoutDates.roleType;
      userWithoutDates.roleType = roleType;
    }
    if (userWithoutDates.identificationType) {
      const { createdAt, updatedAt, deletedAt, ...identificationType } =
        userWithoutDates.identificationType;
      userWithoutDates.identificationType = identificationType;
    }
    if (userWithoutDates.phoneCode) {
      const { createdAt, updatedAt, deletedAt, ...phoneCode } =
        userWithoutDates.phoneCode;
      userWithoutDates.phoneCode = phoneCode;
    }

    return userWithoutDates;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);

    const existsInInvoices = await this._invoiceRepository.exist({
      where: [{ user: { id } }],
    });

    if (existsInInvoices) {
      const fullName = `${user.firstName} ${user.lastName}`;
      throw new BadRequestException(
        `El usuario ${fullName} está asociado a una factura y no puede eliminarse.`,
      );
    }

    await this._userRepository.delete(id);
  }

  async findOneByParams(
    params: UserFiltersModel,
    login = false,
    errors = true,
  ): Promise<User> {
    const user = await this._userRepository.findOne({
      where: { ...params.where },
    });
    if (!user && errors) {
      if (!login) {
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      } else {
        throw new UnauthorizedException();
      }
    }
    return user;
  }
}
