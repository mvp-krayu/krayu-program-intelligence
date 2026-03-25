/**
 * ENLPanel.js
 * PIOS-51.5-RUN01-CONTRACT-v1
 * (supersedes PIOS-51.4-RUN01-CONTRACT-v1)
 *
 * Persona-shaped evidence traversal panel.
 * Materializes ENL as governed, persona-ordered evidence navigation.
 *
 * Rules:
 *   R1  traversal order is deterministic by persona — static rules, no computation
 *   R2  evidence data sourced from signals prop (42.4 adapter) — unchanged
 *   R3  traversal ordering sourced from personaData.enl_signals (42.16) — unchanged
 *   R4  no new API calls, no new computation
 *   R5  same evidence set, different documented path through it
 *   R6  no duplication — evidence owned here, signals owned by SignalPanel
 *
 * Sequence authority: docs/pios/51.5/enl_traversal_definition.md
 */

import NavigationPanel from './NavigationPanel'

// ---------------------------------------------------------------------------
// PIOS-51.5: Static traversal rules — deterministic by persona [R1]
// No computation. Path labels and sort keys only.
// ---------------------------------------------------------------------------

const ENL_TRAVERSAL = {
  EXECUTIVE: {
    label:     'Impact-First Traversal',
    path_desc: 'High-emphasis signals first, then evaluable — program delivery impact lens',
  },
  CTO: {
    label:     'Evidence-Grounded Traversal',
    path_desc: 'Evaluable signals first, then computed — structural risk evidence lens',
  },
  ANALYST: {
    label:     'Gap-First Traversal',
    path_desc: 'Blocked signals first, then partial — evidence gap identification lens',
  },
}

const SIGNAL_STATE_BADGE = {
  computed:  { label: 'Computed',  color: 'var(--strong)' },
  evaluable: { label: 'Evaluable', color: 'var(--moderate)' },
  partial:   { label: 'Partial',   color: 'var(--moderate)' },
  blocked:   { label: 'Blocked',   color: 'var(--weak)' },
  unknown:   { label: 'Unknown',   color: 'var(--text-dim)' },
}

// ---------------------------------------------------------------------------
// Traversal ordering — uses ENL signal order from 42.16 adapter [R3]
// array reorder only — no data transformation
// ---------------------------------------------------------------------------

function applyTraversalOrder(signals, personaData) {
  if (!personaData || !Array.isArray(personaData.enl_signals) || !personaData.enl_signals.length) {
    return signals
  }
  const enlOrder = personaData.enl_signals.map(s => s.signal_id)
  const inOrder  = enlOrder.map(id => signals.find(s => s.signal_id === id)).filter(Boolean)
  const rest     = signals.filter(s => !enlOrder.includes(s.signal_id))
  return [...inOrder, ...rest]
}

// ---------------------------------------------------------------------------
// TraversalPath — breadcrumb showing traversal order + entry point
// ---------------------------------------------------------------------------

function TraversalPath({ persona, personaData, orderedSignals }) {
  if (!persona) return null
  const rule = ENL_TRAVERSAL[persona]
  if (!rule) return null

  return (
    <div className="enl-traversal-header">
      <div className="enl-traversal-label">{rule.label}</div>
      <div className="enl-traversal-desc">{rule.path_desc}</div>
      {orderedSignals.length > 0 && (
        <div className="enl-traversal-path">
          {orderedSignals.map((sig, i) => {
            const enlSig = personaData?.enl_signals?.find(s => s.signal_id === sig.signal_id)
            const state  = enlSig?.signal_state || 'unknown'
            const emph   = enlSig?.emphasis || 'none'
            const badge  = SIGNAL_STATE_BADGE[state] || SIGNAL_STATE_BADGE.unknown
            return (
              <span key={sig.signal_id} className="enl-path-seg">
                {i > 0 && <span className="enl-path-arrow">→</span>}
                <span className="enl-path-sig">
                  {sig.signal_id}
                  {emph === 'high' && (
                    <span className="enl-path-red-dot" title="emphasis:high" />
                  )}
                </span>
                <span
                  className="enl-path-state"
                  style={{ color: badge.color }}
                >
                  {badge.label}
                </span>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// TraversalEvidenceEntry — single signal evidence in traversal position
// ---------------------------------------------------------------------------

function TraversalEvidenceEntry({ signal, personaData, isEntry }) {
  const ev     = signal.evidence
  const enlSig = personaData?.enl_signals?.find(s => s.signal_id === signal.signal_id)
  const state  = enlSig?.signal_state || 'unknown'
  const emph   = enlSig?.emphasis     || 'none'
  const badge  = SIGNAL_STATE_BADGE[state] || SIGNAL_STATE_BADGE.unknown

  return (
    <div className={`traversal-evidence-entry${isEntry ? ' traversal-entry-point' : ''}`}>

      <div className="traversal-sig-header">
        {isEntry && <span className="traversal-entry-marker">▶ Entry</span>}
        <span className="traversal-sig-id">{signal.signal_id}</span>
        <span
          className="traversal-sig-state"
          style={{ color: badge.color }}
        >
          {badge.label}
        </span>
        {emph === 'high' && (
          <span className="traversal-emphasis-badge">emphasis:high</span>
        )}
        <span className="traversal-sig-title">{signal.title}</span>
      </div>

      {signal.evidence_warning ? (
        <div className="evidence-warning">⚠ {signal.evidence_warning}</div>
      ) : ev ? (
        <div className="traversal-evidence-detail">
          <div className="evidence-source">
            <span>Source</span>
            {ev.source_object_id} ({ev.source_layer}/{ev.source_file})
          </div>

          {ev.supporting_objects && ev.supporting_objects.length > 0 && (
            <div>
              {ev.supporting_objects.map((so, i) => (
                <div key={i} className="supporting-obj">
                  {so.object_id} [{so.layer}/{so.file}]
                  {so.state && <span className="obj-state"> state: {so.state}</span>}
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
        </div>
      ) : (
        <div className="evidence-warning">No evidence data available.</div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ENLPanel
// ---------------------------------------------------------------------------

export default function ENLPanel({ signals, navigation, persona, personaData }) {
  if (!signals || signals.length === 0) {
    return (
      <div className="enl-panel-body">
        <div className="no-query-state">Select a query to load evidence.</div>
      </div>
    )
  }

  const orderedSignals = applyTraversalOrder(signals, personaData)

  return (
    <div className="enl-panel-body">

      {/* Traversal path header — persona-shaped, absent if no persona selected */}
      <TraversalPath
        persona={persona}
        personaData={personaData}
        orderedSignals={orderedSignals}
      />

      {/* Evidence entries in traversal order [R1, R5] */}
      <div className="traversal-evidence-list">
        {orderedSignals.map((sig, i) => (
          <TraversalEvidenceEntry
            key={sig.signal_id}
            signal={sig}
            personaData={personaData}
            isEntry={i === 0 && !!persona}
          />
        ))}
      </div>

      {/* Navigation vault links — always after evidence */}
      <NavigationPanel navigation={navigation} />

    </div>
  )
}
