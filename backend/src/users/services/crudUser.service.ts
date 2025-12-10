import { PasswordService } from './password.service';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvoiceRepository } from './../../shared/repositories/invoice.repository';
import {
  NOT_FOUND_MESSAGE,
  PASSWORDS_NOT_MATCH,
} from './../../shared/constants/messages.constant';
import { RoleTypeRepository } from './../../shared/repositories/roleType.repository';
import { UserFiltersModel } from './../models/user.model';
import { PhoneCodeRepository } from './../../shared/repositories/phoneCode.repository';
import { IdentificationTypeRepository } from '../../shared/repositories/identificationType.repository';
import { UserRepository } from '../../shared/repositories/user.repository';
import { User } from '../../shared/entities/user.entity';
import { Hotel } from '../../shared/entities/hotel.entity';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { Not } from 'typeorm';
import {
  CreateUserDto,
  RecoveryPasswordDto,
  UpdateUserDto,
  UpdateUserDtoForAdmin,
  UserResponse,
} from '../dtos/crudUser.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CrudUserService {
  constructor(
    private readonly _userRepository: UserRepository,
    private readonly _roleTypeRepository: RoleTypeRepository,
    private readonly _identificationTypeRepository: IdentificationTypeRepository,
    private readonly _phoneCodeRepository: PhoneCodeRepository,
    private readonly _invoiceRepository: InvoiceRepository,
    private readonly _passwordService: PasswordService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
    creatorHotelId?: string,
  ): Promise<{ rowId: string }> {
    createUserDto.email = createUserDto.email?.trim().toLowerCase() || null;

    if (!creatorHotelId) {
      throw new HttpException(
        'Tu usuario no tiene un hotel asignado. Contacta al administrador.',
        HttpStatus.FORBIDDEN,
      );
    }

    const finalHotelId = creatorHotelId;

    if (createUserDto.email) {
      const existingUserByEmail = await this._userRepository.findOne({
        where: {
          email: createUserDto.email,
          hotel: { id: finalHotelId },
        },
      });
      if (existingUserByEmail) {
        throw new HttpException(
          'El email ya está en uso en este hotel',
          HttpStatus.CONFLICT,
        );
      }
    }

    const existingUserByIdentification = await this._userRepository.findOne({
      where: {
        identificationType: { id: Number(createUserDto.identificationType) },
        identificationNumber: createUserDto.identificationNumber,
        hotel: { id: finalHotelId },
      },
    });
    if (existingUserByIdentification) {
      throw new HttpException(
        'Ya existe un usuario con esta identificación en este hotel',
        HttpStatus.CONFLICT,
      );
    }

    const existingPhoneUser = await this._userRepository.findOne({
      where: {
        phoneCode: { id: Number(createUserDto.phoneCode) },
        phone: createUserDto.phone,
        hotel: { id: finalHotelId },
      },
    });
    if (existingPhoneUser) {
      throw new HttpException(
        'Este número ya está en uso en este hotel',
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

    const hotel = finalHotelId
      ? await this._userRepository.manager.findOne(Hotel, {
          where: { id: finalHotelId },
        })
      : null;

    if (finalHotelId && !hotel) {
      throw new HttpException('El hotel no existe', HttpStatus.NOT_FOUND);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const { confirmNewPassword, ...createUserData } = createUserDto;

    const userConfirm: Partial<User> = {
      ...createUserData,
      password: hashedPassword,
      roleType,
      identificationType,
      phoneCode,
      hotel: hotel || undefined,
    };

    const res = await this._userRepository.insert(userConfirm);
    return { rowId: res.identifiers[0].id };
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    updaterHotelId?: string,
  ) {
    const userExist = await this.findOne(id, updaterHotelId);
    if (!userExist) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    if (!updaterHotelId) {
      throw new HttpException(
        'Tu usuario no tiene un hotel asignado. Contacta al administrador.',
        HttpStatus.FORBIDDEN,
      );
    }

    const userHotelId = userExist.hotel?.id;
    if (userHotelId !== updaterHotelId) {
      throw new HttpException(
        'No tienes permisos para actualizar este usuario',
        HttpStatus.FORBIDDEN,
      );
    }

    if (updateUserDto.email) {
      const emailExist = await this._userRepository.findOne({
        where: {
          id: Not(id),
          email: updateUserDto.email,
          hotel: { id: updaterHotelId },
        },
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

    const updatedUser: Partial<User> = {};

    if (updateUserDto.identificationNumber !== undefined) {
      updatedUser.identificationNumber = updateUserDto.identificationNumber;
    }
    if (updateUserDto.firstName !== undefined) {
      updatedUser.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName !== undefined) {
      updatedUser.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.email !== undefined) {
      updatedUser.email = updateUserDto.email;
    }
    if (updateUserDto.phone !== undefined) {
      updatedUser.phone = updateUserDto.phone;
    }
    if (updateUserDto.isActive !== undefined) {
      updatedUser.isActive = updateUserDto.isActive;
    }

    if (updateUserDto.roleType) {
      const roleType = await this._roleTypeRepository.findOne({
        where: { id: String(updateUserDto.roleType) },
      });
      if (roleType) {
        updatedUser.roleType = roleType;
      }
    }

    if (updateUserDto.identificationType) {
      const identificationType =
        await this._identificationTypeRepository.findOne({
          where: { id: Number(updateUserDto.identificationType) },
        });
      if (identificationType) {
        updatedUser.identificationType = identificationType;
      }
    }

    if (updateUserDto.phoneCode) {
      const phoneCode = await this._phoneCodeRepository.findOne({
        where: { id: Number(updateUserDto.phoneCode) },
      });
      if (phoneCode) {
        updatedUser.phoneCode = phoneCode;
      }
    }

    return await this._userRepository.update({ id }, updatedUser);
  }

  async findAll(hotelId?: string): Promise<UserResponse[]> {
    if (!hotelId) {
      throw new HttpException(
        'Tu usuario no tiene un hotel asignado. Contacta al administrador.',
        HttpStatus.FORBIDDEN,
      );
    }

    const users = await this._userRepository.find({
      where: { hotel: { id: hotelId } },
      relations: ['roleType', 'identificationType', 'phoneCode', 'hotel'],
    });

    return users.map((user) => {
      const {
        password,
        resetToken,
        resetTokenExpiry,
        createdAt,
        updatedAt,
        roleType,
        identificationType,
        phoneCode,
        hotel,
        ...userData
      } = user;

      return {
        ...userData,
        roleType: roleType
          ? {
              id: roleType.id,
              code: roleType.code,
              name: roleType.name,
            }
          : null,
        identificationType: identificationType
          ? {
              id: identificationType.id,
              code: identificationType.code,
              name: identificationType.name,
            }
          : null,
        phoneCode: phoneCode
          ? {
              id: phoneCode.id,
              code: phoneCode.code,
              name: phoneCode.name,
            }
          : null,
        hotel: hotel
          ? {
              id: hotel.id,
              name: hotel.name,
            }
          : null,
      };
    });
  }

  async findOne(id: string, hotelId?: string): Promise<UserResponse> {
    if (!hotelId) {
      throw new HttpException(
        'Tu usuario no tiene un hotel asignado. Contacta al administrador.',
        HttpStatus.FORBIDDEN,
      );
    }

    const user = await this._userRepository.findOne({
      where: { id, hotel: { id: hotelId } },
      relations: ['roleType', 'identificationType', 'phoneCode', 'hotel'],
    });

    if (!user) {
      throw new HttpException(
        'El usuario no existe o no pertenece a tu hotel',
        HttpStatus.NOT_FOUND,
      );
    }

    const {
      password,
      resetToken,
      resetTokenExpiry,
      createdAt,
      updatedAt,
      roleType,
      identificationType,
      phoneCode,
      hotel,
      ...userData
    } = user;

    return {
      ...userData,
      roleType: roleType
        ? {
            id: roleType.id,
            code: roleType.code,
            name: roleType.name,
          }
        : null,
      identificationType: identificationType
        ? {
            id: identificationType.id,
            code: identificationType.code,
            name: identificationType.name,
          }
        : null,
      phoneCode: phoneCode
        ? {
            id: phoneCode.id,
            code: phoneCode.code,
            name: phoneCode.name,
          }
        : null,
      hotel: hotel
        ? {
            id: hotel.id,
            name: hotel.name,
          }
        : null,
    };
  }

  async delete(id: string, deleterHotelId?: string): Promise<void> {
    const user = await this.findOne(id, deleterHotelId);

    if (!deleterHotelId) {
      throw new HttpException(
        'Tu usuario no tiene un hotel asignado. Contacta al administrador.',
        HttpStatus.FORBIDDEN,
      );
    }

    const userHotelId = user.hotel?.id;
    if (userHotelId !== deleterHotelId) {
      throw new HttpException(
        'No tienes permisos para eliminar este usuario',
        HttpStatus.FORBIDDEN,
      );
    }

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

  async findByParams(params: Record<string, any>): Promise<User> {
    return await this._userRepository.findOne({
      where: [params],
      relations: ['roleType', 'hotel'],
    });
  }

  async generateResetToken(userId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    await this._userRepository.update(userId, {
      resetToken: token,
      resetTokenExpiry: expiryDate,
    });

    return token;
  }

  async recoveryPassword(body: RecoveryPasswordDto) {
    try {
      const user = await this._userRepository.findOne({
        where: { id: body.userId, resetToken: body.resetToken },
      });
      if (!user) {
        throw new HttpException(NOT_FOUND_MESSAGE, HttpStatus.NOT_FOUND);
      }
      if (user.resetTokenExpiry < new Date()) {
        throw new HttpException(
          'Token inválido o expirado',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (body.newPassword !== body.confirmNewPassword) {
        throw new HttpException(PASSWORDS_NOT_MATCH, HttpStatus.CONFLICT);
      }
      await this._userRepository.update(
        { id: body.userId },
        {
          password: await this._passwordService.generateHash(body.newPassword),
          resetToken: null,
          resetTokenExpiry: null,
        },
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createForAdmin(
    createUserDto: CreateUserDto,
    targetHotelId: string,
  ): Promise<{ rowId: string }> {
    createUserDto.email = createUserDto.email?.trim().toLowerCase() || null;

    if (!targetHotelId) {
      throw new HttpException(
        'El hotelId es obligatorio',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createUserDto.email) {
      const existingUserByEmail = await this._userRepository.findOne({
        where: {
          email: createUserDto.email,
          hotel: { id: targetHotelId },
        },
      });
      if (existingUserByEmail) {
        throw new HttpException(
          'El email ya está en uso en este hotel',
          HttpStatus.CONFLICT,
        );
      }
    }

    const existingUserByIdentification = await this._userRepository.findOne({
      where: {
        identificationType: { id: Number(createUserDto.identificationType) },
        identificationNumber: createUserDto.identificationNumber,
        hotel: { id: targetHotelId },
      },
    });
    if (existingUserByIdentification) {
      throw new HttpException(
        'Ya existe un usuario con esta identificación en este hotel',
        HttpStatus.CONFLICT,
      );
    }

    const existingPhoneUser = await this._userRepository.findOne({
      where: {
        phoneCode: { id: Number(createUserDto.phoneCode) },
        phone: createUserDto.phone,
        hotel: { id: targetHotelId },
      },
    });
    if (existingPhoneUser) {
      throw new HttpException(
        'Este número ya está en uso en este hotel',
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

    const hotel = await this._userRepository.manager.findOne(Hotel, {
      where: { id: targetHotelId },
    });

    if (!hotel) {
      throw new HttpException('El hotel no existe', HttpStatus.NOT_FOUND);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const { confirmNewPassword, ...createUserData } = createUserDto;

    const userConfirm: Partial<User> = {
      ...createUserData,
      password: hashedPassword,
      roleType,
      identificationType,
      phoneCode,
      hotel,
    };

    const res = await this._userRepository.insert(userConfirm);
    return { rowId: res.identifiers[0].id };
  }

  async findAllForAdmin(): Promise<UserResponse[]> {
    const users = await this._userRepository.find({
      relations: ['roleType', 'identificationType', 'phoneCode', 'hotel'],
    });

    return users.map((user) => {
      const {
        password,
        resetToken,
        resetTokenExpiry,
        createdAt,
        updatedAt,
        roleType,
        identificationType,
        phoneCode,
        hotel,
        ...userData
      } = user;

      return {
        ...userData,
        roleType: roleType
          ? {
              id: roleType.id,
              code: roleType.code,
              name: roleType.name,
            }
          : null,
        identificationType: identificationType
          ? {
              id: identificationType.id,
              code: identificationType.code,
              name: identificationType.name,
            }
          : null,
        phoneCode: phoneCode
          ? {
              id: phoneCode.id,
              code: phoneCode.code,
              name: phoneCode.name,
            }
          : null,
        hotel: hotel
          ? {
              id: hotel.id,
              name: hotel.name,
            }
          : null,
      };
    });
  }

  async findOneForAdmin(id: string): Promise<UserResponse> {
    const user = await this._userRepository.findOne({
      where: { id },
      relations: ['roleType', 'identificationType', 'phoneCode', 'hotel'],
    });

    if (!user) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    const {
      password,
      resetToken,
      resetTokenExpiry,
      createdAt,
      updatedAt,
      roleType,
      identificationType,
      phoneCode,
      hotel,
      ...userData
    } = user;

    return {
      ...userData,
      roleType: roleType
        ? {
            id: roleType.id,
            code: roleType.code,
            name: roleType.name,
          }
        : null,
      identificationType: identificationType
        ? {
            id: identificationType.id,
            code: identificationType.code,
            name: identificationType.name,
          }
        : null,
      phoneCode: phoneCode
        ? {
            id: phoneCode.id,
            code: phoneCode.code,
            name: phoneCode.name,
          }
        : null,
      hotel: hotel
        ? {
            id: hotel.id,
            name: hotel.name,
          }
        : null,
    };
  }

  async updateForAdmin(id: string, updateUserDto: UpdateUserDtoForAdmin) {
    const userExist = await this.findOneForAdmin(id);
    if (!userExist) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.email) {
      const emailExist = await this._userRepository.findOne({
        where: {
          id: Not(id),
          email: updateUserDto.email,
        },
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

    const updatedUser: Partial<User> = {};

    if (updateUserDto.identificationNumber !== undefined) {
      updatedUser.identificationNumber = updateUserDto.identificationNumber;
    }
    if (updateUserDto.firstName !== undefined) {
      updatedUser.firstName = updateUserDto.firstName;
    }
    if (updateUserDto.lastName !== undefined) {
      updatedUser.lastName = updateUserDto.lastName;
    }
    if (updateUserDto.email !== undefined) {
      updatedUser.email = updateUserDto.email;
    }
    if (updateUserDto.phone !== undefined) {
      updatedUser.phone = updateUserDto.phone;
    }
    if (updateUserDto.isActive !== undefined) {
      updatedUser.isActive = updateUserDto.isActive;
    }

    if (updateUserDto.roleType) {
      const roleType = await this._roleTypeRepository.findOne({
        where: { id: String(updateUserDto.roleType) },
      });
      if (roleType) {
        updatedUser.roleType = roleType;
      }
    }

    if (updateUserDto.identificationType) {
      const identificationType =
        await this._identificationTypeRepository.findOne({
          where: { id: Number(updateUserDto.identificationType) },
        });
      if (identificationType) {
        updatedUser.identificationType = identificationType;
      }
    }

    if (updateUserDto.phoneCode) {
      const phoneCode = await this._phoneCodeRepository.findOne({
        where: { id: Number(updateUserDto.phoneCode) },
      });
      if (phoneCode) {
        updatedUser.phoneCode = phoneCode;
      }
    }

    if (updateUserDto.hotelId !== undefined) {
      const hotel = await this._userRepository.manager.findOne(Hotel, {
        where: { id: updateUserDto.hotelId },
      });

      if (!hotel && updateUserDto.hotelId !== null) {
        throw new HttpException('El hotel no existe', HttpStatus.NOT_FOUND);
      }

      updatedUser.hotel = hotel;
    }

    return await this._userRepository.update({ id }, updatedUser);
  }

  async deleteForAdmin(id: string): Promise<void> {
    const user = await this.findOneForAdmin(id);

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
}
