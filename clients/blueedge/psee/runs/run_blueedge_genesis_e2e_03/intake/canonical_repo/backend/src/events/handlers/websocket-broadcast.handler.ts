import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FleetGateway } from '../../gateways/fleet.gateway';
import { FleetEvents, AlertEvent, VehiclePositionEvent, TripEvent, SafetyEventPayload, GeofenceEvent, ColdChainEvent, DiagnosticEvent, DriverSessionEvent } from '../types/fleet-events';

@Injectable()
export class WebSocketBroadcastHandler {
  private readonly logger = new Logger(WebSocketBroadcastHandler.name);

  constructor(private readonly gateway: FleetGateway) {}

  // ──────── Driver Session → Session-Block Events ────────
  @OnEvent(FleetEvents.DRIVER_SESSION_STARTED)
  handleDriverSessionStarted(event: DriverSessionEvent) {
    const payload = {
      sessionId: event.sessionId,
      blockNumber: event.blockNumber,
      vehicleId: event.vehicleId,
      driverId: event.driverId,
      driverName: event.driverName,
      authMethod: event.authMethod,
      svgDeviceId: event.svgDeviceId,
      startTime: event.startTime,
      timestamp: event.timestamp,
    };
    // Broadcast to vehicle subscribers
    this.gateway.emitVehicleUpdate(event.vehicleId, 'driver:session:started', payload);
    // Broadcast to fleet-wide session subscribers
    this.gateway.server?.to('sessions:all').emit('driver:session:started', payload);
    // Also emit as medium alert for fleet managers
    this.gateway.emitAlert({
      id: `session-start-${event.sessionId}`,
      vehicleId: event.vehicleId,
      type: 'driver_session_started',
      severity: 'low',
      message: `${event.driverName} started session on ${event.vehicleId} via ${event.authMethod}`,
      timestamp: event.timestamp,
      metadata: { sessionId: event.sessionId, blockNumber: event.blockNumber, driverId: event.driverId },
    });
    this.logger.log(`Session started: block #${event.blockNumber} — ${event.driverName} on ${event.vehicleId}`);
  }

  @OnEvent(FleetEvents.DRIVER_SESSION_CLOSED)
  handleDriverSessionClosed(event: DriverSessionEvent) {
    const payload = {
      sessionId: event.sessionId,
      blockNumber: event.blockNumber,
      vehicleId: event.vehicleId,
      driverId: event.driverId,
      driverName: event.driverName,
      startTime: event.startTime,
      endTime: event.endTime,
      durationMinutes: event.durationMinutes,
      distanceKm: event.distanceKm,
      fuelConsumedL: event.fuelConsumedL,
      wearIndex: event.wearIndex,
      healthDelta: event.healthDelta,
      tpmSigned: event.tpmSigned,
      blockHash: event.blockHash,
      timestamp: event.timestamp,
    };
    this.gateway.emitVehicleUpdate(event.vehicleId, 'driver:session:closed', payload);
    this.gateway.server?.to('sessions:all').emit('driver:session:closed', payload);
    // Alert if high wear
    const severity = (event.wearIndex ?? 0) > 0.7 ? 'high' : (event.wearIndex ?? 0) > 0.5 ? 'medium' : 'low';
    this.gateway.emitAlert({
      id: `session-close-${event.sessionId}`,
      vehicleId: event.vehicleId,
      type: 'driver_session_closed',
      severity: severity as any,
      message: `${event.driverName} ended session: ${event.distanceKm?.toFixed(0)}km, wear ${((event.wearIndex ?? 0) * 100).toFixed(0)}%`,
      timestamp: event.timestamp,
      metadata: { sessionId: event.sessionId, wearIndex: event.wearIndex, durationMinutes: event.durationMinutes },
    });
    this.logger.log(`Session closed: block #${event.blockNumber} — wear ${event.wearIndex?.toFixed(3)} — TPM: ${event.tpmSigned}`);
  }

