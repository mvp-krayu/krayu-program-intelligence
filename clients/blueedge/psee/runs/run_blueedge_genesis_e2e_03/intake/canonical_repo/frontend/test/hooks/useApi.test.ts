import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

// We need to test the actual hook implementations, so let's mock fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, val: string) => { mockStorage[key] = val; }),
  removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
  clear: vi.fn(),
});

// Import after mocks are set up
import { useApi, useApiMutation, fetchApi } from '@/hooks/index';

describe('fetchApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStorage['be-token'] = 'test-jwt-token';
  });

  it('makes GET request with auth header', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [{ id: 1 }] }),
    });

    const result = await fetchApi('/vehicles');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/vehicles'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-jwt-token',
        }),
      })
    );
    expect(result.data).toEqual([{ id: 1 }]);
  });

  it('throws on non-OK response', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: () => Promise.resolve({ message: 'Vehicle not found' }),
    });

    await expect(fetchApi('/vehicles/nonexistent')).rejects.toThrow('Vehicle not found');
  });

  it('handles 401 by clearing token', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: () => Promise.resolve({ message: 'Token expired' }),
    });

    await expect(fetchApi('/vehicles')).rejects.toThrow();
    expect(localStorage.removeItem).toHaveBeenCalledWith('be-token');
  });

  it('makes request without auth when no token', async () => {
    delete mockStorage['be-token'];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    });

    await fetchApi('/public/health');
    const headers = mockFetch.mock.calls[0][1].headers;
    expect(headers.Authorization).toBeUndefined();
  });

  it('handles network errors', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    await expect(fetchApi('/vehicles')).rejects.toThrow('Network error');
  });
});

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches data on mount', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [{ id: 'v1', name: 'Tanker A' }] }),
    });

    const { result } = renderHook(() => useApi('/vehicles'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toEqual([{ id: 'v1', name: 'Tanker A' }]);
      expect(result.current.error).toBeNull();
    });
  });

  it('sets error on failure', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Server Error',
      json: () => Promise.resolve({ message: 'Internal server error' }),
    });

    const { result } = renderHook(() => useApi('/vehicles'));
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Internal server error');
      expect(result.current.data).toBeNull();
    });
  });

  it('refetch re-fetches data', async () => {
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: [{ id: 1 }] }) })
      .mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: [{ id: 1 }, { id: 2 }] }) });

    const { result } = renderHook(() => useApi('/vehicles'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toHaveLength(1);

    await act(async () => { await result.current.refetch(); });
    await waitFor(() => expect(result.current.data).toHaveLength(2));
  });
});

describe('useApiMutation', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('starts with saving=false', () => {
    const { result } = renderHook(() => useApiMutation());
    expect(result.current.saving).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('POST mutation succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { id: 'new-1' } }),
    });

    const { result } = renderHook(() => useApiMutation());

    let response: any;
    await act(async () => {
      response = await result.current.mutate('POST', '/vehicles', { name: 'New Tanker' });
    });

    expect(response.ok).toBe(true);
    expect(response.data).toEqual({ id: 'new-1' });
    expect(result.current.saving).toBe(false);
  });

  it('PUT mutation succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { id: 'v1', name: 'Updated' } }),
    });

    const { result } = renderHook(() => useApiMutation());
    let response: any;
    await act(async () => {
      response = await result.current.mutate('PUT', '/vehicles/v1', { name: 'Updated' });
    });
    expect(response.ok).toBe(true);
  });

  it('DELETE mutation succeeds', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: null }),
    });

    const { result } = renderHook(() => useApiMutation());
    let response: any;
    await act(async () => {
      response = await result.current.mutate('DELETE', '/vehicles/v1');
    });
    expect(response.ok).toBe(true);
  });

  it('handles mutation error', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: 'Unprocessable',
      json: () => Promise.resolve({ message: 'Validation failed' }),
    });

    const { result } = renderHook(() => useApiMutation());
    let response: any;
    await act(async () => {
      response = await result.current.mutate('POST', '/vehicles', { name: '' });
    });
    expect(response.ok).toBe(false);
    expect(response.error).toBe('Validation failed');
    expect(result.current.error).toBe('Validation failed');
  });
});
