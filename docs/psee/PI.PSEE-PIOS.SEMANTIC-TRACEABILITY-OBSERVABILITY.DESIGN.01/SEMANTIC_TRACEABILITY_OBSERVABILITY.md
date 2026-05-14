# Semantic Traceability and Observability — Design

Stream: PI.PSEE-PIOS.SEMANTIC-TRACEABILITY-OBSERVABILITY.DESIGN.01  
Status: COMPLETE  
Generated: 2026-05-06  
Branch: feature/psee-pios-integration-productized  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A runtime behavior: NO  
  Modifies Lane A scripts (75.x/41.x): NO  
  Implements enriched derivation: NO  
  Advances Lane D governance: YES — semantic traceability framework defined

Authoritative inputs:
- `docs/psee/PI.PSEE-PIOS.ENRICHED-PSIG-DERIVATION-PRECONDITIONS.REVIEW.01/ENRICHED_PSIG_DERIVATION_PRECONDITIONS_REVIEW.md`
- `docs/psee/PI.PSEE-PIOS.ENRICHED-CONDITION-PARTICIPATION.DESIGN.01/ENRICHED_CONDITION_PARTICIPATION.md`
- `docs/psee/PI.PSEE-PIOS.ENRICHMENT-PARTICIPATION-ADVISORY.IMPLEMENTATION.01/ENRICHMENT_PARTICIPATION_ADVISORY.md`
- `docs/psee/PI.PSEE-PIOS.PSEE-CONDITION-ACTIVATION-GATE.DESIGN.01/PSEE_CONDITION_ACTIVATION_GATE.md`
- `docs/psee/PI.PSEE-PIOS.PSEE-GATE-EVALUATOR.IMPLEMENTATION.01/PSEE_GATE_EVALUATOR_IMPLEMENTATION.md`
- `artifacts/psee_advisory/fastapi/run_02_oss_fastapi_pipeline/participation_advisory.json`
- `artifacts/psee_gate/fastapi/run_02_oss_fastapi_pipeline/gate_evaluation.json`
- `docs/governance/psee_enrichment_schema.json`
- `docs/governance/signal_namespace_alias_registry.json`

Evidence base (run_02_oss_fastapi_pipeline, 2026-05-06):
- participation_mode: OBSERVATIONAL_ONLY
- degradation_state: CONTEXT_INCOMPLETE
- advisory_count: 2 (ADV-001: CONTEXT_INCOMPLETE, ADV-002: PENDING_DERIVATION)
- enrichment_inputs_missing: selector_context.selector_confidence, evidence_state.evidence_confidence
- OBS-01..OBS-05: all true (one reference run)
- runtime_impact: NONE

---

## 1. Purpose

This design defines the authoritative semantic traceability and observability framework for the PSEE enrichment participation system. It specifies what must be traceable, how lineage must be reconstructable, and what observability capabilities must exist before any semantic participation authority could ever be considered for governance review.

**This design does not implement anything.** It defines requirements for a future implementation stream (PI.PSEE-PIOS.SEMANTIC-PROVENANCE-INSTRUMENTATION.IMPLEMENTATION.01).

**This design does not authorize semantic participation.** Traceability is a precondition for participation authority review — not the review itself, and not authorization.

**Governing principle of this document:**

> **Observability must precede participation authority. Participation authority must precede derivation authority. Neither follows automatically from the other.**

---

## 2. Semantic Traceability Model

### 2.1 Five Provenance Types

The semantic traceability model distinguishes five distinct provenance types. Each has a defined boundary, owner, and reconstruction expectation.

---

#### PT-01: Structural Provenance

**Definition:** The verifiable lineage of structural source data — how binding_envelope.json and canonical_topology.json were produced from ingestion inputs.

**Boundary:** Begins at the raw source (L0 Ledger Selector) and ends at the binding/canonical topology artifacts in the run directory.

**Owned by:** 40.x / PiOS Core (feature/pios-core)

**Current artifacts:** `binding/binding_envelope.json`, `structure/40.4/canonical_topology.json`

**Reconstruction expectation:** Given a run directory, the structural artifacts must be fully reproducible from:
- the same source input
- through the same 40.2→40.4 ingestion path
- producing identical nodes, edges, capability_surfaces, and cluster assignments

**Current status:** IMPLEMENTED (40.x pipeline). Out of scope for this stream.

---

#### PT-02: Semantic Provenance

**Definition:** The verifiable lineage of PSEE-specific enrichment computations — how each of the 5 reserved PSEE keys (psee_context, ceu_topology, structural_overlap, selector_context, evidence_state) in psee_binding_envelope.json was derived from structural provenance outputs.

**Boundary:** Begins at the structural source artifacts (canonical_topology.json, grounding_state_v3.json, vault_readiness.json) and ends at psee_binding_envelope.json.

**Owned by:** 40.x / psee_handoff layer (add_psee_enrichment_stubs.py)

**Current artifacts:** `binding/psee_binding_envelope.json`

**Reconstruction expectation:** Given psee_binding_envelope.json, it must be possible to identify:
- Which source artifact produced each enrichment key
- What field value was read from each source artifact
- What transformation (if any) was applied

**Current gaps:**
- psee_binding_envelope.json does not carry a `semantic_provenance` block naming source artifact + field for each enrichment key value
- structural_overlap.edges = [] is a placeholder; its derivation source is absent (OVERLAP_STRUCTURAL not implemented)
- evidence_confidence is null; no derivation formula is documented in the artifact

**Required addition:** `psee_enrichment_meta.source_map` — a field-level mapping from each enrichment key to its source artifact and field path.

---

#### PT-03: Advisory Provenance

**Definition:** The verifiable lineage of every advisory record — how each advisory was triggered, from which enrichment input, at what value, against what threshold, under what gate state and participation mode.

**Boundary:** Begins at the enrichment inputs in psee_binding_envelope.json and gate_evaluation.json, and ends at participation_advisory.json.

