# GOV-VALIDATION.0 — PSEE Gauge Check Matrix

**Stream:** GOV-VALIDATION.0
**Family:** GOV
**Date:** 2026-04-05
**Branch:** feature/pios-core
**Output namespace:** docs/pios/PSEE-GAUGE.0/validation/GOV-VALIDATION.0/
**Authority:** psee_gauge_validation_contract.md

---

## Purpose

This document specifies the complete check catalog for GOV-VALIDATION.0. Every check has:
- an explicit CHECK ID
- a domain assignment
- a criterion (what must be true for PASS)
- a verification method (how to evaluate)
- a fail reason (what a FAIL indicates)

Checks in this matrix cover domains D1, D2, D6, D7, and D8. Domains D3, D4, and D5 have companion documents (`psee_gauge_traceability_checks.md` and `psee_gauge_boundary_checks.md`) where check specifications are more detailed.

---

## Domain D1 — Artifact Count Integrity (CHECK-001..002)

**Objective:** Exactly 8 governed artifacts exist in the PSEE-GAUGE.0 namespace with correct names.

**Authority:** docs/pios/PSEE-GAUGE.0/execution_manifest.md §4

---

### CHECK-001 — Artifact Count

| Field | Value |
|---|---|
| **Domain** | D1 |
| **Criterion** | Exactly 8 files exist directly under `docs/pios/PSEE-GAUGE.0/` (not counting subdirectories or validation output) |
| **Expected files** | gauge_score_model.md, dimension_projection_model.md, confidence_and_variance_model.md, review_surface_linkage.md, projection_logic_spec.md, operator_visibility_contract.md, gauge_rendering_contract.md, execution_manifest.md |
| **Verification** | List files at `docs/pios/PSEE-GAUGE.0/` top level; count markdown files; compare to 8 |
| **PASS condition** | File count = 8 AND all 8 names match exactly |
| **FAIL condition** | File count ≠ 8 OR any file name does not match the expected list |
| **Fail type** | Structural |

---

### CHECK-002 — Artifact Name Integrity

| Field | Value |
|---|---|
| **Domain** | D1 |
| **Criterion** | Each of the 8 artifact names matches exactly the names declared in execution_manifest.md §4 (no variant spelling, no suffix changes) |
| **Verification** | Compare directory listing against manifest artifact table row by row |
| **PASS condition** | All 8 names match exactly |
| **FAIL condition** | Any name differs (e.g., `gauge_score_model_v2.md`, `operator_visibility.md`, `rendering_contract.md`) |
| **Fail type** | Naming integrity |

---

## Domain D2 — Namespace Integrity (CHECK-003..008)

**Objective:** PSEE-GAUGE.0 artifacts do not write outside `docs/pios/PSEE-GAUGE.0/`. No upstream artifact is modified.

**Authority:** docs/governance/runtime/git_structure_contract.md §3.B; docs/governance/runtime/reference_boundary_contract.md

---

### CHECK-003 — No Writes to PSEE.1

| Field | Value |
|---|---|
| **Domain** | D2 |
| **Criterion** | No file under `docs/pios/PSEE.1/` was created, modified, or deleted by PSEE-GAUGE.0 |
| **Verification** | Inspect git diff for PSEE-GAUGE.0 commit; confirm no path starts with `docs/pios/PSEE.1/` |
| **PASS condition** | Zero PSEE.1 path changes in PSEE-GAUGE.0 commit |
| **FAIL condition** | Any file under `docs/pios/PSEE.1/` appears in diff |
| **Fail type** | Namespace violation |

---

### CHECK-004 — No Writes to PSEE.2

| Field | Value |
|---|---|
| **Domain** | D2 |
| **Criterion** | No file under `docs/pios/PSEE.2/` was created, modified, or deleted by PSEE-GAUGE.0 |
| **Verification** | Inspect git diff for PSEE-GAUGE.0 commit; confirm no path starts with `docs/pios/PSEE.2/` |
| **PASS condition** | Zero PSEE.2 path changes in PSEE-GAUGE.0 commit |
| **FAIL condition** | Any file under `docs/pios/PSEE.2/` appears in diff |
| **Fail type** | Namespace violation |

---

### CHECK-005 — No Writes to PSEE-OPS.0

