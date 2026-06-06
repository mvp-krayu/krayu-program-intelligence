# PICP Consumption Baseline Map

**Stream:** PI.PICP-CONSUMPTION-BASELINE-MAP.01
**Classification:** G2 (Architecture Consuming)
**Date:** 2026-05-31
**Baseline:** PI.PICP-CONSTITUTION.01 (53fcef1), PI.EXECUTIVE-COGNITION-RUNTIME.01, PI.EXECUTIVE-INTELLIGENCE-REPORT-COMPILER.01

---

## 1. Source of Truth Classification

For each of the 9 constitutionally-locked cognition objects:

| # | Cognition Object | Source of Truth | Notes |
|---|---|---|---|
| 1 | structural_posture | **A. LENS** | Data across fullReport: readiness_summary, qualifier_summary, topology_summary, header_block, governance_lifecycle, proposition_corpus |
| 2 | tension_map | **A. LENS** | COMPOUND_CONVERGENCE conditions + CognitionOntology class activation + forBoardroom() domain_concentration |
| 3 | constraint_inventory | **A. LENS** | structuralEnrichment surfaces (constriction, fragility, boundary_divergence, coupling_inertia) + synthesis conditions |
| 4 | exposure_assessment | **A. LENS** | ConsequenceCompiler output: 8 consequence types + 3 combination patterns + forBoardroom() consequence_themes |
| 5 | trajectory_assessment | **A. LENS** | Data present (conditions, combinations); trajectory-as-property-of-pattern-type not yet classified |
| 6 | decision_surface | **A. LENS** | CONDITION_INTERVENTIONS (3 per condition type) + severity; effort_scope not yet formalized |
| 7 | absence_profile | **A. LENS** | Implicit: active vs suppressed (NOMINAL) conditions + non-activated signals; explicit object not materialized |
| 8 | detection_boundary | **B. EIR lineage** | Measurement frontier information exists only in EIR Chapter 8 narrative and object model governance doc |
| 9 | operational_ceiling | **A. LENS** | forBoardroom() posture + consequence_themes + combination patterns; operational_experience vocabulary not yet formalized |

**Distribution: 8 × LENS, 1 × EIR lineage, 0 × Both, 0 × Neither**

---

## 2. Critical Finding

The Executive Intelligence Report was never a source of truth. It was a consumer that assembled LENS-originating data into prose. The 9 cognition objects were ALREADY being produced by LENS — scattered, unnamed, unassembled — and the EIR forensic analysis revealed this latent structure.

The "25% consulting craft" (T7 in the forensic taxonomy) was a misclassification. What was classified as consulting judgment was actually:
- **Latent L4 cognition** — structured objects computed mentally but never formalized as pipeline outputs
- **L5 projection rendering** — audience-specific format decisions that belong in the rendering layer

The PICP architecture doesn't need to BUILD cognition. It needs to FORMALIZE the cognition that LENS already produces.

---

## 3. Per-Object Trace: LENS → Cognition Object

### 3.1 structural_posture

**Cognitive question:** What is this program's overall structural identity and qualification state?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| qualification.s_level | fullReport.readiness_summary.posture | resolveSemanticPayload() line 1459 |
| qualification.provenance | fullReport.governance_lifecycle.qualification_provenance | projectGovernanceLifecycle() line 801 |
| qualification.revalidation | fullReport.revalidation_intelligence | projectRevalidationIntelligence() line 918 |
| qualification.anchor | fullReport.constitutional_anchor | projectConstitutionalAnchor() line 949 |
| qualification.certification | fullReport.chronicle_certification | projectChronicleCertification() line 1001 |
| qualification.propositions | fullReport.proposition_corpus | projectPropositionCorpus() line 827 |
| scale.total_nodes | fullReport.topology_summary.* | resolveSemanticPayload() line 1414 |
| scale.import_relationships | fullReport.topology_summary.total_import_edges | via structuralEnrichment.code_graph |
| architectural_pattern | **NOT COMPUTED** | Pattern label ("BIFURCATED") was EIR T5 characterization |
| technology_profile | **NOT COMPUTED** | NestJS/React/TypeScript identified in EIR, not in resolver |
| signal_profile | fullReport.dpsig_signal_summary + signal_interpretations | resolveSemanticPayload() lines 1082-1089, 1534 |

