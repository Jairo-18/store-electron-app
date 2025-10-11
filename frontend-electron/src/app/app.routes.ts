import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/pages/default-layout/default-layout.component';
import { invoicesRoutes } from './invoices/invoices.routes';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./public/public.routes').then((m) => m.publicRoutes)
      },
      {
        path: 'organizational',
        loadChildren: () =>
          import('./organizational/organizational.routes').then(
            (m) => m.organizationalRoutes
          )
      },
      {
        path: 'service-and-product',
        loadChildren: () =>
          import('./service-and-product/service-and-product.routes').then(
            (m) => m.serviceAndProductRoutes
          )
      },
      {
        path: 'invoice',
        children: invoicesRoutes
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
