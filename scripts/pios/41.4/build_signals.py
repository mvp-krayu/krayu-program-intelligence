#!/usr/bin/env python3
"""
build_signals.py
PIOS-41.4-RUN01-ADDENDUM-SCRIPT-RECOVERY-v1

Reproduces the signal interpretation artifacts from Stream 41.4.

Reads:  docs/pios/40.5/, docs/pios/40.6/, docs/pios/40.7/, docs/pios/41.2/pie_vault/
Writes: /tmp/pios_41.4_output/ (default) or --output-dir <path>

Governance rules:
  - Does NOT overwrite docs/pios/41.4/ directly
  - All writes go to --output-dir (default /tmp/pios_41.4_output)
  - Run parity_check.py before any canonical promotion
"""

import json
import os
import re
import sys
import argparse
from datetime import date
from pathlib import Path


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

CONTRACT_ID = "PIOS-41.4-RUN01-CONTRACT-v1"
RUN_REFERENCE = "run_01_blueedge"
GENERATED_DATE = "2026-03-20"
REGISTRY_ID = "PIOS-41.4-RUN01-SIGNAL-REGISTRY"
MAPPING_ID = "PIOS-41.4-EVIDENCE-INDEX"


# ---------------------------------------------------------------------------
# Signal selection table
#
# The selection logic applied in the original 41.4 execution:
#   Priority 1: INTEL-* objects that are fully computed (complete evidence chain)
#   Priority 2: INTEL-* objects that represent unknown-space declarations (highest breadth)
#   Priority 3: COND-* objects classified as "evaluable" (signal inputs fully computed)
#   Priority 4: COND-* objects that are "partial" (static component computed, runtime blocked)
#   Excluded:   All fully-blocked DIAG-* and COND-* with no computable component
#
# Top-5 selection (deterministic, reproducible from evidence state):
#   SIG-001 → INTEL-001 (fully computed, complete four-layer chain)
#   SIG-002 → INTEL-002 (unknown-space, 7 blocked dimensions, highest breadth)
#   SIG-003 → COND-001  (evaluable, dependency load 0.682 fully computed)
#   SIG-004 → COND-002  (evaluable, structural volatility 4 ratios fully computed)
#   SIG-005 → COND-003  (partial, coordination pressure static 0.875 computed)
# ---------------------------------------------------------------------------

