/**
 * EvidencePanel.js
 * PIOS-42.4-RUN01-CONTRACT-v2
 *
 * Renders evidence chains for all bound signals.
 * All values sourced from adapter props — no synthetic data.
 * Missing evidence renders as warning, not substituted placeholder.
 */

function EvidenceEntry({ signal }) {
  const ev = signal.evidence

  return (
    <div className="evidence-entry">
      <div className="evidence-sig-header">
        [{signal.signal_id}] {signal.title}
      </div>

      {signal.evidence_warning ? (
        <div className="evidence-warning">⚠  {signal.evidence_warning}</div>
      ) : ev ? (
        <>
          <div className="evidence-source">
            <span>Source</span>
            {ev.source_object_id}  ({ev.source_layer}/{ev.source_file})
          </div>

          {ev.supporting_objects && ev.supporting_objects.length > 0 && (
            <div>
              {ev.supporting_objects.map((so, i) => (
                <div key={i} className="supporting-obj">
                  {so.object_id}  [{so.layer}/{so.file}]
                  {so.state && (
                    <span className="obj-state">  state: {so.state}</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {ev.evidence_chain && (
            <div className="evidence-chain-wrap">
              <div className="evidence-chain-label">Evidence chain</div>
              {ev.evidence_chain.split('→').map((seg, i) => (
                seg.trim()
                  ? <div key={i} className="chain-segment">{seg.trim()}</div>
                  : null
              ))}
            </div>
          )}

          {ev.blocking_point && (
            <div className="evidence-blocking">{ev.blocking_point}</div>
          )}

          {ev.temporal_reference && (
            <div className="evidence-temporal">{ev.temporal_reference}</div>
          )}
        </>
      ) : (
        <div className="evidence-warning">No evidence data available.</div>
      )}
    </div>
  )
}

export default function EvidencePanel({ signals }) {
  if (!signals || signals.length === 0) return null

  return (
    <div className="panel">
      <div className="panel-title">
        Evidence Chains  [{signals.length} signal{signals.length !== 1 ? 's' : ''}]
      </div>
      {signals.map(sig => (
        <EvidenceEntry key={sig.signal_id} signal={sig} />
      ))}
    </div>
  )
}
