import { api } from './client';
import type { Address } from '../types';

export const addressesApi = {
  getAll: () => api.get<Address[]>('/addresses'),

  create: (data: { label: string; lat: number; lng: number }) =>
    api.post<Address>('/addresses', data),

  remove: (id: number) => api.delete(`/addresses/${id}`),
};
