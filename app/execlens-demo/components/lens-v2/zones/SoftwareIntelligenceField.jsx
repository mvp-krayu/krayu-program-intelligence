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

function SoftwareIntelligenceAttentionPanel({ signals }) {
  if (!signals || signals.length === 0) return null
  return (
    <div className="sw-intel-panel sw-intel-panel--attention">
      <div className="sw-intel-panel-header">
        <span className="sw-intel-panel-title">Operational Attention</span>
        <span className="sw-intel-panel-count">{signals.length} signal{signals.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="sw-intel-attention-list">
        {signals.map(sig => (
          <div key={sig.signal_id} className="sw-intel-attention-item" data-severity={sig.severity}>
            <div className="sw-intel-attention-header">
              <span className="sw-intel-attention-severity" style={{ color: SEVERITY_COLOR[sig.severity] || '#7a8aaa' }}>
                {sig.severity}
              </span>
              <span className="sw-intel-attention-name">{sig.signal_name}</span>
            </div>
            <div className="sw-intel-attention-statement">{sig.operational_attention}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SoftwareIntelligencePressurePanel({ interpretations }) {
  if (!interpretations || interpretations.length === 0) return null
  return (
    <div className="sw-intel-panel sw-intel-panel--pressure">
      <div className="sw-intel-panel-header">
        <span className="sw-intel-panel-title">Execution Pressure</span>
        <span className="sw-intel-panel-count">{interpretations.length} active</span>
      </div>
      <div className="sw-intel-pressure-list">
        {interpretations.map(p => (
          <div key={p.signal_id} className="sw-intel-pressure-item" data-severity={p.severity}>
            <div className="sw-intel-pressure-row">
              <span className="sw-intel-pressure-type">
                {p.operational_type}
              </span>
              <span className="sw-intel-pressure-severity" style={{ color: SEVERITY_COLOR[p.severity] || '#7a8aaa' }}>
                {p.severity}
              </span>
            </div>
            {p.operational_statement && (
              <div className="sw-intel-pressure-statement">{p.operational_statement}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function SoftwareIntelligenceExecutionCorridorPanel({ corridors }) {
  if (!corridors || corridors.length === 0) return null
  const roleOrder = { ORIGIN: 0, PASS_THROUGH: 1, RECEIVER: 2 }
  const sorted = [...corridors].sort((a, b) => (roleOrder[a.role] ?? 9) - (roleOrder[b.role] ?? 9))

  return (
    <div className="sw-intel-panel sw-intel-panel--corridors">
      <div className="sw-intel-panel-header">
        <span className="sw-intel-panel-title">Execution Corridors</span>
      </div>
      <div className="sw-intel-corridor-flow">
        {sorted.map((c, i) => (
          <div key={c.domain} className="sw-intel-corridor-node" data-role={c.role}>
            {i > 0 && <div className="sw-intel-corridor-arrow">→</div>}
            <div className="sw-intel-corridor-card">
              <div className="sw-intel-corridor-role">{c.role.replace(/_/g, ' ')}</div>
              <div className="sw-intel-corridor-domain">{c.domain}</div>
              <div className="sw-intel-corridor-desc">{c.operational_description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SoftwareIntelligenceCoordinationSpinePanel({ spines }) {
  if (!spines || spines.length === 0) return null
  return (
    <div className="sw-intel-panel sw-intel-panel--spines">
      <div className="sw-intel-panel-header">
        <span className="sw-intel-panel-title">Coordination Spine</span>
        <span className="sw-intel-panel-count">{spines.length} nodes</span>
      </div>
      <div className="sw-intel-spine-list">
        {spines.map(spine => (
          <div key={spine.path} className="sw-intel-spine-item">
            <div className="sw-intel-spine-rank">#{spine.centrality_rank}</div>
            <div className="sw-intel-spine-body">
              <div className="sw-intel-spine-path" title={spine.path}>
                {spine.path.split('/').slice(-2).join('/')}
              </div>
              <div className="sw-intel-spine-role">
                <span className="sw-intel-spine-role-tag" data-role={spine.structural_role}>
                  {spine.operational_role}
                </span>
              </div>
              <div className="sw-intel-spine-metrics">
                <span>in: {spine.in_degree}</span>
                <span>out: {spine.out_degree}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SoftwareIntelligenceDeploymentRiskPanel({ risk }) {
  if (!risk) return null
  return (
    <div className="sw-intel-panel sw-intel-panel--risk" data-risk={risk.risk_level}>
      <div className="sw-intel-panel-header">
        <span className="sw-intel-panel-title">Deployment Risk</span>
        <span className="sw-intel-risk-level" data-level={risk.risk_level}>{risk.risk_level}</span>
      </div>
      <div className="sw-intel-risk-statement">{risk.operational_statement}</div>
      <div className="sw-intel-risk-detail">
        <span>{risk.activated_signal_count} pressure signal{risk.activated_signal_count !== 1 ? 's' : ''} active</span>
        {risk.pressure_zone && <span> · zone: {risk.pressure_zone}</span>}
      </div>
    </div>
  )
}

function SoftwareIntelligenceTopologyRolesPanel({ roles }) {
  if (!roles || Object.keys(roles).length === 0) return null
  const entries = Object.entries(roles).sort((a, b) => b[1].count - a[1].count)
  const total = entries.reduce((sum, [, v]) => sum + v.count, 0)

  return (
    <div className="sw-intel-panel sw-intel-panel--topology-roles">
      <div className="sw-intel-panel-header">
        <span className="sw-intel-panel-title">Runtime Topology</span>
        <span className="sw-intel-panel-count">{total} files</span>
      </div>
      <div className="sw-intel-role-grid">
        {entries.map(([role, data]) => {
          const pct = total > 0 ? Math.round((data.count / total) * 100) : 0
          return (
            <div key={role} className="sw-intel-role-item">
              <div className="sw-intel-role-bar-row">
                <span className="sw-intel-role-name">{data.operational_name}</span>
                <span className="sw-intel-role-count">{data.count}</span>
              </div>
              <div className="sw-intel-role-bar">
                <div className="sw-intel-role-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SoftwareIntelligenceRoleAbstractionsPanel({ abstractions }) {
  const [expanded, setExpanded] = useState(false)
  if (!abstractions || abstractions.length === 0) return null

  const zoneAnchors = abstractions.filter(a => a.operational_role.includes('anchor'))
  const backed = abstractions.filter(a => a.structural_backing === 'BACKED' && !a.operational_role.includes('anchor'))
  const semanticOnly = abstractions.filter(a => a.structural_backing === 'SEMANTIC_ONLY')

  return (
    <div className="sw-intel-panel sw-intel-panel--domains">
      <div className="sw-intel-panel-header">
        <span className="sw-intel-panel-title">Domain Roles</span>
        <span className="sw-intel-panel-count">{abstractions.length} domains</span>
      </div>
      <div className="sw-intel-domain-summary">
        {zoneAnchors.length > 0 && <span className="sw-intel-domain-chip sw-intel-domain-chip--anchor">{zoneAnchors.length} anchor</span>}
        <span className="sw-intel-domain-chip sw-intel-domain-chip--backed">{backed.length} backed</span>
        <span className="sw-intel-domain-chip sw-intel-domain-chip--semantic">{semanticOnly.length} semantic-only</span>
      </div>
      {(expanded ? abstractions : abstractions.slice(0, 6)).map(a => (
        <div key={a.domain_id} className="sw-intel-domain-row" data-backing={a.structural_backing}>
          <span className="sw-intel-domain-name">{a.domain_name}</span>
          <span className="sw-intel-domain-role">{a.operational_role}</span>
        </div>
      ))}
      {abstractions.length > 6 && (
        <button className="sw-intel-domain-toggle" onClick={() => setExpanded(p => !p)} type="button">
          {expanded ? '▴ collapse' : `▾ ${abstractions.length - 6} more domains`}
        </button>
      )}
    </div>
  )
}

function SoftwareIntelligenceEvidenceTrace({ projection }) {
  const totalTraces = [
    projection.role_abstractions.length,
    projection.pressure_interpretations.length,
    projection.execution_corridors.length,
    Object.keys(projection.topology_roles).length,
    projection.attention_signals.length,
    projection.coordination_spines.length,
    projection.deployment_risk ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="sw-intel-evidence-footer">
      <span className="sw-intel-evidence-count">{totalTraces} derivations</span>
      <span className="sw-intel-evidence-sep">·</span>
      <span className="sw-intel-evidence-note">structurally derived — no inference</span>
    </div>
  )
}

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

export function SoftwareIntelligenceDenseView({ projection, onDeactivate }) {
  return (
    <div className="sw-intel-view sw-intel-view--dense">
      <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
      <SoftwareIntelligenceRawPICoreFallback onDeactivate={onDeactivate} />

      <SoftwareIntelligenceDeploymentRiskPanel risk={projection.deployment_risk} />
      <SoftwareIntelligenceAttentionPanel signals={projection.attention_signals} />
      <SoftwareIntelligencePressurePanel interpretations={projection.pressure_interpretations} />
      <SoftwareIntelligenceExecutionCorridorPanel corridors={projection.execution_corridors} />
      <SoftwareIntelligenceCoordinationSpinePanel spines={projection.coordination_spines} />
      <SoftwareIntelligenceTopologyRolesPanel roles={projection.topology_roles} />

      <SoftwareIntelligenceEvidenceTrace projection={projection} />
    </div>
  )
}

export function SoftwareIntelligenceInvestigationView({ projection, onDeactivate }) {
  return (
    <div className="sw-intel-view sw-intel-view--investigation">
      <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
      <SoftwareIntelligenceRawPICoreFallback onDeactivate={onDeactivate} />

      <SoftwareIntelligenceDeploymentRiskPanel risk={projection.deployment_risk} />
      <SoftwareIntelligenceAttentionPanel signals={projection.attention_signals} />
      <SoftwareIntelligencePressurePanel interpretations={projection.pressure_interpretations} />
      <SoftwareIntelligenceExecutionCorridorPanel corridors={projection.execution_corridors} />
      <SoftwareIntelligenceCoordinationSpinePanel spines={projection.coordination_spines} />
      <SoftwareIntelligenceTopologyRolesPanel roles={projection.topology_roles} />
      <SoftwareIntelligenceRoleAbstractionsPanel abstractions={projection.role_abstractions} />

      <SoftwareIntelligenceEvidenceTrace projection={projection} />
    </div>
  )
}

export function SoftwareIntelligenceBoardroomSummary({ projection }) {
  const risk = projection.deployment_risk
  const attn = projection.attention_signals

  return (
    <div className="sw-intel-boardroom-summary">
      <div className="sw-intel-boardroom-header">
        <span className="sw-intel-boardroom-module-tag">SW-INTEL</span>
        <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
      </div>
      {risk && (
        <div className="sw-intel-boardroom-risk" data-level={risk.risk_level}>
          <span className="sw-intel-boardroom-risk-label">Deployment Risk</span>
          <span className="sw-intel-boardroom-risk-level">{risk.risk_level}</span>
          <div className="sw-intel-boardroom-risk-desc">{risk.operational_statement}</div>
        </div>
      )}
      {attn && attn.length > 0 && (
        <div className="sw-intel-boardroom-attention">
          {attn.slice(0, 3).map(sig => (
            <div key={sig.signal_id} className="sw-intel-boardroom-attention-item" data-severity={sig.severity}>
              <span className="sw-intel-boardroom-attention-sev">{sig.severity}</span>
              <span className="sw-intel-boardroom-attention-desc">{sig.operational_attention}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SoftwareIntelligenceBalancedNarrative({ projection }) {
  const risk = projection.deployment_risk
  const attn = projection.attention_signals
  const corridors = projection.execution_corridors

  return (
    <div className="sw-intel-balanced-narrative">
      <div className="sw-intel-balanced-header">
        <span className="sw-intel-balanced-module-tag">SW-INTEL</span>
        <QualificationContextStrip decomposition={projection.qualification_decomposition} qualification={projection.qualification_cognition} />
      </div>
      {risk && (
        <div className="sw-intel-balanced-section">
          <div className="sw-intel-balanced-section-title">Deployment Risk</div>
          <div className="sw-intel-balanced-section-body">{risk.operational_statement}</div>
        </div>
      )}
      {corridors && corridors.length > 0 && (
        <div className="sw-intel-balanced-section">
          <div className="sw-intel-balanced-section-title">Execution Corridors</div>
          {corridors.map(c => (
            <div key={c.domain} className="sw-intel-balanced-corridor">
              <span className="sw-intel-balanced-corridor-role">{c.role.replace(/_/g, ' ')}</span>
              <span className="sw-intel-balanced-corridor-desc">{c.operational_description}</span>
            </div>
          ))}
        </div>
      )}
      {attn && attn.length > 0 && (
        <div className="sw-intel-balanced-section">
          <div className="sw-intel-balanced-section-title">Operational Attention</div>
          {attn.slice(0, 3).map(sig => (
            <div key={sig.signal_id} className="sw-intel-balanced-attention" data-severity={sig.severity}>
              {sig.operational_attention}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { SoftwareIntelligenceModuleToggle }
export default SoftwareIntelligenceDenseView
