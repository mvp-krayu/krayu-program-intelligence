# Source Extraction Contract
## PI.LENS.REAL-E2E-PIPELINE.BLOCKER-07-CLOSURE.01

**Date:** 2026-05-03
**Branch:** work/psee-runtime
**Baseline commit:** a816368dfc6b1187c853a7e27c20b6b128e7b637

---

## BLOCKER-07 — Source archive not extracted

**Root cause:** `source_intake.py` validates and inventories an already-extracted
source archive; it does not perform extraction. Neither CLIENT_RUN nor EXTRACTED_PATH
canonical_repo existed for `run_blueedge_e2e_execute_01`. The LENS E2E execute chain
had no extraction stage.

---

## Decision

Create `scripts/pios/source_extract.py` — a new deterministic extraction producer.

It:
1. Reads `source_manifest.json`
2. Resolves archive path (absolute or repo-relative)
3. Validates SHA256 before extraction
4. Detects archive type (`.tar`, `.tar.gz`, `.zip`)
5. Validates all members with path traversal guard
6. Extracts to `clients/<client>/psee/runs/<run>/intake/canonical_repo/`
7. Enforces CREATE_ONLY (fail if destination non-empty unless `--allow-existing`)
8. Guards against canonical/productized run targets
9. Writes `extraction_manifest.json`

---

## lens_e2e_assemble.sh Integration

Added Stage 00 (source extraction) before Stage 01 (source_intake validate-only):
- If `canonical_repo` already exists → skip (idempotent), status `VALIDATED_ONLY`
- Otherwise → run `source_extract.py`

Stage 01 now depends on Stage 00 exit. Cascade propagates: 00 → 01 → 02 → 03 → 04 → 05.

Overall loop and print loop updated: `for STAGE in 00 01 02 03 04 05 06 07 08 09`.

---

## Scope

| Item | In scope |
|------|----------|
| `scripts/pios/source_extract.py` — create | YES |
| `scripts/pios/lens_e2e_assemble.sh` — Stage 00 + cascade + loops | YES |
| `scripts/pios/source_intake.py` | NO |
| `scripts/pios/run_client_pipeline.py` | NO |
| Any other producer scripts | NO |
| Canonical productized/fixed runs | NO |

---

## Execution Result

Extraction: `run_blueedge_e2e_execute_01` — 741 files written to
`clients/blueedge/psee/runs/run_blueedge_e2e_execute_01/intake/canonical_repo/`.

Pipeline stages 00-04 all execute successfully for the first time.
Stage 05 (dom_layer_generator.py) blocked on manifest conflict (BLOCKER-08).
Stage 06 (run_client_pipeline.py) Phases 1-4 all PASS; Phase 5 fails on missing
FastAPI conformance artifact (BLOCKER-09).

---

## BLOCKER-07 Closed

This contract closes BLOCKER-07.
New blockers identified: BLOCKER-08 (dom_layer manifest conflict),
BLOCKER-09 (run_client_pipeline Phase 5 FastAPI artifact missing).
