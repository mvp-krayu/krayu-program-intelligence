# Baseline Fact Extraction
## PI.LENS.BLUEEDGE-BASELINE-RECONCILIATION.01

**Generated:** 2026-05-01
**Authoritative baseline:** `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/`
**Status:** COMPLETE

---

## CEU Layer

| Fact | Value | Source artifact |
|------|-------|-----------------|
| Total CEU | 10 | grounding_state_v3.json (`grounding_summary.total_ceu`) |
| Grounded CEU | 10 | grounding_state_v3.json (`grounding_summary.SOURCE_TRUTH`) |
| Grounding ratio | 1.0 | grounding_state_v3.json |
| Readiness gate | PASS | grounding_state_v3.json (`readiness_gate.status`) |
| Source mode | DYNAMIC | grounding_state_v3.json |
| Determinism hash | be4f2a1c… | grounding_state_v3.json |

**CEU identity (all SOURCE_TRUTH):**
CEU-01 BACKEND_SERVICE (3 evidence), CEU-02 FRONTEND_APPLICATION (3), CEU-03 DATA_LAYER (5), CEU-04 API_LAYER (5), CEU-05 AUTHENTICATION_SECURITY (5), CEU-06 CONFIGURATION_INFRA (3), CEU-07 MONITORING_OBSERVABILITY (3), CEU-08 TESTING_VALIDATION (5), CEU-09 EDGE_AGENTS (2), CEU-10 CI_CD_PIPELINE (2)

**Grounding state location:** `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/grounding_state_v3.json` — FILE EXISTS

---

## Topology

| Fact | Value | Source artifact |
|------|-------|-----------------|
| Total nodes | 35 | vault/canonical_topology.json (`counts.total_nodes`) |
| Domains | 13 | vault/canonical_topology.json (`counts.domains`) |
| Capabilities | 0 | vault/canonical_topology.json |
| Components | 35 | vault/canonical_topology.json |
| Total edges | 0 | vault/canonical_topology.json |
| Source authority | dom_path_domain_layer.json (PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01) | vault/canonical_topology.json |
| DOM file path | docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json | source_manifest.dom_layer_path |
| DOM file exists | **NO** | — filesystem check |

---

## Signals

| Signal | Label | Value | State | Zone |
|--------|-------|-------|-------|------|
| PSIG-001 | coupling_pressure | 5.663 | HIGH | PZ-001 |
| PSIG-002 | domain_coupling_pressure | 3.2098 | HIGH | PZ-001 |
| PSIG-004 | zone_coverage_concentration | 2.1822 | HIGH | PZ-001 |
| PSIG-006 | unanchored_nodes | 0 | ACTIVATED | none |

Total signals: 4 | Active pressure: 3 | Telemetry: 1

Source: `vault/signal_registry.json` (values derived from 40.3 structural topology, population size=35, RUN_RELATIVE_OUTLIER method)

---

## Gauge

| Fact | Value | Source artifact |
|------|-------|-----------------|
| Canonical score | 60 | vault/gauge_state.json |
| Projected score | 100 | vault/gauge_state.json |
| Band | CONDITIONAL | vault/gauge_state.json |
| Derivation | 0 (completion) + 35 (coverage) + 25 (reconstruction) = 60 | gauge_state.json |
| Execution status | NOT_EVALUATED | gauge_state.json |
| Execution layer evaluated | False | gauge_state.json |
| DIM-01 required / admissible | 10 / 10 | gauge_state.json |
| DIM-02 state | PASS | gauge_state.json |
| DIM-02 validated units | 10 | gauge_state.json |

---

## Pressure Zones

