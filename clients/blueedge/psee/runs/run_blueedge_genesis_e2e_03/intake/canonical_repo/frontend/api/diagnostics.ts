// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Diagnostics API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const diagnosticsApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/diagnostics${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/diagnostics/${id}`); },
  create(data: any) { return api.post('/diagnostics', data); },
  update(id: string, data: any) { return api.put(`/diagnostics/${id}`, data); },
  remove(id: string) { return api.delete(`/diagnostics/${id}`); },
  getFleetHealth() { return api.get('/diagnostics/fleet-health'); },
  getVehicleHealth(id: string) { return api.get(`/diagnostics/vehicle/${id}`); },
  getDTCs(id: string) { return api.get(`/diagnostics/vehicle/${id}/dtcs`); },
  getRUL(id: string) { return api.get(`/diagnostics/vehicle/${id}/rul`); },
};
