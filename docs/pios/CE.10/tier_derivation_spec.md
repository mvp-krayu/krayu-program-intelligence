# CE.10 — Tier Derivation Specification

**Stream:** CE.10 — Tier Derivation Implementation & Propagation Closure
**Artifact type:** TIER DERIVATION SPECIFICATION (NORMATIVE)
**Date:** 2026-04-03
**Authority:** CE.10
**Governing decisions:** DEC-006, DEC-009, DEC-010, DEC-011, DEC-012, DEC-013, DEC-014

---

## 1. DEC-013 GOVERNED BINDING RULE DEFINITIONS

All 7 binding rule IDs referenced in QA.2/QA.4 artifacts, formalized per DEC-013 minimum
specification. Thresholds sourced from CE.2 QA validation artifacts (sole evidence of
rule evaluations; no prior standalone governed rule artifacts existed — CE.9 GAP-A-001).

---

### BR-NULL-SIGNAL-BLOCKED

| Field | Value |
|---|---|
| binding_rule_id | BR-NULL-SIGNAL-BLOCKED |
| signal_field | output |
| evaluation_type | NULL_CHECK |
| evaluation_logic | if output is None → BLOCKED |
| output_tier | BLOCKED (when null) |
| null_handling | None is the trigger condition; always → BLOCKED |

**Evidence:** QA.2: `COND-005 / SIG-003.output = null → [BR-NULL-SIGNAL-BLOCKED] → BLOCKED`
Also cited in CE.4 `dependency_propagation_rules.md` §5 (cross-reference only).

---

### BR-DEP-LOAD-RATIO-001

| Field | Value |
|---|---|
| binding_rule_id | BR-DEP-LOAD-RATIO-001 |
| signal_field | dependency_load_ratio |
| evaluation_type | BASELINE_THRESHOLD_ABOVE |
| evaluation_logic | if value > 0.682 → AT_RISK; if value ≤ 0.682 → STABLE |
| output_tier | AT_RISK (above threshold), STABLE (at or below) |
| threshold | 0.682 (baseline computed from static 40.4: 15/22 rounded to 3dp) |
| null_handling | None → BLOCKED |

**Evidence:** QA.4: "Rule: BR-DEP-LOAD-RATIO-001 (ABOVE_IS_RISK, baseline=0.682)";
0.773 → AT_RISK (QA.2); 0.500 → STABLE (QA.4).

---

### BR-EDGE-DENSITY-001

| Field | Value |
|---|---|
| binding_rule_id | BR-EDGE-DENSITY-001 |
| signal_field | total_edge_density |
| evaluation_type | BASELINE_THRESHOLD_ABOVE |
| evaluation_logic | if value > 1.273 → AT_RISK; if value ≤ 1.273 → STABLE |
| output_tier | AT_RISK (above threshold), STABLE (at or below) |
| threshold | 1.273 (baseline: 28/22 rounded to 3dp) |
| null_handling | None → BLOCKED |

**Evidence:** QA.2: 1.150 → STABLE; QA.4: 1.273 → STABLE (CE.2-R01-MIX baseline value).

---

### BR-STRUCTURAL-RATIO-001

| Field | Value |
|---|---|
| binding_rule_id | BR-STRUCTURAL-RATIO-001 |
| signal_field | static_structural_ratio |
| evaluation_type | BASELINE_THRESHOLD_ABOVE |
| evaluation_logic | if value > 0.875 → AT_RISK; if value ≤ 0.875 → STABLE |
| output_tier | AT_RISK (above threshold), STABLE (at or below) |
| threshold | 0.875 (baseline: 7/8) |
| null_handling | None → BLOCKED |

**Evidence:** QA.2: 0.820 → STABLE ("below baseline 0.875 → STABLE"); QA.4: 0.875 → STABLE.

---

### BR-COORD-PRESSURE-001

| Field | Value |
|---|---|
| binding_rule_id | BR-COORD-PRESSURE-001 |
| signal_field | sig_001_coordination_pressure_component |
| evaluation_type | BASELINE_THRESHOLD_ABOVE |
| evaluation_logic | if value > 0.875 → AT_RISK; if value ≤ 0.875 → STABLE |
| output_tier | AT_RISK (above threshold), STABLE (at or below) |
| threshold | 0.875 (baseline: SIG-001.static_structural_ratio = 7/8) |
| null_handling | None → BLOCKED |

**Evidence:** QA.4: SIG-008.sig_001_coordination_pressure_component = 0.875 → STABLE (COND-008).

---

### BR-THROUGHPUT-RATE-001

| Field | Value |
|---|---|
| binding_rule_id | BR-THROUGHPUT-RATE-001 |
| signal_field | throughput_rate |
| evaluation_type | BASELINE_THRESHOLD_BELOW |
| evaluation_logic | if value < 1.125 → AT_RISK; if value ≥ 1.125 → STABLE |
| output_tier | AT_RISK (below threshold), STABLE (at or above) |
| threshold | 1.125 (baseline: 9/8) |
| null_handling | None → BLOCKED |

**Evidence:** QA.2: 0.900 → AT_RISK ("below baseline 1.125 → AT_RISK"); QA.4: 0.643 → AT_RISK.
Evaluation direction: BELOW_IS_RISK (throughput degradation = risk indicator).

---

### BR-HEALTH-DEP-COMP-001

| Field | Value |
|---|---|
| binding_rule_id | BR-HEALTH-DEP-COMP-001 |
| signal_field | sig_002_dependency_load_component |
| evaluation_type | BASELINE_THRESHOLD_ABOVE |
| evaluation_logic | if value > 0.682 → AT_RISK; if value ≤ 0.682 → STABLE |
| output_tier | AT_RISK (above threshold), STABLE (at or below) |
| threshold | 0.682 (same as BR-DEP-LOAD-RATIO-001; this field carries SIG-002 value) |
| null_handling | None → BLOCKED |

