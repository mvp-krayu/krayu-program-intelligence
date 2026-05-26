# Software Intelligence — MVP Domain Cognition Module Definition

> **Status:** LOCKED — Canonical MVP capability model
> **Stream:** PI.SOFTWARE-INTELLIGENCE.DOMAIN-REASONING-MVP-DEFINITION.01
> **Classification:** G2 — Architecture-Consuming
> **Date:** 2026-05-26
> **Baseline:** PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01 (10 CFs locked)

---

## 1. What Software Intelligence IS

Software Intelligence is the operational cognition compression of PI Core's structural truth into domain-specific meaning that makes software systems inspectable, qualifiable, and governable.

It answers 9 irreducible operational questions that an engineering leader asks when inspecting a software system — not "what are the structural metrics?" but "where does this system break during delivery?"

Software Intelligence is NOT:
- Code metrics aggregation
- Repository visualization
- GitHub analytics
- AI commentary or generative interpretation
- Taxonomy mapping (folder → prettier label)
- A separate product — it is a domain cognition module WITHIN PI

---

## 2. Foundational Doctrine: Capability ≠ Panel

A SW-Intel capability is a **runtime cognition state**, not a rendered panel or card.

Activating a capability transitions the entire runtime into a domain-specific cognition mode where:

1. **Topology focus** — the SVG topology actively reorganizes: relevant domains enlarge/highlight, irrelevant domains dim, corridors/boundaries/zones become visible or invisible. This is active topology behavior, not overlay decoration.
2. **Cognition-state transition** — the system enters a different reasoning mode. The same domain node means something different under PRESSURE_INTELLIGENCE (pressure attractor) vs COORDINATION_LOAD (coordination hub) vs SOFTWARE_TOPOLOGY_POSTURE (structural baseline).
3. **Adaptive side-panel context** — left and right panels adapt to the active cognition state. They render the cognition state's interpretation, evidence, and guided queries — not capability-specific "cards."
4. **Query/action adaptation** — guided queries and available actions change based on which cognition state is active.
5. **Evidence drilldown** — each cognition state exposes domain-specific evidence paths.
6. **Orchestration implication** — each cognition state produces findings that feed Layer 2 orchestration.

A capability MAY have a compact summary card in the surface list — but that card is an entry point to a cognition state, not the capability itself.

---

## 3. The 9 Irreducible Operational Questions

| # | Operational Question | Why It Matters |
|---|---|---|
| OQ-1 | Where does execution pressure concentrate, and what type of pressure is it? | Pressure without type classification is "stress somewhere." Operators need: delivery pressure, coordination overload, integration saturation. |
| OQ-2 | How does change propagate through the system, and which corridors amplify impact? | Without propagation intelligence, release impact is invisible until post-deployment. |
| OQ-3 | Which structures coordinate runtime behavior, and where does coordination create bottleneck? | High-centrality domains are operational chokepoints. A failure there cascades differently than at the edge. |
| OQ-4 | Where does delivery and release fragility emerge? | Fragility is composite: pressure + propagation + coordination + validation gaps converging on the same domains. |
| OQ-5 | Which validation surfaces constrain operational trust? | Coverage asymmetry means qualification is uniform fiction unless mapped to operational roles. |
| OQ-6 | Which integrations create operational exposure at domain boundaries? | Cross-domain bridges carry disproportionate risk. Integration stress is where systems fail in production. |
| OQ-7 | What is the operational topology posture of the software system? | Without posture, there's no baseline against which to measure pressure or fragility. |
| OQ-8 | Where does operational qualification maturity vary across the system? | Without domain-level trust interpretation, qualification is a single S-level for the whole specimen. |
| OQ-9 | Which delivery-critical paths are execution spines that, if broken, cascade failure? | Corridor failure is a system-level cascade, not a single-domain failure. |

---

## 4. Capability Model — 9 Capabilities, 3 Tiers

### 4.1 Capability Registry

