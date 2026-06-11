// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Fleet Lifecycle API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const fleetLifecycleApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/fleet-lifecycle${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/fleet-lifecycle/${id}`); },
  create(data: any) { return api.post('/fleet-lifecycle', data); },
  update(id: string, data: any) { return api.put(`/fleet-lifecycle/${id}`, data); },
  remove(id: string) { return api.delete(`/fleet-lifecycle/${id}`); },
};
