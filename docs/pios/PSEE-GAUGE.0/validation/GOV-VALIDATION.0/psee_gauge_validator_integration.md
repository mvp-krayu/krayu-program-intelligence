# GOV-VALIDATION.0 — PSEE Gauge Validator Integration

**Stream:** GOV-VALIDATION.0
**Family:** GOV
**Date:** 2026-04-05
**Branch:** feature/pios-core
**Output namespace:** docs/pios/PSEE-GAUGE.0/validation/GOV-VALIDATION.0/
**Authority:** psee_gauge_validation_contract.md §8

---

## Purpose

This document defines the combined validation protocol for PSEE-GAUGE.0. It specifies:
1. How `validate_execution.sh` structural checks relate to GOV-VALIDATION.0 semantic checks
2. The manual execution procedure for GOV-VALIDATION.0 checks
3. The rerun protocol for future PSEE-GAUGE reruns
4. The conditions under which full revalidation is required

---

## 1. Two-Layer Validation Model

PSEE-GAUGE.0 is fully validated by two complementary layers:

```
Layer 1 — Structural/Procedural:  validate_execution.sh
Layer 2 — Semantic/Content:       GOV-VALIDATION.0 (this validation stream)

Both must PASS for full GOV.1 compliance.
```

**Layer 1 (`validate_execution.sh`)** checks:
- Artifact count and naming
- Namespace protection (no writes outside authorized paths)
- Git cleanliness
- Baseline artifact protection

**Layer 2 (GOV-VALIDATION.0)** checks:
- Score formula traceability (CHECK-009..025)
- Non-canonical boundary enforcement (CHECK-026..030)
- Operator boundary alignment (CHECK-031..034)
- BlueEdge independence (CHECK-035..037)
- No forbidden content (CHECK-038..041)

**Overlap note:** CHECK-001..002 (D1) and CHECK-003..008 (D2) in GOV-VALIDATION.0 structurally overlap with `validate_execution.sh` artifact count and namespace checks. This redundancy is intentional — GOV-VALIDATION.0 must be self-sufficient for contexts where `validate_execution.sh` is absent (as documented in PSEE-GAUGE.0/execution_manifest.md §2).

---

## 2. Validation Execution Protocol

The following procedure is used to validate PSEE-GAUGE.0. Each step must be completed in order. Any FAIL is terminal — do not proceed to subsequent steps without resolving the failing check.

---

### Step 1 — Load Artifacts

```
Load into validator context:
  docs/pios/PSEE-GAUGE.0/gauge_score_model.md
  docs/pios/PSEE-GAUGE.0/dimension_projection_model.md
  docs/pios/PSEE-GAUGE.0/confidence_and_variance_model.md
  docs/pios/PSEE-GAUGE.0/review_surface_linkage.md
  docs/pios/PSEE-GAUGE.0/projection_logic_spec.md
  docs/pios/PSEE-GAUGE.0/operator_visibility_contract.md
  docs/pios/PSEE-GAUGE.0/gauge_rendering_contract.md
  docs/pios/PSEE-GAUGE.0/execution_manifest.md

Load upstream authority artifacts:
  docs/pios/PSEE.1/psee_decision_contract_v1.md
  docs/pios/PSEE.1/decision_state_model.md
  docs/pios/PSEE.1/escalation_and_fallback_spec.md
  docs/pios/PSEE.2/exception_runtime_spec.md
  docs/pios/PSEE.2/heuristic_guard_spec.md
  docs/pios/PSEE-OPS.0/operator_input_contract.md
  docs/pios/PSEE-OPS.0/escalation_interface_spec.md
  docs/pios/PSEE-OPS.0/unknown_space_interface.md
  docs/pios/PSEE.X/non_canonical_boundary.md
  docs/pios/PSEE.X/future_review_queue.md
  docs/pios/PSEE.X/pattern_containment_matrix.md

If any artifact is absent → FAIL CLOSED. Do not proceed.
```

---

### Step 2 — Execute D1 (Artifact Count Integrity)

```
Run CHECK-001: count files at docs/pios/PSEE-GAUGE.0/ top level
  Expected: 8 markdown files
  Expected names: gauge_score_model.md, dimension_projection_model.md,
                  confidence_and_variance_model.md, review_surface_linkage.md,
                  projection_logic_spec.md, operator_visibility_contract.md,
                  gauge_rendering_contract.md, execution_manifest.md

Run CHECK-002: verify each name matches execution_manifest.md §4 artifact table

Record PASS or FAIL per check. Domain D1 result: PASS only if both PASS.
```

