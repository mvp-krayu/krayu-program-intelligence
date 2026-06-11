// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Geofence Automation API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const geofenceAutomationApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/geofence-automation${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/geofence-automation/${id}`); },
  create(data: any) { return api.post('/geofence-automation', data); },
  update(id: string, data: any) { return api.put(`/geofence-automation/${id}`, data); },
  remove(id: string) { return api.delete(`/geofence-automation/${id}`); },
};
