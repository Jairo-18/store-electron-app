/* eslint-disable @typescript-eslint/no-explicit-any */
import { InvoiceService } from './../../services/invoice.service';
import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { CreateInvoiceDialogComponent } from '../../components/create-invoice-dialog/create-invoice-dialog.component';
import { PaginationInterface } from '../../../shared/interfaces/pagination.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RelatedDataService } from '../../../shared/services/relatedData.service';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { SearchField } from '../../../shared/interfaces/search.interface';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SearchFieldsComponent } from '../../../shared/components/search-fields/search-fields.component';
import { RouterLink } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MatMenuModule } from '@angular/material/menu';
import { InvoicePdfComponent } from '../../components/invoice-pdf/invoice-pdf.component';
import { Invoice } from '../../interface/invoice.interface';
import { FormatCopPipe } from '../../../shared/pipes/format-cop.pipe';
import { FormGroup } from '@angular/forms';
import { InvoicePrintService } from '../../../shared/services/invoicePrint.service';

@Component({
  selector: 'app-see-invoices',
  standalone: true,
  imports: [
    MatButtonModule,
    BasePageComponent,
    MatPaginatorModule,
    MatTabsModule,
    MatIconModule,
    CommonModule,
    SearchFieldsComponent,
    RouterLink,
    LoaderComponent,
    MatTableModule,
    MatMenuModule,
    InvoicePdfComponent,
    FormatCopPipe
  ],
  templateUrl: './see-invoices.component.html',
  styleUrl: './see-invoices.component.scss'
})
export class SeeInvoicesComponent implements OnInit {
  @ViewChild('invoiceToPrintRef') invoiceToPrintRef!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;

  private readonly _matDialog: MatDialog = inject(MatDialog);
  private readonly _invoiceService: InvoiceService = inject(InvoiceService);
  private readonly _relatedDataService: RelatedDataService =
    inject(RelatedDataService);

  selectedInvoice: any = null;
  invoiceToPrintData?: Invoice;

  displayedColumns: string[] = [
    'invoiceType',
    'code',
    'clientIdentification',
    'clientName',
    'startDate',
    'payType',
    'paidType',
    'invoiceElectronic',
    'subtotalWithoutTax',
    'totalTaxes',
    'total',
    'actions'
  ];

  form!: FormGroup;
  dataSource = new MatTableDataSource<any>([]);
  isMobile: boolean = false;
  loading: boolean = false;
  showClearButton: boolean = false;
  params: any = {};
  selectedTabIndex: number = 0;
  private _rawRelatedData: any;

