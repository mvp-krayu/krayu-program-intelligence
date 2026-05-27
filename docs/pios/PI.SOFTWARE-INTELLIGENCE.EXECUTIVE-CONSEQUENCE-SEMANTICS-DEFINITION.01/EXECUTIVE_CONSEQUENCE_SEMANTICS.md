# Executive Consequence Semantics — Constitutional Definition

Stream: PI.SOFTWARE-INTELLIGENCE.EXECUTIVE-CONSEQUENCE-SEMANTICS-DEFINITION.01
Classification: G1 — Architecture-Mutating
Date: 2026-05-27
Upstream dependency: SignalSynthesisEngine (SIGNAL_SYNTHESIS_RULEBOOK.md) — FROZEN, read-only reference

---

## 1. What Executive Consequence Synthesis IS

Executive consequence synthesis is the **deterministic compilation** of topology cognition primitives into operational consequence objects.

Topology cognition primitives (produced by SignalSynthesisEngine) describe **what structurally happens**: pressure concentration, dependency choke points, propagation asymmetry, cluster mass imbalance, coupling overload, governance coverage status, compound convergence. Each primitive carries evidence, severity, topology overlay, and three-layer vocabulary.

Executive consequence objects describe **what this means for operations**: coordination fragility, delivery exposure, dependency amplification, resilience deficit, operational bottleneck. Each consequence carries severity, confidence, scope, primary locus, combination lineage, and its own three-layer vocabulary.

The consequence layer is the bridge between DENSE topology cognition substrate and persona projection surfaces. It compiles structural behavior into operational implication through deterministic pattern-matching — never through inference, interpretation, or AI-generated commentary.

**Compilation, not summarization.** Consequence objects are NOT shorter versions of condition objects. They are a different semantic class entirely — operational implications derived from structural evidence through explicit mapping rules.

**Cross-persona semantic objects.** Consequence classes are consumed by ALL personas at different compression depths. BOARDROOM receives compressed consequence (what matters). BALANCED receives operational narrative consequence (why it matters). INVESTIGATION receives the full derivation chain (prove it). Consequence objects are persona-neutral; the consumption contract determines compression.

---

## 2. What Executive Consequence Synthesis is NOT

- **NOT summarization** of conditions at a different verbosity level. "DENSE with fewer details" is the anti-pattern. Consequences are a different semantic class with different vocabulary, different objects, different purposes.
- **NOT narrative.** Narrative belongs to BALANCED persona projection, not to the compilation layer. The consequence compiler produces consequence objects; narrative framing is a downstream projection concern.
- **NOT AI-generated commentary.** Every consequence traces to source conditions through explicit mapping rules. No LLM invocation, no probabilistic output, no "AI thinks."
- **NOT data exposure at different depth.** Showing 3 conditions instead of 7 is filtering. Consequence compilation produces objects that conditions cannot produce — operational implications that require combining structural evidence across primitives.
- **NOT prescriptive.** Consequences describe operational implications ("coordination fragility increases"), never prescribe actions ("you should refactor"). All 13 absolute prohibitions from 75.x remain non-overridable at this layer.
- **NOT the rendering specification.** This document defines WHAT gets compiled. WHERE and HOW it renders is deferred to future implementation streams.
- **NOT 75.x interpretive authority.** Consequence compilation operates at deterministic authority level — pattern-matching over condition structures, not bounded interpretation.

---

## 3. Consequence Class Taxonomy

### 3.1 Atomic Consequence Classes

Each consequence class is an operational implication dimension. A condition may produce one or more consequence classes. A consequence class may be produced by one or more conditions.

| Consequence Class | L1 Engine ID | L2 Structural Semantic | L3 Operator Cognition | Definition |
|---|---|---|---|---|
| COORDINATION_FRAGILITY | `COORD_FRAG` | Structural Coordination Brittleness | Coordination Fragility | Operations on this region require multi-party coordination that structural concentration makes brittle. Structural topology constrains independent action. |
| DEPENDENCY_AMPLIFICATION | `DEP_AMP` | Dependency Concentration Amplification | Dependency Amplification | A single structural dependency point amplifies change impact beyond its apparent scope. File-level concentration exceeds population norms by extreme margin. |
| DELIVERY_EXPOSURE | `DEL_EXP` | Structural Delivery Risk Surface | Delivery Exposure | Delivery decisions affecting this region carry elevated structural risk. The structural topology creates delivery-time exposure that is invisible from work-item or sprint-level planning. |
| OPERATIONAL_BOTTLENECK | `OP_BOTTLENECK` | Structural Throughput Constraint | Operational Bottleneck | Structural concentration creates a throughput constraint on operational flow. Multiple independent operations must traverse the same structural region. |
| RESILIENCE_DEFICIT | `RESIL_DEF` | Structural Resilience Concentration | Resilience Deficit | Structural resilience depends disproportionately on one region. Alternative structural paths are absent or weak. System absorbs perturbation poorly. |
| GOVERNANCE_COVERAGE_GAP | `GOV_GAP` | Governance Surface Incompleteness | Governance Coverage Gap | Governance boundary does not fully cover the structural surface. Structural components exist without domain anchoring. Qualification confidence is reduced. |
| PROPAGATION_EXPOSURE | `PROP_EXP` | Asymmetric Propagation Surface | Propagation Exposure | Change originating at this point propagates asymmetrically — blast radius exceeds structural locality. Downstream impact is disproportionate to source locality. |
| STRUCTURAL_STABILITY_RISK | `STAB_RISK` | Multi-Factor Structural Instability | Structural Stability Risk | Multiple independent structural indicators converge, creating compounding instability. This is a systemic consequence — the whole is worse than the sum of parts. |

### 3.2 Consequence Scope Classification

Scope describes the structural extent of a consequence's claim. Scope is NOT severity.

