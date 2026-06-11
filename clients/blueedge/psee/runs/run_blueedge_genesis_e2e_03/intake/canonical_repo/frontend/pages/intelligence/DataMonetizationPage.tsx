import { useState, useEffect } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import StatCard from '@/components/ui/StatCard';
import TabBar from '@/components/ui/TabBar';
import Badge from '@/components/ui/Badge';
import TableCard from '@/components/data/TableCard';
import { useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';

const TABS = [
  { id: 'overview', label: '💎 Revenue Overview' },
  { id: 'oem', label: '🏭 OEM Subscriptions' },
  { id: 'city', label: '🏙️ City SaaS' },
  { id: 'marketplace', label: '📊 Data Marketplace' },
  { id: 'projections', label: '📈 Projections' },
];

const api = (path: string) => fetch(`/api/v1/data-monetization/${path}`).then(r => r.json()).catch(() => null);

export default function DataMonetizationPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('overview');
  const [dash, setDash] = useState<any>(null);
  const [oemData, setOemData] = useState<any>(null);
  const [cityData, setCityData] = useState<any>(null);
  const [mkData, setMkData] = useState<any>(null);
  const [proj, setProj] = useState<any>(null);

  useEffect(() => {
    api('dashboard').then(d => setDash(d?.data));
    api('oem-subscriptions').then(d => setOemData(d?.data));
    api('city-saas').then(d => setCityData(d?.data));
    api('marketplace').then(d => setMkData(d?.data));
    api('revenue-projections').then(d => setProj(d?.data));
  }, []);

  const d = dash || { totalRevenue: { annualArrAed: { low: 19084000, high: 32296000 }, marginalCost: 'Near zero' },
    streams: [
      { id:'UC-MN-01', name:'OEM Field Intelligence Subscriptions', arrLowAed:1761600, arrHighAed:2936000, subscribers:8, pct:9 },
      { id:'UC-MN-02', name:'City Road Condition SaaS', arrLowAed:5505000, arrHighAed:22020000, clients:3, pct:68 },
      { id:'UC-MN-03', name:'Fleet Data Marketplace & API', arrLowAed:1835000, arrHighAed:7340000, buyers:52, pct:23 },
    ] };
  const om = oemData || { subscribers: [
    { oem:'MAN Truck & Bus', tier:'Enterprise', vehicles:1200, annualRevenue:240000 },
    { oem:'Volvo Trucks', tier:'Professional', vehicles:800, annualRevenue:96000 },
    { oem:'Hino Motors', tier:'Basic', vehicles:350, annualRevenue:17500 },
    { oem:'Tata Motors', tier:'Professional', vehicles:420, annualRevenue:50400 },
    { oem:'Yutong (Buses)', tier:'Basic', vehicles:280, annualRevenue:14000 },
    { oem:'BYD (EV Buses)', tier:'Professional', vehicles:184, annualRevenue:22080 },
    { oem:'Scania', tier:'Enterprise', vehicles:180, annualRevenue:36000 },
    { oem:'DAF Trucks', tier:'Basic', vehicles:150, annualRevenue:7500 },
  ], totals: { totalAnnualRevenue: 483480, retentionRate: 96 },
    tiers: [
      { tier:'Basic', pricePerVehicleYear:50, features:['Failure rates by model','Quarterly reports'] },
      { tier:'Professional', pricePerVehicleYear:120, features:['Climate/road/driver correlation','API access','Monthly reports'] },
      { tier:'Enterprise', pricePerVehicleYear:200, features:['Raw telemetry access','R&D consultation','Custom ML models'] },
    ] };
  const ci = cityData || { clients: [
    { city:'Dubai', authority:'RTA Dubai', contractUsd:2000000, status:'active', dataFeeds:6, satisfaction:4.9 },
    { city:'Sharjah', authority:'Sharjah Roads & Transport', contractUsd:500000, status:'active', dataFeeds:2, satisfaction:4.5 },
    { city:'Abu Dhabi', authority:'Integrated Transport Centre', contractUsd:750000, status:'negotiating', dataFeeds:0 },
  ], pipeline: [
    { city:'Riyadh', estimatedAed:3670000, probability:65, stage:'proposal' },
    { city:'Doha', estimatedAed:2752500, probability:45, stage:'initial_contact' },
  ] };
  const mk = mkData || { products: [
    { name:'Traffic Patterns', buyers:'Logistics & delivery', subscribers:18, monthlyRevenueAed:46200 },
    { name:'Demand Forecasting', buyers:'Ride-hailing', subscribers:7, monthlyRevenueAed:85750 },
    { name:'Driver Behavior', buyers:'Insurance actuaries', subscribers:12, monthlyRevenueAed:73500 },
    { name:'Emissions Data', buyers:'ESG agencies', subscribers:5, monthlyRevenueAed:30625 },
    { name:'Fleet Benchmarks', buyers:'Fleet operators', subscribers:10, monthlyRevenueAed:7700 },
  ], metrics: { totalBuyers: 52, annualProjectedAed: 2925300 } };
  const pj = proj || { projections: [
    { year:1, oemAed:1761600, cityAed:9175000, marketplaceAed:2925300, totalAed:13861900 },
    { year:2, oemAed:3523200, cityAed:16515000, marketplaceAed:5850600, totalAed:25888800, growthPct:86.7 },
    { year:3, oemAed:5872000, cityAed:25692500, marketplaceAed:10238550, totalAed:41803050, growthPct:61.5 },
  ] };

  return (
    <div>
      <PageHeader title="Data Monetization" breadcrumb="Revenue" subtitle="3 B2B revenue streams — OEM subscriptions, city SaaS, data marketplace — $5.2M–$8.8M ARR" />
      <div className="stats-grid">
        <StatCard label="ARR (Low)" value={`${(d.totalRevenue.annualArrAed.low/1e6).toFixed(1)}M AED`} color="green" />
        <StatCard label="ARR (High)" value={`${(d.totalRevenue.annualArrAed.high/1e6).toFixed(1)}M AED`} color="emerald" />
        <StatCard label="OEM Subscribers" value="8" color="violet" />
        <StatCard label="City Clients" value="3" color="cyan" />
        <StatCard label="Data Buyers" value="52" color="blue" />
        <StatCard label="Marginal Cost" value="~0" color="green" />
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div className="content-grid">
          <TableCard title="Revenue Streams" count={3}>
            <table className="data-table"><thead><tr><th>ID</th><th>Stream</th><th>ARR Low (AED)</th><th>ARR High (AED)</th><th>Clients</th><th>% Revenue</th></tr></thead>
            <tbody>{(d.streams || []).map((s: any) => (
              <tr key={s.id}><td style={{fontFamily:'var(--mono)',fontSize:'.75rem',color:'var(--cyan)'}}>{s.id}</td><td>{s.name}</td>
              <td>{(s.arrLowAed/1e6).toFixed(1)}M</td><td style={{color:'var(--emerald)',fontWeight:600}}>{(s.arrHighAed/1e6).toFixed(1)}M</td>
              <td>{s.subscribers || s.clients || s.buyers}</td><td>{s.pct}%</td></tr>
            ))}</tbody></table>
          </TableCard>
          <div className="card" style={{padding:'1.5rem',textAlign:'center'}}>
            <div style={{fontSize:'2rem',fontWeight:800,background:'linear-gradient(135deg, var(--emerald), var(--cyan))',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
              {(d.totalRevenue.annualArrAed.low/1e6).toFixed(1)}M — {(d.totalRevenue.annualArrAed.high/1e6).toFixed(1)}M AED
            </div>
            <div style={{color:'var(--text-muted)',marginTop:4}}>Annual Recurring Revenue</div>
            <div style={{color:'var(--text-secondary)',fontSize:'.85rem',marginTop:12}}>{d.totalRevenue.marginalCost}</div>
            <div style={{color:'var(--text-muted)',fontSize:'.75rem',marginTop:4}}>SVG device data already collected for fleet operations</div>
          </div>
        </div>
      )}

      {tab === 'oem' && (
        <div className="content-grid">
          <div className="card" style={{padding:'1rem',marginBottom:'1rem'}}>
            <h4 style={{color:'var(--text-primary)',marginBottom:'.75rem'}}>Subscription Tiers</h4>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem'}}>
              {(om.tiers || []).map((t: any) => (
                <div key={t.tier} style={{padding:'1rem',border:'1px solid var(--border)',borderRadius:8}}>
                  <div style={{fontWeight:700,color:'var(--cyan)'}}>{t.tier}</div>
                  <div style={{fontSize:'1.2rem',fontWeight:800,color:'var(--emerald)',margin:'4px 0'}}>${t.pricePerVehicleYear}/veh/yr</div>
                  {(t.features || []).map((f: string, i: number) => <div key={i} style={{fontSize:'.75rem',color:'var(--text-muted)'}}>• {f}</div>)}
                </div>
              ))}
            </div>
          </div>
          <TableCard title="OEM Subscribers" count={om.subscribers?.length}>
            <table className="data-table"><thead><tr><th>OEM</th><th>Tier</th><th>Vehicles</th><th>Annual Revenue ($)</th></tr></thead>
            <tbody>{(om.subscribers || []).map((s: any) => (
              <tr key={s.oem}><td style={{fontWeight:600}}>{s.oem}</td>
              <td><Badge status={s.tier==='Enterprise'?'active':s.tier==='Professional'?'warning':'default'} label={s.tier} /></td>
              <td>{s.vehicles?.toLocaleString()}</td><td style={{color:'var(--emerald)'}}>${s.annualRevenue?.toLocaleString()}</td></tr>
            ))}</tbody></table>
          </TableCard>
        </div>
      )}

      {tab === 'city' && (
        <div className="content-grid">
          <TableCard title="Active City Clients" count={ci.clients?.length}>
            <table className="data-table"><thead><tr><th>City</th><th>Authority</th><th>Contract ($/yr)</th><th>Data Feeds</th><th>Satisfaction</th><th>Status</th></tr></thead>
            <tbody>{(ci.clients || []).map((c: any) => (
              <tr key={c.city}><td style={{fontWeight:600}}>{c.city}</td><td>{c.authority}</td>
              <td style={{color:'var(--emerald)'}}>${c.contractUsd?.toLocaleString()}</td>
              <td>{c.dataFeeds}</td><td>{c.satisfaction ? `${c.satisfaction}/5` : '—'}</td>
              <td><Badge status={c.status==='active'?'active':'warning'} label={c.status} /></td></tr>
            ))}</tbody></table>
          </TableCard>
          <TableCard title="Sales Pipeline" count={ci.pipeline?.length}>
            <table className="data-table"><thead><tr><th>City</th><th>Est. Value (AED)</th><th>Probability</th><th>Stage</th></tr></thead>
            <tbody>{(ci.pipeline || []).map((p: any) => (
              <tr key={p.city}><td>{p.city}</td><td>{p.estimatedAed?.toLocaleString()}</td>
              <td>{p.probability}%</td><td><Badge status="default" label={p.stage.replace(/_/g,' ')} /></td></tr>
            ))}</tbody></table>
          </TableCard>
        </div>
      )}

      {tab === 'marketplace' && (
        <TableCard title="Data Products" count={mk.products?.length}>
          <table className="data-table"><thead><tr><th>Product</th><th>Buyers</th><th>Subscribers</th><th>Monthly Revenue (AED)</th></tr></thead>
          <tbody>{(mk.products || []).map((p: any, i: number) => (
            <tr key={i}><td style={{fontWeight:600}}>{p.name}</td><td>{p.buyers}</td>
            <td>{p.subscribers}</td><td style={{color:'var(--emerald)'}}>{p.monthlyRevenueAed?.toLocaleString()}</td></tr>
          ))}</tbody></table>
        </TableCard>
      )}

      {tab === 'projections' && (
        <TableCard title="3-Year Revenue Projection (AED)" count={3}>
          <table className="data-table"><thead><tr><th>Year</th><th>OEM</th><th>City SaaS</th><th>Marketplace</th><th>Total</th><th>Growth</th></tr></thead>
          <tbody>{(pj.projections || []).map((p: any) => (
            <tr key={p.year}><td style={{fontWeight:700}}>Year {p.year}</td>
            <td>{(p.oemAed/1e6).toFixed(1)}M</td><td>{(p.cityAed/1e6).toFixed(1)}M</td>
            <td>{(p.marketplaceAed/1e6).toFixed(1)}M</td>
            <td style={{color:'var(--emerald)',fontWeight:700}}>{(p.totalAed/1e6).toFixed(1)}M</td>
            <td>{p.growthPct ? `+${p.growthPct}%` : '—'}</td></tr>
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
