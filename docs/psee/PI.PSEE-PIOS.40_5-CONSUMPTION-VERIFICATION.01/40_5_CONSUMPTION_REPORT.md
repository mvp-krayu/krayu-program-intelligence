# 40.5 Consumption Verification Report

Stream: PI.PSEE-PIOS.40_5-CONSUMPTION-VERIFICATION.01  
Status: COMPLETE  
Generated: 2026-05-06  
Baseline commit: 93098cb  
Branch: feature/psee-pios-integration-productized  
Boundary contract: PI.PSEE-PIOS.40_4-HANDOFF-CONTRACT.CORRECTION.01 (2705bca)

---

## 1. Executive Verdict

The current 40.5 layer does not consume any PSEE artifacts.

`build_signal_artifacts.py` reads exclusively from `docs/pios/40.4/*.md`. No PSEE path — `canonical_topology.json`, `grounding_state_v3.json`, `binding_envelope.json` — is referenced, read, or checked.

The six existing `docs/pios/40.5/` artifacts are locked to `run_01_blueedge` (contract PIOS-40.5-RUN01-CONTRACT-v1) and derive from BlueEdge runtime telemetry (Prometheus-scraped metrics), not from generic structural telemetry. The `build_signal_artifacts.py` script functions as a passthrough regenerator: it loads existing 40.5 artifacts in Step 4 and writes them back unchanged. The static signal computation (SIG-002, SIG-004, SIG-001_structural) produces supplementary values but does not overwrite the existing artifact content.

`run_client_pipeline.py` does not call `build_signal_artifacts.py` at any point. Signal computation is explicitly noted as `STAGE_NOT_AUTOMATED` for the FastAPI conformance path (line 340), which uses pre-computed conformance artifacts instead.

The selector specification (`signal_selector_specification.md`) and PSIG candidate registry (`static_signal_expansion_registry.md`) exist as governance documents only. Neither is implemented. No `signal_selection.json` file exists anywhere in the repository.

---

## 2. 40.5 Entrypoints

Two scripts exist in `scripts/pios/40.5/`:

### A. `build_signal_artifacts.py`

- **Role:** Generic 40.5 artifact builder
- **Invocation:** Standalone — `python3 scripts/pios/40.5/build_signal_artifacts.py [--dry-run]`
- **Called by `run_client_pipeline.py`:** NO — confirmed by grep; no reference exists
- **Behavior:** 
  1. Verifies the 6 REQUIRED_INPUTS from `docs/pios/40.4/` exist
  2. Extracts ST-XXX values from `structural_telemetry.md` via regex
  3. Supplements with STATIC_TELEMETRY constants (hardcoded dict)
  4. Computes SIG-002, SIG-004, SIG-001_structural from static telemetry
  5. **Loads existing `docs/pios/40.5/` artifacts and writes them back** — passthrough, not fresh computation
  6. Reports written/6 count

### B. `validate_signal_artifacts.py`

- **Role:** Run-specific validator for `run_01_blueedge` only
- **Locked to:** `run_id: run_01_blueedge`, contract `PIOS-40.5-RUN01-CONTRACT-v1`
- **Artifact path:** `Path.home() / "Projects/krayu-program-intelligence"` — hardcoded to the OLD project directory, NOT `k-pi-core`
- **Checks:** 11 checks including VAR_ variable presence, DIM- references, SIG-006 computed value (0.333), boundary declarations
- **Called by `run_client_pipeline.py`:** NO

**Finding:** Neither 40.5 script is invoked by `run_client_pipeline.py`. Signal computation for the productized baseline uses pre-computed conformance artifacts loaded in Phase 5 (binding_envelope) and Phase 8 (signal_registry).

---

## 3. Required 40.4 Inputs

### Declared in `build_signal_artifacts.py` REQUIRED_INPUTS (6 files):

| File | Path |
|------|------|
| `telemetry_surface_definition.md` | `docs/pios/40.4/` |
| `telemetry_schema.md` | `docs/pios/40.4/` |
| `structural_telemetry.md` | `docs/pios/40.4/` |
| `activity_telemetry.md` | `docs/pios/40.4/` |
| `delivery_telemetry.md` | `docs/pios/40.4/` |
| `telemetry_traceability_map.md` | `docs/pios/40.4/` |

