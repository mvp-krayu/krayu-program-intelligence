# IMPLEMENTATION SEMANTICS — PI.LENS.V2.PHASE5A8.GUIDED-COGNITIVE-TRAVERSAL.01

## 1. Primitive Inventory

| Primitive | Module | Purpose | Reuse Status |
|-----------|--------|---------|--------------|
| DENSE_ZONE_REGISTRY | IntelligenceField.jsx | 6-zone identity map (key, code, label) for DENSE mode orchestration | CONSUMED BY: zone tracking, interpretation, paths, transitions |
| DENSE_ZONE_INTERPRETATIONS | IntelligenceField.jsx | 6 deterministic derive functions producing zone-specific heading/body/structuralNote from fullReport | CONSUMED BY: ExecutiveInterpretation, 5B Layer 1 |
| DENSE_ZONE_PATHS | IntelligenceField.jsx | 12 navigational paths across 6 zones with narrative/answers/boundary payloads | CONSUMED BY: SupportRail, 5B proto-query infrastructure |
| activeZoneKey tracking | IntelligenceField.jsx (default export) | Scroll-driven zone focus state with rAF viewport-center proximity | CONSUMED BY: all three columns |
| pendingTransitionZone | lens-v2-flagship.js → LensDisclosureShell → IntelligenceField | Cross-mode zone targeting for guided BOARDROOM → DENSE descent | CONSUMED BY: IntelligenceField transition consumer |
| Governance envelope | LensDisclosureShell.jsx | Expandable trust boundary footer with inference/derivation/qualifier status | CONSUMED BY: all LENS v2 routes |
| SQO compact badge | SQOIntelligenceZone.jsx | Compact expandable qualification badge with S-state, label, detail toggle | CONSUMED BY: LENS v2 DENSE/INVESTIGATION zones |

## 2. Input Contracts

### fullReport (consumed by DENSE_ZONE_INTERPRETATIONS)

All derive functions read from `fullReport` — the resolved payload passed through IntelligenceField.

| Zone | fullReport Fields Consumed |
|------|---------------------------|
| semanticTopology | `topology_summary.structurally_backed_count`, `topology_summary.semantic_domain_count` |
| clusterConcentration | `topology_scope.clusters` (array length), `topology_scope.nodes` (array, mass distribution) |
| absorptionLoad | `evidence_blocks` (filter by `propagation_role === 'PASS_THROUGH'`), total block count |
| signalAssessment | `signal_interpretations` (array — severity, interpretation, concentration fields) |
| propagationFlow | `propagation_summary.chain_of_custody` (array — domain_alias, propagation_role), `evidence_blocks`, `signal_interpretations` |
| pressureZoneFocus | `propagation_summary.chain_of_custody` (filter by PRESSURE roles), `signal_interpretations` |

### Transition props (consumed by pendingTransitionZone mechanism)

| Prop | Type | Source | Purpose |
|------|------|--------|---------|
| pendingTransitionZone | string \| null | lens-v2-flagship.js state | Zone key to scroll-to after mode transition |
| onTransitionZoneConsumed | () => void | lens-v2-flagship.js callback | Clears pending state after scroll completes |

### SQO props (consumed by SQOIntelligenceZone)

| Prop | Source | Purpose |
|------|--------|---------|
| sState | S-state resolver | S0–S3 qualification state |
| meta | SQO state machine | label, description, blocking, condition, resolution, progression |
| cockpitHref | URL builder | SQO cockpit navigation target |

## 3. Output Contracts

### DENSE_ZONE_INTERPRETATIONS derive functions

Each derive function returns:

```
{
  heading: string,           // Zone-specific interpretive heading
  body: string,              // Deterministic structural reading
  structuralNote: string|null, // Optional monospace structural metric
  signalDetail?: Array<{     // Only: signalAssessment zone
    id: string,
    severity: string,
    interpretation: string,
    concentration: string
  }>,
  signalByRole?: Object|null, // Only: propagationFlow zone — {role: count}
  signalSummary?: {           // Only: pressureZoneFocus zone
    total: number,
    critical: number,
    compound: string|null
  }
}
```

