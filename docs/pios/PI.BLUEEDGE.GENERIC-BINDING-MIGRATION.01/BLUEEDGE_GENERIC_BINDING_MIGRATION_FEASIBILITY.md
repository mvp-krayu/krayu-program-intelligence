# BlueEdge Generic Binding Migration Feasibility

> **Assessment from feature/PI.BLUEEDGE.GENERIC-BINDING-MIGRATION.01**
> **Base commit:** 5f96337 (main, 2026-05-22)

---

## Verdict: MIGRATION_REQUIRES_CEU_MATERIALIZATION

---

## 1. What the Generic Binding Path Requires

Phase 5 (`phase_05_build_binding_envelope`, line 495) requires three inputs when the pre-computed shortcut is absent:

| # | Input | Expected Location | Expected Format |
|---|-------|-------------------|-----------------|
| 1 | CEU Registry | `run_dir/ceu/grounding_state_v3.json` (generic), OR `run_dir/ceu/reconciliation_state.json` (reconciliation), OR `ceu_grounding_path/registry/ceu_grounding_registry.json` (legacy) | Generic: `ceus[]` with `ceu_id`, `grounded`, `evidence_paths`. Legacy: `ceu[]` with `ceu_id`, `name`, `grounding_status`, `evidence_refs` |
| 2 | DOM Layer | `source_manifest.dom_layer_path` (preferred), OR synthesized from CEU registry + `structural_node_inventory.json` | `dom_groups[]` with `dom_id`, `dom_label`, `included_nodes`, `path_patterns` |
| 3 | Structural Node Inventory | `run_dir/structure/40.2/structural_node_inventory.json` | `nodes[]` with `node_id`, `path` |

**Critical field:** `evidence_refs` (legacy path) or `evidence_paths` (generic path) per CEU. This field maps each CEU to specific file paths in the codebase. It is used to:
- Build `node_to_dom` mapping (CEU evidence → structural node → DOM group membership)
- Determine primary DOM for each component entity (majority-vote, line 614)
- Build GROUNDS edges (DOM → CE, line 663)
- Anchor structural enrichment from 40.3s/40.3c

Without `evidence_refs`/`evidence_paths`, the binding envelope has nodes but **zero meaningful GROUNDS edges**.

---

## 2. What BlueEdge Actually Has

### 2a. In run_blueedge_genesis_e2e_02 (current run directory)

| Artifact | Status | Path |
|----------|--------|------|
| `ceu/grounding_state_v3.json` | **DOES NOT EXIST** | `clients/blueedge/psee/runs/run_blueedge_genesis_e2e_02/ceu/` — directory absent |
| `ceu/reconciliation_state.json` | **DOES NOT EXIST** | Same — no reconciliation ran |
| `dom/dom_layer.json` | **DOES NOT EXIST** | `dom/` directory absent |
| `binding/binding_envelope.json` | EXISTS — **pre-computed schema** | Has `bindings`, `domain_telemetry`, `pressure_zone_designations`. NO `nodes`, `edges`, `capability_surfaces`. |
| `structure/40.2/structural_node_inventory.json` | **EXISTS** | 944 nodes |
| `structure/40.3s/code_graph.json` | **EXISTS** | 3,331 relationships, 2,138 IMPORTS |
| `structure/40.3c/structural_centrality.json` | **EXISTS** | 643 files ranked |

### 2b. At manifest-referenced paths (governed source truth, outside run_02)

| Artifact | Status | Path | Authority |
|----------|--------|------|-----------|
| `grounding_state_v3.json` | **EXISTS — legacy format** | `clients/6a6fcdbc.../psee/runs/run_blueedge_integrated_01/grounding_state_v3.json` | PI.CEU.PIOS.INTEGRATION.IMPLEMENTATION.01 |
| `dom_path_domain_layer.json` | **EXISTS — generic schema** | `docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json` | PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01 |
| `ceu_node_map.json` | **EXISTS — governed source truth** | `clients/6a6fcdbc.../psee/runs/run_blueedge_integrated_01/ceu_node_map.json` | PI.CEU.PIOS.INTEGRATION.IMPLEMENTATION.01 |

