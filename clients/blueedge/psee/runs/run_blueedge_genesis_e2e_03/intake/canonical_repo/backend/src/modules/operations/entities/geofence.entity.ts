import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('geofences')
@Index(['orgId', 'status'])
export class Geofence {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() orgId: string;
  @Column({ length: 100 }) name: string;
  @Column({ type: 'enum', enum: ['circle', 'polygon', 'corridor'], default: 'circle' }) type: string;
  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' }) status: string;
  @Column({ type: 'enum', enum: ['depot', 'customer', 'restricted', 'fuel_station', 'loading', 'border', 'speed_zone'], default: 'depot' }) category: string;
  @Column({ type: 'jsonb' }) geometry: { center?: { lat: number; lng: number }; radiusM?: number; coordinates?: Array<{ lat: number; lng: number }>; };
  @Column({ type: 'jsonb', nullable: true }) rules: { onEntry?: string[]; onExit?: string[]; speedLimitKmh?: number; dwellTimeMinutes?: number; };
  @Column({ type: 'jsonb', nullable: true }) alerts: { notifyOnEntry?: boolean; notifyOnExit?: boolean; notifyOnDwell?: boolean; };
  @Column({ type: 'text', nullable: true }) description: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
