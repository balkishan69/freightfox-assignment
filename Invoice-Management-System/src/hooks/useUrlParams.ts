import { useSearchParams } from 'react-router-dom';
import { useCallback } from 'react';

export function useUrlParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const getParam = useCallback((key: string): string | null => {
    return searchParams.get(key);
  }, [searchParams]);

  const setParam = useCallback((key: string, value: string | null) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (value === null || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
      return newParams;
    }, { replace: true }); // Use replace to avoid filling history stack for every filter change
  }, [setSearchParams]);

  const setMultipleParams = useCallback((params: Record<string, string | null>) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === '') {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });
      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  return {
    searchParams,
    getParam,
    setParam,
    setMultipleParams
  };
}