| OQ | Capability | Abbreviation | Type | Tier |
|---|---|---|---|---|
| OQ-1 | PRESSURE_INTELLIGENCE | PI | Primitive | 1 — Always Active |
| OQ-7 | SOFTWARE_TOPOLOGY_POSTURE | STP | Primitive | 1 — Always Active |
| OQ-8 | SOFTWARE_QUALIFICATION_POSTURE | SQP | Primitive | 1 — Always Active |
| OQ-3 | COORDINATION_LOAD | CL | Primitive | 2 — Condition-Activated |
| OQ-2 | CHANGE_PROPAGATION | CP | Primitive | 2 — Condition-Activated |
| OQ-6 | INTEGRATION_EXPOSURE | IE | Primitive | 2 — Condition-Activated |
| OQ-4 | DELIVERY_FRAGILITY | DF | **Composite** | 2 — Condition-Activated |
| OQ-9 | EXECUTION_CORRIDORS | EC | Primitive | 3 — Evidence-Conditional |
| OQ-5 | VALIDATION_COVERAGE | VC | Primitive | 3 — Evidence-Conditional |

### 4.2 Tier Rules

| Tier | Activation Rule | Capabilities |
|---|---|---|
| **Tier 1 — Always Active** | Activate whenever SW-Intel toggle is ON | STP, PI, SQP |
| **Tier 2 — Condition-Activated** | Activate when specific evidence patterns are present | DF, CL, CP, IE |
| **Tier 3 — Evidence-Conditional** | Activate only when specific artifacts are wired | EC, VC |

### 4.3 Composite vs Primitive

| Classification | Capabilities | Meaning |
|---|---|---|
| **Primitive** | PI, CP, CL, VC, IE, STP, SQP, EC | Answers one irreducible operational question from one or two evidence sources. Resolves independently. |
| **Composite** | DF | Synthesizes findings from multiple primitives. DF = convergence of PI + CP + CL + VC on overlapping domains. Resolves AFTER primitives. |

### 4.4 Naming Convention

Full name in contract definitions and governance documents. Abbreviation in runtime props and CSS classes.

---

## 5. Capability Specifications

### 5.1 PRESSURE_INTELLIGENCE (PI) — Tier 1

**Operational question:** Where does execution pressure concentrate, and what type of pressure is it?

**CF coverage:** CF-01 (Pressure Interpretation) primary, CF-09 (Pressure-Aware Topology) secondary.

**Evidence required:** pressure_zone_state (zones, conditions, anchors), signal_interpretations (pressure-correlated signals), evidence_blocks (pressure evidence).

**Topology behavior:** Pressure zone boundaries render as bounding rects. Zone anchor domain highlighted. Zone member domains get colored stroke. Non-zone domains dim. Pressure zones become the dominant topology layer.

**Left panel:** Zone classification (delivery/coordination/integration/compound), condition decomposition, anchor domain operational meaning, pressure propagation direction, structural evidence grid.

**Right panel:** Guided queries — "Why does [anchor domain] concentrate pressure?", "Which conditions are delivery-correlated?", "What structural properties make [anchor] a pressure attractor?" Actions — "Inspect pressure zone members", "Trace condition origins."

**Orchestration:** Pressure findings feed as attention signals. "Inspect DOMAIN-04 pressure convergence — 3 conditions active, compound zone."

**GENESIS readiness:** READY_FOR_REASONING. pressure_zone_state.json wired (Stream 3). signal_projection.json exists on disk (optional enrichment, not yet wired).

### 5.2 SOFTWARE_TOPOLOGY_POSTURE (STP) — Tier 1

**Operational question:** What is the operational topology posture of the software system?

**CF coverage:** CF-07 (Topology Role Abstraction) primary.

**Evidence required:** semantic_domain_registry, structural_enrichment (role distribution, centrality), topology_summary (connection data, graph metrics).

**Topology behavior:** STP IS the topology's default operational cognition state. Domain nodes sized by operational weight, colored by operational role classification, labeled with operational names. The topology becomes readable as an operational system: "this is the runtime spine, these are validation supports, these are receiver-pattern domains."

**Left panel — Operational topology interpretation (NOT statistics):** What is the topology dominated by? Is the runtime spine strong or fragile? Which domains are operationally grounded vs operationally passive? Are domain/corridor relationships clear or tangled?

**Right panel:** "Is the runtime spine resilient or single-point-of-failure?", "Which domains are operationally passive (structural noise)?", "Is operational gravity concentrated or distributed?"

**Orchestration:** Baseline context for all other capability signals. "DOMAIN-04 pressure is critical because STP shows it is the sole runtime spine hub."

