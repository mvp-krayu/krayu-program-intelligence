#!/usr/bin/env python3
"""
build_semantic_layer.py
PIOS-41.1-ADDENDUM-SCRIPT-RECOVERY-v1

Deterministically reconstructs all 7 canonical docs/pios/41.1/ artifacts
from embedded data structures.

Output artifacts:
  1. semantic_domain_model.md       (PIOS-41.1-OUTPUT-01)
  2. capability_map.md              (PIOS-41.1-OUTPUT-02)
  3. semantic_traceability_map.md   (PIOS-41.1-OUTPUT-03)
  4. semantic_elevation_report.md   (PIOS-41.1-OUTPUT-04)
  5. pie_render_manifest.md         (PIOS-41.1-OUTPUT-05)
  6. semantic_feedback_directives.md (PIOS-41.1-OUTPUT-06)
  7. executive_readability_map.md   (PIOS-41.1-OUTPUT-07)

Usage:
  python3 build_semantic_layer.py                          # writes to /tmp/pios_41_1_output/
  python3 build_semantic_layer.py --output-dir /tmp/out
  python3 build_semantic_layer.py --output-dir docs/pios/41.1 --force --allow-canonical-write
"""

import argparse
import json
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Canonical data — embedded from docs/pios/41.1/
# ---------------------------------------------------------------------------

CONTRACT_ID = "PIOS-41.1-RUN01-CONTRACT-v1"
RUN_REFERENCE = "run_03_blueedge_derivation_validation"
DATE = "2026-03-20"
CANONICAL_PATH = "docs/pios/41.1"

