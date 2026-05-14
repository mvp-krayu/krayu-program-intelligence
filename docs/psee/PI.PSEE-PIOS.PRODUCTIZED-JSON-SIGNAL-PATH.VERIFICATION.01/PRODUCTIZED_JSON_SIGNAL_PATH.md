# Productized JSON Signal Path — Verification Report

Stream: PI.PSEE-PIOS.PRODUCTIZED-JSON-SIGNAL-PATH.VERIFICATION.01  
Status: COMPLETE  
Generated: 2026-05-06  
Baseline commit: 93098cb  
Branch: feature/psee-pios-integration-productized

---

## Executive Verdict

The productized JSON signal path does not use `docs/pios/40.4/*.md` or `docs/pios/40.5/*.md` at any point.

Signal computation in the productized pipeline begins at the 75.x layer, not 40.5. The sole input to signal computation is `binding/binding_envelope.json`. The first JSON artifact carrying signal values is `75.x/pressure_candidate_state.json`, produced by `scripts/pios/75x/compute_pressure_candidates.py`.

The "DPSIG" namespace does not exist in any script, artifact, or productized pipeline. The active signal namespace is PSIG-XXX (PSIG-001, PSIG-002, PSIG-004, PSIG-006) using method `RUN_RELATIVE_OUTLIER`.

The `docs/pios/40.5/*.md` artifacts and `scripts/pios/40.5/build_signal_artifacts.py` are legacy reference artifacts from `run_01_blueedge`. They are not part of the active productized pipeline. The prior adapter design targeting 40.5 markdown consumption as the enrichment point was based on a path that is inactive in production.

The correct enrichment target is `binding/binding_envelope.json`, which is the actual sole input to productized signal computation.

---

## 1. Productized Pipeline Flow (Proven from Code)

```
Phase 5 — build_binding_envelope()
    Input:  binding_envelope_fastapi_compatible.json (conformance) OR
            grounding_state_v3.json + ceu_registry.json + structural_node_inventory.json (generic)
    Output: clients/<client>/psee/runs/<run_id>/binding/binding_envelope.json

Phase 6+7 — phase_06_and_07_e2e()
    Script: scripts/pios/run_end_to_end.py
    │
    ├─ S07_75X.1: scripts/pios/75x/compute_condition_correlation.py
    │       Input:  binding/binding_envelope.json (SOLE INPUT)
    │       Output: 75.x/condition_correlation_state.json
    │       Computes: per-node PSIG-001/002/004/006 condition states (HIGH/NORMAL)
    │
    ├─ S07_75X.2: scripts/pios/75x/compute_pressure_candidates.py
    │       Input:  75.x/condition_correlation_state.json + binding/binding_envelope.json
    │       Output: 75.x/pressure_candidate_state.json
    │       Computes: ★ FIRST artifact with psig_signal_value fields ★
    │                 PSIG-001=2.32, PSIG-002=6.96, PSIG-004=1.0
    │
    ├─ S07_75X.3: scripts/pios/75x/compute_pressure_zones.py
    │       Input:  75.x/pressure_candidate_state.json + 75.x/condition_correlation_state.json
    │       Output: 75.x/pressure_zone_state.json
    │
    └─ S08_41X.1: scripts/pios/41x/compute_signal_projection.py
            Input:  75.x/condition_correlation_state.json + 75.x/pressure_zone_state.json
                    + binding/binding_envelope.json
            Output: 41.x/signal_projection.json
            Contains: PSIG-001/002/004/006 with signal_value, activation_method, zone_ids

Phase 8a — phase_08a_vault()
    Input:  41.x/signal_projection.json (generic path) OR
            signal_registry_fastapi_compatible.json (conformance path)
    Output: vault/signal_registry.json
    Contains: PSIG-001/002/004/006 with signal_value, population_type, source_traceability

Report Generation — lens_report_generator.py
    Input:  clients/<client>/psee/runs/<run_id>/package/signal_registry.json
            clients/<client>/psee/runs/<run_id>/41.x/signal_projection.json
            clients/<client>/psee/runs/<run_id>/binding/binding_envelope.json
            clients/<client>/vaults/<run_id>/claims/fragments/*.json
    Output: clients/<client>/reports/ HTML reports
```

