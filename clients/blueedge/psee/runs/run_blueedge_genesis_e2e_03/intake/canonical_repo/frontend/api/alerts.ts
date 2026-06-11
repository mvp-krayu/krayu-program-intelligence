// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Alerts API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';
import type { Alert } from '@/types';

export interface AlertStats {
  active: number;
  critical: number;
  acknowledged: number;
  resolvedToday: number;
  avgResolutionMinutes: number;
}

export interface AlertListParams {
  page?: number;
  limit?: number;
  severity?: string;
  status?: string;
  vehicleId?: string;
}

function buildQuery(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'all');
  if (filtered.length === 0) return '';
  return '?' + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}

export const alertsApi = {
  list(params: AlertListParams = {}) {
    return api.get<{ items: Alert[]; total: number; page: number; limit: number }>(
      `/alerts${buildQuery(params)}`
    );
  },

  getById(id: string) {
    return api.get<Alert>(`/alerts/${id}`);
  },

  getActive() {
    return api.get<Alert[]>('/alerts/active');
  },

  getStats() {
    return api.get<AlertStats>('/alerts/stats');
  },

  create(data: Partial<Alert>) {
    return api.post<Alert>('/alerts', data);
  },

  acknowledge(id: string, userId: string) {
    return api.patch(`/alerts/${id}/acknowledge`, { userId });
  },

  resolve(id: string, userId: string, resolution: string) {
    return api.patch(`/alerts/${id}/resolve`, { userId, resolution });
  },

  dismiss(id: string) {
    return api.patch(`/alerts/${id}/dismiss`);
  },
};
