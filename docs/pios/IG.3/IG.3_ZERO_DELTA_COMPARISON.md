# IG.3 — Zero-Delta Comparison

**Stream:** IG.3
**Parent:** IG.1
**Layer:** INGESTION
**Status:** COMPLETE
**Date:** 2026-04-04

---

## 1. COMPARISON INPUTS

| Role | Path |
|---|---|
| Reference run | `docs/pios/runs/run_04_adapter_simulation/` |
| Bootstrap run | `docs/pios/runs/run_05_bootstrap_pipeline/` |

---

## 2. NORMALIZATION APPLIED

| Field | Normalized |
|---|---|
| `run_id` | YES |
| `contract` / `upstream_contract` | YES |
| `date` | YES |
| `regeneration_context` | YES |
| `adapter_binding` / `github_*` / `jira_*` | YES |
| Path references (`run_04_*` / `run_05_*`) | YES |

---

## 3. RESULTS BY LAYER

| Layer | Files | Post-normalization differences | Result |
|---|---|---|---|
| 40.2 | 4/4 | NONE | PASS |
| 40.3 | 20/20 | NONE | PASS |
| 40.4 | 17/17 | NONE | PASS |

**Validator output:** PASS 44/44 — VERDICT: NONE (zero delta)

---

## 4. ZERO-DELTA VERDICT

**NONE — confirmed**

The bootstrap-launched run (run_05) is fully equivalent to the adapter simulation run (run_04) in all semantic content. The bootstrap entrypoint introduces zero semantic delta. The pipeline is confirmed bootstrap-invariant.
