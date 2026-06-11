// CompliancePage — Enriched with compliance gauges, regulation matrix, audit timeline
// Session 26: Deep dashboard interactivity

import React, { useState } from 'react';
import { useApi, useApiMutation, useMediaQuery, useToast } from '@/hooks';
import { useAlertStream, useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Modal from '@/components/ui/Modal';
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
import { fmtDate } from '@/utils';

const COMPLIANCE_BY_TYPE = {
  labels: ['Inspection', 'Certification', 'Emission', 'HAZMAT', 'Insurance', 'Registration'],
  datasets: [
    { label: 'Compliant', data: [28, 15, 22, 8, 30, 30], backgroundColor: 'rgba(34,197,94,0.6)', borderRadius: 4 },
    { label: 'Expiring Soon', data: [3, 2, 4, 1, 2, 1], backgroundColor: 'rgba(245,158,11,0.6)', borderRadius: 4 },
    { label: 'Non-Compliant', data: [1, 0, 1, 0, 0, 1], backgroundColor: 'rgba(239,68,68,0.6)', borderRadius: 4 },
  ],
};

const COMPLIANCE_TREND = {
  labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
  datasets: [
    { label: 'Compliance Rate %', data: [94.2, 95.1, 94.8, 96.0, 95.5, 96.8, 97.2, 97.5], borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.1)', fill: true, tension: 0.4 },
  ],
};

const AUTHORITY_DISTRIBUTION = {
  labels: ['RTA Dubai', 'ADNOC', 'NCEMA', 'DOT', 'PHMSA', 'Local'],
  datasets: [{ data: [35, 20, 15, 12, 10, 8], backgroundColor: CHART_PALETTE.slice(0, 6).map(c => c + 'bb'), borderWidth: 0 }],
};

const EXPIRY_TIMELINE = {
  labels: ['This Week', 'Next Week', '2 Weeks', '30 Days', '60 Days', '90 Days'],
  datasets: [{ label: 'Expiring Records', data: [2, 3, 5, 8, 12, 6], backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)', 'rgba(245,158,11,0.5)', 'rgba(59,130,246,0.5)', 'rgba(34,197,94,0.5)', 'rgba(34,197,94,0.3)'], borderRadius: 4 }],
};

export default function CompliancePage() {
  const { connected: wsConnected } = useSocketContext();
  const { count: liveAlertCount } = useAlertStream({ maxItems: 5 });
  const [range, setRange] = useState('90d');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const comp = useApi('/api/v1/compliance?limit=20');
  const permits = useApi('/api/v1/permits?limit=20');
  const compRows = Array.isArray(comp.data) ? comp.data : comp.data?.items || [];
  const permitRows = Array.isArray(permits.data) ? permits.data : permits.data?.items || [];
  const { mutate, saving } = useApiMutation();
  const [modal, setModal] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const toast = useToast();

  const resetForm = () => setForm({ vehicleId: '', complianceType: 'inspection', status: 'pending', issuingAuthority: 'rta_dubai', title: '', description: '', expiryDate: '' });
  const openCreate = () => { resetForm(); setModal('create'); };
  const openView = (row: any) => { setSelected(row); setModal('view'); };
  const handleSave = async () => {
    const res = await mutate('POST', '/api/v1/compliance/inspections', form);
    if (res.ok) { toast.show('Compliance record created', 'success'); setModal(null); comp.refetch(); }
    else toast.show(res.error, 'error');
  };
  const set = (k: any) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader title="Compliance & Permits" breadcrumb="Compliance" subtitle={`${compRows.length} records, ${permitRows.length} permits${wsConnected ? ' · Live' : ''}`}
        right={<div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <TimeRangeSelector value={range} onChange={setRange} />
          <ExportToolbar rows={compRows} filename="compliance" compact />
          <button className="btn btn-cyan btn-sm" onClick={openCreate}>+ New Record</button>
        </div>} />

      <div className="stats-grid">
        <TrendCard label="Overall Compliance" value="97.5%" trend={0.3} trendLabel="vs last month" sparkData={[94.2, 95.1, 94.8, 96.0, 95.5, 96.8, 97.2, 97.5]} color="green" />
        <TrendCard label="Active Records" value={compRows.length || 30} sparkData={[24, 26, 27, 28, 29, 30, 30, 30]} color="cyan" />
        <TrendCard label="Expiring (30d)" value={8} trend={-20.0} trendLabel="fewer renewals" sparkData={[14, 12, 10, 11, 9, 10, 9, 8]} color="amber" />
        <TrendCard label="Non-Compliant" value={3} trend={-25.0} trendLabel="improving" sparkData={[6, 5, 5, 4, 4, 4, 3, 3]} color="red" />
      </div>

      <div className="chart-card" style={{ marginTop: 14 }}>
        <h4>Compliance Gauges by Authority</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16, padding: '12px 0' }}>
          <GaugeChart value={98} label="RTA Dubai" thresholds={{ red: 80, amber: 90, green: 95 }} showTrend="up" />
          <GaugeChart value={100} label="ADNOC" thresholds={{ red: 80, amber: 90, green: 95 }} showTrend="stable" />
          <GaugeChart value={95} label="NCEMA" thresholds={{ red: 80, amber: 90, green: 95 }} showTrend="up" />
          <GaugeChart value={92} label="DOT" thresholds={{ red: 80, amber: 90, green: 95 }} showTrend="up" />
          <GaugeChart value={97} label="HAZMAT" thresholds={{ red: 85, amber: 93, green: 96 }} showTrend="up" />
        </div>
      </div>

      <div className={isMobile ? "" : "grid-2"} style={{ marginTop: 14 }}>
        <ChartCard title="Compliance Rate Trend" type="line" data={COMPLIANCE_TREND} height={220}
          options={{ plugins: { legend: { display: false } }, scales: { y: { min: 90, max: 100, title: { display: true, text: '%' } } } }} />
        <ChartCard title="Records by Authority" type="doughnut" data={AUTHORITY_DISTRIBUTION} height={220}
          options={{ plugins: { legend: { position: 'right' } } }} />
      </div>

      <div className={isMobile ? "" : "grid-2"} style={{ marginTop: 14 }}>
        <ChartCard title="Compliance Status by Type" type="bar" data={COMPLIANCE_BY_TYPE} height={220}
          options={{ plugins: { legend: { position: 'bottom' } }, scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } } }} />
        <ChartCard title="Upcoming Expirations" type="bar" data={EXPIRY_TIMELINE} height={220}
          options={{ plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }} />
      </div>

      <div className={isMobile ? "" : "grid-2"} style={{ marginTop: 14 }}>
        <TableCard title="Compliance Records" count={compRows.length}>
          <CrudDataTable columns={[
            { label: 'Vehicle', render: r => (r.vehicleId || '').slice(0, 8) },
            { label: 'Type', key: 'complianceType' },
            { label: 'Status', render: r => <Badge status={r.status} /> },
            { label: 'Authority', key: 'issuingAuthority' },
            { label: 'Expires', render: r => fmtDate(r.expiryDate) },
          ]} rows={compRows} onRowClick={openView} />
        </TableCard>
        <TableCard title="Permits" count={permitRows.length}>
          <CrudDataTable columns={[
            { label: 'Permit #', key: 'permitNumber' },
            { label: 'Type', key: 'permitType' },
            { label: 'Status', render: r => <Badge status={r.status} /> },
            { label: 'Expires', render: r => fmtDate(r.expiryDate) },
          ]} rows={permitRows} onRowClick={r => { setSelected(r); setModal('view'); }} />
        </TableCard>
      </div>

      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Record Details" lg>
        {selected && <DetailView items={[
          { label: 'Type', value: selected.complianceType || selected.permitType },
          { label: 'Status', value: selected.status },
          { label: 'Vehicle ID', value: (selected.vehicleId || '').slice(0, 12) },
          { label: 'Authority', value: selected.issuingAuthority },
          { label: 'Title', value: selected.title },
          { label: 'Description', value: selected.description },
          { label: 'Issue Date', value: fmtDate(selected.issueDate) },
          { label: 'Expiry Date', value: fmtDate(selected.expiryDate) },
          { label: 'Permit #', value: selected.permitNumber },
          { label: 'Score', value: selected.score },
        ]} />}
      </Modal>
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Schedule Compliance Inspection"
        footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button><button className="btn btn-cyan" onClick={handleSave} disabled={saving || !form.vehicleId}>{saving ? 'Saving...' : 'Create Record'}</button></>}>
        <div className="form-grid">
          <FormField label="Vehicle ID" value={form.vehicleId} onChange={set('vehicleId')} required />
          <FormField label="Type" type="select" value={form.complianceType} onChange={set('complianceType')} options={[
            { value: 'inspection', label: 'Inspection' }, { value: 'certification', label: 'Certification' },
            { value: 'emission', label: 'Emission Test' }, { value: 'hazmat', label: 'HAZMAT' },
            { value: 'insurance', label: 'Insurance' }, { value: 'registration', label: 'Registration' }]} />
          <FormField label="Authority" type="select" value={form.issuingAuthority} onChange={set('issuingAuthority')} options={[
            { value: 'rta_dubai', label: 'RTA Dubai' }, { value: 'adnoc', label: 'ADNOC' },
            { value: 'ncema', label: 'NCEMA' }, { value: 'dot', label: 'DOT' }, { value: 'phmsa', label: 'PHMSA' }]} />
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={['pending','compliant','non_compliant','expired','waiver']} />
          <FormField label="Title" value={form.title} onChange={set('title')} />
          <FormField label="Expiry Date" type="date" value={form.expiryDate} onChange={set('expiryDate')} />
          <FormField label="Description" type="textarea" value={form.description} onChange={set('description')} />
        </div>
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
