# Execution Enablement Plan
# EXECUTION.ENABLEMENT.PLAN.01

- Date: 2026-04-14
- Status: ACTIVE — PLANNING ARTIFACT
- Authority basis: GAUGE.PROVENANCE.PROOF.01 (locked baseline)
- Gap basis: COMPUTABLE.CHAIN.TO.GAUGE.01 / executable_gap_register.md (GAP-01, GAP-05, GAP-10)
- Scope: STATIC → FRESH THROUGH S4 transition only

---

## SECTION 1 — PURPOSE

### 1.1 Transition Scope

This plan defines the exact work required to transition the GAUGE system from its current classification:

**GOVERNED WITH STATIC DEPENDENCY**

to:

**GOVERNED AND FRESH THROUGH S4**

The transition is scoped to Stages 0–4 only. It ends at the GAUGE stop boundary. No Stage 5, Stage 6, or LENS work is within scope.

**GOVERNED WITH STATIC DEPENDENCY** means: GAUGE consumes only authorized artifacts from authorized paths (governed), but all five consumed artifacts are pre-computed baselines from prior chain executions (static). The chain from a new intake to a fresh GAUGE proof surface cannot be executed without resolving the identified gaps.

**GOVERNED AND FRESH THROUGH S4** means: a new intake declaration, passed through the full S0→S4 chain, produces freshly computed artifacts that GAUGE consumes without relying on any copied or static baseline.

### 1.2 Explicit Exclusions

This plan does NOT:
- re-evaluate the correctness of any existing authority contract (BOOTSTRAP.CHAIN.AUTHORITY.01, IG.HANDOFF.AUTHORITY.01, STRUCTURAL.TRUTH.AUTHORITY.01, SEMANTIC.COMPUTATION.AUTHORITY.01, GAUGE.ADMISSIBLE.CONSUMPTION.01)
- re-evaluate the correctness of the existing GAUGE baseline (GAUGE.BASELINE.LOCK.01)
- address Stage 5 (PiOS Intelligence) or Stage 6 (LENS Projection) gaps
- modify the GAUGE UI or any product surface
- rewrite any locked authority contract

---

## SECTION 2 — STATIC VS FRESH DEFINITIONS

### 2.1 Formal Definitions

**STATIC artifact:**
An artifact that was produced by a prior chain execution and is consumed by GAUGE without being recomputed from the current intake's chain. A STATIC artifact may be correct but is not derived from the declared intake. It carries its own run_reference, emission timestamp, or generation date that does not correspond to the current run.

**FRESH artifact:**
An artifact that was produced by the current chain execution for the declared `client_uuid` and `source_version`. A FRESH artifact carries a `run_id` that is traceable to the current intake declaration. Its content is deterministically derived from the current intake's admitted evidence set.

### 2.2 Artifact-Level Classification Rules

| rule | description |
|------|-------------|
| FRESH-R1 | A FRESH artifact must carry a `run_id` or `run_reference` that matches the current chain execution |
| FRESH-R2 | A FRESH artifact must not be a byte-for-byte copy of a prior run's artifact for a different intake or run_id |
| FRESH-R3 | A FRESH artifact must be derivable from the current intake's admitted evidence set (via the governed chain) |
| FRESH-R4 | A FRESH artifact may inherit from a prior run only if the prior run used the same `source_version` and the artifact is provably identical (same hash) and the chain contract allows inheritance |
| STATIC-R1 | An artifact is STATIC if its `run_id` / `run_reference` / `emission_date` pre-dates the current chain execution |
| STATIC-R2 | An artifact that is copied from a reference package without computation is STATIC regardless of its content |

### 2.3 Allowed vs Prohibited Patterns

