# Vector → Function → Object Bridge Investigation

**Stream:** PI.COGNITIVE-PRIMITIVES.FORENSIC-INVESTIGATION.03
**Classification:** G2 — Architecture-Consuming
**Date:** 2026-06-03
**Discovery instrument:** Cross-artifact forensic mapping (THORR vectors × 22 functions × 9 cognition objects × production pipeline)
**Status:** FORENSIC ARTIFACT — not doctrine
**Depends on:**
- PI.COGNITIVE-PRIMITIVES.FORENSIC-INVESTIGATION.01 (primitive maturity assessment)
- PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01 (22 cognitive functions, stratum decomposition)
- PI.PICP-CONSUMPTION-BASELINE-MAP.01 (9 cognition objects, materializer architecture)
- PI.EXECUTIVE-COGNITION-RUNTIME.01 (PICR/PICP/PRE architecture, object model)

---

## 1. Hypothesis

### Statement

The 22 cognitive functions (discovered in PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01) are the missing bridge between the 7 THORR cognition vectors and the 9 PICP cognition objects:

```
7 THORR Vectors          22 Cognitive Functions          9 PICP Cognition Objects
(domain-neutral           (the bridge?)                  (L4 deterministic
 cognitive questions)                                     artifacts)

GOVERNANCE ───────→ Evidence Boundary Qualification ───→ structural_posture
STRUCTURE  ───────→ Spatial Anchor Resolution ─────────→ tension_map
PRESSURE   ───────→ Pressure Concentration Detection ──→ constraint_inventory
TRAJECTORY ───────→ Temporal Cognition Agent ──────────→ trajectory_assessment
TRANSFORMATION ───→ (?) ──────────────────────────────→ (?)
IMPACT     ───────→ Executive Synthesis Agent ─────────→ exposure_assessment
DECISION   ───────→ Guided Cognition Agent ────────────→ decision_surface
```

### What "bridge confirmed" would mean

The 22 functions are the bridge if:

1. Each vector's cognitive question is answered by one or more of the 22 functions
2. Each function produces output that maps to one or more cognition objects
3. The chain VECTOR → FUNCTION → OBJECT is the actual production mechanism
4. No significant cognition occurs outside the 22 functions that reaches the cognition objects

### What "bridge rejected" would mean

The 22 functions are NOT the bridge if:

1. The functions are consumer-level orchestration (projection), not production mechanisms
2. A different production chain produces cognition object inputs
3. The functions operate DOWNSTREAM of cognition formation, not upstream
4. Removing the functions would not break cognition object production

---

## 2. The Production Pipeline (Forensic Audit)

Before evaluating the 22 functions as bridge candidates, the actual production pipeline must be mapped.

### 2.1 The Actual Production Chain

Forensic audit of PI Core source files reveals the following production chain:

```
EVIDENCE SUBSTRATE
    ↓
40.2 → 40.3 → 40.4 pipeline (scripts/pios/)
    ↓
resolveSemanticPayload() (~180 fields in fullReport)
    ↓
┌─────────────────────────────────┐
│  SignalSynthesisEngine.js       │
│  (1,441 LOC)                    │
│  10 rule engines + 1 composite  │
│  Input: signals, enrichment     │
│  Output: CONDITIONS             │
│  (severity-classified,          │
│   topology-targeted,            │
│   intervention-equipped)        │
└───────────┬─────────────────────┘
            ↓
┌─────────────────────────────────┐
│  ConsequenceCompiler.js         │
│  (1,158 LOC)                    │
│  11 mappers + 3 combinations    │
│  Input: conditions              │
│  Output: CONSEQUENCES           │
│  (8 types, 5 risk classes,      │
│   3-layer vocabulary)           │
└───────────┬─────────────────────┘
            ↓
┌─────────────────────────────────┐
│  CognitionOntology.js           │
│  (700 LOC)                      │
│  11 condition nodes,            │
│  8 consequence nodes            │
│  Input: conditions+consequences │
│  Output: BEHAVIORAL CLASSES     │
│  (ontology classification)      │
└───────────┬─────────────────────┘
            ↓
┌─────────────────────────────────┐
│  PIContextAssembler.js          │
│  (576 LOC)                      │
│  Confidence hierarchy,          │
│  access tier, knowledge walls   │
│  Input: all pipeline outputs    │
│  Output: GOVERNED CONTEXT       │
│  (authority envelope)           │
└───────────┬─────────────────────┘
            ↓
      fullReport (assembled)
            ↓
┌─────────────────────────────────┐
│  forBoardroom() / forBalanced() │
│  / forOperator() /              │
│  forInvestigation()             │
│  (ConsequenceCompiler lines     │
│   770-1154)                     │
│  Input: fullReport              │
│  Output: PERSONA PROJECTIONS    │
└─────────────────────────────────┘
```

