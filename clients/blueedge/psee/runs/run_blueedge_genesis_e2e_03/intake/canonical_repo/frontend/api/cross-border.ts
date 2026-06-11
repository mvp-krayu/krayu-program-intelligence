import { api } from './client';
export const crossBorderApi = {
  getRegulations(country: string) { return api.get(`/cross-border/regulations/${country}`); },
  getComplianceMatrix() { return api.get('/cross-border/compliance-matrix'); },
  getRoutePlanning(origin: string, destination: string) { return api.get(`/cross-border/route-planning?origin=${origin}&destination=${destination}`); },
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/cross-border${q?'?'+q:''}`); },
  getById(id: string) { return api.get(`/cross-border/${id}`); },
  create(data: any) { return api.post('/cross-border', data); },
  update(id: string, data: any) { return api.put(`/cross-border/${id}`, data); },
};
