# PIE Navigation Map — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.2-PIE-NAV-MAP
**contract_id:** PIOS-41.2-RUN01-CONTRACT-v1
**mode:** PIE-RENDER-STRICT
**date:** 2026-03-20

---

## Full Hierarchical Navigation Tree

```
DOMAIN-01: Edge Data Acquisition [FUNCTIONAL | GROUNDED]
  └── CAP-01: Vehicle Sensor Collection [CORE]
        ├── COMP-73: sensor_collector.py
        ├── COMP-76: SVG Main Telemetry Firmware
        └── COMP-78: SVG Agent Configuration
  └── CAP-02: Network Security Intelligence Collection [CORE]
        ├── COMP-74: hasi_bridge.py
        └── COMP-75: HASI v1.0.0
  └── CAP-03: SVG Device Hardware Platform [INFRASTRUCTURE]
        └── COMP-72: SVG 2.0 Smart Vehicle Gateway
  └── CAP-04: SVG Device Firmware Management [SUPPORTING | WEAKLY GROUNDED]
        └── COMP-77: SVG OTA Agent [WEAKLY GROUNDED]

DOMAIN-02: Telemetry Transport and Messaging [INFRASTRUCTURE | WEAKLY GROUNDED]
  └── CAP-05: MQTT Telemetry Transport [INFRASTRUCTURE]
        └── COMP-83: MQTT Broker (EMQX)
  └── CAP-06: Stream Processing Infrastructure [INFRASTRUCTURE | WEAKLY GROUNDED]
        ├── COMP-84: Apache Kafka [WEAKLY GROUNDED]
        └── COMP-85: Apache Flink [WEAKLY GROUNDED]

DOMAIN-03: Fleet Core Operations [FUNCTIONAL | GROUNDED]
  └── CAP-07: Core Fleet Asset Management [CORE]
        ├── COMP-03: VehiclesModule
        ├── COMP-05: FleetsModule
        └── COMP-06: TripsModule
  └── CAP-08: Driver Management [CORE]
        ├── COMP-04: DriversModule
        └── COMP-22: UsersModule
  └── CAP-09: Alert and Notification Management [CORE]
        ├── COMP-07: AlertsModule
        └── COMP-15: NotificationsModule
  └── CAP-10: Maintenance and Fuel Operations [CORE]
        ├── COMP-08: MaintenanceModule
        └── COMP-09: FuelModule
  └── CAP-11: Operational Control and Device Management [SUPPORTING]
        ├── COMP-13: OperationsModule
        └── COMP-14: DevicesModule

DOMAIN-04: Fleet Vertical Extensions [FUNCTIONAL | GROUNDED]
  └── CAP-12: Fleet Type Verticals [CORE]
        ├── COMP-10: TankerModule
        ├── COMP-11: BusModule
        └── COMP-12: TaxiModule
  └── CAP-13: Specialty Transport Extensions [SUPPORTING]
        ├── COMP-23: ColdchainModule
        ├── COMP-60: DriverSessionsModule
        └── COMP-61: VehicleLifecycleModule

DOMAIN-05: Analytics and Intelligence [FUNCTIONAL | GROUNDED]
  └── CAP-14: Fleet Analytics and Reporting [CORE]
        ├── COMP-16: AnalyticsModule
        ├── COMP-17: ReportsModule
        └── COMP-18: DiagnosticsModule
  └── CAP-15: Compliance, Safety, and Finance Intelligence [CORE]
        ├── COMP-19: ComplianceModule
        ├── COMP-20: SafetyModule
        └── COMP-21: FinanceModule
  └── CAP-16: Executive Intelligence and Data Monetization [SUPPORTING]
        ├── COMP-32: ExecutiveModule
        ├── COMP-41: BlockchainModule
        └── COMP-59: DataMonetizationModule

DOMAIN-06: AI/ML Intelligence Layer [FUNCTIONAL | GROUNDED]
  └── CAP-17: Predictive and Anomaly Intelligence [CORE]
        ├── COMP-33: AnomalyDetectionModule
        ├── COMP-44: PredictiveMaintenanceModule
        └── COMP-45: DigitalTwinModule
  └── CAP-18: Driver Intelligence [CORE]
        ├── COMP-39: FatigueRiskModule
        └── COMP-46: DriverScoringModule
  └── CAP-19: Agentic AI and Road Intelligence [ENABLING]
        ├── COMP-56: AgenticAIModule
        └── COMP-58: RoadIntelligenceModule

DOMAIN-07: Sensor and Security Ingestion [FUNCTIONAL | GROUNDED]
  └── CAP-20: Sensor Telemetry Ingestion [CORE]
        └── COMP-62: SensorsModule
  └── CAP-21: HASI Security Intelligence Ingestion [CORE]
        └── COMP-63: HasiModule

DOMAIN-08: Real-Time Streaming and Gateway [OPERATIONAL | GROUNDED]
  └── CAP-22: WebSocket Event Broadcasting [CORE]
        ├── COMP-27: GatewaysModule
        └── COMP-69: FleetSocket Client

DOMAIN-09: Access Control and Identity [CROSS-CUTTING | GROUNDED]
  └── CAP-23: JWT Authentication [CORE]
        └── COMP-02: AuthModule
  └── CAP-24: Frontend Auth State Management [SUPPORTING]
        └── COMP-70: AuthContext / AuthProvider
  └── CAP-25: API Versioning [ENABLING]
        └── COMP-67: V2Module

DOMAIN-10: Platform Infrastructure and Data [INFRASTRUCTURE | WEAKLY GROUNDED]
  └── CAP-26: Primary Data Persistence [INFRASTRUCTURE]
        ├── COMP-79: PostgreSQL 15
        └── COMP-80: TimescaleDB
  └── CAP-27: Caching Layer [INFRASTRUCTURE]
        ├── COMP-64: RedisCacheModule
        └── COMP-81: Redis 7
  └── CAP-28: Object Storage [INFRASTRUCTURE | WEAKLY GROUNDED]
        └── COMP-82: S3 / MinIO Object Storage [WEAKLY GROUNDED]
  └── CAP-29: Platform Monorepo Container [INFRASTRUCTURE]
        └── COMP-01: blueedge-platform (Monorepo)

DOMAIN-11: Event-Driven Architecture [CROSS-CUTTING | GROUNDED]
  └── CAP-30: Domain Event Bus [ENABLING]
        └── COMP-65: FleetEventsModule

DOMAIN-12: SaaS Platform Layer [OPERATIONAL | GROUNDED]
  └── CAP-31: Multi-Tenant Provisioning [CORE]
        ├── COMP-49: MultiTenantModule
        └── COMP-50: BillingModule
  └── CAP-32: Tenant Onboarding and Branding [SUPPORTING]
        ├── COMP-42: WhiteLabelModule
        └── COMP-51: OnboardingModule

DOMAIN-13: External Integration [INTEGRATION | GROUNDED]
  └── CAP-33: Notification Delivery Channels [SUPPORTING]
        └── COMP-52: NotificationProvidersModule
  └── CAP-34: Enterprise System Integration [ENABLING]
        ├── COMP-53: ErpConnectorsModule
        ├── COMP-54: ApiMarketplaceModule
        └── COMP-55: IntegrationHubModule

DOMAIN-14: Frontend Application [FUNCTIONAL | GROUNDED]
  └── CAP-35: Operator Web Application [CORE]
        ├── COMP-68: Frontend Application
        └── COMP-71: Frontend Page Modules (61 pages)

DOMAIN-15: EV and Electrification [FUNCTIONAL | GROUNDED]
  └── CAP-36: EV Telemetry and Energy Management [CORE]
        ├── COMP-24: EvModule
        ├── COMP-26: V2gModule
        └── COMP-43: ChargingStationsModule
  └── CAP-37: Fleet Electrification Planning [SUPPORTING]
        ├── COMP-30: ElectrificationModule
        └── COMP-31: DepotChargingModule
  └── CAP-38: Device OTA Management [ENABLING]
        └── COMP-25: OtaModule [cross-domain: DOMAIN-01]

DOMAIN-16: Operational Engineering [INFRASTRUCTURE | GROUNDED]
  └── CAP-39: Platform Observability [INFRASTRUCTURE]
        ├── COMP-66: HealthModule
        └── COMP-86: Monitoring Stack
  └── CAP-40: Delivery and Quality Infrastructure [INFRASTRUCTURE]
        ├── COMP-87: Load Tests
        ├── COMP-88: CI/CD Workflows
        └── COMP-89: Docker Compose Orchestration

DOMAIN-17: Extended Operations and Driver Services [FUNCTIONAL | GROUNDED]
  └── CAP-41: Commercial Operations and Dispatch Services [SUPPORTING]
        ├── COMP-28: SurgePricingModule
        ├── COMP-29: DriverIncentivesModule
        ├── COMP-38: DriverMobileModule
        ├── COMP-47: GeofenceAutomationModule
        └── COMP-48: MessagingModule
  └── CAP-42: Customer and Ecosystem Services [SUPPORTING]
        ├── COMP-34: CrossBorderModule
        ├── COMP-35: PermitsModule
        ├── COMP-36: PartsMarketplaceModule
        ├── COMP-37: FleetLifecycleModule
        ├── COMP-40: CustomerPortalModule
        └── COMP-57: AftersalesModule
```

