# Execution Report — PI.LENS.V2.PHASE3B.EXECUTIVE-INTELLIGENCE-RECOVERY-PLANNING.01

## Stream

PI.LENS.V2.PHASE3B.EXECUTIVE-INTELLIGENCE-RECOVERY-PLANNING.01

## Stream Classification

G2 — architecture-consuming. Consumes architectural mutations from REALIGNMENT.01 and decomposes them into an executable stream plan. Introduces no new architectural concepts.

## Pre-flight

- Branch: `work/lens-v2-productization` — confirmed
- Git structure contract: loaded and confirmed
- Canonical state: loaded (2026-05-13)
- Terminology lock: loaded
- Current repository: krayu-program-intelligence (k-pi-core)
- Branch authorized: WARN (work branch, runtime/demo domain, planning-only output)
- Preflight result: WARN — proceeding with acknowledgment

## Input Artifact

PI.LENS.V2.EXECUTIVE-INTELLIGENCE-ROADMAP.REALIGNMENT.01
- execution_report.md: reviewed
- CLOSURE.md: reviewed
- Status: COMPLETE
- Ready state: PI_LENS_V2_EXECUTIVE_INTELLIGENCE_ROADMAP_REALIGNMENT_COMPLETE

---

# 1. ARCHITECTURAL ACCEPTANCE VERDICT

## Verdict: ACCEPTED

The roadmap is architecturally valid, operationally coherent, north-star aligned, and vault-compatible.

### Rationale

**Architecturally valid:** The diagnosis correctly identifies the static → NEXTGEN parity gaps. The 22-feature gap analysis is traceable to specific static report elements and specific NEXTGEN code artifacts. The 9 LOST / 5 DEGRADED / 3 TRANSFORMED classification is accurate against the codebase.

**Operationally coherent:** Every recovery item consumes existing data. The payload layer (GenericSemanticPayloadResolver) already carries topology_summary, semantic_domain_registry, propagation_summary, readiness_summary, narrative_block, qualifier_summary, and trace_linkage — all data required by the recovery items. No new API endpoints, no new data computation, no new derivation required for the core recoveries.

**North-star aligned:** The north star (Operational Executive Intelligence Ecosystem) is consistent with the existing canonical state: LENS v2 is defined as "executive semantic intelligence" and SQO as "qualification state machine." The roadmap restores the intelligence emphasis that was always the stated purpose.

**Vault-compatible:** No locked terminology is redefined. No locked boundaries are violated. The roadmap operates entirely within the runtime/demo domain (L6/L7). Phase 3A disclosure architecture primitives (DisclosureSequencingContract, SeverityHierarchyResolver, ConditionDrivenLayoutResolver) are consumed, not mutated.

### Specific Assessments

| Element | Assessment |
|---|---|
| Phase 3A / 3B split | VALID — 3A delivered correct architecture; 3B addresses the editorial/intelligence gap that architecture alone cannot solve |
| Topology restoration doctrine | VALID — topology was incorrectly demoted; data already supports visual rendering |
| Editorial hierarchy restoration | VALID — persona model maps naturally to Decision/Intelligence/Investigation views |
| SQO dual-face model | VALID — executive face is narrative intelligence, operational face remains the cockpit |
| Executive vs investigation projection split | VALID — matches the static report hierarchy (Decision → Brief → Evidence → Diagnostic) |
| Governance visibility recalibration | VALID with CAUTION — governance data must remain available in all views; only RENDERING placement changes |
| Static-report parity doctrine | VALID — static reports are the correct reference standard for editorial quality |
| PATH A / PATH B balance | VALID — PATH A provides structural proof, PATH B provides semantic understanding; recovery restores PATH A prominence without diminishing PATH B |

---

# 2. NORTH-STAR ALIGNMENT ASSESSMENT

The north star defined in the roadmap — Operational Executive Intelligence Ecosystem — aligns with the existing system trajectory:

| North Star Principle | Current System Support | Gap |
|---|---|---|
| Executive understands posture immediately | readiness_summary.posture exists in payload | Rendering: posture is not the hero element |
| Executive sees structural shape | semantic_domain_registry + topology_summary exist | Rendering: no visual topology |
| Executive knows known vs unknown | Data supports boundary split | Rendering: boundary is a sub-element, not a section |
| SQO is executive intelligence | SQO data in payload (s_state, debt) | Architecture: SQO lives in separate cockpit |
| Signals tell stories | dpsig_signal_summary + evidence_blocks exist | Content: no interpretive prose in payload |
| Governance is ambient | All governance data in payload | Rendering: governance is visible chrome |
| Progressive disclosure is editorial | Disclosure shell + tier system exists | Configuration: tiers are architectural, not editorial |

**Assessment:** The system is architecturally capable of delivering the north star. The gap is in the projection layer — how data becomes intelligence on the surface. This is the correct gap for Phase 3B to address.

---

# 3. PHASE RESTRUCTURING ASSESSMENT

## Accepted Phase Model

