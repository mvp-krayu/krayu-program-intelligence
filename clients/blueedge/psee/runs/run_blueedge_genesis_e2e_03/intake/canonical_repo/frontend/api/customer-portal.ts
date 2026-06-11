import { api } from './client';
export const customerPortalApi = {
  getDashboard(customerId: string) { return api.get(`/customer-portal/${customerId}/dashboard`); },
  trackShipment(shipmentNumber: string) { return api.get(`/customer-portal/track/${shipmentNumber}`); },
  getSlaReport(customerId: string, period: string) { return api.get(`/customer-portal/${customerId}/sla/${period}`); },
  getDocuments(shipmentId: string) { return api.get(`/customer-portal/documents/${shipmentId}`); },
  list(params: Record<string, any> = {}) { const q = Object.entries(params).filter(([,v])=>v!=null&&v!=='').map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&'); return api.get(`/customer-portal${q?'?'+q:''}`); },
  getById(id: string) { return api.get(`/customer-portal/${id}`); },
  create(data: any) { return api.post('/customer-portal', data); },
};
