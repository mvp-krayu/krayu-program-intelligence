# Capability Map — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.1-OUTPUT-02
**contract:** PIOS-41.1-RUN01-CONTRACT-v1
**mode:** SEMANTIC-CONSOLIDATION-STRICT
**run_reference:** run_03_blueedge_derivation_validation
**generated_from:** semantic_domain_model.md, component_model.md, relationship_map.md, execution_paths.md
**date:** 2026-03-20

---

## Capability Construction Rules Applied

- Minimum 1 component per capability (single-component capabilities justified)
- Each capability belongs to exactly one domain (or annotated cross-domain)
- Capability names derived strictly from evidence — no invented operational meaning
- Capability types: CORE | SUPPORTING | ENABLING | INFRASTRUCTURE

---

## CAP-01 — Vehicle Sensor Collection

| Field | Value |
|---|---|
| capability_id | CAP-01 |
| capability_name | Vehicle Sensor Collection |
| parent_domain | DOMAIN-01 (Edge Data Acquisition) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Multi-protocol physical sensor reading, calibration, buffering, and batched cloud delivery from the SVG 2.0 hardware. Evidenced by sensor_collector.py (479 LOC, reads CAN FD / J1939 / Modbus RTU / GPIO / I2C / BLE, 100ms polling, 50-reading batches every 5s, 10K local buffer), GPS enrichment from SVG Main Telemetry Firmware via /dev/shm/blueedge_gps, and configuration via sensors.yaml (per-sensor protocol, thresholds, calibration).

**component_members:**
- sensor_collector.py (COMP-73)
- SVG Main Telemetry Firmware (COMP-76)
- SVG Agent Configuration (COMP-78)

**primary_relationships:**
- R-001: sensor_collector.py EMITS MQTT Broker EMQX
- R-002: sensor_collector.py CALLS SensorsModule (fallback)
- R-003: sensor_collector.py CONSUMES SVG Main Telemetry Firmware

**execution_contribution:**
- EP-01 (Sensor Telemetry Ingest — primary execution steps 1–4)

---

## CAP-02 — Network Security Intelligence Collection

| Field | Value |
|---|---|
| capability_id | CAP-02 |
| capability_name | Network Security Intelligence Collection |
| parent_domain | DOMAIN-01 (Edge Data Acquisition) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Edge-side network traffic capture, protocol classification, threat detection, and cloud forwarding. HASI v1.0.0 (85 files, 8,951 LOC) captures PCAPNG traffic, classifies 60+ protocols, detects 9 threat types, and persists to SQLite. hasi_bridge.py polls every 30 seconds, applies SHA-256 deduplication, and forwards via MQTT mTLS or REST fallback.

**component_members:**
- HASI v1.0.0 (COMP-75)
- hasi_bridge.py (COMP-74)

**primary_relationships:**
- R-005: HASI v1.0.0 PERSISTS_TO SQLite DB
- R-006: hasi_bridge.py CONSUMES HASI v1.0.0
- R-007: hasi_bridge.py EMITS MQTT Broker EMQX
- R-008: hasi_bridge.py CALLS HasiModule (fallback)

**execution_contribution:**
- EP-02 (HASI Network Security Intelligence Path — steps 2–4)

---

## CAP-03 — SVG Device Hardware Platform

| Field | Value |
|---|---|
| capability_id | CAP-03 |
| capability_name | SVG Device Hardware Platform |
| parent_domain | DOMAIN-01 (Edge Data Acquisition) |
| capability_type | INFRASTRUCTURE |
| grounding_status | GROUNDED |

**description:**
The physical SVG 2.0 Smart Vehicle Gateway hardware that hosts all edge agents. NXP i.MX 95, 16GB LPDDR5, 2 TOPS NPU, native 5G, dual 4K cameras, TPM 2.0, Yocto Linux. Confirmed in architecture HTML section s2. Single-component capability justified because the hardware is a discrete physical asset with no peer components at this abstraction level.

**component_members:**
- SVG 2.0 Smart Vehicle Gateway (COMP-72)

**primary_relationships:**
- (hosts sensor_collector.py, hasi_bridge.py, HASI v1.0.0, SVG Main Telemetry Firmware — EVID-ARCH section s2)

**execution_contribution:**
- EP-01 (physical execution host — step 1 context)
- EP-02 (physical execution host — step 1 context)

**single_component_justification:**
The SVG 2.0 hardware is the physical substrate. It has no peer component at the hardware tier. All software agents run on it but are modelled as separate components. A single-component capability is appropriate here.

---

## CAP-04 — SVG Device Firmware Management

| Field | Value |
|---|---|
| capability_id | CAP-04 |
| capability_name | SVG Device Firmware Management |
| parent_domain | DOMAIN-01 (Edge Data Acquisition) |
| capability_type | SUPPORTING |
| grounding_status | WEAKLY GROUNDED |

**description:**
Over-the-air firmware and configuration update delivery and application on SVG 2.0 devices. SVG OTA Agent is architecture-declared (EVID-ARCH section s2) but not confirmed in extracted source files. Marked WEAKLY GROUNDED accordingly.

**component_members:**
- SVG OTA Agent (COMP-77) [WEAKLY GROUNDED]

**primary_relationships:**
- R-039: OtaModule CALLS SVG OTA Agent

**execution_contribution:**
- EP-07 (OTA Firmware Update Deployment — step 6)

**single_component_justification:**
SVG OTA Agent is a discrete firmware update agent on the device. No peer edge-side firmware management component is evidenced.

---

## CAP-05 — MQTT Telemetry Transport

