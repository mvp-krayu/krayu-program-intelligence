/**
 * PersonaPanel.js
 * PIOS-42.18-RUN01-CONTRACT-v1
 *
 * Persona view panel — additive demo step 8.
 *
 * Fetches persona view text from /api/execlens?persona=PERSONA&query=QUERY_ID.
 * Renders verbatim stdout from persona_view_map.py (42.16).
 *
 * Rules (42.18):
 *   PS-001  persona switch never changes selectedQuery
 *   PS-002  selector limited to EXECUTIVE / CTO / ANALYST
 *   PS-003  no free-text persona input
 *   ER-001  verbatim rendering — no transformation
 *   NI-002  no explanatory text added to persona output
 */

import { useState, useEffect } from 'react'

const PERSONAS = ['EXECUTIVE', 'CTO', 'ANALYST']

export default function PersonaPanel({ persona, queryId, onPersonaChange }) {
  const [text,    setText]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!persona || !queryId) return

    setLoading(true)
    setError(null)
    setText(null)

    fetch(`/api/execlens?persona=${encodeURIComponent(persona)}&query=${encodeURIComponent(queryId)}`)
      .then(r => {
        if (!r.ok) return r.json().then(d => { throw new Error(d.error || `HTTP ${r.status}`) })
        return r.json()
      })
      .then(data => {
        setText(data.text || '')
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [persona, queryId])

  return (
    <div className="panel">
      <div className="panel-title">
        Persona View
        {persona && <span className="panel-title-count">{persona}</span>}
        {queryId && <span className="panel-title-count">{queryId}</span>}
      </div>

      {/* Persona selector — governed allowlist only (PS-002, PS-003) */}
      <div className="persona-selector">
        {PERSONAS.map(p => (
          <button
            key={p}
            className={`persona-btn${persona === p ? ' persona-btn-active' : ''}`}
            onClick={() => onPersonaChange && onPersonaChange(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {loading && (
        <div className="loading-state">Loading {persona} view for {queryId}…</div>
      )}

      {error && (
        <div className="error-state">Persona view unavailable: {error}</div>
      )}

      {text !== null && !loading && !error && (
        <pre className="persona-view-output">{text}</pre>
      )}
    </div>
  )
}
