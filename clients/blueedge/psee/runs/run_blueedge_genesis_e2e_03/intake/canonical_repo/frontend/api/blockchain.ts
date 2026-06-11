// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Blockchain API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const blockchainApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/blockchain${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/blockchain/${id}`); },
  create(data: any) { return api.post('/blockchain', data); },
  update(id: string, data: any) { return api.put(`/blockchain/${id}`, data); },
  remove(id: string) { return api.delete(`/blockchain/${id}`); },
};
