import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { ElectrificationPlan } from './entities/electrification-plan.entity';

@Injectable()
export class ElectrificationService extends BaseCrudService<ElectrificationPlan> {
  constructor(@InjectRepository(ElectrificationPlan) repo: Repository<ElectrificationPlan>) { super(repo); }

  async getDashboard() {
    return success({
      fleetOverview: { totalBuses: 85, currentEv: 12, targetEv: 45, transitionPercent: 14.1, targetYear: 2028 },
      costComparison: {
        diesel: { acquisitionPerUnit: 850000, fuelPerKmAed: 1.85, maintenancePerKmAed: 0.42, totalCostPerKm: 2.27, co2PerKm: 1.21 },
        electric: { acquisitionPerUnit: 1200000, energyPerKmAed: 0.35, maintenancePerKmAed: 0.18, totalCostPerKm: 0.53, co2PerKm: 0.0 },
        savingsPerKmAed: 1.74, paybackYears: 3.2,
      },
      environmentalImpact: { co2ReductionTons: 1850, equivalentTrees: 42500, dieselSavedLiters: 785000 },
      dewaIncentives: { subsidyPerBus: 150000, chargingInfraGrant: 2500000, greenFleetCertification: true },
    });
  }

  async getTcoAnalysis(vehicleType: string) {
    return success({
      vehicleType, analysisYears: 12,
      diesel: { year1: 980000, year5: 1420000, year10: 1890000, year12: 2150000 },
      electric: { year1: 1250000, year5: 1380000, year10: 1520000, year12: 1610000 },
      breakEvenMonth: 38, totalSavings12yr: 540000, currency: 'AED',
    });
  }

  async getTransitionTimeline() {
    return success([
      { phase: 1, name: 'Pilot', period: 'Q1-Q2 2026', buses: 5, depots: 1, investment: 7500000, status: 'in_progress' },
      { phase: 2, name: 'Early Adoption', period: 'Q3-Q4 2026', buses: 15, depots: 2, investment: 22000000, status: 'planned' },
      { phase: 3, name: 'Scale-Up', period: '2027', buses: 25, depots: 3, investment: 35000000, status: 'planned' },
      { phase: 4, name: 'Full Fleet', period: '2028', buses: 45, depots: 4, investment: 18000000, status: 'planned' },
    ]);
  }

  async getRouteReadiness() {
    return success([
      { routeId: 'R14', name: 'Gold Souq → Mall of Emirates', distanceKm: 22, roundTripsDay: 8, evReady: true, chargingAvailable: true, rangeOk: true },
      { routeId: 'E07', name: 'Deira → JBR Express', distanceKm: 35, roundTripsDay: 6, evReady: true, chargingAvailable: true, rangeOk: true },
      { routeId: 'N11', name: 'Night Owl Al Quoz Loop', distanceKm: 48, roundTripsDay: 4, evReady: false, chargingAvailable: false, rangeOk: true },
    ]);
  }
}
