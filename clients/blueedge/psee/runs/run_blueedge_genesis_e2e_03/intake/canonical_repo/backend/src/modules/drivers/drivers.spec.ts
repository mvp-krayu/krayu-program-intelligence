import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DriversService, DriversController } from './drivers.module';
import { Driver } from './entities/driver.entity';
import { createMockRepository, mockDriver, mockUuid } from '../../test/test-utils';

describe('DriversModule', () => {
  let controller: DriversController;
  let service: DriversService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DriversController],
      providers: [DriversService, { provide: getRepositoryToken(Driver), useValue: mockRepo }],
    }).compile();
    controller = module.get(DriversController);
    service = module.get(DriversService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('DriversService', () => {
    it('findAll returns drivers', async () => {
      mockRepo.find.mockResolvedValue([mockDriver]);
      const result = await service.findAll({});
      expect(result).toHaveLength(1);
      expect(result[0].nameEn).toBe('Ahmed Al Maktoum');
    });

    it('findOne returns driver by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockDriver);
      const result = await service.findOne('driver-001');
      expect(result).toEqual(mockDriver);
    });

    it('findOne returns null for missing driver', async () => {
      mockRepo.findOne.mockResolvedValue(null);
      expect(await service.findOne('bad')).toBeNull();
    });

    it('create saves new driver', async () => {
      mockRepo.create.mockReturnValue(mockDriver);
      mockRepo.save.mockResolvedValue(mockDriver);
      await service.create({ nameEn: 'Test Driver' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('update modifies driver', async () => {
      mockRepo.findOne.mockResolvedValue(mockDriver);
      await service.update('driver-001', { safetyScore: 95 } as any);
      expect(mockRepo.update).toHaveBeenCalledWith('driver-001', expect.any(Object));
    });

    it('remove deletes driver', async () => {
      const result = await service.remove('driver-001');
      expect(result).toHaveProperty('deleted', true);
    });
  });

  describe('DriversController', () => {
    it('findAll delegates to service', async () => {
      mockRepo.find.mockResolvedValue([mockDriver]);
      const result = await controller.findAll({});
      expect(result).toHaveLength(1);
    });

    it('findOne delegates to service', async () => {
      mockRepo.findOne.mockResolvedValue(mockDriver);
      const result = await controller.findOne('driver-001');
      expect(result).toEqual(mockDriver);
    });
  });
});
