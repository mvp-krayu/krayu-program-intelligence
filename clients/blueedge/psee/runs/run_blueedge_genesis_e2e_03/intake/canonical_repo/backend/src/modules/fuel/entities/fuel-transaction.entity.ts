import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('fuel_transactions')
@Index(['vehicleId', 'timestamp'])
export class FuelTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column() vehicleId: string;
  @Column({ nullable: true }) driverId: string;
  @Column({ nullable: true }) tripId: string;

  @Column({ type: 'enum', enum: ['fill', 'partial', 'theft_suspected', 'adjustment'], default: 'fill' })
  type: string;

  @Column({ type: 'float' }) quantityL: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) costAmount: number;
  @Column({ length: 10, default: 'AED' }) currency: string;
  @Column({ type: 'float', nullable: true }) pricePerLiter: number;
  @Column({ type: 'float', nullable: true }) odometerKm: number;
  @Column({ length: 200, nullable: true }) stationName: string;
  @Column({ type: 'float', nullable: true }) latitude: number;
  @Column({ type: 'float', nullable: true }) longitude: number;
  @Column({ length: 50, nullable: true }) fuelCardNumber: string;
  @Column({ length: 30, nullable: true }) fuelType: string;

  @Column() timestamp: Date;
  @CreateDateColumn() createdAt: Date;
}
