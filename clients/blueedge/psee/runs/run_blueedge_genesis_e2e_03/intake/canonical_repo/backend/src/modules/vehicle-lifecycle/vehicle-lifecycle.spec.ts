// ══════════════════════════════════════════════════════════════
// Vehicle Lifecycle Module — Comprehensive Unit Tests
// TCO computation, fleet ranking, AI recommendations, attribution
// ══════════════════════════════════════════════════════════════
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VehicleLifecycleService } from './vehicle-lifecycle.service';
import { VehicleLifecycleController } from './vehicle-lifecycle.controller';
import { DriverSessionsService } from '../driver-sessions/driver-sessions.service';
import { DriverSessionBlock } from '../driver-sessions/entities/driver-session-block.entity';
import { createMockRepository } from '../../test/test-utils';

describe('VehicleLifecycleModule', () => {
  let controller: VehicleLifecycleController;
  let service: VehicleLifecycleService;
  let driverSessionsSvc: DriverSessionsService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleLifecycleController],
      providers: [
        VehicleLifecycleService,
        DriverSessionsService,
        { provide: getRepositoryToken(DriverSessionBlock), useValue: mockRepo },
      ],
    }).compile();
    controller = module.get(VehicleLifecycleController);
    service = module.get(VehicleLifecycleService);
    driverSessionsSvc = module.get(DriverSessionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // ─── TCO Computation ────────────────────────────────────────

  describe('computeTCO', () => {
    it('returns TCO breakdown with all cost categories', async () => {
      const result = await service.computeTCO('veh-1');
      expect(result.data).toBeDefined();
      expect(result.data.tcoBreakdown).toBeDefined();
      expect(result.data.tcoBreakdown.acquisition).toBe(485000);
      expect(result.data.tcoBreakdown.fuel).toBe(410253);
      expect(result.data.tcoBreakdown.maintenanceScheduled).toBeDefined();
      expect(result.data.tcoBreakdown.maintenanceUnscheduled).toBeDefined();
      expect(result.data.tcoBreakdown.insurance).toBeDefined();
      expect(result.data.tcoBreakdown.tires).toBeDefined();
      expect(result.data.tcoBreakdown.registrationTolls).toBeDefined();
      expect(result.data.tcoBreakdown.downtime).toBeDefined();
    });

    it('computes positive TCO total', async () => {
      const result = await service.computeTCO('veh-1');
      expect(result.data.tcoTotal).toBeGreaterThan(0);
      expect(result.data.tcoTotal).toBeGreaterThan(result.data.tcoBreakdown.acquisition);
    });

    it('computes cost per km', async () => {
      const result = await service.computeTCO('veh-1');
      expect(result.data.costPerKm).toBeGreaterThan(0);
      expect(result.data.costPerKm).toBeLessThan(10); // sanity check
    });

    it('computes 3-year and 5-year projections', async () => {
      const result = await service.computeTCO('veh-1');
      expect(result.data.tco3YearProjection).toBeGreaterThan(0);
      expect(result.data.tco5YearProjection).toBeGreaterThan(result.data.tco3YearProjection);
    });

    it('computes residual value', async () => {
      const result = await service.computeTCO('veh-1');
      expect(result.data.residualValueAED).toBeGreaterThan(0);
      expect(result.data.residualValueAED).toBeLessThan(485000); // less than acquisition
    });

    it('computes break-even months', async () => {
      const result = await service.computeTCO('veh-1');
      expect(result.data.breakEvenMonths).toBeGreaterThan(0);
    });

    it('returns keep/evaluate recommendation', async () => {
      const result = await service.computeTCO('veh-1');
      expect(['KEEP', 'EVALUATE_REPLACEMENT']).toContain(result.data.recommendation);
    });

    it('accepts custom fuel price override', async () => {
      const result = await service.computeTCO('veh-1', { fuelPricePerL: 3.50 });
      expect(result.data).toBeDefined();
    });
  });

  // ─── Fleet Ranking ──────────────────────────────────────────

  describe('computeFleetRanking', () => {
    it('returns rankings for 6 KPIs', async () => {
      const result = await service.computeFleetRanking('veh-1');
      expect(result.data.rankings).toBeDefined();
      expect(result.data.rankings.fuelEfficiency).toBeDefined();
      expect(result.data.rankings.maintenanceCost).toBeDefined();
      expect(result.data.rankings.uptime).toBeDefined();
      expect(result.data.rankings.safetyScore).toBeDefined();
      expect(result.data.rankings.driverDWVS).toBeDefined();
      expect(result.data.rankings.tcoPerKm).toBeDefined();
    });

    it('each ranking has rank, total, and percentile', async () => {
      const result = await service.computeFleetRanking('veh-1');
      for (const kpi of Object.values(result.data.rankings)) {
        expect(kpi).toHaveProperty('rank');
        expect(kpi).toHaveProperty('total');
        expect(kpi).toHaveProperty('percentile');
        expect(kpi.rank).toBeGreaterThan(0);
        expect(kpi.percentile).toBeGreaterThan(0);
        expect(kpi.percentile).toBeLessThanOrEqual(100);
      }
    });

    it('returns same-model comparison', async () => {
      const result = await service.computeFleetRanking('veh-1');
      expect(result.data.sameModel).toBeDefined();
      expect(result.data.sameModel.rank).toBeDefined();
      expect(result.data.sameModel.total).toBeDefined();
    });
  });

  // ─── AI Recommendations ─────────────────────────────────────

  describe('generateRecommendations', () => {
    beforeEach(() => {
      // Mock DWVS computation
      mockRepo.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      });
    });

    it('returns array of recommendations', async () => {
      const result = await service.generateRecommendations('veh-1');
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data.length).toBeGreaterThan(0);
    });

    it('each recommendation has required fields', async () => {
      const result = await service.generateRecommendations('veh-1');
      for (const rec of result.data) {
        expect(rec.id).toBeDefined();
        expect(rec.priority).toBeDefined();
        expect(rec.category).toBeDefined();
        expect(rec.title).toBeDefined();
        expect(rec.description).toBeDefined();
        expect(rec.impactAED).toBeDefined();
        expect(rec.confidencePct).toBeDefined();
        expect(rec.confidencePct).toBeGreaterThan(0);
        expect(rec.confidencePct).toBeLessThanOrEqual(100);
      }
    });

    it('recommendations are sorted by priority', async () => {
      const result = await service.generateRecommendations('veh-1');
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      for (let i = 1; i < result.data.length; i++) {
        expect(priorityOrder[result.data[i].priority])
          .toBeGreaterThanOrEqual(priorityOrder[result.data[i - 1].priority]);
      }
    });

    it('includes multiple categories', async () => {
      const result = await service.generateRecommendations('veh-1');
      const categories = new Set(result.data.map(r => r.category));
      expect(categories.size).toBeGreaterThanOrEqual(3);
    });
  });

  // ─── Driver Attribution ─────────────────────────────────────

  describe('getDriverAttribution', () => {
    beforeEach(() => {
      mockRepo.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      });
    });

    it('returns attribution with weighted DWVS', async () => {
      const result = await service.getDriverAttribution('veh-1');
      expect(result.data.vehicleId).toBe('veh-1');
      expect(result.data.weightedDWVS).toBeDefined();
      expect(result.data.totalDrivers).toBeDefined();
    });
  });

  // ─── Maintenance Quality ────────────────────────────────────

  describe('getMaintenanceQuality', () => {
    it('returns quality metrics', async () => {
      const result = await service.getMaintenanceQuality('veh-1');
      expect(result.data.onTimeRate).toBeDefined();
      expect(result.data.firstTimeFixRate).toBeDefined();
      expect(result.data.overallQualityScore).toBeDefined();
      expect(result.data.overallQualityScore).toBeGreaterThan(0);
      expect(result.data.overallQualityScore).toBeLessThanOrEqual(100);
    });
  });

  // ─── Fuel Intelligence ──────────────────────────────────────

  describe('getFuelIntelligence', () => {
    it('returns fuel summary with driver comparison', async () => {
      const result = await service.getFuelIntelligence('veh-1');
      expect(result.data.avgLPer100km).toBeDefined();
      expect(result.data.driverFuelEfficiency).toBeDefined();
      expect(result.data.driverFuelEfficiency.length).toBeGreaterThan(0);
    });

    it('driver efficiency entries have required fields', async () => {
      const result = await service.getFuelIntelligence('veh-1');
      for (const d of result.data.driverFuelEfficiency) {
        expect(d.driverId).toBeDefined();
        expect(d.name).toBeDefined();
        expect(d.avgLPer100km).toBeGreaterThan(0);
        expect(d.deltaVsBaseline).toBeDefined();
      }
    });
  });

  // ─── Controller Routing ─────────────────────────────────────

  describe('Controller endpoints', () => {
    beforeEach(() => {
      mockRepo.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([]),
      });
    });

    it('getVehicle360 calls service', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      const result = await controller.getVehicle360('veh-1');
      expect(result.data.vehicleId).toBe('veh-1');
    });

    it('computeTCO calls service', async () => {
      const result = await controller.computeTCO('veh-1');
      expect(result.data.tcoTotal).toBeGreaterThan(0);
    });

    it('getFleetRanking calls service', async () => {
      const result = await controller.getFleetRanking('veh-1');
      expect(result.data.rankings).toBeDefined();
    });

    it('getRecommendations calls service', async () => {
      const result = await controller.getRecommendations('veh-1');
      expect(Array.isArray(result.data)).toBe(true);
    });
  });
});
