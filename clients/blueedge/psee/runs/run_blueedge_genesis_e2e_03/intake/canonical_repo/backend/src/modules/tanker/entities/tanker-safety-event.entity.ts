import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('tanker_safety_events')
@Index(['vehicleId', 'severity', 'createdAt'])
@Index(['eventType'])
export class TankerSafetyEvent {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() vehicleId: string;
  @Column({ length: 30 }) eventType: string;
  @Column({ type: 'enum', enum: ['critical', 'high', 'medium', 'low'], default: 'medium' }) severity: string;
  @Column({ type: 'text' }) description: string;
  @Column({ type: 'jsonb', nullable: true }) sensorData: any;
  @Column({ default: false }) isResolved: boolean;
  @Column({ nullable: true }) resolvedAt: Date;
  @Column({ nullable: true }) resolvedBy: string;
  @CreateDateColumn() createdAt: Date;
}
