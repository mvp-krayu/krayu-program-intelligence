// Extracted from dashboard.html — NotificationCenter
// Line 5051 | 72 lines

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/hooks';

export default function NotificationCenter({ events, wsConnected }: any) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState(new Set());

  // Generate notifications from WS events + built-in system notifications
  useEffect(() => {
    const sysNotifs = [
      { id: 'sys-1', type: 'system', severity: 'info', title: 'System Online', message: 'Blue Edge Fleet API v2.17.0 connected', timestamp: Date.now() - 60000, source: 'system' },
      { id: 'sys-2', type: 'maintenance', severity: 'medium', title: 'Scheduled Maintenance', message: 'Server maintenance window: Fri 02:00-04:00 GST', timestamp: Date.now() - 3600000, source: 'system' },
      { id: 'sys-3', type: 'compliance', severity: 'high', title: 'Permits Expiring', message: '3 HAZMAT permits expire within 30 days — review required', timestamp: Date.now() - 7200000, source: 'compliance' },
      { id: 'sys-4', type: 'safety', severity: 'critical', title: 'Speed Violation', message: 'Vehicle DXB-7291 exceeded 120 km/h on Sheikh Zayed Road', timestamp: Date.now() - 1800000, source: 'safety' },
      { id: 'sys-5', type: 'fuel', severity: 'medium', title: 'Fuel Anomaly Detected', message: 'Vehicle DXB-4518 showing unusual fuel consumption pattern', timestamp: Date.now() - 5400000, source: 'analytics' },
      { id: 'sys-6', type: 'device', severity: 'low', title: 'Device Offline', message: 'IoT gateway SVG-GW-00012 lost connection 15 min ago', timestamp: Date.now() - 900000, source: 'devices' },
    ];
    const wsNotifs = events.slice(0, 10).map((e, i) => ({
      id: `ws-${e._ts || i}`, type: e.type || 'event', severity: e.severity || 'info',
      title: e.type || 'Fleet Event', message: e.message || 'New telemetry event received',
      timestamp: e._ts || Date.now(), source: 'websocket'
    }));
    setNotifications([...wsNotifs, ...sysNotifs].sort((a, b) => b.timestamp - a.timestamp));
  }, [events.length]);

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  const markAllRead = () => { setReadIds(new Set(notifications.map(n => n.id))); };
  const markRead = (id: any) => { setReadIds(prev => new Set([...prev, id])); };

  const timeAgo = (ts: any) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      <button className="notif-bell" onClick={() => setOpen(!open)} title="Notifications">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        {unreadCount > 0 && <span className="bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
      </button>
      {open && <div className="notif-overlay" onClick={() => setOpen(false)} />}
      {open && (
        <div className="notif-panel">
          <div className="notif-panel-header">
            <h3>{t('Notifications')}</h3>
            <div className="notif-panel-actions">
              {unreadCount > 0 && <button className="btn btn-ghost btn-sm" onClick={markAllRead}>{t('Mark all read')}</button>}
              <button className="modal-close" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>
          <div className="notif-panel-body">
            {notifications.length === 0 ? (
              <div className="notif-empty">🔔 No notifications yet</div>
            ) : notifications.map(n => (
              <div key={n.id} className={`notif-item ${readIds.has(n.id) ? '' : 'unread'}`} onClick={() => markRead(n.id)}>
                <div className={`notif-dot ${n.severity}`} />
                <div className="notif-content">
                  <div className="notif-title">{n.title}</div>
                  <div className="notif-msg">{n.message}</div>
                  <div className="notif-time">{timeAgo(n.timestamp)} • {n.source}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
