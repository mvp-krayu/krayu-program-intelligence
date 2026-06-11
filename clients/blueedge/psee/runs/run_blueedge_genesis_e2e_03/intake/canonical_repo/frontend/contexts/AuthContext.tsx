// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Auth Context (API-integrated)
// JWT lifecycle: login → store → refresh → 401 redirect → logout
// ══════════════════════════════════════════════════════════════

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { authApi } from '@/api/auth';
import { setOnUnauthorized, clearTokens, getAccessToken } from '@/api/client';
import type { AuthUser } from '@/api/auth';
import type { UserRole } from '@/types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  userRole: UserRole;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
  });
  const logoutRef = useRef<() => void>(() => {});

  // ── Logout ──────────────────────────────────────────────
  const logout = useCallback(() => {
    authApi.logout();
    setState({ user: null, isAuthenticated: false, loading: false });
  }, []);

  logoutRef.current = logout;

  // Register 401 handler with API client
  useEffect(() => {
    setOnUnauthorized(() => logoutRef.current());
  }, []);

  // ── Restore session on mount ────────────────────────────
  useEffect(() => {
    const token = getAccessToken();
    const savedUser = localStorage.getItem('be-user');

    if (!token) {
      setState({ user: null, isAuthenticated: false, loading: false });
      return;
    }

    // Quick restore from localStorage, then verify via API
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setState({ user, isAuthenticated: true, loading: false });
      } catch {
        setState({ user: null, isAuthenticated: false, loading: false });
      }
    }

    // Verify token is still valid by hitting /auth/profile
    authApi.getProfile()
      .then(user => {
        localStorage.setItem('be-user', JSON.stringify(user));
        setState({ user, isAuthenticated: true, loading: false });
      })
      .catch(() => {
        // Token expired and refresh also failed → logout
        clearTokens();
        setState({ user: null, isAuthenticated: false, loading: false });
      });
  }, []);

  // ── Login ───────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { user } = await authApi.login({ email, password });
      setState({ user, isAuthenticated: true, loading: false });
      return { ok: true };
    } catch (err: any) {
      return { ok: false, error: err.message || 'Invalid credentials' };
    }
  }, []);

  // ── Refresh profile ─────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    try {
      const user = await authApi.getProfile();
      localStorage.setItem('be-user', JSON.stringify(user));
      setState(prev => ({ ...prev, user }));
    } catch { /* ignore - will be caught by 401 handler */ }
  }, []);

  const userRole = (state.user?.role || 'viewer') as UserRole;

  return (
    <AuthContext.Provider value={{ ...state, login, logout, userRole, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
