# Ontology-to-Consequence Compilation Model

**Stream:** PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-TO-CONSEQUENCE-COMPILATION-MODEL.01
**Classification:** G1 — Architecture-Mutating / Cognition-Compilation-Governance
**Baseline:** d924570 (ontology consumption model merged to main)

**Governing inputs:**
- PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01 — ontology classes, maturity lifecycle
- PI.SOFTWARE-INTELLIGENCE.EXISTING-SLICE-AUDIT-AND-CLASSIFICATION.01 — maturity classifications, evidence gaps
- PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01 — persona constitutional objectives
- PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-CONSUMPTION-MODEL.01 — consumption postures, compiler bridge doctrine

---

## §1 — Executive Summary

This stream locks the ontology-to-consequence compilation model.

Four baselines are locked:
1. Slice taxonomy — what ontology classes exist
2. Slice audit — what maturity they have
3. Persona mission contracts — what each persona exists for
4. Ontology consumption model — what each persona receives from each class

One constitutional layer remains underdefined: how ontology becomes consequence.

The ConsequenceCompiler is the primary transformation engine. It consumes conditions, applies deterministic mapping rules, produces consequence objects, detects combination patterns, and generates persona-specific projections. But this transformation chain has not been constitutionally locked. The compilation model is implicit in code.

This stream makes it explicit.

**This stream does NOT:**
- Implement anything
- Revalidate INVESTIGATION
- Add slices or ontology classes
- Modify compiler logic
- Modify persona behavior

---

## §2 — Problem Statement

The ontology consumption model (§10) established that:
- BOARDROOM and BALANCED consume ontology through the compiler
- DENSE and INVESTIGATION consume substrate directly

But the transformation from ontology class to consequence object has not been constitutionally locked.

The compiler currently operates as a governed transformation engine with deterministic rules. But these rules are embedded in code (`ConsequenceCompiler.js`, `SignalSynthesisEngine.js`) without a corresponding governance artifact that defines:

- What the compiler consumes
- What it transforms
- What it preserves
- What it compresses
- What it generates
- What it merely projects
- Where ontology classification enters
- Where consequence objects become persona-specific projections

Without this, INVESTIGATION revalidation would verify against an implicit compiler model. That is unsafe.

---

## §3 — Compilation Chain

The canonical transformation chain:

```
L1  Signals (ISIG, DPSIG, PSIG families)
     ↓ feature extraction + rule engines
L2  Conditions (7 primitive types + 1 composite)
     ↓ ontology classification (implicit — condition_type ↔ class)
L2  Ontology Classification (Classes A-E)
     ↓ deterministic mapping (§4 rules)
L2  Consequence Types (8 primitive + 3 combination)
     ↓ combination detection (§5 rules) + severity escalation (§6)
L2  Combination / Reinforcement Patterns
     ↓ persona projection functions
L3  Persona Projection Compiler Outputs (forBoardroom, forBalanced, forInvestigation)
     ↓ rendering components
L4  Persona Rendering
```

### Stage Ownership

| Stage | Layer | Owns | Role |
|---|---|---|---|
| Signals | L1 | Raw structural measurements | Evidence generation |
| Feature extraction | L1→L2 | Signal-to-feature tagging | Evidence classification |
| Conditions | L2 | Structural truth assertions | Truth generation |
| Ontology classification | L2 | Class assignment | Truth classification |
| Consequence types | L2 | Operational consequence objects | Truth expression |
| Combination patterns | L2 | Reinforcement/convergence detection | Truth composition |
| Persona projections | L3 | Persona-appropriate framing | Governed projection |
| Rendering | L4 | Visual presentation | Display only |

**Hard rule:** Truth generation stops at L2. L3 may project, sequence, compress, group, frame — but must not create new truth. L4 may render only.

---

## §4 — Layer Ownership

### Alignment with Reference Boundary Contract

The reference boundary contract (`docs/governance/runtime/reference_boundary_contract.md`) defines:

| Boundary Contract Layer | Compilation Chain Mapping |
|---|---|
| L0 — External / Raw Input | Repository artifacts, code graph, telemetry |
| L1 — Ingestion / Normalization | Signal computation (ISIG, DPSIG, PSIG families), feature extraction |
| L2 — PiOS Core / Deterministic Derivation | Conditions, consequences, combination patterns — all truth generation |
| L3 — Semantic / Narrative / Delivery | `forBoardroom()`, `forBalanced()`, `forInvestigation()` — governed projection |
| L4 — Category / Web / External | Persona rendering in LENS |

The boundary contract's ownership table (§3.4):
- L2 owns **Truth derivation** — conditions and consequences are truth
- L3 owns **Meaning** — persona projections give meaning to truth

