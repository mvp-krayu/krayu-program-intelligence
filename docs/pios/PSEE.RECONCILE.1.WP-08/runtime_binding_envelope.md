# PSEE.RECONCILE.1.WP-08 — Runtime Binding Envelope

## Stream Identity
- Stream ID: PSEE.RECONCILE.1.WP-08
- Program: Krayu — Program Intelligence Discipline
- Layer: Reconciliation / Runtime Binding Envelope
- Status: ACTIVE — CANONICAL PACKAGE DEFINITION

## Authority Statement
This document defines the canonical Runtime Binding Envelope for PSEE → PiOS.
PiOS consumes sealed envelopes only. No loose artifact consumption is permitted.

## Purpose
Define the single authoritative runtime package handed from PSEE to PiOS, binding all required artifacts, identity, and verification into one consumable object.

## Canonical Principle
The package is the authority boundary.
Verification is bound to the envelope as a whole, not to individual artifacts.

## Canonical Package Structure

/package_root/
  ├── package_manifest.json
  ├── verification.log
  ├── engine_state.json
  ├── gauge_state.json
  ├── gauge_view.json
  ├── coverage_state.json
  ├── reconstruction_state.json
  └── traceability/ (optional, governed)

Rules:
- All mandatory artifacts must exist
- All artifacts must share identical run_id
- No duplicates or conflicting artifacts allowed
- Partial packages must be explicitly declared in verification.log

## Envelope Identity

Package identity is defined by:
- run_id
- package_version
- manifest_hash
- verification_hash

Rules:
- Identity must be consistent across all artifacts
- Any mismatch invalidates the package
- Identity is immutable once emitted

## Artifact Authority Classes

- Entry Authority:
  - package_manifest.json

- Verification Authority:
  - verification.log

- Payload Authority:
  - engine_state.json
  - gauge_state.json
  - gauge_view.json
  - coverage_state.json
  - reconstruction_state.json

- Auxiliary Governed:
  - traceability/

## Manifest Authority

package_manifest.json defines entry authority.

Required fields (conceptual):
- run_id
- package_version
- artifact_inventory
- required_artifacts_status
- verification_reference
- lifecycle_state
- emission_timestamp
- source_system = PSEE

Rules:
- Manifest is first-read artifact
- Manifest declares completeness only
- Manifest cannot declare verification outcome
- Manifest must not contradict actual inventory or verification.log

## Verification Binding

verification.log is mandatory and co-equal authority.

Rules:
- Must conform to WP-07
- Must describe envelope-level evaluated scope
- Must include consumption permission
- Must not certify beyond evaluated scope

PiOS must read verification.log before any payload access.

## Intake Sequence (PiOS)

Strict order:

1. Load package_manifest.json
2. Validate run_id consistency
3. Validate mandatory artifact presence
4. Load verification.log
5. Evaluate verification outcome
6. Determine intake mode
7. Expose payload artifacts

No payload consumption allowed before step 5.

## Intake Modes

### AUTHORITATIVE_INTAKE
Trigger: PASS_FULL
- Full consumption allowed
- No uncertainty propagation

### BOUNDED_INTAKE
Trigger: PASS_PARTIAL
- Consume verified scope only as authoritative
- Unverified scope treated as uncertain
- Uncertainty must be propagated downstream
- No implicit upgrade allowed

### REJECT
Trigger: FAIL_STRUCTURAL
- No consumption
- No partial intake
- Package returned to PSEE
- Rejection logged

## Consumption Boundary Rules

PiOS must:
- Not consume artifacts before verification evaluation
- Not mix verified and unverified scope without explicit uncertainty marking
- Not override FAIL_STRUCTURAL
- Not upgrade PASS_PARTIAL to PASS_FULL
- Preserve scope boundaries in all outputs

## Package Validity

VALID if:
- manifest exists and readable
- all mandatory artifacts exist
- run_id consistent across all artifacts
- verification.log exists and valid
- verification outcome is PASS_FULL or PASS_PARTIAL

INVALID if:
- verification outcome = FAIL_STRUCTURAL
- manifest contradicts artifacts
- run_id mismatch exists
- mandatory artifacts missing
- verification.log missing or malformed

## Failure Modes

- STRUCTURAL_REJECTION
- MANIFEST_FAILURE
- PACKAGE_INCOMPLETE
- RUN_ID_INCONSISTENCY
- VERIFICATION_SCOPE_CONTRADICTION

All failure modes result in REJECT.
No degraded intake allowed.

## PASS_PARTIAL Operational Definition

PASS_PARTIAL is an executable state.

- Package is admissible
- Verified scope crosses boundary as authoritative
- Unverified scope travels only as uncertainty-marked
- All downstream outputs must preserve this distinction

## Determinism Guarantee

Intake is deterministic because:
- Envelope structure is fixed
- Entry authority is singular
- Verification is mandatory
- Intake branching is outcome-driven
- Invalid packages cannot degrade into acceptance

## Final Statement

This document defines the first canonical end-to-end runtime package for PSEE → PiOS, binding identity, structure, and verification into a single authoritative envelope without altering upstream authority contracts.
