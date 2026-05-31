# Consumer Projection Boundary

**Stream:** PI.GOVERNED-EIR-IMPLEMENTATION-ROADMAP.01
**Classification:** G2 (Architecture Consuming)
**Date:** 2026-05-31

---

## 1. PURPOSE

This document defines the **consumer-generic cognition consumption architecture** — how Program Intelligence cognition is consumed by any consumer through a single governed architecture.

This is NOT "how the Executive Intelligence Report is generated."
This is: "How governed cognition reaches multiple consumers through a single architecture."

---

## 2. THE COGNITION CONSUMPTION ARCHITECTURE

```
L0-L3:  Evidence → Ingestion → Navigation → Synthesis → Consequence
                    ════════════════════════════════════════════════
                                    CIP (Compiled Intelligence Package)
                    ════════════════════════════════════════════════
                                         │
L4:                                      ▼
                              ┌─────────────────────┐
                              │   PICR (Cognition    │   9 materializers
                              │   Formation Runtime) │   Pure functions
                              │                      │   ZERO AI
                              └──────────┬──────────┘
                                         │
                              ┌─────────────────────┐
                              │   PICP (Cognition    │   9 cognition objects
                              │   Package)           │   Frozen, portable
                              │                      │   Diffable, versioned
                              └──────────┬──────────┘
                                         │
L5:                                      ▼
                              ┌─────────────────────┐
                              │   PRE (Projection    │   Consumer-generic
                              │   Rendering Engine)  │   3-zone architecture
                              │                      │   Parameterized by
                              │                      │   ProjectionConfig
                              └──────────┬──────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
            ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
            │ Consumer #1  │   │ Consumer #2  │   │ Consumer #3+ │
            │ EIR          │   │ LENS         │   │ Marketplace  │
            │ (first proof)│   │ (5 personas) │   │ (N consumers)│
            └──────────────┘   └──────────────┘   └──────────────┘
```

**The invariant:** CIP → PICR → PICP → PRE is defined ONCE. Every consumer receives cognition through the SAME architecture. What differs per consumer is ProjectionConfig and consumer-specific rendering adapters — never PRE core.

---

## 3. THE THREE-ZONE PRE MODEL (Consumer-Generic)

PRE operates through three zones. These zones are consumer-INDEPENDENT — every consumer passes through all three. The zones are constitutional, not implementation convenience.

### Zone A — Deterministic Projection

**Authority:** ZERO AI. Pure rendering rules.

**What it does:** Transforms cognition objects into consumer-ready structures. The transformation is deterministic — same PICP + same ProjectionConfig → same Zone A output.

**Per-consumer variation (via ProjectionConfig):**

| Consumer | Zone A Output |
|----------|---------------|
| EIR | Chapter → cognition object mapping. Finding template (4-part). Evidence citation assembly. Section inclusion rules. Multi-format rendering mechanics (PDF/HTML/PPTX). |
| BOARDROOM | Posture card layout. Consequence theme grouping. Executive cockpit instruments. Signal caption rendering. |
| BALANCED | Briefing corridor sections. Reinforcement flow panels. Ontology group cards. Operational pacing. |
| DENSE | Zone-navigated topology panels. Structural behavior interrogation surfaces. Full numeric precision. |
| OPERATOR | Evidence section tables. Governance lifecycle display. Signal audit at 4-decimal precision. Hash chain inspection. |
| INVESTIGATION | Verification sequence panels. Compilation chain step display. PASS/FAIL assertion rendering. |
| M&A Consumer | Transformation risk sections. Integration complexity maps. Domain coupling overlays. |
| Portfolio Consumer | Cross-program topology comparisons. Portfolio-level pressure aggregation. |

**What varies:** Which cognition objects are selected, how they are sequenced, what structural template they fill. This is ProjectionConfig — a data declaration, not code.

**What does NOT vary:** The mechanism by which PICP objects are read, validated, and handed to the rendering template. This is PRE core.

### Zone B — Governed Narrative

**Authority:** 75.x bounded interpretive authority. Disclosure-wrapped. Evidence-traceable. Subject to 13 absolute prohibitions.

**What it does:** Produces bounded interpretive projection for a specific consumer audience. Narrative is audience-specific but evidence-bound — every interpretive claim traces to a structural evidence source.

**Per-consumer variation (via audience model):**

