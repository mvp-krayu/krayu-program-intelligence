import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('electrification_plans')
export class ElectrificationPlan {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() fleetId: string;
  @ApiProperty() @Column() planName: string;
  @ApiProperty() @Column({ default: 'draft' }) status: string;
  @ApiProperty() @Column({ default: 0 }) totalVehicles: number;
  @ApiProperty() @Column({ default: 0 }) evTarget: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) estimatedCostAed: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) estimatedSavingsAed: number;
  @ApiProperty() @Column({ type: 'int', default: 36 }) paybackMonths: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) timeline: any;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
