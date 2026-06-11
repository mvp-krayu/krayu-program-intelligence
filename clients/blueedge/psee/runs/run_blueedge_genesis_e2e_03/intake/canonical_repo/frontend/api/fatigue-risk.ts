// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Fatigue Risk API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const fatigueRiskApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/fatigue-risk${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/fatigue-risk/${id}`); },
  create(data: any) { return api.post('/fatigue-risk', data); },
  update(id: string, data: any) { return api.put(`/fatigue-risk/${id}`, data); },
  remove(id: string) { return api.delete(`/fatigue-risk/${id}`); },
};
