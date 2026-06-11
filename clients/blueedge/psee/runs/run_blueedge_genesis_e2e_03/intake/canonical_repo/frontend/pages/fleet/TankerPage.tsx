// TankerPage — Oil & Gas Tanker Operations (Enhanced Session 26)
// Cargo charts, HAZMAT gauges, route map, delivery pipeline

import React, { useState } from 'react';
import { useApi, useApiMutation, useToast, useMediaQuery } from '@/hooks';
import { useFleetPositions, useAlertStream, useSocketContext, useSocketEvent } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Modal from '@/components/ui/Modal';
import FormField from '@/components/ui/FormField';
import ExportToolbar from '@/components/ui/ExportToolbar';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import TabBar from '@/components/ui/TabBar';
import CrudDataTable from '@/components/data/CrudDataTable';
import DetailView from '@/components/data/DetailView';
import TableCard from '@/components/data/TableCard';
import PageHeader from '@/components/layout/PageHeader';
import ChartCard from '@/components/charts/ChartCard';
import TrendCard from '@/components/charts/TrendCard';
import GaugeChart from '@/components/charts/GaugeChart';
import TimeRangeSelector from '@/components/charts/TimeRangeSelector';
import MapPanel from '@/components/charts/MapPanel';
import { fmtDate, fmtTime, fmtPct, fmt } from '@/utils';

const TABS = [
  { id:'overview', label:'Overview' },
  { id:'manifests', label:'Cargo Manifests' },
  { id:'monitoring', label:'Tank Monitoring' },
  { id:'transfers', label:'Transfers' },
  { id:'safety', label:'Safety Systems' },
  { id:'hazmat', label:'HAZMAT' },
  { id:'products', label:'Products' },
  { id:'inventory', label:'Inventory' },
  { id:'routes', label:'Route Map' },
];

// Mock tanker routes (Dubai oil terminals)
const TANKER_ROUTES = [
  { points:[[25.0143,55.0652],[25.0412,55.1183],[25.1008,55.1621],[25.1725,55.2247]] as [number,number][], color:'#f59e0b', label:'JAFZA → Al Quoz' },
  { points:[[25.0143,55.0652],[24.9538,55.0143],[24.8890,54.8937],[24.4539,54.6518]] as [number,number][], color:'#ef4444', label:'JAFZA → Ruwais (HAZMAT)' },
  { points:[[25.2644,55.3117],[25.2048,55.2708],[25.1725,55.2247]] as [number,number][], color:'#3b82f6', label:'Hamriyah → Al Quoz' },
];

const TANKER_MARKERS = [
  { lat:25.0143, lng:55.0652, label:'JAFZA Terminal 4', color:'#f59e0b', icon:'🛢️', popup:'JAFZA Terminal 4 — Loading Bay A-D' },
  { lat:25.1725, lng:55.2247, label:'ENOC Al Quoz Depot', color:'#22c55e', icon:'⛽', popup:'ENOC Al Quoz Depot — Unloading' },
  { lat:24.4539, lng:54.6518, label:'ADNOC Ruwais', color:'#ef4444', icon:'🏭', popup:'ADNOC Ruwais Refinery — HAZMAT Zone' },
  { lat:25.2644, lng:55.3117, label:'Hamriyah Port', color:'#3b82f6', icon:'🚢', popup:'Hamriyah Free Zone Port' },
  { lat:25.08, lng:55.15, label:'TK-DXB-007', color:'#f59e0b', icon:'🚛', popup:'TK-DXB-007 — In Transit<br/>Driver: Ahmad Al-Rashid<br/>Cargo: Diesel 32,000L' },
  { lat:25.18, lng:55.24, label:'TK-DXB-003', color:'#22c55e', icon:'🚛', popup:'TK-DXB-003 — Delivering<br/>Driver: Saeed Al-Maktoum<br/>Cargo: Jet Fuel 28,000L' },
];

