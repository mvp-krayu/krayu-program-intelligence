# Semantic Domain Model — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.1-OUTPUT-01
**contract:** PIOS-41.1-RUN01-CONTRACT-v1
**mode:** SEMANTIC-CONSOLIDATION-STRICT
**run_reference:** run_03_blueedge_derivation_validation
**generated_from:** component_model.md, relationship_map.md, execution_paths.md, intent_inference_map.md, program_execution_graph.md
**date:** 2026-03-20

---

## Domain Construction Rules Applied

- Minimum 2 components per domain (single-component domains explicitly justified)
- No domain overlap without cross-domain annotation
- Domain names derived from evidence in component_model.md and intent_inference_map.md
- Domain types: FUNCTIONAL | OPERATIONAL | INFRASTRUCTURE | INTEGRATION | CROSS-CUTTING
- WEAKLY GROUNDED classification applied where components carry WEAKLY_GROUNDED or INFERRED status in structural_traceability_map.md

---

## DOMAIN-01 — Edge Data Acquisition

| Field | Value |
|---|---|
| domain_id | DOMAIN-01 |
| domain_name | Edge Data Acquisition |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
The physical and software layer that collects sensor data and network security intelligence at the vehicle edge. Evidenced by: sensor_collector.py reading CAN FD / J1939 / Modbus / GPIO / I2C / BLE sensors and pushing batched telemetry to the cloud (EVID-SC); hasi_bridge.py polling the HASI SQLite database and forwarding network threat data (EVID-HB); the SVG 2.0 hardware platform hosting both agents (EVID-ARCH section s2); and the SVG Main Telemetry Firmware providing GPS data to sensor_collector.py via shared memory (EVID-SC lines 271–278). The HASI v1.0.0 system performs local network traffic capture and analysis, feeding hasi_bridge.py. Configuration assets govern device identity, broker endpoints, sensor thresholds, and calibration. The operational intent (IIM-02) confirms this layer is designed for high-volume, low-latency, resilient data collection with MQTT primary delivery and REST fallback.

**component_anchors:**
- SVG 2.0 Smart Vehicle Gateway (COMP-72)
- sensor_collector.py (COMP-73)
- hasi_bridge.py (COMP-74)
- HASI v1.0.0 (COMP-75)
- SVG Main Telemetry Firmware (COMP-76)
- SVG OTA Agent (COMP-77) [WEAKLY GROUNDED — architecture HTML only, no source file confirmed]
- SVG Agent Configuration (COMP-78)

**relationship_anchors:**
- R-001: sensor_collector.py EMITS MQTT Broker EMQX
- R-002: sensor_collector.py CALLS SensorsModule (REST fallback)
- R-003: sensor_collector.py CONSUMES SVG Main Telemetry Firmware (GPS shared memory)
- R-005: HASI v1.0.0 PERSISTS_TO HASI SQLite DB
- R-006: hasi_bridge.py CONSUMES HASI v1.0.0
- R-007: hasi_bridge.py EMITS MQTT Broker EMQX
- R-008: hasi_bridge.py CALLS HasiModule (REST fallback)
- R-039: OtaModule CALLS SVG OTA Agent

**execution_path_anchors:**
- EP-01 (Sensor Telemetry Ingest Path — steps 1–4)
- EP-02 (HASI Network Security Intelligence Path — steps 1–4)
- EP-07 (OTA Firmware Update Deployment — step 6)

---

## DOMAIN-02 — Telemetry Transport and Messaging

| Field | Value |
|---|---|
| domain_id | DOMAIN-02 |
| domain_name | Telemetry Transport and Messaging |
| domain_type | INFRASTRUCTURE |
| grounding_status | WEAKLY GROUNDED |

**description:**
The messaging infrastructure layer responsible for transporting telemetry and security event data from the edge to cloud-side processing modules. Anchored by the MQTT Broker (EMQX), which is confirmed by direct source code references in both sensor_collector.py and hasi_bridge.py (mqtt.blueedge.network:8883 with mTLS QoS 1). Apache Kafka and Apache Flink are declared in architecture HTML (EVID-ARCH section s1 layer 3) as a 15-broker / 500-partition stream processing backbone, but are not corroborated by extracted source package.json or configuration files read within the evidence boundary. Accordingly, those two components carry WEAKLY_GROUNDED status. The domain as a whole is marked WEAKLY GROUNDED due to partial evidence for Kafka and Flink.

