import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseInterface } from '../interfaces/api-response.interface';
import { environment } from '../../../environments/environment';
import {
  CreateProductAndServiceRelatedData,
  CreateUserRelatedData
} from '../interfaces/relatedDataGeneral';
import { createInvoiceRelatedData } from '../../invoices/interface/invoice.interface';

@Injectable({
  providedIn: 'root'
})
export class RelatedDataService {
  private readonly _httpClient: HttpClient = inject(HttpClient);

  createUserRelatedData(): Observable<
    ApiResponseInterface<CreateUserRelatedData>
  > {
    return this._httpClient.get<ApiResponseInterface<CreateUserRelatedData>>(
      `${environment.apiUrl}user/create/related-data`
    );
  }

  createProductAndServiceRelatedData(): Observable<
    ApiResponseInterface<CreateProductAndServiceRelatedData>
  > {
    return this._httpClient.get<
      ApiResponseInterface<CreateProductAndServiceRelatedData>
    >(`${environment.apiUrl}product/create/related-data`);
  }

  createInvoiceRelatedData(): Observable<
    ApiResponseInterface<createInvoiceRelatedData>
  > {
    return this._httpClient.get<ApiResponseInterface<createInvoiceRelatedData>>(
      `${environment.apiUrl}invoices/create/related-data`
    );
  }
}
