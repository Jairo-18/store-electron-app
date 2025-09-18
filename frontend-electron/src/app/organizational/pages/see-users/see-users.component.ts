import {
  IdentificationType,
  PhoneCode,
  RoleType
} from './../../../shared/interfaces/relatedDataGeneral';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchField } from './../../../shared/interfaces/search.interface';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { SearchFieldsComponent } from '../../../shared/components/search-fields/search-fields.component';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { MatDialog } from '@angular/material/dialog';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { UserComplete } from '../../interfaces/create.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PaginationInterface } from '../../../shared/interfaces/pagination.interface';
import { YesNoDialogComponent } from '../../../shared/components/yes-no-dialog/yes-no-dialog.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { RelatedDataService } from '../../../shared/services/relatedData.service';

@Component({
  selector: 'app-see-users',
  standalone: true,
  imports: [
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
    SearchFieldsComponent,
    LoaderComponent,
    MatTab,
    MatTabGroup,
    BasePageComponent
  ],
  templateUrl: './see-users.component.html',
  styleUrl: './see-users.component.scss'
})
export class SeeUsersComponent implements OnInit {
  private readonly _relatedDataService: RelatedDataService =
    inject(RelatedDataService);
  private readonly _usersService: UsersService = inject(UsersService);
  private readonly _router = inject(Router);
  private readonly _matDialog: MatDialog = inject(MatDialog);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(SearchFieldsComponent) searchComponent!: SearchFieldsComponent;

  displayedColumns: string[] = [
    'identificationType',
    'identificationNumber',
    'firstName',
    'lastName',
    'roleType',
    'phoneCode',
    'phone',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<UserComplete>([]);
  roleType: RoleType[] = [];
  identificationType: IdentificationType[] = [];
  phoneCode: PhoneCode[] = [];
  form!: FormGroup;
  showClearButton: boolean = false;
  loading: boolean = false;
  isMobile: boolean = false;
  params: any = {};
  selectedTabIndex: number = 0;
  paginationParams: PaginationInterface = {
    page: 1,
    perPage: 25,
    total: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  };

  /**
   * @param searchFields - Creación del buscador.
   */
  searchFields: SearchField[] = [
    {
      name: 'search',
      label: 'Nombre, apellido o identificación',
      type: 'text',
      placeholder: ' '
    },
    {
      name: 'roleType',
      label: 'Rol',
      type: 'select',
      options: [],
      placeholder: 'Buscar por rol'
    },
    {
      name: 'identificationType',
      label: 'Tipo de identificación',
      type: 'select',
      options: [],
      placeholder: 'Buscar por tipo de identificación'
    },
    {
      name: 'phoneCode',
      label: 'Nacionalidad',
      type: 'select',
      placeholder: 'Buscar por nacionalidad'
    },
    {
      name: 'isActive',
      label: 'Estado',
      type: 'select',
      options: [
        { value: true, label: 'Activo' },
        { value: false, label: 'Inactivo' }
      ],
      placeholder: 'Buscar por estado'
    }
  ];

  /**
   * @param ngOnInit - Inicialización de las funciones.
   */
  ngOnInit(): void {
    this.loadUsers();
    this.getDataForFields();
  }

  constructor() {
    this.isMobile = window.innerWidth <= 768;
    if (this.isMobile) this.paginationParams.perPage = 5;
  }

  /**
   * @param _getDataForFields - Obtiene los select de roles y tipos de identificación.
   */
  private getDataForFields(): void {
    this.loading = true;
    this._relatedDataService.createUserRelatedData().subscribe({
      next: (res) => {
        const role = res.data?.roleType || [];
        const identificationType = res.data?.identificationType || [];
        const phoneCode = res.data?.phoneCode || [];

        // Guardar para uso en los métodos getXXXName
        this.roleType = role;
        this.identificationType = identificationType;
        this.phoneCode = phoneCode;

        const roleOption = this.searchFields.find(
          (field) => field.name === 'roleType'
        );
        const identificationTypeOption = this.searchFields.find(
          (field) => field.name === 'identificationType'
        );
        const phoneCodeOption = this.searchFields.find(
          (field) => field.name === 'phoneCode'
        );

        if (roleOption) {
          roleOption.options = role.map((role) => ({
            value: role.id,
            label: role.name || ''
          }));
        }

        if (identificationTypeOption) {
          identificationTypeOption.options = identificationType.map((type) => ({
            value: type.id,
            label: type.name || ''
          }));
        }

        if (phoneCodeOption) {
          phoneCodeOption.options = phoneCode.map((type) => ({
            value: type.id,
            label: type.name || ''
          }));
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando datos relacionados', err);
      }
    });
  }

  getRoleName(id: string): string {
    return this.roleType.find((r) => r.id === id)?.name || '';
  }

  getIdentificationTypeName(id: number): string {
    return this.identificationType.find((t) => t.id === id)?.code || '';
  }

  getPhoneCodeDisplay(id: number): string {
    const phoneCode = this.phoneCode.find((p) => p.id === id);
    return phoneCode ? `${phoneCode.code} - ${phoneCode.name}` : '';
  }

  /**
   * @param onSearchSubmit - Botón de búsqueda.
   */
  onSearchSubmit(values: any): void {
    this.params = values;
    this.paginationParams.page = 1;
    this.loadUsers();
  }

  /**
   * @param onChangePagination - Cambio de paginación.
   */
  onChangePagination(event: PageEvent): void {
    this.paginationParams.page = event.pageIndex + 1;
    this.paginationParams.perPage = event.pageSize;
    this.loadUsers();
  }

  /**
   * @param onTabChange - Cambio de tabla.
   */
  onTabChange(index: number): void {
    this.selectedTabIndex = index;
  }

  onSearchChange(form: any): void {
    this.showClearButton = !!form.length;
    this.params = form?.value;
    this.loadUsers();
  }

  /**
   * @param goToCreateUser - Ir a crear usuarios
   */
  goToCreateUser(): void {
    this._router.navigate(['/users/create']);
  }

  /**
   * @param loadUsers - Carga de usuarios.
   * @param getUserWithPagination - Obtiene los usuarios con paginación.
   */
  loadUsers(filter: string = ''): void {
    this.loading = true;
    const query = {
      page: this.paginationParams.page,
      perPage: this.paginationParams.perPage,
      search: filter,
      ...this.params
    };

    this._usersService.getUserWithPagination(query).subscribe({
      next: (res) => {
        this.dataSource.data = (res.data || []).sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
        this.paginationParams = res?.pagination;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  /**
   * @param _deleteUser - Ellimina un usuario.
   */
  private deleteUser(id: string): void {
    this.loading = true;
    this._usersService.deleteUserPanel(id).subscribe({
      next: () => {
        this.loadUsers();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.loading = false;
      }
    });
  }

  /**
   * @param openDeleteUserDialog - Abre un modal para eliminar un usuario.
   */
  openDeleteUserDialog(id: string): void {
    const dialogRef = this._matDialog.open(YesNoDialogComponent, {
      data: {
        title: '¿Deseas eliminar este usuario?',
        message: 'Esta acción no se puede deshacer.'
      }
    });

    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) {
        this.deleteUser(id);
      }
    });
  }
}
