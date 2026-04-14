# Gauge State Computation Contract
# GAUGE.STATE.COMPUTATION.CONTRACT.01

- Date: 2026-04-14
- Status: ACTIVE — GOVERNING CONTRACT
- Authority basis: EXECUTION.ENABLEMENT.PLAN.01 (Step 2); FRESH.RUN.BOOTSTRAP.PROTOCOL.01; GAUGE.PROVENANCE.PROOF.01
- Score model authority: PSEE-GAUGE.0/gauge_score_model.md
- Dimension authority: PSEE-GAUGE.0/dimension_projection_model.md
- Confidence authority: PSEE-GAUGE.0/confidence_and_variance_model.md
- Scope: gauge_state.json computation governance only — S0–S4 boundary

---

## SECTION 1 — PURPOSE

### 1.1 Computation Objective

This contract defines the governed rules under which `gauge_state.json` is computed for a given chain execution.

`gauge_state.json` is the single artifact that GAUGE (the S4 product surface) reads to derive score, dimensions, projection, and confidence for display. It is the terminal produced artifact of the S0–S4 chain. Its computation must be:

- deterministic: the same inputs produce the same output
- traceable: every field in `gauge_state.json` maps to a declared input artifact field
- run-bound: `gauge_state.json` carries the `run_id` of the current chain execution
- computable: it is produced by an authorized computation script, never copied

The governing gap this contract addresses is GAP-01 from GAUGE.PROVENANCE.PROOF.01: `build_gauge_state.py` does not exist and `gauge_state.json` is currently produced by copying the `run_01_authoritative` package artifact. This contract defines the rules under which a compliant `build_gauge_state.py` (or equivalent authorized script) must operate.

### 1.2 Separation from Bootstrap and Coherence

**Separation from bootstrap:** This contract does not define how a run establishes identity or declares dependencies. Those are governed by FRESH.RUN.BOOTSTRAP.PROTOCOL.01. A run must satisfy bootstrap admissibility conditions (AC-01–AC-10) before this contract's computation may begin.

**Separation from coherence:** This contract does not define the rules for ensuring `canonical_topology.json` and `signal_registry.json` are coherent with the current run's S2 outputs. That is governed by S3.S4.RUN.COHERENCE.CONTRACT.01 (Step 3 of EXECUTION.ENABLEMENT.PLAN.01). This contract consumes `canonical_topology.json` and `signal_registry.json` as declared inputs but does not govern how they were produced.

**Scope boundary:** This contract covers exactly: what inputs are authorized, how each field of `gauge_state.json` is computed from those inputs, and when the emitted artifact is valid for S4 consumption. Nothing outside this scope is within this contract's authority.

---

## SECTION 2 — INPUT AUTHORITY MODEL

### 2.1 Authorized Input Artifacts

The computation of `gauge_state.json` is authorized to consume exactly the following four input artifacts:

| input artifact | role | primary fields consumed |
|---------------|------|------------------------|
| `coverage_state.json` | PSEE pipeline stage 5A output; carries DIM-01 values and execution state for terminal state derivation | `coverage_percent`, `state`, `state_label`, `required_units`, `admissible_units`, `run_id`, `client_id`, `stream` |
| `reconstruction_state.json` | PSEE pipeline stage 6A output; carries DIM-02 values and reconstruction axis results | `state`, `state_label`, `validated_units`, `total_units`, `axis_results`, `violations`, `run_id`, `stream` |
| `canonical_topology.json` | S3 semantic layer output; provides structural node counts for DIM-05 cross-reference and intake completeness verification | `node_counts` (or equivalent count fields), `run_reference`, `emission_date`, `client_id` |
| `signal_registry.json` | S3 signal registry output; provides signal entries for DIM-06 heuristic compliance context | signal entries with `evidence_confidence`, `runtime_required`, `run_reference`, `generated_date` |

### 2.2 Bootstrap Dependency Requirement

All four inputs must be declared via the bootstrap dependency model (FRESH.RUN.BOOTSTRAP.PROTOCOL.01 Section 4) before computation begins. Specifically:

