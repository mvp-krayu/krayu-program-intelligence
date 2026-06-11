import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ApiMarketplaceService, ApiMarketplaceController, ApiKey, WebhookSubscription, WebhookDeliveryLog } from './api-marketplace.module';

const mockRepo = () => ({ find: jest.fn(), findOne: jest.fn(), save: jest.fn(), create: jest.fn(), count: jest.fn(), update: jest.fn(), delete: jest.fn(), createQueryBuilder: jest.fn(() => ({ where: jest.fn().mockReturnThis(), andWhere: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), take: jest.fn().mockReturnThis(), getManyAndCount: jest.fn().mockResolvedValue([[], 0]) })) });

describe('API Marketplace Module', () => {
  let service: ApiMarketplaceService;
  let controller: ApiMarketplaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiMarketplaceController],
      providers: [
        ApiMarketplaceService,
        { provide: getRepositoryToken(ApiKey), useFactory: mockRepo },
        { provide: getRepositoryToken(WebhookSubscription), useFactory: mockRepo },
        { provide: getRepositoryToken(WebhookDeliveryLog), useFactory: mockRepo },
      ],
    }).compile();
    service = module.get(ApiMarketplaceService);
    controller = module.get(ApiMarketplaceController);
  });

  describe('Service', () => {
    it('should be defined', () => { expect(service).toBeDefined(); });

    it('should return marketplace dashboard', async () => {
      const result = await service.getDashboard();
      expect(result.data.apiKeys.total).toBeGreaterThan(0);
      expect(result.data.webhooks.total).toBeGreaterThan(0);
      expect(result.data.availableEvents).toBe(73);
      expect(result.data.apiVersion).toBe('v2.0');
    });

    it('should return API keys with masked prefixes', async () => {
      const result = await service.getApiKeys();
      expect(result.data.length).toBeGreaterThanOrEqual(5);
      result.data.forEach((key: any) => {
        expect(key.keyPrefix).toContain('****');
        expect(key.scopes).toBeDefined();
        expect(key.rateLimit).toBeDefined();
      });
    });

    it('should create API key with full key (shown once)', async () => {
      const result = await service.createApiKey({ name: 'Test Key', prefix: 'test', scopes: ['vehicles:read'] });
      expect(result.data.key).toBeDefined();
      expect(result.data.key).toContain('be_test_');
      expect(result.data.warning).toContain('Store this API key securely');
    });

    it('should rotate API key with grace period', async () => {
      const result = await service.rotateApiKey('key-001');
      expect(result.data.newKey).toBeDefined();
      expect(result.data.oldKeyValidUntil).toBeDefined();
      const gracePeriodMs = new Date(result.data.oldKeyValidUntil).getTime() - Date.now();
      expect(gracePeriodMs).toBeGreaterThan(3000000); // ~1 hour
    });

    it('should return API key usage analytics', async () => {
      const result = await service.getApiKeyUsage('key-001');
      expect(result.data.totalRequests).toBeGreaterThan(0);
      expect(result.data.byEndpoint).toBeDefined();
      expect(result.data.byDay).toBeDefined();
      expect(result.data.errorBreakdown).toBeDefined();
    });

    it('should return webhooks with delivery stats', async () => {
      const result = await service.getWebhooks();
      expect(result.data.length).toBeGreaterThanOrEqual(4);
      result.data.forEach((wh: any) => {
        expect(wh.events).toBeDefined();
        expect(wh.deliveryCount).toBeDefined();
        expect(wh.successRate).toBeDefined();
      });
    });

    it('should return 73 available webhook events in categories', async () => {
      const result = await service.getAvailableEvents();
      expect(result.data.totalEvents).toBe(73);
      expect(result.data.categories.length).toBeGreaterThanOrEqual(10);
      const allEvents = result.data.categories.flatMap((c: any) => c.events);
      expect(allEvents).toContain('trip.completed');
      expect(allEvents).toContain('vehicle.speed_exceeded');
      expect(allEvents).toContain('cargo.temperature_exceeded');
      expect(allEvents).toContain('ai.anomaly_detected');
    });

    it('should return webhook payload format with HMAC-SHA256', async () => {
      const result = await service.getAvailableEvents();
      expect(result.data.webhookFormat.signatureAlgorithm).toBe('HMAC-SHA256');
      expect(result.data.webhookFormat.retryPolicy.maxRetries).toBe(5);
      expect(result.data.webhookFormat.examplePayload.metadata.region).toBe('dubai');
    });

    it('should create webhook with secret', async () => {
      const result = await service.createWebhook({ name: 'Test', url: 'https://test.com/hook', events: ['trip.completed'] });
      expect(result.data.secret).toContain('whsec_');
      expect(result.data.warning).toContain('Store the webhook secret');
    });

    it('should test webhook delivery', async () => {
      const result = await service.testWebhook('wh-001');
      expect(result.data.testResult).toBe('success');
      expect(result.data.httpStatus).toBe(200);
      expect(result.data.testPayload.event).toBe('webhook.test');
    });

    it('should return webhook delivery history', async () => {
      const result = await service.getWebhookDeliveries('wh-001');
      expect(result.data.length).toBeGreaterThan(0);
      const retrying = result.data.find((d: any) => d.status === 'retrying');
      expect(retrying).toBeDefined();
      expect(retrying.nextRetryAt).toBeDefined();
    });

    it('should return API documentation with SDKs', async () => {
      const result = await service.getApiDocumentation();
      expect(result.data.version).toBe('v2.0');
      expect(result.data.endpoints.total).toBe(445);
      expect(result.data.sdks).toHaveLength(4);
      const languages = result.data.sdks.map((s: any) => s.language);
      expect(languages).toContain('Python');
      expect(languages).toContain('Go');
    });

    it('should return API scopes', async () => {
      const result = await service.getAvailableScopes();
      expect(result.data.length).toBeGreaterThanOrEqual(15);
      const scopeNames = result.data.map((s: any) => s.scope);
      expect(scopeNames).toContain('vehicles:read');
      expect(scopeNames).toContain('admin');
    });
  });

  describe('Controller', () => {
    it('should be defined', () => { expect(controller).toBeDefined(); });
    it('should have getDashboard', () => { expect(controller.getDashboard).toBeDefined(); });
    it('should have getApiKeys', () => { expect(controller.getApiKeys).toBeDefined(); });
    it('should have getWebhooks', () => { expect(controller.getWebhooks).toBeDefined(); });
    it('should have getAvailableEvents', () => { expect(controller.getAvailableEvents).toBeDefined(); });
    it('should have getDocs', () => { expect(controller.getDocs).toBeDefined(); });
    it('should have getScopes', () => { expect(controller.getScopes).toBeDefined(); });
  });
});
