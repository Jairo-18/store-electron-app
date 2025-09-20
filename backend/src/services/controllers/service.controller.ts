import {
  CreateServiceDto,
  GetAllServicesResposeDto,
  GetServiceDto,
  UpdateServiceDto,
} from './../dtos/crudService.dto';
import { Service } from './../../shared/entities/services.entity';
import { CrudServiceUC } from './../useCases/crudServiceUC.uc';
import { ServiceUC } from './../useCases/serviceUC.uc';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';
import {
  CreatedRecordResponseDto,
  DeleteReCordResponseDto,
  DuplicatedResponseDto,
  NotFoundResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ServiceInterfacePaginatedList } from '../interface/service.interface';
import {
  PaginatedListServicesParamsDto,
  PaginatedServiceSelectParamsDto,
  PartialServiceDto,
} from '../dtos/service.dto';

@Controller('service')
@ApiTags('Servicios')
export class ServiceController {
  constructor(
    private readonly _serviceUC: ServiceUC,
    private readonly _crudServiceUC: CrudServiceUC,
  ) {}

  @Get('/paginated-partial')
  @ApiOkResponse({ type: ResponsePaginationDto<PartialServiceDto> })
  async getPaginatedPartial(
    @Query() params: PaginatedServiceSelectParamsDto,
  ): Promise<ResponsePaginationDto<PartialServiceDto>> {
    return this._serviceUC.paginatedPartialService(params);
  }

  @Post('create')
  @ApiOkResponse({ type: CreateServiceDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._crudServiceUC.create(createServiceDto);

    return {
      title: 'Crear servicio',
      message: 'Registro de servicio exitoso',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  @Get()
  @ApiOkResponse({ type: GetAllServicesResposeDto })
  async findAll(): Promise<GetAllServicesResposeDto> {
    const services = await this._crudServiceUC.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: { services },
    };
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async update(
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._crudServiceUC.update(id, updateServiceDto);

    return {
      title: 'Actualizar servicio',
      message: 'Servicio actualizado correctamente',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('/paginated-list')
  @ApiOkResponse({ type: ResponsePaginationDto<Service> })
  async getPaginatedList(
    @Query() params: PaginatedListServicesParamsDto,
  ): Promise<ResponsePaginationDto<ServiceInterfacePaginatedList>> {
    return await this._serviceUC.paginatedList(params);
  }

  @Get(':id')
  @ApiOkResponse({ type: GetServiceDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(@Param('id') id: number): Promise<GetServiceDto> {
    const service = await this._crudServiceUC.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: service,
    };
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async delete(@Param('id') id: number): Promise<DeleteReCordResponseDto> {
    await this._crudServiceUC.delete(id);
    return {
      title: 'Eliminar servicio',
      statusCode: HttpStatus.OK,
      message: 'Servicio eliminado correctamente',
    };
  }
}
