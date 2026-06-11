import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FleetsService, FleetsController } from './fleets.module';
import { Fleet } from './entities/fleet.entity';
import { createMockRepository, mockFleet } from '../../test/test-utils';

describe('FleetsModule', () => {
  let controller: FleetsController;
  let service: FleetsService;
  let mockRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FleetsController],
      providers: [FleetsService, { provide: getRepositoryToken(Fleet), useValue: mockRepo }],
    }).compile();
    controller = module.get(FleetsController);
    service = module.get(FleetsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('FleetsService', () => {
    it('findAll returns fleets', async () => {
      mockRepo.find.mockResolvedValue([mockFleet]);
      const result = await service.findAll({});
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Dubai Tanker Fleet Alpha');
    });

    it('findOne returns fleet by id', async () => {
      mockRepo.findOne.mockResolvedValue(mockFleet);
      expect(await service.findOne('fleet-001')).toEqual(mockFleet);
    });

    it('create saves new fleet', async () => {
      mockRepo.create.mockReturnValue(mockFleet);
      mockRepo.save.mockResolvedValue(mockFleet);
      await service.create({ name: 'New Fleet' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });

    it('remove deletes fleet', async () => {
      expect(await service.remove('fleet-001')).toHaveProperty('deleted', true);
    });
  });
});
