# BALANCED Cognition Stratum Decomposition

Stream: PI.BALANCED.OPERATIONAL-COGNITION-FORENSICS.01
Classification: FORENSIC / CONSTITUTIONAL / NON-IMPLEMENTATION
Date: 2026-05-24
Depends on: BALANCED_OPERATIONAL_COGNITION_FORENSICS.md (component-level forensics)
Purpose: Sub-field stratum classification of every forensic component across 5 cognition strata + cognitive function identification

---

## The 5-Stratum Model

| # | Stratum | Test Question | Boundary |
|---|---------|--------------|----------|
| 1 | **PI CORE** | Would this cognitive primitive exist if the specimen were a hospital, supply chain, or legal corpus? | Specimen-independent constitutional law |
| 2 | **GOVERNED REPLAY** | Does this prove HOW the system earned its qualification state? | Governance lifecycle, legitimacy proof |
| 3 | **AGENTIC COGNITIVE ORCHESTRATION** | Does this perform runtime cognitive synthesis, routing, emergence, or pacing? | Cognitive functions that activate, synthesize, escalate, route, compose |
| 4 | **SQO OPERATIONAL QUALIFICATION** | Does this make qualification state operationally actionable? | Reconciliation mechanics, maturity, progression gates |
| 5 | **DOMAIN MODULE** | Does this concept assume a specific intake domain (code, repo, infrastructure)? | Domain-specific terms, signals, topology |

### Classification Rules

- A single rendered field can span multiple strata. The decomposition tags EACH sub-concept.
- "MAYBE" concepts (Core at one abstraction, Module at another): tag as `PI CORE (primitive) + MODULE (instantiation)`. The primitive is Core; the domain term filling it is Module.
- AGENTIC classification identifies the COGNITIVE FUNCTION, not an implementation pattern. No agent runtime is proposed.

---

## STRATUM TAG PASS

### COMPONENT 1: Operational Posture (DeclarationZone)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| "OPERATIONAL POSTURE" label | PI CORE | — | Posture-as-readiness-stamp is specimen-independent |
| Readiness state enum (EXECUTIVE_READY, BLOCKED, etc.) | PI CORE | Posture Synthesis | Any domain has readiness states |
| `deriveRenderState(band, posture, qualifierClass)` | AGENTIC | **Posture Synthesis Agent** — combines 3 independent inputs into a single operational state | The function performs cognitive synthesis, not rendering |
| STATE_LABELS map | PI CORE | — | Vocabulary of readiness states |
| Scope line ("3 Domains · 47 Clusters") | MODULE (Software) | — | "Clusters" assumes repository/code topology. A hospital would say "3 Departments · 47 Units." The CONCEPT of scope is Core; the TERMS are Module |
| "Partial Coverage" | PI CORE | — | Coverage classification is specimen-independent |

**Orchestration responsibility:** Posture Synthesis. Combines qualification band, readiness posture, and qualifier class into a single declarative state. This is a cognitive compression function — 3 dimensions → 1 stamp.

---

### COMPONENT 2: Reconciliation Posture (ReconciliationAwarenessZone)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Posture tier (STRONG/MODERATE/WEAK/INSUFFICIENT) | PI CORE | **Confidence Classification Agent** | Any domain has grounding quality tiers |
| Tier threshold logic (ratio ≥ 0.75 + weighted ≥ 80 = STRONG) | AGENTIC | Confidence Classification — threshold-based cognitive compression | The thresholds ARE the cognitive function |
| `weighted_confidence_score` | PI CORE | — | Weighted evidence confidence is specimen-independent |
| `reconciliation_ratio` | PI CORE | — | Ratio of grounded-to-total claims is universal |
| `coverage_pct` | PI CORE | — | Evidence coverage percentage is universal |
| `grounded_count` / `total_domains` | PI CORE (counts) + MODULE (domain concept) | — | Counting is Core; "domains" as semantic registry entries could be "departments" or "asset classes" |
| `unmapped_count` (L1 domains) | PI CORE | — | Unmapped = no structural correspondence. Universal |
| Lifecycle trajectory epochs | SQO | — | Temporal qualification mechanics |
| `latestDelta.weighted_confidence_change` | SQO | **Temporal Trend Agent** | Epoch-over-epoch comparison is operational qualification |
| `domain_movements` (L1→L2, L1→L3) | SQO + GOVERNED REPLAY | — | Individual domain confidence evolution = SQO mechanic; the evidence trail = Replay |
| Debt drilldown (unresolved domains) | SQO | — | Debt inventory is operational qualification |
| Domain drilldown rationale ("Why unmapped") | SQO + MODULE | — | Rationale is operational; specific reasons ("no messaging service") are Module |
| `CONCEPTUAL_INFRASTRUCTURE` / `DISTRIBUTED_CONCERN` / `BUSINESS_VERTICAL` classifications | MODULE (Software) | — | These assume code/repository topology. A hospital wouldn't use these classifications |
| Resolution hints ("A dedicated messaging/queue service...") | MODULE (Software) | — | Domain-specific resolution guidance |
| Posture tier color mapping | PI CORE | — | Severity-to-color is a visualization primitive, specimen-independent |

