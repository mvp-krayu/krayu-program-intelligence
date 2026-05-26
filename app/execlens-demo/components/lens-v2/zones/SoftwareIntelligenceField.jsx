import { useState } from 'react'

const SEVERITY_COLOR = {
  HIGH: '#ff6b6b',
  ELEVATED: '#ff9e4a',
  MODERATE: '#ffd700',
  LOW: '#64ffda',
  NOMINAL: '#4a5570',
}

const AXIS_LEVEL_COLOR = {
  FULL: '#64ffda',
  PARTIAL: '#ffd700',
  EXERCISED: '#4a9eff',
  MINIMAL: '#ff9e4a',
  NONE: '#4a5570',
  RECONCILED: '#64ffda',
  UNRECONCILED: '#ff6b6b',
  UNAVAILABLE: '#4a5570',
}

const SURFACE_ICON = {
  DELIVERY_FRAGILITY: '⧖',
  COORDINATION_SATURATION: '⬡',
  INTEGRATION_EXPOSURE: '⇌',
  OPERATIONAL_TOPOLOGY: '◉',
  QUALIFICATION_EXPOSURE: '⊘',
  PROPAGATION_RISK: '⟿',
}

function QualificationContextStrip({ decomposition, qualification }) {
  if (!decomposition) return null
  const { structural_richness: sr, governance_depth: gd, reconciliation_authority: ra } = decomposition

  return (
    <div className="sw-intel-context-strip">
      <span className="sw-intel-context-axis">
        <span className="sw-intel-context-label">RICHNESS</span>
        <span className="sw-intel-context-value" style={{ color: AXIS_LEVEL_COLOR[sr.level] }}>{sr.level}</span>
      </span>
      <span className="sw-intel-context-sep" />
      <span className="sw-intel-context-axis">
        <span className="sw-intel-context-label">GOVERNANCE</span>
        <span className="sw-intel-context-value" style={{ color: AXIS_LEVEL_COLOR[gd.level] }}>{gd.level}</span>
      </span>
      <span className="sw-intel-context-sep" />
      <span className="sw-intel-context-axis">
        <span className="sw-intel-context-label">RECONCILIATION</span>
        <span className="sw-intel-context-value" style={{ color: AXIS_LEVEL_COLOR[ra.level] }}>{ra.level}</span>
      </span>
      {ra.q_class_display && (
        <>
          <span className="sw-intel-context-sep" />
          <span className="sw-intel-context-qclass">{ra.q_class_display}</span>
        </>
      )}
      {qualification && (
        <>
          <span className="sw-intel-context-sep" />
          <span className="sw-intel-context-slevel">{qualification.s_level}</span>
        </>
      )}
    </div>
  )
}

// ─── COGNITION SURFACE CARD ─────────────────────────────────────────
// Each surface is a compressed operational assessment, not a list panel

