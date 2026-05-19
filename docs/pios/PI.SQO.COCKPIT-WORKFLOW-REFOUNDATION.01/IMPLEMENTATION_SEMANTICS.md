# Implementation Semantics — PI.SQO.COCKPIT-WORKFLOW-REFOUNDATION.01

> §5.5 — Reusable primitives created by this stream.

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|---|---|---|---|
| `resolveOperatorWorkflow` | `server/OperatorWorkflowResolver.server.js` | Full workflow state computation — posture, guidance, blockers, actions, progression, role projection | Primary cockpit primitive. Consumed by all V2 pages. |
| `resolveOperatorWorkflowFromRaw` | `server/OperatorWorkflowResolver.server.js` | Convenience wrapper — loads raw state then delegates to resolveOperatorWorkflow | Consumed by V2 page getServerSideProps |
| `computeWorkflowProjection` | `client/WorkflowRoleProjection.js` | Client-side role recomputation (no server imports) | Consumed by OperationalCockpitShell for session role changes |
| `buildV2NavigationItems` | `V2CockpitRouteResolver.js` | Tier-aware navigation item builder | Consumed by OperationalCockpitShell |
| `buildV2SectionPath` | `V2CockpitRouteResolver.js` | Tier-aware URL path builder | Consumed by navigation and routing |
| `deriveV2SectionFromPath` | `V2CockpitRouteResolver.js` | URL → section reverse lookup | Consumed by route change handler |

---

## 2. Input Contracts

### resolveOperatorWorkflow
```
(client: string, runId: string, role: string,
 promotionState: object|null, qualificationBlockers: object|null,
 reviewObligations: object|null, promotionEventLog: array|null,
 runtimeCapabilities: object, sectionAvailability: object) → WorkflowState
```

- `promotionState`: Raw `promotion_state.json` — fields: s_level, authority_ceiling, promotion_eligible, insufficiency_acknowledged, insufficiency_permanent, lanes
- `qualificationBlockers`: Raw `qualification_blockers.json` — fields: blockers (array with lane, resolved, severity, blocks_promotion)
- `reviewObligations`: Raw `review_obligations.json` — fields: obligations (array with id, status, source, trigger), total_obligations, resolved, unresolved
- `promotionEventLog`: Array of events from `promotion_event_log.jsonl` — fields: event_id, action, actor_id, timestamp
- `runtimeCapabilities`: From `SQORuntimeResolver.resolveRuntimeSubstrates().capabilities` — 20 boolean flags
- `sectionAvailability`: From `SQORuntimeResolver.resolveRuntimeSubstrates().sectionAvailability` — 14 section flags

### computeWorkflowProjection
```
(workflowState: WorkflowState, newRole: string) → WorkflowState
```

- `workflowState`: Full output from resolveOperatorWorkflow (SSR-serialized)
- `newRole`: One of operator/reviewer/domain_authority/promotion_authority/audit_authority

---

## 3. Output Contracts

### WorkflowState (resolveOperatorWorkflow output)

| Field | Type | Description |
|---|---|---|
| currentPosture | { posture, postureLabel, s_level, summary } | 8-state posture from QualificationPostureResolver |
| primaryGuidance | { headline, action_target, urgency } | "What do I do next?" — urgency: critical/actionable/informational/terminal |
| blockerSummary | { total, by_lane, critical_count, escalation_required } | Lane-grouped blockers with role-aware resolvability |
| obligationSummary | { total, unresolved, contested, resolved, actionable_by_role } | Review obligation counts |
| evidenceState | { structural_topology, semantic_intake, crosswalk, reconciliation, evidence_replay, vault_readiness, event_lineage, authority_runtime } | 8 evidence categories, each { available, detail } |
| availableActions | Array<{ action, label, category, available, reason_if_unavailable, required_role, authority_level, target_count }> | All 12 governed actions, always all present |
| nextPossibleStates | Array<{ state, label, reachable, remaining_prerequisites }> | S-level transitions with prerequisite tracking |
| progressionPath | Array<{ step, label, status, detail }> | 6-step qualification journey, status: complete/current/future/blocked/terminal |
| roleProjection | { role, roleLabel, permitted_actions, prohibited_actions, escalation_targets } | Current role authority projection |
| availableDrilldowns | { tier2, tier3 } | Available qualification detail and forensic surfaces |
| isTerminal | boolean | Whether posture is PERMANENTLY_UNQUALIFIABLE |
| terminalReason | string|null | Summary if terminal |

---

## 4. Calibration Assumptions

| Constant | Value | Governed vs Tuned |
|---|---|---|
| ROLE_ACTION_MAP | 5 roles × 12 actions | GOVERNED — from SQOAuthorityValidator, non-automatable boundaries |
| ACTION_AUTHORITY | 12 actions × domain/level | GOVERNED — from SQOAuthorityValidator |
| POSTURE priority order | 8-state chain | GOVERNED — from QualificationPostureResolver |
| Progression path steps | 6 fixed steps | GOVERNED — from QUALIFICATION_STATE_MACHINE.md |
| Urgency levels | critical/actionable/informational/terminal | GOVERNED — from WORKFLOW_SPINE_ARCHITECTURE.md |
| SSR default role | 'operator' | TUNED — broadest permissions for initial render |

---

## 5. Extension Points

| Extension | Mechanism | When |
|---|---|---|
| New posture states | Extend QualificationPostureResolver priority chain + guidance table | If new qualification posture needed |
| New governed actions | Add to ROLE_ACTION_MAP + ACTION_AUTHORITY + actionDefs in resolveAvailableActions | If new governance boundary |
| New roles | Add to ROLE_ACTION_MAP + ROLE_LABELS + RoleDeclarationGate ROLES | If new authority role |
| New progression steps | Extend progressionPath array in resolveProgressionPath | If new qualification stage |
| New Tier 2/3 sections | Add to TIER2/TIER3_SECTION_DEFS + page routes | If new cockpit section |

---

## 6. Module Responsibility Map

| Module | Concern |
|---|---|
| `OperatorWorkflowResolver.server.js` | Workflow state computation (server-side) |
| `QualificationPostureResolver.js` | Posture priority chain (consumed by workflow resolver) |
| `SQORuntimeResolver.server.js` | Capability and section availability probing |
| `PromotionStateLoader.server.js` | Raw promotion state file loading |
| `SQOAuthorityValidator.server.js` | Action validation constants and rules |
| `V2CockpitRouteResolver.js` | Tier-aware route construction and parsing |
| `client/WorkflowRoleProjection.js` | Client-side role recomputation |
| `v2/OperationalCockpitShell.jsx` | V2 shell — role state, content routing |
| `v2/OperationalOverviewShell.jsx` | V2 overview — posture-first composed layout |
| `v2/WorkflowNavigationRail.jsx` | 3-tier grouped navigation |
| `v2/RoleDeclarationGate.jsx` | Session role selection |
