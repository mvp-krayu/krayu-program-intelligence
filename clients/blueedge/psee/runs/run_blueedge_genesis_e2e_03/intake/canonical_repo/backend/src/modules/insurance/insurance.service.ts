import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { InsurancePolicy } from './entities/insurance-policy.entity';

// ── Types ────────────────────────────────────────────────────
interface DwvsPremiumInput {
  vehicleId: string;
  avgDwvs: number;
  tpmSignedBlocks: number;
  totalBlocks: number;
  fleetAvgDwvs: number;
  harshEventRate: number;
  dtcRate: number;
  totalKm: number;
  sessionCount: number;
}

interface PremiumComputation {
  basePremiumAED: number;
  dwvsDiscount: number;
  tpmBonus: number;
  fleetDiscount: number;
  claimsAdjustment: number;
  finalPremiumAED: number;
  savingsAED: number;
  savingsPct: number;
  breakdown: { factor: string; adjustment: number; reason: string }[];
}

interface InsuranceSubmission {
  policyId: string;
  vehicleId: string;
  sessionBlocks: {
    blockNumber: number;
    driverId: string;
    driverName: string;
    startTime: string;
    endTime: string;
    distanceKm: number;
    dwvs: number;
    wearIndex: number;
    tpmSigned: boolean;
    blockHash: string;
    harshBrakes: number;
    harshAccelerations: number;
    dtcCount: number;
  }[];
  periodStart: string;
  periodEnd: string;
}

interface InsuranceAnalytics {
  totalPolicies: number;
  activePolicies: number;
  totalPremiumAED: number;
  totalSavingsAED: number;
  avgDiscountPct: number;
  tpmCoverage: number;
  expiringThisMonth: number;
  claimsRatio: number;
  fleetRiskScore: number;
  byFleetType: { fleetType: string; policies: number; avgDiscount: number; avgDwvs: number }[];
  byProvider: { providerName: string; policies: number; totalPremium: number }[];
}

interface ProviderConfig {
  id: string;
  name: string;
  apiEndpoint: string;
  supportsDwvs: boolean;
  supportsTpmVerification: boolean;
  dataFormat: 'json' | 'xml' | 'csv';
  refreshInterval: 'monthly' | 'quarterly' | 'annual';
}

// ── Mock Data ────────────────────────────────────────────────
const MOCK_PROVIDERS: ProviderConfig[] = [
  { id: 'prov-001', name: 'Emirates Insurance', apiEndpoint: 'https://api.emirates-ins.ae/v2', supportsDwvs: true, supportsTpmVerification: true, dataFormat: 'json', refreshInterval: 'monthly' },
  { id: 'prov-002', name: 'Oman Insurance', apiEndpoint: 'https://api.omaninsurance.ae/fleet', supportsDwvs: true, supportsTpmVerification: false, dataFormat: 'json', refreshInterval: 'quarterly' },
  { id: 'prov-003', name: 'AXA Gulf', apiEndpoint: 'https://api.axa-gulf.com/commercial', supportsDwvs: false, supportsTpmVerification: false, dataFormat: 'xml', refreshInterval: 'annual' },
  { id: 'prov-004', name: 'Zurich UAE', apiEndpoint: 'https://api.zurich.ae/fleet-connect', supportsDwvs: true, supportsTpmVerification: true, dataFormat: 'json', refreshInterval: 'monthly' },
];

