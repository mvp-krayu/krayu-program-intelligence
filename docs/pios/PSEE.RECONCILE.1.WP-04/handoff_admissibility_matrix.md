# Handoff Admissibility Matrix

**Document:** handoff_admissibility_matrix.md
**Stream ID:** PSEE.RECONCILE.1.WP-04
**Status:** CANONICAL
**Layer:** PSEE → PiOS Boundary Enforcement

---

## 1. Purpose

This matrix maps every possible gate outcome to its admissibility state, PiOS consumption permission, and governance consequence.

The matrix is exhaustive. Every evaluable condition maps to exactly one outcome row.

---

## 2. Primary Outcome Map

| Gate outcome | Eligibility | Admissibility | PiOS consumption permission | Governance consequence |
|---|---|---|---|---|
| PASS | ELIGIBLE | ADMISSIBLE | PERMITTED | None — intake may proceed |
| FAIL | EVALUATED | NON-ADMISSIBLE | FORBIDDEN | Package returned to PSEE; violation logged |
| REJECT | NOT EVALUABLE | NON-ADMISSIBLE | FORBIDDEN | Package discarded; full PSEE reprocessing required |

---

## 3. Condition-to-Outcome Matrix

Each row maps a specific gate evaluation condition to its outcome, admissibility state, and required action.

| Condition | Gate outcome | Admissible | PiOS permitted | Required action |
|---|---|---|---|---|
| All 8 dimensions PASS | PASS | YES | YES | Proceed to intake |
| Any dimension fails (package evaluable) | FAIL | NO | NO | Return to PSEE for correction |
| Missing mandatory artifact (§5) | REJECT | NO | NO | Full PSEE reprocessing |
| `psee_engine_invoked = false` | REJECT | NO | NO | Full PSEE reprocessing |
| `execution_status` null | REJECT | NO | NO | Full PSEE reprocessing |
| `schema_version` null or absent | REJECT | NO | NO | Full PSEE reprocessing |
| Inconsistent `run_id` across artifacts | REJECT | NO | NO | Full PSEE reprocessing |
| `gauge_state.json.stream` not a PSEE stream | REJECT | NO | NO | Full PSEE reprocessing |
| Projection contamination detected | REJECT | NO | NO | Full PSEE reprocessing |
| Contract version not recognized | REJECT | NO | NO | Full PSEE reprocessing |
| AUTHORITY_FAILURE in any dimension | FAIL | NO | NO | Return to PSEE for correction |
| STRUCTURE_FAILURE in any dimension | FAIL | NO | NO | Return to PSEE for correction |
| STATE_FAILURE in any dimension | FAIL | NO | NO | Return to PSEE for correction |
| MUTATION_FAILURE in any dimension | FAIL | NO | NO | Return to PSEE for correction; audit required |
| TRACEABILITY_FAILURE in any dimension | FAIL | NO | NO | Return to PSEE for correction |
| CONTRACT_VERSION_FAILURE | FAIL | NO | NO | Return to PSEE; version alignment required |
| BOUNDARY_CONTAMINATION | FAIL | NO | NO | Return to PSEE; contamination source investigation required |
| CONFIDENCE_INVALIDITY | FAIL | NO | NO | Return to PSEE for correction |

---

## 4. PASS State Requirements

A PASS outcome requires ALL of the following to be simultaneously true:

| Requirement | Source |
|---|---|
| All 8 validation dimensions evaluated and passed | Gate §7 |
| No hard-stop condition triggered | Gate §9 |
| All mandatory fields present and non-null | Gate §6 |
| `run_id` consistent across package | Gate §5 |
| `psee_engine_invoked = true` | WP-03 §5 INV-03 |
| `execution_status` in defined phase set | WP-03 §6 |
| `confidence.status = COMPUTED` | Gate §7 Dim-5 |
| `verification.log` PASS with 0 failures | Gate §6 |
| No mutation detected | Gate §7 Dim-4 |
| No boundary contamination | Gate §7 Dim-6 |
| Schema version recognized | Gate §7 Dim-7 |
| All traceability fields present | Gate §7 Dim-8 |

A single failing requirement converts PASS to FAIL or REJECT per §3.

---

## 5. FAIL vs REJECT Distinction

FAIL and REJECT are not equivalent. They must not be treated as equivalent.

| Property | FAIL | REJECT |
|---|---|---|
| Package was evaluated against dimensions | YES | NO |
| Package met minimum contract prerequisites | YES | NO |
| Package is a recognizable contract object | YES | NO |
| Correct action | Return to PSEE for targeted correction | Full PSEE reprocessing |
| PiOS may re-attempt after PSEE correction | YES, upon new PASS evaluation | Only after complete reprocessing |
| Violation log required | YES | YES |

A FAIL package has a correctable problem within a valid package structure.
A REJECT package is not a valid contract object.

---

## 6. Post-PASS Invalidation

A PASS determination becomes invalid if any of the following occur after the gate evaluation:

| Event | Effect |
|---|---|
| Any artifact modified after PASS | PASS invalidated; gate must re-run |
| `run_id` reassigned | PASS invalidated; full reprocessing required |
| New PSEE stream writes to sealed artifact | PASS invalidated; gate must re-run |
| PiOS modifies any package artifact | BOUNDARY_CONTAMINATION; PASS permanently invalidated |

A PASS outcome is valid only for the exact artifact state evaluated at gate execution time.

---

## 7. Non-Admissibility Permanence

A FAIL or REJECT outcome for a given package state is permanent for that state.

The same package in the same state MUST NOT be re-evaluated in expectation of a different outcome. The gate is deterministic.

Correction requires a new PSEE execution producing a new sealed artifact package with a new evaluation.