This alignment is exact. The compilation chain does not introduce a new layer model. It maps compilation stages to the existing boundary contract layers.

### Where Truth Generation Stops

The ConsequenceCompiler operates at the L2↔L3 boundary:
- `compile()` = L2 (truth: conditions → consequences → combinations)
- `forBoardroom()` / `forBalanced()` / `forInvestigation()` = L3 (projection: consequences → persona-specific output)

The compiler's `compile()` function produces truth objects. The `for*()` functions produce projections. The same module contains both, but the boundary is architecturally clear:

- `compile()` → `consequences[]` with `consequence_id`, `consequence_type_id`, `severity`, `confidence`, `source_conditions`, `derivation_trace` — these are **truth objects**
- `forBoardroom()` → `posture_label`, `cognition_slices`, `combined_synthesis` — these are **projections**

---

## §5 — Ontology Class to Condition Mapping

### §5.1 — Current Mapping

| Condition Type | Source Signals | Ontology Class | Maturity | Evidence Status |
|---|---|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | DPSIG, ISIG, PSIG (via pressure_zone_state) | B — Concentration | FOUNDATIONAL | Full: zone state, member entities, anchor, blind spots |
| DEPENDENCY_CHOKE_POINT | ISIG-001 (dependency_amplification feature) | A — Flow & Propagation | FOUNDATIONAL | Full: hub node, in-degree, topology edges |
| PROPAGATION_ASYMMETRY | ISIG-002 (propagation_asymmetry feature) | A — Flow & Propagation | FOUNDATIONAL | Full: fan-out corridors, topology edges |
| STRUCTURAL_MASS_CONCENTRATION | DPSIG (structural_mass_asymmetry feature) | B — Concentration | FOUNDATIONAL | Full: cluster composition, fan asymmetry |
| CROSS_DOMAIN_COUPLING_PRESSURE | PSIG-001, PSIG-002 (coupling_exposure feature) | B — Concentration | FOUNDATIONAL | Full: coupling corridors, hub domain |
| GOVERNANCE_COVERAGE_STATUS | PSIG-006 (domain_anchoring_gap/complete) | B — Concentration | FOUNDATIONAL | Full: coverage ratio, blind spots |
| COMPOUND_CONVERGENCE | (derived from primitives) | B — Concentration | FOUNDATIONAL | Composite: convergence domain, contributing conditions |

### §5.2 — Class Coverage Assessment

| Class | Conditions | Coverage |
|---|---|---|
| **A — Flow & Propagation** | DEPENDENCY_CHOKE_POINT, PROPAGATION_ASYMMETRY | 2 conditions — COMPLETE for current evidence |
| **B — Concentration & Saturation** | DELIVERY_PRESSURE_CONCENTRATION, STRUCTURAL_MASS_CONCENTRATION, CROSS_DOMAIN_COUPLING_PRESSURE, GOVERNANCE_COVERAGE_STATUS, COMPOUND_CONVERGENCE | 5 conditions — DOMINANT (most coverage) |
| **C — Fragility & Resilience** | (none — derived only as consequence byproduct) | 0 conditions — GAP |
| **D — Reinforcement & Accumulation** | (none — derived only as combination pattern) | 0 conditions — GAP |
| **E — Drift & Instability** | (partial — STAB_RISK consequence from STRUCTURAL_MASS_CONCENTRATION) | 0 direct conditions — PARTIAL via cross-class derivation |

### §5.3 — Gaps

1. **Class C has no condition.** Fragility exists only as COORD_FRAG consequence derived from Class B conditions. No independent fragility condition exists.

2. **Class D has no condition.** Reinforcement/accumulation emerges only through combination detection — it is an emergent property of multiple consequences co-locating, not a directly derived condition.

3. **Class E has no direct condition.** STAB_RISK consequence is derived from STRUCTURAL_MASS_CONCENTRATION (Class B) when cluster fan asymmetry exceeds 50% and severity ≥ ELEVATED. This is a cross-class derivation, not a Class E condition.

---

## §6 — Condition to Consequence Mapping

### §6.1 — Mapping Rules

The compiler maps conditions to consequences via deterministic rules in `mapCondition()`. Each condition type maps to one or more primitive consequence types:

| Condition Type | Primary Consequence | Secondary Consequences | Activation Gate |
|---|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | COORD_FRAG (defining) | DEL_EXP (defining), OP_BOTTLENECK (≥3 supporting signals) | §4 |
| DEPENDENCY_CHOKE_POINT | DEP_AMP (defining) | COORD_FRAG (severity ≥ HIGH), OP_BOTTLENECK (severity ≥ HIGH + hub in-degree > 20) | §4 |
| PROPAGATION_ASYMMETRY | PROP_EXP (defining) | DEL_EXP (severity ≥ HIGH) | §4 |
| STRUCTURAL_MASS_CONCENTRATION | RESIL_DEF (defining) | STAB_RISK (severity ≥ ELEVATED + fan asymmetry > 50%) | §4 |
| CROSS_DOMAIN_COUPLING_PRESSURE | COORD_FRAG (defining) | PROP_EXP (severity ≥ HIGH) | §4 |
| GOVERNANCE_COVERAGE_STATUS | GOV_GAP (defining, severity ≠ NOMINAL) | — | §4 |
| COMPOUND_CONVERGENCE | STAB_RISK (defining) | — | §4 |

### §6.2 — Ontology Class of Each Consequence

| Consequence Type | Primary Ontology Class | Secondary Class | Rationale |
|---|---|---|---|
| COORD_FRAG | C — Fragility | B — Concentration (source) | Coordination brittleness IS fragility. But no Class C condition exists — derived from Class B conditions. |
| DEP_AMP | A — Flow | B — Concentration (source) | Dependency amplification IS propagation behavior. Source is concentration. |
| DEL_EXP | B — Concentration | A — Flow (secondary) | Delivery exposure IS a concentration consequence with propagation characteristics. |
| OP_BOTTLENECK | B — Concentration | — | Throughput constraint IS concentration. |
| RESIL_DEF | C — Fragility | B — Concentration (source) | Resilience deficit IS fragility/resilience. Derived from structural mass (Class B). |
| GOV_GAP | B — Concentration | — | Governance coverage IS a concentration/saturation measurement. |
| PROP_EXP | A — Flow | — | Propagation exposure IS flow behavior. |
| STAB_RISK | E — Drift | B — Concentration (source) | Stability risk IS drift/instability. Derived from concentration evidence. |

### §6.3 — Evidence Carried Through Mapping

Each atomic consequence carries from its source condition:

| Field | Carried? | Form |
|---|---|---|
| condition_id | YES | `source_conditions[]` array |
| condition_type | YES (internal) | `_src_type` (stripped before output) |
| severity | YES | Directly transferred, max across merged sources |
| governance_boundary | YES | `confidence` field, min-confidence across merged sources |
| structural locus | YES | `primary_locus` (domains, clusters, files) |
| locus display name | YES | `primary_locus_display` via domain resolution |
| derivation trace | PARTIAL | String: `condition_id → consequence_type (§4)` — not structured |
| supporting_signal_ids | NO | Lost — not carried into consequence |
| topology targets detail | PARTIAL | Domains carried, files carried, but zone membership lost |
| operational_consequence prose | NO | Replaced by CONSEQUENCE_VOCABULARY template |

### §6.4 — Evidence Lost Through Mapping

| Evidence | Status | Impact |
|---|---|---|
| **Signal IDs** | LOST | Consequence does not carry source signal identifiers. Cannot trace consequence → signal without re-traversing conditions. |
| **Signal values** | LOST | Numeric signal values (e.g., ISIG-001 = 0.4723) are not carried. |
| **Signal family** | LOST | ISIG/DPSIG/PSIG family classification is not carried. |
| **Feature tags** | LOST | Feature extraction results (pressure_concentration, dependency_amplification, etc.) are not carried. |
| **Zone membership** | LOST | Pressure zone member entities are not carried into consequence. |
| **Condition prose** | REPLACED | `operational_consequence` from CONDITION_VOCABULARY is replaced by `operational_implication` from CONSEQUENCE_VOCABULARY. |
| **Topology edge data** | LOST | Topology edges used for choke point and propagation detection are not carried. |

---

## §7 — Consequence Combination Model

### §7.1 — The Three Combination Patterns

The compiler detects three combination patterns when multiple consequences co-locate:

| Pattern | ID | Trigger | Contributing Consequences | Ontology Classes |
|---|---|---|---|---|
| Amplified Dependency Fragility | AMPLIFIED_DEP_FRAG | COORD_FRAG (from DPC) + DEP_AMP (from DCkP) at same locus | Coordination fragility + dependency amplification | C + A → combined |
| Structural Gravity Well | STRUCT_GRAVITY_WELL | DEL_EXP (from DPC) + RESIL_DEF (from SMC) at same locus | Delivery exposure + resilience deficit | B + C → combined |
| Systemic Operational Fragility | SYSTEMIC_OP_FRAG | ≥3 consequences from ≥3 primitive condition types at same locus | All co-located consequences | Multi-class → systemic |

