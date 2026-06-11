import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('taxi_trips')
@Index(['vehicleId', 'requestedAt'])
@Index(['driverId', 'status'])
export class TaxiTrip {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() vehicleId: string;
  @Column() driverId: string;
  @Column({ nullable: true }) tripId: string;
  @Column({ type: 'enum', enum: ['requested', 'accepted', 'en_route', 'in_progress', 'completed', 'cancelled', 'no_show'], default: 'requested' }) status: string;
  @Column({ type: 'enum', enum: ['street_hail', 'app_dispatch', 'phone', 'corporate', 'airport'], default: 'app_dispatch' }) bookingType: string;
  @Column({ type: 'float', nullable: true }) pickupLat: number;
  @Column({ type: 'float', nullable: true }) pickupLng: number;
  @Column({ length: 255, nullable: true }) pickupAddress: string;
  @Column({ type: 'float', nullable: true }) dropoffLat: number;
  @Column({ type: 'float', nullable: true }) dropoffLng: number;
  @Column({ length: 255, nullable: true }) dropoffAddress: string;
  @Column({ type: 'float', nullable: true }) distanceKm: number;
  @Column({ type: 'int', nullable: true }) durationMinutes: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) baseFare: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) surgeMultiplier: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) totalFare: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) tipAmount: number;
  @Column({ type: 'enum', enum: ['cash', 'card', 'wallet', 'corporate'], default: 'card' }) paymentMethod: string;
  @Column({ type: 'float', nullable: true }) rating: number;
  @Column({ length: 200, nullable: true }) passengerName: string;
  @Column({ length: 20, nullable: true }) passengerPhone: string;
  @Column({ type: 'int', default: 1 }) passengerCount: number;
  @Column({ nullable: true }) requestedAt: Date;
  @Column({ nullable: true }) acceptedAt: Date;
  @Column({ nullable: true }) pickedUpAt: Date;
  @Column({ nullable: true }) completedAt: Date;
  @CreateDateColumn() createdAt: Date;
}
