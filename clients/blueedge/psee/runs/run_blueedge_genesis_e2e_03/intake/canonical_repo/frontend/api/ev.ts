// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Ev API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const evApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/ev${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/ev/${id}`); },
  create(data: any) { return api.post('/ev', data); },
  update(id: string, data: any) { return api.put(`/ev/${id}`, data); },
  remove(id: string) { return api.delete(`/ev/${id}`); },
  getDashboard() { return api.get('/ev/dashboard'); },
  getSessions() { return api.get('/ev/charging/sessions'); },
  getSchedule() { return api.get('/ev/charging/schedule'); },
  getEnergyAnalytics() { return api.get('/ev/analytics/energy'); },
  getBattery(id: string) { return api.get(`/ev/${id}/battery`); },
  getRange(id: string) { return api.get(`/ev/${id}/range`); },
  startCharging(id: string, data: any = {}) { return api.post(`/ev/${id}/charging/start`, data); },
  stopCharging(id: string, data: any = {}) { return api.post(`/ev/${id}/charging/stop`, data); },
};
