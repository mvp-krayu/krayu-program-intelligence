# Semantic Replayability Validation — Governance Review

Stream: PI.PSEE-PIOS.SEMANTIC-REPLAYABILITY-VALIDATION.REVIEW.01  
Status: COMPLETE  
Generated: 2026-05-06  
Branch: feature/psee-pios-integration-productized  

LANE_SCOPE: A + D  
LANE_IMPACT:  
  Modifies Lane A runtime behavior: NO  
  Modifies Lane A scripts (75.x/41.x): NO  
  Implements enriched derivation: NO  
  Advances Lane D governance: YES — replayability maturity verdict issued

Authoritative inputs:
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-TRACEABILITY-OBSERVABILITY.DESIGN.01/SEMANTIC_TRACEABILITY_OBSERVABILITY.md`
- `docs/psee/PI.PSEE-PIOS.SEMANTIC-PROVENANCE-INSTRUMENTATION.IMPLEMENTATION.01/SEMANTIC_PROVENANCE_INSTRUMENTATION.md`
- `docs/psee/PI.PSEE-PIOS.ENRICHED-PSIG-DERIVATION-PRECONDITIONS.REVIEW.01/ENRICHED_PSIG_DERIVATION_PRECONDITIONS_REVIEW.md`
- `docs/psee/PI.PSEE-PIOS.ENRICHMENT-PARTICIPATION-ADVISORY.IMPLEMENTATION.01/ENRICHMENT_PARTICIPATION_ADVISORY.md`
- `artifacts/psee_advisory/fastapi/run_02_oss_fastapi_pipeline/participation_advisory.json`
- `artifacts/psee_semantic_provenance/fastapi/run_02_oss_fastapi_pipeline/semantic_provenance.json`
- `artifacts/psee_gate/fastapi/run_02_oss_fastapi_pipeline/gate_evaluation.json`
- `docs/governance/psee_enrichment_schema.json`

Evidence base (run_02_oss_fastapi_pipeline, 2026-05-06):

| Field | Value |
|-------|-------|
| replay_supported | PARTIAL |
| advisory_reconstructable | PARTIAL |
| degradation_reconstructable | PARTIAL |
| enrichment_inputs_attributable | PARTIAL |
| provenance_chain_complete | PARTIAL |
| replay_gaps | 10 |
| degradation_lineage events | 4 (all replayable=true) |
| advisory_lineage records | 2 (both observability_state=PARTIAL) |
| lineage_gaps per advisory | 6 |
| PT-01 structural | IMPLEMENTED |
| PT-02..PT-04 | PARTIAL |
| PT-05 activation | NOT_IMPLEMENTED |

---

## 1. Purpose

This governance review validates whether the semantic provenance, advisory lineage, and degradation observability produced by the current instrumentation stack are sufficiently reconstructable, replayable, and accountable to warrant progression toward semantic authority consideration.

**This review does not authorize semantic authority.** It assesses replayability maturity only. The finding that a system is replayable is a prerequisite for authority review — not equivalent to authority.

**This review does not implement anything.** It produces a single governance document.

**Governing principle of this document:**

> **Replayability validates accountability. Accountability enables authority review. Neither replayability nor accountability constitutes authority.**

The path is: replayability → accountability → authority review → authorization (governance action). Each step is a separate gate.

---

## 2. Replayability Question

### The Central Question

> **Can semantic participation be deterministically reconstructed from provenance artifacts alone?**

This question requires four concepts to be kept rigorously separate:

---

### RQ-01: Observability

**Question:** Can the current state of semantic participation be seen?

**Answer: YES.** The instrumentation stack is operational:
- `gate_evaluation.json`: activation_state, gate results, readiness
- `participation_advisory.json`: advisory type/state/reason, enrichment inputs, degradation state
- `semantic_provenance.json`: advisory lineage, degradation lineage, provenance chain

Observability means the enrichment system's current state is visible and recorded. It does not mean the state can be reproduced from artifacts alone.

---

### RQ-02: Replayability

**Question:** Given only the provenance artifacts (without re-running source pipeline), can every advisory and degradation event be reproduced deterministically?

**Answer: PARTIAL.** The advisory evaluator is deterministic by design (stdlib, no randomness, same inputs → same outputs). However:

- The advisory artifact (participation_advisory.json) is not self-describing: it lacks `originating_artifact` (AL-02), `advisory_reason_structured` (AL-03), and `provenance_chain` (AL-08). Cold reconstruction from the advisory artifact alone fails for 6 format gaps.
- Observed enrichment values (null, 0, null) are present in the provenance record (semantic_provenance.json) but not in the advisory record itself. An auditor with only participation_advisory.json cannot reconstruct which source file produced each null value.
- Advisory stability is unproven: one reference run exists. N=3 is required to validate that the same inputs reliably produce the same advisories.

Replayability is the transition from "I can see it" to "I can prove I would see the same thing again without re-running the system."

---

### RQ-03: Accountability

**Question:** Is every advisory causally attributed to a specific enrichment input, source artifact, and governance gate state — such that an external auditor could verify the causal chain?

**Answer: PARTIAL.** The provenance capture adds source attribution, observed values, and degradation event linkage. But this attribution lives in semantic_provenance.json — a derived record — not in the advisory artifact itself. If semantic_provenance.json were unavailable, the advisory record alone would not support external audit.

Accountability is satisfied when the advisory is self-auditable — when the causal chain is intrinsic to the advisory record, not dependent on a secondary derivation.

---

### RQ-04: Authority

**Question:** Does replayability or accountability authorize semantic participation?

**Answer: NO.**

Replayability is a technical property. Accountability is an audit property. Authority is a governance property — it requires an explicit governance action by the governance authority. No degree of technical replayability produces authority. The verdict at the end of this review is a maturity classification, not an authorization.

---

### Summary: The Four-Level Separation

```
OBSERVABILITY     → ACHIEVED (instrumentation stack operational)
REPLAYABILITY     → PARTIAL (advisory deterministic; format gaps prevent cold reconstruction)
ACCOUNTABILITY    → PARTIAL (provenance record adds attribution; advisory not self-describing)
AUTHORITY         → BLOCKED (governance action required; no technical path to authority)
```

---

## 3. Advisory Reconstruction Review

Six dimensions of advisory reconstruction are assessed.

---

### AR-01: Advisory Causality

**Question:** Can the causal chain (enrichment input → threshold check → advisory emission) be reconstructed?

**Evidence:** Text `advisory_reason` is present in all advisories. It describes the causal chain in English. However, the structured trigger object (AL-03 `advisory_reason_structured`) is absent — there is no machine-readable `{observed_value, threshold, comparison, result}` object.

**Classification: PARTIAL**

**Gap:** Without the structured trigger object, programmatic causal reconstruction (e.g., a replay harness that verifies the advisory reason automatically) is not possible. Human reconstruction is possible from the text reason, but automated reconstruction is not.

---

### AR-02: Originating Enrichment Inputs

**Question:** Are the originating enrichment inputs identified with their observed values at the time of advisory emission?

**Evidence:**
- `enrichment_inputs_used` field paths present in advisory records (e.g., `["evidence_state.evidence_confidence"]`)
- Observed values (null, 0, null) added by `semantic_provenance.json` — NOT present in advisory artifact itself
- `originating_artifact` (source file) added by provenance capture — NOT in advisory artifact

**Classification: PARTIAL**

**Gap (AL-02):** An auditor with only participation_advisory.json knows which fields caused each advisory but not what values they held at emission time or which file they came from. The advisory is not self-describing for input values.

---

### AR-03: Provenance Chain Continuity

**Question:** Is there an unbroken chain from source artifact to advisory?

**Evidence:**
- `semantic_provenance.json` contains `provenance_chain` linking gate_evaluation.json → psee_binding_envelope.json → participation_advisory.json
- This chain is in the provenance capture record, not in the advisory artifact
- `psee_binding_envelope.json` does not contain a `source_map` linking enrichment fields to their ultimate source files (e.g., grounding_state_v3.json for grounding_ratio)

**Classification: PARTIAL**

**Gap (AL-08 + PT-02):** The chain exists as a cross-artifact reconstruction (combining advisory + provenance records). It does not exist as an intrinsic property of the advisory artifact.

---

### AR-04: Degradation Linkage

**Question:** Are degradation events linked to the advisories they produced?

**Evidence:**
- `semantic_provenance.json` degradation_lineage includes `advisory_refs` linking DEG-001 to ADV-001+ADV-002, DEG-002/003 to ADV-002
- Advisory records do not include reverse links to their originating degradation events
- DEG-004 (ACTIVATION_NOT_AUTHORIZED) has no advisory_refs — it is captured only in gate_evaluation.json and provenance record, not in any advisory

**Classification: PARTIAL**

**Gap:** The linkage is one-directional (degradation → advisory). The advisory artifact does not carry a `degradation_event_ref` pointing back to the degradation event that caused it. Bidirectional linkage is required for full accountability.

---

### AR-05: Governance Gate Linkage

**Question:** Is the gate state at advisory emission recorded with each advisory?

**Evidence:**
- Top-level `activation_state` present in participation_advisory.json
- `governance_gate_state` snapshot (bp_01_resolved, bp_02_resolved, activation_authorized, grounding_ratio, cluster_count) added by provenance capture — NOT in advisory artifact itself
- Individual gate results (G-01..G-09 PASS/FAIL) not in advisory artifact or provenance record summary

**Classification: PARTIAL**

**Gap (AL-07):** The per-advisory gate snapshot lives in provenance capture, not in the advisory record. An auditor with only participation_advisory.json sees the activation_state summary but not the individual gate results that produced it.

---

### AR-06: Replay Determinism

**Question:** Given the same inputs, does the advisory evaluator always produce the same advisories?

**Evidence:**
- Advisory evaluator uses stdlib only, no randomness, integer/float/string comparisons — deterministic by construction
- ENRICHMENT_SOURCE_MAP is a compile-time constant — no runtime variability
- Threshold constants (GROUNDING_ADVISORY_THRESHOLD=0.7, GROUNDING_HARD_THRESHOLD=0.5, CLUSTER_ESCALATION_THRESHOLD=10) are fixed
- **One reference run only** — empirical determinism not yet validated across multiple executions

**Classification: PARTIAL**

**Gap:** Determinism is a design property, not a validated empirical property. N=1 is insufficient to assert that the evaluator produces identical output across multiple runs with the same inputs. Platform-specific float comparison behavior (though unlikely with these values) and Python version differences are unvalidated.

---

### Advisory Reconstruction Summary

| Dimension | Classification | Primary Gap |
|-----------|---------------|------------|
| AR-01: Advisory causality | PARTIAL | AL-03 structured trigger absent |
| AR-02: Originating enrichment inputs | PARTIAL | AL-02 observed values not in advisory |
| AR-03: Provenance chain continuity | PARTIAL | AL-08 chain not in advisory; PT-02 source_map absent |
| AR-04: Degradation linkage | PARTIAL | Advisory lacks degradation_event_ref |
| AR-05: Governance gate linkage | PARTIAL | AL-07 gate snapshot not in advisory |
| AR-06: Replay determinism | PARTIAL | Empirically unvalidated (N=1) |

**All six dimensions are PARTIAL. No dimension is COMPLETE. No dimension is INSUFFICIENT.**

The system is closer to PARTIAL than to INSUFFICIENT — the field paths are present, the text reasons are present, and the provenance capture adds significant attribution. But self-describing advisories (the standard required for cold reconstruction) are not yet achieved.

---

## 4. Degradation Replayability Review

Five degradation replay targets are assessed.

---

### DR-01: Evidence Insufficiency (DEG-001)

**Evidence:** DEG-001 (EVIDENCE_INCOMPLETE) captured in provenance lineage. evidence_confidence=null in psee_binding_envelope.json. ADV-001 (confidence_downgrade, CONTEXT_INCOMPLETE) emitted in advisory artifact.

**Replay determinism:** DETERMINISTIC — the same psee_binding_envelope.json with evidence_confidence=null will always produce DEG-001 + ADV-001 in the same evaluator run. The condition `evidence_confidence is None` is a simple boolean check with no variability.

**Replay completeness:** PARTIAL — the degradation event is captured in semantic_provenance.json with full structured detail. The advisory artifact contains the text-form reason but not the structured degradation_event object.

**Replay reversibility:** HIGH — changing evidence_confidence to non-null (when derivation stream is implemented) removes this degradation deterministically.

---

### DR-02: Activation Authorization Absence (DEG-004)

**Evidence:** DEG-004 (ACTIVATION_NOT_AUTHORIZED) captured in provenance lineage. activation_authorized=false in gate_evaluation.json. No advisory emitted for this — captured only in gate G-08 FAIL.

**Replay determinism:** DETERMINISTIC — `activation_authorized` is hardcoded false in the gate evaluator; G-08 always FAILS; DEG-004 always appears.

**Replay completeness:** PARTIAL — visible in gate_evaluation.json (G-08 FAIL) and in provenance degradation_lineage. NOT present in participation_advisory.json at all. An auditor reading only the advisory artifact would miss DEG-004 entirely.

**Replay reversibility:** HIGH (governance authority action to set activation_authorized=true).

**Gap:** DEG-004 is the only degradation event with no advisory_refs — its visibility is entirely in gate and provenance artifacts, not in the advisory. The advisory evaluator should emit an ADV-level record for activation authorization absence (currently it does not — this is a gap in the advisory evaluator design).

---

### DR-03: Topology Incompleteness (future)

**Evidence:** Not present for run_02 — G-06 PASS (both cluster counts = 19). No DEG event for topology.

**Replay determinism:** EXPECTED DETERMINISTIC — if cluster counts diverge, G-06 FAIL would be consistent.

**Replay completeness:** NOT TESTED — the advisory evaluator does not read individual gate results from gate_evaluation.json; it reads only activation_state. A G-06 FAIL would not be reflected in any advisory unless the advisory evaluator is extended to read gate results.

**Gap:** Advisory evaluator reads `activation_state` from gate_evaluation.json (which would be ENRICHMENT_BLOCKED on G-06 FAIL) but does not read individual gate results. If G-06 failed, the degradation would be captured as ENRICHMENT_BLOCKED activation_state but no specific "TOPOLOGY_INCONSISTENCY" advisory would be emitted.

---

### DR-04: Selector Traceability Gaps (DEG-003)

**Evidence:** DEG-003 (SELECTOR_NOT_AUTHORIZED) captured. selector_confidence=null. Referenced in ADV-002.

**Replay determinism:** DETERMINISTIC — same inputs always produce DEG-003 when selector_confidence is null.

**Replay completeness:** PARTIAL — visibility=PARTIAL (cited in compound ADV-002 evidence_insufficiency, not a dedicated advisory). DEG-003 is structurally identical across runs — always PENDING_DERIVATION until selector is authorized.

**Replay reversibility:** HIGH (selector authorization event + derivation).

---

### DR-05: Semantic Ambiguity (no current instance)

**Evidence:** No semantic ambiguity (ADV-01 + ADV-02 simultaneously) present in run_02 — ADV-01 not emitted (suppression_flags=[], grounding_ratio=0.9), ADV-02 not emitted (structural_overlap.edge_count=0).

**Replay determinism:** UNKNOWN — conflict detection logic (semantic_conflict_advisory from design doc) not yet implemented. If both triggers fired simultaneously, replay behavior of a conflict advisory is undefined.

**Replay completeness:** NOT IMPLEMENTED — the design specifies a `semantic_conflict` field in participation_advisory.json when ADV-01 and ADV-02 coexist, but this is not implemented.

**Gap:** This is a design-defined degradation path that is not yet instrumented. Once structural_overlap derivation is implemented and ADV-02 could emit, the semantic ambiguity scenario becomes possible.

---

### Degradation Replayability Summary

| Target | Determinism | Completeness | Reversibility | Current Instance |
|--------|-------------|-------------|--------------|-----------------|
| DR-01: Evidence insufficiency | DETERMINISTIC | PARTIAL | HIGH | Present (DEG-001) |
| DR-02: Activation absent | DETERMINISTIC | PARTIAL | HIGH | Present (DEG-004) |
| DR-03: Topology incomplete | EXPECTED | NOT TESTED | HIGH | Not present |
| DR-04: Selector gaps | DETERMINISTIC | PARTIAL | HIGH | Present (DEG-003) |
| DR-05: Semantic ambiguity | UNKNOWN | NOT IMPLEMENTED | TBD | Not present |

**All present degradation events are deterministically replayable.** The completeness gap is that structured degradation_event objects exist in semantic_provenance.json but not in participation_advisory.json. An auditor with only the advisory artifact cannot reconstruct the full degradation record.

---

## 5. Provenance Chain Sufficiency Review

Five dimensions of provenance chain sufficiency are assessed.

---

### PS-01: Provenance Continuity

**Question:** Is there an unbroken chain from source data to advisory?

**Evidence:**
- PT-01 (structural): binding_envelope.json ← 40.x pipeline ← raw source. Continuous.
- PT-02 (semantic): psee_binding_envelope.json ← add_psee_enrichment_stubs.py ← canonical_topology.json + grounding_state_v3.json + vault_readiness.json. Partially documented (source_map absent).
- PT-03 (advisory): participation_advisory.json ← evaluate_enrichment_participation.py ← psee_binding_envelope.json + gate_evaluation.json. Partially documented (AL-02/03/08 absent from advisory).
- PT-04 (participation): semantic_provenance.json ← capture_semantic_provenance.py ← gate + advisory + psee_be. Partially documented (no session_id linking).
- PT-05 (activation): NOT IMPLEMENTED.

**Assessment:** Provenance continuity exists in the system design and is traceable with the provenance capture record. It is NOT intrinsic to the individual artifacts — the chain must be reconstructed across multiple files.

**Gap:** Irreducible until PT-02 source_map and advisory AL-02/03/08 are closed.

---

### PS-02: Artifact Attribution

**Question:** Can each advisory be traced back to the specific artifact that provided its triggering input?

**Evidence:**
- `enrichment_inputs_used` in advisory: field paths only (e.g., `"evidence_state.evidence_confidence"`)
- `originating_enrichment_inputs[].source_artifact` in provenance: artifact paths added (`"binding/psee_binding_envelope.json"`)
- `originating_enrichment_inputs[].ultimate_source` in provenance: derivation origin added (e.g., `"NOT_YET_DERIVED"`)

The attribution is present in semantic_provenance.json. It is absent from the advisory artifact.

**Assessment:** PARTIAL — artifact attribution achieved at the provenance layer; not yet at the advisory layer.

---

### PS-03: Influence Attribution

**Question:** Is it clear which enrichment inputs influenced which advisory outcomes?

**Evidence:**
- Field paths in `enrichment_inputs_used` establish influence at the field level
- Observed values (null, 0, null) confirm the state of each influencing field at evaluation time
- `ENRICHMENT_SOURCE_MAP` in the provenance script provides the attribution chain

**Assessment:** PARTIAL — influence is attributable with provenance record assistance; self-attributable from advisory alone is not yet achieved.

---

### PS-04: Semantic Lineage Completeness

**Question:** Is the semantic lineage complete from source data to current advisory state, sufficient for a future authority review?

**Irreducible gaps** (cannot be closed without external derivation streams):
1. **evidence_state.evidence_confidence null** — no derivation formula exists; this gap cannot be closed until an evidence_confidence computation stream is issued
2. **structural_overlap.edge_count = 0 (placeholder)** — OVERLAP_STRUCTURAL derivation not implemented; structural lineage from topology to overlap is absent
3. **selector_context.selector_confidence null** — selector not authorized; selector lineage entirely absent

**Closeable gaps** (format gaps, closeable by extending existing scripts):
1. AL-02: originating_artifact in advisory records
2. AL-03: advisory_reason_structured
3. AL-08: provenance_chain in advisory
4. PT-02: source_map in psee_binding_envelope.json

**Assessment:** PARTIAL — two classes of gaps. Format gaps are closeable. Derivation gaps are structurally blocked and require separate governance streams.

---

### PS-05: Replay Lineage Completeness

**Question:** Is the semantic lineage complete enough to support deterministic replay?

**Assessment:** PARTIAL — the advisory evaluator is deterministic, and the provenance capture adds all missing attribution. But the replay standard requires self-describing artifacts (cold reconstruction without the provenance capture). That standard is not yet met.

**Unresolved accountability boundaries:**

Three accountability boundaries remain undefined, each blocking full lineage:

1. **BP-01 authorization boundary**: The process by which `psig_computation.json` is issued is not defined in any governance document. Who authorizes it, under what criteria, and what artifact records the authorization are undefined.

2. **Selector authorization boundary**: The process by which a PSEE selector is authorized to run (and set selector_confidence, suppression_flags) is not defined. An unauthorized selector producing suppression_flags would be undetectable from the advisory artifact alone.

3. **Activation authorization boundary**: The process by which `activation_authorized` is set to `true` is defined as "governance authority action" but the specific artifact, event, or record that captures this action is not defined. The gate evaluator hardcodes `activation_authorized = False` — when and how this would be changed is undefined.

These three boundaries are not format gaps — they are governance design gaps. Closing them requires explicit governance stream contracts, not script changes.

---

### Provenance Chain Sufficiency Summary

| Dimension | Assessment | Primary Gap |
|-----------|-----------|------------|
| PS-01: Provenance continuity | PARTIAL | Chain reconstructable only with provenance capture |
| PS-02: Artifact attribution | PARTIAL | Attribution in provenance; absent from advisory |
| PS-03: Influence attribution | PARTIAL | Influence visible with provenance assistance |
| PS-04: Semantic lineage completeness | PARTIAL | 3 derivation gaps (irreducible) + 4 format gaps (closeable) |
| PS-05: Replay lineage completeness | PARTIAL | Self-describing advisory not achieved |

**Three unresolved accountability boundaries identified** (BP-01, selector, activation authorization). These are governance design gaps, not implementation gaps.

---

## 6. Replayability Failure Mode Review

Six failure modes are assessed.

---

### RF-01: Advisory Replay Divergence

**Description:** Two runs of the advisory evaluator with the same inputs produce different advisories. This would invalidate all replay guarantees.

**Impact:** HIGH — the entire replayability claim rests on determinism; divergence would make the advisory artifact meaningless as a replay anchor

**Detectability:** MODERATE — only detectable with multi-run comparison (N=3 advisory stability test); not detectable from a single run

**Mitigation status:** UNVALIDATED — one reference run only. The evaluator is deterministic by design, but platform-specific behavior (Python version, float representation) is unvalidated. Threshold comparisons in the advisory evaluator use exact float equality (`< 0.7`, `< 0.5`) against runtime float values from JSON. If grounding_ratio were stored as a float with platform-specific representation, divergence could theoretically occur.

**Governance severity:** HIGH — blocks RRT-01 (deterministic advisory replay); blocks ATP-02 (reversible participation replay)

---

### RF-02: Semantic Lineage Ambiguity

**Description:** The same enrichment field appears in multiple advisory records with different implications — e.g., evidence_confidence=null causes both ADV-001 (CONTEXT_INCOMPLETE) and ADV-002 (evidence_insufficiency for MODE-03). An auditor might interpret the same null as having different meanings in different advisory records.

**Evidence for run_02:** evidence_state.evidence_confidence appears in both ADV-001 and ADV-002 enrichment_inputs_used. This is correct — the null has two different implications (confidence context incomplete for ADV-001; MODE-03 prerequisite missing for ADV-002). But the two advisory records do not cross-reference each other.

**Impact:** MODERATE — interpretive confusion for auditors; automated replay handles it correctly since evaluator logic is explicit

**Detectability:** HIGH — field overlap is visible in enrichment_inputs_used arrays

**Mitigation status:** ACCEPTABLE — the evaluator's logic is explicit about why the same field causes two different advisories. The text reasons differentiate them. Risk increases if a future implementor modifies the evaluator without understanding the dual-use of evidence_confidence.

**Governance severity:** MODERATE — does not block replay; creates audit interpretation risk

---

### RF-03: Provenance Incompleteness

**Description:** semantic_provenance.json is produced without a valid participation_advisory.json (e.g., if the advisory evaluator was not run first). In this case, the provenance record would have advisory_lineage=[] and degradation_lineage containing only derivation-gap events.

**Impact:** HIGH — provenance without advisory content has no advisory lineage to trace

**Detectability:** HIGH — `advisory_count: 0` and `advisory_lineage: []` in provenance would immediately indicate the advisory artifact was absent

**Mitigation status:** PARTIAL — the provenance script handles absent advisory with a warning and continues; it does not fail-close. The script should be extended to emit a structured error record if participation_advisory.json is absent, not just a warning.

**Governance severity:** MODERATE — detectable; easily diagnosed; but the resulting provenance artifact would be misleadingly empty

---

### RF-04: Hidden Influence Propagation

**Description:** An enrichment field influences an advisory emission but is not listed in `enrichment_inputs_used`. This would create a shadow influence — the advisory appears to be caused by certain inputs, but an unlisted input is the actual cause.

**Evidence for current evaluator:** The advisory evaluator's advisory logic is explicit: each advisory type uses a defined set of inputs (e.g., ADV-01 uses suppression_flags and grounding_ratio; ADV-03 uses grounding_ratio and evidence_confidence). However, a code audit confirming that no enrichment input outside enrichment_inputs_used affects advisory emission has not been performed.

**Impact:** CRITICAL — hidden influence makes provenance records false; audit and replay would be based on incorrect causal attribution

**Detectability:** LOW — requires line-by-line code audit of evaluate_enrichment_participation.py; not detectable from artifact inspection alone

**Mitigation status:** UNVALIDATED — no code audit performed. The evaluator is ~280 lines of explicit conditional logic; hidden influence is unlikely but unproven.

**Governance severity:** CRITICAL — if hidden influence exists, the provenance chain is invalid and all downstream accountability claims are false

---

### RF-05: Degradation Reconstruction Drift

**Description:** A future version of capture_semantic_provenance.py produces different degradation_event field names or structures for the same degradation condition. Historical and new provenance records are no longer comparable.

**Impact:** MODERATE — provenance artifacts from different versions cannot be compared; temporal analysis is broken

**Detectability:** MODERATE — schema version field in provenance artifact allows version detection; but schema version is not currently incremented on format changes

**Mitigation status:** PARTIAL — `schema_version: "1.0"` is present. There is no formal schema document for semantic_provenance.json that would enforce backward compatibility. A schema document (analogous to psee_enrichment_schema.json for enrichment keys) should be created for the provenance artifact format.

**Governance severity:** MODERATE — does not affect current run; affects longitudinal comparison

---

### RF-06: Replay Nondeterminism

**Description:** The advisory evaluator produces different advisory output on different Python versions or OS platforms.

**Evidence:** All threshold comparisons use Python float arithmetic against JSON-decoded float values. For run_02: grounding_ratio=0.9, GROUNDING_ADVISORY_THRESHOLD=0.7, GROUNDING_HARD_THRESHOLD=0.5. These comparisons are `0.9 < 0.7` (false) and `0.9 < 0.5` (false) — both exact and unambiguous. cluster_count=19, CLUSTER_ESCALATION_THRESHOLD=10: `19 > 10` (true) — integer comparison, exact. edge_count=0, condition `== 0` — exact. evidence_confidence is None, condition `is None` — exact.

**Assessment for run_02:** All current trigger conditions use either exact integer comparisons or None checks. Float comparison nondeterminism risk is LOW for these specific values.

**Impact:** MODERATE if it occurs — replay guarantee is platform-dependent

**Detectability:** HIGH — cross-platform test would immediately reveal any divergence

**Mitigation status:** LOW RISK for current inputs. Becomes a concern if future enrichment inputs involve computed floats (e.g., evidence_confidence derived from a formula) rather than JSON-decoded values.

**Governance severity:** LOW for current run; MODERATE for future derived float inputs

---

### Failure Mode Summary

| Failure Mode | Impact | Detectability | Mitigation Status | Governance Severity |
|-------------|--------|--------------|-------------------|-------------------|
| RF-01: Advisory replay divergence | HIGH | MODERATE | UNVALIDATED | HIGH |
| RF-02: Semantic lineage ambiguity | MODERATE | HIGH | ACCEPTABLE | MODERATE |
| RF-03: Provenance incompleteness | HIGH | HIGH | PARTIAL | MODERATE |
| RF-04: Hidden influence propagation | CRITICAL | LOW | UNVALIDATED | CRITICAL |
| RF-05: Degradation reconstruction drift | MODERATE | MODERATE | PARTIAL | MODERATE |
| RF-06: Replay nondeterminism | MODERATE | HIGH | LOW RISK | LOW |

**RF-04 (hidden influence propagation) is the highest-severity unmitigated risk.** It is also the lowest-detectability risk. A code audit of evaluate_enrichment_participation.py is required before any replayability guarantee can be asserted. RF-01 (advisory replay divergence) is HIGH severity and UNVALIDATED — N=3 advisory stability test is the path to validating it.

---

## 7. Minimum Replayability Threshold

The following six requirements must ALL be satisfied before semantic authority could re-enter governance review. Meeting all six thresholds does not authorize semantic authority — it makes the system eligible for a future authority review.

**Critical principle: meeting replayability thresholds ≠ semantic authority authorization.**

Authorization is a governance action by the governance authority. No technical achievement triggers authorization.

---

### RRT-01: Deterministic Advisory Replay

**What:** The advisory evaluator must produce identical output across N=3 runs with identical inputs, across at least two distinct reference runs (different source artifacts, not just re-runs of the same run).

**What "identical" means:** Same advisory_count, same advisory_id assignments, same advisory_type, same advisory_state, same enrichment_inputs_used for each advisory. Timestamps (evaluated_at, emitted_at) are excluded from identity comparison.

**Current state:** N=1. Unvalidated. **NOT MET.**

**Why required:** RF-01 is UNVALIDATED. Until N=3, determinism is a design claim, not an empirical fact.

---

### RRT-02: Deterministic Degradation Replay

**What:** All four degradation events currently present (DEG-001..DEG-004) must be reproducible from the same inputs with identical event_type, degradation_scope, and advisory_refs. Additionally, HARD_DOWNGRADE (ADV-003) must be demonstrably produced when grounding_ratio < 0.5 — this specific trigger has not been empirically tested.

**Current state:** DEG-001..DEG-004 are deterministically produced by design. HARD_DOWNGRADE trigger: NOT EMPIRICALLY TESTED. **PARTIALLY MET.**

**Why required:** MPC-05 (degradation validated) from governance review. Fail-closed behavior must be proven, not assumed.

---

### RRT-03: Self-Describing Advisory Artifacts

**What:** participation_advisory.json must satisfy AL-02 (originating_artifact), AL-03 (advisory_reason_structured), and AL-08 (provenance_chain) such that an auditor with only the advisory artifact can perform cold reconstruction without the provenance capture record.

**Current state:** All three absent. **NOT MET.**

**Why required:** AR-01..AR-05 all PARTIAL due to these gaps. Cold reconstruction without provenance capture is impossible.

---

### RRT-04: Semantic Influence Attribution In Advisory

**What:** Every advisory record must carry `enrichment_input_values` (observed values for each input in enrichment_inputs_used) and `originating_artifact` (source file for each input) as intrinsic fields — not derived by the provenance capture script.

**Current state:** Values present in provenance record; absent from advisory record. **NOT MET.**

**Why required:** Influence attribution must survive the removal of the provenance capture layer. The advisory artifact must stand alone.

---

### RRT-05: Hidden Influence Audit Passed

**What:** A formal code audit of `evaluate_enrichment_participation.py` confirming that every enrichment input that influences any advisory emission is explicitly listed in `enrichment_inputs_used` for that advisory. No hidden influence paths exist.

**Current state:** NOT PERFORMED. **NOT MET.**

**Why required:** RF-04 is CRITICAL and LOW-detectability. Replayability guarantees are void if hidden influence exists.

---

### RRT-06: Replay Audit Completeness

**What:** A `semantic_audit.json` artifact must be implemented (as proposed in SEMANTIC_TRACEABILITY_OBSERVABILITY.md Section 9) covering all advisory events, mode transitions, degradation events, and governance gate states for a session. This artifact must be produced alongside participation_advisory.json for every reference run.

**Current state:** NOT IMPLEMENTED. **NOT MET.**

**Why required:** ATP-06 (semantic audit completeness) from preconditions review. Without a unified audit record, the provenance stack is a collection of individual artifacts without a session-level summary.

---

### Replayability Threshold Status

| Threshold | Status |
|-----------|--------|
| RRT-01: Deterministic advisory replay (N=3) | NOT MET |
| RRT-02: Deterministic degradation replay | PARTIALLY MET |
| RRT-03: Self-describing advisory artifacts | NOT MET |
| RRT-04: Semantic influence attribution in advisory | NOT MET |
| RRT-05: Hidden influence audit | NOT MET |
| RRT-06: Replay audit completeness | NOT MET |

**1 of 6 thresholds partially met. 5 not met.**

---

## 8. Current Governance Verdict

The replayability maturity verdict is derived from the evidence in the authoritative inputs.

---

### Verdict Criteria Evaluation

**VR-01: Is replay_supported = PARTIAL or better?**
Evidence: `replay_supported: "PARTIAL"` in semantic_provenance.json
Result: YES — PARTIAL achieved

**VR-02: Are all current degradation events deterministically replayable?**
Evidence: DEG-001..DEG-004 all `degradation_replayable: true`; HARD_DOWNGRADE not yet empirically tested
Result: PARTIALLY — known events are deterministic; HARD_DOWNGRADE unvalidated

**VR-03: Is the advisory evaluator deterministic by design?**
Evidence: stdlib only, no randomness, exact comparisons; one reference run
Result: YES by design; N=1 means empirical validation not yet possible

**VR-04: Are all advisory records self-describing (cold reconstruction possible)?**
Evidence: AL-02, AL-03, AL-08 absent from all advisory records; observability_state=PARTIAL for both
Result: NO — cold reconstruction from advisory artifact alone fails

**VR-05: Is hidden influence risk validated?**
Evidence: No code audit performed; RF-04 governance severity=CRITICAL
Result: NO — unvalidated

**VR-06: Are all six replayability thresholds (RRT-01..06) met?**
Evidence: 1 of 6 partially met; 5 not met
Result: NO

**VR-07: Is there an N=3 advisory stability record?**
Evidence: N=1 reference run
Result: NO

**VR-08: Is there a session-level semantic_audit.json?**
Evidence: Not implemented
Result: NO

---

### Verdict: PARTIALLY_REPLAYABLE

The current replayability maturity is **PARTIALLY_REPLAYABLE**.

**Justification:**

The system achieves PARTIALLY_REPLAYABLE because:
- The advisory evaluator is deterministic by design
- All present degradation events carry `degradation_replayable: true`
- The provenance capture adds sufficient attribution to support assisted reconstruction (with provenance record)
- Field paths in advisory records allow human reconstruction of causality

The system does NOT achieve REPLAY_OBSERVABLE (the next level) because:
- Advisory artifacts are not self-describing (AL-02, AL-03, AL-08 absent)
- N=1 advisory stability — empirical determinism not validated
- Hidden influence risk (RF-04) unvalidated — this is the most critical blocker
- HARD_DOWNGRADE not empirically tested

The system does NOT achieve REPLAY_GOVERNANCE_READY because:
- 5 of 6 replayability thresholds are not met
- Three accountability boundaries (BP-01, selector, activation authorization) remain undefined
- The audit artifact (semantic_audit.json) does not exist

**Progress since governance review:** The previous governance review (ENRICHED_PSIG_DERIVATION_PRECONDITIONS.REVIEW.01) produced a verdict of NOT_ELIGIBLE. This review produces PARTIALLY_REPLAYABLE. This represents genuine progress: the instrumentation stack is operational, all four degradation events are traceable, and provenance capture adds attribution. The system has moved from NOT_ELIGIBLE to PARTIALLY_REPLAYABLE. The remaining gap to REPLAY_GOVERNANCE_READY is well-defined and closeable.

---

## 9. Safe Next Step

**Recommended contract:** PI.PSEE-PIOS.REPLAY-DETERMINISM-GAP-ANALYSIS.01

**What this analysis does:**

1. **Gap closure priority order** — define which of the 10 replay gaps should be closed first:
   - Priority 1 (format gaps, closeable immediately): AL-02, AL-03, AL-08 in advisory evaluator; PT-02 source_map in enrichment stubs
   - Priority 2 (hidden influence audit): line-by-line review of evaluate_enrichment_participation.py confirming enrichment_inputs_used completeness
   - Priority 3 (empirical validation): define N=3 advisory stability test plan; define HARD_DOWNGRADE test plan

2. **Hidden influence audit specification** — define exactly what constitutes a valid audit of the advisory evaluator: which lines of code must be reviewed, what the audit pass criterion is, and what artifact records the audit result

3. **Advisory format extension specification** — define the exact schema changes needed to participation_advisory.json to close AL-02, AL-03, and AL-08 — this becomes the input to a subsequent advisory evaluator update stream

4. **Session audit artifact design** — define the schema for semantic_audit.json (RRT-06), producing a design document that a subsequent implementation stream can execute

5. **Three accountability boundary definitions** — define the specific governance artifacts and processes for BP-01 authorization, selector authorization, and activation authorization

**What this analysis does NOT do:**
- Does not implement any of the above
- Does not grant semantic authority
- Does not advance participation mode
- Does not implement enriched derivation
- Does not close any gaps in this stream

**Why this is the safest next step:** It front-loads analysis before implementation. Closing format gaps (AL-02/03/08) requires modifying evaluate_enrichment_participation.py — a non-trivial change that should be preceded by a gap analysis design document, not implemented directly. The hidden influence audit in particular requires human review before any implementation proceeds. An analysis stream produces a governance-quality design document that implementation streams can follow precisely.

---

## 10. Validation

PASS criteria:

- [x] Replayability question defined with four sub-questions (observability / replayability / accountability / authority)
- [x] Four-level separation stated (OBSERVABILITY achieved; REPLAYABILITY PARTIAL; ACCOUNTABILITY PARTIAL; AUTHORITY BLOCKED)
- [x] All six advisory reconstruction dimensions reviewed (AR-01..AR-06, all PARTIAL)
- [x] All five degradation replay targets reviewed (DR-01..DR-05)
- [x] All five provenance chain sufficiency dimensions reviewed (PS-01..PS-05)
- [x] Three unresolved accountability boundaries identified (BP-01, selector, activation)
- [x] All six replayability failure modes reviewed (RF-01..RF-06, RF-04 CRITICAL)
- [x] Six minimum replayability thresholds defined (RRT-01..RRT-06)
- [x] "meeting replayability thresholds ≠ semantic authority authorization" explicitly stated
- [x] 1 of 6 thresholds partially met; 5 not met
- [x] Governance verdict = PARTIALLY_REPLAYABLE, justified from 8 verdict criteria
- [x] Progress since prior review acknowledged (NOT_ELIGIBLE → PARTIALLY_REPLAYABLE)
- [x] Gap between PARTIALLY_REPLAYABLE → REPLAY_OBSERVABLE → REPLAY_GOVERNANCE_READY defined
- [x] Safe next step = replay determinism gap analysis (not implementation)
- [x] No implementation performed
- [x] No runtime mutation
- [x] No threshold modification
- [x] Semantic authority remains blocked throughout

FAIL conditions check:

- Replayability conflated with authority? NO — Section 2 RQ-04 explicitly states observability/replayability/accountability ≠ authority
- Replayability treated as derivation authorization? NO — verdict is PARTIALLY_REPLAYABLE with 5 thresholds not met
- Provenance gaps ignored? NO — 10 replay gaps enumerated; 3 irreducible derivation gaps distinguished from 4 closeable format gaps
- Semantic authority implicitly escalated? NO — verdict does not advance participation mode; no authorization issued
- Runtime behavior modified? NO — review only; no implementation

Status: PASS
