# GEIOS–LENS Productization Bridge

**Stream:** PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01  
**Document type:** PRODUCTIZATION BRIDGE ARCHITECTURE — EXECUTABLE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Upstream authority:** PI.LENS.GEIOS.STRATEGIC-PRODUCTIZATION-MISSION.01 (a80d5c6)  
**Execution mode:** CREATE_ONLY  
**Implementation target:** Phase 2 — Interactive Executive Intelligence Reports  

---

## 1. Executive Summary

### 1.1 Purpose of the Bridge

The GEIOS–LENS Productization Bridge is the formal architectural contract that defines how governed intelligence outputs produced by the GEIOS substrate are translated into executive-accessible product surfaces rendered by LENS.

Without this bridge, GEIOS is an architecturally complete but unexposed substrate. Without this bridge, LENS is a PoC renderer producing HTML artifacts of unrealized intelligence depth. The bridge closes this gap by defining:

- the boundary between substrate and product surface
- the data contracts that cross that boundary
- the rendering pipeline that transforms governed artifacts into intelligence modules
- the interaction surfaces that expose explainability without exposing internals
- the composition model that makes reports workspace-compatible

### 1.2 Why the Bridge Exists

The bridge exists because the GEIOS substrate architecture and the LENS product architecture are **intentionally different concerns** that must never collapse into each other:

- GEIOS operates in the domain of **governed structural truth** — deterministic derivation, replay-safe artifacts, topology-bound evidence, governance enforcement
- LENS operates in the domain of **executive experience** — readability, navigation, explainability, trust, interaction

These two concerns must be connected by a contract, not merged by convenience. The bridge is that contract.

### 1.3 Immutable Architectural Principle

> **GEIOS is the governed intelligence substrate. LENS is the executive interaction shell.**

This principle governs every decision in this document. Any design choice that causes GEIOS to become a visible product surface is a violation. Any design choice that causes LENS to become a computation layer is a violation. The bridge defines exactly what crosses the boundary and in what form.

### 1.4 Strategic Implementation Goal

The immediate implementation goal is **Phase 2: Interactive Executive Intelligence Reports**.

Phase 2 transforms the current HTML artifact delivery model into a structured intelligence module delivery model. The transformation is conservative by design:

- No new AI interaction surfaces
- No agent or copilot exposure
- No free-form query capability
- No architectural rework of the existing pipeline
- No modification of any DPSIG derivation logic

Phase 2 adds: professional rendering, cognitive normalization integration, pre-rendered explainability panels, readiness badge surfaces, and workspace-compatible module structure.

### 1.5 Phased Activation Rationale

The bridge is designed to support Phase 2 immediately while remaining extensible to Phases 3–6 without architectural rework. The workspace evolution model (§11) defines the progressive composition structure. Each future phase activates additional bridge capabilities — but the bridge data contracts defined here are stable across all phases. Implementation streams for later phases extend the bridge; they do not replace it.

---

## 2. Current State Analysis

### 2.1 Current LENS State

LENS in its current form is a **PoC-grade delivery mechanism** for governed intelligence artifacts. It produces HTML reports that contain:

- Structural topology analysis
- DPSIG signal derivation summaries
- Readiness classification (as text label)
- Narrative text (pre-normalization)
- Domain and cluster descriptions

These outputs are commercially valuable — they represent genuine governed structural intelligence — but they are delivered in a format that does not match their architectural depth.

| Dimension | Current State |
|-----------|---------------|
| Rendering format | HTML artifact |
| Interactivity | None |
| Explainability exposure | None |
| Cognitive normalization | Not applied |
| Professional design | PoC-grade |
| Workspace integration | Not applicable |
| Module structure | Not defined |
| Evidence panels | Not rendered |
| Qualifier visibility | Not structured |
| Readiness badge | Text label only |

### 2.2 Current Report Architecture

The current report generation flow:

```
Evidence Input
    → Pipeline execution (DPSIG Lane A)
    → Signal derivation (CPI, CFA)
    → Readiness classification
    → Narrative generation (pre-normalization)
    → HTML rendering
    → Delivery (static artifact)
```

The current architecture produces a single HTML document per client run. This document is:
- non-interactive
- non-modular
- non-searchable within a workspace
- not structured around the evidence/intelligence hierarchy
- not governed at the rendering layer

The governing artifacts exist (canonical_topology.json, evidence envelopes, derivation records, readiness states) but are not surfaced in the rendered output in structured form.

### 2.3 Current Rendering Limitations

| Limitation | Impact |
|-----------|--------|
| Single HTML file | Cannot be embedded as workspace object |
| No module boundaries | Cannot selectively render evidence or trace |
| No evidence panels | WHY/EVIDENCE/TRACE not navigable |
| No qualifier rendering | Q-00..Q-04 not visible to client |
| No readiness badge system | Readiness state not visually prominent |
| No normalization layer | Technical labels appear in executive surface |
| No topology visualization | Structural topology not rendered |
| Not modular | Cannot compose multiple intelligence artifacts |

### 2.4 Current Interaction Limitations

The current LENS has no interaction surface. Reports are read-only HTML files. There is:
- No evidence drill-down capability
- No trace panel expansion
- No qualifier tooltip system
- No topology navigation
- No session context

### 2.5 Commercial Strengths to Preserve

Despite the rendering and interaction limitations, the current commercial delivery has genuine strengths that the bridge must not break:

| Strength | Preservation Requirement |
|---------|--------------------------|
| Structural intelligence depth | Report content must not be degraded by rendering changes |
| DPSIG readiness classification | Readiness state must be preserved and made more prominent |
| Evidence provenance | Evidence grounding must be traceable, not hidden |
| Advisory delivery model | Reports remain advisory-led; not autonomous AI delivery |
| Fast generation cycle | Rendering modernization must not slow pipeline |
| Client-specific topology | Intelligence remains client-specific; no generic content |
| Certified certifications | BlueEdge 25/25 PASS; fastapi 27/27 PASS must be maintained |

---

## 3. Target Productization Model

### 3.1 Future Product Shape

The target product shape after Phase 2 is an **Executive Intelligence Module** delivery system:

```
CURRENT:                         TARGET (Phase 2):
─────────────────────────────    ─────────────────────────────────────
HTML file                   →    Intelligence Module
  (static artifact)               (structured, renderable object)
                                  ├── Header Block
                                  │   ├── Readiness Badge
                                  │   └── Scope Indicator
                                  ├── Narrative Block
                                  │   ├── Normalized Executive Summary
                                  │   ├── WHY (primary finding)
                                  │   └── Structural Overview
                                  ├── Evidence Block
                                  │   ├── Evidence Panels (per domain)
                                  │   ├── Signal Cards
                                  │   └── Qualifier Chips
                                  └── Trace Block (collapsed)
                                      ├── Propagation Summary
                                      └── Lineage Reference
```

### 3.2 Intelligence Module Evolution

Intelligence modules are the atomic unit of the LENS product surface. Each module:
- corresponds to one governed analysis output
- is self-contained and renderable independently
- carries its own evidence attachment
- preserves qualifier state
- is workspace-compatible (can be stored, retrieved, composed)

Modules evolve across phases:

| Phase | Module Capability |
|-------|-----------------|
| Phase 2 | Static pre-rendered intelligence module (this bridge) |
| Phase 3 | Workspace-embedded module with expandable explainability sidebar |
| Phase 4 | Investigation-capable module with guided interrogation entry point |
| Phase 5 | Copilot-capable module with conversational evidence exploration |
| Phase 6 | Live-signal module with operational telemetry overlay |

Each phase extends module capability without replacing the Phase 2 module definition.

### 3.3 Workspace Evolution

The workspace emerges from module composition. Phase 2 modules become the building blocks of the Phase 3 workspace. The bridge defines modules as workspace-compatible from Phase 2 — workspace-specific features activate in Phase 3, but the module structure supports them from the start.

### 3.4 Interaction Evolution

Interaction evolves from display-only (Phase 2) to interrogation-capable (Phase 4) to conversational (Phase 5). The interaction injection points defined in this bridge (§8) are present in Phase 2 modules but inactive until their governing phase gate is passed. This prevents phased evolution from requiring module schema changes.

### 3.5 Explainability Evolution

Explainability is core to the product's differentiation. The evolution:

- Phase 2: Explainability is pre-rendered and embedded in the module (static)
- Phase 3: Explainability panels become interactive drawers (expand/collapse)
- Phase 4: Explainability traces to live investigation session context
- Phase 5: Explainability enriched by copilot conversational context

The explainability model defined here (§8) is the foundation for all phases.

### 3.6 Executive Intelligence Positioning

The product positions as **executive structural intelligence** — not AI analytics, not BI dashboards, not chatbot platforms.

The productization principle:

> Reports are not AI-generated summaries. Reports are governed intelligence outputs — structurally derived, evidence-grounded, qualifier-preserved — rendered at executive cognitive standard.

This positioning is the primary commercial differentiator and must be preserved in every design decision.

---

## 4. GEIOS–LENS Boundary Model

### 4.1 What GEIOS Owns (Permanent — Never Exposed Directly)

GEIOS owns all intelligence **production** — from raw topology through to committed governed artifacts:

| GEIOS Layer | What It Owns | LENS Visibility |
|-------------|-------------|-----------------|
| L1 — Deterministic Topology | canonical_topology.json | READ-ONLY reference; never writable |
| L2 — Evidence Derivation | DPSIG signal derivation; SCRIPT_VERSION=1.0 | Output values only; no formula exposure |
| L3 — Semantic Shaping | Domain grounding; ALI source rules | ALI output labels only; no source rules |
| L4 — Prompt Governance | Prompt templates; evidence injection mechanics | None; fully internal |
| L5 — Evidence Injection | Evidence envelope construction; evidence_object_hash | Hash for verification; content for rendering |
| L6 — Cognitive Normalization | ALI-01..07 rules; Q-00..Q-04 taxonomy | Normalized output labels only |
| L7 — Narrative Generation | LLM orchestration; prompt chains | Generated narrative text only |
| L8 — Executive Rendering | Surface mode classification; panel pre-rendering | Pre-rendered content objects |
| L9 — Governance Enforcement | 183 safety rules; validation engine | Validation verdict only (PASS/FAIL) |

