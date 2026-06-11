import React from 'react';
import { useSocketContext } from '@/socket';

interface Props {
  compact?: boolean;
  className?: string;
}

export default function ConnectionStatus({ compact, className }: Props) {
  const { connected, reconnecting, clientId } = useSocketContext();

  const color = connected ? '#22c55e' : reconnecting ? '#f59e0b' : '#ef4444';
  const label = connected ? 'Live' : reconnecting ? 'Reconnecting…' : 'Offline';
  const pulse = connected || reconnecting;

  if (compact) {
    return (
      <span
        className={className}
        title={connected ? `Connected: ${clientId}` : label}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: '50%', background: color,
          boxShadow: pulse ? `0 0 6px ${color}` : 'none',
          animation: pulse ? 'pulse-dot 2s ease-in-out infinite' : 'none',
        }} />
        <span style={{ fontSize: 11, color, fontWeight: 600, letterSpacing: 0.3 }}>{label}</span>
      </span>
    );
  }

  return (
    <div
      className={className}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 12px', borderRadius: 6,
        background: connected ? 'rgba(34,197,94,0.08)' : reconnecting ? 'rgba(245,158,11,0.08)' : 'rgba(239,68,68,0.08)',
        border: `1px solid ${color}22`,
      }}
    >
      <span style={{
        width: 10, height: 10, borderRadius: '50%', background: color,
        boxShadow: pulse ? `0 0 8px ${color}` : 'none',
        animation: pulse ? 'pulse-dot 2s ease-in-out infinite' : 'none',
      }} />
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color }}>{label}</div>
        {connected && clientId && (
          <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ID: {clientId.slice(0, 8)}</div>
        )}
      </div>
    </div>
  );
}
