import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ErpConnectorsService, ErpConnectorsController, ErpConnector, ErpSyncLog, ErpFieldMapping } from './erp-connectors.module';

const mockRepo = () => ({ find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(), count: jest.fn(), update: jest.fn(), delete: jest.fn(), createQueryBuilder: jest.fn(() => ({ where: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), take: jest.fn().mockReturnThis(), getManyAndCount: jest.fn().mockResolvedValue([[], 0]) })) });

describe('ERP Connectors Module', () => {
  let service: ErpConnectorsService;
  let controller: ErpConnectorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErpConnectorsController],
      providers: [
        ErpConnectorsService,
        { provide: getRepositoryToken(ErpConnector), useFactory: mockRepo },
        { provide: getRepositoryToken(ErpSyncLog), useFactory: mockRepo },
        { provide: getRepositoryToken(ErpFieldMapping), useFactory: mockRepo },
      ],
    }).compile();
    service = module.get(ErpConnectorsService);
    controller = module.get(ErpConnectorsController);
  });

  describe('Service', () => {
    it('should be defined', () => { expect(service).toBeDefined(); });

    it('should return ERP dashboard with all connectors', async () => {
      const result = await service.getDashboard();
      expect(result.data.connectors).toHaveLength(3);
      expect(result.data.connectors[0].erpType).toBe('sap');
      expect(result.data.connectors[1].erpType).toBe('oracle');
      expect(result.data.connectors[2].erpType).toBe('dynamics');
      expect(result.data.activeConnectors).toBe(3);
    });

    it('should return SAP connector with correct modules', async () => {
      const result = await service.getDashboard();
      const sap = result.data.connectors[0];
      expect(sap.modules).toContain('Fleet Management (PM)');
      expect(sap.modules).toContain('Finance (FI)');
      expect(sap.dataFlows.outbound).toContain('vehicle_telemetry');
    });

    it('should return available ERP connector types', async () => {
      const result = await service.getAvailableConnectors();
      expect(result.data).toHaveLength(5);
      const types = result.data.map((c: any) => c.erpType);
      expect(types).toContain('sap');
      expect(types).toContain('oracle');
      expect(types).toContain('dynamics');
      expect(types).toContain('odoo');
      expect(types).toContain('custom');
    });

    it('should create connector with validation', async () => {
      const result = await service.createConnector({ name: 'Test SAP', erpType: 'sap', modules: ['PM', 'FI'] });
      expect(result.data.id).toBeDefined();
      expect(result.data.status).toBe('testing');
      expect(result.data.validation.endpointReachable).toBe(true);
    });

    it('should test ERP connection with 5 checks', async () => {
      const result = await service.testConnection('erp-001');
      expect(result.data.result).toBe('success');
      expect(result.data.tests).toHaveLength(5);
      expect(result.data.tests.every((t: any) => t.result === 'pass')).toBe(true);
      expect(result.data.overallStatus).toBe('ready');
    });

    it('should trigger sync and return sync ID', async () => {
      const result = await service.triggerSync('erp-001', { syncType: 'incremental' });
      expect(result.data.syncId).toBeDefined();
      expect(result.data.status).toBe('started');
      expect(result.data.entities).toContain('vehicles');
    });

    it('should return sync history', async () => {
      const result = await service.getSyncHistory('erp-001');
      expect(result.data.length).toBeGreaterThanOrEqual(3);
      expect(result.data[0].recordsProcessed).toBeGreaterThan(0);
    });

    it('should return field mappings with transforms', async () => {
      const result = await service.getFieldMappings('erp-001');
      expect(result.data.entities).toBeDefined();
      const vehicleEntity = result.data.entities.find((e: any) => e.entityType === 'vehicle');
      expect(vehicleEntity.mappings.length).toBeGreaterThan(0);
      expect(result.data.transformFunctions).toBeDefined();
      const prefixRemove = result.data.transformFunctions.find((f: any) => f.name === 'prefix_remove');
      expect(prefixRemove).toBeDefined();
    });

    it('should return SAP-specific field mapping (EQUNR)', async () => {
      const result = await service.getFieldMappings('erp-001');
      const vehicleMappings = result.data.entities.find((e: any) => e.entityType === 'vehicle').mappings;
      const plateMapping = vehicleMappings.find((m: any) => m.targetField === 'EQUNR');
      expect(plateMapping).toBeDefined();
      expect(plateMapping.sourceField).toContain('plate_number');
    });

    it('should return connector config with masked credentials', async () => {
      const result = await service.getConnectorConfig('erp-001');
      expect(result.data.connection.clientId).toContain('***');
      expect(result.data.sync.retryPolicy).toBeDefined();
      expect(result.data.errorHandling.onConflict).toBe('source_wins');
    });
  });

  describe('Controller', () => {
    it('should be defined', () => { expect(controller).toBeDefined(); });
    it('should have getDashboard', () => { expect(controller.getDashboard).toBeDefined(); });
    it('should have getAvailable', () => { expect(controller.getAvailable).toBeDefined(); });
    it('should have testConnection', () => { expect(controller.testConnection).toBeDefined(); });
    it('should have triggerSync', () => { expect(controller.triggerSync).toBeDefined(); });
    it('should have getFieldMappings', () => { expect(controller.getFieldMappings).toBeDefined(); });
  });
});
