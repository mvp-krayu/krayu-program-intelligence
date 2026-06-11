import { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/ui/StatCard';
import TabBar from '@/components/ui/TabBar';
import Badge from '@/components/ui/Badge';
import TableCard from '@/components/data/TableCard';
import { useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';

const TABS = [
  { id: 'overview', label: '📋 Overview' },
  { id: 'repair', label: '🔧 Repair Scheduling' },
  { id: 'parts', label: '📦 Parts & WMS' },
  { id: 'workshop', label: '🏭 Workshop Mgmt' },
  { id: 'r155', label: '🔐 R155/R156' },
  { id: 'oem', label: '🏭 OEM Intelligence' },
];

const api = (path: string) => fetch(`/api/v1/aftersales/${path}`).then(r => r.json()).catch(() => null);

export default function AftersalesOEMPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('overview');
  const [dash, setDash] = useState<any>(null);
  const [repair, setRepair] = useState<any>(null);
  const [parts, setParts] = useState<any>(null);
  const [workshop, setWorkshop] = useState<any>(null);
  const [cyber, setCyber] = useState<any>(null);
  const [oem, setOem] = useState<any>(null);

  useEffect(() => {
    api('dashboard').then(d => setDash(d?.data));
    api('repair-scheduling').then(d => setRepair(d?.data));
    api('parts-integration').then(d => setParts(d?.data));
    api('workshop-management').then(d => setWorkshop(d?.data));
    api('cybersecurity-compliance').then(d => setCyber(d?.data));
    api('oem-intelligence').then(d => setOem(d?.data));
  }, []);

  const dv = dash?.overview || { openWorkOrders: 42, scheduledRepairs: 18, partsOnOrder: 67, workshopUtilization: 82.4, avgFirstTimeFixRate: 92.3, unplannedDowntimeReduction: 68 };
  const rp = repair || { predictiveAlerts: [
    { id:'RA-001', vehicleId:'V001', plate:'DXB-7291', type:'Tanker', component:'Turbocharger Wastegate', severity:'high', prediction: { failureProbability: 0.87, estimatedDaysToFailure: 5 }, status:'scheduled' },
    { id:'RA-002', vehicleId:'V008', plate:'DXB-4490', type:'Tanker', component:'Brake Pad Assembly', severity:'medium', prediction: { failureProbability: 0.62, estimatedDaysToFailure: 14 }, status:'monitoring' },
    { id:'RA-003', vehicleId:'BUS-1103', plate:'BUS-1103', type:'Bus', component:'Air Suspension Compressor', severity:'medium', prediction: { failureProbability: 0.55, estimatedDaysToFailure: 21 }, status:'monitoring' },
  ] };
  const pt = parts || { partsOrders: [
    { orderId:'PO-2026-0891', component:'Turbocharger Wastegate Actuator', partNumber:'MAN-51.09100-7924', oem:'MAN', confidence:96.8, inStock:true, priceAed:4250, status:'confirmed' },
    { orderId:'PO-2026-0892', component:'Brake Pad Set — Rear Axle', partNumber:'VOL-21227349', oem:'Volvo', confidence:98.2, inStock:true, priceAed:1890, status:'pending_approval' },
  ], metrics: { wrongPartOrderRate: 1.2, previousWrongPartRate: 12.5, firstTimeFixRate: 92.3 } };
  const ws = workshop || { workshops: [
    { id:'WS-JAFZA-01', name:'JAFZA Main Workshop', bays:12, baysOccupied:9, occupancyPct:75, technicians:[], queueDepth:4 },
    { id:'WS-ALQ-01', name:'Al Quoz Service Center', bays:8, baysOccupied:7, occupancyPct:87.5, technicians:[], queueDepth:6 },
  ] };
  const cy = cyber || { r155: { status:'compliant', devicesCompliant:4185, compliancePct:98.9 }, r156: { status:'compliant', otaUpdatesVerified:892 }, chainOfTrust: [
    { layer:1, name:'OEM Build Server', status:'verified' }, { layer:2, name:'Blue Edge OTA Server', status:'verified' },
    { layer:3, name:'SVG Device — TPM 2.0', status:'verified' }, { layer:4, name:'Vehicle ECU', status:'verified' },
  ] };
  const om = oem || { fieldIntelligence: { failureCorrelations: [
    { component:'Turbocharger', factor:'Country Climate', finding:'Fails 3.2× more in hot/humid', confidence:94.5 },
    { component:'Suspension Bushings', factor:'Road Infrastructure', finding:'40% faster degradation on unpaved', confidence:92.1 },
    { component:'Brake Pads', factor:'Driver Behavior', finding:'Aggressive driving -55% life', confidence:96.8 },
    { component:'Turbo Wastegate', factor:'Load Usage', finding:'Overloaded tankers 2.8× failure', confidence:89.3 },
    { component:'Cargo Seals', factor:'Hazardous Events', finding:'HAZMAT cargo degrades seals', confidence:87.6 },
    { component:'Shock Absorbers', factor:'Road Condition', finding:'IRI > 6 doubles replacement', confidence:91.4 },
  ] }, oemSubscriptions: [], metrics: { activeOEMSubscribers: 8, totalCorrelations: 2450 } };

  return (
    <div>
      <PageHeader title="Aftersales & OEM Intelligence" breadcrumb="Aftersales" subtitle="5 use cases — Repair scheduling, parts & WMS, workshop management, R155/R156, OEM field intelligence" />
      <div className="stats-grid">
        <StatCard label="Open Work Orders" value={dv.openWorkOrders} color="amber" />
        <StatCard label="Workshop Utilization" value={`${dv.workshopUtilization}%`} color="cyan" />
        <StatCard label="First-Time Fix Rate" value={`${dv.avgFirstTimeFixRate}%`} color="green" />
        <StatCard label="Downtime Reduction" value={`${dv.unplannedDowntimeReduction}%`} color="emerald" />
        <StatCard label="OEM Subscribers" value={om.metrics?.activeOEMSubscribers || 8} color="violet" />
        <StatCard label="Parts On Order" value={dv.partsOnOrder} />
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <TableCard title="Active Use Cases" count={5}>
          <table className="data-table"><thead><tr><th>ID</th><th>Use Case</th><th>Status</th><th>Key Metric</th></tr></thead>
          <tbody>{(dash?.useCases || [
            { id:'UC-AS-01', name:'Intelligent Repair Scheduling', status:'active', metric:'89 breakdowns prevented' },
            { id:'UC-AS-02', name:'Parts Replacement & OEM WMS', status:'active', metric:'1.2% wrong-part rate (was 12.5%)' },
            { id:'UC-AS-03', name:'Workshop Resource Management', status:'active', metric:'82.4% utilization (was 65%)' },
            { id:'UC-AS-04', name:'UN R155/R156 Compliance', status:'active', metric:'98.9% devices compliant' },
            { id:'UC-AS-05', name:'OEM Field Intelligence', status:'active', metric:'8 OEM subscribers, 2450 correlations' },
          ]).map((uc: any) => (
            <tr key={uc.id}><td style={{fontFamily:'var(--mono)',fontSize:'.75rem',color:'var(--cyan)'}}>{uc.id}</td>
            <td>{uc.name}</td><td><Badge status="active" label={uc.status} /></td><td>{uc.metric || ''}</td></tr>
          ))}</tbody></table>
        </TableCard>
      )}

      {tab === 'repair' && (
        <TableCard title="Predictive Repair Alerts" count={rp.predictiveAlerts?.length}>
          <table className="data-table"><thead><tr><th>Vehicle</th><th>Type</th><th>Component</th><th>Failure Prob.</th><th>Days to Failure</th><th>Severity</th><th>Status</th></tr></thead>
          <tbody>{(rp.predictiveAlerts || []).map((a: any) => (
            <tr key={a.id}><td style={{fontWeight:600}}>{a.plate}</td><td>{a.type}</td><td>{a.component}</td>
            <td style={{color: a.prediction.failureProbability > 0.7 ? 'var(--rose)' : 'var(--amber)'}}>{(a.prediction.failureProbability*100).toFixed(0)}%</td>
            <td>{a.prediction.estimatedDaysToFailure} days</td>
            <td><Badge status={a.severity==='high'?'danger':a.severity==='medium'?'warning':'default'} label={a.severity} /></td>
            <td><Badge status={a.status==='scheduled'?'active':'warning'} label={a.status} /></td></tr>
          ))}</tbody></table>
        </TableCard>
      )}

      {tab === 'parts' && (
        <div className="content-grid">
          <div className="stats-grid">
            <StatCard label="Wrong Part Rate" value={`${pt.metrics.wrongPartOrderRate}%`} color="green" />
            <StatCard label="Previous Rate" value={`${pt.metrics.previousWrongPartRate}%`} color="rose" />
            <StatCard label="First-Time Fix" value={`${pt.metrics.firstTimeFixRate}%`} color="emerald" />
          </div>
          <TableCard title="Parts Orders (Auto-Generated)" count={pt.partsOrders?.length}>
            <table className="data-table"><thead><tr><th>Order</th><th>Component</th><th>Part #</th><th>OEM</th><th>Confidence</th><th>Price (AED)</th><th>Status</th></tr></thead>
            <tbody>{(pt.partsOrders || []).map((o: any) => (
              <tr key={o.orderId}><td style={{fontFamily:'var(--mono)',fontSize:'.72rem'}}>{o.orderId}</td><td>{o.component}</td>
              <td style={{fontSize:'.75rem'}}>{o.partNumber}</td><td>{o.oem}</td>
              <td style={{color:'var(--emerald)'}}>{o.confidence}%</td><td>{o.priceAed?.toLocaleString()}</td>
              <td><Badge status={o.status==='confirmed'?'active':'warning'} label={o.status.replace(/_/g,' ')} /></td></tr>
            ))}</tbody></table>
          </TableCard>
        </div>
      )}

      {tab === 'workshop' && (
        <TableCard title="Workshop Status" count={ws.workshops?.length}>
          <table className="data-table"><thead><tr><th>Workshop</th><th>Location</th><th>Bays</th><th>Occupancy</th><th>Queue</th><th>Status</th></tr></thead>
          <tbody>{(ws.workshops || []).map((w: any) => (
            <tr key={w.id}><td style={{fontWeight:600}}>{w.name}</td><td>{w.id}</td>
            <td>{w.baysOccupied}/{w.bays}</td>
            <td><span style={{color: w.occupancyPct > 80 ? 'var(--amber)' : 'var(--emerald)'}}>{w.occupancyPct}%</span></td>
            <td>{w.queueDepth} vehicles</td><td><Badge status="active" label="operational" /></td></tr>
          ))}</tbody></table>
        </TableCard>
      )}

      {tab === 'r155' && (
        <div className="content-grid">
          <div className="stats-grid">
            <StatCard label="R155 CSMS" value={cy.r155.status} color="green" />
            <StatCard label="R156 SUMS" value={cy.r156.status} color="green" />
            <StatCard label="Devices Compliant" value={`${cy.r155.compliancePct}%`} color="emerald" />
            <StatCard label="OTA Verified" value={cy.r156.otaUpdatesVerified} color="blue" />
          </div>
          <TableCard title="Chain of Trust Layers" count={cy.chainOfTrust?.length}>
            <table className="data-table"><thead><tr><th>Layer</th><th>Component</th><th>Status</th></tr></thead>
            <tbody>{(cy.chainOfTrust || []).map((l: any) => (
              <tr key={l.layer}><td>Layer {l.layer}</td><td>{l.name}</td>
              <td><Badge status="active" label={l.status} /></td></tr>
            ))}</tbody></table>
          </TableCard>
        </div>
      )}

      {tab === 'oem' && (
        <TableCard title="Failure Correlation Intelligence — 8 Environmental & Operational Factors" count={om.fieldIntelligence?.failureCorrelations?.length}>
          <table className="data-table"><thead><tr><th>Component</th><th>Factor</th><th>Finding</th><th>Confidence</th></tr></thead>
          <tbody>{(om.fieldIntelligence?.failureCorrelations || []).map((c: any, i: number) => (
            <tr key={i}><td style={{fontWeight:600}}>{c.component}</td>
            <td><Badge status="default" label={c.factor} /></td>
            <td>{c.finding}</td><td style={{color:'var(--emerald)'}}>{c.confidence}%</td></tr>
          ))}</tbody></table>
        </TableCard>
      )}

      {/* ── Status Overview ── */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {[
          { title: "Operational Health", items: [["System Uptime", "99.97%"], ["API Latency", "42ms"], ["Error Rate", "0.03%"], ["Active Connections", "1,284"]] },
          { title: "Fleet Status", items: [["Active Vehicles", "198"], ["In Transit", "87"], ["At Depot", "96"], ["Maintenance", "15"]] },
          { title: "Today Highlights", items: [["Trips Completed", "342"], ["Revenue", "28,450 AED"], ["Fuel Consumed", "4,280L"], ["Distance", "12,450 km"]] },
        ].map((card, ci) => (
          <div key={ci} className="card" style={{ padding: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#22d3ee", marginBottom: 10 }}>{card.title}</h4>
            {card.items.map(([lbl, val], ii) => (
              <div key={ii} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: ii < 3 ? "1px solid var(--border)" : "none", fontSize: 13 }}>
                <span style={{ color: "var(--text-muted)" }}>{lbl}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Recent Activity ── */}
      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: "#22d3ee" }}>🕐 Recent Activity</h3>
        {[
          { time: "2 min ago", action: "System health check completed", user: "System", sev: "info" },
          { time: "15 min ago", action: "New record created by dispatcher", user: "Fatima Al Zaabi", sev: "success" },
          { time: "42 min ago", action: "Alert acknowledged and resolved", user: "Khalid Al Maktoum", sev: "warning" },
          { time: "1 hour ago", action: "Scheduled maintenance triggered", user: "System", sev: "info" },
          { time: "2 hours ago", action: "Configuration updated", user: "Borhane Admin", sev: "success" },
          { time: "3 hours ago", action: "Driver safety score recalculated", user: "AI Agent", sev: "info" },
          { time: "5 hours ago", action: "Compliance report generated", user: "System", sev: "success" },
          { time: "8 hours ago", action: "Night shift handover completed", user: "Ahmed Al Mansouri", sev: "info" },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 7 ? "1px solid var(--border)" : "none" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.sev === "warning" ? "#f59e0b" : a.sev === "success" ? "#10b981" : "#64748b" }} />
              <span style={{ fontSize: 13 }}>{a.action}</span>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 12, color: "var(--text-muted)" }}>
              <span>{a.user}</span>
              <span>{a.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
