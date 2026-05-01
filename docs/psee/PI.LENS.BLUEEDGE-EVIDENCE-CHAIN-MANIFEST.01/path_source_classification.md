# Path Source Classification
## PI.LENS.BLUEEDGE-EVIDENCE-CHAIN-MANIFEST.01

**Generated:** 2026-05-01

All 33 artifact paths classified by source origin.

---

## NAMED_RUN
Artifacts in `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/`

| Path | Present |
|------|---------|
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/41.x/signal_projection.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/41.x/pressure_zone_projection.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/75.x/condition_correlation_state.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/75.x/pressure_candidate_state.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/75.x/pressure_zone_state.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/binding/binding_envelope.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/canonical_topology.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/gauge_state.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/coverage_state.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/reconstruction_state.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/signal_registry.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/binding_envelope.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/admissibility_log.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/evidence_trace.json | YES |
| clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/vault/vault_manifest.json | YES |

**Count: 15 — all PRESENT**

---

## UUID_RUN
Artifacts in `clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/`

| Path | Present |
|------|---------|
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/grounding_state_v3.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/ceu_registry_dynamic.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/ceu_node_map.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/ceu_zone_map.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/condition_correlation_state.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/pressure_zone_state.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/signal_projection.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/pressure_zone_projection.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/integration_validation.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/decision_state.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/pipeline_execution_trace.json | YES |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/execution_report.md | YES |

**Count: 12 — all PRESENT**

---

## SOURCE_MANIFEST (paths declared in source_manifest.json — may be absent)

| Path | Key | Present |
|------|-----|---------|
| /Users/khorrix/Projects/blueedge-clean-run/source-raw/raw/blueedge-platform-v3_23_0-COMPLETE.tar | archive_path | YES (external) |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo | extracted_path | **NO** |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/structure | structure_path | **NO** |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/ceu_grounding | ceu_grounding_path | **NO** |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/grounding_state_v3.json | grounding_state_path | YES (also UUID_RUN) |
| clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/integration_validation.json | integration_validation_path | YES (also UUID_RUN) |

**Count: 6 entries — 3 present (1 external, 2 UUID_RUN), 3 absent**

---

## DOCS_PSEE (paths in docs/psee/ explicitly referenced in source_manifest)

| Path | Key | Present |
|------|-----|---------|
| docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.RECOMPUTE-FROM-EVIDENCE.01/recomputed/dom_path_domain_layer.json | dom_layer_path | **NO** |
| docs/psee/PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01/recomputed | fastapi_conformance_path | **NO** |

**Count: 2 — both ABSENT**

---

## Presence Summary

| Source | Total | Present | Absent |
|--------|-------|---------|--------|
| NAMED_RUN | 15 | 15 | 0 |
| UUID_RUN | 12 | 12 | 0 |
| SOURCE_MANIFEST (excl. overlaps) | 4 | 1 (external) | 3 |
| DOCS_PSEE | 2 | 0 | 2 |
| **Total unique** | **33** | **24** | **7** |

Note: `grounding_state_v3.json` and `integration_validation.json` appear in both UUID_RUN and SOURCE_MANIFEST — they are counted once under UUID_RUN in the unique count.
