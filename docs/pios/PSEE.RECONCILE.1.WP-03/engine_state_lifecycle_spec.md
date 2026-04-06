# Engine State Lifecycle Specification

**Document:** engine_state_lifecycle_spec.md
**Stream ID:** PSEE.RECONCILE.1.WP-03
**Status:** CANONICAL
**Layer:** PSEE — Engine State Lifecycle

---

## 1. Intent

This specification defines the canonical lifecycle of engine state within the PSEE runtime evaluation layer.

It governs:
- what constitutes a valid engine state at each phase
- how engine state transitions occur
- who may write engine state
- what states are admissible for handoff
- what states are invalid and must halt downstream processing

This specification does not define implementation. It defines the governed state model.

---

## 2. Core Principle

Engine state is a single authoritative record of the PSEE execution status for a given run.

It is not a log. It is not an aggregate. It is the current governing truth of execution position.

All downstream systems — including PiOS intake, gauge rendering, and projection surfaces — MUST treat engine state as the authoritative source for execution position. No downstream system may infer, reconstruct, or substitute engine state from other signals.

---

## 3. Authoritative Object

The authoritative engine state object is:

**`engine_state.json`**

Location: `docs/pios/PSEE.RUNTIME/<run_id>/engine_state.json`

This file is the sole source of truth for:
- `execution_status` — the current execution position label
- `psee_engine_invoked` — whether PSEE has been invoked for this run
- `execution_mode` — the mode under which PSEE is operating

No other file may serve as a substitute or override for these fields.

---

## 4. Conceptual State Schema

| Field | Type | Governed values |
|---|---|---|
| `execution_status` | string | See §6 — Lifecycle Phases |
| `psee_engine_invoked` | boolean | `true` or `false` |
| `execution_mode` | string | `FULL`, `PARTIAL`, `REPLAY` |
| `run_id` | string | Stable identifier for this execution run |
| `stream` | string | The PSEE stream that last wrote this state |

All fields MUST be present. Null values for `execution_status` or `psee_engine_invoked` constitute an INVALID_STATE.

---

## 5. Required Invariants

**INV-01 — Single Writer**
Only the PSEE execution engine may write to `engine_state.json`.

**INV-02 — Forward-Only Transitions**
Execution status MUST only advance forward in the defined lifecycle sequence.
Backward transitions are INVALID.

**INV-03 — Invocation Gate**
`psee_engine_invoked` MUST be `true` before any DIM evaluation may proceed.
A `false` value is a hard gate — DIM computation MUST NOT begin.

**INV-04 — Mode Consistency**
`execution_mode` MUST NOT change after PSEE invocation is confirmed.
A mode change post-invocation constitutes a MUTATION_FAILURE.

**INV-05 — Run Identity Stability**
`run_id` MUST NOT change after initial write.
A changed `run_id` constitutes a MUTATION_FAILURE.

**INV-06 — Stream Traceability**
`stream` MUST reference the PSEE execution stream that produced the current state.
An absent or unrecognized `stream` value constitutes a TRACEABILITY_FAILURE.

---

## 6. Lifecycle Phases

| Phase label | `execution_status` value | Description |
|---|---|---|
| Pre-execution | `PRE_EXECUTION` | PSEE invocation has not occurred |
| Phase 1 active | `PHASE_1_ACTIVE` | PSEE engine invoked; intake processing underway |
| Phase 2 active | `PHASE_2_ACTIVE` | Secondary evaluation in progress |
| Signal terminal 1 | `S-T1` | Terminal — execution ended with signal type 1 |
| Signal terminal 2 | `S-T2` | Terminal — execution ended with signal type 2 |
| Signal terminal 3 | `S-T3` | Terminal — partial terminal execution |
| Full completion | `S-13` | Terminal — full execution completion |

Phases `S-T1`, `S-T2`, `S-T3`, and `S-13` are terminal states.

Terminal states are immutable after entry. No further transition is permitted.

`PRE_EXECUTION` is the required initial state. `psee_engine_invoked` MUST be `false` at this phase.

---

## 7. Transition Rules

| From | Allowed transitions | Forbidden transitions |
|---|---|---|
| `PRE_EXECUTION` | `PHASE_1_ACTIVE` only | Any terminal state directly |
| `PHASE_1_ACTIVE` | `PHASE_2_ACTIVE`, `S-T1`, `S-T2`, `S-13` | `PRE_EXECUTION` |
| `PHASE_2_ACTIVE` | `S-T1`, `S-T2`, `S-T3`, `S-13` | `PRE_EXECUTION`, `PHASE_1_ACTIVE` |
| `S-T1` | None — terminal | All |
| `S-T2` | None — terminal | All |
| `S-T3` | None — terminal | All |
| `S-13` | None — terminal | All |

Any transition not listed in the allowed column is INVALID and constitutes a STATE_FAILURE.

---