- Each of the four input artifacts must appear in the current run's `intake_record.json` coverage block as PRODUCE or INHERIT
- Any artifact declared INHERIT must have a dependency table entry with `source_run_id` and `classification` populated
- The computation script must read `intake_record.json` to confirm that all four inputs are declared before opening any input artifact

A computation that begins before `intake_record.json` is populated, or that reads an input artifact not declared in `intake_record.json`, violates the bootstrap dependency requirement.

### 2.3 Prohibited Inputs

The following are prohibited as inputs to the computation of `gauge_state.json`:

| prohibited input | code | reason |
|-----------------|------|--------|
| A prior run's `gauge_state.json` | PI-01 | Constitutes copy-forward of historical state; produces `EE_COPIED_ARTIFACT` violation |
| Any artifact not listed in Section 2.1 | PI-02 | Undeclared lineage; violates evidence-first discipline |
| S5 / S6 artifacts (40.5–40.11, 43.x, 44.x) | PI-03 | Out of scope; S4 computation must not require live runtime telemetry |
| Hardcoded field values not derived from any input | PI-04 | Hidden lineage; score field not traceable to declared input |
| External data sources or operator-supplied overrides | PI-05 | Score must be deterministic; operator input is not a governed input |

### 2.4 Hidden Lineage Prohibition

Every field in the emitted `gauge_state.json` must be traceable to one of the four authorized inputs or to the score model computation rules (Section 3). A field whose value cannot be traced to an authorized input or a declared computation rule constitutes hidden lineage and invalidates the artifact.

The specific hidden lineage violation found in the current system (GAUGE.PROVENANCE.PROOF.01): the `state.execution_status` field in the current `gauge_state.json` carries `"PHASE_1_ACTIVE"` — a value that reflects the in-flight engine state of `run_01_authoritative` rather than a computed conclusion. Under this contract, `state.execution_status` must be derived from terminal state classification rules applied to the current run's `coverage_state.json` and `reconstruction_state.json`.

---

## SECTION 3 — COMPUTATION MODEL

### 3.1 gauge_state.json as a Deterministic Function

`gauge_state.json` is defined as:

```
gauge_state = f(coverage_state, reconstruction_state, canonical_topology, signal_registry, run_id)
```

where `f` is the deterministic function defined by:
- this contract (input mapping and emission rules)
- PSEE-GAUGE.0/gauge_score_model.md (score computation)
- PSEE-GAUGE.0/dimension_projection_model.md (dimension derivation)
- PSEE-GAUGE.0/confidence_and_variance_model.md (confidence and variance)

The function `f` is fully determined by these authorities. No field may be computed by any rule not traceable to one of these four authorities.

### 3.2 Terminal State Classification

Before any score component is computed, the terminal execution state must be classified from the two primary inputs:

| condition | derived terminal state |
|-----------|----------------------|
| `coverage_state.json.state = "COMPUTED"` AND `coverage_percent ≥ 90` AND `reconstruction_state.json.state = "PASS"` | S-13 (COMPLETE) |
| `coverage_state.json.state = "COMPUTED"` AND `coverage_percent < 90` AND `reconstruction_state.json.state ≠ "FAIL"` | S-T3 (PARTIAL) |
| `reconstruction_state.json.state = "FAIL"` OR `violations` list is non-empty | S-T1 (STOPPED) — reconstruction divergence |
| `coverage_state.json.state ≠ "COMPUTED"` (coverage was not reached) | S-T2 (ESCALATED) — suspended state; escalation phase derived from `stream` field |

This terminal state classification is the `execution_status` value in the emitted `gauge_state.json.state` block. It replaces the current pattern of carrying the PSEE engine's in-flight state string verbatim.

### 3.3 Score Components

All three score components are computed per `PSEE-GAUGE.0/gauge_score_model.md §G.2–G.3`. The computation contract requires:

