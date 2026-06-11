import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { CacheService } from '../../common/cache';
import { FleetEvents } from '../types/fleet-events';

@Injectable()
export class CacheInvalidationHandler {
  private readonly logger = new Logger(CacheInvalidationHandler.name);

  constructor(private readonly cacheService: CacheService) {}

  // ── Vehicle changes → invalidate vehicle cache ──
  @OnEvent(FleetEvents.VEHICLE_CREATED)
  @OnEvent(FleetEvents.VEHICLE_UPDATED)
  @OnEvent(FleetEvents.VEHICLE_DECOMMISSIONED)
  @OnEvent(FleetEvents.VEHICLE_STATUS_CHANGED)
  async handleVehicleChange(event: any) {
    await this.cacheService.invalidateByPrefix('vehicles', 'http:vehicles');
    if (event.vehicleId) {
      await this.cacheService.invalidateEntity('vehicle', event.vehicleId);
    }
    this.logger.debug(`Cache invalidated: vehicles (${event.event})`);
  }

  // ── Driver changes ──
  @OnEvent(FleetEvents.DRIVER_CREATED)
  @OnEvent(FleetEvents.DRIVER_UPDATED)
  @OnEvent(FleetEvents.DRIVER_ASSIGNED)
  @OnEvent(FleetEvents.DRIVER_UNASSIGNED)
  async handleDriverChange(event: any) {
    await this.cacheService.invalidateByPrefix('drivers', 'http:drivers');
    this.logger.debug(`Cache invalidated: drivers (${event.event})`);
  }

  // ── Trip changes ──
  @OnEvent(FleetEvents.TRIP_CREATED)
  @OnEvent(FleetEvents.TRIP_STARTED)
  @OnEvent(FleetEvents.TRIP_COMPLETED)
  @OnEvent(FleetEvents.TRIP_CANCELLED)
  async handleTripChange(event: any) {
    await this.cacheService.invalidateByPrefix('trips', 'http:trips');
    this.logger.debug(`Cache invalidated: trips (${event.event})`);
  }

  // ── Alert changes ──
  @OnEvent(FleetEvents.ALERT_CREATED)
  @OnEvent(FleetEvents.ALERT_ACKNOWLEDGED)
  @OnEvent(FleetEvents.ALERT_RESOLVED)
  async handleAlertChange(event: any) {
    await this.cacheService.invalidateByPrefix('alerts', 'http:alerts');
  }

  // ── Maintenance changes ──
  @OnEvent(FleetEvents.WORK_ORDER_CREATED)
  @OnEvent(FleetEvents.WORK_ORDER_COMPLETED)
  async handleMaintenanceChange() {
    await this.cacheService.invalidateByPrefix('maintenance', 'http:maintenance');
  }

  // ── Safety events → refresh safety dashboard ──
  @OnEvent(FleetEvents.SAFETY_EVENT_DETECTED)
  @OnEvent(FleetEvents.SAFETY_SCORE_UPDATED)
  async handleSafetyChange() {
    await this.cacheService.invalidateByPrefix('safety', 'http:safety');
  }

  // ── Compliance changes ──
  @OnEvent(FleetEvents.COMPLIANCE_VIOLATION)
  @OnEvent(FleetEvents.COMPLIANCE_RENEWED)
  async handleComplianceChange() {
    await this.cacheService.invalidateByPrefix('compliance', 'http:compliance');
  }

  // ── Analytics → refresh on any significant data change ──
  @OnEvent(FleetEvents.TRIP_COMPLETED)
  @OnEvent(FleetEvents.FUEL_TRANSACTION)
  @OnEvent(FleetEvents.FINANCE_TRANSACTION_CREATED)
  async handleAnalyticsInvalidation() {
    await this.cacheService.invalidateByPrefix('analytics', 'http:analytics', 'http:reports');
  }
}
