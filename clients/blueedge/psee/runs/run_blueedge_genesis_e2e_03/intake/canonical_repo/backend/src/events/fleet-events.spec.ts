// ══════════════════════════════════════════════════════════════
// Event System — Comprehensive Unit Tests
// ══════════════════════════════════════════════════════════════
import { CacheInvalidationHandler } from './handlers/cache-invalidation.handler';
import { AuditLogHandler } from './handlers/audit-log.handler';
import { NotificationHandler } from './handlers/notification.handler';
import { WebSocketBroadcastHandler } from './handlers/websocket-broadcast.handler';
import { createMockCacheService, createMockGateway, buildVehicleEvent, buildAlertEvent, buildSafetyEvent, buildPositionEvent, mockUuid, mockDateString } from '../test/test-utils';

// ═══════════════════════════════════════════════════════════
// Cache Invalidation Handler
// ═══════════════════════════════════════════════════════════
describe('CacheInvalidationHandler', () => {
  let handler: CacheInvalidationHandler;
  let mockCache: ReturnType<typeof createMockCacheService>;

  beforeEach(() => {
    mockCache = createMockCacheService();
    handler = new CacheInvalidationHandler(mockCache as any);
  });

  it('should be defined', () => { expect(handler).toBeDefined(); });

  it('invalidates vehicle cache on VEHICLE_CREATED', async () => {
    await handler.handleVehicleChange(buildVehicleEvent('fleet.vehicle.created'));
    expect(mockCache.invalidateByPrefix).toHaveBeenCalledWith('vehicles', 'http:vehicles');
  });

  it('invalidates entity cache when vehicleId present', async () => {
    await handler.handleVehicleChange(buildVehicleEvent('fleet.vehicle.updated', { vehicleId: mockUuid }));
    expect(mockCache.invalidateEntity).toHaveBeenCalledWith('vehicle', mockUuid);
  });

  it('invalidates driver cache on driver events', async () => {
    await handler.handleDriverChange({ event: 'fleet.driver.created', timestamp: mockDateString });
    expect(mockCache.invalidateByPrefix).toHaveBeenCalledWith('drivers', 'http:drivers');
  });

  it('invalidates trip cache on trip events', async () => {
    await handler.handleTripChange({ event: 'fleet.trip.completed', timestamp: mockDateString });
    expect(mockCache.invalidateByPrefix).toHaveBeenCalledWith('trips', 'http:trips');
  });

  it('invalidates alert cache on alert events', async () => {
    await handler.handleAlertChange(buildAlertEvent());
    expect(mockCache.invalidateByPrefix).toHaveBeenCalledWith('alerts', 'http:alerts');
  });

  it('invalidates maintenance cache on work order events', async () => {
    await handler.handleMaintenanceChange();
    expect(mockCache.invalidateByPrefix).toHaveBeenCalledWith('maintenance', 'http:maintenance');
  });

  it('invalidates safety cache on safety events', async () => {
    await handler.handleSafetyChange();
    expect(mockCache.invalidateByPrefix).toHaveBeenCalledWith('safety', 'http:safety');
  });

  it('invalidates compliance cache on compliance events', async () => {
    await handler.handleComplianceChange();
    expect(mockCache.invalidateByPrefix).toHaveBeenCalledWith('compliance', 'http:compliance');
  });

  it('invalidates analytics and reports on data changes', async () => {
    await handler.handleAnalyticsInvalidation();
    expect(mockCache.invalidateByPrefix).toHaveBeenCalledWith('analytics', 'http:analytics', 'http:reports');
  });
});