### §7.2 — Truth Status of Combinations

**Combinations compile existing truth. They do not create new truth.**

Evidence:
- `makeCombination()` consumes `contributing` consequences (L2 truth objects)
- It produces a new consequence with `contributing_consequences[]` array and `decomposition` object
- Severity may escalate one level (§6.1) — this is a governed transformation, not truth creation
- The combination's `evidence_summary` references contributing primitive conditions
- The combination's `derivation_trace` reads: `contributing_types → pattern_id (+ escalation §6)`

The combination IS a Class D (Reinforcement & Accumulation) specimen. It detects self-strengthening dynamics by observing consequence co-location. But it does not introduce evidence that was not already present in the contributing primitives.

### §7.3 — Combination Detection Mechanics

`detectCombinations()` groups deduplicated atomics by locus key (`_lk`). For each locus with ≥2 consequences:

1. Check for AMPLIFIED_DEP_FRAG: COORD_FRAG from DPC + DEP_AMP from DCkP
2. Check for STRUCT_GRAVITY_WELL: DEL_EXP from DPC + RESIL_DEF from SMC
3. Check for SYSTEMIC_OP_FRAG: ≥3 consequences from ≥3 distinct primitive condition types

When a combination is detected, the contributing consequences are removed from top-level results (absorbed into the combination). The combination appears at the top level instead.

### §7.4 — Severity Escalation

Only SYSTEMIC_OP_FRAG triggers escalation. Escalation raises severity one level above the MAX of contributing severities:

```
NOMINAL → LOW → MODERATE → ELEVATED → HIGH → CRITICAL → CRITICAL (cap)
```

Escalation is a governed transformation with a deterministic rule and explicit `escalation_applied` + `escalation_reason` fields. It does not create new evidence — it amplifies severity to reflect convergence pressure.

---

## §8 — Persona Compiler Outputs

Per the ontology consumption model (§5.1-5.2, §10), BOARDROOM and BALANCED consume ontology exclusively through the compiler. This section defines the transformation semantics — what enters, what is compressed, what evidence is preserved, what is lost.

### §8.1 — `forBoardroom()`: Transformation Semantics

**Consumes:**
- `consequenceResult` (L2 truth: all compiled consequences)
- `synthesisResult` (L2 truth: all conditions)
- `fullReport` (L1: semantic_domain_registry for display resolution)

**Transformation operations:**

| Operation | Input | Output | Type |
|---|---|---|---|
| Posture derivation | `consequences[]` | `posture_label` string | COMPRESSION — multiple consequences → one label |
| Severity selection | `consequences[0].severity` | `posture_severity` | PROJECTION — direct pass-through |
| Scope derivation | All consequence scopes | `posture_scope` | COMPRESSION — multiple scopes → one (SYSTEMIC > REGIONAL > LOCAL) |
| Locus extraction | `consequences[0].primary_locus_display` | `primary_locus` | PROJECTION — direct pass-through |
| Cognition slice compilation | Conditions + COGNITION_SLICE_VOCABULARY | `cognition_slices[]` | TRANSFORMATION — condition → executive name + localized meaning |
| Synthesis sentence | Slices + posture + locus + confidence | `combined_synthesis` | GENERATION — compiled from vocabulary, not freeform |

**Evidence preserved:** severity, confidence, condition_type (via slices), locus, consequence count, systemic count
**Evidence lost:** condition_ids, source_conditions, derivation_trace, individual consequence objects, combination decomposition

### §8.2 — `forBalanced()`: Transformation Semantics

**Consumes:**
- `consequenceResult` (L2 truth: all compiled consequences)
- `synthesisResult` (L2 truth: all conditions for condition map lookup)
- `fullReport` (L1: registry)

**Transformation operations:**

| Operation | Input | Output | Type |
|---|---|---|---|
| Primary story extraction | `consequences[0]` | `primary_story` object | PROJECTION — highest-severity consequence with source conditions resolved |
| Reinforcement flow derivation | `consequences[1..n]` vs primary | `reinforcement_flow[]` | TRANSFORMATION — relative positioning via relationship verbs |
| Relationship verb derivation | Locus comparison, scope comparison, combination status | `relationship_verb` | GENERATION — deterministic rules (same locus + combination = amplifies, different locus = widens, etc.) |
| Relationship sentence | Verb + type + locus | `relationship_sentence` | GENERATION — compiled from templates, not freeform |
| Confidence sentence | Overall confidence + locus | `confidence_sentence` | GENERATION — compiled from templates |
| Synthesis sentence | All consequences + posture + locus | `combined_synthesis` | GENERATION — compiled from templates |