**GEIOS internal constructs that NEVER cross the bridge:**
- RAG infrastructure and chunk stores
- Memory layer mechanics
- Orchestration agent identities and task records
- Replay infrastructure details
- Prompt templates and prompt chains
- Derivation formulas and threshold values
- TAXONOMY-01 raw field values: `signal_value`, `activation_state`, `signal_stable_key`, `derivation_hash`
- Governance rule identifiers (AS-01, N-SAF-01, etc.)
- Vector similarity scores
- LLM token counts or model identifiers

### 4.2 What LENS Owns (Permanent — Interaction Surface Only)

LENS owns all intelligence **presentation** — from committed governed artifacts through to executive-visible surfaces:

| LENS Layer | What It Owns |
|------------|-------------|
| Report Object Model | Schema and composition of intelligence modules |
| Module Renderer | Transforms governed artifacts into rendered modules |
| Explainability Surface | WHY/EVIDENCE/TRACE panel rendering |
| Workspace Shell (Phase 3+) | Navigation, session display state, module container |
| Interaction Surface | Expand/collapse, evidence drawer open/close |
| Typography + Design System | Visual rendering of intelligence |
| Readiness Badge System | Q-00..Q-04 surface rendering |

**LENS must NEVER:**
- Recompute or derive signals
- Modify evidence_object_hash or derivation records
- Override readiness state classification
- Introduce new qualifier states not in Q-00..Q-04 taxonomy
- Render inference without a committed evidence artifact
- Modify or correct topology data
- Interpret qualifiers differently than the governance taxonomy defines them

### 4.3 What Remains Hidden (Permanent Substrate)

The following remain permanently hidden from all LENS surfaces:

```
PERMANENTLY HIDDEN:
├── Orchestration architecture (MULTI-AGENT, EXEC-SIG)
├── Agent system (agent types, task delegation, BD-01..10)
├── RAG infrastructure (chunk stores, embedding model, vector index)
├── Memory layer mechanics (7 layers, retention classes, invalidation)
├── Replay infrastructure (replay types, lineage records, replay triggers)
├── Prompt governance (templates, lint rules, injection mechanics)
├── Governance enforcement engine (183 rules, validator identities)
├── Signal derivation formulas (CPI formula, CFA formula, thresholds)
├── TAXONOMY-01 raw fields (signal_value, derivation_hash, etc.)
└── LLM internals (model, temperature, token usage, prompt text)
```

### 4.4 What Becomes Visible (Controlled Bridge Outputs)

These governed outputs cross the bridge and become LENS-renderable:

```
BRIDGE OUTPUTS (Phase 2):
├── Normalized narrative text (cognitive normalization applied)
├── WHY section text (evidence-sourced causal summary)
├── Evidence panel content (per domain, normalized)
├── Signal cards (ALI-01/02 labels, normalized pressure indicator)
├── Qualifier labels (Q-00..Q-04 taxonomy applied)
├── Readiness badge classification (executive label + color token)
├── Propagation summary (cluster aliases, directional only)
├── Domain metadata (ALI-04 aliases; grounding status label)
├── Report metadata (report_id, baseline_ref, generated_at)
└── evidence_object_hash (for integrity verification — never displayed)

BRIDGE OUTPUTS (Phase 3+):
├── 7-panel explainability objects (WHY, EVIDENCE, TRACE, QUALIFIERS,
│   LINEAGE, CONFIDENCE, READINESS STATE)
├── Topology display object (domain map + cluster indicator array)
└── Investigation entry points (Phase 4+ — inactive until gate PASS)
```

### 4.5 Substrate vs Interaction Boundary

The substrate/interaction boundary is defined by the **committed artifact seal**:

```
SUBSTRATE SIDE (GEIOS):         │ BRIDGE SEAL         │ INTERACTION SIDE (LENS)
─────────────────────────────── │ ──────────────────── │ ───────────────────────
Derivation computation          │                      │
Evidence injection              │  evidence_object      │  Rendered evidence
  → evidence_object_hash ────── │  _hash verified ──── │  panels
Cognitive normalization         │                      │
  → normalized text objects ─── │  hash + content ──── │  Narrative blocks
Signal classification           │                      │
  → readiness state ─────────── │  state label ──────── │  Readiness badge
Topology derivation             │                      │
  → topology_display_object ─── │  read-only ─────────── │  Topology map
```

The bridge seal is the evidence_object_hash. Nothing crosses from substrate to interaction without a corresponding committed artifact. Rendering cannot produce evidence-panel content from inference — it must read from a committed, hash-verifiable artifact.

### 4.6 Governance Enforcement Boundary

The governance enforcement layer (L9) sits on the GEIOS side. LENS does not participate in governance enforcement. LENS receives only the governance outcome:

- `governance_verdict`: PASS / FAIL
- `readiness_state`: one of 5 classified states
- `qualifier_class`: Q-00..Q-04
- `grounding_scope`: domain-level grounding status map

If `governance_verdict` is FAIL, the module is not rendered. LENS renders the BLOCKED state visually (explicitly — never silently).

---

## 5. Report Object Model

### 5.1 Report Object Structure

The report object is the top-level container that crosses the GEIOS–LENS bridge. It carries all information needed to render a complete intelligence module. It is sealed at generation time and immutable at the rendering layer.

```
REPORT OBJECT SCHEMA:

report_object {
  // Immutable identity
  report_id:            string          // Unique report identifier
  baseline_ref:         string          // "governed-dpsig-baseline-v1"
  stream_ref:           string          // Originating stream identifier
  generated_at:         ISO8601         // Generation timestamp
  
  // Integrity seal (immutable; never displayed)
  evidence_object_hash: string          // Seals evidence envelope
  derivation_hash:      string          // From TAXONOMY-01; for audit only
  
  // Governance outcome (rendered; not editable)
  governance_verdict:   "PASS" | "FAIL"
  readiness_state:      ReadinessState  // 5-state classifier
  qualifier_class:      QualifierClass  // Q-00..Q-04
  
  // Topology scope (read-only reference)
  topology_scope {
    domain_count:           integer
    cluster_count:          integer
    grounded_domain_count:  integer
    grounding_label:        string      // e.g. "Partial Domain Coverage"
  }
  
  // Module composition (renderable content)
  header_block:         HeaderBlock
  narrative_block:      NarrativeBlock
  evidence_blocks:      EvidenceBlock[]   // one per domain
  trace_block:          TraceBlock
  
  // Explainability objects (Phase 2: pre-rendered static)
  explainability_bundle: ExplainabilityBundle   // 7 panels, pre-rendered
  
  // Interaction injection points (Phase 2: defined but inactive)
  interaction_registry: InteractionRegistry
  
  // Rendering metadata
  rendering_metadata:   RenderingMetadata
}
```

### 5.2 Module Composition

The module composition structure defines how sub-objects nest within the report:

```
HeaderBlock {
  readiness_badge:    ReadinessBadgeObject
  scope_indicator:    ScopeIndicatorObject
  report_metadata:    { report_id, generated_at, baseline_ref }
}

ReadinessBadgeObject {
  state_label:        string    // ALI-03 applied; e.g. "Executive Ready"
  qualifier_label:    string    // Q-xx label or empty if Q-00
  color_token:        string    // Design system token (not hex)
  tooltip_text:       string    // Qualifier explanation for Q-01/02/03
}

ScopeIndicatorObject {
  domain_label:       string    // e.g. "12 Domains Analyzed"
  grounding_label:    string    // e.g. "Full Grounding" / "Partial Coverage"
  cluster_label:      string    // e.g. "47 Clusters"
}

NarrativeBlock {
  executive_summary:  string    // Normalized; ALI applied
  why_section:        string    // Primary causal chain; normalized
  structural_summary: string    // Key findings; normalized; ranked by pressure
}

EvidenceBlock {
  domain_alias:         string              // ALI-04 applied
  grounding_status:     QualifierClass      // Q-xx for this domain
  grounding_label:      string              // Human-readable scope note
  signal_cards:         SignalCard[]
  evidence_description: string             // Normalized domain evidence
  propagation_role:     "ORIGIN" | "RECEIVER" | "PASS_THROUGH" | "ISOLATED"
}

SignalCard {
  signal_label:         string    // ALI-01 or ALI-02 applied
  pressure_label:       string    // e.g. "Elevated", "Moderate", "Low"
  pressure_tier:        "HIGH" | "ELEVATED" | "MODERATE" | "LOW"
  qualifier_label:      string    // Q-xx label for this signal
  evidence_text:        string    // Normalized evidence description
}

TraceBlock {
  propagation_path:     string[]  // Domain/cluster aliases; directional
  propagation_summary:  string    // Normalized propagation narrative
  derivation_lineage_ref: string  // Stream reference; for audit
  baseline_ref:         string    // Baseline anchor
}
```

### 5.3 Evidence Attachment Model

Evidence attaches to the report object at generation time and is sealed by `evidence_object_hash`. The rendering layer reads evidence content from the sealed object — it does not fetch or compute evidence at render time.

Evidence attachment rules:
- `evidence_object_hash` is set at GEIOS evidence injection stage (L5)
- Hash is verified by the bridge before rendering proceeds
- If hash verification fails: module renders in BLOCKED state; no silent fallback
- Evidence content objects are read-only at the LENS side
- LENS renderer cannot add to, subtract from, or modify evidence objects

### 5.4 Narrative Layer Model

The narrative layer carries normalized text produced by the GEIOS narrative generation pipeline. The narrative passes through cognitive normalization (L6) before becoming part of the report object.

Narrative layer rules:
- All text in NarrativeBlock has ALI-01..07 applied
- No raw technical labels (cluster keys, TAXONOMY-01 field names, readiness state keys) appear in narrative text
- Qualifier state is embedded in narrative via Q-xx labels where appropriate
- Narrative text is immutable at the LENS side — LENS cannot re-generate or modify it
- If normalization was not applied (system error), module renders in DIAGNOSTIC state with explicit notice

