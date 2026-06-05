# Cognitive Primitives Forensic Investigation

**Stream:** PI.COGNITIVE-PRIMITIVES.FORENSIC-INVESTIGATION.01
**Classification:** G2 — Architecture-Consuming
**Date:** 2026-06-03
**Discovery instrument:** THORR governed interrogation + PI Core forensic audit
**Status:** FORENSIC ARTIFACT — not doctrine

---

## 1. Hypothesis

### Statement

A constitutional layer of **cognitive primitives** exists between PI Core (computation engine) and Domain Modules (commercial compositions):

```
Evidence Substrate
    ↓
PI Core Functions
    ↓
Cognitive Primitives        ← hypothesized layer
    ↓
Domain Modules
    ↓
Persona Projections
```

### Classification: HYPOTHESIS

This investigation determines whether the evidence supports, partially supports, rejects, or is insufficient to evaluate this architectural claim.

### What "confirmed" would mean

The primitive layer is confirmed if and only if:

1. Distinct cognitive primitives can be traced to specific PI Core functions
2. Each primitive produces outputs that are not reducible to another primitive's outputs
3. Domain Modules demonstrably consume these primitives without introducing new ones
4. Persona Projections operate on primitive outputs, not on PI Core functions directly
5. The primitive layer has a constitutional identity independent of both PI Core mechanisms and Domain Module compositions

### What "rejected" would mean

The primitive layer is rejected if:

1. Primitives are merely observer classifications of PI Core outputs, with no runtime or constitutional independence
2. Domain Modules require genuinely new cognition not present in PI Core
3. The alleged primitives collapse into fewer distinct cognitive acts under pressure
4. No boundary can be drawn between "PI Core function" and "primitive" that survives interrogation

---

## 2. Evidence Inventory

### 2.1 VEC-01 GOVERNANCE — "Can this conclusion be trusted?"

**Supporting functions (from 22 cognitive functions):**

| # | Function | Stratum | Evidence |
|---|----------|---------|----------|
| 14 | Evidence Boundary Qualification | PI CORE | Reframes raw counts as confirmed knowledge vs confirmed unknowns |
| 19 | Confidence Classification | AGENTIC | Compresses per-domain confidence into tiered posture |
| 22 | Authority Mode Router | AGENTIC | Declares correct governance authority from emergence state |
| 12 | Governance Friction Detection | GOVERNED REPLAY | Activates when governance lifecycle reveals friction |

**Supporting artifacts:**

| Artifact | Location | Evidence Type |
|----------|----------|---------------|
| ProhibitionValidator.js | app/execlens-demo/lib/copilot/ProhibitionValidator.js (192 LOC) | 13 absolute prohibitions + context honesty enforcement |
| PIContextAssembler.js | app/execlens-demo/lib/copilot/PIContextAssembler.js (576 LOC) | Confidence hierarchy: GOVERNED / ADVISORY_BOUND / STRUCTURAL_ONLY |
| ConsequenceCompiler.js | app/execlens-demo/lib/lens-v2/software-intelligence/ConsequenceCompiler.js (1,158 LOC) | Confidence floor propagation: MIN(source_classifications) |
| CognitionOntology.js | app/execlens-demo/lib/lens-v2/software-intelligence/CognitionOntology.js (700 LOC) | governance_boundary field per condition node |
| SQO state machine | Multiple files | S-level authority ceiling enforcement |
| PIContextAssembler.js | Same as above | Access tier enforcement, knowledge boundary walls |

**Supporting outputs:**
- Confidence tier classification (GOVERNED / ADVISORY_BOUND / STRUCTURAL_ONLY)
- Prohibition validation results (PASS/FAIL with violation details)
- Context-level honesty enforcement (cannot claim specimen knowledge at L0)
- SQO authority ceiling (S-level gates what can be projected)
- Governance boundary per condition (determines escalation and containment)
- Access tier walls (CLIENT vs OPERATOR knowledge boundaries)

**Supporting specimens:**
- PID-002: Confidence not propagated to finding level
- PID-003: Combination confidence inherits ceiling not floor
- BlueEdge GENESIS specimen: Full governance pipeline operational

---

### 2.2 VEC-02 STRUCTURE — "What actually exists?"

**Supporting functions:**

| # | Function | Stratum | Evidence |
|---|----------|---------|----------|
| 15 | Spatial Anchor Resolution | AGENTIC | Cascaded resolution of pressure zone identity from topology |
| — | Not a single function | PI CORE | This IS PI Core — the entire graph construction pipeline |

**SW-Intel cognition functions (secondary evidence):**

| CF | Function | Status | Evidence |
|----|----------|--------|----------|
| CF-07 | Topology Role Abstraction | OPERATIONAL | semantic_domain_registry, structural_enrichment |
| CF-03 | Coordination Spine Detection | PARTIAL | By role label, not computed load |

**Supporting artifacts:**

| Artifact | Location | Evidence Type |
|----------|----------|---------------|
| SignalSynthesisEngine.js | app/execlens-demo/lib/lens-v2/SignalSynthesisEngine.js (1,441 LOC) | extractFeatures(), buildDomainResolver(), resolveDomainDisplay(), translateCentralityNode() |
| CognitionOntology.js | Same as above | 11 condition nodes define structural categories |
| PIContextAssembler.js | Same as above | formatStructuralTopology() serializes topology |
| 40.2→40.3→40.4 pipeline | scripts/pios/ | Upstream structural graph construction |

