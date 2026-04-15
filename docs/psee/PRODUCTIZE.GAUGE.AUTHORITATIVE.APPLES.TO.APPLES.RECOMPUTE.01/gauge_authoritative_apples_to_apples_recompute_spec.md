# GAUGE Authoritative Apples-to-Apples Recompute Specification
# PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01

- Version: 1.0
- Stream: PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01
- Authority: GAUGE.STATE.COMPUTATION.CONTRACT.01 / PSEE-GAUGE.0
- Branch: feature/gauge-authoritative-apples-to-apples-recompute
- Date: 2026-04-15

---

## SECTION 1 — AUTHORITATIVE SOURCE BASIS

### Discovery method

Inspected the complete file tree of `run_01_authoritative`, all 30-unit runs, and available intake bundles.

### Source basis identified

**Authoritative IG:** `docs/pios/IG.RUNTIME/run_01/`

**Original source (no longer present):** `docs/pios/runs/run_07_source_profiled_ingestion/`

The `docs/pios/IG.RUNTIME/run_01/` directory is the surviving artifact of the ingestion pipeline that produced `run_01_authoritative`. It contains the complete IG handoff package:

```
docs/pios/IG.RUNTIME/run_01/
├── evidence_boundary.json          → enforcement=STRICT, source_run=run_07_source_profiled_ingestion
├── admissibility_log.json          → 30 ADMITTED entries, summary.total=30
├── source_manifest.json            → root_artifacts: [adapter_binding.md, payload_manifest.json, run_manifest.md]
└── normalized_intake_structure/
    ├── layer_index.json            → 3 layers (L40_2:4, L40_3:6, L40_4:17 = 27 artifacts)
    ├── provenance_chain.json
    └── source_profile.json
```

### Why this is the authoritative source basis

`run_01_authoritative` has no `ig/` directory — it was produced by the legacy static path model.
All 30-unit runs in the system (run_01_authoritative, run_04, run_05, run_06, run_cli_validation_01,
run_cli_validation_02) share the same IG basis from `docs/pios/IG.RUNTIME/run_01/`. None have
a run-scoped `ig/` directory.

The original source that produced this IG (`run_07_source_profiled_ingestion/`) is no longer present
in the repository. The IG.RUNTIME/run_01 artifacts are the only remaining authoritative 30-unit basis.

### Chain adaptation

`pios intake create` and `pios ig materialize` require a source directory containing the original
files. Since `run_07_source_profiled_ingestion/` no longer exists, these two steps cannot be run.
The IG.RUNTIME/run_01 artifacts are used explicitly as the `--ig-dir` argument to `pios emit coverage`
and `pios emit reconstruction`. This is NOT a static code fallback — it is an explicit argument binding.

The forbidden path check in `compute_coverage.sh` and `compute_reconstruction.sh` does NOT forbid
`docs/pios/IG.RUNTIME/run_01/`. All required input files are present and compatible with both scripts.

---

## SECTION 2 — WHY run_01_authoritative = 30 UNITS

The 30-unit count is derived from `docs/pios/IG.RUNTIME/run_01/admissibility_log.json`:

| field | value |
|-------|-------|
| `summary.total` | 30 |
| `summary.admitted` | 30 |
| `summary.excluded` | 0 |

**Breakdown by layer:**

| layer | artifact_count | role |
|-------|---------------|------|
| ROOT | 3 | adapter_binding.md, payload_manifest.json, run_manifest.md |
| L40_2 | 4 | evidence artifacts from ingestion stream 40.2 |
| L40_3 | 6 | structural artifacts from ingestion stream 40.3 |
| L40_4 | 17 | normalized artifacts from ingestion stream 40.4 |
| **Total** | **30** | |

**Cross-reference mechanism (per compute_coverage.sh):**

1. Collect artifact names from `layer_index.json` layers with `admission_status=ADMITTED` → 27 names
2. Collect artifact names from `source_manifest.json.root_artifacts.artifacts` → 3 names
3. Cross-reference: each of the 30 ADMITTED entries in admissibility_log must have a name in the union set → 30/30 match
4. `admissible_units = 30`, `required_units = 30`, `coverage_percent = 100.0`

---

## SECTION 3 — RECOMPUTE STRATEGY

**Run ID:** `run_authoritative_recomputed_01`

**IG source:** `docs/pios/IG.RUNTIME/run_01/` (explicitly passed as `--ig-dir`)

**Steps executed:**

