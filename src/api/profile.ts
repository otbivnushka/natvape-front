import { api } from './client';
import type { Address } from '../types';

export interface ApiProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  addresses: Address[];
  totalSpent: number;
  ordersCount: number;
}

export const profileApi = {
  get: () =>
    api.get<ApiProfile>('/profile'),

  update: (data: Partial<Pick<ApiProfile, 'name' | 'phone' | 'avatar'>>) =>
    api.patch<ApiProfile>('/profile', data),
};
