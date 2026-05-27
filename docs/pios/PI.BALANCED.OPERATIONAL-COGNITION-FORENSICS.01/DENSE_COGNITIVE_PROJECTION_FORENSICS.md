# DENSE Cognitive Projection Forensics

Stream: PI.PERSONA.COGNITION-TOPOLOGY-FORENSICS.01 — Phase 3
Classification: FORENSIC / CONSTITUTIONAL / NON-IMPLEMENTATION
Date: 2026-05-24
Depends on: STRATUM_DECOMPOSITION.md (22 cognitive functions), BOARDROOM_COGNITIVE_PROJECTION_FORENSICS.md (Phase 2)
Canonical specimen: blueedge/run_blueedge_productized_01_fixed

---

## DENSE Architecture Note

DENSE is not one persona — it is TWO cognitive architectures sharing a density class:

**EXECUTIVE_DENSE** — Structural cause-and-propagation analysis. 7 scrollable zone actors (ST, CC, AL, SA, PF, PZ, GL), each with 6 guided query paths = 42 interrogation paths. Viewport-scroll-driven zone activation. Zone interpretations render per active zone.

**INVESTIGATION_DENSE** — Forensic evidence trace and governance audit. Fixed sequence: evidence lineage → signal stack → signal audit → inference prohibition → governance audit → forensic topology. Evidence-first, not interpretation-first.

Both share the same resolved payload. They differ in COGNITIVE ORIENTATION: EXECUTIVE_DENSE asks "what does the structure mean?"; INVESTIGATION_DENSE asks "what does the evidence prove?"

---

## Method

Same as Phase 2: for each of the 22 cognitive functions, trace how it projects in DENSE. New projection states added for DENSE-specific patterns:

| Projection State | Meaning |
|-----------------|---------|
| **DECOMPOSED** | Function is broken into component parts distributed across multiple zones |
| **EXPOSED** | Function's internal machinery is visible — the operator sees HOW it works, not just its output |
| **MAXIMUM** | Function operates at its richest projection in this persona |

---

## COGNITIVE FUNCTION PROJECTION MAP

### Tier 1: Orchestration Functions

#### #1 — Emergence Orchestration Engine

**BALANCED:** Central orchestrator. 8 emergence functions. Dynamic activation and composition.

**EXECUTIVE_DENSE:** **REPLACED by ZONE ORCHESTRATION.**

No emergence orchestration exists. Instead, the 7-zone architecture (`DENSE_ZONE_REGISTRY`: semanticTopology, clusterConcentration, absorptionLoad, signalAssessment, propagationFlow, pressureZoneFocus, governanceLifecycle) provides SPATIAL orchestration. The `updateActiveZone()` scroll-tracking function (lines 3440-3454) detects which zone is in the viewport center and sets `activeZoneKey`, which drives:
- Which guided query panel appears in SupportRail
- Which zone interpretation renders in ExecutiveInterpretation
- Which PI escalation expansions are available

This is a fundamentally different orchestration model. BALANCED orchestration is COGNITIVE (activated by structural state). DENSE orchestration is SPATIAL (activated by operator scroll position). The operator's physical navigation IS the orchestration.

**INVESTIGATION_DENSE:** **ABSENT.** Fixed evidence-first sequence. No zone-based navigation.

**Cross-persona insight:** Three personas, three orchestration models:
- BALANCED: emergence orchestration (cognitive activation)
- BOARDROOM: compiled projection (deterministic compilation)
- DENSE: zone orchestration (spatial navigation)

---

#### #2 — Cognitive Priority Router

**BALANCED:** PRIMARY/SECONDARY/TERTIARY dynamic weight.

**EXECUTIVE_DENSE:** **REPLACED by SPATIAL PRIORITY.**

Zone order in the DOM IS the priority: ST → CC → AL → SA → PF → PZ → GL. The operator scrolls through this sequence. But the ACTIVE zone (tracked by scroll position) creates a FOCAL priority — whichever zone is in the viewport center becomes the cognitive focus. The SupportRail guided query panel and zone interpretation panel both serve the active zone.

This is OPERATOR-DRIVEN priority. In BALANCED, the system decides what matters most. In DENSE, the operator navigates to what matters to THEM. The system provides interpretive depth wherever the operator focuses.

**INVESTIGATION_DENSE:** **FIXED: evidence lineage → signals → governance.** Lineage always leads. The priority IS the evidence chain.

---

#### #3 — Emergence Dashboard

**BALANCED:** Meta-cognitive monitoring — which cognitive actors fired and why.

