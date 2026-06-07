import { useState, useMemo } from 'react'
import { SURFACE_CONDITION_MAP } from '../../../lib/lens-v2/SoftwareIntelligenceProjectionAdapter'
import { TermHint } from './OperatorReadingGuide'

const SEVERITY_COLOR = {
  HIGH: '#ff6b6b',
  ELEVATED: '#ff9e4a',
  MODERATE: '#ffd700',
  LOW: '#64ffda',
  NOMINAL: '#7a8aaa',
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
  STRUCTURAL_FRAGILITY: '⚡',
  BOUNDARY_ALIGNMENT: '⊿',
  STRUCTURAL_COUPLING: '⊛',
  REINFORCEMENT_FLOWS: '⇄',
  CONVERGENCE_PATTERNS: '⊕',
  ABSENCE_PROFILE: '◇',
}

function QualificationContextStrip({ decomposition, qualification }) {
  if (!decomposition) return null
  const { structural_richness: sr, governance_depth: gd, reconciliation_authority: ra } = decomposition

  return (
    <div className="sw-intel-context-strip">
      <span className="sw-intel-context-axis">
        <span className="sw-intel-context-label"><TermHint term="RICHNESS">RICHNESS</TermHint></span>
        <span className="sw-intel-context-value" style={{ color: AXIS_LEVEL_COLOR[sr.level] }}>{sr.level}</span>
      </span>
      <span className="sw-intel-context-sep" />
      <span className="sw-intel-context-axis">
        <span className="sw-intel-context-label"><TermHint term="GOVERNANCE">GOVERNANCE</TermHint></span>
        <span className="sw-intel-context-value" style={{ color: AXIS_LEVEL_COLOR[gd.level] }}>{gd.level}</span>
      </span>
      <span className="sw-intel-context-sep" />
      <span className="sw-intel-context-axis">
        <span className="sw-intel-context-label"><TermHint term="RECONCILIATION">RECONCILIATION</TermHint></span>
        <span className="sw-intel-context-value" style={{ color: AXIS_LEVEL_COLOR[ra.level] }}>{ra.level}</span>
      </span>
      {ra.q_class_display && (
        <>
          <span className="sw-intel-context-sep" />
          <span className="sw-intel-context-qclass"><TermHint term={ra.q_class_display}>{ra.q_class_display}</TermHint></span>
        </>
      )}
      {qualification && (
        <>
          <span className="sw-intel-context-sep" />
          <span className="sw-intel-context-slevel"><TermHint term={qualification.s_level}>{qualification.s_level}</TermHint></span>
        </>
      )}
    </div>
  )
}

// ─── COGNITION SURFACE CARD ─────────────────────────────────────────
// Each surface is a compressed operational assessment, not a list panel

function CognitionSurfaceCard({ surface, expandable, active, onSelect, activeConditions, resolveDomain }) {
  const [expanded, setExpanded] = useState(false)
  const icon = SURFACE_ICON[surface.surface_id] || '◆'
  const sevColor = SEVERITY_COLOR[surface.severity] || '#7a8aaa'

  const relatedConditions = useMemo(() => {
    if (!activeConditions || !activeConditions.length) return []
    const condTypes = SURFACE_CONDITION_MAP[surface.surface_id] || []
    return activeConditions.filter(c => condTypes.includes(c.condition_type))
  }, [surface.surface_id, activeConditions])

  return (
    <div
      className={`sw-intel-surface${active ? ' sw-intel-surface--active' : ''}`}
      data-severity={surface.severity}
      data-surface={surface.surface_id}
      onClick={onSelect ? () => onSelect(surface.surface_id) : undefined}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(surface.surface_id) } } : undefined}
    >
      {relatedConditions.length > 0 && (
        <div className="sw-intel-surface-condition-link">
          {relatedConditions.map(c => (
            <span key={c.condition_id} className="sw-intel-condition-tag" data-severity={c.severity}>
              {c.operator_cognition_title}
            </span>
          ))}
        </div>
      )}
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
            <CognitionSurfaceDetail surface={surface} resolveDomain={resolveDomain} />
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

