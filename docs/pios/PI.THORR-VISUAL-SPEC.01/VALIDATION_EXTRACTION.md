# Visual Specification Validation Extraction

**Source:** Chief Architect VISUALIZE response on BlueEdge genesis_e2e_03
**Date:** 2026-06-09
**Purpose:** Prove the 6 visual specs can be represented as deterministic contract objects

---

## Extraction Method

The Chief Architect produced a VISUALIZE answer containing 6 narrative visual specifications. Each is extracted below into the contract shape defined in VISUAL_SPECIFICATION_DOCTRINE.md section 3. Evidence references are traced to source cognition objects.

---

## Spec 1: Dual Gravity Map

```json
{
  "id": "dual_gravity_map",
  "title": "Structural vs Operational Authority",
  "purpose": "Make the structural vs operational authority divergence spatially legible",
  "visual_type": "bipartite_force_layout",
  "audience_altitude": "structural",
  "projection_intent": "explain",
  "data_requirements": {
    "cognition_objects": [
      "crossDomainCognition.domain_concentration",
      "crossDomainCognition.execution_center",
      "crossDomainCognition.execution_concentration",
      "crossDomainCognition.domain_narratives"
    ],
    "evidence_layers": [
      "STATIC_IMPORT",
      "EVENT_FLOW",
      "MQTT_TOPIC_FLOW",
      "WEBSOCKET_FLOW",
      "DI_MODULE_GRAPH"
    ],
    "minimum_p_level": 2
  },
  "structure": {
    "nodes": [
      {"id": "DOMAIN-01", "label": "Platform Infrastructure and Data", "column": "static", "mass": "large", "consequence_count": 18},
      {"id": "DOMAIN-04", "label": "Frontend Application", "column": "static", "mass": "large"},
      {"id": "DOMAIN-06", "label": "Telemetry Transport and Messaging", "column": "overlap", "mass": "medium"},
      {"id": "DOMAIN-09", "label": "Edge Data Acquisition", "column": "overlap", "mass": "medium"},
      {"id": "DOMAIN-03", "label": "Fleet Core Operations", "column": "runtime", "mass": "large"},
      {"id": "DOMAIN-07", "label": "Real-Time Streaming and Gateway", "column": "runtime", "mass": "large"},
      {"id": "DOMAIN-08", "label": "Event-Driven Architecture", "column": "runtime", "mass": "large"}
    ],
    "edges": null,
    "layers": [
      {"id": "static", "label": "Static Gravity", "edge_style": "solid grey"},
      {"id": "runtime", "label": "Operational Gravity", "edge_style": "colored by evidence layer"},
      {"id": "overlap", "label": "Convergence Zone", "edge_style": "dual-color"}
    ]
  },
  "annotations": [
    "AF-001: 3 divergent loci marked with delta — Fleet Core Operations, Real-Time Streaming, Event-Driven Architecture",
    "Static: 18 consequences across 5 loci. Runtime: 7 consequences across 5 loci",
    "Overlap zone: Telemetry Transport and Edge Data Acquisition — highest combined pressure"
  ],
  "evidence_refs": ["AF-001"],
  "render_priority": 2
}
```

**Derivability:** All nodes derivable from `domain_concentration` + `execution_concentration`. Column assignment derivable from `domain_backing_registry` (STATIC_BACKED vs RUNTIME_BACKED vs SYSTEM_BACKED). Overlap derivable from domains appearing in both concentrations. Mass derivable from consequence count per locus.

---

## Spec 2: Six-Layer Evidence Stack

