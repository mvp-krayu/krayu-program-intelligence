import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('diagnostic_records')
@Index(['vehicleId', 'recordedAt'])
@Index(['dtcCode'])
@Index(['severity', 'status'])
export class DiagnosticRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column({ nullable: true })
  deviceId: string;

  @Column({ length: 10 })
  dtcCode: string;

  @Column({ length: 200 })
  description: string;

  @Column({ type: 'enum', enum: ['powertrain', 'chassis', 'body', 'network', 'manufacturer'], default: 'powertrain' })
  system: string;

  @Column({ type: 'enum', enum: ['critical', 'high', 'medium', 'low', 'info'], default: 'medium' })
  severity: string;

  @Column({ type: 'enum', enum: ['active', 'pending', 'confirmed', 'cleared', 'resolved'], default: 'active' })
  status: string;

  @Column({ type: 'enum', enum: ['j1939', 'obd2', 'uds', 'proprietary'], default: 'j1939' })
  protocol: string;

  @Column({ type: 'int', nullable: true })
  spn: number;

  @Column({ type: 'int', nullable: true })
  fmi: number;

  @Column({ type: 'int', default: 1 })
  occurrenceCount: number;

  @Column({ type: 'timestamp' })
  recordedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  clearedAt: Date;

  @Column({ type: 'jsonb', nullable: true, comment: 'Freeze frame at time of fault' })
  freezeFrame: {
    engineRpm?: number;
    vehicleSpeed?: number;
    coolantTempC?: number;
    oilPressureKpa?: number;
    fuelLevelPercent?: number;
    odometerKm?: number;
    engineHours?: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  aiAnalysis: {
    predictedComponent: string;
    failureProbability: number;
    estimatedRulDays: number;
    recommendedAction: string;
    relatedDtcs: string[];
  };

  @Column({ nullable: true })
  workOrderId: string;

  @CreateDateColumn()
  createdAt: Date;
}
