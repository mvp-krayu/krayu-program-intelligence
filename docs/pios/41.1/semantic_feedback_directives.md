# Semantic Feedback Directives — BlueEdge Platform v3.23.0

**artifact_id:** PIOS-41.1-OUTPUT-06
**contract:** PIOS-41.1-RUN01-CONTRACT-v1
**mode:** SEMANTIC-CONSOLIDATION-STRICT
**run_reference:** run_03_blueedge_derivation_validation
**generated_from:** semantic_domain_model.md, capability_map.md, semantic_traceability_map.md, semantic_elevation_report.md
**date:** 2026-03-20

---

## Constraint

This file MAY NOT alter derivation outputs or retroactively reinterpret structure. All directives are forward-looking recommendations for future derivation runs or evidence enrichment activities.

---

## SFD-01 — WEAKLY GROUNDED: Apache Kafka and Apache Flink Not Confirmed in Source

| Field | Value |
|---|---|
| directive_id | SFD-01 |
| type | WEAK_GROUNDING_ALERT |
| priority | HIGH |
| affected_construct | CAP-06 (Stream Processing Infrastructure), DOMAIN-02 (Telemetry Transport and Messaging), COMP-84 (Apache Kafka), COMP-85 (Apache Flink) |

**description:**
Apache Kafka and Apache Flink are declared in the architecture HTML (EVID-ARCH section s1 layer 3) as critical infrastructure: a 15-broker Kafka cluster with 500 partitions handling 60M messages/second, and Apache Flink providing real-time CEP with a 1-second safety SLA. Neither component was confirmed by any extracted source file within the evidence boundary. Specifically: no package.json dependency, no configuration file, no docker-compose service definition, and no import in app.module.ts was found for either component. This creates a significant gap: if Kafka and Flink are real production infrastructure (as the architecture HTML claims), the relationship_map.md is missing edges that would connect them to SensorsModule, HasiModule, and the broader telemetry pipeline. EP-01 and EP-02 as currently modelled route through MQTT→SensorsModule/HasiModule directly, potentially bypassing a Kafka stream processing layer.

**recommended_action:**
In a future re-derivation run, extend the evidence boundary to include:
1. The full docker-compose.yml and docker-compose.monitoring.yml files (not just their existence confirmation)
2. Any kafka/ or flink/ configuration directories within the repository
3. The remaining sections of BlueEdge_Unified_Architecture_v3_23_0.html beyond the first 200 lines (sections s4–s16 were not read)
4. Backend package.json for KafkaJS, @nestjs/microservices, or similar Kafka client dependencies

If confirmed, Kafka and Flink would require new edges in the relationship_map and potential revision of EP-01 and EP-02 execution paths.

---

## SFD-02 — WEAKLY GROUNDED: S3/MinIO Object Storage Not Confirmed in Source

| Field | Value |
|---|---|
| directive_id | SFD-02 |
| type | WEAK_GROUNDING_ALERT |
| priority | HIGH |
| affected_construct | CAP-28 (Object Storage), DOMAIN-10 (Platform Infrastructure and Data), COMP-82 (S3/MinIO Object Storage) |

**description:**
S3/MinIO is declared in architecture HTML section s1 layer 5 as storing PCAP captures, OTA firmware packages, report exports, and data lake accumulation. No configuration file, AWS SDK dependency, or MinIO client reference was found in extracted source. OtaModule (R-040) references S3/MinIO for firmware storage, but this relationship has MEDIUM confidence because it derives from the architecture HTML rather than a confirmed code reference.

**recommended_action:**
In a future re-derivation run:
1. Read docker-compose.yml fully — MinIO is commonly declared there as a service
2. Search backend package.json for @aws-sdk/client-s3, minio, or similar object storage client dependencies
3. Check OtaModule source if accessible for explicit S3/storage references

If confirmed, this would upgrade COMP-82 and CAP-28 from WEAKLY GROUNDED to GROUNDED.

