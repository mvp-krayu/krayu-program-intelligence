// BusPage — Bus Transit Operations (Enhanced Session 26)
// Ridership charts, route performance radar, OTP trends

import React, { useState } from 'react';
import { useApi, useApiMutation, useToast, useMediaQuery } from '@/hooks';
import { useFleetPositions, useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
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
import { fmtDate, fmtPct, fmt, fmtTime } from '@/utils';

const TABS = [
  { id:'dashboard', label:'Dashboard' },
  { id:'routes', label:'Routes' },
  { id:'stops', label:'Stops' },
  { id:'schedule', label:'Schedule' },
  { id:'dispatch', label:'Dispatch' },
  { id:'passengers', label:'Passengers' },
  { id:'fare', label:'Fare & Revenue' },
  { id:'compliance', label:'Compliance' },
  { id:'livemap', label:'Live Map' },
];

export default function BusPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const routes = useApi('/api/v1/bus/routes');
  const otp = useApi('/api/v1/bus/routes/otp');
  const pax = useApi('/api/v1/bus/passengers/stats');
  // New bus operations API hooks
  const stops = useApi('/api/v1/bus/stops');
  const schedDash = useApi('/api/v1/bus/schedules/dashboard');
  const adherenceTrend = useApi('/api/v1/bus/schedules/adherence-trend');
  const paxDash = useApi('/api/v1/bus/passengers/dashboard');
  const liveLoad = useApi('/api/v1/bus/passengers/live-load');
  const dispatchDash = useApi('/api/v1/bus/dispatch/dashboard');
  const assignments = useApi('/api/v1/bus/dispatch/assignments');
  const fareDash = useApi('/api/v1/bus/fare/dashboard');
  const compliance = useApi('/api/v1/bus/compliance');
  const liveFleet = useApi('/api/v1/bus/fleet/live');
  const routeRows = Array.isArray(routes.data) ? routes.data : routes.data?.items || [];
  const o = otp.data || {};
  const p = pax.data || {};
  const { mutate, saving } = useApiMutation();
  const { connected: wsConnected } = useSocketContext();
  const { positions: busPositions } = useFleetPositions('bus');
  const [tab, setTab] = useState('dashboard');
  const [range, setRange] = useState('7d');
  const [modal, setModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [confirm, setConfirm] = useState<string | null>(null);
  const toast = useToast();

  const resetForm = (item?: any) => {
    setForm(item ? { ...item } : { routeNumber:'', routeName:'', routeType:'local', status:'active', distanceKm:'', estimatedMinutes:'', stopCount:'', fareAmount:'' });
  };
  const openCreate = () => { resetForm(); setModal('create'); };
  const openEdit = (row: any) => { setSelected(row); resetForm(row); setModal('edit'); };
  const openView = (row: any) => { setSelected(row); setModal('view'); };
  const openDelete = (row: any) => { setSelected(row); setConfirm('delete'); };
  const handleSave = async () => {
    const isEdit = modal === 'edit';
    const payload = { ...form };
    ['distanceKm','fareAmount'].forEach(k => { if (payload[k]) payload[k] = parseFloat(payload[k]); });
    ['estimatedMinutes','stopCount'].forEach(k => { if (payload[k]) payload[k] = parseInt(payload[k]); });
    const res = await mutate(isEdit ? 'PUT' : 'POST', isEdit ? `/api/v1/bus/routes/${selected.id}` : '/api/v1/bus/routes', payload);
    if (res.ok) { toast.show(`Route ${isEdit ? 'updated' : 'created'}`, 'success'); setModal(null); routes.refetch(); }
    else toast.show(res.error, 'error');
  };
  const handleDelete = async () => {
    const res = await mutate('DELETE', `/api/v1/bus/routes/${selected.id}`);
    if (res.ok) { toast.show('Route deleted', 'success'); setConfirm(null); setSelected(null); routes.refetch(); }
    else toast.show(res.error, 'error');
  };
  const set = (k: any) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  // Chart data
  const ridershipTrend = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [
      { label:'Daily Avg', data:[4200,4500,4350,4800,5100,4900,5300,5500,5200,5600,5800,6100], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.08)', fill:true, tension:0.4, borderWidth:2 },
      { label:'Peak Hour', data:[1800,1950,1870,2100,2200,2150,2300,2400,2250,2450,2500,2650], borderColor:'#f59e0b', borderDash:[5,5], tension:0.4, borderWidth:2 },
    ],
  };

  const otpTrend = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      { label:'On-Time %', data:[92,89,94,91,88,95,97], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', fill:true, tension:0.4, borderWidth:2, pointRadius:4, pointBackgroundColor:'#22c55e' },
    ],
  };

  const routePerformance = {
    labels: ['On-Time','Ridership','Revenue','Safety','Comfort','Efficiency'],
    datasets: [
      { label:'Current', data:[91,85,78,94,88,82], borderColor:'#06d6d6', backgroundColor:'rgba(6,214,214,0.12)', pointBackgroundColor:'#06d6d6', borderWidth:2 },
      { label:'Target', data:[95,90,85,95,90,88], borderColor:'#3b82f6', borderDash:[5,5], backgroundColor:'rgba(59,130,246,0.05)', pointBackgroundColor:'#3b82f6', borderWidth:2 },
    ],
  };

  const paxByRoute = {
    labels: ['F55','F17','E11','E303','X28','N55','DM1'],
    datasets: [{
      label:'Daily Passengers',
      data: [850,720,680,540,480,320,260],
      backgroundColor: ['rgba(59,130,246,0.7)','rgba(6,214,214,0.7)','rgba(245,158,11,0.7)','rgba(34,197,94,0.7)','rgba(168,85,247,0.7)','rgba(239,68,68,0.7)','rgba(236,72,153,0.7)'],
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  return (
    <div>
      <PageHeader title="Bus Transit Operations" breadcrumb="Bus" subtitle={`Route management${wsConnected ? ` · ${busPositions.length} buses live` : ''}`}
        right={<div style={{display:'flex',gap:8,alignItems:'center'}}>
          {wsConnected && <ConnectionStatus compact />}
          <TimeRangeSelector value={range} onChange={setRange} />
          <ExportToolbar rows={routeRows} filename="bus_routes" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ New Route</button>
        </div>} />

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'dashboard' && <>
        <div className="stats-grid">
          <TrendCard label="Active Routes" value={routeRows.length || 24} color="cyan" icon="🚌" sparkData={[20,21,22,22,23,24,24]} trend={4.3} trendLabel="new routes" />
          <TrendCard label="On-Time %" value={fmtPct(o.onTimePercent || 91.2)} color={o.onTimePercent > 90 ? 'green' : 'amber'} icon="⏰" sparkData={[88,89,90,89,91,90,91]} trend={2.1} />
          <TrendCard label="Daily Passengers" value={fmt(p.dailyPassengers || 6100)} color="blue" icon="👥" sparkData={[4800,5100,5300,5500,5600,5800,6100]} trend={8.5} />
          <TrendCard label="Avg Headway" value={o.avgHeadwayMin ? `${o.avgHeadwayMin} min` : '12 min'} icon="🔄" sparkData={[15,14,14,13,13,12,12]} trend={-7.7} trendLabel="improving" />
          <TrendCard label="Fleet Size" value="42 buses" icon="🚎" sparkData={[38,39,39,40,41,41,42]} />
          <TrendCard label="Revenue/Day" value="AED 28,400" icon="💰" trend={5.2} sparkData={[24000,25200,26100,26800,27500,28000,28400]} />
        </div>

        <div className="chart-card" style={{display:'flex', justifyContent:'space-around', alignItems:'center', padding:'20px', flexWrap:'wrap', gap:16}}>
          <GaugeChart value={91.2} label="On-Time Performance" thresholds={{red:75,amber:85,green:90}} showTrend="up" />
          <GaugeChart value={94.5} label="Fleet Availability" thresholds={{red:80,amber:88,green:92}} showTrend="stable" />
          <GaugeChart value={87.3} label="Passenger Satisfaction" thresholds={{red:70,amber:80,green:85}} showTrend="up" />
          <GaugeChart value={96.1} label="Safety Compliance" thresholds={{red:88,amber:93,green:95}} showTrend="stable" />
        </div>
        <div style={{height:14}} />

        <div className={isMobile ? "" : "grid-2"}>
          <ChartCard title="Monthly Ridership Trend" type="line" data={ridershipTrend} height={220}
            options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ y:{ title:{ display:true, text:'Passengers', color:'#8892a8' } } } }} />
          <ChartCard title="Route Performance Radar" type="radar" data={routePerformance} height={220}
            options={{ scales:{ r:{ angleLines:{ color:'rgba(30,42,74,0.5)' }, grid:{ color:'rgba(30,42,74,0.4)' }, pointLabels:{ color:'#8892a8', font:{ size:10 } }, ticks:{ display:false }, min:50, max:100 } }, plugins:{ legend:{ position:'bottom' as const } } }} />
        </div>
        <div style={{height:14}} />
        <div className={isMobile ? "" : "grid-2"}>
          <ChartCard title="On-Time Performance (Weekly)" type="line" data={otpTrend} height={200}
            options={{ plugins:{ legend:{ display:false } }, scales:{ y:{ min:80, max:100, title:{ display:true, text:'%', color:'#8892a8' } } } }} />
          <ChartCard title="Passengers by Route (Top 7)" type="bar" data={paxByRoute} height={200}
            options={{ plugins:{ legend:{ display:false } } }} />
        </div>
      </>}

      {tab === 'routes' && <>
        {routes.loading ? <Loading /> :
          <TableCard title="Bus Routes" count={routeRows.length}>
            <CrudDataTable columns={[
              { label:'Route', key:'routeNumber' },
              { label:'Name', key:'routeName' },
              { label:'Type', render: (r: any) => <Badge status={r.routeType} /> },
              { label:'Stops', render: (r: any) => r.stopCount || r.stops?.length || '—' },
              { label:'Distance', render: (r: any) => r.distanceKm ? `${r.distanceKm} km` : '—' },
              { label:'Fare', render: (r: any) => r.fareAmount ? `AED ${r.fareAmount}` : '—' },
              { label:'Status', render: (r: any) => <Badge status={r.status} /> },
            ]} rows={routeRows} onRowClick={openView} onEdit={openEdit} onDelete={openDelete} />
          </TableCard>
        }
      </>}

      {/* ═══ STOPS TAB ═══ */}
      {tab === 'stops' && <>
        <div className="stats-grid">
          <TrendCard label="Total Stops" value={(stops.data || []).length || 8} icon="🚏" color="cyan" sparkData={[6,7,7,8,8]} />
          <TrendCard label="Accessible" value={`${(stops.data || []).filter((s: any) => s.hasAccessibility).length || 5} / ${(stops.data || []).length || 8}`} icon="♿" color="green" />
          <TrendCard label="With Shelter" value={`${(stops.data || []).filter((s: any) => s.hasShelter).length || 5} / ${(stops.data || []).length || 8}`} icon="🏠" color="blue" />
          <TrendCard label="Digital Display" value={`${(stops.data || []).filter((s: any) => s.hasDisplay).length || 4} / ${(stops.data || []).length || 8}`} icon="📺" color="amber" />
        </div>
        <TableCard title="Bus Stop Registry" count={(stops.data || []).length} action={<button className="btn btn-cyan btn-sm">+ Add Stop</button>}>
          <CrudDataTable columns={[
            { label:'Code', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',fontWeight:600}}>{r.stopCode}</span> },
            { label:'Name', key:'name' },
            { label:'Name (AR)', render: (r: any) => <span style={{fontFamily:'inherit',direction:'rtl' as any}}>{r.nameAr || '—'}</span> },
            { label:'♿', render: (r: any) => r.hasAccessibility ? <Badge status="active" label="✓" /> : <Badge status="inactive" label="✗" /> },
            { label:'🏠', render: (r: any) => r.hasShelter ? <Badge status="active" label="✓" /> : <Badge status="inactive" label="✗" /> },
            { label:'📺', render: (r: any) => r.hasDisplay ? <Badge status="active" label="✓" /> : <Badge status="inactive" label="✗" /> },
            { label:'Boardings/Day', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{fmt(r.avgBoardingsDay)}</span> },
            { label:'Alightings/Day', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{fmt(r.avgAlightingsDay)}</span> },
            { label:'Status', render: (r: any) => <Badge status={r.status} /> },
          ]} rows={Array.isArray(stops.data) ? stops.data : []} />
        </TableCard>
      </>}

      {/* ═══ SCHEDULE TAB ═══ */}
      {tab === 'schedule' && (() => {
        const sd = schedDash.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Published Schedules" value={sd.publishedSchedules || 24} icon="📅" color="green" sparkData={[20,21,22,23,24]} />
            <TrendCard label="Today's Trips" value={sd.totalTripsToday || 486} icon="🔄" color="blue" sparkData={[460,468,475,480,486]} />
            <TrendCard label="Schedule Adherence" value={fmtPct(sd.adherencePct || 93.8)} icon="⏰" color="green" trend={1.2} sparkData={[91,92,92.5,93,93.8]} />
            <TrendCard label="GTFS Version" value={sd.gtfsVersion || 'v2026.02.14'} icon="📡" color="cyan" />
          </div>
          <div className={isMobile ? "" : "grid-2"}>
            <div className="chart-card" style={{padding:16}}>
              <h4 style={{marginBottom:12}}>Service Hours</h4>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:12}}>
                {[{l:'First Service',v:sd.firstService||'05:00',c:'var(--accent-blue)'},{l:'Last Service',v:sd.lastService||'00:30',c:'var(--accent-amber)'},{l:'Peak Headway',v:sd.peakHeadway||'6 min',c:'var(--accent-green)'},{l:'Off-Peak Headway',v:sd.offPeakHeadway||'12 min',c:'var(--accent-cyan)'}].map(x => (
                  <div key={x.l} style={{background:'var(--bg-secondary)',borderRadius:8,padding:12,textAlign:'center'}}>
                    <div style={{fontSize:10,color:'var(--text-muted)',marginBottom:4}}>{x.l}</div>
                    <div style={{fontSize:20,fontWeight:700,fontFamily:'var(--font-mono)',color:x.c}}>{x.v}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:16}}>
                <h4 style={{fontSize:13,marginBottom:8}}>Day Type Schedules — F55</h4>
                {['Weekday: 05:30–23:45 • 6 min peak • 108 trips','Friday: 06:00–00:30 • 8 min peak • 82 trips','Saturday: 06:00–23:00 • 10 min peak • 72 trips'].map(s => (
                  <div key={s} style={{fontSize:12,padding:'6px 0',borderBottom:'1px solid var(--border-color)',color:'var(--text-secondary)'}}>{s}</div>
                ))}
              </div>
            </div>
            {adherenceTrend.data && <ChartCard title="Schedule Adherence Trend (7d)" type="line" height={260} data={{
              labels: (adherenceTrend.data || []).map((d: any) => d.date?.slice(5)),
              datasets: [
                { label:'Adherence %', data: (adherenceTrend.data || []).map((d: any) => d.adherencePct), borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.1)', fill:true, tension:0.4, borderWidth:2 },
              ],
            }} options={{ scales:{ y:{ min:85, max:100, title:{ display:true, text:'%', color:'#8892a8' } } } }} />}
          </div>
          {adherenceTrend.data && <TableCard title="Daily Breakdown" count={(adherenceTrend.data || []).length} >
            <CrudDataTable columns={[
              { label:'Date', key:'date' },
              { label:'Adherence', render: (r: any) => <Badge status={r.adherencePct >= 93 ? 'active' : 'expiring'} label={`${r.adherencePct}%`} /> },
              { label:'On Time', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-green)'}}>{r.onTime}</span> },
              { label:'Late', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-amber)'}}>{r.late}</span> },
              { label:'Early', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-blue)'}}>{r.early}</span> },
            ]} rows={Array.isArray(adherenceTrend.data) ? adherenceTrend.data : []} />
          </TableCard>}
        </>;
      })()}

      {/* ═══ DISPATCH TAB ═══ */}
      {tab === 'dispatch' && (() => {
        const dd = dispatchDash.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Active Drivers" value={`${dd.activeDrivers || 52} / ${dd.totalDriversToday || 64}`} icon="👨‍✈️" color="green" />
            <TrendCard label="Buses In Service" value={`${dd.inService || 36} / ${dd.totalBuses || 42}`} icon="🚌" color="blue" />
            <TrendCard label="Trips Completed" value={dd.tripsCompleted || 312} icon="✅" color="cyan" sparkData={[280,290,298,305,312]} />
            <TrendCard label="Next Shift Change" value={dd.nextShiftChange || '14:00'} icon="🔄" color="amber" />
          </div>

          {/* Dispatch Alerts */}
          {(dd.alerts || []).length > 0 && <div className="chart-card" style={{padding:16,marginBottom:14}}>
            <h4 style={{marginBottom:8}}>Dispatch Alerts</h4>
            {(dd.alerts || []).map((a: any, i: number) => (
              <div key={i} style={{padding:10,marginBottom:6,borderRadius:6,background:'var(--bg-secondary)',borderLeft:`3px solid ${a.severity === 'critical' ? 'var(--accent-red)' : a.severity === 'high' ? 'var(--accent-amber)' : 'var(--accent-blue)'}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:12}}>{a.message}</span>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <span style={{fontSize:10,color:'var(--text-muted)'}}>{a.time}</span>
                    <Badge status={a.severity === 'critical' ? 'rejected' : a.severity === 'high' ? 'expiring' : 'active'} label={a.severity} />
                  </div>
                </div>
              </div>
            ))}
          </div>}

          {/* Driver-Vehicle Assignments */}
          <TableCard title="Today's Assignments" count={(assignments.data || []).length} action={<button className="btn btn-cyan btn-sm">+ New Assignment</button>}>
            <CrudDataTable columns={[
              { label:'Driver', render: (r: any) => <span style={{fontWeight:600}}>{r.driverName}</span> },
              { label:'Vehicle', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.vehicleNumber}</span> },
              { label:'Route', render: (r: any) => <Badge status="active" label={r.routeNumber} /> },
              { label:'Shift', render: (r: any) => <Badge status={r.shift === 'morning' ? 'active' : r.shift === 'afternoon' ? 'expiring' : 'suspended'} label={r.shift} /> },
              { label:'Time', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',fontSize:11}}>{r.startTime}–{r.endTime}</span> },
              { label:'Trips', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.tripsCompleted}</span> },
              { label:'Passengers', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{fmt(r.totalPassengers)}</span> },
              { label:'Status', render: (r: any) => <Badge status={r.status} /> },
            ]} rows={Array.isArray(assignments.data) ? assignments.data : []} />
          </TableCard>
        </>;
      })()}

      {/* ═══ PASSENGERS TAB ═══ */}
      {tab === 'passengers' && (() => {
        const pd = paxDash.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Today" value={fmt(pd.todayRidership || 12450)} icon="👥" color="blue" sparkData={[10200,11100,11800,12100,12450]} trend={6.2} />
            <TrendCard label="This Week" value={fmt(pd.weeklyRidership || 84200)} icon="📊" color="cyan" sparkData={[76000,78500,80200,82400,84200]} />
            <TrendCard label="Avg Load Factor" value={fmtPct(pd.avgLoadFactor || 62.4)} icon="📈" color="green" sparkData={[58,59,60,61,62]} />
            <TrendCard label="Wheelchair Boardings" value={pd.wheelchairBoardings || 12} icon="♿" color="amber" sparkData={[8,9,10,11,12]} />
          </div>

          {/* Ridership by hour */}
          {pd.byHour && <ChartCard title="Ridership by Hour — Today" type="bar" height={200} data={{
            labels: (pd.byHour || []).map((h: any) => h.hour),
            datasets: [{ label:'Passengers', data: (pd.byHour || []).map((h: any) => h.pax), backgroundColor: (pd.byHour || []).map((h: any) => h.pax > 1000 ? 'rgba(239,68,68,0.7)' : h.pax > 600 ? 'rgba(245,158,11,0.7)' : 'rgba(59,130,246,0.7)'), borderRadius:4, borderSkipped:false }],
          }} options={{ plugins:{ legend:{ display:false } }, scales:{ y:{ title:{ display:true, text:'Passengers', color:'#8892a8' } } } }} />}
          <div style={{height:14}} />

          {/* Live Load Factors */}
          <TableCard title="Live Bus Load Factors" count={(liveLoad.data || []).length}>
            <CrudDataTable columns={[
              { label:'Vehicle', render: (r: any) => <span style={{fontWeight:600,fontFamily:'var(--font-mono)'}}>{r.vehicleId}</span> },
              { label:'Route', render: (r: any) => <Badge status="active" label={r.routeNumber} /> },
              { label:'Onboard', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.onboard} / {r.capacity}</span> },
              { label:'Load %', render: (r: any) => {
                const c = r.loadPct > 85 ? 'var(--accent-red)' : r.loadPct > 60 ? 'var(--accent-amber)' : 'var(--accent-green)';
                return <div style={{display:'flex',alignItems:'center',gap:8}}>
                  <div style={{flex:1,height:6,background:'var(--bg-secondary)',borderRadius:3,overflow:'hidden',maxWidth:80}}>
                    <div style={{height:'100%',width:`${r.loadPct}%`,background:c,borderRadius:3}} />
                  </div>
                  <span style={{fontFamily:'var(--font-mono)',fontSize:11,color:c}}>{r.loadPct}%</span>
                </div>;
              }},
              { label:'Next Stop', key:'nextStop' },
              { label:'Status', render: (r: any) => <Badge status={r.status === 'en_route' ? 'active' : 'expiring'} label={r.status} /> },
            ]} rows={Array.isArray(liveLoad.data) ? liveLoad.data : []} />
          </TableCard>

          {/* Top Routes */}
          {pd.topRoutes && <TableCard title="Top Routes by Ridership" count={(pd.topRoutes || []).length}>
            <CrudDataTable columns={[
              { label:'Route', render: (r: any) => <span style={{fontWeight:600}}>{r.routeNumber}</span> },
              { label:'Name', key:'name' },
              { label:'Daily Passengers', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{fmt(r.dailyPax)}</span> },
              { label:'Load Factor', render: (r: any) => <Badge status={r.loadFactor > 75 ? 'rejected' : r.loadFactor > 60 ? 'expiring' : 'active'} label={`${r.loadFactor}%`} /> },
            ]} rows={pd.topRoutes || []} />
          </TableCard>}
        </>;
      })()}

      {/* ═══ FARE & REVENUE TAB ═══ */}
      {tab === 'fare' && (() => {
        const fd = fareDash.data || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Today Revenue" value={`AED ${fmt(fd.todayRevenue || 28400)}`} icon="💰" color="green" trend={5.2} sparkData={[24800,26100,27200,28900,28400]} />
            <TrendCard label="Weekly Revenue" value={`AED ${fmt(fd.weeklyRevenue || 192800)}`} icon="📊" color="blue" sparkData={[178000,182000,186000,190000,192800]} />
            <TrendCard label="Avg Fare" value={`AED ${fd.avgFare || 2.28}`} icon="🎫" color="cyan" />
            <TrendCard label="NOL Card %" value={fmtPct(fd.paymentMethods?.nolCard || 68)} icon="💳" color="green" sparkData={[62,64,65,66,68]} />
          </div>

          <div className={isMobile ? "" : "grid-2"}>
            {/* Revenue by Payment Method */}
            {fd.paymentMethods && <ChartCard title="Payment Methods" type="doughnut" height={220} data={{
              labels: ['NOL Card', 'Cashless (Apple/Google Pay)', 'Cash'],
              datasets: [{ data: [fd.paymentMethods.nolCard || 68, fd.paymentMethods.cashless || 22, fd.paymentMethods.cash || 10], backgroundColor: ['rgba(34,197,94,0.75)', 'rgba(59,130,246,0.75)', 'rgba(245,158,11,0.75)'], borderWidth: 0 }],
            }} options={{ cutout:'60%', plugins:{ legend:{ position:'bottom' as const } } }} />}

            {/* Revenue Trend */}
            {fd.trend7d && <ChartCard title="Daily Revenue (7d)" type="line" height={220} data={{
              labels: (fd.trend7d || []).map((d: any) => d.date?.slice(5)),
              datasets: [{ label:'Revenue (AED)', data: (fd.trend7d || []).map((d: any) => d.revenue), borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', fill:true, tension:0.4, borderWidth:2 }],
            }} options={{ plugins:{ legend:{ display:false } }, scales:{ y:{ title:{ display:true, text:'AED', color:'#8892a8' } } } }} />}
          </div>
          <div style={{height:14}} />

          {/* Fare Breakdown by Type */}
          {fd.fareByType && <div className="chart-card" style={{padding:16}}>
            <h4 style={{marginBottom:12}}>Revenue by Fare Type</h4>
            <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
              {Object.entries(fd.fareByType || {}).map(([k, v]: any) => (
                <div key={k} style={{flex:1,minWidth:120,background:'var(--bg-secondary)',borderRadius:8,padding:12,textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text-muted)',textTransform:'capitalize',marginBottom:4}}>{k.replace(/_/g, ' ')}</div>
                  <div style={{fontSize:18,fontWeight:700,fontFamily:'var(--font-mono)',color:'var(--accent-green)'}}>AED {fmt(v)}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* Revenue by Route */}
          {fd.revenueByRoute && <TableCard title="Revenue by Route" count={(fd.revenueByRoute || []).length}>
            <CrudDataTable columns={[
              { label:'Route', render: (r: any) => <span style={{fontWeight:600}}>{r.routeNumber}</span> },
              { label:'Revenue', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-green)'}}>AED {fmt(r.revenue)}</span> },
              { label:'Trips', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.trips}</span> },
              { label:'Pax/Trip', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.paxPerTrip}</span> },
            ]} rows={fd.revenueByRoute || []} />
          </TableCard>}
        </>;
      })()}

      {/* ═══ COMPLIANCE TAB ═══ */}
      {tab === 'compliance' && (() => {
        const c = compliance.data || {};
        const rta = c.rtaDubai || {};
        const ada = c.ada || {};
        const safety = c.safetyEquipment || {};
        const certs = c.driverCertifications || {};
        return <>
          <div className="stats-grid">
            <TrendCard label="Overall Compliance" value={fmtPct(c.overallPct || 96.8)} icon="✅" color="green" />
            <TrendCard label="RTA Compliant" value={`${rta.compliant || 40} / ${(rta.compliant || 40) + (rta.nonCompliant || 2)}`} icon="🏛️" color="green" />
            <TrendCard label="Accessible Buses" value={`${ada.accessibleBuses || 38} / ${ada.totalBuses || 42}`} icon="♿" color="blue" />
            <TrendCard label="Driver Certs Valid" value={`${certs.valid || 60} / ${(certs.valid || 60) + (certs.expiring || 3) + (certs.expired || 1)}`} icon="🎓" color="green" />
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14}}>
            {/* RTA Dubai */}
            <div className="chart-card" style={{padding:16,borderLeft:'3px solid var(--accent-green)'}}>
              <h4 style={{marginBottom:12}}>RTA Dubai Compliance</h4>
              <GaugeChart value={((rta.compliant || 40) / ((rta.compliant || 40) + (rta.nonCompliant || 2))) * 100} label="Compliant" thresholds={{red:80,amber:90,green:95}} />
              <div style={{fontSize:12,marginTop:12}}>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Compliant</span><span style={{color:'var(--accent-green)',fontWeight:600}}>{rta.compliant || 40}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Non-Compliant</span><span style={{color:'var(--accent-red)',fontWeight:600}}>{rta.nonCompliant || 2}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Inspections Due</span><span style={{color:'var(--accent-amber)',fontWeight:600}}>{rta.inspectionsDue || 3}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Last Audit</span><span>{rta.lastAudit || '2026-02-01'}</span></div>
              </div>
            </div>

            {/* Accessibility */}
            <div className="chart-card" style={{padding:16,borderLeft:'3px solid var(--accent-blue)'}}>
              <h4 style={{marginBottom:12}}>Accessibility (ADA/DDA)</h4>
              <GaugeChart value={((ada.accessibleBuses || 38) / (ada.totalBuses || 42)) * 100} label="Accessible" thresholds={{red:70,amber:85,green:90}} />
              <div style={{fontSize:12,marginTop:12}}>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Ramps Working</span><span>{ada.rampWorking || 36} / {ada.totalBuses || 42}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Audio Announcements</span><span>{ada.audioAnnouncements || 42} / {ada.totalBuses || 42}</span></div>
              </div>
            </div>

            {/* Safety Equipment */}
            <div className="chart-card" style={{padding:16,borderLeft:'3px solid var(--accent-cyan)'}}>
              <h4 style={{marginBottom:12}}>Safety Equipment</h4>
              {[{l:'Fire Extinguishers',v:safety.fireExtinguishers},{l:'First Aid',v:safety.firstAid},{l:'Emergency Hammers',v:safety.emergencyHammers},{l:'CCTV',v:safety.cctv},{l:'Panic Buttons',v:safety.panicButtons}].map(x => (
                <div key={x.l} style={{display:'flex',justifyContent:'space-between',fontSize:12,padding:'4px 0'}}>
                  <span>{x.l}</span>
                  <Badge status={(x.v || 42) >= 42 ? 'active' : 'expiring'} label={`${x.v || 42} / 42`} />
                </div>
              ))}
            </div>

            {/* Driver Certifications */}
            <div className="chart-card" style={{padding:16,borderLeft:'3px solid var(--accent-amber)'}}>
              <h4 style={{marginBottom:12}}>Driver Certifications</h4>
              <GaugeChart value={((certs.valid || 60) / ((certs.valid || 60) + (certs.expiring || 3) + (certs.expired || 1))) * 100} label="Valid" thresholds={{red:85,amber:92,green:95}} />
              <div style={{fontSize:12,marginTop:12}}>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Valid</span><span style={{color:'var(--accent-green)'}}>{certs.valid || 60}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Expiring Soon</span><span style={{color:'var(--accent-amber)'}}>{certs.expiring || 3}</span></div>
                <div style={{display:'flex',justifyContent:'space-between',padding:'4px 0'}}><span>Expired</span><span style={{color:'var(--accent-red)'}}>{certs.expired || 1}</span></div>
              </div>
            </div>
          </div>
        </>;
      })()}

      {/* ═══ LIVE MAP TAB ═══ */}
      {tab === 'livemap' && <>
        <MapPanel
          title="Live Bus Fleet — Dubai"
          markers={(Array.isArray(liveFleet.data) ? liveFleet.data : []).map((b: any) => ({
            lat: b.lat, lng: b.lng, label: `${b.vehicleId} (${b.routeNumber})`, color: b.delaySec > 300 ? '#ef4444' : b.delaySec > 60 ? '#f59e0b' : '#22c55e',
            icon: '🚌', popup: `${b.vehicleId} — Route ${b.routeNumber}<br/>Driver: ${b.driver}<br/>Pax: ${b.onboard}/${b.capacity} (${Math.round(b.onboard/b.capacity*100)}%)<br/>Speed: ${b.speed} km/h<br/>Next: ${b.nextStop}${b.delaySec > 0 ? `<br/>⚠️ Delay: ${Math.round(b.delaySec/60)} min` : ''}`,
          })).concat([
            { lat: 25.0775, lng: 55.1390, label: 'Dubai Marina Mall', color: '#3b82f6', icon: '🚏', popup: 'Dubai Marina Mall — Stop DXB-F55-01' },
            { lat: 25.0934, lng: 55.1537, label: 'Media City', color: '#3b82f6', icon: '🚏', popup: 'Media City — Stop DXB-F55-03' },
            { lat: 25.1181, lng: 55.2008, label: 'Mall of Emirates', color: '#3b82f6', icon: '🚏', popup: 'Mall of Emirates — Stop DXB-E11-01' },
            { lat: 25.0441, lng: 55.1186, label: 'Ibn Battuta', color: '#3b82f6', icon: '🚏', popup: 'Ibn Battuta Mall — Stop DXB-X28-01' },
          ])}
          routes={[
            { points:[[25.0775,55.1390],[25.0798,55.1335],[25.0934,55.1537],[25.0990,55.1580],[25.1035,55.1645]] as [number,number][], color:'#06d6d6', label:'F55 — Marina Loop' },
            { points:[[25.1181,55.2008],[25.1404,55.2142],[25.1850,55.2550]] as [number,number][], color:'#f59e0b', label:'E11 — SZR Express' },
            { points:[[25.0441,55.1186],[25.0650,55.1350],[25.0775,55.1390]] as [number,number][], color:'#3b82f6', label:'X28 — Ibn Battuta Express' },
          ]}
          zones={[
            { lat: 25.0775, lng: 55.1390, radius: 500, color: '#06d6d6', label: 'Marina Terminal Zone' },
            { lat: 25.1181, lng: 55.2008, radius: 600, color: '#f59e0b', label: 'MOE Hub Zone' },
          ]}
          center={[25.09, 55.16]}
          zoom={12}
          height={480}
          showControls
        />
      </>}

      <Modal open={modal === 'view'} onClose={() => setModal(null)} title={`Route ${selected?.routeNumber || ''} — ${selected?.routeName || ''}`} lg>
        {selected && <DetailView items={[
          { label:'Route Number', value:selected.routeNumber },
          { label:'Route Name', value:selected.routeName },
          { label:'Route Type', value:selected.routeType },
          { label:'Status', value:selected.status },
          { label:'Distance', value:selected.distanceKm ? `${selected.distanceKm} km` : null },
          { label:'Est. Duration', value:selected.estimatedMinutes ? `${selected.estimatedMinutes} min` : null },
          { label:'Stops', value:selected.stopCount || selected.stops?.length },
          { label:'Fare', value:selected.fareAmount ? `AED ${selected.fareAmount}` : null },
          { label:'Created', value:fmtDate(selected.createdAt) },
        ]} />}
      </Modal>
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? `Edit Route ${selected?.routeNumber}` : 'Create Bus Route'}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleSave} disabled={saving || !form.routeNumber || !form.routeName}>{saving ? 'Saving...' : modal === 'edit' ? 'Update Route' : 'Create Route'}</button>
        </>}>
        <div className="form-grid">
          <FormField label="Route Number" value={form.routeNumber} onChange={set('routeNumber')} placeholder="F55" required />
          <FormField label="Route Name" value={form.routeName} onChange={set('routeName')} placeholder="Dubai Marina — JBR Loop" required />
          <FormField label="Route Type" type="select" value={form.routeType} onChange={set('routeType')} options={['express','local','brt','feeder','shuttle']} />
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={['active','suspended','planned','discontinued']} />
          <FormField label="Distance (km)" type="number" value={form.distanceKm} onChange={set('distanceKm')} />
          <FormField label="Est. Duration (min)" type="number" value={form.estimatedMinutes} onChange={set('estimatedMinutes')} />
          <FormField label="Stop Count" type="number" value={form.stopCount} onChange={set('stopCount')} />
          <FormField label="Fare (AED)" type="number" value={form.fareAmount} onChange={set('fareAmount')} />
        </div>
      </Modal>
      <ConfirmDialog open={confirm === 'delete'} onClose={() => setConfirm(null)} onConfirm={handleDelete} danger
        title="Delete Route" message={`Delete route ${selected?.routeNumber} (${selected?.routeName})? This cannot be undone.`} confirmLabel="Delete Route" />
      <toast.Toast />
    </div>
  );
}
