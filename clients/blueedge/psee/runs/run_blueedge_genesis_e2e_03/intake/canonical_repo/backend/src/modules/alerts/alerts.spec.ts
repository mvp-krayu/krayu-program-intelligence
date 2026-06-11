import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlertsService, AlertsController } from './alerts.module';
import { Alert } from './entities/alert.entity';
import { createMockRepository, mockAlert } from '../../test/test-utils';

describe('AlertsModule', () => {
  let controller: AlertsController;
  let service: AlertsService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [AlertsService, { provide: getRepositoryToken(Alert), useValue: mockRepo }],
    }).compile();
    controller = module.get(AlertsController);
    service = module.get(AlertsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('AlertsService', () => {
    it('findAll returns alerts', async () => {
      mockRepo.find.mockResolvedValue([mockAlert]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('findOne returns alert', async () => {
      mockRepo.findOne.mockResolvedValue(mockAlert);
      const result = await service.findOne('alert-001');
      expect(result).toEqual(mockAlert);
      expect(result.severity).toBe('high');
    });

    it('create saves alert', async () => {
      mockRepo.create.mockReturnValue(mockAlert);
      mockRepo.save.mockResolvedValue(mockAlert);
      await service.create({ type: 'geofence' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('remove deletes alert', async () => {
      expect(await service.remove('alert-001')).toHaveProperty('deleted', true);
    });
  });
});
