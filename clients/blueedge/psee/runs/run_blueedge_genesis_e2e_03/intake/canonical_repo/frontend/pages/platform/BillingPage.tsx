import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/ui/StatCard';
import TabBar from '@/components/ui/TabBar';

/* ── Mock Data ─────────────────────────────────────────────────── */
const INVOICES = [
  { id: 'inv-001', number: 'INV-2026-0014', period: 'Jan 2026', status: 'paid', subtotal: 27537.5, vat: 1376.88, total: 28914.38, paidAt: '2026-02-10', method: 'Visa ****4242' },
  { id: 'inv-002', number: 'INV-2025-0013', period: 'Dec 2025', status: 'paid', subtotal: 27500, vat: 1375, total: 28875, paidAt: '2026-01-12', method: 'Visa ****4242' },
  { id: 'inv-003', number: 'INV-2025-0012', period: 'Nov 2025', status: 'paid', subtotal: 25000, vat: 1250, total: 26250, paidAt: '2025-12-08', method: 'Bank Transfer' },
  { id: 'inv-004', number: 'INV-2025-0011', period: 'Oct 2025', status: 'paid', subtotal: 25000, vat: 1250, total: 26250, paidAt: '2025-11-10', method: 'Visa ****4242' },
  { id: 'inv-005', number: 'INV-2025-0010', period: 'Sep 2025', status: 'paid', subtotal: 25000, vat: 1250, total: 26250, paidAt: '2025-10-11', method: 'Visa ****4242' },
  { id: 'inv-006', number: 'INV-2025-0009', period: 'Aug 2025', status: 'paid', subtotal: 7500, vat: 375, total: 7875, paidAt: '2025-09-08', method: 'Visa ****4242' },
];

const USAGE_METRICS = [
  { metric: 'API Calls', current: 45230, limit: 100000, unit: 'requests', overageRate: 0.01 },
  { metric: 'Storage', current: 2340, limit: 10000, unit: 'MB', overageRate: 0.05 },
  { metric: 'SMS Notifications', current: 1250, limit: 1000, unit: 'messages', overageRate: 0.15 },
  { metric: 'WebSocket Connections', current: 34, limit: 100, unit: 'concurrent', overageRate: null },
  { metric: 'Report Exports', current: 87, limit: 500, unit: 'exports', overageRate: 0.5 },
];

const LINE_ITEMS = [
  { description: 'Enterprise Plan — Monthly', qty: 1, unitPrice: 25000, total: 25000 },
  { description: 'Additional API Calls (50K bundle)', qty: 1, unitPrice: 500, total: 500 },
  { description: 'Premium Support SLA', qty: 1, unitPrice: 2000, total: 2000 },
  { description: 'SMS Overage (250 messages × AED 0.15)', qty: 250, unitPrice: 0.15, total: 37.5 },
];

