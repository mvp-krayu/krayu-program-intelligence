import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('lifecycle_plans')
export class LifecyclePlan {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column() phase: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) acquisitionCostAed: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) currentValueAed: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) totalMaintenanceCostAed: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) ageMonths: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) odometerKm: number;
  @ApiProperty() @Column({ type: 'date', nullable: true }) plannedRetirementDate: Date;
  @ApiProperty() @Column({ nullable: true }) replacementVehicleType: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
