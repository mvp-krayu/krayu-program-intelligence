import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/ui/StatCard';
import TabBar from '@/components/ui/TabBar';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';

/* ── Mock Data ─────────────────────────────────────────────────── */
const TENANTS = [
  { id: 't-001', name: 'Blue Edge Network LLC', slug: 'blue-edge', status: 'active', plan: 'enterprise', region: 'UAE', emirate: 'Dubai', vehicles: 156, drivers: 234, users: 42, mrr: 25000, onboardingComplete: true },
  { id: 't-002', name: 'ENOC Fleet Services', slug: 'enoc-fleet', status: 'active', plan: 'enterprise', region: 'UAE', emirate: 'Dubai', vehicles: 85, drivers: 120, users: 18, mrr: 25000, onboardingComplete: true },
  { id: 't-003', name: 'RTA Dubai Transport', slug: 'rta-dubai', status: 'active', plan: 'unlimited', region: 'UAE', emirate: 'Dubai', vehicles: 320, drivers: 480, users: 85, mrr: 50000, onboardingComplete: true },
  { id: 't-004', name: 'Al Futtaim Logistics', slug: 'al-futtaim', status: 'active', plan: 'professional', region: 'UAE', emirate: 'Dubai', vehicles: 68, drivers: 95, users: 12, mrr: 7500, onboardingComplete: true },
  { id: 't-005', name: 'Sharjah Transport Corp', slug: 'sharjah-transport', status: 'trial', plan: 'professional', region: 'UAE', emirate: 'Sharjah', vehicles: 15, drivers: 22, users: 4, mrr: 0, onboardingComplete: false },
  { id: 't-006', name: 'Dubai Municipality Fleet', slug: 'dubai-municipality', status: 'active', plan: 'enterprise', region: 'UAE', emirate: 'Dubai', vehicles: 215, drivers: 310, users: 55, mrr: 25000, onboardingComplete: true },
  { id: 't-007', name: 'Oman Express Freight', slug: 'oman-express', status: 'active', plan: 'professional', region: 'GCC', emirate: null, vehicles: 45, drivers: 62, users: 8, mrr: 7500, onboardingComplete: true },
  { id: 't-008', name: 'Sharjah Cargo Solutions', slug: 'sharjah-cargo', status: 'active', plan: 'professional', region: 'Northern Emirates', emirate: null, vehicles: 87, drivers: 110, users: 14, mrr: 7500, onboardingComplete: true },
  { id: 't-009', name: 'SwissFleet GmbH', slug: 'swissfleet', status: 'active', plan: 'starter', region: 'Europe', emirate: null, vehicles: 22, drivers: 28, users: 3, mrr: 2500, onboardingComplete: true },
  { id: 't-010', name: 'Test Company LLC', slug: 'test-company', status: 'suspended', plan: 'starter', region: 'UAE', emirate: 'Ajman', vehicles: 5, drivers: 8, users: 2, mrr: 0, onboardingComplete: true },
];

const PLANS = [
  { plan: 'starter', name: 'Starter', maxVehicles: 25, maxDrivers: 50, maxUsers: 5, monthlyRate: 2500, color: '#6b7280' },
  { plan: 'professional', name: 'Professional', maxVehicles: 100, maxDrivers: 200, maxUsers: 20, monthlyRate: 7500, color: '#3b82f6' },
  { plan: 'enterprise', name: 'Enterprise', maxVehicles: 500, maxDrivers: 1000, maxUsers: 100, monthlyRate: 25000, color: '#8b5cf6' },
  { plan: 'unlimited', name: 'Unlimited', maxVehicles: 999999, maxDrivers: 999999, maxUsers: 999999, monthlyRate: 50000, color: '#f59e0b' },
];

const RLS_CHECKS = [
  { check: 'All queries include tenant_id filter', status: 'passed', entities: 42 },
  { check: 'No cross-tenant data leakage detected', status: 'passed', queriesAudited: 15840 },
  { check: 'API responses filtered by tenant context', status: 'passed', endpoints: 380 },
  { check: 'WebSocket rooms isolated per tenant', status: 'passed', rooms: 3 },
  { check: 'File storage separated by tenant prefix', status: 'passed', buckets: 1 },
  { check: 'Cache keys namespaced by tenant', status: 'passed', namespaces: 10 },
  { check: 'Audit log entries tagged with tenant_id', status: 'passed', entries: 24563 },
];

const ACTIVITY = [
  { action: 'tenant_created', tenant: 'Sharjah Transport Corp', time: '2h ago', icon: '🆕' },
  { action: 'plan_upgraded', tenant: 'ENOC Fleet Services', time: '1d ago', icon: '⬆️' },
  { action: 'onboarding_complete', tenant: 'Al Futtaim Logistics', time: '1d ago', icon: '✅' },
  { action: 'payment_received', tenant: 'Dubai Municipality', time: '2d ago', icon: '💰' },
  { action: 'tenant_suspended', tenant: 'Test Company LLC', time: '3d ago', icon: '⛔' },
];

