import { api } from './client';

export interface ApiCartProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: { id: number; key: string; label: string };
  brand: string;
  badge?: 'NEW' | 'SALE';
}

export interface ApiCartItem {
  id: number;
  product: ApiCartProduct;
  quantity: number;
  variantKey: string | null;
}

export interface ApiCartResponse {
  items: ApiCartItem[];
  totalItems: number;
  subtotal: number;
}

export const cartApi = {
  get: () =>
    api.get<ApiCartResponse>('/cart'),

  add: (productId: number, quantity: number, variantKey?: string) =>
    api.post<ApiCartResponse>('/cart', { productId, quantity, variantKey }),

  updateQty: (itemId: number, quantity: number) =>
    api.patch<ApiCartResponse>(`/cart/${itemId}`, { quantity }),

  remove: (itemId: number) =>
    api.delete<ApiCartResponse>(`/cart/${itemId}`),

  clear: () =>
    api.delete<ApiCartResponse>('/cart'),
};
