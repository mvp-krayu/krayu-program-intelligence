# Frontend Implementation Plan — LENS NextGen Executive Intelligence Reports

**Stream:** PI.LENS.NEXTGEN-REPORTS.FRONTEND-IMPLEMENTATION-PLANNING.01  
**Document type:** FRONTEND IMPLEMENTATION PLAN  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Upstream bridge:** PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01 (4e2a9e2)  
**Upstream schema:** PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01 (e588150)  
**Upstream normalization:** PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01 (775d7c1)  
**Upstream explainability:** PI.LENS.NEXTGEN-REPORTS.EVIDENCE-PANEL-ARCHITECTURE.01 (b1f0e9f)  
**Upstream UI:** PI.LENS.NEXTGEN-REPORTS.PROFESSIONAL-UI.01 (e9797d1)  
**Execution mode:** CREATE_ONLY — planning only; no code implemented  

---

## 1. Executive Summary

This document is the governed frontend implementation plan for LENS NextGen Executive Intelligence Reports. It translates the completed Phase 2 architecture stack into an executable sequence that implementation streams can follow without ambiguity.

Implementation planning is the final pre-code architecture gate. It exists because implementation without a governed plan produces components that violate boundaries, leak abstractions, and drift from the intelligence contracts they are meant to render. This plan prevents that drift by defining, in advance, what each component is allowed to know, what it is allowed to do, and what it must never do.

The current frontend — `app/execlens-demo/` (Next.js) with PoC components — will be extended, not replaced. The existing PoC component structure is preserved. New governed components are introduced alongside it, consuming the new report_object contract.

No code is implemented in this stream. This is a planning document.

---

## 2. Scope and Non-Scope

### 2.1 In Scope

| Item | Description |
|------|-------------|
| Component boundary plan | What each component receives, renders, and is forbidden from doing |
| Rendering adapter plan | How report_object fields are transformed for component consumption |
| Module composition plan | How regions and modules compose into reports |
| Explainability rendering plan | How the 7-panel bundle renders in Phase 2 |
| Progressive disclosure plan | How expand/collapse state is managed |
| State boundary plan | What constitutes display state vs intelligence state |
| Migration strategy | How current HTML reports are bridged to the new architecture |
| Implementation sequencing | Ordered steps with dependencies and validation gates |
| Governance guardrails | What the frontend must never do, enforced at component level |
| Gate-1 readiness criteria | What must pass before Phase 2 is declared implementation-ready |

### 2.2 Out of Scope

| Item | Reason |
|------|--------|
| Code implementation | Next stream: FRONTEND-INPUT-VALIDATION.01, RENDERING-ADAPTERS.01, etc. |
| CSS authoring | Design system implementation is a separate contract |
| API routes | Adapter layer is pure function; API routes defined separately |
| Test authoring | Defined in PHASE-2-GATE-1.01 |
| GEIOS pipeline changes | Normalization is GEIOS-side; this plan is LENS-side only |
| report_object schema changes | Schema is locked at e588150; no changes permitted here |
| New normalization rules | Normalization layer is complete at 775d7c1 |

---

## 3. Frontend Governance Principles

### 3.1 The Frontend Is a Rendering Shell

The LENS frontend is a governed rendering shell. Its obligations are:

1. **Load** the report_object from the committed source
2. **Validate** renderability (BridgeValidator equivalent)
3. **Adapt** report_object fields into display-ready structures (adapters)
4. **Compose** adapted structures into governed intelligence modules
5. **Render** modules according to visual semantics contracts
6. **Manage** display state (expand/collapse) without touching evidence

The frontend does not:
- derive intelligence
- normalize text
- generate narrative
- compute readiness states
- reinterpret qualifiers
- supplement missing evidence
- call AI systems at render time
- call RAG systems at render time
- modify the report_object in any field

### 3.2 No-Computation Rule

No component in the rendering layer may perform computation on intelligence values:

| Forbidden Computation | Reason |
|-----------------------|--------|
| Re-deriving readiness from signals | readiness_state is immutable from report_object |
| Computing qualifier from evidence | qualifier_class is immutable from report_object |
| Generating ALI labels from raw keys | ALI is applied at generation; LENS receives pre-aliased values |
| Computing grounding percentage | Grounding scope is committed in evidence_blocks[].grounding_status |
| Computing propagation paths | propagation_path is committed in trace_block |
| Sorting domains by computed pressure | Sort by committed propagation_role; no pressure recomputation |