### 5.5 Explainability Binding Model

The explainability bundle is pre-rendered by the GEIOS executive rendering layer (L8) and included in the report object. LENS renders these objects — it does not generate them.

```
ExplainabilityBundle {
  why_panel:           ExplainabilityPanel    // Causal chain
  evidence_panel:      ExplainabilityPanel    // Grounded evidence by domain
  trace_panel:         ExplainabilityPanel    // Propagation + lineage
  qualifiers_panel:    ExplainabilityPanel    // All active qualifiers
  lineage_panel:       ExplainabilityPanel    // Baseline + stream refs
  confidence_panel:    ExplainabilityPanel    // Grounding depth + scope
  readiness_state_panel: ExplainabilityPanel  // Full readiness classification
}

ExplainabilityPanel {
  panel_id:            string    // WHY | EVIDENCE | TRACE | QUALIFIERS |
                                 //   LINEAGE | CONFIDENCE | READINESS_STATE
  panel_title:         string    // Human-readable panel name
  content_blocks:      ContentBlock[]
  audience:            "EXECUTIVE" | "ADVISORY" | "AUDIT"
  available_in_phase:  integer   // 2 = pre-rendered only; 3 = interactive
}

ContentBlock {
  block_type:    "NARRATIVE" | "LIST" | "SIGNAL_CARD" | "QUALIFIER_CHIP" |
                 "REFERENCE" | "PROPAGATION"
  content:       string | object  // Type-specific
  qualifier_ref: QualifierClass | null
}
```

### 5.6 Rendering Metadata

```
RenderingMetadata {
  normalization_version:     string     // Cognitive normalization version applied
  ali_rules_applied:         string[]   // e.g. ["ALI-01", "ALI-02", "ALI-04"]
  qualifier_rules_applied:   string[]   // e.g. ["Q-01"]
  surface_mode:              SurfaceMode // EXECUTIVE_READY | DIAGNOSTIC_ONLY | etc.
  explainability_panels_rendered: string[]
  topology_scope_verified:   boolean
  evidence_hash_verified:    boolean
  rendered_at:               ISO8601
  lens_version:              string
}
```

### 5.7 Qualifier Preservation

Qualifiers must be preserved end-to-end through the bridge. Preservation rules:

| Stage | Qualifier Obligation |
|-------|---------------------|
| GEIOS derivation | Qualifier determined at readiness gate |
| Evidence injection | Qualifier embedded in evidence envelope |
| Report object construction | qualifier_class field set; immutable |
| Bridge crossing | qualifier_class verified present; FAIL if absent |
| LENS rendering | Qualifier rendered per design system — never suppressed |
| Explainability panel | Qualifier described in QUALIFIERS panel |
| Signal cards | Qualifier chip rendered per signal where applicable |

**A qualifier may never be suppressed, hidden, or downgraded at the LENS rendering layer.** Q-04 SUPPRESSED signals are not rendered in the executive surface — their absence is rendered as a note ("Some signals withheld from executive surface").

### 5.8 Trace Linkage Model

The trace linkage connects rendered intelligence to its governance provenance:

```
TraceLinkage {
  evidence_object_hash:   string   // Links to sealed evidence
  derivation_hash:        string   // Links to derivation record (audit only)
  baseline_anchor:        string   // "governed-dpsig-baseline-v1"
  stream_anchor:          string   // Originating stream
  run_id:                 string   // Pipeline run identifier
}
```

Trace linkage is included in the report object but not displayed in the primary executive surface. It is visible in:
- TraceBlock (propagation summary + lineage reference)
- ExplainabilityBundle LINEAGE panel (full provenance)
- Audit export (full trace linkage in structured form)

### 5.9 Interaction Registration

Interaction injection points are registered in the report object at generation time. In Phase 2, all registered interactions are inactive (display-only behavior). In later phases, interaction activations are enabled per the maturity gate model.

```
InteractionRegistry {
  interactions: InteractionEntry[]
}

InteractionEntry {
  interaction_id:    string     // e.g. "evidence-drawer-domain-1"
  interaction_type:  "EXPAND_COLLAPSE" | "EVIDENCE_DRAWER" |
                     "INVESTIGATION_ENTRY" | "COPILOT_ENTRY"
  target_module_id:  string
  phase_required:    integer    // Phase gate required to activate
  active:            boolean    // Phase 2: all false except EXPAND_COLLAPSE
  governance_gate:   string     // Gate identifier from maturity model
}
```

---

## 6. Intelligence Module Model

### 6.1 Module Types

Intelligence modules are typed by their primary intelligence function:

| Module Type | Description | Phase Available |
|------------|-------------|-----------------|
| `EXECUTIVE_SUMMARY_MODULE` | Top-level readiness and narrative | Phase 2 |
| `DOMAIN_EVIDENCE_MODULE` | Per-domain evidence and signal cards | Phase 2 |
| `PROPAGATION_MODULE` | Pressure propagation path and explanation | Phase 2 |
| `EXPLAINABILITY_MODULE` | 7-panel explainability bundle | Phase 2 (static) / Phase 3 (interactive) |
| `TOPOLOGY_MODULE` | Topology visualization object | Phase 3 |
| `INVESTIGATION_MODULE` | Guided investigation context | Phase 4 |
| `CONTINUITY_MODULE` | Session and multi-session context | Phase 5 |
| `OPERATIONAL_MODULE` | Live signal telemetry | Phase 6 |

Phase 2 implements the first four module types. Module types for later phases are defined in this bridge as extension points but not rendered until their phase gate is passed.

### 6.2 Module Hierarchy

```
REPORT CONTAINER (top-level workspace object)
├── EXECUTIVE_SUMMARY_MODULE        [Phase 2]
│   ├── ReadinessBadge
│   ├── ScopeIndicator
│   └── NarrativeBlock
│       ├── ExecutiveSummary
│       ├── WHYSection
│       └── StructuralSummary
├── DOMAIN_EVIDENCE_MODULE[]        [Phase 2; one per domain]
│   ├── DomainHeader (alias)
│   ├── SignalCards[]
│   └── EvidenceDescription
├── PROPAGATION_MODULE              [Phase 2]
│   ├── PropagationPath
│   └── PropagationSummary
├── EXPLAINABILITY_MODULE           [Phase 2 — pre-rendered static]
│   ├── WHYPanel
│   ├── EVIDENCEPanel
│   ├── TRACEPanel
│   ├── QUALIFIERSPanel
│   ├── LINEAGEPanel
│   ├── CONFIDENCEPanel
│   └── READINESS_STATE_Panel
├── TOPOLOGY_MODULE                 [Phase 3 — placeholder in Phase 2]
│   └── [inactive until GATE-2 PASS]
├── INVESTIGATION_MODULE            [Phase 4 — placeholder in Phase 2]
│   └── [inactive until GATE-3 PASS]
└── CONTINUITY_MODULE               [Phase 5 — placeholder in Phase 2]
    └── [inactive until GATE-4 PASS]
```

Inactive modules are registered in the report object but not rendered. Placeholders maintain consistent module hierarchy without surfacing future functionality prematurely.

### 6.3 Module Rendering Lifecycle

Each module follows a governed rendering lifecycle:

```
RENDERING LIFECYCLE:

1. LOAD          — Report object loaded from committed artifact store
2. VERIFY        — evidence_object_hash verified; governance_verdict checked
3. SCOPE         — Module type determined by governance_verdict + readiness_state
4. NORMALIZE     — ALI rules applied to all string fields (if not pre-applied)
5. COMPOSE       — Module hierarchy assembled per schema
6. QUALIFY       — Qualifier chips and labels applied
7. RENDER        — Visual rendering via design system components
8. REGISTER      — Interaction points registered (inactive in Phase 2)
9. DELIVER       — Module delivered to LENS container

ABORT CONDITIONS (renders BLOCKED module, not silent failure):
- evidence_object_hash mismatch → ABORT at step 2
- governance_verdict FAIL → ABORT at step 2; render BLOCKED state
- qualifier_class absent → ABORT at step 4
- normalization not applied → ABORT at step 4; render DIAGNOSTIC notice
```

### 6.4 Evidence-Backed Modules

Every module that renders intelligence content (narrative, evidence, propagation) is evidence-backed. Evidence-backed modules:

- carry their own evidence reference (not shared across modules)
- verify their evidence hash before rendering
- render a scope qualifier if evidence is partial
- refuse to render ungrounded claims

A module is not evidence-backed only if it is purely structural (TOPOLOGY_MODULE in display mode) or purely metadata (trace linkage, lineage reference).

### 6.5 Expandable Intelligence Sections

Modules support expandable sections for progressive disclosure:

| Section | Default State | Expand Action |
|---------|--------------|--------------|
| Executive Summary | Expanded | N/A — always visible |
| WHY Section | Expanded | N/A — primary finding |
| Evidence Panel | Collapsed by default for Tier-1; Expanded for Tier-2 | Click-to-expand |
| Signal Cards | Collapsed; shows summary count | Click-to-expand |
| Trace Block | Always collapsed | Click-to-expand |
| Explainability Panels | Collapsed (sidebar in Phase 3) | Click-to-expand |
| Qualifier Tooltips | Hidden | Hover/tap to reveal |

Expand/collapse behavior is pure display state — no computation occurs at interaction time.

### 6.6 Interaction-Capable Modules (Phase 4+)

Investigation entry points are defined in the module schema from Phase 2 but are inactive until Phase 4. In Phase 2:
- The `INVESTIGATION_MODULE` placeholder exists in the report object
- The interaction entry point is registered but `active: false`
- No investigation UI is rendered

In Phase 4:
- GATE-3 PASS enables `active: true` for investigation interactions
- The investigation entry point becomes an activatable UI element
- Evidence drawer interactions connect to RAG retrieval

### 6.7 Deterministic Module Registration