**GENESIS readiness:** READY_FOR_FULL_PRODUCT_PROJECTION. All data in fullReport.

**Boundary:** STP answers "what does the topology shape imply operationally?" — NOT "how many domains and connections." If STP produces a statistics dashboard, it has regressed into generic structural health.

### 5.3 SOFTWARE_QUALIFICATION_POSTURE (SQP) — Tier 1

**Operational question:** Where does operational qualification maturity vary across the system?

**CF coverage:** CF-06 (Execution Governance) primary, CF-10 (Engineering Qualification) secondary.

**Evidence required:** governance_lifecycle (SQO state, governance actions), reconciliation_summary, proposition_corpus (if available).

**Topology behavior:** Operational trust gradient on domain nodes. Grounded domains (governance evidence) get solid treatment. Partially grounded get semi-transparent treatment. Ungrounded (zero governance evidence) get muted/dashed treatment. This is a trust topology, NOT a governance lifecycle display.

**Left panel — Operational trust interpretation (NOT governance artifact rendering):** Where can leadership trust operational conclusions? Where is trust assumed without evidence? Which structurally critical domains are grounded vs ungrounded? What does the current S-level imply for operational decisions?

**Right panel:** "Which operationally critical domains have ungrounded trust?", "Does trust grounding correlate with structural role?", "What operational decisions are limited by current qualification maturity?"

**Orchestration:** "8 domains have ungrounded operational trust — conclusions about those regions should be marked as structurally unverified."

**GENESIS readiness:** READY_FOR_FULL_PRODUCT_PROJECTION. All data in fullReport.

**Boundary (constitutional):** SQP interprets what qualification state MEANS for software operational trust. It does NOT render governance lifecycle, SQO state transitions, or governance action logs. Those belong to PI Core / SQO (Layer 1/2). If SQP renders governance artifacts, it has regressed.

**Test:** SQO shows "S1, 4 governance actions." SQP shows "At S1, operational trust is grounded for hub domains but ungrounded for 8 satellite domains — deployment decisions affecting ungrounded regions carry implicit trust debt."

### 5.4 COORDINATION_LOAD (CL) — Tier 2

**Operational question:** Which structures coordinate runtime behavior, and where does coordination create bottleneck?

**CF coverage:** CF-03 (Coordination Spine Detection) primary, CF-08 (Operational Attention Routing) secondary.

**Evidence required:** structural_enrichment (structural_centrality, structural_roles), semantic_domain_registry, topology_summary.

**Activation condition:** structural_enrichment contains domains with hub or spine roles.

**Topology behavior:** Hub/spine domains enlarge or get border emphasis. Coordination load proportional to visual weight. Satellite/leaf domains shrink or dim. Connection edges from hub/spine to dependents become prominent.

**Left panel:** Hub identification with connection count, spine identification with dependent count, coordination concentration ratio, role distribution table, per-domain centrality scores.

**Right panel:** "What happens if [hub domain] becomes unavailable?", "Is coordination concentrated or distributed?", "Which satellite domains have no alternative coordination path?"

**Orchestration:** "DOMAIN-04 coordinates 4 downstream domains — changes here require coordination-aware review."

**GENESIS readiness:** READY_FOR_FULL_PRODUCT_PROJECTION. structural_enrichment in fullReport.

### 5.5 CHANGE_PROPAGATION (CP) — Tier 2

**Operational question:** How does change propagate through the system, and which corridors amplify impact?

**CF coverage:** CF-05 (Release/Deployment Cognition) primary, CF-02 (Execution Corridor Detection) secondary.

**Evidence required:** propagation_summary (paths, affected domains, depth), structural_enrichment, semantic_domain_registry.

**Activation condition:** propagation_summary contains paths with ≥2 affected domains.

**Topology behavior:** Propagation paths highlighted as directional edges (arrows). High-amplification corridors get thicker/brighter edges. Source domains get origin markers. Terminal domains get impact markers. Non-corridor domains dim.

**Left panel:** Corridor count, max depth, amplification factor per corridor, source → terminal domain chains, corridor/pressure zone overlap. Propagation path enumeration with domain role at each hop.

**Right panel:** "Which corridors carry the highest amplification?", "Do propagation corridors intersect pressure zones?", "Which terminal domains receive propagated impact without originating it?"

