import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { WorkOrder } from './entities/work-order.entity';

@Injectable()
export class MaintenanceService extends BaseCrudService<WorkOrder> {
  constructor(@InjectRepository(WorkOrder) repo: Repository<WorkOrder>) { super(repo); }
  async getOverdue() { return success(await this.repo.find({ where: { status: 'open' }, order: { scheduledDate: 'ASC' }, take: 50 })); }
  async getPredictive() { return success([{ vehicleId: 'v1', component: 'Oil Pump', predictedFailure: '2026-02-19', confidence: 0.89, priority: 'high' }, { vehicleId: 'v2', component: 'Brake Pads', predictedFailure: '2026-02-25', confidence: 0.92, priority: 'medium' }]); }
  async getStats() { return success({ openOrders: 23, inProgress: 8, pendingParts: 5, completedThisMonth: 67, avgCompletionDays: 2.3, totalCostMTD: 45800, predictiveAlerts: 12 }); }
  async getSchedule(query: { month?: string }) { return success({ month: query.month || '2026-02', scheduled: [], completed: [], overdue: [] }); }
}
