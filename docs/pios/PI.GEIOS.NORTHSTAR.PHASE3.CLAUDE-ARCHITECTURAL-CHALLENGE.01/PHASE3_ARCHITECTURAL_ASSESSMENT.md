# Phase 3 Architectural Assessment

**Stream:** PI.GEIOS.NORTHSTAR.PHASE3.CLAUDE-ARCHITECTURAL-CHALLENGE.01
**Classification:** G2 — Assessment
**Date:** 2026-05-13

---

## 1. Executive Verdict on the Current Phase 3 Framing

**Verdict: The framing is directionally correct but architecturally dangerous in its current form.**

"Designing a cognitive operating environment for governed operational intelligence" correctly identifies the real problem: Phase 2 built the semantic substrate, and Phase 3 must make it navigable by humans with different operational concerns. The framing correctly rejects "build a workspace" as insufficient.

However, the framing has three critical problems:

**Problem 1: It is not a product specification.** The list of concerns (cognitive pacing, disclosure hierarchy, narrative gravity, escalation choreography, executive calm under complexity) reads as a research agenda, not a product architecture. None of these terms have operational definitions, implementation boundaries, or acceptance criteria. A team cannot ship "narrative gravity."

**Problem 2: It invents vocabulary without operational grounding.** Terms like "cognitive pacing," "narrative gravity," "trust pacing," "semantic compression," and "escalation choreography" do not appear in the locked terminology, do not map to existing architectural primitives, and have no deterministic implementation. They risk becoming aspirational labels that defer the hard decisions about what the product actually does.

**Problem 3: It conflates interface design with architecture.** Many items on the list (cognitive pacing, disclosure hierarchy, investigation ergonomics, temporal cognition, guided exploration) are interaction design problems, not architectural ones. Architecture should define the boundaries, data flow, and authority model. Interaction design should determine how those are presented. Conflating them creates a framing where every CSS decision is treated as an architectural concern.

**Summary:** Keep the strategic insight (the problem is navigability, not missing semantics). Discard the vocabulary layer. Replace it with concrete product architecture.

---

## 2. Valid Architectural Insights in the Current Framing

The following insights from the framing are correct and should be preserved:

**2.1 The problem is no longer missing data — it is operational focus.**
Phase 2 converged 8 ownership domains, 23 artifacts, 14 cockpit sections, 12 lifecycle states, 4 density modes, and 10 report sections. The system has more operational surface area than any single user needs at any moment. This is a real product problem.

**2.2 SQO-centric collapse is a real risk.**
SQO Cockpit currently has 14 sections. LENS v2 has 6 rendering zones (Declaration, Trust Posture, Reconciliation Awareness, Intelligence Field, Structural Topology, Evidence Depth). The SQO surface area (14 sections) already exceeds the LENS surface area (6 zones). Without architectural guardrails, Phase 3 work will default to "add another SQO Cockpit section" because it is the easiest extension point.

**2.3 Operator/executive collapse is the deeper risk.**
LENS v2 and SQO Cockpit currently share the same navigation tree (`/sqo/client/[client]/run/[run]/...`). There is no architectural separation between "executive reads the intelligence" and "operator manages the qualification machine." Both audiences enter through the same URL pattern. This is not a cosmetic problem — it means executive-facing surfaces inherit operator-level complexity.

**2.4 The density model is an underexploited asset.**
The existing density system (BALANCED → DENSE → INVESTIGATION + BOARDROOM) already embodies the right instinct: different users need different projections of the same underlying truth. But the current implementation treats density as a CSS toggle, not an architectural boundary. All zones render for all modes, with conditional visibility. This should become an architectural primitive.

---

## 3. Architectural Overreach and Abstraction Critique

**3.1 "Cognitive Operating Environment" is not an architecture.**
It is an aspiration. An architecture specifies components, boundaries, data flow, authority, and failure modes. "Cognitive operating environment" specifies none of these. It is a category label that sounds like a product but does not constrain implementation.

