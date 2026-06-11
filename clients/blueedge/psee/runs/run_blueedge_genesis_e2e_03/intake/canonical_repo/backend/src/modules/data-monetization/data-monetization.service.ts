import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { DataProduct } from './entities/data-product.entity';

@Injectable()
export class DataMonetizationService extends BaseCrudService<DataProduct> {
  constructor(@InjectRepository(DataProduct) repo: Repository<DataProduct>) { super(repo); }

  async getDashboard() {
    return success({
      totalRevenue: { annualArrAed: { low: 19084000, high: 32296000 }, monthlyRunRateAed: 1590333, marginalCost: 'Near zero — data already collected by SVG devices' },
      streams: [
        { id: 'UC-MN-01', name: 'OEM Field Intelligence Subscriptions', status: 'active', arrLowAed: 1761600, arrHighAed: 2936000, subscribers: 8, pct: 9 },
        { id: 'UC-MN-02', name: 'City Road Condition SaaS', status: 'active', arrLowAed: 5505000, arrHighAed: 22020000, clients: 3, pct: 68 },
        { id: 'UC-MN-03', name: 'Fleet Data Marketplace & API', status: 'active', arrLowAed: 1835000, arrHighAed: 7340000, buyers: 52, pct: 23 },
      ],
      businessModelShift: 'Fleet management vendor → Mobility data platform',
      svgAmortization: 'SVG device cost amortized across fleet operations AND data revenue — unbeatable TCO',
    });
  }

  // ── UC-MN-01: OEM Field Intelligence Subscriptions ──
  async getOEMSubscriptions() {
    return success({
      tiers: [
        { tier: 'Basic', pricePerVehicleYear: 50, features: ['Failure rates by model', 'Component lifecycle stats', 'Quarterly summary reports'], privacy: 'FHE-encrypted aggregates only' },
        { tier: 'Professional', pricePerVehicleYear: 120, features: ['Climate/road/driver correlation', 'Monthly detailed reports', 'API access', 'Custom KPI dashboards'], privacy: 'FHE-encrypted — granular aggregates' },
        { tier: 'Enterprise', pricePerVehicleYear: 200, features: ['Raw telemetry access (anonymized)', 'R&D consultation', 'Weekly reports', 'Custom ML model training', 'Dedicated support'], privacy: 'Contractual — anonymized raw data' },
      ],
      subscribers: [
        { oem: 'MAN Truck & Bus', tier: 'Enterprise', vehicles: 1200, annualRevenue: 240000, currency: 'USD', renewalDate: '2027-03-15', satisfaction: 4.8 },
        { oem: 'Volvo Trucks', tier: 'Professional', vehicles: 800, annualRevenue: 96000, currency: 'USD', renewalDate: '2027-01-20', satisfaction: 4.5 },
        { oem: 'Hino Motors', tier: 'Basic', vehicles: 350, annualRevenue: 17500, currency: 'USD', renewalDate: '2026-09-01', satisfaction: 4.2 },
        { oem: 'Tata Motors', tier: 'Professional', vehicles: 420, annualRevenue: 50400, currency: 'USD', renewalDate: '2027-06-30', satisfaction: 4.4 },
        { oem: 'Yutong (Buses)', tier: 'Basic', vehicles: 280, annualRevenue: 14000, currency: 'USD', renewalDate: '2026-12-15', satisfaction: 4.1 },
        { oem: 'BYD (EV Buses)', tier: 'Professional', vehicles: 184, annualRevenue: 22080, currency: 'USD', renewalDate: '2027-04-01', satisfaction: 4.6 },
        { oem: 'Scania', tier: 'Enterprise', vehicles: 180, annualRevenue: 36000, currency: 'USD', renewalDate: '2027-02-28', satisfaction: 4.7 },
        { oem: 'DAF Trucks', tier: 'Basic', vehicles: 150, annualRevenue: 7500, currency: 'USD', renewalDate: '2026-11-30', satisfaction: 4.0 },
      ],
      totals: { totalVehiclesCovered: 3564, totalAnnualRevenue: 483480, avgRevenuePerVehicle: 135.7, retentionRate: 96 },
    });
  }

