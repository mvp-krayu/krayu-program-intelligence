import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationHubService, IntegrationHubController } from './integration-hub.module';

describe('Integration Hub Module', () => {
  let service: IntegrationHubService;
  let controller: IntegrationHubController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IntegrationHubController],
      providers: [IntegrationHubService],
    }).compile();
    service = module.get(IntegrationHubService);
    controller = module.get(IntegrationHubController);
  });

  describe('Service', () => {
    it('should be defined', () => { expect(service).toBeDefined(); });

    it('should return unified dashboard', async () => {
      const result = await service.getDashboard();
      expect(result.data.overview.totalIntegrations).toBe(12);
      expect(result.data.overview.activeIntegrations).toBe(10);
      expect(result.data.integrationsByCategory.notifications.channels).toContain('WhatsApp');
      expect(result.data.integrationsByCategory.erp.systems).toContain('SAP S/4HANA');
    });

    it('should return cost summary in AED', async () => {
      const result = await service.getDashboard();
      expect(result.data.costSummary.grandTotalAed).toBeGreaterThan(0);
      expect(result.data.costSummary.notification.totalAed).toBeGreaterThan(0);
      expect(result.data.costSummary.erp.totalAed).toBeGreaterThan(0);
    });

    it('should return real-time metrics', async () => {
      const result = await service.getDashboard();
      expect(result.data.realtimeMetrics.messagesPerMinute).toBeGreaterThan(0);
      expect(result.data.realtimeMetrics.apiRequestsPerMinute).toBeGreaterThan(0);
      expect(result.data.realtimeMetrics.errorRate).toBeLessThan(5);
    });

    it('should return health overview for all components', async () => {
      const result = await service.getHealthOverview();
      expect(result.data.components.length).toBeGreaterThanOrEqual(9);
      const healthy = result.data.components.filter((c: any) => c.status === 'healthy');
      expect(healthy.length).toBeGreaterThanOrEqual(7);
      const degraded = result.data.components.find((c: any) => c.status === 'degraded');
      expect(degraded).toBeDefined();
      expect(degraded.name).toContain('Dynamics');
    });

    it('should return data flows between systems', async () => {
      const result = await service.getDataFlows();
      expect(result.data.flows.length).toBeGreaterThanOrEqual(6);
      const sapFlow = result.data.flows.find((f: any) => f.destination === 'SAP S/4HANA');
      expect(sapFlow).toBeDefined();
      expect(sapFlow.entities).toContain('vehicle_status');
      const whatsappFlow = result.data.flows.find((f: any) => f.destination === 'Twilio');
      expect(whatsappFlow).toBeDefined();
      expect(whatsappFlow.frequency).toBe('real_time');
    });

    it('should return audit log', async () => {
      const result = await service.getAuditLog({});
      expect(result.data.items.length).toBeGreaterThan(0);
      const actions = result.data.items.map((i: any) => i.action);
      expect(actions).toContain('erp.sync_triggered');
      expect(actions).toContain('webhook.delivery');
      expect(actions).toContain('api_key.created');
    });

    it('should return integration metrics', async () => {
      const result = await service.getIntegrationMetrics('24h');
      expect(result.data.notifications.sent).toBeGreaterThan(0);
      expect(result.data.erp.syncs).toBeGreaterThan(0);
      expect(result.data.api.totalRequests).toBeGreaterThan(0);
      expect(result.data.webhooks.deliveries).toBeGreaterThan(0);
    });

    it('should run diagnostics with 7 checks', async () => {
      const result = await service.runDiagnostics();
      expect(result.data.results).toHaveLength(7);
      const passed = result.data.results.filter((r: any) => r.status === 'pass');
      expect(passed.length).toBeGreaterThanOrEqual(6);
      expect(result.data.overallStatus).toBe('healthy');
      expect(result.data.recommendation).toContain('Dynamics');
    });

    it('should include certificate expiry check', async () => {
      const result = await service.runDiagnostics();
      const certCheck = result.data.results.find((r: any) => r.check === 'Certificate Expiry');
      expect(certCheck).toBeDefined();
      expect(certCheck.status).toBe('pass');
    });
  });

  describe('Controller', () => {
    it('should be defined', () => { expect(controller).toBeDefined(); });
    it('should have getDashboard', () => { expect(controller.getDashboard).toBeDefined(); });
    it('should have getHealth', () => { expect(controller.getHealth).toBeDefined(); });
    it('should have getDataFlows', () => { expect(controller.getDataFlows).toBeDefined(); });
    it('should have getMetrics', () => { expect(controller.getMetrics).toBeDefined(); });
    it('should have getAuditLog', () => { expect(controller.getAuditLog).toBeDefined(); });
    it('should have runDiagnostics', () => { expect(controller.runDiagnostics).toBeDefined(); });
  });
});