**3.2 The 12-item concern list is a trap.**
"Cognitive pacing, disclosure hierarchy, narrative gravity, operational focus management, investigation ergonomics, temporal cognition, guided exploration, consequence framing, trust pacing, semantic compression, escalation choreography, executive calm under complexity" — this is 12 items, none of which have acceptance criteria. If Phase 3 attempts to address all 12, it will produce 12 half-implemented concepts and no shippable product. Phase 2 succeeded because it was concrete: build the substrate, build the projection, build the binding. Phase 3 needs the same concreteness.

**3.3 The framing encourages scope explosion.**
Every concern on the list can be interpreted as a multi-stream effort. "Temporal cognition" alone could justify a half-dozen streams. "Escalation choreography" could mean anything from a notification system to a real-time alerting pipeline. Without hard scope boundaries, the framing licenses infinite work.

**3.4 Several concerns are already partially solved.**
"Disclosure hierarchy" — executive disclosure doctrine is implemented. "Trust pacing" — the trust posture zone exists. "Consequence framing" — the BALANCED density mode is explicitly "CEO · consequence-first read." "Investigation ergonomics" — INVESTIGATION_DENSE mode exists. The framing treats these as unsolved problems when they are partially solved but unevenly integrated.

**3.5 The framing skips the hard architectural question.**
The hard question is: **What is the navigation model?** The current system has exactly one navigational entry point pattern (`/sqo/client/[client]/run/[run]/...`) that serves both executive and operator audiences. Phase 3 cannot solve "cognitive operating environment" without first solving "where does each audience type enter, what do they see, and what can they reach?"

---

## 4. Practical Phase 3 Product Definition

Phase 3 should be defined as:

**PHASE 3: Audience-separated workspace architecture with governed navigation and progressive disclosure.**

This means three concrete things:

### 4.1 Audience Separation

The system currently has three implicit audiences (executive, operator, analyst/investigator) served by two surfaces (LENS v2 + SQO Cockpit) with no formal boundary between them. Phase 3 must make this separation architectural:

| Audience | Primary Surface | Data Authority | Navigation Scope |
|----------|----------------|----------------|-----------------|
| Executive | LENS v2 | Substrate projections + report binding | Declaration → Trust → Reconciliation → Intelligence → Topology |
| Operator | SQO Cockpit | Cockpit artifacts + loop state | Full 14-section workspace |
| Investigator | Evidence surfaces | Evidence blocks + rebase data | Evidence trace → Admissibility → Domain drill-down |

### 4.2 Navigation Doctrine

Formalize what is currently implicit:

- **LENS v2 is an entry surface, not a workspace.** Executives land here. They should be able to read consequence, posture, and disclosure without navigating.
- **SQO Cockpit is an operational workspace.** Operators who need to manage qualification state navigate here intentionally. It should never be the default entry point for executives.
- **Investigation is a depth layer, not a peer surface.** Investigation mode should be accessible from LENS v2 as a drill-down, not as a separate top-level navigation target.

### 4.3 Progressive Disclosure

The current system renders all zones for all modes and hides with CSS. Phase 3 should make disclosure progressive and audience-gated:

- **Level 0 (Declaration):** S-state, render state, qualifier. Always visible. One line.
- **Level 1 (Posture):** Trust posture, reconciliation posture, debt summary. Executive default.
- **Level 2 (Intelligence):** Domain intelligence, propagation, topology. Requires explicit expansion.
- **Level 3 (Evidence):** Raw evidence blocks, trace, confidence. Investigation mode only.
- **Level 4 (Operational):** Loop state, rerun chains, phase assessment. Operator mode only.

---

## 5. Executive / Operator / Investigation Operating Model

### 5.1 Executive Operating Mode

**Purpose:** Read the intelligence. Understand consequence. Trust the qualification. Act on disclosure.

**What is visible:**
- S-state + Q-class declaration (always)
- Trust posture badge with qualification summary
- Executive disclosure (always — governance requirement)
- Consequence narrative (BALANCED density)
- Reconciliation posture summary (high-level)
- Debt summary (count + blocking status only)

**What is NOT visible:**
- Individual debt items
- Phase-by-phase reconciliation loop status
- Rerun chain recommendations
- Evidence block raw data
- SQO Cockpit sections

**Navigation model:**
- Single-page. No sidebar. No section navigation.
- Vertical scroll with progressive reveal.
- One escape hatch: "View operational detail" → SQO Cockpit.
- One depth path: "Investigate evidence" → Investigation mode.

