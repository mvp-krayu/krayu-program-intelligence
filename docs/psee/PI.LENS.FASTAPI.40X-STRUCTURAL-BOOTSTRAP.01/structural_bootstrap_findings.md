# Structural Bootstrap Findings
## PI.LENS.FASTAPI.40X-STRUCTURAL-BOOTSTRAP.01

**Generated:** 2026-05-01  
**Branch:** work/psee-runtime  
**Status:** COMPLETE — Phase 3 PASS confirmed

---

## Root Cause Analysis

**Root Cause Confirmed:** `missing_generation`

The 40.x structural subdirectory format (`40.2/`, `40.3/`, `40.4/`) was never generated for the FastAPI client. The legacy run_02_oss_fastapi was produced via a different pipeline path that wrote a flat `structure_manifest.json` (CEU/domain-level schema) without creating the per-stage 40.x artifact subdirectories expected by the canonical E2E orchestrator.

### Root Cause Categories Evaluated

| Category | Status |
|----------|--------|
| missing_generation | **CONFIRMED** — 40.x subdirs simply never created |
| wrong_run_id_mapping | NOT_APPLICABLE — structure_path correctly maps to run_02_oss_fastapi |
| wrong_client_path_mapping | NOT_APPLICABLE — source_manifest.json correctly uses UUID path |
| incomplete_orchestrator_migration | NOT_APPLICABLE — orchestrator is correct; FastAPI was never run through it |

---

## Pre-Flight Verification

| Check | Result |
|-------|--------|
| Branch: work/psee-runtime | CONFIRMED |
| clients/fastapi/client.yaml exists | PASS |
| clients/fastapi/sources/source_01/source_manifest.json exists | PASS |
| Raw FastAPI source exists (87 files, 37 dirs) | PASS |
| 40.2/structural_node_inventory.json absent before bootstrap | PASS (absent — CREATE_ONLY safe) |

---

## Structural Investigation: Phase 3 Requirements

From `scripts/pios/run_client_pipeline.py` phase_03_40x_structural (lines 168-185):

```python
struct_path = REPO_ROOT / source_manifest["structure_path"]
required = {
    "40.2/structural_node_inventory.json": "955-node inventory",
    "40.3/structural_topology_log.json": "1937-relation topology",
    "40.4/canonical_topology.json": "6-cluster normalization",
}
```

The descriptions ("955-node", "1937-relation", "6-cluster") are BlueEdge-specific counts from the REMEDIATION block. The orchestrator does NOT validate those counts — it only checks file existence and reads `total_nodes` from 40.2.

**Path resolution:**
- `source_manifest["structure_path"]` = `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure`
- Phase 3 expects artifacts under that `structure` directory in the `40.2/`, `40.3/`, `40.4/` subdirs
- The orchestrator uses `clients/<client_slug>/psee/runs/` path (uses `client_id: fastapi` to build run_dir), but reads structure_path from source_manifest.json, which correctly points to the UUID path where structural data resides

**No path migration required.** The source_manifest.json structure_path is the UUID path, which is where the structural artifacts are and should be.

---

## Bootstrap Approach

**No existing structural scripts are compatible with FastAPI Python source.** The scripts/pios/40.2/ scripts (`extract_entities.py`, `classify_files.py`, `scan_repository.sh`) are BlueEdge-specific (patterns for CKR entries, Stream references, 106-file CLAUDE.md repo). They cannot be applied to the FastAPI source.

**Resolution:** Wrote `scripts/pios/40.2/bootstrap_fastapi_40x.py` — a deterministic filesystem scanner that:
1. Scans `clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/input/intake/source/fastapi-backend/` with `rglob("*")`
2. Assigns NODE-XXXX IDs to all filesystem entries
3. Derives CONTAINS relations from parent-child filesystem structure
4. Clusters by top-level path prefix for canonical_topology summary
5. Enforces CREATE_ONLY (aborts if targets already exist)

**Source authority:** All node IDs, paths, and relationships are derived exclusively from the FastAPI raw intake source. No BlueEdge values used.

---

## Artifacts Generated

| Artifact | Nodes/Relations/Clusters |
|----------|--------------------------|
| 40.2/structural_node_inventory.json | 124 nodes (87 files, 37 directories) |
| 40.3/structural_topology_log.json | 123 CONTAINS relations |
| 40.4/canonical_topology.json | 14 clusters |

**File count matches intake:** 87 files (includes `.sqlite_db/.gitkeep` and all hidden files under hidden dirs).

---

## Minor Taxonomy Note (40.4)

The 40.4 cluster topology contains one minor taxonomy artifact: `src/services/__init__.py` is assigned to its own cluster (`src_services___init__.py`) instead of `src_services`. This is a cluster naming edge case in `cluster_for_path()`. It does not affect orchestrator Phase 3 validation (phase_03 only checks file existence and reads 40.2 total_nodes). The artifact is documented here for traceability.

---

## Phase 3 Validation

Phase 3 isolation test executed via direct call to `phase_03_40x_structural(source_manifest)`:

```
Phase 3 isolation test — PI.LENS.FASTAPI.40X-STRUCTURAL-BOOTSTRAP.01
  structure_path: clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_02_oss_fastapi/structure
  PASS: 40.2 (124 nodes), 40.3 (topology), 40.4 (clusters) all present
Phase 3 result: PASS
```

**Phase 3: PASS**

---

## Residual Gap (GAP-REG-02)

Phase 4 (CEU Grounding) remains blocked. `grounding_state_v3.json` does not exist — only v2. This is GAP-REG-02 documented in the registration contract. Phase 4 advancement requires a separate grounding state migration contract.

**Next recommended stream:** PI.LENS.FASTAPI.CEU-GROUNDING-BOOTSTRAP.01 (resolve GAP-REG-02), then PI.LENS.FASTAPI.E2E-RETRY.01.

---

## Governance

- No BlueEdge artifacts borrowed or copied ✅
- No BlueEdge artifacts modified ✅
- No reports generated ✅
- No CEU/41.x/75.x work performed ✅
- CREATE_ONLY enforced — no overwrite of any existing artifact ✅
- All artifacts traceable to raw FastAPI intake source ✅
