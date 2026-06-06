export default function ContextPanel({ vitals, persona, sessionStats, contextLevel }) {
  return (
    <aside className="copilot-context-panel">
      <div className="copilot-context-section">
        <h3 className="copilot-context-heading">Evidence Vitals</h3>
        {vitals ? (
          <div className="copilot-vitals-grid">
            {vitals.posture && (
              <div className="copilot-vitals-posture">
                <span className="copilot-vitals-label">Posture</span>
                <span className="copilot-vitals-value copilot-vitals-value--posture">{vitals.posture}</span>
              </div>
            )}
            {vitals.confidence && (
              <div className="copilot-vitals-stat">
                <span className="copilot-vitals-label">Confidence</span>
                <span className="copilot-vitals-value">{vitals.confidence}</span>
              </div>
            )}
            {vitals.domains && (
              <div className="copilot-vitals-stat">
                <span className="copilot-vitals-label">Domains</span>
                <span className="copilot-vitals-value">
                  {vitals.domains.structural}/{vitals.domains.total}
                  <span className="copilot-vitals-unit">structural</span>
                </span>
              </div>
            )}
            {vitals.files != null && (
              <div className="copilot-vitals-stat">
                <span className="copilot-vitals-label">Files</span>
                <span className="copilot-vitals-value">{vitals.files}</span>
              </div>
            )}
            {vitals.edges != null && (
              <div className="copilot-vitals-stat">
                <span className="copilot-vitals-label">Edges</span>
                <span className="copilot-vitals-value">{vitals.edges}</span>
              </div>
            )}
            {vitals.pressureZones != null && (
              <div className="copilot-vitals-stat">
                <span className="copilot-vitals-label">Pressure zones</span>
                <span className="copilot-vitals-value">{vitals.pressureZones}</span>
              </div>
            )}
            {vitals.classes != null && (
              <div className="copilot-vitals-stat">
                <span className="copilot-vitals-label">Classes</span>
                <span className="copilot-vitals-value">{vitals.classes}</span>
              </div>
            )}
            {vitals.functions != null && (
              <div className="copilot-vitals-stat">
                <span className="copilot-vitals-label">Functions</span>
                <span className="copilot-vitals-value">{vitals.functions}</span>
              </div>
            )}
            {vitals.clusters && vitals.clusters.length > 0 && (
              <div className="copilot-vitals-clusters">
                <span className="copilot-vitals-label">Clusters</span>
                {vitals.clusters.map(c => (
                  <div key={c.label} className="copilot-vitals-cluster-row">
                    <span className="copilot-vitals-cluster-label">{c.label}</span>
                    <span className="copilot-vitals-cluster-ratio">{c.structural}/{c.total}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="copilot-context-empty">No specimen loaded</p>
        )}
      </div>

      <div className="copilot-context-section">
        <h3 className="copilot-context-heading">Active Projection</h3>
        {persona ? (
          <div className="copilot-projection-contract">
            <div className="copilot-projection-name">{persona.name}</div>
            {persona.decisionHorizon && (
              <div className="copilot-projection-row">
                <span className="copilot-projection-label">Horizon</span>
                <span className="copilot-projection-value">{persona.decisionHorizon}</span>
              </div>
            )}
            {persona.altitude && (
              <div className="copilot-projection-row">
                <span className="copilot-projection-label">Altitude</span>
                <span className="copilot-projection-value">{persona.altitude}</span>
              </div>
            )}
            {persona.accessTier && (
              <div className="copilot-projection-row">
                <span className="copilot-projection-label">Access</span>
                <span className={`copilot-projection-tier copilot-projection-tier--${persona.accessTier}`}>
                  {persona.accessTier.toUpperCase()}
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="copilot-context-empty">Select a persona</p>
        )}
      </div>

      <div className="copilot-context-section">
        <h3 className="copilot-context-heading">Session</h3>
        <div className="copilot-session-stats">
          <div className="copilot-session-row">
            <span className="copilot-session-label">Queries</span>
            <span className="copilot-session-value">{sessionStats?.queries || 0}</span>
          </div>
          <div className="copilot-session-row">
            <span className="copilot-session-label">Tokens in</span>
            <span className="copilot-session-value">{formatTokens(sessionStats?.tokensIn || 0)}</span>
          </div>
          <div className="copilot-session-row">
            <span className="copilot-session-label">Tokens out</span>
            <span className="copilot-session-value">{formatTokens(sessionStats?.tokensOut || 0)}</span>
          </div>
          <div className="copilot-session-row">
            <span className="copilot-session-label">Context</span>
            <span className="copilot-session-value">L{contextLevel ?? 0}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function formatTokens(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}
