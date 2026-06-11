import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('custody_transfers')
@Index(['manifestId'])
@Index(['vehicleId', 'timestamp'])
export class CustodyTransfer {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() manifestId: string;
  @Column() vehicleId: string;
  @Column({ nullable: true }) tripId: string;
  @Column({ type: 'enum', enum: ['loading', 'unloading', 'transfer'], default: 'loading' }) transferType: string;
  @Column({ type: 'enum', enum: ['pending', 'in_progress', 'completed', 'disputed'], default: 'pending' }) status: string;
  @Column({ length: 200, nullable: true }) facilityName: string;
  @Column({ type: 'float', nullable: true }) latitude: number;
  @Column({ type: 'float', nullable: true }) longitude: number;
  @Column({ type: 'jsonb', nullable: true }) compartmentReadings: any[];
  @Column({ type: 'float', nullable: true }) totalVolumeL: number;
  @Column({ type: 'float', nullable: true }) discrepancyL: number;
  @Column({ type: 'float', nullable: true }) temperatureC: number;
  @Column({ type: 'jsonb', nullable: true }) safetyChecklist: Record<string, boolean>;
  @Column({ nullable: true }) operatorName: string;
  @Column({ nullable: true }) witnessName: string;
  @Column({ nullable: true }) signatureUrl: string;
  @Column() timestamp: Date;
  @CreateDateColumn() createdAt: Date;
}
