import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('cargo_manifests')
@Index(['tripId'])
@Index(['vehicleId', 'status'])
export class CargoManifest {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() tripId: string;
  @Column() vehicleId: string;
  @Column({ length: 30, unique: true }) manifestNumber: string;
  @Column({ type: 'enum', enum: ['draft', 'confirmed', 'in_transit', 'delivered', 'rejected'], default: 'draft' }) status: string;
  @Column({ length: 100, nullable: true }) customerName: string;
  @Column({ length: 200, nullable: true }) originFacility: string;
  @Column({ length: 200, nullable: true }) destinationFacility: string;
  @Column({ type: 'jsonb', nullable: true }) compartments: Array<{
    compartmentNumber: number; productId: string; productName: string;
    loadedVolumeL: number; deliveredVolumeL?: number; temperature?: number;
  }>;
  @Column({ type: 'float', nullable: true }) totalVolumeL: number;
  @Column({ type: 'jsonb', nullable: true }) hazmatInfo: { unNumber?: string; hazClass?: string; packingGroup?: string; erg?: string; };
  @Column({ type: 'jsonb', nullable: true }) documentation: { bolNumber?: string; bolUrl?: string; permits?: string[]; };
  @Column({ nullable: true }) loadedAt: Date;
  @Column({ nullable: true }) deliveredAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
