import { IsString, IsOptional, IsEnum, IsNumber, IsArray, IsBoolean, IsUUID, IsEmail, IsDateString, IsInt, Min, Max, ValidateNested, MinLength, MaxLength, IsNotEmpty, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

// ═══════════════════════════════════════════════════
//  VEHICLE DTOs
// ═══════════════════════════════════════════════════

export class CreateVehicleDto {
  @ApiProperty({ example: '1HGBH41JXMN109186' })
  @IsString() @MinLength(17) @MaxLength(17)
  vin: string;

  @ApiProperty({ example: 'دبي A 12345' })
  @IsString() @IsNotEmpty()
  licensePlate: string;

  @ApiProperty() @IsUUID()
  fleetId: string;

  @ApiProperty({ enum: ['tanker', 'bus', 'taxi'] })
  @IsEnum(['tanker', 'bus', 'taxi'])
  fleetType: string;

  @ApiProperty({ example: 'Volvo' }) @IsString() @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'FH16' }) @IsString() @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2024 }) @IsInt() @Min(2000) @Max(2030)
  year: number;

  @ApiPropertyOptional() @IsOptional() @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  specifications?: Record<string, any>;

  @ApiPropertyOptional()
  @IsOptional()
  tankUnit?: Record<string, any>;
}

export class UpdateVehicleDto extends PartialType(OmitType(CreateVehicleDto, ['vin'] as const)) {
  @ApiPropertyOptional({ enum: ['active', 'inactive', 'maintenance', 'decommissioned'] })
  @IsOptional() @IsEnum(['active', 'inactive', 'maintenance', 'decommissioned'])
  status?: string;
}

export class VehicleCommandDto {
  @ApiProperty({ enum: ['lock', 'unlock', 'immobilize', 'track', 'diagnostic', 'beep'] })
  @IsEnum(['lock', 'unlock', 'immobilize', 'track', 'diagnostic', 'beep'])
  type: string;

  @ApiPropertyOptional()
  @IsOptional()
  payload?: Record<string, any>;
}

// ═══════════════════════════════════════════════════
//  DRIVER DTOs
// ═══════════════════════════════════════════════════

export class CreateDriverDto {
  @ApiProperty({ example: 'Khalid Ibrahim' }) @IsString() @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'EMP-2026-001' }) @IsString() @IsNotEmpty()
  employeeId: string;

  @ApiProperty() @IsEmail()
  email: string;

  @ApiProperty({ example: '+971501234567' })
  @IsString() @Matches(/^\+?[1-9]\d{1,14}$/, { message: 'Invalid phone number' })
  phone: string;

  @ApiProperty() @IsUUID()
  orgId: string;

  @ApiProperty({ enum: ['tanker', 'bus', 'taxi'] })
  @IsEnum(['tanker', 'bus', 'taxi'])
  fleetType: string;

  @ApiPropertyOptional()
  @IsOptional() @IsArray()
  licenses?: Array<{ type: string; number: string; expiryDate: string }>;

  @ApiPropertyOptional()
  @IsOptional() @IsArray()
  certifications?: Array<{ type: string; number: string; expiryDate: string }>;
}

export class UpdateDriverDto extends PartialType(OmitType(CreateDriverDto, ['employeeId'] as const)) {
  @ApiPropertyOptional({ enum: ['active', 'inactive', 'on_leave', 'suspended'] })
  @IsOptional() @IsEnum(['active', 'inactive', 'on_leave', 'suspended'])
  status?: string;
}

// ═══════════════════════════════════════════════════
//  FLEET DTOs
// ═══════════════════════════════════════════════════

export class CreateFleetDto {
  @ApiProperty({ example: 'Dubai Tanker Fleet Alpha' }) @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['tanker', 'bus', 'taxi'] })
  @IsEnum(['tanker', 'bus', 'taxi'])
  fleetType: string;

  @ApiProperty() @IsUUID()
  orgId: string;

  @ApiPropertyOptional({ example: 'UAE - Dubai' }) @IsOptional() @IsString()
  operationalRegion?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  regulatoryFramework?: string;
}

export class UpdateFleetDto extends PartialType(CreateFleetDto) {
  @ApiPropertyOptional({ enum: ['active', 'inactive', 'suspended'] })
  @IsOptional() @IsEnum(['active', 'inactive', 'suspended'])
  status?: string;
}