**grounding_justification:**
MQTT Broker (COMP-83) is fully grounded. Apache Kafka (COMP-84) and Apache Flink (COMP-85) are architecture-declared only (EVID-ARCH section s1 layer 3); no package.json dependency or configuration file read confirms them. Domain is WEAKLY GROUNDED because two of three components rely solely on the architecture HTML.

**component_anchors:**
- MQTT Broker (EMQX) (COMP-83)
- Apache Kafka (COMP-84) [WEAKLY GROUNDED]
- Apache Flink (COMP-85) [WEAKLY GROUNDED]

**relationship_anchors:**
- R-001: sensor_collector.py EMITS MQTT Broker EMQX
- R-004: MQTT Broker BROADCASTS_TO SensorsModule
- R-007: hasi_bridge.py EMITS MQTT Broker EMQX
- R-009: MQTT Broker BROADCASTS_TO HasiModule

**execution_path_anchors:**
- EP-01 (step 4 — MQTT transport of sensor readings)
- EP-02 (step 4 — MQTT transport of HASI data)

---

## DOMAIN-03 — Fleet Core Operations

| Field | Value |
|---|---|
| domain_id | DOMAIN-03 |
| domain_name | Fleet Core Operations |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
The foundational operational data management layer for fleet asset and activity lifecycle. Evidenced by app.module.ts session comment "Core domains (7 modules, 66 endpoints)" (EVID-APPMOD lines 156–163) grouping VehiclesModule, DriversModule, FleetsModule, TripsModule, AlertsModule, MaintenanceModule, and FuelModule as the minimum viable platform. Intent inference IIM-03b confirms these 7 modules constitute the foundational layer upon which all other domain modules depend. The UsersModule is included here as the user account management layer directly supporting auth and fleet operations. OperationsModule and DevicesModule are included as operational control and device management components confirmed in the same session grouping.

**component_anchors:**
- VehiclesModule (COMP-03)
- DriversModule (COMP-04)
- FleetsModule (COMP-05)
- TripsModule (COMP-06)
- AlertsModule (COMP-07)
- MaintenanceModule (COMP-08)
- FuelModule (COMP-09)
- OperationsModule (COMP-13)
- DevicesModule (COMP-14)
- NotificationsModule (COMP-15)
- UsersModule (COMP-22)

**relationship_anchors:**
- R-010: VehiclesModule AUTHENTICATES_VIA AuthModule
- R-011: DriversModule AUTHENTICATES_VIA AuthModule
- R-012: FleetsModule AUTHENTICATES_VIA AuthModule
- R-013: All 63 backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15
- R-020: AlertsModule EMITS FleetEventsModule
- R-023: FleetEventsModule CALLS NotificationsModule

**execution_path_anchors:**
- EP-04 (Fleet Data REST Request-Response — domain module as target)
- EP-05 (Domain Event Fan-Out — AlertsModule as emitter)
- EP-06 (Predictive Maintenance AI — MaintenanceModule as work order recipient)
- EP-08 (Multi-Tenant Onboarding — UsersModule and NotificationsModule participation)

---

## DOMAIN-04 — Fleet Vertical Extensions

| Field | Value |
|---|---|
| domain_id | DOMAIN-04 |
| domain_name | Fleet Vertical Extensions |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
Industry-specific capability extensions that differentiate the platform for each fleet type. Evidenced by app.module.ts session comment "Fleet-type specific (3 modules, 32 endpoints)" (EVID-APPMOD lines 165–166) and EVID-ARCH section s5 "Verticals" (IIM-03c). TankerModule provides HAZMAT safety compliance for hazardous materials transport. BusModule supports public transit passenger information systems. TaxiModule adds dispatch and metering for rideshare operations. ColdchainModule and DriverSessionsModule extend these verticals into temperature monitoring and session block management respectively. VehicleLifecycleModule provides end-to-end asset management applicable across all verticals.

**component_anchors:**
- TankerModule (COMP-10)
- BusModule (COMP-11)
- TaxiModule (COMP-12)
- ColdchainModule (COMP-23)
- DriverSessionsModule (COMP-60)
- VehicleLifecycleModule (COMP-61)

**relationship_anchors:**
- R-013: All backend modules AUTHENTICATES_VIA AuthModule (covers all vertical modules)
- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15

