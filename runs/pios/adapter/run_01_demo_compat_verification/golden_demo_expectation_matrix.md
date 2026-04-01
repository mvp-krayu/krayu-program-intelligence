# Golden Demo Expectation Matrix

**run_id:** run_01_demo_compat_verification
**date:** 2026-04-01
**source:** docs/pios/41.4/signal_registry.json + docs/pios/41.4/evidence_mapping_index.json
**purpose:** Defines the expected demo-facing field values for each of the 5 demo signals,
derived from the canonical 41.4 Golden Demo expectation artifacts.

---

## Signal Set Expectation

| Field | Expected |
|---|---|
| Total demo signals | 5 |
| Signal IDs | SIG-001, SIG-002, SIG-003, SIG-004, SIG-005 |
| Source | docs/pios/41.4/signal_registry.json (5 signals declared) |

---

## SIG-001 — Sensor Bridge Throughput Ceiling

| Field | Expected Value | Source |
|---|---|---|
| signal_id | SIG-001 | 41.4 registry |
| title | Sensor Bridge Throughput Ceiling: Configuration Confirmed, Runtime Unknown | 41.4 registry |
| evidence_confidence | STRONG | 41.4 registry |
| domain_id | DOMAIN-01 | 41.4 registry |
| domain_name | Edge Data Acquisition | 41.4 registry |
| capability_id | CAP-02 | 41.4 registry |
| capability_name | Network Security Intelligence Collection | 41.4 registry |
| component_ids | ["COMP-74", "COMP-75"] | 41.4 registry |
| component_names | ["hasi_bridge.py", "HASI v1.0.0"] | 41.4 registry |
| evidence.source_object_id | INTEL-001 | 41.4 evidence_mapping_index |
| evidence.source_layer | 40.7 | 41.4 evidence_mapping_index |
| evidence.source_file | intelligence_output_set.md | 41.4 evidence_mapping_index |
| evidence.supporting_objects count | 3 | 41.4 evidence_mapping_index |
| evidence.blocking_point | null | 41.4 evidence_mapping_index |
| evidence.temporal_reference | TMP-009 (30s config-defined) | 41.4 evidence_mapping_index |
| Core INTEL source | INTEL-006 (COND-006 cross-reference) | adapter contract |
| Expected synthesis_state | blocked | Core engine (INTEL-006 blocked) |
| Expected relevance | LOW | adapter A6 (blocked→LOW) |

---

## SIG-002 — Platform Runtime State

| Field | Expected Value | Source |
|---|---|---|
| signal_id | SIG-002 | 41.4 registry |
| title | Platform Runtime State: Seven Core Dimensions Are Currently Unknown | 41.4 registry |
| evidence_confidence | STRONG | 41.4 registry |
| domain_id | DOMAIN-10 | 41.4 registry |
| domain_name | Platform Infrastructure and Data | 41.4 registry |
| capability_id | CAP-27 | 41.4 registry |
| capability_name | Caching Layer | 41.4 registry |
| component_ids | ["COMP-64", "COMP-81", "COMP-65", "COMP-27"] | 41.4 registry |
| evidence.source_object_id | INTEL-002 | 41.4 evidence_mapping_index |
| evidence.source_layer | 40.7 | 41.4 evidence_mapping_index |
| evidence.source_file | intelligence_output_set.md | 41.4 evidence_mapping_index |
| evidence.supporting_objects count | 7 | 41.4 evidence_mapping_index |
| evidence.blocking_point | INF-003 Prometheus scrape not available; WebSocket fleet:* rooms not active; ... | 41.4 evidence_mapping_index |
| Core INTEL source | null (aggregate — blocked INTEL-005, INTEL-006) | adapter A9 |
| Expected synthesis_state | synthesized | adapter A9 (blocked INTELs exist → unknown space declared) |
| Expected relevance | HIGH | adapter A9 (blocked INTELs → HIGH) |

---

## SIG-003 — Dependency Load

| Field | Expected Value | Source |
|---|---|---|
| signal_id | SIG-003 | 41.4 registry |
| title | Dependency Load: 68% of Architectural Relationships Are Dependency Edges | 41.4 registry |
| evidence_confidence | MODERATE | 41.4 registry |
| domain_id | DOMAIN-11 | 41.4 registry |
| domain_name | Event-Driven Architecture | 41.4 registry |
| capability_id | CAP-30 | 41.4 registry |
| capability_name | Domain Event Bus | 41.4 registry |
| component_ids | ["COMP-65"] | 41.4 registry |
| component_names | ["FleetEventsModule"] | 41.4 registry |
| evidence.source_object_id | COND-001 | 41.4 evidence_mapping_index |
| evidence.source_layer | 40.6 | 41.4 evidence_mapping_index |
| evidence.source_file | condition_output_set.md | 41.4 evidence_mapping_index |
| evidence.supporting_objects count | 2 | 41.4 evidence_mapping_index |
| evidence.blocking_point | Stream 75.1 threshold definition required for full condition activation; signal values fully computed | 41.4 evidence_mapping_index |
| evidence.temporal_reference | static (no temporal dependency on runtime events) | 41.4 evidence_mapping_index |
| Core INTEL source | INTEL-001 (COND-001 cross-reference) | adapter contract |
| Expected synthesis_state | synthesized | Core engine (INTEL-001 synthesized) |
| Expected relevance | HIGH | adapter A6 (synthesized→HIGH) |

