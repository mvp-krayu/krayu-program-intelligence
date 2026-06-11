import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FleetEvents } from '../types/fleet-events';

interface NotificationPayload {
  type: 'alert' | 'info' | 'warning' | 'success' | 'system';
  title: string;
  message: string;
  userId?: string;
  broadcastToRole?: string[];
  data?: Record<string, any>;
}

@Injectable()
export class NotificationHandler {
  private readonly logger = new Logger(NotificationHandler.name);
  private pendingNotifications: NotificationPayload[] = [];

  // ──────── Critical Safety → All fleet managers + admins ────────

  @OnEvent(FleetEvents.SAFETY_EVENT_DETECTED)
  handleCriticalSafety(event: any) {
    if (event.severity === 'critical' || event.severity === 'high') {
      this.enqueue({
        type: 'alert',
        title: `Safety: ${event.eventType}`,
        message: `${event.severity.toUpperCase()} safety event on vehicle ${event.vehicleId}`,
        broadcastToRole: ['admin', 'fleet_manager', 'dispatcher'],
        data: { vehicleId: event.vehicleId, eventType: event.eventType, severity: event.severity },
      });
    }
  }

  // ──────── Compliance Expiring → Fleet managers ────────

  @OnEvent(FleetEvents.COMPLIANCE_EXPIRING)
  handleComplianceExpiring(event: any) {
    this.enqueue({
      type: 'warning',
      title: 'Compliance Expiring',
      message: `${event.type} for ${event.vehicleId || event.driverId} expires on ${event.dueDate}`,
      broadcastToRole: ['admin', 'fleet_manager'],
      data: { recordId: event.recordId, type: event.type, dueDate: event.dueDate },
    });
  }

  @OnEvent(FleetEvents.COMPLIANCE_VIOLATION)
  handleComplianceViolation(event: any) {
    this.enqueue({
      type: 'alert',
      title: 'Compliance Violation',
      message: `${event.type} violation detected for ${event.vehicleId || event.driverId}`,
      broadcastToRole: ['admin', 'fleet_manager'],
      data: event,
    });
  }

  // ──────── Maintenance Due → Fleet managers ────────

  @OnEvent(FleetEvents.MAINTENANCE_DUE)
  handleMaintenanceDue(event: any) {
    this.enqueue({
      type: 'info',
      title: 'Maintenance Due',
      message: `${event.type} maintenance due for vehicle ${event.vehicleId}`,
      broadcastToRole: ['admin', 'fleet_manager'],
    });
  }

  @OnEvent(FleetEvents.MAINTENANCE_OVERDUE)
  handleMaintenanceOverdue(event: any) {
    this.enqueue({
      type: 'warning',
      title: 'Maintenance OVERDUE',
      message: `Overdue: ${event.type} maintenance for vehicle ${event.vehicleId}`,
      broadcastToRole: ['admin', 'fleet_manager'],
    });
  }

  // ──────── Cold Chain Breach → All ops staff ────────

  @OnEvent(FleetEvents.COLDCHAIN_TEMP_BREACH)
  handleColdChainBreach(event: any) {
    this.enqueue({
      type: 'alert',
      title: 'Cold Chain Breach',
      message: `Temperature ${event.temperatureC}°C in zone ${event.zone} on vehicle ${event.vehicleId}`,
      broadcastToRole: ['admin', 'fleet_manager', 'dispatcher'],
      data: event,
    });
  }

  // ──────── Tanker Emergency → All staff ────────

  @OnEvent(FleetEvents.GAS_LEAK_DETECTED)
  handleGasLeak(event: any) {
    this.enqueue({
      type: 'alert',
      title: '⚠️ GAS LEAK DETECTED',
      message: `Emergency: Gas leak detected on vehicle ${event.vehicleId}`,
      broadcastToRole: ['admin', 'fleet_manager', 'dispatcher', 'driver'],
      data: event,
    });
  }

  // ──────── OTA Updates ────────

  @OnEvent(FleetEvents.OTA_UPDATE_FAILED)
  handleOtaFailed(event: any) {
    this.enqueue({
      type: 'warning',
      title: 'OTA Update Failed',
      message: `Update ${event.packageName} failed on device ${event.deviceId}`,
      broadcastToRole: ['admin', 'fleet_manager'],
      data: event,
    });
  }

  // ──────── Finance Budget ────────

  @OnEvent(FleetEvents.BUDGET_THRESHOLD_EXCEEDED)
  handleBudgetExceeded(event: any) {
    this.enqueue({
      type: 'warning',
      title: 'Budget Threshold Exceeded',
      message: `${event.category} spending exceeded threshold: ${event.amount} ${event.currency}`,
      broadcastToRole: ['admin', 'fleet_manager'],
      data: event,
    });
  }

  // ──────── Trip Completion → Success ────────

  @OnEvent(FleetEvents.TRIP_COMPLETED)
  handleTripCompleted(event: any) {
    this.enqueue({
      type: 'success',
      title: 'Trip Completed',
      message: `Trip ${event.tripId} completed for vehicle ${event.vehicleId}`,
      broadcastToRole: ['fleet_manager', 'dispatcher'],
    });
  }

  // ──────── Queue Management ────────

  private enqueue(notification: NotificationPayload) {
    this.pendingNotifications.push(notification);
    this.logger.debug(`Notification queued: [${notification.type}] ${notification.title}`);
    // In production: persist to notifications table + push via WebSocket
  }

  getPendingCount(): number { return this.pendingNotifications.length; }
  drainPending(): NotificationPayload[] { return this.pendingNotifications.splice(0); }
}
