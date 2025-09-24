import { ResponsePaginationDto } from './../../shared/dtos/pagination.dto';
import { PaginatedListInvoicesParamsDto } from './../dtos/paginatedInvoice.dto';
import { Invoice } from './../../shared/entities/invoice.entity';
import {
  CreateInvoiceDetaillDto,
  CreateRelatedDataInvoiceResponseDto,
} from './../dtos/invoiceDetaill.dto';
import {
  GetInvoiceWithDetailsResponseDto,
  GetInvoiceWithDetailsDto,
  UpdateInvoiceDto,
  CreateInvoiceDto,
} from './../dtos/invoice.dto';
import {
  CreatedRecordResponseDto,
  DeleteReCordResponseDto,
  DuplicatedResponseDto,
  NotFoundResponseDto,
  UpdateRecordResponseDto,
} from './../../shared/dtos/response.dto';
import {
  Controller,
  Post,
  HttpStatus,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InvoiceUC } from '../useCases/invoiceUC.uc';

@Controller('invoices')
@ApiTags('Facturas')
export class InvoiceController {
  constructor(private readonly _invoiceUC: InvoiceUC) {}

  @Get('/paginated-list')
  @ApiOkResponse({ type: ResponsePaginationDto<Invoice> })
  async getPaginatedList(
    @Query() params: PaginatedListInvoicesParamsDto,
  ): Promise<ResponsePaginationDto<Invoice>> {
    return await this._invoiceUC.paginatedList(params);
  }

  @Post()
  @ApiOkResponse({ type: CreateInvoiceDto })
  @ApiConflictResponse({ type: DuplicatedResponseDto })
  async create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<CreatedRecordResponseDto> {
    const rowId = await await this._invoiceUC.createInvoice(createInvoiceDto);

    return {
      title: 'Factura creada',
      message: 'Factura registrada',
      statusCode: HttpStatus.CREATED,
      data: {
        rowId: rowId.invoiceId.toString(),
      },
    };
  }

  @Get('/create/related-data')
  @ApiOkResponse({ type: CreateRelatedDataInvoiceResponseDto })
  async getRelatedData(): Promise<CreateRelatedDataInvoiceResponseDto> {
    const data = await this._invoiceUC.getRelatedDataToCreate();
    return {
      statusCode: HttpStatus.OK,
      data,
    };
  }

  @Get(':id')
  @ApiOkResponse({ type: GetInvoiceWithDetailsResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async findOne(
    @Param('id') invoiceId: number,
  ): Promise<{ statusCode: number; data: GetInvoiceWithDetailsDto }> {
    const invoice = await this._invoiceUC.findOne(invoiceId);
    return {
      statusCode: HttpStatus.OK,
      data: invoice,
    };
  }

  @Delete(':id')
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async remove(
    @Param('id') invoiceId: number,
  ): Promise<DeleteReCordResponseDto> {
    await this._invoiceUC.delete(invoiceId);
    return {
      title: 'Factura eliminada',
      statusCode: HttpStatus.OK,
      message: 'Factura eliminada exitosamente',
    };
  }

  @Post('invoice/:invoiceId/details')
  @ApiOkResponse({ type: CreatedRecordResponseDto })
  @ApiBody({ type: CreateInvoiceDetaillDto })
  async createSingleDetail(
    @Param('invoiceId') invoiceId: number,
    @Body() dto: CreateInvoiceDetaillDto,
  ): Promise<CreatedRecordResponseDto> {
    await this._invoiceUC.addDetail(invoiceId, dto);

    return {
      title: 'Item agregado',
      message: 'Item agregado exitosamente',
      statusCode: HttpStatus.CREATED,
      data: null,
    };
  }

  @Patch(':id')
  @ApiOkResponse({ type: UpdateRecordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async update(
    @Param('id') invoiceId: number,
    @Body() invoiceData: UpdateInvoiceDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._invoiceUC.update(invoiceId, invoiceData);
    return {
      title: 'Factura editada',
      message: 'Factura editada exitosamente',
      statusCode: HttpStatus.CREATED,
    };
  }

  @Delete('details/:detailId')
  @ApiOkResponse({ type: DeleteReCordResponseDto })
  @ApiNotFoundResponse({ type: NotFoundResponseDto })
  async deleteDetail(
    @Param('detailId') deleteDetailDto: number,
  ): Promise<DeleteReCordResponseDto> {
    await this._invoiceUC.deleteDetail(deleteDetailDto);
    return {
      title: 'Item eliminado',
      statusCode: HttpStatus.OK,
      message: 'Item eliminado correctamente',
    };
  }
}
