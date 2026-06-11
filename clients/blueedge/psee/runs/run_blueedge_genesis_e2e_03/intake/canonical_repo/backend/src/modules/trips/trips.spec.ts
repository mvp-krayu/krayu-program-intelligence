import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TripsService, TripsController } from './trips.module';
import { Trip } from './entities/trip.entity';
import { createMockRepository, mockTrip } from '../../test/test-utils';

describe('TripsModule', () => {
  let controller: TripsController;
  let service: TripsService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [TripsService, { provide: getRepositoryToken(Trip), useValue: mockRepo }],
    }).compile();
    controller = module.get(TripsController);
    service = module.get(TripsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('TripsService', () => {
    it('findAll returns trips', async () => {
      mockRepo.find.mockResolvedValue([mockTrip]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('findOne returns trip', async () => {
      mockRepo.findOne.mockResolvedValue(mockTrip);
      expect(await service.findOne('trip-001')).toEqual(mockTrip);
    });

    it('create saves trip', async () => {
      mockRepo.create.mockReturnValue(mockTrip);
      mockRepo.save.mockResolvedValue(mockTrip);
      await service.create({ origin: 'Dubai' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('update modifies trip', async () => {
      mockRepo.findOne.mockResolvedValue(mockTrip);
      await service.update('trip-001', { status: 'completed' } as any);
      expect(mockRepo.update).toHaveBeenCalled();
    });

    it('remove deletes trip', async () => {
      expect(await service.remove('trip-001')).toHaveProperty('deleted', true);
    });
  });
});