| Field | Value |
|---|---|
| **Domain** | D2 |
| **Criterion** | No file under `docs/pios/PSEE-OPS.0/` was created, modified, or deleted by PSEE-GAUGE.0 |
| **Verification** | Inspect git diff for PSEE-GAUGE.0 commit; confirm no path starts with `docs/pios/PSEE-OPS.0/` |
| **PASS condition** | Zero PSEE-OPS.0 path changes |
| **FAIL condition** | Any file under `docs/pios/PSEE-OPS.0/` appears in diff |
| **Fail type** | Namespace violation |

---

### CHECK-006 — No Writes to PSEE.X

| Field | Value |
|---|---|
| **Domain** | D2 |
| **Criterion** | No file under `docs/pios/PSEE.X/` was created, modified, or deleted by PSEE-GAUGE.0 |
| **Verification** | Inspect git diff for PSEE-GAUGE.0 commit; confirm no path starts with `docs/pios/PSEE.X/` |
| **PASS condition** | Zero PSEE.X path changes |
| **FAIL condition** | Any file under `docs/pios/PSEE.X/` appears in diff |
| **Fail type** | Namespace violation (non-canonical boundary) |

---

### CHECK-007 — No Writes to Governance

| Field | Value |
|---|---|
| **Domain** | D2 |
| **Criterion** | No file under `docs/governance/` was created, modified, or deleted by PSEE-GAUGE.0 |
| **Verification** | Inspect git diff for PSEE-GAUGE.0 commit; confirm no path starts with `docs/governance/` |
| **PASS condition** | Zero governance path changes |
| **FAIL condition** | Any file under `docs/governance/` appears in diff |
| **Fail type** | Branch-domain violation (governance domain owned by feature/governance) |

---

### CHECK-008 — No Writes to Legacy 40.x Streams

| Field | Value |
|---|---|
| **Domain** | D2 |
| **Criterion** | No file under `docs/pios/40.2/`, `docs/pios/40.3/`, or `docs/pios/40.4/` was created, modified, or deleted by PSEE-GAUGE.0 |
| **Verification** | Inspect git diff; confirm no paths under `docs/pios/40.2/`, `40.3/`, `40.4/` |
| **PASS condition** | Zero legacy stream path changes |
| **FAIL condition** | Any file under these paths appears in diff |
| **Fail type** | Baseline protection violation |

---

## Domain D6 — BlueEdge Independence (CHECK-035..037)

**Objective:** PSEE-GAUGE.0 contains no corpus-specific defaults, no BlueEdge-only fields, and no values that assume BlueEdge as the execution target.

**Authority:** PSEE-GAUGE.0/execution_manifest.md §3 (`blueEdge_lock_in: NONE`); PSEE-GAUGE.0/operator_visibility_contract.md §V-10

---

### CHECK-035 — No BlueEdge-Specific Column Defaults in Portfolio Table

| Field | Value |
|---|---|
| **Domain** | D6 |
| **Criterion** | `gauge_rendering_contract.md` PANEL-04 column list contains no BlueEdge-specific field; no default values derived from BlueEdge corpus structure |
| **Verification** | Read `gauge_rendering_contract.md §PANEL-04`; confirm column list matches only PSEEContext fields (run_id, system_name, system_version, final_state, canonical_score, band, coverage_percent, us_record_count, open_escalations, execution_timestamp); no BlueEdge field present |
| **PASS condition** | Column list matches exactly the generic PSEEContext schema; zero BlueEdge-named columns |
| **FAIL condition** | Any column references a BlueEdge-specific field (e.g., `blueEdge_phase`, `blueEdge_corpus_id`, or similar) |
| **Fail type** | BlueEdge lock-in |

---

### CHECK-036 — No BlueEdge Score Defaults

| Field | Value |
|---|---|
| **Domain** | D6 |
| **Criterion** | `gauge_score_model.md` contains no BlueEdge-specific score default, threshold override, or band adjustment |
| **Verification** | Read `gauge_score_model.md`; confirm all thresholds (score bands 80/40, coverage 90%, reconstruction weights) reference only PSEE artifact authorities (DP-5-02, DP-6-01); no reference to BlueEdge corpus name as a threshold source |
| **PASS condition** | All thresholds traceable to PSEE artifacts; zero BlueEdge references in formula definitions |
| **FAIL condition** | Any threshold value references BlueEdge as the reason for its value |
| **Fail type** | BlueEdge lock-in |

