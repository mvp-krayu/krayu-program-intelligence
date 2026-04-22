# TIER2.WORKSPACE.MODEL.01 — Tier-2 Diagnostic Workspace Product Definition

**Stream:** TIER2.WORKSPACE.MODEL.01  
**Authority:** brain/product  
**Status:** DEFINITION — NOT IMPLEMENTED  
**Depends on:** TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01, TIER2.TRACE.QUERY.CONTRACT.01, TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01

---

## Product Statement

The Tier-2 Diagnostic Workspace is the primary interactive surface for structural investigation within a LENS Assessment. Reports are projections from this workspace, not the workspace itself. The workspace is zone-led, evidence-bounded, and controlled-query-only.

---

## A. ENTRY SURFACE

When a user enters Tier-2, they see a workspace header followed immediately by the Zone Inventory.

**Header block contains:**
- Run context lock: run ID, assessment score, band, confidence range
- Evidence scope status: FULL / PARTIAL / BOUNDED
- Coverage status: COMPLETE / INCOMPLETE (with reason if INCOMPLETE)
- Zone count by severity: HIGH / MODERATE / LOW
- Traceability summary: FULLY_TRACEABLE / PARTIALLY_TRACEABLE / NOT_TRACEABLE counts
- inference_prohibition: ACTIVE — always visible, always first in header

**Entry points:**
- Zone Inventory immediately follows the header
- No intermediate selection required
- Zones are directly actionable from entry

---

## B. ZONE INVENTORY AS PRIMARY SURFACE

The Zone Inventory is the primary navigation surface of the workspace — not a summary view.

**Zone list structure:**
- Each zone rendered as a navigable item, not a read-only row
- Each item shows: zone_id, domain name, zone_type, severity, confidence, traceability_status, condition preview (≤130 chars)
- Items are selectable — selection opens the Zone Workspace

**Sorting rules (fixed precedence):**
1. Focus zone (DOMAIN-10 or designated focus domain) always first
2. Remaining zones sorted by severity: HIGH → MODERATE → LOW
3. Within same severity: PARTIALLY_TRACEABLE before NOT_TRACEABLE

**Filtering dimensions (user-controlled):**
- severity: HIGH / MODERATE / LOW (multi-select)
- zone_type: pressure_concentration / evidence_gap / signal_conflict / structural_inconsistency
- traceability: FULLY_TRACEABLE / PARTIALLY_TRACEABLE / NOT_TRACEABLE

**Visible without interaction (collapsed state):**
- zone_id, domain name (obfuscated in publish variant)
- zone_type badge
- severity badge
- confidence badge
- traceability badge
- condition preview text

**Clickable:**
- The entire zone item — opens Zone Workspace for that zone
- Does not link to a report — opens the workspace panel

---

## C. ZONE WORKSPACE MODEL

The Zone Workspace is the full structural view of a selected zone. It is not a report page — it is the investigation surface.

**Overview block:**
- Zone ID + type label (prominent)
- Domain name
- Structural scope: capability count, signal count
- Classification rationale: why this zone_type was derived (one-line)
- Condition description: full text from Section A of Diagnostic Narrative

**Structural Drivers sub-block:**
- Contributing capability nodes (chips)
- Contributing signals (chips, or signal titles in publish variant)
- Dependency structure type: LINEAR / BRANCHING / UNKNOWN
- Dependency description text

**Propagation sub-block:**
- All propagation paths for the zone
- Each path: chain notation, path_id, direction, evidence strength
- INFERRED paths labeled explicitly with declaration text
- No speculative paths — only paths derivable from available evidence

**Evidence State sub-block:**
- Evidence strength: STRONG / PARTIAL / WEAK
- Available artifact references (internal variant) or artifact count (publish variant)
- Missing evidence list with impact statements

**Uncertainty Declaration sub-block:**
- inference_prohibition: ACTIVE (mandatory, always visible)
- Unresolved elements list: element name + reason for non-resolution
- No resolution date estimates, no advisory content