---

### Step 3 — Execute D2 (Namespace Integrity)

```
Inspect git diff for the PSEE-GAUGE.0 commit (commit a7ab913 per validation contract §2 L7):

Run CHECK-003: confirm no diff paths under docs/pios/PSEE.1/
Run CHECK-004: confirm no diff paths under docs/pios/PSEE.2/
Run CHECK-005: confirm no diff paths under docs/pios/PSEE-OPS.0/
Run CHECK-006: confirm no diff paths under docs/pios/PSEE.X/
Run CHECK-007: confirm no diff paths under docs/governance/
Run CHECK-008: confirm no diff paths under docs/pios/40.2/, 40.3/, 40.4/

Record PASS or FAIL per check. Domain D2 result: PASS only if all 6 PASS.
```

---

### Step 4 — Execute D3 (Traceability Integrity)

```
Using psee_gauge_traceability_checks.md specifications:

Run CHECK-009: completion component → state lookup vs PSEE.1 17-state model
Run CHECK-010: coverage component → DP-5-02
Run CHECK-011: reconstruction component → DP-6-01
Run CHECK-012: DIM-01 → coverage_percent, DP-5-02 threshold
Run CHECK-013: DIM-02 → reconstruction_result, DP-6-01
Run CHECK-014: DIM-03 → escalation_log, escalation spec
Run CHECK-015: DIM-04 → us_records (counter format)
Run CHECK-016: DIM-05 → filter_table
Run CHECK-017: DIM-06 → flags BLOCKED_HEURISTIC
Run CHECK-018: PR-01 → 0 for S-T1, exception runtime spec
Run CHECK-019: PR-02 → ESC resume states from escalation_interface_spec.md
Run CHECK-020: PR-03 → 90% threshold, DP-5-02
Run CHECK-021: PR-04 → canonical for S-13
Run CHECK-022: CRF-01 → us_records, INV-02
Run CHECK-023: CRF-02 → coverage_percent, DP-5-02
Run CHECK-024: CRF-03 → escalation_log
Run CHECK-025: CRF-04 → S-T1 full collapse

Record PASS or FAIL per check. Domain D3 result: PASS only if all 17 PASS.
```

---

### Step 5 — Execute D4 (Non-Canonical Boundary)

```
Using psee_gauge_boundary_checks.md D4 specifications:

Run CHECK-026: no CP-xx in gauge_score_model.md formula bodies
Run CHECK-027: no CP-xx in dimension_projection_model.md formula bodies
Run CHECK-028: no CP-xx in projection_logic_spec.md rule bodies; PRH-02 present
Run CHECK-029: all RL-01..04 carry NON-CANONICAL label; PANEL-03B mandates label
Run CHECK-030: FRQ=6 constant; reference_patterns=3 constant; no dynamic evaluation

Record PASS or FAIL per check. Domain D4 result: PASS only if all 5 PASS.
```

---

### Step 6 — Execute D5 (Operator Boundary)

```
Using psee_gauge_boundary_checks.md D5 specifications:

Run CHECK-031: EscalationResolution is only write channel; schema matches OPS.0 spec
Run CHECK-032: no DP condition_value input field in any panel
Run CHECK-033: DIM-04 is read-only; no US record resolution field
Run CHECK-034: V-01..V-10 present (count=10); alignment table covers all OPS.0 restrictions

Record PASS or FAIL per check. Domain D5 result: PASS only if all 4 PASS.
```

---

### Step 7 — Execute D6 (BlueEdge Independence)

```
Using psee_gauge_check_matrix.md D6 specifications:

Run CHECK-035: PANEL-04 columns contain no BlueEdge-specific field
Run CHECK-036: gauge_score_model.md thresholds cite only PSEE artifacts; no BlueEdge reference
Run CHECK-037: dimension_projection_model.md contains no BlueEdge-specific threshold or label

Record PASS or FAIL per check. Domain D6 result: PASS only if all 3 PASS.
```

---

### Step 8 — Execute D7 (No Leakage)