- `completion_points`: derived from terminal state classification (Section 3.2) via the lookup table in `gauge_score_model.md §G.2 Component 1`. UNDEFINED_STATE guard applies for any state not in the table (0 points).
- `coverage_points`: derived from `coverage_state.json.coverage_percent` via `round(coverage_percent × 0.35)`. If coverage_state.json.state ≠ "COMPUTED", coverage_points = 0.
- `reconstruction_points`: derived from `reconstruction_state.json.validated_units` and `reconstruction_state.json.total_units` via the weighted match formula in `gauge_score_model.md §G.2 Component 3`. If reconstruction has not been computed (state = PENDING), reconstruction_points = 0.
- `canonical_score = completion_points + coverage_points + reconstruction_points`

No score component may be derived from `canonical_topology.json` or `signal_registry.json`. Those inputs inform dimension context only (Section 4), not the numeric score.

### 3.4 Completion Posture

The completion posture is a structured summary of the execution state. It is derived from the terminal state (Section 3.2) and the score component values. It must be deterministic: same inputs → same posture.

See Section 6 for the complete completion posture derivation rules.

### 3.5 Prohibited Computation Patterns

| pattern | code | description |
|---------|------|-------------|
| Copy-forward of historical `gauge_state.json` | CP-01 | Taking any field value from a prior run's `gauge_state.json` and placing it in the current run's output without recomputation |
| Mixing static score with computed dimensions | CP-02 | Computing some dimensions from current inputs while taking the `score` block from a prior run |
| Partial reuse without recomputation | CP-03 | Reusing any field from a prior run's `gauge_state.json` for a field that depends on the current run's input values |
| Score interpolation | CP-04 | Producing a score value that is an average or blend of the current run's computed score and a prior run's score |
| Hardcoded score floor | CP-05 | Applying a minimum score value not derived from the scoring rules (e.g., ensuring the score is never below a prior result) |

---

## SECTION 4 — DIMENSION DERIVATION RULES

### 4.1 Derivation Requirement

Each dimension entry in `gauge_state.json.dimensions` must map to exactly one authorized input artifact field or to a classification rule applied to authorized inputs. No dimension value may be invented, hardcoded (except as defined by PSEE invariants), or carried from a prior run.

### 4.2 DIM-01 — Coverage

| property | source | rule |
|----------|--------|------|
| `coverage_percent` | `coverage_state.json.coverage_percent` | Direct read |
| `state` | `coverage_state.json.state` | Direct read |
| `state_label` | `coverage_state.json.state_label` | Direct read |
| `required_units` | `coverage_state.json.required_units` | Direct read |
| `admissible_units` | `coverage_state.json.admissible_units` | Direct read |
| `authority` | fixed | `"PSEE-GAUGE.0 DP-5-02"` |

DIM-01 derives entirely from `coverage_state.json`. No other input contributes to DIM-01.

### 4.3 DIM-02 — Reconstruction

| property | source | rule |
|----------|--------|------|
| `state` | `reconstruction_state.json.state` | Direct read |
| `state_label` | derived | PASS → "PASS"; FAIL → "FAIL"; if `violations` non-empty → "FAIL" |
| `validated_units` | `reconstruction_state.json.validated_units` | Direct read |
| `total_units` | `reconstruction_state.json.total_units` | Direct read |
| `reconstruction_points` | computed | Per score model §G.2 Component 3 |
| `authority` | fixed | `"PSEE-GAUGE.0 DP-6-03"` |

DIM-02 derives entirely from `reconstruction_state.json`. No other input contributes to DIM-02.

### 4.4 DIM-03 — Escalation Clearance

| property | source | rule |
|----------|--------|------|
| `value` | derived from terminal state | If terminal state = S-13: 100 (S-13 invariant: all escalations resolved or none occurred). If terminal state = S-T1: 0. If terminal state = S-T3: 100 (PARTIAL coverage does not indicate open escalation). If terminal state = S-T2: derive from `coverage_state.json.stream` field to identify suspension phase. |
| `state_label` | derived | 100 → "CLEAR"; < 100 → "PARTIAL" or "SUSPENDED" per dimension_projection_model.md |
| `authority` | fixed | `"PSEE-GAUGE.0 dimension_projection_model.md §DIM-03"` |