**Owned by:** advisory layer (evaluate_enrichment_participation.py, psee_handoff/)

**Current artifacts:** `artifacts/psee_advisory/<client>/<run_id>/participation_advisory.json`

**Reconstruction expectation:** Given participation_advisory.json alone (without re-reading source files), it must be possible to fully reconstruct:
- Which enrichment input produced each advisory
- What value was observed for that input
- What threshold was evaluated against
- What the comparison result was
- What gate state existed at emission time
- What participation mode was active

**Current gaps (see Section 3 for detail):**
- `originating_artifact` field absent from advisory records — source file not cited
- `advisory_reason` is text only — no structured `threshold`, `observed_value`, `comparison` object
- `governance_gate_state` is a summary field but gate result details are not included in the advisory record
- No `provenance_chain` field linking the sequence of artifacts from source to advisory

---

#### PT-04: Participation Provenance

**Definition:** The verifiable record of participation mode transitions, degradation events, and the advisory evaluation session as a whole.

**Boundary:** Spans gate_evaluation.json (readiness provenance) and participation_advisory.json (advisory provenance). Covers the full evaluation session for a given run.

**Owned by:** advisory layer

**Current artifacts:** gate_evaluation.json + participation_advisory.json (treated as a pair)

**Reconstruction expectation:** Given both artifacts for a run, it must be possible to reproduce:
- The sequence of gate results that produced the activation_state
- The enrichment inputs that produced each advisory
- The participation mode throughout the session
- Any mode transitions or degradation events

**Current gaps:**
- The link between gate_evaluation.json and participation_advisory.json is implicit (shared client_id + run_id) — not a formal provenance chain
- No participation session record ties them as an ordered sequence
- Mode transitions are not recorded (participation mode is static OBSERVATIONAL_ONLY with no history)

---

#### PT-05: Future Activation Provenance

**Definition:** The verifiable lineage of how enrichment advisory context influenced 75.x activation decisions — which advisory was consumed, by which 75.x logic, for which node, producing which change in activation state.

**Boundary:** Begins at the advisory layer's consumption coupling point and ends at condition_correlation_state.json.

**Owned by:** 75.x CONDITION ACTIVATION layer (when a consumption framework is authorized)

**Current artifacts:** NONE — this provenance type does not yet exist

**Reconstruction expectation:** (future) Given the activation provenance record for a run, it must be possible to reproduce the exact advisory inputs that were consulted, and the exact activation decisions that resulted.

**Current status:** NOT IMPLEMENTED. Requires:
1. Activation authorization framework design (MPC-09 from governance review)
2. 75.x coupling mechanism design and authorization
3. Per-advisory consumption logging implementation

**Critical:** PT-05 is not possible until PT-01..PT-04 are fully implemented and validated. Activation provenance can only be meaningful if all upstream provenance is complete.

---

### 2.2 Provenance Boundary Table

| Provenance Type | Starts At | Ends At | Current Status |
|----------------|-----------|---------|----------------|
| PT-01: Structural | Raw source (L0) | binding_envelope.json, canonical_topology.json | IMPLEMENTED |
| PT-02: Semantic | Structural artifacts | psee_binding_envelope.json | PARTIAL |
| PT-03: Advisory | psee_binding_envelope.json + gate_evaluation.json | participation_advisory.json | PARTIAL |
| PT-04: Participation | gate_evaluation.json | participation_advisory.json (session pair) | PARTIAL |
| PT-05: Activation | Advisory consumption point | condition_correlation_state.json | NOT IMPLEMENTED |

---

### 2.3 Provenance Reconstruction Expectations

All four currently-possible provenance types (PT-01..PT-04) must support **cold reconstruction**: given only the output artifact, reproduce the derivation without re-executing the source pipeline.

Cold reconstruction requirements:
- PT-02: psee_binding_envelope.json must self-describe its source derivation (source_map)
- PT-03: participation_advisory.json must self-describe each advisory trigger (structured reason object + originating_artifact)
- PT-04: the session pair (gate_evaluation.json + participation_advisory.json) must be formally linked with a session_id or cross-reference
- PT-05 (future): activation provenance artifact must self-describe which advisory was consumed for each activation decision

---

## 3. Advisory Lineage Requirements

Every advisory emitted by the participation advisory evaluator must carry a complete, self-describing lineage chain. The following seven lineage dimensions are mandatory.

---

### AL-01: Source Enrichment Input (MANDATORY)

**Current state:** `enrichment_inputs_used` array contains field paths (e.g., `"evidence_state.evidence_confidence"`)  
**Gap:** Field paths are present but not accompanied by the observed value at emission time  
**Required addition:** `enrichment_input_values` object mapping each field path to its observed value at emission time

Example (required format):
```json
"enrichment_input_values": {
  "evidence_state.evidence_confidence": null,
  "psee_context.grounding_ratio": 0.9
}
```

---

### AL-02: Originating Artifact (MANDATORY)

**Current state:** ABSENT from advisory records  
**Required addition:** `originating_artifact` field naming the source file from which each enrichment input was read

Example (required format):
```json
"originating_artifact": {
  "evidence_state.evidence_confidence": "binding/psee_binding_envelope.json",
  "evidence_state.evidence_confidence_source": "not_yet_derived"
}
```

Optionally extended: for each enrichment key, trace back to the ultimate source artifact (e.g., `grounding_state_v3.json` for `grounding_ratio`).

---

### AL-03: Originating Semantic Context (MANDATORY)

**Current state:** `advisory_reason` is a text string only  
**Required addition:** `advisory_reason_structured` object with explicit threshold, observed_value, comparison, and result fields

Example (required format):
```json
"advisory_reason_structured": {
  "enrichment_field": "evidence_state.evidence_confidence",
  "observed_value": null,
  "condition": "is null",
  "threshold": "non-null required for MODE-03+",
  "result": "CONTEXT_INCOMPLETE"
}
```

The text `advisory_reason` may be retained for human readability but must be accompanied by the structured object for machine reconstruction.

