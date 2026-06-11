import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('geofence_rules')
export class GeofenceRule {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() geofenceId: string;
  @ApiProperty() @Column() triggerType: string; // enter, exit, dwell, speed, unauthorized_vehicle, after_hours, hazmat_zone
  @ApiProperty() @Column({ type: 'jsonb' }) conditions: any; // speed thresholds, dwell time, vehicle types, time windows
  @ApiProperty() @Column({ type: 'jsonb' }) actions: any; // alert, notification, speed_limit, dispatch, log, escalate
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) schedule: any; // active hours, days
  @ApiProperty() @Column({ type: 'simple-array', nullable: true }) vehicleTypes: string[]; // tanker, bus, taxi
  @ApiProperty() @Column({ type: 'simple-array', nullable: true }) notifyRoles: string[];
  @ApiProperty() @Column({ default: true }) enabled: boolean;
  @ApiProperty() @Column({ type: 'int', default: 0 }) triggerCount: number;
  @ApiProperty() @Column({ type: 'int', default: 300 }) cooldownSeconds: number; // min time between triggers
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}

@Entity('geofence_triggers')
export class GeofenceTrigger {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() ruleId: string;
  @ApiProperty() @Column() geofenceId: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column({ nullable: true }) driverId: string;
  @ApiProperty() @Column() triggerType: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) triggerData: any;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) actionsExecuted: any;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 7 }) latitude: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 7 }) longitude: number;
  @ApiProperty() @Column({ default: 'triggered' }) status: string; // triggered, acknowledged, resolved, false_alarm
  @ApiProperty() @CreateDateColumn() triggeredAt: Date;
}

@Entity('geofence_zones')
export class GeofenceZone {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() zoneType: string; // depot, customer, restricted, hazmat, school, speed_zone, border
  @ApiProperty() @Column({ type: 'jsonb' }) geometry: any; // GeoJSON polygon/circle
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) centerLat: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true }) centerLng: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) radiusMeters: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) metadata: any;
  @ApiProperty() @Column({ type: 'int', default: 0 }) activeRules: number;
  @ApiProperty() @Column({ default: true }) enabled: boolean;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
