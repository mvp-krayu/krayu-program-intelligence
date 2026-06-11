// OperationsPage — Enriched with dispatch analytics, utilization charts, route map
// Session 26: Deep dashboard interactivity

import React, { useState } from 'react';
import { useApi, useCrud, useMediaQuery } from '@/hooks';
import { useFleetPositions, useSocketContext, useSocketEvent } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FormField from '@/components/ui/FormField';
import ExportToolbar from '@/components/ui/ExportToolbar';
import Badge from '@/components/ui/Badge';
import CrudDataTable from '@/components/data/CrudDataTable';
import DetailView from '@/components/data/DetailView';
import TableCard from '@/components/data/TableCard';
import PageHeader from '@/components/layout/PageHeader';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import ChartCard, { CHART_PALETTE } from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import TrendCard from '@/components/charts/TrendCard';
import TimeRangeSelector from '@/components/charts/TimeRangeSelector';
import MapPanel from '@/components/charts/MapPanel';
import { fmtPct } from '@/utils';

const DISPATCH_TREND = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    { label: 'Completed', data: [38, 42, 45, 40, 48, 32, 22], backgroundColor: 'rgba(34,197,94,0.6)', borderRadius: 4 },
    { label: 'In Progress', data: [12, 15, 13, 18, 14, 10, 8], backgroundColor: 'rgba(59,130,246,0.6)', borderRadius: 4 },
    { label: 'Cancelled', data: [2, 1, 3, 2, 1, 0, 1], backgroundColor: 'rgba(239,68,68,0.6)', borderRadius: 4 },
  ],
};

const UTILIZATION_BY_FLEET = {
  labels: ['Tanker', 'Bus', 'Taxi'],
  datasets: [
    { label: 'Utilization %', data: [87, 82, 91], backgroundColor: ['rgba(245,158,11,0.7)', 'rgba(59,130,246,0.7)', 'rgba(34,197,94,0.7)'], borderRadius: 4 },
  ],
};

const EFFICIENCY_TREND = {
  labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6'],
  datasets: [
    { label: 'On-Time %', data: [92, 94, 91, 95, 93, 96], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4 },
    { label: 'Avg Turnaround (min)', data: [45, 42, 48, 38, 40, 35], borderColor: '#3b82f6', backgroundColor: 'rgba(59,130,246,0.1)', fill: true, tension: 0.4, yAxisID: 'y1' },
  ],
};

const JOB_TYPE_BREAKDOWN = {
  labels: ['Delivery', 'Pickup', 'Transfer', 'Maintenance Run', 'Inspection'],
  datasets: [{ data: [42, 25, 15, 10, 8], backgroundColor: CHART_PALETTE.slice(0, 5).map(c => c + 'bb'), borderWidth: 0 }],
};

const ACTIVE_ROUTES = [
  { lat: 25.0657, lng: 55.1713, label: 'JAFZA T4 — 3 tankers loading', color: '#f59e0b' },
  { lat: 25.2048, lng: 55.2708, label: 'DXB Airport — 2 jobs in progress', color: '#3b82f6' },
  { lat: 25.1186, lng: 55.2005, label: 'DIP — 4 deliveries pending', color: '#22c55e' },
  { lat: 25.2760, lng: 55.3364, label: 'Al Rashidiya — Taxi hub active', color: '#a855f7' },
  { lat: 24.9400, lng: 55.1581, label: 'Jebel Ali Port — 5 tanker dispatches', color: '#f59e0b' },
];

