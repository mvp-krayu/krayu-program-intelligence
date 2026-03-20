# PIE Render Manifest — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.1-OUTPUT-05
**manifest_id:** PIE-MANIFEST-BLUEEDGE-v3.23-RUN03-R01
**contract:** PIOS-41.1-RUN01-CONTRACT-v1
**mode:** SEMANTIC-CONSOLIDATION-STRICT
**run_reference:** run_03_blueedge_derivation_validation
**generated_from:** semantic_domain_model.md, capability_map.md, semantic_traceability_map.md
**date:** 2026-03-20

---

## Manifest Construction Rule

All nodes and links in this manifest must exist in semantic_domain_model.md or capability_map.md. No node or link outside what is grounded in those artifacts is permitted. Weakly grounded components are render-eligible with an explicit flag.

---

## Rendering Rules Declared

| Rule ID | Rule | Value |
|---|---|---|
| RR-01 | Maximum render depth | 3 levels (DOMAIN → CAPABILITY → COMPONENT) |
| RR-02 | Default collapse level | Collapse to CAPABILITY level by default; expand to COMPONENT on demand |
| RR-03 | WEAKLY GROUNDED node rendering | Render eligible but visually flagged (e.g., dashed border or asterisk marker) |
| RR-04 | Cross-domain components | Render in primary domain; cross-domain annotation displayed as link overlay |
| RR-05 | Single-component capabilities | Render eligible; no collapse to domain level without user action |
| RR-06 | Composite relationship entries | Render as single labelled aggregated link (e.g., "63 modules → AuthModule" shown as one edge) |
| RR-07 | Execution path overlay | EP-01 through EP-08 available as optional overlay; path traversal highlights node traversal sequence |

---

## Node Inventory

### DOMAIN Nodes (17 nodes)

| node_id | node_type | label | parent | render_eligible | reason_if_false |
|---|---|---|---|---|---|
| N-DOM-01 | DOMAIN | Edge Data Acquisition | — | true | — |
| N-DOM-02 | DOMAIN | Telemetry Transport and Messaging | — | true | — |
| N-DOM-03 | DOMAIN | Fleet Core Operations | — | true | — |
| N-DOM-04 | DOMAIN | Fleet Vertical Extensions | — | true | — |
| N-DOM-05 | DOMAIN | Analytics and Intelligence | — | true | — |
| N-DOM-06 | DOMAIN | AI/ML Intelligence Layer | — | true | — |
| N-DOM-07 | DOMAIN | Sensor and Security Ingestion | — | true | — |
| N-DOM-08 | DOMAIN | Real-Time Streaming and Gateway | — | true | — |
| N-DOM-09 | DOMAIN | Access Control and Identity | — | true | — |
| N-DOM-10 | DOMAIN | Platform Infrastructure and Data | — | true | — |
| N-DOM-11 | DOMAIN | Event-Driven Architecture | — | true | — |
| N-DOM-12 | DOMAIN | SaaS Platform Layer | — | true | — |
| N-DOM-13 | DOMAIN | External Integration | — | true | — |
| N-DOM-14 | DOMAIN | Frontend Application | — | true | — |
| N-DOM-15 | DOMAIN | EV and Electrification | — | true | — |
| N-DOM-16 | DOMAIN | Operational Engineering | — | true | — |
| N-DOM-17 | DOMAIN | Extended Operations and Driver Services | — | true | — |

### CAPABILITY Nodes (42 nodes)

