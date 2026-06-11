import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InsuranceService } from './insurance.service';
import { InsurancePolicy } from './entities/insurance-policy.entity';

function createMockRepository() {
  return { find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(), count: jest.fn() };
}

describe('InsuranceService', () => {
  let service: InsuranceService;
  let repo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    repo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InsuranceService,
        { provide: getRepositoryToken(InsurancePolicy), useValue: repo },
      ],
    }).compile();
    service = module.get<InsuranceService>(InsuranceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ── findAll ──────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated policies', async () => {
      const result = await service.findAll({});
      expect(result.data).toBeDefined();
      expect(result.total).toBeGreaterThan(0);
      expect(result.page).toBe(1);
    });

    it('should filter by status', async () => {
      const result = await service.findAll({ status: 'active' });
      result.data.forEach(p => expect(p.status).toBe('active'));
    });

    it('should filter by vehicleId', async () => {
      const result = await service.findAll({ vehicleId: 'TK-0847' });
      result.data.forEach(p => expect(p.vehicleId).toBe('TK-0847'));
    });

    it('should paginate correctly', async () => {
      const result = await service.findAll({ page: 1, limit: 2 });
      expect(result.data.length).toBeLessThanOrEqual(2);
    });
  });

  // ── findOne ──────────────────────────────────────────────
  describe('findOne', () => {
    it('should return a single policy', async () => {
      const result = await service.findOne('ins-001');
      expect(result).toBeDefined();
      expect(result.policyNumber).toBe('EI-FL-2025-001');
    });

    it('should throw NotFoundException for invalid ID', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow();
    });
  });

  // ── findByVehicle ────────────────────────────────────────
  describe('findByVehicle', () => {
    it('should return policies for a vehicle', async () => {
      const result = await service.findByVehicle('TK-0847');
      expect(result.length).toBeGreaterThan(0);
      result.forEach(p => expect(p.vehicleId).toBe('TK-0847'));
    });
  });

  // ── computePremium ───────────────────────────────────────
  describe('computePremium', () => {
    it('should compute premium with excellent DWVS discount', () => {
      const result = service.computePremium({
        vehicleId: 'TK-0847', avgDwvs: 0.22, tpmSignedBlocks: 280, totalBlocks: 285,
        fleetAvgDwvs: 0.35, harshEventRate: 0.08, dtcRate: 0.02, totalKm: 38000, sessionCount: 142,
      });
      expect(result.dwvsDiscount).toBe(0.15);
      expect(result.finalPremiumAED).toBeLessThan(result.basePremiumAED);
      expect(result.savingsPct).toBeGreaterThan(0);
    });

    it('should compute premium with good DWVS discount', () => {
      const result = service.computePremium({
        vehicleId: 'BUS-305', avgDwvs: 0.42, tpmSignedBlocks: 250, totalBlocks: 298,
        fleetAvgDwvs: 0.42, harshEventRate: 0.15, dtcRate: 0.05, totalKm: 44000, sessionCount: 298,
      });
      expect(result.dwvsDiscount).toBe(0.10);
    });

    it('should apply TPM bonus for >95% coverage', () => {
      const result = service.computePremium({
        vehicleId: 'TK-0847', avgDwvs: 0.30, tpmSignedBlocks: 280, totalBlocks: 285,
        fleetAvgDwvs: 0.40, harshEventRate: 0.10, dtcRate: 0.03, totalKm: 50000, sessionCount: 285,
      });
      expect(result.tpmBonus).toBe(0.05);
    });

    it('should apply fleet discount for low fleet avg DWVS', () => {
      const result = service.computePremium({
        vehicleId: 'TX-5501', avgDwvs: 0.35, tpmSignedBlocks: 400, totalBlocks: 410,
        fleetAvgDwvs: 0.35, harshEventRate: 0.12, dtcRate: 0.04, totalKm: 90000, sessionCount: 410,
      });
      expect(result.fleetDiscount).toBe(0.03);
    });

    it('should apply surcharge for poor DWVS', () => {
      const result = service.computePremium({
        vehicleId: 'BUS-201', avgDwvs: 0.82, tpmSignedBlocks: 300, totalBlocks: 342,
        fleetAvgDwvs: 0.50, harshEventRate: 0.40, dtcRate: 0.15, totalKm: 30000, sessionCount: 342,
      });
      expect(result.dwvsDiscount).toBe(-0.05);
      expect(result.finalPremiumAED).toBeGreaterThan(result.basePremiumAED * 0.95);
    });

    it('should include breakdown details', () => {
      const result = service.computePremium({
        vehicleId: 'TK-0847', avgDwvs: 0.25, tpmSignedBlocks: 280, totalBlocks: 285,
        fleetAvgDwvs: 0.38, harshEventRate: 0.08, dtcRate: 0.02, totalKm: 38000, sessionCount: 142,
      });
      expect(result.breakdown.length).toBeGreaterThan(0);
      expect(result.breakdown[0].factor).toBeDefined();
      expect(result.breakdown[0].reason).toBeDefined();
    });
  });

  // ── submitSessionBlocks ──────────────────────────────────
  describe('submitSessionBlocks', () => {
    it('should submit blocks successfully', async () => {
      const result = await service.submitSessionBlocks({
        policyId: 'ins-001',
        vehicleId: 'TK-0847',
        sessionBlocks: [
          { blockNumber: 1001, driverId: 'd-001', driverName: 'Ahmed', startTime: '2025-02-15T06:00:00', endTime: '2025-02-15T10:00:00', distanceKm: 282, dwvs: 0.22, wearIndex: 0.18, tpmSigned: true, blockHash: 'sha256:abc', harshBrakes: 2, harshAccelerations: 1, dtcCount: 0 },
        ],
        periodStart: '2025-02-01',
        periodEnd: '2025-02-28',
      });
      expect(result.success).toBe(true);
      expect(result.blocksSubmitted).toBe(1);
      expect(result.tpmVerifiedBlocks).toBe(1);
    });

    it('should reject invalid policy ID', async () => {
      await expect(service.submitSessionBlocks({
        policyId: 'invalid',
        vehicleId: 'TK-0847',
        sessionBlocks: [],
        periodStart: '2025-02-01',
        periodEnd: '2025-02-28',
      })).rejects.toThrow();
    });
  });

  // ── Analytics ────────────────────────────────────────────
  describe('getAnalytics', () => {
    it('should return fleet insurance analytics', () => {
      const result = service.getAnalytics();
      expect(result.totalPolicies).toBeGreaterThan(0);
      expect(result.activePolicies).toBeGreaterThan(0);
      expect(result.totalPremiumAED).toBeGreaterThan(0);
      expect(result.totalSavingsAED).toBeGreaterThan(0);
      expect(result.byFleetType).toHaveLength(3);
      expect(result.byProvider.length).toBeGreaterThan(0);
    });
  });

  // ── Providers ────────────────────────────────────────────
  describe('getProviders', () => {
    it('should return list of providers', () => {
      const providers = service.getProviders();
      expect(providers.length).toBeGreaterThan(0);
      expect(providers[0].name).toBeDefined();
      expect(providers[0].supportsDwvs).toBeDefined();
    });

    it('should find provider by ID', () => {
      const provider = service.getProviderById('prov-001');
      expect(provider.name).toBe('Emirates Insurance');
      expect(provider.supportsDwvs).toBe(true);
    });

    it('should throw for invalid provider ID', () => {
      expect(() => service.getProviderById('invalid')).toThrow();
    });
  });

  // ── Risk Assessment ──────────────────────────────────────
  describe('computeFleetRisk', () => {
    it('should return risk assessment', async () => {
      const result = await service.computeFleetRisk();
      expect(result.fleetRiskScore).toBeDefined();
      expect(result.riskLevel).toBeDefined();
      expect(result.factors.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.projectedAnnualSavings).toBeGreaterThan(0);
    });
  });
});