**FastAPI productized run specific note:**

`run_02_oss_fastapi_pipeline` source manifest does NOT contain `fastapi_conformance_path`. Phase 5 uses the generic grounding synthesis path. Phase 6+7 invokes `run_end_to_end.py` directly. Vault `signal_registry.json` carries: `"registry_basis": "41.x/signal_projection.json via PIOS compute_signal_projection.py"`.

---

## 2. Q1 — Which Script Computes Productized Signals?

**`scripts/pios/75x/compute_condition_correlation.py`** is the first computation layer.

It reads `binding/binding_envelope.json` and computes per-node signal conditions for PSIG-001, PSIG-002, PSIG-004, PSIG-006. It does not produce numeric signal values — it produces HIGH/NORMAL condition states.

**`scripts/pios/75x/compute_pressure_candidates.py`** is the first layer to produce numeric signal values (psig_signal_value fields in pressure candidates).

The signal derivation formulas used (from `compute_condition_correlation.py` source):

| Signal | Formula | Method |
|--------|---------|--------|
| PSIG-001 (fan-in concentration) | `fan_in[node] / mean_fan` where `mean_fan = total_edges / total_nodes` | RUN_RELATIVE_OUTLIER |
| PSIG-002 (fan-out propagation) | `fan_out[node] / mean_fan` | RUN_RELATIVE_OUTLIER |
| PSIG-004 (responsibility concentration) | `surfaces_per_ceu[node] / mean_surfaces` where `mean_surfaces = total_surfaces / total_ceus` | RUN_RELATIVE_OUTLIER |
| PSIG-006 (structural fragmentation) | BFS connected components; isolated nodes get ACTIVATED | structural |

These formulas operate directly on `binding_envelope.json` fields: `nodes`, `edges`, `capability_surfaces`.

**"DPSIG" as a namespace does not exist anywhere in the codebase.** No script, JSON artifact, or governance document under `clients/` or `scripts/` uses this identifier. The term appeared only in governance prose (the boundary contract and adapter design) as a label for "distribution-based PiOS signals." The actual signal IDs are PSIG-XXX.

---

## 3. Q2 — Which JSON Artifact First Contains Signal Values?

**`75.x/pressure_candidate_state.json`** is the first JSON artifact with numeric signal values.

Evidence:
- `75.x/condition_correlation_state.json`: 0 occurrences of `signal_value` (confirmed by grep)
- `75.x/pressure_candidate_state.json`: 9 occurrences of `psig_signal_value` (confirmed by grep)
- `75.x/pressure_zone_state.json`: 0 occurrences of `signal_value`

Confirmed values in `41.x/signal_projection.json` (productized FastAPI baseline):

| Signal | Value | Method | Threshold |
|--------|-------|--------|-----------|
| PSIG-001 | 2.32 | RUN_RELATIVE_OUTLIER | 2.0 |
| PSIG-002 | 6.96 | RUN_RELATIVE_OUTLIER | 2.0 |
| PSIG-004 | 1.0 | RUN_RELATIVE_OUTLIER | 2.0 |
| PSIG-006 | 0.2 | THEORETICAL_BASELINE | — |

These same values are carried into `vault/signal_registry.json` with `population_type: per_node_inbound_coupling` (PSIG-001), `per_node_outbound_exports` (PSIG-002), `cluster_membership` (PSIG-004), `population_size: 33`.

---

## 4. Q3 — Does Productized Flow Use docs/pios/40.4/*.md?

**NO.**

