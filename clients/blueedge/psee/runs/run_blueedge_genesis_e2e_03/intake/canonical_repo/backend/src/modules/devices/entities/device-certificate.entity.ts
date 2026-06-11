import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

@Entity('device_certificates')
@Index(['deviceId'])
@Index(['status'])
@Index(['validUntil'])
@Index(['fingerprint'], { unique: true })
export class DeviceCertificate {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() deviceId: string;

  // ── Certificate Identity ─────────────────────────────────────
  @Column({ type: 'enum', enum: ['device_auth', 'tls_client', 'mqtt_broker', 'blockchain_signing', 'ota_verification', 'fleet_mesh', 'api_access'], default: 'device_auth' })
  purpose: string;

  @Column({ length: 200 }) commonName: string;
  @Column({ length: 200 }) issuer: string;
  @Column({ length: 64, unique: true }) fingerprint: string; // SHA-256

  // ── Validity ─────────────────────────────────────────────────
  @Column() issuedAt: Date;
  @Column() validUntil: Date;

  @Column({ type: 'enum', enum: ['active', 'expired', 'revoked', 'pending_renewal', 'suspended'], default: 'active' })
  status: string;

  // ── Key Details ──────────────────────────────────────────────
  @Column({ type: 'enum', enum: ['RSA-2048', 'RSA-4096', 'ECDSA-P256', 'ECDSA-P384', 'Ed25519', 'KYBER-768'], default: 'ECDSA-P256' })
  keyAlgorithm: string;

  @Column({ type: 'text', nullable: true }) publicKey: string;
  @Column({ type: 'text', nullable: true }) certificatePem: string;

  // ── Chain of Trust ───────────────────────────────────────────
  @Column({ nullable: true }) parentCertId: string;
  @Column({ type: 'enum', enum: ['root', 'intermediate', 'leaf'], default: 'leaf' })
  chainLevel: string;

  // ── Revocation ───────────────────────────────────────────────
  @Column({ nullable: true }) revokedAt: Date;
  @Column({ length: 200, nullable: true }) revocationReason: string;
  @Column({ length: 100, nullable: true }) revokedBy: string;

  // ── Renewal ──────────────────────────────────────────────────
  @Column({ nullable: true }) renewedFromId: string;
  @Column({ type: 'int', default: 0 }) renewalCount: number;
  @Column({ default: true }) autoRenew: boolean;
  @Column({ type: 'int', default: 30 }) renewalWarningDays: number;

  // ── Audit ────────────────────────────────────────────────────
  @CreateDateColumn() createdAt: Date;
  @Column({ length: 100, nullable: true }) createdBy: string;
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" }) auditLog: any[];
}