---

## Flat Index: Component → Capability → Domain (Reverse Lookup)

| Component | Capability | Domain |
|---|---|---|
| COMP-01: blueedge-platform (Monorepo) | CAP-29: Platform Monorepo Container | DOMAIN-10: Platform Infrastructure and Data |
| COMP-02: AuthModule | CAP-23: JWT Authentication | DOMAIN-09: Access Control and Identity |
| COMP-03: VehiclesModule | CAP-07: Core Fleet Asset Management | DOMAIN-03: Fleet Core Operations |
| COMP-04: DriversModule | CAP-08: Driver Management | DOMAIN-03: Fleet Core Operations |
| COMP-05: FleetsModule | CAP-07: Core Fleet Asset Management | DOMAIN-03: Fleet Core Operations |
| COMP-06: TripsModule | CAP-07: Core Fleet Asset Management | DOMAIN-03: Fleet Core Operations |
| COMP-07: AlertsModule | CAP-09: Alert and Notification Management | DOMAIN-03: Fleet Core Operations |
| COMP-08: MaintenanceModule | CAP-10: Maintenance and Fuel Operations | DOMAIN-03: Fleet Core Operations |
| COMP-09: FuelModule | CAP-10: Maintenance and Fuel Operations | DOMAIN-03: Fleet Core Operations |
| COMP-10: TankerModule | CAP-12: Fleet Type Verticals | DOMAIN-04: Fleet Vertical Extensions |
| COMP-11: BusModule | CAP-12: Fleet Type Verticals | DOMAIN-04: Fleet Vertical Extensions |
| COMP-12: TaxiModule | CAP-12: Fleet Type Verticals | DOMAIN-04: Fleet Vertical Extensions |
| COMP-13: OperationsModule | CAP-11: Operational Control and Device Management | DOMAIN-03: Fleet Core Operations |
| COMP-14: DevicesModule | CAP-11: Operational Control and Device Management | DOMAIN-03: Fleet Core Operations |
| COMP-15: NotificationsModule | CAP-09: Alert and Notification Management | DOMAIN-03: Fleet Core Operations |
| COMP-16: AnalyticsModule | CAP-14: Fleet Analytics and Reporting | DOMAIN-05: Analytics and Intelligence |
| COMP-17: ReportsModule | CAP-14: Fleet Analytics and Reporting | DOMAIN-05: Analytics and Intelligence |
| COMP-18: DiagnosticsModule | CAP-14: Fleet Analytics and Reporting | DOMAIN-05: Analytics and Intelligence |
| COMP-19: ComplianceModule | CAP-15: Compliance, Safety, and Finance Intelligence | DOMAIN-05: Analytics and Intelligence |
| COMP-20: SafetyModule | CAP-15: Compliance, Safety, and Finance Intelligence | DOMAIN-05: Analytics and Intelligence |
| COMP-21: FinanceModule | CAP-15: Compliance, Safety, and Finance Intelligence | DOMAIN-05: Analytics and Intelligence |
| COMP-22: UsersModule | CAP-08: Driver Management | DOMAIN-03: Fleet Core Operations |
| COMP-23: ColdchainModule | CAP-13: Specialty Transport Extensions | DOMAIN-04: Fleet Vertical Extensions |
| COMP-24: EvModule | CAP-36: EV Telemetry and Energy Management | DOMAIN-15: EV and Electrification |
| COMP-25: OtaModule | CAP-38: Device OTA Management | DOMAIN-15: EV and Electrification [cross-domain: DOMAIN-01] |
| COMP-26: V2gModule | CAP-36: EV Telemetry and Energy Management | DOMAIN-15: EV and Electrification |
| COMP-27: GatewaysModule | CAP-22: WebSocket Event Broadcasting | DOMAIN-08: Real-Time Streaming and Gateway |
| COMP-28: SurgePricingModule | CAP-41: Commercial Operations and Dispatch Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-29: DriverIncentivesModule | CAP-41: Commercial Operations and Dispatch Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-30: ElectrificationModule | CAP-37: Fleet Electrification Planning | DOMAIN-15: EV and Electrification |
| COMP-31: DepotChargingModule | CAP-37: Fleet Electrification Planning | DOMAIN-15: EV and Electrification |
| COMP-32: ExecutiveModule | CAP-16: Executive Intelligence and Data Monetization | DOMAIN-05: Analytics and Intelligence |
| COMP-33: AnomalyDetectionModule | CAP-17: Predictive and Anomaly Intelligence | DOMAIN-06: AI/ML Intelligence Layer |
| COMP-34: CrossBorderModule | CAP-42: Customer and Ecosystem Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-35: PermitsModule | CAP-42: Customer and Ecosystem Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-36: PartsMarketplaceModule | CAP-42: Customer and Ecosystem Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-37: FleetLifecycleModule | CAP-42: Customer and Ecosystem Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-38: DriverMobileModule | CAP-41: Commercial Operations and Dispatch Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-39: FatigueRiskModule | CAP-18: Driver Intelligence | DOMAIN-06: AI/ML Intelligence Layer |
| COMP-40: CustomerPortalModule | CAP-42: Customer and Ecosystem Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-41: BlockchainModule | CAP-16: Executive Intelligence and Data Monetization | DOMAIN-05: Analytics and Intelligence |
| COMP-42: WhiteLabelModule | CAP-32: Tenant Onboarding and Branding | DOMAIN-12: SaaS Platform Layer |
| COMP-43: ChargingStationsModule | CAP-36: EV Telemetry and Energy Management | DOMAIN-15: EV and Electrification |
| COMP-44: PredictiveMaintenanceModule | CAP-17: Predictive and Anomaly Intelligence | DOMAIN-06: AI/ML Intelligence Layer |
| COMP-45: DigitalTwinModule | CAP-17: Predictive and Anomaly Intelligence | DOMAIN-06: AI/ML Intelligence Layer |
| COMP-46: DriverScoringModule | CAP-18: Driver Intelligence | DOMAIN-06: AI/ML Intelligence Layer |
| COMP-47: GeofenceAutomationModule | CAP-41: Commercial Operations and Dispatch Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-48: MessagingModule | CAP-41: Commercial Operations and Dispatch Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-49: MultiTenantModule | CAP-31: Multi-Tenant Provisioning | DOMAIN-12: SaaS Platform Layer |
| COMP-50: BillingModule | CAP-31: Multi-Tenant Provisioning | DOMAIN-12: SaaS Platform Layer |
| COMP-51: OnboardingModule | CAP-32: Tenant Onboarding and Branding | DOMAIN-12: SaaS Platform Layer |
| COMP-52: NotificationProvidersModule | CAP-33: Notification Delivery Channels | DOMAIN-13: External Integration |
| COMP-53: ErpConnectorsModule | CAP-34: Enterprise System Integration | DOMAIN-13: External Integration |
| COMP-54: ApiMarketplaceModule | CAP-34: Enterprise System Integration | DOMAIN-13: External Integration |
| COMP-55: IntegrationHubModule | CAP-34: Enterprise System Integration | DOMAIN-13: External Integration |
| COMP-56: AgenticAIModule | CAP-19: Agentic AI and Road Intelligence | DOMAIN-06: AI/ML Intelligence Layer |
| COMP-57: AftersalesModule | CAP-42: Customer and Ecosystem Services | DOMAIN-17: Extended Operations and Driver Services |
| COMP-58: RoadIntelligenceModule | CAP-19: Agentic AI and Road Intelligence | DOMAIN-06: AI/ML Intelligence Layer |
| COMP-59: DataMonetizationModule | CAP-16: Executive Intelligence and Data Monetization | DOMAIN-05: Analytics and Intelligence |
| COMP-60: DriverSessionsModule | CAP-13: Specialty Transport Extensions | DOMAIN-04: Fleet Vertical Extensions |
| COMP-61: VehicleLifecycleModule | CAP-13: Specialty Transport Extensions | DOMAIN-04: Fleet Vertical Extensions |
| COMP-62: SensorsModule | CAP-20: Sensor Telemetry Ingestion | DOMAIN-07: Sensor and Security Ingestion |
| COMP-63: HasiModule | CAP-21: HASI Security Intelligence Ingestion | DOMAIN-07: Sensor and Security Ingestion |
| COMP-64: RedisCacheModule | CAP-27: Caching Layer | DOMAIN-10: Platform Infrastructure and Data |
| COMP-65: FleetEventsModule | CAP-30: Domain Event Bus | DOMAIN-11: Event-Driven Architecture |
| COMP-66: HealthModule | CAP-39: Platform Observability | DOMAIN-16: Operational Engineering |
| COMP-67: V2Module | CAP-25: API Versioning | DOMAIN-09: Access Control and Identity |
| COMP-68: Frontend Application | CAP-35: Operator Web Application | DOMAIN-14: Frontend Application |
| COMP-69: FleetSocket Client | CAP-22: WebSocket Event Broadcasting | DOMAIN-08: Real-Time Streaming and Gateway |
| COMP-70: AuthContext / AuthProvider | CAP-24: Frontend Auth State Management | DOMAIN-09: Access Control and Identity |
| COMP-71: Frontend Page Modules (61 pages) | CAP-35: Operator Web Application | DOMAIN-14: Frontend Application |
| COMP-72: SVG 2.0 Smart Vehicle Gateway | CAP-03: SVG Device Hardware Platform | DOMAIN-01: Edge Data Acquisition |
| COMP-73: sensor_collector.py | CAP-01: Vehicle Sensor Collection | DOMAIN-01: Edge Data Acquisition |
| COMP-74: hasi_bridge.py | CAP-02: Network Security Intelligence Collection | DOMAIN-01: Edge Data Acquisition |
| COMP-75: HASI v1.0.0 | CAP-02: Network Security Intelligence Collection | DOMAIN-01: Edge Data Acquisition |
| COMP-76: SVG Main Telemetry Firmware | CAP-01: Vehicle Sensor Collection | DOMAIN-01: Edge Data Acquisition |
| COMP-77: SVG OTA Agent [WEAKLY GROUNDED] | CAP-04: SVG Device Firmware Management | DOMAIN-01: Edge Data Acquisition |
| COMP-78: SVG Agent Configuration | CAP-01: Vehicle Sensor Collection | DOMAIN-01: Edge Data Acquisition |
| COMP-79: PostgreSQL 15 | CAP-26: Primary Data Persistence | DOMAIN-10: Platform Infrastructure and Data |
| COMP-80: TimescaleDB | CAP-26: Primary Data Persistence | DOMAIN-10: Platform Infrastructure and Data |
| COMP-81: Redis 7 | CAP-27: Caching Layer | DOMAIN-10: Platform Infrastructure and Data |
| COMP-82: S3 / MinIO Object Storage [WEAKLY GROUNDED] | CAP-28: Object Storage | DOMAIN-10: Platform Infrastructure and Data |
| COMP-83: MQTT Broker (EMQX) | CAP-05: MQTT Telemetry Transport | DOMAIN-02: Telemetry Transport and Messaging |
| COMP-84: Apache Kafka [WEAKLY GROUNDED] | CAP-06: Stream Processing Infrastructure | DOMAIN-02: Telemetry Transport and Messaging |
| COMP-85: Apache Flink [WEAKLY GROUNDED] | CAP-06: Stream Processing Infrastructure | DOMAIN-02: Telemetry Transport and Messaging |
| COMP-86: Monitoring Stack | CAP-39: Platform Observability | DOMAIN-16: Operational Engineering |
| COMP-87: Load Tests | CAP-40: Delivery and Quality Infrastructure | DOMAIN-16: Operational Engineering |
| COMP-88: CI/CD Workflows | CAP-40: Delivery and Quality Infrastructure | DOMAIN-16: Operational Engineering |
| COMP-89: Docker Compose Orchestration | CAP-40: Delivery and Quality Infrastructure | DOMAIN-16: Operational Engineering |

