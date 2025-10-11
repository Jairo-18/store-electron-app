export const GET_INVOICE_EXAMPLE = {
  invoiceId: 2,
  code: '0023',
  subtotalWithTax: '0.00',
  total: '0.00',
  startDate: '2025-05-27',
  endDate: '2025-05-30',
  createdAt: '2025-05-28T03:30:48.678Z',
  updatedAt: '2025-05-28T03:30:48.678Z',
  deletedAt: null,
  invoiceType: {
    invoiceTypeId: 1,
    code: 'FV',
    name: 'Factura de Venta',
    createdAt: '2025-05-28T03:21:13.334Z',
    updatedAt: '2025-05-28T03:21:13.334Z',
    deletedAt: null,
  },
  invoiceDetails: [],
};

export const CREATE_RELATED_DATA_INVOICE_EXAMPLE = {
  categoryType: [
    { id: '1', code: 'MEC', name: 'MECATO' },
    { id: '2', code: 'BAR', name: 'BAR' },
  ],
  invoiceType: [
    { id: '1', code: 'FV', name: 'FACTURA DE VENTA' },
    { id: '2', code: 'FC', name: 'FACTURA DE COMPRA' },
  ],
  taxeType: [
    { id: '1', name: 'IVA 19%', percentage: 19 },
    { id: '2', name: 'IVA 0%', percentage: 0 },
  ],
  payType: [
    { id: '1', code: 'EF', name: 'EFECTIVO' },
    { id: '2', code: 'TC', name: 'TARJETA DE CRÉDITO' },
  ],
  paidType: [
    { id: '1', code: 'PA', name: 'PAGADO' },
    { id: '2', code: 'PP', name: 'POR PAGAR' },
  ],
  identificationType: [
    { id: '1', code: 'CC', name: 'CEDULA DE CIUDADANIA' },
    { id: '2', code: 'NIT', name: 'NIT' },
  ],
};
