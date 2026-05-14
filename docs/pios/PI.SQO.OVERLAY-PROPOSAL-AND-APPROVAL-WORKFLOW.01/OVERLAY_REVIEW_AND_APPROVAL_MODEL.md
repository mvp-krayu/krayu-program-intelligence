# Overlay Review and Approval Model

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define how submitted overlay proposals undergo governance review,
qualification review, certification review, and operator approval —
ensuring overlay authorization is reconstructable, attributable,
and governance-bounded.

---

## 2. Review Pipeline

### 2.1 Four-Stage Review Pipeline

```
Stage A: Governance Review
    │   Gate evaluation, zone compliance, fail-closed check
    ▼
Stage B: Qualification Review
    │   Impact verification, applicability confirmation
    ▼
Stage C: Replay/Rollback Review
    │   Safety verification, determinism confirmation
    ▼
Stage D: Operator Authorization
    │   Final operator decision with full awareness
    ▼
[Output: AUTHORIZED proposal — ready for activation]
```

### 2.2 Review Principle

Every review stage produces an explicit, attributable decision.
No review stage may produce a silent PASS — every stage must
record its decision with reviewer identity, timestamp, and
rationale.

---

## 3. Stage A: Governance Review

### 3.1 Governance Review Process

```
STEP 1: Gate evaluation
  - Evaluate G-PROPOSAL gate:
    - Projected zone ≤ PRESSURE
    - Overlay count within limits
    - Coexistence density acceptable
    - Dependency depth ≤ 2
    - Entry count within limits
    - Batch size ≤ 5

STEP 2: Cross-cutting gate evaluation
  - G-ZONE: current zone permits proposals
  - G-ENTROPY: zero structural entropy
  - G-BASELINE: certified baseline unchanged
  - G-OVERLOAD: governance overload ≤ ELEVATED
  - G-ESCALATION: escalation level ≤ G-1
  - G-AUDIT: audit chain integrity

STEP 3: Fail-closed check
  - No active FC-01 through FC-10 conditions
  - No pending QUARANTINE on selected packages
  - No pending trust violations

STEP 4: Governance decision
  - PASS: all gates pass, no fail-closed conditions
  - FAIL: one or more gates fail → proposal blocked
  - CONDITIONAL: gates pass with conditions → conditions recorded
```

### 3.2 Governance Review Record

```json
{
  "governance_review": {
    "proposal_id": "PROP-blueedge-CLU-04-002",
    "stage": "A",
    "reviewer": "governance_framework",
    "timestamp": "<ISO-8601>",
    "decision": "PASS",
    "gate_results": {
      "G-PROPOSAL": "PASS",
      "G-ZONE": "PASS (SAFE)",
      "G-ENTROPY": "PASS (0 indicators)",
      "G-BASELINE": "PASS (verified)",
      "G-OVERLOAD": "PASS (NORMAL)",
      "G-ESCALATION": "PASS (G-0)",
      "G-AUDIT": "PASS (chain valid)"
    },
    "fail_closed_conditions": "NONE",
    "conditions": null
  }
}
```

---

## 4. Stage B: Qualification Review

### 4.1 Qualification Review Process

```
STEP 1: Impact verification
  - Verify computed qualification deltas are reasonable
  - Verify no claim exceeds its evidence basis
  - Verify no claim targets a saturated domain

STEP 2: Applicability confirmation
  - Each entry's claim_type is valid for its semantic_class
  - Each entry's target_domain is overlay-eligible
  - Each entry's confidence_basis meets minimum requirements

STEP 3: S-state impact analysis
  - Will this proposal push toward S3?
  - If S3 threshold is crossed: enhanced scrutiny required
  - S-state regression risk assessment (what happens if revoked)

STEP 4: Qualification review decision
  - PASS: all impact projections verified
  - FAIL: impact projections invalid → revision requested
  - CONDITIONAL: passed with S-state regression caveat
```

### 4.2 Qualification Review Gate (G-QUALIFY-PROPOSAL)

| Check | Requirement |
|-------|------------|
| Impact projections verified | Deltas are mathematically correct |
| Applicability confirmed | All entries target eligible domains with authorized classes |
| Confidence meets minimum | All entries ≥ STRONG_INFERENCE for LINEAGE_UPGRADE |
| S-state impact analyzed | Regression risk documented if applicable |
| No oversaturated domains | No domain already at maximum coverage for claim type |

---

## 5. Stage C: Replay/Rollback Review

### 5.1 Replay Review Process

```
STEP 1: Verify replay safety attestation
  - All entries have replay_safe = true
  - Application order is deterministic
  - Conflict resolution is deterministic
  - No interpretation dependency

STEP 2: Verify rollback safety attestation
  - All packages are independently removable
  - No inbound dependencies from existing overlays
  - Removal restores prior state exactly
  - Batch is partially rollback-safe

STEP 3: Sensitivity-specific review
  IF sensitivity = REPLAY-SENSITIVE:
    - Enhanced ordering verification
    - Conflict resolution trace computed
    - Ordering dependency explicitly documented
  IF sensitivity = ROLLBACK-SENSITIVE:
    - Cascade rollback analysis
    - Dependency chain documentation
    - S-state regression scenario documented

STEP 4: Safety review decision
  - PASS: all safety checks verified
  - FAIL: safety violation detected → proposal blocked
  - CONDITIONAL: passed with documented risk accepted by operator
```

