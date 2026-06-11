import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';

// Mock auth API before importing context
const mockLogin = vi.fn();
const mockLogout = vi.fn();
const mockGetProfile = vi.fn();

vi.mock('@/api/auth', () => ({
  authApi: {
    login: (...args: any[]) => mockLogin(...args),
    logout: (...args: any[]) => mockLogout(...args),
    getProfile: (...args: any[]) => mockGetProfile(...args),
  },
}));

vi.mock('@/api/client', () => ({
  setOnUnauthorized: vi.fn(),
  clearTokens: vi.fn(),
  getAccessToken: vi.fn(() => null),
}));

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { getAccessToken } from '@/api/client';

const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key: string) => mockStorage[key] || null),
  setItem: vi.fn((key: string, val: string) => { mockStorage[key] = val; }),
  removeItem: vi.fn((key: string) => { delete mockStorage[key]; }),
  clear: vi.fn(),
});

function TestConsumer() {
  const { user, isAuthenticated, loading, userRole, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="auth">{String(isAuthenticated)}</span>
      <span data-testid="role">{userRole}</span>
      <span data-testid="user">{user?.email || 'none'}</span>
      <button data-testid="login" onClick={() => login('admin@blueedge.ae', 'admin123')}>Login</button>
      <button data-testid="logout" onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
    vi.clearAllMocks();
    vi.mocked(getAccessToken).mockReturnValue(null);
  });

  it('starts unauthenticated when no token', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('false');
      expect(screen.getByTestId('user').textContent).toBe('none');
      expect(screen.getByTestId('role').textContent).toBe('viewer');
    });
  });

  it('login calls authApi and sets user', async () => {
    const mockUser = { id: '1', email: 'admin@blueedge.ae', role: 'admin', firstName: 'Borhane' };
    mockLogin.mockResolvedValueOnce({ user: mockUser });

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await act(async () => {
      fireEvent.click(screen.getByTestId('login'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('true');
      expect(screen.getByTestId('user').textContent).toBe('admin@blueedge.ae');
      expect(screen.getByTestId('role').textContent).toBe('admin');
    });
    expect(mockLogin).toHaveBeenCalledWith({ email: 'admin@blueedge.ae', password: 'admin123' });
  });

  it('login handles invalid credentials', async () => {
    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await act(async () => {
      fireEvent.click(screen.getByTestId('login'));
    });

    expect(screen.getByTestId('auth').textContent).toBe('false');
  });

  it('logout clears user state', async () => {
    const mockUser = { id: '1', email: 'admin@blueedge.ae', role: 'admin' };
    mockLogin.mockResolvedValueOnce({ user: mockUser });

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await act(async () => { fireEvent.click(screen.getByTestId('login')); });
    await waitFor(() => expect(screen.getByTestId('auth').textContent).toBe('true'));

    await act(async () => { fireEvent.click(screen.getByTestId('logout')); });
    expect(screen.getByTestId('auth').textContent).toBe('false');
    expect(screen.getByTestId('user').textContent).toBe('none');
    expect(mockLogout).toHaveBeenCalled();
  });

  it('restores session from localStorage when token exists', async () => {
    vi.mocked(getAccessToken).mockReturnValue('valid-jwt-token');
    mockStorage['be-user'] = JSON.stringify({ id: '1', email: 'admin@blueedge.ae', role: 'manager' });
    mockGetProfile.mockResolvedValueOnce({ id: '1', email: 'admin@blueedge.ae', role: 'manager' });

    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('auth').textContent).toBe('true');
      expect(screen.getByTestId('role').textContent).toBe('manager');
    });
  });

  it('defaults role to viewer when no user', async () => {
    render(<AuthProvider><TestConsumer /></AuthProvider>);
    await waitFor(() => {
      expect(screen.getByTestId('role').textContent).toBe('viewer');
    });
  });

  it('throws if useAuth used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow('useAuth must be used within AuthProvider');
    spy.mockRestore();
  });
});
