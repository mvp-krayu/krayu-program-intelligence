# Runtime Surface Specification
# PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01

- Date: 2026-04-14
- Stream: PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01
- Branch: feature/computable-chain-to-gauge
- Execution engine: Claude Code (claude-sonnet-4-6)
- Authoritative baseline tags: gauge-provenance-proof-01, execution-enablement-v1, fresh-through-s4-v1
- Baseline state: GOVERNED AND FRESH THROUGH S4 (run_06_blueedge_fresh_s2_s3)
- Client: blueedge
- Source version: blueedge-platform-v1
- Derivation mode: STRICT — all content derived from locked baseline documents; BASELINE GAP labeled where not derivable

---

## SECTION 1 — SYSTEM CONTEXT AND RUNTIME BOUNDARY

### 1.1 Runtime Description

The krayu-program-intelligence PSEE (Program State Evaluation Engine) → GAUGE pipeline is a deterministic, multi-stage chain execution that produces a scored execution state artifact (`gauge_state.json`) from an IG (Intelligence Graph) source package. The pipeline is governed by a fixed set of authority contracts and produces exactly five consumed artifacts for the GAUGE product surface (S4).

The runtime surface defined in this document covers the S0–S4 boundary only. S5 (40.5–40.11), S6 (43.x, 44.x, 42.x), and any live runtime telemetry dependencies are out of scope. GAUGE stops at S4.

### 1.2 Current Baseline Declaration

| property | value |
|----------|-------|
| Baseline state | GOVERNED AND FRESH THROUGH S4 |
| Producing run chain | run_01_authoritative → run_01_blueedge → run_03_blueedge_derivation_validation → run_04_blueedge_fresh_governed → run_05_blueedge_fresh_emission → run_06_blueedge_fresh_s2_s3 |
| Current fresh run | run_06_blueedge_fresh_s2_s3 |
| Client | blueedge |
| Source version | blueedge-platform-v1 |
| Repository | k-pi-core |
| Branch at baseline | feature/computable-chain-to-gauge |
| Tag: gauge-provenance-proof-01 | PRESENT — GOVERNED WITH STATIC DEPENDENCY proof |
| Tag: execution-enablement-v1 | PRESENT — execution enablement plan |
| Tag: fresh-through-s4-v1 | PRESENT — GOVERNED AND FRESH THROUGH S4 declaration |

### 1.3 Governing Contracts (Precedence Order)

1. FRESH.RUN.BOOTSTRAP.PROTOCOL.01 — run identity and dependency governance (S0)
2. GAUGE.STATE.COMPUTATION.CONTRACT.01 — gauge_state.json computation (S4 terminal)
3. S3.S4.RUN.COHERENCE.CONTRACT.01 — artifact set coherence governance (S3/S4 boundary)
4. FRESHNESS.VALIDATION.RUN.01 — freshness validation (COMPLETE — governs re-execution rules)
5. GAUGE.PROVENANCE.PROOF.01 — provenance baseline (READ-ONLY — authoritative gap register)
6. EXECUTION.ENABLEMENT.PLAN.01 — freshness transition plan (COMPLETE — governs FRESH-R1–R4, SC-01–SC-10)

### 1.4 Runtime Scope Boundary

| in scope | out of scope |
|----------|-------------|
| S0: run identity bootstrap (intake_record.json) | S5/S6 pipeline stages |
| S1: PSEE coverage and reconstruction (compute_coverage.sh, compute_reconstruction.sh) | Live runtime telemetry |
| S2: canonical topology emission (emit_canonical_topology.py) | LENS and activation chain (43.x, 44.x) |
| S3: signal registry emission (build_signals.py) | GAUGE product frontend (app/) |
| S4: gauge state computation (gauge_state.json) | IG.5, IG.6, IG.7 pipeline stages |
| Coherence record (coherence_record.json) | API surface implementation (42.x) |
| Admissibility chain evaluation (AC→CA→GC→GA) | Stage 5A/6A script internals beyond documented interface |

---

## SECTION 2 — GOVERNED ARTIFACT SET

### 2.1 Five Canonical Artifacts

The S4 GAUGE consumption set consists of exactly five artifacts. No artifact outside this set is consumed by GAUGE from the S0–S4 chain.

| artifact | role in S4 | producing stage | run identity field | path in run package |
|----------|-----------|----------------|-------------------|---------------------|
| `coverage_state.json` | DIM-01 (Coverage); terminal state context for S-13 classification | S1 — PSEE-RUNTIME.5A (`compute_coverage.sh`) | `run_id` | `package/coverage_state.json` |
| `reconstruction_state.json` | DIM-02 (Reconstruction); axis validation results | S1 — PSEE-RUNTIME.6A (`compute_reconstruction.sh`) | `run_id` | `package/reconstruction_state.json` |
| `canonical_topology.json` | S3 structural topology consumed by GAUGE topology API | S2 — 41.1 semantic layer (`emit_canonical_topology.py`) | `source_authority.run_reference` | `package/canonical_topology.json` |
| `signal_registry.json` | S3 signal definitions consumed by GAUGE signals API | S3 — 41.4 signal registry (`build_signals.py` + CC-2 correction) | `run_reference` | `package/signal_registry.json` |
| `gauge_state.json` | Terminal scored state artifact consumed by GAUGE score/dimensions API | S4 — computed per GAUGE.STATE.COMPUTATION.CONTRACT.01 | `run_id` | `package/gauge_state.json` |

### 2.2 Run Package Directory Structure

The canonical run package directory for a chain execution with `run_id` = `<run_id>` resides at:

```
clients/<client_uuid>/psee/runs/<run_id>/
├── intake_record.json          (S0 — written before any artifact emission)
├── coherence_record.json       (S3/S4 boundary — written before gauge computation)
└── package/
    ├── coverage_state.json     (S1 — PSEE-RUNTIME.5A output)
    ├── reconstruction_state.json (S1 — PSEE-RUNTIME.6A output)
    ├── canonical_topology.json (S2 — emit_canonical_topology.py output)
    ├── signal_registry.json    (S3 — build_signals.py output + CC-2 correction)
    └── gauge_state.json        (S4 — computed from above four)
```

The following auxiliary artifacts are produced by `build_signals.py` but are not consumed by GAUGE:

```
package/evidence_mapping_index.json  (auxiliary — build_signals.py output)
package/executive_signal_report.md   (auxiliary — build_signals.py output)
```

### 2.3 `signal_registry.json` Schema Requirement (CC-2)

All entries in `signal_registry.json` must carry `"runtime_required": false`. This field declares that each signal is derivable from the S2/S3 structural chain without live runtime telemetry. Any `signal_registry.json` where this field is absent from any entry fails CA-08 and blocks S4 consumption.

Source authority: SEMANTIC.COMPUTATION.AUTHORITY.01; S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3.

---

## SECTION 3 — RUN LEDGER REQUIREMENTS

### 3.1 run_id Rules

A `run_id` is the primary identity token for a chain execution. These rules are non-negotiable:

| rule | code | requirement |
|------|------|-------------|
| Unique per client | RI-01 | `run_id` must be unique within the system for the given `client_uuid` |
| Assigned at S0 | RI-02 | `run_id` must be assigned before any stage produces an artifact |
| Format | RI-03 | Non-empty string; no whitespace; no path separators. Recommended: `run_<sequence>_<descriptor>` |
| Recorded in intake_record | RI-04 | `run_id` must be in `intake_record.json` at the time of assignment |
| Carried by all produced artifacts | RI-05 | All artifacts produced by the chain carry the `run_id` in a declared field |

### 3.2 intake_record.json Minimum Required Structure

`intake_record.json` is written at S0 before any artifact emission. It must contain:

```json
{
  "run_id": "<unique run identifier>",
  "client_uuid": "<client identifier>",
  "source_version": "<source version string>",
  "declared_at": "<ISO 8601 timestamp — S0 declaration time>",
  "governed_by": "FRESH.RUN.BOOTSTRAP.PROTOCOL.01",
  "emission_stream": "<stream identifier>",
  "stage_participation": [
    {
      "stage_id": "S0",
      "status": "ACTIVE",
      "authorized_by": "BOOTSTRAP.CHAIN.AUTHORITY.01",
      "description": "<what S0 produced for this run>"
    },
    {
      "stage_id": "S1",
      "status": "ACTIVE | INHERITED",
      "authorized_by": "IG.HANDOFF.AUTHORITY.01",
      "description": "<S1 participation description>",
      "source_run_id": "<if INHERITED: prior run_id>",
      "freshness_in_source_run": "<if INHERITED: FRESH | STATIC>"
    },
    {
      "stage_id": "S2",
      "status": "ACTIVE | INHERITED",
      "authorized_by": "STRUCTURAL.TRUTH.AUTHORITY.01",
      "description": "<S2 participation description>"
    },
    {
      "stage_id": "S3",
      "status": "ACTIVE | INHERITED",
      "authorized_by": "SEMANTIC.COMPUTATION.AUTHORITY.01",
      "description": "<S3 participation description>"
    },
    {
      "stage_id": "S4",
      "status": "ACTIVE",
      "authorized_by": "GAUGE.ADMISSIBLE.CONSUMPTION.01",
      "description": "<S4 computation description>"
    }
  ],
  "coverage": {
    "gauge_state": "PRODUCE",
    "coverage_state": "PRODUCE | INHERIT",
    "reconstruction_state": "PRODUCE | INHERIT",
    "canonical_topology": "PRODUCE | INHERIT",
    "signal_registry": "PRODUCE | INHERIT"
  },
  "dependency_table": [
    {
      "artifact": "<artifact filename>",
      "source_run_id": "<prior run_id>",
      "dependency_type": "GOVERNED_RUN_INHERITANCE | HASH_INHERITED | STATIC_REFERENCE | FRESHLY_PRODUCED",
      "source_path": "<full path to source artifact>",
      "hash_equality_confirmed": false,
      "freshness_in_source_run": "FRESH | STATIC",
      "classification": "FRESH | INHERITED-GOVERNED | STATIC"
    }
  ],
  "freshness_classification": {
    "gauge_state": "FRESH | INHERITED-GOVERNED | STATIC",
    "coverage_state": "FRESH | INHERITED-GOVERNED | STATIC",
    "reconstruction_state": "FRESH | INHERITED-GOVERNED | STATIC",
    "canonical_topology": "FRESH | INHERITED-GOVERNED | STATIC",
    "signal_registry": "FRESH | INHERITED-GOVERNED | STATIC"
  },
  "bootstrap_validity": {
    "AC-01_intake_record_present": "PASS",
    "AC-02_run_id_declared": "PASS",
    "AC-03_client_uuid_declared": "PASS",
    "AC-04_source_version_declared": "PASS",
    "AC-05_stage_participation_declared": "PASS",
    "AC-06_coverage_map_complete": "PASS",
    "AC-07_dependency_table_complete": "PASS",
    "AC-08_freshness_classification_complete": "PASS",
    "AC-09_no_silent_inheritance": "PASS",
    "AC-10_no_prohibited_patterns": "PASS",
    "bootstrap_admissibility_verdict": "VALID"
  }
}
```

### 3.3 Prohibited Bootstrap Patterns

