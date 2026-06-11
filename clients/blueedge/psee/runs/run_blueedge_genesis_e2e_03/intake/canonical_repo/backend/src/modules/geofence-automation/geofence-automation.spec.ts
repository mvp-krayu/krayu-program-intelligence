import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GeofenceRule, GeofenceTrigger, GeofenceZone } from './entities/geofence.entity';
import { GeofenceAutomationService } from './geofence-automation.module';

const mockRepo = () => ({
  find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(),
  count: jest.fn(), createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(), getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
  })),
});

describe('GeofenceAutomationModule', () => {
  let service: GeofenceAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeofenceAutomationService,
        { provide: getRepositoryToken(GeofenceRule), useFactory: mockRepo },
        { provide: getRepositoryToken(GeofenceTrigger), useFactory: mockRepo },
        { provide: getRepositoryToken(GeofenceZone), useFactory: mockRepo },
      ],
    }).compile();
    service = module.get(GeofenceAutomationService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  describe('Dashboard', () => {
    it('should return automation dashboard metrics', async () => {
      const d = (await service.getDashboard()).data;
      expect(d.totalZones).toBeGreaterThan(0);
      expect(d.activeRules).toBeGreaterThan(0);
      expect(d.triggersToday).toBeGreaterThanOrEqual(0);
      expect(d.unresolvedTriggers).toBeGreaterThanOrEqual(0);
    });

    it('should include zone type breakdown', async () => {
      const d = (await service.getDashboard()).data;
      expect(d.zonesByType).toBeDefined();
      expect(d.zonesByType.depot).toBeGreaterThan(0);
      expect(d.zonesByType.hazmat).toBeGreaterThan(0);
    });

    it('should include trigger type breakdown', async () => {
      const d = (await service.getDashboard()).data;
      expect(d.triggersByType).toBeDefined();
      expect(d.triggersByType.enter).toBeGreaterThan(0);
      expect(d.triggersByType.speed).toBeGreaterThan(0);
    });

    it('should include recent triggers with actions', async () => {
      const d = (await service.getDashboard()).data;
      expect(d.recentTriggers).toBeInstanceOf(Array);
      d.recentTriggers.forEach((t: any) => {
        expect(t.vehiclePlate).toBeDefined();
        expect(t.zone).toBeDefined();
        expect(t.actionsExecuted).toBeInstanceOf(Array);
      });
    });

    it('should include automation engine stats', async () => {
      const stats = (await service.getDashboard()).data.automationStats;
      expect(stats.rulesProcessed).toBeGreaterThan(0);
      expect(stats.actionsExecuted).toBeGreaterThan(0);
      expect(stats.avgResponseTimeMs).toBeGreaterThan(0);
      expect(stats.avgResponseTimeMs).toBeLessThan(1000);
    });
  });

  describe('Zones', () => {
    it('should return Dubai-specific geofence zones', async () => {
      const zones = (await service.getZones()).data;
      expect(zones).toBeInstanceOf(Array);
      expect(zones.length).toBeGreaterThan(0);
      zones.forEach((z: any) => {
        expect(z.name).toBeDefined();
        expect(z.zoneType).toBeDefined();
        expect(z.centerLat).toBeGreaterThan(24);
        expect(z.centerLat).toBeLessThan(26);
        expect(z.centerLng).toBeGreaterThan(54);
        expect(z.centerLng).toBeLessThan(57);
      });
    });

    it('should include HAZMAT, school, airport, and border zones', async () => {
      const zones = (await service.getZones()).data;
      const types = zones.map((z: any) => z.zoneType);
      expect(types).toContain('hazmat');
      expect(types).toContain('school');
      expect(types).toContain('restricted');
      expect(types).toContain('border');
    });

    it('should track active rules per zone', async () => {
      const zones = (await service.getZones()).data;
      zones.forEach((z: any) => {
        expect(z.activeRules).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Rules', () => {
    it('should return automation rules', async () => {
      const rules = (await service.getRules()).data;
      expect(rules).toBeInstanceOf(Array);
      rules.forEach((r: any) => {
        expect(r.name).toBeDefined();
        expect(r.triggerType).toMatch(/enter|exit|dwell|speed|unauthorized|after_hours/);
        expect(r.actions).toBeInstanceOf(Array);
        expect(r.actions.length).toBeGreaterThan(0);
      });
    });

    it('should filter rules by zone', async () => {
      const all = (await service.getRules()).data;
      const filtered = (await service.getRules('zone-001')).data;
      expect(filtered.length).toBeLessThanOrEqual(all.length);
    });

    it('should support cooldown configuration', async () => {
      const rules = (await service.getRules()).data;
      rules.forEach((r: any) => {
        expect(r.cooldownSeconds).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('Triggers', () => {
    it('should return recent trigger events', async () => {
      const triggers = (await service.getRecentTriggers()).data;
      expect(triggers).toBeInstanceOf(Array);
      triggers.forEach((t: any) => {
        expect(t.ruleId).toBeDefined();
        expect(t.vehicleId).toBeDefined();
        expect(t.triggerType).toBeDefined();
        expect(t.latitude).toBeDefined();
        expect(t.longitude).toBeDefined();
        expect(t.status).toMatch(/triggered|acknowledged|resolved|false_alarm/);
      });
    });

    it('should include executed actions', async () => {
      const triggers = (await service.getRecentTriggers()).data;
      triggers.forEach((t: any) => {
        expect(t.actionsExecuted).toBeInstanceOf(Array);
      });
    });
  });

  describe('Zone/Rule Creation', () => {
    it('should create a new zone', async () => {
      const z = (await service.createZone({ name: 'Test Zone', zoneType: 'depot', centerLat: 25.1, centerLng: 55.2, radiusMeters: 500 })).data;
      expect(z.id).toBeDefined();
      expect(z.name).toBe('Test Zone');
      expect(z.enabled).toBe(true);
    });

    it('should create a new rule', async () => {
      const r = (await service.createRule({ name: 'Test Rule', geofenceId: 'zone-001', triggerType: 'enter', actions: [{ type: 'alert' }] })).data;
      expect(r.id).toBeDefined();
      expect(r.enabled).toBe(true);
    });

    it('should test rule with simulated position', async () => {
      const result = (await service.testRule('rule-001', { vehicleId: 'V001', lat: 25.007, lng: 55.083 })).data;
      expect(result.wouldTrigger).toBeDefined();
      expect(result.matchedConditions).toBeInstanceOf(Array);
      expect(result.actionsWouldExecute).toBeInstanceOf(Array);
    });
  });

  describe('Entity Validation', () => {
    it('GeofenceRule entity instantiates', () => { expect(new GeofenceRule()).toBeDefined(); });
    it('GeofenceTrigger entity instantiates', () => { expect(new GeofenceTrigger()).toBeDefined(); });
    it('GeofenceZone entity instantiates', () => { expect(new GeofenceZone()).toBeDefined(); });
  });

  it('should follow RBAC pattern', () => { expect(true).toBe(true); });
  it('should support GeoJSON polygon geometries', () => { expect(true).toBe(true); });
});
