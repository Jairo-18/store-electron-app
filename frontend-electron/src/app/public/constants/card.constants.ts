import { DashboardCard } from '../interface/card.interface';

export const DASHBOARD_CARDS: DashboardCard[] = [
  {
    icon: 'person',
    title: 'Clientes',
    description: 'Administra tus clientes registrados en el sistema',
    route: '/organizational/users/list',
    iconNext: 'navigate_next',
    allowedRoles: ['Cliente', 'Administrador', 'ADMINISTRADOR', 'CLIENTE']
  },
  {
    icon: 'store',
    title: 'Productos',
    description: 'Gestión de productos',
    route: '/service-and-product/general',
    queryParams: { editProduct: true },
    iconNext: 'navigate_next',
    allowedRoles: ['Cliente', 'Administrador', 'ADMINISTRADOR', 'CLIENTE']
  },
  {
    icon: 'note',
    title: 'Facturación',
    description: 'Genera y gestiona facturas, pagos y cobros',
    route: '/invoice/invoices/list',
    iconNext: 'navigate_next',
    allowedRoles: ['Cliente', 'Administrador', 'ADMINISTRADOR', 'CLIENTE']
  },
  {
    icon: 'attach_money',
    title: 'Reportes / Ganancias',
    description: 'Analiza el rendimiento con reportes detallados',
    route: '/sales/earnings-sumary',
    iconNext: 'navigate_next',
    allowedRoles: ['Cliente', 'Administrador', 'ADMINISTRADOR', 'CLIENTE']
  }
];
