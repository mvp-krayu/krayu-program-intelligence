import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Fleet } from './entities/fleet.entity';

@Injectable()
export class FleetsService extends BaseCrudService<Fleet> {
  constructor(@InjectRepository(Fleet) repo: Repository<Fleet>) { super(repo); }
  async getDashboard(id: string) { return success({ fleetId: id, vehicleCount: 42, activeVehicles: 38, avgFuelEfficiency: 8.2, totalDistanceToday: 12500, alerts: { critical: 1, high: 3, medium: 8 } }); }
  async getKpis() { return success({ totalFleets: 5, totalVehicles: 178, utilizationRate: 87.5, avgSafetyScore: 88.2, fuelCostToday: 12450, maintenanceDue: 12 }); }
}