**execution_path_anchors:**
- EP-04 (Fleet Data REST Request-Response — vertical modules as domain module targets)

---

## DOMAIN-05 — Analytics and Intelligence

| Field | Value |
|---|---|
| domain_id | DOMAIN-05 |
| domain_name | Analytics and Intelligence |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
Fleet and operational analytics aggregation, diagnostics, reporting, and compliance intelligence. Evidenced by app.module.ts session grouping AnalyticsModule, ReportsModule, and DiagnosticsModule as an analytics cluster (EVID-APPMOD lines 42–44) and ComplianceModule, SafetyModule, FinanceModule as domain-specific intelligence modules (EVID-APPMOD lines 47–49). ExecutiveModule (COMP-32) provides C-suite KPI aggregation (EVID-APPMOD line 68). BlockchainModule provides data provenance and audit trail capability (IIM-10). DataMonetizationModule provides anonymised fleet data product management. This domain represents the structured data consumption and reporting surface of the platform.

**component_anchors:**
- AnalyticsModule (COMP-16)
- ReportsModule (COMP-17)
- DiagnosticsModule (COMP-18)
- ComplianceModule (COMP-19)
- SafetyModule (COMP-20)
- FinanceModule (COMP-21)
- ExecutiveModule (COMP-32)
- BlockchainModule (COMP-41)
- DataMonetizationModule (COMP-59)

**relationship_anchors:**
- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15
- R-024: FleetEventsModule CALLS ComplianceModule (audit log handler)
- R-013: All backend modules AUTHENTICATES_VIA AuthModule

**execution_path_anchors:**
- EP-04 (Fleet Data REST Request-Response — analytics modules as domain module targets)
- EP-05 (Domain Event Fan-Out — Branch C: audit-log.handler → ComplianceModule)

---

## DOMAIN-06 — AI/ML Intelligence Layer

| Field | Value |
|---|---|
| domain_id | DOMAIN-06 |
| domain_name | AI/ML Intelligence Layer |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
The embedded intelligence layer that converts raw telemetry and operational data into actionable recommendations. Evidenced by app.module.ts session comment "Advanced Features" (EVID-APPMOD lines 81–86) grouping PredictiveMaintenanceModule, DigitalTwinModule, DriverScoringModule alongside AnomalyDetectionModule and FatigueRiskModule. AgenticAIModule (line 98) provides autonomous task execution. Intent inference IIM-04 confirms these 6 modules are a core commercial differentiator. RoadIntelligenceModule provides road condition data services supporting AI-driven routing. The SensorsModule cloud-side ingestion is the telemetry source feeding this layer via EP-01 and EP-06.

**component_anchors:**
- AnomalyDetectionModule (COMP-33)
- FatigueRiskModule (COMP-39)
- PredictiveMaintenanceModule (COMP-44)
- DigitalTwinModule (COMP-45)
- DriverScoringModule (COMP-46)
- AgenticAIModule (COMP-56)
- RoadIntelligenceModule (COMP-58)

**relationship_anchors:**
- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15
- R-015: SensorsModule PERSISTS_TO TimescaleDB (telemetry source for AI)

**execution_path_anchors:**
- EP-06 (Predictive Maintenance AI Analysis — PredictiveMaintenanceModule, AnomalyDetectionModule, DigitalTwinModule)

---

## DOMAIN-07 — Sensor and Security Ingestion (Cloud-Side)

| Field | Value |
|---|---|
| domain_id | DOMAIN-07 |
| domain_name | Sensor and Security Ingestion |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
Cloud-side reception, processing, and storage of sensor telemetry and network security intelligence from SVG 2.0 edge devices. Evidenced by: SensorsModule (COMP-62) — app.module.ts line 106, migration SensorsAndHasiIntegration.ts; HasiModule (COMP-63) — app.module.ts line 107, EVID-ARCH section s7. SensorsModule performs threshold evaluation, HAZMAT alert generation, and persists to TimescaleDB (R-015). HasiModule performs GeoIP + ASN enrichment, MITRE ATT&CK mapping, and persists to PostgreSQL 15 (R-016). Both modules emit events to FleetEventsModule (R-018, R-019). This domain is the cloud-side terminus of EP-01 and EP-02.

**component_anchors:**
- SensorsModule (COMP-62)
- HasiModule (COMP-63)

