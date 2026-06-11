// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Driver Sessions API Service
// Session-Block Variance Architecture · DWVS Computation
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export interface DriverSessionBlock {
  id: string;
  blockNumber: number;
  vehicleId: string;
  driverId: string;
  driverName: string;
  authMethod: 'faceid_nfc' | 'pin_rfid' | 'biometric' | 'manual';
  svgDeviceId: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  status: 'active' | 'closed' | 'interrupted' | 'invalid';
  odometerStart: number;
  odometerEnd: number | null;
  distanceKm: number;
  fuelLevelStart: number;
  fuelLevelEnd: number | null;
  fuelConsumedL: number;
  fuelCostAED: number;
  lPer100km: number;
  fuelEvents: { time: string; gpsLat: number; gpsLng: number; station: string; liters: number; costAED: number }[];
  harshBrakes: number;
  harshAccelerations: number;
  harshCorners: number;
  maxSpeedKmh: number;
  avgSpeedKmh: number;
  idleMinutes: number;
  idlePct: number;
  routeHighwayPct: number;
  routeUrbanPct: number;
  elevationGainM: number;
  loadWeightKg: number;
  ambientTempC: number;
  dtcsGenerated: string[];
  rpmMean: number;
  rpmVariance: number;
  speedVariance: number;
  fuelRateVariance: number;
  accelVariance: number;
  wearIndex: number;
  healthDelta: number;
  tpmSigned: boolean;
  blockHash: string;
}

export interface DWVSResult {
  driverId: string;
  vehicleId: string;
  dwvs: number | null;
  consistencyRating: 'excellent' | 'good' | 'fair' | 'poor';
  confidence: 'high' | 'medium' | 'low' | 'insufficient_data';
  blockCount: number;
  totalKm: number;
  totalHours: number;
  totalFuelL: number;
  avgLPer100km: number;
  totalFuelCostAED: number;
  harshRate: number;
  dtcRate: number;
  avgRpmVariance: number;
  avgSpeedVariance: number;
  avgFuelRateVariance: number;
  avgWearIndex: number;
}

export interface SessionStats {
  totalBlocks: number;
  activeBlocks: number;
  closedBlocks: number;
  totalKmTracked: number;
}

export interface OpenSessionDto {
  vehicleId: string;
  driverId: string;
  driverName: string;
  authMethod: string;
  svgDeviceId: string;
  odometerStart: number;
  fuelLevelStart: number;
}

export interface CloseSessionDto {
  odometerEnd: number;
  fuelLevelEnd: number;
  endTime: string;
  fuelConsumedL?: number;
  fuelCostAED?: number;
  harshBrakes?: number;
  harshAccelerations?: number;
  harshCorners?: number;
  maxSpeedKmh?: number;
  avgSpeedKmh?: number;
  idleMinutes?: number;
  routeHighwayPct?: number;
  routeUrbanPct?: number;
  elevationGainM?: number;
  loadWeightKg?: number;
  ambientTempC?: number;
  dtcsGenerated?: string[];
  rpmMean?: number;
  rpmVariance?: number;
  speedVariance?: number;
  fuelRateVariance?: number;
  accelVariance?: number;
  blockHash?: string;
  tpmSignature?: string;
  tpmSigned?: boolean;
  gpsPolyline?: string;
}

export const driverSessionsApi = {
  // Session lifecycle
  openSession: (data: OpenSessionDto) => api.post('/driver-sessions/open', data),
  closeSession: (id: string, data: CloseSessionDto) => api.post(`/driver-sessions/${id}/close`, data),

  // Queries
  getStats: () => api.get<SessionStats>('/driver-sessions/stats'),
  getByVehicle: (vehicleId: string, page = 1, limit = 20) => api.get<DriverSessionBlock[]>(`/driver-sessions/vehicle/${vehicleId}?page=${page}&limit=${limit}`),
  getByDriver: (driverId: string, vehicleId?: string, page = 1, limit = 20) => api.get<DriverSessionBlock[]>(`/driver-sessions/driver/${driverId}?${vehicleId ? `vehicleId=${vehicleId}&` : ''}page=${page}&limit=${limit}`),
  getActiveSession: (vehicleId: string) => api.get<DriverSessionBlock | null>(`/driver-sessions/vehicle/${vehicleId}/active`),
  getByTimeRange: (vehicleId: string, start: string, end: string) => api.get<DriverSessionBlock[]>(`/driver-sessions/vehicle/${vehicleId}/range?start=${start}&end=${end}`),
  getById: (id: string) => api.get<DriverSessionBlock>(`/driver-sessions/${id}`),

  // DWVS computation
  computeDWVS: (driverId: string, vehicleId: string) => api.get<DWVSResult>(`/driver-sessions/dwvs/driver/${driverId}/vehicle/${vehicleId}`),
  computeVehicleDWVS: (vehicleId: string) => api.get<DWVSResult[]>(`/driver-sessions/dwvs/vehicle/${vehicleId}`),
};
