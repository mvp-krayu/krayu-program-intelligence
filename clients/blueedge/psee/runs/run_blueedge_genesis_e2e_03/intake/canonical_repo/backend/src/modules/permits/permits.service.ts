import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Permit } from './entities/permit.entity';

@Injectable()
export class PermitsService extends BaseCrudService<Permit> {
  constructor(@InjectRepository(Permit) repo: Repository<Permit>) { super(repo); }
  async getDashboard() {
    return success({
      total: 312, active: 285, expiringSoon: 18, expired: 9, pendingRenewal: 14,
      byType: { operatingLicense: 45, hazmatPermit: 38, driverLicense: 156, vehicleRegistration: 48, transitPermit: 25 },
      upcomingRenewals: [
        { vehicleId: 'V001', plate: 'DXB-7291', permitType: 'HAZMAT Transport', expiryDate: '2026-03-15', daysRemaining: 30, authority: 'NCEMA', renewalCost: 5500 },
        { vehicleId: 'V006', plate: 'DXB-1123', permitType: 'Public Transport License', expiryDate: '2026-03-01', daysRemaining: 16, authority: 'RTA', renewalCost: 3200 },
        { vehicleId: 'V012', plate: 'DXB-9901', permitType: 'Limousine Permit', expiryDate: '2026-02-28', daysRemaining: 15, authority: 'RTA', renewalCost: 8500 },
      ],
    });
  }
  async getExpiringPermits(days: number) {
    return success({ period: `Next ${days} days`, count: days <= 30 ? 18 : 42, permits: [] });
  }
  async requestRenewal(permitId: string) {
    return success({ permitId, status: 'renewal_requested', requestedAt: new Date(), estimatedProcessingDays: 5 });
  }
}