**EXECUTIVE_DENSE:** **TRANSFORMED → ZONE EXPLORATION TRACKING.**

The `DENSE_ZONE_REGISTRY` (7 zones, each with 2-letter code) IS an actor registry. The `exploredQueries` state tracks which queries the operator has answered. The `InterrogationTrailBuilder` records which zones were examined and lists unexamined zones in `buildGovernanceBoundarySection()` — passing `denseZoneRegistry` to identify coverage gaps.

This is meta-cognitive monitoring of a different kind: not "which cognitive actors fired" but "which zones has the operator explored." It produces OPERATOR COVERAGE AWARENESS — "you have examined 4 of 7 zones; these 3 remain unexamined."

**INVESTIGATION_DENSE:** **ABSENT.** No zone tracking.

---

### Tier 2: Synthesis Functions

#### #4 — Executive Synthesis Agent

**BALANCED:** Composes single lead paragraph from posture + topology + signals.

**EXECUTIVE_DENSE:** **DECOMPOSED → 7 ZONE-LOCAL SYNTHESES.**

The `DENSE_ZONE_INTERPRETATIONS` object provides 7 independent synthesis functions, each with `derive(fullReport)` producing `{ heading, body, structuralNote }`:

- **ST:** "What the topology reveals" — grounding ratio interpretation
- **CC:** "What the cluster distribution reveals" — concentration dependency
- **AL:** "What the absorption pattern reveals" — conducting layer identification
- **SA:** "What the signal landscape reveals" — severity distribution + per-signal detail
- **PF:** "What the propagation structure reveals" — chain dependency narrative
- **PZ:** "What the pressure concentration reveals" — zone + signal + compound
- **GL:** "What the governed lifecycle reveals" — S-level, propositions, revalidation, certification

Unlike BALANCED which COMPOSES a single synthesis, DENSE DECOMPOSES synthesis into zone-local interpretations. The operator gets MULTIPLE independent "what this means" readings, one per zone.

**INVESTIGATION_DENSE:** **ABSENT as synthesis.** Evidence reading replaces interpretive synthesis.

---

#### #5 — Posture Synthesis

**BALANCED:** 3-input compression → single readiness state.

**EXECUTIVE_DENSE:** **PRESENT but DISTRIBUTED.** DeclarationZone renders the posture state (same as BALANCED). The pressureZoneFocus guided query "Qualification posture" derives full posture with qualifier class, readiness band, and executive posture. Posture appears in context of the pressure zone rather than as a standalone declaration.

**INVESTIGATION_DENSE:** **PRESENT in GOVERNANCE AUDIT.** S-level, qualification posture, promotion eligibility all rendered in InvestigationGovernanceAudit key-value table.

---

#### #6 — Trust Posture Synthesis

**BALANCED:** Compact trust strip.
**BOARDROOM:** ABSENT.

**EXECUTIVE_DENSE:** **PRESENT at FULL DEPTH.** SemanticTrustPostureZone renders at full detail — not the compact strip that BALANCED shows. Trust synthesis EXPANDS in DENSE.

**INVESTIGATION_DENSE:** **PRESENT at FULL DEPTH.** Same full rendering.

**Cross-persona insight:** Trust Posture is ABSENT in BOARDROOM (collapsed into governance), COMPACT in BALANCED, and FULL in DENSE. The trust dimension expands as altitude descends.

---

#### #7 — Compound Activation Agent

**BALANCED:** Active multi-signal co-activation detection producing emergent meaning.

**EXECUTIVE_DENSE:** **PRESENT at SIGNAL SECTION LEVEL.** DenseSignalSection renders `compound_narrative` (line 3341-3343) below the signal groups. The signalAssessment zone interpretation derives signalDetail with per-signal decomposition. But the compound DETECTION still happened upstream — DENSE shows the result and DECOMPOSES it into per-signal components.

**INVESTIGATION_DENSE:** **ABSENT.** Signal stack shows individual signals without compound synthesis.

---

### Tier 3: Detection Functions

#### #8 — Grounding Asymmetry Detection

**BALANCED:** Threshold-gated sentinel. Fires when asymmetry exceeds threshold.

**EXECUTIVE_DENSE:** **EXPOSED at COMPONENT LEVEL — SENTINEL ACTIVE.**

The semantic topology actor (ST) renders per-domain grounding state — each propagation-chain domain shows "structurally backed · Q-00" or "semantic-only · Q-XX advisory." The `actor-topo-summary` shows the boundary: "X of Y structurally backed · Z semantic-only exposure."