**Formalization gap:** architectural_pattern and technology_profile. Both are derivable: pattern from cluster mass ratios (57%/39% = BIFURCATED), technology from code_graph file extensions + framework detection in import edges. No new data needed.

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | YES | header_block (readiness_badge, scope_indicator), narrative_block (executive_summary) |
| BALANCED | YES | Same data, different compression + governance lifecycle detail |
| DENSE | YES | topology_summary numeric fields, signal_interpretations at full precision |
| OPERATOR | YES | governance_lifecycle, proposition_corpus, revalidation/anchor/certification at full detail |
| INVESTIGATION | PLANNED | Would verify qualification chain |

---

### 3.2 tension_map

**Cognitive question:** Where do independent risk vectors converge?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| convergence_centers | COMPOUND_CONVERGENCE conditions from synthesize() | SignalSynthesisEngine ruleCompoundConvergence() line 1156 |
| convergence_centers[].contributing_conditions | condition.contributing_condition_ids | synthesized composite shape |
| convergence_centers[].behavioral_classes | CognitionOntology CONDITION_ONTOLOGY_CLASS | CognitionOntology.js CONDITION_NODES |
| convergence_centers[].risk_label | CLASS_RISK_LABEL composite lookup | ConsequenceCompiler.js line 455 |
| cross_center_coupling | propagation_summary in fullReport | resolveSemanticPayload() line 1442 |
| behavioral_class_activation | CONDITION_ONTOLOGY_CLASS × active conditions | CognitionOntology.js + synthesize() |

**Formalization gap:** Assembly only. All fields are computed. Cross_center_coupling currently requires reading propagation_summary — a materializer would compute this directly from convergence center topology targets.

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | YES | forBoardroom().cognition_slices (convergence listed), domain_concentration, executive_synthesis |
| BALANCED | YES | forBalanced().ontology_groups (class-grouped), reinforcement_flow (convergence center is primary_story) |
| DENSE | YES | Topology overlay: COMPOUND_CONVERGENCE zone markers + convergence glyph on topology |
| OPERATOR | YES | Full condition detail with condition_ids and contributing_condition_ids |
| INVESTIGATION | PLANNED | Would verify convergence computation |

---

### 3.3 constraint_inventory

**Cognitive question:** What structural truths limit operational capacity?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| throughput_ceilings | structuralEnrichment.constriction_surface | GenericSemanticPayloadResolver line 320 |
| blast_radius_exposures | ISIG signals (ISIG-001, ISIG-002) + structural_centrality | signal_interpretations + structuralEnrichment.centrality |
| governance_misalignments | structuralEnrichment.boundary_divergence | GenericSemanticPayloadResolver line 437 |
| structural_fragility | structuralEnrichment.fragility_surface | GenericSemanticPayloadResolver line 192 |
| coupling_rigidity | structuralEnrichment.coupling_inertia | GenericSemanticPayloadResolver line 524 |

**Formalization gap:** Assembly and semantic labeling only. Every constraint field maps directly to an existing enrichment surface. A materializer would read enrichment surfaces and classify constraints by type.

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | INDIRECT | forBoardroom() consumes conditions derived FROM constraints, not constraints directly |
| BALANCED | INDIRECT | Same — ontology_groups organize by behavioral class, which comes from condition types that derive from constraints |
| DENSE | YES | Direct enrichment surface display — topology overlays for constriction, fragility, boundary divergence, coupling inertia |
| OPERATOR | YES | Full enrichment surface values at numeric precision |
| INVESTIGATION | PLANNED | Would verify enrichment derivation chain |

---

### 3.4 exposure_assessment

