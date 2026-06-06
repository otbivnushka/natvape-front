import type { Address } from '@/types';

export interface ApiProfile {
  id: number;
  name: string;
  isAdmin: boolean;
  telegramUsername: string | null;
  addresses: Address[];
  totalSpent: number;
  ordersCount: number;
}
