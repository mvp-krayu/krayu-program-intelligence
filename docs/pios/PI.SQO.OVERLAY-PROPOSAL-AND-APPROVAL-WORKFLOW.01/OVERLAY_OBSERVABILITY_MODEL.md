# Overlay Observability Model

**Stream:** PI.SQO.OVERLAY-PROPOSAL-AND-APPROVAL-WORKFLOW.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define continuous observability into overlay governance state —
ensuring proposal state, trust state, approval state, rejection
state, replay/rollback authorization, supersession state, and
governance-zone state remain externally visible at all times.

---

## 2. Eight Overlay Governance Observability Dimensions

| # | Dimension | Question | Observable Artifact |
|---|-----------|----------|-------------------|
| 1 | Proposal state | What proposals exist and what is their status? | proposal_registry.json |
| 2 | Trust state | What trust level does each overlay have? | overlay_trust_state.json |
| 3 | Approval state | Which proposals are approved, which are pending? | approval_registry.json |
| 4 | Rejection state | Which proposals were rejected and why? | rejection_log.json |
| 5 | Replay authorization state | Which overlays are replay-authorized? | replay_authorization.json |
| 6 | Rollback authorization state | Which overlays are rollback-authorized? | rollback_authorization.json |
| 7 | Supersession state | Which overlays have been superseded? | supersession_log.json |
| 8 | Governance zone state | How does overlay governance relate to zone? | zone_overlay_status.json |

---

## 3. Overlay Governance Dashboard

### 3.1 At-a-Glance View

```
┌─────────────────────────────────────────────────────┐
│  OVERLAY GOVERNANCE — BlueEdge / CLU-04             │
│                                                     │
│  Proposals: 2 total, 1 ACTIVATED, 1 DRAFT           │
│  Approvals: 1 AUTHORIZED, 0 pending review          │
│  Rejections: 0 rejected, 0 quarantined              │
│                                                     │
│  Trust:                                             │
│    PROPOSAL-TRUSTED: 1    CERTIFICATION-AUTH: 0     │
│    ROLLBACK-AUTH: 0       QUARANTINED: 0            │
│                                                     │
│  Overlay Status:                                    │
│    STAGED: 4     ACTIVATED: 3    REVOKED: 0         │
│    SUPERSEDED: 0  RETIRED: 0                        │
│                                                     │
│  Replay Auth: 3/3 AUTHORIZED                        │
│  Rollback Auth: 3/3 AUTHORIZED                      │
│                                                     │
│  Zone: SAFE     Escalation: G-0                     │
│  Batch capacity: 5/5 available                      │
│                                                     │
│  Health: ● HEALTHY                                  │
└─────────────────────────────────────────────────────┘
```

---

## 4. Per-Dimension Observability

### 4.1 Proposal State

```
Proposal             Status      Packages  Target   Zone     Submitted
──────────────────────────────────────────────────────────────────────
PROP-blueedge-001    ACTIVATED   3         S2→S3    SAFE     2026-01-10
PROP-blueedge-002    DRAFT       2         S2→S3    SAFE     —
```

### 4.2 Trust State

```
Package              Trust State            Evidence Trust   Sensitivity
──────────────────────────────────────────────────────────────────────
SEP-multi-001        CERTIFICATION-AUTH     TRUSTED          STANDARD
SEP-multi-002        CERTIFICATION-AUTH     TRUSTED          STANDARD
SEP-multi-003        CERTIFICATION-AUTH     TRUSTED          STANDARD
SEP-batch-001        PROPOSAL-TRUSTED       TRUSTED          STANDARD
SEP-batch-002        PROPOSAL-PROVISIONAL   PROVISIONAL      STANDARD
```

### 4.3 Approval State

```json
{
  "approval_summary": {
    "total_proposals": 2,
    "by_status": {
      "DRAFT": 1,
      "SUBMITTED": 0,
      "UNDER_REVIEW": 0,
      "APPROVED": 0,
      "AUTHORIZED": 0,
      "ACTIVATED": 1,
      "REJECTED": 0,
      "DEFERRED": 0,
      "WITHDRAWN": 0
    },
    "pending_review": 0,
    "pending_authorization": 0
  }
}
```

### 4.4 Rejection and Quarantine State

```json
{
  "rejection_quarantine_summary": {
    "total_rejected": 0,
    "total_quarantined": 0,
    "active_investigations": 0,
    "rejection_reasons": [],
    "quarantine_reasons": [],
    "resolved_this_iteration": 0
  }
}
```

### 4.5 Supersession State

```json
{
  "supersession_summary": {
    "total_superseded": 0,
    "total_retired": 0,
    "version_history": [],
    "cascade_events": 0
  }
}
```

