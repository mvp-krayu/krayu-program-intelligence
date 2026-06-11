import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('device_transfers')
@Index(['deviceId'])
@Index(['status'])
@Index(['fromOwnerId'])
@Index(['toOwnerId'])
@Index(['blockchainTxHash'])
export class DeviceTransfer {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() deviceId: string;

  // ── Parties ──────────────────────────────────────────────────
  @Column() fromOwnerId: string;
  @Column({ length: 150 }) fromOwnerName: string;
  @Column() toOwnerId: string;
  @Column({ length: 150 }) toOwnerName: string;
  @Column({ length: 200, nullable: true }) toOwnerEmail: string;
  @Column({ length: 66, nullable: true }) toOwnerBlockchainAddress: string;

  // ── Transfer Details ─────────────────────────────────────────
  @Column({ type: 'enum', enum: ['sale', 'gift', 'lease', 'return', 'reassignment', 'warranty_replacement', 'decommission'], default: 'sale' })
  transferType: string;

  @Column({ type: 'enum', enum: ['pending_approval', 'approved', 'in_progress', 'awaiting_payment', 'completed', 'rejected', 'cancelled', 'disputed'], default: 'pending_approval' })
  status: string;

  // ── Financial ────────────────────────────────────────────────
  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true }) priceAmount: number;
  @Column({ length: 3, default: 'USD' }) priceCurrency: string;
  @Column({ default: false }) useEscrow: boolean;
  @Column({ length: 66, nullable: true }) escrowContractAddress: string;
  @Column({ type: 'enum', enum: ['not_required', 'pending', 'funded', 'released', 'refunded'], default: 'not_required' })
  escrowStatus: string;

  // ── Blockchain ───────────────────────────────────────────────
  @Column({ default: true }) recordOnBlockchain: boolean;
  @Column({ length: 66, nullable: true }) blockchainTxHash: string;
  @Column({ type: 'int', nullable: true }) blockNumber: number;
  @Column({ nullable: true }) blockchainConfirmedAt: Date;
  @Column({ length: 66, nullable: true }) nftTransferTxHash: string;

  // ── Approval Workflow ────────────────────────────────────────
  @Column({ default: false }) requiresApproval: boolean;
  @Column({ nullable: true }) approvedBy: string;
  @Column({ nullable: true }) approvedAt: Date;
  @Column({ length: 500, nullable: true }) approvalNotes: string;

  // ── Conditions & Legal ───────────────────────────────────────
  @Column({ type: 'jsonb', nullable: true, default: () => "'[]'" })
  conditions: { id: string; description: string; met: boolean; verifiedAt?: Date }[];

  @Column({ default: false }) warrantyTransferred: boolean;
  @Column({ default: false }) configResetRequired: boolean;
  @Column({ default: false }) configResetCompleted: boolean;
  @Column({ default: false }) certificatesReissued: boolean;

  // ── Timestamps ───────────────────────────────────────────────
  @Column({ nullable: true }) initiatedAt: Date;
  @Column({ nullable: true }) completedAt: Date;
  @Column({ length: 100, nullable: true }) initiatedBy: string;
  @Column({ length: 500, nullable: true }) notes: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