**Layout logic:**
- Overview block renders first, always visible
- Sub-blocks render in fixed order: Structural Drivers → Propagation → Evidence State → Uncertainty Declaration
- Investigation Entry Points (F-block) renders at bottom of workspace
- No sub-block is collapsible within the workspace — only the zone item in the inventory is collapsible

---

## D. INTERACTION MODES

WHY, TRACE, and EVIDENCE are controlled investigation modes, not free-form queries. Each mode has a fixed input contract and a bounded output structure.

### WHY
**Purpose:** Explain why a zone was classified as a given zone_type — not a causal claim, a structural derivation rationale.

**Input model:**
- zone_id (required)
- No additional parameters

**Output structure:**
- Classification rationale: which signals, grounding status, and structural patterns triggered the zone_type
- Evidence basis for each factor
- Constraints respected (ZONE-2 depth, no inference beyond evidence)

**Constraints:**
- Does not produce root cause claims
- Does not produce recommendations
- Output is bounded to what the evidence set can support
- Output includes explicit declaration of what is NOT derivable

---

### TRACE
**Purpose:** Show structural propagation paths from a zone's anchor domain — who/what is connected and how strongly.

**Input model:**
- zone_id (required)
- direction: DOWNSTREAM / UPSTREAM / BOTH
- depth: 1 / 2 (default 2)

**Output structure:**
- Path list: each path has chain notation, evidence strength, type (ARTIFACT-BACKED or INFERRED)
- Inferred paths explicitly declared with reason
- Structural diagram reference (zone-scoped only — not global graph)

**Constraints:**
- Paths limited to zone scope — does not traverse full topology
- INFERRED paths cannot be promoted to ARTIFACT-BACKED without new evidence
- No propagation claims beyond depth 2 from anchor domain

---

### EVIDENCE
**Purpose:** Surface all evidence artifacts bound to a zone's signal set and expose what is missing.

**Input model:**
- zone_id (required)
- scope: FULL / BOUNDED (default FULL)

**Output structure:**
- Available artifacts: list of trace links with artifact type labels
- Signal coverage summary: which signals have full artifact chains
- Missing evidence: item + impact per missing element
- Resolution requirements: what type of evidence would close each gap

**Constraints:**
- Does not generate evidence — surfaces what exists and what does not
- Missing evidence is stated as fact, not as gap to be filled by query
- No advisory content about how to obtain missing evidence

---

## E. NAVIGATION MODEL

**Zone Inventory → Zone Workspace:**
- User selects a zone item in the inventory
- Zone Workspace opens (in-page panel or dedicated view — not a separate page)
- Inventory remains navigable (sidebar or collapsible panel)

**Zone Workspace → Interaction Modes:**
- WHY / TRACE / EVIDENCE entry points rendered at bottom of Zone Workspace (F-block)
- User selects an entry point → mode activates inline within the workspace
- Mode result rendered below the entry point block
- Zone Workspace remains visible above (scrollable)

**Back navigation:**
- From Zone Workspace: back to Zone Inventory (zone list remains in context)
- From Interaction Mode result: back to Zone Workspace (clear result, stay in workspace)
- No browser back required — all navigation within workspace frame

**Cross-zone navigation:**
- From Zone Workspace: zone_id chips or references to adjacent zones are clickable
- Clicking an adjacent zone_id navigates to that zone's workspace directly
- No return to inventory required for cross-zone movement

**Deep linking:**
- Each zone workspace must be deep-linkable by zone_id
- Each interaction mode result must be deep-linkable by zone_id + mode
- Deep link format: `/tier2/workspace?zone=ZONE-01` and `/tier2/workspace?zone=ZONE-01&mode=WHY`
- Deferred to Phase 2 implementation

---

## F. EVIDENCE INTERACTION MODEL

**Artifact references:**
- Displayed as trace links in Evidence State and EVIDENCE mode output
- Internal variant: full artifact path visible
- Publish variant: artifact count + type label (no paths exposed)
- Links are read-only references — no in-workspace artifact viewer