| pattern | classification | allowed |
|---------|---------------|---------|
| `gauge_state.json` freshly computed by `build_gauge_state.py` for current run | FRESH | YES |
| `gauge_state.json` copied from `run_01_authoritative` for a new intake | STATIC copy | NO — produces `G4_SIMULATED_EXECUTION_STATE` violation |
| `canonical_topology.json` produced by `build_semantic_layer.py` from current S2 outputs | FRESH | YES |
| `canonical_topology.json` from a prior dated run reused for a new intake with different structural outputs | STATIC reuse | NO — violates S3 PASS criteria |
| `canonical_topology.json` from a prior run reused for the same `source_version` where structural outputs are hash-identical | FRESH by inheritance (FRESH-R4) | YES — if hash equality is confirmed |
| Stitching artifacts from different runs with different `run_id` values without declaration | Hidden stitching | NO — produces `G4_CROSS_RUN_CONTAMINATION` |

---

## SECTION 3 — ARTIFACT FRESHNESS MATRIX

### 3.1 gauge_state.json

| property | value |
|----------|-------|
| Current state | STATIC — copied from `run_01_authoritative` (emission 2026-04-06) by `run_end_to_end.py` |
| Blocking gap | GAP-01: `build_gauge_state.py` does not exist |
| Required freshness condition | Must be computed by an authorized script (`build_gauge_state.py` or equivalent) consuming current-run `coverage_state.json` and `reconstruction_state.json` as inputs, applying the score model defined in `PSEE-GAUGE.0/gauge_score_model.md` |
| Acceptable inheritance rule | May inherit from a prior run ONLY if the prior run used the identical `source_version` AND the `coverage_state.json` and `reconstruction_state.json` for the current run produce hash-identical values to the prior run. Inheritance must be declared in the `run_id` and `traceability.source_files` fields. |
| Prohibited patterns | Byte-for-byte copy without declared hash equality; copying from a run with a different `source_version`; populating fields from topology or signal data not in the score model |

### 3.2 coverage_state.json

| property | value |
|----------|-------|
| Current state | STATIC — from `run_01_authoritative` (stream: PSEE-RUNTIME.5A) |
| Blocking gap | GAP-05: PSEE pipeline fresh-run bootstrap protocol missing |
| Required freshness condition | Must be emitted by the PSEE pipeline stage 06 (coverage computation) for the current run, consuming current S2 structural artifacts. Must carry `run_id` matching the current chain execution. |
| Acceptable inheritance rule | Same source_version + hash-identical S2 inputs: inheritance permitted with declaration. Different source_version: inheritance prohibited. |
| Prohibited patterns | Copying from reference package for a new source_version; populating `coverage_percent` from a prior run's values without recomputation |

### 3.3 reconstruction_state.json

| property | value |
|----------|-------|
| Current state | STATIC — from `run_01_authoritative` (stream: PSEE-RUNTIME.6A) |
| Blocking gap | GAP-05: same as coverage_state.json |
| Required freshness condition | Must be emitted by PSEE pipeline stage 06 (reconstruction validation) for the current run. Must carry `run_id` matching the current chain execution. All `axis_results` (COMPLETENESS, STRUCTURAL_LINK, REFERENTIAL_INTEGRITY, LAYER_CONSISTENCY) must be evaluated against current-run structural artifacts. |
| Acceptable inheritance rule | Same as coverage_state.json: hash-identical S2 inputs + same source_version only |
| Prohibited patterns | Same as coverage_state.json |

### 3.4 canonical_topology.json

| property | value |
|----------|-------|
| Current state | STATIC — produced by `build_semantic_layer.py` at `run_03_blueedge_derivation_validation` (emission 2026-04-13). The 41.1 sub-stage is EXECUTABLE (confirmed). |
| Blocking gap | No blocking gap for 41.1 itself; GAP-04 for non-BlueEdge clients (grouping engine); GAP-10 for new source reproducibility |
| Required freshness condition | Must be produced by an authorized 41.1 emission run for the current `source_version`. The `run_reference` in the artifact must correspond to a run consuming current S2 structural artifacts (`entity_catalog.md`, `dependency_map.md`, `interface_map.md`). Node counts must match current structural derivation. |
| Acceptable inheritance rule | If `entity_catalog.md` and related S2 artifacts are hash-identical to the prior run's inputs, the prior `canonical_topology.json` may be inherited with declaration. Hash equality of S2 inputs must be confirmed and recorded. |
| Prohibited patterns | Reusing a topology from a prior source_version where structural entity counts differ; reusing without confirming hash equality of S2 inputs |