/* ── Usage Bar ─────────────────────────────────────────────────── */
function UsageMeter({ metric, current, limit, unit, overageRate }: any) {
  const pct = Math.min((current / limit) * 100, 100);
  const overage = Math.max(0, current - limit);
  const color = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-cyan-500';
  const charge = overage > 0 && overageRate ? (overage * overageRate).toFixed(2) : null;

  return (
    <div className="bg-slate-700/50 rounded-lg p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm text-white font-medium">{metric}</div>
          <div className="text-xs text-slate-400">{current.toLocaleString()} / {limit.toLocaleString()} {unit}</div>
        </div>
        {charge && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">+AED {charge}</span>}
      </div>
      <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
      <div className="text-[10px] text-slate-500 mt-1">{pct.toFixed(0)}% used{overage > 0 ? ` · ${overage.toLocaleString()} ${unit} overage` : ''}</div>
    </div>
  );
}

/* ── Revenue Trend ─────────────────────────────────────────────── */
function RevenueTrendChart() {
  const data = [
    { month: 'Sep', revenue: 85 },
    { month: 'Oct', revenue: 92.5 },
    { month: 'Nov', revenue: 105 },
    { month: 'Dec', revenue: 115 },
    { month: 'Jan', revenue: 127.5 },
    { month: 'Feb', revenue: 137.5 },
  ];
  const max = 150;
  const barW = 30;
  const gap = 16;
  const w = data.length * (barW + gap);
  const h = 120;

  return (
    <svg viewBox={`0 0 ${w + 20} ${h + 24}`} className="w-full h-36">
      {data.map((d, i) => {
        const barH = (d.revenue / max) * (h - 10);
        const x = 10 + i * (barW + gap);
        const y = h - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill="#0891b2" opacity="0.8" />
            <text x={x + barW / 2} y={y - 4} textAnchor="middle" className="fill-white text-[8px] font-medium">{d.revenue}K</text>
            <text x={x + barW / 2} y={h + 14} textAnchor="middle" className="fill-slate-400 text-[8px]">{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Main Page ─────────────────────────────────────────────────── */
export default function BillingPage() {
  const [tab, setTab] = useState('overview');
  const [invoiceDetail, setInvoiceDetail] = useState<string | null>(null);
  const tabs = ['overview', 'invoices', 'usage', 'payment-methods', 'revenue'];

  return (
    <div className="space-y-6">
      <PageHeader title="Billing & Subscription" subtitle="Invoices, usage metering, and payment management" />
      <TabBar tabs={tabs} active={tab} onChange={setTab} />

      {/* ── Overview ───────────────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Current Plan" value="Enterprise" icon="💎" />
            <StatCard label="Monthly Total" value="AED 28,875" icon="💰" />
            <StatCard label="Next Billing" value="Mar 1, 2026" icon="📅" />
            <StatCard label="Outstanding" value="AED 0" icon="✅" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Period Breakdown */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-4">Current Period — February 2026</h3>
              <div className="space-y-2">
                {LINE_ITEMS.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-300">{item.description}</span>
                    <span className="text-white font-medium">AED {item.total.toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Subtotal</span>
                    <span className="text-white">AED 27,537.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">VAT (5%)</span>
                    <span className="text-white">AED 1,376.88</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold mt-1">
                    <span className="text-white">Total</span>
                    <span className="text-cyan-400">AED 28,914.38</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods Summary */}
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-4">Payment Methods</h3>
              <div className="space-y-3">
                <div className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-3 border border-cyan-700/30">
                  <span className="text-2xl">💳</span>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">Visa ending in 4242</div>
                    <div className="text-xs text-slate-400">Expires 12/2027 · Ahmed Al Rashid</div>
                  </div>
                  <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded">Default</span>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-2xl">🏦</span>
                  <div className="flex-1">
                    <div className="text-sm text-white font-medium">Emirates NBD · ****7890</div>
                    <div className="text-xs text-slate-400">IBAN: AE07 0331 ****</div>
                  </div>
                </div>
              </div>
              <button className="mt-3 w-full text-center py-2 text-xs text-cyan-400 hover:text-cyan-300 border border-dashed border-slate-600 rounded-lg">+ Add Payment Method</button>
            </div>
          </div>

          {/* Top Usage Alerts */}
          <div className="bg-slate-800 rounded-xl p-5 border border-amber-700/30">
            <h3 className="text-sm font-semibold text-white mb-3">⚠️ Usage Alerts</h3>
            <div className="text-sm text-amber-300">SMS Notifications quota exceeded (1,250 / 1,000). Overage charges: AED 37.50 this period.</div>
            <div className="text-xs text-slate-400 mt-1">Consider adding an SMS bundle (1,000 messages for AED 100/mo).</div>
          </div>
        </div>
      )}

      {/* ── Invoices ───────────────────────────────────────────── */}
      {tab === 'invoices' && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-400 border-b border-slate-700">
                  <th className="text-left p-3 font-medium">Invoice #</th>
                  <th className="text-left p-3 font-medium">Period</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-right p-3 font-medium">Subtotal</th>
                  <th className="text-right p-3 font-medium">VAT</th>
                  <th className="text-right p-3 font-medium">Total (AED)</th>
                  <th className="text-left p-3 font-medium">Paid</th>
                  <th className="text-left p-3 font-medium">Method</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map(inv => (
                  <tr key={inv.id} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                    <td className="p-3 text-cyan-400 font-medium">{inv.number}</td>
                    <td className="p-3 text-slate-300">{inv.period}</td>
                    <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-400">{inv.status}</span></td>
                    <td className="p-3 text-right text-slate-300">{inv.subtotal.toLocaleString()}</td>
                    <td className="p-3 text-right text-slate-400">{inv.vat.toLocaleString()}</td>
                    <td className="p-3 text-right text-white font-medium">{inv.total.toLocaleString()}</td>
                    <td className="p-3 text-xs text-slate-400">{inv.paidAt}</td>
                    <td className="p-3 text-xs text-slate-400">{inv.method}</td>
                    <td className="p-3"><button className="text-xs text-cyan-400 hover:underline">PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-xs text-slate-500 text-center">All invoices comply with UAE Federal Tax Authority e-invoicing requirements (PDF/A-3)</div>
        </div>
      )}

      {/* ── Usage Metering ─────────────────────────────────────── */}
      {tab === 'usage' && (
        <div className="space-y-6">
          <div className="text-sm text-slate-400">Billing Period: <span className="text-white font-medium">February 1 – 28, 2026</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {USAGE_METRICS.map(m => <UsageMeter key={m.metric} {...m} />)}
          </div>
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-2">Estimated Overage This Period</h3>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-amber-400">AED 37.50</div>
              <div className="text-xs text-slate-400">SMS overage: 250 messages × AED 0.15/message</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Payment Methods ────────────────────────────────────── */}
      {tab === 'payment-methods' && (
        <div className="space-y-4">
          {[
            { type: 'credit_card', brand: 'Visa', last4: '4242', expiry: '12/2027', holder: 'Ahmed Al Rashid', isDefault: true },
            { type: 'bank_transfer', brand: 'Emirates NBD', last4: '7890', expiry: null, holder: 'Blue Edge Network LLC', isDefault: false },
          ].map((pm, i) => (
            <div key={i} className={`bg-slate-800 rounded-xl p-5 border ${pm.isDefault ? 'border-cyan-700/40' : 'border-slate-700'} flex items-center gap-4`}>
              <span className="text-3xl">{pm.type === 'credit_card' ? '💳' : '🏦'}</span>
              <div className="flex-1">
                <div className="text-white font-medium">{pm.brand} ending in {pm.last4}</div>
                <div className="text-xs text-slate-400">
                  {pm.expiry ? `Expires ${pm.expiry}` : `IBAN: AE07 0331 ****${pm.last4}`} · {pm.holder}
                </div>
              </div>
              {pm.isDefault && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-full">Default</span>}
              <button className="text-xs text-slate-400 hover:text-white">Edit</button>
            </div>
          ))}
          <button className="w-full py-3 border border-dashed border-slate-600 rounded-xl text-sm text-cyan-400 hover:border-cyan-600 transition">+ Add Payment Method</button>
        </div>
      )}

      {/* ── Revenue Analytics ──────────────────────────────────── */}
      {tab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="MRR" value="AED 137.5K" icon="📈" />
            <StatCard label="ARR" value="AED 1.65M" icon="🎯" />
            <StatCard label="ARPU" value="AED 13.8K" icon="👤" />
            <StatCard label="NRR" value="118%" icon="🔄" />
          </div>
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-2">MRR Trend (AED K)</h3>
            <RevenueTrendChart />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Revenue by Plan</h3>
              {[
                { plan: 'Unlimited', mrr: 50000, color: '#f59e0b' },
                { plan: 'Enterprise', mrr: 50000, color: '#8b5cf6' },
                { plan: 'Professional', mrr: 30000, color: '#3b82f6' },
                { plan: 'Starter', mrr: 7500, color: '#6b7280' },
              ].map(p => (
                <div key={p.plan} className="flex items-center gap-3 py-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                  <span className="text-sm text-slate-300 flex-1">{p.plan}</span>
                  <span className="text-sm text-white font-medium">AED {p.mrr.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
              <h3 className="text-sm font-semibold text-white mb-3">Cohort Retention</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead><tr className="text-slate-400"><th className="text-left p-1">Cohort</th><th className="p-1">M1</th><th className="p-1">M3</th><th className="p-1">M6</th><th className="p-1">M9</th></tr></thead>
                  <tbody>
                    {[
                      { cohort: 'Q2 2025', m1: 100, m3: 92, m6: 85, m9: 80 },
                      { cohort: 'Q3 2025', m1: 100, m3: 95, m6: 88, m9: null },
                      { cohort: 'Q4 2025', m1: 100, m3: 93, m6: null, m9: null },
                    ].map(c => (
                      <tr key={c.cohort} className="text-slate-300">
                        <td className="p-1 text-white">{c.cohort}</td>
                        <td className="p-1 text-center">{c.m1}%</td>
                        <td className="p-1 text-center">{c.m3 ? `${c.m3}%` : '—'}</td>
                        <td className="p-1 text-center">{c.m6 ? `${c.m6}%` : '—'}</td>
                        <td className="p-1 text-center">{c.m9 ? `${c.m9}%` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
