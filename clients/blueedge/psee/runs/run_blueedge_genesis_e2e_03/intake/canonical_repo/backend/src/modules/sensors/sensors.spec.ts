import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SensorsService } from './sensors.service';
import { SensorDevice } from './entities/sensor-device.entity';
import { SensorReading } from './entities/sensor-reading.entity';
import { SensorAlert } from './entities/sensor-alert.entity';
import { FleetEventEmitterService } from '../../events/fleet-event-emitter.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockRepo = () => ({
  find: jest.fn(), findOne: jest.fn(), create: jest.fn(d => d), save: jest.fn(d => ({ id: 'uuid-1', ...d })),
  count: jest.fn().mockResolvedValue(10), query: jest.fn().mockResolvedValue([]), update: jest.fn(),
  createQueryBuilder: jest.fn(() => ({
    andWhere: jest.fn().mockReturnThis(), orderBy: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(), skip: jest.fn().mockReturnThis(), take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]), getMany: jest.fn().mockResolvedValue([]),
  })),
});
const mockEvents = () => ({ emit: jest.fn() });

describe('SensorsService', () => {
  let service: SensorsService;
  let sensorRepo: ReturnType<typeof mockRepo>;
  let readingRepo: ReturnType<typeof mockRepo>;
  let alertRepo: ReturnType<typeof mockRepo>;
  let events: ReturnType<typeof mockEvents>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SensorsService,
        { provide: getRepositoryToken(SensorDevice), useFactory: mockRepo },
        { provide: getRepositoryToken(SensorReading), useFactory: mockRepo },
        { provide: getRepositoryToken(SensorAlert), useFactory: mockRepo },
        { provide: FleetEventEmitterService, useFactory: mockEvents },
      ],
    }).compile();
    service = module.get(SensorsService);
    sensorRepo = module.get(getRepositoryToken(SensorDevice));
    readingRepo = module.get(getRepositoryToken(SensorReading));
    alertRepo = module.get(getRepositoryToken(SensorAlert));
    events = module.get(FleetEventEmitterService);
  });

  it('should be defined', () => { expect(service).toBeDefined(); });

  describe('pairSensor', () => {
    it('should pair sensor to SVG device', async () => {
      sensorRepo.findOne.mockResolvedValue(null);
      const dto = { svgDeviceId: 'dev-1', serialNumber: 'SN-GAS-001', model: 'MQ-135', manufacturer: 'Winsen', sensorType: 'gas_leak', protocol: 'can_fd', unit: 'ppm' };
      const result = await service.pairSensor(dto as any, 'user-1');
      expect(result.status).toBe('paired');
      expect(events.emit).toHaveBeenCalledWith('sensor.paired', expect.any(Object));
    });

    it('should reject duplicate serial number', async () => {
      sensorRepo.findOne.mockResolvedValue({ id: 'existing' });
      await expect(service.pairSensor({ serialNumber: 'SN-GAS-001' } as any, 'user-1')).rejects.toThrow(ConflictException);
    });
  });

  describe('ingestReadings', () => {
    it('should ingest bulk readings and check thresholds', async () => {
      sensorRepo.findOne.mockResolvedValue({ id: 's-1', alertsEnabled: true, alertThresholdHigh: 100, criticalThresholdHigh: 200, sensorType: 'gas_leak' });
      readingRepo.save.mockResolvedValue([{ id: 'r-1' }]);
      const result = await service.ingestReadings({ svgDeviceId: 'dev-1', readings: [{ sensorId: 's-1', sensorType: 'gas_leak', timestamp: new Date().toISOString(), value: 50, unit: 'ppm' }] } as any);
      expect(result.ingested).toBe(1);
    });

    it('should generate critical alert for HAZMAT threshold breach', async () => {
      sensorRepo.findOne.mockResolvedValue({ id: 's-1', alertsEnabled: true, criticalThresholdHigh: 200, alertThresholdHigh: 100, sensorType: 'gas_leak', criticalThresholdLow: null, alertThresholdLow: null });
      alertRepo.save.mockResolvedValue({ id: 'alert-1', severity: 'critical' });
      readingRepo.save.mockResolvedValue([{}]);
      const result = await service.ingestReadings({ svgDeviceId: 'dev-1', readings: [{ sensorId: 's-1', sensorType: 'gas_leak', timestamp: new Date().toISOString(), value: 250, unit: 'ppm' }] } as any);
      expect(result.alertsGenerated).toBe(1);
      expect(events.emit).toHaveBeenCalledWith('sensor.hazmat.emergency', expect.any(Object));
    });
  });

  describe('calibrateSensor', () => {
    it('should update calibration and set status to active', async () => {
      sensorRepo.findOne.mockResolvedValue({ id: 's-1', status: 'calibrating' });
      const result = await service.calibrateSensor('s-1', { calibrationOffset: -2.5 } as any, 'user-1');
      expect(result.calibrationOffset).toBe(-2.5);
      expect(result.status).toBe('active');
    });
  });

  describe('acknowledgeAlert', () => {
    it('should acknowledge alert and record time', async () => {
      alertRepo.findOne.mockResolvedValue({ id: 'alert-1', status: 'active', createdAt: new Date(Date.now() - 30000) });
      const result = await service.acknowledgeAlert('alert-1', 'user-1', {});
      expect(result.status).toBe('acknowledged');
      expect(result.acknowledgedBy).toBe('user-1');
    });
  });

  describe('resolveAlert', () => {
    it('should resolve with root cause', async () => {
      alertRepo.findOne.mockResolvedValue({ id: 'alert-1', status: 'acknowledged', createdAt: new Date(Date.now() - 60000) });
      const result = await service.resolveAlert('alert-1', 'user-1', { resolutionNotes: 'Replaced sensor', rootCause: 'Sensor drift' });
      expect(result.status).toBe('resolved');
      expect(result.rootCause).toBe('Sensor drift');
    });
  });

  describe('getFleetSensorHealth', () => {
    it('should return fleet-wide sensor metrics', async () => {
      const result = await service.getFleetSensorHealth();
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('active');
      expect(result).toHaveProperty('activeAlerts');
      expect(result).toHaveProperty('byType');
      expect(result).toHaveProperty('byProtocol');
    });
  });
});
