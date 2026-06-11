import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ota_updates')
@Index(['deviceId', 'status'])
@Index(['campaignId'])
@Index(['status', 'scheduledAt'])
export class OtaUpdate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deviceId: string;

  @Column({ nullable: true })
  vehicleId: string;

  @Column({ nullable: true })
  campaignId: string;

  @Column({ length: 100 })
  packageName: string;

  @Column({ length: 30 })
  fromVersion: string;

  @Column({ length: 30 })
  toVersion: string;

  @Column({ type: 'enum', enum: ['firmware', 'config', 'model', 'map', 'certificate', 'application'], default: 'firmware' })
  updateType: string;

  @Column({ type: 'enum', enum: ['pending', 'downloading', 'downloaded', 'installing', 'verifying', 'completed', 'failed', 'rolled_back', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ type: 'bigint', nullable: true, comment: 'Package size in bytes' })
  packageSizeBytes: number;

  @Column({ length: 64, nullable: true })
  checksumSha256: string;

  @Column({ type: 'float', default: 0 })
  progressPercent: number;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  rollbackInfo: {
    previousVersion: string;
    rollbackAvailable: boolean;
    rollbackReason?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  preConditions: {
    minBatteryPercent?: number;
    requireStationary?: boolean;
    requireWifi?: boolean;
    maintenanceWindow?: string;
  };

  @Column({ nullable: true })
  approvedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
