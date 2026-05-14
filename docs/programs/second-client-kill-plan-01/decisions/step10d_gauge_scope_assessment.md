# STEP 10D — GAUGE Package Artifact Scope Assessment Decision Trace

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10D
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Context

STEP 10D objective: confirm exact GAUGE execution path and identify how to produce all
five required package artifacts at `clients/<uuid>/psee/runs/<run_id>/package/`.
READ-ONLY assessment. No execution. No file modification except this trace.

Client: `e65d2f0a-dfa7-4257-9333-fcbb583f0880`
Run: `run_01_oss_fastapi`

---

## CANONICAL Brain

**Five required artifacts (REQUIRED_PACKAGE_ARTIFACTS, build_evidence_vault.py line 33):**

1. `gauge_state.json`
2. `coverage_state.json`
3. `reconstruction_state.json`
4. `canonical_topology.json`
5. `signal_registry.json`

**Authoritative package location:** `clients/<uuid>/psee/runs/<run_id>/package/`

**Confirmed present:** `clients/e65d2f0a-.../psee/runs/run_01_oss_fastapi/package/` directory
exists (created by STEP 7 pipeline). `intake_record.json` at `psee/runs/run_01_oss_fastapi/`
contains correct `run_id=run_01_oss_fastapi` and `client_uuid=e65d2f0a-...`. Directory is
empty — no package artifacts present.

**CANONICAL verdict:** Path is correct. `intake_record.json` identity is clean. Package
directory awaits population.

---

## CODE Brain

**Authoritative GAUGE pipeline:** `scripts/pios/pios.py` — all `pios emit *` and
`pios compute gauge` commands write to `<run_dir>/package/`. This is the `psee/runs/`
path. No path mismatch (this is NOT `run_client_runtime.py`).

**Production sequence and output paths:**

| Command | Script invoked | Output |
|---------|---------------|--------|
| `pios bootstrap --run-dir <run_dir>` | direct | `package/engine_state.json`, `package/gauge_inputs.json` |
| `pios emit coverage --run-dir <run_dir> --ig-dir <ig_dir>` | `compute_coverage.sh` | `package/coverage_state.json` |
| `pios emit reconstruction --run-dir <run_dir> --ig-dir <ig_dir>` | `compute_reconstruction.sh` | `package/reconstruction_state.json` |
| `pios emit topology --run-dir <run_dir> --run-id <run_id>` | `emit_canonical_topology.py` | `package/canonical_topology.json` |
| `pios emit signals --run-dir <run_dir>` | `build_signals.py` | `package/signal_registry.json` |
| `pios compute gauge --run-dir <run_dir>` | inline logic | `package/gauge_state.json` |

**Exact GAUGE terminal command:**
```
python3 -m pios compute gauge \
  --run-dir clients/e65d2f0a-dfa7-4257-9333-fcbb583f0880/psee/runs/run_01_oss_fastapi
```
This reads the four inputs from `package/` and writes `gauge_state.json`. It is correctly
parameterized — reads `intake_record.json` for `run_id` and `client_uuid`.

**Current output path:** `clients/<uuid>/psee/runs/run_01_oss_fastapi/package/` — correct.
No path mismatch between `pios` commands and vault builder.

**Blockers identified (three hard stops):**

**BLOCKER-1 — `pios emit coverage` / `pios emit reconstruction` require IG dir**

`compute_coverage.sh` requires:
- `<ig_dir>/evidence_boundary.json`
- `<ig_dir>/admissibility_log.json`
- `<ig_dir>/normalized_intake_structure/layer_index.json`
- `<ig_dir>/source_manifest.json`

No IG directory exists for the second client. Client directory contains only:
`config/`, `input/`, `psee/`, `runs/`. The second-client PSEE run was produced via
`run_end_to_end.py` (STEP 7), not via the `pios ig materialize` / IG pipeline.

**BLOCKER-2 — `pios emit topology` is hardcoded to BlueEdge**

`emit_canonical_topology.py` loads `build_semantic_layer.py` and enforces a parity
guard (lines 60–65):
```python
if len(DOMAINS) != 17:    fail("PARITY", ...)
if len(CAPABILITIES) != 42: fail("PARITY", ...)
if len(COMPONENTS) != 89:   fail("PARITY", ...)
```
The second client has 5 domains (per `binding_envelope.json`). This script CANNOT
produce a valid `canonical_topology.json` for the second client — it will `sys.exit(1)`
at parity guard before writing any output.

**BLOCKER-3 — `pios emit signals` is hardcoded to BlueEdge**