All 6 are present on current branch. (`docs/pios/40.4/` contains 18 files total.)

### Consumed by `run_01_blueedge` execution (declared in `signal_boundary_enforcement.md`):

| File | Path | Purpose |
|------|------|---------|
| `telemetry_dimension_catalog.md` | `docs/pios/40.4/` | DIM- dimension definitions |
| `temporal_telemetry_series.md` | `docs/pios/40.4/` | TMP- temporal anchor definitions |
| `entity_telemetry.md` | `docs/pios/40.4/` | entity telemetry coverage |
| `telemetry_surface_map.md` | `docs/pios/40.4/` | surface definitions |

**Note:** These four additional files are consumed by the run_01_blueedge execution (not by `build_signal_artifacts.py` directly) and are declared as inputs in `signal_boundary_enforcement.md`. They are NOT in `REQUIRED_INPUTS`.

### Also present in `docs/pios/40.4/` (not consumed by any 40.5 script):

`dependency_telemetry.md`, `domain_telemetry.md`, `interface_telemetry.md`, `static_telemetry_expansion_registry.md`, `structure_immutability_log.md`, `telemetry_dimension_catalog.md`, `telemetry_normalization_spec.md`, `telemetry_to_peg_mapping.md`, `telemetry_validation_log.md`

---

## 4. Actual Read Path Analysis

### Q3 — Does 40.5 read any PSEE paths?

| Path | Read by 40.5 | Evidence |
|------|-------------|---------|
| `docs/pios/40.4/*.md` | YES | `REQUIRED_INPUTS` in `build_signal_artifacts.py` line 30–37; `INPUT_40_4 = REPO_ROOT / "docs/pios/40.4"` |
| `clients/<client>/psee/runs/<run>/structure/40.4/canonical_topology.json` | NO | No reference anywhere in `scripts/pios/40.5/` |
| `clients/<client>/psee/runs/<run>/ceu/grounding_state_v3.json` | NO | No reference anywhere in `scripts/pios/40.5/` |
| `clients/<client>/psee/runs/<run>/binding/binding_envelope.json` | NO | No reference anywhere in `scripts/pios/40.5/` |
| Any other PSEE client path | NO | Confirmed by grep — no `clients/` reference in `scripts/pios/40.5/` |

**`build_signal_artifacts.py` reads from exactly one source directory:** `REPO_ROOT / "docs/pios/40.4"` (line 27). No other path is opened.

---

## 5. Signal Basis Analysis

### Q4 — What is the signal derivation basis?

**Path A — Static structural derivation (computed by `build_signal_artifacts.py`):**

| Signal | Formula | Input Source |
|--------|---------|-------------|
| SIG-002 (Dependency Load) | `(ST-012+ST-013+ST-014+ST-015) / ST-007` | STATIC_TELEMETRY dict + parsed `structural_telemetry.md` |
| SIG-004 (Structural Volatility) | `ST-010/ST-007`, `ST-011/ST-007`, `ST-006/ST-007`, `ST-009/ST-007` | STATIC_TELEMETRY dict + parsed `structural_telemetry.md` |
| SIG-001_structural | `ST-012 / ST-016` | STATIC_TELEMETRY dict |

STATIC_TELEMETRY constants are hardcoded in the script (lines 63–75). These are the productized FastAPI values. `extract_static_values()` parses `structural_telemetry.md` and supplements, but STATIC_TELEMETRY fills any gaps.

**Path B — BlueEdge runtime telemetry (pre-written artifacts, run_01_blueedge):**

The six existing `docs/pios/40.5/` artifacts are from `run_01_blueedge` using BlueEdge runtime telemetry:

