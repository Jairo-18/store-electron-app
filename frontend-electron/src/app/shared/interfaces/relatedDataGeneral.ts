export interface CreateType {
  code: string;
  name: string;
}

export interface TypeForEditResponse<T extends CreateType> {
  type: T;
}

export interface CategoryType {
  id: number;
  code?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface RoleType {
  id: string;
  code?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PhoneCode {
  id: number;
  code?: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface IdentificationType {
  id: number;
  code?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PayType {
  id: string;
  code?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PaidType {
  id: string;
  code?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface InvoiceType {
  id: string;
  code?: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AllTypes {
  bedType: TypeItem[];
  categoryType: TypeItem[];
  identificationType: TypeItem[];
  paidType: TypeItem[];
  invoiceType: TypeItem[];
  payType: TypeItem[];
  phoneCode: TypeItem[];
  roleType: TypeItem[];
  stateType: TypeItem[];
  taxeType: TypeItem[];
}

export interface TypeItem {
  id: string;
  code: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface TaxeType {
  id: number;
  code?: string;
  name?: string;
  percentage?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreateUserRelatedData {
  identificationType: IdentificationType[];
  roleType: RoleType[];
  phoneCode: PhoneCode[];
}

export interface CreateProductAndServiceRelatedData {
  categoryType: CategoryType[];
}
