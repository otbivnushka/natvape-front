import { ApiRoutes } from '../constants';
import type { ApiCategoryAttribute } from '../dto/admin.dto';
import { axiosInstance } from '../instance';

export const getByCategory = async (categoryId: number): Promise<ApiCategoryAttribute[]> => {
  const { data } = await axiosInstance.get<ApiCategoryAttribute[]>(
    ApiRoutes.CATEGORY_ATTRIBUTES.replace(':id', String(categoryId)),
  );
  return data;
};