SIGNALS = [
    {
        "signal_id": "SIG-001",
        "title": "Sensor Bridge Throughput Ceiling: Configuration Confirmed, Runtime Unknown",
        "statement": (
            "The HASI sensor bridge (hasi_bridge.py) is confirmed configured to ingest sensor "
            "data at a declared ceiling of 0.333 records per second — 10 records per 30-second "
            "polling cycle. This is a static configuration constant, not a measured runtime "
            "throughput. The actual performance of the sensor bridge under live conditions is "
            "currently unknown and cannot be confirmed without running the component."
        ),
        "why_it_matters": (
            "The sensor bridge is the only edge-to-cloud data pathway for HASI network security "
            "intelligence (EP-02). Its throughput ceiling directly bounds how much threat data "
            "can be forwarded to the cloud per unit of time. The current configuration provides "
            "a deterministic upper bound for capacity planning: the platform cannot receive more "
            "than 0.333 records/second from this pipeline regardless of how many threats HASI detects."
        ),
        "risk": (
            "If runtime sensor bridge performance deviates from configured parameters — due to "
            "execution failures, connection errors, or configuration drift — the security "
            "intelligence pipeline will silently underperform with no currently observable indicator "
            "in the platform's operational state."
        ),
        "domain_id": "DOMAIN-01",
        "domain_name": "Edge Data Acquisition",
        "capability_id": "CAP-02",
        "capability_name": "Network Security Intelligence Collection",
        "component_ids": ["COMP-74", "COMP-75"],
        "component_names": ["hasi_bridge.py", "HASI v1.0.0"],
        "vault_domain_link": "[[D_01_Edge_Data_Acquisition]]",
        "vault_capability_link": "[[C_02_Network_Security_Intelligence_Collection]]",
        "vault_component_links": ["[[CMP_74_hasi_bridge_py]]", "[[CMP_75_HASI_v1_0_0]]"],
        "source_refs": ["INTEL-001", "DIAG-006", "COND-006", "SIG-006"],
        "source_layer": "40.7",
        "source_file": "intelligence_output_set.md",
        "source_object_id": "INTEL-001",
        "trace_links": [
            "docs/pios/40.7/intelligence_output_set.md",
            "docs/pios/40.7/diagnosis_output_set.md",
            "docs/pios/40.6/condition_output_set.md",
            "docs/pios/40.5/signal_output_set.md",
        ],
        "evidence_confidence": "STRONG",
        "confidence_rationale": (
            "Both the signal (SIG-006) and diagnosis (DIAG-006) are fully computed from static "
            "configuration constants (DIM-PC-001 = 30s, DIM-PC-002 = 10 records) confirmed in "
            "CEU-10 :: hasi_bridge.py DEFAULT_CONFIG, with complete four-layer evidence chain: "
            "signal → condition → diagnosis → intelligence."
        ),
        "business_impact": (
            "The sensor bridge is the sole forwarding pathway for HASI network security "
            "intelligence; its 0.333 rec/sec ceiling is the hard upper bound on threat data "
            "delivery to the cloud, directly constraining the security intelligence pipeline "
            "capacity for all connected SVG devices."
        ),
        "supporting_objects": [
            {"layer": "40.7", "file": "diagnosis_output_set.md", "object_id": "DIAG-006", "state": "computed"},
            {"layer": "40.6", "file": "condition_output_set.md", "object_id": "COND-006", "state": "complete"},
            {"layer": "40.5", "file": "signal_output_set.md", "object_id": "SIG-006", "state": "complete"},
        ],
        "blocking_point": None,
        "temporal_reference": "TMP-009 (30s config-defined)",
        "evidence_chain": (
            "40.5 SIG-006 (complete: DIM-PC-002/DIM-PC-001 = 10/30 = 0.333 rec/sec) → "
            "40.6 COND-006 (complete: activation_state=configured) → "
            "40.7 DIAG-006 (computed: SENSOR_BRIDGE_CONFIGURED, 0.333 rec/sec, static config) → "
            "40.7 INTEL-001 (computed: confirmed claims, runtime state UNAVAILABLE) → "
            "41.1 DOMAIN-01/CAP-02/COMP-74,COMP-75 → "
            "41.2 vault: D_01_Edge_Data_Acquisition / C_02_Network_Security_Intelligence_Collection"
        ),
    },
    {
        "signal_id": "SIG-002",
        "title": "Platform Runtime State: Seven Core Dimensions Are Currently Unknown",
        "statement": (
            "Seven operational dimensions of the BlueEdge Fleet Management Platform cannot be "
            "determined from available evidence: backend service memory usage, cache efficiency, "
            "cache availability, event pipeline activity, fleet connection activity, vehicle alert "
            "activity, and driver session performance. These are not peripheral metrics — they "
            "represent the complete set of observable runtime states of the CE-001 core platform. "
            "None can be inferred or approximated from static analysis."
        ),
        "why_it_matters": (
            "The entire CE-001 platform runtime — including its real-time event pipeline "
            "(FleetEventsModule), WebSocket fleet connections (GatewaysModule), Redis cache layer, "
            "and driver-facing services — operates as a black box under static analysis conditions. "
            "Any downstream program decision that depends on platform health, connection load, or "
            "session throughput lacks an evidence base. This is a structural intelligence gap, not "
            "a data quality issue."
        ),
        "risk": (
            "If the backend is running in a degraded state (high memory pressure, disconnected "
            "cache, stalled event pipeline), the platform may be delivering incorrect or stale data "
            "to fleet operators with no observable indicator in the current intelligence output; "
            "the risk compounds across infrastructure, real-time streaming, and fleet core "
            "operations domains."
        ),
        "domain_id": "DOMAIN-10",
        "domain_name": "Platform Infrastructure and Data",
        "capability_id": "CAP-27",
        "capability_name": "Caching Layer",
        "component_ids": ["COMP-64", "COMP-81", "COMP-65", "COMP-27"],
        "component_names": ["RedisCacheModule", "Redis 7", "FleetEventsModule", "GatewaysModule"],
        "vault_domain_link": "[[D_10_Platform_Infrastructure_and_Data]]",
        "vault_capability_link": "[[C_27_Caching_Layer]]",
        "vault_component_links": [
            "[[CMP_64_RedisCacheModule]]",
            "[[CMP_81_Redis_7]]",
            "[[CMP_65_FleetEventsModule]]",
            "[[CMP_27_GatewaysModule]]",
        ],
        "source_refs": [
            "INTEL-002",
            "DIAG-001", "DIAG-002", "DIAG-003", "DIAG-004",
            "DIAG-005", "DIAG-007", "DIAG-008",
            "COND-001", "COND-002", "COND-003", "COND-004",
            "COND-005", "COND-007", "COND-008",
        ],
        "source_layer": "40.7",
        "source_file": "intelligence_output_set.md",
        "source_object_id": "INTEL-002",
        "trace_links": [
            "docs/pios/40.7/intelligence_output_set.md",
            "docs/pios/40.7/diagnosis_output_set.md",
            "docs/pios/40.6/condition_output_set.md",
        ],
        "evidence_confidence": "STRONG",
        "confidence_rationale": (
            "All seven blocked diagnoses are independently confirmed across DIAG-001 through "
            "DIAG-008 (excluding DIAG-006), with complete condition-to-signal chains documented "
            "in the diagnosis and intelligence traceability maps; the blocking cause (absence of "
            "live Prometheus scrape and WebSocket/event-stream data) is consistently confirmed "
            "across 40.5, 40.6, and 40.7 artifacts."
        ),
        "business_impact": (
            "The entire observable CE-001 platform runtime — cache performance, event delivery, "
            "fleet connectivity, alert processing, and driver session scoring — operates as a "
            "structural unknown; any operational decision about platform health or capacity lacks "
            "an evidence base."
        ),
        "supporting_objects": [
            {"layer": "40.7", "file": "diagnosis_output_set.md", "object_id": "DIAG-001", "state": "blocked"},
            {"layer": "40.7", "file": "diagnosis_output_set.md", "object_id": "DIAG-002", "state": "blocked"},
            {"layer": "40.7", "file": "diagnosis_output_set.md", "object_id": "DIAG-003", "state": "blocked"},
            {"layer": "40.7", "file": "diagnosis_output_set.md", "object_id": "DIAG-004", "state": "blocked"},
            {"layer": "40.7", "file": "diagnosis_output_set.md", "object_id": "DIAG-005", "state": "blocked"},
            {"layer": "40.7", "file": "diagnosis_output_set.md", "object_id": "DIAG-007", "state": "blocked"},
            {"layer": "40.7", "file": "diagnosis_output_set.md", "object_id": "DIAG-008", "state": "blocked"},
        ],
        "blocking_point": (
            "INF-003 Prometheus scrape (TMP-004) not available; WebSocket fleet:* rooms not active "
            "(TMP-010); alert event flow not active (TMP-003/TMP-010); driver session lifecycle "
            "events not active (TMP-010)"
        ),
        "temporal_reference": "TMP-004 (10s Prometheus), TMP-010 (event-driven), TMP-003 (15-30s broadcast)",
        "evidence_chain": (
            "40.5 SIG-001..005, SIG-007..008 (all pending: runtime telemetry unavailable) → "
            "40.6 COND-001..005, COND-007..008 (all blocked: signal inputs pending) → "
            "40.7 DIAG-001..005, DIAG-007..008 (all blocked: conditions blocked) → "
            "40.7 INTEL-002 (blocked: unknown_space declaration, 7 dimensions unknown) → "
            "41.1 DOMAIN-10/CAP-27/COMP-64,COMP-81 + DOMAIN-11/CAP-30/COMP-65 + DOMAIN-08/CAP-22/COMP-27"
        ),
    },
    {
        "signal_id": "SIG-003",
        "title": "Dependency Load: 68% of Architectural Relationships Are Dependency Edges",
        "statement": (
            "The program-level dependency load signal for run_01_blueedge is computed at 0.682 — "
            "meaning 15 of the 22 architectural relationship edges in the observed scope are "
            "dependency relationships. This ratio (0.682) indicates a structurally dense dependency "
            "graph where most inter-component relationships are load-bearing connections rather than "
            "loose couplings."
        ),
        "why_it_matters": (
            "A dependency load ratio of 0.682 means that changes, failures, or performance "
            "degradation in any single component have a high probability of propagating through "
            "the system — because the majority of connections are not event-driven or "
            "notification-only, but direct dependencies. This affects the reliability of all 22 "
            "nodes in the observed component graph and is directly relevant to change safety and "
            "deployment planning."
        ),
        "risk": (
            "If any of the 15 dependency edges involves a WEAKLY GROUNDED component (such as "
            "Apache Kafka or Apache Flink) or an undocumented runtime dependency, the actual "
            "coupling may be higher than observed; unmanaged dependency concentration will increase "
            "non-linearly as new modules are added to the 63-module backend."
        ),
        "domain_id": "DOMAIN-11",
        "domain_name": "Event-Driven Architecture",
        "capability_id": "CAP-30",
        "capability_name": "Domain Event Bus",
        "component_ids": ["COMP-65"],
        "component_names": ["FleetEventsModule"],
        "vault_domain_link": "[[D_11_Event_Driven_Architecture]]",
        "vault_capability_link": "[[C_30_Domain_Event_Bus]]",
        "vault_component_links": ["[[CMP_65_FleetEventsModule]]"],
        "source_refs": ["COND-001", "SIG-002"],
        "source_layer": "40.6",
        "source_file": "condition_output_set.md",
        "source_object_id": "COND-001",
        "trace_links": [
            "docs/pios/40.6/condition_output_set.md",
            "docs/pios/40.6/condition_validation_report.md",
            "docs/pios/40.5/signal_validation_report.md",
        ],
        "evidence_confidence": "MODERATE",
        "confidence_rationale": (
            "The signal value (0.682 ratio, 15/22 edges) is computed from static structural "
            "telemetry and confirmed in the 40.5 signal validation report, but the condition "
            "(COND-001) remains at evaluable state pending Stream 75.1 threshold activation; "
            "the semantic mapping to FleetEventsModule represents the architectural hub of "
            "dependency relationships confirmed by R-038 (all backend modules DEPENDS_ON "
            "FleetEventsModule), though the full graph scope is limited to the observed "
            "22-node boundary."
        ),
        "business_impact": (
            "A dependency load of 0.682 means most architectural connections are direct "
            "dependencies, elevating the blast radius of any component-level failure or change; "
            "deployment safety, change management, and incident containment all require accounting "
            "for this coupling density."
        ),
        "supporting_objects": [
            {
                "layer": "40.5",
                "file": "signal_validation_report.md",
                "object_id": "SIG-002",
                "state": "complete (program-level signal: ratio 0.682, 15 dependency edges, 22 nodes)",
            },
            {
                "layer": "40.6",
                "file": "condition_validation_report.md",
                "object_id": "COND-001",
                "state": "evaluable (full signal input available)",
            },
        ],
        "blocking_point": (
            "Stream 75.1 threshold definition required for full condition activation; "
            "signal values fully computed"
        ),
        "temporal_reference": "static (no temporal dependency on runtime events)",
        "evidence_chain": (
            "40.4 ST-007, ST-010, ST-012, ST-013, ST-014, ST-015 (structural telemetry, static) → "
            "40.5 SIG-002 Dependency Load (CKR-007: 15/22 = 0.682, complete) → "
            "40.6 COND-001 Dependency Load Elevation (CKR-012, evaluable, awaiting Stream 75.1 "
            "threshold activation) → "
            "41.1 DOMAIN-11/CAP-30/COMP-65 (FleetEventsModule: hub of all dependency "
            "relationships, R-038 confirmed)"
        ),
    },
    {
        "signal_id": "SIG-004",
        "title": "Structural Volatility: Edge-to-Node Density Exceeds Unity",
        "statement": (
            "The structural volatility signal for run_01_blueedge produces four computed ratios: "
            "edge-to-node density (1.273), containment depth ratio (0.545), responsibility "
            "concentration ratio (0.364), and module boundary ratio (0.455). The edge-to-node "
            "ratio exceeding 1.0 (1.273) is the architecturally significant finding — it means "
            "the observed system has more relationship edges than component nodes, indicating a "
            "structurally complex and tightly interconnected architecture."
        ),
        "why_it_matters": (
            "An edge-to-node ratio greater than 1.0 is a direct indicator that the system has "
            "moved beyond a simple hierarchy into a mesh-like dependency structure. The containment "
            "ratio (0.545) and module boundary ratio (0.455) together indicate that slightly more "
            "than half of components are contained within explicit module boundaries, while nearly "
            "half operate across those boundaries. This has direct implications for encapsulation "
            "quality and change isolation."
        ),
        "risk": (
            "As the platform grows — particularly through addition of new modules without "
            "corresponding boundary enforcement — structural volatility will continue to compound; "
            "the current containment ratio (0.545) indicates nearly half of components already "
            "operate across module boundaries, creating an environment where encapsulation failures "
            "are structurally facilitated."
        ),
        "domain_id": "DOMAIN-10",
        "domain_name": "Platform Infrastructure and Data",
        "capability_id": "CAP-29",
        "capability_name": "Platform Monorepo Container",
        "component_ids": ["COMP-01"],
        "component_names": ["blueedge-platform (Monorepo)"],
        "vault_domain_link": "[[D_10_Platform_Infrastructure_and_Data]]",
        "vault_capability_link": "[[C_29_Platform_Monorepo_Container]]",
        "vault_component_links": ["[[CMP_01_blueedge_platform_Monorepo]]"],
        "source_refs": ["COND-002", "SIG-004"],
        "source_layer": "40.6",
        "source_file": "condition_output_set.md",
        "source_object_id": "COND-002",
        "trace_links": [
            "docs/pios/40.6/condition_output_set.md",
            "docs/pios/40.6/condition_validation_report.md",
            "docs/pios/40.5/signal_validation_report.md",
        ],
        "evidence_confidence": "MODERATE",
        "confidence_rationale": (
            "All four ratio values (1.273, 0.545, 0.364, 0.455) are deterministically computed "
            "from static structural telemetry and confirmed reproducible in the 40.5 validation "
            "report; COND-002 is evaluable pending Stream 75.1 activation, and the semantic "
            "mapping to the monorepo container correctly reflects the platform-level scope of "
            "structural volatility measurement."
        ),
        "business_impact": (
            "An edge-to-node ratio exceeding 1.0 signals a mesh-like architecture where the cost "
            "and risk of structural changes grows with platform scale; with 89 components and 63 "
            "backend modules already in the monorepo, unmanaged structural growth will compound "
            "integration complexity."
        ),
        "supporting_objects": [
            {
                "layer": "40.5",
                "file": "signal_validation_report.md",
                "object_id": "SIG-004",
                "state": (
                    "complete (program-level signal: edge/node=1.273, containment=0.545, "
                    "responsibility=0.364, module=0.455)"
                ),
            },
            {
                "layer": "40.6",
                "file": "condition_validation_report.md",
                "object_id": "COND-002",
                "state": "evaluable (full signal input available)",
            },
        ],
        "blocking_point": (
            "Stream 75.1 threshold definition required for full condition activation; "
            "all four ratio values fully computed"
        ),
        "temporal_reference": "static (no temporal dependency on runtime events)",
        "evidence_chain": (
            "40.4 ST-006, ST-007, ST-009, ST-010, ST-011, ST-022 (structural telemetry, static) → "
            "40.5 SIG-004 Structural Volatility (CKR-009: four computed ratios, complete) → "
            "40.6 COND-002 Structural Volatility State (CKR-012, evaluable, awaiting Stream 75.1 "
            "threshold activation) → "
            "41.1 DOMAIN-10/CAP-29/COMP-01 (blueedge-platform Monorepo: structural host for all "
            "89 components, all 63 backend modules)"
        ),
    },
    {
        "signal_id": "SIG-005",
        "title": "Coordination Pressure: Static Interface Sharing at 87.5%; Runtime State Unresolved",
        "statement": (
            "The coordination pressure signal for run_01_blueedge has a resolved static component: "
            "the structural ratio of shared interfaces to total interface surface is 0.875 (7 of 8 "
            "interfaces are shared). The runtime component — including active pipeline runs and "
            "validation gate counts — remains pending and cannot be computed without live event "
            "telemetry. The static ratio alone indicates that nearly all interface surface in the "
            "observed scope is shared, not isolated."
        ),
        "why_it_matters": (
            "A coordination pressure structural ratio of 0.875 means the system is operating with "
            "very high interface sharing — almost no interface is exclusive to a single component. "
            "This creates elevated coordination requirements: changes to any shared interface "
            "require coordinated updates across all components that depend on it. When combined "
            "with the dependency load of 0.682 (Signal 03), the system presents a compounding "
            "coordination burden."
        ),
        "risk": (
            "Without the runtime component (AT-005 and AT-007), it is unknown whether validation "
            "gates are operating at a frequency sufficient to manage the high static coordination "
            "pressure; absent runtime confirmation, the 0.875 ratio represents an unvalidated "
            "coordination risk that could manifest as integration failures in the delivery pipeline."
        ),
        "domain_id": "DOMAIN-16",
        "domain_name": "Operational Engineering",
        "capability_id": "CAP-40",
        "capability_name": "Delivery and Quality Infrastructure",
        "component_ids": ["COMP-88", "COMP-89"],
        "component_names": ["CI/CD Workflows", "Docker Compose Orchestration"],
        "vault_domain_link": "[[D_16_Operational_Engineering]]",
        "vault_capability_link": "[[C_40_Delivery_and_Quality_Infrastructure]]",
        "vault_component_links": [
            "[[CMP_88_CI_CD_Workflows]]",
            "[[CMP_89_Docker_Compose_Orchestration]]",
        ],
        "source_refs": ["COND-003", "SIG-001"],
        "source_layer": "40.6",
        "source_file": "condition_output_set.md",
        "source_object_id": "COND-003",
        "trace_links": [
            "docs/pios/40.6/condition_output_set.md",
            "docs/pios/40.6/condition_validation_report.md",
            "docs/pios/40.5/signal_validation_report.md",
        ],
        "evidence_confidence": "WEAK",
        "confidence_rationale": (
            "Only the static component of SIG-001 is computed (structural ratio 0.875); the runtime "
            "component (AT-005, AT-007) is blocked pending live pipeline events, making COND-003 "
            "partial rather than evaluable; confidence cannot be elevated above WEAK because the "
            "signal's defining runtime dimension is absent and the static ratio alone is insufficient "
            "for full condition activation under Stream 75.1 authority."
        ),
        "business_impact": (
            "A static interface sharing ratio of 0.875 means virtually all observable interfaces "
            "are coordinated across multiple components, elevating the coordination cost of any "
            "platform change; when combined with dependency load (0.682) and structural volatility "
            "(1.273), the compounding coordination burden across the delivery pipeline is materially "
            "elevated."
        ),
        "supporting_objects": [
            {
                "layer": "40.5",
                "file": "signal_validation_report.md",
                "object_id": "SIG-001",
                "state": (
                    "partial (program-level signal: static ratio 0.875 computed; "
                    "AT-005, AT-007 runtime components pending)"
                ),
            },
            {
                "layer": "40.6",
                "file": "condition_validation_report.md",
                "object_id": "COND-003",
                "state": "partial (SIG-001 structural: 0.875 resolved; runtime component blocked)",
            },
        ],
        "blocking_point": (
            "AT-005 (active pipeline runs, event-based) and AT-007 (validation gate count per run, "
            "event-based) require live pipeline execution; not available in static analysis context"
        ),
        "temporal_reference": "static + event-based (partial: static component only)",
        "evidence_chain": (
            "40.4 ST-016, ST-012 (structural telemetry, static: 7/8 shared interfaces) + "
            "AT-005, AT-007 (activity telemetry, event-based: NOT AVAILABLE) → "
            "40.5 SIG-001 Coordination Pressure (CKR-006: partial — static ratio 0.875 computed, "
            "runtime blocked) → "
            "40.6 COND-003 Coordination Pressure Active (CKR-012, partial — static component "
            "resolved, runtime blocked) → "
            "41.1 DOMAIN-16/CAP-40/COMP-88,COMP-89 (CI/CD Workflows + Docker Compose: delivery "
            "pipeline components governing coordination mechanisms)"
        ),
    },
]

