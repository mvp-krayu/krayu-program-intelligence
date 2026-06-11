import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FleetEvents, BaseFleetEvent } from '../types/fleet-events';

interface AuditEntry {
  timestamp: string;
  event: string;
  source: string;
  correlationId?: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: string;
  severity: 'info' | 'warning' | 'critical';
  details: Record<string, any>;
}

@Injectable()
export class AuditLogHandler {
  private readonly logger = new Logger('AuditLog');
  private auditBuffer: AuditEntry[] = [];
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL = 30000; // 30s
  private flushTimer: NodeJS.Timeout;

  constructor() {
    // Periodic flush
    this.flushTimer = setInterval(() => this.flush(), this.FLUSH_INTERVAL);
  }

  // ──────── Critical Events (immediate log) ────────

  @OnEvent(FleetEvents.SAFETY_EVENT_DETECTED)
  handleSafetyEvent(event: any) {
    this.logImmediate({
      event: event.event,
      timestamp: event.timestamp,
      source: event.source,
      correlationId: event.correlationId,
      entityType: 'safety_event',
      entityId: event.safetyEventId,
      action: 'detected',
      severity: event.severity === 'critical' ? 'critical' : 'warning',
      details: { vehicleId: event.vehicleId, driverId: event.driverId, eventType: event.eventType },
    });
  }

  @OnEvent(FleetEvents.GAS_LEAK_DETECTED)
  handleGasLeak(event: any) {
    this.logImmediate({
      event: event.event,
      timestamp: event.timestamp,
      source: 'tanker',
      entityType: 'vehicle',
      entityId: event.vehicleId,
      action: 'gas_leak_detected',
      severity: 'critical',
      details: event,
    });
  }

  @OnEvent(FleetEvents.FUEL_THEFT_SUSPECTED)
  handleFuelTheft(event: any) {
    this.logImmediate({
      event: event.event,
      timestamp: event.timestamp,
      source: 'fuel',
      entityType: 'vehicle',
      entityId: event.vehicleId,
      action: 'fuel_theft_suspected',
      severity: 'critical',
      details: { volumeL: event.volumeL },
    });
  }

  @OnEvent(FleetEvents.COMPLIANCE_VIOLATION)
  handleComplianceViolation(event: any) {
    this.logImmediate({
      event: event.event,
      timestamp: event.timestamp,
      source: 'compliance',
      entityType: 'compliance_record',
      entityId: event.recordId,
      action: 'violation',
      severity: 'warning',
      details: { vehicleId: event.vehicleId, driverId: event.driverId, type: event.type },
    });
  }

  // ──────── Standard Events (buffered) ────────

  @OnEvent(FleetEvents.VEHICLE_CREATED)
  @OnEvent(FleetEvents.VEHICLE_UPDATED)
  @OnEvent(FleetEvents.VEHICLE_DECOMMISSIONED)
  handleVehicleEvent(event: any) {
    this.buffer({ event: event.event, timestamp: event.timestamp, source: 'vehicles', correlationId: event.correlationId, userId: event.userId, entityType: 'vehicle', entityId: event.vehicleId, action: event.event.split('.').pop(), severity: 'info', details: event.data || {} });
  }

  @OnEvent(FleetEvents.TRIP_STARTED)
  @OnEvent(FleetEvents.TRIP_COMPLETED)
  @OnEvent(FleetEvents.TRIP_CANCELLED)
  handleTripEvent(event: any) {
    this.buffer({ event: event.event, timestamp: event.timestamp, source: 'trips', entityType: 'trip', entityId: event.tripId, action: event.status, severity: 'info', details: { vehicleId: event.vehicleId, driverId: event.driverId } });
  }

  @OnEvent(FleetEvents.ALERT_CREATED)
  @OnEvent(FleetEvents.ALERT_ACKNOWLEDGED)
  @OnEvent(FleetEvents.ALERT_RESOLVED)
  handleAlertEvent(event: any) {
    this.buffer({ event: event.event, timestamp: event.timestamp, source: 'alerts', userId: event.userId, entityType: 'alert', entityId: event.alertId, action: event.event.split('.').pop(), severity: event.severity === 'critical' ? 'critical' : 'info', details: { vehicleId: event.vehicleId, type: event.type, message: event.message } });
  }

  @OnEvent(FleetEvents.WORK_ORDER_CREATED)
  @OnEvent(FleetEvents.WORK_ORDER_COMPLETED)
  handleMaintenanceEvent(event: any) {
    this.buffer({ event: event.event, timestamp: event.timestamp, source: 'maintenance', entityType: 'work_order', entityId: event.workOrderId, action: event.event.split('.').pop(), severity: 'info', details: { vehicleId: event.vehicleId, type: event.type, priority: event.priority } });
  }

  @OnEvent(FleetEvents.CUSTODY_TRANSFER)
  handleCustodyTransfer(event: any) {
    this.buffer({ event: event.event, timestamp: event.timestamp, source: 'tanker', entityType: 'custody_transfer', entityId: event.correlationId || 'unknown', action: 'transfer', severity: 'info', details: event });
  }

  @OnEvent(FleetEvents.FINANCE_TRANSACTION_CREATED)
  @OnEvent(FleetEvents.FINANCE_TRANSACTION_APPROVED)
  handleFinanceEvent(event: any) {
    this.buffer({ event: event.event, timestamp: event.timestamp, source: 'finance', userId: event.userId, entityType: 'finance_transaction', entityId: event.transactionId, action: event.event.split('.').pop(), severity: 'info', details: { category: event.category, amount: event.amount, currency: event.currency } });
  }

  @OnEvent(FleetEvents.OTA_UPDATE_STARTED)
  @OnEvent(FleetEvents.OTA_UPDATE_COMPLETED)
  @OnEvent(FleetEvents.OTA_UPDATE_FAILED)
  handleOtaEvent(event: any) {
    this.buffer({ event: event.event, timestamp: event.timestamp, source: 'ota', entityType: 'ota_update', entityId: event.updateId, action: event.status, severity: event.status === 'failed' ? 'warning' : 'info', details: { deviceId: event.deviceId, packageName: event.packageName } });
  }

  // ──────── Buffer Management ────────

  private buffer(entry: AuditEntry) {
    this.auditBuffer.push(entry);
    if (this.auditBuffer.length >= this.BUFFER_SIZE) this.flush();
  }

  private logImmediate(entry: AuditEntry) {
    const logLine = JSON.stringify({ audit: true, ...entry });
    if (entry.severity === 'critical') {
      this.logger.error(logLine);
    } else if (entry.severity === 'warning') {
      this.logger.warn(logLine);
    } else {
      this.logger.log(logLine);
    }
  }

  private flush() {
    if (this.auditBuffer.length === 0) return;
    const batch = this.auditBuffer.splice(0);
    // In production: write to audit_logs table or send to external audit service
    for (const entry of batch) {
      this.logger.log(JSON.stringify({ audit: true, ...entry }));
    }
    this.logger.debug(`Audit buffer flushed: ${batch.length} entries`);
  }

  getBufferSize(): number { return this.auditBuffer.length; }

  onModuleDestroy() {
    clearInterval(this.flushTimer);
    this.flush();
  }
}
