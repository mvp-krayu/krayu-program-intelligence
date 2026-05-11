# Lifecycle Observability Model

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define observability into lifecycle state, qualification state,
overlay state, replay state, rollback state, certification state,
promotion state, and governance-zone state — ensuring every lifecycle
transition remains externally visible.

---

## 2. Observability Dimensions

### 2.1 Eight Lifecycle Observability Dimensions

| Dimension | Question | Observable Artifacts |
|-----------|----------|---------------------|
| Lifecycle state | What stage is the onboarding at? | lifecycle_instance.json: current_stage, iteration |
| Qualification state | What is the current qualification? | qualification_state.json: S-state, Q-class, backed |
| Overlay state | What overlays exist and in what status? | package_board.json: per-package lifecycle status |
| Replay state | Are all states replay-verified? | replay_verification_log.json: MATCH/DIVERGENCE per state |
| Rollback state | Is the system rollback-safe? | rollback_validation.json: round-trip proof, removability |
| Certification state | What has been certified? | certification_record.json: certified overlays, level |
| Promotion state | What is eligible for promotion? | promotion_review.json: eligibility per overlay |
| Governance zone state | What governance zone are we in? | zone_status.json: zone, indicators, restrictions |

### 2.2 Visibility Guarantee

Every observability dimension is:
- Externally readable (not hidden in internal computation)
- Updated in real-time (on each governance event)
- Audit-linked (every change produces audit trail entry)
- Historically reconstructable (from audit trail)

---

## 3. Lifecycle State Observability

### 3.1 Lifecycle Dashboard

```json
{
  "lifecycle_dashboard": {
    "client": "<client_id>",
    "run_id": "<run_id>",
    "lifecycle_phase": "O1",
    "current_stage": {
      "stage_number": 6,
      "stage_name": "Sandbox Activation",
      "status": "IN_PROGRESS",
      "started_at": "<timestamp>",
      "gate_status": "PASSED (G-ACTIVATE)"
    },
    "iteration": {
      "current": 2,
      "total_completed": 1,
      "overlays_activated_this_iteration": 2,
      "overlays_pending_this_iteration": 1
    },
    "progression": {
      "started_at": "<lifecycle start>",
      "current_backed": 7,
      "target_backed": 17,
      "gap": 10,
      "estimated_iterations_remaining": 3
    },
    "stage_timeline": [
      { "stage": 0, "completed": true, "duration": "5m", "result": "PASS" },
      { "stage": 1, "completed": true, "duration": "15m", "result": "PASS" },
      { "stage": 2, "completed": true, "duration": "20m", "result": "PASS" },
      { "stage": 3, "completed": true, "duration": "5m", "result": "PASS" },
      { "stage": 4, "completed": true, "duration": "10m", "result": "PASS" },
      { "stage": 5, "completed": true, "duration": "5m", "result": "PASS" },
      { "stage": 6, "completed": false, "duration": "in progress", "result": "PENDING" }
    ]
  }
}
```

### 3.2 Stage Transition Events

Every stage transition is observable:

```json
{
  "stage_transition": {
    "from_stage": 5,
    "to_stage": 6,
    "timestamp": "<ISO-8601>",
    "gate_result": "PASS",
    "cross_cutting_gates": {
      "G-ZONE": "PASS (SAFE)",
      "G-ENTROPY": "PASS (0 indicators)",
      "G-BASELINE": "PASS (4/4 hashes verified)",
      "G-OVERLOAD": "PASS (NORMAL)",
      "G-ESCALATION": "PASS (G-0)",
      "G-AUDIT": "PASS (chain valid)"
    }
  }
}
```

---

## 4. Qualification State Observability

Observable at all times:

```
S-state:       S2 [CERTIFIED]
Q-class:       Q-02 [CERTIFIED]
Backed:        7/17 [4 CERTIFIED + 3 OVERLAY]
Grounding:     41.2% [COMPOSITE]
Gap to S3:     10 domains
Iteration:     2 of ~4 estimated
```

With drill-down into per-domain status, attribution, and
progression metrics as defined in the upstream observability
architecture (PROVISIONAL_VS_CERTIFIED_STATE_MODEL).

