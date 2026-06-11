// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Integration Notifications API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const integrationNotificationsApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/integration-notifications${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/integration-notifications/${id}`); },
  create(data: any) { return api.post('/integration-notifications', data); },
  update(id: string, data: any) { return api.put(`/integration-notifications/${id}`, data); },
  remove(id: string) { return api.delete(`/integration-notifications/${id}`); },
};
