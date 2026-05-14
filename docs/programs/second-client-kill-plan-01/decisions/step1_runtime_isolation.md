# STEP 1 — Runtime Isolation Record

Stream: PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
Date: 2026-04-24
Status: COMPLETE
Step: STEP 1 — Runtime Isolation & BlueEdge Default Separation

---

## Objective

Eliminate all hardcoded BlueEdge dependencies from runtime scripts in `scripts/psee/`,
`scripts/pios/`, `app/`, and `lib/` so the pipeline can execute for any client UUID
without implicit reference to BlueEdge.

---

## Files Modified

| File | Change |
|---|---|
| `app/execlens-demo/lib/gauge/envelope_adapter.py` | Removed `REPO_ROOT` and `DEFAULT_ENVELOPE` constants (hardcoded UUID+run_id path). Made `--envelope` a required argument. |
| `scripts/psee/run_intake_replay.py` | Added `argparse`; `--client` (required) and `--run-id` (default: `run_01_authoritative`). `CLIENT_ID` set from args; no default "blueedge". |
| `scripts/psee/build_runtime_envelope.py` | Added `argparse`; `--client` (required) and `--run-id` (default: `run_01_authoritative`). `CLIENT_ID` set from args; no default "blueedge". |
| `scripts/psee/extract_ceu_lineage.py` | Added `argparse`; `--target-client` (required). `TARGET_CLIENT_UUID` set from arg. `BLUEEDGE_CLIENT`/`BLUEEDGE_RUN_ID` retained as source constants (script reads FROM BlueEdge package intentionally). |
| `scripts/psee/run_end_to_end.py` | Removed module-level `DEMO_CLIENT`/`DEMO_RUN_ID`/`DEMO_PKG_DIR` constants. Added `--demo-client` (required) and `--demo-run-id` (default: `run_01_authoritative`) to argparse. `pre_flight()` and `setup_emit_inputs()` now accept `demo_pkg_dir` parameter. |
| `scripts/pios/projection_runtime.py` | `_find_signal_registry()` signature extended with `vault_path` parameter; derives client dir from vault path instead of hardcoding "blueedge". `_default_vault_path()` changed to raise `ValueError` (fail-closed; no default client). |
| `app/gauge-product/pages/api/gauge.js` | `PACKAGE_DIR` now reads `GAUGE_PACKAGE_DIR` env var only; no blueedge fallback. Handler returns 503 if env var not set. |
| `app/gauge-product/pages/api/report-file.js` | `REPORTS_DIR` now reads `REPORTS_DIR` env var only; removed `REPO_ROOT` and hardcoded path. Handler returns 503 if not configured. |
| `app/gauge-product/pages/api/projection.js` | `FRAGMENTS_DIR` now reads `PROJECTION_FRAGMENTS_DIR` env var only; no blueedge fallback. Handler returns 503 if not set. |
| `app/gauge-product/pages/vault.js` | `CLIENT`/`RUN_ID` now read from `VAULT_CLIENT`/`VAULT_RUN_ID` env vars. `INDEX_PATH` conditional on both being set. Added `VAULT_NOT_CONFIGURED` error state. |
| `app/gauge-product/pages/tier2/workspace.js` | `VAULT_INDEX_URL` derived from `NEXT_PUBLIC_VAULT_CLIENT`/`NEXT_PUBLIC_VAULT_RUN_ID`; null if either absent. Vault index fetch guarded against null URL. |

---

## Exclusions (STEP 2 Scope)

Files NOT modified — PiOS methodology validators (BlueEdge-specific by design):
- `scripts/pios/40.2/validate_evidence_inventory.py`
- `scripts/pios/40.3/validate_reconstruction.py`
- `scripts/pios/40.4/validate_structure_immutability.py`
- `scripts/pios/40.5/` through `40.11/`

Files NOT modified — STEP 3/4/5 scope (complex parameterization):
- `scripts/pios/lens_report_generator.py`
- `scripts/pios/tier2_data.py`
- `scripts/pios/export_graph_state.mjs`

---

## Fail-Closed Invariants Maintained

- All modified scripts now fail if client not provided (argparse required or env var missing)
- No default client path points to "blueedge" in any executable code path
- `_default_vault_path()` raises `ValueError` — callers must supply explicit vault_path
- App API routes return 4xx/5xx immediately if config env vars absent

---

## Verification

Scan of target files for `clients/blueedge` path constructions in executable code:
- `run_end_to_end.py`: 0 remaining
- `projection_runtime.py`: 0 remaining
- `envelope_adapter.py`: 0 remaining
- `run_intake_replay.py`: 0 remaining
- `build_runtime_envelope.py`: 0 remaining
- JS app files: 0 remaining

`extract_ceu_lineage.py`: `clients/blueedge` retained in DOCSTRING only (accurate documentation of BlueEdge-specific source reads; `BLUEEDGE_CLIENT`/`BLUEEDGE_RUN_ID` are intentional source constants, not generic defaults).

---

## Baseline Commit

Pre-STEP-1 HEAD: `effe498f8612ee5e62f61067489c90f294ed1aa7`

---

## 4-Brain Governance

| Brain | Assessment |
|---|---|
| CANONICAL | No canonical truth mutated; evidence boundary unchanged |
| CODE | Implementation reality updated: scripts are now parameterized; BlueEdge no longer implicit default |
| PRODUCT | No product surface changed; app behavior unchanged when env vars are correctly set |
| PUBLISH | No external artifact modified |

---

## Confirmations

- **No runtime execution performed:** confirmed
- **PiOS methodology validators (40.x) unmodified:** confirmed
- **`clients/blueedge/` directory unmodified:** confirmed
- **STEP 2 not executed:** confirmed
