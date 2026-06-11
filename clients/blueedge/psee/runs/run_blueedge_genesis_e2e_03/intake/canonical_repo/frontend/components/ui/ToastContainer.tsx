// Extracted from dashboard.html — ToastContainer
// Line 4749 | 16 lines

import React, { useState, useEffect } from 'react';

export default function ToastContainer({ events }: any) {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    if (events.length > 0) {
      const latest = events[0];
      const toast = { id: Date.now(), type: latest.severity === 'critical' ? 'error' : latest.severity === 'high' ? 'warn' : 'info', msg: latest.message || latest.type || 'New event' };
      setToasts(prev => [...prev, toast].slice(-3));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 5000);
    }
  }, [events.length]);
  return (
    <div className="toast-container">
      {toasts.map(t => <div key={t.id} className={`toast ${t.type}`}><span>{t.type==='error'?'🔴':t.type==='warn'?'🟡':'🔵'}</span><span>{t.msg}</span></div>)}
    </div>
  );
}