| Consumer | Zone B Narrative Mode |
|----------|----------------------|
| EIR | Executive narrative: time projection, competitive differentiation, metaphor selection, narrative arc design, tone calibration. Full T6+T7 transformation. |
| BOARDROOM | Governed structural revelation: three-panel narrative, consequence posture synthesis, posture stability assessment. |
| BALANCED | Governed operational briefing: causal understanding narration, reinforcement relationship explanation, operational explanation. |
| DENSE | Structural behavior explanation: zone-specific structural queries, pattern characterization, topology-derived explanations. |
| OPERATOR | Minimal: governance lifecycle summary prose. Most OPERATOR content is Zone A (raw evidence display). |
| INVESTIGATION | None in current design. INVESTIGATION verifies — it does not narrate. |
| M&A Consumer | Transformation framing: integration risk characterization, dependency impact narration, structural compatibility assessment. |
| Portfolio Consumer | Portfolio framing: cross-program pattern characterization, structural posture comparison narration. |

**What varies:** The audience model (who is reading), the narrative register (executive vs operational vs structural vs forensic), the depth of interpretive projection.

**What does NOT vary:** The 75.x authorization boundary, the 13 absolute prohibitions, the disclosure wrapping requirement, the evidence traceability requirement. These are Zone B core — consumer-independent.

### Zone C — Qualification Gate

**Authority:** ZERO AI. Qualification enforcement. Non-automatable boundary.

**What it does:** Enforces what Zone B MAY project based on SQO qualification state. The authority ceiling is consumer-INDEPENDENT — the same SQO S-level applies to all consumers.

**Zone C is identical for ALL consumers:**

| Gate | Enforcement |
|------|-------------|
| SQO S-level → authority ceiling | S0: no projection. S1: structural only. S2: qualified with debt disclosure. S3: full authority. |
| 13 absolute prohibitions | No team behavior inference. No organizational intent. No human motive. No cultural diagnosis. No leadership assessment. No personnel attribution. No behavioral prediction. No organizational sentiment. No causal attribution to humans. No remediation prioritization. No "you should" language. No ranked next actions. No simulation of organizational psychology. |
| Governance wrapping | All projected output carries governance metadata: S-level, Q-class, authority ceiling, confidence envelope. |
| Authority ceiling enforcement | Zone B output is clamped by the authority ceiling. Projections that exceed the ceiling are suppressed, not merely flagged. |

**Nothing varies per consumer.** Zone C is the universal governance gate.

---

## 4. THE AI BOUNDARY

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   CIP (L0-L3)          ZERO AI.  Deterministic.                   ~55% │
│   ──────────────────────────────────────────────────────────────────     │
│   PICR (L4)             ZERO AI.  Pure function materializers.    ~19% │
│   ──────────────────────────────────────────────────────────────────     │
│   PICP (L4 output)      ZERO AI.  Container artifact.              0% │
│   ══════════════════════════════════════════════════════════════════     │
│   PRE Zone A (L5)       ZERO AI.  Rendering rules.                ~6% │
│   ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄     │
│   PRE Zone B (L5)       GOVERNED AI. 75.x bounded.               ~14% │
│   ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄     │
│   PRE Zone C (L5)       ZERO AI.  Qualification gate.              —  │
│   ──────────────────────────────────────────────────────────────────     │
│   CONSUMER              ZERO AI.  Receives projected cognition.    0% │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**The architectural principle:** AI does not participate in cognition formation. CIP and PICR are entirely deterministic. The intelligence is computed, not generated. Same input → same output. This is the moat.

AI participates ONLY in cognition projection — PRE Zone B. This is the single bounded region where governed AI operates. Everything outside Zone B is deterministic or qualification.

**~80% deterministic. ~14% governed AI. ~6% qualification gate.**

The system THINKS deterministically and COMMUNICATES with bounded AI assistance.

---

## 5. T1-T7 TRANSFORMATION TRACING

The EIR forensic analysis (PI.EXECUTIVE-INTELLIGENCE-REPORT-COMPILER.01) identified 7 transformation types. These trace to exact positions in the consumer-generic chain. The EIR is a specimen — the tracing is consumer-generic.

| Transformation | Description | Chain Position | Authority |
|---------------|-------------|----------------|-----------|
| T1 | Evidence extraction | CIP (L0-L1) | DETERMINISTIC |
| T2 | Arithmetic derivation | CIP (L2) | DETERMINISTIC |
| T3 | Pipeline synthesis | CIP (L3) | DETERMINISTIC |
| T4 | Cross-object correlation | PICR (L4) | DETERMINISTIC |
| T5 detect | Pattern detection | PICR (L4) | DETERMINISTIC |
| T5 name | Pattern characterization from pre-defined vocabulary | PICR (L4) | DETERMINISTIC |
| T6 | Audience narration | PRE Zone B (L5) | GOVERNED AI (75.x) |
| T7 | Consulting judgment: narrative arc, metaphor, time projection, tone | PRE Zone B (L5) | GOVERNED AI (75.x) |

