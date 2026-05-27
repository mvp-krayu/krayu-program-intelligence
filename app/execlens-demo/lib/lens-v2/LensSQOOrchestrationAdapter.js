/**
 * LensSQOOrchestrationAdapter
 *
 * Translates SQO operational state into LENS orchestration actions.
 *
 * The SQO state (promotion_state, review_obligations, qualification_blockers,
 * event_log) IS the state machine. This adapter reads that state and derives
 * what governed actions are available, in priority order, with real execution
 * paths.
 *
 * Orchestration lifecycle:
 *   1. Server loads sqoAuthorityWorkspace via resolveAuthorityWorkspace
 *   2. This adapter derives ordered actions from workspace state
 *   3. LENS presents actions to operator via GuidedActionCard
 *   4. Operator confirms action → fetch /api/sqo/authority-action
 *   5. SQOActionEngine validates + executes + persists + emits event
 *   6. Page reloads → server re-resolves workspace → new actions derived
 */

const ACTION_EXECUTION_PATH = '/api/sqo/authority-action'

const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }

function deriveOrchestrationActions(workspace) {
  if (!workspace || !workspace.available) return []

  const actions = []
  const { authorityPosture, reviewQueue, promotionControl, blockerList, learningSignals } = workspace

  deriveReviewActions(actions, reviewQueue, authorityPosture)
  derivePromotionActions(actions, promotionControl, authorityPosture)
  deriveStructuralActions(actions, authorityPosture)
  deriveBlockerActions(actions, blockerList, authorityPosture)
  deriveInsufficiencyActions(actions, promotionControl, authorityPosture)

  if (learningSignals && learningSignals.available) {
    enrichActionsWithLearning(actions, learningSignals)
  }

  return actions.sort((a, b) =>
    (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4)
  )
}

function oblId(o) { return o.id || o.proposition_id || 'unknown' }
function oblLabel(o) { return o.proposition_class || o.proposition_id || o.id || 'unknown' }
function oblStatus(o) { return o.status || o.disposition || 'UNRESOLVED' }

function deriveReviewActions(actions, reviewQueue, authorityPosture) {
  if (!reviewQueue) return

  const { grouped, affordances } = reviewQueue
  const defaultAffordances = affordances && Object.values(affordances)[0]

  const unresolved = grouped.UNRESOLVED || []
  if (unresolved.length > 0) {
    actions.push({
      id: 'sqo-review-unresolved',
      title: `Review ${unresolved.length} unresolved obligation${unresolved.length !== 1 ? 's' : ''}`,
      target: `${reviewQueue.resolved || 0} of ${reviewQueue.total} resolved`,
      meaning: 'Semantic propositions await operator disposition. Each obligation represents a governed structural assertion that must be accepted, rejected, contested, or partially accepted before qualification can advance.',
      priority: 'CRITICAL',
      actionMode: 'SQO_EXECUTION',
      sqoActions: ['review_accept', 'review_reject', 'review_contest', 'review_partial_accept'],
      sqoTargets: unresolved.map(o => ({
        id: oblId(o),
        label: oblLabel(o),
        status: oblStatus(o),
        affordances: affordances[oblId(o)] || defaultAffordances || { actions: ['review_accept', 'review_reject'], readonly: false },
        propositions: o.representative_propositions || [],
        confidence: o.confidence_envelope || null,
        disposition: o.disposition || null,
        rationale: o.rationale || null,
      })),
      executionPath: ACTION_EXECUTION_PATH,
      requiresJustification: { review_reject: true, review_contest: true },
      evidenceItems: [
        { label: 'Total obligations', value: String(reviewQueue.total) },
        { label: 'Unresolved', value: String(unresolved.length), type: 'warn' },
        { label: 'Resolved', value: String(reviewQueue.resolved || 0), type: (reviewQueue.resolved || 0) > 0 ? 'ok' : 'dim' },
        ...unresolved.slice(0, 4).map(o => ({
          label: 'Obligation', value: oblLabel(o), type: 'warn',
        })),
      ],
      workflow: [
        'Review each obligation and its representative propositions',
        'Assess structural evidence supporting the assertion',
        'Accept, reject, contest, or partially accept',
        'System persists disposition to promotion_state + event log',
        'System recomputes qualification posture',
        'LENS refreshes with updated guided actions',
      ],
    })
  }

  const contested = grouped.CONTESTED || []
  if (contested.length > 0) {
    actions.push({
      id: 'sqo-review-contested',
      title: `${contested.length} contested obligation${contested.length !== 1 ? 's' : ''} require resolution`,
      target: contested.map(o => oblLabel(o)).join(', '),
      meaning: 'Previously reviewed obligations have been contested. They may be re-reviewed, escalated to arbitration, or resolved with updated disposition.',
      priority: 'HIGH',
      actionMode: 'SQO_EXECUTION',
      sqoActions: ['review_accept', 'review_reject', 'escalate_arbitration'],
      sqoTargets: contested.map(o => ({
        id: oblId(o),
        label: oblLabel(o),
        status: oblStatus(o),
        affordances: affordances[oblId(o)] || defaultAffordances || { actions: ['review_accept', 'review_reject'], readonly: false },
        contest_reasoning: o.contest_reasoning || o.rationale || null,
      })),
      executionPath: ACTION_EXECUTION_PATH,
      requiresJustification: { escalate_arbitration: true },
      evidenceItems: [
        { label: 'Contested', value: String(contested.length), type: 'warn' },
        ...contested.slice(0, 3).map(o => ({
          label: oblLabel(o),
          value: (o.contest_reasoning || o.rationale || oblStatus(o)).slice(0, 80),
          type: 'warn',
        })),
      ],
      workflow: [
        'Review contest reasoning for each obligation',
        'Accept, reject, or escalate to arbitration',
        'System records new disposition with full audit trail',
        'System recomputes posture with updated obligation state',
        'LENS refreshes with updated qualification guidance',
      ],
    })
  }

  const arbitration = grouped.ARBITRATION_REQUIRED || []
  if (arbitration.length > 0) {
    actions.push({
      id: 'sqo-arbitration',
      title: `${arbitration.length} obligation${arbitration.length !== 1 ? 's' : ''} require arbitration`,
      target: 'Governance-level resolution required',
      meaning: 'Escalated obligations require governance-level resolution. This action requires promotion_authority role.',
      priority: 'HIGH',
      actionMode: 'SQO_EXECUTION',
      sqoActions: ['resolve_arbitration'],
      sqoTargets: arbitration.map(o => ({
        id: oblId(o),
        label: oblLabel(o),
        status: oblStatus(o),
        affordances: affordances[oblId(o)] || defaultAffordances || { actions: ['resolve_arbitration'], readonly: false },
      })),
      executionPath: ACTION_EXECUTION_PATH,
      requiresJustification: { resolve_arbitration: true },
      evidenceItems: [
        { label: 'Arbitration required', value: String(arbitration.length), type: 'warn' },
      ],
      workflow: [
        'Review escalation context and original disposition',
        'Determine resolution outcome: RESOLVED or UNRESOLVABLE',
        'Provide arbitration justification',
        'System records governance-level resolution',
        'LENS refreshes with updated state',
      ],
    })
  }
}

