import { CategoryType } from '../../shared/interfaces/relatedDataGeneral';

export interface CreateProductPanel {
  id?: number;
  code: string;
  name: string;
  description?: string;
  amount: number;
  priceBuy: number;
  priceSale: number;
  isActive: boolean;
  taxe?: number;
  categoryTypeId: number;
}

export interface ProductComplete {
  id: number;
  code: string;
  name: string;
  description?: string;
  amount: number;
  taxe?: number;
  priceBuy: number;
  priceSale: number;
  isActive: boolean;
  categoryType: CategoryType;
  updatedAt: Date;
  createdAt: Date;
  deletedAt: Date;
}

export interface ProductListResponse {
  products: ProductComplete[];
}