**AI mediation:** None. Executive mode is pre-computed projection only.

### 5.2 Operator Operating Mode

**Purpose:** Manage the qualification state machine. Execute improvement cycles. Resolve debt. Advance S-state.

**What is visible:**
- Full SQO Cockpit workspace (14 sections)
- Reconciliation loop operator workflow
- Phase assessment with action guidance
- Rerun chain recommendations
- Debt items with blocking status
- Evidence intake status
- Progression readiness with gate status

**What is NOT visible:**
- Executive-oriented narrative (consequence framing, boardroom projection)
- Density mode selector (operator mode is always dense)
- Report-pack artifacts

**Navigation model:**
- Sidebar workspace navigation (existing SQO Cockpit pattern)
- Section-based with route-driven state
- Direct URL access to any section

**AI mediation:** None in Phase 3. Operator mode is deterministic artifact consumption.

### 5.3 Investigation Operating Mode

**Purpose:** Trace evidence. Verify claims. Audit confidence. Drill into domains.

**What is visible:**
- Evidence blocks with full trace data
- Domain drill-down with grounding status per domain
- Confidence scores and evidence lineage
- Structural topology with propagation chains
- Semantic candidates and CEU admissibility
- Evidence rebase corridor

**What is NOT visible:**
- Executive narrative
- Operator action guidance
- Reconciliation loop lifecycle
- Debt reduction recommendations

**Navigation model:**
- Entered from LENS v2 via "Investigate" action on any domain or evidence block
- Context-preserving: remembers which domain/block triggered investigation
- Breadcrumb back to LENS v2

**AI mediation:** None in Phase 3. Investigation mode consumes pre-computed evidence and structural data.

---

## 6. Workspace Architecture Guidelines

### 6.1 Surface Hierarchy

```
LENS v2 (Executive Entry Surface)
  ├── Declaration Zone (always visible)
  ├── Posture Summary (executive default)
  ├── Intelligence Field (expandable)
  ├── Disclosure Zone (governance-mandated)
  │
  ├── [Investigate] → Investigation Depth Layer
  │     ├── Evidence Trace
  │     ├── Domain Drill-Down
  │     └── Structural Audit
  │
  └── [Operational Detail] → SQO Cockpit (Operator Workspace)
        ├── Overview
        ├── Qualification sections (debt, maturity, progression, etc.)
        ├── Reconciliation sections (reconciliation, loop, evidence)
        └── Corridor sections (corridor, handoff)
```

### 6.2 Data Flow Boundaries

- **LENS v2 reads substrate projections only.** It does not load cockpit artifacts directly. This boundary exists and must be preserved.
- **SQO Cockpit reads cockpit artifacts only.** It does not access LENS projections. This boundary exists and must be preserved.
- **Investigation mode reads evidence blocks and structural data.** It accesses payload evidence_blocks and rebase data.
- **No surface computes.** All surfaces render pre-compiled projections. This is non-negotiable.

### 6.3 State Isolation

Each operating mode should have independent state:
- **Executive:** density mode + boardroom toggle (existing)
- **Operator:** active cockpit section (existing)
- **Investigation:** active domain + active evidence block (new)

Mode transitions should not destroy state. Switching from Executive to Operator and back should preserve Executive's density selection.

### 6.4 URL Architecture

Current: `/sqo/client/[client]/run/[run]/[section]` — unified, but conflates audiences.

Recommended Phase 3:
```
/lens/[client]/[run]                          → Executive surface (LENS v2)
/lens/[client]/[run]/investigate/[domain]     → Investigation depth
/sqo/[client]/[run]                           → Operator workspace (SQO Cockpit)
/sqo/[client]/[run]/[section]                 → Operator section (existing)
```

This is a URL reorganization, not a new architectural layer. Both surfaces consume the same underlying server-side binding. The URL change makes audience separation navigational, not just visual.

---

## 7. Product Risk Assessment

### 7.1 HIGH RISK: Vocabulary-driven scope explosion