---

## Execution Path Cross-Reference

| Domain | Execution Paths |
|---|---|
| DOMAIN-01: Edge Data Acquisition | EP-01, EP-02, EP-07 |
| DOMAIN-02: Telemetry Transport and Messaging | EP-01, EP-02 |
| DOMAIN-03: Fleet Core Operations | EP-04, EP-05, EP-06, EP-08 |
| DOMAIN-04: Fleet Vertical Extensions | EP-04 |
| DOMAIN-05: Analytics and Intelligence | EP-04, EP-05 |
| DOMAIN-06: AI/ML Intelligence Layer | EP-06 |
| DOMAIN-07: Sensor and Security Ingestion | EP-01, EP-02, EP-05 |
| DOMAIN-08: Real-Time Streaming and Gateway | EP-01, EP-02, EP-05, EP-06 |
| DOMAIN-09: Access Control and Identity | EP-03, EP-04, EP-08 |
| DOMAIN-10: Platform Infrastructure and Data | EP-03, EP-04, EP-06, EP-07 |
| DOMAIN-11: Event-Driven Architecture | EP-01, EP-02, EP-05, EP-06 |
| DOMAIN-12: SaaS Platform Layer | EP-08 |
| DOMAIN-13: External Integration | EP-05 |
| DOMAIN-14: Frontend Application | EP-01, EP-02, EP-03, EP-04, EP-07, EP-08 |
| DOMAIN-15: EV and Electrification | EP-07 |
| DOMAIN-16: Operational Engineering | None (orthogonal support layer) |
| DOMAIN-17: Extended Operations and Driver Services | EP-04 |

