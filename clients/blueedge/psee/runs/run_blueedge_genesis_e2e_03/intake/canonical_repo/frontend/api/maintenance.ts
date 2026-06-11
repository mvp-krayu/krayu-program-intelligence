// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Maintenance API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export interface MaintenanceStats {
  totalWorkOrders: number;
  open: number;
  overdue: number;
  completedThisMonth: number;
  avgCompletionDays: number;
  costThisMonth: number;
}

export const maintenanceApi = {
  listWorkOrders(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/maintenance/work-orders${q ? '?' + q : ''}`);
  },
  getWorkOrder(id: string) { return api.get(`/maintenance/work-orders/${id}`); },
  getOverdue() { return api.get('/maintenance/work-orders/overdue'); },
  getPredictive() { return api.get('/maintenance/predictive'); },
  getStats() { return api.get<MaintenanceStats>('/maintenance/stats'); },
  getSchedule(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/maintenance/schedule${q ? '?' + q : ''}`);
  },
  create(data: any) { return api.post('/maintenance/work-orders', data); },
  update(id: string, data: any) { return api.put(`/maintenance/work-orders/${id}`, data); },
  complete(id: string) { return api.patch(`/maintenance/work-orders/${id}/complete`); },
  cancel(id: string) { return api.delete(`/maintenance/work-orders/${id}`); },
};