| pattern | code |
|---------|------|
| run_id copied from prior run | PB-01 |
| Any artifact from any prior run placed in current run package without dependency table entry | PB-02 |
| `run_end_to_end.py` or equivalent script copying artifacts from reference package without declaration | PB-03 |
| Two or more of the five artifacts carry different `run_id` values with no coherence record | PB-04 |
| Produced artifact carries no `run_id` field | PB-05 |
| `hash_equality_confirmed: true` without `hash_value` | PB-06 |
| `intake_record.json` written after any downstream artifact emission | PB-07 |

Any run exhibiting PB-01 through PB-07 fails BA-06 and cannot be declared GOVERNED AND FRESH THROUGH S4.

---

## SECTION 4 — S1 STAGE EXECUTION: COVERAGE AND RECONSTRUCTION

### 4.1 Stage Authority

S1 coverage and reconstruction are governed by PSEE-RUNTIME.5A and PSEE-RUNTIME.6A respectively. Authorized scripts: `scripts/pios/runtime/compute_coverage.sh` and `scripts/pios/runtime/compute_reconstruction.sh`.

### 4.2 compute_coverage.sh (PSEE-RUNTIME.5A)

**Command:**
```bash
bash scripts/pios/runtime/compute_coverage.sh \
  <psee_runtime_dir> \
  <ig_runtime_dir>
```

**Argument definitions:**
- `<psee_runtime_dir>`: path to the run's package directory (e.g., `clients/blueedge/psee/runs/<run_id>/package`)
- `<ig_runtime_dir>`: path to the IG runtime directory for the source intake (e.g., `docs/pios/IG.RUNTIME/run_01`)

**Required inputs (READ-ONLY from `<ig_runtime_dir>`):**
- `evidence_boundary.json`
- `admissibility_log.json`
- `normalized_intake_structure/layer_index.json`
- `source_manifest.json`

**Required inputs (READ from `<psee_runtime_dir>`):**
- `engine_state.json` — must be present before script execution; carries `run_id`, `client_id`, admitted source units
- `gauge_inputs.json` — must be present before script execution; script updates DIM-01 fields

**Outputs written to `<psee_runtime_dir>`:**
- `coverage_state.json` — PSEE-RUNTIME.5A output; carries `run_id`, `coverage_percent`, `state`, `required_units`, `admissible_units`
- `gauge_inputs.json` — DIM-01 fields updated; `DIM-01.value` and `DIM-01.state_label` set

**Exit codes:**
- `0` = COMPUTATION_COMPLETE
- `1` = FAIL_SAFE_STOP

**Fail-safe guard:** Forbidden paths checked before execution. The following prefixes are forbidden as either argument:
- `docs/pios/PSEE.3`, `docs/pios/PSEE.3B`, `docs/pios/IG.5`, `docs/pios/IG.6`, `docs/pios/IG.7`

**Coverage formula:**
```
coverage_percent = (admissible_units / required_units) * 100
```

**Precondition:** `engine_state.json` and `gauge_inputs.json` must exist in `<psee_runtime_dir>` before execution.

### 4.3 compute_reconstruction.sh (PSEE-RUNTIME.6A)

**Command:**
```bash
bash scripts/pios/runtime/compute_reconstruction.sh \
  <psee_runtime_dir> \
  <ig_runtime_dir>
```

**Arguments:** Same structure as compute_coverage.sh.

**Required inputs (READ-ONLY from `<ig_runtime_dir>`):**
- `evidence_boundary.json`
- `admissibility_log.json`
- `normalized_intake_structure/layer_index.json`
- `normalized_intake_structure/provenance_chain.json`
- `normalized_intake_structure/source_profile.json`

**Required inputs (READ from `<psee_runtime_dir>`):**
- `coverage_state.json` — must exist; `state` must equal `"COMPUTED"` (DIM-01 precondition)
- `engine_state.json`
- `gauge_inputs.json`

**DIM-01 precondition:** `coverage_state.json.state` must equal `"COMPUTED"`. If the precondition fails, the script fails with FAIL_SAFE_STOP. `compute_coverage.sh` must complete successfully before `compute_reconstruction.sh` is invoked.

**Outputs written to `<psee_runtime_dir>`:**
- `reconstruction_state.json` — PSEE-RUNTIME.6A output; carries `run_id`, `state`, `validated_units`, `total_units`, `axis_results`, `violations`
- `gauge_inputs.json` — DIM-02 `state_label` updated

**Reconstruction evaluation axes (all four must PASS for `state = "PASS"`):**
1. `COMPLETENESS` — all required units present, no orphan references
2. `STRUCTURAL_LINK` — all units connected, no isolated nodes
3. `REFERENTIAL_INTEGRITY` — all references resolve, no dangling
4. `LAYER_CONSISTENCY` — cross-layer relationships valid

**Exit codes:**
- `0` = VALIDATION_COMPLETE
- `1` = FAIL_SAFE_STOP

**S1 Execution Order:** PSEE-RUNTIME.5A must complete (exit 0) before PSEE-RUNTIME.6A is invoked.

### 4.4 S1 Input Directory for blueedge

For the blueedge client:
- `<psee_runtime_dir>` = `clients/blueedge/psee/runs/<run_id>/package`
- `<ig_runtime_dir>` = `docs/pios/IG.RUNTIME/run_01`

Required prerequisite files in `<psee_runtime_dir>` before S1 execution:
- `engine_state.json` — must be authored for the current `run_id` before invoking compute_coverage.sh
- `gauge_inputs.json` — template with DIM-01 value null; updated by compute_coverage.sh

### 4.5 S1 Freshness Classification

Coverage and reconstruction artifacts produced by compute_coverage.sh and compute_reconstruction.sh in the current run are classified **FRESH** (FRESH-R1: emitted by the current chain execution).

Coverage and reconstruction artifacts copied from a prior run's package (even if from a FRESH governed run) are classified **INHERITED-GOVERNED** and must carry a dependency table entry in `intake_record.json` declaring `source_run_id` and `freshness_in_source_run`.

---

## SECTION 5 — S2 STAGE EXECUTION: CANONICAL TOPOLOGY EMISSION

### 5.1 Stage Authority

S2 canonical topology emission is governed by STRUCTURAL.TRUTH.AUTHORITY.01. Authorized script: `scripts/psee/emit_canonical_topology.py`. Source of truth: `scripts/pios/41.1/build_semantic_layer.py` (PIOS-41.1-RUN01-CONTRACT-v1) — embedded DOMAINS (17), CAPABILITIES (42), COMPONENTS (89).

### 5.2 emit_canonical_topology.py

**Command:**
```bash
python3 scripts/psee/emit_canonical_topology.py \
  --output-path clients/<client_uuid>/psee/runs/<run_id>/package/canonical_topology.json \
  --run-id <run_id>
```

**Arguments:**
- `--output-path` (required): full path to write `canonical_topology.json`
- `--run-id` (required): the governed `run_id` for this emission

**Source loaded:**
- `scripts/pios/41.1/build_semantic_layer.py` — loaded via `importlib.util.spec_from_file_location`
- DOMAINS, CAPABILITIES, COMPONENTS embedded dicts accessed from loaded module

**No-overwrite guard:** If the output path already exists, the script fails closed (exit 1). This prevents silent overwrite.

**Parity validation (pre-write):**
- 17 domains exact
- 42 capabilities exact
- 89 components exact
- 148 total_nodes (17 + 42 + 89) exact
- Any count mismatch → FAIL-CLOSED (exit 1)

**Output artifact fields (required in `canonical_topology.json`):**
- `artifact_id`: `"41X-CANONICAL-TOPOLOGY-JSON"`
- `schema_version`: `"1.0"`
- `emission_run_id`: the value passed to `--run-id`
- `emission_stream`: `"PSEE.FRESH.S2.S3.EMISSION.01"`
- `source_authority.run_reference`: `mod.RUN_REFERENCE` from build_semantic_layer.py
- `counts.domains`: 17
- `counts.capabilities`: 42
- `counts.components`: 89
- `counts.total_nodes`: 148
- `determinism_hash`: SHA-256 of sorted `{"domain_ids": [...], "cap_ids": [...], "comp_ids": [...]}` JSON
- `domains`: 17 domain objects
- `capabilities`: 42 capability objects
- `components`: 89 component objects
- `edges.domain_capability`: 42 edges (domain → capability)
- `edges.capability_component`: 89 edges (capability → component)

**Exit codes:**
- `0` = EMISSION_COMPLETE
- `1` = FAIL_CLOSED

**Known determinism:** For the blueedge baseline, `determinism_hash = ff729078bb57f713c4e548f123e42708` is the reproducible value derived from the embedded data.

### 5.3 S2 Freshness Classification

`canonical_topology.json` produced by `emit_canonical_topology.py` in the current run is classified **FRESH**. The artifact carries `emission_run_id` binding it to the current `run_id`.

Data provenance is traceable to `run_03_blueedge_derivation_validation` via `source_authority.run_reference` in `build_semantic_layer.py`. Data provenance ≠ producing run: the data was authored in run_03, but the artifact is freshly emitted (via script execution) in the current run.

---

## SECTION 6 — S3 STAGE EXECUTION: SIGNAL REGISTRY EMISSION

### 6.1 Stage Authority

S3 signal registry emission is governed by SEMANTIC.COMPUTATION.AUTHORITY.01. Authorized script: `scripts/pios/41.4/build_signals.py`. Source of truth: SIGNALS constant embedded in `build_signals.py` (PIOS-41.4-RUN01-CONTRACT-v1).

### 6.2 build_signals.py

**Command:**
```bash
python3 scripts/pios/41.4/build_signals.py \
  --output-dir clients/<client_uuid>/psee/runs/<run_id>/package
```

**Arguments:**
- `--output-dir` (required): directory for output files; defaults to `/tmp/pios_41.4_output` if omitted
- `--overwrite` (flag): overwrite existing files in output directory

**Source loaded:** SIGNALS constant embedded in `build_signals.py`. No S5 file reads are performed at runtime (confirmed: script does not open docs/pios/40.5/, 40.6/, 40.7/, or 41.2/ at execution time; those paths are evidence trail references in the embedded data, not runtime reads).

**Guard:** The script refuses to write to the canonical `docs/pios/41.4/` directory. Use `--output-dir` pointing to the run's package directory.

**Outputs written to `--output-dir`:**
- `signal_registry.json` — 5 signal entries; carries `run_reference` and `generated_date`
- `evidence_mapping_index.json` — auxiliary output; not consumed by GAUGE
- `executive_signal_report.md` — auxiliary output; not consumed by GAUGE

**Signal count:** 5 signals (invariant from embedded SIGNALS constant).

### 6.3 CC-2 Post-Correction Procedure

`build_signals.py` does not emit `runtime_required` on signal entries. This field is required by SEMANTIC.COMPUTATION.AUTHORITY.01 and S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3. The field must be added post-emission before the artifact is used in any coherence or admissibility evaluation.

**Correction procedure (Python):**

```python
import json

path = "clients/<client_uuid>/psee/runs/<run_id>/package/signal_registry.json"

with open(path, "r") as f:
    reg = json.load(f)

for sig in reg["signals"]:
    sig["runtime_required"] = False

reg["schema_correction"] = {
    "correction_id": "CC-2",
    "description": "runtime_required: false added to all signal entries",
    "applied_to_run": "<run_id>",
    "applied_in_stream": "<stream_id>",
    "authority": "SEMANTIC.COMPUTATION.AUTHORITY.01; S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3"
}

with open(path, "w") as f:
    json.dump(reg, f, indent=2)
```

**Validation after correction:** Read back `signal_registry.json` and confirm `runtime_required` is `false` on all 5 signal entries.

