# Workflow Spine Architecture

> **Authority:** This document defines the operational brain of the cockpit — the `resolveOperatorWorkflow` contract and the data model that drives all rendering decisions.

---

## Architectural Principle

The cockpit does NOT decide what to render.

`resolveOperatorWorkflow` decides what to render.

The cockpit is a projection surface for a computed workflow state. Every visual element, every action affordance, every progressive disclosure decision traces to the output of this resolver.

---

## resolveOperatorWorkflow Contract

### Signature

```javascript
resolveOperatorWorkflow(
  client,                  // string — client identifier
  runId,                   // string — run identifier
  role,                    // string — declared session role
  promotionState,          // object|null — raw promotion_state.json
  qualificationBlockers,   // object|null — raw qualification_blockers.json
  reviewObligations,       // object|null — raw review_obligations.json
  promotionEventLog,       // array|null — promotion_event_log.jsonl entries
  runtimeCapabilities,     // object — capabilities from SQORuntimeResolver
  sectionAvailability      // object — section availability from SQORuntimeResolver
)
```

### Output Contract

```javascript
{
  // === POSTURE (Level 0 — always visible) ===
  currentPosture: {
    posture: string,           // POSTURE enum value
    postureLabel: string,      // human-readable label
    s_level: string|null,      // S0/S1/S2/S3
    summary: string,           // one-line operational summary
  },

  primaryGuidance: {
    headline: string,          // one sentence: the next governed operational step
    action_target: string|null,// section or action to navigate to
    urgency: string,           // 'critical' | 'actionable' | 'informational' | 'terminal'
  },

  // === PRESSURE (Level 0-1 — visible on entry or one interaction) ===
  blockerSummary: {
    total: number,
    by_lane: {
      [lane: string]: {
        count: number,
        label: string,
        resolvable_by_role: boolean,
        resolution_action: string|null,
      }
    },
    critical_count: number,
    escalation_required: boolean,
  },

  obligationSummary: {
    total: number,
    unresolved: number,
    contested: number,
    resolved: number,
    actionable_by_role: number,  // how many the current role can act on
  },

  // === EVIDENCE STATE (Level 1) ===
  evidenceState: {
    structural_topology: { available: boolean, detail: string|null },
    semantic_intake: { available: boolean, detail: string|null },
    crosswalk: { available: boolean, detail: string|null },
    reconciliation: { available: boolean, detail: string|null },
    evidence_replay: { available: boolean, detail: string|null },
    vault_readiness: { available: boolean, detail: string|null },
    event_lineage: { available: boolean, detail: string|null },
    authority_runtime: { available: boolean, detail: string|null },
  },

  // === ACTIONS (Level 1) ===
  availableActions: [
    {
      action: string,          // action identifier
      label: string,           // human-readable label
      category: string,        // 'review' | 'promotion' | 'structural' | 'escalation' | 'insufficiency'
      available: boolean,      // can the current role execute this now?
      reason_if_unavailable: string|null,  // WHY not (role, state prerequisite, blocker)
      required_role: string|null,          // what role IS needed
      authority_level: string,             // L4/L5
      target_count: number|null,           // e.g., 3 obligations to review
    }
  ],

  // === PROGRESSION (Level 1) ===
  nextPossibleStates: [
    {
      state: string,                // target S-level
      label: string,                // human-readable
      reachable: boolean,           // all prerequisites met?
      remaining_prerequisites: [    // what's missing
        { requirement: string, met: boolean, resolution: string|null }
      ],
    }
  ],

  progressionPath: [
    {
      step: string,            // step identifier
      label: string,           // human-readable
      status: string,          // 'complete' | 'current' | 'future' | 'blocked' | 'terminal'
      detail: string|null,     // contextual explanation
    }
  ],

  // === AUTHORITY PROJECTION (Level 1) ===
  roleProjection: {
    role: string,              // current declared role
    roleLabel: string,         // human-readable
    permitted_actions: string[],
    prohibited_actions: string[],
    escalation_targets: [      // actions that require a different role
      { action: string, required_role: string }
    ],
  },

  // === DRILLDOWN AVAILABILITY (Level 2-3) ===
  availableDrilldowns: {
    tier2: [                   // qualification detail surfaces
      { section: string, label: string, available: boolean, relevance: string }
    ],
    tier3: [                   // forensic surfaces
      { section: string, label: string, available: boolean }
    ],
  },

  // === TERMINAL STATE ===
  isTerminal: boolean,         // permanently unqualifiable
  terminalReason: string|null,
}
```

---

## Posture Model

Eight posture states, computed in priority order (highest priority wins):

| Priority | Posture | Condition | Guidance Urgency |
|---|---|---|---|
| 1 | PERMANENTLY_UNQUALIFIABLE | `insufficiency_permanent === true` | terminal |
| 2 | INSUFFICIENT_EVIDENCE | `insufficiency_acknowledged === true` (not permanent) | informational |
| 3 | QUALIFIED | `s_level === 'S2'` or `s_level === 'S3'` | informational |
| 4 | RECONCILIATION_ACTIVE | `static_reconciliation` or `static_reconciliation_loop` capability | actionable |
| 5 | CROSSWALK_ACTIVE | crosswalk blocker + `semantic_candidates` capability | actionable |
| 6 | QUALIFICATION_PENDING | `review_obligations` capability with unresolved items | critical |
| 7 | SEMANTIC_INTAKE | `semantic_candidates` capability | actionable |
| 8 | STRUCTURAL_ONLY | `structural_topology` capability or fallback | informational |

**Source:** `QualificationPostureResolver.js` — already implemented. The workflow resolver consumes its output.

