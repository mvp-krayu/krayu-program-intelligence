# PSEE-GAUGE.0 — Confidence and Variance Model

**Stream:** PSEE-GAUGE.0
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/escalation_and_fallback_spec.md; PSEE.1/psee_decision_contract_v1.md;
               PSEE.2/exception_runtime_spec.md; PSEE-OPS.0/unknown_space_interface.md

---

## Purpose

The confidence and variance model defines how the gauge represents uncertainty in PSEE execution outcomes. The canonical score (from `gauge_score_model.md`) represents what is definitively known from PSEE outputs. The confidence band represents how much of the actual completeness and quality picture remains unknown or unresolved.

**Core principle:** The gauge must not resolve unknowns silently. It surfaces them as a visible variance band around the canonical score. This directly implements PSEE.1 INV-02 (unknown-space supremacy) at the gauge surface level.

---

## Confidence Band Definition

The confidence band is a symmetric interval centered on the canonical score:

```
confidence_band = [canonical_score − variance_reduction, canonical_score + variance_increase]
```

Where:
- `variance_reduction` = downward confidence risk (score may be lower than currently known)
- `variance_increase` = upward confidence potential (score may be higher than currently known)

**Constraint:** The confidence band never extends below 0 or above 100.

---

## Confidence Reduction Factors

These factors indicate that the canonical score may be lower than displayed. Each traces to an explicit PSEE artifact or state.

---

### CRF-01 — Unknown-Space Records (US-CONDITION-01, -02, -03)

**Source:** `PSEEContext.us_records` (PSEE.2/exception_runtime_spec.md §Part 3; PSEE-OPS.0/unknown_space_interface.md)

**Authority:** PSEE.1/psee_decision_contract_v1.md INV-02; PSEE.1/escalation_and_fallback_spec.md §Part 3

**Effect on confidence:** Each US record represents a position where the full truth is unknown. Unknown positions may resolve favorably or unfavorably. Until resolution, they widen the variance band downward.

**Variance reduction formula:**
```
us_variance_reduction = us_total_count × US_VARIANCE_UNIT

where US_VARIANCE_UNIT:
  US-CONDITION-01 (overlap parity): 3 points each
  US-CONDITION-02 (platform content): 3 points each
  US-CONDITION-03 (generic inferrable): 2 points each
```

**Cap:** `us_variance_reduction` is capped at 20 points (to prevent the band from being dominated by US record count for large corpora).

**Authority for unit weights:** Weights are derived from the downstream_impact classification in PSEE.1/escalation_and_fallback_spec.md §Part 3: US-CONDITION-01 and -02 affect OVL and CEU completeness claims directly; US-CONDITION-03 is a generic guard with lower per-record impact.

---

### CRF-02 — PARTIAL Coverage (S-T3)

**Source:** `PSEEContext.flags` — PARTIAL flag (PSEE.2/logging_contract.md §Schema 3)

**Authority:** PSEE.1/psee_decision_contract_v1.md §Section 4 (COVERAGE_BELOW_THRESHOLD); PSEE.2/exception_runtime_spec.md §Part 4

**Effect on confidence:** S-T3 outputs are flagged as advisory. The coverage gap (unmapped Phase B units) means the true completeness is bounded by what was covered.

**Variance reduction formula:**
```
partial_variance_reduction = max(0, 90 - coverage_percent) × 0.3
```

This reflects the possible score improvement if the coverage gap were resolved. For example, coverage = 70% → reduction = (90-70) × 0.3 = 6 points.

**Note:** This reduction applies only in S-T3 state. At S-13 (coverage ≥ 90%), PARTIAL_COV is 0.

---

### CRF-03 — Open Escalations (S-T2)

**Source:** Open escalation log entries (PSEE.2/logging_contract.md §Schema 2, `resolution = null`)

**Authority:** PSEE.1/escalation_and_fallback_spec.md §Part 2; PSEE-OPS.0/escalation_interface_spec.md

**Effect on confidence:** Open escalations mean operator-dependent decisions are pending. The execution cannot be certified as complete until escalations are resolved. Each unresolved escalation reduces confidence that the score reflects the final state.

**Variance reduction formula:**
```
open_escalation_count = count of escalation_log entries with action = "ESCALATE" AND resolution = null

escalation_variance_reduction = open_escalation_count × 5
```

**Cap:** `escalation_variance_reduction` is capped at 20 points.

---

### CRF-04 — STOPPED State (S-T1)

