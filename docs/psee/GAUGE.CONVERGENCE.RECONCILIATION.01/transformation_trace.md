# GAUGE.CONVERGENCE.RECONCILIATION.01 — Transformation Trace

## Purpose

Document the step-by-step transformation path from Chain A's completion to Chain B's production, identifying where the convergence handoff occurs and what transformations were applied.

---

## Full Transformation Sequence

### Phase 1: Chain A Production

| step | artifact | producer | timestamp | status |
|------|----------|----------|-----------|--------|
| A.1 | IG intake / raw entity data | External / IG system | Before 2026-04-06 | UNKNOWN_ORIGIN (no direct trace) |
| A.2 | `clients/blueedge/.../intake/intake_result.json` | PSEE intake pipeline | 2026-04-06T14:04:53Z | PASS_FULL — 5 domains, all scope |
| A.3 | `gauge_state.json`, `coverage_state.json`, `reconstruction_state.json` | `scripts/psee/run_client_runtime.py` (declared) | 2026-04-06T14:03:57Z (emission) | GENERATED_PRIOR_RUN — committed, run_id=run_01_authoritative |
| A.4 | `engine_state.json`, `gauge_view.json`, `package_manifest.json`, `verification.log` | Same | Same | GENERATED_PRIOR_RUN — package complete, PASS_FULL |

**Chain A terminus:** `run_01_authoritative` package, emission 2026-04-06. Internally consistent. Score=60, coverage=100%, reconstruction=PASS.

---

### Phase 2: Convergence Handoff

| step | artifact | content | significance |
|------|----------|---------|--------------|
| H.1 | `clients/1de0d815.../input/intake/raw_input.json` | 5 domains, 10 entities, 2 OVERLAP_STRUCTURAL relationships | Chain B source intake — physically present, uncertain git status |
| H.1a | `raw_input.json.__source_run_id` | `"run_01_authoritative"` | **Explicit declared link to Chain A** |
| H.1b | `raw_input.json.__coverage_percent` | `100.0` | Carries Chain A's coverage value forward |
| H.1c | `raw_input.json.__reconstruction_state` | `"PASS"` | Carries Chain A's reconstruction verdict forward |
| H.1d | `raw_input.json.__determinism_hash` | `"db206c60..."` | Declared hash — not independently verified |
| H.1e | `raw_input.json.__source_authority` | `"PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07"` | Declared authority chain |

**Handoff type:** DECLARED — Chain B's source artifact declares its origin from Chain A. The handoff is documented in the artifact but was not independently verified through a git trace of raw_input.json's commit history.

---

### Phase 3: Chain B Production

| step | artifact | producer | timestamp | status |
|------|----------|----------|-----------|--------|
| B.1 | `structure_manifest.json` | `scripts/psee/emit_structure_manifest.py` (declared) | Not timestamped directly | stream: PSEE.UUID.STRUCTURE.MATERIALIZATION.40_4; has determinism_hash; source_artifact: raw_input.json |
| B.2 | `binding_model.json` | `scripts/psee/build_binding_convergence.py` (declared) | Not timestamped directly | Listed in binding_envelope.json provenance chain |
| B.3 | `binding_envelope.json` | `scripts/psee/build_binding_convergence.py` (declared) | generated_date: 2026-04-10 | 45 nodes, 62 edges, 5 signals; run_335c0575a080 |

**Chain B terminus:** `run_335c0575a080` binding_envelope, generated 2026-04-10. Internally consistent. 5 domains, 10 component nodes, 2 overlaps, 3 unknown spaces.

---

## Declared Provenance Chain (from binding_envelope.json)

The binding_envelope declares a 6-step internal provenance chain:

| step | declared artifact | role |
|------|------------------|------|
| 1 | raw_input.json | Source intake |
| 2 | (structure extraction) | Not named explicitly |
| 3 | structure_manifest.json | Structure materialization |
| 4 | (binding computation) | Not named explicitly |
| 5 | binding_model.json | Binding intermediate |
| 6 | binding_envelope.json | Final topology artifact |

All upstream artifacts (raw_input.json, structure_manifest.json, binding_model.json) are physically present in the client directory. The scripts that produce them (`emit_structure_manifest.py`, `build_binding_convergence.py`) are present in `scripts/psee/`. The scripts are not invoked by the UI runtime — they are dormant infrastructure.

---

## Transformation Type Classification

| transformation | type | verification |
|----------------|------|-------------|
| IG data → Chain A package | PIPELINE_EXECUTION | Timestamp present; script declared; git committed |
| Chain A run_id → raw_input.__source_run_id | DECLARED_DERIVATION | Declared in artifact; no independent git trace available |
| raw_input → structure_manifest | PIPELINE_EXECUTION | Script declared; artifact present; determinism_hash present |
| structure_manifest → binding_model | PIPELINE_EXECUTION | Script declared; artifact present |
| binding_model → binding_envelope | PIPELINE_EXECUTION | Script declared; artifact present; generated_date present |

**No transformation is verified through live execution.** All are GENERATED_PRIOR_RUN — the pipeline was run at some point, artifacts committed, pipeline dormant.

---

## Intermediate Run ID (run_02_blueedge)

`docs/pios/PI.STRUCTURAL_TOPOLOGY.RECONSTRUCTION.WP-03_TO_WP-07/ceu_registry.json` carries `run_id: run_02_blueedge` and `generated_date: 2026-04-08`.

This places `run_02_blueedge` between Chain A (2026-04-06) and Chain B (2026-04-10), consistent with an intermediate governance registration step. However, `run_02_blueedge` does not appear in either chain's active artifact path. It is an intermediate governance artifact that did not become a live data source.

---

## Transformation Trace Summary

```
[IG source data]
        ↓ (undocumented / UNKNOWN_ORIGIN)
run_01_authoritative intake (2026-04-06)
        ↓ scripts/psee/run_client_runtime.py [declared]
gauge package artifacts (run_01_authoritative)
        ↓
[raw_input.json declares __source_run_id=run_01_authoritative] ← CONVERGENCE HANDOFF
        ↓ scripts/psee/emit_structure_manifest.py [declared]
structure_manifest.json (PSEE.UUID.STRUCTURE.MATERIALIZATION.40_4)
        ↓ (intermediate: ceu_registry.json run_02_blueedge, 2026-04-08) [governance only]
        ↓ scripts/psee/build_binding_convergence.py [declared]
binding_model.json
        ↓ scripts/psee/build_binding_convergence.py [declared]
binding_envelope.json run_335c0575a080 (2026-04-10) ← CHAIN B TERMINUS
```
