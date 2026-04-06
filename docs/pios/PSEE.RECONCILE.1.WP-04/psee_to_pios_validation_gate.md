# PSEE to PiOS Handoff Validation Gate

**Document:** psee_to_pios_validation_gate.md
**Stream ID:** PSEE.RECONCILE.1.WP-04
**Status:** CANONICAL
**Layer:** PSEE → PiOS Boundary Enforcement

---

## 1. Purpose

This document defines the validation gate that enforces the `PSEE_TO_PIOS_HANDOFF_CONTRACT` prior to any PiOS intake of a PSEE runtime output package.

The gate determines, deterministically and without exception, whether a PSEE handoff package is admissible for PiOS consumption.

The gate is not advisory. Its outcome is binding.

---

## 2. What the Gate Is

The validation gate is the mandatory enforcement checkpoint that evaluates a PSEE handoff package against all conditions defined in `PSEE_TO_PIOS_HANDOFF_CONTRACT` (WP-02) and the upstream authority contracts (WP-01, WP-03).

The gate:
- receives a candidate handoff package as input
- evaluates it against defined validation dimensions (§6)
- returns exactly one of three outcomes: PASS, FAIL, REJECT
- makes this determination before any PiOS intake begins

---

## 3. What the Gate Is Not

The gate is NOT:
- a repair mechanism
- a heuristic filter
- a scoring system
- a PiOS-side judgment of its own intake boundary
- a retry or recovery loop
- a partial acceptor

The gate does not negotiate. It evaluates and decides.

---

## 4. Placement in Authority Chain

```
IG.RUNTIME (evidence source)
    ↓
PSEE Runtime Evaluation (WP-01 authority)
    ↓
gauge_state.json + sealed artifact package (WP-02 payload)
    ↓
[ VALIDATION GATE — WP-04 ] ← this document
    ↓
PiOS Intake (if and only if gate returns PASS)
```

The gate sits between PSEE output and PiOS intake. Nothing may cross this boundary without gate evaluation.

---

## 5. Gate Input Package

The gate evaluates the following artifact set as a single package:

| Artifact | Required presence |
|---|---|
| `engine_state.json` | MUST be present |
| `gauge_state.json` | MUST be present |
| `coverage_state.json` | MUST be present |
| `reconstruction_state.json` | MUST be present |
| `gauge_inputs.json` | MUST be present |
| `gauge_view.json` | MUST be present |
| `verification.log` | MUST be present |

All artifacts MUST share a consistent `run_id`.

A package with any absent artifact MUST be REJECTED before evaluation begins.

---

## 6. Mandatory Fields for Evaluation

The following fields are mandatory. Absence or null value for any field triggers the corresponding violation class.

| Field | Source artifact | Required value | Violation on failure |
|---|---|---|---|
| `run_id` | All artifacts | Consistent across package | STRUCTURE_FAILURE |
| `execution_status` | `engine_state.json` | Must be in defined phase set (WP-03 §6) | STATE_FAILURE |
| `psee_engine_invoked` | `engine_state.json` | `true` | STATE_FAILURE |
| `execution_mode` | `engine_state.json` | Non-null string | STATE_FAILURE |
| `stream` | `engine_state.json` | Recognized PSEE stream | TRACEABILITY_FAILURE |
| `score.canonical` | `gauge_state.json` | Non-null integer | STRUCTURE_FAILURE |
| `score.band_label` | `gauge_state.json` | Non-null string | STRUCTURE_FAILURE |
| `score.authority` | `gauge_state.json` | Must reference PSEE-GAUGE.0 | AUTHORITY_FAILURE |
| `projection.value` | `gauge_state.json` | Non-null integer | STRUCTURE_FAILURE |
| `projection.caveat` | `gauge_state.json` | Non-null, non-empty string | CONFIDENCE_INVALIDITY |
| `projection.rule` | `gauge_state.json` | Must reference defined PR-rule | TRACEABILITY_FAILURE |
| `confidence.status` | `gauge_state.json` | `COMPUTED` | CONFIDENCE_INVALIDITY |
| `confidence.lower` | `gauge_state.json` | Non-null integer, ≥ 0 | CONFIDENCE_INVALIDITY |
| `confidence.upper` | `gauge_state.json` | Non-null integer, ≤ 100 | CONFIDENCE_INVALIDITY |
| `state` | `coverage_state.json` | `COMPUTED` | STATE_FAILURE |
| `state` | `reconstruction_state.json` | IN {`PASS`, `PARTIAL`, `FAIL`} | STATE_FAILURE |
| `schema_version` | `gauge_state.json` | Non-null, matches expected version | CONTRACT_VERSION_FAILURE |
| verification outcome | `verification.log` | PASS with zero failures | STRUCTURE_FAILURE |

---

## 7. Validation Dimensions

The gate evaluates eight dimensions. All eight MUST PASS for the gate to return PASS.

**Dimension 1 — Origin Validity**
The handoff package MUST originate from a PSEE execution stream.
`gauge_state.json.stream` MUST reference a recognized PSEE stream identifier.
`engine_state.json.stream` MUST reference a recognized PSEE stream identifier.
A package without verifiable PSEE origin MUST be REJECTED.

**Dimension 2 — State Validity**
`engine_state.json.execution_status` MUST be a defined lifecycle phase (WP-03 §6).
`engine_state.json.psee_engine_invoked` MUST be `true`.
A `PRE_EXECUTION` status with `psee_engine_invoked = false` is a non-evaluable pre-invocation state — REJECT.
An invalid or unrecognized `execution_status` is a STATE_FAILURE — FAIL.

