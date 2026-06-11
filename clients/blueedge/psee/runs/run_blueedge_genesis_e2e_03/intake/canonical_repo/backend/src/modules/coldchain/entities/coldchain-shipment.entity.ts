import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('coldchain_shipments')
@Index(['vehicleId', 'status'])
@Index(['tripId'])
@Index(['temperatureStatus'])
export class ColdChainShipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vehicleId: string;

  @Column({ nullable: true })
  tripId: string;

  @Column({ nullable: true })
  driverId: string;

  @Column({ type: 'enum', enum: ['active', 'completed', 'breached', 'cancelled'], default: 'active' })
  status: string;

  @Column({ type: 'jsonb' })
  temperatureRange: {
    minC: number;
    maxC: number;
    targetC: number;
    toleranceC: number;
  };

  @Column({ type: 'enum', enum: ['normal', 'warning', 'breach', 'critical'], default: 'normal' })
  temperatureStatus: string;

  @Column({ type: 'float', nullable: true })
  currentTemperatureC: number;

  @Column({ type: 'jsonb', nullable: true })
  zones: Array<{
    zoneId: string;
    name: string;
    currentTempC: number;
    targetTempC: number;
    status: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  cargo: {
    productName: string;
    productType: string;
    quantity: number;
    unit: string;
    batchNumber?: string;
    expiryDate?: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  breachLog: Array<{
    timestamp: string;
    zoneId: string;
    temperatureC: number;
    durationMinutes: number;
    severity: string;
    resolved: boolean;
  }>;

  @Column({ type: 'timestamp', nullable: true })
  loadedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
