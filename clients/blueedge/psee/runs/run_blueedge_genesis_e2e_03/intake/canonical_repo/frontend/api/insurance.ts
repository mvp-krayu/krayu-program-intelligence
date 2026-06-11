/**
 * Insurance API Client — Blue Edge Fleet Management Platform
 * Endpoints for DWVS-based insurance premium computation, TPM block submission, and analytics.
 */
import client from './client';

// ── Types ────────────────────────────────────────────────────

export interface InsurancePolicy {
  id: string;
  vehicleId: string;
  fleetId?: string;
  policyNumber: string;
  providerName: string;
  providerId: string;
  policyType: 'comprehensive' | 'third_party' | 'fleet_blanket' | 'cargo' | 'liability' | 'hazmat';
  status: 'active' | 'pending' | 'expired' | 'cancelled' | 'suspended' | 'renewal_pending';
  basePremiumAED: number;
  adjustedPremiumAED: number;
  dwvsDiscountPct: number;
  fleetAvgDwvs: number;
  vehicleAvgDwvs: number;
  tpmBlocksSubmitted: number;
  deductibleAED: number;
  coverageLimitAED: number;
  effectiveDate: string;
  expiryDate: string;
  lastDwvsSubmissionDate?: string;
  nextReviewDate?: string;
  totalClaims: number;
  totalClaimedAED: number;
  submissionHistory: { date: string; blocksCount: number; avgDwvs: number; response: string }[];
  metadata: Record<string, any>;
}

export interface PremiumComputation {
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

export interface InsuranceAnalytics {
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

export interface InsuranceProvider {
  id: string;
  name: string;
  apiEndpoint: string;
  supportsDwvs: boolean;
  supportsTpmVerification: boolean;
  dataFormat: 'json' | 'xml' | 'csv';
  refreshInterval: 'monthly' | 'quarterly' | 'annual';
}

export interface RiskAssessment {
  fleetRiskScore: number;
  riskLevel: string;
  factors: { factor: string; value: number; weight: number; impact: string }[];
  recommendations: { action: string; estimatedImpact: string }[];
  projectedAnnualSavings: number;
  timestamp: string;
}

export interface BlockSubmissionResult {
  success: boolean;
  submissionId: string;
  policyId: string;
  vehicleId: string;
  blocksSubmitted: number;
  tpmVerifiedBlocks: number;
  avgDwvs: number;
  estimatedPremiumImpact: string;
  providerAck: string;
  timestamp: string;
}

// ── API Calls ────────────────────────────────────────────────

export const insuranceApi = {
  getPolicies: (params?: { status?: string; vehicleId?: string; providerId?: string; page?: number; limit?: number }) =>
    client.get('/insurance/policies', { params }),

  getPolicy: (id: string) =>
    client.get(`/insurance/policies/${id}`),

  getVehiclePolicies: (vehicleId: string) =>
    client.get(`/insurance/policies/vehicle/${vehicleId}`),

  computePremium: (input: { vehicleId: string; avgDwvs: number; tpmSignedBlocks: number; totalBlocks: number; fleetAvgDwvs: number; harshEventRate: number; dtcRate: number; totalKm: number; sessionCount: number }) =>
    client.post('/insurance/premium/compute', input),

  submitBlocks: (submission: { policyId: string; vehicleId: string; sessionBlocks: any[]; periodStart: string; periodEnd: string }) =>
    client.post('/insurance/submit-blocks', submission),

  getAnalytics: () =>
    client.get('/insurance/analytics'),

  getRiskAssessment: () =>
    client.get('/insurance/risk-assessment'),

  getProviders: () =>
    client.get('/insurance/providers'),

  getProvider: (id: string) =>
    client.get(`/insurance/providers/${id}`),
};
