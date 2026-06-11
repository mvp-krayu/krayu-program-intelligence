// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Fuel API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export interface FuelStats {
  totalTransactions: number;
  totalLiters: number;
  totalCostAed: number;
  avgPricePerLiter: number;
  theftAlertsActive: number;
  efficiencyAvgKmPerL: number;
}

export const fuelApi = {
  listTransactions(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null && v !== '').map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/fuel/transactions${q ? '?' + q : ''}`);
  },
  getTransaction(id: string) { return api.get(`/fuel/transactions/${id}`); },
  getConsumption(params: Record<string, any> = {}) {
    const q = Object.entries(params).filter(([, v]) => v != null).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    return api.get(`/fuel/consumption${q ? '?' + q : ''}`);
  },
  getTheftAlerts() { return api.get('/fuel/theft-alerts'); },
  getStats() { return api.get<FuelStats>('/fuel/stats'); },
  getEfficiency(vehicleId: string) { return api.get(`/fuel/efficiency/${vehicleId}`); },
  create(data: any) { return api.post('/fuel/transactions', data); },
};
