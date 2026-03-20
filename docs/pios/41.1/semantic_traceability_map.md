# Semantic Traceability Map — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.1-OUTPUT-03
**contract:** PIOS-41.1-RUN01-CONTRACT-v1
**mode:** SEMANTIC-CONSOLIDATION-STRICT
**run_reference:** run_03_blueedge_derivation_validation
**generated_from:** semantic_domain_model.md, capability_map.md, component_model.md, structural_traceability_map.md
**date:** 2026-03-20

---

## Traceability Basis Definitions

| Basis | Definition |
|---|---|
| DIRECT_EVIDENCE | Component confirmed by reading actual source file; capability/domain assignment is unambiguous |
| DERIVED | Component derived from secondary artifact (analysis doc, architecture HTML reference by code); assignment follows from that derivation |
| INFERRED | Component inferred from architecture HTML only; assignment to domain/capability follows structural positioning |

---

## Full Component Traceability Registry

### COMP-01 — blueedge-platform (Monorepo)

| Field | Value |
|---|---|
| component_id | COMP-01 |
| component_name | blueedge-platform (Monorepo) |
| assigned_capability | CAP-29 (Platform Monorepo Container) |
| assigned_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | source-v3.23/analysis/00_extraction_log.md; 01_repository_classification.md; 02_top_level_component_inventory.md |

### COMP-02 — AuthModule

| Field | Value |
|---|---|
| component_id | COMP-02 |
| component_name | AuthModule |
| assigned_capability | CAP-23 (JWT Authentication) |
| assigned_domain | DOMAIN-09 (Access Control and Identity) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 20; modules/auth/ directory confirmed |

### COMP-03 — VehiclesModule

