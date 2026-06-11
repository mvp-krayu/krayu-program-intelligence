import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HasiService } from './hasi.service';
import { HasiCapture } from './entities/hasi-capture.entity';
import { HasiThreat } from './entities/hasi-threat.entity';
import { HasiFirewallRule } from './entities/hasi-firewall-rule.entity';
import { FleetEventEmitterService } from '../../events/fleet-event-emitter.service';
import { NotFoundException } from '@nestjs/common';

const mockRepo = () => ({
  find: jest.fn(), findOne: jest.fn(), create: jest.fn(d => d), save: jest.fn(d => ({ id: 'uuid-1', ...d })),
  count: jest.fn().mockResolvedValue(10), query: jest.fn().mockResolvedValue([]),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]), getMany: jest.fn().mockResolvedValue([]),
  })),
});
const mockEvents = () => ({ emit: jest.fn() });

describe('HasiService', () => {
  let service: HasiService;
  let captureRepo: ReturnType<typeof mockRepo>;
  let threatRepo: ReturnType<typeof mockRepo>;
  let ruleRepo: ReturnType<typeof mockRepo>;
  let events: ReturnType<typeof mockEvents>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HasiService,
        { provide: getRepositoryToken(HasiCapture), useFactory: mockRepo },
        { provide: getRepositoryToken(HasiThreat), useFactory: mockRepo },
        { provide: getRepositoryToken(HasiFirewallRule), useFactory: mockRepo },
        { provide: FleetEventEmitterService, useFactory: mockEvents },
      ],
    }).compile();
    service = module.get(HasiService);
    captureRepo = module.get(getRepositoryToken(HasiCapture));
    threatRepo = module.get(getRepositoryToken(HasiThreat));
    ruleRepo = module.get(getRepositoryToken(HasiFirewallRule));
    events = module.get(FleetEventEmitterService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  describe('ingestCapture', () => {
    it('should ingest full capture with threats and firewall rules', async () => {
      captureRepo.save.mockResolvedValue({ id: 'cap-1' });
      threatRepo.save.mockResolvedValue({ id: 'threat-1' });
      ruleRepo.save.mockResolvedValue({ id: 'rule-1' });
      const result = await service.ingestCapture({
        svgDeviceId: 'dev-1', svgHardwareId: 'SVG-TEST-AE', totalPackets: 15000,
        protocolSummary: { TCP: 8000, UDP: 4000, J1939: 2000, MQTT: 1000 },
        threats: [{ threatCategory: 'suspicious_port', severity: 'high', description: 'Port 4444 detected' }],
        firewallRules: [{ action: 'deny', direction: 'inbound', description: 'Block port 4444', severity: 'high' }],
      } as any);
      expect(result.captureId).toBe('cap-1');
      expect(result.ingested.packets).toBe(15000);
      expect(result.ingested.threats).toBe(1);
      expect(result.ingested.firewallRules).toBe(1);
      expect(events.emit).toHaveBeenCalledWith('hasi.threat.detected', expect.any(Object));
    });

    it('should handle capture without threats', async () => {
      captureRepo.save.mockResolvedValue({ id: 'cap-2' });
      const result = await service.ingestCapture({
        svgDeviceId: 'dev-1', svgHardwareId: 'SVG-CLEAN-AE', totalPackets: 5000,
        protocolSummary: { TCP: 3000, MQTT: 2000 },
      } as any);
      expect(result.ingested.threats).toBe(0);
      expect(result.ingested.firewallRules).toBe(0);
    });
  });

  describe('mitigateThreat', () => {
    it('should mitigate and emit event', async () => {
      threatRepo.findOne.mockResolvedValue({ id: 'threat-1', svgDeviceId: 'dev-1', status: 'active' });
      const result = await service.mitigateThreat('threat-1', { mitigationAction: 'Blocked IP via iptables', notes: 'Auto-mitigated' }, 'user-1');
      expect(result.status).toBe('mitigated');
      expect(events.emit).toHaveBeenCalledWith('hasi.threat.mitigated', expect.any(Object));
    });

    it('should throw for missing threat', async () => {
      threatRepo.findOne.mockResolvedValue(null);
      await expect(service.mitigateThreat('missing', { mitigationAction: 'test' }, 'user-1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deployFirewallRule', () => {
    it('should deploy rule to specific devices', async () => {
      ruleRepo.findOne.mockResolvedValue({ id: 'rule-1', status: 'approved' });
      const result = await service.deployFirewallRule('rule-1', { deviceIds: ['dev-1', 'dev-2'] }, 'user-1');
      expect(result.status).toBe('deployed');
      expect(result.deployedCount).toBe(2);
      expect(events.emit).toHaveBeenCalledWith('hasi.firewall.deployed', expect.any(Object));
    });

    it('should deploy fleet-wide', async () => {
      ruleRepo.findOne.mockResolvedValue({ id: 'rule-2', status: 'approved' });
      const result = await service.deployFirewallRule('rule-2', { fleetWide: true }, 'user-1');
      expect(result.fleetWide).toBe(true);
    });
  });

  describe('getFleetSecurityOverview', () => {
    it('should return comprehensive SOC metrics', async () => {
      captureRepo.query.mockResolvedValue([]);
      const result = await service.getFleetSecurityOverview();
      expect(result).toHaveProperty('totalCaptures');
      expect(result).toHaveProperty('totalThreats');
      expect(result).toHaveProperty('activeThreats');
      expect(result).toHaveProperty('threatsByCategory');
      expect(result).toHaveProperty('fleetProtocols');
    });
  });

  describe('getDeviceSecurityProfile', () => {
    it('should return device risk score', async () => {
      captureRepo.count.mockResolvedValue(5);
      threatRepo.find.mockResolvedValue([
        { status: 'active', severity: 'critical' },
        { status: 'active', severity: 'high' },
        { status: 'mitigated', severity: 'low' },
      ]);
      ruleRepo.find.mockResolvedValue([]);
      captureRepo.findOne.mockResolvedValue({ id: 'cap-1' });
      const result = await service.getDeviceSecurityProfile('dev-1');
      expect(result.totalCaptures).toBe(5);
      expect(result.activeThreats).toBe(2);
      expect(result.riskScore).toBeGreaterThan(0);
    });
  });
});
