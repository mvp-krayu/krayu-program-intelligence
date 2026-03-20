# Domain: Extended Operations and Driver Services

**domain_id:** DOMAIN-17
**domain_type:** FUNCTIONAL
**grounding_status:** GROUNDED

## Description

Extended operational capabilities covering driver engagement, incentives, mobile services, geofencing automation, messaging, customer portal access, cross-border logistics, permits, parts procurement, after-sales, and surge pricing. These modules are confirmed in app.module.ts (EVID-APPMOD lines 64–79, 95–101) as distinct backend modules with no single session comment clustering them beyond their individual declarations. They are grouped here as functionally adjacent modules serving operational execution and customer engagement. SurgePricingModule and DriverIncentivesModule are Taxi vertical extensions. GeofenceAutomationModule, MessagingModule, and DriverMobileModule support real-time fleet operations. CustomerPortalModule, AftersalesModule, CrossBorderModule, PermitsModule, and PartsMarketplaceModule serve fleet operator and service ecosystem needs.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-41 | [Commercial Operations and Dispatch Services](../02_Capabilities/C_41_Commercial_Operations_and_Dispatch_Services.md) | SUPPORTING | GROUNDED |
| CAP-42 | [Customer and Ecosystem Services](../02_Capabilities/C_42_Customer_and_Ecosystem_Services.md) | SUPPORTING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-28 | [SurgePricingModule](../03_Components/CMP_28_SurgePricingModule.md) | BACKEND | CAP-41 |
| COMP-29 | [DriverIncentivesModule](../03_Components/CMP_29_DriverIncentivesModule.md) | BACKEND | CAP-41 |
| COMP-34 | [CrossBorderModule](../03_Components/CMP_34_CrossBorderModule.md) | BACKEND | CAP-42 |
| COMP-35 | [PermitsModule](../03_Components/CMP_35_PermitsModule.md) | BACKEND | CAP-42 |
| COMP-36 | [PartsMarketplaceModule](../03_Components/CMP_36_PartsMarketplaceModule.md) | BACKEND | CAP-42 |
| COMP-37 | [FleetLifecycleModule](../03_Components/CMP_37_FleetLifecycleModule.md) | BACKEND | CAP-42 |
| COMP-38 | [DriverMobileModule](../03_Components/CMP_38_DriverMobileModule.md) | BACKEND | CAP-41 |
| COMP-40 | [CustomerPortalModule](../03_Components/CMP_40_CustomerPortalModule.md) | BACKEND | CAP-42 |
| COMP-47 | [GeofenceAutomationModule](../03_Components/CMP_47_GeofenceAutomationModule.md) | BACKEND | CAP-41 |
| COMP-48 | [MessagingModule](../03_Components/CMP_48_MessagingModule.md) | BACKEND | CAP-41 |
| COMP-57 | [AftersalesModule](../03_Components/CMP_57_AftersalesModule.md) | BACKEND | CAP-42 |

## Execution Path Participation

- EP-04 (Fleet Data REST Request-Response — these modules eligible as domain module targets)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-28, COMP-29, COMP-34, COMP-35, COMP-36, COMP-37, COMP-38, COMP-40, COMP-47, COMP-48, COMP-57
- relationship_anchors: R-013, R-014

## Navigation

- ↓ Capabilities: [[C_41_Commercial_Operations_and_Dispatch_Services]] · [[C_42_Customer_and_Ecosystem_Services]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
