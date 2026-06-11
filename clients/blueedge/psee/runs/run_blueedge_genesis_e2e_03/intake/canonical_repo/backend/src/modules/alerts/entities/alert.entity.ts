import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('alerts')
@Index(['vehicleId', 'createdAt'])
@Index(['severity', 'status'])
@Index(['fleetId', 'status'])
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() vehicleId: string;
  @Column({ nullable: true }) driverId: string;
  @Column({ nullable: true }) fleetId: string;
  @Column({ nullable: true }) tripId: string;

  @Column({ type: 'enum', enum: ['critical', 'high', 'medium', 'low', 'info'], default: 'medium' })
  severity: string;

  @Column({ type: 'enum', enum: ['active', 'acknowledged', 'resolved', 'dismissed'], default: 'active' })
  status: string;

  @Column({ length: 100 })
  type: string;

  @Column({ length: 100 })
  category: string;

  @Column({ length: 500 })
  message: string;

  @Column({ type: 'jsonb', nullable: true }) details: Record<string, any>;
  @Column({ type: 'float', nullable: true }) latitude: number;
  @Column({ type: 'float', nullable: true }) longitude: number;

  @Column({ nullable: true }) acknowledgedBy: string;
  @Column({ nullable: true }) acknowledgedAt: Date;
  @Column({ nullable: true }) resolvedBy: string;
  @Column({ nullable: true }) resolvedAt: Date;
  @Column({ length: 500, nullable: true }) resolution: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