| Field | Value |
|---|---|
| capability_id | CAP-05 |
| capability_name | MQTT Telemetry Transport |
| parent_domain | DOMAIN-02 (Telemetry Transport and Messaging) |
| capability_type | INFRASTRUCTURE |
| grounding_status | GROUNDED |

**description:**
EMQX MQTT broker providing mTLS QoS 1 message delivery from SVG edge agents to cloud modules on port 8883. Directly confirmed by mqtt.blueedge.network:8883 references in both sensor_collector.py and hasi_bridge.py source code.

**component_members:**
- MQTT Broker (EMQX) (COMP-83)

**primary_relationships:**
- R-001: sensor_collector.py EMITS MQTT Broker EMQX
- R-004: MQTT Broker BROADCASTS_TO SensorsModule
- R-007: hasi_bridge.py EMITS MQTT Broker EMQX
- R-009: MQTT Broker BROADCASTS_TO HasiModule

**execution_contribution:**
- EP-01 (Sensor Telemetry Ingest — step 4)
- EP-02 (HASI Security Pipeline — step 4)

**single_component_justification:**
MQTT Broker is the single message transport component for edge-to-cloud delivery. It operates as a discrete infrastructure unit.

---

## CAP-06 — Stream Processing Infrastructure

| Field | Value |
|---|---|
| capability_id | CAP-06 |
| capability_name | Stream Processing Infrastructure |
| parent_domain | DOMAIN-02 (Telemetry Transport and Messaging) |
| capability_type | INFRASTRUCTURE |
| grounding_status | WEAKLY GROUNDED |

**description:**
High-throughput distributed message streaming and real-time complex event processing. Apache Kafka (15-broker, 500-partition, 60M msg/sec) and Apache Flink (CEP with 1-second safety SLA) declared in architecture HTML section s1 layer 3 but not confirmed in extracted source. Both components carry WEAKLY_GROUNDED status.

**component_members:**
- Apache Kafka (COMP-84) [WEAKLY GROUNDED]
- Apache Flink (COMP-85) [WEAKLY GROUNDED]

**primary_relationships:**
- None directly evidenced in relationship_map.md for these components

**execution_contribution:**
- Not traversed in any of the 8 modelled execution paths (evidence insufficient)

---

## CAP-07 — Core Fleet Asset Management

| Field | Value |
|---|---|
| capability_id | CAP-07 |
| capability_name | Core Fleet Asset Management |
| parent_domain | DOMAIN-03 (Fleet Core Operations) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Vehicle CRUD and state tracking, fleet grouping and organisation, and trip lifecycle management. These three modules are the foundational asset data layer of the platform confirmed at app.module.ts lines 23–26.

**component_members:**
- VehiclesModule (COMP-03)
- FleetsModule (COMP-05)
- TripsModule (COMP-06)

**primary_relationships:**
- R-010: VehiclesModule AUTHENTICATES_VIA AuthModule
- R-012: FleetsModule AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15
- R-028: Frontend Application CALLS VehiclesModule

**execution_contribution:**
- EP-04 (Fleet Data REST — VehiclesModule as primary domain module target)

---

## CAP-08 — Driver Management

| Field | Value |
|---|---|
| capability_id | CAP-08 |
| capability_name | Driver Management |
| parent_domain | DOMAIN-03 (Fleet Core Operations) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Driver registry, session management, and user account administration for fleet operators and drivers. Confirmed at app.module.ts lines 24, 52.

**component_members:**
- DriversModule (COMP-04)
- UsersModule (COMP-22)

**primary_relationships:**
- R-011: DriversModule AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-03 (User Authentication — step 3 user record lookup via UsersModule)
- EP-08 (Multi-Tenant Onboarding — step 5 UsersModule admin user creation)

---

## CAP-09 — Alert and Notification Management

| Field | Value |
|---|---|
| capability_id | CAP-09 |
| capability_name | Alert and Notification Management |
| parent_domain | DOMAIN-03 (Fleet Core Operations) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Alert generation, escalation, and in-platform notification delivery. AlertsModule confirmed at app.module.ts line 27 with modules/alerts/ directory. NotificationsModule at line 39. FleetEventsModule routes events to NotificationsModule via notification.handler.ts (R-023).

**component_members:**
- AlertsModule (COMP-07)
- NotificationsModule (COMP-15)

**primary_relationships:**
- R-020: AlertsModule EMITS FleetEventsModule
- R-023: FleetEventsModule CALLS NotificationsModule

**execution_contribution:**
- EP-05 (Domain Event Fan-Out — AlertsModule as emitter; NotificationsModule as Branch D target)
- EP-08 (Multi-Tenant Onboarding — step 7 welcome notification)

---

## CAP-10 — Maintenance and Fuel Operations

| Field | Value |
|---|---|
| capability_id | CAP-10 |
| capability_name | Maintenance and Fuel Operations |
| parent_domain | DOMAIN-03 (Fleet Core Operations) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Scheduled and reactive maintenance work order management and fuel consumption tracking. Confirmed at app.module.ts lines 28–29.

**component_members:**
- MaintenanceModule (COMP-08)
- FuelModule (COMP-09)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-06 (Predictive Maintenance AI — step 7 MaintenanceModule work order creation)

---

## CAP-11 — Operational Control and Device Management

| Field | Value |
|---|---|
| capability_id | CAP-11 |
| capability_name | Operational Control and Device Management |
| parent_domain | DOMAIN-03 (Fleet Core Operations) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
Dispatch coordination, SVG device provisioning and lifecycle management. OperationsModule confirmed at line 37, DevicesModule at line 38 (SVG 2.0 device registration and lifecycle).

