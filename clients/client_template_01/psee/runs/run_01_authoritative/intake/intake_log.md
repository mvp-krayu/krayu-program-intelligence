# Intake Log — client_template_01 / run_01_authoritative

**Timestamp:** 2026-04-06T14:04:55Z
**Client:** client_template_01
**Run ID:** run_01_authoritative

## Steps Executed

--- Step 1: Load package_manifest.json ---
  PASS  manifest loaded; run_id=run_01_authoritative

--- Step 2: Validate run_id consistency ---
  PASS  package_manifest.json: run_id=run_01_authoritative
  PASS  engine_state.json: run_id=run_01_authoritative
  PASS  gauge_state.json: run_id=run_01_authoritative
  PASS  gauge_view.json: run_id=run_01_authoritative
  PASS  coverage_state.json: run_id=run_01_authoritative
  PASS  reconstruction_state.json: run_id=run_01_authoritative

--- Step 3: Validate mandatory artifact presence ---
  PASS  present: package_manifest.json
  PASS  present: verification.log
  PASS  present: engine_state.json
  PASS  present: gauge_state.json
  PASS  present: gauge_view.json
  PASS  present: coverage_state.json
  PASS  present: reconstruction_state.json

--- Step 4: Load verification.log ---
  PASS  verification.log loaded; outcome=PASS_PARTIAL

--- Step 5: Evaluate verification outcome ---
  RESULT  verification_outcome=PASS_PARTIAL
  RESULT  intake_mode=BOUNDED_INTAKE

--- Step 6: Determine consumed scope ---
  PASS_PARTIAL → verified scope authoritative
  unverified: ['coverage_class=PARTIAL — coverage scope is bounded', 'reconstruction_status=PARTIAL — bounded reconstruction validity', 'coverage_percent=73.3% — not full coverage', 'unknown_space_count=2 — unresolved unknown-space records', 'escalation_clearance=85 — escalation not fully resolved']

--- Step 7: Write intake_result.json ---
  WRITTEN  intake_result.json

--- Step 8: Write intake_log.md ---

## Intake Result

| Field | Value |
|---|---|
| verification_outcome | PASS_PARTIAL |
| intake_mode | BOUNDED_INTAKE |
| consumed_scope | verified_scope_only |
| uncertainty_propagation | required — unverified scope must be uncertainty-marked in downstream outputs |
| rejected | False |

## Errors

None
