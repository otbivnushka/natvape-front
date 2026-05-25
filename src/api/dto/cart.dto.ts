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
