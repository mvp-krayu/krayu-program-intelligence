# Existing Slice Audit and Classification

**Stream:** PI.SOFTWARE-INTELLIGENCE.EXISTING-SLICE-AUDIT-AND-CLASSIFICATION.01
**Classification:** G2 — Architecture-Consuming
**Baseline:** a886d83 (SW-INTEL slice taxonomy and governance merged to main)
**Governing Doctrine:** PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01 §5–§13

---

## §1 — Purpose

This document audits every existing runtime construct that exhibits slice-like behavior against the canonical slice taxonomy established in PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01. Each construct is classified by maturity level per the promotion lifecycle (§13), mapped to ontology class (§7), and assessed against evidence contract (§9) and replay contract (§10).

The audit answers: **What exists, what qualifies, what is its maturity, and what gaps prevent advancement?**

---

## §2 — Audit Scope

Five areas of the runtime were audited:

| Area | Module | Lines |
|---|---|---|
| A | COGNITION_SLICE_VOCABULARY in ConsequenceCompiler.js | 476–548 |
| B | Topology overlay conditions in SignalSynthesisEngine.js | 244–500 |
| C | Projection surfaces in SoftwareIntelligenceProjectionAdapter.js | 18–170 |
| D | Consequence types in ConsequenceCompiler.js | 15–82, 134–245 |
| E | BALANCED composition in ZoneComposer.js | 34–75 |

---

## §3 — Audit Results

### §3.1 — Area A: COGNITION_SLICE_VOCABULARY (forBoardroom)

**Location:** ConsequenceCompiler.js lines 476–548
**What it is:** 7-entry vocabulary (5 dynamic, 2 suppressed) used to construct `cognition_slices` array in `forBoardroom()` return.

**Construct inventory:**

| Vocabulary Entry | Dynamic | Executive Name | Ontology Class |
|---|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | YES | Pressure Convergence | B — Concentration & Saturation |
| DEPENDENCY_CHOKE_POINT | YES | Dependency Choke Point | B — Concentration & Saturation |
| PROPAGATION_ASYMMETRY | YES | Propagation Asymmetry | A — Flow & Propagation |
| STRUCTURAL_MASS_CONCENTRATION | YES | Structural Gravity | B — Concentration & Saturation |
| CROSS_DOMAIN_COUPLING_PRESSURE | YES | Cross-Domain Coupling | D — Reinforcement & Accumulation |
| COMPOUND_CONVERGENCE | NO | (suppressed) | D — Reinforcement & Accumulation |
| GOVERNANCE_COVERAGE_STATUS | NO | (suppressed) | — (non-slice: governance state) |

**Maturity classification: CANDIDATE**

Evidence contract (§9) assessment:

| Requirement | Status |
|---|---|
| evidence_refs (addressable) | ABSENT — no evidence_refs field in slice objects |
| derivation_trace | ABSENT — no derivation path from slice object to source condition/signal |
| structural_proof_anchor | ABSENT — domain display name only, no structural anchor |
| confidence_classification | PRESENT — governance_boundary from condition |
| temporal_marker | ABSENT |

Replay contract (§10) assessment:

| Requirement | Status |
|---|---|
| Identical input → identical output | PARTIAL — deterministic vocabulary lookup, but no replay envelope |
| Provenance chain | ABSENT — slice carries condition_type but not condition_id or signal lineage |
| Schema validation | ABSENT |
| Persistence | ABSENT — in-memory projection artifact only |

**Key finding:** Slices are constructed at projection time from `synthesisResult.conditions` (line 531) using vocabulary lookup. The slice object carries `executive_name`, `condition_type`, `domain`, `operational_meaning`, `severity`, `confidence`, `confidence_label` — but zero traceability to the underlying evidence chain. If the same slice object were reconstructed from the same input data, it would produce the same output (vocabulary is deterministic), but there is no replay envelope to prove this.

### §3.2 — Area B: Topology Overlay Conditions (SignalSynthesisEngine)

**Location:** SignalSynthesisEngine.js lines 244–500 (rule engines)
**What it is:** 7 condition types produced by rule engines from tagged signals + pressure zones. These are the SUBSTRATE from which both cognition slices and consequences are derived.

**Construct inventory:**

