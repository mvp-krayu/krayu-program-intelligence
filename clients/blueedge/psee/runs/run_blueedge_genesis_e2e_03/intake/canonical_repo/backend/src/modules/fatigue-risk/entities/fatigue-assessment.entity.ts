import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('fatigue_assessments')
export class FatigueAssessment {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() driverId: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) riskScore: number;
  @ApiProperty() @Column() riskLevel: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) perclosScore: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) reactionTimeMs: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) hoursOnDuty: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) hoursSinceRest: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) biomarkers: any;
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @CreateDateColumn() assessedAt: Date;
}