**Signal bindings:**
- Signals displayed as chips in Structural Drivers and EVIDENCE mode
- Internal variant: signal_id visible
- Publish variant: signal title only
- Each signal chip shows evidence_confidence badge

**Missing evidence visibility:**
- Missing evidence always rendered — never hidden
- Each missing evidence item: what is missing + structural impact
- Rendered in Evidence State sub-block and in EVIDENCE mode output
- Not actionable — no "request evidence" mechanism

**Expansion behavior:**
- No lazy-load or progressive expansion of evidence items
- All available evidence for a zone is shown in full on workspace load
- EVIDENCE mode provides the same data with additional resolution context

---

## G. TRACE VISUALIZATION ROLE

**When used:**
- Trace visualization is only invoked within TRACE mode
- Not shown in Zone Inventory or Zone Workspace overview blocks
- Only zone-scoped — never the full topology graph

**Scope limitations:**
- Visualization is bounded to the selected zone's anchor domain and adjacent nodes
- Does not render the full canonical topology
- Maximum depth 2 from anchor domain
- Cross-domain edges shown only if artifact-backed or explicitly declared as INFERRED

**Representation constraints:**
- ARTIFACT-BACKED paths: rendered with solid edges
- INFERRED paths: rendered with dashed edges + INFERRED label
- No path may be rendered without an explicit evidence classification
- Visualization must not suggest certainty beyond evidence strength

---

## H. EXPORT MODEL

The workspace is the primary product surface. Reports are static projections from it.

**Executive Brief (Tier-1 Narrative Brief):**
- Export: governed interpretation layer, Tier-1 only
- Does not contain Tier-2 zone data
- Audience: leadership, decision-makers
- Workspace relationship: does not link to workspace

**LENS Assessment (Tier-1 Evidence Brief):**
- Export: authoritative structural evidence surface, Tier-1
- Contains signal data, domain grounding, score derivation
- Audience: technical and executive
- Workspace relationship: feeds zone derivation; does not expose workspace state

**Diagnostic (Tier-2 Diagnostic Narrative):**
- Export: static HTML snapshot of the workspace state at generation time
- Contains all zone blocks (collapsed by default in HTML)
- Does not support interaction modes (WHY/TRACE/EVIDENCE not active in export)
- Audience: technical, investigation-level stakeholders
- Workspace relationship: snapshot projection — not a live view

**Rule:** Workspace is always more current than any export. Exports are point-in-time artifacts. No export is authoritative over workspace state.

---

## I. HARD BOUNDARIES

Tier-2 must never become any of the following:

**Chatbot:**
- No free-form text input
- No conversational output
- No open-ended question handling
- WHY/TRACE/EVIDENCE are parameterized modes, not question fields

**Advisory engine:**
- No recommendations
- No prescriptive guidance
- No "you should..." output of any kind
- Output describes what exists, not what to do

**Root cause generator:**
- No causal claims
- Structural pressure and propagation are described, not attributed
- Zones describe conditions, not causes
- inference_prohibition: ACTIVE applies to all output

**Dashboard of metrics:**
- Not a KPI surface
- Not a real-time monitoring view
- Not a trend analysis tool
- Score and band are point-in-time evidence outputs, not live metrics

**Speculative analysis layer:**
- No forward projections
- No scenario modeling
- No "if X then Y" output
- All output is bounded to current evidence set

---

## Governance

- Authority: brain/product
- Implements: TIER2.DIAGNOSTIC.NARRATIVE.STRUCTURE.01, TIER2.TRACE.QUERY.CONTRACT.01, TIER2.RUNTIME.MINIMUM.VIABLE.SURFACE.01
- Code status: NOT IMPLEMENTED (see brain/code/tier2_workspace.md)
- Publish variant: see brain/publish/tier2_workspace.md
- inference_prohibition: ACTIVE
