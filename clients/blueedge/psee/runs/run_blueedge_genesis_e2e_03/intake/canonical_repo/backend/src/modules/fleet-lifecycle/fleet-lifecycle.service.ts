import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { LifecyclePlan } from './entities/lifecycle-plan.entity';

@Injectable()
export class FleetLifecycleService extends BaseCrudService<LifecyclePlan> {
  constructor(@InjectRepository(LifecyclePlan) repo: Repository<LifecyclePlan>) { super(repo); }
  async getDashboard() {
    return success({
      fleetAge: { avgMonths: 42, newest: 3, oldest: 108, distribution: { '0-24mo': 28, '24-48mo': 52, '48-72mo': 45, '72+mo': 31 } },
      depreciation: { totalFleetValueAed: 48500000, depreciationRatePercent: 15, residualValue30Pct: 14550000 },
      replacementForecast: [
        { year: 2026, vehicles: 8, estimatedCostAed: 6800000, types: { tanker: 3, bus: 4, taxi: 1 } },
        { year: 2027, vehicles: 15, estimatedCostAed: 12500000, types: { tanker: 5, bus: 6, taxi: 4 } },
        { year: 2028, vehicles: 22, estimatedCostAed: 18200000, types: { tanker: 8, bus: 8, taxi: 6 } },
      ],
      costOfOwnership: { avgPerVehicleAed: 85000, fuelPercent: 42, maintenancePercent: 28, insurancePercent: 15, depreciationPercent: 15 },
    });
  }
  async getVehicleLifecycle(vehicleId: string) {
    return success({ vehicleId, acquisitionDate: '2022-03-15', acquisitionCostAed: 850000, currentValueAed: 510000, totalMaintenanceAed: 125000, ageMonths: 47, odometerKm: 185000, phase: 'mid-life', recommendedAction: 'Continue operations — replacement recommended at 250,000km', nextMajorService: '200,000km transmission overhaul', estimatedRetirement: '2028-Q2' });
  }
  async getRetirementCandidates() {
    return success([
      { vehicleId: 'V005', plate: 'DXB-6677', type: 'tanker', ageMonths: 108, odometerKm: 420000, maintenanceCostAed: 285000, score: 92, recommendation: 'Retire — maintenance costs exceeding 30% of value' },
      { vehicleId: 'V010', plate: 'DXB-3310', type: 'bus', ageMonths: 96, odometerKm: 380000, maintenanceCostAed: 195000, score: 78, recommendation: 'Replace — consider EV replacement per electrification plan' },
    ]);
  }
}
