import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService, AnalyticsController } from './analytics.module';

describe('AnalyticsModule', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [AnalyticsService],
    }).compile();
    controller = module.get(AnalyticsController);
    service = module.get(AnalyticsService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('AnalyticsService', () => {
    it('getFleetSummary returns KPIs', async () => {
      const result = await service.getFleetSummary();
      expect(result.data).toHaveProperty('totalVehicles');
      expect(result.data).toHaveProperty('activeToday');
      expect(result.data).toHaveProperty('totalTrips');
      expect(result.data).toHaveProperty('utilization');
      expect(result.data.alerts).toHaveProperty('critical');
    });

    it('getDriverAnalytics returns driver data', async () => {
      const result = await service.getDriverAnalytics({});
      expect(result.data).toHaveProperty('avgSafetyScore');
      expect(result.data).toHaveProperty('topPerformers');
    });

    it('getFuelAnalytics returns fuel data', async () => {
      const result = await service.getFuelAnalytics({});
      expect(result.data).toHaveProperty('totalConsumption');
      expect(result.data).toHaveProperty('costAED');
      expect(result.data.byFleetType).toHaveProperty('tanker');
    });

    it('getMaintenanceAnalytics returns maintenance data', async () => {
      const result = await service.getMaintenanceAnalytics();
      expect(result.data).toHaveProperty('totalCost');
      expect(result.data).toHaveProperty('mtbf');
    });

    it('getSafetyAnalytics returns safety data', async () => {
      const result = await service.getSafetyAnalytics();
      expect(result.data).toHaveProperty('totalEvents');
      expect(result.data).toHaveProperty('trend', 'improving');
    });

    it('getRevenueAnalytics returns revenue data', async () => {
      const result = await service.getRevenueAnalytics();
      expect(result.data).toHaveProperty('totalRevenue');
      expect(result.data).toHaveProperty('profit');
      expect(result.data).toHaveProperty('margin');
    });

    it('getComplianceAnalytics returns scores', async () => {
      const result = await service.getComplianceAnalytics();
      expect(result.data).toHaveProperty('overallScore');
      expect(result.data.overallScore).toBeGreaterThan(90);
    });

    it('nlQuery processes natural language', async () => {
      const result = await service.nlQuery('show me fuel costs');
      expect(result.data).toHaveProperty('query', 'show me fuel costs');
      expect(result.data).toHaveProperty('confidence');
      expect(result.data.confidence).toBeGreaterThanOrEqual(0);
    });

    it('getCustomDashboard returns widget config', async () => {
      const result = await service.getCustomDashboard({ widgets: ['fuel', 'safety'] });
      expect(result.data).toHaveProperty('widgets');
      expect(result.data.widgets).toEqual(['fuel', 'safety']);
    });
  });

  describe('AnalyticsController', () => {
    it('getFleetSummary delegates', async () => { expect((await controller.getFleetSummary()).data).toHaveProperty('totalVehicles'); });
    it('getDrivers delegates', async () => { expect((await controller.getDrivers({})).data).toHaveProperty('avgSafetyScore'); });
    it('getFuel delegates', async () => { expect((await controller.getFuel({})).data).toHaveProperty('totalConsumption'); });
    it('getMaintenance delegates', async () => { expect((await controller.getMaintenance()).data).toHaveProperty('totalCost'); });
    it('getSafety delegates', async () => { expect((await controller.getSafety()).data).toHaveProperty('totalEvents'); });
    it('getRevenue delegates', async () => { expect((await controller.getRevenue()).data).toHaveProperty('totalRevenue'); });
  });
});
