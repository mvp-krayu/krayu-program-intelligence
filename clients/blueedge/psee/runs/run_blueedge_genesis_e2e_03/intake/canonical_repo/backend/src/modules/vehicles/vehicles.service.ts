import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService extends BaseCrudService<Vehicle> {
  constructor(@InjectRepository(Vehicle) repo: Repository<Vehicle>) { super(repo); }

  async findByFleet(fleetId: string, query: PaginationDto) {
    const { page = 1, limit = 20 } = query;
    const [data, total] = await this.repo.findAndCount({ where: { fleetId }, skip: (page - 1) * limit, take: limit, order: { updatedAt: 'DESC' } });
    return paginated(data, total, page, limit);
  }

  async findByType(fleetType: string, query: PaginationDto) {
    const { page = 1, limit = 20 } = query;
    const [data, total] = await this.repo.findAndCount({ where: { fleetType }, skip: (page - 1) * limit, take: limit, order: { updatedAt: 'DESC' } });
    return paginated(data, total, page, limit);
  }

  async getPositions(fleetType?: string) {
    const where: any = {};
    if (fleetType && fleetType !== 'all') where.fleetType = fleetType;
    const vehicles = await this.repo.find({ where, select: ['id', 'licensePlate', 'fleetType', 'lastLatitude', 'lastLongitude', 'lastSpeed', 'lastHeading', 'lastPositionAt', 'status', 'currentDriverId'] });
    return success(vehicles);
  }

  async getTelemetry(id: string) {
    const v = await this.repo.findOne({ where: { id } });
    if (!v) return success(null);
    return success({ vehicleId: id, engineRpm: 1800, fuelLevelPercent: v.fuelLevelPercent, odometerKm: v.odometerKm, engineHours: v.engineHours, coolantTempC: 92, oilPressureKpa: 450, batteryVoltage: 13.8, speedKmh: v.lastSpeed, timestamp: new Date() });
  }

  async getDtcs(id: string) {
    return success([
      { code: 'P0087', description: 'Fuel Rail Pressure Too Low', severity: 'high', firstSeen: new Date(Date.now() - 86400000), active: true },
      { code: 'P2463', description: 'DPF Soot Accumulation', severity: 'medium', firstSeen: new Date(Date.now() - 172800000), active: true },
    ]);
  }

  async getStats() {
    const total = await this.repo.count();
    const active = await this.repo.count({ where: { status: 'active' } });
    const tankers = await this.repo.count({ where: { fleetType: 'tanker' } });
    const buses = await this.repo.count({ where: { fleetType: 'bus' } });
    const taxis = await this.repo.count({ where: { fleetType: 'taxi' } });
    return success({ total, active, inMaintenance: total - active, byType: { tankers, buses, taxis } });
  }

  async sendCommand(id: string, command: { type: string; payload?: any }) {
    return success({ vehicleId: id, command: command.type, status: 'sent', sentAt: new Date() });
  }
}