**CC-2 must be declared** in `coherence_record.json.violations` with `"status": "CORRECTED"` and `"blocking": false` after the correction is applied.

### 6.4 S3 Freshness Classification

`signal_registry.json` produced by `build_signals.py` (with CC-2 correction applied) in the current run is classified **FRESH**. Data provenance is traceable to `run_01_blueedge` via `run_reference` in the emitted artifact.

---

## SECTION 7 — S4 STAGE: GAUGE STATE COMPUTATION

### 7.1 Stage Authority

S4 gauge state computation is governed exclusively by GAUGE.STATE.COMPUTATION.CONTRACT.01. The emitted artifact must carry `"computed_by": "GAUGE.STATE.COMPUTATION.CONTRACT.01"`. An artifact without this field is classified STATIC and fails GC-02.

### 7.2 Authorized Inputs

The computation reads exactly four input artifacts:
1. `package/coverage_state.json`
2. `package/reconstruction_state.json`
3. `package/canonical_topology.json`
4. `package/signal_registry.json`

No other inputs are authorized. Reading any file not listed above constitutes PP-04 (computation using undeclared artifacts).

### 7.3 Terminal State Classification

Before score computation, classify terminal state from `coverage_state.json` and `reconstruction_state.json`:

| condition | terminal state | execution_status |
|-----------|---------------|-----------------|
| `coverage_state.state = "COMPUTED"` AND `coverage_percent ≥ 90` AND `reconstruction_state.state = "PASS"` | S-13 | `"COMPLETE"` |
| `coverage_state.state = "COMPUTED"` AND `coverage_percent < 90` AND `reconstruction_state.state ≠ "FAIL"` | S-T3 | `"PARTIAL"` |
| `reconstruction_state.state = "FAIL"` OR `violations` non-empty | S-T1 | `"STOPPED"` |
| `coverage_state.state ≠ "COMPUTED"` | S-T2 | `"ESCALATED"` |

The value `"PHASE_1_ACTIVE"` (observed in the STATIC baseline artifact) is an in-flight PSEE engine state. It must not appear in any freshly computed `gauge_state.json`.

### 7.4 Score Computation

Score formula (PSEE-GAUGE.0/gauge_score_model.md §G.2–G.3):

```
canonical_score = completion_points + coverage_points + reconstruction_points
```

**Completion points** (from terminal state lookup table):
- S-13 (COMPLETE) → 40 points
- S-T3 (PARTIAL) → per gauge_score_model.md §G.2 Component 1 table
- S-T1 (STOPPED) → canonical_score = 0 unconditionally (SA-04)
- S-T2 (ESCALATED) → canonical_score = completion_points only; coverage_points = 0; reconstruction_points = 0 (SA-05)