### 3.3 Display-State-Only Rule

The only mutable state a component may manage is display state:

| Allowed Display State | Forbidden Equivalent |
|----------------------|---------------------|
| panel open/closed | panel content |
| drawer expanded/collapsed | evidence content |
| tooltip visible/hidden | tooltip text |
| audience tier at session init | audience tier after session init |
| scroll position | rendered content |

Display state changes must be ephemeral in Phase 2 (no session persistence). Display state changes must not alter the committed report_object.

### 3.4 Governance Guardrails at Component Level

Every component in the rendering layer must enforce:

| Guardrail | Mechanism |
|-----------|----------|
| No raw signal keys in display | components receive adapter output, not raw report_object fields |
| No qualifier suppression | QualifierChip is always rendered when qualifier_class ≠ Q-00 |
| No blocked-state silent degradation | BlockedState component is mandatory path for blocked inputs |
| No diagnostic-state silent degradation | DiagnosticState component is mandatory path for diagnostic inputs |
| No GEIOS internal label exposure | adapters strip internal identifiers; vocabulary contract enforced |
| No free-form input fields | no `<input>` or `<textarea>` in any Phase 2 component |
| No AI generation triggers | no component calls an AI service endpoint |
| Topology read-only | TopologySummary has no edit/flag/correct affordances |

---

## 4. Current Frontend Assumption Review

### 4.1 Current State: app/execlens-demo

The existing frontend is a PoC Next.js application at `app/execlens-demo/`. Current components:

| Existing Component | Current Role | NextGen Relationship |
|-------------------|-------------|---------------------|
| `ExecutivePanel.js` | Renders executive summary (PoC) | Superseded by governed NarrativeBlock + IntelligenceSummary |
| `EvidencePanel.js` | Renders evidence (PoC) | Superseded by governed EvidencePanel + EvidenceDrawer |
| `SignalGaugeCard.js` | Signal card with gauge (PoC) | Superseded by governed SignalCard (no gauge — PUI-GOV-08) |
| `TopologyPanel.js` | Topology visualization (PoC) | Superseded by TopologySummary placeholder (Phase 2); full activation Phase 3+ |
| `NavigationPanel.js` | Navigation (PoC) | Preserved or adapted into workspace navigation shell |
| `DemoController.js` | Demo flow control (PoC) | Superseded by ReportContainer + ProgressiveDisclosureController |
| `TemplateRenderer.js` | HTML template rendering (PoC) | Superseded by governed module rendering pipeline |
| `QuerySelector.js` | Demo query selection (PoC) | Not part of governed report path |
| `LandingGaugeStrip.js` | Landing gauge display (PoC) | Not part of governed report path |

### 4.2 Current Report Generation

`scripts/pios/lens_report_generator.py` produces HTML reports from ZONE-2 projection payloads. This script:

- Pulls data from API or fragment files
- Applies inline HTML generation
- Does not consume a report_object.schema.json governed contract
- Does not apply ALI-01..07 normalization
- Does not produce explainability panels
- Does not produce a sealed evidence_object_hash

**Relationship to NextGen:** The report generator is a GEIOS-side concern. The frontend plan does not modify it. The NextGen rendering pipeline consumes the new report_object (to be produced by a future GEIOS-side upgrade). The existing HTML output path remains operational during migration.

### 4.3 Migration Strategy

Phase 2 NextGen and the existing HTML report path coexist during migration:

```
MIGRATION MODEL:

Existing path (preserved):
  lens_report_generator.py → HTML artifact → browser

New NextGen path (added alongside):
  GEIOS pipeline → report_object.json → report_object validator
                → rendering adapters → NextGen component tree → browser

Transition gate:
  NextGen path reaches Gate-1 pass → NextGen path becomes primary
  Existing HTML path preserved as fallback during transition
  Decommission decision: separate stream after Gate-1
```

No existing files are modified to establish the new path. The new path is additive.

---

## 5. Target Frontend Architecture

### 5.1 Architecture Layers

