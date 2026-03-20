# Domain: Fleet Vertical Extensions

**domain_id:** DOMAIN-04
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED

## Description

Industry-specific capability extensions that differentiate the platform for each fleet type. Evidenced by app.module.ts session comment "Fleet-type specific (3 modules, 32 endpoints)" (EVID-APPMOD lines 165–166) and EVID-ARCH section s5 "Verticals" (IIM-03c). TankerModule provides HAZMAT safety compliance for hazardous materials transport. BusModule supports public transit passenger information systems. TaxiModule adds dispatch and metering for rideshare operations. ColdchainModule and DriverSessionsModule extend these verticals into temperature monitoring and session block management respectively. VehicleLifecycleModule provides end-to-end asset management applicable across all verticals.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-12 | [Fleet Type Verticals](../02_Capabilities/C_12_Fleet_Type_Verticals.md) | CORE | GROUNDED |
| CAP-13 | [Specialty Transport Extensions](../02_Capabilities/C_13_Specialty_Transport_Extensions.md) | SUPPORTING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-10 | [TankerModule](../03_Components/CMP_10_TankerModule.md) | BACKEND | CAP-12 |
| COMP-11 | [BusModule](../03_Components/CMP_11_BusModule.md) | BACKEND | CAP-12 |
| COMP-12 | [TaxiModule](../03_Components/CMP_12_TaxiModule.md) | BACKEND | CAP-12 |
| COMP-23 | [ColdchainModule](../03_Components/CMP_23_ColdchainModule.md) | BACKEND | CAP-13 |
| COMP-60 | [DriverSessionsModule](../03_Components/CMP_60_DriverSessionsModule.md) | BACKEND | CAP-13 |
| COMP-61 | [VehicleLifecycleModule](../03_Components/CMP_61_VehicleLifecycleModule.md) | BACKEND | CAP-13 |

## Execution Path Participation

- EP-04 (Fleet Data REST Request-Response — vertical modules as domain module targets)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-10, COMP-11, COMP-12, COMP-23, COMP-60, COMP-61
- relationship_anchors: R-013, R-014

## Navigation

- ↓ Capabilities: [[C_12_Fleet_Type_Verticals]] · [[C_13_Specialty_Transport_Extensions]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
