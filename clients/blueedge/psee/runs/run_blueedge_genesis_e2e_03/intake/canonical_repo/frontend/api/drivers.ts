// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Drivers API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';
import type { Driver } from '@/types';

export interface DriverStats {
  total: number;
  active: number;
  onLeave: number;
  avgSafetyScore: number;
  avgEfficiencyScore: number;
}

export interface DriverScorecard {
  driverId: string;
  name: string;
  safetyScore: number;
  efficiencyScore: number;
  complianceScore: number;
  overallScore: number;
  recentEvents: any[];
  trend: string;
}

export interface DriverHOS {
  driverId: string;
  currentStatus: string;
  driveTimeRemainingMin: number;
  shiftTimeRemainingMin: number;
  weeklyHoursUsed: number;
  breakRequired: boolean;
  violations: any[];
}

export interface LeaderboardEntry {
  rank: number;
  driverId: string;
  name: string;
  safetyScore: number;
  efficiencyScore: number;
}

export interface DriverListParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

function buildQuery(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'all');
  if (filtered.length === 0) return '';
  return '?' + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}

export const driversApi = {
  list(params: DriverListParams = {}) {
    return api.get<{ items: Driver[]; total: number; page: number; limit: number }>(
      `/drivers${buildQuery(params)}`
    );
  },

  getById(id: string) {
    return api.get<Driver>(`/drivers/${id}`);
  },

  getStats() {
    return api.get<DriverStats>('/drivers/stats');
  },

  getLeaderboard(params: { page?: number; limit?: number } = {}) {
    return api.get<{ items: LeaderboardEntry[]; total: number }>(
      `/drivers/leaderboard${buildQuery(params)}`
    );
  },

  getScorecard(id: string) {
    return api.get<DriverScorecard>(`/drivers/${id}/scorecard`);
  },

  getHOS(id: string) {
    return api.get<DriverHOS>(`/drivers/${id}/hos`);
  },

  getTrips(id: string, params: { page?: number; limit?: number } = {}) {
    return api.get(`/drivers/${id}/trips${buildQuery(params)}`);
  },

  getCertifications(id: string) {
    return api.get(`/drivers/${id}/certifications`);
  },

  create(data: Partial<Driver>) {
    return api.post<Driver>('/drivers', data);
  },

  update(id: string, data: Partial<Driver>) {
    return api.put<Driver>(`/drivers/${id}`, data);
  },

  remove(id: string) {
    return api.delete(`/drivers/${id}`);
  },
};