**Evidence preserved:** consequence_type_id, severity, confidence, source_conditions (resolved to display_title), is_combination, combination_explanation, locus, scope
**Evidence lost:** condition_ids (only display_title preserved), derivation_trace, individual condition evidence, signal references, topology targets

### §8.3 — `forInvestigation()`: Transformation Semantics

**Consumes:**
- `consequenceResult` (L2 truth: all compiled consequences)

**Transformation operations:**

| Operation | Input | Output | Type |
|---|---|---|---|
| Headline extraction | Top-level consequences | `headline_consequences[]` | PROJECTION — selected fields from each consequence |
| Atomic set pass-through | All atomic consequences | `full_atomic_set[]` | PROJECTION — direct pass-through |
| Compilation trace | Compilation metadata | `compilation_trace` | PROJECTION — direct pass-through |

**Evidence preserved:** consequence_id, consequence_type_id, severity, confidence, source_conditions, combination_pattern, escalation_applied, escalation_reason, derivation_trace, decomposition, full atomic set, compilation trace
**Evidence lost:** primary_locus detail (domains/clusters/files arrays), condition objects themselves (only IDs), signal data

`forInvestigation()` preserves the most evidence of any persona projection. But it still does not carry the full condition→signal evidence chain.

---

## §9 — Direct Substrate Consumers

Per the ontology consumption model (§5.3-5.4), DENSE and INVESTIGATION consume substrate directly. This section defines why direct consumption bypasses the compiler and what evidence contract the substrate must honor.

### §9.1 — DENSE: Why Direct Consumption

DENSE's constitutional objective is structural behavior interrogation. It needs topology mechanics, not compiled consequence posture.

DENSE consumes:
- `synthesisResult.conditions` — condition objects with topology targets, guided interventions, zone membership
- `swIntelProjection` — cognition surfaces via SoftwareIntelligenceProjectionAdapter
- Topology cognition overlays: 4 slices with topology mutation functions

The compiler's consequence objects compress topology detail that DENSE needs. Propagation corridors, zone members, hub in-degree, cluster composition — these are lost or compressed when conditions become consequences. DENSE bypasses this compression by consuming conditions directly.

**Evidence contract for DENSE:** conditions must carry `shared_topology_targets` (domains, clusters, files), guided interventions, `severity`, `governance_boundary`, and `condition_type`. These fields are the substrate contract.

### §9.2 — INVESTIGATION: Why Direct Consumption

INVESTIGATION's constitutional objective is evidence qualification and governed replay. It verifies evidence chains, not operational meaning.

INVESTIGATION currently consumes:
- `fullReport` — raw evidence (signals, blocks, trace linkage, governance lifecycle)
- `SoftwareIntelligenceInvestigationView` — projection surfaces (STALE)
- `forInvestigation()` — consequence headline projection (added but not fully integrated)

INVESTIGATION should verify:
- Signal → condition derivation (does signal ISIG-001 correctly produce DEPENDENCY_CHOKE_POINT?)
- Condition → consequence mapping (does DEPENDENCY_CHOKE_POINT correctly produce DEP_AMP?)
- Combination pattern detection (are AMPLIFIED_DEP_FRAG contributing consequences correct?)
- Evidence preservation (what was carried, what was lost, at each stage?)
- Compilation trace accuracy (do counts match?)

**This is why INVESTIGATION revalidation depends on this stream.** INVESTIGATION must verify against a locked compilation model, not an implicit one.

---

## §10 — Ontology-to-Consequence Matrix

