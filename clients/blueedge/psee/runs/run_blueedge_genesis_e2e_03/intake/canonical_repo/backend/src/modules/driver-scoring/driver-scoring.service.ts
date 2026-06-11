import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class DriverScoringService extends BaseCrudService<DriverScore> {
  constructor(
    @InjectRepository(DriverScore) repo: Repository<DriverScore>,
    @InjectRepository(DrivingEvent) private eventRepo: Repository<DrivingEvent>,
    @InjectRepository(CoachingRecommendation) private coachRepo: Repository<CoachingRecommendation>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      fleetAverageScore: 82.4,
      scoreTrend: 'improving', // +2.1 from last month
      totalDrivers: 48,
      scoreDistribution: { excellent: 12, good: 21, average: 11, needsImprovement: 3, critical: 1 },
      scoreBands: { excellent: '90-100', good: '75-89', average: '60-74', needsImprovement: '40-59', critical: '0-39' },
      topPerformers: [
        { driverId: 'D001', name: 'أحمد محمد الهاشمي', score: 97.2, trend: 'stable', fleetType: 'tanker', trips: 142 },
        { driverId: 'D012', name: 'خالد عبدالله الكعبي', score: 95.8, trend: 'improving', fleetType: 'bus', trips: 198 },
        { driverId: 'D007', name: 'راشد سعيد المنصوري', score: 94.1, trend: 'stable', fleetType: 'taxi', trips: 312 },
      ],
      bottomPerformers: [
        { driverId: 'D034', name: 'سالم يوسف الشامسي', score: 52.3, trend: 'declining', fleetType: 'tanker', topIssue: 'Harsh braking' },
        { driverId: 'D041', name: 'عمر حسن المرزوقي', score: 61.4, trend: 'stable', fleetType: 'taxi', topIssue: 'Speeding' },
      ],
      eventSummary: {
        today: { total: 34, critical: 1, severe: 3, moderate: 12, minor: 18 },
        thisWeek: { total: 187, critical: 4, severe: 18, moderate: 67, minor: 98 },
        byType: { harsh_brake: 42, speeding: 38, rapid_accel: 31, sharp_turn: 28, tailgating: 22, phone_use: 8, lane_departure: 12, fatigue_detected: 6 },
      },
      coachingStats: { pending: 14, delivered: 23, completed: 89, improvementRate: 72 },
      scoringWeights: SCORING_WEIGHTS,
      monthlyTrend: [
        { month: 'Sep', avg: 78.2, events: 245, coaches: 32 },
        { month: 'Oct', avg: 79.5, events: 231, coaches: 28 },
        { month: 'Nov', avg: 80.1, events: 218, coaches: 25 },
        { month: 'Dec', avg: 81.3, events: 202, coaches: 22 },
        { month: 'Jan', avg: 81.9, events: 195, coaches: 19 },
        { month: 'Feb', avg: 82.4, events: 187, coaches: 14 },
      ],
    });
  }

  async getLeaderboard(period: string = 'weekly', fleetType?: string) {
    const drivers = [
      { rank: 1, driverId: 'D001', name: 'أحمد محمد الهاشمي', avatar: '👨‍✈️', fleetType: 'tanker', overall: 97.2, safety: 98.5, efficiency: 96.1, compliance: 97.8, customer: 95.4, trips: 28, events: 1, streak: 14, badge: '🏆 Fleet Champion' },
      { rank: 2, driverId: 'D012', name: 'خالد عبدالله الكعبي', avatar: '🚌', fleetType: 'bus', overall: 95.8, safety: 96.2, efficiency: 94.5, compliance: 97.1, customer: 94.8, trips: 42, events: 2, streak: 8, badge: '⭐ Safety Star' },
      { rank: 3, driverId: 'D007', name: 'راشد سعيد المنصوري', avatar: '🚕', fleetType: 'taxi', overall: 94.1, safety: 93.8, efficiency: 95.2, compliance: 94.5, customer: 92.4, trips: 65, events: 3, streak: 5, badge: '💎 Efficiency Expert' },
      { rank: 4, driverId: 'D003', name: 'محمد علي الفلاسي', avatar: '👨‍✈️', fleetType: 'tanker', overall: 91.7, safety: 92.4, efficiency: 90.1, compliance: 93.2, customer: 89.8, trips: 24, events: 4, streak: 3 },
      { rank: 5, driverId: 'D019', name: 'سعيد حمد النعيمي', avatar: '🚌', fleetType: 'bus', overall: 89.3, safety: 90.1, efficiency: 88.2, compliance: 91.5, customer: 86.7, trips: 38, events: 5, streak: 2 },
      { rank: 6, driverId: 'D025', name: 'عبدالله فهد الحبسي', avatar: '🚕', fleetType: 'taxi', overall: 87.6, safety: 86.9, efficiency: 89.1, compliance: 88.2, customer: 85.5, trips: 58, events: 7, streak: 0 },
      { rank: 7, driverId: 'D009', name: 'يوسف خالد الظاهري', avatar: '👨‍✈️', fleetType: 'tanker', overall: 85.2, safety: 84.8, efficiency: 86.5, compliance: 85.9, customer: 83.1, trips: 21, events: 8, streak: 0 },
      { rank: 8, driverId: 'D031', name: 'حمد سالم الكتبي', avatar: '🚌', fleetType: 'bus', overall: 82.8, safety: 81.5, efficiency: 84.2, compliance: 83.7, customer: 81.2, trips: 35, events: 11, streak: 0 },
    ];
    const filtered = fleetType && fleetType !== 'all' ? drivers.filter(d => d.fleetType === fleetType) : drivers;
    return success({ period, fleetType: fleetType || 'all', leaderboard: filtered, totalDrivers: 48 });
  }

  async getDriverProfile(driverId: string) {
    return success({
      driverId, name: 'أحمد محمد الهاشمي', fleetType: 'tanker', licenseClass: 'Heavy Vehicle + HAZMAT',
      currentScore: {
        overall: 97.2, safety: 98.5, efficiency: 96.1, compliance: 97.8, customer: 95.4,
        rank: 1, totalDrivers: 48, percentile: 98,
      },
      recentEvents: [
        { id: 'ev-001', type: 'speeding', severity: 'minor', impact: -2, speed: 105, limit: 100, location: 'E11 near Mall of the Emirates', time: new Date(Date.now() - 172800000) },
      ],
      scoreTrend: [
        { week: 'W1 Jan', overall: 96.8 }, { week: 'W2 Jan', overall: 97.1 },
        { week: 'W3 Jan', overall: 96.5 }, { week: 'W4 Jan', overall: 97.4 },
        { week: 'W1 Feb', overall: 97.0 }, { week: 'W2 Feb', overall: 97.2 },
      ],
      achievements: [
        { badge: '🏆 Fleet Champion', earnedAt: new Date(Date.now() - 30 * 86400000), description: '#1 overall score for 3 consecutive months' },
        { badge: '🛡️ Zero Incidents', earnedAt: new Date(Date.now() - 60 * 86400000), description: '90 days without a severe event' },
        { badge: '⛽ Fuel Master', earnedAt: new Date(Date.now() - 45 * 86400000), description: 'Top 5% fuel efficiency for 2 months' },
        { badge: '📋 Compliance Perfect', earnedAt: new Date(Date.now() - 15 * 86400000), description: '100% pre-trip inspection completion' },
      ],
      coachingHistory: [
        { id: 'c-001', category: 'efficiency', recommendation: 'Reduce idling time at delivery points — currently 12min avg vs fleet 8min', status: 'completed', impact: '+1.2 efficiency points' },
      ],
      stats: {
        totalTrips: 1842, totalKm: 245000, totalHours: 3200, avgTripScore: 96.8,
        eventsPerKkm: 0.4, fuelEfficiencyRating: 'A+', onTimeDelivery: 99.1,
      },
    });
  }

  async getDriverEvents(driverId: string, period?: string) {
    return success([
      { id: 'ev-001', driverId, vehicleId: 'V001', tripId: 'T-2001', eventType: 'speeding', severity: 'minor', scoreImpact: -2, speed: 105, speedLimit: 100, latitude: 25.1172, longitude: 55.2001, gForce: null, occurredAt: new Date(Date.now() - 172800000), location: 'E11 near MOE' },
      { id: 'ev-002', driverId, vehicleId: 'V001', tripId: 'T-1998', eventType: 'harsh_brake', severity: 'minor', scoreImpact: -1, speed: 78, speedLimit: 80, latitude: 25.0657, longitude: 55.1712, gForce: 0.45, occurredAt: new Date(Date.now() - 604800000), location: 'Jebel Ali Freeway exit' },
    ]);
  }

  async getCoachingRecommendations(driverId: string) {
    return success([
      { id: 'cr-001', driverId, category: 'safety', priority: 'medium', recommendation: 'Maintain 3-second following distance on Sheikh Zayed Rd during peak hours — GPS data shows avg 1.8s gap', evidence: '3 tailgating events in last 30 days', status: 'delivered' },
      { id: 'cr-002', driverId, category: 'efficiency', priority: 'low', recommendation: 'Use engine braking on Al Ain descent sections — reduces brake wear by estimated 15%', evidence: 'Digital twin simulation confirmed fuel saving of 3.2%', status: 'pending' },
    ]);
  }

  async recordEvent(body: any) {
    return success({
      eventId: `ev-${Date.now()}`, driverId: body.driverId, vehicleId: body.vehicleId,
      eventType: body.eventType, severity: body.severity,
      scoreImpact: EVENT_PENALTIES[body.eventType]?.[body.severity] || -1,
      recorded: true, timestamp: new Date(),
    });
  }

  async getScoreBreakdown(driverId: string) {
    return success({
      driverId, period: 'current_week',
      components: {
        safety: { score: 98.5, weight: 0.40, weightedScore: 39.4, events: [{ type: 'harsh_brake', count: 0, impact: 0 }, { type: 'speeding', count: 1, impact: -2 }] },
        efficiency: { score: 96.1, weight: 0.25, weightedScore: 24.0, factors: [{ metric: 'fuel_efficiency', rating: 97, target: 'A+' }, { metric: 'idle_time', rating: 92, target: '<10min' }] },
        compliance: { score: 97.8, weight: 0.20, weightedScore: 19.6, factors: [{ metric: 'pre_trip_inspection', completion: 100 }, { metric: 'hours_of_service', violations: 0 }, { metric: 'speed_compliance', rate: 98.2 }] },
        customer: { score: 95.4, weight: 0.15, weightedScore: 14.3, factors: [{ metric: 'on_time_delivery', rate: 99.1 }, { metric: 'cargo_handling', rating: 'excellent' }, { metric: 'customer_feedback', avg: 4.8 }] },
      },
      totalWeightedScore: 97.2,
      algorithm: 'weighted_composite_v2 with exponential decay on events (half-life: 14 days)',
    });
  }

  // ── Real-Time Score Calculation Engine ────────────────────────
  async calculateRealTimeScore(body: any) {
    const events = body.events || [];
    const WEIGHTS = { safety: 0.40, efficiency: 0.25, compliance: 0.20, customer: 0.15 };
    const EVENT_POINTS: Record<string, number> = {
      harsh_brake: -3, rapid_accel: -2, speeding: -5, sharp_turn: -2,
      phone_use: -15, fatigue: -10, lane_departure: -4, tailgating: -6,
    };
    let safetyBase = 100;
    events.forEach((e: any) => {
      const base = EVENT_POINTS[e.type] || -1;
      const severityMultiplier = e.severity === 'critical' ? 2.0 : e.severity === 'severe' ? 1.5 : 1.0;
      const contextMultiplier = e.isHazmat ? 1.5 : e.isSchoolZone ? 1.8 : e.isNightDriving ? 1.2 : 1.0;
      safetyBase += base * severityMultiplier * contextMultiplier;
    });
    safetyBase = Math.max(0, Math.min(100, safetyBase));
    const eff = body.efficiencyScore || 85;
    const comp = body.complianceScore || 90;
    const cust = body.customerScore || 80;
    const overall = safetyBase * WEIGHTS.safety + eff * WEIGHTS.efficiency + comp * WEIGHTS.compliance + cust * WEIGHTS.customer;
    return success({
      overall: Math.round(overall * 10) / 10,
      dimensions: { safety: Math.round(safetyBase * 10) / 10, efficiency: eff, compliance: comp, customer: cust },
      eventsProcessed: events.length,
      contextMultipliersApplied: events.filter((e: any) => e.isHazmat || e.isSchoolZone || e.isNightDriving).length,
      algorithm: 'weighted_composite_v2',
      calculatedAt: new Date().toISOString(),
    });
  }

  // ── Fleet-Wide Comparison ────────────────────────────────────
  async getFleetComparison() {
    return success({
      byFleetType: {
        tanker: { drivers: 18, avgOverall: 86.4, avgSafety: 84.2, avgEfficiency: 88.1, avgCompliance: 92.3, topPerformer: 'Ahmed Al-Rashid (92.4)', lowestPerformer: 'Saeed Al-Mansoori (76.3)' },
        bus: { drivers: 24, avgOverall: 83.8, avgSafety: 82.1, avgEfficiency: 84.5, avgCompliance: 90.7, topPerformer: 'Khalid Ibrahim (85.2)', lowestPerformer: 'Ali Hassan (71.8)' },
        taxi: { drivers: 20, avgOverall: 81.2, avgSafety: 79.8, avgEfficiency: 82.3, avgCompliance: 87.1, topPerformer: 'Omar Farid (81.6)', lowestPerformer: 'Rashid Saeed (68.4)' },
      },
      fleetWide: { avgOverall: 83.7, avgSafety: 82.0, avgEfficiency: 84.9, avgCompliance: 90.0, totalDrivers: 62 },
      insights: [
        'Tanker drivers score 5.2 points higher on compliance vs fleet average — HAZMAT training effectiveness validated',
        'Taxi drivers lag 3.8 points on safety — high frequency of speeding events on Al Khail Rd and SZR',
        'Bus driver efficiency declining 1.2 points/month — route 53 road conditions may be a factor',
        'Night shift drivers score 6.1 points lower on safety across all fleet types',
      ],
    });
  }

  // ── Incentive Optimization ───────────────────────────────────
  async getIncentiveOptimization() {
    return success({
      monthlyBudgetAed: 45000,
      optimizedAllocation: [
        { tier: 'Platinum (90+)', drivers: 8, bonusPerDriverAed: 2500, totalAed: 20000, impact: 'Retention of top performers — predicted 92% retention rate' },
        { tier: 'Gold (80-89)', drivers: 22, bonusPerDriverAed: 500, totalAed: 11000, impact: 'Motivate mid-range — predicted 4.2 point avg improvement' },
        { tier: 'Improvement (70-79)', drivers: 18, bonusPerDriverAed: 300, totalAed: 5400, impact: 'Training incentive — 67% will complete coaching modules' },
        { tier: 'Critical (<70)', drivers: 14, bonusPerDriverAed: 0, totalAed: 0, impact: 'Focus on coaching and compliance — bonuses after improvement' },
      ],
      unallocatedAed: 8600,
      recommendation: 'Redirect AED 8,600 to safety training for <70 tier. ROI model predicts 12.3 point average improvement over 3 months.',
      predictedFleetScoreImpact: '+3.7 points fleet-wide within 90 days',
      costPerPointImprovement: 'AED 1,216 per fleet-wide score point',
    });
  }

  // ── Risk Prediction ──────────────────────────────────────────
  async getRiskPrediction() {
    return success({
      atRiskDrivers: [
        { driverId: 'D005', name: 'Saeed Al-Mansoori', currentScore: 76.3, predictedScore30d: 72.1, riskLevel: 'high', factors: ['Declining trend: -2.1/mo for 3 months', 'Phone use: 3 events (zero tolerance for HAZMAT)', 'HOS violations increasing'], recommendedAction: 'Mandatory safety refresher + mentoring program' },
        { driverId: 'D004', name: 'Omar Farid', currentScore: 81.6, predictedScore30d: 78.4, riskLevel: 'medium', factors: ['Fatigue events increasing', 'Customer ratings declining', 'Speeding frequency above threshold'], recommendedAction: 'Shift schedule review + eco-driving coaching' },
        { driverId: 'D009', name: 'Ali Hassan', currentScore: 71.8, predictedScore30d: 69.2, riskLevel: 'critical', factors: ['Below minimum threshold', 'Pre-trip inspection compliance: 62%', 'Multiple route deviations'], recommendedAction: 'Performance improvement plan required — 30 day review' },
      ],
      modelAccuracy: 88.7,
      predictionHorizon: '30 days',
      lastUpdated: new Date().toISOString(),
    });
  }

  // ── Algorithm Configuration ──────────────────────────────────
  async getAlgorithmWeights() {
    return success({
      version: 'weighted_composite_v2',
      dimensions: {
        safety: { weight: 0.40, baseScore: 100, decayHalfLifeDays: 14, events: { harsh_brake: -3, rapid_accel: -2, speeding: -5, sharp_turn: -2, phone_use: -15, fatigue: -10, lane_departure: -4, tailgating: -6 } },
        efficiency: { weight: 0.25, baseScore: 100, metrics: ['fuel_consumption_vs_baseline', 'idle_time', 'route_adherence', 'eco_driving'] },
        compliance: { weight: 0.20, baseScore: 100, metrics: ['hos_adherence', 'pre_trip_inspection', 'permit_validity', 'training_completion'] },
        customer: { weight: 0.15, baseScore: 100, metrics: ['passenger_rating', 'on_time_delivery', 'complaint_count', 'professionalism'] },
      },
      contextMultipliers: {
        hazmat_cargo: 1.5, school_zone: 1.8, night_driving: 1.2, adverse_weather: 1.3, highway_speed: 1.1,
      },
      scorePeriods: { daily: 'rolling 24h', weekly: 'rolling 7d', monthly: 'calendar month' },
      gamification: { badges: 12, streakTypes: 3, leaderboardRefresh: '15 minutes' },
    });
  }
}

// ─── Controller ───────────────────────────────────────────────
