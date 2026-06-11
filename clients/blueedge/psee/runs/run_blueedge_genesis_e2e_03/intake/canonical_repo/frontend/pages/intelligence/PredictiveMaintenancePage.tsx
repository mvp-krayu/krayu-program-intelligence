// ══════════════════════════════════════════════════════════════
// Blue Edge — Predictive Maintenance AI Dashboard
// Differentiator: Real-time ML predictions with RUL estimation
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { useApi } from '@/hooks';
import { useSocketContext, useSocketEvent } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import ErrorMsg from '@/components/ui/ErrorMsg';
import TabBar from '@/components/ui/TabBar';

// ── Mock Data — Production-grade AI predictions ──────────────
const FLEET_HEALTH = 87.3;
const MODELS = [
  { name: 'Engine LSTM v2.7', component: 'engine', accuracy: 96.2, precision: 94.8, recall: 97.1, f1: 95.9, predictions: 48, status: 'production', trainedOn: '12,400 samples' },
  { name: 'Brake XGBoost v3.2', component: 'brakes', accuracy: 93.8, precision: 92.1, recall: 95.4, f1: 93.7, predictions: 62, status: 'production', trainedOn: '18,200 samples' },
  { name: 'Tire CNN v1.5', component: 'tires', accuracy: 97.1, precision: 96.4, recall: 97.8, f1: 97.1, predictions: 89, status: 'production', trainedOn: '22,100 samples' },
  { name: 'Transmission RF v2.1', component: 'transmission', accuracy: 91.5, precision: 89.7, recall: 93.2, f1: 91.4, predictions: 35, status: 'production', trainedOn: '8,600 samples' },
  { name: 'Battery DeepAR v1.8', component: 'battery', accuracy: 94.3, precision: 93.1, recall: 95.5, f1: 94.3, predictions: 41, status: 'production', trainedOn: '14,800 samples' },
  { name: 'HVAC Ensemble v1.2', component: 'hvac', accuracy: 89.7, precision: 87.9, recall: 91.5, f1: 89.6, predictions: 27, status: 'canary', trainedOn: '6,200 samples' },
];

const PREDICTIONS = [
  { id: 'P001', vehicle: 'DXB-7291', type: 'tanker', component: 'Brake Pads (Rear)', risk: 'critical', probability: 87.3, rul: '48h / 1,200 km', failDate: '2026-02-19', cost: 2800, confidence: 94.1, recommendation: 'Schedule immediate brake pad replacement — rear axle showing accelerated wear from heavy HAZMAT loads on SZR corridor', factors: ['12 loads/week frequency', 'Stop-go pattern E11', 'Ambient >45°C wear acceleration'] },
  { id: 'P002', vehicle: 'DXB-4490', type: 'tanker', component: 'Engine Oil', risk: 'high', probability: 72.1, rul: '180h / 3,500 km', failDate: '2026-02-26', cost: 5400, confidence: 91.8, recommendation: 'Oil analysis shows elevated iron particles at 45ppm (threshold: 30ppm) — schedule oil change and inspect camshaft bearings', factors: ['Oil degradation 2.3x normal', 'Iron: 45ppm (limit 30)', '8,200h since overhaul'] },
  { id: 'P003', vehicle: 'BUS-1103', type: 'bus', component: 'Tire Tread (Front-L)', risk: 'high', probability: 68.5, rul: '240h / 4,800 km', failDate: '2026-03-02', cost: 1200, confidence: 96.3, recommendation: 'Front-left tire tread depth at 2.8mm, projected to reach 1.6mm minimum in 12 days at current wear rate', factors: ['Tread: 2.8mm (min 1.6)', 'Wear rate: 0.1mm/day', 'Route 53 surface quality poor'] },
  { id: 'P004', vehicle: 'DXB-8834', type: 'tanker', component: 'Coolant System', risk: 'high', probability: 65.8, rul: '96h / 2,100 km', failDate: '2026-02-22', cost: 3200, confidence: 88.4, recommendation: 'Coolant level dropping 0.3L/week — likely slow leak at water pump gasket. Immediate inspection recommended before desert route assignment', factors: ['Coolant loss: 0.3L/week', 'Water pump age: 18mo', 'Desert routes add thermal stress'] },
  { id: 'P005', vehicle: 'TAXI-2201', type: 'taxi', component: 'Battery', risk: 'medium', probability: 52.3, rul: '720h / 12,000 km', failDate: '2026-03-20', cost: 850, confidence: 93.7, recommendation: 'Battery cold cranking amps declining — replace within 30 days to avoid stranding', factors: ['CCA: 380A (rated 520A)', 'Age: 22 months', '3 slow-start events this week'] },
  { id: 'P006', vehicle: 'BUS-2204', type: 'bus', component: 'Suspension', risk: 'medium', probability: 45.1, rul: '480h / 8,200 km', failDate: '2026-03-10', cost: 4500, confidence: 87.2, recommendation: 'Vibration signature indicates worn shock absorbers — schedule replacement at next scheduled maintenance window', factors: ['Vibration amplitude +35%', 'Passenger comfort complaints', 'Route 22: speed bumps'] },
  { id: 'P007', vehicle: 'DXB-5512', type: 'tanker', component: 'Transmission', risk: 'medium', probability: 41.7, rul: '600h / 9,800 km', failDate: '2026-03-15', cost: 8200, confidence: 89.1, recommendation: 'Transmission fluid analysis shows copper particles increasing — monitor closely, plan for rebuild at next service window', factors: ['Copper particles: 28ppm', 'Shift time: +0.3s', 'Heavy load cycles: 2,400'] },
  { id: 'P008', vehicle: 'TAXI-3302', type: 'taxi', component: 'AC Compressor', risk: 'low', probability: 28.4, rul: '1200h / 18,000 km', failDate: '2026-04-10', cost: 1600, confidence: 82.5, recommendation: 'AC compressor showing early wear signs — schedule inspection during next service. Critical for Dubai summer readiness', factors: ['Refrigerant pressure variance', 'Compressor noise +8dB', 'Summer prep window open'] },
];

