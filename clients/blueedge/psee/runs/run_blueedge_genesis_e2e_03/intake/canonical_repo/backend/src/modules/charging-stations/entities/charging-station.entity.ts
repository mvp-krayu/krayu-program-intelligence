import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('charging_stations')
export class ChargingStation {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() operator: string;
  @ApiProperty() @Column() address: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 6 }) latitude: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 6 }) longitude: number;
  @ApiProperty() @Column({ default: 0 }) totalConnectors: number;
  @ApiProperty() @Column({ default: 0 }) availableConnectors: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 }) maxPowerKw: number;
  @ApiProperty() @Column({ default: 'operational' }) status: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) connectorTypes: any;
  @ApiProperty() @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true }) pricePerKwh: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