**Coverage points:**
```
coverage_points = round(coverage_percent × 0.35)
```
Python `round()` semantics (banker's rounding) apply. If `coverage_state.state ≠ "COMPUTED"`: coverage_points = 0.

**Reconstruction points:**
- `reconstruction_state.state = "PASS"` AND all `axis_results` = `"PASS"` AND `validated_units = total_units` → 25 points
- Partial PASS: per gauge_score_model.md §G.2 Component 3 weighted match formula
- If reconstruction not computed (state = PENDING): reconstruction_points = 0

**Band label** (derived from canonical_score):
- `canonical_score ≥ 80` → `"READY"`
- `canonical_score 40–79` → `"CONDITIONAL"`
- `canonical_score ≤ 39` → `"BLOCKED"`

**Required derivation string format:**
```
"<completion_points> + <coverage_points> + <reconstruction_points> = <canonical_score>"
```

### 7.5 DIM-01 through DIM-06 Derivation Rules

| dimension | source | derivation |
|-----------|--------|-----------|
| DIM-01 Coverage | `coverage_state.json` | Direct read: `coverage_percent`, `state`, `state_label`, `required_units`, `admissible_units`. Authority: `"PSEE-GAUGE.0 DP-5-02"` |
| DIM-02 Reconstruction | `reconstruction_state.json` | Direct read: `state`, `validated_units`, `total_units`, `axis_results`. Authority: `"PSEE-GAUGE.0 DP-6-03"` |
| DIM-03 Escalation Clearance | terminal state classification | S-13 → `value = 100`, `state_label = "CLEAR"` (invariant: S-13 unreachable with open escalations). Authority: `"PSEE-GAUGE.0 dimension_projection_model.md §DIM-03"` |
| DIM-04 Unknown-Space | terminal state classification | `us_records` not in authorized inputs → `total_count = 0`, `state_label = "NONE"`, caveat declared. Authority: `"PSEE-GAUGE.0 dimension_projection_model.md §DIM-04"` |
| DIM-05 Intake Completeness | terminal state classification | S-13 → `state = "COMPLETE"` (PSEE.1 INV-04: all files assigned when Phase 2 completes; Phase 2 must complete before S-13 reachable). Authority: `"PSEE-GAUGE.0 dimension_projection_model.md §DIM-05"` |
| DIM-06 Heuristic Compliance | terminal state classification | S-13 → `state = "PASS"` (PSEE engine cannot reach S-13 if STOP-HEURISTIC fired). Authority: `"PSEE-GAUGE.0 dimension_projection_model.md §DIM-06"` |

DIM-01 and DIM-02 are derived entirely from their respective primary inputs. DIM-03 through DIM-06 are derived from terminal state classification for the S-13 case (the current baseline terminal state). No field in any DIM is derived from `canonical_topology.json` or `signal_registry.json`. Deriving score components from topology or signal data is PP-05.

### 7.6 GC-01 through GC-10 Admissibility Conditions

`gauge_state.json` is valid for S4 consumption if all pass:

| code | condition | check |
|------|-----------|-------|
| GC-01 | run_id match | `gauge_state.json.run_id` equals `intake_record.json.run_id` |
| GC-02 | computed_by declared | `computed_by` = `"GAUGE.STATE.COMPUTATION.CONTRACT.01"` |
| GC-03 | No prior-run state embedding | `execution_status` is one of: COMPLETE, PARTIAL, ESCALATED, STOPPED, INDETERMINATE |
| GC-04 | Score derivation traceable | `score.derivation` present; sum of components matches `score.canonical` |
| GC-05 | All six dimensions present | `dimensions` contains DIM-01 through DIM-06 |
| GC-06 | Source files declared | `traceability.source_files` lists the four input artifact paths |
| GC-07 | Input run_ids recorded | `traceability.input_run_ids` populated for all four inputs |
| GC-08 | Score in valid range | `score.canonical` is integer in [0, 100] |
| GC-09 | Band label consistent | `score.band_label` matches `score.canonical` per band table |
| GC-10 | No prohibited patterns | None of PP-01 through PP-07 apply |

### 7.7 Traceability Requirements

`gauge_state.json` must carry:

```json
"traceability": {
  "source_files": [
    "clients/<client_uuid>/psee/runs/<run_id>/package/coverage_state.json",
    "clients/<client_uuid>/psee/runs/<run_id>/package/reconstruction_state.json",
    "clients/<client_uuid>/psee/runs/<run_id>/package/canonical_topology.json",
    "clients/<client_uuid>/psee/runs/<run_id>/package/signal_registry.json"
  ],
  "input_run_ids": {
    "coverage_state": "<run_id from coverage_state.json.run_id>",
    "reconstruction_state": "<run_id from reconstruction_state.json.run_id>",
    "canonical_topology": "<run_reference from canonical_topology.json.source_authority.run_reference>",
    "signal_registry": "<run_reference from signal_registry.json.run_reference>"
  },
  "authority_refs": [...]
}
```

If coverage_state and reconstruction_state carry a different `run_id` than the current chain (GOVERNED RUN-FAMILY case), the `traceability.input_run_ids` must record the actual values from each artifact's content. The `gauge_state.json.run_id` is always the current chain's `run_id`.

---

## SECTION 8 — COHERENCE RECORD

### 8.1 coherence_record.json

`coherence_record.json` is written after all four input artifacts are assembled and before `gauge_state.json` computation begins. It declares the governed relationship between all run identity values in the artifact set.

**Required location:** `clients/<client_uuid>/psee/runs/<run_id>/coherence_record.json`

### 8.2 Coherence Modes

**MODE A — SINGLE-RUN COHERENCE (target state):** All five artifacts carry run identity values equal to the current chain's `run_id`. `run_family` array contains exactly one entry.

Conditions for MODE A:
- MA-01: All four input artifacts carry run identity values equal to current `run_id`
- MA-02: `gauge_state.json` computed from these four in a single pass
- MA-03: No artifact produced by a prior chain execution (no STATIC)

**MODE B — GOVERNED RUN-FAMILY COHERENCE (permitted transitional state):** Artifacts carry different run identity values; all relationships declared in `run_family`.

Conditions for MODE B:
- MB-01: All run identity values declared in `run_family`
- MB-02: Each declared `run_id` corresponds to the same `client_uuid`
- MB-03: S2 inputs for each run documented
- MB-04: `coherence_mode` explicitly declared as `"MODE_B"`
- MB-05: No run identity value in the set is undeclared

**MODE B does not grant FRESH status.** An artifact set in MODE B may contain INHERITED-GOVERNED artifacts (from prior FRESH governed runs). COHERENT + all artifacts FRESH through governance chain = GOVERNED AND FRESH THROUGH S4.

### 8.3 coherence_record.json Required Structure

```json
{
  "coherence_record_id": "<unique identifier>",
  "client_uuid": "<client identifier>",
  "declared_at": "<ISO 8601 timestamp>",
  "governed_by": "S3.S4.RUN.COHERENCE.CONTRACT.01",
  "coherence_mode": "MODE_A | MODE_B",
  "consuming_run_id": "<current chain run_id>",
  "artifact_set": {
    "coverage_state": {
      "path": "<full path>",
      "run_id": "<value from artifact>",
      "classification": "FRESH | INHERITED-GOVERNED | STATIC",
      "source_run_id": "<if inherited: prior run_id>"
    },
    "reconstruction_state": { "<same structure>" },
    "canonical_topology": {
      "path": "<full path>",
      "run_id": "<from source_authority.run_reference>",
      "classification": "FRESH | INHERITED-GOVERNED | STATIC",
      "source_run_id": "<if inherited: prior run_id>"
    },
    "signal_registry": {
      "path": "<full path>",
      "run_id": "<from run_reference field>",
      "classification": "FRESH | INHERITED-GOVERNED | STATIC",
      "runtime_required_compliant": true,
      "source_run_id": "<if inherited: prior run_id>"
    },
    "gauge_state": {
      "path": "<full path>",
      "run_id": "<current run_id>",
      "classification": "FRESH",
      "computed_by": "GAUGE.STATE.COMPUTATION.CONTRACT.01"
    }
  },
  "run_family": [
    {
      "run_id": "<run identity value>",
      "artifact_roles": ["<artifact names produced by this run>"],
      "source_version": "<source version>",
      "hash_equality_with_consuming_run": true | false | null
    }
  ],
  "violations": [
    {
      "code": "CC-2",
      "artifact": "signal_registry.json",
      "description": "runtime_required field absent from build_signals.py output",
      "status": "CORRECTED",
      "correction": "runtime_required: false added to all signal entries post-emission",
      "blocking": false,
      "authority": "SEMANTIC.COMPUTATION.AUTHORITY.01; S3.S4.RUN.COHERENCE.CONTRACT.01 §2.3"
    }
  ],
  "coherence_verdict": "COHERENT",
  "coherence_mode_satisfied": true
}
```

### 8.4 CA-01 through CA-10 Admissibility Conditions

GAUGE may consume the artifact set if all pass:

| code | condition |
|------|-----------|
| CA-01 | `coherence_record.json` exists |
| CA-02 | `coherence_mode` = `"MODE_A"` or `"MODE_B"` |
| CA-03 | `artifact_set` contains all five artifacts |
| CA-04 | Every distinct run identity in the set appears in `run_family` |
| CA-05 | No PC-01 through PC-07 violations present |
| CA-06 | AL-01 through AL-09 all pass |
| CA-07 | CC-01 through CC-04 all pass |
| CA-08 | All `signal_registry.json` entries carry `runtime_required: false` |
| CA-09 | `coherence_record.json` consistent with `intake_record.json` |
| CA-10 | `gauge_state.json.computed_by` = `"GAUGE.STATE.COMPUTATION.CONTRACT.01"`; GC-01–GC-10 pass |

### 8.5 Alignment Rules (AL-01 through AL-09)

| code | rule |
|------|------|
| AL-01 | All artifacts bind to same `client_uuid` |
| AL-02 | No artifact carries a `client_id` differing from `intake_record.json.client_uuid` |
| AL-03 | All runs in `run_family` carry same `source_version` or declare version relationship |
| AL-04 | `canonical_topology.json` and `signal_registry.json` run references correspond to executions whose S2 inputs precede or are contemporaneous with coverage/reconstruction S2 inputs |
| AL-05 | `coverage_state.json.required_units` ≤ `canonical_topology.json.counts.components` |
| AL-06 | All signal `component_ids` in `signal_registry.json` are present in `canonical_topology.json` 89-component set |
| AL-07 | Every run identity value in the artifact set is declared in `run_family` |
| AL-08 | No superseded runs without declaration |
| AL-09 | All artifacts conform to declared `schema_version`; schema non-compliance declared in `violations` |

---

## SECTION 9 — ADMISSIBILITY CHAIN

### 9.1 Evaluation Order

The admissibility chain must be evaluated strictly in order. Each step is a gate for the next. A failure at any step blocks all downstream steps.

```
Step 1: BOOTSTRAP ADMISSIBILITY (FRESH.RUN.BOOTSTRAP.PROTOCOL.01)
  Conditions: AC-01 through AC-10
  Gate: bootstrap_admissibility_verdict = VALID

Step 2: COHERENCE ADMISSIBILITY (S3.S4.RUN.COHERENCE.CONTRACT.01)
  Conditions: CA-01 through CA-10
  Gate: coherence_verdict = COHERENT
  Prerequisite: Step 1 must pass (CA-09 requires bootstrap record)

Step 3: COMPUTATION ADMISSIBILITY (GAUGE.STATE.COMPUTATION.CONTRACT.01)
  Conditions: GC-01 through GC-10
  Gate: gauge_state.json valid for S4 consumption
  Prerequisite: Steps 1 and 2 must pass

Step 4: GAUGE CONSUMPTION ADMISSIBILITY (GAUGE.ADMISSIBLE.CONSUMPTION.01)
  Conditions: GA-01 through GA-12
  Gate: GAUGE consumption governed
  Prerequisite: Steps 1, 2, and 3 must pass
```

### 9.2 GA Consumption Layer

GA-01 through GA-12 are fully defined in **Section 11 — GA CONSUMPTION CONTRACT**, derived from GAUGE.ADMISSIBLE.CONSUMPTION.01 (AUTHORITATIVE — LOCKED).

The admissibility chain Step 4 requires all of GA-01 through GA-12 to pass. Section 11 defines the exact condition, check, artifact fields, failure mode, and rejection behavior for each. Four narrow consistency corrections are recorded in Section 11.3 (GA-04, GA-05, GA-06, GA-07) for the GOVERNED AND FRESH THROUGH S4 baseline.

### 9.2a CLI Surface for Admissibility Chain

The coherence declaration step is an executable CLI step, not a manual authoring requirement. The canonical CLI surface for the S0–S4 chain is:

| step | command | gate |
|------|---------|------|
| S0 ledger | `pios ledger create` | AC-02, AC-03, AC-04 |
| S0 bootstrap | `pios bootstrap` | AC-07 (engine_state + gauge_inputs) |
| S1 | `pios emit coverage` | AC-01 prerequisite for CA |
| S1 | `pios emit reconstruction` | DIM-01 precondition enforced |
| S2 | `pios emit topology` | SC-04 |
| S3 | `pios emit signals` | SC-05; CC-2 applied inline |
| S4 | `pios compute gauge` | GC-01–GC-10 |
| S3/S4 boundary | `pios declare coherence` | **CA-01** — gates all CA conditions |
| Validation | `pios validate freshness` | AC→CA→GC→SC chain |

`pios declare coherence` must be invoked after `pios compute gauge` and before `pios validate freshness`. It reads the complete governed artifact set, determines coherence_mode, and writes `coherence_record.json`.

### 9.3 EE_ Fail Conditions and Resolution

| fail condition | code | resolution |
|---------------|------|-----------|
| Artifact copied from prior run without hash equality | EE_COPIED_ARTIFACT | Execute S1 scripts for current run (coverage/reconstruction FRESH) OR declare INHERITED-GOVERNED with dependency table entry |
| Undeclared run mixing | EE_HIDDEN_STITCHING | Write `coherence_record.json` declaring all run_family members |
| No declared run identity | EE_UNDECLARED_RUN_IDENTITY | Write `intake_record.json` at S0 before artifact emission |
| Bootstrap protocol incomplete | EE_BOOTSTRAP_INCOMPLETE | Execute all stages with declared coverage; all five artifacts freshly produced or declared INHERITED-GOVERNED |
| `gauge_state.json` produced by copying | EE_GAUGE_STATE_NOT_COMPUTED | Compute `gauge_state.json` per GAUGE.STATE.COMPUTATION.CONTRACT.01; emit with `computed_by` field |
| Schema non-compliance | EE_SCHEMA_NON_COMPLIANCE | Apply CC-2 correction; declare in `coherence_record.json.violations` |

All EE_ fail conditions are resolved in the current baseline (run_06_blueedge_fresh_s2_s3).

### 9.4 SC-01 through SC-10 Success Criteria

| code | criterion | basis |
|------|-----------|-------|
| SC-01 | A fresh run exists: unique `run_id` declared; S0–S4 executed | `intake_record.json` present; all stages ACTIVE or INHERITED from FRESH governed run |
| SC-02 | `gauge_state.json` freshly computed | `computed_by` field present; `run_id` matches current chain |
| SC-03 | `coverage_state.json` and `reconstruction_state.json` fresh | Either FRESH in current run OR INHERITED-GOVERNED from a prior FRESH governed run |
| SC-04 | `canonical_topology.json` aligned | FRESH (emitted by `emit_canonical_topology.py`); counts 17/42/89/148 verified |
| SC-05 | `signal_registry.json` aligned | FRESH (emitted by `build_signals.py`); CC-2 correction applied; all entries carry `runtime_required: false` |
| SC-06 | S4 GAUGE consumption admissible | GA-01–GA-12 all pass (requires reading GAUGE.ADMISSIBLE.CONSUMPTION.01) |
| SC-07 | No copied baseline artifacts | No artifact is a byte-for-byte copy of a prior run artifact for a different `source_version` without declaration |
| SC-08 | No hidden run stitching | All run references either identical or declared in `coherence_record.json` `run_family` |
| SC-09 | No baseline contradiction | Fresh artifact set does not contradict GAUGE.PROVENANCE.PROOF.01 without traceable source change |
| SC-10 | Freshness validation report issued | FRESHNESS.VALIDATION.RUN.01 (or equivalent) executed; verdict issued |

---

## SECTION 10 — END-TO-END EXECUTION FLOW

### 10.1 Prerequisites Before Execution

1. `docs/governance/runtime/git_structure_contract.md` loaded and verified
2. Branch confirmed: `feature/computable-chain-to-gauge` (or as authorized)
3. Tags present: `gauge-provenance-proof-01`, `execution-enablement-v1`, `fresh-through-s4-v1`
4. Source: `scripts/pios/41.1/build_semantic_layer.py` present (PIOS-41.1-RUN01-CONTRACT-v1)
5. Source: `scripts/pios/41.4/build_signals.py` present (PIOS-41.4-RUN01-CONTRACT-v1)
6. Scripts: `scripts/pios/runtime/compute_coverage.sh`, `compute_reconstruction.sh` present
7. Script: `scripts/psee/emit_canonical_topology.py` present
8. IG runtime dir: `docs/pios/IG.RUNTIME/run_01` present with required files

### 10.2 Execution Sequence

**Step E-01 — Assign run_id and prepare run directory**
```bash
export RUN_ID="run_<sequence>_<descriptor>"
export CLIENT="blueedge"
export RUN_DIR="clients/${CLIENT}/psee/runs/${RUN_ID}"
mkdir -p "${RUN_DIR}/package"
```

**Step E-02 — Write engine_state.json and gauge_inputs.json (S0 prerequisites)**

Author `${RUN_DIR}/package/engine_state.json` for current `run_id` before S1 execution. Author `${RUN_DIR}/package/gauge_inputs.json` with DIM-01 template (null value; updated by compute_coverage.sh).

**Step E-03 — Write intake_record.json (S0)**

Write `${RUN_DIR}/intake_record.json` before any artifact emission. Include `run_id`, `client_uuid`, `source_version`, `declared_at`, `stage_participation`, `coverage`, `dependency_table`, and `freshness_classification` (null initial values for produced artifacts; classified for INHERITED artifacts).

**Step E-04 — Execute S1: Coverage computation (PSEE-RUNTIME.5A)**
```bash
bash scripts/pios/runtime/compute_coverage.sh \
  "${RUN_DIR}/package" \
  "docs/pios/IG.RUNTIME/run_01"
# Expected exit: 0 (COMPUTATION_COMPLETE)
# Artifacts: package/coverage_state.json, package/gauge_inputs.json (DIM-01 updated)
```

**Step E-05 — Execute S1: Reconstruction validation (PSEE-RUNTIME.6A)**
```bash
bash scripts/pios/runtime/compute_reconstruction.sh \
  "${RUN_DIR}/package" \
  "docs/pios/IG.RUNTIME/run_01"
# Precondition: coverage_state.json.state = "COMPUTED"
# Expected exit: 0 (VALIDATION_COMPLETE)
# Artifacts: package/reconstruction_state.json, package/gauge_inputs.json (DIM-02 updated)
```

**Step E-06 — Execute S2: Canonical topology emission**
```bash
python3 scripts/psee/emit_canonical_topology.py \
  --output-path "${RUN_DIR}/package/canonical_topology.json" \
  --run-id "${RUN_ID}"
# Expected exit: 0 (EMISSION_COMPLETE)
# Artifact: package/canonical_topology.json
# Validates: 17/42/89/148 parity before write
```

**Step E-07 — Execute S3: Signal registry emission**
```bash
python3 scripts/pios/41.4/build_signals.py \
  --output-dir "${RUN_DIR}/package"
# Expected exit: 0
# Artifacts: package/signal_registry.json, package/evidence_mapping_index.json, package/executive_signal_report.md
```

**Step E-08 — Apply CC-2 correction to signal_registry.json**

Apply the CC-2 post-correction procedure (Section 6.3): add `"runtime_required": false` to all 5 signal entries and add `schema_correction` metadata block. Verify correction.

**Step E-09 — Declare coherence_record.json**

```bash
python3 scripts/pios/pios.py declare coherence \
  --run-dir "${RUN_DIR}"
# Reads: all 5 package artifacts + intake_record.json
# Determines: coherence_mode (MODE_A or MODE_B)
# Writes: ${RUN_DIR}/coherence_record.json
# Required before validate freshness — gates CA-01
```

**Step E-10 — Compute gauge_state.json (S4)**

Compute `gauge_state.json` from the four authorized inputs per GAUGE.STATE.COMPUTATION.CONTRACT.01:
1. Read `coverage_state.json` and `reconstruction_state.json` → classify terminal state (Section 7.3)
2. Compute score components (Section 7.4)
3. Derive DIM-01 through DIM-06 (Section 7.5)
4. Emit `gauge_state.json` with `computed_by`, `run_id`, `traceability`, all six dimensions, score, projection, confidence

**Step E-11 — Update intake_record.json freshness_classification**

Update `freshness_classification` in `intake_record.json` to reflect final classification for each artifact (FRESH / INHERITED-GOVERNED). Ensure no null values remain.

**Step E-12 — Validate admissibility chain**

Evaluate in order:
1. AC-01 through AC-10 (bootstrap) → verify all PASS
2. CA-01 through CA-10 (coherence) → verify all PASS
3. GC-01 through GC-10 (computation) → verify all PASS
4. SC-01 through SC-10 (success criteria) → verify all PASS (SC-06 requires GA evaluation)

### 10.3 Artifact Handover Summary

| step | producer | artifact | consumed by |
|------|---------|---------|------------|
| E-04 | compute_coverage.sh | coverage_state.json | compute_reconstruction.sh (precondition); gauge_state computation (DIM-01) |
| E-05 | compute_reconstruction.sh | reconstruction_state.json | gauge_state computation (DIM-02) |
| E-06 | emit_canonical_topology.py | canonical_topology.json | coherence_record (lineage); gauge_state computation (traceability) |
| E-07+E-08 | build_signals.py + CC-2 | signal_registry.json | coherence_record (lineage); gauge_state computation (traceability) |
| E-10 | GAUGE.STATE.COMPUTATION.CONTRACT.01 | gauge_state.json | S4 GAUGE consumption (GA-01–GA-12) |

---

## APPENDIX A — ARTIFACT SCHEMA REFERENCE

### A.1 coverage_state.json Required Fields

```json
{
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.5A",
  "run_id": "<current run_id>",
  "dimension": "DIM-01",
  "coverage_percent": <float 0.0–100.0>,
  "state": "COMPUTED | NOT_COMPUTED",
  "state_label": "FULL | PARTIAL | NONE",
  "required_units": <integer>,
  "admissible_units": <integer>,
  "derivation": "coverage_percent = admissible_units / required_units * 100 = <...>"
}
```

### A.2 reconstruction_state.json Required Fields

```json
{
  "schema_version": "1.0",
  "stream": "PSEE-RUNTIME.6A",
  "run_id": "<current run_id>",
  "state": "PASS | PARTIAL | FAIL",
  "violations": [],
  "validated_units": <integer>,
  "total_units": <integer>,
  "axis_results": {
    "COMPLETENESS": "PASS | FAIL",
    "STRUCTURAL_LINK": "PASS | FAIL",
    "REFERENTIAL_INTEGRITY": "PASS | FAIL",
    "LAYER_CONSISTENCY": "PASS | FAIL"
  }
}
```

### A.3 canonical_topology.json Required Fields

```json
{
  "artifact_id": "41X-CANONICAL-TOPOLOGY-JSON",
  "schema_version": "1.0",
  "emission_date": "<YYYY-MM-DD>",
  "emission_run_id": "<current run_id>",
  "emission_stream": "<stream id>",
  "source_authority": {
    "script_path": "scripts/pios/41.1/build_semantic_layer.py",
    "run_reference": "<data lineage run_id>"
  },
  "counts": {
    "domains": 17,
    "capabilities": 42,
    "components": 89,
    "total_nodes": 148
  },
  "determinism_hash": "<sha256 hex of sorted domain/cap/comp id lists>",
  "domains": [...],
  "capabilities": [...],
  "components": [...],
  "edges": {
    "domain_capability": [...],
    "capability_component": [...]
  }
}
```

### A.4 signal_registry.json Required Fields (post CC-2 correction)

```json
{
  "run_reference": "<run_id of 41.4 build execution>",
  "generated_date": "<YYYY-MM-DD>",
  "total_signals": 5,
  "signals": [
    {
      "signal_id": "<SIG-xxx>",
      "runtime_required": false,
      "evidence_confidence": "<HIGH | MEDIUM | LOW>",
      "...": "..."
    }
  ],
  "schema_correction": {
    "correction_id": "CC-2",
    "description": "runtime_required: false added to all signal entries",
    "applied_to_run": "<run_id>",
    "authority": "SEMANTIC.COMPUTATION.AUTHORITY.01"
  }
}
```

### A.5 gauge_state.json Required Fields

```json
{
  "run_id": "<current run_id>",
  "client_id": "<client_uuid>",
  "schema_version": "1.0",
  "stream": "PSEE-GAUGE.0",
  "computed_by": "GAUGE.STATE.COMPUTATION.CONTRACT.01",
  "computation_stream": "<stream id>",
  "computed_at": "<ISO 8601 timestamp>",
  "state": {
    "execution_status": "COMPLETE | PARTIAL | ESCALATED | STOPPED | INDETERMINATE",
    "psee_engine_invoked": true,
    "execution_mode": "FULL"
  },
  "dimensions": {
    "DIM-01": { "coverage_percent": ..., "state": ..., "required_units": ..., "admissible_units": ..., "authority": "PSEE-GAUGE.0 DP-5-02" },
    "DIM-02": { "state": ..., "validated_units": ..., "total_units": ..., "axis_results": {...}, "authority": "PSEE-GAUGE.0 DP-6-03" },
    "DIM-03": { "value": ..., "state_label": ..., "authority": "PSEE-GAUGE.0 dimension_projection_model.md §DIM-03" },
    "DIM-04": { "total_count": ..., "state_label": ..., "authority": "PSEE-GAUGE.0 dimension_projection_model.md §DIM-04" },
    "DIM-05": { "state": ..., "authority": "PSEE-GAUGE.0 dimension_projection_model.md §DIM-05" },
    "DIM-06": { "state": ..., "authority": "PSEE-GAUGE.0 dimension_projection_model.md §DIM-06" }
  },
  "score": {
    "canonical": <integer 0–100>,
    "band_label": "READY | CONDITIONAL | BLOCKED",
    "derivation": "<n> + <n> + <n> = <n>",
    "components": {
      "completion_points": <integer>,
      "completion_basis": "<rule reference>",
      "coverage_points": <integer>,
      "coverage_basis": "round(coverage_percent × 0.35)",
      "reconstruction_points": <integer>,
      "reconstruction_basis": "<rule reference>"
    },
    "authority": "PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4"
  },
  "projection": { "value": ..., "rule": "PR-xx", "authority": "PSEE-GAUGE.0/projection_logic_spec.md §PR-xx" },
  "confidence": { "lower": ..., "upper": ..., "status": ..., "authority": "PSEE-GAUGE.0/confidence_and_variance_model.md §Total Variance Computation" },
  "traceability": {
    "source_files": ["<path>", "<path>", "<path>", "<path>"],
    "input_run_ids": {
      "coverage_state": "<run_id>",
      "reconstruction_state": "<run_id>",
      "canonical_topology": "<run_reference>",
      "signal_registry": "<run_reference>"
    },
    "authority_refs": [
      "PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4",
      "PSEE-GAUGE.0/dimension_projection_model.md §DIM-01..06",
      "PSEE-GAUGE.0/confidence_and_variance_model.md §Total Variance Computation",
      "PSEE-GAUGE.0/projection_logic_spec.md §PR-xx",
      "GAUGE.STATE.COMPUTATION.CONTRACT.01"
    ]
  }
}
```

---

## SECTION 11 — GA CONSUMPTION CONTRACT

Source authority: GAUGE.ADMISSIBLE.CONSUMPTION.01 (AUTHORITATIVE — LOCKED, 2026-04-14)
Scope: Stage 4 GAUGE consumption surface only — no S0–S4 execution contracts modified.

---

### 11.1 Consumption Surface Overview

**What GA consumes:**

| artifact | API surface | role |
|----------|------------|------|
| `gauge_state.json` | `/api/gauge` | Score, score band, component breakdown, completion posture |
| `coverage_state.json` | `/api/gauge` | Coverage proof dimensions and state |
| `reconstruction_state.json` | `/api/gauge` | Reconstruction proof dimensions and axis results |
| `canonical_topology.json` | `/api/topology` | Structural topology graph (domains, capabilities, components, edges) |
| `signal_registry.json` | `/api/signals` | Signal presence, `evidence_confidence` distribution, signal identifiers |

**What GA does not consume:**

All artifact classes in GAUGE.ADMISSIBLE.CONSUMPTION.01 §3 are forbidden. Specifically:

- Stage 0 source files (`clients/<uuid>/source/<version>/`)
- RHP artifacts (`source_manifest.json`, `evidence_boundary.json`, `admissibility_log.json`, `layer_index.json`, `source_profile.json`, `provenance_chain.json`)
- Stage 2 classification artifacts (40.2 — `evidence_classification_map.md`, `normalized_evidence_map.md`)
- Stage 2 reconstruction artifacts (40.3 — `entity_catalog.md`, `dependency_map.md`, `interface_map.md`, `program_execution_graph.md`)
- Stage 2 telemetry artifacts (40.4 — `telemetry_surface_definition.md`, `telemetry_dimension_catalog.md`, `telemetry_schema.md`)
- PIE vault artifacts (`docs/pios/41.2/`)
- Query catalog artifacts (`golden_query_catalog.md`, `query_signal_map.json`)
- Stage 5 computed signal outputs (40.5–40.11)
- Stage 6 binding artifacts (43.x), projection artifacts (44.x), ExecLens outputs (42.x)
- Undeclared package artifacts (any field or file not defined in an authorized package contract)
- Simulated execution artifacts (any `gauge_state.json` field synthesized without an upstream PSEE run)
- `semantic_consolidation_report.md`

**Closed artifact set:** Exactly the five artifacts listed above. No amendment is possible without modifying this contract.

**Closed field set:** Defined in Section 11.2. No field outside the defined set is treated as authoritative input for scoring, proof, or display.

**GAUGE stop boundary:** GAUGE stops at the end of Stage 4. It does not enter Stage 5 (signal computation), Stage 6 (binding, projection, ExecLens), or LENS. Absent Stage 5/6 computation is represented as NOT EVALUATED — this is correct structural proof reporting, not an error state.

---

### 11.2 Artifact Field Access Matrix

#### gauge_state.json — /api/gauge

| field path | status | consumer purpose | rejection if absent or invalid |
|-----------|--------|-----------------|-------------------------------|
| `score.canonical` | REQUIRED | Overall GAUGE score (integer 0–100) | G4_MISSING_ARTIFACT — score surface blocked |
| `score.band_label` | REQUIRED | Score band (READY / CONDITIONAL / BLOCKED) | G4_MISSING_ARTIFACT — score surface blocked |
| `score.components.completion_points` | REQUIRED | Completion component for breakdown display | G4_MISSING_ARTIFACT — component breakdown blocked |
| `score.components.coverage_points` | REQUIRED | Coverage component for breakdown display | G4_MISSING_ARTIFACT — component breakdown blocked |
| `score.components.reconstruction_points` | REQUIRED | Reconstruction component for breakdown display | G4_MISSING_ARTIFACT — component breakdown blocked |
| `state.execution_status` | REQUIRED | Completion posture; rendered as NOT EVALUATED if absent or in-flight | G4_SIMULATED_EXECUTION_STATE if value is an in-flight state (e.g., `PHASE_1_ACTIVE`) |
| `computed_by` | REQUIRED | GA-03 source authorization check | G4_SIMULATED_EXECUTION_STATE — /api/gauge blocked |
| `run_id` | REQUIRED | Run identity binding; GA-01–GA-05 chain | G4_CROSS_RUN_CONTAMINATION if mismatched |
| `traceability.input_run_ids` | REQUIRED | Declares cross-run sourcing in MODE B (GA-04, GA-05) | G4_CROSS_RUN_CONTAMINATION if absent in MODE B |
| Any field not listed above | FORBIDDEN | No undeclared field is treated as authoritative | G4_UNDECLARED_FIELD_AUTHORITATIVE |

GAUGE must not recompute any field from `gauge_state.json` at render time. `score.canonical` is read as declared — GAUGE does not re-derive it from `coverage_state.json` or `reconstruction_state.json`.

#### coverage_state.json — /api/gauge

| field path | status | consumer purpose | rejection if absent or invalid |
|-----------|--------|-----------------|-------------------------------|
| `coverage_percent` | REQUIRED | Coverage proof value (float 0.0–100.0) | G4_MISSING_ARTIFACT — coverage surface blocked |
| `state` | REQUIRED | Coverage state (COMPUTED / NOT_COMPUTED) | G4_MISSING_ARTIFACT — coverage surface blocked |
| `state_label` | REQUIRED | Human-readable state (FULL / PARTIAL / NONE) | G4_MISSING_ARTIFACT — coverage surface blocked |
| `required_units` | REQUIRED | Total required units count | G4_MISSING_ARTIFACT — coverage surface blocked |
| `admissible_units` | REQUIRED | Admitted units count | G4_MISSING_ARTIFACT — coverage surface blocked |
| `run_id` | REQUIRED | Run identity — verified for GA-04 | G4_CROSS_RUN_CONTAMINATION |
| Any field not listed above | FORBIDDEN | No undeclared field is treated as authoritative | G4_UNDECLARED_FIELD_AUTHORITATIVE |

GAUGE must not infer coverage for elements not declared in the artifact. GAUGE must not synthesize a coverage posture from topology data.

#### reconstruction_state.json — /api/gauge

| field path | status | consumer purpose | rejection if absent or invalid |
|-----------|--------|-----------------|-------------------------------|
| `state` | REQUIRED | Reconstruction state (PASS / PARTIAL / FAIL) | G4_MISSING_ARTIFACT — reconstruction surface blocked |
| `validated_units` | REQUIRED | Validated unit count | G4_MISSING_ARTIFACT — reconstruction surface blocked |
| `total_units` | REQUIRED | Total unit count | G4_MISSING_ARTIFACT — reconstruction surface blocked |
| `axis_results.COMPLETENESS` | REQUIRED | Completeness axis result | G4_MISSING_ARTIFACT — axis display blocked |
| `axis_results.STRUCTURAL_LINK` | REQUIRED | Structural link axis result | G4_MISSING_ARTIFACT — axis display blocked |
| `axis_results.REFERENTIAL_INTEGRITY` | REQUIRED | Referential integrity axis result | G4_MISSING_ARTIFACT — axis display blocked |
| `axis_results.LAYER_CONSISTENCY` | REQUIRED | Layer consistency axis result | G4_MISSING_ARTIFACT — axis display blocked |
| `run_id` | REQUIRED | Run identity — verified for GA-05 | G4_CROSS_RUN_CONTAMINATION |
| Any field not listed above | FORBIDDEN | No undeclared field is treated as authoritative | G4_UNDECLARED_FIELD_AUTHORITATIVE |

GAUGE must not infer reconstruction completeness from entity counts or topology. GAUGE must not synthesize a reconstruction posture from Stage 2 outputs.

#### canonical_topology.json — /api/topology

| field path | status | consumer purpose | rejection if absent or invalid |
|-----------|--------|-----------------|-------------------------------|
| `domains` | REQUIRED | Domain node set for topology graph rendering | G4_TOPOLOGY_NOT_CANONICAL — topology surface blocked |
| `capabilities` | REQUIRED | Capability node set for topology graph rendering | G4_TOPOLOGY_NOT_CANONICAL — topology surface blocked |
| `components` | REQUIRED | Component node set for topology graph rendering | G4_TOPOLOGY_NOT_CANONICAL — topology surface blocked |
| `counts.domains` | REQUIRED | Domain node count for display | G4_MISSING_ARTIFACT — count display blocked |
| `counts.capabilities` | REQUIRED | Capability node count for display | G4_MISSING_ARTIFACT — count display blocked |
| `counts.components` | REQUIRED | Component node count for display | G4_MISSING_ARTIFACT — count display blocked |
| `counts.total_nodes` | REQUIRED | Total node count for display | G4_MISSING_ARTIFACT — count display blocked |
| `edges.domain_capability` | REQUIRED | Domain-to-capability edges for graph rendering | G4_TOPOLOGY_NOT_CANONICAL — edge rendering blocked |
| `edges.capability_component` | REQUIRED | Capability-to-component edges for graph rendering | G4_TOPOLOGY_NOT_CANONICAL — edge rendering blocked |
| `emission_run_id` | REQUIRED | Run identity — verified for GA-06 | G4_TOPOLOGY_NOT_CANONICAL |
| Any field not listed above | FORBIDDEN | No undeclared field is treated as authoritative | G4_UNDECLARED_FIELD_AUTHORITATIVE |

GAUGE must not derive or re-emit topology from any source other than `canonical_topology.json`. GAUGE must not add, remove, or modify topology nodes at render time. Topology node counts must not be treated as a score input unless explicitly declared in `gauge_state.json`.

#### signal_registry.json — /api/signals

| field path | status | consumer purpose | rejection if absent or invalid |
|-----------|--------|-----------------|-------------------------------|
| `total_signals` | REQUIRED | Signal count display | G4_MISSING_ARTIFACT — signal surface blocked |
| `signals[*].signal_id` | REQUIRED | Signal identifier display | G4_MISSING_ARTIFACT — signal list blocked |
| `signals[*].title` | REQUIRED | Signal name display | G4_MISSING_ARTIFACT — signal list blocked |
| `signals[*].evidence_confidence` | REQUIRED | Confidence distribution display (HIGH / MEDIUM / LOW) | G4_MISSING_ARTIFACT — confidence display blocked |
| `signals[*].runtime_required` | REQUIRED for verification (not rendered as display value) | Verified as `false` for all entries (GA-10); any entry with absent or `true` value blocks signal surface | G4_RUNTIME_SIGNAL_IN_REGISTRY — signal surface blocked |
| `run_reference` | REQUIRED | Run identity — verified for GA-07 | G4_RUNTIME_SIGNAL_CONSUMED |
| Any field not listed above | FORBIDDEN | No undeclared field is treated as authoritative | G4_UNDECLARED_FIELD_AUTHORITATIVE |

GAUGE must not treat signal presence as a computed runtime signal value. GAUGE must not propagate signals across topology nodes. GAUGE must not simulate runtime signal values for entries with `runtime_required: false`.

---

### 11.3 GA-01 through GA-12 Conditions

**GA-01 — All 5 authorized artifacts exist**

| property | value |
|----------|-------|
| Canonical condition | All 5 authorized artifacts exist at their declared paths |
| Check | File system existence check for each of the 5 paths declared in `coherence_record.json.artifact_set.*.path` |
| Artifact fields | N/A — filesystem existence |
| Failure mode | `G4_MISSING_ARTIFACT` |
| Rejection | Full GAUGE consumption blocked; no surface (score, coverage, reconstruction, topology, signals) renders |

---

**GA-02 — Each artifact is non-empty**

| property | value |
|----------|-------|
| Canonical condition | Each artifact is non-empty and parseable |
| Check | Each file is parseable JSON with a non-empty root object |
| Artifact fields | N/A — file content integrity |
| Failure mode | `G4_MISSING_ARTIFACT` |
| Rejection | Full GAUGE consumption blocked |

---

**GA-03 — `gauge_state.json` sourced from authorized PSEE pipeline run**

| property | value |
|----------|-------|
| Canonical condition | `gauge_state.json` is sourced from an authorized PSEE pipeline package run |
| Check | `gauge_state.json.computed_by` = `"GAUGE.STATE.COMPUTATION.CONTRACT.01"` |
| Artifact fields | `gauge_state.json.computed_by` |
| Failure mode | `G4_SIMULATED_EXECUTION_STATE` |
| Rejection | `/api/gauge` blocked; score and proof surfaces must not render |

---

**GA-04 — `coverage_state.json` sourced from same authorized package run as `gauge_state.json`**

| property | value |
|----------|-------|
| Canonical condition | `coverage_state.json` is sourced from the same authorized package run as `gauge_state.json` |
| Check (MODE A) | `coverage_state.json.run_id` = `gauge_state.json.run_id` |
| Check (MODE B — narrow consistency correction) | `coverage_state.json.run_id` = `gauge_state.json.traceability.input_run_ids.coverage_state` AND that run_id is declared in `coherence_record.json.run_family`; MODE B is declared in `coherence_record.json.coherence_mode` |
| Artifact fields | `coverage_state.json.run_id`; `gauge_state.json.run_id`; `gauge_state.json.traceability.input_run_ids.coverage_state`; `coherence_record.json.coherence_mode`; `coherence_record.json.run_family` |
| Failure mode | `G4_CROSS_RUN_CONTAMINATION` |
| Rejection | `/api/gauge` blocked |

**Narrow consistency correction (NC-01):** GAUGE.ADMISSIBLE.CONSUMPTION.01 §8 GA-04 was authored against MODE A (single-run) state. Under GOVERNED AND FRESH THROUGH S4 (run_06, MODE B), `coverage_state.json.run_id` = `run_05_blueedge_fresh_emission` and `gauge_state.json.run_id` = `run_06_blueedge_fresh_s2_s3`. The MODE B check is the operative check for the current baseline. The MODE A check remains operative for any future single-run execution.

---

**GA-05 — `reconstruction_state.json` sourced from same authorized package run as `gauge_state.json`**

| property | value |
|----------|-------|
| Canonical condition | `reconstruction_state.json` is sourced from the same authorized package run as `gauge_state.json` |
| Check (MODE A) | `reconstruction_state.json.run_id` = `gauge_state.json.run_id` |
| Check (MODE B — narrow consistency correction) | `reconstruction_state.json.run_id` = `gauge_state.json.traceability.input_run_ids.reconstruction_state` AND that run_id is declared in `coherence_record.json.run_family`; MODE B is declared in `coherence_record.json.coherence_mode` |
| Artifact fields | `reconstruction_state.json.run_id`; `gauge_state.json.run_id`; `gauge_state.json.traceability.input_run_ids.reconstruction_state`; `coherence_record.json.coherence_mode`; `coherence_record.json.run_family` |
| Failure mode | `G4_CROSS_RUN_CONTAMINATION` |
| Rejection | `/api/gauge` blocked |

**Narrow consistency correction (NC-02):** Same basis as NC-01. For the current baseline: `reconstruction_state.json.run_id` = `run_05_blueedge_fresh_emission`; MODE B is operative.

---

**GA-06 — `canonical_topology.json` sourced from authorized emission run**

| property | value |
|----------|-------|
| Canonical condition | `canonical_topology.json` is sourced from an authorized emission run |
| Check (STATIC baseline, GAUGE.ADMISSIBLE.CONSUMPTION.01 §8 as written) | Artifact path = `docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json` |
| Check (GOVERNED AND FRESH baseline — narrow consistency correction) | `canonical_topology.json` resides at the path declared in `coherence_record.json.artifact_set.canonical_topology.path`; `canonical_topology.json.emission_run_id` (FRESH) or `canonical_topology.json.source_authority.run_reference` (STATIC) is declared in `coherence_record.json.run_family` |
| Artifact fields | `canonical_topology.json.emission_run_id`; `canonical_topology.json.source_authority.run_reference`; `coherence_record.json.artifact_set.canonical_topology.path`; `coherence_record.json.run_family` |
| Failure mode | `G4_TOPOLOGY_NOT_CANONICAL` |
| Rejection | `/api/topology` blocked; topology surface must return explicit unavailable state |

**Narrow consistency correction (NC-03):** GAUGE.ADMISSIBLE.CONSUMPTION.01 §8 GA-06 specifies the STATIC baseline path (`docs/psee/41X.CANONICAL.TOPOLOGY.JSON.EMISSION.01/canonical_topology.json`). Under GOVERNED AND FRESH THROUGH S4 (run_06), the artifact resides at `clients/blueedge/psee/runs/run_06_blueedge_fresh_s2_s3/package/canonical_topology.json` as declared in `coherence_record.json.artifact_set.canonical_topology.path`. The GOVERNED AND FRESH check is operative for the current baseline.

---

**GA-07 — `signal_registry.json` sourced from authorized emission run**

| property | value |
|----------|-------|
| Canonical condition | `signal_registry.json` is sourced from an authorized emission run |
| Check (STATIC baseline, GAUGE.ADMISSIBLE.CONSUMPTION.01 §8 as written) | Artifact path = `docs/pios/41.4/signal_registry.json` |
| Check (GOVERNED AND FRESH baseline — narrow consistency correction) | `signal_registry.json` resides at the path declared in `coherence_record.json.artifact_set.signal_registry.path`; `signal_registry.json.run_reference` is declared in `coherence_record.json.run_family` |
| Artifact fields | `signal_registry.json.run_reference`; `coherence_record.json.artifact_set.signal_registry.path`; `coherence_record.json.run_family` |
| Failure mode | `G4_RUNTIME_SIGNAL_CONSUMED` |
| Rejection | `/api/signals` blocked; signal surface must return explicit unavailable state |

**Narrow consistency correction (NC-04):** GAUGE.ADMISSIBLE.CONSUMPTION.01 §8 GA-07 specifies the STATIC baseline path (`docs/pios/41.4/signal_registry.json`). Under GOVERNED AND FRESH THROUGH S4 (run_06), the artifact resides at `clients/blueedge/psee/runs/run_06_blueedge_fresh_s2_s3/package/signal_registry.json` as declared in `coherence_record.json.artifact_set.signal_registry.path`. The GOVERNED AND FRESH check is operative for the current baseline.

---

**GA-08 — No forbidden artifact consumed by any GAUGE route**

| property | value |
|----------|-------|
| Canonical condition | No forbidden artifact from GAUGE.ADMISSIBLE.CONSUMPTION.01 §3 is consumed by any GAUGE route, component, or API handler |
| Check | All file reads by /api/gauge, /api/topology, /api/signals are limited to the 5 authorized artifacts declared in `coherence_record.json.artifact_set.*.path` |
| Artifact fields | All file paths accessed by each GAUGE handler — scanned against §3 forbidden class list |
| Failure mode | `G4_UNAUTHORIZED_ARTIFACT`; `G4_RHP_LEAKAGE`; `G4_RAW_S2_CONSUMED` |
| Rejection | The specific GAUGE surface where the violation is detected must not render; the violation does not block unaffected surfaces |

---

**GA-09 — Topology surface driven exclusively by `canonical_topology.json`**

| property | value |
|----------|-------|
| Canonical condition | The topology surface is driven exclusively by `canonical_topology.json` — no envelope-derived topology is present |
| Check | Every topology node, edge, and count rendered by /api/topology is derived only from `canonical_topology.json.domains`, `.capabilities`, `.components`, `.counts`, `.edges`; no topology data is sourced from package manifests, Stage 2 entity catalogs, or prior GAUGE state |
| Artifact fields | `canonical_topology.json.domains`; `.capabilities`; `.components`; `.counts`; `.edges` |
| Failure mode | `G4_TOPOLOGY_NOT_CANONICAL`; `G4_ENVELOPE_TOPOLOGY` |
| Rejection | Topology surface must not render; /api/topology must return explicit unavailable state |

---

**GA-10 — Signal surface driven exclusively by `signal_registry.json`, no runtime values**

| property | value |
|----------|-------|
| Canonical condition | The signal surface is driven exclusively by `signal_registry.json` — no runtime signal values are present |
| Check | All signal data rendered by /api/signals is derived from `signal_registry.json` only; all entries carry `runtime_required: false`; no entry carries a runtime-computed value; signal presence is displayed, not signal execution |
| Artifact fields | `signal_registry.json.signals[*].runtime_required`; `.signals[*].evidence_confidence`; `.total_signals`; `.signals[*].signal_id`; `.signals[*].title` |
| Failure mode | `G4_RUNTIME_SIGNAL_CONSUMED`; `G4_RUNTIME_SIGNAL_IN_REGISTRY` |
| Rejection | Signal surface must not render; /api/signals must return explicit unavailable state |

---

**GA-11 — GAUGE outputs remain within Stage 4 boundary**

| property | value |
|----------|-------|
| Canonical condition | GAUGE outputs remain within the Stage 4 boundary defined in GAUGE.ADMISSIBLE.CONSUMPTION.01 §5 |
| Check | Each output produced by each GAUGE surface corresponds to one of the 7 authorized output surfaces in §5.1; none of the prohibited outputs in §5.2 (diagnosis, narrative, condition activation, signal propagation, overlay projection, runtime intelligence, ExecLens query response, persona/executive interpretation, computed coverage from topology, simulated execution state) are present in any GAUGE route response |
| Artifact fields | Full response payloads of /api/gauge, /api/topology, /api/signals — validated against §5.2 prohibited output list |
| Failure mode | `G4_DIAGNOSIS_PRESENT`; `G4_LENS_BEHAVIOR_PRESENT`; `G4_QUERY_EXECUTION_PRESENT`; `G4_BACKFILL_PRESENT` |
| Rejection | The out-of-boundary output must not be produced; any GAUGE route that generates a prohibited output must be blocked entirely until the violation is removed |

---

**GA-12 — No diagnosis, narrative, condition, propagation, or LENS behavior in any GAUGE output**

| property | value |
|----------|-------|
| Canonical condition | No diagnosis, narrative, condition, propagation, or LENS behavior is present in any GAUGE output |
| Check | Full output payload of /api/gauge, /api/topology, /api/signals is free of: diagnosis content, condition activations, signal propagation across topology nodes, structural overlay projections, executive narratives, ExecLens query responses, signal-to-structure binding results, runtime intelligence of any kind (G5 governance rule) |
| Artifact fields | Full response payloads of all GAUGE API routes |
| Failure mode | `G4_LENS_BEHAVIOR_PRESENT`; `G4_DIAGNOSIS_PRESENT`; `G4_BINDING_ARTIFACT_CONSUMED` |
| Rejection | Full GAUGE output surface is blocked until violation is removed; partial GAUGE output with LENS content present is not permitted |

---

### 11.4 Query Lock Rules

Source authority: GAUGE.ADMISSIBLE.CONSUMPTION.01 §7.

**Two distinct states (must not be conflated):**

| state | definition |
|-------|-----------|
| Query potential | A declared query exists in the query catalog (Stage 3 — 41.5) and is represented as structurally available |
| Query execution | A query is executed against live or computed data and a response is produced |

GAUGE surfaces query potential. GAUGE does not perform query execution.

**Field-level read boundaries:**

| artifact | fields readable for query potential display | forbidden query use |
|----------|---------------------------------------------|---------------------|
| `canonical_topology.json` | `domains`, `capabilities`, `components`, `edges` — for structural navigation display only | Must not be queried to produce structural analysis responses |
| `signal_registry.json` | `signals[*].signal_id`, `signals[*].title` — for signal list display only | Must not be used to derive signal execution results or confidence computations |
| `gauge_state.json` | `score.*`, `state.*` — for proof posture display only | Must not be used to derive completion status for query gate unlock |
| All other fields | Not queryable — not treated as query input | `G4_UNDECLARED_FIELD_AUTHORITATIVE` if used as query input |

**Execution gate rules (no exceptions):**

| gate type | unlock condition | GAUGE behavior |
|-----------|-----------------|----------------|
| Structural query gate | Access key gate (defined externally — not by GAUGE) | GAUGE represents gate state as LOCKED; does not bypass |
| Execution query gate | Terminal execution state — Stage 5 (40.5) must complete | GAUGE represents gate state as LOCKED until S5 complete; does not simulate S5 |

GAUGE must not auto-execute any query at render time. GAUGE must not auto-unlock any gate based on consumed artifact state. GAUGE must not derive query responses from topology nodes, signal entries, or package artifacts.

---

### 11.5 Failure and Rejection Behavior

Source authority: GAUGE.ADMISSIBLE.CONSUMPTION.01 §9, §10, §11.

**Rejection codes (complete list from §9):**

| code | condition |
|------|-----------|
| `G4_MISSING_ARTIFACT` | Any of the 5 authorized artifacts absent from declared path |
| `G4_UNAUTHORIZED_ARTIFACT` | GAUGE consumes any artifact not declared in §2 |
| `G4_RHP_LEAKAGE` | GAUGE consumes any RHP artifact |
| `G4_RAW_S2_CONSUMED` | GAUGE consumes a Stage 2 artifact directly |
| `G4_RUNTIME_SIGNAL_CONSUMED` | GAUGE consumes any 40.5 signal output or treats a registry entry as live runtime value |
| `G4_QUERY_EXECUTION_PRESENT` | GAUGE executes a query or produces a query response |
| `G4_DIAGNOSIS_PRESENT` | GAUGE output includes diagnosis content, condition activations, or intelligence narratives |
| `G4_TOPOLOGY_NOT_CANONICAL` | Topology surface not driven by `canonical_topology.json` |
| `G4_ENVELOPE_TOPOLOGY` | Topology derived from envelope artifacts or non-canonical source |
| `G4_RUNTIME_SIGNAL_IN_REGISTRY` | `signal_registry.json` entries carry runtime-computed values rendered as live observations |
| `G4_UNDECLARED_FIELD_AUTHORITATIVE` | GAUGE treats an undeclared field as authoritative input for scoring, proof, or display |
| `G4_CROSS_RUN_CONTAMINATION` | GAUGE consumes artifacts from undeclared cross-run sourcing |
| `G4_SIMULATED_EXECUTION_STATE` | `gauge_state.json` contains fields synthesized without authorized PSEE pipeline run |
| `G4_HIDDEN_TRANSFORMATION` | GAUGE applies undeclared transformation to a consumed artifact before rendering |
| `G4_BINDING_ARTIFACT_CONSUMED` | GAUGE consumes any 43.x binding artifact |
| `G4_LENS_BEHAVIOR_PRESENT` | GAUGE produces any LENS-layer output |
| `G4_BACKFILL_PRESENT` | GAUGE infers or synthesizes a value for an absent upstream field |

**Rejection behavior rules (no exceptions):**

1. **No partial consumption.** If GA-01 (artifacts exist) or GA-02 (non-empty) fails, full GAUGE consumption is blocked. No surface renders.
2. **No silent degradation.** Absence of upstream computation (e.g., completion component absent because Stage 5 has not run) must be rendered explicitly as NOT EVALUATED. The incompleteness is correct structural truth.
3. **No best-effort mode.** GAUGE must not infer, estimate, or synthesize values for absent fields. Setting absent fields to zero to render a complete score is prohibited.
4. **No compensation for upstream incompleteness.** If an upstream computation has not been performed, GAUGE represents this as explicitly absent or unavailable — not as a fallback value.
5. **Surface-specific rejection.** Violations of GA-08 through GA-10 reject the specific surface where the violation is detected without blocking unaffected surfaces (e.g., a GA-09 topology violation blocks /api/topology but does not block /api/gauge). Violations of GA-01, GA-02, GA-03, GA-11, GA-12 block the full GAUGE output.
6. **Immutability.** GAUGE must not write, patch, or overwrite any consumed artifact. GAUGE must not enrich any artifact with derived fields, computed values, or annotations at render time.

---

### 11.6 Consumption Admissibility Verdict

Source authority: GAUGE.ADMISSIBLE.CONSUMPTION.01 §8.

**PASS condition:** GA-01 through GA-12 all satisfied.

**FAIL condition:** Any one of GA-01 through GA-12 fails.

**GAUGE consumption is not valid until PASS is confirmed.** A partial pass (some GA conditions satisfied) does not constitute a valid consumption state.

**Evaluation prerequisite:** The GA admissibility evaluation is the fourth and final step in the admissibility chain. It may only be evaluated after AC-01–AC-10 (bootstrap), CA-01–CA-10 (coherence), and GC-01–GC-10 (computation) all pass.

**For the current baseline (run_06_blueedge_fresh_s2_s3):**

| condition | evaluation basis |
|-----------|-----------------|
| GA-01 | All 5 artifacts present in `clients/blueedge/psee/runs/run_06_blueedge_fresh_s2_s3/package/` — satisfied |
| GA-02 | All 5 artifacts non-empty JSON — satisfied |
| GA-03 | `gauge_state.json.computed_by` = `"GAUGE.STATE.COMPUTATION.CONTRACT.01"` — satisfied |
| GA-04 | MODE B: `coverage_state.json.run_id` = `run_05_blueedge_fresh_emission` declared in `gauge_state.json.traceability.input_run_ids.coverage_state` and `coherence_record.json.run_family` — satisfied (NC-01) |
| GA-05 | MODE B: `reconstruction_state.json.run_id` = `run_05_blueedge_fresh_emission` declared in `gauge_state.json.traceability.input_run_ids.reconstruction_state` and `coherence_record.json.run_family` — satisfied (NC-02) |
| GA-06 | `canonical_topology.json` at path declared in `coherence_record.json.artifact_set.canonical_topology.path`; `emission_run_id` = `run_06_blueedge_fresh_s2_s3` declared in `run_family` — satisfied (NC-03) |
| GA-07 | `signal_registry.json` at path declared in `coherence_record.json.artifact_set.signal_registry.path`; `run_reference` = `run_01_blueedge` declared in `run_family` — satisfied (NC-04) |
| GA-08 | No forbidden artifact consumed — requires implementation verification |
| GA-09 | Topology surface must be driven by `canonical_topology.json` exclusively — requires implementation verification |
| GA-10 | All `signal_registry.json` entries carry `runtime_required: false` (CC-2 applied) — satisfied for artifact; runtime behavior requires implementation verification |
| GA-11 | GAUGE outputs must remain within Stage 4 boundary — requires implementation verification |
| GA-12 | No LENS behavior present — requires implementation verification |

GA-01 through GA-07 are evaluable from the artifact set. GA-08 through GA-12 require implementation-time verification (GAUGE route behavior, not artifact content).

---

## SECTION 12 — CLI IMPLEMENTATION CONTRACT

### 12.1 CLI Surface Overview

The PSEE runtime is operable through `scripts/pios/pios.py` — a thin Python CLI implementing the S0–S4 command surface. Every command is a direct wiring to an authoritative script or computation model. No logic is added beyond what Sections 3–9 of this specification define.

**Entrypoint:** `python3 scripts/pios/pios.py <COMMAND> <SUBCOMMAND> [args]`

**Implementation date:** 2026-04-14
**Implementation stream:** PRODUCTIZE.EXECUTABLE.RUNTIME.SURFACE.01

### 12.2 Command Binding Table

| command | stage | authority | delegates to |
|---------|-------|-----------|-------------|
| `pios ledger create` | S0 | FRESH.RUN.BOOTSTRAP.PROTOCOL.01 | Direct write — intake_record.json per Section 3.2 |
| `pios bootstrap` | S0 | FRESH.RUN.BOOTSTRAP.PROTOCOL.01 | Direct write — engine_state.json + gauge_inputs.json per Section 4.4 |
| `pios emit coverage` | S1 | PSEE-RUNTIME.5A | `scripts/pios/runtime/compute_coverage.sh <pkg_dir> <ig_dir>` |
| `pios emit reconstruction` | S1 | PSEE-RUNTIME.6A | `scripts/pios/runtime/compute_reconstruction.sh <pkg_dir> <ig_dir>` (enforces DIM-01 precondition) |
| `pios emit topology` | S2 | STRUCTURAL.TRUTH.AUTHORITY.01 | `scripts/psee/emit_canonical_topology.py --output-path <path> --run-id <run_id>` |
| `pios emit signals` | S3 | SEMANTIC.COMPUTATION.AUTHORITY.01 | `scripts/pios/41.4/build_signals.py --output-dir <dir>` + CC-2 correction (Section 6.3) |
| `pios compute gauge` | S4 | GAUGE.STATE.COMPUTATION.CONTRACT.01 | Direct implementation — Section 7 logic; GC-01–GC-10 self-check |
| `pios declare coherence` | S3/S4 boundary | S3.S4.RUN.COHERENCE.CONTRACT.01 | Direct implementation — Section 8 logic; reads all 5 artifacts; writes coherence_record.json; gates CA-01 |
| `pios validate freshness` | S0–S4 | Section 9 | Direct implementation — AC/CA/GC chain + SC-01–SC-10 evaluation |

`pios run` is NOT implemented. Section 10 defines an end-to-end execution flow as a reference sequence, not as an authorized thin orchestrator command.

### 12.3 Mandatory CLI Conventions

Every command and subcommand supports `--help` (argparse auto-generated with exact description, arguments, and authority reference). Every command supports `--debug` (enables DEBUG-level logging to stderr via Python `logging` module). No command writes to stdout except `pios validate freshness` (verdict output).

`pios declare coherence --debug` prints: command invoked, resolved run_dir, resolved artifact paths, extracted run identities, selected coherence mode, violations list, output path, final verdict/exit status.

### 12.4 Precondition Enforcement

| command | enforced precondition |
|---------|-----------------------|
| `pios bootstrap` | `intake_record.json` must exist (PB-07: bootstrap requires ledger first) |
| `pios emit coverage` | `engine_state.json` and `gauge_inputs.json` must exist in package dir |
| `pios emit reconstruction` | `coverage_state.json.state = "COMPUTED"` (DIM-01 precondition, Section 4.3) |
| `pios emit topology` | Output path must not exist (no-overwrite guard, Section 5.2) |
| `pios compute gauge` | All four input artifacts must exist; `gauge_state.json` must not exist (no-overwrite guard) |
| `pios declare coherence` | `intake_record.json` must exist; all 5 package artifacts must exist; `coherence_record.json` must not exist (no-overwrite guard); all run identity fields must be extractable |
| `pios ledger create` | `intake_record.json` must not exist at target path (run_id uniqueness — PB-01) |

### 12.4a pios declare coherence — Implementation Model

`pios declare coherence` implements the S3/S4 boundary coherence declaration directly per Section 8. The implementation:

1. Reads `intake_record.json` → consuming_run_id, client_uuid, source_version
2. Reads all five governed artifacts from the package directory (Section 2.1)
3. Extracts run identity per artifact per the locked field rules (Section 8.3):
   - coverage_state, reconstruction_state, gauge_state: `.run_id`
   - canonical_topology: `.source_authority.run_reference`
   - signal_registry: `.run_reference`
4. Determines coherence_mode: MODE_A if all artifact run identities equal consuming_run_id; MODE_B otherwise (Section 8.2)
5. Builds artifact_set entries, run_family (one entry per distinct run identity), violations (CC-2 declared as CORRECTED if all signals carry `runtime_required: false`; OPEN if any are missing the field)
6. Evaluates coherence_verdict: COHERENT if all CA conditions satisfied; NON_COHERENT otherwise; fails closed if NON_COHERENT
7. Writes `coherence_record.json` at `<run_dir>/coherence_record.json`

Exit code 0 on COHERENT declaration written. Exit code 1 on any failure or NON_COHERENT verdict.

### 12.5 pios compute gauge — Implementation Model

`pios compute gauge` implements S4 computation directly per Section 7. No external script exists (GAP-01 in GAUGE.PROVENANCE.PROOF.01). The implementation:

1. Reads four authorized inputs only (Section 7.2) — PP-04 guard enforced
2. Classifies terminal state from coverage and reconstruction per Section 7.3
3. Computes score components per Section 7.4 (completion + coverage + reconstruction)
4. Derives DIM-01 through DIM-06 per Section 7.5
5. Assembles gauge_state.json with `computed_by = "GAUGE.STATE.COMPUTATION.CONTRACT.01"`
6. Self-checks GC-01 through GC-10 before writing artifact — fails closed if any condition fails

### 12.6 pios validate freshness — Implementation Model

`pios validate freshness` implements the admissibility chain evaluation per Section 9.1:

- Step 1: AC-01–AC-10 (bootstrap) — reads intake_record.json
- Step 2: CA-01–CA-10 (coherence) — reads coherence_record.json; blocked if Step 1 fails
- Step 3: GC-01–GC-10 (computation) — reads gauge_state.json; blocked if Step 2 fails
- Step 4: SC-01–SC-10 — reads all five artifacts; SC-06 declared NOT_EVALUATED (requires implementation verification)

Verdict printed to stdout in labeled table format. Exit code 0 for all passes; exit code 1 if any admissibility step fails.

### 12.7 Files Created

| file | description |
|------|-------------|
| `scripts/pios/pios.py` | Thin CLI entrypoint — all 9 commands; argparse; subprocess wiring; direct S4 and coherence implementations |

**Files NOT created (out of scope):**
- No test scaffolding
- No configuration files
- No auxiliary scripts
- `pios run` — not implemented (Section 12.2 decision record)