const MONTHLY_TREND = [
  { month: 'Sep', predictions: 18, prevented: 3, missed: 0, savings: 34200 },
  { month: 'Oct', predictions: 21, prevented: 4, missed: 1, savings: 48500 },
  { month: 'Nov', predictions: 25, prevented: 5, missed: 0, savings: 62100 },
  { month: 'Dec', predictions: 19, prevented: 2, missed: 0, savings: 31800 },
  { month: 'Jan', predictions: 27, prevented: 6, missed: 0, savings: 78400 },
  { month: 'Feb', predictions: 23, prevented: 3, missed: 0, savings: 47250 },
];

const FAILURE_MODES = [
  { component: 'Brake pads', count: 12, avgLead: 8.2, accuracy: 94.1, saved: 'AED 33,600' },
  { component: 'Tire tread', count: 9, avgLead: 14.5, accuracy: 97.1, saved: 'AED 10,800' },
  { component: 'Engine oil', count: 7, avgLead: 6.1, accuracy: 96.2, saved: 'AED 37,800' },
  { component: 'Battery', count: 5, avgLead: 18.3, accuracy: 94.3, saved: 'AED 4,250' },
  { component: 'Coolant leak', count: 4, avgLead: 4.7, accuracy: 88.4, saved: 'AED 12,800' },
];

