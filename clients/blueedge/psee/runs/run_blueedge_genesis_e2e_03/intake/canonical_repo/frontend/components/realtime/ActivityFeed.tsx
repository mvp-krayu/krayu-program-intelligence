import React, { useState, useRef, useEffect } from 'react';
import { useActivityFeed, type ActivityItem } from '@/socket';

interface Props {
  maxItems?: number;
  filterType?: string;
  className?: string;
  compact?: boolean;
  title?: string;
}

const TYPE_ICONS: Record<string, string> = {
  alert: '🚨', trip: '🛣️', safety: '🛡️', geofence: '📍', position: '📡',
  telemetry: '📊', status: '🔄', device: '📱', coldchain: '❄️', diagnostics: '🔧',
};

const SEV_COLORS: Record<string, string> = {
  critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#3b82f6',
};

export default function ActivityFeed({ maxItems = 50, filterType, className, compact, title }: Props) {
  const items = useActivityFeed(maxItems);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filter, setFilter] = useState(filterType || '');
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = filter ? items.filter(i => i.type === filter) : items;

  // Auto-scroll to top when new items arrive
  useEffect(() => {
    if (autoScroll && listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [items.length, autoScroll]);

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch { return ''; }
  };

  return (
    <div className={className} style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 8,
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      ...(compact ? { maxHeight: 300 } : { height: '100%', minHeight: 300 }),
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px', borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            {title || '⚡ Live Activity'}
          </span>
          <span style={{
            fontSize: 10, padding: '2px 6px', borderRadius: 10,
            background: '#22d3ee22', color: '#22d3ee', fontWeight: 600,
          }}>
            {filtered.length}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {!compact && (
            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
              style={{
                background: 'var(--bg-tertiary, #1e293b)', border: '1px solid var(--border)', borderRadius: 4,
                color: 'var(--text-muted)', fontSize: 11, padding: '2px 6px',
              }}
            >
              <option value="">All</option>
              <option value="alert">Alerts</option>
              <option value="trip">Trips</option>
              <option value="safety">Safety</option>
              <option value="geofence">Geofence</option>
              <option value="status">Status</option>
              <option value="diagnostics">Diagnostics</option>
              <option value="device">Devices</option>
            </select>
          )}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            style={{
              background: autoScroll ? '#22d3ee22' : '#1e293b',
              border: `1px solid ${autoScroll ? '#22d3ee' : '#334155'}`,
              borderRadius: 4, padding: '2px 8px', cursor: 'pointer',
              color: autoScroll ? '#22d3ee' : '#64748b', fontSize: 11,
            }}
            title={autoScroll ? 'Auto-scroll ON' : 'Auto-scroll OFF'}
          >
            {autoScroll ? '⏬' : '⏸'}
          </button>
        </div>
      </div>

      {/* Feed items */}
      <div ref={listRef} style={{ flex: 1, overflow: 'auto', padding: 4 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
            Waiting for live events…
          </div>
        ) : (
          filtered.map((item) => (
            <ActivityRow key={item.id} item={item} compact={compact} />
          ))
        )}
      </div>
    </div>
  );
}

function ActivityRow({ item, compact }: { item: ActivityItem; compact?: boolean }) {
  const sevColor = item.severity ? SEV_COLORS[item.severity] || '#64748b' : undefined;
  const icon = TYPE_ICONS[item.type] || '📌';

  const formatTime = (ts: string) => {
    try {
      return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch { return ''; }
  };

  return (
    <div
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 8,
        padding: compact ? '5px 8px' : '8px 10px',
        borderBottom: '1px solid #1e293b11',
        borderLeft: sevColor ? `3px solid ${sevColor}` : '3px solid transparent',
        background: item.severity === 'critical' ? 'rgba(239,68,68,0.04)' : 'transparent',
        transition: 'background 0.2s',
      }}
    >
      <span style={{ fontSize: compact ? 12 : 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: compact ? 11 : 12, color: 'var(--text-primary)', lineHeight: 1.4,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.summary}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
          {item.vehicleId && (
            <span style={{ fontSize: 10, color: '#22d3ee', fontFamily: 'monospace' }}>
              {item.vehicleId}
            </span>
          )}
          <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>
            {formatTime(item.timestamp)}
          </span>
          {item.severity && (
            <span style={{
              fontSize: 9, textTransform: 'uppercase', fontWeight: 700,
              color: sevColor, letterSpacing: 0.5,
            }}>
              {item.severity}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
