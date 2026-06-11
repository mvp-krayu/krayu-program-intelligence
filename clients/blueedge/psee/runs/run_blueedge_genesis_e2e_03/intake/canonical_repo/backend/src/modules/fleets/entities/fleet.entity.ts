import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('fleets')
@Index(['orgId'])
export class Fleet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orgId: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'enum', enum: ['tanker', 'bus', 'taxi', 'mixed'], default: 'tanker' })
  fleetType: string;

  @Column({ length: 100, nullable: true })
  operationalRegion: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'suspended'], default: 'active' })
  status: string;

  @Column({ type: 'int', default: 0 })
  activeVehicleCount: number;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
