/**
 * InsurancePage — Insurance Integration Module
 *
 * DWVS-based premium optimization using TPM-signed session blocks.
 * Tabs: Dashboard, Policies, Premium Calculator, Block Submission, Providers, Risk Assessment
 *
 * Route: /insurance
 */
import React, { useState } from 'react';

// ── Types ────────────────────────────────────────────────────
interface Policy { id: string; vehicleId: string; policyNumber: string; providerName: string; policyType: string; status: string; basePremiumAED: number; adjustedPremiumAED: number; dwvsDiscountPct: number; vehicleAvgDwvs: number; tpmBlocksSubmitted: number; effectiveDate: string; expiryDate: string; totalClaims: number; totalClaimedAED: number; }
interface Provider { id: string; name: string; supportsDwvs: boolean; supportsTpm: boolean; format: string; refresh: string; policies: number; }

// ── Mock Data ────────────────────────────────────────────────
const policies: Policy[] = [
  { id: 'ins-1', vehicleId: 'TK-0847', policyNumber: 'EI-FL-2025-001', providerName: 'Emirates Insurance', policyType: 'comprehensive', status: 'active', basePremiumAED: 18500, adjustedPremiumAED: 16280, dwvsDiscountPct: 12.0, vehicleAvgDwvs: 0.35, tpmBlocksSubmitted: 285, effectiveDate: '2025-01-01', expiryDate: '2025-12-31', totalClaims: 1, totalClaimedAED: 12400 },
  { id: 'ins-2', vehicleId: 'TK-0923', policyNumber: 'EI-FL-2025-002', providerName: 'Emirates Insurance', policyType: 'hazmat', status: 'active', basePremiumAED: 24000, adjustedPremiumAED: 21120, dwvsDiscountPct: 12.0, vehicleAvgDwvs: 0.32, tpmBlocksSubmitted: 218, effectiveDate: '2025-01-01', expiryDate: '2025-12-31', totalClaims: 0, totalClaimedAED: 0 },
  { id: 'ins-3', vehicleId: 'BUS-201', policyNumber: 'OI-BUS-2025-001', providerName: 'Oman Insurance', policyType: 'fleet_blanket', status: 'active', basePremiumAED: 15200, adjustedPremiumAED: 14440, dwvsDiscountPct: 5.0, vehicleAvgDwvs: 0.48, tpmBlocksSubmitted: 342, effectiveDate: '2025-03-01', expiryDate: '2026-02-28', totalClaims: 2, totalClaimedAED: 8900 },
  { id: 'ins-4', vehicleId: 'BUS-305', policyNumber: 'OI-BUS-2025-002', providerName: 'Oman Insurance', policyType: 'fleet_blanket', status: 'active', basePremiumAED: 15200, adjustedPremiumAED: 14060, dwvsDiscountPct: 7.5, vehicleAvgDwvs: 0.52, tpmBlocksSubmitted: 298, effectiveDate: '2025-03-01', expiryDate: '2026-02-28', totalClaims: 0, totalClaimedAED: 0 },
  { id: 'ins-5', vehicleId: 'TX-5501', policyNumber: 'ZU-TX-2025-001', providerName: 'Zurich UAE', policyType: 'comprehensive', status: 'active', basePremiumAED: 9800, adjustedPremiumAED: 8820, dwvsDiscountPct: 10.0, vehicleAvgDwvs: 0.42, tpmBlocksSubmitted: 410, effectiveDate: '2025-01-01', expiryDate: '2025-12-31', totalClaims: 3, totalClaimedAED: 15600 },
  { id: 'ins-6', vehicleId: 'TX-5622', policyNumber: 'ZU-TX-2025-002', providerName: 'Zurich UAE', policyType: 'comprehensive', status: 'active', basePremiumAED: 9800, adjustedPremiumAED: 8624, dwvsDiscountPct: 12.0, vehicleAvgDwvs: 0.38, tpmBlocksSubmitted: 365, effectiveDate: '2025-01-01', expiryDate: '2025-12-31', totalClaims: 1, totalClaimedAED: 4200 },
];

