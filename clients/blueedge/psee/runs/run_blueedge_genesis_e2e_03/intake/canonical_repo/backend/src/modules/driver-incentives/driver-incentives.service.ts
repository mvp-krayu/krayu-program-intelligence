import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { IncentiveProgram } from './entities/incentive-program.entity';

@Injectable()
export class DriverIncentivesService extends BaseCrudService<IncentiveProgram> {
  constructor(@InjectRepository(IncentiveProgram) repo: Repository<IncentiveProgram>) { super(repo); }

  async getActivePrograms() {
    return success([
      { id: 'p1', name: 'Peak Hour Champion', type: 'streak', rewardAmount: 150, criteria: { minTrips: 8, timeWindow: '17:00-21:00' }, participants: 45, completions: 28, status: 'active' },
      { id: 'p2', name: 'Perfect Rating Week', type: 'quality', rewardAmount: 300, criteria: { minRating: 4.9, minTrips: 30 }, participants: 120, completions: 67, status: 'active' },
      { id: 'p3', name: 'Airport Express Bonus', type: 'zone', rewardAmount: 25, criteria: { zone: 'DXB Airport', perTrip: true }, participants: 38, completions: 156, status: 'active' },
      { id: 'p4', name: 'Fuel Efficiency Star', type: 'performance', rewardAmount: 200, criteria: { fuelEfficiencyTarget: '< 8L/100km' }, participants: 85, completions: 42, status: 'active' },
      { id: 'p5', name: 'Safety First (Zero Incidents)', type: 'safety', rewardAmount: 500, criteria: { zeroIncidents: true, period: 'monthly' }, participants: 200, completions: 178, status: 'active' },
    ]);
  }

  async getLeaderboard() {
    return success([
      { rank: 1, driverId: 'd1', name: 'Ahmed Al Rashid', score: 2450, earnings: 1850, streak: 12, trips: 245, rating: 4.95 },
      { rank: 2, driverId: 'd2', name: 'Fatima Al Zahra', score: 2380, earnings: 1720, streak: 10, trips: 232, rating: 4.98 },
      { rank: 3, driverId: 'd3', name: 'Omar Hassan', score: 2210, earnings: 1650, streak: 8, trips: 218, rating: 4.92 },
      { rank: 4, driverId: 'd4', name: 'Khalid bin Saeed', score: 2050, earnings: 1480, streak: 7, trips: 198, rating: 4.88 },
      { rank: 5, driverId: 'd5', name: 'Ibrahim Al Suwaidi', score: 1980, earnings: 1350, streak: 5, trips: 187, rating: 4.85 },
    ]);
  }

  async getPayoutSummary() {
    return success({ totalPaid: 45200, totalEarned: 52800, pendingPayout: 7600, currency: 'AED', period: 'January 2026', avgPerDriver: 264, topEarner: { name: 'Ahmed Al Rashid', amount: 1850 } });
  }

  async getDriverIncentiveStatus(driverId: string) {
    return success({ driverId, activePrograms: 4, completedThisMonth: 3, totalEarningsAed: 725, currentStreak: 5, nextMilestone: { program: 'Peak Hour Champion', remaining: 3, reward: 150 } });
  }
}
