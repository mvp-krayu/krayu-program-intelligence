import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('parts_listings')
export class PartsListing {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() partNumber: string;
  @ApiProperty() @Column() partName: string;
  @ApiProperty() @Column() category: string;
  @ApiProperty() @Column() vendorName: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 2 }) priceAed: number;
  @ApiProperty() @Column({ default: 0 }) stockQuantity: number;
  @ApiProperty() @Column({ nullable: true }) leadTimeDays: number;
  @ApiProperty() @Column({ default: 'available' }) status: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) specifications: any;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
