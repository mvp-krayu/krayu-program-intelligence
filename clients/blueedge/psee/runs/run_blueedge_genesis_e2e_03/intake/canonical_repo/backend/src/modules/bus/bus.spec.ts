import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusService, BusController } from './bus.module';
import { BusRoute } from './entities/bus-route.entity';
import { createMockRepository, mockBusRoute } from '../../test/test-utils';

describe('BusModule', () => {
  let controller: BusController;
  let service: BusService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusController],
      providers: [BusService, { provide: getRepositoryToken(BusRoute), useValue: mockRepo }],
    }).compile();
    controller = module.get(BusController);
    service = module.get(BusService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('BusService', () => {
    it('findAll returns bus routes', async () => {
      mockRepo.find.mockResolvedValue([mockBusRoute]);
      const result = await service.findAll({});
      expect(result).toHaveLength(1);
      expect(result[0].routeNumber).toBe('F55A');
    });

    it('create saves route', async () => {
      mockRepo.create.mockReturnValue(mockBusRoute);
      mockRepo.save.mockResolvedValue(mockBusRoute);
      await service.create({ routeNumber: 'F66' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
