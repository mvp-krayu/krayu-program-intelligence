# Contract Decision
## PI.LENS.RUN-PATH-IDENTITY.CONTRACT-CLOSURE.01

**Date:** 2026-05-03
**Branch:** work/psee-runtime
**Baseline commit:** 180b2a0a739decbec519dd217d8de521c4a698c5

---

## BLOCKER-02 — Run Path Identity Mismatch

**Root cause:** `run_client_pipeline.py` phases 2 and 3 resolve intake and structure paths
exclusively via UUID keys (`source_manifest["extracted_path"]` and
`source_manifest["structure_path"]`). Generic upstream producers (source_intake.py,
structural_scanner.py) write outputs to name-keyed client/run paths:
`clients/<client>/psee/runs/<run_id>/intake/` and `.../structure/`.

Any new-client run without UUID manifest keys causes a `KeyError` crash at phase 2.

---

## Decision

Introduce hybrid path resolution in phases 2 and 3, mirroring the existing pattern
already present in `phase_04_ceu_grounding()`.

Resolution order:
1. `run_dir / "intake"` (or `"structure"`) — CLIENT_RUN mode (generic producer output)
2. `REPO_ROOT / manifest["extracted_path"]` (or `["structure_path"]`) — EXTRACTED_PATH mode (UUID legacy/BlueEdge)
3. If neither exists → FAIL CLOSED with explicit `[PATH-RESOLUTION]` log listing all checked paths

Add `--phase N` argument to allow single-phase execution for targeted validation
without running upstream phases.

---

## Scope

| Item | In scope |
|------|----------|
| `run_client_pipeline.py` phase_02_intake | YES |
| `run_client_pipeline.py` phase_03_40x_structural | YES |
| `run_client_pipeline.py` parse_args --phase | YES |
| `run_client_pipeline.py` main() lambda update | YES |
| `run_client_pipeline.py` main() phase filter | YES |
| Any other producer scripts | NO |
| Pipeline execution | NO |
| Canonical run artifacts | NO |

---

## BLOCKER-02 Closed

This contract closes BLOCKER-02. Remaining open blockers: BLOCKER-03, BLOCKER-04,
BLOCKER-05 (tracked in implementation backlog).
