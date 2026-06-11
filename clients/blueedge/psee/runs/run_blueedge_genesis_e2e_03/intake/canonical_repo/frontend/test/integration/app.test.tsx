import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// Mock the router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: any) => children,
    Routes: ({ children }: any) => children,
    Route: () => null,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/' }),
  };
});

describe('Application Bootstrap', () => {
  it('index file exports correctly', async () => {
    // Verify the API index has all expected exports
    const apiIndex = await import('@/api/index');
    expect(apiIndex.vehiclesApi).toBeDefined();
    expect(apiIndex.driversApi).toBeDefined();
    expect(apiIndex.tripsApi).toBeDefined();
    expect(apiIndex.tankerApi).toBeDefined();
    expect(apiIndex.busApi).toBeDefined();
    expect(apiIndex.taxiApi).toBeDefined();
    expect(apiIndex.safetyApi).toBeDefined();
    expect(apiIndex.evApi).toBeDefined();
    expect(apiIndex.blockchainApi).toBeDefined();
    expect(apiIndex.financeApi).toBeDefined();
  });

  it('all API clients have standard methods', async () => {
    const apiIndex = await import('@/api/index');
    const clients = [
      apiIndex.vehiclesApi, apiIndex.driversApi, apiIndex.tripsApi,
      apiIndex.safetyApi, apiIndex.tankerApi, apiIndex.busApi,
      apiIndex.taxiApi, apiIndex.evApi, apiIndex.blockchainApi,
    ];
    for (const client of clients) {
      expect(typeof client.list).toBe('function');
      expect(typeof client.getById).toBe('function');
      expect(typeof client.create).toBe('function');
    }
  });
});
