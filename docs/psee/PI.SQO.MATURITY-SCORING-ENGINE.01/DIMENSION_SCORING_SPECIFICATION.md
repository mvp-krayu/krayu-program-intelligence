# Dimension Scoring Specification — D1 through D8

**Stream:** PI.SQO.MATURITY-SCORING-ENGINE.01
**Baseline:** governed-dpsig-baseline-v1 (93098cb)
**Date:** 2026-05-10
**Status:** COMPLETE

---

## 1. Overview

The Maturity Scoring Engine computes 8 independent dimensions (D1-D8) for each client. Each dimension produces a score in the range [0.0, 1.0] and is classified into one of four bands.

All formulas are deterministic. No interpretation, ranking, or inference is performed.

---

## 2. Classification Bands

All dimensions use the same classification scale:

| Band     | Range       |
|----------|-------------|
| LOW      | 0.00 - 0.24 |
| PARTIAL  | 0.25 - 0.49 |
| STABLE   | 0.50 - 0.74 |
| STRONG   | 0.75 - 1.00 |

---

## 3. Dimension Definitions

### D1 — STRUCTURAL_CONTINUITY

**Purpose:** Measures the structural integrity of the client's evidence coverage and label fidelity.

**Formula:**
```
D1 = avg(coverage_ratio, label_fidelity_ratio)
```

**Inputs:**
- `coverage_ratio` — proportion of domains with structural coverage (from continuity assessment)
- `label_fidelity_ratio` — proportion of labels that match their canonical definitions (from continuity assessment)

**Range:** [0.0, 1.0]

---

### D2 — SEMANTIC_GROUNDING

**Purpose:** Measures the degree to which the client's domains are semantically grounded (i.e., have resolved semantic anchors).

**Formula:**
```
D2 = grounded_domains / total_domains
```

**Inputs:**
- `grounded_domains` — count of domains with confirmed semantic grounding
- `total_domains` — total count of domains in the client's domain set

**Range:** [0.0, 1.0]

**Edge case:** If `total_domains` is 0, D2 = 0.0.

---

### D3 — LINEAGE_STRENGTH

**Purpose:** Measures the strength of evidence lineage chains from source through derivation.

**Formula:**
```
D3 = lineage_strength
```

**Inputs:**
- `lineage_strength` — the lineage strength value from the continuity assessment (already normalized to [0.0, 1.0])

**Range:** [0.0, 1.0]

---

### D4 — REPRODUCIBILITY

**Purpose:** Measures whether the client's evidence chain is reproducible from source.

**Formula:**
```
D4 = 1.0   if reproducibility_status == "FULL"
D4 = 0.5   if reproducibility_status == "PARTIAL"
D4 = 0.0   if reproducibility_status is absent or unknown
```

**Inputs:**
- `reproducibility_status` — the reproducibility classification from state detection

**Range:** {0.0, 0.5, 1.0} (discrete)

---

### D5 — GOVERNANCE_COMPLETENESS

**Purpose:** Measures the completeness of governance infrastructure surrounding the client's evidence.

**Formula:**
```
D5 = avg(rm_present, q_class_present, integrity_enforced, replay_pass)
```

**Inputs:**
- `rm_present` — 1.0 if remediation map exists, 0.0 otherwise
- `q_class_present` — 1.0 if Q-class classification is present, 0.0 otherwise
- `integrity_enforced` — 1.0 if integrity enforcement is active, 0.0 otherwise
- `replay_pass` — 1.0 if deterministic replay passes, 0.0 otherwise

**Range:** [0.0, 1.0] (in increments of 0.25)

---

### D6 — PROJECTION_READINESS

**Purpose:** Measures the client's readiness for downstream projection based on its current S-state.

**Formula:**
```
D6 = 0.00   if current_state == "S0"
D6 = 0.25   if current_state == "S1"
D6 = 0.75   if current_state == "S2"
D6 = 1.00   if current_state == "S3"
```

**Inputs:**
- `current_state` — the client's detected S-state from state detection

**Range:** {0.0, 0.25, 0.75, 1.0} (discrete)

---

### D7 — SEMANTIC_COHERENCE

**Purpose:** Measures the overall semantic coherence of the client's evidence base, combining coverage, lineage, and debt pressure.

**Formula:**
```
D7 = avg(coverage_ratio, lineage_strength, inverse_debt_pressure)
```

Where:
```
inverse_debt_pressure = 1.0 - debt_pressure
debt_pressure = blocking_debt_count / total_debt_items   (if total > 0)
debt_pressure = 0.0                                       (if total == 0)
```

**Inputs:**
- `coverage_ratio` — structural coverage ratio
- `lineage_strength` — lineage strength from continuity assessment
- `blocking_debt_count` — count of blocking semantic debt items
- `total_debt_items` — total count of semantic debt items

**Range:** [0.0, 1.0]

---

### D8 — ENRICHMENT_READINESS

**Purpose:** Measures whether the infrastructure required for semantic enrichment is in place.

**Formula:**
```
D8 = avg(replay_pass, manifest_registered, remediation_resolvable)
```

**Inputs:**
- `replay_pass` — 1.0 if deterministic replay passes, 0.0 otherwise
- `manifest_registered` — 1.0 if execution manifest is registered, 0.0 otherwise
- `remediation_resolvable` — 1.0 if remediation actions are resolvable (not blocked by missing infrastructure), 0.0 otherwise

**Range:** [0.0, 1.0]

---

## 4. Overall Maturity Score

**Formula:**
```
overall_maturity = avg(D1, D2, D3, D4, D5, D6, D7, D8)
```

The overall maturity uses the same classification bands as individual dimensions:

| Band     | Range       |
|----------|-------------|
| LOW      | 0.00 - 0.24 |
| PARTIAL  | 0.25 - 0.49 |
| STABLE   | 0.50 - 0.74 |
| STRONG   | 0.75 - 1.00 |

---

## 5. Determinism Guarantee

All formulas are pure arithmetic on discrete or continuous inputs. No stochastic behavior, no weighting heuristics, no model-based inference. The same inputs always produce the same outputs.