| Ontology Class | Source Conditions | Primitive Consequences | Combination Consequences | Boardroom Projection | Balanced Projection | Dense Direct Substrate | Investigation Future Proof Need |
|---|---|---|---|---|---|---|---|
| **A — Flow & Propagation** | DEPENDENCY_CHOKE_POINT, PROPAGATION_ASYMMETRY | DEP_AMP, PROP_EXP, DEL_EXP (secondary from PA) | (contributing to AMPLIFIED_DEP_FRAG via DEP_AMP) | COMPRESSED: propagation risk in verdict, cognition slices | SECONDARY: propagation dynamics in reinforcement flow | PRIMARY: topology overlays (choke point, propagation corridor) | Verify: ISIG-001→DCkP→DEP_AMP chain, ISIG-002→PA→PROP_EXP chain |
| **B — Concentration & Saturation** | DPC, SMC, CDCP, GCS, CC | COORD_FRAG, DEL_EXP, OP_BOTTLENECK, RESIL_DEF, GOV_GAP, STAB_RISK | All 3 combinations consume B-sourced primitives | PRIMARY: consequence posture (~40% surface), tension count, locus | PRIMARY: primary story, posture headline, epicenter facts | PRIMARY: pressure zone overlay, structural mass emphasis, compound convergence | Verify: zone→DPC→COORD_FRAG chain, cluster→SMC→RESIL_DEF chain |
| **C — Fragility & Resilience** | (none — byproduct only) | COORD_FRAG (from DPC, DCkP, CDCP), RESIL_DEF (from SMC) | AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL | COMPRESSED: fragility in posture label | SECONDARY: COORD_FRAG in reinforcement flow, fragility in confidence strip | SECONDARY: COORD_FRAG in condition detail | No independent evidence to verify — gap |
| **D — Reinforcement & Accumulation** | (none — emergent) | (none — combinations ARE Class D) | AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL, SYSTEMIC_OP_FRAG | COMPRESSED: "Systemic" in posture label, consequence count | PRIMARY: reinforcement flow (central element), relationship verbs | SECONDARY: compound convergence overlay, combination awareness | Verify: combination detection logic, contributing consequence integrity |
| **E — Drift & Instability** | (partial — cross-class from SMC) | STAB_RISK (from SMC, CC) | (STAB_RISK may contribute to SYSTEMIC_OP_FRAG) | SUPPRESSED | SECONDARY: STAB_RISK in primary story when systemic | SECONDARY: STAB_RISK in signal audit | Verify: SMC→STAB_RISK derivation, CC→STAB_RISK derivation |

---

## §11 — Evidence Preservation Rules

### §11.1 — Signals → Conditions

| Must Preserve | Currently Preserved? | Form |
|---|---|---|
| Signal IDs | YES | `supporting_signal_ids[]` on condition |
| Signal family | IMPLICIT | Derivable from signal ID prefix (ISIG, DPSIG, PSIG) but not explicit field |
| Signal value | NO | Not carried into condition — consumed during feature extraction only |
| Signal severity | YES | Used to derive condition severity via `maxSeverity()` |
| Structural anchors | YES | `shared_topology_targets` (domains, clusters, files) |
| Evidence refs | YES | `evidence_refs[]` on condition (array of evidence block IDs) |
| Feature tags | NO | Consumed during condition activation, not carried |
| Zone membership | YES | Via `pressure_zone_state` cross-reference |
| Derivation rationale | YES | `activation_rule` string on condition |

### §11.2 — Conditions → Consequences

| Must Preserve | Currently Preserved? | Form |
|---|---|---|
| Condition IDs | YES | `source_conditions[]` array |
| Source condition types | INTERNAL ONLY | `_src_type` / `_src_types` — stripped before output by `stripInternal()` |
| Derivation trace | PARTIAL | String: `"condition_id → consequence_type (§4)"` — not structured, not machine-parseable |
| Confidence boundary | YES | `confidence` field via `minConfidence()` |
| Structural locus | YES | `primary_locus` object (domains, clusters, files) |
| Severity | YES | Direct transfer, `maxSev()` across merged sources |
| Activation rule | YES | `activation_rule` string: `"§4 condition_type → consequence_type"` |
| Evidence summary | PARTIAL | `evidence_summary`: `"N condition(s): type1, type2"` — prose, not structured |

### §11.3 — Consequences → Persona Projections

| Must Preserve | Currently Preserved? | Form |
|---|---|---|
| Consequence ID/type | forBalanced: YES, forBoardroom: NO | BOARDROOM loses individual consequence identity |
| Source condition IDs | forBalanced: PARTIAL (display_title only), forBoardroom: NO | BOARDROOM has no condition trace. BALANCED resolves to display names only. |
| Confidence | YES | All projections carry confidence/confidence_label |
| Primary locus | YES | All projections carry locus |
| Ontology class | NO | No projection carries ontology class assignment |
| Combination membership | forBalanced: YES (is_combination), forBoardroom: implicit (posture label) | BOARDROOM compresses to "Systemic" label |
| Derivation trace | forInvestigation: YES, others: NO | Only INVESTIGATION projection preserves derivation trace |

### §11.4 — Persona Projections → Rendering

| Rule | Status |
|---|---|
| May compress | YES — all personas compress |
| May sequence | YES — BALANCED orders by reinforcement verb |
| May label | YES — all personas apply vocabulary labels |
| May NOT erase governance boundary | ENFORCED — confidence always visible |
| May NOT create new truth | ENFORCED — all text from CONSEQUENCE_VOCABULARY or deterministic templates |

---

## §12 — Evidence Loss Inventory

This is the architectural debt record. Each entry defines evidence that is available at one compilation stage but lost before reaching the next.

