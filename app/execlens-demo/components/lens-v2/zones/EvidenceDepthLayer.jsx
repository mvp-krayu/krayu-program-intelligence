import { PRESSURE_META, ROLE_META } from './constants'

function EvidenceBlock({ block }) {
  const firstCard = block.signal_cards && block.signal_cards[0]
  const pm = firstCard ? (PRESSURE_META[firstCard.pressure_tier] || PRESSURE_META.MODERATE) : null
  const rm = ROLE_META[block.propagation_role] || null
  const isPartial = block.grounding_status && block.grounding_status !== 'Q-00'
  return (
    <div className={`evidence-block${isPartial ? ' evidence-block--partial' : ''}`}>
      <div className="eb-header">
        <div className="eb-domain">{block.domain_alias}</div>
        <div className="eb-tags">
          {rm && <span className="eb-tag" style={{ color: rm.color }}>{rm.symbol} {rm.label}</span>}
          {pm && <span className="eb-tag" style={{ color: pm.color }}>{pm.symbol} {pm.label}</span>}
          {isPartial && <span className="eb-tag eb-tag--partial">PARTIAL</span>}
        </div>
      </div>
      {block.evidence_description && (
        <div className="eb-description">{block.evidence_description}</div>
      )}
      {firstCard && firstCard.evidence_text && (
        <div className="eb-signal">{firstCard.evidence_text}</div>
      )}
    </div>
  )
}

function SignalInterpretationSection({ interpretations }) {
  if (!interpretations || !interpretations.length) return null
  return (
    <div className="signal-interp-section">
      <div className="signal-interp-label">SIGNAL INTERPRETATION</div>
      {interpretations.map(sig => (
        <div key={sig.signal_id} className="signal-interp-block" data-severity={sig.severity}>
          <div className="signal-interp-header">
            <span className="signal-interp-name">{sig.signal_name}</span>
            <span className="signal-interp-value">{sig.signal_value != null ? sig.signal_value.toFixed(4) : '—'}</span>
            <span className="signal-interp-severity" data-severity={sig.severity}>{sig.severity}</span>
          </div>
          {sig.interpretation && (
            <div className="signal-interp-prose">{sig.interpretation}</div>
          )}
          {sig.concentration && (
            <div className="signal-interp-concentration">{sig.concentration}</div>
          )}
          {sig.confidence_note && (
            <div className="signal-interp-confidence">{sig.confidence_note}</div>
          )}
        </div>
      ))}
      {interpretations.length > 0 && interpretations[0].co_presence && (
        <div className="signal-interp-copresence">{interpretations[0].co_presence}</div>
      )}
      {interpretations.length > 0 && interpretations[0].compound_narrative && (
        <div className="signal-interp-compound">{interpretations[0].compound_narrative}</div>
      )}
    </div>
  )
}

export default function EvidenceDepthLayer({ evidenceBlocks, densityClass, signalInterpretations }) {
  if (!evidenceBlocks || !evidenceBlocks.length) return null
  const showAll = densityClass !== 'EXECUTIVE_BALANCED'
  const visible = showAll ? evidenceBlocks : evidenceBlocks.slice(0, 2)
  return (
    <div className="evidence-layer">
      <div className="zone-label">SIGNAL EVIDENCE</div>
      <div className="evidence-grid">
        {visible.map((b, i) => <EvidenceBlock key={b.domain_alias || i} block={b} />)}
      </div>
      {!showAll && evidenceBlocks.length > 2 && (
        <div className="evidence-more">
          +{evidenceBlocks.length - 2} additional domains visible in Dense and Investigation views
        </div>
      )}
      <SignalInterpretationSection interpretations={signalInterpretations} />
    </div>
  )
}
