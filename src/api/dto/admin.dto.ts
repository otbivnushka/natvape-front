import type { ApiOrderItem } from './order.dto';

export interface AdminOrderUser {
  id: number;
  name: string;
  telegramUsername: string | null;
}

export interface AdminOrderAddress {
  id: number;
  label: string;
  lat: number;
  lng: number;
}

export interface AdminOrder {
  id: number;
  userId: number;
  user: AdminOrderUser;
  total: string;
  status: 'sent' | 'end';
  deliveryMethod: 'pickup' | 'delivery';
  comment: string | null;
  address: AdminOrderAddress | null;
  deliveryTime: string;
  createdAt: string;
  items: ApiOrderItem[];
}

export interface CreateProductDto {
  name: string;
  categoryId: number;
  price: number;
  doublePrice?: number | null;
  rating?: number;
  imageId?: number | null;
  description?: string;
  badge?: string | null;
  brand?: string;
  variantLabel?: string;
  variants?: { name: string; value: string; stock: number }[];
  colors?: { name: string; hex: string; stock: number }[];
}

export interface CreatePickupAddressDto {
  label: string;
  lat: number;
  lng: number;
}

export interface ApiCategoryAttribute {
  id: number;
  name: string;
  key: string;
  type: string;
  required: boolean;
}

export interface ApiProductAttribute {
  id: number;
  attributeId: number;
  name: string;
  key: string;
  type: string;
  value: string;
}

export interface CreateCategoryAttributeDto {
  categoryId: number;
  name: string;
  key: string;
  type: string;
  required: boolean;
}

export interface CreateProductAttributeDto {
  attributeId: number;
  value: string;
}

export interface UpdateProductAttributeDto {
  value: string;
}