### §12.1 — Signal → Condition Losses

| Loss | Stage | Impact | Severity |
|---|---|---|---|
| Signal numeric values | Feature extraction consumes values, conditions carry severity only | INVESTIGATION cannot verify signal thresholds that triggered condition activation without re-reading fullReport | MEDIUM |
| Feature tags | Consumed during rule activation, not stored | Cannot audit which features a signal contributed without re-running feature extraction | LOW |

### §12.2 — Condition → Consequence Losses

| Loss | Stage | Impact | Severity |
|---|---|---|---|
| Supporting signal IDs | `mapCondition()` does not transfer `supporting_signal_ids` to consequence | Consequence cannot trace back to originating signals without condition lookup | HIGH |
| Condition type (external) | `_src_type` stripped by `stripInternal()` | External consumers cannot see which condition type produced a consequence without parsing `activation_rule` string | MEDIUM |
| Zone membership detail | Not carried into consequence | Consequence knows its locus domain but not its pressure zone membership | MEDIUM |
| Topology edges | Not carried | Propagation and choke point evidence (edges used for corridor detection) is lost | MEDIUM |
| Operational consequence prose | Replaced by CONSEQUENCE_VOCABULARY template | Condition-specific prose is overwritten by type-level vocabulary | LOW (vocabulary is more consistent) |

### §12.3 — Consequence → Projection Losses

| Loss | Stage | Impact | Severity |
|---|---|---|---|
| Condition IDs (BOARDROOM) | `forBoardroom()` does not carry `source_conditions` | BOARDROOM operator cannot trace posture to conditions | HIGH for INVESTIGATION, LOW for BOARDROOM (correct: executive altitude) |
| Individual consequence objects (BOARDROOM) | Grouped into posture | BOARDROOM sees posture label, not individual consequences | LOW (correct: compression) |
| Derivation trace (BOARDROOM, BALANCED) | Not carried into these projections | Cannot audit derivation from projection alone | MEDIUM |
| Condition IDs (BALANCED) | Resolved to `display_title` only — original condition_id lost | BALANCED operator sees "Pressure Convergence" not "dpc-zone-core-infra" | MEDIUM |
| Ontology class assignment | No projection carries class | Cannot verify which ontology class a consequence belongs to from projection alone | LOW (class is derivable from consequence_type_id) |

### §12.4 — Cross-Cutting Losses

| Loss | Stage | Impact | Severity |
|---|---|---|---|
| `derivation_trace` is string, not structured | Consequence creation | Machine parsing requires regex on a prose string | HIGH — blocks structured provenance verification |
| `evidence_summary` is prose | Consequence deduplication | Machine parsing impossible — "3 condition(s): DPC, SMC, CDCP" | MEDIUM |
| Cognition slices lack `evidence_refs` | `forBoardroom()` slice compilation | Slices cannot be traced to evidence blocks | MEDIUM |
| No ontology class field on consequence | `makeAtomic()` | Ontology class is implicit (derivable from consequence_type_id) but not explicit | LOW |

### §12.5 — Summary

Total evidence losses identified: **16**
- HIGH severity: 3 (signal IDs lost in consequences, condition IDs lost in BOARDROOM, derivation_trace is string)
- MEDIUM severity: 8
- LOW severity: 5

These are **maturity debt**, not runtime failures. The compiler produces correct operational output. But INVESTIGATION cannot fully verify the compilation chain without re-traversing conditions and signals independently.

---

## §13 — Compiler Boundary Rules

### §13.1 — Compiler May

| Permission | Mechanism | Evidence |
|---|---|---|
| Map conditions to consequences | `mapCondition()` with deterministic rules | §4 mapping table |
| Group consequences by locus | `deduplicateConsequences()` | Locus key grouping |
| Detect combination patterns | `detectCombinations()` | §5 pattern matching |
| Escalate severity (governed) | `SEVERITY_ESCALATION` table | §6 — one level above MAX |
| Apply deterministic vocabulary | `CONSEQUENCE_VOCABULARY` | 11 entries, no freeform |
| Produce persona-specific projections | `forBoardroom()`, `forBalanced()`, `forInvestigation()` | §10 persona sections |
| Express reinforcement relationships | `deriveRelationshipVerb()` | 5 deterministic verbs |
| Compress consequence posture | `derivePostureLabel()` | 4 deterministic posture labels |

### §13.2 — Compiler May NOT

