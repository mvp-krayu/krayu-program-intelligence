import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { ChargingDepot } from './entities/charging-depot.entity';

@Injectable()
export class DepotChargingService extends BaseCrudService<ChargingDepot> {
  constructor(@InjectRepository(ChargingDepot) repo: Repository<ChargingDepot>) { super(repo); }
  async getDashboard() {
    return success({
      totalDepots: 4, totalChargers: 48, activeChargers: 38, chargingNow: 12,
      energyTodayKwh: 4850, peakLoadKw: 1200, avgChargeDurationMin: 185,
      depots: [
        { id: 'd1', name: 'Al Quoz Bus Depot', chargers: 16, active: 14, load: 78, buses: 8, status: 'operational' },
        { id: 'd2', name: 'JAFZA Fleet Depot', chargers: 12, active: 10, load: 62, buses: 3, status: 'operational' },
        { id: 'd3', name: 'Rashidiya Depot', chargers: 12, active: 9, load: 45, buses: 1, status: 'operational' },
        { id: 'd4', name: 'Dubai South Depot', chargers: 8, active: 5, load: 30, buses: 0, status: 'partial' },
      ],
    });
  }
  async getSchedule(depotId: string) {
    return success([
      { busId: 'B-14', plate: 'DXB-1123', scheduledStart: '22:00', scheduledEnd: '05:00', charger: 'C-03', priority: 'high', batteryStart: 25, batteryTarget: 95 },
      { busId: 'E-07', plate: 'DXB-2290', scheduledStart: '22:30', scheduledEnd: '04:30', charger: 'C-07', priority: 'medium', batteryStart: 40, batteryTarget: 90 },
      { busId: 'SB-22', plate: 'DXB-5561', scheduledStart: '23:00', scheduledEnd: '05:30', charger: 'C-11', priority: 'low', batteryStart: 55, batteryTarget: 95 },
    ]);
  }
  async getEnergyOptimization() {
    return success({ peakAvoidanceSavings: 2800, offPeakChargingPercent: 82, dewaToURate: 0.38, gridLoadBalancing: 'active', solarContributionPercent: 15, currency: 'AED' });
  }
  async getChargerStatus(depotId: string) {
    return success(Array.from({ length: 8 }, (_, i) => ({ id: `C-${String(i + 1).padStart(2, '0')}`, type: i < 4 ? 'DC Fast 150kW' : 'AC Level 2 22kW', status: i < 3 ? 'charging' : i < 6 ? 'available' : 'maintenance', currentBus: i < 3 ? `B-${10 + i}` : null, powerKw: i < 3 ? 120 + Math.random() * 30 : 0, sessionDurationMin: i < 3 ? 45 + Math.floor(Math.random() * 60) : 0 })));
  }
}
