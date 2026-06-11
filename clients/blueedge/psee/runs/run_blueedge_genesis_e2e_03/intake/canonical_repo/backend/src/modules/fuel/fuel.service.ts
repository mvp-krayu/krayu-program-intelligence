import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { FuelTransaction } from './entities/fuel-transaction.entity';

@Injectable()
export class FuelService extends BaseCrudService<FuelTransaction> {
  constructor(@InjectRepository(FuelTransaction) repo: Repository<FuelTransaction>) { super(repo); }
  async getConsumption(query: any) { return success({ period: query.period || 'week', avgLper100km: 32.5, totalFuelL: 12500, totalCost: 28750, byFleetType: { tanker: { avgL: 38.2, cost: 18500 }, bus: { avgL: 28.1, cost: 7200 }, taxi: { avgL: 8.5, cost: 3050 } } }); }
  async getTheftAlerts() { return success([{ vehicleId: 'v1', timestamp: new Date(Date.now() - 7200000), dropL: 45, location: 'Industrial Area 2', confidence: 0.87, status: 'investigating' }]); }
  async getStats() { return success({ totalTransactions: 856, totalFuelL: 125000, totalCostAED: 287500, avgPricePerL: 2.3, theftAlerts: 3, efficiencyTrend: '+2.1%' }); }
  async getEfficiency(vehicleId: string) { return success({ vehicleId, avgLper100km: 34.2, trend: [{ date: '2026-02-05', value: 35.1 }, { date: '2026-02-12', value: 34.2 }] }); }
}