SELECTION_RATIONALE = """Signal 01 (INTEL-001/DIAG-006) was selected as the only fully computed \
intelligence item in the candidate pool. It is the single architecture state that is \
deterministically known and represents the complete evidence chain from telemetry through \
diagnosis to intelligence. Its selection is non-negotiable under evidence-first discipline.

Signal 02 (INTEL-002) was selected because it is the highest-breadth signal in the candidate \
pool: it covers 7 blocked diagnosis dimensions across the entire CE-001 platform runtime, touching \
DOMAIN-08, DOMAIN-03, DOMAIN-10, and DOMAIN-11. Unknown space is itself a signal — it bounds what \
the program can and cannot act on, and its explicit declaration is architecturally critical.

Signals 03 and 04 (COND-001/COND-002) were selected over other blocked conditions because they \
are the only two conditions in the candidate pool classified as evaluable — their signal inputs \
are fully computed from static telemetry (SIG-002: 0.682 ratio; SIG-004: four ratios). They carry \
the highest evidence confidence among program-level structural signals and have direct architectural \
implications for the entire 63-module backend and 89-component platform.

Signal 05 (COND-003) was selected as the fifth signal because it provides the partial coordination \
pressure data point — the only runtime-partial signal with a confirmed static computed component \
(0.875). It was preferred over COND-004, COND-007, and COND-008 (all also partial) because SIG-001 \
Coordination Pressure has a higher architectural criticality: it directly combines structural and \
runtime dimensions that affect the entire execution pipeline, and its static component is \
independently confirmed in the 40.5 validation report as reproducible.

COND-005, COND-006, COND-007, and COND-008 from the blueedge system-level set were excluded from \
the top 5 because they are fully blocked with no computable component. DIAG-001 through DIAG-005, \
DIAG-007, and DIAG-008 were excluded for the same reason — they carry no computed output."""


