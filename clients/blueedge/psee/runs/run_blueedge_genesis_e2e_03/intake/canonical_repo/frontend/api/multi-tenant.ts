// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Multi Tenant API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const multiTenantApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/multi-tenant${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/multi-tenant/${id}`); },
  create(data: any) { return api.post('/multi-tenant', data); },
  update(id: string, data: any) { return api.put(`/multi-tenant/${id}`, data); },
  remove(id: string) { return api.delete(`/multi-tenant/${id}`); },
};
