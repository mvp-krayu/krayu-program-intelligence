// ══════════════════════════════════════════════════════════════
// Blue Edge — Driver Scoring AI Dashboard
// Differentiator: Multi-dimensional scoring with AI coaching
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import { useSocketContext, useSocketEvent } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';

// ── Mock Data — Production-grade driver scores ───────────────
const DRIVERS = [
  {
    id: 'D001', name: 'أحمد الراشدي', nameEn: 'Ahmed Al-Rashid', photo: '👨‍✈️',
    vehicle: 'DXB-7291', type: 'tanker', status: 'on_duty',
    overall: 92.4, safety: 94.1, efficiency: 89.7, compliance: 96.2, customer: 88.3,
    trend: [88, 89, 90, 91, 90, 92, 92, 93, 91, 92, 93, 92],
    rank: 1, totalTrips: 342, totalKm: 48200, incidents: 0,
    events: { harsh_brake: 3, rapid_accel: 2, speeding: 1, sharp_turn: 0, phone_use: 0, fatigue: 0, lane_departure: 1, tailgating: 0 },
    badges: ['🏆 Top Performer', '🛡️ Zero Incidents', '⛽ Fuel Champion'],
    coaching: [],
    streaks: { safeDays: 47, noSpeeding: 32, perfectCompliance: 21 },
  },
  {
    id: 'D002', name: 'محمد حسن', nameEn: 'Mohammed Hassan', photo: '👨‍✈️',
    vehicle: 'DXB-4490', type: 'tanker', status: 'on_duty',
    overall: 88.7, safety: 87.3, efficiency: 91.2, compliance: 93.4, customer: 82.1,
    trend: [84, 85, 86, 87, 88, 86, 87, 88, 89, 88, 89, 89],
    rank: 2, totalTrips: 298, totalKm: 41500, incidents: 1,
    events: { harsh_brake: 8, rapid_accel: 5, speeding: 4, sharp_turn: 2, phone_use: 0, fatigue: 1, lane_departure: 3, tailgating: 1 },
    badges: ['⛽ Fuel Champion', '📈 Most Improved'],
    coaching: [{ cat: 'safety', msg: 'Reduce harsh braking — 8 events this month (fleet avg: 4.2). Try anticipating stops 200m earlier on HAZMAT routes.' }],
    streaks: { safeDays: 12, noSpeeding: 8, perfectCompliance: 14 },
  },
  {
    id: 'D003', name: 'خالد إبراهيم', nameEn: 'Khalid Ibrahim', photo: '👨‍✈️',
    vehicle: 'BUS-1103', type: 'bus', status: 'on_duty',
    overall: 85.2, safety: 83.9, efficiency: 86.1, compliance: 91.7, customer: 79.4,
    trend: [81, 80, 82, 83, 82, 84, 83, 85, 84, 85, 86, 85],
    rank: 3, totalTrips: 420, totalKm: 28600, incidents: 2,
    events: { harsh_brake: 12, rapid_accel: 7, speeding: 6, sharp_turn: 4, phone_use: 1, fatigue: 2, lane_departure: 5, tailgating: 3 },
    badges: ['🚌 Bus Captain'],
    coaching: [
      { cat: 'safety', msg: 'Phone use detected once this month — any phone interaction while driving reduces score by 15 points per event.' },
      { cat: 'efficiency', msg: 'Idling time 18% above fleet average on Route 53. Consider engine-off at terminal stops >2 minutes.' },
    ],
    streaks: { safeDays: 5, noSpeeding: 3, perfectCompliance: 7 },
  },
  {
    id: 'D004', name: 'عمر فريد', nameEn: 'Omar Farid', photo: '👨‍✈️',
    vehicle: 'TAXI-2201', type: 'taxi', status: 'idle',
    overall: 81.6, safety: 79.2, efficiency: 84.5, compliance: 88.1, customer: 75.8,
    trend: [78, 79, 77, 80, 79, 81, 80, 82, 81, 80, 82, 82],
    rank: 4, totalTrips: 512, totalKm: 35800, incidents: 3,
    events: { harsh_brake: 18, rapid_accel: 14, speeding: 11, sharp_turn: 8, phone_use: 2, fatigue: 3, lane_departure: 7, tailgating: 5 },
    badges: [],
    coaching: [
      { cat: 'safety', msg: 'Speeding events 11 this month (fleet avg: 3.8). Most occur on Al Khail Rd between 6-8 PM. Consider alternative routes during rush hour.' },
      { cat: 'safety', msg: 'Fatigue detected 3 times — review shift scheduling. Maximum continuous driving: 4h recommended.' },
      { cat: 'customer', msg: 'Customer rating 3.2/5 this week. Common feedback: "rough driving". Smooth acceleration training recommended.' },
    ],
    streaks: { safeDays: 2, noSpeeding: 1, perfectCompliance: 4 },
  },
  {
    id: 'D005', name: 'سعيد المنصوري', nameEn: 'Saeed Al-Mansoori', photo: '👨‍✈️',
    vehicle: 'DXB-8834', type: 'tanker', status: 'off_duty',
    overall: 76.3, safety: 72.8, efficiency: 78.4, compliance: 84.2, customer: 71.5,
    trend: [82, 81, 79, 78, 77, 76, 78, 75, 76, 77, 76, 76],
    rank: 5, totalTrips: 187, totalKm: 26100, incidents: 4,
    events: { harsh_brake: 24, rapid_accel: 19, speeding: 16, sharp_turn: 11, phone_use: 3, fatigue: 4, lane_departure: 9, tailgating: 8 },
    badges: [],
    coaching: [
      { cat: 'safety', msg: '⚠️ Score declining for 3 consecutive months. Mandatory safety refresher course required before next HAZMAT assignment.' },
      { cat: 'safety', msg: 'Phone use: 3 events. Company policy: zero tolerance for HAZMAT drivers. Final warning issued.' },
      { cat: 'compliance', msg: 'HOS violations: 2 this month. Pre-trip inspection compliance: 71% (required: 100%).' },
    ],
    streaks: { safeDays: 0, noSpeeding: 0, perfectCompliance: 0 },
  },
];

