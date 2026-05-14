# Idempotency Rules
## PI.LENS.REAL-E2E-PIPELINE.EXECUTION-CLOSURE.01

**Date:** 2026-05-03
**Baseline tag:** lens-e2e-stable-v1

---

## Rule

All producer scripts use CREATE_ONLY semantics — they abort if output artifacts already exist.
The wrapper (`lens_e2e_assemble.sh`) MUST perform idempotency checks BEFORE calling any producer.

**Pattern:**
```
if artifact(s) present → VALIDATED_ONLY + skip write
else → call producer
```

No CREATE_ONLY failure may propagate to OVERALL STATUS.

---

## Stage-Level Idempotency Gates

| Stage | Gate Artifact(s) | Status on pass |
|-------|-----------------|----------------|
| 01 | intake manifest or source registration | VALIDATED_ONLY |
| 02 | source registry JSON | VALIDATED_ONLY |
| 03 | structure/40.2/structural_node_inventory.json AND structure/40.3/structural_topology_log.json AND structure/40.4/canonical_topology.json | VALIDATED_ONLY |
| 04 | ceu/grounding_state_v3.json | VALIDATED_ONLY |
| 05 | dom layer output artifacts | VALIDATED_ONLY |
| 06/Phase 8b | vault/vault_readiness.json | return True (IDEMPOTENT) |
| 07 | semantic_bundle_manifest.json in SEMANTIC_RUN | READY_LOCKED_REFERENCE |

---

## Phase 8b (run_client_pipeline.py)

```python
if readiness_path.exists():
    print(f"  [IDEMPOTENT] vault_readiness.json present — skipping WRITE")
    return True
```

Phase 8b returns `True` (success) when artifact present — no CREATE_ONLY failure.

---

## Invariant

A pipeline re-run on a fully executed `run_blueedge_e2e_execute_01` MUST:
- reach OVERALL STATUS: COMPLETE
- not modify any vault artifact
- regenerate reports into reports/ (Stage 08 always runs)
- not fail on any stage
