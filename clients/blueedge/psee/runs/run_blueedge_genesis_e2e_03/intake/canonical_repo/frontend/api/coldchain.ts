// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Coldchain API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const coldchainApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/coldchain${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/coldchain/${id}`); },
  create(data: any) { return api.post('/coldchain', data); },
  update(id: string, data: any) { return api.put(`/coldchain/${id}`, data); },
  remove(id: string) { return api.delete(`/coldchain/${id}`); },
  getDashboard() { return api.get('/coldchain/dashboard'); },
  getBreaches() { return api.get('/coldchain/breaches'); },
  getCompliance() { return api.get('/coldchain/compliance'); },
  getSensorHealth() { return api.get('/coldchain/sensors'); },
  getTempHistory(id: string) { return api.get(`/coldchain/${id}/temperature`); },
  setThreshold(data: any) { return api.post('/coldchain/thresholds', data); },
};