const FLEET_AVG = { overall: 84.8, safety: 83.5, efficiency: 86.0, compliance: 90.7, customer: 79.4 };

const EVENT_WEIGHTS: Record<string, { label: string; points: number; icon: string }> = {
  harsh_brake: { label: 'Harsh Braking', points: -3, icon: '🛑' },
  rapid_accel: { label: 'Rapid Acceleration', points: -2, icon: '🏎️' },
  speeding: { label: 'Speeding', points: -5, icon: '⚡' },
  sharp_turn: { label: 'Sharp Turn', points: -2, icon: '↩️' },
  phone_use: { label: 'Phone Use', points: -15, icon: '📱' },
  fatigue: { label: 'Fatigue Detected', points: -10, icon: '😴' },
  lane_departure: { label: 'Lane Departure', points: -4, icon: '↔️' },
  tailgating: { label: 'Tailgating', points: -6, icon: '🚗' },
};

// ── Score helpers ─────────────────────────────────────────────
function scoreColor(score: number): string {
  if (score >= 90) return 'text-green-400';
  if (score >= 80) return 'text-cyan-400';
  if (score >= 70) return 'text-amber-400';
  return 'text-red-400';
}
function scoreBg(score: number): string {
  if (score >= 90) return 'bg-green-500';
  if (score >= 80) return 'bg-cyan-500';
  if (score >= 70) return 'bg-amber-500';
  return 'bg-red-500';
}
function trendArrow(trend: number[]): { icon: string; color: string; delta: number } {
  const recent = trend.slice(-3).reduce((a, b) => a + b, 0) / 3;
  const older = trend.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
  const delta = recent - older;
  if (delta > 1.5) return { icon: '↑', color: 'text-green-400', delta };
  if (delta < -1.5) return { icon: '↓', color: 'text-red-400', delta };
  return { icon: '→', color: 'text-slate-400', delta };
}

