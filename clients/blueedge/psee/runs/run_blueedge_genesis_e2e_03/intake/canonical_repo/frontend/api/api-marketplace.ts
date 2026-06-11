// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Api Marketplace API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const apiMarketplaceApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/api-marketplace${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/api-marketplace/${id}`); },
  create(data: any) { return api.post('/api-marketplace', data); },
  update(id: string, data: any) { return api.put(`/api-marketplace/${id}`, data); },
  remove(id: string) { return api.delete(`/api-marketplace/${id}`); },
};
