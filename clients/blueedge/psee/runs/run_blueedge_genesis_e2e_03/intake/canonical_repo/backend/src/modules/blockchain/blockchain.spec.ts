import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlockchainService } from './blockchain.module';
import { BlockchainRecord } from './entities/blockchain-record.entity';

describe('BlockchainService', () => {
  let service: BlockchainService;
  const mockRepo = { find: jest.fn().mockResolvedValue([]), findOne: jest.fn().mockResolvedValue(null), save: jest.fn().mockImplementation(e => ({ id: 'test-id', ...e })), create: jest.fn().mockImplementation(e => e), count: jest.fn().mockResolvedValue(0), delete: jest.fn().mockResolvedValue({ affected: 1 }) };

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [BlockchainService, { provide: getRepositoryToken(BlockchainRecord), useValue: mockRepo }],
    }).compile();
    service = module.get(BlockchainService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

    it('should execute getDashboard', async () => {
      const result = await service.getDashboard();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getCargoTokens', async () => {
      const result = await service.getCargoTokens();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getNFTRegistry', async () => {
      const result = await service.getNFTRegistry();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getPaymentSettlement', async () => {
      const result = await service.getPaymentSettlement();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getDataMarketplace', async () => {
      const result = await service.getDataMarketplace();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });

    it('should execute getCarbonCredits', async () => {
      const result = await service.getCarbonCredits();
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
    });
});
