import { Test, TestingModule } from '@nestjs/testing';
import { ComplianceService, ComplianceController } from './compliance.module';

describe('ComplianceModule', () => {
  let controller: ComplianceController;
  let service: ComplianceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComplianceController],
      providers: [ComplianceService],
    }).compile();
    controller = module.get(ComplianceController);
    service = module.get(ComplianceService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('ComplianceService', () => {
    it('getHOSSummary returns HOS data', async () => {
      const result = await service.getHOSSummary();
      expect(result.data).toHaveProperty('totalDrivers');
      expect(result.data).toHaveProperty('compliant');
      expect(result.data).toHaveProperty('violations');
    });

    it('getInspections returns inspection data', async () => {
      const result = await service.getInspections({});
      expect(result.data).toHaveProperty('upcoming');
      expect(result.data).toHaveProperty('passRate');
    });

    it('getDocuments returns document stats', async () => {
      const result = await service.getDocuments({});
      expect(result.data).toHaveProperty('total');
      expect(result.data.categories).toHaveProperty('licenses');
    });

    it('getCertifications returns cert data', async () => {
      const result = await service.getCertifications({});
      expect(result.data).toHaveProperty('valid');
      expect(result.data).toHaveProperty('expired');
    });

    it('getCrossBorderStatus returns UAE context', async () => {
      const result = await service.getCrossBorderStatus();
      expect(result.data.countries).toContain('UAE');
      expect(result.data.countries).toContain('Oman');
    });

    it('createInspection returns new inspection', async () => {
      const result = await service.createInspection({ vehicleId: 'v-001' });
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('status', 'scheduled');
    });

    it('submitViolation returns new violation', async () => {
      const result = await service.submitViolation({ type: 'speeding' });
      expect(result.data).toHaveProperty('id');
      expect(result.data).toHaveProperty('status', 'reported');
    });
  });
});
