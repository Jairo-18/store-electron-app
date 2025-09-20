/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SearchFieldsComponent } from '../../../shared/components/search-fields/search-fields.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaginationInterface } from '../../../shared/interfaces/pagination.interface';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryType } from '../../../shared/interfaces/relatedDataGeneral';
import {
  CreateServicePanel,
  ServiceComplete
} from '../../interface/service.interface';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { FormatCopPipe } from '../../../shared/pipes/format-cop.pipe';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'app-see-services',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
    SearchFieldsComponent,
    LoaderComponent,
    MatTab,
    MatTabGroup,
    SectionHeaderComponent,
    FormatCopPipe
  ],
  templateUrl: './see-services.component.html',
  styleUrl: './see-services.component.scss'
})
export class SeeServicesComponent implements OnInit {
  @Input() searchFieldsServices: any[] = [];
  @Input() categoryTypes: CategoryType[] = [];
  @Output() serviceSelect = new EventEmitter<ServiceComplete>();
  @Output() serviceClean = new EventEmitter<number>();

  private readonly _serviceService: ServicesService = inject(ServicesService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;
  displayedColumns: string[] = [
    'categoryType',
    'code',
    'name',
    'stateType',
    'priceBuy',
    'priceSale',
    'actions'
  ];

  dataSource = new MatTableDataSource<CreateServicePanel>([]);
  allServices: ServiceComplete[] = [];
  form!: FormGroup;
  showClearButton: boolean = false;
  loading: boolean = false;
  isMobile: boolean = false;
  params: any = {};
  selectedTabIndex: number = 0;
  paginationParams: PaginationInterface = {
    page: 1,
    perPage: 25,
    total: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  ngOnInit(): void {
    this.loadServices();
  }

  constructor() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.paginationParams.perPage = 5;
  }

  getCategoryTypeName(service: ServiceComplete): string {
    const categoryTypeId = service?.categoryType?.id;

    const category = this.categoryTypes.find((r) => r.id === categoryTypeId);

    return category?.name || 'N/A';
  }

  onSearchSubmit(values: any): void {
    this.params = values;
    this.paginationParams.page = 1;
    this.loadServices();
  }

  onChangePagination(event: PageEvent): void {
    this.paginationParams.page = event.pageIndex + 1;
    this.paginationParams.perPage = event.pageSize;
    this.loadServices();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onSearchChange(form: any): void {
    this.showClearButton = !!form.length;
    this.params = form?.value;
    this.loadServices();
  }

  loadServices(filter: string = ''): void {
    this.loading = true;

    const parsedParams = {
      ...this.params,

      bedType: this.params.bedType ? Number(this.params.bedType) : undefined,
      stateType: this.params.stateType
        ? Number(this.params.stateType)
        : undefined
    };

    const query = {
      page: this.paginationParams.page,
      perPage: this.paginationParams.perPage,
      search: filter,
      ...parsedParams
    };

    this._serviceService.getServiceWithPagination(query).subscribe({
      next: (res) => {
        this.dataSource.data = (res.data || []).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        this.paginationParams = res?.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  private deleteService(id: number): void {
    this.loading = true;
    this._serviceService.deleteServicePanel(id).subscribe({
      next: () => {
        this.loadServices();
        this.cleanQueryParamDelete(id);

        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  openDeleteServiceDialog(id: number): void {
    const dialogRef = this._matDialog.open(YesNoDialogComponent, {
      data: {
        title: '¿Deseas eliminar este servicio?',
        message: 'Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.deleteService(id);
      }
    });
  }

  cleanQueryParamDelete(id: number) {
    const queryParams = this._activatedRoute.snapshot.queryParams;
    if (queryParams['editService']) {
      const serviceId = Number(queryParams['editService']);
      if (serviceId === id) {
        this._router.navigate([], {
          queryParams: {},
          queryParamsHandling: '',
          replaceUrl: true
        });
        this.serviceClean.emit(id);
      }
    }
  }
}
