import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('incentive_programs')
export class IncentiveProgram {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() type: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 2 }) rewardAmount: number;
  @ApiProperty() @Column({ default: 'AED' }) currency: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) criteria: any;
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @Column({ default: 0 }) participantCount: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
