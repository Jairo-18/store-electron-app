import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import * as uuid from 'uuid';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { CreateUserPanel } from '../../interfaces/create.interface';
import {
  IdentificationType,
  PhoneCode,
  RoleType
} from '../../../shared/interfaces/relatedDataGeneral';
import { BasePageComponent } from '../../../shared/components/base-page/base-page.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { UserInterface } from '../../../shared/interfaces/user.interface';
import { UppercaseDirective } from '../../../shared/directives/uppercase.directive';
import { RelatedDataService } from '../../../shared/services/relatedData.service';

@Component({
  selector: 'app-create-or-edit-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NgFor,
    MatButtonModule,
    FontAwesomeModule,
    MatIcon,
    BasePageComponent,
    LoaderComponent,
    UppercaseDirective
  ],
  templateUrl: './create-or-edit-users.component.html',
  styleUrl: './create-or-edit-users.component.scss'
})
export class CreateOrEditUsersComponent implements OnInit {
  private readonly _usersService: UsersService = inject(UsersService);
  private readonly _relatedDataService: RelatedDataService =
    inject(RelatedDataService);
  private readonly _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private readonly _router: Router = inject(Router);

  userForm: FormGroup;
  id: string = '';
  identificationType: IdentificationType[] = [];
  roleType: RoleType[] = [];
  phoneCode: PhoneCode[] = [];
  isEditMode: boolean = false;
  loading: boolean = false;
  userLogged?: UserInterface;

  constructor(private _fb: FormBuilder) {
    this.userForm = this._fb.group({
      roleTypeId: ['', Validators.required],
      identificationTypeId: ['', [Validators.required]],
      identificationNumber: ['', [Validators.required]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      phoneCodeId: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{1,15}$/)]],
      isActive: [true, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getRelatedData();
    this.id = this._activatedRoute.snapshot.params['id'];
    this.isEditMode = !!this.id;
    if (this.isEditMode) {
      this.getUserToEdit(this.id);
    }
  }

  /**
   * @param getRelatedData - Obtiene los tipos de identificación.
   */
  getRelatedData(): void {
    this.loading = true;

    this._relatedDataService.createUserRelatedData().subscribe({
      next: (res) => {
        const allRoles = res.data?.roleType || [];

        const roleName = this.userLogged?.roleType?.name;

        if (roleName === 'Recepcionista' || roleName === 'RECEPCIONISTA') {
          // Si es Recepcionista, solo puede ver el rol Cliente
          this.roleType = allRoles.filter(
            (r) => r.name === 'Cliente' || r.name === 'CLIENTE'
          );
        } else if (
          roleName === 'Empleado' ||
          roleName === 'RECEPCIONISTA' ||
          roleName === 'recepcionista'
        ) {
          // Si es Empleado, solo puede ver el rol Cliente
          this.roleType = allRoles.filter(
            (r) => r.name === 'Cliente' || r.name === 'CLIENTE'
          );
        } else {
          this.roleType = allRoles;
        }

        this.identificationType = res.data?.identificationType || [];
        this.phoneCode = res.data?.phoneCode || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos relacionados:', error);
        this.loading = false;
      }
    });
  }

  private getUserToEdit(id: string): void {
    this.loading = true;
    this._usersService.getUserEditPanel(id).subscribe({
      next: (res) => {
        const user = res.data;

        this.userForm.patchValue({
          id: user.id,
          roleTypeId: user.roleType?.id,
          identificationTypeId: user.identificationType?.id,
          identificationNumber: user.identificationNumber,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phoneCodeId: user.phoneCode?.id,
          phone: user.phone,
          isActive: user.isActive
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener usuario:', err.error?.message || err);
      }
    });
  }

  save() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userSave: CreateUserPanel = {
        id: this.isEditMode ? this.id : uuid.v4(),
        roleType: formValue.roleTypeId,
        identificationType: formValue.identificationTypeId,
        identificationNumber: formValue.identificationNumber,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phoneCode: formValue.phoneCodeId,
        phone: formValue.phone,
        isActive: formValue.isActive
      };
      if (this.id) {
        if (this.userForm.invalid) return;
        delete userSave.id;
        this._usersService.updateUser(this.id, userSave).subscribe({
          next: () => {
            this._router.navigateByUrl('/organizational/users/list');
          },
          error: (error) => {
            console.error('Error al actualizar el usuario', error);
          }
        });
      } else {
        this._usersService.createUser(userSave).subscribe({
          next: () => {
            this._router.navigateByUrl('/organizational/users/list');
          },
          error: (err) => {
            if (err.error && err.error.message) {
              console.error('Error al registrar usuario:', err.error.message);
            } else {
              console.error('Error desconocido:', err);
            }
          }
        });
      }
    } else {
      console.error('Formulario no válido', this.userForm);
      this.userForm.markAllAsTouched();
    }
  }

  onEmailInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.userForm
      .get('email')
      ?.setValue(input.value.toLowerCase(), { emitEvent: false });
  }
}
