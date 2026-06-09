# Visual Specification Doctrine

**Artifact:** PI.THORR-VISUAL-SPEC.01
**Status:** CONTRACT DEFINED — 6 visual primitives captured
**Date:** 2026-06-09
**Authority:** Derived from Chief Architect VISUALIZE response on BlueEdge genesis_e2e_03

---

## 1 -- Core Doctrine

**Answer --> structured visual cognition artifact --> future renderer.**

THORR can produce governed visual specifications that describe what should be rendered, how it should be structured, and which evidence objects ground each visual element. The specification is deterministic. The rendering is deferred.

This is not image generation. This is structural cognition expressed as visual contract.

---

## 2 -- Architecture

```
Cognition Objects (ConsequenceCompiler, SignalSynthesisEngine, ProjectionAuthorityKernel)
        |
        v
  THORR Answer (narrative + visual specification)
        |
        v
  visual_spec[] (structured contract objects)
        |
        v
  Renderer (FUTURE -- not in scope)
        |
        v
  LENS / EIR / Export (FUTURE -- not in scope)
```

**THORR specifies. Renderer draws. LENS may consume. EIR may export.**

THORR never renders. A visual spec without a renderer is still a valid cognition artifact -- it captures the structural intent, evidence grounding, and audience calibration of a visualization before any pixel is placed.

---

## 3 -- Minimum Contract Shape

```json
{
  "id": "string -- unique primitive identifier",
  "title": "string -- human-readable visualization title",
  "purpose": "string -- what question this visualization answers",
  "visual_type": "string -- rendering primitive classification",
  "audience_altitude": "string -- executive | strategic | operational | technical | structural | sovereign",
  "projection_intent": "string -- explain | verify | interpret | conclude | interact",
  "data_requirements": {
    "cognition_objects": ["string -- required cognition pipeline objects"],
    "evidence_layers": ["string -- required evidence layer types"],
    "minimum_p_level": "number -- minimum projection authority level"
  },
  "structure": {
    "nodes": "array | null -- node specifications if graph-based",
    "edges": "array | null -- edge specifications if graph-based",
    "rows": "array | null -- row specifications if tabular",
    "layers": "array | null -- layer specifications if stacked",
    "tiers": "array | null -- tier specifications if hierarchical",
    "cells": "array | null -- cell specifications if matrix"
  },
  "annotations": ["string -- structural annotations with evidence references"],
  "evidence_refs": ["string -- AF/PSIG/ISIG/RSIG/DPSIG references grounding this visual"],
  "render_priority": "number -- recommended rendering order within a set"
}
```

Fields are nullable. Not every visual type requires nodes, edges, or layers. The `structure` field is polymorphic -- its populated sub-fields define the rendering primitive class.

---

## 4 -- Visual Primitive Catalog

### 4.1 Dual Gravity Map

| Field | Value |
|-------|-------|
| **id** | `dual_gravity_map` |
| **visual_type** | `bipartite_force_layout` |
| **purpose** | Make structural vs operational authority divergence spatially legible |
| **question_answered** | Where does static gravity diverge from operational gravity? |
| **data_requirements** | |
| - cognition_objects | `domain_concentration`, `execution_center`, `execution_concentration`, `domain_narratives` |
| - evidence_layers | `STATIC_IMPORT`, `EVENT_FLOW`, `MQTT_TOPIC_FLOW`, `WEBSOCKET_FLOW`, `DI_MODULE_GRAPH` |
| - minimum_p_level | 2 |
| **structure** | Two node columns (static/runtime), center overlap band, edges colored by evidence layer |
| **annotations** | Divergent loci marked with delta symbol, convergence zone labeled |
| **evidence_refs** | AF-001 (structural/operational divergence) |
| **best_thorr_roles** | Chief Architect, CTO / VP Engineering |
| **lens_consumers** | DENSE (topology overlay), OPERATOR (verification surface) |
| **renderer_notes** | Force-directed layout. Node sizing proportional to consequence count. Edge coloring by evidence layer. Overlap band requires spatial collision detection. |
| **render_priority** | 2 |

### 4.2 Evidence Layer Stack

