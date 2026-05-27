# Pressure-Topology Integration Specification

Stream: PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01
Classification: G1 — Architecture-Mutating
Date: 2026-05-26
Runtime anchor: Pressure zone artifacts exist (75.x pipeline output). No consumer path to LENS.

---

## 1. Current State — Orphaned Intelligence

Fully computed pressure zone intelligence exists in artifacts that no UI surface touches:

| Artifact | Content | Consumer |
|---|---|---|
| `pressure_zone_state.json` (75.x) | PZ-001 COMPOUND_ZONE, 3 conditions, member domains | **NONE** |
| `pressure_zone_projection.json` (41.x) | Projected pressure zone surfaces | **NONE** |

The data exists. The computation is complete. The intelligence is orphaned.

This is NOT a visualization problem. This is an operational cognition gap: pressure zone intelligence has no path to operator awareness.

---

## 2. Why This is Operational Cognition, Not Visualization

The user's directive: "Pressure-topology integration must be positioned as operational cognition, not visualization."

**Visualization approach (WRONG):** Take the SVG topology, draw colored regions around pressured areas, add labels. The topology becomes a prettier picture. Operators see colors but receive no operational meaning.

**Operational cognition approach (CORRECT):** Pressure zones flow through the Software Intelligence interpretation layer (CF-01 Pressure Interpretation, CF-09 Pressure-Aware Topology Projection) and emerge as operational intelligence:

- **Zone PZ-001 COMPOUND_ZONE** → "Deployment coordination instability — 3 conditions converge: coupling pressure at Platform Infrastructure, import hub concentration at globals.py, topology asymmetry across backend cluster"
- **Zone boundary** → "Operational blast radius — changes within this zone propagate through 5 downstream domains"
- **Condition decomposition** → "Pressure sources: structural coupling (PSIG-001), file-level hub concentration (ISIG-001), topology mass imbalance (DPSIG-032)"

The topology does not become "prettier." The topology becomes operationally informative — it tells operators WHERE structural stress concentrates, WHY it concentrates there, and WHAT operational consequence it carries.

---

## 3. Integration Model

### Data Flow

```
pressure_zone_state.json (75.x computation)
        │ read by SW-Intel CF-01
        ▼
Pressure Interpretation
        │ produces
        ├── zone_id → operational_pressure_type
        ├── zone_id → operational_consequence
        ├── zone_id → condition_decomposition
        │
        │ consumed by SW-Intel CF-09
        ▼
Pressure-Aware Topology Projection
        │ produces
        ├── zone_boundaries on topology
        ├── member_visibility (which nodes are in the zone)
        ├── condition_icons (which signals contribute)
        ├── operational_type_label (what kind of pressure)
        │
        │ rendered by LENS
        ▼
Operational Software Cognition Topology
```

### What the Topology Becomes

Currently: semantic cluster visualization — structurally accurate, operationally inert.

Target: operational software cognition topology — pressure changes geometry prominence, corridors illuminate under stress, zones carry operational type labels.

The distinction is constitutional: the SVG topology in LENS is NOT "visualization infrastructure." It is an operational cognition surface. When pressure intelligence flows through SW-Intel to the topology, the topology becomes an instrument that tells operators where the system is under structural stress and what operational consequence that stress carries.

---

## 4. Rendering Requirements

### Zone Rendering

| Element | Requirement | Source |
|---|---|---|
| Zone boundary | Visual region enclosing member domains on topology SVG | `pressure_zone_state.json` → `members[]` |
| Zone label | Operational pressure type (not zone ID) | SW-Intel CF-01 interpretation |
| Member visibility | Domains within the zone are visually distinguished | `members[]` mapped to topology node positions |
| Condition icons | Which signal families contribute to this zone | `conditions[]` → signal family classification |
| Severity indicator | Zone severity from condition compound | `zone_type` + condition count |

### Topology Reactivity

| Behavior | Requirement |
|---|---|
| Pressure prominence | Pressured domains receive visual foregrounding |
| Corridor illumination | Execution corridors (propagation paths through pressured zones) highlight |
| Coupling edge typing | Edges gain operational type labels (structural dependency vs runtime coordination) |
| Zone focus | Click on zone → expand condition decomposition panel |

### Persona Differentiation

| Persona | Pressure Topology Content |
|---|---|
| BOARDROOM | Zone count + highest severity + one-line operational consequence |
| BALANCED | Zone boundaries + operational type labels + condition summary |
| DENSE | Full zone rendering + member visibility + condition decomposition |
| INVESTIGATION | Full rendering + signal family evidence + structural trace per condition |

---

## 5. Relationship to PR #16

Pressure-topology integration is NOT implemented in PR #16. PR #16 implements the SQO execution bridge and learning signal derivation. But the architectural pattern proven by PR #16 — read PI Core artifacts → interpret through SW-Intel → project to LENS — is the same pattern pressure-topology integration follows.

The gap is registered as implicit in the overall SW-Intel corridor status (SOFTWARE_INTELLIGENCE returns ABSENT). When pressure-topology integration is implemented, it follows the proven execution bridge pattern: server-side resolution → adapter derivation → component rendering.

---

## 6. What Does NOT Change

- **Pressure zone computation stays in 75.x.** SW-Intel reads the computed zones. It does not compute them.
- **PSIG/DPSIG/ISIG signal families stay in their derivation pipelines.** SW-Intel consumes signals as input to condition decomposition. It does not derive signals.
- **SVG topology rendering stays in StructuralTopologyZone.** SW-Intel adds zone boundaries and operational labels. It does not replace the topology component.
- **No new speculative architecture.** This spec defines the integration model for artifacts that already exist, through a pattern that is already proven. Implementation requires a future stream.
