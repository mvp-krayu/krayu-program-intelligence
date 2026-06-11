import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('bus_stops')
@Index(['routeId', 'sequence'])
export class BusStop {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ nullable: true }) routeId: string;
  @Column({ length: 20 }) stopCode: string;
  @Column({ length: 200 }) name: string;
  @Column({ length: 200, nullable: true }) nameAr: string;
  @Column({ type: 'float' }) latitude: number;
  @Column({ type: 'float' }) longitude: number;
  @Column({ type: 'int', default: 0 }) sequence: number;
  @Column({ default: false }) hasAccessibility: boolean;
  @Column({ default: false }) hasShelter: boolean;
  @Column({ default: false }) hasDisplay: boolean;
  @Column({ type: 'enum', enum: ['active', 'closed', 'temporary', 'planned'], default: 'active' }) status: string;
  @Column({ type: 'int', default: 0 }) avgBoardingsDay: number;
  @Column({ type: 'int', default: 0 }) avgAlightingsDay: number;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