### 3.5 signal_registry.json

| property | value |
|----------|-------|
| Current state | STATIC — generated 2026-03-20 at `run_01_blueedge`. Contains `trace_links` to S5 artifacts (forensic finding CC-1 in GAUGE.PROVENANCE.PROOF.01). Lacks `runtime_required` field per signal entry (CC-2). |
| Blocking gap | GAP-06: `build_signals.py` output is effectively frozen; GAP-03: no formal 40.5→41.4 input bundle contract |
| Required freshness condition | For S4 GAUGE freshness: must be produced by an authorized 41.4 script run consuming current S2 telemetry dimension catalog and current S3 topology. Entries must carry `runtime_required: false`. Must not reference S5 artifacts in `trace_links` unless those artifacts are freshly computed (which requires S5, out of scope for this plan). |
| Acceptable inheritance rule | If `telemetry_dimension_catalog.md` and S3 topology are hash-identical to prior run inputs, the prior `signal_registry.json` may be inherited with declaration and schema correction (add `runtime_required: false` per entry). |
| Prohibited patterns | Reusing a registry derived from S5 outputs for a new structural run; populating a registry with runtime-computed signal values; omitting `runtime_required` field from entries |
| Note | Full freshness for signal_registry.json requires resolving GAP-06. Schema compliance (CC-2) requires adding `runtime_required: false` to all entries as a minimum corrective action independent of freshness. |

---

## SECTION 4 — MINIMUM EXECUTION-ENABLEMENT CAPABILITIES

### EC-01 — Fresh-Run Declaration

**Purpose:** Define the mechanism by which a new chain execution is declared as distinct from prior runs. Without a fresh-run declaration, there is no authoritative `run_id` to bind the chain's artifacts.

**Required behavior:**
- Operator supplies a new `run_id` (unique within the system)
- `run_id` is bound to a `client_uuid` and `source_version`
- The declaration is recorded in `intake_record.json` (Stage 0) before any downstream stage begins
- All artifacts produced by the chain must carry this `run_id`

**Dependency:** BOOTSTRAP.CHAIN.AUTHORITY.01 §1 (intake declaration)

**Authorized by this plan:** yes — declarative only; no new implementation required beyond GAP-10 resolution

### EC-02 — Bootstrap Authority (GAP-10)

**Purpose:** Ensure the IG pipeline can execute end-to-end for a fresh intake (new `source_version` or new `client_uuid`) without manual intervention.

**Required behavior:**
- IG pipeline (S1) must execute successfully against a new evidence root
- RHP must be produced with AC-01 through AC-12 passing
- No manual artifact injection into the RHP

**Dependency:** IG.HANDOFF.AUTHORITY.01; GAP-10 resolution

**Gap to close:** GAP-10 — end-to-end IG pipeline test against a new source path; verify no manual steps required

### EC-03 — gauge_state.json Computation (GAP-01)

**Purpose:** Replace the static `gauge_state.json` copy mechanism with a computation that derives score, dimensions, and projection from current-run `coverage_state.json` and `reconstruction_state.json`.

**Required behavior:**
- An authorized script (`build_gauge_state.py`) accepts `coverage_state.json` and `reconstruction_state.json` as inputs
- It applies the scoring rules defined in `PSEE-GAUGE.0/gauge_score_model.md`
- It emits a `gauge_state.json` that carries the current `run_id` and reflects current artifact values
- Output must pass GA-03 (sourced from authorized PSEE run)

**Dependency:** EC-01 (run_id), EC-04 (coverage/reconstruction must be fresh first), `PSEE-GAUGE.0/gauge_score_model.md`

