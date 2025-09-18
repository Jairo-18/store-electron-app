import { CrudUserUC } from './../useCases/crudUserUC';
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
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UserUC } from '../useCases/userUC.uc';
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
  @ApiOkResponse({ type: ResponsePaginationDto<PartialUserDto> })
  async getPaginatedPartial(
    @Query() params: PaginatedUserSelectParamsDto,
  ): Promise<ResponsePaginationDto<PartialUserDto>> {
    return this._userUC.paginatedPartialUser(params);
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
  @ApiOkResponse({ type: GetAllUsersResposeDto })
  async findAll(): Promise<GetAllUsersResposeDto> {
    const users = await this._crudUserUC.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: { users },
    };
  }

  @Post('create')
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._crudUserUC.create(createUserDto);
    return {
      title: 'Creación de usuario',
      message: 'Registro de usuario exitoso',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  @Get('/paginated-list')
  @ApiOkResponse({ type: ResponsePaginationDto<UserResponseDto> })
  async getPaginatedList(
    @Query() params: PaginatedListUsersParamsDto,
  ): Promise<ResponsePaginationDto<UserResponseDto>> {
    return await this._userUC.paginatedList(params);
  }

  @Get(':id')
  @ApiOkResponse({ type: GetUserResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(@Param('id') id: string): Promise<GetUserResponseDto> {
    const user = await this._crudUserUC.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._crudUserUC.update(id, updateUserDto);
    return {
      title: 'Actualizar usuario',
      message: 'Usuario actualizado correctamente',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async delete(@Param('id') id: string): Promise<DeleteReCordResponseDto> {
    await this._crudUserUC.delete(id);
    return {
      title: 'Eliminar usuario',
      statusCode: HttpStatus.OK,
      message: 'Usuario eliminado exitosamente',
    };
  }
}
