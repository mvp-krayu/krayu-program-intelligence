// SafetyPage — Enriched with Chart.js, gauges, trend cards + mobile responsiveness
// Session 27: mobile UX polish

import React, { useState } from 'react';
import { useCrud, useMediaQuery } from '@/hooks';
import { useAlertStream, useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FormField from '@/components/ui/FormField';
import ExportToolbar from '@/components/ui/ExportToolbar';
import Badge from '@/components/ui/Badge';
import CrudDataTable from '@/components/data/CrudDataTable';
import DetailView from '@/components/data/DetailView';
import TableCard from '@/components/data/TableCard';
import ResponsivePageWrapper from '@/components/layout/ResponsivePageWrapper';
import CollapsibleSection from '@/components/ui/CollapsibleSection';
import MobileCardList from '@/components/ui/MobileCardList';
import ChartCard, { CHART_PALETTE } from '@/components/charts/ChartCard';
import GaugeChart from '@/components/charts/GaugeChart';
import TrendCard from '@/components/charts/TrendCard';
import TimeRangeSelector from '@/components/charts/TimeRangeSelector';
import MapPanel from '@/components/charts/MapPanel';
import { fmtDate } from '@/utils';

const DEFAULT = { vehicleId: '', type: 'incident', severity: 'low', description: '', location: '', reportedBy: '' };

export default function SafetyPage() {
  const { connected: wsConnected } = useSocketContext();
  const { count: liveAlertCount } = useAlertStream({ maxItems: 10 });
  const crud = useCrud('/v1/safety-records', DEFAULT);
  const [timeRange, setTimeRange] = useState('30d');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const trendCards = [
    { label: 'Fleet Safety Score', value: '94.2%', trend: 1.8, sparkline: [88,89,91,90,92,93,94], color: 'cyan' },
    { label: 'Incidents MTD', value: 3, trend: -25, sparkline: [6,5,4,5,4,3,3], color: 'green' },
    { label: 'Near Misses', value: 7, trend: -12, sparkline: [10,11,9,8,9,8,7], color: 'amber' },
    { label: 'Days Without Incident', value: 18, trend: 38, sparkline: [5,8,10,12,14,16,18], color: 'green' },
  ];

  const gauges = [
    { label: 'Fleet Score', value: 94.2, max: 100, thresholds: { red: 60, amber: 80, green: 90 } },
    { label: 'HOS Compliance', value: 96.8, max: 100, thresholds: { red: 70, amber: 85, green: 95 } },
    { label: 'HAZMAT Protocol', value: 99.1, max: 100, thresholds: { red: 80, amber: 90, green: 98 } },
    { label: 'Speed Compliance', value: 91.5, max: 100, thresholds: { red: 60, amber: 80, green: 90 } },
    { label: 'Incident Response', value: 88.3, max: 100, thresholds: { red: 50, amber: 70, green: 85 } },
  ];

  const incidentTrendData = {
    labels: ['W1','W2','W3','W4','W5','W6','W7','W8'],
    datasets: [
      { label: 'Incidents', data: [4,3,5,2,3,1,2,3], borderColor: CHART_PALETTE[3], backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
      { label: 'Near Misses', data: [8,7,9,6,7,5,6,7], borderColor: CHART_PALETTE[4], backgroundColor: 'rgba(245,158,11,0.1)', fill: true, tension: 0.4 },
    ],
  };

  const severityData = {
    labels: ['Low', 'Medium', 'High', 'Critical'],
    datasets: [{ data: [42, 28, 18, 12], backgroundColor: [CHART_PALETTE[1], CHART_PALETTE[4], CHART_PALETTE[3], '#dc2626'] }],
  };

  const categoryData = {
    labels: ['Speeding', 'Hard Braking', 'Distraction', 'Lane Departure', 'Fatigue', 'HAZMAT'],
    datasets: [{ label: 'Events', data: [34, 28, 19, 15, 11, 8], backgroundColor: CHART_PALETTE[0], borderRadius: 4 }],
  };

  const radarData = {
    labels: ['Speed', 'Braking', 'Cornering', 'Fatigue', 'Distraction', 'HAZMAT'],
    datasets: [
      { label: 'Current', data: [92, 88, 94, 91, 87, 99], borderColor: CHART_PALETTE[0], backgroundColor: 'rgba(6,214,214,0.1)' },
      { label: 'Target', data: [95, 95, 95, 95, 95, 99], borderColor: CHART_PALETTE[2], backgroundColor: 'transparent', borderDash: [5, 5] },
    ],
  };

  const mapMarkers = [
    { lat: 25.253, lng: 55.346, label: 'DXB Airport — 2 incidents', color: '#ef4444' },
    { lat: 25.018, lng: 55.082, label: 'JAFZA — 1 near miss', color: '#f59e0b' },
    { lat: 25.143, lng: 55.224, label: 'Al Quoz — 1 incident', color: '#ef4444' },
    { lat: 25.276, lng: 55.307, label: 'Deira — Safe zone', color: '#22c55e' },
    { lat: 25.004, lng: 55.150, label: 'DIP — 1 near miss', color: '#f59e0b' },
  ];

  const columns = [
    { key: 'id', label: 'ID', priority: 'high' as const },
    { key: 'type', label: 'Type', priority: 'high' as const, render: (v: string) => <Badge color={v === 'incident' ? 'red' : 'amber'}>{v}</Badge> },
    { key: 'severity', label: 'Severity', priority: 'high' as const, render: (v: string) => <Badge color={v === 'critical' ? 'red' : v === 'high' ? 'amber' : 'green'}>{v}</Badge> },
    { key: 'location', label: 'Location', priority: 'medium' as const },
    { key: 'reportedBy', label: 'Reported By', priority: 'low' as const },
    { key: 'createdAt', label: 'Date', priority: 'medium' as const, render: (v: string) => fmtDate(v) },
  ];

  const handleRefresh = async () => {
    await new Promise(r => setTimeout(r, 800));
    crud.refetch();
  };

  return (
    <ResponsivePageWrapper
      title="Safety Management"
      subtitle={`Fleet safety analytics${wsConnected ? ` · ${liveAlertCount} live alerts` : ''}`}
      headerRight={
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
          <ExportToolbar data={crud.rows} filename="safety" />
        </div>
      }
      onRefresh={handleRefresh}
    >
      {/* Trend Cards */}
      <div className="trend-cards-grid" style={{ marginBottom: 16 }}>
        {trendCards.map(tc => <TrendCard key={tc.label} {...tc} />)}
      </div>

      {/* Gauges */}
      <CollapsibleSection title="Safety Scores" badge="5 metrics" defaultOpen={!isMobile}>
        <div className="gauges-row">
          {gauges.map(g => <GaugeChart key={g.label} {...g} size={isMobile ? 80 : 110} />)}
        </div>
      </CollapsibleSection>

      {/* Charts */}
      <CollapsibleSection title="Trends & Analysis" badge={timeRange} defaultOpen={true}>
        <div className={isMobile ? '' : 'grid-2'} style={{ gap: 14 }}>
          <ChartCard title="Incident & Near-Miss Trend" type="line" data={incidentTrendData} height={isMobile ? 200 : 260} />
          <ChartCard title="Severity Distribution" type="doughnut" data={severityData} height={isMobile ? 200 : 260} />
        </div>
        <div className={isMobile ? '' : 'grid-2'} style={{ gap: 14, marginTop: 14 }}>
          <ChartCard title="Safety Categories" type="bar" data={categoryData} height={isMobile ? 200 : 260} options={{ indexAxis: 'y' as const }} />
          <ChartCard title="Safety Radar" type="radar" data={radarData} height={isMobile ? 200 : 260} />
        </div>
      </CollapsibleSection>

      {/* Map */}
      <CollapsibleSection title="Incident Map" defaultOpen={!isMobile}>
        <MapPanel markers={mapMarkers} height={isMobile ? 220 : 320} center={[25.15, 55.22]} zoom={11} />
      </CollapsibleSection>

      {/* Data Table + Mobile Cards */}
      <CollapsibleSection title="Safety Records" badge={`${crud.rows.length} records`} defaultOpen={true}>
        <div className="hide-mobile">
          <TableCard>
            <CrudDataTable
              columns={columns}
              data={crud.rows}
              onEdit={crud.openEdit}
              onDelete={(row: any) => crud.setConfirmDelete(row)}
              onRowClick={crud.openView}
            />
          </TableCard>
        </div>
        <MobileCardList
          data={crud.rows}
          columns={columns}
          onRowClick={crud.openView}
          emptyMessage="No safety records found"
        />
      </CollapsibleSection>

      {/* Modals */}
      {crud.mode && crud.mode !== 'view' && (
        <Modal title={crud.mode === 'create' ? 'Report Incident' : 'Edit Record'} onClose={crud.close} footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-ghost" onClick={crud.close}>Cancel</button>
            <button className="btn btn-cyan" onClick={crud.handleSave} disabled={crud.saving}>
              {crud.saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        }>
          <div className="form-grid">
            <FormField label="Vehicle ID" value={crud.form.vehicleId} onChange={crud.set('vehicleId')} />
            <FormField label="Type" type="select" value={crud.form.type} onChange={crud.set('type')} options={['incident', 'near_miss', 'violation', 'hazard']} />
            <FormField label="Severity" type="select" value={crud.form.severity} onChange={crud.set('severity')} options={['low', 'medium', 'high', 'critical']} />
            <FormField label="Location" value={crud.form.location} onChange={crud.set('location')} />
            <FormField label="Reported By" value={crud.form.reportedBy} onChange={crud.set('reportedBy')} />
            <FormField label="Description" type="textarea" value={crud.form.description} onChange={crud.set('description')} />
      
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
    </div>
        </Modal>
      )}
      {crud.mode === 'view' && crud.selected && <DetailView data={crud.selected} onClose={crud.close} />}
      {crud.confirmDelete && <ConfirmDialog message="Delete this safety record?" onConfirm={crud.handleDelete} onCancel={() => crud.setConfirmDelete(null)} />}
    </ResponsivePageWrapper>
  );
}
