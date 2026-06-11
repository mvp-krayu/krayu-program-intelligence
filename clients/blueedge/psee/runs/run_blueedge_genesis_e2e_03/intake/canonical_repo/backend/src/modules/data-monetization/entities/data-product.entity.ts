import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('data_products')
export class DataProduct {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() productName: string;
  @ApiProperty() @Column() stream: string;
  @ApiProperty() @Column() dataType: string;
  @ApiProperty() @Column({ nullable: true }) pricingModel: string;
  @ApiProperty() @Column({ type: 'float', nullable: true }) priceAed: number;
  @ApiProperty() @Column({ nullable: true }) period: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) subscriberList: any;
  @ApiProperty() @Column({ default: 0 }) subscriberCount: number;
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @Column({ type: 'float', default: 0 }) revenueAed: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
