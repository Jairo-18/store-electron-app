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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HotelId } from 'src/shared/decorators/hotelId.decorator';
import { CrudUserUC } from '../useCases/crudUserUC';
import { UserUC } from '../useCases/userUC.uc';
import {
  CreateUserDto,
  GetAllUsersResposeDto,
  GetUserResponseDto,
  UpdateUserDto,
} from '../dtos/crudUser.dto';
import {
  CreatedRecordResponseDto,
  DeleteReCordResponseDto,
  DuplicatedResponseDto,
  NotFoundResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';
import { ResponsePaginationDto } from 'src/shared/dtos/pagination.dto';
import {
  CreateUserRelatedDataReponseDto,
  PaginatedListUsersParamsDto,
  PaginatedUserSelectParamsDto,
  PartialUserDto,
  UserResponseDto,
} from '../dtos/user.dto';

@Controller('user')
@ApiTags('Usuarios')
export class UserController {
  constructor(
    private readonly _userUC: UserUC,
    private readonly _crudUserUC: CrudUserUC,
  ) {}

  @Get('/paginated-partial')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: ResponsePaginationDto<PartialUserDto> })
  async getPaginatedPartial(
    @Query() params: PaginatedUserSelectParamsDto,
    @HotelId() hotelId: number,
  ): Promise<ResponsePaginationDto<PartialUserDto>> {
    return this._userUC.paginatedPartialUser(params, hotelId);
  }

  @Get('/create/related-data')
  @ApiOkResponse({ type: CreateUserRelatedDataReponseDto })
  async getRelatedData(): Promise<CreateUserRelatedDataReponseDto> {
    const data = await this._userUC.getRelatedDataToCreate();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: GetAllUsersResposeDto })
  async findAll(@HotelId() hotelId: number): Promise<GetAllUsersResposeDto> {
    const users = await this._crudUserUC.findAll(hotelId);
    return {
      statusCode: HttpStatus.OK,
      data: { users },
    };
  }

  @Post('create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(
    @Body() createUserDto: CreateUserDto,
    @HotelId() hotelId: number,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._crudUserUC.create(createUserDto, hotelId);
    return {
      title: 'Creación de usuario',
      message: 'Registro de usuario exitoso',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  @Get('/paginated-list')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: ResponsePaginationDto<UserResponseDto> })
  async getPaginatedList(
    @Query() params: PaginatedListUsersParamsDto,
    @HotelId() hotelId: number,
  ): Promise<ResponsePaginationDto<UserResponseDto>> {
    return await this._userUC.paginatedList(params, hotelId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: GetUserResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(
    @Param('id') id: string,
    @HotelId() hotelId: number,
  ): Promise<GetUserResponseDto> {
    const user = await this._crudUserUC.findOne(id, hotelId);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @HotelId() hotelId: number,
  ): Promise<UpdateRecordResponseDto> {
    await this._crudUserUC.update(id, updateUserDto, hotelId);
    return {
      title: 'Actualizar usuario',
      message: 'Usuario actualizado correctamente',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async delete(
    @Param('id') id: string,
    @HotelId() hotelId: number,
  ): Promise<DeleteReCordResponseDto> {
    await this._crudUserUC.delete(id, hotelId);
    return {
      title: 'Eliminar usuario',
      statusCode: HttpStatus.OK,
      message: 'Usuario eliminado exitosamente',
    };
  }

  @Post('admin/create')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async adminCreate(
    @Body() createUserDto: CreateUserDto,
    @Query('hotelId') hotelId: number,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._crudUserUC.createForAdmin(createUserDto, hotelId);
    return {
      title: 'Creación de usuario (Admin)',
      message: 'Registro de usuario exitoso',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  @Get('admin/paginated-list')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: ResponsePaginationDto<UserResponseDto> })
  async getAdminPaginatedList(
    @Query() params: PaginatedListUsersParamsDto,
  ): Promise<ResponsePaginationDto<UserResponseDto>> {
    return await this._userUC.paginatedListForAdmin(params);
  }

  @Get('admin/paginated-partial')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: ResponsePaginationDto<PartialUserDto> })
  async getAdminPaginatedPartial(
    @Query() params: PaginatedUserSelectParamsDto,
  ): Promise<ResponsePaginationDto<PartialUserDto>> {
    return this._userUC.paginatedPartialUserForAdmin(params);
  }

  @Get('admin/all')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: GetAllUsersResposeDto })
  async findAllAdmin(): Promise<GetAllUsersResposeDto> {
    const users = await this._crudUserUC.findAllForAdmin();
    return {
      statusCode: HttpStatus.OK,
      data: { users },
    };
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: GetUserResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOneAdmin(@Param('id') id: string): Promise<GetUserResponseDto> {
    const user = await this._crudUserUC.findOneForAdmin(id);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async deleteAdmin(@Param('id') id: string): Promise<DeleteReCordResponseDto> {
    await this._crudUserUC.deleteForAdmin(id);
    return {
      title: 'Eliminar usuario (Admin)',
      statusCode: HttpStatus.OK,
      message: 'Usuario eliminado exitosamente',
    };
  }
}
