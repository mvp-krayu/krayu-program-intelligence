import { SESSION_WARNING_MS } from '@/constants';
// Extracted from dashboard.html — SessionTimeoutWarning
// Line 5887 | 21 lines

export default function SessionTimeoutWarning({ countdown, onStay, onLogout }: any) {
  const totalSec = Math.ceil(SESSION_WARNING_MS / 1000);
  const pct = Math.max(0, (countdown / totalSec) * 100);
  const min = Math.floor(countdown / 60);
  const sec = countdown % 60;

  return (
    <div className="timeout-overlay">
      <div className="timeout-card">
        <h3>⏱ Session Expiring</h3>
        <p>You've been inactive. Your session will end soon for security.</p>
        <div className="timeout-countdown">{min}:{sec.toString().padStart(2,'0')}</div>
        <div className="timeout-bar"><div className="timeout-bar-inner" style={{width:`${pct}%`}} /></div>
        <div style={{display:'flex',gap:10,justifyContent:'center'}}>
          <button className="btn btn-ghost" onClick={onLogout}>Sign Out</button>
          <button className="btn btn-cyan" onClick={onStay}>I'm Still Here</button>
        </div>
      </div>
    </div>
  );
}