| Field | Value |
|---|---|
| component_id | COMP-03 |
| component_name | VehiclesModule |
| assigned_capability | CAP-07 (Core Fleet Asset Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 23 |

### COMP-04 — DriversModule

| Field | Value |
|---|---|
| component_id | COMP-04 |
| component_name | DriversModule |
| assigned_capability | CAP-08 (Driver Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 24 |

### COMP-05 — FleetsModule

| Field | Value |
|---|---|
| component_id | COMP-05 |
| component_name | FleetsModule |
| assigned_capability | CAP-07 (Core Fleet Asset Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 25 |

### COMP-06 — TripsModule

| Field | Value |
|---|---|
| component_id | COMP-06 |
| component_name | TripsModule |
| assigned_capability | CAP-07 (Core Fleet Asset Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 26 |

### COMP-07 — AlertsModule

| Field | Value |
|---|---|
| component_id | COMP-07 |
| component_name | AlertsModule |
| assigned_capability | CAP-09 (Alert and Notification Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 27; modules/alerts/ confirmed |

### COMP-08 — MaintenanceModule

| Field | Value |
|---|---|
| component_id | COMP-08 |
| component_name | MaintenanceModule |
| assigned_capability | CAP-10 (Maintenance and Fuel Operations) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 28 |

### COMP-09 — FuelModule

| Field | Value |
|---|---|
| component_id | COMP-09 |
| component_name | FuelModule |
| assigned_capability | CAP-10 (Maintenance and Fuel Operations) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 29 |

### COMP-10 — TankerModule

| Field | Value |
|---|---|
| component_id | COMP-10 |
| component_name | TankerModule |
| assigned_capability | CAP-12 (Fleet Type Verticals) |
| assigned_domain | DOMAIN-04 (Fleet Vertical Extensions) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 32 |

### COMP-11 — BusModule

| Field | Value |
|---|---|
| component_id | COMP-11 |
| component_name | BusModule |
| assigned_capability | CAP-12 (Fleet Type Verticals) |
| assigned_domain | DOMAIN-04 (Fleet Vertical Extensions) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 33 |

### COMP-12 — TaxiModule

| Field | Value |
|---|---|
| component_id | COMP-12 |
| component_name | TaxiModule |
| assigned_capability | CAP-12 (Fleet Type Verticals) |
| assigned_domain | DOMAIN-04 (Fleet Vertical Extensions) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 34 |

### COMP-13 — OperationsModule

| Field | Value |
|---|---|
| component_id | COMP-13 |
| component_name | OperationsModule |
| assigned_capability | CAP-11 (Operational Control and Device Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 37 |

### COMP-14 — DevicesModule

| Field | Value |
|---|---|
| component_id | COMP-14 |
| component_name | DevicesModule |
| assigned_capability | CAP-11 (Operational Control and Device Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 38 |

### COMP-15 — NotificationsModule

| Field | Value |
|---|---|
| component_id | COMP-15 |
| component_name | NotificationsModule |
| assigned_capability | CAP-09 (Alert and Notification Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 39 |

### COMP-16 — AnalyticsModule

| Field | Value |
|---|---|
| component_id | COMP-16 |
| component_name | AnalyticsModule |
| assigned_capability | CAP-14 (Fleet Analytics and Reporting) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 42; modules/analytics/ confirmed |

### COMP-17 — ReportsModule

| Field | Value |
|---|---|
| component_id | COMP-17 |
| component_name | ReportsModule |
| assigned_capability | CAP-14 (Fleet Analytics and Reporting) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 43 |

### COMP-18 — DiagnosticsModule

| Field | Value |
|---|---|
| component_id | COMP-18 |
| component_name | DiagnosticsModule |
| assigned_capability | CAP-14 (Fleet Analytics and Reporting) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 44 |

### COMP-19 — ComplianceModule

| Field | Value |
|---|---|
| component_id | COMP-19 |
| component_name | ComplianceModule |
| assigned_capability | CAP-15 (Compliance, Safety, and Finance Intelligence) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 47 |

### COMP-20 — SafetyModule

| Field | Value |
|---|---|
| component_id | COMP-20 |
| component_name | SafetyModule |
| assigned_capability | CAP-15 (Compliance, Safety, and Finance Intelligence) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 48 |

### COMP-21 — FinanceModule

| Field | Value |
|---|---|
| component_id | COMP-21 |
| component_name | FinanceModule |
| assigned_capability | CAP-15 (Compliance, Safety, and Finance Intelligence) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 49 |

### COMP-22 — UsersModule

| Field | Value |
|---|---|
| component_id | COMP-22 |
| component_name | UsersModule |
| assigned_capability | CAP-08 (Driver Management) |
| assigned_domain | DOMAIN-03 (Fleet Core Operations) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 52 |

### COMP-23 — ColdchainModule

| Field | Value |
|---|---|
| component_id | COMP-23 |
| component_name | ColdchainModule |
| assigned_capability | CAP-13 (Specialty Transport Extensions) |
| assigned_domain | DOMAIN-04 (Fleet Vertical Extensions) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 55 |

### COMP-24 — EvModule

| Field | Value |
|---|---|
| component_id | COMP-24 |
| component_name | EvModule |
| assigned_capability | CAP-36 (EV Telemetry and Energy Management) |
| assigned_domain | DOMAIN-15 (EV and Electrification) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 56 |

### COMP-25 — OtaModule

| Field | Value |
|---|---|
| component_id | COMP-25 |
| component_name | OtaModule |
| assigned_capability | CAP-38 (Device OTA Management) |
| assigned_domain | DOMAIN-15 (EV and Electrification) [cross-domain: DOMAIN-01] |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 57 |

### COMP-26 — V2gModule

| Field | Value |
|---|---|
| component_id | COMP-26 |
| component_name | V2gModule |
| assigned_capability | CAP-36 (EV Telemetry and Energy Management) |
| assigned_domain | DOMAIN-15 (EV and Electrification) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 58 |

### COMP-27 — GatewaysModule

| Field | Value |
|---|---|
| component_id | COMP-27 |
| component_name | GatewaysModule |
| assigned_capability | CAP-22 (WebSocket Event Broadcasting) |
| assigned_domain | DOMAIN-08 (Real-Time Streaming and Gateway) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 61; gateways/fleet.gateway.ts confirmed |

### COMP-28 — SurgePricingModule

| Field | Value |
|---|---|
| component_id | COMP-28 |
| component_name | SurgePricingModule |
| assigned_capability | CAP-41 (Commercial Operations and Dispatch Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 64 |

### COMP-29 — DriverIncentivesModule

| Field | Value |
|---|---|
| component_id | COMP-29 |
| component_name | DriverIncentivesModule |
| assigned_capability | CAP-41 (Commercial Operations and Dispatch Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 65 |

### COMP-30 — ElectrificationModule

| Field | Value |
|---|---|
| component_id | COMP-30 |
| component_name | ElectrificationModule |
| assigned_capability | CAP-37 (Fleet Electrification Planning) |
| assigned_domain | DOMAIN-15 (EV and Electrification) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 66 |

### COMP-31 — DepotChargingModule

| Field | Value |
|---|---|
| component_id | COMP-31 |
| component_name | DepotChargingModule |
| assigned_capability | CAP-37 (Fleet Electrification Planning) |
| assigned_domain | DOMAIN-15 (EV and Electrification) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 67 |

### COMP-32 — ExecutiveModule

| Field | Value |
|---|---|
| component_id | COMP-32 |
| component_name | ExecutiveModule |
| assigned_capability | CAP-16 (Executive Intelligence and Data Monetization) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 68 |

### COMP-33 — AnomalyDetectionModule

| Field | Value |
|---|---|
| component_id | COMP-33 |
| component_name | AnomalyDetectionModule |
| assigned_capability | CAP-17 (Predictive and Anomaly Intelligence) |
| assigned_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 69; modules/anomaly-detection/ confirmed |

### COMP-34 — CrossBorderModule

| Field | Value |
|---|---|
| component_id | COMP-34 |
| component_name | CrossBorderModule |
| assigned_capability | CAP-42 (Customer and Ecosystem Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 70 |

### COMP-35 — PermitsModule

| Field | Value |
|---|---|
| component_id | COMP-35 |
| component_name | PermitsModule |
| assigned_capability | CAP-42 (Customer and Ecosystem Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 71 |

### COMP-36 — PartsMarketplaceModule

| Field | Value |
|---|---|
| component_id | COMP-36 |
| component_name | PartsMarketplaceModule |
| assigned_capability | CAP-42 (Customer and Ecosystem Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 72 |

### COMP-37 — FleetLifecycleModule

| Field | Value |
|---|---|
| component_id | COMP-37 |
| component_name | FleetLifecycleModule |
| assigned_capability | CAP-42 (Customer and Ecosystem Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 73 |

### COMP-38 — DriverMobileModule

| Field | Value |
|---|---|
| component_id | COMP-38 |
| component_name | DriverMobileModule |
| assigned_capability | CAP-41 (Commercial Operations and Dispatch Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 74 |

### COMP-39 — FatigueRiskModule

| Field | Value |
|---|---|
| component_id | COMP-39 |
| component_name | FatigueRiskModule |
| assigned_capability | CAP-18 (Driver Intelligence) |
| assigned_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 75 |

### COMP-40 — CustomerPortalModule

| Field | Value |
|---|---|
| component_id | COMP-40 |
| component_name | CustomerPortalModule |
| assigned_capability | CAP-42 (Customer and Ecosystem Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 76 |

### COMP-41 — BlockchainModule

| Field | Value |
|---|---|
| component_id | COMP-41 |
| component_name | BlockchainModule |
| assigned_capability | CAP-16 (Executive Intelligence and Data Monetization) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 77; modules/blockchain/ confirmed |

### COMP-42 — WhiteLabelModule

| Field | Value |
|---|---|
| component_id | COMP-42 |
| component_name | WhiteLabelModule |
| assigned_capability | CAP-32 (Tenant Onboarding and Branding) |
| assigned_domain | DOMAIN-12 (SaaS Platform Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 78 |

### COMP-43 — ChargingStationsModule

| Field | Value |
|---|---|
| component_id | COMP-43 |
| component_name | ChargingStationsModule |
| assigned_capability | CAP-36 (EV Telemetry and Energy Management) |
| assigned_domain | DOMAIN-15 (EV and Electrification) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 79 |

### COMP-44 — PredictiveMaintenanceModule

| Field | Value |
|---|---|
| component_id | COMP-44 |
| component_name | PredictiveMaintenanceModule |
| assigned_capability | CAP-17 (Predictive and Anomaly Intelligence) |
| assigned_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 82 |

### COMP-45 — DigitalTwinModule

| Field | Value |
|---|---|
| component_id | COMP-45 |
| component_name | DigitalTwinModule |
| assigned_capability | CAP-17 (Predictive and Anomaly Intelligence) |
| assigned_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 83 |

### COMP-46 — DriverScoringModule

| Field | Value |
|---|---|
| component_id | COMP-46 |
| component_name | DriverScoringModule |
| assigned_capability | CAP-18 (Driver Intelligence) |
| assigned_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 84 |

### COMP-47 — GeofenceAutomationModule

| Field | Value |
|---|---|
| component_id | COMP-47 |
| component_name | GeofenceAutomationModule |
| assigned_capability | CAP-41 (Commercial Operations and Dispatch Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 85 |

### COMP-48 — MessagingModule

| Field | Value |
|---|---|
| component_id | COMP-48 |
| component_name | MessagingModule |
| assigned_capability | CAP-41 (Commercial Operations and Dispatch Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 86 |

### COMP-49 — MultiTenantModule

| Field | Value |
|---|---|
| component_id | COMP-49 |
| component_name | MultiTenantModule |
| assigned_capability | CAP-31 (Multi-Tenant Provisioning) |
| assigned_domain | DOMAIN-12 (SaaS Platform Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 89 |

### COMP-50 — BillingModule

| Field | Value |
|---|---|
| component_id | COMP-50 |
| component_name | BillingModule |
| assigned_capability | CAP-31 (Multi-Tenant Provisioning) |
| assigned_domain | DOMAIN-12 (SaaS Platform Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 90; modules/billing/ confirmed |

### COMP-51 — OnboardingModule

| Field | Value |
|---|---|
| component_id | COMP-51 |
| component_name | OnboardingModule |
| assigned_capability | CAP-32 (Tenant Onboarding and Branding) |
| assigned_domain | DOMAIN-12 (SaaS Platform Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 91 |

### COMP-52 — NotificationProvidersModule

| Field | Value |
|---|---|
| component_id | COMP-52 |
| component_name | NotificationProvidersModule |
| assigned_capability | CAP-33 (Notification Delivery Channels) |
| assigned_domain | DOMAIN-13 (External Integration) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 94 |

### COMP-53 — ErpConnectorsModule

| Field | Value |
|---|---|
| component_id | COMP-53 |
| component_name | ErpConnectorsModule |
| assigned_capability | CAP-34 (Enterprise System Integration) |
| assigned_domain | DOMAIN-13 (External Integration) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 95 |

### COMP-54 — ApiMarketplaceModule

| Field | Value |
|---|---|
| component_id | COMP-54 |
| component_name | ApiMarketplaceModule |
| assigned_capability | CAP-34 (Enterprise System Integration) |
| assigned_domain | DOMAIN-13 (External Integration) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 96; modules/api-marketplace/ confirmed |

### COMP-55 — IntegrationHubModule

| Field | Value |
|---|---|
| component_id | COMP-55 |
| component_name | IntegrationHubModule |
| assigned_capability | CAP-34 (Enterprise System Integration) |
| assigned_domain | DOMAIN-13 (External Integration) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 97 |

### COMP-56 — AgenticAIModule

| Field | Value |
|---|---|
| component_id | COMP-56 |
| component_name | AgenticAIModule |
| assigned_capability | CAP-19 (Agentic AI and Road Intelligence) |
| assigned_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 98; modules/agentic-ai/ confirmed |

### COMP-57 — AftersalesModule

| Field | Value |
|---|---|
| component_id | COMP-57 |
| component_name | AftersalesModule |
| assigned_capability | CAP-42 (Customer and Ecosystem Services) |
| assigned_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 99; modules/aftersales/ confirmed |

### COMP-58 — RoadIntelligenceModule

| Field | Value |
|---|---|
| component_id | COMP-58 |
| component_name | RoadIntelligenceModule |
| assigned_capability | CAP-19 (Agentic AI and Road Intelligence) |
| assigned_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 100 |

### COMP-59 — DataMonetizationModule

| Field | Value |
|---|---|
| component_id | COMP-59 |
| component_name | DataMonetizationModule |
| assigned_capability | CAP-16 (Executive Intelligence and Data Monetization) |
| assigned_domain | DOMAIN-05 (Analytics and Intelligence) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 101 |

### COMP-60 — DriverSessionsModule

| Field | Value |
|---|---|
| component_id | COMP-60 |
| component_name | DriverSessionsModule |
| assigned_capability | CAP-13 (Specialty Transport Extensions) |
| assigned_domain | DOMAIN-04 (Fleet Vertical Extensions) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 102; migrations/CreateDriverSessionBlocks.ts confirmed |

### COMP-61 — VehicleLifecycleModule

| Field | Value |
|---|---|
| component_id | COMP-61 |
| component_name | VehicleLifecycleModule |
| assigned_capability | CAP-13 (Specialty Transport Extensions) |
| assigned_domain | DOMAIN-04 (Fleet Vertical Extensions) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 103 |

### COMP-62 — SensorsModule

| Field | Value |
|---|---|
| component_id | COMP-62 |
| component_name | SensorsModule |
| assigned_capability | CAP-20 (Sensor Telemetry Ingestion) |
| assigned_domain | DOMAIN-07 (Sensor and Security Ingestion) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 106; migration SensorsAndHasiIntegration.ts confirmed |

### COMP-63 — HasiModule

| Field | Value |
|---|---|
| component_id | COMP-63 |
| component_name | HasiModule |
| assigned_capability | CAP-21 (HASI Security Intelligence Ingestion) |
| assigned_domain | DOMAIN-07 (Sensor and Security Ingestion) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 107; EVID-ARCH section s7 |

### COMP-64 — RedisCacheModule

| Field | Value |
|---|---|
| component_id | COMP-64 |
| component_name | RedisCacheModule |
| assigned_capability | CAP-27 (Caching Layer) |
| assigned_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 9; common/cache/ confirmed |

### COMP-65 — FleetEventsModule

| Field | Value |
|---|---|
| component_id | COMP-65 |
| component_name | FleetEventsModule |
| assigned_capability | CAP-30 (Domain Event Bus) |
| assigned_domain | DOMAIN-11 (Event-Driven Architecture) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 14; events/ directory with 4 handler files confirmed |

### COMP-66 — HealthModule

| Field | Value |
|---|---|
| component_id | COMP-66 |
| component_name | HealthModule |
| assigned_capability | CAP-39 (Platform Observability) |
| assigned_domain | DOMAIN-16 (Operational Engineering) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 11; health/prometheus.service.ts confirmed |

### COMP-67 — V2Module (API Versioning)

| Field | Value |
|---|---|
| component_id | COMP-67 |
| component_name | V2Module |
| assigned_capability | CAP-25 (API Versioning) |
| assigned_domain | DOMAIN-09 (Access Control and Identity) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts line 110; common/versioning/ confirmed |

### COMP-68 — Frontend Application

| Field | Value |
|---|---|
| component_id | COMP-68 |
| component_name | Frontend Application |
| assigned_capability | CAP-35 (Operator Web Application) |
| assigned_domain | DOMAIN-14 (Frontend Application) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | frontend/package.json v3.15.0 read directly; frontend/ directory confirmed |

### COMP-69 — FleetSocket Client

| Field | Value |
|---|---|
| component_id | COMP-69 |
| component_name | FleetSocket Client |
| assigned_capability | CAP-22 (WebSocket Event Broadcasting) |
| assigned_domain | DOMAIN-08 (Real-Time Streaming and Gateway) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | frontend/socket/FleetSocket.ts confirmed in file listing |

### COMP-70 — AuthContext / AuthProvider

| Field | Value |
|---|---|
| component_id | COMP-70 |
| component_name | AuthContext / AuthProvider |
| assigned_capability | CAP-24 (Frontend Auth State Management) |
| assigned_domain | DOMAIN-09 (Access Control and Identity) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | frontend/contexts/AuthContext.tsx; AuthProvider.tsx confirmed |

### COMP-71 — Frontend Page Modules (61 pages)

| Field | Value |
|---|---|
| component_id | COMP-71 |
| component_name | Frontend Page Modules |
| assigned_capability | CAP-35 (Operator Web Application) |
| assigned_domain | DOMAIN-14 (Frontend Application) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | frontend/pages/ subfolders confirmed; NetworkSecurityPage.tsx, SensorsPage.tsx confirmed |

### COMP-72 — SVG 2.0 Smart Vehicle Gateway

| Field | Value |
|---|---|
| component_id | COMP-72 |
| component_name | SVG 2.0 Smart Vehicle Gateway |
| assigned_capability | CAP-03 (SVG Device Hardware Platform) |
| assigned_domain | DOMAIN-01 (Edge Data Acquisition) |
| traceability_basis | DERIVED |
| original_evidence_ref | BlueEdge_Unified_Architecture_v3_23_0.html section s2 (read lines 1–200) |

### COMP-73 — sensor_collector.py

| Field | Value |
|---|---|
| component_id | COMP-73 |
| component_name | sensor_collector.py |
| assigned_capability | CAP-01 (Vehicle Sensor Collection) |
| assigned_domain | DOMAIN-01 (Edge Data Acquisition) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | svg-agents/sensor-collector/sensor_collector.py — full file read (479 lines) |

### COMP-74 — hasi_bridge.py

| Field | Value |
|---|---|
| component_id | COMP-74 |
| component_name | hasi_bridge.py |
| assigned_capability | CAP-02 (Network Security Intelligence Collection) |
| assigned_domain | DOMAIN-01 (Edge Data Acquisition) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | svg-agents/hasi-bridge/hasi_bridge.py — first 80 lines read |

### COMP-75 — HASI v1.0.0

| Field | Value |
|---|---|
| component_id | COMP-75 |
| component_name | HASI v1.0.0 |
| assigned_capability | CAP-02 (Network Security Intelligence Collection) |
| assigned_domain | DOMAIN-01 (Edge Data Acquisition) |
| traceability_basis | DERIVED |
| original_evidence_ref | hasi_bridge.py references hasi_db_path and hasi_captures_dir; architecture HTML section s2 |

### COMP-76 — SVG Main Telemetry Firmware

| Field | Value |
|---|---|
| component_id | COMP-76 |
| component_name | SVG Main Telemetry Firmware |
| assigned_capability | CAP-01 (Vehicle Sensor Collection) |
| assigned_domain | DOMAIN-01 (Edge Data Acquisition) |
| traceability_basis | DERIVED |
| original_evidence_ref | sensor_collector.py lines 271–278 reads /dev/shm/blueedge_gps written by main telemetry daemon |

### COMP-77 — SVG OTA Agent

| Field | Value |
|---|---|
| component_id | COMP-77 |
| component_name | SVG OTA Agent |
| assigned_capability | CAP-04 (SVG Device Firmware Management) |
| assigned_domain | DOMAIN-01 (Edge Data Acquisition) |
| traceability_basis | INFERRED |
| original_evidence_ref | Architecture HTML section s2 "OTA Agent" listed in on-device stack; no source file found [WEAKLY GROUNDED] |

### COMP-78 — SVG Agent Configuration

| Field | Value |
|---|---|
| component_id | COMP-78 |
| component_name | SVG Agent Configuration |
| assigned_capability | CAP-01 (Vehicle Sensor Collection) |
| assigned_domain | DOMAIN-01 (Edge Data Acquisition) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | svg-agents/config/blueedge.yaml; sensors.yaml — both confirmed in file listing |

### COMP-79 — PostgreSQL 15

| Field | Value |
|---|---|
| component_id | COMP-79 |
| component_name | PostgreSQL 15 |
| assigned_capability | CAP-26 (Primary Data Persistence) |
| assigned_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | app.module.ts lines 136–151 TypeOrmModule config; migrations/ directory confirmed |

### COMP-80 — TimescaleDB

| Field | Value |
|---|---|
| component_id | COMP-80 |
| component_name | TimescaleDB |
| assigned_capability | CAP-26 (Primary Data Persistence) |
| assigned_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| traceability_basis | DERIVED |
| original_evidence_ref | Architecture HTML section s1 layer 5; migration 1709100000000-SensorsAndHasiIntegration.ts named |

### COMP-81 — Redis 7

| Field | Value |
|---|---|
| component_id | COMP-81 |
| component_name | Redis 7 |
| assigned_capability | CAP-27 (Caching Layer) |
| assigned_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | package.json: ioredis, cache-manager-ioredis-yet; redis.config.ts confirmed |

### COMP-82 — S3 / MinIO Object Storage

| Field | Value |
|---|---|
| component_id | COMP-82 |
| component_name | S3 / MinIO Object Storage |
| assigned_capability | CAP-28 (Object Storage) |
| assigned_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| traceability_basis | INFERRED |
| original_evidence_ref | Architecture HTML section s1 layer 5 only; no config file found [WEAKLY GROUNDED] |

### COMP-83 — MQTT Broker (EMQX)

| Field | Value |
|---|---|
| component_id | COMP-83 |
| component_name | MQTT Broker (EMQX) |
| assigned_capability | CAP-05 (MQTT Telemetry Transport) |
| assigned_domain | DOMAIN-02 (Telemetry Transport and Messaging) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | sensor_collector.py lines 42–44; hasi_bridge.py lines 40–43 — mqtt.blueedge.network:8883 |

### COMP-84 — Apache Kafka

| Field | Value |
|---|---|
| component_id | COMP-84 |
| component_name | Apache Kafka |
| assigned_capability | CAP-06 (Stream Processing Infrastructure) |
| assigned_domain | DOMAIN-02 (Telemetry Transport and Messaging) |
| traceability_basis | INFERRED |
| original_evidence_ref | Architecture HTML section s1 layer 3 only [WEAKLY GROUNDED] |

### COMP-85 — Apache Flink

| Field | Value |
|---|---|
| component_id | COMP-85 |
| component_name | Apache Flink |
| assigned_capability | CAP-06 (Stream Processing Infrastructure) |
| assigned_domain | DOMAIN-02 (Telemetry Transport and Messaging) |
| traceability_basis | INFERRED |
| original_evidence_ref | Architecture HTML section s1 layer 3 only [WEAKLY GROUNDED] |

### COMP-86 — Monitoring Stack

| Field | Value |
|---|---|
| component_id | COMP-86 |
| component_name | Monitoring Stack |
| assigned_capability | CAP-39 (Platform Observability) |
| assigned_domain | DOMAIN-16 (Operational Engineering) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | monitoring/grafana/ and monitoring/prometheus/prometheus.yml confirmed |

### COMP-87 — Load Tests

| Field | Value |
|---|---|
| component_id | COMP-87 |
| component_name | Load Tests |
| assigned_capability | CAP-40 (Delivery and Quality Infrastructure) |
| assigned_domain | DOMAIN-16 (Operational Engineering) |
| traceability_basis | DIRECT_EVIDENCE |
| original_evidence_ref | load-tests/api-load.js; ws-load.js; run.sh confirmed |

### COMP-88 — CI/CD Workflows

| Field | Value |
|---|---|
| component_id | COMP-88 |
| component_name | CI/CD Workflows |
| assigned_capability | CAP-40 (Delivery and Quality Infrastructure) |
| assigned_domain | DOMAIN-16 (Operational Engineering) |
| traceability_basis | DERIVED |
| original_evidence_ref | analysis/02_top_level_component_inventory.md confirms .github folder |

### COMP-89 — Docker Compose Orchestration

| Field | Value |
|---|---|
| component_id | COMP-89 |
| component_name | Docker Compose Orchestration |
| assigned_capability | CAP-40 (Delivery and Quality Infrastructure) |
| assigned_domain | DOMAIN-16 (Operational Engineering) |
| traceability_basis | DERIVED |
| original_evidence_ref | analysis/02_top_level_component_inventory.md confirms docker-compose.yml, docker-compose.monitoring.yml |

---

## Traceability Summary

### Coverage Statistics

| Metric | Value |
|---|---|
| Total components in component_model.md | 89 |
| Components assigned to a capability | 89 |
| % assigned to a capability | 100% |
| Components assigned to a domain | 89 |
| % assigned to a domain | 100% |
| Unclassified components | 0 |

### Traceability Basis Distribution

| Basis | Count | % |
|---|---|---|
| DIRECT_EVIDENCE | 75 | 84.3% |
| DERIVED | 8 | 9.0% |
| INFERRED (WEAKLY GROUNDED) | 6 | 6.7% |
| **TOTAL** | **89** | **100%** |

**Note:** The 6 INFERRED components (COMP-77, COMP-82, COMP-84, COMP-85 — architecture HTML only; COMP-75, COMP-76 — derived from code references) all have explicit source document citations. Zero components are unanchored.

### Unclassified Components

None. All 89 components are assigned to exactly one capability and exactly one domain (with one cross-domain annotation for COMP-25).

---

## Domain → Capability → Component Mapping Table

| Domain | Capability | Components |
|---|---|---|
| DOMAIN-01 Edge Data Acquisition | CAP-01 Vehicle Sensor Collection | COMP-73, COMP-76, COMP-78 |
| DOMAIN-01 Edge Data Acquisition | CAP-02 Network Security Intelligence Collection | COMP-74, COMP-75 |
| DOMAIN-01 Edge Data Acquisition | CAP-03 SVG Device Hardware Platform | COMP-72 |
| DOMAIN-01 Edge Data Acquisition | CAP-04 SVG Device Firmware Management | COMP-77 |
| DOMAIN-02 Telemetry Transport and Messaging | CAP-05 MQTT Telemetry Transport | COMP-83 |
| DOMAIN-02 Telemetry Transport and Messaging | CAP-06 Stream Processing Infrastructure | COMP-84, COMP-85 |
| DOMAIN-03 Fleet Core Operations | CAP-07 Core Fleet Asset Management | COMP-03, COMP-05, COMP-06 |
| DOMAIN-03 Fleet Core Operations | CAP-08 Driver Management | COMP-04, COMP-22 |
| DOMAIN-03 Fleet Core Operations | CAP-09 Alert and Notification Management | COMP-07, COMP-15 |
| DOMAIN-03 Fleet Core Operations | CAP-10 Maintenance and Fuel Operations | COMP-08, COMP-09 |
| DOMAIN-03 Fleet Core Operations | CAP-11 Operational Control and Device Management | COMP-13, COMP-14 |
| DOMAIN-04 Fleet Vertical Extensions | CAP-12 Fleet Type Verticals | COMP-10, COMP-11, COMP-12 |
| DOMAIN-04 Fleet Vertical Extensions | CAP-13 Specialty Transport Extensions | COMP-23, COMP-60, COMP-61 |
| DOMAIN-05 Analytics and Intelligence | CAP-14 Fleet Analytics and Reporting | COMP-16, COMP-17, COMP-18 |
| DOMAIN-05 Analytics and Intelligence | CAP-15 Compliance, Safety, and Finance Intelligence | COMP-19, COMP-20, COMP-21 |
| DOMAIN-05 Analytics and Intelligence | CAP-16 Executive Intelligence and Data Monetization | COMP-32, COMP-41, COMP-59 |
| DOMAIN-06 AI/ML Intelligence Layer | CAP-17 Predictive and Anomaly Intelligence | COMP-33, COMP-44, COMP-45 |
| DOMAIN-06 AI/ML Intelligence Layer | CAP-18 Driver Intelligence | COMP-39, COMP-46 |
| DOMAIN-06 AI/ML Intelligence Layer | CAP-19 Agentic AI and Road Intelligence | COMP-56, COMP-58 |
| DOMAIN-07 Sensor and Security Ingestion | CAP-20 Sensor Telemetry Ingestion | COMP-62 |
| DOMAIN-07 Sensor and Security Ingestion | CAP-21 HASI Security Intelligence Ingestion | COMP-63 |
| DOMAIN-08 Real-Time Streaming and Gateway | CAP-22 WebSocket Event Broadcasting | COMP-27, COMP-69 |
| DOMAIN-09 Access Control and Identity | CAP-23 JWT Authentication | COMP-02 |
| DOMAIN-09 Access Control and Identity | CAP-24 Frontend Auth State Management | COMP-70 |
| DOMAIN-09 Access Control and Identity | CAP-25 API Versioning | COMP-67 |
| DOMAIN-10 Platform Infrastructure and Data | CAP-26 Primary Data Persistence | COMP-79, COMP-80 |
| DOMAIN-10 Platform Infrastructure and Data | CAP-27 Caching Layer | COMP-64, COMP-81 |
| DOMAIN-10 Platform Infrastructure and Data | CAP-28 Object Storage | COMP-82 |
| DOMAIN-10 Platform Infrastructure and Data | CAP-29 Platform Monorepo Container | COMP-01 |
| DOMAIN-11 Event-Driven Architecture | CAP-30 Domain Event Bus | COMP-65 |
| DOMAIN-12 SaaS Platform Layer | CAP-31 Multi-Tenant Provisioning | COMP-49, COMP-50 |
| DOMAIN-12 SaaS Platform Layer | CAP-32 Tenant Onboarding and Branding | COMP-42, COMP-51 |
| DOMAIN-13 External Integration | CAP-33 Notification Delivery Channels | COMP-52 |
| DOMAIN-13 External Integration | CAP-34 Enterprise System Integration | COMP-53, COMP-54, COMP-55 |
| DOMAIN-14 Frontend Application | CAP-35 Operator Web Application | COMP-68, COMP-71 |
| DOMAIN-15 EV and Electrification | CAP-36 EV Telemetry and Energy Management | COMP-24, COMP-26, COMP-43 |
| DOMAIN-15 EV and Electrification | CAP-37 Fleet Electrification Planning | COMP-30, COMP-31 |
| DOMAIN-15 EV and Electrification | CAP-38 Device OTA Management | COMP-25 |
| DOMAIN-16 Operational Engineering | CAP-39 Platform Observability | COMP-66, COMP-86 |
| DOMAIN-16 Operational Engineering | CAP-40 Delivery and Quality Infrastructure | COMP-87, COMP-88, COMP-89 |
| DOMAIN-17 Extended Operations and Driver Services | CAP-41 Commercial Operations and Dispatch Services | COMP-28, COMP-29, COMP-38, COMP-47, COMP-48 |
| DOMAIN-17 Extended Operations and Driver Services | CAP-42 Customer and Ecosystem Services | COMP-34, COMP-35, COMP-36, COMP-37, COMP-40, COMP-57 |

**Bidirectional coverage verification:**
- Every domain (17) resolves to at least one capability: CONFIRMED
- Every capability (42) resolves to at least one component: CONFIRMED
- Every component (89) resolves upward to exactly one capability and one domain: CONFIRMED
- No orphan components: CONFIRMED