| Phase | Name | Status | Mission |
|---|---|---|---|
| 1 | Static Structural Reporting | COMPLETE | Produce PATH A static HTML reports — the reference standard |
| 2 | NEXTGEN Interactive LENS | COMPLETE | Live binding, payload resolution, multi-client architecture |
| 3A | Disclosure Architecture | COMPLETE | Progressive disclosure shell, severity hierarchy, layout resolver, zone extraction, cinematic doctrine |
| 3B | Executive Intelligence Recovery | NEXT | Restore editorial quality, storytelling, topology, decision surface, SQO intelligence within NEXTGEN |
| 4 | Guided Structural Investigation | FUTURE | Investigation surface: evidence topology, reading guide, term decode, trace continuity |
| 5 | Conversational Executive Intelligence | FUTURE | Conversational interaction on top of intelligence surface |
| 6 | Operational Executive Intelligence Ecosystem | FUTURE | Full operational integration: unified intelligence + qualification + investigation |

### Phase 3B Mission

Restore the executive intelligence quality of the PATH A static reports within the interactive NEXTGEN framework, using the disclosure architecture built in Phase 3A.

**Executive intelligence objective:** An executive who loads the LENS surface immediately understands what to do, what the structure looks like, what is known, and what isn't — without processing metrics or scanning dashboards.

**Operational intelligence objective:** SQO qualification state is visible as intelligence within the LENS experience, with operational drill-down linked to the SQO Cockpit.

**Architectural dependency:** Phase 3A disclosure shell, zones, and layout resolver. All present and operational.

**Expected cognitive outcome:** The executive experience shifts from "scanning a dense report" to "reading a brief" — the same shift the static reports achieved over raw data.

### Phase 4 Mission

Restore the investigation surface quality of the Tier-2 Diagnostic within the interactive NEXTGEN framework.

**Executive intelligence objective:** N/A — Phase 4 serves analysts, not executives.

**Operational intelligence objective:** An analyst can interrogate every claim, trace every value to its source, understand every term without external help, and visualize how evidence connects.

**Architectural dependency:** Phase 3B (investigation mode builds on the editorial restructuring of the intelligence surface).

**Expected cognitive outcome:** The investigation experience shifts from "reading monospace data blocks" to "following an evidence story" — self-explanatory, traceable, educating.

### Phase 5 Mission

Add conversational interaction to the intelligence surface.

**Dependency:** Phase 3B + Phase 4 complete. Conversation on top of metrics produces chatbot-over-data. Conversation on top of intelligence produces guided understanding.

**Expected cognitive outcome:** An executive or analyst can ASK questions about the intelligence, not just READ it.

### Phase 6 Mission

Unify LENS intelligence, SQO qualification, investigation, and conversation into a single operational ecosystem.

**Dependency:** All prior phases correctly oriented toward intelligence.

**Expected cognitive outcome:** The system operates as a unified intelligence environment — not a collection of separate surfaces.

---

# 4. EXECUTIVE INTELLIGENCE RECOVERY ROADMAP

## Phase 3B — Stream Decomposition

### Stream 3B.01: Decision View Restoration

**Mission:** Make the BOARDROOM persona deliver the static Decision Surface experience.

**What changes:**
- DeclarationZone in BOARDROOM: renders decision posture word (INVESTIGATE / PROCEED / ESCALATE) as hero element — not "EXECUTIVE READY" but the actual decision guidance
- Create a confirmed/unknown boundary split section (two columns: "Structurally confirmed" vs "Not known")
- Score gauge rendered as visual element (SVG arc matching static report)
- One-sentence rationale: "Structure is verified. Execution evidence is incomplete."
- Three context badges: STRUCTURE status · EVIDENCE status · RISK level
- Navigation element: "Open the evidence" → switch to EXECUTIVE_BALANCED
- Suppress all metric zones (SemanticTrustPostureZone, ReconciliationAwarenessZone detail) in BOARDROOM
- Inference prohibition as footer notice

**Data consumed (already in payload):**
- `readiness_summary.posture` → decision word
- `readiness_summary.score`, `readiness_summary.band` → score gauge
- `readiness_summary.render_state` → rationale generation
- `topology_summary` (confirmed structural state) → confirmed column
- `qualifier_summary`, `rendering_metadata` → evidence completeness / risk assessment
- `governance_assertions` → inference prohibition notice

**Files impacted:**
- components/lens-v2/zones/DeclarationZone.jsx (BOARDROOM rendering)
- components/lens-v2/LensDisclosureShell.jsx (BOARDROOM zone suppression)
- pages/lens-v2-flagship.js (CSS for decision view elements)
- Possibly: new component for boundary split section

**Does NOT change:**
- Payload structure
- Layout resolver logic
- Severity hierarchy
- Other persona modes

**Classification:** G2
**Priority:** P1 — CRITICAL
**Dependencies:** None
**Expected cognitive outcome:** 10-second executive scan. One word, one number, one split.

---

### Stream 3B.02: Structural Topology Visualization

**Mission:** Rebuild StructuralTopologyZone as a visual SVG domain landscape.