### 2c. Legacy path referenced by Phase 5 fallback

| Artifact | Status | Path |
|----------|--------|------|
| `ceu_grounding_registry.json` | **DOES NOT EXIST** | `clients/6a6fcdbc.../psee/ceu_grounding/registry/ceu_grounding_registry.json` — directory absent |

---

## 3. What Happens If We Simply Remove fastapi_conformance_path

Tracing `phase_05_build_binding_envelope` without `fastapi_conformance_path`:

1. Line 501: `conformance_path = None` → skips pre-computed shortcut ✓
2. Line 518-519: `dom_path` = manifest DOM layer → **EXISTS** → will load ✓
3. Line 520: `generic_grounding = run_dir/ceu/grounding_state_v3.json` → **DOES NOT EXIST**
4. Line 533: `_synthesize_ceu_registry_from_reconciliation(run_dir)` → `reconciliation_state.json` → **DOES NOT EXIST** → returns None
5. Line 538-544: Legacy fallback: `ceu_grounding_path/registry/ceu_grounding_registry.json` → **DOES NOT EXIST**
6. **Line 542: → FAIL: CEU registry not found**

**Phase 5 would abort.** The pipeline has no viable CEU registry path for BlueEdge.

Phase 6+7 (line 1403): Without `fastapi_conformance_path`, it checks `run_dir/ceu/grounding_state_v3.json` (absent) and `reconciliation_state.json` (absent), then falls through to `run_end_to_end.py` execution — outcome unknown with generic-schema binding.

---

## 4. The Evidence Gap: evidence_paths

The legacy `grounding_state_v3.json` has:

```json
{
  "ceu_grounding": [
    {
      "ceu_id": "CEU-01",
      "name": "BACKEND_SERVICE",
      "grounding_status": "SOURCE_TRUTH",
      "evidence_count": 3,
      "zone_id": "PZ-001"
    }
  ]
}
```

The generic path expects:

```json
{
  "ceus": [
    {
      "ceu_id": "CEU-01",
      "grounded": true,
      "evidence_paths": ["backend/src/main.ts", "backend/src/app.module.ts", "..."]
    }
  ]
}
```

Key differences:
- `ceu_grounding` vs `ceus` (array key)
- `grounding_status: "SOURCE_TRUTH"` vs `grounded: true` (boolean)
- `evidence_count: 3` (integer) vs `evidence_paths: [...]` (actual file paths)
- No `evidence_refs` in legacy format

The legacy format records THAT grounding exists but not WHICH FILES ground each CEU.

---

## 5. Can evidence_paths Be Derived from Governed Source Truth?

**YES — from `ceu_node_map.json`.**

`ceu_node_map.json` (PI.CEU.PIOS.INTEGRATION.IMPLEMENTATION.01, ART-05) maps 35 structural nodes to 10 CEUs with explicit file paths:

```json
{"node_id": "NODE-0022", "ceu_id": "CEU-01", "ceu_name": "BACKEND_SERVICE", "path": "backend/src/main.ts"}
{"node_id": "NODE-0021", "ceu_id": ["CEU-01", "CEU-04"], "ceu_name": ["BACKEND_SERVICE", "API_LAYER"], "path": "backend/src/app.module.ts"}
```

This artifact:
- Is the SAME evidence source the DOM layer was derived from (explicit provenance: `dom_path_domain_layer.json` → `evidence_source: "...ceu_node_map.json"`)
- Contains the CEU→path mapping for all 35 structural nodes across all 10 CEUs
- Is governed, hashed, and traceable to PI.CEU.PIOS.INTEGRATION.IMPLEMENTATION.01

**Derivation chain:** `ceu_node_map.json` → group by `ceu_id` → collect `path` values → `evidence_paths` per CEU.

This is structural derivation from governed evidence, not synthetic fabrication.

---

## 6. What Materialization Requires

### 6a. CEU Registry Materialization (REQUIRED)