---

### AL-04: Participation Mode at Emission (MANDATORY)

**Current state:** `participation_mode` is a top-level field in the advisory artifact but not embedded within each individual advisory record  
**Required addition:** `participation_mode_at_emission` field inside each advisory record

This allows reconstruction of the mode context for each advisory independently, even if the top-level mode changes between emission events in a future multi-mode implementation.

---

### AL-05: Degradation State at Emission (MANDATORY)

**Current state:** `degradation_state` is a top-level field only  
**Required addition:** `degradation_state_at_emission` field inside each advisory record

---

### AL-06: Advisory Emission Reason (MANDATORY — must be structured)

Already partially present as `advisory_reason` text. The structured version (AL-03) satisfies this requirement. Text form is retained as supplementary.

---

### AL-07: Governance Gate State at Emission (MANDATORY)

**Current state:** `activation_state` is a top-level field in advisory artifact (pulled from gate_evaluation.json). The individual gate results (G-01..G-09 PASS/FAIL) are not included in the advisory record.  
**Required addition:** `governance_gate_state` embedded in the advisory artifact as a summary of gate results at evaluation time — at minimum: activation_state, bp_01_status, bp_02_status, activation_authorized

Full reconstruction requirement: Given the advisory artifact, reproduce the governance gate state that existed when each advisory was emitted. This does not require reproducing the full gate_evaluation.json — a summary snapshot is sufficient.

---

### AL-08: Provenance Chain (MANDATORY)

**Current state:** ABSENT — no field links the advisory record to its upstream artifact sequence  
**Required addition:** `provenance_chain` array at the top level of participation_advisory.json, listing the ordered sequence of artifacts consulted during evaluation

Example (required format):
```json
"provenance_chain": [
  {
    "step": 1,
    "artifact": "artifacts/psee_gate/<client>/<run_id>/gate_evaluation.json",
    "role": "readiness_provenance",
    "key_fields_consumed": ["activation_state", "bp_01_resolved", "bp_02_resolved", "activation_authorized"]
  },
  {
    "step": 2,
    "artifact": "binding/psee_binding_envelope.json",
    "role": "semantic_provenance",
    "key_fields_consumed": ["psee_context", "ceu_topology", "structural_overlap", "selector_context", "evidence_state"]
  }
]
```

---

### Advisory Lineage Requirement Summary

| Requirement | Current State | Required Addition |
|-------------|--------------|-------------------|
| AL-01: Source enrichment input + observed value | Field paths only | `enrichment_input_values` object |
| AL-02: Originating artifact | ABSENT | `originating_artifact` field |
| AL-03: Structured reason | Text only | `advisory_reason_structured` object |
| AL-04: Mode at emission | Top-level only | Per-advisory `participation_mode_at_emission` |
| AL-05: Degradation at emission | Top-level only | Per-advisory `degradation_state_at_emission` |
| AL-06: Emission reason (structured) | Text | Satisfied by AL-03 |
| AL-07: Governance gate state | Summary only | Gate summary snapshot in advisory |
| AL-08: Provenance chain | ABSENT | `provenance_chain` array |

**All 8 lineage requirements must be satisfied before advisory provenance (PT-03) is considered complete.**

---

## 4. Semantic Influence Traceability

Every future semantic influence event — any point at which enrichment context could change an activation-adjacent outcome — must be observable across six dimensions.

**Governing principle:**

> **Semantic influence ≠ semantic authority.**  
> Influence is the presence of enrichment context in proximity to an activation decision.  
> Authority is the right to determine that decision.  
> Influence must be traced. Authority remains with 75.x.

---

### SI-01: Influence Source

**Definition:** Which enrichment input provides the influence; from which artifact; at what value.

**Traceability requirement:** Every influence event must name:
- The enrichment field (e.g., `psee_context.grounding_ratio`)
- The artifact containing that field (e.g., `psee_binding_envelope.json`)
- The value at the time of influence (e.g., `0.9`)
- The ultimate source artifact (e.g., `grounding_state_v3.json`)

**Current gap:** psee_binding_envelope.json does not carry a source_map. The ultimate source (grounding_state_v3.json) is known from design but not recorded in the artifact.

---

### SI-02: Influence Target

**Definition:** Which activation candidate, advisory type, or participation mode is subject to the influence.

**Traceability requirement:** Every influence event must name:
- The target entity (advisory_type, or future: node_id if per-node advisory)
- The target layer (advisory layer, future: 75.x activation)
- Whether the influence was applied or ignored

**Current gap:** Per-node advisory targeting is not yet implemented. Current advisories are run-wide (e.g., ADV-001 applies to the entire run, not to a specific node).

---

### SI-03: Influence Mode

**Definition:** Which participation mode was active when the influence occurred.

**Traceability requirement:** `participation_mode_at_emission` must be present in each advisory (see AL-04). Future coupling records must include the participation mode under which the coupling occurred.

---

### SI-04: Influence Scope

**Definition:** Whether the influence is per-node, per-cluster, or run-wide.

**Traceability requirement:** Every influence event must specify its scope:
- `RUN_WIDE`: applies to the entire run (current advisory model — e.g., grounding_ratio applies to the whole run)
- `PER_CLUSTER`: applies to a specific cluster (future — when structural_overlap is derived)
- `PER_NODE`: applies to a specific node_id (future — when suppression_flags lists specific nodes)

**Current state:** All current advisories are `RUN_WIDE`. Per-node and per-cluster influence scope require structural derivation not yet implemented.

---

### SI-05: Influence Confidence

**Definition:** How reliable is the enrichment input providing the influence? Determined by grounding_ratio and evidence_confidence.

**Traceability requirement:** Every influence event must include an `influence_confidence` assessment:
- `HIGH`: grounding_ratio ≥ 0.7 AND evidence_confidence is non-null
- `NOMINAL`: grounding_ratio ≥ 0.5 AND evidence_confidence is null
- `LOW`: grounding_ratio < 0.5 OR evidence_confidence below threshold
- `UNKNOWN`: grounding_ratio null or evidence source absent