```
LAYER 0 — INPUT:
  report_object.json (from GEIOS bridge)
  Audience tier (from session)

LAYER 1 — VALIDATION:
  ReportObjectValidator
  - verifies evidence_object_hash
  - verifies governance_verdict
  - verifies schema against report_object.schema.json
  - routes: VALID → render path; INVALID → blocked path

LAYER 2 — ADAPTER:
  Rendering adapters (14 adapters)
  - transform report_object fields into display-ready structures
  - enforce vocabulary contract (no raw GEIOS identifiers in output)
  - apply audience tier filtering
  - produce typed display objects for components

LAYER 3 — COMPONENT:
  Governed React components (16 component families)
  - receive adapter outputs only
  - manage display state only
  - enforce visual semantics from visual_semantics_registry.json
  - apply design tokens from governance token system

LAYER 4 — LAYOUT:
  ReportContainer + progressive disclosure
  - composes component tree according to executive_rendering_system.json
  - manages region composition (7 regions)
  - applies density class per audience tier
  - manages BLOCKED / DIAGNOSTIC / EXPANDED / COLLAPSED panel states

LAYER 5 — OUTPUT:
  Executive intelligence report (browser)
  - deterministic rendering
  - evidence-first display
  - explainability accessible
  - qualifiers preserved
```

### 5.2 Technology Stack

The NextGen frontend builds on the existing Next.js stack at `app/execlens-demo/`:

| Layer | Technology | Constraint |
|-------|-----------|-----------|
| Framework | Next.js (existing) | No framework change required |
| Component library | React (existing) | Governed component boundaries added |
| Styling | CSS Modules or Tailwind (existing) | Design token system added on top |
| State | React state / Context (existing) | Display state only; no intelligence state |
| Data | report_object.json (new) | No AI calls; no RAG calls at render time |
| Routing | Next.js routing (existing) | Report route added |

### 5.3 File Path Ownership Plan

| Path | Purpose | Governance |
|------|---------|-----------|
| `app/execlens-demo/components/nextgen/` | New governed components | CREATE_ONLY; no PoC files modified |
| `app/execlens-demo/adapters/` | Rendering adapters | CREATE_ONLY |
| `app/execlens-demo/validators/` | Input validators | CREATE_ONLY |
| `app/execlens-demo/tokens/` | Design token definitions | CREATE_ONLY |
| `app/execlens-demo/pages/report/[report_id].js` | NextGen report route | CREATE_ONLY |
| `app/execlens-demo/components/` (existing) | PoC components (preserved) | NOT MODIFIED |
| `scripts/pios/lens_report_generator.py` | Existing HTML generator | NOT MODIFIED |

All new files are in new directories. No existing files are modified during implementation.

---

## 6. Report Object Loading Model

### 6.1 Loading Contract

The report_object is the single source of truth for all rendering:

```
LOADING SEQUENCE:

1. FETCH
   Load report_object.json from source path
   (Fragment file, API response, or static artifact)

2. PARSE
   JSON.parse report_object
   If parse fails → render parse error notice (non-intelligence error)

3. SCHEMA VALIDATE
   Validate against report_object.schema.json
   If schema fail → render validation error notice

4. BRIDGE VALIDATE
   Verify evidence_object_hash (BridgeValidator)
   Verify governance_verdict
   If hash fail or governance FAIL → route to BlockedState render path

5. AUDIENCE FILTER
   Apply audience tier from session
   Filter field visibility per tier

6. ADAPTER PIPELINE
   Pass validated report_object through adapter pipeline
   Adapters produce display-ready structures

7. COMPOSE
   ReportContainer composes adapter outputs into governed component tree
```

### 6.2 Source Flexibility

The loading layer is source-agnostic. The report_object may be sourced from:

| Source | Phase | Notes |
|--------|-------|-------|
| Static JSON file (fragment) | Phase 2 | Existing fragment directory; no API required |
| API route (`/api/report/[id]`) | Phase 2+ | Server-side delivery |
| Workspace registry | Phase 3+ | Workspace shell resolves report_object |

The loading layer does not care about the source. It receives a parsed JSON object and validates it.

### 6.3 Caching and Immutability

Once loaded and validated:

- The report_object is immutable for the lifetime of the render session
- No component may request a "refreshed" version mid-session (Phase 2)
- No component may write to the report_object
- The same report_object produces identical rendering on re-load (NORM-DET-01)

---

## 7. Rendering Adapter Model

### 7.1 Adapter Principle

Adapters transform structure. Adapters do not transform meaning.

