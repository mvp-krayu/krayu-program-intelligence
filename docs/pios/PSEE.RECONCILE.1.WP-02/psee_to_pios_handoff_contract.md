# PSEE to PiOS Handoff Contract

**Document:** psee_to_pios_handoff_contract.md
**Stream ID:** PSEE.RECONCILE.1.WP-02
**Status:** CANONICAL
**Layer:** PSEE → PiOS Boundary

---

## 1. Purpose

This contract defines the canonical boundary between PSEE runtime evaluation authority and PiOS intake authority.

It governs:
- what PSEE must deliver to constitute a valid handoff
- what conditions PiOS must verify before consuming any handoff payload
- what PiOS may and may not do with handoff inputs
- the enforcement model that separates producer authority from consumer authority

This contract does not define implementation. It defines the governed boundary.

---

## 2. Handoff Definition

A PSEE to PiOS handoff is the transfer of a sealed, governed PSEE runtime output package to PiOS for intake processing.

The handoff is valid ONLY when:

1. PSEE runtime execution has completed to a governed terminal state
2. gauge_state.json has been produced and sealed by PSEE
3. All DIM states are resolved or explicitly governed-blocked
4. Determinism has been verified across dual runs
5. No forbidden mutations occurred during PSEE execution
6. The handoff package matches the structure defined in §3

A handoff is NOT valid if any of the above conditions are unmet, regardless of partial completeness.

---

## 3. Payload Structure

The PSEE handoff payload MUST consist of the following sealed artifacts:

| Artifact | Required state | Authority stream |
|---|---|---|
| gauge_state.json | schema_version present; score, projection, confidence populated | PSEE-RUNTIME.5 |
| coverage_state.json | state = COMPUTED | PSEE-RUNTIME.5A |
| reconstruction_state.json | state IN {PASS, PARTIAL, FAIL} | PSEE-RUNTIME.6A |
| gauge_inputs.json | DIM-01..06 states populated | PSEE production streams |
| gauge_view.json | stream = PSEE-RUNTIME.5 or later | PSEE renderer |
| verification.log | PASS N/0 confirmed | verify_psee_runtime.sh |

All artifacts MUST originate from the same run_id.

Artifacts from different run_ids MUST NOT be mixed into a single handoff payload.

---

## 4. Admissibility Model

A handoff payload is either ADMISSIBLE or NON-ADMISSIBLE. No intermediate state exists.

**ADMISSIBLE** when ALL of the following hold:

- All required payload artifacts are present (§3)
- gauge_state.json.score.canonical is a non-null integer
- gauge_state.json.confidence.status = COMPUTED
- gauge_state.json.state.psee_engine_invoked = true
- coverage_state.json.state = COMPUTED
- reconstruction_state.json.state IN {PASS, PARTIAL, FAIL}
- verification.log records PASS with zero failures
- All artifact run_ids match
- Dual-run determinism verified (sha256 match on record)

**NON-ADMISSIBLE** when ANY of the following hold:

- Any required artifact is absent
- Any required field is null where a non-null value is required
- Any artifact originates from a different run_id than the others
- verification.log records any failure
- gauge_state.json was not produced by PSEE (stream field absent or unrecognized)
- Mutation occurred on any sealed artifact after PSEE production
- Determinism was not verified

NON-ADMISSIBLE handoffs MUST NOT be consumed by PiOS under any condition.

---

## 5. Transition Boundary Rules

**Rule T-01 — Sealed Package Rule**
The handoff package is sealed at the point PSEE completes its execution stream.
No artifact in the package may be altered after sealing.

**Rule T-02 — Consumer Non-Authority Rule**
PiOS is a consumer of the handoff package. PiOS has no authority to:
- judge the validity of its own intake boundary
- override any PSEE-produced value
- repair, patch, or substitute any payload artifact

**Rule T-03 — Pre-Consumption Verification Rule**
PiOS MUST verify admissibility (§4) before consuming any artifact from the handoff package.
Consumption without prior admissibility verification constitutes a boundary violation.

**Rule T-04 — Reject-on-Invalid Rule**
If admissibility verification fails, PiOS MUST reject the handoff package in full.
Partial consumption of a non-admissible package is forbidden.

**Rule T-05 — No Repair Rule**
PiOS MUST NOT attempt to repair, reconstruct, or supplement a non-admissible handoff.
A failed handoff must be returned to PSEE for reprocessing.

**Rule T-06 — Authority Provenance Rule**
All values consumed by PiOS MUST be traceable to a specific PSEE stream.
Values without traceable PSEE origin MUST NOT be treated as governed inputs.

---

## 6. Allowed PiOS Computations

PiOS MAY perform the following operations on an ADMISSIBLE handoff package:

- Read all artifact fields for intake processing
- Reference canonical_score, projected_score, confidence_band as read-only inputs
- Use DIM states as read-only context for downstream evaluation
- Perform PiOS-native execution against the intake defined in the package
- Produce PiOS-native output artifacts that reference but do not mutate PSEE outputs

---

## 7. Forbidden PiOS Computations

PiOS MUST NOT perform the following:

| Forbidden action | Rule |
|---|---|
| Recompute canonical_score | A-01 (WP-01) |
| Modify gauge_state.json | T-01 |
| Override any DIM state | A-04 (WP-01) |
| Alter projected_score | A-02 (WP-01) |
| Expand or compress confidence_band | A-03 (WP-01) |
| Self-judge admissibility without running defined gate | T-03 |
| Consume non-admissible payload under any condition | T-04 |
| Perform partial consumption of rejected package | T-04 |
| Invent or substitute absent artifacts | T-05 |

---

## 8. Mount Preconditions

PiOS intake MUST NOT begin unless ALL of the following preconditions are met:

1. Admissibility gate has been run and returned ADMISSIBLE
2. All required artifacts are present and checksum-verified
3. run_id is consistent across all payload artifacts
4. gauge_state.json.state.execution_status is not PRE_EXECUTION
5. gauge_state.json.state.psee_engine_invoked = true
6. verification.log is present and records PASS N/0

Failure of any precondition MUST halt PiOS intake. There is no grace condition.

---

## 9. Terminal Rule

The PSEE to PiOS handoff boundary is non-negotiable.

No instruction, override, flag, configuration, or runtime condition may bypass this boundary.

If the handoff package does not satisfy admissibility, PiOS intake does not proceed.

This rule applies without exception.