  // ── UC-MN-02: City Road Condition SaaS ──
  async getCitySaaS() {
    return success({
      products: [
        { name: 'Road Quality Maps', description: 'Real-time + historical road condition maps', delivery: 'Web Dashboard + API' },
        { name: 'Pothole/Hazard Alert Feed', description: 'GPS-located hazard alerts with severity', delivery: 'REST API + Webhooks' },
        { name: 'Predictive Degradation Reports', description: 'Quarterly forecast of road deterioration', delivery: 'PDF + API' },
        { name: 'Traffic Flow Analytics', description: 'Peak/off-peak traffic patterns per road', delivery: 'Dashboard + API' },
        { name: 'Emergency Route Monitoring', description: 'Real-time condition for ambulance/fire routes', delivery: 'Streaming API' },
      ],
      clients: [
        { city: 'Dubai', authority: 'RTA Dubai', contractAed: 7340000, contractUsd: 2000000, period: 'annual', status: 'active', startDate: '2025-07-01', dataFeeds: 6, satisfactionScore: 4.9 },
        { city: 'Sharjah', authority: 'Sharjah Roads & Transport', contractAed: 1835000, contractUsd: 500000, period: 'annual', status: 'active', startDate: '2025-10-15', dataFeeds: 2, satisfactionScore: 4.5 },
        { city: 'Abu Dhabi', authority: 'Integrated Transport Centre', contractAed: 2752500, contractUsd: 750000, period: 'annual', status: 'negotiating', startDate: null, dataFeeds: 0 },
      ],
      pipeline: [
        { city: 'Riyadh', authority: 'Royal Commission for Riyadh', estimatedAed: 3670000, probability: 65, stage: 'proposal' },
        { city: 'Doha', authority: 'Ministry of Transport Qatar', estimatedAed: 2752500, probability: 45, stage: 'initial_contact' },
        { city: 'Zurich', authority: 'Canton Zürich Roads', estimatedAed: 5505000, probability: 30, stage: 'exploration' },
      ],
      totalActiveArr: { aed: 11927500, usd: 3250000 },
      budgetSavingsForCities: '20-35% of annual road maintenance budgets',
    });
  }

  // ── UC-MN-03: Fleet Data Marketplace & Analytics API ──
  async getDataMarketplace() {
    return success({
      products: [
        { name: 'Traffic Patterns', buyers: 'Logistics & delivery companies', pricing: '$0.01-$1.00/query', subscribers: 18, monthlyQueries: 126000, monthlyRevenueAed: 46200 },
        { name: 'Demand Forecasting', buyers: 'Ride-hailing platforms', pricing: '$5K-$50K/year', subscribers: 7, monthlyRevenueAed: 85750 },
        { name: 'Driver Behavior Benchmarks', buyers: 'Insurance actuaries', pricing: '$10K-$30K/year', subscribers: 12, monthlyRevenueAed: 73500 },
        { name: 'Emissions Data', buyers: 'ESG rating agencies', pricing: '$15K-$25K/year', subscribers: 5, monthlyRevenueAed: 30625 },
        { name: 'Fleet Usage Benchmarks', buyers: 'Fleet operators & OEMs', pricing: '$0.05/query', subscribers: 10, monthlyQueries: 42000, monthlyRevenueAed: 7700 },
      ],
      infrastructure: { exchange: 'Blockchain-powered (UC-BC-04)', privacy: 'FHE-encrypted (UC-PR-01)', licensing: 'Smart contract automated', payments: 'Micro-payments via L2 state channels' },
      metrics: { totalBuyers: 52, totalMonthlyRevenueAed: 243775, annualProjectedAed: 2925300, avgQueryPriceAed: 0.18, dataQualitySla: 99.2 },
    });
  }

  async getRevenueProjection(years: number = 3) {
    return success({
      projections: [
        { year: 1, oemAed: 1761600, cityAed: 9175000, marketplaceAed: 2925300, totalAed: 13861900, growthPct: null },
        { year: 2, oemAed: 3523200, cityAed: 16515000, marketplaceAed: 5850600, totalAed: 25888800, growthPct: 86.7 },
        { year: 3, oemAed: 5872000, cityAed: 25692500, marketplaceAed: 10238550, totalAed: 41803050, growthPct: 61.5 },
      ],
      assumptions: ['40% OEM adoption rate scaling to 80%', '3 cities Year 1 growing to 6 cities', 'Data marketplace 52 buyers scaling to 200+', 'Fleet size growing 30% annually'],
    });
  }

  async createDataProduct(dto: any) {
    return success({ productId: `DP-${Date.now()}`, status: 'created', ...dto });
  }
}
