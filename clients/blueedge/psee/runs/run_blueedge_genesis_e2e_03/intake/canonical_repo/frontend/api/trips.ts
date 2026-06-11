// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Trips API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';
import type { Trip } from '@/types';

export interface TripStats {
  totalTrips: number;
  completed: number;
  inProgress: number;
  avgDistanceKm: number;
  avgDurationMin: number;
  totalFuelL: number;
  avgScore: number;
}

export interface TripTimeline {
  tripId: string;
  events: Array<{
    type: string;
    time: string;
    location: string;
  }>;
}

export interface TripListParams {
  page?: number;
  limit?: number;
  status?: string;
  vehicleId?: string;
  driverId?: string;
  startDate?: string;
  endDate?: string;
}

function buildQuery(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'all');
  if (filtered.length === 0) return '';
  return '?' + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}

export const tripsApi = {
  list(params: TripListParams = {}) {
    return api.get<{ items: Trip[]; total: number; page: number; limit: number }>(
      `/trips${buildQuery(params)}`
    );
  },

  getById(id: string) {
    return api.get<Trip>(`/trips/${id}`);
  },

  getActive() {
    return api.get<Trip[]>('/trips/active');
  },

  getStats(params: { startDate?: string; endDate?: string } = {}) {
    return api.get<TripStats>(`/trips/stats${buildQuery(params)}`);
  },

  getTimeline(id: string) {
    return api.get<TripTimeline>(`/trips/${id}/timeline`);
  },

  getTelemetry(id: string) {
    return api.get(`/trips/${id}/telemetry`);
  },

  create(data: Partial<Trip>) {
    return api.post<Trip>('/trips', data);
  },

  start(id: string) {
    return api.post(`/trips/${id}/start`);
  },

  complete(id: string) {
    return api.post(`/trips/${id}/complete`);
  },

  update(id: string, data: Partial<Trip>) {
    return api.put<Trip>(`/trips/${id}`, data);
  },

  cancel(id: string) {
    return api.delete(`/trips/${id}`);
  },
};
