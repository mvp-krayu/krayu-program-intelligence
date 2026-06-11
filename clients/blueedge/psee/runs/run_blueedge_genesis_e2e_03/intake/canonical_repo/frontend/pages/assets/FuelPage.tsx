// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Fuel Management Page (API-integrated)
// Transactions, consumption analytics, theft alerts, stats
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { fuelApi } from '@/api';
import type { FuelStats } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useToast } from '@/hooks';
import { useFleetPositions, useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
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
import { fmtDate, fmt } from '@/utils';

export default function FuelPage() {
  const { connected: wsConnected } = useSocketContext();
  const { count: liveCount } = useFleetPositions();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<'transactions' | 'theft' | 'consumption'>('transactions');
  const limit = 20;
  const toast = useToast();

  const params = useMemo(() => ({ page, limit }), [page, limit]);

  const { data: listData, loading, error, refetch } = useApiQuery(
    () => fuelApi.listTransactions(params), [page], { retryCount: 2 }
  );

  const { data: stats } = useApiQuery<FuelStats>(
    () => fuelApi.getStats(), [], { refetchInterval: 60000 }
  );

  const { data: theftData } = useApiQuery(
    () => fuelApi.getTheftAlerts(), [], { enabled: tab === 'theft', refetchInterval: 30000 }
  );

  const { data: consumptionData } = useApiQuery(
    () => fuelApi.getConsumption(), [], { enabled: tab === 'consumption' }
  );

  const rows = (listData as any)?.items || (Array.isArray(listData) ? listData : []);
  const total = (listData as any)?.total || rows.length;
  const totalPages = Math.ceil(total / limit);
  const theftRows = Array.isArray(theftData) ? theftData : (theftData as any)?.items || [];
  const consumptionRows = Array.isArray(consumptionData) ? consumptionData : (consumptionData as any)?.items || [];

  const { mutate, saving } = useApiMutation();
  const [modal, setModal] = useState<'create' | 'view' | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<Record<string, any>>({});

  const openView = (row: any) => { setSelected(row); setModal('view'); };
  const openCreate = () => {
    setForm({ vehicleId: '', stationName: '', fuelType: 'diesel', liters: 0, totalCostAed: 0, odometerKm: 0, notes: '' });
    setModal('create');
  };

  const handleCreate = async () => {
    const result = await mutate(() => fuelApi.create(form));
    if (result.ok) { toast.show('Fuel transaction recorded', 'success'); setModal(null); refetch(); }
    else toast.show(result.error || 'Failed', 'error');
  };

  const set = (k: string) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader title="Fuel Management" breadcrumb="Fuel"
        subtitle={stats ? `${fmt(stats.totalTransactions)} transactions · ${fmt(stats.totalLiters)} L · AED ${fmt(stats.totalCostAed)}` : `${rows.length} transactions`}
        right={<>
          <ExportToolbar rows={rows} filename="fuel-transactions" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ Record Transaction</button>
        </>} />

      {stats && (
        <div className="stat-cards" style={{ marginBottom: 16 }}>
          <div className="stat-card"><div className="stat-value">{fmt(stats.totalTransactions)}</div><div className="stat-label">Transactions</div></div>
          <div className="stat-card"><div className="stat-value">{fmt(stats.totalLiters)} L</div><div className="stat-label">Total Fuel</div></div>
          <div className="stat-card"><div className="stat-value">AED {fmt(stats.totalCostAed)}</div><div className="stat-label">Total Cost</div></div>
          <div className="stat-card"><div className="stat-value">{stats.avgPricePerLiter?.toFixed(2)}</div><div className="stat-label">AED/Liter</div></div>
          <div className="stat-card"><div className="stat-value">{stats.efficiencyAvgKmPerL?.toFixed(1)}</div><div className="stat-label">Avg km/L</div></div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: stats.theftAlertsActive > 0 ? '#ef4444' : '#22c55e' }}>{stats.theftAlertsActive}</div>
            <div className="stat-label">🔴 Theft Alerts</div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, borderBottom: '1px solid var(--border)', paddingBottom: 2 }}>
        {[
          { id: 'transactions' as const, label: '⛽ Transactions', count: total },
          { id: 'theft' as const, label: '🚨 Theft Alerts', count: stats?.theftAlertsActive },
          { id: 'consumption' as const, label: '📊 Consumption', count: null },
        ].map(t => (
          <button key={t.id} className={`btn btn-sm ${tab === t.id ? 'btn-cyan' : ''}`}
            onClick={() => setTab(t.id)} style={{ borderRadius: '6px 6px 0 0' }}>
            {t.label} {t.count != null && <span style={{ opacity: 0.6, marginLeft: 4 }}>({t.count})</span>}
          </button>
        ))}
      </div>

      {tab === 'transactions' && (
        <>
          {loading ? <Loading /> : error ? <ErrorMsg msg={error} onRetry={refetch} /> : (
            <TableCard title="Fuel Transactions" count={total}>
              <CrudDataTable columns={[
                { label: 'Vehicle', key: 'vehicleId' },
                { label: 'Station', key: 'stationName' },
                { label: 'Fuel Type', render: (r: any) => <Badge status={r.fuelType || 'diesel'} /> },
                { label: 'Liters', render: (r: any) => `${r.liters?.toFixed(1) || '—'} L` },
                { label: 'Cost', render: (r: any) => r.totalCostAed ? `AED ${fmt(r.totalCostAed)}` : '—' },
                { label: 'Rate', render: (r: any) => r.pricePerLiter ? `${r.pricePerLiter.toFixed(2)}/L` : '—' },
                { label: 'Odometer', render: (r: any) => r.odometerKm ? `${fmt(r.odometerKm)} km` : '—' },
                { label: 'Date', render: (r: any) => fmtDate(r.transactionDate || r.createdAt) },
              ]} rows={rows} onRowClick={openView} />
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

      {tab === 'theft' && (
        <TableCard title="Fuel Theft Detection Alerts" count={theftRows.length}>
          {theftRows.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#22c55e' }}>✅ No fuel theft alerts detected</div>
          ) : (
            <CrudDataTable columns={[
              { label: 'Vehicle', key: 'vehicleId' },
              { label: 'Severity', render: (r: any) => <Badge status={r.severity || 'high'} /> },
              { label: 'Drop Amount', render: (r: any) => `${r.fuelDropLiters?.toFixed(1)} L` },
              { label: 'Location', key: 'location' },
              { label: 'Detected At', render: (r: any) => fmtDate(r.detectedAt) },
              { label: 'Status', render: (r: any) => <Badge status={r.status || 'active'} /> },
            ]} rows={theftRows} onRowClick={openView} />
          )}
        </TableCard>
      )}

      {tab === 'consumption' && (
        <TableCard title="Fleet Fuel Consumption Analytics" count={consumptionRows.length}>
          {consumptionRows.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Loading consumption analytics...</div>
          ) : (
            <CrudDataTable columns={[
              { label: 'Vehicle', key: 'vehicleId' },
              { label: 'Period', key: 'period' },
              { label: 'Total Liters', render: (r: any) => `${r.totalLiters?.toFixed(0)} L` },
              { label: 'Total Cost', render: (r: any) => `AED ${fmt(r.totalCost)}` },
              { label: 'Efficiency', render: (r: any) => `${r.kmPerLiter?.toFixed(1)} km/L` },
              { label: 'Distance', render: (r: any) => `${fmt(r.distanceKm)} km` },
            ]} rows={consumptionRows} onRowClick={openView} />
          )}
        </TableCard>
      )}

      {/* VIEW */}
      <Modal open={modal === 'view'} onClose={() => setModal(null)} title="Details" lg>
        {selected && <DetailView items={Object.entries(selected).filter(([k]) => !['__v'].includes(k)).map(([k, v]) => ({
          label: k.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()),
          value: v instanceof Object ? JSON.stringify(v) : String(v ?? '—'),
        }))} />}
      </Modal>

      {/* CREATE */}
      <Modal open={modal === 'create'} onClose={() => setModal(null)} title="Record Fuel Transaction"
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleCreate} disabled={saving || !form.vehicleId}>
            {saving ? 'Recording...' : 'Record Transaction'}
          </button>
        </>}>
        <div className="form-grid">
          <FormField label="Vehicle ID" value={form.vehicleId} onChange={set('vehicleId')} placeholder="Vehicle UUID" required />
          <FormField label="Station" value={form.stationName} onChange={set('stationName')} placeholder="ENOC Al Barsha" />
          <FormField label="Fuel Type" type="select" value={form.fuelType} onChange={set('fuelType')} options={['diesel', 'petrol_95', 'petrol_98', 'cng', 'lpg']} />
          <FormField label="Liters" type="number" value={form.liters} onChange={set('liters')} placeholder="0" />
          <FormField label="Total Cost (AED)" type="number" value={form.totalCostAed} onChange={set('totalCostAed')} />
          <FormField label="Odometer (km)" type="number" value={form.odometerKm} onChange={set('odometerKm')} />
          <FormField label="Notes" type="textarea" value={form.notes} onChange={set('notes')} />
        </div>
      </Modal>

      <toast.Toast />
    </div>
  );
}
