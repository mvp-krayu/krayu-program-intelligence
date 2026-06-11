// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Vehicles API Service
// ══════════════════════════════════════════════════════════════

import { api } from './client';
import type { Vehicle } from '@/types';

export interface VehicleStats {
  total: number;
  active: number;
  inMaintenance: number;
  byType: { tankers: number; buses: number; taxis: number };
}

export interface VehiclePosition {
  id: string;
  licensePlate: string;
  fleetType: string;
  lastLatitude: number;
  lastLongitude: number;
  lastSpeed: number;
  lastHeading: number;
  lastPositionAt: string;
  status: string;
  currentDriverId: string;
}

export interface VehicleTelemetry {
  vehicleId: string;
  engineRpm: number;
  fuelLevelPercent: number;
  odometerKm: number;
  engineHours: number;
  coolantTempC: number;
  oilPressureKpa: number;
  batteryVoltage: number;
  speedKmh: number;
  timestamp: string;
}

export interface VehicleDtc {
  code: string;
  description: string;
  severity: string;
  firstSeen: string;
  active: boolean;
}

export interface VehicleListParams {
  page?: number;
  limit?: number;
  fleetType?: string;
  status?: string;
  search?: string;
}

function buildQuery(params: Record<string, any>): string {
  const filtered = Object.entries(params).filter(([, v]) => v != null && v !== '' && v !== 'all');
  if (filtered.length === 0) return '';
  return '?' + filtered.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
}

export const vehiclesApi = {
  list(params: VehicleListParams = {}) {
    return api.get<{ items: Vehicle[]; total: number; page: number; limit: number }>(
      `/vehicles${buildQuery(params)}`
    );
  },

  getById(id: string) {
    return api.get<Vehicle>(`/vehicles/${id}`);
  },

  getStats() {
    return api.get<VehicleStats>('/vehicles/stats');
  },

  getPositions(fleetType?: string) {
    const q = fleetType && fleetType !== 'all' ? `?fleetType=${fleetType}` : '';
    return api.get<VehiclePosition[]>(`/vehicles/positions${q}`);
  },

  getTelemetry(id: string) {
    return api.get<VehicleTelemetry>(`/vehicles/${id}/telemetry`);
  },

  getDtcs(id: string) {
    return api.get<VehicleDtc[]>(`/vehicles/${id}/dtcs`);
  },

  create(data: Partial<Vehicle>) {
    return api.post<Vehicle>('/vehicles', data);
  },

  update(id: string, data: Partial<Vehicle>) {
    return api.put<Vehicle>(`/vehicles/${id}`, data);
  },

  remove(id: string) {
    return api.delete(`/vehicles/${id}`);
  },

  sendCommand(id: string, command: { type: string; payload?: any }) {
    return api.post(`/vehicles/${id}/commands`, command);
  },
};
