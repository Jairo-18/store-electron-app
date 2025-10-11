import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  CategoryType,
  TaxeType
} from '../../../shared/interfaces/relatedDataGeneral';
import { ProductsService } from '../../../service-and-product/services/products.service';
import { debounceTime, of, switchMap } from 'rxjs';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { InvoiceDetaillService } from '../../services/invoiceDetaill.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AddedProductInvoiceDetaill,
  CreateInvoiceDetaill
} from '../../interface/invoiceDetaill.interface';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CurrencyFormatDirective } from '../../../shared/directives/currency-format.directive';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatOptionModule,
    MatAutocompleteModule,
    CommonModule,
    MatSelectModule,
    MatIcon,
    MatProgressSpinnerModule,
    CurrencyFormatDirective
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {
  @Input() categoryTypes: CategoryType[] = [];
  @Input() taxeTypes: TaxeType[] = [];
  @Output() itemSaved = new EventEmitter<void>();

  private readonly _producsService: ProductsService = inject(ProductsService);
  private readonly _invoiceDetaillService: InvoiceDetaillService = inject(
    InvoiceDetaillService
  );
  private readonly _activateRouter: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);
  private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly _fb: FormBuilder = inject(FormBuilder);
  isLoading: boolean = false;
  invoiceId?: number;
  form: FormGroup;
  filteredProducts: AddedProductInvoiceDetaill[] = [];

  ngOnInit(): void {
    const id = this._activateRouter.snapshot.paramMap.get('id');
    if (id) {
      this.invoiceId = Number(id);
    }

    this.form
      .get('amountSale')
      ?.valueChanges.subscribe(() => this.updateFinalPrice());
    this.form
      .get('priceSale')
      ?.valueChanges.subscribe(() => this.updateFinalPrice());
    this.form
      .get('priceWithoutTax')
      ?.valueChanges.subscribe(() => this.updateFinalPrice());
    this.form
      .get('taxeTypeId')
      ?.valueChanges.subscribe(() => this.updateFinalPrice());
  }

  constructor() {
    this.form = this._fb.group({
      name: [''],
      productId: [null, Validators.required],
      priceSale: [0],
      priceBuy: [0, [Validators.required, Validators.min(0)]],
      priceWithoutTax: [null, Validators.required],
      taxeTypeId: [2],
      amountSale: [1, [Validators.required, Validators.min(1)]],
      finalPrice: [0],
      amount: [0]
    });

    this.form
      .get('name')
      ?.valueChanges.pipe(
        debounceTime(500),
        switchMap((name: string) => {
          if (!name || name.trim().length < 2) {
            return of({ data: [] });
          }
          return this._producsService.getProductWithPagination({ name });
        })
      )
      .subscribe((res) => {
        this.filteredProducts = res.data ?? [];
      });
  }

  getInvoiceIdFromRoute(route: ActivatedRoute): string | null {
    let currentRoute: ActivatedRoute | null = route;
    while (currentRoute) {
      const id = currentRoute.snapshot.paramMap.get('id');
      if (id) return id;
      currentRoute = currentRoute.parent;
    }
    return null;
  }

  onProductFocus(): void {
    if (!this.filteredProducts.length) {
      this._producsService.getProductWithPagination({}).subscribe((res) => {
        this.filteredProducts = res.data ?? [];
      });
    }
  }

  onProductSelected(name: string): void {
    const product = this.filteredProducts.find((p) => p.name === name);
    if (!product) return;

    this.form.patchValue({
      name: product.name,
      productId: product.id,
      priceSale: product.priceSale,
      priceBuy: product.priceBuy ?? 0,
      priceWithoutTax: product.priceSale,
      amount: product.amount,
      categoryId: product.categoryTypeId
    });

    // ✅ limpiar errores del campo name
    this.form.get('name')?.setErrors(null);
    this.form.get('name')?.markAsTouched();

    this.updateFinalPrice();
  }

  resetForm(): void {
    this.form.reset({
      name: '',
      productId: null,
      priceSale: { value: '', disabled: true },
      priceBuy: 0,
      priceWithoutTax: null,
      taxeTypeId: 2,
      amountSale: 1,
      amount: 0,
      categoryId: null,
      finalPrice: 0
    });

    this._cdr.detectChanges();
  }

  private getTaxRate(): number {
    const id = this.form.get('taxeTypeId')?.value;
    const tax = this.taxeTypes?.find((t) => t.id === id);
    if (!tax || tax.percentage == null) return 0;

    let rate =
      typeof tax.percentage === 'string'
        ? parseFloat(tax.percentage)
        : tax.percentage;

    if (!isFinite(rate) || rate < 0) return 0;
    // Si viene como 12 en lugar de 0.12, normalizar
    if (rate > 1) rate = rate / 100;
    return rate;
  }

  /** Calcula finalPrice = (precio_sin_IVA * (1+IVA)) * cantidad */
  private updateFinalPrice() {
    const base = Number(
      this.form.get('priceWithoutTax')?.value ??
        this.form.get('priceSale')?.value ??
        0
    );
    const amountSale = Number(this.form.get('amountSale')?.value ?? 0);
    const taxRate = this.getTaxRate();

    const unitWithTax = base * (1 + taxRate);
    const total = unitWithTax * amountSale;

    this.form.patchValue(
      { finalPrice: this.round(total, 2) },
      { emitEvent: false }
    );
  }

  private round(n: number, d = 2): number {
    const p = Math.pow(10, d);
    return Math.round((n + Number.EPSILON) * p) / p;
  }

  clearProductSelection(): void {
    this.resetForm();
    this.filteredProducts = [];
  }

  addProduct(): void {
    if (!this.invoiceId) {
      return;
    }

    if (!this.form.value.productId) {
      this.form.get('productId')?.setErrors({ required: true });
      this.form.markAllAsTouched();
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const now = new Date();
    const endDate = new Date(now);
    endDate.setMinutes(endDate.getMinutes() + 5);

    const invoiceDetailPayload: CreateInvoiceDetaill = {
      productId: formValue.productId,
      amount: formValue.amountSale,
      priceBuy: Number(formValue.priceBuy) || 0,
      priceWithoutTax: Number(formValue.priceWithoutTax),
      taxeTypeId: formValue.taxeTypeId,
      startDate: now.toISOString(),
      endDate: endDate.toISOString()
    };

    this.isLoading = true;
    this._invoiceDetaillService
      .createInvoiceDetaill(this.invoiceId, invoiceDetailPayload)
      .subscribe({
        next: () => {
          this.resetForm();
          this.isLoading = false;
          this.itemSaved.emit();
        },
        error: (err) => {
          console.error('❌ Error al guardar detalle:', err);
          this.isLoading = false;
        }
      });
  }
}
