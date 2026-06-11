import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseCrudService } from '../../common/dto/base-crud.service';
import { success } from '../../common/dto';

@Injectable()
export class MessagingService extends BaseCrudService<Message> {
  constructor(
    @InjectRepository(Message) repo: Repository<Message>,
    @InjectRepository(MessageTemplate) private templateRepo: Repository<MessageTemplate>,
    @InjectRepository(MessageCampaign) private campaignRepo: Repository<MessageCampaign>,
  ) { super(repo); }

  async getDashboard() {
    return success({
      totalMessages: { today: 142, thisWeek: 876, thisMonth: 3420 },
      byChannel: { whatsapp: 2180, sms: 890, push: 280, email: 70 },
      deliveryRate: { whatsapp: 98.2, sms: 96.5, push: 91.3, email: 94.8 },
      readRate: { whatsapp: 89.1, sms: null, push: 72.4, email: 42.1 },
      costThisMonth: { whatsapp: 435.20, sms: 267.00, total: 702.20, currency: 'AED' },
      activeCampaigns: 2,
      pendingApproval: 1,
      templateCount: { total: 18, whatsappApproved: 12, pending: 2 },
      recentMessages: [
        { id: 'm-001', channel: 'whatsapp', direction: 'outbound', recipient: '+971-50-XXX-1234', driverName: 'أحمد محمد', template: 'maintenance_reminder', status: 'read', sentAt: new Date(Date.now() - 600000) },
        { id: 'm-002', channel: 'sms', direction: 'outbound', recipient: '+971-55-XXX-5678', driverName: 'خالد عبدالله', template: 'trip_assignment', status: 'delivered', sentAt: new Date(Date.now() - 1200000) },
        { id: 'm-003', channel: 'whatsapp', direction: 'inbound', recipient: '+971-50-XXX-9012', driverName: 'راشد سعيد', content: 'تم الوصول إلى نقطة التسليم', status: 'received', sentAt: new Date(Date.now() - 1800000) },
      ],
      topTemplates: [
        { name: 'Trip Assignment', uses: 420, deliveryRate: 99.1 },
        { name: 'Maintenance Reminder', uses: 189, deliveryRate: 98.5 },
        { name: 'Speed Alert', uses: 156, deliveryRate: 97.8 },
      ],
    });
  }

  async getTemplates() {
    return success([
      { id: 'tpl-001', name: 'trip_assignment', channel: 'whatsapp', category: 'dispatch', contentEn: 'Hi {{driver_name}}, you have a new trip: {{origin}} → {{destination}}. Vehicle: {{plate_number}}. Start time: {{start_time}}. Reply YES to confirm.', contentAr: 'مرحباً {{driver_name}}، لديك رحلة جديدة: {{origin}} → {{destination}}. المركبة: {{plate_number}}. وقت البدء: {{start_time}}. أرسل نعم للتأكيد.', variables: ['driver_name', 'origin', 'destination', 'plate_number', 'start_time'], whatsappStatus: 'approved', active: true },
      { id: 'tpl-002', name: 'maintenance_reminder', channel: 'whatsapp', category: 'maintenance', contentEn: '🔧 Reminder: {{vehicle_plate}} is due for {{service_type}} on {{due_date}}. Please bring the vehicle to {{workshop}} by {{time}}.', contentAr: '🔧 تذكير: {{vehicle_plate}} موعد {{service_type}} في {{due_date}}. يرجى إحضار المركبة إلى {{workshop}} قبل {{time}}.', variables: ['vehicle_plate', 'service_type', 'due_date', 'workshop', 'time'], whatsappStatus: 'approved', active: true },
      { id: 'tpl-003', name: 'speed_alert', channel: 'sms', category: 'alert', contentEn: '⚠️ Speed alert: {{plate_number}} recorded {{speed}}km/h in {{zone}} (limit: {{limit}}km/h). Driver: {{driver_name}}.', contentAr: '⚠️ تنبيه سرعة: {{plate_number}} سجلت {{speed}} كم/ساعة في {{zone}} (الحد: {{limit}} كم/ساعة). السائق: {{driver_name}}.', variables: ['plate_number', 'speed', 'zone', 'limit', 'driver_name'], whatsappStatus: 'n/a', active: true },
      { id: 'tpl-004', name: 'hazmat_zone_entry', channel: 'whatsapp', category: 'compliance', contentEn: '☣️ HAZMAT Alert: {{plate_number}} entering {{zone_name}}. Ensure all safety protocols active. Speed limit: {{speed_limit}}km/h. Report issues to {{contact}}.', contentAr: '☣️ تنبيه مواد خطرة: {{plate_number}} تدخل {{zone_name}}. تأكد من تفعيل جميع بروتوكولات السلامة. حد السرعة: {{speed_limit}} كم/ساعة. أبلغ عن المشاكل: {{contact}}.', variables: ['plate_number', 'zone_name', 'speed_limit', 'contact'], whatsappStatus: 'approved', active: true },
      { id: 'tpl-005', name: 'shift_reminder', channel: 'whatsapp', category: 'dispatch', contentEn: 'Good morning {{driver_name}}! Your shift starts at {{start_time}}. Vehicle: {{plate_number}} at {{depot}}. Have a safe day! 🚛', contentAr: 'صباح الخير {{driver_name}}! تبدأ وردتك في {{start_time}}. المركبة: {{plate_number}} في {{depot}}. يوم آمن! 🚛', variables: ['driver_name', 'start_time', 'plate_number', 'depot'], whatsappStatus: 'approved', active: true },
      { id: 'tpl-006', name: 'delivery_confirmation', channel: 'whatsapp', category: 'dispatch', contentEn: '✅ Delivery confirmed: {{quantity}} {{product}} delivered to {{customer}} at {{location}}. Trip {{trip_id}} completed. Well done {{driver_name}}!', contentAr: '✅ تم التسليم: {{quantity}} {{product}} إلى {{customer}} في {{location}}. الرحلة {{trip_id}} مكتملة. أحسنت {{driver_name}}!', variables: ['quantity', 'product', 'customer', 'location', 'trip_id', 'driver_name'], whatsappStatus: 'approved', active: true },
      { id: 'tpl-007', name: 'emergency_broadcast', channel: 'sms', category: 'alert', contentEn: '🚨 EMERGENCY: {{message}}. All drivers in {{area}} respond immediately. Contact: {{contact}}', contentAr: '🚨 طوارئ: {{message}}. جميع السائقين في {{area}} الرد فوراً. التواصل: {{contact}}', variables: ['message', 'area', 'contact'], whatsappStatus: 'n/a', active: true },
      { id: 'tpl-008', name: 'score_weekly_report', channel: 'whatsapp', category: 'alert', contentEn: '📊 Weekly Report {{driver_name}}: Score {{score}}/100 ({{trend}}). Safety: {{safety}}, Efficiency: {{efficiency}}. {{message}}', contentAr: '📊 التقرير الأسبوعي {{driver_name}}: النتيجة {{score}}/100 ({{trend}}). السلامة: {{safety}}، الكفاءة: {{efficiency}}. {{message}}', variables: ['driver_name', 'score', 'trend', 'safety', 'efficiency', 'message'], whatsappStatus: 'approved', active: true },
    ]);
  }

