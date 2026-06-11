// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Erp Connectors API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const erpConnectorsApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/erp-connectors${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/erp-connectors/${id}`); },
  create(data: any) { return api.post('/erp-connectors', data); },
  update(id: string, data: any) { return api.put(`/erp-connectors/${id}`, data); },
  remove(id: string) { return api.delete(`/erp-connectors/${id}`); },
};