**What changes:**
- Replace text-only path display with SVG visualization
- Domain columns showing: domain identifier, root component name, component count
- Pressure zone highlighting: primary zones elevated with gold border and label (PZ-001 PRIMARY)
- Signal annotations on pressure zone domains
- Grounding status indicated per domain (grounded vs weakly grounded)
- Move topology from tier2 to tier1 in the ConditionDrivenLayoutResolver

**Data consumed (already in payload):**
- `semantic_domain_registry` → domain list with names, types, structurally_backed status
- `topology_summary` → counts (domains, clusters, components)
- `propagation_summary` → pressure zone identification, primary zone, active signals
- `evidence_blocks` → domain-level signal cards and pressure tiers

**Files impacted:**
- components/lens-v2/zones/StructuralTopologyZone.jsx (complete rebuild)
- lib/lens-v2/ConditionDrivenLayoutResolver.js (move topology to tier1)
- pages/lens-v2-flagship.js (CSS for topology visualization)

**Does NOT change:**
- Payload structure
- Disclosure shell architecture
- Other zone components

**Classification:** G2
**Priority:** P1 — CRITICAL
**Dependencies:** None (can run in parallel with 3B.01)
**Expected cognitive outcome:** Executive sees the SHAPE of the system. Pressure zones are spatially obvious. Structural understanding replaces metric processing.

---

### Stream 3B.03: Narrative Editorial Restructure

**Mission:** Restore the narrative as the organizing principle of the Intelligence View.

**What changes:**
- In EXECUTIVE_BALANCED, restructure IntelligenceField:
  - Narrative becomes the primary content (left column or full-width top section)
  - Topology visualization lives alongside or below narrative (not competing with it)
  - RepresentationField modes simplified: Balanced shows Decision Posture + Pressure Anchor only (not Confidence Boundary and Resolution Boundary as competing sub-panels)
- Extract Known vs Unknown boundary as a standalone zone or section:
  - Two columns: "Confirmed" (bulleted list) vs "Outside Evidence Scope" (bulleted list)
  - Boundary note: "These are confirmed unknowns — not assumed healthy states"
  - Placed below the narrative+topology area, visible on first load
- Add structural conclusion block:
  - Visually distinct conclusion element at bottom of Intelligence View
  - "The system is structurally stable. INVESTIGATE is driven by evidence incompleteness, not structural instability."

**Data consumed (already in payload):**
- `narrative_block` → executive summary, why section, structural summary
- `readiness_summary` → posture, score for conclusion framing
- Boundary data derivable from existing payload fields (confirmed: topology_summary, domain grounding, signal activation; unknown: execution layer, inactive signals, blind spot coverage)

**Files impacted:**
- components/lens-v2/zones/IntelligenceField.jsx (restructure for EXECUTIVE_BALANCED)
- Possibly: new EvidenceBoundaryZone component (Known vs Unknown split)
- pages/lens-v2-flagship.js (CSS for restructured layout)

**Classification:** G2
**Priority:** P2 — HIGH
**Dependencies:** Benefits from 3B.02 (topology available for integration with narrative layout) but not strictly dependent
**Expected cognitive outcome:** Executive reads a STORY: context → state → pressure → boundary → conclusion. Understanding builds progressively.

---

### Stream 3B.04: SQO Executive Intelligence Embedding

**Mission:** Make SQO qualification state visible as narrative intelligence within LENS.

**What changes:**
- Create an SQO Intelligence element rendering qualification as narrative:
  - "Qualification state: S2 — Qualified with Debt."
  - "15 semantic debt items remain."
  - "Primary blocking condition: [specific]."
  - "Resolution of [Y] would advance to S3: Authority Ready."
- Place in Intelligence View (EXECUTIVE_BALANCED, EXECUTIVE_DENSE)
- Link to SQO Cockpit for operational drill-down
- NOT a metrics dashboard — a narrative intelligence section

**Data consumed (requires assessment of availability):**
- SQO state data: currently available through the SQO cockpit's own resolver (SQOCockpitStateResolver), may need to be included in the LENS payload or fetched from the same API
- `readiness_summary.render_state` → qualification linkage
- Debt summary: available in SQO cockpit data, needs exposure in LENS context

**Files impacted:**
- Possibly: new SQOIntelligence zone component
- components/lens-v2/LensDisclosureShell.jsx (integrate new zone)
- lib/lens-v2/ConditionDrivenLayoutResolver.js (place SQO intelligence in sequence)
- Possibly: pages/api/lens-payload.js (include SQO summary in payload)
- pages/lens-v2-flagship.js (CSS)

**Classification:** G2
**Priority:** P2 — HIGH
**Dependencies:** 3B.03 (needs restructured intelligence view to place SQO narrative)
**Payload impact:** May require adding SQO summary data to the LENS payload. This is data assembly, not new computation — the SQO resolvers already produce this data for the cockpit.
**Expected cognitive outcome:** Executive understands qualification journey without leaving LENS. "Where are we, what's blocking, what's next" — three sentences, not twelve metric cards.