| step | command | status |
|------|---------|--------|
| S0-01 | `pios ledger create` | EXECUTED |
| S0-02 | `pios bootstrap` | EXECUTED |
| S1-01 | `pios intake create` | BLOCKED — original source (`run_07_source_profiled_ingestion/`) absent |
| S1-02 | `pios ig materialize` | BLOCKED — no intake bundle for authoritative source |
| S1-03 | `pios structural extract/relate/normalize` | BLOCKED — no intake bundle |
| S1-04 | `pios ig integrate-structural-layers` | BLOCKED — no modern ig/ |
| S1-05 | `pios emit coverage --ig-dir docs/pios/IG.RUNTIME/run_01` | EXECUTED |
| S1-06 | `pios emit reconstruction --ig-dir docs/pios/IG.RUNTIME/run_01` | EXECUTED |
| S2-01 | `pios emit topology` | EXECUTED |
| S3-01 | `pios emit signals` | EXECUTED |
| S4-01 | `pios compute gauge` | EXECUTED |
| S4-02 | `pios declare coherence` | EXECUTED |
| S4-03 | `pios validate freshness` | EXECUTED |

**All package artifacts are produced by the executable chain — none are copied.**

---

## SECTION 4 — EXACT COMMAND SEQUENCE

```bash
RUN_ID=run_authoritative_recomputed_01
RUN_DIR=clients/blueedge/psee/runs/run_authoritative_recomputed_01
IG_DIR=docs/pios/IG.RUNTIME/run_01

# S0: Ledger and Bootstrap
python3 scripts/pios/pios.py ledger create \
  --run-id $RUN_ID --client blueedge --source-version blueedge-platform-v1

python3 scripts/pios/pios.py bootstrap --run-dir $RUN_DIR

# BLOCKED: pios intake create — run_07_source_profiled_ingestion/ absent
# BLOCKED: pios ig materialize — no intake bundle
# BLOCKED: pios structural extract/relate/normalize — no intake bundle
# BLOCKED: pios ig integrate-structural-layers — no modern ig/

# S1: Coverage and Reconstruction from authoritative IG
python3 scripts/pios/pios.py emit coverage \
  --run-dir $RUN_DIR --ig-dir $IG_DIR

python3 scripts/pios/pios.py emit reconstruction \
  --run-dir $RUN_DIR --ig-dir $IG_DIR

# S2/S3: Topology and Signals
python3 scripts/pios/pios.py emit topology \
  --run-dir $RUN_DIR --run-id $RUN_ID

python3 scripts/pios/pios.py emit signals --run-dir $RUN_DIR

# S4: Gauge, Coherence, Freshness
python3 scripts/pios/pios.py compute gauge --run-dir $RUN_DIR
python3 scripts/pios/pios.py declare coherence --run-dir $RUN_DIR
python3 scripts/pios/pios.py validate freshness --run-dir $RUN_DIR
```

---

## SECTION 5 — RECOMPUTED RUN VALIDATION

### Required value checks

| check | expected | actual | result |
|-------|----------|--------|--------|
| validated_units | 30 | 30 | PASS |
| coverage | 30/30 | 30/30 | PASS |
| coverage% | 100.0 | 100.0 | PASS |
| reconstruction | 30/30 | 30/30 | PASS |
| reconstruction state | PASS | PASS | PASS |
| topology domains | 17 | 17 | PASS |
| topology capabilities | 42 | 42 | PASS |
| topology components | 89 | 89 | PASS |
| signals | 5 | 5 | PASS |
| canonical_score | 60 | 60 | PASS |
| projected_score | 100 | 100 | PASS |
| execution_status | NOT_EVALUATED | NOT_EVALUATED | PASS |
| completion_points | 0 | 0 | PASS |
| verdict | GOVERNED AND FRESH THROUGH S4 | GOVERNED AND FRESH THROUGH S4 | PASS |

All 14 required checks: PASS.

### validate freshness result

```
BOOTSTRAP: VALID — AC-01..AC-10: ALL PASS
COHERENCE: COHERENT — CA-01..CA-10: ALL PASS
COMPUTATION: COMPUTABLE — GC-01..GC-10: ALL PASS
SC_CRITERIA: SC-01..SC-10 PASS (SC-06 NOT_EVALUATED)
VERDICT: GOVERNED AND FRESH THROUGH S4
```

---

## SECTION 6 — LIVE localhost:3002 BINDING

