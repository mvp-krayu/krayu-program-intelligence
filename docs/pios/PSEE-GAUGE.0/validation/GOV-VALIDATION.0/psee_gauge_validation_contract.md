# GOV-VALIDATION.0 — PSEE Gauge Validation Contract

**Stream:** GOV-VALIDATION.0
**Family:** GOV
**Date:** 2026-04-05
**Branch:** feature/pios-core
**Output namespace:** docs/pios/PSEE-GAUGE.0/validation/GOV-VALIDATION.0/
**Validated artifact:** docs/pios/PSEE-GAUGE.0/ (PSEE-GAUGE.0, commit a7ab913)

---

## 1. Purpose

This contract defines the authoritative validation rules for PSEE-GAUGE.0. It replaces the manual GOV.1 check declared in `PSEE-GAUGE.0/execution_manifest.md §6` with a formalized, reusable, and explicitly enumerated compliance specification.

**What is being validated:**
- The 8 governed artifacts of PSEE-GAUGE.0 are compliant with their upstream authorities
- The gauge surface does not introduce canonical mutations
- The gauge surface does not grant authority to non-canonical PSEE.X content
- The gauge surface preserves operator boundary definitions from PSEE-OPS.0
- The gauge surface is BlueEdge-agnostic
- No frontend, commercial, or predictive content is present

**What is NOT being validated:**
- Runtime gauge scores (no actual PSEEContext is evaluated here)
- PSEE engine behavior (that is validated by PSEE.2/engine_validation_report.md)
- PSEE.X candidate patterns (their containment is governed by PSEE.X/non_canonical_boundary.md)

---

## 2. Authority Hierarchy

The validation contract is derived from the following authoritative sources, in descending precedence:

| Level | Document | Role |
|---|---|---|
| L1 | docs/governance/runtime/git_structure_contract.md | Branch domain authority |
| L2 | docs/governance/runtime/reference_boundary_contract.md | Layer boundary authority |
| L3 | docs/pios/PSEE.1/psee_decision_contract_v1.md | PSEE output authority |
| L4 | docs/pios/PSEE.2/engine_validation_report.md | Engine compliance proof |
| L5 | docs/pios/PSEE-OPS.0/operator_input_contract.md | Operator authority boundary |
| L6 | docs/pios/PSEE.X/non_canonical_boundary.md | Non-canonical boundary proof |
| L7 | docs/pios/PSEE-GAUGE.0/ (all 8 artifacts) | Subject of validation |

---

## 3. Validation Mode

**Mode:** COMPLIANCE CHECK ONLY

The validator:
- reads PSEE-GAUGE.0 artifacts
- checks them against the authority hierarchy
- emits PASS or FAIL per check

The validator does NOT:
- re-score any gauge computation
- re-interpret any PSEE.X candidate pattern
- introduce new rules
- modify any PSEE-GAUGE.0 artifact
- override any upstream PSEE document

**Fail-closed:** Any check that cannot be evaluated (missing artifact, unparseable content, ambiguous field) produces FAIL, not SKIP.

---

## 4. Validation Domains

Eight validation domains are defined. Each domain maps to an objective from the stream contract §D.

| Domain | ID | Description | Check range |
|---|---|---|---|
| Artifact Count Integrity | D1 | Exactly 8 governed artifacts, correct names | CHECK-001..002 |
| Namespace Integrity | D2 | No writes outside PSEE-GAUGE.0 namespace | CHECK-003..008 |
| Traceability Integrity | D3 | Score / dimension / projection all trace to PSEE artifacts | CHECK-009..025 |
| Non-Canonical Boundary | D4 | PSEE.X linked as review only; no CP-xx authority leak | CHECK-026..030 |
| Operator Boundary | D5 | Operator visibility aligns with PSEE-OPS.0; write access = EscalationResolution | CHECK-031..034 |
| BlueEdge Independence | D6 | No corpus-specific defaults from BlueEdge instantiation | CHECK-035..037 |
| No Leakage | D7 | No frontend code, no commercial language, no predictive inference | CHECK-038..041 |
| Validator Reusability | D8 | All checks are explicit, verifiable, and stable | CHECK-042..043 |

**Total: 43 checks across 8 domains**

---

## 5. PASS / FAIL Semantics

**CHECK PASS:** The check criterion is satisfied. The artifact under inspection meets the stated requirement.

**CHECK FAIL:** The check criterion is not satisfied. The artifact under inspection violates or cannot satisfy the stated requirement. A FAIL on any check constitutes a domain FAIL.

**DOMAIN PASS:** All checks within the domain PASS.

**DOMAIN FAIL:** One or more checks within the domain FAIL. Domain FAIL is reported with the specific CHECK IDs that failed.

**STREAM PASS:** All 8 domains PASS. This replaces the prior manual GOV.1 PASS declaration.

**STREAM FAIL:** Any domain FAIL. PSEE-GAUGE.0 is considered non-compliant until failing checks are resolved.

---

## 6. Validation Artifact Inventory

Full check specifications are distributed across companion artifacts:

| Domain | Specification artifact |
|---|---|
| D1 (Artifact Count), D2 (Namespace), D6 (BlueEdge), D7 (Leakage), D8 (Reusability) | psee_gauge_check_matrix.md |
| D3 (Traceability) | psee_gauge_traceability_checks.md |
| D4 (Non-Canonical Boundary), D5 (Operator Boundary) | psee_gauge_boundary_checks.md |
| Integration and rerun protocol | psee_gauge_validator_integration.md |

---

## 7. Contract Versioning

This validation contract is version-locked to PSEE-GAUGE.0. Future gauge versions (PSEE-GAUGE.1, PSEE-GAUGE.0R) require a corresponding GOV-VALIDATION revision (GOV-VALIDATION.1 or GOV-VALIDATION.0R) if:
- new artifacts are added to the gauge namespace
- score formula changes
- new dimensions are added or removed
- operator visibility rules change

A validation contract revision without a corresponding gauge stream revision is not permitted — the validation contract must always reference an authoritative PSEE-GAUGE stream, not a hypothetical future state.

---

## 8. Relation to validate_execution.sh

The existing `validate_execution.sh` performs generic stream governance checks (artifact count, git cleanliness, namespace protection). GOV-VALIDATION.0 adds semantic compliance checks specific to the gauge layer.

The relationship is additive:
```
validate_execution.sh         → structural/procedural compliance
GOV-VALIDATION.0 checks       → semantic/content compliance
Both together                 → full GOV.1 compliance for PSEE-GAUGE reruns
```

See `psee_gauge_validator_integration.md` for the combined validation protocol.

---

#### STATUS

| Check | Result |
|---|---|
| Validation purpose defined | CONFIRMED |
| Authority hierarchy defined | CONFIRMED |
| 8 validation domains enumerated | CONFIRMED |
| PASS/FAIL semantics defined | CONFIRMED |
| Contract versioning defined | CONFIRMED |
| No canonical mutation | CONFIRMED |

**PSEE GAUGE VALIDATION CONTRACT: COMPLETE**