A new pipeline function (`_synthesize_ceu_registry_from_legacy_grounding`) must:

1. Load `grounding_state_v3.json` from manifest path — **governed source truth**
2. Load `ceu_node_map.json` from `run_blueedge_integrated_01` — **governed source truth**
3. Group `ceu_node_map` entries by `ceu_id` → derive `evidence_paths` per CEU
4. Map `grounding_status: "SOURCE_TRUTH"` → `grounding_status: "GROUNDED"` (semantic equivalence, not invention)
5. Build `evidence_refs` from `(node_id, path)` pairs → matches generic CEU registry schema

**Every field derived from existing governed artifacts. No synthesis from thin air.**

Source truth classification:

| Field | Derived From | Classification |
|-------|-------------|----------------|
| `ceu_id` | `grounding_state_v3.json` | GOVERNED_SOURCE_TRUTH |
| `name` | `grounding_state_v3.json` → `ceu_grounding[].name` | GOVERNED_SOURCE_TRUTH |
| `grounding_status` | `grounding_status: "SOURCE_TRUTH"` → `"GROUNDED"` | GOVERNED_SEMANTIC_EQUIVALENCE |
| `evidence_refs[].node_id` | `ceu_node_map.json` → `node_map[].node_id` | GOVERNED_SOURCE_TRUTH |
| `evidence_refs[].value` | `ceu_node_map.json` → `node_map[].path` | GOVERNED_SOURCE_TRUTH |

### 6b. DOM Layer Save (REQUIRED)

When DOM layer is loaded from manifest path (line 547-548), it is used in memory but **never saved to `run_dir/dom/dom_layer.json`**. Phase 5b enrichment later looks for `run_dir/dom/dom_layer.json` (line 1251 area) and exits silently when absent.

Fix: Save DOM layer to `run_dir/dom/dom_layer.json` when loaded from manifest path. Same artifact, just persisted to run directory. No new content.

### 6c. Phase 6+7 Signal Computation (RISK — ASSESSMENT NEEDED)

Removing `fastapi_conformance_path` removes the Phase 6+7 pre-computed shortcut. The pipeline would try `run_end_to_end.py` on the generic binding envelope. Two concerns:

1. `run_end_to_end.py` has never been run on a BlueEdge generic binding envelope
2. The pre-computed signals (PSIG-001=5.663, PSIG-002=3.2098, PSIG-004=2.1822) were derived from manual FastAPI conformance contracts — the generic path may produce different values
3. Downstream consumers (LENS, SQO cockpit, BOARDROOM) may depend on specific signal values

**This is the highest-risk area of the migration.**

Options:
- **A: Run `run_end_to_end.py` on generic binding** — produces new signal values. Regression testing mandatory.
- **B: Retain `fastapi_conformance_path` for Phase 6+7 only** — Split the shortcut: Phase 5 goes generic (binding), Phase 6+7 retains pre-computed (signals). Requires pipeline modification.
- **C: Graceful skip for Phase 6+7** — Mark signal computation as NOT_YET_MIGRATED, produce binding but skip signal recomputation until validated.

---

## 7. Blocker Assessment

| # | Blocker | Severity | Resolvable From Source Truth? | Required Action |
|---|---------|----------|-------------------------------|-----------------|
| 1 | No CEU data in run_dir | HIGH | YES — `grounding_state_v3.json` + `ceu_node_map.json` exist as governed artifacts | Pipeline adapter: `_synthesize_ceu_registry_from_legacy_grounding` |
| 2 | Legacy grounding format incompatibility | HIGH | YES — field mapping is 1:1 with governed equivalence | Same adapter function |
| 3 | `evidence_paths` absent from legacy grounding | HIGH | YES — derivable from `ceu_node_map.json` (governed, same provenance chain as DOM layer) | Same adapter function |
| 4 | DOM layer not saved to run_dir | MEDIUM | YES — same artifact, just not persisted | Pipeline fix: save after manifest load |
| 5 | Phase 6+7 signal computation unknown | MEDIUM | PARTIALLY — `run_end_to_end.py` exists but never tested on BlueEdge generic binding | Assessment run needed, or scoped shortcut retention |
| 6 | `ceu_grounding_registry.json` missing (legacy fallback path) | LOW | N/A — bypassed by new adapter | No action needed |

