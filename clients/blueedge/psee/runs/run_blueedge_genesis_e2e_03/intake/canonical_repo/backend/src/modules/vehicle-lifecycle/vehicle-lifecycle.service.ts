import { Injectable, Logger } from '@nestjs/common';
import { success } from '../../common/dto';
import { DriverSessionsService } from '../driver-sessions/driver-sessions.service';

/**
 * VehicleLifecycleService — Cross-Module Aggregation Intelligence
 *
 * This module does NOT own data. It synthesizes data from 15+ existing modules
 * to produce the Vehicle 360° Lifecycle view. Think of it as the "brain"
 * that connects fuel, maintenance, drivers, costs, and predictions.
 *
 * In production, each method would call the respective module's service.
 * Here we provide the aggregation logic with realistic mock data.
 */

// ─── TCO Configuration ────────────────────────────────────────
interface TCOConfig {
  fuelPricePerL: number;
  insuranceAnnualAED: number;
  tiresAnnualAED: number;
  registrationAnnualAED: number;
  salikTollsAnnualAED: number;
  downtimeCostPerHourAED: number;
  depreciationMethod: 'straight_line' | 'declining_balance';
}

const DEFAULT_TCO_CONFIG: TCOConfig = {
  fuelPricePerL: 2.85,
  insuranceAnnualAED: 12800,
  tiresAnnualAED: 8400,
  registrationAnnualAED: 3200,
  salikTollsAnnualAED: 14600,
  downtimeCostPerHourAED: 85,
  depreciationMethod: 'declining_balance',
};

// ─── AI Recommendation Priority ───────────────────────────────
type AIPriority = 'critical' | 'high' | 'medium' | 'low';
type AICategory = 'Driver' | 'Maintenance' | 'Financial' | 'Fuel' | 'Operational' | 'Insurance' | 'Safety';

interface AIRecommendation {
  id: string;
  priority: AIPriority;
  category: AICategory;
  title: string;
  description: string;
  impactAED: number;
  confidencePct: number;
  actionType: 'work_order' | 'driver_reassign' | 'driver_training' | 'sell_vehicle' | 'reroute' | 'insurance_negotiate' | 'award' | 'investigate';
}

@Injectable()
export class VehicleLifecycleService {
  private readonly logger = new Logger(VehicleLifecycleService.name);

  constructor(
    private driverSessionsSvc: DriverSessionsService,
  ) {}

