import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class EvService extends BaseCrudService<EvVehicle> {
  constructor(
    @InjectRepository(EvVehicle) repo: Repository<EvVehicle>,
    @InjectRepository(EvChargingSession) private sessionRepo: Repository<EvChargingSession>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      totalEvVehicles: 24,
      avgSocPercent: 68.5,
      avgHealthPercent: 96.2,
      currentlyCharging: 6,
      lowBattery: 2,
      totalEnergyTodayKwh: 1250,
      costTodayAED: 625,
      avgEfficiencyKwhPer100km: 22.5,
      chargingStations: { total: 15, available: 9, inUse: 6 },
    });
  }

  async getBatteryHealth(vehicleId: string) {
    return success({
      vehicleId,
      stateOfHealth: 96.2,
      degradationRate: 0.8,
      estimatedLifeYears: 7.5,
      totalCycles: 342,
      maxCycles: 3000,
      cellBalance: { min: 3.62, max: 3.68, avg: 3.65, spread: 0.06 },
      thermalHistory: { avgTempC: 28, maxTempC: 42, optimalRange: '20-35°C' },
      recommendations: ['Avoid charging above 90% regularly', 'Pre-condition in summer heat'],
    });
  }

  async getRangePrediction(vehicleId: string, query: any) {
    return success({
      vehicleId,
      currentSoc: 72,
      estimatedRange: { optimistic: 285, expected: 245, conservative: 210, unit: 'km' },
      factors: {
        temperature: { impactPercent: -8, currentC: 38 },
        hvac: { impactPercent: -12, status: 'cooling' },
        payload: { impactPercent: -5, currentKg: 2500 },
        terrain: { impactPercent: -3, profile: 'mixed' },
        drivingStyle: { impactPercent: +4, score: 'eco' },
      },
      canReachDestination: true,
      suggestedChargingStop: null,
    });
  }

  async getChargingSessions(query: PaginationDto) {
    const sessions = [
      { id: 'cs1', vehicleId: 'v-ev-001', stationName: 'DEWA Green Charger - JAFZA', chargerType: 'dc_fast', energyKwh: 45.2, costAED: 22.6, duration: '38 min', socStart: 22, socEnd: 85, status: 'completed' },
      { id: 'cs2', vehicleId: 'v-ev-003', stationName: 'ADNOC EV Hub - SZR', chargerType: 'ultra_fast', energyKwh: 62.1, costAED: 37.3, duration: '22 min', socStart: 15, socEnd: 92, status: 'completed' },
      { id: 'cs3', vehicleId: 'v-ev-005', stationName: 'Depot Charger B2', chargerType: 'ac_level2', energyKwh: 28.4, costAED: 11.4, duration: '4.2 hrs', socStart: 45, socEnd: 90, status: 'in_progress' },
    ];
    return success(sessions);
  }

  async getChargingSchedule() {
    return success({
      optimizedSchedule: [
        { vehicleId: 'v-ev-001', slot: '22:00-02:00', station: 'Depot A1', targetSoc: 90, reason: 'Off-peak tariff' },
        { vehicleId: 'v-ev-003', slot: '23:00-03:00', station: 'Depot A2', targetSoc: 85, reason: 'Morning route prep' },
        { vehicleId: 'v-ev-007', slot: '14:00-14:45', station: 'Mid-route DC Fast', targetSoc: 70, reason: 'Range top-up' },
      ],
      estimatedSavingsAED: 145,
      offPeakPercentage: 78,
    });
  }

  async getEnergyAnalytics(query: any) {
    return success({
      periodDays: 30,
      totalEnergyKwh: 38500,
      totalCostAED: 19250,
      avgCostPerKwh: 0.50,
      avgEfficiency: 21.8,
      regeneratedKwh: 4200,
      regenPercent: 10.9,
      peakVsOffPeak: { peak: 35, offPeak: 65 },
      carbonSavedKg: 22400,
    });
  }

  async startCharging(vehicleId: string, body: any) {
    return success({ vehicleId, sessionId: 'cs-new-001', status: 'started', chargerType: body.chargerType || 'dc_fast', targetSoc: body.targetSoc || 90, estimatedMinutes: 35 });
  }

  async stopCharging(vehicleId: string) {
    return success({ vehicleId, status: 'stopped', finalSoc: 78, energyDeliveredKwh: 32.5 });
  }
}

// ─── Controller ───────────────────────────────────────────────
