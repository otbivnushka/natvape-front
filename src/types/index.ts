export type Category = 'liquids' | 'coils' | 'cartridges' | 'snus' | 'pods' | 'disposables';

export interface CategoryInfo {
  id: number;
  key: Category;
  label: string;
}

export interface ProductColor {
  name: string;
  hex: string;
  stock: number;
}

export interface ProductVariant {
  name: string;
  value: string;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  doublePrice: number | null;
  rating: number;
  image: string;
  imageId: number | null;
  description: string;
  badge: string | null;
  brand: string;
  variantLabel?: string;
  variants?: ProductVariant[];
  colors?: ProductColor[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  variantKey?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  variantKey: string | null;
  variantName: string | null;
  quantity: number;
  price: number;
}

export interface Address {
  id: number;
  label: string;
  lat: number;
  lng: number;
}

export interface Order {
  id: number;
  items: OrderItem[];
  total: number;
  status: 'sent' | 'end';
  deliveryMethod: 'pickup' | 'delivery';
  comment: string | null;
  createdAt: string;
  addressId?: number;
  address?: Address;
  deliveryTime?: string;
}

export interface UserProfile {
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

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'name';
