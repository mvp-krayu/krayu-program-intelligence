/**
 * FleetDwvsDashboardPage — Fleet-Wide Driver Wear Variance Score Dashboard
 *
 * Patent-Pending DIAM (Driver Impact Attribution Model) visualization.
 * Shows DWVS rankings across ALL vehicles and drivers, enabling:
 *   - Fleet-wide driver impact comparison
 *   - Vehicle wear attribution by driver
 *   - Real-time session monitoring
 *   - Insurance premium correlation
 *   - Training priority identification
 *
 * Route: /fleet-dwvs
 */
import React, { useState, useMemo } from 'react';

// ── Types ────────────────────────────────────────────────────
interface DriverDwvsRecord {
  driverId: string;
  driverName: string;
  totalSessions: number;
  totalKm: number;
  avgDwvs: number;
  latestDwvs: number;
  trend: number; // positive = getting worse
  rpmCv: number;
  harshEventRate: number;
  speedCv: number;
  fuelRateCv: number;
  dtcRate: number;
  idleCv: number;
  avgWearIndex: number;
  totalHealthDelta: number;
  vehiclesDriven: number;
  lastSessionDate: string;
  fleetType: 'tanker' | 'bus' | 'taxi';
  rating: 'excellent' | 'good' | 'fair' | 'poor';
}

interface VehicleDwvsRecord {
  vehicleId: string;
  vehicleName: string;
  fleetType: 'tanker' | 'bus' | 'taxi';
  totalSessions: number;
  uniqueDrivers: number;
  avgDwvs: number;
  bestDriverDwvs: number;
  bestDriverName: string;
  worstDriverDwvs: number;
  worstDriverName: string;
  driverVariance: number;
  healthScore: number;
  totalKm: number;
  totalHealthDelta: number;
}

interface SessionBlock {
  id: string;
  blockNumber: number;
  vehicleId: string;
  driverId: string;
  driverName: string;
  startTime: string;
  endTime: string | null;
  durationMinutes: number;
  distanceKm: number;
  wearIndex: number;
  dwvs: number;
  status: 'active' | 'closed' | 'interrupted';
  tpmSigned: boolean;
  authMethod: string;
}

interface FleetInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'achievement' | 'recommendation';
  title: string;
  description: string;
  impact: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  driverIds?: string[];
  vehicleIds?: string[];
}

