import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('tenant_themes')
export class TenantTheme {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() tenantId: string;
  @ApiProperty() @Column() tenantName: string;
  @ApiProperty() @Column({ nullable: true }) logoUrl: string;
  @ApiProperty() @Column({ default: '#0891b2' }) primaryColor: string;
  @ApiProperty() @Column({ default: '#06b6d4' }) secondaryColor: string;
  @ApiProperty() @Column({ default: '#0f172a' }) backgroundColor: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) customStyles: any;
  @ApiProperty() @Column({ default: 'active' }) status: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
  @ApiProperty() @UpdateDateColumn() updatedAt: Date;
}