function CognitionSurfaceDetail({ surface, resolveDomain }) {
  const c = surface.constituents
  if (!c) return null

  if (surface.surface_id === 'DELIVERY_FRAGILITY' && Array.isArray(c)) {
    return (
      <div className="sw-intel-surface-detail">
        {c.map(item => (
          <div key={item.domain} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{resolveDomain ? resolveDomain(item.domain) : item.domain}</span>
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

  if (surface.surface_id === 'STRUCTURAL_FRAGILITY' && c.top_hotspots) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">hotspots</span>
          <span className="sw-intel-surface-detail-value">{c.hotspot_count} files · peak {c.peak_fragility}% · mean {c.mean_fragility}%</span>
        </div>
        {c.low_cohesion_modules > 0 && (
          <div className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">low cohesion</span>
            <span className="sw-intel-surface-detail-value">{c.low_cohesion_modules} module{c.low_cohesion_modules !== 1 ? 's' : ''}</span>
          </div>
        )}
        {c.absorptive_modules > 0 && (
          <div className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">absorptive</span>
            <span className="sw-intel-surface-detail-value">{c.absorptive_modules} module{c.absorptive_modules !== 1 ? 's' : ''}</span>
          </div>
        )}
        {c.top_hotspots.map(h => (
          <div key={h.file} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{h.file}</span>
            <span className="sw-intel-surface-detail-value">
              {h.score}% fragility
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (surface.surface_id === 'BOUNDARY_ALIGNMENT' && c.top_divergent) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">divergence</span>
          <span className="sw-intel-surface-detail-value">{c.divergent_count} module{c.divergent_count !== 1 ? 's' : ''} · system index {c.system_divergence_index}%</span>
        </div>
        {c.orphaned_count > 0 && (
          <div className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">orphaned</span>
            <span className="sw-intel-surface-detail-value">{c.orphaned_count} module{c.orphaned_count !== 1 ? 's' : ''}</span>
          </div>
        )}
        {c.top_divergent.map(d => (
          <div key={d.module} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{d.module}</span>
            <span className="sw-intel-surface-detail-value">
              {d.cross_boundary_ratio}% cross-boundary{d.edge_count > 0 ? ` · ${d.edge_count} edges` : ''}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (surface.surface_id === 'STRUCTURAL_COUPLING' && c.clusters) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">clusters</span>
          <span className="sw-intel-surface-detail-value">{c.cluster_count} binding {c.total_modules_in_clusters} module{c.total_modules_in_clusters !== 1 ? 's' : ''}</span>
        </div>
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">coupling</span>
          <span className="sw-intel-surface-detail-value">{c.bidirectional_pairs} bidirectional pair{c.bidirectional_pairs !== 1 ? 's' : ''} · index {c.system_coupling_index}%</span>
        </div>
        {c.clusters.map((cl, i) => (
          <div key={i} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">cluster {i + 1} ({cl.size})</span>
            <span className="sw-intel-surface-detail-value">
              {cl.modules.join(', ')}
            </span>
          </div>
        ))}
      </div>
    )
  }

  if (surface.surface_id === 'REINFORCEMENT_FLOWS' && c.top_flows) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">relationships</span>
          <span className="sw-intel-surface-detail-value">{c.reinforcement_count} reinforcement · {c.co_presence_pairs} co-presence</span>
        </div>
        {c.top_flows.map((f, i) => (
          <div key={i} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{f.from_type_label || f.from_type}</span>
            <span className="sw-intel-surface-detail-value">{f.verb} {f.to_type_label || f.to_type}{f.domain ? ` in ${resolveDomain ? resolveDomain(f.domain) : f.domain}` : ''}</span>
          </div>
        ))}
      </div>
    )
  }

  if (surface.surface_id === 'CONVERGENCE_PATTERNS' && c.convergence_domains) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">convergences</span>
          <span className="sw-intel-surface-detail-value">{c.convergence_count} domain{c.convergence_count !== 1 ? 's' : ''} · peak {c.peak_condition_count} conditions</span>
        </div>
        {c.convergence_domains.map(d => (
          <div key={d.domain} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{d.domain}</span>
            <span className="sw-intel-surface-detail-value">{d.condition_count} condition{d.condition_count !== 1 ? 's' : ''}: {d.condition_types.join(', ')}</span>
          </div>
        ))}
      </div>
    )
  }

  if (surface.surface_id === 'ABSENCE_PROFILE' && c.absent_types) {
    return (
      <div className="sw-intel-surface-detail">
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">health ratio</span>
          <span className="sw-intel-surface-detail-value">{c.health_ratio}% of condition types nominal</span>
        </div>
        <div className="sw-intel-surface-detail-row">
          <span className="sw-intel-surface-detail-label">active</span>
          <span className="sw-intel-surface-detail-value">{c.active_count} condition type{c.active_count !== 1 ? 's' : ''} firing</span>
        </div>
        {c.absent_types.map(t => (
          <div key={t.type} className="sw-intel-surface-detail-row">
            <span className="sw-intel-surface-detail-label">{t.label}</span>
            <span className="sw-intel-surface-detail-value" style={{ color: '#64ffda' }}>{t.reason}</span>
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
              <span className="sw-intel-surface-chain-domain">{resolveDomain ? resolveDomain(node.domain) : node.domain}</span>
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

export function SoftwareIntelligenceDenseView({ projection, onDeactivate, activeSurface, onSurfaceSelect, activeConditions, domainLabelMap }) {
  const resolveDomain = (id) => (domainLabelMap && domainLabelMap[id]) || id
  const surfaces = projection.surfaces || []

  return (
    <div className="sw-intel-view sw-intel-view--dense">
      <div className="sw-intel-view-header">
        <span className="sw-intel-view-module-tag">SW-INTEL</span>
        <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
        <button className="sw-intel-deactivate-btn" onClick={onDeactivate} type="button">✕</button>
      </div>
      <PeakSeverityStrip surfaces={surfaces} />

      <div className="sw-intel-surfaces">
        {surfaces.map(s => (
          <CognitionSurfaceCard key={s.surface_id} surface={s} expandable={true} active={activeSurface === s.surface_id} onSelect={onSurfaceSelect} activeConditions={activeConditions} resolveDomain={resolveDomain} />
        ))}
      </div>

      <CognitionEvidenceFooter surfaces={surfaces} />
    </div>
  )
}

const VERIFICATION_BADGE_LABEL = { VERIFIED: 'Verified', PARTIALLY_VERIFIED: 'Partial', VERIFICATION_FAILED: 'Failed', CANNOT_INVESTIGATE: 'No target' }

export function SoftwareIntelligenceOperatorView({ projection, onDeactivate, activeSurface, onSurfaceSelect, verificationState, verificationTargetReady, onVerificationInvoke, onVerificationReopen }) {
  const surfaces = projection.surfaces || []
  const hasResult = verificationState && verificationState.result

  return (
    <div className="sw-intel-view sw-intel-view--operator">
      <div className="sw-intel-view-header">
        <span className="sw-intel-view-module-tag">SW-INTEL</span>
        <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
        {hasResult && (
          <button className="sw-intel-verification-badge" data-verdict={verificationState.result.verdict} onClick={onVerificationReopen} type="button" title="Reopen verification corridor">
            <span className="sw-intel-verification-dot" />
            {VERIFICATION_BADGE_LABEL[verificationState.result.verdict] || verificationState.result.verdict}
          </button>
        )}
        {onVerificationInvoke && (
          <button className="sw-intel-verify-btn" onClick={onVerificationInvoke} disabled={!verificationTargetReady} type="button" title={verificationTargetReady ? 'Run verification protocol' : 'No verification target'}>
            VERIFY
          </button>
        )}
        <button className="sw-intel-deactivate-btn" onClick={onDeactivate} type="button">✕</button>
      </div>
      <PeakSeverityStrip surfaces={surfaces} />

      <div className="sw-intel-surfaces">
        {surfaces.map(s => (
          <CognitionSurfaceCard key={s.surface_id} surface={s} expandable={true} active={activeSurface === s.surface_id} onSelect={onSurfaceSelect} />
        ))}
      </div>

      <CognitionEvidenceFooter surfaces={surfaces} />
    </div>
  )
}

const CONFIDENCE_LABEL = { GOVERNED: 'Governed', ADVISORY_BOUND: 'Advisory', STRUCTURAL_ONLY: 'Structural' }
const SCOPE_LABEL = { LOCAL: 'Local', REGIONAL: 'Regional', SYSTEMIC: 'Systemic' }

function ConsequencePostureStrip({ posture }) {
  if (!posture) return null

  return (
    <div className="sw-intel-consequence-posture">
      <div className="sw-intel-consequence-posture-header">
        <span className="sw-intel-consequence-posture-label">{posture.posture_label}</span>
        <span className="sw-intel-consequence-posture-severity" style={{ color: SEVERITY_COLOR[posture.posture_severity] || '#7a8aaa' }}>{posture.posture_severity}</span>
        <span className="sw-intel-consequence-posture-scope" data-scope={posture.posture_scope}>{SCOPE_LABEL[posture.posture_scope] || posture.posture_scope}</span>
      </div>
      <div className="sw-intel-consequence-posture-primary">
        <span className="sw-intel-consequence-chip" data-severity={posture.primary.severity}>
          <span className="sw-intel-consequence-chip-title">{posture.primary.title}</span>
          <span className="sw-intel-consequence-chip-meta">
            <span style={{ color: SEVERITY_COLOR[posture.primary.severity] || '#7a8aaa' }}>{posture.primary.severity}</span>
            <span className="sw-intel-consequence-chip-confidence"><TermHint term={CONFIDENCE_LABEL[posture.primary.confidence] || posture.primary.confidence}>{CONFIDENCE_LABEL[posture.primary.confidence] || posture.primary.confidence}</TermHint></span>
            <span className="sw-intel-consequence-chip-locus">{posture.primary.locus}</span>
          </span>
        </span>
      </div>
      {posture.secondary.length > 0 && (
        <div className="sw-intel-consequence-posture-secondary">
          {posture.secondary.map((c, i) => (
            <span key={i} className="sw-intel-consequence-chip-compact" data-severity={c.severity}>
              <span className="sw-intel-consequence-chip-title">{c.title}</span>
              <span style={{ color: SEVERITY_COLOR[c.severity] || '#7a8aaa' }}>{c.severity}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export { SoftwareIntelligenceModuleToggle }
export default SoftwareIntelligenceDenseView
