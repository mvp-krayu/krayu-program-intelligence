import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TaxiService, TaxiController } from './taxi.module';
import { TaxiTrip } from './entities/taxi-trip.entity';
import { createMockRepository, mockTaxiTrip } from '../../test/test-utils';

describe('TaxiModule', () => {
  let controller: TaxiController;
  let service: TaxiService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaxiController],
      providers: [TaxiService, { provide: getRepositoryToken(TaxiTrip), useValue: mockRepo }],
    }).compile();
    controller = module.get(TaxiController);
    service = module.get(TaxiService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('TaxiService', () => {
    it('findAll returns taxi trips', async () => {
      mockRepo.find.mockResolvedValue([mockTaxiTrip]);
      const result = await service.findAll({});
      expect(result).toHaveLength(1);
      expect(result[0].fareAed).toBe(45.00);
    });

    it('create saves trip', async () => {
      mockRepo.create.mockReturnValue(mockTaxiTrip);
      mockRepo.save.mockResolvedValue(mockTaxiTrip);
      await service.create({ pickupLocation: 'Mall' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