function CognitionSurfaceCard({ surface, expandable }) {
  const [expanded, setExpanded] = useState(false)
  const icon = SURFACE_ICON[surface.surface_id] || '◆'
  const sevColor = SEVERITY_COLOR[surface.severity] || '#7a8aaa'

  return (
    <div className="sw-intel-surface" data-severity={surface.severity} data-surface={surface.surface_id}>
      <div className="sw-intel-surface-header">
        <span className="sw-intel-surface-icon" style={{ color: sevColor }}>{icon}</span>
        <span className="sw-intel-surface-name">{surface.surface_name}</span>
        <span className="sw-intel-surface-severity" style={{ color: sevColor }}>{surface.severity}</span>
      </div>
      <div className="sw-intel-surface-summary">{surface.operational_summary}</div>
      <div className="sw-intel-surface-consequence">{surface.consequence}</div>
      {surface.affected_domains && surface.affected_domains.length > 0 && (
        <div className="sw-intel-surface-domains">
          {surface.affected_domains.slice(0, expanded ? undefined : 4).map(d => (
            <span key={d} className="sw-intel-surface-domain-tag">{d}</span>
          ))}
          {!expanded && surface.affected_domains.length > 4 && (
            <span className="sw-intel-surface-domain-more">+{surface.affected_domains.length - 4}</span>
          )}
        </div>
      )}
      {expandable && surface.constituents && (
        <>
          {expanded && (
            <CognitionSurfaceDetail surface={surface} />
          )}
          <button className="sw-intel-surface-expand" onClick={() => setExpanded(p => !p)} type="button">
            {expanded ? '▴ collapse' : '▾ structural detail'}
          </button>
        </>
      )}
      <div className="sw-intel-surface-footer">
        <span className="sw-intel-surface-density">{surface.evidence_density} evidence item{surface.evidence_density !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

function CognitionSurfaceDetail({ surface }) {
  const c = surface.constituents
  if (!c) return null

  if (surface.surface_id === 'DELIVERY_FRAGILITY' && Array.isArray(c)) {
    return (
      <div className="sw-intel-surface-detail">
        {c.map(item => (
          <div key={item.domain} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{item.domain}</span>
            <span className="sw-intel-surface-detail-value">
              {item.role} · {item.signal_count} signal{item.signal_count !== 1 ? 's' : ''}
              {item.peak_severity && <span style={{ color: SEVERITY_COLOR[item.peak_severity] }}> · {item.peak_severity}</span>}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (surface.surface_id === 'COORDINATION_SATURATION' && Array.isArray(c)) {
    return (
      <div className="sw-intel-surface-detail">
        {c.map(item => (
          <div key={item.path} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{item.path.split('/').slice(-2).join('/')}</span>
            <span className="sw-intel-surface-detail-value">
              {item.role} · in:{item.in_degree} out:{item.out_degree} · #{item.centrality_rank}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (surface.surface_id === 'INTEGRATION_EXPOSURE' && c.pass_through_domains) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">bridges</span>
          <span className="sw-intel-surface-detail-value">{c.bridges}</span>
        </div>
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">connectors</span>
          <span className="sw-intel-surface-detail-value">{c.connectors}</span>
        </div>
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">import signals</span>
          <span className="sw-intel-surface-detail-value">{c.isig_signals}</span>
        </div>
        {c.pass_through_domains.length > 0 && (
          <div className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">conducting</span>
            <span className="sw-intel-surface-detail-value">{c.pass_through_domains.join(', ')}</span>
          </div>
        )}
      </div>
    )
  }

  if (surface.surface_id === 'OPERATIONAL_TOPOLOGY' && c.role_breakdown) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">grounding</span>
          <span className="sw-intel-surface-detail-value">{c.backed} backed · {c.semantic_only} semantic-only · {c.grounding_pct}%</span>
        </div>
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">distribution</span>
          <span className="sw-intel-surface-detail-value">{c.role_distribution}</span>
        </div>
        {Object.entries(c.role_breakdown).sort((a, b) => b[1].count - a[1].count).slice(0, 4).map(([role, data]) => (
          <div key={role} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{role}</span>
            <span className="sw-intel-surface-detail-value">{data.count} ({data.pct}%)</span>
          </div>
        ))}
        {c.zone_anchors > 0 && (
          <div className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">zone anchors</span>
            <span className="sw-intel-surface-detail-value">{c.zone_anchors}</span>
          </div>
        )}
      </div>
    )
  }

  if (surface.surface_id === 'QUALIFICATION_EXPOSURE') {
    return (
      <div className="sw-intel-surface-detail">
        {c.s_level && (
          <div className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">level</span>
            <span className="sw-intel-surface-detail-value">{c.s_level}{c.promotion_eligible ? ' · eligible' : ''}{c.authority_ceiling ? ` · ceiling ${c.authority_ceiling}` : ''}</span>
          </div>
        )}
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">artifacts</span>
          <span className="sw-intel-surface-detail-value">{c.artifacts_present}/{c.artifacts_total} present</span>
        </div>
        {c.gaps.length > 0 && (
          <div className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">gaps</span>
            <span className="sw-intel-surface-detail-value">{c.gaps.join(', ')}</span>
          </div>
        )}
        {c.blockers.length > 0 && c.blockers.map((b, i) => (
          <div key={i} className="sw-intel-surface-detail-row sw-intel-surface-detail-row--warn">
            <span className="sw-intel-surface-detail-label">blocker</span>
            <span className="sw-intel-surface-detail-value">{b}</span>
          </div>
        ))}
      </div>
    )
  }

  if (surface.surface_id === 'PROPAGATION_RISK' && c.chain) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-propagation-chain">
          {c.chain.map((node, i) => (
            <div key={node.domain + i} className="sw-intel-surface-chain-node" data-role={node.role}>
              {i > 0 && <span className="sw-intel-surface-chain-arrow">→</span>}
              <span className="sw-intel-surface-chain-domain">{node.domain}</span>
              <span className="sw-intel-surface-chain-role">{node.role.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

// ─── PEAK SEVERITY STRIP ────────────────────────────────────────────

function PeakSeverityStrip({ surfaces }) {
  if (!surfaces || surfaces.length === 0) return null
  const elevated = surfaces.filter(s => s.severity === 'HIGH' || s.severity === 'ELEVATED')
  const peakSeverity = surfaces[0].severity

  return (
    <div className="sw-intel-peak-strip" data-severity={peakSeverity}>
      <span className="sw-intel-peak-indicator" style={{ color: SEVERITY_COLOR[peakSeverity] }}>{peakSeverity}</span>
      <span className="sw-intel-peak-count">{surfaces.length} cognition surface{surfaces.length !== 1 ? 's' : ''}</span>
      {elevated.length > 0 && (
        <span className="sw-intel-peak-elevated">{elevated.length} requiring attention</span>
      )}
    </div>
  )
}

// ─── EVIDENCE FOOTER ────────────────────────────────────────────────

function CognitionEvidenceFooter({ surfaces }) {
  const totalEvidence = surfaces.reduce((sum, s) => sum + (s.evidence_density || 0), 0)
  const totalSources = new Set(surfaces.flatMap(s => s.trace_sources || []))

  return (
    <div className="sw-intel-evidence-footer">
      <span className="sw-intel-evidence-count">{totalEvidence} evidence items across {surfaces.length} surfaces</span>
      <span className="sw-intel-evidence-sep">·</span>
      <span className="sw-intel-evidence-note">structurally derived — no inference</span>
    </div>
  )
}

// ─── FALLBACK + TOGGLE (preserved) ──────────────────────────────────

function SoftwareIntelligenceRawPICoreFallback({ onDeactivate }) {
  return (
    <button className="sw-intel-fallback-btn" onClick={onDeactivate} type="button">
      ← Return to PI Core view
    </button>
  )
}

function SoftwareIntelligenceModuleToggle({ active, available, onToggle }) {
  if (!available) return null
  return (
    <button
      className={`sw-intel-toggle${active ? ' sw-intel-toggle--active' : ''}`}
      onClick={onToggle}
      type="button"
      aria-pressed={active}
      title={active ? 'Deactivate Software Intelligence module' : 'Activate Software Intelligence module'}
    >
      <span className="sw-intel-toggle-dot" />
      <span className="sw-intel-toggle-label">SW-INTEL</span>
    </button>
  )
}

// ─── VIEW EXPORTS ───────────────────────────────────────────────────

export function SoftwareIntelligenceDenseView({ projection, onDeactivate }) {
  const surfaces = projection.surfaces || []

  return (
    <div className="sw-intel-view sw-intel-view--dense">
      <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
      <SoftwareIntelligenceRawPICoreFallback onDeactivate={onDeactivate} />
      <PeakSeverityStrip surfaces={surfaces} />

      <div className="sw-intel-surfaces">
        {surfaces.map(s => (
          <CognitionSurfaceCard key={s.surface_id} surface={s} expandable={true} />
        ))}
      </div>

      <CognitionEvidenceFooter surfaces={surfaces} />
    </div>
  )
}

export function SoftwareIntelligenceInvestigationView({ projection, onDeactivate }) {
  const surfaces = projection.surfaces || []

  return (
    <div className="sw-intel-view sw-intel-view--investigation">
      <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
      <SoftwareIntelligenceRawPICoreFallback onDeactivate={onDeactivate} />
      <PeakSeverityStrip surfaces={surfaces} />

      <div className="sw-intel-surfaces">
        {surfaces.map(s => (
          <CognitionSurfaceCard key={s.surface_id} surface={s} expandable={true} />
        ))}
      </div>

      <CognitionEvidenceFooter surfaces={surfaces} />
    </div>
  )
}

export function SoftwareIntelligenceBoardroomSummary({ projection }) {
  const surfaces = projection.surfaces || []
  const elevated = surfaces.filter(s => s.severity === 'HIGH' || s.severity === 'ELEVATED')
  const toShow = elevated.length > 0 ? elevated.slice(0, 3) : surfaces.slice(0, 2)

  return (
    <div className="sw-intel-boardroom-summary">
      <div className="sw-intel-boardroom-header">
        <span className="sw-intel-boardroom-module-tag">SW-INTEL</span>
        <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
      </div>
      {toShow.map(s => (
        <div key={s.surface_id} className="sw-intel-boardroom-surface" data-severity={s.severity}>
          <div className="sw-intel-boardroom-surface-header">
            <span className="sw-intel-boardroom-surface-name">{s.surface_name}</span>
            <span className="sw-intel-boardroom-surface-severity" style={{ color: SEVERITY_COLOR[s.severity] }}>{s.severity}</span>
          </div>
          <div className="sw-intel-boardroom-surface-summary">{s.operational_summary}</div>
        </div>
      ))}
      {surfaces.length > toShow.length && (
        <div className="sw-intel-boardroom-more">+{surfaces.length - toShow.length} surface{surfaces.length - toShow.length !== 1 ? 's' : ''}</div>
      )}
    </div>
  )
}

export function SoftwareIntelligenceBalancedNarrative({ projection }) {
  const surfaces = projection.surfaces || []

  return (
    <div className="sw-intel-balanced-narrative">
      <div className="sw-intel-balanced-header">
        <span className="sw-intel-balanced-module-tag">SW-INTEL</span>
        <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
      </div>
      {surfaces.slice(0, 4).map(s => (
        <div key={s.surface_id} className="sw-intel-balanced-section">
          <div className="sw-intel-balanced-section-title">
            <span>{s.surface_name}</span>
            <span className="sw-intel-balanced-section-severity" style={{ color: SEVERITY_COLOR[s.severity] }}>{s.severity}</span>
          </div>
          <div className="sw-intel-balanced-section-body">{s.operational_summary}</div>
          {s.consequence && (
            <div className="sw-intel-balanced-section-consequence">{s.consequence}</div>
          )}
        </div>
      ))}
    </div>
  )
}

export { SoftwareIntelligenceModuleToggle }
export default SoftwareIntelligenceDenseView
