import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { V2gService, V2gController, V2gContract, V2gSession } from './v2g.module';
import { createMockRepository } from '../../test/test-utils';

describe('V2gModule', () => {
  let controller: V2gController;
  let service: V2gService;
  let mockRepo: ReturnType<typeof createMockRepository>;
  let mockSessionRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    mockSessionRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [V2gController],
      providers: [
        V2gService,
        { provide: getRepositoryToken(V2gContract), useValue: mockRepo },
        { provide: getRepositoryToken(V2gSession), useValue: mockSessionRepo },
      ],
    }).compile();
    controller = module.get(V2gController);
    service = module.get(V2gService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('V2gService', () => {
    it('findAll returns V2G contracts', async () => {
      mockRepo.find.mockResolvedValue([{ id: 'v2g-001' }]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('create saves contract', async () => {
      mockRepo.create.mockReturnValue({ id: 'v2g-001' });
      mockRepo.save.mockResolvedValue({ id: 'v2g-001' });
      await service.create({ sessionType: 'charge' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
