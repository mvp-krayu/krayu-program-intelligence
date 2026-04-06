# Handoff Violation Classes

**Document:** handoff_violation_classes.md
**Stream ID:** PSEE.RECONCILE.1.WP-04
**Status:** CANONICAL
**Layer:** PSEE → PiOS Boundary Enforcement

---

## 1. Purpose

This document defines the canonical violation classes for the PSEE to PiOS handoff validation gate.

Each violation class maps to an exact trigger condition. A violation class is raised when its trigger condition is met during gate evaluation. Raising a violation class determines the gate outcome per the admissibility matrix (WP-04 handoff_admissibility_matrix.md).

No violation class may be waived, suppressed, or downgraded.

---

## 2. AUTHORITY_FAILURE

**Definition:** The handoff package references an authority source that is not the canonical governing document for the claimed field.

**Trigger conditions:**

- `gauge_state.json.score.authority` does not reference `PSEE-GAUGE.0/gauge_score_model.md`
- `gauge_state.json.projection.authority` does not reference `PSEE-GAUGE.0/projection_logic_spec.md`
- `gauge_state.json.confidence.authority` does not reference `PSEE-GAUGE.0/confidence_and_variance_model.md`
- Any DIM authority field references a document outside PSEE-GAUGE.0
- Score component `_basis` fields reference non-existent or non-governed documents

**Gate outcome:** FAIL

**Required action:** Return to PSEE. Authority references must be corrected to point to governing documents.

---

## 3. STRUCTURE_FAILURE

**Definition:** The handoff package is structurally incomplete or internally inconsistent in a way that prevents valid evaluation.

**Trigger conditions:**

- Any mandatory field listed in gate §6 is null where a non-null value is required
- `run_id` is not consistent across all artifacts in the package
- `verification.log` records any failure (non-zero failure count)
- `gauge_state.json.score.canonical` is null
- `gauge_state.json.score.components` is absent or incomplete
- `gauge_state.json.traceability.source_files` does not list all evaluated input artifacts
- `gauge_view.json` stream identifier does not match `gauge_state.json` stream

**Gate outcome:** FAIL

**Required action:** Return to PSEE. Structural gaps must be resolved at the point of production.

---

## 4. STATE_FAILURE

**Definition:** The engine state or DIM state in the package is invalid, unrecognized, or contradictory.

**Trigger conditions:**

- `engine_state.json.execution_status` is not in the defined lifecycle phase set (WP-03 §6)
- `engine_state.json.psee_engine_invoked` is `false` when `execution_status` is not `PRE_EXECUTION`
- `engine_state.json.psee_engine_invoked` is `true` when `execution_status` is `PRE_EXECUTION`
- `coverage_state.json.state` is not `COMPUTED`
- `reconstruction_state.json.state` is not in `{PASS, PARTIAL, FAIL}`
- Any DIM state is null when that DIM has been evaluated
- A backward state transition is detected relative to WP-03 §7

**Gate outcome:** FAIL (or REJECT if `execution_status` is null — see gate §9)

**Required action:** Return to PSEE. State conditions must be corrected through governed PSEE execution.

---

## 5. MUTATION_FAILURE

**Definition:** A sealed or governed artifact has been written or modified outside of the authorized PSEE execution context.

**Trigger conditions:**

- `engine_state.json` has been modified after a terminal state was recorded (WP-03 §11)
- `gauge_state.json` has been modified after production by the PSEE runtime stream
- `coverage_state.json` has been modified after production by PSEE-RUNTIME.5A or equivalent
- `reconstruction_state.json` has been modified after production by PSEE-RUNTIME.6A or equivalent
- `engine_state.json.execution_mode` value differs from the value at invocation time
- `engine_state.json.run_id` value has changed after initial write
- sha256 of any artifact does not match the value recorded at PSEE production time (where recorded)

**Gate outcome:** FAIL

**Required action:** Return to PSEE. Mutation source must be investigated. Full audit of artifact provenance required before reprocessing.

---

## 6. TRACEABILITY_FAILURE

**Definition:** The handoff package lacks sufficient traceability to verify the origin, derivation, or governance chain of its contents.

**Trigger conditions:**

