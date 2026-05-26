import { useMemo } from 'react';
import { useApiData } from './useApiData';
import { Api } from '../api';
import type { ApiCategoryInfo } from '../api/dto/category.dto';

export function useCategories(): {
  categories: ApiCategoryInfo[];
  getByKey: (key: string) => ApiCategoryInfo | undefined;
} {
  const { data } = useApiData(() => Api.categories.getAll(), []);
  const categories = data ?? [];

  const getByKey = useMemo(
    () => (key: string) => categories.find((c) => c.key === key),
    [categories],
  );

  return { categories, getByKey };
}