const MOCK_POLICIES: Partial<InsurancePolicy>[] = [
  { id: 'ins-001', vehicleId: 'TK-0847', policyNumber: 'EI-FL-2025-001', providerName: 'Emirates Insurance', providerId: 'prov-001', policyType: 'comprehensive', status: 'active', basePremiumAED: 18500, adjustedPremiumAED: 16280, dwvsDiscountPct: 12.0, fleetAvgDwvs: 0.42, vehicleAvgDwvs: 0.35, tpmBlocksSubmitted: 285, deductibleAED: 2500, coverageLimitAED: 2000000, effectiveDate: new Date('2025-01-01'), expiryDate: new Date('2025-12-31'), totalClaims: 1, totalClaimedAED: 12400, submissionHistory: [] },
  { id: 'ins-002', vehicleId: 'TK-0923', policyNumber: 'EI-FL-2025-002', providerName: 'Emirates Insurance', providerId: 'prov-001', policyType: 'hazmat', status: 'active', basePremiumAED: 24000, adjustedPremiumAED: 21120, dwvsDiscountPct: 12.0, fleetAvgDwvs: 0.42, vehicleAvgDwvs: 0.32, tpmBlocksSubmitted: 218, deductibleAED: 5000, coverageLimitAED: 5000000, effectiveDate: new Date('2025-01-01'), expiryDate: new Date('2025-12-31'), totalClaims: 0, totalClaimedAED: 0, submissionHistory: [] },
  { id: 'ins-003', vehicleId: 'BUS-201', policyNumber: 'OI-BUS-2025-001', providerName: 'Oman Insurance', providerId: 'prov-002', policyType: 'fleet_blanket', status: 'active', basePremiumAED: 15200, adjustedPremiumAED: 14440, dwvsDiscountPct: 5.0, fleetAvgDwvs: 0.42, vehicleAvgDwvs: 0.48, tpmBlocksSubmitted: 342, deductibleAED: 1500, coverageLimitAED: 1000000, effectiveDate: new Date('2025-03-01'), expiryDate: new Date('2026-02-28'), totalClaims: 2, totalClaimedAED: 8900, submissionHistory: [] },
  { id: 'ins-004', vehicleId: 'BUS-305', policyNumber: 'OI-BUS-2025-002', providerName: 'Oman Insurance', providerId: 'prov-002', policyType: 'fleet_blanket', status: 'active', basePremiumAED: 15200, adjustedPremiumAED: 14060, dwvsDiscountPct: 7.5, fleetAvgDwvs: 0.42, vehicleAvgDwvs: 0.52, tpmBlocksSubmitted: 298, deductibleAED: 1500, coverageLimitAED: 1000000, effectiveDate: new Date('2025-03-01'), expiryDate: new Date('2026-02-28'), totalClaims: 0, totalClaimedAED: 0, submissionHistory: [] },
  { id: 'ins-005', vehicleId: 'TX-5501', policyNumber: 'ZU-TX-2025-001', providerName: 'Zurich UAE', providerId: 'prov-004', policyType: 'comprehensive', status: 'active', basePremiumAED: 9800, adjustedPremiumAED: 8820, dwvsDiscountPct: 10.0, fleetAvgDwvs: 0.42, vehicleAvgDwvs: 0.42, tpmBlocksSubmitted: 410, deductibleAED: 1000, coverageLimitAED: 500000, effectiveDate: new Date('2025-01-01'), expiryDate: new Date('2025-12-31'), totalClaims: 3, totalClaimedAED: 15600, submissionHistory: [] },
  { id: 'ins-006', vehicleId: 'TX-5622', policyNumber: 'ZU-TX-2025-002', providerName: 'Zurich UAE', providerId: 'prov-004', policyType: 'comprehensive', status: 'active', basePremiumAED: 9800, adjustedPremiumAED: 8624, dwvsDiscountPct: 12.0, fleetAvgDwvs: 0.42, vehicleAvgDwvs: 0.38, tpmBlocksSubmitted: 365, deductibleAED: 1000, coverageLimitAED: 500000, effectiveDate: new Date('2025-01-01'), expiryDate: new Date('2025-12-31'), totalClaims: 1, totalClaimedAED: 4200, submissionHistory: [] },
];

@Injectable()
export class InsuranceService {
  private readonly logger = new Logger(InsuranceService.name);

  constructor(
    @InjectRepository(InsurancePolicy)
    private readonly repo: Repository<InsurancePolicy>,
  ) {}

  // ── CRUD ───────────────────────────────────────────────────