**Source:** `PSEEContext.current_state = S-T1` (PSEE.2/exception_runtime_spec.md §Part 1)

**Authority:** PSEE.1/psee_decision_contract_v1.md §Section 4 (SOURCE_RESOLUTION_FAIL, RECONSTRUCTION_DIVERGENT_UNRESOLVABLE)

**Effect on confidence:** STOPPED state means no O-01..O-07 artifacts were produced. The score is 0 and the confidence band is [0, 0] — no upward potential because no outputs exist.

**Variance reduction:** Total (canonical_score = 0, variance = 0).

---

## Confidence Increase Factors

These factors indicate upside — the score could be higher than currently shown.

---

### CIF-01 — Unresolved Escalations with Known Resolution Path

**Source:** Open escalation entries with `action = "ESCALATE"` (PSEE-OPS.0/escalation_interface_spec.md §Per-Escalation Notification Templates)

**Authority:** PSEE.1/escalation_and_fallback_spec.md §Part 2 — each escalation has a defined `resume_state`

**Effect:** Each resolvable escalation contributes to potential score improvement. After resolution, the engine resumes from the defined state and may reach a higher terminal state.

**Variance increase formula:** The projected score (see `projection_logic_spec.md`) models the score after escalation resolution. The difference between projected score and canonical score is the upside potential.

**Note:** This increase is realized only in the Projected Score, not the canonical score. The canonical score reflects only what has been confirmed by PSEE execution.

---

### CIF-02 — PARTIAL Coverage with Defined Unmapped Units

**Source:** PARTIAL flag with identified unmapped Phase B units (PSEE.2/exception_runtime_spec.md §Part 4)

**Authority:** PSEE.1/psee_decision_contract_v1.md §Section 3 PARTIAL note ("All artifacts carry flag: PSEE_STATUS: PARTIAL — coverage = N%; unmapped units: [...]")

**Effect:** If the specific unmapped Phase B units are identified, the operator can take targeted action to resolve the coverage gap. The variance increase is bounded by the potential score if coverage reaches 90%.

---

## Total Variance Computation

```
total_variance_reduction = min(40, CRF-01 + CRF-02 + CRF-03)
  (CRF-04 is handled as canonical_score = 0; no band needed)

confidence_lower = max(0, canonical_score − total_variance_reduction)
confidence_upper = min(100, projected_score)   (from projection_logic_spec.md)
```

**Confidence band displayed as:** `[confidence_lower, confidence_upper]` around the canonical score point.

---

## Confidence Band by Terminal State

| State | Canonical score | Confidence lower | Confidence upper | Band interpretation |
|---|---|---|---|---|
| S-T1 (STOPPED) | 0 | 0 | 0 | No outputs; confidence is zero |
| S-T2 (ESCALATED) | 10–35 | score − escalation_variance | projected_score_on_resolution | Pending operator action; upside possible |
| S-T3 (PARTIAL) | 40–76 | score − (us + partial coverage variances) | projected_score_at_90_coverage | Coverage gap creates known upside |
| S-13 (COMPLETE) | 54–100 | score − us_variance_reduction | score + 0 (fully confirmed) | US records reduce downside only |

**Note for S-13:** At S-13 (COMPLETE), the upside is 0 — the execution is terminal and fully confirmed. Only US records create downside variance, representing unknowns in the outputs that a future run with additional evidence could resolve.

---

## Unknown-Space Honesty Rule (Gauge Rule F.4)

The gauge NEVER silently resolves US records to improve the displayed score or confidence band. Specifically:

- US records are counted verbatim from `PSEEContext.us_records`
- No US record is dismissed, aggregated, or inferred away
- The `resolution = null` field (permanent per INV-02) is the governance signal to the gauge
- PSEE.X candidate patterns (CP-01..09) are not applied to reduce US record count or variance

This rule directly enforces PSEE.1 INV-02 at the gauge surface level.

---

#### STATUS

| Check | Result |
|---|---|
| Confidence reduction factors defined (CRF-01..04) | CONFIRMED |
| Confidence increase factors defined (CIF-01..02) | CONFIRMED |
| All factors trace to authoritative PSEE artifacts | CONFIRMED |
| Unknown-space honesty rule explicit | CONFIRMED |
| No PSEE.X candidate resolution applied | CONFIRMED |
| No canonical mutation | CONFIRMED |

**CONFIDENCE AND VARIANCE MODEL: COMPLETE**
