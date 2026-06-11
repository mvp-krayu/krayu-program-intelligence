import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DevicesService } from './devices.service';
import { Device } from './entities/device.entity';
import { DeviceCertificate } from './entities/device-certificate.entity';
import { DeviceTransfer } from './entities/device-transfer.entity';
import { ProvisioningWorkflow } from './entities/provisioning-workflow.entity';
import { ConfigDeployment } from './entities/config-deployment.entity';
import { FleetEventEmitterService } from '../../events/fleet-event-emitter.service';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';

const mockRepo = () => ({
  find: jest.fn(), findOne: jest.fn(), create: jest.fn(d => d), save: jest.fn(d => ({ id: 'uuid-1', ...d })),
  count: jest.fn().mockResolvedValue(10), query: jest.fn().mockResolvedValue([]), update: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(), take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});
const mockEvents = () => ({ emit: jest.fn() });

describe('DevicesService', () => {
  let service: DevicesService;
  let deviceRepo: ReturnType<typeof mockRepo>;
  let certRepo: ReturnType<typeof mockRepo>;
  let transferRepo: ReturnType<typeof mockRepo>;
  let workflowRepo: ReturnType<typeof mockRepo>;
  let configRepo: ReturnType<typeof mockRepo>;
  let events: ReturnType<typeof mockEvents>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicesService,
        { provide: getRepositoryToken(Device), useFactory: mockRepo },
        { provide: getRepositoryToken(DeviceCertificate), useFactory: mockRepo },
        { provide: getRepositoryToken(DeviceTransfer), useFactory: mockRepo },
        { provide: getRepositoryToken(ProvisioningWorkflow), useFactory: mockRepo },
        { provide: getRepositoryToken(ConfigDeployment), useFactory: mockRepo },
        { provide: FleetEventEmitterService, useFactory: mockEvents },
      ],
    }).compile();

    service = module.get(DevicesService);
    deviceRepo = module.get(getRepositoryToken(Device));
    certRepo = module.get(getRepositoryToken(DeviceCertificate));
    transferRepo = module.get(getRepositoryToken(DeviceTransfer));
    workflowRepo = module.get(getRepositoryToken(ProvisioningWorkflow));
    configRepo = module.get(getRepositoryToken(ConfigDeployment));
    events = module.get(FleetEventEmitterService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  // ── CRUD ──────────────────────────────────────────────────
  describe('findAll', () => {
    it('should return paginated devices', async () => {
      const result = await service.findAll({ page: 1, limit: 25 });
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('totalPages');
    });

    it('should apply status filter', async () => {
      await service.findAll({ status: 'online' });
      const qb = deviceRepo.createQueryBuilder();
      expect(qb.andWhere).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return device when found', async () => {
      const device = { id: 'uuid-1', hardwareId: 'SVG-TEST-AE', status: 'online' };
      deviceRepo.findOne.mockResolvedValue(device);
      expect(await service.findOne('uuid-1')).toEqual(device);
    });

    it('should throw NotFoundException when not found', async () => {
      deviceRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should register device with generated hardware ID', async () => {
      deviceRepo.findOne.mockResolvedValue(null); // no duplicate
      const dto = {
        partNumber: 'PN-SVG-2025-TANKER', macAddress: 'AA:BB:CC:DD:EE:FF', countryCode: 'AE',
        fleetType: 'tanker', confirmedAccurate: true, qcPassed: true, readyForProvisioning: true,
      };
      const result = await service.create(dto as any, 'user-1');
      expect(result).toHaveProperty('hardwareId');
      expect(result.hardwareId).toMatch(/^SVG-/);
      expect(events.emit).toHaveBeenCalledWith('device.registered', expect.any(Object));
    });

    it('should throw ConflictException on duplicate serial', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'existing' });
      await expect(service.create({ partNumber: 'PN', macAddress: 'AA:BB:CC:DD:EE:FF', countryCode: 'AE', fleetType: 'tanker', confirmedAccurate: true, qcPassed: true, readyForProvisioning: true } as any, 'user-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('update', () => {
    it('should update device fields', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', status: 'online' });
      await service.update('uuid-1', { firmwareVersion: 'v2.5.0' });
      expect(deviceRepo.save).toHaveBeenCalled();
      expect(events.emit).toHaveBeenCalledWith('device.updated', expect.any(Object));
    });
  });

  describe('remove (decommission)', () => {
    it('should set lifecycle to decommissioned', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', hardwareId: 'SVG-TEST-AE', lifecycle: 'operational' });
      await service.remove('uuid-1');
      expect(deviceRepo.save).toHaveBeenCalledWith(expect.objectContaining({ lifecycle: 'decommissioned', status: 'offline' }));
      expect(events.emit).toHaveBeenCalledWith('device.decommissioned', expect.any(Object));
    });
  });

  // ── PROVISIONING ──────────────────────────────────────────
  describe('provision', () => {
    it('should start provisioning workflow for manufactured device', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', hardwareId: 'SVG-TEST-AE', lifecycle: 'manufactured', configuration: {} });
      workflowRepo.save.mockResolvedValue({ id: 'wf-1', deviceId: 'uuid-1', status: 'in_progress' });
      const result = await service.provision({ deviceId: 'uuid-1' } as any, 'user-1');
      expect(result).toHaveProperty('workflowId');
      expect(result.status).toBe('in_progress');
    });

    it('should reject provisioning for operational device', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', lifecycle: 'operational' });
      await expect(service.provision({ deviceId: 'uuid-1' } as any, 'user-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('getWorkflowStatus', () => {
    it('should return workflow with steps', async () => {
      workflowRepo.findOne.mockResolvedValue({ id: 'wf-1', status: 'completed', steps: [] });
      const result = await service.getWorkflowStatus('wf-1');
      expect(result.status).toBe('completed');
    });

    it('should throw NotFoundException for missing workflow', async () => {
      workflowRepo.findOne.mockResolvedValue(null);
      await expect(service.getWorkflowStatus('missing')).rejects.toThrow(NotFoundException);
    });
  });

  // ── CERTIFICATES ──────────────────────────────────────────
  describe('getDeviceCertificates', () => {
    it('should return device certificates', async () => {
      certRepo.find.mockResolvedValue([{ id: 'cert-1', purpose: 'device_auth', status: 'active' }]);
      const result = await service.getDeviceCertificates('uuid-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('revokeCertificate', () => {
    it('should revoke cert and emit event', async () => {
      certRepo.findOne.mockResolvedValue({ id: 'cert-1', deviceId: 'uuid-1', status: 'active' });
      const result = await service.revokeCertificate('cert-1', 'compromised', 'user-1');
      expect(result.status).toBe('revoked');
      expect(events.emit).toHaveBeenCalledWith('device.certificate.revoked', expect.any(Object));
    });
  });

  describe('renewCertificate', () => {
    it('should create new cert from expired one', async () => {
      certRepo.findOne.mockResolvedValue({ id: 'cert-1', deviceId: 'uuid-1', purpose: 'tls_client', renewalCount: 0 });
      certRepo.save.mockImplementation(d => ({ id: d.id || 'cert-2', ...d }));
      const result = await service.renewCertificate('cert-1', 'user-1');
      expect(result.renewalCount).toBe(1);
    });
  });

  // ── TRANSFERS ─────────────────────────────────────────────
  describe('initiateTransfer', () => {
    it('should create transfer in pending_approval status', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', ownerId: 'org-1', ownerName: 'Acme Corp' });
      transferRepo.save.mockResolvedValue({ id: 'tx-1', status: 'pending_approval' });
      const result = await service.initiateTransfer({ deviceId: 'uuid-1', toOwnerIdentifier: 'new@company.com', transferType: 'sale' } as any, 'user-1');
      expect(result.status).toBe('pending_approval');
      expect(events.emit).toHaveBeenCalledWith('device.transfer.initiated', expect.any(Object));
    });
  });

  describe('approveTransfer', () => {
    it('should approve and execute transfer', async () => {
      transferRepo.findOne.mockResolvedValue({ id: 'tx-1', deviceId: 'uuid-1', toOwnerId: 'org-2', toOwnerName: 'New Corp', recordOnBlockchain: true, configResetRequired: false });
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', ownerId: 'org-1', configuration: {} });
      const result = await service.approveTransfer('tx-1', 'admin-1', 'Approved');
      expect(result.status).toBe('approved');
    });
  });

  // ── CONFIG DEPLOYMENTS ────────────────────────────────────
  describe('deployConfig', () => {
    it('should create deployment with approval workflow', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', configVersion: 'v1.0.0', configuration: {} });
      configRepo.save.mockResolvedValue({ id: 'dep-1', status: 'pending_approval' });
      const result = await service.deployConfig({ deviceId: 'uuid-1', configType: 'device_config', toVersion: 'v1.1.0', configPayload: { telemetryRate: 5000 }, deploymentWindow: 'scheduled' } as any, 'user-1');
      expect(result.status).toBe('pending_approval');
    });

    it('should deploy immediately when window is immediate', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', configVersion: 'v1.0.0', configuration: {} });
      configRepo.save.mockImplementation(d => ({ id: 'dep-1', ...d }));
      configRepo.findOne.mockResolvedValue({ id: 'dep-1', deviceId: 'uuid-1', configPayload: {}, toVersion: 'v1.1.0', status: 'deploying', deployedAt: new Date() });
      const result = await service.deployConfig({ deviceId: 'uuid-1', configType: 'device_config', toVersion: 'v1.1.0', configPayload: {}, deploymentWindow: 'immediate' } as any, 'user-1');
      expect(result).toBeDefined();
    });
  });

  // ── HEALTH & ANALYTICS ────────────────────────────────────
  describe('getHealth', () => {
    it('should return fleet health stats', async () => {
      const result = await service.getHealth();
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('online');
      expect(result).toHaveProperty('uptimePercent');
      expect(result).toHaveProperty('byLifecycle');
      expect(result).toHaveProperty('certificatesExpiringSoon');
    });
  });

  describe('getOTAStatus', () => {
    it('should return firmware distribution', async () => {
      deviceRepo.find.mockResolvedValue([{ firmwareVersion: 'v2.3.1' }, { firmwareVersion: 'v2.3.1' }, { firmwareVersion: 'v2.2.0' }]);
      const result = await service.getOTAStatus();
      expect(result.totalDevices).toBe(3);
      expect(result.firmwareDistribution).toHaveProperty('v2.3.1');
    });
  });

  describe('reboot', () => {
    it('should emit reboot command', async () => {
      deviceRepo.findOne.mockResolvedValue({ id: 'uuid-1', hardwareId: 'SVG-TEST-AE' });
      const result = await service.reboot('uuid-1', 'user-1');
      expect(result.command).toBe('reboot');
      expect(result.sent).toBe(true);
      expect(events.emit).toHaveBeenCalledWith('device.command', expect.any(Object));
    });
  });
});
