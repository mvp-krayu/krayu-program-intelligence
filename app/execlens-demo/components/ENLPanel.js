/**
 * ENLPanel.js
 * PIOS-51.6R.4-RUN01-CONTRACT-v1
 * (supersedes PIOS-51.6R-RUN01-CONTRACT-v1)
 * Lineage: PIOS-51.5R-RUN01-CONTRACT-v1 → PIOS-51.6R-RUN01-CONTRACT-v1 → PIOS-51.6R.4-RUN01-CONTRACT-v1
 *
 * Visible ENL chain repair — persona-shaped chain navigation.
 *
 * Gap repaired (51.5R):
 *   Prior version surfaced same evidence fields regardless of persona.
 *   Repair makes persona-specific primary field visibly dominant in each chain step.
 *   Chain structure (numbered steps, connectors, entry marker) is now primary.
 *
 * Persona narrative restoration (51.6R):
 *   PersonaNarrativeHeader renders framing_label + primary_question as dominant anchor.
 *   Persona identity is felt immediately before chain traversal begins.
 *
 * Rules:
 *   R1  traversal order from personaData.enl_signals (42.16) — array reorder only
 *   R2  evidence data from signals prop (42.4) — unchanged
 *   R3  PERSONA_LENS_FOCUS: static rules, no computation, no ranking
 *   R4  same evidence set — different primary field foregrounded per persona
 *   R5  no new API calls, no new computation
 *   R6  no duplication — evidence owned here, signals owned by SignalPanel
 *   R7  chain step structure is primary; source detail is secondary
 *   R8  PersonaNarrativeHeader: persona framing is dominant anchor before chain [51.6R]
 *
 * Sequence authority: docs/pios/51.5R/enl_visible_chain_contract.md
 */

import { useState } from 'react'
import NavigationPanel from './NavigationPanel'

// ---------------------------------------------------------------------------
// PIOS-51.5R: Static traversal rules — deterministic by persona [R3]
// No computation. Static field focus only.
// ---------------------------------------------------------------------------

const ENL_TRAVERSAL = {
  EXECUTIVE: {
    label:        'Impact-First Traversal',
    path_desc:    'High-emphasis signals first — program delivery impact lens',
    chain_label:  'Delivery Impact',
    entry_rule:   'emphasis:high first',
  },
  CTO: {
    label:        'Evidence-Grounded Traversal',
    path_desc:    'Structural evidence foregrounded — architectural risk lens',
    chain_label:  'Structural Evidence',
    entry_rule:   'evaluable state first',
  },
  ANALYST: {
    label:        'Chain & Gap Traversal',
    path_desc:    'Evidence chain and blocking points — evidence gap lens',
    chain_label:  'Evidence Chain & Gaps',
    entry_rule:   'blocking point first',
  },
}

// Static lens focus — which evidence fields are primary per persona [R3]
// No computation. Direct field reads from governed payload.
const PERSONA_LENS_FOCUS = {
  EXECUTIVE: {
    primary:   'business_impact',
    secondary: null,
  },
  CTO: {
    primary:   'risk',
    secondary: 'evidence_chain',
  },
  ANALYST: {
    primary:   'evidence_chain',
    secondary: 'blocking_point',
  },
}

const SIGNAL_STATE_BADGE = {
  computed:  { label: 'Computed',  color: 'var(--strong)' },
  evaluable: { label: 'Evaluable', color: 'var(--moderate)' },
  partial:   { label: 'Partial',   color: 'var(--moderate)' },
  blocked:   { label: 'Blocked',   color: 'var(--weak)' },
  unknown:   { label: 'Unknown',   color: 'var(--text-dim)' },
}

const FIELD_LABEL = {
  business_impact: 'Delivery Impact',
  risk:            'Structural Risk',
  evidence_chain:  'Evidence Chain',
  blocking_point:  'Blocking Point',
}

// ---------------------------------------------------------------------------
// Traversal ordering — uses ENL signal order from 42.16 adapter [R1]
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
// PersonaNarrativeHeader — persona framing as dominant anchor [R8]
// framing_label + primary_question: immediately differentiates persona experience
// Source: personaData from 42.16 adapter — direct read, no computation
// ---------------------------------------------------------------------------

const PERSONA_ACCENT = {
  EXECUTIVE: { color: 'var(--strong)',   label: 'Executive' },
  CTO:       { color: 'var(--moderate)', label: 'CTO' },
  ANALYST:   { color: 'var(--weak)',     label: 'Analyst' },
}

