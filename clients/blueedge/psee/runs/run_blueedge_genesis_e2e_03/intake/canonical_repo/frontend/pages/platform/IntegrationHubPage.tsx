import React, { useState, useEffect, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';

/* ═══════════════════════════════════════════════════════════════
   INTEGRATION HUB DASHBOARD
   Mission control for all platform integrations:
   • Notification Providers (WhatsApp/SMS/Push/Email)
   • ERP Connectors (SAP/Oracle/Dynamics)
   • API Marketplace (Keys, Webhooks, Developer Portal)
   • Data Flows & Health Monitoring
   ═══════════════════════════════════════════════════════════════ */

/* ── Mock Data ───────────────────────────────────────────────── */

const PROVIDERS = [
  { id: 'prov-001', name: 'Twilio WhatsApp', type: 'whatsapp', icon: '💬', status: 'connected', phone: '+971-4-XXX-XXXX', dailyLimit: 1000, dailyUsed: 142, uptime: 99.97, latencyMs: 120, errorRate: 0.3, costAed: 435.20, deliveryRate: 98.2, readRate: 89.1 },
  { id: 'prov-002', name: 'Twilio SMS', type: 'sms', icon: '📱', status: 'connected', phone: '+971-4-XXX-XXXX', dailyLimit: 5000, dailyUsed: 67, uptime: 99.99, latencyMs: 85, errorRate: 0.1, costAed: 267.00, deliveryRate: 96.5, readRate: null },
  { id: 'prov-003', name: 'Firebase Push', type: 'push', icon: '🔔', status: 'connected', phone: '156 devices', dailyLimit: 50000, dailyUsed: 890, uptime: 99.95, latencyMs: 45, errorRate: 0.5, costAed: 0, deliveryRate: 91.3, readRate: 72.4 },
  { id: 'prov-004', name: 'SendGrid Email', type: 'email', icon: '📧', status: 'connected', phone: 'fleet@blueedge.ae', dailyLimit: 10000, dailyUsed: 23, uptime: 99.98, latencyMs: 200, errorRate: 0.2, costAed: 120.00, deliveryRate: 94.8, readRate: 42.1 },
];

const NOTIFICATION_RULES = [
  { id: 'rule-001', name: 'Speed Violation Alert', event: 'vehicle.speed_exceeded', channels: ['sms', 'push'], fleet: 'all', active: true, executions: 156, last: '1h ago' },
  { id: 'rule-002', name: 'HAZMAT Zone Entry', event: 'geofence.zone_entered', channels: ['whatsapp', 'sms'], fleet: 'tanker', active: true, executions: 43, last: '2h ago' },
  { id: 'rule-003', name: 'Maintenance Due', event: 'maintenance.due_soon', channels: ['whatsapp', 'email'], fleet: 'all', active: true, executions: 189, last: '12h ago' },
  { id: 'rule-004', name: 'Low Driver Score', event: 'driver.score_dropped', channels: ['whatsapp', 'push'], fleet: 'all', active: true, executions: 28, last: '1d ago' },
  { id: 'rule-005', name: 'Tanker Temperature', event: 'cargo.temp_exceeded', channels: ['sms', 'whatsapp'], fleet: 'tanker', active: true, executions: 12, last: '2d ago' },
  { id: 'rule-006', name: 'Trip Completion', event: 'trip.completed', channels: ['whatsapp', 'email'], fleet: 'all', active: true, executions: 420, last: '30m ago' },
  { id: 'rule-007', name: 'Emergency Broadcast', event: 'emergency.declared', channels: ['sms', 'push'], fleet: 'all', active: true, executions: 2, last: '30d ago' },
  { id: 'rule-008', name: 'Shift Start Reminder', event: 'schedule.shift_starting', channels: ['whatsapp'], fleet: 'all', active: true, executions: 960, last: '5h ago' },
];

const ERP_CONNECTORS = [
  { id: 'erp-001', name: 'SAP S/4HANA', type: 'sap', status: 'connected', icon: '🏢', endpoint: 'sap.blueedge.ae', modules: ['PM', 'MM', 'FI', 'CO'], syncFreq: '15min', lastSync: { status: 'success', records: 342, duration: '4.5s', time: '15m ago' }, health: { latency: 230, uptime: 99.95, errors: 0.1 }, costAed: 2500, inbound: ['work_orders', 'purchase_orders', 'cost_centers'], outbound: ['vehicle_telemetry', 'trip_reports', 'fuel_consumption', 'maintenance_requests'] },
  { id: 'erp-002', name: 'Oracle TMS', type: 'oracle', status: 'connected', icon: '🔴', endpoint: 'oracle.blueedge.ae', modules: ['Fleet Planning', 'Shipment', 'Billing'], syncFreq: '1hr', lastSync: { status: 'success', records: 89, duration: '3.2s', time: '1h ago' }, health: { latency: 310, uptime: 99.90, errors: 0.2 }, costAed: 800, inbound: ['shipment_orders', 'rate_tables'], outbound: ['vehicle_positions', 'delivery_confirmations', 'cost_actuals'] },
  { id: 'erp-003', name: 'Dynamics 365', type: 'dynamics', status: 'degraded', icon: '🟦', endpoint: 'blueedge.crm4.dynamics.com', modules: ['Field Service', 'Finance', 'Supply Chain'], syncFreq: 'daily', lastSync: { status: 'success', records: 156, duration: '8.9s', time: '1d ago' }, health: { latency: 850, uptime: 98.50, errors: 0.5 }, costAed: 450, inbound: ['work_orders', 'customer_contacts'], outbound: ['asset_telemetry', 'service_requests', 'invoices'] },
];

const FIELD_MAPPINGS = [
  { source: 'plate_number', target: 'EQUNR', transform: 'prefix_remove("DXB-")', entity: 'vehicle' },
  { source: 'maintenance.type', target: 'AUART', transform: 'map(preventive→PM01)', entity: 'maintenance' },
  { source: 'fuel.cost_aed', target: 'DMBTR', transform: 'currency_convert(AED→USD)', entity: 'fuel' },
  { source: 'vehicle.status', target: 'STTXT', transform: 'map(active→AVLB)', entity: 'vehicle' },
  { source: 'maintenance.date', target: 'GSTRP', transform: 'date(YYYYMMDD)', entity: 'maintenance' },
  { source: 'maintenance.parts', target: 'RESB', transform: 'array_to_bom()', entity: 'maintenance' },
];

const API_KEYS = [
  { id: 'key-001', name: 'SAP Integration', prefix: 'be_sap_****', scopes: 5, rateLimit: '120/min', requests: 284500, active: true, lastUsed: '1m ago' },
  { id: 'key-002', name: 'Customer Portal', prefix: 'be_cust_****', scopes: 3, rateLimit: '60/min', requests: 98200, active: true, lastUsed: '2m ago' },
  { id: 'key-003', name: 'Mobile App', prefix: 'be_mob_****', scopes: 4, rateLimit: '30/min', requests: 45600, active: true, lastUsed: '5m ago' },
  { id: 'key-004', name: 'Analytics Dashboard', prefix: 'be_ana_****', scopes: 3, rateLimit: '30/min', requests: 12300, active: true, lastUsed: '15m ago' },
  { id: 'key-005', name: 'Legacy System', prefix: 'be_leg_****', scopes: 1, rateLimit: '10/min', requests: 5600, active: false, lastUsed: '15d ago' },
];

const WEBHOOKS = [
  { id: 'wh-001', name: 'SAP Event Relay', url: 'sap.blueedge.ae/webhooks', events: 3, status: 'active', deliveries: 12400, successRate: 99.86, lastDelivery: '5m ago' },
  { id: 'wh-002', name: 'Customer Tracking', url: 'track.customer.ae/webhook', events: 3, status: 'active', deliveries: 45200, successRate: 99.49, lastDelivery: '1m ago' },
  { id: 'wh-003', name: 'Safety Alert System', url: 'safety.blueedge.ae/alerts', events: 4, status: 'active', deliveries: 890, successRate: 99.78, lastDelivery: '2h ago' },
  { id: 'wh-004', name: 'Slack Notifications', url: 'hooks.slack.com/services/...', events: 3, status: 'active', deliveries: 340, successRate: 98.53, lastDelivery: '1h ago' },
];

const DATA_FLOWS = [
  { id: 'flow-001', name: 'Vehicle Telemetry → SAP', from: 'Blue Edge', to: 'SAP S/4HANA', freq: '15min', records24h: 4800, type: 'outbound' },
  { id: 'flow-002', name: 'SAP Work Orders → Blue Edge', from: 'SAP S/4HANA', to: 'Blue Edge', freq: '15min', records24h: 156, type: 'inbound' },
  { id: 'flow-003', name: 'Trip Reports → Oracle', from: 'Blue Edge', to: 'Oracle TMS', freq: 'realtime', records24h: 420, type: 'outbound' },
  { id: 'flow-004', name: 'Speed Alerts → Drivers', from: 'Events', to: 'WhatsApp/SMS', freq: 'realtime', records24h: 156, type: 'notification' },
  { id: 'flow-005', name: 'Trip Events → Customer', from: 'Events', to: 'Webhooks', freq: 'realtime', records24h: 2340, type: 'webhook' },
  { id: 'flow-006', name: 'AI Predictions → Dynamics', from: 'Blue Edge AI', to: 'Dynamics 365', freq: 'daily', records24h: 48, type: 'outbound' },
];

const HEALTH_COMPONENTS = [
  { name: 'Twilio WhatsApp', cat: 'notification', status: 'healthy', latency: 120, uptime: 99.97 },
  { name: 'Twilio SMS', cat: 'notification', status: 'healthy', latency: 85, uptime: 99.99 },
  { name: 'Firebase Push', cat: 'notification', status: 'healthy', latency: 45, uptime: 99.95 },
  { name: 'SendGrid Email', cat: 'notification', status: 'healthy', latency: 200, uptime: 99.98 },
  { name: 'SAP S/4HANA', cat: 'erp', status: 'healthy', latency: 230, uptime: 99.95 },
  { name: 'Oracle TMS', cat: 'erp', status: 'healthy', latency: 310, uptime: 99.90 },
  { name: 'Dynamics 365', cat: 'erp', status: 'degraded', latency: 850, uptime: 98.50 },
  { name: 'Webhook Relay', cat: 'api', status: 'healthy', latency: 34, uptime: 99.99 },
  { name: 'API Gateway', cat: 'api', status: 'healthy', latency: 12, uptime: 99.99 },
];

const DELIVERY_BY_HOUR = Array.from({ length: 24 }, (_, h) => ({
  hour: h,
  count: Math.floor(Math.random() * 40 + (h >= 6 && h <= 18 ? 80 : 10)),
}));

const RECENT_ACTIVITY = [
  { type: 'erp', icon: '🔄', text: 'SAP incremental sync — 342 records', status: 'success', time: '15m ago' },
  { type: 'notification', icon: '💬', text: 'WhatsApp campaign sent — 48 recipients', status: 'success', time: '30m ago' },
  { type: 'webhook', icon: '🔗', text: 'trip.completed → SAP Event Relay', status: 'success', time: '5m ago' },
  { type: 'api', icon: '⚠️', text: 'Mobile App — rate limit warning (80%)', status: 'warning', time: '1h ago' },
  { type: 'erp', icon: '🔄', text: 'Oracle TMS sync — 89 records', status: 'success', time: '1h ago' },
  { type: 'notification', icon: '📱', text: 'Speed alert SMS → خالد عبدالله', status: 'success', time: '20m ago' },
  { type: 'erp', icon: '❌', text: 'Dynamics 365 — elevated latency (850ms)', status: 'error', time: '30m ago' },
  { type: 'webhook', icon: '🔗', text: 'fuel.transaction → Customer Tracking', status: 'success', time: '10m ago' },
];

/* ── Utility Components ──────────────────────────────────────── */

function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    connected: 'bg-emerald-400', healthy: 'bg-emerald-400', active: 'bg-emerald-400', success: 'bg-emerald-400',
    degraded: 'bg-amber-400', warning: 'bg-amber-400', configured: 'bg-blue-400',
    disconnected: 'bg-red-400', failing: 'bg-red-400', error: 'bg-red-400',
  };
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors[status] || 'bg-slate-400'}`} />
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status] || 'bg-slate-400'}`} />
    </span>
  );
}

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: string }) {
  const styles: Record<string, string> = {
    default: 'bg-slate-600/60 text-slate-300',
    success: 'bg-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/20 text-amber-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-cyan-500/20 text-cyan-400',
    tanker: 'bg-orange-500/20 text-orange-400',
    whatsapp: 'bg-green-500/20 text-green-400',
    sms: 'bg-blue-500/20 text-blue-400',
    push: 'bg-violet-500/20 text-violet-400',
    email: 'bg-amber-500/20 text-amber-400',
  };
  return <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${styles[variant] || styles.default}`}>{children}</span>;
}

function MiniBar({ value, max, color = 'bg-cyan-500' }: { value: number; max: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : color;
  return (
    <div className="h-1.5 bg-slate-600/50 rounded-full overflow-hidden w-full">
      <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function MetricBox({ label, value, sub, trend }: { label: string; value: string | number; sub?: string; trend?: 'up' | 'down' | 'stable' }) {
  return (
    <div className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/30">
      <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="text-xl font-bold text-white flex items-baseline gap-1.5">
        {value}
        {trend && <span className={`text-[10px] ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
          {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
        </span>}
      </div>
      {sub && <div className="text-[10px] text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

/* ── Tab Navigation ──────────────────────────────────────────── */

const TABS = [
  { id: 'overview', label: '🎯 Overview', shortLabel: 'Overview' },
  { id: 'notifications', label: '💬 Notifications', shortLabel: 'Notifications' },
  { id: 'erp', label: '🏢 ERP Connectors', shortLabel: 'ERP' },
  { id: 'api', label: '🔑 API & Webhooks', shortLabel: 'API' },
  { id: 'dataflows', label: '🔀 Data Flows', shortLabel: 'Flows' },
  { id: 'health', label: '🏥 Health', shortLabel: 'Health' },
];

function IntegrationTabs({ active, onChange }: { active: string; onChange: (id: string) => void }) {
  return (
    <div className="flex gap-1 bg-slate-800/80 rounded-xl p-1 border border-slate-700/50 overflow-x-auto">
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
            active === tab.id
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: OVERVIEW
   ═══════════════════════════════════════════════════════════════ */

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricBox label="Integrations" value="12" sub="10 active, 1 degraded" />
        <MetricBox label="Messages Today" value="3,420" sub="WhatsApp · SMS · Push · Email" trend="up" />
        <MetricBox label="ERP Syncs/hr" value="8" sub="SAP · Oracle · Dynamics" trend="stable" />
        <MetricBox label="API Req/min" value="208" sub="4 active keys" trend="up" />
        <MetricBox label="Webhook Del/min" value="12.3" sub="98.5% success rate" trend="stable" />
        <MetricBox label="Monthly Cost" value="4,772 AED" sub="Notif 822 + ERP 3,750 + API 200" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integration Status Cards */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /> Integration Status
          </h3>
          <div className="space-y-3">
            {[
              { cat: 'Notifications', count: 4, status: 'healthy', channels: 'WhatsApp · SMS · Push · Email' },
              { cat: 'ERP', count: 3, status: 'degraded', channels: 'SAP · Oracle · Dynamics' },
              { cat: 'API Marketplace', count: 5, status: 'healthy', channels: '4 keys · 4 webhooks' },
            ].map(item => (
              <div key={item.cat} className="flex items-center justify-between bg-slate-700/30 rounded-lg p-3">
                <div>
                  <div className="text-sm text-white font-medium">{item.cat}</div>
                  <div className="text-[10px] text-slate-400">{item.channels}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.count + ' active'}>{item.count} active</Badge>
                  <StatusDot status={item.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Distribution (mini bar chart) */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Messages by Hour (Today)
          </h3>
          <div className="flex items-end gap-[2px] h-28">
            {DELIVERY_BY_HOUR.map((d, i) => {
              const maxCount = Math.max(...DELIVERY_BY_HOUR.map(x => x.count));
              const h = (d.count / maxCount) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-cyan-500/70 rounded-t-sm hover:bg-cyan-400 transition-colors cursor-pointer relative group"
                  style={{ height: `${h}%` }}
                  title={`${d.hour}:00 — ${d.count} messages`}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-[9px] text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {d.hour}:00 — {d.count}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[9px] text-slate-500 mt-1">
            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" /> Recent Activity
          </h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {RECENT_ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-start gap-2 bg-slate-700/20 rounded-lg p-2">
                <span className="text-sm">{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-slate-300 truncate">{a.text}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusDot status={a.status} />
                    <span className="text-[9px] text-slate-500">{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-slate-800 rounded-xl p-5 border border-slate-700/50">
        <h3 className="text-sm font-semibold text-white mb-4">Monthly Cost Breakdown — February 2026</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'WhatsApp', cost: 435.20, color: 'bg-green-500' },
            { label: 'SMS', cost: 267.00, color: 'bg-blue-500' },
            { label: 'Email', cost: 120.00, color: 'bg-amber-500' },
            { label: 'Push', cost: 0, color: 'bg-violet-500' },
            { label: 'SAP License', cost: 2500.00, color: 'bg-cyan-500' },
            { label: 'Oracle API', cost: 800.00, color: 'bg-red-500' },
            { label: 'Dynamics API', cost: 450.00, color: 'bg-blue-400' },
          ].map(item => (
            <div key={item.label} className="bg-slate-700/30 rounded-lg p-3 text-center">
              <div className={`w-2 h-2 rounded-full ${item.color} mx-auto mb-2`} />
              <div className="text-[10px] text-slate-400">{item.label}</div>
              <div className="text-sm font-bold text-white mt-1">AED {item.cost.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: NOTIFICATIONS
   ═══════════════════════════════════════════════════════════════ */

function NotificationsTab() {
  return (
    <div className="space-y-6">
      {/* Provider Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROVIDERS.map(p => {
          const usagePct = (p.dailyUsed / p.dailyLimit) * 100;
          return (
            <div key={p.id} className="bg-slate-800 rounded-xl p-5 border border-slate-700/50 hover:border-slate-600/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{p.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white">{p.name}</div>
                    <div className="text-[10px] text-slate-400">{p.phone}</div>
                  </div>
                </div>
                <StatusDot status={p.status} />
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                    <span>Daily Usage</span>
                    <span>{p.dailyUsed.toLocaleString()} / {p.dailyLimit.toLocaleString()}</span>
                  </div>
                  <MiniBar value={p.dailyUsed} max={p.dailyLimit} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-700/30 rounded p-2">
                    <div className="text-[9px] text-slate-500">DELIVERY</div>
                    <div className="text-sm font-bold text-emerald-400">{p.deliveryRate}%</div>
                  </div>
                  <div className="bg-slate-700/30 rounded p-2">
                    <div className="text-[9px] text-slate-500">LATENCY</div>
                    <div className="text-sm font-bold text-white">{p.latencyMs}ms</div>
                  </div>
                  <div className="bg-slate-700/30 rounded p-2">
                    <div className="text-[9px] text-slate-500">READ RATE</div>
                    <div className="text-sm font-bold text-cyan-400">{p.readRate !== null ? `${p.readRate}%` : 'N/A'}</div>
                  </div>
                  <div className="bg-slate-700/30 rounded p-2">
                    <div className="text-[9px] text-slate-500">COST/MTH</div>
                    <div className="text-sm font-bold text-white">{p.costAed > 0 ? `${p.costAed} AED` : 'Free'}</div>
                  </div>
                </div>

                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400">Uptime: <span className="text-emerald-400">{p.uptime}%</span></span>
                  <span className="text-slate-400">Errors: <span className={p.errorRate > 0.3 ? 'text-amber-400' : 'text-emerald-400'}>{p.errorRate}%</span></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification Rules */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50">
        <div className="p-5 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            Automated Notification Rules
            <span className="text-[10px] text-slate-400 font-normal">{NOTIFICATION_RULES.length} rules · {NOTIFICATION_RULES.filter(r => r.active).length} active</span>
          </h3>
        </div>
        <div className="divide-y divide-slate-700/30">
          {NOTIFICATION_RULES.map(rule => (
            <div key={rule.id} className="p-4 flex items-center gap-4 hover:bg-slate-700/20 transition-colors">
              <div className={`w-2 h-2 rounded-full ${rule.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium">{rule.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  <code className="bg-slate-700/50 px-1.5 py-0.5 rounded text-cyan-400">{rule.event}</code>
                </div>
              </div>
              <div className="flex gap-1">
                {rule.channels.map(ch => <Badge key={ch} variant={ch}>{ch}</Badge>)}
              </div>
              {rule.fleet !== 'all' && <Badge variant="tanker">{rule.fleet}</Badge>}
              <div className="text-right min-w-[80px]">
                <div className="text-xs text-white">{rule.executions.toLocaleString()} runs</div>
                <div className="text-[9px] text-slate-500">{rule.last}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricBox label="Total Sent (7d)" value="3,420" sub="Across all channels" trend="up" />
        <MetricBox label="Delivery Rate" value="98.0%" sub="3,352 delivered" trend="stable" />
        <MetricBox label="Read Rate" value="84.5%" sub="WhatsApp: 89.1%" trend="up" />
        <MetricBox label="Failed" value="68" sub="Top: Invalid number (41%)" trend="down" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: ERP CONNECTORS
   ═══════════════════════════════════════════════════════════════ */

function ErpTab() {
  return (
    <div className="space-y-6">
      {/* ERP Connector Cards */}
      {ERP_CONNECTORS.map(erp => (
        <div key={erp.id} className={`bg-slate-800 rounded-xl border ${erp.status === 'degraded' ? 'border-amber-500/40' : 'border-slate-700/50'}`}>
          <div className="p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{erp.icon}</span>
                <div>
                  <div className="text-base font-semibold text-white">{erp.name}</div>
                  <div className="text-[10px] text-slate-400">{erp.endpoint} · Sync every {erp.syncFreq}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-white">AED {erp.costAed.toLocaleString()}/mo</div>
                  <div className="text-[9px] text-slate-500">Last sync: {erp.lastSync.time}</div>
                </div>
                <StatusDot status={erp.status} />
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-[9px] text-slate-500 uppercase">Modules</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {erp.modules.map(m => <Badge key={m}>{m}</Badge>)}
                </div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-[9px] text-slate-500 uppercase">Last Sync</div>
                <div className="text-sm font-bold text-emerald-400 mt-1">{erp.lastSync.records} records</div>
                <div className="text-[9px] text-slate-400">{erp.lastSync.duration} · {erp.lastSync.status}</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-[9px] text-slate-500 uppercase">Latency</div>
                <div className={`text-sm font-bold mt-1 ${erp.health.latency > 500 ? 'text-amber-400' : 'text-white'}`}>{erp.health.latency}ms</div>
                <div className="text-[9px] text-slate-400">{erp.health.latency > 500 ? '⚠ Elevated' : 'Normal'}</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-[9px] text-slate-500 uppercase">Uptime</div>
                <div className={`text-sm font-bold mt-1 ${erp.health.uptime < 99 ? 'text-amber-400' : 'text-emerald-400'}`}>{erp.health.uptime}%</div>
                <div className="text-[9px] text-slate-400">30-day avg</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-3">
                <div className="text-[9px] text-slate-500 uppercase">Error Rate</div>
                <div className={`text-sm font-bold mt-1 ${erp.health.errors > 0.3 ? 'text-amber-400' : 'text-emerald-400'}`}>{erp.health.errors}%</div>
              </div>
            </div>

            {/* Data Flows */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-700/20 rounded-lg p-3">
                <div className="text-[10px] text-cyan-400 font-medium mb-2">⬇ INBOUND (ERP → Blue Edge)</div>
                <div className="flex flex-wrap gap-1">
                  {erp.inbound.map(f => <Badge key={f} variant="info">{f}</Badge>)}
                </div>
              </div>
              <div className="bg-slate-700/20 rounded-lg p-3">
                <div className="text-[10px] text-emerald-400 font-medium mb-2">⬆ OUTBOUND (Blue Edge → ERP)</div>
                <div className="flex flex-wrap gap-1">
                  {erp.outbound.map(f => <Badge key={f} variant="success">{f}</Badge>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Field Mappings */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50">
        <div className="p-5 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-white">Field Mappings — Blue Edge ↔ SAP</h3>
          <div className="text-[10px] text-slate-400 mt-1">Bidirectional data transformation rules</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/30">
                <th className="text-left text-[10px] text-slate-400 uppercase p-3 font-medium">Entity</th>
                <th className="text-left text-[10px] text-slate-400 uppercase p-3 font-medium">Blue Edge Field</th>
                <th className="text-center text-[10px] text-slate-400 p-3">→</th>
                <th className="text-left text-[10px] text-slate-400 uppercase p-3 font-medium">SAP Field</th>
                <th className="text-left text-[10px] text-slate-400 uppercase p-3 font-medium">Transform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/20">
              {FIELD_MAPPINGS.map((m, i) => (
                <tr key={i} className="hover:bg-slate-700/20 transition-colors">
                  <td className="p-3"><Badge>{m.entity}</Badge></td>
                  <td className="p-3 font-mono text-xs text-cyan-400">{m.source}</td>
                  <td className="p-3 text-center text-slate-500">↔</td>
                  <td className="p-3 font-mono text-xs text-amber-400">{m.target}</td>
                  <td className="p-3">
                    <code className="text-[10px] bg-slate-700/50 px-2 py-0.5 rounded text-slate-300">{m.transform}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: API & WEBHOOKS
   ═══════════════════════════════════════════════════════════════ */

function ApiTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Keys */}
        <div className="bg-slate-800 rounded-xl border border-slate-700/50">
          <div className="p-5 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between">
              API Keys
              <span className="text-[10px] text-slate-400 font-normal">{API_KEYS.filter(k => k.active).length}/{API_KEYS.length} active</span>
            </h3>
          </div>
          <div className="divide-y divide-slate-700/30">
            {API_KEYS.map(key => (
              <div key={key.id} className="p-4 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${key.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                    <span className="text-sm font-medium text-white">{key.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{key.lastUsed}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <code className="bg-slate-700/50 px-2 py-0.5 rounded text-slate-300">{key.prefix}</code>
                  <span className="text-slate-500">{key.scopes} scopes</span>
                  <span className="text-slate-500">{key.rateLimit}</span>
                  <span className="text-cyan-400">{key.requests.toLocaleString()} req</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Webhooks */}
        <div className="bg-slate-800 rounded-xl border border-slate-700/50">
          <div className="p-5 border-b border-slate-700/50">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between">
              Webhook Subscriptions
              <span className="text-[10px] text-slate-400 font-normal">73 events available</span>
            </h3>
          </div>
          <div className="divide-y divide-slate-700/30">
            {WEBHOOKS.map(wh => (
              <div key={wh.id} className="p-4 hover:bg-slate-700/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <StatusDot status={wh.status} />
                    <span className="text-sm font-medium text-white">{wh.name}</span>
                  </div>
                  <Badge variant={wh.successRate > 99 ? 'success' : 'warning'}>{wh.successRate}%</Badge>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <code className="bg-slate-700/50 px-2 py-0.5 rounded text-slate-300 truncate max-w-[180px]">{wh.url}</code>
                  <span className="text-slate-500">{wh.events} events</span>
                  <span className="text-cyan-400">{wh.deliveries.toLocaleString()} deliveries</span>
                  <span className="text-slate-500">{wh.lastDelivery}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Portal Stats */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Developer Portal</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">500</div>
            <div className="text-[10px] text-slate-400 mt-1">REST Endpoints</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-emerald-400">73</div>
            <div className="text-[10px] text-slate-400 mt-1">Webhook Events</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-400">4</div>
            <div className="text-[10px] text-slate-400 mt-1">SDKs (JS · Python · Go · C#)</div>
          </div>
          <div className="bg-slate-700/30 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-violet-400">v2.0</div>
            <div className="text-[10px] text-slate-400 mt-1">API Version</div>
          </div>
        </div>

        {/* Endpoint Categories */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {[
            { name: 'Fleet Ops', count: 85, color: 'bg-cyan-500' },
            { name: 'Fleet Types', count: 65, color: 'bg-blue-500' },
            { name: 'AI & Intelligence', count: 57, color: 'bg-violet-500' },
            { name: 'Operations', count: 48, color: 'bg-emerald-500' },
            { name: 'Business', count: 55, color: 'bg-amber-500' },
            { name: 'Integration', count: 50, color: 'bg-pink-500' },
            { name: 'Platform', count: 140, color: 'bg-orange-500' },
          ].map(cat => (
            <div key={cat.name} className="bg-slate-700/20 rounded-lg p-2 text-center">
              <div className={`w-2 h-2 rounded-full ${cat.color} mx-auto mb-1`} />
              <div className="text-xs font-bold text-white">{cat.count}</div>
              <div className="text-[9px] text-slate-400">{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Webhook Event Payload Example */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Webhook Payload Format</h3>
        <div className="flex items-center gap-3 mb-3 text-[10px]">
          <Badge variant="info">HMAC-SHA256</Badge>
          <Badge>Content-Type: application/json</Badge>
          <Badge>X-BlueEdge-Signature</Badge>
          <Badge>Max 5 retries</Badge>
        </div>
        <pre className="bg-slate-900/80 rounded-lg p-4 text-[11px] text-slate-300 font-mono overflow-x-auto">
{`{
  "id": "evt-abc123",
  "event": "trip.completed",
  "timestamp": "2026-02-14T10:30:00Z",
  "data": {
    "tripId": "trip-456",
    "vehicleId": "veh-789",
    "driverId": "drv-012",
    "duration": 7200,
    "distanceKm": 145
  },
  "metadata": {
    "tenantId": "tenant-001",
    "fleetType": "tanker",
    "region": "dubai"
  }
}`}
        </pre>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: DATA FLOWS
   ═══════════════════════════════════════════════════════════════ */

function DataFlowsTab() {
  const flowColors: Record<string, { bg: string; border: string; text: string }> = {
    outbound: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    inbound: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    notification: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    webhook: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400' },
  };

  const totalRecords = DATA_FLOWS.reduce((sum, f) => sum + f.records24h, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricBox label="Active Flows" value={DATA_FLOWS.length} sub="All running normally" />
        <MetricBox label="Records (24h)" value={totalRecords.toLocaleString()} sub="Across all flows" trend="up" />
        <MetricBox label="Avg Latency" value="185ms" sub="End-to-end" trend="stable" />
        <MetricBox label="Error Rate" value="0.42%" sub="34 failed records" trend="down" />
      </div>

      {/* Flow Cards */}
      <div className="space-y-3">
        {DATA_FLOWS.map(flow => {
          const style = flowColors[flow.type] || flowColors.outbound;
          return (
            <div key={flow.id} className={`${style.bg} border ${style.border} rounded-xl p-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-slate-800 rounded-lg px-3 py-1.5">
                      <div className="text-[10px] text-slate-400">FROM</div>
                      <div className="text-sm font-medium text-white">{flow.from}</div>
                    </div>
                    <div className={`text-lg ${style.text}`}>
                      {flow.type === 'inbound' ? '←' : '→'}
                    </div>
                    <div className="bg-slate-800 rounded-lg px-3 py-1.5">
                      <div className="text-[10px] text-slate-400">TO</div>
                      <div className="text-sm font-medium text-white">{flow.to}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{flow.name}</div>
                    <div className="text-[10px] text-slate-400">Frequency: {flow.freq}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-white">{flow.records24h.toLocaleString()}</div>
                    <div className="text-[9px] text-slate-400">records/24h</div>
                  </div>
                  <Badge variant={flow.type === 'inbound' ? 'success' : flow.type === 'notification' ? 'info' : 'default'}>{flow.type}</Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Architecture Diagram (ASCII) */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Integration Architecture</h3>
        <div className="bg-slate-900/60 rounded-lg p-6 overflow-x-auto">
          <pre className="text-[11px] font-mono text-slate-400 leading-relaxed whitespace-pre">
{`┌─────────────────────────────────────────────────────────────────────┐
│                        BLUE EDGE PLATFORM                          │
│  ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────────┐   │
│  │ 53       │  │ 500      │  │ 73        │  │ 537              │   │
│  │ Modules  │  │ Endpoints│  │ Events    │  │ Tests            │   │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  └──────────────────┘   │
│       │              │              │                                │
│       └──────────────┼──────────────┘                                │
│                      │                                               │
│              ┌───────┴───────┐                                       │
│              │ INTEGRATION   │                                       │
│              │    HUB        │                                       │
│              └───┬───┬───┬───┘                                       │
└──────────────────┼───┼───┼───────────────────────────────────────────┘
                   │   │   │
    ┌──────────────┘   │   └──────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌────────┐     ┌────────────┐     ┌────────────┐
│ NOTIF  │     │    ERP     │     │    API     │
│ ENGINE │     │ CONNECTORS │     │ MARKETPLACE│
├────────┤     ├────────────┤     ├────────────┤
│WhatsApp│     │SAP S/4HANA │     │ API Keys   │
│  SMS   │     │Oracle TMS  │     │ Webhooks   │
│  Push  │     │Dynamics 365│     │ SDKs       │
│ Email  │     │Odoo/Custom │     │ Dev Portal │
└───┬────┘     └─────┬──────┘     └─────┬──────┘
    │                │                  │
    ▼                ▼                  ▼
 Drivers          SAP/Oracle       Customer Systems
 Managers         ERP Modules      Partner APIs
 Customers        Finance          Slack/Teams`}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TAB: HEALTH
   ═══════════════════════════════════════════════════════════════ */

function HealthTab() {
  const diagnosticResults = [
    { check: 'Notification Providers', status: 'pass', detail: '4/4 responsive', metric: '120ms avg' },
    { check: 'ERP Connections', status: 'pass', detail: '3/3 authenticated', metric: '253ms avg' },
    { check: 'Webhook Endpoints', status: 'warning', detail: '3/4 responsive', metric: '234ms avg' },
    { check: 'API Rate Limits', status: 'pass', detail: 'All within limits', metric: '42% util' },
    { check: 'Data Flow Integrity', status: 'pass', detail: 'No orphaned records', metric: 'Valid' },
    { check: 'TLS Certificates', status: 'pass', detail: 'All valid', metric: '89d nearest' },
    { check: 'Queue Depth', status: 'pass', detail: 'Notif:0 Sync:0 WH:2', metric: 'Clear' },
  ];

  return (
    <div className="space-y-6">
      {/* Health Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['notification', 'erp', 'api'].map(cat => {
          const components = HEALTH_COMPONENTS.filter(c => c.cat === cat);
          const allHealthy = components.every(c => c.status === 'healthy');
          const catLabels: Record<string, string> = { notification: '💬 Notification Providers', erp: '🏢 ERP Connectors', api: '🔑 API Infrastructure' };
          return (
            <div key={cat} className="bg-slate-800 rounded-xl border border-slate-700/50 p-5">
              <h3 className="text-sm font-semibold text-white mb-3 flex items-center justify-between">
                {catLabels[cat]}
                <StatusDot status={allHealthy ? 'healthy' : 'degraded'} />
              </h3>
              <div className="space-y-2">
                {components.map(comp => (
                  <div key={comp.name} className="flex items-center justify-between bg-slate-700/20 rounded-lg p-2.5">
                    <div className="flex items-center gap-2">
                      <StatusDot status={comp.status} />
                      <span className="text-xs text-white">{comp.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px]">
                      <span className={comp.latency > 500 ? 'text-amber-400' : 'text-slate-400'}>{comp.latency}ms</span>
                      <span className={comp.uptime < 99 ? 'text-amber-400' : 'text-emerald-400'}>{comp.uptime}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Diagnostic Results */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50">
        <div className="p-5 border-b border-slate-700/50">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            System Diagnostics
            <span className="text-[10px] text-emerald-400 font-normal">Last run: just now · 3.2s</span>
          </h3>
        </div>
        <div className="divide-y divide-slate-700/30">
          {diagnosticResults.map((d, i) => (
            <div key={i} className="p-4 flex items-center gap-4">
              <span className={`text-sm ${d.status === 'pass' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {d.status === 'pass' ? '✓' : '⚠'}
              </span>
              <div className="flex-1">
                <div className="text-sm text-white">{d.check}</div>
                <div className="text-[10px] text-slate-400">{d.detail}</div>
              </div>
              <code className="text-[10px] bg-slate-700/50 px-2 py-1 rounded text-slate-300">{d.metric}</code>
              <Badge variant={d.status === 'pass' ? 'success' : 'warning'}>{d.status.toUpperCase()}</Badge>
            </div>
          ))}
        </div>
        <div className="p-4 bg-amber-500/5 border-t border-amber-500/20">
          <div className="flex items-center gap-2 text-[11px] text-amber-400">
            <span>💡</span>
            <span>Recommendation: Monitor Dynamics 365 latency — consider reducing sync frequency if elevated latency persists.</span>
          </div>
        </div>
      </div>

      {/* Uptime History */}
      <div className="bg-slate-800 rounded-xl border border-slate-700/50 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Uptime — Last 14 Days</h3>
        <div className="space-y-2">
          {HEALTH_COMPONENTS.slice(0, 7).map(comp => (
            <div key={comp.name} className="flex items-center gap-3">
              <span className="text-[11px] text-slate-300 w-32 truncate">{comp.name}</span>
              <div className="flex-1 flex gap-[2px]">
                {Array.from({ length: 14 }, (_, day) => {
                  const isDown = comp.status === 'degraded' && day === 13;
                  const partialDown = comp.name === 'Dynamics 365' && (day === 10 || day === 7);
                  return (
                    <div
                      key={day}
                      className={`h-6 flex-1 rounded-sm ${isDown ? 'bg-amber-500' : partialDown ? 'bg-amber-500/50' : 'bg-emerald-500/70'}`}
                      title={`Day ${14 - day}: ${isDown ? 'Degraded' : partialDown ? 'Partial outage' : '100%'}`}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] text-slate-400 w-16 text-right">{comp.uptime}%</span>
            </div>
          ))}
          <div className="flex justify-between text-[9px] text-slate-500 ml-[140px] mr-[68px]">
            <span>14d ago</span><span>7d ago</span><span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function IntegrationHubPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('overview');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Integration Hub"
        subtitle="Unified command center — Notifications · ERP · API Marketplace · Health"
        breadcrumb="Integration"
        right={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5">
              <StatusDot status="healthy" />
              <span className="text-xs text-emerald-400 font-medium">System Healthy</span>
            </div>
            <div className="text-[10px] text-slate-400 bg-slate-700/50 rounded-lg px-3 py-1.5">
              50 endpoints · 4 modules
            </div>
          </div>
        }
      />

      <IntegrationTabs active={tab} onChange={setTab} />

      {tab === 'overview' && <OverviewTab />}
      {tab === 'notifications' && <NotificationsTab />}
      {tab === 'erp' && <ErpTab />}
      {tab === 'api' && <ApiTab />}
      {tab === 'dataflows' && <DataFlowsTab />}
      {tab === 'health' && <HealthTab />}
    </div>
  );
}
