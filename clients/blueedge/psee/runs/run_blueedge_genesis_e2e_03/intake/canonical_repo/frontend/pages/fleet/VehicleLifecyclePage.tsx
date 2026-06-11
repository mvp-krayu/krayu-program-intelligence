import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import TrendCard from '@/components/charts/TrendCard';
import ChartCard from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import TabBar from '@/components/ui/TabBar';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import Modal from '@/components/ui/Modal';
import { useSocketContext } from '@/socket';
import { useToast } from '@/hooks';
import { fmtDate, fmtCur, fmtNum, fmtPct, fmtKm } from '@/utils';

/* ═══════════════════════════════════════════════════════════════
   Vehicle 360° Lifecycle Intelligence
   Driver-Vehicle Attribution · Session Blocks · Variance TCO
   Blue Edge Fleet Management Platform — Patent-Pending Module
   ═══════════════════════════════════════════════════════════════ */

/* ─────────────── Types ─────────────── */
interface DriverSessionBlock {
  id: string; blockNumber: number; driverId: string; driverName: string;
  vehicleId: string; authMethod: 'faceid_nfc'|'pin_rfid'|'biometric'|'manual';
  startTime: Date; endTime: Date; durationMinutes: number;
  odometerStart: number; odometerEnd: number; distanceKm: number;
  fuelStart: number; fuelEnd: number; fuelConsumedL: number; fuelCostAED: number;
  fuelEvents: { time: Date; gps: string; station: string; liters: number; costAED: number }[];
  dtcsGenerated: string[]; harshBrakes: number; harshAccel: number; harshCorner: number;
  maxSpeedKmh: number; avgSpeedKmh: number; idleMinutes: number; idlePct: number;
  routeHighwayPct: number; routeUrbanPct: number; elevationGainM: number;
  loadWeightKg: number; ambientTempC: number;
  // Welford streaming variance per metric (computed at block close)
  rpmMean: number; rpmVariance: number; speedVariance: number;
  fuelRateVariance: number; accelVariance: number;
  // Computed scores
  lPer100km: number; wearIndex: number; healthDelta: number;
  tpmSigned: boolean; blockHash: string;
}
interface DriverProfile {
  id: string; name: string; photo: string; licenseClass: string;
  totalBlocks: number; totalKm: number; totalHours: number;
  totalFuelL: number; totalFuelCostAED: number;
  avgLPer100km: number; avgRpmVariance: number; avgSpeedVariance: number;
  avgFuelRateVariance: number; harshRate: number; dtcRate: number;
  dwvs: number; // Driver Wear Variance Score
  fuelEfficiencyDelta: number; // vs vehicle baseline
  costPerKm: number; estimatedDepreciationImpactAED: number;
  behaviorScore: number; consistencyRating: 'excellent'|'good'|'fair'|'poor';
}
interface ServiceRecord {
  id: string; date: Date; type: 'scheduled'|'predictive'|'unscheduled'|'regulatory'|'recall';
  category: string; description: string; depot: string; technician: string;
  durationHours: number; costPartsAED: number; costLaborAED: number; costTotalAED: number;
  odometerAtService: number; dtcsTrigger: string[]; partsReplaced: { name: string; partNo: string; qty: number; costAED: number; warrantyStatus: string }[];
  onTime: boolean; delayDays: number; firstTimeFix: boolean; qualityScore: number;
}
interface FuelEvent {
  id: string; date: Date; driverId: string; driverName: string;
  gps: { lat: number; lng: number }; station: string; litersAdded: number;
  costAED: number; odometerAtFill: number; fuelLevelBefore: number; fuelLevelAfter: number;
  anomaly: boolean; anomalyType?: string;
}
interface VehicleLifecycle {
  id: string; vin: string; plate: string; make: string; model: string; year: number;
  fleetType: 'tanker'|'bus'|'taxi'|'cargo'|'ev'; assignedFleet: string; homeDepot: string;
  acquisitionDate: Date; acquisitionCostAED: number; currentOdometer: number;
  fuelLevel: number; tankCapacityL: number; estimatedRangeKm: number;
  engineStatus: 'running'|'idle'|'off'; currentRPM: number; engineHours: number;
  healthScore: number; activeDTCs: { code: string; severity: 'critical'|'warning'|'info'; desc: string }[];
  svgDeviceId: string; firmwareVersion: string; tpmStatus: boolean; edgeAIModels: number;
  residualValueAED: number; resaleProjectionAED: number; monthlyDepreciation: number;
  tco3Year: number; tco5Year: number; costPerKmLifetime: number;
  fleetRank: number; fleetSize: number; sameModelRank: number; sameModelCount: number;
  uptime: number; // percentage
  lastServiceDate: Date; nextServiceDate: Date; nextServiceType: string; nextServiceOdometer: number;
  maintenanceTotalAED: number; maintenanceScheduledAED: number; maintenanceUnscheduledAED: number;
  fuelTotalAED: number; insuranceAnnualAED: number; tiresAnnualAED: number;
  registrationAED: number; salikTollsAED: number; downtimeHours: number;
}

