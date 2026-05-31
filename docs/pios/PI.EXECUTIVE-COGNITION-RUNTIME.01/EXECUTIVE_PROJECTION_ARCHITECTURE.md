# Executive Projection Architecture

**Stream:** PI.EXECUTIVE-COGNITION-RUNTIME.01
**Classification:** G1 (Architecture Defining)
**Date:** May 2026

---

## 1. Projection Principle

A projection is a rendering of the Executive Cognition Package (ECP) into a format suited for a specific audience, engagement context, and delivery channel. One ECP produces many projections. Every projection traces to the same cognition. No projection may introduce cognition not present in the ECP.

```
ECP (invariant)
 ├── REPORT projection
 ├── BOARDROOM BRIEFING projection
 ├── ADVISORY MEMO projection
 ├── M&A ASSESSMENT projection
 ├── TRANSFORMATION REVIEW projection
 ├── PORTFOLIO REVIEW projection
 ├── EXECUTIVE WORKSHOP projection
 └── INVESTMENT REVIEW projection
```

The projection layer is L5. It operates under 75.x bounded interpretive authority for narrative phrasing. The 13 absolute prohibitions apply here.

---

## 2. Invariant vs. Variant

### 2.1 Invariant Across All Projections (from ECP)

| Element | Source Object | Why Invariant |
|---|---|---|
| Structural scale (nodes, files, imports) | structural_posture.scale | Measurement — cannot vary by audience |
| Qualification state (S-level, scores) | structural_posture.qualification | Governance fact — cannot be softened or emphasized |
| Convergence center count and composition | tension_map.convergence_centers | Structural finding — same for all audiences |
| Behavioral class activation profile | tension_map.behavioral_class_activation | Classification — deterministic from conditions |
| Constraint types and evidence values | constraint_inventory | Measurement — evidence-bound |
| Trajectory direction per pattern | trajectory_assessment | Structural property — not audience-dependent |
| Leverage points and evidence citations | decision_surface.leverage_points | Evidence-bound interventions |
| Absence classifications | absence_profile | Set comparison result |
| Detectability assessments | competitive_intelligence | Method property |
| Operational ceiling existence and drivers | operational_ceiling | Structural conclusion |

### 2.2 Variant Across Projections (L5 rendering decisions)

| Element | What Varies | Example |
|---|---|---|
| Depth | How many layers of evidence exposed | Report: full finding details. Memo: headline only. |
| Vocabulary | Technical vs. executive language | Report: "execution constriction." Memo: "delivery bottleneck." |
| Structure | How content is organized | Report: 10 chapters. Slides: 12 slides. Workshop: 6 exercises. |
| Emphasis | What leads, what follows | M&A: risk landscape leads. Advisory: recommendations lead. |
| Tone | Formality and posture | Report: analytical. Advisory: advisory. Workshop: interactive. |
| Visual assets | Topology views, charts, diagrams | Slides: full visual. Memo: none. |
| Compression | How much of ECP is rendered | Report: all 9 objects. Memo: 3 objects. |
| Interactivity | Static vs. guided | Report: static document. Workshop: facilitated exploration. |

---

## 3. Projection Family Specifications

### 3.1 REPORT

**Audience:** CEO, CTO, Board, Technical Leadership
**Engagement context:** Initial assessment, periodic review
**Delivery channel:** PDF or governed document
**Precedent:** BlueEdge Executive Intelligence Report

| ECP Object | Rendered | How |
|---|---|---|
| structural_posture | YES | Chapter 2: Program Overview — full scale table, architecture profile |
| tension_map | YES | Chapter 1: Executive Brief (headline), Chapter 4.7: Compound Convergence (detail), Chapter 5: Class Assessment |
| constraint_inventory | YES | Chapter 3: Structural Execution Story, Chapter 4.1–4.6: Per-finding detail |
| exposure_assessment | YES | Chapter 3: Where Resilience Weakens, Chapter 6: Localized Risk |
| trajectory_assessment | YES | Chapter 6: Systemic/Emergent Risk, Chapter 9: Strategic timeframe rationale |
| decision_surface | YES | Chapter 9: Strategic Recommendations — full leverage point detail |
| absence_profile | YES | Chapter 5: What Did Not Activate |
| competitive_intelligence | YES | Chapter 8: Traditional Differentiators |
| operational_ceiling | YES | Chapter 1: Executive Conclusion, Chapter 10: Final Verdict |

**Compression:** FULL — all 9 objects rendered across ~10 chapters
**75.x budget:** HIGH — finding narratives, executive synthesis, verdict phrasing
**Rendering artifacts:** 4-part finding template, progressive revelation arc, multi-audience vocabulary (CEO in Ch 1, CTO in Ch 7)

