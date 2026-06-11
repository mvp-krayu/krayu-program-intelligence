// ──────────────────────────────────────────────────────────────
// Blue Edge Fleet Platform — Domain Event Types
// ──────────────────────────────────────────────────────────────

// ─── Event Name Constants ─────────────────────────────────────

export const FleetEvents = {
  // Vehicle lifecycle
  VEHICLE_CREATED: 'vehicle.created',
  VEHICLE_UPDATED: 'vehicle.updated',
  VEHICLE_DECOMMISSIONED: 'vehicle.decommissioned',
  VEHICLE_POSITION_UPDATED: 'vehicle.position.updated',
  VEHICLE_STATUS_CHANGED: 'vehicle.status.changed',

  // Telemetry
  TELEMETRY_RECEIVED: 'telemetry.received',
  TELEMETRY_ANOMALY: 'telemetry.anomaly',

  // Driver
  DRIVER_CREATED: 'driver.created',
  DRIVER_UPDATED: 'driver.updated',
  DRIVER_ASSIGNED: 'driver.assigned',
  DRIVER_UNASSIGNED: 'driver.unassigned',
  DRIVER_SCORE_CHANGED: 'driver.score.changed',

  // Driver Sessions (Patent-Pending Session-Block Architecture)
  DRIVER_SESSION_STARTED: 'driver.session.started',
  DRIVER_SESSION_CLOSED: 'driver.session.closed',
  DRIVER_SESSION_INTERRUPTED: 'driver.session.interrupted',
  DRIVER_SESSION_DWVS_COMPUTED: 'driver.session.dwvs.computed',

  // Trip
  TRIP_CREATED: 'trip.created',
  TRIP_STARTED: 'trip.started',
  TRIP_COMPLETED: 'trip.completed',
  TRIP_CANCELLED: 'trip.cancelled',
  TRIP_DELAYED: 'trip.delayed',
  TRIP_WAYPOINT_REACHED: 'trip.waypoint.reached',

  // Alert
  ALERT_CREATED: 'alert.created',
  ALERT_ACKNOWLEDGED: 'alert.acknowledged',
  ALERT_RESOLVED: 'alert.resolved',
  ALERT_ESCALATED: 'alert.escalated',

  // Safety
  SAFETY_EVENT_DETECTED: 'safety.event.detected',
  SAFETY_EVENT_REVIEWED: 'safety.event.reviewed',
  SAFETY_SCORE_UPDATED: 'safety.score.updated',

  // Maintenance
  WORK_ORDER_CREATED: 'maintenance.workorder.created',
  WORK_ORDER_COMPLETED: 'maintenance.workorder.completed',
  MAINTENANCE_DUE: 'maintenance.due',
  MAINTENANCE_OVERDUE: 'maintenance.overdue',

  // Fuel
  FUEL_TRANSACTION: 'fuel.transaction',
  FUEL_THEFT_SUSPECTED: 'fuel.theft.suspected',
  FUEL_LEVEL_LOW: 'fuel.level.low',

  // Tanker-specific
  CARGO_LOADED: 'tanker.cargo.loaded',
  CARGO_DELIVERED: 'tanker.cargo.delivered',
  CUSTODY_TRANSFER: 'tanker.custody.transfer',
  TANK_TEMP_BREACH: 'tanker.tank.temp.breach',
  TANK_PRESSURE_ALARM: 'tanker.tank.pressure.alarm',
  GAS_LEAK_DETECTED: 'tanker.gas.leak',

  // Cold Chain
  COLDCHAIN_TEMP_BREACH: 'coldchain.temp.breach',
  COLDCHAIN_SHIPMENT_LOADED: 'coldchain.shipment.loaded',
  COLDCHAIN_SHIPMENT_DELIVERED: 'coldchain.shipment.delivered',

  // EV
  EV_CHARGE_STARTED: 'ev.charge.started',
  EV_CHARGE_COMPLETED: 'ev.charge.completed',
  EV_BATTERY_LOW: 'ev.battery.low',
  EV_BATTERY_CRITICAL: 'ev.battery.critical',

  // V2G
  V2G_SESSION_STARTED: 'v2g.session.started',
  V2G_SESSION_COMPLETED: 'v2g.session.completed',
  V2G_GRID_SIGNAL: 'v2g.grid.signal',

  // OTA
  OTA_UPDATE_AVAILABLE: 'ota.update.available',
  OTA_UPDATE_STARTED: 'ota.update.started',
  OTA_UPDATE_COMPLETED: 'ota.update.completed',
  OTA_UPDATE_FAILED: 'ota.update.failed',

  // Geofence
  GEOFENCE_ENTERED: 'geofence.entered',
  GEOFENCE_EXITED: 'geofence.exited',
  GEOFENCE_DWELL: 'geofence.dwell',

  // Compliance
  COMPLIANCE_VIOLATION: 'compliance.violation',
  COMPLIANCE_EXPIRING: 'compliance.expiring',
  COMPLIANCE_RENEWED: 'compliance.renewed',

  // Diagnostics
  DTC_DETECTED: 'diagnostics.dtc.detected',
  DTC_CLEARED: 'diagnostics.dtc.cleared',
  PREDICTIVE_FAILURE: 'diagnostics.predictive.failure',

  // Finance
  FINANCE_TRANSACTION_CREATED: 'finance.transaction.created',
  FINANCE_TRANSACTION_APPROVED: 'finance.transaction.approved',
  BUDGET_THRESHOLD_EXCEEDED: 'finance.budget.exceeded',

  // System
  SYSTEM_HEALTH_CHECK: 'system.health.check',
  DEVICE_CONNECTED: 'system.device.connected',
  DEVICE_DISCONNECTED: 'system.device.disconnected',
} as const;