// ── Risk badge helper ────────────────────────────────────────
function riskBadge(risk: string) {
  const styles: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
    medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    low: 'bg-green-500/20 text-green-400 border border-green-500/30',
  };
  return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[risk] || ''}`}>{risk.toUpperCase()}</span>;
}

function probBar(pct: number) {
  const color = pct >= 80 ? 'bg-red-500' : pct >= 60 ? 'bg-orange-500' : pct >= 40 ? 'bg-amber-500' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-400 w-12 text-right font-mono">{pct.toFixed(1)}%</span>
    </div>
  );
}

function fleetHealthGauge(score: number) {
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444';
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="60" cy="60" r="54" fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold" style={{ color }}>{score.toFixed(1)}</div>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider">Health Index</div>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────
export default function PredictiveMaintenancePage() {
  const { connected: wsConnected } = useSocketContext();
  useSocketEvent('diagnostics:predictive', () => {}, []);
  const [tab, setTab] = useState('predictions');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState('all');

  const filteredPredictions = useMemo(() => {
    if (riskFilter === 'all') return PREDICTIONS;
    return PREDICTIONS.filter(p => p.risk === riskFilter);
  }, [riskFilter]);

  const totalSavings = MONTHLY_TREND.reduce((s, m) => s + m.savings, 0);
  const totalPrevented = MONTHLY_TREND.reduce((s, m) => s + m.prevented, 0);

  return (
    <div>
      <PageHeader
        title="🧠 Predictive Maintenance AI"
        breadcrumb="Intelligence"
        subtitle="ML-powered failure prediction • Remaining Useful Life estimation"
      />

      {/* ── KPI Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <div className="stat-card">
          <div className="stat-value text-cyan-400">{PREDICTIONS.length}</div>
          <div className="stat-label">Active Predictions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-red-400">{PREDICTIONS.filter(p => p.risk === 'critical').length}</div>
          <div className="stat-label">Critical Alerts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-green-400">{totalPrevented}</div>
          <div className="stat-label">Breakdowns Prevented</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-amber-400">12.4d</div>
          <div className="stat-label">Avg Lead Time</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-emerald-400">AED {(totalSavings / 1000).toFixed(0)}K</div>
          <div className="stat-label">Cost Savings (6mo)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-blue-400">94.7%</div>
          <div className="stat-label">Model Accuracy</div>
        </div>
      </div>

      {/* ── Fleet Health + Risk Distribution ────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 flex flex-col items-center justify-center">
          <h3 className="text-sm font-semibold text-slate-400 mb-4 self-start">Fleet Health Index</h3>
          {fleetHealthGauge(FLEET_HEALTH)}
          <div className="mt-3 text-xs text-slate-500">Composite score across all vehicle components</div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">Risk Distribution</h3>
          {[
            { label: 'Critical', count: PREDICTIONS.filter(p => p.risk === 'critical').length, color: 'bg-red-500', total: PREDICTIONS.length },
            { label: 'High', count: PREDICTIONS.filter(p => p.risk === 'high').length, color: 'bg-orange-500', total: PREDICTIONS.length },
            { label: 'Medium', count: PREDICTIONS.filter(p => p.risk === 'medium').length, color: 'bg-amber-500', total: PREDICTIONS.length },
            { label: 'Low', count: PREDICTIONS.filter(p => p.risk === 'low').length, color: 'bg-green-500', total: PREDICTIONS.length },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-3 mb-3">
              <span className="text-xs text-slate-400 w-16">{r.label}</span>
              <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${r.color}`} style={{ width: `${(r.count / r.total) * 100}%` }} />
              </div>
              <span className="text-xs font-mono text-slate-300 w-6 text-right">{r.count}</span>
            </div>
          ))}
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-400 mb-4">Monthly Trend</h3>
          <div className="space-y-2">
            {MONTHLY_TREND.map(m => (
              <div key={m.month} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-8 font-mono">{m.month}</span>
                <div className="flex-1 flex gap-0.5 h-4">
                  <div className="bg-cyan-500/80 rounded-sm" style={{ width: `${(m.predictions / 30) * 100}%` }} title={`${m.predictions} predictions`} />
                  <div className="bg-green-500/80 rounded-sm" style={{ width: `${(m.prevented / 30) * 100}%` }} title={`${m.prevented} prevented`} />
                  {m.missed > 0 && <div className="bg-red-500/80 rounded-sm" style={{ width: `${(m.missed / 30) * 100}%` }} title={`${m.missed} missed`} />}
                </div>
                <span className="text-xs text-green-400 w-16 text-right font-mono">AED {(m.savings / 1000).toFixed(0)}K</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 pt-3 border-t border-slate-700">
            <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 bg-cyan-500 rounded-sm" /> Predictions</span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 bg-green-500 rounded-sm" /> Prevented</span>
            <span className="flex items-center gap-1 text-[10px] text-slate-500"><span className="w-2 h-2 bg-red-500 rounded-sm" /> Missed</span>
          </div>
        </div>
      </div>

      {/* ── Tab Navigation ─────────────────────────── */}
      <div className="flex gap-2 mb-4 border-b border-slate-700 pb-2">
        {[
          { id: 'predictions', label: '🔮 Active Predictions' },
          { id: 'models', label: '🤖 ML Models' },
          { id: 'failures', label: '📊 Failure Analysis' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-t text-sm font-medium transition-colors ${tab === t.id ? 'bg-slate-700 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Active Predictions ────────────────── */}
      {tab === 'predictions' && (
        <div className="card">
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <h3 className="font-semibold text-slate-200">Active Predictions ({filteredPredictions.length})</h3>
            <div className="flex gap-1">
              {['all', 'critical', 'high', 'medium', 'low'].map(f => (
                <button key={f} onClick={() => setRiskFilter(f)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${riskFilter === f ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700 text-slate-400 hover:text-slate-200'}`}>
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="divide-y divide-slate-700/50">
            {filteredPredictions.map(p => (
              <div key={p.id} className="p-4 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}>
                  <div className="w-24">
                    <div className="text-sm font-mono font-bold text-slate-200">{p.vehicle}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{p.type}</div>
                  </div>
                  <div className="w-40">
                    <div className="text-sm text-slate-300">{p.component}</div>
                  </div>
                  <div className="w-20">{riskBadge(p.risk)}</div>
                  <div className="flex-1">{probBar(p.probability)}</div>
                  <div className="w-28 text-right">
                    <div className="text-xs text-slate-400 font-mono">RUL: {p.rul}</div>
                  </div>
                  <div className="w-24 text-right">
                    <div className="text-xs text-amber-400 font-mono">AED {p.cost.toLocaleString()}</div>
                  </div>
                  <div className="w-6 text-slate-500">{expandedId === p.id ? '▾' : '▸'}</div>
                </div>

                {expandedId === p.id && (
                  <div className="mt-3 ml-4 p-4 bg-slate-800/80 rounded-lg border border-slate-700/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">AI Recommendation</h4>
                        <p className="text-sm text-slate-300 leading-relaxed">{p.recommendation}</p>
                        <div className="mt-3 flex gap-2">
                          <button className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 rounded text-xs font-medium hover:bg-cyan-500/30">📋 Create Work Order</button>
                          <button className="px-3 py-1.5 bg-slate-600 text-slate-300 rounded text-xs font-medium hover:bg-slate-500">✓ Acknowledge</button>
                          <button className="px-3 py-1.5 bg-slate-600 text-slate-300 rounded text-xs font-medium hover:bg-slate-500">⏰ Snooze 7d</button>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">Contributing Factors</h4>
                        <ul className="space-y-1.5">
                          {p.factors.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                              <span className="text-amber-400 mt-0.5">⚡</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-900/50 p-2 rounded">
                            <span className="text-slate-500">Confidence:</span>{' '}
                            <span className="text-green-400 font-mono">{p.confidence}%</span>
                          </div>
                          <div className="bg-slate-900/50 p-2 rounded">
                            <span className="text-slate-500">Predicted Failure:</span>{' '}
                            <span className="text-red-400 font-mono">{p.failDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: ML Models ─────────────────────────── */}
      {tab === 'models' && (
        <div className="card">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold text-slate-200">ML Model Performance</h3>
            <p className="text-xs text-slate-500 mt-1">6 production models trained on fleet telemetry data</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-xs text-slate-500 uppercase">
                  <th className="text-left p-3">Model</th>
                  <th className="text-center p-3">Accuracy</th>
                  <th className="text-center p-3">Precision</th>
                  <th className="text-center p-3">Recall</th>
                  <th className="text-center p-3">F1</th>
                  <th className="text-center p-3">Predictions</th>
                  <th className="text-center p-3">Training Data</th>
                  <th className="text-center p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {MODELS.map(m => (
                  <tr key={m.name} className="hover:bg-slate-800/50">
                    <td className="p-3">
                      <div className="font-medium text-slate-200">{m.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase">{m.component}</div>
                    </td>
                    <td className="p-3 text-center font-mono text-green-400">{m.accuracy}%</td>
                    <td className="p-3 text-center font-mono text-slate-300">{m.precision}%</td>
                    <td className="p-3 text-center font-mono text-slate-300">{m.recall}%</td>
                    <td className="p-3 text-center font-mono text-cyan-400">{m.f1}%</td>
                    <td className="p-3 text-center font-mono text-slate-300">{m.predictions}</td>
                    <td className="p-3 text-center text-xs text-slate-400">{m.trainedOn}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${m.status === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB: Failure Analysis ──────────────────── */}
      {tab === 'failures' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">Top Failure Modes</h3>
            <div className="space-y-4">
              {FAILURE_MODES.map((fm, i) => (
                <div key={fm.component} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-4 font-mono">#{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-slate-300">{fm.component}</span>
                      <span className="text-xs text-slate-500">{fm.count} predictions</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${(fm.count / 12) * 100}%` }} />
                    </div>
                    <div className="flex justify-between mt-1 text-[10px] text-slate-500">
                      <span>Avg lead: {fm.avgLead}d</span>
                      <span>Accuracy: {fm.accuracy}%</span>
                      <span className="text-green-400">Saved: {fm.saved}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-4">Cost Savings Analysis</h3>
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-green-400">AED {(totalSavings / 1000).toFixed(0)}K</div>
              <div className="text-xs text-slate-500">Total savings from prevented breakdowns (6 months)</div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avoided tow costs</span>
                <span className="text-green-400 font-mono">AED 84,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Prevented downtime (312 hours)</span>
                <span className="text-green-400 font-mono">AED 156,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Emergency repair premium avoided</span>
                <span className="text-green-400 font-mono">AED 62,400</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Revenue from reduced fleet downtime</span>
                <span className="text-green-400 font-mono">AED 110,400</span>
              </div>
              <div className="border-t border-slate-700 pt-3 flex justify-between text-sm font-semibold">
                <span className="text-slate-200">Total ROI Impact</span>
                <span className="text-green-400 font-mono">AED 412,800</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
