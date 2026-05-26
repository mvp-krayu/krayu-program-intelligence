# Persona Consumption Specification — Software Intelligence Module

Stream: PI.SOFTWARE-INTELLIGENCE.CONSTITUTIONAL-DEFINITION.01
Classification: G1 — Architecture-Mutating
Date: 2026-05-26
Depends on: CONSTITUTIONAL_DEFINITION.md, BOARDROOM_SOFTWARE_INTELLIGENCE_ADVISORY.md

---

## 1. Consumption Architecture

When the SOFTWARE_INTELLIGENCE corridor is VALID, each persona gains access to SW-Intel projection fields through `deriveProjections(fullReport, persona).software_intelligence_labels`. The projection is gated — if the corridor is ABSENT, all SW-Intel projection fields return null and persona surfaces render PI Core intelligence without domain-specific vocabulary.

```
software_intelligence_module.json
        │
        ▼
deriveProjections(fullReport, persona)
        │
        ├── BOARDROOM ──▶ 7 executive consequence channels
        ├── BALANCED  ──▶ operational narrative with domain vocabulary
        ├── DENSE     ──▶ topology role labels + pressure operational types
        └── INVESTIGATION ──▶ full abstraction lineage + structural trace
```

---

## 2. BOARDROOM Consumption

BOARDROOM receives 7 executive consequence channels — formalized from BOARDROOM_SOFTWARE_INTELLIGENCE_ADVISORY.md Phase 2 forensics.

### Channel 1: Architectural Gravity Concentration

**Source:** CF-01 (Pressure Interpretation) + CF-07 (Topology Role Abstraction)
**Projection:** Finding headline uses domain-specific zone names instead of abstract identifiers
**Example without SW-Intel:** "Pressure concentrates in Zone A across 2 dimensions"
**Example with SW-Intel:** "Architectural gravity concentrates in Platform Infrastructure and Data — backend pressure across Structural Concentration and Architectural Binding dimensions"
**Rendering position:** Finding verdict headline (hero moment)

### Channel 2: Backend/Infrastructure Pressure Corridor

**Source:** CF-01 (Pressure Interpretation) + CF-08 (Operational Attention Routing)
**Projection:** When 2+ signal families activate in the same pressure zone, the executive moment is "pressure corridor" — not "2 tensions"
**Example:** "Backend module pressure creates a pressure corridor across Structural Concentration and Architectural Binding"
**Rendering position:** Tension narrative

### Channel 3: Dependency Propagation with Domain Names

**Source:** CF-02 (Execution Corridor Detection) + CF-07 (Topology Role Abstraction)
**Projection:** Propagation chain with domain-specific role names instead of abstract ORIGIN/PASS_THROUGH/RECEIVER
**Example without SW-Intel:** "Origin → Pass-through → Receiver"
**Example with SW-Intel:** "Platform Infrastructure → Core Services → API Layer"
**Rendering position:** Signal field vector

### Channel 4: Repository Topology Asymmetry

**Source:** CF-04 (Validation Intelligence) + CF-07 (Topology Role Abstraction)
**Projection:** Coverage ring with named asymmetric domains
**Example without SW-Intel:** "14 of 17 domains grounded"
**Example with SW-Intel:** "14 of 17 domains structurally grounded — asymmetry in Security and External Integration"
**Rendering position:** Coverage ring + domain names

### Channel 5: Coupling Pressure as Structural Risk

**Source:** CF-03 (Coordination Spine Detection) + CF-01 (Pressure Interpretation)
**Projection:** PSIG coupling with inter-domain specificity
**Example without SW-Intel:** "Architectural binding stress detected"
**Example with SW-Intel:** "Binding stress between Platform Infrastructure and Core Services — these domains should evolve independently but are structurally entangled"
**Rendering position:** Signal executive reading

### Channel 6: Module-Level Coverage Asymmetry

**Source:** CF-04 (Validation Intelligence)
**Projection:** Per-domain validation assessment with operational risk language
**Example:** "Platform Infrastructure carries 35% of structural mass but has WEAK test authority"
**Rendering position:** Governance confidence narrative

### Channel 7: Operational Fragility Signals

**Source:** CF-08 (Operational Attention Routing) for ISIG family
**Projection:** Import dependency intelligence with software-specific executive framing
**Example without SW-Intel:** "Import Hub Pressure 35.3 HIGH"
**Example with SW-Intel:** "External structural vulnerability in Platform Infrastructure — import dependency pressure concentrates deployment risk"
**Rendering position:** Signal family chip executive reading

### BOARDROOM Summary

SW-Intel transforms BOARDROOM from "S2 Governed. 2 Structural Tensions. Qualification holds" into "S2 Governed. Structural tension concentrates in Platform Infrastructure and Data — backend pressure across Structural Concentration and Architectural Binding dimensions. 14 of 17 domains structurally grounded." The second creates action. The first creates indifference.

---

## 3. BALANCED Consumption

BALANCED receives operational narrative with domain-specific vocabulary replacing structural labels. SW-Intel enhances BALANCED through vocabulary enrichment — the narrative synthesis engine remains governed under 75.x, but its inputs include domain-specific operational terms.

### Vocabulary Enrichment

| Structural Term | SW-Intel Operational Term |
|---|---|
| Zone A, Zone B | Platform Infrastructure, Core Services |
| ORIGIN, PASS_THROUGH, RECEIVER | Change source domain, Coordination relay, Deployment target |
| RUNTIME_SPINE | Orchestration hub |
| UTILITY_HUB | Configuration center |
| High centrality file | Coordination bottleneck |
| Pressure zone | Deployment risk area |
| Coupling edge | Service boundary coupling |

