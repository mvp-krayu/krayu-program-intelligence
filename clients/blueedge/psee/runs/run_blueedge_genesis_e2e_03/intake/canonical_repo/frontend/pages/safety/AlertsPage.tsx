// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Alerts Page (API-integrated)
// Live alerts with acknowledge, resolve, dismiss actions
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { alertsApi } from '@/api';
import type { AlertStats } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useAlertStream, useSocketContext } from '@/socket';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks';
import Modal from '@/components/ui/Modal';
import FormField from '@/components/ui/FormField';
import ExportToolbar from '@/components/ui/ExportToolbar';
import Loading from '@/components/ui/Loading';
import ErrorMsg from '@/components/ui/ErrorMsg';
import Badge from '@/components/ui/Badge';
import CrudDataTable from '@/components/data/CrudDataTable';
import DetailView from '@/components/data/DetailView';
import TableCard from '@/components/data/TableCard';
import PageHeader from '@/components/layout/PageHeader';
import { fmtDate } from '@/utils';
import type { Alert } from '@/types';

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#f59e0b', low: '#3b82f6', info: '#6b7280',
};

const SEVERITY_ICONS: Record<string, string> = {
  critical: '🔴', high: '🟠', medium: '🟡', low: '🔵', info: 'ℹ️',
};