---

## SFD-03 — WEAKLY GROUNDED: SVG OTA Agent Source Not Found

| Field | Value |
|---|---|
| directive_id | SFD-03 |
| type | WEAK_GROUNDING_ALERT |
| priority | MEDIUM |
| affected_construct | CAP-04 (SVG Device Firmware Management), COMP-77 (SVG OTA Agent) |

**description:**
SVG OTA Agent is declared in architecture HTML section s2 as part of the on-device software stack. No corresponding source file was found in the svg-agents/ directory listing. The svg-agents/ directory contained only sensor-collector/ and hasi-bridge/ sub-directories. The OTA Agent may exist as a compiled binary, may be in a different repository, or may be a future component planned in the architecture but not yet implemented.

**recommended_action:**
1. Re-examine the svg-agents/ directory more thoroughly (if accessible) for any ota/ or update-agent/ sub-directory
2. Check if the OTA Agent is described in a separate repository outside the evidence boundary
3. If not found, consider annotating this component as PLANNED rather than WEAKLY_GROUNDED in a future derivation run

---

## SFD-04 — AMBIGUITY: Architecture HTML Read Boundary Was First 200 Lines Only

| Field | Value |
|---|---|
| directive_id | SFD-04 |
| type | AMBIGUITY |
| priority | HIGH |
| affected_construct | All components — potential completeness gap |

**description:**
The architecture document BlueEdge_Unified_Architecture_v3_23_0.html was read only for the first 200 lines (sections s1 and s2 confirmed, sections s3–s16 partially or not read). The derivation validation report (AC-03) explicitly notes this limitation: components in sections s4–s16 that are not corroborated by extracted source code are not included. The architecture HTML reportedly contains 16+ sections covering topics including AI/ML (s8), Blockchain (s9), and additional integration layers. This means the component model may be incomplete relative to what the architecture declares.

**recommended_action:**
In a future re-derivation run:
1. Read the full architecture HTML document (all sections s1–s16)
2. Map any additional components declared in sections s4–s16 to their source corroboration status
3. Pay particular attention to sections s4 (deployment topology), s5 (verticals), s6 (security), s8 (AI/ML pipeline details), s9 (blockchain architecture), and s10–s16 (remaining sections)

This is the highest-impact enrichment action available: the architecture document is a primary evidence source and its full content has not been consumed.

---

## SFD-05 — AMBIGUITY: OtaModule Cross-Domain Membership

| Field | Value |
|---|---|
| directive_id | SFD-05 |
| type | AMBIGUITY |
| priority | LOW |
| affected_construct | CAP-38 (Device OTA Management), DOMAIN-15 (EV and Electrification), COMP-25 (OtaModule) |

**description:**
OtaModule is assigned to DOMAIN-15 (EV and Electrification) based on its app.module.ts grouping with vertical extension modules (ColdchainModule, EvModule, V2gModule). However, its primary operational function is SVG device firmware management, which is more naturally co-located with DOMAIN-01 (Edge Data Acquisition). The cross-domain annotation resolves the immediate conflict, but the ambiguity reflects that the grouping in app.module.ts may reflect a historical development decision (OTA was added alongside EV features) rather than an operational cohesion.

**recommended_action:**
If OtaModule's source directory or test files are accessible in a future run, examine whether its dependencies and service calls are more aligned with EV modules or device management modules. This may provide grounds to reassign its primary domain from DOMAIN-15 to DOMAIN-01 or DOMAIN-03 (Fleet Core Operations via DevicesModule co-location). This is low priority as the current cross-domain annotation is functionally correct.

---

## SFD-06 — GAP: No Relationships Modelled for Extended Operations Modules

| Field | Value |
|---|---|
| directive_id | SFD-06 |
| type | GAP |
| priority | MEDIUM |
| affected_construct | DOMAIN-17 (Extended Operations and Driver Services), CAP-41, CAP-42 |