| Signal | Input | Basis |
|--------|-------|-------|
| SIG-001 | VAR_SYS_001 / DIM-PR-001 | Live Prometheus scrape — `blueedge_process_heap_bytes` |
| SIG-002 | VAR_CACHE_001/002 / DIM-CP-001/002 | Live Prometheus scrape — cache hits/misses |
| SIG-003 | VAR_CACHE_003 / DIM-CP-003 | Live Prometheus scrape — cache connected state |
| SIG-004 | VAR_EVT_001 / DIM-ET-001 | Live Prometheus scrape — events total |
| SIG-005 | VAR_WS_001 / DIM-CS-001 | WebSocket connected client count |
| SIG-006 | VAR_DS_004 / DIM-PC-001/002 | Batch throughput rate — computed value: 0.333 |
| SIG-007 (ESI) | composite | PENDING runtime |
| SIG-008 (RAG) | composite | PENDING runtime |

These are BlueEdge-specific runtime measurements, not generic structural telemetry. They have no dependency on PSEE artifacts.

**`build_signal_artifacts.py` Step 4 passthrough behavior:** The script calls `load_existing_outputs()` which reads the pre-existing `docs/pios/40.5/` artifacts and writes them back unchanged. The SIG-002/004/001_structural static computations produce values but these do not overwrite the artifact content — the content passthrough dominates.

**No dynamic parsing of telemetry values occurs for signal computation.** The static derivation uses STATIC_TELEMETRY constants. AT/DT metrics from `load_40_4_intake.py` are used by the ESI derivation path (40.16 → run_esi_derivation.py), not by `build_signal_artifacts.py`.

---

## 6. Edge, Selector, and CEU Usage

### Q5 — Relational Edge Usage

**NO relational edges are used by any 40.5 script.**

`build_signal_artifacts.py` contains no reference to: `relational`, `OVERLAP_STRUCTURAL`, `binding_envelope`, `edge`, `REL-`, `fan_in`, `fan_out`, or any edge computation. Confirmed by source inspection (lines 1–244).

No edge-based signal derivation exists in the current 40.5 implementation.

### Q6 — Signal Selector Usage

**NO.** `signal_selection.json` does not exist anywhere in the repository (confirmed: `find` returns no results). `build_signal_artifacts.py` contains no reference to selector, signal_selection, or any filtering mechanism. The selector is not implemented.

`signal_selector_specification.md` exists in `docs/pios/40.5/` as a governance specification document (stream PI.SIGNAL-SPACE.EXPANSION.40X.02, branch `feature/next`, status: `SPECIFICATION — no execution authorized by this document`). It defines the selector model but authorizes no execution.

### Q7 — CEU Grounding Usage

**NO.** `build_signal_artifacts.py` contains no reference to: `grounding_state_v3`, `CEU`, `ceu`, `canonical_topology`, `cluster_count`, or any PSEE artifact. The script is structurally isolated to `docs/pios/40.4/`.

`run_client_pipeline.py` Phase 4 builds CEU grounding and Phase 5 builds binding_envelope. These are pipeline execution phases — they produce PSEE artifacts that 40.5 does not consume.

---

## 7. Fallback Behavior

### Q8 — What happens when PSEE artifacts are absent?

**40.5 never looks for PSEE artifacts.** There is no conditional check, no fallback clause, no PSEE-path branch. PSEE absence has zero effect on 40.5 execution.

`build_signal_artifacts.py` checks only for the 6 REQUIRED_INPUTS in `docs/pios/40.4/`. If those are present, execution proceeds regardless of PSEE state. If any is missing, execution fails immediately (`sys.exit(1)`, line 187).

**Behavior matrix:**

| Scenario | 40.5 Response |
|---------|--------------|
| PSEE artifacts absent | No effect — not checked |
| PSEE artifacts present | No effect — not read |
| `canonical_topology.json` cluster_count=0 | No effect — not checked |
| `grounding_state_v3.json` absent | No effect — not checked |
| Any of the 6 generic 40.4 markdown files absent | `sys.exit(1)` with explicit missing file report |

---

## 8. Current 40.5 Outputs

### From `build_signal_artifacts.py` (EXPECTED_OUTPUTS):

