import { ProductComplete } from '../../service-and-product/interface/product.interface';
import { TaxeType } from '../../shared/interfaces/relatedDataGeneral';

export interface InvoiceDetaill {
  invoiceDetaillId: number;
  amountSale: string;
  amount: string;
  priceWithoutTax: string;
  priceWithTax: string;
  subtotal: string;
  taxe: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  product?: ProductComplete;
  taxeType: TaxeType;
}

export interface CreateInvoiceDetaill {
  productId?: number;
  amount: number;
  priceBuy: number;
  taxe?: number;
  priceWithoutTax: number;
  taxeTypeId?: number;
  startDate?: string;
  endDate?: string;
}

export interface AddedProductInvoiceDetaill {
  id?: number;
  code: string;
  name: string;
  description?: string;
  amount: number;
  priceBuy: number;
  priceSale: number;
  isActive: boolean;
  categoryTypeId: number;
  taxeTypeId?: number;
}
