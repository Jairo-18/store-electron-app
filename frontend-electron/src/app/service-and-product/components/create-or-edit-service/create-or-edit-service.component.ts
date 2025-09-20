import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyFormatDirective } from '../../../shared/directives/currency-format.directive';
import { CategoryType } from '../../../shared/interfaces/relatedDataGeneral';
import {
  CreateServicePanel,
  ServiceComplete
} from '../../interface/service.interface';
import { SectionHeaderComponent } from '../../../shared/components/section-header/section-header.component';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';
import { ServicesService } from '../../services/services.service';
@Component({
  selector: 'app-create-or-edit-service',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgFor,
    MatButtonModule,
    FontAwesomeModule,
    MatIcon,
    MatIconModule,
    CurrencyFormatDirective,
    SectionHeaderComponent,
    UppercaseDirective
  ],
  templateUrl: './create-or-edit-service.component.html',
  styleUrl: './create-or-edit-service.component.scss'
})
export class CreateOrEditServiceComponent
  implements OnChanges, OnInit, OnDestroy
{
  @Input() currentService?: ServiceComplete;
  @Output() serviceSaved = new EventEmitter<void>();

  @Input()
  set categoryTypes(value: CategoryType[]) {
    this._categoryTypes = value;
    this.visibleCategoryTypes = value.filter((c) =>
      ['Servicios', 'SERVICIOS'].includes(c.name)
    );
    if (this.pendingServiceId && this.visibleCategoryTypes.length > 0) {
      this.getServiceToEdit(this.pendingServiceId);
      this.pendingServiceId = null;
    }
    if (this.currentService && this.visibleCategoryTypes.length > 0) {
      this.updateFormWithService(this.currentService);
    }
    this.cdr.detectChanges();
  }

  get categoryTypes(): CategoryType[] {
    return this._categoryTypes;
  }

  private _categoryTypes: CategoryType[] = [];
  visibleCategoryTypes: CategoryType[] = [];
  serviceForm!: FormGroup;
  id: number = 0;
  isEditMode: boolean = false;
  private pendingServiceId: number | null = null;

  private readonly _serviceService: ServicesService = inject(ServicesService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);
  constructor(private _fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.serviceForm = this._fb.group({
      categoryTypeId: [null, Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      description: ['', Validators.maxLength(250)],
      priceBuy: [
        0,
        [Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.0)]
      ],
      priceSale: [
        0,
        [Validators.pattern(/^\d+(\.\d{1,2})?$/), Validators.min(0.0)]
      ]
    });
  }

  ngOnInit(): void {
    this.subscribeToQueryParams();
  }

  private subscribeToQueryParams(): void {
    this._activatedRoute.queryParams.subscribe((params) => {
      this.handleQueryParams(params);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handleQueryParams(params: any): void {
    if (params['editService'] === 'true') {
      this.isEditMode = false;
      this.id = 0;
      this.resetFormToDefaults();
    } else if (!isNaN(+params['editService'])) {
      const productId = Number(params['editService']);
      this.id = productId;
      this.isEditMode = true;
      if (this.visibleCategoryTypes.length > 0) {
        this.getServiceToEdit(productId);
      } else {
        this.pendingServiceId = productId;
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentService'] && this.currentService) {
      this.id = this.currentService.id;
      this.isEditMode = true;
      if (this.visibleCategoryTypes.length > 0) {
        this.updateFormWithService(this.currentService);
      }
    }
  }

  ngOnDestroy(): void {
    this.resetForm();
  }

  private updateFormWithService(service: ServiceComplete): void {
    this.serviceForm.patchValue({
      categoryTypeId: service.categoryType?.id,
      code: service.code,
      name: service.name,
      description: service.description,
      priceBuy: service.priceBuy,
      priceSale: service.priceSale
    });
    this.cdr.detectChanges();
  }

  private resetFormToDefaults(): void {
    this.serviceForm.reset({
      categoryTypeId: null,
      code: '',
      name: '',
      description: '',
      priceBuy: 0,
      priceSale: 0,
      stateTypeId: null
    });
    this.cdr.detectChanges();
  }

  resetForm() {
    this.resetFormToDefaults();
    Object.keys(this.serviceForm.controls).forEach((key) => {
      const control = this.serviceForm.get(key);
      control?.setErrors(null);
    });
    this.isEditMode = false;
    this._router.navigate([], {
      queryParams: {},
      queryParamsHandling: '',
      replaceUrl: true
    });
    this.cdr.detectChanges();
  }

  private getServiceToEdit(id: number): void {
    this._serviceService.getServiceEditPanel(id).subscribe({
      next: (res) => {
        const service = res.data;
        this.id = service.id;
        this.updateFormWithService(service);
      },
      error: (err) => {
        console.error(
          'Error al obtener el servicio:',
          err.error?.message || err
        );
      }
    });
  }

  save() {
    if (this.serviceForm.valid) {
      const formValue = this.serviceForm.value;
      const serviceSave: CreateServicePanel = {
        id: this.isEditMode ? this.id : undefined,
        code: formValue.code,
        name: formValue.name,
        description: formValue.description,
        priceBuy: Math.abs(Number(formValue.priceBuy)),
        priceSale: Math.abs(Number(formValue.priceSale)),
        categoryTypeId: formValue.categoryTypeId
      };
      if (this.isEditMode) {
        const updateData = { ...serviceSave };
        delete updateData.id;
        this._serviceService.updateServicePanel(this.id, updateData).subscribe({
          next: () => {
            this.serviceSaved.emit();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error al actualizar el servicio', error);
          }
        });
      } else {
        this._serviceService.createServicePanel(serviceSave).subscribe({
          next: () => {
            this.serviceSaved.emit();
            this.resetForm();
          },
          error: (err) => {
            if (err.error && err.error.message) {
              console.error(
                'Error al registrar el servcio:',
                err.error.message
              );
            } else {
              console.error('Error desconocido:', err);
            }
          }
        });
      }
    } else {
      console.error('Formulario no válido', this.serviceForm);
      this.serviceForm.markAllAsTouched();
    }
  }
}