| Condition Type | Rule Engine | Ontology Class | Has derivation_trace | Has topology_overlay |
|---|---|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | ruleDeliveryPressureConcentration | B | YES | YES |
| DEPENDENCY_CHOKE_POINT | ruleDependencyChokePoint | B | YES | YES |
| PROPAGATION_ASYMMETRY | rulePropagationAsymmetry | A | YES | YES |
| STRUCTURAL_MASS_CONCENTRATION | ruleStructuralMassConcentration | B | YES | YES |
| CROSS_DOMAIN_COUPLING_PRESSURE | ruleCrossDomainCouplingPressure | D | YES | YES |
| GOVERNANCE_COVERAGE_STATUS | ruleGovernanceCoverage | — | YES | YES |
| COMPOUND_CONVERGENCE | ruleCompoundConvergence | D | YES | YES |

**Maturity classification: SPECIMEN**

Evidence contract (§9) assessment:

| Requirement | Status |
|---|---|
| evidence_refs (addressable) | PARTIAL — `supporting_signal_ids` present, `pressure_zone_ids` present, but refs are string IDs not addressable URIs |
| derivation_trace | PRESENT — `derivation_trace` field carries full signal → condition path (e.g., "ISIG-001 + PSIG-001 → COMPOUND_ZONE PZ-01 → DELIVERY_PRESSURE_CONCENTRATION") |
| structural_proof_anchor | PRESENT — `shared_topology_targets` with domains, clusters, files |
| confidence_classification | PRESENT — `governance_boundary` (GOVERNED / ADVISORY_BOUND / STRUCTURAL_ONLY) |
| temporal_marker | ABSENT |

Replay contract (§10) assessment:

| Requirement | Status |
|---|---|
| Identical input → identical output | YES — deterministic rule engines |
| Provenance chain | PARTIAL — derivation_trace is a human-readable string, not a machine-parseable chain |
| Schema validation | ABSENT |
| Persistence | ABSENT — in-memory objects only |

**Key finding:** Conditions are the most mature slice-adjacent construct in the runtime. They have genuine derivation traces and structural anchoring. Two gaps prevent FOUNDATIONAL: (1) derivation_trace is a concatenated string, not a structured provenance chain, (2) no schema validation or persistence contract.

### §3.3 — Area C: Projection Surfaces (SoftwareIntelligenceProjectionAdapter)

**Location:** SoftwareIntelligenceProjectionAdapter.js lines 18–170
**What it is:** 6 cognitive surfaces synthesized from PI Core data. Each surface compresses multiple signals into a single operational assessment.

**Construct inventory:**

| Surface ID | Surface Name | Source Conditions | Ontology Class |
|---|---|---|---|
| DELIVERY_FRAGILITY | Delivery Fragility | DPC, COMPOUND_CONVERGENCE | B |
| COORDINATION_SATURATION | Coordination Saturation | DCkP, CDCP | D |
| INTEGRATION_EXPOSURE | Integration Exposure | CDCP | D |
| OPERATIONAL_TOPOLOGY | Operational Topology | SMC | B |
| QUALIFICATION_EXPOSURE | Qualification Exposure | GOV_GAP, GOV_COMPLETE | — |
| PROPAGATION_RISK | Propagation Risk | PA | A |

**Maturity classification: CANDIDATE**

Evidence contract (§9) assessment:

| Requirement | Status |
|---|---|
| evidence_refs (addressable) | ABSENT — `trace_sources` is a string array (e.g., `['signal_interpretations', 'evidence_blocks', 'propagation_summary']`) naming report sections, not addressable evidence |
| derivation_trace | ABSENT — no field, derivation is implicit in function logic |
| structural_proof_anchor | PARTIAL — `affected_domains` present, but no structural file/cluster anchoring |
| confidence_classification | ABSENT — severity only, no governance boundary |
| temporal_marker | ABSENT |

Replay contract (§10) assessment:

| Requirement | Status |
|---|---|
| Identical input → identical output | YES — deterministic function |
| Provenance chain | ABSENT — `trace_sources` names data sources, not evidence chain |
| Schema validation | ABSENT |
| Persistence | ABSENT |

**Key finding:** Surfaces are compression artifacts. They synthesize multiple signals into operational assessments but carry no evidence traceability. `trace_sources` lists the report sections consulted (declarative), not the actual evidence chain (provable). These are NOT slices per §5 qualification criteria — they fail criteria 2 (evidence contract), 3 (replay), and 5 (provenance chain). They are CONSUMERS of slice data, not slices themselves.

**Classification correction:** Per §6 (Non-Slice Definition), projection surfaces are **non-slices** — they are "projection/rendering artifacts that consume slice data for display." However, they are CANDIDATE non-slices because they could potentially be refactored to carry evidence lineage. For now, they remain outside slice governance.

