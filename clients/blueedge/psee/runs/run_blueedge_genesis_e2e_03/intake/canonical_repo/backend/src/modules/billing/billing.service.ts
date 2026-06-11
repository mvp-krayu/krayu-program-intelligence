import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class BillingService extends BaseCrudService<Invoice> {
  constructor(@InjectRepository(Invoice) repo: Repository<Invoice>) { super(repo); }

  // ── Dashboard ────────────────────────────────────────────────
  async getDashboard(tenantId: string) {
    return success({
      overview: {
        currentPlan: 'Enterprise',
        monthlyRate: 25000,
        currency: 'AED',
        nextBillingDate: '2026-03-01',
        paymentMethod: 'Credit Card ending 4242',
        status: 'active',
        trialDaysRemaining: null,
      },
      currentPeriod: {
        start: '2026-02-01',
        end: '2026-02-28',
        basePlan: 25000,
        addOns: [
          { name: 'Additional API Calls (50K bundle)', price: 500 },
          { name: 'Premium Support SLA', price: 2000 },
        ],
        subtotal: 27500,
        vatRate: 5,
        vatAmount: 1375,
        total: 28875,
        currency: 'AED',
      },
      revenueMetrics: {
        totalBilledYtd: 173250,
        totalPaidYtd: 173250,
        outstandingBalance: 0,
        averageMonthlySpend: 28875,
        currency: 'AED',
      },
      billingHistory: this.getMockInvoices(tenantId).slice(0, 3),
      usageCharges: [
        { metric: 'API Calls', usage: 45230, included: 100000, overage: 0, overageRate: 0.01, charge: 0 },
        { metric: 'Storage (MB)', usage: 2340, included: 10000, overage: 0, overageRate: 0.05, charge: 0 },
        { metric: 'SMS Notifications', usage: 1250, included: 1000, overage: 250, overageRate: 0.15, charge: 37.5 },
      ],
      paymentMethods: [
        { id: 'pm-001', type: 'credit_card', brand: 'Visa', last4: '4242', expiryMonth: 12, expiryYear: 2027, isDefault: true },
        { id: 'pm-002', type: 'bank_transfer', bankName: 'Emirates NBD', accountLast4: '7890', isDefault: false },
      ],
    });
  }

  // ── Invoices ─────────────────────────────────────────────────
  async getInvoices(tenantId: string, query: any) {
    const invoices = this.getMockInvoices(tenantId);
    const filtered = query.status ? invoices.filter(i => i.status === query.status) : invoices;
    return success({ items: filtered, total: filtered.length, page: 1, limit: 20 });
  }

  async getInvoice(invoiceId: string) {
    const inv = this.getMockInvoices('t-001').find(i => i.id === invoiceId);
    if (!inv) throw new NotFoundException(`Invoice ${invoiceId} not found`);
    return success({
      ...inv,
      lineItems: [
        { description: 'Enterprise Plan — Monthly', quantity: 1, unitPrice: 25000, total: 25000 },
        { description: 'Additional API Calls (50K bundle)', quantity: 1, unitPrice: 500, total: 500 },
        { description: 'Premium Support SLA', quantity: 1, unitPrice: 2000, total: 2000 },
        { description: 'SMS Overage (250 messages × AED 0.15)', quantity: 250, unitPrice: 0.15, total: 37.50 },
      ],
      tenantDetails: {
        name: 'Blue Edge Network LLC', tradeLicenseNo: 'DED-2024-123456',
        taxRegistrationNo: 'TRN-100123456789003', address: 'JAFZA, Dubai, UAE',
      },
      platformDetails: {
        name: 'Blue Edge Fleet Platform', taxRegistrationNo: 'TRN-100987654321001',
        address: 'Dubai Internet City, Dubai, UAE', supportEmail: 'billing@blueedge-fleet.com',
      },
    });
  }

  async downloadInvoicePdf(invoiceId: string) {
    return success({
      invoiceId,
      pdfUrl: `/api/billing/invoices/${invoiceId}/download`,
      generatedAt: new Date().toISOString(),
      format: 'PDF/A-3', // UAE e-invoicing compliant
      size: '245 KB',
    });
  }

  // ── Subscription ─────────────────────────────────────────────
  async getSubscription(tenantId: string) {
    return success({
      id: 'sub-001',
      tenantId,
      plan: 'enterprise',
      status: 'active',
      monthlyAmount: 25000,
      currency: 'AED',
      currentPeriodStart: '2026-02-01',
      currentPeriodEnd: '2026-02-28',
      trialEnd: null,
      cancelAtPeriodEnd: false,
      addOns: [
        { id: 'addon-001', name: 'Premium Support SLA', price: 2000, status: 'active' },
        { id: 'addon-002', name: 'Additional API Bundle (50K)', price: 500, status: 'active' },
      ],
      scheduledChanges: null,
      createdAt: '2025-06-15T10:00:00Z',
    });
  }

  async previewPlanChange(tenantId: string, newPlan: string) {
    const pricing = {
      starter: 2500, professional: 7500, enterprise: 25000, unlimited: 50000,
    };
    const newRate = pricing[newPlan] || 25000;
    const currentRate = 25000;
    const daysRemaining = 14;
    const daysInMonth = 28;
    const prorated = Math.round((newRate - currentRate) * (daysRemaining / daysInMonth));

    return success({
      currentPlan: 'enterprise',
      newPlan,
      currentRate,
      newRate,
      currency: 'AED',
      proratedAdjustment: prorated,
      effectiveDate: new Date().toISOString(),
      nextFullBillingDate: '2026-03-01',
      newLimits: {
        maxVehicles: newPlan === 'unlimited' ? 999999 : newPlan === 'enterprise' ? 500 : 100,
        maxDrivers: newPlan === 'unlimited' ? 999999 : newPlan === 'enterprise' ? 1000 : 200,
        maxUsers: newPlan === 'unlimited' ? 999999 : newPlan === 'enterprise' ? 100 : 20,
      },
      warnings: newRate < currentRate
        ? ['Downgrading may disable modules not available in the new plan. Current data will be preserved but inaccessible.']
        : [],
    });
  }

  // ── Payment Methods ──────────────────────────────────────────
  async getPaymentMethods(tenantId: string) {
    return success([
      { id: 'pm-001', type: 'credit_card', brand: 'Visa', last4: '4242', expiryMonth: 12, expiryYear: 2027, isDefault: true, holderName: 'Ahmed Al Rashid' },
      { id: 'pm-002', type: 'bank_transfer', bankName: 'Emirates NBD', accountLast4: '7890', iban: 'AE07 0331 2345 6789 0123 456', isDefault: false },
    ]);
  }

  async addPaymentMethod(tenantId: string, dto: any) {
    return success({
      id: `pm-${Date.now().toString(36)}`,
      type: dto.type || 'credit_card',
      brand: dto.brand || 'Visa',
      last4: dto.last4 || '1234',
      isDefault: false,
      createdAt: new Date().toISOString(),
      message: 'Payment method added. Please verify with a small charge.',
    });
  }

  // ── Usage Metering ───────────────────────────────────────────
  async getUsageMetering(tenantId: string, period: string) {
    return success({
      tenantId,
      period: period || '2026-02',
      metrics: [
        { metric: 'api_calls', description: 'API Requests', daily: this.generateDailyUsage(14, 1000, 3500), total: 45230, limit: 100000, unit: 'requests' },
        { metric: 'storage', description: 'Data Storage', daily: this.generateDailyUsage(14, 2200, 2400), total: 2340, limit: 10000, unit: 'MB' },
        { metric: 'sms', description: 'SMS Notifications', daily: this.generateDailyUsage(14, 50, 120), total: 1250, limit: 1000, unit: 'messages' },
        { metric: 'websocket_connections', description: 'Real-time Connections', daily: this.generateDailyUsage(14, 8, 42), total: null, limit: 100, unit: 'concurrent' },
        { metric: 'report_exports', description: 'Report Exports', daily: this.generateDailyUsage(14, 2, 15), total: 87, limit: 500, unit: 'exports' },
      ],
      estimatedOverageCharges: {
        sms: { overage: 250, rate: 0.15, estimated: 37.5, currency: 'AED' },
      },
    });
  }

  // ── Revenue Analytics (Platform Admin) ───────────────────────
  async getRevenueAnalytics() {
    return success({
      summary: {
        mrr: 137500,   // Monthly Recurring Revenue
        arr: 1650000,  // Annual Run Rate
        ltv: 450000,   // Average Lifetime Value
        arpu: 13750,   // Average Revenue Per User
        churnRate: 2.1,
        netRevenueRetention: 118, // %
        currency: 'AED',
      },
      mrrByPlan: [
        { plan: 'starter', tenants: 3, mrr: 7500 },
        { plan: 'professional', tenants: 4, mrr: 30000 },
        { plan: 'enterprise', tenants: 2, mrr: 50000 },
        { plan: 'unlimited', tenants: 1, mrr: 50000 },
      ],
      mrrTrend: [
        { month: '2025-09', mrr: 85000 },
        { month: '2025-10', mrr: 92500 },
        { month: '2025-11', mrr: 105000 },
        { month: '2025-12', mrr: 115000 },
        { month: '2026-01', mrr: 127500 },
        { month: '2026-02', mrr: 137500 },
      ],
      cohortRetention: [
        { cohort: '2025-Q2', month1: 100, month3: 92, month6: 85, month9: 80 },
        { cohort: '2025-Q3', month1: 100, month3: 95, month6: 88 },
        { cohort: '2025-Q4', month1: 100, month3: 93 },
      ],
      topRevenueDrivers: [
        { feature: 'Enterprise plan upgrades', impact: 45000, percentage: 32.7 },
        { feature: 'Premium Support SLA add-on', impact: 18000, percentage: 13.1 },
        { feature: 'New tenant acquisitions', impact: 22500, percentage: 16.4 },
        { feature: 'API bundle add-ons', impact: 8000, percentage: 5.8 },
      ],
    });
  }

  // ── Helpers ──────────────────────────────────────────────────
  private getMockInvoices(tenantId: string): any[] {
    return [
      { id: 'inv-001', invoiceNumber: 'INV-2026-0014', tenantId, status: 'paid', subtotal: 27537.5, vatAmount: 1376.88, total: 28914.38, currency: 'AED', billingPeriodStart: '2026-01-01', billingPeriodEnd: '2026-01-31', dueDate: '2026-02-15', paidAt: '2026-02-10', paymentMethod: 'credit_card' },
      { id: 'inv-002', invoiceNumber: 'INV-2025-0013', tenantId, status: 'paid', subtotal: 27500, vatAmount: 1375, total: 28875, currency: 'AED', billingPeriodStart: '2025-12-01', billingPeriodEnd: '2025-12-31', dueDate: '2026-01-15', paidAt: '2026-01-12', paymentMethod: 'credit_card' },
      { id: 'inv-003', invoiceNumber: 'INV-2025-0012', tenantId, status: 'paid', subtotal: 25000, vatAmount: 1250, total: 26250, currency: 'AED', billingPeriodStart: '2025-11-01', billingPeriodEnd: '2025-11-30', dueDate: '2025-12-15', paidAt: '2025-12-08', paymentMethod: 'bank_transfer' },
      { id: 'inv-004', invoiceNumber: 'INV-2025-0011', tenantId, status: 'paid', subtotal: 25000, vatAmount: 1250, total: 26250, currency: 'AED', billingPeriodStart: '2025-10-01', billingPeriodEnd: '2025-10-31', dueDate: '2025-11-15', paidAt: '2025-11-10', paymentMethod: 'credit_card' },
      { id: 'inv-005', invoiceNumber: 'INV-2025-0010', tenantId, status: 'paid', subtotal: 25000, vatAmount: 1250, total: 26250, currency: 'AED', billingPeriodStart: '2025-09-01', billingPeriodEnd: '2025-09-30', dueDate: '2025-10-15', paidAt: '2025-10-11', paymentMethod: 'credit_card' },
      { id: 'inv-006', invoiceNumber: 'INV-2025-0009', tenantId, status: 'paid', subtotal: 7500, vatAmount: 375, total: 7875, currency: 'AED', billingPeriodStart: '2025-08-01', billingPeriodEnd: '2025-08-31', dueDate: '2025-09-15', paidAt: '2025-09-08', paymentMethod: 'credit_card' },
    ];
  }

  private generateDailyUsage(days: number, min: number, max: number): number[] {
    return Array.from({ length: days }, () => Math.floor(min + Math.random() * (max - min)));
  }
}

// ─── Controller ──────────────────────────────────────────────────
