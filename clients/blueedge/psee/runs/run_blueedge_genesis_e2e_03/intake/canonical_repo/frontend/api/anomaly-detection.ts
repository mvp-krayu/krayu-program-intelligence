import { api } from './client';
export const anomalyApi = {
  getDashboard() { return api.get('/anomaly-detection/dashboard'); },
  getActive() { return api.get('/anomaly-detection/active'); },
  getPatterns() { return api.get('/anomaly-detection/patterns'); },
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/anomaly-detection${q?'?'+q:''}`); },
  getById(id: string) { return api.get(`/anomaly-detection/${id}`); },
  investigate(id: string, userId: string) { return api.patch(`/anomaly-detection/${id}/investigate`, { userId }); },
  resolve(id: string, notes: string) { return api.patch(`/anomaly-detection/${id}/resolve`, { notes }); },
  markFalsePositive(id: string) { return api.patch(`/anomaly-detection/${id}/false-positive`); },
  getCorrelations() { return api.get('/anomaly-detection/correlations/fleet'); },
  getRootCause(id: string) { return api.get(`/anomaly-detection/${id}/root-cause`); },
};
