import { CategoryType } from '../../shared/interfaces/relatedDataGeneral';

export interface CreateServicePanel {
  id?: number;
  code: string;
  name: string;
  description?: string;
  priceBuy: number;
  taxe?: number;
  priceSale: number;
  categoryTypeId: number;
}

export interface ServiceComplete {
  id: number;
  code: string;
  name: string;
  description?: string;
  priceBuy: number;
  priceSale: number;
  taxe?: number;
  categoryType: CategoryType;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date;
}

export interface ServiceListResponse {
  services: ServiceComplete[];
}
