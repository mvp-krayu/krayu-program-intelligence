// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Onboarding API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const onboardingApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/onboarding${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/onboarding/${id}`); },
  create(data: any) { return api.post('/onboarding', data); },
  update(id: string, data: any) { return api.put(`/onboarding/${id}`, data); },
  remove(id: string) { return api.delete(`/onboarding/${id}`); },
};
