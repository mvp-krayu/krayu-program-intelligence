import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

/**
 * HASI Capture — Network traffic analysis session from SVG device
 * HASI runs natively on SVG Yocto Linux, pushes results to Blue Edge cloud
 */
@Entity('hasi_captures')
@Index(['svgDeviceId', 'createdAt'])
@Index(['status'])
@Index(['threatCount'])
export class HasiCapture {
  @PrimaryGeneratedColumn('uuid') id: string;

  // ── Source SVG ───────────────────────────────────────────────
  @Column() svgDeviceId: string; // FK → devices.id
  @Column({ length: 50 }) svgHardwareId: string;
  @Column({ length: 100, nullable: true }) vehicleId: string;

  // ── Capture Metadata ─────────────────────────────────────────
  @Column({ length: 50, nullable: true }) hasiCaptureId: string; // original ID from HASI
  @Column({ length: 255, nullable: true }) filename: string;
  @Column({ type: 'int', nullable: true }) fileSizeBytes: number;
  @Column({ length: 64, nullable: true }) fileHashSha256: string;
  @Column({ length: 20, default: 'pcapng' }) captureFormat: string;

  @Column({ type: 'enum', enum: ['uploaded', 'parsing', 'analyzed', 'error'], default: 'analyzed' })
  status: string;

  // ── Analysis Summary ─────────────────────────────────────────
  @Column({ type: 'int', default: 0 }) totalPackets: number;
  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true }) captureDurationSec: number;
  @Column({ nullable: true }) captureStartTime: Date;
  @Column({ nullable: true }) captureEndTime: Date;
  @Column({ type: 'int', default: 0 }) uniqueSources: number;
  @Column({ type: 'int', default: 0 }) uniqueDestinations: number;
  @Column({ type: 'int', default: 0 }) totalFlows: number;
  @Column({ type: 'int', default: 0 }) threatCount: number;

  // ── Protocol Distribution ────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
  protocolSummary: Record<string, number>; // {"TCP": 1234, "J1939": 567, "MQTT": 89}

  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
  protocolClassification: Record<string, number>; // {"routing": 45, "application": 890, "infrastructure": 120}

  // ── Network Stats ────────────────────────────────────────────
  @Column({ type: 'bigint', nullable: true }) totalBytesIn: number;
  @Column({ type: 'bigint', nullable: true }) totalBytesOut: number;
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  topSources: { ip: string; packets: number; bytes: number; country?: string; asn?: string }[];
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  topDestinations: { ip: string; packets: number; bytes: number; country?: string; asn?: string }[];
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  topPorts: { port: number; protocol: string; packets: number; service?: string }[];

  // ── AI Analysis ──────────────────────────────────────────────
  @Column({ default: false }) aiAnalyzed: boolean;
  @Column({ type: 'text', nullable: true }) aiSummary: string;
  @Column({ type: 'jsonb', nullable: true }) aiRecommendations: { type: string; description: string; priority: string }[];

  // ── Capture Context ──────────────────────────────────────────
  @Column({ type: 'enum', enum: ['continuous', 'scheduled', 'triggered', 'manual', 'incident'], default: 'continuous' })
  captureMode: string;

  @Column({ type: 'enum', enum: ['all', 'can_bus', 'wan', 'mqtt', 'diagnostic', 'custom'], default: 'all' })
  captureScope: string; // which interfaces were captured

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) latitude: number;
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) longitude: number;

  @CreateDateColumn() createdAt: Date;
  @Column({ nullable: true }) analyzedAt: Date;
}
