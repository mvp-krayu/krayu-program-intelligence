export default function GovernanceRibbon({ governance }) {
  const entries = Object.entries(governance)
  const allPass = entries.every(([, v]) => v === true)
  return (
    <div className={`gov-ribbon${allPass ? '' : ' gov-ribbon--fail'}`}>
      <span className="gov-label">GOVERNANCE</span>
      <div className="gov-items">
        {entries.map(([key, val]) => (
          <span key={key} className={`gov-item${val ? ' gov-pass' : ' gov-fail'}`}>
            <span className="gov-dot">{val ? '✓' : '✗'}</span>
            <span className="gov-key">{key.replace(/_/g, ' ')}</span>
          </span>
        ))}
      </div>
      <a href="/" className="gov-back" title="Return to executive overview">← Overview</a>
    </div>
  )
}