// ═══════════════════════════════════════════════════════════
// Audit Log Handler
// ═══════════════════════════════════════════════════════════
describe('AuditLogHandler', () => {
  let handler: AuditLogHandler;

  beforeEach(() => { handler = new AuditLogHandler(); });
  afterEach(() => { handler.onModuleDestroy(); });

  it('should be defined', () => { expect(handler).toBeDefined(); });

  it('buffers vehicle events', () => {
    handler.handleVehicleEvent(buildVehicleEvent('fleet.vehicle.created'));
    expect(handler.getBufferSize()).toBe(1);
  });

  it('buffers multiple events', () => {
    handler.handleVehicleEvent(buildVehicleEvent('fleet.vehicle.created'));
    handler.handleTripEvent({ event: 'fleet.trip.started', timestamp: mockDateString, tripId: 'trip-001', vehicleId: mockUuid, driverId: 'driver-001', status: 'started' });
    expect(handler.getBufferSize()).toBe(2);
  });

  it('logs safety events immediately (not buffered)', () => {
    const initialSize = handler.getBufferSize();
    handler.handleSafetyEvent(buildSafetyEvent());
    // Safety events are logged immediately, not buffered
    expect(handler.getBufferSize()).toBe(initialSize);
  });

  it('logs gas leak events immediately', () => {
    const initialSize = handler.getBufferSize();
    handler.handleGasLeak({ event: 'fleet.tanker.gas_leak', timestamp: mockDateString, vehicleId: mockUuid });
    expect(handler.getBufferSize()).toBe(initialSize);
  });

  it('logs compliance violations immediately', () => {
    const initialSize = handler.getBufferSize();
    handler.handleComplianceViolation({ event: 'fleet.compliance.violation', timestamp: mockDateString, recordId: 'comp-001', vehicleId: mockUuid, type: 'speeding' });
    expect(handler.getBufferSize()).toBe(initialSize);
  });

  it('handles alert events', () => {
    handler.handleAlertEvent(buildAlertEvent());
    expect(handler.getBufferSize()).toBeGreaterThan(0);
  });

  it('handles OTA events', () => {
    handler.handleOtaEvent({ event: 'fleet.ota.completed', timestamp: mockDateString, updateId: 'ota-001', deviceId: 'dev-001', status: 'completed', packageName: 'fw-v3' });
    expect(handler.getBufferSize()).toBeGreaterThan(0);
  });

  it('handles finance events', () => {
    handler.handleFinanceEvent({ event: 'fleet.finance.transaction_created', timestamp: mockDateString, transactionId: 'fin-001', category: 'fuel', amount: 756, currency: 'AED' });
    expect(handler.getBufferSize()).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════
// Notification Handler
// ═══════════════════════════════════════════════════════════
describe('NotificationHandler', () => {
  let handler: NotificationHandler;

  beforeEach(() => { handler = new NotificationHandler(); });

  it('should be defined', () => { expect(handler).toBeDefined(); });

  it('creates notification for critical safety event', () => {
    handler.handleCriticalSafety(buildSafetyEvent({ severity: 'critical' }));
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for high severity safety event', () => {
    handler.handleCriticalSafety(buildSafetyEvent({ severity: 'high' }));
    expect(handler.getPendingCount()).toBe(1);
  });

  it('skips notification for low severity safety event', () => {
    handler.handleCriticalSafety(buildSafetyEvent({ severity: 'low' }));
    expect(handler.getPendingCount()).toBe(0);
  });

  it('creates notification for compliance expiring', () => {
    handler.handleComplianceExpiring({ type: 'insurance', vehicleId: mockUuid, dueDate: '2026-03-01' });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for compliance violation', () => {
    handler.handleComplianceViolation({ type: 'speeding', vehicleId: mockUuid });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for maintenance due', () => {
    handler.handleMaintenanceDue({ type: 'oil_change', vehicleId: mockUuid });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for overdue maintenance', () => {
    handler.handleMaintenanceOverdue({ type: 'brake_service', vehicleId: mockUuid });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for cold chain breach', () => {
    handler.handleColdChainBreach({ temperatureC: -8, zone: 'cargo', vehicleId: mockUuid });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for gas leak', () => {
    handler.handleGasLeak({ vehicleId: mockUuid });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for OTA failure', () => {
    handler.handleOtaFailed({ packageName: 'fw-v3', deviceId: 'dev-001' });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for budget exceeded', () => {
    handler.handleBudgetExceeded({ category: 'fuel', amount: 300000, currency: 'AED' });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('creates notification for trip completed', () => {
    handler.handleTripCompleted({ tripId: 'trip-001', vehicleId: mockUuid });
    expect(handler.getPendingCount()).toBe(1);
  });

  it('drainPending clears and returns all notifications', () => {
    handler.handleGasLeak({ vehicleId: mockUuid });
    handler.handleMaintenanceDue({ type: 'oil_change', vehicleId: mockUuid });
    const drained = handler.drainPending();
    expect(drained).toHaveLength(2);
    expect(handler.getPendingCount()).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════
// WebSocket Broadcast Handler
// ═══════════════════════════════════════════════════════════
describe('WebSocketBroadcastHandler', () => {
  let handler: WebSocketBroadcastHandler;
  let mockGw: ReturnType<typeof createMockGateway>;

  beforeEach(() => {
    mockGw = createMockGateway();
    handler = new WebSocketBroadcastHandler(mockGw as any);
  });

  it('should be defined', () => { expect(handler).toBeDefined(); });

  it('broadcasts vehicle position updates', () => {
    handler.handlePositionUpdate(buildPositionEvent());
    expect(mockGw.emitVehicleUpdate).toHaveBeenCalledWith(
      mockUuid, 'vehicle:position',
      expect.objectContaining({ vehicleId: mockUuid, latitude: 25.2048, longitude: 55.2708 })
    );
  });

  it('broadcasts alert created events', () => {
    handler.handleAlertCreated(buildAlertEvent());
    expect(mockGw.emitAlert).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'overspeed', severity: 'high' })
    );
  });

  it('broadcasts alert escalation events', () => {
    handler.handleAlertEscalated(buildAlertEvent({ event: 'fleet.alert.escalated' }));
    expect(mockGw.emitAlert).toHaveBeenCalled();
  });
});