**Current state for run_02:** influence_confidence would be NOMINAL (grounding_ratio=0.9 ✓ but evidence_confidence=null). This is not currently recorded in advisory records.

---

### SI-06: Influence Reversibility

**Definition:** How can a semantic influence event be undone if the advisory is found to be incorrect?

**Traceability requirement:** Every influence event must document its reversibility path:
- `REGENERATE_ENVELOPE`: regenerate psee_binding_envelope.json from updated source artifacts
- `RESET_SELECTOR`: clear selector_context and re-run selector authorization
- `RERUN_GATE_EVALUATOR`: re-run evaluate_psee_gate.py against updated inputs
- `RERUN_ADVISORY_EVALUATOR`: re-run evaluate_enrichment_participation.py
- `FUTURE_DECOUPLE`: (for activation provenance) remove 75.x coupling and recompute activation

**Current state:** All current influences are reversible by `RERUN_ADVISORY_EVALUATOR` since no 75.x coupling exists. Reversibility is trivially complete today.

---

### Semantic Influence Traceability Summary

| Dimension | Current State | Gap |
|-----------|--------------|-----|
| SI-01: Influence source | Field path only | Source artifact + value missing |
| SI-02: Influence target | Advisory type only | Node_id targeting not implemented |
| SI-03: Influence mode | Top-level only | Per-advisory field missing |
| SI-04: Influence scope | Implicit (RUN_WIDE) | Scope field not declared |
| SI-05: Influence confidence | Not recorded | Must derive from grounding_ratio + evidence_confidence |
| SI-06: Influence reversibility | Implicit (trivial) | Reversibility path not documented |

---

## 5. Suppression / Escalation Auditability

Each advisory type must meet the following auditability requirements before any 75.x consumption framework is permitted.

---

### SA-01: Suppression Advisory (ADV-01) Auditability

**Explicit rationale (required):**
- When triggered by `suppression_flags`: the advisory must list each flagged node_id and the selector event that set the flag
- When triggered by `grounding_ratio < 0.7`: the advisory must state the exact ratio observed, the threshold, and why this applies to specific activation candidates

**Explicit provenance (required):**
- `originating_artifact`: `binding/psee_binding_envelope.json` → `selector_context.suppression_flags` or `psee_context.grounding_ratio`
- `ultimate_source`: `ceu/grounding_state_v3.json` for grounding_ratio; selector authorization event for suppression_flags
- `selector_authorization_ref`: required when suppression_flags is non-empty — must name the authorization event that set the flags

**Explicit reconstruction path (required):**
- From advisory record alone: reproduce the grounding_ratio check (value < 0.7) or suppression_flags check (non-empty)
- Selector contamination protection: suppression_flags entries must include the selector event ID that set them; an anonymous suppression_flag is not auditable and must be rejected

**Explicit degradation visibility (required):**
- If suppression advisory was not emitted due to missing grounding_ratio: ADV-04 must note this as an evidence insufficiency for ADV-01 trigger evaluation

**Current state:** ADV-01 not emitted for run_02 (suppression_flags=[], grounding_ratio=0.9). Auditability requirements are designed for future runs where ADV-01 is emitted.

---

### SA-02: Escalation Advisory (ADV-02) Auditability

**Explicit rationale (required):**
- The advisory must name the exact cluster_count observed, the exact overlap_edge_count observed, and the threshold crossed
- The advisory must list which nodes (or cluster_ids) are affected (when per-cluster/per-node targeting is implemented)
- A node-count ceiling must be declared at emission time: if advisory_count for ADV-02 exceeds a defined ceiling, the advisory must include a warning that batch escalation is occurring

**Explicit provenance (required):**
- `originating_artifact`: `binding/psee_binding_envelope.json` → `ceu_topology.cluster_count` + `structural_overlap.edge_count`
- `ultimate_source_cluster_count`: `structure/40.4/canonical_topology.json`
- `ultimate_source_overlap`: OVERLAP_STRUCTURAL derivation output (when implemented)

**Explicit reconstruction path (required):**
- From advisory record: reproduce `cluster_count > CLUSTER_ESCALATION_THRESHOLD AND overlap_edge_count > 0`

**Explicit degradation visibility (required):**
- If ADV-02 was not emitted because structural_overlap.edge_count=0 (placeholder): ADV-04 must note this as an evidence insufficiency for ADV-02 structural trigger

**Current state:** ADV-02 not emitted for run_02 (structural_overlap.edge_count=0). ADV-002 (evidence_insufficiency) correctly cites this gap.

**Node-count ceiling requirement:** Before structural_overlap derivation is implemented and ADV-02 could emit with edge_count > 0, a node-count ceiling for escalation advisories must be defined and documented. This ceiling is a governance constraint, not a technical one.

---

### SA-03: Confidence Downgrade Advisory (ADV-03) Auditability

**Explicit rationale (required):**
- HARD_DOWNGRADE: must state grounding_ratio, threshold (0.5), which modes are unavailable
- CONTEXT_INCOMPLETE: must state which field is null, what derivation is pending, why this is not a hard downgrade

**Explicit provenance (required):**
- `originating_artifact`: `binding/psee_binding_envelope.json` → `evidence_state.evidence_confidence` or `psee_context.grounding_ratio`
- `ultimate_source_grounding`: `ceu/grounding_state_v3.json`
- `ultimate_source_evidence_confidence`: "not_yet_derived" (until derivation stream is implemented)

**Explicit reconstruction path (required):**
- From advisory record: reproduce `grounding_ratio < 0.5` check for HARD_DOWNGRADE, or `evidence_confidence is null` check for CONTEXT_INCOMPLETE

**Explicit degradation visibility (required):**
- Which participation modes are unavailable due to downgrade: must be listed as `modes_unavailable` in advisory record

**Current state:** ADV-001 (CONTEXT_INCOMPLETE) emitted. `modes_unavailable` field absent from current implementation — required addition.

