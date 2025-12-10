import { CreateRelatedDataServicesAndProductsResponseDto } from './../dtos/product.dto';
import { Product } from './../../shared/entities/product.entity';
import { ResponsePaginationDto } from './../../shared/dtos/pagination.dto';
import {
  CreatedRecordResponseDto,
  DeleteReCordResponseDto,
  DuplicatedResponseDto,
  NotFoundResponseDto,
  UpdateRecordResponseDto,
} from './../../shared/dtos/response.dto';
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
import { ProductInterfacePaginatedList } from '../interface/product.interface';
import {
  PaginatedListProductsParamsDto,
  PaginatedProductSelectParamsDto,
  PartialProductDto,
} from '../dtos/product.dto';
import {
  CreateProductDto,
  GetAllProductsResposeDto,
  GetProductDto,
  UpdateProductDto,
  UpdateProductDtoForAdmin,
} from '../dtos/crudProduct.dto';
import { CrudProductUC } from '../useCases/crudProductUC.uc';
import { ProductUC } from '../useCases/productUC.uc';
import { AuthGuard } from '@nestjs/passport';
import { HotelId } from 'src/shared/decorators/hotelId.decorator';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRole } from 'src/shared/constants/roles.constant';

@Controller('product')
@ApiTags('Productos')
export class ProductController {
  constructor(
    private readonly _productUC: ProductUC,
    private readonly _crudProductUC: CrudProductUC,
  ) {}

  @Get('/paginated-partial')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMP)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: ResponsePaginationDto<PartialProductDto> })
  async getPaginatedPartial(
    @Query() params: PaginatedProductSelectParamsDto,
    @HotelId() hotelId: string,
  ): Promise<ResponsePaginationDto<PartialProductDto>> {
    return this._productUC.paginatedPartialProduct(params, hotelId);
  }

  @Get('/create/related-data')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMP)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: CreateRelatedDataServicesAndProductsResponseDto })
  async getRelatedData(): Promise<CreateRelatedDataServicesAndProductsResponseDto> {
    const data = await this._productUC.getRelatedDataToCreate();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get()
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMP)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: GetAllProductsResposeDto })
  async findAll(@HotelId() hotelId: string): Promise<GetAllProductsResposeDto> {
    const products = await this._crudProductUC.findAll(hotelId);
    return {
      statusCode: HttpStatus.OK,
      data: { products },
    };
  }

  @Post('create')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMP)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(
    @Body() createProductDto: CreateProductDto,
    @HotelId() hotelId: string,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._crudProductUC.create(createProductDto, hotelId);
    return {
      title: 'Crear producto',
      message: 'Registro de producto exitoso',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  @Get('/paginated-list')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMP)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: ResponsePaginationDto<Product> })
  async getPaginatedList(
    @Query() params: PaginatedListProductsParamsDto,
    @HotelId() hotelId: string,
  ): Promise<ResponsePaginationDto<ProductInterfacePaginatedList>> {
    return await this._productUC.paginatedList(params, hotelId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMP)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: GetProductDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(
    @Param('id') id: string,
    @HotelId() hotelId: string,
  ): Promise<GetProductDto> {
    const product = await this._crudProductUC.findOne(id, hotelId);
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMP)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @HotelId() hotelId: string,
  ): Promise<UpdateRecordResponseDto> {
    await this._crudProductUC.update(id, updateProductDto, hotelId);
    return {
      title: 'Actualizar producto',
      message: 'Producto actualizado correctamente',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN, UserRole.EMP)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async delete(
    @Param('id') id: number,
    @HotelId() hotelId: string,
  ): Promise<DeleteReCordResponseDto> {
    await this._crudProductUC.delete(id, hotelId);
    return {
      title: 'Eliminar producto',
      statusCode: HttpStatus.OK,
      message: 'Producto eliminado correctamente',
    };
  }

  // ==================== ADMIN ENDPOINTS ====================

  @Post('admin/create')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async adminCreate(
    @Body() createProductDto: CreateProductDto,
    @Query('hotelId') hotelId: string,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._crudProductUC.createForAdmin(createProductDto, hotelId);
    return {
      title: 'Crear producto (Admin)',
      message: 'Registro de producto exitoso',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  @Get('admin/paginated-list')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: ResponsePaginationDto<Product> })
  async getAdminPaginatedList(
    @Query() params: PaginatedListProductsParamsDto,
  ): Promise<ResponsePaginationDto<ProductInterfacePaginatedList>> {
    return await this._productUC.paginatedListForAdmin(params);
  }

  @Get('admin/paginated-partial')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: ResponsePaginationDto<PartialProductDto> })
  async getAdminPaginatedPartial(
    @Query() params: PaginatedProductSelectParamsDto,
  ): Promise<ResponsePaginationDto<PartialProductDto>> {
    return this._productUC.paginatedPartialProductForAdmin(params);
  }

  @Get('admin/all')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: GetAllProductsResposeDto })
  async findAllAdmin(): Promise<GetAllProductsResposeDto> {
    const products = await this._crudProductUC.findAllForAdmin();
    return {
      statusCode: HttpStatus.OK,
      data: { products },
    };
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: GetProductDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOneAdmin(@Param('id') id: string): Promise<GetProductDto> {
    const product = await this._crudProductUC.findOneForAdmin(id);
    return {
      statusCode: HttpStatus.OK,
      data: product,
    };
  }

  @Patch('admin/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async updateAdmin(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDtoForAdmin,
  ): Promise<UpdateRecordResponseDto> {
    await this._crudProductUC.updateForAdmin(id, updateProductDto);
    return {
      title: 'Actualizar producto (Admin)',
      message: 'Producto actualizado correctamente',
      statusCode: HttpStatus.OK,
    };
  }

  @Delete('admin/:id')
  @ApiBearerAuth()
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard(), RolesGuard)
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async deleteAdmin(@Param('id') id: number): Promise<DeleteReCordResponseDto> {
    await this._crudProductUC.deleteForAdmin(id);
    return {
      title: 'Eliminar producto (Admin)',
      statusCode: HttpStatus.OK,
      message: 'Producto eliminado correctamente',
    };
  }
}
