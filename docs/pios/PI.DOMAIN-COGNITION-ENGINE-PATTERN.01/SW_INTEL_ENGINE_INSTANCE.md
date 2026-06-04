# SW-INTEL ENGINE INSTANCE — Software Intelligence as Engine Pattern Specimen

Stream: PI.DOMAIN-COGNITION-ENGINE-PATTERN.01 | Classification: G1 | Branch: main

---

## 1. Purpose

Map the current Software Intelligence implementation into the VOCABULARY × RULES × ENGINE pattern. Every claim in this document is verified against committed code on BlueEdge genesis_e2e_03.

---

## 2. Implementation Map

### 2.1 Module-to-Concern Mapping

| File | Lines | Pattern Concern | Role |
|---|---|---|---|
| `CognitionOntology.js` | 1-260 | VOCABULARY — Condition Nodes | 11 condition type definitions with upstream/downstream graph |
| `CognitionOntology.js` | 262-458 | VOCABULARY — Consequence Nodes | 8 consequence type definitions with upstream/downstream graph |
| `CognitionOntology.js` | 460-525 | VOCABULARY — Combination Nodes | 3 combination pattern definitions |
| `CognitionOntology.js` | 527-597 | VOCABULARY — Rule Nodes | 2 rule governance nodes (§4, §5.2) |
| `CognitionOntology.js` | 674-687 | VOCABULARY — Ontology Classes | 5 classes (A-E) with class questions |
| `CognitionOntology.js` | 609-648 | ENGINE — Runtime merge | `resolveNode()` merges ontology + runtime state |
| `CognitionOntology.js` | 652-672 | ENGINE — Graph traversal | `resolveConnections()` resolves upstream/downstream |
| `SignalSynthesisEngine.js` | 4-101 | VOCABULARY — Condition vocabulary | 3-layer naming (internal/L2/L3) per condition type |
| `SignalSynthesisEngine.js` | 114-166 | VOCABULARY — Guided interventions | Per-condition-type operator actions |
| `SignalSynthesisEngine.js` | 168-233 | RULES — Feature extraction | `extractFeatures()` — signal → feature tags |
| `SignalSynthesisEngine.js` | 300-1258 | RULES — Condition synthesis | 10 primitive rule engines + 1 composite |
| `SignalSynthesisEngine.js` | 1326-1396 | ENGINE — Synthesis pipeline | `synthesize()` orchestrates all rules |
| `ConsequenceCompiler.js` | 16-83 | VOCABULARY — Consequence types | 11 consequence type vocabulary entries |
| `ConsequenceCompiler.js` | 211-332 | RULES — Consequence mapping | 11 map functions (condition → consequence[]) |
| `ConsequenceCompiler.js` | 150-207 | ENGINE — Atomic factory | `makeAtomic()` — shape assembly |
| `ConsequenceCompiler.js` | 336-372 | ENGINE — Deduplication | `deduplicateConsequences()` — domain-blind merge |
| `ConsequenceCompiler.js` | 380-456 | ENGINE — Combination factory | `makeCombination()` — evidence merge |
| `ConsequenceCompiler.js` | 458-501 | ENGINE — Combination detection | `detectCombinations()` — co-presence matching |
| `ConsequenceCompiler.js` | 529-580 | ENGINE — Compilation pipeline | `compile()` — map → dedup → combine → sort |
| `ConsequenceCompiler.js` | 602-650 | VOCABULARY — Cognition slices | Executive-facing names and localization |
| `ConsequenceCompiler.js` | 652-700 | VOCABULARY — Ontology + Risk shapes | 5 classes, 31 risk shape labels |
| `ConsequenceCompiler.js` | 717-760 | ENGINE — Narrative synthesis | `synthesizeBoardroomNarrative()` — cross-domain comparison |
| `ConsequenceCompiler.js` | 770-891 | ENGINE — Persona: BOARDROOM | `forBoardroom()` — cognitive compression |
| `ConsequenceCompiler.js` | 977-1080 | ENGINE — Persona: BALANCED | `forBalanced()` — causal narrative |
| `ConsequenceCompiler.js` | 1084-1109 | ENGINE — Persona: OPERATOR | `forOperator()` — evidence exposure |
| `ConsequenceCompiler.js` | 1113-1144 | ENGINE — Persona: INVESTIGATION | `forInvestigation()` — forensic substrate |

