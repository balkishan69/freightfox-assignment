import { useState, useCallback, useRef, useEffect } from 'react';

type AsyncStatus = 'idle' | 'pending' | 'success' | 'error';

interface AsyncState<T> {
  status: AsyncStatus;
  data: T | null;
  error: Error | null;
}

export function useAsync<T, Args extends any[] = any[]>(
  asyncFunction: (signal: AbortSignal, ...args: Args) => Promise<T>,
  immediate = false,
  ...initialArgs: any[]
) {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(
    async (...args: Args) => {
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setState(prev => ({ ...prev, status: 'pending', error: null }));

      try {
        const response = await asyncFunction(abortController.signal, ...args);

        if (abortController.signal.aborted) return;

        if (mountedRef.current) {
          setState({ status: 'success', data: response, error: null });
        }
        
        return response;
      } catch (error: any) {
        
        if (error.name === 'AbortError' || abortController.signal.aborted) {
          return;
        }
        
        if (mountedRef.current) {
          setState({ status: 'error', data: null, error: error as Error });
        }
        throw error;
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute(...(initialArgs as Args));
    }

  }, [immediate]);

  return { ...state, execute };
}