Every intelligence module is registered with a deterministic identifier at generation time:

```
module_registry_entry {
  module_id:         string    // e.g. "domain-evidence-module-domain-4"
  module_type:       ModuleType
  report_id:         string    // Parent report reference
  evidence_ref:      string    // Evidence hash reference
  active:            boolean
  phase_gate:        integer   // Phase required to activate
  registered_at:     ISO8601
}
```

Module registration is part of the committed report artifact. LENS reads the registry and renders accordingly. Module registry is immutable after commit.

---

## 7. Rendering Pipeline Architecture

### 7.1 Artifact Flow

```
GEIOS SUBSTRATE                    BRIDGE                    LENS SURFACE
──────────────────                ──────────                ─────────────

Pipeline execution
  → canonical_topology.json
  → DPSIG derivation
  → readiness gate
  → evidence injection       →  evidence_object_hash  →  Report Object
  → cognitive normalization  →  normalized text        →  Module Content
  → narrative generation     →  narrative_block        →  Narrative Block
  → executive rendering      →  explainability_bundle  →  Explainability
  → report object commit     →  report_id              →  Module Registry
                                                        →  LENS Renderer
                                                        →  Intelligence Module
                                                        →  Executive Surface
```

### 7.2 Rendering Flow

The rendering flow within LENS (after the bridge delivers the report object):

```
Step 1: LOAD
    ReportStore.get(report_id) → ReportObject

Step 2: VALIDATE
    BridgeValidator.verify(report_object) → ValidationResult
    - Checks: evidence_object_hash present, governance_verdict, qualifier_class
    - On FAIL: render BlockedModule(report_id, failure_reason)

Step 3: RESOLVE SURFACE MODE
    SurfaceModeResolver.resolve(readiness_state, qualifier_class)
    → SurfaceMode: EXECUTIVE_READY | EXECUTIVE_READY_WITH_QUALIFIER |
                   DIAGNOSTIC_ONLY | STRUCTURAL_ONLY | BLOCKED

Step 4: COMPOSE MODULES
    ModuleComposer.compose(report_object, surface_mode)
    → ModuleTree: ExecutiveSummary + DomainEvidence[] + Propagation
                  + Explainability + [inactive placeholders]

Step 5: APPLY DESIGN TOKENS
    DesignSystem.applyTokens(module_tree, readiness_state, qualifier_class)
    → Styled module tree with governance-driven color and typography

Step 6: REGISTER INTERACTIONS
    InteractionRegistry.register(module_tree)
    → Phase 2: EXPAND_COLLAPSE only; all others inactive

Step 7: RENDER
    LENSRenderer.render(module_tree) → ExecutiveIntelligenceModule
```

### 7.3 Transformation Boundaries

The following transformations are permitted at the LENS side:

| Transformation | Permitted | Notes |
|----------------|-----------|-------|
| Typography rendering | YES | Apply design system fonts/weights |
| Color token application | YES | Map readiness state to design tokens |
| Expand/collapse state | YES | Pure display behavior |
| Qualifier chip rendering | YES | Must use Q-xx taxonomy labels |
| ALI label rendering | YES | Must use pre-applied ALI values from report object |
| Topology display object rendering | YES (Phase 3) | Read-only render only |
| Evidence hash verification | YES | Verify; never modify |
| Module ordering | YES | Can sort domain evidence modules |
| Module filtering | CONDITIONAL | Only if governance_verdict permits; no silent suppression |

The following transformations are permanently forbidden at the LENS side:

| Transformation | Forbidden Reason |
|----------------|-----------------|
| Re-derive signals | Violates DPSIG Lane A frozen status |
| Re-classify readiness state | Violates readiness gate authority |
| Modify evidence content | Violates evidence immutability |
| Re-generate narrative text | Violates narrative governance |
| Suppress qualifiers | Violates qualifier preservation |
| Upgrade readiness (show Q-01 as Q-00) | Violates governance honesty principle |
| Add new content not in report object | Violates evidence-first principle |
| Modify topology representation | Violates TP-01..07 |

### 7.4 Rendering Adapters

The bridge defines rendering adapters as the interface between the report object schema and the LENS rendering engine. Adapters are pure transformation functions — no computation, no inference:

```
ADAPTER INVENTORY:

ReadinessBadgeAdapter
  Input:  readiness_state, qualifier_class
  Output: ReadinessBadgeObject { state_label, qualifier_label, color_token, tooltip }
  Rule:   ALI-03 applied to state_label; Q-xx from taxonomy for qualifier_label

SignalCardAdapter
  Input:  signal_key (CPI | CFA), signal_card raw object
  Output: SignalCardObject { signal_label, pressure_label, pressure_tier, ... }
  Rule:   ALI-01 for CPI; ALI-02 for CFA; pressure_tier from normalized range map

DomainEvidenceAdapter
  Input:  domain_id, evidence_block
  Output: EvidenceBlockObject { domain_alias, grounding_status, signal_cards[], ... }
  Rule:   ALI-04 applied to domain name; Q-xx from domain grounding

NarrativeAdapter
  Input:  narrative_block (pre-normalized)
  Output: NarrativeBlockObject { executive_summary, why_section, structural_summary }
  Rule:   Pass-through only; no additional normalization; normalized at generation

PropagationAdapter
  Input:  trace_block
  Output: PropagationObject { path_labels[], summary_text }
  Rule:   Cluster aliases applied; no raw topology keys in output

ExplainabilityAdapter
  Input:  explainability_bundle
  Output: ExplainabilityPanelObjects[] (7 panels)
  Rule:   Pre-rendered content pass-through; Phase 2 renders as static panels
```

### 7.5 Workspace Rendering Strategy

Report objects are designed from Phase 2 for workspace compatibility. The workspace rendering strategy:

- Report objects are stored in a governed artifact store (indexed by report_id)
- The LENS workspace retrieves report objects from the store on navigation
- Multiple report objects can be loaded into the workspace (report history)
- Each report object renders as an intelligence module container
- Module containers are composable in the workspace layout

The workspace rendering layer (Phase 3) adds:
- A persistent navigation rail (reports list, topology, signals)
- A module container with explainability sidebar
- An evidence index (cross-report evidence summary)

Phase 2 does not implement the workspace shell — but report objects produced in Phase 2 are workspace-compatible from generation.

### 7.6 HTML Compatibility Strategy

The current HTML report generation pipeline must not be broken during Phase 2 implementation. The compatibility strategy:

**Phase 2 — Parallel output:**
- Existing HTML generator continues to produce HTML artifacts unchanged
- New Report Object Model generator produces report objects in parallel
- LENS renders from report objects (new path)
- HTML artifacts available as fallback and for current delivery clients

**Migration strategy:**
- Phase 2 proves the report object model with new clients or new reports
- Existing client delivery continues via HTML path until explicit migration
- Migration to intelligence module rendering is opt-in per client
- No forced migration; no breaking changes to existing delivery

**Compatibility constraint:**
The report object model must contain all information currently present in HTML reports. No intelligence regression is permitted. The intelligence module must be a structural superset of the HTML artifact, not a subset.

### 7.7 Phased Migration Strategy

| Migration Stage | Action |
|-----------------|--------|
| Stage 1 (Phase 2) | New report object model produced alongside HTML artifacts |
| Stage 2 (Phase 2) | Intelligence module rendering available in LENS for new reports |
| Stage 3 (Phase 2–3 transition) | Existing reports offered module rendering option |
| Stage 4 (Phase 3) | Workspace shell enables persistent module rendering as primary surface |
| Stage 5 (Phase 3+) | HTML generation deprecated for clients on workspace tier |

HTML generation is never forcibly removed — it remains available as a low-tier delivery format.

---

## 8. Explainability Interaction Model

### 8.1 WHY Panel Architecture

The WHY panel answers the primary executive question: *"Why does this readiness state exist?"*

**Phase 2 — Static:**
```
WHY PANEL:
├── Panel Header: "Why This Readiness State"
├── Primary Causal Statement:
│   "{Normalized causal chain from evidence envelope}"
├── Contributing Signals:
│   ├── SignalContributor { domain_alias, signal_label, role }
│   └── [repeats per contributing signal]
└── Qualifier Notice (if Q-01/02):
    "{Scope qualification: what this finding is based on}"
```

Content rules:
- All text from NarrativeBlock.why_section (pre-rendered at generation)
- No live text generation at panel-open time
- Qualifier notice renders only when qualifier_class is Q-01, Q-02, or Q-03
- No raw TAXONOMY-01 field values in WHY panel

**Phase 3 — Interactive expansion:**
WHY panel becomes a slide-out drawer from the explainability sidebar. Same content rules; adds progressive disclosure.

### 8.2 EVIDENCE Drawers

The EVIDENCE drawer provides domain-level evidence depth for each contributing domain.

**Phase 2 — Expandable section:**
```
EVIDENCE DRAWER (per domain):
├── Drawer Header: "{domain_alias} — Evidence"
├── Grounding Status: {qualifier_label}
├── Signal Evidence:
│   ├── SignalCard { signal_label, pressure_label, qualifier_chip, evidence_text }
│   └── [repeats per signal]
├── Propagation Role: "Origin of Pressure" | "Pressure Receiver" | "Pass-through"
└── Domain Evidence Summary: "{normalized evidence description}"
```

Interaction rules:
- Drawers expand/collapse via click — pure display state
- No computation occurs at expand time
- Evidence content is from committed EvidenceBlock (sealed at generation)
- Drawer open/close state is ephemeral (no session persistence in Phase 2)

### 8.3 TRACE Navigation

The TRACE panel provides the propagation path and lineage reference for audit-grade review.

**Phase 2 — Collapsed section (expanded on explicit request):**
```
TRACE PANEL:
├── Propagation Path:
│   [domain_alias_1] → [domain_alias_2] → [domain_alias_3]
├── Propagation Summary: "{normalized propagation narrative}"
├── Analysis Basis:
│   ├── Baseline: "governed-dpsig-baseline-v1"
│   └── Stream Reference: "{stream_id}"
└── [Raw derivation hash — shown as reference ID only, not decoded]
```