---

### SA-04: Evidence Insufficiency Advisory (ADV-04) Auditability

**Explicit rationale (required):**
- For each insufficiency reason: which field, what mode it blocks, what derivation is pending
- Must not aggregate all insufficiency reasons into a single text string — must be a structured array

**Explicit provenance (required):**
- For each insufficiency: `originating_artifact` (where the null/placeholder was found) + `expected_source` (what derivation would produce it)

**Explicit reconstruction path (required):**
- From advisory record: reproduce the null/placeholder check for each insufficiency reason

**Explicit degradation visibility (required):**
- `modes_blocked_by_insufficiency`: list of participation modes that cannot be reached until this insufficiency is resolved

**Current state:** ADV-002 (PENDING_DERIVATION) emitted with text reasons. Structured insufficiency array absent. `modes_blocked_by_insufficiency` absent. `originating_artifact` per insufficiency absent.

---

### Auditability Gap Summary

| Advisory | Explicit Rationale | Explicit Provenance | Reconstruction Path | Degradation Visibility |
|----------|-------------------|--------------------|--------------------|----------------------|
| ADV-01 | Partial (text) | ABSENT | ABSENT | ABSENT |
| ADV-02 | Partial (text) | ABSENT | ABSENT | ABSENT |
| ADV-03 | Partial (text) | ABSENT | ABSENT | modes_unavailable ABSENT |
| ADV-04 | Partial (text) | ABSENT | ABSENT | modes_blocked ABSENT |

**All four advisory types have significant auditability gaps in the current implementation.** These gaps must be closed before participation provenance (PT-03) is considered complete.

---

## 6. Semantic Degradation Observability

Six degradation paths must have defined visibility, logging, and reconstruction requirements.

---

### DO-01: Enrichment Unavailable

**Scenario:** psee_binding_envelope.json is absent from the run directory.

**Visibility requirement:** Advisory evaluator must emit a run-level degradation record: `{"degradation_event": "ENRICHMENT_UNAVAILABLE", "field": "binding/psee_binding_envelope.json", "fallback_mode": "OBSERVATIONAL_ONLY_NO_CONTEXT"}`

**Logging requirement:** `degradation_state` = `ENRICHMENT_UNAVAILABLE`. All enrichment-dependent advisories cannot be evaluated; advisory_count = 0 for ADV-01..ADV-04. A synthetic ADV-04 with reason "psee_binding_envelope.json absent" must be emitted.

**Reconstruction requirement:** From the advisory artifact, it must be evident that psee_binding_envelope.json was absent and that all advisory evaluations were therefore unavailable.

**Current state:** Partially handled — evaluator prints warning but does not emit a structured degradation record.

---

### DO-02: Topology Degraded

**Scenario:** G-06 FAIL — ceu_topology.cluster_count does not match canonical_topology.cluster_count.

**Visibility requirement:** gate_evaluation.json G-06 FAIL; advisory evaluator detects G-06 FAIL from gate_evaluation and emits a topology degradation record in participation_advisory.json.

**Logging requirement:** `degradation_event` structured object with: `event_type: "TOPOLOGY_INCONSISTENCY"`, `ceu_cluster_count`, `canonical_cluster_count`, `affected_advisories: ["ADV-01", "ADV-02"]` (both depend on cluster data).

**Reconstruction requirement:** From advisory artifact, identify that topology inconsistency existed and which advisories were affected.

**Current state:** G-06 PASS for run_02 (both=19). Advisory evaluator does not currently read G-06 result from gate_evaluation.json. Gap: advisory evaluator must read gate results, not just activation_state.

---

### DO-03: Evidence Incomplete

**Scenario:** evidence_state.evidence_confidence is null (current state for run_02).

**Visibility requirement:** ADV-001 (confidence_downgrade, CONTEXT_INCOMPLETE) is emitted. ✓ Currently implemented.

**Logging requirement:** `degradation_event` structured object for evidence incompleteness must be added to a dedicated `degradation_log` array in participation_advisory.json, separate from advisories.

**Reconstruction requirement:** From advisory artifact, reproduce the evidence_confidence null check. Currently reconstructable from ADV-001 text reason. Becomes fully reconstructable when AL-03 (structured reason object) is implemented.

**Current state:** PARTIALLY MET. Advisory emitted. Structured degradation_event object absent.

---

### DO-04: Selector Traceability Incomplete

**Scenario:** selector_context.selector_confidence is null; selector not authorized.

**Visibility requirement:** ADV-002 (evidence_insufficiency, PENDING_DERIVATION) cites selector_confidence null. ✓ Currently partially implemented.

**Logging requirement:** `degradation_event` structured object: `event_type: "SELECTOR_NOT_AUTHORIZED"`, `selector_confidence_observed: null`, `modes_blocked: ["ENRICHED_PARTICIPATION"]`.

**Reconstruction requirement:** From advisory artifact, identify that selector traceability was absent and which modes are blocked.

**Current state:** PARTIALLY MET. Advisory cites this. Structured degradation event absent.

---

### DO-05: Advisory Instability

**Scenario:** The same enrichment inputs (same psee_binding_envelope.json values) produce different advisory types or states across multiple evaluator runs. This would indicate a logic error or non-determinism in the evaluator.

**Visibility requirement:** A multi-run advisory consistency check must compare advisory_type and advisory_state across reference runs with equivalent inputs. Any inconsistency must be flagged as `degradation_event: "ADVISORY_INSTABILITY"`.

**Logging requirement:** Advisory stability log comparing advisory_id, advisory_type, advisory_state, enrichment_inputs_used across N reference runs. Any deviation is an instability event.

**Reconstruction requirement:** From stability log, reproduce which advisory differed and what input values were different.

**Current state:** NOT IMPLEMENTED. Advisory evaluator has run once (one reference run). Multi-run consistency check not yet designed.

---

### DO-06: Semantic Ambiguity