**Cognitive question:** Where is the program structurally exposed?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| concentration_exposure | DPSIG cluster metrics + structural_centrality top files | dpsig_signal_summary + enrichment.centrality.centrality_ranking |
| governance_exposure | boundary_divergence surface + blind_spot_entities from pressure_zone_state | enrichment + pressureZoneState |
| fragility_exposure | fragility_surface.fragility_hotspots + fragile hub classification | enrichment.fragility_surface |

**Formalization gap:** Assembly and cross-referencing. Concentration, governance, and fragility exposure are computed by separate enrichment surfaces — a materializer would read all three and produce the unified exposure assessment.

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | YES | consequence_themes include RESIL_DEF, GOV_GAP, PROP_EXP — exposure consequence types |
| BALANCED | YES | reinforcement_flow shows how exposure compounds across consequence types |
| DENSE | YES | Per-domain exposure visible through topology overlays (fragility, boundary divergence) |
| OPERATOR | YES | Raw exposure values from enrichment surfaces |
| INVESTIGATION | PLANNED | Would verify exposure derivation |

---

### 3.5 trajectory_assessment

**Cognitive question:** Where are things heading — pattern-based trajectory inference?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| worsening | STRUCT_GRAVITY_WELL, COUPLING_INERTIA conditions (inherent property) | ConsequenceCompiler combination patterns |
| stable | GOVERNANCE_COVERAGE_COMPLETE condition | SignalSynthesisEngine |
| unmeasured | Behavioral slice inventory — deferred temporal slices | SLICE_TAXONOMY_AND_GOVERNANCE.md (static) |

**Formalization gap:** Trajectory-as-property-of-pattern-type is not yet encoded. The object model proves this is DETERMINISTIC — a STRUCT_GRAVITY_WELL inherently worsens because mass accumulation is self-reinforcing. But no code reads the condition type and outputs "worsening." A materializer would add a `trajectory_property` field to CONDITION_VOCABULARY or CONSEQUENCE_VOCABULARY and derive trajectory from active patterns.

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | NO | No trajectory information currently surfaced |
| BALANCED | NO | No trajectory information currently surfaced |
| DENSE | NO | No trajectory overlay exists |
| OPERATOR | NO | No trajectory data exposed |
| INVESTIGATION | PLANNED | Would verify trajectory claims |

**Delta:** This is the cognition object with the LARGEST consumption gap. Every persona should consume trajectory (at different compression depths), but none currently do.

---

### 3.6 decision_surface

**Cognitive question:** What decisions does the cognition support?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| leverage_points (intervention types) | CONDITION_INTERVENTIONS per condition type | SignalSynthesisEngine lines 75-116 |
| leverage_points (targets) | condition.shared_topology_targets.domains | synthesized conditions |
| leverage_points (evidence) | enrichment surfaces + condition evidence_mode | structuralEnrichment + conditions |
| urgency (severity component) | condition.severity | synthesized conditions |
| urgency (effort_scope component) | **NOT COMPUTED** | Derivable from condition scope (file-level, module-level, architectural) |

**Formalization gap:** effort_scope classification. CONDITION_INTERVENTIONS carry action_type (INSPECT/TRACE/COMPARE) and operator_label, but not effort_scope (FILE_LEVEL/PROCESS_LEVEL/MODULE_LEVEL/ARCHITECTURAL/CAPABILITY). The object model shows this is RULE-BASED (derivable from condition scope + target specificity).

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | PARTIAL | consequence_themes give severity-ranked operational implications; no explicit leverage_point list |
| BALANCED | PARTIAL | primary_story + reinforcement_flow provide causal chain but no intervention list |
| DENSE | YES | CONDITION_INTERVENTIONS rendered as guided actions per condition overlay |
| OPERATOR | YES | Full intervention inventory with action_types |
| INVESTIGATION | PLANNED | Would verify intervention derivation |

---

### 3.7 absence_profile