DIM-03 is derived from terminal state classification (Section 3.2) applied to `coverage_state.json` and `reconstruction_state.json`. The PSEE engine invariant guarantees that if execution reached S-13, all escalations were resolved before the terminal state was written; the escalation count is therefore 0 or fully resolved.

### 4.5 DIM-04 — Unknown-Space

| property | source | rule |
|----------|--------|------|
| `total_count` | derived from terminal state | Terminal state S-13 does not preclude US records; however, `coverage_state.json` and `reconstruction_state.json` do not carry `us_records`. If `us_records` are not available in the authorized inputs, `total_count` must be reported as 0 with a declared caveat rather than inferred. |
| `state_label` | derived | 0 → "NONE"; 1–3 → "LOW"; 4–9 → "MODERATE"; ≥ 10 → "HIGH" |
| `authority` | fixed | `"PSEE-GAUGE.0 dimension_projection_model.md §DIM-04"` |

**DIM-04 constraint:** `us_records` are a PSEEContext field not directly present in the four authorized inputs. If the PSEE run package makes `us_records` available as a declared output artifact within the package (co-produced with coverage and reconstruction outputs), that artifact may be consumed as an authorized package artifact. If `us_records` are unavailable: `total_count = 0` and `state_label = "NONE"` must be emitted with a `caveat` field stating `"us_records not available in declared input artifacts; DIM-04 reflects minimum observable state"`. This is not a hidden value — it is a declared limitation.

### 4.6 DIM-05 — Intake Completeness

| property | source | rule |
|----------|--------|------|
| `state` | derived from terminal state | If terminal state = S-13: "COMPLETE" (PSEE.1 INV-04 guarantees all files assigned when Phase 2 completes, and Phase 2 must complete before S-13 is reachable). If terminal state ≠ S-13: derive from `coverage_state.json.stream` context to assess whether Phase 2 was completed. |
| `authority` | fixed | `"PSEE-GAUGE.0 dimension_projection_model.md §DIM-05"` |

DIM-05 is deterministically derivable from terminal state classification for the S-13 case. For non-S-13 states, it requires Phase 2 completion evidence from the run's execution context.

### 4.7 DIM-06 — Heuristic Compliance

| property | source | rule |
|----------|--------|------|
| `state` | derived from terminal state | If terminal state = S-13: "PASS" (PSEE engine cannot reach S-13 if a STOP-HEURISTIC event fired; a STOP-HEURISTIC produces S-T1, not S-13). If terminal state = S-T1: assess if cause was STOP-HEURISTIC (requires package context). If not determinable: "PASS" with caveat. |
| `authority` | fixed | `"PSEE-GAUGE.0 dimension_projection_model.md §DIM-06"` |

DIM-06 is deterministically derivable from terminal state for the S-13 case: S-13 is unreachable if a STOP-HEURISTIC fired. For S-T1, heuristic compliance state requires the STOP reason from the run's execution context.

---

## SECTION 5 — SCORE AGGREGATION RULE

### 5.1 Aggregation Formula

Score aggregation follows `PSEE-GAUGE.0/gauge_score_model.md §G.3` without deviation:

```
canonical_score = completion_points + coverage_points + reconstruction_points
```

