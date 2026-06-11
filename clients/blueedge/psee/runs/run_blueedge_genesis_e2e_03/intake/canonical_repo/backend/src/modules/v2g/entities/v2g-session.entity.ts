import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('v2g_sessions')
@Index(['vehicleId', 'status'])
@Index(['stationId', 'status'])
@Index(['sessionType', 'startTime'])
export class V2gSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column()
  stationId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ type: 'enum', enum: ['v2g_discharge', 'g2v_charge', 'v2h_home', 'v2b_building', 'bidirectional'], default: 'g2v_charge' })
  sessionType: string;

  @Column({ type: 'enum', enum: ['active', 'completed', 'paused', 'failed', 'scheduled', 'cancelled'], default: 'active' })
  status: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'float', default: 0, comment: 'Energy transferred in kWh' })
  energyKwh: number;

  @Column({ type: 'float', nullable: true })
  peakPowerKw: number;

  @Column({ type: 'float', nullable: true })
  averagePowerKw: number;

  @Column({ type: 'float', nullable: true })
  socStartPercent: number;

  @Column({ type: 'float', nullable: true })
  socEndPercent: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  revenueEarned: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  costIncurred: number;

  @Column({ type: 'float', nullable: true })
  gridPricePerKwh: number;

  @Column({ type: 'jsonb', nullable: true })
  gridSignals: {
    frequencyHz: number;
    voltageV: number;
    demandResponse: boolean;
    peakShaving: boolean;
  };

  @Column({ type: 'jsonb', nullable: true })
  batteryImpact: {
    cycleEquivalent: number;
    degradationEstimate: number;
    thermalStress: string;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
