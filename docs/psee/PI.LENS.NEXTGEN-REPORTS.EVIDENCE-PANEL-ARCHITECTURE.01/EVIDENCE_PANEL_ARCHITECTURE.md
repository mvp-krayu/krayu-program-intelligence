# Evidence Panel and Explainability Surface Architecture

**Stream:** PI.LENS.NEXTGEN-REPORTS.EVIDENCE-PANEL-ARCHITECTURE.01  
**Document type:** EVIDENCE PANEL AND EXPLAINABILITY SURFACE ARCHITECTURE  
**Status:** COMPLETE  
**Date:** 2026-05-08  
**Baseline:** governed-dpsig-baseline-v1 (092e251)  
**Upstream authority:** PI.LENS.GEIOS.PRODUCTIZATION-BRIDGE.01 (4e2a9e2)  
**Upstream schema:** PI.LENS.NEXTGEN-REPORTS.REPORT-OBJECT-MODEL.01 (e588150)  
**Upstream normalization:** PI.LENS.NEXTGEN-REPORTS.COGNITIVE-NORMALIZATION-INTEGRATION.01 (775d7c1)  
**Execution mode:** CREATE_ONLY  
**Implementation target:** Phase 2 — Interactive Executive Intelligence Reports  

---

## 1. Executive Summary

The Evidence Panel and Explainability Surface Architecture defines the formal contract for rendering LENS NextGen's seven-panel explainability bundle as executive-grade intelligence interrogation surfaces.

The seven panels — WHY, EVIDENCE, TRACE, QUALIFIERS, LINEAGE, CONFIDENCE, and READINESS_STATE — are not optional features. They are the evidence-first accountability structure of every report. Each panel exposes a specific dimension of the governed intelligence derivation chain, in executive language, at the appropriate audience depth, from pre-rendered committed evidence. No panel generates content at render time. No panel rewrites or reinterprets the report object. No panel suppresses qualifiers.

This architecture transforms the explainability bundle defined in the Report Object Model into bounded, deterministic, evidence-first interrogation surfaces that an executive can navigate to verify every visible assertion.

---

## 2. Explainability Philosophy

### 2.1 Core Principle

> **Every visible intelligence assertion must have a traceable evidence lineage.**

This is not a design goal — it is a governance requirement. An assertion that cannot be traced to a committed evidence artifact must not appear in the executive surface. The explainability panels are the mechanism by which this traceability is made accessible.

### 2.2 Explainability Is Not Conversation

LENS explainability is not a question-answering system. It is an interrogation architecture. The executive navigates governed evidence, not a generative AI. The structure of the interrogation is:

- Fixed (determined by the report_object)
- Pre-rendered (committed at generation time)
- Evidence-bound (every statement traces to an evidence artifact)
- Qualifier-preserved (no scope limitation is hidden)

The interrogation model is: the executive asks questions by navigating structure. The panels are the answers.

### 2.3 Explainability Cannot Generate Intelligence

The explainability layer is a rendering layer. It transforms pre-rendered panel content from the report_object into visible surfaces. It does not:

- Generate new assertions
- Compute new inferences
- Supplement missing evidence
- Reinterpret existing evidence
- Upgrade or downgrade qualifiers

If a panel's content is absent in the report_object, the panel renders a BLOCKED or DIAGNOSTIC state — it does not improvise.

### 2.4 Progressive Disclosure Is Not Information Removal

Progressive disclosure manages density. It collapses panels and drawers by default so that the executive surface is navigable without cognitive overload. Collapse is a display state — no evidence is removed when a panel is collapsed. An executive who expands any collapsed element finds the committed, evidence-bound content waiting for them, unchanged.

### 2.5 Interrogation-First Interaction Doctrine

| Forbidden Interaction Form | Allowed Alternative |
|---------------------------|-------------------|
| Free-form text query | Panel navigation and expansion |
| AI-generated follow-up | Pre-rendered evidence drawer |
| Conversational clarification | Qualifier tooltip (pre-rendered) |
| "Tell me more" prompting | Expand to EVIDENCE drawer |
| Confidence percentage slider | Grounding scope indicator (qualitative) |
| Regenerate with different parameters | Audit trace to evidence_object_hash |

---

## 3. Explainability Architecture

### 3.1 System Overview

```
GEIOS GENERATION SIDE:
  L5 Evidence assembly
  L6 Cognitive normalization (ALI + Q-taxonomy applied)
  L7 LLM narrative generation (vocabulary contract applied)
  L8 Explainability bundle pre-rendering
  ↓
  report_object.explainability_bundle [COMMITTED + SEALED]
                    ↓
BRIDGE (evidence_object_hash verified)
                    ↓
LENS RENDERING SIDE:
  BridgeValidator: verify hash, verify governance_verdict
  ExplainabilityAdapter: transform committed panels → display objects
  Panel Renderer: apply display state (COLLAPSED / EXPANDED / BLOCKED / DIAGNOSTIC)
  Audience Filter: apply visibility tier (EXECUTIVE / ADVISORY / AUDIT)
  Evidence Drawer: expand committed EvidenceBlock content
                    ↓
  Executive Surface: 7-panel explainability bundle (read-only)
```

