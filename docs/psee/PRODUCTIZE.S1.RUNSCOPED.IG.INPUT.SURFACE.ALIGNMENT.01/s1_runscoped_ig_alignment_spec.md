# S1 Run-Scoped IG Input Surface Alignment Specification
# PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01

- Version: 1.0
- Stream: PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01
- Authority: PRODUCTIZE.IG.FROM.INTAKE.01 / PSEE-RUNTIME.5A / PSEE-RUNTIME.6A
- Branch: feature/s1-runscoped-ig-alignment
- Date: 2026-04-14

---

## SECTION 1 — PROBLEM STATEMENT

### Identified gap

S1 commands `pios bootstrap` and `pios compute gauge` read run identity from
`<run_dir>/intake_record.json`. In the legacy intake chain (`pios intake create` →
`pios ig materialize` pre-stream), `intake_record.json` was written to the run directory.

Under the new intake chain introduced by PRODUCTIZE.IG.FROM.INTAKE.01, `intake_record.json`
lives at `clients/<tenant>/psee/intake/<intake_id>/intake_record.json`. It is NOT written to
`<run_dir>/`. The run directory root (`clients/<tenant>/psee/runs/<run_id>/`) contains only
the `ig/` subdirectory after materialization.

Additionally, the new `intake_record.json` schema does not carry `run_id` or `client_uuid` —
it uses `intake_id` and `tenant` instead. So even pointing the commands at the intake directory
would not resolve the field gap.

### Commands affected

| command | failure mode |
|---------|-------------|
| `pios bootstrap` | `_fail("intake_record.json not found ... PB-07")` |
| `pios compute gauge` | `_fail("intake_record.json not found ...")` |
| `pios declare coherence` | `_fail("intake_record.json not found ...")` |
| `pios validate freshness` | AC-01=FAIL → BOOTSTRAP_INVALID (non-crashing) |

### Commands NOT affected (confirmed pre-flight)

| command | reason |
|---------|--------|
| `pios emit coverage` | Reads `package/engine_state.json` + ig/ artifacts — no intake_record.json dependency |
| `pios emit reconstruction` | Reads `package/coverage_state.json` + ig/ artifacts — no intake_record.json dependency |
| `pios emit topology` | Reads canonical topology source — no intake_record.json dependency |
| `pios emit signals` | Reads `run_dir/intake_record.json` optionally — graceful if absent |

---

## SECTION 2 — FIX STRATEGY

**Chosen: run_identity.json bridge artifact**

`pios ig materialize` writes a `run_identity.json` file to `<run_dir>/` root at materialization
time. This file carries the minimal run identity fields required by downstream PSEE commands.

`pios bootstrap`, `pios compute gauge`, `pios declare coherence`, and `pios validate freshness`
are extended to fall back to `run_identity.json` when `intake_record.json` is absent.

### Why this approach

- **Additive**: existing workflows that use `intake_record.json` at run_dir root are unchanged;
  `run_identity.json` is only consulted when `intake_record.json` is absent
- **Explicit**: `run_identity.json` is a governed artifact written by `pios ig materialize`;
  no ambient file resolution, no path scanning
- **Deterministic**: content is derived entirely from materialization-time inputs (run_id,
  tenant, intake_id); no wall-clock timestamps, no stochastic behavior
- **Fail-closed preserved**: if neither `intake_record.json` nor `run_identity.json` exists,
  all commands still fail with an explicit error message
- **Bounded**: single file written to run_dir root; no structural side-effects

### run_identity.json schema

```json
{
    "run_id": "<run_id>",
    "client_uuid": "<tenant>",
    "intake_id": "<intake_id>",
    "stream": "PRODUCTIZE.IG.FROM.INTAKE.01"
}
```

Written at: `clients/<tenant>/psee/runs/<run_id>/run_identity.json`
Written by: `pios ig materialize` (Step 6b)
No-overwrite guard: YES — fails if already exists

---

## SECTION 3 — IMPLEMENTATION DETAILS

**File modified:** `scripts/pios/pios.py`

### Change 1 — cmd_ig_materialize: Step 6b write run_identity.json

Added after `os.makedirs(nis_dir)` (Step 6), before GOVERNANCE ARTIFACTS:

```python
# Step 6b: Write run_identity.json at run_dir root
run_dir_path = os.path.join(root, "clients", tenant, "psee", "runs", run_id)
run_identity_path = os.path.join(run_dir_path, "run_identity.json")
if os.path.exists(run_identity_path):
    _fail(f"run_identity.json already exists at {run_identity_path} — no-overwrite guard")
run_identity_doc = {
    "run_id": run_id,
    "client_uuid": tenant,
    "intake_id": intake_id,
    "stream": "PRODUCTIZE.IG.FROM.INTAKE.01"
}
with open(run_identity_path, "w") as f:
    json.dump(run_identity_doc, f, indent=2)
```

Completion log updated: `governance_artifacts=3 runtime_compatibility_artifacts=6 run_identity=1`

### Change 2 — cmd_bootstrap: run_identity.json fallback

```python
if os.path.isfile(intake_path):
    # ... existing intake_record.json read
elif os.path.isfile(run_identity_path):
    # fallback to run_identity.json
    run_id = identity.get("run_id")
    client_id = identity.get("client_uuid")
    if not run_id or not client_id:
        _fail("run_identity.json missing run_id or client_uuid")
else:
    _fail(f"Neither intake_record.json nor run_identity.json found at {run_dir} — PB-07: run pios ig materialize first")
```

### Change 3 — cmd_compute_gauge: run_identity.json fallback

Same pattern as cmd_bootstrap. Fields read: `run_id`, `client_uuid`.

### Change 4 — cmd_declare_coherence: run_identity.json fallback

Same pattern. `source_version=None` when falling back to `run_identity.json`.
(`source_version` is informational only — used in `run_family` entries, not in
coherence verdict or any CA check.)

### Change 5 — cmd_validate_freshness: run_identity.json as AC intake path

```python
if not os.path.isfile(intake_path) and os.path.isfile(run_identity_path):
    intake_path = run_identity_path
ac_results = _check_ac_conditions(intake_path, pkg_dir)
```