| Prohibition | Rationale | Current Status |
|---|---|---|
| Create ungrounded semantic truth | Truth must derive from conditions. No consequence may exist without `source_conditions`. | ENFORCED — `makeAtomic()` always requires a condition |
| Infer beyond conditions | Compiler must not use external knowledge or assumptions. | ENFORCED — only consumes `synthesisResult.conditions` and `fullReport` for context |
| Generate freeform interpretation | All text must come from `CONSEQUENCE_VOCABULARY` or deterministic templates. | ENFORCED — no prose generation in compiler |
| Bypass evidence lineage | Every consequence must carry `source_conditions`, `activation_rule`, `derivation_trace`. | ENFORCED — `makeAtomic()` populates all three |
| Mutate ontology classes | Class assignment is implicit in condition_type → consequence_type mapping. Compiler cannot reassign. | ENFORCED — mapping is static |
| Elevate slice maturity | Compiler produces governed projections, not maturity promotions. | ENFORCED — per consumption model §7.2 |
| Replace INVESTIGATION proof | Compiler projections are not evidence. INVESTIGATION must verify against substrate. | ENFORCED — `forInvestigation()` passes through, does not transform |
| Become persona rendering logic | Compiler produces data structures. Rendering is component responsibility. | ENFORCED — compiler returns plain objects |

### §13.3 — Compiler's Architectural Identity

The compiler is a **cognition transformer**, not an intelligence generator.

It transforms: conditions → consequences → governed projections

While preserving enough lineage to remain evidence-bound.

It does not create truth. It compiles truth from L2 substrate into L3 projections that personas can render. The truth was already present in conditions. The compiler makes it operationally consumable.

---

## §14 — Maturity Bridge Doctrine

Per the ontology consumption model (§7.2-7.3):

- BOARDROOM requires CERTIFIED-level consumption
- BALANCED requires COMPOSABLE-level consumption
- No slice currently reaches those levels
- The compiler bridges this gap by producing governed projections from sub-maturity slices

This stream does not re-derive the maturity bridge doctrine. It adds one clarification:

**The maturity bridge operates at the L2→L3 boundary.** The compiler's `compile()` function works with L2 truth regardless of maturity. The `for*()` functions project L2 truth into L3 meaning. The maturity gap is bridged at the projection stage, not the truth stage.

Implications:
- If a slice reaches CERTIFIED, BOARDROOM MAY still consume through the compiler (vocabulary enforcement, compression rules)
- If a slice reaches COMPOSABLE, BALANCED MAY still consume through the compiler (reinforcement flow, relationship verbs)
- Direct consumption (bypassing compiler) is only appropriate for DENSE (topology mechanics) and INVESTIGATION (evidence verification)

---

## §15 — INVESTIGATION Dependency

INVESTIGATION revalidation depends on this stream because INVESTIGATION must verify:

| Verification Target | Requires This Model? | Why |
|---|---|---|
| Condition → consequence derivation | YES | Must know which conditions produce which consequences (§6) |
| Combination pattern detection | YES | Must know the 3 patterns and their triggers (§7) |
| Severity escalation rules | YES | Must know when and how escalation occurs (§7.4) |
| Evidence preservation contract | YES | Must know what should be preserved at each stage (§11) |
| Evidence loss inventory | YES | Must know what cannot be verified from consequence alone (§12) |
| Compiler boundary rules | YES | Must know what the compiler is/isn't allowed to do (§13) |
| Ontology class assignment | YES | Must know which class each consequence belongs to (§6.2) |

Without this model, INVESTIGATION would verify against whatever it finds in code — mixing discovery with verification. With this model, INVESTIGATION has a constitutional baseline: verify that the runtime matches the locked compilation model.

---

## §16 — Non-Goals

This stream does NOT:
- Modify runtime code
- Modify ConsequenceCompiler behavior
- Modify SignalSynthesisEngine behavior
- Modify persona rendering
- Add new slices or ontology classes
- Add schema validation
- Add structured provenance (evidence_refs, structured derivation_trace)
- Add GitHub temporal evidence
- Add Class C implementation
- Add Class E expansion
- Create new UI
- Implement INVESTIGATION revalidation
- Generate feature backlog

---

## §17 — Recommended Next Stream

If this stream passes, the next stream becomes:

**PI.INVESTIGATION.CONSEQUENCE-VERIFICATION-REVALIDATION.01**

Purpose: Revalidate INVESTIGATION against the locked ontology-to-consequence compilation model. INVESTIGATION can now verify:
- Condition → consequence chains (§6)
- Combination pattern integrity (§7)
- Evidence preservation (§11)
- Evidence loss awareness (§12)
- Compiler boundary compliance (§13)

---

## §18 — Closure Verdict

**PASS — ONTOLOGY-TO-CONSEQUENCE COMPILATION MODEL ESTABLISHED**
