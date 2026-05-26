# Pressure-Topology Integration Specification

Stream: PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01
Classification: G1 — Architecture-Mutating
Date: 2026-05-26
Depends on: CONSTITUTIONAL_DEFINITION.md (CF-01, CF-09)

---

## 1. Current Gap

Fully computed pressure zone intelligence exists in artifacts that no UI surface touches:

| Artifact | Content | Consumer |
|---|---|---|
| `pressure_zone_state.json` (75.x) | PZ-001 COMPOUND_ZONE, 3 conditions, member domains | **NONE** — not declared in manifests, not loaded by resolver |
| `pressure_zone_projection.json` (41.x) | Projected pressure zone surfaces | **NONE** — not declared in manifests, not loaded by resolver |

The data exists. The computation is complete. The intelligence is orphaned.

### Why This Matters

Without pressure-topology integration:
- The SVG topology is a semantic cluster visualization — structurally accurate, operationally inert
- Pressure zones are invisible — the user cannot see WHERE structural stress concentrates
- Signal families activate without spatial context — the user sees "PSIG-001 HIGH" but not which topology region is under pressure
- Zone boundaries, member visibility, and condition decomposition have no rendering path

With pressure-topology integration:
- The SVG topology becomes an operational software cognition topology
- Pressure zones are spatially visible — the user sees which domains are under pressure
- Signal families have spatial attribution — the user sees "PSIG-001 HIGH in Platform Infrastructure cluster"
- Executives see structural risk geography, not abstract signal values

---

## 2. Data Flow: Current vs Target

### Current Flow (Broken)

```
pressure_zone_state.json (75.x)
        │
        ▼
    (orphaned — no manifest declaration)
        │
        ╳  GenericSemanticPayloadResolver never loads it
        ╳  fullReport never contains it
        ╳  No persona surface sees it
```

### Target Flow (Through SW-Intel)

```
pressure_zone_state.json (75.x)
        │
        ▼
software_intelligence_module.json
  ├── pressure_interpretations (CF-01)
  │     zone_id → operational_pressure_type
  │     conditions → operational_consequence
  │
  └── pressure_topology_projection (CF-09)
        zone_boundaries → topology overlay
        member_domains → visual highlighting
        condition_decomposition → legend

        │
        ▼
GenericSemanticPayloadResolver
  (loads SW-Intel module artifact)
        │
        ▼
fullReport.software_intelligence
  .pressure_interpretations
  .pressure_topology_projection
        │
        ▼
LENS Persona Surfaces
  BOARDROOM: executive risk geography
  BALANCED: operational narrative with spatial context
  DENSE: topology overlay with zone boundaries
  INVESTIGATION: full zone evidence chain
```

---

## 3. Pressure Zone Rendering Requirements

### Zone Boundaries

Each pressure zone has a spatial boundary defined by its member domains. When pressure-topology integration is active:

- Zone boundary renders as a translucent overlay on the SVG topology
- Boundary color derived from zone severity (compound > single condition)
- Boundary does NOT occlude existing topology edges and labels
- Boundary is visible at default zoom and collapses gracefully at overview zoom

### Member Visibility

Domains within a pressure zone gain visual indicators:

- Member domains highlighted with zone-colored border accent
- Non-member domains remain at default styling
- Cross-zone members (domains in multiple zones) show the highest-severity zone color

### Condition Decomposition

Each pressure zone's conditions are decomposable:

- Zone tooltip/detail panel shows contributing conditions
- Each condition traces to its signal family source
- Compound zones show condition interaction (AND, CORRELATED, INDEPENDENT)

---

## 4. Topology Reactivity Model

Pressure changes how topology renders. This is NOT animation — it is structural state-driven visual hierarchy.

### Prominence Modulation

| Topology Element | Without Pressure | With Pressure |
|---|---|---|
| Domain node | Default size, default color | Pressured domains visually foregrounded (border accent, slight scale increase) |
| Cluster boundary | Default stroke | Pressured clusters gain zone-colored boundary |
| Edge | Default rendering | Edges between pressured domains and their propagation targets highlighted |
| Label | Default rendering | Pressured domain labels gain operational type suffix |

### Corridor Illumination

When execution corridors (CF-02) intersect pressure zones:

- The corridor path through the pressure zone is visually emphasized
- Direction indicators (ORIGIN → PASS_THROUGH → RECEIVER) gain operational labels
- The intersection creates the "pressure corridor" executive moment (CF-08)

### Operational Type Labels

SW-Intel pressure types (CF-01) appear on the topology:

| Pressure Type | Visual Treatment |
|---|---|
| Deployment Fragility | Orange zone accent |
| Orchestration Overload | Red zone accent |
| Integration Saturation | Yellow zone accent |
| Test Authority Gap | Muted amber zone accent |

---

## 5. Persona-Specific Topology Projection

### BOARDROOM

- Topology preview (small, non-interactive) shows pressure zone overlay
- Zone names use operational vocabulary ("Deployment Risk Zone" not "PZ-001")
- Executive reads: "Pressure geography shows 1 compound zone affecting Platform Infrastructure"

### BALANCED

- Full topology with pressure overlay active by default
- Narrative context for pressure zones alongside the topology
- Zone click reveals operational consequence narrative

### DENSE

- Full topology with pressure overlay, zone boundaries, member highlighting
- Condition decomposition available via zone interaction
- Corridor paths visible when intersecting pressure zones
- Operational type labels on zone boundaries

### INVESTIGATION

- Full topology with all pressure evidence
- Zone click reveals full condition chain, signal sources, member lists
- Corridor intersections shown with member-level evidence
- Abstraction lineage for any pressure interpretation

---

## 6. Implementation Boundaries

This specification DEFINES the integration model. Implementation requires future streams:

### Required Implementation Steps

1. **Manifest declaration:** Add `pressure_zone_state.json` to specimen manifest declarations
2. **Resolver loading:** Teach GenericSemanticPayloadResolver to load pressure zone state
3. **fullReport field:** Add `pressure_zones` to fullReport projection
4. **SW-Intel module:** Build the module artifact that interprets pressure zones through CF-01
5. **Topology rendering:** Add zone overlay capability to StructuralTopologyZone SVG rendering
6. **Persona consumption:** Wire each persona surface to consume pressure-aware topology projections

### What This Spec Does NOT Define

- SVG implementation details (gradients, opacity values, pixel dimensions)
- Interaction behavior (hover, click, keyboard)
- Animation or transition effects
- Mobile/responsive rendering
- Performance optimization for large topologies
- Caching strategy for pressure-aware projections

These are implementation concerns for the rendering stream, not constitutional concerns for the architectural definition.
