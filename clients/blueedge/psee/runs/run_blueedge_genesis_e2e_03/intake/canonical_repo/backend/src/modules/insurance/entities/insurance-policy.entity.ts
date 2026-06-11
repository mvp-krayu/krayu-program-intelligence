import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * InsurancePolicy — Links fleet vehicles to insurance policies
 * with DWVS-based premium computation from TPM-signed session blocks.
 */
@Entity('insurance_policies')
@Index(['vehicleId'])
@Index(['policyNumber'], { unique: true })
@Index(['providerId', 'status'])
export class InsurancePolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  vehicleId: string;

  @Column({ length: 50, nullable: true })
  fleetId: string;

  @Column({ length: 100, comment: 'Insurance policy number' })
  policyNumber: string;

  @Column({ length: 100, comment: 'Insurance provider name' })
  providerName: string;

  @Column('uuid')
  providerId: string;

  @Column({ type: 'enum', enum: ['comprehensive', 'third_party', 'fleet_blanket', 'cargo', 'liability', 'hazmat'], default: 'comprehensive' })
  policyType: string;

  @Column({ type: 'enum', enum: ['active', 'pending', 'expired', 'cancelled', 'suspended', 'renewal_pending'], default: 'active' })
  status: string;

  // Premium & Financials
  @Column({ type: 'float', comment: 'Base annual premium in AED' })
  basePremiumAED: number;

  @Column({ type: 'float', default: 0, comment: 'DWVS-adjusted premium in AED' })
  adjustedPremiumAED: number;

  @Column({ type: 'float', default: 0, comment: 'Discount percentage based on DWVS' })
  dwvsDiscountPct: number;

  @Column({ type: 'float', default: 0, comment: 'Fleet avg DWVS at last computation' })
  fleetAvgDwvs: number;

  @Column({ type: 'float', default: 0, comment: 'Vehicle-specific avg DWVS' })
  vehicleAvgDwvs: number;

  @Column({ type: 'int', default: 0, comment: 'Number of TPM-signed blocks submitted' })
  tpmBlocksSubmitted: number;

  @Column({ type: 'float', default: 0, comment: 'Deductible amount in AED' })
  deductibleAED: number;

  @Column({ type: 'float', default: 0, comment: 'Coverage limit in AED' })
  coverageLimitAED: number;

  // Temporal
  @Column({ type: 'date' })
  effectiveDate: Date;

  @Column({ type: 'date' })
  expiryDate: Date;

  @Column({ type: 'date', nullable: true })
  lastDwvsSubmissionDate: Date;

  @Column({ type: 'date', nullable: true })
  nextReviewDate: Date;

  // Claims
  @Column({ type: 'int', default: 0 })
  totalClaims: number;

  @Column({ type: 'float', default: 0, comment: 'Total claimed amount in AED' })
  totalClaimedAED: number;

  // API Integration
  @Column({ type: 'jsonb', default: '{}', comment: 'Provider API config (encrypted)' })
  apiConfig: Record<string, any>;

  @Column({ type: 'jsonb', default: '[]', comment: 'Submission history' })
  submissionHistory: { date: string; blocksCount: number; avgDwvs: number; response: string }[];

  // Metadata
  @Column({ type: 'jsonb', default: '{}' })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
