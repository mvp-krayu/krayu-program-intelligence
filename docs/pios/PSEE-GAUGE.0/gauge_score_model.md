# PSEE-GAUGE.0 — Gauge Score Model

**Stream:** PSEE-GAUGE.0
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/decision_state_model.md; PSEE.1/psee_decision_contract_v1.md;
               PSEE.2/state_transition_table.md; PSEE.2/exception_runtime_spec.md

---

## G.1 — What the Gauge Score Measures

The gauge score is a deterministic, read-only projection of PSEE execution completeness and output quality. It measures:

- Whether PSEE execution reached a promotable terminal state
- The coverage percentage of Phase B targets
- The reconstruction quality across Phase B artifacts

The gauge score does NOT:
- Create new PSEE state
- Override PSEE outputs
- Resolve unknown-space positions
- Apply PSEE.X candidate patterns

**Score range:** 0–100 (integer, computed from whole number arithmetic)

**Authority mapping:** Every score component traces to exactly one authoritative PSEE output field. No score component is invented.

---

## G.2 — Score Component Definitions

The gauge score is a composite of three components, each mapped to an authoritative PSEE artifact:

---

### Component 1 — COMPLETION (0–40 points)

**Source:** `PSEEContext.current_state` (PSEE.1/decision_state_model.md §State Definitions)

**Authority:** PSEE.1 — 17-state model (S-00..S-13, S-T1..S-T3)

| PSEEContext.current_state | Phase | Completion points |
|---|---|---|
| S-T1 (STOPPED) | Terminal failure | 0 |
| S-T2 (ESCALATED) — suspended at Phase 0–1 (S-02) | Normalization | 10 |
| S-T2 (ESCALATED) — suspended at Phase 2 (S-03/S-04) | Filtering | 15 |
| S-T2 (ESCALATED) — suspended at Phase 3 (S-06) | Grouping | 20 |
| S-T2 (ESCALATED) — suspended at Phase 4 (S-08) | Abstraction | 25 |
| S-T2 (ESCALATED) — suspended at Phase 5 (S-10) | Classification | 30 |
| S-T2 (ESCALATED) — suspended at Phase 6 (S-12) | Reconstruction | 35 |
| S-T3 (PARTIAL) | Soft advisory (coverage < 90%) | 25 |
| S-13 (COMPLETE) | Terminal success | 40 |

**Determination rule:** For S-T2, the suspended phase is identified from the `escalation_log` entry that placed the engine in S-T2 — specifically the `state` field of the active escalation entry (per PSEE.2/logging_contract.md §Schema 2).

**Invariant:** Completion points are not interpolated between states. The lookup table is the sole authority. Any state not in this table is scored as 0 (UNDEFINED_STATE guard).

---

### Component 2 — COVERAGE (0–35 points)

**Source:** `PSEEContext.coverage_percent` (PSEE.1/psee_decision_contract_v1.md G-08; DP-5-02; CT-07)

**Authority:** PSEE.1/determinism_boundary.md CT-07; PSEE.2/state_transition_table.md §Phase 5

**Computation:**
```
coverage_points = round(coverage_percent × 0.35)
```

| coverage_percent | coverage_points | Note |
|---|---|---|
| Not yet computed (engine has not reached Phase 5) | 0 | State < S-10 |
| 0–89.9% (S-T3 PARTIAL) | 0–31 | Computed at DP-5-02 |
| 90–100% (S-13 COMPLETE) | 31–35 | Computed at DP-5-02 |

**Determination rule:** `coverage_percent` is read directly from `PSEEContext.coverage_percent`. If the engine has not yet reached Phase 5, the field is null and coverage_points = 0.

**Invariant:** This component cannot exceed 35 points. A coverage of 100% yields exactly 35 points.

---

### Component 3 — RECONSTRUCTION (0–25 points)

**Source:** `PSEEContext.reconstruction_result` (O-07; DP-6-01; PSEE.1/psee_decision_contract_v1.md G-09)

**Authority:** PSEE.2/state_transition_table.md §Phase 6; PSEE.1/psee_decision_contract_v1.md §Section 3 O-07

**Computation:**
```
equivalent_count = count of Phase B artifacts with structural_match = EQUIVALENT
partial_count    = count of Phase B artifacts with structural_match = PARTIAL
total_count      = total Phase B artifacts declared in phase_b_target

weighted_match = (equivalent_count × 1.0 + partial_count × 0.5) / total_count
reconstruction_points = round(weighted_match × 25)
```

| Reconstruction state | weighted_match | reconstruction_points |
|---|---|---|
| Not yet computed (engine has not reached Phase 6) | N/A | 0 |
| All PARTIAL | 0.50 | 12–13 |
| Mix of EQUIVALENT and PARTIAL | 0.50–1.00 | 12–25 |
| All EQUIVALENT | 1.00 | 25 |

