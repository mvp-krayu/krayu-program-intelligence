// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Road Intelligence API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const roadIntelligenceApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/road-intelligence${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/road-intelligence/${id}`); },
  create(data: any) { return api.post('/road-intelligence', data); },
  update(id: string, data: any) { return api.put(`/road-intelligence/${id}`, data); },
  remove(id: string) { return api.delete(`/road-intelligence/${id}`); },
};