| constraint | rule |
|-----------|------|
| SA-01 — Integer result | All three components are integers; `canonical_score` is an integer in range [0, 100] |
| SA-02 — No interpolation | Component values are taken from lookup tables or rounding formulas defined in gauge_score_model.md; no linear interpolation between table values |
| SA-03 — No weighting beyond model | The three components are summed with equal weight (1.0, 1.0, 1.0) as defined in gauge_score_model.md §G.3; no alternative weighting is authorized |
| SA-04 — Special case S-T1 | If terminal state = S-T1 (STOPPED): canonical_score = 0 unconditionally, regardless of coverage or reconstruction values |
| SA-05 — Special case S-T2 | If terminal state = S-T2 (ESCALATED): canonical_score = completion_points only; coverage_points = 0; reconstruction_points = 0 |
| SA-06 — Rounding | `coverage_points = round(coverage_percent × 0.35)`; Python `round()` semantics (banker's rounding) apply |

### 5.2 Score Band Derivation

The `band_label` is derived strictly from `canonical_score` per `gauge_score_model.md §G.4`:

```
canonical_score ≥ 80  →  band_label = "READY"
canonical_score 40–79 →  band_label = "CONDITIONAL"
canonical_score ≤ 39  →  band_label = "BLOCKED"
```

The `band_label` is a derived label, not a score input. It must not influence the `canonical_score`.

### 5.3 Derivation String

The emitted `gauge_state.json.score.derivation` field must record the additive breakdown as a human-readable string:

```
"<completion_points> + <coverage_points> + <reconstruction_points> = <canonical_score>"
```

Example: `"40 + 35 + 25 = 100"`. This string provides a minimal audit trace for the score.

### 5.4 Prohibited Aggregation Patterns

| pattern | code |
|---------|------|
| Manual override of any component value | SA-P01 |
| Opaque weighting factors not defined in gauge_score_model.md | SA-P02 |
| Score floor or ceiling applied after aggregation | SA-P03 |
| Band label used as input to score computation | SA-P04 |
| Component values carried from a prior run's score block | SA-P05 |

---

## SECTION 6 — COMPLETION POSTURE RULE

### 6.1 Definition

The completion posture is the `gauge_state.json.state` block. It communicates the execution's terminal quality in human-readable form. It is derived from terminal state classification (Section 3.2) and must not introduce new state values outside the PSEE terminal state vocabulary.

### 6.2 Allowed States

The `execution_status` field in `gauge_state.json.state` must take one of the following values, derived from terminal state classification:

| terminal state (Section 3.2) | execution_status value | psee_engine_invoked |
|-----------------------------|----------------------|---------------------|
| S-13 (COMPLETE) | `"COMPLETE"` | `true` |
| S-T3 (PARTIAL) | `"PARTIAL"` | `true` |
| S-T2 (ESCALATED) | `"ESCALATED"` | `true` |
| S-T1 (STOPPED) | `"STOPPED"` | `true` |
| Terminal state undetermined (inputs inconsistent) | `"INDETERMINATE"` | `true` |

The value `"PHASE_1_ACTIVE"` (present in the current `run_01_authoritative` gauge_state.json) is an in-flight engine state, not a terminal state. It must not appear in a freshly computed `gauge_state.json`. Its presence indicates the prior artifact was produced while the engine was still running — a STATIC artifact with embedded in-flight state. A FRESH `gauge_state.json` reflects only the terminal state of the completed PSEE run.

`execution_mode` must be set to `"FULL"` unless the run explicitly declared a restricted execution mode in `intake_record.json`. No other values are authorized.

### 6.3 Dependency on Computed Dimensions

The completion posture must be derived from terminal state classification (Section 3.2), which is itself derived from the four authorized inputs. The posture must not:
- be copied from a prior run's `state` block
- be assigned by the operator at computation time
- differ from the terminal state classification result without a declared override rule

---

## SECTION 7 — PROHIBITED COMPUTATION PATTERNS

The following patterns constitute computation violations. A `gauge_state.json` produced via any of these patterns is not FRESH and is not valid for S4 consumption.

| pattern | code | description |
|---------|------|-------------|
| Reuse of prior `gauge_state.json` | PP-01 | Any field in the emitted artifact is taken from a prior run's `gauge_state.json` without being re-derived from current inputs. Includes full-file copy, partial field carry-forward, and JSON merge from prior artifact. |
| Mixing static score with computed dimensions | PP-02 | Taking the `score` block verbatim from a prior run while computing `dimensions` from current inputs (or vice versa). All blocks must be derived from the same input set in a single computation pass. |
| Hidden dependency on run_01_authoritative | PP-03 | The computation script reads files from `clients/blueedge/psee/runs/run_01_authoritative/package/` without declaring that path as a dependency in `intake_record.json`. This is the specific violation pattern from GAP-01 in GAUGE.PROVENANCE.PROOF.01. |
| Computation using undeclared artifacts | PP-04 | The computation script reads any artifact not declared in `intake_record.json`'s coverage or dependency table. Every input file opened by the script must correspond to a declared entry. |
| Score from topology or signal data | PP-05 | Any score component value (completion_points, coverage_points, reconstruction_points) derived from `canonical_topology.json` or `signal_registry.json`. These inputs inform dimension context only — they do not contribute to the numeric score. |
| In-flight state embedding | PP-06 | The emitted `gauge_state.json.state.execution_status` reflects an in-flight PSEE engine state rather than the terminal state derived per Section 3.2. Any state value from the PSEE engine's active processing (S-00 through S-12, PHASE_X_ACTIVE) is an in-flight state and must not appear in a terminal computation. |
| Confidence or projection copied forward | PP-07 | The `confidence` or `projection` blocks taken from a prior run without recomputing from current score and variance inputs. |

---

## SECTION 8 — EMISSION RULE

### 8.1 Required Structure of gauge_state.json

The emitted `gauge_state.json` must conform to the following top-level structure:

```json
{
  "run_id": "<current run_id — from intake_record.json>",
  "client_id": "<client_uuid — from intake_record.json>",
  "schema_version": "1.0",
  "stream": "PSEE-GAUGE.0",
  "computed_by": "GAUGE.STATE.COMPUTATION.CONTRACT.01",
  "state": {
    "execution_status": "<derived terminal state — Section 3.2>",
    "psee_engine_invoked": true,
    "execution_mode": "FULL"
  },
  "dimensions": {
    "DIM-01": { ... },
    "DIM-02": { ... },
    "DIM-03": { ... },
    "DIM-04": { ... },
    "DIM-05": { ... },
    "DIM-06": { ... }
  },
  "score": {
    "canonical": <integer 0–100>,
    "band_label": "<READY | CONDITIONAL | BLOCKED>",
    "derivation": "<completion> + <coverage> + <reconstruction> = <canonical>",
    "components": {
      "completion_points": <integer>,
      "completion_basis": "<terminal state and lookup rule reference>",
      "coverage_points": <integer>,
      "coverage_basis": "<coverage_percent formula reference>",
      "reconstruction_points": <integer>,
      "reconstruction_basis": "<validated/total formula reference>"
    },
    "authority": "PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4"
  },
  "projection": { ... },
  "confidence": { ... },
  "traceability": {
    "source_files": [
      "<path to coverage_state.json used>",
      "<path to reconstruction_state.json used>",
      "<path to canonical_topology.json used>",
      "<path to signal_registry.json used>"
    ],
    "input_run_ids": {
      "coverage_state": "<run_id from coverage_state.json>",
      "reconstruction_state": "<run_id from reconstruction_state.json>",
      "canonical_topology": "<run_reference from canonical_topology.json>",
      "signal_registry": "<run_reference from signal_registry.json>"
    },
    "authority_refs": [
      "PSEE-GAUGE.0/gauge_score_model.md §G.2–G.4",
      "PSEE-GAUGE.0/dimension_projection_model.md §DIM-01..06",
      "PSEE-GAUGE.0/confidence_and_variance_model.md §Total Variance Computation",
      "GAUGE.STATE.COMPUTATION.CONTRACT.01"
    ]
  }
}
```

### 8.2 run_id Linkage Requirement

The `run_id` field in the emitted `gauge_state.json` must be identical to the `run_id` declared in `intake_record.json` for the current chain execution. This binds the artifact to the current run.

If the `run_id` values in `coverage_state.json` and `reconstruction_state.json` differ from each other or from the declared current run's `run_id`, the run is in GOVERNED RUN-FAMILY coherence (FRESH.RUN.BOOTSTRAP.PROTOCOL.01 Section 4; EXECUTION.ENABLEMENT.PLAN.01 Section 5.2). In that case:
- The `gauge_state.json.run_id` must be the current chain execution's `run_id` (not a prior run's)
- The `traceability.input_run_ids` must record the actual `run_id` of each input artifact
- This disclosure satisfies the run coherence declaration requirement

