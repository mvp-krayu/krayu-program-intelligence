import { IsString, IsOptional, IsEnum, IsBoolean, IsNumber, IsArray, IsUUID, IsDateString, IsObject, Min, Max, Length, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

/* ══════════════════════════════════════════════════════════════
   PAIR SENSOR DTO — Attach external sensor to SVG
   ══════════════════════════════════════════════════════════════ */
export class PairSensorDto {
  @ApiProperty() @IsUUID() svgDeviceId: string;
  @ApiProperty() @IsString() serialNumber: string;
  @ApiProperty() @IsString() model: string;
  @ApiProperty() @IsString() manufacturer: string;
  @ApiProperty({ enum: ['gas_leak','gas_h2s','gas_co','gas_co2','gas_methane','gas_lpg','gas_nox','oil_pressure','oil_temperature','oil_level','oil_quality','compressor_temperature','compressor_vibration','compressor_pressure','tank_level','tank_pressure','tank_temperature','environment_temperature','environment_humidity','environment_air_quality','fuel_level','fuel_flow','fuel_quality','tire_pressure','tire_temperature','cargo_temperature','cargo_humidity','cargo_door','vibration','accelerometer','gyroscope','ultrasonic','lidar','radar','weight','load_cell','custom'] })
  @IsString() sensorType: string;

  @ApiProperty({ enum: ['can_fd','j1939','modbus_rtu','modbus_tcp','gpio','i2c','spi','ble','zigbee','lora','mqtt','analog_4_20ma','analog_0_5v','onewire','rs485','rs232','custom'] })
  @IsString() protocol: string;

  @ApiProperty() @IsString() unit: string;
  @ApiPropertyOptional() @IsOptional() @IsString() canId?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() modbusAddress?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() modbusRegister?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() gpioPin?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() i2cAddress?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() bleUuid?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() protocolConfig?: Record<string, any>;

  @ApiPropertyOptional() @IsOptional() @IsNumber() minRange?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() maxRange?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(10) @Max(60000) samplingIntervalMs?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber() alertThresholdLow?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() alertThresholdHigh?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() criticalThresholdLow?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() criticalThresholdHigh?: number;

  @ApiPropertyOptional() @IsOptional() @IsString() installLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() verticalCategory?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() hazmatCertified?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() atexCertified?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() @Length(0, 500) notes?: string;
}

/* ══════════════════════════════════════════════════════════════
   UPDATE SENSOR DTO
   ══════════════════════════════════════════════════════════════ */
export class UpdateSensorDto {
  @ApiPropertyOptional() @IsOptional() @IsString() firmwareVersion?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() samplingIntervalMs?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() alertThresholdLow?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() alertThresholdHigh?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() criticalThresholdLow?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() criticalThresholdHigh?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() alertsEnabled?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsNumber() alertCooldownSeconds?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() installLocation?: string;
  @ApiPropertyOptional() @IsOptional() @IsObject() protocolConfig?: Record<string, any>;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

/* ══════════════════════════════════════════════════════════════
   CALIBRATE SENSOR DTO
   ══════════════════════════════════════════════════════════════ */
export class CalibrateSensorDto {
  @ApiProperty() @IsNumber() calibrationOffset: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() calibrationFactor?: number;
  @ApiPropertyOptional() @IsOptional() @IsArray() calibrationCurve?: { input: number; output: number }[];
  @ApiPropertyOptional() @IsOptional() @IsDateString() nextCalibrationDue?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

/* ══════════════════════════════════════════════════════════════
   INGEST READINGS DTO — Bulk telemetry from SVG
   ══════════════════════════════════════════════════════════════ */
export class IngestReadingsDto {
  @ApiProperty() @IsUUID() svgDeviceId: string;
  @ApiProperty({ type: 'array' }) @IsArray() @ValidateNested({ each: true }) @Type(() => ReadingItem)
  readings: ReadingItem[];
}

export class ReadingItem {
  @ApiProperty() @IsString() sensorId: string;
  @ApiProperty() @IsString() sensorType: string;
  @ApiProperty() @IsDateString() timestamp: string;
  @ApiProperty() @IsNumber() value: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() rawValue?: number;
  @ApiProperty() @IsString() unit: string;
  @ApiPropertyOptional() @IsOptional() @IsString() quality?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() latitude?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() longitude?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() vehicleSpeed?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleState?: string;
}

/* ══════════════════════════════════════════════════════════════
   ALERT ACTION DTOs
   ══════════════════════════════════════════════════════════════ */
export class AcknowledgeAlertDto {
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class ResolveAlertDto {
  @ApiProperty() @IsString() resolutionNotes: string;
  @ApiPropertyOptional() @IsOptional() @IsString() rootCause?: string;
}

/* ══════════════════════════════════════════════════════════════
   QUERY DTOs
   ══════════════════════════════════════════════════════════════ */
export class SensorQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() svgDeviceId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sensorType?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() protocol?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() status?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() verticalCategory?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() search?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Max(100) limit?: number;
}

export class ReadingsQueryDto {
  @ApiProperty() @IsUUID() sensorId: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() from?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() to?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(1) @Max(10000) limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() aggregation?: string; // 'raw', '1m', '5m', '15m', '1h', '1d'
}
