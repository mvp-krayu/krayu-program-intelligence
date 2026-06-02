export default function ContextPanel({ contextLevel, availableDomains, availableModes }) {
  return (
    <aside className="copilot-context-panel">
      <div className="copilot-context-section">
        <h3 className="copilot-context-heading">Knowledge</h3>
        <ul className="copilot-domain-list">
          {(availableDomains || []).map(d => (
            <li key={d} className="copilot-domain-item">{d}</li>
          ))}
          {(!availableDomains || availableDomains.length === 0) && (
            <li className="copilot-domain-item copilot-domain-empty">Doctrine only</li>
          )}
        </ul>
      </div>
      <div className="copilot-context-section">
        <h3 className="copilot-context-heading">Modes</h3>
        <div className="copilot-mode-list">
          {(availableModes || []).map(m => (
            <span key={m.id} className="copilot-mode-chip">{m.label}</span>
          ))}
        </div>
      </div>
      <div className="copilot-context-section">
        <h3 className="copilot-context-heading">Governance</h3>
        <p className="copilot-context-note">13 absolute prohibitions active</p>
        <p className="copilot-context-note">Evidence-traceable output</p>
        <p className="copilot-context-note">Disclosure-wrapped responses</p>
      </div>
    </aside>
  )
}