---

## 5. Overlay State Observability

Observable per overlay:

```
Package              Status      Phase    Domains    Impact     Iteration
──────────────────────────────────────────────────────────────────────────
SEP-multi-001       REVOKED     TERMINAL  DOM-11    backed +1   1
SEP-multi-002       REVOKED     TERMINAL  DOM-02    backed +1   1
SEP-multi-003       REVOKED     TERMINAL  DOM-08    backed +1   1
SEP-batch-001       ACTIVATED   PHASE 7   DOM-03,   backed +3   2
                                          DOM-05,
                                          DOM-06
SEP-batch-002       STAGED      PHASE 1   DOM-04,   pending     2
                                          DOM-07
```

---

## 6. Certification and Promotion Observability

### 6.1 Certification Status

```json
{
  "certification_status": {
    "last_certification": {
      "timestamp": "<ISO-8601>",
      "decision": "CERTIFY",
      "overlays_certified": ["SEP-multi-001", "SEP-multi-002", "SEP-multi-003"],
      "domains_certified": ["DOMAIN-11", "DOMAIN-02", "DOMAIN-08"],
      "certification_level": "OVERLAY_VERIFIED"
    },
    "pending_certification": {
      "overlays_awaiting": ["SEP-batch-001"],
      "promotion_eligibility": "ELIGIBLE (7/7 checks PASS)"
    },
    "publication_status": {
      "last_published": "<timestamp>",
      "published_state": "S2, Q-02, 7/17 backed",
      "retracted": false
    }
  }
}
```

---

## 7. Governance Zone Observability

### 7.1 Zone Dashboard

```
Current Zone:   SAFE
Escalation:     G-0 (Standard)
Overlay Count:  4 / 10 (40%)
Dep Depth:      0
Coexistence:    6 pairwise checks (≤15)
Overload:       NORMAL
Entropy:        0 indicators
Observability:  7/7 VISIBLE

Projected (after pending activations):
  Zone:         SAFE → SAFE
  Overlay Count: 6 / 10 (60%)
  Coexistence:   15 pairwise checks (boundary)
```

### 7.2 Zone History

```json
{
  "zone_history": [
    { "zone": "SAFE", "from": "<start>", "to": null, "duration": "current" }
  ],
  "zone_transitions": 0,
  "max_zone_reached": "SAFE"
}
```

---

## 8. Consolidated Observability View

### 8.1 Lifecycle Summary Card

For operator at-a-glance consumption:

```
┌─────────────────────────────────────────────────┐
│  OPERATIONAL ONBOARDING — BlueEdge              │
│                                                 │
│  Stage: 6 / 14  Sandbox Activation              │
│  Iteration: 2   (1 complete, 1 in progress)     │
│                                                 │
│  Qualification: S2 [CERTIFIED]  7/17 backed     │
│  Gap to S3:     10 domains                      │
│                                                 │
│  Zone: SAFE     Escalation: G-0                 │
│  Entropy: 0     Overload: NORMAL                │
│                                                 │
│  Replay: 7/7 MATCH   Rollback: T0=T6 PROVEN    │
│  Certification: 3 overlays CERTIFIED            │
│  Publication: S2/7 published                    │
│                                                 │
│  Health: ● HEALTHY (all indicators green)       │
└─────────────────────────────────────────────────┘
```

### 8.2 Observability Persistence

```
artifacts/sqo/<client>/<run_id>/lifecycle/
├── lifecycle_instance.json
├── stage_history.json
├── qualification_progression.json
├── overlay_board.json
├── certification_status.json
├── zone_history.json
└── observability_snapshots/
    ├── snapshot-iteration-001.json
    └── snapshot-iteration-002.json
```

---

## 9. Governance

- 8 observability dimensions cover the full lifecycle
- Every stage transition produces observable audit events
- Lifecycle summary card provides at-a-glance operator awareness
- Qualification, overlay, and zone state are continuously updated
- Certification and promotion status are always visible
- Observability artifacts persist for lifecycle audit
- No lifecycle state is hidden from authorized operators
