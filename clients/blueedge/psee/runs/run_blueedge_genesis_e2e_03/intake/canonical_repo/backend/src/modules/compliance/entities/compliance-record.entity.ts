import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('compliance_records')
@Index(['vehicleId', 'type'])
@Index(['status', 'dueDate'])
@Index(['orgId', 'type'])
export class ComplianceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orgId: string;

  @Column({ nullable: true })
  vehicleId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ type: 'enum', enum: ['hos', 'dvir', 'inspection', 'certification', 'permit', 'emission', 'hazmat', 'insurance', 'registration'], default: 'inspection' })
  type: string;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ['compliant', 'non_compliant', 'pending', 'expired', 'waiver'], default: 'pending' })
  status: string;

  @Column({ type: 'enum', enum: ['fmcsa', 'dot', 'phmsa', 'epa', 'rta_dubai', 'adnoc', 'local'], default: 'local' })
  regulatoryBody: string;

  @Column({ type: 'date', nullable: true })
  effectiveDate: string;

  @Column({ type: 'date', nullable: true })
  dueDate: string;

  @Column({ type: 'date', nullable: true })
  completedDate: string;

  @Column({ type: 'jsonb', nullable: true })
  details: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  violations: Array<{
    code: string;
    description: string;
    severity: string;
    fineAmount?: number;
    resolvedDate?: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  documents: Array<{
    name: string;
    url: string;
    uploadedAt: string;
  }>;

  @Column({ nullable: true })
  inspectorId: string;

  @Column({ nullable: true, length: 200 })
  inspectorName: string;

  @Column({ type: 'float', nullable: true })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