### 2.2 Production Mechanism Count

| Stage | Component | Output Count | LOC |
|---|---|---|---|
| Signal synthesis | 10 rule engines + 1 composite | 11 condition types | 1,441 |
| Consequence compilation | 11 mappers + 3 combinations | 8 consequence types + 3 combos | 1,158 |
| Ontology classification | 11 + 8 nodes | 19 behavioral classes | 700 |
| Governance envelope | confidence + access + prohibition | 3 hierarchies + 13 prohibitions | 576 + 192 |
| Persona projection | 4 altitude functions | 4 persona views | ~400 |

**Total production mechanisms: ~35 distinct computational acts across ~4,467 LOC**

### 2.3 Where the 22 Functions Sit

The 22 cognitive functions were discovered in PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01 by forensically decomposing the BALANCED persona surface. They are:

- NOT inside SignalSynthesisEngine (which has its own 10 rule engines)
- NOT inside ConsequenceCompiler (which has its own 11 mappers)
- NOT inside CognitionOntology (which has its own 19 nodes)
- NOT inside PIContextAssembler (which has its own hierarchies)

They are INSIDE the BALANCED persona rendering layer:
- `BALANCED_INTERPRETIVE_NARRATIVES` registry (Component 16: Emergence Narrative System)
- `deriveRenderState()` calls (Components 1, 7, 14)
- Threshold-gated activation logic (Components 6, 9, 11, 12)
- Progressive disclosure rendering (Components 13, 17)

**Finding: The 22 functions operate DOWNSTREAM of the production pipeline, not upstream.**

---

## 3. Three-Way Mapping: Vectors × Functions × Objects

### 3.1 VEC-01 GOVERNANCE → Functions → Objects

**Vector question:** "Can this conclusion be trusted?"

**Production mechanism (actual):**
- PIContextAssembler: confidence hierarchy (GOVERNED / ADVISORY_BOUND / STRUCTURAL_ONLY)
- ProhibitionValidator: 13 absolute prohibitions
- SQO state machine: S-level authority ceiling
- CognitionOntology: governance_boundary field per condition

**Cognitive functions that CONSUME governance outputs:**

| # | Function | Role | Bridge? |
|---|---|---|---|
| 14 | Evidence Boundary Qualification | REFRAMES counts as "confirmed vs unknown" | PRODUCES new cognitive framing — candidate bridge element |
| 19 | Confidence Classification | Compresses per-domain confidence → tiered posture | AGGREGATES existing computation — not new cognition |
| 22 | Authority Mode Router | Declares governance authority from emergence state | ROUTES existing state — not new cognition |
| 12 | Governance Friction Detection | Activates on governance lifecycle friction | MONITORS existing data — sentinel, not producer |
| 6 | Trust Posture Synthesis | S-state + grounding → trust classification | AGGREGATES existing computation — cognitive compression |

**Cognition objects served:**
- structural_posture (qualification.s_level, qualification.provenance, qualification.propositions)
- operational_ceiling (posture_statement.qualified, posture_statement.ceiling_exists)