```
ALLOWED ADAPTER TRANSFORMATIONS:
- field selection (pick relevant fields for a component)
- field renaming (internal alias → display prop name)
- audience filtering (remove fields not visible at current tier)
- null safety (supply default display for absent optional fields)
- format normalization (timestamps → display date format)
- type casting (string enum → typed constant)

FORBIDDEN ADAPTER TRANSFORMATIONS:
- recomputing readiness_state from signal values
- reinterpreting qualifier_class
- generating display text not present in report_object
- applying ALI rules (already applied at generation)
- supplementing missing evidence
- decoding hash values
- modifying any governance-protected field
```

### 7.2 Adapter → Component Data Flow

Each adapter produces a typed display object consumed by one or more components:

```
report_object
  → ReadinessBadgeAdapter    → ReadinessBadge + QualifierChip
  → NarrativeAdapter         → IntelligenceSummary + NarrativeBlock
  → EvidencePanelAdapter     → EvidencePanel
  → EvidenceDrawerAdapter    → EvidenceDrawer (per domain)
  → SignalCardAdapter        → SignalCard (per signal)
  → TracePanelAdapter        → TracePanel
  → ExplainabilityBundleAdapter → ExplainabilityBundle (7 panels)
  → BlockedStateAdapter      → BlockedState (if validation fails)
  → DiagnosticStateAdapter   → DiagnosticState (if diagnostic conditions)
  → AuditLineageAdapter      → AuditLineage (Advisory/Audit tier)
  → TopologySummaryAdapter   → TopologySummary (Phase 3+ active; placeholder Phase 2)
```

See `rendering_adapter_plan.md` for complete per-adapter specification.

---

## 8. Component Boundary Model

### 8.1 Boundary Principle

Each component in the rendering layer has a strictly defined input contract:

- **Input:** typed display object from adapter layer (never raw report_object)
- **Output:** rendered JSX (display only)
- **State:** display state only (open/closed, expanded/collapsed)
- **Side effects:** none (no API calls, no AI calls, no evidence mutation)

See `component_boundary_model.json` for complete per-component specification.

### 8.2 Component Family Overview

| Family | Purpose | Input Source |
|--------|---------|-------------|
| ReportContainer | Root container; composes all regions | Validated report_object + audience tier |
| ExecutiveHeader | REGION_EXECUTIVE_HEADER composition | ReadinessBadge adapter output |
| ReadinessBadge | State label + qualifier chip | ReadinessBadgeAdapter output |
| QualifierChip | Qualifier display with tooltip | QualifierChipAdapter output |
| IntelligenceSummary | REGION_INTELLIGENCE_SUMMARY | NarrativeAdapter output |
| NarrativeBlock | Executive summary + WHY section | NarrativeAdapter output |
| EvidencePanel | REGION_EXPLAINABILITY evidence surface | EvidencePanelAdapter output |
| EvidenceDrawer | Per-domain evidence drawer | EvidenceDrawerAdapter output |
| SignalCard | Per-signal card within drawer | SignalCardAdapter output |
| TracePanel | Propagation path + lineage | TracePanelAdapter output |
| ExplainabilityBundle | 7-panel explainability bundle | ExplainabilityBundleAdapter output |
| TopologySummary | Topology region (Phase 3+ active) | TopologySummaryAdapter output |
| DiagnosticState | Diagnostic notice rendering | DiagnosticStateAdapter output |
| BlockedState | Blocked notice rendering | BlockedStateAdapter output |
| AuditLineage | REGION_LINEAGE + REGION_AUDIT | AuditLineageAdapter output |
| ProgressiveDisclosureController | Display state management | Display state only |

---

## 9. Module Composition Model

### 9.1 Region Composition Order

ReportContainer composes regions in the following order, per `executive_rendering_system.json`:

```
ReportContainer
  ├── ExecutiveHeader          [REGION_EXECUTIVE_HEADER]
  │   ├── ReadinessBadge
  │   └── QualifierChip (if qualifier active)
  ├── DiagnosticState          [REGION_DIAGNOSTIC — conditional]
  ├── IntelligenceSummary      [REGION_INTELLIGENCE_SUMMARY]
  │   └── NarrativeBlock
  ├── EvidencePanel            [REGION_EXPLAINABILITY]
  │   ├── ExplainabilityBundle
  │   │   ├── WHY panel
  │   │   ├── EVIDENCE panel → EvidenceDrawer[] → SignalCard[]
  │   │   ├── QUALIFIERS panel
  │   │   ├── CONFIDENCE panel
  │   │   ├── READINESS_STATE panel
  │   │   ├── TRACE panel → TracePanel
  │   │   └── LINEAGE panel → AuditLineage
  │   └── ProgressiveDisclosureController
  ├── TopologySummary          [REGION_TOPOLOGY — Phase 3+]
  ├── AuditLineage             [REGION_LINEAGE]
  └── AuditLineage (full)      [REGION_AUDIT — audience gated]
```

