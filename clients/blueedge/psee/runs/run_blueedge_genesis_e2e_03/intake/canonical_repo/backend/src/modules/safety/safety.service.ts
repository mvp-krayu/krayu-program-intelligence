import { Injectable } from '@nestjs/common';
import { success } from '../../common/dto';

@Injectable()
export class SafetyService {
  async getDashboard() { return success({ safetyScore: 88.5, accidents: 2, nearMisses: 15, violations: 8, trend: 'improving', daysSinceLastAccident: 23, topRisks: ['speeding', 'fatigue', 'harsh_braking'] }); }
  async getIncidents(q: any) { return success({ total: 42, thisMonth: 5, byType: { collision: 2, nearMiss: 15, violation: 25 }, items: [] }); }
  async getRiskAssessment() { return success({ fleetRisk: 'moderate', highRiskVehicles: 5, highRiskDrivers: 3, riskFactors: [{ factor: 'Night driving', score: 7.2 }, { factor: 'HAZMAT routes', score: 6.8 }] }); }
  async getVideoEvents(q: any) { return success({ total: 125, reviewed: 98, flagged: 15, items: [] }); }
  async createIncident(dto: any) { return success({ ...dto, id: 'inc-' + Date.now(), status: 'reported', reportedAt: new Date() }); }
  async getDriverSafety(driverId: string) { return success({ driverId, score: 85.3, events: [], recentAlerts: [], coaching: [] }); }
}
