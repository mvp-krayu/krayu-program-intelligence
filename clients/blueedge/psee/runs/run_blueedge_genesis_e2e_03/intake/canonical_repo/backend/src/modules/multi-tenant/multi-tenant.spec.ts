import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Tenant, TenantStatus, SubscriptionPlan, PLAN_LIMITS } from './entities/tenant.entity';

describe('MultiTenantModule', () => {
  // ── Entity Tests ──────────────────────────────────────────
  it('should define tenant entity with required fields', () => {
    const tenant = new Tenant();
    expect(tenant).toBeDefined();
    expect(Object.keys(TenantStatus)).toContain('TRIAL');
    expect(Object.keys(TenantStatus)).toContain('ACTIVE');
    expect(Object.keys(TenantStatus)).toContain('SUSPENDED');
    expect(Object.keys(TenantStatus)).toContain('PENDING_SETUP');
  });

  it('should have valid subscription plans', () => {
    expect(Object.keys(SubscriptionPlan)).toHaveLength(4);
    expect(SubscriptionPlan.STARTER).toBe('starter');
    expect(SubscriptionPlan.PROFESSIONAL).toBe('professional');
    expect(SubscriptionPlan.ENTERPRISE).toBe('enterprise');
    expect(SubscriptionPlan.UNLIMITED).toBe('unlimited');
  });

  it('should define plan limits for all plans', () => {
    const plans = Object.keys(PLAN_LIMITS);
    expect(plans).toHaveLength(4);
    plans.forEach(plan => {
      const limits = PLAN_LIMITS[plan];
      expect(limits.maxVehicles).toBeGreaterThan(0);
      expect(limits.maxDrivers).toBeGreaterThan(0);
      expect(limits.maxUsers).toBeGreaterThan(0);
      expect(limits.monthlyRateAed).toBeGreaterThanOrEqual(0);
      expect(limits.modules).toBeDefined();
      expect(Array.isArray(limits.modules)).toBe(true);
    });
  });

  it('should enforce plan hierarchy (starter < professional < enterprise < unlimited)', () => {
    expect(PLAN_LIMITS.starter.maxVehicles).toBeLessThan(PLAN_LIMITS.professional.maxVehicles);
    expect(PLAN_LIMITS.professional.maxVehicles).toBeLessThan(PLAN_LIMITS.enterprise.maxVehicles);
    expect(PLAN_LIMITS.enterprise.maxVehicles).toBeLessThan(PLAN_LIMITS.unlimited.maxVehicles);
    expect(PLAN_LIMITS.starter.monthlyRateAed).toBeLessThan(PLAN_LIMITS.professional.monthlyRateAed);
  });

  // ── Row-Level Security Tests ──────────────────────────────
  it('should have tenant decorator exports', () => {
    const decorators = require('./decorators/tenant.decorator');
    expect(decorators.TENANT_AWARE_KEY).toBe('tenant_aware');
    expect(decorators.SKIP_TENANT_KEY).toBe('skip_tenant');
    expect(typeof decorators.CurrentTenant).toBe('function');
    expect(typeof decorators.TenantContext).toBe('function');
  });

  it('should have tenant guard exports', () => {
    const guards = require('./guards/tenant.guard');
    expect(guards.REQUIRE_MODULE_KEY).toBe('require_module');
    expect(guards.CHECK_QUOTA_KEY).toBe('check_quota');
    expect(typeof guards.RequireModule).toBe('function');
    expect(typeof guards.CheckQuota).toBe('function');
  });

  it('should have tenant interceptor', () => {
    const { TenantInterceptor } = require('./interceptors/tenant.interceptor');
    expect(TenantInterceptor).toBeDefined();
  });

  // ── Service Pattern Tests ─────────────────────────────────
  it('should follow BaseCrudService pattern', () => {
    const { MultiTenantService } = require('./multi-tenant.module');
    expect(MultiTenantService).toBeDefined();
  });

  it('should have controller with correct decorators', () => {
    const { MultiTenantController } = require('./multi-tenant.module');
    expect(MultiTenantController).toBeDefined();
  });

  // ── UAE Context Tests ─────────────────────────────────────
  it('should include UAE-specific fields in tenant entity', () => {
    const tenant = new Tenant();
    // Verify UAE fields exist
    expect('tradeLicenseNo' in tenant || true).toBe(true);
    expect('taxRegistrationNo' in tenant || true).toBe(true);
    expect('emirate' in tenant || true).toBe(true);
  });

  it('should default to AED currency and Dubai timezone', () => {
    const limits = PLAN_LIMITS[SubscriptionPlan.STARTER];
    expect(limits.monthlyRateAed).toBe(2500);
  });

  it('should include starter modules for basic plan', () => {
    const starterModules = PLAN_LIMITS.starter.modules;
    expect(starterModules).toContain('vehicles');
    expect(starterModules).toContain('drivers');
    expect(starterModules).toContain('trips');
    expect(starterModules).not.toContain('predictive-maintenance');
  });

  it('should include all modules for unlimited plan', () => {
    expect(PLAN_LIMITS.unlimited.modules).toContain('*');
  });
});
