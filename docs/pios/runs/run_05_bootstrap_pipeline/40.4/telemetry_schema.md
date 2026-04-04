# Telemetry Schema
run_id: run_05_bootstrap_pipeline
stream: Stream 40.4 — PiOS Telemetry Extraction Layer
contract: PIOS-40.4-RUN01-IG3-BOOTSTRAP
upstream_contract: PIOS-40.3-RUN02-IG3-BOOTSTRAP
version: v3.23.0
date: 2026-04-04
regeneration_context: IG.3 bootstrap pipeline run from source-v3.23 evidence; baseline anchor pios-core-v0.4-final; branch work/ig-foundation; github.mode=ENABLED; jira.mode=CAPSULE; launched via bootstrap_launcher.sh
input: docs/pios/runs/run_05_bootstrap_pipeline/40.3/reconstruction/ (full corpus), docs/pios/runs/run_05_bootstrap_pipeline/40.4/telemetry_surface_definition.md
evidence_references_via: docs/pios/runs/run_05_bootstrap_pipeline/40.2/normalized_evidence_map.md, docs/pios/runs/run_05_bootstrap_pipeline/40.2/evidence_surface_inventory.md

---

## Schema Rule

This schema governs the structure of every telemetry metric produced in this stream. All metrics in structural_telemetry.md, activity_telemetry.md, and delivery_telemetry.md must conform to this schema.

Every metric must carry all required fields. No metric is valid without temporal classification or evidence reference.

---

## 1. Metric Record Schema

| Field | Type | Required | Allowed Values / Format |
|---|---|---|---|
| Metric ID | string | yes | Format: `{dimension_prefix}-{sequential_number}` (e.g., ST-001, AT-001, DT-001) |
| Metric Name | string | yes | Human-readable descriptive name |
| Dimension | enum | yes | `structural` \| `activity` \| `delivery` |
| Temporal Classification | enum | yes | `static` \| `event-based` \| `time-series` |
| Unit | string | yes | Observable unit of measurement (e.g., count, boolean, enumeration, duration) |
| Surface | string | yes | TSD surface ID (from telemetry_surface_definition.md) |
| Structural Element | string | yes | Entity ID, Node ID, Edge ID, or structural reference from 40.3 corpus |
| Evidence Reference | string | yes | Pointer to 40.2 normalized_evidence_map.md section or evidence_surface_inventory.md |
| Description | string | yes | Definition of what is measured; no interpretation, no diagnosis, no scoring |

---

## 2. Dimension Definitions

| Dimension | Prefix | Definition | Governing Source |
|---|---|---|---|
| Structural | ST | Measurements of static structure: composition, topology, edges, counts, zone assignments | capability_map.md CAP-03; normalized_evidence_map.md §2.5 |
| Activity | AT | Measurements of engineering activity events and distributions: trigger events, execution events, actor events | capability_map.md CAP-03; normalized_evidence_map.md §2.5 |
| Delivery | DT | Measurements of output delivery: artifact delivery counts, delivery paths, delivery latency where observable | capability_map.md CAP-03; normalized_evidence_map.md §2.5 |

---

## 3. Temporal Classification Definitions

| Classification | Definition | Applicable Evidence |
|---|---|---|
| static | Value does not change unless the structural definition changes; measured once per reconstruction run | Repository file counts, node counts, edge counts, zone counts, layer counts, stage counts |
| event-based | Value is measured at the occurrence of a discrete event; not continuous | Pipeline execution events, automation trigger events, artifact delivery events, CI/CD invocation events |
| time-series | Value accumulates or changes across successive time intervals; requires ordered observation over time | Automation trigger frequency, commit frequency, push-to-delivery latency, stream file change count |

---

## 4. Evidence Reference Format

All evidence references must point to one of the following authorized source types:

| Source Type | Format | Example |
|---|---|---|
| Normalized evidence section | `normalized_evidence_map.md §{section}` | `normalized_evidence_map.md §2.5` |
| Evidence surface inventory | `evidence_surface_inventory.md {section}` | `evidence_surface_inventory.md Summary` |
| 40.3 reconstruction artifact | `{artifact_name}.md {section}` | `capability_map.md CAP-03` |
| Structural traceability entry | `structural_traceability_map.md {row reference}` | `structural_traceability_map.md §Modules` |

---

## 5. Exclusion Rules

The following are explicitly excluded from all telemetry metrics in this stream:

| Excluded Type | Rule |
|---|---|
| Signal computation | No signal values or signal computations in any metric |
| Scores and indices | No ESI, RAG, or derived index values |
| Condition assessments | No condition classifications |
| Diagnosis outputs | No diagnostic interpretations |
| Narrative text | No explanatory interpretation in metric definitions |
| Heuristic enrichment | No metric value may be derived by heuristic; only explicit evidence |
| Non-traceable values | No metric without an explicit evidence reference |
| Unclassified metrics | No metric without a temporal classification |

---

## 6. Schema Validation Rules

A metric record is valid if and only if:

1. All required fields are populated
2. Temporal classification is exactly one of: `static`, `event-based`, `time-series`
3. Dimension is exactly one of: `structural`, `activity`, `delivery`
4. Structural Element maps to an entity in the 40.3 corpus (entity_catalog.md, program_execution_graph.md, capability_map.md, or repository_topology.md)
5. Evidence Reference points to a declared source in 40.2 intake artifacts
6. Description contains no interpretation, diagnosis, scoring, or narrative

---

## 7. Metric ID Registry (Cross-Reference)

| Metric ID Range | Dimension | Artifact |
|---|---|---|
| ST-001 through ST-022 | Structural | structural_telemetry.md |
| AT-001 through AT-010 | Activity | activity_telemetry.md |
| DT-001 through DT-008 | Delivery | delivery_telemetry.md |

**Total metrics defined: 40**