Critically: `STRUCTURAL_ESCALATION_CONDITIONS.dense` (lines 168-172) fires PI escalation when `structurally_backed_count < semantic_domain_count`. The SENTINEL IS ACTIVE in DENSE — unlike BOARDROOM which always-renders, DENSE gates escalation on asymmetry detection.

Guided query paths for semanticTopology include: "Ungrounded semantic claims — Exposes semantic claims with no structural correspondence — assertions that carry advisory weight without evidence confirmation."

**INVESTIGATION_DENSE:** **EXPOSED at EVIDENCE BLOCK LEVEL.** Each signal row shows grounding_status and flags "advisory bound." Expansion: "What ungrounded claims exist across the domain registry?" with per-domain severity.

**Cross-persona insight:** The sentinel function is ABSENT in BOARDROOM (always displays), PRESENT-but-hidden in BALANCED (narrative emergence), and EXPOSED-and-active in DENSE (triggers escalation).

---

#### #9 — Pressure Concentration Detection

**BALANCED:** Multi-condition sentinel, one of 22 functions (~15% of surface).
**BOARDROOM:** DOMINANT (~40% of surface).

**EXECUTIVE_DENSE:** **DECOMPOSED across 4 ZONES (~55% of surface).**

Pressure concentration is not one function in DENSE — it is decomposed across:

1. **PZ (Pressure Zone Focus):** Zone business label + signal concentration + compound narrative
2. **SA (Signal Assessment):** Per-signal severity, family grouping, activation/nominal classification
3. **AL (Absorption Load):** Pass-through conducting layer — WHERE pressure is absorbed
4. **PF (Propagation Flow):** ORIGIN → PASS_THROUGH → RECEIVER with per-node grounding and pressure tier

The operator sees the COMPONENTS of pressure concentration — WHERE it concentrates (PZ), WHAT signals produce it (SA), HOW it propagates (PF), and WHERE it absorbs (AL). BOARDROOM gives the VERDICT; DENSE gives the MACHINERY.

**INVESTIGATION_DENSE:** **DECOMPOSED to INDIVIDUAL SIGNALS.** Signal stack shows each signal with pressure_tier, evidence_text, and confidence per domain. The compound synthesis disappears; raw signal evidence appears.

---

#### #10 — Propagation Chain Detection

**BALANCED:** Secondary narrative.
**BOARDROOM:** Elevated visual instrument.

**EXECUTIVE_DENSE:** **MAXIMUM PROJECTION — 3 ZONES participate.**

This is the cognitive function that DENSE projects most richly:

1. **ST (Semantic Topology):** Renders propagation chain nodes as `actor-topo-cell` cards showing role, domain_alias, pressure_tier, and grounding status (structurally backed vs semantic-only).
2. **AL (Absorption Load):** Focuses on the PASS_THROUGH node — "conducting · not generating" with absorption bar visualization and "Pattern consistent with organizational stress migration" narrative.
3. **PF (Propagation Flow):** Full chain strip with per-node cards: role, domain, pressure label, structural backing. Narrative: "Pressure originates upstream and propagates through the coordination layer — structural, not incidental."

Plus guided query paths: "Open full topology" (PF), "Dissipation resistance" (AL), "Non-bypassable dependency" (PF), "Containment failure" (PF), "Amplification chain" (AL).

**INVESTIGATION_DENSE:** **PRESENT at EVIDENCE LEVEL.** Each signal row includes domain and propagation role. Evidence provenance expansion decomposes per-role evidence.

---

#### #11 — Compression Detection

**BALANCED:** Band-vs-ratio gap diagnostic.
**BOARDROOM:** ABSENT.

**EXECUTIVE_DENSE:** **PRESENT as GUIDED QUERY PATH.**

signalAssessment zone path: "Confidence compression — Explains how the combination of elevated signals compresses executive confidence beyond what any individual signal would produce." Boundary: "Compression from signal count × readiness band — deterministic." The derive function computes compression mechanics.

This is the ONLY persona where compression detection is explicitly available as a named interrogation path. It is not a rendered component — it is an ON-DEMAND cognitive function activated by operator query.

**INVESTIGATION_DENSE:** **IMPLICIT.** Qualification boundary expansion addresses qualification posture constraints, which is adjacent to compression.

---

#### #12 — Governance Friction Detection

**BALANCED:** Emergence narrative.
**BOARDROOM:** Legitimacy proof.

