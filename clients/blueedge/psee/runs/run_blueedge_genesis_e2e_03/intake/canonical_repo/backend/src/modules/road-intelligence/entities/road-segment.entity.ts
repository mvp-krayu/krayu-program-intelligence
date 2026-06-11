import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('road_segments')
export class RoadSegment {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() segmentCode: string;
  @ApiProperty() @Column() roadName: string;
  @ApiProperty() @Column({ nullable: true }) district: string;
  @ApiProperty() @Column({ nullable: true }) city: string;
  @ApiProperty() @Column({ type: 'float' }) latitude: number;
  @ApiProperty() @Column({ type: 'float' }) longitude: number;
  @ApiProperty() @Column({ type: 'float', nullable: true }) roughnessIndex: number;
  @ApiProperty() @Column({ type: 'float', nullable: true }) qualityScore: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) hazards: any;
  @ApiProperty() @Column({ default: 'good' }) condition: string;
  @ApiProperty() @Column({ nullable: true }) lastSurveyVehicles: number;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
