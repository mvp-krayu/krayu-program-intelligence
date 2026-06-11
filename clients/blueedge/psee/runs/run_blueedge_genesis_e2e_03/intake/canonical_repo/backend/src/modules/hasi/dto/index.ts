import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsArray, IsUUID, IsDateString, IsObject, Min, Max, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/* ══════════════════════════════════════════════════════════════
   INGEST CAPTURE REPORT — Pushed from HASI on SVG Yocto
   ══════════════════════════════════════════════════════════════ */
export class IngestCaptureDto {
  @ApiProperty() @IsString() svgDeviceId: string;
  @ApiProperty() @IsString() svgHardwareId: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleId?: string;

  // Capture metadata
  @ApiPropertyOptional() @IsOptional() @IsString() hasiCaptureId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() filename?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() fileSizeBytes?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() fileHashSha256?: string;

  // Analysis results
  @ApiProperty() @IsNumber() totalPackets: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() captureDurationSec?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() captureStartTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() captureEndTime?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() uniqueSources?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() uniqueDestinations?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalFlows?: number;

  @ApiProperty() @IsObject() protocolSummary: Record<string, number>;
  @ApiPropertyOptional() @IsOptional() @IsObject() protocolClassification?: Record<string, number>;

  @ApiPropertyOptional() @IsOptional() @IsNumber() totalBytesIn?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() totalBytesOut?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() topSources?: any[];
  @ApiPropertyOptional() @IsOptional() @IsArray() topDestinations?: any[];
  @ApiPropertyOptional() @IsOptional() @IsArray() topPorts?: any[];

  @ApiPropertyOptional() @IsOptional() @IsString() captureMode?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() captureScope?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() latitude?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() longitude?: number;

  // Threats detected in this capture
  @ApiPropertyOptional() @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => IngestThreatDto)
  threats?: IngestThreatDto[];

  // AI analysis if available
  @ApiPropertyOptional() @IsOptional() @IsBoolean() aiAnalyzed?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() aiSummary?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() aiRecommendations?: any[];

  // Firewall rules generated
  @ApiPropertyOptional() @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => IngestFirewallRuleDto)
  firewallRules?: IngestFirewallRuleDto[];
}

/* ══════════════════════════════════════════════════════════════
   INGEST THREAT DTO — Individual threat from HASI
   ══════════════════════════════════════════════════════════════ */
export class IngestThreatDto {
  @ApiProperty() @IsString() threatCategory: string;
  @ApiProperty() @IsString() severity: string;
  @ApiProperty() @IsString() description: string;
  @ApiPropertyOptional() @IsOptional() @IsString() detailedAnalysis?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() indicatorType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() indicatorValue?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceIp?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() sourcePort?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() destinationIp?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() destinationPort?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() protocol?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() packetCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() byteCount?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() confidenceScore?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() networkZone?: string;
  @ApiPropertyOptional() @IsOptional() @IsArray() recommendedActions?: any[];
  @ApiPropertyOptional() @IsOptional() @IsString() mitreTacticId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() mitreTechniqueId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() detectedAt?: string;
}

/* ══════════════════════════════════════════════════════════════
   INGEST FIREWALL RULE DTO
   ══════════════════════════════════════════════════════════════ */
export class IngestFirewallRuleDto {
  @ApiProperty() @IsString() action: string;
  @ApiProperty() @IsString() direction: string;
  @ApiPropertyOptional() @IsOptional() @IsString() protocol?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sourceIp?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() destinationIp?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() destinationPort?: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() severity: string;
  @ApiPropertyOptional() @IsOptional() @IsString() iptablesRule?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() ciscoAcl?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() paloAltoRule?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() fortinetRule?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() vendorNeutralRule?: string;
}

/* ══════════════════════════════════════════════════════════════
   THREAT ACTION DTOs
   ══════════════════════════════════════════════════════════════ */
export class MitigateThreatDto {
  @ApiProperty() @IsString() mitigationAction: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class DeployFirewallRuleDto {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() fleetWide?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsArray() deviceIds?: string[];
  @ApiPropertyOptional() @IsOptional() @IsDateString() expiresAt?: string;
}

/* ══════════════════════════════════════════════════════════════
   QUERY DTOs
   ══════════════════════════════════════════════════════════════ */
export class HasiCaptureQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() svgDeviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() from?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() to?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Max(100) limit?: number;
}

export class HasiThreatQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() svgDeviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() severity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() threatCategory?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() networkZone?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() from?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() to?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Max(100) limit?: number;
}