**Gap to close:** GAP-01 — implement `build_gauge_state.py`

### EC-04 — Coverage / Reconstruction Emission (GAP-05)

**Purpose:** Ensure PSEE pipeline stages 5A and 6A produce fresh `coverage_state.json` and `reconstruction_state.json` for a new intake without requiring a pre-existing reference package.

**Required behavior:**
- PSEE pipeline stages 5A and 6A execute from current S2 artifacts (entity catalog, reconstruction corpus)
- Output artifacts carry the current `run_id`
- The pipeline does not depend on the existence of a prior `run_01_authoritative` package
- A fresh bootstrap protocol is defined for clients without an existing reference package

**Dependency:** EC-02 (fresh S2 artifacts must exist), GAP-05 resolution

**Gap to close:** GAP-05 — define and implement fresh-run bootstrap protocol for PSEE pipeline

### EC-05 — S3/S4 Run Coherence (GAP-06 partial)

**Purpose:** Ensure that `canonical_topology.json` and `signal_registry.json` are coherent with the current S2 run — either freshly produced or provably hash-inherited.

**Required behavior:**
- `canonical_topology.json` must be produced from S2 artifacts of the current run (or hash-inherited per FRESH-R4)
- `signal_registry.json` must be produced from current S3 topology and current S2 telemetry dimension catalog (or hash-inherited)
- All signal entries must carry `runtime_required: false`
- The LAYERED multi-run situation in GAUGE.PROVENANCE.PROOF.01 must be resolved: all 5 artifacts must either share a single `run_id` or be declared as a governed run-family (Section 5)

**Dependency:** EC-02 (fresh S2), EC-04 (fresh S4 package), S3 authorized execution of 41.1 and 41.4

**Gap to close:** GAP-06 (wire `build_signals.py` to current S2 inputs; add `runtime_required: false`)

### EC-06 — Freshness Validation Method

**Purpose:** Define a machine-checkable validation step that confirms the five GAUGE-consumed artifacts satisfy FRESH criteria before GAUGE is declared GOVERNED AND FRESH THROUGH S4.

**Required behavior:**
- For each of the 5 consumed artifacts: confirm `run_id` / `run_reference` matches the declared current run OR inheritance is declared with hash equality proof
- Confirm no artifact is a byte-for-byte copy of a different-run baseline without hash equality declaration
- Confirm `signal_registry.json` entries carry `runtime_required: false`
- Output: a freshness validation report with PASS/FAIL per artifact and overall verdict

**Dependency:** EC-01 through EC-05 complete

**Gap to close:** New validation artifact (FRESHNESS.VALIDATION.RUN.01) — defined in Section 6

---

## SECTION 5 — RUN COHERENCE MODEL

### 5.1 SINGLE-RUN Coherence (Target State)

In SINGLE-RUN coherence, all five GAUGE-consumed artifacts share a single `run_id`:

```
run_id: <current_run>
  ├── gauge_state.json           run_id = <current_run>
  ├── coverage_state.json        run_id = <current_run>
  ├── reconstruction_state.json  run_id = <current_run>
  ├── canonical_topology.json    run_reference = <current_run>
  └── signal_registry.json       run_reference = <current_run>
```

This is the target state for GOVERNED AND FRESH THROUGH S4. It eliminates the LAYERED multi-run situation documented in GAUGE.PROVENANCE.PROOF.01.

### 5.2 GOVERNED RUN-FAMILY Coherence (Transitional Permitted State)

In GOVERNED RUN-FAMILY coherence, artifacts may carry different `run_id` values, provided:
1. All `run_id` values are registered in a declared run-family record
2. Each artifact's `run_id` corresponds to a chain execution against the same `source_version`
3. Hash equality between the S2 inputs consumed by each run is confirmed and recorded
4. The run-family record is referenced in each artifact's `run_reference` or `traceability` field

