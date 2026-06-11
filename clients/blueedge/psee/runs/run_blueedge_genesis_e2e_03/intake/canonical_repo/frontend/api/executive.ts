// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Executive API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const executiveApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/executive${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/executive/${id}`); },
  create(data: any) { return api.post('/executive', data); },
  update(id: string, data: any) { return api.put(`/executive/${id}`, data); },
  remove(id: string) { return api.delete(`/executive/${id}`); },
};
