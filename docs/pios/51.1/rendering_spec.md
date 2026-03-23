# Stream 51.1 — Rendering Specification

Stream: 51.1 — Governed Structural Emphasis Rendering (WOW Layer)
Program: Krayu — Program Intelligence Discipline
Date: 2026-03-23
Execution timestamp: 2026-03-23T15:00:00Z
Branch: feature/51-1-governed-structural-rendering
Execution version: 51.1-v1
Normalization version: 51.1R-v1
Status: COMPLETE (normalized by 51.1R)

---

## Purpose

Define how runtime-exposed emphasis is visually expressed in the demo layer. This specification is downstream of 42.22 only. It introduces no new semantics, no inference, and no transformation.

---

## Input Source

Runtime-exposed structures from Stream 42.22 only.

| Input | File-Level SHA-256 |
|---|---|
| docs/pios/42.22/attribute_lineage.json | b94e0cae0f5769aff2740388a74e8016defc25980ccd16723b473c14c271719a |
| docs/pios/42.22/sample_runtime_output.json | ca6c9e1ca8d9ac2c66a1a77edf4155050036f0af55fd80e6ab2445d84530b9af |
| docs/pios/42.22/exposure_validation_report.md | bf8812bba669723cfa9a73dabd433955cf75d1ab5fd177668961e69e9ec0bb9b |
| docs/pios/42.22/validation_log.json | 604136c1005e9d09443ff0a3af0e045034989f431735dc6f0651ce070fbddf45 |

43.x and 44.x lineage is accessible only via provenance fields already carried in 42.22 runtime-exposed structures. No direct reads from 43.x or 44.x artifacts.

---

## Rendering Principle

Rendering expresses governed attributes without modification. The demo layer applies visual mapping to runtime-exposed emphasis values. It does not define, recompute, infer, or modify emphasis.

---

## Runtime-Exposed Attribute Reference

Source: docs/pios/42.22/attribute_lineage.json (SHA-256: b94e0cae...)

| Attribute | Layer Origin | Carrier | Governed Closed Set | Pass-Through Confirmed |
|---|---|---|---|---|
| emphasis | 44.3 | 44.2 | high, medium, low, none | true |

Governed closed set is carried verbatim from 42.22 attribute_lineage.json.
NONE is a governed closed-set member defined at 44.3. It is not a rendering default. It is not a fallback. It is an upstream-assigned value passed through without modification.

---

## Static Visual Mapping Table

| Emphasis Value (governed) | Node Visual State |
|---|---|
| high | red node |
| medium | amber node |
| low | neutral node |
| none | no emphasis marker |

This table is fixed. It is not computed at render time. It is not configurable by the demo layer. All four governed closed-set values are explicitly mapped. NONE maps to no emphasis marker — this reflects the upstream-assigned value, not a rendering decision.

---

## Rendering Rules

1. Rendering layer reads emphasis from runtime-exposed record only
2. Mapping is applied from the static table above — no deviation
3. No dynamic thresholds
4. No recalculation of emphasis at render time
5. No hidden weighting
6. No fallback or repair — if emphasis is missing or outside closed set, fail closed
7. Identical input → identical rendered output

---

## Topology Preservation Rules

1. Topology structure remains unchanged by rendering
2. No automatic filtering of nodes based on emphasis
3. No hidden grouping based on emphasis
4. No node suppression
5. No reordering based on emphasis
6. All nodes remain visible regardless of emphasis value

---

## Traceability Requirement

Each rendered node must be traceable to:

| Level | Field | Source |
|---|---|---|
| Runtime record | attachment_id | 42.22 exposure record |
| Projection provenance | projection_reference | 42.22 exposure record |
| Binding provenance | binding_id | 42.22 exposure record |
| Signal provenance | signal_id | 42.22 exposure record |

No rendering node may exist without a corresponding runtime record in 42.22.

---

## Fail-Closed Rendering Rules

Rendering is invalid and must terminate with NO OUTPUT if:

1. Required 42.22 input missing or unreadable
2. emphasis field absent from runtime record
3. emphasis value outside governed closed set (high, medium, low, none)
4. Mapping ambiguity exists (two states map to same emphasis, or one emphasis maps to two states)
5. Provenance fields insufficient for node traceability
6. Direct upstream 43.x or 44.x dependency becomes required at render time
7. Rendering requires inference or repair
8. Non-deterministic mapping behavior introduced

If triggered: no 51.1 rendering output produced. Validation log records failure. Stream status = INCOMPLETE.

---

## Observed Sample-Runtime Distribution (from 42.22, non-canonical)

The following reflects the emphasis distribution observed in docs/pios/42.22/sample_runtime_output.json.
This is evidence only. It does not define rendering semantics.

| Signal | Node | Observed Emphasis |
|---|---|---|
| SIG-001 | C_02_Network_Security_Intelligence_Collection | none |
| SIG-002 | C_27_Caching_Layer | none |
| SIG-003 | C_30_Domain_Event_Bus | none |
| SIG-004 | C_29_Platform_Monorepo_Container | none |
| SIG-005 | C_40_Delivery_and_Quality_Infrastructure | none |

All 5 nodes carry upstream-assigned emphasis = none. Rendered visual state: no emphasis marker.
