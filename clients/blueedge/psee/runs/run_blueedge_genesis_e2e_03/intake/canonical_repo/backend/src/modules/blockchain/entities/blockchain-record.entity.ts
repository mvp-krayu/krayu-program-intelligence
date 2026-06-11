import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
@Entity('blockchain_records')
export class BlockchainRecord {
  @ApiProperty() @PrimaryGeneratedColumn('uuid') id: string;
  @ApiProperty() @Column() transactionHash: string;
  @ApiProperty() @Column() recordType: string;
  @ApiProperty() @Column() entityId: string;
  @ApiProperty() @Column({ nullable: true }) blockNumber: string;
  @ApiProperty() @Column({ nullable: true }) chainId: string;
  @ApiProperty() @Column({ type: 'jsonb', nullable: true }) payload: any;
  @ApiProperty() @Column({ default: 'confirmed' }) status: string;
  @ApiProperty() @Column({ nullable: true }) verifiedBy: string;
  @ApiProperty() @CreateDateColumn() createdAt: Date;
}
