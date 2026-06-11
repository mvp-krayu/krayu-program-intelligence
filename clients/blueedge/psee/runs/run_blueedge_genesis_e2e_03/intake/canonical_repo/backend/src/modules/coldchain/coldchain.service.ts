import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class ColdchainService extends BaseCrudService<ColdchainShipment> {
  constructor(@InjectRepository(ColdchainShipment) repo: Repository<ColdchainShipment>) { super(repo); }

  async getDashboard() {
    return success({
      activeShipments: 12,
      inRange: 10,
      warnings: 1,
      breaches: 1,
      avgTempDeviation: 0.3,
      complianceRate: 98.5,
      zones: [
        { id: 'z1', name: 'Frozen (-18°C)', shipments: 4, status: 'ok' },
        { id: 'z2', name: 'Chilled (2-8°C)', shipments: 5, status: 'ok' },
        { id: 'z3', name: 'Ambient (15-25°C)', shipments: 3, status: 'warning' },
      ],
    });
  }

  async getTemperatureHistory(shipmentId: string, query: any) {
    return success({
      shipmentId,
      readings: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        zones: [
          { zoneId: 'z1', tempC: -18.2 + Math.random() * 0.5, status: 'in_range' },
          { zoneId: 'z2', tempC: 4.5 + Math.random() * 1.0, status: 'in_range' },
        ],
      })),
    });
  }

  async getBreachReport(query: any) {
    return success({
      totalBreaches: 3,
      breaches: [
        { id: 'b1', shipmentId: 'cs-001', vehicleId: 'v-005', zone: 'Chilled', maxTempC: 12.3, thresholdC: 8.0, durationMin: 23, timestamp: new Date(Date.now() - 86400000), resolved: true },
        { id: 'b2', shipmentId: 'cs-003', vehicleId: 'v-008', zone: 'Frozen', maxTempC: -12.1, thresholdC: -15.0, durationMin: 45, timestamp: new Date(Date.now() - 43200000), resolved: false },
      ],
      avgResolutionMinutes: 18,
    });
  }

  async getComplianceStatus() {
    return success({
      overallScore: 97.2,
      standards: [
        { name: 'HACCP', status: 'compliant', lastAudit: '2026-01-15' },
        { name: 'GDP (Pharma)', status: 'compliant', lastAudit: '2026-01-20' },
        { name: 'UAE ESMA', status: 'compliant', lastAudit: '2026-02-01' },
      ],
      expiringCerts: 2,
      pendingActions: 1,
    });
  }

  async getSensorHealth() {
    return success({
      totalSensors: 48,
      online: 45,
      offline: 2,
      calibrationDue: 3,
      sensors: [
        { id: 's1', type: 'temperature', location: 'Zone 1 Top', status: 'online', lastReading: -18.1, batteryPercent: 87 },
        { id: 's2', type: 'temperature', location: 'Zone 1 Bottom', status: 'online', lastReading: -18.3, batteryPercent: 92 },
        { id: 's3', type: 'humidity', location: 'Zone 2', status: 'offline', lastReading: null, batteryPercent: 5 },
      ],
    });
  }

  async setAlertThreshold(body: any) {
    return success({ ...body, id: 'threshold-001', createdAt: new Date(), status: 'active' });
  }
}

// ─── Controller ───────────────────────────────────────────────
