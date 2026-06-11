import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('ev_vehicles')
@Index(['vehicleId'], { unique: true })
@Index(['chargingStatus'])
@Index(['batteryHealthPercent'])
export class ElectricVehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  vehicleId: string;

  @Column({ type: 'float' })
  batteryCapacityKwh: number;

  @Column({ type: 'float', default: 0 })
  stateOfChargePercent: number;

  @Column({ type: 'float', default: 100 })
  batteryHealthPercent: number;

  @Column({ type: 'float', nullable: true })
  estimatedRangeKm: number;

  @Column({ type: 'float', nullable: true })
  energyConsumptionKwhPer100km: number;

  @Column({ type: 'enum', enum: ['not_charging', 'charging_ac', 'charging_dc', 'scheduled', 'error'], default: 'not_charging' })
  chargingStatus: string;

  @Column({ type: 'float', nullable: true })
  chargingPowerKw: number;

  @Column({ type: 'int', nullable: true, comment: 'Minutes to 80%' })
  estimatedChargeTimeMin: number;

  @Column({ nullable: true })
  currentChargingStationId: string;

  @Column({ type: 'jsonb', nullable: true })
  batteryThermal: {
    temperatureC: number;
    coolingActive: boolean;
    heatingActive: boolean;
    status: string;
  };

  @Column({ type: 'jsonb', nullable: true })
  chargingHistory: Array<{
    stationId: string;
    startTime: string;
    endTime: string;
    energyKwh: number;
    cost: number;
    type: string;
  }>;

  @Column({ type: 'int', default: 0 })
  totalChargeCycles: number;

  @Column({ type: 'float', default: 0 })
  lifetimeEnergyKwh: number;

  @Column({ type: 'jsonb', nullable: true })
  regenerativeBraking: {
    enabled: boolean;
    level: number;
    energyRecoveredKwh: number;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
