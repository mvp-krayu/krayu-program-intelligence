import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Alert } from './entities/alert.entity';

@Injectable()
export class AlertsService extends BaseCrudService<Alert> {
  constructor(@InjectRepository(Alert) repo: Repository<Alert>) { super(repo); }
  async getActive() { return success(await this.repo.find({ where: { status: 'active' }, order: { createdAt: 'DESC' }, take: 100 })); }
  async acknowledge(id: string, userId: string) { return this.update(id, { status: 'acknowledged', acknowledgedBy: userId, acknowledgedAt: new Date() } as any); }
  async resolve(id: string, userId: string, resolution: string) { return this.update(id, { status: 'resolved', resolvedBy: userId, resolvedAt: new Date(), resolution } as any); }
  async getStats() { const active = await this.repo.count({ where: { status: 'active' } }); const crit = await this.repo.count({ where: { status: 'active', severity: 'critical' } }); return success({ active, critical: crit, acknowledged: await this.repo.count({ where: { status: 'acknowledged' } }), resolvedToday: 15, avgResolutionMinutes: 23 }); }
}
