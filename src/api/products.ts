import { ApiRoutes } from './constants';
import type { ApiProduct, ApiProductsResponse, ProductsQuery } from './dto/product.dto';
import type { Product, Category } from '../types';
import { axiosInstance } from './instance';

export const getAll = async (query?: ProductsQuery): Promise<ApiProductsResponse> => {
  const { data } = await axiosInstance.get<ApiProductsResponse>(ApiRoutes.PRODUCTS, {
    params: query,
  });
  return data;
};

export const getById = async (id: number, userId?: number): Promise<ApiProduct> => {
  const { data } = await axiosInstance.get<ApiProduct>(
    ApiRoutes.PRODUCT_BY_ID.replace(':id', String(id)),
    { params: { userId } },
  );
  return data;
};

export const getBrands = async (category?: string): Promise<string[]> => {
  const { data } = await axiosInstance.get<string[]>(ApiRoutes.PRODUCTS_BRANDS, {
    params: { category },
  });
  return data;
};

export const mapProduct = (api: ApiProduct): Product => ({
  ...api,
  category: api.category.key as Category,
  doublePrice: api.doublePrice ?? null,
  badge: api.badge ?? null,
});