### 9.2 Density Class Application

ReportContainer receives the density class from the audience tier:

| Audience Tier | Density Class Applied |
|--------------|----------------------|
| EXECUTIVE | EXECUTIVE_DENSE |
| ADVISORY | INVESTIGATION_DENSE |
| AUDIT | AUDIT_DENSE |

Density class determines which panels default to EXPANDED vs COLLAPSED. It does not alter content.

### 9.3 Blocked vs Diagnostic Routing

ReportContainer performs governance routing before composing the module tree:

```
IF validation_result.hash_valid = false OR validation_result.governance_verdict = FAIL:
  → render BlockedState for all intelligence regions
  → render AuditLineage only if audience_tier = AUDIT

ELSE IF validation_result.diagnostic = true:
  → render DiagnosticState banner
  → render normal module tree with diagnostic indicators on affected panels

ELSE:
  → render normal module tree
```

This routing happens at container level, before any child component renders.

---

## 10. Explainability Rendering Model

### 10.1 Bundle Rendering

The ExplainabilityBundle component receives the full explainability bundle from ExplainabilityBundleAdapter. It renders all 7 panels in order, applying default states per density class:

| Panel | Phase 2 Rendering | Default State (Executive) |
|-------|-----------------|--------------------------|
| WHY | Inline section | EXPANDED |
| EVIDENCE | Accordion per domain | COLLAPSED (expand on click) |
| QUALIFIERS | Inline section | EXPANDED if qualifier active |
| CONFIDENCE | Inline section | COLLAPSED |
| READINESS_STATE | Inline section | EXPANDED |
| TRACE | Inline section | COLLAPSED (Advisory+) |
| LINEAGE | Inline section | COLLAPSED (Advisory+) |

### 10.2 BLOCKED Panel Rendering

When a panel is in BLOCKED state:

```jsx
// Pseudocode — not implementation
<PanelContainer panelId="WHY" state="BLOCKED">
  <BlockedState reason={blockedReason} auditAccess={audience >= ADVISORY} />
</PanelContainer>
```

BlockedState renders the blocked notice and optionally the audit trace access affordance. The panel header is still rendered (title visible); the body is the blocked notice.

### 10.3 Evidence Drawer Rendering

EvidenceDrawer receives a single domain's adapter output and renders:

1. Drawer header: domain alias + grounding chip (always visible)
2. Expand affordance (click to open)
3. When expanded: SignalCard[] + propagation role + evidence summary
4. No computation at expand time — content is pre-rendered in adapter output

### 10.4 Qualifier Chip Rendering

QualifierChip always renders when qualifier_class ≠ Q-00. It is never optional, never suppressed. For Q-04, an absence notice section replaces the chip.

The chip tooltip is the pre-rendered Q-taxonomy text from the qualifier_object in the adapter output — not generated at render time.

---

## 11. Progressive Disclosure Model

### 11.1 ProgressiveDisclosureController

The ProgressiveDisclosureController is a pure display-state manager:

- Maintains an in-memory map: `{panel_id: 'COLLAPSED' | 'EXPANDED'}`
- Initializes from density class defaults
- Updates on user interaction (click/tap)
- Broadcasts state to ExplainabilityBundle children via context
- Does not alter report_object content
- Does not persist state in Phase 2 (ephemeral)

### 11.2 Interaction to State Change

```
USER CLICKS domain drawer header
  → ProgressiveDisclosureController toggles drawer state
  → EvidenceDrawer re-renders with new display state
  → content unchanged; only visibility changes

USER CLICKS "View Analysis Trace"
  → ProgressiveDisclosureController sets TRACE panel → EXPANDED
  → TracePanel renders with committed content
  → No data fetched; no computation performed
```

### 11.3 Blocked Panel Interaction

Panels in BLOCKED state do not respond to expand/collapse interactions:

```
USER CLICKS blocked panel header
  → ProgressiveDisclosureController ignores interaction
  → BlockedState remains; no content revealed
  → Audit trace access available if audience_tier ≥ ADVISORY
```

