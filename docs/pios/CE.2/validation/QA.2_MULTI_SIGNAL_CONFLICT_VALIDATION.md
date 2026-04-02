# QA.2 — MULTI-SIGNAL CONFLICT VALIDATION

**Status:** PASS — TARGETED CONFLICT RESOLUTION VERIFIED
**Baseline:** CE.2 (PiOS v0.2)
**Run ID:** QA.2-v02
**Date:** 2026-04-02
**Governed by:** DEC-001 through DEC-014

---

## 1. INJECTION SPECIFICATION

### Conflict Patterns

| Pattern | Condition | Signal A → Tier | Signal B → Tier | Expected Max-Tier |
|---|---|---|---|---|
| A | COND-001 | SIG-002 → AT_RISK | SIG-004 → STABLE | AT_RISK |
| B | COND-007 | SIG-007 → AT_RISK | SIG-003 → BLOCKED | BLOCKED |
| C | COND-003 | SIG-001 → STABLE | SIG-008 → STABLE | STABLE |

### Binding Table Extent

QA.2 extended binding table: **11 rows** (vs 8-row single-signal CE.2 baseline).

Three conditions received two binding rows each (Patterns A, B, C).
Remaining conditions (COND-002, COND-004, COND-005, COND-006, COND-008) retain
single-signal bindings from the CE.2 validated baseline.

---

## 2. SIGNAL INPUTS

| Signal | Field | Injected Value | Note |
|---|---|---|---|
| SIG-001 | static_structural_ratio | 0.820 | below baseline 0.875 → STABLE |
| SIG-001 | sig_001_coordination_pressure_component | 0.820 | below baseline 0.875 → STABLE |
| SIG-002 | dependency_load_ratio | 0.773 | above baseline 0.682 → AT_RISK |
| SIG-003 | output | null | BLOCKED signal — null output |
| SIG-004 | total_edge_density | 1.150 | below baseline 1.273 → STABLE |
| SIG-005 | throughput_rate | 0.900 | below baseline 1.125 → AT_RISK |
| SIG-006 | output | null | BLOCKED signal — null output |
| SIG-007 | sig_002_dependency_load_component | 0.773 | above baseline 0.682 → AT_RISK |
| SIG-008 | sig_001_coordination_pressure_component | 0.820 | below baseline 0.875 → STABLE |

SIG-003 and SIG-006 carry null outputs (state=BLOCKED). All null-output signals resolve
to BLOCKED tier via `BR-NULL-SIGNAL-BLOCKED` (NULL_CHECK evaluation type, DEC-013).

---

## 3. BINDING RULE EVALUATIONS

All evaluations as executed — no reinterpretation.

```
COND-001 / SIG-002.dependency_load_ratio   = 0.773 → [BR-DEP-LOAD-RATIO-001]    → AT_RISK
COND-001 / SIG-004.total_edge_density      = 1.150 → [BR-EDGE-DENSITY-001]      → STABLE
COND-002 / SIG-004.total_edge_density      = 1.150 → [BR-EDGE-DENSITY-001]      → STABLE
COND-003 / SIG-001.static_structural_ratio = 0.820 → [BR-STRUCTURAL-RATIO-001]  → STABLE
COND-003 / SIG-008.coord_pressure_comp     = 0.820 → [BR-COORD-PRESSURE-001]    → STABLE
COND-004 / SIG-005.throughput_rate         = 0.900 → [BR-THROUGHPUT-RATE-001]   → AT_RISK
COND-005 / SIG-003.output                  = null  → [BR-NULL-SIGNAL-BLOCKED]   → BLOCKED
COND-006 / SIG-006.output                  = null  → [BR-NULL-SIGNAL-BLOCKED]   → BLOCKED
COND-007 / SIG-007.sig_002_dep_load_comp   = 0.773 → [BR-HEALTH-DEP-COMP-001]  → AT_RISK
COND-007 / SIG-003.output                  = null  → [BR-NULL-SIGNAL-BLOCKED]   → BLOCKED
COND-008 / SIG-008.coord_pressure_comp     = 0.820 → [BR-COORD-PRESSURE-001]    → STABLE
```

---

## 4. TIER CONTRIBUTIONS (PER CONDITION)

| Condition | Signal Contributions |
|---|---|
| COND-001 | SIG-002 → AT_RISK, SIG-004 → STABLE |
| COND-002 | SIG-004 → STABLE |
| COND-003 | SIG-001 → STABLE, SIG-008 → STABLE |
| COND-004 | SIG-005 → AT_RISK |
| COND-005 | SIG-003 → BLOCKED |
| COND-006 | SIG-006 → BLOCKED |
| COND-007 | SIG-007 → AT_RISK, SIG-003 → BLOCKED |
| COND-008 | SIG-008 → STABLE |

---

## 5. RESOLUTION LOGIC (DEC-009)

Tier hierarchy: `BLOCKED(3) > DEGRADED(2) > AT_RISK(1) > STABLE(0)`

Resolution: `max(contributions, key=TIER_ORDER)` — single winner, no aggregation, no scoring.