**Orchestration responsibility:** Confidence Classification. Compresses per-domain confidence levels into a single tiered posture with trend. This is a cognitive aggregation function — N domain states → 1 posture.

---

### COMPONENT 3: Weighted Confidence

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Weighted average computation | PI CORE | — | Arithmetic from confidence levels is universal |
| Confidence level weights (L1=20, L2=40, L3=60, L4=80, L5=100) | PI CORE | — | Ordinal confidence scale is specimen-independent |
| Per-domain confidence level assignment | PI CORE + MODULE | — | The CONCEPT of confidence levels is Core; the criteria for each level may have Module-specific elements |
| `lineage_status` → confidence mapping (EXACT=L5, STRONG=L4, etc.) | SQO | — | Lineage status vocabulary is operational qualification |

**Orchestration responsibility:** None — this is a pure computation, not a cognitive function.

---

### COMPONENT 4: Confidence Trajectory (ReconTrajectoryStrip)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Epoch concept (BASELINE → AI_ENRICHED) | SQO | **Temporal Cognition Agent** | Epoch-based qualification tracking is operational |
| Per-epoch weighted confidence values | SQO | — | Temporal state snapshots |
| Domain movements (L1→L2/L3 with delta) | SQO | Temporal Cognition — per-domain evolution tracking | Individual domain trajectory |
| Trajectory visualization (bar per epoch) | PI CORE | — | Temporal comparison visualization is universal |
| "from BASELINE" delta display | SQO | — | Epoch comparison |
| Enrichment-driven confidence lift | GOVERNED REPLAY | — | Evidence enrichment is replay/legitimacy |

**Orchestration responsibility:** Temporal Cognition. Tracks how confidence evolves across operational epochs. This is a temporal comparison function — not just "what is the state" but "how did the state change."

---

### COMPONENT 5: Executive Interpretation (left column)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| "EXECUTIVE INTERPRETATION" label | PI CORE | — | Executive-altitude interpretation is a cognitive layer |
| 75.x marker | GOVERNED REPLAY | — | Authority declaration = governance legitimacy |
| `narrative.executive_summary` template assembly | AGENTIC | **Executive Synthesis Agent** | Composes multi-source inputs into a single interpretive paragraph |
| Posture-conditioned narrative branching (INVESTIGATE/PROCEED/ESCALATE) | PI CORE | — | Readiness-posture vocabulary is universal |
| Domain count in prose ("13 ungrounded domains") | PI CORE (count) + MODULE ("domains") | — | |
| Zone anchor label in prose ("backend_modules") | MODULE (Software) | — | Domain-specific location term |
| Emerged narrative claims (SECONDARY/TERTIARY) | AGENTIC | **Emergence Orchestration Agent** | The left column ROUTES emerged claims from center column — cognitive routing |
| `subordinateLabel` + first evidence claim | AGENTIC | — | Compressed representation of a deeper cognitive actor's output |
| Structural context paragraph | PI CORE | — | Structural summary is specimen-independent |
| Structural enrichment data references | GOVERNED REPLAY + MODULE | — | Enrichment is replay; enrichment FROM code graph is Module |

**Orchestration responsibility:** Executive Synthesis. Takes outputs from MULTIPLE cognitive actors (posture, topology, signals, emergence) and compresses them into a single executive-altitude panel. This is the highest-level cognitive aggregation function in BALANCED.

---

### COMPONENT 6: Grounding Posture (groundingIntelligence narrative)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Advisory-bound ratio concept | PI CORE | — | Ratio of ungrounded-to-total claims is universal |
| Threshold: ratio > 0.3 | AGENTIC | **Grounding Asymmetry Detection** | The threshold IS the cognitive trigger |
| Threshold: backed < clusters | MODULE (Software) | — | "Clusters" assumes repository topology. Core equivalent: "structural segments" |
| Narrative: "advisory-bound rather than structurally grounded" | PI CORE | — | Grounding-vs-advisory framing is universal |
| Narrative: "compressing executive confidence across the topology" | PI CORE | — | Confidence compression from evidence gaps is universal |
| Evidence chain (topology_summary source) | GOVERNED REPLAY | — | Evidence traceability |
| `authority: 'INTERPRETIVE'` | PI CORE | — | Authority classification is constitutional |
| `emergenceClass: 'SECONDARY'` | AGENTIC | — | Emergence tier classification governs cognitive priority |

