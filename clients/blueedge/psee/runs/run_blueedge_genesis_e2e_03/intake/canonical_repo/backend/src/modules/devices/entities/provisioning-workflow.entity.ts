import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('provisioning_workflows')
@Index(['deviceId'])
@Index(['status'])
@Index(['batchId'])
export class ProvisioningWorkflow {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() deviceId: string;
  @Column({ nullable: true }) batchId: string;

  // ── Workflow Status ──────────────────────────────────────────
  @Column({ type: 'enum', enum: ['queued', 'in_progress', 'completed', 'failed', 'cancelled', 'rolling_back', 'rolled_back'], default: 'queued' })
  status: string;

  @Column({ type: 'int', default: 0 }) currentStep: number;
  @Column({ type: 'int', default: 8 }) totalSteps: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) progressPercent: number;

  // ── 8-Step Provisioning Pipeline ─────────────────────────────
  @Column({ type: 'jsonb', default: () => `'${JSON.stringify([
    { step: 1, title: 'Validate Device Information', status: 'pending', startedAt: null, completedAt: null, duration: null, logs: [] },
    { step: 2, title: 'Register in Device Database', status: 'pending', startedAt: null, completedAt: null, duration: null, logs: [] },
    { step: 3, title: 'Generate Device Certificates', status: 'pending', startedAt: null, completedAt: null, duration: null, logs: [] },
    { step: 4, title: 'TPM 2.0 Attestation', status: 'pending', startedAt: null, completedAt: null, duration: null, logs: [] },
    { step: 5, title: 'Configure Network & Protocols', status: 'pending', startedAt: null, completedAt: null, duration: null, logs: [] },
    { step: 6, title: 'Blockchain Identity Registration', status: 'pending', startedAt: null, completedAt: null, duration: null, logs: [] },
    { step: 7, title: 'Security Validation & Penetration Test', status: 'pending', startedAt: null, completedAt: null, duration: null, logs: [] },
    { step: 8, title: 'Final Activation & Fleet Assignment', status: 'pending', startedAt: null, completedAt: null, duration: null, logs: [] },
  ])}'` })
  steps: {
    step: number; title: string;
    status: 'pending' | 'active' | 'completed' | 'failed' | 'skipped';
    startedAt: string | null; completedAt: string | null; duration: string | null;
    logs: string[]; error?: string;
  }[];

  // ── Execution Context ────────────────────────────────────────
  @Column({ type: 'enum', enum: ['manual', 'automated', 'batch', 'factory_line'], default: 'manual' })
  triggerType: string;

  @Column({ length: 100, nullable: true }) initiatedBy: string;
  @Column({ nullable: true }) startedAt: Date;
  @Column({ nullable: true }) completedAt: Date;
  @Column({ type: 'int', nullable: true }) totalDurationMs: number;

  // ── Retry & Rollback ─────────────────────────────────────────
  @Column({ type: 'int', default: 0 }) retryCount: number;
  @Column({ type: 'int', default: 3 }) maxRetries: number;
  @Column({ default: true }) autoRetryOnFailure: boolean;
  @Column({ default: true }) rollbackOnCriticalFailure: boolean;
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  rollbackLog: { step: number; action: string; result: string; timestamp: string }[];

  // ── Configuration Snapshot ───────────────────────────────────
  @Column({ type: 'jsonb', nullable: true }) deviceConfigSnapshot: Record<string, any>;
  @Column({ type: 'jsonb', nullable: true }) networkConfigSnapshot: Record<string, any>;
  @Column({ type: 'jsonb', nullable: true }) protocolConfigSnapshot: Record<string, any>;

  // ── Audit ────────────────────────────────────────────────────
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @Column({ length: 500, nullable: true }) notes: string;
}