| Scope | Definition | Derivation Rule |
|---|---|---|
| LOCAL | Consequence applies to a single domain or file-level structural entity | Single condition, single topology target, no shared targets with other conditions |
| REGIONAL | Consequence applies to a cluster or pressure zone — a structural region larger than one domain | Two conditions share topology targets, OR condition targets a pressure zone or cluster |
| SYSTEMIC | Consequence applies across multiple independent structural regions — system-level implication | Three or more conditions converge on shared targets, OR consequence derives from COMPOUND_CONVERGENCE |

**Scope is orthogonal to severity.** A LOCAL consequence can be CRITICAL (a single catastrophic dependency choke point). A SYSTEMIC consequence can be ELEVATED (mild convergence of moderate conditions). Scope describes how far the structural claim extends; severity describes how operationally consequential the claim is.

**Primary locus vs consequence scope.** A SYSTEMIC consequence carries a `primary_locus` (where evidence concentrates — typically the convergence target domain) and a `consequence_scope` (SYSTEMIC — the claim is about system-level behavior). These are distinct fields. The consequence compilation layer MUST NOT collapse systemic claims into local targets.

### 3.3 Consequence Class Invariants

Every consequence class MUST carry:

| Field | Purpose | Mandatory |
|---|---|---|
| `consequence_type_id` | L1 Engine ID | YES |
| `structural_consequence_label` | L2 Structural Semantic | YES |
| `operator_consequence_title` | L3 Operator Cognition (cross-persona) | YES |
| `operational_implication` | What this means for operational decisions | YES |
| `severity` | Operational weight (NOMINAL through CRITICAL) | YES |
| `confidence` | Evidence backing (GOVERNED / ADVISORY_BOUND / STRUCTURAL_ONLY) | YES |
| `consequence_scope` | Structural extent (LOCAL / REGIONAL / SYSTEMIC) | YES |
| `primary_locus` | Where evidence concentrates | YES |
| `source_conditions` | Which conditions produced this consequence | YES |
| `derivation_trace` | Full compilation chain | YES |

---

## 4. Primitive-to-Consequence Mapping

### 4.1 Mapping Rules

Each of the 7 SignalSynthesisEngine conditions produces specific consequence classes. The mapping is deterministic — same condition structure produces the same consequences.

### 4.2 DELIVERY_PRESSURE_CONCENTRATION → Consequences

| Consequence Class | Activation Rule | Scope | Evidence Source |
|---|---|---|---|
| COORDINATION_FRAGILITY | Always when condition fires (zone-class = COMPOUND_ZONE implies multi-signal convergence on operational region) | REGIONAL (pressure zone is multi-domain structural region) | pressure_zone_state.zones[].zone_class, contributing_signal_count |
| DELIVERY_EXPOSURE | Always when condition fires | REGIONAL | Zone anchor domain, pressure zone boundary, severity |
| OPERATIONAL_BOTTLENECK | When contributing_signal_count >= 3 (3+ signals targeting same zone implies throughput concentration) | REGIONAL | supporting_signal_ids.length, zone membership |

**Evidence inheritance:** All consequences inherit the condition's evidence classification (GOVERNED for governed pipeline-derived pressure zones).

### 4.3 DEPENDENCY_CHOKE_POINT → Consequences

| Consequence Class | Activation Rule | Scope | Evidence Source |
|---|---|---|---|
| DEPENDENCY_AMPLIFICATION | Always when condition fires (signal_value > 10x threshold is the definitional trigger) | LOCAL (file-level entity) | ISIG-001 signal_value (import hub pressure ratio), primary_entity |
| COORDINATION_FRAGILITY | When severity >= HIGH (extreme dependency concentration makes coordination around the hub structurally forced) | LOCAL | Signal severity, hub in-degree |
| OPERATIONAL_BOTTLENECK | When severity >= HIGH AND hub in-degree > 20x threshold | LOCAL | Signal value magnitude, primary_entity centrality |

**Evidence inheritance:** Consequences inherit STRUCTURAL_ONLY classification (Level 1 / ISIG evidence, no domain-level corroboration).

### 4.4 PROPAGATION_ASYMMETRY → Consequences

| Consequence Class | Activation Rule | Scope | Evidence Source |
|---|---|---|---|
| PROPAGATION_EXPOSURE | Always when condition fires (asymmetric outbound spread is the definitional trigger) | LOCAL (file-level fan-out source) | ISIG-002 signal_value (import fan asymmetry ratio), primary_entity |
| DELIVERY_EXPOSURE | When severity >= HIGH (extreme fan-out creates delivery-time blast radius) | LOCAL | Signal severity, fan-out magnitude |

**Evidence inheritance:** STRUCTURAL_ONLY (Level 1 / ISIG evidence).

### 4.5 STRUCTURAL_MASS_CONCENTRATION → Consequences

| Consequence Class | Activation Rule | Scope | Evidence Source |
|---|---|---|---|
| RESILIENCE_DEFICIT | Always when condition fires (disproportionate cluster mass implies resilience concentration) | REGIONAL (cluster-level structural region) | DPSIG-031 cluster_pressure_index, DPSIG-032 cluster_fan_asymmetry_percentage |
| STRUCTURAL_STABILITY_RISK | When severity >= ELEVATED AND cluster_fan_asymmetry > 50% (dominant cluster carries majority structural weight) | REGIONAL | normalization_basis.cluster_name, mass_percentage |

**Evidence inheritance:** GOVERNED (topology-level DPSIG evidence from governed pipeline).

### 4.6 CROSS_DOMAIN_COUPLING_PRESSURE → Consequences

