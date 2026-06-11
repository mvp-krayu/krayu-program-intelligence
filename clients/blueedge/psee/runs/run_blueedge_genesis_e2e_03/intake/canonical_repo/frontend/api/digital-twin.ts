// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Digital Twin API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const digitalTwinApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/digital-twin${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/digital-twin/${id}`); },
  create(data: any) { return api.post('/digital-twin', data); },
  update(id: string, data: any) { return api.put(`/digital-twin/${id}`, data); },
  remove(id: string) { return api.delete(`/digital-twin/${id}`); },
};
