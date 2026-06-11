// ══════════════════════════════════════════════════════════════
// Driver Sessions Module — Comprehensive Unit Tests
// Session blocks, Welford variance, DWVS computation
// ══════════════════════════════════════════════════════════════
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DriverSessionsService } from './driver-sessions.service';
import { DriverSessionsController } from './driver-sessions.controller';
import { DriverSessionBlock } from './entities/driver-session-block.entity';
import { createMockRepository, mockUuid } from '../../test/test-utils';

describe('DriverSessionsModule', () => {
  let controller: DriverSessionsController;
  let service: DriverSessionsService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  const mockBlock: Partial<DriverSessionBlock> = {
    id: mockUuid(),
    blockNumber: 4280,
    vehicleId: mockUuid(),
    driverId: mockUuid(),
    driverName: 'Mohammed Al-Rashid',
    authMethod: 'faceid_nfc',
    svgDeviceId: 'SVG-A1B2AE-001',
    startTime: new Date('2026-02-15T06:00:00Z'),
    status: 'active',
    odometerStart: 344000,
    fuelLevelStart: 78,
  };

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriverSessionsController],
      providers: [DriverSessionsService, { provide: getRepositoryToken(DriverSessionBlock), useValue: mockRepo }],
    }).compile();
    controller = module.get(DriverSessionsController);
    service = module.get(DriverSessionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  // ─── Session Lifecycle ───────────────────────────────────────

  describe('openSession', () => {
    it('creates new session block with block number', async () => {
      mockRepo.findOne.mockResolvedValueOnce(null); // no active session
      mockRepo.findOne.mockResolvedValueOnce({ blockNumber: 4279 }); // last block
      mockRepo.create.mockReturnValue(mockBlock);
      mockRepo.save.mockResolvedValue(mockBlock);
      const result = await service.openSession({
        vehicleId: mockBlock.vehicleId!, driverId: mockBlock.driverId!,
        driverName: 'Mohammed Al-Rashid', authMethod: 'faceid_nfc',
        svgDeviceId: 'SVG-A1B2AE-001', odometerStart: 344000, fuelLevelStart: 78,
      });
      expect(result.data).toBeDefined();
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('auto-closes active session on same vehicle', async () => {
      const activeBlock = { ...mockBlock, id: 'active-id', status: 'active' };
      mockRepo.findOne
        .mockResolvedValueOnce(activeBlock)  // active session found
        .mockResolvedValueOnce(activeBlock)  // close finds block
        .mockResolvedValueOnce(activeBlock)  // close returns
        .mockResolvedValueOnce({ blockNumber: 4280 }) // last block
      ;
      mockRepo.update.mockResolvedValue({ affected: 1 });
      mockRepo.create.mockReturnValue(mockBlock);
      mockRepo.save.mockResolvedValue(mockBlock);
      await service.openSession({
        vehicleId: mockBlock.vehicleId!, driverId: 'new-driver-id',
        driverName: 'Khalid Ibrahim', authMethod: 'biometric',
        svgDeviceId: 'SVG-A1B2AE-001', odometerStart: 344362, fuelLevelStart: 31,
      });
      expect(mockRepo.update).toHaveBeenCalled(); // closed previous
    });
  });

  describe('closeSession', () => {
    it('closes block with computed metrics', async () => {
      const active = { ...mockBlock, status: 'active', odometerStart: 344000 };
      mockRepo.findOne.mockResolvedValueOnce(active).mockResolvedValueOnce({ ...active, status: 'closed' });
      mockRepo.update.mockResolvedValue({ affected: 1 });
      const result = await service.closeSession(active.id!, {
        odometerEnd: 344362, fuelLevelEnd: 31, endTime: new Date(),
        fuelConsumedL: 188.8, harshBrakes: 3, rpmVariance: 28400,
      });
      expect(mockRepo.update).toHaveBeenCalled();
      const updateCall = mockRepo.update.mock.calls[0][1];
      expect(updateCall.status).toBe('closed');
      expect(updateCall.distanceKm).toBe(362);
    });

    it('rejects closing already-closed block', async () => {
      mockRepo.findOne.mockResolvedValue({ ...mockBlock, status: 'closed' });
      await expect(service.closeSession('id', { odometerEnd: 1, fuelLevelEnd: 1, endTime: new Date() }))
        .rejects.toThrow('already closed');
    });

    it('throws NotFoundException for missing block', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      await expect(service.closeSession('bad-id', { odometerEnd: 1, fuelLevelEnd: 1, endTime: new Date() }))
        .rejects.toThrow('not found');
    });
  });

  // ─── Welford's Algorithm ─────────────────────────────────────

  describe('Welford streaming variance', () => {
    it('computes correct mean and variance for known dataset', () => {
      // Dataset: [2, 4, 4, 4, 5, 5, 7, 9] → mean=5, variance=4
      const values = [2, 4, 4, 4, 5, 5, 7, 9];
      const state = { count: 0, mean: 0, m2: 0 };
      for (const v of values) DriverSessionsService.welfordUpdate(state, v);
      const result = DriverSessionsService.welfordFinalize(state);
      expect(result.mean).toBe(5);
      expect(result.variance).toBe(4);
    });

    it('handles single value (variance = 0)', () => {
      const state = { count: 0, mean: 0, m2: 0 };
      DriverSessionsService.welfordUpdate(state, 42);
      const result = DriverSessionsService.welfordFinalize(state);
      expect(result.mean).toBe(42);
      expect(result.variance).toBe(0);
    });

    it('handles identical values (variance = 0)', () => {
      const state = { count: 0, mean: 0, m2: 0 };
      for (let i = 0; i < 100; i++) DriverSessionsService.welfordUpdate(state, 1500);
      const result = DriverSessionsService.welfordFinalize(state);
      expect(result.mean).toBe(1500);
      expect(result.variance).toBeCloseTo(0, 10);
    });
  });

  // ─── DWVS Computation ───────────────────────────────────────

  describe('computeDWVS', () => {
    it('returns insufficient_data for < 5 blocks', async () => {
      mockRepo.find.mockResolvedValue([{ status: 'closed' }, { status: 'closed' }]);
      const result = await service.computeDWVS('drv-1', 'veh-1');
      expect(result.data.dwvs).toBeNull();
      expect(result.data.confidence).toBe('insufficient_data');
    });

    it('computes DWVS for driver with consistent blocks', async () => {
      // 10 blocks with low variance = low DWVS
      const blocks = Array.from({ length: 10 }, (_, i) => ({
        status: 'closed', distanceKm: 300, fuelConsumedL: 120, durationMinutes: 420,
        harshBrakes: 1, harshAccelerations: 0, harshCorners: 0,
        dtcsGenerated: [], rpmVariance: 18000 + Math.random() * 2000,
        speedVariance: 200 + Math.random() * 50, fuelRateVariance: 1.0 + Math.random() * 0.3,
        idlePct: 8, wearIndex: 0.2,
      }));
      mockRepo.find.mockResolvedValue(blocks);
      const result = await service.computeDWVS('drv-consistent', 'veh-1');
      expect(result.data.dwvs).toBeLessThan(0.5);
      expect(result.data.consistencyRating).toMatch(/excellent|good/);
    });

    it('computes higher DWVS for erratic driver', async () => {
      // 10 blocks with HIGH variance = high DWVS
      const blocks = Array.from({ length: 10 }, (_, i) => ({
        status: 'closed', distanceKm: 300, fuelConsumedL: 120, durationMinutes: 420,
        harshBrakes: 2 + Math.floor(Math.random() * 8), harshAccelerations: Math.floor(Math.random() * 6), harshCorners: Math.floor(Math.random() * 4),
        dtcsGenerated: i % 3 === 0 ? ['P0217'] : [], rpmVariance: 20000 + Math.random() * 40000,
        speedVariance: 200 + Math.random() * 600, fuelRateVariance: 1 + Math.random() * 5,
        idlePct: 5 + Math.random() * 20, wearIndex: 0.3 + Math.random() * 0.4,
      }));
      mockRepo.find.mockResolvedValue(blocks);
      const result = await service.computeDWVS('drv-erratic', 'veh-1');
      expect(result.data.dwvs).toBeGreaterThan(0);
      expect(result.data.blockCount).toBe(10);
    });
  });

  // ─── Query Methods ──────────────────────────────────────────

  describe('findByVehicle', () => {
    it('returns paginated blocks', async () => {
      mockRepo.findAndCount.mockResolvedValue([[mockBlock], 1]);
      const result = await service.findByVehicle('veh-1', { page: 1, limit: 20 });
      expect(result.data).toHaveLength(1);
    });
  });

  describe('findByDriver', () => {
    it('returns blocks for driver', async () => {
      mockRepo.findAndCount.mockResolvedValue([[mockBlock, mockBlock], 2]);
      const result = await service.findByDriver('drv-1', undefined, { page: 1, limit: 20 });
      expect(result.data).toHaveLength(2);
    });
  });

  describe('getActiveSession', () => {
    it('returns active session or null', async () => {
      mockRepo.findOne.mockResolvedValue(mockBlock);
      const result = await service.getActiveSession('veh-1');
      expect(result.data).toBeDefined();
    });
  });

  describe('getStats', () => {
    it('returns aggregate statistics', async () => {
      mockRepo.count.mockResolvedValueOnce(84200).mockResolvedValueOnce(312).mockResolvedValueOnce(83888);
      mockRepo.createQueryBuilder = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ total: 12450000 }),
      });
      const result = await service.getStats();
      expect(result.data.totalBlocks).toBe(84200);
    });
  });
});
