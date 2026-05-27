import type { Address } from '../../types';

export interface ApiProfile {
  id: number;
  name: string;
  phone: string | null;
  avatar: string | null;
  isAdmin: boolean;
  telegramUsername: string | null;
  telegramPhotoUrl: string | null;
  addresses: Address[];
  totalSpent: number;
  ordersCount: number;
}
