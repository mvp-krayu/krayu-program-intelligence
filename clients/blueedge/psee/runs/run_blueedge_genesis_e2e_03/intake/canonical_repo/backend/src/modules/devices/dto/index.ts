import { IsString, IsOptional, IsEnum, IsBoolean, IsDateString, IsNumber, IsArray, ValidateNested, IsUUID, Min, Max, Length, Matches, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType, PickType } from '@nestjs/swagger';

/* ══════════════════════════════════════════════════════════════
   CREATE DEVICE DTO — Device Registration
   ══════════════════════════════════════════════════════════════ */
export class CreateDeviceDto {
  @ApiProperty({ example: 'PN-SVG-2025-TANKER' })
  @IsString() @Length(5, 50) partNumber: string;

  @ApiPropertyOptional({ example: 'SN-100001' })
  @IsOptional() @IsString() @Length(5, 50) serialNumber?: string;

  @ApiProperty({ example: 'AA:BB:CC:DD:EE:FF' })
  @IsString() @Matches(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/) macAddress: string;

  @ApiProperty({ example: 'AE' })
  @IsString() @Length(2, 3) countryCode: string;

  @ApiPropertyOptional({ example: 'Blue Edge Manufacturing' })
  @IsOptional() @IsString() manufacturer?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() tpmEndorsementKey?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() manufacturingDate?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() factoryLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() batchNumber?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() hardwareVersion?: string;

  @ApiProperty({ enum: ['tanker', 'bus', 'taxi', 'ev', 'coldchain'] })
  @IsEnum(['tanker', 'bus', 'taxi', 'ev', 'coldchain']) fleetType: string;

  @ApiPropertyOptional() @IsOptional() @IsString() @Length(0, 500) notes?: string;

  // QC flags
  @ApiProperty() @IsBoolean() confirmedAccurate: boolean;
  @ApiProperty() @IsBoolean() qcPassed: boolean;
  @ApiProperty() @IsBoolean() readyForProvisioning: boolean;
}

/* ══════════════════════════════════════════════════════════════
   UPDATE DEVICE DTO
   ══════════════════════════════════════════════════════════════ */
export class UpdateDeviceDto extends PartialType(
  PickType(CreateDeviceDto, ['manufacturer', 'factoryLocation', 'batchNumber', 'hardwareVersion', 'fleetType', 'notes'] as const)
) {
  @ApiPropertyOptional({ enum: ['online', 'offline', 'warning', 'error', 'provisioning'] })
  @IsOptional() @IsEnum(['online', 'offline', 'warning', 'error', 'provisioning']) status?: string;

  @ApiPropertyOptional({ enum: ['manufactured', 'provisioned', 'deployed', 'operational', 'maintenance', 'decommissioned'] })
  @IsOptional() @IsEnum(['manufactured', 'provisioned', 'deployed', 'operational', 'maintenance', 'decommissioned']) lifecycle?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() firmwareVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() softwareVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() configVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() location?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() configuration?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsObject() protocolConfig?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsArray() capabilities?: string[];
}

/* ══════════════════════════════════════════════════════════════
   PROVISION DEVICE DTO — Trigger 8-step workflow
   ══════════════════════════════════════════════════════════════ */
export class ProvisionDeviceDto {
  @ApiProperty() @IsUUID() deviceId: string;

  @ApiPropertyOptional({ enum: ['manual', 'automated', 'batch', 'factory_line'] })
  @IsOptional() @IsEnum(['manual', 'automated', 'batch', 'factory_line']) triggerType?: string;

  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoRetryOnFailure?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() rollbackOnCriticalFailure?: boolean;

  @ApiPropertyOptional({ description: 'Network config to apply during provisioning' })
  @IsOptional() @IsObject() networkConfig?: {
    primaryNetwork: string; fallbackNetwork: string;
    mqttBroker: string; mqttPort: number;
    telemetryInterval: number; heartbeatInterval: number;
  };

  @ApiPropertyOptional({ description: 'Protocol config: J1939, CAN FD, OBD-II' })
  @IsOptional() @IsObject() protocolConfig?: {
    j1939Enabled: boolean; canFdEnabled: boolean; obdIIEnabled: boolean;
    pgns: number[]; baudRate: number;
  };

  @ApiPropertyOptional() @IsOptional() @IsString() targetFleetId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() targetVehicleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(0, 500) notes?: string;
}

/* ══════════════════════════════════════════════════════════════
   BATCH PROVISION DTO — Multiple devices
   ══════════════════════════════════════════════════════════════ */
export class BatchProvisionDto {
  @ApiProperty({ type: [String] }) @IsArray() @IsUUID('4', { each: true })
  deviceIds: string[];

  @ApiPropertyOptional() @IsOptional() @IsString() batchLabel?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() networkConfig?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsObject() protocolConfig?: Record<string, any>;
}

/* ══════════════════════════════════════════════════════════════
   TRANSFER DEVICE DTO — Ownership transfer
   ══════════════════════════════════════════════════════════════ */
export class TransferDeviceDto {
  @ApiProperty() @IsUUID() deviceId: string;
  @ApiProperty() @IsString() toOwnerIdentifier: string; // email or blockchain address
  
  @ApiProperty({ enum: ['sale', 'gift', 'lease', 'return', 'reassignment', 'warranty_replacement', 'decommission'] })
  @IsEnum(['sale', 'gift', 'lease', 'return', 'reassignment', 'warranty_replacement', 'decommission'])
  transferType: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) priceAmount?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(3, 3) priceCurrency?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() useEscrow?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() recordOnBlockchain?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() transferWarranty?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() resetConfig?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() reissueCertificates?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(0, 500) notes?: string;
}

/* ══════════════════════════════════════════════════════════════
   DEPLOY CONFIG DTO
   ══════════════════════════════════════════════════════════════ */
export class DeployConfigDto {
  @ApiProperty() @IsUUID() deviceId: string;

  @ApiProperty({ enum: ['device_config', 'network_config', 'protocol_config', 'firmware_update', 'security_patch', 'feature_flag', 'geofence_update'] })
  @IsEnum(['device_config', 'network_config', 'protocol_config', 'firmware_update', 'security_patch', 'feature_flag', 'geofence_update'])
  configType: string;

  @ApiProperty() @IsString() toVersion: string;
  @ApiProperty() @IsObject() configPayload: Record<string, any>;

  @ApiPropertyOptional({ enum: ['immediate', 'scheduled', 'maintenance_window', 'next_idle'] })
  @IsOptional() @IsEnum(['immediate', 'scheduled', 'maintenance_window', 'next_idle']) deploymentWindow?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString() scheduledAt?: string;

  @ApiPropertyOptional({ enum: ['single', 'batch', 'canary', 'rolling'] })
  @IsOptional() @IsEnum(['single', 'batch', 'canary', 'rolling']) rolloutStrategy?: string;

  @ApiPropertyOptional() @IsOptional() @IsBoolean() autoRollbackOnFailure?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(0, 500) approvalNotes?: string;
}

/* ══════════════════════════════════════════════════════════════
   QUERY FILTERS DTO
   ══════════════════════════════════════════════════════════════ */
export class DeviceQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsEnum(['online', 'offline', 'warning', 'error', 'provisioning']) status?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['manufactured', 'provisioned', 'deployed', 'operational', 'maintenance', 'decommissioned']) lifecycle?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['tanker', 'bus', 'taxi', 'ev', 'coldchain']) fleetType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ownerId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Max(100) limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() sortBy?: string;
  @ApiPropertyOptional() @IsOptional() @IsEnum(['ASC', 'DESC']) sortOrder?: string;
}
