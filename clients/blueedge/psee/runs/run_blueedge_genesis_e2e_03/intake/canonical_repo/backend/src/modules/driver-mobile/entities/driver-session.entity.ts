import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('driver_sessions')
export class DriverSession {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() driverId: string;
  @ApiProperty() @Column({ nullable: true }) deviceId: string;
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) location: any;
  @ApiProperty() @Column({ nullable: true }) appVersion: string;
  @ApiProperty() @Column({ nullable: true }) platform: string;
  @ApiProperty() @CreateDateColumn() startedAt: Date;
}