---

## 5. Overlay Governance Event Stream

### 5.1 Event Types

| Event Type | Phase | Data |
|-----------|-------|------|
| PROPOSAL_INITIATED | Phase 1 | proposal_id, operator, target |
| PACKAGES_SELECTED | Phase 2 | proposal_id, packages, batch_size |
| OVERLAY_CLASSIFIED | Phase 3 | package_id, type, sensitivity, cert_impact |
| IMPACT_ASSESSED | Phase 4 | proposal_id, qualification, governance, risk |
| REPLAY_REVIEWED | Phase 5 | proposal_id, replay_authorization |
| ROLLBACK_REVIEWED | Phase 6 | proposal_id, rollback_authorization |
| ZONE_PROJECTED | Phase 7 | proposal_id, projected_zone |
| PROPOSAL_SUBMITTED | Phase 8 | proposal_id, status: SUBMITTED |
| GOVERNANCE_REVIEWED | Review A | proposal_id, gate_results |
| QUALIFICATION_REVIEWED | Review B | proposal_id, impact_verified |
| SAFETY_REVIEWED | Review C | proposal_id, safety_result |
| PROPOSAL_APPROVED | Review D | proposal_id, decision: APPROVE |
| PROPOSAL_AUTHORIZED | Review D | proposal_id, decision: AUTHORIZE |
| PROPOSAL_REJECTED | Any | proposal_id, rejection_type, reason |
| PROPOSAL_DEFERRED | Any | proposal_id, reason |
| PROPOSAL_WITHDRAWN | Any | proposal_id, operator |
| REVISION_REQUESTED | Review | proposal_id, revision_requirements |
| OVERLAY_QUARANTINED | Any | package_id, reason, scope |
| QUARANTINE_RESOLVED | Any | package_id, resolution |
| OVERLAY_SUPERSEDED | Supersession | package_id, old_v, new_v |
| OVERLAY_REVOKED | Revocation | package_id, reason, impact |
| OVERLAY_RETIRED | Retirement | package_id, reason |
| OVERLAY_DEAUTHORIZED | De-auth | proposal_id, operator |
| ESCALATION_TRIGGERED | Any | level_change, trigger |

---

## 6. Overlay Governance Health Indicators

### 6.1 Health Computation

```
Overlay governance health = HEALTHY if ALL of:
  - No QUARANTINED overlays
  - No pending CRITICAL rejections
  - All ACTIVATED overlays replay-authorized
  - All ACTIVATED overlays rollback-authorized
  - Governance zone ≤ PRESSURE
  - No pending trust violations
  - Escalation level ≤ G-1

Health = DEGRADED if ANY of:
  - 1-2 QUARANTINED overlays (under investigation)
  - Zone = PRESSURE with elevated indicators
  - Pending revision requests

Health = IMPAIRED if ANY of:
  - 3+ QUARANTINED overlays
  - Zone = RISK
  - ACTIVATED overlay with broken replay authorization
  - Multiple consecutive rejections

Health = CRITICAL if ANY of:
  - Zone = PROHIBITED
  - Replay divergence in overlay-derived state
  - Trust violation in ACTIVATED overlay
  - Escalation level ≥ G-3
```

---

## 7. Observability Persistence

### 7.1 Artifact Structure

```
artifacts/sqo/<client>/<run_id>/overlay_governance/
├── proposal_registry.json
├── overlay_trust_state.json
├── approval_registry.json
├── rejection_log.json
├── replay_authorization.json
├── rollback_authorization.json
├── supersession_log.json
├── zone_overlay_status.json
├── governance_health.json
├── governance_event_log.json
└── snapshots/
    ├── snapshot-proposal-001.json
    └── snapshot-iteration-002.json
```

### 7.2 Snapshot Triggers

| Trigger | Snapshot Content |
|---------|----------------|
| Proposal submitted | Full proposal with assessments |
| Proposal approved | Approval record with review results |
| Proposal rejected | Rejection record with reason |
| Overlay activated | Full governance state |
| Overlay revoked | Revocation impact + post-revocation state |
| Zone transition | Full governance state with zone context |

---

## 8. Governance

- 8 observability dimensions cover full overlay governance lifecycle
- Dashboard provides at-a-glance operator awareness
- 24 event types cover all proposal, review, approval, and lifecycle transitions
- 4-level health indicator (HEALTHY / DEGRADED / IMPAIRED / CRITICAL)
- Every governance state change produces observable event
- Quarantine and rejection states always visible
- Supersession history externally visible
- Observability artifacts persist for governance audit
- No overlay governance state is hidden from authorized operators