// ── Mock Data ────────────────────────────────────────────────
const MOCK_DRIVERS: DriverDwvsRecord[] = [
  { driverId: 'd-001', driverName: 'Ahmed Al Mansouri', totalSessions: 142, totalKm: 38450, avgDwvs: 0.22, latestDwvs: 0.19, trend: -0.03, rpmCv: 0.18, harshEventRate: 0.08, speedCv: 0.12, fuelRateCv: 0.15, dtcRate: 0.02, idleCv: 0.08, avgWearIndex: 0.18, totalHealthDelta: -0.42, vehiclesDriven: 4, lastSessionDate: '2025-02-15T10:30:00', fleetType: 'tanker', rating: 'excellent' },
  { driverId: 'd-002', driverName: 'Saeed Al Ketbi', totalSessions: 128, totalKm: 34200, avgDwvs: 0.25, latestDwvs: 0.21, trend: -0.04, rpmCv: 0.20, harshEventRate: 0.10, speedCv: 0.14, fuelRateCv: 0.16, dtcRate: 0.03, idleCv: 0.09, avgWearIndex: 0.20, totalHealthDelta: -0.55, vehiclesDriven: 3, lastSessionDate: '2025-02-14T19:30:00', fleetType: 'tanker', rating: 'excellent' },
  { driverId: 'd-003', driverName: 'Fatima Al Suwaidi', totalSessions: 198, totalKm: 28900, avgDwvs: 0.42, latestDwvs: 0.45, trend: 0.03, rpmCv: 0.32, harshEventRate: 0.28, speedCv: 0.35, fuelRateCv: 0.30, dtcRate: 0.08, idleCv: 0.18, avgWearIndex: 0.38, totalHealthDelta: -1.85, vehiclesDriven: 5, lastSessionDate: '2025-02-15T13:00:00', fleetType: 'bus', rating: 'good' },
  { driverId: 'd-004', driverName: 'Hassan Mirza', totalSessions: 165, totalKm: 24100, avgDwvs: 0.68, latestDwvs: 0.71, trend: 0.03, rpmCv: 0.48, harshEventRate: 0.42, speedCv: 0.52, fuelRateCv: 0.45, dtcRate: 0.15, idleCv: 0.28, avgWearIndex: 0.62, totalHealthDelta: -4.20, vehiclesDriven: 4, lastSessionDate: '2025-02-15T22:30:00', fleetType: 'bus', rating: 'fair' },
  { driverId: 'd-005', driverName: 'Omar Hussain', totalSessions: 312, totalKm: 82400, avgDwvs: 0.35, latestDwvs: 0.38, trend: 0.03, rpmCv: 0.28, harshEventRate: 0.18, speedCv: 0.42, fuelRateCv: 0.20, dtcRate: 0.05, idleCv: 0.12, avgWearIndex: 0.30, totalHealthDelta: -1.20, vehiclesDriven: 6, lastSessionDate: '2025-02-15T19:00:00', fleetType: 'taxi', rating: 'good' },
  { driverId: 'd-006', driverName: 'Khalid bin Rashid', totalSessions: 95, totalKm: 28500, avgDwvs: 0.58, latestDwvs: 0.62, trend: 0.04, rpmCv: 0.42, harshEventRate: 0.35, speedCv: 0.38, fuelRateCv: 0.48, dtcRate: 0.12, idleCv: 0.22, avgWearIndex: 0.52, totalHealthDelta: -3.10, vehiclesDriven: 3, lastSessionDate: '2025-02-15T16:45:00', fleetType: 'tanker', rating: 'fair' },
  { driverId: 'd-007', driverName: 'Noura Al Hashemi', totalSessions: 88, totalKm: 12800, avgDwvs: 0.78, latestDwvs: 0.82, trend: 0.04, rpmCv: 0.55, harshEventRate: 0.48, speedCv: 0.58, fuelRateCv: 0.52, dtcRate: 0.18, idleCv: 0.35, avgWearIndex: 0.72, totalHealthDelta: -5.80, vehiclesDriven: 2, lastSessionDate: '2025-02-14T16:45:00', fleetType: 'bus', rating: 'poor' },
  { driverId: 'd-008', driverName: 'Rashid Al Maktoum', totalSessions: 245, totalKm: 65200, avgDwvs: 0.28, latestDwvs: 0.26, trend: -0.02, rpmCv: 0.22, harshEventRate: 0.12, speedCv: 0.18, fuelRateCv: 0.18, dtcRate: 0.04, idleCv: 0.10, avgWearIndex: 0.22, totalHealthDelta: -0.68, vehiclesDriven: 5, lastSessionDate: '2025-02-15T15:00:00', fleetType: 'taxi', rating: 'excellent' },
  { driverId: 'd-009', driverName: 'Ali Al Zaabi', totalSessions: 176, totalKm: 48300, avgDwvs: 0.45, latestDwvs: 0.42, trend: -0.03, rpmCv: 0.35, harshEventRate: 0.22, speedCv: 0.30, fuelRateCv: 0.32, dtcRate: 0.08, idleCv: 0.15, avgWearIndex: 0.38, totalHealthDelta: -1.95, vehiclesDriven: 4, lastSessionDate: '2025-02-15T12:00:00', fleetType: 'tanker', rating: 'good' },
  { driverId: 'd-010', driverName: 'Mariam Al Shamsi', totalSessions: 210, totalKm: 30500, avgDwvs: 0.32, latestDwvs: 0.30, trend: -0.02, rpmCv: 0.25, harshEventRate: 0.15, speedCv: 0.22, fuelRateCv: 0.24, dtcRate: 0.05, idleCv: 0.11, avgWearIndex: 0.26, totalHealthDelta: -0.88, vehiclesDriven: 3, lastSessionDate: '2025-02-15T14:30:00', fleetType: 'bus', rating: 'good' },
  { driverId: 'd-011', driverName: 'Youssef Hammadi', totalSessions: 158, totalKm: 42100, avgDwvs: 0.72, latestDwvs: 0.75, trend: 0.03, rpmCv: 0.52, harshEventRate: 0.45, speedCv: 0.55, fuelRateCv: 0.48, dtcRate: 0.16, idleCv: 0.30, avgWearIndex: 0.68, totalHealthDelta: -4.95, vehiclesDriven: 5, lastSessionDate: '2025-02-15T18:00:00', fleetType: 'taxi', rating: 'poor' },
  { driverId: 'd-012', driverName: 'Sara Al Muhairi', totalSessions: 132, totalKm: 19200, avgDwvs: 0.38, latestDwvs: 0.35, trend: -0.03, rpmCv: 0.30, harshEventRate: 0.20, speedCv: 0.25, fuelRateCv: 0.28, dtcRate: 0.06, idleCv: 0.14, avgWearIndex: 0.32, totalHealthDelta: -1.12, vehiclesDriven: 3, lastSessionDate: '2025-02-15T11:00:00', fleetType: 'bus', rating: 'good' },
];