**relationship_anchors:**
- R-004: MQTT Broker BROADCASTS_TO SensorsModule
- R-009: MQTT Broker BROADCASTS_TO HasiModule
- R-015: SensorsModule PERSISTS_TO TimescaleDB
- R-016: HasiModule PERSISTS_TO PostgreSQL 15
- R-018: SensorsModule EMITS FleetEventsModule
- R-019: HasiModule EMITS FleetEventsModule
- R-002: sensor_collector.py CALLS SensorsModule (REST fallback)
- R-008: hasi_bridge.py CALLS HasiModule (REST fallback)

**execution_path_anchors:**
- EP-01 (Sensor Telemetry Ingest Path — step 5)
- EP-02 (HASI Network Security Intelligence Path — step 5)
- EP-05 (Domain Event Fan-Out — SensorsModule and HasiModule as emitters)

---

## DOMAIN-08 — Real-Time Streaming and Gateway

| Field | Value |
|---|---|
| domain_id | DOMAIN-08 |
| domain_name | Real-Time Streaming and Gateway |
| domain_type | OPERATIONAL |
| grounding_status | GROUNDED |

**description:**
The real-time bidirectional communication layer between backend event processing and connected frontend clients. Evidenced by GatewaysModule (COMP-27) — a NestJS WebSocket gateway using Socket.IO (EVID-APPMOD line 61, fleet.gateway.ts source confirmed) — and FleetSocket Client (COMP-69) — the Socket.IO client in the frontend (EVID-FLTSOCK source confirmed). The FleetEventsModule routes domain events to GatewaysModule via websocket-broadcast.handler.ts (R-021). GatewaysModule broadcasts to FleetSocket Client (R-025). This two-component domain is justified by the evidenced-direct connection forming a discrete streaming subsystem anchored in both source files.

**component_anchors:**
- GatewaysModule (COMP-27)
- FleetSocket Client (COMP-69)

**relationship_anchors:**
- R-021: FleetEventsModule BROADCASTS_TO GatewaysModule
- R-025: GatewaysModule BROADCASTS_TO FleetSocket Client
- R-026: FleetSocket Client DEPENDS_ON Frontend Application

**execution_path_anchors:**
- EP-01 (Sensor Telemetry Ingest — steps 8–9)
- EP-02 (HASI Security Pipeline — steps 8–9)
- EP-05 (Domain Event Fan-Out — Branch A)
- EP-06 (Predictive Maintenance AI — step 9)

---

## DOMAIN-09 — Access Control and Identity

| Field | Value |
|---|---|
| domain_id | DOMAIN-09 |
| domain_name | Access Control and Identity |
| domain_type | CROSS-CUTTING |
| grounding_status | GROUNDED |

**description:**
Platform-wide authentication, authorisation, and API access management. Evidenced by AuthModule (COMP-02) — app.module.ts line 20 with JWT-based Passport strategy (EVID-APPMOD, EVID-BPKG: passport-jwt, bcryptjs, @nestjs/jwt); V2Module (COMP-67) — app.module.ts line 110 providing API v2 controllers with enhanced responses, cursor-based pagination, and ApiVersionMiddleware (EVID-APPMOD); AuthContext/AuthProvider (COMP-70) — frontend JWT token handling (EVID-FPKG). Intent inference IIM-03a confirms JWT-based stateless auth with RBAC and multi-tier rate limiting as a non-optional, platform-wide enforcement layer. R-013 confirms all 63 backend modules authenticate via AuthModule.

**component_anchors:**
- AuthModule (COMP-02)
- V2Module (COMP-67)
- AuthContext / AuthProvider (COMP-70)

**relationship_anchors:**
- R-010: VehiclesModule AUTHENTICATES_VIA AuthModule
- R-011: DriversModule AUTHENTICATES_VIA AuthModule
- R-012: FleetsModule AUTHENTICATES_VIA AuthModule
- R-013: All 63 backend modules AUTHENTICATES_VIA AuthModule
- R-027: Frontend Application CALLS AuthModule
- R-029: Frontend Application AUTHENTICATES_VIA AuthModule

**execution_path_anchors:**
- EP-03 (User Authentication and Session Establishment — full path)
- EP-04 (Fleet Data REST Request-Response — step 3 JWT validation)
- EP-08 (Multi-Tenant Onboarding — step 6 JWT provisioning)

---

## DOMAIN-10 — Platform Infrastructure and Data

