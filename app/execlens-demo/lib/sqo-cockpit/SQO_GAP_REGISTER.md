# SQO Execution Bridge — Gap Register

**Status:** Active  
**Last updated:** 2026-05-26

## Registered Gaps

### GAP-01: evidence_refs empty for LENS-initiated actions

**Severity:** Non-blocking  
**Location:** SoftwareIntelligenceField.jsx → handleSqoExecute  
**Description:** The `evidence_refs` array in emitted events is always `[]` for actions initiated through LENS guided flow. The event structure supports evidence references, but the LENS execution path does not populate them.  
**Impact:** Audit events record what happened and who did it, but do not link to the specific structural evidence that informed the operator's decision.  
**Resolution path:** Enrich the fetch payload with obligation-level evidence references (proposition IDs, confidence envelopes, structural sources) that the adapter already computes.

### GAP-02: replay is consistency validation, not event-sourced reconstruction

**Severity:** Non-blocking  
**Location:** SQOActionEngine.server.js:457-484 — `replayValidate()`  
**Description:** Post-action replay validates audit_event_ref chain integrity and event_id uniqueness. It does NOT replay the full event sequence to reconstruct state from scratch. True event-sourced reconstruction would apply each event in sequence to an empty state and compare with the current artifact state.  
**Impact:** Detects broken references and duplicate events, but cannot detect state drift caused by external artifact modification (manual file edits, pipeline re-runs).  
**Resolution path:** Implement `replayReconstruct()` that builds state from event log and diffs against current artifacts. Flag divergence as REPLAY_DRIFT.

### GAP-03: confirmation UX is direct-click, not formal confirmation ceremony

**Severity:** Non-blocking  
**Location:** SoftwareIntelligenceField.jsx — GuidedActionCard  
**Description:** Operator clicks an action button and it executes immediately (for actions not requiring justification). There is no "Are you sure?" confirmation dialog, no preview of before/after state, no two-step confirm flow.  
**Impact:** Low-friction execution is operationally efficient but lacks ceremony for irreversible or high-consequence actions (promotion_approve, insufficiency_acknowledge).  
**Resolution path:** Add confirmation ceremony for actions where `requiresJustification` is true or where the action is classified CRITICAL priority. Show prior_state, proposed resulting_state, and affected artifacts before confirming.

### GAP-04: self-learning is v1 descriptive, not prescriptive

**Severity:** Expected — Phase 2 delivered as v1  
**Location:** SQOLearningSignalDerivation.server.js  
**Description:** Learning signals are derived and displayed (action patterns, progression history, temporal signals). Learning is descriptive observation over event history — it does not prescribe actions, predict outcomes, or model operator behavior. Operator behavioral modeling is explicitly postponed (governance-sensitive).  
**Impact:** Adaptive guidance is informational context. No prescriptive intelligence yet.  
**Resolution path:** Phase 3: graph-based progression intelligence — which action unlocks which future action corridor. Requires dependency graph over action space, not flat priority sort.

### GAP-05: before/after state not displayed to operator

**Severity:** Non-blocking  
**Location:** SoftwareIntelligenceField.jsx — GuidedActionCard  
**Description:** After action execution, LENS shows a result message ("Action executed — review_accept") and updated counts. It does not show a diff of prior_state vs resulting_state, or the full event record.  
**Impact:** Operator sees the outcome (count changed, status updated) but not the governance record of what changed.  
**Resolution path:** Display the returned event object (prior_state, resulting_state, semantic_disposition) in the result area before page reload.

### GAP-06: no tests for SQO learning derivation

**Severity:** Non-blocking  
**Location:** SQOLearningSignalDerivation.server.js  
**Description:** No unit tests exist for the learning signal derivation engine. Build compiles clean but derivation logic (event classification, pattern computation, temporal signal extraction) is untested.  
**Impact:** Regressions in learning derivation would be silent until observed in LENS.  
**Resolution path:** Add test coverage for `deriveLearningSignals()` with fixture event logs covering all event schema types (legacy pipeline events, LENS-initiated authority actions).

### GAP-07: stale learning signals not explicitly detected

**Severity:** Non-blocking  
**Location:** SQOLearningSignalDerivation.server.js / LensSQOOrchestrationAdapter.js  
**Description:** Learning signals include `derived_at` and `derived_from_events` fields for staleness detection, but no consumer checks these values. If the event log grows between page loads without an action execution (which triggers refresh), signals may be stale.  
**Impact:** Learning context could show outdated pattern data. Low risk since signals are re-derived on every workspace resolution (server-side page load).  
**Resolution path:** Add `derived_from_events` comparison against actual event log length in the adapter. Flag stale signals with a visual indicator.

### GAP-08: graph-based progression intelligence (Phase 3)

**Severity:** Future phase  
**Location:** LensSQOOrchestrationAdapter.js  
**Description:** Current action derivation produces a flat priority-sorted list. The next evolution is graph-based progression intelligence: which action unlocks which future action corridor. Example: resolving review obligations → unblocks promotion request → enables governance approval.  
**Impact:** Operators see prioritized actions but not action dependency chains or unlockable corridors.  
**Resolution path:** Model action dependencies as a directed graph. Derive corridor projections showing how current actions unlock future advancement paths.
