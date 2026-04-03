# CE.10 — Propagation Compliance Report

**Stream:** CE.10 — Tier Derivation Implementation & Propagation Closure
**Artifact type:** COMPLIANCE REPORT (POST-IMPLEMENTATION)
**Date:** 2026-04-03
**Authority:** CE.10
**Engine evaluated:** `pios/core/v0.1/engine/activate_conditions.py` (post-CE.10)

---

## ASSESSMENT

### CE.2 DEC-009: Per-condition-instance tier derivation (GAP-P-003)

`derive_condition_tier(condition_id, signals)` evaluates all BINDING_SURFACE rows for
the given `condition_id`, applies the governed binding rule (DEC-013) to the declared
signal field value, and returns `max(contributions, key=TIER_ORDER)`.

Tier derivation results (static 40.4 baseline):

| Condition | Binding (signal_id/field/rule) | Field Value | Evaluation | Tier |
|---|---|---|---|---|
| COND-001 | SIG-002/dependency_load_ratio/BR-DEP-LOAD-RATIO-001 | 0.682 | 0.682 > 0.682? No | STABLE |
| COND-002 | SIG-004/total_edge_density/BR-EDGE-DENSITY-001 | 1.273 | 1.273 > 1.273? No | STABLE |
| COND-003 | SIG-001/static_structural_ratio/BR-STRUCTURAL-RATIO-001 | 0.875 | 0.875 > 0.875? No | STABLE |
| COND-004 | SIG-005/throughput_rate/BR-THROUGHPUT-RATE-001 | 1.125 | 1.125 < 1.125? No | STABLE |
| COND-005 | SIG-003/output/BR-NULL-SIGNAL-BLOCKED | None | output is None? Yes | BLOCKED |
| COND-006 | SIG-006/output/BR-NULL-SIGNAL-BLOCKED | None | output is None? Yes | BLOCKED |
| COND-007 | SIG-002/dependency_load_ratio/BR-DEP-LOAD-RATIO-001 | 0.682 | 0.682 > 0.682? No | STABLE |
| COND-008 | SIG-008/sig_001_coordination_pressure_component/BR-COORD-PRESSURE-001 | 0.875 | 0.875 > 0.875? No | STABLE |

All 8 `condition_coverage_state` values ∈ {BLOCKED, DEGRADED, AT_RISK, STABLE} ✓
Per-condition-instance scope enforced: no cross-condition coupling ✓
DEC-011 direct emission: tier value emitted as `condition_coverage_state` without intermediate mapping ✓

**Status: PASS**

---

### CE.2 DEC-014: Tier → diagnosis activation mapping (GAP-P-004)

`CONDITION_TO_DIAGNOSIS_STATE` contains exactly the DEC-014 governed entries:
BLOCKED→BLOCKED, DEGRADED→ACTIVE, AT_RISK→ACTIVE, STABLE→INACTIVE.
CE.8 interim shim entries (AVAILABLE→ACTIVE, PARTIAL→ACTIVE) removed.
`activate_diag()` receives tier values as input and resolves through DEC-014 correctly.

Diagnosis activation results (static 40.4 baseline):

| Diagnosis | Originating Condition | Tier | DEC-014 | Activation State |
|---|---|---|---|---|
| DIAG-001 | COND-001 | STABLE | STABLE → INACTIVE | INACTIVE ✓ |
| DIAG-002 | COND-002 | STABLE | STABLE → INACTIVE | INACTIVE ✓ |
| DIAG-003 | COND-003 | STABLE | STABLE → INACTIVE | INACTIVE ✓ |
| DIAG-004 | COND-004 | STABLE | STABLE → INACTIVE | INACTIVE ✓ |
| DIAG-005 | COND-005 | BLOCKED | BLOCKED → BLOCKED | BLOCKED ✓ |
| DIAG-006 | COND-006 | BLOCKED | BLOCKED → BLOCKED | BLOCKED ✓ |
| DIAG-007 | COND-007 | STABLE | STABLE → INACTIVE | INACTIVE ✓ |
| DIAG-008 | COND-008 | STABLE | STABLE → INACTIVE | INACTIVE ✓ |

All 4 DEC-014 tier vocabulary paths reachable: ✓ (BLOCKED/STABLE confirmed; DEGRADED/AT_RISK
available via binding rule evaluation under live telemetry)
All 3 diagnosis activation states in valid set {BLOCKED, ACTIVE, INACTIVE}: ✓

**Status: PASS**

---

### CE.5 P-001..P-005: Propagation record structure (confirmed no regression)

CE.5 consumption layer unchanged. `produce_ce5_consumption_record()` continues to produce
`{signal_id, origin: "CE.4", consumption_state, output_ref}` per signal.
CE.5 vocabulary (AVAILABLE/PARTIAL/BLOCKED) remains correct in consumption records.

**Status: PASS (no change from CE.8)**

---

### CE.8 Interim shim removal (CE.9 supersession rule)

`CONDITION_TO_DIAGNOSIS_STATE` no longer contains "AVAILABLE" or "PARTIAL" keys.
No KeyError in `activate_diag()` confirmed by validation run (0 violations).

**Status: PASS**

---

## PROPAGATION COMPLIANCE SUMMARY

| Requirement | CE.8 Status | CE.10 Status |
|---|---|---|
| CE.5 P-001: Propagation record structure | PASS | PASS |
| CE.5 P-002: consumption_state from CE.5 mapping | PASS | PASS |
| CE.5 P-003: output_ref pass-through | PASS | PASS |
| CE.5 P-004: No new field derivation | PASS | PASS |
| CE.5 P-005: No fabricated records | PASS | PASS |
| CE.2 DEC-009: Tier vocabulary (GAP-P-003) | PARTIAL | **PASS** |
| CE.2 DEC-014: Diagnosis mapping (GAP-P-004) | PARTIAL | **PASS** |

**Propagation compliance status: PASS**
**GAP-P-003: CLOSED**
**GAP-P-004: CLOSED**
