// ══════════════════════════════════════════════════════════════
// Blue Edge — Geofence Automation Dashboard
// Differentiator: Rule-based automation with Dubai-specific zones
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { useFleetPositions, useSocketContext, useSocketEvent } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';

// ── Zone Types & Colors ──────────────────────────────────────
const ZONE_STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  hazmat:      { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    icon: '☢️' },
  school:      { bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  text: 'text-amber-400',  icon: '🏫' },
  restricted:  { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '🚫' },
  depot:       { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400',   icon: '🏭' },
  speed_zone:  { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', icon: '⚡' },
  border:      { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   icon: '🛂' },
  customer:    { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  icon: '📍' },
  port:        { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', icon: '⚓' },
};

const TRIGGER_STYLES: Record<string, { color: string; icon: string }> = {
  enter:       { color: 'text-green-400',  icon: '🟢' },
  exit:        { color: 'text-blue-400',   icon: '🔵' },
  dwell:       { color: 'text-amber-400',  icon: '⏱️' },
  speed:       { color: 'text-red-400',    icon: '⚡' },
  unauthorized:{ color: 'text-purple-400', icon: '🚫' },
  after_hours: { color: 'text-orange-400', icon: '🌙' },
  hazmat_zone: { color: 'text-red-400',    icon: '☢️' },
};

// ── Mock Data — Dubai zones ──────────────────────────────────
const ZONES = [
  { id: 'Z001', name: 'Jebel Ali Free Zone (JAFZA)', type: 'hazmat', lat: 25.0068, lng: 55.0831, radius: 2500, rules: 5, vehicles: 3, triggers24h: 14, enabled: true },
  { id: 'Z002', name: 'Al Barsha School Zone', type: 'school', lat: 25.1118, lng: 55.2012, radius: 500, rules: 2, vehicles: 1, triggers24h: 6, enabled: true },
  { id: 'Z003', name: 'Dubai International Airport', type: 'restricted', lat: 25.2532, lng: 55.3657, radius: 3000, rules: 4, vehicles: 5, triggers24h: 22, enabled: true },
  { id: 'Z004', name: 'ENOC Fuel Depot — Jebel Ali', type: 'depot', lat: 25.0194, lng: 55.1068, radius: 800, rules: 3, vehicles: 2, triggers24h: 8, enabled: true },
  { id: 'Z005', name: 'Sheikh Zayed Rd Speed Zone', type: 'speed_zone', lat: 25.1538, lng: 55.2175, radius: null, rules: 2, vehicles: 8, triggers24h: 31, enabled: true },
  { id: 'Z006', name: 'Hatta Border Crossing', type: 'border', lat: 24.7928, lng: 56.1082, radius: 1000, rules: 3, vehicles: 0, triggers24h: 2, enabled: true },
  { id: 'Z007', name: 'Mall of the Emirates', type: 'customer', lat: 25.1181, lng: 55.2006, radius: 300, rules: 2, vehicles: 1, triggers24h: 4, enabled: true },
  { id: 'Z008', name: 'Port Rashid Terminal', type: 'port', lat: 25.2683, lng: 55.2756, radius: 1500, rules: 4, vehicles: 4, triggers24h: 11, enabled: true },
  { id: 'Z009', name: 'Jumeirah School District', type: 'school', lat: 25.2106, lng: 55.2533, radius: 600, rules: 2, vehicles: 2, triggers24h: 5, enabled: true },
  { id: 'Z010', name: 'ADNOC Depot — Al Quoz', type: 'depot', lat: 25.1425, lng: 55.2312, radius: 600, rules: 3, vehicles: 1, triggers24h: 7, enabled: true },
];

const RULES = [
  { id: 'R001', name: 'HAZMAT Zone Entry Alert', zone: 'JAFZA', zoneId: 'Z001', trigger: 'enter', vehicleTypes: ['tanker'], actions: ['SMS safety officer', 'Speed limit 30 km/h', 'Compliance log'], schedule: 'Always', cooldown: '10 min', triggers: 142, enabled: true },
  { id: 'R002', name: 'School Zone Speed Enforcement', zone: 'Al Barsha School', zoneId: 'Z002', trigger: 'speed', vehicleTypes: ['all'], actions: ['Push alert dispatcher', 'Driver notification (AR)', 'Score penalty −5'], schedule: 'Sun-Thu 06:30-14:30', cooldown: '5 min', triggers: 28, enabled: true },
  { id: 'R003', name: 'Airport Dwell Time Alert', zone: 'DXB Airport', zoneId: 'Z003', trigger: 'dwell', vehicleTypes: ['taxi'], actions: ['Push alert dispatcher', 'Escalate at 30 min'], schedule: 'Always', cooldown: '15 min', triggers: 67, enabled: true },
  { id: 'R004', name: 'After-Hours Depot Access', zone: 'ENOC Depot', zoneId: 'Z004', trigger: 'after_hours', vehicleTypes: ['all'], actions: ['SMS security', 'Email fleet manager', 'Security log'], schedule: '22:00-06:00', cooldown: 'None', triggers: 8, enabled: true },
  { id: 'R005', name: 'Sheikh Zayed Speed Camera Zone', zone: 'SZR Corridor', zoneId: 'Z005', trigger: 'speed', vehicleTypes: ['all'], actions: ['Driver alert (AR)', 'Speed compliance log'], schedule: 'Always', cooldown: '1 min', triggers: 312, enabled: true },
  { id: 'R006', name: 'Border Crossing Documentation', zone: 'Hatta Border', zoneId: 'Z006', trigger: 'enter', vehicleTypes: ['tanker', 'bus'], actions: ['Alert compliance officer', 'Document checklist', 'Cross-border log'], schedule: 'Always', cooldown: 'None', triggers: 45, enabled: true },
  { id: 'R007', name: 'Customer Site Arrival Notify', zone: 'MoE Delivery', zoneId: 'Z007', trigger: 'enter', vehicleTypes: ['tanker'], actions: ['SMS customer ETA', 'Dispatcher notification'], schedule: 'Always', cooldown: '30 min', triggers: 89, enabled: true },
  { id: 'R008', name: 'Port Entry — HAZMAT Check', zone: 'Port Rashid', zoneId: 'Z008', trigger: 'enter', vehicleTypes: ['tanker'], actions: ['Verify HAZMAT permit', 'Cargo manifest check', 'Port authority log'], schedule: 'Always', cooldown: 'None', triggers: 56, enabled: true },
  { id: 'R009', name: 'Unauthorized Vehicle in Zone', zone: 'JAFZA', zoneId: 'Z001', trigger: 'unauthorized', vehicleTypes: ['bus', 'taxi'], actions: ['Alert security', 'Immobilize if >5 min', 'Incident log'], schedule: 'Always', cooldown: '5 min', triggers: 3, enabled: true },
  { id: 'R010', name: 'School Zone — Bus Only After Hours', zone: 'Jumeirah School', zoneId: 'Z009', trigger: 'after_hours', vehicleTypes: ['tanker', 'taxi'], actions: ['Route deviation alert', 'Dispatcher notification'], schedule: '15:00-06:00', cooldown: '10 min', triggers: 11, enabled: true },
];

const RECENT_TRIGGERS = [
  { id: 'T001', time: '14:23', ago: '2 min ago', rule: 'HAZMAT Zone Entry Alert', vehicle: 'DXB-7291', driver: 'أحمد الراشدي', zone: 'JAFZA HAZMAT Zone', type: 'enter', status: 'triggered', actions: ['SMS → safety officer ✓', 'Speed limit → 30 km/h ✓'], severity: 'high' },
  { id: 'T002', time: '14:18', ago: '7 min ago', rule: 'School Zone Speed', vehicle: 'BUS-1103', driver: 'خالد إبراهيم', zone: 'Al Barsha School', type: 'speed', status: 'acknowledged', actions: ['Push → dispatcher ✓', 'Driver notified ✓', 'Score: −5 ✓'], data: { speed: 52, limit: 40 }, severity: 'medium' },
  { id: 'T003', time: '14:12', ago: '13 min ago', rule: 'Airport Dwell Time', vehicle: 'TAXI-2201', driver: 'عمر فريد', zone: 'DXB Airport T3', type: 'dwell', status: 'resolved', actions: ['Push → dispatcher ✓'], data: { dwellMin: 18 }, severity: 'low' },
  { id: 'T004', time: '14:05', ago: '20 min ago', rule: 'SZR Speed Camera Zone', vehicle: 'DXB-4490', driver: 'محمد حسن', zone: 'Sheikh Zayed Rd', type: 'speed', status: 'resolved', actions: ['Driver alert (AR) ✓', 'Log ✓'], data: { speed: 128, limit: 120 }, severity: 'medium' },
  { id: 'T005', time: '13:48', ago: '37 min ago', rule: 'Port Entry HAZMAT Check', vehicle: 'DXB-8834', driver: 'سعيد المنصوري', zone: 'Port Rashid', type: 'enter', status: 'resolved', actions: ['HAZMAT permit ✓', 'Manifest ✓', 'Port log ✓'], severity: 'high' },
  { id: 'T006', time: '13:30', ago: '55 min ago', rule: 'Customer Arrival Notify', vehicle: 'DXB-5512', driver: 'يوسف العلي', zone: 'Mall of Emirates', type: 'enter', status: 'resolved', actions: ['SMS customer ✓', 'Dispatcher ✓'], severity: 'low' },
  { id: 'T007', time: '12:15', ago: '2h ago', rule: 'After-Hours Depot Access', vehicle: 'TAXI-3302', driver: 'Unknown', zone: 'ENOC Depot', type: 'after_hours', status: 'investigating', actions: ['SMS security ✓', 'Email FM ✓'], severity: 'high' },
  { id: 'T008', time: '08:42', ago: '6h ago', rule: 'Unauthorized Vehicle', vehicle: 'TAXI-2201', driver: 'عمر فريد', zone: 'JAFZA HAZMAT', type: 'unauthorized', status: 'false_alarm', actions: ['Security alerted', 'Cleared after verification'], severity: 'medium' },
];

// ── Status helpers ────────────────────────────────────────────
function statusBadge(status: string) {
  const styles: Record<string, string> = {
    triggered: 'bg-red-500/20 text-red-400 border-red-500/30',
    acknowledged: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    resolved: 'bg-green-500/20 text-green-400 border-green-500/30',
    investigating: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    false_alarm: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
  };
  return <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${styles[status] || ''}`}>{status.replace('_', ' ').toUpperCase()}</span>;
}

function severityDot(sev: string) {
  const c = sev === 'high' ? 'bg-red-500' : sev === 'medium' ? 'bg-amber-500' : 'bg-green-500';
  return <span className={`inline-block w-2 h-2 rounded-full ${c}`} />;
}

// ── Mini map representation (SVG-based Dubai outline) ─────────
function ZoneMapPreview({ zones }: { zones: typeof ZONES }) {
  // Simplified Dubai bounding box: lat 24.7-25.35, lng 54.9-56.2
  const mapW = 400, mapH = 220;
  const latMin = 24.7, latMax = 25.35, lngMin = 54.95, lngMax = 55.55;

  function project(lat: number, lng: number): [number, number] {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * mapW;
    const y = ((latMax - lat) / (latMax - latMin)) * mapH;
    return [x, y];
  }

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${mapW} ${mapH}`} className="rounded-lg">
      {/* Background */}
      <rect width={mapW} height={mapH} fill="var(--bg-primary)" rx="8" />

      {/* Grid lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`v${i}`} x1={(i + 1) * (mapW / 8)} y1={0} x2={(i + 1) * (mapW / 8)} y2={mapH} stroke="var(--border)" strokeWidth="0.5" />
      ))}
      {Array.from({ length: 5 }, (_, i) => (
        <line key={`h${i}`} x1={0} y1={(i + 1) * (mapH / 5)} x2={mapW} y2={(i + 1) * (mapH / 5)} stroke="var(--border)" strokeWidth="0.5" />
      ))}

      {/* Dubai coastline hint */}
      <path d="M 20 120 Q 80 100 140 110 Q 200 115 260 105 Q 320 95 380 100" fill="none" stroke="#1e3a5f" strokeWidth="1.5" opacity="0.5" />

      {/* Zones */}
      {zones.map(z => {
        const [x, y] = project(z.lat, z.lng);
        const r = z.radius ? Math.max(8, Math.min(z.radius / 150, 25)) : 12;
        const style = ZONE_STYLES[z.type];
        const fillColor = z.type === 'hazmat' ? '#ef444440' : z.type === 'school' ? '#f59e0b40' : z.type === 'restricted' ? '#a855f740' :
          z.type === 'depot' ? '#3b82f640' : z.type === 'speed_zone' ? '#f9731640' : z.type === 'border' ? '#22d3ee40' :
          z.type === 'port' ? '#6366f140' : '#22c55e40';
        const strokeColor = fillColor.replace('40', 'aa');

        return (
          <g key={z.id}>
            {/* Pulse animation for active vehicles */}
            {z.vehicles > 0 && (
              <circle cx={x} cy={y} r={r + 4} fill="none" stroke={strokeColor} strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values={`${r};${r + 8};${r}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={x} cy={y} r={r} fill={fillColor} stroke={strokeColor} strokeWidth="1.5" />
            <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="white">
              {style.icon}
            </text>
            {/* Label */}
            <text x={x} y={y + r + 10} textAnchor="middle" fontSize="6" fill="#94a3b8">
              {z.name.length > 18 ? z.name.slice(0, 16) + '…' : z.name}
            </text>
            {/* Vehicle count */}
            {z.vehicles > 0 && (
              <g>
                <circle cx={x + r - 2} cy={y - r + 2} r="6" fill="var(--bg-primary)" stroke={strokeColor} strokeWidth="1" />
                <text x={x + r - 2} y={y - r + 3} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#e2e8f0" fontWeight="bold">
                  {z.vehicles}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform={`translate(10, ${mapH - 45})`}>
        <rect width="130" height="40" rx="4" fill="var(--bg-primary)" stroke="var(--border)" strokeWidth="1" />
        {[
          { icon: '☢️', label: 'HAZMAT', x: 8 },
          { icon: '🏫', label: 'School', x: 50 },
          { icon: '🚫', label: 'Restricted', x: 85 },
        ].map((l, i) => (
          <g key={l.label} transform={`translate(${l.x}, 8)`}>
            <text fontSize="7">{l.icon}</text>
            <text x="10" y="1" fontSize="6" fill="#94a3b8" dominantBaseline="middle">{l.label}</text>
          </g>
        ))}
        {[
          { icon: '🏭', label: 'Depot', x: 8 },
          { icon: '⚡', label: 'Speed', x: 50 },
          { icon: '🛂', label: 'Border', x: 85 },
        ].map((l, i) => (
          <g key={l.label} transform={`translate(${l.x}, 22)`}>
            <text fontSize="7">{l.icon}</text>
            <text x="10" y="1" fontSize="6" fill="#94a3b8" dominantBaseline="middle">{l.label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

// ── Component ────────────────────────────────────────────────
export default function GeofenceAutomationPage() {
  const { connected: wsConnected } = useSocketContext();
  const { count: liveCount } = useFleetPositions();
  useSocketEvent('geofence:entered', () => {}, []);
  useSocketEvent('geofence:exited', () => {}, []);
  const [tab, setTab] = useState('overview');
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [triggerFilter, setTriggerFilter] = useState('all');

  const filteredTriggers = useMemo(() => {
    if (triggerFilter === 'all') return RECENT_TRIGGERS;
    return RECENT_TRIGGERS.filter(t => t.type === triggerFilter);
  }, [triggerFilter]);

  const totalTriggers24h = ZONES.reduce((s, z) => s + z.triggers24h, 0);
  const activeVehiclesInZones = ZONES.reduce((s, z) => s + z.vehicles, 0);

  return (
    <div>
      <PageHeader
        title="📍 Geofence Automation"
        breadcrumb="Intelligence"
        subtitle="Zone-based rule engine • Real-time triggers • Dubai-optimized"
      />

      {/* ── KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="stat-card">
          <div className="stat-value text-cyan-400">{ZONES.length}</div>
          <div className="stat-label">Active Zones</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-blue-400">{RULES.length}</div>
          <div className="stat-label">Automation Rules</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-amber-400">{totalTriggers24h}</div>
          <div className="stat-label">Triggers (24h)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-green-400">{activeVehiclesInZones}</div>
          <div className="stat-label">Vehicles in Zones</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-emerald-400">340ms</div>
          <div className="stat-label">Avg Response Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-purple-400">98.1%</div>
          <div className="stat-label">Automation Rate</div>
        </div>
      </div>

      {/* ── Zone Map + Zone List ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 card p-4">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Zone Map — Dubai</h3>
          <div className="w-full" style={{ minHeight: 220 }}>
            <ZoneMapPreview zones={ZONES} />
          </div>
        </div>

        <div className="card p-4 max-h-80 overflow-y-auto">
          <h3 className="text-sm font-semibold text-slate-400 mb-3">Zones ({ZONES.length})</h3>
          <div className="space-y-2">
            {ZONES.map(z => {
              const style = ZONE_STYLES[z.type];
              return (
                <div key={z.id}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${selectedZone === z.id ? 'bg-slate-700/50 border-cyan-500/40' : `${style.bg} ${style.border} hover:bg-slate-700/30`}`}
                  onClick={() => setSelectedZone(selectedZone === z.id ? null : z.id)}>
                  <div className="flex items-center gap-2">
                    <span>{style.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-slate-200 truncate">{z.name}</div>
                      <div className="text-[10px] text-slate-500">{z.rules} rules • {z.vehicles} vehicles • {z.triggers24h} triggers/24h</div>
                    </div>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
                      {z.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────── */}
      <div className="flex gap-2 mb-4 border-b border-slate-700 pb-2">
        {[
          { id: 'overview', label: '⚡ Live Triggers' },
          { id: 'rules', label: '⚙️ Automation Rules' },
          { id: 'analytics', label: '📊 Analytics' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${tab === t.id ? 'bg-slate-700 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ LIVE TRIGGERS TAB ═════════════════════════════════ */}
      {tab === 'overview' && (
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-semibold text-slate-200">Recent Triggers ({filteredTriggers.length})</h3>
            <div className="flex gap-1 flex-wrap">
              {['all', 'enter', 'speed', 'dwell', 'after_hours', 'unauthorized'].map(f => (
                <button key={f} onClick={() => setTriggerFilter(f)}
                  className={`px-2.5 py-1 rounded text-[10px] font-medium transition-colors ${triggerFilter === f ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-400 hover:text-slate-200'}`}>
                  {f === 'all' ? 'All' : (TRIGGER_STYLES[f]?.icon || '') + ' ' + f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-slate-700/50">
            {filteredTriggers.map(t => (
              <div key={t.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center mt-1">
                    {severityDot(t.severity)}
                    <div className="w-px h-8 bg-slate-700 mt-1" />
                  </div>

                  {/* Time */}
                  <div className="w-16 shrink-0">
                    <div className="text-sm font-mono text-slate-300">{t.time}</div>
                    <div className="text-[10px] text-slate-500">{t.ago}</div>
                  </div>

                  {/* Trigger info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-200">{t.rule}</span>
                      <span className="text-[10px]">{TRIGGER_STYLES[t.type]?.icon}</span>
                      {statusBadge(t.status)}
                    </div>
                    <div className="text-xs text-slate-400">
                      <span className="font-mono text-slate-300">{t.vehicle}</span>
                      <span className="mx-1.5">•</span>
                      <span>{t.driver}</span>
                      <span className="mx-1.5">•</span>
                      <span>{t.zone}</span>
                      {(t as any).data && (
                        <>
                          <span className="mx-1.5">•</span>
                          <span className="text-amber-400 font-mono">
                            {(t as any).data.speed ? `${(t as any).data.speed} km/h (limit ${(t as any).data.limit})` : ''}
                            {(t as any).data.dwellMin ? `Dwell: ${(t as any).data.dwellMin} min` : ''}
                          </span>
                        </>
                      )}
                    </div>
                    {/* Actions executed */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {t.actions.map((a, i) => (
                        <span key={i} className="text-[10px] bg-slate-700/80 text-slate-400 px-2 py-0.5 rounded">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ RULES TAB ═════════════════════════════════════════ */}
      {tab === 'rules' && (
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-semibold text-slate-200">Automation Rules ({RULES.length})</h3>
            <button className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded text-xs font-medium hover:bg-cyan-500/30">
              + Create Rule
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-xs text-slate-500 uppercase">
                  <th className="text-left p-3">Rule</th>
                  <th className="text-left p-3">Zone</th>
                  <th className="text-center p-3">Trigger</th>
                  <th className="text-left p-3">Vehicles</th>
                  <th className="text-left p-3">Actions</th>
                  <th className="text-center p-3">Schedule</th>
                  <th className="text-center p-3">Cooldown</th>
                  <th className="text-center p-3">Fired</th>
                  <th className="text-center p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {RULES.map(r => {
                  const tStyle = TRIGGER_STYLES[r.trigger];
                  return (
                    <tr key={r.id} className="hover:bg-slate-800/50">
                      <td className="p-3">
                        <div className="font-medium text-slate-200 text-xs">{r.name}</div>
                      </td>
                      <td className="p-3 text-xs text-slate-400">{r.zone}</td>
                      <td className="p-3 text-center">
                        <span className={`text-xs font-mono ${tStyle?.color || ''}`}>
                          {tStyle?.icon} {r.trigger.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {r.vehicleTypes.map(v => (
                            <span key={v} className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-400">{v}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-1">
                          {r.actions.slice(0, 2).map((a, i) => (
                            <span key={i} className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-400">{a}</span>
                          ))}
                          {r.actions.length > 2 && (
                            <span className="text-[10px] text-slate-500">+{r.actions.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-center text-[10px] text-slate-400 font-mono">{r.schedule}</td>
                      <td className="p-3 text-center text-[10px] text-slate-400 font-mono">{r.cooldown}</td>
                      <td className="p-3 text-center font-mono text-slate-300">{r.triggers}</td>
                      <td className="p-3 text-center">
                        <span className={`inline-block w-2 h-2 rounded-full ${r.enabled ? 'bg-green-400' : 'bg-slate-500'}`} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ ANALYTICS TAB ═════════════════════════════════════ */}
      {tab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Triggers by zone type */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">Triggers by Zone Type (24h)</h3>
            <div className="space-y-3">
              {Object.entries(
                ZONES.reduce((acc, z) => {
                  acc[z.type] = (acc[z.type] || 0) + z.triggers24h;
                  return acc;
                }, {} as Record<string, number>)
              ).sort(([, a], [, b]) => b - a).map(([type, count]) => {
                const style = ZONE_STYLES[type];
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className="w-6 text-center">{style?.icon}</span>
                    <span className="text-xs text-slate-400 w-24 capitalize">{type.replace('_', ' ')}</span>
                    <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${style?.bg.replace('/10', '/60') || 'bg-slate-500'}`}
                        style={{ width: `${(count / totalTriggers24h) * 100}%`, background: type === 'speed_zone' ? '#f97316' : type === 'hazmat' ? '#ef4444' : type === 'restricted' ? '#a855f7' : type === 'depot' ? '#3b82f6' : type === 'school' ? '#f59e0b' : type === 'port' ? '#6366f1' : type === 'border' ? '#22d3ee' : '#22c55e' }} />
                    </div>
                    <span className="text-xs font-mono text-slate-300 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Triggers by type */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">Trigger Types Distribution</h3>
            <div className="space-y-3">
              {Object.entries(
                RECENT_TRIGGERS.reduce((acc, t) => {
                  acc[t.type] = (acc[t.type] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).sort(([, a], [, b]) => b - a).map(([type, count]) => {
                const style = TRIGGER_STYLES[type];
                return (
                  <div key={type} className="flex items-center gap-3">
                    <span className="w-6 text-center">{style?.icon}</span>
                    <span className={`text-xs w-28 capitalize ${style?.color || 'text-slate-400'}`}>{type.replace('_', ' ')}</span>
                    <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-cyan-500/70" style={{ width: `${(count / RECENT_TRIGGERS.length) * 100}%` }} />
                    </div>
                    <span className="text-xs font-mono text-slate-300 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Automation performance */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">Automation Engine Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Rules Processed', value: '1,240', sub: 'today', color: 'text-cyan-400' },
                { label: 'Actions Executed', value: '892', sub: '72% of processed', color: 'text-green-400' },
                { label: 'False Alarms', value: '12', sub: '0.97% rate', color: 'text-amber-400' },
                { label: 'Avg Response', value: '340ms', sub: 'p99: 890ms', color: 'text-blue-400' },
                { label: 'Uptime', value: '99.98%', sub: '2min downtime/mo', color: 'text-emerald-400' },
                { label: 'Queue Depth', value: '3', sub: 'real-time', color: 'text-purple-400' },
              ].map(s => (
                <div key={s.label} className="bg-slate-800 p-3 rounded-lg">
                  <div className={`text-lg font-bold font-mono ${s.color}`}>{s.value}</div>
                  <div className="text-xs text-slate-400">{s.label}</div>
                  <div className="text-[10px] text-slate-500">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Dubai-specific insights */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">🇦🇪 Dubai Compliance Insights</h3>
            <div className="space-y-3">
              {[
                { label: 'RTA Speed Compliance', value: 96.8, target: 95, unit: '%', status: 'pass' },
                { label: 'HAZMAT Zone Notifications', value: 100, target: 100, unit: '%', status: 'pass' },
                { label: 'School Zone Adherence', value: 92.3, target: 95, unit: '%', status: 'warn' },
                { label: 'Cross-Border Documentation', value: 98.5, target: 98, unit: '%', status: 'pass' },
                { label: 'Port Authority Response', value: 340, target: 500, unit: 'ms', status: 'pass' },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${m.status === 'pass' ? 'bg-green-400' : 'bg-amber-400'}`} />
                  <span className="text-xs text-slate-400 flex-1">{m.label}</span>
                  <span className="text-xs font-mono text-slate-300">{m.value}{m.unit}</span>
                  <span className="text-[10px] text-slate-500">target: {m.target}{m.unit}</span>
                </div>
              ))}
              <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <p className="text-xs text-amber-400">
                  ⚠️ <strong>Action Required:</strong> School zone adherence at 92.3% is below the 95% target. 3 speed events on Al Barsha route this week. Recommend driver coaching for routes 22 and 53.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
