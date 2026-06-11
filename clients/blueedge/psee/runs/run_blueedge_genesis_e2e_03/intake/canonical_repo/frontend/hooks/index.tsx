import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { API_BASE_URL, API_VERSION } from '@/constants';
import type { ApiResponse, CrudMode, SavedView } from '@/types';

// ── fetchApi utility ─────────────────────────────────────────
export async function fetchApi<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('be-token');
  let url: string;
  if (endpoint.startsWith('http')) {
    url = endpoint;
  } else if (endpoint.startsWith('/api/')) {
    // Endpoint already has /api/ prefix — just prepend base URL
    url = `${API_BASE_URL}${endpoint}`;
  } else {
    // Relative endpoint — add base + version prefix
    url = `${API_BASE_URL}/${API_VERSION}${endpoint}`;
  }
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  if (res.status === 401) {
    // Token expired — clear and redirect to login
    localStorage.removeItem('be-token');
    localStorage.removeItem('be-user');
    window.dispatchEvent(new Event('auth:expired'));
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `API error ${res.status}`);
  }
  return res.json();
}

// ── useApi — GET with loading/error ──────────────────────────
export function useApi<T = any>(endpoint: string, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchApi<T>(endpoint);
      setData(res.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, ...deps]);

  useEffect(() => { fetch_(); }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}

// ── useApiMutation — POST/PUT/DELETE ─────────────────────────
export function useApiMutation<T = any>() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (method: string = 'POST', endpoint: string, body?: any) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetchApi<T>(endpoint, { method, body: body ? JSON.stringify(body) : undefined });
      return { ok: true, data: res.data };
    } catch (err: any) {
      setError(err.message);
      return { ok: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, []);

  return { mutate, saving, loading: saving, error };
}

// ── useToast ─────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: string }>>([]);

  const show = useCallback((message: string, type: string = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Toast display component used as <toast.Toast />
  const Toast = useCallback(() => {
    if (toasts.length === 0) return null;
    return (
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}
            style={{ padding: '12px 20px', borderRadius: 8, color: '#fff', fontSize: 14, minWidth: 280, boxShadow: '0 4px 12px rgba(0,0,0,0.3)', cursor: 'pointer',
              background: t.type === 'success' ? '#22c55e' : t.type === 'error' ? '#ef4444' : t.type === 'warning' ? '#f59e0b' : '#3b82f6' }}
            onClick={() => dismiss(t.id)}>
            {t.message}
          </div>
        ))}
      </div>
    );
  }, [toasts, dismiss]);

  return { toasts, show, dismiss, Toast };
}

// ── usePagination ────────────────────────────────────────────
export function usePagination<T>(items: T[], perPage: number = 15) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil((items?.length || 0) / perPage);
  const paginatedRows = useMemo(() => {
    if (!items) return [];
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page, perPage]);

  useEffect(() => { if (page > totalPages && totalPages > 0) setPage(totalPages); }, [totalPages]);

  return { page, setPage, totalPages, paginatedRows, total: items?.length || 0 };
}

