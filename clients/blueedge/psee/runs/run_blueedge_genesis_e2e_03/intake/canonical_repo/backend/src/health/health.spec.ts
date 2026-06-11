// ══════════════════════════════════════════════════════════════
// Health Controller — Comprehensive Unit Tests
// ══════════════════════════════════════════════════════════════
import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { CacheService } from '../common/cache';
import { PerformanceMiddleware } from '../common/logging';
import { FleetEventEmitter } from '../events';

describe('HealthController', () => {
  let controller: HealthController;
  let mockCache: any;
  let mockPerf: any;
  let mockEvents: any;

  beforeEach(async () => {
    mockCache = {
      getStats: jest.fn().mockResolvedValue({ hits: 100, misses: 20, connected: true }),
      flushAll: jest.fn().mockResolvedValue(undefined),
    };
    mockPerf = {
      getMetrics: jest.fn().mockReturnValue({ '/vehicles': { avg: 45, p99: 120 } }),
      getTopSlowest: jest.fn().mockReturnValue([{ path: '/analytics', avg: 250 }]),
    };
    mockEvents = { getEventCount: jest.fn().mockReturnValue(500) };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        { provide: CacheService, useValue: mockCache },
        { provide: PerformanceMiddleware, useValue: mockPerf },
        { provide: FleetEventEmitter, useValue: mockEvents },
      ],
    }).compile();
    controller = module.get(HealthController);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); });

  describe('GET /health', () => {
    it('returns health status ok', async () => {
      const result = await controller.check();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('service', 'blue-edge-fleet-api');
      expect(result).toHaveProperty('version', '2.13.0');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('uptime');
    });

    it('includes memory stats', async () => {
      const result = await controller.check();
      expect(result.memory).toHaveProperty('rss');
      expect(result.memory).toHaveProperty('heap');
    });

    it('includes cache stats', async () => {
      const result = await controller.check();
      expect(result.cache).toHaveProperty('hits', 100);
    });

    it('includes event count', async () => {
      const result = await controller.check();
      expect(result.events.totalEmitted).toBe(500);
    });
  });

  describe('GET /health/ready', () => {
    it('returns ready when cache connected', async () => {
      const result = await controller.readiness();
      expect(result.status).toBe('ready');
      expect(result.checks.cache).toBe('up');
    });

    it('returns degraded when cache disconnected', async () => {
      mockCache.getStats.mockResolvedValue({ connected: false });
      const result = await controller.readiness();
      expect(result.status).toBe('degraded');
      expect(result.checks.cache).toContain('down');
    });
  });

  describe('GET /health/metrics', () => {
    it('returns performance metrics', async () => {
      const result = await controller.metrics();
      expect(result).toHaveProperty('endpoints');
      expect(result).toHaveProperty('topSlowest');
      expect(result).toHaveProperty('cache');
      expect(result).toHaveProperty('process');
      expect(result.process).toHaveProperty('uptime');
    });
  });

  describe('GET /health/cache/stats', () => {
    it('returns cache statistics', async () => {
      const result = await controller.cacheStats();
      expect(result).toHaveProperty('hits');
      expect(mockCache.getStats).toHaveBeenCalled();
    });
  });

  describe('GET /health/cache/flush', () => {
    it('flushes cache', async () => {
      const result = await controller.flushCache();
      expect(result).toHaveProperty('status', 'flushed');
      expect(mockCache.flushAll).toHaveBeenCalled();
    });
  });
});
