import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

/**
 * DriverSessionBlock — Patent-Pending Session-Block Data Model
 *
 * Each row represents a COMPLETE, IMMUTABLE driver session on a vehicle.
 * Created when driver authenticates (FaceID/NFC/biometric).
 * Closed when driver logs out or next driver authenticates.
 * TPM 2.0 signed on the SVG edge device — tamper-proof.
 *
 * Variance columns computed via Welford's streaming algorithm on edge.
 * Only 3 numbers per metric needed (count, mean, M2) during session.
 * Final σ² stored at block close. No raw samples stored.
 */
@Entity('driver_session_blocks')
@Index(['vehicleId', 'startTime'])
@Index(['driverId', 'startTime'])
@Index(['vehicleId', 'driverId'])
@Index(['blockNumber'], { unique: true })
export class DriverSessionBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bigint', unique: true, comment: 'Monotonically increasing block number per fleet' })
  blockNumber: number;

  // ─── Session Identity ───────────────────────────────────────
  @Column('uuid')
  vehicleId: string;

  @Column('uuid')
  driverId: string;

  @Column({ length: 100, comment: 'Driver full name (denormalized for query performance)' })
  driverName: string;

  @Column({ type: 'enum', enum: ['faceid_nfc', 'pin_rfid', 'biometric', 'manual'], default: 'faceid_nfc' })
  authMethod: string;

  @Column({ length: 50, nullable: true, comment: 'SVG device ID that captured this session' })
  svgDeviceId: string;

  // ─── Temporal Bounds ────────────────────────────────────────
  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz', nullable: true, comment: 'Null while session is active' })
  endTime: Date;

  @Column({ type: 'float', default: 0, comment: 'Duration in minutes' })
  durationMinutes: number;

  @Column({ type: 'enum', enum: ['active', 'closed', 'interrupted', 'invalid'], default: 'active' })
  status: string;

  // ─── Odometer & Distance ────────────────────────────────────
  @Column({ type: 'float', comment: 'Odometer at session start (km)' })
  odometerStart: number;

  @Column({ type: 'float', nullable: true, comment: 'Odometer at session end (km)' })
  odometerEnd: number;

  @Column({ type: 'float', default: 0, comment: 'Distance traveled (km)' })
  distanceKm: number;

  // ─── Fuel ───────────────────────────────────────────────────
  @Column({ type: 'float', comment: 'Fuel level % at start' })
  fuelLevelStart: number;

  @Column({ type: 'float', nullable: true, comment: 'Fuel level % at end' })
  fuelLevelEnd: number;

  @Column({ type: 'float', default: 0, comment: 'Fuel consumed in liters' })
  fuelConsumedL: number;

  @Column({ type: 'float', default: 0, comment: 'Fuel cost in AED' })
  fuelCostAED: number;

  @Column({ type: 'float', default: 0, comment: 'L/100km for this session' })
  lPer100km: number;

  @Column({ type: 'jsonb', default: '[]', comment: 'Refueling events during session' })
  fuelEvents: {
    time: string; gpsLat: number; gpsLng: number;
    station: string; liters: number; costAED: number;
  }[];

  // ─── Driving Behavior ───────────────────────────────────────
  @Column({ type: 'int', default: 0 })
  harshBrakes: number;

  @Column({ type: 'int', default: 0 })
  harshAccelerations: number;

  @Column({ type: 'int', default: 0 })
  harshCorners: number;

  @Column({ type: 'float', default: 0, comment: 'Maximum speed during session (km/h)' })
  maxSpeedKmh: number;

  @Column({ type: 'float', default: 0, comment: 'Average speed (km/h)' })
  avgSpeedKmh: number;

  @Column({ type: 'float', default: 0, comment: 'Idle duration in minutes' })
  idleMinutes: number;

  @Column({ type: 'float', default: 0, comment: 'Idle percentage of total session' })
  idlePct: number;

  // ─── Route Context ──────────────────────────────────────────
  @Column({ type: 'float', default: 0, comment: 'Percentage of distance on highway' })
  routeHighwayPct: number;

  @Column({ type: 'float', default: 0, comment: 'Percentage of distance in urban areas' })
  routeUrbanPct: number;

  @Column({ type: 'float', default: 0, comment: 'Cumulative elevation gain (meters)' })
  elevationGainM: number;

  @Column({ type: 'float', default: 0, comment: 'Average load weight (kg)' })
  loadWeightKg: number;

  @Column({ type: 'float', default: 0, comment: 'Average ambient temperature (°C)' })
  ambientTempC: number;

  // ─── DTCs Generated ─────────────────────────────────────────
  @Column({ type: 'jsonb', default: '[]', comment: 'DTC codes generated during this session' })
  dtcsGenerated: string[];

  // ═══════════════════════════════════════════════════════════════
  // VARIANCE COLUMNS — The Innovation
  // Computed via Welford's online algorithm on SVG 2.0 edge device
  // Only 3 numbers per metric: count, mean, M2
  // Final variance = M2 / count at block close
  // Total memory: ~2KB per session on device
  // ═══════════════════════════════════════════════════════════════

  @Column({ type: 'float', default: 0, comment: 'Mean RPM during session' })
  rpmMean: number;

  @Column({ type: 'float', default: 0, comment: 'RPM variance (σ²) — Welford algorithm' })
  rpmVariance: number;

  @Column({ type: 'float', default: 0, comment: 'Speed variance (σ²)' })
  speedVariance: number;

  @Column({ type: 'float', default: 0, comment: 'Fuel rate variance (σ²) — L/h' })
  fuelRateVariance: number;

  @Column({ type: 'float', default: 0, comment: 'Acceleration variance (σ²) — m/s²' })
  accelVariance: number;

  // ─── Computed Scores ────────────────────────────────────────
  @Column({ type: 'float', default: 0, comment: 'Session wear index (0-1): higher = more wear' })
  wearIndex: number;

  @Column({ type: 'float', default: 0, comment: 'Vehicle health score delta for this session' })
  healthDelta: number;

  // ─── Cryptographic Integrity ────────────────────────────────
  @Column({ type: 'boolean', default: false, comment: 'Whether block is TPM 2.0 signed' })
  tpmSigned: boolean;

  @Column({ length: 130, nullable: true, comment: 'SHA-256 hash of block data, signed by TPM' })
  blockHash: string;

  @Column({ length: 260, nullable: true, comment: 'TPM signature of blockHash' })
  tpmSignature: string;

  // ─── GPS Trace ──────────────────────────────────────────────
  @Column({ type: 'text', nullable: true, comment: 'Encoded polyline of GPS trace' })
  gpsPolyline: string;

  // ─── Timestamps ─────────────────────────────────────────────
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
