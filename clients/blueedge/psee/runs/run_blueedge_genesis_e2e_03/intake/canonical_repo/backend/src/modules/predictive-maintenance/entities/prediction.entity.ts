import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('maintenance_predictions')
export class MaintenancePrediction {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column() componentType: string; // engine, brakes, transmission, tires, battery, hvac, suspension
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) failureProbability: number;
  @ApiProperty() @Column() riskLevel: string; // critical, high, medium, low
  @ApiProperty() @Column() predictedFailureDate: Date;
  @ApiProperty() @Column({ type: 'int' }) remainingUsefulLifeHours: number;
  @ApiProperty() @Column({ type: 'int' }) remainingUsefulLifeKm: number;
  @ApiProperty() @Column({ type: 'text', nullable: true }) recommendation: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) estimatedRepairCostAed: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) confidenceScore: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) modelInputs: any; // telemetry features used
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) contributingFactors: any;
  @ApiProperty() @Column({ default: 'active' }) status: string; // active, acknowledged, scheduled, resolved, expired
  @ApiProperty() @Column({ nullable: true }) workOrderId: string;
  @ApiProperty() @Column({ default: 'gradient_boost_v3' }) modelVersion: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}

@Entity('ml_models')
export class MlModel {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() version: string;
  @ApiProperty() @Column() componentType: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) accuracy: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) precision: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) recall: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) f1Score: number;
  @ApiProperty() @Column({ type: 'int' }) trainingSamples: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) hyperparameters: any;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) featureImportance: any;
  @ApiProperty() @Column({ default: 'production' }) status: string;
  @ApiProperty() @Column({ type: 'timestamp' }) trainedAt: Date;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}

@Entity('telemetry_features')
export class TelemetryFeature {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2 }) engineTemp: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2 }) oilPressure: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2 }) brakePadThickness: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2 }) tireTreadDepth: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2 }) batteryVoltage: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2 }) vibrationLevel: number;
  @ApiProperty() @Column({ type: 'int' }) odometer: number;
  @ApiProperty() @Column({ type: 'int' }) engineHours: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true }) fuelEfficiency: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true }) coolantLevel: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true }) transmissionTemp: number;
  @ApiProperty() @Column({ type: 'timestamp' }) capturedAt: Date;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