**component_members:**
- OperationsModule (COMP-13)
- DevicesModule (COMP-14)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-07 (OTA Firmware Update — step 4 DevicesModule device targeting and status tracking)

---

## CAP-12 — Fleet Type Verticals

| Field | Value |
|---|---|
| capability_id | CAP-12 |
| capability_name | Fleet Type Verticals |
| parent_domain | DOMAIN-04 (Fleet Vertical Extensions) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Industry-specific modules for tanker (HAZMAT safety), bus (PIS integration), and taxi (dispatch and metering) fleet types. Confirmed at app.module.ts lines 32–34 with session comment "Fleet-type specific (3 modules, 32 endpoints)".

**component_members:**
- TankerModule (COMP-10)
- BusModule (COMP-11)
- TaxiModule (COMP-12)

**primary_relationships:**
- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — vertical modules as domain module targets)

---

## CAP-13 — Specialty Transport Extensions

| Field | Value |
|---|---|
| capability_id | CAP-13 |
| capability_name | Specialty Transport Extensions |
| parent_domain | DOMAIN-04 (Fleet Vertical Extensions) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
Cold chain temperature monitoring, driver session block management, and end-to-end vehicle lifecycle management for specialty and full-lifecycle fleet operations. Confirmed at app.module.ts lines 55, 102–103.

**component_members:**
- ColdchainModule (COMP-23)
- DriverSessionsModule (COMP-60)
- VehicleLifecycleModule (COMP-61)

**primary_relationships:**
- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — specialty modules as domain module targets)

---

## CAP-14 — Fleet Analytics and Reporting

| Field | Value |
|---|---|
| capability_id | CAP-14 |
| capability_name | Fleet Analytics and Reporting |
| parent_domain | DOMAIN-05 (Analytics and Intelligence) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Fleet and operational analytics aggregation, scheduled and ad-hoc report generation, and vehicle diagnostic event processing. Confirmed at app.module.ts lines 42–44 with modules/analytics/ directory confirmed.

**component_members:**
- AnalyticsModule (COMP-16)
- ReportsModule (COMP-17)
- DiagnosticsModule (COMP-18)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — analytics modules as domain module targets)

---

## CAP-15 — Compliance, Safety, and Finance Intelligence

| Field | Value |
|---|---|
| capability_id | CAP-15 |
| capability_name | Compliance, Safety, and Finance Intelligence |
| parent_domain | DOMAIN-05 (Analytics and Intelligence) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Regulatory compliance tracking, audit evidence management, safety scoring, incident recording, risk management, and financial cost tracking. Confirmed at app.module.ts lines 47–49.

**component_members:**
- ComplianceModule (COMP-19)
- SafetyModule (COMP-20)
- FinanceModule (COMP-21)

**primary_relationships:**
- R-024: FleetEventsModule CALLS ComplianceModule (audit log)
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-05 (Domain Event Fan-Out — Branch C: audit-log.handler → ComplianceModule)

---

## CAP-16 — Executive Intelligence and Data Monetization

| Field | Value |
|---|---|
| capability_id | CAP-16 |
| capability_name | Executive Intelligence and Data Monetization |
| parent_domain | DOMAIN-05 (Analytics and Intelligence) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
C-suite KPI aggregation, data provenance via blockchain audit trails, and anonymised fleet data marketplace product management. ExecutiveModule at app.module.ts line 68, BlockchainModule at line 77 with modules/blockchain/ confirmed, DataMonetizationModule at line 101.

**component_members:**
- ExecutiveModule (COMP-32)
- BlockchainModule (COMP-41)
- DataMonetizationModule (COMP-59)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — these modules as domain module targets)

---

## CAP-17 — Predictive and Anomaly Intelligence

| Field | Value |
|---|---|
| capability_id | CAP-17 |
| capability_name | Predictive and Anomaly Intelligence |
| parent_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
ML-driven predictive maintenance scheduling, statistical and ML-based anomaly detection across telemetry, and vehicle digital twin modelling. Confirmed at app.module.ts lines 82–83, 69, with modules/anomaly-detection/ directory confirmed. IIM-04 confirms these as core commercial differentiators.

**component_members:**
- AnomalyDetectionModule (COMP-33)
- PredictiveMaintenanceModule (COMP-44)
- DigitalTwinModule (COMP-45)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15
- R-015: SensorsModule PERSISTS_TO TimescaleDB (telemetry source)

**execution_contribution:**
- EP-06 (Predictive Maintenance AI Analysis — AnomalyDetectionModule step 3, PredictiveMaintenanceModule steps 1 and 5, DigitalTwinModule step 4)

---

## CAP-18 — Driver Intelligence

| Field | Value |
|---|---|
| capability_id | CAP-18 |
| capability_name | Driver Intelligence |
| parent_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Composite driver behaviour scoring from telemetry and safety events (DriverScoringModule at app.module.ts line 84) and driver fatigue detection with Hours of Service risk assessment (FatigueRiskModule at line 75). Both confirmed as AI/ML modules in IIM-04.

**component_members:**
- FatigueRiskModule (COMP-39)
- DriverScoringModule (COMP-46)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — these modules as domain module targets)

---

## CAP-19 — Agentic AI and Road Intelligence

| Field | Value |
|---|---|
| capability_id | CAP-19 |
| capability_name | Agentic AI and Road Intelligence |
| parent_domain | DOMAIN-06 (AI/ML Intelligence Layer) |
| capability_type | ENABLING |
| grounding_status | GROUNDED |

**description:**
Autonomous AI agent task execution for fleet operations optimisation (AgenticAIModule at app.module.ts line 98 with modules/agentic-ai/ confirmed) and road condition intelligence, hazard detection, and route optimisation (RoadIntelligenceModule at line 100).

