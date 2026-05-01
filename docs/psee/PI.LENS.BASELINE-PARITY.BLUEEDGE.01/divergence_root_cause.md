# Divergence Root Cause
## PI.LENS.BASELINE-PARITY.BLUEEDGE.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Primary Divergence: Orchestration Architecture Mismatch

The BlueEdge canonical baseline was produced by a **BlueEdge-specific** orchestration model. The generic pipeline (`run_client_pipeline.py`) implements a **generic-client** orchestration model. These are architecturally different.

---

## Specific Divergence Points

### DV-01: Run-Dir Artifact Layout

**Generic pipeline** expects all client artifacts under `run_dir`:
```
clients/<client>/psee/runs/<run_id>/
├── intake/intake_manifest.json
├── structure/40.2/structural_node_inventory.json
├── structure/40.3/structural_topology_log.json
├── structure/40.4/canonical_topology.json
├── ceu/grounding_state_v3.json
├── dom/dom_layer.json
├── binding/binding_envelope.json
├── integration/integration_validation.json
└── vault/vault_readiness.json  ← new Phase 8b artifact
```

**BlueEdge baseline** layout:
```
clients/blueedge/psee/runs/run_be_orchestrated_fixup_01/
├── 41.x/
├── 75.x/
├── binding/binding_envelope.json  ← pre-generic schema
└── vault/                         ← no vault_readiness.json
```

Structural artifacts exist at UUID path (absent), not in run_dir.

---

### DV-02: Binding Envelope Schema

| Property | BlueEdge Baseline | Generic Pipeline |
|----------|------------------|-----------------|
| Contract | PI.BLUEEDGE.FASTAPI-CONFORMANCE.SIGNAL-RECOMPUTE-AND-BINDING.01 | PI.LENS.MULTI-CLIENT.PIPELINE-ORCHESTRATOR.E2E.BLUEEDGE.01 |
| Schema fields | bindings, domain_telemetry, pressure_zone_designations | nodes, edges, capability_surfaces |
| Produced by | Manual pre-computation (STAGE_NOT_AUTOMATED) | Phase 5 generic orchestrator |
| Compatible | NO | — |

---

### DV-03: Source Manifest UUID-Path Gap

BlueEdge source_manifest.json references UUID-based paths for pre-pipeline artifacts. All UUID paths are absent in the repository. This is not a Phase 8b issue — it is a precondition gap that blocks the generic pipeline at Phase 2.

**Root cause classification:** ARTIFACT_ABSENCE — UUID client directory was populated in a prior session and is not present in current repository state.

---

### DV-04: Phase 8b — Expected Change

The Phase 8b redefinition (report generation → vault readiness) is an expected architectural change. It does not cause regression for BlueEdge. The BlueEdge baseline predates Phase 8b in both the old form (report generation) and the new form (vault readiness). No vault_readiness.json exists in baseline — this is expected.

**Root cause classification:** EXPECTED_CHANGE — not a defect, not drift.

---

### DV-05: Integration Validation Not Generated for BlueEdge

No `integration_validation.json` exists for BlueEdge. The integration validation generator (PI.LENS.INTEGRATION-VALIDATION.GENERATOR.01) was validated only for FastAPI. BlueEdge has no `integration_validation_path` in its source_manifest.

**Root cause classification:** MISSING_GENERATOR_EXECUTION — onboarding gap.

---

## Summary Classification

| Divergence | Type | Severity | Fix Required |
|-----------|------|----------|-------------|
| DV-01: Run-dir layout | ARCHITECTURE_GAP | HIGH | BlueEdge onboarding contract |
| DV-02: Binding schema | SCHEMA_INCOMPATIBILITY | HIGH | BlueEdge Phase 5 migration |
| DV-03: UUID path absence | ARTIFACT_ABSENCE | BLOCKING | Re-populate UUID client dir OR update source_manifest |
| DV-04: Phase 8b change | EXPECTED_CHANGE | NONE | No fix needed |
| DV-05: Integration validation | MISSING_GENERATOR | MEDIUM | Run integration_validation_generator.py for BlueEdge |