| File | Path | Contents |
|------|------|---------|
| `signal_input_matrix.md` | `docs/pios/40.5/` | BlueEdge VAR_ group declarations for run_01_blueedge (41 variables) |
| `signal_computation_specification.md` | `docs/pios/40.5/` | SIG-001..008 computation specifications for BlueEdge runtime telemetry |
| `signal_output_set.md` | `docs/pios/40.5/` | SIG-001..008 output schema; SIG-006 computed value 0.333; others PENDING runtime |
| `signal_traceability_map.md` | `docs/pios/40.5/` | SIG-001..008 traceability to BM- entity references via DIM- dimensions |
| `signal_validation_report.md` | `docs/pios/40.5/` | Validation results for run_01_blueedge |
| `signal_boundary_enforcement.md` | `docs/pios/40.5/` | Layer separation declaration; not-accessed declarations for 40.2/40.3 |

**Note:** `build_signal_artifacts.py` references `signal_validation_report.md`, but `validate_signal_artifacts.py` references `signal_validation_log.md`. Both files exist; they are distinct.

### Additional governance artifacts (not produced by `build_signal_artifacts.py`):

| File | Status |
|------|--------|
| `execution_manifest.md` | Final — run_01_blueedge |
| `signal_selector_specification.md` | SPECIFICATION ONLY — branch feature/next |
| `static_signal_expansion_index.md` | SPECIFICATION ONLY — branch feature/next |
| `static_signal_expansion_registry.md` | PROVISIONAL DESIGN ONLY — PSIG-001..008 candidates |
| `signal_validation_log.md` | Final — run_01_blueedge |

### Signal identifiers currently in 40.5:

- **CKR-canonical:** SIG-001, SIG-002, SIG-003, SIG-004, SIG-005, SIG-006, SIG-007 (ESI), SIG-008 (RAG)
- **Provisional candidates (not computed):** PSIG-001..PSIG-008 (defined in `static_signal_expansion_registry.md`, no execution authorized)
- **Static structural (supplementary):** SIG-002 (partial — structural version), SIG-004, SIG-001_structural (computed by `build_signal_artifacts.py` from ST values, but these values are not written into the existing artifact content via the passthrough pattern)

---

## 9. Gap to PSEE_HANDOFF

### Q10 — Exact consumption gap preventing PSEE_HANDOFF activation

The following gaps are identified from source code and artifact evidence. No solution is designed here.

**Gap 1 — No PSEE read path in `build_signal_artifacts.py`**

The script has no code to read from `clients/<client>/psee/runs/<run>/`. The `INPUT_40_4` constant (line 27) is the only input directory. No conditional branch exists to add PSEE paths when `canonical_topology.json` is present. A new input path and a mode-check pre-step would be required.

**Gap 2 — No canonical_topology.json adapter**

`canonical_topology.json` uses a cluster-based schema (`cluster_count`, `clusters[]`) incompatible with the ST-XXX metric schema. No adapter exists to extract PSEE topology quantities (CEU count, cluster count, relational edge count) as computable inputs for PSIG-XXX derivation. This is the schema bridge noted in `run_client_pipeline.py` line 787.

**Gap 3 — No grounding_state_v3.json consumption**

`grounding_state_v3.json` provides `grounding_ratio` and per-CEU `activation_class`. No 40.5 code reads this file or uses grounding_ratio as a signal input or gate condition.

**Gap 4 — No binding_envelope.json consumption**

`binding_envelope.json` provides CEU-to-node binding with `type: binding_context` nodes and `temporal_classification` edges. No 40.5 code reads this file or extracts topology quantities from it. The PSIG candidate registry (`static_signal_expansion_registry.md`) notes that 6 of 8 PSIG candidates are `INPUT_SUPPORTED` from `binding_envelope.json` — but no extraction code exists.

**Gap 5 — Selector not implemented**

`signal_selector_specification.md` defines the selector model but no `signal_selection.json` exists and no selector execution code exists in any 40.5 script. PSEE_HANDOFF would require selector-governed signal group selection to distinguish which PSIG signals to attempt per run.

**Gap 6 — PSIG computation not implemented**

PSIG-001..008 are defined as provisional candidates in `static_signal_expansion_registry.md` (design only, no execution authorized). No computation function for any PSIG signal exists in `build_signal_artifacts.py` or any other script. The `GOVERNED_SIGNALS` dict in `build_signal_artifacts.py` (lines 51–60) covers only SIG-001..008.