**Scenario:** Two advisory triggers fire simultaneously with contradictory signals — e.g., ADV-01 (suppression: grounding_ratio < 0.7) and ADV-02 (escalation: cluster_count > 10 with overlap > 0) both emitted for the same run. These advisories point in opposite directions for the same node population.

**Visibility requirement:** If ADV-01 and ADV-02 are simultaneously emitted, a `semantic_conflict_advisory` must be added noting the contradiction and explicitly deferring resolution to 75.x or governance authority.

**Logging requirement:** `semantic_conflict` field in participation_advisory.json: `{"type": "SUPPRESSION_ESCALATION_CONFLICT", "suppression_advisory_id": "ADV-xxx", "escalation_advisory_id": "ADV-yyy", "resolution": "DEFERRED_TO_GOVERNANCE"}`

**Reconstruction requirement:** From advisory artifact, identify that conflicting advisories were emitted and that resolution was deferred.

**Current state:** NOT IMPLEMENTED. For run_02, no conflict exists (ADV-01 and ADV-02 both not emitted). The conflict scenario is a future risk when both trigger conditions are met simultaneously.

---

### Degradation Observability Status

| Degradation Path | Visibility | Logging | Reconstruction | Current Status |
|-----------------|-----------|---------|---------------|----------------|
| DO-01: Enrichment unavailable | PARTIAL | NOT MET | PARTIAL | Partial |
| DO-02: Topology degraded | NOT MET | NOT MET | NOT MET | Not implemented |
| DO-03: Evidence incomplete | MET | PARTIAL | PARTIAL | Partially met |
| DO-04: Selector traceability | PARTIAL | NOT MET | PARTIAL | Partially met |
| DO-05: Advisory instability | NOT MET | NOT MET | NOT MET | Not implemented |
| DO-06: Semantic ambiguity | NOT MET | NOT MET | NOT MET | Not implemented |

---

## 7. Future Activation Traceability Preconditions

The following traceability capabilities must exist and be validated before semantic participation authority could ever be reviewed for governance consideration. These are traceability prerequisites — not authorization.

**Governing principle:**

> **Observability ≠ authority.**  
> Having complete traceability is necessary for authority review. It is not sufficient. It does not grant authority. Authority is a separate governance action by the governance authority.

---

### ATP-01: Semantic Influence Lineage Complete

**What is required:** All six semantic influence dimensions (SI-01..SI-06) implemented in advisory records. Every enrichment input consumed by any advisory must be traceable from source artifact through psee_binding_envelope.json to the advisory record with value, threshold, comparison, and reversibility path documented.

**Current state:** SI-01 field paths present; values absent. SI-02..SI-06 absent.

---

### ATP-02: Reversible Participation Replay

**What is required:** Given a historical participation_advisory.json, it must be possible to re-execute the advisory evaluator with the same inputs and produce bit-identical output. Replay validation must be demonstrated across all reference runs.

**What this implies:** The advisory evaluator must be deterministic (same inputs → same outputs — it already is, by design). Historical source artifacts must be retained (immutable run artifact policy). Replay test harness must be implemented.

**Current state:** Determinism is designed. Immutable artifact policy not formally defined. Replay test harness not implemented.

---

### ATP-03: Advisory Reconstruction

**What is required:** From participation_advisory.json alone (without re-reading source files), fully reproduce all trigger conditions for every emitted advisory.

**What this implies:** All AL-01..AL-08 lineage requirements must be satisfied. The advisory must be self-describing.

**Current state:** NOT MET. AL-02 (originating_artifact), AL-03 (structured reason), AL-08 (provenance chain) are absent.

---

### ATP-04: Degradation Replay

**What is required:** All six degradation paths (DO-01..DO-06) must be demonstrably triggerable and produce consistent, expected advisory outputs. A degradation test suite must cover all six scenarios.

**What this implies:** Deliberate adversarial test runs with:
- psee_binding_envelope.json absent (DO-01)
- Injected G-06 FAIL (DO-02)
- evidence_confidence null (DO-03) — currently present in run_02, but structured logging is absent
- selector_confidence null (DO-04) — currently present, structured logging absent
- Two evaluator runs with identical inputs producing identical advisory output (DO-05)
- Simultaneous ADV-01 + ADV-02 triggers with semantic_conflict logged (DO-06)

**Current state:** DO-03 and DO-04 occur naturally in run_02 but structured degradation records are absent. DO-01, DO-02, DO-05, DO-06 not tested.

---

### ATP-05: Participation Provenance Chain Formalized

**What is required:** gate_evaluation.json and participation_advisory.json must be formally linked as a provenance pair with:
- A shared `session_id` or cross-reference
- A `provenance_chain` listing the artifact sequence
- A `session_timestamp` proving contemporaneity

**Current state:** The pair is linked by shared client_id + run_id (implicit). No formal provenance chain. AL-08 requirement (provenance_chain array) addresses this.

---

### ATP-06: Semantic Audit Completeness

**What is required:** For any reference run, a complete semantic audit log must be producible covering:
- All advisory events (advisory_id, type, state, reason, inputs, provenance)
- All mode transitions (mode before, mode after, reason for transition)
- All degradation events (event_type, affected_fields, fallback_mode)
- All governance gate states at evaluation time
- Total influence scope (how many nodes/clusters/run-wide advisories were emitted)

**What this implies:** A dedicated `semantic_audit.json` artifact produced alongside participation_advisory.json.

**Current state:** NOT IMPLEMENTED. participation_advisory.json contains the advisory content but not a formal audit log. The audit log would be a derived summary, not a duplicate.

---

### Traceability Precondition Status

| Precondition | Current State | Required Work |
|-------------|--------------|--------------|
| ATP-01: Influence lineage complete | NOT MET | Implement SI-01..SI-06 in advisory records |
| ATP-02: Reversible participation replay | NOT MET | Define immutable artifact policy; build replay harness |
| ATP-03: Advisory reconstruction | NOT MET | Implement AL-02, AL-03, AL-08 |
| ATP-04: Degradation replay | NOT MET | Build degradation test suite for DO-01..DO-06 |
| ATP-05: Provenance chain formalized | NOT MET | Implement AL-08 (provenance_chain) + session linking |
| ATP-06: Semantic audit completeness | NOT MET | Design and implement semantic_audit.json |