### §3.4 — Area D: Consequence Types (ConsequenceCompiler)

**Location:** ConsequenceCompiler.js lines 15–82 (vocabulary), 134–245 (mapping rules)
**What it is:** 11 consequence types (8 primitive + 3 combination) produced by the consequence compiler from conditions. Each consequence carries `derivation_trace`, `source_conditions`, `evidence_summary`, `confidence`, and `consequence_scope`.

**Construct inventory:**

| Type ID | Label | Category | Ontology Class |
|---|---|---|---|
| COORD_FRAG | Coordination Fragility | Primitive | B |
| DEP_AMP | Dependency Amplification | Primitive | B |
| DEL_EXP | Delivery Exposure | Primitive | B |
| OP_BOTTLENECK | Operational Bottleneck | Primitive | B |
| RESIL_DEF | Resilience Deficit | Primitive | B |
| GOV_GAP | Governance Coverage Gap | Primitive | — |
| PROP_EXP | Propagation Exposure | Primitive | A |
| STAB_RISK | Structural Stability Risk | Primitive | E |
| AMPLIFIED_DEP_FRAG | Amplified Dependency Fragility | Combination | D |
| STRUCT_GRAVITY_WELL | Structural Gravity Well | Combination | D |
| SYSTEMIC_OP_FRAG | Systemic Operational Fragility | Combination | D |

**Maturity classification: SPECIMEN**

Evidence contract (§9) assessment:

| Requirement | Status |
|---|---|
| evidence_refs (addressable) | PARTIAL — `source_conditions` carries condition_ids (addressable within session), not signal_ids or structural refs |
| derivation_trace | PRESENT — `derivation_trace` field (e.g., "dpc-pz-01 → COORD_FRAG (§4)") |
| structural_proof_anchor | PRESENT — `primary_locus` with domains, clusters, files |
| confidence_classification | PRESENT — `confidence` from governance_boundary |
| temporal_marker | ABSENT |

Replay contract (§10) assessment:

| Requirement | Status |
|---|---|
| Identical input → identical output | YES — deterministic mapping rules (§4) |
| Provenance chain | PARTIAL — `derivation_trace` is human-readable string; `source_conditions` carries IDs but not full chain to signals |
| Schema validation | ABSENT |
| Persistence | ABSENT |

**Key finding:** Consequences are the CLOSEST existing construct to a governed slice. They have derivation traces, confidence classification, structural anchoring, and deterministic production rules. Two gaps: (1) `evidence_summary` is a human-readable string (e.g., "DELIVERY_PRESSURE_CONCENTRATION (HIGH, GOVERNED)"), not structured evidence, (2) the chain stops at condition_id — the signal → feature → condition portion of the provenance is not carried through.

**Classification note:** Consequence types are NOT slices per the taxonomy — they are the PRODUCT of the consequence compilation layer. However, they exhibit the most mature evidence discipline of any runtime construct. If slice governance were to be applied retroactively, consequence types would be the first candidates for FOUNDATIONAL promotion.

### §3.5 — Area E: BALANCED ZoneComposer

**Location:** ZoneComposer.js lines 34–75
**What it is:** Composition engine that sequences pre-derived cognition (from `forBalanced()`) into 5 zones for BALANCED persona rendering.

**Maturity classification: NOT A SLICE (composition consumer)**

The ZoneComposer does not produce, derive, or store slice data. It sequences already-compiled cognition into rendering zones. Per §6 (Non-Slice Definition), this is a "display composition engine" — it consumes projection data, it does not produce cognition.

Evidence assessment:

| Aspect | Status |
|---|---|
| cognition_source | `ConsequenceCompiler.forBalanced()` — single canonical source |
| evidence_chain | ZoneComposer's `evidenceChain` arrays trace to `forBalanced()` fields, NOT to underlying signal/condition IDs |
| vocabulary validation | Present — `validateComposition()` checks all text against OperationalVocabulary |
| Derivation | NONE — ZoneComposer does not derive |

**Key finding:** ZoneComposer is correctly positioned as a composition consumer. It correctly consumes from a single canonical source (forBalanced) and does not re-derive. Its evidence chain traces to the forBalanced projection, not to the substrate. This is architecturally correct per §14 (Anti-Parallel-Path Doctrine) — composition layers should not carry substrate-level evidence.

---

## §4 — Maturity Summary

