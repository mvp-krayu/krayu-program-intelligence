# Drift Risk Assessment
## PI.LENS.PIPELINE-CONFORMANCE.FASTAPI.01

**Generated:** 2026-05-01  
**Drift Risk: CRITICAL**

---

## Drift Risk Classification

**CRITICAL**

Continuing the current pattern of ad hoc phase-by-phase bootstrap scripts creates compounding tooling debt with each client and each new blocking phase. The risks are systemic, not isolated.

---

## Risk 1: Phase-Local Tooling Debt (CRITICAL)

**Pattern observed:**
- Phase 3 failed → `bootstrap_fastapi_40x.py` created
- Phase 4 will fail → a new grounding state script will be required
- Phase 5 will fail (dom_layer_path missing) → a new DOM layer script required
- Phase 8a will fail (integration_validation_path missing) → a new script required

**Projection (FastAPI only):**
- 4 validation-only phases × 1 external bootstrap script each = 4 external bootstrap scripts minimum
- Plus 2 missing source_manifest fields requiring resolution
- Each script exists outside the orchestrator's governance boundary

**Projection (multi-client):**
- N clients × 4 phases × 1 script each = 4N external scripts
- No shared lifecycle contract governs these scripts
- Each client has a different pre-existing artifact schema, requiring client-specific scripts

**Risk:** The artifact generation surface area grows O(clients × phases) outside the orchestrator, making it impossible to guarantee reproducibility from a clean client registration alone.

---

## Risk 2: Masking Orchestrator Incompleteness (HIGH)

Each successful bootstrap hides a structural gap in the orchestrator. After `bootstrap_fastapi_40x.py` runs, Phase 3 passes — the orchestrator appears healthy. But the underlying incompleteness (the orchestrator cannot generate 40.x artifacts) is now invisible unless the bootstrap provenance is carefully tracked.

**Risk:** Operators may conclude the pipeline is complete when in fact it relies on an undocumented set of external preconditions. This compounds with each new client onboarding.

---

## Risk 3: Variance Introduction (HIGH)

Each external bootstrap script is a separate code artifact with its own:
- Implementation choices (e.g., directory scan depth, node ID assignment)
- Error handling posture
- Schema compatibility assumptions
- No integration test coverage with the orchestrator

**Risk:** Bootstrapped artifacts may be structurally valid (pass orchestrator validation) but semantically inconsistent with what the orchestrator would have produced if it generated them natively. This creates silent divergence between client runs.

Observed example: `bootstrap_fastapi_40x.py` generates 124 nodes (87 files + 37 directories). The orchestrator's Phase 3 message references "955-node inventory" (BlueEdge-specific). There is no orchestrator-level validation that 124 is the correct count for FastAPI — the orchestrator accepts any non-empty inventory. Semantic validation is the bootstrap script's responsibility, not the orchestrator's.

---

## Risk 4: Compromised Repeatable Client Onboarding (CRITICAL)

The canonical E2E contract promises: "The pipeline is client-agnostic — all paths resolved through client.yaml + source_manifest.json."

This promise is only fulfilled for the final generation phases (5-9). For phases 1-4, the client must independently provision:
- An intake contract output
- A structural pipeline output
- A CEU grounding pipeline output

None of these are governed by `run_client_pipeline.py`. A new operator onboarding Client C would:
1. Register client.yaml + source_manifest.json ✓
2. Run `run_client_pipeline.py` → fail Phase 1 (if archive doesn't exist)
3. Execute external intake contract
4. Re-run → fail Phase 3 (if 40.x not generated)
5. Execute external structural bootstrap
6. Re-run → fail Phase 4 (if grounding state absent)
7. Execute external grounding bootstrap
8. Re-run → fail Phase 5 (if dom_layer_path/ceu_registry absent)
9. Execute external DOM/CEU bootstrap
10. Re-run → potentially pass through Phase 9

**This is not repeatable client onboarding. It is a guided manual process.**

---

## Risk 5: Registration Contract Incompleteness (MEDIUM)

`PI.LENS.FASTAPI.CLIENT-SOURCE-REGISTRATION.01` produced a source_manifest.json that is missing `dom_layer_path` and `integration_validation_path`. These fields are required by the orchestrator unless `fastapi_conformance_path` is set. The registration contract was not aware of these requirements.

**Risk:** Future registrations will repeat this omission unless the registration contract is updated to validate against the full source_manifest schema.

---

## Continued Bootstrapping: Risk vs. Benefit

| Factor | Value |
|--------|-------|
| Short-term benefit of continuing phase-by-phase bootstrap | FastAPI reaches Phase 9 sooner |
| Long-term cost | 4+ external scripts, no integration guarantee, non-reproducible from registration |
| Mask risk | High — each resolved phase hides structural orchestrator gap |
| Reversibility | Partial — bootstrap scripts can be removed, but artifact provenance drift is permanent unless re-generated |

**Recommendation:** Stop phase-by-phase bootstrapping. Classify the pipeline, resolve the architectural model, then implement a single remediation that addresses all phases coherently.

---

## Drift Risk Summary

| Risk | Severity |
|------|----------|
| Phase-local tooling debt (O(clients × phases) external scripts) | CRITICAL |
| Masking orchestrator incompleteness | HIGH |
| Variance from schema inconsistency across bootstrap scripts | HIGH |
| Non-repeatable client onboarding | CRITICAL |
| Registration contract incompleteness | MEDIUM |

**Overall: CRITICAL**
