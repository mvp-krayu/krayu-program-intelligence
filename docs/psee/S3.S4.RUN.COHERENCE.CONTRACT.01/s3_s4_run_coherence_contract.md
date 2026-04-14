# S3/S4 Run Coherence Contract
# S3.S4.RUN.COHERENCE.CONTRACT.01

- Date: 2026-04-14
- Status: ACTIVE — GOVERNING CONTRACT
- Authority basis: EXECUTION.ENABLEMENT.PLAN.01 (Step 3); FRESH.RUN.BOOTSTRAP.PROTOCOL.01; GAUGE.STATE.COMPUTATION.CONTRACT.01; GAUGE.PROVENANCE.PROOF.01
- Scope: run coherence governance for S3/S4 artifact set only — does not govern computation or validation

---

## SECTION 1 — PURPOSE

### 1.1 Coherence Objective

This contract defines the governed rules under which the four pre-consumed artifacts of the S3/S4 chain — `coverage_state.json`, `reconstruction_state.json`, `canonical_topology.json`, and `signal_registry.json` — are considered coherent for GAUGE (S4) consumption.

Coherence means: the artifact set presents a consistent, declared, non-contradictory view of a chain execution. A coherent set enables GAUGE to consume the artifacts as a governed unit rather than as an undeclared mixture of unrelated chain executions.

The specific coherence problem this contract addresses is the LAYERED run state documented in GAUGE.PROVENANCE.PROOF.01: the current system feeds GAUGE from three distinct run references (`run_01_authoritative`, `run_03_blueedge_derivation_validation`, `run_01_blueedge`) without a governing declaration of their relationship. This state is classified as GOVERNED (declared) in the provenance proof, but it is not COHERENT under the target model — the run relationships are present in the artifacts but not formally registered in a coherence record. This contract defines the conditions for formal coherence.

### 1.2 Separation from Computation and Validation

**Separation from computation:** This contract does not define how any artifact is computed. Computation rules for `gauge_state.json` are governed by GAUGE.STATE.COMPUTATION.CONTRACT.01. Computation rules for `coverage_state.json` and `reconstruction_state.json` are governed by the PSEE pipeline. Computation rules for `canonical_topology.json` and `signal_registry.json` are governed by SEMANTIC.COMPUTATION.AUTHORITY.01. This contract consumes those artifacts as declared outputs — it does not govern how they were produced.

**Separation from validation:** This contract does not define the freshness validation step that confirms the artifact set is GOVERNED AND FRESH THROUGH S4. That is governed by FRESHNESS.VALIDATION.RUN.01 (Step 4 of EXECUTION.ENABLEMENT.PLAN.01). This contract defines what structural relationship the artifacts must declare; the validation step confirms that declaration holds.

**Scope boundary:** This contract covers exactly: what constitutes a governed artifact set, how run origins are declared, what alignment rules the set must satisfy, and when GAUGE may consume the set.

---

## SECTION 2 — ARTIFACT SET

### 2.1 Governed Artifact Set

The governed artifact set for S4 GAUGE consumption consists of exactly the following five artifacts:

| artifact | role in S4 consumption | producing stage | run identity field |
|----------|----------------------|----------------|-------------------|
| `coverage_state.json` | Supplies DIM-01 (Coverage) and terminal state context for `gauge_state.json` computation | S2a — PSEE pipeline stage 5A | `run_id` |
| `reconstruction_state.json` | Supplies DIM-02 (Reconstruction) and axis validation results for `gauge_state.json` computation | S2a — PSEE pipeline stage 6A | `run_id` |
| `canonical_topology.json` | Supplies S3 structural topology consumed by GAUGE topology API surface | S3 — 41.1 semantic layer emission | `run_reference` |
| `signal_registry.json` | Supplies S3 signal definitions consumed by GAUGE signals API surface | S3 — 41.4 signal registry emission | `run_reference` (or `generated_date` if run_reference absent) |
| `gauge_state.json` | Consumer output: produced by `build_gauge_state.py` from the other four; consumed by GAUGE score/dimensions API surface | S4 — GAUGE.STATE.COMPUTATION.CONTRACT.01 | `run_id` |

### 2.2 Role in S4 Consumption