| Field | Value |
|---|---|
| domain_id | DOMAIN-10 |
| domain_name | Platform Infrastructure and Data |
| domain_type | INFRASTRUCTURE |
| grounding_status | WEAKLY GROUNDED |

**description:**
The persistence, caching, and platform data layer underpinning all backend modules. PostgreSQL 15 (COMP-79) is the primary operational database — confirmed by TypeORM configuration in app.module.ts (EVID-APPMOD lines 136–151). TimescaleDB (COMP-80) is the sensor_readings hypertable — confirmed via migration filename and architecture HTML. Redis 7 (COMP-81) is the session and API cache — confirmed via package.json (ioredis dependency) and redis.config.ts. RedisCacheModule (COMP-64) — confirmed in app.module.ts line 9 — provides the HttpCacheInterceptor globally. S3/MinIO (COMP-82) is architecture-declared only (EVID-ARCH section s1 layer 5), making this domain WEAKLY GROUNDED overall. The monorepo container component (COMP-01) is included as the platform structural anchor.

**grounding_justification:**
S3/MinIO (COMP-82) is an INFERRED/WEAKLY_GROUNDED component with architecture HTML as its sole evidence source. The remaining 5 components in this domain are fully grounded. Domain is marked WEAKLY GROUNDED due to COMP-82 inclusion. If COMP-82 were excluded, the domain would be GROUNDED.

**component_anchors:**
- blueedge-platform (Monorepo) (COMP-01)
- RedisCacheModule (COMP-64)
- PostgreSQL 15 (COMP-79)
- TimescaleDB (COMP-80)
- Redis 7 (COMP-81)
- S3 / MinIO Object Storage (COMP-82) [WEAKLY GROUNDED]

**relationship_anchors:**
- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15
- R-015: SensorsModule PERSISTS_TO TimescaleDB
- R-016: HasiModule PERSISTS_TO PostgreSQL 15
- R-017: All modules using cache DEPENDS_ON Redis 7
- R-022: FleetEventsModule CALLS RedisCacheModule
- R-031: MultiTenantModule DEPENDS_ON PostgreSQL 15
- R-040: OtaModule PERSISTS_TO S3/MinIO

**execution_path_anchors:**
- EP-03 (User Authentication — step 3 PostgreSQL user lookup)
- EP-04 (Fleet Data REST — steps 4, 6, 7 Redis cache and PostgreSQL)
- EP-06 (Predictive Maintenance AI — steps 2, 8 TimescaleDB and PostgreSQL)
- EP-07 (OTA Firmware Update — step 3 S3/MinIO)

---

## DOMAIN-11 — Event-Driven Architecture

| Field | Value |
|---|---|
| domain_id | DOMAIN-11 |
| domain_name | Event-Driven Architecture |
| domain_type | CROSS-CUTTING |
| grounding_status | GROUNDED |

**description:**
The internal event routing and fan-out infrastructure that decouples event producers from consumers. Evidenced by FleetEventsModule (COMP-65) — app.module.ts line 14 with comment "Event-Driven Architecture (domain events → WebSocket, cache, audit, notifications)" (EVID-APPMOD), with 4 confirmed handler files in events/handlers/ (websocket-broadcast.handler.ts, cache-invalidation.handler.ts, audit-log.handler.ts, notification.handler.ts). Intent inference IIM-05 confirms the deliberate decoupling design. R-038 confirms FleetEventsModule is imported globally across all backend modules. As a single-component domain, this is justified by FleetEventsModule's unique cross-cutting role as the central event bus — it is not a domain module but the architectural backbone connecting all emitting modules to all consuming handlers.

**component_anchors:**
- FleetEventsModule (COMP-65)

**relationship_anchors:**
- R-018: SensorsModule EMITS FleetEventsModule
- R-019: HasiModule EMITS FleetEventsModule
- R-020: AlertsModule EMITS FleetEventsModule
- R-021: FleetEventsModule BROADCASTS_TO GatewaysModule
- R-022: FleetEventsModule CALLS RedisCacheModule
- R-023: FleetEventsModule CALLS NotificationsModule
- R-024: FleetEventsModule CALLS ComplianceModule
- R-038: All backend modules DEPENDS_ON FleetEventsModule

**execution_path_anchors:**
- EP-05 (Domain Event Fan-Out — full path, all branches)
- EP-01 (step 7 — sensor.alert event emission)
- EP-02 (step 7 — hasi.threat.detected event emission)
- EP-06 (step 6 — maintenance event emission)

