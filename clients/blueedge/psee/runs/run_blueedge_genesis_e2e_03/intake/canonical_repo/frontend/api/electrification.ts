import { api } from './client';
export const electrificationApi = {
  getDashboard() { return api.get('/electrification/dashboard'); },
  getTcoAnalysis(vehicleType: string) { return api.get(`/electrification/tco/${vehicleType}`); },
  getTimeline() { return api.get('/electrification/timeline'); },
  getRouteReadiness() { return api.get('/electrification/route-readiness'); },
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/electrification${q?'?'+q:''}`); },
  getById(id: string) { return api.get(`/electrification/${id}`); },
  create(data: any) { return api.post('/electrification', data); },
  update(id: string, data: any) { return api.put(`/electrification/${id}`, data); },
};
