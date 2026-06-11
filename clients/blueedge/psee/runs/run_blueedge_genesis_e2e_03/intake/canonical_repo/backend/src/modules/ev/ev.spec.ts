import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EvService, EvController, EvVehicle, EvChargingSession } from './ev.module';
import { createMockRepository } from '../../test/test-utils';

describe('EvModule', () => {
  let controller: EvController;
  let service: EvService;
  let mockRepo: ReturnType<typeof createMockRepository>;
  let mockSessionRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    mockSessionRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvController],
      providers: [
        EvService,
        { provide: getRepositoryToken(EvVehicle), useValue: mockRepo },
        { provide: getRepositoryToken(EvChargingSession), useValue: mockSessionRepo },
      ],
    }).compile();
    controller = module.get(EvController);
    service = module.get(EvService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('EvService', () => {
    it('findAll returns EV data', async () => {
      mockRepo.find.mockResolvedValue([{ id: 'ev-001', batteryCapacityKwh: 100 }]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('create saves EV record', async () => {
      mockRepo.create.mockReturnValue({ id: 'ev-001' });
      mockRepo.save.mockResolvedValue({ id: 'ev-001' });
      await service.create({ batteryCapacityKwh: 100 } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
