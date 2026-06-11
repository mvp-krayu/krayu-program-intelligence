import { Test, TestingModule } from '@nestjs/testing';
import { FinanceService, FinanceController } from './finance.module';

describe('FinanceModule', () => {
  let controller: FinanceController;
  let service: FinanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanceController],
      providers: [FinanceService],
    }).compile();
    controller = module.get(FinanceController);
    service = module.get(FinanceService);
  });

  it('should be defined', () => { expect(controller).toBeDefined(); expect(service).toBeDefined(); });

  describe('FinanceService', () => {
    it('getCostSummary returns financial overview', async () => {
      const result = await service.getCostSummary();
      expect(result.data).toHaveProperty('totalCost');
      expect(result.data).toHaveProperty('fuel');
      expect(result.data).toHaveProperty('costPerKm');
      expect(result.data).toHaveProperty('budget');
    });

    it('getTCO returns total cost of ownership', async () => {
      const result = await service.getTCO();
      expect(result.data).toHaveProperty('acquisitionCost');
      expect(result.data).toHaveProperty('totalCostOfOwnership');
      expect(result.data).toHaveProperty('remainingUsefulLifeYears');
    });

    it('getInvoices returns invoice data', async () => {
      const result = await service.getInvoices({});
      expect(result.data).toHaveProperty('total');
      expect(result.data).toHaveProperty('overdue');
    });

    it('getBudgetVsActual returns comparison', async () => {
      const result = await service.getBudgetVsActual();
      expect(result.data).toHaveProperty('budget');
      expect(result.data).toHaveProperty('actual');
      expect(result.data).toHaveProperty('variance');
      expect(result.data.byCategory).toBeInstanceOf(Array);
    });

    it('getDriverPayroll returns payroll data', async () => {
      const result = await service.getDriverPayroll();
      expect(result.data).toHaveProperty('totalDrivers');
      expect(result.data).toHaveProperty('totalPayroll');
    });
  });
});