/* ── Status / Plan Badges ──────────────────────────────────────── */
const statusColors: Record<string, string> = { active: 'bg-emerald-500/20 text-emerald-400', trial: 'bg-amber-500/20 text-amber-400', suspended: 'bg-red-500/20 text-red-400', pending_setup: 'bg-blue-500/20 text-blue-400' };
const planColors: Record<string, string> = { starter: 'bg-slate-500/20 text-slate-400', professional: 'bg-blue-500/20 text-blue-400', enterprise: 'bg-violet-500/20 text-violet-400', unlimited: 'bg-amber-500/20 text-amber-400' };

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-slate-600 text-slate-300'}`}>{status}</span>
);
const PlanBadge = ({ plan }: { plan: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planColors[plan] || 'bg-slate-600 text-slate-300'}`}>{plan}</span>
);

/* ── Plan Distribution SVG ─────────────────────────────────────── */
function PlanDistributionChart() {
  const dist = [
    { plan: 'Starter', count: 3, color: '#6b7280' },
    { plan: 'Professional', count: 4, color: '#3b82f6' },
    { plan: 'Enterprise', count: 2, color: '#8b5cf6' },
    { plan: 'Unlimited', count: 1, color: '#f59e0b' },
  ];
  const total = dist.reduce((s, d) => s + d.count, 0);
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 36 36" className="w-28 h-28">
        {dist.map((d, i) => {
          const pct = (d.count / total) * 100;
          const dashArray = `${pct} ${100 - pct}`;
          const el = <circle key={i} cx="18" cy="18" r="15.91" fill="none" stroke={d.color} strokeWidth="3" strokeDasharray={dashArray} strokeDashoffset={-offset} className="transition-all duration-700" />;
          offset += pct;
          return el;
        })}
        <text x="18" y="17" textAnchor="middle" className="fill-white text-[5px] font-bold">{total}</text>
        <text x="18" y="22" textAnchor="middle" className="fill-slate-400 text-[3px]">tenants</text>
      </svg>
      <div className="space-y-1.5">
        {dist.map(d => (
          <div key={d.plan} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
            <span className="text-slate-300 w-20">{d.plan}</span>
            <span className="text-white font-medium">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── MRR Trend SVG ─────────────────────────────────────────────── */
function MrrTrendChart() {
  const data = [85, 92.5, 105, 115, 127.5, 137.5]; // in thousands
  const max = Math.max(...data) * 1.1;
  const w = 280, h = 100, px = 30, py = 10;
  const points = data.map((v, i) => `${px + (i / (data.length - 1)) * (w - px * 2)},${h - py - ((v / max) * (h - py * 2))}`).join(' ');
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];

  return (
    <svg viewBox={`0 0 ${w} ${h + 20}`} className="w-full h-32">
      <defs>
        <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0891b2" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`${points} ${px + (w - px * 2)},${h - py} ${px},${h - py}`} fill="url(#mrrGrad)" />
      <polyline points={points} fill="none" stroke="#0891b2" strokeWidth="2" />
      {data.map((v, i) => {
        const x = px + (i / (data.length - 1)) * (w - px * 2);
        const y = h - py - ((v / max) * (h - py * 2));
        return <g key={i}>
          <circle cx={x} cy={y} r="3" fill="#0891b2" />
          <text x={x} y={h + 12} textAnchor="middle" className="fill-slate-400 text-[8px]">{months[i]}</text>
        </g>;
      })}
      <text x={px - 4} y={py + 4} textAnchor="end" className="fill-slate-500 text-[7px]">{Math.round(max)}K</text>
      <text x={px - 4} y={h - py + 4} textAnchor="end" className="fill-slate-500 text-[7px]">0</text>
    </svg>
  );
}

/* ── Main Page Component ───────────────────────────────────────── */
export default function MultiTenantPage() {
  const [tab, setTab] = useState('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  const tabs = ['dashboard', 'tenants', 'plans', 'rls-audit'];

  const totalMrr = TENANTS.reduce((s, t) => s + t.mrr, 0);
  const totalVehicles = TENANTS.reduce((s, t) => s + t.vehicles, 0);
  const activeTenants = TENANTS.filter(t => t.status === 'active').length;

  const filteredTenants = statusFilter === 'all' ? TENANTS : TENANTS.filter(t => t.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="Multi-Tenant Platform" subtitle="SaaS tenant management, billing, and row-level security" />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {/* ── Dashboard ──────────────────────────────────────────── */}
      {tab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Tenants" value={TENANTS.length} icon="🏢" />
            <StatCard label="Active" value={activeTenants} icon="✅" />
            <StatCard label="MRR" value={`AED ${(totalMrr / 1000).toFixed(1)}K`} icon="💰" />
            <StatCard label="Total Vehicles" value={totalVehicles.toLocaleString()} icon="🚛" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-4">Plan Distribution</h3>
              <PlanDistributionChart />
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-2">MRR Trend (AED K)</h3>
              <MrrTrendChart />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Growth Metrics</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: 'New This Month', value: '3', trend: '+50%' },
                  { label: 'Churn Rate', value: '2.1%', trend: '-0.3%' },
                  { label: 'Net Revenue Retention', value: '118%', trend: '+5%' },
                  { label: 'Avg Onboarding', value: '3.2 days', trend: '-0.5d' },
                  { label: 'ARPU', value: 'AED 13.8K', trend: '+8%' },
                  { label: 'ARR', value: 'AED 1.65M', trend: '+15%' },
                ].map(m => (
                  <div key={m.label} className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400">{m.label}</div>
                    <div className="text-lg font-bold text-white">{m.value}</div>
                    <div className={`text-xs ${m.trend.startsWith('+') || m.trend.startsWith('-0') ? 'text-emerald-400' : 'text-red-400'}`}>{m.trend}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Recent Activity</h3>
              <div className="space-y-3">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-lg mt-[-2px]">{a.icon}</span>
                    <div>
                      <span className="text-white font-medium">{a.tenant}</span>
                      <div className="text-slate-400">{a.action.replace(/_/g, ' ')} · {a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Tenants List ───────────────────────────────────────── */}
      {tab === 'tenants' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {['all', 'active', 'trial', 'suspended'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${statusFilter === s ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)} {s === 'all' ? `(${TENANTS.length})` : `(${TENANTS.filter(t => t.status === s).length})`}
              </button>
            ))}
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-700">
                  <th className="text-left p-3 font-medium">Tenant</th>
                  <th className="text-left p-3 font-medium">Plan</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Vehicles</th>
                  <th className="text-right p-3 font-medium">Drivers</th>
                  <th className="text-right p-3 font-medium">Users</th>
                  <th className="text-right p-3 font-medium">MRR (AED)</th>
                  <th className="text-left p-3 font-medium">Region</th>
                </tr>
              </thead>
              <tbody>
                {filteredTenants.map(t => (
                  <tr key={t.id} onClick={() => setSelectedTenant(t.id === selectedTenant ? null : t.id)}
                    className={`border-b border-slate-700/50 cursor-pointer transition ${selectedTenant === t.id ? 'bg-cyan-900/20' : 'hover:bg-slate-700/30'}`}>
                    <td className="p-3">
                      <div className="text-white font-medium">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.slug}</div>
                    </td>
                    <td className="p-3"><PlanBadge plan={t.plan} /></td>
                    <td className="p-3"><StatusBadge status={t.status} /></td>
                    <td className="p-3 text-right text-slate-300">{t.vehicles}</td>
                    <td className="p-3 text-right text-slate-300">{t.drivers}</td>
                    <td className="p-3 text-right text-slate-300">{t.users}</td>
                    <td className="p-3 text-right font-medium text-white">{t.mrr > 0 ? t.mrr.toLocaleString() : '—'}</td>
                    <td className="p-3 text-slate-400 text-xs">{t.region}{t.emirate ? ` · ${t.emirate}` : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedTenant && (() => {
            const t = TENANTS.find(x => x.id === selectedTenant)!;
            const planLimits = PLANS.find(p => p.plan === t.plan);
            return (
              <div className="bg-slate-800 rounded-xl p-5 border border-cyan-700/40">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">{t.name}</h3>
                  <div className="flex gap-2">
                    <StatusBadge status={t.status} />
                    <PlanBadge plan={t.plan} />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <UsageBar label="Vehicles" current={t.vehicles} max={planLimits?.maxVehicles || 100} />
                  <UsageBar label="Drivers" current={t.drivers} max={planLimits?.maxDrivers || 200} />
                  <UsageBar label="Users" current={t.users} max={planLimits?.maxUsers || 20} />
                  <div className="bg-slate-700/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400">Monthly Rate</div>
                    <div className="text-lg font-bold text-white">AED {t.mrr.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {t.status === 'active' && <button className="px-3 py-1.5 bg-red-600/20 text-red-400 rounded-lg text-xs hover:bg-red-600/30">Suspend</button>}
                  {t.status === 'suspended' && <button className="px-3 py-1.5 bg-emerald-600/20 text-emerald-400 rounded-lg text-xs hover:bg-emerald-600/30">Reactivate</button>}
                  <button className="px-3 py-1.5 bg-violet-600/20 text-violet-400 rounded-lg text-xs hover:bg-violet-600/30">Change Plan</button>
                  <button className="px-3 py-1.5 bg-slate-600/20 text-slate-400 rounded-lg text-xs hover:bg-slate-600/30">Edit Settings</button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ── Plans ──────────────────────────────────────────────── */}
      {tab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(p => {
            const tenantCount = TENANTS.filter(t => t.plan === p.plan).length;
            return (
              <div key={p.plan} className="bg-slate-800 rounded-xl p-5 border border-slate-700 hover:border-cyan-600/40 transition">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                  <h3 className="text-white font-semibold">{p.name}</h3>
                </div>
                <div className="text-2xl font-bold text-white mb-1">AED {p.monthlyRate.toLocaleString()}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                <div className="text-xs text-slate-400 mb-4">{tenantCount} active tenant{tenantCount !== 1 ? 's' : ''}</div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between"><span>Vehicles</span><span className="text-white font-medium">{p.maxVehicles >= 999999 ? 'Unlimited' : `Up to ${p.maxVehicles}`}</span></div>
                  <div className="flex justify-between"><span>Drivers</span><span className="text-white font-medium">{p.maxDrivers >= 999999 ? 'Unlimited' : `Up to ${p.maxDrivers}`}</span></div>
                  <div className="flex justify-between"><span>Users</span><span className="text-white font-medium">{p.maxUsers >= 999999 ? 'Unlimited' : `Up to ${p.maxUsers}`}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── RLS Audit ──────────────────────────────────────────── */}
      {tab === 'rls-audit' && (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-xl p-5 border border-emerald-700/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl">🛡️</div>
              <div>
                <h3 className="text-white font-semibold">Data Isolation Audit — PASSED</h3>
                <div className="text-xs text-slate-400">Last audit: Today 06:00 UTC · Next: Tomorrow 06:00 UTC</div>
              </div>
            </div>
            <div className="space-y-2">
              {RLS_CHECKS.map((c, i) => (
                <div key={i} className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
                  <span className="text-emerald-400 text-sm">✓</span>
                  <span className="text-sm text-slate-300 flex-1">{c.check}</span>
                  <span className="text-xs text-slate-500">
                    {c.entities && `${c.entities} entities`}
                    {c.queriesAudited && `${c.queriesAudited.toLocaleString()} queries`}
                    {c.endpoints && `${c.endpoints} endpoints`}
                    {c.rooms && `${c.rooms} rooms`}
                    {c.buckets && `${c.buckets} bucket`}
                    {c.namespaces && `${c.namespaces} namespaces`}
                    {c.entries && `${c.entries.toLocaleString()} entries`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h4 className="text-sm text-white font-semibold mb-2">Isolation Strategy</h4>
              <div className="text-xs text-slate-400 space-y-1">
                <div>Strategy: <span className="text-cyan-400">Column-based (tenant_id)</span></div>
                <div>Level: <span className="text-emerald-400">Strict</span></div>
                <div>Encryption at rest: <span className="text-emerald-400">Enabled</span></div>
                <div>Encryption in transit: <span className="text-emerald-400">TLS 1.3</span></div>
                <div>Key management: <span className="text-cyan-400">Platform-managed</span></div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h4 className="text-sm text-white font-semibold mb-2">Audit Configuration</h4>
              <div className="text-xs text-slate-400 space-y-1">
                <div>Log cross-tenant attempts: <span className="text-emerald-400">Yes</span></div>
                <div>Alert on violation: <span className="text-emerald-400">Yes</span></div>
                <div>Retention: <span className="text-cyan-400">365 days</span></div>
                <div>Violations found: <span className="text-emerald-400">0</span></div>
              </div>
            </div>
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h4 className="text-sm text-white font-semibold mb-2">Enforced Entities</h4>
              <div className="flex flex-wrap gap-1">
                {['vehicles', 'drivers', 'trips', 'alerts', 'work_orders', 'fuel_txn', 'cargo', 'bus_routes', 'taxi_trips', 'notifications', 'finance'].map(e => (
                  <span key={e} className="px-2 py-0.5 bg-slate-700 rounded text-[10px] text-slate-300">{e}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Usage Bar Component ───────────────────────────────────────── */
function UsageBar({ label, current, max }: { label: string; current: number; max: number }) {
  const pct = Math.min((current / max) * 100, 100);
  const color = pct >= 90 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-500' : 'bg-cyan-500';
  return (
    <div className="bg-slate-700/50 rounded-lg p-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white">{current}/{max >= 999999 ? '∞' : max}</span>
      </div>
      <div className="h-1.5 bg-slate-600 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="text-[10px] text-slate-500 mt-1">{pct.toFixed(0)}% used</div>
    </div>
  );
}