---

### CHECK-037 — No BlueEdge Dimension Overrides

| Field | Value |
|---|---|
| **Domain** | D6 |
| **Criterion** | `dimension_projection_model.md` contains no BlueEdge-specific dimension state label, threshold, or projection default |
| **Verification** | Read `dimension_projection_model.md`; confirm DIM-01..06 state labels and projection values use generic PSEEContext field names; no DIM contains a threshold specific to BlueEdge phase count or BlueEdge coverage percentage |
| **PASS condition** | All dimension specs use corpus-agnostic values |
| **FAIL condition** | Any DIM threshold or label hardcoded to BlueEdge corpus structure |
| **Fail type** | BlueEdge lock-in |

---

## Domain D7 — No Leakage (CHECK-038..041)

**Objective:** PSEE-GAUGE.0 contains no frontend code, no commercial/promotional language, and no predictive inference logic.

**Authority:** PSEE-GAUGE.0/execution_manifest.md §3 (`forbidden_actions_confirmed`); CLAUDE.md §13

---

### CHECK-038 — No Frontend Code

| Field | Value |
|---|---|
| **Domain** | D7 |
| **Criterion** | No PSEE-GAUGE.0 artifact contains code written in HTML, CSS, JavaScript, TypeScript, JSX, TSX, Vue, React, or any frontend markup language |
| **Verification** | Read all 8 PSEE-GAUGE.0 artifacts; confirm all content is markdown specification only; no code blocks contain frontend syntax (no `<div>`, no `className`, no `useState`, no `.css` selectors) |
| **PASS condition** | Zero frontend code constructs in any artifact |
| **FAIL condition** | Any artifact contains recognizable frontend code (even a single HTML tag or CSS selector) |
| **Fail type** | Forbidden content (UI/frontend leakage) |

---

### CHECK-039 — No Commercial Language

| Field | Value |
|---|---|
| **Domain** | D7 |
| **Criterion** | No PSEE-GAUGE.0 artifact contains commercial positioning language (e.g., "market-leading", "enterprise-grade", "competitive advantage", "ROI", "business value", "monetization", "go-to-market") |
| **Verification** | Read all 8 PSEE-GAUGE.0 artifacts; scan for commercial language patterns; confirm all statements are technical specification or governance language only |
| **PASS condition** | Zero commercial language patterns found |
| **FAIL condition** | Any artifact contains commercial positioning language |
| **Fail type** | Forbidden content (commercial leakage) |

---

### CHECK-040 — No Predictive Inference

| Field | Value |
|---|---|
| **Domain** | D7 |
| **Criterion** | No PSEE-GAUGE.0 artifact introduces logic that predicts future execution outcomes beyond the defined projection rules (PR-01..04) in `projection_logic_spec.md`; no ML-derived or heuristic-derived scores appear |
| **Verification** | Read `gauge_score_model.md`, `confidence_and_variance_model.md`, `projection_logic_spec.md`; confirm all numeric computations derive from deterministic formulas over PSEEContext fields; no probability distributions, confidence intervals derived from statistical models, or ML predictions |
| **PASS condition** | All computations deterministic and traceable to PSEE artifacts; zero stochastic or ML-derived values |
| **FAIL condition** | Any artifact references prediction models, probability scores, or ML-derived adjustments |
| **Fail type** | Forbidden content (predictive inference) |

---

### CHECK-041 — No Synthetic Data

| Field | Value |
|---|---|
| **Domain** | D7 |
| **Criterion** | No PSEE-GAUGE.0 artifact contains example score values, example run IDs, or sample PSEEContext data that could be mistaken for real execution outputs in a production render |
| **Verification** | Read all 8 PSEE-GAUGE.0 artifacts; confirm any numeric examples are labeled as illustrative (e.g., formula examples, threshold demonstrations); no artifact contains a fake but realistic-looking PSEERunHandle record |
| **PASS condition** | Any examples present are clearly labeled as illustrative; zero production-mimicking synthetic data |
| **FAIL condition** | Any artifact contains unlabeled example scores or synthetic run records |
| **Fail type** | Forbidden content (synthetic data) |

---

## Domain D8 — Validator Reusability (CHECK-042..043)

