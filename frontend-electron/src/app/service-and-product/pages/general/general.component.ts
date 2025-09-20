import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { SeeProductsComponent } from '../../components/see-products/see-products.component';
import { ActivatedRoute } from '@angular/router';
import { ProductComplete } from '../../interface/product.interface';
import { RelatedDataService } from '../../../shared/services/relatedData.service';
import { SearchField } from '../../../shared/interfaces/search.interface';
import { CreateOrEditProductComponent } from '../../components/create-or-edit-product/create-or-edit-product.component';
import { CategoryType } from '../../../shared/interfaces/relatedDataGeneral';
import {
  searchFieldsProducts,
  searchFieldsServices
} from '../../constants/searchFields.constants';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { SeeServicesComponent } from '../../components/see-services/see-services.component';
import { CreateOrEditServiceComponent } from '../../components/create-or-edit-service/create-or-edit-service.component';
import { ServiceComplete } from '../../interface/service.interface';

@Component({
  selector: 'app-general',
  standalone: true,
  imports: [
    MatTabsModule,
    SeeProductsComponent,
    CreateOrEditProductComponent,
    CreateOrEditServiceComponent,
    SeeServicesComponent,
    BasePageComponent
  ],
  templateUrl: './general.component.html',
  styleUrl: './general.component.scss'
})
export class GeneralComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  @ViewChild(SeeProductsComponent) seeProductsComponent!: SeeProductsComponent;
  @ViewChild(SeeServicesComponent)
  seeServiceComponent!: SeeServicesComponent;
  @ViewChild(CreateOrEditProductComponent)
  createOrEditProductComponent!: CreateOrEditProductComponent;
  @ViewChild(CreateOrEditServiceComponent)
  createOrEditServiceComponent!: CreateOrEditServiceComponent;

  private readonly _route: ActivatedRoute = inject(ActivatedRoute);
  private readonly _relatedDataService: RelatedDataService =
    inject(RelatedDataService);
  private readonly tabIndexMap: Record<string, number> = {
    editProduct: 0,
    editService: 1
  };

  currentProduct?: ProductComplete;
  currentService?: ServiceComplete;
  categoryTypes: CategoryType[] = [];
  searchFieldsProducts: SearchField[] = searchFieldsProducts;
  searchFieldsServices: SearchField[] = searchFieldsServices;

  ngOnInit(): void {
    this.loadRelatedData();
  }

  ngAfterViewInit(): void {
    this._route.queryParams.subscribe((params) => {
      for (const key in this.tabIndexMap) {
        if (params[key]) {
          this.tabGroup.selectedIndex = this.tabIndexMap[key];
          break;
        }
      }
    });
  }

  goToTop(): void {
    const main = document.querySelector('main');
    if (main) {
      main.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  cleanProduct() {
    this.createOrEditProductComponent.resetForm();
  }
  cleanServices() {
    this.createOrEditServiceComponent.resetForm();
  }

  loadRelatedData(): void {
    this._relatedDataService.createProductAndServiceRelatedData().subscribe({
      next: (res) => {
        this.categoryTypes = res.data?.categoryType || [];

        this.updateCategoryTypeOptions();
      },
      error: (err) => console.error('Error al cargar datos de select:', err)
    });
  }

  updateCategoryTypeOptions(): void {
    const updateOptions = (
      searchFields: SearchField[],
      fieldName: string,
      options: { value: number; label: string }[]
    ) => {
      const field = searchFields.find((f) => f.name === fieldName);
      if (field) {
        field.options = options;
      }
    };

    // Category Type
    const categoryOptions = this.categoryTypes.map((type) => ({
      value: type.id,
      label: type.name || ''
    }));
    updateOptions(this.searchFieldsProducts, 'categoryType', categoryOptions);
    updateOptions(this.searchFieldsServices, 'categoryType', categoryOptions);
  }

  reloadProducts(): void {
    if (this.seeProductsComponent && this.seeProductsComponent.loadProducts) {
      this.seeProductsComponent.loadProducts();
    } else {
      console.warn(
        'SeeProductsComponent o su método loadProducts no están disponibles.'
      );
    }
  }

  reloadServices(): void {
    if (this.seeServiceComponent && this.seeServiceComponent.loadServices) {
      this.seeServiceComponent.loadServices();
    } else {
      console.warn(
        'SeeProductsComponent o su método loadProducts no están disponibles.'
      );
    }
  }
}