| Capability | Execution Paths |
|---|---|
| CAP-01: Vehicle Sensor Collection | EP-01 |
| CAP-02: Network Security Intelligence Collection | EP-02 |
| CAP-03: SVG Device Hardware Platform | EP-01 (host context), EP-02 (host context) |
| CAP-04: SVG Device Firmware Management | EP-07 |
| CAP-05: MQTT Telemetry Transport | EP-01, EP-02 |
| CAP-06: Stream Processing Infrastructure | None (not traversed) |
| CAP-07: Core Fleet Asset Management | EP-04 |
| CAP-08: Driver Management | EP-03, EP-08 |
| CAP-09: Alert and Notification Management | EP-05, EP-08 |
| CAP-10: Maintenance and Fuel Operations | EP-06 |
| CAP-11: Operational Control and Device Management | EP-07 |
| CAP-12: Fleet Type Verticals | EP-04 |
| CAP-13: Specialty Transport Extensions | EP-04 |
| CAP-14: Fleet Analytics and Reporting | EP-04 |
| CAP-15: Compliance, Safety, and Finance Intelligence | EP-05 |
| CAP-16: Executive Intelligence and Data Monetization | EP-04 |
| CAP-17: Predictive and Anomaly Intelligence | EP-06 |
| CAP-18: Driver Intelligence | EP-04 |
| CAP-19: Agentic AI and Road Intelligence | EP-04 |
| CAP-20: Sensor Telemetry Ingestion | EP-01, EP-05 |
| CAP-21: HASI Security Intelligence Ingestion | EP-02, EP-05 |
| CAP-22: WebSocket Event Broadcasting | EP-01, EP-02, EP-05, EP-06 |
| CAP-23: JWT Authentication | EP-03, EP-04, EP-08 |
| CAP-24: Frontend Auth State Management | EP-03 |
| CAP-25: API Versioning | EP-04 |
| CAP-26: Primary Data Persistence | EP-01, EP-03, EP-04, EP-06, EP-08 |
| CAP-27: Caching Layer | EP-04, EP-05 |
| CAP-28: Object Storage | EP-07 |
| CAP-29: Platform Monorepo Container | All paths (structural host) |
| CAP-30: Domain Event Bus | EP-01, EP-02, EP-05, EP-06 |
| CAP-31: Multi-Tenant Provisioning | EP-08 |
| CAP-32: Tenant Onboarding and Branding | EP-08 |
| CAP-33: Notification Delivery Channels | EP-05 |
| CAP-34: Enterprise System Integration | EP-04 |
| CAP-35: Operator Web Application | EP-01, EP-02, EP-03, EP-04, EP-07, EP-08 |
| CAP-36: EV Telemetry and Energy Management | EP-04 |
| CAP-37: Fleet Electrification Planning | EP-04 |
| CAP-38: Device OTA Management | EP-07 |
| CAP-39: Platform Observability | None |
| CAP-40: Delivery and Quality Infrastructure | None |
| CAP-41: Commercial Operations and Dispatch Services | EP-04 |
| CAP-42: Customer and Ecosystem Services | EP-04 |
