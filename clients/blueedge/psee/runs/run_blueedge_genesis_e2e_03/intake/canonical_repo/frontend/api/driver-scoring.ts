// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Driver Scoring API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const driverScoringApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/driver-scoring${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/driver-scoring/${id}`); },
  create(data: any) { return api.post('/driver-scoring', data); },
  update(id: string, data: any) { return api.put(`/driver-scoring/${id}`, data); },
  remove(id: string) { return api.delete(`/driver-scoring/${id}`); },
};
