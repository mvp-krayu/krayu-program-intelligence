// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Vehicles Page (API-integrated)
// Full CRUD with live backend, stats, telemetry, DTCs
// ══════════════════════════════════════════════════════════════

import React, { useState, useMemo } from 'react';
import { vehiclesApi } from '@/api';
import type { VehicleStats } from '@/api';
import { useApiQuery, useApiMutation } from '@/hooks/useApiQuery';
import { useVehicleTelemetry, useFleetPositions, useSocketContext } from '@/socket';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import { useToast } from '@/hooks';
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
import FleetFilter from '@/components/layout/FleetFilter';
import { fmtDate, fmtPct, fmt } from '@/utils';
import type { Vehicle } from '@/types';

export default function VehiclesPage() {
  const [fleet, setFleet] = useState('all');
  const [page, setPage] = useState(1);
  const limit = 20;
  const toast = useToast();

  // ── API Queries ──────────────────────────────────────────
  const params = useMemo(() => ({
    page,
    limit,
    ...(fleet !== 'all' ? { fleetType: fleet } : {}),
  }), [page, limit, fleet]);

  const { data: listData, loading, error, refetch } = useApiQuery(
    () => vehiclesApi.list(params),
    [fleet, page],
    { retryCount: 2 }
  );

  const { data: stats } = useApiQuery<VehicleStats>(
    () => vehiclesApi.getStats(),
    [],
    { refetchInterval: 60000 }
  );

  const rows = (listData as any)?.items || (Array.isArray(listData) ? listData : []) as Vehicle[];
  const total = (listData as any)?.total || rows.length;
  const totalPages = Math.ceil(total / limit);

  // ── Mutation ────────────────────────────────────────────
  const { mutate, saving } = useApiMutation();

  // ── Modal state ─────────────────────────────────────────
  const [modal, setModal] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [confirm, setConfirm] = useState<string | null>(null);
  const [telemetry, setTelemetry] = useState<any>(null);
  const [dtcs, setDtcs] = useState<any[]>([]);

  // Live WebSocket telemetry for selected vehicle
  const liveVehicleId = modal === 'view' && selected ? selected.id : null;
  const { position: livePos, telemetry: liveTel } = useVehicleTelemetry(liveVehicleId);
  const { connected: wsConnected } = useSocketContext();
  const { positions: livePositions } = useFleetPositions(fleet !== 'all' ? fleet as any : undefined);

  const resetForm = (item?: Partial<Vehicle>) => {
    setForm(item ? { ...item } : {
      licensePlate: '', fleetType: 'tanker', make: '', model: '',
      year: new Date().getFullYear(), color: '', status: 'active', vin: '',
    });
  };

  const openCreate = () => { resetForm(); setModal('create'); };
  const openEdit = (row: Vehicle) => { setSelected(row); resetForm(row); setModal('edit'); };
  const openDelete = (row: Vehicle) => { setSelected(row); setConfirm('delete'); };

  const openView = async (row: Vehicle) => {
    setSelected(row);
    setModal('view');
    // Fetch telemetry + DTCs in parallel
    try {
      const [tRes, dRes] = await Promise.all([
        vehiclesApi.getTelemetry(row.id),
        vehiclesApi.getDtcs(row.id),
      ]);
      setTelemetry(tRes.data);
      setDtcs(dRes.data || []);
    } catch {
      setTelemetry(null);
      setDtcs([]);
    }
  };

  const handleSave = async () => {
    const isEdit = modal === 'edit';
    const result = await mutate(() =>
      isEdit ? vehiclesApi.update(selected!.id, form) : vehiclesApi.create(form)
    );
    if (result.ok) {
      toast.show(`Vehicle ${isEdit ? 'updated' : 'created'} successfully`, 'success');
      setModal(null);
      refetch();
    } else {
      toast.show(result.error || 'Operation failed', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    const result = await mutate(() => vehiclesApi.remove(selected.id));
    if (result.ok) {
      toast.show('Vehicle decommissioned', 'success');
      setConfirm(null);
      setSelected(null);
      refetch();
    } else {
      toast.show(result.error || 'Delete failed', 'error');
    }
  };

  const set = (k: string) => (v: any) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <PageHeader title="Vehicle Fleet" breadcrumb="Vehicles"
        subtitle={stats ? `${stats.total} vehicles · ${stats.active} active${wsConnected ? ` · ${livePositions.length} tracked live` : ''}` : `${rows.length} vehicles`}
        right={<>
          {wsConnected && <ConnectionStatus compact />}
          <ExportToolbar rows={rows} filename="vehicles" compact />
          <button className="btn btn-cyan" onClick={openCreate}>+ Add Vehicle</button>
        </>} />

      {/* Stats row */}
      {stats && (
        <div className="stat-cards" style={{ marginBottom: 16 }}>
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Vehicles</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#22c55e' }}>{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value" style={{ color: '#f59e0b' }}>{stats.inMaintenance}</div>
            <div className="stat-label">In Maintenance</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.byType?.tankers || 0} / {stats.byType?.buses || 0} / {stats.byType?.taxis || 0}</div>
            <div className="stat-label">Tanker / Bus / Taxi</div>
          </div>
        </div>
      )}

      <FleetFilter value={fleet} onChange={v => { setFleet(v); setPage(1); }} />

      {loading ? <Loading /> : error ? <ErrorMsg msg={error} onRetry={refetch} /> : (
        <TableCard title="All Vehicles" count={total}>
          <CrudDataTable
            columns={[
              { label: 'License', key: 'licensePlate' },
              { label: 'Type', render: (r: Vehicle) => <Badge status={r.fleetType} /> },
              { label: 'Status', render: (r: Vehicle) => <Badge status={r.status} /> },
              { label: 'Make / Model', render: (r: Vehicle) => `${r.make || ''} ${r.model || ''}`.trim() || '—' },
              { label: 'Odometer', render: (r: Vehicle) => r.odometerKm ? `${fmt(r.odometerKm)} km` : '—' },
              { label: 'Fuel', render: (r: Vehicle) => r.fuelLevelPercent != null ? fmtPct(r.fuelLevelPercent) : '—' },
            ]}
            rows={rows}
            onRowClick={openView}
            onEdit={openEdit}
            onDelete={openDelete}
          />
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
              <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--text-muted)' }}>Page {page} of {totalPages}</span>
              <button className="btn btn-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </TableCard>
      )}

      {/* VIEW Modal with telemetry + DTCs */}
      <Modal open={modal === 'view'} onClose={() => { setModal(null); setTelemetry(null); setDtcs([]); }} title={`Vehicle — ${selected?.licensePlate || ''}`} lg>
        {selected && (
          <>
            <DetailView items={[
              { label: 'License Plate', value: selected.licensePlate },
              { label: 'VIN', value: (selected as any).vin },
              { label: 'Fleet Type', value: selected.fleetType },
              { label: 'Status', value: selected.status },
              { label: 'Make', value: selected.make },
              { label: 'Model', value: selected.model },
              { label: 'Year', value: selected.year },
              { label: 'Odometer', value: selected.odometerKm ? `${fmt(selected.odometerKm)} km` : '—' },
              { label: 'Fuel Level', value: selected.fuelLevelPercent != null ? `${selected.fuelLevelPercent}%` : '—' },
              { label: 'Engine Hours', value: selected.engineHours ? fmt(selected.engineHours) : '—' },
              { label: 'Created', value: fmtDate(selected.createdAt) },
            ]} />

            {/* Live Telemetry Section */}
            {(telemetry || liveTel) && (() => {
              // Prefer WebSocket live data, fall back to API snapshot
              const t = liveTel || telemetry;
              const isLive = !!liveTel;
              const rpm = liveTel ? t.engine.rpm : t.engineRpm;
              const speed = liveTel ? t.vehicle.speedKmh : t.speedKmh;
              const coolant = liveTel ? t.engine.coolantTempC?.toFixed(1) : t.coolantTempC;
              const oil = liveTel ? t.engine.oilPressureKpa?.toFixed(0) : t.oilPressureKpa;
              const battery = liveTel ? t.vehicle.batteryVoltage?.toFixed(1) : t.batteryVoltage;
              const fuel = liveTel ? null : t.fuelLevelPercent;
              return (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: '#22d3ee', fontSize: 14, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  📡 {isLive ? 'Live' : ''} Telemetry
                  {isLive && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e', animation: 'pulse-dot 2s ease-in-out infinite' }} />}
                  {isLive && livePos && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{livePos.speed} km/h · {livePos.status}</span>}
                </h4>
                <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))' }}>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 18 }}>{rpm}</div><div className="stat-label">RPM</div></div>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 18 }}>{speed} km/h</div><div className="stat-label">Speed</div></div>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 18 }}>{coolant}°C</div><div className="stat-label">Coolant</div></div>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 18 }}>{oil} kPa</div><div className="stat-label">Oil Pressure</div></div>
                  <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 18 }}>{battery}V</div><div className="stat-label">Battery</div></div>
                  {fuel != null && <div className="stat-card mini"><div className="stat-value" style={{ fontSize: 18 }}>{fuel}%</div><div className="stat-label">Fuel</div></div>}
                  {liveTel?.tank && (
                    <div className="stat-card mini" style={{ gridColumn: 'span 2' }}>
                      <div className="stat-value" style={{ fontSize: 14 }}>
                        {liveTel.tank.compartments.map((c: any) => `C${c.id}: ${c.levelPercent.toFixed(0)}%`).join(' · ')}
                      </div>
                      <div className="stat-label">Tank Compartments</div>
                    </div>
                  )}
                  {liveTel?.safety && (liveTel.safety.absActive || liveTel.safety.escActive || liveTel.safety.rollStabilityWarning) && (
                    <div className="stat-card mini" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                      <div className="stat-value" style={{ fontSize: 12, color: '#ef4444' }}>
                        {liveTel.safety.absActive && '⚠️ ABS '}
                        {liveTel.safety.escActive && '⚠️ ESC '}
                        {liveTel.safety.rollStabilityWarning && '🔴 ROLL WARNING'}
                      </div>
                      <div className="stat-label">Safety Systems</div>
                    </div>
                  )}
                </div>
              </div>
              );
            })()}

            {/* Active DTCs */}
            {dtcs.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: '#ef4444', fontSize: 14, marginBottom: 10 }}>⚠️ Active Diagnostic Trouble Codes</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {dtcs.map((dtc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                      <code style={{ color: '#fca5a5', fontWeight: 600, fontSize: 13 }}>{dtc.code}</code>
                      <span style={{ flex: 1, color: 'var(--text-primary)', fontSize: 13 }}>{dtc.description}</span>
                      <Badge status={dtc.severity} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Modal>

      {/* CREATE / EDIT Modal */}
      <Modal open={modal === 'create' || modal === 'edit'} onClose={() => setModal(null)}
        title={modal === 'edit' ? `Edit Vehicle — ${selected?.licensePlate}` : 'Register New Vehicle'}
        footer={<>
          <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
          <button className="btn btn-cyan" onClick={handleSave} disabled={saving || !form.licensePlate || !form.make}>
            {saving ? 'Saving...' : modal === 'edit' ? 'Update Vehicle' : 'Create Vehicle'}
          </button>
        </>}>
        <div className="form-grid">
          <FormField label="License Plate" value={form.licensePlate} onChange={set('licensePlate')} placeholder="DXB-A-12345" required />
          <FormField label="VIN" value={form.vin} onChange={set('vin')} placeholder="17-character VIN" />
          <FormField label="Fleet Type" type="select" value={form.fleetType} onChange={set('fleetType')} options={['tanker', 'bus', 'taxi']} required />
          <FormField label="Status" type="select" value={form.status} onChange={set('status')} options={['active', 'inactive', 'maintenance', 'decommissioned']} />
          <FormField label="Make" value={form.make} onChange={set('make')} placeholder="MAN, Mercedes, Toyota..." required />
          <FormField label="Model" value={form.model} onChange={set('model')} placeholder="TGS 40.480" />
          <FormField label="Year" type="number" value={form.year} onChange={set('year')} />
          <FormField label="Color" value={form.color} onChange={set('color')} placeholder="White, Silver..." />
        </div>
      </Modal>

      <ConfirmDialog open={confirm === 'delete'} onClose={() => setConfirm(null)} onConfirm={handleDelete} danger
        title="Decommission Vehicle"
        message={`Are you sure you want to decommission vehicle ${selected?.licensePlate}? This action can be reversed by updating the status later.`}
        confirmLabel="Decommission" />

      <toast.Toast />
    </div>
  );
}
