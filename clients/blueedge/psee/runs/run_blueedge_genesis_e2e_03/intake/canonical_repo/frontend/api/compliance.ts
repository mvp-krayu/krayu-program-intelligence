// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Compliance API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export const complianceApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/compliance${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/compliance/${id}`); },
  create(data: any) { return api.post('/compliance', data); },
  update(id: string, data: any) { return api.put(`/compliance/${id}`, data); },
  remove(id: string) { return api.delete(`/compliance/${id}`); },
  getHOS() { return api.get('/compliance/hos'); },
  getInspections() { return api.get('/compliance/inspections'); },
  getDocuments() { return api.get('/compliance/documents'); },
  getAudit() { return api.get('/compliance/audit-trail'); },
  getCerts() { return api.get('/compliance/certifications'); },
  getCrossBorder() { return api.get('/compliance/cross-border'); },
  createInspection(data: any) { return api.post('/compliance/inspections', data); },
  submitViolation(data: any) { return api.post('/compliance/violations', data); },
};