**Supporting outputs:**
- Structural topology (domains, clusters, dependency graph, coupling measurements)
- Centrality ranks and structural role classification
- Domain registry with display names and structural roles
- Pressure zone geometry
- Structural enrichment surfaces (fragility, constriction, boundary divergence, coupling inertia)

**Supporting specimens:**
- BlueEdge: 17 domains, 29 clusters, 2,138 files
- NetBox: Different topology, same pipeline

---

### 2.3 VEC-03 PRESSURE — "Where is stress accumulating?"

**Supporting functions:**

| # | Function | Stratum | Evidence |
|---|----------|---------|----------|
| 9 | Pressure Concentration Detection | AGENTIC | Multi-condition sentinel: signal count + severity + zone |
| 8 | Grounding Asymmetry Detection | AGENTIC | Monitors grounding ratio, activates at threshold |
| 11 | Compression Detection | AGENTIC | Monitors band-vs-ratio gap |

**SW-Intel cognition functions:**

| CF | Function | Status | Evidence |
|----|----------|--------|----------|
| CF-01 | Pressure Interpretation | PARTIAL | Inline, not pipeline-derived |
| CF-09 | Pressure-Aware Topology | OPERATIONAL | pressure_zone_state on SVG topology |

**Supporting artifacts:**

| Artifact | Location | Evidence Type |
|----------|----------|---------------|
| SignalSynthesisEngine.js | Same as above | 10 primitive rule engines producing conditions from signals |
| pressure_zone_state.json | Runtime artifact | Pressure zone derivation |
| Structural enrichment | Multiple compilers | fragility_surface, constriction_surface, coupling_inertia |

**10 primitive rule engines (the detection machinery):**

| Rule | Condition Produced | Input |
|------|-------------------|-------|
| ruleDeliveryPressureConcentration | DELIVERY_PRESSURE_CONCENTRATION | PSIG + pressure_zone_state |
| ruleDependencyChokePoint | DEPENDENCY_CHOKE_POINT | ISIG import graph |
| rulePropagationAsymmetry | PROPAGATION_ASYMMETRY | ISIG fan asymmetry |
| ruleStructuralMassConcentration | STRUCTURAL_MASS_CONCENTRATION | DPSIG cluster metrics |
| ruleCrossDomainCouplingPressure | CROSS_DOMAIN_COUPLING_PRESSURE | PSIG coupling |
| ruleExecutionFragility | EXECUTION_FRAGILITY | fragility_surface |
| ruleExecutionConstriction | EXECUTION_CONSTRICTION | constriction_surface |
| ruleStructuralBoundaryDivergence | STRUCTURAL_BOUNDARY_DIVERGENCE | boundary_divergence |
| ruleCouplingInertia | COUPLING_INERTIA | coupling_inertia clusters |
| ruleGovernanceCoverageStatus | GOVERNANCE_COVERAGE_STATUS | domain anchoring |

**Composite rule:**
- ruleCompoundConvergence → COMPOUND_CONVERGENCE (fires when ≥3 non-nominal primitives target same domain, escalates severity)

**Supporting outputs:**
- Conditions with severity classification (NOMINAL / ELEVATED / HIGH / CRITICAL)
- Topology overlays with emphasis/dim domains
- Compound convergence detection with severity escalation
- Guided interventions per condition (INSPECT / TRACE / COMPARE / QUALIFY / DECOMPOSE)

**Supporting specimens:**
- PID-004: Structural absence not surfaced — pressure detection missed Fleet Operations because zero-evidence domains were not flagged

---

### 2.4 VEC-04 TRAJECTORY — "What is changing?"

**Supporting functions:**

| # | Function | Stratum | Evidence |
|---|----------|---------|----------|
| 16 | Temporal Cognition Agent | SQO | Tracks confidence evolution across epochs |
| 21 | Debt Evolution Tracker | SQO | Reports debt trajectory after enrichment |

**Supporting artifacts:**

| Artifact | Location | Evidence Type |
|----------|----------|---------------|
| temporal_marker field | On every consequence object | **Universally null** — infrastructure designed, not activated |
| EXSIG/TIMSIG vocabulary | Signal Family Taxonomy | **Zero producers** — signal families declared, no implementation |
| trajectoryAssessment.js | app/execlens-demo/lib/lens-v2/ | **PSEUDO-TEMPORAL** — static property lookup using trajectory language (PID-006) |
| ReconciliationTemporalAnalyticsCompiler.js | scripts/pios/ | **REAL TEMPORAL** — SQO domain only, reusable pattern |
| QualificationHistory.js | scripts/pios/ | **REAL TEMPORAL** — ledger pattern, SQO domain |
| compare_replay_runs.py | scripts/pios/ | Diff infrastructure — reusable |

**Supporting outputs:**
- NONE for structural domain
- SQO domain: qualification history, reconciliation analytics (proven temporal outputs, but domain-specific)

**Supporting specimens:**
- PID-006: Temporal claims from static evidence (boundary proven)
- PID-008: Program Director required future-state reasoning PI Core could not provide

---

### 2.5 VEC-05 TRANSFORMATION — "What must change?"

**Supporting functions:**

| # | Function | Stratum | Evidence |
|---|----------|---------|----------|
| 20 | Blockage Detection + Resolution Advisory | SQO | Identifies blockers, advises resolution |
| — | No dedicated orchestration function | — | Lower layers produce ingredients, no orchestrator exists |

