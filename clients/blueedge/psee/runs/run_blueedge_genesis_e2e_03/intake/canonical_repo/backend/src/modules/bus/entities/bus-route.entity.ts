import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('bus_routes')
@Index(['fleetId', 'status'])
export class BusRoute {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() fleetId: string;
  @Column({ length: 20 }) routeNumber: string;
  @Column({ length: 200 }) routeName: string;
  @Column({ type: 'enum', enum: ['active', 'suspended', 'planned', 'discontinued'], default: 'active' }) status: string;
  @Column({ type: 'enum', enum: ['express', 'local', 'brt', 'feeder', 'shuttle'], default: 'local' }) routeType: string;
  @Column({ type: 'float', nullable: true }) distanceKm: number;
  @Column({ type: 'int', nullable: true }) estimatedMinutes: number;
  @Column({ type: 'int', default: 0 }) stopCount: number;
  @Column({ type: 'jsonb', nullable: true }) stops: Array<{ stopId: string; name: string; lat: number; lng: number; sequence: number; }>;
  @Column({ type: 'jsonb', nullable: true }) schedule: Record<string, any>;
  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true }) fareAmount: number;
  @Column({ length: 10, default: 'AED' }) currency: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
