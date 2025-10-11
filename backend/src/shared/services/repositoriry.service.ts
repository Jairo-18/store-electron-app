import { PayTypeRepository } from './../repositories/payType.repository';
import { PaidTypeRepository } from './../repositories/paidType.repository';
import { RoleTypeRepository } from './../repositories/roleType.repository';
import { TaxeTypeRepository } from './../repositories/taxeType.repository';
import { CategoryTypeRepository } from './../repositories/categoryType.repository';
import { PhoneCodeRepository } from './../repositories/phoneCode.repository';
import { Injectable } from '@nestjs/common';
import { IdentificationTypeRepository } from '../repositories/identificationType.repository';
import { Repository } from 'typeorm';
import { InvoiceTypeRepository } from '../repositories/invoiceType.repository';
import { BedTypeRepository } from '../repositories/bedType.repository';
import { StateTypeRepository } from '../repositories/stateType.repository';

@Injectable()
export class RepositoryService {
  public repositories: {
    categoryType: CategoryTypeRepository;
    identificationType: IdentificationTypeRepository;
    invoiceType: InvoiceTypeRepository;
    paidType: PaidTypeRepository;
    payType: PayTypeRepository;
    phoneCode: PhoneCodeRepository;
    roleType: RoleTypeRepository;
    taxeType: TaxeTypeRepository;
    bedType: BedTypeRepository;
    stateType: StateTypeRepository;
  };

  constructor(
    private readonly _categoryTypeRepository: CategoryTypeRepository,
    private readonly _identificationTipeRepository: IdentificationTypeRepository,
    private readonly _invoiceTypeRepository: InvoiceTypeRepository,
    private readonly _paidTypeRepository: PaidTypeRepository,
    private readonly _payTypeRepository: PayTypeRepository,
    private readonly _phoneCodeRepository: PhoneCodeRepository,
    private readonly _roleRepository: RoleTypeRepository,
    private readonly _taxeTypeRepository: TaxeTypeRepository,
    private readonly _bedTypeRepository: BedTypeRepository,
    private readonly _stateTypeRepository: StateTypeRepository,
  ) {
    this.repositories = {
      categoryType: _categoryTypeRepository,
      identificationType: _identificationTipeRepository,
      invoiceType: _invoiceTypeRepository,
      paidType: _paidTypeRepository,
      payType: _payTypeRepository,
      phoneCode: _phoneCodeRepository,
      roleType: _roleRepository,
      taxeType: _taxeTypeRepository,
      bedType: _bedTypeRepository,
      stateType: _stateTypeRepository,
    };
  }

  /**
   * Método para obtener todas las entidades del repositorio enviado por los parametros
   * @param repository
   * @returns
   */
  async getEntities<T>(repository: Repository<T>): Promise<T[]> {
    return await repository.find();
  }
}
