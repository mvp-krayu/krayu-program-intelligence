# Deterministic Replay Instrumentation — Design

Stream: PI.PSEE-PIOS.DETERMINISTIC-REPLAY-INSTRUMENTATION.DESIGN.01  
Status: COMPLETE  
Generated: 2026-05-07  
Branch: work/psee-runtime  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A runtime behavior: NO  
  Modifies Lane A scripts (75.x/41.x): NO  
  Implements enriched derivation: NO  
  Advances Lane D governance: YES — deterministic replay instrumentation design issued

Authoritative inputs:
- `docs/psee/PI.PSEE-PIOS.REPLAY-DETERMINISM-GAP-ANALYSIS.01/REPLAY_DETERMINISM_GAP_ANALYSIS.md`
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-REPLAYABILITY-VALIDATION.REVIEW.01/SEMANTIC_REPLAYABILITY_VALIDATION_REVIEW.md`
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-TRACEABILITY-OBSERVABILITY.DESIGN.01/SEMANTIC_TRACEABILITY_OBSERVABILITY.md`
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-PROVENANCE-INSTRUMENTATION.IMPLEMENTATION.01/SEMANTIC_PROVENANCE_INSTRUMENTATION.md`
- `artifacts/psee_semantic_provenance/fastapi/run_02_oss_fastapi_pipeline/semantic_provenance.json`
- `artifacts/psee_advisory/fastapi/run_02_oss_fastapi_pipeline/participation_advisory.json`
- `artifacts/psee_gate/fastapi/run_02_oss_fastapi_pipeline/gate_evaluation.json`
- `docs/governance/psee_enrichment_schema.json`

Current maturity state (inherited from gap analysis):

| Property | Current State |
|----------|--------------|
| Replayability | PARTIALLY_REPLAYABLE |
| Determinism | PARTIALLY_DETERMINISTIC |
| Reproducibility | NOT YET ASSESSED |
| Authority readiness | NOT READY |
| MDR requirements met | 0 of 10 |
| Governance-blocking nondeterminism sources | 5 of 6 (PND-02..PND-06) |

---

## 1. Purpose

This design defines the authoritative deterministic replay instrumentation model for the PSEE enrichment participation system. It specifies what structures, ordering guarantees, dependency closures, and consistency rules must be designed and implemented before semantic provenance replay can be considered deterministic, governance-auditable, and stable across evaluator versions.

**This design does not implement anything.** It defines requirements, schema specifications, and behavioral contracts for a subsequent implementation stream (PI.PSEE-PIOS.DETERMINISTIC-REPLAY-INSTRUMENTATION.IMPLEMENTATION.01).

**This design does not authorize semantic participation.** Deterministic replay is a technical property enabling governance audit. It does not constitute semantic authority. Authority requires a separate, explicit governance action by the governance authority.

**This design does not advance participation mode.** The system remains at OBSERVATIONAL_ONLY.

**Governing principle of this document:**

> **Deterministic replay instrumentation makes governance audit possible. It does not make governance authorization automatic. The path is: determinism → audit → authority review → explicit authorization. Each step requires distinct governance action. No technical achievement substitutes for governance authorization.**

---

## 2. Deterministic Replay Model

### 2.1 Five Distinct Concepts

The deterministic replay model requires five concepts to be kept rigorously distinct. Conflating any two produces governance error.

---

#### DRM-C1: Replayability

**Definition:** The property of a provenance artifact stack such that, given only the existing artifacts (without re-executing the source pipeline), every advisory and degradation event can be reproduced.

**Current state:** PARTIALLY_REPLAYABLE — advisory evaluator is deterministic by design but advisory artifacts are not self-describing (AL-02, AL-03, AL-08 absent). An auditor with only participation_advisory.json cannot cold-reconstruct trigger conditions.

**Requirement for full replayability:** Self-describing advisory artifacts + empirically validated consistency across N=3 reference runs.

---

#### DRM-C2: Replay Determinism

**Definition:** The property of the advisory evaluator and capture script such that, given identical input artifacts (excluding time-varying fields), every execution produces identical output in all replay-stable fields.

**Current state:** PARTIALLY_DETERMINISTIC — core logic is deterministic; five governance-blocking nondeterminism sources exist in the provenance schema (PND-02..PND-06).

**Requirement for full replay determinism:** All replay-stable fields must be deterministic; all time-varying fields must be formally identified and excluded from identity comparison; all version-dependent fields must be computed dynamically from artifact content.

---

#### DRM-C3: Replay Normalization

**Definition:** The process of transforming provenance artifacts into a canonical form suitable for cross-run, cross-version comparison — eliminating time-varying variation, applying stable identity keys, and resolving ordering ambiguity.

**Current state:** NOT DESIGNED — no normalization process exists. Cross-run comparison would naively include timestamps, advisory_id sequencing artifacts, and hardcoded gap lists that differ for non-deterministic reasons.

**Requirement for replay normalization:** A defined normalization algorithm (specified in Section 5) producing a normalized provenance record that is deterministic across time and version for identical semantic inputs.

---

#### DRM-C4: Replay Reproducibility

**Definition:** The property of the full pipeline such that, given the same raw source inputs through the same execution path (40.x → psee_handoff → advisory → provenance), the system produces identical semantic provenance end-to-end.

**Current state:** NOT YET ASSESSED — individual evaluators are deterministic by design; full pipeline re-execution has not been validated. Source artifact immutability is not formally defined.

**Requirement for full reproducibility:** Artifact immutability policy + full pipeline re-execution test across N=3 reference runs confirming identical provenance at each layer.

---

#### DRM-C5: Semantic Authority

**Definition:** The governance-authorized right to influence activation decisions inside the 75.x CONDITION ACTIVATION layer. A governance property — not a technical property.

**Current state:** BLOCKED — `semantic_authority: "BLOCKED"` in all provenance artifacts; `activation_authorized: false` hardcoded in gate evaluator; no 75.x coupling exists; participation_mode: OBSERVATIONAL_ONLY.

**No technical property implies semantic authority.** Full replay determinism, complete reproducibility, and passing all MDT requirements defined in Section 8 does not authorize semantic participation. Authority requires an explicit governance action by the governance authority.

---

### 2.2 Replay Sequencing Expectations

Deterministic replay follows a fixed four-step sequence. Each step has defined inputs, outputs, and validation checkpoints.

---

#### STEP-R1: Source Artifact Verification

**Action:** Verify that replay source artifacts are identical to those used in the original evaluation.

**Inputs required:** gate_evaluation.json, psee_binding_envelope.json (original run)

**Verification method:** sha256 hash comparison against hashes recorded in replay_causality.json (MDR-10)

**Pass criterion:** All artifact hashes match recorded values

**Fail-closed behavior:** If any hash mismatches → mark replay as REPLAY_INPUT_CONTAMINATED → halt replay

---

#### STEP-R2: Session Identity Verification

**Action:** Verify that gate_evaluation.json and participation_advisory.json share a valid session_id.

**Inputs required:** session_id field in both artifacts (MDR-04)

**Verification method:** session_id values must match between artifacts

**Pass criterion:** session_ids match

**Fail-closed behavior:** If session_ids absent OR mismatched → mark replay as SESSION_IDENTITY_BROKEN → halt replay

---

#### STEP-R3: Advisory Evaluator Re-execution

**Action:** Re-execute evaluate_enrichment_participation.py against verified source artifacts.

**Output:** new_participation_advisory.json

**Pass criterion:** Completion without exception; advisory_mode = ADVISORY_ONLY_MODE; runtime_impact = NONE

---

#### STEP-R4: Replay Normalization and Comparison

**Action:** Normalize both original and new participation_advisory.json using stable identity keys; compare normalized records; produce replay_diff.json.

**Pass criterion:** All stable-field identity keys match between original and new advisory → replay verdict = IDENTICAL

**Fail-closed behavior:** Any DIVERGED advisory → REPLAY_DRIFT_DETECTED; investigation required

---

### 2.3 Replay Reconstruction Guarantees

The following guarantees define what deterministic replay asserts. Each is bounded.

| Guarantee | Scope | Boundary |
|-----------|-------|----------|
| G-REPL-01: Advisory type stability | Same inputs → same advisory_type for each advisory | Bounded by script version (version tag required) |
| G-REPL-02: Advisory state stability | Same inputs → same advisory_state for each advisory | Same |
| G-REPL-03: Enrichment inputs stability | Same inputs → same enrichment_inputs_used (as sorted set) per advisory | Same |
| G-REPL-04: Degradation event stability | Same inputs → same degradation event set by (event_type, affected_field) | Same |
| G-REPL-05: Provenance chain stability | Same artifacts → same provenance chain steps (artifact roles, artifact paths) | Requires artifact immutability |
| G-REPL-06: Gate result stability | Same inputs → same gate results (G-01..G-09 PASS/FAIL) | Requires gate logic stability |

**Guarantees do NOT cover:**
- Timestamps (time-varying by definition)
- advisory_id values (sequential counter, ordering-dependent)
- observability_state values prior to MDR-06 implementation (version-dependent)
- lineage_gaps prior to MDR-05 implementation (hardcoded)
- ultimate_source attribution prior to MDR-03 implementation (script-version-dependent)

---

### 2.4 Replay Consistency Boundaries

| Boundary Type | Within Boundary | Across Boundary |
|--------------|-----------------|-----------------|
| Script version | Full determinism guaranteed | Requires stable identity keys (MDR-01) + version tagging |
| Run_id (single client) | Determinism guaranteed if artifacts immutable | Requires artifact hashing (STEP-R1) |
| Client (different clients) | Determinism of logic guaranteed; input values may differ | N=3 cross-client comparison required |
| Evaluator update | Determinism breaks at advisory_id level | Stable identity key (MDR-01) preserves comparison |
| Format extension (AL-02/03/08 added) | Pre-extension: PARTIAL consistency | Post-extension: observability_state advances to COMPLETE |

---

## 3. Provenance Ordering Stabilization

### 3.1 Deterministic Lineage Ordering

The provenance chain must have a fixed, deterministic ordering. Three artifacts in the current stack; five provenance types eventually. The ordering is structurally defined by data dependency — each step's output is a required input to the next step.

**Canonical ordering (current):**

```
STEP 1: gate_evaluation.json
  [evaluate_psee_gate.py reads: psee_binding_envelope.json, vault_readiness.json,
   canonical_topology.json, grounding_state_v3.json]
  [produces: activation_state, G-01..G-09 results, bp_01_resolved, bp_02_resolved]

