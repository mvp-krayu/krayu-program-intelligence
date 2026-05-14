# Overlay Proposal Workflow

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the canonical governed workflow by which semantic overlay
proposals are constructed, scoped, impact-assessed, and submitted
for governance review — ensuring no overlay reaches activation
without formal proposal, review, and replay-safe authorization.

---

## 2. Proposal Workflow Overview

### 2.1 Eight-Phase Proposal Pipeline

```
Phase 1: Proposal Initiation
    │   Operator declares intent to evolve semantic state
    ▼
Phase 2: Package Selection
    │   Select STAGED packages for this proposal
    ▼
Phase 3: Overlay Classification
    │   Classify overlay by type, sensitivity, and impact category
    ▼
Phase 4: Impact Assessment
    │   Compute qualification, governance, and coexistence impact
    ▼
Phase 5: Replay Safety Assessment
    │   Verify proposal does not introduce replay ambiguity
    ▼
Phase 6: Rollback Safety Assessment
    │   Verify proposal is independently removable
    ▼
Phase 7: Governance Zone Projection
    │   Project governance zone after proposed activation
    ▼
Phase 8: Proposal Submission
    │   Submit formal proposal for governance review
    ▼
[Output: SUBMITTED proposal — awaiting review and approval]
```

### 2.2 Proposal Boundary Rule

An overlay proposal is a governed document that describes intended
semantic evolution. The proposal itself changes no sandbox state.
Proposals are freely constructible, revocable, and modifiable
until submitted. Once SUBMITTED, a proposal enters the review
pipeline and cannot be modified without withdrawal and re-submission.

---

## 3. Phase 1: Proposal Initiation

### 3.1 Initiation Process

```
STEP 1: Declare progression intent
  - Operator identifies target S-state or qualification improvement
  - Operator identifies target domains for evidence application
  - Operator records strategic rationale for this iteration

STEP 2: Verify eligibility
  - Current governance zone permits proposals (≤ PRESSURE)
  - Current escalation level permits proposals (≤ G-1)
  - Current iteration has capacity for new overlays
  - No active fail-closed conditions block proposals

STEP 3: Create proposal envelope
  - proposal_id: PROP-<client>-<run_id>-<seq> (monotonic)
  - status: DRAFT
  - initiated_by: <operator identity>
  - initiated_at: <ISO-8601>
  - target: <S-state target or qualification target>
```

### 3.2 Initiation Gate (G-INITIATE)

| Check | Requirement |
|-------|------------|
| Governance zone | ≤ PRESSURE (RISK/PROHIBITED block proposals) |
| Escalation level | ≤ G-1 (G-2+ blocks proposals) |
| No active fail-closed | No FC-01 through FC-10 active |
| Operator identity recorded | Who initiated this proposal |
| Strategic rationale stated | Why this evolution is being proposed |

---

## 4. Phase 2: Package Selection

### 4.1 Selection Process

```
STEP 1: Review available STAGED packages
  - List all packages with status = STAGED
  - Filter by relevance to target domains
  - Filter by trust level (TRUSTED or PROVISIONAL)

STEP 2: Select batch for this proposal
  - Respect batch activation limit (≤ 5 per iteration)
  - Respect total package limit (≤ 10 active + staged)
  - Order by package_id (deterministic activation order)

STEP 3: Verify package readiness
  - Each selected package has passed G-PKG-REGISTER
  - Each selected package has complete provenance chain
  - Each selected package has replay binding attestation
  - No selected package is QUARANTINED

STEP 4: Lock package selection
  - Record selected packages in proposal
  - Generate PACKAGES_SELECTED proposal event
```

### 4.2 Selection Gate (G-SELECT-OVERLAY)

| Check | Requirement |
|-------|------------|
| All packages STAGED | No ACTIVATED, REVOKED, or QUARANTINED packages selected |
| Batch size ≤ 5 | Batch activation limit respected |
| Total packages ≤ 10 | Architectural limit (active + staged + selected) |
| All packages replay-bound | G-REPLAY-BIND passed for each package |
| All packages provenance-complete | Full lineage chain verified |
| Trust level valid | All packages from TRUSTED or PROVISIONAL evidence |

