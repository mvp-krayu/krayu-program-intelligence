# Persona Mission Contracts and Cognitive Objectives

**Stream:** PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01
**Classification:** G1 — Architecture-Mutating
**Baseline:** 332365c (existing slice audit merged to main)

---

## §1 — Executive Summary

Software Intelligence ontology consumption requires locked persona objectives.

The five SW-INTEL ontology classes (Flow & Propagation, Concentration & Saturation, Fragility & Resilience, Reinforcement & Accumulation, Drift & Instability) cannot be consumed safely by personas whose cognitive objectives are defined only as one-line taglines. The taglines overlap, lack mutual exclusivity, and do not distinguish between what a persona DOES, what it EXISTS FOR, and what it MUST NOT DO.

This document replaces the persona tagline model with locked Persona Mission Contracts. Each contract defines the constitutional objective, consumed and prohibited cognition, attention control model, operator agency, authority projection, success and failure conditions, and disappearance consequence for one persona.

This document is the mandatory baseline for:

**PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-CONSUMPTION-MODEL.01**

No ontology consumption modeling may proceed without these contracts locked.

---

## §2 — Problem Statement

### §2.1 — The Current Persona Taglines

| Persona | Tagline | Mode |
|---|---|---|
| BOARDROOM | "What matters?" | Compresses |
| BALANCED | "Why operationally?" | Explains |
| DENSE | "How structurally?" | Proves structurally |
| INVESTIGATION | "Prove it." | Derivation chains |

### §2.2 — Why These Are Insufficient

**Not mutually exclusive.** "How structurally?" (DENSE) and "Prove it." (INVESTIGATION) overlap — structural proof IS proof. "What matters?" (BOARDROOM) and "Why operationally?" (BALANCED) overlap — operational consequence IS what matters to an executive.

**Not objective-driven.** The taglines describe a vague cognitive posture, not what the operator is trying to ACCOMPLISH. An objective is: "I need to decide whether to deploy this week" or "I need to verify this claim traces to evidence." The taglines don't connect to operator objectives.

**Not constitutional.** The taglines compress orchestration model, attention control, agency, and authority projection into a single mnemonic. They cannot serve as a baseline for governance decisions about what each persona may or may not consume.

**Insufficient for ontology consumption.** If DENSE consumes "how structurally," does it consume ALL five ontology classes at full depth? Does BOARDROOM compress ALL five equally? The taglines cannot answer these questions because they lack consumed/prohibited cognition definitions.

**Risky as implementation baseline.** The taglines allow implementation drift. A developer interpreting "Why operationally?" could build BALANCED as BOARDROOM-longform, DENSE-lite, or INVESTIGATION-with-prose. The taglines do not constrain.

---

## §3 — Persona Definition Model

Each persona contract uses 16 fields:

| # | Field | Purpose |
|---|---|---|
| 1 | Constitutional Objective | Why this persona exists — the cognitive gap it fills |
| 2 | Primary Question | The question the operator is asking when they select this persona |
| 3 | Forbidden Questions | Questions this persona must NOT attempt to answer |
| 4 | Operator Objective | What the operator is trying to accomplish (decision, understanding, exploration, verification) |
| 5 | Runtime Responsibility | What the runtime must do when this persona is active |
| 6 | Cognition Consumed | Which cognitive functions and data are active |
| 7 | Cognition Prohibited | Which cognitive functions and data must NOT be active |
| 8 | Attention-Control Model | Who controls what the operator sees — system, operator, or co-discovery |
| 9 | Operator-Agency Model | How much control the operator has over navigation and focus |
| 10 | Authority-Projection Model | How governance presents itself in this persona |
| 11 | Success Condition | What must be true for this persona to have served the operator |
| 12 | Failure Condition | What indicates this persona has failed its cognitive responsibility |
| 13 | Disappearance Consequence | What the runtime loses if this persona is removed |
| 14 | SW-INTEL Ontology Consumption Posture | How this persona relates to the five ontology classes (preparatory) |
| 15 | Implementation Freshness | Whether the current implementation matches this contract |
| 16 | Revalidation Requirement | What must be verified before this persona is considered aligned |

---

## §4 — BOARDROOM Mission Contract

### §4.1 — Constitutional Objective

**Executive consequence qualification.**

BOARDROOM exists to help an executive allocate attention to the few consequences that matter now. It compiles structural intelligence into a pre-decided verdict. The operator receives a conclusion, not exploration.

### §4.2 — Primary Question

"Given everything the system knows, what requires my attention and what is my governance position?"

This is NOT "What matters?" — that is too vague. The BOARDROOM question is specifically about ATTENTION ALLOCATION and GOVERNANCE POSITION. The executive needs to know: where to look, how serious it is, and whether the intelligence is governed or advisory.

### §4.3 — Forbidden Questions

- "How does this structural pattern work?" → DENSE
- "What is the full operational sequence?" → BALANCED
- "Can I verify this claim?" → INVESTIGATION
- "What are the contributing signals?" → DENSE / INVESTIGATION
- "What should I do about this?" → prohibited entirely (13 prohibitions enforced)

### §4.4 — Operator Objective

Decide whether to ACT, DELEGATE, or DEFER based on a compiled intelligence verdict. The executive reads a briefing, not a report. They receive a position, not data.

### §4.5 — Runtime Responsibility

Produce a deterministic compiled projection from the resolved payload. The runtime decides BEFOREHAND what the operator sees. There is no runtime discovery, no emergence, no operator-driven navigation.

Implementation: `compileBoardroomProjection()` produces 9 compiled sections: qualification_posture, tension_summary, signal_intelligence, domain_coverage, governed_narrative, governance_legitimacy, propagation_chain, topology_reference, authority_declaration. This is a fixed sequence — same structural state always produces same verdict.

### §4.6 — Cognition Consumed

