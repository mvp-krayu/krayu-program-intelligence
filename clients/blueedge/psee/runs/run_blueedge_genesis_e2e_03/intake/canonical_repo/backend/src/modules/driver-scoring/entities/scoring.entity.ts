import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('driver_scores')
export class DriverScore {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() driverId: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) overallScore: number; // 0-100
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) safetyScore: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) efficiencyScore: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) complianceScore: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) customerScore: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) eventBreakdown: any;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) trendData: any;
  @ApiProperty() @Column() scorePeriod: string; // daily, weekly, monthly
  @ApiProperty() @Column({ type: 'timestamp' }) periodStart: Date;
  @ApiProperty() @Column({ type: 'timestamp' }) periodEnd: Date;
  @ApiProperty() @Column({ type: 'int', default: 0 }) rank: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) totalDrivers: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}

@Entity('driving_events')
export class DrivingEvent {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() driverId: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column() tripId: string;
  @ApiProperty() @Column() eventType: string; // harsh_brake, rapid_accel, speeding, sharp_turn, tailgating, phone_use, lane_departure, fatigue_detected
  @ApiProperty() @Column() severity: string; // minor, moderate, severe, critical
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) scoreImpact: number; // negative points
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 7 }) latitude: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 7 }) longitude: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) speed: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) gForce: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) metadata: any;
  @ApiProperty() @CreateDateColumn() occurredAt: Date;
}

@Entity('coaching_recommendations')
export class CoachingRecommendation {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() driverId: string;
  @ApiProperty() @Column() category: string; // safety, efficiency, compliance
  @ApiProperty() @Column({ type: 'text' }) recommendation: string;
  @ApiProperty() @Column({ type: 'text', nullable: true }) evidence: string;
  @ApiProperty() @Column() priority: string;
  @ApiProperty() @Column({ default: 'pending' }) status: string; // pending, delivered, acknowledged, completed
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
