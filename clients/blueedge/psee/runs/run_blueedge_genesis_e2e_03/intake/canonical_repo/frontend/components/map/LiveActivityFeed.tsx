// Extracted from dashboard.html — LiveActivityFeed
// Line 2098 | 55 lines

import React, { useState, useEffect } from 'react';
import { ACTIVITY_TEMPLATES } from '@/constants';

export default function LiveActivityFeed({ events }: any) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Seed initial activities
    const initial = [];
    for (let i = 0; i < 8; i++) {
      const tmpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
      const { title, detail } = tmpl.gen();
      initial.push({ id: `init-${i}`, icon: tmpl.icon, bg: tmpl.bg, title, detail, time: Date.now() - i * 45000, isNew: false });
    }
    setActivities(initial);
  }, []);

  // Add new activities from WS events
  useEffect(() => {
    if (events.length === 0) return;
    const tmpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
    const { title, detail } = tmpl.gen();
    setActivities(prev => [{ id: `ws-${Date.now()}`, icon: tmpl.icon, bg: tmpl.bg, title, detail, time: Date.now(), isNew: true }, ...prev].slice(0, 20));
  }, [events.length]);

  // Auto-generate activity every 8s
  useEffect(() => {
    const timer = setInterval(() => {
      const tmpl = ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];
      const { title, detail } = tmpl.gen();
      setActivities(prev => [{ id: `auto-${Date.now()}`, icon: tmpl.icon, bg: tmpl.bg, title, detail, time: Date.now(), isNew: true }, ...prev].slice(0, 20));
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const timeAgo = (ts: any) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 10) return 'just now';
    if (s < 60) return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s/60)}m ago`;
    return `${Math.floor(s/3600)}h ago`;
  };

  return (
    <div className="activity-feed">
      {activities.map(a => (
        <div key={a.id} className={`activity-item ${a.isNew ? 'activity-new' : ''}`}>
          <div className="activity-icon" style={{background:a.bg}}>{a.icon}</div>
          <div className="activity-body">
            <div className="ab-title">{a.title}</div>
            <div className="ab-detail">{a.detail}</div>
            <div className="ab-time">{timeAgo(a.time)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