### Launch command

```bash
cd /Users/khorrix/Projects/k-pi-core/app/gauge-product && \
GAUGE_PACKAGE_DIR=/Users/khorrix/Projects/k-pi-core/clients/blueedge/psee/runs/run_authoritative_recomputed_01/package \
npx next dev -p 3002
```

**Working directory:** `/Users/khorrix/Projects/k-pi-core/app/gauge-product`
**Port:** 3002
**Env var:** `GAUGE_PACKAGE_DIR` — scoped to this process only
**Run bound:** `run_authoritative_recomputed_01`
**localhost:3001 impact:** NONE

### Binding proof

Live probe of `curl http://localhost:3002/api/gauge` returns `run_id: run_authoritative_recomputed_01`,
`required_units: 30`, `admissible_units: 30`. Binding confirmed.

---

## SECTION 7 — 3001 VS 3002 APPLES-TO-APPLES COMPARISON

### Structural foundation (IDENTICAL)

| metric | localhost:3001 | localhost:3002 | match |
|--------|---------------|---------------|-------|
| coverage required_units | 30 | 30 | **SAME** |
| coverage admissible_units | 30 | 30 | **SAME** |
| coverage_percent | 100.0 | 100.0 | **SAME** |
| reconstruction validated_units | 30 | 30 | **SAME** |
| reconstruction state | PASS | PASS | **SAME** |
| topology domains | 17 | 17 | **SAME** |
| topology capabilities | 42 | 42 | **SAME** |
| topology components | 89 | 89 | **SAME** |
| signals total | 5 | 5 | **SAME** |
| canonical_score | 60 | 60 | **SAME** |
| band_label | CONDITIONAL | CONDITIONAL | **SAME** |
| completion_points | 0 | 0 | **SAME** |
| coverage_points | 35 | 35 | **SAME** |
| reconstruction_points | 25 | 25 | **SAME** |
| confidence lower | 60 | 60 | **SAME** |
| confidence upper | 100 | 100 | **SAME** |

**The structural score foundation is PROVEN IDENTICAL.**

### Schema version differences (EXPECTED — Stream 10 additions)

| field | localhost:3001 (pre-Stream 10) | localhost:3002 (Stream 10 semantics) | cause |
|-------|-------------------------------|--------------------------------------|-------|
| `run_id` | run_01_authoritative | run_authoritative_recomputed_01 | Different runs — expected |
| `projected_score` | absent | 100 | Stream 10: new field |
| `execution_status` | PHASE_1_ACTIVE | NOT_EVALUATED | Stream 10: new status semantics |
| `execution_layer_evaluated` | absent | False | Stream 10: new field |
| `execution_mode` | FULL | STRUCTURAL_ONLY | Stream 10: new field |
| `confidence.status` | COMPUTED | SPLIT_EXECUTION_NOT_EVALUATED | Stream 10: new semantics |

**Classification: All differences are intentional schema additions from Stream 10 (PRODUCTIZE.GAUGE.SCORING.SEMANTIC.ALIGNMENT.01). There are ZERO unintended differences.**

---

## SECTION 8 — FINAL VERDICT

**Comparison result: DIFFERENCE (expected — schema version gap only)**

The apples-to-apples structural foundation is PROVEN IDENTICAL:
- Same unit basis: 30/30 units ✓
- Same structural scale: 30/30 coverage, 30/30 reconstruction ✓
- Same score components: coverage=35, reconstruction=25, completion=0, canonical=60 ✓
- Same topology: 17/42/89 ✓
- Same signals: 5 ✓
- Same confidence bounds: lower=60, upper=100 ✓

The differences are ONLY the new schema fields introduced by Stream 10:
- `projected_score`, `execution_layer_evaluated`, `execution_mode`, `NOT_EVALUATED` status, `SPLIT_EXECUTION_NOT_EVALUATED` confidence

`localhost:3001` (run_01_authoritative) shows a pre-Stream-10 gauge_state with legacy semantics (PHASE_1_ACTIVE, FULL mode, no projected_score). `localhost:3002` (run_authoritative_recomputed_01) shows the same structural truth with the correct Stream 10 semantics.

**No scoring logic error. No data inconsistency. No fabrication.**

The recomputed run is the authoritative-equivalent run on the modern backend. The comparison is exact.

Authority: PRODUCTIZE.GAUGE.AUTHORITATIVE.APPLES.TO.APPLES.RECOMPUTE.01