**Verdict for GOVERNANCE:** The production pipeline (PIContextAssembler, ProhibitionValidator, SQO) produces governance computation. The functions CONSUME and PRESENT these outputs. Exception: Evidence Boundary Qualification (#14) performs a genuine cognitive act — it REFRAMES raw counts into a constitutional knowledge boundary. This reframing is not performed by any pipeline component.

---

### 3.2 VEC-02 STRUCTURE → Functions → Objects

**Vector question:** "What actually exists?"

**Production mechanism (actual):**
- 40.2→40.3→40.4 pipeline: graph construction, domain registration, structural enrichment
- resolveSemanticPayload(): topology_summary, structural_enrichment, domain_registry
- SignalSynthesisEngine: extractFeatures(), buildDomainResolver(), translateCentralityNode()

**Cognitive functions that CONSUME structural outputs:**

| # | Function | Role | Bridge? |
|---|---|---|---|
| 15 | Spatial Anchor Resolution | Cascaded zone identity resolution | RESOLVES location from multiple sources — routing logic |
| 5 | Posture Synthesis | Band + posture + qualifier → readiness state | COMPRESSES existing data — not new cognition |

**Cognition objects served:**
- structural_posture (scale.total_nodes, scale.import_relationships, signal_profile)
- constraint_inventory (throughput_ceilings, blast_radius_exposures, structural_fragility, coupling_rigidity)
- tension_map (convergence_centers, cross_center_coupling) — via conditions feeding topology targets

**Verdict for STRUCTURE:** Structure IS PI Core. The entire pipeline IS structural computation. The 22 functions add nothing to structural production — they consume structural outputs for persona presentation. No function produces structural truth that the pipeline does not already produce.

---

### 3.3 VEC-03 PRESSURE → Functions → Objects

**Vector question:** "Where is stress accumulating?"

**Production mechanism (actual):**
- SignalSynthesisEngine: 10 rule engines (ruleDeliveryPressureConcentration, ruleDependencyChokePoint, rulePropagationAsymmetry, ruleStructuralMassConcentration, etc.)
- ruleCompoundConvergence: composite rule (fires when ≥3 non-nominal target same domain)
- Output: CONDITIONS with severity (NOMINAL / ELEVATED / HIGH / CRITICAL), topology targets, guided interventions

**Cognitive functions that CONSUME pressure outputs:**

| # | Function | Role | Bridge? |
|---|---|---|---|
| 9 | Pressure Concentration Detection | Multi-condition sentinel | MONITORS pipeline output — activates on threshold |
| 8 | Grounding Asymmetry Detection | Grounding ratio sentinel | MONITORS a specific ratio — threshold activation |
| 11 | Compression Detection | Band-vs-ratio gap | MONITORS gap between classification and evidence — threshold |
| 10 | Propagation Chain Detection | ORIGIN→PASS_THROUGH→RECEIVER | DETECTS a specific structural pattern — pattern recognition |
| 7 | Compound Activation Agent | Multi-signal co-activation → emergent meaning | SYNTHESIZES new meaning from co-activation — candidate bridge |

**Cognition objects served:**
- tension_map (convergence_centers from COMPOUND_CONVERGENCE, behavioral_class_activation)
- constraint_inventory (throughput_ceilings from constriction_surface, coupling_rigidity from coupling_inertia)
- exposure_assessment (concentration_exposure, fragility_exposure)

**Verdict for PRESSURE:** The 10 SSE rule engines ARE the pressure production mechanism. The functions MONITOR and ACTIVATE on threshold crossings — they are sentinels, not producers. Exception: Compound Activation Agent (#7) synthesizes emergent meaning that no single condition carries. This synthesis is not present in SSE itself (which only detects co-occurrence, not its meaning).

---

### 3.4 VEC-04 TRAJECTORY → Functions → Objects

**Vector question:** "What is changing?"

**Production mechanism (actual):**
- temporal_marker field: universally null — designed, not activated
- EXSIG/TIMSIG signal families: declared, zero producers
- trajectoryAssessment.js: PSEUDO-TEMPORAL — static property lookup using trajectory language
- SQO domain only: ReconciliationTemporalAnalyticsCompiler, QualificationHistory (proven but domain-specific)

**Cognitive functions that CONSUME trajectory outputs:**

| # | Function | Role | Bridge? |
|---|---|---|---|
| 16 | Temporal Cognition Agent | Tracks confidence evolution across epochs | TRACKS SQO data — not structural trajectory |
| 21 | Debt Evolution Tracker | Reports debt trajectory after enrichment | REPORTS SQO data — not structural trajectory |

**Cognition objects served:**
- trajectory_assessment (LARGEST consumption gap — no persona currently surfaces trajectory)

**Verdict for TRAJECTORY:** Neither the production pipeline NOR the 22 functions produce structural trajectory. The production chain is BROKEN. Functions #16 and #21 read SQO-domain temporal data but produce nothing for the structural domain. The bridge cannot exist where no production exists.

---

### 3.5 VEC-05 TRANSFORMATION → Functions → Objects

**Vector question:** "What must change?"

**Production mechanism (actual):**
- Ingredients exist in other vectors' outputs:
  - Constraint identification → from SSE (PRESSURE)
  - Execution ceiling detection → DEL_EXP → from CC (IMPACT)
  - Blocker detection → from SQO (GOVERNANCE)
  - Constriction points → from SSE (PRESSURE)
- No orchestration function composes these into transformation assessment

**Cognitive functions that CONSUME transformation-related outputs:**

| # | Function | Role | Bridge? |
|---|---|---|---|
| 20 | Blockage Detection + Resolution Advisory | Identifies blockers, advises resolution | SQO-SPECIFIC — not general transformation |

**Cognition objects served:**
- No cognition object maps to TRANSFORMATION. decision_surface carries intervention types but not transformation readiness.

**Verdict for TRANSFORMATION:** No production mechanism. No bridge function. No cognition object. TRANSFORMATION is a named gap — ingredients exist as outputs of OTHER vectors, but no composition function exists at any layer.

---

### 3.6 VEC-06 IMPACT → Functions → Objects

**Vector question:** "Why does this matter?"

**Production mechanism (actual):**
- ConsequenceCompiler: 11 condition→consequence mappers
- 8 atomic consequence types (COORD_FRAG, DEP_AMP, DEL_EXP, OP_BOTTLENECK, RESIL_DEF, GOV_GAP, PROP_EXP, STAB_RISK)
- 3 combination patterns (AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL, SYSTEMIC_OP_FRAG)
- 5 risk classes (A-E)
- 3-layer vocabulary (engine → structural → operator)
- CognitionOntology: why_it_matters, operational_implication per node

**Cognitive functions that CONSUME impact outputs:**

| # | Function | Role | Bridge? |
|---|---|---|---|
| 4 | Executive Synthesis Agent | Composes posture + topology + signals → lead paragraph | SYNTHESIZES narrative from multiple inputs — L5 projection |
| 13 | Signal Interpretation Agent | Per-signal meaning-in-context | INTERPRETS individual conditions — adds narrative framing |
| 7 | Compound Activation Agent | Multi-signal emergent meaning | SYNTHESIZES compound meaning — candidate bridge (shared with PRESSURE) |

**Cognition objects served:**
- exposure_assessment (concentration_exposure, governance_exposure, fragility_exposure)
- operational_ceiling (ceiling_drivers from consequence_themes)
- tension_map (behavioral_class_activation from ontology classification)

**Verdict for IMPACT:** ConsequenceCompiler IS the impact production mechanism. Its 11 mappers + 3 combinations + 3-layer vocabulary ARE the cognition. The functions add narrative framing (Executive Synthesis, Signal Interpretation) — this is L5 projection, not L4 formation. Exception: Compound Activation (#7) synthesizes meaning from co-activation that is richer than the sum of individual consequence descriptions.

---

### 3.7 VEC-07 DECISION → Functions → Objects

**Vector question:** "What action becomes possible?"

**Production mechanism (actual):**
- SignalSynthesisEngine: CONDITION_INTERVENTIONS (3 per condition type) — INSPECT / TRACE / COMPARE / QUALIFY / DECOMPOSE
- ModeOrchestrator: 9 transformation modes
- ConsequenceCompiler: altitude projections (forBoardroom, forBalanced, forOperator, forInvestigation)
- ProhibitionValidator: 13 absolute prohibitions on prescriptive action

**Cognitive functions that CONSUME decision outputs:**

| # | Function | Role | Bridge? |
|---|---|---|---|
| 17 | Guided Cognition Agent | Directed interrogation paths | OFFERS investigation paths — consumer orchestration |
| 18 | Interrogation Trail Agent | Tracks operator exploration | MONITORS operator behavior — meta-cognitive |

**Cognition objects served:**
- decision_surface (leverage_points from CONDITION_INTERVENTIONS, urgency from severity)

**Verdict for DECISION:** CONDITION_INTERVENTIONS (hardcoded per condition type in SSE) ARE the decision production mechanism. The functions (#17, #18) offer and track investigation paths — consumer-level orchestration. Neither produces decision outputs that do not originate from the pipeline.

---

## 4. The Actual Bridge

### 4.1 The Production Pipeline IS the Bridge

The forensic evidence reveals that the bridge between THORR vectors and PICP cognition objects is NOT the 22 cognitive functions. The bridge is the production pipeline itself:

```
THORR VECTORS                    PRODUCTION PIPELINE                         PICP COGNITION OBJECTS
(cognitive questions)            (computational mechanisms)                  (L4 artifacts)
═════════════════════════════════════════════════════════════════════════════════════════════════════

VEC-01 GOVERNANCE ──────→ PIContextAssembler (confidence hierarchy)    ──→ structural_posture
 "Can this be trusted?"   ProhibitionValidator (13 prohibitions)            (qualification fields)
                          SQO state machine (authority ceiling)         ──→ operational_ceiling
                          CognitionOntology (governance_boundary)           (authority fields)

VEC-02 STRUCTURE ───────→ 40.2→40.3→40.4 pipeline                     ──→ structural_posture
 "What actually exists?"  resolveSemanticPayload (~180 fields)              (scale, topology)
                          extractFeatures, buildDomainResolver         ──→ constraint_inventory
                                                                            (structural limits)

VEC-03 PRESSURE ────────→ SignalSynthesisEngine (10 rule engines)      ──→ tension_map
 "Where is stress?"       ruleCompoundConvergence (composite)               (convergence centers)
                          structuralEnrichment surfaces                ──→ constraint_inventory
                                                                            (throughput ceilings)
                                                                       ──→ exposure_assessment
                                                                            (concentration)

VEC-04 TRAJECTORY ──────→ *** BROKEN ***                               ──→ trajectory_assessment
 "What is changing?"      temporal_marker: null                             (LARGEST gap)
                          EXSIG/TIMSIG: zero producers

VEC-05 TRANSFORMATION ──→ *** NO MECHANISM ***                         ──→ *** NO OBJECT ***
 "What must change?"      Ingredients exist in other vectors

VEC-06 IMPACT ──────────→ ConsequenceCompiler (11 mappers)             ──→ exposure_assessment
 "Why does this matter?"  3 combination patterns                            (governance, fragility)
                          CognitionOntology (why_it_matters)           ──→ operational_ceiling
                          3-layer vocabulary                                (ceiling drivers)

VEC-07 DECISION ────────→ CONDITION_INTERVENTIONS (per condition)      ──→ decision_surface
 "What action is           ModeOrchestrator (9 modes)                       (leverage points)
  possible?"              ProhibitionValidator (prohibitions)
```

### 4.2 Multi-Vector Objects

Several cognition objects are produced by MULTIPLE vectors:

| Cognition Object | Primary Vector | Contributing Vectors |
|---|---|---|
| structural_posture | VEC-02 STRUCTURE | VEC-01 GOVERNANCE (qualification) |
| tension_map | VEC-03 PRESSURE | VEC-02 STRUCTURE (topology targets) |
| constraint_inventory | VEC-02 STRUCTURE | VEC-03 PRESSURE (throughput ceilings) |
| exposure_assessment | VEC-03 PRESSURE | VEC-06 IMPACT (consequence types), VEC-02 STRUCTURE (enrichment surfaces) |
| trajectory_assessment | VEC-04 TRAJECTORY | — (GAP) |
| decision_surface | VEC-07 DECISION | VEC-03 PRESSURE (severity) |
| absence_profile | VEC-03 PRESSURE | VEC-01 GOVERNANCE (classification) |
| detection_boundary | VEC-01 GOVERNANCE | VEC-02 STRUCTURE (measurement methods) |
| operational_ceiling | VEC-06 IMPACT | VEC-01 GOVERNANCE (authority), VEC-03 PRESSURE (ceiling drivers) |

**Finding:** Cognition objects are NOT 1:1 with vectors. They are COMPOSITIONS. This is architecturally correct — a cognition object assembles cognitive output from multiple vectors into a coherent L4 artifact.

### 4.3 The Missing PICR Layer

The consumption baseline map (PI.PICP-CONSUMPTION-BASELINE-MAP.01) defines the PICR materializer architecture:

| Tier | Objects | Work Required |
|---|---|---|
| T1: Assembly only | structural_posture, tension_map, constraint_inventory, exposure_assessment | Read existing data, assemble into object schema. ~30-50 LOC each. |
| T2: Assembly + vocabulary | trajectory_assessment, absence_profile, operational_ceiling | Assembly + vocabulary additions. |
| T3: Vocabulary authoring | detection_boundary | Author TRADITIONAL_DETECTABILITY per condition type. Static. |
| T4: Rule formalization | decision_surface | Formalize effort_scope classification rules. |

The PICR materializers are the ACTUAL bridge mechanism between the production pipeline and the PICP cognition objects. They perform the final step: collecting scattered production outputs into named, typed L4 artifacts.

```
VECTORS → PRODUCTION PIPELINE → [PICR MATERIALIZERS] → COGNITION OBJECTS
           (existing, operational)  (to be formalized)   (defined, not yet materialized)
```

The materializers are thin (~30-80 LOC each) because LENS already produces the cognition — PICR formalizes it.

---

## 5. Where the 22 Functions Actually Live

### 5.1 Architectural Position

The 22 functions live at L5 — Projection Rendering Engine (PRE) — not at L4 (PICR). They are consumer-side orchestration for the BALANCED persona.

```
L0-L3: CIP (Evidence → Conditions → Consequences → Ontology)
  ↓
L4: PICR → PICP (materializers assemble cognition objects)
  ↓
L5: PRE (22 functions live HERE — BALANCED projection orchestration)
  ↓
CONSUMER: BALANCED persona rendering
```

**Evidence:**
- All 22 functions were discovered by forensically decomposing the BALANCED persona surface (PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01)
- The stratum decomposition classifies them as AGENTIC (29%), PI CORE (33%), GOVERNED REPLAY (18%), SQO (11%), MODULE (9%) — but these strata describe the CONTENT they handle, not their architectural position
- Their architectural position is uniformly L5: they take production pipeline outputs and orchestrate persona presentation
- Removing them would not break production; it would break BALANCED rendering

### 5.2 Function Role Classification

| Classification | Count | Functions | Architectural Role |
|---|---|---|---|
| **Orchestration** | 3 | #1 Emergence Orchestration, #2 Cognitive Priority Router, #3 Emergence Dashboard | Manage which cognitive outputs get presented and in what order. Pure L5 orchestration. |
| **Synthesis** | 4 | #4 Executive Synthesis, #5 Posture Synthesis, #6 Trust Posture Synthesis, #7 Compound Activation | Compress multi-source production outputs into consumable form. L5 cognitive compression. |
| **Sentinel Detection** | 5 | #8 Grounding Asymmetry, #9 Pressure Concentration, #10 Propagation Chain, #11 Compression, #12 Governance Friction | Monitor production pipeline outputs and ACTIVATE when thresholds are crossed. L5 activation logic. |
| **Interpretation** | 3 | #13 Signal Interpretation, #14 Evidence Boundary Qualification, #15 Spatial Anchor Resolution | Add meaning or reframe pipeline outputs. L5 meaning-making. |
| **Tracking/Advisory** | 7 | #16 Temporal Cognition, #17 Guided Cognition, #18 Interrogation Trail, #19 Confidence Classification, #20 Blockage Detection, #21 Debt Evolution, #22 Authority Mode Router | Track state, advise operator, route governance. L5 advisory. |

### 5.3 Exceptions: Functions That Produce Cognition

Three functions perform cognitive acts that go beyond orchestration/monitoring/routing:

**Exception 1: Evidence Boundary Qualification (#14)**
- Takes: raw counts (grounded, total, ungrounded)
- Produces: constitutional reframing — "confirmed knowledge vs confirmed unknowns"
- This reframing IS a cognitive act. The production pipeline counts; this function interprets the count's MEANING for the operator
- Classification: PI CORE stratum, but expressed at L5
- Bridge candidacy: YES — this function produces output not present in the pipeline

**Exception 2: Compound Activation Agent (#7)**
- Takes: multiple active conditions
- Produces: emergent meaning ("systemic structural stress rather than isolated conditions")
- SignalSynthesisEngine detects co-occurrence (ruleCompoundConvergence). Compound Activation produces the MEANING of co-occurrence — qualitatively different from individual signal meanings
- Classification: AGENTIC stratum, L5 position
- Bridge candidacy: PARTIAL — SSE already produces COMPOUND_CONVERGENCE conditions; this function adds narrative meaning

**Exception 3: Executive Synthesis Agent (#4)**
- Takes: posture + topology + signals
- Produces: lead interpretive paragraph composing multiple inputs
- This is the highest-level cognitive compression in BALANCED
- Classification: AGENTIC stratum, L5 position
- Bridge candidacy: NO — this is L5 projection (narrative rendering), not L4 formation

### 5.4 The Classification Test

**If we removed the 22 functions, what would break?**

| Layer | Impact |
|---|---|
| L0-L3 (CIP) | Nothing — production pipeline unaffected |
| L4 (PICR/PICP) | Nothing — materializers read pipeline outputs, not function outputs |
| L5 (PRE) | BALANCED persona rendering breaks — no orchestration, no sentinels, no narrative composition |
| Consumer | BALANCED persona is blank — no cognitive surface |

**Conclusion:** The 22 functions are essential for BALANCED persona projection. They are NOT essential for cognition FORMATION. This places them firmly at L5, not as a bridge between vectors and objects.

---

## 6. Contradictions

### 6.1 — The 22 functions are LENS-specific

The 22 functions were discovered through BALANCED persona forensics. BOARDROOM has different orchestration (forBoardroom() produces cognition_slices, consequence_themes, posture_label — different compression patterns). DENSE has no narrative orchestration (direct topology rendering). OPERATOR has operational-level data access.

If the 22 functions were the bridge, they would be universal. They are not — they are BALANCED-persona-specific orchestration. Other personas would require different function inventories.

### 6.2 — Functions #1-3 are meta-cognitive, not bridge elements

Emergence Orchestration Engine (#1), Cognitive Priority Router (#2), and Emergence Dashboard (#3) manage OTHER functions. They do not produce cognition, do not map to vectors, and do not map to objects. They are infrastructure for the BALANCED surface — not bridge elements.

### 6.3 — Sentinel functions do not produce — they activate

Functions #8-12 (five sentinels) monitor production pipeline outputs and fire when thresholds are crossed. They do not PRODUCE pressure detection — SignalSynthesisEngine does. They REACT to pressure detection. Sentinels are consumer-level activation logic, not production mechanisms.

### 6.4 — The function count does not match either side

7 vectors → 22 functions → 9 objects. The ratios (7:22:9) are incommensurate. If functions were the bridge, we would expect either:
- 7 functions bridging 7 vectors to 9 objects (one per vector, some serving multiple objects)
- 9 functions bridging 7 vectors to 9 objects (one per object, some consuming multiple vectors)
- Some multiple that maps cleanly

22 includes 3 meta-functions, 5 sentinels, 7 tracking/advisory functions — overhead that a bridge would not carry. The actual production mechanisms number ~35 (10 rule engines + 11 mappers + 19 ontology nodes + confidence hierarchy + prohibition validator) — a different decomposition entirely.

### 6.5 — The production pipeline predates the function discovery

The production pipeline (SSE, CC, CognitionOntology, PIContextAssembler) was built as operational code. The 22 functions were DISCOVERED through forensic decomposition of BALANCED. The pipeline was not designed to express functions, and the functions were not designed to bridge vectors to objects. Both are independently-evolved structures.

### 6.6 — Evidence Boundary Qualification produces cognition but at L5

Function #14 (Evidence Boundary Qualification) genuinely produces new cognitive output — it reframes counts as constitutional knowledge boundaries. But it does this at L5 (persona rendering), not at L4 (cognition formation). The PICP cognition objects do not have a field called "knowledge boundary reframing." If this function's output were materialized as a cognition object field, it would need to be extracted from BALANCED and placed in the PICR materializer. This suggests some L5 functions contain latent L4 cognition that belongs in the production pipeline but was discovered at the consumer layer.

### 6.7 — The 10+1 SSE rules are a different decomposition than the 22 functions

| SSE Rule | Vector | Nearest Function |
|---|---|---|
| ruleDeliveryPressureConcentration | PRESSURE | #9 Pressure Concentration Detection |
| ruleDependencyChokePoint | PRESSURE | (no dedicated function) |
| rulePropagationAsymmetry | PRESSURE | #10 Propagation Chain Detection |
| ruleStructuralMassConcentration | PRESSURE | (no dedicated function) |
| ruleCrossDomainCouplingPressure | PRESSURE | (no dedicated function) |
| ruleExecutionFragility | PRESSURE | (no dedicated function) |
| ruleExecutionConstriction | PRESSURE | (no dedicated function) |
| ruleStructuralBoundaryDivergence | PRESSURE | (no dedicated function) |
| ruleCouplingInertia | PRESSURE | (no dedicated function) |
| ruleGovernanceCoverageStatus | GOVERNANCE | (no dedicated function) |
| ruleCompoundConvergence | PRESSURE (composite) | #7 Compound Activation Agent |

Only 3 of 11 SSE rules have corresponding functions. The other 8 rules produce conditions that the 22 functions CONSUME without specific function-level attention. This mismatch proves the production pipeline (rules) and consumer orchestration (functions) are DIFFERENT decompositions of the same cognitive space.

---

## 7. Verdict

### Assessment: C — The 22 cognitive functions are NOT the bridge

The 22 cognitive functions are consumer-level orchestration for the BALANCED persona, not the bridge between THORR vectors and PICP cognition objects.

### 7.1 What the 22 functions ARE

**7.1.1 — L5 projection orchestration for BALANCED persona**

The functions orchestrate how BALANCED presents cognition to the operator. They activate (sentinels), prioritize (routers), synthesize (compression agents), track (temporal/trail agents), and advise (guided cognition). These are all CONSUMER-SIDE acts.

**7.1.2 — Evidence that LENS IS governed cognitive orchestration**

The 22 functions prove that LENS is not a dashboard. It is a multi-agent cognitive surface where threshold-gated sentinels, priority routers, and synthesis agents collaborate to produce a governed operational cognition experience. This is architecturally significant — but it is L5 significance, not L4.

**7.1.3 — A specimen of what PRE does per consumer**

Each persona would have its own orchestration function inventory:
- BALANCED: 22 functions (the discovered set)
- BOARDROOM: a different set (forBoardroom's compression logic is different)
- DENSE: minimal orchestration (direct topology rendering)
- OPERATOR: operational-level functions
- INVESTIGATION: verification-level functions

The 22 functions are BALANCED's PRE implementation. PRE Zone B (governed narrative) uses these functions to produce audience-appropriate projection.

### 7.2 What the actual bridge IS

**7.2.1 — The production pipeline bridges vectors to production outputs**

```
VECTORS → PRODUCTION PIPELINE → production outputs (conditions, consequences, ontology)
```

The 10 SSE rule engines, 11 CC mappers, 19 ontology nodes, and governance hierarchies ARE the computational mechanisms that answer the vectors' cognitive questions. They exist as operational code, not as forensic classifications.

**7.2.2 — PICR materializers bridge production outputs to cognition objects**

```
production outputs → PICR MATERIALIZERS → PICP cognition objects
```

The materializers (not yet formalized, ~30-80 LOC each per consumption baseline map) are the final assembly step. They collect scattered production outputs into named, typed L4 artifacts.

**7.2.3 — The complete chain**

```
THORR VECTORS                    PRODUCTION PIPELINE              PICR                     PICP
(cognitive questions)            (L0-L3: CIP)                     (L4: formalization)      (L4: package)
                                                                                               ↓
                                                                                           PRE (L5)
                                                                                               ↓
                                                                                  22 functions (BALANCED)
                                                                                  N functions (BOARDROOM)
                                                                                  M functions (DENSE)
                                                                                               ↓
                                                                                           CONSUMER
```

### 7.3 Latent L4 cognition in L5

**Three functions contain cognition that arguably belongs at L4:**

| Function | Cognitive Act | Current Layer | Should Be |
|---|---|---|---|
| #14 Evidence Boundary Qualification | Reframes counts as knowledge boundaries | L5 (BALANCED rendering) | L4 — belongs in structural_posture or a dedicated cognition object |
| #7 Compound Activation Agent | Synthesizes emergent meaning from co-activation | L5 (BALANCED rendering) | L4 — the meaning synthesis is richer than SSE's COMPOUND_CONVERGENCE detection |
| #5 Posture Synthesis | Compresses band + posture + qualifier → readiness state | L5 (BALANCED rendering) | L4 — readiness compression is consumer-independent |

This confirms the consumption baseline map finding: "The PICP architecture doesn't need to BUILD cognition. It needs to FORMALIZE the cognition that LENS already produces." Some of what LENS produces at L5 is actually L4 cognition that was discovered at the consumer layer because no L4 formalization existed.

**Implication for PICR materializers:** When materializers are built, they should incorporate the cognitive logic currently embedded in these three functions. The functions then become CONSUMERS of materialized objects rather than PRODUCERS of latent cognition.

### 7.4 The relationship between all four inventories

| Inventory | Count | Layer | Role |
|---|---|---|---|
| THORR Cognition Vectors | 7 | Constitutional | Domain-neutral cognitive QUESTIONS |
| Production Pipeline Mechanisms | ~35 | L0-L3 (CIP) | Computational ANSWERS — deterministic |
| PICP Cognition Objects | 9 | L4 | Formalized ARTIFACTS — portable, diffable |
| Cognitive Functions (BALANCED) | 22 | L5 | Consumer ORCHESTRATION — persona-specific |

These are NOT four representations of the same thing. They are four LAYERS, each with its own decomposition logic:

- **Vectors** decompose by cognitive QUESTION (7 fundamental questions)
- **Pipeline mechanisms** decompose by computational TECHNIQUE (rule engines, mappers, ontology nodes)
- **Cognition objects** decompose by cognitive ANSWER (what the system determined)
- **Functions** decompose by consumer NEED (what the persona requires for presentation)

The fact that these four inventories have different counts (7, ~35, 9, 22) and different decomposition logic PROVES they are different layers, not four views of one bridge.

### 7.5 Architectural implication

The bridge between vectors and objects is not a single discoverable layer. It is the production pipeline — a set of ~35 computational mechanisms that deterministically transform evidence into conditions, consequences, and ontology classifications. The PICR materializers will formalize these scattered outputs into 9 named cognition objects. The 22 cognitive functions will then consume those objects (instead of consuming raw pipeline outputs) and orchestrate persona-specific projection.

This is the consumer-generic cognition consumption architecture described in the PICP/PICR/PRE model:

```
CIP (production) → PICR (formalization) → PICP (packaging) → PRE (projection) → Consumer
```

The 22 functions belong in PRE. The bridge belongs in PICR. The vectors are constitutional questions that the CIP answers.

---

## Governance

This artifact is a forensic investigation. It maps evidence across four existing artifact inventories (vectors, functions, objects, pipeline mechanisms) and determines their architectural relationship.

**What belongs here:** Cross-artifact mapping, architectural position analysis, bridge hypothesis testing.

**What does not belong here:** Implementation plans, pipeline modifications, function refactoring, registry updates.

**Relationship to prior investigations:**
- PI.COGNITIVE-PRIMITIVES.FORENSIC-INVESTIGATION.01 — this investigation CONSUMES the function→primitive mapping (§3) and the maturity assessment (§4). It EXTENDS the analysis by adding the production pipeline and cognition objects as additional mapping targets.
- PI.COGNITIVE-PRIMITIVES.FORENSIC-INVESTIGATION.02 — capsule supersession is orthogonal. The capsule investigation addressed identity; this investigation addresses position.
- PI.PICP-CONSUMPTION-BASELINE-MAP.01 — this investigation CONFIRMS the baseline map finding that "PICP doesn't need to BUILD cognition — it needs to FORMALIZE the cognition LENS already produces."
- PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01 — the source of the 22 functions. This investigation determines their architectural position relative to the production pipeline and cognition objects.