---

### Stream 3B.05: Signal Interpretation Recovery

**Mission:** Restore interpretive prose for structural signals.

**What changes:**
- Each signal/evidence block gets a structural interpretation statement:
  - What the signal value means
  - Where it concentrates (primary attribution domain)
  - Co-presence with other signals (compound zone narrative)
  - Confidence level
- Update EvidenceDepthLayer to render interpretation prose
- Optionally: add signal interpretation section to the Intelligence View (not just Investigation depth)

**Data consumed:**
- `dpsig_signal_summary.signals` → signal values, domains
- `propagation_summary` → pressure zone, co-present signals
- `evidence_blocks` → signal cards with pressure tiers

**Payload impact:** The interpretive statements can be generated deterministically from existing signal data + pressure zone projection + attribution data. Two options:
1. Generate prose in the payload resolver (adds to payload size but keeps rendering simple)
2. Generate prose in the zone component (keeps payload unchanged but adds rendering logic)

Recommendation: Generate in the payload resolver. The static reports generated interpretation in the report generation layer, not the rendering layer. This keeps rendering dumb and payload smart.

**Files impacted:**
- lib/lens-v2/generic/GenericSemanticPayloadResolver.js or BlueEdgePayloadResolver.js (add interpretation prose to signal data)
- components/lens-v2/zones/EvidenceDepthLayer.jsx (render interpretation prose)
- pages/lens-v2-flagship.js (CSS for interpretation rendering)

**Classification:** G2
**Priority:** P3 — MEDIUM
**Dependencies:** 3B.03 (needs restructured intelligence surface to place signal interpretation)
**Expected cognitive outcome:** Signals tell stories. "Fan-In Concentration is statistically abnormal at 5.663 in backend_app_root — co-present with Fan-Out and Responsibility signals." Not: "PSIG-001: 5.663".

---

### Stream 3B.06: Governance Visibility Recalibration

**Mission:** Move governance from visible executive chrome to ambient investigation tool.

**What changes:**
- GovernanceRibbon: move from tier0 to Investigation tier (visible in INVESTIGATION_DENSE, hidden in EXECUTIVE_BALANCED and BOARDROOM)
- QualifierMandate: integrate qualifier language into the narrative ("This assessment includes partially grounded claims — advisory confirmation required") rather than rendering as a standalone zone
- Inference prohibition: render as a small footer notice at the bottom of the LENS surface (matching static report placement)
- SemanticTrustPostureZone: hide governance mechanics (progression gates, propagation readiness, detailed debt metrics) from EXECUTIVE_BALANCED; available in EXECUTIVE_DENSE and Investigation

**CAUTION:** Governance DATA must remain available in all views. Only RENDERING placement changes. The payload still carries governance_assertions, qualifier_summary, and rendering_metadata. No governance data is removed.

**Files impacted:**
- lib/lens-v2/ConditionDrivenLayoutResolver.js (move GovernanceRibbon to investigation tier)
- components/lens-v2/zones/IntelligenceField.jsx (integrate qualifier language into narrative)
- components/lens-v2/zones/SemanticTrustPostureZone.jsx (simplify EXECUTIVE_BALANCED rendering)
- components/lens-v2/LensDisclosureShell.jsx (add inference prohibition footer)
- pages/lens-v2-flagship.js (CSS)

**Classification:** G2
**Priority:** P3 — MEDIUM
**Dependencies:** 3B.03 (needs restructured narrative to integrate qualifier)
**Expected cognitive outcome:** Governance is felt, not seen. The surface earns trust through traceable claims and explicit boundaries, not checkboxes.

---

## Phase 4 — Stream Decomposition

### Stream 4.01: Reading Guide and Term Decode

**Mission:** Restore the self-explanatory quality from the Tier-2 Diagnostic.

**What changes:**
- Create a reading guide section for Investigation View:
  - "What is a pressure zone?"
  - "Why do compound zones matter?"
  - "What does primary vs secondary attribution mean?"
  - Rich prose explanations, not definitions
- Create a term decode panel:
  - COMPOUND_ZONE, PRESSURE_ZONE, RUN_RELATIVE_OUTLIER, THEORETICAL_BASELINE, CONFIDENCE_BAND, etc.
  - Each term: execution name, executive decode, technical decode
  - Accessible from Investigation View as an expandable section or side panel

**Files impacted:**
- New component: ReadingGuide or DiagnosticGuide
- New component or data file: term decode registry
- pages/lens-v2-flagship.js (CSS)

**Classification:** G2
**Priority:** P4 — ENHANCEMENT
**Dependencies:** Phase 3B complete (Investigation View restructured)
**Expected cognitive outcome:** The surface is self-explanatory. An analyst who has never seen the system can read the investigation view and understand every term.

---

### Stream 4.02: Evidence Topology Visualization

**Mission:** Restore the interactive evidence topology canvas from the Tier-2 Diagnostic.

**What changes:**
- Canvas-based evidence topology visualization:
  - Zone roots (white nodes)
  - Signals (green nodes)
  - Mapped claims (gold nodes)
  - Artifacts (blue nodes)
  - Connection links between them