**Risk:** Phase 3 adopts the "cognitive operating environment" vocabulary and creates streams for each of the 12 listed concerns. Each stream creates new primitives, new CSS zones, new data structures. After 12 streams, the system has 12 new concepts, but no coherent product.

**Mitigation:** Define Phase 3 scope as workspace architecture only. Reject streams that do not directly implement audience separation, navigation doctrine, or progressive disclosure.

### 7.2 HIGH RISK: SQO Cockpit continues growing

**Risk:** Every new SQO capability (evidence rebase, semantic candidates, CEU admissibility, reconciliation loop) adds another cockpit section. SQO Cockpit is now at 14 sections and growing. Each section requires a route page, panel component, data resolver entry, route resolver entry, shell entry, and CSS block. The marginal cost of "add another section" is low, which encourages sprawl.

**Mitigation:** Cap SQO Cockpit sections. Any new operational capability should be evaluated for whether it is a new section or an extension of an existing section. Consider collapsing related sections (e.g., reconciliation + reconciliation-loop, evidence + evidence-ingestion + evidence-rebase + semantic-candidates + ceu-admissibility).

### 7.3 MEDIUM RISK: LENS v2 flagship page grows unbounded

**Risk:** The flagship page is already at ~1850 lines with 15 internal component functions. Each Phase 2 stream added zones (SemanticTrustPostureZone, ReconciliationAwarenessZone). Phase 3 will be tempted to add more zones, further inflating the file.

**Mitigation:** Phase 3 should extract zones into separate component files. The flagship page should become a composition shell, not a monolith. This is a Phase 3 hygiene prerequisite, not a separate stream.

### 7.4 MEDIUM RISK: Density modes become a patchwork

**Risk:** The density system (BALANCED/DENSE/INVESTIGATION/BOARDROOM) is implemented as conditional rendering within each zone. Each zone independently decides what to show for each mode. There is no central contract defining "what does BALANCED mode include?" This creates inconsistency risk as zones proliferate.

**Mitigation:** Define a density contract: a declarative specification of which zones are visible in which mode. Zones should consume this contract, not independently decide.

### 7.5 MEDIUM RISK: AI mediation scope creep

**Risk:** The framing mentions AI mediation as a Phase 3 concern. Any AI mediation work in Phase 3 risks violating the existing "AI = mediation layer, NOT source of truth" principle by introducing AI-generated navigation suggestions, disclosure pacing, or investigation guidance that becomes a de facto authority.

**Mitigation:** Phase 3 should have zero AI mediation. The navigation, disclosure, and investigation experience should be fully deterministic from data state. AI mediation is a Phase 4 concern, if ever.

### 7.6 LOW RISK: Terminology inflation

**Risk:** Phase 3 framing introduces 12+ new terms (cognitive pacing, narrative gravity, etc.) that could enter the locked terminology without operational definitions.

**Mitigation:** No new locked terms in Phase 3. The existing terminology is sufficient. Phase 3 is product architecture, not concept architecture.

---

## 8. Non-Negotiable Phase 3 Design Principles

**P1: No new architectural layers.**
Phase 3 does not add L9 or split existing layers. The L0-L8 model is locked. Phase 3 reorganizes how existing layers are presented, not how they are structured.

**P2: No new semantic primitives.**
Phase 3 does not introduce new substrate domains, propagation contracts, or ownership boundaries. The 8-domain, 23-artifact substrate is Phase 2's output and Phase 3's input. Phase 3 consumes; it does not extend.

**P3: Surfaces do not compute.**
No rendering surface performs derivation, inference, or semantic analysis. All surfaces render pre-compiled projections. This is the existing contract and must not be relaxed.

**P4: Audience separation is navigational, not computational.**
Executive, operator, and investigation modes differ in what they show, not in what they compute. The same underlying data serves all three modes. The difference is projection scope, not data authority.

**P5: Progressive disclosure replaces mode toggling.**
Instead of 4 density modes that toggle entire zones on/off, Phase 3 should implement progressive disclosure within a single flow. The executive sees Level 0-1 by default. Expanding reveals Level 2. Investigation mode reveals Level 3. This is a refinement of the existing density model, not a replacement.

**P6: SQO Cockpit does not expand.**
Phase 3 may reorganize SQO Cockpit sections but should not add new ones. If a new operational capability emerges, it must justify itself against the existing 14-section inventory.