// ═══════════════════════════════════════════════════
//  TRIP DTOs
// ═══════════════════════════════════════════════════

export class CreateTripDto {
  @ApiProperty() @IsUUID()
  vehicleId: string;

  @ApiProperty() @IsUUID()
  driverId: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  fleetId?: string;

  @ApiProperty()
  @IsNotEmpty()
  origin: { name: string; lat: number; lng: number };

  @ApiProperty()
  @IsNotEmpty()
  destination: { name: string; lat: number; lng: number };

  @ApiPropertyOptional()
  @IsOptional() @IsArray()
  waypoints?: Array<{ name: string; lat: number; lng: number }>;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  scheduledStartTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  cargoManifest?: Array<{ compartment: number; product: string; volumeL: number }>;
}

export class UpdateTripDto {
  @ApiPropertyOptional({ enum: ['planned', 'in_progress', 'completed', 'cancelled'] })
  @IsOptional() @IsEnum(['planned', 'in_progress', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  actualStartTime?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  actualEndTime?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  actualDistanceKm?: number;
}

// ═══════════════════════════════════════════════════
//  ALERT DTOs
// ═══════════════════════════════════════════════════

export class CreateAlertDto {
  @ApiProperty({ enum: ['critical', 'high', 'medium', 'low', 'info'] })
  @IsEnum(['critical', 'high', 'medium', 'low', 'info'])
  severity: string;

  @ApiProperty({ example: 'rollover_risk' }) @IsString() @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'High rollover risk detected on vehicle TK-0847' })
  @IsString() @IsNotEmpty()
  message: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  driverId?: string;

  @ApiPropertyOptional() @IsOptional()
  metadata?: Record<string, any>;
}

export class AcknowledgeAlertDto {
  @ApiPropertyOptional({ example: 'Dispatcher acknowledged — monitoring situation' })
  @IsOptional() @IsString()
  note?: string;
}

export class ResolveAlertDto {
  @ApiProperty({ example: 'Vehicle pulled over, risk mitigated' })
  @IsString() @IsNotEmpty()
  resolution: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  rootCause?: string;
}

// ═══════════════════════════════════════════════════
//  MAINTENANCE DTOs
// ═══════════════════════════════════════════════════

export class CreateWorkOrderDto {
  @ApiProperty() @IsUUID()
  vehicleId: string;

  @ApiProperty({ enum: ['preventive', 'corrective', 'predictive', 'recall', 'inspection'] })
  @IsEnum(['preventive', 'corrective', 'predictive', 'recall', 'inspection'])
  type: string;

  @ApiProperty({ enum: ['critical', 'high', 'medium', 'low'] })
  @IsEnum(['critical', 'high', 'medium', 'low'])
  priority: string;

  @ApiProperty({ example: 'Oil pressure sensor replacement' })
  @IsString() @IsNotEmpty()
  description: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  scheduledDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0)
  estimatedCostAED?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0)
  estimatedHours?: number;

  @ApiPropertyOptional() @IsOptional() @IsArray()
  parts?: Array<{ partNumber: string; name: string; quantity: number; unitCostAED: number }>;
}

export class UpdateWorkOrderDto extends PartialType(CreateWorkOrderDto) {
  @ApiPropertyOptional({ enum: ['draft', 'scheduled', 'in_progress', 'completed', 'cancelled'] })
  @IsOptional() @IsEnum(['draft', 'scheduled', 'in_progress', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0)
  actualCostAED?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0)
  actualHours?: number;
}

// ═══════════════════════════════════════════════════
//  FUEL DTOs
// ═══════════════════════════════════════════════════

export class CreateFuelTransactionDto {
  @ApiProperty() @IsUUID()
  vehicleId: string;

  @ApiProperty({ enum: ['refuel', 'consumption', 'adjustment', 'theft_suspected'] })
  @IsEnum(['refuel', 'consumption', 'adjustment', 'theft_suspected'])
  type: string;

  @ApiProperty({ example: 120.5 }) @IsNumber() @Min(0)
  volumeL: number;

  @ApiPropertyOptional({ example: 3.25 }) @IsOptional() @IsNumber() @Min(0)
  pricePerLAED?: number;