- Force-directed or positioned layout (matching static report aesthetic)
- Placed in Investigation View

**Data consumed:**
- Evidence topology data needs to be assembled from trace_linkage, dpsig_signal_summary, evidence_blocks
- The static report hardcoded node positions and links — NEXTGEN should derive them from payload data

**Files impacted:**
- New component: EvidenceTopologyCanvas
- pages/lens-v2-flagship.js (CSS)

**Classification:** G2
**Priority:** P4 — ENHANCEMENT
**Dependencies:** Phase 3B complete
**Expected cognitive outcome:** An analyst can visually trace the evidence chain. Claims → signals → zones → artifacts. The evidence structure is visible, not just the system structure.

---

### Stream 4.03: Editorial Hierarchy Integration

**Mission:** Ensure persona modes align with the editorial view model.

**What changes:**
- Verify that switching between BOARDROOM → EXECUTIVE_BALANCED → EXECUTIVE_DENSE → INVESTIGATION_DENSE produces the editorial hierarchy:
  - BOARDROOM = Decision View (posture, rationale, boundary, navigate)
  - EXECUTIVE_BALANCED = Intelligence View (narrative, topology, pressure, boundary, conclusion)
  - EXECUTIVE_DENSE = Intelligence View + metrics (add trust posture, reconciliation detail)
  - INVESTIGATION_DENSE = Investigation View (evidence trace, signal stack, reading guide, evidence topology, governance ribbon, trace continuity)
- Smooth transitions between view modes
- Each view answers its specific question and STOPS

**Files impacted:**
- Disclosure shell, layout resolver, zone components (refinement pass across all)

**Classification:** G2
**Priority:** P4 — ENHANCEMENT
**Dependencies:** 3B.01 + 3B.02 + 3B.03 + 3B.06 + 4.01 + 4.02
**Expected cognitive outcome:** The persona selector becomes a LENS mode selector: Decision → Intelligence → Investigation. The executive chooses their depth of engagement.

---

# 5. DEPENDENCY GRAPH

```
                    ┌─────────────────────────────────────────────┐
                    │              PHASE 3B                        │
                    │                                             │
  ┌─────────┐      │  ┌──────────┐     ┌──────────┐             │
  │ Phase 3A │──────│─▶│  3B.01   │     │  3B.02   │             │
  │ COMPLETE │      │  │ Decision │     │ Topology │             │
  └─────────┘      │  │  View    │     │   SVG    │             │
                    │  └────┬─────┘     └────┬─────┘             │
                    │       │                │                    │
                    │       │     ┌──────────┘                    │
                    │       │     │                               │
                    │       ▼     ▼                               │
                    │  ┌──────────────┐                           │
                    │  │    3B.03     │                           │
                    │  │  Narrative   │                           │
                    │  │  Editorial   │                           │
                    │  └──────┬───────┘                           │
                    │         │                                   │
                    │    ┌────┼──────┐                            │
                    │    │    │      │                            │
                    │    ▼    ▼      ▼                            │
                    │ ┌──────┐ ┌──────┐ ┌──────┐                 │
                    │ │3B.04 │ │3B.05 │ │3B.06 │                 │
                    │ │ SQO  │ │Signal│ │ Gov  │                 │
                    │ │Embed │ │Interp│ │Recal │                 │
                    │ └──────┘ └──────┘ └──────┘                 │
                    └─────────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────────────┐
                    │              PHASE 4                         │
                    │                                             │
                    │  ┌──────────┐     ┌──────────┐             │
                    │  │  4.01    │     │  4.02    │             │
                    │  │ Reading  │     │ Evidence │             │
                    │  │ Guide   │     │ Topology │             │
                    │  └────┬─────┘     └────┬─────┘             │
                    │       │                │                    │
                    │       └────────┬───────┘                    │
                    │                ▼                             │
                    │         ┌──────────┐                        │
                    │         │  4.03    │                        │
                    │         │Editorial │                        │
                    │         │Hierarchy │                        │
                    │         └──────────┘                        │
                    └─────────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────────────┐
                    │              PHASE 5                         │
                    │     Conversational Intelligence              │
                    └─────────────────────────────────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────────────┐
                    │              PHASE 6                         │
                    │   Operational Intelligence Ecosystem         │
                    └─────────────────────────────────────────────┘
```

### Dependency Rules

| Stream | Hard Dependencies | Soft Dependencies |
|---|---|---|
| 3B.01 | None | None |
| 3B.02 | None | None |
| 3B.03 | None | 3B.02 (topology available for layout integration) |
| 3B.04 | 3B.03 (needs restructured intelligence view) | SQO data availability in LENS payload |
| 3B.05 | 3B.03 (needs restructured intelligence surface) | None |
| 3B.06 | 3B.03 (needs restructured narrative for qualifier integration) | None |
| 4.01 | Phase 3B complete | None |
| 4.02 | Phase 3B complete | None |
| 4.03 | 3B.01 + 3B.03 + 4.01 + 4.02 | All Phase 3B and 4 streams |