**Determination rule:** `reconstruction_result` is read from the `PSEEContext.reconstruction_result` array populated at S-13 (PSEE.2/state_transition_table.md: "WRITE_RECONSTRUCTION_REPORT"). If Phase 6 has not been completed (state < S-12), reconstruction_points = 0.

**Invariant:** DIVERGENT is not a valid terminal reconstruction result. S-T1 is the terminal state for unresolved divergence (STOP-02). If the gauge encounters a DIVERGENT result in reconstruction_result, it reports reconstruction_points = 0 and flags GAUGE_ANOMALY.

---

## G.3 — Composite Score Computation

```
canonical_score = completion_points + coverage_points + reconstruction_points
```

**Range:** 0–100 (integer)

**Special cases:**
- S-T1 (STOPPED): canonical_score = 0 unconditionally (no promotable outputs per PSEE.1 INV)
- S-T2 (ESCALATED): canonical_score = completion_points only (coverage and reconstruction not promotable)
- Gauge not rendered during in-flight states (S-00 through S-12 while engine is active)

---

## G.4 — Score Bands

Score bands are derived from the canonical_score. They are descriptive labels, not score inputs.

| Band | Range | Meaning |
|---|---|---|
| **READY** | 80–100 | S-13 COMPLETE; coverage ≥ 90%; strong or full reconstruction |
| **CONDITIONAL** | 40–79 | S-T3 PARTIAL, or S-13 with partial reconstruction gaps, or advanced S-T2 |
| **BLOCKED** | 0–39 | S-T1 STOPPED, or early-phase S-T2 ESCALATED |

**Band determination:** Strictly numeric. Band = READY if score ≥ 80, CONDITIONAL if score 40–79, BLOCKED if score ≤ 39.

**Anchor examples (from authoritative artifacts):**
- S-13, coverage = 100%, all EQUIVALENT: 40 + 35 + 25 = 100 → READY
- S-13, coverage = 90%, all EQUIVALENT: 40 + 32 + 25 = 97 → READY
- S-13, coverage = 90%, all PARTIAL: 40 + 32 + 12 = 84 → READY
- S-13, coverage = 90%, mix (50% EQUIVALENT, 50% PARTIAL): 40 + 32 + 19 = 91 → READY
- S-T3, coverage = 80%: 25 + 28 + 0 = 53 → CONDITIONAL
- S-T3, coverage = 60%: 25 + 21 + 0 = 46 → CONDITIONAL
- S-T2 at Phase 5: 30 + 0 + 0 = 30 → BLOCKED
- S-T1: 0 → BLOCKED

---

## G.5 — Score Authority Map

| Score component | Field | Source artifact | DP authority |
|---|---|---|---|
| Completion | `PSEEContext.current_state` | PSEE.1/decision_state_model.md | All 17 states defined |
| Coverage | `PSEEContext.coverage_percent` | PSEE.1/psee_decision_contract_v1.md G-08 | DP-5-02 (CT-07) |
| Reconstruction | `PSEEContext.reconstruction_result` | PSEE.1/psee_decision_contract_v1.md G-09, O-07 | DP-6-01 |
| Band label | canonical_score | This document §G.4 | Derived from above |

---

## G.6 — What the Score Does NOT Include

The following factors affect the confidence band (see `confidence_and_variance_model.md`) but do NOT alter the canonical score:

| Factor | Why excluded from score | Where surfaced |
|---|---|---|
| Unknown-space record count | Unknowns widen variance; they do not reduce canonical outputs | confidence_and_variance_model.md |
| Open escalation count | Escalations are execution suspensions; score reflects completion state | confidence_and_variance_model.md; dimension_projection_model.md |
| PSEE.X candidate patterns | Non-canonical; no authority in score logic (PSEE-GAUGE.0 Rule F.3) | review_surface_linkage.md |
| Operator dependency status | Operator responses affect escalation clearance, not canonical score | operator_visibility_contract.md |
| Heuristic compliance flags | Compliance is a PASS/FAIL guard, not a score modifier | dimension_projection_model.md |

---

## G.7 — Score Determinism Guarantee

The gauge score satisfies the same determinism guarantee as the PSEE engine (PSEE.1 INV-01 through INV-10):

- Same `PSEEContext` state → same canonical_score
- Score does not depend on timestamps or operator identity
- Score does not incorporate heuristics or PSEE.X candidates
- Score changes only when PSEEContext changes (i.e., when the engine transitions state)

---

#### STATUS

| Check | Result |
|---|---|
| Score range defined (0–100) | CONFIRMED |
| Score bands defined (READY / CONDITIONAL / BLOCKED) | CONFIRMED |
| All 3 components mapped to authoritative PSEE artifacts | CONFIRMED |
| Score excludes PSEE.X candidates | CONFIRMED |
| Score excludes unknown-space as score driver | CONFIRMED |
| Determinism guarantee stated | CONFIRMED |
| No canonical mutation | CONFIRMED |

**GAUGE SCORE MODEL: COMPLETE**
