import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class V2gService extends BaseCrudService<V2gContract> {
  constructor(
    @InjectRepository(V2gContract) repo: Repository<V2gContract>,
    @InjectRepository(V2gSession) private sessionRepo: Repository<V2gSession>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      activeContracts: 18,
      vehiclesDischarging: 5,
      vehiclesCharging: 8,
      vehiclesIdle: 5,
      realTimePower: { toGridKw: -125.5, fromGridKw: 340.2, netKw: 214.7 },
      today: { energyToGridKwh: 580, energyFromGridKwh: 1420, revenueAED: 348, costSavingsAED: 196 },
      monthToDate: { revenueAED: 4850, costSavingsAED: 2680, totalEnergyTradedKwh: 28500, carbonOffsetKg: 8200 },
      gridStatus: { frequency: 50.02, demandLevel: 'moderate', peakShavingActive: false, nextPeakWindow: '14:00-17:00' },
    });
  }

  async getContracts(query: PaginationDto) {
    const contracts = [
      { id: 'v2g-c1', vehicleId: 'v-ev-001', gridOperator: 'DEWA Smart Grid', status: 'active', services: ['peak_shaving', 'frequency_regulation'], minSoc: 20, feedInTariff: 0.65, monthlyRevenueAED: 280 },
      { id: 'v2g-c2', vehicleId: 'v-ev-003', gridOperator: 'DEWA Smart Grid', status: 'active', services: ['demand_response', 'emergency_backup'], minSoc: 30, feedInTariff: 0.72, monthlyRevenueAED: 195 },
      { id: 'v2g-c3', vehicleId: 'v-ev-005', gridOperator: 'Masdar Clean Energy', status: 'paused', services: ['peak_shaving'], minSoc: 25, feedInTariff: 0.58, monthlyRevenueAED: 0 },
    ];
    return success(contracts);
  }

  async getLiveSessions(query: PaginationDto) {
    const sessions = [
      { id: 's1', vehicleId: 'v-ev-001', mode: 'discharging', serviceType: 'peak_shaving', currentPowerKw: -22.5, socPercent: 65, energyToGridKwh: 8.2, revenueAED: 5.33, duration: '22 min' },
      { id: 's2', vehicleId: 'v-ev-007', mode: 'discharging', serviceType: 'frequency_regulation', currentPowerKw: -15.0, socPercent: 72, energyToGridKwh: 3.1, revenueAED: 2.17, duration: '12 min' },
      { id: 's3', vehicleId: 'v-ev-012', mode: 'charging', serviceType: 'demand_response', currentPowerKw: 50.0, socPercent: 45, energyFromGridKwh: 12.5, costAED: 5.0, duration: '38 min' },
    ];
    return success(sessions);
  }

  async getEnergyAnalytics(query: any) {
    return success({
      period: query.period || '30d',
      energyTraded: { toGridKwh: 12500, fromGridKwh: 38200, netKwh: -25700 },
      financial: { totalRevenueAED: 4850, totalCostAED: 15280, netSavingsAED: 2680, avgFeedInTariff: 0.63, avgConsumptionRate: 0.40 },
      gridServices: [
        { service: 'peak_shaving', events: 45, energyKwh: 5200, revenueAED: 2340 },
        { service: 'frequency_regulation', events: 280, energyKwh: 4800, revenueAED: 1680 },
        { service: 'demand_response', events: 12, energyKwh: 2500, revenueAED: 830 },
      ],
      batteryImpact: { additionalCycleEquivalents: 18, estimatedDegradationPercent: 0.3, degradationCostAED: 1200, netBenefitAED: 1480 },
    });
  }

  async getGridSignals() {
    return success({
      currentFrequencyHz: 50.02,
      demandLevel: 'moderate',
      gridCarbonIntensity: 420,
      priceSignals: { currentAEDperKwh: 0.45, forecastPeak: 0.85, forecastOffPeak: 0.28, nextPeakIn: '3.5 hours' },
      activeDemandResponse: false,
      scheduledEvents: [
        { type: 'peak_shaving', start: '14:00', end: '17:00', expectedDemand: 'high', targetDischargeKw: 200 },
        { type: 'demand_response', start: '18:30', end: '19:30', expectedDemand: 'critical', incentiveMultiplier: 2.5 },
      ],
    });
  }

  async createContract(body: any) {
    return success({ id: 'v2g-new', vehicleId: body.vehicleId, gridOperator: body.gridOperatorName, status: 'active', services: body.gridServices, createdAt: new Date() });
  }

  async startDischarge(vehicleId: string, body: any) {
    return success({ vehicleId, sessionId: 'v2g-s-new', mode: 'discharging', serviceType: body.serviceType || 'peak_shaving', targetPowerKw: body.powerKw || 22, minSoc: body.minSoc || 20, status: 'started' });
  }

  async stopSession(vehicleId: string) {
    return success({ vehicleId, status: 'stopped', finalEnergyKwh: 12.5, revenueAED: 8.13 });
  }

  async getFleetSchedule() {
    return success({
      optimizedPlan: [
        { vehicleId: 'v-ev-001', window: '14:00-17:00', action: 'discharge', targetKw: 22, expectedRevenueAED: 18.5, reason: 'Peak shaving – high demand forecast' },
        { vehicleId: 'v-ev-003', window: '22:00-06:00', action: 'charge', targetKw: 50, expectedCostAED: 14.0, reason: 'Off-peak charging – lowest tariff' },
        { vehicleId: 'v-ev-007', window: '18:30-19:30', action: 'discharge', targetKw: 30, expectedRevenueAED: 22.5, reason: 'Demand response event – 2.5x incentive' },
      ],
      totalExpectedRevenueAED: 41.0,
      totalExpectedCostAED: 14.0,
      netBenefitAED: 27.0,
    });
  }
}

// ─── Controller ───────────────────────────────────────────────
