# Qualification Progression Lifecycle

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the governed lifecycle by which semantic qualification
progresses from one S-state to a higher S-state, ensuring every
progression step is deterministic, replay-safe, rollback-safe,
and certifiable.

---

## 2. Qualification Progression Model

### 2.1 S-State Progression Path

```
S0 — No qualification (no evidence, no assessment)
 │
S1 — Evidence present, qualification initiated
 │   Gate: Evidence boundary received, pipeline running
 │
S2 — Qualification assessed, grounding established
 │   Gate: Pipeline complete, decision validation PASS, reproducibility FULL
 │   BlueEdge certified position: S2 (4/17 backed, Q-02)
 │
S3 — Full qualification, all domains grounded
     Gate: 17/17 domains backed (STRONG or EXACT), all via governed path
```

### 2.2 Progression Mechanisms

| Transition | Mechanism | Authority |
|-----------|-----------|-----------|
| S0 → S1 | Evidence intake + pipeline initiation | Pipeline authority |
| S1 → S2 | Pipeline execution + qualification assessment | Pipeline authority |
| S2 → S3 | Overlay orchestration + governed progression | SQO operational lifecycle |
| S3 → S2 (regression) | Overlay revocation or pipeline re-execution with different results | SQO / Pipeline |

### 2.3 S2 → S3 Progression (Overlay-Driven)

This is the primary progression path governed by the operational
onboarding lifecycle:

```
S2 (certified baseline)
 │
 ├── Iteration 1: +N domains via overlay batch
 │   S2 maintained (backed < 17)
 │
 ├── Iteration 2: +M domains via overlay batch
 │   S2 maintained (backed still < 17)
 │
 ├── ...
 │
 └── Final iteration: total backed = 17/17
     S2 → S3 transition achieved
     S3 is COMPOSITE (certified + overlay)
```

---

## 3. Progression Gates

### 3.1 Per-Iteration Gates

Before each overlay batch iteration:

| Gate | Check | Failure Action |
|------|-------|---------------|
| GP-01: Baseline intact | Certified baseline hashes verified | HALT — baseline drift detected |
| GP-02: Zone safe | Governance zone ≤ PRESSURE | HALT — zone too high for progression |
| GP-03: Capacity available | Active packages < 10, entries < 200 | HALT — architectural limit |
| GP-04: Prior iteration verified | Latest replay verification MATCH | HALT — replay integrity failure |
| GP-05: No active entropy | Zero entropy indicators triggered | HALT — entropy investigation required |

### 3.2 S-State Transition Gates

Before S2 → S3 transition is recognized:

| Gate | Check | Failure Action |
|------|-------|---------------|
| GT-01: Full coverage | 17/17 domains backed (STRONG or EXACT) | BLOCK — coverage incomplete |
| GT-02: Replay complete | All states replay-verified with MATCH | BLOCK — replay chain incomplete |
| GT-03: Rollback verified | Round-trip proof (T0 = T_final after full revocation) | BLOCK — rollback integrity unproven |
| GT-04: Attribution complete | Every domain contribution attributed to certified or overlay source | BLOCK — attribution gap |
| GT-05: Disclosure met | S3 disclosed as COMPOSITE with certified/overlay breakdown | BLOCK — disclosure violation |

---

## 4. Progression Tracking

### 4.1 Progression State

```json
{
  "progression_state": {
    "client": "<client_id>",
    "run_id": "<run_id>",
    "certified_s_state": "S2",
    "composite_s_state": "S2",
    "certified_backed": 4,
    "overlay_backed": 3,
    "composite_backed": 7,
    "total_possible": 17,
    "gap_to_s3": 10,
    "iterations_completed": 1,
    "progression_percentage": 41.2,
    "governance_zone": "SAFE",
    "next_iteration_eligible": true
  }
}
```

### 4.2 Domain Progression Map

