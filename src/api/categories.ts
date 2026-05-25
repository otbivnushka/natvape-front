import { api } from './client';

export interface ApiCategoryInfo {
  id: number;
  key: string;
  label: string;
  productCount?: number;
}

export const categoriesApi = {
  getAll: () => api.get<ApiCategoryInfo[]>('/categories'),
};
