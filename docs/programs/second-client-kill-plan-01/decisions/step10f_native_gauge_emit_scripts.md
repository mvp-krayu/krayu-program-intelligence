# STEP 10F — Native GAUGE Emit Scripts Decision Trace

**Stream:** PI.PRODUCTIZATION.SECOND-CLIENT.CONTROLLED-EXECUTION.01
**Chunk:** STEP 10F
**Date:** 2026-04-24
**Branch:** work/psee-runtime

---

## Context

STEP 10F objective: implement PATH A from STEP 10E — four new emit scripts that
derive GAUGE package artifacts from native second-client PSEE evidence.

Client: `e65d2f0a-dfa7-4257-9333-fcbb583f0880`
Run: `run_01_oss_fastapi`

---

## 4-Brain Summary

### CANONICAL

All four scripts derive exclusively from verified second-client PSEE artifacts:
- `lineage/raw_input.json` — `__coverage_percent`, `__reconstruction_state`, entity list
- `binding/binding_envelope.json` — domain nodes, capability surfaces, counts, cross-domain flags
- `intake_record.json` — `run_id`, `client_uuid` (identity binding for all output artifacts)

No BlueEdge values are referenced. No values are invented. Each output artifact
explicitly documents its derivation source in `source_artifacts` and `derivation_note` fields.

### CODE

Four new scripts created. No existing scripts modified.

| Script | Input | Output | Method |
|--------|-------|--------|--------|
| `scripts/pios/emit_coverage_state.py` | `lineage/raw_input.json`, `intake_record.json` | `package/coverage_state.json` | Read `__coverage_percent`, count entities |
| `scripts/pios/emit_reconstruction_state.py` | `lineage/raw_input.json`, `intake_record.json` | `package/reconstruction_state.json` | Read `__reconstruction_state`, derive axis results from PASS invariant |
| `scripts/pios/emit_topology_from_binding.py` | `binding/binding_envelope.json`, `intake_record.json` | `package/canonical_topology.json` | Parse domain nodes, group capability surfaces, derive cross-domain from overlap_evidence |
| `scripts/pios/emit_signals_empty.py` | `intake_record.json` | `package/signal_registry.json` | Empty `signals: []` with CC-2 annotation |

All four scripts share:
- `--run-dir` argument (path to `psee/runs/<run_id>`)
- `--debug` flag for verbose stderr output
- No-overwrite guard (fail if output already exists)
- Fail-closed on missing inputs (`sys.exit(1)`)
- Schema-compatible with `pios compute gauge` inputs

Syntax validation: all four pass `python3 -m py_compile` without errors.

### PRODUCT

The four scripts enable production of all five required `REQUIRED_PACKAGE_ARTIFACTS`
for the second client:
- `coverage_state.json` → `emit_coverage_state.py`
- `reconstruction_state.json` → `emit_reconstruction_state.py`
- `canonical_topology.json` → `emit_topology_from_binding.py`
- `signal_registry.json` → `emit_signals_empty.py`
- `gauge_state.json` → `pios compute gauge` (unchanged; runs after four above exist)

No vault was built in this chunk. `build_evidence_vault.py` was not executed.

### PUBLISH

No publishable claims activated. Score, confidence, and signal claims remain DEFERRED
until STEP 10G executes the four scripts and `pios compute gauge`, producing
`gauge_state.json`. Until that happens, the `package/` directory remains empty and
vault construction cannot proceed.

---

## Evidence First Constraints

| Script | Constraint | How Enforced |
|--------|------------|--------------|
| `emit_coverage_state.py` | `coverage_percent` from `__coverage_percent` only | Direct field read; no computation |
| `emit_reconstruction_state.py` | `state` from `__reconstruction_state` only; axes from PASS invariant | Direct field read; axis derivation documented in `derivation_note` |
| `emit_topology_from_binding.py` | Domain structure from binding envelope `nodes` + `capability_surfaces` | Client/run identity cross-checked against `intake_record.json` |
| `emit_signals_empty.py` | `signals: []` — no invented signal records | Hard-coded empty list; `emission_state: EMPTY_BY_EVIDENCE` |

---

## Schema Compatibility

All outputs are field-compatible with `pios compute gauge` consumption:

| Field consumed by `pios compute gauge` | Source in new artifacts |
|---|---|
| `cs.get("state")` | `coverage_state.json.state = "COMPUTED"` |
| `cs.get("coverage_percent")` | `coverage_state.json.coverage_percent` |
| `cs.get("execution_layer_evaluated")` | `coverage_state.json.execution_layer_evaluated = false` |
| `rs.get("state")` | `reconstruction_state.json.state` |
| `rs.get("axis_results")` | `reconstruction_state.json.axis_results` |
| `rs.get("validated_units")` | `reconstruction_state.json.validated_units` |
| `ct.get("counts")` | `canonical_topology.json.counts` |
| `ct.get("source_authority", {}).get("run_reference")` | `canonical_topology.json.source_authority.run_reference` |
| `ct.get("emission_run_id")` | `canonical_topology.json.emission_run_id` |
| `sr.get("run_reference")` | `signal_registry.json.run_reference` |
| `sr.get("signals", [])` | `signal_registry.json.signals = []` |

---

## Runtime Execution

No scripts were executed. The four emit scripts were created but NOT run.
`pios compute gauge` was NOT invoked. No package artifacts were written.
`build_evidence_vault.py` was NOT invoked.

---

## Remaining Blocker

The four scripts exist but have not been executed. `package/` remains empty.
STEP 10G must run all four scripts against the second-client run dir, then run
`pios compute gauge` to produce `gauge_state.json`.

---

## Next Step (10G)

STEP 10G contract requirements:
1. Run `emit_coverage_state.py --run-dir clients/<uuid>/psee/runs/run_01_oss_fastapi`
2. Run `emit_reconstruction_state.py --run-dir ...`
3. Run `emit_topology_from_binding.py --run-dir ...`
4. Run `emit_signals_empty.py --run-dir ...`
5. Run `pios compute gauge --run-dir ...`
6. Validate all five artifacts exist in `package/`
7. Validate `gauge_state.json` carries correct `run_id` and `client_id`

---

## STEP 10F Status

**COMPLETE** (four scripts created and syntax-validated; artifacts not yet produced)
