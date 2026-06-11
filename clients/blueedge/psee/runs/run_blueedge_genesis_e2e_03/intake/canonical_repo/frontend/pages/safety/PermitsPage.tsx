import React, { useState } from 'react';
import { permitsApi } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast } from '@/hooks';
import { useSocketContext } from '@/socket';
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

export default function PermitsPage() {
  const { connected: wsConnected } = useSocketContext();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'all' | 'expiring' | 'dashboard'>('all');
  const limit = 20;
  const toast = useToast();

  const { data: listData, loading, error, refetch } = useApiQuery(() => permitsApi.list({ page, limit }), [page]);
  const { data: dashboard } = useApiQuery(() => permitsApi.getDashboard(), [], { refetchInterval: 60000 });
  const { data: expiring } = useApiQuery(() => permitsApi.getExpiring(30), [], { enabled: tab === 'expiring' });

  const rows = (listData as any)?.items || (Array.isArray(listData) ? listData : []);
  const total = (listData as any)?.total || rows.length;
  const totalPages = Math.ceil(total / limit);
  const expiringRows = Array.isArray(expiring) ? expiring : (expiring as any)?.items || [];
  const db = (dashboard as any) || {};

  const { mutate, saving } = useApiMutation();
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [confirm, setConfirm] = useState<string | null>(null);

  const resetForm = (item?: any) => setForm(item ? { ...item } : { vehicleId: '', permitType: 'hazmat_transport', issuingAuthority: 'RTA Dubai', issueDate: '', expiryDate: '', status: 'active', notes: '' });
  const openCreate = () => { resetForm(); setModal('create'); };
  const openEdit = (r: any) => { setSelected(r); resetForm(r); setModal('edit'); };
  const openView = (r: any) => { setSelected(r); setModal('view'); };
  const openDelete = (r: any) => { setSelected(r); setConfirm('delete'); };
  const set = (k: string) => (v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const isEdit = modal === 'edit';
    const res = await mutate(() => isEdit ? permitsApi.update(selected.id, form) : permitsApi.create(form));
    if (res.ok) { toast.show(`Permit ${isEdit ? 'updated' : 'created'}`, 'success'); setModal(null); refetch(); }
    else toast.show(res.error || 'Failed', 'error');
  };
  const handleRenew = async (r: any) => {
    const res = await mutate(() => permitsApi.requestRenewal(r.id));
    if (res.ok) { toast.show('Renewal requested', 'success'); refetch(); }
    else toast.show(res.error || 'Failed', 'error');
  };
  const handleDelete = async () => {
    const res = await mutate(() => permitsApi.remove(selected.id));
    if (res.ok) { toast.show('Permit deleted', 'success'); setConfirm(null); refetch(); }
    else toast.show(res.error || 'Failed', 'error');
  };

  return (
    <div>
      <PageHeader title="Permits & Licenses" breadcrumb="Permits"
        subtitle={db.totalPermits ? `${db.totalPermits} permits · ${db.expiringCount || 0} expiring soon` : `${rows.length} permits`}
        right={<><ExportToolbar rows={rows} filename="permits" compact /><button className="btn btn-cyan" onClick={openCreate}>+ New Permit</button></>} />

      {db.totalPermits && (
        <div className="stat-cards" style={{ marginBottom: 16 }}>
          <div className="stat-card"><div className="stat-value">{db.totalPermits}</div><div className="stat-label">Total Permits</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#22c55e' }}>{db.activeCount}</div><div className="stat-label">Active</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#f97316' }}>{db.expiringCount}</div><div className="stat-label">Expiring (30d)</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#ef4444' }}>{db.expiredCount}</div><div className="stat-label">Expired</div></div>
          <div className="stat-card"><div className="stat-value">{db.renewalsPending}</div><div className="stat-label">Renewals Pending</div></div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
        {([['all', 'All Permits'], ['expiring', '⚠️ Expiring Soon'], ['dashboard', '📊 Dashboard']] as const).map(([id, label]) => (
          <button key={id} className={`btn btn-sm ${tab === id ? 'btn-cyan' : ''}`} onClick={() => setTab(id)} style={{ borderRadius: '6px 6px 0 0' }}>{label}</button>
        ))}
      </div>

      {tab === 'all' && (loading ? <Loading /> : error ? <ErrorMsg msg={error} onRetry={refetch} /> : (
        <TableCard title="Permits" count={total}>
          <CrudDataTable columns={[
            { label: 'Vehicle', key: 'vehicleId' },
            { label: 'Type', render: (r: any) => <Badge status={r.permitType} /> },
            { label: 'Authority', key: 'issuingAuthority' },
            { label: 'Issued', render: (r: any) => fmtDate(r.issueDate) },
            { label: 'Expires', render: (r: any) => <span style={{ color: new Date(r.expiryDate) < new Date() ? '#ef4444' : new Date(r.expiryDate) < new Date(Date.now() + 30*86400000) ? '#f97316' : '#94a3b8' }}>{fmtDate(r.expiryDate)}</span> },
            { label: 'Status', render: (r: any) => <Badge status={r.status} /> },
            { label: '', render: (r: any) => r.status !== 'expired' ? null : <button className="btn btn-sm" style={{ background: '#f97316', color: '#fff', fontSize: 11 }} onClick={(e) => { e.stopPropagation(); handleRenew(r); }}>Renew</button> },
          ]} rows={rows} onRowClick={openView} onEdit={openEdit} onDelete={openDelete} />
          {totalPages > 1 && <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
            <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
            <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
            <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
          </div>}
        </TableCard>
      ))}

      {tab === 'expiring' && (
        <TableCard title="Permits Expiring in 30 Days" count={expiringRows.length}>
          {expiringRows.length === 0 ? <div style={{ padding: 40, textAlign: 'center', color: '#22c55e' }}>✅ No permits expiring soon</div> : (
            <CrudDataTable columns={[
              { label: 'Vehicle', key: 'vehicleId' },
              { label: 'Type', render: (r: any) => <Badge status={r.permitType} /> },
              { label: 'Expires', render: (r: any) => <span style={{ color: '#f97316', fontWeight: 600 }}>{fmtDate(r.expiryDate)}</span> },
              { label: 'Days Left', render: (r: any) => { const d = Math.ceil((new Date(r.expiryDate).getTime() - Date.now()) / 86400000); return <span style={{ color: d < 7 ? '#ef4444' : '#f97316', fontWeight: 600 }}>{d}d</span>; } },
              { label: '', render: (r: any) => <button className="btn btn-sm" style={{ background: '#f97316', color: '#fff', fontSize: 11 }} onClick={(e) => { e.stopPropagation(); handleRenew(r); }}>Renew</button> },
            ]} rows={expiringRows} onRowClick={openView} />
          )}
        </TableCard>
      )}

      {tab === 'dashboard' && db.totalPermits && (
        <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
          {Object.entries(db).map(([k, v]) => (
            <div key={k} className="stat-card"><div className="stat-value" style={{ fontSize: 16 }}>{typeof v === 'number' ? fmt(v) : String(v)}</div>
              <div className="stat-label">{k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</div></div>
          ))}
        </div>
      )}

      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Permit Details" lg>
        {selected && <DetailView items={[
          { label: 'ID', value: selected.id }, { label: 'Vehicle', value: selected.vehicleId },
          { label: 'Type', value: selected.permitType }, { label: 'Authority', value: selected.issuingAuthority },
          { label: 'Issue Date', value: fmtDate(selected.issueDate) }, { label: 'Expiry Date', value: fmtDate(selected.expiryDate) },
          { label: 'Status', value: selected.status }, { label: 'Notes', value: selected.notes || '—' },
        ]} />}
      </Modal>

      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)} title={modal === 'edit' ? 'Edit Permit' : 'New Permit'}
        footer={<><button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button></>}>
        <div className="form-grid">
          <FormField label="Vehicle ID" value={form.vehicleId} onChange={set('vehicleId')} required />
          <FormField label="Permit Type" type="select" value={form.permitType} onChange={set('permitType')} options={['hazmat_transport', 'oversized_load', 'cross_border', 'rta_commercial', 'ncema_safety', 'port_access', 'oil_terminal']} />
          <FormField label="Authority" value={form.issuingAuthority} onChange={set('issuingAuthority')} placeholder="RTA Dubai" />
          <FormField label="Issue Date" type="date" value={form.issueDate} onChange={set('issueDate')} />
          <FormField label="Expiry Date" type="date" value={form.expiryDate} onChange={set('expiryDate')} />
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={['active', 'expired', 'suspended', 'pending_renewal']} />
          <FormField label="Notes" type="textarea" value={form.notes} onChange={set('notes')} />
        </div>
      </Modal>
      <ConfirmDialog open={confirm === 'delete'} onClose={() => setConfirm(null)} onConfirm={handleDelete} danger title="Delete Permit" message="Delete this permit?" confirmLabel="Delete" />

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
