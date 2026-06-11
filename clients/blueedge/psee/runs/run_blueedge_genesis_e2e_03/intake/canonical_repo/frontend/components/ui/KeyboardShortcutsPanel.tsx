// Extracted from dashboard.html — KeyboardShortcutsPanel
// Line 5754 | 25 lines

import { useI18n } from '@/hooks';
import { SHORTCUTS } from '@/constants';

export default function KeyboardShortcutsPanel({ open, onClose }: any) {
  const { t } = useI18n();
  if (!open) return null;
  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-card" onClick={e => e.stopPropagation()}>
        <h3>
          <span>⌨️ {t('Keyboard Shortcuts')}</span>
          <button className="modal-close" onClick={onClose}>✕</button>
        </h3>
        {SHORTCUTS.map((s, i) => (
          <div key={i} className="shortcut-row">
            <span className="shortcut-desc">{s.label}</span>
            <div className="shortcut-keys">
              {s.keys.map((k, j) => <span key={j} className="kbd">{k}</span>)}
            </div>
          </div>
        ))}
        <div style={{marginTop:14,fontSize:'.68rem',color:'var(--text-muted)',textAlign:'center'}}>
          Press <span className="kbd">?</span> anytime to toggle this panel
        </div>
      </div>
    </div>
  );
}
