import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('aftersales_work_orders')
export class AftersalesWorkOrder {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column() orderType: string;
  @ApiProperty() @Column({ nullable: true }) dtcCode: string;
  @ApiProperty() @Column({ nullable: true }) component: string;
  @ApiProperty() @Column({ nullable: true }) workshopId: string;
  @ApiProperty() @Column({ nullable: true }) technicianId: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) partsRequired: any;
  @ApiProperty() @Column({ default: 'open' }) status: string;
  @ApiProperty() @Column({ default: 'medium' }) priority: string;
  @ApiProperty() @Column({ type: 'float', nullable: true }) estimatedCostAed: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