```json
{
  "id": "evidence_layer_stack",
  "title": "Evidence Layer Coverage by Domain",
  "purpose": "Show which visibility layers contribute evidence to each domain",
  "visual_type": "horizontal_stacked_bar",
  "audience_altitude": "structural",
  "projection_intent": "explain",
  "data_requirements": {
    "cognition_objects": [
      "domain_backing_registry",
      "visibility_layer_completeness",
      "signal_interpretations"
    ],
    "evidence_layers": [
      "STATIC_IMPORT",
      "EVENT_FLOW",
      "MQTT_TOPIC_FLOW",
      "WEBSOCKET_FLOW",
      "API_BOUNDARY",
      "DI_MODULE_GRAPH"
    ],
    "minimum_p_level": 1
  },
  "structure": {
    "rows": [
      {"domain": "Platform Infrastructure and Data", "layers": ["STATIC_IMPORT", "DI_MODULE_GRAPH"]},
      {"domain": "Frontend Application", "layers": ["STATIC_IMPORT", "WEBSOCKET_FLOW"]},
      {"domain": "Fleet Core Operations", "layers": ["EVENT_FLOW", "WEBSOCKET_FLOW", "API_BOUNDARY"]},
      {"domain": "Telemetry Transport and Messaging", "layers": ["STATIC_IMPORT", "MQTT_TOPIC_FLOW", "EVENT_FLOW"]},
      {"domain": "Edge Data Acquisition", "layers": ["MQTT_TOPIC_FLOW", "EVENT_FLOW"]},
      {"domain": "Sensor and Security Ingestion", "layers": ["MQTT_TOPIC_FLOW", "API_BOUNDARY"]},
      {"domain": "Real-Time Streaming and Gateway", "layers": ["WEBSOCKET_FLOW", "EVENT_FLOW"]},
      {"domain": "Event-Driven Architecture", "layers": ["EVENT_FLOW", "DI_MODULE_GRAPH"]}
    ]
  },
  "annotations": [
    "AF-002: 13 domains have zero static backing — runtime layers provide sole evidence of connectivity"
  ],
  "evidence_refs": ["AF-002", "domain_backing_registry"],
  "render_priority": 5
}
```

