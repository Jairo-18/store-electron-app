import {
  BedTypeClean,
  CategoryTypeClean,
  StateTypeClean,
} from './../../shared/interfaces/types-clean.interface';

export interface AccommodationInterfacePaginatedList {
  accommodationId: number;
  code?: string;
  name: string;
  description?: string;
  amountPerson?: number;
  jacuzzi: boolean;
  amountRoom?: number;
  amountBathroom?: number;
  priceBuy: number;
  priceSale: number;
  stateType: StateTypeClean;
  bedType: BedTypeClean;
  categoryType: CategoryTypeClean;
}
