# Path Reference Analysis
## PI.LENS.CEU-REGISTRY-PATH-ALIGNMENT.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## All CEU Registry References Found

### scripts/pios/run_client_pipeline.py — Phase 5

| Reference | Location | Value |
|-----------|----------|-------|
| `source_manifest["ceu_grounding_path"] / "registry" / "ceu_grounding_registry.json"` | line 254 (pre-patch) | Legacy BlueEdge registry resolution path |
| `run_dir / "ceu" / "grounding_state_v3.json"` | line 262 (post-patch) | Generic pipeline grounding state (existence test) |
| `source_manifest.get("ceu_registry_path", "scripts/pios/ceu_registry.json")` | line 264 (post-patch) | Global canonical CEU registry, with default |

### scripts/pios/ceu_registry.json

Global canonical CEU registry. Contains 10 CEU definitions with `ceu_id`, `name`, `description`, `default_activation_class`, `detection_rules`. No grounding results. No client-specific data.

**Format:**
```json
{
  "registry_id": "GENERIC-CEU-REGISTRY-V1",
  "ceus": [
    { "ceu_id": "CEU-01", "name": "APPLICATION_CORE", "detection_rules": [...] }
  ]
}
```

### scripts/pios/ceu_grounding.py

Reads `scripts/pios/ceu_registry.json` at runtime to evaluate detection rules. Emits `ceu/grounding_state_v3.json`. Does NOT emit `ceu_grounding_registry.json`. No reference to `ceu_grounding_path`.

### clients/fastapi/sources/source_01/source_manifest.json

| Field | Value |
|-------|-------|
| `ceu_grounding_path` | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/binding` (BlueEdge legacy path) |
| `grounding_state_path` | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/binding/provenance/grounding_state_v2.json` |
| `ceu_registry` | `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/lineage/ceu_registry.json` |
| `ceu_registry_path` | **ABSENT pre-patch** |

### docs/psee/PI.LENS.CEU-GROUNDING.GENERIC.01/

Documents `grounding_state_v3.json` format. No `ceu_grounding_registry.json` reference.

### docs/psee/PI.LENS.DOM-LAYER.GENERATOR.01/dom_layer_findings.md

Records Phase 5 gap: "Phase 5 also reads `source_manifest["ceu_grounding_path"] / "registry" / "ceu_grounding_registry.json"`. This registry directory does not exist for FastAPI."

---

## Root Cause

Phase 5 resolves:
```
REPO_ROOT / source_manifest["ceu_grounding_path"] / "registry" / "ceu_grounding_registry.json"
= clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/binding/registry/ceu_grounding_registry.json
```

This path does not exist. The BlueEdge client never had a `binding/registry/` subdirectory.

The generic pipeline produces `ceu/grounding_state_v3.json` — a different format and path. Phase 5's
format expectation (`ceu_grounding_registry.json`) requires merged CEU definitions + grounding results
with `node_id`-annotated `evidence_refs`.

No `ceu_grounding_registry.json` exists anywhere in the repository.

---

## Schema Mismatch

Phase 5 expected `ceu_grounding_registry.json` format:
```json
{
  "ceu": [
    {
      "ceu_id": "CEU-01",
      "name": "APPLICATION_CORE",
      "grounding_status": "GROUNDED",
      "evidence_refs": [{"node_id": "NODE-0001", "value": "src/app/main.py"}]
    }
  ]
}
```

Generic `grounding_state_v3.json` actual format:
```json
{
  "ceus": [
    {
      "ceu_id": "CEU-01",
      "grounded": true,
      "evidence_paths": ["src/app/main.py"],
      "node_count": 64
    }
  ]
}
```

Differences:
- Field name: `ceu` vs `ceus`
- Name absent in grounding state (must be sourced from `ceu_registry.json`)
- `grounding_status` string absent (derived from `grounded` boolean)
- `evidence_refs` with `node_id` absent (paths present but not NODE-NNNN IDs)

NODE-NNNN IDs sourced from `40.2/structural_node_inventory.json`.

---

## Resolution Selected

Patch Phase 5 to synthesize the registry format inline — no new file created, single canonical
registry preserved at `scripts/pios/ceu_registry.json`. See `ceu_registry_path_decision.md`.
