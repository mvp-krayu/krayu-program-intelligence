import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeofenceService, OperationsController } from './operations.module';
import { Geofence } from './entities/geofence.entity';
import { createMockRepository, mockGeofence } from '../../test/test-utils';

describe('OperationsModule', () => {
  let controller: OperationsController;
  let service: GeofenceService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OperationsController],
      providers: [GeofenceService, { provide: getRepositoryToken(Geofence), useValue: mockRepo }],
    }).compile();
    controller = module.get(OperationsController);
    service = module.get(GeofenceService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('GeofenceService', () => {
    it('findAll returns geofences', async () => {
      mockRepo.find.mockResolvedValue([mockGeofence]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('findOne returns geofence', async () => {
      mockRepo.findOne.mockResolvedValue(mockGeofence);
      expect(await service.findOne('geo-001')).toEqual(mockGeofence);
    });

    it('create saves geofence', async () => {
      mockRepo.create.mockReturnValue(mockGeofence);
      mockRepo.save.mockResolvedValue(mockGeofence);
      await service.create({ name: 'Test Zone' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('remove deletes geofence', async () => {
      expect(await service.remove('geo-001')).toHaveProperty('deleted', true);
    });
  });
});
