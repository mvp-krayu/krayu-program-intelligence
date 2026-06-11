import React, { useState, useEffect, useCallback } from 'react';
import { useAlertStream, type AlertPayload } from '@/socket';

interface Props {
  severity?: string;
  autoDismissMs?: number;
}

export default function LiveAlertBanner({ severity, autoDismissMs = 8000 }: Props) {
  const { latestAlert } = useAlertStream({ severity: severity || 'critical' });
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState<AlertPayload | null>(null);

  useEffect(() => {
    if (!latestAlert) return;
    setCurrent(latestAlert);
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), autoDismissMs);
    return () => clearTimeout(timer);
  }, [latestAlert, autoDismissMs]);

  const dismiss = useCallback(() => setVisible(false), []);

  if (!visible || !current) return null;

  const sevColors: Record<string, { bg: string; border: string; text: string }> = {
    critical: { bg: 'rgba(239,68,68,0.12)', border: '#ef4444', text: '#fca5a5' },
    high: { bg: 'rgba(249,115,22,0.12)', border: '#f97316', text: '#fdba74' },
    medium: { bg: 'rgba(234,179,8,0.12)', border: '#eab308', text: '#fde047' },
    low: { bg: 'rgba(59,130,246,0.08)', border: '#3b82f6', text: '#93c5fd' },
  };
  const c = sevColors[current.severity] || sevColors.medium;
  const icon = current.severity === 'critical' ? '🔴' : current.severity === 'high' ? '🟠' : '🟡';

  return (
    <div
      style={{
        position: 'fixed', top: 12, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, maxWidth: 640, width: '90%',
        background: c.bg, backdropFilter: 'blur(12px)',
        border: `1px solid ${c.border}44`, borderLeft: `4px solid ${c.border}`,
        borderRadius: 8, padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: `0 4px 24px ${c.border}22`,
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: c.text, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          {current.severity} Alert
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {current.message}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
          {current.vehicleId} · {new Date(current.timestamp).toLocaleTimeString()}
        </div>
      </div>
      <button
        onClick={dismiss}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', fontSize: 16, padding: 4, flexShrink: 0,
        }}
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