**component_members:**
- AgenticAIModule (COMP-56)
- RoadIntelligenceModule (COMP-58)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — these modules as domain module targets)

---

## CAP-20 — Sensor Telemetry Ingestion

| Field | Value |
|---|---|
| capability_id | CAP-20 |
| capability_name | Sensor Telemetry Ingestion |
| parent_domain | DOMAIN-07 (Sensor and Security Ingestion) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Cloud-side reception of sensor readings, threshold evaluation, HAZMAT alert generation, and persistence to TimescaleDB sensor_readings hypertable. SensorsModule confirmed at app.module.ts line 106 with migration SensorsAndHasiIntegration.ts. New in v3.23.0.

**component_members:**
- SensorsModule (COMP-62)

**primary_relationships:**
- R-004: MQTT Broker BROADCASTS_TO SensorsModule
- R-015: SensorsModule PERSISTS_TO TimescaleDB
- R-018: SensorsModule EMITS FleetEventsModule

**execution_contribution:**
- EP-01 (Sensor Telemetry Ingest — step 5)
- EP-05 (Domain Event Fan-Out — SensorsModule as emitter)

**single_component_justification:**
SensorsModule is the discrete cloud-side terminus for sensor telemetry. HasiModule is its peer but serves a different data stream (network security). Separate capabilities reflect separate ingestion pipelines.

---

## CAP-21 — HASI Security Intelligence Ingestion

| Field | Value |
|---|---|
| capability_id | CAP-21 |
| capability_name | HASI Security Intelligence Ingestion |
| parent_domain | DOMAIN-07 (Sensor and Security Ingestion) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Cloud-side reception of HASI network threat data, GeoIP + ASN enrichment, MITRE ATT&CK mapping, and capture + threat persistence. HasiModule confirmed at app.module.ts line 107 with EVID-ARCH section s7. New in v3.23.0.

**component_members:**
- HasiModule (COMP-63)

**primary_relationships:**
- R-009: MQTT Broker BROADCASTS_TO HasiModule
- R-016: HasiModule PERSISTS_TO PostgreSQL 15
- R-019: HasiModule EMITS FleetEventsModule

**execution_contribution:**
- EP-02 (HASI Security Intelligence Path — step 5)
- EP-05 (Domain Event Fan-Out — HasiModule as emitter)

**single_component_justification:**
HasiModule is the discrete cloud-side terminus for HASI network security data. Separate capability from CAP-20 reflects its distinct data stream and processing logic.

---

## CAP-22 — WebSocket Event Broadcasting

| Field | Value |
|---|---|
| capability_id | CAP-22 |
| capability_name | WebSocket Event Broadcasting |
| parent_domain | DOMAIN-08 (Real-Time Streaming and Gateway) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Real-time fleet event streaming from backend to connected frontend clients via Socket.IO WebSocket. GatewaysModule confirmed at app.module.ts line 61 with fleet.gateway.ts source confirmed. FleetSocket Client confirmed via FleetSocket.ts source file and socket.io-client dependency in frontend package.json.

**component_members:**
- GatewaysModule (COMP-27)
- FleetSocket Client (COMP-69)

**primary_relationships:**
- R-021: FleetEventsModule BROADCASTS_TO GatewaysModule
- R-025: GatewaysModule BROADCASTS_TO FleetSocket Client
- R-026: FleetSocket Client DEPENDS_ON Frontend Application

**execution_contribution:**
- EP-01 (Sensor Telemetry Ingest — steps 8–9)
- EP-02 (HASI Security Pipeline — steps 8–9)
- EP-05 (Domain Event Fan-Out — Branch A)
- EP-06 (Predictive Maintenance AI — step 9)

---

## CAP-23 — JWT Authentication

| Field | Value |
|---|---|
| capability_id | CAP-23 |
| capability_name | JWT Authentication |
| parent_domain | DOMAIN-09 (Access Control and Identity) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
JWT-based stateless authentication with Passport strategy, bcrypt credential validation, RBAC role assignment, and multi-tier rate limiting via FleetThrottlerGuard. Confirmed at app.module.ts lines 20, 251–253 with passport-jwt, bcryptjs, @nestjs/jwt in backend package.json.

**component_members:**
- AuthModule (COMP-02)

**primary_relationships:**
- R-010: VehiclesModule AUTHENTICATES_VIA AuthModule
- R-011: DriversModule AUTHENTICATES_VIA AuthModule
- R-012: FleetsModule AUTHENTICATES_VIA AuthModule
- R-013: All 63 backend modules AUTHENTICATES_VIA AuthModule
- R-027: Frontend Application CALLS AuthModule
- R-029: Frontend Application AUTHENTICATES_VIA AuthModule

**execution_contribution:**
- EP-03 (User Authentication — steps 2, 4 credential validation and JWT signing)
- EP-04 (Fleet Data REST — step 3 JWT validation)
- EP-08 (Multi-Tenant Onboarding — step 6)

**single_component_justification:**
AuthModule is the sole authentication module. It is the global guard applied to all 63 backend modules (R-013) and has the highest connectivity in the relationship map.

---

## CAP-24 — Frontend Auth State Management

| Field | Value |
|---|---|
| capability_id | CAP-24 |
| capability_name | Frontend Auth State Management |
| parent_domain | DOMAIN-09 (Access Control and Identity) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
Client-side JWT token storage and authentication state management. AuthContext/AuthProvider confirmed via AuthContext.tsx and AuthProvider.tsx source files in frontend/contexts/.

**component_members:**
- AuthContext / AuthProvider (COMP-70)

