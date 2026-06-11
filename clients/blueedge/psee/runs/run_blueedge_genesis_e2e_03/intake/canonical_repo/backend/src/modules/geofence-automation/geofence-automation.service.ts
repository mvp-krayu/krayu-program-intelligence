import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class GeofenceAutomationService extends BaseCrudService<GeofenceRule> {
  constructor(
    @InjectRepository(GeofenceRule) repo: Repository<GeofenceRule>,
    @InjectRepository(GeofenceTrigger) private triggerRepo: Repository<GeofenceTrigger>,
    @InjectRepository(GeofenceZone) private zoneRepo: Repository<GeofenceZone>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      totalZones: 42, activeRules: 67, triggersToday: 18, unresolvedTriggers: 5,
      zonesByType: { depot: 6, customer: 18, restricted: 4, hazmat: 3, school: 5, speed_zone: 4, border: 2 },
      triggersByType: { enter: 45, exit: 38, dwell: 12, speed: 28, unauthorized: 3, after_hours: 8, hazmat_zone: 5 },
      recentTriggers: [
        { id: 'trig-001', vehiclePlate: 'DXB-7291', zone: 'JAFZA HAZMAT Zone', type: 'enter', time: new Date(Date.now() - 300000), status: 'triggered', actionsExecuted: ['SMS to safety officer', 'Speed limit enforced: 30km/h'] },
        { id: 'trig-002', vehiclePlate: 'BUS-1103', zone: 'Al Barsha School Zone', type: 'speed', time: new Date(Date.now() - 600000), status: 'acknowledged', actionsExecuted: ['Alert to dispatcher', 'Driver notification'] },
        { id: 'trig-003', vehiclePlate: 'TAXI-2201', zone: 'Airport Terminal 3', type: 'dwell', time: new Date(Date.now() - 900000), status: 'resolved', actionsExecuted: ['Dwell alert at 15min', 'Dispatcher notified'] },
      ],
      automationStats: { rulesProcessed: 1240, actionsExecuted: 892, falseAlarms: 12, avgResponseTimeMs: 340 },
      heatmapData: [
        { lat: 25.2532, lng: 55.3657, intensity: 0.9, zone: 'Dubai Airport' },
        { lat: 25.0657, lng: 55.1712, intensity: 0.7, zone: 'Jebel Ali Port' },
        { lat: 25.1972, lng: 55.2744, intensity: 0.6, zone: 'Business Bay' },
      ],
    });
  }

  async getZones() {
    return success([
      { id: 'zone-001', name: 'Jebel Ali Free Zone (JAFZA)', zoneType: 'hazmat', centerLat: 25.0068, centerLng: 55.0831, radiusMeters: 2500, activeRules: 5, vehiclesInside: 3, enabled: true },
      { id: 'zone-002', name: 'Al Barsha School Zone', zoneType: 'school', centerLat: 25.1118, centerLng: 55.2012, radiusMeters: 500, activeRules: 2, vehiclesInside: 1, enabled: true },
      { id: 'zone-003', name: 'Dubai International Airport', zoneType: 'restricted', centerLat: 25.2532, centerLng: 55.3657, radiusMeters: 3000, activeRules: 4, vehiclesInside: 5, enabled: true },
      { id: 'zone-004', name: 'ENOC Fuel Depot - Jebel Ali', zoneType: 'depot', centerLat: 25.0194, centerLng: 55.1068, radiusMeters: 800, activeRules: 3, vehiclesInside: 2, enabled: true },
      { id: 'zone-005', name: 'Sheikh Zayed Rd Speed Zone', zoneType: 'speed_zone', centerLat: 25.1538, centerLng: 55.2175, radiusMeters: null, activeRules: 2, vehiclesInside: 8, enabled: true, geometry: { type: 'Polygon', coordinates: [[[55.19, 25.14], [55.24, 25.14], [55.24, 25.17], [55.19, 25.17], [55.19, 25.14]]] } },
      { id: 'zone-006', name: 'Hatta Border Crossing', zoneType: 'border', centerLat: 24.7928, centerLng: 56.1082, radiusMeters: 1000, activeRules: 3, vehiclesInside: 0, enabled: true },
      { id: 'zone-007', name: 'Mall of the Emirates - Customer', zoneType: 'customer', centerLat: 25.1181, centerLng: 55.2006, radiusMeters: 300, activeRules: 2, vehiclesInside: 1, enabled: true },
    ]);
  }

  async getRules(zoneId?: string) {
    const rules = [
      { id: 'rule-001', name: 'HAZMAT Zone Entry Alert', geofenceId: 'zone-001', triggerType: 'enter', conditions: { vehicleTypes: ['tanker'], requiresHazmatPermit: true }, actions: [{ type: 'alert', target: 'safety_officer', channel: 'sms' }, { type: 'speed_limit', maxSpeed: 30 }, { type: 'log', category: 'hazmat_compliance' }], cooldownSeconds: 600, enabled: true, triggerCount: 142 },
      { id: 'rule-002', name: 'School Zone Speed Enforcement', geofenceId: 'zone-002', triggerType: 'speed', conditions: { maxSpeed: 40, activeHours: '06:30-14:30', activeDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'] }, actions: [{ type: 'alert', target: 'dispatcher', channel: 'push' }, { type: 'driver_notification', message: 'تنبيه: منطقة مدرسية — الحد 40 كم/ساعة' }, { type: 'score_penalty', points: -5 }], cooldownSeconds: 300, enabled: true, triggerCount: 28 },
      { id: 'rule-003', name: 'Airport Dwell Time Alert', geofenceId: 'zone-003', triggerType: 'dwell', conditions: { maxDwellMinutes: 15, vehicleTypes: ['taxi'] }, actions: [{ type: 'alert', target: 'dispatcher', channel: 'push' }, { type: 'escalate', afterMinutes: 30, target: 'fleet_manager' }], cooldownSeconds: 900, enabled: true, triggerCount: 67 },
      { id: 'rule-004', name: 'After-Hours Depot Access', geofenceId: 'zone-004', triggerType: 'after_hours', conditions: { restrictedHours: '22:00-06:00' }, actions: [{ type: 'alert', target: 'security', channel: 'sms' }, { type: 'alert', target: 'fleet_manager', channel: 'email' }, { type: 'log', category: 'security' }], cooldownSeconds: 0, enabled: true, triggerCount: 8 },
      { id: 'rule-005', name: 'Sheikh Zayed Speed Camera Zone', geofenceId: 'zone-005', triggerType: 'speed', conditions: { maxSpeed: 120, warningAtSpeed: 110 }, actions: [{ type: 'driver_notification', message: 'تحذير: منطقة رادار — الحد الأقصى 120 كم/ساعة' }, { type: 'log', category: 'speed_compliance' }], cooldownSeconds: 60, enabled: true, triggerCount: 312 },
      { id: 'rule-006', name: 'Border Crossing Documentation', geofenceId: 'zone-006', triggerType: 'enter', conditions: { vehicleTypes: ['tanker', 'bus'] }, actions: [{ type: 'alert', target: 'compliance_officer', channel: 'push' }, { type: 'checklist', items: ['Cross-border permit', 'Cargo manifest', 'Driver documents'] }, { type: 'log', category: 'cross_border' }], cooldownSeconds: 0, enabled: true, triggerCount: 45 },
    ];
    const filtered = zoneId ? rules.filter(r => r.geofenceId === zoneId) : rules;
    return success(filtered);
  }

  async getRecentTriggers(limit: number = 20) {
    return success([
      { id: 'trig-001', ruleId: 'rule-001', ruleName: 'HAZMAT Zone Entry Alert', vehicleId: 'V001', plateNumber: 'DXB-7291', driverName: 'أحمد محمد', zone: 'JAFZA HAZMAT Zone', triggerType: 'enter', latitude: 25.0072, longitude: 55.0835, actionsExecuted: ['SMS sent to safety officer', 'Speed limited to 30km/h'], status: 'triggered', triggeredAt: new Date(Date.now() - 300000) },
      { id: 'trig-002', ruleId: 'rule-002', ruleName: 'School Zone Speed', vehicleId: 'V022', plateNumber: 'BUS-1103', driverName: 'خالد عبدالله', zone: 'Al Barsha School Zone', triggerType: 'speed', triggerData: { speed: 52, limit: 40 }, latitude: 25.1120, longitude: 55.2015, actionsExecuted: ['Push alert to dispatcher', 'Driver notification sent', 'Score penalty: -5'], status: 'acknowledged', triggeredAt: new Date(Date.now() - 600000) },
      { id: 'trig-003', ruleId: 'rule-003', ruleName: 'Airport Dwell Time', vehicleId: 'V045', plateNumber: 'TAXI-2201', driverName: 'راشد سعيد', zone: 'DXB Airport T3', triggerType: 'dwell', triggerData: { dwellMinutes: 18 }, latitude: 25.2535, longitude: 55.3660, actionsExecuted: ['Push alert to dispatcher'], status: 'resolved', triggeredAt: new Date(Date.now() - 900000) },
    ]);
  }

  async createZone(body: any) {
    return success({ id: `zone-${Date.now()}`, ...body, activeRules: 0, enabled: true, createdAt: new Date() });
  }

  async createRule(body: any) {
    return success({ id: `rule-${Date.now()}`, ...body, triggerCount: 0, enabled: true, createdAt: new Date() });
  }

  async testRule(ruleId: string, body: any) {
    return success({
      ruleId, testVehicleId: body.vehicleId, wouldTrigger: true,
      matchedConditions: ['Vehicle type: tanker ✓', 'Has HAZMAT permit ✓', 'Inside zone boundary ✓'],
      actionsWouldExecute: ['SMS to safety officer', 'Speed limit: 30km/h', 'Compliance log entry'],
      message: 'Rule would trigger for this vehicle at this location',
    });
  }
}

// ─── Controller ───────────────────────────────────────────────