// ── useCrud — full CRUD lifecycle ────────────────────────────
export function useCrud<T extends Record<string, any>>(endpoint: string, defaultForm: T) {
  const list = useApi<T[]>(endpoint);
  const toast = useToast();
  const [mode, setMode] = useState<CrudMode>(null);
  const [form, setForm] = useState<T>(defaultForm);
  const [selected, setSelected] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<T | null>(null);
  const [attachments, setAttachments] = useState<any[]>([]);

  const rows = useMemo(() => list.data || [], [list.data]);
  const set = (key: keyof T) => (value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const resetForm = () => setForm(defaultForm);

  const openCreate = () => { resetForm(); setAttachments([]); setMode('create'); };
  const openEdit = (row: T) => { setForm({ ...row }); setAttachments((row as any)._attachments || []); setSelected(row); setMode('edit'); };
  const openView = (row: T) => { setSelected(row); setMode('view'); };
  const close = () => { setMode(null); setSelected(null); setAttachments([]); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const url = mode === 'edit' ? `${endpoint}/${(form as any).id}` : endpoint;
      await fetchApi(url, { method, body: JSON.stringify(form) });
      toast.show(`Record ${mode === 'edit' ? 'updated' : 'created'}`, 'success');
      close();
      list.refetch();
    } catch (err: any) {
      toast.show(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await fetchApi(`${endpoint}/${(confirmDelete as any).id}`, { method: 'DELETE' });
      toast.show('Record deleted', 'success');
      setConfirmDelete(null);
      list.refetch();
    } catch (err: any) {
      toast.show(err.message, 'error');
    }
  };

  const handleBulkExport = (selectedRows: T[]) => {
    if (!selectedRows?.length) return;
    const keys = Object.keys(selectedRows[0]).filter(k => !['__v', 'createdAt', 'updatedAt'].includes(k));
    const bom = '\uFEFF';
    const csv = bom + keys.join(',') + '\n' + selectedRows.map(r =>
      keys.map(k => {
        const v = r[k] == null ? '' : String(r[k]);
        return v.includes(',') || v.includes('"') || v.includes('\n') ? `"${v.replace(/"/g, '""')}"` : v;
      }).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `export-${selectedRows.length}-records.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast.show(`Exported ${selectedRows.length} records to CSV`, 'success');
  };

  const handleBulkDelete = async (selectedRows: T[]) => {
    if (!selectedRows?.length) return;
    if (!confirm(`Delete ${selectedRows.length} records? This cannot be undone.`)) return;
    let deleted = 0;
    for (const row of selectedRows) {
      try {
        await fetchApi(`${endpoint}/${(row as any).id}`, { method: 'DELETE' });
        deleted++;
      } catch { /* skip */ }
    }
    toast.show(`${deleted} of ${selectedRows.length} records deleted`, deleted > 0 ? 'success' : 'error');
    list.refetch();
  };

  return {
    rows, loading: list.loading, refetch: list.refetch, toast,
    mode, form, set, selected, saving,
    openCreate, openEdit, openView, close, handleSave,
    confirmDelete, setConfirmDelete, handleDelete,
    handleBulkDelete, handleBulkExport,
    attachments, setAttachments,
  };
}

// ── useAnimatedValue ─────────────────────────────────────────
export function useAnimatedValue(target: number, duration: number = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = value;
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [target]);
  return value;
}

// ── useWebSocket (re-exported from socket module) ────────────
export { useSocketContext as useWebSocket } from '@/socket';
export { useFleetPositions, useVehicleTelemetry, useAlertStream, useActivityFeed, useSocketEvent, useVehicleCommand } from '@/socket';

// ── useFavorites ─────────────────────────────────────────────
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('be-favorites') || '[]'); } catch { return []; }
  });

  const toggle = useCallback((pageId: string) => {
    setFavorites(prev => {
      const next = prev.includes(pageId) ? prev.filter(f => f !== pageId) : [...prev, pageId];
      try { localStorage.setItem('be-favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const isFav = useCallback((pageId: string) => favorites.includes(pageId), [favorites]);

  return { favorites, toggle, isFav };
}

// ── useDraggableCards ────────────────────────────────────────
export function useDraggableCards(initialOrder: string[]) {
  const [order, setOrder] = useState<string[]>(() => {
    try { const s = localStorage.getItem('be-widget-order'); return s ? JSON.parse(s) : initialOrder; } catch { return initialOrder; }
  });
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const onDragStart = (idx: number) => setDragIdx(idx);
  const onDragOver = (idx: number, e: React.DragEvent) => { e.preventDefault(); setOverIdx(idx); };
  const onDragEnd = () => {
    if (dragIdx !== null && overIdx !== null && dragIdx !== overIdx) {
      const next = [...order];
      const [moved] = next.splice(dragIdx, 1);
      next.splice(overIdx, 0, moved);
      setOrder(next);
      try { localStorage.setItem('be-widget-order', JSON.stringify(next)); } catch {}
    }
    setDragIdx(null); setOverIdx(null);
  };
  const resetOrder = () => { setOrder(initialOrder); localStorage.removeItem('be-widget-order'); };

  return { order, dragIdx, overIdx, onDragStart, onDragOver, onDragEnd, resetOrder };
}

// ── useSessionTimeout ────────────────────────────────────────
export function useSessionTimeout(timeoutMs: number = 900000, warningMs: number = 120000) {
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const warningRef = useRef<ReturnType<typeof setTimeout>>();

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    clearTimeout(timerRef.current);
    clearTimeout(warningRef.current);
    warningRef.current = setTimeout(() => {
      setShowWarning(true);
      setCountdown(Math.floor(warningMs / 1000));
    }, timeoutMs - warningMs);
    timerRef.current = setTimeout(() => {
      // Auto-logout
      localStorage.removeItem('be-token');
      window.location.reload();
    }, timeoutMs);
  }, [timeoutMs, warningMs]);

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearTimeout(timerRef.current);
      clearTimeout(warningRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    if (!showWarning || countdown <= 0) return;
    const iv = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(iv);
  }, [showWarning, countdown]);

  return { showWarning, countdown, stayActive: resetTimer };
}

// ── useSavedViews ────────────────────────────────────────────
export function useSavedViews(tableId: string) {
  const key = `be-views-${tableId}`;
  const [views, setViews] = useState<SavedView[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });

  const save = (view: SavedView) => {
    const updated = [...views, view];
    setViews(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  const remove = (name: string) => {
    const updated = views.filter(v => v.name !== name);
    setViews(updated);
    localStorage.setItem(key, JSON.stringify(updated));
  };

  return { views, save, remove };
}

// ── Context-based hooks ──────────────────────────────────────
import { useContext } from 'react';

// Auth — re-export from real context
export { useAuth } from '@/contexts/AuthContext';

// I18n — re-export from real context
export { useI18n } from '@/contexts/I18nContext';

// Theme
export function useTheme() {
  const [theme, setTheme] = useState<string>(() => {
    try { return localStorage.getItem('be-theme') || 'dark'; } catch { return 'dark'; }
  });
  const toggle = useCallback(() => {
    setTheme(prev => { const next = prev === 'dark' ? 'light' : 'dark'; localStorage.setItem('be-theme', next); return next; });
  }, []);
  return { theme, toggle, isDark: theme === 'dark' };
}

// Preferences
const PrefsContext = (globalThis as any).__PrefsContext || { Provider: ({ children }: any) => children };
export function usePrefs() { return useContext(PrefsContext) as any; }
export function usePreferences() { return usePrefs(); }

// Swipe gesture
export function useSwipeGesture(onSwipeRight?: () => void, onSwipeLeft?: () => void) {
  const ref = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onStart = (e: TouchEvent) => { ref.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onEnd = (e: TouchEvent) => {
      if (!ref.current) return;
      const dx = e.changedTouches[0].clientX - ref.current.x;
      const dy = e.changedTouches[0].clientY - ref.current.y;
      if (Math.abs(dx) > 80 && Math.abs(dy) < 50) {
        if (dx > 0 && onSwipeRight) onSwipeRight();
        if (dx < 0 && onSwipeLeft) onSwipeLeft();
      }
      ref.current = null;
    };
    window.addEventListener('touchstart', onStart);
    window.addEventListener('touchend', onEnd);
    return () => { window.removeEventListener('touchstart', onStart); window.removeEventListener('touchend', onEnd); };
  }, [onSwipeRight, onSwipeLeft]);
}

// ── useMediaQuery — responsive breakpoint detection ──────────
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' ? window.matchMedia(query).matches : false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener('change', handler);
    setMatches(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

// ── useScrollPosition — track scroll for scroll-to-top, sticky headers ──
export function useScrollPosition(threshold: number = 300) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const handler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          setScrolled(window.scrollY > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [threshold]);
  return { scrolled, scrollY };
}

// ── useLongPress — for mobile context menus ──────────────────
export function useLongPress(callback: () => void, ms: number = 500) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onStart = useCallback(() => {
    timerRef.current = setTimeout(callback, ms);
  }, [callback, ms]);
  const onEnd = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  return { onTouchStart: onStart, onTouchEnd: onEnd, onTouchMove: onEnd };
}

// ── useReducedMotion — respect user's motion preference ──────
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

// ── New Performance & Utility Hooks (Session 28) ─────────────
export { usePerformance, useRenderTime } from './usePerformance';
export { useVirtualScroll } from './useVirtualScroll';
export { useDebounce, useDebouncedCallback } from './useDebounce';
export { useIntersectionObserver } from './useIntersectionObserver';

// ── API Query Hooks (Session 29 — API Integration) ──────────
export { useApiQuery, useApiMutation as useApiMut } from './useApiQuery';
