import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('trips')
@Index(['vehicleId', 'startTime'])
@Index(['driverId', 'startTime'])
@Index(['fleetId', 'status'])
export class Trip {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() vehicleId: string;
  @Column() fleetId: string;
  @Column({ nullable: true }) driverId: string;
  @Column({ nullable: true }) coDriverId: string;

  @Column({ type: 'enum', enum: ['planned', 'in_progress', 'completed', 'cancelled'], default: 'planned' })
  status: string;

  @Column({ type: 'enum', enum: ['tanker_delivery', 'bus_route', 'taxi_ride', 'deadhead', 'maintenance'], default: 'tanker_delivery' })
  tripType: string;

  @Column({ nullable: true }) startTime: Date;
  @Column({ nullable: true }) endTime: Date;

  @Column({ type: 'float', nullable: true }) startLat: number;
  @Column({ type: 'float', nullable: true }) startLng: number;
  @Column({ type: 'float', nullable: true }) endLat: number;
  @Column({ type: 'float', nullable: true }) endLng: number;
  @Column({ length: 255, nullable: true }) startAddress: string;
  @Column({ length: 255, nullable: true }) endAddress: string;

  @Column({ type: 'float', nullable: true }) distanceKm: number;
  @Column({ type: 'float', nullable: true }) durationMinutes: number;
  @Column({ type: 'float', nullable: true }) fuelUsedL: number;
  @Column({ type: 'float', nullable: true }) avgSpeedKmh: number;
  @Column({ type: 'float', nullable: true }) maxSpeedKmh: number;

  @Column({ type: 'jsonb', nullable: true }) cargoManifest: any[];
  @Column({ type: 'jsonb', nullable: true }) route: Record<string, any>;
  @Column({ type: 'jsonb', nullable: true }) events: any[];

  @Column({ type: 'int', default: 0 }) harshBrakingCount: number;
  @Column({ type: 'int', default: 0 }) harshAccelCount: number;
  @Column({ type: 'int', default: 0 }) speedingCount: number;
  @Column({ type: 'float', default: 100 }) tripScore: number;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
