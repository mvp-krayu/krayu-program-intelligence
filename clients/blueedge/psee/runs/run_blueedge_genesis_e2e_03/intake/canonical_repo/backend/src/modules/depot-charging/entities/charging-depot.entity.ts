import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('charging_depots')
export class ChargingDepot {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() location: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 6 }) latitude: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 6 }) longitude: number;
  @ApiProperty() @Column({ default: 0 }) totalChargers: number;
  @ApiProperty() @Column({ default: 0 }) availableChargers: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 }) totalCapacityKw: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 8, scale: 2, default: 0 }) currentLoadKw: number;
  @ApiProperty() @Column({ default: 'operational' }) status: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
