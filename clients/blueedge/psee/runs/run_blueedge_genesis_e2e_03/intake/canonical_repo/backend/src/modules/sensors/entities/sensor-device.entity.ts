import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

/**
 * External Sensor Device — paired to an SVG 2.0 Gateway
 * Covers: Gas/Oil/H2S/Compressor/Environment/Tank Level/Temperature/Vibration sensors
 * Connected via: CAN FD, J1939, Modbus RTU, Modbus TCP, GPIO, I2C, SPI, BLE, Zigbee, LoRa
 */
@Entity('sensor_devices')
@Index(['svgDeviceId'])
@Index(['status'])
@Index(['sensorType'])
@Index(['protocol'])
@Index(['serialNumber'], { unique: true })
export class SensorDevice {
  @PrimaryGeneratedColumn('uuid') id: string;

  // ── Parent SVG Gateway ───────────────────────────────────────
  @Column() svgDeviceId: string; // FK → devices.id
  @Column({ length: 50 }) svgHardwareId: string; // denormalized for fast queries

  // ── Sensor Identity ──────────────────────────────────────────
  @Column({ length: 50, unique: true }) serialNumber: string;
  @Column({ length: 100 }) model: string; // e.g. MQ-135, MPX5700, PT100
  @Column({ length: 100 }) manufacturer: string;
  @Column({ length: 30, nullable: true }) firmwareVersion: string;

  @Column({ type: 'enum', enum: [
    'gas_leak', 'gas_h2s', 'gas_co', 'gas_co2', 'gas_methane', 'gas_lpg', 'gas_nox',
    'oil_pressure', 'oil_temperature', 'oil_level', 'oil_quality',
    'compressor_temperature', 'compressor_vibration', 'compressor_pressure',
    'tank_level', 'tank_pressure', 'tank_temperature',
    'environment_temperature', 'environment_humidity', 'environment_air_quality',
    'fuel_level', 'fuel_flow', 'fuel_quality',
    'tire_pressure', 'tire_temperature',
    'cargo_temperature', 'cargo_humidity', 'cargo_door',
    'vibration', 'accelerometer', 'gyroscope',
    'ultrasonic', 'lidar', 'radar',
    'weight', 'load_cell',
    'custom'
  ], default: 'custom' })
  sensorType: string;

  @Column({ type: 'enum', enum: [
    'tanker_hazmat', 'tanker_crude', 'tanker_chemical', 'tanker_lpg',
    'bus_hvac', 'bus_passenger', 'bus_door',
    'taxi_cabin', 'taxi_trunk',
    'ev_battery', 'ev_charging',
    'coldchain_refrigeration',
    'general'
  ], default: 'general' })
  verticalCategory: string;

  // ── Communication Protocol ───────────────────────────────────
  @Column({ type: 'enum', enum: [
    'can_fd', 'j1939', 'modbus_rtu', 'modbus_tcp', 'gpio', 'i2c', 'spi',
    'ble', 'zigbee', 'lora', 'mqtt', 'analog_4_20ma', 'analog_0_5v',
    'onewire', 'rs485', 'rs232', 'custom'
  ], default: 'can_fd' })
  protocol: string;

  @Column({ length: 20, nullable: true }) canId: string; // e.g. 0x1A0
  @Column({ type: 'int', nullable: true }) modbusAddress: number; // 1-247
  @Column({ type: 'int', nullable: true }) modbusRegister: number;
  @Column({ type: 'int', nullable: true }) gpioPin: number;
  @Column({ type: 'int', nullable: true }) i2cAddress: number;
  @Column({ length: 50, nullable: true }) bleUuid: string;
  @Column({ type: 'jsonb', nullable: true, default: () => "'{}'" }) protocolConfig: Record<string, any>;

  // ── Status ───────────────────────────────────────────────────
  @Column({ type: 'enum', enum: ['active', 'inactive', 'paired', 'unpaired', 'error', 'calibrating', 'maintenance'], default: 'unpaired' })
  status: string;

  @Column({ nullable: true }) lastReadingAt: Date;
  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true }) lastReadingValue: number;
  @Column({ type: 'int', default: 0 }) totalReadings: number;
  @Column({ type: 'int', default: 0 }) errorCount: number;
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) signalStrength: number; // dBm for wireless
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true }) batteryLevel: number; // % for wireless

  // ── Measurement Config ───────────────────────────────────────
  @Column({ length: 20 }) unit: string; // ppm, bar, °C, %, mm, L, kg, m/s², Hz
  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true }) minRange: number;
  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true }) maxRange: number;
  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true }) resolution: number;
  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true }) accuracy: number; // ±%
  @Column({ type: 'int', default: 1000 }) samplingIntervalMs: number;

  // ── Calibration ──────────────────────────────────────────────
  @Column({ nullable: true }) lastCalibratedAt: Date;
  @Column({ nullable: true }) nextCalibrationDue: Date;
  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true }) calibrationOffset: number;
  @Column({ type: 'decimal', precision: 8, scale: 6, nullable: true }) calibrationFactor: number; // multiplier
  @Column({ type: 'jsonb', nullable: true }) calibrationCurve: { input: number; output: number }[];

  // ── Alert Thresholds ─────────────────────────────────────────
  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true }) alertThresholdLow: number;
  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true }) alertThresholdHigh: number;
  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true }) criticalThresholdLow: number;
  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true }) criticalThresholdHigh: number;
  @Column({ default: true }) alertsEnabled: boolean;
  @Column({ type: 'int', default: 60 }) alertCooldownSeconds: number; // debounce

  // ── Physical Installation ────────────────────────────────────
  @Column({ length: 200, nullable: true }) installLocation: string; // e.g. "Tank #2 Top Hatch"
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) mountLatitude: number;
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true }) mountLongitude: number;
  @Column({ length: 200, nullable: true }) wiringNotes: string;

  // ── Compliance ───────────────────────────────────────────────
  @Column({ default: false }) hazmatCertified: boolean;
  @Column({ default: false }) atexCertified: boolean; // ATEX explosive atmosphere cert
  @Column({ default: false }) silRated: boolean; // Safety Integrity Level
  @Column({ type: 'int', nullable: true }) silLevel: number; // SIL 1-4
  @Column({ length: 100, nullable: true }) certificationNumber: string;

  // ── Audit ────────────────────────────────────────────────────
  @Column({ nullable: true }) pairedAt: Date;
  @Column({ length: 100, nullable: true }) pairedBy: string;
  @Column({ nullable: true }) unpairedAt: Date;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
  @Column({ length: 500, nullable: true }) notes: string;
}
