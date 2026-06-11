import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('taxi_payments')
@Index(['driverId', 'settledAt'])
@Index(['tripId'])
export class TaxiPayment {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() tripId: string;
  @Column() driverId: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) totalFare: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) tipAmount: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) driverShare: number;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) companyShare: number;
  @Column({ type: 'float', default: 80 }) driverSplitPct: number;
  @Column({ type: 'enum', enum: ['cash', 'card', 'wallet', 'corporate', 'nol'], default: 'card' }) method: string;
  @Column({ type: 'enum', enum: ['pending', 'settled', 'disputed', 'refunded'], default: 'pending' }) status: string;
  @Column({ nullable: true }) settledAt: Date;
  @Column({ length: 10, default: 'AED' }) currency: string;
  @CreateDateColumn() createdAt: Date;
}