GOVERNED RUN-FAMILY is the minimum acceptable coherence state during transition while not all capabilities are implemented (e.g., S3 topology may be inherited while S4 package is freshly produced).

### 5.3 Admissibility Rules

| rule | description |
|------|-------------|
| RC-01 | In SINGLE-RUN: all five artifacts must carry the same `run_id` or `run_reference` |
| RC-02 | In GOVERNED RUN-FAMILY: all artifact run references must be declared in a run-family record; undeclared run mixing is prohibited |
| RC-03 | An artifact carrying a `run_id` that pre-dates the declared current intake is STATIC regardless of content |
| RC-04 | Hash equality claims in FRESH-R4 / run-family inheritance must be confirmed by the freshness validation step (EC-06) |
| RC-05 | No artifact may carry a `client_id` that differs from the current chain's `client_uuid` |

### 5.4 Prohibited Hidden Stitching

Hidden stitching occurs when:
- An artifact from run A and an artifact from run B are consumed by GAUGE without declaration of their different run origins
- A freshness claim is made for a stitched set without confirming hash equality across the stitched runs

Hidden stitching is prohibited. It produces `G4_CROSS_RUN_CONTAMINATION` (GAUGE.ADMISSIBLE.CONSUMPTION.01 Section 9). The LAYERED state documented in GAUGE.PROVENANCE.PROOF.01 is governed (declared) — it is not hidden stitching. Hidden stitching is undeclared.

---

## SECTION 6 — DEPENDENCY ORDER

The following four work items must be completed in order. No item may begin until its predecessor is complete.

---

### Step 1: FRESH.RUN.BOOTSTRAP.PROTOCOL.01

**Purpose:** Define and implement the protocol that allows a new intake (new `client_uuid` or `source_version`) to bootstrap the PSEE pipeline without depending on a pre-existing reference package. Addresses GAP-05 and partially GAP-10.

**Dependency:** None (first in sequence). Requires BOOTSTRAP.CHAIN.AUTHORITY.01 and IG.HANDOFF.AUTHORITY.01 as authority references.

**Required output:**
- A bootstrap protocol document defining how a new PSEE run initializes its package directory
- An updated `run_end_to_end.py` behavior (or equivalent) that does not copy from `run_01_authoritative` when no reference exists
- Verification that a fresh IG pipeline run (S0→S1) produces a valid RHP for a new source without manual intervention (GAP-10 closure)

**Blocking if incomplete:** EC-02, EC-04, EC-03 all depend on a bootstrappable pipeline

---

### Step 2: GAUGE.STATE.COMPUTATION.CONTRACT.01

**Purpose:** Define the contract for `build_gauge_state.py` and implement it. Addresses GAP-01.

**Dependency:** Step 1 complete (requires fresh `coverage_state.json` and `reconstruction_state.json` as inputs); `PSEE-GAUGE.0/gauge_score_model.md` as scoring authority.

**Required output:**
- Contract document: `GAUGE.STATE.COMPUTATION.CONTRACT.01` defining input interface, output schema, score model application rules, and `run_id` binding requirement
- Implementation: `scripts/psee/build_gauge_state.py` that accepts `coverage_state.json` and `reconstruction_state.json` as inputs and emits a conforming `gauge_state.json`
- A fresh `gauge_state.json` produced by the script, validated against `gauge_score_model.md`

**Blocking if incomplete:** SC-02 (fresh gauge_state.json) cannot be satisfied

---

### Step 3: S3.S4.RUN.COHERENCE.CONTRACT.01

**Purpose:** Define and implement the coherence contract ensuring `canonical_topology.json` and `signal_registry.json` are produced from or hash-inherited with the current run's S2 outputs. Addresses GAP-06 and the CC-2 schema gap from GAUGE.PROVENANCE.PROOF.01. Also defines run-family governance for transitional coherence.

**Dependency:** Step 2 complete (S4 package must be fresh before S3/S4 coherence is validated); SEMANTIC.COMPUTATION.AUTHORITY.01 as authority for signal schema requirements.