export default function OperationsPage() {
  const [range, setRange] = useState('7d');
  const dispatch = useApi('/api/v1/operations/dispatch/board');
  const crud = useCrud('/api/v1/operations/geofences', { name: '', type: 'zone', latitude: 25.2048, longitude: 55.2708, radius: 1000, status: 'active', notes: '' });
  const isMobile = useMediaQuery('(max-width: 768px)');
  const d = dispatch.data || {};

  // Live WebSocket — fleet positions + geofence events
  const { connected: wsConnected } = useSocketContext();
  const { positions: livePositions, count: liveCount } = useFleetPositions();
  useSocketEvent('geofence:entered', () => {}, []);
  useSocketEvent('geofence:exited', () => {}, []);

  return (
    <div>
      <PageHeader title="Fleet Operations" breadcrumb="Operations" subtitle={`Dispatch & route optimization${wsConnected ? ` · ${liveCount} vehicles tracked` : ''}`}
        right={<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {wsConnected && <ConnectionStatus compact />}
          <TimeRangeSelector value={range} onChange={setRange} />
          <ExportToolbar rows={crud.rows} filename="dispatch-jobs" compact />
          <button className="btn btn-cyan btn-sm" onClick={crud.openCreate}>+ New Job</button>
        </div>} />

      <div className="stats-grid">
        <TrendCard label="Pending Jobs" value={d.pendingJobs || 8} trend={-11.1} trendLabel="vs yesterday" sparkData={[12, 14, 10, 9, 11, 8, 9, 8]} color="amber" />
        <TrendCard label="In Progress" value={d.inProgress || 15} trend={7.1} trendLabel="above avg" sparkData={[10, 12, 14, 11, 13, 15, 14, 15]} color="blue" />
        <TrendCard label="Completed Today" value={d.completedToday || 42} trend={16.7} trendLabel="vs avg 36" sparkData={[30, 34, 38, 35, 40, 36, 39, 42]} color="green" />
        <TrendCard label="Fleet Utilization" value={fmtPct(d.utilizationPercent || 86.5)} trend={2.3} trendLabel="vs target 85%" sparkData={[80, 82, 84, 83, 85, 84, 86, 86]} color="cyan" />
      </div>

      <div className="chart-card" style={{ marginTop: 14 }}>
        <h4>Operational KPIs</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16, padding: '12px 0' }}>
          <GaugeChart value={96} label="On-Time %" thresholds={{ red: 80, amber: 90, green: 95 }} showTrend="up" />
          <GaugeChart value={86.5} label="Utilization" thresholds={{ red: 60, amber: 75, green: 82 }} showTrend="up" />
          <GaugeChart value={35} max={60} label="Avg Turnaround" unit="min" color="#3b82f6" />
          <GaugeChart value={4.2} max={5} label="Driver Rating" unit="" color="#22c55e" />
        </div>
      </div>

      <div className={isMobile ? "" : "grid-2"} style={{ marginTop: 14 }}>
        <ChartCard title="Weekly Dispatch Volume" type="bar" data={DISPATCH_TREND} height={220}
          options={{ plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }} />
        <ChartCard title="Job Type Breakdown" type="doughnut" data={JOB_TYPE_BREAKDOWN} height={220}
          options={{ plugins: { legend: { position: 'right' } } }} />
      </div>

      <div className={isMobile ? "" : "grid-2"} style={{ marginTop: 14 }}>
        <ChartCard title="Efficiency Trend" type="line" data={EFFICIENCY_TREND} height={220}
          options={{ plugins: { legend: { position: 'bottom' } }, scales: { y: { position: 'left', min: 85, max: 100, title: { display: true, text: '%' } }, y1: { position: 'right', grid: { drawOnChartArea: false }, title: { display: true, text: 'min' } } } }} />
        <ChartCard title="Fleet Utilization by Type" type="bar" data={UTILIZATION_BY_FLEET} height={220}
          options={{ plugins: { legend: { display: false } }, scales: { y: { max: 100, title: { display: true, text: '%' } } } }} />
      </div>

      <div style={{ marginTop: 14 }}>
        <MapPanel title="Active Dispatch Routes" markers={ACTIVE_ROUTES} center={[25.13, 55.22]} zoom={10} height={270} />
      </div>

      <div style={{ marginTop: 14 }}>
        <TableCard title="Dispatch Jobs" count={crud.rows.length}>
          <CrudDataTable columns={[
            { label: 'Job Type', key: 'jobType' },
            { label: 'Vehicle', key: 'vehicleId', render: r => (r.vehicleId || '').slice(0, 8) },
            { label: 'Priority', key: 'priority', render: r => <Badge status={r.priority === 'urgent' ? 'critical' : r.priority === 'high' ? 'high' : 'info'} label={r.priority} /> },
            { label: 'Origin', key: 'origin' },
            { label: 'Destination', key: 'destination' },
            { label: 'Status', key: 'status', render: r => <Badge status={r.status} /> },
          ]} rows={crud.rows} onRowClick={crud.openView} onEdit={crud.openEdit} onDelete={crud.setConfirmDelete} onBulkDelete={crud.handleBulkDelete} onBulkExport={crud.handleBulkExport} />
        </TableCard>
      </div>

      <Modal open={crud.mode === 'create' || crud.mode === 'edit'} onClose={crud.close} title={crud.mode === 'edit' ? 'Edit Geofence' : 'Create Geofence'}
        footer={<><button className="btn btn-ghost" onClick={crud.close}>Cancel</button><button className="btn btn-cyan" onClick={crud.handleSave} disabled={crud.saving || !crud.form.name}>{crud.saving ? 'Saving...' : 'Save'}</button></>}>
        <div className="form-grid">
          <FormField label="Name" value={crud.form.name} onChange={crud.set('name')} placeholder="Zone name" required />
          <FormField label="Type" type="select" value={crud.form.type} onChange={crud.set('type')} options={[{ v: 'zone', l: 'Zone' }, { v: 'depot', l: 'Depot' }, { v: 'restricted', l: 'Restricted' }, { v: 'corridor', l: 'Corridor' }]} />
          <FormField label="Latitude" type="number" value={crud.form.latitude} onChange={crud.set('latitude')} />
          <FormField label="Longitude" type="number" value={crud.form.longitude} onChange={crud.set('longitude')} />
          <FormField label="Radius (m)" type="number" value={crud.form.radius} onChange={crud.set('radius')} />
          <FormField label="Status" type="select" value={crud.form.status} onChange={crud.set('status')} options={[{ v: 'active', l: 'Active' }, { v: 'inactive', l: 'Inactive' }]} />
          <FormField label="Notes" value={crud.form.notes} onChange={crud.set('notes')} type="textarea" />
        </div>
      </Modal>
      <DetailView open={crud.mode === 'view'} onClose={crud.close} data={crud.selected} title="Geofence Details" />
      <ConfirmDialog open={!!crud.confirmDelete} onClose={() => crud.setConfirmDelete(null)} onConfirm={crud.handleDelete} title="Delete Geofence" message="Delete this geofence?" danger />
      <crud.toast.Toast />

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

    </div>
  );
}
