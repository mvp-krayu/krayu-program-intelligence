# BlueEdge Platform v3.23.0 — Program Intelligence Explorer

**artifact_id:** PIOS-41.2-PIE-EXPLORER
**contract_id:** PIOS-41.2-RUN01-CONTRACT-v1
**mode:** PIE-RENDER-STRICT
**date:** 2026-03-20

---

## System Overview

BlueEdge is a fleet management software platform that runs on proprietary vehicle hardware (the SVG 2.0 Smart Vehicle Gateway) and connects to a cloud-based application suite. It is built as a multi-tenant commercial service (SaaS) for fleet operators across taxi, tanker, bus, and electric vehicle contexts. The platform is hosted by Blue Edge Network LLC (Dubai) / SA (Geneva) as stated in the architecture document.

The platform has 89 confirmed or architecture-declared components organised into 17 operational domains and 42 discrete functional capabilities.

Source: semantic_elevation_report.md / executive_readability_map.md — PIOS-41.1-OUTPUT-04/07

---

## Quick Stats Panel

| Metric | Value |
|---|---|
| Domains | 17 |
| Capabilities | 42 |
| Components | 89 |
| Total nodes | 148 |
| GROUNDED components | 83 (93.3%) |
| WEAKLY GROUNDED components | 4 (4.5%) — COMP-77, COMP-82, COMP-84, COMP-85 |
| DERIVED components | 8 (9.0%) |
| Grounding status | VERIFIED per semantic_elevation_report.md |

---

## Domain Index

| Domain ID | Domain Name | Type | Grounding | Caps | Comps | Vault Link |
|---|---|---|---|---|---|---|
| DOMAIN-01 | Edge Data Acquisition | FUNCTIONAL | GROUNDED | 4 | 7 | [D_01](../01_Domains/D_01_Edge_Data_Acquisition.md) |
| DOMAIN-02 | Telemetry Transport and Messaging | INFRASTRUCTURE | WEAKLY GROUNDED | 2 | 3 | [D_02](../01_Domains/D_02_Telemetry_Transport_and_Messaging.md) |
| DOMAIN-03 | Fleet Core Operations | FUNCTIONAL | GROUNDED | 5 | 11 | [D_03](../01_Domains/D_03_Fleet_Core_Operations.md) |
| DOMAIN-04 | Fleet Vertical Extensions | FUNCTIONAL | GROUNDED | 2 | 6 | [D_04](../01_Domains/D_04_Fleet_Vertical_Extensions.md) |
| DOMAIN-05 | Analytics and Intelligence | FUNCTIONAL | GROUNDED | 3 | 9 | [D_05](../01_Domains/D_05_Analytics_and_Intelligence.md) |
| DOMAIN-06 | AI/ML Intelligence Layer | FUNCTIONAL | GROUNDED | 3 | 7 | [D_06](../01_Domains/D_06_AI_ML_Intelligence_Layer.md) |
| DOMAIN-07 | Sensor and Security Ingestion | FUNCTIONAL | GROUNDED | 2 | 2 | [D_07](../01_Domains/D_07_Sensor_and_Security_Ingestion.md) |
| DOMAIN-08 | Real-Time Streaming and Gateway | OPERATIONAL | GROUNDED | 1 | 2 | [D_08](../01_Domains/D_08_Real_Time_Streaming_and_Gateway.md) |
| DOMAIN-09 | Access Control and Identity | CROSS-CUTTING | GROUNDED | 3 | 3 | [D_09](../01_Domains/D_09_Access_Control_and_Identity.md) |
| DOMAIN-10 | Platform Infrastructure and Data | INFRASTRUCTURE | WEAKLY GROUNDED | 4 | 6 | [D_10](../01_Domains/D_10_Platform_Infrastructure_and_Data.md) |
| DOMAIN-11 | Event-Driven Architecture | CROSS-CUTTING | GROUNDED | 1 | 1 | [D_11](../01_Domains/D_11_Event_Driven_Architecture.md) |
| DOMAIN-12 | SaaS Platform Layer | OPERATIONAL | GROUNDED | 2 | 4 | [D_12](../01_Domains/D_12_SaaS_Platform_Layer.md) |
| DOMAIN-13 | External Integration | INTEGRATION | GROUNDED | 2 | 4 | [D_13](../01_Domains/D_13_External_Integration.md) |
| DOMAIN-14 | Frontend Application | FUNCTIONAL | GROUNDED | 1 | 2 | [D_14](../01_Domains/D_14_Frontend_Application.md) |
| DOMAIN-15 | EV and Electrification | FUNCTIONAL | GROUNDED | 3 | 6 | [D_15](../01_Domains/D_15_EV_and_Electrification.md) |
| DOMAIN-16 | Operational Engineering | INFRASTRUCTURE | GROUNDED | 2 | 5 | [D_16](../01_Domains/D_16_Operational_Engineering.md) |
| DOMAIN-17 | Extended Operations and Driver Services | FUNCTIONAL | GROUNDED | 2 | 11 | [D_17](../01_Domains/D_17_Extended_Operations_and_Driver_Services.md) |

---

## Navigation Instructions

1. Start here (Explorer Map) to select a domain of interest.
2. Follow the domain link to the domain vault file — it lists all capabilities and components.
3. From the domain file, follow capability links to the capability vault file — it lists all components with evidence.
4. From the capability file, follow component links to the component vault file — it shows the source anchor and traceability.
5. Use the `← back` navigation links at the bottom of each file to return up the hierarchy.
6. Traceability index: [semantic_traceability_index.md](../04_Traceability/semantic_traceability_index.md)
7. Insights: [semantic_elevation_report.md](../05_Insights/semantic_elevation_report.md) | [executive_readability_map.md](../05_Insights/executive_readability_map.md)

WEAKLY GROUNDED nodes are marked with `[*]` throughout the vault.

---

## Contract and Provenance Metadata

| Field | Value |
|---|---|
| contract_id | PIOS-41.2-RUN01-CONTRACT-v1 |
| manifest_id | PIE-MANIFEST-BLUEEDGE-v3.23-RUN03-R01 |
| input_artifacts | PIOS-41.1-OUTPUT-01 through PIOS-41.1-OUTPUT-05, PIOS-41.1-OUTPUT-07 |
| rendering_mode | PIE-RENDER-STRICT |
| semantic_drift_count | 0 |
| invented_constructs | 0 |
| orphan_nodes | 0 |
| generation_date | 2026-03-20 |

---

## Navigation

- [PIE Index](../../pie_index.md)
- [PIE Navigation Map](../../pie_navigation_map.md)
- [Validation Report](../../pie_render_validation_report.md)
