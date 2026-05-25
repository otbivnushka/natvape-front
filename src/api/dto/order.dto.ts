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
