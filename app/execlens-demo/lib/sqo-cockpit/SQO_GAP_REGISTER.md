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

### GAP-04: self-learning not started

**Severity:** Expected — Phase 2  
**Location:** N/A  
**Description:** No adaptive learning, pattern detection, or operator decision modeling exists. This is correct and intentional. Self-learning sits on top of SQO doctrine and must not bypass it.  
**Impact:** None — doctrine fidelity is prerequisite. Phase 1 is verified.  
**Resolution path:** Phase 2 design: adaptive learning design on top of SQO doctrine. Inputs: replay logs, action outcomes, posture deltas, operator decisions, repeated blocker/action patterns. All learning must be explicit, replayable, versioned, auditable, doctrine-bound.

### GAP-05: before/after state not displayed to operator

**Severity:** Non-blocking  
**Location:** SoftwareIntelligenceField.jsx — GuidedActionCard  
**Description:** After action execution, LENS shows a result message ("Action executed — review_accept") and updated counts. It does not show a diff of prior_state vs resulting_state, or the full event record.  
**Impact:** Operator sees the outcome (count changed, status updated) but not the governance record of what changed.  
**Resolution path:** Display the returned event object (prior_state, resulting_state, semantic_disposition) in the result area before page reload.
