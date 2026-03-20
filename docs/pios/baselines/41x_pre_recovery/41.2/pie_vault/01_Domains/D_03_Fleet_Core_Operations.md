# Domain: Fleet Core Operations

**domain_id:** DOMAIN-03
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED

## Description

The foundational operational data management layer for fleet asset and activity lifecycle. Evidenced by app.module.ts session comment "Core domains (7 modules, 66 endpoints)" (EVID-APPMOD lines 156–163) grouping VehiclesModule, DriversModule, FleetsModule, TripsModule, AlertsModule, MaintenanceModule, and FuelModule as the minimum viable platform. Intent inference IIM-03b confirms these 7 modules constitute the foundational layer upon which all other domain modules depend. The UsersModule is included here as the user account management layer directly supporting auth and fleet operations. OperationsModule and DevicesModule are included as operational control and device management components confirmed in the same session grouping.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-07 | [Core Fleet Asset Management](../02_Capabilities/C_07_Core_Fleet_Asset_Management.md) | CORE | GROUNDED |
| CAP-08 | [Driver Management](../02_Capabilities/C_08_Driver_Management.md) | CORE | GROUNDED |
| CAP-09 | [Alert and Notification Management](../02_Capabilities/C_09_Alert_and_Notification_Management.md) | CORE | GROUNDED |
| CAP-10 | [Maintenance and Fuel Operations](../02_Capabilities/C_10_Maintenance_and_Fuel_Operations.md) | CORE | GROUNDED |
| CAP-11 | [Operational Control and Device Management](../02_Capabilities/C_11_Operational_Control_and_Device_Management.md) | SUPPORTING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-03 | [VehiclesModule](../03_Components/CMP_03_VehiclesModule.md) | BACKEND | CAP-07 |
| COMP-04 | [DriversModule](../03_Components/CMP_04_DriversModule.md) | BACKEND | CAP-08 |
| COMP-05 | [FleetsModule](../03_Components/CMP_05_FleetsModule.md) | BACKEND | CAP-07 |
| COMP-06 | [TripsModule](../03_Components/CMP_06_TripsModule.md) | BACKEND | CAP-07 |
| COMP-07 | [AlertsModule](../03_Components/CMP_07_AlertsModule.md) | BACKEND | CAP-09 |
| COMP-08 | [MaintenanceModule](../03_Components/CMP_08_MaintenanceModule.md) | BACKEND | CAP-10 |
| COMP-09 | [FuelModule](../03_Components/CMP_09_FuelModule.md) | BACKEND | CAP-10 |
| COMP-13 | [OperationsModule](../03_Components/CMP_13_OperationsModule.md) | BACKEND | CAP-11 |
| COMP-14 | [DevicesModule](../03_Components/CMP_14_DevicesModule.md) | BACKEND | CAP-11 |
| COMP-15 | [NotificationsModule](../03_Components/CMP_15_NotificationsModule.md) | BACKEND | CAP-09 |
| COMP-22 | [UsersModule](../03_Components/CMP_22_UsersModule.md) | BACKEND | CAP-08 |

## Execution Path Participation

- EP-04 (Fleet Data REST Request-Response — domain module as target)
- EP-05 (Domain Event Fan-Out — AlertsModule as emitter)
- EP-06 (Predictive Maintenance AI — MaintenanceModule as work order recipient)
- EP-08 (Multi-Tenant Onboarding — UsersModule and NotificationsModule participation)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-03, COMP-04, COMP-05, COMP-06, COMP-07, COMP-08, COMP-09, COMP-13, COMP-14, COMP-15, COMP-22
- relationship_anchors: R-010, R-011, R-012, R-013, R-014, R-020, R-023

## Navigation

- ↓ Capabilities: [[C_07_Core_Fleet_Asset_Management]] · [[C_08_Driver_Management]] · [[C_09_Alert_and_Notification_Management]] · [[C_10_Maintenance_and_Fuel_Operations]] · [[C_11_Operational_Control_and_Device_Management]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
