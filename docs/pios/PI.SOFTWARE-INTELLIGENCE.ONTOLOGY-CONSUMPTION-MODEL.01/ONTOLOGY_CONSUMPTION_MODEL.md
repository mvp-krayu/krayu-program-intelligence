# SW-INTEL Ontology Consumption Model

**Stream:** PI.SOFTWARE-INTELLIGENCE.ONTOLOGY-CONSUMPTION-MODEL.01
**Classification:** G2 — Architecture-Consuming
**Baseline:** 16f8a85 (persona mission contracts merged to main)

**Governing inputs:**
- PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01 — ontology classes (§7), persona projection matrix (§15)
- PI.PERSONA.MISSION-CONTRACTS-AND-COGNITIVE-OBJECTIVES.01 — persona constitutional objectives, consumed/prohibited cognition
- PI.SOFTWARE-INTELLIGENCE.EXISTING-SLICE-AUDIT-AND-CLASSIFICATION.01 — maturity classifications, evidence/replay gaps

---

## §1 — Purpose

Define how the five SW-INTEL ontology classes are consumed across the four LENS personas.

The persona mission contracts locked WHAT each persona exists for. This document locks HOW each persona consumes the ontology — what it receives, what compression it applies, what evidence it requires, and what it must not expose.

This is a consumption model, not an implementation plan. It defines the contracts between the ontology and the personas. Implementation streams consume this model.

---

## §2 — Consumption Posture Vocabulary

Six postures define how a persona relates to an ontology class:

| Posture | Definition | Rendering Implication | Evidence Requirement |
|---|---|---|---|
| **PRIMARY** | Central to the persona's cognitive purpose. The persona actively consumes this class as a primary content driver. | Dedicated rendering surface. Prominent visual weight. Interactive elements possible. | Full evidence lineage from underlying slices. Confidence classification visible. |
| **SECONDARY** | Visible but not central. Appears as supporting context or secondary content. | Embedded in other surfaces. Moderate visual weight. Not independently navigable. | Evidence lineage available on demand, not always visible. |
| **COMPRESSED** | Present but compressed into a label, chip, or posture indicator. Active synthesis eliminated. | Single token: label, chip, severity indicator, or posture word. No expansion. | Confidence classification only. No evidence drill. |
| **SUPPRESSED** | Intentionally hidden. Below the persona's cognitive altitude. | Not rendered. No affordance. No teaser. | None — class is invisible to the operator in this persona. |
| **PROOF-ONLY** | Appears only as evidence to be verified, not as content to be consumed or navigated. | Evidence tables, hash references, provenance chains. No operational interpretation. | Maximum evidence depth. Full derivation trace. Replay-capable. |
| **NOT APPLICABLE** | No current implementation pathway. The ontology class cannot be consumed because no runtime construct produces the required data. | Nothing to render — the gap is in the ontology, not the persona. | None — no evidence exists to consume. |

---

## §3 — Ontology Class Definitions (Reference)

From PI.SOFTWARE-INTELLIGENCE.SLICE-TAXONOMY-AND-GOVERNANCE.01 §7:

| Class | Purpose | Foundational Slices | Runtime Evidence |
|---|---|---|---|
| **A — Flow & Propagation** | Expose how software-operational pressure moves through topology | Propagation Asymmetry, Dependency Choke Point | ISIG-001, ISIG-002, conditions: PROPAGATION_ASYMMETRY, DEPENDENCY_CHOKE_POINT |
| **B — Concentration & Saturation** | Expose where execution, dependency, or coordination load concentrates | Structural Mass Concentration, Pressure Zone Convergence, Import Pressure Concentration | DPSIG-031, pressure_zone_state, ISIG, conditions: STRUCTURAL_MASS_CONCENTRATION, DELIVERY_PRESSURE_CONCENTRATION |
| **C — Fragility & Resilience** | Expose failure sensitivity, coordination weakness, or structural rebound risk | (none at FOUNDATIONAL) | COORD_FRAG consequence exists but no independent slice derivation |
| **D — Reinforcement & Accumulation** | Expose self-strengthening operational dynamics | (none at FOUNDATIONAL — SPECIMEN only) | forBalanced() relationship verbs, 3 combination patterns |
| **E — Drift & Instability** | Expose temporal or structural divergence | Entrypoint Stability Risk (FOUNDATIONAL) | STAB_RISK consequence |

