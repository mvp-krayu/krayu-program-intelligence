/**
 * QuerySelector.js
 * PIOS-42.4-RUN01-CONTRACT-v2
 *
 * Fetches available query list from /api/execlens?list=true.
 * No hardcoded query IDs or content. All data sourced from adapter.
 */

import { useState, useEffect } from 'react'

export default function QuerySelector({ selectedQuery, onSelect }) {
  const [queries, setQueries]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  useEffect(() => {
    fetch('/api/execlens?list=true')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        setQueries(data.queries || [])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="query-selector-wrap">
        <div className="loading-state">Loading queries from adapter…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="query-selector-wrap">
        <div className="error-state">Query list error: {error}</div>
      </div>
    )
  }

  if (!queries || queries.length === 0) {
    return (
      <div className="query-selector-wrap">
        <div className="error-state">No queries returned from adapter.</div>
      </div>
    )
  }

  return (
    <div className="query-selector-wrap">
      <label htmlFor="query-select">Select Query</label>
      <select
        id="query-select"
        value={selectedQuery || ''}
        onChange={e => onSelect(e.target.value || null)}
      >
        <option value="">— choose a query —</option>
        {queries.map(q => (
          <option key={q.query_id} value={q.query_id}>
            {q.query_id}  [{q.intent_type}]  {q.query_text}
          </option>
        ))}
      </select>
    </div>
  )
}
