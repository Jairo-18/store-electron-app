import { SearchField } from '../../shared/interfaces/search.interface';

export const searchFieldsProducts: SearchField[] = [
  {
    name: 'search',
    label: 'Código, nombre, unidades o precios',
    type: 'text',
    placeholder: ' '
  },
  {
    name: 'categoryType',
    label: 'Categoría',
    type: 'select',
    options: [],
    placeholder: 'Buscar por categoría'
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

export const searchFieldsServices: SearchField[] = [
  {
    name: 'search',
    label: 'Código, nombre, precios',
    type: 'text',
    placeholder: ' '
  },

  {
    name: 'categoryType',
    label: 'Categoría',
    type: 'select',
    options: [],
    placeholder: 'Buscar por categoría'
  },

  {
    name: 'stateType',
    label: 'Estado',
    type: 'select',
    options: [],
    placeholder: 'Buscar por estado'
  }
];
