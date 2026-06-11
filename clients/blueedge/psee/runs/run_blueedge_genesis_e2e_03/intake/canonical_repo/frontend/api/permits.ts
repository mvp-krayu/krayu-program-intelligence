import { api } from './client';
export const permitsApi = {
  getDashboard() { return api.get('/permits/dashboard'); },
  getExpiring(days = 30) { return api.get(`/permits/expiring?days=${days}`); },
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/permits${q?'?'+q:''}`); },
  getById(id: string) { return api.get(`/permits/${id}`); },
  create(data: any) { return api.post('/permits', data); },
  update(id: string, data: any) { return api.put(`/permits/${id}`, data); },
  requestRenewal(id: string) { return api.post(`/permits/${id}/renew`); },
  remove(id: string) { return api.delete(`/permits/${id}`); },
};