### 3.2 Explainability Bundle Structure

The explainability bundle is the collection of all seven panels, pre-rendered in the report_object at generation time. At the LENS rendering layer, the bundle is:

- Read (from report_object.explainability_bundle)
- Validated (evidence_object_hash verified)
- Filtered (audience tier applied)
- Displayed (panel state applied: COLLAPSED / EXPANDED / BLOCKED / DIAGNOSTIC)

The bundle is never re-computed, re-ordered, or supplemented at render time.

### 3.3 Panel Identity Contract

| Panel ID | Audience Default | Phase 2 Default State | Content Source |
|----------|-----------------|----------------------|----------------|
| WHY | EXECUTIVE | EXPANDED (visible) | narrative_block.why_section |
| EVIDENCE | EXECUTIVE | COLLAPSED (expandable) | evidence_blocks[] |
| TRACE | ADVISORY | COLLAPSED (collapsed by default) | trace_block |
| QUALIFIERS | EXECUTIVE (if Q-01..Q-04) | EXPANDED if qualifier active | qualifier_class + Q-taxonomy |
| LINEAGE | ADVISORY | COLLAPSED | trace_linkage |
| CONFIDENCE | EXECUTIVE | COLLAPSED | evidence_blocks[].grounding_status |
| READINESS_STATE | EXECUTIVE | EXPANDED (visible) | readiness_state + header_block |

### 3.4 Panel Rendering Lifecycle

Each panel follows this lifecycle:

```
1. LOAD
   Read panel content from report_object.explainability_bundle[panel_id]

2. VALIDATE
   Verify evidence_object_hash (BridgeValidator)
   Verify governance_verdict (if FAIL → BLOCKED)
   Check panel content present (if absent → BLOCKED for required; DIAGNOSTIC for optional)

3. FILTER
   Apply audience tier visibility rules
   Apply Q-04 suppression notice rules

4. COMPOSE
   Apply cognitive normalization (PASS-THROUGH — content already normalized at generation)
   Apply design tokens from pre-normalized labels

5. STATE
   Determine panel state: COLLAPSED | EXPANDED | BLOCKED | DIAGNOSTIC
   Apply default state per panel identity contract

6. RENDER
   Render panel header + content + interaction affordances
   Render BLOCKED notice if state = BLOCKED
   Render DIAGNOSTIC notice if state = DIAGNOSTIC
   Render qualifier chips + tooltips

7. DELIVER
   Panel delivered to client as read-only display object
   No mutable fields exposed to client
```

### 3.5 Evidence Integrity Enforcement

The evidence integrity chain:

```
GENERATION TIME:
  evidence_object_hash = hash(evidence_envelope)
  Committed to report_object
  Immutable from this point

BRIDGE CROSSING:
  BridgeValidator verifies evidence_object_hash
  Hash mismatch → BLOCKED (all panels)
  Hash absent → BLOCKED (all panels)

PANEL RENDER TIME:
  Panel content sourced only from committed report_object
  No supplementation from any other source
  Any content not in report_object → BLOCKED (panel-specific)
```

---

## 4. WHY Panel Architecture

### 4.1 Purpose

The WHY panel answers the primary executive interrogation question: *"Why does this readiness state exist?"*

The WHY panel is the primary evidence-first justification surface. It bridges the readiness badge (the verdict) to the evidence base (the proof).

### 4.2 Panel Content Structure

```
WHY PANEL:
├── Panel Title: "Why This Readiness State"  [vocabulary_contract: explainability_vocabulary.panel_titles.WHY]
├── Primary Causal Statement:
│   "{pre-rendered causal explanation from narrative_block.why_section}"
│   [Source: NORM-NARR-01..04 normalized; vocabulary contract applied]
│   [SENTENCE RULE: conclusion first; max 25 words/sentence; no predictive language]
├── Contributing Signals:
│   ├── SignalContributor:
│   │   ├── domain_alias: "{ALI-04 alias}"  [NORM-ALI-04]
│   │   ├── signal_label: "{ALI-01 or ALI-02 alias}"  [NORM-ALI-01/02]
│   │   ├── pressure_label: "{NORM-PROP-01 tier label}"
│   │   └── role: "Origin of Pressure" | "Pressure Receiver" | "Pressure Pass-through" | "Independent Domain"
│   └── [repeats per contributing signal from evidence_blocks]
└── Qualifier Notice (conditional):
    Renders only when qualifier_class ∈ {Q-01, Q-02, Q-03}
    "{Q-taxonomy scope note per NORM-Q-01..04}"
    Q-04: Renders as absence notice — "Some signals withheld from this view"
```

### 4.3 Content Rules