**Supporting artifacts (lower layers — ingredients, not orchestration):**

| Artifact | Location | Evidence Type |
|----------|----------|---------------|
| SignalSynthesisEngine.js | Same as above | ruleExecutionConstriction() — bridge node detection (constraints) |
| ConsequenceCompiler.js | Same as above | DEL_EXP consequence — execution/delivery ceiling detection |
| ConsequenceCompiler.js | Same as above | Dependency qualification, constriction detection |
| SQO state machine | Multiple files | Blocker detection and resolution workflow |

**Supporting outputs:**
- Constraint identification (exists — from PRESSURE)
- Execution ceiling detection (exists — DEL_EXP consequence from IMPACT)
- Blocker detection (exists — from SQO)
- Constriction points (exists — from PRESSURE)

**Missing:**
- No prerequisite chain computation
- No readiness model
- No intervention sequencing
- No orchestration function composing ingredients into transformation assessment

**Supporting specimens:**
- PID-008 (indirect): Program Director needed decision inputs PI Core couldn't provide

---

### 2.6 VEC-06 IMPACT — "Why does this matter?"

**Supporting functions:**

| # | Function | Stratum | Evidence |
|---|----------|---------|----------|
| 4 | Executive Synthesis Agent | AGENTIC | Composes lead paragraph from posture + topology + signals |
| 7 | Compound Activation Agent | AGENTIC | Detects multi-signal co-activation, synthesizes emergent meaning |
| 13 | Signal Interpretation Agent | AGENTIC | Per-signal meaning-in-context |

**Supporting artifacts:**

| Artifact | Location | Evidence Type |
|----------|----------|---------------|
| ConsequenceCompiler.js | Same as above (1,158 LOC) | THE impact production engine — entire file |
| CognitionOntology.js | Same as above | why_it_matters, operational_implication per node |

**Production machinery within ConsequenceCompiler.js:**
- 11 condition→consequence mappers (mapDPC, mapDCkP, mapPA, mapSMC, mapCDCP, mapEF, mapEC, mapSBD, mapCI, mapGCS, mapCC)
- 8 atomic consequence types (COORD_FRAG, DEP_AMP, DEL_EXP, OP_BOTTLENECK, RESIL_DEF, GOV_GAP, PROP_EXP, STAB_RISK)
- 3 combination patterns (AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL, SYSTEMIC_OP_FRAG)
- 5 risk classes (A-E) with behavioral classification
- 3-layer vocabulary (engine, structural, operator)

**Supporting outputs:**
- Consequences with severity / confidence / scope
- Combination detection with severity escalation
- Risk classification per domain (gravity_well, fragile_compound, pressure_concentration, etc.)
- Domain concentration analysis
- Executive synthesis and reinforcement flow

**Supporting specimens:**
- PID-007: Two risk zones at different evidence depths presented with equivalent weight — impact framing lacked depth asymmetry

---

### 2.7 VEC-07 DECISION — "What action becomes possible?"

**Supporting functions:**

| # | Function | Stratum | Evidence |
|---|----------|---------|----------|
| 17 | Guided Cognition Agent | AGENTIC | Directed interrogation paths based on structural state |
| 18 | Interrogation Trail Agent | AGENTIC | Tracks operator exploration path, produces evidence record |
| 20 | Blockage Detection + Resolution Advisory | SQO | Blockers + resolution advisory |

**Supporting artifacts:**

| Artifact | Location | Evidence Type |
|----------|----------|---------------|
| SignalSynthesisEngine.js | Same as above | guided_interventions per condition: INSPECT / TRACE / COMPARE / QUALIFY / DECOMPOSE |
| ModeOrchestrator.js | app/execlens-demo/lib/copilot/ModeOrchestrator.js (135 LOC) | 9 transformation modes |
| ConsequenceCompiler.js | Same as above | Altitude translation: forBoardroom(), forBalanced(), forOperator(), forInvestigation() |
| 13 absolute prohibitions | ProhibitionValidator.js | PREVENT prescriptive action (constitutionally correct) |

**Supporting outputs:**
- Guided interventions per condition (5 action types)
- Transformation modes per intent (9 modes)
- Altitude-appropriate projections (same evidence at different decision altitudes)
- NO prescriptive output (constitutionally prohibited)

**Supporting specimens:**
- PID-008: Program Director needed decision inputs PI Core couldn't provide — budget, planning, capacity decisions

---

## 3. Function → Primitive Mapping

### 3.1 Full Mapping

The 22 cognitive functions mapped against the 7 discovered primitives. For each function: which primitive(s) it contributes to, with confidence assessment.