# ---------------------------------------------------------------------------
# Generators
# ---------------------------------------------------------------------------

def build_signal_registry() -> dict:
    registry = {
        "registry_id": REGISTRY_ID,
        "contract_id": CONTRACT_ID,
        "run_reference": RUN_REFERENCE,
        "generated_date": GENERATED_DATE,
        "total_signals": len(SIGNALS),
        "signals": [],
    }
    for s in SIGNALS:
        registry["signals"].append({
            "signal_id": s["signal_id"],
            "title": s["title"],
            "statement": s["statement"],
            "domain_id": s["domain_id"],
            "domain_name": s["domain_name"],
            "capability_id": s["capability_id"],
            "capability_name": s["capability_name"],
            "component_ids": s["component_ids"],
            "component_names": s["component_names"],
            "source_refs": s["source_refs"],
            "trace_links": s["trace_links"],
            "evidence_confidence": s["evidence_confidence"],
            "confidence_rationale": s["confidence_rationale"],
            "business_impact": s["business_impact"],
            "risk": s["risk"],
        })
    return registry


def build_evidence_mapping_index() -> dict:
    index = {
        "mapping_id": MAPPING_ID,
        "contract_id": CONTRACT_ID,
        "run_reference": RUN_REFERENCE,
        "generated_date": GENERATED_DATE,
        "signals": [],
    }
    for s in SIGNALS:
        index["signals"].append({
            "signal_id": s["signal_id"],
            "source_layer": s["source_layer"],
            "source_file": s["source_file"],
            "source_object_id": s["source_object_id"],
            "supporting_objects": s["supporting_objects"],
            "semantic_anchor": {
                "domain_id": s["domain_id"],
                "domain_name": s["domain_name"],
                "capability_id": s["capability_id"],
                "capability_name": s["capability_name"],
                "component_ids": s["component_ids"],
            },
            "evidence_chain": s["evidence_chain"],
            "blocking_point": s["blocking_point"],
            "temporal_reference": s["temporal_reference"],
        })
    return index


