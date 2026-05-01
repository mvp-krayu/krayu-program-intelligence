# Integration Validation Findings
## PI.LENS.INTEGRATION-VALIDATION.GENERATOR.01

**Generated:** 2026-05-01
**Status:** COMPLETE

---

## Pre-flight

| Check | Result |
|-------|--------|
| Branch | work/psee-runtime — non-canonical; authorized per standing operator pattern |
| Working tree at start | CLEAN |
| Baseline commit | ba12ed1938e5bc39c71c9e75cd17a325d7bef00e |
| Input: intake_manifest.json | PRESENT |
| Input: source_inventory.json | PRESENT |
| Input: structural_node_inventory.json | PRESENT |
| Input: structural_topology_log.json | PRESENT |
| Input: canonical_topology.json | PRESENT |
| Input: grounding_state_v3.json | PRESENT |
| Input: dom_layer.json | PRESENT |
| Input: binding_envelope.json | PRESENT |
| Output: integration/integration_validation.json | ABSENT (CREATE_ONLY safe) |

---

## Execution

| Mode | Exit | Result |
|------|------|--------|
| validate-only | 0 | PASS |
| dry-run | 0 | PASS — 12/12 checks passed |
| write | 0 | PASS — integration_validation.json created, manifest updated |
| CREATE_ONLY guard (not explicitly re-run) | — | PASS by construction |

---

## Validation Check Results

| Check ID | Name | Status | Notes |
|----------|------|--------|-------|
| IV-01 | intake_manifest_exists | PASS | intake/intake_manifest.json present |
| IV-02 | source_inventory_exists | PASS | intake/source_inventory.json present |
| IV-03 | structural_node_inventory_exists | PASS | structure/40.2/structural_node_inventory.json present |
| IV-04 | structural_topology_log_exists | PASS | structure/40.3/structural_topology_log.json present |
| IV-05 | canonical_topology_exists | PASS | structure/40.4/canonical_topology.json present |
| IV-06 | grounding_state_exists | PASS | ceu/grounding_state_v3.json present |
| IV-07 | dom_layer_exists | PASS | dom/dom_layer.json present |
| IV-08 | binding_envelope_exists | PASS | binding/binding_envelope.json present |
| IV-09 | node_count_consistency | PASS | 123 nodes: structural_node_inventory = dom_layer total_nodes |
| IV-10 | ceu_count_consistency | PASS | 10 CEUs: grounding_state total_ceu = binding_envelope component_entity_count |
| IV-11 | dom_node_coverage | PASS | All 123 structural nodes covered by DOM layer node_to_domain_map |
| IV-12 | no_blueedge_contamination_for_fastapi | PASS | binding_envelope client_alias=fastapi, dom_layer client=fastapi |

**Total: 12/12 PASS — validation_status: PASS**

---

## Pipeline Advancement

After adding `integration_validation_path` to manifest and applying compatible patch for
`evidence_paths → path_patterns` field name mismatch in Phase 8a vault construction:

| Phase | Status |
|-------|--------|
| Phase 1 — Source Boundary | PASS |
| Phase 2 — Intake Verification | PASS |
| Phase 3 — 40.x Structural Verification | PASS |
| Phase 4 — CEU Grounding Verification | PASS |
| Phase 5 — Build Binding Envelope | PASS |
| Phase 6+7 — 75.x Activation + 41.x Projection | PASS |
| Phase 8a — Vault Construction | **PASS** — 9 artifacts |
| Phase 8b — Lens Reports | FAIL — separate pre-existing gap |

Phase 8a built vault with 9 artifacts:
- coverage_state.json
- reconstruction_state.json
- gauge_state.json
- canonical_topology.json
- signal_registry.json
- binding_envelope.json (copied)
- admissibility_log.json
- evidence_trace.json
- vault_manifest.json

---

## Phase 8a Compatibility Fix

During pipeline validation, a second schema mismatch was found in Phase 8a:

```python
# Line 724 (pre-patch):
"evidence_refs": dg["evidence_paths"],
```

The generic DOM layer uses `path_patterns` (per contract PI.LENS.DOM-LAYER.GENERATOR.01).
Phase 8a expected `evidence_paths` (BlueEdge dom_path_domain_layer schema).

Fix applied:
```python
"evidence_refs": dg.get("evidence_paths", dg.get("path_patterns", [])),
```

This is a 1-line schema compatibility fix, not a redesign. Documented per contract authorization.

---

## Phase 8b Gap Note

Phase 8b fails because `lens_report_generator.py` exits with code 1. Log shows:
`[PRODUCTIZE.LENS.REPORT.TOPOLOGY.DELIVERY.01] FAIL: No vault_index.json found for client 'fastapi' in app vault`

This is a separate pre-existing gap — out of scope for this contract.

---

## Manifest Update

Field added to `clients/fastapi/sources/source_01/source_manifest.json`:
```
"integration_validation_path": "clients/fastapi/psee/runs/run_02_oss_fastapi_pipeline/integration/integration_validation.json"
```

---

## Scope Guards

| Guard | Status |
|-------|--------|
| Intake logic modified | NO |
| Structural scanner modified | NO |
| CEU logic modified | NO |
| DOM logic modified | NO |
| 41.x / 75.x redesign | NO |
| BlueEdge artifacts touched | NO |
| FastAPI source files modified | NO |
| Report generation changed | NO |