**primary_relationships:**
- R-027: Frontend Application CALLS AuthModule (via AuthContext)

**execution_contribution:**
- EP-03 (User Authentication — step 5 token storage)

**single_component_justification:**
AuthContext/AuthProvider is the dedicated frontend auth state component. It operates distinctly from backend AuthModule and frontend page rendering.

---

## CAP-25 — API Versioning

| Field | Value |
|---|---|
| capability_id | CAP-25 |
| capability_name | API Versioning |
| parent_domain | DOMAIN-09 (Access Control and Identity) |
| capability_type | ENABLING |
| grounding_status | GROUNDED |

**description:**
API v2 controllers with enhanced responses, cursor-based pagination, and ApiVersionMiddleware. Confirmed at app.module.ts line 110 with common/versioning/ directory confirmed. Grouped under Access Control and Identity as it governs API surface and access patterns across the platform.

**component_members:**
- V2Module (COMP-67)

**primary_relationships:**
- (global middleware applied across all API endpoints — EVID-APPMOD line 110)

**execution_contribution:**
- EP-04 (Fleet Data REST — V2Module governs API versioning layer)

**single_component_justification:**
V2Module is a discrete API versioning layer with no peer component at this tier.

---

## CAP-26 — Primary Data Persistence

| Field | Value |
|---|---|
| capability_id | CAP-26 |
| capability_name | Primary Data Persistence |
| parent_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| capability_type | INFRASTRUCTURE |
| grounding_status | GROUNDED |

**description:**
PostgreSQL 15 relational database as the primary operational data store with 60+ entity tables managed via TypeORM, and TimescaleDB extension for sensor_readings hypertable. Both confirmed within evidence boundary.

**component_members:**
- PostgreSQL 15 (COMP-79)
- TimescaleDB (COMP-80)

**primary_relationships:**
- R-014: All backend modules with entities PERSISTS_TO PostgreSQL 15
- R-015: SensorsModule PERSISTS_TO TimescaleDB
- R-016: HasiModule PERSISTS_TO PostgreSQL 15
- R-031: MultiTenantModule DEPENDS_ON PostgreSQL 15

**execution_contribution:**
- EP-03, EP-04, EP-06, EP-08 (PostgreSQL as persistence target across multiple paths)
- EP-01 (TimescaleDB as sensor_readings store)

---

## CAP-27 — Caching Layer

| Field | Value |
|---|---|
| capability_id | CAP-27 |
| capability_name | Caching Layer |
| parent_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| capability_type | INFRASTRUCTURE |
| grounding_status | GROUNDED |

**description:**
Redis-backed API response caching with in-memory auto-fallback and pub/sub support. RedisCacheModule (COMP-64) confirmed at app.module.ts line 9 with common/cache/ directory. Redis 7 (COMP-81) confirmed via ioredis dependency and redis.config.ts.

**component_members:**
- RedisCacheModule (COMP-64)
- Redis 7 (COMP-81)

**primary_relationships:**
- R-017: All modules using cache DEPENDS_ON Redis 7
- R-022: FleetEventsModule CALLS RedisCacheModule

**execution_contribution:**
- EP-04 (Fleet Data REST — steps 4 and 7 cache hit check and write)
- EP-05 (Domain Event Fan-Out — Branch B cache invalidation)

---

## CAP-28 — Object Storage

| Field | Value |
|---|---|
| capability_id | CAP-28 |
| capability_name | Object Storage |
| parent_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| capability_type | INFRASTRUCTURE |
| grounding_status | WEAKLY GROUNDED |

**description:**
Object storage for PCAP captures, OTA firmware packages, report exports, and data lake accumulation. S3/MinIO declared in architecture HTML section s1 layer 5 only. WEAKLY GROUNDED.

**component_members:**
- S3 / MinIO Object Storage (COMP-82) [WEAKLY GROUNDED]

**primary_relationships:**
- R-040: OtaModule PERSISTS_TO S3/MinIO

**execution_contribution:**
- EP-07 (OTA Firmware Update — step 3)

**single_component_justification:**
S3/MinIO is the discrete object storage component. Architecture-declared but source-unconfirmed.

---

## CAP-29 — Platform Monorepo Container

| Field | Value |
|---|---|
| capability_id | CAP-29 |
| capability_name | Platform Monorepo Container |
| parent_domain | DOMAIN-10 (Platform Infrastructure and Data) |
| capability_type | INFRASTRUCTURE |
| grounding_status | GROUNDED |

**description:**
The blueedge-platform integrated monorepo containing all platform sub-systems. Confirmed via extraction log and repository classification analysis documents (EVID-LOG, EVID-CLASS, EVID-COMP).

**component_members:**
- blueedge-platform (Monorepo) (COMP-01)

**primary_relationships:**
- (structural container for all sub-components — EVID-LOG, EVID-CLASS)

**execution_contribution:**
- All execution paths (structural host context)

**single_component_justification:**
The monorepo is a unique platform-level structural component with no peer. It is the root container confirmed in analysis documents.

---

## CAP-30 — Domain Event Bus

| Field | Value |
|---|---|
| capability_id | CAP-30 |
| capability_name | Domain Event Bus |
| parent_domain | DOMAIN-11 (Event-Driven Architecture) |
| capability_type | ENABLING |
| grounding_status | GROUNDED |

**description:**
EventEmitter2-based event routing hub with four confirmed handler types (WebSocket broadcast, cache invalidation, audit log, notification delivery). FleetEventsModule confirmed at app.module.ts line 14 with 4 handler files in events/handlers/. IIM-05 confirms the deliberate decoupling design.

**component_members:**
- FleetEventsModule (COMP-65)