**EXECUTIVE_DENSE:** **EXPOSED at FULL OPERATIONAL DETAIL.**

DenseGovernanceZone renders: proposition counts (accepted/rejected/arbitrated), `by_class` breakdown chips, `by_tier` breakdown, mean confidence to 3 decimal places, friction rate as percentage, revalidation pass/fail counts, constitutional anchor dimensions, certification status, state transitions with from/to/actor/action.

Guided query: "Governance friction analysis — Reveals what was challenged and what survived during operator review."

**INVESTIGATION_DENSE:** **MAXIMUM — FORENSIC DEPTH.**

InvestigationGovernanceAudit renders the MOST DETAILED governance friction view across all personas: full lifecycle table with 6 key-value rows, all state transitions with actor/action/timestamp, full proposition corpus (disposition_counts, mean confidence to 4 decimals, friction rate to 2 decimals, review_status, review_completed_by, obligations_met/total), by_class and by_tier grids, flagged items with individual proposition_id/disposition/rationale.

**Cross-persona insight:** Governance friction across 4 projection altitudes:
- BALANCED: emergence narrative (one of many)
- BOARDROOM: legitimacy proof (one-line sentences)
- DENSE EXECUTIVE: operational detail (counts, percentages, class breakdown)
- DENSE INVESTIGATION: forensic record (individual proposition entries, flagged items)

---

### Tier 4: Interpretation Functions

#### #13 — Signal Interpretation Agent

**BALANCED:** Per-signal meaning-in-context prose.
**BOARDROOM:** Executive reading (altitude-shifted).

**EXECUTIVE_DENSE:** **MAXIMUM PROJECTION.**

DenseSignalEntry renders EVERY field per signal: family tag, signal_name, severity badge, signal_value to 4 decimal places, full interpretive prose, concentration, confidence_note. DenseSignalSection groups by family with labels ("Level 1 — File Structure", "Topology — Cluster Pressure", "Level 2 — Architectural Binding"). Compound narrative renders below the groups.

This is the cognitive function at its RICHEST projection — every signal field visible, organized by family, with no altitude compression.

**INVESTIGATION_DENSE:** **PRESENT at EVIDENCE DEPTH.** Signal stack: pressure_tier with TermHint, signal_label, domain, pressure_label, evidence_text, grounding_label, advisory-bound flag. Signal audit table: signal_id, family tag, signal_name, signal_value (4 decimals), severity, full interpretation. Plus ISIG-specific detail panel.

INVESTIGATION orders by evidence provenance (domain → signals) rather than interpretive structure (family → signals).

---

#### #14 — Evidence Boundary Qualification

**BALANCED:** "Confirmed unknowns — not assumed healthy states."
**BOARDROOM:** Split (legacy yes, governed no).

**EXECUTIVE_DENSE:** **PRESENT as STRUCTURAL TOPOLOGY.**

The semantic topology actor explicitly labels each domain as "structurally backed" vs "semantic-only exposure." The `actor-topo-summary` states the boundary quantitatively. Guided queries: "Semantic continuity domains — Identifies domains that operate on semantic assertion alone without structural correspondence" and "Ungrounded semantic claims — Exposes semantic claims with no structural correspondence — assertions that carry advisory weight without evidence confirmation."

The Evidence Boundary reframe is IMPLICIT in DENSE — the vocabulary "semantic-only exposure" and "advisory weight without evidence confirmation" IS the reframe, distributed across components rather than stated as a single sentence.

**INVESTIGATION_DENSE:** **PRESENT as INFERENCE PROHIBITION.** The IP zone explicitly states: "Executive action on partially-grounded signals requires advisory confirmation." Each signal row flags "advisory bound" when grounding_status !== 'Q-00'. This is the MOST EXPLICIT evidence boundary enforcement — not just acknowledging the boundary but PROHIBITING inference beyond it.

---

#### #15 — Spatial Anchor Resolution

**BALANCED:** Cascaded resolution.
**BOARDROOM:** Pre-resolved label (single).

**EXECUTIVE_DENSE:** **EXPOSED at PER-DOMAIN GRANULARITY.** Every actor that renders domain names (ST, AL, PF, PZ) shows the resolved `domain_alias` for EACH domain in the topology. The operator sees ALL spatial anchors, not just the primary zone. The propagation flow strip shows resolved names per chain node.

**INVESTIGATION_DENSE:** **EXPOSED per signal.** Each signal row shows domain name.

---

### Tier 5: Tracking / Advisory Functions

#### #16 — Temporal Cognition Agent

