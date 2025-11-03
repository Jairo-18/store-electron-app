/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Not, ILike, FindOptionsWhere, Equal } from 'typeorm';
import { HotelRepository } from '../../shared/repositories/hotel.repository';
import { PhoneCodeRepository } from '../../shared/repositories/phoneCode.repository';
import { Hotel } from '../../shared/entities/hotel.entity';
import {
  CreateHotelDto,
  UpdateHotelDto,
  QueryHotelDto,
} from '../dtos/hotel.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';

@Injectable()
export class HotelService {
  constructor(
    private readonly _hotelRepository: HotelRepository,
    private readonly _phoneCodeRepository: PhoneCodeRepository,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<{ rowId: number }> {
    createHotelDto.email = createHotelDto.email.trim().toLowerCase();

    const existingHotelByEmail = await this._hotelRepository.findOne({
      where: { email: createHotelDto.email },
    });
    if (existingHotelByEmail) {
      throw new HttpException(
        'Ya existe un hotel con este correo electrónico',
        HttpStatus.CONFLICT,
      );
    }

    const existingHotelByIdentification = await this._hotelRepository.findOne({
      where: { identificationNumber: createHotelDto.identificationNumber },
    });
    if (existingHotelByIdentification) {
      throw new HttpException(
        'Ya existe un hotel con este número de identificación',
        HttpStatus.CONFLICT,
      );
    }

    const existingHotelByCode = await this._hotelRepository.findOne({
      where: { code: createHotelDto.code },
    });
    if (existingHotelByCode) {
      throw new HttpException(
        'Ya existe un hotel con este código',
        HttpStatus.CONFLICT,
      );
    }

    const phoneCode = await this._phoneCodeRepository.findOne({
      where: { id: Number(createHotelDto.phoneCode) },
    });
    if (!phoneCode) {
      throw new HttpException(
        'El código de país no existe',
        HttpStatus.NOT_FOUND,
      );
    }

    const hotel: Partial<Hotel> = {
      ...createHotelDto,
      phoneCode,
    };

    const result = await this._hotelRepository.insert(hotel);
    return { rowId: result.identifiers[0].id };
  }

  async update(id: number, updateHotelDto: UpdateHotelDto) {
    const hotelExist = await this.findOne(id);
    if (!hotelExist) {
      throw new HttpException('El hotel no existe', HttpStatus.NOT_FOUND);
    }

    if (updateHotelDto.email) {
      updateHotelDto.email = updateHotelDto.email.trim().toLowerCase();
      const emailExist = await this._hotelRepository.findOne({
        where: { id: Not(id), email: updateHotelDto.email },
      });
      if (emailExist) {
        throw new HttpException(
          'Ya existe un hotel con este correo electrónico',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (updateHotelDto.identificationNumber) {
      const identificationExist = await this._hotelRepository.findOne({
        where: {
          id: Not(id),
          identificationNumber: updateHotelDto.identificationNumber,
        },
      });
      if (identificationExist) {
        throw new HttpException(
          'Ya existe un hotel con este número de identificación',
          HttpStatus.CONFLICT,
        );
      }
    }

    if (updateHotelDto.code) {
      const codeExist = await this._hotelRepository.findOne({
        where: { id: Not(id), code: updateHotelDto.code },
      });
      if (codeExist) {
        throw new HttpException(
          'Ya existe un hotel con este código',
          HttpStatus.CONFLICT,
        );
      }
    }

    const phoneCode = updateHotelDto.phoneCode
      ? await this._phoneCodeRepository.findOne({
          where: { id: Number(updateHotelDto.phoneCode) },
        })
      : hotelExist.phoneCode;

    if (updateHotelDto.phoneCode && !phoneCode) {
      throw new HttpException(
        'El código de país no existe',
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedHotel: Partial<Hotel> = {
      ...updateHotelDto,
      phoneCode,
    };

    return await this._hotelRepository.update({ id }, updatedHotel);
  }

  async findAll(params: QueryHotelDto): Promise<ResponsePaginationDto<Hotel>> {
    const skip = (params.page - 1) * params.perPage;
    const where: FindOptionsWhere<Hotel>[] = [];

    const baseConditions: FindOptionsWhere<Hotel> = {};

    if (params.isActive !== undefined) {
      baseConditions.isActive = Equal(params.isActive);
    }

    if (params.city) {
      baseConditions.city = ILike(`%${params.city}%`);
    }

    if (params.department) {
      baseConditions.department = ILike(`%${params.department}%`);
    }

    if (params.search) {
      const searchConditions: FindOptionsWhere<Hotel>[] = [
        { name: ILike(`%${params.search}%`) },
        { code: ILike(`%${params.search}%`) },
        { legalName: ILike(`%${params.search}%`) },
        { email: ILike(`%${params.search}%`) },
        { identificationNumber: ILike(`%${params.search}%`) },
      ];

      searchConditions.forEach((condition) => {
        where.push({ ...baseConditions, ...condition });
      });
    } else {
      where.push(baseConditions);
    }

    const [entities, itemCount] = await this._hotelRepository.findAndCount({
      where,
      skip,
      take: params.perPage,
      order: { createdAt: params.order ?? 'DESC' },
      relations: ['phoneCode'],
    });

    const hotels = entities.map((hotel) => {
      return {
        ...hotel,
        phoneCodeId: hotel?.phoneCode?.id,
        phoneCode: hotel?.phoneCode
          ? {
              id: hotel.phoneCode.id,
              code: hotel.phoneCode.code,
              name: hotel.phoneCode.name,
            }
          : null,
      } as unknown as Hotel;
    });

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: params,
    });

    return new ResponsePaginationDto(hotels, pageMetaDto);
  }

  async findOne(id: number): Promise<Hotel> {
    const hotel = await this._hotelRepository.findOne({
      where: { id },
      relations: ['phoneCode'],
    });

    if (!hotel) {
      throw new HttpException('El hotel no existe', HttpStatus.NOT_FOUND);
    }

    if (hotel.phoneCode) {
      const { createdAt, updatedAt, deletedAt, user, hotels, ...phoneCode } =
        hotel.phoneCode;
      hotel.phoneCode = phoneCode as any;
    }

    return hotel;
  }

  async delete(id: number): Promise<void> {
    const hotel = await this.findOne(id);
    if (!hotel) {
      throw new HttpException('El hotel no existe', HttpStatus.NOT_FOUND);
    }

    await this._hotelRepository.softDelete(id);
  }
}