const MOCK_VEHICLES: VehicleDwvsRecord[] = [
  { vehicleId: 'TK-0847', vehicleName: 'Tanker 0847', fleetType: 'tanker', totalSessions: 285, uniqueDrivers: 4, avgDwvs: 0.35, bestDriverDwvs: 0.19, bestDriverName: 'Ahmed Al Mansouri', worstDriverDwvs: 0.62, worstDriverName: 'Khalid bin Rashid', driverVariance: 0.43, healthScore: 82, totalKm: 78200, totalHealthDelta: -3.80 },
  { vehicleId: 'TK-0923', vehicleName: 'Tanker 0923', fleetType: 'tanker', totalSessions: 218, uniqueDrivers: 3, avgDwvs: 0.32, bestDriverDwvs: 0.22, bestDriverName: 'Ahmed Al Mansouri', worstDriverDwvs: 0.45, worstDriverName: 'Ali Al Zaabi', driverVariance: 0.23, healthScore: 87, totalKm: 62400, totalHealthDelta: -2.10 },
  { vehicleId: 'BUS-201', vehicleName: 'Bus 201', fleetType: 'bus', totalSessions: 342, uniqueDrivers: 5, avgDwvs: 0.48, bestDriverDwvs: 0.30, bestDriverName: 'Mariam Al Shamsi', worstDriverDwvs: 0.82, worstDriverName: 'Noura Al Hashemi', driverVariance: 0.52, healthScore: 68, totalKm: 52100, totalHealthDelta: -6.50 },
  { vehicleId: 'BUS-305', vehicleName: 'Bus 305', fleetType: 'bus', totalSessions: 298, uniqueDrivers: 4, avgDwvs: 0.52, bestDriverDwvs: 0.35, bestDriverName: 'Sara Al Muhairi', worstDriverDwvs: 0.71, worstDriverName: 'Hassan Mirza', driverVariance: 0.36, healthScore: 72, totalKm: 44800, totalHealthDelta: -5.20 },
  { vehicleId: 'TX-5501', vehicleName: 'Taxi 5501', fleetType: 'taxi', totalSessions: 410, uniqueDrivers: 6, avgDwvs: 0.42, bestDriverDwvs: 0.26, bestDriverName: 'Rashid Al Maktoum', worstDriverDwvs: 0.75, worstDriverName: 'Youssef Hammadi', driverVariance: 0.49, healthScore: 75, totalKm: 98500, totalHealthDelta: -4.80 },
  { vehicleId: 'TX-5622', vehicleName: 'Taxi 5622', fleetType: 'taxi', totalSessions: 365, uniqueDrivers: 4, avgDwvs: 0.38, bestDriverDwvs: 0.28, bestDriverName: 'Rashid Al Maktoum', worstDriverDwvs: 0.72, worstDriverName: 'Youssef Hammadi', driverVariance: 0.44, healthScore: 78, totalKm: 85200, totalHealthDelta: -3.90 },
];

const MOCK_LIVE_SESSIONS: SessionBlock[] = [
  { id: 'sess-001', blockNumber: 1007, vehicleId: 'TK-0847', driverId: 'd-001', driverName: 'Ahmed Al Mansouri', startTime: '2025-02-15T18:00:00', endTime: null, durationMinutes: 45, distanceKm: 32, wearIndex: 0.15, dwvs: 0.19, status: 'active', tpmSigned: false, authMethod: 'faceid_nfc' },
  { id: 'sess-002', blockNumber: 1008, vehicleId: 'BUS-201', driverId: 'd-003', driverName: 'Fatima Al Suwaidi', startTime: '2025-02-15T17:30:00', endTime: null, durationMinutes: 75, distanceKm: 18, wearIndex: 0.42, dwvs: 0.45, status: 'active', tpmSigned: false, authMethod: 'pin_rfid' },
  { id: 'sess-003', blockNumber: 1009, vehicleId: 'TX-5501', driverId: 'd-008', driverName: 'Rashid Al Maktoum', startTime: '2025-02-15T16:00:00', endTime: null, durationMinutes: 165, distanceKm: 78, wearIndex: 0.22, dwvs: 0.26, status: 'active', tpmSigned: false, authMethod: 'biometric' },
];

const MOCK_INSIGHTS: FleetInsight[] = [
  { id: 'ins-1', type: 'warning', title: 'High-Wear Drivers Identified', description: 'Noura Al Hashemi and Youssef Hammadi have DWVS > 0.7 — causing accelerated vehicle depreciation. Combined annual cost impact estimated at AED 48,500.', impact: 'AED 48,500/yr', priority: 'critical', driverIds: ['d-007', 'd-011'] },
  { id: 'ins-2', type: 'opportunity', title: 'Driver-Vehicle Reassignment Opportunity', description: 'BUS-201 has 0.52 driver variance — highest in fleet. Reassigning Noura Al Hashemi to training and replacing with Mariam Al Shamsi reduces projected wear by 38%.', impact: '-38% wear on BUS-201', priority: 'high', vehicleIds: ['BUS-201'] },
  { id: 'ins-3', type: 'achievement', title: 'Top Performer Recognition', description: 'Ahmed Al Mansouri maintains DWVS < 0.25 across 142 sessions. Estimated annual savings of AED 12,800 in reduced maintenance vs fleet average.', impact: 'AED 12,800/yr saved', priority: 'medium', driverIds: ['d-001'] },
  { id: 'ins-4', type: 'recommendation', title: 'Insurance Premium Optimization', description: 'Sharing TPM-signed session blocks with insurance partners shows 72% of fleet sessions have DWVS < 0.5. Projected premium reduction: 8-12%.', impact: '8-12% premium reduction', priority: 'high' },
  { id: 'ins-5', type: 'recommendation', title: 'Training Priority Queue', description: '4 drivers exceed fleet DWVS threshold of 0.5. Recommended training order: Noura Al Hashemi (0.82), Youssef Hammadi (0.75), Hassan Mirza (0.71), Khalid bin Rashid (0.62).', impact: 'Projected -22% fleet avg wear', priority: 'high', driverIds: ['d-007', 'd-011', 'd-004', 'd-006'] },
];

// ── Helper Functions ─────────────────────────────────────────
function getDwvsColor(dwvs: number): string {
  if (dwvs < 0.3) return '#10b981';
  if (dwvs < 0.5) return '#06b6d4';
  if (dwvs < 0.7) return '#f59e0b';
  return '#ef4444';
}

function getDwvsLabel(dwvs: number): string {
  if (dwvs < 0.3) return 'Excellent';
  if (dwvs < 0.5) return 'Good';
  if (dwvs < 0.7) return 'Fair';
  return 'Poor';
}