function PersonaNarrativeHeader({ persona, personaData }) {
  if (!persona || !personaData) return null
  const accent  = PERSONA_ACCENT[persona] || { color: 'var(--text-dim)', label: persona }

  return (
    <div className="enl-persona-narrative-header" style={{ borderLeftColor: accent.color }}>
      <div className="enl-pnh-persona-row">
        <span className="enl-pnh-persona-chip" style={{ background: accent.color }}>
          {accent.label}
        </span>
        <span className="enl-pnh-lens">{personaData.lens}</span>
        {personaData.aggregate_confidence && (
          <span className="enl-pnh-confidence">{personaData.aggregate_confidence}</span>
        )}
      </div>
      <div className="enl-pnh-framing-label">{personaData.framing_label}</div>
      <div className="enl-pnh-primary-question">{personaData.primary_question}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChainHeader — traversal label + entry rule + step count
// ---------------------------------------------------------------------------

function ChainHeader({ persona, personaData, stepCount }) {
  if (!persona) return null
  const rule = ENL_TRAVERSAL[persona]
  if (!rule) return null

  return (
    <div className="enl-chain-header">
      <div className="enl-chain-header-top">
        <span className="enl-chain-traversal-label">{rule.label}</span>
        <span className="enl-chain-step-count">{stepCount} step{stepCount !== 1 ? 's' : ''}</span>
      </div>
      <div className="enl-chain-path-desc">{rule.path_desc}</div>
      <div className="enl-chain-entry-rule">Entry rule: {rule.entry_rule}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChainBreadcrumb — horizontal path showing signal IDs in order
// ---------------------------------------------------------------------------

function ChainBreadcrumb({ orderedSignals, personaData }) {
  if (!orderedSignals || orderedSignals.length === 0) return null

  return (
    <div className="enl-chain-breadcrumb">
      {orderedSignals.map((sig, i) => {
        const enlSig = personaData?.enl_signals?.find(s => s.signal_id === sig.signal_id)
        const state  = enlSig?.signal_state || 'unknown'
        const emph   = enlSig?.emphasis || 'none'
        const badge  = SIGNAL_STATE_BADGE[state] || SIGNAL_STATE_BADGE.unknown
        return (
          <span key={sig.signal_id} className="enl-breadcrumb-seg">
            {i > 0 && <span className="enl-breadcrumb-arrow">→</span>}
            <span className={`enl-breadcrumb-node${i === 0 ? ' enl-breadcrumb-entry' : ''}`}>
              <span className="enl-breadcrumb-id">{sig.signal_id}</span>
              {emph === 'high' && <span className="enl-breadcrumb-dot" title="emphasis:high" />}
              <span className="enl-breadcrumb-state" style={{ color: badge.color }}>{badge.label}</span>
            </span>
          </span>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ChainPrimaryField — renders the persona-foregrounded evidence field [R3, R4]
// Static read — no computation or transformation
// ---------------------------------------------------------------------------

function ChainPrimaryField({ signal, fieldKey, label }) {
  if (!fieldKey) return null
  const ev = signal.evidence

  if (fieldKey === 'business_impact') {
    const val = signal.business_impact
    if (!val) return null
    return (
      <div className="enl-chain-primary-field">
        <div className="enl-chain-field-label">{label}</div>
        <div className="enl-chain-field-value">{val}</div>
      </div>
    )
  }

  if (fieldKey === 'risk') {
    const val = signal.risk
    if (!val) return null
    return (
      <div className="enl-chain-primary-field">
        <div className="enl-chain-field-label">{label}</div>
        <div className="enl-chain-field-value">{val}</div>
      </div>
    )
  }

  if (fieldKey === 'evidence_chain') {
    const val = ev?.evidence_chain
    if (!val) return null
    const segs = val.split('→').map(s => s.trim()).filter(Boolean)
    return (
      <div className="enl-chain-primary-field">
        <div className="enl-chain-field-label">{label}</div>
        <div className="enl-chain-segments">
          {segs.map((seg, i) => (
            <div key={i} className="enl-chain-segment">
              {i > 0 && <span className="enl-seg-arrow">↓</span>}
              <span className="enl-seg-text">{seg}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (fieldKey === 'blocking_point') {
    const val = ev?.blocking_point
    if (!val) return null
    return (
      <div className="enl-chain-primary-field enl-chain-field-blocking">
        <div className="enl-chain-field-label">{label}</div>
        <div className="enl-chain-field-value">{val}</div>
      </div>
    )
  }

  return null
}

// ---------------------------------------------------------------------------
// ChainStep — single step in the visible ENL chain [R7]
// Primary field is persona-focused. Source detail is secondary.
// ---------------------------------------------------------------------------

function ChainStep({ signal, stepNum, isEntry, persona, personaData }) {
  const ev     = signal.evidence
  const enlSig = personaData?.enl_signals?.find(s => s.signal_id === signal.signal_id)
  const state  = enlSig?.signal_state || 'unknown'
  const emph   = enlSig?.emphasis     || 'none'
  const badge  = SIGNAL_STATE_BADGE[state] || SIGNAL_STATE_BADGE.unknown
  const focus  = persona ? (PERSONA_LENS_FOCUS[persona] || null) : null

  return (
    <div className={`enl-chain-step${isEntry ? ' enl-chain-step-entry' : ''}`}>

      {/* Step number + signal identity */}
      <div className="enl-step-number-col">
        <div className={`enl-step-num${isEntry ? ' enl-step-num-entry' : ''}`}>{stepNum}</div>
        {!isEntry && <div className="enl-step-connector" />}
      </div>

      <div className="enl-step-body">

        {/* Step header */}
        <div className="enl-step-header">
          {isEntry && <span className="enl-step-entry-marker">▶ Entry</span>}
          <span className="enl-step-sig-id">{signal.signal_id}</span>
          <span className="enl-step-sig-state" style={{ color: badge.color }}>{badge.label}</span>
          {emph === 'high' && (
            <span className="enl-step-emphasis-badge">emphasis:high</span>
          )}
          {focus && (
            <span className="enl-step-lens-tag">{ENL_TRAVERSAL[persona]?.chain_label}</span>
          )}
        </div>

        {/* Signal title */}
        <div className="enl-step-sig-title">{signal.title}</div>

        {/* Persona primary field — foregrounded [R3, R4] */}
        {focus && (
          <>
            <ChainPrimaryField
              signal={signal}
              fieldKey={focus.primary}
              label={FIELD_LABEL[focus.primary] || focus.primary}
            />
            {focus.secondary && (
              <ChainPrimaryField
                signal={signal}
                fieldKey={focus.secondary}
                label={FIELD_LABEL[focus.secondary] || focus.secondary}
              />
            )}
          </>
        )}

        {/* No-persona fallback: show evidence_chain */}
        {!focus && ev?.evidence_chain && (
          <div className="enl-chain-primary-field">
            <div className="enl-chain-field-label">Evidence Chain</div>
            <div className="enl-chain-segments">
              {ev.evidence_chain.split('→').map((seg, i) => (
                seg.trim()
                  ? (
                    <div key={i} className="enl-chain-segment">
                      {i > 0 && <span className="enl-seg-arrow">↓</span>}
                      <span className="enl-seg-text">{seg.trim()}</span>
                    </div>
                  )
                  : null
              ))}
            </div>
          </div>
        )}

        {/* Evidence source — secondary [R7] */}
        {ev && (
          <div className="enl-step-source-row">
            <span className="enl-step-source-label">Source</span>
            <span className="enl-step-source-id">{ev.source_object_id}</span>
            <span className="enl-step-source-loc">({ev.source_layer}/{ev.source_file})</span>
            {ev.temporal_reference && (
              <span className="enl-step-temporal">{ev.temporal_reference}</span>
            )}
          </div>
        )}

        {/* Warning */}
        {signal.evidence_warning && (
          <div className="evidence-warning">⚠ {signal.evidence_warning}</div>
        )}

      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// RawArtifactsSection — Analyst only [51.6R.4]
// Opens existing evidence fields — read-only, no transformation, no new API [R5]
// ---------------------------------------------------------------------------

function RawArtifactsSection({ signals }) {
  const [open, setOpen] = useState(false)
  if (!signals || signals.length === 0) return null
  return (
    <div className="raw-artifacts-section">
      <button
        className={`raw-artifacts-toggle${open ? ' raw-artifacts-toggle-open' : ''}`}
        onClick={() => setOpen(o => !o)}
        type="button"
      >
        {open ? 'Hide raw artifacts' : 'View raw artifacts'}
      </button>
      {open && (
        <div className="raw-artifacts-body">
          {signals.map(sig => sig.evidence ? (
            <div key={sig.signal_id} className="raw-artifact-entry">
              <div className="raw-artifact-id">{sig.signal_id}</div>
              <pre className="raw-artifact-data">{JSON.stringify(sig.evidence, null, 2)}</pre>
            </div>
          ) : null)}
        </div>
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

      {/* Persona narrative — dominant anchor [R8] */}
      <PersonaNarrativeHeader
        persona={persona}
        personaData={personaData}
      />

      {/* Chain header — persona-shaped traversal label [R3] */}
      <ChainHeader
        persona={persona}
        personaData={personaData}
        stepCount={orderedSignals.length}
      />

      {/* Chain breadcrumb — ordered path with state badges */}
      <ChainBreadcrumb
        orderedSignals={orderedSignals}
        personaData={personaData}
      />

      {/* Chain steps — persona-focused evidence fields are primary [R4, R7] */}
      <div className="enl-chain-list">
        {orderedSignals.map((sig, i) => (
          <ChainStep
            key={sig.signal_id}
            signal={sig}
            stepNum={i + 1}
            isEntry={i === 0}
            persona={persona}
            personaData={personaData}
          />
        ))}
      </div>

      {/* Navigation vault links — always after chain */}
      <NavigationPanel navigation={navigation} />

      {/* Raw artifacts — Analyst only [51.6R.4, R5] */}
      {persona === 'ANALYST' && (
        <RawArtifactsSection signals={orderedSignals} />
      )}

    </div>
  )
}
