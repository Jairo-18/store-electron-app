import { CategoryTypeClean } from './../../shared/interfaces/typesClean.interface';

export interface ProductInterfacePaginatedList {
  id: number;
  code?: string;
  name: string;
  description?: string;
  amount?: number;
  priceBuy: number;
  priceSale: number;
  isActive: boolean;
  categoryType: CategoryTypeClean;
}
