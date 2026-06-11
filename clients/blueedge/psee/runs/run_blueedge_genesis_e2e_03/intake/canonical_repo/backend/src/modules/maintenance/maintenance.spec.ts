import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MaintenanceService, MaintenanceController } from './maintenance.module';
import { WorkOrder } from './entities/work-order.entity';
import { createMockRepository, mockWorkOrder } from '../../test/test-utils';

describe('MaintenanceModule', () => {
  let controller: MaintenanceController;
  let service: MaintenanceService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaintenanceController],
      providers: [MaintenanceService, { provide: getRepositoryToken(WorkOrder), useValue: mockRepo }],
    }).compile();
    controller = module.get(MaintenanceController);
    service = module.get(MaintenanceService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('MaintenanceService', () => {
    it('findAll returns work orders', async () => {
      mockRepo.find.mockResolvedValue([mockWorkOrder]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('findOne returns work order', async () => {
      mockRepo.findOne.mockResolvedValue(mockWorkOrder);
      const result = await service.findOne('wo-001');
      expect(result.priority).toBe('high');
      expect(result.type).toBe('preventive');
    });

    it('create saves work order', async () => {
      mockRepo.create.mockReturnValue(mockWorkOrder);
      mockRepo.save.mockResolvedValue(mockWorkOrder);
      await service.create({ title: 'Oil Change' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('update modifies work order', async () => {
      mockRepo.findOne.mockResolvedValue(mockWorkOrder);
      await service.update('wo-001', { status: 'in_progress' } as any);
      expect(mockRepo.update).toHaveBeenCalled();
    });

    it('remove deletes work order', async () => {
      expect(await service.remove('wo-001')).toHaveProperty('deleted', true);
    });
  });
});
