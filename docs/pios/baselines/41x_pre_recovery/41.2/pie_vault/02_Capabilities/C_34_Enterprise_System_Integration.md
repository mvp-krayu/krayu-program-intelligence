# Capability: Enterprise System Integration

**capability_id:** CAP-34
**parent_domain:** DOMAIN-13 — External Integration
**capability_type:** ENABLING
**grounding_status:** GROUNDED

## Description

ERP system connectors (SAP, Oracle) for fleet cost and asset data synchronisation, and third-party API marketplace for developer access. IntegrationHubModule as the orchestration hub. Confirmed at app.module.ts lines 95–97 with modules/api-marketplace/ directory confirmed.

## Component Members

| Component ID | Component Name | Tier | Evidence |
|---|---|---|---|
| COMP-53 | [ErpConnectorsModule](../03_Components/CMP_53_ErpConnectorsModule.md) | INTEGRATION | DIRECT_EVIDENCE |
| COMP-54 | [ApiMarketplaceModule](../03_Components/CMP_54_ApiMarketplaceModule.md) | INTEGRATION | DIRECT_EVIDENCE |
| COMP-55 | [IntegrationHubModule](../03_Components/CMP_55_IntegrationHubModule.md) | INTEGRATION | DIRECT_EVIDENCE |

## Execution Contribution

- EP-04 (Fleet Data REST — these modules as domain module targets)

## Relationships

- R-034: ErpConnectorsModule DEPENDS_ON IntegrationHubModule
- R-035: ApiMarketplaceModule SERVED_BY IntegrationHubModule

## Traceability Reference

Source anchors: capability_map.md CAP-34

## Navigation

- ↑ Domain: [[D_13_External_Integration]]
- ↓ Components: [[CMP_53_ErpConnectorsModule]] · [[CMP_54_ApiMarketplaceModule]] · [[CMP_55_IntegrationHubModule]]
- ← [Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
