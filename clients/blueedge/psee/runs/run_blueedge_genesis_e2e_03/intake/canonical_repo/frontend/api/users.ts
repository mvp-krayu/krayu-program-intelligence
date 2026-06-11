// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Users API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const usersApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/users${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/users/${id}`); },
  create(data: any) { return api.post('/users', data); },
  update(id: string, data: any) { return api.put(`/users/${id}`, data); },
  remove(id: string) { return api.delete(`/users/${id}`); },
};