---

## §4 — The Consumption Matrix

### §4.1 — Full Matrix

| Ontology Class | BOARDROOM | BALANCED | DENSE | INVESTIGATION |
|---|---|---|---|---|
| **A — Flow & Propagation** | COMPRESSED | SECONDARY | PRIMARY | PROOF-ONLY |
| **B — Concentration & Saturation** | PRIMARY | PRIMARY | PRIMARY | PROOF-ONLY |
| **C — Fragility & Resilience** | COMPRESSED | SECONDARY | SECONDARY | NOT APPLICABLE |
| **D — Reinforcement & Accumulation** | COMPRESSED | PRIMARY | SECONDARY | PROOF-ONLY |
| **E — Drift & Instability** | SUPPRESSED | SECONDARY | SECONDARY | PROOF-ONLY |

### §4.2 — Reading the Matrix

**Columns** = personas. Each column must be consistent with the persona's constitutional objective:
- BOARDROOM compresses everything except its PRIMARY (B: Concentration). This is correct — the executive receives a consequence verdict anchored in concentration, with propagation, fragility, and reinforcement compressed into chips/labels.
- BALANCED has three PRIMARY classes (B, D) plus secondaries. This is correct — BALANCED's briefing corridor is driven by concentration (posture) and reinforcement (flow), with propagation and fragility as supporting dynamics.
- DENSE has two PRIMARY classes (A, B). This is correct — DENSE's topology interrogation is anchored in propagation corridors and concentration zones, with reinforcement and drift as supporting explorations.
- INVESTIGATION is PROOF-ONLY across the board. This is correct — INVESTIGATION verifies evidence, it does not consume operational meaning from any class.

**Rows** = ontology classes. Each row must have at least one PRIMARY persona (except Class C which has no FOUNDATIONAL slices):
- Class A: PRIMARY in DENSE — correct, propagation is topology behavior.
- Class B: PRIMARY in BOARDROOM, BALANCED, DENSE — correct, concentration is the dominant structural pattern.
- Class C: No PRIMARY — correct, no foundational slices exist to drive primary consumption. SECONDARY in BALANCED and DENSE because fragility appears as secondary characteristic of existing consequences.
- Class D: PRIMARY in BALANCED — correct, reinforcement flow IS BALANCED's central element.
- Class E: No PRIMARY — correct, drift evidence is minimal (single STAB_RISK consequence). SECONDARY in BALANCED and DENSE.

---

## §5 — Per-Persona Consumption Contracts

### §5.1 — BOARDROOM Consumption Contract

**Constitutional objective:** Executive consequence qualification.
**Governing rule:** BOARDROOM compresses ontology into executive verdict. Individual slices never visible. Classes compressed to posture indicators.

| Class | Posture | What BOARDROOM Receives | What BOARDROOM Must Not Show |
|---|---|---|---|
| A — Flow & Propagation | COMPRESSED | Propagation chain in verdict (origin → passthrough → receiver). Propagation risk label in left panel. | Propagation corridor mechanics. Fan-out ratios. Per-signal propagation paths. |
| B — Concentration & Saturation | PRIMARY | Pressure concentration as dominant executive signal (~40% of surface). Tension count. Pressure zone locus. Signal family chips. | Individual condition cards. Zone-level decomposition. Per-signal concentration metrics. |
| C — Fragility & Resilience | COMPRESSED | Posture label captures fragility state ("Coordination Fragility" in posture label when applicable). COORD_FRAG consequence title. | Fragility mechanics. Resilience analysis. Coordination dependency chains. |
| D — Reinforcement & Accumulation | COMPRESSED | Combination pattern existence in consequence posture ("Systemic" = multiple reinforcing conditions). Consequence count. | Reinforcement verbs. Relationship flow. Individual combination evidence. |
| E — Drift & Instability | SUPPRESSED | Not shown. Below executive altitude. | Everything — drift/instability mechanics are invisible in BOARDROOM. |

