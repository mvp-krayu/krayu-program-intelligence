import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('drivers')
@Index(['orgId', 'status'])
@Index(['employeeId'], { unique: true })
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orgId: string;

  @Column({ length: 30, unique: true })
  employeeId: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ nullable: true, length: 100 })
  firstNameAr: string;

  @Column({ nullable: true, length: 100 })
  lastNameAr: string;

  @Column({ length: 200, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: ['active', 'inactive', 'suspended', 'on_leave'], default: 'active' })
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  licenses: Array<{
    type: string;
    number: string;
    issuedDate: string;
    expiryDate: string;
    country: string;
    endorsements?: string[];
  }>;

  @Column({ type: 'jsonb', nullable: true })
  certifications: Array<{
    type: string;
    name: string;
    issuedDate: string;
    expiryDate: string;
    authority: string;
  }>;

  @Column({ type: 'jsonb', nullable: true })
  training: Array<{
    course: string;
    completedDate: string;
    expiryDate?: string;
    score?: number;
  }>;

  @Column({ type: 'float', default: 100 })
  safetyScore: number;

  @Column({ type: 'float', default: 100 })
  efficiencyScore: number;

  @Column({ type: 'float', default: 100 })
  complianceScore: number;

  @Column({ nullable: true })
  currentVehicleId: string;

  @Column({ nullable: true, length: 255 })
  photoUrl: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'date', nullable: true })
  hireDate: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