**Derivability:** Rows derivable from `domain_backing_registry` (each domain's backing sources). Layer presence derivable from `signal_interpretations` filtered by domain. Segment width derivable from signal count per layer per domain.

---

## Spec 3: Runtime Coordination Backbone

```json
{
  "id": "runtime_coordination_backbone",
  "title": "Operational Coordination Architecture",
  "purpose": "Render the runtime load-bearing topology invisible to the import graph",
  "visual_type": "directed_flow_tiered",
  "audience_altitude": "structural",
  "projection_intent": "explain",
  "data_requirements": {
    "cognition_objects": [
      "runtime_condition_set",
      "execution_concentration",
      "crossDomainCognition.domain_narratives"
    ],
    "evidence_layers": [
      "MQTT_TOPIC_FLOW",
      "EVENT_FLOW",
      "WEBSOCKET_FLOW",
      "DI_MODULE_GRAPH"
    ],
    "minimum_p_level": 2
  },
  "structure": {
    "tiers": [
      {
        "id": "edge_ingestion",
        "label": "Edge Ingestion",
        "boundary": "HARDWARE",
        "nodes": [
          {"id": "nxp_hw", "label": "NXP i.MX 95 Hardware"},
          {"id": "sensor_collector", "label": "sensor_collector.py", "runtime": "systemd"},
          {"id": "hasi_bridge", "label": "hasi_bridge.py", "runtime": "systemd"},
          {"id": "mqtt_broker", "label": "mqtt.blueedge.network:8883", "risk": "single_point_of_failure"}
        ]
      },
      {
        "id": "event_coordination",
        "label": "Event Coordination Backbone",
        "boundary": "APPLICATION",
        "nodes": [
          {"id": "event_emitter", "label": "fleet-event-emitter.service.ts", "di_scope": "global", "event_types": 53, "emitter_methods": 17, "subscriptions": 74, "handlers": 4}
        ]
      },
      {
        "id": "runtime_fanout",
        "label": "Runtime Fan-Out",
        "boundary": "VISIBILITY",
        "nodes": [
          {"id": "ws_gateway", "label": "fleet.gateway.ts", "streams": 12, "consumers": 16, "source_domains": 5}
        ]
      }
    ]
  },
  "annotations": [
    "AF-003: MQTT broker — single point of failure. Broker failure eliminates all edge-to-cloud telemetry.",
    "AF-004: 13.3:1 event concentration ratio. Handler failure = systemic, not regional.",
    "AF-005: Edge-cloud dependency chain — structurally invisible, crosses deployment boundary."
  ],
  "evidence_refs": ["AF-003", "AF-004", "AF-005", "RSIG-001", "RSIG-002", "RSIG-003", "RSIG-004"],
  "render_priority": 1
}
```

**Derivability:** Tier 1 nodes from MQTT_TOPIC_FLOW evidence. Tier 2 from EVENT_FLOW evidence + DI_MODULE_GRAPH. Tier 3 from WEBSOCKET_FLOW evidence. Concentration ratios from runtime_condition_set. All AF references from architectural findings in ConsequenceCompiler output.

---

## Spec 4: Pressure Zone Topology

```json
{
  "id": "pressure_zone_topology",
  "title": "Structural Pressure Distribution",
  "purpose": "Show where coupling, flow, fragility, and concentration converge",
  "visual_type": "concentric_zone_cluster",
  "audience_altitude": "structural",
  "projection_intent": "explain",
  "data_requirements": {
    "cognition_objects": [
      "crossDomainCognition",
      "crossDomainCognition.consequence_themes",
      "crossDomainCognition.domain_concentration",
      "cognition_slices"
    ],
    "evidence_layers": ["All layers contributing to pressure zone computation"],
    "minimum_p_level": 2
  },
  "structure": {
    "layers": [
      {
        "id": "core_pressure",
        "label": "Core Pressure Zone",
        "position": "innermost",
        "domains": ["Platform Infrastructure and Data"],
        "color": "deep_red",
        "signals": ["PSIG-001", "PSIG-002", "PSIG-004"]
      },
      {
        "id": "secondary_pressure",
        "label": "Secondary Pressure Zone",
        "position": "second_ring",
        "domains": ["Frontend Application"],
        "color": "red_orange",
        "signals": ["ISIG-002"]
      },
      {
        "id": "operational_pressure",
        "label": "Operational Pressure Zone",
        "position": "offset_ring",
        "domains": ["Fleet Core Operations", "Real-Time Streaming and Gateway", "Event-Driven Architecture"],
        "color": "amber"
      },
      {
        "id": "convergence",
        "label": "Convergence Zone",
        "position": "overlap",
        "domains": ["Telemetry Transport and Messaging", "Edge Data Acquisition"],
        "color": "deep_orange",
        "annotation": "Both authorities present — highest combined pressure"
      }
    ]
  },
  "annotations": [
    "PSIG-001: coupling z-score 5.66",
    "PSIG-002: domain coupling z-score 3.21",
    "AF-001: divergent loci — import graph does not reflect operational load",
    "Posture anchor: Systemic Operational Fragility"
  ],
  "evidence_refs": ["PSIG-001", "PSIG-002", "PSIG-004", "ISIG-002", "AF-001"],
  "render_priority": 3
}
```

**Derivability:** Zone assignment derivable from `consequence_themes` severity + `domain_concentration` ranking. Overlap zone from domains present in both `domain_concentration` and `execution_concentration`. Ontology class overlays from `cognition_slices` class assignments. Signal references directly from signal_interpretations.

---

## Spec 5: Dependency Hub Centrality Profile

```json
{
  "id": "dependency_hub_centrality",
  "title": "Structural Hub File Analysis",
  "purpose": "Surface specific files constituting structural hubs with role qualification",
  "visual_type": "horizontal_ranked_bar",
  "audience_altitude": "structural",
  "projection_intent": "explain",
  "data_requirements": {
    "cognition_objects": [
      "structural_enrichment.centrality",
      "structural_enrichment.dependency_hub_analysis"
    ],
    "evidence_layers": ["STATIC_IMPORT", "DI_MODULE_GRAPH"],
    "minimum_p_level": 2
  },
  "structure": {
    "rows": [
      {"file": "backend/src/common/dto/index.ts", "inbound_edges": 111, "role": "INDEX_FILE_UNCLASSIFIED", "signals": ["ISIG-001"]},
      {"file": "frontend/hooks/index.tsx", "inbound_edges": 74, "role": "INDEX_FILE_UNCLASSIFIED", "signals": ["ISIG-002"]},
      {"file": "backend/src/app.module.ts", "inbound_edges": null, "role": "LOGIC-BEARING", "note": "NestJS root"},
      {"file": "backend/src/events/index.ts", "inbound_edges": null, "role": "FACADE", "note": "5 globally injected providers"},
      {"file": "frontend/src/App.tsx", "inbound_edges": null, "role": "LOGIC-BEARING", "note": "application root"},
      {"file": "frontend/router/LazyRoutes.tsx", "inbound_edges": null, "role": "LOGIC-BEARING", "note": "router"}
    ]
  },
  "annotations": [
    "Positions 1-2 carry highest raw centrality. Role classification pending — barrel files carry different risk profiles than logic-bearing modules."
  ],
  "evidence_refs": ["ISIG-001", "ISIG-002", "structural_enrichment.centrality"],
  "render_priority": 6
}
```

**Derivability:** File list from `structural_enrichment.centrality.top_structural_spines`. Inbound edge counts from dependency_hub_analysis. Role classification from INDEX_FILE qualification status in evidence. Signal references from signal_interpretations.

---

## Spec 6: Cross-Layer Signal Convergence Matrix

```json
{
  "id": "cross_layer_signal_convergence_matrix",
  "title": "Evidence Convergence by Domain and Layer",
  "purpose": "Show where multiple independent evidence layers converge on the same domain",
  "visual_type": "heatmap_matrix",
  "audience_altitude": "structural",
  "projection_intent": "explain",
  "data_requirements": {
    "cognition_objects": [
      "signal_interpretations",
      "domain_backing_registry",
      "visibility_layer_completeness"
    ],
    "evidence_layers": [
      "STATIC_IMPORT",
      "EVENT_FLOW",
      "MQTT_TOPIC_FLOW",
      "WEBSOCKET_FLOW",
      "API_BOUNDARY",
      "DI_MODULE_GRAPH"
    ],
    "minimum_p_level": 1
  },
  "structure": {
    "cells": [
      {"domain": "Platform Infrastructure and Data", "STATIC_IMPORT": "CRITICAL", "EVENT_FLOW": "HIGH", "DI_MODULE_GRAPH": "HIGH", "convergence": 3},
      {"domain": "Frontend Application", "STATIC_IMPORT": "CRITICAL", "WEBSOCKET_FLOW": "HIGH", "convergence": 2},
      {"domain": "Fleet Core Operations", "EVENT_FLOW": "CRITICAL", "WEBSOCKET_FLOW": "HIGH", "API_BOUNDARY": "HIGH", "convergence": 3},
      {"domain": "Telemetry Transport and Messaging", "STATIC_IMPORT": "HIGH", "EVENT_FLOW": "HIGH", "MQTT_TOPIC_FLOW": "CRITICAL", "convergence": 3},
      {"domain": "Edge Data Acquisition", "EVENT_FLOW": "HIGH", "MQTT_TOPIC_FLOW": "CRITICAL", "convergence": 2},
      {"domain": "Real-Time Streaming and Gateway", "EVENT_FLOW": "HIGH", "WEBSOCKET_FLOW": "CRITICAL", "convergence": 2},
      {"domain": "Event-Driven Architecture", "EVENT_FLOW": "CRITICAL", "DI_MODULE_GRAPH": "HIGH", "convergence": 2},
      {"domain": "Access Control and Identity", "API_BOUNDARY": "HIGH", "DI_MODULE_GRAPH": "CRITICAL", "convergence": 2}
    ]
  },
  "annotations": [
    "Telemetry Transport and Messaging: 3-layer convergence — structural basis for primary posture locus designation",
    "No single layer produces the posture finding; it requires cross-layer reconciliation"
  ],
  "evidence_refs": ["PSIG-*", "ISIG-*", "DPSIG-*", "RSIG-*", "domain_backing_registry"],
  "render_priority": 4
}
```

**Derivability:** Rows from domain list. Cell values from `signal_interpretations` filtered by domain and signal family (each family maps to one evidence layer). Severity from signal severity classification. Convergence count = number of non-null layers per domain.

---

## Validation Result

All 6 visual primitives successfully extracted into the contract shape. Every field traces to a cognition pipeline object. No field requires LLM generation -- all are derivable from the deterministic cognition output.

| Primitive | Nodes | Edges | Rows | Layers | Tiers | Cells | Deterministic |
|-----------|-------|-------|------|--------|-------|-------|---------------|
| dual_gravity_map | 7 | - | - | 3 | - | - | YES |
| evidence_layer_stack | - | - | 8+ | - | - | - | YES |
| runtime_coordination_backbone | - | - | - | - | 3 | - | YES |
| pressure_zone_topology | - | - | - | 4 | - | - | YES |
| dependency_hub_centrality | - | - | 6 | - | - | - | YES |
| cross_layer_signal_convergence_matrix | - | - | - | - | - | 8+ | YES |

The `structure` field polymorphism works as designed -- each visual type populates different sub-fields, and the populated fields define the rendering primitive class.