---

## 5. Phase 3: Overlay Classification

See: OVERLAY_CLASSIFICATION_AND_TRUST_MODEL.md for full model.

### 5.1 Classification Summary

```
FOR each package in proposal:
  CLASSIFY by:
    - Overlay type (continuity, grounding, lineage, etc.)
    - Sensitivity level (STANDARD, REPLAY-SENSITIVE, ROLLBACK-SENSITIVE)
    - Certification impact (CERTIFICATION-IMPACTING or STANDARD)
    - Qualification impact (backed_count, grounding, continuity, typing)
```

---

## 6. Phase 4: Impact Assessment

### 6.1 Impact Assessment Process

```
STEP 1: Compute qualification impact
  FOR each package:
    - backed_count delta (current → projected)
    - grounding_ratio delta
    - continuity delta
    - debt_items_resolved count
    - S-state impact (will this push toward next S-state?)

STEP 2: Compute governance impact
  - Overlay saturation ratio (current → projected)
  - Coexistence density (N(N-1)/2 with N = total active + proposed)
  - Re-evaluation queue depth impact
  - Dependency depth impact
  - Governance zone projection

STEP 3: Compute coexistence impact
  FOR each proposed package vs each existing active overlay:
    - Domain overlap check
    - Dependency check (does proposed depend on existing or vice versa?)
    - Conflict check (competing claims on same domain+field?)
  Record all pairwise assessments

STEP 4: Compute risk assessment
  - Zone transition risk (SAFE → PRESSURE, PRESSURE → RISK)
  - Rollback cascade risk (if proposed overlay must be revoked)
  - S-state regression risk (if S3 is achieved, what if overlay fails?)
  - Certification timeline impact
```

### 6.2 Impact Assessment Record

```json
{
  "impact_assessment": {
    "proposal_id": "PROP-blueedge-CLU-04-002",
    "qualification_impact": {
      "backed_count": { "current": 7, "projected": 10, "delta": 3 },
      "grounding_ratio": { "current": 0.412, "projected": 0.588, "delta": 0.176 },
      "s_state_impact": "Moves toward S3 (10/17 backed, 7 remaining)",
      "debt_items_resolved": 3
    },
    "governance_impact": {
      "overlay_count": { "current": 3, "projected": 5, "within_safe": true },
      "coexistence_checks": { "current": 3, "projected": 10, "within_safe": true },
      "dependency_depth": { "current": 0, "projected": 0 },
      "zone_projection": "SAFE → SAFE"
    },
    "coexistence_assessment": {
      "pairwise_checks": 10,
      "domain_overlaps": 0,
      "dependency_chains": 0,
      "conflicts": 0
    },
    "risk_assessment": {
      "zone_transition_risk": "LOW — remains in SAFE zone",
      "rollback_cascade_risk": "LOW — independent overlays",
      "s_state_regression_risk": "N/A — S3 not yet achieved",
      "overall_risk": "LOW"
    }
  }
}
```

### 6.3 Impact Gate (G-IMPACT)

| Check | Requirement |
|-------|------------|
| Qualification impact computed | All deltas calculated |
| Governance impact computed | Zone projection, coexistence, dependencies |
| Zero critical conflicts | No competing claims on same domain+field |
| Dependency depth ≤ 2 | No deep dependency chains |
| Zone projection ≤ PRESSURE | Activation would not push to RISK |
| Risk assessment complete | All 4 risk dimensions evaluated |

---

## 7. Phase 5: Replay Safety Assessment

### 7.1 Replay Safety Checks