**Gap 7 — ST-030..035 not in STATIC_TELEMETRY**

`docs/pios/40.4/static_telemetry_expansion_registry.md` defines ST-030..035 as provisional telemetry fields (stream PI.STATIC-TELEMETRY.REGISTRATION.40X.03). These are the structural topology fields that PSIG derivation would require. None of ST-030..035 appear in `STATIC_TELEMETRY` constants in `build_signal_artifacts.py`. No extraction code for these fields exists.

**Gap 8 — Passthrough architecture**

`build_signal_artifacts.py` Step 4 loads existing artifacts and writes them back. Even if PSEE inputs were added and PSIG values were computed, the current architecture would overwrite the output files with pre-existing content. The write path must be restructured to inject PSIG outputs rather than regenerating existing content.

**Gap 9 — `run_client_pipeline.py` does not invoke 40.5**

Signal computation is `STAGE_NOT_AUTOMATED` for FastAPI conformance path. Integration of PSEE_HANDOFF into the pipeline would require a new phase or modification to Phase 5/8 that reads the PSEE artifacts and routes to PSIG computation.

---

## 10. Validation

PASS criteria:

- [x] Actual 40.5 consumption path proven from files — `build_signal_artifacts.py` source code confirms read path is exclusively `docs/pios/40.4/*.md`
- [x] No PSEE artifacts falsely claimed as consumed — confirmed absent from all 40.5 scripts
- [x] Selector usage explicitly denied — no `signal_selection.json` exists; selector spec is SPECIFICATION-only
- [x] CEU usage explicitly denied — no `grounding_state_v3.json` reference in any 40.5 script
- [x] Edge usage explicitly denied — no relational edge reference in any 40.5 script
- [x] No implementation performed — read-only inspection throughout
- [x] No artifacts outside this report written

Status: PASS

---

## Files Inspected

| File | Key Finding |
|------|-------------|
| `scripts/pios/40.5/build_signal_artifacts.py` | Sole build entrypoint; reads 6 docs/pios/40.4/*.md; STATIC_TELEMETRY hardcoded; passthrough Step 4 |
| `scripts/pios/40.5/validate_signal_artifacts.py` | Locked to run_01_blueedge; path hardcoded to krayu-program-intelligence; 11 checks |
| `scripts/pios/40.16/load_40_4_intake.py` | AT/DT extraction from activity/delivery telemetry; used by ESI derivation, not by build_signal_artifacts.py |
| `scripts/pios/run_client_pipeline.py` | No 40.5 script invocation; STAGE_NOT_AUTOMATED for signal computation |
| `docs/pios/40.5/signal_input_matrix.md` | run_01_blueedge; BlueEdge VAR_SYS/CACHE/EVT/WS variables; Prometheus-based |
| `docs/pios/40.5/signal_computation_specification.md` | run_01_blueedge; BlueEdge runtime telemetry signals |
| `docs/pios/40.5/signal_output_set.md` | SIG-001..008; SIG-006 computed 0.333; others PENDING runtime |
| `docs/pios/40.5/signal_traceability_map.md` | run_01_blueedge; BM- entity references |
| `docs/pios/40.5/signal_boundary_enforcement.md` | Input access audit; additional 40.4 files consumed by run_01_blueedge |
| `docs/pios/40.5/signal_selector_specification.md` | SPECIFICATION ONLY; feature/next; no execution authorized |
| `docs/pios/40.5/static_signal_expansion_registry.md` | PSIG-001..008 provisional candidates; design only; PSIG-001..006 INPUT_SUPPORTED from binding_envelope |
| `docs/pios/40.5/static_signal_expansion_index.md` | Key decisions; ST-030..035 registered but not in STATIC_TELEMETRY; group pressure_zone_default defined |
| `docs/pios/40.5/execution_manifest.md` | build_signal_artifacts.py noted as "stale — not updated for run_01_blueedge" |
| `docs/governance/runtime/git_structure_contract.md` | Branch domain ownership |