**Orchestration:** "Review propagation impact before changes to DOMAIN-04 — corridor amplification 2.3x across 4 domains."

**GENESIS readiness:** READY_FOR_FULL_PRODUCT_PROJECTION. propagation_summary in fullReport.

### 5.6 INTEGRATION_EXPOSURE (IE) — Tier 2

**Operational question:** Which integrations create operational exposure at domain boundaries?

**CF coverage:** CF-01 (Pressure Interpretation) secondary, CF-03 (Coordination Spine Detection) secondary.

**Evidence required:** structural_enrichment (bridge roles, cross-domain connections), semantic_domain_registry (domain boundaries), topology_summary (edge data).

**Activation condition:** structural_enrichment contains bridge-role domains.

**Topology behavior:** Bridge domains highlighted with distinct border treatment. Cross-domain edges become visible/colored. Domain boundaries become visible as boundary indicators. Non-bridge, non-boundary domains dim.

**Left panel:** Bridge domain identification with connection count per boundary crossed, cross-boundary coupling ratio, which boundaries have most cross-traffic, bridge/pressure intersection.

**Right panel:** "Which domain boundaries carry the most cross-traffic?", "Are bridge domains also pressure attractors?", "What is the cross-boundary coupling trend?"

**Orchestration:** "DOMAIN-09 bridges 2 domain boundaries — changes here affect cross-domain integration surface."

**GENESIS readiness:** READY_FOR_FULL_PRODUCT_PROJECTION. structural_enrichment in fullReport. Note: GENESIS has limited bridge domains (0-2 depending on threshold).

### 5.7 DELIVERY_FRAGILITY (DF) — Tier 2 (Composite)

**Operational question:** Where does delivery and release fragility emerge?

**CF coverage:** CF-01 + CF-02 + CF-03 + CF-04 + CF-05 (composite of multiple CFs through primitives).

**Evidence required:** Resolved findings from PI, CP, CL, VC. Reads resolved primitive outputs, NOT raw fullReport.

**Activation condition:** ≥2 primitive capabilities report findings on overlapping domains. Resolves AFTER primitives.

**Topology behavior:** Composite layer: pressure zone boundaries (from PI) + corridor arrows (from CP) + hub emphasis (from CL), all visible simultaneously. Domains where multiple factors converge get a fragility indicator (compound border treatment). Domains with 0-1 factors dim. This is the ONLY capability that composites multiple topology treatments.

**Left panel:** Per-domain factor count (which of PI/CP/CL/VC contribute), convergence domains ranked by factor count, specific evidence from each contributing primitive. NOT a new interpretation — a structured convergence of already-resolved findings.

**Right panel:** "Why does [domain] show delivery fragility convergence?", "Which contributing factor is most severe?", "Are fragility factors correlated or independent?"

**Orchestration:** Highest-priority signal. "DOMAIN-04 shows 4-factor delivery fragility convergence — inspect before any release-affecting change."

**GENESIS readiness:** READY_FOR_REASONING. Depends on primitive availability. If VC absent, resolves from 3/4 factors.

### 5.8 EXECUTION_CORRIDORS (EC) — Tier 3

**Operational question:** Which delivery-critical paths are execution spines that, if broken, cascade failure?

**CF coverage:** CF-02 (Execution Corridor Detection) primary.

**Evidence required:** propagation_summary (path data), spine_objects (40.4 structural spine data), structural_enrichment.

**Activation condition:** spine_objects.json artifact present. Partial activation from propagation_summary alone.

**Topology behavior:** Execution corridors as thick, directional paths through topology. Primary corridors get strongest treatment. Corridor intersection points get special emphasis. Non-corridor domains dim. Distinct from CP (all propagation); EC shows only critical spines.

**Left panel:** Corridor enumeration with depth/traffic metrics, criticality ranking, corridor/pressure intersection, corridor/coordination intersection.

**Right panel:** "What happens if the primary corridor is disrupted?", "Do corridors intersect pressure zones?", "Which corridor carries the most operational traffic?"

**Orchestration:** "Primary execution corridor traverses 3 domains — changes to any corridor member affect the delivery-critical path."

