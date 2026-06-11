// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Predictive Maintenance API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const predictiveMaintenanceApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/predictive-maintenance${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/predictive-maintenance/${id}`); },
  create(data: any) { return api.post('/predictive-maintenance', data); },
  update(id: string, data: any) { return api.put(`/predictive-maintenance/${id}`, data); },
  remove(id: string) { return api.delete(`/predictive-maintenance/${id}`); },
};
