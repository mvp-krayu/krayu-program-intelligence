import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationProvidersService, NotificationProvidersController, NotificationProvider, NotificationRule, NotificationLog } from './integration-notifications.module';

const mockRepo = () => ({ find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(), count: jest.fn(), update: jest.fn(), delete: jest.fn(), createQueryBuilder: jest.fn(() => ({ where: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), take: jest.fn().mockReturnThis(), getManyAndCount: jest.fn().mockResolvedValue([[], 0]) })) });

describe('Integration Notifications Module', () => {
  let service: NotificationProvidersService;
  let controller: NotificationProvidersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationProvidersController],
      providers: [
        NotificationProvidersService,
        { provide: getRepositoryToken(NotificationProvider), useFactory: mockRepo },
        { provide: getRepositoryToken(NotificationRule), useFactory: mockRepo },
        { provide: getRepositoryToken(NotificationLog), useFactory: mockRepo },
      ],
    }).compile();
    service = module.get(NotificationProvidersService);
    controller = module.get(NotificationProvidersController);
  });

  describe('Service', () => {
    it('should be defined', () => { expect(service).toBeDefined(); });

    it('should return providers dashboard', async () => {
      const result = await service.getProvidersDashboard();
      expect(result.data.providers).toHaveLength(4);
      expect(result.data.providers[0].type).toBe('whatsapp');
      expect(result.data.providers[1].type).toBe('sms');
      expect(result.data.providers[2].type).toBe('push');
      expect(result.data.providers[3].type).toBe('email');
      expect(result.data.totalCostAed).toBeGreaterThan(0);
    });

    it('should return provider health metrics', async () => {
      const result = await service.getProviderHealth('prov-001');
      expect(result.data.status).toBe('healthy');
      expect(result.data.metrics.latency).toBeDefined();
      expect(result.data.metrics.deliveryRate).toBeDefined();
      expect(result.data.metrics.quota).toBeDefined();
    });

    it('should test provider connectivity', async () => {
      const result = await service.testProvider('prov-001', { testType: 'connectivity' });
      expect(result.data.result).toBe('success');
      expect(result.data.details.connectionOk).toBe(true);
      expect(result.data.details.authenticationOk).toBe(true);
    });

    it('should configure provider with masked credentials', async () => {
      const result = await service.configureProvider('prov-001', { accountSid: 'AC1234567890', authToken: 'secret123' });
      expect(result.data.updated).toBe(true);
      expect(result.data.config.accountSid).toContain('***');
      expect(result.data.config.authToken).toBe('***masked***');
    });

    it('should return notification rules', async () => {
      const result = await service.getRules();
      expect(result.data.length).toBeGreaterThanOrEqual(8);
      expect(result.data[0].triggerEvent).toBeDefined();
      expect(result.data[0].actions).toBeDefined();
      const hazmatRule = result.data.find((r: any) => r.name.includes('HAZMAT'));
      expect(hazmatRule).toBeDefined();
      expect(hazmatRule.fleetType).toBe('tanker');
    });

    it('should create notification rule', async () => {
      const result = await service.createRule({ name: 'Test Rule', triggerEvent: 'vehicle.speed_exceeded', conditions: { speedKmh: { gt: 100 } }, actions: [{ channel: 'sms', recipients: ['driver'] }] });
      expect(result.data.id).toBeDefined();
      expect(result.data.validation.valid).toBe(true);
    });

    it('should test rule (dry run)', async () => {
      const result = await service.testRule('rule-001', { testConditions: { speedKmh: 135 } });
      expect(result.data.testResult).toBe('would_trigger');
      expect(result.data.dryRun).toBe(true);
      expect(result.data.wouldSend).toBeDefined();
    });

    it('should return delivery analytics', async () => {
      const result = await service.getDeliveryAnalytics('7d');
      expect(result.data.summary.totalSent).toBeGreaterThan(0);
      expect(result.data.byChannel.whatsapp).toBeDefined();
      expect(result.data.byChannel.sms).toBeDefined();
      expect(result.data.topFailureReasons).toBeDefined();
    });

    it('should return delivery logs', async () => {
      const result = await service.getDeliveryLogs({});
      expect(result.data.items).toBeDefined();
      expect(result.data.items[0].channel).toBeDefined();
      expect(result.data.items[0].status).toBeDefined();
    });

    it('should return webhook configuration', async () => {
      const result = await service.getWebhookConfig();
      expect(result.data.inbound.url).toContain('blueedge.ae');
      expect(result.data.statusCallback.events).toContain('delivered');
    });

    it('should process inbound webhook with Arabic response', async () => {
      const result = await service.processInboundWebhook({ From: '+971-50-123-4567', Body: 'نعم، تم التأكيد' });
      expect(result.data.received).toBe(true);
      expect(result.data.autoResponse).toBeDefined();
      expect(result.data.autoResponse.template).toBe('trip_confirmed');
    });
  });

  describe('Controller', () => {
    it('should be defined', () => { expect(controller).toBeDefined(); });
    it('should have getDashboard', () => { expect(controller.getDashboard).toBeDefined(); });
    it('should have getRules', () => { expect(controller.getRules).toBeDefined(); });
    it('should have getAnalytics', () => { expect(controller.getAnalytics).toBeDefined(); });
    it('should have getLogs', () => { expect(controller.getLogs).toBeDefined(); });
    it('should have getWebhooks', () => { expect(controller.getWebhooks).toBeDefined(); });
    it('should have inboundWebhook', () => { expect(controller.inboundWebhook).toBeDefined(); });
  });
});