STEP 2: psee_binding_envelope.json
  [add_psee_enrichment_stubs.py reads: canonical_topology.json, grounding_state_v3.json,
   vault_readiness.json]
  [produces: psee_context, ceu_topology, structural_overlap, selector_context, evidence_state]
  [NOTE: Step 2 is logically prior to Step 1 in the data dependency chain, though
   both read the same source artifacts. The gate evaluator reads Step 2's output.]

STEP 3: participation_advisory.json
  [evaluate_enrichment_participation.py reads: STEP 1 output + STEP 2 output]
  [produces: advisories[], degradation_state, enrichment_inputs_present/missing]

STEP 4 (current): semantic_provenance.json
  [capture_semantic_provenance.py reads: STEP 1 + STEP 2 + STEP 3 outputs]
  [produces: advisory_lineage, degradation_lineage, provenance_chain, replay_readiness]

STEP 5 (new): replay_causality.json
  [produced alongside Step 4, from same inputs]
  [records: artifact hashes, evaluator version hashes, stable advisory identity keys,
   replay-stable field values]
```

**Required stability property:** This ordering must be embedded in semantic_provenance.json as a formal `provenance_chain` sequence, with each step's artifact_path, artifact_type, and sha256 hash of the artifact at evaluation time.

---

### 3.2 Provenance Timestamp Normalization

**Problem:** Every artifact carries runtime-generated timestamps. Two executions of the same script with identical inputs produce different timestamps. Naive comparison incorrectly reports divergence.

**Design: Replay-Stable Field Taxonomy**

All fields in all PSEE provenance artifacts must be classified into one of three categories. This taxonomy is the authoritative reference for any replay comparator.

---

#### TAXONOMY-01: REPLAY_STABLE Fields

These fields are deterministic given identical inputs. They must match between original and replay in all stable-field identity comparisons.

**gate_evaluation.json REPLAY_STABLE fields:**
- activation_state, bp_01_resolved, bp_02_resolved, activation_authorized
- readiness_status, grounding_ratio, cluster_count
- gate_results[*].gate_id, gate_results[*].result, gate_results[*].observed_value
- evaluator_authority, zero_impact_guarantee[*]

**participation_advisory.json REPLAY_STABLE fields:**
- advisory_mode, participation_mode, activation_state
- bp_01_status, bp_02_status, activation_authorized, enriched_participation
- enrichment_inputs_present[] (as sorted set), enrichment_inputs_missing[] (as sorted set)
- degradation_state, advisory_count, evaluator_authority, runtime_impact, zero_impact_guarantee[*]
- Per advisory: advisory_type, advisory_state, advisory_reason, enrichment_inputs_used[] (as sorted set)
- observability_status.[*] (all boolean fields)

**semantic_provenance.json REPLAY_STABLE fields:**
- activation_state, participation_mode, semantic_authority, advisory_count
- Per advisory lineage: advisory_type, advisory_state, advisory_reason
- Per advisory lineage originating_enrichment_inputs: field, observed_value, source_artifact, ultimate_source, derivation_status
- Per advisory lineage governance_gate_state: all subfields
- Per advisory lineage: observability_state (AFTER MDR-06 — dynamic computation implemented)
- Per advisory lineage: lineage_gaps[] (AFTER MDR-05 — dynamic computation implemented)
- Per degradation event: event_type, degradation_reason, degradation_scope, degradation_visibility, degradation_replayable, source_artifact, affected_field, observed_value, advisory_refs, ultimate_source, modes_blocked
- Per provenance chain step: artifact_type, artifact_path, provenance_type, present, fields_consumed
- provenance_completeness.[*].status
- replay_supported, replay_readiness.[*], replay_gaps[] (as sorted set)
- runtime_impact, evaluator_authority, zero_impact_guarantee[*]

---

#### TAXONOMY-02: TIME_VARYING Fields

These fields are intentionally non-deterministic — they represent when the evaluation occurred. They must be excluded from all stable-field identity comparisons.

- gate_evaluation.json: `evaluated_at`
- participation_advisory.json: `evaluated_at`, per advisory `emitted_at`
- semantic_provenance.json: `captured_at`, per degradation event `captured_at`

---

#### TAXONOMY-03: VERSION_DEPENDENT Fields

These fields are deterministic within a script version but may change when scripts are updated. Until MDR-05/MDR-06 are implemented, these are version-dependent. After MDR-05/MDR-06, they become REPLAY_STABLE (promoted from VERSION_DEPENDENT).

**Before MDR-05/MDR-06:**
- semantic_provenance.json per advisory lineage: `observability_state` (hardcoded "PARTIAL")
- semantic_provenance.json per advisory lineage: `lineage_gaps[]` (hardcoded constant)
- semantic_provenance.json per advisory lineage originating_enrichment_inputs: `ultimate_source`, `derivation_status` (from ENRICHMENT_SOURCE_MAP in capture script)

**After MDR-05/MDR-06/MDR-03:** All three promoted to REPLAY_STABLE.

**Version tagging requirement:** Until all VERSION_DEPENDENT fields are promoted to REPLAY_STABLE, semantic_provenance.json must include a `capture_script_version` field (sha256 hash of capture_semantic_provenance.py at execution time). Replay comparators must enforce that both records use the same capture script version before comparing VERSION_DEPENDENT fields.

---

### 3.3 Advisory Replay Ordering

**Problem:** Advisory IDs (ADV-001, ADV-002) are sequential counters. If the evaluator evaluation order changes, the same trigger produces differently-numbered advisories. JSON array order is not semantically significant.

**Design: Stable Advisory Identity Key**

```
advisory_identity_key = (
    advisory_type: str,
    advisory_state: str,
    enrichment_inputs_used_key: frozenset(str)  # sorted tuple representation in JSON
)
```

**JSON representation of stable identity key** (new field added to each advisory record):

```json
{
  "advisory_id": "ADV-001",
  "advisory_stable_key": {
    "advisory_type": "confidence_downgrade",
    "advisory_state": "CONTEXT_INCOMPLETE",
    "enrichment_inputs_key": ["evidence_state.evidence_confidence"]
  },
  ...
}
```

The `enrichment_inputs_key` array is always sorted lexicographically, regardless of evaluation order.

**Replay comparison algorithm for advisories:**
1. Extract advisory_stable_key from each advisory record in both original and replay
2. Build a dict keyed by advisory_stable_key
3. Compare stable-field values for matching keys
4. Flag: NEW_IN_REPLAY, MISSING_IN_REPLAY, STATE_MISMATCH

**Ordering-stable guarantee:** The same trigger conditions produce the same advisory_stable_key regardless of evaluation order or advisory_id assignment.

---

### 3.4 Degradation Replay Ordering

**Problem:** Degradation event IDs (DEG-001..DEG-004) are sequential. Parallel to advisory ordering problem.

**Design: Stable Degradation Identity Key**

```
degradation_identity_key = (
    event_type: str,
    affected_field: str
)
```

**JSON representation:**

```json
{
  "event_id": "DEG-001",
  "degradation_stable_key": {
    "event_type": "EVIDENCE_INCOMPLETE",
    "affected_field": "evidence_state.evidence_confidence"
  },
  ...
}
```

**Advisory refs normalization:** Within each degradation event, advisory_refs must be stored as advisory_stable_keys, not advisory_ids:

```json
"advisory_refs_stable": [
  {"advisory_type": "confidence_downgrade", "advisory_state": "CONTEXT_INCOMPLETE",
   "enrichment_inputs_key": ["evidence_state.evidence_confidence"]},
  {"advisory_type": "evidence_insufficiency", "advisory_state": "PENDING_DERIVATION",
   "enrichment_inputs_key": ["evidence_state.evidence_confidence",
                             "selector_context.selector_confidence",
                             "structural_overlap.edge_count"]}
]
```

---

### 3.5 Stable Ordering Requirements Summary

| Ordering Dimension | Current State | Required Change |
|--------------------|--------------|-----------------|
| Provenance chain steps | Step indices 1–3; artifact_type + path | Add sha256 hash per step (MDR-10) |
| Advisory ordering in arrays | Sequential advisory_id (nondeterministic) | Add advisory_stable_key to each record |
| Advisory comparison | By advisory_id | By advisory_stable_key |
| Degradation ordering | Sequential event_id | Add degradation_stable_key to each record |
| Degradation advisory_refs | By advisory_id (fragile) | By advisory_stable_key (advisory_refs_stable) |
| Timestamp fields | Present in comparison | Excluded via TAXONOMY-02 |
| Version-dependent fields | No version tag | capture_script_version hash required |

---

## 4. Replay Dependency Closure

### 4.1 Dependency Classes and Current Status

Five dependency classes are assessed against the closure standard: a dependency is **CLOSED** when its inputs are guaranteed stable between evaluation and replay; **PARTIALLY CLOSED** when inputs are present but immutability or version stability is not enforced; **UNRESOLVED** when a structural design gap prevents closure.

---

#### DEP-01: Enrichment Dependencies

**What:** psee_binding_envelope.json depends on canonical_topology.json, grounding_state_v3.json, vault_readiness.json.

**Closure requirement:** These source artifacts must be immutable between the original evaluation and any replay attempt. If add_psee_enrichment_stubs.py is re-run with updated source artifacts before replay, replay uses different inputs.

**Current status: PARTIALLY CLOSED**
- All source artifacts present for run_02
- No artifact immutability policy exists
- No sha256 hash of source artifacts recorded in psee_binding_envelope.json

**Design requirement (DEP-01-REQ):** psee_binding_envelope.json must include `psee_enrichment_meta.source_artifacts` block listing the artifact paths and sha256 hashes of all source artifacts used to produce it:

```json
"psee_enrichment_meta": {
  "generated_at": "...",
  "source_artifacts": {
    "canonical_topology": {
      "path": "structure/40.4/canonical_topology.json",
      "sha256": "<hash>"
    },
    "grounding_state": {
      "path": "ceu/grounding_state_v3.json",
      "sha256": "<hash>"
    },
    "vault_readiness": {
      "path": "vault/vault_readiness.json",
      "sha256": "<hash>"
    }
  },
  "source_map": { ... }  // PT-02 gap closure — field-level attribution
}
```

**Path to CLOSED:** Implement DEP-01-REQ in add_psee_enrichment_stubs.py.

---

#### DEP-02: Advisory Dependencies

**What:** participation_advisory.json depends on psee_binding_envelope.json (enrichment values) and gate_evaluation.json (activation state, gate results).

**Closure requirement:** Both input artifacts must be immutable and version-identified. The advisory evaluator version must be recorded.

**Current status: PARTIALLY CLOSED**
- Both artifacts present
- No sha256 hashes of inputs recorded in advisory artifact
- No advisory evaluator version identifier
- activation_state consumed from gate_evaluation.json but individual gate results not consumed

**Design requirement (DEP-02-REQ):** participation_advisory.json must include an `evaluation_context` block:

```json
"evaluation_context": {
  "evaluator_script_version": "<sha256 of evaluate_enrichment_participation.py>",
  "input_artifacts": {
    "gate_evaluation": {
      "path": "artifacts/psee_gate/<client>/<run_id>/gate_evaluation.json",
      "sha256": "<hash>",
      "session_id": "<session_id>"
    },
    "psee_binding_envelope": {
      "path": "clients/<client>/psee/runs/<run_id>/binding/psee_binding_envelope.json",
      "sha256": "<hash>"
    }
  },
  "session_id": "<session_id>"
}
```

**Session ID specification (MDR-04):**
The session_id is computed as:
```
session_id = sha256(
    client_id + "|" + run_id + "|" +
    gate_evaluation.evaluated_at + "|" +
    sha256(gate_evaluation.json content)
)
```

This hash is deterministic for a given gate evaluation instance. It is embedded in both gate_evaluation.json (at generation time) and participation_advisory.json (at advisory evaluation time). If gate_evaluation.json is regenerated, the session_id changes — and any advisory that read the old gate evaluation cannot claim the same session.

**Path to CLOSED:** Implement DEP-02-REQ in evaluate_enrichment_participation.py + evaluate_psee_gate.py (session_id generation).

---

#### DEP-03: Degradation Dependencies

**What:** semantic_provenance.json degradation_lineage depends on psee_binding_envelope.json (observed values), gate_evaluation.json (activation_authorized), and participation_advisory.json (advisory_refs).

**Closure requirement:** ENRICHMENT_SOURCE_MAP in the capture script must be artifact-bound, not compile-time constant. advisory_refs must use advisory_stable_keys.

**Current status: PARTIALLY CLOSED**
- All source artifacts present
- ENRICHMENT_SOURCE_MAP hardcoded (PND-03)
- advisory_refs use advisory_ids, not advisory_stable_keys

**Design requirement (DEP-03-REQ):**
1. Migrate ENRICHMENT_SOURCE_MAP to `psee_enrichment_meta.source_map` in psee_binding_envelope.json (MDR-03 / PT-02 closure). The capture script reads source attribution from the artifact, not from a compile-time constant.
2. Replace advisory_refs with advisory_refs_stable in all degradation events (see Section 3.4)

**Path to CLOSED:** Implement DEP-03-REQ in add_psee_enrichment_stubs.py (source_map extension) + capture_semantic_provenance.py (read source_map from artifact; use advisory_stable_keys for advisory_refs_stable).

---

#### DEP-04: Governance Gate Dependencies

**What:** Gate results (G-01..G-09 PASS/FAIL) depend on fixed threshold logic in evaluate_psee_gate.py and the values in source artifacts (vault_readiness, canonical_topology, grounding_state, psee_binding_envelope).

**Closure requirement:** Gate evaluator version must be recorded; source artifacts must be hashed.

**Current status: PARTIALLY CLOSED**
- Gate evaluator is deterministic and correct
- No evaluator version identifier recorded
- Source artifact hashes not recorded in gate_evaluation.json

**Design requirement (DEP-04-REQ):** gate_evaluation.json must include:

```json
"evaluation_context": {
  "evaluator_script_version": "<sha256 of evaluate_psee_gate.py>",
  "input_artifact_hashes": {
    "psee_binding_envelope": "<sha256>",
    "vault_readiness": "<sha256>",
    "canonical_topology": "<sha256>",
    "grounding_state": "<sha256>"
  },
  "session_id": "<session_id>"
}
```

**Path to CLOSED:** Implement DEP-04-REQ in evaluate_psee_gate.py.

---

#### DEP-05: Provenance Continuity Dependencies

**What:** semantic_provenance.json requires a formal, verifiable link from all three source artifacts to the provenance capture record.

**Closure requirement:** Provenance chain entries must include artifact hashes; session_id must link gate and advisory artifacts; capture script version must be recorded.

**Current status: UNRESOLVED**
- Provenance chain present but without artifact hashes
- No session_id linking gate + advisory
- ENRICHMENT_SOURCE_MAP version-dependent (PND-03)
- observability_state hardcoded (PND-04)
- lineage_gaps hardcoded (PND-05)

**Design requirement (DEP-05-REQ):** semantic_provenance.json must include in each provenance chain step:

```json
{
  "step": 1,
  "artifact_type": "readiness_provenance",
  "artifact_path": "...",
  "sha256": "<hash>",
  "session_id": "<session_id>",
  "evaluator_script_version": "<hash of evaluate_psee_gate.py>",
  ...
}
```

Plus the capture script must record its own version:

```json
"capture_context": {
  "capture_script_version": "<sha256 of capture_semantic_provenance.py>",
  "captured_at": "...",
  "session_id": "<session_id>"
}
```

**Path to CLOSED:** Implement DEP-05-REQ in capture_semantic_provenance.py + dependencies on DEP-02-REQ and DEP-04-REQ (session_id from upstream artifacts).

---

### 4.2 Dependency Closure Summary

| Dependency Class | Current Status | Blocking Gap | Path to Closed |
|-----------------|---------------|--------------|----------------|
| DEP-01: Enrichment | PARTIALLY CLOSED | No source artifact hashes in psee_binding_envelope.json | DEP-01-REQ: source_artifacts block + source_map |
| DEP-02: Advisory | PARTIALLY CLOSED | No input hashes, no session_id, no evaluator version | DEP-02-REQ: evaluation_context block + session_id |
| DEP-03: Degradation | PARTIALLY CLOSED | ENRICHMENT_SOURCE_MAP compile-time; advisory_refs non-stable | DEP-03-REQ: migrate to source_map + advisory_refs_stable |
| DEP-04: Gate | PARTIALLY CLOSED | No evaluator version, no artifact hashes in gate output | DEP-04-REQ: evaluation_context in gate_evaluation.json |
| DEP-05: Provenance continuity | UNRESOLVED | Session linking absent; script version absent; dynamic fields absent | DEP-05-REQ: requires DEP-02 + DEP-04 + MDR-05/06 |

**All dependencies are closeable.** None requires derivation authorization. None requires participation mode advancement. None modifies runtime behavior.

---

## 5. Deterministic Reconstruction Rules

### 5.1 Advisory Replay Normalization Rules

These rules define how advisory records must be normalized before replay comparison. Each rule applies during replay normalization step (STEP-R4).

---

#### RULE-ADV-01: Identity Normalization

**Rule:** Advisory records must be matched by advisory_stable_key, not advisory_id.

**Algorithm:**
1. Extract advisory_stable_key from each advisory in both records
2. Build comparison map keyed by advisory_stable_key
3. Match records by key; report unmatched as NEW_IN_REPLAY or MISSING_IN_REPLAY

**Violation:** Using advisory_id for comparison — produces false DIVERGED when evaluation order changes

**Required artifact field:** `advisory_stable_key` object in each advisory record (see Section 3.3)

---

#### RULE-ADV-02: Time-Varying Field Exclusion

**Rule:** Fields in TAXONOMY-02 (emitted_at, evaluated_at) must be excluded from stable-field comparison.

**Algorithm:** Before comparison, remove all TAXONOMY-02 fields from both normalized records.

**Violation:** Including timestamps in comparison — produces false DIVERGED on every replay

---

#### RULE-ADV-03: Input Sorting Normalization

**Rule:** Array fields that represent sets (enrichment_inputs_used, enrichment_inputs_present, enrichment_inputs_missing) must be sorted lexicographically before comparison.

**Rationale:** The advisory evaluator processes fields in a fixed order (produces stable output currently), but future extensions could process in different order. Sorting eliminates ordering ambiguity.

**Algorithm:** Sort all set-valued arrays alphabetically before comparison.

---

#### RULE-ADV-04: Version-Dependent Field Gating

**Rule:** TAXONOMY-03 (VERSION_DEPENDENT) fields must be compared only between records produced by the same capture script version (matching capture_script_version hashes). Cross-version comparison of VERSION_DEPENDENT fields is forbidden.

**Algorithm:**
1. Compare `capture_context.capture_script_version` between records
2. If equal: include VERSION_DEPENDENT fields in comparison
3. If unequal: exclude VERSION_DEPENDENT fields; mark comparison as CROSS_VERSION

**Violation:** Comparing observability_state or lineage_gaps across script versions — produces false DIVERGED when gaps are closed by script updates

---

### 5.2 Degradation Replay Normalization Rules

---

#### RULE-DEG-01: Event Identity Normalization

**Rule:** Degradation events matched by degradation_stable_key `(event_type, affected_field)`, not event_id.

**Algorithm:** Same pattern as RULE-ADV-01 but applied to degradation events.

**Required artifact field:** `degradation_stable_key` object in each degradation event record

---

#### RULE-DEG-02: Advisory Reference Normalization

**Rule:** advisory_refs within degradation events must be compared using advisory_stable_keys (advisory_refs_stable field), not advisory_ids (advisory_refs field).

**Algorithm:** During normalization, replace advisory_refs strings with advisory_stable_key objects from the advisory records. Compare advisory_refs_stable, not advisory_refs.

**Violation:** Comparing advisory_refs by advisory_id — produces false DIVERGED when advisory IDs shift due to evaluator ordering change

---

#### RULE-DEG-03: Placeholder Disambiguation

**Rule:** DEG-002 (STRUCTURAL_OVERLAP_PENDING) comparison requires `structural_overlap.edge_count_derivation_status` to be present in psee_binding_envelope.json. If derivation_status is absent, the comparison must be marked AMBIGUOUS — cannot determine whether a later edge_count=0 represents a true zero or a new placeholder.

**Algorithm:**
1. If structural_overlap.edge_count_derivation_status = "PLACEHOLDER" in both records → comparison is VALID_PLACEHOLDER (deterministically same degradation type)
2. If derivation_status = "DERIVED_ZERO" in replay but "PLACEHOLDER" in original → mark as DEGRADATION_STATE_TRANSITION (degradation resolved)
3. If derivation_status absent → mark as AMBIGUOUS; investigation required

**Required schema extension:** `structural_overlap.edge_count_derivation_status` field in psee_enrichment_schema.json (MDR-08)

---

### 5.3 Provenance Reconstruction Stability Rules

---

#### RULE-PROV-01: Script Version Tagging

**Rule:** semantic_provenance.json must include `capture_context.capture_script_version` (sha256 hash of capture_semantic_provenance.py at execution time). Any comparison that cannot verify script version must restrict to REPLAY_STABLE fields only.

---

#### RULE-PROV-02: Input Artifact Hash Verification

**Rule:** Before replay comparison, verify that input artifacts used in replay match the hashes recorded in the original provenance record's evaluation_context blocks.

**Algorithm:** Compare each artifact's current sha256 against recorded hash in:
- gate_evaluation.json `evaluation_context.input_artifact_hashes`
- participation_advisory.json `evaluation_context.input_artifacts.[*].sha256`
- semantic_provenance.json `provenance_chain.[*].sha256`

**Violation:** Skipping hash verification — allows silent input contamination (CONTAIN-05 failure mode)

---

#### RULE-PROV-03: Session Identity Verification

**Rule:** gate_evaluation.json and participation_advisory.json must share matching session_ids before their combination is accepted as a valid provenance pair.

**Algorithm:** Compare session_id fields in both artifacts. Mismatch → SESSION_IDENTITY_BROKEN → replay invalid.

---

### 5.4 Replay Causality Consistency Rules

---

#### RULE-CAUSAL-01: Degradation Visibility Coverage

**Rule:** Every degradation event captured in semantic_provenance.json degradation_lineage must be either:
- Referenced by at least one advisory in participation_advisory.json (via advisory_refs_stable), OR
- Explicitly classified as `"degradation_source": "GATE_ONLY"` (meaning: captured from gate_evaluation.json gate results only; no advisory counterpart by design)

**DEG-004 application:** After MDR-07 (DEG-004 advisory emission) is implemented, DEG-004 must have at least one advisory_refs_stable entry. Until then, DEG-004 must be explicitly classified as GATE_ONLY with a note that MDR-07 is pending.

**Violation:** DEG-004 has advisory_refs = [] and no GATE_ONLY classification — the current state. This is the accountability gap that MDR-07 closes.

---

#### RULE-CAUSAL-02: Bidirectional Advisory-Degradation Linkage

**Rule:** Each advisory record must carry a `degradation_event_refs_stable` array (reverse of advisory_refs_stable in degradation events) listing the degradation events that caused or are associated with this advisory.

**Format:**

```json
"degradation_event_refs_stable": [
  {"event_type": "EVIDENCE_INCOMPLETE", "affected_field": "evidence_state.evidence_confidence"}
]
```

**Rationale:** Current linkage is one-directional (degradation → advisory). An auditor reading an advisory record cannot determine which degradation events are associated with it without reading the provenance capture record.

---

#### RULE-CAUSAL-03: Orphan Detection

**Rule:** The replay normalization process must detect and flag advisories with empty `degradation_event_refs_stable` (and no explicit classification as "advisory-only" type). An advisory with no degradation linkage is a potential hidden causality gap.

**Exception classes:**
- ADV-03 (confidence_downgrade, CONTEXT_INCOMPLETE) may have no degradation linkage if the confidence context is partially available — the advisory is informational, not degradation-triggered
- Future advisory types must explicitly declare whether degradation linkage is required

---

## 6. Replay Consistency Observability

### 6.1 Replay Divergence Detection

**Design:** A `replay_diff.json` artifact produced by the replay normalization comparator for each N=3 stability run pair.

**Schema:**

```json
{
  "schema_version": "1.0",
  "compared_at": "...",  // TIME_VARYING — excluded from stable comparison
  "run_id_a": "run_02_oss_fastapi_pipeline",
  "run_id_b": "<second reference run>",
  "script_version_match": true,
  "session_id_a": "...",
  "session_id_b": "...",
  "advisory_comparison": {
    "verdict": "IDENTICAL | DIVERGED",
    "matched_advisories": [ ... ],  // by advisory_stable_key
    "new_in_b": [ ... ],
    "missing_in_b": [ ... ],
    "state_mismatches": [ ... ]
  },
  "degradation_comparison": {
    "verdict": "IDENTICAL | DIVERGED",
    "matched_events": [ ... ],
    "new_in_b": [ ... ],
    "missing_in_b": [ ... ]
  },
  "provenance_chain_comparison": {
    "verdict": "IDENTICAL | DIVERGED",
    "step_diffs": [ ... ]
  },
  "overall_verdict": "IDENTICAL | PARTIALLY_VALID | DIVERGED | INVALID",
  "replay_notes": [ ... ]
}
```

**Overall verdict classification:**
- `IDENTICAL`: all REPLAY_STABLE fields match across advisory, degradation, and provenance chain comparisons
- `PARTIALLY_VALID`: all stable advisory/degradation fields match; provenance chain has minor structural differences (e.g., different artifact paths due to different client)
- `DIVERGED`: one or more advisory_stable_key mismatches or advisory_state mismatches
- `INVALID`: REPLAY_INPUT_CONTAMINATED, SESSION_IDENTITY_BROKEN, or schema_version mismatch

---

### 6.2 Lineage Ordering Drift Detection

**Requirement:** The replay_diff.json provenance_chain_comparison must detect:
1. Step count changes (different number of provenance chain steps)
2. Artifact type changes (same step index, different artifact_type)
3. Role changes (same artifact_type, different provenance_type)
4. Missing steps (artifact present in one run, absent in the other)

**Classification:**
- Step count change → LINEAGE_DEPTH_DRIFT
- Artifact type change → LINEAGE_TYPE_DRIFT  
- Missing step → LINEAGE_CONTINUITY_BREAK

Any LINEAGE_CONTINUITY_BREAK must prevent governance progression — a broken lineage chain cannot support accountability claims.

---

### 6.3 Provenance Continuity Breaks

**Design:** The capture script must produce a `provenance_health` block in semantic_provenance.json assessing each artifact's accessibility and hash consistency:

```json
"provenance_health": {
  "gate_evaluation": {
    "present": true,
    "readable": true,
    "sha256_match": true,   // compares against evaluation_context.input_artifact_hashes
    "session_id_consistent": true
  },
  "psee_binding_envelope": {
    "present": true,
    "readable": true,
    "sha256_match": true,
    "source_map_present": false  // until DEP-01-REQ implemented
  },
  "participation_advisory": {
    "present": true,
    "readable": true,
    "sha256_match": true,
    "session_id_consistent": true
  },
  "overall_health": "HEALTHY | DEGRADED | BROKEN"
}
```

**BROKEN** health → replay is invalid; governance review cannot proceed using this provenance record.

---

### 6.4 Reconstruction Mismatch Detection

**Requirement:** The replay_diff.json advisory_comparison must classify each advisory mismatch by type:

| Mismatch Type | Description | Governance Implication |
|--------------|-------------|----------------------|
| `NEW_IN_REPLAY` | Advisory appears in replay but not original | Evaluator logic change OR input value change |
| `MISSING_IN_REPLAY` | Advisory in original but not replay | Same as above; indicates resolved condition |
| `STATE_MISMATCH` | Same advisory_stable_key, different advisory_state | Input value change (e.g., CONTEXT_INCOMPLETE → HARD_DOWNGRADE) |
| `INPUTS_MISMATCH` | Same type+state, different enrichment_inputs_used | Evaluator logic change — inputs attribution changed |

**Required action for any mismatch except MISSING_IN_REPLAY with DEGRADATION_STATE_TRANSITION classification:** Investigation required; governance progression blocked.

---

### 6.5 Degradation Replay Inconsistency

**Requirement:** The replay_diff.json degradation_comparison must classify each degradation mismatch:

| Mismatch Type | Description | Governance Implication |
|--------------|-------------|----------------------|
| `NEW_DEGRADATION_IN_REPLAY` | New degradation event in replay | Potential regression; investigation required |
| `DEGRADATION_RESOLVED` | Event in original missing in replay | Degradation condition cleared (expected after fix) |
| `ADVISORY_REFS_CHANGED` | Same event, different advisory_refs_stable | Advisory evaluator attribution changed |
| `VISIBILITY_CHANGED` | Same event, different degradation_visibility | Observability improvement or regression |

---

### 6.6 Replay Audit Requirements

**Requirement:** For each N=3 reference run, a complete replay audit record must exist:

```
run_id → semantic_provenance.json (provenance capture)
       → replay_causality.json (input hashes + evaluator versions + stable identity keys)
       → replay_diff.json (pairwise comparison with each other reference run)
```

The triple `(semantic_provenance.json, replay_causality.json, replay_diff.json)` constitutes a **replay audit record** for a given run. All three must be present before a run can contribute to N=3 stability validation.

---

## 7. Determinism Failure Containment

### 7.1 Failure Taxonomy

Six failure modes from the determinism gap analysis map to containment rules.

---

#### CONTAIN-01: Lineage Ordering Ambiguity

**Trigger:** Provenance chain step indices are non-consecutive, duplicate, or absent.

**Containment rule:** Mark replay as INVALID if any of:
- Provenance chain has fewer than 3 steps (current minimum)
- Any step index is duplicated
- Artifact_type sequence is not [readiness_provenance, semantic_provenance, advisory_provenance]

**Fail-closed:** INVALID → replay halted; no comparison proceeds; investigation required.

---

#### CONTAIN-02: Advisory Reconstruction Drift

**Trigger:** replay_diff.json advisory_comparison verdict = DIVERGED.

**Containment rule:** Mark replay as REPLAY_DRIFT_DETECTED. Do not advance replay verdict beyond PARTIALLY_VALID. Do not submit advisory stability report for this run pair until root cause is identified.

**Root cause investigation required:**
1. Verify input artifact hashes match (eliminate input contamination)
2. Verify script version match (eliminate script version divergence)
3. If hashes and versions match: logic error in evaluator — code audit required

**Fail-closed:** REPLAY_DRIFT_DETECTED → advisory stability report cannot be issued for this run pair; governance progression blocked.

---

#### CONTAIN-03: Degradation Replay Inconsistency

**Trigger:** replay_diff.json degradation_comparison contains NEW_DEGRADATION_IN_REPLAY entries.

**Containment rule:** Mark as DEGRADATION_INSTABILITY. Investigation required.

**Exception:** DEGRADATION_RESOLVED entries (expected when a derivation gap is closed) do not trigger DEGRADATION_INSTABILITY — they represent intended state change.

**Fail-closed:** DEGRADATION_INSTABILITY → investigation required; the specific run pair cannot be used for N=3 stability count.

---

#### CONTAIN-04: Session Identity Broken

**Trigger:** gate_evaluation.json and participation_advisory.json carry non-matching session_ids.

**Containment rule:** Mark as SESSION_IDENTITY_BROKEN. The advisory artifact cannot be attributed to this gate evaluation instance. The advisory evaluation must be re-executed against a verified gate evaluation artifact.

**Fail-closed:** SESSION_IDENTITY_BROKEN → replay is INVALID; no comparison proceeds; no provenance record based on this mismatched pair is valid.

---

#### CONTAIN-05: Artifact Hash Mismatch

**Trigger:** sha256 of source artifact at replay time does not match hash recorded in evaluation_context.

**Containment rule:** Mark as REPLAY_INPUT_CONTAMINATED. The replay was not performed against identical inputs to the original evaluation.

**Fail-closed:** REPLAY_INPUT_CONTAMINATED → replay is INVALID; do not use this replay result for stability validation; investigate what modified the source artifact.

---

#### CONTAIN-06: Hidden Influence Unvalidated

**Trigger:** MDR-09 (hidden influence audit) has not been completed with PASS verdict.

**Containment rule:** All replay comparison results must include `"causal_audit_status": "PENDING"` in replay_diff.json as long as hidden_influence_audit.json does not exist or carries a non-PASS verdict.

**Governance implication:** CAUSAL_AUDIT_PENDING means: the causal attribution in provenance records is asserted by design but not empirically validated. Any governance claim based on causal attribution carries this caveat.

**Fail-closed:** CAUSAL_AUDIT_PENDING → replay results are OBSERVATIONAL; governance advancement to DETERMINISTIC_OBSERVABLE requires PASS verdict on MDR-09.

---

### 7.2 Escalation Requirements

| Failure Mode | Escalation Required | Evidence Required |
|-------------|--------------------|-|
| INVALID (lineage ambiguity) | Investigation before next run | Root cause identified in replay_diff.json replay_notes |
| REPLAY_DRIFT_DETECTED | Code audit of evaluator | hidden_influence_audit.json extended with drift analysis |
| DEGRADATION_INSTABILITY | Root cause identification | Investigation report (new governance doc) |
| SESSION_IDENTITY_BROKEN | Re-execution against verified gate artifact | New evaluation pair with matching session_ids |
| REPLAY_INPUT_CONTAMINATED | Source artifact integrity investigation | Git log review for unexpected artifact modification |
| CAUSAL_AUDIT_PENDING | Complete hidden influence audit | hidden_influence_audit.json with PASS verdict |

---

### 7.3 Replay Invalidation Rules

A complete replay validity taxonomy for replay_diff.json `overall_verdict`:

| Verdict | Conditions | Governance Advancement Allowed |
|---------|-----------|-------------------------------|
| IDENTICAL | All stable fields match; no containment triggers | YES — counts toward N=3 |
| PARTIALLY_VALID | Stable advisory/degradation match; provenance chain structural diff only (different client path) | YES — counts toward N=3 with annotation |
| DIVERGED | Advisory or degradation REPLAY_DRIFT_DETECTED or DEGRADATION_INSTABILITY | NO — does not count toward N=3 |
| INVALID | Any of: REPLAY_INPUT_CONTAMINATED, SESSION_IDENTITY_BROKEN, lineage ambiguity | NO — does not count; investigation required |

---

## 8. Minimum Deterministic Replay Threshold

The following twelve thresholds define the minimum conditions for the system to achieve DETERMINISTIC_OBSERVABLE — the level at which a replay governance claim can be formally asserted. Meeting all twelve thresholds does not authorize semantic participation.

**Critical principle: meeting deterministic replay thresholds ≠ semantic authority authorization.**

Semantic authority authorization is a governance action by the governance authority. No technical achievement constitutes authorization. The threshold list below defines what must be true before the system is eligible for the next level of governance review — not before it is authorized.

---

### MDT-01: Stable Advisory Identity Key Implemented

**Assertion:** Every advisory record in participation_advisory.json carries `advisory_stable_key` object. Every advisory record in semantic_provenance.json advisory_lineage carries advisory_stable_key. Replay comparators use advisory_stable_key for all matching operations.

**Evidence required:** advisory_stable_key present in all advisory records in reference run artifacts.

---

### MDT-02: Replay-Stable Field Taxonomy Embedded in Schema

**Assertion:** psee_enrichment_schema.json and a new `psee_provenance_schema.json` document formally classify all fields as REPLAY_STABLE / TIME_VARYING / VERSION_DEPENDENT.

**Evidence required:** Both schema documents present with field taxonomy sections.

---

### MDT-03: Artifact-Bound Source Attribution

**Assertion:** psee_binding_envelope.json contains `psee_enrichment_meta.source_map` with field-level attribution for all five enrichment key groups. capture_semantic_provenance.py reads source attribution from the artifact, not from ENRICHMENT_SOURCE_MAP compile-time constant.

**Evidence required:** source_map present in psee_binding_envelope.json for all reference runs.

---

### MDT-04: Formal Session Identity

**Assertion:** gate_evaluation.json and participation_advisory.json for every reference run carry matching session_id values. semantic_provenance.json provenance chain references session_id.

**Evidence required:** session_id present and consistent across artifact pairs in all reference runs.

---

### MDT-05: Dynamic lineage_gaps Computation

**Assertion:** lineage_gaps[] in semantic_provenance.json advisory_lineage records is computed from advisory content (field presence/absence), not hardcoded. When AL-02 is implemented, lineage_gaps shortens automatically.

**Evidence required:** capture_semantic_provenance.py produces lineage_gaps by inspecting advisory record fields, not from a module-level constant.

---

### MDT-06: Dynamic observability_state Computation

**Assertion:** observability_state in semantic_provenance.json advisory_lineage records is computed from advisory content (advisory_reason_structured present/absent), not hardcoded.

**Evidence required:** observability_state = "PARTIAL" when advisory_reason_structured absent; "COMPLETE" when present.

---

### MDT-07: DEG-004 Advisory Emission

**Assertion:** evaluate_enrichment_participation.py emits an advisory record for ACTIVATION_NOT_AUTHORIZED when activation_authorized=false. This advisory appears in participation_advisory.json with advisory_stable_key. DEG-004 advisory_refs_stable references this advisory's stable key.

**Evidence required:** participation_advisory.json for all reference runs contains ACTIVATION_NOT_AUTHORIZED advisory. DEG-004 advisory_refs_stable is non-empty.

---

### MDT-08: DEG-002 Derivation Status Field

**Assertion:** structural_overlap in psee_enrichment_schema.json and psee_binding_envelope.json contains `edge_count_derivation_status` field with allowed values PLACEHOLDER / DERIVED_ZERO / DERIVED_NONZERO. Current state: PLACEHOLDER.

**Evidence required:** edge_count_derivation_status present in psee_binding_envelope.json for all reference runs.

---

### MDT-09: Hidden Influence Audit PASS

**Assertion:** `scripts/pios/psee_handoff/hidden_influence_audit.json` exists with `overall_verdict: "PASS"`. The audit confirms that every enrichment input accessed in any advisory emission logic of evaluate_enrichment_participation.py is listed in enrichment_inputs_used for the advisory it affects.

**Evidence required:** hidden_influence_audit.json present with PASS verdict.

---

### MDT-10: replay_causality.json Produced

**Assertion:** `artifacts/psee_replay_causality/<client>/<run_id>/replay_causality.json` exists for all reference runs, containing: evaluator_script_versions (hash of evaluate_enrichment_participation.py + capture_semantic_provenance.py), input_artifact_hashes (sha256 of all three source artifacts), advisory_stable_keys, degradation_stable_keys, replay_stable_field_snapshot.

**Evidence required:** replay_causality.json present for all N=3 reference runs.

---

### MDT-11: N=3 Advisory Stability Validation

**Assertion:** Three reference runs (minimum two distinct client types) have been evaluated. For each pair, replay_diff.json exists with overall_verdict = IDENTICAL or PARTIALLY_VALID. No pair has DIVERGED or INVALID verdict.

**Evidence required:** N=3 replay_diff.json artifacts, all with IDENTICAL or PARTIALLY_VALID verdict.

---

### MDT-12: Advisory Reconstruction Self-Describing

**Assertion:** All eight advisory lineage requirements (AL-01..AL-08) are satisfied in participation_advisory.json. Cold reconstruction from advisory artifact alone (without semantic_provenance.json) is possible for all advisory types.

**Evidence required:** AL-01..AL-08 fields all present in all advisory records for all reference runs.

---

### Minimum Deterministic Replay Threshold Summary

| Threshold | Type | Depends On |
|-----------|------|----------|
| MDT-01: Stable advisory identity key | Schema + script extension | Independent |
| MDT-02: Replay-stable field taxonomy in schema | Schema document | Independent |
| MDT-03: Artifact-bound source attribution | Script extension | DEP-01-REQ |
| MDT-04: Formal session identity | Script extension | DEP-02-REQ + DEP-04-REQ |
| MDT-05: Dynamic lineage_gaps | Script modification | Independent |
| MDT-06: Dynamic observability_state | Script modification | Independent |
| MDT-07: DEG-004 advisory emission | Script extension | Independent |
| MDT-08: DEG-002 derivation status field | Schema + script extension | Independent |
| MDT-09: Hidden influence audit PASS | Code audit | Independent |
| MDT-10: replay_causality.json | New artifact + script | MDT-01..MDT-04 |
| MDT-11: N=3 stability validation | Operational | MDT-01..MDT-10 |
| MDT-12: Advisory self-describing (AL-01..08) | Script extension | MDT-05 + MDT-06 |

**Implementation dependency ordering:**
- MDT-01..MDT-09: can be implemented in parallel (no inter-dependencies)
- MDT-10: requires MDT-01..MDT-04
- MDT-11: requires MDT-10 + operational (run two additional reference clients)
- MDT-12: requires MDT-05 + MDT-06

**Meeting MDT-01..MDT-12 ≠ semantic authority authorization.**

---

## 9. Current Governance Verdict

The deterministic replay maturity verdict is derived from the evidence in the authoritative inputs and the gap analysis findings. This design stream itself does not change the verdict — the verdict remains as established in the gap analysis until the implementation stream is complete and MDT-01..MDT-12 are validated.

---

### Verdict Criteria Evaluation

**GVC-01: Are stable advisory identity keys defined and implemented?**
Evidence: advisory_stable_key not present in participation_advisory.json (current schema)
Result: NO — MDT-01 not met; PND-02 governance-blocking

**GVC-02: Is the replay-stable field taxonomy formally documented?**
Evidence: taxonomy defined in this design document but not yet embedded in psee_enrichment_schema.json
Result: DESIGNED (not yet implemented) — MDT-02 pending implementation

**GVC-03: Is source attribution artifact-bound (not compile-time)?**
Evidence: ENRICHMENT_SOURCE_MAP hardcoded in capture_semantic_provenance.py; psee_binding_envelope.json lacks source_map
Result: NO — MDT-03 not met; PND-03 governance-blocking

**GVC-04: Do all artifact pairs carry formal session_id?**
Evidence: no session_id in gate_evaluation.json or participation_advisory.json
Result: NO — MDT-04 not met; PND-06 governance-blocking

**GVC-05: Are lineage_gaps and observability_state computed dynamically?**
Evidence: both hardcoded in capture_semantic_provenance.py
Result: NO — MDT-05/MDT-06 not met; PND-04/PND-05 governance-blocking

**GVC-06: Is DEG-004 represented in the advisory artifact?**
Evidence: DEG-004 has advisory_refs = [] in current artifacts; no advisory for ACTIVATION_NOT_AUTHORIZED
Result: NO — MDT-07 not met; DRI-04 accountability gap present

**GVC-07: Has the hidden influence audit been performed?**
Evidence: no hidden_influence_audit.json exists; RF-04 CRITICAL/UNVALIDATED
Result: NO — MDT-09 not met

**GVC-08: Are N=3 advisory stability runs complete?**
Evidence: N=1 reference run
Result: NO — MDT-11 not met

**GVC-09: Are all AL-01..AL-08 advisory lineage requirements met?**
Evidence: AL-02, AL-03, AL-04, AL-05, AL-07, AL-08 absent from advisory records
Result: NO — MDT-12 not met; 6 of 8 AL requirements absent

**GVC-10: Is replay_causality.json produced for reference runs?**
Evidence: artifact does not exist
Result: NO — MDT-10 not met

---

### Verdict: PARTIALLY_DETERMINISTIC

The current deterministic replay maturity is **PARTIALLY_DETERMINISTIC**.

The verdict is inherited from the gap analysis and remains unchanged by this design stream. This design stream produces the specifications required to move the system toward DETERMINISTIC_OBSERVABLE — it does not itself advance the verdict.

**Justification:**

The system remains at PARTIALLY_DETERMINISTIC because:
- 0 of 12 minimum deterministic replay thresholds (MDT-01..MDT-12) are met
- 5 of 6 provenance nondeterminism sources remain governance-blocking (PND-02..PND-06)
- DEG-004 accountability gap persists (MDT-07 not met)
- Hidden influence audit not performed (MDT-09 not met; RF-04 CRITICAL/UNVALIDATED)
- N=1 reference run (MDT-11 not met)

**Progress this stream makes:** This design stream defines the complete specification for all 12 deterministic replay thresholds, four dependency closure designs, twelve deterministic reconstruction rules, six failure containment rules, and the replay consistency observability architecture. The implementation stream can follow this design precisely without requiring further design analysis.

**Path to DETERMINISTIC_OBSERVABLE:**

```
PARTIALLY_DETERMINISTIC (current)
  ↓ implement MDT-01..MDT-09 (stable identity keys, session_id, dynamic fields,
    DEG-004 advisory, derivation status, hidden influence audit)
  ↓ implement MDT-10 (replay_causality.json)
  ↓ validate MDT-11 (N=3 stability runs: IDENTICAL verdict)
  ↓ implement MDT-12 (AL-01..AL-08 in advisory evaluator)
DETERMINISTIC_OBSERVABLE
  ↓ [further governance review: ATP-01..ATP-06, RRT-01..RRT-06]
REPLAY_GOVERNANCE_READY
  ↓ [MPC-01..MPC-09 all met]
AUTHORITY_REVIEW_ELIGIBLE
  ↓ [explicit governance action by governance authority]
AUTHORIZED
```

Each level requires a distinct governance event. No level is automatic. This design does not claim DETERMINISTIC_OBSERVABLE status — it defines what is required to achieve it.

**The verdict is NOT governance-ready.** PARTIALLY_DETERMINISTIC means: the evaluation logic is correct and deterministic, but the provenance schema has governance-blocking instability sources that prevent replay governance claims from being asserted.

---

## 10. Safe Next Step

**Recommended contract:** PI.PSEE-PIOS.DETERMINISTIC-REPLAY-INSTRUMENTATION.IMPLEMENTATION.01

---

### What This Implementation Does

This implementation stream executes exactly the specifications in this design document, in dependency order.

**Group A — Independent implementations (no inter-dependencies):**

1. **Stable advisory identity key** (MDT-01): Extend evaluate_enrichment_participation.py to add `advisory_stable_key` object to each advisory record. Extend capture_semantic_provenance.py to read advisory_stable_keys when building advisory_lineage. Schema: defined in Section 3.3 of this document.

2. **Replay-stable field taxonomy in schema** (MDT-02): Add `"replay_field_taxonomy"` block to psee_enrichment_schema.json and create `docs/governance/psee_provenance_schema.json` with formal field classification. Content: TAXONOMY-01/02/03 from Section 3.2 of this document.

3. **Dynamic lineage_gaps** (MDT-05): Replace `ADVISORY_FORMAT_LINEAGE_GAPS` constant in capture_semantic_provenance.py with function that inspects advisory record fields and reports which AL-01..AL-08 requirements are absent. Logic: for each AL requirement, check presence of corresponding field in advisory record dict.

4. **Dynamic observability_state** (MDT-06): Replace hardcoded `"observability_state": "PARTIAL"` in capture_semantic_provenance.py with function that checks for `advisory_reason_structured` field presence in advisory record. Returns "COMPLETE" if present, "PARTIAL" if absent.

5. **DEG-004 advisory emission** (MDT-07): Add ACTIVATION_NOT_AUTHORIZED advisory type to evaluate_enrichment_participation.py. Emit this advisory when gate_evaluation.json `activation_authorized = false`. Advisory fields: advisory_type="activation_not_authorized", advisory_state="GOVERNANCE_GATE_BLOCKED", enrichment_inputs_used=["activation_authorized"], advisory_reason text and advisory_reason_structured (threshold: true, observed: false, condition: "must be true").

6. **DEG-002 derivation status field** (MDT-08): Add `edge_count_derivation_status` field to structural_overlap in psee_enrichment_schema.json (allowed: PLACEHOLDER/DERIVED_ZERO/DERIVED_NONZERO). Extend add_psee_enrichment_stubs.py to populate `structural_overlap.edge_count_derivation_status = "PLACEHOLDER"` (current state).

7. **Hidden influence audit** (MDT-09): Perform line-by-line code audit of evaluate_enrichment_participation.py. For each advisory type, trace all enrichment input accesses in the conditional logic; verify each accessed field is in enrichment_inputs_used for that advisory. Produce `artifacts/psee_hidden_influence_audit/hidden_influence_audit.json` with per-advisory-type audit results and overall_verdict.

**Group B — Depends on Group A + Group C:**

8. **Artifact-bound source attribution + session_id** (MDT-03 + MDT-04): Extend add_psee_enrichment_stubs.py to produce `psee_enrichment_meta.source_map` (field-level attribution) and `psee_enrichment_meta.source_artifacts` (sha256 hashes). Extend evaluate_psee_gate.py to generate session_id and embed it in gate_evaluation.json `evaluation_context`. Extend evaluate_enrichment_participation.py to read session_id from gate_evaluation.json and embed in advisory `evaluation_context`.

**Group C — Depends on Group A + B:**

9. **replay_causality.json** (MDT-10): Extend capture_semantic_provenance.py to produce an additional artifact: `artifacts/psee_replay_causality/<client>/<run_id>/replay_causality.json`. Content: evaluator version hashes, input artifact sha256s, advisory_stable_keys, degradation_stable_keys, replay_stable_field_snapshot. Schema defined in Section 6.1 of this document.

10. **Stable degradation identity key** (extends MDT-01): Add `degradation_stable_key` to each degradation event in semantic_provenance.json. Add `advisory_refs_stable` to each degradation event. Schema defined in Section 3.4 of this document.

11. **Replay diff comparator** (supports MDT-11): Implement `scripts/pios/psee_handoff/compare_replay_runs.py` — passive stdlib-only script that accepts two semantic_provenance.json paths and produces replay_diff.json. Logic: stable key matching, stable field comparison, TAXONOMY-01/02/03 field exclusion per MDT-02. Output: `artifacts/psee_replay_diff/<client>/<run_id_a>_vs_<run_id_b>/replay_diff.json`.

**Group D — Operational:**

12. **N=3 stability validation** (MDT-11): Run evaluator stack against two additional reference runs (different clients or regenerated reference runs). For each pair, execute compare_replay_runs.py. Verify overall_verdict = IDENTICAL or PARTIALLY_VALID for all pairs.

13. **Advisory self-describing extension** (MDT-12): Extend evaluate_enrichment_participation.py to add AL-01..AL-08 required fields to each advisory record. This closes the advisory format extension gap (previously identified as a future advisory instrumentation stream).

---

### What This Implementation Does NOT Do

- Does NOT grant semantic authority
- Does NOT advance participation mode beyond OBSERVATIONAL_ONLY
- Does NOT implement evidence_confidence derivation
- Does NOT implement structural_overlap derivation (edge_count_derivation_status=PLACEHOLDER; actual derivation is a separate stream)
- Does NOT design or implement 75.x coupling
- Does NOT resolve BP-01 (governance authority action)
- Does NOT modify any 75.x or 41.x script
- Does NOT change runtime behavior

---

### Why This Is the Safest Next Step

This implementation stream is safe because:
1. Every change is additive — new fields, new artifacts, script extensions. No existing field is modified or removed.
2. Zero runtime impact — all new artifacts go to `artifacts/psee_*/` directories (not committed, not consumed by 75.x or 41.x)
3. The scope is precisely bounded by this design document — no judgment calls required in implementation
4. The hidden influence audit (MDT-09) is a code review action, not a modification — it produces only an audit artifact
5. Group A items are independent — they can be implemented and validated one at a time

The replay diff comparator (Group C) enables N=3 stability validation (Group D) — which is the first step that produces empirical evidence of determinism rather than design assertions. After N=3 validation passes, the system holds its first empirically-grounded determinism claim.

---

## 11. Validation

PASS criteria:

- [x] Deterministic replay model explicitly defined with five distinct concepts (DRM-C1..DRM-C5) (Section 2.1)
- [x] replayability/determinism/normalization/reproducibility/authority distinguished — each defined with current state and full-achievement requirement
- [x] Replay sequencing expectations defined (STEP-R1..STEP-R4) (Section 2.2)
- [x] Replay reconstruction guarantees defined (G-REPL-01..G-REPL-06) (Section 2.3)
- [x] Replay consistency boundaries defined per boundary type (Section 2.4)
- [x] Provenance ordering stabilization designed (Section 3)
- [x] Replay-stable field taxonomy defined with three categories REPLAY_STABLE / TIME_VARYING / VERSION_DEPENDENT and explicit field classifications (Section 3.2)
- [x] Stable advisory identity key designed with exact JSON schema (Section 3.3)
- [x] Stable degradation identity key designed with advisory_refs_stable (Section 3.4)
- [x] Replay dependency closure designed for all five dependency classes (DEP-01..DEP-05) (Section 4)
- [x] All dependencies classified as PARTIALLY CLOSED or UNRESOLVED; all closeable (none irreducible) (Section 4.2)
- [x] DEP-01..DEP-05 design requirements specified with exact JSON schema extensions (Section 4.1)
- [x] Session identity specification defined (sha256 derivation) (Section 4.1, DEP-02-REQ)
- [x] Twelve deterministic reconstruction rules defined (RULE-ADV-01..04, RULE-DEG-01..03, RULE-PROV-01..03, RULE-CAUSAL-01..03) (Section 5)
- [x] Replay consistency observability designed: replay_diff.json schema, lineage drift, provenance health, reconstruction mismatch types, degradation inconsistency types (Section 6)
- [x] Six failure containment rules designed (CONTAIN-01..CONTAIN-06) with fail-closed behavior (Section 7)
- [x] Replay invalidation verdict taxonomy defined (IDENTICAL/PARTIALLY_VALID/DIVERGED/INVALID) (Section 7.3)
- [x] Twelve minimum deterministic replay thresholds defined (MDT-01..MDT-12) with evidence requirements (Section 8)
- [x] Implementation dependency ordering stated (Groups A/B/C/D) (Section 10)
- [x] "meeting deterministic replay thresholds ≠ semantic authority authorization" explicitly stated (Section 8 principle + Section 9)
- [x] Current governance verdict = PARTIALLY_DETERMINISTIC, justified from evidence (Section 9)
- [x] Full progression ladder confirmed (Section 9)
- [x] Verdict is NOT governance-ready — explicitly stated (Section 9)
- [x] Safe next step = deterministic replay instrumentation implementation (not derivation) (Section 10)
- [x] No implementation performed
- [x] No runtime mutation
- [x] No threshold modification
- [x] Semantic authority remains blocked throughout
- [x] Activation sovereignty preserved

FAIL conditions check:

- Determinism conflated with authority? NO — Section 2.1 DRM-C5 explicitly defines semantic authority as a governance property distinct from all technical properties; Section 8 principle explicitly states thresholds ≠ authorization
- Deterministic replay treated as semantic authorization? NO — verdict remains PARTIALLY_DETERMINISTIC; participation mode unchanged; no derivation authorized
- Provenance instability ignored? NO — all 5 governance-blocking nondeterminism sources (PND-02..PND-06) fully addressed in design
- Semantic authority implicitly escalated? NO — participation mode OBSERVATIONAL_ONLY throughout; semantic_authority BLOCKED
- Runtime behavior modified? NO — design only; no scripts created or modified; no artifacts modified

Status: PASS