**single_component_justification:**
FleetEventsModule is the sole component of this domain. Justification: it is the global event bus serving as the cross-cutting backbone for all event-driven interactions across the platform. It has 8 direct relationship anchors in the relationship_map and participates in 4 of 8 execution paths. Merging it into another domain would obscure its architectural role as the central decoupling mechanism. This is consistent with its CROSS-CUTTING tier classification in component_model.md.

---

## DOMAIN-12 — SaaS Platform Layer

| Field | Value |
|---|---|
| domain_id | DOMAIN-12 |
| domain_name | SaaS Platform Layer |
| domain_type | OPERATIONAL |
| grounding_status | GROUNDED |

**description:**
The commercial SaaS packaging layer enabling multi-tenant fleet management service delivery. Evidenced by app.module.ts session comment "Session 23: Multi-Tenant SaaS" (EVID-APPMOD lines 88–91) grouping MultiTenantModule, BillingModule, and OnboardingModule. Intent inference IIM-06 confirms these three modules transform the fleet management technology into a commercially operable SaaS product: MultiTenantModule enforces data isolation, BillingModule enables subscription revenue, and OnboardingModule reduces new tenant activation friction. WhiteLabelModule (COMP-42) is included as the multi-brand reseller configuration layer that is functionally coupled to the multi-tenant SaaS packaging.

**component_anchors:**
- MultiTenantModule (COMP-49)
- BillingModule (COMP-50)
- OnboardingModule (COMP-51)
- WhiteLabelModule (COMP-42)

**relationship_anchors:**
- R-031: MultiTenantModule DEPENDS_ON PostgreSQL 15
- R-032: BillingModule DEPENDS_ON MultiTenantModule

**execution_path_anchors:**
- EP-08 (Multi-Tenant SaaS Onboarding — full path)

---

## DOMAIN-13 — External Integration

| Field | Value |
|---|---|
| domain_id | DOMAIN-13 |
| domain_name | External Integration |
| domain_type | INTEGRATION |
| grounding_status | GROUNDED |

**description:**
The enterprise integration and developer platform expansion layer. Evidenced by app.module.ts session comment "Session 24: Integration Layer (4 modules, ~70 endpoints)" (EVID-APPMOD lines 93–97) explicitly grouping NotificationProvidersModule, ErpConnectorsModule, ApiMarketplaceModule, and IntegrationHubModule. Intent inference IIM-07 confirms this layer enables participation in existing enterprise ecosystems (ERP connectors) and exposes BlueEdge capabilities as a developer API marketplace. R-033 confirms NotificationProvidersModule serves NotificationsModule. R-034 and R-035 confirm ErpConnectors and ApiMarketplace route through IntegrationHubModule.

**component_anchors:**
- NotificationProvidersModule (COMP-52)
- ErpConnectorsModule (COMP-53)
- ApiMarketplaceModule (COMP-54)
- IntegrationHubModule (COMP-55)

**relationship_anchors:**
- R-033: NotificationProvidersModule SERVES NotificationsModule
- R-034: ErpConnectorsModule DEPENDS_ON IntegrationHubModule
- R-035: ApiMarketplaceModule SERVED_BY IntegrationHubModule

**execution_path_anchors:**
- EP-05 (Domain Event Fan-Out — Branch D: NotificationProvidersModule as delivery channel)

---

## DOMAIN-14 — Frontend Application

| Field | Value |
|---|---|
| domain_id | DOMAIN-14 |
| domain_name | Frontend Application |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
The operator-facing React SPA delivering fleet situational awareness, configuration, and management through 61 pages. Evidenced by frontend/package.json (EVID-FPKG: blueedge-fleet-frontend v3.15.0, React 18, Vite, Tailwind), confirmed directory structure with 7 domain page folders (fleet, assets, energy, intelligence, people, platform, safety) plus v3.23 additions (NetworkSecurityPage.tsx, SensorsPage.tsx). Intent inference IIM-08 confirms PWA + offline capability, RTL Arabic support, and real-time WebSocket integration as explicit design goals targeting the MENA market. Frontend Application (COMP-68) consumes all backend REST APIs (R-028) and receives real-time events via FleetSocket Client (COMP-69).

**component_anchors:**
- Frontend Application (COMP-68)
- Frontend Page Modules (61 pages) (COMP-71)

