import { Injectable, NotFoundException, BadRequestException, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { SensorDevice } from './entities/sensor-device.entity';
import { SensorReading } from './entities/sensor-reading.entity';
import { SensorAlert } from './entities/sensor-alert.entity';
import { FleetEventEmitterService } from '../../events/fleet-event-emitter.service';
import { PairSensorDto, UpdateSensorDto, CalibrateSensorDto, IngestReadingsDto, SensorQueryDto, ReadingsQueryDto, AcknowledgeAlertDto, ResolveAlertDto } from './dto';

@Injectable()
export class SensorsService {
  private readonly logger = new Logger(SensorsService.name);

  constructor(
    @InjectRepository(SensorDevice) private readonly sensorRepo: Repository<SensorDevice>,
    @InjectRepository(SensorReading) private readonly readingRepo: Repository<SensorReading>,
    @InjectRepository(SensorAlert) private readonly alertRepo: Repository<SensorAlert>,
    private readonly events: FleetEventEmitterService,
  ) {}

  // ══════════════════════════════════════════════════════════════
  // SENSOR CRUD & PAIRING
  // ══════════════════════════════════════════════════════════════

  async findAll(query: SensorQueryDto) {
    const { svgDeviceId, sensorType, protocol, status, verticalCategory, search, page = 1, limit = 25 } = query;
    const qb = this.sensorRepo.createQueryBuilder('s');
    if (svgDeviceId) qb.andWhere('s.svgDeviceId = :svgDeviceId', { svgDeviceId });
    if (sensorType) qb.andWhere('s.sensorType = :sensorType', { sensorType });
    if (protocol) qb.andWhere('s.protocol = :protocol', { protocol });
    if (status) qb.andWhere('s.status = :status', { status });
    if (verticalCategory) qb.andWhere('s.verticalCategory = :verticalCategory', { verticalCategory });
    if (search) qb.andWhere('(s.serialNumber ILIKE :s OR s.model ILIKE :s OR s.manufacturer ILIKE :s)', { s: `%${search}%` });
    qb.orderBy('s.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string): Promise<SensorDevice> {
    const sensor = await this.sensorRepo.findOne({ where: { id } });
    if (!sensor) throw new NotFoundException(`Sensor ${id} not found`);
    return sensor;
  }

  async pairSensor(dto: PairSensorDto, userId: string): Promise<SensorDevice> {
    const existing = await this.sensorRepo.findOne({ where: { serialNumber: dto.serialNumber } });
    if (existing) throw new ConflictException(`Sensor ${dto.serialNumber} already registered`);

    const sensor = this.sensorRepo.create({
      ...dto, svgHardwareId: '', // Will be populated from device lookup
      status: 'paired', pairedAt: new Date(), pairedBy: userId,
    });
    const saved = await this.sensorRepo.save(sensor);
    this.events.emit('sensor.paired', { sensorId: saved.id, svgDeviceId: dto.svgDeviceId, sensorType: dto.sensorType });
    this.logger.log(`Sensor paired: ${dto.serialNumber} (${dto.sensorType}) → SVG ${dto.svgDeviceId}`);
    return saved;
  }

  async updateSensor(id: string, dto: UpdateSensorDto): Promise<SensorDevice> {
    const sensor = await this.findOne(id);
    Object.assign(sensor, dto);
    return this.sensorRepo.save(sensor);
  }

  async unpairSensor(id: string, userId: string): Promise<void> {
    const sensor = await this.findOne(id);
    sensor.status = 'unpaired'; sensor.unpairedAt = new Date();
    await this.sensorRepo.save(sensor);
    this.events.emit('sensor.unpaired', { sensorId: id, svgDeviceId: sensor.svgDeviceId });
  }

  async getDeviceSensors(svgDeviceId: string): Promise<SensorDevice[]> {
    return this.sensorRepo.find({ where: { svgDeviceId }, order: { sensorType: 'ASC' } });
  }

  // ══════════════════════════════════════════════════════════════
  // CALIBRATION
  // ══════════════════════════════════════════════════════════════

  async calibrateSensor(id: string, dto: CalibrateSensorDto, userId: string): Promise<SensorDevice> {
    const sensor = await this.findOne(id);
    sensor.calibrationOffset = dto.calibrationOffset;
    if (dto.calibrationFactor !== undefined) sensor.calibrationFactor = dto.calibrationFactor;
    if (dto.calibrationCurve) sensor.calibrationCurve = dto.calibrationCurve;
    sensor.lastCalibratedAt = new Date();
    if (dto.nextCalibrationDue) sensor.nextCalibrationDue = new Date(dto.nextCalibrationDue);
    sensor.status = 'active';
    const saved = await this.sensorRepo.save(sensor);
    this.events.emit('sensor.calibrated', { sensorId: id, offset: dto.calibrationOffset });
    return saved;
  }

  // ══════════════════════════════════════════════════════════════
  // TELEMETRY INGESTION (Bulk from SVG)
  // ══════════════════════════════════════════════════════════════

  async ingestReadings(dto: IngestReadingsDto) {
    const readings = dto.readings.map(r => this.readingRepo.create({
      sensorId: r.sensorId, svgDeviceId: dto.svgDeviceId, sensorType: r.sensorType,
      timestamp: new Date(r.timestamp), value: r.value, rawValue: r.rawValue, unit: r.unit,
      quality: r.quality || 'good', latitude: r.latitude, longitude: r.longitude,
      vehicleSpeed: r.vehicleSpeed, vehicleState: r.vehicleState,
    }));

    const saved = await this.readingRepo.save(readings);

    // Check thresholds and generate alerts
    const alerts = await this.checkThresholds(dto.svgDeviceId, dto.readings);

    // Update sensor last reading
    for (const r of dto.readings) {
      await this.sensorRepo.update({ id: r.sensorId }, {
        lastReadingAt: new Date(r.timestamp), lastReadingValue: r.value,
        totalReadings: () => '"totalReadings" + 1',
      });
    }

    return { ingested: saved.length, alertsGenerated: alerts.length };
  }

  private async checkThresholds(svgDeviceId: string, readings: any[]): Promise<SensorAlert[]> {
    const alerts: SensorAlert[] = [];
    for (const r of readings) {
      const sensor = await this.sensorRepo.findOne({ where: { id: r.sensorId } });
      if (!sensor || !sensor.alertsEnabled) continue;

      let alertType: string | null = null;
      let severity = 'medium';
      let message = '';

      if (sensor.criticalThresholdHigh !== null && r.value >= sensor.criticalThresholdHigh) {
        alertType = 'critical_high'; severity = 'critical';
        message = `CRITICAL: ${sensor.sensorType} reading ${r.value}${r.unit} exceeds critical threshold ${sensor.criticalThresholdHigh}${r.unit}`;
      } else if (sensor.criticalThresholdLow !== null && r.value <= sensor.criticalThresholdLow) {
        alertType = 'critical_low'; severity = 'critical';
        message = `CRITICAL: ${sensor.sensorType} reading ${r.value}${r.unit} below critical threshold ${sensor.criticalThresholdLow}${r.unit}`;
      } else if (sensor.alertThresholdHigh !== null && r.value >= sensor.alertThresholdHigh) {
        alertType = 'threshold_high'; severity = 'high';
        message = `WARNING: ${sensor.sensorType} reading ${r.value}${r.unit} exceeds threshold ${sensor.alertThresholdHigh}${r.unit}`;
      } else if (sensor.alertThresholdLow !== null && r.value <= sensor.alertThresholdLow) {
        alertType = 'threshold_low'; severity = 'high';
        message = `WARNING: ${sensor.sensorType} reading ${r.value}${r.unit} below threshold ${sensor.alertThresholdLow}${r.unit}`;
      }

      if (alertType) {
        const isHazmat = sensor.sensorType.startsWith('gas_') || sensor.sensorType === 'gas_leak';
        const alert = this.alertRepo.create({
          sensorId: r.sensorId, svgDeviceId, sensorType: sensor.sensorType,
          alertType, severity, status: 'active', triggerValue: r.value,
          thresholdValue: alertType.includes('high') ? (alertType.includes('critical') ? sensor.criticalThresholdHigh : sensor.alertThresholdHigh) : (alertType.includes('critical') ? sensor.criticalThresholdLow : sensor.alertThresholdLow),
          unit: r.unit, message, latitude: r.latitude, longitude: r.longitude,
          hazmatProtocolActivated: isHazmat && severity === 'critical',
          escalationLevel: severity === 'critical' ? (isHazmat ? 3 : 2) : 0,
          escalated: severity === 'critical',
        });
        const saved = await this.alertRepo.save(alert);
        alerts.push(saved);
        this.events.emit('sensor.alert', { alertId: saved.id, sensorId: r.sensorId, svgDeviceId, alertType, severity, value: r.value });
        if (isHazmat && severity === 'critical') {
          this.events.emit('sensor.hazmat.emergency', { alertId: saved.id, svgDeviceId, sensorType: sensor.sensorType, value: r.value, unit: r.unit });
        }
      }
    }
    return alerts;
  }

  // ══════════════════════════════════════════════════════════════
  // READINGS QUERY
  // ══════════════════════════════════════════════════════════════

  async getReadings(query: ReadingsQueryDto) {
    const { sensorId, from, to, limit = 1000 } = query;
    const qb = this.readingRepo.createQueryBuilder('r').where('r.sensorId = :sensorId', { sensorId });
    if (from) qb.andWhere('r.timestamp >= :from', { from: new Date(from) });
    if (to) qb.andWhere('r.timestamp <= :to', { to: new Date(to) });
    qb.orderBy('r.timestamp', 'DESC').take(limit);
    return qb.getMany();
  }

  async getDeviceReadings(svgDeviceId: string, from?: string, to?: string) {
    const qb = this.readingRepo.createQueryBuilder('r').where('r.svgDeviceId = :svgDeviceId', { svgDeviceId });
    if (from) qb.andWhere('r.timestamp >= :from', { from: new Date(from) });
    if (to) qb.andWhere('r.timestamp <= :to', { to: new Date(to) });
    qb.orderBy('r.timestamp', 'DESC').take(5000);
    return qb.getMany();
  }

  // ══════════════════════════════════════════════════════════════
  // ALERTS
  // ══════════════════════════════════════════════════════════════

  async getAlerts(svgDeviceId?: string, severity?: string, status?: string, page = 1, limit = 25) {
    const qb = this.alertRepo.createQueryBuilder('a');
    if (svgDeviceId) qb.andWhere('a.svgDeviceId = :svgDeviceId', { svgDeviceId });
    if (severity) qb.andWhere('a.severity = :severity', { severity });
    if (status) qb.andWhere('a.status = :status', { status });
    qb.orderBy('a.createdAt', 'DESC').skip((page - 1) * limit).take(limit);
    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async acknowledgeAlert(alertId: string, userId: string, dto: AcknowledgeAlertDto) {
    const alert = await this.alertRepo.findOne({ where: { id: alertId } });
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found`);
    alert.status = 'acknowledged'; alert.acknowledgedAt = new Date(); alert.acknowledgedBy = userId;
    alert.timeToAcknowledgeMs = Date.now() - alert.createdAt.getTime();
    return this.alertRepo.save(alert);
  }

  async resolveAlert(alertId: string, userId: string, dto: ResolveAlertDto) {
    const alert = await this.alertRepo.findOne({ where: { id: alertId } });
    if (!alert) throw new NotFoundException(`Alert ${alertId} not found`);
    alert.status = 'resolved'; alert.resolvedAt = new Date(); alert.resolvedBy = userId;
    alert.resolutionNotes = dto.resolutionNotes; alert.rootCause = dto.rootCause;
    alert.timeToResolveMs = Date.now() - alert.createdAt.getTime();
    return this.alertRepo.save(alert);
  }

  // ══════════════════════════════════════════════════════════════
  // FLEET ANALYTICS
  // ══════════════════════════════════════════════════════════════

  async getFleetSensorHealth() {
    const total = await this.sensorRepo.count();
    const active = await this.sensorRepo.count({ where: { status: 'active' } });
    const error = await this.sensorRepo.count({ where: { status: 'error' } });
    const calibrationDue = await this.sensorRepo.query(`SELECT COUNT(*) as count FROM sensor_devices WHERE "nextCalibrationDue" < NOW()`);
    const byType = await this.sensorRepo.query(`SELECT "sensorType", COUNT(*) as count FROM sensor_devices GROUP BY "sensorType" ORDER BY count DESC`);
    const byProtocol = await this.sensorRepo.query(`SELECT protocol, COUNT(*) as count FROM sensor_devices GROUP BY protocol ORDER BY count DESC`);
    const activeAlerts = await this.alertRepo.count({ where: { status: 'active' } });
    const criticalAlerts = await this.alertRepo.query(`SELECT COUNT(*) as count FROM sensor_alerts WHERE severity = 'critical' AND status = 'active'`);
    return {
      total, active, error, calibrationOverdue: calibrationDue[0]?.count || 0,
      byType, byProtocol, activeAlerts, criticalAlerts: criticalAlerts[0]?.count || 0,
    };
  }
}