### Parallelization Opportunities

- **3B.01 and 3B.02** can run in parallel (no dependency on each other)
- **3B.04, 3B.05, 3B.06** can run in parallel after 3B.03
- **4.01 and 4.02** can run in parallel after Phase 3B

---

# 6. RECOMMENDED IMPLEMENTATION ORDER

## Wave 1 (parallel)

| Stream | Name | Priority |
|---|---|---|
| 3B.01 | Decision View Restoration | P1 — CRITICAL |
| 3B.02 | Structural Topology Visualization | P1 — CRITICAL |

**Rationale:** These two streams define the product direction. 3B.01 proves NEXTGEN can deliver the Decision Surface experience. 3B.02 proves topology can be restored as executive intelligence. Both are independent — no shared dependencies. Both consume existing payload data.

**Combined outcome:** The BOARDROOM persona delivers a decision surface. The EXECUTIVE_BALANCED persona gains a visual topology. The two most important losses from the static reports are recovered.

## Wave 2

| Stream | Name | Priority |
|---|---|---|
| 3B.03 | Narrative Editorial Restructure | P2 — HIGH |

**Rationale:** This is the structural reorganization that all subsequent streams depend on. The narrative becomes the editorial spine. The Known/Unknown boundary becomes a standalone section. The Intelligence View gains its organizing principle.

**Outcome:** The EXECUTIVE_BALANCED persona reads like a brief, not a dashboard.

## Wave 3 (parallel)

| Stream | Name | Priority |
|---|---|---|
| 3B.04 | SQO Executive Intelligence Embedding | P2 — HIGH |
| 3B.05 | Signal Interpretation Recovery | P3 — MEDIUM |
| 3B.06 | Governance Visibility Recalibration | P3 — MEDIUM |

**Rationale:** All three depend on 3B.03 and are independent of each other. SQO embedding adds qualification intelligence. Signal interpretation adds structural storytelling. Governance recalibration reduces chrome and increases trust.

**Combined outcome:** Phase 3B is functionally complete. The LENS surface delivers executive structural intelligence matching the editorial quality of the static reports.

## Wave 4 (parallel)

| Stream | Name | Priority |
|---|---|---|
| 4.01 | Reading Guide and Term Decode | P4 — ENHANCEMENT |
| 4.02 | Evidence Topology Visualization | P4 — ENHANCEMENT |

**Rationale:** Phase 4 begins. Both are investigation surface enhancements. Both can run in parallel.

**Combined outcome:** The investigation surface gains self-explanatory quality and evidence visualization.

## Wave 5

| Stream | Name | Priority |
|---|---|---|
| 4.03 | Editorial Hierarchy Integration | P4 — ENHANCEMENT |

**Rationale:** Integration pass across all view modes. Requires all prior streams complete.

**Combined outcome:** Phase 4 complete. The editorial hierarchy — Decision → Intelligence → Investigation — works as a unified experience.

---

# 7. RISK ANALYSIS

## 7.1 Decision View might feel disconnected

**Risk:** If BOARDROOM suppresses all metric zones and shows only posture/rationale/boundary, the executive might feel they've landed on the wrong page.

**Mitigation:** Navigation must be clear and immediate. "Open the evidence" links. The view mode selector should be visible. The Decision View should feel like the FRONT page of a brief, not a stripped-down page.

## 7.2 Topology SVG complexity

**Risk:** The static report topology was handcrafted for 13 domains at known positions. NEXTGEN needs to generate topology for varying domain counts across clients.

**Mitigation:** Start with a column-based layout that adapts to domain count. Don't attempt a force-directed graph for system topology — that's Phase 4's evidence topology. System topology is structural: columns, counts, highlighting. Keep it simple.

## 7.3 SQO data availability in LENS payload

**Risk:** Stream 3B.04 may need SQO summary data that isn't currently in the LENS payload. The SQO resolvers (SQOCockpitStateResolver) produce this data for the cockpit but it may not be available to GenericSemanticPayloadResolver.

**Mitigation:** Assess early whether the LENS payload needs SQO enrichment. If yes, this is data assembly (not new computation) — the resolvers already exist.

## 7.4 Narrative editorial restructure scope

**Risk:** Stream 3B.03 touches IntelligenceField, which is the most complex zone (633 lines, 16 sub-components). Restructuring it could introduce regression.

**Mitigation:** IntelligenceField already has persona-driven rendering (Balanced, Dense, Investigation, Boardroom). The restructuring is about changing what each mode shows, not replacing the architecture. Existing sub-components (ExecutiveInterpretation, RepresentationField, SupportRail) can be recomposed, not rewritten.

## 7.5 Governance recalibration over-suppression

**Risk:** Moving GovernanceRibbon to investigation tier and integrating qualifier into narrative could make governance feel absent, not ambient.

**Mitigation:** The inference prohibition footer remains visible in all views. The qualifier language is IN the narrative, not removed from it. The governance data is in the payload and available to any component. Governance is still enforced — it's just not rendered as chrome.

