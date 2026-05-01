# Source Intake Findings
## PI.LENS.SOURCE-INTAKE.GENERIC.01

**Generated:** 2026-05-01  
**Branch:** work/psee-runtime  
**Status:** COMPLETE

---

## Pre-Flight

| Check | Result |
|-------|--------|
| Branch: work/psee-runtime | CONFIRMED |
| Working tree clean at start | CONFIRMED |
| FastAPI client.yaml exists | PASS |
| FastAPI source_manifest.json exists | PASS |
| Raw source root exists (87 files) | PASS |
| Archive proxy file exists | PASS |
| Intake output directory absent (CREATE_ONLY safe) | PASS |

---

## Existing Orchestrator Behavior (Phase 1 + Phase 2)

From `run_client_pipeline.py`:

- **Phase 1** (`phase_01_source_boundary`, lines 125–149): Opens `archive_path` as binary, computes SHA256, compares to `source_manifest['sha256']`. Validation-only — no generation.
- **Phase 2** (`phase_02_intake`, lines 154–163): Checks `extracted_path` directory exists, counts files via rglob. Validation-only — no generation.

Both phases pass for FastAPI using:
- `archive_path`: `clients/e65d2f0a.../input/intake/manifests/fastapi-backend.manifest.sha256` (MANIFEST_FILE_PROXY)
- `sha256`: `b93be45319f28dfb04269c42c0b14f6288f8b2328d9490962e83c4941ced86bb`
- `extracted_path`: `clients/e65d2f0a.../input/intake/source/fastapi-backend` (87 files)

---

## Implementation: source_intake.py

**Script created:** `scripts/pios/source_intake.py`  
**Contract:** PI.LENS.SOURCE-INTAKE.GENERIC.01

### Design Decisions

**Path resolution:** Client slug path used (`clients/<client_id>/psee/runs/<run_id>/intake/`). The orchestrator already uses the slug path for run outputs — consistent with `run_client_pipeline.py` which writes to `clients/<client_id>/psee/runs/`. No UUID path required; the source_manifest.json fields carry the UUID paths for pre-orchestrator artifacts.

**MANIFEST_FILE_PROXY compatibility:** The script accepts any binary-readable file as `archive_path`. For FastAPI this is the SHA256 manifest file (proxy for the source directory). The script computes SHA256 of that file and validates against `source_manifest['sha256']`. This is identical to Phase 1 behavior and is client-agnostic.

**File inventory:** Uses `rglob("*")` on `extracted_path`, filtered to files only, sorted deterministically. For FastAPI: 87 files found, matching registered `file_count: 87`. No individual file hashing — the aggregate_hash in source_manifest provides integrity for the full directory; per-file hashing would be slow on large sources and is not required by Phase 2.

**CREATE_ONLY:** All 4 output files are checked before any writes. If any target exists, fail_closed is called before writing any file. Confirmed: re-running after write correctly fires FAIL-CLOSED.

**Required manifest fields:** `archive_path`, `sha256`, `extracted_path` — the minimum needed for boundary + inventory validation. Additional fields (file_count, aggregate_hash, source_version) are read opportunistically for enhanced output.

---

## Validation Results

### --validate-only

```
INTAKE PASS
  archive_path exists: True
  SHA256 match: True
  Boundary result: PASS
  source_root exists: True
  files found: 87 (matches registered: 87)
  Inventory result: PASS
```

No files written.

### --write (full execution)

```
[WROTE] clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/intake/source_boundary_validation.json
[WROTE] clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/intake/source_checksum_validation.json
[WROTE] clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/intake/source_inventory.json
[WROTE] clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/intake/intake_manifest.json
INTAKE PASS
```

### CREATE_ONLY guard re-run

```
FAIL-CLOSED: CREATE_ONLY violation — target files already exist in
clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/intake: [all 4 files]
```

---

## Scope Guards

- No 40.x structural scanning — CONFIRMED
- No structural_node_inventory.json generated — CONFIRMED
- No CEU / DOM / 41.x / 75.x — CONFIRMED
- No BlueEdge baseline artifacts modified — CONFIRMED
- No FastAPI source files modified — CONFIRMED
- Output written only to `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/intake/` — CONFIRMED

---

## Next Step

This contract closes Step 2 of the minimum orchestration chain for the FastAPI client. Phases 1 and 2 of `run_client_pipeline.py` already pass. The next gap is **Step 5 (40.x structural analysis)** — requires a generic client-source structural scanner.

Recommended next stream: **PI.LENS.STRUCTURAL-SCANNER.GENERIC.01**