| node_id | node_type | label | parent | render_eligible | reason_if_false |
|---|---|---|---|---|---|
| N-CAP-01 | CAPABILITY | Vehicle Sensor Collection | N-DOM-01 | true | — |
| N-CAP-02 | CAPABILITY | Network Security Intelligence Collection | N-DOM-01 | true | — |
| N-CAP-03 | CAPABILITY | SVG Device Hardware Platform | N-DOM-01 | true | — |
| N-CAP-04 | CAPABILITY | SVG Device Firmware Management [WEAKLY GROUNDED] | N-DOM-01 | true | Weakly grounded — render with flag |
| N-CAP-05 | CAPABILITY | MQTT Telemetry Transport | N-DOM-02 | true | — |
| N-CAP-06 | CAPABILITY | Stream Processing Infrastructure [WEAKLY GROUNDED] | N-DOM-02 | true | Weakly grounded — render with flag |
| N-CAP-07 | CAPABILITY | Core Fleet Asset Management | N-DOM-03 | true | — |
| N-CAP-08 | CAPABILITY | Driver Management | N-DOM-03 | true | — |
| N-CAP-09 | CAPABILITY | Alert and Notification Management | N-DOM-03 | true | — |
| N-CAP-10 | CAPABILITY | Maintenance and Fuel Operations | N-DOM-03 | true | — |
| N-CAP-11 | CAPABILITY | Operational Control and Device Management | N-DOM-03 | true | — |
| N-CAP-12 | CAPABILITY | Fleet Type Verticals | N-DOM-04 | true | — |
| N-CAP-13 | CAPABILITY | Specialty Transport Extensions | N-DOM-04 | true | — |
| N-CAP-14 | CAPABILITY | Fleet Analytics and Reporting | N-DOM-05 | true | — |
| N-CAP-15 | CAPABILITY | Compliance, Safety, and Finance Intelligence | N-DOM-05 | true | — |
| N-CAP-16 | CAPABILITY | Executive Intelligence and Data Monetization | N-DOM-05 | true | — |
| N-CAP-17 | CAPABILITY | Predictive and Anomaly Intelligence | N-DOM-06 | true | — |
| N-CAP-18 | CAPABILITY | Driver Intelligence | N-DOM-06 | true | — |
| N-CAP-19 | CAPABILITY | Agentic AI and Road Intelligence | N-DOM-06 | true | — |
| N-CAP-20 | CAPABILITY | Sensor Telemetry Ingestion | N-DOM-07 | true | — |
| N-CAP-21 | CAPABILITY | HASI Security Intelligence Ingestion | N-DOM-07 | true | — |
| N-CAP-22 | CAPABILITY | WebSocket Event Broadcasting | N-DOM-08 | true | — |
| N-CAP-23 | CAPABILITY | JWT Authentication | N-DOM-09 | true | — |
| N-CAP-24 | CAPABILITY | Frontend Auth State Management | N-DOM-09 | true | — |
| N-CAP-25 | CAPABILITY | API Versioning | N-DOM-09 | true | — |
| N-CAP-26 | CAPABILITY | Primary Data Persistence | N-DOM-10 | true | — |
| N-CAP-27 | CAPABILITY | Caching Layer | N-DOM-10 | true | — |
| N-CAP-28 | CAPABILITY | Object Storage [WEAKLY GROUNDED] | N-DOM-10 | true | Weakly grounded — render with flag |
| N-CAP-29 | CAPABILITY | Platform Monorepo Container | N-DOM-10 | true | — |
| N-CAP-30 | CAPABILITY | Domain Event Bus | N-DOM-11 | true | — |
| N-CAP-31 | CAPABILITY | Multi-Tenant Provisioning | N-DOM-12 | true | — |
| N-CAP-32 | CAPABILITY | Tenant Onboarding and Branding | N-DOM-12 | true | — |
| N-CAP-33 | CAPABILITY | Notification Delivery Channels | N-DOM-13 | true | — |
| N-CAP-34 | CAPABILITY | Enterprise System Integration | N-DOM-13 | true | — |
| N-CAP-35 | CAPABILITY | Operator Web Application | N-DOM-14 | true | — |
| N-CAP-36 | CAPABILITY | EV Telemetry and Energy Management | N-DOM-15 | true | — |
| N-CAP-37 | CAPABILITY | Fleet Electrification Planning | N-DOM-15 | true | — |
| N-CAP-38 | CAPABILITY | Device OTA Management | N-DOM-15 | true | — |
| N-CAP-39 | CAPABILITY | Platform Observability | N-DOM-16 | true | — |
| N-CAP-40 | CAPABILITY | Delivery and Quality Infrastructure | N-DOM-16 | true | — |
| N-CAP-41 | CAPABILITY | Commercial Operations and Dispatch Services | N-DOM-17 | true | — |
| N-CAP-42 | CAPABILITY | Customer and Ecosystem Services | N-DOM-17 | true | — |

