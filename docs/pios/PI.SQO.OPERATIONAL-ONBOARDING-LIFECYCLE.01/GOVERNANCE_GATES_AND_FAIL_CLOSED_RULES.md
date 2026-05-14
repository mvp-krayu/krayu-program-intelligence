# Governance Gates and Fail-Closed Rules

**Stream:** PI.SQO.OPERATIONAL-ONBOARDING-LIFECYCLE.01
**Date:** 2026-05-11
**Status:** COMPLETE
**Phase:** O1 — Operational Workflow Foundation

---

## 1. Purpose

Define the complete set of governance gates across the operational
onboarding lifecycle, including fail-closed rules that prevent
unsafe progression.

---

## 2. Gate Inventory

### 2.1 Stage Gates (14 Gates)

| Gate ID | Stage | Name | Purpose |
|---------|-------|------|---------|
| G-INTAKE | 0 | Intake Gate | Verify all pipeline artifacts present and hash-verified |
| G-EVIDENCE | 1 | Evidence Gate | Verify evidence provenance and quality |
| G-PACKAGE | 2 | Package Gate | Verify package structure and semantic authorization |
| G-REVIEW | 3 | Review Gate | Verify progression target is achievable |
| G-PROPOSAL | 4 | Proposal Gate | Verify governance zone projection is safe |
| G-APPROVAL | 5 | Approval Gate | Verify operator authorization with impact review |
| G-ACTIVATE | 6 | Activation Gate | Verify 8-phase lifecycle completion |
| G-REPLAY | 7 | Replay Gate | Verify deterministic reconstruction (MATCH) |
| G-ROLLBACK | 8 | Rollback Gate | Verify reversibility and independent removability |
| G-QUALIFY | 9 | Qualification Gate | Verify assessment completeness and attribution |
| G-PROMOTE | 10 | Promotion Gate | Verify replay/rollback/attribution for promotion |
| G-CERTIFY | 11 | Certification Gate | Verify governance posture for certification |
| G-PUBLISH | 12 | Publication Gate | Verify certification and disclosure for publication |
| G-MONITOR | 13 | Monitoring Gate | Verify continuous monitoring is active |
| G-RECOVER | 14 | Recovery Gate | Verify recovery action is replay-verified |

### 2.2 Cross-Cutting Gates (6 Gates)

| Gate ID | Name | Scope | Purpose |
|---------|------|-------|---------|
| G-ZONE | Zone Gate | All stages | Verify governance zone permits current operation |
| G-ENTROPY | Entropy Gate | Stages 6–14 | Verify zero structural entropy |
| G-BASELINE | Baseline Gate | Stages 6–12 | Verify certified baseline unchanged |
| G-OVERLOAD | Overload Gate | Stages 4–12 | Verify governance overload ≤ ELEVATED |
| G-ESCALATION | Escalation Gate | All stages | Verify escalation level appropriate |
| G-AUDIT | Audit Gate | All stages | Verify audit chain integrity |

---

## 3. Gate Evaluation Protocol

### 3.1 Evaluation Order

```
BEFORE each stage:
  1. Evaluate cross-cutting gates (G-ZONE, G-ENTROPY, G-BASELINE, G-OVERLOAD, G-ESCALATION, G-AUDIT)
  2. IF any cross-cutting gate FAILS → HALT (fail closed)
  3. Evaluate stage-specific gate
  4. IF stage gate FAILS → HALT (fail closed)
  5. ELSE → proceed with stage execution
```

### 3.2 Gate Results

| Result | Meaning | Action |
|--------|---------|--------|
| PASS | All checks satisfied | Proceed to stage execution |
| FAIL | One or more checks unsatisfied | HALT — fail closed |
| CONDITIONAL | Checks pass with conditions | Proceed with recorded conditions |
| DEFERRED | Gate evaluation postponed | No progression until gate resolved |

---

## 4. Fail-Closed Rules

### 4.1 Mandatory Fail-Closed Conditions

Any of the following conditions trigger immediate fail-closed:

| # | Condition | Gate | Action |
|---|-----------|------|--------|
| FC-01 | Baseline hash mismatch | G-BASELINE | HALT — baseline drift detected |
| FC-02 | Replay divergence | G-REPLAY | FREEZE sandbox, escalate to G-4 |
| FC-03 | Audit chain integrity failure | G-AUDIT | FREEZE sandbox, escalate to G-4 |
| FC-04 | Structural entropy detected (E-01–E-05) | G-ENTROPY | FREEZE sandbox, mandatory reset |
| FC-05 | Governance zone PROHIBITED | G-ZONE | BLOCK all operations except recovery |
| FC-06 | Architectural limit exceeded (>10 packages, >200 entries) | G-OVERLOAD | BLOCK activation |
| FC-07 | Circular dependency detected | G-OVERLOAD | BLOCK activation, require restructuring |
| FC-08 | Publication without certification | G-PUBLISH | BLOCK publication |
| FC-09 | Promotion without replay verification | G-PROMOTE | BLOCK promotion |
| FC-10 | Activation without governance approval | G-ACTIVATE | BLOCK activation |

### 4.2 Fail-Closed Severity Levels

| Severity | Fail-Closed Conditions | Response |
|----------|----------------------|----------|
| CRITICAL | FC-01, FC-02, FC-03, FC-04 | Immediate freeze, G-4 escalation |
| HIGH | FC-05, FC-06, FC-07 | Block operations, G-3 escalation |
| STANDARD | FC-08, FC-09, FC-10 | Block specific action, operator notification |

### 4.3 Fail-Closed Recovery

| From Fail-Closed | Recovery Path |
|------------------|--------------|
| FC-01 Baseline drift | Verify baseline, close sandbox if drift confirmed, new sandbox |
| FC-02 Replay divergence | Investigate, recover from last MATCH state, re-verify |
| FC-03 Audit chain | Investigate, recover from last valid audit point |
| FC-04 Structural entropy | Mandatory full sandbox reset |
| FC-05 PROHIBITED zone | Reduce pressure (revoke overlays) until zone ≤ RISK |
| FC-06 Limit exceeded | Revoke or consolidate packages |
| FC-07 Circular dependency | Restructure packages to eliminate cycle |
| FC-08 No certification | Complete certification lifecycle first |
| FC-09 No replay | Complete replay verification first |
| FC-10 No approval | Obtain governance approval first |

---

## 5. Gate Interaction Model

### 5.1 Gate Dependencies

```
G-INTAKE → G-EVIDENCE → G-PACKAGE → G-REVIEW → G-PROPOSAL
    │                                                │
    ▼                                                ▼
G-BASELINE (continuous)                       G-APPROVAL
                                                     │
G-ZONE (continuous) ──────────────────────→  G-ACTIVATE
                                                     │
G-ENTROPY (continuous) ──────────────────→  G-REPLAY
                                                     │
G-OVERLOAD (continuous) ─────────────────→  G-ROLLBACK
                                                     │
G-AUDIT (continuous) ────────────────────→  G-QUALIFY
                                                     │
G-ESCALATION (continuous) ───────────────→  G-PROMOTE
                                                     │
                                                G-CERTIFY
                                                     │
                                                G-PUBLISH
```

### 5.2 Continuous vs Point-in-Time Gates

| Type | Gates | Evaluation |
|------|-------|-----------|
| Point-in-time | G-INTAKE through G-PUBLISH | Evaluated once per stage entry |
| Continuous | G-ZONE, G-ENTROPY, G-BASELINE, G-OVERLOAD, G-ESCALATION, G-AUDIT | Evaluated continuously during monitoring |

Continuous gates can trigger fail-closed at ANY time, even between
stage evaluations. This ensures that governance degradation during
long-running operations is detected immediately.

---

## 6. Gate Audit Trail

Every gate evaluation produces an audit record:

```json
{
  "gate_evaluation": {
    "gate_id": "G-REPLAY",
    "stage": 7,
    "timestamp": "<ISO-8601>",
    "result": "PASS",
    "checks": [
      { "check": "input_integrity", "result": "PASS" },
      { "check": "deterministic_reconstruction", "result": "PASS" },
      { "check": "verification_match", "result": "PASS" },
      { "check": "snapshot_stored", "result": "PASS" }
    ],
    "governance_zone_at_evaluation": "SAFE",
    "escalation_level_at_evaluation": "G-0"
  }
}
```

---

## 7. Governance

- 14 stage gates + 6 cross-cutting gates = 20 governance gates total
- 10 mandatory fail-closed conditions prevent unsafe progression
- Cross-cutting gates are continuous — can trigger fail-closed at any time
- Every gate evaluation is auditable
- Fail-closed recovery paths exist for all conditions
- No stage may proceed without prior gate PASS
- Unsafe progression ALWAYS fails closed — no exceptions
