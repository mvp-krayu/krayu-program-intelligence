/**
 * components/lens/FocusDomainPanel.js
 * PRODUCTIZE.LENS.TOPOLOGY.INTELLIGENCE.01
 *
 * Focus Domain spotlight — CLM-20 (Security Intelligence).
 * Surfaces domain title, business exposure, what is known, what requires validation,
 * and a cross-connections teaser.
 *
 * Caveats are normalized before display. No internal identifiers exposed.
 * Consumes ZONE-2 projection payloads only.
 */

// ---------------------------------------------------------------------------
// Caveat normalization (same transforms as RiskPanel / ExecutiveStatusPanel)
// ---------------------------------------------------------------------------

const EXACT_TRANSFORMS = {
  'CONCEPT-06 predicate uses PHASE_1_ACTIVE — will not match NOT_EVALUATED on recomputed run. EXECUTION verdict may not correctly show UNKNOWN on Stream 10 schema. Must be fixed before LENS surface.':
    'Execution readiness verdict requires a configuration update before it can be automatically derived. Currently confirmed as pending assessment.',

  'CONCEPT-06 predicate mismatch (BC-01): EXECUTION verdict cannot be automatically derived until the predicate in concepts.json is updated to include NOT_EVALUATED. Manually confirmed as UNKNOWN based on execution_status=NOT_EVALUATED.':
    'Execution readiness verdict is manually confirmed as pending assessment. This condition resolves upon a targeted configuration update.',

  'Four-layer chain (SIG-006 → COND-006 → DIAG-006 → INTEL-001). Runtime throughput is not measured; ceiling is static configuration only.':
    'Runtime throughput is not measured; the configured capacity ceiling requires live validation to confirm operational performance.',
}

const ID_PATTERNS = [
  [/\bSIG-\d+\b/g,     '[signal reference]'],
  [/\bCOND-\d+\b/g,    '[condition reference]'],
  [/\bDIAG-\d+\b/g,    '[diagnostic reference]'],
  [/\bINTEL-\d+\b/g,   '[intelligence reference]'],
  [/\bCONCEPT-\d+\b/g, '[predicate condition]'],
  [/\bBC-\d+\b/g,       '[blocking condition]'],
  [/PHASE_\w+/g,        '[phase condition]'],
  [/NOT_EVALUATED/g,    'pending assessment'],
  [/execution_status=\w+/g, 'execution status'],
  [/concepts\.json/g,   '[configuration file]'],
  [/Stream \d+/g,       '[schema version]'],
]

function normalizeCaveat(text) {
  const exact = EXACT_TRANSFORMS[text.trim()]
  if (exact) return exact
  let out = text
  for (const [pattern, replacement] of ID_PATTERNS) {
    out = out.replace(pattern, replacement)
  }
  return out
}

// ---------------------------------------------------------------------------
// Cross-connections teaser — which domains this domain connects to
// ---------------------------------------------------------------------------

const CROSS_CONNECTIONS = [
  { label: 'Platform Architecture', note: 'Shares structural verification basis' },
  { label: 'Operational Readiness', note: 'Contributes to three-axis readiness verdict' },
  { label: 'Execution Pathway',     note: 'Informs achievable readiness ceiling' },
]

export default function FocusDomainPanel({ payload }) {
  if (!payload || payload.error_type || payload.zone !== 'ZONE-2') return null

  const signal       = payload.signal
  const knownNarr    = payload.value?.narrative || null
  const businessExp  = signal?.business_impact  || null
  const caveats      = Array.isArray(payload.caveats) ? payload.caveats : []
  const firstCaveat  = caveats.length > 0 ? normalizeCaveat(caveats[0]) : null

  return (
    <div className="lens-focus-panel">
      <div className="lens-panel-label">FOCUS DOMAIN</div>

      <div className="lens-focus-domain-title">Security Intelligence</div>
      <p className="lens-focus-domain-sub">
        A structured intelligence pathway with defined capacity bounds. The domain is structurally verified;
        live throughput confirmation is the remaining step to full operational validation.
      </p>

      <div className="lens-focus-rows">
        {businessExp && (
          <div className="lens-focus-row">
            <span className="lens-focus-row-key">BUSINESS EXPOSURE</span>
            <span className="lens-focus-row-val">{businessExp}</span>
          </div>
        )}

        {knownNarr && (
          <div className="lens-focus-row">
            <span className="lens-focus-row-key">WHAT IS KNOWN</span>
            <span className="lens-focus-row-val">{knownNarr}</span>
          </div>
        )}

        {firstCaveat && (
          <div className="lens-focus-row">
            <span className="lens-focus-row-key">WHAT REQUIRES VALIDATION</span>
            <span className="lens-focus-row-val">{firstCaveat}</span>
          </div>
        )}
      </div>

      <div className="lens-focus-connections">
        <div className="lens-focus-connections-label">CONNECTED DOMAINS</div>
        <div className="lens-focus-connections-list">
          {CROSS_CONNECTIONS.map(c => (
            <div key={c.label} className="lens-focus-connection-item">
              <span className="lens-focus-conn-name">{c.label}</span>
              <span className="lens-focus-conn-note">{c.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