**Cognitive question:** What did the system look for and not find?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| inactive_conditions | CONDITION_VOCABULARY - active conditions | SignalSynthesisEngine: active vs suppressed (NOMINAL) filtering, line 1370-1371 |
| unmeasured_conditions | Deferred behavioral slices | SLICE_TAXONOMY_AND_GOVERNANCE.md (static) |
| non_activated_signals | Signal activation states | signal_registry NOMINAL entries |
| classification (POSITIVE/EXPECTED/CONCERNING) | **NOT COMPUTED** | Rule-based: temporal requirement=EXPECTED, structurally clean=POSITIVE |

**Formalization gap:** Explicit materialization. The set difference (all possible - active = absent) is trivially computable. Classification logic (POSITIVE/EXPECTED/CONCERNING) requires one rule per absence reason. A materializer would compute this in ~30 lines.

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | NO | No absence information currently surfaced |
| BALANCED | NO | No absence information currently surfaced |
| DENSE | NO | No absence overlay exists |
| OPERATOR | PARTIAL | Can observe NOMINAL signals in signal list, but no explicit absence profile |
| INVESTIGATION | PLANNED | Would verify absence claims |

**Delta:** Second-largest consumption gap. The EIR Chapter 5 proved this has high value — "what did NOT activate" was explicitly noted as editorial insight with no runtime equivalent.

---

### 3.8 detection_boundary

**Cognitive question:** What aspects of structural reality were previously unmeasurable and what measurement capability made them visible?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| detection_advantages | **NOT IN LENS** | — |
| traditional_equivalent | **NOT IN LENS** | — |
| detection_gap | **NOT IN LENS** | — |
| category | **NOT IN LENS** | — |

**Source of truth:** B. EIR lineage. EIR Chapter 8 ("What Would Have Been Hard to Discover Traditionally") is the ONLY place where measurement frontier information exists. The object model proposes a `TRADITIONAL_DETECTABILITY` field on CONDITION_VOCABULARY that would formalize this as static metadata.

**Formalization gap:** Complete. This object requires authoring — a static lookup table per condition type specifying: traditional equivalent, detection gap, and measurement category. ~12 entries (one per condition type in CONDITION_VOCABULARY). Once authored, it becomes deterministic and projection-free.

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | NO | No detection frontier information surfaced |
| BALANCED | NO | No detection frontier information surfaced |
| DENSE | NO | No detection frontier overlay |
| OPERATOR | NO | No detection metadata exposed |
| INVESTIGATION | PLANNED | Would verify detection claims |

**Note:** detection_boundary was reconstituted from competitive_intelligence (Gate 4 failure on Projection Freedom). The reconstituted framing is measurement-frontier-focused, not competitive-positioning-focused. LENS's version of this object would be a static property of the condition vocabulary, not a dynamically computed artifact.

---

### 3.9 operational_ceiling

**Cognitive question:** What does structural reality mean for operational capacity?

**Current LENS data location:**

| Object Field | LENS Source | Location |
|---|---|---|
| posture_statement.qualified | fullReport.readiness_summary | resolveSemanticPayload() line 1459 |
| posture_statement.ceiling_exists | COMPOUND_CONVERGENCE at CRITICAL | synthesize() composites |
| ceiling_drivers | forBoardroom().consequence_themes (severity-sorted) | ConsequenceCompiler line 819-843 |
| ceiling_properties.architecture_sensitive | **DERIVABLE** | Rule: topological constraints = architecture-sensitive |
| ceiling_properties.staffing_sensitive | **DERIVABLE** | Rule: topological constraints = staffing-insensitive |
| operational_experience.likely_symptoms | **NOT COMPUTED** | Vocabulary-based: condition-type-specific symptom list |

**Formalization gap:** ceiling_properties (rule-based derivation from constraint types) and operational_experience (vocabulary of condition-type-specific symptoms). Both are ~20 lines of static mapping.

**Persona consumption:**

