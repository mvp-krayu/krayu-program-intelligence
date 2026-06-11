// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Maintenance Page (API-integrated)
// Work orders CRUD + predictive alerts + stats + schedule
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { maintenanceApi } from '@/api';
import type { MaintenanceStats } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast } from '@/hooks';
import { useSocketContext, useSocketEvent } from '@/socket';
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

const PRIORITY_COLORS: Record<string, string> = { urgent: '#ef4444', high: '#f97316', normal: '#3b82f6', low: '#6b7280' };

export default function MaintenancePage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [tab, setTab] = useState<'workorders' | 'predictive' | 'overdue'>('workorders');
  const limit = 20;
  const toast = useToast();

  const params = useMemo(() => ({
    page, limit,
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  }), [page, limit, statusFilter]);

  const { data: listData, loading, error, refetch } = useApiQuery(
    () => maintenanceApi.listWorkOrders(params), [page, statusFilter], { retryCount: 2 }
  );

  const { data: stats } = useApiQuery<MaintenanceStats>(
    () => maintenanceApi.getStats(), [], { refetchInterval: 60000 }
  );

  const { data: overdueData } = useApiQuery(
    () => maintenanceApi.getOverdue(), [], { enabled: tab === 'overdue' }
  );

  const { data: predictiveData } = useApiQuery(
    () => maintenanceApi.getPredictive(), [], { enabled: tab === 'predictive' }
  );

  const rows = (listData as any)?.items || (Array.isArray(listData) ? listData : []);
  const total = (listData as any)?.total || rows.length;
  const totalPages = Math.ceil(total / limit);
  const overdueRows = Array.isArray(overdueData) ? overdueData : (overdueData as any)?.items || [];
  const predictiveRows = Array.isArray(predictiveData) ? predictiveData : (predictiveData as any)?.items || [];

  const { mutate, saving } = useApiMutation();

  // Live WebSocket — auto-refresh on DTC/predictive failure events
  const { connected: wsConnected } = useSocketContext();
  useSocketEvent('diagnostics:dtc', () => { refetch(); }, []);
  useSocketEvent('diagnostics:predictive', () => { refetch(); }, []);

  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [confirm, setConfirm] = useState<string | null>(null);

  const resetForm = (item?: any) => {
    setForm(item ? { ...item } : {
      vehicleId: '', serviceType: 'oil_change', priority: 'normal',
      status: 'scheduled', scheduledDate: new Date().toISOString().split('T')[0],
      estimatedCost: 0, notes: '',
    });
  };

  const openCreate = () => { resetForm(); setModal('create'); };
  const openEdit = (row: any) => { setSelected(row); resetForm(row); setModal('edit'); };
  const openView = (row: any) => { setSelected(row); setModal('view'); };
  const openDelete = (row: any) => { setSelected(row); setConfirm('delete'); };

  const handleSave = async () => {
    const isEdit = modal === 'edit';
    const result = await mutate(() =>
      isEdit ? maintenanceApi.update(selected.id, form) : maintenanceApi.create(form)
    );
    if (result.ok) { toast.show(`Work order ${isEdit ? 'updated' : 'created'}`, 'success'); setModal(null); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const handleComplete = async (row: any) => {
    const result = await mutate(() => maintenanceApi.complete(row.id));
    if (result.ok) { toast.show('Work order completed', 'success'); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const handleCancel = async () => {
    if (!selected) return;
    const result = await mutate(() => maintenanceApi.cancel(selected.id));
    if (result.ok) { toast.show('Work order cancelled', 'success'); setConfirm(null); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const set = (k: string) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader title="Maintenance Management" breadcrumb="Maintenance"
        subtitle={stats ? `${stats.totalWorkOrders} work orders · ${stats.open} open · ${stats.overdue} overdue` : `${rows.length} work orders`}
        right={<>
          {wsConnected && <ConnectionStatus compact />}
          <ExportToolbar rows={rows} filename="maintenance" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ New Work Order</button>
        </>} />

      {stats && (
        <div className="stat-cards" style={{ marginBottom: 16 }}>
          <div className="stat-card"><div className="stat-value">{stats.totalWorkOrders}</div><div className="stat-label">Total Orders</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#3b82f6' }}>{stats.open}</div><div className="stat-label">Open</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#ef4444' }}>{stats.overdue}</div><div className="stat-label">Overdue</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#22c55e' }}>{stats.completedThisMonth}</div><div className="stat-label">Completed/Month</div></div>
          <div className="stat-card"><div className="stat-value">{stats.avgCompletionDays}d</div><div className="stat-label">Avg Completion</div></div>
          <div className="stat-card"><div className="stat-value">AED {fmt(stats.costThisMonth)}</div><div className="stat-label">Cost This Month</div></div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
        {[
          { id: 'workorders' as const, label: 'Work Orders', count: total },
          { id: 'overdue' as const, label: '⚠️ Overdue', count: stats?.overdue },
          { id: 'predictive' as const, label: '🧠 Predictive', count: null },
        ].map(t => (
          <button key={t.id} className={`btn btn-sm ${tab === t.id ? 'btn-cyan' : ''}`}
            onClick={() => setTab(t.id)} style={{ borderRadius: '6px 6px 0 0' }}>
            {t.label} {t.count != null && <span style={{ opacity: 0.6, marginLeft: 4 }}>({t.count})</span>}
          </button>
        ))}
      </div>

      {tab === 'workorders' && (
        <>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            {['all', 'scheduled', 'in_progress', 'completed', 'cancelled'].map(s => (
              <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-cyan' : ''}`}
                onClick={() => { setStatusFilter(s); setPage(1); }}>
                {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
              </button>
            ))}
          </div>

          {loading ? <Loading /> : error ? <ErrorMsg msg={error} onRetry={refetch} /> : (
            <TableCard title="Work Orders" count={total}>
              <CrudDataTable columns={[
                { label: 'Vehicle', key: 'vehicleId' },
                { label: 'Service', key: 'serviceType' },
                { label: 'Priority', render: (r: any) => (
                  <span style={{ color: PRIORITY_COLORS[r.priority] || '#94a3b8', fontWeight: 600, fontSize: 12, textTransform: 'uppercase' }}>{r.priority}</span>
                ) },
                { label: 'Status', render: (r: any) => <Badge status={r.status} /> },
                { label: 'Scheduled', render: (r: any) => fmtDate(r.scheduledDate) },
                { label: 'Cost (AED)', render: (r: any) => r.estimatedCost ? `AED ${fmt(r.estimatedCost)}` : '—' },
                { label: 'Actions', render: (r: any) => (
                  <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                    {(r.status === 'scheduled' || r.status === 'in_progress') && (
                      <button className="btn btn-sm" style={{ background: '#22c55e', color: '#fff', fontSize: 11 }}
                        onClick={() => handleComplete(r)}>Complete</button>
                    )}
                  </div>
                ) },
              ]} rows={rows} onRowClick={openView} onEdit={openEdit} onDelete={openDelete} />
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
                  <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                  <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
                  <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
                </div>
              )}
            </TableCard>
          )}
        </>
      )}

      {tab === 'overdue' && (
        <TableCard title="Overdue Work Orders" count={overdueRows.length}>
          {overdueRows.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#22c55e' }}>✅ No overdue work orders</div>
          ) : (
            <CrudDataTable columns={[
              { label: 'Vehicle', key: 'vehicleId' },
              { label: 'Service', key: 'serviceType' },
              { label: 'Priority', render: (r: any) => <span style={{ color: PRIORITY_COLORS[r.priority], fontWeight: 600, textTransform: 'uppercase', fontSize: 12 }}>{r.priority}</span> },
              { label: 'Due Date', render: (r: any) => <span style={{ color: '#ef4444' }}>{fmtDate(r.scheduledDate)}</span> },
              { label: 'Days Overdue', render: (r: any) => {
                const days = Math.floor((Date.now() - new Date(r.scheduledDate).getTime()) / 86400000);
                return <span style={{ color: '#ef4444', fontWeight: 600 }}>{days}d</span>;
              }},
            ]} rows={overdueRows} onRowClick={openView} />
          )}
        </TableCard>
      )}

      {tab === 'predictive' && (
        <TableCard title="Predictive Maintenance Alerts" count={predictiveRows.length}>
          {predictiveRows.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No predictive alerts at this time</div>
          ) : (
            <CrudDataTable columns={[
              { label: 'Vehicle', key: 'vehicleId' },
              { label: 'Component', key: 'component' },
              { label: 'Predicted Failure', render: (r: any) => fmtDate(r.predictedFailureDate) },
              { label: 'Confidence', render: (r: any) => `${(r.confidence * 100).toFixed(0)}%` },
              { label: 'Recommendation', key: 'recommendation' },
            ]} rows={predictiveRows} onRowClick={openView} />
          )}
        </TableCard>
      )}

      {/* VIEW */}
      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Work Order Details" lg>
        {selected && <DetailView items={[
          { label: 'ID', value: selected.id },
          { label: 'Vehicle', value: selected.vehicleId },
          { label: 'Service Type', value: selected.serviceType },
          { label: 'Priority', value: selected.priority },
          { label: 'Status', value: selected.status },
          { label: 'Scheduled', value: fmtDate(selected.scheduledDate) },
          { label: 'Estimated Cost', value: selected.estimatedCost ? `AED ${fmt(selected.estimatedCost)}` : '—' },
          { label: 'Actual Cost', value: selected.actualCost ? `AED ${fmt(selected.actualCost)}` : '—' },
          { label: 'Notes', value: selected.notes || '—' },
          { label: 'Created', value: fmtDate(selected.createdAt) },
        ]} />}
      </Modal>

      {/* CREATE/EDIT */}
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? 'Edit Work Order' : 'New Work Order'}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleSave} disabled={saving || !form.vehicleId}>
            {saving ? 'Saving...' : modal === 'edit' ? 'Update' : 'Create'}
          </button>
        </>}>
        <div className="form-grid">
          <FormField label="Vehicle ID" value={form.vehicleId} onChange={set('vehicleId')} placeholder="Vehicle UUID" required />
          <FormField label="Service Type" type="select" value={form.serviceType} onChange={set('serviceType')}
            options={['oil_change', 'tire_rotation', 'brake_inspection', 'engine_tune', 'transmission', 'full_service', 'inspection', 'repair']} />
          <FormField label="Priority" type="select" value={form.priority} onChange={set('priority')} options={['urgent', 'high', 'normal', 'low']} />
          <FormField label="Scheduled Date" type="date" value={form.scheduledDate} onChange={set('scheduledDate')} />
          <FormField label="Estimated Cost (AED)" type="number" value={form.estimatedCost} onChange={set('estimatedCost')} />
          <FormField label="Notes" type="textarea" value={form.notes} onChange={set('notes')} placeholder="Additional details..." />
        </div>
      </Modal>

      <ConfirmDialog open={confirm === 'delete'} onClose={() => setConfirm(null)} onConfirm={handleCancel} danger
        title="Cancel Work Order" message="Cancel this work order?" confirmLabel="Cancel Order" />
      <toast.Toast />
    </div>
  );
}