**Compiler contract:** `forBoardroom()` must produce:
- Consequence posture (grouped, not itemized) — serves Class B PRIMARY
- Cognition slices with executive names — serves Class A/B COMPRESSED
- Combined synthesis sentence — serves Class D COMPRESSED
- Posture label, severity, scope, locus — serves Class B PRIMARY

**Current implementation alignment:** ALIGNED. `forBoardroom()` produces exactly this structure.

### §5.2 — BALANCED Consumption Contract

**Constitutional objective:** Governed operational cognition briefing.
**Governing rule:** BALANCED sequences ontology into a consequence briefing corridor. Classes appear as narrative dynamics, reinforcement relationships, and confidence calibration. Not topology, not proof.

| Class | Posture | What BALANCED Receives | What BALANCED Must Not Show |
|---|---|---|---|
| A — Flow & Propagation | SECONDARY | Propagation dynamics in reinforcement flow entries. Propagation exposure as contributing consequence. Source conditions named. | Propagation corridor topology. Fan-out metrics. Per-signal propagation paths. |
| B — Concentration & Saturation | PRIMARY | Primary consequence story (visually dominant). Posture headline. Epicenter facts. Concentration as operational cause. | Zone-level decomposition. Individual condition cards. Topology overlay control. |
| C — Fragility & Resilience | SECONDARY | Fragility posture in headline when applicable. Coordination fragility as reinforcement flow entry. Resilience in confidence strip qualification. | Fragility mechanics. Resilience measurement methodology. Coordination dependency chains. |
| D — Reinforcement & Accumulation | PRIMARY | Reinforcement flow as central visual element. Relationship verbs (amplifies, reinforces, converges, widens, concentrates). Convergence sentence. | Individual combination pattern evidence. Raw combination logic. Combination selection mechanics. |
| E — Drift & Instability | SECONDARY | Stability risk in primary story when systemic. STAB_RISK consequence as reinforcement entry when present. | Drift measurement. Temporal comparison. Instability detection methodology. |

**Compiler contract:** `forBalanced()` must produce:
- Primary story with operational implication — serves Class B PRIMARY
- Reinforcement flow with relationship verbs — serves Class D PRIMARY
- Source conditions per consequence — serves Class A SECONDARY
- Confidence sentence — serves Class C SECONDARY (resilience calibration)

**Current implementation alignment:** ALIGNED. `forBalanced()` + ZoneComposer produce exactly this structure. Zone 1 = posture (B), Zone 2 = reinforcement (D), Zone 3 = primary story (B), Zone 4 = confidence (C), Zone 5 = descent.

### §5.3 — DENSE Consumption Contract

**Constitutional objective:** Structural behavior interrogation.
**Governing rule:** DENSE decomposes ontology into navigable topology mechanics. Classes appear as topology overlays, condition cards, zone interpretations, and guided interrogation paths. Operator controls focus.

