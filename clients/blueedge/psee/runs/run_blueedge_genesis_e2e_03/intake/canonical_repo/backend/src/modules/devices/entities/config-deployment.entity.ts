import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('config_deployments')
@Index(['deviceId'])
@Index(['status'])
@Index(['campaignId'])
export class ConfigDeployment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() deviceId: string;
  @Column({ nullable: true }) campaignId: string;

  // ── Deployment Details ───────────────────────────────────────
  @Column({ type: 'enum', enum: ['device_config', 'network_config', 'protocol_config', 'firmware_update', 'security_patch', 'feature_flag', 'geofence_update'], default: 'device_config' })
  configType: string;

  @Column({ length: 30, nullable: true }) fromVersion: string;
  @Column({ length: 30 }) toVersion: string;

  @Column({ type: 'enum', enum: ['pending_approval', 'approved', 'scheduled', 'deploying', 'deployed', 'verifying', 'verified', 'failed', 'rolled_back', 'rejected'], default: 'pending_approval' })
  status: string;

  // ── Configuration Payload ────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true }) configPayload: Record<string, any>;
  @Column({ type: 'jsonb', nullable: true }) configDiff: { field: string; oldValue: any; newValue: any }[];
  @Column({ type: 'int', nullable: true }) payloadSizeBytes: number;

  // ── Approval Workflow ────────────────────────────────────────
  @Column({ default: true }) requiresApproval: boolean;
  @Column({ nullable: true }) requestedBy: string;
  @Column({ nullable: true }) approvedBy: string;
  @Column({ nullable: true }) approvedAt: Date;
  @Column({ length: 500, nullable: true }) approvalNotes: string;
  @Column({ nullable: true }) rejectedBy: string;
  @Column({ length: 500, nullable: true }) rejectionReason: string;

  // ── Scheduling ───────────────────────────────────────────────
  @Column({ nullable: true }) scheduledAt: Date;
  @Column({ type: 'enum', enum: ['immediate', 'scheduled', 'maintenance_window', 'next_idle'], default: 'immediate' })
  deploymentWindow: string;

  // ── Staged Rollout ───────────────────────────────────────────
  @Column({ type: 'enum', enum: ['single', 'batch', 'canary', 'rolling'], default: 'single' })
  rolloutStrategy: string;
  @Column({ type: 'int', nullable: true }) rolloutPercentage: number;
  @Column({ type: 'int', nullable: true }) batchSize: number;

  // ── Execution ────────────────────────────────────────────────
  @Column({ nullable: true }) deployedAt: Date;
  @Column({ nullable: true }) verifiedAt: Date;
  @Column({ type: 'int', nullable: true }) deployDurationMs: number;
  @Column({ default: false }) deviceAcknowledged: boolean;
  @Column({ nullable: true }) deviceAckedAt: Date;

  // ── Rollback ─────────────────────────────────────────────────
  @Column({ default: true }) autoRollbackOnFailure: boolean;
  @Column({ nullable: true }) rolledBackAt: Date;
  @Column({ length: 500, nullable: true }) rollbackReason: string;
  @Column({ type: 'jsonb', nullable: true }) previousConfig: Record<string, any>;

  // ── Audit ────────────────────────────────────────────────────
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" }) auditLog: any[];
}
