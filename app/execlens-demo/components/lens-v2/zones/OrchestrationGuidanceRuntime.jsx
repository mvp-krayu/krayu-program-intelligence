import { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import { deriveOrchestrationActions, mergeWithConditionActions } from '../../../lib/lens-v2/LensSQOOrchestrationAdapter'

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

function deriveConditionActions(projection, fullReport) {
  const actions = []
  if (!projection) return actions
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
    <div className="orch-guided-action" data-priority={action.priority} data-status={status} data-mode={action.actionMode}>
      <button
        className="orch-guided-action-header"
        onClick={() => setExpanded(p => !p)}
        type="button"
        aria-expanded={expanded}
      >
        <span className="orch-guided-action-dot" data-priority={action.priority} />
        <div className="orch-guided-action-titles">
          <span className="orch-guided-action-title">{action.title}</span>
          <span className="orch-guided-action-target">{action.target}</span>
        </div>
        <span className="orch-guided-action-mode">{ACTION_MODE_LABEL[action.actionMode] || action.actionMode}</span>
        <span className="orch-guided-action-status" data-status={status}>{ACTION_STATUS_LABEL[status] || status}</span>
        <span className="orch-guided-action-caret">{expanded ? '▴' : '▾'}</span>
      </button>

      {expanded && (
        <div className="orch-guided-action-body">
          <div className="orch-guided-action-meaning">{action.meaning}</div>

          <div className="orch-guided-action-evidence">
            <div className="orch-guided-action-section-label">Evidence</div>
            <div className="orch-guided-action-evidence-grid">
              {action.evidenceItems.map((item, i) => (
                <div key={i} className="orch-guided-action-evidence-row" data-type={item.type || ''}>
                  <span className="orch-guided-action-evidence-key">{item.label}</span>
                  <span className="orch-guided-action-evidence-val">{item.value}</span>
                  {item.detail && <span className="orch-guided-action-evidence-detail">{item.detail}</span>}
                </div>
              ))}
            </div>
          </div>

          {action.learningContext && (
            <div className="orch-guided-action-learning" data-type={action.learningContext.type}>
              <div className="orch-guided-action-section-label">Learned from event history</div>
              <div className="orch-guided-action-learning-summary">{action.learningContext.summary}</div>
              {action.learningContext.type === 'review_history' && (
                <div className="orch-guided-action-learning-detail">
                  <span data-type="ok">{action.learningContext.accept_rate}% accepted</span>
                  <span data-type="warn">{action.learningContext.reject_rate}% rejected</span>
                  <span data-type="dim">{action.learningContext.contest_rate}% contested</span>
                </div>
              )}
            </div>
          )}

          <div className="orch-guided-action-workflow">
            <div className="orch-guided-action-section-label">Guided workflow</div>
            <ol className="orch-guided-action-steps">
              {action.workflow.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          {isSqoAction && status === 'available' && (
            <div className="orch-guided-action-sqo-exec">
              {hasTargets && (
                <div className="orch-sqo-targets">
                  <div className="orch-guided-action-section-label">Obligations</div>
                  {action.sqoTargets.map(t => (
                    <div key={t.id} className={`orch-sqo-target${selectedTarget === t.id ? ' orch-sqo-target--selected' : ''}`}>
                      <button
                        className="orch-sqo-target-select"
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setSelectedTarget(selectedTarget === t.id ? null : t.id) }}
                      >
                        <span className="orch-sqo-target-label">{t.label}</span>
                        <span className="orch-sqo-target-status">{t.status}</span>
                      </button>
                      {selectedTarget === t.id && t.affordances && (
                        <div className="orch-sqo-target-actions">
                          {t.affordances.actions.map(a => (
                            <button
                              key={a}
                              className="orch-sqo-exec-btn"
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
                        <div className="orch-sqo-target-props">
                          {t.propositions.map(p => (
                            <div key={p.id} className="orch-sqo-prop">
                              <span className="orch-sqo-prop-text">{p.proposition}</span>
                              <span className="orch-sqo-prop-conf">{p.confidence != null ? `${Math.round(p.confidence * 100)}%` : ''}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              {!hasTargets && action.sqoActions && action.sqoActions.length > 0 && (
                <div className="orch-sqo-confirm">
                  {action.sqoActions.map(a => {
                    const needsJust = action.requiresJustification && action.requiresJustification[a]
                    return (
                      <button
                        key={a}
                        className="orch-sqo-exec-btn orch-sqo-exec-btn--primary"
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
                <div className="orch-sqo-justification">
                  <label className="orch-guided-action-section-label">Justification (required)</label>
                  <textarea
                    className="orch-sqo-justification-input"
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
            <div className="orch-guided-action-decisions">
              <div className="orch-guided-action-section-label">Operator classification</div>
              <div className="orch-guided-action-decision-row">
                {action.decisions.map((d, i) => (
                  <button
                    key={i}
                    className="orch-guided-action-decision-btn"
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
            <div className={`orch-sqo-result${executionResult.success ? ' orch-sqo-result--ok' : ' orch-sqo-result--error'}`}>
              {executionResult.success
                ? `Action executed — ${executionResult.event?.action || 'complete'}. Refreshing posture...`
                : `Execution failed: ${executionResult.error}${executionResult.detail ? ' — ' + executionResult.detail : ''}`
              }
            </div>
          )}

          {status === 'staged' && !isSqoAction && (
            <div className="orch-guided-action-staged-notice">
              Decision staged — execution path pending orchestrator integration
            </div>
          )}

          <div className="orch-guided-action-footer">
            {status === 'available' && !isSqoAction && !hasDecisions && action.actionMode !== ACTION_MODE.INLINE_EXPLAIN && (
              <button className="orch-guided-action-stage-btn" type="button" onClick={(e) => { e.stopPropagation(); handleStage() }}>
                Stage action
              </button>
            )}
            <span className="orch-guided-action-exec-path">
              {isSqoAction ? `Governed execution: ${action.executionPath}` : 'Execution path: condition-derived'}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function OrchestrationGuidanceRuntime({ projection, fullReport, sqoAuthorityWorkspace, sqoBinding }) {
  const router = useRouter()
  const conditionActions = deriveConditionActions(projection, fullReport)
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
    <div className="orch-guidance-runtime">
      <div className="orch-guidance-header">
        <span className="orch-guidance-title">Guided Actions</span>
        <span className="orch-guidance-count">
          {actions.length} action{actions.length !== 1 ? 's' : ''}
          {criticalCount > 0 && <span className="orch-guidance-critical"> · {criticalCount} CRITICAL</span>}
          {highCount > 0 && <span className="orch-guidance-high"> · {highCount} HIGH</span>}
          {sqoCount > 0 && <span className="orch-guidance-governed"> · {sqoCount} governed</span>}
        </span>
      </div>
      {sqoAuthorityWorkspace && sqoAuthorityWorkspace.available && (
        <div className="orch-guidance-posture">
          <span className="orch-guidance-posture-level">{sqoAuthorityWorkspace.authorityPosture.s_level}</span>
          <span className="orch-guidance-posture-sep">·</span>
          <span className="orch-guidance-posture-label">
            {sqoAuthorityWorkspace.promotionControl.blockers_remaining > 0
              ? `${sqoAuthorityWorkspace.promotionControl.blockers_remaining} blocker${sqoAuthorityWorkspace.promotionControl.blockers_remaining !== 1 ? 's' : ''} active`
              : sqoAuthorityWorkspace.promotionControl.can_request_advancement
                ? 'Advancement eligible'
                : sqoAuthorityWorkspace.promotionControl.decision_state
            }
          </span>
        </div>
      )}
      <div className="orch-guidance-list">
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
        <div className="orch-guidance-staged-summary">
          {Object.keys(stagedActions).length} action{Object.keys(stagedActions).length !== 1 ? 's' : ''} staged
        </div>
      )}
    </div>
  )
}

export { deriveConditionActions, GuidedActionCard }