**primary_relationships:**
- R-018: SensorsModule EMITS FleetEventsModule
- R-019: HasiModule EMITS FleetEventsModule
- R-020: AlertsModule EMITS FleetEventsModule
- R-021: FleetEventsModule BROADCASTS_TO GatewaysModule
- R-022: FleetEventsModule CALLS RedisCacheModule
- R-023: FleetEventsModule CALLS NotificationsModule
- R-024: FleetEventsModule CALLS ComplianceModule
- R-038: All backend modules DEPENDS_ON FleetEventsModule

**execution_contribution:**
- EP-05 (Domain Event Fan-Out — full path)
- EP-01 (step 7)
- EP-02 (step 7)
- EP-06 (step 6)

**single_component_justification:**
FleetEventsModule is the sole event bus component. It has more relationship anchors (8) than any other component in the relationship map. Its CROSS-CUTTING tier classification and global import confirm its unique architectural role.

---

## CAP-31 — Multi-Tenant Provisioning

| Field | Value |
|---|---|
| capability_id | CAP-31 |
| capability_name | Multi-Tenant Provisioning |
| parent_domain | DOMAIN-12 (SaaS Platform Layer) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Tenant record creation, data isolation enforcement, and subscription billing. MultiTenantModule and BillingModule confirmed at app.module.ts lines 89–90 with modules/billing/ directory confirmed. IIM-06 confirms the SaaS commercial packaging intent.

**component_members:**
- MultiTenantModule (COMP-49)
- BillingModule (COMP-50)

**primary_relationships:**
- R-031: MultiTenantModule DEPENDS_ON PostgreSQL 15
- R-032: BillingModule DEPENDS_ON MultiTenantModule

**execution_contribution:**
- EP-08 (Multi-Tenant Onboarding — steps 3–4)

---

## CAP-32 — Tenant Onboarding and Branding

| Field | Value |
|---|---|
| capability_id | CAP-32 |
| capability_name | Tenant Onboarding and Branding |
| parent_domain | DOMAIN-12 (SaaS Platform Layer) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
Guided tenant onboarding wizard and multi-brand white-label configuration. OnboardingModule confirmed at app.module.ts line 91. WhiteLabelModule at line 78.

**component_members:**
- OnboardingModule (COMP-51)
- WhiteLabelModule (COMP-42)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-08 (Multi-Tenant Onboarding — step 2 OnboardingModule wizard state management)

---

## CAP-33 — Notification Delivery Channels

| Field | Value |
|---|---|
| capability_id | CAP-33 |
| capability_name | Notification Delivery Channels |
| parent_domain | DOMAIN-13 (External Integration) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
External notification delivery via email, SMS, and push channels. NotificationProvidersModule confirmed at app.module.ts line 94. R-033 confirms it serves NotificationsModule.

**component_members:**
- NotificationProvidersModule (COMP-52)

**primary_relationships:**
- R-033: NotificationProvidersModule SERVES NotificationsModule

**execution_contribution:**
- EP-05 (Domain Event Fan-Out — Branch D: notification delivery channel)

**single_component_justification:**
NotificationProvidersModule is the dedicated external delivery channel. It is distinct from the internal NotificationsModule (which is in DOMAIN-03).

---

## CAP-34 — Enterprise System Integration

| Field | Value |
|---|---|
| capability_id | CAP-34 |
| capability_name | Enterprise System Integration |
| parent_domain | DOMAIN-13 (External Integration) |
| capability_type | ENABLING |
| grounding_status | GROUNDED |

**description:**
ERP system connectors (SAP, Oracle) for fleet cost and asset data synchronisation, and third-party API marketplace for developer access. IntegrationHubModule as the orchestration hub. Confirmed at app.module.ts lines 95–97 with modules/api-marketplace/ directory confirmed.

**component_members:**
- ErpConnectorsModule (COMP-53)
- ApiMarketplaceModule (COMP-54)
- IntegrationHubModule (COMP-55)

**primary_relationships:**
- R-034: ErpConnectorsModule DEPENDS_ON IntegrationHubModule
- R-035: ApiMarketplaceModule SERVED_BY IntegrationHubModule

**execution_contribution:**
- EP-04 (Fleet Data REST — these modules as domain module targets)

---

## CAP-35 — Operator Web Application

| Field | Value |
|---|---|
| capability_id | CAP-35 |
| capability_name | Operator Web Application |
| parent_domain | DOMAIN-14 (Frontend Application) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Progressive Web App with 61 pages, PWA + offline capability, RTL Arabic support, RBAC navigation, and dark/light theme. Includes v3.23 additions: NetworkSecurityPage and SensorsPage. Frontend Application confirmed via package.json v3.15.0. Page modules confirmed via directory listing of frontend/pages/ subfolders.

**component_members:**
- Frontend Application (COMP-68)
- Frontend Page Modules (COMP-71)

**primary_relationships:**
- R-027: Frontend Application CALLS AuthModule
- R-028: Frontend Application CALLS domain modules
- R-029: Frontend Application AUTHENTICATES_VIA AuthModule
- R-030: Frontend Application SERVED_BY nginx

**execution_contribution:**
- EP-01 (step 10 SensorsPage display)
- EP-02 (step 9 NetworkSecurityPage display)
- EP-03 (steps 1, 5, 6)
- EP-04 (steps 1, 8)
- EP-07 (step 1 OtaPage)
- EP-08 (step 1 OnboardingWizardPage)

---

## CAP-36 — EV Telemetry and Energy Management

