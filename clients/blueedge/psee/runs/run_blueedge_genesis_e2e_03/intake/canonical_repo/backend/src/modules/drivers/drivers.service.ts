import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { Driver } from './entities/driver.entity';

@Injectable()
export class DriversService extends BaseCrudService<Driver> {
  constructor(@InjectRepository(Driver) repo: Repository<Driver>) { super(repo); }

  async getScorecard(id: string) {
    const d = await this.repo.findOne({ where: { id } });
    return success({ driverId: id, name: d ? `${d.firstName} ${d.lastName}` : 'Unknown', safetyScore: d?.safetyScore || 0, efficiencyScore: d?.efficiencyScore || 0, complianceScore: d?.complianceScore || 0, overallScore: d ? (d.safetyScore + d.efficiencyScore + d.complianceScore) / 3 : 0, recentEvents: [], trend: 'stable' });
  }

  async getHOSStatus(id: string) {
    return success({ driverId: id, currentStatus: 'driving', driveTimeRemainingMin: 345, shiftTimeRemainingMin: 520, weeklyHoursUsed: 42.5, breakRequired: false, violations: [] });
  }

  async getLeaderboard(query: PaginationDto) {
    const { page = 1, limit = 20 } = query;
    const [data, total] = await this.repo.findAndCount({ order: { safetyScore: 'DESC' }, skip: (page - 1) * limit, take: limit });
    return paginated(data.map((d, i) => ({ rank: (page - 1) * limit + i + 1, driverId: d.id, name: `${d.firstName} ${d.lastName}`, safetyScore: d.safetyScore, efficiencyScore: d.efficiencyScore })), total, page, limit);
  }

  async getStats() {
    const total = await this.repo.count();
    const active = await this.repo.count({ where: { status: 'active' } });
    return success({ total, active, onLeave: total - active, avgSafetyScore: 87.5, avgEfficiencyScore: 82.3 });
  }
}