---

### 3.2 BOARDROOM BRIEFING

**Audience:** Board of Directors, C-Suite
**Engagement context:** 25-minute board presentation
**Delivery channel:** Slide deck + speaking notes
**Precedent:** BlueEdge Presentation Narrative Outline

| ECP Object | Rendered | How |
|---|---|---|
| structural_posture | COMPRESSED | 1 slide: scale headline + qualification badge |
| tension_map | YES | 2 slides: one per convergence center with visual |
| constraint_inventory | COMPRESSED | 1 slide: headline constraints with "why it matters" |
| exposure_assessment | HIDDEN | Not rendered — too detailed for board |
| trajectory_assessment | COMPRESSED | 1 slide: "without intervention, worsens" |
| decision_surface | COMPRESSED | 1 slide: 3 recommendations by timeframe |
| absence_profile | HIDDEN | Not rendered — negative evidence not board-appropriate |
| competitive_intelligence | COMPRESSED | 1 slide: "what would be hard to find traditionally" |
| operational_ceiling | YES | Opening slide + closing slide: headline verdict |

**Compression:** AGGRESSIVE — 5 of 9 objects rendered, 2 hidden, 2 compressed
**75.x budget:** MEDIUM — speaking notes, slide titles
**Rendering artifacts:** Slide structure (title/content/visual), speaking notes, visual callouts

**Key insight:** BOARDROOM BRIEFING hides exposure_assessment and absence_profile. These are important cognition but inappropriate for a 25-minute board slot. The ECP still contains them — they are available if a board member asks a follow-up question.

---

### 3.3 ADVISORY MEMO

**Audience:** CEO or CTO (direct, 1:1)
**Engagement context:** Advisory relationship, ongoing engagement
**Delivery channel:** 2-page memo or email
**Precedent:** No prior exemplar

| ECP Object | Rendered | How |
|---|---|---|
| structural_posture | 1 SENTENCE | "BlueEdge: 944-node TypeScript program, S2 Governed" |
| tension_map | YES | Lead section: "Two structural gravity centers dominate execution" |
| constraint_inventory | COMPRESSED | Top 3 constraints by severity |
| exposure_assessment | HIDDEN | Too detailed for memo format |
| trajectory_assessment | 1 LINE | "Platform Infrastructure concentration worsening" |
| decision_surface | YES | Core of memo: "What to consider" — leverage points by urgency |
| absence_profile | HIDDEN | Not memo-appropriate |
| competitive_intelligence | HIDDEN | Not relevant in ongoing advisory |
| operational_ceiling | 1 PARAGRAPH | Closing: structural ceiling statement |

**Compression:** SEVERE — 3 objects rendered in full, 3 reduced to single lines, 3 hidden
**75.x budget:** HIGH — advisory framing, action-oriented language
**Rendering artifacts:** Direct address tone, recommendation-forward structure, no methodology explanation

**Key insight:** ADVISORY MEMO inverts the REPORT structure — recommendations lead, evidence follows. The ECP is the same; the rendering sequence is reversed.

---

### 3.4 M&A ASSESSMENT

**Audience:** Investment committee, acquiring company CTO, PE due diligence team
**Engagement context:** Pre-acquisition technical due diligence
**Delivery channel:** Formal assessment report (longer than standard report)
**Precedent:** No prior exemplar

| ECP Object | Rendered | How |
|---|---|---|
| structural_posture | EXPANDED | Full technical profile with architecture characterization |
| tension_map | EXPANDED | Risk-weighted convergence analysis with severity quantification |
| constraint_inventory | EXPANDED | Every constraint with full evidence chain — no compression |
| exposure_assessment | YES | Critical in M&A — full vulnerability surface inventory |
| trajectory_assessment | EXPANDED | Investment-relevant: "what worsens post-acquisition if unaddressed" |
| decision_surface | REFRAMED | "Remediation investment required" — cost/effort framing |
| absence_profile | YES | "What we cannot assess" — epistemic honesty for diligence |
| competitive_intelligence | REFRAMED | "What traditional due diligence missed" — buyer-relevant framing |
| operational_ceiling | EXPANDED | "Integration risk" framing — ceiling as post-merger execution constraint |

**Compression:** EXPANDED — all 9 objects rendered at maximum detail; some expanded beyond standard report depth
**75.x budget:** HIGH — investment-relevant framing, risk quantification language
**Rendering artifacts:** Investment-oriented vocabulary (remediation cost, integration risk, post-acquisition trajectory), expanded evidence chains, no methodology hiding