Evidence: `grep -n "docs/pios/40"` returns zero results in `run_client_pipeline.py`. Zero results in `compute_condition_correlation.py`, `compute_pressure_candidates.py`, `compute_pressure_zones.py`, `compute_signal_projection.py`, `lens_report_generator.py`.

`docs/pios/40.4/*.md` (18 files) is consumed only by `build_signal_artifacts.py` and `load_40_4_intake.py`. Neither of these is called by the productized pipeline.

---

## 5. Q4 — Does Productized Flow Use docs/pios/40.5/*.md?

**NO.**

Evidence: Zero references to `docs/pios/40.5` in `run_client_pipeline.py` or any 75.x/41.x script.

`docs/pios/40.5/*.md` (11 files) is consumed only by `validate_signal_artifacts.py`. That script is not called by any pipeline phase. `build_signal_artifacts.py` writes to `docs/pios/40.5/*.md` but is also not called by the productized pipeline.

The execution manifest for `docs/pios/40.5/` is locked to `run_01_blueedge` with contract `PIOS-40.5-RUN01-CONTRACT-v1`. This was an earlier BlueEdge-specific execution that predates the JSON-based productized pipeline. It is not a live artifact in the current productized flow.

---

## 6. Q5 — Correct Adapter Target for PSEE Handoff Enrichment

**The correct adapter target is `binding/binding_envelope.json`.**

This is the sole entry point for all productized signal computation. The 75.x scripts (`compute_condition_correlation.py`, `compute_pressure_candidates.py`) read only `binding_envelope.json` as their structural input.

**Implication for prior adapter design:**

The adapter design (PI.PSEE-PIOS.40_5-PSEE-HANDOFF-ADAPTER.DESIGN.01) targeted the 40.5 markdown layer as the enrichment point. That layer is not active in production. The sidecar `psee_40_5_input.json` carrying ST-030..035 values would need a consumer — and that consumer does not currently exist in any 40.5 script.

**Corrected enrichment model:**

The PSEE enrichment adapter must target the binding_envelope consumption path at the 75.x input boundary:

```
PSEE 40.4 artifacts (canonical_topology, grounding_state_v3, binding_envelope)
    ↓
[Adapter extracts / validates PSEE enrichment fields]
    ↓
Enhanced binding_envelope.json (or supplementary psee_enrichment.json alongside it)
    ↓
75x/compute_condition_correlation.py (ACTUAL signal computation entry)
    ↓
... rest of productized pipeline
```

The sidecar output `psee_40_5_input.json` remains valid as an extraction/readiness artifact, but its downstream consumer is the 75.x execution layer, not a 40.5 markdown pipeline.

---

## 7. Q6 — Legacy Markdown Artifacts

### Confirmed legacy/reference-only (not consumed by productized pipeline):

| Path | Status | Evidence |
|------|--------|---------|
| `docs/pios/40.5/signal_input_matrix.md` | LEGACY — run_01_blueedge BlueEdge runtime model | locked to PIOS-40.5-RUN01-CONTRACT-v1 |
| `docs/pios/40.5/signal_computation_specification.md` | LEGACY — BlueEdge Prometheus telemetry signals | locked to run_01_blueedge |
| `docs/pios/40.5/signal_output_set.md` | LEGACY — SIG-001..008 from BlueEdge live telemetry | locked to run_01_blueedge |
| `docs/pios/40.5/signal_traceability_map.md` | LEGACY — BM- entity refs for BlueEdge | locked to run_01_blueedge |
| `docs/pios/40.5/signal_validation_log.md` | LEGACY — run_01_blueedge validation record | locked to run_01_blueedge |
| `docs/pios/40.5/signal_boundary_enforcement.md` | LEGACY — run_01_blueedge boundary declaration | locked to run_01_blueedge |
| `docs/pios/40.5/execution_manifest.md` | LEGACY — notes build_signal_artifacts.py as "stale" | locked to run_01_blueedge |
| `docs/pios/40.4/structural_telemetry.md` et al. (18 files) | REFERENCE — consumed by build_signal_artifacts.py only | not in productized pipeline |

