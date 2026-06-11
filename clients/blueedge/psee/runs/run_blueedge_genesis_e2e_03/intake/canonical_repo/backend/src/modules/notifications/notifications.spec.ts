import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationsService, NotificationsController } from './notifications.module';
import { Notification } from './entities/notification.entity';
import { createMockRepository, mockNotification } from '../../test/test-utils';

describe('NotificationsModule', () => {
  let controller: NotificationsController;
  let service: NotificationsService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsController],
      providers: [NotificationsService, { provide: getRepositoryToken(Notification), useValue: mockRepo }],
    }).compile();
    controller = module.get(NotificationsController);
    service = module.get(NotificationsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('NotificationsService', () => {
    it('findAll returns notifications', async () => {
      mockRepo.find.mockResolvedValue([mockNotification]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('findOne returns notification', async () => {
      mockRepo.findOne.mockResolvedValue(mockNotification);
      const result = await service.findOne('notif-001');
      expect(result.title).toBe('Overspeed Alert');
    });

    it('create saves notification', async () => {
      mockRepo.create.mockReturnValue(mockNotification);
      mockRepo.save.mockResolvedValue(mockNotification);
      await service.create({ title: 'Test' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