**GENESIS readiness:** PARTIAL_FOR_REASONING. propagation_summary in fullReport. spine_objects.json exists on disk but not wired. Can derive partial corridors from propagation paths.

### 5.9 VALIDATION_COVERAGE (VC) — Tier 3

**Operational question:** Which validation surfaces constrain operational trust?

**CF coverage:** CF-04 (Validation Intelligence) primary.

**Evidence required:** coverage_state (per-domain coverage indicators), signal_interpretations (test/validation signals), evidence_blocks (test evidence).

**Activation condition:** coverage_state artifact present. Graceful absence — capability simply does not appear.

**Topology behavior:** Coverage gradient on domain nodes. Well-covered = green-tinted border. Under-covered = yellow→orange→red tinting. Zero-coverage = distinct "uncovered" indicator. Coverage asymmetry immediately visible as topology property.

**Left panel:** Per-domain coverage relative to system mean, coverage concentration ratio, zero-coverage domains, coverage/pressure intersection.

**Right panel:** "Which operationally critical domains have the lowest coverage?", "Does coverage asymmetry correlate with structural role?", "Which domains would benefit most from additional validation?"

**Orchestration:** "DOMAIN-04 is a coordination hub with below-mean coverage — qualification posture may not reflect operational risk."

**GENESIS readiness:** PARTIAL_FOR_REASONING. coverage_state.json exists on disk but not wired. Test-related signals in signal_interpretations provide partial coverage picture.

---

## 6. CF Coverage Matrix

| CF | Function | Primary | Secondary | Coverage |
|---|---|---|---|---|
| CF-01 | Pressure Interpretation | PI | DF, IE | FULL |
| CF-02 | Execution Corridor Detection | EC | CP | FULL |
| CF-03 | Coordination Spine Detection | CL | IE | FULL |
| CF-04 | Validation Intelligence | VC | DF (via VC) | FULL |
| CF-05 | Release/Deployment Cognition | CP | DF, EC | FULL |
| CF-06 | Execution Governance | SQP | — | FULL |
| CF-07 | Topology Role Abstraction | STP | — | FULL |
| CF-08 | Operational Attention Routing | Cross-cutting | All capabilities | FULL |
| CF-09 | Pressure-Aware Topology | PI + STP | — | FULL |
| CF-10 | Engineering Qualification | SQP | — | FULL |

All 10 CFs covered. No orphan CFs. No capability without CF grounding. CF-08 emerges from multi-capability signal convergence.

---

## 7. GENESIS Evidence Readiness

### Readiness Classification

- **READY_FOR_REASONING** — all primary evidence in fullReport. Capability resolves, produces cognition state transitions, generates guided queries, feeds orchestration. The operational question is answerable.
- **READY_FOR_FULL_PRODUCT_PROJECTION** — all evidence sources (including optional enrichment artifacts) wired. Richest possible output. Product-grade.

| Capability | Reasoning Readiness | Product Readiness | Gap |
|---|---|---|---|
| STP | READY | READY | None |
| PI | READY | PARTIAL | signal_projection.json not wired |
| SQP | READY | READY | None |
| CL | READY | READY | None |
| CP | READY | READY | None |
| IE | READY | READY | None |
| DF | READY (from primitives) | PARTIAL (weakest primitive) | VC contributes if present |
| EC | PARTIAL | PARTIAL | spine_objects.json not wired |
| VC | PARTIAL | PARTIAL | coverage_state.json not wired |

**6/9 READY_FOR_REASONING. 3/9 PARTIAL_FOR_REASONING. 0/9 BLOCKED.**

### Artifacts Needing Wiring

1. `spine_objects.json` — `clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/40.4/spine_objects.json` — enriches EC
2. `coverage_state.json` — `clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/semantic/coverage_state.json` — enriches VC
3. `signal_projection.json` — `clients/blueedge/psee/runs/run_blueedge_genesis_e2e_03/75.x/signal_projection.json` — enriches PI

Standard pattern: manifest entry → resolver extraction → payload inclusion.

---

## 8. Current Contract Migration