**BALANCED:** Epoch-based confidence evolution in ReconTrajectoryStrip.
**BOARDROOM:** ABSENT.

**EXECUTIVE_DENSE:** **PRESENT via ReconciliationAwarenessZone.** Unlike boardroom (which returns empty), DENSE renders the full reconciliation zone. Lifecycle trajectory, epoch comparison, domain movements — all present.

**INVESTIGATION_DENSE:** **PRESENT at FULL DEPTH.** ReconciliationAwarenessZone renders with debt drilldown and domain table (investigation mode does not exclude these).

**Cross-persona insight:** Temporal cognition: ABSENT in BOARDROOM, COMPACT in BALANCED, FULL in DENSE. Like trust posture, temporal cognition expands as altitude descends.

---

#### #17 — Guided Cognition Agent

**BALANCED:** 4 emergence queries.
**BOARDROOM:** 4 executive queries.

**EXECUTIVE_DENSE:** **MAXIMUM — 42 GUIDED QUERY PATHS.**

7 zones × 6 paths per zone = 42 interrogation paths. Each path has:
- `label` — the question
- `icon` — tone glyph (◇ ↓ ○ △ ■ ◆ ◎ ◈)
- `tone` — operational/forensic/executive/architectural/quiet/alarming/reflective/containment
- `archetype` — SCAN/TRACE/INTERPRET/BOUNDARY/ESCALATION
- `depth` — micro/standard/deep
- `narrative` — what the path reveals
- `answers` — what question it answers
- `boundary` — governance boundary of the answer

Plus 4 escalation expansions (INTERROGATION_EXPANSION_REGISTRY.EXECUTIVE_DENSE): structural dependencies, evidence chain completeness, pressure propagation, evidence continuity gaps.

This is the cognitive function at MAXIMUM projection — 46 total interrogation vectors. BALANCED has 4. BOARDROOM has 4. DENSE has 46.

The tone taxonomy (8 tones) and archetype taxonomy (5 archetypes) create a NAVIGABLE INTERROGATION FIELD. The operator doesn't just ask questions — they navigate a STRUCTURED INTERROGATION SPACE organized by tone, depth, and cognitive archetype.

**INVESTIGATION_DENSE:** **4 forensic expansions.** Evidence chain gaps, evidence provenance, qualification boundaries, ungrounded claims. Narrow and deep rather than broad.

---

#### #18 — Interrogation Trail Agent

**BALANCED:** Journey recording.
**BOARDROOM:** ABSENT.

**EXECUTIVE_DENSE:** **PRESENT and OPERATIONAL — MAXIMUM PROJECTION.**

`interrogationTrail` state tracks explored queries. `InterrogationTrailBuilder` produces exportable HTML evidence record containing:
- Explored zones with zone codes
- Guided queries answered per zone
- Zone-level findings with evidence chains
- Governance boundary per query (deterministic vs derived)
- Unexamined zones (coverage gap)

The trail export is a GOVERNED EVIDENCE RECORD of the operator's cognitive journey through the DENSE surface. This is the function at maximum projection — not just recording the trail but producing a verifiable artifact.

**INVESTIGATION_DENSE:** **PRESENT.** Same trail builder infrastructure, forensic framing.

---

#### #19 — Confidence Classification

**BALANCED:** Threshold-gated tier compression.
**BOARDROOM:** Passive consumption.

**EXECUTIVE_DENSE:** **EXPOSED at RAW CLASSIFICATION LEVEL.** The semantic topology actor shows per-domain grounding_status (Q-00, Q-01, Q-02 etc.). DenseGovernanceZone shows mean_confidence to 3 decimal places. DenseSignalEntry shows confidence_note per signal. The operator sees the CLASSIFICATION MACHINERY — the Q-class codes, the raw confidence values, the per-signal confidence notes.

**INVESTIGATION_DENSE:** **EXPOSED at MAXIMUM DETAIL.** Each signal row shows grounding_status, grounding_label, and advisory-bound flag. Governance audit shows mean confidence to 4 decimal places, friction rate to 2 decimals.

---

#### #20 — Blockage Detection + Resolution Advisory

**BALANCED:** SQO Intelligence Zone.
**BOARDROOM:** ABSENT.

**EXECUTIVE_DENSE:** **PRESENT.** SQO Intelligence Zone renders (not hidden as in boardroom). The pressureZoneFocus guided query "View qualification blockers" explicitly addresses advancement blockers: "Exposes unresolved semantic domains and debt items affecting qualification progression toward the next S-state."

