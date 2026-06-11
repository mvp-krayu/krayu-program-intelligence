import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ColdchainService, ColdchainController, ColdchainShipment } from './coldchain.module';
import { createMockRepository, mockColdChainShipment } from '../../test/test-utils';

describe('ColdchainModule', () => {
  let controller: ColdchainController;
  let service: ColdchainService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ColdchainController],
      providers: [ColdchainService, { provide: getRepositoryToken(ColdchainShipment), useValue: mockRepo }],
    }).compile();
    controller = module.get(ColdchainController);
    service = module.get(ColdchainService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('ColdchainService', () => {
    it('findAll returns shipments', async () => {
      mockRepo.find.mockResolvedValue([mockColdChainShipment]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('create saves shipment', async () => {
      mockRepo.create.mockReturnValue(mockColdChainShipment);
      mockRepo.save.mockResolvedValue(mockColdChainShipment);
      await service.create({ minTempC: -20 } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
