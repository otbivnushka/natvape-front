import { useState, useEffect, useCallback, useRef } from 'react';

export function useApiData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList,
  options?: { enabled?: boolean },
): { data: T | null; loading: boolean; refetch: () => void } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refetch = useCallback(() => {
    setLoading(true);
    fetcher()
      .then((res) => {
        if (mounted.current) setData(res);
      })
      .catch(() => {
        if (mounted.current) setData(null);
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  useEffect(() => {
    if (options?.enabled === false) return;
    refetch();
  }, [refetch, options?.enabled]);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  return { data, loading, refetch };
}
