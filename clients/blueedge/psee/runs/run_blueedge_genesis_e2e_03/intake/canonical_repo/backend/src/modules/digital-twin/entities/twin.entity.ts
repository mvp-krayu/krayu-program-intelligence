import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('digital_twins')
export class DigitalTwin {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column() twinType: string; // tanker, bus, taxi, ev
  @ApiProperty() @Column({ type: 'jsonb' }) liveState: any; // real-time vehicle state
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) meshConfig: any; // 3D model config
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) sensorMappings: any;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) simulationParams: any;
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 }) syncFidelity: number;
  @ApiProperty() @Column({ type: 'timestamp', nullable: true }) lastSyncAt: Date;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}

@Entity('twin_simulations')
export class TwinSimulation {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() twinId: string;
  @ApiProperty() @Column() scenarioType: string; // failure, load_test, route_optimization, weather_impact
  @ApiProperty() @Column({ type: 'jsonb' }) inputParams: any;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) results: any;
  @ApiProperty() @Column({ default: 'pending' }) status: string; // pending, running, completed, failed
  @ApiProperty() @Column({ type: 'int', nullable: true }) durationMs: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}

@Entity('twin_snapshots')
export class TwinSnapshot {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() twinId: string;
  @ApiProperty() @Column({ type: 'jsonb' }) stateCapture: any;
  @ApiProperty() @Column({ nullable: true }) label: string;
  @ApiProperty() @CreateDateColumn() capturedAt: Date;
}
