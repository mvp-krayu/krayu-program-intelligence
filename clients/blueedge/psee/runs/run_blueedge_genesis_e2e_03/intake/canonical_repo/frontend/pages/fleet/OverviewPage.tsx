// OverviewPage — Main Fleet Dashboard (Session 30 — Full API + WebSocket)
import React, { useState } from 'react';
import { vehiclesApi } from '@/api/vehicles';
import { alertsApi } from '@/api/alerts';
import { tripsApi } from '@/api/trips';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useI18n, useDraggableCards, useMediaQuery } from '@/hooks';
import { useFleetPositions, useAlertStream, useSocketContext, useActivityFeed } from '@/socket';
import Loading from '@/components/ui/Loading';
import TableCard from '@/components/data/TableCard';
import PageHeader from '@/components/layout/PageHeader';
import LiveFleetMap from '@/components/map/LiveFleetMap';
import { ActivityFeed } from '@/components/realtime';
import ConnectionStatus from '@/components/realtime/ConnectionStatus';
import ChartCard from '@/components/charts/ChartCard';
import TrendCard from '@/components/charts/TrendCard';
import GaugeChart from '@/components/charts/GaugeChart';
import TimeRangeSelector from '@/components/charts/TimeRangeSelector';
import Badge from '@/components/ui/Badge';
import { fmtTime, fmt } from '@/utils';

