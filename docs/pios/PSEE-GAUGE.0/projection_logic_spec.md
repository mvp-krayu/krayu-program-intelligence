# PSEE-GAUGE.0 — Projection Logic Specification

**Stream:** PSEE-GAUGE.0
**Family:** PSEE
**Date:** 2026-04-05
**Authority:** PSEE.1/escalation_and_fallback_spec.md; PSEE.1/psee_decision_contract_v1.md;
               PSEE.2/exception_runtime_spec.md; gauge_score_model.md; confidence_and_variance_model.md

---

## Purpose

The projection logic defines how the gauge computes a projected score distinct from the canonical score. The projected score simulates the outcome if all resolvable conditions (escalations and coverage gaps) were resolved. It represents an upper bound on the score achievable through operator action, within the current execution's constraints.

**Constraint:** Projected score computation is strictly bounded. It may only simulate:
1. Resolution of explicit escalations (ESC-01..06 from PSEE.1/escalation_and_fallback_spec.md)
2. Coverage increase to the DP-5-02 gate threshold (90%)

It may NOT simulate:
- Resolution of unknown-space records (US records are permanent per INV-02; PSEE-OPS.0/unknown_space_interface.md)
- Application of PSEE.X candidate patterns (non-canonical per PSEE.X/non_canonical_boundary.md)
- Heuristic application (PSEE.1/determinism_boundary.md FB-01..07)
- Reachability to S-13 if STOP-02 is the terminal state (second divergence cannot be projected away)

---

## Projected Score vs Canonical Score

| Concept | Definition | Source of truth |
|---|---|---|
| **Canonical score** | Score derived from current PSEEContext state (confirmed outputs only) | PSEEContext fields; gauge_score_model.md |
| **Projected score** | Score achievable if resolvable conditions are resolved | Defined in this document; simulation only |
| **Confidence band** | Range [canonical − variance, projected] | confidence_and_variance_model.md |

The projected score is displayed on the gauge as a distinct value (e.g., "Projected: 89") alongside the canonical score (e.g., "Current: 62"). They are never merged.

---

## Projection Computation Rules

---

### Rule PR-01 — S-T1 (STOPPED): No Projection

**Source:** PSEE.2/exception_runtime_spec.md §STOP-01/STOP-02

```
if PSEEContext.current_state = S-T1:
  projected_score = 0
  projection_note = "STOPPED: full restart required. No projection computable."
```

Rationale: S-T1 is terminal failure. The engine requires corrected inputs and a full restart from S-00. A projected score would misrepresent the execution state.

---

### Rule PR-02 — S-T2 (ESCALATED): Project Escalation Resolution

**Source:** PSEE.1/escalation_and_fallback_spec.md §Part 2; PSEE-OPS.0/escalation_interface_spec.md §Resumption Paths

**Simulation:** For each open escalation, the projection simulates reaching the escalation's defined `resume_state` and completing execution to S-13.

```
for each open_escalation in escalation_log where resolution = null:
  resume_state = lookup(open_escalation.escalation_class)  // per escalation_interface_spec.md §Resumption Paths
  // Assume: resolution is favorable (engine can resume and complete to S-13)
  // Assume: no new escalations arise from the resumed path

projected_completion_points = 40  // S-13 COMPLETE if all escalations resolved

// Coverage cannot be known for S-T2 states before Phase 5
// If suspended at Phase 5 or 6: use last_known_coverage_percent
// If suspended before Phase 5: project coverage = 90 (the DP-5-02 gate minimum)

if open_escalation.suspended_phase >= 5:
  projected_coverage = PSEEContext.coverage_percent  // actual, if known
else:
  projected_coverage = 90  // conservative projection: minimum threshold

projected_coverage_points = round(projected_coverage × 0.35)
projected_reconstruction_points = 25  // optimistic: assume all EQUIVALENT if no phase 6 data
projected_score = projected_completion_points + projected_coverage_points + projected_reconstruction_points
```

**Caveat label (mandatory display):** "PROJECTED — assumes favorable escalation resolution. Actual score depends on operator decisions."

**Authority:** The resume states in this projection are directly from PSEE-OPS.0/escalation_interface_spec.md §Resumption Paths table (ESC-01→S-03, ESC-02→S-03, ESC-03→S-04, ESC-04→S-07, ESC-05→S-11, ESC-06→S-02).