---

## SIG-004 — Structural Volatility

| Field | Expected Value | Source |
|---|---|---|
| signal_id | SIG-004 | 41.4 registry |
| title | Structural Volatility: Edge-to-Node Density Exceeds Unity | 41.4 registry |
| evidence_confidence | MODERATE | 41.4 registry |
| domain_id | DOMAIN-10 | 41.4 registry |
| domain_name | Platform Infrastructure and Data | 41.4 registry |
| capability_id | CAP-29 | 41.4 registry |
| capability_name | Platform Monorepo Container | 41.4 registry |
| component_ids | ["COMP-01"] | 41.4 registry |
| component_names | ["blueedge-platform (Monorepo)"] | 41.4 registry |
| evidence.source_object_id | COND-002 | 41.4 evidence_mapping_index |
| evidence.source_layer | 40.6 | 41.4 evidence_mapping_index |
| evidence.source_file | condition_output_set.md | 41.4 evidence_mapping_index |
| evidence.supporting_objects count | 2 | 41.4 evidence_mapping_index |
| evidence.blocking_point | Stream 75.1 threshold definition required for full condition activation; all four ratio values fully computed | 41.4 evidence_mapping_index |
| evidence.temporal_reference | static (no temporal dependency on runtime events) | 41.4 evidence_mapping_index |
| Core INTEL source | INTEL-002 (COND-002 cross-reference) | adapter contract |
| Expected synthesis_state | synthesized | Core engine (INTEL-002 synthesized) |
| Expected relevance | HIGH | adapter A6 (synthesized→HIGH) |

---

## SIG-005 — Coordination Pressure

| Field | Expected Value | Source |
|---|---|---|
| signal_id | SIG-005 | 41.4 registry |
| title | Coordination Pressure: Static Interface Sharing at 87.5%; Runtime State Unresolved | 41.4 registry |
| evidence_confidence | WEAK | 41.4 registry |
| domain_id | DOMAIN-16 | 41.4 registry |
| domain_name | Operational Engineering | 41.4 registry |
| capability_id | CAP-40 | 41.4 registry |
| capability_name | Delivery and Quality Infrastructure | 41.4 registry |
| component_ids | ["COMP-88", "COMP-89"] | 41.4 registry |
| component_names | ["CI/CD Workflows", "Docker Compose Orchestration"] | 41.4 registry |
| evidence.source_object_id | COND-003 | 41.4 evidence_mapping_index |
| evidence.source_layer | 40.6 | 41.4 evidence_mapping_index |
| evidence.source_file | condition_output_set.md | 41.4 evidence_mapping_index |
| evidence.supporting_objects count | 2 | 41.4 evidence_mapping_index |
| evidence.blocking_point | AT-005 (active pipeline runs, event-based) and AT-007 (validation gate count per run, event-based) require live pipeline execution; not available in static analysis context | 41.4 evidence_mapping_index |
| evidence.temporal_reference | static + event-based (partial: static component only) | 41.4 evidence_mapping_index |
| Core INTEL source | INTEL-003 (COND-003 cross-reference) | adapter contract |
| Expected synthesis_state | partial | Core engine (INTEL-003 partial) |
| Expected relevance | MEDIUM | adapter A6 (partial→MEDIUM) |

---

## Namespace Conflict Declaration

The 41.4 evidence_mapping_index records `source_object_id: "INTEL-001"` for Demo SIG-001.
This references the 41.x-context INTEL-001 (hasi_bridge signal, DIAG-006/COND-006/SIG-006).
In the Core engine v0.1 namespace, INTEL-001 = Dependency Load Elevation (COND-001).

**Resolution:** The adapter uses COND cross-reference (COND-006 → INTEL-006) for synthesis_state
derivation. The 41.4 evidence field `source_object_id: "INTEL-001"` is carried verbatim (rule A8)
as a demo-facing display field. The `core_intel_id: "INTEL-006"` traceability field records the
Core engine identifier separately. The two namespaces do not conflict in the demo-facing output.

**Expected containment:** evidence.source_object_id = "INTEL-001" (demo namespace)
                         core_intel_id = "INTEL-006" (Core engine namespace)
                         No leakage between namespaces.