| Condition | Contributions | Max-Tier | Pattern |
|---|---|---|---|
| COND-001 | [AT_RISK, STABLE] | AT_RISK | A — severity dominance |
| COND-002 | [STABLE] | STABLE | single-signal |
| COND-003 | [STABLE, STABLE] | STABLE | C — no escalation |
| COND-004 | [AT_RISK] | AT_RISK | single-signal |
| COND-005 | [BLOCKED] | BLOCKED | single-signal |
| COND-006 | [BLOCKED] | BLOCKED | single-signal |
| COND-007 | [AT_RISK, BLOCKED] | BLOCKED | B — BLOCKED dominance |
| COND-008 | [STABLE] | STABLE | single-signal |

---

## 6. CONDITION STATE OUTPUT

Final `condition_coverage_state` (DEC-011 — tier emitted directly):

| Condition | condition_coverage_state |
|---|---|
| COND-001 | AT_RISK |
| COND-002 | STABLE |
| COND-003 | STABLE |
| COND-004 | AT_RISK |
| COND-005 | BLOCKED |
| COND-006 | BLOCKED |
| COND-007 | BLOCKED |
| COND-008 | STABLE |

---

## 7. DOWNSTREAM PROPAGATION

### 40.9 — Feedback Registry

Baseline for comparison: CE.2-R01-MIX-v02 delivery packet.

| Entity | Baseline synthesis_state | QA.2 synthesis_state | Classification |
|---|---|---|---|
| INTEL-001 | synthesized | synthesized | NO_CHANGE |
| INTEL-002 | stable | stable | NO_CHANGE |
| INTEL-003 | stable | stable | NO_CHANGE |
| INTEL-004 | synthesized | synthesized | NO_CHANGE |
| INTEL-005 | blocked | blocked | NO_CHANGE |
| INTEL-006 | blocked | blocked | NO_CHANGE |
| INTEL-007 | synthesized | blocked | STATE_CHANGE |
| INTEL-008 | stable | stable | NO_CHANGE |

**Summary:** `NO_CHANGE: 7 / STATE_CHANGE: 1 / ADDED: 0 / REMOVED: 0`

### 40.10 — Control Surface

| Entity | Source | Directive |
|---|---|---|
| INTEL-001 through INTEL-006, INTEL-008 | NO_CHANGE | NO_ACTION |
| INTEL-007 | STATE_CHANGE | REVIEW_REQUIRED |

**Summary:** `NO_ACTION: 7 / REVIEW_REQUIRED: 1`

---

## 8. FULL TRACE — COND-007 → INTEL-007 (Pattern B — BLOCKED Dominance)

```
Signal A:          SIG-007.sig_002_dependency_load_component = 0.773
Binding rule A:    BR-HEALTH-DEP-COMPONENT-001
Evaluation A:      0.773 > 0.682 (baseline) → AT_RISK
Tier A:            AT_RISK

Signal B:          SIG-003.output = None
Binding rule B:    BR-NULL-SIGNAL-BLOCKED
Evaluation B:      NULL_CHECK → output is None → BLOCKED
Tier B:            BLOCKED

Contributions:     [AT_RISK, BLOCKED]
DEC-009 max-tier:  BLOCKED  (TIER_ORDER[BLOCKED]=3 > TIER_ORDER[AT_RISK]=1)
                   Winner-only selection — no aggregation, no scoring

DEC-011 emit:      COND-007.condition_coverage_state = 'BLOCKED'
DEC-014 mapping:   BLOCKED → BLOCKED
                   DIAG-007.diagnosis_activation_state = 'BLOCKED'
CE.2 synthesis:    BLOCKED → 'blocked'
                   INTEL-007.synthesis_state = 'blocked'

40.9 comparison:   baseline='synthesized'  QA.2='blocked'
40.9 result:       STATE_CHANGE
40.10 directive:   REVIEW_REQUIRED
```

---

## 9. VALIDATION STATEMENT

QA.2 validates deterministic multi-signal conflict resolution under CE.2.

**Verified behaviors:**

- Severity dominance (AT_RISK > STABLE): PASS — COND-001 resolved to AT_RISK despite co-present STABLE contribution
- Hard dominance (BLOCKED > AT_RISK): PASS — COND-007 resolved to BLOCKED despite co-present AT_RISK contribution
- Non-escalation (STABLE + STABLE): PASS — COND-003 remained STABLE; two STABLE inputs did not escalate

**Observed system behavior:**

- 1 downstream state transition (COND-007 → INTEL-007: synthesized → blocked)
- No unintended propagation — 7 of 8 entities remained at NO_CHANGE / NO_ACTION
- Deterministic resolution across all tested patterns

**Conclusion:**

CE.2 multi-signal precedence logic is VALIDATED for targeted conflict scenarios.

---

## 10. CLASSIFICATION

```
Artifact Type:  VALIDATION EVIDENCE
Authority:      NON-AUTHORITATIVE (test artifact)
Scope:          QA.2 only
Baseline:       CE.2 — PiOS v0.2
Run artifact:   runs/pios/ce2/qa2_v02/
Script:         scripts/qa2_multi_signal_conflict.py
```
