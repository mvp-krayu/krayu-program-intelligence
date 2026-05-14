# Recovery Decision
## PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01.RECOVERY

**Date:** 2026-05-03
**Decision:** DIRECT_RESTORE — stash@{0}^3

---

## Decision Basis

The target artifact was found verbatim in `stash@{0}^3` (untracked files component
of the stash "WIP on work/psee-runtime: 40a5db1 lens: lock e2e pipeline reality and
conformance evidence").

The stash was created on `work/psee-runtime` and contains the complete
`PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` stream output, including
the `recomputed/` directory with `dom_path_domain_layer.json`.

The artifact's `contract_id` and `artifact` fields self-identify it as the required
file. The content is the BlueEdge 35-node/13-domain FastAPI conformance topology — not
a synthesized or derived artifact.

---

## Recovery Scope

This contract restores ONLY the one named target artifact:
`dom_path_domain_layer.json`

The stash also contains other conformance artifacts that were not yet restored by prior
BLOCKER-09/10 contracts:
- `signal_registry_fastapi_compatible.json` (required by Phase 8a step 5)
- `condition_correlation_state_fastapi_compatible.json`
- `pressure_zone_state_fastapi_compatible.json`
- `vault_input_manifest_fastapi_compatible.json`
- `report_input_manifest_fastapi_compatible.json`
- Several RECOMPUTE-FROM-EVIDENCE.01 stream evidence files

These artifacts are present in the stash and available for recovery. Each requires
an authorized contract or a sweep recovery contract.

---

## Next Blocker

Phase 8a fails after loading `dom_path_domain_layer.json` on:
```
FAIL: signal_registry_fastapi_compatible.json not found at
docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/signal_registry_fastapi_compatible.json
```

This artifact is confirmed present in `stash@{0}^3`. A recovery contract or a
full conformance stash sweep would resolve it.

---

## Operator Note

Given that the stash contains ALL missing conformance artifacts for both
`PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01` and
`PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01`,
a single sweep contract to restore the full stash content to the correct paths
would be more efficient than issuing individual blocker contracts per artifact.