| Rule | Requirement |
|------|-------------|
| Content source | `narrative_block.why_section` only — pre-rendered at generation |
| No live generation | Panel opens to committed content; no AI generation at open time |
| Qualifier notice | Renders when qualifier_class ≠ Q-00 |
| Qualifier Q-04 | Renders absence notice — never silently absent |
| Raw values | No raw TAXONOMY-01 values; no raw signal keys; no numerical signal values |
| Predictive language | Forbidden — NORM-FORBID-01 applies |
| Recommendation language | Forbidden — NORM-FORBID-02 applies |
| Speculative language | Forbidden — NORM-FORBID-03 applies |

### 4.4 WHY Panel — Qualifier-Aware Rendering

| Qualifier | WHY Panel Behavior |
|-----------|-------------------|
| Q-00 | No qualifier notice; clean causal explanation |
| Q-01 | Qualifier notice: "Analysis based on {n} of {total} grounded domains" |
| Q-02 | Qualifier notice: "Structural topology confirmed. Semantic depth reflects available grounding." |
| Q-03 | Diagnostic frame applied: "Advisory confirmation recommended." Diagnostic indicator on panel |
| Q-04 | Absence notice: "Signal intelligence withheld from this view." Section marked absent |

### 4.5 Phase 2 vs Phase 3 Behavior

| Phase | WHY Panel Behavior |
|-------|-------------------|
| Phase 2 | Static section; always visible; pre-rendered content only |
| Phase 3 | Slide-out drawer from explainability sidebar; same content rules; adds progressive disclosure from primary to contributing signals |

### 4.6 Prohibited WHY Panel Behaviors

- Generating causal explanation text at panel-open time
- Linking to external systems for "more context"
- Allowing free-form annotation or notes
- Presenting confidence percentages
- Showing comparative assessments ("worse than last period") without grounded comparative evidence
- Reordering contributing signals based on user preference

---

## 5. EVIDENCE Drawer Architecture

### 5.1 Purpose

The EVIDENCE drawer provides domain-level evidence depth for each contributing domain. It is the primary mechanism for verifying that the WHY panel's causal claims are grounded in committed structural evidence.

### 5.2 Evidence Drawer Structure

```
EVIDENCE DRAWER (one per domain in evidence_blocks[]):
├── Drawer Header: "{domain_alias} — Evidence"  [ALI-04 alias applied]
│   ├── Expand/Collapse affordance  [EXPAND_COLLAPSE interaction]
│   └── Grounding Status chip: "{qualifier_label}"  [NORM-Q-01..04]
├── Signal Cards (when expanded):
│   └── SignalCard (per signal in evidence_blocks[].signal_cards[]):
│       ├── signal_label: "{ALI-01/02 alias}"
│       ├── pressure_label: "{NORM-PROP-01 tier label}"
│       ├── qualifier_chip: "{NORM-Q label}" (if qualifier active; empty string if Q-00)
│       └── evidence_text: "{NORM-NARR-02 normalized evidence text}"
├── Propagation Role:
│   "{NORM-PROP-01 role label}"  [ORIGIN / RECEIVER / PASS-THROUGH / ISOLATED]
└── Domain Evidence Summary:
    "{evidence_blocks[].evidence_description}"  [vocabulary contract applied]
```

### 5.3 Evidence Grouping Rules

| Rule | Requirement |
|------|-------------|
| One drawer per evidence domain | Each entry in `evidence_blocks[]` gets one drawer |
| Ordering | Ordered by propagation role: ORIGIN first, RECEIVER next, PASS_THROUGH next, ISOLATED last |
| Default state | Collapsed — all drawers closed by default |
| Expand trigger | Click/tap drawer header — pure display state change |
| No computation at expand | Evidence content already committed; no rendering computation |
| Grounding status chip | Always visible in drawer header (not hidden when collapsed) |

### 5.4 Evidence Hierarchy

```
EVIDENCE HIERARCHY:

Level 1 — Report Surface (always visible):
  Domain evidence count + top contributing domain alias
  Qualifier chips (summary)

Level 2 — Evidence Drawer Header (visible, collapsed by default):
  Domain alias + grounding status chip
  Click to expand

Level 3 — Evidence Drawer Detail (expanded):
  Signal cards per domain
  Propagation role
  Domain evidence summary

Level 4 — EVIDENCE Panel (explainability sidebar):
  All evidence drawers accessible
  Propagation path summary
  Grounding scope for each domain
```

### 5.5 Grounding Visibility Rules

| Grounding Status | Drawer Display |
|-----------------|---------------|
| FULL | "Full Grounding" chip (green) |
| PARTIAL | "Partial Coverage ({n} of {total} domains)" chip (amber) |
| STRUCTURAL | "Structural View" chip (blue) |
| DIAGNOSTIC | "Under Review" chip (grey) |
| SUPPRESSED | Absence notice; no drawer expansion available |