const providers: Provider[] = [
  { id: 'prov-1', name: 'Emirates Insurance', supportsDwvs: true, supportsTpm: true, format: 'JSON', refresh: 'Monthly', policies: 2 },
  { id: 'prov-2', name: 'Oman Insurance', supportsDwvs: true, supportsTpm: false, format: 'JSON', refresh: 'Quarterly', policies: 2 },
  { id: 'prov-3', name: 'AXA Gulf', supportsDwvs: false, supportsTpm: false, format: 'XML', refresh: 'Annual', policies: 0 },
  { id: 'prov-4', name: 'Zurich UAE', supportsDwvs: true, supportsTpm: true, format: 'JSON', refresh: 'Monthly', policies: 2 },
];

// ── Helpers ──────────────────────────────────────────────────
function fmtAED(n: number): string { return `AED ${n.toLocaleString('en-AE')}`; }
function getDwvsColor(d: number): string { return d < 0.3 ? '#10b981' : d < 0.5 ? '#06b6d4' : d < 0.7 ? '#f59e0b' : '#ef4444'; }

// ── Styles ───────────────────────────────────────────────────
const st = {
  page: { padding: '24px', background: 'var(--bg-primary, #0f172a)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' as const, gap: '16px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#f1f5f9' },
  tabs: { display: 'flex', gap: '4px', background: 'var(--bg-secondary, #1e293b)', borderRadius: '12px', padding: '4px', marginBottom: '24px', overflowX: 'auto' as const },
  tab: (a: boolean) => ({ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: a ? 600 : 400, background: a ? '#06b6d4' : 'transparent', color: a ? '#fff' : '#94a3b8', whiteSpace: 'nowrap' as const }),
  grid: (c: string) => ({ display: 'grid', gridTemplateColumns: c, gap: '16px', marginBottom: '24px' }),
  card: { background: 'var(--bg-secondary, #1e293b)', borderRadius: '12px', padding: '20px', border: '1px solid #334155' } as React.CSSProperties,
  kpi: (c: string) => ({ background: 'var(--bg-secondary, #1e293b)', borderRadius: '12px', padding: '20px', border: '1px solid #334155', borderLeft: `4px solid ${c}` }) as React.CSSProperties,
  kpiLabel: { fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '8px' } as React.CSSProperties,
  kpiValue: { fontSize: '28px', fontWeight: 700, color: '#f1f5f9' } as React.CSSProperties,
  kpiSub: { fontSize: '12px', color: '#64748b', marginTop: '4px' } as React.CSSProperties,
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '13px' } as React.CSSProperties,
  th: { padding: '12px 16px', textAlign: 'left' as const, borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' as const, fontWeight: 600 } as React.CSSProperties,
  td: { padding: '12px 16px', borderBottom: '1px solid #1e293b' } as React.CSSProperties,
  badge: (c: string) => ({ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: `${c}22`, color: c, border: `1px solid ${c}44` }) as React.CSSProperties,
  btn: (c: string) => ({ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', background: c, color: '#fff' }) as React.CSSProperties,
  input: { background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '10px 14px', color: '#e2e8f0', fontSize: '13px', width: '100%' } as React.CSSProperties,
};

// ── Component ────────────────────────────────────────────────
const TABS = ['Dashboard', 'Policies', 'Premium Calculator', 'Block Submission', 'Providers', 'Risk Assessment'];

export default function InsurancePage() {
  const [tab, setTab] = useState(0);
  const [calcDwvs, setCalcDwvs] = useState(0.35);
  const [calcTpm, setCalcTpm] = useState(94);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalBase = policies.reduce((s, p) => s + p.basePremiumAED, 0);
  const totalAdj = policies.reduce((s, p) => s + p.adjustedPremiumAED, 0);
  const totalSavings = totalBase - totalAdj;
  const avgDiscount = policies.reduce((s, p) => s + p.dwvsDiscountPct, 0) / policies.length;

  // ── Premium Calculator Logic ────────────────────────────
  const calcResult = (() => {
    const base = 15000;
    let dwvsDisc = calcDwvs < 0.3 ? 0.15 : calcDwvs < 0.5 ? 0.10 : calcDwvs < 0.7 ? 0.03 : -0.05;
    let tpmBonus = calcTpm > 95 ? 0.05 : calcTpm > 80 ? 0.02 : 0;
    let fleetDisc = 0.03;
    const total = dwvsDisc + tpmBonus + fleetDisc;
    return { base, dwvsDisc, tpmBonus, fleetDisc, total, final: Math.round(base * (1 - total)), savings: Math.round(base * total) };
  })();

  // ── Dashboard ─────────────────────────────────────────────
  const renderDashboard = () => (
    <>
      <div style={st.grid('repeat(auto-fit, minmax(220px, 1fr))')}>
        <div style={st.kpi('#06b6d4')}><div style={st.kpiLabel}>Active Policies</div><div style={st.kpiValue}>{policies.length}</div><div style={st.kpiSub}>Across 3 providers</div></div>
        <div style={st.kpi('#10b981')}><div style={st.kpiLabel}>Annual Savings</div><div style={st.kpiValue}>{fmtAED(totalSavings)}</div><div style={st.kpiSub}>vs. base premium</div></div>
        <div style={st.kpi('#f59e0b')}><div style={st.kpiLabel}>Avg DWVS Discount</div><div style={st.kpiValue}>{avgDiscount.toFixed(1)}%</div><div style={st.kpiSub}>Based on TPM-signed data</div></div>
        <div style={st.kpi('#a855f7')}><div style={st.kpiLabel}>TPM Coverage</div><div style={st.kpiValue}>94%</div><div style={st.kpiSub}>Blocks cryptographically verified</div></div>
      </div>
      <div style={st.grid('1fr 1fr')}>
        <div style={st.card}>
          <div style={{ fontWeight: 700, marginBottom: '16px' }}>💰 Premium Breakdown by Vehicle</div>
          {policies.map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{p.vehicleId}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{p.providerName} • {p.policyType}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#10b981', fontWeight: 600 }}>{fmtAED(p.adjustedPremiumAED)}</div>
                <div style={{ fontSize: '11px', color: '#64748b', textDecoration: 'line-through' }}>{fmtAED(p.basePremiumAED)}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={st.card}>
          <div style={{ fontWeight: 700, marginBottom: '16px' }}>🏢 Provider Distribution</div>
          {providers.filter(pr => pr.policies > 0).map(pr => (
            <div key={pr.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 600 }}>{pr.name}</span>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{pr.policies} policies</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {pr.supportsDwvs && <span style={st.badge('#10b981')}>DWVS</span>}
                {pr.supportsTpm && <span style={st.badge('#06b6d4')}>TPM</span>}
                <span style={st.badge('#64748b')}>{pr.format}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // ── Policies ──────────────────────────────────────────────
  const renderPolicies = () => (
    <div style={{ ...st.card, overflow: 'auto' }}>
      <table style={st.table}>
        <thead>
          <tr>
            <th style={st.th}>Vehicle</th><th style={st.th}>Policy #</th><th style={st.th}>Provider</th><th style={st.th}>Type</th>
            <th style={st.th}>DWVS</th><th style={st.th}>Base</th><th style={st.th}>Adjusted</th><th style={st.th}>Discount</th>
            <th style={st.th}>TPM Blocks</th><th style={st.th}>Claims</th><th style={st.th}>Expiry</th><th style={st.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {policies.map(p => (
            <tr key={p.id}>
              <td style={st.td}><span style={{ fontWeight: 600 }}>{p.vehicleId}</span></td>
              <td style={st.td}>{p.policyNumber}</td>
              <td style={st.td}>{p.providerName}</td>
              <td style={st.td}><span style={st.badge('#64748b')}>{p.policyType}</span></td>
              <td style={st.td}><span style={{ color: getDwvsColor(p.vehicleAvgDwvs), fontWeight: 600 }}>{p.vehicleAvgDwvs.toFixed(2)}</span></td>
              <td style={st.td}>{fmtAED(p.basePremiumAED)}</td>
              <td style={{ ...st.td, color: '#10b981', fontWeight: 600 }}>{fmtAED(p.adjustedPremiumAED)}</td>
              <td style={{ ...st.td, color: '#10b981' }}>-{p.dwvsDiscountPct}%</td>
              <td style={st.td}>{p.tpmBlocksSubmitted}</td>
              <td style={st.td}>{p.totalClaims} ({fmtAED(p.totalClaimedAED)})</td>
              <td style={st.td}>{p.expiryDate}</td>
              <td style={st.td}><span style={st.badge('#10b981')}>Active</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ── Premium Calculator ────────────────────────────────────
  const renderCalculator = () => (
    <div style={st.grid('1fr 1fr')}>
      <div style={st.card}>
        <div style={{ fontWeight: 700, marginBottom: '20px' }}>🧮 DWVS Premium Calculator</div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Vehicle Avg DWVS: {calcDwvs.toFixed(2)}</label>
          <input type="range" min="0" max="1" step="0.01" value={calcDwvs} onChange={e => setCalcDwvs(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: getDwvsColor(calcDwvs) }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
            <span>0.0 (Excellent)</span><span>0.5</span><span>1.0 (Poor)</span>
          </div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>TPM Coverage: {calcTpm}%</label>
          <input type="range" min="0" max="100" step="1" value={calcTpm} onChange={e => setCalcTpm(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: '#06b6d4' }} />
        </div>
      </div>
      <div style={st.card}>
        <div style={{ fontWeight: 700, marginBottom: '20px' }}>📊 Premium Result</div>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8' }}>Base Premium</span><span style={{ fontWeight: 600 }}>{fmtAED(calcResult.base)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8' }}>DWVS Discount</span><span style={{ color: calcResult.dwvsDisc > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>{calcResult.dwvsDisc > 0 ? '-' : '+'}{Math.abs(calcResult.dwvsDisc * 100).toFixed(0)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8' }}>TPM Bonus</span><span style={{ color: '#10b981', fontWeight: 600 }}>-{(calcResult.tpmBonus * 100).toFixed(0)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #334155' }}>
            <span style={{ color: '#94a3b8' }}>Fleet Discount</span><span style={{ color: '#10b981', fontWeight: 600 }}>-{(calcResult.fleetDisc * 100).toFixed(0)}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontSize: '18px' }}>
            <span style={{ fontWeight: 700, color: '#f1f5f9' }}>Adjusted Premium</span>
            <span style={{ fontWeight: 700, color: '#10b981' }}>{fmtAED(calcResult.final)}</span>
          </div>
          <div style={{ textAlign: 'center', padding: '12px', background: '#10b98115', borderRadius: '8px', color: '#10b981', fontWeight: 600 }}>
            You save {fmtAED(calcResult.savings)} ({(calcResult.total * 100).toFixed(0)}%)
          </div>
        </div>
      </div>
    </div>
  );

  // ── Block Submission ──────────────────────────────────────
  const renderSubmission = () => (
    <div style={st.grid('1fr 1fr')}>
      <div style={st.card}>
        <div style={{ fontWeight: 700, marginBottom: '20px' }}>📤 Submit TPM-Signed Session Blocks</div>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Select Policy</label>
          <select style={st.input as any}>{policies.map(p => <option key={p.id} value={p.id}>{p.vehicleId} — {p.policyNumber}</option>)}</select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div><label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Period Start</label><input type="date" defaultValue="2025-02-01" style={st.input} /></div>
          <div><label style={{ fontSize: '12px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Period End</label><input type="date" defaultValue="2025-02-28" style={st.input} /></div>
        </div>
        <div style={{ padding: '12px', background: '#0f172a', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
          <div style={{ color: '#06b6d4', fontWeight: 600, marginBottom: '8px' }}>Blocks Ready for Submission:</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: '#94a3b8' }}>
            <span>Total blocks: 47</span><span>TPM-signed: 44 (94%)</span>
            <span>Avg DWVS: 0.38</span><span>Total km: 12,840</span>
          </div>
        </div>
        <button style={st.btn('#06b6d4')} onClick={() => { setSubmitting(true); setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 2000); }}>
          {submitting ? '⏳ Submitting to Provider...' : submitted ? '✅ Submitted Successfully' : '📤 Submit Session Blocks'}
        </button>
      </div>
      <div style={st.card}>
        <div style={{ fontWeight: 700, marginBottom: '20px' }}>📋 Submission History</div>
        {[
          { date: '2025-02-01', blocks: 52, dwvs: 0.36, status: 'accepted', impact: '-12%' },
          { date: '2025-01-01', blocks: 48, dwvs: 0.40, status: 'accepted', impact: '-10%' },
          { date: '2024-12-01', blocks: 45, dwvs: 0.42, status: 'accepted', impact: '-10%' },
          { date: '2024-11-01', blocks: 41, dwvs: 0.45, status: 'accepted', impact: '-8%' },
        ].map((sub, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e293b' }}>
            <div><div style={{ fontWeight: 600 }}>{sub.date}</div><div style={{ fontSize: '11px', color: '#64748b' }}>{sub.blocks} blocks • Avg DWVS {sub.dwvs}</div></div>
            <div style={{ textAlign: 'right' }}><span style={st.badge('#10b981')}>{sub.status}</span><div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>Premium: {sub.impact}</div></div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Providers ─────────────────────────────────────────────
  const renderProviders = () => (
    <div style={st.grid('repeat(auto-fill, minmax(300px, 1fr))')}>
      {providers.map(pr => (
        <div key={pr.id} style={{ ...st.card, borderLeft: `4px solid ${pr.supportsDwvs ? '#10b981' : '#64748b'}` }}>
          <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '12px' }}>{pr.name}</div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' as const }}>
            <span style={st.badge(pr.supportsDwvs ? '#10b981' : '#ef4444')}>{pr.supportsDwvs ? '✓ DWVS' : '✗ DWVS'}</span>
            <span style={st.badge(pr.supportsTpm ? '#10b981' : '#ef4444')}>{pr.supportsTpm ? '✓ TPM' : '✗ TPM'}</span>
            <span style={st.badge('#06b6d4')}>{pr.format}</span>
            <span style={st.badge('#f59e0b')}>{pr.refresh}</span>
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>
            {pr.policies} active policies • Data refresh: {pr.refresh.toLowerCase()}
          </div>
        </div>
      ))}
    </div>
  );

  // ── Risk Assessment ───────────────────────────────────────
  const renderRisk = () => (
    <>
      <div style={st.grid('1fr 1fr 1fr')}>
        <div style={st.kpi('#06b6d4')}><div style={st.kpiLabel}>Fleet Risk Score</div><div style={st.kpiValue}>0.38</div><div style={st.kpiSub}>Moderate — below industry avg</div></div>
        <div style={st.kpi('#10b981')}><div style={st.kpiLabel}>Claims Ratio</div><div style={st.kpiValue}>12%</div><div style={st.kpiSub}>Well below 25% threshold</div></div>
        <div style={st.kpi('#f59e0b')}><div style={st.kpiLabel}>Projected Savings</div><div style={st.kpiValue}>AED 185K</div><div style={st.kpiSub}>Annual with full DWVS adoption</div></div>
      </div>
      <div style={st.card}>
        <div style={{ fontWeight: 700, marginBottom: '16px' }}>🎯 Risk Factors</div>
        {[
          { factor: 'Fleet Avg DWVS', value: '0.42', weight: '30%', impact: 'moderate', color: '#f59e0b' },
          { factor: 'TPM Coverage', value: '94%', weight: '20%', impact: 'low', color: '#10b981' },
          { factor: 'Claims Ratio', value: '12%', weight: '25%', impact: 'low', color: '#10b981' },
          { factor: 'Driver Variance', value: '0.43', weight: '15%', impact: 'moderate', color: '#f59e0b' },
          { factor: 'Fleet Age', value: '3.2 yrs', weight: '10%', impact: 'low', color: '#10b981' },
        ].map((f, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
            <div style={{ fontWeight: 600 }}>{f.factor}</div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span>{f.value}</span>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Weight: {f.weight}</span>
              <span style={st.badge(f.color)}>{f.impact}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={st.card}>
        <div style={{ fontWeight: 700, marginBottom: '16px' }}>💡 Recommendations</div>
        {[
          { action: 'Reduce high-DWVS driver assignments on insured vehicles', impact: '-8% premium', priority: 'high' },
          { action: 'Increase TPM coverage from 94% to 98%', impact: '-3% premium', priority: 'medium' },
          { action: 'Complete driver training for 4 identified operators', impact: '-5% premium', priority: 'high' },
        ].map((r, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
            <span>{r.action}</span>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>{r.impact}</span>
              <span style={st.badge(r.priority === 'high' ? '#f59e0b' : '#06b6d4')}>{r.priority}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );

  const content = [renderDashboard, renderPolicies, renderCalculator, renderSubmission, renderProviders, renderRisk];

  return (
    <div style={st.page}>
      <div style={st.header}>
        <div style={st.title as any}>🛡️ Insurance Integration <span style={st.badge('#06b6d4')}>DWVS-Powered</span></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={st.badge('#10b981')}>Savings: {fmtAED(totalSavings)}/yr</span>
          <span style={st.badge('#64748b')}>{policies.length} Policies</span>
        </div>
      </div>
      <div style={st.tabs}>{TABS.map((t, i) => <button key={t} style={st.tab(tab === i)} onClick={() => setTab(i)}>{t}</button>)}</div>
      {content[tab]()}
    </div>
  );
}