  paginationParams: PaginationInterface = {
    page: 1,
    perPage: 100,
    total: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  searchFields: SearchField[] = [
    {
      name: 'search',
      label: 'Código, nombre, identificación, total, sub',
      type: 'text',
      placeholder: ' '
    },
    {
      name: 'startDate',
      label: 'Fecha de creación',
      type: 'date'
    },
    {
      name: 'invoiceTypeId',
      label: 'Tipo de factura',
      type: 'select',
      options: [],
      placeholder: 'Buscar por tipo de factura'
    },
    {
      name: 'paidTypeId',
      label: 'Tipo estado pago',
      type: 'select',
      options: [],
      placeholder: 'Buscar por tipo estado pago'
    },
    {
      name: 'payTypeId',
      label: 'Tipo pago',
      type: 'select',
      options: [],
      placeholder: 'Buscar por tipo pago'
    },
    {
      name: 'taxeTypeId',
      label: 'Tipo impuesto',
      type: 'select',
      options: [],
      placeholder: 'Buscar por tipo de impuesto'
    },
    {
      name: 'invoiceElectronic',
      label: 'Facturación electrónica',
      type: 'select',
      options: [
        { value: 'true', label: 'Sí' },
        { value: 'false', label: 'No' }
      ],
      placeholder: 'Buscar por facturación electrónica'
    }
  ];

  constructor(private _invoicePrintService: InvoicePrintService) {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.paginationParams.perPage = 5;
  }

  ngOnInit(): void {
    this.loadInvoices();
    this.loadRelatedData();
  }

  loadRelatedData(): void {
    this._relatedDataService.createInvoiceRelatedData().subscribe({
      next: (res) => {
        this._rawRelatedData = res.data;

        const optionMap = {
          invoiceTypeId: res.data.invoiceType,
          identificationTypeId: res.data.identificationType,
          paidTypeId: res.data.paidType,
          payTypeId: res.data.payType,
          taxeTypeId: res.data.taxeType
        };

        this.searchFields = this.searchFields.map((field) => {
          const key = field.name as keyof typeof optionMap;
          const options = optionMap[key];
          if (options) {
            return {
              ...field,
              options: options.map((t: any) => ({
                value: t.id,
                label: t.name ?? 'Sin nombre'
              }))
            };
          }
          return field;
        });
      },
      error: (err: any) => {
        console.error('Error loading related data', err);
      }
    });
  }

  openCreateDialog(): void {
    const isMobile = window.innerWidth <= 768;
    this._matDialog
      .open(CreateInvoiceDialogComponent, {
        width: isMobile ? '90vw' : '60vw',
        data: {
          editMode: false,
          relatedData: {
            invoiceType: this._rawRelatedData?.invoiceType || [],
            payType: this._rawRelatedData?.payType || [],
            paidType: this._rawRelatedData?.paidType || []
          }
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadInvoices();
      });
  }

  openEditDialog(invoiceId: number): void {
    const isMobile = window.innerWidth <= 768;
    this._matDialog
      .open(CreateInvoiceDialogComponent, {
        width: isMobile ? '90vw' : '60vw',
        data: {
          editMode: true,
          invoiceId: invoiceId,
          relatedData: {
            invoiceType: this._rawRelatedData?.invoiceType || [],
            payType: this._rawRelatedData?.payType || [],
            paidType: this._rawRelatedData?.paidType || []
          }
        }
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) this.loadInvoices();
      });
  }

  onSearchSubmit(values: any): void {
    this.params = this.formatParams(values);
    this.paginationParams.page = 1;
    this.loadInvoices();
  }

  onSearchChange(form: any): void {
    this.showClearButton = !!form.length;
    this.params = this.formatParams(form?.value);
    this.loadInvoices();
  }

  private formatParams(values: any): any {
    const formattedParams: any = {};
    Object.keys(values).forEach((key) => {
      const val = values[key];
      if (val === null || val === '' || val === undefined) return;

      // Convertir IDs a número
      if (key.endsWith('Id')) {
        formattedParams[key] = Number(val);
        return;
      }

      // Convertir fechas a YYYY-MM-DD
      if (this.searchFields.find((f) => f.name === key)?.type === 'date') {
        formattedParams[key] = this.formatDateISO(val);
        return;
      }

      // Otros valores
      formattedParams[key] = val;
    });
    return formattedParams;
  }

  private formatDateISO(date: any): string {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().split('T')[0];
  }

  onChangePagination(event: PageEvent): void {
    this.paginationParams.page = event.pageIndex + 1;
    this.paginationParams.perPage = event.pageSize;
    this.loadInvoices();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  loadInvoices(filter: string = ''): void {
    this.loading = true;
    const query = {
      page: this.paginationParams.page,
      perPage: this.paginationParams.perPage,
      search: filter,
      ...this.params
    };

    this._invoiceService.getInvoiceWithPagination(query).subscribe({
      next: (res) => {
        const transformedData = res.data.map((invoice: any) => ({
          ...invoice,
          clientName: invoice.user
            ? `${invoice.user.firstName} ${invoice.user.lastName}`
            : '---',
          clientIdentification: invoice.user?.identificationNumber || '---',
          observations: invoice.observations,
          clientIdentificationType:
            invoice.user?.identificationType?.name || '---',
          taxeType: invoice.invoiceDetails?.[0]?.taxeType || null,
          invoiceElectronic:
            invoice.invoiceElectronic === true ||
            invoice.invoiceElectronic === 'true' ||
            invoice.invoiceElectronic === 1
        }));

        this.dataSource.data = transformedData;
        this.paginationParams = res?.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  private deleteInvoice(invoiceId: number): void {
    this.loading = true;
    this._invoiceService.deleteInvoice(invoiceId).subscribe({
      next: () => {
        this.loadInvoices();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  openDeleteInvoiceDialog(id: number): void {
    const dialogRef = this._matDialog.open(YesNoDialogComponent, {
      data: {
        title: '¿Deseas eliminar esta factura?',
        message: 'Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.deleteInvoice(id);
      }
    });
  }

  async onPrintInvoice(invoiceId: number): Promise<void> {
    const res = await this._invoicePrintService['_invoiceService']
      .getInvoiceToEdit(invoiceId)
      .toPromise();

    this.invoiceToPrintData = res?.data;

    setTimeout(() => {
      if (this.invoiceToPrintRef?.nativeElement && this.invoiceToPrintData) {
        this._invoicePrintService.printInvoice(
          this.invoiceToPrintData,
          this.invoiceToPrintRef.nativeElement
        );
      }
    }, 300);
  }

  async onDownloadInvoice(invoiceId: number): Promise<void> {
    const res = await this._invoicePrintService['_invoiceService']
      .getInvoiceToEdit(invoiceId)
      .toPromise();

    this.invoiceToPrintData = res?.data;

    setTimeout(() => {
      if (this.invoiceToPrintRef?.nativeElement && this.invoiceToPrintData) {
        this._invoicePrintService.downloadInvoice(
          this.invoiceToPrintData,
          this.invoiceToPrintRef.nativeElement
        );
      }
    }, 300);
  }
}
