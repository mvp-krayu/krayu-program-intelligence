/**
 * PersonaPanel.js
 * PIOS-51.6R.3-RUN01-CONTRACT-v1
 * (supersedes PIOS-51.5-RUN01-CONTRACT-v1)
 * Lineage: PIOS-51.4-RUN01-CONTRACT-v1 → PIOS-51.5-RUN01-CONTRACT-v1 → PIOS-51.6R.3-RUN01-CONTRACT-v1
 *
 * Persona selector — content only.
 * Panel header and collapse are provided by DisclosurePanel wrapper in index.js.
 *
 * - Renders EXECUTIVE / CTO / ANALYST selector buttons
 * - On selection: calls ?persona=P&query=GQ-XXX
 * - Displays framing_label + primary_question for selected persona only [51.6R.3]
 * - Lifts persona selection + data to parent via callbacks [51.5]
 * - Reuses same query — no separate demo, no reload
 *
 * Rules:
 *   R1  persona calls same query as currently active queryId prop
 *   R2  no new computation — display only
 *   R3  ENL section keyed to current queryId prop
 *   R4  no panel-level wrapper here — DisclosurePanel provides it
 *   R5  onPersonaChange + onPersonaDataChange lifted to parent [51.5]
 *   R6  no signal cards, no emphasis blocks, no source refs [51.6R.3]
 *   R7  signal content owned by SignalPanel; evidence owned by ENLPanel [51.6R.3]
 */

import { useState, useEffect } from 'react'

const PERSONAS = [
  { id: 'EXECUTIVE', label: 'Executive',  question: 'What does this mean for my program delivery commitment?' },
  { id: 'CTO',       label: 'CTO',        question: 'What structural risk does this expose in my architecture?' },
  { id: 'ANALYST',   label: 'Analyst',    question: 'What evidence gaps remain and what would close them?' },
]


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
            <div className="enl-header">
              <span className="enl-framing-label">{personaData.framing_label}</span>
              <span className="enl-primary-question">{personaData.primary_question}</span>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
