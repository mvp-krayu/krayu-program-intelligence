// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — API Client
// Core HTTP client with JWT lifecycle, token refresh, 401 redirect
// ══════════════════════════════════════════════════════════════

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const API_PREFIX = '/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// ── Token management ─────────────────────────────────────────
let accessToken: string | null = localStorage.getItem('be-token');
let refreshToken: string | null = localStorage.getItem('be-refresh-token');
let refreshPromise: Promise<string | null> | null = null;
let onUnauthorized: (() => void) | null = null;

export function setTokens(access: string, refresh: string) {
  accessToken = access;
  refreshToken = refresh;
  localStorage.setItem('be-token', access);
  localStorage.setItem('be-refresh-token', refresh);
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('be-token');
  localStorage.removeItem('be-refresh-token');
  localStorage.removeItem('be-user');
}

export function getAccessToken() { return accessToken; }

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

// ── Token refresh ────────────────────────────────────────────
async function doRefresh(): Promise<string | null> {
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${API_BASE}${API_PREFIX}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) throw new Error('Refresh failed');
    const json = await res.json();
    const newToken = json.data?.accessToken;
    if (newToken) {
      accessToken = newToken;
      localStorage.setItem('be-token', newToken);
      return newToken;
    }
    return null;
  } catch {
    clearTokens();
    onUnauthorized?.();
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  // Deduplicate concurrent refresh calls
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

// ── Rate limit & retry config ────────────────────────────────
const MAX_RETRIES = 3;
const RETRY_BASE_MS = 1000;
const RETRY_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

type RateLimitCallback = (retryAfterMs: number) => void;
let onRateLimit: RateLimitCallback | null = null;

export function setOnRateLimit(cb: RateLimitCallback) { onRateLimit = cb; }

// ── Offline mutation queue (IndexedDB-backed) ────────────────
interface QueuedMutation {
  id: string;
  endpoint: string;
  options: RequestInit;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'be-offline-queue';

function getOfflineQueue(): QueuedMutation[] {
  try { return JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]'); } catch { return []; }
}

function saveOfflineQueue(queue: QueuedMutation[]) {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
}

export function queueOfflineMutation(endpoint: string, options: RequestInit) {
  const queue = getOfflineQueue();
  queue.push({ id: crypto.randomUUID?.() || `${Date.now()}`, endpoint, options, timestamp: Date.now() });
  saveOfflineQueue(queue);
}

export async function flushOfflineQueue(): Promise<{ success: number; failed: number }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { success: 0, failed: 0 };
  let success = 0, failed = 0;
  const remaining: QueuedMutation[] = [];
  for (const item of queue) {
    try {
      await apiRequest(item.endpoint, item.options, true, 0);
      success++;
    } catch {
      // Keep items less than 24h old for retry
      if (Date.now() - item.timestamp < 86400000) remaining.push(item);
      else failed++;
    }
  }
  saveOfflineQueue(remaining);
  return { success, failed };
}

export function getOfflineQueueSize(): number { return getOfflineQueue().length; }

// ── Core request function ────────────────────────────────────
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
  attempt = 0,
): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${API_PREFIX}${endpoint}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // ── Offline detection — queue mutations for later ──────────
  if (!navigator.onLine && options.method && options.method !== 'GET') {
    queueOfflineMutation(endpoint, options);
    throw createApiError(0, 'Offline — request queued for sync', 'OFFLINE_QUEUED');
  }

  let res: Response;
  try {
    res = await fetch(url, { ...options, headers });
  } catch (networkErr: any) {
    // Network error — retry or queue
    if (attempt < MAX_RETRIES) {
      const delay = RETRY_BASE_MS * Math.pow(2, attempt) + Math.random() * 500;
      await new Promise(r => setTimeout(r, delay));
      return apiRequest<T>(endpoint, options, retry, attempt + 1);
    }
    if (options.method && options.method !== 'GET') {
      queueOfflineMutation(endpoint, options);
    }
    throw createApiError(0, networkErr.message || 'Network error', 'NETWORK_ERROR');
  }

  // ── 401 → try refresh once ────────────────────────────────
  if (res.status === 401 && retry && refreshToken) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return apiRequest<T>(endpoint, options, false, 0);
    }
    clearTokens();
    onUnauthorized?.();
    throw createApiError(401, 'Session expired — please log in again');
  }

  // ── 429 Rate Limited — exponential backoff with Retry-After ──
  if (res.status === 429) {
    const retryAfter = parseInt(res.headers.get('Retry-After') || '5', 10);
    const delayMs = retryAfter * 1000;
    onRateLimit?.(delayMs);
    if (attempt < MAX_RETRIES) {
      await new Promise(r => setTimeout(r, delayMs));
      return apiRequest<T>(endpoint, options, retry, attempt + 1);
    }
    throw createApiError(429, `Rate limited — try again in ${retryAfter}s`, 'RATE_LIMITED');
  }

  // ── 5xx Server Errors — retry with backoff ────────────────
  if (RETRY_STATUSES.has(res.status) && attempt < MAX_RETRIES) {
    const delay = RETRY_BASE_MS * Math.pow(2, attempt) + Math.random() * 500;
    await new Promise(r => setTimeout(r, delay));
    return apiRequest<T>(endpoint, options, retry, attempt + 1);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw createApiError(res.status, body.message || res.statusText, body.code);
  }

  // 204 No Content
  if (res.status === 204) return {} as T;

  return res.json();
}

function createApiError(status: number, message: string, code?: string): ApiError {
  const err = new Error(message) as any;
  err.status = status;
  err.code = code;
  return err;
}

// ── Convenience methods ──────────────────────────────────────
export const api = {
  get: <T = any>(endpoint: string) =>
    apiRequest<ApiResponse<T>>(endpoint),

  post: <T = any>(endpoint: string, body?: any) =>
    apiRequest<ApiResponse<T>>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any) =>
    apiRequest<ApiResponse<T>>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(endpoint: string, body?: any) =>
    apiRequest<ApiResponse<T>>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string) =>
    apiRequest<ApiResponse<T>>(endpoint, { method: 'DELETE' }),

  paginated: <T = any>(endpoint: string) =>
    apiRequest<PaginatedResponse<T>>(endpoint),
};