```
FOR each package in proposal:
  CHECK 1: All entries have replay_safe = true
  CHECK 2: Application order is deterministic (monotonic IDs)
  CHECK 3: Conflict resolution is deterministic (later wins, higher confidence wins)
  CHECK 4: No entry requires interpretation (no 75.x dependency)
  CHECK 5: Evidence source hash is verified
  CHECK 6: Package hash matches registration hash

IF all checks PASS:
  → replay_authorization = AUTHORIZED
  → Record in proposal

IF any check FAILS:
  → replay_authorization = DENIED
  → Proposal cannot proceed
  → Record failure reason
```

### 7.2 Replay Gate (G-REPLAY-PROPOSAL)

| Check | Requirement |
|-------|------------|
| All entries replay-safe | replay_safe = true on every entry |
| Application order deterministic | Package and entry IDs monotonic |
| Conflict resolution deterministic | Rules explicit, no ambiguity |
| No interpretation dependency | No 75.x authorization required |
| Source hashes verified | All evidence source hashes match |
| Package hashes verified | All package hashes match registration |

---

## 8. Phase 6: Rollback Safety Assessment

### 8.1 Rollback Safety Checks

```
FOR each package in proposal:
  CHECK 1: Package is independently removable
  CHECK 2: No other active overlay depends on this package's claims
  CHECK 3: Removal restores prior composite state exactly
  CHECK 4: No irreversible side-effects from activation
  CHECK 5: Rollback does not cascade beyond this package

FOR the batch as a whole:
  CHECK 6: Batch can be partially rolled back (any subset removable)
  CHECK 7: Batch rollback order does not matter for final state

IF all checks PASS:
  → rollback_authorization = AUTHORIZED
  → Record in proposal

IF any check FAILS:
  → rollback_authorization = DENIED
  → Record failure with specific dependency or cascade issue
  → Proposal may proceed with CONDITIONS if operator accepts risk
```

### 8.2 Rollback Gate (G-ROLLBACK-PROPOSAL)

| Check | Requirement |
|-------|------------|
| Independent removability | Each package removable without affecting others |
| No inbound dependencies | No existing overlay depends on proposed claims |
| State restoration exact | Removal produces T0=T6 equivalence |
| No irreversible effects | Activation is fully reversible |
| Partial rollback safe | Any subset of batch can be removed independently |

---

## 9. Phase 7: Governance Zone Projection

### 9.1 Zone Projection Process

```
STEP 1: Compute projected state after activation
  projected_overlays = current_active + proposed_count
  projected_entries = current_entries + proposed_entries
  projected_coexistence = N(N-1)/2 where N = projected_overlays
  projected_dependencies = max(current_depth, proposed_depth)

STEP 2: Evaluate projected zone
  projected_zone = evaluateGovernanceZone(projected_state)

STEP 3: Determine zone-appropriate action
  IF projected_zone == SAFE:
    → PROCEED (standard activation)
  IF projected_zone == PRESSURE:
    → PROCEED with ENHANCED REVIEW (operator must acknowledge pressure)
  IF projected_zone == RISK:
    → BLOCK proposal (would enter unsafe territory)
  IF projected_zone == PROHIBITED:
    → BLOCK proposal (architectural violation)
```

### 9.2 Zone Projection Gate (G-ZONE-PROPOSAL)

| Check | Requirement |
|-------|------------|
| Projected zone computed | Zone evaluation completed |
| Zone ≤ PRESSURE | Activation would not push to RISK |
| PRESSURE acknowledged | If zone = PRESSURE, operator has acknowledged |
| Architectural limits | Projected overlays ≤ 10, entries ≤ 200 |

---

## 10. Phase 8: Proposal Submission

### 10.1 Submission Process

```
STEP 1: Final pre-submission validation
  - All 7 prior phases complete
  - All gates passed (or CONDITIONS explicitly accepted)
  - Proposal document is complete

STEP 2: Compile proposal document
  - Proposal envelope (ID, operator, target, rationale)
  - Selected packages with classification
  - Impact assessment (qualification, governance, coexistence, risk)
  - Replay safety assessment (AUTHORIZED / DENIED)
  - Rollback safety assessment (AUTHORIZED / DENIED / CONDITIONAL)
  - Zone projection (projected zone, transition risk)

STEP 3: Submit for review
  - Status: DRAFT → SUBMITTED
  - Generate PROPOSAL_SUBMITTED event
  - Proposal enters review pipeline (G-PROPOSAL gate)
  - Proposal is immutable once SUBMITTED

STEP 4: Record submission
  - Full proposal persisted in governance trail
  - Submission timestamp and operator identity recorded
```