- `engine_state.json.stream` is absent, null, or not a recognized PSEE stream identifier
- `gauge_state.json.stream` is absent, null, or not a recognized PSEE stream identifier
- `gauge_state.json.traceability.authority_refs` is absent or empty
- `gauge_state.json.traceability.source_files` is absent or does not include all input artifacts
- Any score component `_basis` field is absent or empty
- `gauge_state.json.projection.rule` references a rule identifier not defined in `projection_logic_spec.md`
- `coverage_state.json.authority` is absent or does not reference a PSEE-GAUGE.0 document
- `reconstruction_state.json.authority` is absent or does not reference a PSEE-GAUGE.0 document

**Gate outcome:** FAIL

**Required action:** Return to PSEE. Traceability fields must be populated at the point of production.

---

## 7. CONTRACT_VERSION_FAILURE

**Definition:** The handoff package does not conform to the active contract version expected by the validation gate.

**Trigger conditions:**

- `gauge_state.json.schema_version` is absent or null
- `gauge_state.json.schema_version` value is not recognized by the gate
- `gauge_state.json.schema_version` references a version that has been superseded and is no longer active
- Any artifact schema structure is incompatible with the version declared in `schema_version`
- The declared `schema_version` does not match between `gauge_state.json` and `gauge_view.json` where both declare a version

**Gate outcome:** FAIL (or REJECT if `schema_version` is null — see gate §9)

**Required action:** Return to PSEE. Version alignment between package artifacts and active contract is required.

---

## 8. BOUNDARY_CONTAMINATION

**Definition:** An artifact in the handoff package has been written, modified, or influenced by a system outside PSEE's authorized boundary.

**Trigger conditions:**

- Any artifact `stream` field references a non-PSEE system (PiOS, UI, adapter, projection layer, validator)
- `engine_state.json` contains values consistent with PiOS-side modification
- `gauge_state.json` contains fields not produced by any recognized PSEE execution stream
- Any artifact has been modified after being delivered to PiOS intake
- PiOS or any downstream consumer has written any field in any package artifact
- A UI, adapter, or rendering surface has modified a governed runtime artifact

**Gate outcome:** FAIL

**Required action:** Return to PSEE. Contamination source must be identified and eliminated. Full PSEE reprocessing required. Downstream outputs produced using a contaminated package are invalid.

---

## 9. CONFIDENCE_INVALIDITY

**Definition:** The confidence band in the handoff package is structurally invalid, out of range, or was not computed by the governed confidence model.

**Trigger conditions:**

- `gauge_state.json.confidence.status` is not `COMPUTED`
- `gauge_state.json.confidence.lower` is null
- `gauge_state.json.confidence.upper` is null
- `gauge_state.json.confidence.lower` is less than 0
- `gauge_state.json.confidence.upper` is greater than 100
- `gauge_state.json.confidence.lower` is greater than `gauge_state.json.confidence.upper`
- `gauge_state.json.confidence.authority` does not reference `PSEE-GAUGE.0/confidence_and_variance_model.md`
- `gauge_state.json.projection.caveat` is absent, null, or empty
- The confidence band was derived from factors outside CRF-01, CRF-02, CRF-03 as defined in `confidence_and_variance_model.md`

**Gate outcome:** FAIL

**Required action:** Return to PSEE. Confidence values must be recomputed by the governed confidence model with proper authority reference.

---

## 10. Violation Class Summary

| Class | Gate outcome | PiOS consumption | Corrective path |
|---|---|---|---|
| AUTHORITY_FAILURE | FAIL | FORBIDDEN | PSEE correction |
| STRUCTURE_FAILURE | FAIL | FORBIDDEN | PSEE correction |
| STATE_FAILURE | FAIL or REJECT | FORBIDDEN | PSEE correction or reprocessing |
| MUTATION_FAILURE | FAIL | FORBIDDEN | PSEE reprocessing + audit |
| TRACEABILITY_FAILURE | FAIL | FORBIDDEN | PSEE correction |
| CONTRACT_VERSION_FAILURE | FAIL or REJECT | FORBIDDEN | PSEE version alignment |
| BOUNDARY_CONTAMINATION | FAIL | FORBIDDEN | PSEE reprocessing; downstream invalidation |
| CONFIDENCE_INVALIDITY | FAIL | FORBIDDEN | PSEE correction |

No violation class permits PiOS consumption. The only path to PiOS consumption is a gate PASS with zero violation classes raised.
