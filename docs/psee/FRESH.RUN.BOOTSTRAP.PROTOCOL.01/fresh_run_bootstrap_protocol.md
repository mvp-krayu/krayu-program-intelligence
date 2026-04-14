# Fresh Run Bootstrap Protocol
# FRESH.RUN.BOOTSTRAP.PROTOCOL.01

- Date: 2026-04-14
- Status: ACTIVE — GOVERNING PROTOCOL
- Authority basis: EXECUTION.ENABLEMENT.PLAN.01 (Step 1); GAUGE.PROVENANCE.PROOF.01 (baseline)
- Scope: S0–S4 bootstrap identity and dependency governance only

---

## SECTION 1 — PURPOSE

### 1.1 Bootstrap Objective

This protocol defines how a chain execution establishes itself as a self-authoritative run — one whose identity, artifact scope, and dependencies are fully declared before any downstream stage begins.

A self-authoritative run is one that:
- carries a unique, system-issued `run_id` assigned at Stage 0
- declares all stages it will participate in (S0–S4)
- declares all artifact dependencies explicitly, including any inherited artifacts from prior runs
- does not silently absorb identity, scope, or content from any prior run

This protocol governs the bootstrap phase: the period from run declaration (Stage 0) through the point at which the first stage-produced artifact is emitted. It does not govern what each stage computes. It governs how each run declares what it is.

### 1.2 Separation from Correctness

This protocol does not evaluate or guarantee the correctness of any chain stage's outputs. It governs identity and dependency transparency only.

A run may satisfy this protocol and still produce incorrect artifacts. A run that violates this protocol cannot be declared FRESH or GOVERNED regardless of artifact content.

Correctness of stage outputs is governed by the authority contracts of each stage:
- BOOTSTRAP.CHAIN.AUTHORITY.01 (S0)
- IG.HANDOFF.AUTHORITY.01 (S1)
- STRUCTURAL.TRUTH.AUTHORITY.01 (S2)
- SEMANTIC.COMPUTATION.AUTHORITY.01 (S3)
- GAUGE.ADMISSIBLE.CONSUMPTION.01 (S4)

This protocol is orthogonal to those contracts. It must be satisfied in addition to them, not instead of them.

---

## SECTION 2 — RUN IDENTITY MODEL

### 2.1 run_id Structure

A `run_id` is the primary identity token for a chain execution. It must satisfy the following structural rules:

| rule | requirement |
|------|-------------|
| RI-01 | `run_id` must be unique within the system for the given `client_uuid` |
| RI-02 | `run_id` must be assigned at Stage 0, before any stage produces an artifact |
| RI-03 | `run_id` must be a non-empty string; no whitespace; no path separators |
| RI-04 | `run_id` must be recorded in `intake_record.json` at the time of assignment |
| RI-05 | All artifacts produced by the chain must carry the assigned `run_id` in a declared field (`run_id`, `run_reference`, or equivalent) |

Recommended format: `run_<sequence>_<descriptor>` (e.g., `run_04_blueedge_fresh`). The format is advisory; the uniqueness and declaration requirements are mandatory.

### 2.2 Self-Authoritative Identity Rule

A run is self-authoritative if and only if:

1. Its `run_id` was assigned by the current chain execution (not inherited from a prior run)
2. Its `run_id` appears in `intake_record.json` before any artifact is produced
3. No artifact produced by the chain carries a `run_id` that differs from the declared `run_id` unless that artifact is explicitly declared as an inherited dependency (Section 4)
4. The `run_id` is not equal to any prior run's `run_id` for any `client_uuid` in the system

### 2.3 Prohibited Inherited Identity Patterns

The following patterns constitute identity violations. A run exhibiting any of these patterns is not self-authoritative.