# 17 Domains
DOMAINS = [
    {"id": "DOMAIN-01", "name": "Edge Data Acquisition",                         "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
    {"id": "DOMAIN-02", "name": "Telemetry Transport and Messaging",              "type": "INFRASTRUCTURE",  "grounding": "WEAKLY GROUNDED"},
    {"id": "DOMAIN-03", "name": "Fleet Core Operations",                          "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
    {"id": "DOMAIN-04", "name": "Fleet Vertical Extensions",                      "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
    {"id": "DOMAIN-05", "name": "Analytics and Intelligence",                     "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
    {"id": "DOMAIN-06", "name": "AI/ML Intelligence Layer",                       "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
    {"id": "DOMAIN-07", "name": "Sensor and Security Ingestion",                  "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
    {"id": "DOMAIN-08", "name": "Real-Time Streaming and Gateway",                "type": "OPERATIONAL",     "grounding": "GROUNDED"},
    {"id": "DOMAIN-09", "name": "Access Control and Identity",                    "type": "CROSS-CUTTING",   "grounding": "GROUNDED"},
    {"id": "DOMAIN-10", "name": "Platform Infrastructure and Data",               "type": "INFRASTRUCTURE",  "grounding": "WEAKLY GROUNDED"},
    {"id": "DOMAIN-11", "name": "Event-Driven Architecture",                      "type": "CROSS-CUTTING",   "grounding": "GROUNDED"},
    {"id": "DOMAIN-12", "name": "SaaS Platform Layer",                            "type": "OPERATIONAL",     "grounding": "GROUNDED"},
    {"id": "DOMAIN-13", "name": "External Integration",                           "type": "INTEGRATION",     "grounding": "GROUNDED"},
    {"id": "DOMAIN-14", "name": "Frontend Application",                           "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
    {"id": "DOMAIN-15", "name": "EV and Electrification",                         "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
    {"id": "DOMAIN-16", "name": "Operational Engineering",                        "type": "INFRASTRUCTURE",  "grounding": "GROUNDED"},
    {"id": "DOMAIN-17", "name": "Extended Operations and Driver Services",        "type": "FUNCTIONAL",      "grounding": "GROUNDED"},
]

# 42 Capabilities — id, name, domain, cap_type, weakly_grounded
CAPABILITIES = [
    {"id": "CAP-01", "name": "Vehicle Sensor Collection",                          "domain": "DOMAIN-01", "type": "CORE",           "weak": False},
    {"id": "CAP-02", "name": "Network Security Intelligence Collection",           "domain": "DOMAIN-01", "type": "CORE",           "weak": False},
    {"id": "CAP-03", "name": "SVG Device Hardware Platform",                       "domain": "DOMAIN-01", "type": "INFRASTRUCTURE", "weak": False},
    {"id": "CAP-04", "name": "SVG Device Firmware Management",                     "domain": "DOMAIN-01", "type": "SUPPORTING",     "weak": True},
    {"id": "CAP-05", "name": "MQTT Telemetry Transport",                           "domain": "DOMAIN-02", "type": "INFRASTRUCTURE", "weak": False},
    {"id": "CAP-06", "name": "Stream Processing Infrastructure",                   "domain": "DOMAIN-02", "type": "INFRASTRUCTURE", "weak": True},
    {"id": "CAP-07", "name": "Core Fleet Asset Management",                        "domain": "DOMAIN-03", "type": "CORE",           "weak": False},
    {"id": "CAP-08", "name": "Driver Management",                                  "domain": "DOMAIN-03", "type": "CORE",           "weak": False},
    {"id": "CAP-09", "name": "Alert and Notification Management",                  "domain": "DOMAIN-03", "type": "CORE",           "weak": False},
    {"id": "CAP-10", "name": "Maintenance and Fuel Operations",                    "domain": "DOMAIN-03", "type": "CORE",           "weak": False},
    {"id": "CAP-11", "name": "Operational Control and Device Management",          "domain": "DOMAIN-03", "type": "CORE",           "weak": False},
    {"id": "CAP-12", "name": "Fleet Type Verticals",                               "domain": "DOMAIN-04", "type": "CORE",           "weak": False},
    {"id": "CAP-13", "name": "Specialty Transport Extensions",                     "domain": "DOMAIN-04", "type": "SUPPORTING",     "weak": False},
    {"id": "CAP-14", "name": "Fleet Analytics and Reporting",                      "domain": "DOMAIN-05", "type": "CORE",           "weak": False},
    {"id": "CAP-15", "name": "Compliance, Safety, and Finance Intelligence",       "domain": "DOMAIN-05", "type": "CORE",           "weak": False},
    {"id": "CAP-16", "name": "Executive Intelligence and Data Monetization",       "domain": "DOMAIN-05", "type": "SUPPORTING",     "weak": False},
    {"id": "CAP-17", "name": "Predictive and Anomaly Intelligence",                "domain": "DOMAIN-06", "type": "CORE",           "weak": False},
    {"id": "CAP-18", "name": "Driver Intelligence",                                "domain": "DOMAIN-06", "type": "CORE",           "weak": False},
    {"id": "CAP-19", "name": "Agentic AI and Road Intelligence",                   "domain": "DOMAIN-06", "type": "ENABLING",       "weak": False},
    {"id": "CAP-20", "name": "Sensor Telemetry Ingestion",                         "domain": "DOMAIN-07", "type": "CORE",           "weak": False},
    {"id": "CAP-21", "name": "HASI Security Intelligence Ingestion",               "domain": "DOMAIN-07", "type": "CORE",           "weak": False},
    {"id": "CAP-22", "name": "WebSocket Event Broadcasting",                       "domain": "DOMAIN-08", "type": "CORE",           "weak": False},
    {"id": "CAP-23", "name": "JWT Authentication",                                 "domain": "DOMAIN-09", "type": "ENABLING",       "weak": False},
    {"id": "CAP-24", "name": "Frontend Auth State Management",                     "domain": "DOMAIN-09", "type": "ENABLING",       "weak": False},
    {"id": "CAP-25", "name": "API Versioning",                                     "domain": "DOMAIN-09", "type": "ENABLING",       "weak": False},
    {"id": "CAP-26", "name": "Primary Data Persistence",                           "domain": "DOMAIN-10", "type": "INFRASTRUCTURE", "weak": False},
    {"id": "CAP-27", "name": "Caching Layer",                                      "domain": "DOMAIN-10", "type": "INFRASTRUCTURE", "weak": False},
    {"id": "CAP-28", "name": "Object Storage",                                     "domain": "DOMAIN-10", "type": "INFRASTRUCTURE", "weak": True},
    {"id": "CAP-29", "name": "Platform Monorepo Container",                        "domain": "DOMAIN-10", "type": "INFRASTRUCTURE", "weak": False},
    {"id": "CAP-30", "name": "Domain Event Bus",                                   "domain": "DOMAIN-11", "type": "ENABLING",       "weak": False},
    {"id": "CAP-31", "name": "Multi-Tenant Provisioning",                          "domain": "DOMAIN-12", "type": "CORE",           "weak": False},
    {"id": "CAP-32", "name": "Tenant Onboarding and Branding",                     "domain": "DOMAIN-12", "type": "SUPPORTING",     "weak": False},
    {"id": "CAP-33", "name": "Notification Delivery Channels",                     "domain": "DOMAIN-13", "type": "SUPPORTING",     "weak": False},
    {"id": "CAP-34", "name": "Enterprise System Integration",                      "domain": "DOMAIN-13", "type": "ENABLING",       "weak": False},
    {"id": "CAP-35", "name": "Operator Web Application",                           "domain": "DOMAIN-14", "type": "CORE",           "weak": False},
    {"id": "CAP-36", "name": "EV Telemetry and Energy Management",                 "domain": "DOMAIN-15", "type": "CORE",           "weak": False},
    {"id": "CAP-37", "name": "Fleet Electrification Planning",                     "domain": "DOMAIN-15", "type": "SUPPORTING",     "weak": False},
    {"id": "CAP-38", "name": "Device OTA Management",                              "domain": "DOMAIN-15", "type": "SUPPORTING",     "weak": False},
    {"id": "CAP-39", "name": "Platform Observability",                             "domain": "DOMAIN-16", "type": "ENABLING",       "weak": False},
    {"id": "CAP-40", "name": "Delivery and Quality Infrastructure",                "domain": "DOMAIN-16", "type": "INFRASTRUCTURE", "weak": False},
    {"id": "CAP-41", "name": "Commercial Operations and Dispatch Services",        "domain": "DOMAIN-17", "type": "CORE",           "weak": False},
    {"id": "CAP-42", "name": "Customer and Ecosystem Services",                    "domain": "DOMAIN-17", "type": "SUPPORTING",     "weak": False},
]

# 89 Components — id, name, capability, cross_domain (optional), weak
COMPONENTS = [
    {"id": "COMP-01",  "name": "blueedge-platform (Monorepo)",         "cap": "CAP-29", "weak": False, "cross": None},
    {"id": "COMP-02",  "name": "AuthModule",                           "cap": "CAP-23", "weak": False, "cross": None},
    {"id": "COMP-03",  "name": "VehiclesModule",                       "cap": "CAP-07", "weak": False, "cross": None},
    {"id": "COMP-04",  "name": "DriversModule",                        "cap": "CAP-08", "weak": False, "cross": None},
    {"id": "COMP-05",  "name": "FleetsModule",                         "cap": "CAP-07", "weak": False, "cross": None},
    {"id": "COMP-06",  "name": "TripsModule",                          "cap": "CAP-07", "weak": False, "cross": None},
    {"id": "COMP-07",  "name": "AlertsModule",                         "cap": "CAP-09", "weak": False, "cross": None},
    {"id": "COMP-08",  "name": "MaintenanceModule",                    "cap": "CAP-10", "weak": False, "cross": None},
    {"id": "COMP-09",  "name": "FuelModule",                           "cap": "CAP-10", "weak": False, "cross": None},
    {"id": "COMP-10",  "name": "TankerModule",                         "cap": "CAP-12", "weak": False, "cross": None},
    {"id": "COMP-11",  "name": "BusModule",                            "cap": "CAP-12", "weak": False, "cross": None},
    {"id": "COMP-12",  "name": "TaxiModule",                           "cap": "CAP-12", "weak": False, "cross": None},
    {"id": "COMP-13",  "name": "OperationsModule",                     "cap": "CAP-11", "weak": False, "cross": None},
    {"id": "COMP-14",  "name": "DevicesModule",                        "cap": "CAP-11", "weak": False, "cross": None},
    {"id": "COMP-15",  "name": "NotificationsModule",                  "cap": "CAP-09", "weak": False, "cross": None},
    {"id": "COMP-16",  "name": "AnalyticsModule",                      "cap": "CAP-14", "weak": False, "cross": None},
    {"id": "COMP-17",  "name": "ReportsModule",                        "cap": "CAP-14", "weak": False, "cross": None},
    {"id": "COMP-18",  "name": "DiagnosticsModule",                    "cap": "CAP-14", "weak": False, "cross": None},
    {"id": "COMP-19",  "name": "ComplianceModule",                     "cap": "CAP-15", "weak": False, "cross": None},
    {"id": "COMP-20",  "name": "SafetyModule",                         "cap": "CAP-15", "weak": False, "cross": None},
    {"id": "COMP-21",  "name": "FinanceModule",                        "cap": "CAP-15", "weak": False, "cross": None},
    {"id": "COMP-22",  "name": "UsersModule",                          "cap": "CAP-08", "weak": False, "cross": None},
    {"id": "COMP-23",  "name": "ColdchainModule",                      "cap": "CAP-13", "weak": False, "cross": None},
    {"id": "COMP-24",  "name": "EvModule",                             "cap": "CAP-36", "weak": False, "cross": None},
    {"id": "COMP-25",  "name": "OtaModule",                            "cap": "CAP-38", "weak": False, "cross": "DOM-01"},
    {"id": "COMP-26",  "name": "V2gModule",                            "cap": "CAP-36", "weak": False, "cross": None},
    {"id": "COMP-27",  "name": "GatewaysModule",                       "cap": "CAP-22", "weak": False, "cross": None},
    {"id": "COMP-28",  "name": "SurgePricingModule",                   "cap": "CAP-41", "weak": False, "cross": None},
    {"id": "COMP-29",  "name": "DriverIncentivesModule",               "cap": "CAP-41", "weak": False, "cross": None},
    {"id": "COMP-30",  "name": "ElectrificationModule",                "cap": "CAP-37", "weak": False, "cross": None},
    {"id": "COMP-31",  "name": "DepotChargingModule",                  "cap": "CAP-37", "weak": False, "cross": None},
    {"id": "COMP-32",  "name": "ExecutiveModule",                      "cap": "CAP-16", "weak": False, "cross": None},
    {"id": "COMP-33",  "name": "AnomalyDetectionModule",               "cap": "CAP-17", "weak": False, "cross": None},
    {"id": "COMP-34",  "name": "CrossBorderModule",                    "cap": "CAP-42", "weak": False, "cross": None},
    {"id": "COMP-35",  "name": "PermitsModule",                        "cap": "CAP-42", "weak": False, "cross": None},
    {"id": "COMP-36",  "name": "PartsMarketplaceModule",               "cap": "CAP-42", "weak": False, "cross": None},
    {"id": "COMP-37",  "name": "FleetLifecycleModule",                 "cap": "CAP-42", "weak": False, "cross": None},
    {"id": "COMP-38",  "name": "DriverMobileModule",                   "cap": "CAP-41", "weak": False, "cross": None},
    {"id": "COMP-39",  "name": "FatigueRiskModule",                    "cap": "CAP-18", "weak": False, "cross": None},
    {"id": "COMP-40",  "name": "CustomerPortalModule",                 "cap": "CAP-42", "weak": False, "cross": None},
    {"id": "COMP-41",  "name": "BlockchainModule",                     "cap": "CAP-16", "weak": False, "cross": None},
    {"id": "COMP-42",  "name": "WhiteLabelModule",                     "cap": "CAP-32", "weak": False, "cross": None},
    {"id": "COMP-43",  "name": "ChargingStationsModule",               "cap": "CAP-36", "weak": False, "cross": None},
    {"id": "COMP-44",  "name": "PredictiveMaintenanceModule",          "cap": "CAP-17", "weak": False, "cross": None},
    {"id": "COMP-45",  "name": "DigitalTwinModule",                    "cap": "CAP-17", "weak": False, "cross": None},
    {"id": "COMP-46",  "name": "DriverScoringModule",                  "cap": "CAP-18", "weak": False, "cross": None},
    {"id": "COMP-47",  "name": "GeofenceAutomationModule",             "cap": "CAP-41", "weak": False, "cross": None},
    {"id": "COMP-48",  "name": "MessagingModule",                      "cap": "CAP-41", "weak": False, "cross": None},
    {"id": "COMP-49",  "name": "MultiTenantModule",                    "cap": "CAP-31", "weak": False, "cross": None},
    {"id": "COMP-50",  "name": "BillingModule",                        "cap": "CAP-31", "weak": False, "cross": None},
    {"id": "COMP-51",  "name": "OnboardingModule",                     "cap": "CAP-32", "weak": False, "cross": None},
    {"id": "COMP-52",  "name": "NotificationProvidersModule",          "cap": "CAP-33", "weak": False, "cross": None},
    {"id": "COMP-53",  "name": "ErpConnectorsModule",                  "cap": "CAP-34", "weak": False, "cross": None},
    {"id": "COMP-54",  "name": "ApiMarketplaceModule",                 "cap": "CAP-34", "weak": False, "cross": None},
    {"id": "COMP-55",  "name": "IntegrationHubModule",                 "cap": "CAP-34", "weak": False, "cross": None},
    {"id": "COMP-56",  "name": "AgenticAIModule",                      "cap": "CAP-19", "weak": False, "cross": None},
    {"id": "COMP-57",  "name": "AftersalesModule",                     "cap": "CAP-42", "weak": False, "cross": None},
    {"id": "COMP-58",  "name": "RoadIntelligenceModule",               "cap": "CAP-19", "weak": False, "cross": None},
    {"id": "COMP-59",  "name": "DataMonetizationModule",               "cap": "CAP-16", "weak": False, "cross": None},
    {"id": "COMP-60",  "name": "DriverSessionsModule",                 "cap": "CAP-13", "weak": False, "cross": None},
    {"id": "COMP-61",  "name": "VehicleLifecycleModule",               "cap": "CAP-13", "weak": False, "cross": None},
    {"id": "COMP-62",  "name": "SensorsModule",                        "cap": "CAP-20", "weak": False, "cross": None},
    {"id": "COMP-63",  "name": "HasiModule",                           "cap": "CAP-21", "weak": False, "cross": None},
    {"id": "COMP-64",  "name": "RedisCacheModule",                     "cap": "CAP-27", "weak": False, "cross": None},
    {"id": "COMP-65",  "name": "FleetEventsModule",                    "cap": "CAP-30", "weak": False, "cross": None},
    {"id": "COMP-66",  "name": "HealthModule",                         "cap": "CAP-39", "weak": False, "cross": None},
    {"id": "COMP-67",  "name": "V2Module (API Versioning)",            "cap": "CAP-25", "weak": False, "cross": None},
    {"id": "COMP-68",  "name": "Frontend Application",                 "cap": "CAP-35", "weak": False, "cross": None},
    {"id": "COMP-69",  "name": "FleetSocket Client",                   "cap": "CAP-22", "weak": False, "cross": None},
    {"id": "COMP-70",  "name": "AuthContext / AuthProvider",           "cap": "CAP-24", "weak": False, "cross": None},
    {"id": "COMP-71",  "name": "Frontend Page Modules (61 pages)",     "cap": "CAP-35", "weak": False, "cross": None},
    {"id": "COMP-72",  "name": "SVG 2.0 Smart Vehicle Gateway",        "cap": "CAP-03", "weak": False, "cross": None},
    {"id": "COMP-73",  "name": "sensor_collector.py",                  "cap": "CAP-01", "weak": False, "cross": None},
    {"id": "COMP-74",  "name": "hasi_bridge.py",                       "cap": "CAP-02", "weak": False, "cross": None},
    {"id": "COMP-75",  "name": "HASI v1.0.0",                          "cap": "CAP-02", "weak": False, "cross": None},
    {"id": "COMP-76",  "name": "SVG Main Telemetry Firmware",          "cap": "CAP-01", "weak": False, "cross": None},
    {"id": "COMP-77",  "name": "SVG OTA Agent",                        "cap": "CAP-04", "weak": True,  "cross": None},
    {"id": "COMP-78",  "name": "SVG Agent Configuration",              "cap": "CAP-01", "weak": False, "cross": None},
    {"id": "COMP-79",  "name": "PostgreSQL 15",                        "cap": "CAP-26", "weak": False, "cross": None},
    {"id": "COMP-80",  "name": "TimescaleDB",                          "cap": "CAP-26", "weak": False, "cross": None},
    {"id": "COMP-81",  "name": "Redis 7",                              "cap": "CAP-27", "weak": False, "cross": None},
    {"id": "COMP-82",  "name": "S3 / MinIO Object Storage",            "cap": "CAP-28", "weak": True,  "cross": None},
    {"id": "COMP-83",  "name": "MQTT Broker (EMQX)",                   "cap": "CAP-05", "weak": False, "cross": None},
    {"id": "COMP-84",  "name": "Apache Kafka",                         "cap": "CAP-06", "weak": True,  "cross": None},
    {"id": "COMP-85",  "name": "Apache Flink",                         "cap": "CAP-06", "weak": True,  "cross": None},
    {"id": "COMP-86",  "name": "Monitoring Stack",                     "cap": "CAP-39", "weak": False, "cross": None},
    {"id": "COMP-87",  "name": "Load Tests",                           "cap": "CAP-40", "weak": False, "cross": None},
    {"id": "COMP-88",  "name": "CI/CD Workflows",                      "cap": "CAP-40", "weak": False, "cross": None},
    {"id": "COMP-89",  "name": "Docker Compose Orchestration",         "cap": "CAP-40", "weak": False, "cross": None},
]

# 10 Feedback Directives
DIRECTIVES = [
    {"id": "SFD-01", "type": "WEAK_GROUNDING_ALERT",  "priority": "HIGH",   "affected": "CAP-06 (Stream Processing Infrastructure), DOMAIN-02 (Telemetry Transport and Messaging), COMP-84 (Apache Kafka), COMP-85 (Apache Flink)"},
    {"id": "SFD-02", "type": "WEAK_GROUNDING_ALERT",  "priority": "HIGH",   "affected": "CAP-28 (Object Storage), DOMAIN-10 (Platform Infrastructure and Data), COMP-82 (S3/MinIO Object Storage)"},
    {"id": "SFD-03", "type": "WEAK_GROUNDING_ALERT",  "priority": "MEDIUM", "affected": "CAP-04 (SVG Device Firmware Management), COMP-77 (SVG OTA Agent)"},
    {"id": "SFD-04", "type": "AMBIGUITY",              "priority": "HIGH",   "affected": "All components — potential completeness gap"},
    {"id": "SFD-05", "type": "AMBIGUITY",              "priority": "LOW",    "affected": "CAP-38 (Device OTA Management), DOMAIN-15 (EV and Electrification), COMP-25 (OtaModule)"},
    {"id": "SFD-06", "type": "GAP",                    "priority": "MEDIUM", "affected": "DOMAIN-17 (Extended Operations and Driver Services), CAP-41, CAP-42"},
    {"id": "SFD-07", "type": "GAP",                    "priority": "MEDIUM", "affected": "DOMAIN-06 (AI/ML Intelligence Layer), CAP-17, CAP-18, CAP-19"},
    {"id": "SFD-08", "type": "ENRICHMENT_REQUEST",     "priority": "LOW",    "affected": "EP-01 (Sensor Telemetry Ingest Path), CAP-01 (Vehicle Sensor Collection), CAP-20 (Sensor Telemetry Ingestion)"},
    {"id": "SFD-09", "type": "ENRICHMENT_REQUEST",     "priority": "LOW",    "affected": "CAP-02 (Network Security Intelligence Collection), COMP-74 (hasi_bridge.py)"},
    {"id": "SFD-10", "type": "ENRICHMENT_REQUEST",     "priority": "LOW",    "affected": "CAP-35 (Operator Web Application), COMP-71 (Frontend Page Modules)"},
]

# Build lookup maps
_cap_by_id = {c["id"]: c for c in CAPABILITIES}
_dom_by_id = {d["id"]: d for d in DOMAINS}

def _cap_domain(cap_id: str) -> str:
    """Return domain_id for a given capability_id."""
    return _cap_by_id[cap_id]["domain"]


# ---------------------------------------------------------------------------
# File generators
# ---------------------------------------------------------------------------

def build_semantic_domain_model() -> str:
    lines = [
        "# Semantic Domain Model — BlueEdge Platform v3.23.0",
        "",
        "**artifact_id:** PIOS-41.1-OUTPUT-01",
        f"**contract:** {CONTRACT_ID}",
        "**mode:** SEMANTIC-CONSOLIDATION-STRICT",
        f"**run_reference:** {RUN_REFERENCE}",
        "**generated_from:** component_model.md, relationship_map.md, execution_paths.md, intent_inference_map.md, program_execution_graph.md",
        f"**date:** {DATE}",
        "",
        "---",
        "",
        "## Domain Construction Rules Applied",
        "",
        "- Minimum 2 components per domain (single-component domains explicitly justified)",
        "- No domain overlap without cross-domain annotation",
        "- Domain names derived from evidence in component_model.md and intent_inference_map.md",
        "- Domain types: FUNCTIONAL | OPERATIONAL | INFRASTRUCTURE | INTEGRATION | CROSS-CUTTING",
        "- WEAKLY GROUNDED classification applied where components carry WEAKLY_GROUNDED or INFERRED status in structural_traceability_map.md",
        "",
        "---",
    ]

    # Group components by domain
    domain_comps: dict = {d["id"]: [] for d in DOMAINS}
    for comp in COMPONENTS:
        dom_id = _cap_domain(comp["cap"])
        domain_comps[dom_id].append(comp)

    for dom in DOMAINS:
        d_id = dom["id"]
        d_name = dom["name"]
        d_type = dom["type"]
        d_grounding = dom["grounding"]
        comps = domain_comps[d_id]
        caps_in_domain = [c for c in CAPABILITIES if c["domain"] == d_id]

        lines += [
            "",
            f"## {d_id} — {d_name}",
            "",
            "| Field | Value |",
            "|---|---|",
            f"| domain_id | {d_id} |",
            f"| domain_name | {d_name} |",
            f"| domain_type | {d_type} |",
            f"| grounding_status | {d_grounding} |",
        ]

        if d_grounding == "WEAKLY GROUNDED":
            lines += [
                "",
                "**grounding_justification:**",
                f"Domain is {d_grounding} due to weakly grounded components within its capabilities.",
            ]

        lines += [
            "",
            "**component_anchors:**",
        ]
        for comp in comps:
            flag = " [WEAKLY GROUNDED]" if comp["weak"] else ""
            cross = f" [cross-domain: {comp['cross']}]" if comp["cross"] else ""
            lines.append(f"- {comp['name']} ({comp['id']}){flag}{cross}")

        lines += [
            "",
            "**capability_anchors:**",
        ]
        for cap in caps_in_domain:
            flag = " [WEAKLY GROUNDED]" if cap["weak"] else ""
            lines.append(f"- {cap['id']}: {cap['name']}{flag}")

        lines.append("")
        lines.append("---")

    return "\n".join(lines) + "\n"


def build_capability_map() -> str:
    lines = [
        "# Capability Map — BlueEdge Platform v3.23.0",
        "",
        "**artifact_id:** PIOS-41.1-OUTPUT-02",
        f"**contract:** {CONTRACT_ID}",
        "**mode:** SEMANTIC-CONSOLIDATION-STRICT",
        f"**run_reference:** {RUN_REFERENCE}",
        "**generated_from:** semantic_domain_model.md, component_model.md, relationship_map.md, execution_paths.md",
        f"**date:** {DATE}",
        "",
        "---",
        "",
        "## Capability Construction Rules Applied",
        "",
        "- Minimum 1 component per capability (single-component capabilities justified)",
        "- Each capability belongs to exactly one domain (or annotated cross-domain)",
        "- Capability names derived strictly from evidence — no invented operational meaning",
        "- Capability types: CORE | SUPPORTING | ENABLING | INFRASTRUCTURE",
        "",
        "---",
    ]

    # Group components by capability
    cap_comps: dict = {c["id"]: [] for c in CAPABILITIES}
    for comp in COMPONENTS:
        cap_comps[comp["cap"]].append(comp)

    for cap in CAPABILITIES:
        c_id = cap["id"]
        c_name = cap["name"]
        dom_id = cap["domain"]
        dom_name = _dom_by_id[dom_id]["name"]
        c_type = cap["type"]
        c_grounding = "WEAKLY GROUNDED" if cap["weak"] else "GROUNDED"
        members = cap_comps[c_id]
        flag_suffix = " [WEAKLY GROUNDED]" if cap["weak"] else ""

        lines += [
            "",
            f"## {c_id} — {c_name}{flag_suffix}",
            "",
            "| Field | Value |",
            "|---|---|",
            f"| capability_id | {c_id} |",
            f"| capability_name | {c_name} |",
            f"| parent_domain | {dom_id} ({dom_name}) |",
            f"| capability_type | {c_type} |",
            f"| grounding_status | {c_grounding} |",
            "",
            "**component_members:**",
        ]
        for comp in members:
            comp_flag = " [WEAKLY GROUNDED]" if comp["weak"] else ""
            cross = f" [cross-domain: {comp['cross']}]" if comp["cross"] else ""
            lines.append(f"- {comp['name']} ({comp['id']}){comp_flag}{cross}")

        if len(members) == 1:
            lines += [
                "",
                "**single_component_justification:**",
                f"Single-component capability justified by the distinct operational role of {members[0]['name']} within the platform architecture.",
            ]

        lines.append("")
        lines.append("---")

    return "\n".join(lines) + "\n"


def build_semantic_traceability_map() -> str:
    lines = [
        "# Semantic Traceability Map — BlueEdge Platform v3.23.0",
        "",
        "**artifact_id:** PIOS-41.1-OUTPUT-03",
        f"**contract:** {CONTRACT_ID}",
        "**mode:** SEMANTIC-CONSOLIDATION-STRICT",
        f"**run_reference:** {RUN_REFERENCE}",
        "**generated_from:** semantic_domain_model.md, capability_map.md, component_model.md, structural_traceability_map.md",
        f"**date:** {DATE}",
        "",
        "---",
        "",
        "## Traceability Basis Definitions",
        "",
        "| Basis | Definition |",
        "|---|---|",
        "| DIRECT_EVIDENCE | Component confirmed by reading actual source file; capability/domain assignment is unambiguous |",
        "| DERIVED | Component derived from secondary artifact (analysis doc, architecture HTML reference by code); assignment follows from that derivation |",
        "| INFERRED | Component inferred from architecture HTML only; assignment to domain/capability follows structural positioning |",
        "",
        "---",
        "",
        "## Full Component Traceability Registry",
    ]

    for comp in COMPONENTS:
        c_id = comp["id"]
        c_name = comp["name"]
        cap_id = comp["cap"]
        cap_name = _cap_by_id[cap_id]["name"]
        dom_id = _cap_domain(cap_id)
        dom_name = _dom_by_id[dom_id]["name"]
        basis = "INFERRED" if comp["weak"] else "DIRECT_EVIDENCE"

        lines += [
            "",
            f"### {c_id} — {c_name}",
            "",
            "| Field | Value |",
            "|---|---|",
            f"| component_id | {c_id} |",
            f"| component_name | {c_name} |",
            f"| assigned_capability | {cap_id} ({cap_name}) |",
            f"| assigned_domain | {dom_id} ({dom_name}) |",
            f"| traceability_basis | {basis} |",
        ]

    return "\n".join(lines) + "\n"


def build_semantic_elevation_report() -> str:
    weak_comps = [c for c in COMPONENTS if c["weak"]]
    weak_caps = [c for c in CAPABILITIES if c["weak"]]
    weak_doms = [d for d in DOMAINS if d["grounding"] == "WEAKLY GROUNDED"]

    cap_type_dist: dict = {}
    for cap in CAPABILITIES:
        cap_type_dist[cap["type"]] = cap_type_dist.get(cap["type"], 0) + 1

    dom_type_dist: dict = {}
    for dom in DOMAINS:
        dom_type_dist[dom["type"]] = dom_type_dist.get(dom["type"], 0) + 1

    lines = [
        "# Semantic Elevation Report — BlueEdge Platform v3.23.0",
        "",
        "**artifact_id:** PIOS-41.1-OUTPUT-04",
        f"**contract:** {CONTRACT_ID}",
        "**mode:** SEMANTIC-CONSOLIDATION-STRICT",
        f"**run_reference:** {RUN_REFERENCE}",
        "**generated_from:** semantic_domain_model.md, capability_map.md, semantic_traceability_map.md, component_model.md, relationship_map.md, execution_paths.md",
        f"**date:** {DATE}",
        "",
        "---",
        "",
        "## 1. Input Structural Counts",
        "",
        "These counts are taken directly from the derivation bundle artifacts (component_model.md, relationship_map.md, execution_paths.md).",
        "",
        "| Structural Element | Count |",
        "|---|---|",
        "| Components | 89 |",
        "| Relationships | 41 records (composite R-013 covers 63 module→auth edges) |",
        "| Execution paths | 8 |",
        "| PEG nodes | 87 (note: PEG excludes 2 components not directly represented as individual nodes in PEG — all 89 components are covered) |",
        "| PEG edges | 40 distinct edge records |",
        "",
        "**Structural grounding distribution:**",
        "- DIRECT_EVIDENCE components: 75 (84.3%)",
        "- DERIVED components: 8 (9.0%)",
        "- INFERRED / WEAKLY_GROUNDED components: 6 (6.7%)",
        "",
        "---",
        "",
        "## 2. Output Semantic Counts",
        "",
        "| Semantic Element | Count |",
        "|---|---|",
        f"| Domains | {len(DOMAINS)} |",
        f"| Capabilities | {len(CAPABILITIES)} |",
        "",
        "**Domain type distribution:**",
        "| Domain Type | Count |",
        "|---|---|",
    ]

    for dt, count in sorted(dom_type_dist.items()):
        dom_ids = ", ".join(d["id"] for d in DOMAINS if d["type"] == dt)
        lines.append(f"| {dt} | {count} ({dom_ids}) |")

    lines += [
        "",
        "Note: DOMAIN-17 is FUNCTIONAL giving 9 FUNCTIONAL total. Recount below confirms:",
        "- FUNCTIONAL: DOMAIN-01, DOMAIN-03, DOMAIN-04, DOMAIN-05, DOMAIN-06, DOMAIN-07, DOMAIN-14, DOMAIN-15, DOMAIN-17 = 9",
        "- OPERATIONAL: DOMAIN-08, DOMAIN-12 = 2",
        "- INFRASTRUCTURE: DOMAIN-02, DOMAIN-10, DOMAIN-16 = 3",
        "- INTEGRATION: DOMAIN-13 = 1",
        "- CROSS-CUTTING: DOMAIN-09, DOMAIN-11 = 2",
        "- **Total: 17**",
        "",
        "**Capability type distribution:**",
        "| Capability Type | Count |",
        "|---|---|",
    ]

    for ct in ["CORE", "SUPPORTING", "ENABLING", "INFRASTRUCTURE"]:
        lines.append(f"| {ct} | {cap_type_dist.get(ct, 0)} |")
    lines.append(f"| **Total** | **{len(CAPABILITIES)}** |")

    lines += [
        "",
        "---",
        "",
        "## 3. Elevation Ratios",
        "",
        "### Components → Capabilities",
        "",
        f"- Input: {len(COMPONENTS)} components",
        f"- Output: {len(CAPABILITIES)} capabilities",
        f"- **Elevation ratio: {len(COMPONENTS)}:{len(CAPABILITIES)} = 2.12:1**",
        "- Interpretation: On average, each capability represents 2.12 components. This ratio reflects a genuine consolidation of structurally related components into operationally coherent units, without extreme over-compression or under-compression.",
        "",
        "### Components → Domains",
        "",
        f"- Input: {len(COMPONENTS)} components",
        f"- Output: {len(DOMAINS)} domains",
        f"- **Elevation ratio: {len(COMPONENTS)}:{len(DOMAINS)} = 5.24:1**",
        "- Interpretation: On average, each domain groups 5.24 components. Domain sizes range from 1 (DOMAIN-07 Sensor Ingestion — 2 components; DOMAIN-08 — 2 components; DOMAIN-11 — 1 component) to 11 (DOMAIN-03, DOMAIN-17). This spread reflects genuine structural variation in the source system, not inconsistent abstraction.",
        "",
        "### Capabilities → Domains",
        "",
        f"- **Elevation ratio: {len(CAPABILITIES)}:{len(DOMAINS)} = 2.47:1**",
        "- Interpretation: On average, each domain contains 2.47 capabilities. Domains range from 1 capability (DOMAIN-07, DOMAIN-08, DOMAIN-11, DOMAIN-14) to 5 capabilities (DOMAIN-03). Again reflecting genuine structural variation.",
        "",
        "---",
        "",
        "## 4. Coherence Assessment per Domain",
        "",
        "| Domain | Coherence Assessment | Basis |",
        "|---|---|---|",
        "| DOMAIN-01 Edge Data Acquisition | HIGH — 4 capabilities tightly bound by edge execution context | Components share the SVG 2.0 physical host and edge-to-cloud data flow (EP-01, EP-02) |",
        "| DOMAIN-02 Telemetry Transport and Messaging | MEDIUM — MQTT well-grounded; Kafka/Flink weakly grounded. Split between confirmed and architecture-only components reduces coherence confidence | MQTT confirmed in source; Kafka/Flink architecture HTML only |",
        "| DOMAIN-03 Fleet Core Operations | HIGH — 5 capabilities unified by app.module.ts session comment \"Core domains (7 modules, 66 endpoints)\" and foundational data dependency | 11 components form the minimum viable platform per IIM-03b |",
        "| DOMAIN-04 Fleet Vertical Extensions | HIGH — 2 capabilities sharing fleet-type-specific operational purpose | Both session comment and EVID-ARCH section s5 confirm vertical grouping |",
        "| DOMAIN-05 Analytics and Intelligence | HIGH — 3 capabilities all consuming fleet data for reporting and intelligence | Unified by data consumption pattern; all depend on PostgreSQL |",
        "| DOMAIN-06 AI/ML Intelligence Layer | HIGH — 3 capabilities all classified AI/ML in app.module.ts session comment and IIM-04 | 7 modules explicitly grouped as Advanced Features / AI/ML layer |",
        "| DOMAIN-07 Sensor and Security Ingestion | HIGH — 2 single-component capabilities forming parallel ingestion pipelines for distinct data streams | SensorsModule and HasiModule are v3.23 additions with parallel architectural roles |",
        "| DOMAIN-08 Real-Time Streaming and Gateway | HIGH — 2-component domain with direct relationship evidence (R-021, R-025) | GatewaysModule and FleetSocket Client form an explicitly evidenced WebSocket channel |",
        "| DOMAIN-09 Access Control and Identity | HIGH — JWT backend auth, frontend auth state, and API versioning unified by platform access governance | R-013 confirms global auth application; IIM-03a confirms non-optional enforcement |",
        "| DOMAIN-10 Platform Infrastructure and Data | MEDIUM — 5 components grounded; S3/MinIO weakly grounded. Otherwise structurally coherent persistence/cache layer | 4 capabilities cover data, cache, object storage, and monorepo container |",
        "| DOMAIN-11 Event-Driven Architecture | HIGH — single-component domain with 8 relationship anchors, justified by global event bus role | FleetEventsModule is the sole global event router; CROSS-CUTTING tier confirms its unique status |",
        "| DOMAIN-12 SaaS Platform Layer | HIGH — 2 capabilities explicitly unified by app.module.ts \"Session 23: Multi-Tenant SaaS\" comment | IIM-06 confirms SaaS commercial packaging as explicit intent |",
        "| DOMAIN-13 External Integration | HIGH — 2 capabilities explicitly unified by app.module.ts \"Session 24: Integration Layer\" comment | IIM-07 confirms enterprise integration intent |",
        "| DOMAIN-14 Frontend Application | HIGH — 2-component domain with direct React SPA evidence; both components are confirmed frontend artifacts | COMP-68 and COMP-71 represent the operator-facing web surface |",
        "| DOMAIN-15 EV and Electrification | MEDIUM — 3 capabilities are coherent EV groupings; OtaModule placement is cross-domain justified but slightly reduces grouping clarity | app.module.ts vertical extension grouping supports EV cluster; OtaModule cross-domain annotation is explicit |",
        "| DOMAIN-16 Operational Engineering | HIGH — 2 capabilities covering observability and delivery infrastructure; confirmed file evidence for all 5 components | R-036/R-037 confirm observability coupling; IIM-09 confirms engineering maturity intent |",
        "| DOMAIN-17 Extended Operations and Driver Services | MEDIUM — 11 components across 2 capabilities grouped by operational adjacency rather than a single unifying session comment | Individual module confirmations are strong; grouping rationale is operational adjacency rather than a single explicit evidence cluster |",
        "",
        "---",
        "",
        "## 5. Weak Grounding Inventory",
        "",
        "| Construct | Type | Weak Grounding Reason | Affected Domain | Affected Capability |",
        "|---|---|---|---|---|",
        "| COMP-77 SVG OTA Agent | Component | Architecture HTML section s2 only; no source file in svg-agents/ directory | DOMAIN-01 | CAP-04 |",
        "| COMP-82 S3/MinIO Object Storage | Component | Architecture HTML section s1 layer 5 only; no config file read | DOMAIN-10 | CAP-28 |",
        "| COMP-84 Apache Kafka | Component | Architecture HTML section s1 layer 3 only; no package.json dependency | DOMAIN-02 | CAP-06 |",
        "| COMP-85 Apache Flink | Component | Architecture HTML section s1 layer 3 only; no package.json dependency | DOMAIN-02 | CAP-06 |",
        "| DOMAIN-02 Telemetry Transport and Messaging | Domain | Two of three components (COMP-84, COMP-85) are WEAKLY_GROUNDED | DOMAIN-02 | CAP-05 (grounded), CAP-06 (weakly grounded) |",
        "| DOMAIN-10 Platform Infrastructure and Data | Domain | One of six components (COMP-82) is WEAKLY_GROUNDED | DOMAIN-10 | CAP-28 (weakly grounded) |",
        "| CAP-04 SVG Device Firmware Management | Capability | Sole component (COMP-77) is WEAKLY_GROUNDED | DOMAIN-01 | — |",
        "| CAP-06 Stream Processing Infrastructure | Capability | Both components (COMP-84, COMP-85) are WEAKLY_GROUNDED | DOMAIN-02 | — |",
        "| CAP-28 Object Storage | Capability | Sole component (COMP-82) is WEAKLY_GROUNDED | DOMAIN-10 | — |",
        "",
        f"**Total weakly grounded components: {len(weak_comps)}**",
        f"**Total weakly grounded capabilities: {len(weak_caps)}**",
        f"**Total weakly grounded domains: {len(weak_doms)}**",
        f"**Proportion of weakly grounded components: {len(weak_comps)}/{len(COMPONENTS)} = 4.5%**",
        "",
        "---",
        "",
        "## 6. Abstraction Quality Assessment",
        "",
        "### Abstraction Criteria",
        "",
        "**Criterion 1 — No invented meaning:** All 17 domain names and 42 capability names are derived from evidence in component_model.md session comments, intent_inference_map.md, or explicit source code patterns. Zero domain or capability names introduce operational meaning not present in the derivation bundle.",
        "",
        "**Criterion 2 — Grouping coherence:** 14 of 17 domains are rated HIGH coherence. 3 domains (DOMAIN-02, DOMAIN-10, DOMAIN-15, DOMAIN-17) are rated MEDIUM due to partial evidence gaps or cross-domain membership, not due to invented groupings.",
        "",
        "**Criterion 3 — Evidence-to-abstraction fidelity:** The session comment structure in app.module.ts provided direct grouping signals for: Core domains (DOMAIN-03), Fleet verticals (DOMAIN-04), Analytics (DOMAIN-05), Advanced Features/AI (DOMAIN-06), SaaS (DOMAIN-12), and Integration (DOMAIN-13). This means 6 of the 17 domains map directly to explicit session groupings in the canonical source module registry.",
        "",
        "**Criterion 4 — Single-component domains and capabilities:** Domains DOMAIN-07 (2 components), DOMAIN-08 (2 components), DOMAIN-11 (1 component), DOMAIN-14 (2 components) have small or single-component populations. All are explicitly justified: DOMAIN-11 by FleetEventsModule's unique cross-cutting event bus role with 8 relationship anchors.",
        "",
        "**Criterion 5 — Elevation without loss:** The semantic layer introduces 17 domains and 42 capabilities as grouping constructs. All 89 source components remain individually traceable through the semantic layer — no component information is lost or merged. The elevation adds grouping without collapsing component identity.",
        "",
        "**Assessment: GOOD quality.** The abstraction is evidence-grounded, coherent, and maintains full downward traceability.",
        "",
        "---",
        "",
        "## 7. Semantic Conflicts Detected",
        "",
        "A semantic conflict is defined as: a case where two or more semantic constructs make mutually contradictory claims about the same structural component, relationship, or execution path.",
        "",
        "**Conflict scan result: 1 identified — managed via cross-domain annotation.**",
        "",
        "### SC-01 — OtaModule Domain Membership",
        "",
        "| Field | Value |",
        "|---|---|",
        "| conflict_id | SC-01 |",
        "| component | OtaModule (COMP-25) |",
        "| conflict_description | OtaModule's execution target (SVG OTA Agent, COMP-77) is in DOMAIN-01 (Edge Data Acquisition). OtaModule itself is grouped with vertical extensions in app.module.ts lines 55–58, supporting assignment to DOMAIN-15 (EV and Electrification). These two signals point to different parent domains. |",
        "| resolution | OtaModule is assigned to DOMAIN-15 as its primary domain, consistent with app.module.ts vertical extension grouping. A cross-domain annotation explicitly records its execution connection to DOMAIN-01. No structural information is lost. Both capability assignments are recorded. |",
        "| status | RESOLVED via cross-domain annotation |",
        "",
        "**No unresolved semantic conflicts exist.**",
        "",
        "---",
        "",
        "## 8. Elevation Integrity Verdict",
        "",
        "### Verification Checklist",
        "",
        "| Check | Result |",
        "|---|---|",
        "| Every domain in semantic_domain_model has at least 1 component from component_model.md | PASS — 17/17 domains have component anchors |",
        "| Every capability in capability_map has a parent_domain in semantic_domain_model | PASS — 42/42 capabilities have valid parent_domain |",
        "| Every component in component_model appears in semantic_traceability_map | PASS — 89/89 components classified |",
        "| No semantic construct invented without structural anchor | PASS — 0 invented constructs |",
        "| Weakly grounded constructs explicitly marked | PASS — 4 components, 3 capabilities, 2 domains marked |",
        "| Semantic conflicts identified and resolved | PASS — 1 conflict identified and resolved |",
        "| 100% of components assigned to a capability | PASS — 89/89 |",
        "| 100% of components assigned to a domain | PASS — 89/89 |",
        "| No orphan semantic constructs | PASS — 0 orphans |",
        "| No narrative drift (no invented business storytelling) | PASS — all descriptions bounded to evidence in derivation bundle |",
        "",
        "### Elevation Integrity Verdict",
        "",
        "**VERIFIED**",
        "",
        "The semantic consolidation layer is complete, grounded, coherent, and fully traceable in both directions. All 89 source components from the derivation bundle are elevated into the semantic layer without loss, invention, or unresolved conflict. The 4 weakly grounded components (4.5% of total) are explicitly marked and do not compromise the overall integrity of the 95.5% strongly grounded semantic model.",
    ]

    return "\n".join(lines) + "\n"


def build_pie_render_manifest() -> str:
    lines = [
        "# PIE Render Manifest — BlueEdge Platform v3.23.0",
        "",
        "**artifact_id:** PIOS-41.1-OUTPUT-05",
        "**manifest_id:** PIE-MANIFEST-BLUEEDGE-v3.23-RUN03-R01",
        f"**contract:** {CONTRACT_ID}",
        "**mode:** SEMANTIC-CONSOLIDATION-STRICT",
        f"**run_reference:** {RUN_REFERENCE}",
        "**generated_from:** semantic_domain_model.md, capability_map.md, semantic_traceability_map.md",
        f"**date:** {DATE}",
        "",
        "---",
        "",
        "## Manifest Construction Rule",
        "",
        "All nodes and links in this manifest must exist in semantic_domain_model.md or capability_map.md. No node or link outside what is grounded in those artifacts is permitted. Weakly grounded components are render-eligible with an explicit flag.",
        "",
        "---",
        "",
        "## Rendering Rules Declared",
        "",
        "| Rule ID | Rule | Value |",
        "|---|---|---|",
        "| RR-01 | Maximum render depth | 3 levels (DOMAIN → CAPABILITY → COMPONENT) |",
        "| RR-02 | Default collapse level | Collapse to CAPABILITY level by default; expand to COMPONENT on demand |",
        "| RR-03 | WEAKLY GROUNDED node rendering | Render eligible but visually flagged (e.g., dashed border or asterisk marker) |",
        "| RR-04 | Cross-domain components | Render in primary domain; cross-domain annotation displayed as link overlay |",
        "| RR-05 | Single-component capabilities | Render eligible; no collapse to domain level without user action |",
        "| RR-06 | Composite relationship entries | Render as single labelled aggregated link (e.g., \"63 modules → AuthModule\" shown as one edge) |",
        "| RR-07 | Execution path overlay | EP-01 through EP-08 available as optional overlay; path traversal highlights node traversal sequence |",
        "",
        "---",
        "",
        "## Node Inventory",
        "",
        f"### DOMAIN Nodes ({len(DOMAINS)} nodes)",
        "",
        "| node_id | node_type | label | parent | render_eligible | reason_if_false |",
        "|---|---|---|---|---|---|",
    ]

    for dom in DOMAINS:
        n = dom["id"].replace("DOMAIN-", "N-DOM-")
        lines.append(f"| {n} | DOMAIN | {dom['name']} | — | true | — |")

    lines += [
        "",
        f"### CAPABILITY Nodes ({len(CAPABILITIES)} nodes)",
        "",
        "| node_id | node_type | label | parent | render_eligible | reason_if_false |",
        "|---|---|---|---|---|---|",
    ]

    for cap in CAPABILITIES:
        n = cap["id"].replace("CAP-", "N-CAP-")
        pn = cap["domain"].replace("DOMAIN-", "N-DOM-")
        label = cap["name"]
        reason = ""
        if cap["weak"]:
            label += " [WEAKLY GROUNDED]"
            reason = "Weakly grounded — render with flag"
        lines.append(f"| {n} | CAPABILITY | {label} | {pn} | true | {reason} |")

    lines += [
        "",
        f"### COMPONENT Nodes ({len(COMPONENTS)} nodes)",
        "",
        "| node_id | node_type | label | parent | render_eligible | reason_if_false |",
        "|---|---|---|---|---|---|",
    ]

    for comp in COMPONENTS:
        n = comp["id"].replace("COMP-", "N-COMP-")
        pn = comp["cap"].replace("CAP-", "N-CAP-")
        label = comp["name"]
        reason = ""
        if comp["weak"]:
            label += " [WEAKLY GROUNDED]"
            reason = "Weakly grounded — render with flag"
        if comp["cross"]:
            label += f" [cross-domain: {comp['cross']}]"
        lines.append(f"| {n} | COMPONENT | {label} | {pn} | true | {reason} |")

    lines += [
        "",
        "---",
        "",
        "## Link Inventory",
        "",
        "All links are derived from relationship_map.md entries, elevated to the semantic level. Links represent domain-to-domain and capability-to-capability relationships evidenced by component-level relationships.",
        "",
        "### Domain-Level Links (semantic inter-domain relationships)",
        "",
        "| link_id | source_node | target_node | link_type | relationship_map_ref | render_eligible |",
        "|---|---|---|---|---|---|",
        "| L-DOM-01 | N-DOM-01 (Edge Data Acquisition) | N-DOM-02 (Telemetry Transport) | EMITS | R-001, R-007 | true |",
        "| L-DOM-02 | N-DOM-01 (Edge Data Acquisition) | N-DOM-07 (Sensor and Security Ingestion) | CALLS | R-002, R-008 | true |",
        "| L-DOM-03 | N-DOM-02 (Telemetry Transport) | N-DOM-07 (Sensor and Security Ingestion) | BROADCASTS_TO | R-004, R-009 | true |",
        "| L-DOM-04 | N-DOM-07 (Sensor and Security Ingestion) | N-DOM-11 (Event-Driven Architecture) | EMITS | R-018, R-019 | true |",
        "| L-DOM-05 | N-DOM-03 (Fleet Core Operations) | N-DOM-11 (Event-Driven Architecture) | EMITS | R-020 | true |",
        "| L-DOM-06 | N-DOM-11 (Event-Driven Architecture) | N-DOM-08 (Real-Time Streaming) | BROADCASTS_TO | R-021 | true |",
        "| L-DOM-07 | N-DOM-11 (Event-Driven Architecture) | N-DOM-10 (Platform Infrastructure) | CALLS | R-022 | true |",
        "| L-DOM-08 | N-DOM-11 (Event-Driven Architecture) | N-DOM-03 (Fleet Core Operations) | CALLS | R-023 | true |",
        "| L-DOM-09 | N-DOM-11 (Event-Driven Architecture) | N-DOM-05 (Analytics and Intelligence) | CALLS | R-024 | true |",
        "| L-DOM-10 | N-DOM-08 (Real-Time Streaming) | N-DOM-14 (Frontend Application) | BROADCASTS_TO | R-025, R-026 | true |",
        "| L-DOM-11 | N-DOM-14 (Frontend Application) | N-DOM-09 (Access Control) | AUTHENTICATES_VIA | R-027, R-029 | true |",
        "| L-DOM-12 | N-DOM-14 (Frontend Application) | N-DOM-03 (Fleet Core Operations) | CALLS | R-028 | true |",
        "| L-DOM-13 | N-DOM-03 through N-DOM-07, N-DOM-15, N-DOM-12, N-DOM-06 | N-DOM-09 (Access Control) | AUTHENTICATES_VIA | R-013 (composite) | true |",
        "| L-DOM-14 | N-DOM-03 through N-DOM-17 (all entity modules) | N-DOM-10 (Platform Infrastructure) | PERSISTS_TO | R-014 | true |",
        "| L-DOM-15 | N-DOM-07 (Sensor Ingestion) | N-DOM-10 (Platform Infrastructure) | PERSISTS_TO | R-015, R-016 | true |",
        "| L-DOM-16 | N-DOM-12 (SaaS) | N-DOM-10 (Platform Infrastructure) | DEPENDS_ON | R-031, R-032 | true |",
        "| L-DOM-17 | N-DOM-13 (External Integration) | N-DOM-03 (Fleet Core Operations) | SERVES | R-033 | true |",
        "| L-DOM-18 | N-DOM-16 (Operational Engineering) | N-DOM-16 (self: HealthModule↔Monitoring) | EMITS/CONSUMES | R-036, R-037 | true |",
        "| L-DOM-19 | N-DOM-15 (EV) | N-DOM-01 (Edge Data Acquisition) | CALLS | R-039 [cross-domain OtaModule→SVG OTA Agent] | true |",
        "| L-DOM-20 | N-DOM-15 (EV) | N-DOM-10 (Platform Infrastructure) | PERSISTS_TO | R-040 [OtaModule→S3] | true |",
        "",
        "### Capability-Level Links (selected high-value inter-capability relationships)",
        "",
        "| link_id | source_node | target_node | link_type | relationship_map_ref | render_eligible |",
        "|---|---|---|---|---|---|",
        "| L-CAP-01 | N-CAP-01 (Vehicle Sensor Collection) | N-CAP-05 (MQTT Transport) | EMITS | R-001 | true |",
        "| L-CAP-02 | N-CAP-01 (Vehicle Sensor Collection) | N-CAP-20 (Sensor Ingestion) | CALLS | R-002 | true |",
        "| L-CAP-03 | N-CAP-02 (HASI Collection) | N-CAP-05 (MQTT Transport) | EMITS | R-007 | true |",
        "| L-CAP-04 | N-CAP-02 (HASI Collection) | N-CAP-21 (HASI Ingestion) | CALLS | R-008 | true |",
        "| L-CAP-05 | N-CAP-05 (MQTT Transport) | N-CAP-20 (Sensor Ingestion) | BROADCASTS_TO | R-004 | true |",
        "| L-CAP-06 | N-CAP-05 (MQTT Transport) | N-CAP-21 (HASI Ingestion) | BROADCASTS_TO | R-009 | true |",
        "| L-CAP-07 | N-CAP-20 (Sensor Ingestion) | N-CAP-26 (Primary Data Persistence) | PERSISTS_TO | R-015 | true |",
        "| L-CAP-08 | N-CAP-21 (HASI Ingestion) | N-CAP-26 (Primary Data Persistence) | PERSISTS_TO | R-016 | true |",
        "| L-CAP-09 | N-CAP-20 (Sensor Ingestion) | N-CAP-30 (Domain Event Bus) | EMITS | R-018 | true |",
        "| L-CAP-10 | N-CAP-21 (HASI Ingestion) | N-CAP-30 (Domain Event Bus) | EMITS | R-019 | true |",
        "| L-CAP-11 | N-CAP-09 (Alert/Notification) | N-CAP-30 (Domain Event Bus) | EMITS | R-020 | true |",
        "| L-CAP-12 | N-CAP-30 (Domain Event Bus) | N-CAP-22 (WebSocket Broadcasting) | BROADCASTS_TO | R-021 | true |",
        "| L-CAP-13 | N-CAP-30 (Domain Event Bus) | N-CAP-27 (Caching Layer) | CALLS | R-022 | true |",
        "| L-CAP-14 | N-CAP-30 (Domain Event Bus) | N-CAP-09 (Alert/Notification) | CALLS | R-023 | true |",
        "| L-CAP-15 | N-CAP-30 (Domain Event Bus) | N-CAP-15 (Compliance Intelligence) | CALLS | R-024 | true |",
        "| L-CAP-16 | N-CAP-22 (WebSocket Broadcasting) | N-CAP-35 (Operator Web App) | BROADCASTS_TO | R-025, R-026 | true |",
        "| L-CAP-17 | N-CAP-35 (Operator Web App) | N-CAP-23 (JWT Authentication) | AUTHENTICATES_VIA | R-027, R-029 | true |",
        "| L-CAP-18 | N-CAP-23 (JWT Authentication) | (all backend capabilities) | AUTHENTICATES_VIA | R-013 (composite) | true |",
        "| L-CAP-19 | N-CAP-26 (Primary Data Persistence) | N-CAP-26 (self: TimescaleDB relationship) | PERSISTS_TO | R-015 | true |",
        "| L-CAP-20 | N-CAP-31 (Multi-Tenant Provisioning) | N-CAP-26 (Primary Data Persistence) | DEPENDS_ON | R-031, R-032 | true |",
        "| L-CAP-21 | N-CAP-33 (Notification Channels) | N-CAP-09 (Alert/Notification) | SERVES | R-033 | true |",
        "| L-CAP-22 | N-CAP-34 (Enterprise Integration) | N-CAP-34 (self: IntegrationHub routing) | DEPENDS_ON | R-034, R-035 | true |",
        "| L-CAP-23 | N-CAP-39 (Observability) | N-CAP-39 (self: HealthModule↔Monitoring) | EMITS/CONSUMES | R-036, R-037 | true |",
        "| L-CAP-24 | N-CAP-38 (Device OTA) | N-CAP-04 (SVG Firmware Management) | CALLS | R-039 | true |",
        "| L-CAP-25 | N-CAP-38 (Device OTA) | N-CAP-28 (Object Storage) | PERSISTS_TO | R-040 | true |",
        "| L-CAP-26 | N-CAP-24 (Frontend Auth) | N-CAP-23 (JWT Auth) | CALLS | R-027 | true |",
        "| L-CAP-27 | N-CAP-17 (Predictive Intelligence) | N-CAP-26 (Primary Data Persistence) | PERSISTS_TO | R-014, R-015 | true |",
        "| L-CAP-28 | N-CAP-27 (Caching Layer) | N-CAP-27 (self: Redis backing) | DEPENDS_ON | R-017 | true |",
        "",
        "---",
        "",
        "## Totals",
        "",
        "| Category | Count |",
        "|---|---|",
        f"| DOMAIN nodes | {len(DOMAINS)} |",
        f"| CAPABILITY nodes | {len(CAPABILITIES)} |",
        f"| COMPONENT nodes | {len(COMPONENTS)} |",
        f"| **Total nodes** | **{len(DOMAINS) + len(CAPABILITIES) + len(COMPONENTS)}** |",
        "| Domain-level links | 20 |",
        "| Capability-level links | 28 |",
        "| **Total links** | **48** |",
        f"| Nodes render_eligible: true | {len(DOMAINS) + len(CAPABILITIES) + len(COMPONENTS)} |",
        "| Nodes render_eligible: false | 0 |",
        "| Links render_eligible: true | 48 |",
        "| Links render_eligible: false | 0 |",
        "| Nodes with WEAKLY GROUNDED flag | 4 (N-COMP-77, N-COMP-82, N-COMP-84, N-COMP-85) + 3 capabilities (N-CAP-04, N-CAP-06, N-CAP-28) |",
        "",
        "---",
        "",
        "## Manifest Integrity",
        "",
        "**manifest_integrity: COMPLETE**",
        "",
        f"All {len(DOMAINS) + len(CAPABILITIES) + len(COMPONENTS)} nodes are derived exclusively from semantic_domain_model.md ({len(DOMAINS)} domains) and capability_map.md ({len(CAPABILITIES)} capabilities, {len(COMPONENTS)} components). All 48 links are derived from relationship_map.md entries elevated to the semantic level. No node or link exists outside these grounded sources. Weakly grounded nodes are included and flagged per rendering rule RR-03.",
    ]

    return "\n".join(lines) + "\n"


def build_semantic_feedback_directives() -> str:
    lines = [
        "# Semantic Feedback Directives — BlueEdge Platform v3.23.0",
        "",
        "**artifact_id:** PIOS-41.1-OUTPUT-06",
        f"**contract:** {CONTRACT_ID}",
        "**mode:** SEMANTIC-CONSOLIDATION-STRICT",
        f"**run_reference:** {RUN_REFERENCE}",
        "**generated_from:** semantic_domain_model.md, capability_map.md, semantic_traceability_map.md, semantic_elevation_report.md",
        f"**date:** {DATE}",
        "",
        "---",
        "",
        "## Constraint",
        "",
        "This file MAY NOT alter derivation outputs or retroactively reinterpret structure. All directives are forward-looking recommendations for future derivation runs or evidence enrichment activities.",
        "",
        "---",
    ]

    for d in DIRECTIVES:
        lines += [
            "",
            f"## {d['id']} — {_directive_title(d)}",
            "",
            "| Field | Value |",
            "|---|---|",
            f"| directive_id | {d['id']} |",
            f"| type | {d['type']} |",
            f"| priority | {d['priority']} |",
            f"| affected_construct | {d['affected']} |",
            "",
            "---",
        ]

    lines += [
        "",
        "## Directive Summary",
        "",
        "| directive_id | type | priority | affected_construct |",
        "|---|---|---|---|",
    ]

    for d in DIRECTIVES:
        lines.append(f"| {d['id']} | {d['type']} | {d['priority']} | {d['affected']} |")

    high = sum(1 for d in DIRECTIVES if d["priority"] == "HIGH")
    med = sum(1 for d in DIRECTIVES if d["priority"] == "MEDIUM")
    low = sum(1 for d in DIRECTIVES if d["priority"] == "LOW")

    lines += [
        "",
        f"**Total directives: {len(DIRECTIVES)}**",
        f"- HIGH priority: {high}",
        f"- MEDIUM priority: {med}",
        f"- LOW priority: {low}",
    ]

    return "\n".join(lines) + "\n"


def _directive_title(d: dict) -> str:
    titles = {
        "SFD-01": "WEAKLY GROUNDED: Apache Kafka and Apache Flink Not Confirmed in Source",
        "SFD-02": "WEAKLY GROUNDED: S3/MinIO Object Storage Not Confirmed in Source",
        "SFD-03": "WEAKLY GROUNDED: SVG OTA Agent Source Not Found",
        "SFD-04": "AMBIGUITY: Architecture HTML Read Boundary Was First 200 Lines Only",
        "SFD-05": "AMBIGUITY: OtaModule Cross-Domain Membership",
        "SFD-06": "GAP: No Relationships Modelled for Extended Operations Modules",
        "SFD-07": "GAP: AI/ML Module Data Dependencies Not Fully Mapped",
        "SFD-08": "ENRICHMENT_REQUEST: Execution Paths EP-01b REST Fallback Not Fully Modelled",
        "SFD-09": "ENRICHMENT_REQUEST: hasi_bridge.py Evidence Boundary Was First 80 Lines Only",
        "SFD-10": "ENRICHMENT_REQUEST: Frontend Page Module Granularity",
    }
    return titles.get(d["id"], d["id"])


def build_executive_readability_map() -> str:
    lines = [
        "# Executive Readability Map — BlueEdge Platform v3.23.0",
        "",
        "**artifact_id:** PIOS-41.1-OUTPUT-07 (OPTIONAL)",
        f"**contract:** {CONTRACT_ID}",
        "**mode:** SEMANTIC-CONSOLIDATION-STRICT",
        f"**run_reference:** {RUN_REFERENCE}",
        "**generated_from:** semantic_domain_model.md, capability_map.md",
        f"**date:** {DATE}",
        "",
        "---",
        "",
        "**[EXECUTIVE VIEW — DERIVED FROM STRUCTURAL EVIDENCE]**",
        "",
        "This map translates the structural findings into plain-language descriptions. Every statement below is grounded in semantic_domain_model.md and capability_map.md. No interpretation has been added beyond what the evidence supports.",
        "",
        "---",
        "",
        "## What BlueEdge Is (Platform-Level)",
        "",
        "BlueEdge is a fleet management software platform that runs on proprietary vehicle hardware (the SVG 2.0 Smart Vehicle Gateway) and connects to a cloud-based application suite. It is built as a multi-tenant commercial service (SaaS) for fleet operators across taxi, tanker, bus, and electric vehicle contexts. The platform is hosted by Blue Edge Network LLC (Dubai) / SA (Geneva) as stated in the architecture document.",
        "",
        f"The platform has {len(COMPONENTS)} confirmed or architecture-declared components organised into {len(DOMAINS)} operational domains and {len(CAPABILITIES)} discrete functional capabilities.",
        "",
        "---",
        "",
        "## The 17 Domains in Plain Language",
        "",
        "### 1. Edge Data Acquisition",
        "What the vehicle hardware collects and transmits. The SVG 2.0 device on each vehicle runs agents that continuously read engine and environmental sensors, and separately monitor all network traffic on the vehicle for security threats. Data is sent to the cloud every few seconds.",
        "",
        "### 2. Telemetry Transport and Messaging",
        "How sensor data moves from the vehicle to the cloud. The primary channel is an MQTT message broker (EMQX) using encrypted connections. A higher-throughput stream processing layer (Kafka and Flink) is described in the architecture but was not confirmed in extracted source code — marked as uncertain.",
        "",
        "### 3. Fleet Core Operations",
        "The foundational fleet management functions: tracking vehicles, managing drivers, organising fleets, recording trips, generating alerts, scheduling maintenance, and tracking fuel. These 11 components form the minimum viable platform — nothing else works without them.",
        "",
        "### 4. Fleet Vertical Extensions",
        "Industry-specific add-ons for tanker (HAZMAT chemical safety monitoring), bus (passenger information system integration), and taxi (dispatch and metering) operators, plus cold-chain temperature monitoring, driver session tracking, and full vehicle lifecycle management.",
        "",
        "### 5. Analytics and Intelligence",
        "Fleet-wide data analysis, scheduled and on-demand reports, vehicle diagnostic event processing, regulatory compliance tracking and audit evidence, safety scoring, financial cost management, executive KPI dashboards, blockchain-based audit trails, and data product monetisation.",
        "",
        "### 6. AI/ML Intelligence Layer",
        "Six AI-powered modules that analyse telemetry data to generate actionable results: anomaly detection in vehicle data, predictive maintenance scheduling, digital twin vehicle modelling, driver fatigue and Hours-of-Service risk assessment, composite driver behaviour scoring, autonomous task execution, and road condition intelligence.",
        "",
        "### 7. Sensor and Security Ingestion (Cloud-Side)",
        "The cloud-side processing components that receive vehicle sensor readings and network security threat data from the edge. New in platform version 3.23. SensorsModule evaluates HAZMAT alert thresholds. HasiModule enriches threat data with geographic and threat intelligence context.",
        "",
        "### 8. Real-Time Streaming and Gateway",
        "The live data channel between the platform and connected operator browser windows. When a sensor threshold is breached or a security threat is detected, this domain pushes the update to every connected dashboard within milliseconds via WebSocket.",
        "",
        "### 9. Access Control and Identity",
        "Authentication and access management across the entire platform. All 63 backend modules enforce JWT token verification. The frontend manages login state. API versioning governs how the platform exposes its capabilities to external callers.",
        "",
        "### 10. Platform Infrastructure and Data",
        "The databases and caching layer underpinning all modules: PostgreSQL 15 as the primary database (60+ tables), TimescaleDB for high-volume sensor time-series data, Redis for API response caching, and S3/MinIO for file storage (architecture-declared; confirmation pending). The monorepo container is also grouped here as the platform's structural root.",
        "",
        "### 11. Event-Driven Architecture",
        "A single but architecturally central component (FleetEventsModule) that acts as the internal message bus. When any domain module generates a significant event, this component routes it simultaneously to: the real-time dashboard, the cache invalidation service, the audit log, and the notification delivery system.",
        "",
        "### 12. SaaS Platform Layer",
        "The multi-tenant commercial packaging of the platform. MultiTenantModule manages tenant isolation, billing, and role-based access. WhiteLabelModule and OnboardingModule support branded deployments.",
        "",
        "### 13. External Integration",
        "Connectors to third-party enterprise systems: ERP connectors (SAP/Oracle/dynamics), an API marketplace for ecosystem partners, and an IntegrationHub for orchestrating cross-system data flows.",
        "",
        "### 14. Frontend Application",
        "The operator-facing browser application built in React. A single-page app with 61 pages, using context-based authentication state and real-time WebSocket updates for sensor and security events.",
        "",
        "### 15. EV and Electrification",
        "Electric vehicle management capabilities: battery and charge state monitoring (EvModule), vehicle-to-grid (V2gModule), charging station management, fleet electrification planning, depot charging optimisation, and OTA firmware management for SVG devices.",
        "",
        "### 16. Operational Engineering",
        "Platform health, delivery, and quality: HealthModule exposes platform health endpoints consumed by the Monitoring Stack (Prometheus/Grafana/ELK). CI/CD Workflows, Docker Compose, and load tests form the delivery and quality infrastructure.",
        "",
        "### 17. Extended Operations and Driver Services",
        "Commercial and driver-facing capabilities not belonging to the core fleet domains: surge pricing, driver incentives, geofence automation, in-app messaging, driver mobile interface, customer portal, aftersales services, cross-border operations, permits management, parts marketplace, and fleet lifecycle management.",
        "",
        "---",
        "",
        "## The 42 Capabilities in Summary",
        "",
        "The 17 domains contain 42 capabilities — the specific functional units of the platform.",
        "",
        "**Edge Data Acquisition (4 capabilities):**",
        "- Vehicle sensor reading and cloud delivery",
        "- Network security threat collection and forwarding",
        "- Physical SVG 2.0 hardware device",
        "- On-device firmware update agent (architecture-declared; confirmation pending)",
        "",
        "**Telemetry Transport (2 capabilities):**",
        "- MQTT encrypted message delivery",
        "- High-throughput stream processing (architecture-declared; confirmation pending)",
        "",
        "**Fleet Core Operations (5 capabilities):**",
        "- Vehicle, fleet, and trip management",
        "- Driver and user account management",
        "- Alert generation and in-platform notifications",
        "- Maintenance scheduling and fuel tracking",
        "- Operational dispatch and device lifecycle management",
        "",
        "**Fleet Vertical Extensions (2 capabilities):**",
        "- Tanker, bus, and taxi industry modules",
        "- Cold-chain, session management, and vehicle lifecycle",
        "",
        "**Analytics and Intelligence (3 capabilities):**",
        "- Fleet analytics, reports, and diagnostics",
        "- Compliance, safety, and finance intelligence",
        "- Executive dashboards, blockchain audit trails, and data monetisation",
        "",
        "**AI/ML Intelligence (3 capabilities):**",
        "- Predictive maintenance, anomaly detection, digital twin",
        "- Driver fatigue detection and behaviour scoring",
        "- Autonomous AI task execution and road intelligence",
        "",
        "**Sensor and Security Ingestion (2 capabilities):**",
        "- Cloud sensor data ingestion",
        "- Cloud HASI network threat ingestion",
        "",
        "**Real-Time Streaming and Gateway (1 capability):**",
        "- WebSocket live event broadcasting to browsers",
        "",
        "**Access Control and Identity (3 capabilities):**",
        "- JWT authentication (backend)",
        "- Frontend login state management",
        "- API versioning",
        "",
        "**Platform Infrastructure and Data (4 capabilities):**",
        "- PostgreSQL and TimescaleDB persistence",
        "- Redis caching",
        "- Object storage (architecture-declared; confirmation pending)",
        "- Platform monorepo container",
        "",
        "**Event-Driven Architecture (1 capability):**",
        "- Central domain event bus (4-handler fan-out)",
        "",
        "**SaaS Platform Layer (2 capabilities):**",
        "- Multi-tenant provisioning and billing",
        "- Tenant onboarding and white-label branding",
        "",
        "**External Integration (2 capabilities):**",
        "- External notification delivery channels",
        "- ERP connectors, API marketplace, and integration hub",
        "",
        "**Frontend Application (1 capability):**",
        "- 61-page operator web application",
        "",
        "**EV and Electrification (3 capabilities):**",
        "- EV battery, V2G, and charging stations",
        "- Electrification planning and depot charging",
        "- OTA firmware deployment to vehicles",
        "",
        "**Operational Engineering (2 capabilities):**",
        "- Platform observability (health, metrics, dashboards)",
        "- CI/CD, container orchestration, and load testing",
        "",
        "**Extended Operations and Driver Services (2 capabilities):**",
        "- Commercial dispatch, geofencing, driver mobile, incentives, messaging",
        "- Customer portal, aftersales, cross-border, permits, parts, fleet lifecycle",
        "",
        "---",
        "",
        "## Evidence Confidence Note",
        "",
        "Of 89 platform components:",
        "- 84.3% are confirmed directly from source code files read during the derivation",
        "- 9.0% are derived from source code references or analysis documents",
        "- 6.7% are declared in the architecture document but not yet confirmed in extracted source code (these are marked as WEAKLY GROUNDED throughout all artifacts)",
        "",
        "The 4 weakly grounded components are: SVG OTA Agent, S3/MinIO Object Storage, Apache Kafka, and Apache Flink. Their existence in the architecture document is not disputed — they simply have not been confirmed by direct source code evidence within the current evidence boundary.",
        "",
        "---",
    ]

    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

ARTIFACTS = [
    ("semantic_domain_model.md",       build_semantic_domain_model),
    ("capability_map.md",              build_capability_map),
    ("semantic_traceability_map.md",   build_semantic_traceability_map),
    ("semantic_elevation_report.md",   build_semantic_elevation_report),
    ("pie_render_manifest.md",         build_pie_render_manifest),
    ("semantic_feedback_directives.md", build_semantic_feedback_directives),
    ("executive_readability_map.md",   build_executive_readability_map),
]


def main():
    parser = argparse.ArgumentParser(
        description="Reconstruct PIOS 41.1 semantic layer artifacts from embedded data."
    )
    parser.add_argument(
        "--output-dir",
        default="/tmp/pios_41_1_output",
        help="Output directory (default: /tmp/pios_41_1_output)",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="First safety gate for canonical path writes. Must be combined with --allow-canonical-write.",
    )
    parser.add_argument(
        "--allow-canonical-write",
        action="store_true",
        dest="allow_canonical_write",
        help="Second safety gate for canonical path writes. Requires --force.",
    )
    args = parser.parse_args()

    out_dir = Path(args.output_dir)

    # E2 + E3: Canonical path guard — detect exact match and subpaths
    canonical = Path(CANONICAL_PATH).resolve()
    resolved_out = out_dir.resolve()
    is_canonical_target = (
        resolved_out == canonical
        or str(resolved_out).startswith(str(canonical) + "/")
    )

    if is_canonical_target:
        if not (args.force and args.allow_canonical_write):
            print("ERROR: Output path targets the canonical docs/pios/41.1/ tree.")
            print("       This is a write-protected path.")
            print()
            if not args.force:
                print("       Missing: --force")
            if not args.allow_canonical_write:
                print("       Missing: --allow-canonical-write")
            print()
            print("       Canonical writes require BOTH flags explicitly provided.")
            print("       Run parity_check.py --verbose first to confirm EXACT_MATCH.")
            sys.exit(1)
        # E3: Both flags present — mandatory warning before proceeding
        print("WARNING: CANONICAL TARGET WRITE REQUESTED — PARITY MUST BE VERIFIED FIRST")
        print(f"         Target: {out_dir}")
        print("         Confirm parity_check.py returned EXACT_MATCH before continuing.")
        print()

    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {out_dir}")
    print()

    for filename, builder in ARTIFACTS:
        content = builder()
        path = out_dir / filename
        path.write_text(content, encoding="utf-8")
        lines = content.count("\n")
        print(f"  WROTE  {filename}  ({lines} lines)")

    total_nodes = len(DOMAINS) + len(CAPABILITIES) + len(COMPONENTS)
    print()
    print(f"Build complete.")
    print(f"  Domains     : {len(DOMAINS)}")
    print(f"  Capabilities: {len(CAPABILITIES)}")
    print(f"  Components  : {len(COMPONENTS)}")
    print(f"  Total nodes : {total_nodes}")
    print(f"  Directives  : {len(DIRECTIVES)}")
    print(f"  Artifacts   : {len(ARTIFACTS)} files written to {out_dir}")


if __name__ == "__main__":
    main()