## 7.6 Over-engineering recovery (restated from roadmap)

**Risk:** Each recovery stream could add architectural complexity instead of editorial quality.

**Mitigation:** Each stream must pass the single test: "Does this answer a question an executive would ask?" Streams that add zones, resolvers, or layout logic that don't directly improve executive comprehension are drift. The recovery is about CONTENT and EDITORIAL CHOICE, not more architecture.

---

# 8. PROJECTION DOCTRINE RECOMMENDATIONS

## 8.1 "Intelligence answers questions, not displays data"

**Recommendation: ACCEPT as formal projection doctrine.**

This principle should govern all projection layer decisions. Every element on the executive surface must answer a specific question. Elements that display data without answering a question should be moved to dense or investigation views, or removed.

**Application test:** For any proposed UI element, ask: "What question does the executive ask that this element answers?" If the answer is "it shows the [metric]" rather than "it answers [question]," the element belongs in a deeper view.

## 8.2 PATH A static reports as canonical executive intelligence reference baseline

**Recommendation: ACCEPT as reference standard.**

The 4 static HTML reports should be treated as the reference standard for what executive structural intelligence should feel like. NEXTGEN should be measured against their editorial quality, not treated as a replacement that supersedes them.

This does NOT mean NEXTGEN should replicate the static reports pixel-for-pixel. It means NEXTGEN should achieve the same COGNITIVE OUTCOME: an executive who uses the NEXTGEN surface should build the same understanding that an executive who reads the static reports builds.

**Application test:** For any NEXTGEN surface, compare the cognitive outcome to the corresponding static report. If the static report delivers clearer understanding of the same data, the NEXTGEN surface needs work.

---

# 9. SQO / LENS BOUNDARY CLARIFICATION

| Responsibility | Owner | Rationale |
|---|---|---|
| Decision posture (INVESTIGATE/PROCEED/ESCALATE) | LENS | Answers "what should I do?" — executive intelligence |
| Qualification state narrative ("S2: Qualified with Debt") | LENS | Answers "where are we on the journey?" — executive intelligence |
| Structural topology visualization | LENS | Answers "what does the structure look like?" — executive intelligence |
| Known vs Unknown boundary | LENS | Answers "what do I know?" — executive intelligence |
| Signal interpretation | LENS | Answers "what are the signals telling me?" — executive intelligence |
| Qualification blocking conditions (narrative) | LENS | Answers "what's blocking advancement?" — executive intelligence |
| Qualification debt inventory (operational detail) | SQO Cockpit | Operational: debt items, resolution rates, classifications |
| Progression readiness (gate-by-gate) | SQO Cockpit | Operational: which gates met, which remain |
| Reconciliation correspondence (per-domain) | SQO Cockpit | Operational: domain-level mapping detail |
| Workflow spine and stage tracking | SQO Cockpit | Operational: workflow progression mechanics |
| Evidence replay and rerun orchestration | SQO Cockpit | Operational: rerun modes, phase coverage |
| Maturity profile (dimension-level scores) | SQO Cockpit | Operational: structural dimension analysis |
| Governance ribbon (pass/fail checks) | LENS Investigation View | Analyst tool: governance verification |
| Trace continuity table | LENS Investigation View | Analyst tool: value-to-source tracing |
| Evidence topology visualization | LENS Investigation View | Analyst tool: evidence chain visualization |
| Reading guide and term decode | LENS Investigation View | Analyst tool: self-explanatory surface |

**Principle:** LENS answers executive questions. SQO Cockpit supports operational qualification work. Investigation View serves analyst interrogation. No surface tries to do another surface's job.

---

# 10. EXECUTIVE VS INVESTIGATION COGNITION MODEL

## Executive Cognition (Decision View + Intelligence View)

**Purpose:** Build understanding. Answer: "What should I do and why?"

**Elements that belong:**
- Decision posture (one word)
- Rationale (one sentence)
- Confirmed/Unknown boundary (two columns)
- Structural topology (visual domain landscape)
- Narrative interpretation (story with beginning, middle, end)
- Pressure zone narrative (where attention is needed)
- SQO intelligence (qualification journey summary)
- Structural conclusion (reframe the score)
- Score gauge (one number with band)

**Elements that do NOT belong in executive first-load:**
- Governance ribbon (checkboxes)
- Reconciliation epoch charts
- Debt exposure metrics
- Propagation gate details
- Confidence distribution breakdowns
- Per-domain correspondence tables
- Evidence trace hashes
- Signal raw values without interpretation

## Investigation Cognition (Investigation View)

**Purpose:** Interrogate claims. Answer: "How can I verify this?"

**Elements that belong:**
- Evidence trace (hashes, derivation chains)
- Signal stack (raw values with confidence)
- Governance ribbon (pass/fail verification)
- Trace continuity table (value → source → authority)
- Evidence topology visualization (claim → signal → zone → artifact)
- Reading guide (concept explanations)
- Term decode table (terminology translations)
- Per-domain correspondence detail
- Uncertainty declaration (explicit unknowns)
- Inference prohibition (explicit and prominent)