| pattern | code | description |
|---------|------|-------------|
| run_id copied from prior run | II-01 | The current chain's `run_id` is set equal to a prior run's `run_id` without an explicit supersession declaration |
| run_id assigned after artifact emission | II-02 | Any stage-produced artifact exists before `intake_record.json` records the `run_id` |
| run_id absent from consumed artifacts | II-03 | An artifact produced by the current chain does not carry the `run_id` in any declared field |
| run_id of undeclared prior run embedded in produced artifact | II-04 | A produced artifact carries a `run_id` matching a prior run and that prior run is not declared as a dependency source (Section 4) |
| Implicit adoption of run_01_authoritative identity | II-05 | A new run reuses the identifier `run_01_authoritative` or any of its artifacts without declaring it as a dependency with explicit STATIC classification |

---

## SECTION 3 — RUN SCOPE DECLARATION

### 3.1 S0–S4 Participation Declaration

Before the first artifact of the chain is produced, the run must declare which stages it will participate in. This declaration is recorded in `intake_record.json` as a `stage_participation` block.

Required fields per declared stage:

| field | description |
|-------|-------------|
| `stage_id` | One of: S0, S1, S2, S3, S4 |
| `status` | One of: ACTIVE (stage will execute), INHERITED (stage output inherited from prior run with hash equality), EXCLUDED (stage not in scope) |
| `authorized_by` | The authority contract governing this stage's outputs |

A stage declared EXCLUDED must not produce artifacts for this run. A stage declared INHERITED must declare the source run in the dependency table (Section 4).

### 3.2 Artifact Coverage Declaration

The run must declare, for each of the five GAUGE-consumed artifacts, whether it will produce or inherit each artifact:

| artifact | declaration field | allowed values |
|----------|------------------|----------------|
| `gauge_state.json` | `coverage.gauge_state` | PRODUCE, INHERIT |
| `coverage_state.json` | `coverage.coverage_state` | PRODUCE, INHERIT |
| `reconstruction_state.json` | `coverage.reconstruction_state` | PRODUCE, INHERIT |
| `canonical_topology.json` | `coverage.canonical_topology` | PRODUCE, INHERIT |
| `signal_registry.json` | `coverage.signal_registry` | PRODUCE, INHERIT |

An artifact declared PRODUCE must be produced by this run's chain. It must carry the current run's `run_id`.

