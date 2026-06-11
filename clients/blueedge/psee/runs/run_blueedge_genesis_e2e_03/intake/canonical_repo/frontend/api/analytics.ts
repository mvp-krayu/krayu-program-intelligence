import { api } from './client';
export const analyticsApi = {
  getFleetSummary() { return api.get('/analytics/fleet'); },
  getDriverAnalytics(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/analytics/drivers${q?'?'+q:''}`); },
  getFuelAnalytics(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/analytics/fuel${q?'?'+q:''}`); },
  getMaintenance() { return api.get('/analytics/maintenance'); },
  getSafety() { return api.get('/analytics/safety'); },
  getRevenue() { return api.get('/analytics/revenue'); },
  getCompliance() { return api.get('/analytics/compliance'); },
  getCustomDashboard(config: any) { return api.post('/analytics/custom', config); },
  nlQuery(query: string) { return api.post('/analytics/nl-query', { query }); },
};
