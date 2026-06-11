import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, Index } from 'typeorm';

@Entity('vehicles')
@Index(['vin'], { unique: true })
@Index(['fleetId', 'status'])
@Index(['fleetType'])
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 17, unique: true })
  vin: string;

  @Column({ length: 15 })
  licensePlate: string;

  @Column()
  fleetId: string;

  @Column({ type: 'enum', enum: ['tanker', 'bus', 'taxi'], default: 'tanker' })
  fleetType: string;

  @Column({ length: 50 })
  make: string;

  @Column({ length: 50 })
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ length: 30, nullable: true })
  color: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'maintenance', 'decommissioned'], default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true, comment: 'Engine specs, dimensions, weight, tank config' })
  specifications: {
    engineType?: string;
    fuelType?: string;
    horsepower?: number;
    gvw?: number;
    axles?: number;
    lengthM?: number;
    widthM?: number;
    heightM?: number;
  };

  @Column({ type: 'jsonb', nullable: true, comment: 'Tank unit config for tankers' })
  tankUnit: {
    compartments?: number;
    totalCapacityL?: number;
    material?: string;
    insulationType?: string;
    baffled?: boolean;
    certificationDate?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  certifications: Array<{
    type: string;
    number: string;
    issuedDate: string;
    expiryDate: string;
    authority: string;
  }>;

  @Column({ type: 'jsonb', nullable: true, comment: 'GeoJSON point {type, coordinates}' })
  lastKnownPosition: { type: string; coordinates: number[] } | null;

  @Column({ type: 'float', nullable: true })
  lastLatitude: number;

  @Column({ type: 'float', nullable: true })
  lastLongitude: number;

  @Column({ type: 'float', nullable: true })
  lastSpeed: number;

  @Column({ type: 'float', nullable: true })
  lastHeading: number;

  @Column({ nullable: true })
  lastPositionAt: Date;

  @Column({ type: 'float', nullable: true })
  odometerKm: number;

  @Column({ type: 'float', nullable: true })
  engineHours: number;

  @Column({ type: 'float', nullable: true })
  fuelLevelPercent: number;

  @Column({ nullable: true })
  currentDriverId: string;

  @Column({ nullable: true })
  currentTripId: string;

  @Column({ nullable: true, length: 50 })
  deviceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
