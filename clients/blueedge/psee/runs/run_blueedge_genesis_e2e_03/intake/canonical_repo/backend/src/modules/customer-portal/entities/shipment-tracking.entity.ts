import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('shipment_trackings')
export class ShipmentTracking {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() customerId: string;
  @ApiProperty() @Column() shipmentNumber: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column() origin: string;
  @ApiProperty() @Column() destination: string;
  @ApiProperty() @Column({ default: 'in_transit' }) status: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 }) progressPercent: number;
  @ApiProperty() @Column({ type: 'timestamp', nullable: true }) estimatedArrival: Date;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) slaMetrics: any;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
