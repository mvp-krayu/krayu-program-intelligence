import { api } from './client';
export const reportsApi = {
  getTemplates() { return api.get('/reports/templates'); },
  generate(data: any) { return api.post('/reports/generate', data); },
  getStatus(id: string) { return api.get(`/reports/${id}/status`); },
  getReport(id: string) { return api.get(`/reports/${id}`); },
  getScheduled() { return api.get('/reports/scheduled'); },
  scheduleReport(data: any) { return api.post('/reports/schedule', data); },
  cancelScheduled(id: string) { return api.delete(`/reports/scheduled/${id}`); },
};