**Required output:**
- Contract document: `S3.S4.RUN.COHERENCE.CONTRACT.01` defining SINGLE-RUN and GOVERNED RUN-FAMILY coherence rules, hash equality confirmation method, and `runtime_required` field requirement
- Updated `signal_registry.json` with `runtime_required: false` added to all signal entries (schema compliance — CC-2 from provenance proof)
- Updated `build_signals.py` wired to accept current S2 `telemetry_dimension_catalog.md` as input rather than producing a static output
- Confirmation that all 5 GAUGE-consumed artifacts carry coherent run references under the new protocol

**Blocking if incomplete:** SC-04 (topology/signal alignment) and SC-05 (admissibility) cannot be fully satisfied

---

### Step 4: FRESHNESS.VALIDATION.RUN.01

**Purpose:** Execute the freshness validation (EC-06) against a complete fresh-run GAUGE artifact set. Produces a machine-readable validation report confirming GOVERNED AND FRESH THROUGH S4.

**Dependency:** Steps 1, 2, and 3 all complete; a full fresh chain execution (S0→S4) must have been run.

**Required output:**
- Freshness validation report at `docs/psee/FRESHNESS.VALIDATION.RUN.01/freshness_validation_report.md`
- Per-artifact FRESH/STATIC verdict for all 5 artifacts
- Run coherence verdict: SINGLE-RUN or GOVERNED RUN-FAMILY
- Overall verdict: GOVERNED AND FRESH THROUGH S4 or NOT FRESH (with blocking conditions listed)
- If PASS: this report supersedes GAUGE.PROVENANCE.PROOF.01's STATIC verdicts for the validated run

**Blocking if incomplete:** Cannot declare GOVERNED AND FRESH THROUGH S4

---

## SECTION 7 — IMPLEMENTATION BOUNDARY

### 7.1 What Is NOT Allowed Under This Plan

| prohibited | reason |
|-----------|--------|
| Stage 5 (40.5–40.11) work | Out of scope; requires live runtime telemetry; GAP-02 is not in scope for S4 freshness |
| Stage 6 (43.x, 44.x, 42.x) work | Out of scope; LENS is downstream of GAUGE stop boundary |
| GAUGE UI changes | Out of scope; GAUGE consumption layer is governed; no product tuning |
| Authority contract rewrites | All five authority contracts (S0–S4) are LOCKED; this plan does not modify them |
| signal_registry.json schema changes beyond `runtime_required` field addition | Only CC-2 compliance (adding `runtime_required: false`) is authorized; no semantic changes to signals |
| Introduction of new signals to signal_registry.json | Freshness does not require new signals; only schema compliance and run coherence |
| Cross-layer artifact production | No S2 artifact may be produced by S3 tooling; no S3 artifact may be produced by S4 tooling |

### 7.2 When Implementation Is Authorized

Implementation under this plan is authorized when:

1. **Step 1 (FRESH.RUN.BOOTSTRAP.PROTOCOL.01):** Authorized to begin immediately. No upstream dependency. Scope: `run_end_to_end.py` behavior modification for new clients; IG pipeline verification.

2. **Step 2 (GAUGE.STATE.COMPUTATION.CONTRACT.01):** Authorized once Step 1 is confirmed complete (a fresh S4 package with fresh `coverage_state.json` and `reconstruction_state.json` exists).

3. **Step 3 (S3.S4.RUN.COHERENCE.CONTRACT.01):** Authorized once Step 2 is confirmed complete.

4. **Step 4 (FRESHNESS.VALIDATION.RUN.01):** Authorized once Steps 1–3 are confirmed complete and a full fresh chain execution has been run.

No step may be executed out of order. No implementation step may begin without its predecessor being confirmed complete in a written execution record.

---

## SECTION 8 — FRESH-SUCCESS CRITERIA

All 10 criteria must pass for the system to be declared GOVERNED AND FRESH THROUGH S4.

