import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HotelUseCase } from '../useCases/hotel.usecase';
import {
  CreateHotelDto,
  UpdateHotelDto,
  QueryHotelDto,
  GetHotelResponseDto,
} from '../dtos/hotel.dto';
import {
  CreatedRecordResponseDto,
  DeleteReCordResponseDto,
  DuplicatedResponseDto,
  NotFoundResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';
import { Hotel } from '../../shared/entities/hotel.entity';

@Controller('hotel')
@ApiTags('Hoteles')
export class HotelController {
  constructor(private readonly _hotelUseCase: HotelUseCase) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiCreatedResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(
    @Body() createHotelDto: CreateHotelDto,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._hotelUseCase.create(createHotelDto);
    return {
      title: 'Creación de hotel',
      message: 'Hotel creado exitosamente',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: ResponsePaginationDto })
  async findAll(
    @Query() query: QueryHotelDto,
  ): Promise<ResponsePaginationDto<Hotel>> {
    return await this._hotelUseCase.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: GetHotelResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetHotelResponseDto> {
    const hotel = await this._hotelUseCase.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: hotel,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHotelDto: UpdateHotelDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._hotelUseCase.update(id, updateHotelDto);
    return {
      title: 'Actualizar hotel',
      message: 'Hotel actualizado correctamente',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteReCordResponseDto> {
    await this._hotelUseCase.delete(id);
    return {
      title: 'Eliminar hotel',
      statusCode: HttpStatus.OK,
      message: 'Hotel eliminado exitosamente',
    };
  }
}