**relationship_anchors:**
- R-026: FleetSocket Client DEPENDS_ON Frontend Application
- R-027: Frontend Application CALLS AuthModule
- R-028: Frontend Application CALLS domain modules (REST)
- R-029: Frontend Application AUTHENTICATES_VIA AuthModule
- R-030: Frontend Application SERVED_BY nginx

**execution_path_anchors:**
- EP-01 (Sensor Telemetry Ingest — steps 9–10 SensorsPage display)
- EP-02 (HASI Security Pipeline — step 9 NetworkSecurityPage display)
- EP-03 (User Authentication — steps 1, 5, 6 login form and redirect)
- EP-04 (Fleet Data REST — steps 1, 8 API call and render)
- EP-07 (OTA Firmware Update — step 1 OtaPage)
- EP-08 (Multi-Tenant Onboarding — step 1 OnboardingWizardPage)

---

## DOMAIN-15 — EV and Electrification

| Field | Value |
|---|---|
| domain_id | DOMAIN-15 |
| domain_name | EV and Electrification |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
Electric vehicle telemetry, battery management, charging infrastructure, fleet electrification planning, and vehicle-to-grid energy management. Evidenced by app.module.ts lines 55–58 grouping ColdchainModule alongside EvModule, OtaModule, V2gModule as "vertical extension" modules (note: ColdchainModule is classified under DOMAIN-04 due to its cold-chain vertical nature; EvModule, V2gModule, ElectrificationModule, DepotChargingModule, and ChargingStationsModule are grouped here as the EV ecosystem cluster). EvModule (COMP-24) — battery state and range management. V2gModule (COMP-26) — bidirectional charging. ElectrificationModule (COMP-30) — fleet transition planning. DepotChargingModule (COMP-31) — depot charging capacity. ChargingStationsModule (COMP-43) — charging network management. OtaModule (COMP-25) is included here as its primary operational target is SVG device firmware updates, but it has a cross-domain annotation to DOMAIN-01 (Edge Data Acquisition).

**cross_domain_annotation:**
OtaModule (COMP-25) participates in both DOMAIN-15 (EV/electrification context) and DOMAIN-01 (SVG OTA Agent target). Its primary parent domain is DOMAIN-15 based on grouping in app.module.ts vertical extensions. Its edge-side target (SVG OTA Agent, COMP-77) anchors it to DOMAIN-01 execution.

**component_anchors:**
- EvModule (COMP-24)
- OtaModule (COMP-25) [cross-domain: also anchors DOMAIN-01]
- V2gModule (COMP-26)
- ElectrificationModule (COMP-30)
- DepotChargingModule (COMP-31)
- ChargingStationsModule (COMP-43)

**relationship_anchors:**
- R-039: OtaModule CALLS SVG OTA Agent
- R-040: OtaModule PERSISTS_TO S3/MinIO
- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15

**execution_path_anchors:**
- EP-07 (OTA Firmware Update Deployment — steps 2–5)

---

## DOMAIN-16 — Operational Engineering

| Field | Value |
|---|---|
| domain_id | DOMAIN-16 |
| domain_name | Operational Engineering |
| domain_type | INFRASTRUCTURE |
| grounding_status | GROUNDED |

**description:**
Platform delivery, observability, and engineering quality assurance infrastructure. Evidenced by: Monitoring Stack (COMP-86) — confirmed monitoring/grafana/ and monitoring/prometheus/prometheus.yml files; HealthModule (COMP-66) — health check and Prometheus metrics endpoint confirmed in app.module.ts line 11 and health/prometheus.service.ts; Load Tests (COMP-87) — api-load.js and ws-load.js confirmed in file listing; CI/CD Workflows (COMP-88) — .github folder confirmed in analysis documents; Docker Compose Orchestration (COMP-89) — docker-compose.yml and docker-compose.monitoring.yml confirmed. Intent inference IIM-09 confirms engineering maturity: the co-presence of production observability and load testing scripts signals operational reliability engineering posture. R-036 and R-037 confirm HealthModule↔Monitoring Stack bidirectional relationship.

**component_anchors:**
- HealthModule (COMP-66)
- Monitoring Stack (COMP-86)
- Load Tests (COMP-87)
- CI/CD Workflows (COMP-88)
- Docker Compose Orchestration (COMP-89)

