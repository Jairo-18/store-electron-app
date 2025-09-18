import { Routes } from '@angular/router';
import { SeeUsersComponent } from './pages/see-users/see-users.component';
import { CreateOrEditUsersComponent } from './pages/create-or-edit-users/create-or-edit-users.component';

export const organizationalRoutes: Routes = [
  {
    path: 'users',
    children: [
      {
        path: 'create',
        component: CreateOrEditUsersComponent
      },
      {
        path: 'list',
        component: SeeUsersComponent
      },
      {
        path: ':id/edit',
        component: CreateOrEditUsersComponent
      }
    ]
  }
];
