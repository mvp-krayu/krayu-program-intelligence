/**
 * ENLRevealPanel.js
 * PIOS-42.18-RUN01-CONTRACT-v1
 *
 * ENL chain reveal panel — additive demo step 6.
 *
 * Fetches ENL chain text from /api/execlens?enl=QUERY_ID.
 * Renders verbatim stdout from enl_console_adapter.py (42.15).
 *
 * Rules (42.18):
 *   ER-001  verbatim rendering — no transformation
 *   ER-004  no interpretation sentence injected
 *   ER-007  error state shown on failure — demo not blocked
 *   NI-001  no explanatory text added to chain output
 */

import { useState, useEffect } from 'react'

export default function ENLRevealPanel({ queryId }) {
  const [text,    setText]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    if (!queryId) return

    setLoading(true)
    setError(null)
    setText(null)

    fetch(`/api/execlens?enl=${encodeURIComponent(queryId)}`)
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
  }, [queryId])

  return (
    <div className="panel">
      <div className="panel-title">
        ENL Chain
        {queryId && <span className="panel-title-count">{queryId}</span>}
      </div>

      {loading && (
        <div className="loading-state">Loading ENL chain for {queryId}…</div>
      )}

      {error && (
        <div className="error-state">ENL chain unavailable: {error}</div>
      )}

      {text !== null && !loading && !error && (
        <pre className="enl-chain-output">{text}</pre>
      )}
    </div>
  )
}
