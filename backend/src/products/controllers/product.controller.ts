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
import { ProductUC } from '../useCases/productUC.uc';
import { CrudProductUC } from '../useCases/crudProductUC.uc';
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
    return this._crudProductUC.paginatedPartialProduct(params);
  }

  @Post('create')
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(
    @Body() productDto: CreateProductDto,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await this._productUC.create(productDto);
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
    const products = await this._productUC.findAll();
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
    @Body() productData: UpdateProductDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._productUC.update(id, productData);

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
    return await this._crudProductUC.paginatedList(params);
  }

  @Get(':id')
  @ApiOkResponse({ type: GetProductDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(@Param('id') id: string): Promise<GetProductDto> {
    const user = await this._productUC.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async delete(
    @Param('id') producId: number,
  ): Promise<DeleteReCordResponseDto> {
    await this._productUC.delete(producId);
    return {
      title: 'Eliminar producto',
      statusCode: HttpStatus.OK,
      message: 'Producto eliminado exitosamente',
    };
  }
}
