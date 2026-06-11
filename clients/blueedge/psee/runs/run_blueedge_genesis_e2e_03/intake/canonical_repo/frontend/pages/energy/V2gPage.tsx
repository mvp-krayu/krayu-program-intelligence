// V2gPage — Vehicle-to-Grid Energy Trading (Expanded)
import React, { useState } from 'react';
import { v2gApi } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast, useMediaQuery } from '@/hooks';
import { useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Loading from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import TabBar from '@/components/ui/TabBar';
import CrudDataTable from '@/components/data/CrudDataTable';
import DetailView from '@/components/data/DetailView';
import TableCard from '@/components/data/TableCard';
import PageHeader from '@/components/layout/PageHeader';
import Modal from '@/components/ui/Modal';
import TrendCard from '@/components/charts/TrendCard';
import ChartCard from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import { fmtDate, fmt, fmtCur } from '@/utils';

const TABS = [
  { id:'dashboard', label:'Dashboard' }, { id:'contracts', label:'Contracts' },
  { id:'sessions', label:'Live Sessions' }, { id:'trading', label:'Trading' }, { id:'grid', label:'Grid Signals' },
];

export default function V2gPage() {
  const [tab, setTab] = useState('dashboard');
  const [selected, setSelected] = useState<any>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const toast = useToast();
  const { mutate } = useApiMutation();
  const { connected: wsConnected } = useSocketContext();

  const { data: dashboard } = useApiQuery(() => v2gApi.getDashboard(), [], { refetchInterval: 30000 });
  const { data: contracts } = useApiQuery(() => v2gApi.listContracts(), [], { enabled: tab === 'contracts' });
  const { data: sessions } = useApiQuery(() => v2gApi.getLiveSessions(), [], { enabled: tab === 'sessions', refetchInterval: 15000 });
  const { data: trading } = useApiQuery(() => v2gApi.getEnergyTrading(), [], { enabled: tab === 'trading' });
  const { data: grid } = useApiQuery(() => v2gApi.getGridSignals(), [], { enabled: tab === 'grid', refetchInterval: 10000 });

  const db = (dashboard as any) || {};
  const contractRows = Array.isArray(contracts) ? contracts : (contracts as any)?.items || [];
  const sessionRows = Array.isArray(sessions) ? sessions : (sessions as any)?.items || [];
  const tr = (trading as any) || {};
  const gr = (grid as any) || {};

  const handleStopSession = async (id: string) => {
    const res = await mutate(() => v2gApi.stopSession(id));
    if (res.ok) toast.show('Session stopped', 'success'); else toast.show(res.error || 'Failed', 'error');
  };

  return (
    <div>
      <PageHeader title="Vehicle-to-Grid (V2G)" breadcrumb="V2G"
        subtitle={`Bidirectional energy trading${wsConnected ? ' · Live grid' : ''}`}
        right={wsConnected ? <ConnectionStatus compact /> : undefined} />

      <div className="stats-grid">
        <TrendCard label="Active Sessions" value={fmt(db.activeSessions || 6)} icon="⚡" color="green" sparkData={[3,4,5,5,6,6]} />
        <TrendCard label="Energy Exported" value={`${db.energyExportedKwh || 842} kWh`} icon="🔋" color="cyan" trend={12.5} sparkData={[580,620,680,720,780,842]} />
        <TrendCard label="Revenue Today" value={fmtCur(db.revenueToday || 1250)} icon="💰" color="green" sparkData={[800,900,1000,1100,1180,1250]} />
        <TrendCard label="Grid Price" value={`AED ${db.currentGridPrice || 0.38}/kWh`} icon="📊" color="amber" sparkData={[0.32,0.34,0.35,0.36,0.37,0.38]} />
        <TrendCard label="Contracts" value={fmt(contractRows.length || 8)} icon="📋" color="blue" />
        <TrendCard label="CO₂ Offset" value={`${db.co2OffsetKg || 420} kg`} icon="🌱" color="green" trend={8.2} />
      </div>

      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'dashboard' && <>
        <div className="chart-card" style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'20px',flexWrap:'wrap',gap:16,marginBottom:14}}>
          <GaugeChart value={72} label="Fleet V2G Capacity" thresholds={{red:30,amber:50,green:65}} showTrend="up" />
          <GaugeChart value={88} label="Battery Health" thresholds={{red:70,amber:80,green:85}} showTrend="stable" />
          <GaugeChart value={95} label="Grid Sync" thresholds={{red:80,amber:90,green:94}} showTrend="stable" />
          <GaugeChart value={67} label="Energy Utilization" thresholds={{red:30,amber:50,green:60}} showTrend="up" />
        </div>
        <div className={isMobile ? '' : 'grid-2'}>
          <ChartCard title="Energy Export/Import (kWh)" type="bar" height={220} data={{
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [
              { label:'Exported', data:[120,145,135,160,180,95,65], backgroundColor:'rgba(34,197,94,0.7)', borderRadius:3 },
              { label:'Imported', data:[-85,-92,-88,-95,-110,-62,-45], backgroundColor:'rgba(59,130,246,0.7)', borderRadius:3 },
            ],
          }} options={{ plugins:{ legend:{ position:'bottom' as const } } }} />
          <ChartCard title="Revenue from V2G (AED)" type="line" height={220} data={{
            labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
            datasets: [{ label:'Revenue', data:[850,1020,980,1150,1250,680,450], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.08)', fill:true, tension:0.4, borderWidth:2 }],
          }} options={{ plugins:{ legend:{ display:false } } }} />
        </div>
      </>}

      {tab === 'contracts' && (
        <TableCard title="V2G Contracts" count={contractRows.length}>
          <CrudDataTable columns={[
            { label:'Vehicle', render: (r: any) => <span style={{fontWeight:600}}>{r.vehicleId}</span> },
            { label:'Utility', key:'utilityProvider' },
            { label:'Capacity', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.capacityKwh} kWh</span> },
            { label:'Rate', render: (r: any) => <span style={{fontFamily:'var(--font-mono)',color:'var(--accent-green)'}}>AED {r.ratePerKwh}/kWh</span> },
            { label:'Status', render: (r: any) => <Badge status={r.status} /> },
            { label:'Expires', render: (r: any) => fmtDate(r.expiryDate) },
          ]} rows={contractRows} onRowClick={(r: any) => setSelected(r)} />
        </TableCard>
      )}

      {tab === 'sessions' && (
        <TableCard title="Live V2G Sessions" count={sessionRows.length}>
          {sessionRows.length === 0 ? <div style={{padding:40,textAlign:'center',color:'var(--text-muted)'}}>No active V2G sessions</div> : (
            <CrudDataTable columns={[
              { label:'Vehicle', render: (r: any) => <span style={{fontWeight:600}}>{r.vehicleId}</span> },
              { label:'Direction', render: (r: any) => <Badge status={r.direction} /> },
              { label:'Power', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.powerKw} kW</span> },
              { label:'Energy', render: (r: any) => <span style={{fontFamily:'var(--font-mono)'}}>{r.energyKwh?.toFixed(1)} kWh</span> },
              { label:'Revenue', render: (r: any) => <span style={{color:'#22c55e',fontFamily:'var(--font-mono)'}}>AED {r.revenueAed?.toFixed(2)}</span> },
              { label:'', render: (r: any) => <button className="btn btn-sm" style={{background:'#ef4444',color:'#fff',fontSize:11}} onClick={(e) => { e.stopPropagation(); handleStopSession(r.id); }}>Stop</button> },
            ]} rows={sessionRows} onRowClick={(r: any) => setSelected(r)} />
          )}
        </TableCard>
      )}

      {tab === 'trading' && <>
        <div className={isMobile ? '' : 'grid-2'}>
          <ChartCard title="Grid Price Trend (AED/kWh)" type="line" height={220} data={{
            labels: Array.from({length:24}, (_,i) => `${String(i).padStart(2,'0')}:00`),
            datasets: [
              { label:'Buy Price', data:[0.22,0.20,0.18,0.18,0.19,0.24,0.32,0.42,0.45,0.40,0.35,0.30,0.28,0.25,0.24,0.28,0.35,0.48,0.52,0.45,0.38,0.32,0.28,0.24], borderColor:'#ef4444', tension:0.4, borderWidth:2 },
              { label:'Sell Price', data:[0.18,0.16,0.14,0.14,0.15,0.20,0.28,0.38,0.42,0.36,0.30,0.26,0.24,0.21,0.20,0.24,0.30,0.44,0.48,0.40,0.34,0.28,0.24,0.20], borderColor:'#22c55e', tension:0.4, borderWidth:2 },
            ],
          }} options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ y:{ title:{ display:true, text:'AED/kWh', color:'#8892a8' } } } }} />
          <ChartCard title="Monthly Trading Revenue (AED)" type="bar" height={220} data={{
            labels: ['Sep','Oct','Nov','Dec','Jan','Feb'],
            datasets: [{ label:'Revenue', data:[8500,12200,15800,18400,22100,24500], backgroundColor:'rgba(34,197,94,0.6)', borderRadius:4, borderSkipped:false }],
          }} options={{ plugins:{ legend:{ display:false } } }} />
        </div>
      </>}

      {tab === 'grid' && <>
        <div className="chart-card" style={{display:'flex',justifyContent:'space-around',alignItems:'center',padding:'20px',flexWrap:'wrap',gap:16,marginBottom:14}}>
          <GaugeChart value={gr.gridFrequency || 50.02} max={50.1} unit=" Hz" label="Grid Frequency" color={gr.gridFrequency > 50.05 ? '#22c55e' : gr.gridFrequency > 49.95 ? '#06d6d6' : '#ef4444'} />
          <GaugeChart value={gr.gridLoad || 78} label="Grid Load %" thresholds={{red:90,amber:80,green:0}} showTrend="stable" />
          <GaugeChart value={gr.renewablePct || 32} label="Renewable %" thresholds={{red:0,amber:20,green:30}} showTrend="up" />
        </div>
        <ChartCard title="Grid Load Profile (MW)" type="line" height={220} data={{
          labels: Array.from({length:24}, (_,i) => `${String(i).padStart(2,'0')}:00`),
          datasets: [
            { label:'Demand', data:[3200,2800,2600,2500,2600,3000,4200,5800,6200,5500,5000,4800,4600,4400,4200,4500,5200,6500,6800,6200,5400,4600,4000,3500], borderColor:'#ef4444', tension:0.4, borderWidth:2 },
            { label:'Generation', data:[3500,3200,3000,2900,2900,3200,4500,6000,6400,5800,5200,5000,4800,4600,4400,4700,5400,6800,7000,6500,5600,4800,4200,3700], borderColor:'#22c55e', tension:0.4, borderWidth:2 },
          ],
        }} options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ y:{ title:{ display:true, text:'MW', color:'#8892a8' } } } }} />
      </>}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Details" lg>
        {selected && <DetailView items={Object.entries(selected).map(([k, v]) => ({
          label: k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
          value: v instanceof Object ? JSON.stringify(v) : String(v ?? '—'),
        }))} />}
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
