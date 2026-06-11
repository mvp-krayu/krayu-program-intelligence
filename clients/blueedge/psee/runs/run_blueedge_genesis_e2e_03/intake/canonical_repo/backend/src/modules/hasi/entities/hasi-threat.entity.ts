import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * HASI Threat — Security threats detected on SVG network traffic
 * Maps to HASI's ThreatIndicator model
 * 9 detection methods: blackhole DNS, suspicious ports, C2 patterns, etc.
 */
@Entity('hasi_threats')
@Index(['svgDeviceId', 'detectedAt'])
@Index(['captureId'])
@Index(['severity'])
@Index(['status'])
@Index(['threatCategory'])
export class HasiThreat {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column() captureId: string; // FK → hasi_captures.id
  @Column() svgDeviceId: string;
  @Column({ length: 50 }) svgHardwareId: string;
  @Column({ nullable: true }) hasiThreatId: string; // original ID from HASI

  // ── Threat Classification ────────────────────────────────────
  @Column({ type: 'enum', enum: [
    'blackhole_dns', 'suspicious_port', 'c2_communication', 'port_scan',
    'data_exfiltration', 'protocol_anomaly', 'dns_tunneling', 'arp_spoofing',
    'brute_force', 'unauthorized_access', 'malware_signature', 'lateral_movement',
    'privilege_escalation', 'can_bus_injection', 'j1939_spoofing', 'mqtt_unauthorized',
    'firmware_tampering', 'replay_attack', 'man_in_the_middle', 'custom'
  ], default: 'custom' })
  threatCategory: string;

  @Column({ type: 'enum', enum: ['critical', 'high', 'medium', 'low', 'info'], default: 'medium' })
  severity: string;

  @Column({ type: 'enum', enum: ['active', 'investigating', 'mitigated', 'resolved', 'false_positive', 'suppressed'], default: 'active' })
  status: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) confidenceScore: number; // 0-100

  // ── Threat Details ───────────────────────────────────────────
  @Column({ length: 500 }) description: string;
  @Column({ type: 'text', nullable: true }) detailedAnalysis: string;
  @Column({ length: 100, nullable: true }) indicatorType: string; // ip, domain, port, pattern
  @Column({ length: 200, nullable: true }) indicatorValue: string;

  // ── Source & Destination ─────────────────────────────────────
  @Column({ length: 45, nullable: true }) sourceIp: string;
  @Column({ type: 'int', nullable: true }) sourcePort: number;
  @Column({ length: 45, nullable: true }) destinationIp: string;
  @Column({ type: 'int', nullable: true }) destinationPort: number;
  @Column({ length: 20, nullable: true }) protocol: string;
  @Column({ type: 'int', nullable: true }) packetCount: number;
  @Column({ type: 'bigint', nullable: true }) byteCount: number;

  // ── Enrichment ───────────────────────────────────────────────
  @Column({ length: 100, nullable: true }) sourceCountry: string;
  @Column({ length: 100, nullable: true }) sourceAsn: string;
  @Column({ length: 200, nullable: true }) sourceOrg: string;
  @Column({ length: 100, nullable: true }) destCountry: string;
  @Column({ length: 100, nullable: true }) destAsn: string;
  @Column({ length: 200, nullable: true }) destOrg: string;

  // ── Vehicle / Fleet Context ──────────────────────────────────
  @Column({ type: 'enum', enum: ['vehicle_network', 'can_bus', 'mqtt_broker', 'cloud_uplink', 'sensor_mesh', 'diagnostic_port', 'external'], default: 'vehicle_network' })
  networkZone: string;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) latitude: number;
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) longitude: number;

  // ── Response ─────────────────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  recommendedActions: { action: string; priority: string; automated: boolean }[];

  @Column({ default: false }) autoMitigated: boolean;
  @Column({ type: 'text', nullable: true }) mitigationAction: string; // e.g. "Blocked port 4444 via iptables"
  @Column({ nullable: true }) mitigatedAt: Date;
  @Column({ length: 100, nullable: true }) mitigatedBy: string; // user or 'auto'
  @Column({ length: 500, nullable: true }) resolutionNotes: string;

  // ── MITRE ATT&CK ─────────────────────────────────────────────
  @Column({ length: 20, nullable: true }) mitreTacticId: string; // e.g. TA0001
  @Column({ length: 100, nullable: true }) mitreTacticName: string;
  @Column({ length: 20, nullable: true }) mitreTechniqueId: string; // e.g. T1071
  @Column({ length: 100, nullable: true }) mitreTechniqueName: string;

  // ── Audit ────────────────────────────────────────────────────
  @Column() detectedAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