**`coverage_state.json` and `reconstruction_state.json`** are the PSEE pipeline's terminal execution state artifacts. They represent what the PSEE engine completed for a given chain run. Their `run_id` field identifies the PSEE chain execution that produced them.

**`canonical_topology.json`** is the S3 structural semantic artifact. It represents the topology derived from the S2 structural truth layer. Its `run_reference` field identifies the 41.1 semantic emission run that produced it.

**`signal_registry.json`** is the S3 signal catalog artifact. It represents the signal definitions derived at the 41.4 stage. Its `run_reference` or equivalent identifier traces to the signal registry build that produced it.

**`gauge_state.json`** is the computed output of this artifact set. It is produced after the other four are declared coherent. Its `run_id` is the current chain execution's declared `run_id`. It is not an input to coherence evaluation — it is the result of a coherent input set being processed by the computation contract.

### 2.3 The `runtime_required` Field Requirement

All entries in `signal_registry.json` must carry the field `runtime_required: false` to indicate that each signal is derivable from the S2/S3 structural chain without live runtime telemetry. This is a schema compliance requirement from GAUGE.PROVENANCE.PROOF.01 forensic finding CC-2 and SEMANTIC.COMPUTATION.AUTHORITY.01. An `signal_registry.json` that lacks `runtime_required` on any entry is schema non-compliant and does not satisfy coherence conditions for S4 consumption.

---

## SECTION 3 — COHERENCE MODES

Two coherence modes are defined. The mode applicable to a given chain execution must be declared in the coherence record (Section 4).

### MODE A — SINGLE-RUN COHERENCE (TARGET STATE)

In SINGLE-RUN coherence, all five artifacts in the governed set carry the same run identity value:

```
run_id: <current_run>
  ├── coverage_state.json          run_id          = <current_run>
  ├── reconstruction_state.json    run_id          = <current_run>
  ├── canonical_topology.json      run_reference   = <current_run>
  ├── signal_registry.json         run_reference   = <current_run>
  └── gauge_state.json             run_id          = <current_run>
```

