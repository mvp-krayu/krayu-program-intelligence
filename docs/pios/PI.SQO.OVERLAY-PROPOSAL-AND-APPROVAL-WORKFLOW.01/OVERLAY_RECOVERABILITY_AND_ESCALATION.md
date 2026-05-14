# Overlay Recoverability and Escalation

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how overlay proposal and approval failures recover, escalate,
and fail closed — ensuring no governance failure corrupts
qualification authority or governance stability.

---

## 2. Failure Categories

### 2.1 Proposal Pipeline Failures

| Category | Examples | Severity | Impact |
|----------|----------|----------|--------|
| Initiation failure | Zone blocks, escalation blocks | LOW | No proposal created — retry when zone permits |
| Selection failure | Packages ineligible, limits exceeded | LOW | No proposal — revise selection |
| Classification failure | Indeterminate type (should not occur) | LOW | Re-classify based on entries |
| Impact assessment failure | Computation error, missing data | LOW | Re-compute impact |
| Replay safety failure | Non-determinism detected, hash mismatch | MEDIUM | Proposal blocked — investigate |
| Rollback safety failure | Dependency detected, cascade risk | MEDIUM | Proposal blocked — restructure |
| Zone projection failure | Would enter RISK zone | MEDIUM | Proposal blocked — reduce scope |
| Submission failure | Gate failure, incomplete proposal | LOW | Fix and re-submit |

### 2.2 Review Pipeline Failures

| Category | Examples | Severity | Impact |
|----------|----------|----------|--------|
| Governance review failure | Gate fails, fail-closed active | MEDIUM | Proposal blocked — address condition |
| Qualification review failure | Impact invalid, domain saturated | LOW | Revision requested — fix impact |
| Safety review failure | Replay/rollback checks fail | MEDIUM | Proposal blocked — restructure |
| Authorization denial | Operator denies | LOW | Revise and re-submit |

### 2.3 Post-Approval Failures

| Category | Examples | Severity | Impact |
|----------|----------|----------|--------|
| Trust violation post-approval | Evidence trust degrades | HIGH | QUARANTINE — suspend overlay |
| Replay divergence post-activation | Replay DIVERGENCE detected | CRITICAL | FREEZE — G-4 escalation |
| Rollback failure post-activation | Cannot remove overlay cleanly | HIGH | Governance escalation |
| Supersession failure | New version causes conflict | MEDIUM | Supersession rejected — retain current |
| Cascade revocation failure | Cascade exceeds limits | HIGH | G-2 escalation — governance review |

### 2.4 Key Insight: Pre-Submission Failures Are Costless

Proposal pipeline failures (Phases 1–8) have ZERO governance state
impact. No sandbox state changes. No qualification impact. These
failures are freely retryable.

---

## 3. Recovery Mechanisms

### 3.1 Proposal Pipeline Recovery

| Failure | Recovery | Cost |
|---------|---------|------|
| Zone blocks proposal | Wait for zone recovery or reduce scope | ZERO — retry |
| Package ineligible | Select different packages | ZERO — retry |
| Replay safety fails | Investigate non-determinism, fix evidence | LOW — re-intake may be needed |
| Rollback safety fails | Restructure packages to remove dependencies | LOW — re-packaging may be needed |
| Zone projection RISK | Reduce batch size, consolidate packages | ZERO — retry with smaller scope |
| Gate failure | Address failing condition | ZERO — retry |
| Authorization denied | Revise per operator feedback | ZERO — new proposal |

### 3.2 Review Pipeline Recovery

| Failure | Recovery | Cost |
|---------|---------|------|
| Governance review fails | Address gate condition, re-submit | ZERO — new proposal |
| Qualification review fails | Revise impact, re-assess | ZERO — revision or new proposal |
| Safety review fails | Restructure packages | LOW — re-packaging |
| Repeated rejections (3+) | Fundamental redesign, different approach | MODERATE — strategy change |

### 3.3 Post-Approval Recovery

| Failure | Recovery | Cost |
|---------|---------|------|
| Trust violation (pre-activation) | QUARANTINE, investigate, resolve or reject | LOW — no sandbox impact |
| Trust violation (post-activation) | SUSPEND overlay, investigate, revoke if confirmed | MODERATE — qualification may regress |
| Replay divergence | FREEZE sandbox, investigate, recover from last MATCH | HIGH — potential iteration loss |
| Rollback failure | Investigate, may require package restructuring | HIGH — potential iteration loss |
| Cascade exceeds limits | G-2 escalation, governance review, selective remediation | HIGH — governance board action |
| Supersession failure | Retain current version, investigate conflict | LOW — keep existing overlay |

---

## 4. Escalation Model

### 4.1 Overlay-Specific Escalation Triggers

