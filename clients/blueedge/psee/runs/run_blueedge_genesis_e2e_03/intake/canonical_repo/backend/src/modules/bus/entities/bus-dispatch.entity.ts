import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('bus_dispatches')
@Index(['date', 'shift'])
@Index(['driverId'])
export class BusDispatch {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() driverId: string;
  @Column({ length: 100 }) driverName: string;
  @Column() vehicleId: string;
  @Column({ length: 20 }) vehicleNumber: string;
  @Column() routeId: string;
  @Column({ length: 20 }) routeNumber: string;
  @Column({ type: 'date' }) date: string;
  @Column({ type: 'enum', enum: ['morning', 'afternoon', 'evening', 'night', 'split'], default: 'morning' }) shift: string;
  @Column({ length: 10 }) startTime: string;
  @Column({ length: 10 }) endTime: string;
  @Column({ type: 'enum', enum: ['scheduled', 'active', 'completed', 'cancelled', 'no_show'], default: 'scheduled' }) status: string;
  @Column({ type: 'int', default: 0 }) tripsCompleted: number;
  @Column({ type: 'int', default: 0 }) totalPassengers: number;
  @Column({ type: 'text', nullable: true }) notes: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
