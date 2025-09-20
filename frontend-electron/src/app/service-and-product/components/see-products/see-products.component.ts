import { ProductComplete } from './../../interface/product.interface';
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
import { CreateProductPanel } from '../../interface/product.interface';
import { ProductsService } from '../../services/products.service';
import { CategoryType } from '../../../shared/interfaces/relatedDataGeneral';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { FormatCopPipe } from '../../../shared/pipes/format-cop.pipe';
import { ProductsPrintComponent } from '../../../shared/components/products-print/products-print.component';

@Component({
  selector: 'app-see-products',
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
    FormatCopPipe,
    ProductsPrintComponent
  ],
  templateUrl: './see-products.component.html',
  styleUrl: './see-products.component.scss'
})
export class SeeProductsComponent implements OnInit {
  @Input() searchFieldsProducts: any[] = [];
  @Input() categoryTypes: CategoryType[] = [];
  @Output() productSelected = new EventEmitter<ProductComplete>();
  @Output() productClean = new EventEmitter<number>();
  @Output() printRequested = new EventEmitter<void>();
  @ViewChild('productsPrint') productsPrintComponent!: ProductsPrintComponent;

  private readonly _productsService: ProductsService = inject(ProductsService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;

  displayedColumns: string[] = [
    'categoryType',
    'code',
    'name',
    'amount',
    'isActive',
    'priceBuy',
    'priceSale',
    'actions'
  ];
  dataSource = new MatTableDataSource<CreateProductPanel>([]);
  allProducts: ProductComplete[] = [];
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
    this.loadProducts();
  }

  constructor() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.paginationParams.perPage = 5;
  }

  getCategoryTypeName(product: ProductComplete): string {
    const categoryTypeId = product?.categoryType?.id;
    const category = this.categoryTypes.find((r) => r.id === categoryTypeId);
    return category?.name || 'N/A';
  }

  onSearchSubmit(values: any): void {
    this.params = values;
    this.paginationParams.page = 1;
    this.loadProducts();
  }

  onChangePagination(event: PageEvent): void {
    this.paginationParams.page = event.pageIndex + 1;
    this.paginationParams.perPage = event.pageSize;
    this.loadProducts();
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onSearchChange(form: any): void {
    this.showClearButton = !!form.length;
    this.params = form?.value;
    this.loadProducts();
  }

  loadProducts(filter: string = ''): void {
    this.loading = true;
    const query = {
      page: this.paginationParams.page,
      perPage: this.paginationParams.perPage,
      search: filter,
      ...this.params
    };

    this._productsService.getProductWithPagination(query).subscribe({
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

  private deleteProduct(id: number): void {
    this.loading = true;
    this._productsService.deleteProductPanel(id).subscribe({
      next: () => {
        this.loadProducts();
        this.cleanQueryParamDelete(id);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  openDeleteProductDialog(id: number): void {
    const dialogRef = this._matDialog.open(YesNoDialogComponent, {
      data: {
        title: '¿Deseas eliminar este producto?',
        message: 'Esta acción no se puede deshacer.'
      }
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.deleteProduct(id);
      }
    });
  }

  cleanQueryParamDelete(id: number) {
    const queryParams = this._activatedRoute.snapshot.queryParams;
    if (queryParams['editProduct']) {
      const productId = Number(queryParams['editProduct']);
      if (productId === id) {
        this._router.navigate([], {
          queryParams: {},
          queryParamsHandling: '',
          replaceUrl: true
        });
        this.productClean.emit(id);
      }
    }
  }

  printProducts(): void {
    this._productsService.getAllProducts().subscribe({
      next: (res) => {
        this.allProducts = (res.data?.products || []).sort(
          (a: ProductComplete, b: ProductComplete) => {
            const catCompare = a.categoryType.name.localeCompare(
              b.categoryType.name
            );
            if (catCompare !== 0) return catCompare;
            return a.name.localeCompare(b.name);
          }
        );
        if (!this.allProducts.length) {
          console.warn('No hay productos para imprimir');
          return;
        }
        setTimeout(() => {
          this.productsPrintComponent.print();
        }, 0);
      }
    });
  }
}