  @ApiPropertyOptional({ example: 'ADNOC Jebel Ali' }) @IsOptional() @IsString()
  station?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  odometerKm?: number;
}

// ═══════════════════════════════════════════════════
//  TANKER DTOs
// ═══════════════════════════════════════════════════

export class CreateCargoManifestDto {
  @ApiProperty() @IsUUID()
  tripId: string;

  @ApiProperty() @IsUUID()
  vehicleId: string;

  @ApiProperty()
  @IsArray() @ValidateNested({ each: true }) @Type(() => CompartmentCargoDto)
  compartments: CompartmentCargoDto[];
}

export class CompartmentCargoDto {
  @ApiProperty({ example: 1 }) @IsInt() @Min(1) @Max(6)
  compartmentNumber: number;

  @ApiProperty({ example: 'UN1203' }) @IsString()
  unNumber: string;

  @ApiProperty({ example: 'Gasoline' }) @IsString()
  productName: string;

  @ApiProperty({ example: 8500 }) @IsNumber() @Min(0)
  volumeL: number;

  @ApiProperty({ example: 22.5 }) @IsNumber()
  temperatureC: number;
}

export class CustodyTransferDto {
  @ApiProperty() @IsUUID()
  manifestId: string;

  @ApiProperty({ enum: ['loading', 'unloading'] })
  @IsEnum(['loading', 'unloading'])
  transferType: string;

  @ApiProperty({ example: 'ADNOC Ruwais Terminal' }) @IsString() @IsNotEmpty()
  facilityName: string;

  @ApiPropertyOptional()
  @IsOptional()
  measurements?: {
    volumeL: number;
    temperatureC: number;
    densityKgM3: number;
    waterContentPercent?: number;
  };

  @ApiPropertyOptional() @IsOptional() @IsBoolean()
  safetyCheckCompleted?: boolean;
}

// ═══════════════════════════════════════════════════
//  DEVICE DTOs
// ═══════════════════════════════════════════════════

export class ProvisionDeviceDto {
  @ApiProperty({ example: 'SVG-2026-0001' }) @IsString() @IsNotEmpty()
  serialNumber: string;

  @ApiProperty({ example: '2.8.0' }) @IsString() @IsNotEmpty()
  firmwareVersion: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  simIccid?: string;

  @ApiPropertyOptional() @IsOptional()
  capabilities?: string[];
}

export class UpdateDeviceDto {
  @ApiPropertyOptional({ enum: ['active', 'inactive', 'provisioning', 'decommissioned'] })
  @IsOptional() @IsEnum(['active', 'inactive', 'provisioning', 'decommissioned'])
  status?: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  vehicleId?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  firmwareVersion?: string;
}

export class OtaDeploymentDto {
  @ApiProperty({ example: '2.9.0' }) @IsString() @IsNotEmpty()
  targetVersion: string;

  @ApiProperty() @IsArray() @IsUUID(undefined, { each: true })
  deviceIds: string[];

  @ApiPropertyOptional({ enum: ['immediate', 'scheduled', 'rolling'] })
  @IsOptional() @IsEnum(['immediate', 'scheduled', 'rolling'])
  strategy?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  scheduledAt?: string;
}

// ═══════════════════════════════════════════════════
//  GEOFENCE / OPERATIONS DTOs
// ═══════════════════════════════════════════════════

export class CreateGeofenceDto {
  @ApiProperty({ example: 'Jebel Ali Free Zone' }) @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: ['polygon', 'circle', 'corridor'] })
  @IsEnum(['polygon', 'circle', 'corridor'])
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  geometry: {
    coordinates?: number[][];
    center?: { lat: number; lng: number };
    radiusM?: number;
  };

  @ApiPropertyOptional({ enum: ['entry', 'exit', 'both', 'dwell'] })
  @IsOptional() @IsEnum(['entry', 'exit', 'both', 'dwell'])
  triggerType?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  speedLimitKmh?: number;
}

// ═══════════════════════════════════════════════════
//  USER DTOs
// ═══════════════════════════════════════════════════

export class CreateUserDto {
  @ApiProperty({ example: 'Ahmed Al Rashid' }) @IsString() @IsNotEmpty()
  fullName: string;