---

## 8. What CANNOT Be Derived From Source Truth

| Gap | Status |
|-----|--------|
| evidence_paths for CEUs beyond the 35 nodes in ceu_node_map | **IRREDUCIBLE** — the ceu_node_map has 35 nodes; the 40.2 inventory has 944 nodes. The remaining 909 nodes have no governed CEU assignment. |
| Signal values from generic binding | **UNKNOWN** — `run_end_to_end.py` output on generic BlueEdge binding is untested. Pre-computed values have different provenance. |
| Multi-boundary node resolution | **GOVERNED BUT AMBIGUOUS** — NODE-0021 maps to `["CEU-01", "CEU-04"]`. The generic path expects single ceu_id per entry. Resolution policy needed (first? primary? duplicate?). |

---

## 9. Verdict Detail

### MIGRATION_REQUIRES_CEU_MATERIALIZATION

**Migration is feasible.** All required CEU materialization inputs exist as governed source truth:
- `grounding_state_v3.json` (10 CEUs, all SOURCE_TRUTH)
- `ceu_node_map.json` (35 nodes → 10 CEUs → file paths)
- `dom_path_domain_layer.json` (13 DOM groups, 35 nodes)
- `structural_node_inventory.json` (944 nodes)

**Migration is NOT blocked by missing source truth.** The evidence exists. The format gap is the obstacle.

**Migration requires:**
1. A new pipeline adapter function that reads legacy grounding + ceu_node_map to produce a generic CEU registry
2. DOM layer save-through when loaded from manifest
3. Phase 6+7 signal strategy decision (retain shortcut / recompute / graceful skip)

**Each materialized artifact is traceable to governed source truth. No synthetic fabrication.**

---

## 10. Recommended Execution Strategy

### Phase 1: CEU Materialization Adapter (G2)
Add `_synthesize_ceu_registry_from_legacy_grounding(source_manifest)` to `run_client_pipeline.py`. Reads `grounding_state_v3.json` + `ceu_node_map.json` from manifest-referenced paths. Produces generic CEU registry format. Inserted as third fallback in Phase 5 CEU resolution chain (after generic grounding, after reconciliation, before legacy registry path).

### Phase 2: DOM Layer Persistence (G2)
After loading DOM layer from manifest path (line 547-548), save to `run_dir/dom/dom_layer.json`. This enables Phase 5b enrichment to find it.

### Phase 3: Remove fastapi_conformance_path from Phase 5 (G2)
NULL the field in source_manifest.json, OR remove the Phase 5 shortcut check.

### Phase 4: Phase 6+7 Signal Strategy (DECISION REQUIRED)
Options A/B/C per §6c. Recommendation: **Option B (retain shortcut for signals only)** — isolates binding migration risk from signal regression risk. The pre-computed signals are valid FastAPI conformance artifacts and their authority is independent of the binding envelope schema.

### Phase 5: Verification Run
Re-run pipeline on BlueEdge. Verify:
- Phase 5 produces generic-schema binding envelope
- Phase 5 enrichment fires (cross-DOM edges, centrality annotations)
- Phase 5b enrichment fires (dom_layer.json now available)
- Phase 6+7 behavior is correct per chosen strategy
- LENS can consume generic-schema binding

---

## 11. Evidence Provenance Chain

```
PI.CEU.PIOS.INTEGRATION.IMPLEMENTATION.01
    ├── grounding_state_v3.json (ART-02) — 10 CEUs, grounding classification
    └── ceu_node_map.json (ART-05) — 35 nodes → CEU mapping with paths
         │
         ├── [EXISTING] dom_path_domain_layer.json — derived from ceu_node_map
         │   (PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01)
         │
         └── [NEW] CEU registry adapter — derives evidence_paths from ceu_node_map
             Same provenance chain as DOM layer derivation
             No new evidence source. No synthetic construction.
```
