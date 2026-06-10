import { useQuery } from '@tanstack/react-query';
import { Api } from '@/api';
import { queryKeys } from './queryKeys';

export function useStories() {
  return useQuery({
    queryKey: queryKeys.stories.all,
    queryFn: () => Api.stories.getAll(),
  });
}
