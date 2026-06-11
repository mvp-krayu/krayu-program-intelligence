// SurgePricingPage — Dynamic Surge Pricing Engine (Expanded)
import React, { useState } from 'react';
import { surgePricingApi } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast, useMediaQuery } from '@/hooks';
import { useFleetPositions, useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import TabBar from '@/components/ui/TabBar';
import CrudDataTable from '@/components/data/CrudDataTable';
import DetailView from '@/components/data/DetailView';
import TableCard from '@/components/data/TableCard';
import PageHeader from '@/components/layout/PageHeader';
import Modal from '@/components/ui/Modal';
import FormField from '@/components/ui/FormField';
import TrendCard from '@/components/charts/TrendCard';
import ChartCard from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import { fmt, fmtCur } from '@/utils';

const TABS = [
  { id:'zones', label:'Active Zones' }, { id:'heatmap', label:'Demand Heatmap' },
  { id:'config', label:'Pricing Config' }, { id:'revenue', label:'Revenue Impact' },
];

export default function SurgePricingPage() {
  const { connected: wsConnected } = useSocketContext();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { positions: taxiPositions } = useFleetPositions('taxi');
  const [tab, setTab] = useState('zones');
  const [selected, setSelected] = useState<any>(null);
  const [calcModal, setCalcModal] = useState(false);
  const [fareForm, setFareForm] = useState({ origin:'', destination:'', distanceKm:10, timeOfDay:'08:00' });
  const [fareResult, setFareResult] = useState<any>(null);
  const toast = useToast();
  const { mutate } = useApiMutation();

  const { data: zones } = useApiQuery(() => surgePricingApi.getActiveZones(), [], { refetchInterval: 15000 });
  const { data: heatmap } = useApiQuery(() => surgePricingApi.getDemandHeatmap(), [], { enabled: tab === 'heatmap', refetchInterval: 30000 });
  const { data: config } = useApiQuery(() => surgePricingApi.getPricingConfig(), [], { enabled: tab === 'config' });
  const { data: revenue } = useApiQuery(() => surgePricingApi.getRevenueImpact(), [], { enabled: tab === 'revenue' });

  const zoneRows = Array.isArray(zones) ? zones : (zones as any)?.items || [];
  const heatData = (heatmap as any) || {};
  const configData = (config as any) || {};
  const revData = (revenue as any) || {};
  const set = (k: string) => (v: any) => setFareForm(p => ({ ...p, [k]: v }));

  const handleCalc = async () => {
    const res = await mutate(() => surgePricingApi.calculateFare(fareForm));
    if (res.ok) setFareResult(res.data); else toast.show(res.error || 'Failed', 'error');
  };

  return (
    <div>
      <PageHeader title="Surge Pricing" breadcrumb="Surge Pricing"
        subtitle={`Dynamic pricing engine${wsConnected ? ` · ${taxiPositions.length} taxis live` : ''}`}
        right={<div style={{display:'flex',gap:8,alignItems:'center'}}>
          {wsConnected && <ConnectionStatus compact />}
          <button className="btn btn-cyan" onClick={() => setCalcModal(true)}>🧮 Fare Calculator</button>
        </div>} />

      <div className="stats-grid">
        <TrendCard label="Active Zones" value={fmt(zoneRows.length || 8)} icon="📍" color="cyan" sparkData={[6,7,7,8,8,8]} />
        <TrendCard label="Surge Zones" value={fmt(zoneRows.filter((z:any) => z.multiplier > 1.0 || z.surgeMultiplier > 1.0).length || 4)} icon="📈" color="amber" sparkData={[2,3,3,4,4,4]} />
        <TrendCard label="Max Multiplier" value="2.0×" icon="🔥" color="red" sparkData={[1.5,1.6,1.8,1.9,2.0,2.0]} />
        <TrendCard label="Surge Revenue" value={fmtCur(revData.surgeRevenue || 4250)} icon="💰" color="green" trend={18} sparkData={[2800,3100,3500,3800,4050,4250]} />
        <TrendCard label="Avg Wait (Surge)" value="6.2 min" icon="⏱️" color="amber" sparkData={[8,7.5,7,6.8,6.5,6.2]} />
        <TrendCard label="Supply/Demand" value={`${fmt(106)}/${fmt(415)}`} icon="⚖️" color="blue" />
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'zones' && (
        <TableCard title="Active Surge Zones" count={zoneRows.length}>
          {zoneRows.length === 0 ? <div style={{padding:40,textAlign:'center',color:'#22c55e'}}>No active surge zones</div> : (
            <CrudDataTable columns={[
              { label:'Zone', render: (r: any) => <span style={{fontWeight:600}}>{r.name}</span> },
              { label:'Multiplier', render: (r: any) => {
                const m = r.multiplier || r.surgeMultiplier || 1.0;
                return <span style={{color: m > 1.5 ? '#ef4444' : m > 1.2 ? '#f97316' : '#22c55e', fontWeight:700, fontFamily:'var(--font-mono)'}}>{m}×</span>;
              }},
              { label:'Demand', render: (r: any) => <Badge status={r.demandLevel || (r.currentDemand > 50 ? 'high' : 'normal')} label={r.demandLevel || `${r.currentDemand || 0} req`} /> },
              { label:'Vehicles', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.activeVehicles || r.availableTaxis || 0}</span> },
              { label:'Req/min', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.requestsPerMinute || '—'}</span> },
              { label:'Status', render: (r: any) => <Badge status={(r.multiplier || r.surgeMultiplier || 1) > 1 ? 'expiring' : 'active'} label={(r.multiplier || r.surgeMultiplier || 1) > 1 ? 'SURGE' : 'Normal'} /> },
            ]} rows={zoneRows} onRowClick={(r: any) => setSelected(r)} />
          )}
        </TableCard>
      )}

      {tab === 'heatmap' && <>
        <div className="chart-card" style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'20px',flexWrap:'wrap',gap:16,marginBottom:14}}>
          <GaugeChart value={78} label="Demand Intensity" thresholds={{red:80,amber:60,green:0}} showTrend="up" />
          <GaugeChart value={45} label="Supply Coverage" thresholds={{red:30,amber:45,green:60}} showTrend="stable" />
          <GaugeChart value={6.2} max={15} unit=" min" label="Avg Wait Time" color={6.2 > 8 ? '#ef4444' : '#f59e0b'} />
        </div>
        <div className={isMobile ? '' : 'grid-2'}>
          <ChartCard title="Demand by Zone (requests/hr)" type="bar" height={220} data={{
            labels: ['Global Village','DXB Airport T3','DIFC','JBR','Dubai Mall','Palm','Deira','DXB T1'],
            datasets: [{ label:'Demand', data:[120,85,55,35,42,22,18,38], backgroundColor:['rgba(239,68,68,0.7)','rgba(245,158,11,0.7)','rgba(245,158,11,0.7)','rgba(59,130,246,0.7)','rgba(59,130,246,0.7)','rgba(34,197,94,0.7)','rgba(34,197,94,0.7)','rgba(59,130,246,0.7)'], borderRadius:4, borderSkipped:false }],
          }} options={{ indexAxis:'y' as const, plugins:{ legend:{ display:false } } }} />
          <ChartCard title="Demand vs Supply (Today)" type="line" height={220} data={{
            labels: ['06','08','10','12','14','16','18','20','22'],
            datasets: [
              { label:'Demand', data:[85,280,180,220,250,320,415,380,190], borderColor:'#ef4444', tension:0.4, borderWidth:2 },
              { label:'Supply', data:[120,105,108,102,98,95,106,110,115], borderColor:'#22c55e', tension:0.4, borderWidth:2 },
            ],
          }} options={{ plugins:{ legend:{ position:'bottom' as const } } }} />
        </div>
      </>}

      {tab === 'config' && <>
        <div className="chart-card" style={{padding:16,marginBottom:14}}>
          <h4 style={{marginBottom:12}}>Pricing Parameters</h4>
          <div style={{display:'grid',gridTemplateColumns:isMobile?'1fr 1fr':'repeat(4,1fr)',gap:12}}>
            {[
              {l:'Base Fare',v:`AED ${configData.baseFare || 12}`},{l:'Per KM Rate',v:`AED ${configData.perKmRate || 1.96}`},
              {l:'Per Min Rate',v:`AED ${configData.perMinRate || 0.54}`},{l:'Min Fare',v:`AED ${configData.minFare || 12}`},
              {l:'Max Surge',v:`${configData.maxSurge || 3.0}×`},{l:'Surge Step',v:`${configData.surgeStep || 0.1}×`},
              {l:'Demand Threshold',v:`${configData.demandThreshold || 1.5}× supply`},{l:'Cool-down',v:`${configData.cooldownMin || 5} min`},
            ].map(item => (
              <div key={item.l} style={{background:'var(--bg-secondary)',borderRadius:8,padding:12,textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text-muted)'}}>{item.l}</div>
                <div style={{fontSize:16,fontWeight:700,fontFamily:'var(--font-mono)',color:'var(--accent-cyan)',marginTop:4}}>{item.v}</div>
              </div>
            ))}
          </div>
        </div>
        <ChartCard title="Surge Multiplier Schedule" type="line" height={200} data={{
          labels: Array.from({length:24},(_,i) => `${String(i).padStart(2,'0')}:00`),
          datasets: [{ label:'Avg Multiplier', data:[1.0,1.0,1.0,1.0,1.0,1.0,1.2,1.5,1.8,1.4,1.2,1.1,1.0,1.0,1.1,1.2,1.5,1.8,2.0,1.6,1.3,1.1,1.0,1.0], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.08)', fill:true, tension:0.4, borderWidth:2 }],
        }} options={{ plugins:{ legend:{ display:false } }, scales:{ y:{ min:0.8, max:2.5, title:{ display:true, text:'Multiplier', color:'#8892a8' } } } }} />
      </>}

      {tab === 'revenue' && <>
        <div className={isMobile ? '' : 'grid-2'}>
          <ChartCard title="Surge vs Base Revenue (AED)" type="bar" height={220} data={{
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [
              { label:'Base Revenue', data:[22000,24000,23000,25000,26000,28000,24000], backgroundColor:'rgba(59,130,246,0.6)', borderRadius:3 },
              { label:'Surge Premium', data:[2800,3500,3100,4200,5200,6800,4250], backgroundColor:'rgba(245,158,11,0.7)', borderRadius:3 },
            ],
          }} options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ x:{ stacked:true }, y:{ stacked:true } } }} />
          <ChartCard title="Surge Revenue % of Total" type="line" height={220} data={{
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [{ label:'Surge %', data:[11.3,12.7,11.9,14.4,16.7,19.5,15.0], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.08)', fill:true, tension:0.4, borderWidth:2 }],
          }} options={{ plugins:{ legend:{ display:false } }, scales:{ y:{ title:{ display:true, text:'%', color:'#8892a8' } } } }} />
        </div>
      </>}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Zone Details" lg>
        {selected && <DetailView items={Object.entries(selected).map(([k, v]) => ({
          label: k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
          value: v instanceof Object ? JSON.stringify(v) : String(v ?? '—'),
        }))} />}
      </Modal>

      <Modal open={calcModal} onClose={() => setCalcModal(false)} title="🧮 Fare Calculator"
        footer={<><button className="btn btn-ghost" onClick={() => setCalcModal(false)}>Close</button><button className="btn btn-cyan" onClick={handleCalc}>Calculate</button></>}>
        <div className="form-grid">
          <FormField label="Origin" value={fareForm.origin} onChange={set('origin')} placeholder="Al Barsha" />
          <FormField label="Destination" value={fareForm.destination} onChange={set('destination')} placeholder="Downtown Dubai" />
          <FormField label="Distance (km)" type="number" value={fareForm.distanceKm} onChange={set('distanceKm')} />
          <FormField label="Time" value={fareForm.timeOfDay} onChange={set('timeOfDay')} />
        </div>
        {fareResult && (
          <div style={{marginTop:16,padding:12,background:'var(--bg-tertiary, #1e293b)',borderRadius:8}}>
            <DetailView items={Object.entries(fareResult).map(([k, v]) => ({
              label: k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
              value: typeof v === 'number' ? `AED ${v.toFixed(2)}` : String(v ?? '—'),
            }))} />
          </div>
        )}
      </Modal>

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
