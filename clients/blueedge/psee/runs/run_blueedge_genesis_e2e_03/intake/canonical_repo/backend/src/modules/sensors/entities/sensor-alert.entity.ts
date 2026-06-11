import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * Sensor Alert — triggered when thresholds are breached
 * Supports HAZMAT escalation, auto-notifications, and incident linking
 */
@Entity('sensor_alerts')
@Index(['sensorId', 'createdAt'])
@Index(['svgDeviceId', 'createdAt'])
@Index(['severity'])
@Index(['status'])
@Index(['alertType'])
export class SensorAlert {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() sensorId: string;
  @Column() svgDeviceId: string;
  @Column({ length: 50 }) sensorType: string;
  @Column({ nullable: true }) readingId: string; // FK → sensor_readings.id

  // ── Alert Classification ─────────────────────────────────────
  @Column({ type: 'enum', enum: [
    'threshold_high', 'threshold_low', 'critical_high', 'critical_low',
    'rate_of_change', 'sensor_fault', 'sensor_offline', 'calibration_expired',
    'battery_low', 'signal_lost', 'data_quality', 'hazmat_leak',
    'compressor_failure', 'tank_overfill', 'tank_underfill',
    'temperature_exceedance', 'vibration_anomaly', 'custom'
  ], default: 'threshold_high' })
  alertType: string;

  @Column({ type: 'enum', enum: ['critical', 'high', 'medium', 'low', 'info'], default: 'medium' })
  severity: string;

  @Column({ type: 'enum', enum: ['active', 'acknowledged', 'investigating', 'resolved', 'suppressed', 'auto_resolved', 'escalated'], default: 'active' })
  status: string;

  // ── Measurement Context ──────────────────────────────────────
  @Column({ type: 'decimal', precision: 16, scale: 6 }) triggerValue: number;
  @Column({ type: 'decimal', precision: 16, scale: 6, nullable: true }) thresholdValue: number;
  @Column({ length: 20 }) unit: string;
  @Column({ length: 500 }) message: string; // Human-readable alert text

  // ── Location ─────────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) latitude: number;
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) longitude: number;
  @Column({ length: 200, nullable: true }) locationDescription: string;

  // ── Escalation ───────────────────────────────────────────────
  @Column({ default: false }) escalated: boolean;
  @Column({ type: 'int', default: 0 }) escalationLevel: number; // 0=none, 1=supervisor, 2=manager, 3=emergency
  @Column({ nullable: true }) escalatedAt: Date;
  @Column({ length: 100, nullable: true }) escalatedTo: string;
  @Column({ default: false }) emergencyServicesNotified: boolean;
  @Column({ default: false }) hazmatProtocolActivated: boolean;

  // ── Response ─────────────────────────────────────────────────
  @Column({ nullable: true }) acknowledgedAt: Date;
  @Column({ length: 100, nullable: true }) acknowledgedBy: string;
  @Column({ nullable: true }) resolvedAt: Date;
  @Column({ length: 100, nullable: true }) resolvedBy: string;
  @Column({ length: 500, nullable: true }) resolutionNotes: string;
  @Column({ length: 500, nullable: true }) rootCause: string;
  @Column({ type: 'int', nullable: true }) timeToAcknowledgeMs: number;
  @Column({ type: 'int', nullable: true }) timeToResolveMs: number;

  // ── Notifications ────────────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  notificationsSent: { channel: string; recipient: string; sentAt: string; status: string }[];

  // ── Linked Incident ──────────────────────────────────────────
  @Column({ nullable: true }) incidentId: string;
  @Column({ nullable: true }) workOrderId: string;

  // ── Audit ────────────────────────────────────────────────────
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