### 2.2 Concern Distribution

| Concern | Lines of Code | Percentage |
|---|---|---|
| VOCABULARY (static definitions, authored) | ~950 | ~29% |
| RULES (domain-specific transformation logic) | ~1150 | ~35% |
| ENGINE (domain-generic machinery) | ~1200 | ~36% |

Total: ~3300 lines across 3 files. The engine is roughly one-third of the codebase — comparable to vocabulary and rules combined.

---

## 3. SW-Intel VOCABULARY Inventory

### 3.1 Condition Types (11)

| ID | Ontology Class | Human Name | Downstream Consequences |
|---|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | B | Delivery pressure bottleneck | COORD_FRAG (defining), DEL_EXP (defining), OP_BOTTLENECK (conditional) |
| DEPENDENCY_CHOKE_POINT | B | Dependency choke point | DEP_AMP (defining), COORD_FRAG (conditional), OP_BOTTLENECK (conditional) |
| PROPAGATION_ASYMMETRY | A | Asymmetric change propagation | PROP_EXP (defining), DEL_EXP (conditional) |
| STRUCTURAL_MASS_CONCENTRATION | B | Structural mass concentration | RESIL_DEF (defining), STAB_RISK (conditional) |
| CROSS_DOMAIN_COUPLING_PRESSURE | D | Cross-boundary coupling | COORD_FRAG (defining), PROP_EXP (conditional) |
| EXECUTION_FRAGILITY | C | Execution fragility | RESIL_DEF (defining), COORD_FRAG (conditional), DEP_AMP (conditional) |
| EXECUTION_CONSTRICTION | A | Structural throughput bottleneck | OP_BOTTLENECK (defining), COORD_FRAG (conditional), DEP_AMP (conditional) |
| STRUCTURAL_BOUNDARY_DIVERGENCE | E | Structural boundary divergence | GOV_GAP (defining), COORD_FRAG (conditional), PROP_EXP (conditional) |
| COUPLING_INERTIA | D | Coupling inertia | COORD_FRAG (defining), OP_BOTTLENECK (conditional), DEP_AMP (conditional) |
| GOVERNANCE_COVERAGE_STATUS | — | Governance coverage gap | GOV_GAP (defining) |
| COMPOUND_CONVERGENCE | — | Multiple risk convergence | STAB_RISK (defining) |

### 3.2 Consequence Types (8)

| ID | Label | Scope | Upstream Condition Count |
|---|---|---|---|
| COORD_FRAG | Coordination brittleness | REGIONAL | 7 conditions can produce it |
| DEP_AMP | Dependency amplification | REGIONAL | 4 conditions can produce it |
| DEL_EXP | Delivery risk exposure | REGIONAL | 2 conditions can produce it |
| OP_BOTTLENECK | Operational bottleneck | REGIONAL | 4 conditions can produce it |
| RESIL_DEF | Resilience deficit | REGIONAL | 2 conditions can produce it |
| GOV_GAP | Governance gap | LOCAL | 2 conditions can produce it |
| PROP_EXP | Propagation exposure | REGIONAL | 3 conditions can produce it |
| STAB_RISK | Stability risk | REGIONAL | 2 conditions can produce it |

### 3.3 Combination Patterns (3)

| ID | Detection Rule | Severity Treatment |
|---|---|---|
| AMPLIFIED_DEP_FRAG | COORD_FRAG (from DPC) + DEP_AMP (from DCkP) at same locus | Base MAX |
| STRUCT_GRAVITY_WELL | DEL_EXP (from DPC) + RESIL_DEF (from SMC) at same locus | Base MAX |
| SYSTEMIC_OP_FRAG | 3+ atomics with 3+ primitive types at same locus | Escalated one level above MAX (§6.1) |