| Class | Posture | What DENSE Receives | What DENSE Must Not Show |
|---|---|---|---|
| A — Flow & Propagation | PRIMARY | Propagation corridors on topology. Dependency choke point overlay. Propagation asymmetry overlay. Import amplification corridors. Guided interventions: trace hub connections, trace downstream impact. | Executive propagation summary. Compressed propagation labels. |
| B — Concentration & Saturation | PRIMARY | Pressure zone overlay on topology. Structural mass emphasis. Compound convergence overlay. Zone members, anchor pulse. Guided interventions: show zone members, map blast radius, show cluster composition. | Executive concentration verdict. Compressed posture labels. |
| C — Fragility & Resilience | SECONDARY | COORD_FRAG consequence visible in condition detail. Fragility implications in zone interpretations. No independent topology overlay (no foundational slice). | Fragility as primary investigation target (no independent evidence). |
| D — Reinforcement & Accumulation | SECONDARY | Compound convergence overlay (D class specimen). Combination pattern awareness in condition detail. Cross-domain coupling pressure overlay. | Reinforcement flow visualization (BALANCED's territory). Relationship verbs. Consequence sequencing. |
| E — Drift & Instability | SECONDARY | STAB_RISK consequence in signal audit. Stability risk in temporal zone when present. No independent topology overlay. | Drift detection methodology. Temporal comparison mechanics (requires multi-run evidence). |

**Compiler contract:** DENSE does not consume a persona-specific compiler projection. It consumes:
- `synthesisResult.conditions` — topology overlay conditions with guided interventions
- `swIntelProjection` — cognition surfaces via SoftwareIntelligenceProjectionAdapter
- Topology cognition overlays via `topologyCognitionOverlay`

These serve Class A + B PRIMARY through direct topology mechanics exposure.

**Current implementation alignment:** ALIGNED. Topology cognition overlays (4 slices), condition-level guided interventions, and zone interpretations already serve this contract.

### §5.4 — INVESTIGATION Consumption Contract

**Constitutional objective:** Evidence qualification and governed replay.
**Governing rule:** INVESTIGATION verifies ontology evidence at full depth. All classes appear as proof artifacts — evidence hashes, derivation chains, signal values, governance audit entries. No operational interpretation.

| Class | Posture | What INVESTIGATION Receives | What INVESTIGATION Must Not Show |
|---|---|---|---|
| A — Flow & Propagation | PROOF-ONLY | Signal values for ISIG-001, ISIG-002 at 4-decimal precision. Derivation hash. Evidence object hash. Signal audit rows with interpretation field. | Propagation narrative. Corridor visualization. Operational meaning of propagation. |
| B — Concentration & Saturation | PROOF-ONLY | Signal values for DPSIG-031, pressure zone signals. Condition evidence in signal stack. Governance audit entries for concentration-related propositions. | Concentration narrative. Pressure zone visualization. Operational meaning of concentration. |
| C — Fragility & Resilience | NOT APPLICABLE | No independent evidence to verify. COORD_FRAG exists as consequence type but INVESTIGATION does not currently render consequence-level verification. | Fragility interpretation. Resilience assessment. |
| D — Reinforcement & Accumulation | PROOF-ONLY | Compound convergence signal in signal stack. Cross-domain coupling signal in signal audit. Combination pattern evidence (if consequence-level verification is added). | Reinforcement flow. Relationship verbs. Consequence sequencing. |
| E — Drift & Instability | PROOF-ONLY | STAB_RISK-related signal evidence in signal audit. Temporal data in temporal zone. | Stability interpretation. Drift narrative. |

**Compiler contract:** INVESTIGATION does not consume a persona-specific compiler projection. It consumes:
- `fullReport` — raw evidence (signals, blocks, trace linkage, governance lifecycle)
- `SoftwareIntelligenceInvestigationView` — projection surfaces (STALE — predates consequence compiler)

**Current implementation alignment:** STALE. INVESTIGATION's SW-INTEL consumption predates the consequence compiler and slice ontology. It shows projection surfaces but does not verify consequence derivation chains or slice evidence contracts. Revalidation stream required.

---

## §6 — Cross-Class Consumption Rules

### §6.1 — No Class May Be PRIMARY in More Than Three Personas

A class that is PRIMARY everywhere has lost its discriminating power. The matrix enforces this — no class exceeds 3 PRIMARY designations. Class B reaches 3 (BOARDROOM, BALANCED, DENSE) because concentration is the dominant structural pattern in the current specimen. This is acceptable because each persona consumes Class B DIFFERENTLY:
- BOARDROOM: compressed verdict (~40% of surface as executive signal)
- BALANCED: primary story in briefing corridor (cause-effect narrative)
- DENSE: decomposed topology overlays (interactive mechanics)

### §6.2 — PROOF-ONLY Is INVESTIGATION-Exclusive

No other persona uses PROOF-ONLY. Evidence verification is INVESTIGATION's constitutional purpose. If another persona needs to verify evidence, the operator descends to INVESTIGATION.

### §6.3 — SUPPRESSED Requires Justification

SUPPRESSED means intentionally hidden — the class exists but the persona chooses not to show it. Currently only one suppression exists: Class E (Drift & Instability) in BOARDROOM. Justification: drift/instability requires temporal comparison and multi-run evidence, which is below executive altitude and carries interpretive risk the BOARDROOM persona is not authorized for.

### §6.4 — NOT APPLICABLE Is a Gap Signal

NOT APPLICABLE means the ontology class cannot be consumed because no runtime construct produces the required evidence. Currently: Class C in INVESTIGATION. This is a gap in the ontology (no independent fragility evidence), not a gap in the persona contract.

### §6.5 — Compression Must Preserve Semantic Truth

When a class is COMPRESSED, the compression must preserve the operational meaning of the class, not just a label. BOARDROOM's compression of Class D (Reinforcement) into "Systemic" in the posture label preserves the meaning: multiple reinforcing conditions converge. If compression loses meaning, it is an evidence violation, not a rendering choice.

---

## §7 — Maturity-Gated Consumption

The slice taxonomy (§15) specifies minimum maturity for persona consumption:

| Persona | Minimum Maturity | Rationale |
|---|---|---|
| BOARDROOM | CERTIFIED | Executive verdicts require fully governed, replay-certified slices |
| BALANCED | COMPOSABLE | Briefing corridor requires slices that can participate in consequence composition |
| DENSE | FOUNDATIONAL | Topology overlays require evidence-contract-compliant slices |
| INVESTIGATION | FOUNDATIONAL | Evidence verification requires evidence-contract-compliant slices |

### §7.1 — Current Maturity vs Requirements

| Ontology Class | Highest Maturity Specimen | BOARDROOM (CERTIFIED) | BALANCED (COMPOSABLE) | DENSE (FOUNDATIONAL) | INVESTIGATION (FOUNDATIONAL) |
|---|---|---|---|---|---|
| A — Flow & Propagation | FOUNDATIONAL (conditions) | BELOW — consumed via consequence posture (compiler handles maturity gap) | BELOW — consumed via forBalanced() (compiler handles maturity gap) | MET | MET |
| B — Concentration & Saturation | FOUNDATIONAL (conditions) | BELOW — consumed via consequence posture | BELOW — consumed via forBalanced() | MET | MET |
| C — Fragility & Resilience | SPECIMEN (consequence only) | BELOW | BELOW | BELOW | NOT APPLICABLE |
| D — Reinforcement & Accumulation | SPECIMEN (combination patterns) | BELOW — consumed via consequence posture | BELOW — consumed via forBalanced() | BELOW | BELOW |
| E — Drift & Instability | FOUNDATIONAL (entrypoint) | BELOW | BELOW | MET (entrypoint only) | MET (entrypoint only) |

### §7.2 — How the Compiler Bridges Maturity Gaps

BOARDROOM requires CERTIFIED. BALANCED requires COMPOSABLE. No slice is currently above FOUNDATIONAL. Yet both personas consume slice-derived content. How?

The ConsequenceCompiler bridges the gap. It operates as a **governed projection compiler** that:
1. Consumes FOUNDATIONAL/SPECIMEN-level conditions
2. Applies deterministic mapping rules (§4 of ConsequenceCompiler)
3. Produces persona-specific projections (`forBoardroom()`, `forBalanced()`)
4. Enforces consequence vocabulary (no freeform language)

The compiler does NOT elevate slice maturity. It produces a GOVERNED PROJECTION from sub-maturity slices. The projection carries the compiler's governance guarantees (deterministic, vocabulary-bound), not the underlying slice's maturity level.

This is architecturally correct — the persona consumes the COMPILER'S output, not the raw slice. The compiler owns the maturity-to-projection bridge.

### §7.3 — When Raw Consumption Replaces Compiler Bridge

If a slice reaches the persona's required maturity level, the compiler bridge is no longer necessary for that slice. The persona MAY consume the slice directly — but is not required to. The compiler remains a valid projection path even for fully mature slices because it provides:
- Vocabulary enforcement
- Compression rules
- Persona-appropriate framing
- Cross-slice composition (BALANCED reinforcement flow)

Direct consumption without compiler would only be appropriate for DENSE (topology overlays consume conditions directly) and INVESTIGATION (evidence verification consumes raw evidence directly).

---

## §8 — Per-Class Consumption Detail

### §8.1 — Class A: Flow & Propagation

**What it reveals:** How software-operational pressure moves through topology — propagation paths, dependency corridors, fan-out asymmetry.

| Persona | Posture | Receives | Via |
|---|---|---|---|
| BOARDROOM | COMPRESSED | Propagation risk label, propagation chain in verdict | `forBoardroom()` → consequence posture |
| BALANCED | SECONDARY | Propagation dynamics in reinforcement flow, PROP_EXP as contributing consequence | `forBalanced()` → reinforcement flow entries |
| DENSE | PRIMARY | Propagation corridor overlays, dependency choke point overlays, guided interventions (trace hub, trace downstream) | Direct condition consumption + topology cognition overlays |
| INVESTIGATION | PROOF-ONLY | ISIG-001/002 signal values at 4 decimals, derivation hash, evidence audit rows | Direct fullReport consumption |

**Implementation gap:** None for current postures. All consumption paths operational.

### §8.2 — Class B: Concentration & Saturation

**What it reveals:** Where execution, dependency, or coordination load concentrates — pressure zones, structural mass, import hubs.

| Persona | Posture | Receives | Via |
|---|---|---|---|
| BOARDROOM | PRIMARY | Tension count, pressure zone locus, signal family chips, pressure dimension bars, executive concentration narrative | `forBoardroom()` → consequence posture + BoardroomProjectionCompiler |
| BALANCED | PRIMARY | Primary consequence story, posture headline, epicenter facts, concentration as operational cause | `forBalanced()` → Zone 1 (posture) + Zone 3 (primary story) |
| DENSE | PRIMARY | Pressure zone overlay, structural mass emphasis, compound convergence overlay, zone members, anchor pulse, guided interventions | Direct condition consumption + topology cognition overlays |
| INVESTIGATION | PROOF-ONLY | DPSIG-031 signal values, pressure zone signals, condition evidence in signal stack, governance audit entries | Direct fullReport consumption |

**Implementation gap:** None. Class B is the most fully implemented across all personas.

### §8.3 — Class C: Fragility & Resilience

**What it reveals:** Failure sensitivity, coordination weakness, structural rebound risk.

| Persona | Posture | Receives | Via |
|---|---|---|---|
| BOARDROOM | COMPRESSED | Fragility state in posture label ("Coordination Fragility") when COORD_FRAG is the primary consequence | `forBoardroom()` → consequence posture label |
| BALANCED | SECONDARY | COORD_FRAG as reinforcement flow entry when present, fragility in confidence strip qualification | `forBalanced()` → reinforcement flow |
| DENSE | SECONDARY | COORD_FRAG consequence in condition detail, fragility implications in zone interpretations | Condition cards + zone interpretations |
| INVESTIGATION | NOT APPLICABLE | No independent fragility evidence to verify | — |

**Implementation gap:** Class C has no FOUNDATIONAL slice. COORD_FRAG exists as a consequence type (SPECIMEN) but is derived from DELIVERY_PRESSURE_CONCENTRATION and CROSS_DOMAIN_COUPLING_PRESSURE conditions — it is a CLASS B byproduct, not an independent Class C derivation. When independent fragility evidence becomes available (e.g., coordination fragility slice with its own derivation path), all four personas will need consumption updates.

**Gap resolution path:** PI.SOFTWARE-INTELLIGENCE.ADVANCED-SLICE-SPECIMENS.01 should include at least one Class C slice with independent derivation to close this ontology gap.

### §8.4 — Class D: Reinforcement & Accumulation

**What it reveals:** Self-strengthening operational dynamics — how consequences amplify, reinforce, or widen each other.

| Persona | Posture | Receives | Via |
|---|---|---|---|
| BOARDROOM | COMPRESSED | Combination pattern existence compressed to "Systemic" in posture label, consequence count | `forBoardroom()` → posture label + consequence count |
| BALANCED | PRIMARY | Reinforcement flow (central visual element), relationship verbs, convergence sentence, consequence relationships | `forBalanced()` → Zone 2 (reinforcement flow) |
| DENSE | SECONDARY | Compound convergence overlay, combination pattern awareness in condition detail, CDCP overlay | Topology cognition overlays + condition cards |
| INVESTIGATION | PROOF-ONLY | Compound convergence signal evidence, cross-domain coupling signal evidence, combination pattern evidence (when consequence verification added) | Direct fullReport consumption |

**Implementation gap:** INVESTIGATION's consumption is stale — `SoftwareIntelligenceInvestigationView` does not verify consequence-level evidence including combination patterns. Class D proof-only consumption requires INVESTIGATION revalidation to be fully operational.

### §8.5 — Class E: Drift & Instability

**What it reveals:** Temporal or structural divergence — entrypoint stability risk, convergence escalation, drift detection.

| Persona | Posture | Receives | Via |
|---|---|---|---|
| BOARDROOM | SUPPRESSED | Not shown — below executive altitude, interpretive risk | — |
| BALANCED | SECONDARY | STAB_RISK consequence in primary story when systemic, stability risk in reinforcement flow | `forBalanced()` → primary story / reinforcement flow |
| DENSE | SECONDARY | STAB_RISK in signal audit, stability risk in temporal zone, entrypoint centrality in guided queries | Zone interpretations + temporal zone |
| INVESTIGATION | PROOF-ONLY | STAB_RISK-related signal evidence in signal audit, temporal data | Direct fullReport consumption |

**Implementation gap:** Class E is minimally implemented — single STAB_RISK consequence, single entrypoint stability risk slice. Full drift detection requires temporal evidence (multi-run comparison) which is not yet available in the runtime. Current consumption postures are correct for available evidence.

---

## §9 — Consumption Evolution Rules

### §9.1 — When a New Slice Enters the Ontology

When a new slice is added to any ontology class:

1. **Classify its maturity** per promotion lifecycle (CANDIDATE → SPECIMEN → FOUNDATIONAL → COMPOSABLE → CERTIFIED → DEPRECATED)
2. **Check persona consumption matrix** — which personas consume this class at which posture?
3. **Check maturity gate** — does the slice meet the persona's minimum maturity requirement? If not, the compiler bridge applies.
4. **For PRIMARY personas:** the new slice's evidence must flow into the persona's rendering surface. This may require compiler evolution.
5. **For SECONDARY/COMPRESSED personas:** the new slice is absorbed by existing consumption pathways. No new rendering surface required.
6. **For PROOF-ONLY personas:** the new slice's evidence must be verifiable in the investigation surface. Signal audit, derivation trace, governance audit.
7. **For SUPPRESSED personas:** no action required.

### §9.2 — When a Posture Changes

A posture may change (e.g., SECONDARY → PRIMARY) only through a governed stream that:
1. Justifies the change against the persona's constitutional objective
2. Verifies no persona boundary rule is violated (§9 of persona mission contracts)
3. Updates this consumption model
4. Updates the persona mission contract's §14 (ontology consumption posture)

### §9.3 — When Class C Gets a Foundational Slice

Class C currently has no FOUNDATIONAL slice and INVESTIGATION marks it NOT APPLICABLE. When the first Class C foundational slice is created:
1. BALANCED and DENSE consumption postures remain SECONDARY — no change needed
2. BOARDROOM remains COMPRESSED — fragility appears in posture label
3. INVESTIGATION changes from NOT APPLICABLE to PROOF-ONLY — new evidence becomes verifiable
4. Update this consumption model (§8.3 and §4.1)

---

## §10 — Compiler Responsibility Map

The ConsequenceCompiler is the primary consumption bridge. This section maps which compiler outputs serve which consumption postures.

| Compiler Output | Persona | Classes Served | Consumption Posture |
|---|---|---|---|
| `forBoardroom()` → consequence posture | BOARDROOM | B (PRIMARY), A/C/D (COMPRESSED) | Grouped consequence with posture label, severity, scope, locus |
| `forBoardroom()` → cognition slices | BOARDROOM | A/B (COMPRESSED) | Executive names, operational meaning, confidence label |
| `forBoardroom()` → combined synthesis | BOARDROOM | D (COMPRESSED) | Single sentence combining multiple slice dynamics |
| `forBalanced()` → primary story | BALANCED | B (PRIMARY) | Highest-severity consequence as operational cause → effect |
| `forBalanced()` → reinforcement flow | BALANCED | D (PRIMARY), A/C (SECONDARY) | Relationship verbs, consequence relationships, contributing conditions |
| `forBalanced()` → confidence sentence | BALANCED | C (SECONDARY) | Confidence calibration with governance boundary |
| Direct conditions | DENSE | A/B (PRIMARY) | Topology overlays, guided interventions, zone interpretations |
| Direct fullReport | INVESTIGATION | A/B/D/E (PROOF-ONLY) | Signal values, evidence hashes, derivation traces |

**Key observation:** BOARDROOM and BALANCED consume ontology ONLY through the compiler. DENSE and INVESTIGATION consume ontology directly from the runtime substrate. This is the architectural split between COMPILED/EMERGENT consumption (top personas) and DIRECT consumption (bottom personas).

---

## §11 — Implementation Alignment Summary

| Persona | Alignment | Detail |
|---|---|---|
| **BOARDROOM** | ALIGNED | `forBoardroom()` produces correct consumption structure. All postures operational. |
| **BALANCED** | ALIGNED | `forBalanced()` + ZoneComposer produce correct consumption structure. All postures operational. |
| **DENSE** | ALIGNED | Topology cognition overlays + condition cards + zone interpretations produce correct consumption. All postures operational. |
| **INVESTIGATION** | STALE | SW-INTEL consumption predates consequence compiler. Class D proof-only requires consequence-level verification. Class C NOT APPLICABLE is correct but reflects ontology gap, not implementation gap. |

---

## §12 — Gaps and Risks

1. **Class C ontology gap.** No FOUNDATIONAL slice. COORD_FRAG exists as consequence byproduct. Independent fragility derivation needed. Affects: all personas at reduced depth.

2. **Class E minimal coverage.** Single STAB_RISK consequence + entrypoint stability risk. Full drift detection requires temporal evidence (multi-run comparison). Affects: BALANCED and DENSE secondary consumption.

3. **INVESTIGATION staleness.** Does not verify consequence derivation chains or slice evidence contracts. Class D proof-only consumption is not fully operational. Revalidation stream required.

4. **Maturity gap.** No slice above FOUNDATIONAL. BOARDROOM (CERTIFIED) and BALANCED (COMPOSABLE) consume through compiler bridge. If compiler bridge fails or produces incorrect output, maturity gap is exposed to the operator. Risk: LOW — compiler is deterministic and vocabulary-bound.

5. **Class D dominance in BALANCED.** Reinforcement flow is BALANCED's central element but relies on SPECIMEN-level data (combination patterns). If combination pattern derivation changes, BALANCED briefing corridor is affected disproportionately.

---

## §13 — Non-Goals

This stream does NOT:
- Implement ontology consumption rendering
- Modify the consequence compiler
- Add new slices or ontology classes
- Change persona runtime behavior
- Fix INVESTIGATION staleness
- Create Class C foundational slices
- Build drift detection infrastructure (Class E)
- Modify topology cognition overlays

---

## §14 — Recommended Next Streams

| Priority | Stream | Purpose |
|---|---|---|
| 1 | PI.INVESTIGATION.CONSEQUENCE-VERIFICATION-REVALIDATION.01 | Bring INVESTIGATION SW-INTEL consumption current with consequence compiler and slice ontology |
| 2 | PI.SOFTWARE-INTELLIGENCE.EVIDENCE-CHAIN-STRUCTURING.01 | Structured derivation traces to unblock FOUNDATIONAL promotion |
| 3 | PI.SOFTWARE-INTELLIGENCE.ADVANCED-SLICE-SPECIMENS.01 | First Class C foundational slice to close ontology gap |

---

## §15 — Closure Verdict

**PASS — ONTOLOGY CONSUMPTION MODEL ESTABLISHED**