**Orchestration responsibility:** Grounding Asymmetry Detection. Monitors the ratio of grounded-to-advisory claims and ACTIVATES when asymmetry crosses threshold. This is a sentinel function — dormant until conditions emerge. The cognitive behavior is: "I watch for grounding gaps and sound an alarm when they become structurally significant."

---

### COMPONENT 7: Structural Context (SemanticTrustPostureZone — compact trust strip)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Trust level vocabulary (HYDRATED/STRONG/PARTIAL/etc.) | PI CORE | — | Trust-as-confidence-tier is universal |
| Trust level resolution logic (S2 + grounding ≥ 0.75 = STRONG) | AGENTIC | **Trust Posture Synthesis** | Combines S-state + grounding into trust classification |
| S-state display (S2) | SQO | — | S-state is operational qualification |
| Grounding percentage (23.5%) | PI CORE | — | Evidence grounding ratio is universal |
| Maturity classification (STABLE) | SQO | — | Maturity is operational qualification |
| Color coding per trust tier | PI CORE | — | Severity visualization is universal |

**Orchestration responsibility:** Trust Posture Synthesis. Compresses S-state + grounding ratio + maturity into a single trust classification. Cognitive compression: 3 dimensions → 1 trust label.

---

### COMPONENT 8: Structural Signals (SignalNarrativeBlock)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| "STRUCTURAL SIGNALS" label | PI CORE | — | Signal concept is universal |
| Activated signal count | PI CORE | — | Counting activated conditions is universal |
| Signal severity (ELEVATED/CRITICAL/NOMINAL) | PI CORE | — | Severity classification is universal |
| Signal families (DPSIG, PSIG, ISIG) | MODULE (Software) | — | These are code-topology signal families |
| `cluster_pressure_index` | MODULE (Software) | — | Assumes cluster/code topology |
| `fan_asymmetry` | MODULE (Software) | — | Assumes code dependency graph |
| `coupling` / `domain_coupling` | MODULE (Software) | — | Code coupling is software-specific; but COUPLING as concept is Core |
| `zone_coverage` / `unanchored_ratio` | PI CORE (concept) + MODULE (instantiation) | — | "Unanchored" = no structural backing — Core. The specific unanchored signal calculation assumes code topology — Module |
| Per-signal interpretation prose | AGENTIC | **Signal Interpretation Agent** | Each signal gets meaning-in-context. The agent reads structural state and produces operational meaning |
| Compound narrative ("systemic structural stress rather than isolated conditions") | AGENTIC | **Compound Activation Agent** | Detects when multiple signals co-activate and synthesizes compound meaning |
| Concentration string ("backend_modules, 47 nodes") | MODULE (Software) | — | Domain-specific location |
| Confidence note ("advisory bound") | PI CORE | — | Confidence classification |
| Cluster→domain label substitution | MODULE (Software) | — | Code topology display resolution |

**Orchestration responsibility:** Signal Interpretation + Compound Activation. Two distinct cognitive functions. (1) Per-signal: reads a structural measurement and produces operational meaning. (2) Compound: detects multi-signal co-activation and synthesizes emergent meaning that no single signal carries alone. The compound function is MORE than the sum of individual signal interpretations — it detects systemic patterns.

---

### COMPONENT 9: Pressure Concentration (pressureIntelligence narrative)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Pressure concentration concept | PI CORE | — | Pressure-in-a-zone is universal (hospital: "pressure in cardiac ward") |
| Threshold: activated ≥ 2 OR critical > 0 OR zone ≠ NOMINAL | AGENTIC | **Pressure Concentration Detection** | Multi-condition activation trigger |
| Zone name (`primary_zone_business_label`) | MODULE (Software) | — | Specific zone label |
| "exceeds operational thresholds" | PI CORE | — | Threshold-exceeding is universal |
| "systemic structural stress rather than isolated conditions" | PI CORE | — | Systemic-vs-isolated distinction is universal |
| Evidence chain (signal counts, zone classification) | GOVERNED REPLAY | — | Traceability |

**Orchestration responsibility:** Pressure Concentration Detection. Monitors multiple signal dimensions simultaneously and ACTIVATES when compound pressure conditions emerge. This is a multi-signal sentinel — more sophisticated than the grounding asymmetry sentinel because it watches 3 independent conditions.

---

### COMPONENT 10: Pressure Zone Focus (PressureZoneFocusBlock)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| "PRESSURE ZONE FOCUS" label | PI CORE | — | Pressure zones exist in any domain |
| Zone name resolution (cascaded: VF-05 → topology → DPSIG) | AGENTIC | **Spatial Anchor Resolution** | Cascaded resolution logic = cognitive routing |
| Zone classification (COMPOUND/SINGLE) | AGENTIC | — | UI-computed from signal count — a classification decision |
| Activated signal count in zone | PI CORE | — | Counting |
| Compound narrative from first signal | AGENTIC | — | Routed from compound activation agent |
| `backend_modules` as zone name | MODULE (Software) | — | Domain-specific label |
| Data-tier severity indicator | PI CORE | — | Severity visualization |