### 3.4 Ontology Classes (5)

| Class | Name | Question |
|---|---|---|
| A | Flow & Propagation | Where is operational flow concentrating or propagating beyond expected boundaries? |
| B | Concentration & Saturation | Where is structural mass or dependency creating concentration risk? |
| C | Fragility & Resilience | Where does the structure lack resilience against change? |
| D | Reinforcement & Accumulation | Where are coupling patterns reinforcing structural rigidity? |
| E | Drift & Instability | Where is structural drift undermining operational predictability? |

---

## 4. SW-Intel RULES Inventory

### 4.1 Feature Extraction Rules

`extractFeatures()` in SignalSynthesisEngine.js (lines 170-233) maps signal properties to feature tags:

| Feature Tag | Detection Rule |
|---|---|
| pressure_concentration | Signal is aggregated into a COMPOUND/COUPLING/PROPAGATION/RESPONSIBILITY zone |
| dependency_amplification | ISIG-001 with severity ≤ ELEVATED |
| propagation_asymmetry | ISIG-002 with severity ≤ ELEVATED |
| coupling_exposure | PSIG-001 or PSIG-002 |
| resilience_concentration | PSIG-004 or compound zone with condition_count ≥ 3 |
| structural_mass_asymmetry | DPSIG with severity ≤ ELEVATED |
| domain_anchoring_gap | PSIG-006 with value > 0 |
| domain_anchoring_complete | PSIG-006 with value = 0 |
| coordination_load | Hub/authority spine file overlaps with signal concentration entity |

### 4.2 Condition Synthesis Rules (11)

Each rule engine consumes tagged signals and/or structural enrichment surfaces:

| Rule | Consumes | Evidence Mode |
|---|---|---|
| ruleDeliveryPressureConcentration | pressure_zone_state.zones (COMPOUND_ZONE) | TOPOLOGY_DRIVEN |
| ruleDependencyChokePoint | ISIG + topology edges | SIGNAL_DRIVEN |
| rulePropagationAsymmetry | ISIG + topology edges + centrality | SIGNAL_DRIVEN |
| ruleStructuralMassConcentration | DPSIG + normalization_basis | TOPOLOGY_DRIVEN |
| ruleCrossDomainCouplingPressure | PSIG + centrality spines | MIXED |
| ruleExecutionFragility | fragility_surface (cohesion + coupling) | STRUCTURAL_ENRICHMENT_DERIVED |
| ruleExecutionConstriction | constriction_surface (Tarjan + through-flow) | STRUCTURAL_ENRICHMENT_DERIVED |
| ruleStructuralBoundaryDivergence | boundary_divergence (cross-boundary ratio) | STRUCTURAL_ENRICHMENT_DERIVED |
| ruleCouplingInertia | coupling_inertia (union-find clusters) | STRUCTURAL_ENRICHMENT_DERIVED |
| ruleGovernanceCoverageStatus | PSIG-006 + blind spots | TOPOLOGY_DRIVEN |
| ruleCompoundConvergence | 3+ non-nominal primitives on same domain | MIXED |

### 4.3 Consequence Mapping Rules (11)

Each map function applies contextual modifiers:

| Map Function | Contextual Modifiers |
|---|---|
| mapDPC | clusterFanAsymmetry() > 40 → OP_BOTTLENECK |
| mapDCkP | hubInDegree() > 15 → OP_BOTTLENECK |
| mapPA | — (no modifiers) |
| mapSMC | clusterFanAsymmetry() > 60 → STAB_RISK |
| mapCDCP | — (no modifiers) |
| mapEF | _has_hub_fragility → COORD_FRAG; hubInDegree() > 10 → DEP_AMP |
| mapEC | _has_bridge_constriction → DEP_AMP |
| mapSBD | _has_orphaned_modules → PROP_EXP; _has_boundary_leak → GOV_GAP |
| mapCI | _has_choke_in_cluster → DEP_AMP |
| mapGCS | — (maps to GOV_GAP only) |
| mapCC | — (maps to STAB_RISK only) |

