import {
  IdentificationType,
  PhoneCode,
  RoleType
} from '../../shared/interfaces/relatedDataGeneral';

export interface CreateUserPanel {
  id?: string;
  identificationType: number;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: number;
  phone: string;
  isActive?: boolean;
  roleType?: string;
}

export interface UserComplete {
  id: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneCode: PhoneCode;
  phone: string;
  roleType?: RoleType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ChangePassword {
  oldPassword?: string;
  newPassword: string;
  confirmNewPassword: string;
  userId?: string;
  resetToken?: string;
}
