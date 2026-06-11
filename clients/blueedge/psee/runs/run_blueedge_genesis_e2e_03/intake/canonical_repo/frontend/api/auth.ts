// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Auth API Service
// ══════════════════════════════════════════════════════════════

import { api, setTokens, clearTokens } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: string;
  orgId?: string;
  permissions?: string[];
}

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>('/auth/login', credentials);
    const { accessToken, refreshToken, user } = res.data;
    setTokens(accessToken, refreshToken);
    localStorage.setItem('be-user', JSON.stringify(user));
    return res.data;
  },

  async getProfile(): Promise<AuthUser> {
    const res = await api.get<AuthUser>('/auth/profile');
    return res.data;
  },

  async logout(): Promise<void> {
    try { await api.post('/auth/logout'); } catch { /* ignore */ }
    clearTokens();
  },
};