**The reclassification:** The original EIR analysis attributed 25% to "consulting craft" (T6+T7). The Executive Cognition Runtime analysis (PI.EXECUTIVE-COGNITION-RUNTIME.01) discovered that 77% of that consulting craft was latent L4 cognition — cross-object correlation, absence analysis, risk stratification, convergence detection. These are deterministic (T4, T5). Only ~6% remains as genuine consulting craft (T7 narrative arc, metaphor, tone calibration).

**Consumer-generic implication:** T1-T5 are the same for ALL consumers. T6-T7 differ per consumer audience but operate under the same 75.x governance.

---

## 6. THE CONSUMER MODEL

### Reference Consumer #1 — Executive Intelligence Report (EIR)

**Why first:** Exercises all three PRE zones at maximum depth. T6+T7 narrative is the most demanding Zone B test. Multi-format output (PDF/HTML/PPTX) tests Zone A rendering mechanics. Full qualification gate test.

**ProjectionConfig parameters:**
- projection_type: `report`
- audience: `executive` (board/C-suite)
- format: `multi` (PDF + HTML + PPTX)
- rendering_overrides: chapter structure, finding templates, appendix rules

### Reference Consumer #2 — LENS (5 persona projections)

**Why second:** Proves consumer-genericity. If LENS requires zero PRE core changes (only ProjectionConfig + rendering adapters), the architecture is validated.

**5 sub-consumers, each with its own ProjectionConfig:**

| Persona | projection_type | audience | format |
|---------|----------------|----------|--------|
| BOARDROOM | `boardroom_briefing` | `executive` | `interactive_web` |
| BALANCED | `operational_briefing` | `senior_leadership` | `interactive_web` |
| DENSE | `structural_interrogation` | `technical_leadership` | `interactive_web` |
| OPERATOR | `evidence_inspection` | `engineering` | `interactive_web` |
| INVESTIGATION | `evidence_qualification` | `audit_compliance` | `interactive_web` |

**6 existing de facto consumers already function as proto-PRE:**
- `forBoardroom()` — ConsequenceCompiler.js:770
- `forBalanced()` — ConsequenceCompiler.js:977
- `forOperator()` — ConsequenceCompiler.js:1084
- `forInvestigation()` — ConsequenceCompiler.js:1113
- `IntelligenceField.jsx` — pressure zone glyph rendering
- `StructuralTopologyZone.jsx` — interactive topology rendering

### Reference Consumer #3+ — Marketplace

**Why third:** Validates the two-axis marketplace model. Domain Cognition Modules produce domain-specific CIP extensions. Projection Families consume the same PICP through the same PRE.

**Marketplace model:**
```
Axis 1: Domain Cognition Modules          Axis 2: Projection Families
  ├── Software Intelligence                 ├── Report (EIR)
  ├── M&A Intelligence (future)             ├── Boardroom Briefing
  ├── Portfolio Intelligence (future)       ├── Advisory Memo
  ├── Legal Intelligence (future)           ├── M&A Assessment
  └── Healthcare Intelligence (future)      ├── Transformation Review
                                            ├── Portfolio Review
                                            ├── Executive Workshop
                                            └── Investment Review
```

Each module × family combination requires: ONE ProjectionConfig + ONE consumer-specific rendering adapter. NOT a new PRE.

---

## 7. THE MARKETPLACE-PROTECTION INVARIANT

> **PRE core must not change when adding a new consumer.**
>
> **Only ProjectionConfig and consumer-specific rendering adapters may change.**

This is the strongest marketplace-protection test. If it fails, the architecture is consumer-specific and the marketplace model collapses.

### What constitutes "PRE core":

- Zone A orchestration logic (PICP → rendering template dispatch)
- Zone B governance boundary (75.x authorization, disclosure wrapping, evidence traceability)
- Zone C qualification gate (SQO authority ceiling, 13 prohibitions, governance wrapping)
- PICP reading and validation
- ProjectionConfig schema and dispatch

### What constitutes "consumer-specific":

- ProjectionConfig instance (data declaration)
- Rendering adapter (how Zone A output becomes the final format — HTML template, PDF layout, interactive component)
- Audience model for Zone B (narrative register, interpretive depth)
- Format-specific rendering mechanics (PDF generation, PPTX assembly, interactive web rendering)

### Verification test:

