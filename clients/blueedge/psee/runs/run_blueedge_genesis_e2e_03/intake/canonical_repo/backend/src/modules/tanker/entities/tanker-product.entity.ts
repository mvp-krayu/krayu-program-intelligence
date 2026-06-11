import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tanker_products')
export class TankerProduct {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 100, unique: true }) name: string;
  @Column({ length: 20, nullable: true }) unNumber: string;
  @Column({ length: 10, nullable: true }) hazmatClass: string;
  @Column({ type: 'float', nullable: true }) flashPointC: number;
  @Column({ type: 'float', nullable: true }) densityMin: number;
  @Column({ type: 'float', nullable: true }) densityMax: number;
  @Column({ type: 'float', nullable: true }) maxTempC: number;
  @Column({ length: 20, nullable: true }) compatibilityGroup: string;
  @Column({ type: 'text', nullable: true }) sdsUrl: string;
  @Column({ length: 10, nullable: true }) ergGuide: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
