import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class ApiMarketplaceService extends BaseCrudService<ApiKey> {
  constructor(
    @InjectRepository(ApiKey) repo: Repository<ApiKey>,
    @InjectRepository(WebhookSubscription) private webhookRepo: Repository<WebhookSubscription>,
    @InjectRepository(WebhookDeliveryLog) private deliveryRepo: Repository<WebhookDeliveryLog>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      apiKeys: {
        total: 5, active: 4, expired: 1,
        totalRequestsToday: 12450,
        topConsumers: [
          { name: 'SAP Integration', keyPrefix: 'be_sap_', requestsToday: 8200, lastUsed: new Date(Date.now() - 60000) },
          { name: 'Customer Portal', keyPrefix: 'be_cust_', requestsToday: 3100, lastUsed: new Date(Date.now() - 120000) },
          { name: 'Mobile App', keyPrefix: 'be_mob_', requestsToday: 1150, lastUsed: new Date(Date.now() - 300000) },
        ],
      },
      webhooks: {
        total: 8, active: 7, failing: 1,
        deliveriesToday: 3420,
        deliveryRate: 98.5,
        avgLatencyMs: 234,
      },
      availableEvents: 73,
      apiVersion: 'v2.0',
      documentationUrl: '/api/docs',
    });
  }

  // ─── API Keys ──────────────────────────────────────────────
  async getApiKeys() {
    return success([
      { id: 'key-001', name: 'SAP Integration', keyPrefix: 'be_sap_****', scopes: ['vehicles:read', 'trips:read', 'maintenance:read', 'maintenance:write', 'fuel:read'], rateLimit: { requestsPerMinute: 120, requestsPerDay: 50000 }, allowedIps: ['10.0.1.100', '10.0.1.101'], active: true, requestCount: 284500, lastUsedAt: new Date(Date.now() - 60000), createdAt: new Date('2026-01-15'), expiresAt: new Date('2027-01-15') },
      { id: 'key-002', name: 'Customer Portal', keyPrefix: 'be_cust_****', scopes: ['trips:read', 'vehicles:read', 'tracking:read'], rateLimit: { requestsPerMinute: 60, requestsPerDay: 20000 }, allowedIps: [], active: true, requestCount: 98200, lastUsedAt: new Date(Date.now() - 120000), createdAt: new Date('2026-01-20') },
      { id: 'key-003', name: 'Mobile App', keyPrefix: 'be_mob_****', scopes: ['drivers:read', 'trips:read', 'trips:write', 'notifications:read'], rateLimit: { requestsPerMinute: 30, requestsPerDay: 10000 }, allowedIps: [], active: true, requestCount: 45600, lastUsedAt: new Date(Date.now() - 300000), createdAt: new Date('2026-02-01') },
      { id: 'key-004', name: 'Analytics Dashboard', keyPrefix: 'be_ana_****', scopes: ['analytics:read', 'reports:read', 'executive:read'], rateLimit: { requestsPerMinute: 30, requestsPerDay: 5000 }, allowedIps: ['192.168.1.0/24'], active: true, requestCount: 12300, lastUsedAt: new Date(Date.now() - 900000), createdAt: new Date('2026-02-05') },
      { id: 'key-005', name: 'Legacy System (Expired)', keyPrefix: 'be_leg_****', scopes: ['vehicles:read'], rateLimit: { requestsPerMinute: 10, requestsPerDay: 1000 }, allowedIps: [], active: false, requestCount: 5600, lastUsedAt: new Date('2026-01-30'), createdAt: new Date('2025-12-01'), expiresAt: new Date('2026-01-31') },
    ]);
  }

  async createApiKey(body: any) {
    const key = `be_${body.prefix || 'key'}_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
    return success({
      id: `key-${Date.now()}`,
      name: body.name,
      key, // Only returned once at creation
      keyPrefix: key.slice(0, 8) + '****',
      scopes: body.scopes || ['vehicles:read'],
      rateLimit: body.rateLimit || { requestsPerMinute: 30, requestsPerDay: 10000 },
      allowedIps: body.allowedIps || [],
      active: true,
      expiresAt: body.expiresAt || null,
      warning: '⚠️ Store this API key securely. It will not be shown again.',
      createdAt: new Date(),
    });
  }

  async rotateApiKey(keyId: string) {
    const newKey = `be_rot_${crypto.randomUUID().replace(/-/g, '').slice(0, 24)}`;
    return success({
      id: keyId,
      newKey,
      newKeyPrefix: newKey.slice(0, 8) + '****',
      oldKeyValidUntil: new Date(Date.now() + 3600000), // 1 hour grace period
      warning: '⚠️ Old key will remain valid for 1 hour for migration. Store the new key securely.',
      rotatedAt: new Date(),
    });
  }

  async getApiKeyUsage(keyId: string) {
    return success({
      keyId,
      period: '7d',
      totalRequests: 58400,
      byEndpoint: [
        { endpoint: 'GET /vehicles', count: 24500, avgLatencyMs: 45 },
        { endpoint: 'GET /trips', count: 18200, avgLatencyMs: 62 },
        { endpoint: 'GET /maintenance', count: 8900, avgLatencyMs: 38 },
        { endpoint: 'POST /maintenance/requests', count: 4200, avgLatencyMs: 120 },
        { endpoint: 'GET /fuel/transactions', count: 2600, avgLatencyMs: 55 },
      ],
      byDay: [
        { date: '2026-02-08', requests: 8200, errors: 12 },
        { date: '2026-02-09', requests: 7800, errors: 8 },
        { date: '2026-02-10', requests: 8500, errors: 15 },
        { date: '2026-02-11', requests: 9100, errors: 6 },
        { date: '2026-02-12', requests: 8400, errors: 10 },
        { date: '2026-02-13', requests: 8900, errors: 9 },
        { date: '2026-02-14', requests: 7500, errors: 4 },
      ],
      errorBreakdown: { '400': 28, '401': 3, '404': 18, '429': 12, '500': 3 },
    });
  }

  // ─── Webhooks ──────────────────────────────────────────────
  async getWebhooks() {
    return success([
      { id: 'wh-001', name: 'SAP Event Relay', url: 'https://sap.blueedge.ae/webhooks/fleet', events: ['trip.completed', 'maintenance.completed', 'fuel.transaction'], secret: '***masked***', status: 'active', deliveryCount: 12400, failureCount: 18, successRate: 99.86, lastDeliveredAt: new Date(Date.now() - 300000), filters: { fleetType: 'tanker' } },
      { id: 'wh-002', name: 'Customer Tracking', url: 'https://track.customer.ae/webhook', events: ['trip.started', 'trip.completed', 'vehicle.position_update'], secret: '***masked***', status: 'active', deliveryCount: 45200, failureCount: 230, successRate: 99.49, lastDeliveredAt: new Date(Date.now() - 60000), filters: {} },
      { id: 'wh-003', name: 'Safety Alert System', url: 'https://safety.blueedge.ae/alerts', events: ['alert.critical', 'safety.incident', 'driver.fatigue_detected', 'cargo.temperature_exceeded'], secret: '***masked***', status: 'active', deliveryCount: 890, failureCount: 2, successRate: 99.78, lastDeliveredAt: new Date(Date.now() - 7200000) },
      { id: 'wh-004', name: 'Slack Notifications', url: 'https://hooks.slack.com/services/T00/B00/xxx', events: ['alert.critical', 'vehicle.breakdown', 'compliance.violation'], secret: null, status: 'active', deliveryCount: 340, failureCount: 5, successRate: 98.53, lastDeliveredAt: new Date(Date.now() - 3600000) },
    ]);
  }

  async getAvailableEvents() {
    return success({
      categories: [
        { category: 'Vehicle', events: ['vehicle.created', 'vehicle.updated', 'vehicle.position_update', 'vehicle.speed_exceeded', 'vehicle.breakdown', 'vehicle.ignition_on', 'vehicle.ignition_off', 'vehicle.idle_started', 'vehicle.idle_ended'] },
        { category: 'Trip', events: ['trip.created', 'trip.started', 'trip.completed', 'trip.cancelled', 'trip.delayed', 'trip.route_deviation'] },
        { category: 'Driver', events: ['driver.score_updated', 'driver.score_dropped', 'driver.fatigue_detected', 'driver.shift_started', 'driver.shift_ended', 'driver.license_expiring'] },
        { category: 'Maintenance', events: ['maintenance.due_soon', 'maintenance.overdue', 'maintenance.completed', 'maintenance.parts_ordered', 'maintenance.predicted_failure'] },
        { category: 'Fuel', events: ['fuel.transaction', 'fuel.anomaly_detected', 'fuel.theft_suspected', 'fuel.low_level'] },
        { category: 'Safety', events: ['safety.incident', 'safety.harsh_braking', 'safety.harsh_acceleration', 'safety.harsh_cornering', 'safety.collision_detected'] },
        { category: 'Alert', events: ['alert.created', 'alert.critical', 'alert.acknowledged', 'alert.resolved'] },
        { category: 'Cargo', events: ['cargo.loaded', 'cargo.delivered', 'cargo.temperature_exceeded', 'cargo.pressure_anomaly', 'cargo.leak_detected'] },
        { category: 'Geofence', events: ['geofence.zone_entered', 'geofence.zone_exited', 'geofence.rule_triggered'] },
        { category: 'Compliance', events: ['compliance.violation', 'compliance.certificate_expiring', 'compliance.inspection_due'] },
        { category: 'AI/ML', events: ['ai.anomaly_detected', 'ai.prediction_updated', 'ai.coaching_generated', 'ai.maintenance_predicted'] },
      ],
      totalEvents: 73,
      webhookFormat: {
        contentType: 'application/json',
        signatureHeader: 'X-BlueEdge-Signature',
        signatureAlgorithm: 'HMAC-SHA256',
        retryPolicy: { maxRetries: 5, backoffMs: [1000, 5000, 30000, 120000, 600000] },
        examplePayload: {
          id: 'evt-123', event: 'trip.completed', timestamp: new Date().toISOString(),
          data: { tripId: 'trip-456', vehicleId: 'veh-789', driverId: 'drv-012', duration: 7200, distanceKm: 145 },
          metadata: { tenantId: 'tenant-001', fleetType: 'tanker', region: 'dubai' },
        },
      },
    });
  }

  async createWebhook(body: any) {
    return success({
      id: `wh-${Date.now()}`, ...body,
      secret: `whsec_${crypto.randomUUID().replace(/-/g, '')}`,
      status: 'active',
      deliveryCount: 0, failureCount: 0,
      createdAt: new Date(),
      warning: '⚠️ Store the webhook secret securely for signature verification.',
    });
  }

  async testWebhook(webhookId: string) {
    return success({
      webhookId,
      testResult: 'success',
      httpStatus: 200,
      responseTimeMs: 145,
      responseBody: '{"received": true}',
      testPayload: { id: 'test-evt', event: 'webhook.test', timestamp: new Date().toISOString(), data: { message: 'Test delivery from Blue Edge' } },
    });
  }

  async getWebhookDeliveries(webhookId: string) {
    return success([
      { id: 'del-001', event: 'trip.completed', httpStatus: 200, durationMs: 120, status: 'success', attemptNumber: 1, deliveredAt: new Date(Date.now() - 300000) },
      { id: 'del-002', event: 'fuel.transaction', httpStatus: 200, durationMs: 95, status: 'success', attemptNumber: 1, deliveredAt: new Date(Date.now() - 600000) },
      { id: 'del-003', event: 'alert.critical', httpStatus: 503, durationMs: 5000, status: 'retrying', attemptNumber: 2, deliveredAt: new Date(Date.now() - 900000), nextRetryAt: new Date(Date.now() + 30000) },
      { id: 'del-004', event: 'vehicle.position_update', httpStatus: 200, durationMs: 78, status: 'success', attemptNumber: 1, deliveredAt: new Date(Date.now() - 1200000) },
    ]);
  }

  // ─── Developer Portal ──────────────────────────────────────
  async getApiDocumentation() {
    return success({
      version: 'v2.0',
      baseUrl: 'https://api.blueedge.ae/v2',
      authentication: { type: 'Bearer Token / API Key', headerName: 'Authorization', format: 'Bearer <token> or X-API-Key: <key>' },
      rateLimits: { default: { perMinute: 60, perDay: 10000 }, authenticated: { perMinute: 120, perDay: 50000 }, premium: { perMinute: 300, perDay: 200000 } },
      endpoints: {
        total: 445,
        categories: [
          { name: 'Fleet Operations', endpoints: 85, prefix: '/vehicles, /drivers, /trips, /fleets' },
          { name: 'Fleet Types', endpoints: 65, prefix: '/tanker, /bus, /taxi' },
          { name: 'AI & Intelligence', endpoints: 57, prefix: '/predictive-maintenance, /driver-scoring, /anomaly-detection, /geofence-automation' },
          { name: 'Operations', endpoints: 48, prefix: '/alerts, /safety, /compliance, /permits' },
          { name: 'Business', endpoints: 55, prefix: '/finance, /billing, /analytics, /reports' },
          { name: 'Integration', endpoints: 45, prefix: '/integration/*' },
          { name: 'Platform', endpoints: 90, prefix: '/auth, /users, /notifications, /messaging' },
        ],
      },
      sdks: [
        { language: 'JavaScript/TypeScript', package: '@blueedge/fleet-sdk', version: '2.0.0' },
        { language: 'Python', package: 'blueedge-fleet', version: '2.0.0' },
        { language: 'Go', package: 'github.com/blueedge/fleet-go', version: 'v2.0.0' },
        { language: 'C#', package: 'BlueEdge.Fleet', version: '2.0.0' },
      ],
      sandboxUrl: 'https://sandbox.blueedge.ae',
      changelogUrl: '/api/docs/changelog',
    });
  }

  async getAvailableScopes() {
    return success([
      { scope: 'vehicles:read', description: 'Read vehicle data (position, status, telemetry)' },
      { scope: 'vehicles:write', description: 'Create/update vehicles' },
      { scope: 'drivers:read', description: 'Read driver profiles and scores' },
      { scope: 'drivers:write', description: 'Create/update driver profiles' },
      { scope: 'trips:read', description: 'Read trip data and history' },
      { scope: 'trips:write', description: 'Create/manage trips' },
      { scope: 'maintenance:read', description: 'Read maintenance schedules and history' },
      { scope: 'maintenance:write', description: 'Create work orders and service requests' },
      { scope: 'fuel:read', description: 'Read fuel transactions and analytics' },
      { scope: 'alerts:read', description: 'Read alerts and notifications' },
      { scope: 'alerts:write', description: 'Create/acknowledge alerts' },
      { scope: 'analytics:read', description: 'Access analytics and reports' },
      { scope: 'tracking:read', description: 'Real-time vehicle tracking' },
      { scope: 'notifications:read', description: 'Read notification history' },
      { scope: 'notifications:write', description: 'Send notifications' },
      { scope: 'admin', description: 'Full administrative access' },
    ]);
  }
}

// ─── Controller ───────────────────────────────────────────────