  async sendMessage(body: any) {
    return success({
      messageId: `msg-${Date.now()}`, channel: body.channel, recipient: body.recipientPhone,
      templateId: body.templateId, status: 'queued',
      estimatedDelivery: '< 5 seconds', costAed: body.channel === 'whatsapp' ? 0.20 : 0.15,
      contentPreview: body.content || `Template: ${body.templateId} with ${Object.keys(body.variables || {}).length} variables`,
    });
  }

  async sendBulk(body: any) {
    return success({
      campaignId: `camp-${Date.now()}`, templateId: body.templateId, channel: body.channel,
      totalRecipients: body.recipients?.length || 48, status: 'processing',
      estimatedCompletionMin: 2, estimatedCostAed: (body.recipients?.length || 48) * 0.20,
    });
  }

  async getCampaigns() {
    return success([
      { id: 'camp-001', name: 'Ramadan Schedule Change', channel: 'whatsapp', templateId: 'tpl-005', audience: { fleetType: 'all', role: 'driver' }, totalRecipients: 48, sent: 48, delivered: 47, read: 41, failed: 1, status: 'completed', scheduledAt: new Date(Date.now() - 86400000) },
      { id: 'camp-002', name: 'Safety Training Reminder', channel: 'sms', templateId: 'tpl-custom', audience: { fleetType: 'tanker', scoreBelow: 80 }, totalRecipients: 8, sent: 8, delivered: 8, read: null, failed: 0, status: 'completed', scheduledAt: new Date(Date.now() - 172800000) },
      { id: 'camp-003', name: 'Weekly Score Reports', channel: 'whatsapp', templateId: 'tpl-008', audience: { fleetType: 'all', role: 'driver' }, totalRecipients: 48, sent: 0, delivered: 0, read: 0, failed: 0, status: 'scheduled', scheduledAt: new Date(Date.now() + 86400000) },
    ]);
  }

  async getMessageHistory(driverId?: string) {
    return success([
      { id: 'm-001', channel: 'whatsapp', direction: 'outbound', recipientPhone: '+971-50-123-4567', driverName: 'أحمد محمد', template: 'trip_assignment', content: 'Hi أحمد, you have a new trip: ENOC Jebel Ali → DAFZA. Vehicle: DXB-7291.', status: 'read', sentAt: new Date(Date.now() - 600000), deliveredAt: new Date(Date.now() - 595000), readAt: new Date(Date.now() - 540000) },
      { id: 'm-002', channel: 'whatsapp', direction: 'inbound', recipientPhone: '+971-50-123-4567', driverName: 'أحمد محمد', content: 'نعم، تم التأكيد ✅', status: 'received', sentAt: new Date(Date.now() - 480000) },
      { id: 'm-003', channel: 'sms', direction: 'outbound', recipientPhone: '+971-55-234-5678', driverName: 'خالد عبدالله', template: 'speed_alert', content: '⚠️ Speed alert: BUS-1103 recorded 52km/h in Al Barsha School Zone (limit: 40km/h).', status: 'delivered', sentAt: new Date(Date.now() - 1200000) },
    ]);
  }

  async getWhatsAppStatus() {
    return success({
      provider: 'Twilio WhatsApp Business API',
      status: 'connected',
      phoneNumber: '+971-4-XXX-XXXX',
      businessName: 'Blue Edge Fleet',
      tier: 'Standard (1,000 msg/day)',
      approvedTemplates: 12, pendingTemplates: 2,
      dailyUsage: { sent: 142, limit: 1000, percentage: 14.2 },
      monthlyBill: { whatsapp: 435.20, sms: 267.00, currency: 'AED' },
      health: { latencyMs: 120, errorRate: 0.3, uptime: 99.97 },
    });
  }
}

// ─── Controller ───────────────────────────────────────────────
