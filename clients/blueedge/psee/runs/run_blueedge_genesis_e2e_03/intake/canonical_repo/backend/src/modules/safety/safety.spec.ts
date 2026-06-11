import { Test, TestingModule } from '@nestjs/testing';
import { SafetyService, SafetyController } from './safety.module';

describe('SafetyModule', () => {
  let controller: SafetyController;
  let service: SafetyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafetyController],
      providers: [SafetyService],
    }).compile();
    controller = module.get(SafetyController);
    service = module.get(SafetyService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('SafetyService', () => {
    it('getDashboard returns safety KPIs', async () => {
      const result = await service.getDashboard();
      expect(result.data).toHaveProperty('safetyScore');
      expect(result.data).toHaveProperty('accidents');
      expect(result.data).toHaveProperty('trend');
      expect(result.data).toHaveProperty('topRisks');
      expect(result.data.topRisks).toBeInstanceOf(Array);
    });

    it('getIncidents returns incident data', async () => {
      const result = await service.getIncidents({});
      expect(result.data).toHaveProperty('total');
      expect(result.data).toHaveProperty('byType');
    });

    it('getRiskAssessment returns risk profile', async () => {
      const result = await service.getRiskAssessment();
      expect(result.data).toHaveProperty('fleetRisk');
      expect(result.data).toHaveProperty('riskFactors');
    });

    it('getVideoEvents returns video data', async () => {
      const result = await service.getVideoEvents({});
      expect(result.data).toHaveProperty('total');
      expect(result.data).toHaveProperty('reviewed');
    });

    it('createIncident returns new incident', async () => {
      const result = await service.createIncident({ type: 'collision' });
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('status', 'reported');
    });

    it('getDriverSafety returns driver safety profile', async () => {
      const result = await service.getDriverSafety('driver-001');
      expect(result.data).toHaveProperty('driverId', 'driver-001');
      expect(result.data).toHaveProperty('score');
    });
  });
});
