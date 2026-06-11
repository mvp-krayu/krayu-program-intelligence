import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  FleetEvents,
  FleetEventName,
  BaseFleetEvent,
  VehicleEvent,
  VehiclePositionEvent,
  AlertEvent,
  TripEvent,
  SafetyEventPayload,
  GeofenceEvent,
  ColdChainEvent,
  DiagnosticEvent,
  MaintenanceEvent,
} from './types/fleet-events';
import { randomUUID } from 'crypto';

@Injectable()
export class FleetEventEmitter {
  private readonly logger = new Logger(FleetEventEmitter.name);
  private eventCount = 0;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  // ──────── Generic Emit ────────

  emit(eventName: FleetEventName, payload: Omit<BaseFleetEvent, 'event' | 'timestamp'> & Record<string, any>): void {
    const event = {
      ...payload,
      event: eventName,
      timestamp: new Date().toISOString(),
      correlationId: payload.correlationId || randomUUID(),
    };
    this.eventEmitter.emit(eventName, event);
    this.eventCount++;
    this.logger.debug(`Event emitted: ${eventName} [${event.correlationId}]`);
  }

  // ──────── Vehicle Events ────────

  vehicleCreated(vehicleId: string, fleetType: 'tanker' | 'bus' | 'taxi', data: Record<string, any>, userId?: string) {
    this.emit(FleetEvents.VEHICLE_CREATED, { source: 'vehicles', vehicleId, fleetType, data, userId } as any);
  }

  vehicleUpdated(vehicleId: string, fleetType: 'tanker' | 'bus' | 'taxi', data: Record<string, any>, userId?: string) {
    this.emit(FleetEvents.VEHICLE_UPDATED, { source: 'vehicles', vehicleId, fleetType, data, userId } as any);
  }

  vehiclePositionUpdated(vehicleId: string, fleetType: 'tanker' | 'bus' | 'taxi', position: VehiclePositionEvent['position']) {
    this.emit(FleetEvents.VEHICLE_POSITION_UPDATED, { source: 'telemetry', vehicleId, fleetType, position } as any);
  }

  vehicleStatusChanged(vehicleId: string, fleetType: 'tanker' | 'bus' | 'taxi', oldStatus: string, newStatus: string) {
    this.emit(FleetEvents.VEHICLE_STATUS_CHANGED, { source: 'vehicles', vehicleId, fleetType, data: { oldStatus, newStatus } } as any);
  }

  // ──────── Alert Events ────────

  alertCreated(alert: Omit<AlertEvent, 'event' | 'timestamp' | 'source'>) {
    this.emit(FleetEvents.ALERT_CREATED, { ...alert, source: 'alerts' } as any);
  }

  alertAcknowledged(alertId: string, userId: string) {
    this.emit(FleetEvents.ALERT_ACKNOWLEDGED, { source: 'alerts', alertId, userId } as any);
  }

  alertEscalated(alertId: string, severity: string, reason: string) {
    this.emit(FleetEvents.ALERT_ESCALATED, { source: 'alerts', alertId, severity, message: reason } as any);
  }

  // ──────── Trip Events ────────

  tripStarted(tripId: string, vehicleId: string, driverId?: string) {
    this.emit(FleetEvents.TRIP_STARTED, { source: 'trips', tripId, vehicleId, driverId, status: 'in_progress' } as any);
  }

  tripCompleted(tripId: string, vehicleId: string, driverId?: string, data?: Record<string, any>) {
    this.emit(FleetEvents.TRIP_COMPLETED, { source: 'trips', tripId, vehicleId, driverId, status: 'completed', data } as any);
  }

  tripDelayed(tripId: string, vehicleId: string, reason: string) {
    this.emit(FleetEvents.TRIP_DELAYED, { source: 'trips', tripId, vehicleId, status: 'delayed', data: { reason } } as any);
  }

  // ──────── Safety Events ────────

  safetyEventDetected(payload: Omit<SafetyEventPayload, 'event' | 'timestamp' | 'source'>) {
    this.emit(FleetEvents.SAFETY_EVENT_DETECTED, { ...payload, source: 'safety' } as any);
  }

  // ──────── Geofence Events ────────

  geofenceTriggered(action: 'entered' | 'exited' | 'dwell', vehicleId: string, geofenceId: string, geofenceName: string, position: { lat: number; lng: number }) {
    const eventName = action === 'entered' ? FleetEvents.GEOFENCE_ENTERED
      : action === 'exited' ? FleetEvents.GEOFENCE_EXITED
      : FleetEvents.GEOFENCE_DWELL;
    this.emit(eventName, { source: 'operations', vehicleId, geofenceId, geofenceName, action, position } as any);
  }

  // ──────── Cold Chain Events ────────

  coldChainBreach(shipmentId: string, vehicleId: string, temperatureC: number, zone: string) {
    this.emit(FleetEvents.COLDCHAIN_TEMP_BREACH, { source: 'coldchain', shipmentId, vehicleId, temperatureC, zone, status: 'breach' } as any);
  }

  // ──────── Diagnostics Events ────────

  dtcDetected(vehicleId: string, dtcCode: string, severity: string, description: string) {
    this.emit(FleetEvents.DTC_DETECTED, { source: 'diagnostics', vehicleId, dtcCode, severity, description } as any);
  }

  predictiveFailure(vehicleId: string, component: string, probability: number, estimatedDays: number) {
    this.emit(FleetEvents.PREDICTIVE_FAILURE, { source: 'diagnostics', vehicleId, dtcCode: 'PRED', severity: probability > 0.8 ? 'critical' : 'high', description: `${component} failure predicted (${Math.round(probability * 100)}% in ${estimatedDays}d)` } as any);
  }

  // ──────── Maintenance Events ────────

  workOrderCreated(workOrderId: string, vehicleId: string, type: string, priority: string) {
    this.emit(FleetEvents.WORK_ORDER_CREATED, { source: 'maintenance', workOrderId, vehicleId, type, priority } as any);
  }

  maintenanceDue(vehicleId: string, type: string, dueDate: string) {
    this.emit(FleetEvents.MAINTENANCE_DUE, { source: 'maintenance', workOrderId: '', vehicleId, type, priority: 'medium' } as any);
  }

  // ──────── System Events ────────

  deviceConnected(deviceId: string, vehicleId?: string) {
    this.emit(FleetEvents.DEVICE_CONNECTED, { source: 'devices', deviceId, vehicleId, status: 'connected' } as any);
  }

  deviceDisconnected(deviceId: string, vehicleId?: string) {
    this.emit(FleetEvents.DEVICE_DISCONNECTED, { source: 'devices', deviceId, vehicleId, status: 'disconnected' } as any);
  }

  // ──────── Stats ────────

  getEventCount(): number { return this.eventCount; }
}