| Construct | Module | Slice Status | Maturity | Ontology Class | Evidence Gap | Replay Gap |
|---|---|---|---|---|---|---|
| COGNITION_SLICE_VOCABULARY | ConsequenceCompiler.js | SLICE | CANDIDATE | A, B, D | No evidence_refs, no derivation_trace | No replay envelope, no provenance |
| Topology conditions | SignalSynthesisEngine.js | SLICE-SUBSTRATE | SPECIMEN | A, B, D | Informal derivation_trace (string) | No schema, no persistence |
| Projection surfaces | ProjectionAdapter.js | NON-SLICE | — | — | No evidence chain | Not applicable |
| Consequence types | ConsequenceCompiler.js | SLICE-ADJACENT | SPECIMEN | A, B, D, E | evidence_summary is prose | Chain stops at condition_id |
| ZoneComposer zones | ZoneComposer.js | NON-SLICE | — | — | Composition consumer | Not applicable |

---

## §5 — Ontology Coverage

The existing runtime exercises 4 of 5 ontology classes:

| Ontology Class | Coverage | Existing Specimens |
|---|---|---|
| A — Flow & Propagation | COVERED | PROPAGATION_ASYMMETRY condition, PROP_EXP consequence |
| B — Concentration & Saturation | COVERED (dominant) | DPC, DCkP, SMC conditions; COORD_FRAG, DEP_AMP, DEL_EXP, OP_BOTTLENECK, RESIL_DEF consequences |
| C — Fragility & Resilience | NOT COVERED | No existing construct maps to Class C as primary |
| D — Reinforcement & Accumulation | COVERED | CDCP, COMPOUND_CONVERGENCE conditions; all 3 combination patterns |
| E — Drift & Instability | COVERED (minimal) | STAB_RISK consequence only |

**Gap: Class C (Fragility & Resilience)** — No condition type, consequence type, or cognition slice currently maps to Class C as its primary ontology class. This does not mean fragility is absent from the runtime — several constructs have fragility as a SECONDARY characteristic (e.g., COORD_FRAG has fragility implications but is primarily Concentration). The gap is in primary classification, not in operational coverage.

---

## §6 — Evidence Contract Gap Analysis

### §6.1 — What the evidence contract requires (§9)

1. `evidence_refs` — addressable references to source evidence
2. `derivation_trace` — structured provenance from signal to slice
3. `structural_proof_anchor` — topology-grounded structural reference
4. `confidence_classification` — GOVERNED / ADVISORY_BOUND / STRUCTURAL_ONLY
5. `temporal_marker` — when the evidence was collected

### §6.2 — Gap matrix

| Requirement | Conditions (B) | Consequences (D) | Cognition Slices (A) |
|---|---|---|---|
| evidence_refs | PARTIAL (signal_ids, not URIs) | PARTIAL (condition_ids only) | ABSENT |
| derivation_trace | PRESENT (string) | PRESENT (string) | ABSENT |
| structural_proof_anchor | PRESENT | PRESENT | ABSENT |
| confidence_classification | PRESENT | PRESENT | PRESENT |
| temporal_marker | ABSENT | ABSENT | ABSENT |

### §6.3 — Remediation path to FOUNDATIONAL

For any construct to advance from SPECIMEN to FOUNDATIONAL, it must satisfy ALL 5 evidence requirements. The minimum remediation:

1. **Make derivation_trace structured.** Replace string concatenation with an array of `{ source_id, source_type, rule_ref }` objects.
2. **Carry signal_ids through consequences.** Currently the chain is signal → condition → consequence, but consequences only carry `source_conditions`. They need `source_signals` too.
3. **Add temporal_marker.** Timestamp of evidence collection (analysis run timestamp).
4. **Make evidence_refs addressable.** Currently string IDs. Need to be resolvable within the evidence store.

---

## §7 — Replay Contract Gap Analysis

### §7.1 — What the replay contract requires (§10)

1. Identical input → identical output (determinism)
2. Provenance chain (machine-parseable, not human-readable)
3. Schema validation (shape enforcement)
4. Persistence (evidence store, not memory-only)

### §7.2 — Gap matrix

| Requirement | Conditions (B) | Consequences (D) | Cognition Slices (A) |
|---|---|---|---|
| Determinism | YES | YES | YES |
| Provenance chain | PARTIAL (string) | PARTIAL (string) | ABSENT |
| Schema validation | ABSENT | ABSENT | ABSENT |
| Persistence | ABSENT | ABSENT | ABSENT |