function getInsightIcon(type: string): string {
  switch (type) {
    case 'warning': return '⚠️';
    case 'opportunity': return '💡';
    case 'achievement': return '🏆';
    case 'recommendation': return '🎯';
    default: return '📊';
  }
}

function getInsightColor(priority: string): string {
  switch (priority) {
    case 'critical': return '#ef4444';
    case 'high': return '#f59e0b';
    case 'medium': return '#06b6d4';
    default: return '#64748b';
  }
}

function fmtNum(n: number, d = 0): string { return n.toLocaleString('en-AE', { maximumFractionDigits: d }); }
function fmtPct(n: number): string { return `${(n * 100).toFixed(1)}%`; }
function fmtDate(d: string): string { return new Date(d).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }); }

// ── Styles ───────────────────────────────────────────────────
const s = {
  page: { padding: '24px', background: 'var(--bg-primary, #0f172a)', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'Inter, system-ui, sans-serif' } as React.CSSProperties,
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' as const, gap: '16px' },
  title: { fontSize: '24px', fontWeight: 700, color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: '12px' },
  badge: (color: string) => ({ padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, background: `${color}22`, color, border: `1px solid ${color}44` }) as React.CSSProperties,
  tabs: { display: 'flex', gap: '4px', background: 'var(--bg-secondary, #1e293b)', borderRadius: '12px', padding: '4px', marginBottom: '24px', overflowX: 'auto' as const },
  tab: (active: boolean) => ({ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: active ? 600 : 400, background: active ? '#06b6d4' : 'transparent', color: active ? '#fff' : '#94a3b8', transition: 'all 0.2s', whiteSpace: 'nowrap' as const }),
  grid: (cols: string) => ({ display: 'grid', gridTemplateColumns: cols, gap: '16px', marginBottom: '24px' }),
  card: { background: 'var(--bg-secondary, #1e293b)', borderRadius: '12px', padding: '20px', border: '1px solid #334155' } as React.CSSProperties,
  kpiCard: (accent: string) => ({ ...s.card, borderLeft: `4px solid ${accent}` }) as React.CSSProperties,
  kpiLabel: { fontSize: '12px', color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.5px', marginBottom: '8px' },
  kpiValue: { fontSize: '28px', fontWeight: 700, color: '#f1f5f9' },
  kpiSub: { fontSize: '12px', color: '#64748b', marginTop: '4px' },
  table: { width: '100%', borderCollapse: 'collapse' as const, fontSize: '13px' },
  th: { padding: '12px 16px', textAlign: 'left' as const, borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', fontWeight: 600 },
  td: { padding: '12px 16px', borderBottom: '1px solid #1e293b' },
  bar: (width: number, color: string) => ({ width: `${Math.min(width, 100)}%`, height: '8px', borderRadius: '4px', background: color, transition: 'width 0.3s' }),
  barBg: { width: '100%', height: '8px', borderRadius: '4px', background: '#1e293b' },
  dwvsCell: (dwvs: number) => ({ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '8px', background: `${getDwvsColor(dwvs)}15`, color: getDwvsColor(dwvs), fontWeight: 600, fontSize: '14px' }),
  liveIndicator: { width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite', display: 'inline-block' },
  filterBar: { display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap' as const },
  select: { background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '8px 12px', color: '#e2e8f0', fontSize: '13px' } as React.CSSProperties,
  insight: (color: string) => ({ ...s.card, borderLeft: `4px solid ${color}`, display: 'flex', gap: '16px', alignItems: 'flex-start' }) as React.CSSProperties,
  formulaBox: { ...s.card, background: '#0f172a', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', lineHeight: 1.8 } as React.CSSProperties,
  variance: (val: number, positive: string, negative: string) => ({ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: val > 0 ? `${negative}15` : `${positive}15`, color: val > 0 ? negative : positive }),
};

// ── Component ────────────────────────────────────────────────
const TABS = ['Overview', 'Driver Rankings', 'Vehicle Attribution', 'Live Sessions', 'AI Insights', 'DIAM Formula', 'Insurance Data', 'Trends'];

export default function FleetDwvsDashboardPage() {
  const [tab, setTab] = useState(0);
  const [fleetFilter, setFleetFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('avgDwvs');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  // ── Filtered & Sorted Data ──────────────────────────────
  const filteredDrivers = useMemo(() => {
    let list = [...MOCK_DRIVERS];
    if (fleetFilter !== 'all') list = list.filter(d => d.fleetType === fleetFilter);
    list.sort((a, b) => {
      const av = (a as any)[sortBy] ?? 0;
      const bv = (b as any)[sortBy] ?? 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return list;
  }, [fleetFilter, sortBy, sortDir]);

  const filteredVehicles = useMemo(() => {
    let list = [...MOCK_VEHICLES];
    if (fleetFilter !== 'all') list = list.filter(v => v.fleetType === fleetFilter);
    return list.sort((a, b) => a.avgDwvs - b.avgDwvs);
  }, [fleetFilter]);

  // ── Fleet KPIs ──────────────────────────────────────────
  const fleetAvgDwvs = MOCK_DRIVERS.reduce((sum, d) => sum + d.avgDwvs, 0) / MOCK_DRIVERS.length;
  const excellentCount = MOCK_DRIVERS.filter(d => d.rating === 'excellent').length;
  const poorCount = MOCK_DRIVERS.filter(d => d.rating === 'poor').length;
  const totalSessions = MOCK_DRIVERS.reduce((sum, d) => sum + d.totalSessions, 0);
  const activeSessions = MOCK_LIVE_SESSIONS.length;
  const tpmSignedPct = 0.94;

  // ── Tab: Overview ────────────────────────────────────────
  const renderOverview = () => (
    <>
      <div style={s.grid('repeat(auto-fit, minmax(220px, 1fr))')}>
        <div style={s.kpiCard('#06b6d4')}>
          <div style={s.kpiLabel}>Fleet Avg DWVS</div>
          <div style={{ ...s.kpiValue, color: getDwvsColor(fleetAvgDwvs) }}>{fleetAvgDwvs.toFixed(3)}</div>
          <div style={s.kpiSub}>{getDwvsLabel(fleetAvgDwvs)} — across {MOCK_DRIVERS.length} drivers</div>
        </div>
        <div style={s.kpiCard('#10b981')}>
          <div style={s.kpiLabel}>Excellent Drivers (DWVS {'<'} 0.3)</div>
          <div style={s.kpiValue}>{excellentCount}</div>
          <div style={s.kpiSub}>{((excellentCount / MOCK_DRIVERS.length) * 100).toFixed(0)}% of fleet</div>
        </div>
        <div style={s.kpiCard('#ef4444')}>
          <div style={s.kpiLabel}>Needs Training (DWVS {'>'} 0.7)</div>
          <div style={s.kpiValue}>{poorCount}</div>
          <div style={s.kpiSub}>Est. AED {fmtNum(poorCount * 24000)}/yr excess wear</div>
        </div>
        <div style={s.kpiCard('#f59e0b')}>
          <div style={s.kpiLabel}>Total Session Blocks</div>
          <div style={s.kpiValue}>{fmtNum(totalSessions)}</div>
          <div style={s.kpiSub}>{activeSessions} active now • {fmtPct(tpmSignedPct)} TPM signed</div>
        </div>
      </div>

      {/* Distribution Chart */}
      <div style={s.card}>
        <div style={{ fontWeight: 600, marginBottom: '16px', fontSize: '15px' }}>DWVS Distribution — All Drivers</div>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '200px', padding: '0 8px' }}>
          {MOCK_DRIVERS.sort((a, b) => a.avgDwvs - b.avgDwvs).map(d => (
            <div key={d.driverId} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
                 onClick={() => setSelectedDriver(selectedDriver === d.driverId ? null : d.driverId)} title={`${d.driverName}: ${d.avgDwvs.toFixed(3)}`}>
              <div style={{ width: '100%', maxWidth: '48px', height: `${Math.max(d.avgDwvs * 250, 10)}px`, background: getDwvsColor(d.avgDwvs), borderRadius: '4px 4px 0 0', opacity: selectedDriver && selectedDriver !== d.driverId ? 0.3 : 1, transition: 'all 0.3s' }} />
              <div style={{ fontSize: '9px', color: '#64748b', textAlign: 'center', maxWidth: '48px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {d.driverName.split(' ')[0]}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
          {[{ label: 'Excellent', color: '#10b981', range: '< 0.3' }, { label: 'Good', color: '#06b6d4', range: '0.3–0.5' }, { label: 'Fair', color: '#f59e0b', range: '0.5–0.7' }, { label: 'Poor', color: '#ef4444', range: '> 0.7' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: l.color }} />
              {l.label} ({l.range})
            </div>
          ))}
        </div>
      </div>

      {/* Top & Bottom performers */}
      <div style={s.grid('1fr 1fr')}>
        <div style={s.card}>
          <div style={{ fontWeight: 600, marginBottom: '12px', color: '#10b981' }}>🏆 Top 3 Drivers (Lowest DWVS)</div>
          {[...MOCK_DRIVERS].sort((a, b) => a.avgDwvs - b.avgDwvs).slice(0, 3).map((d, i) => (
            <div key={d.driverId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid #334155' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{i + 1}. {d.driverName}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{d.totalSessions} sessions • {fmtNum(d.totalKm)} km • {d.fleetType}</div>
              </div>
              <div style={s.dwvsCell(d.avgDwvs)}>{d.avgDwvs.toFixed(3)}</div>
            </div>
          ))}
        </div>
        <div style={s.card}>
          <div style={{ fontWeight: 600, marginBottom: '12px', color: '#ef4444' }}>⚠️ Bottom 3 Drivers (Highest DWVS)</div>
          {[...MOCK_DRIVERS].sort((a, b) => b.avgDwvs - a.avgDwvs).slice(0, 3).map((d, i) => (
            <div key={d.driverId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 2 ? '1px solid #334155' : 'none' }}>
              <div>
                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{d.driverName}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{d.totalSessions} sessions • Est. AED {fmtNum(Math.round(d.totalHealthDelta * -8500))}/yr excess</div>
              </div>
              <div style={s.dwvsCell(d.avgDwvs)}>{d.avgDwvs.toFixed(3)}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // ── Tab: Driver Rankings ──────────────────────────────────
  const renderDriverRankings = () => (
    <>
      <div style={s.filterBar}>
        <select style={s.select} value={fleetFilter} onChange={e => setFleetFilter(e.target.value)}>
          <option value="all">All Fleets</option>
          <option value="tanker">Tanker</option>
          <option value="bus">Bus</option>
          <option value="taxi">Taxi</option>
        </select>
        <select style={s.select} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="avgDwvs">Sort by DWVS</option>
          <option value="totalSessions">Sort by Sessions</option>
          <option value="totalKm">Sort by Distance</option>
          <option value="avgWearIndex">Sort by Wear Index</option>
          <option value="totalHealthDelta">Sort by Health Impact</option>
        </select>
        <button style={{ ...s.select, cursor: 'pointer' }} onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}>
          {sortDir === 'asc' ? '↑ Ascending' : '↓ Descending'}
        </button>
        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748b' }}>
          {filteredDrivers.length} drivers shown
        </div>
      </div>
      <div style={{ ...s.card, overflow: 'auto' }}>
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Driver</th>
              <th style={s.th}>Fleet</th>
              <th style={s.th}>DWVS</th>
              <th style={s.th}>Trend</th>
              <th style={s.th}>Sessions</th>
              <th style={s.th}>Distance (km)</th>
              <th style={s.th}>Wear Index</th>
              <th style={s.th}>Health Impact</th>
              <th style={s.th}>RPM CV</th>
              <th style={s.th}>Harsh Rate</th>
              <th style={s.th}>Rating</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrivers.map((d, i) => (
              <tr key={d.driverId} style={{ background: i % 2 === 0 ? 'transparent' : '#0f172a22' }}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>
                  <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{d.driverName}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{d.vehiclesDriven} vehicles</div>
                </td>
                <td style={s.td}><span style={s.badge(d.fleetType === 'tanker' ? '#f59e0b' : d.fleetType === 'bus' ? '#06b6d4' : '#a855f7')}>{d.fleetType}</span></td>
                <td style={s.td}><span style={s.dwvsCell(d.avgDwvs)}>{d.avgDwvs.toFixed(3)}</span></td>
                <td style={s.td}>
                  <span style={s.variance(d.trend, '#10b981', '#ef4444')}>
                    {d.trend > 0 ? '↑' : '↓'} {Math.abs(d.trend).toFixed(3)}
                  </span>
                </td>
                <td style={s.td}>{fmtNum(d.totalSessions)}</td>
                <td style={s.td}>{fmtNum(d.totalKm)}</td>
                <td style={s.td}>
                  <div style={s.barBg}><div style={s.bar(d.avgWearIndex * 100, getDwvsColor(d.avgDwvs))} /></div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{(d.avgWearIndex * 100).toFixed(0)}%</div>
                </td>
                <td style={{ ...s.td, color: '#ef4444' }}>{d.totalHealthDelta.toFixed(2)}</td>
                <td style={s.td}>{d.rpmCv.toFixed(2)}</td>
                <td style={s.td}>{d.harshEventRate.toFixed(2)}</td>
                <td style={s.td}><span style={s.badge(getDwvsColor(d.avgDwvs))}>{d.rating}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  // ── Tab: Vehicle Attribution ──────────────────────────────
  const renderVehicleAttribution = () => (
    <>
      <div style={s.filterBar}>
        <select style={s.select} value={fleetFilter} onChange={e => setFleetFilter(e.target.value)}>
          <option value="all">All Fleets</option>
          <option value="tanker">Tanker</option>
          <option value="bus">Bus</option>
          <option value="taxi">Taxi</option>
        </select>
      </div>
      <div style={s.grid('repeat(auto-fill, minmax(380px, 1fr))')}>
        {filteredVehicles.map(v => (
          <div key={v.vehicleId} style={s.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px', color: '#f1f5f9' }}>{v.vehicleId}</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{v.fleetType} • {v.totalSessions} sessions • {v.uniqueDrivers} drivers</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ ...s.kpiLabel, marginBottom: '2px' }}>Health</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: v.healthScore > 80 ? '#10b981' : v.healthScore > 60 ? '#f59e0b' : '#ef4444' }}>{v.healthScore}%</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Avg DWVS</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: getDwvsColor(v.avgDwvs) }}>{v.avgDwvs.toFixed(3)}</div>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px' }}>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Driver Variance</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: v.driverVariance > 0.4 ? '#ef4444' : '#06b6d4' }}>{v.driverVariance.toFixed(3)}</div>
              </div>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: '#10b981' }}>Best: {v.bestDriverName} ({v.bestDriverDwvs.toFixed(2)})</span>
                <span style={{ color: '#ef4444' }}>Worst: {v.worstDriverName} ({v.worstDriverDwvs.toFixed(2)})</span>
              </div>
              <div style={s.barBg}>
                <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(v.bestDriverDwvs / 1.0) * 100}%`, background: '#10b981' }} />
                  <div style={{ width: `${((v.avgDwvs - v.bestDriverDwvs) / 1.0) * 100}%`, background: '#06b6d4' }} />
                  <div style={{ width: `${((v.worstDriverDwvs - v.avgDwvs) / 1.0) * 100}%`, background: '#ef4444' }} />
                </div>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
              {fmtNum(v.totalKm)} km total • Health delta: {v.totalHealthDelta.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  // ── Tab: Live Sessions ────────────────────────────────────
  const renderLiveSessions = () => (
    <>
      <div style={{ ...s.card, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px', background: '#10b98115', border: '1px solid #10b98133' }}>
        <div style={s.liveIndicator} />
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#10b981' }}>
          {MOCK_LIVE_SESSIONS.length} Active Sessions — Real-Time Welford Computation on SVG 2.0 Edge
        </div>
      </div>
      <div style={s.grid('repeat(auto-fill, minmax(340px, 1fr))')}>
        {MOCK_LIVE_SESSIONS.map(sess => (
          <div key={sess.id} style={{ ...s.card, borderLeft: `4px solid ${getDwvsColor(sess.dwvs)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{sess.vehicleId}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Block #{sess.blockNumber}</div>
              </div>
              <span style={s.badge('#10b981')}>● ACTIVE</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              <div><div style={{ fontSize: '11px', color: '#64748b' }}>Driver</div><div style={{ fontWeight: 600 }}>{sess.driverName}</div></div>
              <div><div style={{ fontSize: '11px', color: '#64748b' }}>Auth</div><div>{sess.authMethod}</div></div>
              <div><div style={{ fontSize: '11px', color: '#64748b' }}>Duration</div><div>{sess.durationMinutes} min</div></div>
              <div><div style={{ fontSize: '11px', color: '#64748b' }}>Distance</div><div>{sess.distanceKm} km</div></div>
              <div><div style={{ fontSize: '11px', color: '#64748b' }}>Live DWVS</div><div style={{ color: getDwvsColor(sess.dwvs), fontWeight: 700 }}>{sess.dwvs.toFixed(3)}</div></div>
              <div><div style={{ fontSize: '11px', color: '#64748b' }}>Wear Index</div><div>{(sess.wearIndex * 100).toFixed(0)}%</div></div>
            </div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Started: {fmtDate(sess.startTime)} • TPM: {sess.tpmSigned ? '✅ Signed' : '⏳ Pending'}</div>
          </div>
        ))}
      </div>
    </>
  );

  // ── Tab: AI Insights ──────────────────────────────────────
  const renderInsights = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {MOCK_INSIGHTS.map(ins => (
        <div key={ins.id} style={s.insight(getInsightColor(ins.priority))}>
          <div style={{ fontSize: '28px' }}>{getInsightIcon(ins.type)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '15px', color: '#f1f5f9' }}>{ins.title}</div>
              <span style={s.badge(getInsightColor(ins.priority))}>{ins.priority}</span>
            </div>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '8px' }}>{ins.description}</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: getInsightColor(ins.priority) }}>Impact: {ins.impact}</div>
          </div>
        </div>
      ))}
    </div>
  );

  // ── Tab: DIAM Formula ─────────────────────────────────────
  const renderFormula = () => (
    <>
      <div style={s.formulaBox}>
        <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#06b6d4' }}>DIAM — Driver Impact Attribution Model (Patent-Pending)</div>
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: '#94a3b8', marginBottom: '8px' }}>DWVS (Driver Wear Variance Score) Formula:</div>
          <div style={{ fontSize: '16px', color: '#f59e0b', fontWeight: 600 }}>DWVS = Σ(wᵢ × CVᵢ²)</div>
          <div style={{ color: '#64748b', marginTop: '4px' }}>where CV = σ / μ (Coefficient of Variation)</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          {[
            { metric: 'RPM Variance', weight: '25%', reason: 'Engine/transmission fatigue', color: '#ef4444' },
            { metric: 'Harsh Event Rate', weight: '20%', reason: 'Brake/suspension/tire wear', color: '#f59e0b' },
            { metric: 'Speed Variance', weight: '15%', reason: 'Drivetrain stress cycles', color: '#06b6d4' },
            { metric: 'Fuel Rate Variance', weight: '15%', reason: 'Injection/turbo cycling', color: '#a855f7' },
            { metric: 'DTC Generation', weight: '15%', reason: 'Rough operation indicator', color: '#10b981' },
            { metric: 'Idle Variance', weight: '10%', reason: 'Thermal cycling / DPF', color: '#64748b' },
          ].map(w => (
            <div key={w.metric} style={{ background: '#1e293b', borderRadius: '8px', padding: '12px', borderLeft: `3px solid ${w.color}` }}>
              <div style={{ fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>{w.metric}</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: w.color }}>{w.weight}</div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>{w.reason}</div>
            </div>
          ))}
        </div>
        <div>
          <div style={{ color: '#94a3b8', marginBottom: '8px' }}>Rating Scale:</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            {[
              { label: '< 0.3 = Excellent', color: '#10b981' },
              { label: '0.3–0.5 = Good', color: '#06b6d4' },
              { label: '0.5–0.7 = Fair', color: '#f59e0b' },
              { label: '> 0.7 = Poor', color: '#ef4444' },
            ].map(r => (
              <div key={r.label} style={{ padding: '8px 16px', borderRadius: '8px', background: `${r.color}15`, color: r.color, fontWeight: 600, fontSize: '12px' }}>{r.label}</div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ ...s.card, marginTop: '16px' }}>
        <div style={{ fontWeight: 700, marginBottom: '12px', color: '#06b6d4' }}>Welford's Online Algorithm (On SVG 2.0 Edge)</div>
        <pre style={{ color: '#94a3b8', fontSize: '13px', lineHeight: 1.8 }}>{`count += 1
delta = value - mean
mean += delta / count
delta2 = value - mean
M2 += delta * delta2
variance = M2 / count   // at block close

Memory: 3 numbers × 6 metrics = 18 floats ≈ 72 bytes per session
Computed on NXP i.MX 95 NPU — sub-10ms inference
TPM 2.0 signed at block close → immutable proof`}</pre>
      </div>
    </>
  );

  // ── Tab: Insurance Data ───────────────────────────────────
  const renderInsuranceData = () => (
    <>
      <div style={s.grid('repeat(auto-fit, minmax(250px, 1fr))')}>
        <div style={s.kpiCard('#10b981')}>
          <div style={s.kpiLabel}>TPM-Signed Blocks</div>
          <div style={s.kpiValue}>{fmtPct(tpmSignedPct)}</div>
          <div style={s.kpiSub}>Cryptographic proof of driving data</div>
        </div>
        <div style={s.kpiCard('#06b6d4')}>
          <div style={s.kpiLabel}>Fleet DWVS {'<'} 0.5</div>
          <div style={s.kpiValue}>72%</div>
          <div style={s.kpiSub}>Qualifies for premium discount</div>
        </div>
        <div style={s.kpiCard('#f59e0b')}>
          <div style={s.kpiLabel}>Projected Premium Reduction</div>
          <div style={s.kpiValue}>8–12%</div>
          <div style={s.kpiSub}>Based on immutable session data</div>
        </div>
        <div style={s.kpiCard('#a855f7')}>
          <div style={s.kpiLabel}>Annual Insurance Savings</div>
          <div style={s.kpiValue}>AED 185K</div>
          <div style={s.kpiSub}>Across 650+ vehicles</div>
        </div>
      </div>
      <div style={s.card}>
        <div style={{ fontWeight: 700, marginBottom: '16px' }}>Insurance-Grade Data Export Format</div>
        <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.8 }}>
          Each session block exported to insurance partners includes:
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
          {[
            'Block Number (monotonic)', 'Vehicle ID + Fleet Type', 'Driver ID + Auth Method',
            'Start/End Time (UTC)', 'Distance (km) + Duration', 'DWVS Score + Rating',
            'Welford Variance Metrics (6)', 'Harsh Event Counts (3)', 'DTC Count',
            'TPM 2.0 Signature', 'Block Hash (SHA-256)', 'SVG Device Certificate'
          ].map((field, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
              <span style={{ color: '#06b6d4' }}>✓</span> {field}
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // ── Tab: Trends ───────────────────────────────────────────
  const renderTrends = () => {
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const fleetTrend = [0.48, 0.46, 0.44, 0.42, 0.41, fleetAvgDwvs];
    return (
      <>
        <div style={s.card}>
          <div style={{ fontWeight: 700, marginBottom: '16px' }}>Fleet DWVS Trend — 6 Month</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', padding: '0 16px' }}>
            {months.map((m, i) => (
              <div key={m} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ fontSize: '11px', color: getDwvsColor(fleetTrend[i]), fontWeight: 600 }}>{fleetTrend[i].toFixed(2)}</div>
                <div style={{ width: '100%', maxWidth: '48px', height: `${fleetTrend[i] * 300}px`, background: getDwvsColor(fleetTrend[i]), borderRadius: '4px 4px 0 0' }} />
                <div style={{ fontSize: '11px', color: '#64748b' }}>{m}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#10b981', fontWeight: 600 }}>
            ↓ Improving: -{((0.48 - fleetAvgDwvs) * 100).toFixed(1)}% over 6 months
          </div>
        </div>
        <div style={s.grid('1fr 1fr')}>
          <div style={s.card}>
            <div style={{ fontWeight: 700, marginBottom: '12px' }}>Most Improved Drivers</div>
            {MOCK_DRIVERS.filter(d => d.trend < 0).sort((a, b) => a.trend - b.trend).slice(0, 5).map(d => (
              <div key={d.driverId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                <span>{d.driverName}</span>
                <span style={s.variance(d.trend, '#10b981', '#ef4444')}>{d.trend > 0 ? '+' : ''}{d.trend.toFixed(3)}</span>
              </div>
            ))}
          </div>
          <div style={s.card}>
            <div style={{ fontWeight: 700, marginBottom: '12px' }}>Declining Performance</div>
            {MOCK_DRIVERS.filter(d => d.trend > 0).sort((a, b) => b.trend - a.trend).slice(0, 5).map(d => (
              <div key={d.driverId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                <span>{d.driverName}</span>
                <span style={s.variance(d.trend, '#10b981', '#ef4444')}>+{d.trend.toFixed(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // ── Tab Dispatch ──────────────────────────────────────────
  const tabContent = [renderOverview, renderDriverRankings, renderVehicleAttribution, renderLiveSessions, renderInsights, renderFormula, renderInsuranceData, renderTrends];

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.title as any}>
          <span>📊</span>
          Fleet DWVS Intelligence
          <span style={s.badge('#06b6d4')}>PATENT-PENDING</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={s.badge('#10b981')}>{activeSessions} Live Sessions</span>
          <span style={s.badge('#64748b')}>{MOCK_DRIVERS.length} Drivers • {MOCK_VEHICLES.length} Vehicles</span>
        </div>
      </div>

      <div style={s.tabs}>
        {TABS.map((t, i) => (
          <button key={t} style={s.tab(tab === i)} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      {tabContent[tab]()}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}