### 5.2 Safety Review Gate (G-SAFETY-PROPOSAL)

| Check | Requirement |
|-------|------------|
| Replay attestation verified | All entries replay-safe with deterministic ordering |
| Rollback attestation verified | All packages independently removable |
| Sensitivity-specific review complete | Enhanced review for REPLAY/ROLLBACK-SENSITIVE overlays |
| No safety violations | No determinism or reversibility concerns |

---

## 6. Stage D: Operator Authorization

### 6.1 Authorization Process

```
STEP 1: Operator reviews complete proposal
  - Impact assessment summary
  - Governance review results
  - Qualification review results
  - Safety review results
  - Risk assessment summary
  - Conditions (if any)

STEP 2: Operator makes authorization decision
  - AUTHORIZE: proceed to activation
  - AUTHORIZE_PARTIAL: authorize subset of packages
  - DENY: reject proposal (reason recorded)
  - DEFER: postpone decision (reason recorded)

STEP 3: Record authorization
  - Decision, operator identity, timestamp
  - Scope (which packages authorized)
  - Conditions accepted (if any)
  - Escalation level at time of decision

STEP 4: Update proposal state
  - APPROVED + AUTHORIZED → ready for activation
  - DENIED → proposal enters REJECTED state
  - DEFERRED → proposal enters DEFERRED state
```

### 6.2 Authorization Requirements by Escalation Level

| Escalation Level | Authorization Requirements |
|-----------------|---------------------------|
| G-0 (Standard) | Single operator authorization sufficient |
| G-1 (Enhanced) | Operator authorization + governance awareness acknowledgment |
| G-2 (Restricted) | Proposals blocked — no authorization possible |
| G-3 (Blocked) | Proposals blocked — no authorization possible |
| G-4 (Emergency) | Proposals blocked — no authorization possible |

### 6.3 Authorization Gate (G-AUTHORIZE)

| Check | Requirement |
|-------|------------|
| All prior stages passed | Governance, qualification, safety reviews complete |
| Operator identity verified | Authorized operator for current escalation level |
| Decision recorded | AUTHORIZE, AUTHORIZE_PARTIAL, DENY, or DEFER |
| Scope explicit | Which packages, which conditions |
| Conditions accepted | If any conditions, operator has acknowledged |

---

## 7. Review Audit Trail

### 7.1 Per-Stage Audit

Every review stage produces an audit record:

```json
{
  "review_audit": {
    "proposal_id": "PROP-blueedge-CLU-04-002",
    "review_stage": "D",
    "review_stage_name": "Operator Authorization",
    "decision": "AUTHORIZE",
    "reviewer": "<operator identity>",
    "reviewer_type": "OPERATOR",
    "timestamp": "<ISO-8601>",
    "escalation_level": "G-0",
    "governance_zone": "SAFE",
    "packages_authorized": ["SEP-batch-001", "SEP-batch-002"],
    "conditions_accepted": null,
    "rationale": "Impact projections reviewed, risk assessment LOW"
  }
}
```

### 7.2 Decision Immutability

Once a review decision is recorded, it cannot be modified.
To change a decision, the proposal must be WITHDRAWN and
re-submitted as a new proposal.

---

## 8. Revision Request Workflow

### 8.1 When Revision Is Requested

```
IF governance review identifies fixable issues:
  OR qualification review finds incorrect projections:
  OR safety review finds resolvable concerns:

  STEP 1: Mark proposal as REVISION_REQUESTED
  STEP 2: Record specific revision requirements
  STEP 3: Operator revises proposal (new package selection, updated impact)
  STEP 4: Operator re-submits as RESUBMITTED
  STEP 5: Proposal re-enters review pipeline at Stage A
```

### 8.2 Revision Limits

| Limit | Value | Rationale |
|-------|-------|-----------|
| Maximum revisions per proposal | 3 | Prevent infinite revision cycles |
| After 3 revisions | Proposal must be WITHDRAWN | Fundamental redesign needed |
| Revision scope | Limited to identified issues | Cannot introduce new packages |

---

## 9. Governance

- 4-stage review pipeline ensures comprehensive governance coverage
- Governance, qualification, safety, and operator reviews are sequentially enforced
- Every review decision is attributable (reviewer identity + timestamp + rationale)
- Authorization requires all prior stages to pass
- Escalation level constrains authorization requirements (G-2+ blocks proposals)
- Revision workflow allows fixable issues without full rejection
- Maximum 3 revisions prevents infinite cycles
- Review decisions are immutable once recorded
- Full audit trail for every review stage