### COMPONENT Nodes (89 nodes)

| node_id | node_type | label | parent | render_eligible | reason_if_false |
|---|---|---|---|---|---|
| N-COMP-01 | COMPONENT | blueedge-platform (Monorepo) | N-CAP-29 | true | — |
| N-COMP-02 | COMPONENT | AuthModule | N-CAP-23 | true | — |
| N-COMP-03 | COMPONENT | VehiclesModule | N-CAP-07 | true | — |
| N-COMP-04 | COMPONENT | DriversModule | N-CAP-08 | true | — |
| N-COMP-05 | COMPONENT | FleetsModule | N-CAP-07 | true | — |
| N-COMP-06 | COMPONENT | TripsModule | N-CAP-07 | true | — |
| N-COMP-07 | COMPONENT | AlertsModule | N-CAP-09 | true | — |
| N-COMP-08 | COMPONENT | MaintenanceModule | N-CAP-10 | true | — |
| N-COMP-09 | COMPONENT | FuelModule | N-CAP-10 | true | — |
| N-COMP-10 | COMPONENT | TankerModule | N-CAP-12 | true | — |
| N-COMP-11 | COMPONENT | BusModule | N-CAP-12 | true | — |
| N-COMP-12 | COMPONENT | TaxiModule | N-CAP-12 | true | — |
| N-COMP-13 | COMPONENT | OperationsModule | N-CAP-11 | true | — |
| N-COMP-14 | COMPONENT | DevicesModule | N-CAP-11 | true | — |
| N-COMP-15 | COMPONENT | NotificationsModule | N-CAP-09 | true | — |
| N-COMP-16 | COMPONENT | AnalyticsModule | N-CAP-14 | true | — |
| N-COMP-17 | COMPONENT | ReportsModule | N-CAP-14 | true | — |
| N-COMP-18 | COMPONENT | DiagnosticsModule | N-CAP-14 | true | — |
| N-COMP-19 | COMPONENT | ComplianceModule | N-CAP-15 | true | — |
| N-COMP-20 | COMPONENT | SafetyModule | N-CAP-15 | true | — |
| N-COMP-21 | COMPONENT | FinanceModule | N-CAP-15 | true | — |
| N-COMP-22 | COMPONENT | UsersModule | N-CAP-08 | true | — |
| N-COMP-23 | COMPONENT | ColdchainModule | N-CAP-13 | true | — |
| N-COMP-24 | COMPONENT | EvModule | N-CAP-36 | true | — |
| N-COMP-25 | COMPONENT | OtaModule [cross-domain: DOM-01] | N-CAP-38 | true | — |
| N-COMP-26 | COMPONENT | V2gModule | N-CAP-36 | true | — |
| N-COMP-27 | COMPONENT | GatewaysModule | N-CAP-22 | true | — |
| N-COMP-28 | COMPONENT | SurgePricingModule | N-CAP-41 | true | — |
| N-COMP-29 | COMPONENT | DriverIncentivesModule | N-CAP-41 | true | — |
| N-COMP-30 | COMPONENT | ElectrificationModule | N-CAP-37 | true | — |
| N-COMP-31 | COMPONENT | DepotChargingModule | N-CAP-37 | true | — |
| N-COMP-32 | COMPONENT | ExecutiveModule | N-CAP-16 | true | — |
| N-COMP-33 | COMPONENT | AnomalyDetectionModule | N-CAP-17 | true | — |
| N-COMP-34 | COMPONENT | CrossBorderModule | N-CAP-42 | true | — |
| N-COMP-35 | COMPONENT | PermitsModule | N-CAP-42 | true | — |
| N-COMP-36 | COMPONENT | PartsMarketplaceModule | N-CAP-42 | true | — |
| N-COMP-37 | COMPONENT | FleetLifecycleModule | N-CAP-42 | true | — |
| N-COMP-38 | COMPONENT | DriverMobileModule | N-CAP-41 | true | — |
| N-COMP-39 | COMPONENT | FatigueRiskModule | N-CAP-18 | true | — |
| N-COMP-40 | COMPONENT | CustomerPortalModule | N-CAP-42 | true | — |
| N-COMP-41 | COMPONENT | BlockchainModule | N-CAP-16 | true | — |
| N-COMP-42 | COMPONENT | WhiteLabelModule | N-CAP-32 | true | — |
| N-COMP-43 | COMPONENT | ChargingStationsModule | N-CAP-36 | true | — |
| N-COMP-44 | COMPONENT | PredictiveMaintenanceModule | N-CAP-17 | true | — |
| N-COMP-45 | COMPONENT | DigitalTwinModule | N-CAP-17 | true | — |
| N-COMP-46 | COMPONENT | DriverScoringModule | N-CAP-18 | true | — |
| N-COMP-47 | COMPONENT | GeofenceAutomationModule | N-CAP-41 | true | — |
| N-COMP-48 | COMPONENT | MessagingModule | N-CAP-41 | true | — |
| N-COMP-49 | COMPONENT | MultiTenantModule | N-CAP-31 | true | — |
| N-COMP-50 | COMPONENT | BillingModule | N-CAP-31 | true | — |
| N-COMP-51 | COMPONENT | OnboardingModule | N-CAP-32 | true | — |
| N-COMP-52 | COMPONENT | NotificationProvidersModule | N-CAP-33 | true | — |
| N-COMP-53 | COMPONENT | ErpConnectorsModule | N-CAP-34 | true | — |
| N-COMP-54 | COMPONENT | ApiMarketplaceModule | N-CAP-34 | true | — |
| N-COMP-55 | COMPONENT | IntegrationHubModule | N-CAP-34 | true | — |
| N-COMP-56 | COMPONENT | AgenticAIModule | N-CAP-19 | true | — |
| N-COMP-57 | COMPONENT | AftersalesModule | N-CAP-42 | true | — |
| N-COMP-58 | COMPONENT | RoadIntelligenceModule | N-CAP-19 | true | — |
| N-COMP-59 | COMPONENT | DataMonetizationModule | N-CAP-16 | true | — |
| N-COMP-60 | COMPONENT | DriverSessionsModule | N-CAP-13 | true | — |
| N-COMP-61 | COMPONENT | VehicleLifecycleModule | N-CAP-13 | true | — |
| N-COMP-62 | COMPONENT | SensorsModule | N-CAP-20 | true | — |
| N-COMP-63 | COMPONENT | HasiModule | N-CAP-21 | true | — |
| N-COMP-64 | COMPONENT | RedisCacheModule | N-CAP-27 | true | — |
| N-COMP-65 | COMPONENT | FleetEventsModule | N-CAP-30 | true | — |
| N-COMP-66 | COMPONENT | HealthModule | N-CAP-39 | true | — |
| N-COMP-67 | COMPONENT | V2Module (API Versioning) | N-CAP-25 | true | — |
| N-COMP-68 | COMPONENT | Frontend Application | N-CAP-35 | true | — |
| N-COMP-69 | COMPONENT | FleetSocket Client | N-CAP-22 | true | — |
| N-COMP-70 | COMPONENT | AuthContext / AuthProvider | N-CAP-24 | true | — |
| N-COMP-71 | COMPONENT | Frontend Page Modules (61 pages) | N-CAP-35 | true | — |
| N-COMP-72 | COMPONENT | SVG 2.0 Smart Vehicle Gateway | N-CAP-03 | true | — |
| N-COMP-73 | COMPONENT | sensor_collector.py | N-CAP-01 | true | — |
| N-COMP-74 | COMPONENT | hasi_bridge.py | N-CAP-02 | true | — |
| N-COMP-75 | COMPONENT | HASI v1.0.0 | N-CAP-02 | true | — |
| N-COMP-76 | COMPONENT | SVG Main Telemetry Firmware | N-CAP-01 | true | — |
| N-COMP-77 | COMPONENT | SVG OTA Agent [WEAKLY GROUNDED] | N-CAP-04 | true | Weakly grounded — render with flag |
| N-COMP-78 | COMPONENT | SVG Agent Configuration | N-CAP-01 | true | — |
| N-COMP-79 | COMPONENT | PostgreSQL 15 | N-CAP-26 | true | — |
| N-COMP-80 | COMPONENT | TimescaleDB | N-CAP-26 | true | — |
| N-COMP-81 | COMPONENT | Redis 7 | N-CAP-27 | true | — |
| N-COMP-82 | COMPONENT | S3 / MinIO Object Storage [WEAKLY GROUNDED] | N-CAP-28 | true | Weakly grounded — render with flag |
| N-COMP-83 | COMPONENT | MQTT Broker (EMQX) | N-CAP-05 | true | — |
| N-COMP-84 | COMPONENT | Apache Kafka [WEAKLY GROUNDED] | N-CAP-06 | true | Weakly grounded — render with flag |
| N-COMP-85 | COMPONENT | Apache Flink [WEAKLY GROUNDED] | N-CAP-06 | true | Weakly grounded — render with flag |
| N-COMP-86 | COMPONENT | Monitoring Stack | N-CAP-39 | true | — |
| N-COMP-87 | COMPONENT | Load Tests | N-CAP-40 | true | — |
| N-COMP-88 | COMPONENT | CI/CD Workflows | N-CAP-40 | true | — |
| N-COMP-89 | COMPONENT | Docker Compose Orchestration | N-CAP-40 | true | — |

