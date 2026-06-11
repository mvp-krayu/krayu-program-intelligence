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
  { id: 'programs', label: '🏆 Programs' },
  { id: 'leaderboard', label: '🥇 Leaderboard' },
  { id: 'rewards', label: '💰 Rewards' },
  { id: 'performance', label: '📊 Performance' },
  { id: 'config', label: '⚙️ Config' },
];
const spark = (n: number) => Array.from({ length: 12 }, () => n * (0.85 + Math.random() * 0.3));

export default function DriverIncentivesPage() {
  const { connected: wsConnected } = useSocketContext();
  const [tab, setTab] = useState('programs');
  const [selected, setSelected] = useState<any>(null);
  const toast = useToast();

  const kpis = [
    { title: 'Active Programs', value: 8, trend: 2, sparkline: spark(8) },
    { title: 'Participating', value: 156, trend: 12, sparkline: spark(156) },
    { title: 'Rewards Paid', value: '45,200 AED', trend: 3500, sparkline: spark(50) },
    { title: 'Top Score', value: 98.5, trend: 1.2, sparkline: spark(98) },
    { title: 'Improvement', value: '+12.3%', trend: 2.1, sparkline: spark(50) },
    { title: 'ROI', value: '3.2x', trend: 0.4, sparkline: spark(50) },
  ];

  const tableRows = Array.from({ length: 8 }, (_, i) => ({
    id: `${'INC'.slice(0,3)}-${String(i+1).padStart(3,'0')}`,
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
      <PageHeader title="Driver Incentives" breadcrumb="Incentives" subtitle="Performance-based reward programs for fleet drivers" />
      <div className="grid grid-3" style={{ marginBottom: 20 }}>{{}kpis.map((k, i) => <TrendCard key={i} {...k} />){}}</div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'programs' && (<>
        <div className="grid grid-2">
          <ChartCard title="Driver Incentives — Trend" type="line" data={{ labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [
            { label: 'Current', data: [76, 40, 81, 82, 46, 63], borderColor: '#22d3ee', fill: true, backgroundColor: 'rgba(34,211,238,0.1)' },
            { label: 'Previous', data: [38, 73, 53, 32, 41, 68], borderColor: '#64748b', borderDash: [5,5] },
          ] }} />
          <ChartCard title="Distribution" type="doughnut" data={{ labels: ['Tanker','Bus','Taxi','EV','Other'], datasets: [{ data: [26, 38, 33, 45, 31], backgroundColor: ['#22d3ee','#f59e0b','#10b981','#8b5cf6','#ef4444'] }] }} />
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          <GaugeChart title="Performance" value={71.2} max={100} thresholds={[60, 80]} trend={4.3} />
          <GaugeChart title="Efficiency" value={77.6} max={100} thresholds={[55, 75]} trend={1.6} />
          <GaugeChart title="Compliance" value={92.1} max={100} thresholds={[80, 90]} trend={3.2} />
          <GaugeChart title="Utilization" value={82.5} max={100} thresholds={[50, 75]} trend={2.2} />
        </div>
      </>)}

      {tab === 'leaderboard' && (
        <TableCard title="Leaderboard" count={tableRows.length}>
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

      {tab === 'rewards' && (<>
        <div className="grid grid-2">
          <ChartCard title="Monthly Comparison" type="bar" data={{ labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [
            { label: 'Actual', data: [77, 74, 59, 65, 53, 71], backgroundColor: '#22d3ee' },
            { label: 'Target', data: [62, 80, 72, 59, 48, 47], backgroundColor: '#334155' },
          ] }} />
          <ChartCard title="Category Split" type="doughnut" data={{ labels: ['Category A','Category B','Category C','Category D'], datasets: [{ data: [37, 42, 33, 37], backgroundColor: ['#22d3ee','#f59e0b','#10b981','#8b5cf6'] }] }} />
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          <GaugeChart title="Quality" value={85.9} max={100} thresholds={[70, 85]} trend={2.5} />
          <GaugeChart title="Coverage" value={90.7} max={100} thresholds={[60, 80]} trend={0.6} />
          <GaugeChart title="Accuracy" value={88.0} max={100} thresholds={[80, 90]} trend={0.6} />
          <GaugeChart title="Speed" value={76.4} max={100} thresholds={[50, 75]} trend={1.7} />
        </div>
      </>)}

      {tab === 'performance' && (
        <TableCard title="Performance" count={6}>
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

      {tab === 'config' && (<>
        <div className="grid grid-2">
          <ChartCard title="Trend Analysis" type="line" data={{ labels: ['Sep','Oct','Nov','Dec','Jan','Feb'], datasets: [
            { label: 'Performance', data: [81, 81, 57, 70, 75, 70], borderColor: '#22d3ee' },
            { label: 'Target', data: [80,80,82,82,85,85], borderColor: '#f59e0b', borderDash: [5,5] },
          ] }} />
          <ChartCard title="Weekly Distribution" type="bar" data={{ labels: ['Week 1','Week 2','Week 3','Week 4'], datasets: [
            { label: 'Completed', data: [37, 42, 33, 37], backgroundColor: '#10b981' },
            { label: 'Pending', data: [7, 4, 7, 7], backgroundColor: '#f59e0b' },
            { label: 'Overdue', data: [3, 5, 2, 3], backgroundColor: '#ef4444' },
          ] }} />
        </div>
        <div className="grid grid-4" style={{ marginTop: 16 }}>
          <GaugeChart title="Overall" value={65.2} max={100} thresholds={[65, 80]} trend={-0.4} />
          <GaugeChart title="Trend" value={75.6} max={100} thresholds={[55, 75]} trend={1.2} />
          <GaugeChart title="Target Hit" value={87.6} max={100} thresholds={[70, 85]} trend={2.9} />
          <GaugeChart title="Velocity" value={90.6} max={100} thresholds={[50, 70]} trend={1.5} />
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
