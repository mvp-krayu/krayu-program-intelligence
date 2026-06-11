import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('taxi_drivers')
@Index(['status'])
@Index(['medallionId'])
export class TaxiDriver {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 100 }) name: string;
  @Column({ length: 100, nullable: true }) nameAr: string;
  @Column({ length: 20 }) licenseNumber: string;
  @Column({ length: 20, nullable: true }) medallionId: string;
  @Column({ length: 20, nullable: true }) vehicleNumber: string;
  @Column({ type: 'float', default: 5 }) rating: number;
  @Column({ type: 'int', default: 0 }) totalTrips: number;
  @Column({ type: 'int', default: 0 }) tripsToday: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) revenueToday: number;
  @Column({ type: 'float', default: 0 }) acceptanceRate: number;
  @Column({ type: 'float', default: 0 }) cancellationRate: number;
  @Column({ type: 'enum', enum: ['available', 'on_trip', 'on_break', 'off_duty', 'suspended'], default: 'off_duty' }) status: string;
  @Column({ type: 'enum', enum: ['morning', 'afternoon', 'evening', 'night', 'split'], default: 'morning' }) currentShift: string;
  @Column({ type: 'float', nullable: true }) lastLat: number;
  @Column({ type: 'float', nullable: true }) lastLng: number;
  @Column({ length: 20, nullable: true }) phone: string;
  @Column({ nullable: true }) shiftStartedAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
