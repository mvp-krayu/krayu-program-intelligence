import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataMonetizationService } from './data-monetization.module';
import { DataProduct } from './entities/data-product.entity';

describe('DataMonetizationService', () => {
  let service: DataMonetizationService;
  const mockRepo = { find: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(null), save: jest.fn().mockImplementation(e => ({ id: 'test-id', ...e })), create: jest.fn().mockImplementation(e => e), count: jest.fn().mockResolvedValue(0), delete: jest.fn().mockResolvedValue({ affected: 1 }) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DataMonetizationService, { provide: getRepositoryToken(DataProduct), useValue: mockRepo }],
    }).compile();
    service = module.get(DataMonetizationService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

    it('should execute getDashboard', async () => {
      const result = await service.getDashboard();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getOEMSubscriptions', async () => {
      const result = await service.getOEMSubscriptions();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getCitySaaS', async () => {
      const result = await service.getCitySaaS();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getDataMarketplace', async () => {
      const result = await service.getDataMarketplace();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getRevenueProjection', async () => {
      const result = await service.getRevenueProjection();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
});