**Conditions for MODE A:**
- MA-01: All four input artifacts carry run identity values equal to the current chain execution's `run_id`
- MA-02: `gauge_state.json` is computed from these four artifacts in a single computation pass
- MA-03: No artifact in the set was produced by a prior chain execution (no STATIC artifact unless hash-inherited per FRESH-R4 with the same `run_id` — which is not possible across different runs; FRESH-R4 produces artifacts carrying the inherited run's identity, making the set MODE B by declaration)

MODE A is the target state for GOVERNED AND FRESH THROUGH S4. It eliminates the LAYERED multi-run situation from GAUGE.PROVENANCE.PROOF.01.

### MODE B — GOVERNED RUN-FAMILY COHERENCE (TRANSITIONAL PERMITTED STATE)

In GOVERNED RUN-FAMILY coherence, artifacts may carry different run identity values, provided their relationship is explicitly declared in a coherence record. This mode is permitted during the transition from GOVERNED WITH STATIC DEPENDENCY to GOVERNED AND FRESH THROUGH S4.

**Conditions for MODE B:**
- MB-01: All run identity values carried by the five artifacts are declared in a run-family record (Section 4.2)
- MB-02: Each declared run_id in the family corresponds to a chain execution against the same `client_uuid`
- MB-03: The S2 inputs consumed by each run in the family are documented (hash equality may or may not be confirmed — confirmation is required for FRESH reclassification but not for MODE B coherence alone)
- MB-04: The coherence record declares the mode as MODE B explicitly
- MB-05: No run identity value in the set is undeclared in the run-family record

**MODE B does not grant FRESH status.** An artifact set in MODE B may contain STATIC artifacts. MODE B governs the declaration structure, not the freshness of the artifacts. Freshness is governed by FRESH.RUN.BOOTSTRAP.PROTOCOL.01 and confirmed by FRESHNESS.VALIDATION.RUN.01.

**The current system state** (three run references: `run_01_authoritative`, `run_03_blueedge_derivation_validation`, `run_01_blueedge`) is a LAYERED state that must be formalized as MODE B by creating a coherence record declaring all three run references and their relationship. Without such a record, the state is GOVERNED (artifacts are declared in provenance proof) but not COHERENT under this contract.

---

## SECTION 4 — RUN DECLARATION MODEL

### 4.1 Per-Artifact Run Identity Declaration

Each artifact in the governed set must carry its producing run's identity in a declared field:

| artifact | run identity field | field format | required |
|----------|------------------|--------------|---------|
| `coverage_state.json` | `run_id` | string | MANDATORY |
| `reconstruction_state.json` | `run_id` | string | MANDATORY |
| `canonical_topology.json` | `run_reference` | string | MANDATORY |
| `signal_registry.json` | `run_reference` | string | MANDATORY — if absent, declare in coherence record with external evidence |
| `gauge_state.json` | `run_id` | string | MANDATORY |

An artifact that does not carry a run identity field in its content must have its run origin declared externally in the coherence record with evidence (e.g., file emission date, git commit, or package manifest reference). An artifact with no run identity field and no coherence record entry is an orphan artifact (prohibited per Section 6).

### 4.2 Coherence Record

The coherence record is a JSON file, `coherence_record.json`, written at the time the artifact set is assembled for GAUGE consumption. It must be present in the client's run package directory alongside the consumed artifacts, or at the path declared in `intake_record.json`.

**Required structure:**

```json
{
  "coherence_record_id": "<unique identifier for this coherence declaration>",
  "client_uuid": "<client identifier>",
  "declared_at": "<ISO 8601 timestamp>",
  "coherence_mode": "MODE_A | MODE_B",
  "consuming_run_id": "<current chain execution run_id>",
  "artifact_set": {
    "coverage_state": {
      "path": "<file path>",
      "run_id": "<value from artifact>",
      "classification": "FRESH | STATIC",
      "source_run_id": "<if STATIC: the prior run this was taken from>"
    },
    "reconstruction_state": {
      "path": "<file path>",
      "run_id": "<value from artifact>",
      "classification": "FRESH | STATIC",
      "source_run_id": "<if STATIC: the prior run>"
    },
    "canonical_topology": {
      "path": "<file path>",
      "run_reference": "<value from artifact>",
      "classification": "FRESH | STATIC",
      "source_run_id": "<if STATIC: the prior run>"
    },
    "signal_registry": {
      "path": "<file path>",
      "run_reference": "<value from artifact or declared externally>",
      "classification": "FRESH | STATIC",
      "source_run_id": "<if STATIC: the prior run>",
      "runtime_required_compliant": true
    }
  },
  "run_family": [
    {
      "run_id": "<run identity value>",
      "artifact_roles": ["<artifact names produced by this run>"],
      "source_version": "<source version string if known>",
      "hash_equality_with_consuming_run": true | false | null
    }
  ],
  "coherence_verdict": "COHERENT | NOT COHERENT",
  "coherence_mode_satisfied": true | false,
  "violations": []
}
```

**MODE A:** `run_family` array contains exactly one entry. All artifact run identities match the single entry's `run_id`.

**MODE B:** `run_family` array contains one entry per distinct run identity value across the artifact set. Each artifact's `run_id` / `run_reference` must appear in the `run_family` array.

### 4.3 Alignment with Bootstrap Protocol

The coherence record must be consistent with the run's `intake_record.json` (FRESH.RUN.BOOTSTRAP.PROTOCOL.01 Section 8):

- The `consuming_run_id` in the coherence record must match the `run_id` in `intake_record.json`
- Every STATIC artifact in the coherence record's `artifact_set` must have a corresponding `dependency_table` entry in `intake_record.json` (FRESH.RUN.BOOTSTRAP.PROTOCOL.01 Section 4.1)
- Hash equality claims in the coherence record must match hash equality claims in `intake_record.json`'s dependency table

Contradiction between `coherence_record.json` and `intake_record.json` is a coherence violation.

---

## SECTION 5 — ARTIFACT ALIGNMENT RULES

### 5.1 Shared Scope Compatibility

For artifacts to be aligned, their declared client scope must be compatible:

| rule | code | description |
|------|------|-------------|
| Same client_uuid | AL-01 | All artifacts in the set must carry the same `client_id` or `client_uuid` field. An artifact bound to a different client is not alignable with this set. |
| No cross-client contamination | AL-02 | No artifact may carry a `client_id` that differs from the `client_uuid` declared in `intake_record.json`. |
| Source version compatibility | AL-03 | In MODE B: if `source_version` is declared for any run in the `run_family`, all other runs in the family must either carry the same `source_version` or explicitly declare the version relationship (upgrade, incremental extension). Incompatible source versions require a new coherence record. |

### 5.2 Dependency Compatibility

Artifacts are dependency-compatible if their chain lineage is non-contradictory:

| rule | code | description |
|------|------|-------------|
| S2 outputs must precede S3 inputs | AL-04 | `canonical_topology.json` and `signal_registry.json` must declare a `run_reference` that corresponds to a chain execution whose S2 inputs are from the same or an ancestor source version as the S2 inputs for `coverage_state.json` and `reconstruction_state.json`. A topology derived from a structurally different S2 output than the coverage/reconstruction state is dependency-incompatible. |
| PSEE coverage must match topology scope | AL-05 | The `required_units` field in `coverage_state.json` must be ≤ the component node count in `canonical_topology.json`. A coverage state targeting more components than the topology declares is a scope mismatch. |
| Signal registry must not exceed topology scope | AL-06 | Each signal in `signal_registry.json` that references topology nodes must reference nodes present in `canonical_topology.json`. Signals referencing nodes absent from the current topology are orphan references. |

### 5.3 Admissible Lineage

| rule | code | description |
|------|------|-------------|
| All run identities declared | AL-07 | Every run identity value appearing in the artifact set must be declared in the coherence record's `run_family` array. An undeclared run identity constitutes inadmissible lineage. |
| No superseded runs without declaration | AL-08 | If a prior run's artifact has been superseded (same artifact type produced again for the same source version), the superseding run must be declared in the coherence record. The superseded run must not appear in the active artifact set unless explicitly retained with justification. |
| schema compliance | AL-09 | All artifacts must conform to their declared `schema_version`. Schema non-compliance (e.g., missing `runtime_required` in `signal_registry.json`) must be declared in the coherence record `violations` array and resolved before GAUGE consumption proceeds. |

---

## SECTION 6 — COHERENCE CONSTRAINTS

The following invariants must hold for the artifact set to be COHERENT:

### CC-01 — No Conflicting Lineage

No two artifacts in the set may carry run identity values that are known to be produced from structurally incompatible S2 inputs, unless hash equality between those S2 inputs has been confirmed. Conflicting lineage exists when:
- `canonical_topology.json` was produced from a structural run with N component entities
- `coverage_state.json` was produced from a PSEE run targeting M ≠ N component entities
- No hash equality between the S2 structural outputs of the two runs is declared

An unresolved structural count divergence between topology and coverage scope constitutes conflicting lineage.

### CC-02 — No Incompatible Scopes

The five artifacts must all bind to the same `client_uuid`. An artifact bound to a different client is outside the coherence scope and may not be included in the artifact set.

The `consuming_run_id` in the coherence record must bind to the `client_uuid` declared in `intake_record.json`. A coherence record whose `consuming_run_id` does not correspond to any declared chain execution for that client is scope-incompatible.

### CC-03 — No Orphan Artifacts

An orphan artifact is an artifact in the governed set that:
- carries no run identity field in its content, AND
- has no entry in the coherence record's `run_family` array providing its run origin

Orphan artifacts are prohibited. Every artifact's run origin must be traceable to a declared chain execution. If an artifact lacks a run identity field (e.g., a `signal_registry.json` with no `run_reference`), its origin must be declared externally in the coherence record with sufficient evidence (Section 4.1).

The specific orphan risk in the current system: `signal_registry.json` at `docs/pios/41.4/signal_registry.json` carries `generated_date: 2026-03-20` but no `run_reference` field. Under this contract, its coherence record entry must declare its run origin from external evidence (git history, package manifest, or equivalent) and classify it as STATIC.

### CC-04 — No Silent Schema Violations

Schema violations (e.g., missing `runtime_required: false` in signal entries) must be declared in the coherence record `violations` array. A violation that is present in an artifact but not declared in the coherence record constitutes a silent schema violation. Silent schema violations are prohibited. Declared violations may be carried as CONDITIONAL PASS for GAUGE consumption only if they do not affect the fields GAUGE reads (per GAUGE.ADMISSIBLE.CONSUMPTION.01 per-surface rules).

---

## SECTION 7 — PROHIBITED COHERENCE PATTERNS

The following patterns constitute coherence violations. An artifact set exhibiting any of these patterns is NOT COHERENT.

| pattern | code | description |
|---------|------|-------------|
| Hidden stitching across runs | PC-01 | Two or more artifacts in the set carry different run identity values and no coherence record declares their run-family relationship. The artifacts appear as a unified set without disclosure of their multi-run origin. This is the prohibited form of the LAYERED state observed in GAUGE.PROVENANCE.PROOF.01 — the state is GOVERNED (provenance proof documents it) but would be NOT COHERENT under this contract until formalized with a coherence record. |
| Undeclared artifact mixing | PC-02 | An artifact from one run is placed in a package directory that belongs to a different run, without a coherence record entry identifying the artifact's actual source run. The artifact appears to belong to the package run when it does not. |
| Partial alignment presented as coherent | PC-03 | A coherence record is produced that covers only a subset of the artifact set, while the remaining artifacts carry undeclared run identity values. A coherence record that does not cover all five artifacts does not satisfy MODE A or MODE B conditions and must not be presented as a coherence declaration. |
| Mixing STATIC and FRESH without declaration | PC-04 | Some artifacts in the set are FRESH (produced by the current chain run) and others are STATIC (produced by prior runs), but the coherence record does not classify each artifact as FRESH or STATIC in the `classification` field. A mixed STATIC/FRESH set is permissible only if declared explicitly and each artifact's classification is recorded. |
| MODE A claimed with multiple run identities | PC-05 | A coherence record declares `coherence_mode: "MODE_A"` while two or more artifacts carry different run identity values. MODE A requires all run identities to be identical. Declaring MODE A with a multi-run artifact set is a false coherence claim. |
| Coherence record run_family incomplete | PC-06 | The coherence record's `run_family` array does not enumerate every distinct run identity value present in the artifact set. An artifact whose run_id / run_reference is not listed in `run_family` is effectively undeclared, constituting hidden stitching (PC-01). |
| Contradicting bootstrap dependency table | PC-07 | The coherence record declares an artifact as FRESH while `intake_record.json`'s dependency table classifies it as STATIC (or vice versa). Contradiction between the coherence record and the bootstrap record is a coherence violation. |

---

## SECTION 8 — S4 CONSUMPTION ADMISSIBILITY

### 8.1 Conditions for GAUGE Consumption

GAUGE may consume the governed artifact set if and only if all of the following conditions pass:

| condition | code | check |
|-----------|------|-------|
| Coherence record present | CA-01 | `coherence_record.json` exists and is accessible at the declared path |
| Coherence mode declared | CA-02 | `coherence_record.json.coherence_mode` is either `"MODE_A"` or `"MODE_B"` |
| All five artifacts declared | CA-03 | `coherence_record.json.artifact_set` contains entries for all five artifacts (coverage_state, reconstruction_state, canonical_topology, signal_registry, gauge_state) |
| run_family complete | CA-04 | Every distinct run identity value in the artifact set appears in `coherence_record.json.run_family` |
| No PC-01 through PC-07 violations | CA-05 | None of the prohibited coherence patterns (Section 7) are present |
| Alignment rules satisfied | CA-06 | All artifact alignment rules AL-01 through AL-09 (Section 5) are satisfied |
| Coherence constraints satisfied | CA-07 | All coherence constraints CC-01 through CC-04 (Section 6) are satisfied |
| signal_registry schema compliant | CA-08 | All entries in `signal_registry.json` carry `runtime_required: false` (Section 2.3); any non-compliance must be declared in `violations` and confirmed as non-blocking per GAUGE.ADMISSIBLE.CONSUMPTION.01 per-surface rules |
| Bootstrap record consistent | CA-09 | `coherence_record.json` is consistent with `intake_record.json`: no contradiction between artifact classifications or run identity declarations |
| gauge_state computation governed | CA-10 | `gauge_state.json` was produced under GAUGE.STATE.COMPUTATION.CONTRACT.01 (confirmed by `gauge_state.json.computed_by` field) and satisfies GC-01 through GC-10 of that contract |

### 8.2 Relationship to Bootstrap Admissibility

CA-01 through CA-10 are evaluated after bootstrap admissibility (FRESH.RUN.BOOTSTRAP.PROTOCOL.01 AC-01–AC-10). A run that failed bootstrap admissibility cannot satisfy CA-09 (bootstrap record consistency) and therefore cannot satisfy S4 consumption admissibility.

The evaluation order is: bootstrap admissibility → coherence admissibility → gauge computation admissibility (GC-01–GC-10) → GAUGE consumption admissibility (GA-01–GA-12).

### 8.3 Relationship to GAUGE.ADMISSIBLE.CONSUMPTION.01

CA-01 through CA-10 govern the coherence of the artifact set. GA-01 through GA-12 (GAUGE.ADMISSIBLE.CONSUMPTION.01) govern the GAUGE product surface's per-artifact consumption rules (which fields GAUGE may read, query lock enforcement, rejection conditions).

CA-01–CA-10 must pass before GA-01–GA-12 are evaluated. A set that passes CA-01–CA-10 is coherence-admissible. A coherence-admissible set must additionally pass GA-01–GA-12 for GAUGE consumption to be fully governed.

---

## SECTION 9 — COHERENCE VERDICT MODEL

### 9.1 COHERENT

An artifact set receives verdict **COHERENT** if and only if:

1. `coherence_record.json` exists and is structurally valid (Section 4.2)
2. `coherence_mode` is declared as MODE A or MODE B
3. All five artifacts are declared in `artifact_set`
4. All run identity values in the artifact set appear in `run_family`
5. Alignment rules AL-01 through AL-09 all pass
6. Coherence constraints CC-01 through CC-04 all pass
7. No prohibited coherence patterns PC-01 through PC-07 are present
8. `coherence_record.json` is consistent with `intake_record.json`
9. `signal_registry.json` is schema-compliant (`runtime_required: false` on all entries) OR non-compliance is declared in `violations` and confirmed as non-blocking

**COHERENT does not imply FRESH.** A COHERENT artifact set may consist entirely of STATIC artifacts (e.g., the current system state, if formalized with a coherence record). Freshness is a separate property governed by FRESH.RUN.BOOTSTRAP.PROTOCOL.01 and confirmed by FRESHNESS.VALIDATION.RUN.01.

**COHERENT + FRESH through S4 = GOVERNED AND FRESH THROUGH S4** (the target declaration).

**COHERENT + STATIC (any artifact) = GOVERNED WITH STATIC DEPENDENCY** (the current system's target formalized state).

### 9.2 NOT COHERENT

An artifact set receives verdict **NOT COHERENT** if any of the following are true:

| condition | code |
|-----------|------|
| `coherence_record.json` is absent | NV-01 |
| `coherence_mode` is absent or is not MODE_A or MODE_B | NV-02 |
| Any artifact in the five-artifact set is missing from `artifact_set` | NV-03 |
| Any run identity value in the set is absent from `run_family` | NV-04 |
| Any of AL-01 through AL-09 fails | NV-05 |
| Any of CC-01 through CC-04 fails | NV-06 |
| Any of PC-01 through PC-07 is present | NV-07 |
| `coherence_record.json` contradicts `intake_record.json` | NV-08 |
| `signal_registry.json` has schema non-compliance declared as blocking | NV-09 |

A NOT COHERENT verdict blocks S4 consumption. GAUGE must not consume a NOT COHERENT artifact set.

### 9.3 Resolving NOT COHERENT

A NOT COHERENT verdict is resolved by:
1. Identifying the NV code(s) causing the verdict
2. Correcting the underlying condition (writing or correcting the coherence record, fixing schema violations, or resolving dependency incompatibility)
3. Re-evaluating the coherence verdict

The coherence verdict is not immutable — it is a function of the current artifact set and coherence record state. Correcting the declaration resolves the verdict without requiring recomputation of the artifacts themselves (unless the non-coherence is due to an artifact-level issue such as a missing `runtime_required` field, which requires artifact correction).

### 9.4 Coherence Verdict Scope

The coherence verdict applies to the artifact set as a whole, not to individual artifacts. An individual artifact may be FRESH or STATIC independently; the coherence verdict evaluates whether the set, as declared in the coherence record, forms a governed unit for S4 consumption.