export type FleetEventName = typeof FleetEvents[keyof typeof FleetEvents];

// ─── Base Event Interface ─────────────────────────────────────

export interface BaseFleetEvent {
  /** Event name from FleetEvents constant */
  event: FleetEventName;
  /** ISO timestamp */
  timestamp: string;
  /** Source module that emitted the event */
  source: string;
  /** Correlation ID for tracing */
  correlationId?: string;
  /** User who triggered the action (null for system events) */
  userId?: string;
  /** Organization ID */
  orgId?: string;
}

// ─── Domain Event Payloads ────────────────────────────────────

export interface VehicleEvent extends BaseFleetEvent {
  vehicleId: string;
  fleetType: 'tanker' | 'bus' | 'taxi';
  data: Record<string, any>;
}

export interface VehiclePositionEvent extends BaseFleetEvent {
  vehicleId: string;
  fleetType: 'tanker' | 'bus' | 'taxi';
  position: {
    lat: number;
    lng: number;
    speed: number;
    heading: number;
    altitude?: number;
  };
}

export interface TelemetryEvent extends BaseFleetEvent {
  vehicleId: string;
  deviceId: string;
  readings: Record<string, any>;
}

export interface DriverEvent extends BaseFleetEvent {
  driverId: string;
  data: Record<string, any>;
}

export interface DriverSessionEvent extends BaseFleetEvent {
  sessionId: string;
  blockNumber: number;
  vehicleId: string;
  driverId: string;
  driverName: string;
  authMethod: 'faceid_nfc' | 'pin_rfid' | 'biometric' | 'manual';
  svgDeviceId?: string;
  status: 'active' | 'closed' | 'interrupted' | 'invalid';
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  distanceKm?: number;
  fuelConsumedL?: number;
  wearIndex?: number;
  healthDelta?: number;
  dwvs?: number;
  tpmSigned?: boolean;
  blockHash?: string;
}

export interface TripEvent extends BaseFleetEvent {
  tripId: string;
  vehicleId: string;
  driverId?: string;
  status: string;
  data?: Record<string, any>;
}

export interface AlertEvent extends BaseFleetEvent {
  alertId: string;
  vehicleId?: string;
  driverId?: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  type: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface SafetyEventPayload extends BaseFleetEvent {
  safetyEventId: string;
  vehicleId: string;
  driverId?: string;
  eventType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location?: { lat: number; lng: number };
}

export interface MaintenanceEvent extends BaseFleetEvent {
  workOrderId: string;
  vehicleId: string;
  type: string;
  priority: string;
}

export interface FuelEvent extends BaseFleetEvent {
  vehicleId: string;
  transactionId?: string;
  type: 'fill' | 'drain' | 'theft_suspected' | 'low_level';
  volumeL?: number;
}

export interface GeofenceEvent extends BaseFleetEvent {
  vehicleId: string;
  geofenceId: string;
  geofenceName: string;
  action: 'entered' | 'exited' | 'dwell';
  position: { lat: number; lng: number };
}

export interface ColdChainEvent extends BaseFleetEvent {
  shipmentId: string;
  vehicleId: string;
  temperatureC?: number;
  zone?: string;
  status: string;
}

export interface EvEvent extends BaseFleetEvent {
  vehicleId: string;
  stateOfChargePercent?: number;
  chargingStatus?: string;
  data?: Record<string, any>;
}

export interface OtaEvent extends BaseFleetEvent {
  updateId: string;
  deviceId: string;
  vehicleId?: string;
  packageName: string;
  status: string;
  progress?: number;
}

export interface ComplianceEvent extends BaseFleetEvent {
  recordId: string;
  vehicleId?: string;
  driverId?: string;
  type: string;
  status: string;
  dueDate?: string;
}

export interface DiagnosticEvent extends BaseFleetEvent {
  vehicleId: string;
  dtcCode: string;
  severity: string;
  description: string;
}

export interface FinanceEvent extends BaseFleetEvent {
  transactionId: string;
  category: string;
  amount: number;
  currency: string;
}

export interface SystemEvent extends BaseFleetEvent {
  deviceId?: string;
  status: string;
  details?: Record<string, any>;
}

// ─── Union type for all events ────────────────────────────────
export type FleetEventPayload =
  | VehicleEvent
  | VehiclePositionEvent
  | TelemetryEvent
  | DriverEvent
  | DriverSessionEvent
  | TripEvent
  | AlertEvent
  | SafetyEventPayload
  | MaintenanceEvent
  | FuelEvent
  | GeofenceEvent
  | ColdChainEvent
  | EvEvent
  | OtaEvent
  | ComplianceEvent
  | DiagnosticEvent
  | FinanceEvent
  | SystemEvent;