| Field | Value |
|---|---|
| capability_id | CAP-36 |
| capability_name | EV Telemetry and Energy Management |
| parent_domain | DOMAIN-15 (EV and Electrification) |
| capability_type | CORE |
| grounding_status | GROUNDED |

**description:**
Electric vehicle battery state, range management, vehicle-to-grid bidirectional charging, and public/private charging station network management. Confirmed at app.module.ts lines 56, 58, 79.

**component_members:**
- EvModule (COMP-24)
- V2gModule (COMP-26)
- ChargingStationsModule (COMP-43)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — EV modules as domain module targets)

---

## CAP-37 — Fleet Electrification Planning

| Field | Value |
|---|---|
| capability_id | CAP-37 |
| capability_name | Fleet Electrification Planning |
| parent_domain | DOMAIN-15 (EV and Electrification) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
Fleet electrification transition planning and depot-level EV charging schedule and capacity management. Confirmed at app.module.ts lines 66–67.

**component_members:**
- ElectrificationModule (COMP-30)
- DepotChargingModule (COMP-31)

**primary_relationships:**
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — planning modules as domain module targets)

---

## CAP-38 — Device OTA Management

| Field | Value |
|---|---|
| capability_id | CAP-38 |
| capability_name | Device OTA Management |
| parent_domain | DOMAIN-15 (EV and Electrification) |
| capability_type | ENABLING |
| grounding_status | GROUNDED |

**description:**
Over-the-air firmware update release and deployment management for SVG 2.0 devices. OtaModule confirmed at app.module.ts line 57. Cross-domain participation in DOMAIN-01 (SVG OTA Agent target).

**component_members:**
- OtaModule (COMP-25)

**primary_relationships:**
- R-039: OtaModule CALLS SVG OTA Agent
- R-040: OtaModule PERSISTS_TO S3/MinIO

**execution_contribution:**
- EP-07 (OTA Firmware Update Deployment — steps 2–5)

**single_component_justification:**
OtaModule is the sole cloud-side OTA orchestration component. Its edge counterpart (SVG OTA Agent) is in DOMAIN-01/CAP-04.

---

## CAP-39 — Platform Observability

| Field | Value |
|---|---|
| capability_id | CAP-39 |
| capability_name | Platform Observability |
| parent_domain | DOMAIN-16 (Operational Engineering) |
| capability_type | INFRASTRUCTURE |
| grounding_status | GROUNDED |

**description:**
Health check endpoint, Prometheus metrics exposition, and Grafana dashboard-based monitoring. HealthModule confirmed at app.module.ts line 11 with health/prometheus.service.ts. Monitoring Stack confirmed via monitoring/grafana/ and monitoring/prometheus/prometheus.yml. R-036 and R-037 confirm bidirectional relationship.

**component_members:**
- HealthModule (COMP-66)
- Monitoring Stack (COMP-86)

**primary_relationships:**
- R-036: HealthModule EMITS Monitoring Stack
- R-037: Monitoring Stack CONSUMES HealthModule

**execution_contribution:**
- None of the 8 modelled execution paths (operates orthogonally)

---

## CAP-40 — Delivery and Quality Infrastructure

| Field | Value |
|---|---|
| capability_id | CAP-40 |
| capability_name | Delivery and Quality Infrastructure |
| parent_domain | DOMAIN-16 (Operational Engineering) |
| capability_type | INFRASTRUCTURE |
| grounding_status | GROUNDED |

**description:**
GitHub Actions CI/CD pipeline automation, Docker Compose container orchestration, and API/WebSocket load testing scripts. All confirmed via file listings and analysis documents.

**component_members:**
- Load Tests (COMP-87)
- CI/CD Workflows (COMP-88)
- Docker Compose Orchestration (COMP-89)

**primary_relationships:**
- None explicitly modelled in relationship_map.md (operational tooling)

**execution_contribution:**
- None of the 8 modelled execution paths (engineering support layer)

---

## CAP-41 — Commercial Operations and Dispatch Services

| Field | Value |
|---|---|
| capability_id | CAP-41 |
| capability_name | Commercial Operations and Dispatch Services |
| parent_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
Surge pricing for taxi/rideshare, driver incentive program management, geofence automation, internal operator/driver messaging, and mobile driver companion data services. Confirmed at app.module.ts lines 64–65, 74, 85–86.

**component_members:**
- SurgePricingModule (COMP-28)
- DriverIncentivesModule (COMP-29)
- DriverMobileModule (COMP-38)
- GeofenceAutomationModule (COMP-47)
- MessagingModule (COMP-48)

**primary_relationships:**
- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — these modules as domain module targets)

---

## CAP-42 — Customer and Ecosystem Services

| Field | Value |
|---|---|
| capability_id | CAP-42 |
| capability_name | Customer and Ecosystem Services |
| parent_domain | DOMAIN-17 (Extended Operations and Driver Services) |
| capability_type | SUPPORTING |
| grounding_status | GROUNDED |

**description:**
Self-service customer portal, OEM aftersales service management, cross-border logistics compliance, permit lifecycle management, fleet asset acquisition/disposal lifecycle, and parts procurement marketplace. Confirmed at app.module.ts lines 40, 70–73, 76, 99 with modules/aftersales/ confirmed.

**component_members:**
- CustomerPortalModule (COMP-40)
- AftersalesModule (COMP-57)
- CrossBorderModule (COMP-34)
- PermitsModule (COMP-35)
- PartsMarketplaceModule (COMP-36)
- FleetLifecycleModule (COMP-37)

**primary_relationships:**
- R-013: All backend modules AUTHENTICATES_VIA AuthModule
- R-014: All backend modules PERSISTS_TO PostgreSQL 15

**execution_contribution:**
- EP-04 (Fleet Data REST — these modules as domain module targets)