**P7: No AI mediation in Phase 3.**
Phase 3 is fully deterministic. No AI-generated suggestions, no LLM-mediated navigation, no prompt surfaces. The system tells the user exactly what the data says. If the user wants interpretation, that is Phase 4+.

**P8: Every stream must reduce surface complexity, not increase it.**
Phase 3 success is measured by whether the system becomes more navigable with fewer cognitive decisions, not by whether it has more features. If a Phase 3 stream adds more than it consolidates, it is wrong.

---

## 9. Minimum Viable Phase 3 Definition

Phase 3 MVP consists of exactly four workstreams:

### WS-1: Executive/Operator URL Separation

Separate LENS v2 and SQO Cockpit into distinct URL namespaces. LENS v2 moves from `/sqo/client/[client]/run/[run]` to `/lens/[client]/[run]`. SQO Cockpit keeps `/sqo/client/[client]/run/[run]/[section]`. Both consume the same server-side binding.

**Acceptance criteria:** Executive arrives at `/lens/blueedge/run_blueedge_productized_01_fixed` and sees LENS v2. Operator arrives at `/sqo/...` and sees SQO Cockpit. No cross-audience navigation confusion.

### WS-2: LENS v2 Progressive Disclosure Shell

Replace the monolithic flagship page with a progressive disclosure shell. Zones are loaded based on disclosure level, not rendered-and-hidden. Level 0-1 loads immediately. Level 2 loads on expand. Level 3 loads on investigation entry.

**Acceptance criteria:** Executive loads LENS v2 and sees only declaration + posture + disclosure. Full intelligence field requires one explicit action. Evidence depth requires investigation mode entry.

### WS-3: SQO Cockpit Section Consolidation

Consolidate the 14 cockpit sections into logical groups:
- **Qualification:** overview, debt, maturity, progression, continuity
- **Reconciliation:** reconciliation, reconciliation-loop
- **Evidence:** evidence, evidence-ingestion, evidence-rebase, semantic-candidates, ceu-admissibility
- **Operations:** corridor, handoff

Sections within a group share a sidebar sub-section. Navigation shows groups, not flat list.

**Acceptance criteria:** Operator navigates cockpit with 4 groups instead of 14 flat items. Every existing section is still accessible. No functionality removed.

### WS-4: Cross-Surface Navigation Links

Add governed navigation links between surfaces:
- LENS v2 → "View Operational Detail" → SQO Cockpit overview
- LENS v2 → "Investigate [domain]" → Investigation view (existing INVESTIGATION_DENSE mode, context-preserving)
- SQO Cockpit → "View Executive Surface" → LENS v2

**Acceptance criteria:** Users can transition between surfaces without manually editing URLs. Context (client/run) is preserved across transitions.

### What MVP explicitly excludes:

- AI mediation of any kind
- New rendering zones or intelligence sections
- New SQO Cockpit sections
- Temporal cognition features
- Real-time alerting or escalation
- New semantic primitives or substrate extensions
- Report-pack pipeline changes
- New locked terminology

---

## 10. ADR-Style Recommendation

### ADR: Phase 3 Product Architecture Direction

**Status:** PROPOSED

**Context:**
Phase 2 has converged the semantic substrate (8 domains, 23 artifacts, operational reconciliation loop, reconciliation-aware reporting). The system now has more operational surface area than any single user needs. Two surfaces exist (LENS v2 + SQO Cockpit) serving three implicit audiences (executive, operator, investigator) without formal audience separation. The current Phase 3 hypothesis proposes designing a "cognitive operating environment" — a framing that correctly identifies the navigability problem but introduces ungrounded vocabulary and risks scope explosion.

**Decision:**
Phase 3 is redefined as **audience-separated workspace architecture with governed navigation and progressive disclosure.** The scope is constrained to four workstreams: URL separation, progressive disclosure shell, section consolidation, and cross-surface navigation. No new architectural layers, no new semantic primitives, no AI mediation, no new locked terminology.

