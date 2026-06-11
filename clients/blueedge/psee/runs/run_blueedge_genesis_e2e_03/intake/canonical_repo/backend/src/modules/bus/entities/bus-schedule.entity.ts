import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('bus_schedules')
@Index(['routeId', 'dayType'])
export class BusSchedule {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() routeId: string;
  @Column({ length: 20 }) routeNumber: string;
  @Column({ type: 'enum', enum: ['weekday', 'friday', 'saturday', 'holiday'], default: 'weekday' }) dayType: string;
  @Column({ length: 10 }) firstDeparture: string;
  @Column({ length: 10 }) lastDeparture: string;
  @Column({ type: 'int' }) headwayPeakMin: number;
  @Column({ type: 'int' }) headwayOffPeakMin: number;
  @Column({ type: 'int', nullable: true }) tripsPerDay: number;
  @Column({ type: 'jsonb', nullable: true }) timetable: Array<{ departure: string; arrival: string; tripId?: string; }>;
  @Column({ length: 50, nullable: true }) gtfsServiceId: string;
  @Column({ type: 'enum', enum: ['published', 'draft', 'archived'], default: 'draft' }) status: string;
  @Column({ nullable: true }) effectiveFrom: Date;
  @Column({ nullable: true }) effectiveTo: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
