import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('executive_reports')
export class ExecutiveReport {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() reportType: string;
  @ApiProperty() @Column() period: string;
  @ApiProperty() @Column({ type: 'jsonb' }) data: any;
  @ApiProperty() @Column({ default: 'generated' }) status: string;
  @ApiProperty() @Column({ nullable: true }) generatedBy: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