### DENSE_ZONE_PATHS entries

Each zone maps to an array of path objects:

```
{
  label: string,      // Path display text
  icon: string,       // Unicode icon
  action: string,     // Action type: TOPO_MODAL | MODE_INVESTIGATION | SQO_NAVIGATE | SIGNAL_TRACE
  narrative: string,  // What this exploration reveals (5B seed)
  answers: string,    // The question this path addresses (5B proto-query)
  boundary: string    // Governance constraint text
}
```

The `answers` field is the canonical seed for 5B guided queries.

### Governance envelope output

Renders footer with:
- Status indicator (green dot + "GOVERNANCE ENVELOPE ACTIVE")
- Prohibition text (midline-separated)
- Qualifier badge (conditional on Q-class)
- Expandable detail section (inference/derivation/qualifier status)

## 4. Calibration Assumptions

| Constant | Value | Governed vs Tuned |
|----------|-------|-------------------|
| Scroll listener debounce | rAF (single frame) | TUNED — no explicit debounce, rAF provides ~16ms throttle |
| Viewport-center proximity | `window.innerHeight / 2` | TUNED — best visual center for zone detection |
| Sticky column top offset | `73px` | TUNED — calibrated to LENS v2 header height |
| Narrative overlay animation | `0.2s ease` | TUNED — perception threshold for micro-interaction |
| Zone count | 6 (ST, CC, AL, SA, PF, PZ) | GOVERNED — must match DENSE actor rendering order |
| Path count | 12 across 6 zones | GOVERNED — each path corresponds to a structural capability |

## 5. Extension Points

| Extension | Location | Parameterization |
|-----------|----------|------------------|
| Zone registry | DENSE_ZONE_REGISTRY | New zones require: key, code (2-char), label. Must also add corresponding entries in DENSE_ZONE_INTERPRETATIONS and DENSE_ZONE_PATHS. |
| Derive functions | DENSE_ZONE_INTERPRETATIONS | Each derive function reads fullReport. New zones add a new derive function following the same `(fullReport) => { heading, body, structuralNote }` contract. Signal-aware zones additionally return signalDetail/signalByRole/signalSummary. |
| Traversal paths | DENSE_ZONE_PATHS | New paths require: label, icon, action, narrative, answers, boundary. The `answers` field feeds 5B proto-query infrastructure. |
| Path actions | SupportRail action handler | New action types beyond TOPO_MODAL, MODE_INVESTIGATION, SQO_NAVIGATE, SIGNAL_TRACE require handler additions. |
| Transition zone mapping | DomainPostureCard row handlers | Each posture card row maps to a `(targetMode, domainId, targetZoneKey)` triple via `onModeTransition`. New rows require zone mapping. |
| Governance detail rows | LensDisclosureShell footer | New governance dimensions add `disclosure-footer-detail-row` entries. |

## 6. Module Responsibility Map

| File | Owns | Does NOT Own |
|------|------|-------------|
| `zones/IntelligenceField.jsx` | Zone registry, zone interpretations, zone paths, zone tracking state, scroll listener, transition consumer, three-column rendering (ExecutiveInterpretation, SupportRail, DenseTopologyField), narrative overlay markup, signal continuity rendering, topology modal portal | Mode state (owned by flagship), qualifier resolution (owned by payload resolver), payload data (owned by API) |
| `pages/lens-v2-flagship.js` | CSS for all zone/interpretation/path/overlay/governance/SQO styling, pendingTransitionZone state, handleModeTransition with zone targeting, prop threading to LensDisclosureShell | Zone rendering logic (owned by IntelligenceField), zone derive functions (owned by IntelligenceField) |
| `LensDisclosureShell.jsx` | Governance envelope (footer), governanceExpanded state, pendingTransitionZone prop threading to IntelligenceField | Zone orchestration (owned by IntelligenceField), CSS (owned by flagship) |
| `zones/SQOIntelligenceZone.jsx` | Compact badge rendering, expanded state, S-state badge, navigation block | SQO state resolution (owned by payload resolver), cockpit URL construction (owned by parent) |