### Governance documents with active design authority (not execution artifacts):

| Path | Status |
|------|--------|
| `docs/pios/40.5/signal_selector_specification.md` | SPECIFICATION — feature/next, no execution authorized |
| `docs/pios/40.5/static_signal_expansion_registry.md` | PROVISIONAL DESIGN — PSIG candidate definitions |
| `docs/pios/40.5/static_signal_expansion_index.md` | SPECIFICATION — ST-030..035 design index |
| `docs/pios/40.4/static_telemetry_expansion_registry.md` | PROVISIONAL — ST-030..035 field definitions |

These governance documents have design authority but are not part of the running pipeline.

---

## 8. Boundary Correction Note

The prior contracts in this stream chain used "DPSIG" as a label for the distribution-based generic signal model. This label does not exist in the productized pipeline.

**Correction:**

| Prior label | Actual productized identity |
|-------------|---------------------------|
| DPSIG-XXX | PSIG-XXX (same signals, different label) |
| "DPSIG computed at 40.5" | PSIG computed at 75.x (compute_condition_correlation.py) |
| "40.5 is first signal layer" | True architecturally; NOT true in the active productized pipeline execution |
| "Generic 40.5 markdown path" | Inactive in productized pipeline; legacy artifact only |

The architectural principle "40.5 is the first layer allowed to compute signals" remains the governance boundary. The productized implementation currently bypasses 40.5 entirely and computes at 75.x from binding_envelope directly. This is a known implementation deviation — `run_client_pipeline.py` explicitly marks Phase 6+7 as partially `STAGE_NOT_AUTOMATED` for the FastAPI conformance path.

---

## 9. Files Inspected

| File | Key Finding |
|------|-------------|
| `scripts/pios/run_client_pipeline.py` | No docs/pios/40.4 or 40.5 reference; Phase 5 produces binding_envelope; Phase 6+7 calls run_end_to_end.py |
| `scripts/pios/run_end_to_end.py` | Orchestrates 75.x→41.x; 5 steps total |
| `scripts/pios/75x/compute_condition_correlation.py` | Reads binding_envelope.json ONLY; computes PSIG-001/002/004/006 per-node conditions |
| `scripts/pios/75x/compute_pressure_candidates.py` | First script producing psig_signal_value; reads condition_correlation + binding_envelope |
| `scripts/pios/41x/compute_signal_projection.py` | Projects signals to 41.x format; uses RUN_RELATIVE_OUTLIER; reads 75.x outputs + binding_envelope |
| `scripts/pios/lens_report_generator.py` | Reads from clients/<client>/psee/runs/<run_id>/package/ and vault/; no docs/pios path |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/75.x/condition_correlation_state.json` | 0 signal_value occurrences |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/75.x/pressure_candidate_state.json` | 9 psig_signal_value occurrences — FIRST signal artifact |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/41.x/signal_projection.json` | PSIG-001=2.32, PSIG-002=6.96, PSIG-004=1.0, PSIG-006=0.2 |
| `clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/vault/signal_registry.json` | registry_basis=41.x/signal_projection.json; PSIG-001..006 final values |
| `clients/fastapi/sources/source_01/source_manifest.json` | No fastapi_conformance_path field |

---

## Validation

PASS criteria:

- [x] Active JSON signal path proven — full script chain traced from binding_envelope.json through 75.x→41.x→vault (Section 1)
- [x] Legacy markdown path separated from active productized path — zero references in run_client_pipeline.py; docs/pios/40.4 and 40.5 confirmed inactive (Sections 4, 5, 7)
- [x] Correct adapter target identified — binding/binding_envelope.json is the sole signal computation input (Section 6)
- [x] No implementation performed — read-only inspection throughout

Status: PASS
