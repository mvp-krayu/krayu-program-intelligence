import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';
import { CargoManifest } from './entities/cargo-manifest.entity';
import { CustodyTransfer } from './entities/custody-transfer.entity';
import { TankerProduct } from './entities/tanker-product.entity';
import { HazmatPermit } from './entities/hazmat-permit.entity';
import { HazmatRoute } from './entities/hazmat-route.entity';
import { TankerSafetyEvent } from './entities/tanker-safety-event.entity';

@Injectable()
export class CargoService extends BaseCrudService<CargoManifest> {
  constructor(@InjectRepository(CargoManifest) repo: Repository<CargoManifest>) { super(repo); }
  async getActive() { return success(await this.repo.find({ where: { status: 'in_transit' }, order: { createdAt: 'DESC' } })); }
  async getStats() { return success({ totalManifests: 856, inTransit: 42, delivered: 780, avgDeliveryTimeHrs: 4.2, totalVolumeL: 2450000, discrepancyRate: 0.3 }); }
}

@Injectable()
export class CustodyService extends BaseCrudService<CustodyTransfer> {
  constructor(@InjectRepository(CustodyTransfer) repo: Repository<CustodyTransfer>) { super(repo); }
  async getDisputed() { return success(await this.repo.find({ where: { status: 'disputed' } })); }
  async getActive() { return success({ active: [], todayCompleted: 5, todayVolume: 177400 }); }
  async advanceStep(id: string, step: string) { return success({ id, step, status: 'advanced', timestamp: new Date() }); }
}

// ── Tank Monitoring Service ──────────────────────────────────

@Injectable()
export class TankMonitoringService {
  getFleetStatus() {
    return success({
      activeTankers: 24, totalCapacityL: 840000, currentLoadL: 562800, loadPct: 67, activeAlerts: 3,
      vehicles: [
        { vehicleId: 'TK-2847', driver: 'Mohammed Al-Fahad', route: 'JAFZA → ENOC Al Quoz', product: 'Diesel/Jet A-1', loadPct: 67, tempC: 32.4, pressureKpa: 14.2, status: 'en_route', compartments: 6 },
        { vehicleId: 'TK-1923', driver: 'Khalid Mansour', route: 'ENOC Al Quoz', product: 'Gasoline 95', loadPct: 5, tempC: 28.1, pressureKpa: 8.5, status: 'unloaded', compartments: 4 },
        { vehicleId: 'TK-3012', driver: 'Fahad Saeed', route: 'ADNOC → DIP', product: 'Diesel EN 590', loadPct: 100, tempC: 30.8, pressureKpa: 12.1, status: 'en_route', compartments: 5 },
        { vehicleId: 'TK-4501', driver: 'Saeed Al-Ameri', route: 'Returning to depot', product: 'Jet A-1 (empty)', loadPct: 0, tempC: null, pressureKpa: 2.1, status: 'empty_return', compartments: 6 },
        { vehicleId: 'TK-1756', driver: 'Omar Bakhit', route: 'Fujairah → RAK', product: 'Kerosene', loadPct: 100, tempC: 29.5, pressureKpa: 11.8, status: 'en_route', compartments: 4 },
        { vehicleId: 'TK-5190', driver: 'Hassan Jaber', route: 'Abu Dhabi → Musaffah', product: 'Diesel EN 590', loadPct: 81, tempC: 31.2, pressureKpa: 13.4, status: 'en_route', compartments: 5 },
        { vehicleId: 'TK-3891', driver: 'Yousef Nasser', route: 'JAFZA T2 → SHJ', product: 'Gasoline 98', loadPct: 95, tempC: 27.3, pressureKpa: 15.8, status: 'en_route', compartments: 5 },
        { vehicleId: 'TK-2234', driver: 'Ali Rashid', route: 'Depot (maintenance)', product: '—', loadPct: 0, tempC: null, pressureKpa: null, status: 'maintenance', compartments: 6 },
      ],
    });
  }
  getVehicleCompartments(vehicleId: string) {
    return success({
      vehicleId, totalCapacityL: 34000, totalVolumeL: 22800, avgTempC: 32.4, avgPressureKpa: 14.2, avgDensityKgL: 0.832, vaporRecoveryPct: 98.7,
      compartments: [
        { id: 'C1', product: 'Diesel EN 590', levelPct: 85, volumeL: 5950, capacityL: 7000, tempC: 31.2, pressureKpa: 14.8, densityKgL: 0.834, status: 'normal' },
        { id: 'C2', product: 'Diesel EN 590', levelPct: 72, volumeL: 5040, capacityL: 7000, tempC: 32.1, pressureKpa: 13.9, densityKgL: 0.831, status: 'normal' },
        { id: 'C3', product: 'Jet A-1', levelPct: 91, volumeL: 5460, capacityL: 6000, tempC: 52.1, pressureKpa: 28.3, densityKgL: 0.798, status: 'critical' },
        { id: 'C4', product: 'Jet A-1', levelPct: 68, volumeL: 3400, capacityL: 5000, tempC: 33.8, pressureKpa: 12.1, densityKgL: 0.805, status: 'normal' },
        { id: 'C5', product: 'Diesel EN 590', levelPct: 45, volumeL: 2250, capacityL: 5000, tempC: 30.5, pressureKpa: 11.2, densityKgL: 0.836, status: 'warning' },
        { id: 'C6', product: 'Diesel EN 590', levelPct: 18, volumeL: 720, capacityL: 4000, tempC: 29.8, pressureKpa: 10.1, densityKgL: 0.838, status: 'warning' },
      ],
    });
  }
  getCompartmentHistory(vehicleId: string, compId: string) {
    const pts = Array.from({ length: 24 }, (_, h) => ({ time: `${String(h).padStart(2, '0')}:00`, levelPct: 60 + Math.random() * 30, tempC: 28 + Math.random() * 8, pressureKpa: 10 + Math.random() * 10 }));
    return success({ vehicleId, compartmentId: compId, points: pts });
  }
}