### 8.3 Input Artifact Linkage Requirement

The `traceability.source_files` array must list the exact file paths of all four input artifacts read by the computation script. The `traceability.input_run_ids` map must record the `run_id` or `run_reference` field of each input artifact as read from that artifact's content (not as assumed or declared by the script).

### 8.4 Emission Timing Requirement

`gauge_state.json` must be emitted after `coverage_state.json` and `reconstruction_state.json` are fully written for the current run. The computation script must not read partially written input artifacts.

The `intake_record.json.freshness_classification.gauge_state` field must be updated to `"FRESH"` after emission, if the emitted artifact satisfies FRESH criteria (FRESH.RUN.BOOTSTRAP.PROTOCOL.01 Section 5.2).

---

## SECTION 9 — ADMISSIBILITY CONDITIONS

### 9.1 Conditions for S4 Consumption

`gauge_state.json` is valid for S4 GAUGE consumption if and only if all of the following conditions pass:

| condition | code | check |
|-----------|------|-------|
| run_id match | GC-01 | `gauge_state.json.run_id` equals the current chain execution's declared `run_id` in `intake_record.json` |
| computed_by declared | GC-02 | `gauge_state.json.computed_by` = `"GAUGE.STATE.COMPUTATION.CONTRACT.01"` (confirms the artifact was produced under this contract, not copied) |
| No prior-run state embedding | GC-03 | `gauge_state.json.state.execution_status` is one of the five allowed terminal state values (Section 6.2); in-flight state values are absent |
| Score derivation traceable | GC-04 | `gauge_state.json.score.derivation` is present and matches the sum of the three component values |
| All six dimensions present | GC-05 | `gauge_state.json.dimensions` contains exactly DIM-01 through DIM-06; no dimension is missing |
| Source files declared | GC-06 | `gauge_state.json.traceability.source_files` lists exactly the four authorized input artifact paths |
| Input run_ids recorded | GC-07 | `gauge_state.json.traceability.input_run_ids` is populated for all four inputs; no null values |
| Score within valid range | GC-08 | `gauge_state.json.score.canonical` is an integer in [0, 100] |
| Band label consistent | GC-09 | `gauge_state.json.score.band_label` matches the numeric score per the band table (Section 5.2) |
| No prohibited patterns | GC-10 | None of PP-01 through PP-07 (Section 7) apply to this artifact |