**Orchestration responsibility:** Spatial Anchor Resolution. Answers "WHERE is the pressure?" — a cognitive location function. Resolves the zone identity through multiple data sources (cascaded resolution). This is a cognitive routing function: try source A, fall back to B, fall back to C.

---

### COMPONENT 11: Propagation Pattern (propagationIntelligence narrative)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Propagation role concept (ORIGIN → PASS_THROUGH → RECEIVER) | PI CORE | — | Causal chain topology is universal (hospital: infection origin → ward transmission → patient reception) |
| Triadic role detection threshold (≥ 2 roles active) | AGENTIC | **Propagation Chain Detection** | Monitors role activation and synthesizes chain meaning |
| Role assignment from DPSIG max_cluster | MODULE (Software) | — | ORIGIN = max code pressure cluster |
| Role assignment from manifest `passthrough_dom` | MODULE (Software) | — | Configuration-declared role |
| "propagates across organizational boundaries" | PI CORE | — | Cross-boundary propagation is universal |
| Domain alias labels in chain string | MODULE (Software) | — | Domain-specific names |
| Evidence chain (per-domain role + backing status) | GOVERNED REPLAY | — | Traceability |

**Orchestration responsibility:** Propagation Chain Detection. Scans evidence blocks for triadic role patterns and SYNTHESIZES a causal chain narrative when the pattern is detected. This is a pattern-matching cognitive function — it looks for a specific structural shape (ORIGIN → PASS_THROUGH → RECEIVER) and produces meaning when found.

---

### COMPONENT 12: Qualification Compression (qualificationIntelligence narrative)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Confidence compression concept | PI CORE | — | Evidence gaps compress decision certainty in any domain |
| Advisory-bound percentage | PI CORE | — | Ratio of ungrounded claims is universal |
| Threshold: band ≠ STRONG OR ratio > 0.4 | AGENTIC | **Compression Detection** | Multi-condition activation |
| Readiness band (STRONG/CONDITIONAL/etc.) | SQO | — | Band is an operational qualification classification |
| "limiting decision certainty to structurally grounded areas only" | PI CORE | — | The operational consequence of compression |
| Evidence chain (band + advisory-bound ratio) | GOVERNED REPLAY | — | Traceability |

**Orchestration responsibility:** Compression Detection. Monitors the relationship between qualification band and grounding ratio and ACTIVATES when the gap becomes operationally significant. Answers: "Is the evidence gap large enough to constrain what the operator can safely decide?"

---

### COMPONENT 13: Intelligence State (SupportRail — emergence indicator grid)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| 8-indicator grid concept | AGENTIC | **Emergence Dashboard** | Meta-cognitive: monitors the state of all cognitive actors |
| Active/nominal binary per narrative | AGENTIC | — | Each indicator reflects whether a cognitive function activated |
| Emergence labels ("Grounding asymmetry detected") | AGENTIC | — | Human-readable activation status |
| Nominal labels ("Grounding distribution nominal") | AGENTIC | — | Human-readable dormant status |
| Filled/empty dot visualization | PI CORE | — | Active/inactive indicator is universal |
| "INTELLIGENCE STATE" label | AGENTIC | — | Names the meta-cognitive function |

**Orchestration responsibility:** Emergence Dashboard. This is a META-COGNITIVE function — it monitors ALL other cognitive actors and presents their activation state as a compact dashboard. It does not produce intelligence itself; it reports on which intelligence functions are active. This is supervisory cognition.

---

### COMPONENT 14: Evidence Boundary (EvidenceBoundarySection)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Confirmed vs Outside Evidence Scope framing | PI CORE | **Evidence Boundary Qualification** | THE core PI cognitive primitive — honest structural transparency |
| `structurally_backed_count` | PI CORE | — | Counting grounded claims |
| `semantic_domain_count` | PI CORE (concept) + MODULE ("domains") | — | Total claims — the term "domain" is module-parameterizable |
| `cluster_count` in "grounded evidence" | MODULE (Software) | — | Clusters are code topology |
| "no structural backing · advisory bound" | PI CORE | — | Advisory-bound framing is universal |
| "These are confirmed unknowns — not assumed healthy states" | PI CORE | — | THE constitutional statement. This is governance-grade cognitive honesty |
| Two-column grid layout | PI CORE | — | Confirmed/unknown binary is universal |

