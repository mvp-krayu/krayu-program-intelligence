# Executive Readability Map — BlueEdge Platform v3.23.0

> **Vault Navigation:** [← Explorer Map](../00_Map/Program_Intelligence_Explorer.md) | [PIE Index](../../pie_index.md)
> **Source:** PIOS-41.1-OUTPUT-07 | Rendered in PIE-RENDER-STRICT mode — content not modified

---

**artifact_id:** PIOS-41.1-OUTPUT-07 (OPTIONAL)
**contract:** PIOS-41.1-RUN01-CONTRACT-v1
**mode:** SEMANTIC-CONSOLIDATION-STRICT
**run_reference:** run_03_blueedge_derivation_validation
**generated_from:** semantic_domain_model.md, capability_map.md
**date:** 2026-03-20

---

**[EXECUTIVE VIEW — DERIVED FROM STRUCTURAL EVIDENCE]**

This map translates the structural findings into plain-language descriptions. Every statement below is grounded in semantic_domain_model.md and capability_map.md. No interpretation has been added beyond what the evidence supports.

---

## What BlueEdge Is (Platform-Level)

BlueEdge is a fleet management software platform that runs on proprietary vehicle hardware (the SVG 2.0 Smart Vehicle Gateway) and connects to a cloud-based application suite. It is built as a multi-tenant commercial service (SaaS) for fleet operators across taxi, tanker, bus, and electric vehicle contexts. The platform is hosted by Blue Edge Network LLC (Dubai) / SA (Geneva) as stated in the architecture document.

The platform has 89 confirmed or architecture-declared components organised into 17 operational domains and 42 discrete functional capabilities.

---

## The 17 Domains in Plain Language

### 1. Edge Data Acquisition
What the vehicle hardware collects and transmits. The SVG 2.0 device on each vehicle runs agents that continuously read engine and environmental sensors, and separately monitor all network traffic on the vehicle for security threats. Data is sent to the cloud every few seconds.

### 2. Telemetry Transport and Messaging
How sensor data moves from the vehicle to the cloud. The primary channel is an MQTT message broker (EMQX) using encrypted connections. A higher-throughput stream processing layer (Kafka and Flink) is described in the architecture but was not confirmed in extracted source code — marked as uncertain.

### 3. Fleet Core Operations
The foundational fleet management functions: tracking vehicles, managing drivers, organising fleets, recording trips, generating alerts, scheduling maintenance, and tracking fuel. These 11 components form the minimum viable platform — nothing else works without them.

### 4. Fleet Vertical Extensions
Industry-specific add-ons for tanker (HAZMAT chemical safety monitoring), bus (passenger information system integration), and taxi (dispatch and metering) operators, plus cold-chain temperature monitoring, driver session tracking, and full vehicle lifecycle management.

### 5. Analytics and Intelligence
Fleet-wide data analysis, scheduled and on-demand reports, vehicle diagnostic event processing, regulatory compliance tracking and audit evidence, safety scoring, financial cost management, executive KPI dashboards, blockchain-based audit trails, and data product monetisation.

### 6. AI/ML Intelligence Layer
Six AI-powered modules that analyse telemetry data to generate actionable results: anomaly detection in vehicle data, predictive maintenance scheduling, digital twin vehicle modelling, driver fatigue and Hours-of-Service risk assessment, composite driver behaviour scoring, autonomous task execution, and road condition intelligence.

### 7. Sensor and Security Ingestion (Cloud-Side)
The cloud-side processing components that receive vehicle sensor readings and network security threat data from the edge. New in platform version 3.23. SensorsModule evaluates HAZMAT alert thresholds. HasiModule enriches threat data with geographic and threat intelligence context.

### 8. Real-Time Streaming and Gateway
The live data channel between the platform and connected operator browser windows. When a sensor threshold is breached or a security threat is detected, this domain pushes the update to every connected dashboard within milliseconds via WebSocket.

### 9. Access Control and Identity
Authentication and access management across the entire platform. All 63 backend modules enforce JWT token verification. The frontend manages login state. API versioning governs how the platform exposes its capabilities to external callers.

### 10. Platform Infrastructure and Data
The databases and caching layer underpinning all modules: PostgreSQL 15 as the primary database (60+ tables), TimescaleDB for high-volume sensor time-series data, Redis for API response caching, and S3/MinIO for file storage (architecture-declared; confirmation pending). The monorepo container is also grouped here as the platform's structural root.

### 11. Event-Driven Architecture
A single but architecturally central component (FleetEventsModule) that acts as the internal message bus. When any domain module generates a significant event, this component routes it simultaneously to: the real-time dashboard, the cache invalidation service, the audit log, and the notification delivery system.

### 12. SaaS Platform Layer
The commercial packaging layer: multi-tenant data isolation so different fleet operators never see each other's data, subscription billing and invoicing, guided onboarding for new customers, and white-label branding for reseller deployments.