| Current Contract | Disposition | Maps To | Change |
|---|---|---|---|
| DELIVERY_FRAGILITY | KEEP | DF | Refactor: must become composite (resolve from primitives, not raw fullReport) |
| COORDINATION_SATURATION | RENAME | CL | Saturation → load (measurable from evidence) |
| INTEGRATION_EXPOSURE | KEEP | IE | Ensure corridor-awareness |
| OPERATIONAL_TOPOLOGY | SPLIT | STP + PI | System posture vs pressure interpretation are distinct |
| QUALIFICATION_EXPOSURE | RENAME + BOUNDARY | SQP | Exposure → posture. SQP interprets, does not own SQO |
| PROPAGATION_RISK | TRANSFORM | CP | Risk → propagation (structural evidence, not interpretation) |

New capabilities: EC (fills CF-02), VC (fills CF-04). STP partially existed as half of OPERATIONAL_TOPOLOGY.

Net: 6 contracts → 9 capabilities. 4 keep/rename, 1 splits to 2, 1 transforms, 2 new.

---

## 9. Runtime Reality Gap Map

| CF | Status | Gap | Priority |
|---|---|---|---|
| CF-01 | PARTIAL | Interpretation inline in contract, not pipeline-derived | P1 |
| CF-02 | NOT IMPLEMENTED | Spine extraction not performed | P2 |
| CF-03 | PARTIAL | Hub identification by role label, not computed load | P2 |
| CF-04 | NOT IMPLEMENTED | Coverage artifact not wired | P3 |
| CF-05 | PARTIAL | Release corridor identification not performed | P2 |
| CF-06 | OPERATIONAL | Fully wired | — |
| CF-07 | OPERATIONAL | Fully wired | — |
| CF-08 | IMPLICIT | No explicit attention routing algorithm | P3 |
| CF-09 | OPERATIONAL | Pressure zones render on topology | — |
| CF-10 | OPERATIONAL | SQO bridge + governance lifecycle wired | — |

---

## 10. Implementation Sequencing

### Phase A — Model Lock (this stream)

Freeze the 9-capability model. Produce this document.

### Phase B — Evidence Adapter Layer

Build typed evidence adapter between PI Core payload and capability contracts. Manifest entries for spine_objects, coverage_state, signal_projection. Each capability receives structured evidence, not raw fullReport.

### Phase C — Capability Contract Refactoring

Replace 6 contracts with 9 capability contracts. 8 primitive contracts with resolve(evidence). 1 composite contract with resolve(resolvedPrimitives). Resolution order: primitives first, composites second. Each contract specifies topology interaction.

### Phase D — Cognition State Projection (Topology-First)

Wire contracts into LENS as runtime cognition states. Mandatory: every capability MUST express through active topology behavior before panels. Validation test: "If side panels were removed, would the topology alone communicate the capability's meaning?"

### Phase E — Guided Orchestration Integration

Wire resolved contracts into Layer 2. Orchestration CONSUMES SW-Intel findings. SW-Intel does NOT own orchestration actions.

---

## 11. Stream Failure Conditions

The implementation fails if ANY of the following are true at completion:

1. **9 stacked cards.** Capabilities are runtime cognition states, not panels.
2. **Topology unchanged.** Activating a capability must change active topology behavior.
3. **SQP renders governance artifacts.** SQP interprets trust, does not render SQO lifecycle.
4. **STP produces statistics.** STP interprets operational topology meaning, not generic metrics.
5. **Capabilities own orchestration.** No capability produces "you should do X." Findings feed Layer 2.
6. **Raw fullReport access.** Contracts receive typed evidence from adapter, not raw fullReport.
7. **No cognition state transition.** Activating a capability must change queries, panels, AND orchestration implications.

---

## 12. Layer Boundary Enforcement

| Layer | Owns | Does NOT Own |
|---|---|---|
| Layer 1 — PI Core | Structural truth computation, evidence, topology, signals, SQO state machine, governance lifecycle | Domain-specific interpretation, guided actions, operational meaning |
| Layer 2 — Orchestration Runtime | Guided progression, operator actions, SQO execution bridge, action engine | Structural truth, domain cognition, capability resolution |
| Layer 3 — Software Intelligence | Domain-specific interpretation, capability contracts, cognition state projection, operational meaning | Truth computation, orchestration actions, SQO state management |

SW-Intel reads Layer 1 outputs through the evidence adapter. SW-Intel produces findings consumed by Layer 2. SW-Intel never computes truth or owns orchestration.