---

## Link Inventory

All links are derived from relationship_map.md entries, elevated to the semantic level. Links represent domain-to-domain and capability-to-capability relationships evidenced by component-level relationships.

### Domain-Level Links (semantic inter-domain relationships)

| link_id | source_node | target_node | link_type | relationship_map_ref | render_eligible |
|---|---|---|---|---|---|
| L-DOM-01 | N-DOM-01 (Edge Data Acquisition) | N-DOM-02 (Telemetry Transport) | EMITS | R-001, R-007 | true |
| L-DOM-02 | N-DOM-01 (Edge Data Acquisition) | N-DOM-07 (Sensor and Security Ingestion) | CALLS | R-002, R-008 | true |
| L-DOM-03 | N-DOM-02 (Telemetry Transport) | N-DOM-07 (Sensor and Security Ingestion) | BROADCASTS_TO | R-004, R-009 | true |
| L-DOM-04 | N-DOM-07 (Sensor and Security Ingestion) | N-DOM-11 (Event-Driven Architecture) | EMITS | R-018, R-019 | true |
| L-DOM-05 | N-DOM-03 (Fleet Core Operations) | N-DOM-11 (Event-Driven Architecture) | EMITS | R-020 | true |
| L-DOM-06 | N-DOM-11 (Event-Driven Architecture) | N-DOM-08 (Real-Time Streaming) | BROADCASTS_TO | R-021 | true |
| L-DOM-07 | N-DOM-11 (Event-Driven Architecture) | N-DOM-10 (Platform Infrastructure) | CALLS | R-022 | true |
| L-DOM-08 | N-DOM-11 (Event-Driven Architecture) | N-DOM-03 (Fleet Core Operations) | CALLS | R-023 | true |
| L-DOM-09 | N-DOM-11 (Event-Driven Architecture) | N-DOM-05 (Analytics and Intelligence) | CALLS | R-024 | true |
| L-DOM-10 | N-DOM-08 (Real-Time Streaming) | N-DOM-14 (Frontend Application) | BROADCASTS_TO | R-025, R-026 | true |
| L-DOM-11 | N-DOM-14 (Frontend Application) | N-DOM-09 (Access Control) | AUTHENTICATES_VIA | R-027, R-029 | true |
| L-DOM-12 | N-DOM-14 (Frontend Application) | N-DOM-03 (Fleet Core Operations) | CALLS | R-028 | true |
| L-DOM-13 | N-DOM-03 through N-DOM-07, N-DOM-15, N-DOM-12, N-DOM-06 | N-DOM-09 (Access Control) | AUTHENTICATES_VIA | R-013 (composite) | true |
| L-DOM-14 | N-DOM-03 through N-DOM-17 (all entity modules) | N-DOM-10 (Platform Infrastructure) | PERSISTS_TO | R-014 | true |
| L-DOM-15 | N-DOM-07 (Sensor Ingestion) | N-DOM-10 (Platform Infrastructure) | PERSISTS_TO | R-015, R-016 | true |
| L-DOM-16 | N-DOM-12 (SaaS) | N-DOM-10 (Platform Infrastructure) | DEPENDS_ON | R-031, R-032 | true |
| L-DOM-17 | N-DOM-13 (External Integration) | N-DOM-03 (Fleet Core Operations) | SERVES | R-033 | true |
| L-DOM-18 | N-DOM-16 (Operational Engineering) | N-DOM-16 (self: HealthModule↔Monitoring) | EMITS/CONSUMES | R-036, R-037 | true |
| L-DOM-19 | N-DOM-15 (EV) | N-DOM-01 (Edge Data Acquisition) | CALLS | R-039 [cross-domain OtaModule→SVG OTA Agent] | true |
| L-DOM-20 | N-DOM-15 (EV) | N-DOM-10 (Platform Infrastructure) | PERSISTS_TO | R-040 [OtaModule→S3] | true |

