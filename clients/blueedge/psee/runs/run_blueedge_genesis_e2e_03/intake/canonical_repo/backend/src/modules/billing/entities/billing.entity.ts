import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BANK_TRANSFER = 'bank_transfer',
  WIRE = 'wire',
  CHEQUE = 'cheque',
}

@Entity('invoices')
export class Invoice {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() tenantId: string;
  @ApiProperty() @Column({ unique: true }) invoiceNumber: string; // INV-2026-0001
  @ApiProperty() @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING }) status: InvoiceStatus;
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2 }) subtotal: number;
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) vatAmount: number; // UAE VAT 5%
  @ApiProperty() @Column({ type: 'decimal', precision: 12, scale: 2 }) total: number;
  @ApiProperty() @Column({ default: 'AED' }) currency: string;
  @ApiProperty() @Column() billingPeriodStart: Date;
  @ApiProperty() @Column() billingPeriodEnd: Date;
  @ApiProperty() @Column() dueDate: Date;
  @ApiProperty() @Column({ nullable: true }) paidAt: Date;
  @ApiProperty() @Column({ type: 'enum', enum: PaymentMethod, nullable: true }) paymentMethod: PaymentMethod;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) lineItems: any[]; // [{description, qty, unitPrice, total}]
  @ApiProperty() @Column({ nullable: true }) notes: string;
  @ApiProperty() @Column({ nullable: true }) stripeInvoiceId: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}

@Entity('subscriptions')
export class Subscription {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() tenantId: string;
  @ApiProperty() @Column() plan: string; // starter, professional, enterprise, unlimited
  @ApiProperty() @Column({ default: 'active' }) status: string; // active, past_due, cancelled, trialing
  @ApiProperty() @Column({ type: 'decimal', precision: 10, scale: 2 }) monthlyAmount: number;
  @ApiProperty() @Column({ default: 'AED' }) currency: string;
  @ApiProperty() @Column() currentPeriodStart: Date;
  @ApiProperty() @Column() currentPeriodEnd: Date;
  @ApiProperty() @Column({ nullable: true }) trialEnd: Date;
  @ApiProperty() @Column({ nullable: true }) cancelledAt: Date;
  @ApiProperty() @Column({ nullable: true }) stripeSubscriptionId: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) addOns: any[]; // [{name, price, qty}]
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
