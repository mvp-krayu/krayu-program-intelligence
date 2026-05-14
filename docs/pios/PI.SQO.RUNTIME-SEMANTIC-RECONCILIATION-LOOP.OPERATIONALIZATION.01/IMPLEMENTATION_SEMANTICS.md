# Implementation Semantics

**Stream:** PI.SQO.RUNTIME-SEMANTIC-RECONCILIATION-LOOP.OPERATIONALIZATION.01
**Classification:** G1 (Architecture-Mutating)

---

## 1. Primitive Inventory

| Name | Module | Purpose | Reuse Status |
|------|--------|---------|--------------|
| `LIFECYCLE_STATES` | ReconciliationLoopOrchestrator.js | 12-state operational lifecycle model | Canonical — governs all loop state |
| `IMPROVEMENT_PHASES` | ReconciliationLoopOrchestrator.js | 8-phase ordered improvement sequence | Canonical — governs operational sequencing |
| `TRANSITION_RULES` | ReconciliationLoopOrchestrator.js | 13 explicit state transitions with guards | Canonical — governs lifecycle flow |
| `RUNTIME_PROPAGATION_CHAIN` | ReconciliationLoopOrchestrator.js | 7-step artifact update chain | Canonical — governs runtime propagation |
| `RERUN_ORCHESTRATION` | ReconciliationLoopOrchestrator.js | 5 deterministic rerun modes | Canonical — governs rerun sequencing |
| `REPLAY_BOUNDARIES` | ReconciliationLoopOrchestrator.js | 7 replay safety guarantees | Canonical — governs replay behavior |
| `assessPhaseCompletion` | ReconciliationLoopOrchestrator.js | Per-phase completion assessment from artifact state | Reusable — any client |
| `resolveCurrentLifecycleState` | ReconciliationLoopOrchestrator.js | Lifecycle state resolution from phase assessment | Reusable — any client |
| `resolveRerunChain` | ReconciliationLoopOrchestrator.js | Rerun mode resolution from lifecycle state | Reusable — any client |
| `assessProgressionReadiness` | ReconciliationLoopOrchestrator.js | Propagation readiness extraction from qualification projection | Reusable — any client |
| `compileReconciliationLoopState` | ReconciliationLoopOrchestrator.js | Master loop state compilation | Reusable — any client |
| `emitLoopState` | ReconciliationLoopOrchestrator.js | Write loop state artifact | Reusable |
| `projectReconciliationLoopForRuntime` | ReconciliationLoopProjection.js | Transform loop state into 6-facet consumer projection | Reusable — any client |

## 2. Operational Loop Boundaries

### Lifecycle States

| State | Terminal | Successors |
|-------|----------|------------|
| IDLE | no | EVIDENCE_SUBMITTED |
| EVIDENCE_SUBMITTED | no | INTAKE_REGISTERED, INTAKE_REJECTED |
| INTAKE_REGISTERED | no | ENRICHMENT_ELIGIBLE, ENRICHMENT_NOT_REQUIRED |
| INTAKE_REJECTED | yes | — |
| ENRICHMENT_ELIGIBLE | no | ENRICHMENT_COMPLETE |
| ENRICHMENT_NOT_REQUIRED | no | RECONCILIATION_PENDING |
| ENRICHMENT_COMPLETE | no | RECONCILIATION_PENDING |
| RECONCILIATION_PENDING | no | RECONCILIATION_COMPLETE |
| RECONCILIATION_COMPLETE | no | DEBT_UPDATED |
| DEBT_UPDATED | no | QUALIFICATION_REPROJECTED |
| QUALIFICATION_REPROJECTED | no | PROPAGATED |
| PROPAGATED | yes | IDLE |

### State Flow Diagram

```
IDLE
  ↓ (operator submits evidence)
EVIDENCE_SUBMITTED
  ↓ (intake loop)
INTAKE_REGISTERED ←→ INTAKE_REJECTED (terminal)
  ↓ (eligibility check)
ENRICHMENT_ELIGIBLE ←→ ENRICHMENT_NOT_REQUIRED
  ↓                         ↓
ENRICHMENT_COMPLETE         |
  ↓                         ↓
RECONCILIATION_PENDING ←────┘
  ↓ (correspondence rerun)
RECONCILIATION_COMPLETE
  ↓ (debt index recompilation)
DEBT_UPDATED
  ↓ (qualification reprojection)
QUALIFICATION_REPROJECTED
  ↓ (substrate + consumer update)
PROPAGATED (terminal → IDLE)
```

## 3. Orchestration Sequencing

### Improvement Phases

| Phase | ID | Compilation Target | Mutation Boundary |
|-------|----|--------------------|-------------------|
| 1 | EVIDENCE_INTAKE | compile_blueedge_evidence_intake.js | evidence_intake |
| 2 | ENRICHMENT_ELIGIBILITY | (manual/external) | evidence_intake |
| 3 | RECONCILIATION_RERUN | compile_blueedge_correspondence.js | reconciliation |
| 4 | DEBT_RECALCULATION | compile_blueedge_debt_index.js | semantic_debt |
| 5 | QUALIFICATION_REPROJECTION | compile_blueedge_qualification_projection.js | qualification_projection |
| 6 | LIFECYCLE_PROGRESSION | (assessment only) | qualification_core |
| 7 | TEMPORAL_ANALYTICS_UPDATE | compile_blueedge_temporal_analytics.js | temporal_analytics |
| 8 | RUNTIME_PROPAGATION | compile_blueedge_semantic_operations.js | semantic_operations_substrate |