| Trigger | From Level | To Level | Action |
|---------|-----------|----------|--------|
| Replay safety failure in proposal | G-0 | G-1 | Enhanced review, investigation |
| 3rd consecutive rejection | G-0 | G-1 | Review proposal approach |
| Trust violation post-approval | G-0 | G-2 | Quarantine, governance review |
| Rollback dependency detected | G-1 | G-2 | Dependency chain analysis |
| Cascade revocation exceeds limits | G-1 | G-2 | Governance review board |
| Replay divergence post-activation | Any | G-4 | Immediate freeze |
| Zone transition to RISK | G-0 | G-2 | All proposals blocked |
| Zone transition to PROHIBITED | Any | G-3/G-4 | Mandatory recovery |

### 4.2 Escalation Impact on Overlay Governance

| Level | New Proposals | Existing Proposals | Active Overlays |
|-------|:------------:|:------------------:|:---------------:|
| G-0 | PERMITTED | Standard review | Normal operations |
| G-1 | PERMITTED (enhanced) | Enhanced review | Enhanced monitoring |
| G-2 | BLOCKED | DEFERRED | Under enhanced monitoring |
| G-3 | BLOCKED | FROZEN | Under governance review |
| G-4 | FROZEN | FROZEN | Pipeline frozen |

### 4.3 De-Escalation Through Recovery

| Current Level | De-Escalation Condition | New Level |
|--------------|------------------------|-----------|
| G-4 | Emergency resolved, root cause identified, replay verified | G-3 |
| G-3 | Governance review complete, remediation verified | G-2 |
| G-2 | Trust restored, quarantines resolved, zone ≤ PRESSURE | G-1 |
| G-1 | All enhanced conditions resolved, normal operations | G-0 |

---

## 5. Fail-Closed Conditions

### 5.1 Overlay-Specific Fail-Closed Rules

| # | Condition | Gate | Action |
|---|-----------|------|--------|
| OFC-01 | Proposal in RISK/PROHIBITED zone | G-INITIATE | BLOCK proposal |
| OFC-02 | Zone projection exceeds PRESSURE | G-ZONE-PROPOSAL | BLOCK proposal |
| OFC-03 | Replay safety check fails | G-REPLAY-PROPOSAL | BLOCK proposal |
| OFC-04 | Rollback safety check fails (BLOCK severity) | G-ROLLBACK-PROPOSAL | BLOCK proposal |
| OFC-05 | Active fail-closed condition (FC-01–FC-10) | G-SUBMIT | BLOCK submission |
| OFC-06 | Trust violation in selected packages | G-SELECT-OVERLAY | BLOCK selection |
| OFC-07 | Architectural limit exceeded | G-SELECT-OVERLAY | BLOCK selection |
| OFC-08 | Replay divergence in overlay-derived state | G-SAFETY-PROPOSAL | FREEZE + G-4 |
| OFC-09 | Cascade revocation exceeds limits (>5 overlays) | G-ROLLBACK-PROPOSAL | G-2 escalation |
| OFC-10 | Authorization at blocked escalation level (≥ G-2) | G-AUTHORIZE | BLOCK authorization |

### 5.2 Fail-Closed Severity

| Severity | Conditions | Response |
|----------|-----------|----------|
| CRITICAL | OFC-08 | Immediate freeze, G-4 escalation |
| HIGH | OFC-09 | Governance review board, G-2 escalation |
| STANDARD | OFC-01–OFC-07, OFC-10 | Block action, operator notification |

---

## 6. Recovery Guarantees

### 6.1 Always-Recoverable Properties

| Property | Guarantee |
|----------|----------|
| Proposal registry | ALWAYS restorable (append-only) |
| Review decisions | ALWAYS traceable (audit trail preserved) |
| Approval history | ALWAYS reconstructable (event log) |
| Rejection reasons | ALWAYS preserved (immutable records) |
| Supersession history | ALWAYS visible (version tracking) |
| Quarantine history | ALWAYS preserved (investigation records) |

### 6.2 Recovery Cost by Scenario

| Scenario | Recovery Cost | Governance Impact |
|----------|-------------|------------------|
| Proposal pipeline failure | ZERO | Retry at failed phase |
| Review pipeline failure | ZERO | New proposal or revision |
| Authorization denial | ZERO | Revised proposal |
| Trust violation (pre-activation) | LOW | Quarantine and investigate |
| Trust violation (post-activation) | MODERATE | Suspend, possible revocation |
| Replay divergence | HIGH | Freeze, investigate, recover |
| Cascade exceeds limits | HIGH | Governance board, selective remediation |
| Zone enters PROHIBITED | MAXIMUM | Mandatory recovery, possible full reset |

---

## 7. Governance

- Pre-submission failures are costless — freely retryable
- Post-approval failures require proportional recovery
- 10 overlay-specific fail-closed conditions prevent unsafe progression
- 8 escalation triggers map failures to governance levels
- De-escalation requires specific resolution conditions
- Recovery guarantees ensure all governance state is always restorable
- Every failure, escalation, and recovery action is audit-logged
- Fail-closed prevents any unsafe overlay progression