`build_signals.py` contains a hardcoded `SIGNALS` list with BlueEdge-specific evidence
references (SIG-001..SIG-005 referencing INTEL-001, COND-001..003, DIAG-006, 40.5/40.6/40.7
stream artifacts). It cannot produce a valid `signal_registry.json` for the second client.

**CODE verdict:** `pios compute gauge` is correctly parameterized and path-correct. Three of
four emit preconditions are BLOCKED for the second client. `gauge_state.json` cannot be
produced until all four inputs exist.

---

## PRODUCT Brain

**Authoritative source:** `pios` CLI pipeline is the productized GAUGE execution surface.
`run_client_runtime.py` (WP-13) is a separate runtime — its `runs/` output path and
incomplete artifact set (missing `canonical_topology.json`, `signal_registry.json`) confirm
it is not the product surface for vault-bound GAUGE execution.

**Coverage/reconstruction data availability:** The PSEE run at `psee/runs/run_01_oss_fastapi/`
contains `lineage/raw_input.json` with `__coverage_percent=100.0` and
`__reconstruction_state=PASS`. This data exists but is not in `package/` artifact format.
It cannot be consumed directly by `pios compute gauge` — the gauge engine reads
`coverage_state.json` and `reconstruction_state.json` from `package/`.

**PRODUCT verdict:** GAUGE must populate `psee/runs/.../package/` via the `pios` pipeline.
The three blockers (IG dir, topology hardcoding, signals hardcoding) must be resolved before
GAUGE can execute for the second client.

---

## PUBLISH Brain

**No BlueEdge fallback risk:**
- `pios compute gauge` derives `run_id` and `client_uuid` from `intake_record.json` at the
  specified `--run-dir`. The second client's `intake_record.json` contains clean
  `run_id=run_01_oss_fastapi` and `client_uuid=e65d2f0a-...`. No BlueEdge identity leakage.
- The contaminated `runs/run_01_oss_fastapi/package/gauge_state.json` (containing
  `client_id: "blueedge"`) is at the WP-13 path and is structurally excluded — the `pios`
  pipeline reads from `psee/runs/`, not `runs/`.
- BLOCKER-2 and BLOCKER-3 currently prevent execution, which is safe: no incorrect artifacts
  will be produced while these blockers exist.

**PUBLISH verdict:** No contamination risk from chosen path strategy. Blockers provide
natural fail-closed protection against using wrong data.

---

## Gap Identified

The `pios` pipeline is the correct GAUGE execution path and writes to the canonical location.
However, three emit commands are blocked for the second client:

| Blocker | Command | Root cause | Resolution class |
|---------|---------|------------|-----------------|
| BLOCKER-1 | `pios emit coverage`, `pios emit reconstruction` | No IG dir for second client | New IG artifacts OR alternative coverage/reconstruction derivation |
| BLOCKER-2 | `pios emit topology` | `emit_canonical_topology.py` hardcodes 17/42/89 BlueEdge parity | New client-parameterized topology emitter |
| BLOCKER-3 | `pios emit signals` | `build_signals.py` hardcodes BlueEdge signal data | New client-parameterized signals builder |

The `pios compute gauge` command itself is not blocked — it is parameterized and correct.
It cannot run only because its four input artifacts are absent.

---

## Required Next Action (10E)

STEP 10E scope: determine resolution path for the three blockers. Assessment required for:

1. **BLOCKER-1 resolution options:**
   - Option A: produce IG dir artifacts for second client (requires `pios ig materialize`)
   - Option B: derive `coverage_state.json` and `reconstruction_state.json` directly from
     `lineage/raw_input.json` (100% coverage, PASS reconstruction already confirmed in STEP 7)
   - Determine which is authorized

2. **BLOCKER-2 resolution options:**
   - Option A: new `emit_canonical_topology.py` for second client (5 domains, 30 capabilities, derived from `binding_envelope.json`)
   - Option B: parameterize existing script to accept client topology data
   - Determine which is authorized

3. **BLOCKER-3 resolution options:**
   - Option A: new `build_signals.py` for second client (signals derived from second-client evidence)
   - Option B: determine if second client has signals defined at all — if not, `signal_registry.json` may be empty but structurally valid
   - Determine which is authorized

STEP 10E is an assessment step only — no code changes until the resolution path is decided.

---

## Confirmation: No Runtime Execution

No scripts were executed. No pipeline commands were run. No vault built.
All assessment derived from reading existing scripts and artifacts.

---

## Confirmation: No Files Modified

No existing files were modified. This file is a new creation only.

---

## STEP 10D Status

**COMPLETE** (scope assessment complete; three new hard blockers identified; GAUGE
execution remains BLOCKED pending STEP 10E resolution path decision)