### 10.2 Submission Gate (G-SUBMIT)

| Check | Requirement |
|-------|------------|
| All prior phases complete | Phases 1–7 passed |
| Replay authorized | replay_authorization = AUTHORIZED |
| Rollback authorized | rollback_authorization = AUTHORIZED or CONDITIONAL |
| Zone projection safe | projected_zone ≤ PRESSURE |
| Impact assessment complete | All dimensions computed |
| Proposal document complete | All sections populated |

---

## 11. Proposal States

### 11.1 Proposal Lifecycle

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED → AUTHORIZED
                        │                        │
                        ├→ REVISION_REQUESTED     ├→ ACTIVATED (downstream)
                        │     │                   │
                        │     └→ RESUBMITTED ─────┘ (back to UNDER_REVIEW)
                        │
                        ├→ REJECTED
                        │
                        ├→ DEFERRED
                        │
                        └→ ESCALATED → GOVERNANCE_REVIEW → APPROVED / REJECTED
```

### 11.2 State Definitions

| State | Definition | Who Can Transition |
|-------|-----------|-------------------|
| DRAFT | Proposal being constructed | OPERATOR |
| SUBMITTED | Proposal submitted for review | OPERATOR (immutable once set) |
| UNDER_REVIEW | Governance reviewing proposal | GOVERNANCE |
| APPROVED | Governance approves proposal | GOVERNANCE |
| AUTHORIZED | Operator authorizes activation | OPERATOR |
| REVISION_REQUESTED | Governance requests changes | GOVERNANCE |
| RESUBMITTED | Revised proposal re-submitted | OPERATOR |
| REJECTED | Proposal denied | GOVERNANCE |
| DEFERRED | Decision postponed | GOVERNANCE |
| ESCALATED | Elevated to higher governance | GOVERNANCE |
| ACTIVATED | Overlays activated (downstream) | SANDBOX |
| WITHDRAWN | Operator withdraws proposal | OPERATOR |

---

## 12. Proposal Persistence

### 12.1 Artifact Structure

```
artifacts/sqo/<client>/<run_id>/proposals/
├── PROP-<client>-<run_id>-001.json
├── PROP-<client>-<run_id>-002.json
├── proposal_registry.json
└── proposal_event_log.json
```

### 12.2 Proposal Registry

```json
{
  "proposal_registry": {
    "client": "<client_id>",
    "run_id": "<run_id>",
    "proposals": [
      {
        "proposal_id": "PROP-blueedge-CLU-04-001",
        "status": "ACTIVATED",
        "packages": ["SEP-multi-001", "SEP-multi-002", "SEP-multi-003"],
        "submitted_at": "<ISO-8601>",
        "approved_at": "<ISO-8601>",
        "authorized_at": "<ISO-8601>",
        "activated_at": "<ISO-8601>"
      }
    ],
    "total_proposals": 1,
    "active_proposals": 0,
    "pending_proposals": 0
  }
}
```

---

## 13. Governance

- 8-phase proposal pipeline ensures no overlay reaches activation without formal governance
- 8 proposal-specific gates enforce deterministic validation at each phase
- Proposals are immutable once SUBMITTED — modifications require withdrawal and re-submission
- Impact assessment covers qualification, governance, coexistence, and risk dimensions
- Replay and rollback safety are assessed before submission
- Zone projection prevents proposals that would push beyond PRESSURE
- 12 proposal states cover the complete governance lifecycle
- Every proposal phase produces an auditable event
- No overlay may activate without passing through this workflow
