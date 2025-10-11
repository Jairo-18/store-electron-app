import { CategoryTypeClean } from './../../shared/interfaces/types-clean.interface';
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
