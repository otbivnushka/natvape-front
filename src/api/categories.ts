import { ApiRoutes } from './constants';
import type { ApiCategoryInfo } from './dto/category.dto';
import { axiosInstance } from './instance';

export const getAll = async (): Promise<ApiCategoryInfo[]> => {
  const { data } = await axiosInstance.get<ApiCategoryInfo[]>(ApiRoutes.CATEGORIES);
  return data;
};