**Key insight:** M&A ASSESSMENT renders EVERYTHING — including objects hidden in other projections. In due diligence, absence_profile is critical ("what can't we measure"). Exposure_assessment is the central concern. Decision_surface becomes remediation cost estimation.

---

### 3.5 TRANSFORMATION REVIEW

**Audience:** Transformation lead, program architect, VP Engineering
**Engagement context:** Pre-transformation or mid-transformation assessment
**Delivery channel:** Working document (not formal report)
**Precedent:** No prior exemplar

| ECP Object | Rendered | How |
|---|---|---|
| structural_posture | COMPRESSED | Baseline reference for transformation scope |
| tension_map | YES | "Where structural pressure is highest" — transformation prioritization |
| constraint_inventory | EXPANDED | Full constraint inventory — transformation targets |
| exposure_assessment | YES | Vulnerability map for transformation planning |
| trajectory_assessment | REFRAMED | "What happens if transformation doesn't address X" — consequence framing |
| decision_surface | REFRAMED | "Transformation work packages" — leverage points as work items |
| absence_profile | COMPRESSED | "Measurement gaps to close during transformation" |
| competitive_intelligence | HIDDEN | Not relevant during transformation execution |
| operational_ceiling | REFRAMED | "Current ceiling → target ceiling" — before/after framing |

**Compression:** MODERATE — all objects rendered but competitive_intelligence hidden
**75.x budget:** MEDIUM — operational/technical language, work-package framing
**Rendering artifacts:** Work-package structure, before/after framing, transformation-specific vocabulary

---

### 3.6 PORTFOLIO REVIEW

**Audience:** CTO, VP Engineering, Portfolio manager across multiple programs
**Engagement context:** Cross-program structural comparison
**Delivery channel:** Dashboard or comparative summary
**Precedent:** No prior exemplar (requires 2+ ECPs)

| ECP Object | Rendered | How |
|---|---|---|
| structural_posture | COMPARATIVE | Side-by-side scale and qualification across programs |
| tension_map | COMPARATIVE | Convergence center count and severity across programs |
| constraint_inventory | COMPRESSED | Top constraints per program, comparative severity |
| exposure_assessment | COMPRESSED | Headline exposure per program |
| trajectory_assessment | COMPARATIVE | Which programs are worsening, stable, improving |
| decision_surface | PRIORITIZED | Cross-program intervention prioritization by impact × effort |
| absence_profile | HIDDEN | Per-program detail not useful in portfolio view |
| competitive_intelligence | HIDDEN | Not relevant at portfolio level |
| operational_ceiling | COMPARATIVE | Ceiling severity comparison across programs |

**Compression:** COMPRESSED — headline objects only, emphasis on cross-program comparison
**75.x budget:** LOW — mostly tabular comparison
**Rendering artifacts:** Comparison tables, cross-program severity heatmap, portfolio health dashboard

**Key insight:** PORTFOLIO REVIEW requires MULTIPLE ECPs. It is the first projection that operates across specimens rather than within one. The ECP's structured, diffable format makes cross-program comparison mechanical.

---

### 3.7 EXECUTIVE WORKSHOP

**Audience:** Leadership team (5–15 people)
**Engagement context:** Facilitated 2-hour session exploring structural findings
**Delivery channel:** Guided interactive session with prepared materials
**Precedent:** No prior exemplar

| ECP Object | Rendered | How |
|---|---|---|
| structural_posture | PRESENTED | Opening context: "This is your program" |
| tension_map | INTERACTIVE | "Explore: where do these tensions match your experience?" |
| constraint_inventory | INTERACTIVE | "Exercise: map these constraints to recent delivery friction" |
| exposure_assessment | DISCUSSED | "Discussion: are these exposure areas known to your teams?" |
| trajectory_assessment | INTERACTIVE | "Exercise: what happens in 6 months without intervention?" |
| decision_surface | PRIORITIZED | "Workshop output: team-prioritized intervention plan" |
| absence_profile | DISCUSSED | "Discussion: what else should we measure?" |
| competitive_intelligence | HIDDEN | Not workshop-appropriate |
| operational_ceiling | CLOSING | "Summary: your structural execution reality" |

**Compression:** INTERACTIVE — all objects rendered but as discussion prompts and exercises rather than findings
**75.x budget:** HIGH — facilitation language, question framing
**Rendering artifacts:** Exercise templates, discussion guides, prioritization matrix, participant handout

**Key insight:** EXECUTIVE WORKSHOP is the only projection where the ECP drives INTERACTION rather than consumption. The cognition objects become conversation triggers. The output of the workshop is a team-generated intervention plan seeded by the decision_surface.

---

### 3.8 INVESTMENT REVIEW