| Fact | Value | Source artifact |
|------|-------|-----------------|
| Active zones | 1 | vault/signal_registry.json, 75.x/pressure_zone_state.json |
| Zone ID | PZ-001 | pressure_zone_state.json |
| Zone class | COMPOUND_ZONE | pressure_zone_state.json |
| Zone type | DOMAIN_ZONE | pressure_zone_state.json |
| Anchor | DOM-04 (backend_app_root) | pressure_zone_state.json |
| Node count in zone | 15 | pressure_zone_state.json |
| Conditions | 3 (PSIG-001, PSIG-002, PSIG-004) | pressure_zone_state.json |
| Class rule applied | condition_count >= 3 | pressure_zone_state.json |
| Non-pressure zones | 6 | binding/binding_envelope.json |

---

## Conditions

| Condition | Signal | State |
|-----------|--------|-------|
| COND-PSIG-001-01 | PSIG-001 | HIGH |
| COND-PSIG-002-01 | PSIG-002 | HIGH |
| COND-PSIG-004-01 | PSIG-004 | HIGH |
| COND-PSIG-006-01 | PSIG-006 | ACTIVATED |

Total: 4 | Active signal conditions: 3 | Telemetry: 1

Note: Baseline condition IDs remapped from BlueEdge native COND-XX namespace to FastAPI COND-PSIG-XXX-XX namespace (documented in `condition_correlation_state.json.id_mapping_rule`).

---

## Binding Envelope

| Fact | Value |
|------|-------|
| Contract | PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01 |
| Artifact | binding_envelope_fastapi_compatible |
| Block | BLOCK_C |
| Schema | Pre-generic (bindings / domain_telemetry / pressure_zone_designations) |
| Bindings | 4 (PSIG-001, PSIG-002, PSIG-004, PSIG-006) |
| DOM groups | 13 (domain_telemetry) |
| Pressure zones | 1 |
| Non-pressure zones | 6 |
| Binding basis | PATH_EVIDENCE_ONLY |

---

## Integration Validation (UUID run)

| Fact | Value | Location |
|------|-------|----------|
| Status | PASS | run_blueedge_integrated_01/integration_validation.json |
| Total checks | 9 | — |
| Passed | 9 | — |
| Failed | 0 | — |

Check IDs: IV-01 ceu_registry_grounded, IV-02 grounding_ratio_equals_1, IV-03 condition_correlation_complete, IV-04 pressure_zone_topology_valid, IV-05 ceu_node_map_complete, IV-06 ceu_zone_map_complete, IV-07 signal_projection_ceu_grounded, IV-08 bc_001_resolved, IV-09 no_upstream_mutation

---

## Decision State

| Fact | Value | Location |
|------|-------|----------|
| Decision category | INVESTIGATE | run_blueedge_integrated_01/decision_state.json |
| Active flags | 4 | decision_state.json |
| Resolved flags | 2 | decision_state.json |
| Vault readiness (at time of baseline) | NOT_READY (3 blockers) | decision_state.json |
| Pipeline stage | PIOS_40.7_DECISION_STATE | decision_state.json |

Note: decision_state.json exists at UUID run path only. Not produced by generic pipeline.

---

## Reconstruction

| Fact | Value |
|------|-------|
| State | PASS |
| Validated units | 10 |
| Total units | 10 |

Source: `vault/reconstruction_state.json`

---

## Missing Source Artifacts (blocking generic pipeline)

| Artifact | Source manifest key | Path | Exists |
|----------|---------------------|------|--------|
| canonical_repo | extracted_path | clients/6a6fcdbc…/psee/intake/canonical_repo | **NO** |
| 40.x structure | structure_path | clients/6a6fcdbc…/psee/structure | **NO** |
| dom_layer | dom_layer_path | docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json | **NO** |
| fastapi_conformance | fastapi_conformance_path | docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed | **NO** |
| grounding_state_v3 | grounding_state_path | clients/6a6fcdbc…/psee/runs/run_blueedge_integrated_01/grounding_state_v3.json | **YES** |
| integration_validation | integration_validation_path | clients/6a6fcdbc…/psee/runs/run_blueedge_integrated_01/integration_validation.json | **YES** |