  @ApiProperty() @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8)
  password: string;

  @ApiProperty({ enum: ['admin', 'fleet_manager', 'dispatcher', 'driver', 'customer', 'viewer'] })
  @IsEnum(['admin', 'fleet_manager', 'dispatcher', 'driver', 'customer', 'viewer'])
  role: string;

  @ApiProperty() @IsUUID()
  orgId: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  phone?: string;
}

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {}

export class ChangePasswordDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ minLength: 8 }) @IsString() @MinLength(8)
  newPassword: string;
}

// ═══════════════════════════════════════════════════
//  LOGIN DTO
// ═══════════════════════════════════════════════════

export class LoginDto {
  @ApiProperty({ example: 'admin@blueedge.com' }) @IsEmail()
  email: string;

  @ApiProperty({ example: 'demo123' }) @IsString() @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty() @IsString() @IsNotEmpty()
  refreshToken: string;
}

// ═══════════════════════════════════════════════════
//  NOTIFICATION DTO
// ═══════════════════════════════════════════════════

export class CreateNotificationDto {
  @ApiProperty({ example: 'Maintenance Reminder' }) @IsString() @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Vehicle TK-0847 is due for scheduled maintenance' })
  @IsString() @IsNotEmpty()
  message: string;

  @ApiProperty({ enum: ['info', 'warning', 'critical', 'success'] })
  @IsEnum(['info', 'warning', 'critical', 'success'])
  type: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID()
  userId?: string;

  @ApiPropertyOptional() @IsOptional()
  metadata?: Record<string, any>;
}

// ═══════════════════════════════════════════════════
//  REPORT DTOs
// ═══════════════════════════════════════════════════

export class GenerateReportDto {
  @ApiProperty({ enum: ['fleet_summary', 'driver_performance', 'fuel_consumption', 'maintenance_cost', 'safety_incidents', 'compliance_status'] })
  @IsEnum(['fleet_summary', 'driver_performance', 'fuel_consumption', 'maintenance_cost', 'safety_incidents', 'compliance_status'])
  template: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  startDate?: string;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ['pdf', 'xlsx', 'csv'] })
  @IsOptional() @IsEnum(['pdf', 'xlsx', 'csv'])
  format?: string;

  @ApiPropertyOptional() @IsOptional()
  filters?: Record<string, any>;
}

export class ScheduleReportDto extends GenerateReportDto {
  @ApiProperty({ enum: ['daily', 'weekly', 'monthly'] })
  @IsEnum(['daily', 'weekly', 'monthly'])
  frequency: string;

  @ApiProperty() @IsArray() @IsEmail({}, { each: true })
  recipients: string[];
}

// ═══════════════════════════════════════════════════
//  NL QUERY DTO
// ═══════════════════════════════════════════════════

export class NlQueryDto {
  @ApiProperty({ example: 'Which vehicles had the highest fuel consumption last week?' })
  @IsString() @IsNotEmpty() @MaxLength(500)
  query: string;
}

// ═══════════════════════════════════════════════════
//  BUS DTOs
// ═══════════════════════════════════════════════════

export class CreateBusRouteDto {
  @ApiProperty({ example: 'Route 88 - Bur Dubai to Dubai Marina' }) @IsString() @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '88' }) @IsString() @IsNotEmpty()
  routeNumber: string;

  @ApiPropertyOptional() @IsOptional() @IsArray()
  stops?: Array<{ name: string; lat: number; lng: number; sequence: number }>;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  frequencyMinutes?: number;
}

// ═══════════════════════════════════════════════════
//  TAXI DTOs
// ═══════════════════════════════════════════════════

export class CreateTaxiTripDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID()
  vehicleId?: string;

  @ApiProperty()
  @IsNotEmpty()
  pickup: { address: string; lat: number; lng: number };

  @ApiProperty()
  @IsNotEmpty()
  dropoff: { address: string; lat: number; lng: number };

  @ApiPropertyOptional() @IsOptional() @IsString()
  passengerName?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  passengerPhone?: string;
}

export class UpdateTaxiTripStatusDto {
  @ApiProperty({ enum: ['accepted', 'en_route_pickup', 'arrived_pickup', 'in_progress', 'completed', 'cancelled'] })
  @IsEnum(['accepted', 'en_route_pickup', 'arrived_pickup', 'in_progress', 'completed', 'cancelled'])
  status: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0)
  fareAED?: number;
}
