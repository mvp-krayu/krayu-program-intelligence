import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('taxi_zones')
@Index(['status'])
export class TaxiZone {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 100 }) name: string;
  @Column({ length: 100, nullable: true }) nameAr: string;
  @Column({ type: 'float' }) centerLat: number;
  @Column({ type: 'float' }) centerLng: number;
  @Column({ type: 'float', default: 1000 }) radiusM: number;
  @Column({ type: 'enum', enum: ['standard', 'airport', 'hotel', 'mall', 'business', 'residential', 'event'], default: 'standard' }) zoneType: string;
  @Column({ type: 'float', default: 1.0 }) surgeMultiplier: number;
  @Column({ type: 'int', default: 0 }) currentDemand: number;
  @Column({ type: 'int', default: 0 }) availableTaxis: number;
  @Column({ type: 'enum', enum: ['active', 'inactive', 'surge'], default: 'active' }) status: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) baseFare: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) perKmRate: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) perMinRate: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
