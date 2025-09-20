import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import {
  CreateServicePanel,
  ServiceListResponse,
  ServiceComplete
} from '../interface/service.interface';
import {
  ApiResponseCreateInterface,
  ApiResponseInterface
} from '../../shared/interfaces/api-response.interface';
import { HttpUtilitiesService } from '../../shared/utilities/http-utilities.service';
import { PaginationInterface } from '../../shared/interfaces/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  private readonly _httpClient: HttpClient = inject(HttpClient);
  private readonly _httpUtilities: HttpUtilitiesService =
    inject(HttpUtilitiesService);

  getServiceWithPagination(query: object): Observable<{
    pagination: PaginationInterface;
    data: CreateServicePanel[];
  }> {
    const params = this._httpUtilities.httpParamsFromObject(query);
    return this._httpClient.get<{
      pagination: PaginationInterface;
      data: CreateServicePanel[];
    }>(`${environment.apiUrl}service/paginated-list`, { params });
  }

  getAllServices(): Observable<{ data: ServiceListResponse }> {
    return this._httpClient.get<{ data: ServiceListResponse }>(
      `${environment.apiUrl}service`
    );
  }

  getServiceEditPanel(
    id: number
  ): Observable<ApiResponseInterface<ServiceComplete>> {
    return this._httpClient.get<ApiResponseInterface<ServiceComplete>>(
      `${environment.apiUrl}service/${id}`
    );
  }

  createServicePanel(
    service: CreateServicePanel
  ): Observable<ApiResponseCreateInterface> {
    return this._httpClient.post<ApiResponseCreateInterface>(
      `${environment.apiUrl}service/create`,
      service
    );
  }

  updateServicePanel(id: number, body: unknown): Observable<void> {
    return this._httpClient.patch<void>(
      `${environment.apiUrl}service/${id}`,
      body
    );
  }

  deleteServicePanel(id: number): Observable<unknown> {
    return this._httpClient.delete(`${environment.apiUrl}service/${id}`);
  }
}
