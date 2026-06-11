import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class MultiTenantService extends BaseCrudService<Tenant> {
  constructor(@InjectRepository(Tenant) repo: Repository<Tenant>) { super(repo); }

  // ── Dashboard ────────────────────────────────────────────────
  async getDashboard() {
    const tenants = this.getMockTenants();
    const active = tenants.filter(t => t.status === 'active').length;
    const trial = tenants.filter(t => t.status === 'trial').length;
    const totalVehicles = tenants.reduce((sum, t) => sum + t.currentVehicles, 0);
    const totalMrr = tenants.reduce((sum, t) => sum + t.monthlyRate, 0);

    return success({
      summary: {
        totalTenants: tenants.length,
        activeTenants: active,
        trialTenants: trial,
        suspendedTenants: tenants.filter(t => t.status === 'suspended').length,
        totalVehicles,
        totalDrivers: tenants.reduce((sum, t) => sum + t.currentDrivers, 0),
        totalUsers: tenants.reduce((sum, t) => sum + t.currentUsers, 0),
        monthlyRecurringRevenue: totalMrr,
        currency: 'AED',
        averageRevenuePerTenant: Math.round(totalMrr / active),
      },
      planDistribution: [
        { plan: 'starter', count: 3, revenue: 7500 },
        { plan: 'professional', count: 4, revenue: 30000 },
        { plan: 'enterprise', count: 2, revenue: 50000 },
        { plan: 'unlimited', count: 1, revenue: 50000 },
      ],
      regionDistribution: [
        { region: 'UAE', tenants: 6, vehicles: 412 },
        { region: 'GCC', tenants: 2, vehicles: 168 },
        { region: 'Northern Emirates', tenants: 1, vehicles: 87 },
        { region: 'Europe', tenants: 1, vehicles: 45 },
      ],
      recentActivity: [
        { action: 'tenant_created', tenant: 'Sharjah Transport Corp', timestamp: '2026-02-14T08:30:00Z', details: 'New trial started — Professional plan' },
        { action: 'plan_upgraded', tenant: 'ENOC Fleet Services', timestamp: '2026-02-13T14:22:00Z', details: 'Professional → Enterprise' },
        { action: 'onboarding_complete', tenant: 'Al Futtaim Logistics', timestamp: '2026-02-13T09:15:00Z', details: '85 vehicles imported' },
        { action: 'payment_received', tenant: 'Dubai Municipality Fleet', timestamp: '2026-02-12T16:00:00Z', details: 'AED 25,000 — Enterprise monthly' },
        { action: 'tenant_suspended', tenant: 'Test Company LLC', timestamp: '2026-02-11T11:00:00Z', details: 'Payment overdue 30+ days' },
      ],
      growthMetrics: {
        tenantsThisMonth: 3,
        tenantsLastMonth: 2,
        growthRate: 50,
        churnRate: 2.1,
        netRevenueRetention: 118,
        averageOnboardingDays: 3.2,
      },
    });
  }

  // ── Tenant CRUD ──────────────────────────────────────────────
  async listTenants(query: any) {
    const tenants = this.getMockTenants();
    const filtered = query.status
      ? tenants.filter(t => t.status === query.status)
      : tenants;
    return success({ items: filtered, total: filtered.length, page: 1, limit: 20 });
  }

  async getTenant(id: string) {
    const tenants = this.getMockTenants();
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) throw new NotFoundException(`Tenant ${id} not found`);
    return success(tenant);
  }

  async createTenant(dto: Partial<Tenant>) {
    const slug = (dto.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (!slug) throw new BadRequestException('Tenant name is required');

    const plan = dto.plan || SubscriptionPlan.STARTER;
    const limits = PLAN_LIMITS[plan];

    const newTenant = {
      id: `t-${Date.now().toString(36)}`,
      name: dto.name,
      slug,
      status: TenantStatus.PENDING_SETUP,
      plan,
      region: dto.region || TenantRegion.UAE,
      tradeLicenseNo: dto.tradeLicenseNo || null,
      taxRegistrationNo: dto.taxRegistrationNo || null,
      companyEmail: dto.companyEmail,
      companyPhone: dto.companyPhone,
      address: dto.address,
      emirate: dto.emirate || 'Dubai',
      country: dto.country || 'UAE',
      logoUrl: null,
      primaryColor: dto.primaryColor || '#0891b2',
      domain: dto.domain || null,
      maxVehicles: limits.maxVehicles,
      maxDrivers: limits.maxDrivers,
      maxUsers: limits.maxUsers,
      maxFleets: limits.maxFleets,
      enabledModules: limits.modules,
      currentVehicles: 0,
      currentDrivers: 0,
      currentUsers: 0,
      apiCallsThisMonth: 0,
      storageUsedMb: 0,
      billingEmail: dto.billingEmail || dto.companyEmail,
      currency: 'AED',
      monthlyRate: limits.monthlyRateAed,
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day trial
      onboardingStep: 0,
      onboardingComplete: false,
      onboardingData: {},
      defaultLanguage: dto.defaultLanguage || 'en',
      timezone: dto.timezone || 'Asia/Dubai',
      distanceUnit: 'km',
      fuelUnit: 'liters',
      featureFlags: {},
      customConfig: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return success(newTenant);
  }

  async updateTenant(id: string, dto: Partial<Tenant>) {
    return success({ id, ...dto, updatedAt: new Date().toISOString() });
  }

  async suspendTenant(id: string, reason: string) {
    return success({
      id, status: TenantStatus.SUSPENDED, suspendedAt: new Date().toISOString(), reason,
      message: `Tenant ${id} suspended. All user access revoked. Data preserved for 90 days.`,
    });
  }

  async reactivateTenant(id: string) {
    return success({
      id, status: TenantStatus.ACTIVE, reactivatedAt: new Date().toISOString(),
      message: `Tenant ${id} reactivated. User access restored.`,
    });
  }

  // ── Plan Management ──────────────────────────────────────────
  async getPlans() {
    return success(Object.entries(PLAN_LIMITS).map(([plan, limits]) => ({
      plan,
      name: plan.charAt(0).toUpperCase() + plan.slice(1),
      ...limits,
      monthlyRate: limits.monthlyRateAed,
      currency: 'AED',
      features: this.getPlanFeatures(plan as SubscriptionPlan),
    })));
  }

  async changePlan(tenantId: string, newPlan: SubscriptionPlan) {
    const limits = PLAN_LIMITS[newPlan];
    if (!limits) throw new BadRequestException(`Invalid plan: ${newPlan}`);

    return success({
      tenantId,
      previousPlan: 'professional',
      newPlan,
      effectiveDate: new Date().toISOString(),
      newLimits: limits,
      proratedAmount: 3750, // Mock prorated amount
      currency: 'AED',
      message: `Plan changed to ${newPlan}. New limits applied immediately. Prorated billing adjustment: AED 3,750.`,
    });
  }

  // ── Usage & Quotas ───────────────────────────────────────────
  async getUsage(tenantId: string) {
    return success({
      tenantId,
      period: '2026-02',
      resources: {
        vehicles: { current: 87, limit: 100, percentage: 87, status: 'warning' },
        drivers: { current: 142, limit: 200, percentage: 71, status: 'ok' },
        users: { current: 12, limit: 20, percentage: 60, status: 'ok' },
        fleets: { current: 3, limit: 5, percentage: 60, status: 'ok' },
        apiCalls: { current: 45230, limit: 100000, percentage: 45, status: 'ok' },
        storageMb: { current: 2340, limit: 10000, percentage: 23, status: 'ok' },
      },
      alerts: [
        { resource: 'vehicles', message: 'Vehicle quota at 87% — consider upgrading to Enterprise', severity: 'warning' },
      ],
      trend: [
        { month: '2025-09', vehicles: 62, drivers: 98, apiCalls: 28000 },
        { month: '2025-10', vehicles: 68, drivers: 112, apiCalls: 32000 },
        { month: '2025-11', vehicles: 75, drivers: 128, apiCalls: 38000 },
        { month: '2025-12', vehicles: 79, drivers: 134, apiCalls: 41000 },
        { month: '2026-01', vehicles: 84, drivers: 139, apiCalls: 43500 },
        { month: '2026-02', vehicles: 87, drivers: 142, apiCalls: 45230 },
      ],
    });
  }

  // ── Row-Level Security Config ────────────────────────────────
  async getRlsConfig(tenantId: string) {
    return success({
      tenantId,
      strategy: 'column_filter', // 'column_filter' | 'schema_per_tenant' | 'database_per_tenant'
      isolationLevel: 'strict',
      enforcedEntities: [
        'vehicles', 'drivers', 'trips', 'alerts', 'work_orders', 'fuel_transactions',
        'cargo_manifests', 'bus_routes', 'taxi_trips', 'notifications', 'finance_transactions',
      ],
      auditConfig: {
        logCrossTenantAttempts: true,
        alertOnViolation: true,
        retentionDays: 365,
      },
      databasePolicies: [
        { entity: 'vehicles', policy: 'WHERE tenant_id = :tenantId', enforced: true },
        { entity: 'drivers', policy: 'WHERE tenant_id = :tenantId', enforced: true },
        { entity: 'trips', policy: 'WHERE tenant_id = :tenantId', enforced: true },
        { entity: 'alerts', policy: 'WHERE tenant_id = :tenantId', enforced: true },
        { entity: 'work_orders', policy: 'WHERE tenant_id = :tenantId', enforced: true },
        { entity: 'fuel_transactions', policy: 'WHERE tenant_id = :tenantId', enforced: true },
        { entity: 'cargo_manifests', policy: 'WHERE tenant_id = :tenantId', enforced: true },
        { entity: 'notifications', policy: 'WHERE tenant_id = :tenantId', enforced: true },
      ],
      dataEncryption: {
        atRest: true,
        inTransit: true,
        tenantKeyManagement: 'platform_managed', // or 'byok' for Bring Your Own Key
      },
    });
  }

  // ── Data Isolation Audit ─────────────────────────────────────
  async getIsolationAudit(tenantId: string) {
    return success({
      tenantId,
      lastAudit: '2026-02-14T06:00:00Z',
      status: 'passed',
      checks: [
        { check: 'All queries include tenant_id filter', status: 'passed', entities: 42 },
        { check: 'No cross-tenant data leakage detected', status: 'passed', queriesAudited: 15840 },
        { check: 'API responses filtered by tenant context', status: 'passed', endpoints: 380 },
        { check: 'WebSocket rooms isolated per tenant', status: 'passed', rooms: 3 },
        { check: 'File storage separated by tenant prefix', status: 'passed', buckets: 1 },
        { check: 'Cache keys namespaced by tenant', status: 'passed', namespaces: 10 },
        { check: 'Audit log entries tagged with tenant_id', status: 'passed', entries: 24563 },
      ],
      violations: [],
      nextScheduledAudit: '2026-02-15T06:00:00Z',
    });
  }

  // ── Helpers ──────────────────────────────────────────────────
  private getPlanFeatures(plan: SubscriptionPlan): string[] {
    const base = ['Fleet tracking', 'Driver management', 'Trip logging', 'Alert system', 'Basic reports'];
    const pro = [...base, 'Advanced analytics', 'Compliance management', 'Tanker/Bus/Taxi modules', 'Geofence automation', 'Driver scoring AI'];
    const ent = [...pro, 'Predictive maintenance AI', 'Anomaly detection', 'Cold chain monitoring', 'EV management', 'Blockchain audit trail', 'Executive dashboard', 'Financial module'];
    const unl = [...ent, 'White-label branding', 'Custom domain', 'Dedicated support', 'API marketplace', 'Custom integrations', 'SLA guarantee'];
    return { starter: base, professional: pro, enterprise: ent, unlimited: unl }[plan] || base;
  }

  private getMockTenants(): any[] {
    return [
      { id: 't-001', name: 'Blue Edge Network LLC', slug: 'blue-edge', status: 'active', plan: 'enterprise', region: 'UAE', emirate: 'Dubai', tradeLicenseNo: 'DED-2024-123456', companyEmail: 'admin@blueedge.ae', currentVehicles: 156, currentDrivers: 234, currentUsers: 42, maxVehicles: 500, maxDrivers: 1000, maxUsers: 100, monthlyRate: 25000, currency: 'AED', onboardingComplete: true, enabledModules: ['*'], createdAt: '2025-06-15' },
      { id: 't-002', name: 'ENOC Fleet Services', slug: 'enoc-fleet', status: 'active', plan: 'enterprise', region: 'UAE', emirate: 'Dubai', tradeLicenseNo: 'DED-2023-789012', companyEmail: 'fleet@enoc.com', currentVehicles: 85, currentDrivers: 120, currentUsers: 18, maxVehicles: 500, maxDrivers: 1000, maxUsers: 100, monthlyRate: 25000, currency: 'AED', onboardingComplete: true, enabledModules: ['*'], createdAt: '2025-08-22' },
      { id: 't-003', name: 'RTA Dubai Transport', slug: 'rta-dubai', status: 'active', plan: 'unlimited', region: 'UAE', emirate: 'Dubai', tradeLicenseNo: 'GOV-2024-001', companyEmail: 'fleet@rta.ae', currentVehicles: 320, currentDrivers: 480, currentUsers: 85, maxVehicles: 999999, maxDrivers: 999999, maxUsers: 999999, monthlyRate: 50000, currency: 'AED', onboardingComplete: true, enabledModules: ['*'], createdAt: '2025-04-10' },
      { id: 't-004', name: 'Al Futtaim Logistics', slug: 'al-futtaim', status: 'active', plan: 'professional', region: 'UAE', emirate: 'Dubai', tradeLicenseNo: 'DED-2025-345678', companyEmail: 'logistics@alfuttaim.com', currentVehicles: 68, currentDrivers: 95, currentUsers: 12, maxVehicles: 100, maxDrivers: 200, maxUsers: 20, monthlyRate: 7500, currency: 'AED', onboardingComplete: true, enabledModules: PLAN_LIMITS.professional.modules, createdAt: '2025-10-01' },
      { id: 't-005', name: 'Sharjah Transport Corp', slug: 'sharjah-transport', status: 'trial', plan: 'professional', region: 'UAE', emirate: 'Sharjah', tradeLicenseNo: 'SHJ-2026-001', companyEmail: 'admin@sharjahtransport.ae', currentVehicles: 15, currentDrivers: 22, currentUsers: 4, maxVehicles: 100, maxDrivers: 200, maxUsers: 20, monthlyRate: 0, currency: 'AED', onboardingComplete: false, enabledModules: PLAN_LIMITS.professional.modules, createdAt: '2026-02-14' },
      { id: 't-006', name: 'Dubai Municipality Fleet', slug: 'dubai-municipality', status: 'active', plan: 'enterprise', region: 'UAE', emirate: 'Dubai', tradeLicenseNo: 'GOV-2024-002', companyEmail: 'fleet@dm.gov.ae', currentVehicles: 215, currentDrivers: 310, currentUsers: 55, maxVehicles: 500, maxDrivers: 1000, maxUsers: 100, monthlyRate: 25000, currency: 'AED', onboardingComplete: true, enabledModules: ['*'], createdAt: '2025-07-20' },
      { id: 't-007', name: 'Oman Express Freight', slug: 'oman-express', status: 'active', plan: 'professional', region: 'GCC', emirate: null, tradeLicenseNo: 'OMN-2025-789', companyEmail: 'ops@omanexpress.om', currentVehicles: 45, currentDrivers: 62, currentUsers: 8, maxVehicles: 100, maxDrivers: 200, maxUsers: 20, monthlyRate: 7500, currency: 'AED', onboardingComplete: true, enabledModules: PLAN_LIMITS.professional.modules, createdAt: '2025-11-15' },
      { id: 't-008', name: 'Sharjah Cargo Solutions', slug: 'sharjah-cargo', status: 'active', plan: 'professional', region: 'Northern Emirates', emirate: 'Sharjah', tradeLicenseNo: 'SHJ-2025-456', companyEmail: 'fleet@sharjahcargo.ae', currentVehicles: 87, currentDrivers: 110, currentUsers: 14, maxVehicles: 100, maxDrivers: 200, maxUsers: 20, monthlyRate: 7500, currency: 'AED', onboardingComplete: true, enabledModules: PLAN_LIMITS.professional.modules, createdAt: '2025-09-10' },
      { id: 't-009', name: 'SwissFleet GmbH', slug: 'swissfleet', status: 'active', plan: 'starter', region: 'Europe', emirate: null, tradeLicenseNo: 'CHE-2025-001', companyEmail: 'info@swissfleet.ch', currentVehicles: 22, currentDrivers: 28, currentUsers: 3, maxVehicles: 25, maxDrivers: 50, maxUsers: 5, monthlyRate: 2500, currency: 'AED', onboardingComplete: true, enabledModules: PLAN_LIMITS.starter.modules, createdAt: '2025-12-01' },
      { id: 't-010', name: 'Test Company LLC', slug: 'test-company', status: 'suspended', plan: 'starter', region: 'UAE', emirate: 'Ajman', tradeLicenseNo: 'AJM-2025-999', companyEmail: 'test@testco.ae', currentVehicles: 5, currentDrivers: 8, currentUsers: 2, maxVehicles: 25, maxDrivers: 50, maxUsers: 5, monthlyRate: 2500, currency: 'AED', onboardingComplete: true, enabledModules: PLAN_LIMITS.starter.modules, createdAt: '2025-11-20' },
    ];
  }
}

// ─── Controller ──────────────────────────────────────────────────
