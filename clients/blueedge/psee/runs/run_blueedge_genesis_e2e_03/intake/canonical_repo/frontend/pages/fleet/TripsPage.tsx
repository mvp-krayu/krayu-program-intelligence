// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Trips Page (API-integrated)
// CRUD + timeline + stats + active trip tracking
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { tripsApi } from '@/api';
import type { TripStats, TripTimeline } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast } from '@/hooks';
import { useSocketEvent, useSocketContext } from '@/socket';
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
import type { Trip } from '@/types';

export default function TripsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const limit = 20;
  const toast = useToast();

  const params = useMemo(() => ({
    page, limit,
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  }), [page, limit, statusFilter]);

  const { data: listData, loading, error, refetch } = useApiQuery(
    () => tripsApi.list(params), [page, statusFilter], { retryCount: 2 }
  );

  const { data: stats } = useApiQuery<TripStats>(
    () => tripsApi.getStats(), [], { refetchInterval: 60000 }
  );

  const { data: activeTrips } = useApiQuery<Trip[]>(
    () => tripsApi.getActive(), [], { refetchInterval: 30000 }
  );

  const rows = (listData as any)?.items || (Array.isArray(listData) ? listData : []) as Trip[];
  const total = (listData as any)?.total || rows.length;
  const totalPages = Math.ceil(total / limit);

  const { mutate, saving } = useApiMutation();

  // Live WebSocket events — auto-refresh on trip start/complete
  const { connected: wsConnected } = useSocketContext();
  useSocketEvent('trip:started', () => { refetch(); }, []);
  useSocketEvent('trip:completed', () => { refetch(); }, []);
  useSocketEvent('trip:delayed', (ev) => { toast.show(`Trip ${ev.tripId} delayed`, 'warning'); }, []);

  const [modal, setModal] = useState<'create' | 'view' | null>(null);
  const [selected, setSelected] = useState<Trip | null>(null);
  const [timeline, setTimeline] = useState<TripTimeline | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [confirm, setConfirm] = useState<string | null>(null);

  const openView = async (row: Trip) => {
    setSelected(row);
    setModal('view');
    try {
      const res = await tripsApi.getTimeline(row.id);
      setTimeline(res.data);
    } catch { setTimeline(null); }
  };

  const openCreate = () => {
    setForm({ vehicleId: '', driverId: '', startAddress: '', endAddress: '', tripType: 'tanker_delivery', status: 'planned' });
    setModal('create');
  };

  const handleCreate = async () => {
    const result = await mutate(() => tripsApi.create(form));
    if (result.ok) { toast.show('Trip created', 'success'); setModal(null); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const handleStart = async (trip: Trip) => {
    const result = await mutate(() => tripsApi.start(trip.id));
    if (result.ok) { toast.show('Trip started', 'success'); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const handleComplete = async (trip: Trip) => {
    const result = await mutate(() => tripsApi.complete(trip.id));
    if (result.ok) { toast.show('Trip completed', 'success'); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const handleCancel = async () => {
    if (!selected) return;
    const result = await mutate(() => tripsApi.cancel(selected.id));
    if (result.ok) { toast.show('Trip cancelled', 'success'); setConfirm(null); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const set = (k: string) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader title="Trip Management" breadcrumb="Trips"
        subtitle={stats ? `${stats.totalTrips} trips · ${stats.inProgress} in progress · Avg ${stats.avgDistanceKm} km` : `${rows.length} trips`}
        right={<>
          {wsConnected && <ConnectionStatus compact />}
          <ExportToolbar rows={rows} filename="trips" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ Create Trip</button>
        </>} />

      {stats && (
        <div className="stat-cards" style={{ marginBottom: 16 }}>
          <div className="stat-card"><div className="stat-value">{fmt(stats.totalTrips)}</div><div className="stat-label">Total Trips</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#22c55e' }}>{stats.completed}</div><div className="stat-label">Completed</div></div>
          <div className="stat-card"><div className="stat-value" style={{ color: '#3b82f6' }}>{stats.inProgress}</div><div className="stat-label">In Progress</div></div>
          <div className="stat-card"><div className="stat-value">{stats.avgDistanceKm} km</div><div className="stat-label">Avg Distance</div></div>
          <div className="stat-card"><div className="stat-value">{stats.avgDurationMin} min</div><div className="stat-label">Avg Duration</div></div>
          <div className="stat-card"><div className="stat-value">{stats.avgScore}</div><div className="stat-label">Avg Trip Score</div></div>
        </div>
      )}

      {/* Active trips banner */}
      {activeTrips && activeTrips.length > 0 && (
        <div style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#60a5fa', marginBottom: 8 }}>
            🔴 {activeTrips.length} Active Trip{activeTrips.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {activeTrips.slice(0, 5).map((t: any) => (
              <button key={t.id} className="btn btn-sm" onClick={() => openView(t)} style={{ fontSize: 12 }}>
                {t.startAddress || t.id.slice(0, 8)} → {t.endAddress || '...'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Status filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'planned', 'in_progress', 'completed', 'cancelled'].map(s => (
          <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-cyan' : ''}`}
            onClick={() => { setStatusFilter(s); setPage(1); }}>
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </button>
        ))}
      </div>

      {loading ? <Loading /> : error ? <ErrorMsg msg={error} onRetry={refetch} /> : (
        <TableCard title="All Trips" count={total}>
          <CrudDataTable columns={[
            { label: 'Origin', render: (r: any) => r.startAddress || '—' },
            { label: 'Destination', render: (r: any) => r.endAddress || '—' },
            { label: 'Status', render: (r: any) => <Badge status={r.status} /> },
            { label: 'Type', render: (r: any) => <Badge status={r.tripType?.replace('_', ' ')} /> },
            { label: 'Distance', render: (r: any) => r.distanceKm ? `${r.distanceKm} km` : '—' },
            { label: 'Duration', render: (r: any) => r.durationMinutes ? `${r.durationMinutes} min` : '—' },
            { label: 'Score', render: (r: any) => (
              <span style={{ color: (r.tripScore || 0) >= 85 ? '#22c55e' : '#f59e0b', fontWeight: 600 }}>{r.tripScore || '—'}</span>
            ) },
            { label: 'Actions', render: (r: any) => (
              <div style={{ display: 'flex', gap: 4 }}>
                {r.status === 'planned' && <button className="btn btn-sm btn-cyan" onClick={(e) => { e.stopPropagation(); handleStart(r); }}>Start</button>}
                {r.status === 'in_progress' && <button className="btn btn-sm" style={{ background: '#22c55e', color: '#fff' }} onClick={(e) => { e.stopPropagation(); handleComplete(r); }}>Complete</button>}
              </div>
            ) },
          ]} rows={rows} onRowClick={openView} />
          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
              <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </TableCard>
      )}

      {/* VIEW Modal with timeline */}
      <Modal open={modal === 'view'} onClose={() => { setModal(null); setTimeline(null); }} title="Trip Details" lg>
        {selected && (
          <>
            <DetailView items={[
              { label: 'Trip ID', value: selected.id },
              { label: 'Status', value: selected.status },
              { label: 'Origin', value: (selected as any).startAddress || '—' },
              { label: 'Destination', value: (selected as any).endAddress || '—' },
              { label: 'Distance', value: (selected as any).distanceKm ? `${(selected as any).distanceKm} km` : '—' },
              { label: 'Duration', value: (selected as any).durationMinutes ? `${(selected as any).durationMinutes} min` : '—' },
              { label: 'Fuel Used', value: (selected as any).fuelUsedL ? `${(selected as any).fuelUsedL} L` : '—' },
              { label: 'Trip Score', value: (selected as any).tripScore },
              { label: 'Started', value: fmtDate(selected.startTime) },
              { label: 'Ended', value: fmtDate(selected.endTime) },
            ]} />

            {/* Trip Timeline */}
            {timeline?.events && timeline.events.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: '#22d3ee', fontSize: 14, marginBottom: 12 }}>📍 Trip Timeline</h4>
                <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 16, marginLeft: 8 }}>
                  {timeline.events.map((evt, i) => (
                    <div key={i} style={{ marginBottom: 16, position: 'relative' }}>
                      <div style={{ position: 'absolute', left: -22, top: 2, width: 10, height: 10, borderRadius: '50%', background: i === timeline.events.length - 1 ? '#22d3ee' : '#475569' }} />
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{evt.type.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{evt.location} · {new Date(evt.time).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ marginTop: 20, display: 'flex', gap: 8 }}>
              {selected.status === 'planned' && <button className="btn btn-cyan" onClick={() => { handleStart(selected); setModal(null); }}>▶ Start Trip</button>}
              {selected.status === 'in_progress' && <button className="btn" style={{ background: '#22c55e', color: '#fff' }} onClick={() => { handleComplete(selected); setModal(null); }}>✓ Complete Trip</button>}
              {['planned', 'in_progress'].includes(selected.status) && (
                <button className="btn btn-danger" onClick={() => { setConfirm('cancel'); }}>✕ Cancel Trip</button>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* CREATE Modal */}
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Create New Trip"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleCreate} disabled={saving}>{saving ? 'Creating...' : 'Create Trip'}</button>
        </>}>
        <div className="form-grid">
          <FormField label="Origin" value={form.startAddress} onChange={set('startAddress')} placeholder="Jebel Ali Terminal" />
          <FormField label="Destination" value={form.endAddress} onChange={set('endAddress')} placeholder="Fujairah Port" />
          <FormField label="Trip Type" type="select" value={form.tripType} onChange={set('tripType')} options={['tanker_delivery', 'bus_route', 'taxi_ride', 'deadhead', 'maintenance']} />
          <FormField label="Vehicle ID" value={form.vehicleId} onChange={set('vehicleId')} placeholder="Vehicle UUID" />
          <FormField label="Driver ID" value={form.driverId} onChange={set('driverId')} placeholder="Driver UUID" />
        </div>
      </Modal>

      <ConfirmDialog open={confirm === 'cancel'} onClose={() => setConfirm(null)} onConfirm={handleCancel} danger
        title="Cancel Trip" message="Are you sure you want to cancel this trip?" confirmLabel="Cancel Trip" />
      <toast.Toast />
    </div>
  );
}
