// TaxiPage — Taxi Operations (Enhanced Session 26)
// Demand charts, revenue trends, surge pricing viz, driver ratings

import React, { useState } from 'react';
import { useApi, useApiMutation, useToast, useMediaQuery } from '@/hooks';
import { useFleetPositions, useSocketContext } from '@/socket';
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
import { fmtCur, fmt, fmtPct, fmtDate } from '@/utils';

const TABS = [
  { id:'dashboard', label:'Dashboard' },
  { id:'trips', label:'Recent Trips' },
  { id:'drivers', label:'Drivers' },
  { id:'dispatch', label:'Dispatch Board' },
  { id:'zones', label:'Zones & Surge' },
  { id:'payments', label:'Payments' },
  { id:'ratings', label:'Ratings' },
  { id:'medallions', label:'Medallions' },
  { id:'livemap', label:'Live Map' },
];

export default function TaxiPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const stats = useApi('/api/v1/taxi/stats');
  const active = useApi('/api/v1/taxi/trips/active');
  const trips = useApi('/api/v1/taxi/trips?limit=20');
  // New taxi operations API hooks
  const drivers = useApi('/api/v1/taxi/drivers');
  const leaderboard = useApi('/api/v1/taxi/drivers/leaderboard');
  const zones = useApi('/api/v1/taxi/zones');
  const surgeSummary = useApi('/api/v1/taxi/zones/surge');
  const paymentDash = useApi('/api/v1/taxi/payments/dashboard');
  const dispatchBoard = useApi('/api/v1/taxi/dispatch/board');
  const ratingDash = useApi('/api/v1/taxi/ratings/dashboard');
  const medallions = useApi('/api/v1/taxi/medallions/registry');
  const compliance = useApi('/api/v1/taxi/compliance');
  const liveFleet = useApi('/api/v1/taxi/fleet/live');
  const s = stats.data || {};
  const activeRows = Array.isArray(active.data) ? active.data : [];
  const tripRows = Array.isArray(trips.data) ? trips.data : trips.data?.items || [];
  const { mutate, saving } = useApiMutation();
  const { connected: wsConnected } = useSocketContext();
  const { positions: taxiPositions } = useFleetPositions('taxi');
  const [tab, setTab] = useState('dashboard');
  const [range, setRange] = useState('24h');
  const [modal, setModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const toast = useToast();

  const resetForm = (item?: any) => {
    setForm(item ? { ...item } : { vehicleId:'', driverId:'', status:'requested', bookingType:'app_dispatch', pickupAddress:'', dropoffAddress:'', paymentMethod:'card', baseFare:'', totalFare:'' });
  };
  const openCreate = () => { resetForm(); setModal('create'); };
  const openView = (row: any) => { setSelected(row); setModal('view'); };
  const handleSave = async () => {
    const payload = { ...form };
    ['baseFare','totalFare'].forEach(k => { if (payload[k]) payload[k] = parseFloat(payload[k]); });
    const res = await mutate('POST', '/api/v1/taxi/trips', payload);
    if (res.ok) { toast.show('Ride dispatched', 'success'); setModal(null); trips.refetch(); }
    else toast.show(res.error, 'error');
  };
  const set = (k: any) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  // Charts
  const hourlyDemand = {
    labels: ['6AM','7','8','9','10','11','12PM','1','2','3','4','5','6','7','8','9','10','11'],
    datasets: [
      { label:'Rides', data:[12,45,82,65,38,42,55,48,35,40,52,78,95,85,72,58,42,25], backgroundColor:'rgba(6,214,214,0.55)', borderColor:'#06d6d6', borderWidth:1, borderRadius:3 },
    ],
  };

  const revenueTrend = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      { label:'Revenue (AED)', data:[18500,21200,19800,23400,26800,32500,28900], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', fill:true, tension:0.4, borderWidth:2 },
      { label:'Avg Fare', data:[35,38,36,42,45,52,48].map(v => v * 100), borderColor:'#f59e0b', borderDash:[5,5], tension:0.4, borderWidth:2, yAxisID:'y1' },
    ],
  };

  const bookingTypes = {
    labels: ['App Dispatch','Street Hail','Airport','Corporate','Phone'],
    datasets: [{
      data: [45,22,18,10,5],
      backgroundColor: ['rgba(6,214,214,0.75)','rgba(245,158,11,0.75)','rgba(59,130,246,0.75)','rgba(168,85,247,0.75)','rgba(34,197,94,0.75)'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  };

  const ratingDist = {
    labels: ['5 ⭐','4 ⭐','3 ⭐','2 ⭐','1 ⭐'],
    datasets: [{
      data: [68,22,7,2,1],
      backgroundColor: ['rgba(34,197,94,0.7)','rgba(132,204,22,0.7)','rgba(245,158,11,0.7)','rgba(249,115,22,0.7)','rgba(239,68,68,0.7)'],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  return (
    <div>
      <PageHeader title="Taxi Operations" breadcrumb="Taxi" subtitle={`Ride-hail dispatch${wsConnected ? ` · ${taxiPositions.length} taxis live` : ''}`}
        right={<div style={{display:'flex',gap:8,alignItems:'center'}}>
          {wsConnected && <ConnectionStatus compact />}
          <TimeRangeSelector value={range} onChange={setRange} options={[{label:'Live',value:'live'},{label:'24h',value:'24h'},{label:'7d',value:'7d'},{label:'30d',value:'30d'}]} />
          <ExportToolbar rows={tripRows} filename="taxi_trips" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ New Ride</button>
        </div>} />

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'dashboard' && <>
        <div className="stats-grid">
          <TrendCard label="Trips Today" value={fmt(s.totalTripsToday || 387)} color="cyan" icon="🚕" trend={12.3} trendLabel="vs yesterday" sparkData={[310,325,340,355,365,378,387]} />
          <TrendCard label="Active Rides" value={activeRows.length || 23} color="green" icon="🟢" sparkData={[18,20,22,25,23,21,23]} />
          <TrendCard label="Revenue Today" value={fmtCur(s.revenueToday || 28900)} color="green" icon="💰" trend={8.7} sparkData={[22000,23500,24800,26100,27200,28000,28900]} />
          <TrendCard label="Avg Wait Time" value={s.avgWaitTime || '4.2 min'} icon="⏳" trend={-15.3} trendLabel="faster" sparkData={[6.1,5.8,5.2,4.9,4.5,4.3,4.2]} />
          <TrendCard label="Avg Rating" value="4.7 ⭐" icon="⭐" trend={2.1} sparkData={[4.5,4.5,4.6,4.6,4.7,4.7,4.7]} />
          <TrendCard label="Surge Areas" value={s.surgeZones || 3} color="amber" icon="📈" sparkData={[5,4,3,4,3,2,3]} />
        </div>

        <div className="chart-card" style={{display:'flex', justifyContent:'space-around', alignItems:'center', padding:'20px', flexWrap:'wrap', gap:16}}>
          <GaugeChart value={94.2} label="Driver Utilization" thresholds={{red:70,amber:82,green:90}} showTrend="up" />
          <GaugeChart value={4.7} max={5} unit="" label="Avg Rating" color="#f59e0b" showTrend="up" />
          <GaugeChart value={96.5} label="App Uptime" thresholds={{red:95,amber:98,green:99}} showTrend="stable" />
          <GaugeChart value={87.3} label="Pickup Accuracy" thresholds={{red:75,amber:82,green:85}} showTrend="up" />
        </div>
        <div style={{height:14}} />

        <div className="grid-2">
          <ChartCard title="Hourly Ride Demand" type="bar" data={hourlyDemand} height={220}
            options={{ plugins:{ legend:{ display:false } }, scales:{ y:{ title:{ display:true, text:'Rides', color:'#8892a8' } } } }} />
          <ChartCard title="Weekly Revenue & Avg Fare" type="line" data={revenueTrend} height={220}
            options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ y:{ title:{ display:true, text:'AED', color:'#8892a8' } }, y1:{ position:'right' as const, grid:{ drawOnChartArea:false }, title:{ display:true, text:'Avg Fare ×100', color:'#8892a8' } } } }} />
        </div>
        <div style={{height:14}} />
        <div className="grid-2">
          <ChartCard title="Booking Type Distribution" type="doughnut" data={bookingTypes} height={200}
            options={{ plugins:{ legend:{ position:'bottom' as const } }, cutout:'60%' }} />
          <ChartCard title="Rating Distribution (%)" type="bar" data={ratingDist} height={200}
            options={{ indexAxis:'y' as const, plugins:{ legend:{ display:false } }, scales:{ x:{ title:{ display:true, text:'%', color:'#8892a8' } } } }} />
        </div>
      </>}

      {tab === 'trips' && <>
        {trips.loading ? <Loading /> :
          <TableCard title="Recent Taxi Trips" count={tripRows.length}>
            <CrudDataTable columns={[
              { label:'Trip ID', render: (r: any) => (r.id||'').slice(0,8) },
              { label:'Booking', render: (r: any) => <Badge status={r.bookingType} /> },
              { label:'Pickup', key:'pickupAddress' },
              { label:'Dropoff', key:'dropoffAddress' },
              { label:'Fare', render: (r: any) => fmtCur(r.totalFare || r.fareAmount) },
              { label:'Payment', render: (r: any) => <Badge status={r.paymentMethod} /> },
              { label:'Status', render: (r: any) => <Badge status={r.status} /> },
              { label:'Rating', render: (r: any) => r.rating ? `⭐ ${r.rating}` : '—' },
            ]} rows={tripRows} onRowClick={openView} />
          </TableCard>
        }
      </>}

      {/* ═══ DRIVERS TAB ═══ */}
      {tab === 'drivers' && (() => {
        const driverRows = Array.isArray(drivers.data) ? drivers.data : [];
        const lbRows = Array.isArray(leaderboard.data) ? leaderboard.data : [];
        return <>
          <div className="stats-grid">
            <TrendCard label="Total Drivers" value={driverRows.length || 8} icon="👨‍✈️" color="cyan" />
            <TrendCard label="Available" value={driverRows.filter((d: any) => d.status === 'available').length || 2} icon="🟢" color="green" />
            <TrendCard label="On Trip" value={driverRows.filter((d: any) => d.status === 'on_trip').length || 4} icon="🚕" color="blue" />
            <TrendCard label="Avg Rating" value="4.82 ⭐" icon="⭐" color="amber" sparkData={[4.75,4.78,4.80,4.81,4.82]} />
          </div>

          {/* Leaderboard */}
          {lbRows.length > 0 && <div className="chart-card" style={{padding:16,marginBottom:14}}>
            <h4 style={{marginBottom:12}}>🏆 Today's Leaderboard</h4>
            <div style={{display:'grid',gridTemplateColumns:isMobile ? '1fr' : 'repeat(5,1fr)',gap:10}}>
              {lbRows.map((d: any, i: number) => (
                <div key={i} style={{background:'var(--bg-secondary)',borderRadius:8,padding:12,textAlign:'center',borderTop:`3px solid ${i===0?'var(--accent-amber)':i===1?'#c0c0c0':i===2?'#cd7f32':'var(--border-color)'}`}}>
                  <div style={{fontSize:20,fontWeight:700}}>#{d.rank}</div>
                  <div style={{fontSize:12,fontWeight:600,marginTop:4}}>{d.name}</div>
                  <div style={{fontSize:11,color:'var(--text-muted)',marginTop:4}}>⭐ {d.rating} · {d.trips} trips</div>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--accent-green)',marginTop:4}}>AED {fmt(d.revenue)}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* Driver Table */}
          <TableCard title="Driver Registry" count={driverRows.length}>
            <CrudDataTable columns={[
              { label:'Driver', render: (r: any) => <div><span style={{fontWeight:600}}>{r.name}</span><br/><span style={{fontSize:10,color:'var(--text-muted)',direction:'rtl' as any}}>{r.nameAr}</span></div> },
              { label:'Vehicle', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',fontSize:11}}>{r.vehicleNumber}</span> },
              { label:'Rating', render: (r: any) => <span style={{color:'var(--accent-amber)'}}>⭐ {r.rating}</span> },
              { label:'Trips Today', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.tripsToday}</span> },
              { label:'Revenue', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-green)'}}>AED {fmt(r.revenueToday)}</span> },
              { label:'Accept %', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.acceptanceRate}%</span> },
              { label:'Status', render: (r: any) => <Badge status={r.status === 'available' ? 'active' : r.status === 'on_trip' ? 'expiring' : r.status === 'on_break' ? 'suspended' : 'inactive'} label={r.status} /> },
            ]} rows={driverRows} />
          </TableCard>
        </>;
      })()}

      {/* ═══ DISPATCH BOARD TAB ═══ */}
      {tab === 'dispatch' && (() => {
        const db = dispatchBoard.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Queued" value={db.queuedRequests || 8} icon="⏳" color="amber" />
            <TrendCard label="En Route to Pickup" value={db.acceptedEnRoute || 12} icon="🚗" color="blue" />
            <TrendCard label="In Progress" value={db.inProgress || 18} icon="🟢" color="green" />
            <TrendCard label="Avg Wait" value={`${Math.round((db.avgWaitSec || 252) / 60)} min`} icon="⏱️" color="cyan" trend={-8.5} trendLabel="improving" />
            <TrendCard label="Available Drivers" value={`${db.availableDrivers || 23} / ${db.totalDriversOnShift || 58}`} icon="👨‍✈️" color="green" />
            <TrendCard label="Completed (24h)" value={db.completed24h || 387} icon="✅" color="cyan" sparkData={[340,355,365,375,387]} />
          </div>

          {/* Recent Requests */}
          <TableCard title="Live Dispatch Queue" count={(db.recentRequests || []).length}>
            <CrudDataTable columns={[
              { label:'Passenger', render: (r: any) => <span style={{fontWeight:600}}>{r.passengerName}</span> },
              { label:'Pickup', key:'pickup' },
              { label:'Dropoff', key:'dropoff' },
              { label:'Type', render: (r: any) => <Badge status={r.bookingType} /> },
              { label:'Est. Fare', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-green)'}}>AED {r.estimatedFare}</span> },
              { label:'Driver', render: (r: any) => r.driverName || <span style={{color:'var(--text-muted)'}}>Unassigned</span> },
              { label:'Status', render: (r: any) => <Badge status={r.status === 'pending' ? 'expiring' : r.status === 'accepted' ? 'active' : r.status === 'en_route' ? 'active' : r.status === 'in_progress' ? 'active' : 'inactive'} label={r.status} /> },
            ]} rows={db.recentRequests || []} />
          </TableCard>
        </>;
      })()}

      {/* ═══ ZONES & SURGE TAB ═══ */}
      {tab === 'zones' && (() => {
        const ss = surgeSummary.data || {};
        const zoneRows = Array.isArray(zones.data) ? zones.data : [];
        return <>
          <div className="stats-grid">
            <TrendCard label="Active Zones" value={ss.activeZones || 8} icon="📍" color="cyan" />
            <TrendCard label="Surge Zones" value={ss.surgeZones || 4} icon="📈" color="amber" />
            <TrendCard label="Total Demand" value={ss.totalDemand || 415} icon="👥" color="blue" sparkData={[280,320,350,380,415]} />
            <TrendCard label="Max Surge" value={`${ss.maxSurge || 2.0}× (${ss.maxSurgeZone || 'Global Village'})`} icon="🔥" color="red" />
          </div>

          {/* Demand vs Supply chart */}
          {ss.demandTrend && <ChartCard title="Demand vs Supply — Today" type="line" height={220} data={{
            labels: (ss.demandTrend || []).map((d: any) => d.time),
            datasets: [
              { label:'Demand', data: (ss.demandTrend || []).map((d: any) => d.demand), borderColor:'#ef4444', backgroundColor:'rgba(239,68,68,0.08)', fill:true, tension:0.4, borderWidth:2 },
              { label:'Supply', data: (ss.demandTrend || []).map((d: any) => d.supply), borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', fill:true, tension:0.4, borderWidth:2 },
            ],
          }} options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ y:{ title:{ display:true, text:'Taxis', color:'#8892a8' } } } }} />}
          <div style={{height:14}} />

          {/* Zone Table */}
          <TableCard title="Taxi Zones" count={zoneRows.length}>
            <CrudDataTable columns={[
              { label:'Zone', render: (r: any) => <div><span style={{fontWeight:600}}>{r.name}</span><br/><span style={{fontSize:10,color:'var(--text-muted)',direction:'rtl' as any}}>{r.nameAr}</span></div> },
              { label:'Type', render: (r: any) => <Badge status={r.zoneType} /> },
              { label:'Surge', render: (r: any) => {
                const c = r.surgeMultiplier > 1.5 ? 'var(--accent-red)' : r.surgeMultiplier > 1.0 ? 'var(--accent-amber)' : 'var(--accent-green)';
                return <span style={{fontFamily:'var(--font-mono)',fontWeight:700,color:c}}>{r.surgeMultiplier}×</span>;
              }},
              { label:'Demand', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.currentDemand}</span> },
              { label:'Available', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.availableTaxis}</span> },
              { label:'Base Fare', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>AED {r.baseFare}</span> },
              { label:'Status', render: (r: any) => <Badge status={r.status === 'surge' ? 'expiring' : 'active'} label={r.status} /> },
            ]} rows={zoneRows} />
          </TableCard>
        </>;
      })()}

      {/* ═══ PAYMENTS TAB ═══ */}
      {tab === 'payments' && (() => {
        const pd = paymentDash.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Today Revenue" value={`AED ${fmt(pd.todayRevenue || 28900)}`} icon="💰" color="green" trend={5.8} sparkData={[24200,26800,25500,28100,28900]} />
            <TrendCard label="Driver Payouts" value={`AED ${fmt(pd.driverPayouts || 23120)}`} icon="👨‍✈️" color="blue" />
            <TrendCard label="Company Revenue" value={`AED ${fmt(pd.companyRevenue || 5780)}`} icon="🏢" color="cyan" />
            <TrendCard label="Avg Tip" value={`AED ${pd.avgTip || 5.20}`} icon="🎁" color="amber" />
          </div>

          <div className={isMobile ? "" : "grid-2"}>
            {/* Payment methods */}
            {pd.paymentBreakdown && <ChartCard title="Payment Methods" type="doughnut" height={220} data={{
              labels: ['Card', 'Cash', 'Wallet', 'Corporate', 'NOL'],
              datasets: [{ data: [pd.paymentBreakdown.card, pd.paymentBreakdown.cash, pd.paymentBreakdown.wallet, pd.paymentBreakdown.corporate, pd.paymentBreakdown.nol], backgroundColor: ['rgba(59,130,246,0.75)','rgba(245,158,11,0.75)','rgba(168,85,247,0.75)','rgba(34,197,94,0.75)','rgba(6,214,214,0.75)'], borderWidth:0 }],
            }} options={{ cutout:'60%', plugins:{ legend:{ position:'bottom' as const } } }} />}

            {/* Revenue trend */}
            {pd.trend7d && <ChartCard title="Daily Revenue (7d)" type="bar" height={220} data={{
              labels: (pd.trend7d || []).map((d: any) => d.date?.slice(5)),
              datasets: [{ label:'Revenue (AED)', data: (pd.trend7d || []).map((d: any) => d.revenue), backgroundColor:'rgba(34,197,94,0.6)', borderRadius:4, borderSkipped:false }],
            }} options={{ plugins:{ legend:{ display:false } } }} />}
          </div>
          <div style={{height:14}} />

          {/* Settlement status */}
          {pd.settlementStatus && <div className="chart-card" style={{padding:16}}>
            <h4 style={{marginBottom:12}}>Settlement Status</h4>
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              {Object.entries(pd.settlementStatus || {}).map(([k, v]: any) => (
                <div key={k} style={{flex:1,minWidth:100,background:'var(--bg-secondary)',borderRadius:8,padding:12,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text-muted)',textTransform:'capitalize'}}>{k}</div>
                  <div style={{fontSize:22,fontWeight:700,fontFamily:'var(--font-mono)',color:k==='settled'?'var(--accent-green)':k==='pending'?'var(--accent-amber)':k==='disputed'?'var(--accent-red)':'var(--text-secondary)'}}>{v}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* Top Earners */}
          {pd.topEarners && <TableCard title="Top Earners Today" count={(pd.topEarners || []).length}>
            <CrudDataTable columns={[
              { label:'Driver', render: (r: any) => <span style={{fontWeight:600}}>{r.name}</span> },
              { label:'Trips', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.trips}</span> },
              { label:'Revenue', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-green)'}}>AED {fmt(r.revenue)}</span> },
              { label:'Tips', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-amber)'}}>AED {r.tips}</span> },
            ]} rows={pd.topEarners || []} />
          </TableCard>}
        </>;
      })()}

      {/* ═══ RATINGS TAB ═══ */}
      {tab === 'ratings' && (() => {
        const rd = ratingDash.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Avg Rating" value={`${rd.avgRating || 4.72} ⭐`} icon="⭐" color="amber" sparkData={rd.trend30d?.slice(-7) || [4.70,4.71,4.72,4.73,4.72,4.73,4.72]} />
            <TrendCard label="Total Reviews" value={fmt(rd.totalReviews || 34500)} icon="💬" color="blue" />
            <TrendCard label="5-Star %" value={fmtPct(rd.fiveStarPct || 68)} icon="🌟" color="green" />
            <TrendCard label="1-Star %" value={fmtPct(rd.oneStarPct || 1)} icon="⚠️" color="green" />
          </div>

          <div className={isMobile ? "" : "grid-2"}>
            {/* Rating distribution */}
            <ChartCard title="Rating Distribution" type="bar" height={200} data={{
              labels: ['5 ⭐','4 ⭐','3 ⭐','2 ⭐','1 ⭐'],
              datasets: [{ data: [rd.fiveStarPct||68, rd.fourStarPct||22, rd.threeStarPct||7, rd.twoStarPct||2, rd.oneStarPct||1], backgroundColor: ['rgba(34,197,94,0.7)','rgba(132,204,22,0.7)','rgba(245,158,11,0.7)','rgba(249,115,22,0.7)','rgba(239,68,68,0.7)'], borderRadius:6, borderSkipped:false }],
            }} options={{ indexAxis:'y' as const, plugins:{ legend:{ display:false } }, scales:{ x:{ title:{ display:true, text:'%', color:'#8892a8' } } } }} />

            {/* Top Complaints */}
            {rd.topComplaints && <div className="chart-card" style={{padding:16}}>
              <h4 style={{marginBottom:12}}>Top Complaint Categories</h4>
              {(rd.topComplaints || []).map((c: any, i: number) => (
                <div key={i} style={{display:'flex',alignItems:'center',gap:12,padding:'8px 0',borderBottom:'1px solid var(--border-color)'}}>
                  <div style={{flex:1,fontSize:12}}>{c.category}</div>
                  <div style={{width:120}}>
                    <div style={{height:6,background:'var(--bg-secondary)',borderRadius:3,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${c.pct}%`,background:'var(--accent-amber)',borderRadius:3}} />
                    </div>
                  </div>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:11,minWidth:40,textAlign:'right'}}>{c.count}</span>
                </div>
              ))}
            </div>}
          </div>
          <div style={{height:14}} />

          {/* Recent Reviews */}
          {rd.recentFeedback && <TableCard title="Recent Reviews" count={(rd.recentFeedback || []).length}>
            <CrudDataTable columns={[
              { label:'Passenger', render: (r: any) => <span style={{fontWeight:600}}>{r.passengerName}</span> },
              { label:'Driver', key:'driverName' },
              { label:'Rating', render: (r: any) => <span style={{color:r.rating>=4?'var(--accent-green)':r.rating>=3?'var(--accent-amber)':'var(--accent-red)'}}>{'⭐'.repeat(r.rating)}</span> },
              { label:'Comment', render: (r: any) => <span style={{fontSize:11,maxWidth:300,display:'inline-block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.comment}</span> },
              { label:'Date', render: (r: any) => fmtDate(r.date) },
            ]} rows={rd.recentFeedback || []} />
          </TableCard>}
        </>;
      })()}

      {/* ═══ MEDALLIONS TAB ═══ */}
      {tab === 'medallions' && (() => {
        const medRows = Array.isArray(medallions.data) ? medallions.data : [];
        return <>
          <div className="stats-grid">
            <TrendCard label="Total Medallions" value={medRows.length || 8} icon="🏅" color="cyan" />
            <TrendCard label="Active" value={medRows.filter((m: any) => m.status === 'active').length || 7} icon="✅" color="green" />
            <TrendCard label="Expiring" value={medRows.filter((m: any) => m.status === 'expiring').length || 1} icon="⚠️" color="amber" />
            <TrendCard label="Annual Fee Range" value="AED 12K–18K" icon="💰" color="blue" />
          </div>

          <TableCard title="Medallion Registry" count={medRows.length} action={<button className="btn btn-cyan btn-sm">+ Issue Medallion</button>}>
            <CrudDataTable columns={[
              { label:'Medallion', render: (r: any) => <span style={{fontWeight:700,fontFamily:'var(--font-mono)'}}>{r.medallionId}</span> },
              { label:'Vehicle', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',fontSize:11}}>{r.vehicleNumber}</span> },
              { label:'Driver', render: (r: any) => <span style={{fontWeight:600}}>{r.driverName}</span> },
              { label:'Type', render: (r: any) => <Badge status={r.type === 'premium' ? 'active' : r.type === 'standard' ? 'expiring' : 'suspended'} label={r.type} /> },
              { label:'Issued', key:'issuedDate' },
              { label:'Expiry', key:'expiryDate' },
              { label:'Annual Fee', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>AED {fmt(r.annualFee)}</span> },
              { label:'Status', render: (r: any) => <Badge status={r.status === 'active' ? 'active' : 'expiring'} label={r.status} /> },
            ]} rows={medRows} />
          </TableCard>
        </>;
      })()}

      {/* ═══ LIVE MAP TAB ═══ */}
      {tab === 'livemap' && <>
        <MapPanel
          title="Live Taxi Fleet — Dubai"
          markers={(Array.isArray(liveFleet.data) ? liveFleet.data : []).map((t: any) => ({
            lat: t.lat, lng: t.lng, label: `${t.vehicleId} (${t.driver})`,
            color: t.status === 'on_trip' ? '#f59e0b' : t.status === 'available' ? '#22c55e' : '#6b7280',
            icon: '🚕',
            popup: `${t.vehicleId}<br/>Driver: ${t.driver}<br/>Status: ${t.status}${t.passenger ? `<br/>Pax: ${t.passenger}<br/>To: ${t.dropoff}<br/>ETA: ${t.eta}<br/>Fare: AED ${t.fare}` : '<br/>Available for dispatch'}<br/>Speed: ${t.speed} km/h`,
          })).concat((Array.isArray(zones.data) ? zones.data : []).filter((z: any) => z.status === 'surge').map((z: any) => ({
            lat: z.centerLat, lng: z.centerLng, label: `⚡ ${z.name} (${z.surgeMultiplier}×)`,
            color: '#ef4444', icon: '📈', popup: `SURGE ZONE: ${z.name}<br/>${z.surgeMultiplier}× multiplier<br/>Demand: ${z.currentDemand}<br/>Available: ${z.availableTaxis}`,
          })))}
          zones={(Array.isArray(zones.data) ? zones.data : []).map((z: any) => ({
            lat: z.centerLat, lng: z.centerLng, radius: z.radiusM,
            color: z.status === 'surge' ? '#ef4444' : z.zoneType === 'airport' ? '#3b82f6' : '#22c55e',
            label: z.name,
          }))}
          center={[25.20, 55.27]}
          zoom={12}
          height={480}
          showControls
        />
      </>}

      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Taxi Trip Details" lg>
        {selected && <DetailView items={[
          { label:'Trip ID', value:(selected.id||'').slice(0,12) },
          { label:'Vehicle ID', value:(selected.vehicleId||'').slice(0,12) },
          { label:'Driver ID', value:(selected.driverId||'').slice(0,12) },
          { label:'Booking Type', value:selected.bookingType },
          { label:'Status', value:selected.status },
          { label:'Pickup', value:selected.pickupAddress },
          { label:'Dropoff', value:selected.dropoffAddress },
          { label:'Distance', value:selected.distanceKm ? `${selected.distanceKm} km` : null },
          { label:'Duration', value:selected.durationMinutes ? `${selected.durationMinutes} min` : null },
          { label:'Base Fare', value:fmtCur(selected.baseFare) },
          { label:'Surge', value:selected.surgeMultiplier ? `${selected.surgeMultiplier}x` : null },
          { label:'Total Fare', value:fmtCur(selected.totalFare) },
          { label:'Payment', value:selected.paymentMethod },
          { label:'Rating', value:selected.rating ? `${selected.rating}/5` : null },
        ]} />}
      </Modal>
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Dispatch New Ride"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleSave} disabled={saving || !form.vehicleId || !form.driverId}>{saving ? 'Saving...' : 'Dispatch Ride'}</button>
        </>}>
        <div className="form-grid">
          <FormField label="Vehicle ID" value={form.vehicleId} onChange={set('vehicleId')} placeholder="Taxi Vehicle UUID" required />
          <FormField label="Driver ID" value={form.driverId} onChange={set('driverId')} placeholder="Driver UUID" required />
          <FormField label="Booking Type" type="select" value={form.bookingType} onChange={set('bookingType')} options={[
            { value:'street_hail', label:'Street Hail' }, { value:'app_dispatch', label:'App Dispatch' },
            { value:'phone', label:'Phone' }, { value:'corporate', label:'Corporate' }, { value:'airport', label:'Airport' }]} />
          <FormField label="Payment" type="select" value={form.paymentMethod} onChange={set('paymentMethod')} options={['cash','card','wallet','corporate']} />
          <FormField label="Pickup" value={form.pickupAddress} onChange={set('pickupAddress')} placeholder="Dubai Mall Entrance" />
          <FormField label="Dropoff" value={form.dropoffAddress} onChange={set('dropoffAddress')} placeholder="DXB Terminal 3" />
          <FormField label="Base Fare (AED)" type="number" value={form.baseFare} onChange={set('baseFare')} />
          <FormField label="Total Fare (AED)" type="number" value={form.totalFare} onChange={set('totalFare')} />
        </div>
      </Modal>
      <toast.Toast />
    </div>
  );
}