function miniSparkline(data: number[], color: string = '#22d3ee') {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 120, h = 32, pad = 2;
  const points = data.map((v, i) =>
    `${pad + (i / (data.length - 1)) * (w - 2 * pad)},${pad + (1 - (v - min) / range) * (h - 2 * pad)}`
  ).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {/* Endpoint dot */}
      {(() => {
        const last = data[data.length - 1];
        const x = w - pad;
        const y = pad + (1 - (last - min) / range) * (h - 2 * pad);
        return <circle cx={x} cy={y} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}

function scoreRing(score: number, size: number = 64, strokeWidth: number = 5) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? '#22c55e' : score >= 80 ? '#22d3ee' : score >= 70 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <span className="absolute text-sm font-bold" style={{ color }}>{score.toFixed(0)}</span>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────
export default function DriverScoringPage() {
  const { connected: wsConnected } = useSocketContext();
  useSocketEvent('safety:event', () => {}, []);
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'overall' | 'safety' | 'efficiency' | 'compliance' | 'customer'>('overall');
  const [tab, setTab] = useState('leaderboard');

  const sorted = useMemo(() =>
    [...DRIVERS].sort((a, b) => (b as any)[sortBy] - (a as any)[sortBy]),
    [sortBy]
  );

  const driver = DRIVERS.find(d => d.id === selectedDriver);
  const totalEvents = DRIVERS.reduce((sum, d) => sum + Object.values(d.events).reduce((a, b) => a + b, 0), 0);

  return (
    <div>
      <PageHeader
        title="🎯 Driver Scoring AI"
        breadcrumb="Intelligence"
        subtitle="Multi-dimensional performance scoring • AI coaching • Gamification"
      />

      {/* ── KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="stat-card">
          <div className="stat-value text-cyan-400">{DRIVERS.length}</div>
          <div className="stat-label">Active Drivers</div>
        </div>
        <div className="stat-card">
          <div className={`stat-value ${scoreColor(FLEET_AVG.overall)}`}>{FLEET_AVG.overall}</div>
          <div className="stat-label">Fleet Avg Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-green-400">{DRIVERS.filter(d => d.overall >= 90).length}</div>
          <div className="stat-label">Top Performers (90+)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-red-400">{DRIVERS.filter(d => d.overall < 75).length}</div>
          <div className="stat-label">Needs Attention (&lt;75)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-amber-400">{totalEvents}</div>
          <div className="stat-label">Events This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-emerald-400">{DRIVERS.reduce((s, d) => s + d.incidents, 0)}</div>
          <div className="stat-label">Incidents YTD</div>
        </div>
      </div>

      {/* ── Tabs ───────────────────────────────────── */}
      <div className="flex gap-2 mb-4 border-b border-slate-700 pb-2">
        {[
          { id: 'leaderboard', label: '🏆 Leaderboard' },
          { id: 'detail', label: '📋 Driver Detail' },
          { id: 'algorithm', label: '⚙️ Scoring Algorithm' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${tab === t.id ? 'bg-slate-700 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══ LEADERBOARD TAB ═══════════════════════════════════ */}
      {tab === 'leaderboard' && (
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-semibold text-slate-200">Driver Leaderboard</h3>
            <div className="flex gap-1 text-xs">
              {(['overall', 'safety', 'efficiency', 'compliance', 'customer'] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`px-3 py-1 rounded font-medium transition-colors ${sortBy === s ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-400 hover:text-slate-200'}`}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-slate-700/50">
            {sorted.map((d, i) => {
              const tr = trendArrow(d.trend);
              return (
                <div key={d.id}
                  className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer ${selectedDriver === d.id ? 'bg-slate-800/70' : ''}`}
                  onClick={() => { setSelectedDriver(d.id); setTab('detail'); }}>
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-amber-500/20 text-amber-400' : i === 1 ? 'bg-slate-400/20 text-slate-300' : i === 2 ? 'bg-orange-600/20 text-orange-400' : 'bg-slate-700 text-slate-500'}`}>
                      {i + 1}
                    </div>

                    {/* Driver info */}
                    <div className="w-44">
                      <div className="text-sm font-semibold text-slate-200">{d.photo} {d.nameEn}</div>
                      <div className="text-[10px] text-slate-500">{d.vehicle} • {d.type} • {d.status.replace('_', ' ')}</div>
                    </div>

                    {/* Overall score ring */}
                    <div className="w-16 flex justify-center">
                      {scoreRing(d.overall)}
                    </div>

                    {/* Dimension bars */}
                    <div className="flex-1 grid grid-cols-4 gap-2">
                      {(['safety', 'efficiency', 'compliance', 'customer'] as const).map(dim => (
                        <div key={dim}>
                          <div className="flex justify-between text-[10px] mb-0.5">
                            <span className="text-slate-500 capitalize">{dim}</span>
                            <span className={scoreColor(d[dim])}>{d[dim]}</span>
                          </div>
                          <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${scoreBg(d[dim])}`} style={{ width: `${d[dim]}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Sparkline + trend */}
                    <div className="w-32 flex items-center gap-2">
                      {miniSparkline(d.trend)}
                      <span className={`text-xs font-mono ${tr.color}`}>{tr.icon}{Math.abs(tr.delta).toFixed(1)}</span>
                    </div>

                    {/* Badges */}
                    <div className="w-28 flex flex-wrap gap-1 justify-end">
                      {d.badges.slice(0, 2).map((b, bi) => (
                        <span key={bi} className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded">{b}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ DRIVER DETAIL TAB ═════════════════════════════════ */}
      {tab === 'detail' && (
        <div>
          {!driver ? (
            <div className="card p-8 text-center text-slate-500">
              <div className="text-4xl mb-3">👈</div>
              <p>Select a driver from the leaderboard to view their detailed scoring breakdown</p>
              <button onClick={() => setTab('leaderboard')} className="mt-3 px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded text-sm">Go to Leaderboard</button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Header card */}
              <div className="card p-5">
                <div className="flex items-center gap-6">
                  <div className="text-5xl">{driver.photo}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-100">{driver.nameEn}</h2>
                      <span className="text-sm text-slate-500">{driver.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${driver.status === 'on_duty' ? 'bg-green-500/20 text-green-400' : driver.status === 'idle' ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-600 text-slate-400'}`}>
                        {driver.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                      {driver.vehicle} • {driver.type} • Rank #{driver.rank} of {DRIVERS.length} • {driver.totalTrips} trips • {(driver.totalKm / 1000).toFixed(1)}K km
                    </div>
                    <div className="flex gap-2 mt-2">
                      {driver.badges.map((b, i) => (
                        <span key={i} className="text-xs bg-slate-700 px-2 py-1 rounded">{b}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-center">
                    {scoreRing(driver.overall, 96, 7)}
                    <div className="text-[10px] text-slate-500 mt-1">Overall Score</div>
                  </div>
                </div>
              </div>

              {/* Score dimensions */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {([
                  { key: 'safety', label: 'Safety', icon: '🛡️', desc: 'Driving events, incidents' },
                  { key: 'efficiency', label: 'Efficiency', icon: '⛽', desc: 'Fuel usage, idling, routing' },
                  { key: 'compliance', label: 'Compliance', icon: '📋', desc: 'HOS, inspections, permits' },
                  { key: 'customer', label: 'Customer', icon: '⭐', desc: 'Ratings, complaints, on-time' },
                ] as const).map(dim => {
                  const val = driver[dim.key as keyof typeof driver] as number;
                  const avg = FLEET_AVG[dim.key as keyof typeof FLEET_AVG];
                  const diff = val - avg;
                  return (
                    <div key={dim.key} className="card p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">{dim.icon} {dim.label}</span>
                        <span className={`text-lg font-bold ${scoreColor(val)}`}>{val}</span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                        <div className={`h-full rounded-full ${scoreBg(val)}`} style={{ width: `${val}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-500">{dim.desc}</span>
                        <span className={diff >= 0 ? 'text-green-400' : 'text-red-400'}>
                          {diff >= 0 ? '+' : ''}{diff.toFixed(1)} vs fleet
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Events + Coaching */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Events breakdown */}
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-slate-400 mb-4">Driving Events This Month</h3>
                  <div className="space-y-2">
                    {Object.entries(driver.events)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([key, count]) => {
                        const ev = EVENT_WEIGHTS[key];
                        return (
                          <div key={key} className="flex items-center gap-3">
                            <span className="w-6 text-center">{ev.icon}</span>
                            <span className="text-sm text-slate-300 w-36">{ev.label}</span>
                            <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${(count as number) > 10 ? 'bg-red-500' : (count as number) > 5 ? 'bg-amber-500' : 'bg-slate-500'}`}
                                style={{ width: `${Math.min(((count as number) / 25) * 100, 100)}%` }} />
                            </div>
                            <span className="text-xs font-mono text-slate-400 w-8 text-right">{count as number}</span>
                            <span className="text-xs font-mono text-red-400 w-12 text-right">{(count as number) * ev.points}pt</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* AI Coaching */}
                <div className="card p-5">
                  <h3 className="text-sm font-semibold text-slate-400 mb-4">🤖 AI Coaching Recommendations</h3>
                  {driver.coaching.length === 0 ? (
                    <div className="text-center py-6">
                      <div className="text-3xl mb-2">🌟</div>
                      <p className="text-sm text-green-400">No coaching recommendations — excellent performance!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {driver.coaching.map((c, i) => (
                        <div key={i} className={`p-3 rounded-lg border ${c.cat === 'safety' ? 'bg-red-500/5 border-red-500/20' : c.cat === 'efficiency' ? 'bg-amber-500/5 border-amber-500/20' : c.cat === 'customer' ? 'bg-blue-500/5 border-blue-500/20' : 'bg-slate-700/50 border-slate-600'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-semibold uppercase ${c.cat === 'safety' ? 'text-red-400' : c.cat === 'efficiency' ? 'text-amber-400' : 'text-blue-400'}`}>
                              {c.cat}
                            </span>
                          </div>
                          <p className="text-sm text-slate-300 leading-relaxed">{c.msg}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Streaks */}
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Active Streaks</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-800 p-2 rounded text-center">
                        <div className={`text-lg font-bold ${driver.streaks.safeDays > 14 ? 'text-green-400' : driver.streaks.safeDays > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                          {driver.streaks.safeDays}d
                        </div>
                        <div className="text-[10px] text-slate-500">Safe Days</div>
                      </div>
                      <div className="bg-slate-800 p-2 rounded text-center">
                        <div className={`text-lg font-bold ${driver.streaks.noSpeeding > 14 ? 'text-green-400' : driver.streaks.noSpeeding > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                          {driver.streaks.noSpeeding}d
                        </div>
                        <div className="text-[10px] text-slate-500">No Speeding</div>
                      </div>
                      <div className="bg-slate-800 p-2 rounded text-center">
                        <div className={`text-lg font-bold ${driver.streaks.perfectCompliance > 14 ? 'text-green-400' : driver.streaks.perfectCompliance > 0 ? 'text-amber-400' : 'text-red-400'}`}>
                          {driver.streaks.perfectCompliance}d
                        </div>
                        <div className="text-[10px] text-slate-500">Full Compliance</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation between drivers */}
              <div className="flex gap-2">
                {DRIVERS.map(d => (
                  <button key={d.id} onClick={() => setSelectedDriver(d.id)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${selectedDriver === d.id ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-400 hover:text-slate-200'}`}>
                    {d.nameEn}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ ALGORITHM TAB ═════════════════════════════════════ */}
      {tab === 'algorithm' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">⚙️ Scoring Algorithm</h3>
            <p className="text-xs text-slate-500 mb-4">Composite score = weighted sum of 4 dimensions, each starting at 100 with deductions per event</p>
            <div className="space-y-3">
              {[
                { dim: 'Safety (40%)', desc: 'Harsh braking, acceleration, speeding, phone use, fatigue, lane departure, tailgating', base: 100, weight: 0.40 },
                { dim: 'Efficiency (25%)', desc: 'Fuel consumption vs baseline, idling time, route adherence, eco-driving score', base: 100, weight: 0.25 },
                { dim: 'Compliance (20%)', desc: 'HOS adherence, pre-trip inspection rate, permit validity, training completion', base: 100, weight: 0.20 },
                { dim: 'Customer (15%)', desc: 'Passenger ratings, on-time delivery %, complaint count, professionalism', base: 100, weight: 0.15 },
              ].map(d => (
                <div key={d.dim} className="bg-slate-800 p-3 rounded-lg">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-200">{d.dim}</span>
                    <span className="text-xs text-cyan-400 font-mono">weight: {d.weight}</span>
                  </div>
                  <p className="text-xs text-slate-500">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">🛑 Event Deduction Table</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 text-xs text-slate-500">
                    <th className="text-left p-2">Event</th>
                    <th className="text-center p-2">Icon</th>
                    <th className="text-center p-2">Points</th>
                    <th className="text-center p-2">Fleet Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {Object.entries(EVENT_WEIGHTS).map(([key, ev]) => {
                    const fleetTotal = DRIVERS.reduce((s, d) => s + (d.events as any)[key], 0);
                    return (
                      <tr key={key} className="hover:bg-slate-800/50">
                        <td className="p-2 text-slate-300">{ev.label}</td>
                        <td className="p-2 text-center">{ev.icon}</td>
                        <td className="p-2 text-center font-mono text-red-400">{ev.points}</td>
                        <td className="p-2 text-center font-mono text-slate-400">{fleetTotal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-lg">
              <p className="text-xs text-cyan-400">
                💡 <strong>AI Enhancement:</strong> Scores are contextually adjusted — a harsh brake at 120km/h is penalized more than one at 40km/h. Night driving, weather conditions, and cargo type (especially HAZMAT) modify event severity by up to 2x.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
