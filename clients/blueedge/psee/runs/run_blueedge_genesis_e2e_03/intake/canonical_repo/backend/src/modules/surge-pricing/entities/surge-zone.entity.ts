import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('surge_zones')
export class SurgeZone {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 6 }) centerLat: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 6 }) centerLng: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 }) multiplier: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2 }) radiusKm: number;
  @ApiProperty() @Column({ default: 0 }) demandLevel: number;
  @ApiProperty() @Column({ default: 0 }) availableDrivers: number;
  @ApiProperty() @Column({ default: 'normal' }) status: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) pricingTiers: any;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
