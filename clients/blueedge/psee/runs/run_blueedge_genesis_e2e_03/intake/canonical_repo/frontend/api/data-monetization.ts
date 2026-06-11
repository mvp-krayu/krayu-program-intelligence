// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Data Monetization API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const dataMonetizationApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/data-monetization${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/data-monetization/${id}`); },
  create(data: any) { return api.post('/data-monetization', data); },
  update(id: string, data: any) { return api.put(`/data-monetization/${id}`, data); },
  remove(id: string) { return api.delete(`/data-monetization/${id}`); },
};
