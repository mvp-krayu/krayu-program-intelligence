/**
 * PersonaPanel.js
 * PIOS-51.5-RUN01-CONTRACT-v1
 * (supersedes PIOS-51.4-RUN01-CONTRACT-v1)
 *
 * Persona selector + ENL display — content only.
 * Panel header and collapse are provided by DisclosurePanel wrapper in index.js.
 *
 * - Renders EXECUTIVE / CTO / ANALYST selector buttons
 * - On selection: calls ?persona=P&query=GQ-XXX
 * - Displays ENL output (projection-enriched signals) for selected persona
 * - Lifts persona selection + data to parent via callbacks [51.5]
 * - Reuses same query — no separate demo, no reload
 * - Updates perspective only
 *
 * Rules:
 *   R1  persona calls same query as currently active queryId prop
 *   R2  no new computation — display only
 *   R3  ENL section keyed to current queryId prop
 *   R4  no panel-level wrapper here — DisclosurePanel provides it
 *   R5  onPersonaChange + onPersonaDataChange lifted to parent [51.5]
 */

import { useState, useEffect } from 'react'

const PERSONAS = [
  { id: 'EXECUTIVE', label: 'Executive',  question: 'What does this mean for my program delivery commitment?' },
  { id: 'CTO',       label: 'CTO',        question: 'What structural risk does this expose in my architecture?' },
  { id: 'ANALYST',   label: 'Analyst',    question: 'What evidence gaps remain and what would close them?' },
]

const SIGNAL_STATE_LABEL = {
  computed:  { label: 'Computed',  color: 'var(--strong)' },
  evaluable: { label: 'Evaluable', color: 'var(--moderate)' },
  partial:   { label: 'Partial',   color: 'var(--moderate)' },
  blocked:   { label: 'Blocked',   color: 'var(--weak)' },
  unknown:   { label: 'Unknown',   color: 'var(--text-dim)' },
}

export default function PersonaPanel({ queryId, onPersonaChange, onPersonaDataChange }) {
  const [selectedPersona, setSelectedPersona] = useState(null)
  const [personaData,     setPersonaData]     = useState(null)
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState(null)

  // Reset on query change [R3]
  useEffect(() => {
    setSelectedPersona(null)
    setPersonaData(null)
    setError(null)
    onPersonaChange?.(null)
    onPersonaDataChange?.(null)
  }, [queryId])

  // Fetch persona view [R1]
  useEffect(() => {
    if (!selectedPersona || !queryId) return

    setLoading(true)
    setError(null)
    setPersonaData(null)
    onPersonaDataChange?.(null)

    fetch(
      `/api/execlens?persona=${encodeURIComponent(selectedPersona)}&query=${encodeURIComponent(queryId)}`
    )
      .then(r => {
        if (!r.ok) return r.json().then(d => { throw new Error(d.error || `HTTP ${r.status}`) })
        return r.json()
      })
      .then(data => {
        setPersonaData(data)
        setLoading(false)
        onPersonaDataChange?.(data)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
        onPersonaChange?.(null)
        onPersonaDataChange?.(null)
      })
  }, [selectedPersona, queryId])

  const handlePersonaSelect = (personaId) => {
    setSelectedPersona(personaId)
    onPersonaChange?.(personaId)
  }

  if (!queryId) return null

  return (
    <div className="persona-panel-body">

      {/* Selector buttons */}
      <div className="persona-selector">
        {PERSONAS.map(p => (
          <button
            key={p.id}
            className={`persona-btn${selectedPersona === p.id ? ' persona-btn-active' : ''}`}
            onClick={() => handlePersonaSelect(p.id)}
            type="button"
          >
            <span className="persona-btn-label">{p.label}</span>
            <span className="persona-btn-question">{p.question}</span>
          </button>
        ))}
      </div>

      {/* ENL output — only after persona selected */}
      {selectedPersona && (
        <div className="enl-output">

          {loading && (
            <div className="loading-state">
              Loading {selectedPersona} lens for {queryId}…
            </div>
          )}

          {error && (
            <div className="error-state">
              ENL lens error: {error}
            </div>
          )}

          {personaData && !loading && (
            <>
              <div className="enl-header">
                <span className="enl-framing-label">{personaData.framing_label}</span>
                <span className="enl-primary-question">{personaData.primary_question}</span>
              </div>

              {/* Emphasis nodes */}
              {personaData.emphasis_nodes && personaData.emphasis_nodes.length > 0 && (
                <div className="enl-emphasis-row">
                  {personaData.emphasis_nodes.map(n => (
                    <span key={n.node_id} className="enl-emphasis-chip enl-emphasis-high">
                      {n.node_id} — emphasis:high
                    </span>
                  ))}
                </div>
              )}

              {/* Signal entries */}
              {personaData.enl_signals && personaData.enl_signals.length > 0 && (
                <div className="enl-signals">
                  {personaData.enl_signals.map(sig => {
                    const stateMeta = SIGNAL_STATE_LABEL[sig.signal_state] || SIGNAL_STATE_LABEL.unknown
                    return (
                      <div key={sig.signal_id} className="enl-signal-row">
                        <div className="enl-signal-header">
                          <span className="enl-signal-id">{sig.signal_id}</span>
                          <span className="enl-signal-state" style={{ color: stateMeta.color }}>
                            {stateMeta.label}
                          </span>
                          <span className="enl-signal-relevance">{sig.relevance}</span>
                          {sig.emphasis === 'high' && (
                            <span className="enl-signal-emphasis-badge">emphasis:high</span>
                          )}
                        </div>
                        <div className="enl-signal-title">{sig.title}</div>
                        <div className="enl-signal-location">
                          {sig.domain_name} · {sig.capability_name}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="enl-source">
                Source: {personaData.projection_source}
              </div>
            </>
          )}
        </div>
      )}

    </div>
  )
}