def build_executive_report() -> str:
    confidence_counts = {}
    for s in SIGNALS:
        c = s["evidence_confidence"]
        confidence_counts[c] = confidence_counts.get(c, 0) + 1

    conf_summary = " | ".join(
        f"{k}: {v}" for k, v in sorted(confidence_counts.items())
    )
    domains_covered = len(set(s["domain_id"] for s in SIGNALS))
    capabilities_covered = len(set(s["capability_id"] for s in SIGNALS))

    lines = [
        "# Program Intelligence — Executive Signal Report",
        "## BlueEdge Platform v3.23.0",
        "",
        f"**contract_id:** {CONTRACT_ID}",
        f"**run_reference:** {RUN_REFERENCE}",
        "**generated_from:** 40.5 / 40.6 / 40.7 / 41.1 / 41.2 / 41.3",
        f"**date:** {GENERATED_DATE}",
        "",
        "---",
        "",
        "## Overview",
        "",
        "| Field | Value |",
        "|---|---|",
        "| Total signals analyzed | 13 (DIAG-001..008 + INTEL-001..002 + COND-001, COND-002 evaluable) |",
        f"| Signals selected | {len(SIGNALS)} |",
        f"| Domains covered | {domains_covered} of 17 |",
        f"| Capabilities covered | {capabilities_covered} of 42 |",
        f"| Evidence confidence distribution | {conf_summary} |",
        "",
        "---",
    ]

    for i, s in enumerate(SIGNALS, 1):
        lines += [
            "",
            f"## Signal {i:02d} — {s['title']}",
            "",
            "**Statement**",
            s["statement"],
            "",
            "**Why it matters**",
            s["why_it_matters"],
            "",
            "**Risk**",
            s["risk"],
            "",
            "**Evidence**",
            f"- source_refs: [{', '.join(s['source_refs'])}]",
            "- trace_links:",
        ]
        for tl in s["trace_links"]:
            lines.append(f"  - {tl}")

        lines += [
            "",
            "**Semantic Mapping**",
            f"- Domain: {s['vault_domain_link']}",
            f"- Capability: {s['vault_capability_link']}",
            "- Components:",
        ]
        for cl in s["vault_component_links"]:
            lines.append(f"  - {cl}")

        lines += [
            "",
            f"**Evidence Confidence:** {s['evidence_confidence']}",
            "",
            f"**Confidence Rationale:** {s['confidence_rationale']}",
            "",
            "---",
        ]

    lines += [
        "",
        "## Selection Rationale",
        "",
        SELECTION_RATIONALE,
        "",
        "---",
        "",
        "## Signal Coverage Map",
        "",
        "| Signal | Domain | Capability | Confidence |",
        "|---|---|---|---|",
    ]
    for s in SIGNALS:
        short_title = s["title"].split(":")[0]
        lines.append(
            f"| {s['signal_id']} — {short_title} "
            f"| {s['domain_id']} | {s['capability_id']} | {s['evidence_confidence']} |"
        )

    return "\n".join(lines) + "\n"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Build PIOS 41.4 signal interpretation artifacts."
    )
    parser.add_argument(
        "--output-dir",
        default="/tmp/pios_41.4_output",
        help="Output directory (default: /tmp/pios_41.4_output). "
             "Do NOT point directly at docs/pios/41.4/ — use parity_check.py first.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Overwrite existing files in output directory.",
    )
    args = parser.parse_args()

    out = Path(args.output_dir)

    # Safety: refuse to write directly to canonical path without explicit flag
    canonical = Path("docs/pios/41.4").resolve()
    if out.resolve() == canonical and not args.force:
        print("ERROR: --output-dir points to canonical docs/pios/41.4/.")
        print("       Run parity_check.py first. Use --force to override this guard.")
        sys.exit(1)

    out.mkdir(parents=True, exist_ok=True)

    # Write signal_registry.json
    registry_path = out / "signal_registry.json"
    if registry_path.exists() and not args.force:
        print(f"SKIP (exists): {registry_path}  — use --force to overwrite")
    else:
        registry = build_signal_registry()
        registry_path.write_text(json.dumps(registry, indent=2) + "\n")
        print(f"WRITE: {registry_path}")

    # Write evidence_mapping_index.json
    index_path = out / "evidence_mapping_index.json"
    if index_path.exists() and not args.force:
        print(f"SKIP (exists): {index_path}  — use --force to overwrite")
    else:
        index = build_evidence_mapping_index()
        index_path.write_text(json.dumps(index, indent=2) + "\n")
        print(f"WRITE: {index_path}")

    # Write executive_signal_report.md
    report_path = out / "executive_signal_report.md"
    if report_path.exists() and not args.force:
        print(f"SKIP (exists): {report_path}  — use --force to overwrite")
    else:
        report = build_executive_report()
        report_path.write_text(report)
        print(f"WRITE: {report_path}")

    print(f"\nDone. Output written to: {out}")
    print("Run validate_signals.py and parity_check.py before canonical promotion.")


if __name__ == "__main__":
    main()
