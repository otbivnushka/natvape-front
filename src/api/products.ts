import { api } from './client';
import type { Product, Category } from '../types';

export interface ApiCategoryInfo {
  id: number;
  key: string;
  label: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  category: ApiCategoryInfo;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  description: string;
  badge?: 'NEW' | 'SALE';
  brand: string;
  variantLabel?: string;
  variants?: { name: string; value: string; stock: number }[];
  colors?: { name: string; hex: string; stock: number }[];
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
}

export function mapProduct(api: ApiProduct): Product {
  return {
    ...api,
    category: api.category.key as Category,
  };
}

export const productsApi = {
  getAll: (query?: ProductsQuery) =>
    api.get<ApiProductsResponse>('/products', query as Record<string, string | number | undefined>),

  getById: (id: number) =>
    api.get<ApiProduct>(`/products/${id}`),

  getBrands: (category?: string) =>
    api.get<string[]>('/products/brands', { category }),
};
