import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * SVG 2.0 Smart Vehicle Gateway — Core Device Entity
 * Maps 1:1 to frontend SVGDevice interface
 * Supports full provisioning lifecycle, TPM attestation, blockchain identity
 */
@Entity('devices')
@Index(['serialNumber'], { unique: true })
@Index(['hardwareId'], { unique: true })
@Index(['vehicleId'])
@Index(['status'])
@Index(['lifecycle'])
@Index(['fleetType'])
@Index(['ownerId'])
export class Device {
  @PrimaryGeneratedColumn('uuid') id: string;

  // ── Identity ─────────────────────────────────────────────────
  @Column({ length: 50, unique: true }) hardwareId: string;
  @Column({ length: 50, unique: true }) serialNumber: string;
  @Column({ length: 50 }) partNumber: string;
  @Column({ length: 20, nullable: true }) macAddress: string;
  @Column({ length: 20, nullable: true }) imei: string;
  @Column({ length: 22, nullable: true }) simIccid: string;

  // ── Status & Lifecycle ───────────────────────────────────────
  @Column({ type: 'enum', enum: ['online', 'offline', 'warning', 'error', 'provisioning'], default: 'provisioning' })
  status: string;

  @Column({ type: 'enum', enum: ['manufactured', 'provisioned', 'deployed', 'operational', 'maintenance', 'decommissioned'], default: 'manufactured' })
  lifecycle: string;

  @Column({ type: 'enum', enum: ['svg_gateway', 'obd_dongle', 'dashcam', 'sensor', 'beacon'], default: 'svg_gateway' })
  deviceType: string;

  @Column({ type: 'enum', enum: ['tanker', 'bus', 'taxi', 'ev', 'coldchain'], default: 'tanker' })
  fleetType: string;

  // ── Ownership ────────────────────────────────────────────────
  @Column({ nullable: true }) ownerId: string;
  @Column({ length: 150, nullable: true }) ownerName: string;
  @Column({ nullable: true }) vehicleId: string;
  @Column({ length: 100, nullable: true }) location: string;

  // ── Firmware & Software ──────────────────────────────────────
  @Column({ length: 30, nullable: true }) firmwareVersion: string;
  @Column({ length: 30, nullable: true }) hardwareVersion: string;
  @Column({ length: 30, nullable: true }) softwareVersion: string;
  @Column({ length: 30, nullable: true }) configVersion: string;

  // ── Manufacturing ────────────────────────────────────────────
  @Column({ type: 'date', nullable: true }) manufacturingDate: Date;
  @Column({ length: 100, nullable: true }) factoryLocation: string;
  @Column({ length: 50, nullable: true }) batchNumber: string;
  @Column({ length: 100, nullable: true }) manufacturer: string;

  // ── TPM & Security ───────────────────────────────────────────
  @Column({ default: false }) tpmAttested: boolean;
  @Column({ type: 'text', nullable: true }) tpmEndorsementKey: string;
  @Column({ default: false }) qcPassed: boolean;
  @Column({ length: 66, nullable: true }) blockchainAddress: string;
  @Column({ length: 66, nullable: true }) blockchainNftTokenId: string;

  // ── Network ──────────────────────────────────────────────────
  @Column({ type: 'enum', enum: ['5G', '4G LTE', '4G', '3G Fallback', 'Satellite', 'WiFi', 'Offline'], default: '4G LTE' })
  networkType: string;
  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true }) gpsAccuracy: number;

  // ── Runtime Health (updated by telemetry ingestion) ──────────
  @Column({ type: 'int', default: 0 }) uptimeHours: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) cpuUsage: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) memoryUsage: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) temperature: number;
  @Column({ nullable: true }) lastHeartbeat: Date;
  @Column({ nullable: true }) lastTelemetryAt: Date;

  // ── Configuration ────────────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" }) capabilities: string[];
  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" }) configuration: Record<string, any>;
  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" }) protocolConfig: Record<string, any>;

  // ── Audit ────────────────────────────────────────────────────
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @Column({ nullable: true }) provisionedAt: Date;
  @Column({ nullable: true }) deployedAt: Date;
  @Column({ nullable: true }) decommissionedAt: Date;
  @Column({ length: 100, nullable: true }) provisionedBy: string;
  @Column({ length: 500, nullable: true }) notes: string;
}