// ── Tanker Safety Service ────────────────────────────────────

@Injectable()
export class TankerSafetyService {
  getDashboard() {
    return success({
      safetyScore: 94.2, safetyScoreDelta: 1.8,
      events24h: { total: 7, critical: 2, high: 3, medium: 0, low: 2 },
      rollStability: 'ok', gasDetections24h: 0,
      systems: {
        rollPrevention: { status: 'normal', lateralG: 0.18, lateralGLimit: 0.35, rollAngleDeg: 2.4, rollAngleLimit: 12, speedLimiting: false, rscStatus: 'armed', events30d: 3 },
        leakDetection: { status: 'ok', sensorsOnline: 18, sensorsTotal: 18, topSeals: 'ok', bottomValves: 'ok', connections: 'ok', lastInspection: '2026-02-12', leakEvents90d: 0 },
        gasDetection: { status: 'clear', lelPct: 2, lelAlarmPct: 20, h2sPpm: 0.5, h2sAlarmPpm: 10, o2Pct: 20.8, autoShutdown: 'armed', calibrationDaysRemaining: 12 },
        emergency: { eStopStatus: 'ready', fireSuppression: 'standby', emergencyContacts: 5, lastEStopTest: '2026-02-10T14:30:00Z', ncemaCompliance: true },
      },
    });
  }
  getEvents() {
    return success([
      { id: 'se-001', vehicleId: 'TK-2847', eventType: 'high_temp', severity: 'critical', description: 'Compartment C3 at 52.1°C', isResolved: false, createdAt: '2026-02-14T08:41:00Z' },
      { id: 'se-002', vehicleId: 'TK-1923', eventType: 'harsh_braking', severity: 'high', description: 'Harsh braking 0.6g', isResolved: true, createdAt: '2026-02-14T07:15:00Z' },
      { id: 'se-003', vehicleId: 'TK-3012', eventType: 'speed_limit', severity: 'high', description: 'Speed limit exceeded 92 km/h in 80 zone', isResolved: true, createdAt: '2026-02-14T06:48:00Z' },
      { id: 'se-004', vehicleId: 'TK-4501', eventType: 'roll_warning', severity: 'high', description: 'Lateral 0.28g in turn', isResolved: true, createdAt: '2026-02-14T05:33:00Z' },
      { id: 'se-005', vehicleId: 'TK-1756', eventType: 'dms_alert', severity: 'critical', description: 'DMS drowsiness alert', isResolved: true, createdAt: '2026-02-14T04:12:00Z' },
    ]);
  }
  getIMUData(vehicleId: string) {
    return success({ vehicleId, lateral: { currentG: 0.18, maxG: 0.35 }, roll: { angleDeg: 2.4, maxDeg: 12 }, pitch: { angleDeg: 1.1, maxDeg: 15 }, yaw: { rateDegSec: 3.2, maxDegSec: 25 }, speed: { current: 72, limit: 80 } });
  }
  triggerEStop(vehicleId: string) {
    return success({ vehicleId, eStopTriggered: true, timestamp: new Date(), notifiedContacts: 5 });
  }
}

