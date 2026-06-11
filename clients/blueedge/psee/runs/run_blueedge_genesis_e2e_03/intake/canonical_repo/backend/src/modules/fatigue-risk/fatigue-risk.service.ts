import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { FatigueAssessment } from './entities/fatigue-assessment.entity';

@Injectable()
export class FatigueRiskService extends BaseCrudService<FatigueAssessment> {
  constructor(@InjectRepository(FatigueAssessment) repo: Repository<FatigueAssessment>) { super(repo); }
  async getDashboard() {
    return success({
      activeDrivers: 45, highRisk: 3, mediumRisk: 8, lowRisk: 34,
      avgFatigueScore: 22.5, avgHoursOnDuty: 5.8,
      alerts: [
        { driverId: 'd1', name: 'Mohammed Al Farsi', riskScore: 78, level: 'high', reason: 'PERCLOS > 15%, 7.5 hours continuous driving', vehicle: 'DXB-4518', recommendation: 'Mandatory 30-minute rest break' },
        { driverId: 'd2', name: 'Saeed Al Maktoum', riskScore: 65, level: 'high', reason: 'Reaction time degraded 25%, microsleep event detected', vehicle: 'DXB-6677', recommendation: 'Immediate pullover and driver swap' },
        { driverId: 'd3', name: 'Youssef Hamdan', riskScore: 52, level: 'medium', reason: 'Night shift + 6 hours on duty, yawn frequency elevated', vehicle: 'DXB-3310', recommendation: 'Monitor closely, schedule rest in 1 hour' },
      ],
      biomarkerThresholds: { perclos: { warning: 8, critical: 15, unit: '%' }, reactionTime: { warning: 350, critical: 500, unit: 'ms' }, blinkRate: { warning: 25, critical: 40, unit: 'per min' } },
    });
  }
  async getDriverRisk(driverId: string) {
    return success({ driverId, currentScore: 22, level: 'low', perclos: 3.2, reactionTimeMs: 280, blinkRate: 18, hoursOnDuty: 4.5, hoursSinceRest: 4.5, sleepQualityLastNight: 'good', shiftType: 'day', trend: 'stable', nextAssessment: '30 min' });
  }
  async getHistoricalTrends(driverId: string) {
    return success({ driverId, last7Days: Array.from({ length: 7 }, (_, i) => ({ date: new Date(Date.now() - i * 86400000), avgScore: 15 + Math.random() * 20, maxScore: 25 + Math.random() * 30, hoursWorked: 7 + Math.random() * 2 })) });
  }
}