### 9.2 Relationship to Bootstrap Admissibility

GC-01 through GC-10 evaluate the emitted `gauge_state.json`. They do not re-evaluate the inputs.

Before GC-01 through GC-10 are evaluated, the run must satisfy bootstrap admissibility (FRESH.RUN.BOOTSTRAP.PROTOCOL.01 Section 9, AC-01–AC-10). A run that failed bootstrap admissibility produces a `gauge_state.json` that cannot pass GC-01 (because the `run_id` was not properly declared) and therefore cannot pass GC-01–GC-10.

### 9.3 Relationship to GAUGE.ADMISSIBLE.CONSUMPTION.01

GC-01 through GC-10 govern the computed `gauge_state.json` artifact. GA-01 through GA-12 (from GAUGE.ADMISSIBLE.CONSUMPTION.01) govern the GAUGE product surface's consumption of the five authorized artifacts including `gauge_state.json`.

GC-01–GC-10 are evaluated by the computation script or a post-computation validator. GA-01–GA-12 are evaluated at the GAUGE consumption boundary. Both sets of conditions must pass for the full chain to be declared GOVERNED AND FRESH THROUGH S4.

### 9.4 Admissibility Verdict

If GC-01 through GC-10 all pass: `gauge_state.json` is VALID and computation-governed. It may proceed to S4 GAUGE consumption subject to GA-01–GA-12.

If any condition fails: `gauge_state.json` is INVALID. GAUGE consumption must not proceed with this artifact. The failing condition must be resolved and the artifact recomputed.