`_check_ac_conditions` is NOT modified. With `run_identity.json` as intake path:
- AC-01=PASS (file exists)
- AC-02=PASS (run_id present)
- AC-03=PASS (client_uuid present)
- AC-04=FAIL (source_version absent — new intake chain doesn't carry this field)
- AC-05 through AC-08=FAIL (old intake schema fields absent)
- AC-09=PASS, AC-10=PASS

→ bootstrap_pass=False → BOOTSTRAP_INVALID reported (non-crashing)

This is expected behavior. The AC-04/05/06/07/08 fields belong to the old intake
schema and are not populated by the new intake chain. This is an AC schema alignment
gap that is out of scope for this stream (documented as next boundary in Section 9).

---

## SECTION 4 — BACKWARDS COMPATIBILITY

The fallback model is strictly additive:

| scenario | behavior |
|----------|----------|
| `intake_record.json` at run_dir root | Existing behavior unchanged — read from intake_record.json |
| `run_identity.json` at run_dir root, no intake_record.json | New behavior — fallback to run_identity.json |
| Neither file present | Fail-closed — explicit error message naming both expected files |

Legacy runs that have `intake_record.json` at run_dir root continue to work without any change.
New runs that use `pios ig materialize` will have `run_identity.json` and will use the fallback.

---

## SECTION 5 — IG INPUT SURFACE ALIGNMENT

### What IG-side inputs are required by S1 commands

| command | required ig/ inputs |
|---------|-------------------|
| `pios emit coverage` | `evidence_boundary.json`, `admissibility_log.json`, `normalized_intake_structure/layer_index.json`, `source_manifest.json` |
| `pios emit reconstruction` | above + `normalized_intake_structure/provenance_chain.json`, `normalized_intake_structure/source_profile.json` |

All 6 IG-side inputs are produced by `pios ig materialize` at `<run_dir>/ig/`.
No static fallback to `docs/pios/IG.RUNTIME/run_01` exists in any S1 command.
The ig_dir argument is passed directly by the caller.

**Confirmed: No legacy static path fallback exists in any S1 command.**
The only path gap was the run identity resolution for non-IG commands (bootstrap, compute_gauge,
declare coherence, validate freshness).

---

## SECTION 6 — CHAIN VALIDATION RESULTS

### Full chain executed on run_s8_validation_01

| command | result |
|---------|--------|
| `pios ig materialize` | PASS — run_identity.json written |
| `pios structural extract` | PASS — 2 units |
| `pios structural relate` | PASS — 2 edges |
| `pios structural normalize` | PASS — 2 nodes |
| `pios ig integrate-structural-layers` | PASS — L40_2/L40_3/L40_4 registered |
| `pios bootstrap` | **PASS (via run_identity.json fallback)** |
| `pios emit coverage` | PASS — coverage_percent=100.0 state=COMPUTED |
| `pios emit reconstruction` | PASS — state=PASS violations=0 all axes PASS |
| `pios emit topology` | PASS — domains=17 capabilities=42 components=89 |
| `pios emit signals` | PASS — 5 signals |
| `pios compute gauge` | **PASS (via run_identity.json fallback)** — score=100 band=READY S-13 |
| `pios declare coherence` | **PASS (via run_identity.json fallback)** — MODE_B COHERENT |
| `pios validate freshness` | BOOTSTRAP_INVALID (AC-04/05/06/07/08 FAIL — AC schema gap, documented in Section 9) |

### Reconstruction state

```
state=PASS  validated=2/2  violations=0
COMPLETENESS=PASS  STRUCTURAL_LINK=PASS  REFERENTIAL_INTEGRITY=PASS  LAYER_CONSISTENCY=PASS
```

### Gauge state

```
score=100  band=READY  terminal_state=S-13  execution_status=COMPLETE
run_id=run_s8_validation_01  client_id=blueedge
```

---

## SECTION 7 — DETERMINISM

### run_identity.json

Content is derived entirely from materialization-time inputs: `run_id` (caller argument),
`tenant` (caller argument), `intake_id` (caller argument), `stream` (constant).
No wall-clock timestamps. No stochastic behavior. Output is byte-identical across runs
for the same inputs.

### Fallback resolution

Fallback path resolution is deterministic: `os.path.join(run_dir, "run_identity.json")` is
a stable path. File existence check is deterministic for a stable filesystem state.

### No new non-determinism introduced

All existing determinism invariants of the PSEE chain are preserved.

---

## SECTION 8 — INVARIANTS CONFIRMED

| invariant | status |
|-----------|--------|
| No modification to ig/ artifacts | CONFIRMED — only pios.py modified |
| No modification to any structural artifact | CONFIRMED |
| No modification to compute_coverage.sh or compute_reconstruction.sh | CONFIRMED |
| Fail-closed preserved | CONFIRMED — missing both files → explicit failure |
| Legacy intake_record.json path unchanged | CONFIRMED — fallback only when absent |
| No-overwrite guard on run_identity.json | CONFIRMED |
| run_id correctly resolved in gauge_state.json | CONFIRMED — run_id=run_s8_validation_01 |
| Backwards compatibility | CONFIRMED — additive fallback only |

---

## SECTION 9 — NEXT BOUNDARY IDENTIFIED

**Name:** AC_SCHEMA_ALIGNMENT_FOR_NEW_INTAKE_CHAIN

**Location:** `scripts/pios/pios.py` — `_check_ac_conditions()` function

**Description:** AC-04 through AC-08 check for fields from the old `pios intake create`
intake schema (`source_version`, `stage_participation`, `coverage`, `dependency_table`,
`freshness_classification`). The new intake chain (PRODUCTIZE.IG.FROM.INTAKE.01) does not
produce these fields in `intake_record.json` or in `run_identity.json`.

**Effect:** `validate freshness` reports BOOTSTRAP_INVALID for any run using the new intake
chain — AC-01/02/03/09/10 pass but AC-04/05/06/07/08 fail.

**Resolution requires one of:**
A. Extend `run_identity.json` to carry the fields required by AC-04/05/06/07/08, OR
B. Introduce a new `_check_ac_conditions_new_chain()` path that accepts the new intake schema, OR
C. Extend `pios ig materialize` to write a full-schema `intake_record.json` to the run dir

This is a separate stream. Stream 8 resolves the path/identity gap only.

Authority: PRODUCTIZE.S1.RUNSCOPED.IG.INPUT.SURFACE.ALIGNMENT.01