### Capability-Level Links (selected high-value inter-capability relationships)

| link_id | source_node | target_node | link_type | relationship_map_ref | render_eligible |
|---|---|---|---|---|---|
| L-CAP-01 | N-CAP-01 (Vehicle Sensor Collection) | N-CAP-05 (MQTT Transport) | EMITS | R-001 | true |
| L-CAP-02 | N-CAP-01 (Vehicle Sensor Collection) | N-CAP-20 (Sensor Ingestion) | CALLS | R-002 | true |
| L-CAP-03 | N-CAP-02 (HASI Collection) | N-CAP-05 (MQTT Transport) | EMITS | R-007 | true |
| L-CAP-04 | N-CAP-02 (HASI Collection) | N-CAP-21 (HASI Ingestion) | CALLS | R-008 | true |
| L-CAP-05 | N-CAP-05 (MQTT Transport) | N-CAP-20 (Sensor Ingestion) | BROADCASTS_TO | R-004 | true |
| L-CAP-06 | N-CAP-05 (MQTT Transport) | N-CAP-21 (HASI Ingestion) | BROADCASTS_TO | R-009 | true |
| L-CAP-07 | N-CAP-20 (Sensor Ingestion) | N-CAP-26 (Primary Data Persistence) | PERSISTS_TO | R-015 | true |
| L-CAP-08 | N-CAP-21 (HASI Ingestion) | N-CAP-26 (Primary Data Persistence) | PERSISTS_TO | R-016 | true |
| L-CAP-09 | N-CAP-20 (Sensor Ingestion) | N-CAP-30 (Domain Event Bus) | EMITS | R-018 | true |
| L-CAP-10 | N-CAP-21 (HASI Ingestion) | N-CAP-30 (Domain Event Bus) | EMITS | R-019 | true |
| L-CAP-11 | N-CAP-09 (Alert/Notification) | N-CAP-30 (Domain Event Bus) | EMITS | R-020 | true |
| L-CAP-12 | N-CAP-30 (Domain Event Bus) | N-CAP-22 (WebSocket Broadcasting) | BROADCASTS_TO | R-021 | true |
| L-CAP-13 | N-CAP-30 (Domain Event Bus) | N-CAP-27 (Caching Layer) | CALLS | R-022 | true |
| L-CAP-14 | N-CAP-30 (Domain Event Bus) | N-CAP-09 (Alert/Notification) | CALLS | R-023 | true |
| L-CAP-15 | N-CAP-30 (Domain Event Bus) | N-CAP-15 (Compliance Intelligence) | CALLS | R-024 | true |
| L-CAP-16 | N-CAP-22 (WebSocket Broadcasting) | N-CAP-35 (Operator Web App) | BROADCASTS_TO | R-025, R-026 | true |
| L-CAP-17 | N-CAP-35 (Operator Web App) | N-CAP-23 (JWT Authentication) | AUTHENTICATES_VIA | R-027, R-029 | true |
| L-CAP-18 | N-CAP-23 (JWT Authentication) | (all backend capabilities) | AUTHENTICATES_VIA | R-013 (composite) | true |
| L-CAP-19 | N-CAP-26 (Primary Data Persistence) | N-CAP-26 (self: TimescaleDB relationship) | PERSISTS_TO | R-015 | true |
| L-CAP-20 | N-CAP-31 (Multi-Tenant Provisioning) | N-CAP-26 (Primary Data Persistence) | DEPENDS_ON | R-031, R-032 | true |
| L-CAP-21 | N-CAP-33 (Notification Channels) | N-CAP-09 (Alert/Notification) | SERVES | R-033 | true |
| L-CAP-22 | N-CAP-34 (Enterprise Integration) | N-CAP-34 (self: IntegrationHub routing) | DEPENDS_ON | R-034, R-035 | true |
| L-CAP-23 | N-CAP-39 (Observability) | N-CAP-39 (self: HealthModule↔Monitoring) | EMITS/CONSUMES | R-036, R-037 | true |
| L-CAP-24 | N-CAP-38 (Device OTA) | N-CAP-04 (SVG Firmware Management) | CALLS | R-039 | true |
| L-CAP-25 | N-CAP-38 (Device OTA) | N-CAP-28 (Object Storage) | PERSISTS_TO | R-040 | true |
| L-CAP-26 | N-CAP-24 (Frontend Auth) | N-CAP-23 (JWT Auth) | CALLS | R-027 | true |
| L-CAP-27 | N-CAP-17 (Predictive Intelligence) | N-CAP-26 (Primary Data Persistence) | PERSISTS_TO | R-014, R-015 | true |
| L-CAP-28 | N-CAP-27 (Caching Layer) | N-CAP-27 (self: Redis backing) | DEPENDS_ON | R-017 | true |

---

## Totals

| Category | Count |
|---|---|
| DOMAIN nodes | 17 |
| CAPABILITY nodes | 42 |
| COMPONENT nodes | 89 |
| **Total nodes** | **148** |
| Domain-level links | 20 |
| Capability-level links | 28 |
| **Total links** | **48** |
| Nodes render_eligible: true | 148 |
| Nodes render_eligible: false | 0 |
| Links render_eligible: true | 48 |
| Links render_eligible: false | 0 |
| Nodes with WEAKLY GROUNDED flag | 4 (N-COMP-77, N-COMP-82, N-COMP-84, N-COMP-85) + 3 capabilities (N-CAP-04, N-CAP-06, N-CAP-28) |

---

## Manifest Integrity

**manifest_integrity: COMPLETE**

All 148 nodes are derived exclusively from semantic_domain_model.md (17 domains) and capability_map.md (42 capabilities, 89 components). All 48 links are derived from relationship_map.md entries elevated to the semantic level. No node or link exists outside these grounded sources. Weakly grounded nodes are included and flagged per rendering rule RR-03.