| Consequence Class | Activation Rule | Scope | Evidence Source |
|---|---|---|---|
| COORDINATION_FRAGILITY | Always when condition fires (cross-domain coupling constrains independent operations) | REGIONAL (multi-domain coupling surface) | PSIG-001/002 coupling and export pressure, domain targets |
| PROPAGATION_EXPOSURE | When severity >= HIGH (extreme coupling creates cross-domain propagation surface) | REGIONAL | Coupling edge count, severity |

**Evidence inheritance:** GOVERNED (Level 2 / PSIG evidence from binding envelope).

### 4.7 GOVERNANCE_COVERAGE_STATUS → Consequences

**When COVERAGE_GAP:**

| Consequence Class | Activation Rule | Scope | Evidence Source |
|---|---|---|---|
| GOVERNANCE_COVERAGE_GAP | Always when gap fires (unanchored_nodes > 0) | SYSTEMIC (governance coverage is system-wide property) | PSIG-006 signal_value (unanchored node count), blind_spot_entities |

**Evidence inheritance:** GOVERNED.

**When COVERAGE_COMPLETE:** No consequence objects produced. NOMINAL conditions do not generate consequences. The absence of a GOVERNANCE_COVERAGE_GAP consequence is itself informational.

### 4.8 COMPOUND_CONVERGENCE → Consequences