```json
{
  "domain_progression": {
    "DOMAIN-01": { "status": "EXACT", "source": "CERTIFIED", "iteration": 0 },
    "DOMAIN-10": { "status": "STRONG", "source": "CERTIFIED", "iteration": 0 },
    "DOMAIN-11": { "status": "STRONG", "source": "OVERLAY", "iteration": 1, "package": "SEP-multi-001" },
    "DOMAIN-02": { "status": "STRONG", "source": "OVERLAY", "iteration": 1, "package": "SEP-multi-002" },
    "DOMAIN-08": { "status": "STRONG", "source": "OVERLAY", "iteration": 1, "package": "SEP-multi-003" },
    "DOMAIN-03": { "status": "NONE", "source": "CERTIFIED", "target_iteration": 2 },
    "...": "..."
  }
}
```

---

## 5. Progression Iteration Lifecycle

### 5.1 Single Iteration Flow

```
1. Assess remaining gap (which domains need coverage)
2. Identify available evidence for target domains
3. Package evidence into SEPs
4. Propose overlay batch (within governance zone constraints)
5. Obtain governance approval
6. Execute sandbox activation
7. Verify replay (all states MATCH)
8. Verify rollback (independent removability)
9. Assess updated qualification state
10. Record iteration results
```

### 5.2 Iteration Constraints

| Constraint | Value | Source |
|-----------|-------|--------|
| Max overlays per iteration | Governance-zone dependent (5 in SAFE) | Zone classification |
| Max total overlays across iterations | 10 | Activation model |
| Max entries per iteration | Governance-zone dependent | Zone classification |
| Max total entries across iterations | 200 | Activation model |
| Min replays per iteration | 2N+1 (N=overlays in iteration) | Replay doctrine |
| Required rollback verification | Full round-trip within iteration | Rollback doctrine |

### 5.3 Iteration Planning

| BlueEdge Iteration | Target Domains | Overlays | Projected Backed | Gap Remaining |
|--------------------|---------------|----------|-----------------|---------------|
| 0 (certified) | — | — | 4/17 | 13 |
| 1 (proven) | DOMAIN-11, 02, 08 | 3 | 7/17 | 10 |
| 2 (planned) | DOMAIN-03, 05, 06 | 3 (or 1 multi-entry) | 10/17 | 7 |
| 3 (planned) | DOMAIN-04, 07, 09, 12 | 4 (or 1–2 multi-entry) | 14/17 | 3 |
| 4 (planned) | DOMAIN-13, 15, 17 | 3 (or 1 multi-entry) | 17/17 | 0 → S3 |

---

## 6. Progression Failure Handling

### 6.1 Iteration Failure

If an iteration fails at any stage:

| Failure Stage | Recovery | Impact |
|--------------|---------|--------|
| Evidence insufficient (Stage 1–2) | Skip target domain, select alternative | No qualification impact |
| Governance denial (Stage 5) | Modify proposal, re-submit | No qualification impact |
| Activation failure (Stage 6) | Package remains STAGED, no state change | No qualification impact |
| Replay failure (Stage 7) | Sandbox freeze, investigate, recover | Potential iteration rollback |
| Rollback failure (Stage 8) | Governance escalation, investigate | Potential iteration rollback |

### 6.2 S-State Regression

If overlays are revoked after S3 is achieved:

```
S3 (17/17 with overlays)
  → Revoke any overlay
  → backed < 17
  → S3 gate no longer met
  → S3 → S2 regression
```

**Rule:** S3 achieved via overlay is COMPOSITE — it depends on
overlay persistence. S3 becomes PIPELINE_CERTIFIED only when the
pipeline is re-executed with evidence that independently confirms
17/17 coverage.

---

## 7. Governance

- Qualification progression follows the 15-stage operational lifecycle
- Each progression iteration is independently replay-verified and rollback-verified
- S2 → S3 transition requires ALL 5 transition gates PASS
- S3 via overlay is COMPOSITE — explicitly disclosed and overlay-dependent
- Iteration planning respects governance zone constraints
- Progression failure at any stage is recoverable without qualification loss
- S3 promotion to PIPELINE_CERTIFIED requires pipeline re-execution (external event)
