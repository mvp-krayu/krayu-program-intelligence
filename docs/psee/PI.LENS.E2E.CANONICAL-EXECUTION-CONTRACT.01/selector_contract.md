# Selector Contract
## PI.LENS.E2E.CANONICAL-EXECUTION-CONTRACT.01 — BLOCK_G

**Generated:** 2026-05-01  
**Mode:** DOCUMENTATION_ONLY / CONTRACT_LOCK  
**Anchor run:** run_be_orchestrated_fixup_01

---

## 1. selector.json Schema

**Location:** `clients/<client_id>/lens/selector/selector.json`  
**Writers:** phase_09_selector_update() (S12), _write_canonical_run_metadata() (S13)  
**Generator (S13) is authoritative for `run_status` classification.**

```json
{
  "client": "<client_id>",
  "current_run": "<run_id>",
  "updated_at": "<ISO-8601 timestamp>",
  "output_root": "clients/<client_id>/lens",
  "navigation_base": "/api/report-file",
  "run_status": {
    "<run_id>": "<RUN_STATUS_CLASS>"
  }
}
```

---

## 2. run_status Classification Values

| Value | Meaning |
|-------|---------|
| `CANONICAL_ORCHESTRATED` | Run produced by fixed orchestrator with parity-validated canonical values. This is the production-bound class. |
| `CANONICAL_BASELINE_REFERENCE` | Run produced by canonical non-orchestrated process (e.g., manual rerun, product integration). Used as baseline reference. |
| `REJECTED_NON_CANONICAL` | Run that failed parity validation or was produced with a known bug. Must NOT be selected as current_run. |

**BlueEdge current state:**
- `run_be_orchestrated_fixup_01`: `CANONICAL_ORCHESTRATED`
- `run_blueedge_rerun_01`: `CANONICAL_BASELINE_REFERENCE`
- `run_be_orchestrated_01`: `REJECTED_NON_CANONICAL`

---

## 3. available_runs.json Schema

**Location:** `clients/<client_id>/lens/selector/available_runs.json`  
**Format duality:** Orchestrator (S12) writes list; generator (S13) normalizes to dict.

**Orchestrator write (S12) — list format:**
```json
[
  {"run_id": "<run_id>", "run_date": "<date>", "status": "<status>"},
  ...
]
```

**Generator canonical format (S13) — dict format:**
```json
{
  "client": "<client_id>",
  "runs": [
    {"run_id": "<run_id>", "run_date": "<date>", "status": "<status>"},
    ...
  ]
}
```

**Normalization rule (implemented in _write_canonical_run_metadata):**
```python
if isinstance(avail, list):
    avail = {"client": client, "runs": avail}
```

This normalization was fixed in PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 BLOCK_E. Any reader of available_runs.json must handle both formats or require the dict form explicitly.

---

## 4. Selector Update Sequence

The selector is written **twice** per pipeline run:

1. **S12 (phase_09_selector_update):** Writes `selector.json` with `current_run = run_id`. Writes list-format `available_runs.json` with run appended.

2. **S13 (_write_canonical_run_metadata):** Overwrites `selector.json` with full `run_status` map and canonical metadata. Normalizes and appends to `available_runs.json` in dict format.

**S13 is the authoritative final write.** The `current_run` set by S12 is overwritten by S13 with the same value plus the `run_status` map.

---

## 5. Selector Revert Protocol

When a run is rejected, the selector must be reverted **before** the fixup rerun:

1. Set `current_run` to the last known-good run
2. Record the revert in a `selector_revert_result.json` artifact
3. Do not execute the fixup pipeline until the selector is in a clean state

**Authority:** PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01 BLOCK_A

---

## 6. Selector Integrity Rules

1. `current_run` MUST reference a run with `run_status == CANONICAL_ORCHESTRATED` or `CANONICAL_BASELINE_REFERENCE`.
2. `current_run` MUST NOT reference a run with `run_status == REJECTED_NON_CANONICAL`.
3. The `available_runs.json` list MUST be append-only (runs are never removed from history).
4. A run may be reclassified in `run_status` (e.g., from no entry to REJECTED_NON_CANONICAL) without rerunning.
5. Selector updates after parity failure MUST revert to the last known-good run.

---

## 7. current/ Mirror Behavior

`clients/<client_id>/lens/current/` is a `shutil.copytree` mirror of `reports/` from the most recently completed pipeline run.

- Overwritten completely on each successful run
- Provides stable, version-agnostic paths for downstream consumers (FastAPI endpoints, UI)
- Does NOT update on failed runs (only written after all reports succeed in S10)
- Content always matches the run whose `manifest.json` is most recently generated

FastAPI MUST serve reports from `lens/current/` or `lens/runs/<run_id>/reports/` — not from arbitrary paths.
