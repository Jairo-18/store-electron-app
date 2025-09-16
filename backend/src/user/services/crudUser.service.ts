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
import { CreateUserDto } from '../dtos/crudUser.dto';
@Injectable()
export class CrudUserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _roleTypeRepository: RoleTypeRepository,
    private readonly _identificationTypeRepository: IdentificationTypeRepository,
    private readonly _phoneCodeRepository: PhoneCodeRepository,
    private readonly _invoiceRepository: InvoiceRepository,
  ) {}

  async create(user: CreateUserDto): Promise<{ rowId: string }> {
    const salt = await bcrypt.genSalt();

    if (!user.email || user.email.trim() === '') {
      user.email = null;
    } else {
      // Normalizamos a minúsculas si tiene valor
      user.email = user.email.toLowerCase();
    }

    // Validación por email solo si hay valor
    if (user.email) {
      const existingUserByEmail = await this._userRepository.findOne({
        where: { email: user.email },
      });

      if (existingUserByEmail) {
        throw new HttpException('El email ya está en uso', HttpStatus.CONFLICT);
      }
    }

    // Validación por tipo + número de identificación
    const existingUserByIdentification = await this._userRepository.findOne({
      where: {
        identificationType: { id: user.identificationType },
        identificationNumber: user.identificationNumber,
      },
    });

    if (existingUserByIdentification) {
      throw new HttpException(
        'El usuario ya existe con esta identificación',
        HttpStatus.CONFLICT,
      );
    }

    // Validación por código de teléfono + número
    const existingPhoneUser = await this._userRepository.findOne({
      where: {
        phoneCode: { id: user.phoneCode },
        phone: user.phone,
      },
    });

    if (existingPhoneUser) {
      throw new HttpException(
        'Este número ya está en uso',
        HttpStatus.CONFLICT,
      );
    }

    this.validatePasswordMatch(user.password, user.confirmPassword);

    const roleType =
      user.roleType && user.roleType.trim() !== ''
        ? await this._roleTypeRepository.findOne({
            where: { id: user.roleType },
          })
        : await this._roleTypeRepository.findOne({
            where: { id: '4a96be8d-308f-434f-9846-54e5db3e7d95' },
          });

    const identificationType =
      typeof user.identificationType === 'string'
        ? await this._identificationTypeRepository.findOne({
            where: { id: user.identificationType },
          })
        : user.identificationType;

    const phoneCode = await this._phoneCodeRepository.findOne({
      where: { id: user.phoneCode },
    });

    if (!roleType || !identificationType || !phoneCode) {
      throw new HttpException(
        'Rol, tipo de identificación o código de teléfono inválido',
        HttpStatus.NOT_FOUND,
      );
    }

    const userConfirm = {
      ...user,
      password: await bcrypt.hash(user.password, salt),
      roleType,
      identificationType,
      phoneCode,
    };

    const res = await this._userRepository.insert(userConfirm);
    return { rowId: res.identifiers[0].id };
  }

  async update(id: string, userData: UpdateUserModel) {
    const userExist = await this.findOne(id);
    if (userData.email) {
      const emailExist = await this._userRepository.findOne({
        where: { id: Not(id), email: userData.email },
      });

      if (emailExist) {
        throw new HttpException(
          'Ya existe un usuario con este correo',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (userData.identificationType || userData.identificationNumber) {
      const identificationNumberExist = await this._userRepository.findOne({
        where: {
          id: Not(id),
          identificationNumber: userData.identificationNumber,
          identificationType: {
            id: userData.identificationType,
          },
        },
      });
      if (identificationNumberExist) {
        throw new HttpException(
          'Ya existe un usuario con ese tipo y número de identificación',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (userData.phoneCode || userData.phone) {
      const phoneExist = await this._userRepository.findOne({
        where: {
          id: Not(id),
          phone: userData.phone,
          phoneCode: {
            id: userData.phoneCode,
          },
        },
      });
      if (phoneExist) {
        throw new HttpException(
          'Ya existe un usuario con ese tipo y número de teléfono',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (!userExist) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    return await this._userRepository.update(
      { id: id },
      {
        ...userData,
        phoneCode: {
          id: userData.phoneCode || userExist.phoneCode.id,
        },
        roleType: {
          id: userData.roleType || userExist.roleType.id,
        },
        identificationType: {
          id: userData.identificationType || userExist.identificationType.id,
        },
      },
    );
  }

  private validatePasswordMatch(password: string, confirmPassword: string) {
    if (password !== confirmPassword) {
      throw new HttpException(
        'Las contraseñas no coinciden',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<Omit<User, 'password'>[]> {
    const users = await this._userRepository.find({
      relations: ['roleType', 'identificationType', 'phoneCode'],
    });

    return users.map((user) => {
      const { password, createdAt, updatedAt, ...userWithoutDates } = user;

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
    const { password, ...user } = await this._userRepository.findOne({
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

  async findByParams(params: Record<string, any>): Promise<User> {
    return await this._userRepository.findOne({
      where: [params],
      relations: ['roleType'],
    });
  }

  async initData(id: string) {
    const user = await this._userRepository.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    const user = await this.findOne(id);

    const existsInInvoices = await this._invoiceRepository.exist({
      where: [{ user: { id: id } }, { employee: { id: id } }],
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
    login: boolean = false,
    errors: boolean = true,
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

  async findByRoles(roleNames: string[]): Promise<User[]> {
    return this._userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roleType', 'roleType')
      .where('roleType.name IN (:...roleNames)', { roleNames })
      .getMany();
  }
}