### Narrative Integration

BALANCED narrative synthesis derives from `BALANCED_INTERPRETIVE_NARRATIVES`. When SW-Intel projections are available:

1. `governancePosture.derive()` — includes deployment readiness language alongside governance lifecycle
2. `pressureConcentration.derive()` — uses operational pressure types (deployment fragility, orchestration overload) instead of abstract zone references
3. `signalActivation.derive()` — signal executive readings include domain-specific consequence language
4. `domainCoverage.derive()` — names asymmetric domains with operational role context

### Evidence Chain

BALANCED evidence chains include SW-Intel structural context entries:
- "Role abstraction: {entity} → {operational_role} (structural centrality: {normalized_score})"
- "Pressure type: {zone_id} → {operational_type} (conditions: {condition_list})"

---

## 4. DENSE Consumption

DENSE receives topology role labels on domains, pressure zone operational types, and execution corridor overlays. SW-Intel enriches DENSE through structural annotation — every structural entity gains an operational label.

### Topology Role Labels

Each domain in the structural topology gains an operational role label derived from CF-07:
- Domain name shown with operational role: "Platform Infrastructure (Orchestration Layer)"
- Structural centrality shown with operational consequence: "globals.py — orchestration hub, 12 downstream"

### Pressure Zone Operational Types

Pressure zones in DenseGovernanceZone gain typed operational labels from CF-01:
- Zone boundary labeled with operational risk type: "Deployment Fragility Zone"
- Conditions labeled with operational consequence: "Orchestration overload — coordination point saturated"

### Execution Corridor Overlay

Execution corridors from CF-02 overlay the topology:
- Delivery corridors highlighted with propagation direction
- Coordination corridors shown with domain role labels
- Blast radius indicated by downstream connection count

### Corridor Strip Enhancement

The dense-posture-strip (9 corridor chips) gains operational labels for SOFTWARE_INTELLIGENCE when VALID:
- Chip label: "SWI"
- Status dot: green (VALID), yellow (PARTIAL), dim (ABSENT)
- On hover: "Software Intelligence — domain cognition module active"

---

## 5. INVESTIGATION Consumption

INVESTIGATION receives full abstraction lineage, role-to-structural trace, and pressure interpretation evidence. SW-Intel provides maximum depth for forensic analysis.

### Full Abstraction Lineage

Every role abstraction is presented with its full derivation chain:
```
Operational Role: "Orchestration Hub"
  ← Structural Role: RUNTIME_SPINE (40.3c)
  ← Centrality: in_degree=12, out_degree=3, throughput=0.42 (40.3c)
  ← Code Graph: 12 resolved IMPORTS edges (40.3s)
  ← File: src/backend/core/globals.py (40.2)
```

### Role-to-Structural Trace

Bidirectional trace table:
| Operational Role | Structural Entity | Role Classification | Centrality Score | Evidence Source |
|---|---|---|---|---|
| Orchestration Hub | globals.py | RUNTIME_SPINE | 0.42 | 40.3c |
| API Boundary | api/__init__.py | RE_EXPORT_HUB | 0.31 | 40.3c |
| ... | ... | ... | ... | ... |

### Pressure Interpretation Evidence

Each pressure interpretation shown with full derivation:
```
Pressure Type: "Deployment Fragility"
  ← Zone: PZ-001 (COMPOUND_ZONE)
  ← Conditions: COUPLING_PRESSURE + EXPORT_PRESSURE + ZONE_COVERAGE_CONCENTRATION
  ← Source: pressure_zone_state.json (75.x)
  ← Signal Sources: PSIG-001 (coupling), PSIG-002 (export), PSIG-004 (coverage)
```

### Authority Evolution Query Enhancement

INVESTIGATION's guided query for authority evolution (GUIDED_QUERY_ANSWERS entry) includes SW-Intel context when available:
- Corridor evolution shows SOFTWARE_INTELLIGENCE corridor state and transition history
- Chain integrity includes SW-Intel module trace completeness
- Operational interpretation includes deployment readiness assessment alongside qualification posture

---

## 6. Cross-Persona Consistency

All four personas receive the same SW-Intel projections — they differ only in depth. The consistency rule:

| Projection Field | BOARDROOM | BALANCED | DENSE | INVESTIGATION |
|---|---|---|---|---|
| Role abstractions | Named in headlines | Named in narratives | Labeled on topology | Full lineage trace |
| Pressure types | Executive risk language | Narrative consequence | Typed zone labels | Full derivation chain |
| Execution corridors | Propagation chain | Narrative flow | Topology overlay | Member-level trace |
| Coordination spines | Named in verdict | Named in analysis | Labeled with metrics | Full centrality evidence |
| Validation posture | Coverage ring names | Per-domain narrative | Per-domain labels | Per-domain evidence |
| Attention signals | Audience routing | Narrative priority | Visual priority | Full compound evidence |

---

## 7. Degradation Behavior

When SOFTWARE_INTELLIGENCE corridor is ABSENT:

- All SW-Intel projection fields return null
- Persona surfaces render PI Core intelligence without domain vocabulary
- No error, no warning, no degradation message
- Structural intelligence remains fully functional — the system is correct, just abstract
- ABSENT is a valid architectural state, not an error

When corridor transitions ABSENT → VALID:

- Projection fields populate automatically on next fullReport resolution
- No cache invalidation required — projection is always re-derived
- Persona surfaces gain domain vocabulary without structural change
- The enhancement is vocabulary depth, not structural correctness
