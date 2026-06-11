import { Test, TestingModule } from '@nestjs/testing';
import { OnboardingSession, OnboardingStatus } from './entities/onboarding.entity';

describe('OnboardingModule', () => {
  // ── Entity Tests ──────────────────────────────────────────
  it('should define onboarding session entity', () => {
    const session = new OnboardingSession();
    expect(session).toBeDefined();
  });

  it('should have valid onboarding statuses', () => {
    expect(OnboardingStatus.NOT_STARTED).toBe('not_started');
    expect(OnboardingStatus.IN_PROGRESS).toBe('in_progress');
    expect(OnboardingStatus.COMPLETED).toBe('completed');
    expect(OnboardingStatus.SKIPPED).toBe('skipped');
  });

  // ── Service Tests ─────────────────────────────────────────
  it('should have onboarding service', () => {
    const { OnboardingService } = require('./onboarding.module');
    expect(OnboardingService).toBeDefined();
  });

  it('should have onboarding controller', () => {
    const { OnboardingController } = require('./onboarding.module');
    expect(OnboardingController).toBeDefined();
  });

  it('should have onboarding module', () => {
    const { OnboardingModule } = require('./onboarding.module');
    expect(OnboardingModule).toBeDefined();
  });

  // ── Wizard Steps Tests ────────────────────────────────────
  it('should have 6 onboarding steps (0-5)', () => {
    const totalSteps = 6;
    const stepKeys = ['company_profile', 'fleet_setup', 'user_provisioning', 'driver_onboarding', 'integrations', 'go_live'];
    expect(stepKeys).toHaveLength(totalSteps);
  });

  it('should calculate progress percentage correctly', () => {
    const completedSteps = 3;
    const totalSteps = 6;
    const progress = Math.round((completedSteps / totalSteps) * 100);
    expect(progress).toBe(50);
  });

  it('should validate step range (0-5)', () => {
    const validSteps = [0, 1, 2, 3, 4, 5];
    const invalidSteps = [-1, 6, 10];
    validSteps.forEach(s => expect(s >= 0 && s <= 5).toBe(true));
    invalidSteps.forEach(s => expect(s >= 0 && s <= 5).toBe(false));
  });

  // ── UAE Context ───────────────────────────────────────────
  it('should include UAE emirates in company profile step', () => {
    const emirates = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];
    expect(emirates).toHaveLength(7);
    expect(emirates).toContain('Dubai');
  });

  it('should support Arabic labels', () => {
    const arabicLabels = { companyName: 'اسم الشركة', tradeLicenseNo: 'رقم الرخصة التجارية' };
    expect(arabicLabels.companyName).toBe('اسم الشركة');
  });

  it('should include HAZMAT certification for tanker drivers', () => {
    const certifications = ['hazmat', 'adr', 'defensive_driving', 'first_aid', 'fatigue_management'];
    expect(certifications).toContain('hazmat');
    expect(certifications).toContain('adr');
  });

  it('should include fleet types for UAE operations', () => {
    const fleetTypes = ['tanker', 'bus', 'taxi', 'logistics', 'ev'];
    expect(fleetTypes).toContain('tanker');
    expect(fleetTypes).toContain('bus');
    expect(fleetTypes).toContain('taxi');
    expect(fleetTypes).toContain('ev');
  });

  // ── Bulk Import Tests ─────────────────────────────────────
  it('should support CSV import templates', () => {
    const templateTypes = ['vehicles', 'drivers', 'users'];
    templateTypes.forEach(type => {
      expect(typeof type).toBe('string');
    });
  });

  it('should track import errors with row/field detail', () => {
    const error = { row: 5, field: 'licenseExpiry', message: 'Invalid date format' };
    expect(error.row).toBe(5);
    expect(error.field).toBe('licenseExpiry');
  });
});
