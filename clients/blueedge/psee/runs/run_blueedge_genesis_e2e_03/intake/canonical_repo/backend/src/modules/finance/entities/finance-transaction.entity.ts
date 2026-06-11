import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('finance_transactions')
@Index(['orgId', 'transactionDate'])
@Index(['vehicleId', 'category'])
@Index(['category', 'transactionDate'])
export class FinanceTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orgId: string;

  @Column({ nullable: true })
  fleetId: string;

  @Column({ nullable: true })
  vehicleId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ type: 'enum', enum: ['fuel', 'maintenance', 'toll', 'insurance', 'fine', 'lease', 'depreciation', 'tire', 'permit', 'salary', 'revenue', 'other'], default: 'other' })
  category: string;

  @Column({ type: 'enum', enum: ['expense', 'revenue', 'refund', 'adjustment'], default: 'expense' })
  transactionType: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'AED' })
  currency: string;

  @Column({ type: 'date' })
  transactionDate: string;

  @Column({ length: 300, nullable: true })
  description: string;

  @Column({ length: 100, nullable: true })
  vendor: string;

  @Column({ length: 50, nullable: true })
  invoiceNumber: string;

  @Column({ length: 50, nullable: true })
  receiptNumber: string;

  @Column({ type: 'enum', enum: ['pending', 'approved', 'paid', 'rejected', 'cancelled'], default: 'pending' })
  status: string;

  @Column({ nullable: true })
  approvedBy: string;

  @Column({ type: 'jsonb', nullable: true })
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;

  @Column({ nullable: true })
  relatedWorkOrderId: string;

  @Column({ nullable: true })
  relatedTripId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