Audience: TRACE panel is rendered as ADVISORY audience by default. Basic executive view collapses TRACE by default. Advisory/audit view expands TRACE by default.

### 8.4 Qualifier Visibility

Qualifier visibility rules govern how uncertainty is communicated:

| Qualifier | Surface Treatment | Tooltip Content |
|-----------|-------------------|-----------------|
| Q-00 FULLY_GROUNDED | No qualifier chip; clean surface | N/A |
| Q-01 PARTIALLY_GROUNDED | Amber qualifier chip on readiness badge | "Analysis based on {n} of {total} grounded domains" |
| Q-02 STRUCTURALLY_GROUNDED | Blue scope chip on relevant modules | "Structural topology confirmed; semantic depth partial" |
| Q-03 DIAGNOSTIC_QUALIFIED | Grey "Under Review" indicator | "This signal is under structural review" |
| Q-04 SUPPRESSED | Section marked absent with notice | "Some signals withheld from this view" |

Qualifier visibility rules:
- Q-00: clean surface — no qualification indicator needed
- Q-01/Q-02: chip rendered on readiness badge and relevant signal cards
- Q-03: indicator on readiness badge; report marked diagnostic
- Q-04: explicit absence notice — no silent suppression allowed
- All qualifiers available in QUALIFIERS explainability panel regardless of surface mode

### 8.5 Uncertainty Presentation

Uncertainty is presented honestly, professionally, and without apology:

**Honest:** The qualifier label accurately describes the evidence scope limitation.  
**Professional:** Uncertainty framing uses neutral, factual language ("partial coverage" not "uncertain" or "possibly wrong").  
**Non-apologetic:** Partial evidence is still valuable evidence. The qualifier indicates scope, not error.

Uncertainty presentation is governed by the qualifier taxonomy (Q-00..Q-04). LENS cannot introduce new uncertainty framings beyond the Q-taxonomy.

### 8.6 Evidence Lineage Exposure

The evidence lineage is available at two depth levels:

**Level 1 — Report surface (always visible):**
- evidence_object_hash shown as reference identifier (abbreviated)
- Baseline and stream reference in TraceBlock
- Qualifier labels indicating evidence scope

**Level 2 — Explainability LINEAGE panel:**
- Full baseline reference
- Stream anchor
- Run identifier
- Generation timestamp
- evidence_object_hash (full)
- Module registry entry

Level 2 is available to ADVISORY and AUDIT audience tiers. Executive-tier clients see Level 1 by default.

### 8.7 Structural Explanation Behavior

Structural explanations follow a strict template to maintain consistency:

**Template:**
```
Structural explanation:
"[Domain/Cluster alias] shows [normalized pressure indicator].
This is driven by [contributing signal alias].
[Qualifier notice if applicable].
[Propagation note if this domain affects downstream domains]."
```

Rules:
- No predictive or forward-looking language ("this will cause...")
- No comparative language without comparative evidence ("worse than typical...")
- No normative language ("this is bad / this should be fixed...")
- No causal inference beyond topology propagation (structural causation only)
- All claims trace to evidence objects

These rules are inherited from the cognitive normalization layer (C-SAF-01..10).

---

## 9. Executive UX Doctrine

### 9.1 Executive Interaction Principles

**Principle 1 — Evidence Precedes Assertion**
Every visible claim has a visible evidence source. If evidence cannot be shown, the claim is qualified. If evidence is absent, the claim is not rendered.

**Principle 2 — Structure Is the Interaction Model**
Executives interact with structural topology — not with AI conversations. The interaction model is: select a domain, expand evidence, follow propagation, read WHY. The model is hierarchical and topology-bound.

**Principle 3 — Interrogation Over Conversation**
LENS is an interrogation surface. The executive asks questions by navigating structure, expanding evidence, and reading explainability panels. The executive does not type queries to an AI.

**Principle 4 — Readiness State Governs Everything**
The readiness state classification is the primary product output. Every visual element subordinates to communicating the readiness state clearly. Color, layout emphasis, and information hierarchy are all governed by the readiness state.

**Principle 5 — Qualifiers Are Not Failures**
Partial grounding, structural grounding, and diagnostic states are not failures of the product. They are honest assessments of evidence scope. Design must present these states with equal professionalism as Q-00 FULLY_GROUNDED states.

**Principle 6 — Density Is a Feature**
Executive intelligence surfaces are dense by design. Executives managing complex execution structures expect depth of information. Density is managed through progressive disclosure (collapse by default), not through information removal.

**Principle 7 — Consistency Is Trust**
Every report follows the same structure. Every qualifier looks the same. Every signal card behaves the same way. Consistency at the product level builds executive trust in the intelligence outputs.

### 9.2 Cognitive Normalization Principles

All text in the executive surface applies cognitive normalization per the governance model:

**C-NORM-1:** Technical signal keys are never visible to executives
**C-NORM-2:** Cluster names use client-configured aliases (ALI-04)
**C-NORM-3:** Readiness states are rendered in executive language (ALI-03)
**C-NORM-4:** Pressure levels are rendered as named tiers (HIGH/ELEVATED/MODERATE/LOW)
**C-NORM-5:** Propagation is described directionally ("flows through") not mathematically
**C-NORM-6:** Qualifiers use human-readable scope descriptions (Q-taxonomy labels)
**C-NORM-7:** Governance references (safety rule IDs, stream IDs) are not in executive surface

### 9.3 Density Management

Progressive disclosure manages density without information loss:

| Layer | Default | Action to Expand |
|-------|---------|-----------------|
| Readiness badge | Always visible | N/A |
| Executive summary | Always visible | N/A |
| WHY section | Always visible | N/A |
| Domain evidence list | Summarized (count + top domain) | Click to expand full list |
| Signal cards | Summarized per domain | Click domain to expand cards |
| Evidence drawer | Closed | Click domain header |
| Propagation path | Summary sentence | Click trace block to expand |
| TRACE panel | Collapsed | Click "View Trace" |
| Explainability panels | Hidden / collapsed (Phase 2) | Click explainability indicator |
| Lineage reference | Hidden (audit) | Available via LINEAGE panel |

No information is removed — it is progressively revealed. An executive who wants to dig into evidence can; one who only needs the readiness summary sees exactly that.

### 9.4 Intelligence Readability

Executive-tier readability requirements for narrative text:

- Sentences are complete, factual, and non-speculative
- Reading grade level: executive briefing standard (Flesch-Kincaid Grade ~12–14)
- No bullet-point lists for primary narrative (reserved for evidence enumeration only)
- Structural findings are stated before evidence (inverted pyramid: conclusion first)
- WHY section answers the executive question in the first sentence
- Qualifier scoping appears after primary finding, not before

### 9.5 Visual Hierarchy

The visual hierarchy follows intelligence priority:

```
LAYER 1 — PRIMARY (always visible, highest visual weight):
  Readiness Badge + State Label

LAYER 2 — INTELLIGENCE (always visible, high visual weight):
  Executive Summary Narrative

LAYER 3 — EVIDENCE (visible; medium weight):
  WHY Section
  Domain Evidence Cards (summary)

LAYER 4 — DEPTH (expandable; lower weight):
  Full Signal Cards
  Evidence Drawers
  Propagation Path

LAYER 5 — AUDIT (collapsed by default; minimal weight in executive view):
  TRACE Panel
  LINEAGE Panel
  Derivation Reference
```

### 9.6 Interrogation-First Interaction

The interrogation model:

1. **See the verdict** — Readiness badge communicates the primary state immediately
2. **Understand the narrative** — Executive summary explains in governed language
3. **Investigate WHY** — WHY section provides the primary causal chain
4. **Examine evidence** — Evidence drawers provide domain-level proof
5. **Follow propagation** — Propagation path shows structural pressure flow
6. **Audit the trace** — TRACE panel provides derivation lineage

Steps 1–3 are always visible. Steps 4–6 are progressive disclosure. The executive controls depth, not the AI.

### 9.7 Operational Command-Surface Feel

The design aesthetic is **operational precision**:

- Typography: structured, authoritative; no decorative fonts
- Grid: tight, consistent; information density is controlled by grid, not visual noise
- Color: governance-driven (readiness token system); not aesthetic gradients
- Iconography: functional; no decorative icons; structural indicators only
- Animation: none for primary content; expand/collapse transitions only (brief)
- Whitespace: intentional; used to separate intelligence layers, not to reduce density

### 9.8 What LENS Must Never Become

| Forbidden Form | Why Forbidden |
|---------------|--------------|
| Generic SaaS dashboard | Destroys intelligence differentiation; looks like BI tool |
| Chatbot product | Wrong interaction model; positions as AI assistant not intelligence platform |
| Consumer AI product | Undermines executive trust; wrong audience positioning |
| Prompt playground | Implies ungoverned AI access; creates governance risk |
| Black-box AI analytics | Contradicts explainability principle; hides evidence |
| Decorative graph dashboard | Aesthetics override structural truth; topology becomes decoration |
| Confidence bar charts | Implies probabilistic framing without grounding proof |
| "Ask me anything" interface | Free-form query until Phase 5 only; wrong in Phase 2–4 |
| Real-time AI narration | Implies live inference; creates ungoverned output risk |
| Social/collaborative workspace | Wrong product category; executive intelligence is not social |

---

## 10. Visibility and Exposure Governance

### 10.1 What Executives Can See

Executive visibility is governed by the `audience` field in explainability panel definitions and by the surface mode classification:

| Visibility Category | Executive | Advisory | Audit |
|--------------------|-----------|----------|-------|
| Readiness badge + label | YES | YES | YES |
| Executive summary | YES | YES | YES |
| WHY section | YES | YES | YES |
| Domain evidence (summary) | YES | YES | YES |
| Signal cards (detail) | YES | YES | YES |
| Qualifier chips and labels | YES | YES | YES |
| Propagation summary | YES | YES | YES |
| Explainability panels (7) | Collapsed default | Expanded default | Full |
| Trace block | No (collapsed) | Available | Full |
| Lineage panel | No | Available | Full |
| evidence_object_hash | No | Reference ID | Full |
| Derivation hash | No | No | Reference ID |
| Governance verdict | Status label only | PASS/FAIL | Full validation |
| Surface mode | As readiness label | As mode label | Full |

