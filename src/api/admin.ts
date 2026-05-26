import { ApiRoutes } from './constants';
import type { AdminOrder, CreateProductDto } from './dto/admin.dto';
import type { ApiProduct } from './dto/product.dto';
import { axiosInstance } from './instance';

export const createProduct = async (dto: CreateProductDto): Promise<ApiProduct> => {
  const { data } = await axiosInstance.post<ApiProduct>(ApiRoutes.ADMIN_PRODUCTS, dto);
  return data;
};

export const updateProduct = async (
  id: number,
  dto: Partial<CreateProductDto>,
): Promise<ApiProduct> => {
  const { data } = await axiosInstance.put<ApiProduct>(
    ApiRoutes.ADMIN_PRODUCT_BY_ID.replace(':id', String(id)),
    dto,
  );
  return data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.ADMIN_PRODUCT_BY_ID.replace(':id', String(id)));
};

export const createVariant = async (
  productId: number,
  dto: { name: string; value: string; stock: number },
): Promise<void> => {
  await axiosInstance.post(ApiRoutes.ADMIN_VARIANTS.replace(':id', String(productId)), dto);
};

export const updateVariant = async (
  variantId: number,
  dto: { stock?: number; name?: string; value?: string },
): Promise<void> => {
  await axiosInstance.patch(
    ApiRoutes.ADMIN_VARIANT_BY_ID.replace(':variantId', String(variantId)),
    dto,
  );
};

export const deleteVariant = async (variantId: number): Promise<void> => {
  await axiosInstance.delete(
    ApiRoutes.ADMIN_VARIANT_BY_ID.replace(':variantId', String(variantId)),
  );
};

export const createColor = async (
  productId: number,
  dto: { name: string; hex: string; stock: number },
): Promise<void> => {
  await axiosInstance.post(ApiRoutes.ADMIN_COLORS.replace(':id', String(productId)), dto);
};

export const updateColor = async (
  colorId: number,
  dto: { stock?: number; name?: string; hex?: string },
): Promise<void> => {
  await axiosInstance.patch(ApiRoutes.ADMIN_COLOR_BY_ID.replace(':colorId', String(colorId)), dto);
};

export const deleteColor = async (colorId: number): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.ADMIN_COLOR_BY_ID.replace(':colorId', String(colorId)));
};

export const createCategory = async (dto: { key: string; label: string }): Promise<void> => {
  await axiosInstance.post(ApiRoutes.ADMIN_CATEGORIES, dto);
};

export const updateCategory = async (
  id: number,
  dto: { label?: string; key?: string },
): Promise<void> => {
  await axiosInstance.patch(ApiRoutes.ADMIN_CATEGORY_BY_ID.replace(':id', String(id)), dto);
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.ADMIN_CATEGORY_BY_ID.replace(':id', String(id)));
};

export const getOrders = async (): Promise<AdminOrder[]> => {
  const { data } = await axiosInstance.get<AdminOrder[]>(ApiRoutes.ADMIN_ORDERS);
  return data;
};

export const getSentOrders = async (): Promise<AdminOrder[]> => {
  const { data } = await axiosInstance.get<AdminOrder[]>(ApiRoutes.ADMIN_ORDERS_SENT);
  return data;
};

export const updateOrderStatus = async (id: number, status: 'sent' | 'end'): Promise<void> => {
  await axiosInstance.patch(ApiRoutes.ADMIN_ORDER_STATUS.replace(':id', String(id)), { status });
};

export const deleteOrder = async (id: number): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.ADMIN_ORDER_BY_ID.replace(':id', String(id)));
};
