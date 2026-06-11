import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticsService, DiagnosticsController } from './diagnostics.module';
import { mockUuid } from '../../test/test-utils';

describe('DiagnosticsModule', () => {
  let controller: DiagnosticsController;
  let service: DiagnosticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiagnosticsController],
      providers: [DiagnosticsService],
    }).compile();
    controller = module.get(DiagnosticsController);
    service = module.get(DiagnosticsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('DiagnosticsService', () => {
    it('getVehicleHealth returns health report', async () => {
      const result = await service.getVehicleHealth(mockUuid);
      expect(result.data).toHaveProperty('overallHealth');
      expect(result.data).toHaveProperty('engine');
      expect(result.data).toHaveProperty('transmission');
      expect(result.data).toHaveProperty('brakes');
      expect(result.data).toHaveProperty('battery');
      expect(result.data).toHaveProperty('tires');
      expect(result.data.engine).toHaveProperty('health');
    });

    it('getDTCAnalysis returns DTC patterns', async () => {
      const result = await service.getDTCAnalysis(mockUuid);
      expect(result.data).toHaveProperty('activeDTCs');
      expect(result.data).toHaveProperty('patterns');
      expect(result.data.patterns[0]).toHaveProperty('prediction');
      expect(result.data.patterns[0]).toHaveProperty('confidence');
    });

    it('getFleetHealth returns fleet overview', async () => {
      const result = await service.getFleetHealth();
      expect(result.data).toHaveProperty('avgHealth');
      expect(result.data).toHaveProperty('critical');
      expect(result.data).toHaveProperty('topIssues');
    });

    it('getRUL returns remaining useful life prediction', async () => {
      const result = await service.getRUL(mockUuid, 'brake_pads');
      expect(result.data).toHaveProperty('remainingUsefulLifeDays');
      expect(result.data).toHaveProperty('confidence');
      expect(result.data).toHaveProperty('distribution');
      expect(result.data.distribution).toHaveProperty('p50');
    });
  });
});