## 8. Mutation Governance

`engine_state.json` MAY be written by PSEE ONLY:
- at initial run setup (writing `PRE_EXECUTION`)
- at each governed state transition

`engine_state.json` MUST NOT be written by:
- PiOS
- UI or adapter layers
- projection surfaces
- governance validators
- any system other than the PSEE execution engine

Writing `engine_state.json` from outside PSEE constitutes a BOUNDARY_CONTAMINATION.

After a terminal state is written, `engine_state.json` is sealed. No further writes are permitted by any system.

---

## 9. Read Rules

All systems MAY read `engine_state.json` as a read-only input.

Systems that read `engine_state.json` MUST:
- treat `execution_status` as the authoritative position indicator
- treat `psee_engine_invoked` as a hard gate for downstream operations
- not infer execution position from any other source

Systems MUST NOT:
- use a cached or copied version of `engine_state.json` as authority
- substitute inferred state for the file-based record
- ignore `execution_status` in favor of other signals

---

## 10. Invalid States

The following constitute INVALID engine states requiring immediate halt:

| Invalid condition | Classification |
|---|---|
| `execution_status` is null | INVALID_STATE |
| `psee_engine_invoked` is null | INVALID_STATE |
| `execution_status` not in defined phase set | INVALID_STATE |
| Backward transition detected | STATE_FAILURE |
| Terminal state overwritten | MUTATION_FAILURE |
| `run_id` changed after initial write | MUTATION_FAILURE |
| `execution_mode` changed post-invocation | MUTATION_FAILURE |
| `stream` absent or unrecognized | TRACEABILITY_FAILURE |
| File written by non-PSEE system | BOUNDARY_CONTAMINATION |

An invalid state MUST halt all downstream processing. No recovery heuristic may substitute for correction at source.

---

## 11. Locking Model

| Phase | Lock state | Write permission |
|---|---|---|
| `PRE_EXECUTION` | UNLOCKED | PSEE only |
| `PHASE_1_ACTIVE` | PARTIALLY LOCKED | PSEE only; forward transition only |
| `PHASE_2_ACTIVE` | PARTIALLY LOCKED | PSEE only; forward transition only |
| Any terminal state | SEALED | No writes permitted |

SEALED means the file is immutable. Any write attempt to a sealed `engine_state.json` is a MUTATION_FAILURE.

---

## 12. State Admissibility Matrix

This matrix defines whether a given `execution_status` value permits downstream handoff operations.

| `execution_status` | `psee_engine_invoked` | Admissible for handoff | Notes |
|---|---|---|---|
| `PRE_EXECUTION` | `false` | NO | PSEE not yet invoked |
| `PRE_EXECUTION` | `true` | NO | Contradictory state — INVALID |
| `PHASE_1_ACTIVE` | `true` | CONDITIONAL | Handoff conditional on DIM states |
| `PHASE_2_ACTIVE` | `true` | CONDITIONAL | Handoff conditional on DIM states |
| `S-T1` | `true` | YES | Terminal — completion points applicable |
| `S-T2` | `true` | YES | Terminal — completion points applicable |
| `S-T3` | `true` | YES | Terminal — completion points applicable |
| `S-13` | `true` | YES | Terminal — full completion |
| Any invalid state | any | NO | Must halt |

CONDITIONAL admissibility requires that gauge_state.json has been produced and all DIM states are resolved per PSEE-RECONCILE.1.WP-02 §4.

---

## 13. Determinism Requirement

For any given set of inputs, the engine state sequence MUST be reproducible.

Determinism is verified when dual execution runs produce identical `engine_state.json` content (sha256 match).

Non-deterministic engine state constitutes a governance failure and MUST NOT be used as handoff authority.

---

## 14. Authoritative Decision

The engine state lifecycle is the governing gate for all PSEE DIM evaluation and all downstream handoff eligibility.

No DIM evaluation may begin without `psee_engine_invoked = true`.

No handoff may proceed without a valid `execution_status` per the admissibility matrix in §12.

These decisions are non-negotiable and non-bypassable.

---

## 15. Success Criteria Verdict

Engine state is valid for authority consumption when all of the following hold:

| Criterion | Verification |
|---|---|
| `engine_state.json` present | File exists at governed path |
| `execution_status` in defined set | Field value matches §6 |
| `psee_engine_invoked` is `true` | Boolean field confirmed |
| `execution_mode` present | Non-null string |
| `run_id` stable and consistent | Matches across all run artifacts |
| `stream` references a known PSEE stream | Field value recognized |
| No invalid state conditions present | §10 checklist clear |
| Determinism verified if terminal | sha256 dual-run match on record |

---

## 16. Spec Status

This specification is the upstream authority reference for engine state consumption in:
- PSEE.RECONCILE.1.WP-04 (handoff validation gate)
- All PSEE runtime execution streams
- All PiOS intake precondition checks