| Function | Projection State | Evidence |
|---|---|---|
| Executive Synthesis (#4) | DOMINANT — 5 compiled outputs | BoardroomProjectionCompiler L60-180 |
| Pressure Concentration (#9) | DOMINANT — ~40% of surface | Signal family chips, pressure bars |
| Propagation Chain (#10) | PRESENT — elevated visual | Propagation chain origin/passthrough/receiver |
| Governance Friction (#12) | PRESENT — legitimacy sentences | BoardroomGovernanceIntelligence |
| Signal Interpretation (#13) | ALTITUDE-SHIFTED — executive reading | Family-level, not individual signals |
| Guided Cognition (#17) | PRESENT — 4 executive queries | Guided queries available |
| Authority Mode (#22) | PRESENT — institutional declaration | Authority declaration footer |

SW-INTEL consumption: `forBoardroom()` consequence posture — posture label, severity, scope, primary locus, cognition slices with executive names, combined synthesis. Consequence posture is GROUPED, not itemized.

### §4.7 — Cognition Prohibited

| Function | State | Reason |
|---|---|---|
| Emergence Orchestration (#1) | ABSENT | Compiled, not emergent |
| Cognitive Priority Router (#2) | COMPRESSED → fixed order | No dynamic re-prioritization |
| Emergence Dashboard (#3) | ABSENT | No emergence monitoring |
| Trust Posture (#6) | ABSENT | Compressed into qualification posture |
| Compound Activation (#7) | PASSIVE | Outputs consumed, function itself doesn't execute |
| Compression Detection (#11) | ABSENT | Below executive altitude |
| Temporal Cognition (#16) | ABSENT | Below executive altitude |
| Interrogation Trail (#18) | ABSENT | No exploration to record |
| Blockage Detection (#20) | ABSENT | Below executive altitude |
| Debt Evolution (#21) | PARTIAL — count only | No trajectory tracking |

Additionally: topology evidence panel hidden (`display: none`), coverage grid hidden, zone-level forensics absent, condition detail/guided interventions absent, disclosure tiers 2+ suppressed.

### §4.8 — Attention-Control Model

**SYSTEM-CONTROLLED.** The system compiles the verdict. The operator receives it. Attention is pre-allocated by the compiler: the 2 DOMINANT functions (#4, #9) consume ~60% of the surface. The operator cannot redirect attention within the persona — they descend to another persona.

### §4.9 — Operator-Agency Model

**LOWEST.** The operator receives a compiled verdict. They can:
- Read the verdict
- Descend to DENSE or INVESTIGATION
- Toggle SW-Intel on/off
- Select guided executive queries (4 available)

They cannot: navigate zones, interrogate signals, explore topology, or choose focus.

### §4.10 — Authority-Projection Model

**DECLARATION.** Authority presents as institutional identity. Single footer: "75.x · L3 ceiling · 13 prohibitions enforced · contract version." The governance message is: "We are governed." Not per-statement, not per-query — institutional.

### §4.11 — Success Condition

The executive can, within 30 seconds:
1. State the system's governance position (S-level, qualification method)
2. Identify the primary structural tension and its locus
3. Assess whether the intelligence is governed or advisory-bound
4. Decide to act, delegate, or defer

### §4.12 — Failure Condition

- The executive must scroll to understand the verdict
- The executive encounters contradictory signals without resolution
- The executive sees raw signal data or structural mechanics
- The executive sees terminology that requires structural knowledge
- The executive cannot determine governance position

### §4.13 — Disappearance Consequence

Without BOARDROOM, the runtime loses executive compression and decision-level consequence qualification. Operators must navigate structural detail to extract an executive position. The system cannot serve executives who need verdicts, not exploration.

### §4.14 — SW-INTEL Ontology Consumption Posture (Preparatory)

| Ontology Class | Posture | Rationale |
|---|---|---|
| A — Flow & Propagation | COMPRESSED | Propagation chain in verdict, not mechanics |
| B — Concentration & Saturation | PRIMARY | Pressure concentration is DOMINANT (#9) |
| C — Fragility & Resilience | COMPRESSED | Posture label captures fragility state |
| D — Reinforcement & Accumulation | COMPRESSED | Combination patterns in posture, not itemized |
| E — Drift & Instability | SUPPRESSED | Below executive altitude |

### §4.15 — Implementation Freshness

**CURRENT.** BOARDROOM was actively evolved through SW-Intel consequence posture overlay (3f6102f, 2026-05-22) and governed projection object model. The compiled projection consumes `forBoardroom()` consequence output. Implementation aligns with this contract.

### §4.16 — Revalidation Requirement

Verify that consequence posture overlay accurately reflects the GROUPED consumption model specified in §4.6. No structural revalidation needed.

---

## §5 — BALANCED Mission Contract

### §5.1 — Constitutional Objective

**Governed operational cognition briefing.**

BALANCED exists to help an operator understand the operational dynamics emerging from the structural state — how consequences relate, reinforce, and sequence — without requiring topology mechanics or evidence replay. The operator monitors emergence and receives a governed briefing that sequences consequence understanding.

BALANCED is NOT "explains." It is a governed cognition briefing corridor where the operator moves through consequence understanding with pacing, not scanning a dashboard.

### §5.2 — Primary Question

"What operational dynamics are emerging from the structural state, how do they relate to each other, and what is the system's confidence in this assessment?"

This is NOT "Why operationally?" — that is too vague. The BALANCED question is specifically about EMERGENT OPERATIONAL DYNAMICS, CONSEQUENCE RELATIONSHIPS, and CONFIDENCE CALIBRATION. The operator needs to understand cause-effect patterns, reinforcement flows, and trust boundaries.

### §5.3 — Forbidden Questions

- "What is the executive verdict?" → BOARDROOM
- "How does this topology work mechanically?" → DENSE
- "Can I verify this evidence chain?" → INVESTIGATION
- "What are the raw signal values?" → DENSE / INVESTIGATION
- "Which file causes this?" → DENSE
- "What should I do about this?" → prohibited entirely

### §5.4 — Operator Objective

Understand the DYNAMICS of the structural state — not the verdict (BOARDROOM), not the mechanics (DENSE), not the proof (INVESTIGATION). The operator reads a consequence briefing corridor, observes emergence patterns, and calibrates trust in the assessment. Target audience: CTO, VP Engineering, Enterprise Architect — operators who already ACCEPT the system's posture and want to understand the underlying dynamics.

### §5.5 — Runtime Responsibility

Discover at runtime what to surface through emergence orchestration. Sequence consequences into a 5-zone briefing corridor (posture → primary story → reinforcement flow → confidence → descent). All text is deterministic — compiled from CONSEQUENCE_VOCABULARY, not generated.

Implementation: `composeBriefing()` in ZoneComposer.js consumes `forBalanced()` from ConsequenceCompiler + `synthesisResult` + `fullReport`. The emergence orchestrator discovers which cognitive functions to activate based on structural state.

### §5.6 — Cognition Consumed

| Function | Projection State | Evidence |
|---|---|---|
| Emergence Orchestration (#1) | CENTRAL — baseline | Emergence orchestrator drives surface discovery |
| Cognitive Priority Router (#2) | DYNAMIC — P/S/T weight | Priority routes based on structural pressure |
| Emergence Dashboard (#3) | META-COGNITIVE | Monitors emergence state |
| Executive Synthesis (#4) | LEAD PARAGRAPH | Narrative posture paragraph |
| Posture Synthesis (#5) | 3-INPUT compression | Consequence + structural + governance posture |
| Trust Posture (#6) | COMPACT strip | Confidence bar with confirmed/advisory split |
| Compound Activation (#7) | ACTIVE detection | Compound convergence awareness |
| Grounding Asymmetry (#8) | SENTINEL — threshold-gated | Fires only when grounding drops below threshold |
| Pressure Concentration (#9) | ONE OF 22 — ~15% | Part of emergence, not dominant |
| Propagation Chain (#10) | SECONDARY narrative | Integrated into briefing flow |
| Signal Interpretation (#13) | FULL PROSE per signal | Domain-grounded signal explanations |
| Evidence Boundary (#14) | COGNITIVE REFRAME | "Confirmed unknowns" — interpretation of evidence meaning |
| Guided Cognition (#17) | PRESENT — 4 emergence queries | Emergence-driven queries |
| Interrogation Trail (#18) | RECORDING | Tracks operator exploration path |
| Confidence Classification (#19) | TIER LOGIC — threshold | Q-class tier drives briefing confidence strip |
| Blockage Detection (#20) | SQO ZONE | SQO qualification journey visible |
| Authority Mode (#22) | DISCLOSURE WRAPPING | Every interpretive output governance-wrapped |

All 22 cognitive functions are PRESENT in BALANCED. It is the ONLY persona where the full cognitive architecture is observable.

SW-INTEL consumption: `forBalanced()` consequence projection — primary story, reinforcement flow with relationship verbs (amplifies/reinforces/converges/widens/concentrates), confidence sentence. Consequence briefing corridor composes ZoneComposer 5-zone layout.

### §5.7 — Cognition Prohibited

No cognitive function is ABSENT in BALANCED. However, the following are constrained:

| Constraint | Rule |
|---|---|
| No local derivation | BALANCED consumes compiled cognition from ConsequenceCompiler, never derives |
| No topology mechanics | No zone drill, no signal-level decomposition, no topology overlay manipulation |
| No evidence replay | No provenance chain verification, no hash inspection |
| No executive compression | No pre-decided verdict — emergence discovers, not compiles |
| No stacked inventory | Consequences must show RELATIONSHIPS, not lists |
| No prose drift | Every sentence must trace to CONSEQUENCE_VOCABULARY or deterministic template |

### §5.8 — Attention-Control Model

**CO-DISCOVERY.** The system discovers what to surface at runtime through emergence orchestration. The operator monitors emergence, can trigger guided queries, and observes reinforcement flows. Neither the system nor the operator fully controls attention — the structural state drives discovery, the operator chooses depth.

### §5.9 — Operator-Agency Model

**MEDIUM.** The operator can:
- Observe emergence patterns
- Trigger guided emergence queries (4 available)
- Expand structural depth (PI Runtime Layer escalation)
- Read reinforcement flow relationships
- Descend to DENSE or INVESTIGATION

They cannot: navigate zones freely (DENSE), interrogate individual signals (DENSE), or verify evidence chains (INVESTIGATION).

### §5.10 — Authority-Projection Model

**DISCLOSURE WRAPPING.** Every interpretive output is wrapped in governance disclosure. The governance message is: "Each statement is governed." Per-statement accountability, not institutional declaration.

### §5.11 — Success Condition

The operator can, within 2 minutes:
1. Name the primary consequence and its operational implication
2. Explain how contributing consequences reinforce the primary
3. State the system's confidence level and what limits it
4. Understand why the structural state creates these dynamics (cause-effect, not mechanics)
5. Know where to descend for structural proof (DENSE) or evidence verification (INVESTIGATION)

### §5.12 — Failure Condition

- The operator sees raw signal values or topology coordinates
- The operator encounters stacked cards without relationship information
- The operator reads management-consulting language or AI narrative sludge
- The operator cannot distinguish BALANCED from BOARDROOM-longform
- The operator must descend to DENSE to understand WHAT is happening (not HOW)
- Prose drifts from CONSEQUENCE_VOCABULARY into generated language

### §5.13 — Disappearance Consequence

Without BALANCED, the runtime loses governed operational cognition briefing and consequence sequencing. Operators who accept the system's posture but need to understand the underlying dynamics have no path between executive verdict (BOARDROOM) and structural interrogation (DENSE). The cognitive descent becomes a cliff: compressed verdict → raw topology.

### §5.14 — SW-INTEL Ontology Consumption Posture (Preparatory)

| Ontology Class | Posture | Rationale |
|---|---|---|
| A — Flow & Propagation | SECONDARY | Propagation dynamics in reinforcement flow |
| B — Concentration & Saturation | PRIMARY | Concentration is the dominant consequence class |
| C — Fragility & Resilience | SECONDARY | Fragility posture in headline, resilience in confidence strip |
| D — Reinforcement & Accumulation | PRIMARY | Reinforcement flow IS BALANCED's central visual element |
| E — Drift & Instability | SECONDARY | Stability risk in primary story when systemic |

### §5.15 — Implementation Freshness

**LATEST-EVOLVED.** BALANCED received the most recent architectural work:
- Governed narrative composition (d10fe74, 2026-05-27)
- ZoneComposer 5-zone briefing corridor
- Consequence briefing component (BalancedConsequenceBriefing)
- Left panel briefing anchor with SW-Intel enhancement overlay
- Vocabulary validation via OperationalVocabulary.js

Implementation aligns with this contract. This contract LOCKS the BALANCED mission.

### §5.16 — Revalidation Requirement

None. BALANCED is the most recently validated persona. This contract codifies its current operational state.

---

## §6 — DENSE Mission Contract

### §6.1 — Constitutional Objective

**Structural behavior interrogation.**

DENSE exists to allow an operator to explore how the system behaves structurally — propagation patterns, concentration mechanics, topology relationships, pressure zones, and signal dynamics. The operator INTERROGATES structure, choosing where to focus and what to ask.

DENSE is NOT "How structurally?" — that conflates with INVESTIGATION's proof discipline. DENSE explores BEHAVIOR (how things propagate, concentrate, and interact). INVESTIGATION verifies LINEAGE (where evidence comes from, whether claims are provable).

### §6.2 — Primary Question

"How does structural pressure propagate, concentrate, and interact across the system's topology, and where should I investigate further?"

This is specifically about STRUCTURAL BEHAVIOR — propagation paths, pressure zones, concentration patterns, coupling corridors, topology mechanics. The operator wants to understand the system's structural dynamics by exploring them interactively.

### §6.3 — Forbidden Questions

- "What is the executive verdict?" → BOARDROOM
- "What is the operational consequence sequence?" → BALANCED
- "Is this evidence claim provable?" → INVESTIGATION
- "What should I prioritize?" → BOARDROOM (compression/prioritization)
- "What is the full governance audit trail?" → INVESTIGATION
- "What should I do about this?" → prohibited entirely

### §6.4 — Operator Objective

Navigate and interrogate the system's structural topology to understand HOW structural patterns work. The operator chooses where to focus, what to interrogate, and how deep to go. They are building a structural mental model, not receiving a verdict or verifying proof.

### §6.5 — Runtime Responsibility

Provide depth EVERYWHERE and let the operator choose focus. Zone orchestration replaces emergence orchestration — the system organizes content into navigable zones, and the operator scrolls, clicks, and interrogates. The runtime provides interpretations at each focus point.

Implementation: `DENSE_ZONE_REGISTRY` defines 7 zones. `DenseTopologyField` renders interactive topology with zone tracking. `SupportRail` provides per-zone guided queries. 42+ interrogation paths available. Topology cognition overlays (4 slices) active when SW-Intel enabled.

### §6.6 — Cognition Consumed

| Function | Projection State | Evidence |
|---|---|---|
| Executive Synthesis (#4) | DECOMPOSED — 7 zone syntheses | Each zone has its own synthesis |
| Posture Synthesis (#5) | DISTRIBUTED across zones | No single posture — distributed per zone |
| Trust Posture (#6) | PRESENT at FULL DEPTH | Full Q-class detail visible |
| Compound Activation (#7) | PRESENT at signal level | Individual signal compound awareness |
| Grounding Asymmetry (#8) | EXPOSED + SENTINEL active | Both detection and machinery visible |
| Pressure Concentration (#9) | DECOMPOSED — 4 zones ~55% | PZ + SA + AL + PF decomposed from single verdict |
| Propagation Chain (#10) | MAXIMUM — 3 zones + 5 queries | Full propagation detail across multiple zones |
| Compression Detection (#11) | PRESENT — guided query path | Band-vs-ratio diagnostic available |
| Governance Friction (#12) | EXPOSED — operational detail | Governance counts, rates, friction visible |
| Signal Interpretation (#13) | MAXIMUM — all fields visible | Every signal field exposed |
| Evidence Boundary (#14) | EXPOSED — structural topology | Evidence boundary visible as structural topology property |
| Spatial Anchor (#15) | EXPOSED — per-domain | Domain-level spatial resolution visible |
| Temporal Cognition (#16) | PRESENT — full zone | Temporal analytics zone |
| Guided Cognition (#17) | MAXIMUM — 42 paths + 4 expansions | Broadest interrogation surface |
| Interrogation Trail (#18) | MAXIMUM — governed export | Full trail with export capability |
| Confidence Classification (#19) | EXPOSED — raw Q-class codes | Raw codes visible, not just labels |
| Blockage Detection (#20) | PRESENT + guided query | Blockage with interrogation path |
| Debt Evolution (#21) | PRESENT — zone + query | Full debt zone with guided queries |
| Authority Mode (#22) | DISTRIBUTED — per-query boundary | Each query carries its authority boundary |

SW-INTEL consumption: topology cognition overlays (4 slices: dependency choke point, propagation asymmetry, pressure zone convergence, structural mass), cognition surfaces, condition-level guided interventions. DENSE consumes the MECHANICAL detail that BOARDROOM compresses and BALANCED sequences.

### §6.7 — Cognition Prohibited

| Function | State | Reason |
|---|---|---|
| Emergence Orchestration (#1) | REPLACED → zone orchestration | DENSE doesn't discover — it provides |
| Cognitive Priority Router (#2) | REPLACED → spatial priority | Operator scroll position, not system priority |
| Emergence Dashboard (#3) | REPLACED → zone tracking | Zone awareness replaces emergence monitoring |

Additionally:
| Constraint | Rule |
|---|---|
| No executive compression | No pre-decided verdict — the operator decides where to focus |
| No consequence sequencing | No reinforcement flow or briefing corridor |
| No proof/replay | No evidence hash verification, no provenance chain |
| No recommendation | No "you should" language — interrogation, not prescription |

### §6.8 — Attention-Control Model

**OPERATOR-CONTROLLED.** The system provides depth everywhere (7 zones, 42 queries). The operator chooses focus by scrolling, clicking topology, selecting zones, triggering queries. The system responds to focus with contextual interpretation — it does not direct attention.

### §6.9 — Operator-Agency Model

**HIGHEST.** The operator can:
- Navigate 7 zones freely via scroll
- Click topology nodes, edges, domains
- Select pressure zones
- Trigger 42+ guided query paths
- Expand PI Runtime structural depth
- Select topology cognition overlays (4 slices)
- Export interrogation trail

They are the primary driver. The system is the responsive instrument.

### §6.10 — Authority-Projection Model

**PER-ACT BOUNDARY.** Each of the 42+ guided query paths carries its own `boundary` field specifying the derivation source and authority level. The governance message is: "Each answer traces to its source." Not institutional, not per-statement — per-derivation-act.

### §6.11 — Success Condition

The operator can:
1. Navigate to any structural pattern and understand its mechanics
2. Trace propagation paths through the topology
3. Identify pressure concentration points and their contributing signals
4. Interrogate any zone in depth via guided queries
5. Build a structural mental model sufficient to explain the dynamics to others
6. Know which claims are governed vs. advisory-bound at the query level

### §6.12 — Failure Condition

- The operator cannot find a zone or query relevant to their question
- The operator sees compressed verdicts instead of structural detail
- The operator encounters sequence-forced navigation (INVESTIGATION pattern)
- The operator cannot distinguish DENSE from INVESTIGATION
- The topology is inert (no click response, no zone interpretation)
- Guided queries return executive summaries instead of structural detail

### §6.13 — Disappearance Consequence

Without DENSE, the runtime loses interactive topology cognition and structural behavior interrogation. Operators who need to understand HOW structural patterns work have no path between operational briefing (BALANCED) and evidence verification (INVESTIGATION). The 42 interrogation paths and 7 navigable zones are lost. The topology becomes display-only.

### §6.14 — SW-INTEL Ontology Consumption Posture (Preparatory)

| Ontology Class | Posture | Rationale |
|---|---|---|
| A — Flow & Propagation | PRIMARY | Propagation corridors are core DENSE content — 3 zones + 5 queries |
| B — Concentration & Saturation | PRIMARY | Pressure concentration DECOMPOSED across 4 zones (~55% of surface) |
| C — Fragility & Resilience | SECONDARY | Resilience visible through structural mass and cluster analysis |
| D — Reinforcement & Accumulation | SECONDARY | Compound convergence visible, combination patterns explorable |
| E — Drift & Instability | SECONDARY | Stability risk visible through signal audit and temporal zone |

### §6.15 — Implementation Freshness

**STABLE.** DENSE has been incrementally evolved through SW-Intel cognition overlays (topology cognition slices, condition-level guided interventions, pressure zone focus). Core zone architecture is stable. SW-INTEL topology cognition overlays are current. No structural revalidation needed.

### §6.16 — Revalidation Requirement

Verify that DENSE topology cognition overlays consume the latest 4-slice vocabulary from ConsequenceCompiler. Minor — overlay vocabulary, not architecture.

---

## §7 — INVESTIGATION Mission Contract

### §7.1 — Constitutional Objective

**Evidence qualification and governed replay.**

INVESTIGATION exists to allow an operator to VERIFY, TRACE, and REPLAY the evidence chain behind every claim the system makes. The operator follows a predetermined proof sequence. The system enforces completeness — every section must be traversed, every prohibition stated, every evidence hash visible.

INVESTIGATION is NOT "Prove it." — that could describe DENSE's structural proof. INVESTIGATION is specifically about EVIDENCE QUALIFICATION: are the hashes correct, are the derivation chains complete, are the prohibitions enumerated, is the governance audit complete?

### §7.2 — Primary Question

"Is the evidence chain behind this intelligence complete, reproducible, and governed — and what has the system been prohibited from concluding?"

This is specifically about EVIDENCE INTEGRITY, REPRODUCIBILITY, and CONSTRAINT ENUMERATION. The operator is an auditor, not an explorer. They verify claims, they don't build mental models.

### §7.3 — Forbidden Questions

- "What is the executive verdict?" → BOARDROOM
- "What are the operational dynamics?" → BALANCED
- "How does this structural pattern work?" → DENSE
- "Where should I focus my attention?" → BOARDROOM / DENSE
- "What are the reinforcement relationships?" → BALANCED
- "What should I do about this?" → prohibited entirely

### §7.4 — Operator Objective

Verify that the system's claims are evidence-backed, reproducible, and constrained by explicit governance prohibitions. The operator is conducting an AUDIT — they follow a fixed sequence, inspect each evidence layer, and confirm that the system has not exceeded its authority.

### §7.5 — Runtime Responsibility

Enforce a fixed evidence sequence. The operator follows a predetermined path through evidence layers. The system does not discover, does not navigate, does not interpret. It presents evidence in a completeness-enforcing order and closes with prohibition enumeration and terminal handoff.

Implementation: `InvestigationTraceField` renders a fixed sequence:
1. ET — Evidence Trace (lineage hashes: evidence_object_hash, derivation_hash, baseline_anchor, run_id)
2. SS — Signal Stack (per-signal evidence rows with confidence, domain, grounding status)
3. SA — Signal Audit (full signal table: ID, family, name, value to 4 decimals, severity, interpretation)
4. IP — Inference Prohibition (13 prohibitions: must not infer, recommend, overstate + qualifier rules + ALI rules)
5. GA — Governance Audit (full traversal: lifecycle, proposition corpus, enrichment, revalidation, constitutional anchor, convergence, replay certification)
6. Topology — forensic topology preview with modal exploration
7. TierHandoffStatement — terminal closure

### §7.6 — Cognition Consumed

| Function | Projection State | Evidence |
|---|---|---|
| Posture Synthesis (#5) | PRESENT — governance table row | Posture as governance fact, not narrative |
| Trust Posture (#6) | PRESENT at FULL DEPTH + STRUCTURAL BACKING | Full trust derivation visible |
| Governance Friction (#12) | MAXIMUM — forensic tables | Full proposition corpus, friction rates, obligation counts |
| Signal Interpretation (#13) | EXPOSED — evidence depth + audit | All fields: ID, family, value (4 decimal), severity, interpretation |
| Evidence Boundary (#14) | MAXIMUM — inference prohibition | Explicit prohibition: "MUST NOT infer beyond evidence" |
| Spatial Anchor (#15) | EXPOSED — per-signal | Domain attribution per signal |
| Temporal Cognition (#16) | PRESENT — full depth + debt | Temporal with debt drilldown |
| Guided Cognition (#17) | PRESENT — 4 forensic queries | Forensic-oriented queries |
| Interrogation Trail (#18) | PRESENT — recording | Trail recording active |
| Confidence Classification (#19) | MAXIMUM — 4-decimal detail | Mean confidence to 4 decimals, friction rate to 2 decimals |
| Blockage Detection (#20) | EXPOSED — forensic hold reason | Hold reasons with governance evidence |
| Debt Evolution (#21) | EXPOSED — full debt drilldown | Complete debt inventory |
| Authority Mode (#22) | MAXIMUM — prohibition + terminal closure | 13 prohibitions enumerated + TierHandoffStatement |

### §7.7 — Cognition Prohibited

| Function | State | Reason |
|---|---|---|
| Emergence Orchestration (#1) | ABSENT | No discovery — fixed evidence sequence |
| Cognitive Priority Router (#2) | ABSENT → fixed sequence | No prioritization — completeness required |
| Emergence Dashboard (#3) | ABSENT | No emergence to monitor |
| Executive Synthesis (#4) | ABSENT | Synthesis produces MEANING — verification prohibits meaning production |
| Compound Activation (#7) | ABSENT | Detection produces INTERPRETATION — verification prohibits interpretation |
| Compression Detection (#11) | ABSENT (implicit) | Below verification altitude |

The Interpretation/Prohibition Inversion (Law 3): Functions that INTERPRET in other personas become PROHIBITIONS in INVESTIGATION. Evidence Boundary (#14): "confirmed unknowns" (BALANCED interpretation) → "MUST NOT infer beyond evidence" (INVESTIGATION prohibition). Authority Mode (#22): disclosure/declaration/boundary → prohibition enumeration. This inversion is the constitutional signature of INVESTIGATION.

### §7.8 — Attention-Control Model

**SYSTEM-ENFORCED SEQUENCE.** The system enforces a predetermined evidence traversal: ET → SS → SA → IP → GA → Topology → Closure. The operator follows the sequence. They cannot skip sections or reorder the traversal. Completeness is enforced by layout, not operator discipline.

### §7.9 — Operator-Agency Model

**LOW — BY DESIGN.** The operator can:
- Scroll through the fixed evidence sequence
- Inspect individual evidence items
- Open forensic topology modal
- View 4 forensic guided queries

They cannot: skip sections, reorder evidence, choose focus, navigate zones, or trigger emergence queries. This is deliberate — the auditor needs COMPLETENESS, not FREEDOM. A surface that lets the auditor choose what to verify fails because omission becomes possible.

Note: BOARDROOM and INVESTIGATION both constrain operator agency, but for OPPOSITE reasons. BOARDROOM constrains because the executive needs a verdict, not exploration. INVESTIGATION constrains because the auditor needs completeness, not freedom.

### §7.10 — Authority-Projection Model

**PROHIBITION ENUMERATION + TERMINAL CLOSURE.** Authority presents as negative space — what the system CANNOT DO. The Inference Prohibition zone (IP) enumerates 13 explicit prohibitions, qualifier rules applied, and ALI rules applied. The TierHandoffStatement closes the surface with terminal governance: "Everything you saw was deterministic."

The governance message is: "Here is everything we cannot do. Everything you saw was deterministic." This is the deepest authority projection — it proves governance by enumeration of constraints.

### §7.11 — Success Condition

The operator can:
1. Trace every claim to its evidence hash and derivation chain
2. Verify that signal values are reproducible (4-decimal precision)
3. Confirm that the system has not exceeded its governance authority
4. Enumerate the prohibitions the system operates under
5. Verify the governance lifecycle (S-level, transitions, propositions, enrichment)
6. Close the audit with confidence that the evidence chain is complete

### §7.12 — Failure Condition

- The operator cannot find the evidence hash for a claim
- The operator encounters synthesized narrative instead of raw evidence
- Prohibitions are not explicitly stated
- The governance audit is incomplete (missing sections)
- The operator can skip sections (completeness not enforced)
- Signal values are rounded or summarized instead of presented at full precision
- The operator encounters executive compression or operational briefing language

### §7.13 — Disappearance Consequence

Without INVESTIGATION, the runtime loses proof discipline, replay inspection, and evidence qualification. No other persona can verify evidence chains — DENSE explores behavior, BALANCED sequences operations, BOARDROOM compiles verdicts. The system's governance claims become unverifiable. The 13 prohibitions are no longer explicitly stated. Evidence hashes are no longer visible. The governance audit trail disappears.

### §7.14 — SW-INTEL Ontology Consumption Posture (Preparatory)

| Ontology Class | Posture | Rationale |
|---|---|---|
| A — Flow & Propagation | PROOF-ONLY | Propagation evidence verified, not explored |
| B — Concentration & Saturation | PROOF-ONLY | Concentration evidence verified, not navigated |
| C — Fragility & Resilience | NOT APPLICABLE | No current INVESTIGATION rendering for this class |
| D — Reinforcement & Accumulation | PROOF-ONLY | Combination pattern evidence verified if present |
| E — Drift & Instability | PROOF-ONLY | Stability risk evidence verified, not interpreted |

All ontology classes consume at PROOF-ONLY level in INVESTIGATION — the persona verifies evidence existence and integrity, it does not explore behavior or explain dynamics.

### §7.15 — Implementation Freshness

**STALE.** InvestigationTraceField was last meaningfully modified on 2026-05-14 (commit 7841f42). Since then:
- ConsequenceCompiler evolution (consequence types, `forBoardroom()`, `forBalanced()`)
- SW-INTEL consequence slice taxonomy and governance (G1)
- BALANCED consequence briefing corridor
- Topology cognition slice vocabulary

INVESTIGATION currently has `SoftwareIntelligenceInvestigationView` that renders projection surfaces (line 8396-8398), but this predates the consequence compiler and slice ontology. It does NOT consume:
- Consequence posture or consequence objects
- Slice taxonomy classifications
- Evidence/replay contract metadata
- Structured derivation traces

### §7.16 — Revalidation Requirement

**REVALIDATION REQUIRED.** Before INVESTIGATION is considered aligned to current SW-INTEL doctrine:

1. Verify whether `SoftwareIntelligenceInvestigationView` consumes current consequence compiler output
2. Assess whether evidence trace (ET section) should display consequence derivation chains
3. Assess whether Signal Audit (SA section) should include condition-level evidence classification
4. Verify that Inference Prohibition (IP section) covers SW-INTEL ontology-specific prohibitions
5. Assess whether Governance Audit (GA section) should display slice maturity classifications

Expected verdict: **CONSTITUTIONALLY CLEAR, RUNTIME REVALIDATION REQUIRED**

---

## §8 — Persona Comparison Matrix

| Dimension | BOARDROOM | BALANCED | DENSE | INVESTIGATION |
|---|---|---|---|---|
| **Constitutional Objective** | Executive consequence qualification | Governed operational cognition briefing | Structural behavior interrogation | Evidence qualification and governed replay |
| **Primary Question** | What requires my attention and what is my governance position? | What operational dynamics are emerging and how do they relate? | How does structural pressure propagate, concentrate, and interact? | Is the evidence chain complete, reproducible, and governed? |
| **Operator Objective** | Decide: act, delegate, or defer | Understand emergent cause-effect dynamics | Build structural mental model through interrogation | Audit evidence integrity and governance compliance |
| **Operator Agency** | LOWEST — receives verdict | MEDIUM — monitors emergence, queries | HIGHEST — navigates freely, 42+ paths | LOW — follows fixed evidence sequence |
| **Attention Control** | System-controlled (compiled) | Co-discovery (emergence) | Operator-controlled (zone navigation) | System-enforced sequence |
| **Runtime Responsibility** | Compile verdict beforehand | Discover and sequence at runtime | Provide depth everywhere | Enforce evidence completeness |
| **Cognition Active** | 13 of 22 (9 absent) | 22 of 22 (all present) | 22 of 22 (3 replaced, rest transformed) | 16 of 22 (6 absent) |
| **Cognition Prohibited** | Emergence, temporal, trail, debt | Local derivation, topology mechanics, evidence replay | Executive compression, proof/replay, recommendation | Synthesis, emergence, interpretation |
| **Authority Projection** | DECLARATION — "We are governed" | DISCLOSURE — "Each statement is governed" | PER-ACT BOUNDARY — "Each answer traces to source" | PROHIBITION — "Here is what we cannot do" |
| **Success** | Executive verdict in 30 seconds | Causal dynamics understood in 2 minutes | Structural model built through interrogation | Evidence chain verified, prohibitions enumerated |
| **Failure** | Requires scrolling, raw data visible | Stacked cards, prose drift, BOARDROOM-longform | Compressed verdicts, forced sequence | Synthesized narrative, skippable sections |
| **Removed Capability** | Executive compression, decision-level qualification | Operational cognition briefing, consequence sequencing | Interactive topology interrogation, 42 query paths | Proof discipline, evidence hashes, prohibition enumeration |
| **SW-INTEL Primary Classes** | B (concentration) | B (concentration), D (reinforcement) | A (propagation), B (concentration) | All at PROOF-ONLY |
| **Implementation Freshness** | CURRENT | LATEST-EVOLVED | STABLE | STALE |

---

## §9 — Persona Boundary Rules

### §9.1 — BOARDROOM Must Not Become

| Anti-Pattern | Description | Detection |
|---|---|---|
| DENSE | Topology mechanics, zone navigation, signal-level detail appear | Raw signal values visible, zone drill available |
| BALANCED | Reinforcement flow, consequence sequencing, emergence monitoring | Consequence cards with relationship verbs, emergence state |
| INVESTIGATION | Evidence hashes, prohibition enumeration, governance audit tables | ET/SS/SA/IP/GA sections, 4-decimal signal values |
| Recommendation engine | "You should" language, prioritized next actions | Any prescriptive language |

### §9.2 — BALANCED Must Not Become

| Anti-Pattern | Description | Detection |
|---|---|---|
| BOARDROOM-longform | Same verdict, more words | Can be compressed to BOARDROOM without loss |
| DENSE-lite | Topology mechanics at reduced depth | Zone navigation, signal-level detail, topology overlay control |
| INVESTIGATION-with-prose | Evidence verification wrapped in narrative | Hash values, prohibition statements, governance tables |
| Local derivation layer | Derives new semantic truth instead of consuming ConsequenceCompiler | Any derivation not sourced from forBalanced() |

### §9.3 — DENSE Must Not Become

| Anti-Pattern | Description | Detection |
|---|---|---|
| Executive briefing | Compressed verdicts, pre-decided attention | Single-paragraph executive synthesis |
| Proof/replay surface | Evidence hash verification, prohibition enumeration | ET/IP/GA sections from INVESTIGATION |
| Consequence briefing | Reinforcement flow, consequence sequencing | Relationship verbs, briefing corridor layout |
| Recommendation engine | "You should" language, prioritized actions | Any prescriptive language |

### §9.4 — INVESTIGATION Must Not Become

| Anti-Pattern | Description | Detection |
|---|---|---|
| Exploration surface | Operator-chosen focus, zone navigation | Zone registry, scroll-tracked activation |
| Narrative briefing | Consequence sequencing, operational dynamics | Reinforcement flow, briefing corridor |
| Executive summary | Compressed verdict, attention allocation | Single-paragraph synthesis |
| Freeform interpretation | Generated prose, unbounded narrative | Text not traceable to evidence or vocabulary |

---

## §10 — Relationship to SW-INTEL Ontology

### §10.1 — Ontology Class Consumption Matrix (Preparatory)

| Ontology Class | BOARDROOM | BALANCED | DENSE | INVESTIGATION |
|---|---|---|---|---|
| **A — Flow & Propagation** | COMPRESSED | SECONDARY | PRIMARY | PROOF-ONLY |
| **B — Concentration & Saturation** | PRIMARY | PRIMARY | PRIMARY | PROOF-ONLY |
| **C — Fragility & Resilience** | COMPRESSED | SECONDARY | SECONDARY | NOT APPLICABLE |
| **D — Reinforcement & Accumulation** | COMPRESSED | PRIMARY | SECONDARY | PROOF-ONLY |
| **E — Drift & Instability** | SUPPRESSED | SECONDARY | SECONDARY | PROOF-ONLY |

### §10.2 — Consumption Posture Definitions

| Posture | Meaning |
|---|---|
| **PRIMARY** | This ontology class is central to the persona's cognitive purpose. The persona ACTIVELY CONSUMES this class as a primary content driver. |
| **SECONDARY** | This ontology class is visible but not central. It appears as supporting evidence or secondary content. |
| **COMPRESSED** | This ontology class is present but compressed into a label, chip, or posture indicator. Active synthesis is eliminated. |
| **SUPPRESSED** | This ontology class is intentionally hidden. It is below the persona's cognitive altitude. |
| **PROOF-ONLY** | This ontology class appears only as evidence to be verified, not as content to be consumed or navigated. |
| **NOT APPLICABLE** | This ontology class has no current implementation pathway in this persona. |

### §10.3 — Key Observations

**Class B (Concentration & Saturation) is PRIMARY in three personas.** This reflects the current runtime's concentration-heavy evidence base. It is not a persona design choice — it reflects that pressure concentration is the dominant structural pattern in the governed specimen (BlueEdge genesis_e2e_03).

**Class D (Reinforcement & Accumulation) is PRIMARY only in BALANCED.** This is correct — reinforcement flow IS BALANCED's central visual element. Other personas consume reinforcement effects but do not visualize them as relationship flows.

**INVESTIGATION consumes ALL classes at PROOF-ONLY.** This is the constitutional signature: INVESTIGATION verifies evidence existence and integrity, it does not explore behavior or explain dynamics.

**Class C (Fragility & Resilience) has no PRIMARY persona.** This is an ontology coverage gap, not a persona gap. When Class C evidence becomes available in the runtime, BALANCED and DENSE are the likely primary consumers.

### §10.4 — Non-Implementation Boundary

This section is PREPARATORY ALIGNMENT only. It maps likely consumption postures based on current persona objectives and runtime evidence.

This section does NOT:
- Implement ontology consumption
- Define consumption contracts
- Create rendering specifications
- Modify persona behavior

These responsibilities belong to: **PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-CONSUMPTION-MODEL.01**

---

## §11 — Freshness and Revalidation Status

| Persona | Freshness | Last Major Evolution | Assessment |
|---|---|---|---|
| **BOARDROOM** | CURRENT | 2026-05-22 — SW-Intel consequence posture overlay | Compiled projection consumes forBoardroom(). Aligned to contract. |
| **BALANCED** | LATEST-EVOLVED | 2026-05-27 — Governed narrative composition + consequence briefing | ZoneComposer, NarrativePrimitives, OperationalVocabulary all current. Mission lock ready. |
| **DENSE** | STABLE | 2026-05-23 — Topology cognition overlays | Zone architecture stable. SW-Intel overlays current. Minor vocabulary verification needed. |
| **INVESTIGATION** | STALE | 2026-05-14 — Boardroom executive cockpit and dense propagation | 15 days behind current SW-INTEL evolution. Does NOT consume consequence compiler output, slice taxonomy, or structured derivation traces. Constitutionally clear but runtime stale. |

### §11.1 — INVESTIGATION Staleness Detail

INVESTIGATION's `SoftwareIntelligenceInvestigationView` (line 8396-8398) renders the projection adapter's surfaces. This predates:

1. ConsequenceCompiler (consequence types, combination patterns)
2. `forBoardroom()` and `forBalanced()` persona projections
3. SW-INTEL consequence slice taxonomy (ontology classes, promotion lifecycle)
4. BALANCED consequence briefing corridor (ZoneComposer)
5. Existing slice audit (maturity classifications, evidence/replay gaps)

The INVESTIGATION persona's constitutional mission (evidence qualification + governed replay) is CLEAR and STABLE. But its SW-INTEL consumption is stale relative to the runtime's current cognition architecture.

---

## §12 — Governance Implications

This document establishes the PERSONA MISSION CONTRACT BASELINE. Future streams must consume these contracts as authoritative input:

**PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-CONSUMPTION-MODEL.01** — MUST consume this document as its baseline. Ontology consumption cannot be modeled without locked persona objectives.

**Any future persona evolution stream** — MUST reference this document for boundary rules (§9), prohibited cognition (§4.7, §5.7, §6.7, §7.7), and disappearance consequences (§4.13, §5.13, §6.13, §7.13).

**INVESTIGATION revalidation stream** — MUST reference this document for INVESTIGATION's constitutional mission (§7.1-§7.14) to ensure that runtime updates align with the locked objective, not just the stale implementation.

---

## §13 — Non-Goals

This stream does NOT:
- Implement UI changes
- Modify persona runtime behavior
- Add SW-INTEL slices
- Modify consequence derivation logic
- Alter BOARDROOM/BALANCED/DENSE/INVESTIGATION code
- Implement ontology consumption
- Create rendering specifications
- Design persona-specific slice projections
- Fix INVESTIGATION staleness

---

## §14 — Closure Verdict

**PASS — PERSONA MISSION CONTRACTS BASELINE ESTABLISHED**
