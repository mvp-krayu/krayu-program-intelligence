// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Depot Charging API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const depotChargingApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/depot-charging${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/depot-charging/${id}`); },
  create(data: any) { return api.post('/depot-charging', data); },
  update(id: string, data: any) { return api.put(`/depot-charging/${id}`, data); },
  remove(id: string) { return api.delete(`/depot-charging/${id}`); },
};