### Rerun Modes

| Mode | Entry Phase | Phase Coverage | Script Count |
|------|-------------|----------------|--------------|
| FULL_RERUN | 1 | 1-8 | 7 |
| FROM_RECONCILIATION | 3 | 3-8 | 6 |
| FROM_DEBT | 4 | 4-8 | 4 |
| FROM_PROJECTION | 5 | 5,7,8 | 2 |
| PROPAGATION_ONLY | 8 | 8 | 1 |

## 4. Runtime Propagation Contracts

### 7-Step Propagation Chain

| Step | Source | Target | Action |
|------|--------|--------|--------|
| 1 | evidence_file | semantic_evidence_intake | Register evidence via intake loop |
| 2 | semantic_evidence_intake | reconciliation_correspondence | Rerun correspondence with new evidence |
| 3 | reconciliation_correspondence | reconciliation_lifecycle | Update lifecycle with new epoch |
| 4 | reconciliation_correspondence | semantic_debt_index | Recalculate debt with updated reconciliation |
| 5 | reconciliation_lifecycle + semantic_debt_index | reconciliation_temporal_analytics | Rerun temporal analytics |
| 6 | all_upstream_artifacts | runtime_qualification_projection | Reproject unified qualification posture |
| 7 | runtime_qualification_projection | runtime_semantic_operations_substrate | Update operations substrate |

### Transition Trigger Types

| Trigger | Meaning | Example |
|---------|---------|---------|
| OPERATOR | Requires human operator action | Evidence submission, enrichment initiation |
| COMPILATION | Triggered by running a compilation script | Intake loop, correspondence rerun |
| ASSESSMENT | Triggered by evaluating eligibility criteria | Enrichment eligibility check |
| AUTOMATIC | Follows mechanically from prior state | Enrichment-not-required → reconciliation-pending |

## 5. Replay Guarantees

1. All phases produce deterministic output from the same input artifacts
2. Timestamps are excluded from replay comparison
3. Each phase records trigger source, input artifact hashes, and output artifact hashes
4. Reruns from any phase produce identical output given identical upstream
5. No phase produces side effects beyond writing governed artifacts
6. No downstream phase may mutate upstream artifacts
7. Phase ordering is fixed — downstream cannot execute before upstream completes

## 6. Lifecycle Update Semantics

### When to Recompile Loop State

Recompile `reconciliation_loop_state.v1.json` after any of:
- Evidence intake loop execution
- Reconciliation correspondence rerun
- Debt index recompilation
- Qualification projection recompilation
- Semantic operations substrate recompilation

### Loop State Does Not Drive Compilation

The loop state artifact is an ASSESSMENT — it reports where the system currently stands. It does not trigger compilations. Compilations are triggered by operator actions (running scripts). The loop state then reflects the result.

### Relationship to Compilation Phases

The 8 IMPROVEMENT_PHASES in the loop orchestrator map to (but are distinct from) the 9 orchestration phases in RuntimeSemanticOperationsSubstrate:

| Loop Phase | Substrate Phase | Relationship |
|------------|-----------------|--------------|
| 1 (EVIDENCE_INTAKE) | 5 (evidence_intake) | Triggers intake compilation |
| 2 (ENRICHMENT_ELIGIBILITY) | — | Manual/external, no substrate phase |
| 3 (RECONCILIATION_RERUN) | 3 (reconciliation) | Triggers reconciliation compilation |
| 4 (DEBT_RECALCULATION) | 2 (semantic_debt) | Triggers debt compilation |
| 5 (QUALIFICATION_REPROJECTION) | 7 (qualification_projection) | Triggers projection compilation |
| 6 (LIFECYCLE_PROGRESSION) | 1 (qualification_core) | Assesses S-state transition |
| 7 (TEMPORAL_ANALYTICS_UPDATE) | 4 (temporal_analytics) | Triggers temporal compilation |
| 8 (RUNTIME_PROPAGATION) | 8 (semantic_operations_substrate) | Triggers substrate compilation |

The substrate phases define HOW artifacts compile. The loop phases define WHEN and WHY those compilations occur within the improvement lifecycle.

## 7. Extension Points

- **Multi-client:** `compileReconciliationLoopState(client, runId)` works for any client with SQO artifacts
- **New lifecycle states:** Can be added for future operational needs (e.g., REVIEW_PENDING, APPROVAL_REQUIRED)
- **New improvement phases:** Can be inserted between existing phases
- **New rerun modes:** Can be added for fine-grained rerun control
- **Propagation chain:** Steps can be extended as new artifact types emerge
- **Consumer projection:** `projectReconciliationLoopForRuntime` can be extended with new facets

## 8. Module Responsibility Map

| Module | Responsibility |
|--------|---------------|
| ReconciliationLoopOrchestrator.js | Operational loop model: lifecycle states, improvement phases, transitions, propagation chain, rerun orchestration, replay boundaries, loop state compilation |
| ReconciliationLoopProjection.js | Consumer projection: transforms loop state into 6-facet consumer-safe shape |
| RuntimeSemanticOperationsSubstrate.js | Substrate: now includes reconciliation_loop domain (8th), PROP-08 contract, phase 9 |
| SQOCockpitArtifactLoader.js | Artifact registry: now 23 artifacts including reconciliation_loop_state |
| SQOCockpitFormatter.js | Cockpit integration: reconciliationLoop added to overview |
| compile_blueedge_reconciliation_loop.js | Compilation script: compiles and emits loop state artifact |