function derivePromotionActions(actions, promotionControl, authorityPosture) {
  if (!promotionControl) return

  if (promotionControl.can_request_advancement) {
    const nextLevel = authorityPosture.s_level === 'S1' ? 'S1.5' : authorityPosture.s_level === 'S1.5' ? 'S2' : 'S3'
    actions.push({
      id: 'sqo-promotion-request',
      title: `Request ${authorityPosture.s_level} → ${nextLevel} advancement`,
      target: 'All qualification blockers resolved — advancement eligible',
      meaning: `All qualification blockers are resolved. Requesting promotion submits the specimen for governance-level advancement to ${nextLevel}.`,
      priority: 'HIGH',
      actionMode: 'SQO_EXECUTION',
      sqoActions: ['promotion_request'],
      sqoTargets: [],
      executionPath: ACTION_EXECUTION_PATH,
      requiresJustification: {},
      evidenceItems: [
        { label: 'Current level', value: authorityPosture.s_level },
        { label: 'Target level', value: nextLevel },
        { label: 'Blockers remaining', value: '0', type: 'ok' },
        { label: 'Decision state', value: promotionControl.decision_state },
      ],
      workflow: [
        'Confirm readiness for promotion request',
        'System submits to governance authority',
        'System records request event',
        'Awaits governance approval or denial',
        'LENS refreshes with updated promotion state',
      ],
    })
  }

  if (promotionControl.can_approve) {
    const nextLevel = authorityPosture.s_level === 'S1' ? 'S1.5' : 'S2'
    actions.push({
      id: 'sqo-promotion-approve',
      title: `Approve advancement to ${nextLevel}`,
      target: `Promotion requested — governance decision pending`,
      meaning: `Approving advances this specimen from ${authorityPosture.s_level} to ${nextLevel}. This is an irreversible governance-authority decision.`,
      priority: 'CRITICAL',
      actionMode: 'SQO_EXECUTION',
      sqoActions: ['promotion_approve'],
      sqoTargets: [],
      executionPath: ACTION_EXECUTION_PATH,
      requiresJustification: {},
      evidenceItems: [
        { label: 'Current level', value: authorityPosture.s_level },
        { label: 'Next level', value: nextLevel },
        { label: 'Promotion state', value: 'REQUESTED', type: 'warn' },
      ],
      workflow: [
        'Review qualification evidence and progression history',
        'Confirm advancement decision',
        'System executes S-level transition',
        'System records promotion event with audit lineage',
        'LENS refreshes at new qualification level',
      ],
    })
  }

  if (promotionControl.can_deny) {
    actions.push({
      id: 'sqo-promotion-deny',
      title: `Deny ${authorityPosture.s_level} advancement`,
      target: 'Promotion requested — denial requires justification',
      meaning: 'Governance authority determines promotion should be denied. Justification is required and recorded in the audit trail.',
      priority: 'MEDIUM',
      actionMode: 'SQO_EXECUTION',
      sqoActions: ['promotion_deny'],
      sqoTargets: [],
      executionPath: ACTION_EXECUTION_PATH,
      requiresJustification: { promotion_deny: true },
      evidenceItems: [
        { label: 'Current level', value: authorityPosture.s_level },
        { label: 'Promotion state', value: 'REQUESTED', type: 'warn' },
      ],
      workflow: [
        'Review qualification evidence',
        'Provide justification for denial',
        'System records denial with justification',
        'LENS refreshes with denial state',
      ],
    })
  }
}