**INVESTIGATION_DENSE:** **PRESENT at FORENSIC DEPTH.** InvestigationGovernanceAudit renders hold_reason, promotion_eligible, advancement_blocked in key-value table. The operator sees the exact governance reason for blockage.

---

#### #21 — Debt Evolution Tracker

**BALANCED:** Trajectory tracking.
**BOARDROOM:** Event count only.

**EXECUTIVE_DENSE:** **PRESENT.** ReconciliationAwarenessZone renders debt dimensions. The governanceLifecycle guided query "Evidence enrichment impact" derives: "Shows how evidence corrections strengthened the substrate — domain corrections, confidence changes, and debt evolution."

**INVESTIGATION_DENSE:** **PRESENT at FORENSIC DEPTH.** Full debt drilldown available.

---

#### #22 — Authority Mode Router

**BALANCED:** Disclosure wrapper.
**BOARDROOM:** Structural commitment (most explicit single declaration).

**EXECUTIVE_DENSE:** **DISTRIBUTED as PER-QUERY BOUNDARY DECLARATIONS.**

Every guided query path has a `boundary` field stating governance authority: "Derived from reconciliation correspondence — no inference applied," "Domain classification from semantic_domain_registry — deterministic," "Concentration from cluster domain counts — deterministic."

The InterrogationTrailBuilder records governance boundaries per explored query. The zone interpretations include `structuralNote` with derivation provenance. Authority is not declared ONCE — it is declared PER COGNITIVE ACT, at the boundary of each interrogation.

**INVESTIGATION_DENSE:** **MAXIMUM — INFERENCE PROHIBITION ZONE.**

The Inference Prohibition actor (IP) is the most explicit authority declaration in the entire system:
- 13 absolute prohibitions statement
- Qualifier rules applied (listed)
- ALI rules applied (listed)
- "MUST NOT infer beyond evidence, MUST NOT recommend without grounding, MUST NOT overstate readiness"

Plus `TierHandoffStatement` at the bottom. INVESTIGATION doesn't just declare authority — it ENUMERATES every boundary condition.

---

### Non-functional

#### #23 — Structural Assessment Synthesis (INERT)

**BALANCED:** Hardcoded closing assessment.
**BOARDROOM:** Hardcoded (legacy) / governance narrative replaces (governed).

**EXECUTIVE_DENSE:** **PARTIALLY SOLVED.** Zone interpretations provide per-zone structural assessments. The pressureZoneFocus interpretation and the governanceLifecycle interpretation both produce closing narratives from structural state. But there is no OVERALL structural assessment synthesis — each zone assesses itself.

**INVESTIGATION_DENSE:** **ABSENT.** No synthesis at all — evidence only.

---

## PROJECTION TOPOLOGY SUMMARY

### Cognitive Function Distribution (EXECUTIVE_DENSE)

| Projection State | Count | Functions |
|-----------------|-------|-----------|
| **MAXIMUM** | 5 | #13 Signal Interpretation, #17 Guided Cognition (42 paths), #18 Interrogation Trail, #10 Propagation Chain, #12 Governance Friction (forensic) |
| **DECOMPOSED** | 2 | #4 Executive Synthesis (7 zone syntheses), #9 Pressure Concentration (4 zones) |
| **EXPOSED** | 5 | #8 Grounding Asymmetry (sentinel active), #14 Evidence Boundary, #15 Spatial Anchor, #19 Confidence Classification, #22 Authority Mode (per-query) |
| **REPLACED** | 3 | #1 → Zone Orchestration, #2 → Spatial Priority, #3 → Zone Exploration Tracking |
| **PRESENT** | 7 | #5 Posture, #6 Trust Posture (full), #7 Compound Activation, #11 Compression Detection (query), #16 Temporal Cognition, #20 Blockage Detection, #21 Debt Evolution |
| **ABSENT** | 0 | — |

### Cognitive Function Distribution (INVESTIGATION_DENSE)

| Projection State | Count | Functions |
|-----------------|-------|-----------|
| **MAXIMUM** | 3 | #12 Governance Friction (forensic tables), #19 Confidence Classification, #22 Authority Mode (inference prohibition) |
| **EXPOSED** | 5 | #8 Grounding Asymmetry, #13 Signal Interpretation, #14 Evidence Boundary, #15 Spatial Anchor, #20 Blockage Detection |
| **PRESENT** | 6 | #5 Posture, #6 Trust Posture, #16 Temporal Cognition, #17 Guided Cognition (4 paths), #18 Interrogation Trail, #21 Debt Evolution |
| **DECOMPOSED** | 2 | #9 Pressure Concentration, #10 Propagation Chain |
| **ABSENT** | 6 | #1 Emergence Orchestration, #2 Priority Router, #3 Emergence Dashboard, #4 Executive Synthesis, #7 Compound Activation, #11 Compression Detection |

