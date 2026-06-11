import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('agent_tasks')
export class AgentTask {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() agentType: string;
  @ApiProperty() @Column() taskType: string;
  @ApiProperty() @Column({ nullable: true }) targetEntity: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) parameters: any;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) result: any;
  @ApiProperty() @Column({ default: 'queued' }) status: string;
  @ApiProperty() @Column({ type: 'float', nullable: true }) confidenceScore: number;
  @ApiProperty() @Column({ nullable: true }) processingTimeMs: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