**Evidence:** QA.2: SIG-007.sig_002_dep_load_comp = 0.773 → BR-HEALTH-DEP-COMP-001 → AT_RISK.
**Status:** Extended binding rule — referenced in QA.2 11-row extended binding table.
NOT present in baseline 8-row BINDING_SURFACE. Defined per CE.9 mandate but not active
in CE.10 baseline implementation.

---

## 2. DEC-012 INSTANTIATED BINDING SURFACE (BASELINE — 8 ROWS)

Governed table per DEC-012 schema. Deterministic key: (condition_id, signal_id, signal_field, binding_rule_id).
Row order has no semantic meaning. One row per condition in baseline configuration.

| condition_id | signal_id | signal_field | binding_rule_id |
|---|---|---|---|
| COND-001 | SIG-002 | dependency_load_ratio | BR-DEP-LOAD-RATIO-001 |
| COND-002 | SIG-004 | total_edge_density | BR-EDGE-DENSITY-001 |
| COND-003 | SIG-001 | static_structural_ratio | BR-STRUCTURAL-RATIO-001 |
| COND-004 | SIG-005 | throughput_rate | BR-THROUGHPUT-RATE-001 |
| COND-005 | SIG-003 | output | BR-NULL-SIGNAL-BLOCKED |
| COND-006 | SIG-006 | output | BR-NULL-SIGNAL-BLOCKED |
| COND-007 | SIG-002 | dependency_load_ratio | BR-DEP-LOAD-RATIO-001 |
| COND-008 | SIG-008 | sig_001_coordination_pressure_component | BR-COORD-PRESSURE-001 |

**Source:** QA.4 confirms COND-001 and COND-007 share SIG-002.dependency_load_ratio via
BR-DEP-LOAD-RATIO-001 (shared-signal fan-out validation). COND-007 binds SIG-002 directly,
not SIG-007 (QA.4: "each with one binding row").

---

## 3. DEC-009 TIER DERIVATION ALGORITHM

```
For each condition C in {COND-001..COND-008}:
  rows ← { r ∈ BINDING_SURFACE : r.condition_id = C.condition_id }
  contributions ← []
  For each row r in rows:
    field_value ← signal[r.signal_id].output[r.signal_field]   (or None if BLOCKED)
    tier ← evaluate(BINDING_RULES[r.binding_rule_id], field_value)   (DEC-013)
    contributions.append(tier)
  C.condition_coverage_state ← max(contributions, key=TIER_ORDER)   (DEC-009)
```

**Scope:** Per-condition-instance (DEC-006). No cross-condition coupling. No aggregation.

---

## 4. STATIC 40.4 BASELINE TIER DERIVATION RESULTS

Signal values produced by `compute_signals.py` with STATIC_VARIABLES:

| Condition | Signal | Signal Field | Value | Rule | Comparison | Tier |
|---|---|---|---|---|---|---|
| COND-001 | SIG-002 | dependency_load_ratio | 0.682 | BR-DEP-LOAD-RATIO-001 | 0.682 > 0.682? No | STABLE |
| COND-002 | SIG-004 | total_edge_density | 1.273 | BR-EDGE-DENSITY-001 | 1.273 > 1.273? No | STABLE |
| COND-003 | SIG-001 | static_structural_ratio | 0.875 | BR-STRUCTURAL-RATIO-001 | 0.875 > 0.875? No | STABLE |
| COND-004 | SIG-005 | throughput_rate | 1.125 | BR-THROUGHPUT-RATE-001 | 1.125 < 1.125? No | STABLE |
| COND-005 | SIG-003 | output | None | BR-NULL-SIGNAL-BLOCKED | output is None? Yes | BLOCKED |
| COND-006 | SIG-006 | output | None | BR-NULL-SIGNAL-BLOCKED | output is None? Yes | BLOCKED |
| COND-007 | SIG-002 | dependency_load_ratio | 0.682 | BR-DEP-LOAD-RATIO-001 | 0.682 > 0.682? No | STABLE |
| COND-008 | SIG-008 | sig_001_coordination_pressure_component | 0.875 | BR-COORD-PRESSURE-001 | 0.875 > 0.875? No | STABLE |

**Observation:** All non-BLOCKED conditions evaluate at their threshold baseline value → STABLE.
Static 40.4 telemetry represents the at-baseline reference state. AT_RISK conditions require
signal values above (or below, for BELOW_IS_RISK) their respective thresholds, which occurs
only under live pipeline telemetry or stress injection.

---

## 5. DEC-014 DIAGNOSIS ACTIVATION RESULTS (STATIC 40.4 BASELINE)

| Diagnosis | Originating Condition | Tier | DEC-014 Mapping | Activation State |
|---|---|---|---|---|
| DIAG-001 | COND-001 | STABLE | STABLE → INACTIVE | INACTIVE |
| DIAG-002 | COND-002 | STABLE | STABLE → INACTIVE | INACTIVE |
| DIAG-003 | COND-003 | STABLE | STABLE → INACTIVE | INACTIVE |
| DIAG-004 | COND-004 | STABLE | STABLE → INACTIVE | INACTIVE |
| DIAG-005 | COND-005 | BLOCKED | BLOCKED → BLOCKED | BLOCKED |
| DIAG-006 | COND-006 | BLOCKED | BLOCKED → BLOCKED | BLOCKED |
| DIAG-007 | COND-007 | STABLE | STABLE → INACTIVE | INACTIVE |
| DIAG-008 | COND-008 | STABLE | STABLE → INACTIVE | INACTIVE |