**0 of 6 activation traceability preconditions met.** This is the primary technical gap preventing any future activation traceability authority review.

---

## 8. Traceability Ownership Model

Ownership of each provenance type is fixed. No layer may absorb another layer's provenance responsibility.

---

### Layer: 40.x / PiOS Core

**Provenance type owned:** PT-01 (Structural Provenance) + PT-02 (Semantic Provenance)

**Structural provenance:** Owns production of binding_envelope.json and canonical_topology.json through the 40.2→40.4 ingestion pipeline. Structural provenance is the foundation for all downstream provenance types.

**Semantic provenance:** Owns production of psee_binding_envelope.json via add_psee_enrichment_stubs.py. Responsible for adding the `psee_enrichment_meta.source_map` field that links each enrichment key to its originating structural artifact.

**May NOT:** Own advisory provenance (generated by advisory layer). Own activation provenance (generated by 75.x when authorized).

---

### Layer: Gate Evaluator (evaluate_psee_gate.py)

**Provenance type owned:** Readiness provenance (subset of PT-04 Participation Provenance)

**Role:** Produces gate_evaluation.json — the authoritative readiness record for a run. This is the governance gate state that all downstream provenance types must reference.

**Traceability responsibility:** gate_evaluation.json must be immutable after production for a given run. If re-run with updated inputs, a new run_id or versioned filename must be used.

**May NOT:** Own advisory provenance. Own semantic provenance (generated by 40.x). Own activation provenance.

---

### Layer: Advisory Layer (evaluate_enrichment_participation.py)

**Provenance type owned:** PT-03 (Advisory Provenance) + PT-04 (Participation Provenance, full session)

**Role:** Produces participation_advisory.json. Responsible for all advisory lineage requirements (AL-01..AL-08) and all degradation observability requirements (DO-01..DO-06). Also responsible for producing semantic_audit.json (when implemented).

**Traceability responsibility:** participation_advisory.json must be self-describing — all advisory triggers reconstructable without re-reading source files.

**May NOT:** Own structural or semantic provenance. Own activation provenance.

---

### Layer: 75.x CONDITION ACTIVATION

**Provenance type owned:** PT-05 (Activation Provenance — future, when authorized)

**Role (future):** If a consumption framework is ever authorized, 75.x would own the activation provenance record — documenting which advisory inputs were consulted, for which nodes, producing which activation outcomes.

**Traceability responsibility (future):** Every advisory consultation must be logged in the activation provenance record. No advisory may influence 75.x behavior without being traceable in PT-05.

**May NOT:** Own advisory provenance. Absorb semantic provenance responsibility. Create provenance by consuming undocumented inputs.

---

### Layer: 41.x PROJECTION

**Provenance type owned:** Projection provenance only (Lane A outputs to signal_projection.json)

**Role:** Consumes condition_correlation_state.json (Lane A output). Does not participate in the PSEE semantic provenance chain.

**Traceability responsibility:** 41.x is ignorant of the semantic provenance chain. Its provenance is: binding_envelope.json → condition_correlation_state.json → signal_projection.json. This is a separate chain from PT-01..PT-05.

**May NOT:** Own any PSEE provenance type. Consume psee_binding_envelope.json. Be influenced by advisory records.

---

### Ownership Summary Table

| Layer | Owns | Does NOT Own |
|-------|------|--------------|
| 40.x / PiOS Core | PT-01 (structural), PT-02 (semantic) | Advisory, activation provenance |
| Gate evaluator | Readiness provenance (PT-04 subset) | Semantic, advisory, activation provenance |
| Advisory layer | PT-03 (advisory), PT-04 (participation) | Structural, semantic, activation provenance |
| 75.x | PT-05 (activation, future) | All upstream provenance types |
| 41.x | Lane A projection provenance | Any PSEE provenance type |

---

## 9. Current Governance Verdict

The current semantic traceability maturity is assessed against the five provenance types and six activation traceability preconditions.

---

### Evidence-Based Assessment

**PT-01 (Structural Provenance):** IMPLEMENTED — binding_envelope.json and canonical_topology.json are produced by the 40.x pipeline per-run.

**PT-02 (Semantic Provenance):** PARTIAL — psee_binding_envelope.json is produced by add_psee_enrichment_stubs.py. Source map absent. Derivation formula for evidence_confidence absent. Structural_overlap placeholder without derivation documentation.

**PT-03 (Advisory Provenance):** PARTIAL — participation_advisory.json exists and emits 4 advisory types. Advisory lineage requirements AL-02 (originating_artifact), AL-03 (structured reason), AL-07 (gate result snapshot), AL-08 (provenance chain) are all absent. Advisory records are not self-describing for cold reconstruction.

**PT-04 (Participation Provenance):** PARTIAL — gate_evaluation.json and participation_advisory.json exist as a pair. No formal session linking. No degradation_event structured objects (DO-01..DO-06 requirements not met). No semantic_audit.json.

**PT-05 (Activation Provenance):** NOT IMPLEMENTED — no consumption framework; no coupling; no activation provenance artifact. This is the correct state.

**ATP-01..ATP-06:** All 6 activation traceability preconditions NOT MET.

---

### Governance Verdict: PARTIAL

The current semantic traceability maturity is **PARTIAL**.

**Justification:**

The observability infrastructure exists and operates correctly (OBSERVATIONAL_ONLY mode, advisory evaluator operational, OBS-01..OBS-05 satisfied for one reference run). This is genuine progress.