function deriveStructuralActions(actions, authorityPosture) {
  const lanes = authorityPosture.lanes_summary || []

  for (const lane of lanes) {
    if (lane.lane === 'crosswalk' && lane.state !== 'VALIDATED' && lane.state !== 'ABSENT') {
      actions.push({
        id: 'sqo-crosswalk-accept',
        title: 'Accept crosswalk correspondence',
        target: `Crosswalk state: ${lane.state}`,
        meaning: 'Crosswalk structural correspondence exists and requires operator validation. Accepting confirms the domain-to-structure mapping is operationally correct.',
        priority: 'MEDIUM',
        actionMode: 'SQO_EXECUTION',
        sqoActions: ['crosswalk_accept'],
        sqoTargets: [],
        executionPath: ACTION_EXECUTION_PATH,
        requiresJustification: {},
        evidenceItems: [
          { label: 'Lane', value: 'Crosswalk' },
          { label: 'State', value: lane.state, type: lane.has_gaps ? 'warn' : 'dim' },
        ],
        workflow: [
          'Review crosswalk correspondence mapping',
          'Confirm domain-to-structure relationships',
          'System validates crosswalk lane',
          'LENS refreshes with updated lane state',
        ],
      })
    }

    if (lane.lane === 'reconciliation' && lane.state !== 'COMPLETE' && lane.state !== 'ABSENT') {
      actions.push({
        id: 'sqo-reconciliation-accept',
        title: 'Accept reconciliation',
        target: `Reconciliation state: ${lane.state}`,
        meaning: 'Reconciliation data exists and requires operator acceptance. Accepting confirms the structural reconciliation is operationally complete.',
        priority: 'MEDIUM',
        actionMode: 'SQO_EXECUTION',
        sqoActions: ['reconciliation_accept'],
        sqoTargets: [],
        executionPath: ACTION_EXECUTION_PATH,
        requiresJustification: {},
        evidenceItems: [
          { label: 'Lane', value: 'Reconciliation' },
          { label: 'State', value: lane.state, type: lane.has_gaps ? 'warn' : 'dim' },
        ],
        workflow: [
          'Review reconciliation correspondence',
          'Confirm structural reconciliation completeness',
          'System marks reconciliation lane as COMPLETE',
          'LENS refreshes with updated posture',
        ],
      })
    }
  }
}

function deriveBlockerActions(actions, blockerList, authorityPosture) {
  if (!blockerList || blockerList.length === 0) return
  const unresolved = blockerList.filter(b => !b.resolved)
  if (unresolved.length === 0) return

  const byLane = {}
  for (const b of unresolved) {
    const lane = b.lane || 'evidence'
    if (!byLane[lane]) byLane[lane] = []
    byLane[lane].push(b)
  }

  actions.push({
    id: 'sqo-blockers-summary',
    title: `${unresolved.length} qualification blocker${unresolved.length !== 1 ? 's' : ''} active`,
    target: Object.entries(byLane).map(([lane, items]) => `${lane}: ${items.length}`).join(' · '),
    meaning: `Qualification advancement beyond ${authorityPosture.s_level} is blocked until these are resolved. Each blocker traces to a specific governance lane and gap.`,
    priority: unresolved.some(b => b.severity === 'critical' || b.blocks_promotion) ? 'HIGH' : 'MEDIUM',
    actionMode: 'INLINE_EXPLAIN',
    sqoActions: [],
    sqoTargets: [],
    executionPath: null,
    requiresJustification: {},
    evidenceItems: [
      { label: 'Total blockers', value: String(unresolved.length), type: 'warn' },
      ...Object.entries(byLane).map(([lane, items]) => ({
        label: lane, value: `${items.length} blocker${items.length !== 1 ? 's' : ''}`, type: 'warn',
      })),
      ...unresolved.slice(0, 4).map(b => ({
        label: b.lane || 'gap', value: b.gap || b.description || b.domain_id || 'unspecified', type: 'dim',
      })),
    ],
    workflow: [
      'Review each blocker and its lane assignment',
      'Address blockers through their respective SQO governance pathways',
      'System removes blockers as conditions are satisfied',
      'When all resolved, promotion request becomes available',
    ],
  })
}

