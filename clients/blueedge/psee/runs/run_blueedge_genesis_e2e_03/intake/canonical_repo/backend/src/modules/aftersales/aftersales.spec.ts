import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AftersalesService } from './aftersales.module';
import { AftersalesWorkOrder } from './entities/aftersales-work-order.entity';

describe('AftersalesService', () => {
  let service: AftersalesService;
  const mockRepo = { find: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(null), save: jest.fn().mockImplementation(e => ({ id: 'test-id', ...e })), create: jest.fn().mockImplementation(e => e), count: jest.fn().mockResolvedValue(0), delete: jest.fn().mockResolvedValue({ affected: 1 }) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AftersalesService, { provide: getRepositoryToken(AftersalesWorkOrder), useValue: mockRepo }],
    }).compile();
    service = module.get(AftersalesService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

    it('should execute getDashboard', async () => {
      const result = await service.getDashboard();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getRepairScheduling', async () => {
      const result = await service.getRepairScheduling();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getPartsIntegration', async () => {
      const result = await service.getPartsIntegration();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getWorkshopManagement', async () => {
      const result = await service.getWorkshopManagement();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getCybersecurityCompliance', async () => {
      const result = await service.getCybersecurityCompliance();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getOEMFieldIntelligence', async () => {
      const result = await service.getOEMFieldIntelligence();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
});