---

## 12. State Boundary Model

### 12.1 Intelligence State vs Display State

The critical state boundary:

| State Category | Owner | Mutable? | Who Controls |
|---------------|-------|----------|-------------|
| readiness_state | report_object | IMMUTABLE | GEIOS (at generation) |
| qualifier_class | report_object | IMMUTABLE | GEIOS (at generation) |
| evidence_object_hash | report_object | IMMUTABLE | GEIOS (at generation) |
| governance_verdict | report_object | IMMUTABLE | GEIOS (at generation) |
| panel_state (open/closed) | ProgressiveDisclosureController | MUTABLE | User interaction |
| drawer_state (expanded/collapsed) | ProgressiveDisclosureController | MUTABLE | User interaction |
| tooltip_state (visible/hidden) | Individual component | MUTABLE | Hover/focus |
| audience_tier | Session | IMMUTABLE after init | Session initialization |
| density_class | Derived from audience_tier | IMMUTABLE | Session initialization |

### 12.2 What Components May Not Store in State

| Forbidden State | Why |
|----------------|-----|
| Computed readiness | readiness_state is immutable from report_object |
| Supplemented evidence | evidence cannot be augmented at render time |
| AI-generated text | no AI calls at render time |
| User annotations on evidence | evidence is immutable |
| Modified qualifier | qualifier_class is immutable |
| Elevated audience tier | audience_tier is session-locked |

---

## 13. Blocked and Diagnostic Rendering

### 13.1 BlockedState Component

BlockedState receives BlockedStateAdapter output and renders:

- Headline: "Readiness classification unavailable"
- Reason: governance verdict FAIL or evidence_object_hash failure
- Audit access affordance (Advisory/Audit tier)
- Visual treatment: `token-blocked` design token
- No retry, no regenerate, no "contact us" link in report surface

BlockedState is the mandatory render path when:
- `evidence_object_hash` is absent or fails verification
- `governance_verdict = FAIL`

There is no code path that renders intelligence content from a failed report_object.

### 13.2 DiagnosticState Component

DiagnosticState receives DiagnosticStateAdapter output and renders:

- Banner: "This report contains content under advisory review. Advisory confirmation recommended."
- Visual treatment: `token-diagnostic`
- Affected panel indicators (diagnostic border on relevant panels)
- Intelligence content still renders (diagnostic frame, not blocked)

DiagnosticState is rendered alongside the normal module tree, not instead of it.

### 13.3 Suppression Notice

When qualifier_class = Q-04, the QualifierChip absence notice renders in the QUALIFIERS panel:

- "Signal intelligence withheld from this view."
- Absence notice section: first-class element in QUALIFIERS panel
- Not a tooltip, not a footnote — a rendered section

---

## 14. HTML Compatibility and Migration

### 14.1 HTML Report Preservation

The existing HTML report path (`lens_report_generator.py → HTML artifact`) is not modified. It continues to operate during the NextGen migration period.

### 14.2 Migration Transition Model

```
PHASE 2 MIGRATION STATE:

HTML path: OPERATIONAL (unchanged)
  lens_report_generator.py → HTML artifact → browser

NextGen path: ADDITIVE (new; does not replace HTML during Gate-1)
  report_object.json → validator → adapters → NextGen components → browser

Gate-1 pass: NextGen path renders equivalent intelligence at higher fidelity
  → Decision point: NextGen path becomes primary delivery mechanism
  → HTML path decommission: separate stream after Gate-1

Migration governance:
  - No existing component files modified during NextGen implementation
  - New components in app/execlens-demo/components/nextgen/
  - New adapters in app/execlens-demo/adapters/
  - New validators in app/execlens-demo/validators/
  - No breaking changes to existing routes
```

### 14.3 Non-Regression Strategy

During implementation, a non-regression test verifies:

- The existing HTML report route continues to render correctly
- No existing PoC component is broken by new NextGen additions
- New report route does not conflict with existing routing
- Design tokens do not override existing PoC component styles

Non-regression validation is a Gate-1 criterion.

---

## 15. Implementation Sequencing

Implementation follows a strict dependency order. See `implementation_sequence.md` for the complete per-step specification.