// ── HAZMAT Compliance Service ────────────────────────────────

@Injectable()
export class HazmatService {
  getDashboard() {
    return success({ compliancePct: 98, activePermits: 42, expiringPermits: 3, routeDeviations30d: 2, certifiedDrivers: 38, certExpiringSoon: 2 });
  }
  getPermits() {
    return success([
      { id: 'hp-001', permitNumber: 'NCEMA-2026-FL-0847', authority: 'NCEMA', type: 'transport', hazmatClasses: '3', issuedAt: '2026-01-01', expiresAt: '2026-12-31', status: 'valid', daysRemaining: 317 },
      { id: 'hp-002', permitNumber: 'DM-HZ-2026-1234', authority: 'Dubai Municipality', type: 'transport', hazmatClasses: '3,8', issuedAt: '2025-03-15', expiresAt: '2026-03-15', status: 'valid', daysRemaining: 27 },
      { id: 'hp-003', permitNumber: 'RTA-SP-2025-5678', authority: 'RTA Dubai', type: 'transport', hazmatClasses: '3', issuedAt: '2025-08-01', expiresAt: '2026-02-28', status: 'expiring', daysRemaining: 14 },
      { id: 'hp-004', permitNumber: 'ADDOT-HZ-2026-0199', authority: 'Abu Dhabi DOT', type: 'transport', hazmatClasses: '3,8', issuedAt: '2026-01-15', expiresAt: '2027-01-15', status: 'valid', daysRemaining: 341 },
    ]);
  }
  getRoutes() {
    return success([
      { id: 'hr-001', name: 'JAFZA → ENOC Al Quoz', hazmatClasses: '3', restrictions: 'No E311, No tunnels', status: 'active', deviationCount30d: 0 },
      { id: 'hr-002', name: 'ADNOC Jebel Ali → DXB T3', hazmatClasses: '3', restrictions: 'Night only (22:00-05:00)', status: 'active', lastDeviationAt: '2026-01-28', deviationCount30d: 1 },
      { id: 'hr-003', name: 'Fujairah → RAK Depot', hazmatClasses: '8', restrictions: 'No residential areas', status: 'active', deviationCount30d: 0 },
      { id: 'hr-004', name: 'Musaffah → Abu Dhabi Intl', hazmatClasses: '3', restrictions: 'E10 corridor only', status: 'active', lastDeviationAt: '2026-02-03', deviationCount30d: 1 },
    ]);
  }
}

// ── Product Registry Service ─────────────────────────────────