An artifact declared INHERIT must have a corresponding entry in the dependency table (Section 4) and must satisfy FRESH-R4 (hash equality with prior run's artifact under the same `source_version`).

---

## SECTION 4 — DEPENDENCY DECLARATION MODEL

### 4.1 Dependency Table Structure

If a run inherits any artifact from a prior run, it must declare each such artifact in a dependency table within `intake_record.json`. Undeclared dependencies constitute hidden inheritance and are prohibited (Section 7).

Each row in the dependency table must contain exactly the following fields:

| field | type | description |
|-------|------|-------------|
| `artifact` | string | Artifact filename (e.g., `canonical_topology.json`) |
| `source_run_id` | string | The `run_id` of the prior run from which the artifact is taken |
| `dependency_type` | enum | See Section 4.2 |
| `source_path` | string | Full path to the source artifact within the prior run's package |
| `hash_equality_confirmed` | boolean | `true` if FRESH-R4 inheritance; `false` if STATIC dependency |
| `hash_value` | string or null | SHA-256 of the artifact if `hash_equality_confirmed: true`; null otherwise |
| `classification` | enum | FRESH (if hash_equality_confirmed: true) or STATIC |

### 4.2 Dependency Types

| type | description |
|------|-------------|
| `HASH_INHERITED` | Artifact is copied from a prior run; S2 inputs are provably hash-identical to prior run; artifact is classified FRESH per FRESH-R4 |
| `STATIC_REFERENCE` | Artifact is copied from a prior run; S2 inputs are not confirmed hash-identical; artifact is classified STATIC; permissible as a transitional state only |
| `COMPUTED_FROM_PRIOR` | Artifact is computed by the current chain using a prior run's output as an input parameter; must declare which prior-run output is consumed |

A run may not declare an artifact as `HASH_INHERITED` without providing a confirmed SHA-256 hash in `hash_value`. A hash equality claim without a hash value is a declaration violation.

---

## SECTION 5 — FRESHNESS CLASSIFICATION MODEL

### 5.1 Definitions

These definitions are taken directly from EXECUTION.ENABLEMENT.PLAN.01 §2.1 and are reproduced here as governing reference.

**FRESH artifact:**
An artifact that was produced by the current chain execution for the declared `client_uuid` and `source_version`. A FRESH artifact carries a `run_id` that is traceable to the current intake declaration. Its content is deterministically derived from the current intake's admitted evidence set.

**STATIC artifact:**
An artifact that was produced by a prior chain execution and is consumed by the current run without being recomputed from the current intake's chain. A STATIC artifact may be correct but is not derived from the declared intake. It carries its own run_reference, emission timestamp, or generation date that does not correspond to the current run.

### 5.2 Classification Rules per Artifact

| artifact | classified FRESH if | classified STATIC if |
|----------|--------------------|--------------------|
| `gauge_state.json` | produced by an authorized computation script (e.g., `build_gauge_state.py`) consuming current-run `coverage_state.json` and `reconstruction_state.json`; carries current `run_id` | copied from any prior run's package, regardless of content similarity |
| `coverage_state.json` | emitted by PSEE pipeline stage 5A for the current run; carries current `run_id` | copied from `run_01_authoritative` or any prior run's package |
| `reconstruction_state.json` | emitted by PSEE pipeline stage 6A for the current run; carries current `run_id` | copied from any prior run's package |
| `canonical_topology.json` | produced by an authorized 41.1 execution run consuming current S2 artifacts; carries `run_reference` traceable to current run | reused from any prior run without confirmed hash equality of S2 inputs |
| `signal_registry.json` | produced by an authorized 41.4 script run consuming current S2 and S3 artifacts; carries `run_reference` traceable to current run; all entries carry `runtime_required: false` | generated prior to the current run; does not reference current S2/S3 outputs |

### 5.3 Hash Inheritance Classification

An artifact classified STATIC may be reclassified as FRESH under FRESH-R4 (from EXECUTION.ENABLEMENT.PLAN.01 §2.2) if and only if:

1. The prior run used the same `source_version` as the current run
2. The S2 inputs consumed by the prior run's stage that produced the artifact are hash-identical to the current run's S2 inputs
3. Hash equality is confirmed by SHA-256 comparison and recorded in the dependency table (Section 4)
4. The dependency table entry declares `hash_equality_confirmed: true` and provides the hash value
5. The reclassification is declared in the freshness classification table of `intake_record.json`

No other path to FRESH reclassification of a prior-run artifact is recognized.

---

## SECTION 6 — BOOTSTRAP AUTHORITY RULE

### 6.1 Conditions for Run Authority

A run is authoritative for downstream S4 usage (GAUGE consumption) if and only if all of the following conditions are satisfied:

| condition | code | description |
|-----------|------|-------------|
| Identity declared | BA-01 | `run_id` is recorded in `intake_record.json` before any artifact is produced |
| Identity self-issued | BA-02 | `run_id` is not equal to any prior run's `run_id`; no II-01 through II-05 violations |
| Stage scope declared | BA-03 | `stage_participation` block in `intake_record.json` covers all stages S0–S4; each stage is ACTIVE, INHERITED, or EXCLUDED |
| Artifact coverage declared | BA-04 | All five GAUGE-consumed artifacts are declared as PRODUCE or INHERIT in the coverage block |
| Dependencies declared | BA-05 | Every artifact declared INHERIT has a corresponding dependency table entry with all required fields populated |
| No hidden inheritance | BA-06 | No artifact produced or consumed by the chain carries a prior run's `run_id` without a corresponding dependency table entry |
| Classification table present | BA-07 | The freshness classification table (Section 8) is populated for all five artifacts before GAUGE consumption |

A run that satisfies BA-01 through BA-07 is bootstrap-authoritative. A run missing any condition is not bootstrap-authoritative and may not be declared GOVERNED AND FRESH THROUGH S4.

### 6.2 Bootstrap Authority Does Not Grant Correctness

Satisfying BA-01 through BA-07 establishes that the run's identity and dependencies are transparent. It does not guarantee that:
- stage outputs are correct
- GAUGE admissibility conditions (GA-01–GA-12) are satisfied
- the freshness validation (EC-06, FRESHNESS.VALIDATION.RUN.01) will pass

Bootstrap authority is a necessary condition for GOVERNED AND FRESH THROUGH S4 declaration, not a sufficient condition.

---

## SECTION 7 — PROHIBITED BOOTSTRAP PATTERNS

The following patterns are prohibited. A run exhibiting any of these patterns cannot satisfy BA-06 and is not bootstrap-authoritative.

| pattern | code | description |
|---------|------|-------------|
| Implicit reuse of run_01_authoritative | PB-01 | Any artifact from the `run_01_authoritative` package is consumed by the current run without a declared dependency table entry classifying it as STATIC or HASH_INHERITED |
| Unlabeled artifact reuse | PB-02 | An artifact from any prior run is placed in the current run's package directory without a dependency table entry identifying its source `run_id` and classification |
| Silent baseline carryover | PB-03 | A pipeline step (e.g., `run_end_to_end.py`) copies artifacts from a reference package into the new run's directory without recording the copy operation in the dependency table; the copied artifact appears as if it were produced by the current run |
| Mixed undeclared run scope | PB-04 | Two or more of the five GAUGE-consumed artifacts carry different `run_id` values and no governed run-family record declares their relationship; the run presents a stitched artifact set without disclosure |
| run_id absent from produced artifact | PB-05 | An artifact produced by the current chain does not carry the current `run_id` in any declared field, making it impossible to verify provenance |
| Hash equality claimed without hash value | PB-06 | A dependency table entry declares `hash_equality_confirmed: true` but does not provide the `hash_value` field, making the FRESH reclassification unverifiable |
| Stage 0 declaration after Stage 1 execution | PB-07 | The `intake_record.json` is written or updated after any downstream stage has already produced an artifact, retroactively asserting identity for a chain that began without declared identity |

PB-03 is the specific pattern found in the current system state (GAUGE.PROVENANCE.PROOF.01 GAP-01 / GAP-05): `run_end_to_end.py` copies artifacts from `run_01_authoritative` into new package directories silently. Resolving PB-03 is the primary behavioral requirement of Step 1 in EXECUTION.ENABLEMENT.PLAN.01.

---

## SECTION 8 — MINIMUM BOOTSTRAP ARTIFACT SPEC

### 8.1 Required Structure

The minimum bootstrap artifact is `intake_record.json`, written at Stage 0 before any stage produces an output artifact. It must contain the following top-level structure:

```json
{
  "run_id": "<unique run identifier — see Section 2.1>",
  "client_uuid": "<client identifier>",
  "source_version": "<source version string>",
  "declared_at": "<ISO 8601 timestamp — time of Stage 0 declaration>",
  "stage_participation": [
    {
      "stage_id": "S0",
      "status": "ACTIVE",
      "authorized_by": "BOOTSTRAP.CHAIN.AUTHORITY.01"
    },
    {
      "stage_id": "S1",
      "status": "ACTIVE",
      "authorized_by": "IG.HANDOFF.AUTHORITY.01"
    },
    {
      "stage_id": "S2",
      "status": "ACTIVE",
      "authorized_by": "STRUCTURAL.TRUTH.AUTHORITY.01"
    },
    {
      "stage_id": "S3",
      "status": "ACTIVE",
      "authorized_by": "SEMANTIC.COMPUTATION.AUTHORITY.01"
    },
    {
      "stage_id": "S4",
      "status": "ACTIVE",
      "authorized_by": "GAUGE.ADMISSIBLE.CONSUMPTION.01"
    }
  ],
  "coverage": {
    "gauge_state": "PRODUCE",
    "coverage_state": "PRODUCE",
    "reconstruction_state": "PRODUCE",
    "canonical_topology": "PRODUCE",
    "signal_registry": "PRODUCE"
  },
  "dependency_table": [],
  "freshness_classification": {
    "gauge_state": null,
    "coverage_state": null,
    "reconstruction_state": null,
    "canonical_topology": null,
    "signal_registry": null
  }
}
```

### 8.2 Field Descriptions

| field | required | description |
|-------|----------|-------------|
| `run_id` | MANDATORY | Unique run identifier assigned at Stage 0 |
| `client_uuid` | MANDATORY | Client identifier binding this run to an intake |
| `source_version` | MANDATORY | Version of the source evidence package being ingested |
| `declared_at` | MANDATORY | ISO 8601 timestamp of Stage 0 declaration; must precede any artifact emission timestamp |
| `stage_participation` | MANDATORY | Array of stage declarations; must cover S0–S4; each entry must have `stage_id`, `status`, `authorized_by` |
| `coverage` | MANDATORY | Map of the five GAUGE-consumed artifacts to PRODUCE or INHERIT |
| `dependency_table` | MANDATORY | Array; empty if no inheritance; populated entry required for each INHERIT declaration in `coverage` |
| `freshness_classification` | MANDATORY | Map of the five artifacts; null at declaration; populated with FRESH or STATIC by the completion of the stage that produces or inherits each artifact |

### 8.3 Freshness Classification Table — Update Rule

The `freshness_classification` map begins as all-null at Stage 0. Each field must be updated to FRESH or STATIC by the time the corresponding artifact is produced or inherited. The classification is final at the time of update and must not be changed after the artifact is produced.

At the time GAUGE consumption begins (S4), all five fields must be non-null. A null field at S4 entry is a bootstrap violation.

---

## SECTION 9 — ADMISSIBILITY CONDITIONS

### 9.1 Conditions for Bootstrap Validity for Downstream S4 Usage

A bootstrap is valid for downstream S4 GAUGE consumption if and only if all of the following conditions are true at the time GAUGE consumption begins:

| condition | code | description |
|-----------|------|-------------|
| intake_record.json present | AC-01 | `intake_record.json` exists in the run's package directory |
| run_id declared | AC-02 | `run_id` is populated and non-empty in `intake_record.json` |
| declared_at precedes all artifacts | AC-03 | The `declared_at` timestamp in `intake_record.json` is earlier than the emission timestamp of every artifact produced by the current chain |
| Stage participation complete | AC-04 | All stages in `stage_participation` that are declared ACTIVE have produced their required artifacts |
| No PRODUCE artifact missing | AC-05 | Every artifact declared PRODUCE in the `coverage` block exists and carries the current `run_id` |
| No INHERIT artifact without dependency entry | AC-06 | Every artifact declared INHERIT in the `coverage` block has a populated dependency table entry with all required fields |
| No hash equality claim without hash value | AC-07 | No dependency table entry has `hash_equality_confirmed: true` and a null `hash_value` |
| Freshness classification complete | AC-08 | All five fields in `freshness_classification` are non-null |
| No prohibited patterns present | AC-09 | None of PB-01 through PB-07 (Section 7) apply to this run |
| No prior-run run_id in produced artifacts | AC-10 | No artifact produced by this chain carries a `run_id` or `run_reference` from a prior run unless that run is declared in the dependency table |

### 9.2 Admissibility Verdict

If AC-01 through AC-10 all pass: the bootstrap is VALID. The run is bootstrap-authoritative. Downstream S4 usage (GAUGE consumption) may proceed subject to GAUGE.ADMISSIBLE.CONSUMPTION.01.

If any condition fails: the bootstrap is INVALID. The run is not bootstrap-authoritative. GAUGE consumption must not proceed. The failing condition must be resolved before reattempting.

### 9.3 Relationship to GAUGE.ADMISSIBLE.CONSUMPTION.01

Bootstrap validity (AC-01–AC-10) is evaluated before GAUGE admissibility (GA-01–GA-12). A run that fails bootstrap validity does not reach the GAUGE admissibility evaluation.

A run that passes bootstrap validity still must satisfy GA-01–GA-12 for GAUGE consumption to be governed. Bootstrap validity and GAUGE admissibility are both necessary; neither is sufficient alone.
