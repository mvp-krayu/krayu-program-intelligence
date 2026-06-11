import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * Sensor Reading — TimescaleDB hypertable
 * High-frequency ingestion: up to 1000 readings/sec per SVG
 * Partitioned by timestamp for efficient time-range queries
 */
@Entity('sensor_readings')
@Index(['sensorId', 'timestamp'])
@Index(['svgDeviceId', 'timestamp'])
@Index(['sensorType', 'timestamp'])
@Index(['alertTriggered', 'timestamp'])
export class SensorReading {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() sensorId: string; // FK → sensor_devices.id
  @Column() svgDeviceId: string; // FK → devices.id (denormalized for fast fleet queries)
  @Column({ length: 50 }) sensorType: string;

  // ── Measurement ──────────────────────────────────────────────
  @Column({ type: 'timestamp with time zone' }) timestamp: Date;
  @Column({ type: 'decimal', precision: 16, scale: 6 }) value: number; // primary reading
  @Column({ type: 'decimal', precision: 16, scale: 6, nullable: true }) rawValue: number; // pre-calibration
  @Column({ length: 20 }) unit: string;

  // ── Quality Indicators ───────────────────────────────────────
  @Column({ type: 'enum', enum: ['good', 'degraded', 'suspect', 'bad', 'out_of_range'], default: 'good' })
  quality: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) signalStrength: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) sensorTemperature: number;

  // ── Alerts ───────────────────────────────────────────────────
  @Column({ default: false }) alertTriggered: boolean;
  @Column({ type: 'enum', enum: ['none', 'low', 'high', 'critical_low', 'critical_high', 'rate_of_change', 'sensor_fault'], default: 'none' })
  alertType: string;

  // ── Context ──────────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) latitude: number;
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) longitude: number;
  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true }) vehicleSpeed: number; // km/h at time of reading
  @Column({ length: 20, nullable: true }) vehicleState: string; // moving, idle, parked, loading, unloading

  @CreateDateColumn() createdAt: Date;
}