| # | Function | Stratum | Primary Primitive | Secondary | Confidence | Evidence |
|---|----------|---------|-------------------|-----------|------------|----------|
| 1 | Emergence Orchestration Engine | AGENTIC | — (meta) | — | N/A | Orchestrates OTHER functions — not a primitive producer |
| 2 | Cognitive Priority Router | AGENTIC | — (meta) | — | N/A | Assigns weight to outputs — routing, not production |
| 3 | Emergence Dashboard | AGENTIC | — (meta) | — | N/A | Monitors activation state — observational |
| 4 | Executive Synthesis Agent | AGENTIC | IMPACT | GOVERNANCE | MEDIUM | Composes posture + topology + signals → lead paragraph. Primary product is impact narrative. Governance through confidence envelope. |
| 5 | Posture Synthesis | AGENTIC | GOVERNANCE | STRUCTURE | MEDIUM | Combines band + posture + qualifier → readiness. Is this GOVERNANCE or a projection of STRUCTURE? |
| 6 | Trust Posture Synthesis | AGENTIC | GOVERNANCE | — | HIGH | S-state + grounding + maturity → trust. Clearly trust assessment. |
| 7 | Compound Activation Agent | AGENTIC | IMPACT | PRESSURE | MEDIUM | Multi-signal co-activation → emergent meaning. Produces IMPACT from PRESSURE inputs. |
| 8 | Grounding Asymmetry Detection | AGENTIC | PRESSURE | GOVERNANCE | MEDIUM | Monitors grounding ratio. Is this PRESSURE (stress detection) or GOVERNANCE (evidence quality)? |
| 9 | Pressure Concentration Detection | AGENTIC | PRESSURE | — | HIGH | Multi-condition sentinel. Clearly pressure detection. |
| 10 | Propagation Chain Detection | AGENTIC | PRESSURE | STRUCTURE | MEDIUM | ORIGIN→PASS_THROUGH→RECEIVER. Structural relationship under pressure. |
| 11 | Compression Detection | AGENTIC | PRESSURE | — | HIGH | Band-vs-ratio gap monitoring. Stress accumulation. |
| 12 | Governance Friction Detection | GOVERNED REPLAY | GOVERNANCE | — | HIGH | Governance lifecycle friction. Clearly trust assessment. |
| 13 | Signal Interpretation Agent | AGENTIC | IMPACT | — | MEDIUM | Per-signal meaning-in-context. Is this IMPACT or STRUCTURE? |
| 14 | Evidence Boundary Qualification | PI CORE | GOVERNANCE | — | HIGH | Confirmed knowledge vs confirmed unknowns. Core governance act. |
| 15 | Spatial Anchor Resolution | AGENTIC | STRUCTURE | PRESSURE | HIGH | Cascaded zone identity resolution. Structural truth. |
| 16 | Temporal Cognition Agent | SQO | TRAJECTORY | — | LOW | Named but not activated for structural domain. SQO only. |
| 17 | Guided Cognition Agent | AGENTIC | DECISION | — | LOW | Directed interrogation paths. But: is this a primitive or a projection? |
| 18 | Interrogation Trail Agent | AGENTIC | DECISION | — | LOW | Tracks exploration. Consumer-level, not cognition-level. |
| 19 | Confidence Classification | AGENTIC | GOVERNANCE | — | HIGH | Per-domain confidence → tiered posture. Trust assessment. |
| 20 | Blockage Detection + Resolution Advisory | SQO | TRANSFORMATION | DECISION | LOW | Identifies blockers. But: is blockage detection its own primitive or a PRESSURE output consumed by DECISION? |
| 21 | Debt Evolution Tracker | SQO | TRAJECTORY | — | LOW | Debt trajectory after enrichment. Named but SQO-specific. |
| 22 | Authority Mode Router | AGENTIC | GOVERNANCE | — | HIGH | Declares governance authority. Trust assessment. |

### 3.2 Function Distribution Summary

| Primitive | Functions (primary) | Functions (secondary) | HIGH confidence | MEDIUM confidence | LOW confidence |
|-----------|--------------------|-----------------------|-----------------|--------------------|----|
| GOVERNANCE | 5, 6, 12, 14, 19, 22 | 4, 8 | 5 (6, 12, 14, 19, 22) | 2 (5, 8) | 0 |
| STRUCTURE | 15 | 5, 10 | 1 (15) | 2 (5, 10) | 0 |
| PRESSURE | 8, 9, 10, 11 | 7, 15 | 2 (9, 11) | 2 (8, 10) | 0 |
| TRAJECTORY | 16, 21 | — | 0 | 0 | 2 (16, 21) |
| TRANSFORMATION | 20 | — | 0 | 0 | 1 (20) |
| IMPACT | 4, 7, 13 | — | 0 | 3 (4, 7, 13) | 0 |
| DECISION | 17, 18 | 20 | 0 | 0 | 2 (17, 18) |
| Meta (not primitive-producing) | 1, 2, 3 | — | N/A | N/A | N/A |

### 3.3 Critical Observations

**3.3.1 — Asymmetric evidence depth.** GOVERNANCE has 6 primary functions with 5 at HIGH confidence. DECISION has 2 primary functions, both at LOW. The primitives are not equally evidenced.

