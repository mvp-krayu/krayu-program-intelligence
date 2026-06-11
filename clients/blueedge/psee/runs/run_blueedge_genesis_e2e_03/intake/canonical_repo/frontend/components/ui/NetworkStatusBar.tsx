// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Network Status Bar
// Shows offline/online state, queued mutations, rate limit warnings
// Sits at top of viewport, auto-dismisses when resolved
// ══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useCallback } from 'react';
import { getOfflineQueueSize, flushOfflineQueue, setOnRateLimit } from '@/api/client';

type StatusType = 'online' | 'offline' | 'syncing' | 'rate-limited' | 'hidden';

interface NetworkStatusState {
  type: StatusType;
  message: string;
  queueSize: number;
  retryAfterMs: number;
}

export default function NetworkStatusBar() {
  const [state, setState] = useState<NetworkStatusState>({
    type: 'hidden',
    message: '',
    queueSize: 0,
    retryAfterMs: 0,
  });

  // ── Online/Offline detection ──────────────────────────────
  useEffect(() => {
    const goOffline = () => {
      const queueSize = getOfflineQueueSize();
      setState({
        type: 'offline',
        message: `You're offline${queueSize > 0 ? ` — ${queueSize} action${queueSize > 1 ? 's' : ''} queued` : ''}`,
        queueSize,
        retryAfterMs: 0,
      });
    };

    const goOnline = async () => {
      const queueSize = getOfflineQueueSize();
      if (queueSize > 0) {
        setState({ type: 'syncing', message: `Back online — syncing ${queueSize} queued action${queueSize > 1 ? 's' : ''}...`, queueSize, retryAfterMs: 0 });
        const result = await flushOfflineQueue();
        setState({
          type: result.failed > 0 ? 'offline' : 'online',
          message: result.failed > 0
            ? `Synced ${result.success}, ${result.failed} failed`
            : `All ${result.success} action${result.success > 1 ? 's' : ''} synced ✓`,
          queueSize: getOfflineQueueSize(),
          retryAfterMs: 0,
        });
        // Auto-hide success after 3s
        if (result.failed === 0) {
          setTimeout(() => setState(s => s.type === 'online' ? { ...s, type: 'hidden' } : s), 3000);
        }
      } else {
        setState({ type: 'online', message: 'Back online ✓', queueSize: 0, retryAfterMs: 0 });
        setTimeout(() => setState(s => s.type === 'online' ? { ...s, type: 'hidden' } : s), 2000);
      }
    };

    if (!navigator.onLine) goOffline();

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // ── Rate limit callback ───────────────────────────────────
  useEffect(() => {
    setOnRateLimit((retryAfterMs) => {
      setState({
        type: 'rate-limited',
        message: `Rate limited — retrying in ${Math.ceil(retryAfterMs / 1000)}s`,
        queueSize: getOfflineQueueSize(),
        retryAfterMs,
      });
      setTimeout(() => setState(s => s.type === 'rate-limited' ? { ...s, type: 'hidden' } : s), retryAfterMs + 1000);
    });
  }, []);

  // ── Manual sync ───────────────────────────────────────────
  const handleSync = useCallback(async () => {
    if (!navigator.onLine) return;
    setState(s => ({ ...s, type: 'syncing', message: 'Syncing...' }));
    const result = await flushOfflineQueue();
    setState({
      type: result.failed > 0 ? 'offline' : 'online',
      message: `Synced ${result.success}${result.failed > 0 ? `, ${result.failed} failed` : ' ✓'}`,
      queueSize: getOfflineQueueSize(),
      retryAfterMs: 0,
    });
  }, []);

  if (state.type === 'hidden') return null;

  const colors: Record<StatusType, { bg: string; text: string; border: string }> = {
    online: { bg: 'rgba(34,197,94,0.15)', text: '#22c55e', border: '#22c55e44' },
    offline: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', border: '#ef444444' },
    syncing: { bg: 'rgba(6,182,212,0.15)', text: '#06b6d4', border: '#06b6d444' },
    'rate-limited': { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', border: '#f59e0b44' },
    hidden: { bg: 'transparent', text: 'transparent', border: 'transparent' },
  };

  const c = colors[state.type];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      background: c.bg, borderBottom: `1px solid ${c.border}`,
      padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      fontSize: '0.8rem', color: c.text, backdropFilter: 'blur(8px)',
      animation: 'slideDown 0.3s ease',
    }}>
      {state.type === 'offline' && <span>⚡</span>}
      {state.type === 'syncing' && <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span>}
      {state.type === 'rate-limited' && <span>⏳</span>}
      {state.type === 'online' && <span>✓</span>}

      <span>{state.message}</span>

      {state.type === 'offline' && state.queueSize > 0 && navigator.onLine && (
        <button onClick={handleSync} style={{
          padding: '3px 10px', border: `1px solid ${c.border}`, borderRadius: 4,
          background: 'transparent', color: c.text, cursor: 'pointer', fontSize: '0.75rem',
        }}>
          Retry Now
        </button>
      )}

      <style>{`
        @keyframes slideDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
