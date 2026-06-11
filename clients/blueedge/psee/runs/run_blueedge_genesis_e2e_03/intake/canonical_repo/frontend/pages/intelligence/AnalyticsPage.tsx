// AnalyticsPage — Fleet Analytics Hub (Expanded)
import React, { useState } from 'react';
import { analyticsApi } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast, useMediaQuery } from '@/hooks';
import { useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import TabBar from '@/components/ui/TabBar';
import TableCard from '@/components/data/TableCard';
import PageHeader from '@/components/layout/PageHeader';
import FormField from '@/components/ui/FormField';
import TrendCard from '@/components/charts/TrendCard';
import ChartCard from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import { fmt, fmtCur } from '@/utils';

const TABS = [
  { id:'fleet', label:'Fleet' }, { id:'drivers', label:'Drivers' }, { id:'fuel', label:'Fuel' },
  { id:'safety', label:'Safety' }, { id:'revenue', label:'Revenue' }, { id:'nl', label:'AI Query' },
];

export default function AnalyticsPage() {
  const { connected: wsConnected } = useSocketContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [tab, setTab] = useState('fleet');
  const toast = useToast();

  const { data: fleet, loading: fl } = useApiQuery(() => analyticsApi.getFleetSummary(), [], { refetchInterval: 60000 });
  const { data: drivers } = useApiQuery(() => analyticsApi.getDriverAnalytics(), [], { enabled: tab === 'drivers' });
  const { data: fuel } = useApiQuery(() => analyticsApi.getFuelAnalytics(), [], { enabled: tab === 'fuel' });
  const { data: safety } = useApiQuery(() => analyticsApi.getSafety(), [], { enabled: tab === 'safety' });
  const { data: revenue } = useApiQuery(() => analyticsApi.getRevenue(), [], { enabled: tab === 'revenue' });

  const { mutate, saving } = useApiMutation();
  const [nlQuery, setNlQuery] = useState('');
  const [nlResult, setNlResult] = useState<any>(null);

  const handleNlQuery = async () => {
    if (!nlQuery.trim()) return;
    const res = await mutate(() => analyticsApi.naturalLanguageQuery(nlQuery));
    if (res.ok) setNlResult(res.data); else toast.show(res.error || 'Query failed', 'error');
  };

  const f = (fleet as any) || {};
  const d = (drivers as any) || {};
  const fu = (fuel as any) || {};
  const sa = (safety as any) || {};
  const rv = (revenue as any) || {};

  return (
    <div>
      <PageHeader title="Fleet Analytics" breadcrumb="Analytics" subtitle={`AI-powered insights · ${wsConnected ? 'Live' : 'Offline'}`}
        right={wsConnected ? <ConnectionStatus compact /> : undefined} />

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'fleet' && <>
        {fl ? <Loading /> : <>
          <div className="stats-grid">
            <TrendCard label="Total Vehicles" value={fmt(f.totalVehicles || 120)} icon="🚛" color="cyan" sparkData={[110,112,115,117,118,120]} />
            <TrendCard label="Active" value={fmt(f.active || 105)} icon="🟢" color="green" />
            <TrendCard label="Utilization" value={`${f.utilization || 87.5}%`} icon="📊" color="cyan" trend={2.1} sparkData={[82,83,85,86,87,87.5]} />
            <TrendCard label="Avg Age" value={`${f.avgAgeYears || 3.2} yr`} icon="📅" color="blue" />
            <TrendCard label="Distance Today" value={`${fmt(f.distanceToday || 12450)} km`} icon="📍" color="green" sparkData={[10200,10800,11200,11800,12100,12450]} />
            <TrendCard label="Cost/km" value={fmtCur(f.costPerKm || 2.35)} icon="💰" color="amber" trend={-4.5} trendLabel="lower" />
          </div>
          <div className="chart-card" style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'20px',flexWrap:'wrap',gap:16,marginBottom:14}}>
            <GaugeChart value={87.5} label="Utilization" thresholds={{red:70,amber:80,green:85}} showTrend="up" />
            <GaugeChart value={94.2} label="Availability" thresholds={{red:80,amber:88,green:92}} showTrend="stable" />
            <GaugeChart value={97.1} label="On-Time %" thresholds={{red:85,amber:92,green:95}} showTrend="up" />
          </div>
          <div className={isMobile ? '' : 'grid-2'}>
            <ChartCard title="Fleet Utilization Trend (%)" type="line" height={220} data={{
              labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
              datasets: [
                { label:'Tanker', data:[82,84,83,86,85,88,87,89,88,90,89,87.5], borderColor:'#f59e0b', tension:0.4, borderWidth:2 },
                { label:'Bus', data:[78,80,82,84,83,85,86,87,88,89,90,91], borderColor:'#3b82f6', tension:0.4, borderWidth:2 },
                { label:'Taxi', data:[85,87,86,88,90,91,92,93,92,94,93,94], borderColor:'#22c55e', tension:0.4, borderWidth:2 },
              ],
            }} options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ y:{ min:70, max:100 } } }} />
            <ChartCard title="Vehicle Status Distribution" type="doughnut" height={220} data={{
              labels: ['Active','In Maintenance','Parked','Out of Service'],
              datasets: [{ data:[105,8,5,2], backgroundColor:['rgba(34,197,94,0.75)','rgba(245,158,11,0.75)','rgba(59,130,246,0.75)','rgba(239,68,68,0.75)'], borderWidth:0 }],
            }} options={{ cutout:'60%', plugins:{ legend:{ position:'bottom' as const } } }} />
          </div>
        </>}
      </>}

      {tab === 'drivers' && <>
        <div className="stats-grid">
          <TrendCard label="Total Drivers" value={fmt(d.totalDrivers || 85)} icon="👨‍✈️" color="cyan" />
          <TrendCard label="Avg Rating" value={`${d.avgRating || 4.72} ⭐`} icon="⭐" color="amber" />
          <TrendCard label="Avg Hours/Day" value={`${d.avgHoursPerDay || 8.2}h`} icon="⏱️" color="blue" />
          <TrendCard label="Safety Score" value={`${d.avgSafetyScore || 91.5}%`} icon="🛡️" color="green" sparkData={[87,88,89,90,91,91.5]} />
        </div>
        <div className={isMobile ? '' : 'grid-2'}>
          <ChartCard title="Driver Rating Distribution" type="bar" height={200} data={{
            labels: ['5.0','4.5-4.9','4.0-4.4','3.5-3.9','<3.5'],
            datasets: [{ data:[28,35,15,5,2], backgroundColor:['rgba(34,197,94,0.7)','rgba(132,204,22,0.7)','rgba(245,158,11,0.7)','rgba(249,115,22,0.7)','rgba(239,68,68,0.7)'], borderRadius:4 }],
          }} options={{ plugins:{ legend:{ display:false } } }} />
          <ChartCard title="Hours of Service Compliance" type="line" height={200} data={{
            labels: ['W1','W2','W3','W4'],
            datasets: [{ label:'Compliance %', data:[96,97,98,99], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', fill:true, tension:0.4, borderWidth:2 }],
          }} options={{ plugins:{ legend:{ display:false } }, scales:{ y:{ min:90, max:100 } } }} />
        </div>
      </>}

      {tab === 'fuel' && <>
        <div className="stats-grid">
          <TrendCard label="Fuel Cost/Month" value={fmtCur(fu.monthlyCost || 285000)} icon="⛽" color="amber" trend={-3.2} trendLabel="lower" />
          <TrendCard label="Avg L/100km" value={`${fu.avgConsumption || 28.5}`} icon="📊" color="blue" sparkData={[32,31,30,29.5,29,28.5]} />
          <TrendCard label="Idling Waste" value={fmtCur(fu.idlingWaste || 12500)} icon="🔥" color="red" trend={-18} />
          <TrendCard label="EV Savings" value={fmtCur(fu.evSavings || 42000)} icon="🔋" color="green" trend={15.2} />
        </div>
        <div className={isMobile ? '' : 'grid-2'}>
          <ChartCard title="Monthly Fuel Cost (AED K)" type="bar" height={220} data={{
            labels: ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'],
            datasets: [
              { label:'Diesel', data:[245,252,248,240,238,235,230,225], backgroundColor:'rgba(245,158,11,0.7)', borderRadius:3 },
              { label:'Petrol', data:[45,48,46,42,40,38,36,35], backgroundColor:'rgba(239,68,68,0.5)', borderRadius:3 },
              { label:'Electric', data:[8,10,12,15,18,20,22,25], backgroundColor:'rgba(34,197,94,0.7)', borderRadius:3 },
            ],
          }} options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ x:{ stacked:true }, y:{ stacked:true } } }} />
          <ChartCard title="Fuel Efficiency Trend (L/100km)" type="line" height={220} data={{
            labels: ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'],
            datasets: [{ label:'L/100km', data:[32,31.5,31,30.5,30,29.5,29,28.5], borderColor:'#06d6d6', backgroundColor:'rgba(6,214,214,0.08)', fill:true, tension:0.4, borderWidth:2 }],
          }} options={{ plugins:{ legend:{ display:false } } }} />
        </div>
      </>}

      {tab === 'safety' && <>
        <div className="stats-grid">
          <TrendCard label="Fleet Safety Score" value={`${sa.fleetScore || 94.2}%`} icon="🛡️" color="green" trend={2.4} sparkData={[89,90,91,92,93,94.2]} />
          <TrendCard label="Incidents (MTD)" value={fmt(sa.incidentsMtd || 3)} icon="🚨" color="red" trend={-40} trendLabel="fewer" />
          <TrendCard label="Harsh Events/Day" value={fmt(sa.harshEventsPerDay || 12)} icon="⚠️" color="amber" sparkData={[22,18,16,14,13,12]} />
          <TrendCard label="Seatbelt Compliance" value={`${sa.seatbeltPct || 99.2}%`} icon="🔒" color="green" />
        </div>
        <div className="chart-card" style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'20px',flexWrap:'wrap',gap:16,marginBottom:14}}>
          <GaugeChart value={94.2} label="Overall Safety" thresholds={{red:80,amber:88,green:92}} showTrend="up" />
          <GaugeChart value={99.2} label="Seatbelt" thresholds={{red:90,amber:95,green:98}} showTrend="stable" />
          <GaugeChart value={96.5} label="Speed Compliance" thresholds={{red:85,amber:92,green:95}} showTrend="up" />
          <GaugeChart value={88.3} label="Fatigue Risk" thresholds={{red:75,amber:82,green:88}} showTrend="up" />
        </div>
      </>}

      {tab === 'revenue' && <>
        <div className="stats-grid">
          <TrendCard label="Monthly Revenue" value={fmtCur(rv.monthlyRevenue || 1510000)} icon="💰" color="green" trend={8.3} sparkData={[1100,1200,1300,1380,1450,1510]} />
          <TrendCard label="OPEX" value={fmtCur(rv.opex || 920000)} icon="📊" color="amber" trend={-2.1} trendLabel="lower" />
          <TrendCard label="Profit Margin" value={`${rv.profitMargin || 39.1}%`} icon="📈" color="green" sparkData={[34,35,36,37,38,39.1]} />
          <TrendCard label="Revenue/Vehicle" value={fmtCur(rv.revenuePerVehicle || 12583)} icon="🚛" color="cyan" />
        </div>
        <div className={isMobile ? '' : 'grid-2'}>
          <ChartCard title="Revenue by Fleet (AED K)" type="bar" height={220} data={{
            labels: ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'],
            datasets: [
              { label:'Tanker', data:[580,620,590,640,670,710,720,750], backgroundColor:'rgba(245,158,11,0.7)', borderRadius:3 },
              { label:'Bus', data:[310,320,340,360,380,400,410,430], backgroundColor:'rgba(59,130,246,0.7)', borderRadius:3 },
              { label:'Taxi', data:[220,240,250,260,280,300,310,330], backgroundColor:'rgba(34,197,94,0.7)', borderRadius:3 },
            ],
          }} options={{ plugins:{ legend:{ position:'bottom' as const } } }} />
          <ChartCard title="Profit Margin Trend (%)" type="line" height={220} data={{
            labels: ['Jul','Aug','Sep','Oct','Nov','Dec','Jan','Feb'],
            datasets: [{ label:'Margin %', data:[34,35,35.5,36,37,37.5,38,39.1], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', fill:true, tension:0.4, borderWidth:2 }],
          }} options={{ plugins:{ legend:{ display:false } }, scales:{ y:{ min:30, max:45 } } }} />
        </div>
      </>}

      {tab === 'nl' && (
        <div style={{padding:24,background:'var(--bg-secondary)',borderRadius:8,border:'1px solid var(--border)'}}>
          <h3 style={{color:'#22d3ee',marginBottom:16}}>🤖 Natural Language Analytics</h3>
          <p style={{color:'var(--text-muted)',marginBottom:16,fontSize:13}}>Ask questions about your fleet data in plain English</p>
          <div style={{display:'flex',gap:8}}>
            <input value={nlQuery} onChange={e => setNlQuery(e.target.value)} placeholder="e.g., What's our fuel efficiency trend this quarter?"
              style={{flex:1,padding:'10px 14px',background:'var(--bg-tertiary, #1e293b)',border:'1px solid var(--border)',borderRadius:6,color:'var(--text-primary)',fontSize:14}}
              onKeyDown={e => e.key === 'Enter' && handleNlQuery()} />
            <button className="btn btn-cyan" onClick={handleNlQuery} disabled={saving}>{saving ? 'Querying...' : 'Ask'}</button>
          </div>
          <div style={{display:'flex',gap:6,marginTop:12,flexWrap:'wrap'}}>
            {['Show fleet utilization trend','Top 5 fuel-efficient drivers','Revenue breakdown by fleet','Safety incidents this month'].map(q => (
              <button key={q} className="btn btn-sm" style={{fontSize:11}} onClick={() => { setNlQuery(q); }}>{q}</button>
            ))}
          </div>
          {nlResult && (
            <div style={{marginTop:20,padding:16,background:'var(--bg-tertiary, #1e293b)',borderRadius:8,border:'1px solid var(--border)'}}>
              <pre style={{color:'var(--text-primary)',fontSize:13,whiteSpace:'pre-wrap'}}>{typeof nlResult === 'string' ? nlResult : JSON.stringify(nlResult, null, 2)}</pre>
            </div>
          )}
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