  @OnEvent(FleetEvents.DRIVER_SESSION_INTERRUPTED)
  handleDriverSessionInterrupted(event: DriverSessionEvent) {
    const payload = {
      sessionId: event.sessionId,
      blockNumber: event.blockNumber,
      vehicleId: event.vehicleId,
      driverId: event.driverId,
      driverName: event.driverName,
      startTime: event.startTime,
      endTime: event.endTime,
      timestamp: event.timestamp,
    };
    this.gateway.emitVehicleUpdate(event.vehicleId, 'driver:session:interrupted', payload);
    this.gateway.server?.to('sessions:all').emit('driver:session:interrupted', payload);
    this.gateway.emitAlert({
      id: `session-interrupt-${event.sessionId}`,
      vehicleId: event.vehicleId,
      type: 'driver_session_interrupted',
      severity: 'medium',
      message: `Session interrupted: ${event.driverName} on ${event.vehicleId}`,
      timestamp: event.timestamp,
      metadata: { sessionId: event.sessionId, blockNumber: event.blockNumber },
    });
    this.logger.warn(`Session interrupted: block #${event.blockNumber} — ${event.vehicleId}`);
  }

  @OnEvent(FleetEvents.DRIVER_SESSION_DWVS_COMPUTED)
  handleDwvsComputed(event: DriverSessionEvent) {
    const payload = {
      vehicleId: event.vehicleId,
      driverId: event.driverId,
      driverName: event.driverName,
      dwvs: event.dwvs,
      timestamp: event.timestamp,
    };
    this.gateway.emitVehicleUpdate(event.vehicleId, 'driver:dwvs:computed', payload);
    this.gateway.server?.to('sessions:all').emit('driver:dwvs:computed', payload);
    this.logger.log(`DWVS computed: ${event.driverName} on ${event.vehicleId} = ${event.dwvs?.toFixed(4)}`);
  }

  // ──────── Vehicle Position → Live Map ────────
  @OnEvent(FleetEvents.VEHICLE_POSITION_UPDATED)
  handlePositionUpdate(event: VehiclePositionEvent) {
    this.gateway.emitVehicleUpdate(event.vehicleId, 'vehicle:position', {
      vehicleId: event.vehicleId,
      ...event.position,
      fleetType: event.fleetType,
      timestamp: event.timestamp,
    });
  }

  // ──────── Alerts → All alert subscribers ────────
  @OnEvent(FleetEvents.ALERT_CREATED)
  handleAlertCreated(event: AlertEvent) {
    this.gateway.emitAlert({
      id: event.alertId,
      vehicleId: event.vehicleId || '',
      type: event.type,
      severity: event.severity as any,
      message: event.message,
      timestamp: event.timestamp,
      metadata: event.metadata,
    });
    this.logger.log(`Alert broadcast: ${event.severity} — ${event.type}`);
  }

  @OnEvent(FleetEvents.ALERT_ESCALATED)
  handleAlertEscalated(event: AlertEvent) {
    this.gateway.emitAlert({
      id: event.alertId,
      vehicleId: event.vehicleId || '',
      type: 'escalation',
      severity: event.severity as any,
      message: `ESCALATED: ${event.message}`,
      timestamp: event.timestamp,
    });
  }

  // ──────── Trip Status → Dashboard ────────
  @OnEvent(FleetEvents.TRIP_STARTED)
  handleTripStarted(event: TripEvent) {
    this.gateway.emitVehicleUpdate(event.vehicleId, 'trip:started', {
      tripId: event.tripId,
      vehicleId: event.vehicleId,
      driverId: event.driverId,
      timestamp: event.timestamp,
    });
  }

  @OnEvent(FleetEvents.TRIP_COMPLETED)
  handleTripCompleted(event: TripEvent) {
    this.gateway.emitVehicleUpdate(event.vehicleId, 'trip:completed', {
      tripId: event.tripId,
      vehicleId: event.vehicleId,
      data: event.data,
      timestamp: event.timestamp,
    });
  }

  @OnEvent(FleetEvents.TRIP_DELAYED)
  handleTripDelayed(event: TripEvent) {
    this.gateway.emitVehicleUpdate(event.vehicleId, 'trip:delayed', {
      tripId: event.tripId,
      vehicleId: event.vehicleId,
      reason: event.data?.reason,
      timestamp: event.timestamp,
    });
  }

