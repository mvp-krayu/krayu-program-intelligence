import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class NotificationProvidersService extends BaseCrudService<NotificationProvider> {
  constructor(
    @InjectRepository(NotificationProvider) repo: Repository<NotificationProvider>,
    @InjectRepository(NotificationRule) private ruleRepo: Repository<NotificationRule>,
    @InjectRepository(NotificationLog) private logRepo: Repository<NotificationLog>,
  ) { super(repo); }

  async getProvidersDashboard() {
    return success({
      providers: [
        { id: 'prov-001', name: 'Twilio WhatsApp', type: 'whatsapp', provider: 'twilio', status: 'connected', phoneNumber: '+971-4-XXX-XXXX', businessName: 'Blue Edge Fleet', tier: 'Standard', dailyLimit: 1000, dailyUsed: 142, uptime: 99.97, latencyMs: 120, errorRate: 0.3, monthlyCostAed: 435.20 },
        { id: 'prov-002', name: 'Twilio SMS', type: 'sms', provider: 'twilio', status: 'connected', phoneNumber: '+971-4-XXX-XXXX', dailyLimit: 5000, dailyUsed: 67, uptime: 99.99, latencyMs: 85, errorRate: 0.1, monthlyCostAed: 267.00 },
        { id: 'prov-003', name: 'Firebase Push', type: 'push', provider: 'firebase', status: 'connected', projectId: 'blue-edge-fleet', registeredDevices: 156, dailyLimit: 50000, dailyUsed: 890, uptime: 99.95, latencyMs: 45, errorRate: 0.5, monthlyCostAed: 0 },
        { id: 'prov-004', name: 'SendGrid Email', type: 'email', provider: 'sendgrid', status: 'connected', fromEmail: 'fleet@blueedge.ae', dailyLimit: 10000, dailyUsed: 23, uptime: 99.98, latencyMs: 200, errorRate: 0.2, monthlyCostAed: 120.00 },
      ],
      totalCostAed: 822.20,
      overallDeliveryRate: 97.8,
      totalSentToday: 1122,
      activeRules: 14,
    });
  }

  async getProviderHealth(providerId: string) {
    return success({
      providerId,
      status: 'healthy',
      lastChecked: new Date(),
      metrics: {
        latency: { current: 120, avg24h: 115, p99: 340, trend: 'stable' },
        deliveryRate: { current: 98.2, avg24h: 97.9, trend: 'improving' },
        errorRate: { current: 0.3, avg24h: 0.4, trend: 'improving' },
        throughput: { currentRps: 2.3, maxRps: 50, utilization: 4.6 },
        quota: { dailyUsed: 142, dailyLimit: 1000, remaining: 858, resetAt: new Date(new Date().setHours(24, 0, 0, 0)) },
      },
      recentErrors: [
        { timestamp: new Date(Date.now() - 3600000), errorCode: 'INVALID_NUMBER', message: 'Phone number +971-50-000-0000 is not valid', count: 1 },
      ],
      uptimeHistory: [
        { date: '2026-02-13', uptime: 100 }, { date: '2026-02-12', uptime: 99.98 },
        { date: '2026-02-11', uptime: 100 }, { date: '2026-02-10', uptime: 99.95 },
      ],
    });
  }

  async testProvider(providerId: string, body: any) {
    return success({
      providerId,
      testType: body.testType || 'connectivity',
      result: 'success',
      latencyMs: 134,
      details: {
        connectionOk: true,
        authenticationOk: true,
        quotaOk: true,
        testMessageSent: body.testType === 'send_test',
        testRecipient: body.testRecipient || '+971-50-XXX-TEST',
      },
      timestamp: new Date(),
    });
  }

  async configureProvider(providerId: string, body: any) {
    return success({
      providerId,
      updated: true,
      config: {
        accountSid: body.accountSid ? '***' + body.accountSid.slice(-4) : undefined,
        authToken: body.authToken ? '***masked***' : undefined,
        phoneNumber: body.phoneNumber,
        webhookUrl: body.webhookUrl || 'https://api.blueedge.ae/webhooks/twilio',
        statusCallbackUrl: body.statusCallbackUrl || 'https://api.blueedge.ae/webhooks/twilio/status',
        fallbackProvider: body.fallbackProvider,
      },
      validatedAt: new Date(),
    });
  }

  // ─── Notification Rules ────────────────────────────────────
  async getRules() {
    return success([
      { id: 'rule-001', name: 'Speed Violation Alert', triggerEvent: 'vehicle.speed_exceeded', conditions: { speedKmh: { gt: 120 }, zoneType: ['highway', 'urban'] }, actions: [{ channel: 'sms', templateId: 'tpl-003', recipients: ['driver', 'fleet_manager'] }, { channel: 'push', title: 'Speed Alert', recipients: ['driver'] }], fleetType: 'all', active: true, executionCount: 156, lastTriggered: new Date(Date.now() - 3600000) },
      { id: 'rule-002', name: 'HAZMAT Zone Entry', triggerEvent: 'geofence.zone_entered', conditions: { zoneType: 'hazmat', fleetType: 'tanker' }, actions: [{ channel: 'whatsapp', templateId: 'tpl-004', recipients: ['driver'] }, { channel: 'sms', recipients: ['safety_officer'] }], fleetType: 'tanker', active: true, executionCount: 43, lastTriggered: new Date(Date.now() - 7200000) },
      { id: 'rule-003', name: 'Maintenance Due Reminder', triggerEvent: 'maintenance.due_soon', conditions: { daysUntilDue: { lte: 7 } }, actions: [{ channel: 'whatsapp', templateId: 'tpl-002', recipients: ['driver'] }, { channel: 'email', recipients: ['fleet_manager'] }], fleetType: 'all', active: true, executionCount: 189, lastTriggered: new Date(Date.now() - 43200000) },
      { id: 'rule-004', name: 'Low Driver Score Alert', triggerEvent: 'driver.score_dropped', conditions: { score: { lt: 65 }, dropAmount: { gt: 10 } }, actions: [{ channel: 'whatsapp', templateId: 'tpl-008', recipients: ['driver'] }, { channel: 'push', title: 'Score Alert', recipients: ['fleet_manager'] }], fleetType: 'all', active: true, executionCount: 28, lastTriggered: new Date(Date.now() - 86400000) },
      { id: 'rule-005', name: 'Tanker Temperature Alert', triggerEvent: 'cargo.temperature_exceeded', conditions: { deviationDegrees: { gt: 2 } }, actions: [{ channel: 'sms', recipients: ['driver', 'cargo_manager'], urgent: true }, { channel: 'whatsapp', recipients: ['driver'] }], fleetType: 'tanker', active: true, executionCount: 12, lastTriggered: new Date(Date.now() - 172800000) },
      { id: 'rule-006', name: 'Trip Completion Notification', triggerEvent: 'trip.completed', conditions: {}, actions: [{ channel: 'whatsapp', templateId: 'tpl-006', recipients: ['driver'] }, { channel: 'email', recipients: ['customer'] }], fleetType: 'all', active: true, executionCount: 420, lastTriggered: new Date(Date.now() - 1800000) },
      { id: 'rule-007', name: 'Emergency Broadcast', triggerEvent: 'emergency.declared', conditions: { severity: ['critical', 'emergency'] }, actions: [{ channel: 'sms', templateId: 'tpl-007', recipients: ['all_drivers_in_area'], urgent: true }, { channel: 'push', title: 'EMERGENCY', recipients: ['all'] }], fleetType: 'all', active: true, executionCount: 2, lastTriggered: new Date(Date.now() - 2592000000) },
      { id: 'rule-008', name: 'Shift Start Reminder', triggerEvent: 'schedule.shift_starting', conditions: { minutesBefore: 30 }, actions: [{ channel: 'whatsapp', templateId: 'tpl-005', recipients: ['driver'] }], fleetType: 'all', active: true, executionCount: 960, lastTriggered: new Date(Date.now() - 18000000) },
    ]);
  }

  async createRule(body: any) {
    return success({
      id: `rule-${Date.now()}`, ...body,
      active: false, executionCount: 0,
      createdAt: new Date(),
      validation: { valid: true, triggersAvailable: true, recipientsResolvable: true },
    });
  }

  async testRule(ruleId: string, body: any) {
    return success({
      ruleId,
      testResult: 'would_trigger',
      matchedVehicles: body.testVehicleId ? 1 : 14,
      wouldSend: [
        { channel: 'whatsapp', recipientCount: 14, estimatedCostAed: 2.80 },
        { channel: 'sms', recipientCount: 2, estimatedCostAed: 0.30 },
      ],
      conditionEvaluation: { allMet: true, details: body.testConditions || { speedKmh: 135, zoneType: 'highway' } },
      dryRun: true,
    });
  }

  async updateRule(ruleId: string, body: any) {
    return success({ id: ruleId, ...body, updatedAt: new Date() });
  }

  // ─── Delivery Logs & Analytics ─────────────────────────────
  async getDeliveryAnalytics(period: string = '7d') {
    return success({
      period,
      summary: {
        totalSent: 3420, delivered: 3352, read: 2891, failed: 68,
        deliveryRate: 98.01, readRate: 84.53, failureRate: 1.99,
        avgDeliveryTimeMs: 1340, avgReadTimeMin: 4.2,
      },
      byChannel: {
        whatsapp: { sent: 2180, delivered: 2165, read: 1934, failed: 15, deliveryRate: 99.31, readRate: 88.72, costAed: 435.20 },
        sms: { sent: 890, delivered: 858, read: null, failed: 32, deliveryRate: 96.40, readRate: null, costAed: 267.00 },
        push: { sent: 280, delivered: 261, read: 189, failed: 19, deliveryRate: 93.21, readRate: 67.50, costAed: 0 },
        email: { sent: 70, delivered: 68, read: 29, failed: 2, deliveryRate: 97.14, readRate: 41.43, costAed: 12.00 },
      },
      byHour: Array.from({ length: 24 }, (_, h) => ({
        hour: h, sent: Math.floor(Math.random() * 40 + (h >= 6 && h <= 18 ? 80 : 10)),
      })),
      topFailureReasons: [
        { reason: 'INVALID_NUMBER', count: 28, percentage: 41.2 },
        { reason: 'UNDELIVERABLE', count: 18, percentage: 26.5 },
        { reason: 'RATE_LIMITED', count: 12, percentage: 17.6 },
        { reason: 'TIMEOUT', count: 10, percentage: 14.7 },
      ],
      costByDay: [
        { date: '2026-02-08', costAed: 98.40 }, { date: '2026-02-09', costAed: 112.20 },
        { date: '2026-02-10', costAed: 95.80 }, { date: '2026-02-11', costAed: 108.50 },
        { date: '2026-02-12', costAed: 101.30 }, { date: '2026-02-13', costAed: 119.60 },
        { date: '2026-02-14', costAed: 78.40 },
      ],
    });
  }

  async getDeliveryLogs(query: any) {
    return success({
      items: [
        { id: 'log-001', channel: 'whatsapp', provider: 'twilio', recipientPhone: '+971-50-123-4567', recipientName: 'أحمد محمد', templateId: 'tpl-001', ruleId: 'rule-006', content: 'Trip assignment: ENOC Jebel Ali → DAFZA', status: 'read', costAed: 0.20, externalId: 'SM1234567890', sentAt: new Date(Date.now() - 600000), deliveredAt: new Date(Date.now() - 595000), readAt: new Date(Date.now() - 540000) },
        { id: 'log-002', channel: 'sms', provider: 'twilio', recipientPhone: '+971-55-234-5678', recipientName: 'خالد عبدالله', templateId: 'tpl-003', ruleId: 'rule-001', content: '⚠️ Speed alert: BUS-1103 at 52km/h in school zone', status: 'delivered', costAed: 0.15, sentAt: new Date(Date.now() - 1200000), deliveredAt: new Date(Date.now() - 1190000) },
        { id: 'log-003', channel: 'whatsapp', provider: 'twilio', recipientPhone: '+971-50-345-6789', recipientName: 'محمد علي', templateId: 'tpl-004', ruleId: 'rule-002', content: '☣️ HAZMAT zone entry: Al Quoz Industrial', status: 'delivered', costAed: 0.20, sentAt: new Date(Date.now() - 1800000), deliveredAt: new Date(Date.now() - 1795000) },
        { id: 'log-004', channel: 'push', provider: 'firebase', recipientPhone: 'device-token-xxx', recipientName: 'راشد سعيد', ruleId: 'rule-004', content: 'Your driving score dropped to 62. Review coaching tips.', status: 'read', costAed: 0, sentAt: new Date(Date.now() - 3600000), readAt: new Date(Date.now() - 3000000) },
      ],
      total: 3420, page: 1, limit: 20,
    });
  }

  // ─── Webhook Management ────────────────────────────────────
  async getWebhookConfig() {
    return success({
      inbound: {
        url: 'https://api.blueedge.ae/webhooks/messaging/inbound',
        secret: '***masked***',
        verifySignature: true,
        active: true,
      },
      statusCallback: {
        url: 'https://api.blueedge.ae/webhooks/messaging/status',
        events: ['sent', 'delivered', 'read', 'failed'],
        active: true,
      },
      providers: [
        { provider: 'twilio', webhookUrl: 'https://api.blueedge.ae/webhooks/twilio', configured: true },
        { provider: 'firebase', webhookUrl: 'https://api.blueedge.ae/webhooks/firebase', configured: true },
        { provider: 'sendgrid', webhookUrl: 'https://api.blueedge.ae/webhooks/sendgrid', configured: true },
      ],
    });
  }

  async processInboundWebhook(body: any) {
    return success({
      received: true, processed: true,
      messageId: `inb-${Date.now()}`,
      from: body.From || body.from,
      content: body.Body || body.content,
      matchedDriver: { id: 'drv-001', name: 'أحمد محمد' },
      autoResponse: body.Body?.includes('نعم') ? { sent: true, template: 'trip_confirmed' } : null,
    });
  }
}

// ─── Controller ───────────────────────────────────────────────
