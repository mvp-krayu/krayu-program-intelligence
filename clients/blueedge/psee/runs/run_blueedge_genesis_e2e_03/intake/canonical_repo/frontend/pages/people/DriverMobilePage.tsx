// DriverMobilePage — Driver Mobile App Emulator (Expanded)
import React, { useState } from 'react';
import { driverMobileApi } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast, useMediaQuery } from '@/hooks';
import { useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import TabBar from '@/components/ui/TabBar';
import TableCard from '@/components/data/TableCard';
import CrudDataTable from '@/components/data/CrudDataTable';
import PageHeader from '@/components/layout/PageHeader';
import TrendCard from '@/components/charts/TrendCard';
import ChartCard from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import { fmt, fmtCur } from '@/utils';

const TABS = [{ id:'home', label:'Home' }, { id:'trips', label:'My Trips' }, { id:'earnings', label:'Earnings' }, { id:'actions', label:'Quick Actions' }];

export default function DriverMobilePage() {
  const { connected: wsConnected } = useSocketContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [driverId] = useState('demo-driver-1');
  const [tab, setTab] = useState('home');
  const toast = useToast();
  const { mutate, saving } = useApiMutation();

  const { data: home, loading } = useApiQuery(() => driverMobileApi.getHome(driverId), [driverId], { refetchInterval: 30000 });
  const { data: nav } = useApiQuery(() => driverMobileApi.getNavigation(driverId), [driverId]);

  const h = (home as any) || {};
  const n = (nav as any) || {};

  const handleStartShift = async () => {
    const res = await mutate(() => driverMobileApi.startShift(driverId));
    if (res.ok) toast.show('Shift started', 'success'); else toast.show(res.error || 'Failed', 'error');
  };
  const handleEndShift = async () => {
    const res = await mutate(() => driverMobileApi.endShift(driverId));
    if (res.ok) toast.show('Shift ended', 'success'); else toast.show(res.error || 'Failed', 'error');
  };

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader title="Driver Mobile" breadcrumb="Driver App" subtitle={`Emulated driver experience${wsConnected ? ' · Connected' : ''}`}
        right={<div style={{display:'flex',gap:8,alignItems:'center'}}>
          {wsConnected && <ConnectionStatus compact />}
          <button className="btn btn-cyan" onClick={handleStartShift} disabled={saving}>▶ Start Shift</button>
          <button className="btn" onClick={handleEndShift} disabled={saving} style={{borderColor:'#ef4444',color:'#ef4444'}}>⏹ End Shift</button>
        </div>} />

      <div className="stats-grid">
        <TrendCard label="Today's Trips" value={fmt(h.tripsToday || 12)} icon="🚗" color="cyan" sparkData={[8,9,10,11,11,12]} />
        <TrendCard label="Distance" value={`${h.distanceKm || 186} km`} icon="📍" color="blue" sparkData={[120,135,150,165,178,186]} />
        <TrendCard label="Earnings Today" value={fmtCur(h.earningsToday || 580)} icon="💰" color="green" sparkData={[350,400,450,500,540,580]} />
        <TrendCard label="Rating" value={`${h.rating || 4.85} ⭐`} icon="⭐" color="amber" sparkData={[4.80,4.82,4.83,4.84,4.85,4.85]} />
        <TrendCard label="Online Hours" value={`${h.onlineHours || 7.5}h`} icon="⏱️" color="cyan" sparkData={[6,6.5,7,7.2,7.4,7.5]} />
        <TrendCard label="Acceptance" value={`${h.acceptanceRate || 96}%`} icon="✅" color="green" sparkData={[92,93,94,95,95,96]} />
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'home' && <>
        <div className="chart-card" style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'20px',flexWrap:'wrap',gap:16,marginBottom:14}}>
          <GaugeChart value={96} label="Acceptance Rate" thresholds={{red:80,amber:88,green:93}} showTrend="up" />
          <GaugeChart value={4.85} max={5} unit="" label="Driver Rating" color="#f59e0b" showTrend="stable" />
          <GaugeChart value={92} label="Safety Score" thresholds={{red:75,amber:85,green:90}} showTrend="up" />
        </div>

        {/* Navigation Info */}
        <div className="chart-card" style={{padding:16,marginBottom:14}}>
          <h4 style={{marginBottom:12}}>🗺️ Current Navigation</h4>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:12}}>
            {[
              {l:'Next Stop',v:n.nextStop||'Mall of Emirates',c:'cyan'}, {l:'ETA',v:n.eta||'8 min',c:'green'}, {l:'Distance',v:n.remainingKm?`${n.remainingKm} km`:'3.2 km',c:'blue'},
              {l:'Speed Limit',v:n.speedLimit||'80 km/h',c:'amber'}, {l:'Traffic',v:n.trafficLevel||'Moderate',c:'amber'}, {l:'Route',v:n.routeId||'F55 Marina Loop',c:'cyan'},
            ].map(item => (
              <div key={item.l} style={{background:'var(--bg-secondary)',borderRadius:8,padding:12,textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text-muted)'}}>{item.l}</div>
                <div style={{fontSize:16,fontWeight:700,color:`var(--accent-${item.c})`,marginTop:4}}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {tab === 'trips' && <>
        <TableCard title="Today's Trip Log" count={12}>
          <CrudDataTable columns={[
            { label:'#', render: (_: any, i: number) => <span style={{fontFamily:'var(--font-mono)',fontWeight:600}}>{12 - i}</span> },
            { label:'Pickup', key:'pickup' },
            { label:'Dropoff', key:'dropoff' },
            { label:'Distance', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.km} km</span> },
            { label:'Duration', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.min} min</span> },
            { label:'Fare', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-green)'}}>AED {r.fare}</span> },
            { label:'Rating', render: (r: any) => r.rating ? `⭐ ${r.rating}` : '—' },
          ]} rows={[
            {pickup:'Dubai Mall',dropoff:'Marina Gate',km:18.5,min:22,fare:65,rating:5},
            {pickup:'DIFC Gate',dropoff:'JBR Walk',km:14.2,min:18,fare:48,rating:5},
            {pickup:'DXB T3',dropoff:'Downtown',km:12.8,min:25,fare:85,rating:4},
            {pickup:'Business Bay',dropoff:'Palm Jumeirah',km:16.4,min:28,fare:72,rating:5},
            {pickup:'Mall of Emirates',dropoff:'Al Quoz',km:5.2,min:10,fare:22,rating:null},
            {pickup:'Gold Souk',dropoff:'Hilton Creek',km:3.8,min:8,fare:18,rating:5},
          ]} />
        </TableCard>
      </>}

      {tab === 'earnings' && <>
        <div className={isMobile ? '' : 'grid-2'}>
          <ChartCard title="Daily Earnings (AED)" type="bar" height={220} data={{
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [
              { label:'Fares', data:[480,520,490,545,620,680,580], backgroundColor:'rgba(34,197,94,0.7)', borderRadius:3 },
              { label:'Tips', data:[45,52,38,60,72,85,55], backgroundColor:'rgba(245,158,11,0.7)', borderRadius:3 },
            ],
          }} options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ x:{ stacked:true }, y:{ stacked:true, title:{ display:true, text:'AED', color:'#8892a8' } } } }} />
          <ChartCard title="Trips per Day" type="line" height={220} data={{
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [{ label:'Trips', data:[10,11,10,12,14,16,12], borderColor:'#06d6d6', backgroundColor:'rgba(6,214,214,0.08)', fill:true, tension:0.4, borderWidth:2 }],
          }} options={{ plugins:{ legend:{ display:false } } }} />
        </div>
        <div style={{height:14}} />
        <div className="chart-card" style={{padding:16}}>
          <h4 style={{marginBottom:12}}>💰 Earnings Summary</h4>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(5,1fr)',gap:12}}>
            {[{l:'Today',v:'AED 580'},{l:'This Week',v:'AED 3,915'},{l:'This Month',v:'AED 14,280'},{l:'Avg/Trip',v:'AED 48'},{l:'Tips Rate',v:'8.5%'}].map(item => (
              <div key={item.l} style={{background:'var(--bg-secondary)',borderRadius:8,padding:12,textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text-muted)'}}>{item.l}</div>
                <div style={{fontSize:16,fontWeight:700,color:'var(--accent-green)',marginTop:4,fontFamily:'var(--font-mono)'}}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>
      </>}

      {tab === 'actions' && (
        <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'repeat(3,1fr)',gap:16}}>
          {[
            {icon:'📝',title:'Pre-trip Checklist',desc:'Complete vehicle inspection before starting your shift'},
            {icon:'🚨',title:'Report Incident',desc:'Report an accident, breakdown, or safety concern'},
            {icon:'⛽',title:'Log Fuel Stop',desc:'Record fuel fill-up with amount and odometer'},
            {icon:'🔧',title:'Request Maintenance',desc:'Submit a maintenance request for your vehicle'},
            {icon:'📞',title:'Contact Dispatch',desc:'Call or message the dispatch center'},
            {icon:'📊',title:'View Performance',desc:'See your weekly performance metrics and targets'},
            {icon:'🏥',title:'Report Break',desc:'Log a mandatory rest break per FMCSA hours'},
            {icon:'📋',title:'Post-trip Report',desc:'Complete end-of-shift vehicle condition report'},
            {icon:'🎓',title:'Training Modules',desc:'Access required safety and compliance training'},
          ].map(item => (
            <div key={item.title} className="chart-card" style={{padding:16,cursor:'pointer',transition:'border-color 0.2s'}}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-color)')}>
              <div style={{fontSize:28,marginBottom:8}}>{item.icon}</div>
              <div style={{fontWeight:600,marginBottom:4}}>{item.title}</div>
              <div style={{fontSize:12,color:'var(--text-muted)'}}>{item.desc}</div>
            </div>
          ))}
        </div>
      )}


      {/* Status Overview */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {[
          { title: 'Operational Health', items: [['System Uptime', '99.97%'], ['API Latency', '42ms'], ['Error Rate', '0.03%'], ['Connections', '1,284']] },
          { title: 'Fleet Status', items: [['Active Vehicles', '198'], ['In Transit', '87'], ['At Depot', '96'], ['Maintenance', '15']] },
          { title: 'Today Highlights', items: [['Trips Completed', '342'], ['Revenue', '28,450 AED'], ['Fuel Consumed', '4,280L'], ['Distance', '12,450 km']] },
        ].map((card, ci) => (
          <div key={ci} className="card" style={{ padding: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#22d3ee', marginBottom: 10 }}>{card.title}</h4>
            {card.items.map(([lbl, val], ii) => (
              <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: ii < 3 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{lbl}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Recent Activity */}
      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#22d3ee' }}>🕐 Recent Activity</h3>
        {[
          { time: '2 min ago', action: 'System health check completed', user: 'System', sev: 'info' },
          { time: '15 min ago', action: 'Record created by dispatcher', user: 'Fatima Al Zaabi', sev: 'success' },
          { time: '42 min ago', action: 'Alert acknowledged and resolved', user: 'Khalid Al Maktoum', sev: 'warning' },
          { time: '1 hour ago', action: 'Scheduled maintenance triggered', user: 'System', sev: 'info' },
          { time: '2 hours ago', action: 'Configuration updated', user: 'Borhane Admin', sev: 'success' },
          { time: '3 hours ago', action: 'Driver score recalculated', user: 'AI Agent', sev: 'info' },
          { time: '5 hours ago', action: 'Compliance report generated', user: 'System', sev: 'success' },
          { time: '8 hours ago', action: 'Night shift handover', user: 'Ahmed Al Mansouri', sev: 'info' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 7 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.sev === 'warning' ? '#f59e0b' : a.sev === 'success' ? '#10b981' : '#64748b' }} />
              <span style={{ fontSize: 13 }}>{a.action}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
              <span>{a.user}</span>
              <span>{a.time}</span>
            </div>
          </div>
        ))}
      </div>

      <toast.Toast />
    </div>
  );
}
