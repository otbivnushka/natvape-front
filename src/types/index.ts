import type { CreateProductDto } from '@/api/dto/admin.dto';

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
  userRate?: number;
  visible: boolean;
  variantLabel?: string;
  variants?: ProductVariant[];
  colors?: ProductColor[];
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  variantKey?: string;
  variantName?: string;
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
  user: { telegramId: string; telegramUsername: string };
}

export interface UserProfile {
  id: number;
  name: string;
  isAdmin: boolean;
  telegramUsername: string | null;
  addresses: Address[];
  totalSpent: number;
  ordersCount: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'name';

export interface VariantForm {
  id?: number;
  name: string;
  value: string;
  stock: number;
}

export interface ColorForm {
  id?: number;
  name: string;
  hex: string;
  stock: number;
}

export interface ProductForm extends Omit<CreateProductDto, 'variants' | 'colors' | 'imageId'> {
  imageId: number | null;
  variants: VariantForm[];
  colors: ColorForm[];
}
