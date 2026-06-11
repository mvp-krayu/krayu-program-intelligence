import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('border_regulations')
export class BorderRegulation {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() country: string;
  @ApiProperty() @Column() regulationType: string;
  @ApiProperty() @Column({ type: 'text' }) description: string;
  @ApiProperty() @Column() authority: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) requirements: any;
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
