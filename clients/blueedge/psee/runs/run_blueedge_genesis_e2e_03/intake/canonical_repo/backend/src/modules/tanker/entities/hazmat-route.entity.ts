import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('hazmat_routes')
@Index(['status'])
export class HazmatRoute {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ length: 150 }) name: string;
  @Column({ length: 200 }) origin: string;
  @Column({ length: 200 }) destination: string;
  @Column({ length: 30 }) hazmatClasses: string;
  @Column({ type: 'text', nullable: true }) restrictions: string;
  @Column({ length: 50, nullable: true }) timeRestriction: string;
  @Column({ type: 'jsonb', nullable: true }) waypointsGeoJson: any;
  @Column({ type: 'enum', enum: ['active', 'suspended', 'archived'], default: 'active' }) status: string;
  @Column({ nullable: true }) lastDeviationAt: Date;
  @Column({ type: 'int', default: 0 }) deviationCount30d: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
