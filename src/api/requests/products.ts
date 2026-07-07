import { ApiRoutes } from '../constants';
import type { ApiProduct, ApiProductsResponse, ProductsQuery, AttributeValuesItem } from '../dto/product.dto';
import type { Product, Category } from '../../types';
import { axiosInstance } from '../instance';

export const getAll = async (query?: ProductsQuery): Promise<ApiProductsResponse> => {
  const searchParams = new URLSearchParams();
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (key === 'attribute' && value && typeof value === 'object') {
        for (const [attrKey, attrValue] of Object.entries(value as Record<string, string>)) {
          searchParams.append('attr', `${attrKey}:${attrValue}`);
        }
      } else if (value != null && value !== '') {
        searchParams.set(key, String(value));
      }
    }
  }
  const { data } = await axiosInstance.get<ApiProductsResponse>(ApiRoutes.PRODUCTS, {
    params: searchParams,
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

export const getAttributeValues = async (category: string): Promise<AttributeValuesItem[]> => {
  const { data } = await axiosInstance.get<AttributeValuesItem[]>(
    ApiRoutes.PRODUCTS_ATTRIBUTE_VALUES,
    { params: { category } },
  );
  return data;
};

export const mapProduct = (api: ApiProduct): Product => ({
  ...api,
  category: api.category.key as Category,
  doublePrice: api.doublePrice ?? null,
  badge: api.badge ?? null,
  attributes: api.attributes ?? [],
});
