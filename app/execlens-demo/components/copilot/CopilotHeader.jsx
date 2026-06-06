const LEVEL_LABELS = {
  0: 'L0 — Doctrine',
  1: 'L1 — Specimen',
  2: 'L2 — Verdict',
  3: 'L3 — Publishing',
}

export default function CopilotHeader({ contextLevel, client, runId }) {
  const levelLabel = LEVEL_LABELS[contextLevel] || LEVEL_LABELS[0]
  const hasBinding = client && runId

  return (
    <header className="copilot-header">
      <div className="copilot-header-left">
        <span className="copilot-wordmark">PI Co-Pilot</span>
        <span className="copilot-level-badge" data-level={contextLevel}>
          {levelLabel}
        </span>
      </div>
      <div className="copilot-header-right">
        {hasBinding && (
          <>
            <span className="copilot-binding">
              {client} / {runId.replace(/^run_/, '').replace(/_/g, ' ')}
            </span>
            <a
              className="copilot-lens-link"
              href={`/lens/${client}/${runId}`}
            >
              LENS &rarr;
            </a>
          </>
        )}
      </div>
    </header>
  )
}