---

## Capability Summary Table

| cap_id | capability_name | parent_domain | type | component_count | grounding_status |
|---|---|---|---|---|---|
| CAP-01 | Vehicle Sensor Collection | DOMAIN-01 | CORE | 3 | GROUNDED |
| CAP-02 | Network Security Intelligence Collection | DOMAIN-01 | CORE | 2 | GROUNDED |
| CAP-03 | SVG Device Hardware Platform | DOMAIN-01 | INFRASTRUCTURE | 1 | GROUNDED |
| CAP-04 | SVG Device Firmware Management | DOMAIN-01 | SUPPORTING | 1 | WEAKLY GROUNDED |
| CAP-05 | MQTT Telemetry Transport | DOMAIN-02 | INFRASTRUCTURE | 1 | GROUNDED |
| CAP-06 | Stream Processing Infrastructure | DOMAIN-02 | INFRASTRUCTURE | 2 | WEAKLY GROUNDED |
| CAP-07 | Core Fleet Asset Management | DOMAIN-03 | CORE | 3 | GROUNDED |
| CAP-08 | Driver Management | DOMAIN-03 | CORE | 2 | GROUNDED |
| CAP-09 | Alert and Notification Management | DOMAIN-03 | CORE | 2 | GROUNDED |
| CAP-10 | Maintenance and Fuel Operations | DOMAIN-03 | CORE | 2 | GROUNDED |
| CAP-11 | Operational Control and Device Management | DOMAIN-03 | SUPPORTING | 2 | GROUNDED |
| CAP-12 | Fleet Type Verticals | DOMAIN-04 | CORE | 3 | GROUNDED |
| CAP-13 | Specialty Transport Extensions | DOMAIN-04 | SUPPORTING | 3 | GROUNDED |
| CAP-14 | Fleet Analytics and Reporting | DOMAIN-05 | CORE | 3 | GROUNDED |
| CAP-15 | Compliance, Safety, and Finance Intelligence | DOMAIN-05 | CORE | 3 | GROUNDED |
| CAP-16 | Executive Intelligence and Data Monetization | DOMAIN-05 | SUPPORTING | 3 | GROUNDED |
| CAP-17 | Predictive and Anomaly Intelligence | DOMAIN-06 | CORE | 3 | GROUNDED |
| CAP-18 | Driver Intelligence | DOMAIN-06 | CORE | 2 | GROUNDED |
| CAP-19 | Agentic AI and Road Intelligence | DOMAIN-06 | ENABLING | 2 | GROUNDED |
| CAP-20 | Sensor Telemetry Ingestion | DOMAIN-07 | CORE | 1 | GROUNDED |
| CAP-21 | HASI Security Intelligence Ingestion | DOMAIN-07 | CORE | 1 | GROUNDED |
| CAP-22 | WebSocket Event Broadcasting | DOMAIN-08 | CORE | 2 | GROUNDED |
| CAP-23 | JWT Authentication | DOMAIN-09 | CORE | 1 | GROUNDED |
| CAP-24 | Frontend Auth State Management | DOMAIN-09 | SUPPORTING | 1 | GROUNDED |
| CAP-25 | API Versioning | DOMAIN-09 | ENABLING | 1 | GROUNDED |
| CAP-26 | Primary Data Persistence | DOMAIN-10 | INFRASTRUCTURE | 2 | GROUNDED |
| CAP-27 | Caching Layer | DOMAIN-10 | INFRASTRUCTURE | 2 | GROUNDED |
| CAP-28 | Object Storage | DOMAIN-10 | INFRASTRUCTURE | 1 | WEAKLY GROUNDED |
| CAP-29 | Platform Monorepo Container | DOMAIN-10 | INFRASTRUCTURE | 1 | GROUNDED |
| CAP-30 | Domain Event Bus | DOMAIN-11 | ENABLING | 1 | GROUNDED |
| CAP-31 | Multi-Tenant Provisioning | DOMAIN-12 | CORE | 2 | GROUNDED |
| CAP-32 | Tenant Onboarding and Branding | DOMAIN-12 | SUPPORTING | 2 | GROUNDED |
| CAP-33 | Notification Delivery Channels | DOMAIN-13 | SUPPORTING | 1 | GROUNDED |
| CAP-34 | Enterprise System Integration | DOMAIN-13 | ENABLING | 3 | GROUNDED |
| CAP-35 | Operator Web Application | DOMAIN-14 | CORE | 2 | GROUNDED |
| CAP-36 | EV Telemetry and Energy Management | DOMAIN-15 | CORE | 3 | GROUNDED |
| CAP-37 | Fleet Electrification Planning | DOMAIN-15 | SUPPORTING | 2 | GROUNDED |
| CAP-38 | Device OTA Management | DOMAIN-15 | ENABLING | 1 | GROUNDED |
| CAP-39 | Platform Observability | DOMAIN-16 | INFRASTRUCTURE | 2 | GROUNDED |
| CAP-40 | Delivery and Quality Infrastructure | DOMAIN-16 | INFRASTRUCTURE | 3 | GROUNDED |
| CAP-41 | Commercial Operations and Dispatch Services | DOMAIN-17 | SUPPORTING | 5 | GROUNDED |
| CAP-42 | Customer and Ecosystem Services | DOMAIN-17 | SUPPORTING | 6 | GROUNDED |
| **TOTAL** | | | | **89** | |

**Counts:**
- Total capabilities: 42
- Total component assignments across capabilities: 89
- GROUNDED capabilities: 39
- WEAKLY GROUNDED capabilities: 3 (CAP-04, CAP-06, CAP-28)