---

## Primary Guidance Generation

The `primaryGuidance` field is the single most important cockpit output. It answers: **"What do I do next?"**

| Posture | Guidance Headline | Urgency | Action Target |
|---|---|---|---|
| PERMANENTLY_UNQUALIFIABLE | "Permanent insufficiency acknowledged. No further progression possible." | terminal | null |
| INSUFFICIENT_EVIDENCE | "Insufficient evidence for qualification. Determination may be revisited." | informational | null |
| QUALIFIED | "Qualified at {s_level}. {debt_count} semantic debt items remain." | informational | debt (if debt > 0) |
| RECONCILIATION_ACTIVE | "Reconciliation in progress. Review correspondence for completion." | actionable | reconciliation |
| CROSSWALK_ACTIVE | "Semantic intake complete. Crosswalk construction required for advancement." | actionable | null (crosswalk not yet cockpit-actionable) |
| QUALIFICATION_PENDING | "{n} review obligations require operator action." | critical | authority |
| SEMANTIC_INTAKE | "Semantic intake available. {n} candidate capabilities awaiting review." | actionable | semantic-candidates |
| STRUCTURAL_ONLY | "Structural topology only. Semantic derivation required for qualification." | informational | null |

When `obligationSummary.unresolved > 0` and role can act on them, guidance overrides to obligations regardless of posture.

---

## Blocker Model

Blockers are grouped by lane, not by artifact. Each lane maps to an operational concern:

| Lane | Operational Meaning | Resolution Action |
|---|---|---|
| `evidence` | Missing or insufficient evidence | Ingest evidence |
| `crosswalk` | Crosswalk not constructed or incomplete | Create crosswalk |
| `reconciliation` | Reconciliation not complete | Resolve reconciliation |
| `semantic_authority` | Semantic review not complete | Review semantic intake |
| `governance` | Governance prerequisites not met | Authority action required |
| `grounding` | Structural grounding insufficient | Evidence strengthening |
| `replay` | Replay verification failed | Investigate replay failure |

Each blocker carries:
- Lane classification
- Human-readable description
- Whether the current role can resolve it
- Resolution path (action or escalation)

---

## Action Model

Actions are the same 12 governed actions from the authority workflow, but now projected through role and state:

| Action | Category | Min Role | State Prerequisite |
|---|---|---|---|
| review_accept | review | reviewer | Obligation UNRESOLVED/CONTESTED |
| review_reject | review | reviewer | Obligation UNRESOLVED/CONTESTED |
| review_contest | review | reviewer | Obligation UNRESOLVED/RESOLVED |
| review_partial_accept | review | reviewer | Obligation UNRESOLVED/CONTESTED |
| promotion_request | promotion | operator | All blockers resolved |
| promotion_approve | promotion | promotion_authority | Pending promotion request |
| promotion_deny | promotion | promotion_authority | Pending promotion request |
| insufficiency_acknowledge | insufficiency | operator | S1 or S1.5 posture |
| crosswalk_accept | structural | domain_authority | Crosswalk lane exists |
| reconciliation_accept | structural | domain_authority | Reconciliation lane exists |
| escalate_arbitration | escalation | reviewer | Contested obligation |
| resolve_arbitration | escalation | promotion_authority | Arbitration-required obligation |

**Visibility rule:** ALL 12 actions render for ALL roles. Unavailable actions show: the action name, why it's unavailable, and what role/state change would enable it.

---

## Progression Path Model

A linear representation of the qualification journey with each step's status:

```
[
  { step: 'structural_onboarding',  status: 'complete',  label: 'Structural Onboarding' },
  { step: 'semantic_derivation',    status: 'complete',  label: 'Semantic Derivation' },
  { step: 'semantic_review',        status: 'current',   label: 'Semantic Review' },
  { step: 'crosswalk_construction', status: 'future',    label: 'Crosswalk Construction' },
  { step: 'reconciliation',         status: 'future',    label: 'Reconciliation' },
  { step: 'qualification',          status: 'future',    label: 'Qualification Promotion' },
]
```

Steps are derived from posture, not hardcoded. If reconciliation capability exists, reconciliation step is 'complete' or 'current'. If no semantic intake, derivation step is 'future'.

Terminal posture (PERMANENTLY_UNQUALIFIABLE) renders all future steps as 'terminal'.

---

## Escalation Model

When `blockerSummary.escalation_required === true`:

1. At least one blocker requires a role the current operator doesn't have
2. At least one obligation is in CONTESTED or ARBITRATION_REQUIRED state
3. A promotion decision is pending and the current role cannot approve/deny

The cockpit surfaces:
- What specific escalation is needed
- Which role can resolve it
- The governance basis for the escalation requirement

---

## Relationship to Existing Resolvers

```
SQORuntimeResolver           → capabilities, sectionAvailability
  ↓
QualificationPostureResolver  → posture (already implemented)
  ↓
resolveOperatorWorkflow       → FULL workflow state (NEW — center of gravity)
  ↓
Cockpit rendering             → projection of workflow state
```

The workflow resolver CONSUMES the posture resolver and runtime resolver outputs. It does not replace them. It extends them with blocker analysis, action computation, progression path, guidance generation, and role projection.

---

## Implementation Location

```
app/execlens-demo/lib/sqo-cockpit/server/OperatorWorkflowResolver.server.js
```

This file already exists with `resolveAuthorityWorkspace()` for the authority page. The `resolveOperatorWorkflow` function extends it as the primary cockpit data source, replacing `resolveWorkspaceData` as the top-level data assembly point.
