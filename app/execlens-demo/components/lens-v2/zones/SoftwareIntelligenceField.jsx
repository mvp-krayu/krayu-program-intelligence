import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { deriveOrchestrationActions, mergeWithConditionActions } from '../../../lib/lens-v2/LensSQOOrchestrationAdapter'

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

const ACTION_MODE = {
  INLINE_EXPLAIN: 'INLINE_EXPLAIN',
  INLINE_REVIEW: 'INLINE_REVIEW',
  STAGED_ACTION: 'STAGED_ACTION',
  SQO_EXECUTION: 'SQO_EXECUTION',
}

const ACTION_MODE_LABEL = {
  INLINE_EXPLAIN: 'Explain',
  INLINE_REVIEW: 'Review',
  STAGED_ACTION: 'Stage',
  SQO_EXECUTION: 'Execute',
}

const ACTION_STATUS_LABEL = {
  available: 'available',
  staged: 'staged',
  pending_rerun: 'pending rerun',
  completed: 'completed',
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

function deriveGuidedActions(projection, fullReport) {
  const actions = []
  const decomp = projection.qualification_decomposition
  if (!decomp) return actions

  const { guidance, structural_richness: sr, governance_depth: gd, reconciliation_authority: ra } = decomp
  const pc = (fullReport && fullReport.proposition_corpus) || {}
  const ri = (fullReport && fullReport.revalidation_intelligence) || {}
  const domains = (fullReport && fullReport.semantic_domain_registry) || []

  const corridors = projection.execution_corridors || []
  const suspectReceivers = corridors.filter(c => {
    if (c.role !== 'RECEIVER') return false
    const d = (c.domain || '').toLowerCase()
    return d.includes('.env') || d.includes('example') || d.includes('config.') || d.includes('readme') || d.includes('license')
  })
  if (suspectReceivers.length > 0) {
    actions.push({
      id: 'receiver-classification',
      title: 'Non-operational receiver detected',
      target: suspectReceivers.map(r => r.domain).join(', '),
      meaning: 'Configuration or documentation artifact classified as execution corridor receiver. This contaminates Software Intelligence corridor interpretation and must be classified.',
      actionMode: ACTION_MODE.INLINE_REVIEW,
      priority: 'HIGH',
      evidenceItems: [
        ...suspectReceivers.map(r => ({ label: 'Receiver', value: r.domain, type: 'warn' })),
        { label: 'Source', value: 'Execution corridor derivation' },
      ],
      workflow: [
        'Review source signal and corridor assignment',
        'Inspect structural entity path',
        'Classify receiver role',
        'Stage SQO classification proposition',
        'Persist through governance mechanism',
        'Return to LENS — re-evaluate corridor interpretation',
      ],
      decisions: [
        { label: 'Non-operational artifact', value: 'non_operational' },
        { label: 'Valid operational receiver', value: 'valid' },
        { label: 'Requires investigation', value: 'investigate' },
      ],
    })
  }

  if (guidance.some(g => g.axis === 'RECONCILIATION_AUTHORITY') && ra) {
    const unreconciled = ra.total_domains - ra.reconciled_count
    const unreconciledDomains = domains.filter(d => !d.reconciliation_matched)
    actions.push({
      id: 'domain-reconciliation',
      title: `Reconcile ${unreconciled} domain${unreconciled !== 1 ? 's' : ''}`,
      target: `${ra.reconciled_count} of ${ra.total_domains} reconciled · ${ra.weighted_confidence}% confidence · ${ra.q_class_display}`,
      meaning: 'Unreconciled semantic domains lack structural backing confirmation. This limits qualification authority and deployment confidence. Reconciliation advances Q-class.',
      actionMode: ACTION_MODE.STAGED_ACTION,
      priority: unreconciled > ra.total_domains * 0.5 ? 'HIGH' : 'MEDIUM',
      evidenceItems: [
        { label: 'Reconciled', value: `${ra.reconciled_count} of ${ra.total_domains}`, type: ra.reconciled_count > 0 ? 'ok' : 'warn' },
        { label: 'Confidence', value: `${ra.weighted_confidence}%` },
        { label: 'Q-class', value: ra.q_class_display },
        ...unreconciledDomains.slice(0, 6).map(d => ({
          label: 'Unreconciled', value: d.domain_name || d.domain_id, type: 'dim',
        })),
        ...(unreconciledDomains.length > 6 ? [{ label: '', value: `+${unreconciledDomains.length - 6} more`, type: 'dim' }] : []),
      ],
      workflow: [
        'Review unreconciled domain candidates with structural backing',
        'Confirm or reject structural correspondence for each domain',
        'Stage reconciliation decisions',
        'Record through SQO governance pathway',
        'Update reconciliation authority and Q-class',
        'Return to LENS with updated qualification posture',
      ],
    })
  }

  if (pc.available !== false && pc.flagged_count > 0) {
    actions.push({
      id: 'proposition-review',
      title: `Review ${pc.flagged_count} flagged proposition${pc.flagged_count !== 1 ? 's' : ''}`,
      target: `${pc.accepted_count || 0} accepted · ${pc.rejected_count || 0} rejected · ${pc.total_count || 0} total`,
      meaning: 'Flagged propositions are governed structural assertions requiring operator disposition. Qualification cannot progress until flagged propositions are resolved.',
      actionMode: ACTION_MODE.INLINE_REVIEW,
      priority: 'HIGH',
      evidenceItems: [
        { label: 'Total propositions', value: String(pc.total_count || 0) },
        { label: 'Accepted', value: String(pc.accepted_count || 0), type: 'ok' },
        { label: 'Flagged', value: String(pc.flagged_count || 0), type: 'warn' },
        ...(pc.rejected_count > 0 ? [{ label: 'Rejected', value: String(pc.rejected_count), type: 'warn' }] : []),
      ],
      workflow: [
        'Review each flagged proposition assertion',
        'Assess structural evidence supporting the proposition',
        'Accept, reject, or defer each proposition',
        'Record disposition through governance lifecycle',
        'Update governance authority depth',
        'Return to LENS with updated qualification posture',
      ],
    })
  }

  const missingSubstrates = (sr.substrates || []).filter(s => !s.present)
  if (missingSubstrates.length > 0) {
    actions.push({
      id: 'enrichment-assessment',
      title: `${missingSubstrates.length} substrate${missingSubstrates.length !== 1 ? 's' : ''} unavailable`,
      target: missingSubstrates.map(s => s.name).join(', '),
      meaning: 'Missing structural substrates limit SW-Intel operational depth. Enrichment run can restore file-level structural intelligence.',
      actionMode: ACTION_MODE.STAGED_ACTION,
      priority: 'MEDIUM',
      evidenceItems: (sr.substrates || []).map(s => ({
        label: s.present ? 'Present' : 'Missing',
        value: s.name,
        detail: s.present ? s.detail : '',
        type: s.present ? 'ok' : 'warn',
      })),
      workflow: [
        'Assess enrichment pipeline availability for this specimen',
        'Identify required substrate sources (code graph, centrality)',
        'Confirm enrichment scope and expected output',
        'Stage enrichment run through pipeline orchestrator',
        'Ingest enriched evidence into substrate',
        'Return to LENS — re-evaluate SW-Intel projection',
      ],
    })
  }

  if (gd.level === 'NONE') {
    const missingArtifacts = (gd.artifacts || []).filter(a => !a.present)
    actions.push({
      id: 'governance-lifecycle',
      title: 'No governance lifecycle exercised',
      target: `0 of ${(gd.artifacts || []).length} governance artifacts present`,
      meaning: 'Without governance lifecycle artifacts, qualification authority cannot be established. The SQO governance lifecycle must be initiated and exercised.',
      actionMode: ACTION_MODE.INLINE_EXPLAIN,
      priority: 'MEDIUM',
      evidenceItems: missingArtifacts.map(a => ({
        label: 'Missing', value: a.name, type: 'dim',
      })),
      workflow: [
        'Initiate governance lifecycle through SQO qualification',
        'Exercise proposition derivation and review',
        'Exercise revalidation checkpoint',
        'Governance artifacts appear as lifecycle progresses',
        'Return to LENS — qualification posture updates automatically',
      ],
    })
  }

  if (ri.available && ri.failed > 0) {
    actions.push({
      id: 'revalidation-failure',
      title: `Revalidation: ${ri.failed} check${ri.failed !== 1 ? 's' : ''} failed`,
      target: `${ri.passed || 0} of ${ri.total_checks || 0} passed`,
      meaning: 'Substrate does not replay cleanly under structural rigor. Failed checks indicate structural drift or evidence degradation.',
      actionMode: ACTION_MODE.INLINE_REVIEW,
      priority: 'HIGH',
      evidenceItems: [
        { label: 'Total checks', value: String(ri.total_checks || 0) },
        { label: 'Passed', value: String(ri.passed || 0), type: 'ok' },
        { label: 'Failed', value: String(ri.failed || 0), type: 'warn' },
      ],
      workflow: [
        'Review failed revalidation checks',
        'Identify structural drift evidence',
        'Determine if re-enrichment or re-derivation is needed',
        'Stage corrective action through governance pathway',
        'Re-run revalidation after correction',
        'Return to LENS with updated revalidation state',
      ],
    })
  }

  const qual = projection.qualification_cognition
  if (qual) {
    actions.push({
      id: 'qualification-assessment',
      title: `${qual.s_level} qualification assessment`,
      target: qual.promotion_eligible ? 'Advancement eligible' : 'Gate review required',
      meaning: qual.promotion_eligible
        ? 'This specimen meets advancement prerequisites. Operator authorization required for promotion.'
        : 'Current qualification level determines operational authority ceiling. Address HIGH-priority actions to unlock progression.',
      actionMode: qual.promotion_eligible ? ACTION_MODE.STAGED_ACTION : ACTION_MODE.INLINE_EXPLAIN,
      priority: qual.promotion_eligible ? 'MEDIUM' : 'LOW',
      evidenceItems: [
        { label: 'Current level', value: qual.s_level },
        { label: 'Advancement', value: qual.promotion_eligible ? 'Eligible' : 'Not eligible', type: qual.promotion_eligible ? 'ok' : 'dim' },
        { label: 'Reconciliation', value: ra ? `${ra.reconciled_count}/${ra.total_domains}` : 'N/A' },
        { label: 'Governance depth', value: gd.level, type: gd.level === 'FULL' ? 'ok' : gd.level === 'NONE' ? 'warn' : 'dim' },
      ],
      workflow: qual.promotion_eligible
        ? [
            'Review qualification gate requirements',
            'Confirm all prerequisites met',
            'Stage advancement request',
            'Record promotion through SQO authority',
            'Return to LENS with updated qualification level',
          ]
        : [
            'Review current qualification gate requirements',
            'Identify blocking conditions for advancement',
            'Address HIGH-priority guided actions first',
            'Re-assess qualification after actions complete',
          ],
    })
  }

  return actions.sort((a, b) => {
    const order = { HIGH: 0, MEDIUM: 1, LOW: 2 }
    return (order[a.priority] ?? 3) - (order[b.priority] ?? 3)
  })
}

function GuidedActionCard({ action, onStage, sqoBinding, onPostAction }) {
  const [expanded, setExpanded] = useState(false)
  const [localStatus, setLocalStatus] = useState('available')
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState(null)
  const [justificationText, setJustificationText] = useState('')
  const [selectedTarget, setSelectedTarget] = useState(null)

  const isSqoAction = !!action.executionPath
  const hasTargets = action.sqoTargets && action.sqoTargets.length > 0
  const hasDecisions = action.decisions && action.decisions.length > 0
  const primarySqoAction = action.sqoActions && action.sqoActions[0]
  const needsJustification = action.requiresJustification && primarySqoAction && action.requiresJustification[primarySqoAction]

  const handleDecision = useCallback((value) => {
    setLocalStatus('staged')
    if (onStage) onStage(action.id, value)
  }, [action.id, onStage])

  const handleStage = useCallback(() => {
    setLocalStatus('staged')
    if (onStage) onStage(action.id, 'stage')
  }, [action.id, onStage])

  const handleSqoExecute = useCallback(async (sqoAction, targetId) => {
    if (!sqoBinding || executing) return
    setExecuting(true)
    setExecutionResult(null)
    try {
      const payload = {
        action: sqoAction,
        client: sqoBinding.client,
        runId: sqoBinding.runId,
        actor_id: 'operator:lens_operator',
      }
      if (targetId) payload.target_item = targetId
      if (justificationText.trim()) payload.justification = justificationText.trim()

      const res = await fetch(action.executionPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const result = await res.json()
      setExecutionResult(result)
      if (result.success) {
        setLocalStatus('completed')
        setTimeout(() => { if (onPostAction) onPostAction() }, 800)
      }
    } catch (err) {
      setExecutionResult({ success: false, error: 'NETWORK_ERROR', detail: err.message })
    } finally {
      setExecuting(false)
    }
  }, [sqoBinding, executing, justificationText, action.executionPath, onPostAction])

  const status = localStatus

  return (
    <div className="sw-intel-guided-action" data-priority={action.priority} data-status={status} data-mode={action.actionMode}>
      <button
        className="sw-intel-guided-action-header"
        onClick={() => setExpanded(p => !p)}
        type="button"
        aria-expanded={expanded}
      >
        <span className="sw-intel-guided-action-dot" data-priority={action.priority} />
        <div className="sw-intel-guided-action-titles">
          <span className="sw-intel-guided-action-title">{action.title}</span>
          <span className="sw-intel-guided-action-target">{action.target}</span>
        </div>
        <span className="sw-intel-guided-action-mode">{ACTION_MODE_LABEL[action.actionMode] || action.actionMode}</span>
        <span className="sw-intel-guided-action-status" data-status={status}>{ACTION_STATUS_LABEL[status] || status}</span>
        <span className="sw-intel-guided-action-caret">{expanded ? '▴' : '▾'}</span>
      </button>

      {expanded && (
        <div className="sw-intel-guided-action-body">
          <div className="sw-intel-guided-action-meaning">{action.meaning}</div>

          <div className="sw-intel-guided-action-evidence">
            <div className="sw-intel-guided-action-section-label">Evidence</div>
            <div className="sw-intel-guided-action-evidence-grid">
              {action.evidenceItems.map((item, i) => (
                <div key={i} className="sw-intel-guided-action-evidence-row" data-type={item.type || ''}>
                  <span className="sw-intel-guided-action-evidence-key">{item.label}</span>
                  <span className="sw-intel-guided-action-evidence-val">{item.value}</span>
                  {item.detail && <span className="sw-intel-guided-action-evidence-detail">{item.detail}</span>}
                </div>
              ))}
            </div>
          </div>

          {action.learningContext && (
            <div className="sw-intel-guided-action-learning" data-type={action.learningContext.type}>
              <div className="sw-intel-guided-action-section-label">Learned from event history</div>
              <div className="sw-intel-guided-action-learning-summary">{action.learningContext.summary}</div>
              {action.learningContext.type === 'review_history' && (
                <div className="sw-intel-guided-action-learning-detail">
                  <span data-type="ok">{action.learningContext.accept_rate}% accepted</span>
                  <span data-type="warn">{action.learningContext.reject_rate}% rejected</span>
                  <span data-type="dim">{action.learningContext.contest_rate}% contested</span>
                </div>
              )}
            </div>
          )}

          <div className="sw-intel-guided-action-workflow">
            <div className="sw-intel-guided-action-section-label">Guided workflow</div>
            <ol className="sw-intel-guided-action-steps">
              {action.workflow.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {isSqoAction && status === 'available' && (
            <div className="sw-intel-guided-action-sqo-exec">
              {hasTargets && (
                <div className="sw-intel-sqo-targets">
                  <div className="sw-intel-guided-action-section-label">Obligations</div>
                  {action.sqoTargets.map(t => (
                    <div key={t.id} className={`sw-intel-sqo-target${selectedTarget === t.id ? ' sw-intel-sqo-target--selected' : ''}`}>
                      <button
                        className="sw-intel-sqo-target-select"
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelectedTarget(selectedTarget === t.id ? null : t.id) }}
                      >
                        <span className="sw-intel-sqo-target-label">{t.label}</span>
                        <span className="sw-intel-sqo-target-status">{t.status}</span>
                      </button>
                      {selectedTarget === t.id && t.affordances && (
                        <div className="sw-intel-sqo-target-actions">
                          {t.affordances.actions.map(a => (
                            <button
                              key={a}
                              className="sw-intel-sqo-exec-btn"
                              data-action={a}
                              type="button"
                              disabled={executing}
                              onClick={(e) => { e.stopPropagation(); handleSqoExecute(a, t.id) }}
                            >
                              {a.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      )}
                      {t.propositions && t.propositions.length > 0 && selectedTarget === t.id && (
                        <div className="sw-intel-sqo-target-props">
                          {t.propositions.map(p => (
                            <div key={p.id} className="sw-intel-sqo-prop">
                              <span className="sw-intel-sqo-prop-text">{p.proposition}</span>
                              <span className="sw-intel-sqo-prop-conf">{p.confidence != null ? `${Math.round(p.confidence * 100)}%` : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!hasTargets && action.sqoActions && action.sqoActions.length > 0 && (
                <div className="sw-intel-sqo-confirm">
                  {action.sqoActions.map(a => {
                    const needsJust = action.requiresJustification && action.requiresJustification[a]
                    return (
                      <button
                        key={a}
                        className="sw-intel-sqo-exec-btn sw-intel-sqo-exec-btn--primary"
                        type="button"
                        disabled={executing || (needsJust && !justificationText.trim())}
                        onClick={(e) => { e.stopPropagation(); handleSqoExecute(a) }}
                      >
                        {executing ? 'Executing...' : a.replace(/_/g, ' ')}
                      </button>
                    )
                  })}
                </div>
              )}
              {needsJustification && (
                <div className="sw-intel-sqo-justification">
                  <label className="sw-intel-guided-action-section-label">Justification (required)</label>
                  <textarea
                    className="sw-intel-sqo-justification-input"
                    value={justificationText}
                    onChange={(e) => setJustificationText(e.target.value)}
                    placeholder="Provide operational justification..."
                    rows={2}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
            </div>
          )}

          {!isSqoAction && hasDecisions && status === 'available' && (
            <div className="sw-intel-guided-action-decisions">
              <div className="sw-intel-guided-action-section-label">Operator classification</div>
              <div className="sw-intel-guided-action-decision-row">
                {action.decisions.map((d, i) => (
                  <button
                    key={i}
                    className="sw-intel-guided-action-decision-btn"
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDecision(d.value) }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {executionResult && (
            <div className={`sw-intel-sqo-result${executionResult.success ? ' sw-intel-sqo-result--ok' : ' sw-intel-sqo-result--error'}`}>
              {executionResult.success
                ? `Action executed — ${executionResult.event?.action || 'complete'}. Refreshing posture...`
                : `Execution failed: ${executionResult.error}${executionResult.detail ? ' — ' + executionResult.detail : ''}`
              }
            </div>
          )}

          {status === 'staged' && !isSqoAction && (
            <div className="sw-intel-guided-action-staged-notice">
              Decision staged — execution path pending orchestrator integration
            </div>
          )}

          <div className="sw-intel-guided-action-footer">
            {status === 'available' && !isSqoAction && !hasDecisions && action.actionMode !== ACTION_MODE.INLINE_EXPLAIN && (
              <button className="sw-intel-guided-action-stage-btn" type="button" onClick={(e) => { e.stopPropagation(); handleStage() }}>
                Stage action
              </button>
            )}
            <span className="sw-intel-guided-action-exec-path">
              {isSqoAction ? `Governed execution: ${action.executionPath}` : 'Execution path: condition-derived'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

function SoftwareIntelligenceGuidedActionFlow({ projection, fullReport, sqoAuthorityWorkspace, sqoBinding }) {
  const router = useRouter()
  const conditionActions = deriveGuidedActions(projection, fullReport)
  const sqoActions = deriveOrchestrationActions(sqoAuthorityWorkspace)
  const actions = sqoActions.length > 0
    ? mergeWithConditionActions(sqoActions, conditionActions)
    : conditionActions
  const [stagedActions, setStagedActions] = useState({})

  const handleStage = useCallback((actionId, value) => {
    setStagedActions(prev => ({ ...prev, [actionId]: value }))
  }, [])

  const handlePostAction = useCallback(() => {
    router.replace(router.asPath)
  }, [router])

  if (actions.length === 0) return null

  const criticalCount = actions.filter(a => a.priority === 'CRITICAL').length
  const highCount = actions.filter(a => a.priority === 'HIGH').length
  const sqoCount = actions.filter(a => !!a.executionPath).length

  return (
    <div className="sw-intel-guided-flow">
      <div className="sw-intel-guided-flow-header">
        <span className="sw-intel-guided-flow-title">Guided Actions</span>
        <span className="sw-intel-guided-flow-count">
          {actions.length} action{actions.length !== 1 ? 's' : ''}
          {criticalCount > 0 && <span className="sw-intel-guided-flow-high"> · {criticalCount} CRITICAL</span>}
          {highCount > 0 && <span className="sw-intel-guided-flow-high"> · {highCount} HIGH</span>}
          {sqoCount > 0 && <span className="sw-intel-guided-flow-sqo"> · {sqoCount} governed</span>}
        </span>
      </div>
      {sqoAuthorityWorkspace && sqoAuthorityWorkspace.available && (
        <div className="sw-intel-guided-flow-posture">
          <span className="sw-intel-guided-flow-posture-level">{sqoAuthorityWorkspace.authorityPosture.s_level}</span>
          <span className="sw-intel-guided-flow-posture-sep">·</span>
          <span className="sw-intel-guided-flow-posture-label">
            {sqoAuthorityWorkspace.promotionControl.blockers_remaining > 0
              ? `${sqoAuthorityWorkspace.promotionControl.blockers_remaining} blocker${sqoAuthorityWorkspace.promotionControl.blockers_remaining !== 1 ? 's' : ''} active`
              : sqoAuthorityWorkspace.promotionControl.can_request_advancement
                ? 'Advancement eligible'
                : sqoAuthorityWorkspace.promotionControl.decision_state
            }
          </span>
        </div>
      )}
      <div className="sw-intel-guided-flow-list">
        {actions.map(action => (
          <GuidedActionCard
            key={action.id}
            action={action}
            onStage={handleStage}
            sqoBinding={sqoBinding}
            onPostAction={handlePostAction}
          />
        ))}
      </div>
      {Object.keys(stagedActions).length > 0 && (
        <div className="sw-intel-guided-flow-staged-summary">
          {Object.keys(stagedActions).length} action{Object.keys(stagedActions).length !== 1 ? 's' : ''} staged
        </div>
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

export function SoftwareIntelligenceDenseView({ projection, onDeactivate, fullReport, sqoAuthorityWorkspace, sqoBinding }) {
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

      <SoftwareIntelligenceGuidedActionFlow projection={projection} fullReport={fullReport} sqoAuthorityWorkspace={sqoAuthorityWorkspace} sqoBinding={sqoBinding} />
      <SoftwareIntelligenceEvidenceTrace projection={projection} />
    </div>
  )
}

export function SoftwareIntelligenceInvestigationView({ projection, onDeactivate, fullReport, sqoAuthorityWorkspace, sqoBinding }) {
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

      <SoftwareIntelligenceGuidedActionFlow projection={projection} fullReport={fullReport} sqoAuthorityWorkspace={sqoAuthorityWorkspace} sqoBinding={sqoBinding} />
      <SoftwareIntelligenceEvidenceTrace projection={projection} />
    </div>
  )
}

export function SoftwareIntelligenceBoardroomSummary({ projection, fullReport, sqoAuthorityWorkspace, sqoBinding }) {
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
      <SoftwareIntelligenceGuidedActionFlow projection={projection} fullReport={fullReport} sqoAuthorityWorkspace={sqoAuthorityWorkspace} sqoBinding={sqoBinding} />
    </div>
  )
}

export function SoftwareIntelligenceBalancedNarrative({ projection, fullReport, sqoAuthorityWorkspace, sqoBinding }) {
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
      <SoftwareIntelligenceGuidedActionFlow projection={projection} fullReport={fullReport} sqoAuthorityWorkspace={sqoAuthorityWorkspace} sqoBinding={sqoBinding} />
    </div>
  )
}

export { SoftwareIntelligenceModuleToggle }
export default SoftwareIntelligenceDenseView