@Injectable()
export class ProductService {
  getProducts() {
    return success([
      { id: 'tp-001', name: 'Diesel EN 590', unNumber: 'UN 1202', hazmatClass: '3', flashPointC: 55, densityMin: 0.820, densityMax: 0.845, maxTempC: 45, compatibilityGroup: 'A,B,D', isActive: true },
      { id: 'tp-002', name: 'Jet A-1', unNumber: 'UN 1863', hazmatClass: '3', flashPointC: 38, densityMin: 0.775, densityMax: 0.840, maxTempC: 40, compatibilityGroup: 'A,D', isActive: true },
      { id: 'tp-003', name: 'Gasoline 95', unNumber: 'UN 1203', hazmatClass: '3', flashPointC: -43, densityMin: 0.720, densityMax: 0.775, maxTempC: 35, compatibilityGroup: 'C', isActive: true },
      { id: 'tp-004', name: 'Gasoline 98', unNumber: 'UN 1203', hazmatClass: '3', flashPointC: -43, densityMin: 0.720, densityMax: 0.775, maxTempC: 35, compatibilityGroup: 'C', isActive: true },
      { id: 'tp-005', name: 'Kerosene', unNumber: 'UN 1223', hazmatClass: '3', flashPointC: 37, densityMin: 0.780, densityMax: 0.830, maxTempC: 40, compatibilityGroup: 'A,B,D', isActive: true },
      { id: 'tp-006', name: 'LPG', unNumber: 'UN 1075', hazmatClass: '2.1', flashPointC: -104, densityMin: 0.500, densityMax: 0.580, maxTempC: 50, compatibilityGroup: 'dedicated', isActive: true },
      { id: 'tp-007', name: 'Sulfuric Acid', unNumber: 'UN 1830', hazmatClass: '8', flashPointC: null, densityMin: 1.840, densityMax: 1.840, maxTempC: 60, compatibilityGroup: 'dedicated', isActive: true },
      { id: 'tp-008', name: 'Base Oil SN150', unNumber: null, hazmatClass: null, flashPointC: 200, densityMin: 0.860, densityMax: 0.880, maxTempC: 50, compatibilityGroup: 'A,B,D', isActive: true },
    ]);
  }
  getCompatibility() {
    return success({
      products: ['Diesel EN 590', 'Jet A-1', 'Gasoline 95', 'Kerosene'],
      matrix: {
        'Diesel EN 590': { 'Diesel EN 590': 'ok', 'Jet A-1': 'caution', 'Gasoline 95': 'incompatible', 'Kerosene': 'ok' },
        'Jet A-1': { 'Diesel EN 590': 'caution', 'Jet A-1': 'ok', 'Gasoline 95': 'incompatible', 'Kerosene': 'ok' },
        'Gasoline 95': { 'Diesel EN 590': 'incompatible', 'Jet A-1': 'incompatible', 'Gasoline 95': 'ok', 'Kerosene': 'incompatible' },
        'Kerosene': { 'Diesel EN 590': 'ok', 'Jet A-1': 'ok', 'Gasoline 95': 'incompatible', 'Kerosene': 'ok' },
      },
    });
  }
}

// ── Inventory Service ────────────────────────────────────────

@Injectable()
export class InventoryService {
  getFleetInventory() {
    return success({
      totalInventoryL: 562800, dieselL: 285000, jetA1L: 168000, gasolineL: 72000, keroseneL: 30000, lossRateMtdPct: 0.06,
      vehicles: [
        { vehicleId: 'TK-2847', product: 'Diesel / Jet A-1', capacityL: 35000, currentL: 23450, loadPct: 67, tempC: 32.4, lastReconciled: '2026-02-14T08:00:00Z', variancePct: -0.02 },
        { vehicleId: 'TK-1923', product: 'Gasoline 95', capacityL: 30000, currentL: 1600, loadPct: 5, tempC: 28.1, lastReconciled: '2026-02-14T07:45:00Z', variancePct: -0.01 },
        { vehicleId: 'TK-3012', product: 'Diesel EN 590', capacityL: 35000, currentL: 35000, loadPct: 100, tempC: 30.8, lastReconciled: '2026-02-14T07:22:00Z', variancePct: 0.00 },
        { vehicleId: 'TK-4501', product: 'Jet A-1', capacityL: 42000, currentL: 0, loadPct: 0, tempC: null, lastReconciled: '2026-02-14T06:55:00Z', variancePct: -0.04 },
        { vehicleId: 'TK-1756', product: 'Kerosene', capacityL: 30000, currentL: 30000, loadPct: 100, tempC: 29.5, lastReconciled: '2026-02-14T06:30:00Z', variancePct: 0.00 },
        { vehicleId: 'TK-5190', product: 'Diesel EN 590', capacityL: 35000, currentL: 28200, loadPct: 81, tempC: 31.2, lastReconciled: '2026-02-13T18:00:00Z', variancePct: -0.08 },
      ],
    });
  }
  getLossTracking() {
    return success({
      period: '30d', totalLossL: 1250, totalTransferredL: 2100000, lossPct: 0.06,
      byCategory: { evaporation: 680, measurement: 320, spillage: 150, unaccounted: 100 },
      trend: [{ date: '2026-01-15', lossPct: 0.09 }, { date: '2026-01-22', lossPct: 0.08 }, { date: '2026-01-29', lossPct: 0.07 }, { date: '2026-02-05', lossPct: 0.06 }, { date: '2026-02-12', lossPct: 0.06 }],
    });
  }
}