| Persona | Consumes? | How |
|---|---|---|
| BOARDROOM | YES | forBoardroom().posture_label + combined_synthesis + executive_synthesis IS the operational ceiling rendered |
| BALANCED | YES | forBalanced().posture_label + combined_synthesis IS the ceiling at operational depth |
| DENSE | PARTIAL | Topology shows WHERE ceiling drivers concentrate, but no explicit ceiling object |
| OPERATOR | PARTIAL | Can observe compound convergence conditions, but no assembled ceiling |
| INVESTIGATION | PLANNED | Would verify ceiling derivation |

---

## 4. Consumption Matrix

### 4.1 Object × Persona Matrix

| Object | BOARDROOM | BALANCED | DENSE | OPERATOR | INVESTIGATION |
|---|---|---|---|---|---|
| structural_posture | ●●● EXPLICIT | ●●● EXPLICIT | ●● EXPLICIT | ●●● EXPLICIT | PLANNED |
| tension_map | ●●● EXPLICIT | ●●● EXPLICIT | ●●● EXPLICIT | ●● EXPLICIT | PLANNED |
| constraint_inventory | ●○ INDIRECT | ●○ INDIRECT | ●●● EXPLICIT | ●●● EXPLICIT | PLANNED |
| exposure_assessment | ●● EXPLICIT | ●● EXPLICIT | ●●● EXPLICIT | ●●● EXPLICIT | PLANNED |
| trajectory_assessment | ○ ABSENT | ○ ABSENT | ○ ABSENT | ○ ABSENT | PLANNED |
| decision_surface | ●○ PARTIAL | ●○ PARTIAL | ●●● EXPLICIT | ●● EXPLICIT | PLANNED |
| absence_profile | ○ ABSENT | ○ ABSENT | ○ ABSENT | ●○ PARTIAL | PLANNED |
| detection_boundary | ○ ABSENT | ○ ABSENT | ○ ABSENT | ○ ABSENT | PLANNED |
| operational_ceiling | ●●● EXPLICIT | ●● EXPLICIT | ●○ PARTIAL | ●○ PARTIAL | PLANNED |

**Legend:** ●●● = full consumption, ●● = substantial, ●○ = partial/indirect, ○ = absent

### 4.2 Coverage Summary

| Category | Count | Objects |
|---|---|---|
| **Universally consumed** (all active personas) | 4 | structural_posture, tension_map, exposure_assessment, operational_ceiling |
| **Split consumed** (some explicit, some indirect) | 2 | constraint_inventory (DENSE+OPERATOR explicit, BOARDROOM+BALANCED indirect), decision_surface (DENSE+OPERATOR explicit, BOARDROOM+BALANCED partial) |
| **Absent from all active personas** | 3 | trajectory_assessment, absence_profile, detection_boundary |

### 4.3 Overlap and Duplication

| Pattern | Where | Evidence |
|---|---|---|
| constraint→consequence duplication | BOARDROOM, BALANCED | constraint_inventory data flows through conditions→consequences. BOARDROOM/BALANCED consume consequence themes, not constraints directly. Same data, two paths. |
| tension_map→consequence overlap | BOARDROOM | forBoardroom() produces both cognition_slices (condition-level) AND consequence_themes (consequence-level) for the SAME convergence centers. Two representations of one tension. |
| structural_posture spread | ALL | Structural posture data is dispersed across readiness_summary, qualifier_summary, topology_summary, header_block, governance_lifecycle, proposition_corpus. Six separate payload fields for one cognition object. |

### 4.4 Hidden Cognition

| Object | Hidden Where | What's Hidden |
|---|---|---|
| trajectory_assessment | consequence combination patterns | STRUCT_GRAVITY_WELL has inherent worsening trajectory. COUPLING_INERTIA has inherent worsening trajectory. This information EXISTS in the combination pattern definitions but is never SURFACED as trajectory. |
| absence_profile | SignalSynthesisEngine filtering | The engine computes active vs suppressed (NOMINAL) conditions. The suppressed set IS the absence profile. But it's filtered OUT rather than materialized as cognition. |
| detection_boundary | CONDITION_VOCABULARY structure | Each condition type's detection method implicitly defines what traditional analysis can't detect. This is a structural property of the vocabulary, never extracted. |

### 4.5 Existing De Facto Consumers