### 13. External Integration
Four integration modules that connect the platform to the outside enterprise ecosystem: email/SMS/push notification delivery, ERP system connectors (SAP, Oracle), a third-party API marketplace for developers, and a central integration orchestration hub.

### 14. Frontend Application
The operator-facing web application: a Progressive Web App with 61 pages, offline capability, mobile-responsive layout, RTL Arabic language support, and real-time live data displays. The v3.23 release added dedicated pages for sensor monitoring and network security.

### 15. EV and Electrification
Six modules covering electric vehicle battery telemetry, vehicle-to-grid energy management, public and private charging station networks, fleet electrification transition planning, depot charging capacity management, and over-the-air firmware update deployment to vehicle hardware.

### 16. Operational Engineering
The engineering infrastructure that keeps the platform running reliably: health check and Prometheus metrics endpoints, Grafana monitoring dashboards, API and WebSocket load testing scripts, GitHub Actions CI/CD pipelines, and Docker Compose container orchestration.

### 17. Extended Operations and Driver Services
Eleven modules covering the broader operational surface: surge pricing for rideshare, driver incentive programs, driver mobile companion app services, geofence rule automation, operator-driver messaging, customer self-service portal, OEM aftersales and warranty management, cross-border logistics compliance, vehicle and driver permits, vehicle parts marketplace, and full fleet asset lifecycle management.

---

## The 42 Capabilities in Summary

The 17 domains contain 42 capabilities — the specific functional units of the platform.

**Edge Data Acquisition (4 capabilities):**
- Vehicle sensor reading and cloud delivery
- Network security threat collection and forwarding
- Physical SVG 2.0 hardware device
- On-device firmware update agent (architecture-declared; confirmation pending)

**Telemetry Transport (2 capabilities):**
- MQTT encrypted message delivery
- High-throughput stream processing (architecture-declared; confirmation pending)

**Fleet Core Operations (5 capabilities):**
- Vehicle, fleet, and trip management
- Driver and user account management
- Alert generation and in-platform notifications
- Maintenance scheduling and fuel tracking
- Operational dispatch and device lifecycle management

**Fleet Vertical Extensions (2 capabilities):**
- Tanker, bus, and taxi industry modules
- Cold-chain, session management, and vehicle lifecycle

**Analytics and Intelligence (3 capabilities):**
- Fleet analytics, reports, and diagnostics
- Compliance, safety, and finance intelligence
- Executive dashboards, blockchain audit trails, and data monetisation

**AI/ML Intelligence (3 capabilities):**
- Predictive maintenance, anomaly detection, digital twin
- Driver fatigue detection and behaviour scoring
- Autonomous AI task execution and road intelligence

**Sensor and Security Ingestion (2 capabilities):**
- Cloud sensor data ingestion
- Cloud HASI network threat ingestion

**Real-Time Streaming and Gateway (1 capability):**
- WebSocket live event broadcasting to browsers

**Access Control and Identity (3 capabilities):**
- JWT authentication (backend)
- Frontend login state management
- API versioning

**Platform Infrastructure and Data (4 capabilities):**
- PostgreSQL and TimescaleDB persistence
- Redis caching
- Object storage (architecture-declared; confirmation pending)
- Platform monorepo container

**Event-Driven Architecture (1 capability):**
- Central domain event bus (4-handler fan-out)

**SaaS Platform Layer (2 capabilities):**
- Multi-tenant provisioning and billing
- Tenant onboarding and white-label branding

**External Integration (2 capabilities):**
- External notification delivery channels
- ERP connectors, API marketplace, and integration hub

**Frontend Application (1 capability):**
- 61-page operator web application

**EV and Electrification (3 capabilities):**
- EV battery, V2G, and charging stations
- Electrification planning and depot charging
- OTA firmware deployment to vehicles

**Operational Engineering (2 capabilities):**
- Platform observability (health, metrics, dashboards)
- CI/CD, container orchestration, and load testing

**Extended Operations and Driver Services (2 capabilities):**
- Commercial dispatch, geofencing, driver mobile, incentives, messaging
- Customer portal, aftersales, cross-border, permits, parts, fleet lifecycle

---

## Evidence Confidence Note

Of 89 platform components:
- 84.3% are confirmed directly from source code files read during the derivation
- 9.0% are derived from source code references or analysis documents
- 6.7% are declared in the architecture document but not yet confirmed in extracted source code (these are marked as WEAKLY GROUNDED throughout all artifacts)

The 4 weakly grounded components are: SVG OTA Agent, S3/MinIO Object Storage, Apache Kafka, and Apache Flink. Their existence in the architecture document is not disputed — they simply have not been confirmed by direct source code evidence within the current evidence boundary.

---

**[END EXECUTIVE VIEW]**