### §7.3 — Remediation path

1. **Structured provenance.** Same as evidence contract §6.3.1.
2. **Schema validation.** Define JSON schemas for condition, consequence, and slice objects. Validate at production time.
3. **Persistence.** This is the largest gap. Currently all cognition objects exist only in-memory during a LENS session. Persistence requires an evidence store contract — out of scope for this audit, identified as prerequisite for FOUNDATIONAL promotion.

---

## §8 — Which Constructs May Advance to COMPOSABLE?

Per the promotion lifecycle (§13): CANDIDATE → SPECIMEN → FOUNDATIONAL → COMPOSABLE.

**No construct currently qualifies for COMPOSABLE.** COMPOSABLE requires FOUNDATIONAL (all evidence + replay requirements satisfied), plus demonstrated composition with other slices.

**What could advance to FOUNDATIONAL with targeted remediation:**

| Construct | Current | Advancement Feasibility | Required Work |
|---|---|---|---|
| Topology conditions | SPECIMEN | HIGH | Structured derivation_trace, temporal_marker |
| Consequence types | SPECIMEN | HIGH | Source signal chain, structured evidence_summary |
| Cognition slices | CANDIDATE | MEDIUM | Evidence_refs, derivation_trace, provenance — essentially rebuild the object contract |

**Priority recommendation:** Advance topology conditions first. They already have the richest evidence discipline. Consequences can advance in parallel because they consume conditions — structured conditions automatically improve consequence provenance.

---

## §9 — Architectural Observations

### §9.1 — The evidence chain breaks at the projection boundary

The runtime has a clear evidence gradient:

```
Signals (L1) → Conditions (L2) → Consequences (L2) → Projections (L3) → Rendering (L4)
     RICH           MEDIUM           MEDIUM              POOR             NONE
```

Evidence quality degrades as data flows toward the user. Conditions carry derivation traces and signal refs. Consequences carry condition refs but lose signal refs. Cognition slices carry condition_type but lose condition_id. Projection surfaces carry trace_sources (section names) and lose everything else.

This is not a bug — it reflects the legitimate concern that projection layers should not carry substrate-level evidence (§14). But it means that any future audit/replay must reconstruct the chain from L2 objects, not from L3/L4 projections.

### §9.2 — Determinism is preserved throughout

Every construct in the audit is deterministically produced. Same signals + same pressure zones + same structural enrichment → same conditions → same consequences → same slices. This is a prerequisite for replay and it is already satisfied.

### §9.3 — GOVERNANCE_COVERAGE_STATUS is not a slice

GOVERNANCE_COVERAGE_STATUS describes a governance state (complete/incomplete domain anchoring). Per §5 qualification criteria, it fails criteria 7 (must describe a behavioral operational pattern, not an inventory state). It is correctly classified as a non-slice condition that carries governance information.

---

## §10 — Recommendations

### §10.1 — Immediate (no implementation stream required)

None. This is a G2 assessment-only stream.

### §10.2 — Next stream candidates

1. **PI.SOFTWARE-INTELLIGENCE.EVIDENCE-CHAIN-STRUCTURING.01** — Replace string derivation_trace with structured provenance arrays across conditions and consequences. Targeted, high-impact, prerequisite for FOUNDATIONAL.

2. **PI.SOFTWARE-INTELLIGENCE.SLICE-SCHEMA-VALIDATION.01** — Define and enforce JSON schemas for condition, consequence, and cognition slice objects. Prerequisite for replay contract satisfaction.

3. **PI.SOFTWARE-INTELLIGENCE.COGNITION-SLICE-EVIDENCE-ENRICHMENT.01** — Enrich COGNITION_SLICE_VOCABULARY objects with evidence_refs and derivation_trace, advancing them from CANDIDATE to SPECIMEN.

### §10.3 — Priority order

Evidence chain structuring (§10.2.1) should come first. It is the single remediation that unblocks FOUNDATIONAL advancement for both conditions AND consequences simultaneously.

---

## §11 — Boundary Verification

| Boundary | Status |
|---|---|
| No runtime code modified | PASS |
| No new code created | PASS |
| No terminology changed | PASS |
| No vault mutation | PASS |
| Classification aligned with taxonomy (§7) | PASS |
| Maturity classification aligned with lifecycle (§13) | PASS |
| Evidence assessment aligned with §9 | PASS |
| Replay assessment aligned with §10 | PASS |
| Anti-parallel-path preserved (§14) | PASS |
