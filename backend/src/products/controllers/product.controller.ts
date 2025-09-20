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
} from '@nestjs/common';
import {
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
} from '../dtos/crudProduct.dto';
import { CrudProductUC } from '../useCases/crudProductUC.uc';
import { ProductUC } from '../useCases/productUC.uc';

@Controller('product')
@ApiTags('Productos')
export class ProductController {
  constructor(
    private readonly _productUC: ProductUC,
    private readonly _crudProductUC: CrudProductUC,
  ) {}

  @Get('/paginated-partial')
  @ApiOkResponse({ type: ResponsePaginationDto<PartialProductDto> })
  async getPaginatedPartial(
    @Query() params: PaginatedProductSelectParamsDto,
  ): Promise<ResponsePaginationDto<PartialProductDto>> {
    return this._productUC.paginatedPartialProduct(params);
  }

  @Get('/create/related-data')
  @ApiOkResponse({ type: CreateRelatedDataServicesAndProductsResponseDto })
  async getRelatedData(): Promise<CreateRelatedDataServicesAndProductsResponseDto> {
    const data = await this._productUC.getRelatedDataToCreate();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Post('create')
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(
    @Body() createProductDto: CreateProductDto,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._crudProductUC.create(createProductDto);
    return {
      title: 'Crear producto',
      message: 'Registro de producto exitoso',
      statusCode: HttpStatus.CREATED,
      data: rowId,
    };
  }

  @Get()
  @ApiOkResponse({ type: GetAllProductsResposeDto })
  async findAll(): Promise<GetAllProductsResposeDto> {
    const products = await this._crudProductUC.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: { products },
    };
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._crudProductUC.update(id, updateProductDto);

    return {
      title: 'Actualizar producto',
      message: 'Producto actualizado correctamente',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('/paginated-list')
  @ApiOkResponse({ type: ResponsePaginationDto<Product> })
  async getPaginatedList(
    @Query() params: PaginatedListProductsParamsDto,
  ): Promise<ResponsePaginationDto<ProductInterfacePaginatedList>> {
    return await this._productUC.paginatedList(params);
  }

  @Get(':id')
  @ApiOkResponse({ type: GetProductDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(@Param('id') id: string): Promise<GetProductDto> {
    const user = await this._crudProductUC.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async delete(@Param('id') id: number): Promise<DeleteReCordResponseDto> {
    await this._crudProductUC.delete(id);
    return {
      title: 'Eliminar producto',
      statusCode: HttpStatus.OK,
      message: 'Producto eliminado exitosamente',
    };
  }
}