  async findAll(query: { status?: string; vehicleId?: string; providerId?: string; page?: number; limit?: number }) {
    const { status, vehicleId, providerId, page = 1, limit = 20 } = query;
    let policies = [...MOCK_POLICIES] as InsurancePolicy[];
    if (status) policies = policies.filter(p => p.status === status);
    if (vehicleId) policies = policies.filter(p => p.vehicleId === vehicleId);
    if (providerId) policies = policies.filter(p => p.providerId === providerId);
    const total = policies.length;
    const offset = (page - 1) * limit;
    return { data: policies.slice(offset, offset + limit), total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string) {
    const policy = MOCK_POLICIES.find(p => p.id === id);
    if (!policy) throw new NotFoundException(`Insurance policy ${id} not found`);
    return policy;
  }

  async findByVehicle(vehicleId: string) {
    return MOCK_POLICIES.filter(p => p.vehicleId === vehicleId);
  }

  // ── Premium Computation (DWVS-Based) ──────────────────────

  computePremium(input: DwvsPremiumInput): PremiumComputation {
    const basePremium = 15000; // Example base for computation
    const breakdown: PremiumComputation['breakdown'] = [];

    // 1. DWVS Discount (core innovation)
    let dwvsDiscount = 0;
    if (input.avgDwvs < 0.3) {
      dwvsDiscount = 0.15; // 15% discount for excellent drivers
      breakdown.push({ factor: 'DWVS Excellent (<0.3)', adjustment: -0.15, reason: `Vehicle avg DWVS ${input.avgDwvs.toFixed(3)} — minimal wear impact` });
    } else if (input.avgDwvs < 0.5) {
      dwvsDiscount = 0.10;
      breakdown.push({ factor: 'DWVS Good (0.3–0.5)', adjustment: -0.10, reason: `Vehicle avg DWVS ${input.avgDwvs.toFixed(3)} — below fleet average` });
    } else if (input.avgDwvs < 0.7) {
      dwvsDiscount = 0.03;
      breakdown.push({ factor: 'DWVS Fair (0.5–0.7)', adjustment: -0.03, reason: `Vehicle avg DWVS ${input.avgDwvs.toFixed(3)} — moderate wear` });
    } else {
      dwvsDiscount = -0.05; // Surcharge for poor drivers
      breakdown.push({ factor: 'DWVS Poor (>0.7)', adjustment: 0.05, reason: `Vehicle avg DWVS ${input.avgDwvs.toFixed(3)} — elevated risk` });
    }

    // 2. TPM Verification Bonus
    const tpmRatio = input.tpmSignedBlocks / Math.max(input.totalBlocks, 1);
    let tpmBonus = 0;
    if (tpmRatio > 0.95) {
      tpmBonus = 0.05;
      breakdown.push({ factor: 'TPM Coverage >95%', adjustment: -0.05, reason: `${(tpmRatio * 100).toFixed(0)}% blocks cryptographically verified` });
    } else if (tpmRatio > 0.80) {
      tpmBonus = 0.02;
      breakdown.push({ factor: 'TPM Coverage 80-95%', adjustment: -0.02, reason: `${(tpmRatio * 100).toFixed(0)}% blocks verified` });
    }

    // 3. Fleet-level discount
    let fleetDiscount = 0;
    if (input.fleetAvgDwvs < 0.4) {
      fleetDiscount = 0.03;
      breakdown.push({ factor: 'Fleet DWVS Bonus', adjustment: -0.03, reason: `Fleet avg ${input.fleetAvgDwvs.toFixed(3)} — well-managed fleet` });
    }

    // 4. Claims adjustment (simulated)
    const claimsAdjustment = 0;
    breakdown.push({ factor: 'Claims History', adjustment: 0, reason: 'No recent at-fault claims' });

    // 5. Harsh event adjustment
    if (input.harshEventRate > 0.3) {
      breakdown.push({ factor: 'Harsh Event Surcharge', adjustment: 0.02, reason: `Harsh event rate ${(input.harshEventRate * 100).toFixed(0)}% exceeds threshold` });
    }

    const totalDiscount = dwvsDiscount + tpmBonus + fleetDiscount - claimsAdjustment;
    const finalPremium = basePremium * (1 - totalDiscount);
    const savings = basePremium - finalPremium;

    return {
      basePremiumAED: basePremium,
      dwvsDiscount,
      tpmBonus,
      fleetDiscount,
      claimsAdjustment,
      finalPremiumAED: Math.round(finalPremium * 100) / 100,
      savingsAED: Math.round(savings * 100) / 100,
      savingsPct: Math.round(totalDiscount * 10000) / 100,
      breakdown,
    };
  }

  // ── TPM Block Submission ───────────────────────────────────

  async submitSessionBlocks(submission: InsuranceSubmission) {
    const policy = MOCK_POLICIES.find(p => p.id === submission.policyId);
    if (!policy) throw new NotFoundException(`Policy ${submission.policyId} not found`);

    const tpmBlocks = submission.sessionBlocks.filter(b => b.tpmSigned);
    const avgDwvs = submission.sessionBlocks.reduce((sum, b) => sum + b.dwvs, 0) / submission.sessionBlocks.length;

    this.logger.log(`Submitting ${submission.sessionBlocks.length} blocks (${tpmBlocks.length} TPM-signed) for policy ${submission.policyId}`);

    return {
      success: true,
      submissionId: `sub-${Date.now()}`,
      policyId: submission.policyId,
      vehicleId: submission.vehicleId,
      blocksSubmitted: submission.sessionBlocks.length,
      tpmVerifiedBlocks: tpmBlocks.length,
      avgDwvs: Math.round(avgDwvs * 1000) / 1000,
      periodStart: submission.periodStart,
      periodEnd: submission.periodEnd,
      estimatedPremiumImpact: avgDwvs < 0.3 ? '-15%' : avgDwvs < 0.5 ? '-10%' : avgDwvs < 0.7 ? '-3%' : '+5%',
      providerAck: `ACK-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }

  // ── Analytics ──────────────────────────────────────────────

  getAnalytics(): InsuranceAnalytics {
    const policies = MOCK_POLICIES as InsurancePolicy[];
    const active = policies.filter(p => p.status === 'active');
    const totalPremium = active.reduce((sum, p) => sum + (p.basePremiumAED || 0), 0);
    const totalAdjusted = active.reduce((sum, p) => sum + (p.adjustedPremiumAED || 0), 0);
    const totalClaims = active.reduce((sum, p) => sum + (p.totalClaimedAED || 0), 0);
    const avgDiscount = active.reduce((sum, p) => sum + (p.dwvsDiscountPct || 0), 0) / active.length;

    const byFleetType = ['tanker', 'bus', 'taxi'].map(ft => {
      const ftPolicies = active.filter(p => {
        const vid = p.vehicleId || '';
        if (ft === 'tanker') return vid.startsWith('TK');
        if (ft === 'bus') return vid.startsWith('BUS');
        return vid.startsWith('TX');
      });
      return {
        fleetType: ft,
        policies: ftPolicies.length,
        avgDiscount: ftPolicies.length > 0 ? ftPolicies.reduce((s, p) => s + (p.dwvsDiscountPct || 0), 0) / ftPolicies.length : 0,
        avgDwvs: ftPolicies.length > 0 ? ftPolicies.reduce((s, p) => s + (p.vehicleAvgDwvs || 0), 0) / ftPolicies.length : 0,
      };
    });

    const providerMap = new Map<string, { name: string; policies: number; total: number }>();
    active.forEach(p => {
      const key = p.providerId;
      const existing = providerMap.get(key) || { name: p.providerName, policies: 0, total: 0 };
      existing.policies++;
      existing.total += p.adjustedPremiumAED || 0;
      providerMap.set(key, existing);
    });

    return {
      totalPolicies: policies.length,
      activePolicies: active.length,
      totalPremiumAED: totalPremium,
      totalSavingsAED: totalPremium - totalAdjusted,
      avgDiscountPct: Math.round(avgDiscount * 100) / 100,
      tpmCoverage: 0.94,
      expiringThisMonth: 0,
      claimsRatio: totalPremium > 0 ? totalClaims / totalPremium : 0,
      fleetRiskScore: 0.38,
      byFleetType,
      byProvider: Array.from(providerMap.values()).map(v => ({ providerName: v.name, policies: v.policies, totalPremium: v.total })),
    };
  }

  // ── Provider Management ────────────────────────────────────

  getProviders(): ProviderConfig[] {
    return MOCK_PROVIDERS;
  }

  getProviderById(id: string): ProviderConfig {
    const provider = MOCK_PROVIDERS.find(p => p.id === id);
    if (!provider) throw new NotFoundException(`Provider ${id} not found`);
    return provider;
  }

  // ── Risk Assessment ────────────────────────────────────────

  async computeFleetRisk() {
    const policies = MOCK_POLICIES as InsurancePolicy[];
    const active = policies.filter(p => p.status === 'active');

    return {
      fleetRiskScore: 0.38,
      riskLevel: 'moderate',
      factors: [
        { factor: 'Fleet Avg DWVS', value: 0.42, weight: 0.30, impact: 'moderate' },
        { factor: 'TPM Coverage', value: 0.94, weight: 0.20, impact: 'low' },
        { factor: 'Claims Ratio', value: 0.12, weight: 0.25, impact: 'low' },
        { factor: 'Driver Variance', value: 0.43, weight: 0.15, impact: 'moderate' },
        { factor: 'Fleet Age', value: 3.2, weight: 0.10, impact: 'low' },
      ],
      recommendations: [
        { action: 'Reduce high-DWVS driver assignments', estimatedImpact: '-8% premium' },
        { action: 'Increase TPM coverage to 98%', estimatedImpact: '-3% premium' },
        { action: 'Driver training for 4 identified operators', estimatedImpact: '-5% premium' },
      ],
      projectedAnnualSavings: 185000,
      timestamp: new Date().toISOString(),
    };
  }
}