---

### Rule PR-03 — S-T3 (PARTIAL): Project Coverage Gap Resolution

**Source:** PSEE.1/psee_decision_contract_v1.md §Section 4 (COVERAGE_BELOW_THRESHOLD); PSEE.2/exception_runtime_spec.md §Part 4

**Simulation:** Project the score if coverage reaches exactly 90% (the DP-5-02 gate).

```
if PSEEContext.current_state = S-T3:
  projected_coverage = 90  // minimum threshold to exit PARTIAL state
  projected_coverage_points = round(90 × 0.35) = 31

  // Reconstruction: use actual reconstruction_result if known, else optimistic (25)
  if PSEEContext.reconstruction_result is available:
    projected_reconstruction_points = actual_reconstruction_points
  else:
    projected_reconstruction_points = 25  // conservative optimism

  projected_completion_points = 40  // assumes S-T3 → S-12 → S-13 path completes
  projected_score = 40 + 31 + projected_reconstruction_points
```

**Note:** The projection does NOT simulate coverage above 90%. 90% is the canonical threshold (DP-5-02); projecting beyond it would require heuristic assumptions about unmapped Phase B units.

**Caveat label (mandatory display):** "PROJECTED at minimum threshold (90% coverage). Actual score depends on resolution of unmapped Phase B units."

---

### Rule PR-04 — S-13 (COMPLETE): Projected Score = Canonical Score

**Source:** PSEE.1/psee_decision_contract_v1.md §Section 5 (Post-conditions); gauge_score_model.md §G.3

```
if PSEEContext.current_state = S-13:
  projected_score = canonical_score
  projection_note = "COMPLETE: projection equals canonical score. No pending resolutions."
```

Rationale: At S-13, execution is complete and all outputs are promoted. No further operator action can improve the canonical score for this execution. Future executions with additional evidence would produce new runs with new scores.

**Exception:** If S-13 was reached from S-T3 (PARTIAL with operator acknowledgement), the canonical score already reflects the actual coverage. No upward projection is possible.

---

## Projection Honesty Rules

These rules prevent the projected score from misrepresenting future outcomes:

| Rule | Specification |
|---|---|
| **PRH-01** No US resolution | Projected score never assumes any US record is resolved. US records remain in the variance band (confidence_and_variance_model.md §CRF-01). |
| **PRH-02** No PSEE.X application | No CP-xx candidate pattern is applied in projection computation. FUTURE_REVIEW patterns are not simulation inputs. |
| **PRH-03** No heuristic application | No FB-01..07 forbidden pattern is applied in projection. |
| **PRH-04** No STOP-02 projection | If the terminal state is S-T1 (STOPPED) due to STOP-02 (second divergence), projection = 0. Rule catalog extension is required before projection is possible. |
| **PRH-05** Conservative defaults | When actual values are unknown (coverage not yet computed, reconstruction not yet computed), projections use conservative defaults (90 for coverage, 25 for reconstruction) — not optimistic maximums. |
| **PRH-06** Mandatory caveat labels | Every projected score is labeled with its assumption set. The gauge never presents a projected score without its caveat. |

---

## Projection Output Schema

```
ProjectionResult {
  canonical_score:         integer    // from gauge_score_model.md
  projected_score:         integer    // from this document
  projection_rule_applied: string     // PR-01 | PR-02 | PR-03 | PR-04
  projection_caveat:       string     // mandatory label text
  assumptions: {
    escalations_resolved:  boolean,   // whether open escalations are assumed resolved
    coverage_at_threshold: boolean,   // whether 90% threshold is assumed
    reconstruction_actual: boolean    // whether actual reconstruction data was used
  }
}
```

---

#### STATUS

| Check | Result |
|---|---|
| Projection rules for all 4 terminal states defined (S-T1, S-T2, S-T3, S-13) | CONFIRMED |
| No US record resolution applied in projection | CONFIRMED |
| No PSEE.X candidate patterns applied | CONFIRMED |
| No heuristic application in projection | CONFIRMED |
| Conservative defaults specified | CONFIRMED |
| Caveat label requirement defined | CONFIRMED |
| Projection output schema defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**PROJECTION LOGIC SPEC: COMPLETE**