export default function TankerPage() {
  const manifests = useApi('/api/v1/tanker/manifests?limit=20');
  const stats = useApi('/api/v1/tanker/manifests/stats');
  const hazmat = useApi('/api/v1/tanker/manifests/active');
  // New tanker operations API hooks
  const fleetTanks = useApi('/api/v1/tanker/monitoring/fleet');
  const safetyDash = useApi('/api/v1/tanker/safety/dashboard');
  const safetyEvents = useApi('/api/v1/tanker/safety/events');
  const hazmatDash = useApi('/api/v1/tanker/hazmat/dashboard');
  const hazmatPermits = useApi('/api/v1/tanker/hazmat/permits');
  const hazmatRoutes = useApi('/api/v1/tanker/hazmat/routes');
  const products = useApi('/api/v1/tanker/products');
  const compatibility = useApi('/api/v1/tanker/products/compatibility');
  const inventory = useApi('/api/v1/tanker/inventory');
  const lossTracking = useApi('/api/v1/tanker/inventory/loss-tracking');
  const rows = Array.isArray(manifests.data) ? manifests.data : manifests.data?.items || [];
  const s = stats.data || {};
  const h = hazmat.data || {};
  const { mutate, saving } = useApiMutation();

  // WebSocket — live tanker positions + alerts
  const { connected: wsConnected } = useSocketContext();
  const { positions: tankerPositions } = useFleetPositions('tanker');
  const { alerts: tankerAlerts, count: alertCount } = useAlertStream({ maxItems: 10 });
  useSocketEvent('coldchain:breach', (ev) => { /* auto-refetched via alert stream */ }, []);
  const [tab, setTab] = useState('overview');
  const [range, setRange] = useState('30d');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [modal, setModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const toast = useToast();

  const resetForm = (item?: any) => {
    setForm(item ? { ...item } : { vehicleId:'', manifestNumber:'', status:'draft', customerName:'', originFacility:'', destinationFacility:'', totalVolumeL:'' });
  };
  const openCreate = () => { resetForm(); setModal('create'); };
  const openEdit = (row: any) => { setSelected(row); resetForm(row); setModal('edit'); };
  const openView = (row: any) => { setSelected(row); setModal('view'); };
  const handleSave = async () => {
    const isEdit = modal === 'edit';
    const payload = { ...form };
    if (payload.totalVolumeL) payload.totalVolumeL = parseFloat(payload.totalVolumeL);
    const res = await mutate(isEdit ? 'PUT' : 'POST', isEdit ? `/api/v1/tanker/manifests/${selected.id}` : '/api/v1/tanker/manifests', payload);
    if (res.ok) { toast.show(`Manifest ${isEdit ? 'updated' : 'created'}`, 'success'); setModal(null); manifests.refetch(); }
    else toast.show(res.error, 'error');
  };
  const set = (k: any) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  // Chart data
  const deliveryVolumeData = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [
      { label:'Diesel', data:[280,310,295,340,320,360,380,410,390,420,450,470], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.08)', fill:true, tension:0.4, borderWidth:2 },
      { label:'Jet Fuel', data:[150,180,160,200,190,210,230,250,240,260,270,290], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', fill:true, tension:0.4, borderWidth:2 },
      { label:'LPG', data:[60,70,65,80,75,85,90,95,88,100,105,110], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', fill:true, tension:0.4, borderWidth:2 },
    ],
  };

  const deliveryStatus = {
    labels: ['Delivered','In Transit','Loading','Waiting','Rejected'],
    datasets: [{
      data: [s.delivered||142, s.inTransit||8, 3, 5, s.rejected||2],
      backgroundColor: ['rgba(34,197,94,0.75)','rgba(59,130,246,0.75)','rgba(245,158,11,0.75)','rgba(168,85,247,0.75)','rgba(239,68,68,0.75)'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const tankLevels = {
    labels: ['TK-001','TK-003','TK-005','TK-007','TK-009','TK-011','TK-013','TK-015'],
    datasets: [
      { label:'Comp. A (%)', data:[95,72,88,45,0,91,68,82], backgroundColor:'rgba(245,158,11,0.7)', borderRadius:3 },
      { label:'Comp. B (%)', data:[88,68,0,52,0,85,72,78], backgroundColor:'rgba(59,130,246,0.7)', borderRadius:3 },
      { label:'Comp. C (%)', data:[0,65,82,38,0,0,60,0], backgroundColor:'rgba(34,197,94,0.7)', borderRadius:3 },
    ],
  };

  const weeklyDeliveries = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      { label:'Deliveries', data:[12,14,11,15,13,8,5], backgroundColor:'rgba(6,214,214,0.65)', borderRadius:6, borderSkipped:false },
    ],
  };

  return (
    <div>
      <PageHeader title="Tanker Operations" breadcrumb="Tanker" subtitle={`Oil & Gas cargo management${wsConnected ? ` · ${tankerPositions.length} tankers live` : ''}`}
        right={<div style={{display:'flex',gap:8,alignItems:'center'}}>
          {wsConnected && <ConnectionStatus compact />}
          <TimeRangeSelector value={range} onChange={setRange} />
          <ExportToolbar rows={rows} filename="tanker_manifests" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ New Manifest</button>
        </div>} />

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'overview' && <>
        {/* KPI Trend Cards */}
        <div className="stats-grid">
          <TrendCard label="Total Manifests" value={fmt(s.totalManifests || 160)} icon="📋" trend={8.2} trendLabel="vs last month" sparkData={[120,128,135,140,148,155,160]} />
          <TrendCard label="In Transit" value={s.inTransit || 8} color="blue" icon="🚛" sparkData={[5,7,6,8,7,9,8]} />
          <TrendCard label="Delivered" value={fmt(s.delivered || 142)} color="green" icon="✅" trend={12.5} trendLabel="on time" sparkData={[98,105,112,120,128,135,142]} />
          <TrendCard label="Avg Delivery" value={`${s.avgDeliveryTimeHrs || 4.2}h`} icon="⏱️" trend={-8.5} trendLabel="faster" sparkData={[5.1,4.9,4.8,4.6,4.5,4.3,4.2]} />
          <TrendCard label="Total Volume" value="4.8M L" icon="🛢️" trend={6.3} sparkData={[3.8,4.0,4.1,4.3,4.5,4.6,4.8]} />
          <TrendCard label="Discrepancy" value={fmtPct(s.discrepancyRate || 0.3)} color={s.discrepancyRate > 1 ? 'red' : 'green'} icon="⚠️" trend={-15} sparkData={[0.8,0.7,0.6,0.5,0.4,0.35,0.3]} />
        </div>

        {/* Gauges: HAZMAT & Safety */}
        <div className="chart-card" style={{display:'flex', justifyContent:'space-around', alignItems:'center', padding:'20px 16px', flexWrap:'wrap', gap:16}}>
          <GaugeChart value={h.compliantVehicles || 9} max={h.compliantVehicles + (h.nonCompliant || 1) || 10} label="HAZMAT Compliance" thresholds={{red:60,amber:80,green:90}} showTrend="up" />
          <GaugeChart value={98.5} label="ADR Certification" thresholds={{red:80,amber:90,green:95}} showTrend="stable" />
          <GaugeChart value={96.2} label="Spill Prevention" thresholds={{red:85,amber:92,green:95}} showTrend="up" />
          <GaugeChart value={99.1} label="Grounding Verified" thresholds={{red:90,amber:95,green:98}} showTrend="stable" />
          <GaugeChart value={94.8} label="Custody Transfer" thresholds={{red:85,amber:90,green:93}} showTrend="up" />
        </div>
        <div style={{height:14}} />

        {/* Charts */}
        <div className={isMobile ? "" : "grid-2"}>
          <ChartCard title="Delivery Volume by Product (kL)" type="line" data={deliveryVolumeData} height={230}
            options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ y:{ title:{ display:true, text:'kL', color:'#8892a8' } } } }} />
          <ChartCard title="Delivery Status Distribution" type="doughnut" data={deliveryStatus} height={230}
            options={{ plugins:{ legend:{ position:'bottom' as const } }, cutout:'60%' }} />
        </div>
        <div style={{height:14}} />
        <div className={isMobile ? "" : "grid-2"}>
          <ChartCard title="Weekly Deliveries" type="bar" data={weeklyDeliveries} height={200}
            options={{ plugins:{ legend:{ display:false } } }} />
          <ChartCard title="Tank Compartment Fill Levels (%)" type="bar" data={tankLevels} height={200}
            options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ y:{ max:100, title:{ display:true, text:'%', color:'#8892a8' } } } }} />
        </div>
      </>}

      {tab === 'manifests' && <>
        {manifests.loading ? <Loading /> :
          <TableCard title="Cargo Manifests" count={rows.length}>
            <CrudDataTable columns={[
              { label:'Manifest #', render: (r: any) => r.manifestNumber || (r.id||'').slice(0,8) },
              { label:'Customer', key:'customerName' },
              { label:'Volume', render: (r: any) => r.totalVolumeL ? `${fmt(r.totalVolumeL)} L` : '—' },
              { label:'Origin', key:'originFacility' },
              { label:'Destination', key:'destinationFacility' },
              { label:'Status', render: (r: any) => <Badge status={r.status} /> },
            ]} rows={rows} onRowClick={openView} onEdit={openEdit} />
          </TableCard>
        }
      </>}

      {tab === 'monitoring' && <>
        <div className="chart-card" style={{padding:20}}>
          <h4>Real-Time Tank Compartment Monitoring</h4>
          <p style={{color:'var(--text-muted)',fontSize:12,marginBottom:16}}>Live fill levels, temperatures, and pressures across active tankers</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
            {(Array.isArray(fleetTanks.data?.vehicles) ? fleetTanks.data.vehicles : [
              { vehicleId:'TK-DXB-007', product:'Diesel', loadPct:95, tempC:42, pressureKpa:1.2, status:'en_route' },
              { vehicleId:'TK-DXB-003', product:'Jet Fuel', loadPct:72, tempC:38, pressureKpa:1.1, status:'en_route' },
              { vehicleId:'TK-DXB-011', product:'LPG', loadPct:91, tempC:28, pressureKpa:8.5, status:'loading' },
              { vehicleId:'TK-DXB-005', product:'Diesel', loadPct:12, tempC:44, pressureKpa:1.0, status:'unloaded' },
            ]).map((tk: any) => (
              <div key={tk.vehicleId} className="info-card" style={{padding:14}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                  <span style={{fontWeight:600,color:'var(--text-primary)'}}>{tk.vehicleId}</span>
                  <Badge status={tk.status} />
                </div>
                <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:4}}>Driver: {tk.driver || '—'}</div>
                <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:8}}>Product: {tk.product}</div>
                <div style={{display:'flex',gap:12}}>
                  <GaugeChart value={tk.loadPct || 0} label="Fill %" size={80} thickness={7} thresholds={{red:20,amber:40,green:60}} />
                </div>
                <div style={{marginTop:8,fontSize:11,color:'var(--text-muted)',display:'flex',gap:12}}>
                  <span>🌡️ {tk.tempC ?? '—'}°C</span>
                  <span>⚡ {tk.pressureKpa ?? '—'} kPa</span>
                  <span>📍 {tk.route || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* ═══ TRANSFERS TAB ═══ */}
      {tab === 'transfers' && <>
        <div className="stats-grid">
          <TrendCard label="Today's Transfers" value={fmt(s.todayTransfers || 18)} icon="🔄" color="blue" sparkData={[12,14,16,15,18]} />
          <TrendCard label="Volume Transferred" value={`${fmt(s.todayVolume || 342)}K L`} icon="🛢️" color="green" trend={12} sparkData={[280,295,310,325,342]} />
          <TrendCard label="Avg Transfer Time" value={`${s.avgTransferTimeMin || 47} min`} icon="⏱️" sparkData={[52,50,49,48,47]} trend={-6} trendLabel="faster" />
          <TrendCard label="Loss Rate" value={fmtPct(s.lossRatePct || 0.08)} icon="📉" color="green" trend={-25} sparkData={[0.12,0.11,0.10,0.09,0.08]} />
        </div>

        {/* Active transfer workflow */}
        <div className="chart-card" style={{padding:20,marginBottom:14}}>
          <h4 style={{marginBottom:4}}>Active Loading — TK-2847 at JAFZA Terminal 4</h4>
          <p style={{color:'var(--text-muted)',fontSize:12,marginBottom:16}}>8-step transfer workflow with live safety checks</p>
          <div style={{display:'flex',gap:0,overflowX:'auto',paddingBottom:8}}>
            {['Pre-Check','Grounding','Connect','Loading','Verify','Seal','BOL','Release'].map((step, i) => {
              const state = i < 3 ? 'done' : i === 3 ? 'active' : 'pending';
              return (
                <div key={step} style={{flex:1,minWidth:90,textAlign:'center',position:'relative'}}>
                  <div style={{width:36,height:36,borderRadius:'50%',margin:'0 auto 8px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:600,
                    background: state === 'done' ? 'var(--accent-green)' : state === 'active' ? 'var(--accent-cyan)' : 'var(--card-bg)',
                    color: state !== 'pending' ? '#fff' : 'var(--text-muted)',
                    border: state === 'pending' ? '2px solid var(--border-color)' : 'none',
                  }}>{state === 'done' ? '✓' : i + 1}</div>
                  <div style={{fontSize:11,fontWeight:state === 'active' ? 600 : 400,color: state === 'done' ? 'var(--accent-green)' : state === 'active' ? 'var(--accent-cyan)' : 'var(--text-muted)'}}>{step}</div>
                </div>
              );
            })}
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginTop:16}}>
            <div className="info-card" style={{padding:12}}>
              <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:6}}>Safety Checks</div>
              {['Ground Connection','Vapor Recovery','Overfill Prevention','Fire Suppression','Gas Detection','Static Bonding'].map(c => (
                <div key={c} style={{display:'flex',justifyContent:'space-between',fontSize:11,padding:'3px 0'}}>
                  <span>{c}</span><Badge status="active" label="✓ OK" />
                </div>
              ))}
            </div>
            <div className="info-card" style={{padding:12}}>
              <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:6}}>Transfer Details</div>
              <div style={{fontSize:12}}><strong>Product:</strong> Diesel EN 590</div>
              <div style={{fontSize:12,fontFamily:'var(--font-mono)',color:'var(--accent-cyan)',marginTop:4}}>Flow: 1,240 L/min</div>
              <div style={{fontSize:12,fontFamily:'var(--font-mono)',color:'var(--accent-green)',marginTop:4}}>18,600 / 35,000 L loaded</div>
              <div style={{fontSize:12,marginTop:4}}>ETA: ~13 min remaining</div>
              <div style={{fontSize:12,marginTop:4}}>Operator: Ahmed Al-Rashid</div>
            </div>
            <div className="info-card" style={{padding:12}}>
              <div style={{fontSize:11,color:'var(--text-muted)',marginBottom:6}}>Compartment Fill Progress</div>
              {[{c:'C1',pct:85},{c:'C2',pct:72},{c:'C5',pct:76},{c:'C6',pct:80}].map(x => (
                <div key={x.c} style={{marginBottom:6}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:11,marginBottom:2}}><span>{x.c}</span><span style={{fontFamily:'var(--font-mono)'}}>{x.pct}%</span></div>
                  <div style={{height:6,background:'var(--bg-secondary)',borderRadius:3,overflow:'hidden'}}>
                    <div style={{height:'100%',width:`${x.pct}%`,background:'linear-gradient(90deg,var(--accent-blue),var(--accent-cyan))',borderRadius:3}} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Transfer History */}
        <TableCard title="Transfer History — Today" count={5}>
          <CrudDataTable columns={[
            { label:'Vehicle', render: (r: any) => <span style={{fontWeight:600,fontFamily:'var(--font-mono)'}}>{r.vehicle}</span> },
            { label:'Type', render: (r: any) => <Badge status={r.type === 'loading' ? 'active' : 'completed'} label={r.type} /> },
            { label:'Facility', key:'facility' },
            { label:'Product', key:'product' },
            { label:'Volume', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{fmt(r.volume)} L</span> },
            { label:'Duration', key:'duration' },
            { label:'Operator', key:'operator' },
            { label:'Status', render: (r: any) => <Badge status={r.status} /> },
          ]} rows={[
            { vehicle:'TK-1923', type:'unloading', facility:'ENOC Al Quoz', product:'Gasoline 95', volume:28400, duration:'38 min', operator:'Khalid M.', status:'completed' },
            { vehicle:'TK-3012', type:'loading', facility:'ADNOC Jebel Ali', product:'Diesel EN 590', volume:35000, duration:'42 min', operator:'Fahad S.', status:'completed' },
            { vehicle:'TK-2847', type:'loading', facility:'JAFZA Terminal 4', product:'Diesel EN 590', volume:18600, duration:'In Progress', operator:'Ahmed R.', status:'active' },
            { vehicle:'TK-4501', type:'unloading', facility:'DXB Airport T3', product:'Jet A-1', volume:42000, duration:'51 min', operator:'Saeed A.', status:'completed' },
            { vehicle:'TK-1756', type:'loading', facility:'ENOC Fujairah', product:'Kerosene', volume:30000, duration:'44 min', operator:'Omar B.', status:'completed' },
          ]} />
        </TableCard>
      </>}

      {/* ═══ SAFETY SYSTEMS TAB ═══ */}
      {tab === 'safety' && (() => {
        const sd = safetyDash.data || {};
        const sys = sd.systems || {};
        const roll = sys.rollPrevention || {};
        const leak = sys.leakDetection || {};
        const gas = sys.gasDetection || {};
        const emg = sys.emergency || {};
        const evts24 = sd.events24h || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Safety Score" value={sd.safetyScore || 94.2} icon="🛡️" color="green" trend={sd.safetyScoreDelta || 1.8} sparkData={[90,91,92,93,93.5,94,94.2]} />
            <TrendCard label="Safety Events (24h)" value={evts24.total || 7} icon="⚠️" color="red" sparkData={[12,10,8,9,7,8,7]} />
            <TrendCard label="Roll Stability" value={roll.status || 'OK'} icon="📐" color="green" />
            <TrendCard label="Gas Detections (24h)" value={sd.gasDetections24h || 0} icon="💨" color="green" sparkData={[0,1,0,0,0,0,0]} />
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14,marginBottom:14}}>
            {/* Roll Prevention */}
            <div className="chart-card" style={{padding:16,borderLeft:'3px solid var(--accent-green)'}}>
              <Badge status="active" label={`● ${roll.status || 'Normal'}`} />
              <h4 style={{marginTop:8,marginBottom:4}}>Roll Prevention System</h4>
              <p style={{color:'var(--text-muted)',fontSize:11,marginBottom:12}}>6-axis IMU monitoring lateral acceleration & roll angle</p>
              <div style={{display:'flex',gap:20,justifyContent:'center',marginBottom:12}}>
                <GaugeChart value={((roll.lateralG || 0.18) / (roll.lateralGLimit || 0.35)) * 100} label={`Lat: ${roll.lateralG || 0.18}g`} size={90} thickness={8} thresholds={{red:80,amber:60,green:40}} />
                <GaugeChart value={((roll.rollAngleDeg || 2.4) / (roll.rollAngleLimit || 12)) * 100} label={`Roll: ${roll.rollAngleDeg || 2.4}°`} size={90} thickness={8} thresholds={{red:80,amber:60,green:40}} />
              </div>
              <div style={{fontSize:12,display:'flex',justifyContent:'space-between'}}><span>Speed Limiting</span><span style={{color:'var(--accent-green)'}}>Inactive</span></div>
              <div style={{fontSize:12,display:'flex',justifyContent:'space-between'}}><span>RSC Status</span><span style={{color:'var(--accent-green)'}}>Armed</span></div>
              <div style={{fontSize:12,display:'flex',justifyContent:'space-between'}}><span>Events (30d)</span><span>{roll.events30d || 3}</span></div>
            </div>

            {/* Leak Detection */}
            <div className="chart-card" style={{padding:16,borderLeft:'3px solid var(--accent-green)'}}>
              <Badge status="active" label="● No Leaks" />
              <h4 style={{marginTop:8,marginBottom:4}}>Leak Detection System</h4>
              <p style={{color:'var(--text-muted)',fontSize:11,marginBottom:12}}>Continuous monitoring across seals, valves, and connections</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginBottom:12}}>
                {[{l:'Top Seals',v:leak.topSeals},{l:'Bottom Valves',v:leak.bottomValves},{l:'Connections',v:leak.connections}].map(x => (
                  <div key={x.l} style={{textAlign:'center',background:'var(--bg-secondary)',borderRadius:8,padding:8}}>
                    <div style={{fontSize:10,color:'var(--text-muted)'}}>{x.l}</div>
                    <div style={{fontFamily:'var(--font-mono)',fontSize:14,color:'var(--accent-green)',fontWeight:600}}>{(x.v || 'ok').toUpperCase()}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:12,display:'flex',justifyContent:'space-between'}}><span>Sensors</span><span>{leak.sensorsOnline || 18} / {leak.sensorsTotal || 18} online</span></div>
              <div style={{fontSize:12,display:'flex',justifyContent:'space-between'}}><span>Last Inspection</span><span>{leak.lastInspection || '2 days ago'}</span></div>
              <div style={{fontSize:12,display:'flex',justifyContent:'space-between'}}><span>Leak Events (90d)</span><span>{leak.leakEvents90d || 0}</span></div>
            </div>

            {/* Gas Detection */}
            <div className="chart-card" style={{padding:16,borderLeft:'3px solid var(--accent-green)'}}>
              <Badge status="active" label="● Clear" />
              <h4 style={{marginTop:8,marginBottom:4}}>Gas Detection System</h4>
              <p style={{color:'var(--text-muted)',fontSize:11,marginBottom:12}}>LEL & H₂S monitoring with auto-shutdown</p>
              <div style={{display:'flex',gap:16,justifyContent:'center',marginBottom:12}}>
                <GaugeChart value={((gas.lelPct || 2) / (gas.lelAlarmPct || 20)) * 100} label={`LEL: ${gas.lelPct || 2}%`} size={80} thickness={7} thresholds={{red:80,amber:50,green:30}} />
                <GaugeChart value={((gas.h2sPpm || 0.5) / (gas.h2sAlarmPpm || 10)) * 100} label={`H₂S: ${gas.h2sPpm || 0.5}ppm`} size={80} thickness={7} thresholds={{red:80,amber:50,green:30}} />
                <GaugeChart value={((gas.o2Pct || 20.8) / 23.5) * 100} label={`O₂: ${gas.o2Pct || 20.8}%`} size={80} thickness={7} thresholds={{red:30,amber:50,green:80}} />
              </div>
              <div style={{fontSize:12,display:'flex',justifyContent:'space-between'}}><span>Auto-Shutdown</span><span style={{color:'var(--accent-green)'}}>Armed</span></div>
              <div style={{fontSize:12,display:'flex',justifyContent:'space-between'}}><span>Calibration</span><span>Valid ({gas.calibrationDaysRemaining || 12}d remain)</span></div>
            </div>
          </div>

          {/* Emergency + Event Log */}
          <div className={isMobile ? "" : "grid-2"}>
            <div className="chart-card" style={{padding:16}}>
              <h4 style={{color:'var(--accent-red)',marginBottom:12}}>Emergency Systems</h4>
              <div style={{display:'flex',alignItems:'center',gap:20}}>
                <button onClick={() => { if (confirm('TRIGGER E-STOP? This will activate emergency protocol.')) toast.show('E-STOP activated!', 'error'); }}
                  style={{width:80,height:80,borderRadius:'50%',background:'linear-gradient(135deg,#dc2626,#991b1b)',border:'3px solid #7f1d1d',color:'#fff',fontSize:11,fontWeight:700,cursor:'pointer',textTransform:'uppercase',lineHeight:1.2,boxShadow:'0 4px 20px rgba(220,38,38,0.4)'}}>
                  E-STOP
                </button>
                <div style={{flex:1,fontSize:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span>E-Stop Status</span><Badge status="active" label="● Ready" /></div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span>Fire Suppression</span><Badge status="active" label="● Standby" /></div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span>Emergency Contacts</span><span>{emg.emergencyContacts || 5} configured</span></div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:4}}><span>NCEMA Compliance</span><Badge status="active" label="✓ Valid" /></div>
                </div>
              </div>
            </div>
            <TableCard title="Safety Event Log (24h)" count={(safetyEvents.data || []).length}>
              <CrudDataTable columns={[
                { label:'Time', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',fontSize:11}}>{fmtTime(r.createdAt)}</span> },
                { label:'Vehicle', key:'vehicleId' },
                { label:'Event', key:'description' },
                { label:'Severity', render: (r: any) => <Badge status={r.severity === 'critical' ? 'rejected' : r.severity === 'high' ? 'expiring' : 'active'} label={r.severity} /> },
                { label:'Resolved', render: (r: any) => r.isResolved ? <Badge status="active" label="✓" /> : <Badge status="expiring" label="Pending" /> },
              ]} rows={Array.isArray(safetyEvents.data) ? safetyEvents.data : []} />
            </TableCard>
          </div>
        </>;
      })()}

      {/* ═══ HAZMAT TAB ═══ */}
      {tab === 'hazmat' && (() => {
        const hd = hazmatDash.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="HAZMAT Compliance" value={fmtPct(hd.compliancePct || 98)} icon="☣️" color="green" />
            <TrendCard label="Active Permits" value={hd.activePermits || 42} icon="📋" color="blue" sparkData={[38,39,40,41,42]} />
            <TrendCard label="Route Deviations (30d)" value={hd.routeDeviations30d || 2} icon="🗺️" color="amber" trend={-(hd.routeDeviationsDelta || 4)} trendLabel="vs last month" sparkData={[6,5,4,3,2]} />
            <TrendCard label="Certified Drivers" value={hd.certifiedDrivers || 38} icon="🎓" color="green" sparkData={[34,35,36,37,38]} />
          </div>

          <div className={isMobile ? "" : "grid-2"}>
            <div className="chart-card" style={{padding:16}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
                <h4>HAZMAT Permits & Licenses</h4>
                <button className="btn btn-cyan btn-sm">+ New Permit</button>
              </div>
              {(Array.isArray(hazmatPermits.data) ? hazmatPermits.data : []).map((p: any) => (
                <div key={p.id} style={{padding:12,marginBottom:8,borderRadius:8,background:'var(--bg-secondary)',borderLeft:`3px solid ${p.status === 'expiring' ? 'var(--accent-amber)' : 'var(--accent-green)'}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>{p.authority} — Class {p.hazmatClasses} {p.type}</div>
                      <div style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>Permit #: {p.permitNumber}</div>
                    </div>
                    <Badge status={p.status === 'expiring' ? 'expiring' : 'active'} label={`${p.status} (${p.daysRemaining}d)`} />
                  </div>
                </div>
              ))}
            </div>

            <TableCard title="Approved HAZMAT Routes" count={(hazmatRoutes.data || []).length}>
              <CrudDataTable columns={[
                { label:'Route', key:'name' },
                { label:'Class', render: (r: any) => <Badge status="rejected" label={`Class ${r.hazmatClasses}`} /> },
                { label:'Restrictions', render: (r: any) => <span style={{fontSize:11}}>{r.restrictions}</span> },
                { label:'Deviations', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.deviationCount30d}</span> },
                { label:'Status', render: (r: any) => <Badge status="active" label={r.status} /> },
              ]} rows={Array.isArray(hazmatRoutes.data) ? hazmatRoutes.data : []} />
            </TableCard>
          </div>

          {/* Placards & Emergency Docs */}
          <div className={isMobile ? "" : "grid-2"} style={{marginTop:14}}>
            <div className="chart-card" style={{padding:16}}>
              <h4 style={{marginBottom:12}}>Active Placards</h4>
              <div style={{display:'flex',gap:24,justifyContent:'center'}}>
                {[{cls:'3',label:'Flammable Liquid',un:'UN 1202/1863',color:'var(--accent-red)'},{cls:'8',label:'Corrosive',un:'UN 1830',color:'var(--accent-amber)'}].map(p => (
                  <div key={p.cls} style={{textAlign:'center'}}>
                    <div style={{width:60,height:60,transform:'rotate(45deg)',border:`3px solid ${p.color}`,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',borderRadius:4}}>
                      <span style={{transform:'rotate(-45deg)',fontSize:20,fontWeight:700,color:p.color}}>{p.cls}</span>
                    </div>
                    <div style={{fontSize:12,fontWeight:600}}>{p.label}</div>
                    <div style={{fontSize:10,color:'var(--text-muted)'}}>{p.un}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-card" style={{padding:16}}>
              <h4 style={{marginBottom:12}}>Emergency Documentation</h4>
              {[{icon:'📋',title:'Safety Data Sheets (SDS)',sub:'8 products • Updated Feb 2026'},{icon:'🚨',title:'Emergency Response Guide (ERG)',sub:'2024 Edition • Guides 127, 128, 131, 153'},{icon:'📄',title:'Shipping Papers',sub:'Auto-generated per trip'},{icon:'🎓',title:'Driver Certifications',sub:'38 certified • 2 expiring soon'}].map(d => (
                <div key={d.title} style={{display:'flex',alignItems:'center',gap:10,padding:8,background:'var(--bg-secondary)',borderRadius:6,marginBottom:6,cursor:'pointer'}}>
                  <span style={{fontSize:18}}>{d.icon}</span>
                  <div><div style={{fontSize:12,fontWeight:600}}>{d.title}</div><div style={{fontSize:10,color:'var(--text-muted)'}}>{d.sub}</div></div>
                </div>
              ))}
            </div>
          </div>
        </>;
      })()}

      {/* ═══ PRODUCTS TAB ═══ */}
      {tab === 'products' && <>
        <TableCard title="Product Registry — Master Data" count={(products.data || []).length} action={<button className="btn btn-cyan btn-sm">+ Add Product</button>}>
          <CrudDataTable columns={[
            { label:'Product', render: (r: any) => <span style={{fontWeight:600}}>{r.name}</span> },
            { label:'UN Number', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.unNumber || '—'}</span> },
            { label:'Class', render: (r: any) => r.hazmatClass ? <Badge status="rejected" label={`Class ${r.hazmatClass}`} /> : <Badge status="active" label="Non-DG" /> },
            { label:'Flash Point', render: (r: any) => r.flashPointC != null ? `${r.flashPointC}°C` : '—' },
            { label:'Density (kg/L)', render: (r: any) => `${r.densityMin}–${r.densityMax}` },
            { label:'Max Temp', render: (r: any) => r.maxTempC ? `${r.maxTempC}°C` : '—' },
            { label:'Compatibility', key:'compatibilityGroup' },
            { label:'Status', render: (r: any) => <Badge status={r.isActive ? 'active' : 'inactive'} /> },
          ]} rows={Array.isArray(products.data) ? products.data : []} />
        </TableCard>
        {compatibility.data?.matrix && <div className="chart-card" style={{padding:16,marginTop:14}}>
          <h4 style={{marginBottom:12}}>Product Compatibility Matrix</h4>
          <div style={{overflowX:'auto'}}>
            <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
              <thead><tr><th style={{padding:8,textAlign:'left',borderBottom:'1px solid var(--border-color)'}}>Product</th>
                {(compatibility.data.products || []).map((p: string) => <th key={p} style={{padding:8,textAlign:'center',borderBottom:'1px solid var(--border-color)',fontSize:10}}>{p}</th>)}
              </tr></thead>
              <tbody>{Object.entries(compatibility.data.matrix || {}).map(([product, row]: any) => (
                <tr key={product}><td style={{padding:8,fontWeight:600,borderBottom:'1px solid var(--border-color)'}}>{product}</td>
                  {(compatibility.data.products || []).map((p2: string) => {
                    const val = row[p2];
                    return <td key={p2} style={{padding:8,textAlign:'center',borderBottom:'1px solid var(--border-color)'}}>
                      <Badge status={val === 'ok' ? 'active' : val === 'caution' ? 'expiring' : 'rejected'} label={val === 'ok' ? '✓' : val === 'caution' ? '⚠' : '✗'} />
                    </td>;
                  })}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>}
      </>}

      {/* ═══ INVENTORY TAB ═══ */}
      {tab === 'inventory' && (() => {
        const inv = inventory.data || {};
        const loss = lossTracking.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Total Inventory" value={`${fmt(Math.round((inv.totalInventoryL || 562800) / 1000))}K L`} icon="🛢️" color="blue" sparkData={[520,535,548,555,562]} />
            <TrendCard label="Diesel EN 590" value={`${fmt(Math.round((inv.dieselL || 285000) / 1000))}K L`} icon="⛽" color="green" sparkData={[260,268,275,280,285]} />
            <TrendCard label="Jet A-1" value={`${fmt(Math.round((inv.jetA1L || 168000) / 1000))}K L`} icon="✈️" color="amber" sparkData={[150,155,160,165,168]} />
            <TrendCard label="Loss Rate (MTD)" value={fmtPct(inv.lossRateMtdPct || 0.06)} icon="📉" color="green" trend={-50} trendLabel="vs target 0.1%" sparkData={[0.10,0.09,0.08,0.07,0.06]} />
          </div>
          <TableCard title="Current Inventory by Vehicle" count={(inv.vehicles || []).length}
            action={<div style={{display:'flex',gap:8}}><button className="btn btn-sm">Reconciliation</button><button className="btn btn-sm btn-cyan">Export</button></div>}>
            <CrudDataTable columns={[
              { label:'Vehicle', render: (r: any) => <span style={{fontWeight:600,fontFamily:'var(--font-mono)'}}>{r.vehicleId}</span> },
              { label:'Product', key:'product' },
              { label:'Capacity', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{fmt(r.capacityL)} L</span> },
              { label:'Current', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{fmt(r.currentL)} L</span> },
              { label:'Load %', render: (r: any) => <Badge status={r.loadPct >= 80 ? 'active' : r.loadPct >= 30 ? 'expiring' : r.loadPct > 0 ? 'rejected' : 'inactive'} label={`${r.loadPct}%`} /> },
              { label:'Temp', render: (r: any) => r.tempC != null ? `${r.tempC}°C` : '—' },
              { label:'Last Reconciled', render: (r: any) => fmtTime(r.lastReconciled) },
              { label:'Variance', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color: Math.abs(r.variancePct) > 0.05 ? 'var(--accent-amber)' : 'var(--accent-green)'}}>{r.variancePct}%</span> },
            ]} rows={Array.isArray(inv.vehicles) ? inv.vehicles : []} />
          </TableCard>
          {loss.trend && <div className="chart-card" style={{marginTop:14}}>
            <ChartCard title="Product Loss Trend (%)" type="line" height={180} data={{
              labels: loss.trend.map((t: any) => t.date?.slice(5)),
              datasets: [{ label:'Loss %', data: loss.trend.map((t: any) => t.lossPct), borderColor:'var(--accent-amber)', backgroundColor:'rgba(245,158,11,0.08)', fill:true, tension:0.4, borderWidth:2 }],
            }} options={{ scales:{ y:{ min:0, max:0.15, title:{ display:true, text:'%' } } } }} />
          </div>}
        </>;
      })()}

      {tab === 'routes' && <>
        <MapPanel
          title="Active Tanker Routes — Dubai & Abu Dhabi"
          markers={TANKER_MARKERS}
          routes={TANKER_ROUTES}
          zones={[
            { lat:25.0143, lng:55.0652, radius:1500, color:'#f59e0b', label:'JAFZA Loading Zone' },
            { lat:25.1725, lng:55.2247, radius:800, color:'#22c55e', label:'Al Quoz Depot' },
            { lat:24.4539, lng:54.6518, radius:2000, color:'#ef4444', label:'Ruwais HAZMAT Zone' },
          ]}
          center={[25.05, 55.1]}
          zoom={10}
          height={420}
          showControls
        />
      </>}

      {/* Modals (unchanged) */}
      <Modal open={modal === 'view'} onClose={() => setModal(null)} title={`Manifest — ${selected?.manifestNumber || ''}`} lg>
        {selected && <DetailView items={[
          { label:'Manifest #', value:selected.manifestNumber },
          { label:'Vehicle ID', value:(selected.vehicleId||'').slice(0,12) },
          { label:'Trip ID', value:selected.tripId ? selected.tripId.slice(0,12) : null },
          { label:'Customer', value:selected.customerName },
          { label:'Origin', value:selected.originFacility },
          { label:'Destination', value:selected.destinationFacility },
          { label:'Total Volume', value:selected.totalVolumeL ? `${fmt(selected.totalVolumeL)} L` : null },
          { label:'Status', value:selected.status },
          { label:'Loaded At', value:fmtTime(selected.loadedAt) },
          { label:'Delivered At', value:fmtTime(selected.deliveredAt) },
          { label:'Created', value:fmtDate(selected.createdAt) },
        ]} />}
      </Modal>
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Edit Manifest' : 'Create Cargo Manifest'}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleSave} disabled={saving || !form.vehicleId}>{saving ? 'Saving...' : modal === 'edit' ? 'Update' : 'Create Manifest'}</button>
        </>}>
        <div className="form-grid">
          <FormField label="Manifest Number" value={form.manifestNumber} onChange={set('manifestNumber')} placeholder="MAN-2025-001" required />
          <FormField label="Vehicle ID" value={form.vehicleId} onChange={set('vehicleId')} placeholder="Tanker Vehicle UUID" required />
          <FormField label="Customer Name" value={form.customerName} onChange={set('customerName')} placeholder="ADNOC, ENOC..." />
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={['draft','confirmed','in_transit','delivered','rejected']} />
          <FormField label="Origin Facility" value={form.originFacility} onChange={set('originFacility')} placeholder="Jebel Ali Refinery" />
          <FormField label="Destination" value={form.destinationFacility} onChange={set('destinationFacility')} placeholder="ENOC Depot, Al Quoz" />
          <FormField label="Total Volume (L)" type="number" value={form.totalVolumeL} onChange={set('totalVolumeL')} placeholder="32000" />
          <FormField label="Trip ID" value={form.tripId} onChange={set('tripId')} placeholder="Linked Trip UUID" />
        </div>
      </Modal>
      <toast.Toast />
    </div>
  );
}
