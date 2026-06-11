import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('work_orders')
@Index(['vehicleId', 'status'])
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true }) orderNumber: string;
  @Column() vehicleId: string;
  @Column({ nullable: true }) assignedTo: string;

  @Column({ type: 'enum', enum: ['open', 'in_progress', 'pending_parts', 'completed', 'cancelled'], default: 'open' })
  status: string;

  @Column({ type: 'enum', enum: ['preventive', 'corrective', 'emergency', 'predictive', 'inspection'], default: 'corrective' })
  type: string;

  @Column({ type: 'enum', enum: ['critical', 'high', 'medium', 'low'], default: 'medium' })
  priority: string;

  @Column({ length: 200 }) title: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ nullable: true }) scheduledDate: Date;
  @Column({ nullable: true }) completedDate: Date;
  @Column({ type: 'float', nullable: true }) estimatedHours: number;
  @Column({ type: 'float', nullable: true }) actualHours: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) laborCost: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) partsCost: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) totalCost: number;
  @Column({ type: 'jsonb', nullable: true }) parts: any[];
  @Column({ type: 'jsonb', nullable: true }) tasks: any[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
