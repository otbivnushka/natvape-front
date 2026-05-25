import { api } from './client';
import type { Order, OrderItem } from '../types';

export interface ApiOrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  variantKey: string | null;
  variantName: string | null;
  quantity: number;
  price: number;
}

export interface ApiOrder {
  id: number;
  items: ApiOrderItem[];
  total: number;
  status: 'processing' | 'shipping' | 'delivered';
  deliveryMethod: 'pickup' | 'delivery';
  comment: string | null;
  createdAt: string;
  addressId?: number;
  deliveryTime?: string;
}

export interface CreateOrderDto {
  deliveryMethod: 'pickup' | 'delivery';
  comment?: string;
  addressId?: number;
  deliveryTime?: string;
}

function mapOrderItem(i: ApiOrderItem): OrderItem {
  return i;
}

function mapOrder(o: ApiOrder): Order {
  return {
    ...o,
    items: (o.items ?? []).map(mapOrderItem),
    date: o.createdAt.slice(0, 10),
  };
}

export const ordersApi = {
  create: (data: CreateOrderDto) =>
    api.post<ApiOrder>('/orders', data).then(mapOrder),

  getAll: () =>
    api.get<ApiOrder[]>('/orders').then((list) => list.map(mapOrder)),

  getById: (id: number) =>
    api.get<ApiOrder>(`/orders/${id}`).then(mapOrder),
};
