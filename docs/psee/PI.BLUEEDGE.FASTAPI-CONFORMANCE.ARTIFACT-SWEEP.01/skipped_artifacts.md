# Skipped Artifacts
## PI.BLUEEDGE.FASTAPI-CONFORMANCE.ARTIFACT-SWEEP.01

**Date:** 2026-05-03
**Source:** stash@{0}^3

---

## Definition

SKIPPED = artifact present in stash@{0}^3 AND already present at destination path with matching SHA256.
No write performed. No content modified.

---

## Skipped (3) — ALREADY_PRESENT

| File | SHA256 (first 16) | Prior Source |
|------|-------------------|--------------|
| PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json | f5e2a0dfeedeab8f | Restored by PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01.RECOVERY |
| PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/binding_envelope_fastapi_compatible.json | fa508036d5b048b5 | Restored by PI.LENS.REAL-E2E-PIPELINE.BLOCKER-09-CLOSURE.01 |
| PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/signal_projection_fastapi_compatible.json | a467ba0b6541e3a5 | Restored by PI.LENS.REAL-E2E-PIPELINE.BLOCKER-10-CLOSURE.01 |

All 3 SHA256 values verified: stash extract = destination. No overwrite performed.

---

## Out-of-Scope Streams (NOT skipped — excluded by filter)

| Stream | File Count | Reason |
|--------|-----------|--------|
| PI.BLUEEDGE.FASTAPI-CONFORMANCE.NODE-RELATIONSHIP-RECOVERY.01 | 8 | Outside sweep scope per contract |
| PI.BLUEEDGE.FASTAPI-CONFORMANCE.SEMANTIC-PARITY-VALIDATION.01 | 7 | Outside sweep scope per contract |
