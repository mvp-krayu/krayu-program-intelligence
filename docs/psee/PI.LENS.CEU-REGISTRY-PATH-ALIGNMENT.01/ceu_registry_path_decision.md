# CEU Registry Path Decision
## PI.LENS.CEU-REGISTRY-PATH-ALIGNMENT.01

**Generated:** 2026-05-01
**Status:** DECIDED — IMPLEMENTED

---

## Decision

**Selected approach:** Patch Phase 5 to synthesize `ceu_grounding_registry` format inline
from generic pipeline outputs. No run-local `ceu_grounding_registry.json` file is created.

---

## Options Evaluated

### OPTION A — Create `ceu_grounding_registry.json` at run level (REJECTED)

Extend `ceu_grounding.py` to emit `ceu/registry/ceu_grounding_registry.json` alongside
`grounding_state_v3.json`. Update `ceu_grounding_path` in manifest to point to `ceu/`.

**Rejected because:**
- `grounding_state_v3.json` already exists; CREATE_ONLY guard on `ceu_grounding.py` would
  prevent re-run without deleting the existing file (destructive)
- Requires adding a `--emit-registry` flag to `ceu_grounding.py` or a separate emitter script
  to avoid re-running full grounding
- Creates a derived run-local artifact whose content is fully derivable from existing outputs
- Contract says "Do not duplicate CEU registry into run folders unless Phase 5 absolutely requires it"

### OPTION B — Separate `ceu_registry_emitter.py` script (REJECTED)

Create a new standalone script that reads grounding state + global registry + node inventory
and writes `ceu_grounding_registry.json`.

**Rejected because:**
- Adds a new CLI step not tracked in the orchestrator
- Creates a run-local artifact with the same concern as Option A
- More moving parts with no governance gain

### OPTION C — Patch Phase 5 to synthesize inline (SELECTED)

Add `_synthesize_ceu_registry()` helper to `run_client_pipeline.py`. Patch Phase 5 to:
1. Detect generic pipeline path via existence of `run_dir / "ceu" / "grounding_state_v3.json"`
2. If present, synthesize registry format from: `grounding_state_v3.json` + `ceu_registry.json` + `40.2/structural_node_inventory.json`
3. If absent, fall back to legacy `ceu_grounding_path / "registry" / "ceu_grounding_registry.json"`

**Selected because:**
- No new runtime artifact created
- Single canonical registry preserved at `scripts/pios/ceu_registry.json`
- No changes to CEU rules
- Analogous to Phase 4 patch pattern (dual-path resolution)
- All synthesis inputs are deterministic existing outputs
- Minimal and surgical — Phase 5 logic otherwise unchanged

---

## Canonical Registry Path

```
scripts/pios/ceu_registry.json
```

Registered in `source_manifest.json` as:
```json
"ceu_registry_path": "scripts/pios/ceu_registry.json"
```

Phase 5 reads this via: `source_manifest.get("ceu_registry_path", "scripts/pios/ceu_registry.json")`
(default covers clients that do not set the field explicitly).

---

## `ceu_grounding_path` Field — Conflict Documentation

**Pre-patch value:** `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/binding`
**Post-patch value:** unchanged — field not modified

The `ceu_grounding_path` field is not used by the patched Phase 5 when the generic
`grounding_state_v3.json` path is detected. It remains as-is for the BlueEdge legacy fallback.
No conflict arises because the two paths are guarded by the `generic_grounding.exists()` check.

---

## Synthesis Logic

```python
def _synthesize_ceu_registry(run_dir, global_registry_path):
    grounding_state + ceu_registry + node_inventory → merged format

    path_to_node = {node["path"]: node["node_id"] for node in structural_node_inventory}
    ceu_id_to_name = {ceu["ceu_id"]: ceu["name"] for ceu in global_registry["ceus"]}

    for each ceu in grounding_state["ceus"]:
        grounding_status = "GROUNDED" if ceu["grounded"] else "UNGROUNDED"
        evidence_refs = [{"node_id": path_to_node.get(p, ""), "value": p} for p in ceu["evidence_paths"]]
        emit: {ceu_id, name, grounding_status, evidence_refs}
```

---

## Validation Result

Pipeline after patch:
- Phase 5: PASS — 10 CEUs synthesized, binding_envelope.json built (29 nodes, 25 edges, 10 surfaces)
- Phase 6+7: PASS — 75.x + 41.x complete
- Phase 8a: FAIL — `integration_validation_path` KeyError (separate pre-existing gap)

Phase 5 CEU registry error: RESOLVED