| Consequence Class | Activation Rule | Scope | Evidence Source |
|---|---|---|---|
| STRUCTURAL_STABILITY_RISK | Always when condition fires (convergence of 3+ primitives is the definitional trigger for systemic instability) | SYSTEMIC (primary_locus = convergence_domain, consequence_scope = SYSTEMIC) | contributing_condition_ids, convergence target, contributing condition severities |
| (All contributing primitives' consequences) | Inherited — each contributing primitive's consequence classes are merged into the compound consequence set | Inherited from contributing primitives | Contributing conditions' evidence |

**Evidence inheritance:** MIXED → ADVISORY_BOUND (compound convergence necessarily mixes evidence from different classification sources).

**Critical distinction:** The STRUCTURAL_STABILITY_RISK consequence from COMPOUND_CONVERGENCE has scope = SYSTEMIC with `primary_locus` pointing to the convergence domain. The claim is "multiple independent structural indicators converge, creating systemic instability" — NOT "this domain is unstable."

### 4.9 Mapping Summary Table

| Condition (L1) | → COORD_FRAG | → DEP_AMP | → DEL_EXP | → OP_BOTTLENECK | → RESIL_DEF | → GOV_GAP | → PROP_EXP | → STAB_RISK |
|---|---|---|---|---|---|---|---|---|
| DELIVERY_PRESSURE_CONCENTRATION | ✓ | | ✓ | ✓ (≥3 signals) | | | | |
| DEPENDENCY_CHOKE_POINT | ✓ (≥HIGH) | ✓ | | ✓ (≥HIGH, >20x) | | | | |
| PROPAGATION_ASYMMETRY | | | ✓ (≥HIGH) | | | | ✓ | |
| STRUCTURAL_MASS_CONCENTRATION | | | | | ✓ | | | ✓ (≥ELEV, >50%) |
| CROSS_DOMAIN_COUPLING_PRESSURE | ✓ | | | | | | ✓ (≥HIGH) | |
| GOVERNANCE_COVERAGE_STATUS (GAP) | | | | | | ✓ | | |
| GOVERNANCE_COVERAGE_STATUS (COMPLETE) | — | — | — | — | — | — | — | — |
| COMPOUND_CONVERGENCE | (merged) | (merged) | (merged) | (merged) | (merged) | | (merged) | ✓ |

---

## 5. Combination Semantics

### 5.1 Combination Detection

Combination detection operates on the set of compiled consequence objects. Two or more consequence objects sharing a `primary_locus` domain trigger combination rules.

**Combination is applied AFTER individual primitive-to-consequence mapping (§4), not during.** This preserves the independence of each primitive's consequence computation while enabling emergent combination semantics.

**Detection algorithm:**

```
1. Compile individual consequences from each active condition (§4)
2. Group consequences by primary_locus domain
3. For each domain with 2+ consequence objects:
   a. Check if any named combination pattern (§5.2) matches
   b. If match: produce the combination consequence object
   c. Individual consequences are NOT suppressed — they remain available for decomposition
4. Consequences on independent targets remain independent
```

### 5.2 Named Combination Patterns

Combination patterns produce emergent consequence objects that individual primitives cannot produce alone. Each pattern has a name, trigger condition, emergent consequence, and structural justification.

#### 5.2.1 AMPLIFIED_DEPENDENCY_FRAGILITY

**Trigger:** COORDINATION_FRAGILITY (from DPC) + DEPENDENCY_AMPLIFICATION (from DCkP) sharing primary locus.

**Emergent consequence:** Coordination fragility is amplified by dependency concentration — the coordination challenge is made worse by the fact that a single dependency hub dominates the pressure zone. The choke point IS within the pressure region, compounding both conditions.

**Why this is emergent:** Individual conditions say "this zone has delivery pressure" and "this file is a dependency hub" independently. The combination reveals that the hub is INSIDE the pressure zone — making the pressure condition harder to mitigate (any mitigation must traverse the dependency hub) and the choke point more consequential (it sits in the most operationally stressed region).

| Field | Value |
|---|---|
| consequence_type_id | `AMPLIFIED_DEP_FRAG` |
| structural_consequence_label | Amplified Dependency-Pressure Fragility |
| operator_consequence_title | Amplified Dependency Fragility |
| consequence_scope | REGIONAL |
| severity | MAX(contributing consequence severities) |
| confidence | MIN(contributing consequence confidences) — ADVISORY_BOUND if mixed |

#### 5.2.2 STRUCTURAL_GRAVITY_WELL

**Trigger:** DELIVERY_EXPOSURE (from DPC) + RESILIENCE_DEFICIT (from SMC) sharing primary locus region.

**Emergent consequence:** The structurally dominant region (largest cluster mass) is also the most operationally stressed region (delivery pressure zone). Structural mass and delivery pressure co-locate, creating a gravity well — the most important structural region attracts the most operational risk.

**Why this is emergent:** Mass concentration alone is a neutral structural observation (one cluster is bigger). Delivery pressure alone is a localized operational stress indicator. Together they reveal that the structurally largest region attracts disproportionate operational stress — a feedback loop invisible from either condition alone.

| Field | Value |
|---|---|
| consequence_type_id | `STRUCT_GRAVITY_WELL` |
| structural_consequence_label | Structural Mass-Pressure Gravity Well |
| operator_consequence_title | Structural Gravity Well |
| consequence_scope | REGIONAL |
| severity | MAX(contributing consequence severities) |
| confidence | MIN(contributing consequence confidences) |

#### 5.2.3 SYSTEMIC_OPERATIONAL_FRAGILITY

**Trigger:** 3+ consequence objects from 3+ distinct primitive conditions share primary locus.

**Emergent consequence:** Systemic fragility posture — multiple independent structural indicators converge on the same region through independent evidence paths, each reinforcing the others. The structural system has a single dominant failure attractor.

**Why this is emergent:** No single condition or pair of conditions can produce "systemic." The systemic label requires convergence of at least three independent structural evidence paths (e.g., pressure + choke + coupling, or pressure + mass + coupling). Each path contributes different structural evidence. The convergence is the insight.

| Field | Value |
|---|---|
| consequence_type_id | `SYSTEMIC_OP_FRAG` |
| structural_consequence_label | Systemic Multi-Factor Operational Fragility |
| operator_consequence_title | Systemic Operational Fragility |
| consequence_scope | SYSTEMIC |
| severity | Escalated: one level above MAX(contributing) per §6 |
| confidence | MIN(contributing) — almost always ADVISORY_BOUND (mixed evidence sources) |

### 5.3 Combination Algebra

**Commutativity:** A + B = B + A. Combination patterns are symmetric — order of condition activation does not affect the result.

**Monotonic escalation:** Adding more contributing conditions never reduces consequence severity. Consequence sets grow or remain constant; they never shrink.

**Scope escalation:** Combining LOCAL consequences on shared target → REGIONAL. Combining 3+ consequences on shared target → SYSTEMIC. Scope only escalates; it never degrades.

**Primary locus vs scope:** SYSTEMIC consequences carry `primary_locus` (where evidence concentrates) distinct from `consequence_scope` (SYSTEMIC — what the consequence claims about). This separation prevents collapsing system-level claims into single-domain targets.

**Evidence merging:** When combination mixes evidence classifications (e.g., GOVERNED + STRUCTURAL_ONLY), the combined consequence confidence degrades to ADVISORY_BOUND. See §7 for full confidence semantics.

**Prohibition:** Consequence objects MUST NOT be generated for combination patterns not explicitly defined in §5.2. If two consequences share a locus but do not match a named pattern, they remain independent — no unnamed "combined" consequence is fabricated.

### 5.4 Independence Rule

Consequences on independent targets (no shared primary_locus domain) remain independent. No false synthesis is performed.

Example: PROPAGATION_ASYMMETRY targets a frontend domain. DELIVERY_PRESSURE_CONCENTRATION targets a backend domain. These produce independent consequence objects. No combination pattern applies. The compilation layer does NOT infer a relationship between independently-targeted consequences.

---

## 6. Escalation Semantics

### 6.1 Severity Escalation Rules

| Condition | Escalation Rule |
|---|---|
| Single primitive → single consequence | consequence severity = condition severity (no escalation) |
| Two primitives sharing target → combination pattern | consequence severity = MAX(contributing condition severities) (combination name changes, severity does not escalate) |
| Three+ primitives sharing target → SYSTEMIC_OPERATIONAL_FRAGILITY | consequence severity escalates one level above MAX (e.g., HIGH → CRITICAL) |
| COMPOUND_CONVERGENCE condition | consequence severity = CRITICAL (already defined in SIGNAL_SYNTHESIS_RULEBOOK §3.2) |
| Evidence classification conflict | confidence DOWNGRADES (§7), severity does NOT change |

### 6.2 Escalation Ceiling

Severity cannot escalate above CRITICAL. If MAX(contributing severities) is already CRITICAL, the SYSTEMIC consequence is CRITICAL (no further escalation).

### 6.3 Escalation Prohibitions

1. NOMINAL conditions do not participate in escalation. They produce no consequences (§4.7).
2. ADVISORY_BOUND conditions participate in severity escalation but cannot elevate the result's confidence above ADVISORY_BOUND.
3. Escalation is NEVER applied to single-primitive consequences. Only multi-primitive combination patterns can trigger severity escalation.
4. Escalation is monotonic — it cannot reduce severity below any contributing condition's severity.

---

## 7. Confidence Semantics

### 7.1 Evidence Classification Flow

Consequence confidence inherits from source condition evidence classification. The compilation layer does not produce its own evidence — it compiles existing evidence into operational implication.

### 7.2 Confidence Inheritance Rules

| Source Evidence Composition | Consequence Confidence |
|---|---|
| All source conditions GOVERNED | GOVERNED |
| All source conditions STRUCTURAL_ONLY | STRUCTURAL_ONLY |
| All source conditions ADVISORY_BOUND | ADVISORY_BOUND |
| Mixed GOVERNED + STRUCTURAL_ONLY | ADVISORY_BOUND |
| Mixed: any source is ADVISORY_BOUND | ADVISORY_BOUND |
| Mixed: any combination of different classifications | ADVISORY_BOUND |

**Rule:** Confidence = MIN(source classifications), where GOVERNED > ADVISORY_BOUND > STRUCTURAL_ONLY. Any heterogeneity in evidence classification degrades the combined confidence to ADVISORY_BOUND.

### 7.3 Confidence Downgrade Triggers

- Missing evidence fields on a source condition → consequence confidence degrades to ADVISORY_BOUND
- Incomplete combination: if a named combination pattern expects N contributing primitives but only M are present (M < N), the compilation layer MUST NOT fabricate the missing primitive's consequence. It produces individual consequences for the M present primitives instead.
- Topology invention prohibition: if evidence cannot support a consequence class's activation rule (§4), the consequence is suppressed entirely rather than fabricated with degraded confidence.

### 7.4 Confidence as Operational Signal

Confidence is NOT a quality judgment on the consequence itself. It is a statement about the evidence backing:

- **GOVERNED** = consequence derives entirely from governed pipeline artifacts. Conclusions carry structural authority.
- **ADVISORY_BOUND** = consequence involves mixed evidence sources or advisory-grade evidence. Conclusions are structurally grounded but interpretation carries advisory caveat.
- **STRUCTURAL_ONLY** = consequence derives from structural topology evidence alone (Level 1, file-level). No domain-level semantic corroboration.

---

## 8. Governance Downgrade and Prohibition Semantics

### 8.1 Downgrade Triggers

| Trigger | Downgrade Action |
|---|---|
| Evidence classification insufficient for claimed consequence | Downgrade confidence to ADVISORY_BOUND |
| Named combination pattern requires N primitives, only M present (M < N) | Do not produce combination consequence. Produce M individual consequences instead. |
| Advisory zone / blind spot overlaps with consequence locus | Consequence carries explicit governance_caveat noting blind spot overlap |
| Source condition governance_boundary = ADVISORY_BOUND | Consequence confidence = ADVISORY_BOUND (cannot exceed source) |

### 8.2 Absolute Prohibition Rules

These prohibitions apply to all consequence objects, all consequence text fields, all derivation traces. They are non-overridable.

| # | Prohibition |
|---|---|
| 1 | No consequence may be generated without at least one active condition as source |
| 2 | No consequence may claim higher confidence than its source conditions |
| 3 | No consequence may be generated from suppressed conditions (severity = NOMINAL) |
| 4 | No consequence may produce prescription ("you should", "we recommend", "consider refactoring") |
| 5 | No consequence may attribute organizational intent, team behavior, or human motive |
| 6 | No consequence may recommend intervention priority or ranked next actions |
| 7 | No consequence may infer cultural diagnosis, leadership quality, or management effectiveness |
| 8 | No consequence may perform personnel attribution or behavioral prediction |
| 9 | No consequence may attribute causation to humans ("team X caused", "developer Y introduced") |
| 10 | No consequence may perform organizational sentiment analysis |
| 11 | No consequence may reference SW-Intel as a product or feature in operator-facing text fields |
| 12 | No consequence may fabricate structural evidence not present in source conditions |
| 13 | No consequence may produce consequence text that is not traceable to source condition evidence |
| 14 | All 13 LENS 75.x absolute prohibitions are inherited and remain non-overridable |

---

## 9. SW-Intel Module Gating

### 9.1 Gating Model

Consequence compilation is gated by the Software Intelligence module activation state.

| Module State | Consequence Behavior |
|---|---|
| SW-Intel OFF | No consequence computation. Consequence layer is invisible. Existing synthesizeTeaser() behavior unchanged. |
| SW-Intel ON | Full consequence compilation. All consequence classes, combination patterns, escalation rules active. |

### 9.2 Teaser Extension (SW-Intel OFF)

When SW-Intel is OFF, the consequence teaser extends the existing condition teaser with consequence awareness:

```json
{
  "consequence_teaser": {
    "active_consequence_count": 4,
    "top_consequence_class": "STRUCTURAL_STABILITY_RISK",
    "top_consequence_severity": "CRITICAL",
    "top_consequence_scope": "SYSTEMIC",
    "requires_module": "SOFTWARE_INTELLIGENCE"
  }
}
```

This preserves the commercial toggle: PI Core persona surfaces show baseline structural cognition → activate SW-Intel → operational consequence meaning appears. The delta IS the product value.

### 9.3 Compilation Trigger

Consequence compilation runs AFTER SignalSynthesisEngine.synthesize() completes. It consumes the engine's output (conditions array, primitives, composites) and produces consequence objects as a separate output layer. The consequence compiler does NOT modify the engine's output.

---

## 10. Persona Consumption Contracts

Consequence objects are cross-persona semantic objects. All four personas consume consequences. The consumption contract defines what each persona receives.

### 10.1 BOARDROOM Consumption

**Question:** "What matters?"

**Consequence delivery:**
- Compressed consequence summary: top N consequence objects by severity
- Each consequence: consequence_type_id + operator_consequence_title + severity + consequence_scope + primary_locus display name + confidence
- No narrative, no explanation, no "why"
- No condition decomposition (BOARDROOM does not decompose consequences into contributing conditions)

**Module interaction:** BOARDROOM without SW-Intel = generic PI executive cognition (qualification posture, signal count, governance legitimacy). BOARDROOM with SW-Intel = generic PI executive cognition PLUS operational consequence awareness. SW-Intel augments BOARDROOM meaning. BOARDROOM remains generic PI executive cognition regardless of which domain modules are active.

### 10.2 BALANCED Consumption

**Question:** "Why does it operationally matter?"

**Consequence delivery:**
- Full consequence set with operational narrative framing
- Combination patterns explained through operational language
- Consequence scope explained: LOCAL (isolated structural finding), REGIONAL (structural region under stress), SYSTEMIC (system-level fragility posture)
- Narrative pacing and contextual explanation belong HERE — BALANCED is the narrative persona
- Evidence confidence contextualized: what the confidence level means for operational trust in the consequence

### 10.3 DENSE Consumption

**Question:** "How does it structurally behave?"

**Consequence delivery:**
- DENSE is NOT a direct consumer of consequence objects. DENSE IS the topology cognition substrate — it renders conditions, overlays, evidence.
- Consequence layer MAY annotate DENSE topology overlays with consequence class labels as lightweight structural enrichment
- This is additive annotation, never replacement of topology cognition rendering

### 10.4 INVESTIGATION Consumption

**Question:** "Prove it."

**Consequence delivery:**
- Full consequence derivation chain: condition → consequence mapping rule → combination pattern → confidence inheritance → scope classification → result
- Every claim traceable to source condition fields and evidence classification
- Evidence audit capability: verify that each consequence's activation rules (§4) were correctly applied

---

## 11. GENESIS Consequence Proof

Worked example: compile consequences from the 7 GENESIS conditions on BlueEdge specimen (run_blueedge_genesis_e2e_03).

### 11.1 Input: SignalSynthesisEngine Output

7 conditions (6 primitive + 1 composite):

| # | Condition (L1) | Severity | Overlay Mode | Evidence Class | Topology Target |
|---|---|---|---|---|---|
| 1 | DELIVERY_PRESSURE_CONCENTRATION | HIGH | PRESSURE_ZONE | GOVERNED | DOMAIN-10 (Platform Infrastructure and Data), PZ-001 |
| 2 | DEPENDENCY_CHOKE_POINT | HIGH | IMPORT_PRESSURE | STRUCTURAL_ONLY | backend/src/common/dto/index.ts → DOMAIN-10 region |
| 3 | PROPAGATION_ASYMMETRY | HIGH | PROPAGATION_CORRIDOR | STRUCTURAL_ONLY | frontend/App.tsx → separate domain |
| 4 | STRUCTURAL_MASS_CONCENTRATION | ELEVATED | CLUSTER_PRESSURE | GOVERNED | CLU-04/backend → DOMAIN-10 region |
| 5 | CROSS_DOMAIN_COUPLING_PRESSURE | HIGH | COUPLING_CORRIDOR | GOVERNED | DOMAIN-10 |
| 6 | GOVERNANCE_COVERAGE_STATUS | NOMINAL | COVERAGE_COMPLETE | GOVERNED | System-wide (suppressed) |
| 7 | COMPOUND_CONVERGENCE | CRITICAL | COMPOUND_CONVERGENCE | MIXED | DOMAIN-10 (convergence of #1, #2, #4, #5) |

### 11.2 Step 1: Individual Consequence Mapping (§4)

**From condition #1 (DPC, HIGH, GOVERNED):**
- COORDINATION_FRAGILITY — activated (zone-class = COMPOUND_ZONE) → scope REGIONAL → confidence GOVERNED
- DELIVERY_EXPOSURE — activated → scope REGIONAL → confidence GOVERNED
- OPERATIONAL_BOTTLENECK — activated (3 contributing signals ≥ 3 threshold) → scope REGIONAL → confidence GOVERNED

**From condition #2 (DCkP, HIGH, STRUCTURAL_ONLY):**
- DEPENDENCY_AMPLIFICATION — activated (35.29x > 10x threshold) → scope LOCAL → confidence STRUCTURAL_ONLY
- COORDINATION_FRAGILITY — activated (severity HIGH ≥ HIGH threshold) → scope LOCAL → confidence STRUCTURAL_ONLY
- OPERATIONAL_BOTTLENECK — not activated (requires >20x AND HIGH; hub ratio is 35.29x but this is import pressure ratio, not in-degree >20 threshold — must verify against actual in-degree)

**From condition #3 (PA, HIGH, STRUCTURAL_ONLY):**
- PROPAGATION_EXPOSURE — activated → scope LOCAL → confidence STRUCTURAL_ONLY
- DELIVERY_EXPOSURE — activated (severity HIGH ≥ HIGH threshold) → scope LOCAL → confidence STRUCTURAL_ONLY

**From condition #4 (SMC, ELEVATED, GOVERNED):**
- RESILIENCE_DEFICIT — activated → scope REGIONAL → confidence GOVERNED
- STRUCTURAL_STABILITY_RISK — activated (severity ELEVATED ≥ ELEVATED AND 57.31% > 50% threshold) → scope REGIONAL → confidence GOVERNED

**From condition #5 (CDCP, HIGH, GOVERNED):**
- COORDINATION_FRAGILITY — activated → scope REGIONAL → confidence GOVERNED
- PROPAGATION_EXPOSURE — activated (severity HIGH ≥ HIGH threshold) → scope REGIONAL → confidence GOVERNED

**From condition #6 (GCS, NOMINAL):** No consequences produced (NOMINAL).

**From condition #7 (CC, CRITICAL, MIXED):**
- STRUCTURAL_STABILITY_RISK — activated (convergence of 4 conditions) → scope SYSTEMIC → confidence ADVISORY_BOUND
- Plus all contributing primitives' consequences (inherited, already compiled above)

### 11.3 Step 2: Consequence Grouping by Primary Locus

**DOMAIN-10 locus** (from DPC + DCkP + SMC + CDCP + CC):
- COORDINATION_FRAGILITY × 3 (from DPC, DCkP, CDCP)
- DELIVERY_EXPOSURE × 1 (from DPC)
- OPERATIONAL_BOTTLENECK × 1 (from DPC)
- DEPENDENCY_AMPLIFICATION × 1 (from DCkP)
- RESILIENCE_DEFICIT × 1 (from SMC)
- STRUCTURAL_STABILITY_RISK × 2 (from SMC, CC)
- PROPAGATION_EXPOSURE × 1 (from CDCP)

**Frontend domain locus** (from PA only):
- PROPAGATION_EXPOSURE × 1
- DELIVERY_EXPOSURE × 1

### 11.4 Step 3: Combination Pattern Detection (§5)

**DOMAIN-10 region — check named patterns:**

1. **AMPLIFIED_DEPENDENCY_FRAGILITY (§5.2.1):** COORDINATION_FRAGILITY (from DPC) + DEPENDENCY_AMPLIFICATION (from DCkP) share DOMAIN-10 locus → **MATCH**. Scope: REGIONAL. Severity: MAX(HIGH, HIGH) = HIGH. Confidence: MIN(GOVERNED, STRUCTURAL_ONLY) = ADVISORY_BOUND.

2. **STRUCTURAL_GRAVITY_WELL (§5.2.2):** DELIVERY_EXPOSURE (from DPC) + RESILIENCE_DEFICIT (from SMC) share DOMAIN-10 locus → **MATCH**. Scope: REGIONAL. Severity: MAX(HIGH, ELEVATED) = HIGH. Confidence: MIN(GOVERNED, GOVERNED) = GOVERNED.

3. **SYSTEMIC_OPERATIONAL_FRAGILITY (§5.2.3):** 4 distinct primitive conditions (DPC, DCkP, SMC, CDCP) share DOMAIN-10 locus → **MATCH** (≥3 threshold). Scope: SYSTEMIC (primary_locus: DOMAIN-10, consequence_scope: SYSTEMIC). Severity: escalated one level above MAX(HIGH) = CRITICAL. Confidence: MIN(GOVERNED, STRUCTURAL_ONLY, GOVERNED, GOVERNED) = ADVISORY_BOUND.

**Frontend domain — no combination:** Only PA contributes consequences to this locus. No combination patterns apply.

### 11.5 Step 4: Final Compiled Consequence Set

| # | Consequence | Class (L1) | Severity | Confidence | Scope | Primary Locus | Source |
|---|---|---|---|---|---|---|---|
| 1 | Systemic Operational Fragility | SYSTEMIC_OP_FRAG | CRITICAL | ADVISORY_BOUND | SYSTEMIC | DOMAIN-10 | DPC + DCkP + SMC + CDCP (4 conditions) |
| 2 | Amplified Dependency Fragility | AMPLIFIED_DEP_FRAG | HIGH | ADVISORY_BOUND | REGIONAL | DOMAIN-10 | DPC + DCkP combination |
| 3 | Structural Gravity Well | STRUCT_GRAVITY_WELL | HIGH | GOVERNED | REGIONAL | DOMAIN-10 | DPC + SMC combination |
| 4 | Propagation Exposure | PROP_EXP | HIGH | STRUCTURAL_ONLY | LOCAL | Frontend domain | PA (independent) |

The runtime compiles four consequence objects from seven contributing topology cognition conditions: 1 systemic fragility (SYSTEMIC scope, primary locus DOMAIN-10), 2 combination patterns (REGIONAL scope), 1 independent propagation exposure (LOCAL scope, separate locus). Governance coverage (NOMINAL) produces no consequence.

### 11.6 Decomposition Availability

Each combination consequence is decomposable into its contributing primitive consequences:

- **SYSTEMIC_OP_FRAG** decomposes to: COORDINATION_FRAGILITY, DELIVERY_EXPOSURE, OPERATIONAL_BOTTLENECK, DEPENDENCY_AMPLIFICATION, RESILIENCE_DEFICIT, STRUCTURAL_STABILITY_RISK, PROPAGATION_EXPOSURE — the full set of individual consequence classes from §11.2.
- **AMPLIFIED_DEP_FRAG** decomposes to: COORDINATION_FRAGILITY (from DPC), DEPENDENCY_AMPLIFICATION (from DCkP).
- **STRUCT_GRAVITY_WELL** decomposes to: DELIVERY_EXPOSURE (from DPC), RESILIENCE_DEFICIT (from SMC).

Individual primitive consequences are NOT suppressed by combination patterns. They remain available for per-persona decomposition and INVESTIGATION-depth audit.

---

## 12. Three-Layer Vocabulary for Consequence Objects

Following SIGNAL_SYNTHESIS_RULEBOOK §6.2 — every consequence object carries three vocabulary layers. These are mandatory, not optional.

| Layer | Field | Purpose | Audience |
|---|---|---|---|
| L1 — Engine | `consequence_type_id` | Rule identification, code references, logging | Engine / developers |
| L2 — Structural Semantic | `structural_consequence_label` | Structural meaning for technical operators | Technical operators / explainability |
| L3 — Operator Cognition | `operator_consequence_title` | Operational meaning, cross-persona (compression differs per persona) | All personas at appropriate depth |

### 12.1 Atomic Consequence Vocabulary Table

| L1 Engine ID | L2 Structural Semantic | L3 Operator Cognition |
|---|---|---|
| `COORD_FRAG` | Structural Coordination Brittleness | Coordination Fragility |
| `DEP_AMP` | Dependency Concentration Amplification | Dependency Amplification |
| `DEL_EXP` | Structural Delivery Risk Surface | Delivery Exposure |
| `OP_BOTTLENECK` | Structural Throughput Constraint | Operational Bottleneck |
| `RESIL_DEF` | Structural Resilience Concentration | Resilience Deficit |
| `GOV_GAP` | Governance Surface Incompleteness | Governance Coverage Gap |
| `PROP_EXP` | Asymmetric Propagation Surface | Propagation Exposure |
| `STAB_RISK` | Multi-Factor Structural Instability | Structural Stability Risk |

### 12.2 Combination Consequence Vocabulary Table

| L1 Engine ID | L2 Structural Semantic | L3 Operator Cognition |
|---|---|---|
| `AMPLIFIED_DEP_FRAG` | Amplified Dependency-Pressure Fragility | Amplified Dependency Fragility |
| `STRUCT_GRAVITY_WELL` | Structural Mass-Pressure Gravity Well | Structural Gravity Well |
| `SYSTEMIC_OP_FRAG` | Systemic Multi-Factor Operational Fragility | Systemic Operational Fragility |

---

## 13. Consequence Object Schema

### 13.1 Atomic Consequence Object

```json
{
  "consequence_id": "string — unique identifier (e.g., 'csq-coord-frag-domain10')",
  "consequence_type_id": "string — L1 engine ID from §3 (e.g., 'COORD_FRAG')",
  "structural_consequence_label": "string — L2 structural semantic",
  "operator_consequence_title": "string — L3 operator cognition (cross-persona)",
  "operational_implication": "string — what this means for operational decisions",

  "severity": "NOMINAL | LOW | MODERATE | ELEVATED | HIGH | CRITICAL",
  "confidence": "GOVERNED | ADVISORY_BOUND | STRUCTURAL_ONLY",

  "consequence_scope": "LOCAL | REGIONAL | SYSTEMIC",
  "primary_locus": {
    "domains": ["DOMAIN-NN"],
    "clusters": ["CLU-NN"],
    "files": ["path/to/file"]
  },

  "source_conditions": ["condition_id references — which conditions produced this consequence"],
  "activation_rule": "string — reference to §4 rule that activated this consequence",

  "combination_pattern": null,
  "escalation_applied": false,
  "escalation_reason": null,

  "evidence_summary": "string — what evidence supports this consequence",
  "governance_caveat": "string | null — governance limitation if any (e.g., blind spot overlap)",
  "derivation_trace": "string — full compilation chain: condition → mapping rule → consequence"
}
```

### 13.2 Combination Consequence Object

```json
{
  "consequence_id": "string — unique identifier (e.g., 'csq-systemic-op-frag-domain10')",
  "consequence_type_id": "string — L1 engine ID from §5.2 (e.g., 'SYSTEMIC_OP_FRAG')",
  "structural_consequence_label": "string — L2 structural semantic",
  "operator_consequence_title": "string — L3 operator cognition (cross-persona)",
  "operational_implication": "string — what this emergent combination means for operational decisions",

  "severity": "NOMINAL | LOW | MODERATE | ELEVATED | HIGH | CRITICAL",
  "confidence": "GOVERNED | ADVISORY_BOUND | STRUCTURAL_ONLY",

  "consequence_scope": "LOCAL | REGIONAL | SYSTEMIC",
  "primary_locus": {
    "domains": ["DOMAIN-NN — where evidence concentrates"],
    "clusters": ["CLU-NN"]
  },

  "source_conditions": ["condition_id references — ALL contributing conditions"],
  "contributing_consequences": ["consequence_id references — atomic consequences that triggered this pattern"],
  "activation_rule": "string — reference to §5.2 combination pattern",

  "combination_pattern": "string — named pattern from §5.2 (e.g., 'SYSTEMIC_OPERATIONAL_FRAGILITY')",
  "escalation_applied": true,
  "escalation_reason": "string — e.g., '4 conditions converge on shared locus → severity escalates one level (§6.1)'",

  "decomposition": {
    "contributing_primitive_consequences": ["consequence_id references — available for persona decomposition"],
    "decomposition_available": true
  },

  "evidence_summary": "string — what evidence supports this combination consequence",
  "governance_caveat": "string | null",
  "derivation_trace": "string — full compilation chain: conditions → individual consequences → combination detection → combination pattern → scope escalation → confidence inheritance → result"
}
```

---

## 14. Doctrine Compliance Checklist

| # | Requirement | How This Definition Satisfies |
|---|---|---|
| 1 | Deterministic | Same conditions → same consequences. Pattern-matching over condition structures, not inference. |
| 2 | Traceable | Every consequence traces to source conditions, activation rules (§4), and combination patterns (§5). |
| 3 | Evidence-bound | Consequences derive from condition fields (severity, evidence_mode, topology_overlay, shared_topology_targets). No invented semantics. |
| 4 | Client-agnostic | Rules reference condition types (DELIVERY_PRESSURE_CONCENTRATION), not client names (BlueEdge). |
| 5 | Compilation, not summarization | Consequence classes are operational implication dimensions (COORDINATION_FRAGILITY), not condition summaries ("there is pressure"). |
| 6 | Persona-respecting | Each persona has a defined consumption contract (§10). Consequence objects are cross-persona; compression differs per persona. |
| 7 | Module-gated | SW-Intel OFF → no consequences. SW-Intel ON → full compilation. Teaser extension defined (§9.2). |
| 8 | 3-layer vocabulary | Every consequence carries L1/L2/L3 as mandatory fields (§12). Atomic and combination vocabulary tables complete. |
| 9 | Combination-aware | Named combination patterns (§5.2) produce emergent consequences not derivable from individual primitives. |
| 10 | No hidden AI | Deterministic pattern matching. No LLM, no ML, no probabilistic output. |
| 11 | No prescription | Consequences describe operational implications, never recommend actions. 14 absolute prohibitions (§8.2). |
| 12 | 75.x compliant | All 13 LENS 75.x absolute prohibitions preserved and inherited (§8.2 #14). |
| 13 | Confidence-aware | Evidence classification flows through to consequence confidence via inheritance rules (§7). Mixed evidence → ADVISORY_BOUND. |
| 14 | Scope-aware | Every consequence carries consequence_scope (LOCAL/REGIONAL/SYSTEMIC). Systemic claims carry primary_locus distinct from scope. |
| 15 | Cross-persona | Consequence objects are persona-neutral semantic objects. L3 vocabulary is operator cognition, not exclusively executive. |
| 16 | No topology invention | If evidence cannot support a consequence class's activation rule, the consequence is suppressed — never fabricated. |