export default function AlertsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Live WebSocket alert stream
  const { connected: wsConnected } = useSocketContext();
  const { alerts: liveAlerts, latestAlert } = useAlertStream({ maxItems: 30 });
  const limit = 20;
  const toast = useToast();

  const params = useMemo(() => ({
    page, limit,
    ...(severityFilter !== 'all' ? { severity: severityFilter } : {}),
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  }), [page, limit, severityFilter, statusFilter]);

  const { data: listData, loading, error, refetch } = useApiQuery(
    () => alertsApi.list(params), [page, severityFilter, statusFilter],
    { retryCount: 2, refetchInterval: 15000 } // Poll every 15s for live alerts
  );

  const { data: stats } = useApiQuery<AlertStats>(
    () => alertsApi.getStats(), [], { refetchInterval: 15000 }
  );

  const rows = (listData as any)?.items || (Array.isArray(listData) ? listData : []) as Alert[];
  const total = (listData as any)?.total || rows.length;
  const totalPages = Math.ceil(total / limit);

  const { mutate } = useApiMutation();

  const [selected, setSelected] = useState<Alert | null>(null);
  const [modal, setModal] = useState<'view' | 'resolve' | null>(null);
  const [resolution, setResolution] = useState('');

  const openView = (row: Alert) => { setSelected(row); setModal('view'); };

  const handleAcknowledge = async (alert: Alert) => {
    const result = await mutate(() => alertsApi.acknowledge(alert.id, user?.id || ''));
    if (result.ok) { toast.show('Alert acknowledged', 'success'); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const handleResolve = async () => {
    if (!selected) return;
    const result = await mutate(() => alertsApi.resolve(selected.id, user?.id || '', resolution));
    if (result.ok) { toast.show('Alert resolved', 'success'); setModal(null); setResolution(''); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const handleDismiss = async (alert: Alert) => {
    const result = await mutate(() => alertsApi.dismiss(alert.id));
    if (result.ok) { toast.show('Alert dismissed', 'info'); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  return (
    <div>
      <PageHeader title="Alert Center" breadcrumb="Alerts"
        subtitle={stats ? `${stats.active} active · ${stats.critical} critical · Avg resolution: ${stats.avgResolutionMinutes} min` : `${rows.length} alerts`}
        right={<ExportToolbar rows={rows} filename="alerts" compact />} />

      {/* Stats */}
      {stats && (
        <div className="stat-cards" style={{ marginBottom: 16 }}>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#ef4444' }}>{stats.critical}</div>
            <div className="stat-label">🔴 Critical</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.active}</div>
            <div className="stat-label">Active Alerts</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#3b82f6' }}>{stats.acknowledged}</div>
            <div className="stat-label">Acknowledged</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#22c55e' }}>{stats.resolvedToday}</div>
            <div className="stat-label">Resolved Today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.avgResolutionMinutes}m</div>
            <div className="stat-label">Avg Resolution</div>
          </div>
          {wsConnected && (
            <div className="stat-card" style={{ border: '1px solid rgba(34,211,238,0.2)', background: 'rgba(34,211,238,0.04)' }}>
              <div className="stat-value" style={{ color: '#22d3ee', display: 'flex', alignItems: 'center', gap: 6 }}>
                {liveAlerts.length}
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulse-dot 2s ease-in-out infinite' }} />
              </div>
              <div className="stat-label">📡 Live Stream</div>
            </div>
          )}
        </div>
      )}

      {/* Live alert flash */}
      {latestAlert && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', marginBottom: 12,
          background: latestAlert.severity === 'critical' ? 'rgba(239,68,68,0.08)' : 'rgba(249,115,22,0.08)',
          border: `1px solid ${latestAlert.severity === 'critical' ? '#ef444433' : '#f9731633'}`,
          borderRadius: 8, animation: 'fadeIn 0.3s ease-out',
        }}>
          <span style={{ fontSize: 16 }}>{latestAlert.severity === 'critical' ? '🔴' : '🟠'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>NEW: {latestAlert.message}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{latestAlert.vehicleId} · {new Date(latestAlert.timestamp).toLocaleTimeString()}</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>Severity:</span>
          {['all', 'critical', 'high', 'medium', 'low', 'info'].map(s => (
            <button key={s} className={`btn btn-sm ${severityFilter === s ? 'btn-cyan' : ''}`}
              onClick={() => { setSeverityFilter(s); setPage(1); }}
              style={s !== 'all' && severityFilter !== s ? { borderColor: SEVERITY_COLORS[s], color: SEVERITY_COLORS[s] } : {}}>
              {s === 'all' ? 'All' : `${SEVERITY_ICONS[s]} ${s.charAt(0).toUpperCase() + s.slice(1)}`}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)', alignSelf: 'center', marginRight: 4 }}>Status:</span>
          {['all', 'active', 'acknowledged', 'resolved', 'dismissed'].map(s => (
            <button key={s} className={`btn btn-sm ${statusFilter === s ? 'btn-cyan' : ''}`}
              onClick={() => { setStatusFilter(s); setPage(1); }}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Loading /> : error ? <ErrorMsg msg={error} onRetry={refetch} /> : (
        <TableCard title="Alerts" count={total}>
          <CrudDataTable columns={[
            { label: '', render: (r: Alert) => (
              <span style={{ fontSize: 16 }}>{SEVERITY_ICONS[r.severity] || '⚪'}</span>
            ) },
            { label: 'Severity', render: (r: Alert) => (
              <span style={{ color: SEVERITY_COLORS[r.severity], fontWeight: 600, fontSize: 13, textTransform: 'uppercase' as any }}>{r.severity}</span>
            ) },
            { label: 'Type', render: (r: Alert) => <Badge status={r.type?.replace('_', ' ')} /> },
            { label: 'Message', key: 'message' },
            { label: 'Status', render: (r: Alert) => <Badge status={r.status} /> },
            { label: 'Time', render: (r: Alert) => (
              <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>{fmtDate(r.createdAt)}</span>
            ) },
            { label: 'Actions', render: (r: Alert) => (
              <div style={{ display: 'flex', gap: 4 }} onClick={e => e.stopPropagation()}>
                {r.status === 'active' && (
                  <button className="btn btn-sm" style={{ background: '#3b82f6', color: '#fff', fontSize: 11 }}
                    onClick={() => handleAcknowledge(r)}>ACK</button>
                )}
                {(r.status === 'active' || r.status === 'acknowledged') && (
                  <button className="btn btn-sm" style={{ background: '#22c55e', color: '#fff', fontSize: 11 }}
                    onClick={() => { setSelected(r); setModal('resolve'); }}>Resolve</button>
                )}
                {r.status !== 'resolved' && r.status !== 'dismissed' && (
                  <button className="btn btn-sm" style={{ fontSize: 11 }}
                    onClick={() => handleDismiss(r)}>Dismiss</button>
                )}
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

      {/* VIEW Modal */}
      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Alert Details" lg>
        {selected && (
          <>
            <div style={{ padding: '12px 16px', marginBottom: 16, borderRadius: 8, background: `${SEVERITY_COLORS[selected.severity]}10`, border: `1px solid ${SEVERITY_COLORS[selected.severity]}30` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>{SEVERITY_ICONS[selected.severity]}</span>
                <span style={{ color: SEVERITY_COLORS[selected.severity], fontWeight: 700, fontSize: 15, textTransform: 'uppercase' as any }}>{selected.severity}</span>
                <Badge status={selected.status} />
              </div>
              <p style={{ color: 'var(--text-primary)', fontSize: 14, margin: 0 }}>{selected.message}</p>
            </div>
            <DetailView items={[
              { label: 'Alert ID', value: selected.id },
              { label: 'Type', value: selected.type },
              { label: 'Category', value: (selected as any).category },
              { label: 'Vehicle ID', value: selected.vehicleId },
              { label: 'Driver ID', value: (selected as any).driverId || '—' },
              { label: 'Created', value: fmtDate(selected.createdAt) },
              { label: 'Acknowledged', value: selected.acknowledgedAt ? fmtDate(selected.acknowledgedAt) : '—' },
              { label: 'Resolved', value: selected.resolvedAt ? fmtDate(selected.resolvedAt) : '—' },
              { label: 'Resolution', value: (selected as any).resolution || '—' },
            ]} />
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              {selected.status === 'active' && <button className="btn btn-cyan" onClick={() => handleAcknowledge(selected)}>Acknowledge</button>}
              {(selected.status === 'active' || selected.status === 'acknowledged') && (
                <button className="btn" style={{ background: '#22c55e', color: '#fff' }} onClick={() => { setModal('resolve'); }}>Resolve</button>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* RESOLVE Modal */}
      <Modal open={modal === 'resolve'} onClose={() => { setModal(null); setResolution(''); }} title="Resolve Alert"
        footer={<>
          <button className="btn btn-ghost" onClick={() => { setModal(null); setResolution(''); }}>Cancel</button>
          <button className="btn" style={{ background: '#22c55e', color: '#fff' }} onClick={handleResolve} disabled={!resolution.trim()}>Resolve Alert</button>
        </>}>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 12 }}>
          {selected?.message}
        </p>
        <FormField label="Resolution Notes" type="textarea" value={resolution} onChange={setResolution}
          placeholder="Describe how this alert was resolved..." required />
      </Modal>

      <toast.Toast />
    </div>
  );
}