export default function OverviewPage() {
  const { t } = useI18n();
  const [range, setRange] = useState('7d');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Real API calls via typed services
  const { data: statsData, loading } = useApiQuery(() => vehiclesApi.getStats(), [], { refetchInterval: 30000 });
  const { data: alertsData } = useApiQuery(() => alertsApi.list({ page: 1, limit: 5 }), [], { refetchInterval: 30000 });
  const { data: tripsData } = useApiQuery(() => tripsApi.getStats(), [], { refetchInterval: 60000 });
  const { data: activeTrips } = useApiQuery(() => tripsApi.getActive(), [], { refetchInterval: 15000 });

  const d = (statsData as any) || {};
  const recentAlerts = (alertsData as any)?.items || (Array.isArray(alertsData) ? alertsData : []);
  const tripStats = (tripsData as any) || {};
  const activeTripsArr = Array.isArray(activeTrips) ? activeTrips : (activeTrips as any)?.items || [];

  // WebSocket live data
  const { connected } = useSocketContext();
  const { positions: livePositions, count: liveCount, lastUpdate } = useFleetPositions();
  const { alerts: liveAlerts, count: liveAlertCount, latestAlert } = useAlertStream({ maxItems: 20 });

  // Draggable stat cards
  const WIDGET_DEFS = [
    { id:'total', label:'Total Vehicles', value: d?.total || 0, color:'cyan', trend: 2.3, trendLabel:'vs last month', sparkData:[24,25,26,27,28,29,30] },
    { id:'active', label:'Active Now', value: connected ? liveCount || d?.active || 0 : d?.active || 0, color:'green', trend: 4.1, trendLabel: connected ? `${liveCount} tracked live` : 'via API', sparkData:[20,22,21,24,23,25,25] },
    { id:'maint', label:'In Maintenance', value: d?.inMaintenance || 0, color:'amber', trend: -12, trendLabel:'↓ improving', sparkData:[8,7,7,6,6,5,5] },
    { id:'trips', label:'Active Trips', value: activeTripsArr.length || tripStats?.inProgress || 0, color:'blue', sparkData:[3,4,5,6,5,4,3] },
    { id:'alerts', label:'Live Alerts', value: connected ? liveAlertCount : recentAlerts.length, color: liveAlertCount > 5 ? 'red' : 'green', sparkData:[2,3,1,4,2,3,2] },
    { id:'safety', label:'Safety Score', value: tripStats?.avgScore || 94, color:'green', trend: 1.2, sparkData:[91,92,93,93,94,94,94] },
  ];
  const defaultOrder = WIDGET_DEFS.map(w => w.id);
  const drag = useDraggableCards(defaultOrder);
  const orderedWidgets = drag.order.map(id => WIDGET_DEFS.find(w => w.id === id)).filter(Boolean);

  // Chart data
  const fleetDistribution = {
    labels: ['Tankers', 'Buses', 'Taxis'],
    datasets: [{
      data: [d?.byType?.tankers || 10, d?.byType?.buses || 10, d?.byType?.taxis || 10],
      backgroundColor: ['rgba(245,158,11,0.75)', 'rgba(59,130,246,0.75)', 'rgba(34,197,94,0.75)'],
      borderColor: ['#f59e0b', '#3b82f6', '#22c55e'], borderWidth: 2, hoverOffset: 6,
    }],
  };

  const weeklyTrips = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [{
      label: 'Trips', data: [45,52,38,61,55,29,18],
      borderColor: '#06d6d6', backgroundColor: 'rgba(6,214,214,0.08)', fill: true,
      tension: 0.4, pointRadius: 4, pointBackgroundColor: '#06d6d6', pointBorderColor: '#0d1b3e', pointBorderWidth: 2,
    }],
  };

  const utilizationTrend = {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    datasets: [
      { label:'Tankers', data:[85,87,82,88,91,89,92,90,88,91,93,95], borderColor:'#f59e0b', backgroundColor:'rgba(245,158,11,0.06)', fill:true, tension:0.4, borderWidth:2 },
      { label:'Buses', data:[78,80,76,82,83,85,84,86,83,85,87,88], borderColor:'#3b82f6', backgroundColor:'rgba(59,130,246,0.06)', fill:true, tension:0.4, borderWidth:2 },
      { label:'Taxis', data:[72,75,78,80,82,85,88,90,87,89,91,92], borderColor:'#22c55e', backgroundColor:'rgba(34,197,94,0.06)', fill:true, tension:0.4, borderWidth:2 },
    ],
  };

  const alertSeverity = {
    labels: ['Critical','High','Medium','Low'],
    datasets: [{
      data: [3,8,15,24], backgroundColor: ['rgba(239,68,68,0.75)','rgba(245,158,11,0.75)','rgba(59,130,246,0.75)','rgba(34,197,94,0.75)'],
      borderWidth: 0, borderRadius: 6,
    }],
  };

  const fuelConsumption = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      { label:'Diesel (L)', data:[1850,1920,1780,2010,1950,980,620], backgroundColor:'rgba(245,158,11,0.6)', borderRadius:4, stack:'fuel' },
      { label:'Petrol (L)', data:[420,450,390,480,510,580,380], backgroundColor:'rgba(59,130,246,0.6)', borderRadius:4, stack:'fuel' },
    ],
  };

  if (loading) return <Loading />;

  return (
    <div>
      <PageHeader title="Fleet Overview" subtitle="Real-time operational dashboard — Dubai, UAE"
        right={
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <ConnectionStatus compact />
            <TimeRangeSelector value={range} onChange={setRange} />
            <button className="btn btn-ghost btn-sm" onClick={drag.resetOrder} title="Reset widget order">↺</button>
            {connected && <div className="live-indicator"><div className="live-pulse"/>{t('LIVE')}</div>}
          </div>
        }
      />

      {/* Active Trips Banner */}
      {activeTripsArr.length > 0 && (
        <div style={{ marginBottom: 12, padding: '8px 14px', background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: '#22d3ee', fontWeight: 600 }}>🚛 {activeTripsArr.length} Active Trips</span>
          {activeTripsArr.slice(0, 5).map((trip: any) => (
            <span key={trip.id || trip.tripId} style={{ fontSize: 11, padding: '2px 8px', background: 'var(--bg-tertiary, #1e293b)', borderRadius: 4, color: 'var(--text-muted)' }}>
              {trip.vehicleId || trip.vehicle?.licensePlate || '?'} → {trip.endAddress || trip.destination || '?'}
            </span>
          ))}
        </div>
      )}

      {/* KPI Trend Cards */}
      <div className="stats-grid">
        {orderedWidgets.map((w: any, idx) => (
          <div key={w.id} draggable onDragStart={() => drag.onDragStart(idx)} onDragOver={e => drag.onDragOver(idx, e)} onDragEnd={drag.onDragEnd}
            className={`${drag.dragIdx===idx?'dragging':''} ${drag.overIdx===idx?'drag-over':''}`} style={{position:'relative'}}>
            <span className="drag-handle">⠿</span>
            <TrendCard label={w.label} value={w.value} color={w.color} trend={w.trend} trendLabel={w.trendLabel} sparkData={w.sparkData} />
          </div>
        ))}
      </div>

      {/* Live Map — WebSocket positions */}
      <LiveFleetMap height={340} livePositions={livePositions} />
      {connected && (
        <div style={{ display: 'flex', gap: 16, padding: '6px 0', fontSize: 11, color: 'var(--text-muted)' }}>
          <span>📡 Tracking <b style={{ color: '#22d3ee' }}>{liveCount}</b> vehicles live</span>
          <span>🚨 <b style={{ color: liveAlertCount > 0 ? '#ef4444' : '#22c55e' }}>{liveAlertCount}</b> live alerts</span>
          {lastUpdate && <span>⏱️ Last update: {new Date(lastUpdate).toLocaleTimeString()}</span>}
        </div>
      )}
      <div style={{height:14}} />

      {/* Gauge Row */}
      <div className="chart-card" style={{ display:'flex', justifyContent:'space-around', alignItems:'center', padding:'20px 16px', flexWrap:'wrap', gap:16 }}>
        <GaugeChart value={94.2} label="Fleet Utilization" thresholds={{red:60,amber:75,green:85}} showTrend="up" />
        <GaugeChart value={97.8} label="Safety Score" thresholds={{red:80,amber:90,green:95}} showTrend="stable" />
        <GaugeChart value={88.5} label="On-Time Delivery" thresholds={{red:70,amber:80,green:85}} showTrend="up" />
        <GaugeChart value={91.2} label="Driver Compliance" thresholds={{red:75,amber:85,green:90}} showTrend="up" />
        <GaugeChart value={82.7} label="Fuel Efficiency" color="#3b82f6" showTrend="down" />
      </div>
      <div style={{height:14}} />

      {/* Charts Row 1 */}
      <div className={isMobile ? "" : "grid-2"}>
        <ChartCard title="Fleet Utilization Trend (12M)" type="line" data={utilizationTrend} height={220}
          options={{ plugins:{ legend:{ position:'bottom' as const } } }} />
        <ChartCard title="Weekly Fuel Consumption" type="bar" data={fuelConsumption} height={220}
          options={{ plugins:{ legend:{ position:'bottom' as const } }, scales:{ x:{ stacked:true }, y:{ stacked:true, title:{ display:true, text:'Liters', color:'#8892a8' } } } }} />
      </div>
      <div style={{height:14}} />

      {/* Charts Row 2 */}
      <div className={isMobile ? "" : "grid-3"}>
        <ChartCard title="Fleet Distribution" type="doughnut" data={fleetDistribution} height={200}
          options={{ plugins:{ legend:{ position:'bottom' as const } }, cutout:'65%' }} />
        <ChartCard title="Weekly Trip Volume" type="line" data={weeklyTrips} height={200} />
        <ChartCard title="Alert Severity" type="bar" data={alertSeverity} height={200}
          options={{ indexAxis:'y' as const, plugins:{ legend:{ display:false } } }} />
      </div>
      <div style={{height:14}} />

      {/* Recent Alerts + Activity Feed */}
      <div className={isMobile ? "" : "grid-2"}>
        <TableCard title={connected ? "🔴 Live Alerts" : "Recent Alerts"} count={connected ? liveAlertCount : recentAlerts.length}>
          {(connected && liveAlerts.length > 0 ? liveAlerts : recentAlerts).slice(0,8).map((a: any, i: number) => (
            <div key={a.id || i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderBottom:'1px solid var(--border)' }}>
              <span style={{ width:8, height:8, borderRadius:'50%', flexShrink:0,
                background: a.severity === 'critical' ? '#ef4444' : a.severity === 'high' ? '#f97316' : a.severity === 'medium' ? '#eab308' : '#3b82f6' }} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12, color:'#e2e8f0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {a.message || a.type || a.alertType}
                </div>
                <div style={{ fontSize:10, color:'#64748b' }}>{a.vehicleId} · {fmtTime(a.timestamp || a.createdAt)}</div>
              </div>
              <span style={{ fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:0.5,
                color: a.severity === 'critical' ? '#ef4444' : a.severity === 'high' ? '#f97316' : '#64748b' }}>
                {a.severity}
              </span>
            </div>
          ))}
        </TableCard>
        <TableCard title="⚡ Live Activity Feed" count="Real-time">
          <ActivityFeed compact maxItems={30} />
        </TableCard>
      </div>
    </div>
  );
}