## 7. Architectural Decision Record

### Zone Tracking: Scroll Listener vs IntersectionObserver

**Decision:** Scroll listener with rAF + viewport-center proximity.

**Alternatives considered:**
- IntersectionObserver with threshold array — rejected because threshold-based detection produces ambiguous results when multiple zones are simultaneously visible. Viewport-center proximity provides deterministic "which zone is the user reading" detection.
- Click-only zone selection — rejected because passive scroll tracking is the primary cognitive interaction. Click override is preserved via `pinnedZoneRef` but secondary.

**Why not React Context:** Zone tracking is scoped within IntelligenceField's three-column grid. Context would be overengineered for a parent-to-siblings prop relay involving exactly three consumers.

### Narrative Overlays: CSS-Only vs React State

**Decision:** CSS-only hover reveal (`display: none` ↔ `display: block` via `:hover`).

**Rationale:** No React state means no re-renders on hover. No flicker. No layout shift. No event handler cleanup. The overlay is pure rendering — it appears when the user hovers and disappears when they leave. This is the correct interaction primitive for 5B's deterministic layer.

### Topology Modal: Portal vs Inline

**Decision:** `createPortal(modal, document.body)`.

**Rationale:** Ancestor CSS transforms (`transform`, `will-change`, `contain`) in the three-column sticky layout create a new containing block. `position: fixed` on the modal overlay becomes relative to that ancestor rather than viewport. Portal escapes the containing block trap entirely.

### Guided Cognitive Descent: pendingTransitionZone

**Decision:** State in flagship, consumed in IntelligenceField with rAF retry scroll.

**Rationale:** BOARDROOM → DENSE transitions require zone targeting. The pending zone state lives in the flagship (which owns mode state) and propagates down through LensDisclosureShell. IntelligenceField consumes it after the DENSE layout renders, using rAF retry because the target zone element may not be in the DOM immediately after mode switch.

## 8. Dependency Graph

```
5A.8.1 (Zone Infrastructure) ──→ 5A.8.2 (Dynamic Left) ──→ 5A.8.4 (Guided Transitions)
                              ──→ 5A.8.3 (Contextual Right) ──→ 5A.8.10 (Narrative Affordance)
                              │                              ──→ 5A.8.7 (SQO Orchestration)
                              ──→ 5A.8.9 (Signal Continuity)       ──→ 5A.8.8 (Qualification)

5A.8.5 (Topology Modal Bug) ← Independent
5A.8.6 (Governance Envelope) ← Independent
```

## 9. 5B Consumption Surface

Phase 5A.8 established the following infrastructure explicitly designed for 5B consumption:

| Infrastructure | 5B Consumer | Mechanism |
|---------------|-------------|-----------|
| `DENSE_ZONE_PATHS[zone][path].answers` | 5B Layer 1 — Guided Queries | Each `answers` field is a proto-query. 5B transforms these into system-derived guided questions. |
| `DENSE_ZONE_INTERPRETATIONS[zone].derive(fullReport)` | 5B Layer 2 — Narrative Response Surface | Derive functions provide the structural grounding for evidence-synthesized narrative. |
| Progressive cognitive ladder | 5B three-layer model | BOARDROOM (understand) → DENSE (explore + narrative affordance) → INVESTIGATION (prove). This governs 5B's Layer 1 → Layer 2 → Layer 3 progression. |
| Narrative overlay interaction model | 5B Layer 1 hover-to-query | CSS-only overlays evolve into interactive query surfaces. The `answers` field becomes the guided query text. |

**Governance constraint:** 5B Layers 2-3 require 75.x authorization (interpretive authority). 5A.8 infrastructure is deterministic and operates under investigative authority only.