/* ─────────────── Constants ─────────────── */
const TABS = [
  { id: 'dashboard', label: '🎯 Dashboard' }, { id: 'fuel', label: '⛽ Fuel Intelligence' },
  { id: 'service', label: '🔧 Service Lifecycle' }, { id: 'tco', label: '💰 Financial / TCO' },
  { id: 'drivers', label: '👤 Driver Attribution' }, { id: 'fleet', label: '🏆 Fleet Comparison' },
  { id: 'ai', label: '🤖 AI Recommendations' }, { id: 'history', label: '📋 History' },
];
const spark = (base: number) => Array.from({ length: 12 }, () => base * (0.85 + Math.random() * 0.3));
const DRIVERS: DriverProfile[] = [
  { id: 'DRV-047', name: 'Mohammed Al-Rashid', photo: '👤', licenseClass: 'Heavy Vehicle + HAZMAT', totalBlocks: 847, totalKm: 142800, totalHours: 3240, totalFuelL: 57120, totalFuelCostAED: 162792, avgLPer100km: 40.0, avgRpmVariance: 18200, avgSpeedVariance: 210, avgFuelRateVariance: 1.2, harshRate: 1.8, dtcRate: 0.3, dwvs: 0.28, fuelEfficiencyDelta: -4.2, costPerKm: 1.14, estimatedDepreciationImpactAED: -6200, behaviorScore: 92, consistencyRating: 'excellent' },
  { id: 'DRV-023', name: 'Khalid Ibrahim', photo: '👤', licenseClass: 'Heavy Vehicle', totalBlocks: 612, totalKm: 98400, totalHours: 2180, totalFuelL: 43296, totalFuelCostAED: 123394, avgLPer100km: 44.0, avgRpmVariance: 42800, avgSpeedVariance: 580, avgFuelRateVariance: 3.8, harshRate: 5.2, dtcRate: 1.1, dwvs: 0.67, fuelEfficiencyDelta: +5.6, costPerKm: 1.25, estimatedDepreciationImpactAED: 14800, behaviorScore: 71, consistencyRating: 'fair' },
  { id: 'DRV-091', name: 'Ahmed Hassan', photo: '👤', licenseClass: 'Heavy Vehicle + HAZMAT', totalBlocks: 423, totalKm: 68200, totalHours: 1520, totalFuelL: 27962, totalFuelCostAED: 79692, avgLPer100km: 41.0, avgRpmVariance: 24500, avgSpeedVariance: 340, avgFuelRateVariance: 1.9, harshRate: 2.8, dtcRate: 0.5, dwvs: 0.38, fuelEfficiencyDelta: -1.8, costPerKm: 1.17, estimatedDepreciationImpactAED: -2100, behaviorScore: 86, consistencyRating: 'good' },
  { id: 'DRV-156', name: 'Omar Al-Farsi', photo: '👤', licenseClass: 'Heavy Vehicle', totalBlocks: 218, totalKm: 34600, totalHours: 780, totalFuelL: 15570, totalFuelCostAED: 44375, avgLPer100km: 45.0, avgRpmVariance: 58200, avgSpeedVariance: 820, avgFuelRateVariance: 5.1, harshRate: 7.4, dtcRate: 2.3, dwvs: 0.84, fuelEfficiencyDelta: +8.2, costPerKm: 1.28, estimatedDepreciationImpactAED: 22400, behaviorScore: 58, consistencyRating: 'poor' },
];
const VEHICLE: VehicleLifecycle = {
  id: 'VEH-DXB-0184', vin: '1HTMMAAL45H684231', plate: 'DXB-T-5841', make: 'Volvo', model: 'FH 460 6×4', year: 2023,
  fleetType: 'tanker', assignedFleet: 'ENOC Fuel Distribution', homeDepot: 'Jebel Ali Depot',
  acquisitionDate: new Date('2023-03-15'), acquisitionCostAED: 485000, currentOdometer: 344000,
  fuelLevel: 62, tankCapacityL: 400, estimatedRangeKm: 580, engineStatus: 'running', currentRPM: 1420,
  engineHours: 7720, healthScore: 84, activeDTCs: [
    { code: 'P0217', severity: 'warning', desc: 'Engine Coolant Over Temperature' },
    { code: 'P2002', severity: 'info', desc: 'DPF Efficiency Below Threshold' },
  ],
  svgDeviceId: 'SVG-A1B2AE-001', firmwareVersion: 'v2.8.3', tpmStatus: true, edgeAIModels: 6,
  residualValueAED: 295000, resaleProjectionAED: 312000, monthlyDepreciation: 5280,
  tco3Year: 842000, tco5Year: 1185000, costPerKmLifetime: 2.45,
  fleetRank: 12, fleetSize: 150, sameModelRank: 3, sameModelCount: 18,
  uptime: 94.2, lastServiceDate: new Date('2026-01-28'), nextServiceDate: new Date('2026-03-15'),
  nextServiceType: 'Scheduled - Oil Change + Filter', nextServiceOdometer: 350000,
  maintenanceTotalAED: 68400, maintenanceScheduledAED: 42200, maintenanceUnscheduledAED: 26200,
  fuelTotalAED: 410253, insuranceAnnualAED: 12800, tiresAnnualAED: 8400,
  registrationAED: 3200, salikTollsAED: 14600, downtimeHours: 248,
};
const SERVICES: ServiceRecord[] = [
  { id: 'WO-8842', date: new Date('2026-01-28'), type: 'scheduled', category: 'Oil & Filters', description: 'Full oil change with filter replacement', depot: 'Jebel Ali Depot', technician: 'Ravi Shankar', durationHours: 3.5, costPartsAED: 1280, costLaborAED: 420, costTotalAED: 1700, odometerAtService: 338400, dtcsTrigger: [], partsReplaced: [{ name: 'Engine Oil Filter', partNo: 'VO-21707134', qty: 1, costAED: 185, warrantyStatus: 'In warranty' }, { name: 'Fuel Filter', partNo: 'VO-21764964', qty: 1, costAED: 220, warrantyStatus: 'In warranty' }, { name: 'Engine Oil 15W-40 (24L)', partNo: 'SHELL-RIMULA', qty: 1, costAED: 875, warrantyStatus: 'N/A' }], onTime: true, delayDays: 0, firstTimeFix: true, qualityScore: 98 },
  { id: 'WO-8756', date: new Date('2025-11-12'), type: 'predictive', category: 'Brake System', description: 'AI-predicted brake pad replacement (pred. 87% wear)', depot: 'Jebel Ali Depot', technician: 'Suresh Kumar', durationHours: 4.2, costPartsAED: 3200, costLaborAED: 680, costTotalAED: 3880, odometerAtService: 321000, dtcsTrigger: [], partsReplaced: [{ name: 'Front Brake Pads Set', partNo: 'VO-BRK-FP-460', qty: 1, costAED: 1800, warrantyStatus: 'Out of warranty' }, { name: 'Brake Disc Rotor Front', partNo: 'VO-BRK-DR-460', qty: 2, costAED: 700, warrantyStatus: 'Out of warranty' }], onTime: true, delayDays: 0, firstTimeFix: true, qualityScore: 95 },
  { id: 'WO-8621', date: new Date('2025-09-05'), type: 'unscheduled', category: 'Cooling System', description: 'Coolant leak repair — DTC P0217 triggered service', depot: 'Dubai Industrial', technician: 'Ali Mahmoud', durationHours: 6.8, costPartsAED: 2100, costLaborAED: 1020, costTotalAED: 3120, odometerAtService: 298500, dtcsTrigger: ['P0217', 'P0128'], partsReplaced: [{ name: 'Thermostat Assembly', partNo: 'VO-COOL-TH-460', qty: 1, costAED: 890, warrantyStatus: 'Out of warranty' }, { name: 'Coolant Hose Upper', partNo: 'VO-COOL-HU-460', qty: 1, costAED: 340, warrantyStatus: 'Out of warranty' }, { name: 'Coolant 50/50 (12L)', partNo: 'VOLVO-COOLANT', qty: 1, costAED: 870, warrantyStatus: 'N/A' }], onTime: false, delayDays: 3, firstTimeFix: false, qualityScore: 72 },
  { id: 'WO-8490', date: new Date('2025-06-22'), type: 'scheduled', category: 'Tires', description: 'Full tire rotation + alignment check', depot: 'Jebel Ali Depot', technician: 'Ravi Shankar', durationHours: 2.5, costPartsAED: 0, costLaborAED: 350, costTotalAED: 350, odometerAtService: 274200, dtcsTrigger: [], partsReplaced: [], onTime: true, delayDays: 0, firstTimeFix: true, qualityScore: 100 },
  { id: 'WO-8312', date: new Date('2025-04-10'), type: 'regulatory', category: 'RTA Inspection', description: 'Annual RTA roadworthiness inspection', depot: 'RTA Inspection Center', technician: 'RTA Inspector', durationHours: 1.5, costPartsAED: 0, costLaborAED: 500, costTotalAED: 500, odometerAtService: 252000, dtcsTrigger: [], partsReplaced: [], onTime: true, delayDays: 0, firstTimeFix: true, qualityScore: 100 },
  { id: 'WO-8105', date: new Date('2025-01-18'), type: 'unscheduled', category: 'Engine', description: 'DPF regeneration failure — forced regen + sensor replacement', depot: 'Dubai Industrial', technician: 'Ali Mahmoud', durationHours: 5.5, costPartsAED: 4800, costLaborAED: 880, costTotalAED: 5680, odometerAtService: 224800, dtcsTrigger: ['P2002', 'P2463'], partsReplaced: [{ name: 'DPF Differential Pressure Sensor', partNo: 'VO-EXH-DPS-460', qty: 1, costAED: 1200, warrantyStatus: 'Out of warranty' }, { name: 'DPF Temperature Sensor', partNo: 'VO-EXH-TS-460', qty: 2, costAED: 1800, warrantyStatus: 'Out of warranty' }], onTime: false, delayDays: 5, firstTimeFix: true, qualityScore: 82 },
];
const FUEL_EVENTS: FuelEvent[] = Array.from({ length: 18 }, (_, i) => ({
  id: `FUEL-${8000 + i}`, date: new Date(Date.now() - i * 2.5 * 86400000),
  driverId: DRIVERS[i % 4].id, driverName: DRIVERS[i % 4].name,
  gps: { lat: 25.0136 + Math.random() * 0.1, lng: 55.0861 + Math.random() * 0.1 },
  station: ['ENOC Jebel Ali','ADNOC Industrial City','ENOC Al Quoz','ADNOC Port Rashid','ENOC DIP'][i % 5],
  litersAdded: 180 + Math.floor(Math.random() * 180), costAED: 0,
  odometerAtFill: 344000 - i * 820, fuelLevelBefore: 8 + Math.floor(Math.random() * 15),
  fuelLevelAfter: 85 + Math.floor(Math.random() * 15), anomaly: i === 7, anomalyType: i === 7 ? 'Unusual fuel drop at non-station GPS' : undefined,
})).map(f => ({ ...f, costAED: Math.round(f.litersAdded * 2.85 * 100) / 100 }));
const SESSION_BLOCKS: DriverSessionBlock[] = Array.from({ length: 20 }, (_, i) => {
  const d = DRIVERS[i % 4]; const dist = 280 + Math.floor(Math.random() * 200);
  const fuelL = dist * (d.avgLPer100km / 100) * (0.9 + Math.random() * 0.2);
  const dur = 420 + Math.floor(Math.random() * 180);
  return {
    id: `BLK-${String(4280 + i).padStart(6, '0')}`, blockNumber: 4280 + i,
    driverId: d.id, driverName: d.name, vehicleId: 'VEH-DXB-0184',
    authMethod: (['faceid_nfc', 'biometric', 'pin_rfid', 'faceid_nfc'] as const)[i % 4],
    startTime: new Date(Date.now() - i * 14 * 3600000), endTime: new Date(Date.now() - i * 14 * 3600000 + dur * 60000),
    durationMinutes: dur, odometerStart: 344000 - (i + 1) * dist, odometerEnd: 344000 - i * dist,
    distanceKm: dist, fuelStart: 20 + Math.random() * 60, fuelEnd: 0, fuelConsumedL: Math.round(fuelL * 10) / 10,
    fuelCostAED: Math.round(fuelL * 2.85 * 100) / 100, fuelEvents: [],
    dtcsGenerated: i === 5 ? ['P0217'] : i === 12 ? ['P2002'] : [],
    harshBrakes: Math.floor(d.harshRate * dist / 1000 * (0.5 + Math.random())),
    harshAccel: Math.floor(d.harshRate * 0.6 * dist / 1000 * (0.5 + Math.random())),
    harshCorner: Math.floor(d.harshRate * 0.3 * dist / 1000 * (0.5 + Math.random())),
    maxSpeedKmh: 85 + Math.floor(Math.random() * 35), avgSpeedKmh: 52 + Math.floor(Math.random() * 20),
    idleMinutes: Math.floor(dur * (0.05 + Math.random() * 0.1)), idlePct: 0,
    routeHighwayPct: 55 + Math.floor(Math.random() * 30), routeUrbanPct: 0,
    elevationGainM: 80 + Math.floor(Math.random() * 300), loadWeightKg: 12000 + Math.floor(Math.random() * 14000),
    ambientTempC: 28 + Math.floor(Math.random() * 18),
    rpmMean: 1350 + Math.floor(Math.random() * 300), rpmVariance: d.avgRpmVariance * (0.7 + Math.random() * 0.6),
    speedVariance: d.avgSpeedVariance * (0.7 + Math.random() * 0.6),
    fuelRateVariance: d.avgFuelRateVariance * (0.7 + Math.random() * 0.6),
    accelVariance: 0.02 + Math.random() * 0.08,
    lPer100km: Math.round(fuelL / dist * 10000) / 100,
    wearIndex: d.dwvs * (0.8 + Math.random() * 0.4), healthDelta: -(0.01 + Math.random() * 0.04),
    tpmSigned: true, blockHash: `0x${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
  };
}).map(b => ({ ...b, idlePct: Math.round(b.idleMinutes / b.durationMinutes * 1000) / 10, routeUrbanPct: 100 - b.routeHighwayPct }));

const AI_RECOMMENDATIONS = [
  { id: 1, priority: 'critical', category: 'Driver', icon: '👤', title: 'Reassign Driver Omar Al-Farsi from VEH-DXB-0184', desc: 'DWVS of 0.84 is causing 22,400 AED/year in accelerated depreciation. His RPM variance (58,200) is 3.2× fleet average. Reassigning to newer TRK-0312 would reduce annual wear cost by 68%.', impact: 22400, confidence: 94 },
  { id: 2, priority: 'high', category: 'Maintenance', icon: '🔧', title: 'Schedule DPF deep clean within 30 days', desc: 'Predictive model shows 67% probability of DPF failure within 45 days based on P2002 recurrence pattern and soot accumulation rate. Proactive service costs 2,800 AED vs. 8,500 AED emergency.', impact: 5700, confidence: 87 },
  { id: 3, priority: 'high', category: 'Financial', icon: '💰', title: 'Optimal resale window: Q3 2026', desc: 'Market analysis shows Volvo FH 460 resale values peak in Q3 due to seasonal demand from logistics expansion. Current trajectory suggests 312,000 AED in Q3 vs. 285,000 AED in Q4. Sell within 5 months for maximum return.', impact: 27000, confidence: 78 },
  { id: 4, priority: 'medium', category: 'Fuel', icon: '⛽', title: 'Investigate fuel anomaly on Feb 8 — potential theft', desc: 'Block BLK-004287 shows 42L fuel drop at non-station GPS coordinates (25.0421, 55.1142) during Driver Khalid session. No engine running. Confidence: 82%. Review dashcam footage.', impact: 120, confidence: 82 },
  { id: 5, priority: 'medium', category: 'Operational', icon: '🛣️', title: 'Reroute via Sheikh Zayed Road for 8% fuel savings', desc: 'Analysis of 847 session blocks shows Route A (via Al Khail Road) consumes 8.3% more fuel due to elevation changes and traffic patterns. Switching primary route saves estimated 4,200 AED/year.', impact: 4200, confidence: 91 },
  { id: 6, priority: 'low', category: 'Driver', icon: '🏅', title: 'Award Mohammed Al-Rashid — top performer on this vehicle', desc: 'DWVS of 0.28 (excellent). His sessions show 4.2% better fuel efficiency than baseline. Estimated value preservation: 6,200 AED/year. Recommend bonus + assignment to highest-value tankers.', impact: 6200, confidence: 96 },
  { id: 7, priority: 'medium', category: 'Insurance', icon: '🛡️', title: 'Negotiate premium reduction with measured driver data', desc: 'Fleet DWVS is in bottom 15th percentile (lower = better). TPM-signed session blocks provide auditable proof. Estimated premium reduction: 8-12% (1,024–1,536 AED/year for this vehicle).', impact: 1280, confidence: 73 },
];

/* ─────────────── Helpers ─────────────── */
const varBar = (val: number, max: number, color: string) => (
  <div style={{ width: '100%', background: 'var(--bg-primary)', borderRadius: 4, height: 8 }}>
    <div style={{ width: `${Math.min(val / max * 100, 100)}%`, background: color, borderRadius: 4, height: 8, transition: 'width 0.6s ease' }} />
  </div>
);
const sevColor = (s: string) => ({ critical: '#ef4444', high: '#f59e0b', warning: '#f59e0b', medium: '#3b82f6', low: '#10b981', info: '#6b7280' }[s] || '#6b7280');
const dwvsColor = (d: number) => d < 0.3 ? '#10b981' : d < 0.5 ? '#22d3ee' : d < 0.7 ? '#f59e0b' : '#ef4444';
const dwvsLabel = (d: number) => d < 0.3 ? 'Excellent' : d < 0.5 ? 'Good' : d < 0.7 ? 'Fair' : 'Poor';
const miniSpark = (data: number[], color: string) => {
  const max = Math.max(...data); const min = Math.min(...data); const range = max - min || 1;
  const pts = data.map((v, i) => `${i * 100 / (data.length - 1)},${100 - (v - min) / range * 80}`).join(' ');
  return <svg viewBox="0 0 100 100" width={80} height={28} style={{ display: 'inline-block' }}><polyline points={pts} fill="none" stroke={color} strokeWidth={2.5} /></svg>;
};

/* ─────────────── Component ─────────────── */
export default function VehicleLifecyclePage() {
  const [tab, setTab] = useState('dashboard');
  const [modal, setModal] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<DriverSessionBlock | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceRecord | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null);
  const { socket } = useSocketContext();
  const toast = useToast();

  const v = VEHICLE;
  const totalDriverKm = DRIVERS.reduce((s, d) => s + d.totalKm, 0);
  const weightedDWVS = DRIVERS.reduce((s, d) => s + d.dwvs * (d.totalKm / totalDriverKm), 0);

  /* ─────────────── Dashboard Tab ─────────────── */
  const renderDashboard = () => (
    <div>
      {/* Vehicle Identity Header */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid var(--border)', display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontSize: 48 }}>🛢️</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}>{v.make} {v.model} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 14 }}>({v.year})</span></div>
          <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>{v.plate} · VIN: {v.vin}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>Fleet: {v.assignedFleet} · Depot: {v.homeDepot}</div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'Health', value: v.healthScore, unit: '/100', color: v.healthScore > 80 ? '#10b981' : '#f59e0b' },
            { label: 'Fuel', value: v.fuelLevel, unit: '%', color: v.fuelLevel > 30 ? '#22d3ee' : '#ef4444' },
            { label: 'Odometer', value: fmtNum(v.currentOdometer), unit: ' km', color: 'var(--text-primary)' },
            { label: 'RPM', value: fmtNum(v.currentRPM), unit: '', color: v.currentRPM > 2000 ? '#ef4444' : '#10b981' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center', minWidth: 70 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: m.color }}>{m.value}<span style={{ fontSize: 11 }}>{m.unit}</span></div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{m.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>{v.engineStatus.toUpperCase()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, marginBottom: 16 }}>
        <TrendCard title="Health Score" value={v.healthScore} unit="/100" trend={-2.1} sparkline={spark(v.healthScore)} color="#10b981" />
        <TrendCard title="Uptime" value={v.uptime} unit="%" trend={1.4} sparkline={spark(v.uptime)} color="#22d3ee" />
        <TrendCard title="Residual Value" value={fmtCur(v.residualValueAED)} trend={-1.8} sparkline={spark(v.residualValueAED)} color="#8b5cf6" />
        <TrendCard title="Cost/km" value={`${v.costPerKmLifetime}`} unit=" AED" trend={0.8} sparkline={spark(v.costPerKmLifetime)} color="#f59e0b" />
        <TrendCard title="Driver DWVS" value={weightedDWVS.toFixed(2)} trend={-5.2} sparkline={spark(weightedDWVS)} color={dwvsColor(weightedDWVS)} />
        <TrendCard title="Active DTCs" value={v.activeDTCs.length} trend={0} sparkline={spark(v.activeDTCs.length)} color={v.activeDTCs.length > 2 ? '#ef4444' : '#f59e0b'} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 16 }}>
        <ChartCard title="Cost Breakdown Over Time (AED)" type="line" data={{ labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], datasets: [
          { label: 'Fuel', data: spark(34000), borderColor: '#f59e0b', fill: false },
          { label: 'Maintenance', data: [2800,1200,0,5680,0,350,0,3120,0,3880,0,1700], borderColor: '#ef4444', fill: false },
          { label: 'Depreciation', data: Array(12).fill(5280), borderColor: '#8b5cf6', fill: false },
        ]}} />
        <ChartCard title="Driver km Contribution" type="doughnut" data={{ labels: DRIVERS.map(d => d.name.split(' ')[0]), datasets: [{ data: DRIVERS.map(d => d.totalKm), backgroundColor: ['#10b981','#f59e0b','#22d3ee','#ef4444'] }] }} />
      </div>

      {/* Gauges */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <GaugeChart title="Fleet Rank" value={Math.round((1 - v.fleetRank / v.fleetSize) * 100)} unit="%" color="#10b981" />
        <GaugeChart title="Maintenance Quality" value={Math.round(SERVICES.reduce((s, sv) => s + sv.qualityScore, 0) / SERVICES.length)} unit="%" color="#22d3ee" />
        <GaugeChart title="Fuel Efficiency" value={78} unit="%" color="#f59e0b" />
        <GaugeChart title="Weighted DWVS" value={Math.round((1 - weightedDWVS) * 100)} unit="%" color={dwvsColor(weightedDWVS)} />
      </div>

      {/* Active DTCs + Next Service */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>⚠️ Active DTCs ({v.activeDTCs.length})</div>
          {v.activeDTCs.map(dtc => (
            <div key={dtc.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: sevColor(dtc.severity) }}>{dtc.code}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', flex: 1, marginLeft: 12 }}>{dtc.desc}</span>
              <Badge text={dtc.severity} variant={dtc.severity === 'critical' ? 'danger' : dtc.severity === 'warning' ? 'warning' : 'info'} />
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, marginBottom: 10 }}>🔧 Next Service</div>
          {[['Type', v.nextServiceType], ['Due Date', fmtDate(v.nextServiceDate)], ['At Odometer', fmtKm(v.nextServiceOdometer)], ['Remaining', `${fmtKm(v.nextServiceOdometer - v.currentOdometer)} / ${Math.ceil((v.nextServiceDate.getTime() - Date.now()) / 86400000)} days`], ['Last Service', fmtDate(v.lastServiceDate)]].map(([l, val]) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: 'var(--text-muted)' }}>{l}</span><span style={{ fontWeight: 600 }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─────────────── Fuel Intelligence Tab ─────────────── */
  const renderFuel = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        <TrendCard title="Avg L/100km" value={(v.fuelTotalAED / 2.85 / v.currentOdometer * 10000).toFixed(1)} unit=" L" trend={2.3} sparkline={spark(41.8)} color="#f59e0b" />
        <TrendCard title="Total Fuel Cost" value={fmtCur(v.fuelTotalAED)} trend={4.1} sparkline={spark(v.fuelTotalAED)} color="#ef4444" />
        <TrendCard title="Cost per km (Fuel)" value={(v.fuelTotalAED / v.currentOdometer).toFixed(2)} unit=" AED" trend={1.2} sparkline={spark(1.19)} color="#22d3ee" />
        <TrendCard title="Anomalies Detected" value={FUEL_EVENTS.filter(f => f.anomaly).length} trend={0} sparkline={spark(1)} color="#ef4444" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 16 }}>
        <ChartCard title="Fuel Consumption Trend (L/100km)" type="line" data={{ labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], datasets: [
          { label: 'Actual', data: [42.1,41.8,43.2,40.5,41.0,42.8,44.1,41.5,40.8,41.2,42.0,41.4], borderColor: '#f59e0b', fill: false },
          { label: 'Baseline', data: Array(12).fill(41.8), borderColor: '#6b7280', borderDash: [5, 5], fill: false },
        ]}} />
        <ChartCard title="Fuel Efficiency by Driver" type="bar" data={{ labels: DRIVERS.map(d => d.name.split(' ')[0]), datasets: [{ label: 'L/100km', data: DRIVERS.map(d => d.avgLPer100km), backgroundColor: DRIVERS.map(d => d.fuelEfficiencyDelta < 0 ? '#10b981' : '#ef4444') }] }} />
      </div>
      {/* Driver Fuel Leaderboard */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>⛽ Driver Fuel Efficiency — Same Vehicle Comparison</div>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase' }}>
            <th style={{ textAlign: 'left', padding: 8 }}>Rank</th><th style={{ textAlign: 'left', padding: 8 }}>Driver</th><th style={{ textAlign: 'right', padding: 8 }}>L/100km</th><th style={{ textAlign: 'right', padding: 8 }}>Δ Baseline</th><th style={{ textAlign: 'right', padding: 8 }}>Sessions</th><th style={{ textAlign: 'right', padding: 8 }}>Total km</th><th style={{ padding: 8 }}>Variance</th><th style={{ textAlign: 'right', padding: 8 }}>Cost/km</th>
          </tr></thead>
          <tbody>{DRIVERS.sort((a, b) => a.avgLPer100km - b.avgLPer100km).map((d, i) => (
            <tr key={d.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => { setSelectedDriver(d); setModal('driver'); }}>
              <td style={{ padding: 8, fontWeight: 700, color: i === 0 ? '#10b981' : i === 3 ? '#ef4444' : 'var(--text-primary)' }}>#{i + 1}</td>
              <td style={{ padding: 8 }}><span style={{ fontWeight: 600 }}>{d.name}</span> <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>{d.id}</span></td>
              <td style={{ padding: 8, textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>{d.avgLPer100km}</td>
              <td style={{ padding: 8, textAlign: 'right', color: d.fuelEfficiencyDelta < 0 ? '#10b981' : '#ef4444', fontWeight: 600, fontFamily: 'monospace' }}>{d.fuelEfficiencyDelta > 0 ? '+' : ''}{d.fuelEfficiencyDelta}%</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{d.totalBlocks}</td>
              <td style={{ padding: 8, textAlign: 'right' }}>{fmtNum(d.totalKm)}</td>
              <td style={{ padding: 8 }}>{varBar(d.avgFuelRateVariance, 6, d.avgFuelRateVariance < 2 ? '#10b981' : d.avgFuelRateVariance < 4 ? '#f59e0b' : '#ef4444')}</td>
              <td style={{ padding: 8, textAlign: 'right', fontFamily: 'monospace' }}>{d.costPerKm.toFixed(2)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {/* Recent Fuel Events */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>📋 Recent Fuel Events</div>
        <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase' }}>
            <th style={{ textAlign: 'left', padding: 8 }}>Date</th><th style={{ textAlign: 'left', padding: 8 }}>Driver</th><th style={{ textAlign: 'left', padding: 8 }}>Station</th><th style={{ textAlign: 'right', padding: 8 }}>Liters</th><th style={{ textAlign: 'right', padding: 8 }}>Cost (AED)</th><th style={{ textAlign: 'right', padding: 8 }}>Odometer</th><th style={{ textAlign: 'center', padding: 8 }}>Status</th>
          </tr></thead>
          <tbody>{FUEL_EVENTS.slice(0, 10).map(f => (
            <tr key={f.id} style={{ borderBottom: '1px solid var(--border)', background: f.anomaly ? 'rgba(239,68,68,0.08)' : undefined }}>
              <td style={{ padding: 8 }}>{fmtDate(f.date)}</td>
              <td style={{ padding: 8 }}>{f.driverName.split(' ')[0]}</td>
              <td style={{ padding: 8 }}>{f.station}</td>
              <td style={{ padding: 8, textAlign: 'right', fontFamily: 'monospace' }}>{f.litersAdded}</td>
              <td style={{ padding: 8, textAlign: 'right', fontFamily: 'monospace' }}>{fmtCur(f.costAED)}</td>
              <td style={{ padding: 8, textAlign: 'right', fontFamily: 'monospace' }}>{fmtNum(f.odometerAtFill)}</td>
              <td style={{ padding: 8, textAlign: 'center' }}>{f.anomaly ? <Badge text="⚠️ ANOMALY" variant="danger" /> : <Badge text="✓ Normal" variant="success" />}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  /* ─────────────── Service Lifecycle Tab ─────────────── */
  const renderService = () => {
    const onTimeCount = SERVICES.filter(s => s.onTime).length;
    const ftfRate = SERVICES.filter(s => s.firstTimeFix).length / SERVICES.length * 100;
    const avgQuality = SERVICES.reduce((s, sv) => s + sv.qualityScore, 0) / SERVICES.length;
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
          <TrendCard title="Total Maint. Cost" value={fmtCur(v.maintenanceTotalAED)} trend={8.2} sparkline={spark(68400)} color="#ef4444" />
          <TrendCard title="Scheduled" value={fmtCur(v.maintenanceScheduledAED)} trend={2.1} sparkline={spark(42200)} color="#10b981" />
          <TrendCard title="Unscheduled" value={fmtCur(v.maintenanceUnscheduledAED)} trend={18.5} sparkline={spark(26200)} color="#ef4444" />
          <TrendCard title="On-Time Rate" value={`${Math.round(onTimeCount / SERVICES.length * 100)}`} unit="%" sparkline={spark(67)} color="#22d3ee" />
          <TrendCard title="Quality Score" value={avgQuality.toFixed(0)} unit="/100" sparkline={spark(avgQuality)} color="#8b5cf6" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <ChartCard title="Maintenance Cost Breakdown (AED)" type="bar" data={{ labels: SERVICES.map(s => s.category), datasets: [
            { label: 'Parts', data: SERVICES.map(s => s.costPartsAED), backgroundColor: '#f59e0b' },
            { label: 'Labor', data: SERVICES.map(s => s.costLaborAED), backgroundColor: '#3b82f6' },
          ]}} />
          <ChartCard title="Service Type Distribution" type="doughnut" data={{ labels: ['Scheduled','Predictive','Unscheduled','Regulatory'], datasets: [{ data: [
            SERVICES.filter(s => s.type === 'scheduled').length, SERVICES.filter(s => s.type === 'predictive').length,
            SERVICES.filter(s => s.type === 'unscheduled').length, SERVICES.filter(s => s.type === 'regulatory').length,
          ], backgroundColor: ['#10b981','#22d3ee','#ef4444','#8b5cf6'] }] }} />
        </div>
        {/* Service History Table */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>📋 Complete Service History</div>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>WO</th><th style={{ textAlign: 'left', padding: 8 }}>Date</th><th style={{ textAlign: 'left', padding: 8 }}>Type</th><th style={{ textAlign: 'left', padding: 8 }}>Category</th><th style={{ textAlign: 'right', padding: 8 }}>Parts (AED)</th><th style={{ textAlign: 'right', padding: 8 }}>Labor (AED)</th><th style={{ textAlign: 'right', padding: 8 }}>Total (AED)</th><th style={{ textAlign: 'center', padding: 8 }}>On Time</th><th style={{ textAlign: 'right', padding: 8 }}>Quality</th>
            </tr></thead>
            <tbody>{SERVICES.map(s => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => { setSelectedService(s); setModal('service'); }}>
                <td style={{ padding: 8, fontFamily: 'monospace', fontWeight: 600 }}>{s.id}</td>
                <td style={{ padding: 8 }}>{fmtDate(s.date)}</td>
                <td style={{ padding: 8 }}><Badge text={s.type} variant={s.type === 'unscheduled' ? 'danger' : s.type === 'predictive' ? 'info' : 'success'} /></td>
                <td style={{ padding: 8 }}>{s.category}</td>
                <td style={{ padding: 8, textAlign: 'right', fontFamily: 'monospace' }}>{fmtCur(s.costPartsAED)}</td>
                <td style={{ padding: 8, textAlign: 'right', fontFamily: 'monospace' }}>{fmtCur(s.costLaborAED)}</td>
                <td style={{ padding: 8, textAlign: 'right', fontWeight: 700, fontFamily: 'monospace' }}>{fmtCur(s.costTotalAED)}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{s.onTime ? '✅' : `❌ +${s.delayDays}d`}</td>
                <td style={{ padding: 8, textAlign: 'right', color: s.qualityScore >= 90 ? '#10b981' : s.qualityScore >= 75 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{s.qualityScore}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ─────────────── Financial / TCO Tab ─────────────── */
  const renderTCO = () => {
    const ageMonths = Math.round((Date.now() - v.acquisitionDate.getTime()) / (30.44 * 86400000));
    const depreciationTotal = v.acquisitionCostAED - v.residualValueAED;
    const tcoItems = [
      { label: 'Acquisition (amortized)', value: v.acquisitionCostAED, color: '#8b5cf6' },
      { label: 'Fuel', value: v.fuelTotalAED, color: '#f59e0b' },
      { label: 'Maintenance (Scheduled)', value: v.maintenanceScheduledAED, color: '#10b981' },
      { label: 'Maintenance (Unscheduled)', value: v.maintenanceUnscheduledAED, color: '#ef4444' },
      { label: 'Insurance', value: v.insuranceAnnualAED * (ageMonths / 12), color: '#3b82f6' },
      { label: 'Tires', value: v.tiresAnnualAED * (ageMonths / 12), color: '#22d3ee' },
      { label: 'Registration & Tolls (Salik)', value: v.registrationAED + v.salikTollsAED, color: '#ec4899' },
      { label: 'Downtime Cost (est.)', value: v.downtimeHours * 85, color: '#6b7280' },
    ];
    const tcoTotal = tcoItems.reduce((s, i) => s + i.value, 0);
    return (
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 16 }}>
          <TrendCard title="Acquisition" value={fmtCur(v.acquisitionCostAED)} sparkline={spark(485000)} color="#8b5cf6" />
          <TrendCard title="Residual Value" value={fmtCur(v.residualValueAED)} trend={-1.8} sparkline={spark(295000)} color="#10b981" />
          <TrendCard title="3-Year TCO" value={fmtCur(v.tco3Year)} sparkline={spark(842000)} color="#f59e0b" />
          <TrendCard title="5-Year TCO" value={fmtCur(v.tco5Year)} sparkline={spark(1185000)} color="#ef4444" />
          <TrendCard title="Cost/km Lifetime" value={v.costPerKmLifetime.toFixed(2)} unit=" AED" sparkline={spark(2.45)} color="#22d3ee" />
        </div>
        {/* TCO Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, marginBottom: 12 }}>💰 TCO Breakdown — Lifetime to Date ({ageMonths} months)</div>
            {tcoItems.map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 12 }}>{item.label}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600 }}>{fmtCur(Math.round(item.value))}</span>
                <span style={{ fontSize: 10, color: 'var(--text-muted)', width: 40, textAlign: 'right' }}>{(item.value / tcoTotal * 100).toFixed(1)}%</span>
              </div>
            ))}
            <div style={{ borderTop: '2px solid var(--border)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>TOTAL TCO</span><span style={{ fontFamily: 'monospace' }}>{fmtCur(Math.round(tcoTotal))}</span>
            </div>
          </div>
          <ChartCard title="TCO Distribution" type="doughnut" data={{ labels: tcoItems.map(i => i.label), datasets: [{ data: tcoItems.map(i => Math.round(i.value)), backgroundColor: tcoItems.map(i => i.color) }] }} />
        </div>
        {/* Depreciation & Resale */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 16 }}>
          {[
            { title: 'Depreciation', items: [['Total Depreciation', fmtCur(depreciationTotal)], ['Monthly Rate', fmtCur(v.monthlyDepreciation)], ['Depreciation %', fmtPct(depreciationTotal / v.acquisitionCostAED * 100)], ['Per km', `${(depreciationTotal / v.currentOdometer).toFixed(2)} AED`]] },
            { title: 'Resale Analysis', items: [['Current Residual', fmtCur(v.residualValueAED)], ['Projected (Q3 2026)', fmtCur(v.resaleProjectionAED)], ['Premium vs Market', '+5.8%'], ['Optimal Sell Window', 'Jul – Sep 2026']] },
            { title: 'Replacement Decision', items: [['Break-even Point', '42 months'], ['Current Age', `${ageMonths} months`], ['Keep vs Replace', ageMonths < 42 ? '✅ KEEP' : '⚠️ EVALUATE'], ['Next Major Cost', 'Transmission @ 380K km']] },
          ].map(card => (
            <div key={card.title} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>{card.title}</div>
              {card.items.map(([l, val]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 12, borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span><span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        {/* Driver Impact on Value */}
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>📉 Driver Impact on Residual Value</div>
          <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: 10, textTransform: 'uppercase' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Driver</th><th style={{ textAlign: 'right', padding: 8 }}>km Operated</th><th style={{ textAlign: 'right', padding: 8 }}>% of Life</th><th style={{ textAlign: 'right', padding: 8 }}>DWVS</th><th style={{ textAlign: 'right', padding: 8 }}>Depreciation Impact (AED)</th><th style={{ textAlign: 'center', padding: 8 }}>Net Effect</th>
            </tr></thead>
            <tbody>{DRIVERS.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 8, fontWeight: 600 }}>{d.name}</td>
                <td style={{ padding: 8, textAlign: 'right', fontFamily: 'monospace' }}>{fmtNum(d.totalKm)}</td>
                <td style={{ padding: 8, textAlign: 'right' }}>{(d.totalKm / totalDriverKm * 100).toFixed(1)}%</td>
                <td style={{ padding: 8, textAlign: 'right' }}><span style={{ fontWeight: 700, color: dwvsColor(d.dwvs) }}>{d.dwvs.toFixed(2)}</span></td>
                <td style={{ padding: 8, textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: d.estimatedDepreciationImpactAED < 0 ? '#10b981' : '#ef4444' }}>{d.estimatedDepreciationImpactAED > 0 ? '+' : ''}{fmtCur(d.estimatedDepreciationImpactAED)}</td>
                <td style={{ padding: 8, textAlign: 'center' }}>{d.estimatedDepreciationImpactAED <= 0 ? '✅ Value Preserved' : '⚠️ Accelerated Wear'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    );
  };

  /* ─────────────── Driver Attribution Tab ─────────────── */
  const renderDrivers = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        <TrendCard title="Total Sessions" value={DRIVERS.reduce((s, d) => s + d.totalBlocks, 0)} sparkline={spark(2100)} color="#22d3ee" />
        <TrendCard title="Total Drivers" value={DRIVERS.length} sparkline={spark(4)} color="#8b5cf6" />
        <TrendCard title="Best DWVS" value={Math.min(...DRIVERS.map(d => d.dwvs)).toFixed(2)} sparkline={spark(0.28)} color="#10b981" />
        <TrendCard title="Worst DWVS" value={Math.max(...DRIVERS.map(d => d.dwvs)).toFixed(2)} sparkline={spark(0.84)} color="#ef4444" />
      </div>
      {/* DIAM Explanation Card */}
      <div style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.08), rgba(139,92,246,0.08))', borderRadius: 12, padding: 16, border: '1px solid rgba(34,211,238,0.2)', marginBottom: 16 }}>
        <div style={{ fontWeight: 700, marginBottom: 8 }}>🧠 Driver Impact Attribution Model (DIAM) — Variance-Based</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          DWVS = Σ(wᵢ × CVᵢ²) where CV = Coefficient of Variation per metric. Measures driving <strong style={{ color: 'var(--text-primary)' }}>consistency</strong>, not just averages.
          High variance in RPM, speed, and fuel rate causes mechanical fatigue — the true predictor of accelerated depreciation. Each session block is TPM-signed and immutable.
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11 }}>
          {[{ label: 'RPM Variance', weight: '25%' }, { label: 'Harsh Events', weight: '20%' }, { label: 'Speed Variance', weight: '15%' }, { label: 'Fuel Rate Var.', weight: '15%' }, { label: 'DTC Rate', weight: '15%' }, { label: 'Idle Variance', weight: '10%' }].map(w => (
            <div key={w.label} style={{ background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: 6, textAlign: 'center' }}>
              <div style={{ fontWeight: 700 }}>{w.weight}</div><div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{w.label}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Driver Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        {DRIVERS.map(d => (
          <div key={d.id} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: `1px solid var(--border)`, borderLeft: `4px solid ${dwvsColor(d.dwvs)}`, cursor: 'pointer' }} onClick={() => { setSelectedDriver(d); setModal('driver'); }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div><span style={{ fontSize: 20, marginRight: 8 }}>{d.photo}</span><span style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</span> <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{d.id}</span></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 24, fontWeight: 800, color: dwvsColor(d.dwvs) }}>{d.dwvs.toFixed(2)}</div><div style={{ fontSize: 10, color: dwvsColor(d.dwvs) }}>DWVS — {dwvsLabel(d.dwvs)}</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 10 }}>
              {[
                { l: 'Sessions', v: d.totalBlocks }, { l: 'Total km', v: fmtNum(d.totalKm) },
                { l: 'L/100km', v: d.avgLPer100km.toFixed(1) }, { l: 'Behavior', v: d.behaviorScore },
              ].map(m => <div key={m.l} style={{ textAlign: 'center' }}><div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 14 }}>{m.v}</div><div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{m.l}</div></div>)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 11 }}>
              <div>RPM σ²: {varBar(d.avgRpmVariance, 60000, dwvsColor(d.dwvs))} <span style={{ fontFamily: 'monospace', fontSize: 10 }}>{fmtNum(Math.round(d.avgRpmVariance))}</span></div>
              <div>Speed σ²: {varBar(d.avgSpeedVariance, 1000, dwvsColor(d.dwvs))} <span style={{ fontFamily: 'monospace', fontSize: 10 }}>{fmtNum(Math.round(d.avgSpeedVariance))}</span></div>
              <div>Harsh/1000km: {varBar(d.harshRate, 10, d.harshRate < 3 ? '#10b981' : '#ef4444')} <span style={{ fontFamily: 'monospace', fontSize: 10 }}>{d.harshRate}</span></div>
              <div>DTC/1000km: {varBar(d.dtcRate, 3, d.dtcRate < 0.5 ? '#10b981' : '#ef4444')} <span style={{ fontFamily: 'monospace', fontSize: 10 }}>{d.dtcRate}</span></div>
            </div>
            <div style={{ marginTop: 8, padding: '6px 10px', borderRadius: 6, background: d.estimatedDepreciationImpactAED < 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', fontSize: 12, fontWeight: 600, textAlign: 'center', color: d.estimatedDepreciationImpactAED < 0 ? '#10b981' : '#ef4444' }}>
              Depreciation Impact: {d.estimatedDepreciationImpactAED > 0 ? '+' : ''}{fmtCur(d.estimatedDepreciationImpactAED)}/year
            </div>
          </div>
        ))}
      </div>
      {/* Recent Session Blocks */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>⛓️ Recent Session Blocks (TPM-Signed)</div>
        <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
          <thead><tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: 9, textTransform: 'uppercase' }}>
            <th style={{ textAlign: 'left', padding: 6 }}>Block</th><th style={{ textAlign: 'left', padding: 6 }}>Driver</th><th style={{ textAlign: 'right', padding: 6 }}>km</th><th style={{ textAlign: 'right', padding: 6 }}>Duration</th><th style={{ textAlign: 'right', padding: 6 }}>L/100km</th><th style={{ textAlign: 'right', padding: 6 }}>RPM σ²</th><th style={{ textAlign: 'right', padding: 6 }}>Wear Idx</th><th style={{ textAlign: 'right', padding: 6 }}>Harsh</th><th style={{ textAlign: 'right', padding: 6 }}>DTCs</th><th style={{ textAlign: 'left', padding: 6 }}>Hash</th>
          </tr></thead>
          <tbody>{SESSION_BLOCKS.slice(0, 12).map(b => (
            <tr key={b.id} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => { setSelectedBlock(b); setModal('block'); }}>
              <td style={{ padding: 6, fontFamily: 'monospace', fontWeight: 600, fontSize: 10 }}>#{b.blockNumber}</td>
              <td style={{ padding: 6 }}>{b.driverName.split(' ')[0]} <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{b.driverId}</span></td>
              <td style={{ padding: 6, textAlign: 'right', fontFamily: 'monospace' }}>{b.distanceKm}</td>
              <td style={{ padding: 6, textAlign: 'right' }}>{Math.floor(b.durationMinutes / 60)}h {b.durationMinutes % 60}m</td>
              <td style={{ padding: 6, textAlign: 'right', fontFamily: 'monospace', fontWeight: 600 }}>{b.lPer100km.toFixed(1)}</td>
              <td style={{ padding: 6, textAlign: 'right', fontFamily: 'monospace', color: b.rpmVariance < 25000 ? '#10b981' : b.rpmVariance < 45000 ? '#f59e0b' : '#ef4444' }}>{fmtNum(Math.round(b.rpmVariance))}</td>
              <td style={{ padding: 6, textAlign: 'right' }}><span style={{ color: b.wearIndex < 0.4 ? '#10b981' : b.wearIndex < 0.6 ? '#f59e0b' : '#ef4444', fontWeight: 700 }}>{b.wearIndex.toFixed(2)}</span></td>
              <td style={{ padding: 6, textAlign: 'right' }}>{b.harshBrakes + b.harshAccel + b.harshCorner}</td>
              <td style={{ padding: 6, textAlign: 'right', color: b.dtcsGenerated.length ? '#ef4444' : '#10b981' }}>{b.dtcsGenerated.length || '—'}</td>
              <td style={{ padding: 6, fontFamily: 'monospace', fontSize: 9, color: 'var(--text-muted)' }}>🔐 {b.blockHash.slice(0, 14)}…</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );

  /* ─────────────── Fleet Comparison Tab ─────────────── */
  const renderFleet = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
        <TrendCard title="Fleet Rank" value={`#${v.fleetRank}`} unit={` / ${v.fleetSize}`} sparkline={spark(12)} color="#10b981" />
        <TrendCard title="Same Model Rank" value={`#${v.sameModelRank}`} unit={` / ${v.sameModelCount}`} sparkline={spark(3)} color="#22d3ee" />
        <TrendCard title="Uptime" value={v.uptime} unit="%" sparkline={spark(94.2)} color="#8b5cf6" />
        <TrendCard title="Fleet Contribution" value="+2.4" unit="%" sparkline={spark(2.4)} color="#10b981" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <ChartCard title="This Vehicle vs Fleet Avg (Cost/km AED)" type="bar" data={{ labels: ['Fuel','Maintenance','Insurance','Tires','Depreciation','Total'], datasets: [
          { label: 'This Vehicle', data: [1.19, 0.20, 0.11, 0.07, 0.55, 2.45], backgroundColor: '#22d3ee' },
          { label: 'Fleet Average', data: [1.24, 0.25, 0.12, 0.08, 0.62, 2.68], backgroundColor: '#6b7280' },
        ]}} />
        <ChartCard title="Same Model Comparison — Cost/km" type="bar" data={{ labels: ['VEH-0184\n(This)','VEH-0122','VEH-0098','VEH-0211','VEH-0067','VEH-0145'], datasets: [{ label: 'Cost/km', data: [2.45, 2.52, 2.38, 2.71, 2.44, 2.89], backgroundColor: [2.45, 2.52, 2.38, 2.71, 2.44, 2.89].map(v => v === 2.45 ? '#22d3ee' : v < 2.50 ? '#10b981' : '#f59e0b') }] }} />
      </div>
      {/* Ranking Table */}
      <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>🏆 Ranking Across KPIs</div>
        {[
          { kpi: 'Fuel Efficiency', rank: 8, total: 150, percentile: 95, color: '#10b981' },
          { kpi: 'Maintenance Cost', rank: 12, total: 150, percentile: 92, color: '#10b981' },
          { kpi: 'Uptime', rank: 18, total: 150, percentile: 88, color: '#22d3ee' },
          { kpi: 'Safety Score', rank: 22, total: 150, percentile: 85, color: '#22d3ee' },
          { kpi: 'Driver DWVS (weighted)', rank: 31, total: 150, percentile: 79, color: '#f59e0b' },
          { kpi: 'TCO per km', rank: 15, total: 150, percentile: 90, color: '#10b981' },
        ].map(r => (
          <div key={r.kpi} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ width: 160, fontSize: 12 }}>{r.kpi}</span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, width: 70, fontSize: 12 }}>#{r.rank} / {r.total}</span>
            <div style={{ flex: 1 }}>{varBar(r.percentile, 100, r.color)}</div>
            <span style={{ fontWeight: 700, color: r.color, width: 50, textAlign: 'right', fontSize: 12 }}>P{r.percentile}</span>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─────────────── AI Recommendations Tab ─────────────── */
  const renderAI = () => (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
        <TrendCard title="Recommendations" value={AI_RECOMMENDATIONS.length} sparkline={spark(7)} color="#8b5cf6" />
        <TrendCard title="Potential Savings" value={fmtCur(AI_RECOMMENDATIONS.reduce((s, r) => s + r.impact, 0))} sparkline={spark(67000)} color="#10b981" />
        <TrendCard title="Avg Confidence" value={Math.round(AI_RECOMMENDATIONS.reduce((s, r) => s + r.confidence, 0) / AI_RECOMMENDATIONS.length)} unit="%" sparkline={spark(86)} color="#22d3ee" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {AI_RECOMMENDATIONS.sort((a, b) => { const p = { critical: 0, high: 1, medium: 2, low: 3 }; return (p[a.priority as keyof typeof p] ?? 4) - (p[b.priority as keyof typeof p] ?? 4); }).map(r => (
          <div key={r.id} style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)', borderLeft: `4px solid ${sevColor(r.priority)}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 24 }}>{r.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <Badge text={r.priority.toUpperCase()} variant={r.priority === 'critical' ? 'danger' : r.priority === 'high' ? 'warning' : 'info'} />
                    <Badge text={r.category} variant="default" />
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', color: '#10b981', fontSize: 16 }}>{fmtCur(r.impact)}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>est. impact/year</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 10 }}>{r.desc}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
                <span style={{ color: 'var(--text-muted)' }}>Confidence:</span>
                {varBar(r.confidence, 100, r.confidence > 85 ? '#10b981' : r.confidence > 70 ? '#f59e0b' : '#6b7280')}
                <span style={{ fontFamily: 'monospace', fontWeight: 700, width: 32 }}>{r.confidence}%</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button style={{ padding: '4px 12px', borderRadius: 6, border: 'none', background: '#10b981', color: '#fff', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>✓ Accept</button>
                <button style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', fontSize: 11, cursor: 'pointer' }}>Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─────────────── History Tab ─────────────── */
  const renderHistory = () => {
    const events = [
      ...SERVICES.map(s => ({ date: s.date, icon: '🔧', title: `${s.type} Service — ${s.category}`, desc: `${s.description} (${s.id})`, color: s.type === 'unscheduled' ? '#ef4444' : '#10b981' })),
      ...FUEL_EVENTS.slice(0, 8).map(f => ({ date: f.date, icon: '⛽', title: `Refuel at ${f.station}`, desc: `${f.litersAdded}L — ${f.driverName}`, color: f.anomaly ? '#ef4444' : '#22d3ee' })),
      ...SESSION_BLOCKS.filter(b => b.dtcsGenerated.length > 0).map(b => ({ date: b.startTime, icon: '⚠️', title: `DTC Generated: ${b.dtcsGenerated.join(', ')}`, desc: `During ${b.driverName} session (Block #${b.blockNumber})`, color: '#f59e0b' })),
      { date: v.acquisitionDate, icon: '🏭', title: 'Vehicle Acquired', desc: `Volvo FH 460 — ${fmtCur(v.acquisitionCostAED)}`, color: '#8b5cf6' },
    ].sort((a, b) => b.date.getTime() - a.date.getTime());
    return (
      <div>
        <div style={{ background: 'var(--bg-secondary)', borderRadius: 12, padding: 16, border: '1px solid var(--border)' }}>
          <div style={{ fontWeight: 700, marginBottom: 16 }}>📋 Complete Vehicle Timeline ({events.length} events)</div>
          {events.map((e, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${e.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, border: `2px solid ${e.color}` }}>{e.icon}</div>
                {i < events.length - 1 && <div style={{ width: 2, flex: 1, background: 'var(--border)', marginTop: 4 }} />}
              </div>
              <div style={{ flex: 1, paddingBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{e.desc}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{fmtDate(e.date)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ─────────────── Modals ─────────────── */
  const renderModals = () => (
    <>
      {/* Session Block Detail */}
      {modal === 'block' && selectedBlock && (
        <Modal title={`Session Block #${selectedBlock.blockNumber}`} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 12 }}>
            {[
              ['Driver', `${selectedBlock.driverName} (${selectedBlock.driverId})`], ['Auth Method', selectedBlock.authMethod],
              ['Start', fmtDate(selectedBlock.startTime)], ['End', fmtDate(selectedBlock.endTime)],
              ['Duration', `${Math.floor(selectedBlock.durationMinutes / 60)}h ${selectedBlock.durationMinutes % 60}m`],
              ['Distance', `${selectedBlock.distanceKm} km`],
              ['Odometer', `${fmtNum(selectedBlock.odometerStart)} → ${fmtNum(selectedBlock.odometerEnd)}`],
              ['Fuel Consumed', `${selectedBlock.fuelConsumedL} L`], ['Fuel Cost', fmtCur(selectedBlock.fuelCostAED)],
              ['L/100km', selectedBlock.lPer100km.toFixed(2)],
              ['RPM Mean', fmtNum(selectedBlock.rpmMean)], ['RPM Variance (σ²)', fmtNum(Math.round(selectedBlock.rpmVariance))],
              ['Speed Variance (σ²)', fmtNum(Math.round(selectedBlock.speedVariance))],
              ['Fuel Rate Var. (σ²)', selectedBlock.fuelRateVariance.toFixed(2)],
              ['Harsh Events', `${selectedBlock.harshBrakes}B + ${selectedBlock.harshAccel}A + ${selectedBlock.harshCorner}C`],
              ['Max Speed', `${selectedBlock.maxSpeedKmh} km/h`], ['Avg Speed', `${selectedBlock.avgSpeedKmh} km/h`],
              ['Idle', `${selectedBlock.idleMinutes} min (${selectedBlock.idlePct}%)`],
              ['Route', `Highway ${selectedBlock.routeHighwayPct}% / Urban ${selectedBlock.routeUrbanPct}%`],
              ['Load', `${fmtNum(selectedBlock.loadWeightKg)} kg`], ['Ambient Temp', `${selectedBlock.ambientTempC}°C`],
              ['Wear Index', selectedBlock.wearIndex.toFixed(3)], ['Health Delta', selectedBlock.healthDelta.toFixed(4)],
              ['DTCs Generated', selectedBlock.dtcsGenerated.length ? selectedBlock.dtcsGenerated.join(', ') : 'None'],
              ['TPM Signed', selectedBlock.tpmSigned ? '✅ Yes' : '❌ No'],
              ['Block Hash', selectedBlock.blockHash],
            ].map(([l, val]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{l}</span>
                <span style={{ fontWeight: 600, fontFamily: typeof val === 'string' && val.startsWith('0x') ? 'monospace' : 'inherit', fontSize: typeof val === 'string' && val.length > 20 ? 10 : 12 }}>{val}</span>
              </div>
            ))}
          </div>
        </Modal>
      )}
      {/* Service Detail */}
      {modal === 'service' && selectedService && (
        <Modal title={`Work Order ${selectedService.id}`} onClose={() => setModal(null)}>
          <div style={{ fontSize: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[['Date', fmtDate(selectedService.date)], ['Type', selectedService.type], ['Category', selectedService.category], ['Depot', selectedService.depot],
                ['Technician', selectedService.technician], ['Duration', `${selectedService.durationHours}h`],
                ['Odometer', fmtNum(selectedService.odometerAtService)], ['On Time', selectedService.onTime ? '✅ Yes' : `❌ +${selectedService.delayDays} days`],
                ['First-Time Fix', selectedService.firstTimeFix ? '✅ Yes' : '❌ No'], ['Quality', `${selectedService.qualityScore}/100`],
              ].map(([l, val]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{l}</span><span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}
            </div>
            {selectedService.dtcsTrigger.length > 0 && <div style={{ marginBottom: 12 }}><div style={{ fontWeight: 700, marginBottom: 6 }}>Triggering DTCs</div>{selectedService.dtcsTrigger.map(d => <Badge key={d} text={d} variant="warning" />)}</div>}
            {selectedService.partsReplaced.length > 0 && (
              <div><div style={{ fontWeight: 700, marginBottom: 6 }}>Parts Replaced ({selectedService.partsReplaced.length})</div>
                <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                  <thead><tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 10 }}><th style={{ textAlign: 'left', padding: 4 }}>Part</th><th style={{ padding: 4 }}>Part No.</th><th style={{ padding: 4 }}>Qty</th><th style={{ textAlign: 'right', padding: 4 }}>Cost</th><th style={{ padding: 4 }}>Warranty</th></tr></thead>
                  <tbody>{selectedService.partsReplaced.map(p => (
                    <tr key={p.partNo} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 4 }}>{p.name}</td><td style={{ padding: 4, fontFamily: 'monospace', fontSize: 10 }}>{p.partNo}</td>
                      <td style={{ padding: 4, textAlign: 'center' }}>{p.qty}</td><td style={{ padding: 4, textAlign: 'right', fontFamily: 'monospace' }}>{fmtCur(p.costAED)}</td>
                      <td style={{ padding: 4 }}><Badge text={p.warrantyStatus} variant={p.warrantyStatus.includes('In') ? 'success' : 'default'} /></td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            )}
            <div style={{ borderTop: '2px solid var(--border)', marginTop: 12, paddingTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 14 }}>
              <span>Total Cost</span><span style={{ fontFamily: 'monospace' }}>{fmtCur(selectedService.costTotalAED)}</span>
            </div>
          </div>
        </Modal>
      )}
      {/* Driver Detail */}
      {modal === 'driver' && selectedDriver && (
        <Modal title={`Driver Profile — ${selectedDriver.name}`} onClose={() => setModal(null)}>
          <div style={{ fontSize: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: 12, background: `${dwvsColor(selectedDriver.dwvs)}15`, borderRadius: 8, border: `1px solid ${dwvsColor(selectedDriver.dwvs)}30` }}>
              <div><div style={{ fontWeight: 700, fontSize: 16 }}>{selectedDriver.name}</div><div style={{ color: 'var(--text-muted)' }}>{selectedDriver.id} · {selectedDriver.licenseClass}</div></div>
              <div style={{ textAlign: 'right' }}><div style={{ fontSize: 32, fontWeight: 800, color: dwvsColor(selectedDriver.dwvs) }}>{selectedDriver.dwvs.toFixed(2)}</div><div style={{ fontSize: 11 }}>DWVS — {dwvsLabel(selectedDriver.dwvs)}</div></div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                ['Sessions', selectedDriver.totalBlocks], ['Total km', fmtNum(selectedDriver.totalKm)], ['Total Hours', fmtNum(selectedDriver.totalHours)],
                ['Total Fuel (L)', fmtNum(selectedDriver.totalFuelL)], ['Fuel Cost', fmtCur(selectedDriver.totalFuelCostAED)], ['Behavior Score', `${selectedDriver.behaviorScore}/100`],
                ['L/100km', selectedDriver.avgLPer100km.toFixed(1)], ['Fuel Δ vs Baseline', `${selectedDriver.fuelEfficiencyDelta > 0 ? '+' : ''}${selectedDriver.fuelEfficiencyDelta}%`], ['Cost/km', `${selectedDriver.costPerKm.toFixed(2)} AED`],
                ['RPM Variance', fmtNum(Math.round(selectedDriver.avgRpmVariance))], ['Speed Variance', fmtNum(Math.round(selectedDriver.avgSpeedVariance))], ['Fuel Rate Var.', selectedDriver.avgFuelRateVariance.toFixed(1)],
                ['Harsh/1000km', selectedDriver.harshRate.toFixed(1)], ['DTC/1000km', selectedDriver.dtcRate.toFixed(1)], ['Consistency', selectedDriver.consistencyRating.toUpperCase()],
              ].map(([l, val]) => (
                <div key={l} style={{ padding: 8, background: 'var(--bg-primary)', borderRadius: 6, textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: 14 }}>{val}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, borderRadius: 8, background: selectedDriver.estimatedDepreciationImpactAED < 0 ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', textAlign: 'center', fontWeight: 700, fontSize: 15, color: selectedDriver.estimatedDepreciationImpactAED < 0 ? '#10b981' : '#ef4444' }}>
              Annual Depreciation Impact: {selectedDriver.estimatedDepreciationImpactAED > 0 ? '+' : ''}{fmtCur(selectedDriver.estimatedDepreciationImpactAED)}
            </div>
          </div>
        </Modal>
      )}
    </>
  );

  /* ─────────────── Main Render ─────────────── */
  return (
    <div style={{ padding: 24 }}>
      <PageHeader title="🎯 Vehicle 360° Lifecycle Intelligence" subtitle={`${v.plate} — ${v.make} ${v.model} (${v.year}) · Driver-Vehicle Attribution · Variance-Based TCO`} />
      <TabBar tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ marginTop: 16 }}>
        {tab === 'dashboard' && renderDashboard()}
        {tab === 'fuel' && renderFuel()}
        {tab === 'service' && renderService()}
        {tab === 'tco' && renderTCO()}
        {tab === 'drivers' && renderDrivers()}
        {tab === 'fleet' && renderFleet()}
        {tab === 'ai' && renderAI()}
        {tab === 'history' && renderHistory()}
      </div>
      {renderModals()}
    </div>
  );
}
