# Domain: External Integration

**domain_id:** DOMAIN-13
**domain_type:** INTEGRATION
**grounding_status:** GROUNDED

## Description

The enterprise integration and developer platform expansion layer. Evidenced by app.module.ts session comment "Session 24: Integration Layer (4 modules, ~70 endpoints)" (EVID-APPMOD lines 93–97) explicitly grouping NotificationProvidersModule, ErpConnectorsModule, ApiMarketplaceModule, and IntegrationHubModule. Intent inference IIM-07 confirms this layer enables participation in existing enterprise ecosystems (ERP connectors) and exposes BlueEdge capabilities as a developer API marketplace. R-033 confirms NotificationProvidersModule serves NotificationsModule. R-034 and R-035 confirm ErpConnectors and ApiMarketplace route through IntegrationHubModule.

## Capabilities

| Capability ID | Capability Name | Type | Grounding |
|---|---|---|---|
| CAP-33 | [Notification Delivery Channels](../02_Capabilities/C_33_Notification_Delivery_Channels.md) | SUPPORTING | GROUNDED |
| CAP-34 | [Enterprise System Integration](../02_Capabilities/C_34_Enterprise_System_Integration.md) | ENABLING | GROUNDED |

## Components

| Component ID | Component Name | Tier | Capability |
|---|---|---|---|
| COMP-52 | [NotificationProvidersModule](../03_Components/CMP_52_NotificationProvidersModule.md) | INTEGRATION | CAP-33 |
| COMP-53 | [ErpConnectorsModule](../03_Components/CMP_53_ErpConnectorsModule.md) | INTEGRATION | CAP-34 |
| COMP-54 | [ApiMarketplaceModule](../03_Components/CMP_54_ApiMarketplaceModule.md) | INTEGRATION | CAP-34 |
| COMP-55 | [IntegrationHubModule](../03_Components/CMP_55_IntegrationHubModule.md) | INTEGRATION | CAP-34 |

## Execution Path Participation

- EP-05 (Domain Event Fan-Out — Branch D: NotificationProvidersModule as delivery channel)

## Traceability Reference

Source anchors from semantic_domain_model.md:
- component_anchors: COMP-52, COMP-53, COMP-54, COMP-55
- relationship_anchors: R-033, R-034, R-035

## Navigation

- ↓ Capabilities: [[C_33_Notification_Delivery_Channels]] · [[C_34_Enterprise_System_Integration]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
