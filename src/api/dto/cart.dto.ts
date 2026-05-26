export interface ApiCartProduct {
  id: number;
  name: string;
  price: number;
  doublePrice: number | null;
  image: string;
  imageId: number | null;
  category: { id: number; key: string; label: string };
  brand: string;
  badge: string | null;
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