  // ──────── Safety Events → Critical Push ────────
  @OnEvent(FleetEvents.SAFETY_EVENT_DETECTED)
  handleSafetyEvent(event: SafetyEventPayload) {
    const wsPayload = {
      safetyEventId: event.safetyEventId,
      vehicleId: event.vehicleId,
      driverId: event.driverId,
      eventType: event.eventType,
      severity: event.severity,
      location: event.location,
      timestamp: event.timestamp,
    };
    // Broadcast to vehicle subscribers
    this.gateway.emitVehicleUpdate(event.vehicleId, 'safety:event', wsPayload);
    // Also broadcast as alert for critical/high
    if (event.severity === 'critical' || event.severity === 'high') {
      this.gateway.emitAlert({
        id: event.safetyEventId,
        vehicleId: event.vehicleId,
        type: `safety:${event.eventType}`,
        severity: event.severity,
        message: `Safety event: ${event.eventType} on ${event.vehicleId}`,
        timestamp: event.timestamp,
      });
    }
    this.logger.log(`Safety event broadcast: ${event.severity} ${event.eventType} on ${event.vehicleId}`);
  }

  // ──────── Geofence → Operations ────────
  @OnEvent(FleetEvents.GEOFENCE_ENTERED)
  @OnEvent(FleetEvents.GEOFENCE_EXITED)
  handleGeofenceEvent(event: GeofenceEvent) {
    this.gateway.emitVehicleUpdate(event.vehicleId, `geofence:${event.action}`, {
      vehicleId: event.vehicleId,
      geofenceId: event.geofenceId,
      geofenceName: event.geofenceName,
      action: event.action,
      position: event.position,
      timestamp: event.timestamp,
    });
  }

  // ──────── Cold Chain Breach → Urgent ────────
  @OnEvent(FleetEvents.COLDCHAIN_TEMP_BREACH)
  handleColdChainBreach(event: ColdChainEvent) {
    this.gateway.emitVehicleUpdate(event.vehicleId, 'coldchain:breach', {
      shipmentId: event.shipmentId,
      vehicleId: event.vehicleId,
      temperatureC: event.temperatureC,
      zone: event.zone,
      timestamp: event.timestamp,
    });
    // Also as critical alert
    this.gateway.emitAlert({
      id: `cc-${event.shipmentId}`,
      vehicleId: event.vehicleId,
      type: 'coldchain:temp_breach',
      severity: 'critical',
      message: `Temperature breach: ${event.temperatureC}°C in zone ${event.zone}`,
      timestamp: event.timestamp,
    });
  }

  // ──────── DTC → Maintenance Alert ────────
  @OnEvent(FleetEvents.DTC_DETECTED)
  handleDtcDetected(event: DiagnosticEvent) {
    this.gateway.emitVehicleUpdate(event.vehicleId, 'diagnostics:dtc', {
      vehicleId: event.vehicleId,
      dtcCode: event.dtcCode,
      severity: event.severity,
      description: event.description,
      timestamp: event.timestamp,
    });
  }

  @OnEvent(FleetEvents.PREDICTIVE_FAILURE)
  handlePredictiveFailure(event: DiagnosticEvent) {
    this.gateway.emitVehicleUpdate(event.vehicleId, 'diagnostics:predictive', {
      vehicleId: event.vehicleId,
      description: event.description,
      severity: event.severity,
      timestamp: event.timestamp,
    });
  }

  // ──────── Vehicle Status Changes → Dashboard ────────
  @OnEvent(FleetEvents.VEHICLE_STATUS_CHANGED)
  handleVehicleStatusChange(event: any) {
    this.gateway.emitVehicleUpdate(event.vehicleId, 'vehicle:status', {
      vehicleId: event.vehicleId,
      oldStatus: event.data?.oldStatus,
      newStatus: event.data?.newStatus,
      timestamp: event.timestamp,
    });
  }

  // ──────── Device Connect/Disconnect ────────
  @OnEvent(FleetEvents.DEVICE_CONNECTED)
  @OnEvent(FleetEvents.DEVICE_DISCONNECTED)
  handleDeviceEvent(event: any) {
    if (event.vehicleId) {
      this.gateway.emitVehicleUpdate(event.vehicleId, `device:${event.status}`, {
        deviceId: event.deviceId,
        vehicleId: event.vehicleId,
        status: event.status,
        timestamp: event.timestamp,
      });
    }
  }
}
