# Path Alignment Analysis
## PI.LENS.GROUNDING-PATH-ALIGNMENT.01

**Generated:** 2026-05-01

---

## All Grounding References Identified

### 1. `scripts/pios/run_client_pipeline.py` — CONSUMER (Phase 4)

**Before patch:**
```python
def phase_04_ceu_grounding(source_manifest: dict) -> bool:
    grounding_path = REPO_ROOT / source_manifest["grounding_state_path"]
    # checks readiness_gate field
```
Path source: `source_manifest["grounding_state_path"]`  
For FastAPI: `clients/e65d2f0a.../psee/runs/run_02_oss_fastapi/binding/provenance/grounding_state_v2.json`  
Problem: Points to wrong run + v2 file; v2 has no `readiness_gate` → gate = "" → FAIL

**After patch:**
```python
def phase_04_ceu_grounding(source_manifest: dict, run_dir: Path) -> bool:
    generic_path = run_dir / "ceu" / "grounding_state_v3.json"
    # fallback to manifest path if generic_path not present
    # accepts validation_status OR readiness_gate
```

### 2. `scripts/pios/ceu_grounding.py` — PRODUCER

Write path: `clients/<client_id>/psee/runs/<run_id>/ceu/grounding_state_v3.json`  
Output field: `validation_status: "PASS" | "PARTIAL" | "FAIL"`  
No change required.

### 3. `clients/fastapi/sources/source_01/source_manifest.json` — REGISTRATION

Field: `grounding_state_path`  
Value: `clients/e65d2f0a.../psee/runs/run_02_oss_fastapi/binding/provenance/grounding_state_v2.json`  
Status: Points to old run / v2 file. NOT updated (orchestrator no longer uses it as primary source).  
Note: Field remains valid as fallback for manual tracing purposes.

### 4. `clients/blueedge/sources/source_01/source_manifest.json` — REGISTRATION

Field: `grounding_state_path`  
Value: `clients/6a6fcdbc.../psee/runs/run_blueedge_integrated_01/grounding_state_v3.json`  
Status: No change. BlueEdge uses this as fallback (generic_path not present for BlueEdge).

### 5. Documentation references (read-only)

Files under `docs/psee/PI.LENS.CEU-GROUNDING.GENERIC.01/` reference the path in descriptions only. Not changed — they correctly document the canonical `ceu/` path.

---

## Downstream Consumers of `grounding_state_v3.json`

Beyond Phase 4, the orchestrator references `grounding_state_v3.json` in:
- `phase_08a_vault` (lines 866, 872, 875, 884): as `"source": "grounding_state_v3.json"` — metadata string only, no path resolution
- `gs_source_ref` variable (line 530): descriptive string in Phase 5 binding envelope

None of these require path changes — they use the grounding state loaded in Phase 4 (or reference it by name only). Phase 5+ failures are pre-existing issues unrelated to path alignment.

---

## Conflict Analysis

| Consumer | Path Used | After Patch |
|----------|-----------|-------------|
| Phase 4 | manifest path → v2 file (BROKEN) | run_dir/ceu/ first → FIXED |
| Phase 5+ | descriptive string only | No change needed |
| BlueEdge Phase 4 | manifest path → v3 file with readiness_gate | Falls back to manifest → STILL WORKS |

No conflicts. Single fix resolves FastAPI without breaking BlueEdge.

---

## Why No Source Manifest Update Required

The orchestrator no longer relies on `source_manifest["grounding_state_path"]` as the primary path for runs that have `ceu/grounding_state_v3.json` in their run directory. The manifest field is preserved as a fallback and for historical traceability. Updating it would be redundant and would couple the manifest to a specific run_id.