**Elements that do NOT belong in investigation:**
- Decision posture hero (that's the executive's job)
- Narrative storytelling (investigation reads data, not stories)
- SQO journey narrative (investigation traces claims, not journeys)

---

# 11. EXPLICIT GUIDANCE

## Topology

Topology is tier1 executive intelligence. It is NOT detail. The visualization should be readable in 5 seconds: domain columns, one highlighted pressure zone, grounding indicators. Interactive in NEXTGEN (hover, click) but the static view must communicate the structural shape without interaction.

## Storytelling

The narrative is the editorial spine of the Intelligence View. It is NOT a sidebar. The executive reads the narrative and builds understanding. Topology SUPPORTS the narrative — it gives the story a visual anchor. The narrative answers "what does this mean?" and the topology shows "what does it look like?"

## Narrative Hierarchy

Decision View → Intelligence View → Investigation View. This is how executives consume intelligence: scan → understand → interrogate. Each view answers ONE question and stops. The system stops where its evidence stops and says so explicitly.

## Signal Interpretation

Signals TELL STORIES. "Fan-In Concentration is statistically abnormal at 5.663 in backend_app_root — co-present with Fan-Out and Responsibility signals in the same pressure zone." NOT: "PSIG-001: 5.663 HIGH". The interpretation prose is deterministic — it's assembled from signal data, attribution, and co-presence. It's not AI-generated opinion.

## Governance Visibility

Governance is AMBIENT, not DECLARATIVE. The static reports expressed governance through: what the surface refuses to show, where the surface stops, how claims are traced. NEXTGEN should do the same. The GovernanceRibbon is an analyst verification tool, not an executive reassurance badge. Inference prohibition is a footer notice. Qualifier language is woven into the narrative.

## Evidence Cognition

Evidence is the foundation. The executive does not need to see evidence directly — they need to see INTELLIGENCE derived from evidence. The analyst needs to see evidence directly — they need to trace and verify. Evidence belongs in Investigation View. Intelligence derived from evidence belongs in Intelligence View. The decision derived from intelligence belongs in Decision View.

## Qualification Cognition

SQO qualification is executive intelligence when expressed as narrative: "You are at S2. 15 debt items remain. The primary blocker is X." SQO qualification is operational machinery when expressed as metrics: debt counts, gate status, progression percentages, workflow stages. The executive face lives in LENS. The operational face lives in the SQO Cockpit.

---

# 12. RECOMMENDED FIRST IMPLEMENTATION STREAM

**Stream 3B.01: Decision View Restoration**

This is the recommended first implementation stream because:

1. **It establishes product direction.** If the BOARDROOM persona delivers the static Decision Surface experience, the product is definitively an executive intelligence surface. Every subsequent stream builds on this foundation.

2. **It's the smallest scope.** It touches DeclarationZone (18 lines), disclosure shell BOARDROOM suppression logic, and CSS. No complex zone restructuring. No payload changes.

3. **It's independently valuable.** Even without the other streams, a working Decision View gives executives the 10-second scan. One word. One number. One split.

4. **It's independently testable.** Switch to BOARDROOM persona. Does it show posture, rationale, boundary, score, and navigation? Does it suppress metrics? Does it match the static Decision Surface cognitive outcome?

5. **It proves the thesis.** If NEXTGEN can deliver the Decision Surface experience within the existing disclosure shell, it proves the recovery roadmap is correct: the architecture works, the data is there, the gap is editorial.

**Suggested stream ID:** PI.LENS.V2.PHASE3B.DECISION-VIEW-RESTORATION.01

---

# 13. AMOps / VAULT COMPATIBILITY ASSESSMENT

## Compatibility: CONFIRMED

**Phase 3B streams are all G2 (architecture-consuming).** They consume the architectural mutations from REALIGNMENT.01 without introducing new architectural concepts. No vault propagation is required from Phase 3B implementation streams.

**REALIGNMENT.01 vault propagation remains DEFERRED.** The G1 mutations (phase split, persona alignment, topology reclassification, SQO dual-face, governance repositioning) were documented in the mutation delta but vault files were not updated. When Phase 3B implementation begins delivering on these mutations, a vault synchronization stream should formalize the updates. This can be a lightweight G1 stream after Phase 3B Wave 1 (3B.01 + 3B.02) completes, when the mutations are proven in running code.

**Terminology impact:** The roadmap introduced working terminology (Decision View, Intelligence View, Investigation View) as persona-alignment labels, not as locked canonical terms. These should be assessed for terminology lock status AFTER Phase 3B Wave 1 proves them in implementation. Premature terminology locking adds governance overhead without product value.

**AMOps lifecycle:** The planning stream (this document) and the roadmap stream (REALIGNMENT.01) together form the BOOTSTRAP + PREFLIGHT for Phase 3B execution. Implementation streams perform EXECUTION. Vault synchronization performs POST-FLIGHT. This is the standard AMOps lifecycle — no modifications required.
