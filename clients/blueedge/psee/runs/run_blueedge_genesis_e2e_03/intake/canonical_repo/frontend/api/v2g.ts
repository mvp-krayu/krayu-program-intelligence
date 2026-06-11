import { api } from './client';
export const v2gApi = {
  getDashboard() { return api.get('/v2g/dashboard'); },
  listContracts(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/v2g/contracts${q?'?'+q:''}`); },
  getLiveSessions() { return api.get('/v2g/sessions/live'); },
  getEnergyTrading() { return api.get('/v2g/energy-trading'); },
  getGridSignals() { return api.get('/v2g/grid-signals'); },
  getSchedule() { return api.get('/v2g/schedule'); },
  createContract(data: any) { return api.post('/v2g/contracts', data); },
  startDischarge(data: any) { return api.post('/v2g/sessions/discharge', data); },
  stopSession(id: string) { return api.post(`/v2g/sessions/${id}/stop`); },
  updateContract(id: string, data: any) { return api.put(`/v2g/contracts/${id}`, data); },
};
