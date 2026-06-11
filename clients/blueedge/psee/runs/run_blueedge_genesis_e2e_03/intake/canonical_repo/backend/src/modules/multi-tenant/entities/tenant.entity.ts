import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum TenantStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  CANCELLED = 'cancelled',
  PENDING_SETUP = 'pending_setup',
}

export enum SubscriptionPlan {
  STARTER = 'starter',       // Up to 25 vehicles
  PROFESSIONAL = 'professional', // Up to 100 vehicles
  ENTERPRISE = 'enterprise',   // Up to 500 vehicles
  UNLIMITED = 'unlimited',     // Unlimited + white-label
}

export enum TenantRegion {
  UAE = 'uae',
  GCC = 'gcc',
  EAST_AFRICA = 'east_africa',
  EUROPE = 'europe',
  GLOBAL = 'global',
}

@Entity('tenants')
export class Tenant {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;

  @ApiProperty() @Column({ length: 200, unique: true })
  name: string;

  @ApiProperty() @Column({ length: 100, unique: true })
  slug: string; // URL-safe identifier: "blue-edge", "enoc-fleet"

  @ApiProperty() @Column({ type: 'enum', enum: TenantStatus, default: TenantStatus.PENDING_SETUP })
  status: TenantStatus;

  @ApiProperty() @Column({ type: 'enum', enum: SubscriptionPlan, default: SubscriptionPlan.STARTER })
  plan: SubscriptionPlan;

  @ApiProperty() @Column({ type: 'enum', enum: TenantRegion, default: TenantRegion.UAE })
  region: TenantRegion;

  // ── Organization Details ──────────────────────────────────
  @ApiProperty() @Column({ nullable: true }) tradeLicenseNo: string;   // UAE trade license
  @ApiProperty() @Column({ nullable: true }) taxRegistrationNo: string; // UAE TRN (VAT)
  @ApiProperty() @Column({ nullable: true }) companyEmail: string;
  @ApiProperty() @Column({ nullable: true }) companyPhone: string;
  @ApiProperty() @Column({ nullable: true }) address: string;
  @ApiProperty() @Column({ nullable: true }) emirate: string;          // Dubai, Abu Dhabi, etc.
  @ApiProperty() @Column({ nullable: true }) country: string;

  // ── Branding ──────────────────────────────────────────────
  @ApiProperty() @Column({ nullable: true }) logoUrl: string;
  @ApiProperty() @Column({ default: '#0891b2' }) primaryColor: string;
  @ApiProperty() @Column({ nullable: true }) domain: string;           // Custom domain

  // ── Limits & Quotas (plan-based) ──────────────────────────
  @ApiProperty() @Column({ default: 25 }) maxVehicles: number;
  @ApiProperty() @Column({ default: 50 }) maxDrivers: number;
  @ApiProperty() @Column({ default: 5 }) maxUsers: number;
  @ApiProperty() @Column({ default: 1 }) maxFleets: number;
  @ApiProperty() @Column({ type: 'simple-array', nullable: true })
  enabledModules: string[];  // ['tanker', 'bus', 'taxi', 'coldchain', 'ev', 'predictive-maintenance']

  // ── Usage Counters ────────────────────────────────────────
  @ApiProperty() @Column({ default: 0 }) currentVehicles: number;
  @ApiProperty() @Column({ default: 0 }) currentDrivers: number;
  @ApiProperty() @Column({ default: 0 }) currentUsers: number;
  @ApiProperty() @Column({ default: 0 }) apiCallsThisMonth: number;
  @ApiProperty() @Column({ default: 0 }) storageUsedMb: number;

  // ── Billing ───────────────────────────────────────────────
  @ApiProperty() @Column({ nullable: true }) billingEmail: string;
  @ApiProperty() @Column({ default: 'AED' }) currency: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) monthlyRate: number;
  @ApiProperty() @Column({ nullable: true }) stripeCustomerId: string;
  @ApiProperty() @Column({ nullable: true }) trialEndsAt: Date;

  // ── Onboarding State ──────────────────────────────────────
  @ApiProperty() @Column({ default: 0 }) onboardingStep: number;       // 0-5 wizard progress
  @ApiProperty() @Column({ default: false }) onboardingComplete: boolean;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) onboardingData: Record<string, any>;

  // ── Settings ──────────────────────────────────────────────
  @ApiProperty() @Column({ default: 'en' }) defaultLanguage: string;
  @ApiProperty() @Column({ default: 'Asia/Dubai' }) timezone: string;
  @ApiProperty() @Column({ default: 'km' }) distanceUnit: string;     // km or mi
  @ApiProperty() @Column({ default: 'liters' }) fuelUnit: string;     // liters or gallons
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) featureFlags: Record<string, boolean>;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) customConfig: Record<string, any>;

  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}

// ── Plan Configuration ────────────────────────────────────────
export const PLAN_LIMITS: Record<SubscriptionPlan, { maxVehicles: number; maxDrivers: number; maxUsers: number; maxFleets: number; monthlyRateAed: number; modules: string[] }> = {
  [SubscriptionPlan.STARTER]: {
    maxVehicles: 25, maxDrivers: 50, maxUsers: 5, maxFleets: 1, monthlyRateAed: 2500,
    modules: ['vehicles', 'drivers', 'trips', 'alerts', 'maintenance', 'fuel', 'reports'],
  },
  [SubscriptionPlan.PROFESSIONAL]: {
    maxVehicles: 100, maxDrivers: 200, maxUsers: 20, maxFleets: 5, monthlyRateAed: 7500,
    modules: ['vehicles', 'drivers', 'trips', 'alerts', 'maintenance', 'fuel', 'reports', 'analytics', 'compliance', 'safety', 'tanker', 'bus', 'taxi', 'geofence-automation', 'driver-scoring'],
  },
  [SubscriptionPlan.ENTERPRISE]: {
    maxVehicles: 500, maxDrivers: 1000, maxUsers: 100, maxFleets: 20, monthlyRateAed: 25000,
    modules: ['vehicles', 'drivers', 'trips', 'alerts', 'maintenance', 'fuel', 'reports', 'analytics', 'compliance', 'safety', 'tanker', 'bus', 'taxi', 'geofence-automation', 'driver-scoring', 'predictive-maintenance', 'anomaly-detection', 'coldchain', 'ev', 'blockchain', 'executive', 'finance'],
  },
  [SubscriptionPlan.UNLIMITED]: {
    maxVehicles: 999999, maxDrivers: 999999, maxUsers: 999999, maxFleets: 999999, monthlyRateAed: 50000,
    modules: ['*'], // All modules
  },
};
