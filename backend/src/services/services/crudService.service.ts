/* eslint-disable @typescript-eslint/no-unused-vars */
import { UpdateServiceDto } from './../dtos/crudService.dto';
import { Service } from './../../shared/entities/services.entity';
import { ServiceRepository } from './../../shared/repositories/service.repository';
import { CategoryTypeRepository } from '../../shared/repositories/categoryType.repository';

import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from '../dtos/crudService.dto';
import { InvoiceDetaillRepository } from 'src/shared/repositories/invoiceDetaill.repository';

@Injectable()
export class CrudServiceService {
  constructor(
    private readonly _serviceRepository: ServiceRepository,
    private readonly _categoryTypeRepository: CategoryTypeRepository,
    private readonly _invoiceDetaillRepository: InvoiceDetaillRepository,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<{ rowId: string }> {
    const codeExist = await this._serviceRepository.findOne({
      where: { code: createServiceDto.code },
    });

    if (codeExist) {
      throw new HttpException('El código ya está en uso', HttpStatus.CONFLICT);
    }

    try {
      const { categoryTypeId, ...serviceData } = createServiceDto;

      const categoryType = await this._categoryTypeRepository.findOne({
        where: { id: categoryTypeId },
      });

      if (!categoryType) {
        throw new BadRequestException('Tipo de categoría no encontrado');
      }

      const newService = this._serviceRepository.create({
        ...serviceData,
        categoryType,
      });

      const res = await this._serviceRepository.insert(newService);
      return { rowId: res.identifiers[0].id };
    } catch (error) {
      console.error('Error creando servicio:', error);
      throw new BadRequestException('No se pudo crear el servicio');
    }
  }

  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const parsedId = parseInt(id.toString(), 10);
    if (isNaN(parsedId)) {
      throw new BadRequestException('El ID del servicio debe ser un número');
    }

    const service = await this._serviceRepository.findOne({
      where: { id: parsedId },
      relations: ['categoryType'],
    });

    if (!service) {
      throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    }

    if (updateServiceDto.code) {
      const codeExist = await this._serviceRepository.findOne({
        where: { code: updateServiceDto.code },
      });
      if (codeExist && codeExist.code !== service.code) {
        throw new ConflictException(
          'El código ya está en uso por otra servicio',
        );
      }
    }

    if (updateServiceDto.categoryTypeId) {
      const category = await this._categoryTypeRepository.findOne({
        where: { id: updateServiceDto.categoryTypeId },
      });

      if (!category) {
        throw new NotFoundException('Categoría no encontrada');
      }

      service.categoryType = category;
      delete updateServiceDto.categoryTypeId;
    }

    Object.assign(service, updateServiceDto);

    return await this._serviceRepository.save(service);
  }

  async findOne(id: number) {
    const { ...service } = await this._serviceRepository.findOne({
      where: { id },
      relations: ['categoryType'],
    });

    if (!service) {
      throw new HttpException('El servicio no existe', HttpStatus.NOT_FOUND);
    }

    const { createdAt, updatedAt, deletedAt, ...serviceWithoutDates } = service;
    if (serviceWithoutDates.categoryType) {
      const { createdAt, updatedAt, deletedAt, ...categoryType } =
        serviceWithoutDates.categoryType;
      serviceWithoutDates.categoryType = categoryType;
    }

    return serviceWithoutDates;
  }

  async findAll(): Promise<Service[]> {
    const services = await this._serviceRepository.find({
      relations: ['categoryType'],
    });

    return services.map((service) => {
      const { createdAt, updatedAt, deletedAt, ...serviceWithoutDates } =
        service;
      if (serviceWithoutDates.categoryType) {
        const { createdAt, updatedAt, deletedAt, ...categoryType } =
          serviceWithoutDates.categoryType;
        serviceWithoutDates.categoryType = categoryType;
      }
      return serviceWithoutDates;
    });
  }

  async delete(id: number): Promise<void> {
    const service = await this.findOne(id);

    const invoiceDetailCount = await this._invoiceDetaillRepository.count({
      where: {
        service: { id },
      },
    });

    if (invoiceDetailCount > 0) {
      throw new BadRequestException(
        `El servicio ${service.name} está asociado a una factura y no puede eliminarse.`,
      );
    }

    await this._serviceRepository.delete(id);
  }
}
