import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('messages')
export class Message {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() channel: string; // whatsapp, sms, push, email
  @ApiProperty() @Column() direction: string; // outbound, inbound
  @ApiProperty() @Column() recipientPhone: string;
  @ApiProperty() @Column({ nullable: true }) recipientName: string;
  @ApiProperty() @Column({ nullable: true }) driverId: string;
  @ApiProperty() @Column({ nullable: true }) templateId: string;
  @ApiProperty() @Column({ type: 'text' }) content: string;
  @ApiProperty() @Column({ type: 'text', nullable: true }) contentArabic: string;
  @ApiProperty() @Column({ default: 'queued' }) status: string; // queued, sent, delivered, read, failed, expired
  @ApiProperty() @Column({ nullable: true }) externalMessageId: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) metadata: any;
  @ApiProperty() @Column({ nullable: true }) failureReason: string;
  @ApiProperty() @Column({ type: 'decimal', precision: 6, scale: 4, nullable: true }) costAed: number;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}

@Entity('message_templates')
export class MessageTemplate {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() channel: string;
  @ApiProperty() @Column() category: string; // alert, maintenance, dispatch, compliance, marketing
  @ApiProperty() @Column({ type: 'text' }) contentEn: string;
  @ApiProperty() @Column({ type: 'text' }) contentAr: string;
  @ApiProperty() @Column({ type: 'simple-array', nullable: true }) variables: string[];
  @ApiProperty() @Column({ default: 'approved' }) whatsappStatus: string;
  @ApiProperty() @Column({ default: true }) active: boolean;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}

@Entity('message_campaigns')
export class MessageCampaign {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() name: string;
  @ApiProperty() @Column() channel: string;
  @ApiProperty() @Column() templateId: string;
  @ApiProperty() @Column({ type: 'jsonb' }) audience: any; // filters: fleet type, role, region
  @ApiProperty() @Column({ type: 'int' }) totalRecipients: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) sent: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) delivered: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) read: number;
  @ApiProperty() @Column({ type: 'int', default: 0 }) failed: number;
  @ApiProperty() @Column({ default: 'draft' }) status: string;
  @ApiProperty() @Column({ type: 'timestamp', nullable: true }) scheduledAt: Date;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