### 10.2 What Remains Internal (Never Surfaced)

The following GEIOS elements are permanently internal:

```
PERMANENTLY INTERNAL — NEVER IN ANY LENS SURFACE:

Intelligence mechanics:
├── Agent system (types, task records, delegation chains)
├── Orchestration flow (coordinator, task assignments)
├── RAG retrieval (chunk stores, similarity scores, retrieval calls)
├── Memory layer (session objects, invalidation, retention classes)
└── Replay infrastructure (replay types, lineage records)

Derivation mechanics:
├── Signal derivation formulas (CPI formula, CFA formula)
├── Readiness gate thresholds (numerical values)
├── TAXONOMY-01 raw fields (signal_value, activation_state, etc.)
└── SCRIPT_VERSION and derivation parameters

Governance mechanics:
├── Safety rule identifiers (AS-01, N-SAF-01, etc.)
├── Validator names and rule references
├── Governance stream IDs in executive surface
└── Pipeline execution manifest details

LLM mechanics:
├── Prompt templates
├── Model identifiers
├── Token counts
└── Prompt chain structure
```

### 10.3 Evidence Exposure Controls

Evidence is exposed at the appropriate depth per audience tier:

**Executive tier:**
- Evidence content (normalized descriptions)
- Qualifier labels (scope indicators)
- Propagation role (structural direction)
- Grounding status (as qualifier chip)

**Advisory tier (adds):**
- Full explainability panel content
- Propagation path detail
- Baseline reference
- evidence_object_hash as reference identifier

**Audit tier (adds):**
- Full lineage record (from LINEAGE panel)
- evidence_object_hash (full)
- Stream and run identifiers

Evidence exposure controls are enforced at the rendering layer. The LENS renderer applies audience tier filtering — it does not pass full evidence objects to the client browser indiscriminately.

### 10.4 Topology Exposure Boundaries

Topology is exposed only as a **read-only display object** derived from canonical_topology.json:

```
TopologyDisplayObject (Phase 3+):
├── domains[]: { domain_id_alias, cluster_count, readiness_badge }
└── edges[]: { from_domain_alias, to_domain_alias, direction }
```

The topology display object:
- Uses ALI-04 aliases for all domain names
- Contains no raw cluster keys or topology IDs
- Is generated at report time from canonical_topology.json (read-only access)
- Cannot be edited, modified, or "corrected" through any LENS interaction
- Does not expose edge weights, topology metrics, or numerical topology data

Any attempt by LENS to modify topology display objects constitutes a TP-01..07 violation.

### 10.5 Governance Overlays

Governance overlays are visual indicators applied at the LENS layer that communicate governance state without exposing governance internals:

| Overlay | Trigger | Visual Form |
|---------|---------|------------|
| Readiness Badge | Always | Colored badge per Q-taxonomy |
| Qualifier Chip | Q-01..Q-04 active | Amber/blue/grey chip on affected modules |
| BLOCKED state | governance_verdict FAIL | Full module replacement with blocked notice |
| DIAGNOSTIC notice | normalization not applied | Banner on narrative block |
| SUPPRESSED notice | Q-04 signals present | Section absence notice |
| Grounding scope note | grounded_domain_count < domain_count | Scope indicator in header |

All governance overlays are mandatory. LENS cannot suppress a governance overlay for aesthetic or UX simplicity reasons.

### 10.6 GEIOS Over-Exposure Prevention

Prevention mechanisms for GEIOS over-exposure:

| Mechanism | Enforcement |
|-----------|------------|
| Bridge adapter layer | Adapters only expose defined output fields; no schema bleed |
| Audience tier filtering | Internal fields excluded from executive tier |
| Interaction registry | No interaction activates GEIOS-internal functionality |
| Rendering pipeline rules | §7.3 forbidden transformations explicitly enumerate GEIOS leakage |
| Module placeholder model | Future capabilities registered but inactive; not surfaced |
| UX doctrine | §9.8 explicitly names forbidden product forms |
| Design system | No GEIOS terminology in design tokens or component names |

---

## 11. Workspace Evolution Model

### 11.1 How Reports Evolve into Workspace Objects

The evolution path from HTML artifact to workspace object:

```
HTML ARTIFACT (now)
    ↓ Phase 2
INTELLIGENCE MODULE (report_object schema)
    ↓ Phase 3
WORKSPACE OBJECT (module + workspace metadata + persistent state)
    ↓ Phase 4
INVESTIGATION-CAPABLE OBJECT (module + investigation_entry_point active)
    ↓ Phase 5
CONTINUITY-CAPABLE OBJECT (module + memory_context active)
    ↓ Phase 6
OPERATIONAL OBJECT (module + live_signal_overlay active)
```

Each evolution step is additive. The Phase 2 module schema supports all subsequent evolution steps via the placeholder model and the interaction registry pattern.

### 11.2 Persistent Executive Sessions

Phase 3 introduces session persistence. In Phase 2, modules are stateless (no session context). The bridge defines the session extension point:

```
WorkspaceSessionExtension (Phase 3 — not active in Phase 2):
  session_id:          string
  workspace_context:   { last_viewed_module, expanded_panels, scroll_position }
  session_scope:       DISPLAY_ONLY   // Phase 3: display state only
  intelligence_scope:  null           // Phase 4+: investigation context
  continuity_scope:    null           // Phase 5+: memory context
```

Session persistence in Phase 3 is display-only (scroll position, panel expansion states). No intelligence is computed from session state in Phase 3. This prevents premature memory layer activation.

### 11.3 Future Workspace Composition

The workspace composition model (Phase 3) places intelligence modules in a governed layout:

```
WORKSPACE COMPOSITION (Phase 3):

WorkspaceShell
├── NavigationRail
│   ├── ReportsList (chronological; indexed by report_id)
│   ├── TopologyView (static; Phase 3)
│   ├── SignalIndex (readiness summary across reports)
│   └── EvidenceIndex (cross-report evidence summary)
├── IntelligenceCanvas
│   └── IntelligenceModuleContainer
│       ├── ModuleHeader (readiness badge, scope)
│       ├── ModuleContent (narrative, evidence, propagation)
│       └── ModuleActions (expand, export)
└── ContextSidebar
    ├── ExplainabilitySidebar (7 panels)
    ├── TopologyContext (current domain in view)
    └── QualifierStatus (active qualifiers for current module)
```

This composition model is not implemented in Phase 2. But Phase 2 modules must be composable into this layout without modification.

### 11.4 Investigation Containers (Phase 4+)

Investigation containers are workspace objects that hold investigation session context. They attach to intelligence modules but are not rendered until Phase 4:

```
InvestigationContainer (Phase 4 — defined here as extension point):
  investigation_id:       string
  source_module_id:       string
  investigation_scope:    { domain_scope, cluster_scope, signal_scope }
  question_registry:      QuestionEntry[]
  evidence_chain:         EvidenceChainEntry[]
  session_state:          InvestigationSessionState
  replay_ref:             string   // Type 4 replay reference
```

### 11.5 Modular Intelligence Surfaces

The modular intelligence surface model allows multiple intelligence views from the same topology:

| Surface | Module Composition | Phase |
|---------|--------------------|-------|
| Executive Summary View | ExecutiveSummaryModule only | Phase 2 |
| Full Intelligence View | All modules expanded | Phase 2 |
| Topology View | TopologyModule + DomainEvidence | Phase 3 |
| Evidence View | EvidenceModules + ExplainabilityBundle | Phase 3 |
| Investigation View | All modules + InvestigationContainer | Phase 4 |
| Operational View | All modules + OperationalModule | Phase 6 |

Modular surface selection does not change the underlying report object — it changes the rendering composition only.

### 11.6 Future Continuity Preparation

The bridge prepares for Phase 5 continuity without activating it in Phase 2:

**Continuity preparation in Phase 2 report objects:**
- `report_id` is stable and referenceable across sessions
- `module_registry` provides stable module identifiers for session state
- `interaction_registry` includes placeholders for Phase 5 continuity interactions
- `trace_linkage` provides the replay anchor needed for Type 5 memory continuity

None of these constructs activate memory layer processing in Phase 2. They are structural preparation for future phases.

---

## 12. Implementation Sequencing

### 12.1 Phased Implementation Order

**SEQUENCE 1 — PRODUCTIZATION BRIDGE FOUNDATION**
Must be completed before any rendering work begins.

| Step | Action | Gate |
|------|--------|------|
| 1.1 | Define report_object schema (§5.1 → formal schema definition) | Schema reviewed and approved |
| 1.2 | Define rendering adapter interfaces (§7.4) | Interface contracts locked |
| 1.3 | Define ExplainabilityBundle schema (§5.5) | Schema locked |
| 1.4 | Define InteractionRegistry schema (§5.9) | Schema locked |
| 1.5 | Define module_registry schema (§6.7) | Schema locked |
| 1.6 | Validate schema against GEIOS artifact outputs | All fields mappable from existing artifacts |

---

**SEQUENCE 2 — NEXTGEN REPORTS**
Implements Phase 2 intelligence module rendering. Starts after Sequence 1 gate.

| Step | Action | Gate |
|------|--------|------|
| 2.1 | Report object generator: produces report_object from pipeline artifacts | Generates valid schema-conforming objects |
| 2.2 | Cognitive normalization integration: applies ALI-01..07 + Q-taxonomy | All technical labels replaced in output |
| 2.3 | Evidence panel content generation: WHY/EVIDENCE/TRACE pre-rendering | evidence_object_hash verified on all panels |
| 2.4 | Explainability bundle generator: pre-renders 7 panels | All panels present; audience tiers correct |
| 2.5 | Readiness badge system: Q-00..Q-04 surface mapping | All 5 states render correctly; Q-04 absence notice present |