**relationship_anchors:**
- R-036: HealthModule EMITS Monitoring Stack
- R-037: Monitoring Stack CONSUMES HealthModule

**execution_path_anchors:**
None — this domain does not participate in any of the 8 modelled execution paths (EP-01 through EP-08). It operates as a supporting infrastructure layer orthogonal to functional execution paths.

---

## DOMAIN-17 — Extended Operations and Driver Services

| Field | Value |
|---|---|
| domain_id | DOMAIN-17 |
| domain_name | Extended Operations and Driver Services |
| domain_type | FUNCTIONAL |
| grounding_status | GROUNDED |

**description:**
Extended operational capabilities covering driver engagement, incentives, mobile services, geofencing automation, messaging, customer portal access, cross-border logistics, permits, parts procurement, after-sales, and surge pricing. These modules are confirmed in app.module.ts (EVID-APPMOD lines 64–79, 95–101) as distinct backend modules with no single session comment clustering them beyond their individual declarations. They are grouped here as functionally adjacent modules serving operational execution and customer engagement. SurgePricingModule and DriverIncentivesModule are Taxi vertical extensions. GeofenceAutomationModule, MessagingModule, and DriverMobileModule support real-time fleet operations. CustomerPortalModule, AftersalesModule, CrossBorderModule, PermitsModule, and PartsMarketplaceModule serve fleet operator and service ecosystem needs.

**component_anchors:**
- SurgePricingModule (COMP-28)
- DriverIncentivesModule (COMP-29)
- GeofenceAutomationModule (COMP-47)
- MessagingModule (COMP-48)
- DriverMobileModule (COMP-38)
- CustomerPortalModule (COMP-40)
- AftersalesModule (COMP-57)
- CrossBorderModule (COMP-34)
- PermitsModule (COMP-35)
- PartsMarketplaceModule (COMP-36)
- FleetLifecycleModule (COMP-37)

**relationship_anchors:**
- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15

**execution_path_anchors:**
- EP-04 (Fleet Data REST Request-Response — these modules eligible as domain module targets)

---

## Domain Summary Table

| domain_id | domain_name | domain_type | component_count | grounding_status |
|---|---|---|---|---|
| DOMAIN-01 | Edge Data Acquisition | FUNCTIONAL | 7 | GROUNDED (1 component WEAKLY GROUNDED) |
| DOMAIN-02 | Telemetry Transport and Messaging | INFRASTRUCTURE | 3 | WEAKLY GROUNDED |
| DOMAIN-03 | Fleet Core Operations | FUNCTIONAL | 11 | GROUNDED |
| DOMAIN-04 | Fleet Vertical Extensions | FUNCTIONAL | 6 | GROUNDED |
| DOMAIN-05 | Analytics and Intelligence | FUNCTIONAL | 9 | GROUNDED |
| DOMAIN-06 | AI/ML Intelligence Layer | FUNCTIONAL | 7 | GROUNDED |
| DOMAIN-07 | Sensor and Security Ingestion | FUNCTIONAL | 2 | GROUNDED |
| DOMAIN-08 | Real-Time Streaming and Gateway | OPERATIONAL | 2 | GROUNDED |
| DOMAIN-09 | Access Control and Identity | CROSS-CUTTING | 3 | GROUNDED |
| DOMAIN-10 | Platform Infrastructure and Data | INFRASTRUCTURE | 6 | WEAKLY GROUNDED |
| DOMAIN-11 | Event-Driven Architecture | CROSS-CUTTING | 1 | GROUNDED |
| DOMAIN-12 | SaaS Platform Layer | OPERATIONAL | 4 | GROUNDED |
| DOMAIN-13 | External Integration | INTEGRATION | 4 | GROUNDED |
| DOMAIN-14 | Frontend Application | FUNCTIONAL | 2 | GROUNDED |
| DOMAIN-15 | EV and Electrification | FUNCTIONAL | 6 | GROUNDED |
| DOMAIN-16 | Operational Engineering | INFRASTRUCTURE | 5 | GROUNDED |
| DOMAIN-17 | Extended Operations and Driver Services | FUNCTIONAL | 11 | GROUNDED |
| **TOTAL** | | | **89** | |

**Note on component count:** OtaModule (COMP-25) is counted once under DOMAIN-15 with cross-domain annotation to DOMAIN-01. Total across all domains = 89 (matching component_model.md total). No component is unassigned.
