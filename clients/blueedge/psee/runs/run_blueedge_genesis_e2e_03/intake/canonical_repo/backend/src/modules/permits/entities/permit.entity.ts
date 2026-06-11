import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('permits')
export class Permit {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() vehicleId: string;
  @ApiProperty() @Column() permitType: string;
  @ApiProperty() @Column() permitNumber: string;
  @ApiProperty() @Column() issuingAuthority: string;
  @ApiProperty() @Column({ type: 'date' }) issueDate: Date;
  @ApiProperty() @Column({ type: 'date' }) expiryDate: Date;
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) documents: any;
  @ApiProperty() @Column({ default: false }) renewalRequested: boolean;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