**Orchestration responsibility:** Evidence Boundary Qualification. This is not a passive display — it is a cognitive FRAMING function. It takes raw counts and REFRAMES them as "confirmed knowledge" vs "confirmed unknowns." The reframing IS the cognitive function. Without it, the numbers are just numbers. With it, the operator understands what they know and what they don't know. This is arguably the single most important cognitive function in Program Intelligence.

---

### COMPONENT 15: Structural Conclusion (StructuralConclusionBlock)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Concluding assessment concept | PI CORE | **Structural Assessment Synthesis** | Closing cognitive statement is universal |
| Hardcoded fallback text ("structurally stable") | SYNTHETIC (broken) | — | Not derived from evidence. Should be agentic but currently is not |
| "INVESTIGATE is driven by evidence incompleteness, not structural instability" | PI CORE | — | Distinguishing evidence-gap from structural-failure is a Core insight |
| `readiness_summary.conclusion` field (unused — resolver doesn't produce it) | — | — | The cognitive function EXISTS conceptually but is not yet implemented |

**Orchestration responsibility:** Structural Assessment Synthesis. SHOULD be an active cognitive function that reads all signal/pressure/propagation state and produces a derived concluding assessment. Currently INERT — hardcoded string. The cognitive function is needed but not yet operationalized.

---

### COMPONENT 16: Emergence Narrative System (BALANCED_INTERPRETIVE_NARRATIVES)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| 8-function registry architecture | AGENTIC | **Emergence Orchestration Engine** | THE cognitive orchestration system. Manages activation, priority, composition |
| Threshold-gated activation | AGENTIC | — | Each function is a sentinel that activates on structural conditions |
| PRIMARY/SECONDARY/TERTIARY classification | AGENTIC | **Cognitive Priority Router** | Determines which cognitive outputs get visual weight |
| Three-layer rendering (narrative → basis → evidence chain) | PI CORE | — | Progressive disclosure: meaning → proof → evidence. Universal |
| `authority: 'INTERPRETIVE'` on all outputs | PI CORE | — | Authority classification |
| `emergenceClass` routing to visual weight | AGENTIC | — | TERTIARY = quieter rendering, PRIMARY = lead position |
| `derive(fullReport)` function pattern | AGENTIC | — | Each function is a cognitive actor with inputs and outputs |
| Evidence chain assembly per narrative | GOVERNED REPLAY | — | Traceability contract |
| Structural basis string per narrative | PI CORE | — | Compact evidence summary |

**Orchestration responsibility:** Emergence Orchestration Engine. This is the CENTRAL cognitive orchestrator of the BALANCED surface. It:
1. ACTIVATES cognitive functions based on structural conditions (threshold sentinels)
2. CLASSIFIES their outputs by priority (PRIMARY/SECONDARY/TERTIARY)
3. COMPOSES them into a rendering sequence
4. ROUTES their outputs to the left column summary (via onEmergenceState)
5. GOVERNS their authority (75.x on all outputs)

This is not a rendering system. It is a multi-agent cognitive orchestrator that happens to produce rendered output. The distinction is critical: replacing it with static sections would destroy the orchestration behavior.

---

### COMPONENT 17: Guided Queries (EXECUTIVE_BALANCED expansions)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Query catalog concept | AGENTIC | **Guided Cognition Agent** | Offers the operator depth-navigation paths based on structural state |
| Escalation threshold (advisoryRatio > 0.3 && activated ≥ 2) | AGENTIC | — | Determines WHEN guided cognition becomes available |
| Per-query derive function | AGENTIC | — | Each query is a focused cognitive actor answering a specific question |
| Query tones (forensic, architectural, reflective, alarming) | PI CORE | — | Inquiry register vocabulary is universal |
| Query depths (standard, deep) | PI CORE | — | Depth classification is universal |
| Evidence/structural context per query answer | GOVERNED REPLAY | — | Traceability |
| "What structural evidence supports the emerged narrative patterns?" | AGENTIC | — | Meta-cognitive: interrogates the evidence behind other cognitive functions |
| Domain-specific data in answers (domain counts, signal counts) | PI CORE (concept) + MODULE (terms) | — | |

**Orchestration responsibility:** Guided Cognition. Offers DIRECTED interrogation paths — the operator doesn't need to know what to ask. The system SUGGESTS what to investigate based on structural state. This is advisory cognition: "given what I've shown you, here's what you might want to dig into." The escalation threshold means guided cognition only activates when the specimen is complex enough to warrant it.

---

### COMPONENT 18: Governance Envelope (tier-handoff footer)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Authority declaration concept | PI CORE | — | Constitutional |
| Binary selection (interpretive vs deterministic-only) | AGENTIC | **Authority Mode Router** | Determines which governance declaration to display based on emergence state |
| "Structural derivation primary — bounded interpretive synthesis" | PI CORE | — | Authority model statement |
| "75.x" marker | GOVERNED REPLAY | — | Specific governance authorization reference |
| "evidence-bound" claim | PI CORE | — | Evidence doctrine |

**Orchestration responsibility:** Authority Mode Router. Monitors emergence state and declares the correct authority model. When cognitive actors are active → interpretive declaration. When dormant → deterministic-only declaration. This is a governance routing function.

---

### COMPONENT 19: Report Pack / Evidence Record Affordances

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Evidence record export concept | PI CORE | — | Exporting operational evidence is universal |
| InterrogationTrailBuilder session tracking | AGENTIC | **Interrogation Trail Agent** | Tracks the operator's exploration path through the cognitive surface |
| Export as governed evidence record | GOVERNED REPLAY | — | Exported trail becomes governance artifact |
| Report pack links (HTML reports) | MODULE (Software) | — | Legacy reports from code analysis pipeline |
| Query/expansion exploration counts | AGENTIC | — | Meta-cognitive: counts operator engagement depth |

**Orchestration responsibility:** Interrogation Trail Agent. Tracks the operator's cognitive path through the surface and produces an exportable evidence record. This is unique: it monitors the OPERATOR'S cognition, not the specimen's structure. The trail proves: "this operator explored these paths and reached these depths."

---

### COMPONENT 20: RepModeTag / Indicator Strip

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Mode identity concept | PI CORE | — | Declaring which cognitive mode is active |
| "Executive lens" label | PI CORE | — | Altitude declaration |
| "CEO · consequence-first read" | MODULE-ISH | — | Assumes executive audience. Core concept but this specific framing is persona-specific |
| Zone chips (Z1, Z4) | AGENTIC | — | Names the active cognitive zones |
| BalancedIndicatorStrip (DP/PA — dead code) | DEPRECATED | — | Never rendered. Boardroom codes. |

**Orchestration responsibility:** None — currently static. SHOULD declare which cognitive mode/altitude is active and which zones are engaged.

---

### COMPONENT 21: Decision Posture Actor (DP inline)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Decision posture concept | PI CORE | — | Readiness-to-decide is universal |
| State label ("Executive Ready — Qualified") | SQO | — | Qualification state label |
| Confidence bar (grounded vs advisory %) | PI CORE | **Evidence Confidence Gauge** | Visual compression of grounding state |
| Grounded/total count | PI CORE | — | Evidence counting |
| "advisory bound" label | PI CORE | — | Constitutional vocabulary |
| "DP" actor code | DEPRECATED (Boardroom) | — | Not BALANCED-native |

**Orchestration responsibility:** Evidence Confidence Gauge. Visually compresses the grounding ratio into a scannable bar. Cognitive compression: N domain states → 1 visual gauge.

---

### COMPONENT 22: Executive Synthesis (PRIMARY narrative)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Posture-conditioned narrative branching | PI CORE | — | INVESTIGATE/PROCEED/ESCALATE vocabulary is universal |
| "evidence is incomplete — recommends investigation" | PI CORE | — | Evidence-incompleteness-as-reason is Core |
| "evidence supports forward movement" | PI CORE | — | Evidence-sufficiency is Core |
| "exceeds operational thresholds — executive attention warranted" | PI CORE | — | Threshold-exceeding as escalation trigger is Core |
| Domain count integration ("13 ungrounded domains") | PI CORE (concept) + MODULE ("domains") | — | |
| Signal count integration ("5 elevated signals") | PI CORE | — | |
| Template prose assembly | AGENTIC | **Executive Synthesis Agent** | Composes the lead paragraph from posture + topology + signals |
| Emergence: always when score/posture exist | AGENTIC | — | PRIMARY — always-active cognitive function |
| Evidence chain (readiness, topology, signals) | GOVERNED REPLAY | — | Traceability |

**Orchestration responsibility:** Executive Synthesis Agent. Produces the LEAD cognitive output for the entire BALANCED surface. Reads readiness posture, topology grounding, and signal activation, and synthesizes a single interpretive paragraph. This is the highest-priority cognitive function (PRIMARY) — it always activates when evidence exists.

---

### COMPONENT 23: Governance Posture (governancePosture narrative)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Governance lifecycle availability check | GOVERNED REPLAY | — | Governance lifecycle is replay/legitimacy |
| S-level + provenance narrative | GOVERNED REPLAY | — | Qualification provenance |
| Proposition counts (accepted/rejected/arbitrated) | GOVERNED REPLAY | — | Governance event evidence |
| Governance friction rate | GOVERNED REPLAY | **Governance Friction Detection** | Ratio of friction events to total — measures governance rigor |
| Transition count | GOVERNED REPLAY | — | Lifecycle event counting |
| Authority ceiling (L3) | GOVERNED REPLAY | — | Non-automatable boundary |
| Emergence: only when `governance_lifecycle.available` | AGENTIC | — | Sentinel activation |

**Orchestration responsibility:** Governance Friction Detection. Activates ONLY when governed lifecycle data exists, and synthesizes the governance friction narrative — how much of the qualification process involved challenge, dispute, or rejection. This is a legitimacy-assurance function.

---

### COMPONENT 24: Enrichment Posture (enrichmentPosture narrative)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Substrate self-correction concept | PI CORE | — | Evidence self-correction is universal |
| Enrichment event count | GOVERNED REPLAY | — | Evidence correction events |
| Domain correction count | GOVERNED REPLAY | — | Domains improved |
| Debt evolution (improved/worsened/unchanged) | SQO | **Debt Evolution Tracker** | Operational debt trajectory |
| Emergence: only when enrichment events > 0 | AGENTIC | — | Sentinel activation |

**Orchestration responsibility:** Debt Evolution Tracker. Activates when enrichment has occurred and reports on the debt trajectory — did enrichment improve, worsen, or leave unchanged the semantic debt state? This is a substrate health monitoring function.

---

### COMPONENT 25: Convergence Posture (convergencePosture narrative)

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| Cross-specimen observation concept | PI CORE | — | Comparing governance patterns across specimens is universal |
| Convergence/divergence counts | PI CORE | — | Pattern comparison |
| "Governance patterns generalize across independent specimens" | PI CORE | — | Generalization assessment |
| Observation maturity (DESCRIPTIVE) | PI CORE | — | 2 specimens = comparison, not pattern |
| Emergence: only when total_observations > 0 | AGENTIC | — | Sentinel activation |

**Orchestration responsibility:** Convergence Assessment. Activates when cross-specimen data exists and reports whether governance patterns generalize. This is a meta-cognitive function operating ACROSS specimens rather than within one.

---

### COMPONENT 26: SQO Intelligence Zone

| Sub-field | Stratum | Cognitive Function | Rationale |
|-----------|---------|-------------------|-----------|
| S-state narrative (S2 — Qualified with Debt) | SQO | — | Qualification state description |
| Blocking condition detection | SQO | **Blockage Detection Agent** | Identifies what blocks advancement |
| Progression narrative | SQO | — | Advancement readiness |
| Resolution path | SQO | **Resolution Path Advisor** | Synthesizes what would resolve blockers |
| Cockpit link | SQO | — | Navigation to operational surface |
| Collapsible compact badge | PI CORE | — | Progressive disclosure |

**Orchestration responsibility:** Blockage Detection + Resolution Path Advisory. Two cognitive functions: (1) detect what blocks S-state advancement, (2) synthesize what would resolve it. These are advisory cognitive functions — they don't just report state, they advise on next actions within governance bounds.

---

## COGNITIVE FUNCTION INVENTORY

The stratum decomposition identifies **15 distinct cognitive functions** operating within the BALANCED surface:

### Tier 1: Orchestration Functions (manage other cognitive functions)

| # | Cognitive Function | Stratum | Description |
|---|-------------------|---------|-------------|
| 1 | **Emergence Orchestration Engine** | AGENTIC | Central orchestrator. Activates, classifies, composes, routes all narrative cognitive actors |
| 2 | **Cognitive Priority Router** | AGENTIC | Assigns PRIMARY/SECONDARY/TERTIARY weight to cognitive outputs |
| 3 | **Emergence Dashboard** | AGENTIC | Meta-cognitive: monitors and reports activation state of all cognitive actors |

### Tier 2: Synthesis Functions (produce compound meaning from multiple inputs)

| # | Cognitive Function | Stratum | Description |
|---|-------------------|---------|-------------|
| 4 | **Executive Synthesis Agent** | AGENTIC | Composes lead paragraph from posture + topology + signals |
| 5 | **Posture Synthesis** | AGENTIC | Combines band + posture + qualifier → single readiness state |
| 6 | **Trust Posture Synthesis** | AGENTIC | Combines S-state + grounding + maturity → trust classification |
| 7 | **Compound Activation Agent** | AGENTIC | Detects multi-signal co-activation and synthesizes emergent meaning |

### Tier 3: Detection Functions (sentinel — activate on structural conditions)

| # | Cognitive Function | Stratum | Description |
|---|-------------------|---------|-------------|
| 8 | **Grounding Asymmetry Detection** | AGENTIC | Monitors grounding ratio, activates at threshold |
| 9 | **Pressure Concentration Detection** | AGENTIC | Multi-condition sentinel (signal count + severity + zone) |
| 10 | **Propagation Chain Detection** | AGENTIC | Pattern-matching: ORIGIN → PASS_THROUGH → RECEIVER |
| 11 | **Compression Detection** | AGENTIC | Monitors band-vs-ratio gap |
| 12 | **Governance Friction Detection** | GOVERNED REPLAY | Activates when governance lifecycle reveals friction |

### Tier 4: Interpretation Functions (produce meaning from single inputs)

| # | Cognitive Function | Stratum | Description |
|---|-------------------|---------|-------------|
| 13 | **Signal Interpretation Agent** | AGENTIC | Per-signal meaning-in-context prose |
| 14 | **Evidence Boundary Qualification** | PI CORE | Reframes raw counts as "confirmed knowledge vs confirmed unknowns" |
| 15 | **Spatial Anchor Resolution** | AGENTIC | Cascaded resolution of pressure zone identity |

### Tier 5: Tracking / Advisory Functions

| # | Cognitive Function | Stratum | Description |
|---|-------------------|---------|-------------|
| 16 | **Temporal Cognition Agent** | SQO | Tracks confidence evolution across epochs |
| 17 | **Guided Cognition Agent** | AGENTIC | Offers directed interrogation paths based on structural state |
| 18 | **Interrogation Trail Agent** | AGENTIC | Tracks operator's exploration path, produces evidence record |
| 19 | **Confidence Classification** | AGENTIC | Compresses per-domain confidence into tiered posture |
| 20 | **Blockage Detection + Resolution Advisory** | SQO | Identifies blockers and advises resolution |
| 21 | **Debt Evolution Tracker** | SQO | Reports debt trajectory after enrichment |
| 22 | **Authority Mode Router** | AGENTIC | Declares correct governance authority based on emergence state |

### Non-functional (should exist but currently inert)

| # | Cognitive Function | Status | Description |
|---|-------------------|--------|-------------|
| 23 | **Structural Assessment Synthesis** | INERT (hardcoded) | Should derive closing assessment from all signal/pressure state. Currently static string. |

---

## STRATUM DISTRIBUTION SUMMARY

### Per-stratum field count (approximate, from tag pass):

| Stratum | Field Count | % of Total | Character |
|---------|------------|------------|-----------|
| PI CORE | ~45 | 33% | Constitutional primitives that survive domain substitution |
| AGENTIC ORCHESTRATION | ~40 | 29% | Cognitive functions: activation, synthesis, routing, pacing |
| GOVERNED REPLAY | ~25 | 18% | Evidence traceability, governance lifecycle, legitimacy proof |
| SQO OPERATIONAL | ~15 | 11% | Reconciliation, maturity, progression, debt mechanics |
| DOMAIN MODULE | ~12 | 9% | Software/code/GitHub-specific terms and signal families |

### Key finding: AGENTIC is the second-largest stratum

The agentic cognitive orchestration layer accounts for ~29% of the BALANCED surface's sub-fields. This confirms the realization: BALANCED is not a dashboard. It is a governed multi-agent cognitive surface where 22+ cognitive functions operate, most of which were never explicitly designed as agents but emerged through iterative enrichment.

### Key finding: MODULE is the smallest stratum

Only ~9% of sub-fields are domain-specific (Software Intelligence). The vast majority of BALANCED's cognitive richness is specimen-independent. This confirms: Program Intelligence is NOT Software Intelligence. Software Intelligence occupies less than 10% of the cognitive surface.

---

## IMPLICATIONS

### 1. The Core Spine is Real and Large
33% PI Core + 29% Agentic = 62% of the BALANCED surface is specimen-independent cognitive architecture. This is the Program Intelligence discipline itself.

### 2. Module Attachment Points Are Already Visible
The ~9% Module fields are concentrated in: signal family names, cluster/node terms, zone anchor labels, propagation role assignment, and resolution hints. These are the exact points where a different domain module would inject different terms. The attachment interface is already implicit.

### 3. SQO is an Overlay, Not the Center
At ~11%, SQO is genuinely an operational overlay — it makes the Core cognition actionable but is not the cognition itself. This confirms: SQO is the operational qualification substrate, not the entirety of PI.

### 4. Governed Replay is the Legitimacy Envelope
At ~18%, replay provides evidence traceability and governance proof across all other strata. It wraps intelligence in legitimacy — exactly as the BOARDROOM doctrine stated.

### 5. 22 Cognitive Functions Already Exist
The BALANCED surface contains 22 identifiable cognitive functions across 5 tiers (orchestration, synthesis, detection, interpretation, tracking). These are not hypothetical agents — they are operational cognitive actors that already activate, synthesize, route, and compose. The forensic report proves they exist. The stratum decomposition names them.

### 6. The Structural Conclusion Is the Missing Agent
The only identified cognitive function that SHOULD exist but doesn't is Structural Assessment Synthesis — the closing assessment. It is currently a hardcoded string. This is the one gap where a cognitive function was needed and not built.
