# Semantic Traceability Index — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.2-TRACEABILITY-INDEX
**contract_id:** PIOS-41.2-RUN01-CONTRACT-v1
**mode:** PIE-RENDER-STRICT
**generated_from:** docs/pios/41.1/semantic_traceability_map.md
**date:** 2026-03-20

---

## Traceability Summary

| Metric | Value |
|---|---|
| Total components | 89 |
| DIRECT_EVIDENCE | 75 (84.3%) |
| DERIVED | 8 (9.0%) |
| INFERRED (WEAKLY GROUNDED) | 6 (6.7%) |
| Components assigned to capability | 89 (100%) |
| Components assigned to domain | 89 (100%) |
| Orphan components | 0 |

Full source: [semantic_traceability_map.md](../../../../41.1/semantic_traceability_map.md)

---

## Component → Capability → Domain Traceability Table

| Component ID | Component Name | Capability ID | Capability Name | Domain ID | Domain Name | Evidence Basis | Source Reference |
|---|---|---|---|---|---|---|---|
| COMP-01 | blueedge-platform (Monorepo) | CAP-29 | Platform Monorepo Container | DOMAIN-10 | Platform Infrastructure and Data | DIRECT_EVIDENCE | source-v3.23/analysis/00_extraction_log.md |
| COMP-02 | AuthModule | CAP-23 | JWT Authentication | DOMAIN-09 | Access Control and Identity | DIRECT_EVIDENCE | app.module.ts line 20 |
| COMP-03 | VehiclesModule | CAP-07 | Core Fleet Asset Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 23 |
| COMP-04 | DriversModule | CAP-08 | Driver Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 24 |
| COMP-05 | FleetsModule | CAP-07 | Core Fleet Asset Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 25 |
| COMP-06 | TripsModule | CAP-07 | Core Fleet Asset Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 26 |
| COMP-07 | AlertsModule | CAP-09 | Alert and Notification Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 27 |
| COMP-08 | MaintenanceModule | CAP-10 | Maintenance and Fuel Operations | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 28 |
| COMP-09 | FuelModule | CAP-10 | Maintenance and Fuel Operations | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 29 |
| COMP-10 | TankerModule | CAP-12 | Fleet Type Verticals | DOMAIN-04 | Fleet Vertical Extensions | DIRECT_EVIDENCE | app.module.ts line 32 |
| COMP-11 | BusModule | CAP-12 | Fleet Type Verticals | DOMAIN-04 | Fleet Vertical Extensions | DIRECT_EVIDENCE | app.module.ts line 33 |
| COMP-12 | TaxiModule | CAP-12 | Fleet Type Verticals | DOMAIN-04 | Fleet Vertical Extensions | DIRECT_EVIDENCE | app.module.ts line 34 |
| COMP-13 | OperationsModule | CAP-11 | Operational Control and Device Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 37 |
| COMP-14 | DevicesModule | CAP-11 | Operational Control and Device Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 38 |
| COMP-15 | NotificationsModule | CAP-09 | Alert and Notification Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 39 |
| COMP-16 | AnalyticsModule | CAP-14 | Fleet Analytics and Reporting | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 42 |
| COMP-17 | ReportsModule | CAP-14 | Fleet Analytics and Reporting | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 43 |
| COMP-18 | DiagnosticsModule | CAP-14 | Fleet Analytics and Reporting | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 44 |
| COMP-19 | ComplianceModule | CAP-15 | Compliance, Safety, and Finance Intelligence | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 47 |
| COMP-20 | SafetyModule | CAP-15 | Compliance, Safety, and Finance Intelligence | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 48 |
| COMP-21 | FinanceModule | CAP-15 | Compliance, Safety, and Finance Intelligence | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 49 |
| COMP-22 | UsersModule | CAP-08 | Driver Management | DOMAIN-03 | Fleet Core Operations | DIRECT_EVIDENCE | app.module.ts line 52 |
| COMP-23 | ColdchainModule | CAP-13 | Specialty Transport Extensions | DOMAIN-04 | Fleet Vertical Extensions | DIRECT_EVIDENCE | app.module.ts line 55 |
| COMP-24 | EvModule | CAP-36 | EV Telemetry and Energy Management | DOMAIN-15 | EV and Electrification | DIRECT_EVIDENCE | app.module.ts line 56 |
| COMP-25 | OtaModule | CAP-38 | Device OTA Management | DOMAIN-15 | EV and Electrification [cross-domain: DOMAIN-01] | DIRECT_EVIDENCE | app.module.ts line 57 |
| COMP-26 | V2gModule | CAP-36 | EV Telemetry and Energy Management | DOMAIN-15 | EV and Electrification | DIRECT_EVIDENCE | app.module.ts line 58 |
| COMP-27 | GatewaysModule | CAP-22 | WebSocket Event Broadcasting | DOMAIN-08 | Real-Time Streaming and Gateway | DIRECT_EVIDENCE | app.module.ts line 61; fleet.gateway.ts confirmed |
| COMP-28 | SurgePricingModule | CAP-41 | Commercial Operations and Dispatch Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 64 |
| COMP-29 | DriverIncentivesModule | CAP-41 | Commercial Operations and Dispatch Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 65 |
| COMP-30 | ElectrificationModule | CAP-37 | Fleet Electrification Planning | DOMAIN-15 | EV and Electrification | DIRECT_EVIDENCE | app.module.ts line 66 |
| COMP-31 | DepotChargingModule | CAP-37 | Fleet Electrification Planning | DOMAIN-15 | EV and Electrification | DIRECT_EVIDENCE | app.module.ts line 67 |
| COMP-32 | ExecutiveModule | CAP-16 | Executive Intelligence and Data Monetization | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 68 |
| COMP-33 | AnomalyDetectionModule | CAP-17 | Predictive and Anomaly Intelligence | DOMAIN-06 | AI/ML Intelligence Layer | DIRECT_EVIDENCE | app.module.ts line 69 |
| COMP-34 | CrossBorderModule | CAP-42 | Customer and Ecosystem Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 70 |
| COMP-35 | PermitsModule | CAP-42 | Customer and Ecosystem Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 71 |
| COMP-36 | PartsMarketplaceModule | CAP-42 | Customer and Ecosystem Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 72 |
| COMP-37 | FleetLifecycleModule | CAP-42 | Customer and Ecosystem Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 73 |
| COMP-38 | DriverMobileModule | CAP-41 | Commercial Operations and Dispatch Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 74 |
| COMP-39 | FatigueRiskModule | CAP-18 | Driver Intelligence | DOMAIN-06 | AI/ML Intelligence Layer | DIRECT_EVIDENCE | app.module.ts line 75 |
| COMP-40 | CustomerPortalModule | CAP-42 | Customer and Ecosystem Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 76 |
| COMP-41 | BlockchainModule | CAP-16 | Executive Intelligence and Data Monetization | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 77 |
| COMP-42 | WhiteLabelModule | CAP-32 | Tenant Onboarding and Branding | DOMAIN-12 | SaaS Platform Layer | DIRECT_EVIDENCE | app.module.ts line 78 |
| COMP-43 | ChargingStationsModule | CAP-36 | EV Telemetry and Energy Management | DOMAIN-15 | EV and Electrification | DIRECT_EVIDENCE | app.module.ts line 79 |
| COMP-44 | PredictiveMaintenanceModule | CAP-17 | Predictive and Anomaly Intelligence | DOMAIN-06 | AI/ML Intelligence Layer | DIRECT_EVIDENCE | app.module.ts line 82 |
| COMP-45 | DigitalTwinModule | CAP-17 | Predictive and Anomaly Intelligence | DOMAIN-06 | AI/ML Intelligence Layer | DIRECT_EVIDENCE | app.module.ts line 83 |
| COMP-46 | DriverScoringModule | CAP-18 | Driver Intelligence | DOMAIN-06 | AI/ML Intelligence Layer | DIRECT_EVIDENCE | app.module.ts line 84 |
| COMP-47 | GeofenceAutomationModule | CAP-41 | Commercial Operations and Dispatch Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 85 |
| COMP-48 | MessagingModule | CAP-41 | Commercial Operations and Dispatch Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 86 |
| COMP-49 | MultiTenantModule | CAP-31 | Multi-Tenant Provisioning | DOMAIN-12 | SaaS Platform Layer | DIRECT_EVIDENCE | app.module.ts line 89 |
| COMP-50 | BillingModule | CAP-31 | Multi-Tenant Provisioning | DOMAIN-12 | SaaS Platform Layer | DIRECT_EVIDENCE | app.module.ts line 90 |
| COMP-51 | OnboardingModule | CAP-32 | Tenant Onboarding and Branding | DOMAIN-12 | SaaS Platform Layer | DIRECT_EVIDENCE | app.module.ts line 91 |
| COMP-52 | NotificationProvidersModule | CAP-33 | Notification Delivery Channels | DOMAIN-13 | External Integration | DIRECT_EVIDENCE | app.module.ts line 94 |
| COMP-53 | ErpConnectorsModule | CAP-34 | Enterprise System Integration | DOMAIN-13 | External Integration | DIRECT_EVIDENCE | app.module.ts line 95 |
| COMP-54 | ApiMarketplaceModule | CAP-34 | Enterprise System Integration | DOMAIN-13 | External Integration | DIRECT_EVIDENCE | app.module.ts line 96 |
| COMP-55 | IntegrationHubModule | CAP-34 | Enterprise System Integration | DOMAIN-13 | External Integration | DIRECT_EVIDENCE | app.module.ts line 97 |
| COMP-56 | AgenticAIModule | CAP-19 | Agentic AI and Road Intelligence | DOMAIN-06 | AI/ML Intelligence Layer | DIRECT_EVIDENCE | app.module.ts line 98 |
| COMP-57 | AftersalesModule | CAP-42 | Customer and Ecosystem Services | DOMAIN-17 | Extended Operations and Driver Services | DIRECT_EVIDENCE | app.module.ts line 99 |
| COMP-58 | RoadIntelligenceModule | CAP-19 | Agentic AI and Road Intelligence | DOMAIN-06 | AI/ML Intelligence Layer | DIRECT_EVIDENCE | app.module.ts line 100 |
| COMP-59 | DataMonetizationModule | CAP-16 | Executive Intelligence and Data Monetization | DOMAIN-05 | Analytics and Intelligence | DIRECT_EVIDENCE | app.module.ts line 101 |
| COMP-60 | DriverSessionsModule | CAP-13 | Specialty Transport Extensions | DOMAIN-04 | Fleet Vertical Extensions | DIRECT_EVIDENCE | app.module.ts line 102 |
| COMP-61 | VehicleLifecycleModule | CAP-13 | Specialty Transport Extensions | DOMAIN-04 | Fleet Vertical Extensions | DIRECT_EVIDENCE | app.module.ts line 103 |
| COMP-62 | SensorsModule | CAP-20 | Sensor Telemetry Ingestion | DOMAIN-07 | Sensor and Security Ingestion | DIRECT_EVIDENCE | app.module.ts line 106 |
| COMP-63 | HasiModule | CAP-21 | HASI Security Intelligence Ingestion | DOMAIN-07 | Sensor and Security Ingestion | DIRECT_EVIDENCE | app.module.ts line 107 |
| COMP-64 | RedisCacheModule | CAP-27 | Caching Layer | DOMAIN-10 | Platform Infrastructure and Data | DIRECT_EVIDENCE | app.module.ts line 9 |
| COMP-65 | FleetEventsModule | CAP-30 | Domain Event Bus | DOMAIN-11 | Event-Driven Architecture | DIRECT_EVIDENCE | app.module.ts line 14 |
| COMP-66 | HealthModule | CAP-39 | Platform Observability | DOMAIN-16 | Operational Engineering | DIRECT_EVIDENCE | app.module.ts line 11 |
| COMP-67 | V2Module | CAP-25 | API Versioning | DOMAIN-09 | Access Control and Identity | DIRECT_EVIDENCE | app.module.ts line 110 |
| COMP-68 | Frontend Application | CAP-35 | Operator Web Application | DOMAIN-14 | Frontend Application | DIRECT_EVIDENCE | frontend/package.json v3.15.0 |
| COMP-69 | FleetSocket Client | CAP-22 | WebSocket Event Broadcasting | DOMAIN-08 | Real-Time Streaming and Gateway | DIRECT_EVIDENCE | frontend/socket/FleetSocket.ts |
| COMP-70 | AuthContext / AuthProvider | CAP-24 | Frontend Auth State Management | DOMAIN-09 | Access Control and Identity | DIRECT_EVIDENCE | frontend/contexts/AuthContext.tsx |
| COMP-71 | Frontend Page Modules (61 pages) | CAP-35 | Operator Web Application | DOMAIN-14 | Frontend Application | DIRECT_EVIDENCE | frontend/pages/ subfolders confirmed |
| COMP-72 | SVG 2.0 Smart Vehicle Gateway | CAP-03 | SVG Device Hardware Platform | DOMAIN-01 | Edge Data Acquisition | DERIVED | Architecture HTML section s2 |
| COMP-73 | sensor_collector.py | CAP-01 | Vehicle Sensor Collection | DOMAIN-01 | Edge Data Acquisition | DIRECT_EVIDENCE | svg-agents/sensor-collector/sensor_collector.py |
| COMP-74 | hasi_bridge.py | CAP-02 | Network Security Intelligence Collection | DOMAIN-01 | Edge Data Acquisition | DIRECT_EVIDENCE | svg-agents/hasi-bridge/hasi_bridge.py |
| COMP-75 | HASI v1.0.0 | CAP-02 | Network Security Intelligence Collection | DOMAIN-01 | Edge Data Acquisition | DERIVED | hasi_bridge.py references + architecture HTML s2 |
| COMP-76 | SVG Main Telemetry Firmware | CAP-01 | Vehicle Sensor Collection | DOMAIN-01 | Edge Data Acquisition | DERIVED | sensor_collector.py lines 271–278 |
| COMP-77 | SVG OTA Agent [*] | CAP-04 | SVG Device Firmware Management | DOMAIN-01 | Edge Data Acquisition | INFERRED | Architecture HTML section s2 only |
| COMP-78 | SVG Agent Configuration | CAP-01 | Vehicle Sensor Collection | DOMAIN-01 | Edge Data Acquisition | DIRECT_EVIDENCE | svg-agents/config/blueedge.yaml; sensors.yaml |
| COMP-79 | PostgreSQL 15 | CAP-26 | Primary Data Persistence | DOMAIN-10 | Platform Infrastructure and Data | DIRECT_EVIDENCE | app.module.ts lines 136–151 |
| COMP-80 | TimescaleDB | CAP-26 | Primary Data Persistence | DOMAIN-10 | Platform Infrastructure and Data | DERIVED | Architecture HTML s1 layer 5 + migration file |
| COMP-81 | Redis 7 | CAP-27 | Caching Layer | DOMAIN-10 | Platform Infrastructure and Data | DIRECT_EVIDENCE | package.json: ioredis; redis.config.ts |
| COMP-82 | S3 / MinIO Object Storage [*] | CAP-28 | Object Storage | DOMAIN-10 | Platform Infrastructure and Data | INFERRED | Architecture HTML section s1 layer 5 only |
| COMP-83 | MQTT Broker (EMQX) | CAP-05 | MQTT Telemetry Transport | DOMAIN-02 | Telemetry Transport and Messaging | DIRECT_EVIDENCE | sensor_collector.py lines 42–44; hasi_bridge.py lines 40–43 |
| COMP-84 | Apache Kafka [*] | CAP-06 | Stream Processing Infrastructure | DOMAIN-02 | Telemetry Transport and Messaging | INFERRED | Architecture HTML section s1 layer 3 only |
| COMP-85 | Apache Flink [*] | CAP-06 | Stream Processing Infrastructure | DOMAIN-02 | Telemetry Transport and Messaging | INFERRED | Architecture HTML section s1 layer 3 only |
| COMP-86 | Monitoring Stack | CAP-39 | Platform Observability | DOMAIN-16 | Operational Engineering | DIRECT_EVIDENCE | monitoring/grafana/; monitoring/prometheus/prometheus.yml |
| COMP-87 | Load Tests | CAP-40 | Delivery and Quality Infrastructure | DOMAIN-16 | Operational Engineering | DIRECT_EVIDENCE | load-tests/api-load.js; ws-load.js; run.sh |
| COMP-88 | CI/CD Workflows | CAP-40 | Delivery and Quality Infrastructure | DOMAIN-16 | Operational Engineering | DERIVED | analysis/02_top_level_component_inventory.md |
| COMP-89 | Docker Compose Orchestration | CAP-40 | Delivery and Quality Infrastructure | DOMAIN-16 | Operational Engineering | DERIVED | analysis/02_top_level_component_inventory.md |

---

## Evidence Distribution Summary

| Evidence Basis | Count | % |
|---|---|---|
| DIRECT_EVIDENCE | 75 | 84.3% |
| DERIVED | 8 | 9.0% |
| INFERRED (WEAKLY GROUNDED) | 6 | 6.7% |
| **TOTAL** | **89** | **100%** |

[*] = WEAKLY GROUNDED — architecture HTML only, no source confirmation

---

## Navigation

- [← Explorer Map](../00_Map/Program_Intelligence_Explorer.md)
- [Full semantic_traceability_map.md](../../../../41.1/semantic_traceability_map.md)
- [PIE Index](../../pie_index.md)
