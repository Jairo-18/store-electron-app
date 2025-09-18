import { CategoryTypeClean } from '../../shared/interfaces/typesClean.interface';

export interface ServiceInterfacePaginatedList {
  id: number;
  code?: string;
  name: string;
  description?: string;
  priceBuy: number;
  priceSale: number;
  categoryType: CategoryTypeClean;
}
