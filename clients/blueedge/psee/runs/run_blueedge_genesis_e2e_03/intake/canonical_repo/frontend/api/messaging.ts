// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Messaging API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const messagingApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/messaging${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/messaging/${id}`); },
  create(data: any) { return api.post('/messaging', data); },
  update(id: string, data: any) { return api.put(`/messaging/${id}`, data); },
  remove(id: string) { return api.delete(`/messaging/${id}`); },
};
