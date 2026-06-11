// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — useApiQuery Hook
// React Query-like pattern for API data fetching
// ══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useRef } from 'react';

interface QueryOptions {
  enabled?: boolean;
  refetchInterval?: number; // ms, 0 = disabled
  retryCount?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

interface QueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isRefetching: boolean;
}

export function useApiQuery<T = any>(
  queryFn: () => Promise<{ data: T } | T>,
  deps: any[] = [],
  options: QueryOptions = {},
): QueryResult<T> {
  const {
    enabled = true,
    refetchInterval = 0,
    retryCount = 1,
    retryDelay = 2000,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const retriesRef = useRef(0);

  const execute = useCallback(async (isRefetch = false) => {
    if (!enabled) return;
    if (isRefetch) setIsRefetching(true); else setLoading(true);

    try {
      const result = await queryFn();
      if (!mountedRef.current) return;

      // Handle both { data: T } and raw T responses
      const resolved = (result as any)?.data !== undefined ? (result as any).data : result;
      setData(resolved);
      setError(null);
      retriesRef.current = 0;
      onSuccess?.(resolved);
    } catch (err: any) {
      if (!mountedRef.current) return;

      // Retry logic
      if (retriesRef.current < retryCount) {
        retriesRef.current++;
        setTimeout(() => execute(isRefetch), retryDelay);
        return;
      }

      const msg = err.message || 'Request failed';
      setError(msg);
      onError?.(msg);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setIsRefetching(false);
      }
    }
  }, [enabled, queryFn, retryCount, retryDelay]);

  // Initial fetch + deps change
  useEffect(() => {
    mountedRef.current = true;
    retriesRef.current = 0;
    execute(false);
    return () => { mountedRef.current = false; };
  }, [...deps, enabled]);

  // Auto-refetch interval
  useEffect(() => {
    if (!refetchInterval || refetchInterval <= 0 || !enabled) return;
    const iv = setInterval(() => execute(true), refetchInterval);
    return () => clearInterval(iv);
  }, [refetchInterval, enabled, execute]);

  const refetch = useCallback(() => execute(true), [execute]);

  return { data, loading, error, refetch, isRefetching };
}

// ── Mutation hook ────────────────────────────────────────────
interface MutationResult<T = any> {
  mutate: (fn: () => Promise<any>) => Promise<{ ok: boolean; data?: T; error?: string }>;
  mutateAsync: <R = any>(fn: () => Promise<{ data: R }>) => Promise<R>;
  saving: boolean;
  error: string | null;
  reset: () => void;
}

export function useApiMutation<T = any>(): MutationResult<T> {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (fn: () => Promise<any>) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fn();
      const data = res?.data ?? res;
      return { ok: true, data };
    } catch (err: any) {
      const msg = err.message || 'Operation failed';
      setError(msg);
      return { ok: false, error: msg };
    } finally {
      setSaving(false);
    }
  }, []);

  const mutateAsync = useCallback(async <R = any>(fn: () => Promise<{ data: R }>): Promise<R> => {
    setSaving(true);
    setError(null);
    try {
      const res = await fn();
      return res.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const reset = useCallback(() => setError(null), []);

  return { mutate, mutateAsync, saving, error, reset };
}