---

## ARCHITECTURAL FINDINGS

### Finding 1: DENSE has ZERO absent functions (EXECUTIVE_DENSE)

Every cognitive function identified in the BALANCED stratum decomposition projects in EXECUTIVE_DENSE — none disappear. This is unique among all personas:
- BOARDROOM: 9 absent
- BALANCED: 0 absent (baseline — functions are defined here)
- DENSE EXECUTIVE: 0 absent

But "present" does not mean "same." Functions are REPLACED (#1-3), DECOMPOSED (#4, #9), EXPOSED (#8, #14, #15, #19, #22), or at MAXIMUM (#10, #12, #13, #17, #18). Every function transforms.

### Finding 2: DENSE DECOMPOSES what BOARDROOM COMPRESSES

The Phase 2 hypothesis was confirmed: DENSE shows the INVERSE pattern of BOARDROOM.

| Function | BOARDROOM | DENSE |
|----------|-----------|-------|
| Executive Synthesis | 5 compressed outputs | 7 zone-local interpretations |
| Pressure Concentration | Single verdict | 4-zone decomposition |
| Signal Interpretation | Executive reading | Full prose + value + concentration |
| Guided Cognition | 4 executive queries | 42 interrogation paths |
| Governance Friction | Legitimacy proof sentences | Per-proposition detail, flagged items |
| Authority Declaration | Single footer commitment | Per-query boundary declaration |

BOARDROOM COMPRESSES cognition into executive verdicts. DENSE DECOMPOSES cognition into inspectable components. The same information, opposite cognitive architectures.

### Finding 3: Three Orchestration Models Confirmed

The cross-persona orchestration architecture is now visible:

| Persona | Orchestration Model | Driver |
|---------|-------------------|--------|
| BALANCED | Emergence orchestration | Structural state activates cognitive functions |
| BOARDROOM | Compiled projection | Deterministic compilation produces fixed surface |
| DENSE | Zone orchestration | Operator scroll position drives cognitive focus |

These are not "different views of the same thing." They are DIFFERENT COGNITIVE ARCHITECTURES. The emergence model discovers what matters. The compilation model declares what matters. The zone model lets the operator find what matters to them.

### Finding 4: Guided Cognition is the DENSE Differentiator

42 interrogation paths vs 4 (BALANCED) vs 4 (BOARDROOM). The guided cognition function DEFINES DENSE more than any other function. The interrogation path taxonomy:

- 8 tones (operational, forensic, executive, architectural, quiet, alarming, reflective, containment)
- 5 archetypes (SCAN, TRACE, INTERPRET, BOUNDARY, ESCALATION)
- 3 depths (micro, standard, deep)

This creates a NAVIGABLE INTERROGATION SPACE — not a Q&A interface but a structured cognitive field where the operator moves along tone, archetype, and depth axes. The InterrogationTrailBuilder records this movement as a governed evidence record.

### Finding 5: Authority Distribution vs Authority Declaration

BOARDROOM declares authority once, loudly (footer + governance section). DENSE distributes authority across every cognitive act — each guided query path carries its own `boundary` declaration. INVESTIGATION enumerates every prohibition.

This creates three authority projection models:
- BOARDROOM: "We are operating under 75.x bounded authority" (DECLARATION)
- DENSE: "This specific answer is derived from reconciliation correspondence — no inference" (PER-ACT BOUNDARY)
- INVESTIGATION: "These are the 13 things we will NOT do" (PROHIBITION ENUMERATION)

### Finding 6: INVESTIGATION_DENSE is NOT "deeper DENSE"

INVESTIGATION_DENSE has 6 ABSENT functions (including Executive Synthesis, Compound Activation, Compression Detection, and the orchestration tier). It is not a "deeper" version of EXECUTIVE_DENSE. It is a DIFFERENT COGNITIVE ARCHITECTURE optimized for a different operator:

- EXECUTIVE_DENSE: CTO mode. "Show me cause and propagation. Let me interrogate the structure."
- INVESTIGATION_DENSE: Analyst/auditor mode. "Show me evidence. Prove every claim. Enumerate every constraint."

The relationship is not depth (DENSE < INVESTIGATION). It is ORIENTATION (structural interpretation vs evidence verification).

---

## CROSS-PERSONA COMPARISON (Phase 1 → Phase 2 → Phase 3)

| # | Cognitive Function | BALANCED | BOARDROOM | DENSE EXEC | DENSE INVEST |
|---|-------------------|----------|-----------|------------|--------------|
| 1 | Emergence Orchestration | CENTRAL | ABSENT | REPLACED (zone) | ABSENT |
| 2 | Cognitive Priority Router | DYNAMIC | FIXED | SPATIAL | FIXED |
| 3 | Emergence Dashboard | META-COGNITIVE | ABSENT | ZONE TRACKING | ABSENT |
| 4 | Executive Synthesis | LEAD PARA | DOMINANT | DECOMPOSED (7) | ABSENT |
| 5 | Posture Synthesis | 3-INPUT | GATE | DISTRIBUTED | GOVERNANCE TABLE |
| 6 | Trust Posture | COMPACT | ABSENT | FULL | FULL |
| 7 | Compound Activation | ACTIVE | PASSIVE | SIGNAL-LEVEL | ABSENT |
| 8 | Grounding Asymmetry | SENTINEL | ALWAYS-ON | EXPOSED+SENTINEL | EVIDENCE BLOCK |
| 9 | Pressure Concentration | ONE OF 22 | DOMINANT | DECOMPOSED (4) | PER-SIGNAL |
| 10 | Propagation Chain | SECONDARY | ELEVATED | MAXIMUM (3 zones) | EVIDENCE LEVEL |
| 11 | Compression Detection | DIAGNOSTIC | ABSENT | GUIDED QUERY | IMPLICIT |
| 12 | Governance Friction | EMERGENCE | LEGITIMACY | OPERATIONAL | FORENSIC MAX |
| 13 | Signal Interpretation | FULL PROSE | EXEC READING | MAXIMUM | EVIDENCE DEPTH |
| 14 | Evidence Boundary | COGNITIVE REFRAME | SPLIT | STRUCTURAL TOPO | PROHIBITION |
| 15 | Spatial Anchor | CASCADED | PRE-RESOLVED | PER-DOMAIN | PER-SIGNAL |
| 16 | Temporal Cognition | EPOCH STRIP | ABSENT | FULL ZONE | FULL+DEBT |
| 17 | Guided Cognition | 4 QUERIES | 4 QUERIES | 42 PATHS | 4 FORENSIC |
| 18 | Interrogation Trail | RECORDING | ABSENT | MAX+EXPORT | RECORDING |
| 19 | Confidence Classification | TIER LOGIC | PASSIVE | RAW Q-CLASS | MAX DETAIL |
| 20 | Blockage Detection | SQO ZONE | ABSENT | PRESENT+QUERY | FORENSIC |
| 21 | Debt Evolution | TRAJECTORY | COUNT ONLY | PRESENT | FORENSIC DEPTH |
| 22 | Authority Mode | DISCLOSURE | COMMITMENT | PER-QUERY | PROHIBITION |

---

## PHASE 3 CONCLUSION

DENSE confirmed the Phase 2 hypothesis: it is the INVERSE of BOARDROOM. Where BOARDROOM compresses 22 functions into 2 dominant + 5 supporting, DENSE decomposes them into inspectable components across 7 zones with 42 interrogation paths.

The defining architectural identity:
- **EXECUTIVE_DENSE:** Operator-navigated structural decomposition through zone orchestration with governed interrogation field.
- **INVESTIGATION_DENSE:** Evidence verification through forensic enumeration with inference prohibition.

Zero functions are absent in EXECUTIVE_DENSE. All 22 project — but none project the same way they do in BALANCED. They REPLACE (orchestration), DECOMPOSE (synthesis, pressure), EXPOSE (classification, boundaries, anchors), or reach MAXIMUM (signals, guided queries, trail, propagation).

The three orchestration models — emergence (BALANCED), compilation (BOARDROOM), zone navigation (DENSE) — are the most significant cross-persona finding. They are not style variations. They are fundamentally different cognitive architectures through which the same 22 functions project.

**Next:** Phase 4 — INVESTIGATION targeted pass. Based on Phase 3 findings, INVESTIGATION_DENSE already shows the INVESTIGATION architecture partially. Phase 4 should focus on what INVESTIGATION adds BEYOND INVESTIGATION_DENSE — if there is a separate INVESTIGATION persona surface, or whether INVESTIGATION_DENSE IS the investigation persona.