  // ═══════════════════════════════════════════════════════════════
  // VEHICLE 360° SUMMARY
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get complete 360° view of a vehicle.
   * In production, this calls VehiclesService, FuelService, MaintenanceService, etc.
   * Returns unified JSON that feeds the frontend's 8-tab view.
   */
  async getVehicle360(vehicleId: string) {
    // In production: parallel calls to all dependent modules
    // const [vehicle, fuel, maintenance, dtcs, sessions] = await Promise.all([
    //   this.vehiclesSvc.findOne(vehicleId),
    //   this.fuelSvc.getVehicleSummary(vehicleId),
    //   this.maintenanceSvc.getVehicleHistory(vehicleId),
    //   this.diagnosticsSvc.getActiveDTCs(vehicleId),
    //   this.driverSessionsSvc.findByVehicle(vehicleId, { page: 1, limit: 20 }),
    // ]);

    // For now, return aggregated mock that matches frontend expectations
    const driverDWVS = await this.driverSessionsSvc.computeVehicleDWVS(vehicleId);
    const activeSession = await this.driverSessionsSvc.getActiveSession(vehicleId);

    return success({
      vehicleId,
      generated: new Date().toISOString(),
      activeSession: activeSession.data,
      driverAttribution: driverDWVS.data,
      // Other sections would come from respective modules:
      // identity: vehicle.data,
      // fuelIntelligence: fuel.data,
      // serviceLifecycle: maintenance.data,
      // activeDTCs: dtcs.data,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // TCO COMPUTATION ENGINE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Compute Total Cost of Ownership for a vehicle.
   *
   * TCO = Acquisition(amortized) + Fuel + Maintenance(sched+unsched) +
   *       Insurance + Tires + Registration + Tolls + Downtime + Depreciation
   *
   * Returns breakdown per category and per-km cost.
   */
  async computeTCO(vehicleId: string, config?: Partial<TCOConfig>) {
    const cfg = { ...DEFAULT_TCO_CONFIG, ...config };

    // In production, these come from respective modules
    // Here we use realistic aggregated values for a 3-year-old Volvo FH 460
    const vehicle = {
      acquisitionCostAED: 485000,
      acquisitionDate: new Date('2023-03-15'),
      currentOdometer: 344000,
      engineHours: 7720,
    };

    const ageMonths = Math.round((Date.now() - vehicle.acquisitionDate.getTime()) / (30.44 * 86400000));
    const ageYears = ageMonths / 12;

    // In production: this.fuelSvc.getTotalCost(vehicleId)
    const fuelTotalAED = 410253;
    // In production: this.maintenanceSvc.getTotalCost(vehicleId)
    const maintenanceScheduledAED = 42200;
    const maintenanceUnscheduledAED = 26200;
    // In production: this.vehiclesSvc.getDowntimeHours(vehicleId)
    const downtimeHours = 248;

    const tcoBreakdown = {
      acquisition: vehicle.acquisitionCostAED,
      fuel: fuelTotalAED,
      maintenanceScheduled: maintenanceScheduledAED,
      maintenanceUnscheduled: maintenanceUnscheduledAED,
      insurance: Math.round(cfg.insuranceAnnualAED * ageYears),
      tires: Math.round(cfg.tiresAnnualAED * ageYears),
      registrationTolls: Math.round((cfg.registrationAnnualAED + cfg.salikTollsAnnualAED) * ageYears),
      downtime: Math.round(downtimeHours * cfg.downtimeCostPerHourAED),
    };

    const tcoTotal = Object.values(tcoBreakdown).reduce((s, v) => s + v, 0);
    const costPerKm = vehicle.currentOdometer > 0 ? Math.round(tcoTotal / vehicle.currentOdometer * 100) / 100 : 0;

    // Depreciation: declining balance method (20% per year for heavy trucks)
    const depRate = 0.20;
    const residualValue = Math.round(vehicle.acquisitionCostAED * Math.pow(1 - depRate, ageYears));
    const monthlyDepreciation = Math.round((vehicle.acquisitionCostAED - residualValue) / ageMonths);

    // 3-year and 5-year projections
    const annualCostRate = (tcoTotal - vehicle.acquisitionCostAED) / ageYears;
    const tco3Year = Math.round(vehicle.acquisitionCostAED + annualCostRate * 3 * 1.05); // 5% annual increase
    const tco5Year = Math.round(vehicle.acquisitionCostAED + annualCostRate * 5 * 1.12); // 12% increase (aging curve)

    // Break-even analysis
    const replacementCost = Math.round(vehicle.acquisitionCostAED * 1.08); // New model ~8% more
    const monthlyKeepCost = Math.round(annualCostRate / 12);
    const breakEvenMonths = residualValue > 0
      ? Math.round((replacementCost - residualValue) / monthlyKeepCost)
      : ageMonths;

    return success({
      vehicleId,
      ageMonths,
      currentOdometer: vehicle.currentOdometer,
      tcoBreakdown,
      tcoTotal: Math.round(tcoTotal),
      costPerKm,
      residualValueAED: residualValue,
      monthlyDepreciation,
      tco3YearProjection: tco3Year,
      tco5YearProjection: tco5Year,
      breakEvenMonths,
      recommendation: ageMonths < breakEvenMonths ? 'KEEP' : 'EVALUATE_REPLACEMENT',
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // FLEET RANKING ENGINE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Compute a vehicle's ranking across the fleet on multiple KPIs.
   * Returns percentile position for each KPI.
   */
  async computeFleetRanking(vehicleId: string) {
    // In production: query all vehicles, compute rankings
    // This would use TimescaleDB materialized views for performance

    const rankings = {
      fuelEfficiency: { rank: 8, total: 150, percentile: 95 },
      maintenanceCost: { rank: 12, total: 150, percentile: 92 },
      uptime: { rank: 18, total: 150, percentile: 88 },
      safetyScore: { rank: 22, total: 150, percentile: 85 },
      driverDWVS: { rank: 31, total: 150, percentile: 79 },
      tcoPerKm: { rank: 15, total: 150, percentile: 90 },
    };

    // Same-model comparison
    const sameModel = {
      rank: 3, total: 18,
      costPerKmThis: 2.45, costPerKmAvg: 2.68,
      delta: -8.6, // percent better than avg
    };

    // Fleet contribution score: is this vehicle above or below fleet average?
    const fleetContribution = +2.4; // positive = contributing positively

    return success({
      vehicleId,
      overallRank: rankings.fuelEfficiency.rank,
      fleetSize: 150,
      rankings,
      sameModel,
      fleetContributionPct: fleetContribution,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // AI RECOMMENDATION ENGINE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Generate AI recommendations for a vehicle.
   * Uses rule-based logic with threshold triggers across all data domains.
   * In production, this would integrate with the AgenticAI module.
   */
  async generateRecommendations(vehicleId: string): Promise<{ success: boolean; data: AIRecommendation[] }> {
    const recommendations: AIRecommendation[] = [];

    // In production, each rule evaluates real data
    // Rule 1: High-DWVS driver detection
    const driverDWVS = await this.driverSessionsSvc.computeVehicleDWVS(vehicleId);
    if (driverDWVS.data) {
      for (const driver of driverDWVS.data as any[]) {
        if (driver.dwvs > 0.7) {
          recommendations.push({
            id: `rec-driver-${driver.driverId}`,
            priority: 'critical',
            category: 'Driver',
            title: `Reassign high-variance driver from this vehicle`,
            description: `DWVS of ${driver.dwvs} indicates erratic driving pattern causing accelerated wear. RPM variance ${driver.avgRpmVariance} is ${Math.round(driver.avgRpmVariance / 18000)}× fleet average.`,
            impactAED: Math.round(driver.dwvs * 30000),
            confidencePct: Math.min(94, 60 + driver.blockCount),
            actionType: 'driver_reassign',
          });
        } else if (driver.dwvs < 0.3 && driver.blockCount > 100) {
          recommendations.push({
            id: `rec-award-${driver.driverId}`,
            priority: 'low',
            category: 'Driver',
            title: `Award top-performing driver`,
            description: `DWVS of ${driver.dwvs} (excellent). Estimated value preservation of ${Math.round((0.5 - driver.dwvs) * 15000)} AED/year.`,
            impactAED: Math.round((0.5 - driver.dwvs) * 15000),
            confidencePct: 96,
            actionType: 'award',
          });
        }
      }
    }

    // Rule 2: Predictive maintenance trigger
    // In production: this.predictiveMaintenanceSvc.getNextFailurePrediction(vehicleId)
    recommendations.push({
      id: `rec-maint-dpf`,
      priority: 'high',
      category: 'Maintenance',
      title: 'Schedule DPF deep clean within 30 days',
      description: 'Predictive model shows 67% probability of DPF failure within 45 days based on P2002 recurrence pattern and soot accumulation rate. Proactive service costs 2,800 AED vs. 8,500 AED emergency.',
      impactAED: 5700,
      confidencePct: 87,
      actionType: 'work_order',
    });

    // Rule 3: Resale timing optimization
    // In production: this.marketDataSvc.getResaleProjection(vehicleId)
    recommendations.push({
      id: `rec-resale-timing`,
      priority: 'high',
      category: 'Financial',
      title: 'Optimal resale window: Q3 2026',
      description: 'Market analysis shows Volvo FH 460 resale values peak in Q3 due to seasonal demand. Current trajectory: 312,000 AED in Q3 vs. 285,000 AED in Q4.',
      impactAED: 27000,
      confidencePct: 78,
      actionType: 'sell_vehicle',
    });

    // Rule 4: Fuel anomaly detection
    // In production: this.anomalyDetectionSvc.getFuelAnomalies(vehicleId)
    recommendations.push({
      id: `rec-fuel-anomaly`,
      priority: 'medium',
      category: 'Fuel',
      title: 'Investigate fuel anomaly — potential theft',
      description: '42L fuel drop at non-station GPS coordinates during driver session. No engine running. Review dashcam footage.',
      impactAED: 120,
      confidencePct: 82,
      actionType: 'investigate',
    });

    // Rule 5: Route optimization
    recommendations.push({
      id: `rec-route-opt`,
      priority: 'medium',
      category: 'Operational',
      title: 'Reroute via Sheikh Zayed Road for 8% fuel savings',
      description: 'Analysis of session blocks shows current primary route consumes 8.3% more fuel due to elevation changes and traffic patterns.',
      impactAED: 4200,
      confidencePct: 91,
      actionType: 'reroute',
    });

    // Rule 6: Insurance negotiation
    recommendations.push({
      id: `rec-insurance`,
      priority: 'medium',
      category: 'Insurance',
      title: 'Negotiate premium reduction with measured driver data',
      description: 'Fleet DWVS is in bottom 15th percentile. TPM-signed session blocks provide auditable proof.',
      impactAED: 1280,
      confidencePct: 73,
      actionType: 'insurance_negotiate',
    });

    // Sort by priority
    const priorityOrder: Record<AIPriority, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    return success(recommendations);
  }

  // ═══════════════════════════════════════════════════════════════
  // DRIVER-VEHICLE ATTRIBUTION SUMMARY
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get driver attribution matrix for a vehicle.
   * Shows each driver's contribution to vehicle wear and TCO.
   */
  async getDriverAttribution(vehicleId: string) {
    const dwvsResults = await this.driverSessionsSvc.computeVehicleDWVS(vehicleId);

    // Compute depreciation impact per driver
    // In production, this uses the gradient descent model:
    // ∂(Residual_Value) / ∂(DWVS) = depreciation sensitivity
    const baseDepreciationPerKm = 0.55; // AED/km average fleet depreciation
    const drivers = ((dwvsResults.data || []) as any[]).map(d => {
      // Higher DWVS = more wear per km
      const wearMultiplier = 1 + (d.dwvs - 0.5) * 2; // DWVS 0.5 = baseline
      const actualDepPerKm = baseDepreciationPerKm * wearMultiplier;
      const annualKm = d.totalKm / (d.totalHours / (8 * 250)) || 0; // est. annual km
      const annualImpact = Math.round((actualDepPerKm - baseDepreciationPerKm) * annualKm);

      return {
        ...d,
        kmPct: d.totalKm, // will be calculated as percentage on frontend
        depreciationPerKm: Math.round(actualDepPerKm * 100) / 100,
        annualDepreciationImpactAED: annualImpact,
        netEffect: annualImpact <= 0 ? 'value_preserved' : 'accelerated_wear',
      };
    });

    return success({
      vehicleId,
      totalDrivers: drivers.length,
      drivers,
      weightedDWVS: drivers.length > 0
        ? Math.round(drivers.reduce((s, d) => s + d.dwvs * d.totalKm, 0) / drivers.reduce((s, d) => s + d.totalKm, 0) * 1000) / 1000
        : 0,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // MAINTENANCE QUALITY ANALYSIS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Compute maintenance quality score for a vehicle.
   * Based on: on-time rate, first-time-fix rate, repeat DTC rate.
   */
  async getMaintenanceQuality(vehicleId: string) {
    // In production: this.maintenanceSvc.getHistory(vehicleId)
    // and this.diagnosticsSvc.getRepeatDTCs(vehicleId)
    return success({
      vehicleId,
      onTimeRate: 66.7, // 4 of 6 services on time
      firstTimeFixRate: 83.3, // 5 of 6 first-time fixes
      repeatDTCRate: 16.7, // 1 DTC returned within 30 days
      overallQualityScore: 91.2,
      totalServices: 6,
      scheduledPct: 33.3,
      predictivePct: 16.7,
      unscheduledPct: 33.3,
      regulatoryPct: 16.7,
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // FUEL INTELLIGENCE
  // ═══════════════════════════════════════════════════════════════

  /**
   * Get fuel intelligence for a vehicle including driver comparison.
   */
  async getFuelIntelligence(vehicleId: string) {
    // In production: this.fuelSvc.getVehicleSummary(vehicleId)
    // Cross-referenced with driver session blocks for per-driver efficiency
    return success({
      vehicleId,
      avgLPer100km: 41.8,
      baselineLPer100km: 41.8, // manufacturer expected
      totalFuelCostAED: 410253,
      costPerKmFuel: 1.19,
      anomaliesDetected: 1,
      driverFuelEfficiency: [
        { driverId: 'DRV-047', name: 'Mohammed Al-Rashid', avgLPer100km: 40.0, deltaVsBaseline: -4.2, sessions: 847 },
        { driverId: 'DRV-091', name: 'Ahmed Hassan', avgLPer100km: 41.0, deltaVsBaseline: -1.8, sessions: 423 },
        { driverId: 'DRV-023', name: 'Khalid Ibrahim', avgLPer100km: 44.0, deltaVsBaseline: +5.6, sessions: 612 },
        { driverId: 'DRV-156', name: 'Omar Al-Farsi', avgLPer100km: 45.0, deltaVsBaseline: +8.2, sessions: 218 },
      ],
    });
  }
}
