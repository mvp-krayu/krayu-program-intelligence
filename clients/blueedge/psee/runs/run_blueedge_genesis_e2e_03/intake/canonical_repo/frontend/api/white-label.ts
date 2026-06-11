import { api } from './client';
export const whiteLabelApi = {
  getTenantTheme(tenantId: string) { return api.get(`/white-label/themes/${tenantId}`); },
  listTenants() { return api.get('/white-label/tenants'); },
  getOptions() { return api.get('/white-label/options'); },
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/white-label${q?'?'+q:''}`); },
  getById(id: string) { return api.get(`/white-label/${id}`); },
  create(data: any) { return api.post('/white-label', data); },
  update(id: string, data: any) { return api.put(`/white-label/${id}`, data); },
  remove(id: string) { return api.delete(`/white-label/${id}`); },
};
