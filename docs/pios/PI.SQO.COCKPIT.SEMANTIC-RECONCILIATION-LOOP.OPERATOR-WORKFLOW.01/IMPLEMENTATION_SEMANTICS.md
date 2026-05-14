# Implementation Semantics

**Stream:** PI.SQO.COCKPIT.SEMANTIC-RECONCILIATION-LOOP.OPERATOR-WORKFLOW.01
**Classification:** G2 (Architecture-Consuming)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `LOOP_PHASE_LABELS` | SQOCockpitFormatter.js | Human-readable labels for 8 improvement phases | Cockpit-specific |
| `LOOP_PHASE_ACTIONS` | SQOCockpitFormatter.js | Per-phase operator action guidance text | Cockpit-specific |
| `LOOP_STATE_NEXT_ACTIONS` | SQOCockpitFormatter.js | Per-lifecycle-state next-action text (12 states) | Cockpit-specific |
| `formatReconciliationLoopSection` | SQOCockpitFormatter.js | Transform loop artifact into panel-ready data | Cockpit-specific |
| `ReconciliationLoopWorkflowPanel` | ReconciliationLoopWorkflowPanel.jsx | Operator workflow rendering component | Cockpit-specific |

## 2. Input Contracts

### formatReconciliationLoopSection

| Input | Source | Fields Consumed |
|-------|--------|-----------------|
| `reconciliation_loop_state.v1.json` | SQO artifact via SQOCockpitArtifactLoader | lifecycle (current_state, state_description, is_terminal, successors), phase_assessment (total_phases, completed_phases, completion_ratio, all_complete, phases[].id/phase/complete/inputs_satisfied/outputs_present, blocked_phases, pending_phases), rerun_chain (id, description, entry_phase, script_count, scripts), progression_readiness, propagation_chain (steps), provenance |

### ReconciliationLoopWorkflowPanel

| Input | Source | Fields Consumed |
|-------|--------|-----------------|
| `loopData` | formatReconciliationLoopSection output | available, lifecycle, completion, phaseWorkflow, currentPhase, blockedPhases, rerunChain, progressionReadiness, propagationChain, provenance |

## 3. Output Contracts

### formatReconciliationLoopSection

Returns when available:
```
{
  available: true,
  lifecycle: { state, description, terminal, next_action },
  completion: { total, completed, ratio, all_complete },
  phaseWorkflow: [{ id, phase, label, complete, inputs_satisfied, outputs_present, action, status }],
  currentPhase: { id, label, action, status } | null,
  blockedPhases: [{ id, missing }],
  pendingPhases: [{ id, missing_outputs }],
  rerunChain: { id, description, script_count, scripts } | null,
  progressionReadiness: { ready, gates_met, gate_count, blocking_gates, s_state_current, s_state_target } | null,
  propagationChain: { step_count, steps },
  provenance: { compiled_at, compiler, source_commit },
}
```

Returns when unavailable:
```
{
  available: false,
  reason: 'NO_LOOP_STATE_ARTIFACT' | 'LOOP_PROJECTION_FAILED',
  diagnostic: string,
}
```

## 4. Read-Only Boundaries

The operator workflow panel is strictly read-only:
- No execution buttons (no "Run" or "Execute" controls)
- No autonomous orchestration (no automatic script triggering)
- No inline editing of loop state
- No artifact mutation
- All action guidance is displayed as text only — operator must manually execute scripts

## 5. Action-Readiness Semantics

Phase status is classified mechanically:
- **COMPLETE:** Both inputs satisfied and outputs present
- **READY:** Inputs satisfied but outputs not yet present — phase can be executed
- **BLOCKED:** Inputs not satisfied — upstream phases must complete first

Next-action text is resolved from lifecycle state:
- Each of the 12 lifecycle states maps to one static action text
- No dynamic or inferred guidance

## 6. Blocked-State Semantics

Blocked conditions are explicit and never suppressed:
- Missing artifact names are listed per blocked phase
- Blocked phases section only renders when blocks exist
- No fallback to estimated or inferred state
- Missing loop state artifact produces fail-visible diagnostic with compilation command

## 7. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| SQOCockpitFormatter.js (formatReconciliationLoopSection) | Transform loop artifact into panel-ready structure with labels, actions, status classification |
| ReconciliationLoopWorkflowPanel.jsx | Render operator workflow: state header, next action, phase list, blocked/rerun/propagation/progression |
| SQOWorkspacePanel.jsx | Panel dispatch: routes 'reconciliation-loop' section to workflow panel |
| SQOWorkspaceDataResolver.js | Data resolver: calls formatter for section data |
| SQOCockpitRouteResolver.js | Route registry: section name, route path, navigation label |
| SQOWorkspaceShell.jsx | Shell: route detection for the new section |
| reconciliation-loop.js (page) | Next.js route: SSR with SQOWorkspaceShell |
| globals.css | Styling: all .sqo-loop-* classes |