**description:**
The 11 components in DOMAIN-17 (SurgePricingModule, DriverIncentivesModule, GeofenceAutomationModule, MessagingModule, DriverMobileModule, CustomerPortalModule, AftersalesModule, CrossBorderModule, PermitsModule, PartsMarketplaceModule, FleetLifecycleModule) have no direct relationships modelled in relationship_map.md beyond the global AuthModule (R-013) and PostgreSQL (R-014) composite entries. This means their inter-module relationships, domain event emissions, and operational dependencies are unknown. They participate in EP-04 only as generic "domain module targets" without specific traversal detail.

**recommended_action:**
In a future re-derivation run, if source files for these modules are accessible:
1. Read their module files to identify imports and service injections
2. Look for FleetEventEmitter.emit() calls to identify their event participation
3. Assess if GeofenceAutomationModule emits domain events (likely), as geofence triggers are typically event-driven
4. Assess if SurgePricingModule depends on TripsModule or AlertsModule

This would meaningfully enrich relationship_map.md and execution_paths.md.

---

## SFD-07 — GAP: AI/ML Module Data Dependencies Not Fully Mapped

| Field | Value |
|---|---|
| directive_id | SFD-07 |
| type | GAP |
| priority | MEDIUM |
| affected_construct | DOMAIN-06 (AI/ML Intelligence Layer), CAP-17, CAP-18, CAP-19 |

**description:**
The AI/ML modules (AnomalyDetectionModule, PredictiveMaintenanceModule, DigitalTwinModule, FatigueRiskModule, DriverScoringModule, AgenticAIModule, RoadIntelligenceModule) have limited relationship evidence in relationship_map.md. EP-06 documents PredictiveMaintenanceModule's interaction with AnomalyDetectionModule and DigitalTwinModule, but the data input relationships for FatigueRiskModule (what sensor or HoS data does it consume?), DriverScoringModule (what telemetry streams does it score?), and AgenticAIModule (what does the agentic loop invoke?) are not modelled. The absence of these relationships leaves the AI/ML domain's internal coupling and data dependency structure opaque.

**recommended_action:**
In a future re-derivation run:
1. Read the modules/anomaly-detection/, modules/agentic-ai/ source directories (confirmed in file listing) to identify their TypeORM entity dependencies and service injections
2. Determine if FatigueRiskModule depends on TripsModule or DriverSessionsModule data
3. Determine if DriverScoringModule reads from SafetyModule or SensorsModule outputs
4. Map AgenticAIModule's invocation targets (what modules does it call autonomously?)

---

## SFD-08 — ENRICHMENT_REQUEST: Execution Paths EP-01b REST Fallback Not Fully Modelled

| Field | Value |
|---|---|
| directive_id | SFD-08 |
| type | ENRICHMENT_REQUEST |
| priority | LOW |
| affected_construct | EP-01 (Sensor Telemetry Ingest Path), CAP-01 (Vehicle Sensor Collection), CAP-20 (Sensor Telemetry Ingestion) |

**description:**
execution_paths.md documents EP-01b (REST fallback: sensor_collector.py calls POST /sensors/ingest directly if MQTT fails) as a note but does not model it as a complete execution path with its own component traversal sequence. The REST fallback skips MQTT Broker (COMP-83) and routes directly from sensor_collector.py to SensorsModule. This is a resilience-critical path that should be explicitly modelled as EP-01b in a future derivation run.

**recommended_action:**
In a future re-derivation run, model EP-01b as an explicit execution path with:
- trigger: MQTT failure condition (connection refused or timeout)
- components traversed: sensor_collector.py → SensorsModule (REST POST /sensors/ingest) → TimescaleDB → FleetEventsModule → [fan-out]
- relationship: R-002 is already in relationship_map.md; this path would use it as primary rather than fallback

---

## SFD-09 — ENRICHMENT_REQUEST: hasi_bridge.py Evidence Boundary Was First 80 Lines Only