### 5.6 Prohibited EVIDENCE Drawer Behaviors

- Dynamically fetching additional evidence at drawer open time
- Allowing evidence to be annotated, flagged, or modified
- Showing raw domain IDs or cluster keys instead of aliases
- Allowing cross-domain evidence comparison without committed propagation data
- Hiding evidence from drawers based on surface mode

---

## 6. TRACE Panel Architecture

### 6.1 Purpose

The TRACE panel provides the propagation path and derivation lineage reference for advisory and audit-tier review. It answers: *"How did structural pressure flow, and where did this analysis come from?"*

### 6.2 Panel Content Structure

```
TRACE PANEL:
├── Panel Title: "Analysis Trace"  [vocabulary_contract: explainability_vocabulary.panel_titles.TRACE]
├── Propagation Path:
│   [domain_alias_1] → [domain_alias_2] → [domain_alias_3]
│   [Source: trace_block.propagation_path; ALI-04 aliases applied; raw cluster keys forbidden]
├── Propagation Summary:
│   "{trace_block.propagation_summary}"  [NORM-PROP-01..03 normalized]
├── Analysis Basis:
│   ├── Baseline: "{trace_block.baseline_ref}"  [readable label; not decoded]
│   └── Stream Reference: "{trace_linkage.stream_anchor}"  [reference label only]
└── Derivation Reference:
    "{trace_linkage.derivation_hash}"  [reference ID only; first 8 chars + "..."; never decoded]
    Audience: ADVISORY only (hidden from EXECUTIVE default)
```

### 6.3 Audience Visibility

| Element | Executive | Advisory | Audit |
|---------|-----------|----------|-------|
| Propagation path | YES | YES | YES |
| Propagation summary | YES | YES | YES |
| Baseline reference | NO (collapsed) | YES | YES |
| Stream reference | NO | Reference label | Full value |
| Derivation reference | NO | Abbreviated (8 chars + "...") | Full value |
| Run identifier | NO | NO | YES |

### 6.4 Collapsed-by-Default Behavior

The TRACE panel is **collapsed by default** in the executive view. The reasoning:

- Propagation trace is verification-grade content, not primary intelligence
- Executives who need it (advisory/audit) expand it explicitly
- Auto-expanding TRACE for all executives increases cognitive load without intelligence value
- Collapsed default respects executive time; expanded default respects advisory rigor

### 6.5 No Raw Derivation Exposure

The TRACE panel exposes derivation references only as opaque reference identifiers:

| Element | What Is Shown | What Is Forbidden |
|---------|--------------|-----------------|
| derivation_hash | First 8 chars + "..." (abbreviated) | Full hash decoded or explained |
| evidence_object_hash | Abbreviated in advisory; full in audit | Decoded interpretation |
| stream_anchor | Reference label | Internal stream mechanics |
| baseline_anchor | Readable baseline label | Internal baseline mechanics |

---

## 7. QUALIFIERS Panel Architecture

### 7.1 Purpose

The QUALIFIERS panel communicates the evidence scope limitations that govern the current readiness assessment. It answers: *"What is the scope of this analysis, and what is the basis for any qualifications?"*

### 7.2 Qualifier Chip Rendering

| Qualifier | Chip Label | Chip Style | Visibility |
|-----------|-----------|-----------|-----------|
| Q-00 | No chip rendered | N/A | N/A |
| Q-01 | "Partial Grounding" | Amber chip | Readiness badge + QUALIFIERS panel |
| Q-02 | "Structural View" | Blue chip | Readiness badge + relevant modules + QUALIFIERS panel |
| Q-03 | "Under Review" | Grey chip | Readiness badge + QUALIFIERS panel; diagnostic frame on report |
| Q-04 | No chip | N/A | Absence notice rendered; QUALIFIERS panel shows absence notice |

### 7.3 Panel Content Structure

```
QUALIFIERS PANEL:
├── Panel Title: "Evidence Scope"  [vocabulary_contract: explainability_vocabulary.panel_titles.QUALIFIERS]
├── Qualifier State:
│   "{chip_label}"  [from Q-taxonomy; never raw Q-xx enum]
├── Scope Explanation:
│   "{Q-taxonomy scope note}"  [pre-rendered from explainability_bundle.qualifiers_panel]
├── Affected Domains:
│   [List of domain_alias values with partial/diagnostic grounding]
│   [ALI-04 aliases applied; raw domain IDs forbidden]
└── Q-04 Absence Notice (if applicable):
    "Signal intelligence withheld from this view."
    [Mandatory — cannot be suppressed]
```

### 7.4 Qualifier Visibility Rules — Mandatory

Qualifier display is mandatory under the following conditions:

| Condition | Required Action |
|-----------|----------------|
| qualifier_class = Q-01 | Amber chip on readiness badge; chip on relevant signal cards; Q-01 text in QUALIFIERS panel |
| qualifier_class = Q-02 | Blue chip on relevant modules; structural scope note in QUALIFIERS panel |
| qualifier_class = Q-03 | Grey chip on readiness badge; diagnostic frame; advisory notice in QUALIFIERS panel |
| qualifier_class = Q-04 | Absence notice in QUALIFIERS panel; absence indicator in affected section; never silently absent |
| qualifier_class = Q-00 | No chip; clean surface; QUALIFIERS panel content minimal |

### 7.5 Suppression Prohibition

Qualifier suppression is **absolutely prohibited**:

- Q-04 **must** render an absence notice — blank section with zero explanation is a governance violation
- Q-03 **must** apply a diagnostic frame — rendering as Q-00 is a governance violation
- Q-01 chips **must not** be hidden to preserve aesthetic simplicity
- No conditional logic in LENS may silence a qualifier that is present in the report_object

### 7.6 Uncertainty Communication Rules

| Allowed | Forbidden |
|---------|----------|
| "Analysis based on {n} of {total} grounded domains" | "Possibly incomplete" |
| "Structural topology confirmed" | "We're not sure" |
| "Under structural review" | "Uncertain" |
| "Signal intelligence withheld from this view" | "Data unavailable" (without context) |
| Q-taxonomy chip labels | Raw Q-01, Q-02 text values |

Uncertainty is communicated as scope description — not as doubt, apology, or ambiguity.

---

## 8. LINEAGE Panel Architecture

### 8.1 Purpose

The LINEAGE panel provides the evidence provenance chain for advisory and audit-tier verification. It answers: *"Where did this analysis originate, and can it be reproduced?"*

### 8.2 Panel Content Structure

```
LINEAGE PANEL:
├── Panel Title: "Analysis Provenance"  [vocabulary_contract: explainability_vocabulary.panel_titles.LINEAGE]
├── Baseline Reference:
│   "{trace_linkage.baseline_anchor}"  [readable label; never decoded]
│   Example: "governed-dpsig-baseline-v1"
├── Report Linkage:
│   ├── Report ID: "{report_id}"  [identifier; not decoded]
│   └── Generation Timestamp: "{rendering_metadata.generated_at}"
├── Evidence Anchor:
│   ├── Evidence Hash: "{trace_linkage.evidence_object_hash}"
│   │   Executive: NOT SHOWN
│   │   Advisory: Abbreviated (first 8 chars + "...")
│   │   Audit: Full value
│   └── Derivation Hash: "{trace_linkage.derivation_hash}"
│       Executive: NOT SHOWN
│       Advisory: NOT SHOWN
│       Audit: Reference ID only (never decoded)
├── Stream Anchor:
│   "{trace_linkage.stream_anchor}"
│   Executive: NOT SHOWN
│   Advisory: Reference label
│   Audit: Full value
└── Run Identifier:
    "{trace_linkage.run_id}"
    Executive: NOT SHOWN
    Advisory: NOT SHOWN
    Audit: YES
```

### 8.3 evidence_object_hash Exposure Semantics

The evidence_object_hash is the integrity anchor for the entire evidence envelope:

| Audience | What Is Shown | Purpose |
|----------|--------------|---------|
| Executive | Not shown | Not relevant to executive interrogation |
| Advisory | Abbreviated (8 chars + "...") | Enables cross-report correlation without full hash |
| Audit | Full value | Replay verification; chain-of-custody audit |

The evidence_object_hash is **never decoded, explained, or interpreted** in any client surface. It is rendered as an opaque identifier. Any rendering that attempts to explain what the hash means constitutes a GEIOS internal exposure violation.

### 8.4 Lineage Immutability

The lineage panel is strictly read-only:

- No link to "regenerate with updated lineage"
- No link to external pipeline systems
- No comparison with previous report lineage unless comparative data is in the report_object
- Hash values are rendered as text — they are not interactive links

---

## 9. CONFIDENCE Panel Architecture

### 9.1 Purpose

The CONFIDENCE panel communicates the structural grounding depth of the analysis. It answers: *"How comprehensively is this analysis grounded in evidence, and where are the gaps?"*

### 9.2 Grounding-Depth Semantics

The CONFIDENCE panel uses structural grounding language — never probabilistic confidence scoring:

| Forbidden Form | Allowed Form |
|---------------|-------------|
| "87% confidence" | "Full Grounding" (Q-00) |
| "Confidence: HIGH" | "Partial Coverage ({n} of {total} domains)" (Q-01) |
| "Confidence bar: 6/10" | "Structural View" (Q-02) |
| "Low confidence" | "Under Review" (Q-03) |
| "Confidence: Unknown" | "Signal intelligence withheld from this view" (Q-04) |

Confidence is grounding scope — not probabilistic certainty. The CONFIDENCE panel does not produce or render any numerical probability estimate.

### 9.3 Panel Content Structure

