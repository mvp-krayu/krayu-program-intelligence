# Idempotency Changes
## PI.LENS.REAL-E2E-PIPELINE.IDEMPOTENCY-SWEEP.01

**Date:** 2026-05-03
**Branch:** work/psee-runtime
**Baseline commit:** e05a4f7

---

## Changes Made

### Task A — Stage 03 Idempotency (`scripts/pios/lens_e2e_assemble.sh`)

Added idempotency check before calling `structural_scanner.py`.

Checks for all three structure artifacts:
- `structure/40.2/structural_node_inventory.json`
- `structure/40.3/structural_topology_log.json`
- `structure/40.4/canonical_topology.json`

If all three present → VALIDATED_ONLY, skip WRITE mode call.
Else → run `structural_scanner.py` normally.

**Result:** Stage 03 → VALIDATED_ONLY on re-run (no CREATE_ONLY fail).

---

### Task C — Phase 8b Idempotency (`scripts/pios/run_client_pipeline.py`)

Changed Phase 8b `vault_readiness.json` CREATE_ONLY guard from FAIL to PASS:

**Before:**
```python
if readiness_path.exists():
    print(f"  FAIL: vault_readiness.json already exists (CREATE_ONLY)")
    return False
```

**After:**
```python
if readiness_path.exists():
    print(f"  [IDEMPOTENT] vault_readiness.json present — skipping WRITE")
    return True
```

**Result:** Phase 8b → VALIDATED_ONLY (skips write, returns True).

---

### Task D — Stale Blocker Text Removal (`scripts/pios/lens_e2e_assemble.sh`)

Removed stale BLOCKER-09 references from Stage 06:

- Comment block updated: removed "Current known blocker: Phase 5..." and "BLOCKER-09" text
- Echo updated: removed "(KNOWN BLOCKED_STAGE_06)" suffix
- EXEC_NOTES failure path updated: removed "BLOCKER-09: Phase 5 binding_envelope_fastapi_compatible.json absent at fastapi_conformance_path"
- Stage 06 success message updated: "unexpected success" changed to "vault and pipeline outputs written"
- Stage 06 failure classification changed from "BLOCKED_STAGE_06" to "BLOCKED_STAGE_FAILURE"

---

## Producer Scripts NOT Modified

- `scripts/pios/source_intake.py` — NOT modified
- `scripts/pios/structural_scanner.py` — NOT modified
- `scripts/pios/ceu_grounding.py` — NOT modified
- `scripts/pios/dom_layer_generator.py` — NOT modified

`run_client_pipeline.py` was modified for Phase 8b guard only, per contract authorization.

---

## Remaining Known Blocker (Out of Scope)

- Stage 04 (ceu_grounding.py): CREATE_ONLY violation on re-run — `ceu/grounding_state_v3.json` already exists. Not addressed in this contract.