| criterion | check |
|-----------|-------|
| SC-01 — Fresh run exists | A new chain execution with a unique `run_id` has been declared and completed from S0 through S4 for the target `client_uuid` and `source_version` |
| SC-02 — gauge_state.json is freshly computed | `gauge_state.json` was produced by an authorized computation script (not copied); its `run_id` matches the current chain execution; its `traceability.source_files` lists the current-run `coverage_state.json` and `reconstruction_state.json` |
| SC-03 — coverage_state.json and reconstruction_state.json are fresh | Both artifacts carry the current chain's `run_id`; both were emitted by PSEE pipeline stages 5A and 6A for the current run; neither is a copy of a prior run's artifacts |
| SC-04 — canonical_topology.json is aligned | `canonical_topology.json` carries a `run_reference` corresponding to a 41.1 execution against the current run's S2 artifacts (or hash equality is confirmed and declared for inheritance) |
| SC-05 — signal_registry.json is aligned | `signal_registry.json` carries a `run_reference` corresponding to a 41.4 execution against current S2 and S3 artifacts (or hash equality is confirmed); all signal entries carry `runtime_required: false` |
| SC-06 — S4 GAUGE consumption is admissible | All GA-01 through GA-12 conditions (GAUGE.ADMISSIBLE.CONSUMPTION.01 Section 8) pass against the fresh artifacts |
| SC-07 — No copied baseline artifacts | No artifact among the five consumed artifacts is a byte-for-byte copy of a prior run's artifact for a different `source_version` |
| SC-08 — No hidden run stitching | All run references among the five consumed artifacts are either identical (SINGLE-RUN) or declared in a governed run-family record (GOVERNED RUN-FAMILY); no undeclared mixing |
| SC-09 — No contradiction to forensic baseline | The fresh artifact set does not contradict the structural observations documented in GAUGE.PROVENANCE.PROOF.01; if any values differ, the difference is traceable to a change in source input |
| SC-10 — Freshness validation report issued | FRESHNESS.VALIDATION.RUN.01 has been executed and produced a freshness validation report with overall verdict GOVERNED AND FRESH THROUGH S4 |

---

## SECTION 9 — FAIL CONDITIONS

The GOVERNED AND FRESH THROUGH S4 declaration must not be made if any of the following are true:

| code | condition |
|------|-----------|
| `EE_COPIED_ARTIFACT` | Any of the five consumed artifacts was copied from a prior run's package without hash equality confirmation and declaration |
| `EE_HIDDEN_STITCHING` | Two or more consumed artifacts carry different `run_id` / `run_reference` values without a declared governed run-family record |
| `EE_UNDECLARED_RUN_IDENTITY` | A consumed artifact does not carry a `run_id` or `run_reference` that can be traced to a declared chain execution |
| `EE_S5_S6_DEPENDENCY` | Any freshness claim relies on Stage 5 or Stage 6 outputs (40.5–40.11, 43.x, 44.x, 42.x) |
| `EE_BASELINE_CONTRADICTION` | A fresh artifact's values cannot be explained by a change in source input relative to the forensic baseline in GAUGE.PROVENANCE.PROOF.01 (unexplained structural divergence) |
| `EE_SCHEMA_NON_COMPLIANCE` | `signal_registry.json` entries still lack `runtime_required: false` after Step 3 |
| `EE_GAUGE_ADMISSIBILITY_FAIL` | Any GA-01 through GA-12 condition fails against the fresh artifact set |
| `EE_MISSING_VALIDATION_REPORT` | FRESHNESS.VALIDATION.RUN.01 has not been executed; no machine-readable freshness verdict exists |
| `EE_BOOTSTRAP_INCOMPLETE` | FRESH.RUN.BOOTSTRAP.PROTOCOL.01 is not complete; pipeline still depends on `run_01_authoritative` reference package for new runs |
| `EE_GAUGE_STATE_NOT_COMPUTED` | `gauge_state.json` is still produced by copying rather than by an authorized computation script |