```
Using psee_gauge_check_matrix.md D7 specifications:

Run CHECK-038: zero frontend code constructs in any of the 8 artifacts
Run CHECK-039: zero commercial language patterns in any of the 8 artifacts
Run CHECK-040: all score computations are deterministic; no ML/stochastic values
Run CHECK-041: no unlabeled synthetic data in any artifact

Record PASS or FAIL per check. Domain D7 result: PASS only if all 4 PASS.
```

---

### Step 9 — Execute D8 (Validator Reusability)

```
Using psee_gauge_check_matrix.md D8 specifications:

Run CHECK-042: all 43 checks have criterion, verification, PASS condition, FAIL condition
Run CHECK-043: no check result depends on wall-clock time or evaluator identity

Record PASS or FAIL per check. Domain D8 result: PASS only if both PASS.
```

---

### Step 10 — Compute Stream Result

```
IF D1=PASS AND D2=PASS AND D3=PASS AND D4=PASS AND
   D5=PASS AND D6=PASS AND D7=PASS AND D8=PASS:
  STREAM RESULT: GOV-VALIDATION.0 PASS
  This supersedes the manual GOV.1 PASS in PSEE-GAUGE.0/execution_manifest.md §6

ELSE:
  STREAM RESULT: GOV-VALIDATION.0 FAIL
  Report: list of failing CHECK IDs and their FAIL reasons
  PSEE-GAUGE.0 is non-compliant until all failing checks are resolved
```

---

## 3. Rerun Protocol

PSEE-GAUGE.0 may be re-executed (e.g., for PSEE-GAUGE.0R repair or PSEE-GAUGE.1 revision). GOV-VALIDATION.0 checks must be re-executed against the new artifact set under the following conditions:

| Trigger | Full revalidation required? |
|---|---|
| New artifact added to PSEE-GAUGE.0 namespace | YES — D1 count change triggers CHECK-001 FAIL |
| Existing artifact content change | YES — run all checks against modified artifact |
| Score formula threshold change | YES — D3 checks re-run against new formula |
| New PSEE.X pattern promoted to canonical | YES — D4 checks re-run |
| Operator write access expanded | YES — D5 checks re-run |
| Cosmetic documentation fix (no formula change) | NO — but document the scope of change in the repair stream manifest |

**Version contract:** GOV-VALIDATION.0 is locked to PSEE-GAUGE.0 (commit a7ab913). If PSEE-GAUGE.0 produces a revision stream, a corresponding GOV-VALIDATION revision (GOV-VALIDATION.0R or GOV-VALIDATION.1) must be produced. The versioning rules are defined in `psee_gauge_validation_contract.md §7`.

---

## 4. Manual Execution Without validate_execution.sh

When `scripts/governance/validate_execution.sh` is absent (as confirmed in PSEE-GAUGE.0/execution_manifest.md §2), all GOV-VALIDATION.0 checks must be executed manually following the Step 1–10 protocol above.

**Minimum manual execution record:** The executor must produce a validation log documenting each CHECK ID with PASS or FAIL result. This log is the authoritative GOV.1 compliance record for that execution.

**No substitution:** Manual execution cannot be replaced by:
- Reading the execution_manifest.md §6 manual checks alone (those checks predate GOV-VALIDATION.0 and lack D3/D4/D5 semantic coverage)
- Asserting GOV.1 PASS without executing the checks
- Treating a single-run review as a revalidation

---

## 5. Validator Independence Rule

GOV-VALIDATION.0 checks are read-only toward PSEE-GAUGE.0 artifacts. The validator:

- does NOT modify any PSEE-GAUGE.0 file
- does NOT emit a new version of any PSEE artifact
- does NOT introduce new score rules or dimension definitions
- does NOT interpret ambiguous content — ambiguity → FAIL (fail-closed per psee_gauge_validation_contract.md §3)

If a check cannot be evaluated because an artifact is missing, corrupted, or does not contain the expected section → the check result is FAIL, not SKIP.

---

#### STATUS

| Check | Result |
|---|---|
| Two-layer validation model defined | CONFIRMED |
| Step 1–10 manual execution protocol defined | CONFIRMED |
| Rerun trigger table defined | CONFIRMED |
| Manual execution guidance (absent script) defined | CONFIRMED |
| Validator independence rule stated | CONFIRMED |
| No canonical mutation | CONFIRMED |

**PSEE GAUGE VALIDATOR INTEGRATION: COMPLETE**