**Rationale:**
1. The system's problem is navigability, not missing capability. Phase 3 should reorganize, not extend.
2. "Cognitive operating environment" is aspirational vocabulary without operational definitions. Shipping requires concrete acceptance criteria.
3. SQO-centric collapse is prevented by separating LENS v2 into its own URL namespace and capping cockpit section growth.
4. Operator/executive collapse is prevented by making audience separation navigational (different URLs, different default views) rather than relying on density mode toggles.
5. Progressive disclosure is a refinement of the existing density model, not a replacement. It preserves the insight (different users need different projection depth) while making it architecturally explicit.

**Consequences:**
- Phase 3 is scoped to 4 workstreams, not 12+ aspirational concerns
- The "cognitive operating environment" label may be retired or reserved for a future phase after MVP validates the workspace architecture
- LENS v2 gets its own route namespace, breaking backward compatibility with existing `/sqo/...` URLs for executive access
- SQO Cockpit sections are reorganized but not removed
- AI mediation is explicitly deferred to Phase 4+
- The existing density model is preserved and refined, not replaced

**Alternatives considered:**
- **Proceed with "cognitive operating environment" framing as-is:** Rejected. The framing is not productizable without first solving the concrete workspace architecture problems.
- **Build a unified workspace that serves all audiences:** Rejected. This is what the current system already does, and the resulting cognitive load is the problem Phase 3 exists to solve.
- **Introduce AI-mediated navigation:** Rejected for Phase 3. AI mediation requires a navigability baseline to mediate against. Build the deterministic experience first.

---

## Appendix A: Current Surface Inventory (Reference)

### LENS v2 Flagship (pages/lens-v2-flagship.js)

| Component | Type | Density Visibility |
|-----------|------|-------------------|
| AuthorityBand | Control | All modes |
| DeclarationZone | Zone | All modes (non-blocked) |
| QualifierMandate | Zone | When qualifier visible |
| SemanticTrustPostureZone | Zone | When substrate available |
| ReconciliationAwarenessZone | Zone | When awareness available |
| IntelligenceField | Zone | All modes (dispatches internally) |
| StructuralTopologyZone | Zone | All modes |
| EvidenceDepthLayer | Zone | INVESTIGATION_DENSE only |
| GovernanceRibbon | Zone | All modes |

Internal IntelligenceField dispatch:
- BOARDROOM → BoardroomAtmosphericField
- EXECUTIVE_BALANCED → BalancedConsequenceField
- EXECUTIVE_DENSE → DenseTopologyField
- INVESTIGATION_DENSE → InvestigationTraceField

### SQO Cockpit (14 sections)

overview, debt, continuity, maturity, progression, evidence, reconciliation, reconciliation-loop, handoff, corridor, evidence-ingestion, semantic-candidates, ceu-admissibility, evidence-rebase

### NextGen Reports Pipeline

CoreReportContainer → SurfaceModeRouter → ReportModuleShell (10 reconciliation sections + 3 pending slots)

### Density Modes

| Mode | Persona | Target Audience |
|------|---------|----------------|
| EXECUTIVE_BALANCED | CEO · consequence-first read | Executive |
| EXECUTIVE_DENSE | CTO · structural cause and propagation | Technical executive |
| INVESTIGATION_DENSE | Analyst · evidence trace and confidence | Analyst/investigator |
| BOARDROOM | Boardroom projection — minimal chrome | Board presentation |

## Appendix B: Phase 3 Stream Sequence (Recommended)

| Order | Stream | Dependencies | Estimated Complexity |
|-------|--------|-------------|---------------------|
| 1 | WS-1: URL Separation | None | LOW — route reorganization, binding shared |
| 2 | WS-3: Section Consolidation | None (parallel with WS-1) | MEDIUM — sidebar grouping, route aliases |
| 3 | WS-2: Progressive Disclosure Shell | WS-1 (LENS v2 has own route) | MEDIUM — zone extraction, disclosure levels |
| 4 | WS-4: Cross-Surface Navigation | WS-1 + WS-3 (surfaces separated) | LOW — link components, context preservation |

WS-1 and WS-3 can execute in parallel. WS-2 depends on WS-1. WS-4 depends on WS-1 and WS-3.

Total estimated streams: 4-6 (depending on whether consolidation requires sub-streams for each group).
