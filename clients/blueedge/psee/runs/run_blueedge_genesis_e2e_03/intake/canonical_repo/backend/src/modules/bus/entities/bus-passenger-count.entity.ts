import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('bus_passenger_counts')
@Index(['vehicleId', 'timestamp'])
@Index(['routeId', 'stopId'])
export class BusPassengerCount {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() vehicleId: string;
  @Column() routeId: string;
  @Column({ nullable: true }) stopId: string;
  @Column({ nullable: true }) tripId: string;
  @Column({ type: 'int', default: 0 }) boardings: number;
  @Column({ type: 'int', default: 0 }) alightings: number;
  @Column({ type: 'int', default: 0 }) onboard: number;
  @Column({ type: 'int', nullable: true }) capacity: number;
  @Column({ type: 'float', nullable: true }) loadFactorPct: number;
  @Column({ type: 'enum', enum: ['apc_sensor', 'manual', 'estimated'], default: 'apc_sensor' }) source: string;
  @Column() timestamp: Date;
  @CreateDateColumn() createdAt: Date;
}
