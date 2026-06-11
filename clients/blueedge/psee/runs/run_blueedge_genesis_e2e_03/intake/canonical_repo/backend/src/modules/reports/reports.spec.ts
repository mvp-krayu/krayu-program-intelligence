import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService, ReportsController } from './reports.module';

describe('ReportsModule', () => {
  let controller: ReportsController;
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [ReportsService],
    }).compile();
    controller = module.get(ReportsController);
    service = module.get(ReportsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('ReportsService', () => {
    it('getTemplates returns report templates', async () => {
      const result = await service.getTemplates();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0]).toHaveProperty('id');
      expect(result.data[0]).toHaveProperty('name');
      expect(result.data[0]).toHaveProperty('format');
    });

    it('generate returns report job', async () => {
      const result = await service.generate({ template: 'Fleet Summary' });
      expect(result.data).toHaveProperty('reportId');
      expect(result.data).toHaveProperty('status', 'generating');
    });

    it('getStatus returns report status', async () => {
      const result = await service.getStatus('rpt-001');
      expect(result.data).toHaveProperty('status', 'completed');
      expect(result.data).toHaveProperty('downloadUrl');
    });

    it('getScheduled returns scheduled reports', async () => {
      const result = await service.getScheduled();
      expect(result.data).toBeInstanceOf(Array);
    });

    it('scheduleReport returns new schedule', async () => {
      const result = await service.scheduleReport({ template: 'Daily', frequency: 'daily' });
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('status', 'active');
    });
  });
});