**Audience:** Investors, PE partners, fund managers
**Engagement context:** Technical risk assessment for investment decision
**Delivery channel:** Investor memo (3–5 pages)
**Precedent:** No prior exemplar

| ECP Object | Rendered | How |
|---|---|---|
| structural_posture | COMPRESSED | Technology and scale summary — investor-calibrated |
| tension_map | REFRAMED | "Technical risk concentration" — investment risk language |
| constraint_inventory | REFRAMED | "Execution velocity constraints" — growth-limiting factors |
| exposure_assessment | COMPRESSED | Headline vulnerabilities only |
| trajectory_assessment | REFRAMED | "Technical debt trajectory" — although structurally incorrect, investors understand this term |
| decision_surface | REFRAMED | "Remediation investment estimate" — cost-of-fix framing |
| absence_profile | COMPRESSED | "Assessment limitations" — epistemic boundary statement |
| competitive_intelligence | REFRAMED | "Assessment methodology advantage" — why this diligence is better |
| operational_ceiling | REFRAMED | "Scalability constraint" — investor-relevant ceiling framing |

**Compression:** MODERATE — all objects rendered but in investor vocabulary
**75.x budget:** HIGH — investment-specific vocabulary, risk quantification
**Rendering artifacts:** Investor memo format, risk scoring, remediation cost estimation, scalability assessment

**Key insight:** INVESTMENT REVIEW is the only projection that TRANSLATES structural terminology into financial/investment vocabulary. "Compound convergence" becomes "concentrated technical risk." "Structural gravity well" becomes "technical debt concentration with self-reinforcing dynamics." The cognition is identical; the vocabulary is domain-specific.

---

## 4. Projection Invariant Table

What is ALWAYS rendered, regardless of projection:

| Element | Why Invariant |
|---|---|
| Specimen identity (name, scale headline) | Context — reader must know what program is assessed |
| Qualification state (S-level) | Provenance — evidence quality indicator |
| Convergence center count | Headline finding — always the lead |
| Operational ceiling existence | Core conclusion — the "so what" |
| Evidence-bound disclaimer | Governance — method signature |

What is ALWAYS hidden:

| Element | Why Hidden |
|---|---|
| Pipeline internals (enrichment surface names, condition type IDs) | Implementation detail — not audience-relevant |
| Signal family technical details (z-scores, activation thresholds) | Technical methodology — belongs in evidence appendix only |
| Derivation log | Governance artifact — not audience-facing |

Everything else varies by projection.

---

## 5. The Projection Rendering Engine

The Projection Rendering Engine (PRE) is the L5 component that transforms an ECP into a specific projection. It is parameterized by:

```
ProjectionConfig: {
  projection_type: string,        // REPORT | BOARDROOM_BRIEFING | ADVISORY_MEMO | ...
  audience: {
    primary: string,              // CEO | CTO | Board | Investor | Transformation Lead
    technical_depth: string,      // EXECUTIVE | TECHNICAL | MIXED
  },
  format: {
    structure: string,            // CHAPTERS | SLIDES | MEMO | DASHBOARD | WORKSHOP
    compression: string,          // FULL | MODERATE | AGGRESSIVE | SEVERE
  },
  rendering_overrides: {
    objects_to_hide: string[],    // ECP objects to suppress
    objects_to_expand: string[],  // ECP objects to expand beyond default depth
    vocabulary_domain: string,    // STRUCTURAL | INVESTMENT | TRANSFORMATION | OPERATIONAL
    tone: string,                 // ANALYTICAL | ADVISORY | FACILITATIVE
  },
}
```

The PRE consumes (ECP, ProjectionConfig) and produces a rendered deliverable. It operates under 75.x bounded interpretive authority for narrative phrasing. All 13 prohibitions apply.

The PRE is the ONLY component that:
- Selects metaphors
- Calibrates tone
- Chooses narrative sequence
- Applies audience vocabulary
- Compresses cognition for format

The ECR (L4) does none of these. The separation is clean.

---

## 6. Architectural Summary

```
L0–L3: Program Intelligence Pipeline
         (deterministic structural intelligence)
              ↓
L4: Executive Cognition Runtime
         (structured cognition objects — ECP)
         (ZERO interpretive authority)
         (deterministic, replayable, diffable)
              ↓
L5: Projection Rendering Engine
         (audience-specific rendering — deliverables)
         (75.x bounded interpretive authority)
         (format-specific, audience-specific, tone-calibrated)
              ↓
Surface: Report | Briefing | Memo | Assessment | Review | Workshop | Dashboard
```

One pipeline. One cognition package. Many surfaces.

The cognition is the product. The surfaces are the medium.
