import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FuelService, FuelController } from './fuel.module';
import { FuelTransaction } from './entities/fuel-transaction.entity';
import { createMockRepository, mockFuelTransaction } from '../../test/test-utils';

describe('FuelModule', () => {
  let controller: FuelController;
  let service: FuelService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FuelController],
      providers: [FuelService, { provide: getRepositoryToken(FuelTransaction), useValue: mockRepo }],
    }).compile();
    controller = module.get(FuelController);
    service = module.get(FuelService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('FuelService', () => {
    it('findAll returns fuel transactions', async () => {
      mockRepo.find.mockResolvedValue([mockFuelTransaction]);
      const result = await service.findAll({});
      expect(result).toHaveLength(1);
      expect(result[0].fuelType).toBe('diesel');
    });

    it('findOne returns transaction', async () => {
      mockRepo.findOne.mockResolvedValue(mockFuelTransaction);
      expect(await service.findOne('fuel-001')).toEqual(mockFuelTransaction);
    });

    it('create saves transaction', async () => {
      mockRepo.create.mockReturnValue(mockFuelTransaction);
      mockRepo.save.mockResolvedValue(mockFuelTransaction);
      await service.create({ volumeLiters: 200 } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
