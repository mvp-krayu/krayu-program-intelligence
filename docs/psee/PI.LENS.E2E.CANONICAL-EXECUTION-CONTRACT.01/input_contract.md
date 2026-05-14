# Input Contract
## PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01 — BLOCK_C

**Generated:** 2026-05-01  
**Mode:** DOCUMENTATION_ONLY / CONTRACT_LOCK  
**Anchor run:** run_be_orchestrated_fixup_01

---

## 1. Orchestrator Invocation

```
python3 scripts/pios/run_client_pipeline.py \
  --client <client_id> \
  --source <source_id> \
  --run-id <run_id>
```

All paths are resolved at runtime from `client.yaml` and `source_manifest.json`. No hardcoded client paths exist in the orchestrator.

---

## 2. client.yaml — Required Fields

**Location:** `clients/<client_id>/client.yaml`  
**Parser:** `parse_yaml_simple()` — minimal key:value YAML (no external YAML library)

| Field | Type | Description |
|-------|------|-------------|
| `client_id` | string | Canonical client identifier (matches directory name) |
| `uuid` | string | Client UUID (used in vault artifact headers) |
| `display_name` | string | Human-readable client name |
| `source_type` | string | Source data type (e.g., `STRUCTURAL_IMPORT`) |
| `pipeline_mode` | string | Pipeline execution mode |
| `ceu_model` | string | CEU model identifier |
| `ceu_count` | int | Number of CEU nodes |
| `dom_group_count` | int | Number of DOM groups |
| `structural_node_count` | int | Total structural node count |
| `default_source` | string | Default source_id for this client |

**Fail condition:** `client.yaml` not found → `sys.exit(1)` before any phase executes.

---

## 3. source_manifest.json — Required Fields

**Location:** `clients/<client_id>/sources/<source_id>/source_manifest.json`  
**Format:** JSON

### 3.1 Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `source_id` | string | Source identifier |
| `client_id` | string | Must match CLI --client argument |
| `archive_path` | string | **Absolute path** to source archive file |
| `sha256` | string | Expected SHA256 hash of archive |
| `extracted_path` | string | Path to canonical_repo extraction (relative to REPO_ROOT) |
| `structure_path` | string | Path to 40.x structural artifacts (relative to REPO_ROOT) |
| `ceu_grounding_path` | string | Path to CEU grounding artifacts |
| `dom_layer_path` | string | Path to DOM layer artifacts |
| `grounding_state_path` | string | Path to grounding_state_v3.json parent directory |
| `integration_validation_path` | string | Path to integration validation artifacts |

### 3.2 Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `fastapi_conformance_path` | string | Relative path to pre-computed canonical conformance artifacts. When present, routes Phases 5, 6+7, and 8a to use conformance artifacts instead of synthetic computation. |
| `fastapi_conformance_note` | string | Human-readable note documenting the conformance artifacts source and authority. |

**Fail condition:** `source_manifest.json` not found → `sys.exit(1)`.

---

## 4. fastapi_conformance_path — Conformance Artifact Requirements

When `fastapi_conformance_path` is set, the following artifacts must be present in `REPO_ROOT/<fastapi_conformance_path>/`:

| Artifact | Required By | Fail Condition |
|----------|-------------|----------------|
| `binding_envelope_fastapi_compatible.json` | Phase 5 | Missing → pipeline halt |
| `signal_projection_fastapi_compatible.json` | Phase 6+7 | Missing → pipeline halt |
| `pressure_zone_state_fastapi_compatible.json` | Phase 6+7 | Optional (copied if present) |
| `condition_correlation_state_fastapi_compatible.json` | Phase 6+7 | Optional (copied if present) |
| `signal_registry_fastapi_compatible.json` | Phase 8a | Missing → pipeline halt |

**BlueEdge authority:** `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed/`

---

## 5. Path Resolution Rules

1. `archive_path` in source_manifest: treated as **absolute path**
2. All other paths: treated as **relative to REPO_ROOT** (resolved via `REPO_ROOT / path`)
3. `REPO_ROOT`: the root of the k-pi-core repository (resolved at orchestrator startup via `Path(__file__).parent.parent.parent`)
4. `run_dir`: `REPO_ROOT / "clients" / client_id / "psee" / "runs" / run_id`

---

## 6. 40.x Structural Artifact Requirements

Phase 3 verifies the following artifacts under `source_manifest['structure_path']`:

- `40.2/structural_node_inventory.json`
- `40.3/structural_topology_log.json`
- `40.4/canonical_topology.json`

All three must be present. Any missing → pipeline halt.

---

## 7. CEU Grounding Readiness Gate

Phase 4 reads `source_manifest['grounding_state_path']/grounding_state_v3.json` and checks `readiness_gate`.

Accepted formats:
- `"readiness_gate": "PASS"` (string)
- `"readiness_gate": {"status": "PASS", ...}` (dict)

Both forms produce PASS. Any other value → pipeline halt.