To add M&A Consumer (Reference Consumer #3):
1. Create `ProjectionConfig.MA_ASSESSMENT` — which cognition objects, what sequence, what template
2. Create `MaAssessmentAdapter` — transformation risk sections, integration complexity display
3. Configure Zone B audience model — transformation framing narrative register
4. Deploy. PRE core unchanged.

If step 4 requires modifying PRE's zone boundaries, orchestration logic, or qualification gate — consumer-genericity has failed.

---

## 8. EXISTING ARCHITECTURE SURFACE

The consumer-generic architecture is NOT aspirational. It is partially instantiated:

| Architectural Concept | Current Implementation | Status |
|----------------------|----------------------|--------|
| CIP assembly | `resolveSemanticPayload()` → `fullReport` (~180 fields) | OPERATIONAL |
| Proto-PICR | `forBoardroom()`, `forBalanced()` — select and structure from fullReport | OPERATIONAL (implicit, not formalized) |
| Proto-PICP | Ad-hoc field selection from fullReport per persona | OPERATIONAL (implicit, not formalized) |
| Proto-PRE Zone A | Persona zone rendering in LENS v2 | OPERATIONAL |
| Proto-PRE Zone B | `composeGoverningNarrative()`, `deterministicBoundedProvider()` | OPERATIONAL |
| Proto-PRE Zone C | SQO S-level gating, 75.x authorization | OPERATIONAL |
| Consumer #2a-e | BOARDROOM, BALANCED, DENSE, OPERATOR, INVESTIGATION | OPERATIONAL |
| Consumer rendering adapters | Zone components in LENS v2 persona modes | OPERATIONAL |

**What formalization adds:** Explicit PICP container (portable, diffable, versioned), explicit materializers (named, qualified, individually testable), explicit PRE boundaries (Zone A/B/C as code), explicit ProjectionConfig (declarative consumer parameterization).

**What formalization does NOT add:** New computation, new data sources, new signal families. The consumption baseline map (PI.PICP-CONSUMPTION-BASELINE-MAP.01) proved: 8/9 cognition objects already have source data in LENS.

---

## 9. SPINE AND CHRONICLE IN THE CONSUMPTION ARCHITECTURE

### Operational Position

```
Spine ──┐
        ├──→ CIP ──→ PICR ──→ PICP ──→ PRE ──→ Consumer
Chronicle┘
```

- **Spine** feeds CIP through temporal continuity data: `executive_projection_snapshots`, `semantic_propositions`, and future spine object classes contribute to the compiled intelligence that PICR materializes.
- **Chronicle** feeds CIP through governance certification state: `structural_posture` qualification draws on Chronicle's governed replay certification (62/62 CERTIFIED on BlueEdge).

### Architectural Role (Constitutional — NOT Reducible to Data Feeds)

| Concept | Architectural Role | Why It Cannot Be Collapsed |
|---------|-------------------|---------------------------|
| **Spine** | Continuity mechanism — what allows cognition to survive evolution, replay, reuse, and cross-run accumulation | Without Spine, PICP is a single-run snapshot with no temporal dimension. Spine enables run-over-run comparison, temporal PICP diffing, and cross-run cognition accumulation. |
| **Chronicle** | Governed replay mechanism — what allows cognition to be explained, certified, and trusted through time | Without Chronicle, Zone C has no certification evidence. The qualification gate requires proof that the cognition chain is certified, not merely computed. |
| **DNA** | Propagation / inheritance logic — how execution structure carries cognitive consequences forward | Deferred in current implementation. Architectural role preserved: DNA defines how consequences propagate across structural boundaries. |
| **Neuron** | Cognitive primitive — candidate unit from which Cognition Objects may be composed or recognized | Deferred in current implementation. Architectural role preserved: Neuron is the candidate primitive decomposition of cognition objects. |

**Current implementation state is NOT architectural definition.** Spine has 1/8 object classes populated (semantic_propositions). This is implementation state, not Spine's architectural role. The roadmap must not define Spine by what happens to be populated on BlueEdge.

---

## 10. VERDICT

The cognition consumption architecture is consumer-generic by design:

1. **CIP → PICR → PICP** is defined once, produces the same cognition package regardless of downstream consumer.
2. **PRE** is a three-zone engine parameterized by ProjectionConfig — not a consumer-specific pipeline.
3. **The marketplace-protection invariant holds:** adding a new consumer requires only ProjectionConfig + rendering adapter, never PRE core modification.
4. **The EIR is Reference Consumer #1** — the first proof that the architecture works, not the destination.
5. **LENS is Reference Consumer #2** — the architecture validation test. If LENS requires zero PRE core changes, consumer-genericity is proven.
6. **Marketplace consumers are Reference Consumer #3+** — the commercial consequence of consumer-genericity.

The Executive Intelligence Report lineage is fully reconciled into the consumer-generic architecture. The EIR forensic analysis (T1-T7) provided the specimen data for the AI boundary. The boundary itself is consumer-generic.
