import React, { useState } from 'react';
import PageHeader from '@/components/layout/PageHeader';
import TrendCard from '@/components/charts/TrendCard';
import ChartCard from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import TabBar from '@/components/ui/TabBar';
import Badge from '@/components/ui/Badge';
import Loading from '@/components/ui/Loading';
import CrudDataTable from '@/components/data/CrudDataTable';
import TableCard from '@/components/data/TableCard';
import Modal from '@/components/ui/Modal';
import DetailView from '@/components/data/DetailView';
import { useSocketContext } from '@/socket';
import { useToast } from '@/hooks';
import { fmtDate, fmtCur } from '@/utils';

const TABS = [
  { id: 'map', label: '🗺️ Network Map' },
  { id: 'stations', label: '⚡ Stations' },
  { id: 'sessions', label: '📊 Sessions' },
  { id: 'pricing', label: '💰 Pricing' },
  { id: 'analytics', label: '📈 Analytics' },
];
const spark = (n: number) => Array.from({ length: 12 }, () => n * (0.85 + Math.random() * 0.3));

export default function ChargingStationsPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('map');
  const [selected, setSelected] = useState<any>(null);
  const toast = useToast();

  const kpis = [
    { title: 'Total Stations', value: 48, trend: 4, sparkline: spark(48) },
    { title: 'Available', value: 32, trend: 2, sparkline: spark(32) },
    { title: 'In Use', value: 14, trend: 2, sparkline: spark(14) },
    { title: 'Offline', value: 2, trend: -1, sparkline: spark(2) },
    { title: 'Energy (kWh)', value: 2450, trend: 180, sparkline: spark(2450) },
    { title: 'Avg Session', value: '45 min', trend: -3, sparkline: spark(50) },
  ];

  const tableRows = Array.from({ length: 8 }, (_, i) => ({
    id: `${'CHA'.slice(0,3)}-${String(i+1).padStart(3,'0')}`,
    name: ["Al Quoz Depot", "Marina Hub", "JAFZA Terminal", "DXB Airport", "Business Bay", "Palm Zone", "Deira Gate", "JBR Station"][i],
    type: ['primary','secondary','primary','critical','standard','standard','secondary','primary'][i],
    status: ["active", "active", "maintenance", "active", "active", "inactive", "active", "active"][i],
    priority: ["high", "medium", "critical", "low", "medium", "high", "low", "critical"][i],
    owner: ["Khalid", "Fatima", "Ahmed", "Sara", "Omar", "Hassan", "Borhane", "Nasser"][i],
    value: `${(1000 + Math.random()*9000).toFixed(0)} AED`,
    updatedAt: new Date(Date.now() - i * 3600000 * 4),
  }));

  return (
    <div>
      <PageHeader title="Charging Stations" breadcrumb="Charging" subtitle="EV charging station network management" />
      <div className="grid grid-3" style={{ marginBottom: 20 }}>{{}kpis.map((k, i) => <TrendCard key={i} {...k} />){}}</div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'map' && (<>
        <div className="grid grid-2">
          <ChartCard title="Charging Stations — Trend" type="line" data={{ labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [
            { label: 'Current', data: [59, 95, 55, 94, 92, 44], borderColor: '#22d3ee', fill: true, backgroundColor: 'rgba(34,211,238,0.1)' },
            { label: 'Previous', data: [59, 46, 66, 61, 73, 36], borderColor: '#64748b', borderDash: [5,5] },
          ] }} />
          <ChartCard title="Distribution" type="doughnut" data={{ labels: ['Tanker','Bus','Taxi','EV','Other'], datasets: [{ data: [31, 37, 11, 12, 37], backgroundColor: ['#22d3ee','#f59e0b','#10b981','#8b5cf6','#ef4444'] }] }} />
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          <GaugeChart title="Performance" value={67.6} max={100} thresholds={[60, 80]} trend={3.5} />
          <GaugeChart title="Efficiency" value={85.5} max={100} thresholds={[55, 75]} trend={2.0} />
          <GaugeChart title="Compliance" value={90.4} max={100} thresholds={[80, 90]} trend={0.1} />
          <GaugeChart title="Utilization" value={74.6} max={100} thresholds={[50, 75]} trend={0.5} />
        </div>
      </>)}

      {tab === 'stations' && (
        <TableCard title="Stations" count={tableRows.length}>
          <CrudDataTable columns={[
            { label: 'ID', render: (r: any) => r.id },
            { label: 'Name', key: 'name' },
            { label: 'Type', render: (r: any) => <Badge status={r.type} /> },
            { label: 'Status', render: (r: any) => <Badge status={r.status} /> },
            { label: 'Value', render: (r: any) => r.value || '—' },
            { label: 'Updated', render: (r: any) => fmtDate(r.updatedAt) },
          ]} rows={tableRows} onRowClick={(r: any) => setSelected(r)} />
        </TableCard>
      )}

      {tab === 'sessions' && (<>
        <div className="grid grid-2">
          <ChartCard title="Monthly Comparison" type="bar" data={{ labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [
            { label: 'Actual', data: [45, 46, 56, 58, 62, 77], backgroundColor: '#22d3ee' },
            { label: 'Target', data: [54, 73, 64, 61, 55, 67], backgroundColor: '#334155' },
          ] }} />
          <ChartCard title="Category Split" type="doughnut" data={{ labels: ['Category A','Category B','Category C','Category D'], datasets: [{ data: [24, 19, 41, 32], backgroundColor: ['#22d3ee','#f59e0b','#10b981','#8b5cf6'] }] }} />
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          <GaugeChart title="Quality" value={75.4} max={100} thresholds={[70, 85]} trend={0.2} />
          <GaugeChart title="Coverage" value={66.9} max={100} thresholds={[60, 80]} trend={3.5} />
          <GaugeChart title="Accuracy" value={81.3} max={100} thresholds={[80, 90]} trend={-0.4} />
          <GaugeChart title="Speed" value={91.7} max={100} thresholds={[50, 75]} trend={2.3} />
        </div>
      </>)}

      {tab === 'pricing' && (
        <TableCard title="Pricing" count={6}>
          <CrudDataTable columns={[
            { label: 'ID', render: (r: any) => r.id },
            { label: 'Description', key: 'description' },
            { label: 'Priority', render: (r: any) => <Badge status={r.priority} /> },
            { label: 'Owner', key: 'owner' },
            { label: 'Due', render: (r: any) => fmtDate(r.dueDate) },
            { label: 'Status', render: (r: any) => <Badge status={r.status} /> },
          ]} rows={Array.from({ length: 6 }, (_, i) => ({
            id: `TASK-${String(i+1).padStart(3,'0')}`,
            description: ['Quarterly review','System upgrade','Compliance audit','Performance tuning','Data migration','Security patch'][i],
            priority: ['high','medium','critical','low','medium','high'][i],
            owner: ["Khalid", "Fatima", "Ahmed", "Sara", "Omar", "Hassan"][i],
            dueDate: new Date(Date.now() + (i+1) * 86400000 * 3),
            status: ['in_progress','pending','scheduled','completed','in_progress','pending'][i],
          }))} onRowClick={(r: any) => setSelected(r)} />
        </TableCard>
      )}

      {tab === 'analytics' && (<>
        <div className="grid grid-2">
          <ChartCard title="Trend Analysis" type="line" data={{ labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [
            { label: 'Performance', data: [73, 60, 87, 72, 88, 71], borderColor: '#22d3ee' },
            { label: 'Target', data: [80,80,82,82,85,85], borderColor: '#f59e0b', borderDash: [5,5] },
          ] }} />
          <ChartCard title="Weekly Distribution" type="bar" data={{ labels: ['Week 1','Week 2','Week 3','Week 4'], datasets: [
            { label: 'Completed', data: [24, 19, 41, 32], backgroundColor: '#10b981' },
            { label: 'Pending', data: [9, 11, 7, 7], backgroundColor: '#f59e0b' },
            { label: 'Overdue', data: [4, 8, 3, 7], backgroundColor: '#ef4444' },
          ] }} />
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          <GaugeChart title="Overall" value={90.5} max={100} thresholds={[65, 80]} trend={1.3} />
          <GaugeChart title="Trend" value={86.4} max={100} thresholds={[55, 75]} trend={3.5} />
          <GaugeChart title="Target Hit" value={92.8} max={100} thresholds={[70, 85]} trend={2.3} />
          <GaugeChart title="Velocity" value={84.1} max={100} thresholds={[50, 70]} trend={2.6} />
        </div>
      </>)}

      {/* Summary Cards */}
      <div className="grid grid-4" style={{ marginTop: 20 }}>
        {[
          { label: 'Today', value: Math.round(Math.random() * 50 + 10), icon: '📅', color: '#22d3ee' },
          { label: 'This Week', value: Math.round(Math.random() * 200 + 50), icon: '📊', color: '#f59e0b' },
          { label: 'This Month', value: Math.round(Math.random() * 800 + 200), icon: '📈', color: '#10b981' },
          { label: 'Quarter', value: Math.round(Math.random() * 2000 + 500), icon: '🗓️', color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 4 }}>{{}s.icon{}}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{{}s.value{}}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{{}s.label{}}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Feed */}
      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#22d3ee' }}>🕐 Recent Activity</h3>
        {[
          { time: '2 min ago', action: 'System health check completed', user: 'System', sev: 'info' },
          { time: '15 min ago', action: 'New record created by dispatcher', user: 'Fatima Al Zaabi', sev: 'success' },
          { time: '42 min ago', action: 'Alert acknowledged and resolved', user: 'Khalid Al Maktoum', sev: 'warning' },
          { time: '1 hour ago', action: 'Scheduled maintenance triggered', user: 'System', sev: 'info' },
          { time: '2 hours ago', action: 'Configuration updated', user: 'Borhane Admin', sev: 'success' },
          { time: '3 hours ago', action: 'Driver safety score recalculated', user: 'AI Agent', sev: 'info' },
          { time: '5 hours ago', action: 'Compliance report auto-generated', user: 'System', sev: 'success' },
          { time: '8 hours ago', action: 'Night shift handover completed', user: 'Ahmed Al Mansouri', sev: 'info' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 7 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.sev === 'warning' ? '#f59e0b' : a.sev === 'success' ? '#10b981' : '#64748b' }} />
              <span style={{ fontSize: 13 }}>{{}a.action{}}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
              <span>{{}a.user{}}</span>
              <span>{{}a.time{}}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Status Overview */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {[
          { title: 'Operational Health', items: [['System Uptime', '99.97%'], ['API Latency', '42ms'], ['Error Rate', '0.03%'], ['Active Connections', '1,284']] },
          { title: 'Fleet Status', items: [['Active Vehicles', '198'], ['In Transit', '87'], ['At Depot', '96'], ['Maintenance', '15']] },
          { title: 'Today Highlights', items: [['Trips Completed', '342'], ['Revenue Generated', '28,450 AED'], ['Fuel Consumed', '4,280L'], ['Distance Covered', '12,450 km']] },
        ].map((card, ci) => (
          <div key={ci} className="card" style={{ padding: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#22d3ee', marginBottom: 10 }}>{{}card.title{}}</h4>
            {card.items.map(([lbl, val], ii) => (
              <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: ii < 3 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{{}lbl{}}</span>
                <span style={{ fontWeight: 600 }}>{{}val{}}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Details" lg>
        {selected && <DetailView items={Object.entries(selected).filter(([k]) => !['__v'].includes(k)).map(([k, v]) => ({
          label: k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
          value: v instanceof Date ? fmtDate(v) : v instanceof Object ? JSON.stringify(v) : String(v ?? '—'),
        }))} />}
      </Modal>
      <toast.Toast />
    </div>
  );
}