---

**SEQUENCE 3 — PROFESSIONAL RENDERING SHELL**
Implements LENS rendering layer. Starts in parallel with Sequence 2 after Sequence 1 gate.

| Step | Action | Gate |
|------|--------|------|
| 3.1 | Design system tokens: readiness state color system | All Q-xx states have tokens; no color introduced outside tokens |
| 3.2 | Typography system: executive + signal + trace type scales | All scales defined; applied consistently |
| 3.3 | Module component library: ExecutiveSummary, EvidenceBlock, SignalCard, TraceBlock | All components render from report_object; no computed content |
| 3.4 | Readiness badge component: state + qualifier rendering | All qualifier states render per doctrine; no suppression |
| 3.5 | Expand/collapse behavior: all collapsible sections | Pure display state; no computation at interaction |

---

**SEQUENCE 4 — EXPLAINABILITY INTERACTIONS**
Implements interaction surfaces. Starts after Sequence 3 gate.

| Step | Action | Gate |
|------|--------|------|
| 4.1 | Evidence drawer interactions: per-domain expand/collapse | All drawers render from sealed evidence; no inference |
| 4.2 | Qualifier tooltip system: Q-xx tooltips | Tooltip content from taxonomy; no custom text |
| 4.3 | TRACE panel rendering: propagation + lineage reference | No raw TAXONOMY-01 fields in surface; aliases applied |
| 4.4 | Explainability panel framework: 7-panel static render (Phase 2) | All panels present and correct for audience tier |
| 4.5 | BLOCKED state rendering: explicit failure state | Blocked reports visible; no silent fallback |

---

**DEFERRED (Do Not Implement Until Phase Gate)**

| Feature | Deferred Until |
|---------|---------------|
| Workspace shell | Phase 3 (GATE-2 PASS) |
| Topology visualization | Phase 3 (GATE-2 PASS) |
| Explainability sidebar (interactive) | Phase 3 (GATE-2 PASS) |
| RAG integration | Phase 4 (GATE-3 PASS) |
| Investigation panel | Phase 4 (GATE-3 PASS) |
| Session memory (intelligence) | Phase 4 (GATE-3 PASS) |
| Executive copilot (any form) | Phase 4/5 (GATE-3/4 PASS) |
| Multi-agent orchestration exposure | NEVER |
| Free-form query interface | Phase 5 only; governed boundaries |
| Operational dashboard | Phase 6 (GATE-5 PASS) |

### 12.2 Dependencies

```
SEQUENCE 1 (Bridge Foundation)
    │
    ├── SEQUENCE 2 (NextGen Reports)
    │       │
    │       └── GATE-1 (NextGen Reports + Rendering Shell PASS)
    │               │
    │               └── Workspace Shell work begins
    │
    └── SEQUENCE 3 (Rendering Shell) [parallel with Sequence 2]
            │
            └── SEQUENCE 4 (Explainability Interactions) [after Sequence 3]
```

### 12.3 Implementation Risk Checkpoints

At each sequence gate, validate:

| Checkpoint | Validation |
|-----------|-----------|
| Normalization complete | Zero raw technical labels in executive surface |
| Qualifier preservation | All Q-xx states render; Q-04 absence explicit |
| Evidence integrity | evidence_object_hash verified in all rendered modules |
| Topology read-only | No LENS interaction modifies topology data |
| No inference at render time | All panel content from committed artifacts only |
| Existing pipeline intact | HTML reports still generated; BlueEdge/fastapi certifications unaffected |
| Interaction registry correct | Phase 2 interactions active; Phase 3+ inactive |

---

## 13. Governance Preservation Model

### 13.1 Evidence-First Enforcement

The evidence-first doctrine is enforced at the bridge layer:

**Rule EF-01:** No panel content may be rendered without a corresponding committed evidence artifact.
**Rule EF-02:** The `evidence_object_hash` must be verified before any evidence panel is rendered.
**Rule EF-03:** If hash verification fails, the module renders in BLOCKED state — not degraded-silent.
**Rule EF-04:** LLM-generated narrative is not evidence — it is a governed presentation of evidence. The underlying evidence objects are the authoritative source.
**Rule EF-05:** Panel content pre-rendered at generation time is authoritative — LENS cannot supplement it with live inference.

### 13.2 Qualifier Preservation

Qualifier preservation rules at the bridge:

**Rule QP-01:** The qualifier_class field in the report object is immutable at the LENS side.
**Rule QP-02:** qualifier_class may not be upgraded (Q-01 may not render as Q-00).
**Rule QP-03:** qualifier_class may not be suppressed (Q-01 chip is not optional).
**Rule QP-04:** Q-04 SUPPRESSED results in section absence notice — never silent.
**Rule QP-05:** All active qualifiers are enumerated in the QUALIFIERS explainability panel.
**Rule QP-06:** Qualifier tooltip content comes from the Q-taxonomy definition — LENS cannot override it.

### 13.3 Topology Protection

Topology protection rules at the bridge:

**Rule TP-BRIDGE-01:** LENS never writes to canonical_topology.json or any topology artifact.
**Rule TP-BRIDGE-02:** The topology display object is derived at generation time — LENS renders from this object, not from canonical_topology.json directly.
**Rule TP-BRIDGE-03:** No workspace interaction produces a topology update request.
**Rule TP-BRIDGE-04:** Topology visualization is display-only — no editability.
**Rule TP-BRIDGE-05:** Topology edge representation uses aliases only — no raw topology IDs.

### 13.4 Replay-Safe Continuity

Replay safety is preserved at the bridge:

**Rule RS-BRIDGE-01:** report_id is stable and immutable after generation.
**Rule RS-BRIDGE-02:** All module identifiers in the module_registry are stable.
**Rule RS-BRIDGE-03:** evidence_object_hash anchors the evidence envelope for replay verification.
**Rule RS-BRIDGE-04:** The trace_linkage object provides replay anchors for all downstream phases.
**Rule RS-BRIDGE-05:** Phase 2 rendering is deterministic: same report_object → same rendered module.

### 13.5 Semantic Authority Boundaries

Semantic authority is CLOSED (SEMANTIC_GOVERNANCE_EXPLORATION_CLOSURE.md). Bridge enforcement:

**Rule SA-BRIDGE-01:** LENS cannot introduce new terminology not in the cognitive normalization dictionary.
**Rule SA-BRIDGE-02:** LENS cannot create new qualifier states not in the Q-00..Q-04 taxonomy.
**Rule SA-BRIDGE-03:** LENS cannot create new aliasing rules beyond ALI-01..07.
**Rule SA-BRIDGE-04:** Normalization is applied at GEIOS generation time — LENS renders normalized output; it does not re-normalize.
**Rule SA-BRIDGE-05:** Design system component names use product-layer terminology — not GEIOS architecture terminology.

### 13.6 Rendering Immutability Principles

**Rule RI-01:** Report objects are read-only at the LENS rendering layer.
**Rule RI-02:** Rendering adapters are pure transformation functions — no state, no computation.
**Rule RI-03:** Display state (expand/collapse) is ephemeral — not persisted to the report object.
**Rule RI-04:** Module rendering is deterministic — same inputs produce same visual output.
**Rule RI-05:** Rendering errors produce visible failure states — not silent degradation.

### 13.7 Executive Trust Preservation

Executive trust is the primary product asset. Trust preservation rules:

**Rule ET-01:** Intelligence outputs are consistent — same topology + same signals → same readiness state.
**Rule ET-02:** Qualifiers communicate scope accurately — not conservatively or optimistically.
**Rule ET-03:** BLOCKED and DIAGNOSTIC states are clearly communicated — executives are not shown partial intelligence as if it were complete.
**Rule ET-04:** No intelligence claim is made without a traceable evidence source.
**Rule ET-05:** Professional rendering standards are consistently applied — no design inconsistency that suggests low quality.

---

## 14. Strategic Risk Model

### 14.1 Chatbot Drift Risk

**Risk:** Progressive UX iterations introduce text input fields, chat-style responses, or AI question-answering patterns before Phase 5.

**Trigger conditions:** Product feedback requesting "conversational" features; pressure to "make LENS more like ChatGPT"; adding a search bar that queries LLM directly.

**Mitigation:**
- §9.8 explicitly names chatbot as forbidden form
- Interaction registry model activates copilot interactions only at Phase 5 gate
- Phase 2 has no text input fields by design
- Design system has no chat bubble component

**Governance control:** Phase gate model; interaction registry activation rules (§5.9); UX doctrine (§9.8).

### 14.2 GEIOS Exposure Risk

**Risk:** Architecture documentation, developer tooling, or marketing materials expose GEIOS internals to clients.

**Trigger conditions:** "Powered by our 9-layer AI OS" messaging; GEIOS architecture diagrams in client decks; orchestration layer visible in browser DevTools.

**Mitigation:**
- §4.1 permanently-internal list
- §10.2 permanently-internal surface list
- Adapter layer enforces field-level exposure control

**Governance control:** Bridge adapter schema (§7.4); audience tier filtering (§10.1).

### 14.3 Advisory Erosion Risk

**Risk:** Autonomous AI features in LENS reduce the perceived need for advisory services.

**Trigger conditions:** LENS copilot providing strategic recommendations; investigation mode producing action items; executive copilot substituting for analyst interpretation.

**Mitigation:**
- Phase 2–3 advisory role preserved (§3.6 commercial positioning)
- Copilot interaction types are interrogation-only (IT-01..06) until Phase 5
- No action items, recommendations, or prescriptive guidance from LENS until explicitly authorized

**Governance control:** Interaction type governance (GOVERNED_EXECUTIVE_COPILOT_ARCHITECTURE.md IT-01..06 boundaries).

### 14.4 Inference-as-Truth Risk

**Risk:** LLM-generated narrative content is presented as if it were structural derivation.

**Trigger conditions:** WHY panel sourced from live LLM generation at panel-open time; narrative enhanced by LLM at rendering; "AI insights" surfaced outside evidence pipeline.

