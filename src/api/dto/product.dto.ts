import type { ApiCategoryInfo } from './category.dto';

export interface ApiProductAttributeItem {
  id: number;
  name: string;
  key: string;
  type: string;
  value: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  category: ApiCategoryInfo;
  price: number;
  doublePrice: number | null;
  rating: number;
  image: string;
  imageId: number | null;
  description: string;
  badge: string | null;
  brand: string;
  variantLabel?: string;
  variants?: { id: number; name: string; value: string; stock: number }[];
  colors?: { id: number; name: string; hex: string; stock: number }[];
  userRate?: number;
  visible: boolean;
  attributes?: ApiProductAttributeItem[];
}

export interface ApiProductsResponse {
  items: ApiProduct[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProductsQuery {
  category?: string;
  search?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
  limit?: number;
  attribute?: Record<string, string>;
}

export interface AttributeValuesItem {
  key: string;
  name: string;
  values: string[];
}
