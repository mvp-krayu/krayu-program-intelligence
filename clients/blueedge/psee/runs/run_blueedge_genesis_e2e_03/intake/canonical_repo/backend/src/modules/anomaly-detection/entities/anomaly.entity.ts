import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('anomalies')
export class Anomaly {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column() anomalyType: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) confidenceScore: number;
  @ApiProperty() @Column() severity: string;
  @ApiProperty() @Column({ type: 'text', nullable: true }) description: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) dataPoints: any;
  @ApiProperty() @Column({ default: 'open' }) status: string;
  @ApiProperty() @Column({ nullable: true }) investigatedBy: string;
  @ApiProperty() @CreateDateColumn() detectedAt: Date;
}
