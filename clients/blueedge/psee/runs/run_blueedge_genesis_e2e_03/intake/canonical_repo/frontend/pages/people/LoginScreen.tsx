// ══════════════════════════════════════════════════════════════
// Blue Edge Fleet — Login Screen (Full, API-integrated)
// ══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const DEMO_ACCOUNTS = [
  { email: 'admin@blueedge.com', role: 'Admin', color: '#3b82f6' },
  { email: 'manager@blueedge.com', role: 'Manager', color: '#22c55e' },
  { email: 'dispatcher@blueedge.com', role: 'Dispatcher', color: '#f59e0b' },
  { email: 'driver@blueedge.com', role: 'Driver', color: '#8b5cf6' },
  { email: 'viewer@blueedge.com', role: 'Viewer', color: '#6b7280' },
];

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@blueedge.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Restore remembered email
  useEffect(() => {
    const saved = localStorage.getItem('be-remembered-email');
    if (saved) setEmail(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (rememberMe) localStorage.setItem('be-remembered-email', email);
      else localStorage.removeItem('be-remembered-email');
      const result = await login(email, password);
      if (!result.ok) setError(result.error || 'Invalid credentials');
    } catch (err: any) {
      setError(err.message || 'Connection failed — is the API server running?');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (acct: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acct.email);
    setPassword('demo123');
  };

  return (
    <div className="login-wrapper" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      {/* Background grid effect */}
      <div style={{ position: 'fixed', inset: 0, opacity: 0.04, backgroundImage: 'linear-gradient(rgba(59,130,246,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 440, margin: '0 16px' }}>
        {/* Logo & branding */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⬡</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>Blue Edge Fleet Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>Enterprise Fleet Intelligence Platform</p>
        </div>

        {/* Login card */}
        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-tertiary, #1e293b)', borderRadius: 16, border: '1px solid rgba(59,130,246,0.15)', padding: 32, boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
          {/* Error banner */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, color: '#fca5a5', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
              {error}
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus
                placeholder="admin@blueedge.com"
                style={{ width: '100%', padding: '11px 12px 11px 40px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="Password"
                style={{ width: '100%', padding: '11px 40px 11px 40px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: 14, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}>
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)' }}>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                style={{ accentColor: '#3b82f6', width: 16, height: 16 }} />
              Remember me
            </label>
            <button type="button" style={{ background: 'none', border: 'none', color: '#3b82f6', fontSize: 13, cursor: 'pointer' }}>
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || !email || !password}
            style={{ width: '100%', padding: '12px 0', background: loading ? '#1e40af' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer', opacity: (!email || !password) ? 0.5 : 1, transition: 'background 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxSizing: 'border-box' }}>
            {loading ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="32" strokeLinecap="round"/></svg>
                Signing in...
              </>
            ) : 'Sign In'}
          </button>

          {/* Server status hint */}
          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', marginTop: 16, marginBottom: 0 }}>
            API: <code style={{ color: 'var(--text-muted)' }}>localhost:3001</code> · Password: <code style={{ color: 'var(--text-muted)' }}>demo123</code>
          </p>
        </form>

        {/* Quick login buttons */}
        <div style={{ marginTop: 20, background: 'var(--bg-tertiary, #1e293b)', borderRadius: 12, border: '1px solid rgba(59,130,246,0.1)', padding: '16px 20px' }}>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 10px', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>Demo Accounts</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {DEMO_ACCOUNTS.map(acct => (
              <button key={acct.email} type="button" onClick={() => quickLogin(acct)}
                style={{ padding: '6px 12px', background: email === acct.email ? `${acct.color}20` : 'transparent', border: `1px solid ${email === acct.email ? acct.color : 'var(--border)'}`, borderRadius: 6, color: email === acct.email ? acct.color : '#94a3b8', fontSize: 12, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s' }}>
                {acct.role}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-secondary)', marginTop: 20 }}>
          Blue Edge Network LLC/SA · Dubai · Switzerland · East Africa
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-wrapper input::placeholder { color: #475569; }
      `}</style>

      {/* Status Overview */}
      <div className="grid grid-3" style={{ marginTop: 16 }}>
        {[
          { title: 'Operational Health', items: [['System Uptime', '99.97%'], ['API Latency', '42ms'], ['Error Rate', '0.03%'], ['Connections', '1,284']] },
          { title: 'Fleet Status', items: [['Active Vehicles', '198'], ['In Transit', '87'], ['At Depot', '96'], ['Maintenance', '15']] },
          { title: 'Today Highlights', items: [['Trips Completed', '342'], ['Revenue', '28,450 AED'], ['Fuel Consumed', '4,280L'], ['Distance', '12,450 km']] },
        ].map((card, ci) => (
          <div key={ci} className="card" style={{ padding: 16 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: '#22d3ee', marginBottom: 10 }}>{card.title}</h4>
            {card.items.map(([lbl, val], ii) => (
              <div key={ii} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: ii < 3 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>{lbl}</span>
                <span style={{ fontWeight: 600 }}>{val}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Recent Activity */}
      <div className="card" style={{ padding: 18, marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#22d3ee' }}>🕐 Recent Activity</h3>
        {[
          { time: '2 min ago', action: 'System health check completed', user: 'System', sev: 'info' },
          { time: '15 min ago', action: 'Record created by dispatcher', user: 'Fatima Al Zaabi', sev: 'success' },
          { time: '42 min ago', action: 'Alert acknowledged and resolved', user: 'Khalid Al Maktoum', sev: 'warning' },
          { time: '1 hour ago', action: 'Scheduled maintenance triggered', user: 'System', sev: 'info' },
          { time: '2 hours ago', action: 'Configuration updated', user: 'Borhane Admin', sev: 'success' },
          { time: '3 hours ago', action: 'Driver score recalculated', user: 'AI Agent', sev: 'info' },
          { time: '5 hours ago', action: 'Compliance report generated', user: 'System', sev: 'success' },
          { time: '8 hours ago', action: 'Night shift handover', user: 'Ahmed Al Mansouri', sev: 'info' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 7 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.sev === 'warning' ? '#f59e0b' : a.sev === 'success' ? '#10b981' : '#64748b' }} />
              <span style={{ fontSize: 13 }}>{a.action}</span>
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
              <span>{a.user}</span>
              <span>{a.time}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