| Field | Value |
|---|---|
| directive_id | SFD-09 |
| type | ENRICHMENT_REQUEST |
| priority | LOW |
| affected_construct | CAP-02 (Network Security Intelligence Collection), COMP-74 (hasi_bridge.py) |

**description:**
hasi_bridge.py was read for the first 80 lines only (out of a total file length not fully documented in the derivation). The first 80 lines confirmed configuration structure, MQTT settings, and polling interval. The main polling loop, SQLite query logic, IngestCaptureDto construction, and MQTT publish logic are described in the intent inference map but based on the first 80 lines plus architecture HTML, not from reading the full file directly.

**recommended_action:**
In a future re-derivation run, read hasi_bridge.py in full to:
1. Confirm the SQLite query structure and field mappings to IngestCaptureDto
2. Verify the SHA-256 deduplication mechanism in detail
3. Confirm the MQTT topic structure and payload format
4. Identify any additional cloud API endpoints called beyond /captures/ingest

This would upgrade COMP-74's relationship evidence from MEDIUM to HIGH for several entries.

---

## SFD-10 — ENRICHMENT_REQUEST: Frontend Page Module Granularity

| Field | Value |
|---|---|
| directive_id | SFD-10 |
| type | ENRICHMENT_REQUEST |
| priority | LOW |
| affected_construct | CAP-35 (Operator Web Application), COMP-71 (Frontend Page Modules) |

**description:**
Frontend Page Modules (COMP-71) is modelled as a single collective component representing 61 pages across 7 domain folders. The v3.23 additions (NetworkSecurityPage.tsx, SensorsPage.tsx) are noted. The individual page modules are not modelled as separate components. For PIE rendering at detailed granularity, individual page components could be added, particularly for the new v3.23 pages that correspond to new backend modules (SensorsModule, HasiModule).

**recommended_action:**
This is an optional enrichment. If fine-grained frontend capability mapping is required in a future run, read the individual page files in frontend/pages/ to:
1. Map each page to its primary backend module dependency
2. Identify which pages use WebSocket real-time updates (SensorsPage, NetworkSecurityPage confirmed)
3. Identify which pages are role-gated via RBAC

This would split COMP-71 into 61+ individual component entries, which may be appropriate for a frontend-focused analysis run.

---

## Directive Summary

| directive_id | type | priority | affected_construct |
|---|---|---|---|
| SFD-01 | WEAK_GROUNDING_ALERT | HIGH | Kafka, Flink — DOMAIN-02, CAP-06 |
| SFD-02 | WEAK_GROUNDING_ALERT | HIGH | S3/MinIO — DOMAIN-10, CAP-28 |
| SFD-03 | WEAK_GROUNDING_ALERT | MEDIUM | SVG OTA Agent — DOMAIN-01, CAP-04 |
| SFD-04 | AMBIGUITY | HIGH | Architecture HTML read boundary — all components |
| SFD-05 | AMBIGUITY | LOW | OtaModule cross-domain — DOMAIN-15, CAP-38 |
| SFD-06 | GAP | MEDIUM | DOMAIN-17 extended operations modules — no relationship evidence |
| SFD-07 | GAP | MEDIUM | DOMAIN-06 AI/ML data dependencies — incomplete relationship map |
| SFD-08 | ENRICHMENT_REQUEST | LOW | EP-01b REST fallback path — not fully modelled |
| SFD-09 | ENRICHMENT_REQUEST | LOW | hasi_bridge.py partial read — first 80 lines only |
| SFD-10 | ENRICHMENT_REQUEST | LOW | Frontend Page Modules — collective vs. granular modelling |

**Total directives: 10**
- HIGH priority: 3 (SFD-01, SFD-02, SFD-04)
- MEDIUM priority: 3 (SFD-03, SFD-06, SFD-07)
- LOW priority: 4 (SFD-05, SFD-08, SFD-09, SFD-10)