---

## 5. BlueEdge Runtime Evidence

On BlueEdge genesis_e2e_03, the engine produces:

| Layer | Count | Details |
|---|---|---|
| Signals (input) | ~15 | PSIG, DPSIG, ISIG families |
| Conditions (synthesis) | 12 | Across 2 active domains (DOMAIN-10, DOMAIN-14) |
| Atomic consequences | ~15 | 8 primitive types activated |
| Combination patterns | 3 | All 3 patterns fire (AMPLIFIED_DEP_FRAG, STRUCT_GRAVITY_WELL, SYSTEMIC_OP_FRAG) |
| Top-level consequences | 4 | After dedup + combination promotion |
| Cognition slices (BOARDROOM) | 9 | Domain-localized executive concepts |
| Domain narratives | 2 | Risk-shape-classified per domain |
| Reinforcement flow edges (BALANCED) | 3 | With relationship verbs |

This proves the full pipeline is operational end-to-end: signals → features → conditions → consequences → combinations → risk profiles → persona projections.

---

## 6. PICR/PRE Split

The current SW-Intel implementation has an implicit PICR/PRE boundary:

### Inside ConsequenceCompiler:

| Functions | Pipeline Layer | AI Participation |
|---|---|---|
| `compile()`, `deduplicateConsequences()`, `detectCombinations()` | PICR — cognition formation | ZERO |
| `deriveDomainRiskProfile()`, `synthesizeBoardroomNarrative()` | PICR — cognition formation | ZERO |
| `forBoardroom()`, `forBalanced()`, `forOperator()`, `forInvestigation()` | PRE Zone A — deterministic projection | ZERO |

### Inside SignalSynthesisEngine:

| Functions | Pipeline Layer | AI Participation |
|---|---|---|
| `extractFeatures()`, all `rule*()` functions, `synthesize()` | CIP→PICR boundary — condition formation | ZERO |

### Inside CognitionOntology:

| Functions | Pipeline Layer | AI Participation |
|---|---|---|
| All node definitions, `resolveNode()`, `resolveConnections()` | VOCABULARY — consumed by all layers | ZERO |

**Every function in the SW-Intel triad is deterministic. Zero AI participation in cognition formation.**

---

## 7. What SW-Intel Proves About the Pattern

1. **The engine handles all 4 personas** from a single compilation result. `compile()` runs once → `forBoardroom()`, `forBalanced()`, `forOperator()`, `forInvestigation()` each project from the same consequence set.

2. **Vocabulary and rules are cleanly separable.** CognitionOntology.js is pure vocabulary (no logic). SignalSynthesisEngine rule functions are pure rules (no vocabulary authoring). ConsequenceCompiler map functions are rule-vocabulary bridges (mapping logic that references vocabulary entries).

3. **The engine machinery is domain-blind.** `deduplicateConsequences()` groups by `consequence_type_id + _lk` — it does not know what COORD_FRAG means. `detectCombinations()` matches patterns by ID co-presence — it does not know what AMPLIFIED_DEP_FRAG means. `deriveRelationshipVerb()` compares locus and scope — it does not know what the consequences describe.

4. **Combination detection is the emergence mechanism.** The three combination patterns produce NEW consequence objects that no individual condition produces. SYSTEMIC_OP_FRAG requires 3+ independent evidence paths converging at the same locus — this is structural emergence detection, proven operational.

5. **Risk shape profiling is a governed structural taxonomy.** The 31-entry CLASS_RISK_LABEL table classifies WHAT KIND of risk exists, not just that risk exists. This is classification with structural meaning — not scoring, not ranking, not summarizing.
