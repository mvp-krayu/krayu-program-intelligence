import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('notifications')
@Index(['userId', 'read', 'createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() userId: string;
  @Column({ length: 100 }) type: string;
  @Column({ type: 'enum', enum: ['info', 'warning', 'error', 'success'], default: 'info' }) severity: string;
  @Column({ length: 200 }) title: string;
  @Column({ length: 500 }) message: string;
  @Column({ type: 'jsonb', nullable: true }) data: Record<string, any>;
  @Column({ default: false }) read: boolean;
  @Column({ nullable: true }) readAt: Date;
  @Column({ default: false }) dismissed: boolean;
  @Column({ type: 'enum', enum: ['in_app', 'email', 'sms', 'push', 'webhook'], default: 'in_app' }) channel: string;
  @CreateDateColumn() createdAt: Date;
}
