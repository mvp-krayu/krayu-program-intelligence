import { Injectable } from '@nestjs/common';
import { success } from '../../common/dto';

@Injectable()
export class FinanceService {
  async getCostSummary() { return success({ totalCost: 980000, fuel: 287500, maintenance: 245000, labor: 350000, insurance: 55000, other: 42500, costPerKm: 2.35, costPerVehicle: 5505, budget: 1100000, variance: -120000 }); }
  async getTCO(vehicleId?: string) { return success({ vehicleId, acquisitionCost: 450000, operatingCostPerYear: 65000, depreciationPerYear: 45000, totalCostOfOwnership: 775000, costPerKm: 2.85, remainingUsefulLifeYears: 5 }); }
  async getInvoices(q: any) { return success({ total: 256, pending: 18, paid: 230, overdue: 8, totalAmount: 1250000 }); }
  async getBudgetVsActual() { return success({ budget: 1100000, actual: 980000, variance: 120000, byCategory: [{ category: 'Fuel', budget: 300000, actual: 287500 }, { category: 'Maintenance', budget: 260000, actual: 245000 }] }); }
  async getDriverPayroll() { return success({ totalDrivers: 85, totalPayroll: 425000, avgSalary: 5000, bonusPool: 42500, overtimeHours: 350 }); }
}