**Objective:** All checks in GOV-VALIDATION.0 are explicit, verifiable without interpretation, and stable across rerun without modification.

**Authority:** psee_gauge_validation_contract.md §3 (Validation Mode: COMPLIANCE CHECK ONLY); psee_gauge_validation_contract.md §4 (Validation Domains)

---

### CHECK-042 — All Checks Are Explicit

| Field | Value |
|---|---|
| **Domain** | D8 |
| **Criterion** | Every check in GOV-VALIDATION.0 (CHECK-001..043) specifies an explicit criterion, a verification method, and a PASS/FAIL condition; no check requires evaluator judgment to interpret the criterion |
| **Verification** | Read all check specifications in psee_gauge_check_matrix.md, psee_gauge_traceability_checks.md, psee_gauge_boundary_checks.md; confirm every check has: criterion, verification, PASS condition, FAIL condition |
| **PASS condition** | All 43 checks have all four required fields; zero checks require interpretation to evaluate |
| **FAIL condition** | Any check is missing a criterion, verification method, or PASS/FAIL condition |
| **Fail type** | Structural (validator reusability) |

---

### CHECK-043 — Checks Are Stable Across Reruns

| Field | Value |
|---|---|
| **Domain** | D8 |
| **Criterion** | Applying the same checks against the same PSEE-GAUGE.0 artifacts produces the same PASS/FAIL results on every execution; no check depends on wall-clock time, evaluator identity, or external state not defined in the PSEE-GAUGE.0 artifact set |
| **Verification** | Review each check for time-dependent or evaluator-dependent criteria; confirm all verifications reference only artifact content, git diff, or file structure; no check references today's date or an external system state |
| **PASS condition** | Zero time-dependent or identity-dependent check criteria |
| **FAIL condition** | Any check criterion changes result based on when or by whom it is run |
| **Fail type** | Structural (validator stability) |

---

## Check Summary Table

| CHECK ID | Domain | Description | Companion doc |
|---|---|---|---|
| CHECK-001 | D1 | Artifact count = 8 | This document |
| CHECK-002 | D1 | Artifact names match manifest | This document |
| CHECK-003 | D2 | No writes to PSEE.1 | This document |
| CHECK-004 | D2 | No writes to PSEE.2 | This document |
| CHECK-005 | D2 | No writes to PSEE-OPS.0 | This document |
| CHECK-006 | D2 | No writes to PSEE.X | This document |
| CHECK-007 | D2 | No writes to governance | This document |
| CHECK-008 | D2 | No writes to 40.2/40.3/40.4 | This document |
| CHECK-009..025 | D3 | Traceability (score, dimensions, projection) | psee_gauge_traceability_checks.md |
| CHECK-026..030 | D4 | Non-canonical boundary (PSEE.X) | psee_gauge_boundary_checks.md |
| CHECK-031..034 | D5 | Operator boundary (PSEE-OPS.0) | psee_gauge_boundary_checks.md |
| CHECK-035 | D6 | No BlueEdge portfolio columns | This document |
| CHECK-036 | D6 | No BlueEdge score defaults | This document |
| CHECK-037 | D6 | No BlueEdge dimension overrides | This document |
| CHECK-038 | D7 | No frontend code | This document |
| CHECK-039 | D7 | No commercial language | This document |
| CHECK-040 | D7 | No predictive inference | This document |
| CHECK-041 | D7 | No synthetic data | This document |
| CHECK-042 | D8 | All checks explicit | This document |
| CHECK-043 | D8 | Checks stable across reruns | This document |

---

#### STATUS

| Check | Result |
|---|---|
| D1 checks (CHECK-001..002) defined | CONFIRMED |
| D2 checks (CHECK-003..008) defined | CONFIRMED |
| D6 checks (CHECK-035..037) defined | CONFIRMED |
| D7 checks (CHECK-038..041) defined | CONFIRMED |
| D8 checks (CHECK-042..043) defined | CONFIRMED |
| D3 checks deferred to psee_gauge_traceability_checks.md | CONFIRMED |
| D4/D5 checks deferred to psee_gauge_boundary_checks.md | CONFIRMED |
| All 43 check IDs accounted for in summary table | CONFIRMED |
| No canonical mutation | CONFIRMED |

**PSEE GAUGE CHECK MATRIX: COMPLETE**
