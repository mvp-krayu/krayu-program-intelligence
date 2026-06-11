import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoadIntelligenceService } from './road-intelligence.module';
import { RoadSegment } from './entities/road-segment.entity';

describe('RoadIntelligenceService', () => {
  let service: RoadIntelligenceService;
  const mockRepo = { find: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(null), save: jest.fn().mockImplementation(e => ({ id: 'test-id', ...e })), create: jest.fn().mockImplementation(e => e), count: jest.fn().mockResolvedValue(0), delete: jest.fn().mockResolvedValue({ affected: 1 }) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [RoadIntelligenceService, { provide: getRepositoryToken(RoadSegment), useValue: mockRepo }],
    }).compile();
    service = module.get(RoadIntelligenceService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

    it('should execute getDashboard', async () => {
      const result = await service.getDashboard();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getRoadAnalysis', async () => {
      const result = await service.getRoadAnalysis({});
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getPredictiveDegradation', async () => {
      const result = await service.getPredictiveDegradation({});
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getCityAuthorityFeeds', async () => {
      const result = await service.getCityAuthorityFeeds();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
});