**Mitigation:**
- EF-01..05 evidence-first enforcement rules (§13.1)
- All panel content pre-rendered at generation time (§8.1)
- No live LLM generation at LENS render time

**Governance control:** BridgeValidator hash verification; rendering pipeline steps (§7.2); rendering forbidden transformations (§7.3).

### 14.5 UX Overcomplexity Risk

**Risk:** Explainability panels, evidence drawers, qualifier chips, and intelligence depth create cognitive overload in the executive surface.

**Trigger conditions:** All explainability panels expanded by default; too many qualifier chips on single view; multiple active evidence drawers simultaneously.

**Mitigation:**
- Progressive disclosure model (§9.3) — dense by default only for primary intelligence
- Collapse-by-default for depth layers
- Executive view hides audit-tier content

**Governance control:** Density management table (§9.3); audience tier visibility model (§10.1).

### 14.6 Executive Trust Degradation Risk

**Risk:** Low-quality rendering, inconsistent qualification, or incorrect BLOCKED states undermine executive confidence in intelligence outputs.

**Trigger conditions:** Q-01 rendered inconsistently across reports; BLOCKED state appearing for healthy reports (false negatives in hash verification); normalization failures producing technical labels.

**Mitigation:**
- ET-01..05 trust preservation rules (§13.7)
- Mandatory rendering validation in rendering lifecycle (§6.3 ABORT conditions)
- Deterministic rendering: same inputs → same outputs

**Governance control:** BridgeValidator in rendering lifecycle step 2; module rendering lifecycle ABORT conditions.

### 14.7 Uncontrolled AI Expectations Risk

**Risk:** Client-facing materials, demos, or sales positioning creates AI expectations LENS cannot currently meet, forcing premature phase activation.

**Trigger conditions:** Sales demos showing conversational copilot before Phase 5; "AI-powered" messaging without governance context; comparison to GPT-based tools.

**Mitigation:**
- Signäl brand positioning (§3.4): execution intelligence, not AI platform
- Phase gate model prevents premature activation
- Commercial messaging aligned to current phase capabilities

**Governance control:** Strategic productization mission §3.4 brand doctrine; phase activation matrix (§9.1).

### 14.8 Semantic Contamination Risk

**Risk:** New terminology introduced by product/UX teams enters the executive surface without passing through cognitive normalization governance.

**Trigger conditions:** Design team inventing new signal names; UX copy bypassing ALI rules; localization introducing non-governed translations.

**Mitigation:**
- SA-BRIDGE-01..05 semantic authority rules (§13.5)
- Normalization applied at generation time — LENS cannot introduce new terms
- Design system component names use product-layer vocabulary only (no GEIOS terms)

**Governance control:** Cognitive normalization architecture (GOVERNED_COGNITIVE_NORMALIZATION_ARCHITECTURE.md) ALI-01..07 + Q-taxonomy.

### 14.9 Generic SaaS Normalization Risk

**Risk:** Market pressure and competitor benchmarking causes LENS to converge toward generic BI dashboard aesthetics, losing the intelligence-oriented differentiation.

**Trigger conditions:** "Can we make it look more like Tableau?"; "Users want familiar dashboard patterns"; design templates imported from generic SaaS toolkits.

**Mitigation:**
- §9.7 operational command-surface feel doctrine
- §9.8 forbidden forms
- Design system built from first principles (§8.7) — not derived from generic SaaS frameworks

**Governance control:** Executive UX doctrine (§9); design system direction (§8.7).

---

## 15. Next Contract Recommendations

### 15.1 Immediate Priority — P0

**PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01**

Scope: Formally define the complete report_object schema from §5 as an implementation-ready artifact. Define schema validation rules, field obligations, and generation contract. Output: JSON Schema definition + generation contract specification.

Dependency: This bridge document (a80d5c6 + this stream).
Commercial priority: P0 — directly enables NextGen report generation.

---

**PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01**

Scope: Implement the integration between the GEIOS cognitive normalization pipeline (ALI-01..07, Q-00..Q-04) and the report object generator. Define how normalization output populates the narrative_block, evidence_blocks, and qualifier fields. Output: Normalization integration specification + field mapping contract.

Dependency: REPORT-OBJECT-MODEL.01.
Commercial priority: P0 — normalization quality is the primary narrative improvement.

---

### 15.2 Short-Term Priority — P0/P1

**PI.LENS.NEXTGEN-REPORTS.EVIDENCE-PANEL-ARCHITECTURE.01**

Scope: Define the complete evidence panel architecture from §8. Specify WHY panel content generation rules, EVIDENCE drawer content rules, TRACE panel content rules. Define pre-rendering contract (content generated at pipeline time, not at render time). Output: Evidence panel specification + pre-rendering contract.

Dependency: COGNITIVE-NORMALIZATION-INTEGRATION.01.
Commercial priority: P0 — WHY/EVIDENCE panels are the primary new client value.

---

**PI.LENS.NEXTGEN-REPORTS.PROFESSIONAL-UI.01**

Scope: Implement the LENS professional rendering shell per §9. Define design system tokens, typography scale, component library for report modules. Output: Design system specification + component architecture.

Dependency: REPORT-OBJECT-MODEL.01 (schema must be stable before components are built).
Commercial priority: P0 — professional rendering is prerequisite for commercial viability.

---

### 15.3 Post-Phase-2 Priority — P1

**PI.LENS.WORKSPACE-SHELL.PREPARATION.01**

Scope: Define the workspace shell architecture from §11.3. Specify workspace composition model, navigation rail, module container, context sidebar. This stream prepares the workspace shell architecture — implementation begins after GATE-1 PASS. Output: Workspace architecture specification.

Dependency: Phase 2 GATE-1 PASS.
Commercial priority: P1 — enables Tier-3 workspace positioning.

---

**PI.LENS.INTERACTIVE-EXPLAINABILITY.PANEL-ARCHITECTURE.01**

Scope: Define the interactive explainability model for Phase 3 — transforming pre-rendered static panels (Phase 2) into interactive drawers and sidebars. Output: Interactive explainability specification.

Dependency: Phase 2 GATE-1 PASS.
Commercial priority: P1 — explainability sidebar is the workspace differentiator.

---

### 15.4 Explicitly Deferred — Do Not Contract Yet

| Contract | Deferral Reason |
|----------|----------------|
| PI.LENS.EXECUTIVE-COPILOT.* (any) | Phase 4/5 only; copilot not authorized until GATE-3 PASS |
| PI.LENS.GUIDED-INVESTIGATIONS.* | Phase 4 only; requires RAG implementation first |
| PI.LENS.OPERATIONAL-INTELLIGENCE.* | Phase 6; requires execution signal families activated |
| Any memory activation contracts | Phase 4/5 only; no memory at Phase 2/3 |
| Any orchestration exposure contracts | NEVER — orchestration is permanently hidden |

---

## Validation

### Validation Checklist

| Check | Result |
|-------|--------|
| GEIOS/LENS boundary explicitly defined | PASS — §4 complete boundary model; §4.1/4.2 ownership tables |
| Report object model defined | PASS — §5.1 schema; §5.2..5.9 sub-objects |
| Intelligence module model defined | PASS — §6.1..6.7 complete module model |
| Rendering pipeline defined | PASS — §7.1..7.7 complete pipeline architecture |
| Workspace compatibility defined | PASS — §11 workspace evolution; Phase 2 modules workspace-compatible |
| Explainability interaction model defined | PASS — §8.1..8.7 complete panel architecture |
| Executive UX doctrine defined | PASS — §9.1..9.8 complete doctrine |
| Visibility and exposure governance defined | PASS — §10.1..10.6 complete exposure model |
| Implementation sequencing defined | PASS — §12.1..12.3 sequencing + gates |
| Governance preservation defined | PASS — §13.1..13.7 six preservation rules |
| Chatbot-first strategy absent | PASS — §9.8; §12.3; interaction registry Phase 2 restrictions |
| GEIOS over-exposure prevented | PASS — §4.1 hidden list; §10.2 permanently internal list |
| Advisory model preserved | PASS — Phase 2/3 advisory centrality explicit |
| HTML compatibility preserved | PASS — §7.6 parallel output strategy |
| Deterministic substrate preserved | PASS — §4.5 substrate seal; §7.3 forbidden transformations |
| Qualifier preservation mandatory | PASS — §5.7; §13.2 QP-01..06 |
| Evidence-first doctrine enforced | PASS — §13.1 EF-01..05 |

### Fail Condition Check

| Fail Condition | Status |
|----------------|--------|
| Free-form AI interaction proposed in Phase 2/3 | NOT PRESENT — prohibited; interaction registry Phase 2 only EXPAND_COLLAPSE |
| Topology mutation possible via LENS | NOT PRESENT — TP-BRIDGE-01..05 explicit prohibitions |
| GEIOS internals exposed to product surface | NOT PRESENT — §4.1 permanently internal list |
| Qualifier suppression possible | NOT PRESENT — QP-01..06; §9.9 governance overlays mandatory |
| Rendering produces live inference | NOT PRESENT — §7.3 forbidden; §8.1 pre-rendered |
| Generic chatbot UX recommended | NOT PRESENT — §9.8 explicitly forbidden |
| Existing pipeline broken | NOT PRESENT — §7.6 HTML compatibility strategy |

**All fail conditions clear.**

### Final Validation Verdict

**VALIDATION: PASS**

**Bridge verdict: GEIOS_LENS_PRODUCTIZATION_BRIDGE_VIABLE**

**Next contracts authorized:**
- PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01 — OPEN
- PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01 — OPEN (after report model)
- PI.LENS.NEXTGEN-REPORTS.EVIDENCE-PANEL-ARCHITECTURE.01 — OPEN (after normalization)
- PI.LENS.NEXTGEN-REPORTS.PROFESSIONAL-UI.01 — OPEN (parallel with normalization)

---

*Stream PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01 — COMPLETE*  
*Upstream: PI.LENS.GEIOS.STRATEGIC-PRODUCTIZATION-MISSION.01 (a80d5c6)*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
