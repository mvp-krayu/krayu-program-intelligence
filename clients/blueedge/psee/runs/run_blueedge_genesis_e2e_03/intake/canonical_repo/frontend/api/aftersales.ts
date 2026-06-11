// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Aftersales API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const aftersalesApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/aftersales${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/aftersales/${id}`); },
  create(data: any) { return api.post('/aftersales', data); },
  update(id: string, data: any) { return api.put(`/aftersales/${id}`, data); },
  remove(id: string) { return api.delete(`/aftersales/${id}`); },
};
