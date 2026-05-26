import type { Address } from '../../types';

export interface ApiProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  isAdmin: boolean;
  addresses: Address[];
  totalSpent: number;
  ordersCount: number;
}
