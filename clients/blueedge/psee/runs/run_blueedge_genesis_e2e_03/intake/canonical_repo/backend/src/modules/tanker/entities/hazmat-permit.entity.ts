import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('hazmat_permits')
@Index(['expiresAt'])
@Index(['status'])
export class HazmatPermit {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 50 }) permitNumber: string;
  @Column({ length: 50 }) authority: string;
  @Column({ length: 30 }) type: string;
  @Column({ length: 30, nullable: true }) hazmatClasses: string;
  @Column() issuedAt: Date;
  @Column() expiresAt: Date;
  @Column({ type: 'enum', enum: ['valid', 'expiring', 'expired', 'suspended'], default: 'valid' }) status: string;
  @Column({ type: 'text', nullable: true }) vehicleIds: string;
  @Column({ type: 'text', nullable: true }) notes: string;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