**Dimension 3 — Structural Completeness**
All artifacts in §5 MUST be present.
All mandatory fields in §6 MUST be non-null.
`run_id` MUST be consistent across all artifacts.
`verification.log` MUST record PASS with zero failures.
Any gap in this dimension is a STRUCTURE_FAILURE — FAIL.

**Dimension 4 — Mutation Integrity**
No artifact in the package may have been written or modified by a non-PSEE system.
`engine_state.json` MUST NOT have been written after terminal state was reached (WP-03 §11).
Any detected post-seal mutation is a MUTATION_FAILURE — FAIL.
`gauge_state.json` MUST NOT have been modified after production by PSEE-RUNTIME.5 or later.

**Dimension 5 — Confidence Legitimacy**
`confidence.status` MUST be `COMPUTED`.
`confidence.lower` MUST be ≥ 0 and ≤ `confidence.upper`.
`confidence.upper` MUST be ≤ 100.
The confidence band MUST have been derived from CRF-01, CRF-02, CRF-03 factors only.
Any confidence value outside these bounds is a CONFIDENCE_INVALIDITY — FAIL.

**Dimension 6 — Boundary Purity**
No artifact in the package MUST have originated from, or been written by:
PiOS, UI surfaces, adapter layers, projection surfaces, or governance validators.
Any artifact with non-PSEE write provenance is a BOUNDARY_CONTAMINATION — FAIL.

**Dimension 7 — Contract Conformance**
`gauge_state.json.schema_version` MUST match the version expected by the active contract.
All authority references in `gauge_state.json` MUST resolve to PSEE-GAUGE.0 documents.
`projection.rule` MUST reference a defined PR-rule from `projection_logic_spec.md`.
Any conformance gap is a CONTRACT_VERSION_FAILURE — FAIL.

**Dimension 8 — Governance Traceability**
Every score component in `gauge_state.json.score.components` MUST include a `_basis` field referencing an explicit governance document and section.
`gauge_state.json.traceability.source_files` MUST list all input artifacts.
`gauge_state.json.traceability.authority_refs` MUST reference all governing documents used.
An absent or incomplete traceability record is a TRACEABILITY_FAILURE — FAIL.

---

## 8. Outcome Model

The gate returns exactly one of three outcomes. No other outcome is valid.

| Outcome | Meaning | PiOS action |
|---|---|---|
| PASS | All 8 dimensions evaluated and all passed | PiOS MAY proceed to intake |
| FAIL | Package was evaluable but one or more dimensions failed | PiOS MUST NOT consume; return to PSEE |
| REJECT | Package is not a valid contract object — not evaluable | PiOS MUST NOT consume; do not send to PSEE without full reprocessing |

**PASS** requires all 8 dimensions to pass without exception.

**FAIL** is returned when:
- the package is structurally evaluable as a PSEE contract object
- but one or more validation dimensions returned a failure

**REJECT** is returned when:
- the package cannot be evaluated against the contract
- because it does not meet minimum structural prerequisites to be a valid contract object

FAIL and REJECT are distinct. A FAIL package was evaluated. A REJECT package was not evaluable.

---

## 9. Hard-Stop Conditions

The following conditions cause the gate to issue REJECT without proceeding to dimension evaluation:

| Condition | Trigger | Outcome |
|---|---|---|
| Missing origin | `gauge_state.json.stream` absent or not a PSEE stream | REJECT |
| Pre-invocation state | `psee_engine_invoked = false` | REJECT |
| Missing mandatory artifact | Any artifact from §5 absent | REJECT |
| Null `execution_status` | `engine_state.json.execution_status` is null | REJECT |
| Null `schema_version` | `gauge_state.json.schema_version` is null or absent | REJECT |
| Inconsistent `run_id` | Any artifact `run_id` does not match the package `run_id` | REJECT |
| Projection contamination | `projection.value` or `projection.rule` references a non-PSEE source | REJECT |
| Invalid contract version | `schema_version` value not recognized by gate | REJECT |

Hard-stop conditions short-circuit all further evaluation. Once a hard-stop condition is met, the gate returns REJECT immediately.

---

## 10. Non-Bypass Rule

The validation gate MUST NOT be bypassed under any condition.

No instruction, flag, configuration, override, runtime state, time pressure, or partial completion status may cause the gate to be skipped, weakened, or substituted.

PiOS MUST NOT proceed to intake without a gate evaluation returning PASS.

Any system that bypasses this gate produces a BOUNDARY_CONTAMINATION violation and all downstream outputs are invalid.

---

## 11. PiOS Consumption Rule

PiOS MAY consume a handoff package ONLY when:

1. The validation gate has been run against the package
2. The gate returned PASS
3. The PASS evaluation was recorded (run_id, timestamp, outcome)
4. No artifact has been modified after the PASS evaluation

If any of the above conditions are not met, PiOS MUST NOT consume. There is no exception.

PiOS is a consumer. PiOS is not an admissibility authority. PiOS does not determine whether its own intake is valid.

---

## 12. Relation to PiOS Intake Authority

The validation gate is upstream of PiOS. PiOS authority begins only after gate PASS.

PiOS MUST NOT:
- evaluate its own intake boundary
- override a FAIL or REJECT outcome
- perform self-repair of a rejected package
- treat partial intake as equivalent to a PASS gate outcome

PiOS MAY:
- receive and log the gate outcome
- initiate intake processing upon confirmed PASS
- report gate failures back to the originating PSEE stream