```
CONFIDENCE PANEL:
├── Panel Title: "Coverage Confidence"  [vocabulary_contract: explainability_vocabulary.panel_titles.CONFIDENCE]
├── Overall Grounding Scope:
│   "{grounding label per NORM-Q-01..04}"
├── Domain Coverage Detail:
│   [Per evidence_blocks[] entry]:
│   ├── "{domain_alias}": "{grounding_label}"
│   └── [Q-taxonomy chip if partial or structural]
├── Evidence Scope Note:
│   "{grounding scope explanation — pre-rendered}"
│   [From explainability_bundle.confidence_panel]
└── Grounding Limitation Note (if Q-01..Q-03):
    "{Q-taxonomy scope note appropriate to qualifier_class}"
    [Never apologetic; scope-statement only]
```

### 9.4 Non-Probabilistic Confidence Communication Rules

| Rule | Requirement |
|------|-------------|
| No percentages | Numerical confidence percentages are forbidden in all surfaces |
| No confidence bars | Visual progress bars representing confidence are forbidden |
| No comparative confidence | "Higher/lower confidence than last report" without grounded comparative evidence is forbidden |
| No confidence scoring | Ordinal confidence scores (1-5, HIGH/MEDIUM/LOW as probability proxies) are forbidden |
| Grounding-first language | Coverage is framed as structural grounding scope, not probabilistic accuracy |

### 9.5 Diagnostic Absent-Data Communication

If grounding data is absent from the report_object (e.g., evidence_blocks[].grounding_status missing):

- Panel renders DIAGNOSTIC state: "Grounding data unavailable for this report"
- Does not fabricate a grounding score
- Does not default to a "best estimate" confidence value

---

## 10. READINESS_STATE Panel Architecture

### 10.1 Purpose

The READINESS_STATE panel provides the detailed explanation of the readiness classification. It answers: *"What is the formal basis for this readiness classification, and what does it mean for this organization?"*

### 10.2 Readiness Explanation Structure

```
READINESS_STATE PANEL:
├── Panel Title: "Readiness Classification Detail"
│   [vocabulary_contract: explainability_vocabulary.panel_titles.READINESS_STATE]
├── Readiness Label:
│   "{ALI-03 executive label}"  [never raw ReadinessState enum]
│   Example: "Executive Ready — Qualified" (not "EXECUTIVE_READY_WITH_QUALIFIER")
├── Governance Basis:
│   "Readiness classification: {governance_verdict}"  [PASS or FAIL]
│   [PASS = classification is governance-verified; FAIL = BLOCKED rendering applies]
├── Readiness Evidence Linkage:
│   "This classification is derived from:"
│   [List of contributing evidence domains — ALI-04 aliases]
│   [Grounding status per domain — Q-taxonomy labels]
├── Qualifier Linkage:
│   "{Q-taxonomy qualifier explanation if qualifier_class ≠ Q-00}"
│   [Scope limitation stated; never apologetic]
├── Governance Linkage:
│   [Baseline reference label]
│   [Stream reference label]
│   [NOT governance internals — reference labels only]
└── Re-engagement Notice (for SUPPRESSED_FROM_EXECUTIVE, DIAGNOSTIC_ONLY):
    "Advisory confirmation recommended before executive action."
    [Only for Q-03/Q-04 states; never for Q-00/Q-01/Q-02]
```

### 10.3 Readiness State Rendering Rules

| ReadinessState | Executive Label | Panel Behavior |
|----------------|----------------|----------------|
| EXECUTIVE_READY | "Executive Ready" | Full panel; no qualifier notice |
| EXECUTIVE_READY_WITH_QUALIFIER | "Executive Ready — Qualified" | Full panel; qualifier linkage rendered |
| DIAGNOSTIC_ONLY | "Under Structural Review" | Diagnostic frame; advisory notice rendered |
| SUPPRESSED_FROM_EXECUTIVE | "Not Available" | Absence notice; suppression explanation rendered |
| BLOCKED_PENDING_DOMAIN_GROUNDING | "Pending Grounding" | BLOCKED panel; grounding scope note |

### 10.4 Blocked-State Rendering

When `governance_verdict = FAIL` or when BridgeValidator fails:

```
BLOCKED PANEL STATE:
├── Blocked Notice: "Readiness classification unavailable"
├── Reason: [Governance verdict: FAIL] or [Evidence integrity: UNVERIFIED]
├── Action Available: View Audit trace (TRACE panel)
└── No Readiness Label: Panel does not render a readiness state label
```

Blocked state is explicit. Silent degradation to a lower readiness state is a governance violation.

### 10.5 Diagnostic Rendering

When readiness state is DIAGNOSTIC_ONLY:

- Diagnostic indicator applied to readiness badge
- READINESS_STATE panel renders with advisory frame
- Panel content available; advisory confirmation notice appended
- Signal cards rendered in diagnostic style — still evidence-bound

---

## 11. Audience Visibility Model

### 11.1 Three-Tier Audience Model

The explainability architecture supports three distinct visibility tiers:

| Tier | Description | Access Level |
|------|-------------|-------------|
| EXECUTIVE | C-suite / board-level reader; needs intelligence, not mechanics | Primary intelligence surfaces; qualifiers; summary evidence |
| ADVISORY | Senior advisor / investment committee; needs depth and verification | All executive content + expanded panels + lineage references |
| AUDIT | Governance / compliance reviewer; needs full provenance | All content + hash values + derivation references + run IDs |

### 11.2 Panel Visibility by Audience Tier

| Panel | Executive | Advisory | Audit |
|-------|-----------|----------|-------|
| WHY | EXPANDED (always visible) | EXPANDED | EXPANDED |
| EVIDENCE | COLLAPSED (expandable) | EXPANDED | EXPANDED |
| TRACE | COLLAPSED (not shown by default) | COLLAPSED (expandable) | EXPANDED |
| QUALIFIERS | EXPANDED if Q-01..04 active | EXPANDED | EXPANDED |
| LINEAGE | NOT SHOWN | COLLAPSED (expandable) | EXPANDED |
| CONFIDENCE | COLLAPSED (expandable) | EXPANDED | EXPANDED |
| READINESS_STATE | EXPANDED (always visible) | EXPANDED | EXPANDED |

### 11.3 Field Visibility by Audience Tier

| Field | Executive | Advisory | Audit |
|-------|-----------|----------|-------|
| evidence_object_hash | NOT SHOWN | Abbreviated | Full value |
| derivation_hash | NOT SHOWN | NOT SHOWN | Reference ID |
| stream_anchor | NOT SHOWN | Reference label | Full value |
| run_id | NOT SHOWN | NOT SHOWN | Full value |
| governance_verdict | As status label | PASS/FAIL | Full record |
| baseline_anchor | NOT SHOWN | Readable label | Full value |

### 11.4 Audience Tier Enforcement

Audience tier is applied at the LENS rendering layer. The report_object carries audience annotations per field and per panel. The LENS renderer:

- Filters content to the appropriate tier
- Does not expose higher-tier fields to lower-tier audiences
- Does not allow client-side tier elevation
- Audience tier is set at session initialization — not at panel-open time

---

## 12. Progressive Disclosure Model

### 12.1 Disclosure Layers

Progressive disclosure operates across five layers, from least to most detailed:

```
LAYER 1 — PRIMARY (always visible; highest priority):
  Readiness badge + state label + qualifier chip
  → No action required; always rendered

LAYER 2 — INTELLIGENCE (always visible; high priority):
  Executive summary narrative
  WHY section (primary causal statement)
  READINESS_STATE panel (collapsed to badge; expandable)
  → Always rendered in executive view

LAYER 3 — EVIDENCE SUMMARY (visible; medium priority):
  Domain evidence count + top contributing domain
  Signal card summary (count per domain)
  QUALIFIERS panel (if qualifier active)
  CONFIDENCE panel (grounding scope chip)
  → Rendered; expandable to full detail

LAYER 4 — EVIDENCE DEPTH (expandable):
  Full evidence drawers (per domain)
  Full signal cards
  Propagation path detail
  EVIDENCE panel (full explainability bundle)
  → Click to expand; content pre-rendered

LAYER 5 — AUDIT DEPTH (collapsed/hidden by default):
  TRACE panel (propagation path + lineage refs)
  LINEAGE panel (full provenance)
  Derivation reference identifiers
  Run identifier (audit tier only)
  → Requires explicit expand action; some elements gated by audience tier
```

### 12.2 Default State by Phase

| Phase | Default Disclosure Level |
|-------|------------------------|
| Phase 2 | Layers 1–2 always visible; Layer 3 visible; Layers 4–5 collapsed |
| Phase 3 | Slide-out panels for Layers 3–4; workspace context determines defaults |
| Phase 4 | Investigation flows from Layer 4–5; progressive disclosure extended |
| Phase 5 | Conversational entry point added (Phase 5 only) — does not change underlying structure |

### 12.3 Collapse/Expand Governance

Collapse and expand are **display state changes only**:

- No evidence computation occurs at expand time
- No evidence is loaded from external sources at expand time
- Collapsed state retains all panel content in the DOM (or equivalent)
- Expand/collapse state is ephemeral — no session persistence in Phase 2
- Collapse cannot remove evidence from the evidence_object (topology immutability rule)

---

## 13. Deterministic Rendering Guarantees

### 13.1 Same Report Object → Same Rendering

The explainability rendering is deterministic:

```
DETERMINISM GUARANTEE:
Given:
  report_object = R
  audience_tier = T
  phase = P
→ render(R, T, P) always produces the same panel structure
→ render(R, T, P) always produces the same content
→ render(R, T, P) always produces the same qualifier visibility
→ render(R, T, P) always produces the same blocked/diagnostic states
```

This guarantee requires:

- No stochastic content generation at render time
- No external state injection (session context does not alter content)
- No dynamic qualifier computation at render time
- No runtime ALI rule application

### 13.2 Content Immutability After Bridge Crossing

Once the report_object crosses the bridge (evidence_object_hash sealed):

- Panel content is immutable
- Qualifier class is immutable
- Readiness state is immutable
- Evidence blocks are immutable
- LENS cannot modify any of these fields
- A second rendering of the same report_object produces identical panels

### 13.3 Panel State Determinism

Panel states (COLLAPSED / EXPANDED / BLOCKED / DIAGNOSTIC) are determined by:

| Determinant | Panel State Effect |
|-------------|-------------------|
| evidence_object_hash missing | ALL panels → BLOCKED |
| governance_verdict = FAIL | Readiness module → BLOCKED |
| Panel content absent in report_object | Panel → BLOCKED (required) or DIAGNOSTIC (optional) |
| qualifier_class = Q-04 | QUALIFIERS panel → Absence notice |
| qualifier_class = Q-03 | WHY + READINESS_STATE → Diagnostic frame |
| normalization_version mismatch | Narrative panels → DIAGNOSTIC |

Panel state is not a UX decision — it is a governance output.

---

## 14. Governance Preservation

### 14.1 Governance Preservation Rules

| Rule ID | Rule | Enforcement |
|---------|------|------------|
| EPA-GOV-01 | No panel generates content at render time | All content sourced from report_object only |
| EPA-GOV-02 | No panel suppresses qualifiers | Q-00..Q-04 always reflected; suppression_prohibited = true |
| EPA-GOV-03 | No panel reinterprets readiness state | readiness_state is PROHIBITED from modification |
| EPA-GOV-04 | No panel exposes GEIOS internals | Audience tier filtering; forbidden vocabulary enforced |
| EPA-GOV-05 | Evidence integrity verified before any rendering | BridgeValidator: hash check first |
| EPA-GOV-06 | Blocked state is explicit, never silent | BLOCKED notice rendered; no degradation |
| EPA-GOV-07 | Diagnostic state is explicit, never silent | DIAGNOSTIC notice rendered; advisory frame |
| EPA-GOV-08 | Audience tier enforced at render | No client-side tier elevation |
| EPA-GOV-09 | Topology is read-only display | No topology mutation via any panel interaction |
| EPA-GOV-10 | Deterministic rendering required | Same report_object → same panels, always |

### 14.2 What Explainability Cannot Do

| Prohibited Action | Governance Basis |
|------------------|-----------------|
| Generate new narrative text | EPA-GOV-01; ROM-VAL-18 |
| Supplement missing evidence | EPA-GOV-01; EF-01..05 (evidence-first doctrine) |
| Upgrade a qualifier | EPA-GOV-02; NORM-Q-01..04 |
| Downgrade a qualifier | EPA-GOV-02; NORM-Q-01..04 |
| Recompute readiness state | EPA-GOV-03; readiness_state PROHIBITED |
| Expose raw signal keys | EPA-GOV-04; NORM-ALI-01..02 |
| Expose GEIOS layer identifiers | EPA-GOV-04; forbidden_vocabulary category_A |
| Silently degrade blocked state | EPA-GOV-06; EXP-BLOCK-01..02 |
| Change panel content based on session | EPA-GOV-10; NORM-DET-01..02 |
| Allow topology modification | EPA-GOV-09; TP-BRIDGE-01..05 |

### 14.3 Phase 2 Restrictions

The following capabilities are explicitly **not present** in Phase 2:

| Capability | Phase Available | Status in Phase 2 |
|-----------|----------------|-------------------|
| Evidence drawer (interactive) | Phase 2 | EXPAND_COLLAPSE only — display state |
| Investigation flow | Phase 4 | NOT ACTIVE — placeholder registered |
| Copilot entry | Phase 5 | NOT ACTIVE — COPILOT_ENTRY interaction_registry entry is active: false |
| Free-form query | Phase 5 | NOT ACTIVE |
| Comparative analysis | Phase 4 | NOT ACTIVE |
| Real-time data refresh | Phase 3+ | NOT ACTIVE |

All Phase 3+ capabilities are registered as inactive in the interaction_registry. The explainability architecture prepares slots for these capabilities without activating them.

---

## 15. Validation

See `EVIDENCE_PANEL_VALIDATION.md` for the complete validation record.

**Validation verdict:** EVIDENCE_PANEL_ARCHITECTURE_VIABLE  
**All seven panels defined:** PASS  
**Explainability schema created:** PASS  
**Rules registry created (30 rules):** PASS  
**Interaction model created:** PASS  
**Governance preservation:** PASS  
**No code implementation:** PASS  

---

*Stream PI.LENS.NEXTGEN-REPORTS.EVIDENCE-PANEL-ARCHITECTURE.01 — COMPLETE*  
*Baseline: governed-dpsig-baseline-v1 (092e251)*  
*Issued: 2026-05-08*
