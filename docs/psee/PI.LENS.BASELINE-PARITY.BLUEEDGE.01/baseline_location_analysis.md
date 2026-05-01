# Baseline Location Analysis
## PI.LENS.BASELINE-PARITY.BLUEEDGE.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Canonical BlueEdge Baseline

**Location:** `clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/`

**Produced by:** BlueEdge-specific multi-contract orchestration (pre-generic-pipeline)
**Authority contract:** `PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.FIXUP.01`

**Confirmed present:**
```
41.x/pressure_zone_projection.json
41.x/signal_projection.json
75.x/condition_correlation_state.json
75.x/pressure_candidate_state.json
75.x/pressure_zone_state.json
binding/binding_envelope.json
vault/admissibility_log.json
vault/binding_envelope.json
vault/canonical_topology.json
vault/coverage_state.json
vault/evidence_trace.json
vault/gauge_state.json
vault/reconstruction_state.json
vault/signal_registry.json
vault/vault_manifest.json
```

**Confirmed absent (required by generic pipeline Phase 8b):**
```
intake/intake_manifest.json              → ABSENT
structure/40.2/structural_node_inventory.json → ABSENT
structure/40.3/structural_topology_log.json   → ABSENT
structure/40.4/canonical_topology.json        → ABSENT
ceu/grounding_state_v3.json             → ABSENT
dom/dom_layer.json                      → ABSENT
integration/integration_validation.json  → ABSENT
vault/vault_readiness.json              → ABSENT (new Phase 8b artifact)
```

---

## Source Manifest Paths (BlueEdge source_01)

`clients/blueedge/sources/source_01/source_manifest.json` references UUID-based paths:

| Field | Path | Exists |
|-------|------|--------|
| extracted_path | clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/intake/canonical_repo | NO |
| structure_path | clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/structure | NO |
| grounding_state_path | clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/grounding_state_v3.json | NO |
| integration_validation_path | clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/psee/runs/run_blueedge_integrated_01/integration_validation.json | NO |
| archive_path | /Users/khorrix/Projects/blueedge-clean-run/source-raw/raw/blueedge-platform-v3_23_0-COMPLETE.tar | YES (external) |

UUID client directory (`clients/6a6fcdbc-41b6-4e0e-99b9-37394f6c870d/`) contains only:
- reports/lens_validation_report.json
- reports/lens_report_run_01_blueedge_clean.html

All psee/, structure/, runs/ subdirs: ABSENT.

---

## Re-Run Assessment

**Verdict: NOT SAFE TO RE-RUN**

If pipeline executed with `--client blueedge --run-id run_be_parity_check_01`:
- Phase 1 (archive): WOULD PASS (external archive exists)
- Phase 2 (intake): WOULD FAIL — canonical_repo missing at UUID path
- Phase 3+ : NOT REACHED

Pipeline cannot advance past Phase 2 under current source_manifest configuration.
Running would produce a partial run with no vault artifacts.
No canonical mutation would occur (new run_id), but re-run is NOT a valid comparison point.

---

## Baseline Architecture Gap

The BlueEdge baseline was produced by a BlueEdge-specific multi-contract orchestration chain, not by the generic pipeline. The generic pipeline's run_dir artifact layout (intake/, structure/, ceu/, dom/, integration/, vault/) does not exist for BlueEdge. The baseline represents a different orchestration model and is not directly comparable to a generic pipeline run.
