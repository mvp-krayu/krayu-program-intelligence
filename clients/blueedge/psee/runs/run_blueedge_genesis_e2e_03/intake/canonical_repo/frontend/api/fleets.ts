// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Fleets API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export interface FleetKpis {
  totalFleets: number;
  totalVehicles: number;
  activeVehicles: number;
  utilizationPct: number;
  avgFuelEfficiency: number;
  tripsToday: number;
  alertsActive: number;
  revenueToday: number;
}

export const fleetsApi = {
  list(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/fleets${q ? '?' + q : ''}`);
  },
  getById(id: string) { return api.get(`/fleets/${id}`); },
  getKpis() { return api.get<FleetKpis>('/fleets/kpis'); },
  getDashboard(id: string) { return api.get(`/fleets/${id}/dashboard`); },
  getVehicles(id: string) { return api.get(`/fleets/${id}/vehicles`); },
  create(data: any) { return api.post('/fleets', data); },
  update(id: string, data: any) { return api.put(`/fleets/${id}`, data); },
  remove(id: string) { return api.delete(`/fleets/${id}`); },
};