**3.3.2 — STRUCTURE has only 1 primary function.** STRUCTURE is claimed as "the foundation" but only one cognitive function (#15 Spatial Anchor Resolution) maps to it with HIGH confidence. The reason: STRUCTURE is not produced by cognitive functions — it IS PI Core. The cognitive functions CONSUME structure. This has implications for whether STRUCTURE is a "primitive produced by PI Core" or "PI Core itself."

**3.3.3 — Meta functions exist.** Functions 1-3 (Emergence Orchestration, Cognitive Priority, Emergence Dashboard) do not produce any primitive. They orchestrate and monitor. This means the 22 functions are not all primitive producers — some are infrastructure.

**3.3.4 — Boundary ambiguity.** Several functions have dual-primitive assignment with MEDIUM confidence (4, 5, 7, 8, 10, 13). This means the primitives are not sharply separated in production — some functions produce outputs that serve two primitives simultaneously.

**3.3.5 — LOW confidence cluster.** TRAJECTORY, TRANSFORMATION, and DECISION all have exclusively LOW confidence mappings. These three may not be distinct primitives — they may be aspirational categories applied to weak or absent production evidence.

---

## 4. Primitive Maturity Assessment

### Lifecycle definitions

| State | Meaning | Evidence requirement |
|-------|---------|---------------------|
| DISCOVERED | Evidence found that this cognitive act occurs | At least one function + one output identified |
| HYPOTHESIZED | Cognitive act suspected but not distinctly proven | Named but production chain incomplete or boundary unclear |
| SUPPORTED | Evidence supports distinct primitive status | Multiple functions, multiple outputs, operational in at least one specimen |
| VALIDATED | Operationally demonstrated as distinct | Production chain complete, boundary proven through interrogation, distinct outputs |
| CANONICAL | Formally recognized for constitutional standing | Governance review complete, stable under pressure |

### Assessment

| Primitive | State | Justification |
|-----------|-------|---------------|
| VEC-01 GOVERNANCE | **VALIDATED** | 6 primary functions, 5 at HIGH confidence. 5+ code artifacts operational. Production chain complete: functions → computations → outputs → enforcement. Multiple domain specimens (code graph, SQO). Boundary proven: PID-002, PID-003. The confidence hierarchy, prohibition enforcement, and authority ceiling are distinct cognitive acts not reducible to other primitives. |
| VEC-02 STRUCTURE | **VALIDATED** | Foundation primitive. Only 1 cognitive function maps directly, BUT the entire PI Core pipeline IS structural computation. Every other primitive consumes structural outputs. Distinct by definition: "What exists?" is not "Can it be trusted?" or "Where is stress?" Boundary does not need interrogation — this IS the substrate. |
| VEC-03 PRESSURE | **SUPPORTED** | 4 primary functions, 2 at HIGH confidence. 10 rule engines operational. Strong production machinery. BUT: boundary with STRUCTURE is unclear. Pressure detection applies interpretation to structural data. Is the interpretation a separate cognitive act or a computation within the structural primitive? Evidence supports separation (pressure adds severity, compound activation, escalation — concepts absent from structure alone). Full VALIDATED requires boundary interrogation to prove pressure outputs cannot be derived from structural outputs alone. |
| VEC-06 IMPACT | **SUPPORTED** | 3 primary functions, all at MEDIUM confidence. ConsequenceCompiler (1,158 LOC) is substantial. BUT: IMPACT consumes PRESSURE outputs and translates them to business language. Is "why does this matter?" a distinct cognitive act from "where is stress accumulating?" Or is it the same cognition at executive altitude? Evidence supports separation: 3-layer vocabulary, combination patterns, risk classification are not present in PRESSURE. Full VALIDATED requires proof that IMPACT produces distinct outputs not derivable from PRESSURE outputs alone. |
| VEC-04 TRAJECTORY | **HYPOTHESIZED** | 2 functions named, both at LOW confidence. Infrastructure designed (temporal_marker, EXSIG/TIMSIG) but not activated. SQO has proven temporal pattern in a single domain. Production chain BROKEN: functions → (no computation) → (no output) for structural domain. Cannot be SUPPORTED until at least one producer exists outside SQO. |
| VEC-05 TRANSFORMATION | **HYPOTHESIZED** | 1 function (#20) at LOW confidence. Lower layers produce ingredients (constraints, ceilings, blockers) but no orchestration function composes them into transformation assessment. Ingredients exist BUT ingredients are outputs of OTHER primitives (PRESSURE and IMPACT). Until an orchestration function exists that produces transformation-specific outputs, this is a named gap, not a proven primitive. |
| VEC-07 DECISION | **HYPOTHESIZED** | 2 functions (17, 18) at LOW confidence. Guided interventions exist but follow from conditions (produced by PRESSURE). Mode orchestration exists but is consumer-level. Constitutional prohibition on prescriptive action means DECISION cannot produce its strongest implied output. May be a PROJECTION PROPERTY of all primitives rather than a primitive itself: every primitive can generate "what action becomes possible?" at its own level. |

---

## 5. Domain Module Challenge

### 5.1 Software Intelligence Decomposition

SW-Intel is the most mature specimen. If the primitive model is correct, SW-Intel should decompose entirely into primitive manifestations and compositions.

**9 SW-Intel capabilities mapped to primitives:**

| SW-Intel Capability | Tier | Primitive(s) | Classification | Evidence |
|---------------------|------|-------------|----------------|----------|
| PRESSURE_INTELLIGENCE | T1 | VEC-03 PRESSURE | Primitive manifestation | Pressure detection applied to code graph evidence. CF-01, CF-09. |
| SOFTWARE_TOPOLOGY_POSTURE | T1 | VEC-02 STRUCTURE | Primitive manifestation | Structural truth expressed as topology posture. CF-07. |
| SOFTWARE_QUALIFICATION_POSTURE | T1 | VEC-01 GOVERNANCE | Primitive manifestation | Qualification state as trust assessment. CF-06, CF-10. |
| COORDINATION_LOAD | T2 | VEC-02 + VEC-03 | Primitive composition | Structural relationships under pressure. CF-03. |
| CHANGE_PROPAGATION | T2 | VEC-02 + (VEC-04 partially) | Primitive manifestation | Propagation paths are structural. Temporal change is absent. CF-05, CF-02. |
| INTEGRATION_EXPOSURE | T2 | VEC-03 + VEC-06 | Primitive composition | Bridge exposure assessed for impact. CF-01, CF-03. |
| DELIVERY_FRAGILITY | T2 | VEC-03 + VEC-06 | Primitive composition | Composite consequence from pressure + impact convergence. Composite. |
| EXECUTION_CORRIDORS | T3 | VEC-02 + VEC-03 | Primitive composition | Critical structural paths under pressure. CF-02. |
| VALIDATION_COVERAGE | T3 | VEC-01 | Primitive manifestation | Governance applied to test coverage. CF-04. |

**Domain-specific additions (what SW-Intel adds beyond primitives):**

| Addition | Classification | New Cognition? |
|----------|---------------|----------------|
| Code-graph evidence substrate (file paths, import graphs, AST, clusters) | Evidence ingestion | NO |
| Software-specific naming (translateCentralityNode: /dto/, /hooks/, /api/client) | Domain vocabulary | NO |
| SQO operational integration (promotion workflow, guided actions) | Cross-domain workflow | NO — SQO is domain-neutral |
| Topology role cognition (structural roles → operational names) | Domain interpretation | MARGINAL — maps abstract roles to software-specific meaning |
| Pressure zone operational typing (software-specific pressure meaning) | Domain framing | MARGINAL — adds software vocabulary to pressure detection |

**Verdict on SW-Intel:**

9/9 capabilities decompose as primitive manifestations (4) or compositions (5). Domain-specific additions are evidence ingestion and vocabulary — not new cognition. Two items classified MARGINAL: topology role naming and pressure zone typing add software-specific meaning but do not introduce a cognitive act absent from PI Core.

**Assessment: SUPPORTS the primitive model.** SW-Intel does not introduce new cognitive primitives. It is existing primitives applied to code evidence with software vocabulary.

### 5.2 PMO Cognition Decomposition

PMO is the newest hypothesis. The forensic question: does PMO require genuinely new cognition?

| PMO Capability | Existing Primitive | Existing Function | New Cognition Required? | Evidence |
|----------------|-------------------|-------------------|------------------------|----------|
| Planning Evidence Qualification | VEC-01 GOVERNANCE | #14 Evidence Boundary Qualification, #19 Confidence Classification | **NO** — same qualification pattern, new substrate (Jira data quality) | Confidence hierarchy (GOVERNED / ADVISORY_BOUND / STRUCTURAL_ONLY) applies to any evidence substrate. Planning evidence needs the SAME governance discipline. |
| ART Dependency Mapping | VEC-02 STRUCTURE | Graph construction pipeline | **NO** — same graph construction, different inputs (ART relationships vs code imports) | Topology reconstruction is substrate-neutral. ART relationships are edges in a different graph. |
| Capacity Pressure Detection | VEC-03 PRESSURE | #9 Pressure Concentration Detection | **NO** — same multi-signal sentinel, different signals (capacity/velocity vs code signals) | Rule engines detect severity from threshold crossings. The detection mechanism is substrate-neutral. |
| Cross-ART Impact Assessment | VEC-06 IMPACT | #4, #7 Executive Synthesis, Compound Activation | **NO** — same consequence compilation, different consequence vocabulary | Consequence mapping rules (condition → consequence) are the same pattern with PMO-specific terms. |
| PI Planning Trajectory | VEC-04 TRAJECTORY | #16, #21 (not activated) | **NO** — same gap as structural domain | Temporal infrastructure not activated for ANY domain. Not a PMO-specific absence. |
| Program Transformation Readiness | VEC-05 TRANSFORMATION | #20 Blockage Detection | **NO** — same partial capability | Lower layers exist. Orchestration absent. Same gap as Core. |
| Program Decision Surface | VEC-07 DECISION | #17, #18 Guided Cognition, Interrogation Trail | **NO** — same guided intervention pattern | Decision surfaces bounded by evidence. Same constitutional constraint. |

**PMO-specific requirements (not new cognition):**

| Requirement | Classification |
|-------------|---------------|
| Jira evidence intake adapter | Evidence ingestion — not cognition |
| Planning signal family (PLSIG) | New signal family — not new cognition |
| PMO consequence vocabulary | Domain vocabulary — not new cognition |
| PMO containment rules | Domain-specific governance rules — not new cognition |
| Persona projections (Program Director, RTE, Portfolio Manager, Steering Committee) | New projection altitudes — not new cognition |
| Planning Evidence Qualification (data quality assessment) | **FOLLOWS EXISTING PATTERN** — same as code evidence qualification, new substrate |

**Verdict on PMO:**

7/7 capabilities map to existing primitives with zero new cognitive primitives required. What PMO requires is: new evidence substrate + new signal family + new consequence vocabulary + new persona projections + planning evidence qualification following existing governance pattern.

**Assessment: STRONGLY SUPPORTS the marketplace model.** PMO = existing primitives × planning evidence × PMO projection families. The ~900 LOC estimate and zero PI Core changes from the PMO Capability Matrix are consistent.

---

## 6. Contradictions

Evidence that weakens the hypothesis. No confirmation bias.

### 6.1 — STRUCTURE is not "produced" — it IS PI Core

STRUCTURE does not sit above PI Core as an intermediate output. It IS PI Core's computation. The entire pipeline (40.2→40.3→40.4→signal extraction→condition derivation) is structural computation. Only 1 of 22 cognitive functions maps to STRUCTURE as primary. This suggests STRUCTURE is not a primitive PRODUCED by PI Core — it is PI Core's foundational act. If the primitive layer sits ABOVE PI Core, STRUCTURE does not belong in it — it belongs in PI Core itself.

**Implication:** The primitive model may have only 6 candidates (or fewer), not 7. STRUCTURE may be the substrate that all other primitives consume, not a peer primitive.

### 6.2 — No runtime artifact called "primitive" exists

PI Core does not produce an intermediate artifact labeled "cognitive primitive." The runtime produces:
- Conditions (SignalSynthesisEngine output)
- Consequences (ConsequenceCompiler output)
- Confidence assessments (PIContextAssembler output)
- Prohibition validations (ProhibitionValidator output)

These outputs are grouped into primitives by the OBSERVER, not by the runtime. The PICP defines 9 cognition objects (L4) — not 7 primitives. The 7 primitives are a CLASSIFICATION SCHEME applied to the 22 functions and their outputs. No runtime component produces "a GOVERNANCE primitive" — it produces confidence hierarchies, prohibition validations, authority ceilings, etc.

**Implication:** The primitive layer may be CONCEPTUAL (useful for reasoning about architecture) without being COMPUTATIONAL (producing runtime artifacts). This weakens the claim of a distinct architectural layer. A conceptual framework is valuable — but it is not the same as a constitutional layer with runtime identity.

### 6.3 — IMPACT may not be distinct from PRESSURE

ConsequenceCompiler takes PRESSURE outputs (conditions) and translates them into business language (consequences). The 3-layer vocabulary (engine → structural → operator) is a translation, not a new cognitive act. Is "Coordination Fragility" (IMPACT) a distinct cognition from "Delivery Pressure Concentration" (PRESSURE)? Or is it the same observation expressed at a different altitude?

Counter-evidence: Combination patterns (AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL, SYSTEMIC_OP_FRAG) produce emergent consequences that no single condition produces alone. This IS a new cognitive act — combining conditions into composite impact. But: is combination detection IMPACT or PRESSURE? Compound convergence is detected by SignalSynthesisEngine (PRESSURE), not ConsequenceCompiler (IMPACT).

**Implication:** The boundary between PRESSURE and IMPACT is fuzzy. They may be one primitive viewed at different altitudes, or they may be two primitives with an unclear boundary. Evidence does not decisively resolve this.

### 6.4 — DECISION may be a projection property, not a primitive

Every primitive can answer "what action becomes possible?" at its own level:
- GOVERNANCE → "investigate evidence quality"
- STRUCTURE → "trace this dependency"
- PRESSURE → "inspect this pressure zone"
- IMPACT → "assess this consequence"

Guided interventions (INSPECT, TRACE, COMPARE, QUALIFY, DECOMPOSE) are attached to CONDITIONS (PRESSURE outputs), not to a separate DECISION computation. The 13 prohibitions on prescriptive action mean DECISION can never produce what its fundamental question implies — it can only suggest investigation directions.

**Implication:** DECISION may not be a separate cognitive act. It may be a projection property of all primitives — every primitive generates action possibilities as a side effect of its primary computation. If so, the primitive count drops to 6 or fewer.

### 6.5 — The 22 cognitive functions are LENS-specific

The 22 functions were discovered through LENS persona forensics (PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01). They describe how LENS orchestrates cognitive output for personas — they may not be universal PI Core cognitive functions. Functions like "Emergence Dashboard" (#3), "Cognitive Priority Router" (#2), and "Interrogation Trail Agent" (#18) are consumer-level orchestration, not PI Core cognition.

**Implication:** The function inventory is a LENS projection inventory, not necessarily a PI Core cognition inventory. Mapping LENS functions to primitives may produce a LENS-centric view that does not reflect PI Core's actual production chain.

### 6.6 — The primitive count is interrogation-dependent

The 7 primitives were discovered through a specific interrogation method (THORR multi-persona pressure testing). A different interrogation instrument might discover:
- Fewer primitives (if some collapse under pressure — e.g., PRESSURE + IMPACT → "STRESS AND CONSEQUENCES")
- More primitives (if finer granularity reveals sub-primitives — e.g., GOVERNANCE splits into CONFIDENCE and AUTHORITY)
- Different primitives (if non-LENS consumers produce different cognitive acts)

**Implication:** The current 7 may be partially an artifact of the discovery method. This is acknowledged by the design ("The vector count is emergent, not fixed") but still weakens any specific primitive as a constitutional entity.

### 6.7 — TRANSFORMATION ingredients come from other primitives

The lower layers that "partially" exist for TRANSFORMATION are:
- Constraint identification → from PRESSURE
- Execution ceiling detection → DEL_EXP → from IMPACT
- Blocker detection → from SQO (GOVERNANCE)
- Constriction points → from PRESSURE

All ingredients are outputs of OTHER primitives. TRANSFORMATION has no function that produces something the other primitives don't. The missing "orchestration layer" (prerequisite chains, readiness models, intervention sequencing) would be NEW cognition — but it doesn't exist yet.

**Implication:** TRANSFORMATION's PARTIAL status is based on the outputs of other primitives. It may not be a distinct primitive — it may be a COMPOSITION of PRESSURE + IMPACT + GOVERNANCE with a missing orchestration layer. If the orchestration layer is built and produces genuinely new outputs, TRANSFORMATION becomes a real primitive. Until then, it is a named gap.

---

## 7. Verdict

### Assessment: B — Primitive layer partially supported

The evidence supports a PARTIAL version of the hypothesis. The full 7-primitive constitutional layer is NOT confirmed. What the evidence DOES support:

### 7.1 What IS supported

**7.1.1 — Two primitives are VALIDATED:**

GOVERNANCE and STRUCTURE are distinct cognitive acts with strong evidence chains. GOVERNANCE produces trust assessments that STRUCTURE does not. STRUCTURE produces topological truth that GOVERNANCE does not. Neither is reducible to the other.

**7.1.2 — Two primitives are SUPPORTED:**

PRESSURE and IMPACT have strong operational machinery and produce distinct outputs. The boundary between them is unclear (§6.3) but evidence leans toward separation: combination patterns in IMPACT produce emergent consequences absent from PRESSURE.

**7.1.3 — The marketplace formula holds:**

Both domain module specimens (SW-Intel and PMO) decompose into existing cognitive acts applied to domain-specific evidence substrates. Neither requires genuinely new cognition. This is the strongest evidence FOR the primitive model — regardless of how many primitives exist, the formula `Domain Module = existing cognitive acts × evidence substrate × projection families` is validated by two independent specimens.

**7.1.4 — Domain Modules are NOT cognition creators:**

SW-Intel adds vocabulary and evidence ingestion, not cognitive acts. PMO would add the same. This separation (cognition is universal, modules route it through domain evidence) is strongly supported.

### 7.2 What is NOT supported

**7.2.1 — Three primitives are HYPOTHESIZED only:**

TRAJECTORY, TRANSFORMATION, and DECISION have insufficient evidence for SUPPORTED status. TRAJECTORY has designed infrastructure with zero activation. TRANSFORMATION has ingredients from other primitives with no orchestrator. DECISION may be a projection property, not a primitive.

**7.2.2 — The primitive layer as a distinct computational layer:**

No runtime artifact called "primitive" exists. The observer classifies PI Core outputs into primitives, but PI Core does not produce primitives as intermediate artifacts. The PICP defines 9 cognition objects — these are closer to the actual intermediate layer than the 7 primitives. The relationship between the 7 primitives and the 9 cognition objects needs investigation.

**7.2.3 — The exact primitive count:**

7 is the current discovery count. Evidence suggests the count may be lower (PRESSURE + IMPACT could merge; DECISION could dissolve into a projection property; STRUCTURE could be classified as substrate rather than peer primitive) or higher (future interrogation may reveal sub-primitives). The count is emergent.

### 7.3 Recommended next steps (forensic, not implementation)

1. **Boundary interrogation: PRESSURE vs IMPACT.** Design an interrogation that attempts to produce PRESSURE output without IMPACT output, and vice versa. If one always produces the other, they are one primitive.

2. **DECISION interrogation.** Design an interrogation that attempts to produce DECISION output that does NOT follow from another primitive's output. If DECISION always follows from PRESSURE or IMPACT, it is a projection property, not a primitive.

3. **Primitive-to-Cognition Object mapping.** Map the 7 discovered primitives against the 9 PICP cognition objects. Determine: are cognition objects materializations of primitives, or are they a different decomposition? If they are different, which decomposition has constitutional standing?

4. **Third domain specimen.** Apply the marketplace formula to a third domain (Security Intelligence or Architecture Intelligence). If it holds for 3/3 specimens, the formula is strongly validated regardless of the exact primitive count.

5. **Non-LENS function discovery.** Audit PI Core mechanisms that are NOT captured by the 22 LENS-derived cognitive functions. If significant cognition occurs outside LENS's view, the primitive mapping is incomplete.

### 7.4 Constitutional implication

The primitive model is a useful conceptual framework for reasoning about PI's cognitive architecture. It correctly identifies that Domain Modules do not create new cognition — they route existing cognitive acts through domain evidence. This insight is load-bearing for the marketplace formula.

However, the primitive model should NOT be canonized as a constitutional layer until:
- The boundary between all claimed primitives survives interrogation
- The relationship to the existing PICP cognition objects is resolved
- At least 3 domain module specimens validate the marketplace formula
- The exact set of primitives stabilizes under repeated discovery

**Classification of this verdict: FORENSIC — not doctrine. No registry, doctrine, or architectural update should be made based on this investigation alone.**

---

## Governance

This artifact is a forensic investigation. It records evidence, contradictions, and a conditional verdict.

**What belongs here:** Evidence mappings, contradiction analysis, maturity assessments, conditional verdicts.

**What does not belong here:** Implementation plans, registry updates, doctrine changes, architectural declarations.

**Relationship to other artifacts:**
- `PI_CAPSULE_REGISTRY.md` (now PI Cognition Vector Registry) — the registry should NOT be updated based on this investigation until the verdict advances beyond PARTIAL
- `PI.PMO-COGNITION-MODULE.01/PMO_COGNITION_CAPABILITY_MATRIX.md` — consumed as evidence source for §5.2
- `PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01/` — consumed as evidence source for §5.1
- `PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01/STRATUM_DECOMPOSITION.md` — source of the 22 cognitive functions
- `PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01/PERSONA_COGNITION_TOPOLOGY_MAP.md` — full persona function mapping
- `pi_discovery_specimens.json` — PID specimens referenced as evidence
