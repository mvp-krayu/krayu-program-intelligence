// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Safety API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const safetyApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/safety${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/safety/${id}`); },
  create(data: any) { return api.post('/safety', data); },
  update(id: string, data: any) { return api.put(`/safety/${id}`, data); },
  remove(id: string) { return api.delete(`/safety/${id}`); },
  getDashboard() { return api.get('/safety/dashboard'); },
  getIncidents() { return api.get('/safety/incidents'); },
  getRisk() { return api.get('/safety/risk-assessment'); },
  getVideo() { return api.get('/safety/video-events'); },
  getDriverSafety(id: string) { return api.get(`/safety/drivers/${id}`); },
  createIncident(data: any) { return api.post('/safety/incidents', data); },
};
