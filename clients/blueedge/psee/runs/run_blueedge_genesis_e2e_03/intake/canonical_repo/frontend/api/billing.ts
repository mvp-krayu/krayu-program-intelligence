// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Billing API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const billingApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/billing${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/billing/${id}`); },
  create(data: any) { return api.post('/billing', data); },
  update(id: string, data: any) { return api.put(`/billing/${id}`, data); },
  remove(id: string) { return api.delete(`/billing/${id}`); },
};
