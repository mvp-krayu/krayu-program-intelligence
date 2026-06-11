import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum OnboardingStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
}

@Entity('onboarding_sessions')
export class OnboardingSession {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() tenantId: string;
  @ApiProperty() @Column() userId: string;      // Who initiated onboarding
  @ApiProperty() @Column({ type: 'enum', enum: OnboardingStatus, default: OnboardingStatus.NOT_STARTED }) status: OnboardingStatus;
  @ApiProperty() @Column({ default: 0 }) currentStep: number; // 0-5
  @ApiProperty() @Column({ default: 6 }) totalSteps: number;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) stepData: Record<string, any>;    // Data collected per step
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) completedSteps: number[];
  @ApiProperty() @Column({ nullable: true }) completedAt: Date;
  @ApiProperty() @Column({ default: 0 }) progressPercent: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
