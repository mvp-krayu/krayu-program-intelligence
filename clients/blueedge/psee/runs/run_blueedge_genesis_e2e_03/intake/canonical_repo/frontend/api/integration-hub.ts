// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Integration Hub API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const integrationHubApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/integration-hub${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/integration-hub/${id}`); },
  create(data: any) { return api.post('/integration-hub', data); },
  update(id: string, data: any) { return api.put(`/integration-hub/${id}`, data); },
  remove(id: string) { return api.delete(`/integration-hub/${id}`); },
};