function deriveInsufficiencyActions(actions, promotionControl, authorityPosture) {
  if (!promotionControl || !promotionControl.can_acknowledge_insufficiency) return
  if (promotionControl.insufficiency_acknowledged) return

  actions.push({
    id: 'sqo-insufficiency',
    title: 'Acknowledge evidence insufficiency',
    target: `Terminal path option at ${authorityPosture.s_level}`,
    meaning: `At ${authorityPosture.s_level}, evidence may be insufficient for qualification advancement. Acknowledging insufficiency is a governed terminal-path decision. Permanent insufficiency is irreversible.`,
    priority: 'LOW',
    actionMode: 'SQO_EXECUTION',
    sqoActions: ['insufficiency_acknowledge'],
    sqoTargets: [],
    executionPath: ACTION_EXECUTION_PATH,
    requiresJustification: { insufficiency_acknowledge: true },
    evidenceItems: [
      { label: 'Current level', value: authorityPosture.s_level },
      { label: 'Path', value: 'Terminal', type: 'warn' },
    ],
    workflow: [
      'Review evidence sufficiency assessment',
      'Determine if insufficiency is permanent or temporary',
      'Provide justification',
      'System records insufficiency with governance audit trail',
      'LENS refreshes with terminal or acknowledged state',
    ],
  })
}

function enrichActionsWithLearning(actions, learningSignals) {
  const actionPatterns = learningSignals.action_patterns || {}
  const guidanceSignals = learningSignals.guidance_signals || []
  const progressionHistory = learningSignals.progression_history || {}

  for (const action of actions) {
    action.learningContext = null

    if (action.id === 'sqo-review-unresolved' && actionPatterns.total_authority_actions > 0) {
      const acceptCount = actionPatterns.by_action?.review_accept?.count || 0
      const rejectCount = actionPatterns.by_action?.review_reject?.count || 0
      const contestCount = actionPatterns.by_action?.review_contest?.count || 0
      const total = acceptCount + rejectCount + contestCount
      if (total > 0) {
        action.learningContext = {
          type: 'review_history',
          prior_actions: total,
          accept_rate: Math.round(acceptCount / total * 100),
          reject_rate: Math.round(rejectCount / total * 100),
          contest_rate: Math.round(contestCount / total * 100),
          summary: `${total} prior review action${total !== 1 ? 's' : ''}: ${acceptCount} accepted, ${rejectCount} rejected, ${contestCount} contested`,
        }
      }
    }

    if (action.id === 'sqo-promotion-request' || action.id === 'sqo-promotion-approve') {
      if (progressionHistory.total_transitions > 0 || progressionHistory.total_holds > 0) {
        action.learningContext = {
          type: 'progression_history',
          transitions: progressionHistory.total_transitions,
          holds: progressionHistory.total_holds,
          summary: `${progressionHistory.total_transitions} advancement${progressionHistory.total_transitions !== 1 ? 's' : ''}, ${progressionHistory.total_holds} hold${progressionHistory.total_holds !== 1 ? 's' : ''} in progression history`,
        }
      }
    }

    if (action.id === 'sqo-review-contested') {
      const contestSignal = guidanceSignals.find(s => s.signal === 'contest_activity')
      if (contestSignal) {
        action.learningContext = {
          type: 'governance_friction',
          signal: contestSignal.signal,
          severity: contestSignal.severity,
          summary: contestSignal.detail,
        }
      }
    }

    if (action.id === 'sqo-arbitration') {
      const arbSignal = guidanceSignals.find(s => s.signal === 'arbitration_escalation')
      if (arbSignal) {
        action.learningContext = {
          type: 'escalation_pattern',
          signal: arbSignal.signal,
          severity: arbSignal.severity,
          summary: arbSignal.detail,
        }
      }
    }
  }
}

const CONDITION_ACTION_SQO_OVERLAPS = new Set([
  'proposition-review',
  'qualification-assessment',
])

function mergeWithConditionActions(sqoActions, conditionActions) {
  const filtered = conditionActions.filter(a => !CONDITION_ACTION_SQO_OVERLAPS.has(a.id))
  const merged = [...sqoActions, ...filtered]
  return merged.sort((a, b) =>
    (PRIORITY_ORDER[a.priority] ?? 4) - (PRIORITY_ORDER[b.priority] ?? 4)
  )
}

module.exports = { deriveOrchestrationActions, mergeWithConditionActions }