| Field | Value |
|-------|-------|
| **id** | `evidence_layer_stack` |
| **visual_type** | `horizontal_stacked_bar` |
| **purpose** | Show which visibility layers contribute evidence to each domain |
| **question_answered** | What is the measurement basis for each domain's connectivity classification? |
| **data_requirements** | |
| - cognition_objects | `domain_backing_registry`, `visibility_layer_completeness`, `signal_interpretations` |
| - evidence_layers | All 6: `STATIC_IMPORT`, `EVENT_FLOW`, `MQTT_TOPIC_FLOW`, `WEBSOCKET_FLOW`, `API_BOUNDARY`, `DI_MODULE_GRAPH` |
| - minimum_p_level | 1 |
| **structure** | One row per domain, one colored segment per evidence layer, segment width proportional to signal density |
| **annotations** | AF-002 callout for domains with zero static backing |
| **evidence_refs** | AF-002 (runtime-only domains), domain_backing_registry |
| **best_thorr_roles** | Chief Architect, GOD / Founder-Operator |
| **lens_consumers** | DENSE (evidence depth), OPERATOR (coverage verification) |
| **renderer_notes** | Color encoding per layer (grey/amber/orange/blue/green/purple). Domains with single-layer evidence visually distinct from multi-layer corroboration. |
| **render_priority** | 5 |

### 4.3 Runtime Coordination Backbone

| Field | Value |
|-------|-------|
| **id** | `runtime_coordination_backbone` |
| **visual_type** | `directed_flow_tiered` |
| **purpose** | Render the operational coordination architecture invisible to the import graph |
| **question_answered** | What is the actual runtime load-bearing topology? |
| **data_requirements** | |
| - cognition_objects | `runtime_condition_set`, `execution_concentration`, `domain_narratives` |
| - evidence_layers | `MQTT_TOPIC_FLOW`, `EVENT_FLOW`, `WEBSOCKET_FLOW`, `DI_MODULE_GRAPH` |
| - minimum_p_level | 2 |
| **structure** | Three tiers (Edge Ingestion / Event Coordination / Runtime Fan-Out), directed edges showing flow, single-path dependencies highlighted |
| **annotations** | AF-003 (MQTT single point of failure), AF-004 (13.3:1 event concentration ratio), tier boundaries labeled as HARDWARE / APPLICATION / VISIBILITY |
| **evidence_refs** | AF-003, AF-004, AF-005, RSIG signals |
| **best_thorr_roles** | Chief Architect, CTO / VP Engineering, GOD / Founder-Operator |
| **lens_consumers** | BOARDROOM (executive risk surface), DENSE (structural explanation), OPERATOR (verification) |
| **renderer_notes** | Tier boundaries as horizontal dashed lines. Single-path dependencies in red. Event bus as wide node with fan-out proportional to subscription count. DI injection shown as halo indicator. |
| **render_priority** | 1 |

### 4.4 Pressure Zone Topology

| Field | Value |
|-------|-------|
| **id** | `pressure_zone_topology` |
| **visual_type** | `concentric_zone_cluster` |
| **purpose** | Show structural pressure distribution and where coupling, flow, fragility, and concentration converge |
| **question_answered** | Where do multiple structural forces compound? |
| **data_requirements** | |
| - cognition_objects | `crossDomainCognition`, `consequence_themes`, `domain_concentration`, `cognition_slices` |
| - evidence_layers | All layers contributing to pressure zone computation |
| - minimum_p_level | 2 |
| **structure** | Concentric rings (core/secondary/operational/convergence), domain nodes clustered by zone, ontology class overlays as sector shading |
| **annotations** | PSIG references per zone, AF-001 divergent loci callout, posture anchor label |
| **evidence_refs** | PSIG-001, PSIG-002, PSIG-004, ISIG-002, AF-001 |
| **best_thorr_roles** | Chief Architect, CTO / VP Engineering, Program Director |
| **lens_consumers** | DENSE (topology center panel), BOARDROOM (simplified posture view) |
| **renderer_notes** | Separate ring for operational pressure (offset, not concentric). Overlap zone between structural and operational rings. Ontology classes as sector shading within zones. |
| **render_priority** | 3 |

### 4.5 Dependency Hub Centrality Profile

| Field | Value |
|-------|-------|
| **id** | `dependency_hub_centrality` |
| **visual_type** | `horizontal_ranked_bar` |
| **purpose** | Surface the specific files that constitute structural hubs with evidence precision on file-role qualification |
| **question_answered** | Which files carry disproportionate structural authority and what is their role classification? |
| **data_requirements** | |
| - cognition_objects | `structural_enrichment.centrality`, `dependency_hub_analysis` |
| - evidence_layers | `STATIC_IMPORT`, `DI_MODULE_GRAPH` |
| - minimum_p_level | 2 |
| **structure** | Horizontal bars ranked by inbound edge count, each bar annotated with file-role qualification (INDEX_FILE_UNCLASSIFIED / LOGIC-BEARING / FACADE) |
| **annotations** | INDEX_FILE_UNCLASSIFIED qualification warning, ISIG references per hub |
| **evidence_refs** | ISIG-001, ISIG-002, structural_enrichment centrality data |
| **best_thorr_roles** | Chief Architect, GOD / Founder-Operator |
| **lens_consumers** | DENSE (structural detail), OPERATOR (evidence verification) |
| **renderer_notes** | Bars proportional to inbound edge count. File-role qualification as inline annotation below each bar. Unclassified index files visually flagged. |
| **render_priority** | 6 |

