// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Drivers Page (API-integrated)
// CRUD + scorecard + HOS status + leaderboard
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { driversApi } from '@/api';
import type { DriverStats, DriverScorecard, DriverHOS } from '@/api';
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
import type { Driver } from '@/types';

function ScoreBar({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
        <span style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ color, fontWeight: 600 }}>{value.toFixed(1)}</span>
      </div>
      <div style={{ height: 6, background: 'var(--bg-tertiary, #1e293b)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
    </div>
  );
}

export default function DriversPage() {
  const { connected: wsConnected } = useSocketContext();
  useSocketEvent('safety:event', () => {}, []);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 20;
  const toast = useToast();

  const params = useMemo(() => ({
    page, limit,
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  }), [page, limit, statusFilter]);

  const { data: listData, loading, error, refetch } = useApiQuery(
    () => driversApi.list(params), [page, statusFilter], { retryCount: 2 }
  );

  const { data: stats } = useApiQuery<DriverStats>(
    () => driversApi.getStats(), [], { refetchInterval: 60000 }
  );

  const rows = (listData as any)?.items || (Array.isArray(listData) ? listData : []) as Driver[];
  const total = (listData as any)?.total || rows.length;
  const totalPages = Math.ceil(total / limit);

  const { mutate, saving } = useApiMutation();

  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Driver | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [confirm, setConfirm] = useState<string | null>(null);
  const [scorecard, setScorecard] = useState<DriverScorecard | null>(null);
  const [hos, setHos] = useState<DriverHOS | null>(null);

  const resetForm = (item?: Partial<Driver>) => {
    setForm(item ? { ...item } : {
      firstName: '', lastName: '', email: '', phone: '',
      status: 'active', employeeId: `EMP-${Date.now().toString(36).toUpperCase()}`,
    });
  };

  const openCreate = () => { resetForm(); setModal('create'); };
  const openEdit = (row: Driver) => { setSelected(row); resetForm(row); setModal('edit'); };
  const openDelete = (row: Driver) => { setSelected(row); setConfirm('delete'); };

  const openView = async (row: Driver) => {
    setSelected(row);
    setModal('view');
    try {
      const [sRes, hRes] = await Promise.all([
        driversApi.getScorecard(row.id),
        driversApi.getHOS(row.id),
      ]);
      setScorecard(sRes.data);
      setHos(hRes.data);
    } catch {
      setScorecard(null);
      setHos(null);
    }
  };

  const handleSave = async () => {
    const isEdit = modal === 'edit';
    const result = await mutate(() =>
      isEdit ? driversApi.update(selected!.id, form) : driversApi.create(form)
    );
    if (result.ok) {
      toast.show(`Driver ${isEdit ? 'updated' : 'registered'} successfully`, 'success');
      setModal(null); refetch();
    } else toast.show(result.error || 'Failed', 'error');
  };

  const handleDelete = async () => {
    if (!selected) return;
    const result = await mutate(() => driversApi.remove(selected.id));
    if (result.ok) { toast.show('Driver deactivated', 'success'); setConfirm(null); setSelected(null); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const set = (k: string) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader title="Driver Management" breadcrumb="Drivers"
        subtitle={stats ? `${stats.total} drivers · ${stats.active} active · Avg safety: ${stats.avgSafetyScore}` : `${rows.length} drivers`}
        right={<>
          <ExportToolbar rows={rows} filename="drivers" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ Register Driver</button>
        </>} />

      {stats && (
        <div className="stat-cards" style={{ marginBottom: 16 }}>
          <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total Drivers</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#22c55e' }}>{stats.active}</div><div className="stat-label">Active</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#f59e0b' }}>{stats.onLeave}</div><div className="stat-label">On Leave</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#22d3ee' }}>{stats.avgSafetyScore}</div><div className="stat-label">Avg Safety Score</div></div>
        </div>
      )}

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'active', 'inactive', 'suspended', 'on_leave'].map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-cyan' : ''}`}
            onClick={() => { setStatusFilter(s); setPage(1); }}>
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : error ? <ErrorMsg msg={error} onRetry={refetch} /> : (
        <TableCard title="All Drivers" count={total}>
          <CrudDataTable columns={[
            { label: 'Name', render: (r: any) => `${r.firstName} ${r.lastName}` },
            { label: 'Employee ID', key: 'employeeId' },
            { label: 'Status', render: (r: any) => <Badge status={r.status} /> },
            { label: 'Safety', render: (r: any) => (
              <span style={{ color: (r.safetyScore || 0) >= 85 ? '#22c55e' : (r.safetyScore || 0) >= 70 ? '#f59e0b' : '#ef4444', fontWeight: 600 }}>
                {(r.safetyScore || 0).toFixed(0)}
              </span>
            ) },
            { label: 'Efficiency', render: (r: any) => (
              <span style={{ color: 'var(--text-muted)' }}>{(r.efficiencyScore || 0).toFixed(0)}</span>
            ) },
            { label: 'Email', key: 'email' },
          ]} rows={rows} onRowClick={openView} onEdit={openEdit} onDelete={openDelete} />
          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
              <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </TableCard>
      )}

      {/* VIEW Modal */}
      <Modal open={modal === 'view'} onClose={() => { setModal(null); setScorecard(null); setHos(null); }}
        title={selected ? `${(selected as any).firstName} ${(selected as any).lastName}` : 'Driver'} lg>
        {selected && (
          <>
            <DetailView items={[
              { label: 'Employee ID', value: (selected as any).employeeId },
              { label: 'Name', value: `${(selected as any).firstName} ${(selected as any).lastName}` },
              { label: 'Status', value: (selected as any).status },
              { label: 'Email', value: (selected as any).email },
              { label: 'Phone', value: (selected as any).phone },
              { label: 'Hire Date', value: fmtDate((selected as any).hireDate) },
            ]} />

            {/* Scorecard */}
            {scorecard && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: '#22d3ee', fontSize: 14, marginBottom: 12 }}>🎯 Performance Scorecard</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 72, height: 72, borderRadius: '50%', background: `conic-gradient(#22d3ee ${scorecard.overallScore * 3.6}deg, var(--border) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#22d3ee', fontSize: 18 }}>
                      {scorecard.overallScore.toFixed(0)}
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <ScoreBar value={scorecard.safetyScore} label="Safety" color="#22c55e" />
                    <ScoreBar value={scorecard.efficiencyScore} label="Efficiency" color="#3b82f6" />
                    <ScoreBar value={scorecard.complianceScore} label="Compliance" color="#f59e0b" />
                  </div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Trend: <span style={{ color: 'var(--text-muted)' }}>{scorecard.trend}</span></div>
              </div>
            )}

            {/* HOS Status */}
            {hos && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: '#22d3ee', fontSize: 14, marginBottom: 10 }}>⏱️ HOS / ELD Status</h4>
                <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))' }}>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 16 }}><Badge status={hos.currentStatus} /></div><div className="stat-label">Current Status</div></div>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 16 }}>{Math.floor(hos.driveTimeRemainingMin / 60)}h {hos.driveTimeRemainingMin % 60}m</div><div className="stat-label">Drive Time Left</div></div>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 16 }}>{Math.floor(hos.shiftTimeRemainingMin / 60)}h {hos.shiftTimeRemainingMin % 60}m</div><div className="stat-label">Shift Time Left</div></div>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 16 }}>{hos.weeklyHoursUsed}h</div><div className="stat-label">Weekly Hours</div></div>
                </div>
                {hos.breakRequired && <div style={{ marginTop: 8, padding: '6px 12px', background: 'rgba(239,68,68,0.1)', borderRadius: 6, color: '#fca5a5', fontSize: 13 }}>⚠️ Break required</div>}
              </div>
            )}
          </>
        )}
      </Modal>

      {/* CREATE / EDIT Modal */}
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? `Edit — ${(selected as any)?.firstName} ${(selected as any)?.lastName}` : 'Register New Driver'}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleSave} disabled={saving || !form.firstName || !form.lastName}>
            {saving ? 'Saving...' : modal === 'edit' ? 'Update Driver' : 'Register Driver'}
          </button>
        </>}>
        <div className="form-grid">
          <FormField label="First Name" value={form.firstName} onChange={set('firstName')} placeholder="Ahmed" required />
          <FormField label="Last Name" value={form.lastName} onChange={set('lastName')} placeholder="Al Rashid" required />
          <FormField label="Email" value={form.email} onChange={set('email')} placeholder="ahmed@blueedge.com" />
          <FormField label="Phone" value={form.phone} onChange={set('phone')} placeholder="+971 50 XXX XXXX" />
          <FormField label="Employee ID" value={form.employeeId} onChange={set('employeeId')} placeholder="EMP-001" />
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={['active', 'inactive', 'suspended', 'on_leave']} />
        </div>
      </Modal>

      <ConfirmDialog open={confirm === 'delete'} onClose={() => setConfirm(null)} onConfirm={handleDelete} danger
        title="Deactivate Driver" message={`Deactivate ${(selected as any)?.firstName} ${(selected as any)?.lastName}?`} confirmLabel="Deactivate" />
      <toast.Toast />
    </div>
  );
}