| Consumer | What It Consumes | As What Object |
|---|---|---|
| ConsequenceCompiler.forBoardroom() | tension_map + exposure_assessment + operational_ceiling | cognition_slices, consequence_themes, posture_label, executive_synthesis |
| ConsequenceCompiler.forBalanced() | tension_map + exposure_assessment | primary_story, reinforcement_flow, ontology_groups |
| IntelligenceField.jsx | constraint_inventory (via topology overlays) | DYNAMICS_GLYPH_TYPE condition rendering |
| StructuralTopologyZone.jsx | constraint_inventory + exposure_assessment (via overlays) | COGNITION_OVERLAY_COLORS zone coloring |
| InvestigationVerifier.js | constraint_inventory (via SECTION_4_RULES) | Condition→consequence derivation verification |
| SoftwareIntelligenceProjectionAdapter.js | structural_posture + tension_map (via SURFACE_CONDITION_MAP) | Surface-to-condition routing |

---

## 5. Smallest Architectural Path to PICP Consumption

### 5.1 What Already Exists

8 of 9 cognition objects have their source of truth in LENS. The data is present but scattered across:
- `resolveSemanticPayload()` output (~180 fields in fullReport)
- `SignalSynthesisEngine.synthesize()` output (conditions)
- `ConsequenceCompiler.compile()` output (consequences)
- `structuralEnrichment` object (enrichment surfaces)
- `ConsequenceCompiler.forBoardroom()` / `forBalanced()` / `forOperator()` / `forInvestigation()` (persona projections)

### 5.2 The Formalization Gap

The gap is NOT "build 9 materializers from scratch." The gap is:

1. **Assembly** (7/9 objects) — collect already-computed data into named PICP objects
2. **Static vocabulary additions** (2/9 objects) — add trajectory_property and traditional_detectability to existing vocabularies
3. **Persona re-routing** (all) — personas consume PICP objects instead of raw pipeline fields

### 5.3 Effort Classification

| Tier | Objects | Work Required |
|---|---|---|
| **T1: Assembly only** | structural_posture, tension_map, constraint_inventory, exposure_assessment | Materializer reads existing data, assembles into object schema. No new computation. |
| **T2: Assembly + static lookup** | trajectory_assessment, absence_profile, operational_ceiling | Assembly + small vocabulary additions (trajectory_property, absence_classification, symptom vocabulary) |
| **T3: Vocabulary authoring** | detection_boundary | Author TRADITIONAL_DETECTABILITY per condition type (~12 entries). Static, one-time. |
| **T4: Rule formalization** | decision_surface | Formalize effort_scope classification rules. Add to CONDITION_VOCABULARY or a separate mapping. |

### 5.4 Recommended Sequence

1. **T1 first** — materialize the 4 assembly-only objects. Proves the PICP pattern works. Zero new computation.
2. **T2 next** — add vocabulary fields, materialize trajectory_assessment, absence_profile, operational_ceiling.
3. **T3+T4 last** — detection_boundary and decision_surface formalization.

### 5.5 What This Does NOT Require

- No new computation engine
- No new data sources
- No new signal families
- No temporal measurement infrastructure
- No full runtime mapping
- No PRE (L5) implementation — persona consumption can be refactored incrementally by pointing forBoardroom()/forBalanced() at PICP objects instead of raw pipeline fields

---

## 6. Architectural Implication

The PICP is not a new layer to BUILD. It is a formalization of cognition that LENS already produces. The materializers are thin — most are 30-80 lines of assembly code reading existing data.

The real architectural value is not in the materializers themselves, but in what they enable:
- **Diffability** — structured objects can be diffed across runs (temporal intelligence)
- **Replayability** — PICP can be serialized and replayed without re-running the pipeline
- **Projection independence** — personas consume the SAME PICP objects, ensuring consistency
- **Extension** — new cognition objects (e.g., reinforcement_flow_map) plug into the same architecture

The EIR forensic analysis proved this architecture is real. This baseline map proves the implementation path is short.
