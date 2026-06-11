import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { OtaService, OtaController, OtaFirmware, OtaDeployment, OtaCampaign } from './ota.module';
import { createMockRepository } from '../../test/test-utils';

describe('OtaModule', () => {
  let controller: OtaController;
  let service: OtaService;
  let mockRepo: ReturnType<typeof createMockRepository>;
  let mockDeployRepo: ReturnType<typeof createMockRepository>;
  let mockCampaignRepo: ReturnType<typeof createMockRepository>;

  beforeEach(async () => {
    mockRepo = createMockRepository();
    mockDeployRepo = createMockRepository();
    mockCampaignRepo = createMockRepository();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OtaController],
      providers: [
        OtaService,
        { provide: getRepositoryToken(OtaFirmware), useValue: mockRepo },
        { provide: getRepositoryToken(OtaDeployment), useValue: mockDeployRepo },
        { provide: getRepositoryToken(OtaCampaign), useValue: mockCampaignRepo },
      ],
    }).compile();
    controller = module.get(OtaController);
    service = module.get(OtaService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('OtaService', () => {
    it('findAll returns firmware entries', async () => {
      mockRepo.find.mockResolvedValue([{ id: 'ota-001', packageName: 'fw-v3' }]);
      expect(await service.findAll({})).toHaveLength(1);
    });

    it('create saves firmware entry', async () => {
      mockRepo.create.mockReturnValue({ id: 'ota-001' });
      mockRepo.save.mockResolvedValue({ id: 'ota-001' });
      await service.create({ packageName: 'fw-v4' } as any);
      expect(mockRepo.save).toHaveBeenCalled();
    });
  });
});