However, the traceability depth is insufficient for cold reconstruction. Advisory records are not self-describing:
- originating_artifact is absent (AL-02) — cannot determine which source file produced an advisory without re-reading inputs
- Structured reason objects are absent (AL-03) — cannot programmatically reconstruct trigger conditions
- Provenance chain is absent (AL-08) — cannot trace the artifact sequence from advisory back to source
- Degradation records are text-embedded, not structured (DO-01..DO-06)
- Advisory has run once; stability not proven
- 0 of 6 activation traceability preconditions met

**PARTIAL maturity means:** The system is observable but not fully reconstructable. An auditor with access to all source artifacts could verify the advisories. An auditor with only the advisory artifact could not.

**The gap between PARTIAL and OBSERVABLE** is exactly the set of advisory lineage requirements (AL-01..AL-08) and degradation observability requirements (DO-01..DO-06).

**The gap between OBSERVABLE and GOVERNANCE_READY** is exactly the set of activation traceability preconditions (ATP-01..ATP-06).

**GOVERNANCE_READY** — the state needed before semantic participation authority can be reviewed — requires both gaps to be closed.

---

## 10. Safe Next Step

**Recommended contract:** PI.PSEE-PIOS.SEMANTIC-PROVENANCE-INSTRUMENTATION.IMPLEMENTATION.01

**Scope:** Passive semantic provenance instrumentation — no runtime impact, no participation mode escalation, no derivation authority.

**What this implementation does:**

1. Extends participation_advisory.json format to satisfy AL-01..AL-08:
   - Adds `enrichment_input_values` object to each advisory (AL-01)
   - Adds `originating_artifact` field to each advisory (AL-02)
   - Adds `advisory_reason_structured` object (threshold, observed_value, comparison, result) to each advisory (AL-03)
   - Adds `participation_mode_at_emission` and `degradation_state_at_emission` to each advisory (AL-04, AL-05)
   - Reads gate_evaluation.json gate results and includes `governance_gate_state_snapshot` in advisory artifact (AL-07)
   - Adds `provenance_chain` array (AL-08)

2. Adds `degradation_log` array to participation_advisory.json with structured `degradation_event` objects for DO-01..DO-04 (DO-05 and DO-06 require multi-run and simultaneous advisory scenarios; addressed in subsequent steps)

3. Adds `modes_unavailable` field to ADV-03 records (SA-03 requirement)

4. Adds `modes_blocked_by_insufficiency` field to ADV-04 records (SA-04 requirement)

5. Adds `influence_confidence` field derived from grounding_ratio + evidence_confidence (SI-05)

6. Produces `semantic_audit.json` alongside participation_advisory.json summarizing all advisory events, mode transitions, degradation events, and governance gate state for the run

7. Extends psee_binding_envelope.json to include `psee_enrichment_meta.source_map` (PT-02 gap) — requires extending add_psee_enrichment_stubs.py

**What this implementation does NOT do:**
- Does NOT elevate participation mode beyond OBSERVATIONAL_ONLY
- Does NOT implement evidence_confidence derivation (separate stream required)
- Does NOT implement structural_overlap derivation (separate stream required)
- Does NOT implement 75.x coupling
- Does NOT authorize semantic participation authority
- Does NOT modify any 75.x or 41.x script
- Does NOT change runtime behavior

**Additional parallel safe steps** (may proceed alongside or after):

1. **Degradation simulation** — deliberately trigger DO-01 (absent psee_binding_envelope.json), DO-02 (injected G-06 FAIL), and DO-03 HARD_DOWNGRADE (injected grounding_ratio < 0.5). Validate advisory output matches expected pattern. No new stream required; can be executed as validation tests for the provenance instrumentation stream.

2. **Advisory stability run** — execute both evaluators against a second reference run to begin N=3 multi-run advisory consistency check (MPC-04 from governance review). Validates DO-05 (advisory instability) detection.

3. **Source map extension for add_psee_enrichment_stubs.py** — add `psee_enrichment_meta.source_map` to psee_binding_envelope.json output, closing PT-02 gap. Lightweight change to an existing script.

---

## 11. Validation

PASS criteria:

- [x] Five provenance types defined (PT-01..PT-05) with boundaries, ownership, reconstruction expectations
- [x] Cold reconstruction requirement stated for PT-02..PT-04
- [x] Eight advisory lineage requirements defined (AL-01..AL-08)
- [x] Four current gaps in advisory lineage identified (AL-02, AL-03, AL-07, AL-08 absent)
- [x] Six semantic influence dimensions defined (SI-01..SI-06)
- [x] Semantic influence ≠ semantic authority explicitly stated
- [x] Four advisory types with explicit auditability requirements (SA-01..SA-04)
- [x] Auditability gaps identified for all four advisory types
- [x] Node-count ceiling requirement for ADV-02 escalation stated
- [x] Six semantic degradation paths defined (DO-01..DO-06) with visibility/logging/reconstruction requirements
- [x] Six activation traceability preconditions defined (ATP-01..ATP-06)
- [x] Observability ≠ authority explicitly stated (Section 7 governing principle)
- [x] Five-layer traceability ownership model defined
- [x] Current governance verdict = PARTIAL, justified from evidence
- [x] Gap between PARTIAL → OBSERVABLE → GOVERNANCE_READY defined
- [x] Safe next step = semantic provenance instrumentation (not derivation)
- [x] No implementation performed
- [x] No runtime mutation
- [x] No threshold modification
- [x] No semantic authority escalation
- [x] Enriched derivation remains blocked (no authorization performed)

FAIL conditions check:

- Semantic observability conflated with authority? NO — Section 7 governing principle explicitly states observability ≠ authority
- Advisory provenance incomplete? PARTIAL — gaps identified and documented; closing gaps is the next implementation step
- Suppression/escalation auditability weak? YES — gaps documented in Section 5 auditability gap summary; this is correct to identify, not to resolve in this design stream
- Semantic authority implicitly escalated? NO — verdict is PARTIAL, not GOVERNANCE_READY; ATP-01..ATP-06 all NOT MET
- Runtime behavior modified? NO — design only; no scripts created; no artifacts modified

Status: PASS