| Step | Name | Gate |
|------|------|------|
| 1 | Frontend input validation layer | Blocks steps 2–15 |
| 2 | Rendering adapter layer | Blocks steps 3–15 |
| 3 | Core report container | Blocks steps 4–15 |
| 4 | Executive header + readiness badge | Blocks step 5 |
| 5 | Qualifier chip system | — |
| 6 | Narrative and intelligence summary | — |
| 7 | Evidence panel + evidence drawer | Blocks step 8 |
| 8 | Signal card system | — |
| 9 | Trace panel + audit lineage | — |
| 10 | Progressive disclosure controller | Blocks steps 7–9 in practice |
| 11 | Topology summary placeholder | — |
| 12 | Blocked and diagnostic states | — |
| 13 | HTML compatibility bridge | Non-regression gate |
| 14 | Phase 2 validation suite | Gate-1 prerequisite |
| 15 | Gate-1 readiness assessment | Gate-1 pass/fail |

---

## 16. Validation Gates

### 16.1 Implementation-Level Gates

Each implementation step has its own validation requirement (see `implementation_sequence.md`).

### 16.2 Gate-1 Criteria — Phase 2 Readiness

Gate-1 defines the minimum bar for Phase 2 to be declared implementation-ready:

| Criterion | Requirement |
|-----------|-------------|
| Report object loads | report_object.json loads and validates against schema |
| Bridge validation passes | evidence_object_hash verified; governance_verdict honored |
| Readiness badge renders | Correct ALI-03 label; correct design token; qualifier chip present |
| Qualifier rendering correct | Q-00..Q-04 chip styles per VIS-QUAL-01; Q-04 absence notice present |
| Executive summary renders | Full text; vocabulary contract enforced; no raw identifiers |
| WHY section renders | Pre-rendered content; qualifier notice present when applicable |
| Evidence drawers open | All domains present; domain alias; grounding chip; signal cards |
| Signal cards render | ALI-01/02 labels; pressure tier label; qualifier chip |
| BLOCKED state renders | Explicit notice; no intelligence content; audit access (Adv+) |
| DIAGNOSTIC state renders | Explicit banner; content still visible; advisory notice present |
| Q-04 suppression renders | Absence notice rendered; never silently absent |
| No raw GEIOS identifiers visible | Vocabulary contract enforced end-to-end |
| No AI call in render path | No AI service endpoint called during report rendering |
| Non-regression passed | Existing HTML report path renders correctly |
| Evidence immutability preserved | No report_object field modified by any component |

Gate-1 pass enables PI.LENS.NEXTGEN-REPORTS.PHASE-2-GATE-1.01 sign-off.

---

## 17. Governance Preservation

### 17.1 Frontend Governance Rules

| Rule | Requirement | Enforcement Mechanism |
|------|-------------|----------------------|
| FIP-GOV-01 | Frontend is rendering shell only | Component boundary model enforced |
| FIP-GOV-02 | No component derives intelligence | Adapter layer is the only transformation layer |
| FIP-GOV-03 | No AI calls at render time | No AI SDK imports in component or adapter files |
| FIP-GOV-04 | No GEIOS identifiers exposed | Adapter output vocabulary enforced by adapter contracts |
| FIP-GOV-05 | Qualifier suppression impossible | QualifierChip is mandatory render path for Q-01..03 |
| FIP-GOV-06 | Blocked state explicit | BlockedState is mandatory render path for failed validation |
| FIP-GOV-07 | Evidence immutable | Components receive adapter output; no report_object access |
| FIP-GOV-08 | Display state ephemeral | No session persistence in Phase 2 |
| FIP-GOV-09 | Topology read-only | TopologySummary has no edit affordances |
| FIP-GOV-10 | Deterministic rendering | Same report_object → same output; no stochastic rendering |

### 17.2 Phase 2 Frontend Restrictions

| Restriction | Status |
|------------|--------|
| No conversational UI surfaces | ABSENT — no input fields, no AI chat pane |
| No free-form query | ABSENT — no text input elements |
| No AI assistant avatars | ABSENT — no AI persona elements |
| No probabilistic confidence display | ABSENT — VIS-PRESS-01; no percentage displays |
| No topology editing | ABSENT — TopologySummary is placeholder or read-only display |
| No INVESTIGATION_ENTRY interaction | REGISTERED but inactive |
| No COPILOT_ENTRY interaction | REGISTERED but inactive |
| No session-persistent display state | ABSENT — ephemeral only |

---

*Stream PI.LENS.NEXTGEN-REPORTS.FRONTEND-IMPLEMENTATION-PLANNING.01 — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
