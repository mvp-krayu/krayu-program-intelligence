// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Fleets Page (API-integrated)
// Fleet management with KPIs, CRUD, dashboard per fleet
// ══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { fleetsApi } from '@/api';
import type { FleetKpis } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast } from '@/hooks';
import { useFleetPositions, useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import FormField from '@/components/ui/FormField';
import ExportToolbar from '@/components/ui/ExportToolbar';
import Loading from '@/components/ui/Loading';
import ErrorMsg from '@/components/ui/ErrorMsg';
import Badge from '@/components/ui/Badge';
import CrudDataTable from '@/components/data/CrudDataTable';
import DetailView from '@/components/data/DetailView';
import TableCard from '@/components/data/TableCard';
import PageHeader from '@/components/layout/PageHeader';
import { fmtDate, fmt } from '@/utils';

export default function FleetsPage() {
  const { connected: wsConnected } = useSocketContext();
  const { count: liveCount } = useFleetPositions();
  const toast = useToast();

  const { data: listData, loading, error, refetch } = useApiQuery(
    () => fleetsApi.list(), [], { retryCount: 2 }
  );

  const { data: kpis } = useApiQuery<FleetKpis>(
    () => fleetsApi.getKpis(), [], { refetchInterval: 60000 }
  );

  const rows = (listData as any)?.items || (Array.isArray(listData) ? listData : []);

  const { mutate, saving } = useApiMutation();
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [confirm, setConfirm] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<any>(null);

  const resetForm = (item?: any) => {
    setForm(item ? { ...item } : { name: '', fleetType: 'tanker', region: 'Dubai', status: 'active', description: '' });
  };

  const openCreate = () => { resetForm(); setModal('create'); };
  const openEdit = (row: any) => { setSelected(row); resetForm(row); setModal('edit'); };
  const openDelete = (row: any) => { setSelected(row); setConfirm('delete'); };

  const openView = async (row: any) => {
    setSelected(row);
    setModal('view');
    try {
      const res = await fleetsApi.getDashboard(row.id);
      setDashboard(res.data);
    } catch { setDashboard(null); }
  };

  const handleSave = async () => {
    const isEdit = modal === 'edit';
    const result = await mutate(() =>
      isEdit ? fleetsApi.update(selected.id, form) : fleetsApi.create(form)
    );
    if (result.ok) { toast.show(`Fleet ${isEdit ? 'updated' : 'created'}`, 'success'); setModal(null); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const handleDelete = async () => {
    if (!selected) return;
    const result = await mutate(() => fleetsApi.remove(selected.id));
    if (result.ok) { toast.show('Fleet deleted', 'success'); setConfirm(null); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const set = (k: string) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader title="Fleet Management" breadcrumb="Fleets"
        subtitle={kpis ? `${kpis.totalFleets} fleets · ${kpis.totalVehicles} vehicles · ${kpis.utilizationPct}% utilization` : `${rows.length} fleets`}
        right={<>
          <ExportToolbar rows={rows} filename="fleets" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ Create Fleet</button>
        </>} />

      {kpis && (
        <div className="stat-cards" style={{ marginBottom: 16 }}>
          <div className="stat-card"><div className="stat-value">{kpis.totalFleets}</div><div className="stat-label">Total Fleets</div></div>
          <div className="stat-card"><div className="stat-value">{kpis.totalVehicles}</div><div className="stat-label">Total Vehicles</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#22c55e' }}>{kpis.activeVehicles}</div><div className="stat-label">Active</div></div>
          <div className="stat-card"><div className="stat-value">{kpis.utilizationPct}%</div><div className="stat-label">Utilization</div></div>
          <div className="stat-card"><div className="stat-value">{kpis.avgFuelEfficiency?.toFixed(1)}</div><div className="stat-label">Avg km/L</div></div>
          <div className="stat-card"><div className="stat-value">{kpis.tripsToday}</div><div className="stat-label">Trips Today</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: kpis.alertsActive > 0 ? '#ef4444' : '#22c55e' }}>{kpis.alertsActive}</div><div className="stat-label">Active Alerts</div></div>
        </div>
      )}

      {loading ? <Loading /> : error ? <ErrorMsg msg={error} onRetry={refetch} /> : (
        <TableCard title="All Fleets" count={rows.length}>
          <CrudDataTable columns={[
            { label: 'Name', key: 'name' },
            { label: 'Type', render: (r: any) => <Badge status={r.fleetType || r.type} /> },
            { label: 'Region', key: 'region' },
            { label: 'Vehicles', render: (r: any) => r.vehicleCount || '—' },
            { label: 'Status', render: (r: any) => <Badge status={r.status} /> },
            { label: 'Created', render: (r: any) => fmtDate(r.createdAt) },
          ]} rows={rows} onRowClick={openView} onEdit={openEdit} onDelete={openDelete} />
        </TableCard>
      )}

      {/* VIEW with Fleet Dashboard */}
      <Modal open={modal === 'view'} onClose={() => { setModal(null); setDashboard(null); }} title={`Fleet — ${selected?.name || ''}`} lg>
        {selected && (
          <>
            <DetailView items={[
              { label: 'Name', value: selected.name },
              { label: 'Type', value: selected.fleetType || selected.type },
              { label: 'Region', value: selected.region },
              { label: 'Status', value: selected.status },
              { label: 'Description', value: selected.description || '—' },
              { label: 'Vehicles', value: selected.vehicleCount || '—' },
              { label: 'Created', value: fmtDate(selected.createdAt) },
            ]} />
            {dashboard && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: '#22d3ee', fontSize: 14, marginBottom: 12 }}>📊 Fleet Dashboard</h4>
                <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
                  {Object.entries(dashboard).map(([k, v]) => (
                    <div key={k} className="stat-card mini">
                      <div className="stat-value" style={{ fontSize: 16 }}>{typeof v === 'number' ? fmt(v) : String(v)}</div>
                      <div className="stat-label">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* CREATE/EDIT */}
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? `Edit Fleet — ${selected?.name}` : 'Create New Fleet'}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleSave} disabled={saving || !form.name}>
            {saving ? 'Saving...' : modal === 'edit' ? 'Update' : 'Create Fleet'}
          </button>
        </>}>
        <div className="form-grid">
          <FormField label="Fleet Name" value={form.name} onChange={set('name')} placeholder="Tanker Fleet A" required />
          <FormField label="Fleet Type" type="select" value={form.fleetType} onChange={set('fleetType')} options={['tanker', 'bus', 'taxi', 'mixed']} />
          <FormField label="Region" type="select" value={form.region} onChange={set('region')} options={['Dubai', 'Abu Dhabi', 'Sharjah', 'Fujairah', 'Switzerland', 'East Africa']} />
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={['active', 'inactive', 'suspended']} />
          <FormField label="Description" type="textarea" value={form.description} onChange={set('description')} placeholder="Fleet purpose and scope..." />
        </div>
      </Modal>

      <ConfirmDialog open={confirm === 'delete'} onClose={() => setConfirm(null)} onConfirm={handleDelete} danger
        title="Delete Fleet" message={`Delete fleet "${selected?.name}"? Vehicles will be unassigned.`} confirmLabel="Delete Fleet" />

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
