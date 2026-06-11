// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Vehicle Lifecycle API Service
// 360° View · TCO · Fleet Ranking · AI Recommendations
// ══════════════════════════════════════════════════════════════

import { api } from './client';

export interface Vehicle360Summary {
  vehicleId: string;
  generated: string;
  activeSession: any | null;
  driverAttribution: any[];
}

export interface TCOBreakdown {
  acquisition: number;
  fuel: number;
  maintenanceScheduled: number;
  maintenanceUnscheduled: number;
  insurance: number;
  tires: number;
  registrationTolls: number;
  downtime: number;
}

export interface TCOResult {
  vehicleId: string;
  ageMonths: number;
  currentOdometer: number;
  tcoBreakdown: TCOBreakdown;
  tcoTotal: number;
  costPerKm: number;
  residualValueAED: number;
  monthlyDepreciation: number;
  tco3YearProjection: number;
  tco5YearProjection: number;
  breakEvenMonths: number;
  recommendation: 'KEEP' | 'EVALUATE_REPLACEMENT';
}

export interface FleetRanking {
  vehicleId: string;
  overallRank: number;
  fleetSize: number;
  rankings: Record<string, { rank: number; total: number; percentile: number }>;
  sameModel: { rank: number; total: number; costPerKmThis: number; costPerKmAvg: number; delta: number };
  fleetContributionPct: number;
}

export interface DriverAttribution {
  vehicleId: string;
  totalDrivers: number;
  weightedDWVS: number;
  drivers: {
    driverId: string;
    dwvs: number;
    consistencyRating: string;
    totalKm: number;
    totalHours: number;
    avgLPer100km: number;
    depreciationPerKm: number;
    annualDepreciationImpactAED: number;
    netEffect: 'value_preserved' | 'accelerated_wear';
  }[];
}

export interface AIRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  impactAED: number;
  confidencePct: number;
  actionType: string;
}

export interface MaintenanceQuality {
  vehicleId: string;
  onTimeRate: number;
  firstTimeFixRate: number;
  repeatDTCRate: number;
  overallQualityScore: number;
  totalServices: number;
  scheduledPct: number;
  predictivePct: number;
  unscheduledPct: number;
  regulatoryPct: number;
}

export interface FuelIntelligence {
  vehicleId: string;
  avgLPer100km: number;
  baselineLPer100km: number;
  totalFuelCostAED: number;
  costPerKmFuel: number;
  anomaliesDetected: number;
  driverFuelEfficiency: {
    driverId: string;
    name: string;
    avgLPer100km: number;
    deltaVsBaseline: number;
    sessions: number;
  }[];
}

export const vehicleLifecycleApi = {
  // 360° summary
  getVehicle360: (vehicleId: string) => api.get<Vehicle360Summary>(`/vehicle-lifecycle/${vehicleId}`),

  // TCO
  computeTCO: (vehicleId: string, fuelPricePerL?: number) =>
    api.get<TCOResult>(`/vehicle-lifecycle/${vehicleId}/tco${fuelPricePerL ? `?fuelPricePerL=${fuelPricePerL}` : ''}`),

  // Driver attribution
  getDriverAttribution: (vehicleId: string) =>
    api.get<DriverAttribution>(`/vehicle-lifecycle/${vehicleId}/driver-attribution`),

  // Fleet ranking
  getFleetRanking: (vehicleId: string) =>
    api.get<FleetRanking>(`/vehicle-lifecycle/${vehicleId}/fleet-ranking`),

  // AI recommendations
  getRecommendations: (vehicleId: string) =>
    api.get<AIRecommendation[]>(`/vehicle-lifecycle/${vehicleId}/recommendations`),

  // Maintenance quality
  getMaintenanceQuality: (vehicleId: string) =>
    api.get<MaintenanceQuality>(`/vehicle-lifecycle/${vehicleId}/maintenance-quality`),

  // Fuel intelligence
  getFuelIntelligence: (vehicleId: string) =>
    api.get<FuelIntelligence>(`/vehicle-lifecycle/${vehicleId}/fuel-intelligence`),
};