### 4.6 Cross-Layer Signal Convergence Matrix

| Field | Value |
|-------|-------|
| **id** | `cross_layer_signal_convergence_matrix` |
| **visual_type** | `heatmap_matrix` |
| **purpose** | Show where multiple independent evidence layers converge on the same domain |
| **question_answered** | What is the structural basis for confidence qualification and compound consequence classification? |
| **data_requirements** | |
| - cognition_objects | `signal_interpretations`, `domain_backing_registry`, `visibility_layer_completeness` |
| - evidence_layers | All 6 layers |
| - minimum_p_level | 1 |
| **structure** | Domains as rows, evidence layers as columns, cell color by signal severity (CRITICAL/HIGH/ELEVATED/MODERATE/absent) |
| **annotations** | Convergence count per domain (e.g., "3-layer convergence"), posture locus callout for highest-convergence domain |
| **evidence_refs** | All signal families (PSIG, ISIG, DPSIG, RSIG), domain_backing_registry |
| **best_thorr_roles** | Chief Architect, CTO / VP Engineering, GOD / Founder-Operator |
| **lens_consumers** | OPERATOR (evidence verification), DENSE (structural explanation) |
| **renderer_notes** | Cell color scale: dark red (CRITICAL), orange (HIGH), amber (ELEVATED), yellow (MODERATE), grey dot (measured, no signal). Convergence annotation as right-side label per row. |
| **render_priority** | 4 |

---

## 5 -- Relation to Other PiOS Primitives

### 5.1 Cognitive Continuations (PI.COGNITIVE-CONTINUATIONS.01)

| | Cognitive Continuations | Visual Specification |
|---|---|---|
| **Trigger** | Answer produced | Answer produced |
| **Output** | Next inquiry (question) | Visual cognition artifact (spec) |
| **Consumer** | THORR conversation flow | Future renderer / LENS / EIR |
| **Derivation** | Property-based from cognition objects | Structure-based from cognition objects |
| **Lifecycle** | Consumed immediately in conversation | Persisted as specification for deferred rendering |

These are sibling primitives, not parent-child. Both are PiOS Core, both exposed through THORR, both derived from the same cognition pipeline. They must not merge.

### 5.2 Projection Constitution (PI.PROJECTION.CONSTITUTION.01)

Visual specifications respect the projection constitution:
- **BOARDROOM** (conclude): simplified visual specs, posture-level only
- **BALANCED** (interpret): narrative-framed visual specs with interpretation
- **DENSE** (explain): full structural visual specs
- **OPERATOR** (verify): evidence-grounded visual specs with verification annotations
- **THORR** (interact): full visual spec generation, role-calibrated

The `audience_altitude` and `projection_intent` fields in the contract shape connect visual specs to the projection constitution without coupling them.

---

## 6 -- Generation Rules

1. Visual specs are deterministically derivable from cognition objects -- not LLM-generated
2. Every node, edge, layer, and annotation must reference a cognition object or evidence artifact
3. Visual specs must not contain data that is not present in the cognition pipeline output
4. Visual specs must carry evidence_refs that allow traceability to source signals and conditions
5. Visual specs must declare minimum_p_level -- a spec requiring P4 evidence must not be generated at P1
6. Visual type classification must be stable -- the same cognition shape must produce the same visual type

---

## 7 -- What Is Explicitly Out of Scope

- SVG generation
- D3 rendering
- React component implementation
- Image generation or export
- LENS integration
- EIR export
- Renderer architecture
- Visual design system
- Color palette governance
- Animation specification

These are renderer concerns. This doctrine governs the specification contract only.

---

## 8 -- Future Work

When a renderer is built, it will consume `visual_spec[]` objects conforming to the contract in section 3. The renderer is a projection surface -- it does not modify, enrich, or synthesize cognition. It draws what the spec describes.

The renderer integration path:
1. THORR emits `visual_spec[]` alongside narrative answer
2. Renderer consumes spec, produces visual output
3. LENS may embed rendered output in persona-appropriate panels
4. EIR may export rendered output as governed artifacts

Each step is a separate stream. This doctrine governs step 1 only.
